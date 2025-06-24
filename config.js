const API_BASE_URL = 'http://localhost:5000/api';

const config = {
    apiUrl: API_BASE_URL,
    endpoints: {
        register: `${API_BASE_URL}/auth/register`,
        login: `${API_BASE_URL}/auth/login`,
        orders: `${API_BASE_URL}/orders`,
        users: `${API_BASE_URL}/users`,
        menu: `${API_BASE_URL}/menu`,
        cart: `${API_BASE_URL}/cart`,
        orderStats: `${API_BASE_URL}/orders/stats`,
        userCount: `${API_BASE_URL}/users/count`
    }
};

export default config; 