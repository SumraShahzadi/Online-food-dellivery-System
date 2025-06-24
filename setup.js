const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Gobble Bear Restaurant Project...\n');

// Check if backend directory exists
if (!fs.existsSync('./backend')) {
    console.error('❌ Backend directory not found. Please make sure you are in the correct project directory.');
    process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = path.join('./backend', '.env');
if (!fs.existsSync(envPath)) {
    const envContent = `MONGODB_URI=mongodb://localhost:27017/gobble-bear
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('Created .env file in backend directory');
} else {
    console.log('ℹ.env file already exists');
}

// Check if MongoDB is running (basic check)
const { exec } = require('child_process');
exec('mongod --version', (error, stdout, stderr) => {
    if (error) {
        console.log('⚠️  MongoDB might not be installed or running');
        console.log('   Please install MongoDB and start the service');
        console.log('   Or use MongoDB Atlas (cloud) and update the MONGODB_URI in .env');
    } else {
        console.log('✅ MongoDB is available');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Install backend dependencies: cd backend && npm install');
    console.log('2. Start MongoDB service (if using local MongoDB)');
    console.log('3. Seed the database: cd backend && npm run seed');
    console.log('4. Start the backend server: cd backend && npm start');
    console.log('5. Open projectcode.html in your browser');
    console.log('\n🎉 Setup complete! Follow the steps above to run the project.');
}); 