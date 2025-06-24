import config from './config.js';

// Utility Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validatePhone(phone) {
    const re = /^\d{10,11}$/;
    return re.test(phone.replace(/[-\s]/g, ''));
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    } else {
        alert(message);
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    } else {
        alert(message);
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    console.log('Login attempt started');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    try {
        const response = await fetch(config.endpoints.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.message || 'Login failed');
            return;
        }

        console.log('Login successful');
        
        // Clear previous cart for new session
        localStorage.removeItem('cart');
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        // Handle pending cart item
        const pendingItem = localStorage.getItem('pendingCartItem');
        if (pendingItem) {
            try {
                const item = JSON.parse(pendingItem);
                // Add to cart via API
                await addToCartAPI(item);
                localStorage.removeItem('pendingCartItem');
            } catch (error) {
                console.error('Error processing pending cart item:', error);
            }
        }

        // Redirect based on user role
        if (data.user.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            const returnUrl = localStorage.getItem('returnToUrl') || 'projectcode.html';
            localStorage.removeItem('returnToUrl');
            window.location.href = returnUrl;
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Network error. Please try again.');
    }
}

// Handle Signup
async function handleSignup(event) {
    event.preventDefault();
    console.log('Signup attempt started');
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;

    // Basic validation
    if (!name || !email || !password || !phone || !address) {
        showError('Please fill in all required fields');
        return;
    }

    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (!validatePassword(password)) {
        showError('Password must be at least 6 characters long');
        return;
    }

    if (!validatePhone(phone)) {
        showError('Please enter a valid phone number (10-11 digits)');
        return;
    }

    if (!gender) {
        showError('Please select your gender');
        return;
    }

    try {
        const response = await fetch(config.endpoints.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                phone,
                address,
                gender
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.message || 'Registration failed');
            return;
        }

        showSuccess('Registration successful! Please login.');
        window.location.href = 'LOGIN.HTML';
    } catch (error) {
        console.error('Signup error:', error);
        showError('Network error. Please try again.');
    }
}

// Helper function to add item to cart via API
async function addToCartAPI(item) {
    try {
        const token = localStorage.getItem('token');
        if (!token) return; // No token, can't add to cart

        const response = await fetch(config.endpoints.cart + '/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                menuItemId: item.id,
                quantity: item.quantity || 1
            })
        });

        if (!response.ok) {
            throw new Error('Failed to add item to cart');
        }

        return await response.json();
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

// Add event listeners when the document loads
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
}

if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = 'LOGIN.HTML';
}); 