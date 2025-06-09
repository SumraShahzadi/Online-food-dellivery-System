const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Burgers', 'Karahi', 'Fries', 'Drinks', 'Pizza', 'Deals']
    },
    image: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    variants: [{
        name: String,
        price: Number
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema); 