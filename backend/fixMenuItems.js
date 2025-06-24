const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

async function fixMenuItems() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gobble-bear', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB\n');

        // Fix the drinks that got mixed into Karahi category
        const drinksToFix = [
            { name: 'Fanta', category: 'Drinks' },
            { name: 'Peach Ice Tea', category: 'Drinks' },
            { name: 'Mint Margarita', category: 'Drinks' },
            { name: 'Oreo Shake', category: 'Drinks' }
        ];

        for (const drink of drinksToFix) {
            await MenuItem.updateOne(
                { name: drink.name },
                { category: drink.category }
            );
            console.log(`✅ Fixed: ${drink.name} → ${drink.category}`);
        }

        // Add missing Karahi items
        const missingKarahi = [
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
            }
        ];

        for (const karahi of missingKarahi) {
            const exists = await MenuItem.findOne({ name: karahi.name });
            if (!exists) {
                await MenuItem.create(karahi);
                console.log(`✅ Added: ${karahi.name}`);
            }
        }

        // Add missing Fries items
        const missingFries = [
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
            }
        ];

        for (const fries of missingFries) {
            const exists = await MenuItem.findOne({ name: fries.name });
            if (!exists) {
                await MenuItem.create(fries);
                console.log(`✅ Added: ${fries.name}`);
            }
        }

        // Add missing Drinks items
        const missingDrinks = [
            {
                name: 'Pepsi',
                description: 'Refreshing Pepsi cola drink',
                price: 2.99,
                category: 'Drinks',
                image: 'Images/pepsi.jpeg',
                isAvailable: true
            }
        ];

        for (const drink of missingDrinks) {
            const exists = await MenuItem.findOne({ name: drink.name });
            if (!exists) {
                await MenuItem.create(drink);
                console.log(`✅ Added: ${drink.name}`);
            }
        }

        console.log('\n🎉 Menu items fixed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing menu items:', error);
        process.exit(1);
    }
}

fixMenuItems(); 