import config from './config.js';
import { getCart, clearCart, showNotification } from './cart.js';

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'LOGIN.HTML';
        return false;
    }
    return true;
}

// Populate user data from localStorage
function populateUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('name').value = currentUser.name || '';
        document.getElementById('phone').value = currentUser.phone || '';
        document.getElementById('address').value = currentUser.address || '';
    }
}

// Display cart summary
async function displayCartSummary() {
    const cart = await getCart();
    const summaryContainer = document.getElementById('order-summary-items');
    const totalElement = document.getElementById('summary-total');
    if (!cart || !summaryContainer || !totalElement) return;

    summaryContainer.innerHTML = '';
    let subtotal = 0;
    cart.items.forEach(item => {
        const itemTotal = item.menuItem.price * item.quantity;
        subtotal += itemTotal;
        summaryContainer.innerHTML += `<li class="list-group-item d-flex justify-content-between"><span>${item.menuItem.name} x ${item.quantity}</span> <span>₨ ${itemTotal}</span></li>`;
    });

    const deliveryFee = 100;
    const total = subtotal + deliveryFee;
    totalElement.textContent = `₨ ${total}`;
}

// Handle form submission
async function handleCheckout(event) {
    event.preventDefault();
    if (!checkAuth()) return;

    const cart = await getCart();
    if (!cart || cart.items.length === 0) {
        showNotification('Your cart is empty.');
        return;
    }

    const paymentMethodMap = {
        cash: "Cash on Delivery",
        card: "Credit/Debit Card",
        easypaisa: "EasyPaisa"
    };

    const orderData = {
        items: cart.items.map(item => ({
            menuItem: item.menuItem._id,
            name: item.menuItem.name,
            price: item.menuItem.price,
            quantity: item.quantity
        })),
        totalAmount: cart.totalAmount + 100, // + delivery fee
        deliveryAddress: document.getElementById('address').value,
        contactNumber: document.getElementById('phone').value,
        paymentMethod: paymentMethodMap[document.querySelector('input[name="payment"]:checked').value],
        specialInstructions: document.getElementById('instructions').value
    };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(config.endpoints.orders, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(orderData)
        });

        // Clear cart and login info regardless of response
        await clearCart();
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        showNotification('Order has been placed');
        setTimeout(() => {
            window.location.href = 'LOGIN.HTML';
        }, 2000);
    } catch (error) {
        // Still clear cart and login info on error
        await clearCart();
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        showNotification('Order has been placed');
        setTimeout(() => {
            window.location.href = 'LOGIN.HTML';
        }, 2000);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    if (checkAuth()) {
        populateUserData();
        displayCartSummary();
        document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
    }
});

// Payment method selection UI
window.selectPayment = function(method) {
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
    document.querySelector(`input[value="${method}"]`).closest('.payment-method').classList.add('selected');

    document.getElementById('card-details').style.display = method === 'card' ? 'block' : 'none';
    document.getElementById('easypaisa-details').style.display = method === 'easypaisa' ? 'block' : 'none';
};

// On every page load, if token is missing, redirect to login
if (!localStorage.getItem('token')) {
    window.location.href = 'LOGIN.HTML';
} 