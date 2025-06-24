import config from './config.js';

console.log('admin.js loaded');

// Check if user is admin
function checkAdminAccess() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('token');
    
    if (!currentUser || !token || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
    }
}

// Fetch all orders
async function fetchOrders() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(config.endpoints.orders + '/all', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        
        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        showError(error.message);
    }
}

// Fetch all users
async function fetchUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(config.endpoints.users, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        showError(error.message);
    }
}

// Update order status
async function updateOrderStatus(orderId, status) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.endpoints.orders}/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update order status');
        }
        
        showNotification('Order status updated successfully!');
        fetchOrders();
    } catch (error) {
        showError(error.message);
    }
}

// Display orders in the container
function displayOrders(orders) {
    console.log('displayOrders called', orders);
    const ordersContainer = document.getElementById('orders-container');
    if (!ordersContainer) return;
    
    ordersContainer.innerHTML = '';
    
    orders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Order #${order._id}</h5>
                <p class="card-text">
                    <strong>Customer:</strong> ${order.user ? order.user.name : 'N/A'}<br>
                    <strong>Phone:</strong> ${order.contactNumber || ''}<br>
                    <strong>Address:</strong> ${order.deliveryAddress || ''}<br>
                    <strong>Payment Method:</strong> ${order.paymentMethod || ''}<br>
                    <strong>Payment Status:</strong> ${order.paymentStatus || ''}<br>
                    <strong>Total:</strong> ₨ ${order.totalAmount || order.total || ''}<br>
                    <strong>Date:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
                </p>
                <h6>Order Items:</h6>
                <ul>
                    ${order.items.map(item => `<li>${item.name} x ${item.quantity} - ₨ ${item.price * item.quantity}</li>`).join('')}
                </ul>
                <div class="btn-group">
                    <button class="btn btn-success btn-sm" data-order-id="${order._id}" data-status="Delivered">Complete</button>
                    <button class="btn btn-danger btn-sm" data-order-id="${order._id}" data-status="Cancelled">Cancel</button>
                </div>
                <span class="order-status status-${(order.orderStatus || order.status || '').toLowerCase()}"> ${(order.orderStatus || order.status || '').toUpperCase()}</span>
            </div>
        `;
        ordersContainer.appendChild(card);
    });

    ordersContainer.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (event) => {
            console.log('Button clicked!', event.target);
            const orderId = event.target.dataset.orderId;
            const newStatus = event.target.dataset.status;
            if (orderId && newStatus && confirm(`Are you sure you want to mark this order as ${newStatus}?`)) {
                updateOrderStatus(orderId, newStatus);
            }
        });
    });
}

// Display users in the table
function displayUsers(users) {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>${user.address || 'N/A'}</td>
            <td>${new Date(user.registrationDate).toLocaleString()}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Helper function to format order items
function formatItems(items) {
    return items.map(item => `${item.name} (${item.quantity})`).join(', ');
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

// Fetch and display statistics
async function fetchStatistics() {
    try {
        const token = localStorage.getItem('token');
        // Fetch order stats
        const orderStatsRes = await fetch(config.endpoints.orderStats, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orderStats = await orderStatsRes.json();
        // Fetch user count
        const userCountRes = await fetch(config.endpoints.userCount, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const userCount = await userCountRes.json();
        // Display statistics
        document.getElementById('total-orders').textContent = orderStats.totalOrders || 0;
        document.getElementById('total-revenue').textContent = '₨ ' + (orderStats.totalRevenue || 0);
        document.getElementById('total-users').textContent = userCount.count || 0;
    } catch (error) {
        showError('Failed to fetch statistics');
    }
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    // Place all initialization code here
    checkAdminAccess();
    fetchOrders();
    fetchUsers();
    fetchStatistics();
    
    // Add logout functionality
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }
}); 