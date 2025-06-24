const mongoose = require('mongoose');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
require('dotenv').config();

async function checkDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gobble-bear', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB\n');

        // Check Users
        const users = await User.find();
        console.log(`👥 Users Collection: ${users.length} users`);
        users.forEach(user => {
            console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
        });

        // Check Menu Items
        const menuItems = await MenuItem.find();
        console.log(`\n🍔 MenuItems Collection: ${menuItems.length} items`);
        
        // Group by category
        const categories = {};
        menuItems.forEach(item => {
            if (!categories[item.category]) {
                categories[item.category] = [];
            }
            categories[item.category].push(item.name);
        });

        Object.keys(categories).forEach(category => {
            console.log(`   📂 ${category}: ${categories[category].length} items`);
            categories[category].forEach(name => {
                console.log(`      - ${name}`);
            });
        });

        // Check Carts
        const carts = await Cart.find();
        console.log(`\n🛒 Cart Collection: ${carts.length} carts`);

        // Check Orders
        const orders = await Order.find();
        console.log(`\n📦 Orders Collection: ${orders.length} orders`);

        console.log('\n🎉 Database check complete!');
        console.log('\n📋 To view in MongoDB Compass:');
        console.log('1. Open MongoDB Compass');
        console.log('2. Connect to: mongodb://localhost:27017');
        console.log('3. Click on "gobble-bear" database');
        console.log('4. Explore the collections above');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error checking database:', error);
        process.exit(1);
    }
}

checkDatabase(); 