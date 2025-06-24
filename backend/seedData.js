const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Sample menu items data
const menuItems = [
    {
        name: 'BBQ Beef Burger',
        description: 'Juicy beef patty with BBQ sauce, lettuce, tomato, and cheese',
        price: 12.99,
        category: 'Burgers',
        image: 'Images/BBQ BEEF BURGER.jpeg',
        isAvailable: true
    },
    {
        name: 'Classic Cheeseburger',
        description: 'Traditional beef burger with melted cheese and fresh vegetables',
        price: 10.99,
        category: 'Burgers',
        image: 'Images/CLASSICCHEESEBURGER.jpeg',
        isAvailable: true
    },
    {
        name: 'Double Trouble Burger',
        description: 'Double beef patties with special sauce and crispy bacon',
        price: 15.99,
        category: 'Burgers',
        image: 'Images/DOUBLE TROUBLE BURGER.jpeg',
        isAvailable: true
    },
    {
        name: 'Spicy Zinger',
        description: 'Spicy chicken burger with hot sauce and jalapeños',
        price: 13.99,
        category: 'Burgers',
        image: 'Images/SPICY ZINGER.jpeg',
        isAvailable: true
    },
    {
        name: 'Veggie Delight Burger',
        description: 'Plant-based burger with fresh vegetables and special sauce',
        price: 11.99,
        category: 'Burgers',
        image: 'Images/Veggie Delight Burger.jpeg',
        isAvailable: true
    },
    {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 16.99,
        category: 'Pizza',
        image: 'Images/Margherita Pizza.jpeg',
        isAvailable: true
    },
    {
        name: 'Pepperoni Feast Pizza',
        description: 'Pizza loaded with pepperoni, cheese, and tomato sauce',
        price: 18.99,
        category: 'Pizza',
        image: 'Images/Pepperoni Feast PIZZA.jpeg',
        isAvailable: true
    },
    {
        name: 'BBQ Chicken Pizza',
        description: 'Pizza with BBQ sauce, grilled chicken, and onions',
        price: 19.99,
        category: 'Pizza',
        image: 'Images/BBQ Chicken Pizza.jpeg',
        isAvailable: true
    },
    {
        name: 'Tandoori Special Pizza',
        description: 'Indian-style pizza with tandoori chicken and spices',
        price: 20.99,
        category: 'Pizza',
        image: 'Images/Tandoori Special Pizza.jpeg',
        isAvailable: true
    },
    {
        name: 'Crown Crust Pizza',
        description: 'Pizza with stuffed crust and premium toppings',
        price: 22.99,
        category: 'Pizza',
        image: 'Images/CROWNCRUST PIZZA.jpeg',
        isAvailable: true
    },
    {
        name: 'Beef Karahi',
        description: 'Traditional Pakistani beef karahi with spices and herbs',
        price: 24.99,
        category: 'Karahi',
        image: 'Images/BEEF KARAHI.jpeg',
        isAvailable: true
    },
    {
        name: 'Chicken Karahi',
        description: 'Spicy chicken karahi cooked with traditional spices',
        price: 22.99,
        category: 'Karahi',
        image: 'Images/Chicken Karahi.jpeg',
        isAvailable: true
    },
    {
        name: 'White Karahi',
        description: 'Creamy white karahi with mild spices and cream',
        price: 23.99,
        category: 'Karahi',
        image: 'Images/White Karahi.jpeg',
        isAvailable: true
    },
    {
        name: 'Vegetable Karahi',
        description: 'Mixed vegetables karahi with aromatic spices',
        price: 18.99,
        category: 'Karahi',
        image: 'Images/VEGETABLE KARAHI.jpeg',
        isAvailable: true
    },
    {
        name: 'Regular Fries',
        description: 'Crispy golden fries served with ketchup',
        price: 4.99,
        category: 'Fries',
        image: 'Images/REGULAR FRIES.jpeg',
        isAvailable: true
    },
    {
        name: 'Spicy Fries',
        description: 'Fries tossed with spicy seasoning and chili powder',
        price: 5.99,
        category: 'Fries',
        image: 'Images/SPICY FRIES.jpeg',
        isAvailable: true
    },
    {
        name: 'Loaded Fries',
        description: 'Fries topped with cheese, bacon, and special sauce',
        price: 7.99,
        category: 'Fries',
        image: 'Images/LOADED FRIES.jpeg',
        isAvailable: true
    },
    {
        name: 'Truffle Fries',
        description: 'Premium fries with truffle oil and parmesan cheese',
        price: 8.99,
        category: 'Fries',
        image: 'Images/TRUGFFLE FRIES.jpeg',
        isAvailable: true
    },
    {
        name: 'Pepsi',
        description: 'Refreshing Pepsi cola drink',
        price: 2.99,
        category: 'Drinks',
        image: 'Images/pepsi.jpeg',
        isAvailable: true
    },
    {
        name: 'Fanta',
        description: 'Orange flavored carbonated soft drink',
        price: 2.99,
        category: 'Drinks',
        image: 'Images/fanta.jpeg',
        isAvailable: true
    },
    {
        name: 'Peach Ice Tea',
        description: 'Refreshing peach flavored iced tea',
        price: 3.99,
        category: 'Drinks',
        image: 'Images/peachicetea.jpeg',
        isAvailable: true
    },
    {
        name: 'Mint Margarita',
        description: 'Fresh mint and lime margarita mocktail',
        price: 4.99,
        category: 'Drinks',
        image: 'Images/mint margreta.jpeg',
        isAvailable: true
    },
    {
        name: 'Oreo Shake',
        description: 'Creamy Oreo cookie milkshake',
        price: 5.99,
        category: 'Drinks',
        image: 'Images/OREOSHAKE.jpeg',
        isAvailable: true
    }
];

// Sample admin user
const adminUser = {
    name: 'Admin',
    email: 'admin@gobblebear.com',
    password: 'admin123',
    phone: '1234567890',
    address: '123 Admin Street, City',
    gender: 'male',
    role: 'admin'
};

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gobble-bear', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await MenuItem.deleteMany({});
        console.log('Cleared existing menu items');

        // Insert menu items
        const insertedItems = await MenuItem.insertMany(menuItems);
        console.log(`Inserted ${insertedItems.length} menu items`);

        // Check if admin user exists
        const existingAdmin = await User.findOne({ email: adminUser.email });
        if (!existingAdmin) {
            // Create admin user
            const admin = new User(adminUser);
            await admin.save();
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }

        console.log('Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedDatabase(); 