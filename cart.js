import config from './config.js';

// Add item to cart
export async function addToCart(item) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'LOGIN.HTML';
        return;
    }
    try {
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
        await response.json();
        updateCartIcon();
        showNotification('Item added to cart');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Failed to add item to cart');
    }
}

// Get cart from backend
export async function getCart() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const response = await fetch(config.endpoints.cart, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching cart:', error);
        return null;
    }
}

// Update cart icon with item count
export async function updateCartIcon() {
    const cart = await getCart();
    const cartCount = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
    const cartIcon = document.getElementById('cart-count');
    if (cartIcon) {
        cartIcon.textContent = cartCount;
        cartIcon.style.display = cartCount > 0 ? 'block' : 'none';
    }
}

// Update cart item quantity
export async function updateCartItemQuantity(itemId, quantity) {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
        const response = await fetch(`${config.endpoints.cart}/update/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity })
        });
        if (!response.ok) {
            throw new Error('Failed to update cart item');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating cart item:', error);
        return false;
    }
}

// Remove item from cart
export async function removeCartItem(itemId) {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
        const response = await fetch(`${config.endpoints.cart}/remove/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to remove cart item');
        }
        return await response.json();
    } catch (error) {
        console.error('Error removing cart item:', error);
        return false;
    }
}

// Clear cart
export async function clearCart() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
        const response = await fetch(`${config.endpoints.cart}/clear`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to clear cart');
        }
        return await response.json();
    } catch (error) {
        console.error('Error clearing cart:', error);
        return false;
    }
}

// Submit order to backend
export async function submitOrder(orderData) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(config.endpoints.orders, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        if (!response.ok) {
            throw new Error('Failed to submit order');
        }
        // Clear cart after successful order
        await clearCart();
        updateCartIcon();
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Show notification
export function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartIcon();
}); 