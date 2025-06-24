# Gobble Bear Restaurant - Food Ordering System

A complete food ordering system with MongoDB backend and modern frontend. This project has been updated to use MongoDB instead of localStorage for all data persistence.

## Features

- **User Authentication**: Register, login, and logout functionality
- **Menu Management**: Browse menu items by category
- **Shopping Cart**: Add, remove, and update cart items
- **Order Management**: Place orders and track order status
- **Admin Panel**: Manage menu items and orders
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **HTML5** with modern CSS
- **JavaScript ES6+** with modules
- **Bootstrap 5** for responsive design
- **Fetch API** for backend communication

## Prerequisites

Before running this project, make sure you have the following installed:

1. **Node.js** (v14 or higher)
2. **MongoDB** (v4.4 or higher)
3. **Git** (for cloning the repository)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd web-development-project
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Set Up MongoDB
Make sure MongoDB is running on your system. You can either:

**Option A: Use Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- The default connection string will be: `mongodb://localhost:27017/gobble-bear`

**Option B: Use MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a new cluster
- Get your connection string and update it in the backend

### 4. Environment Configuration
Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=mongodb://localhost:27017/gobble-bear
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

### 5. Seed the Database
Populate the database with sample menu items and admin user:
```bash
cd backend
npm run seed
```

This will create:
- Sample menu items (Burgers, Pizza, Karahi, Fries, Drinks)
- Admin user (email: admin@gobblebear.com, password: admin123)

### 6. Start the Backend Server
```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000`

### 7. Start the Frontend
Open the project in your browser. You can use any local server:

**Option A: Using Python (if installed)**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option B: Using Node.js http-server**
```bash
npm install -g http-server
http-server -p 8000
```

**Option C: Using Live Server (VS Code extension)**
- Install Live Server extension
- Right-click on `projectcode.html` and select "Open with Live Server"

## Usage

### For Customers

1. **Browse Menu**: Visit the main page to see all menu items
2. **Register/Login**: Create an account or login to existing account
3. **Add to Cart**: Click "Add to Cart" on any menu item
4. **View Cart**: Click the cart icon to see your cart
5. **Checkout**: Proceed to checkout and place your order

### For Admins

1. **Login**: Use admin credentials (admin@gobblebear.com / admin123)
2. **Manage Menu**: Add, edit, or remove menu items
3. **View Orders**: See all customer orders and update their status

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/category/:category` - Get menu items by category
- `POST /api/menu` - Add new menu item (admin only)
- `PUT /api/menu/:id` - Update menu item (admin only)
- `DELETE /api/menu/:id` - Delete menu item (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PATCH /api/cart/update/:itemId` - Update cart item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/all` - Get all orders (admin only)
- `PATCH /api/orders/:id/status` - Update order status (admin only)

## Project Structure

```
web-development-project/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── server.js        # Main server file
│   ├── seedData.js      # Database seeding script
│   └── package.json     # Backend dependencies
├── Images/              # Menu item images
├── projectcode.html     # Main menu page
├── cart.html           # Shopping cart page
├── checkout.html       # Checkout page
├── LOGIN.HTML          # Login page
├── SIGNUP.html         # Registration page
├── admin.html          # Admin panel
├── auth.js             # Authentication logic
├── cart.js             # Cart functionality
├── menu.js             # Menu management
├── config.js           # API configuration
└── style.css           # Global styles
```

## Database Schema

### User
- name, email, password, phone, address, gender, role

### MenuItem
- name, description, price, category, image, isAvailable

### Cart
- user (reference), items (array with menuItem, quantity, variant), totalAmount

### Order
- user (reference), items (array), totalAmount, deliveryAddress, contactNumber, paymentMethod, paymentStatus, orderStatus, specialInstructions

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Make sure MongoDB is running
   - Check your connection string in `.env`
   - Verify MongoDB port (default: 27017)

2. **CORS Error**
   - Backend is configured to allow all origins
   - Make sure backend is running on port 5000

3. **Authentication Error**
   - Check if JWT_SECRET is set in `.env`
   - Verify token is being sent in Authorization header

4. **Image Loading Issues**
   - Make sure image paths are correct
   - Check if images exist in the Images folder

### Development Tips

1. **Enable Debug Mode**: Add `console.log` statements in backend routes
2. **Check Network Tab**: Use browser dev tools to monitor API calls
3. **MongoDB Compass**: Use MongoDB Compass for database visualization
4. **Postman**: Test API endpoints using Postman

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Feel free to use and modify as needed.

## Support

If you encounter any issues or have questions, please create an issue in the repository or contact the development team. 