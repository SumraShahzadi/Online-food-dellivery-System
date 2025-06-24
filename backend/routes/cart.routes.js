const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');
const { auth } = require('../middleware/auth');

// Get user's cart
router.get('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
    try {
        const { menuItemId, quantity, variant } = req.body;

        // Validate menu item exists
        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.menuItem.toString() === menuItemId && item.variant === (variant || null)
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item if it doesn't exist
            cart.items.push({
                menuItem: menuItemId,
                quantity,
                variant: variant || null
            });
        }

        // Calculate total amount
        await cart.populate('items.menuItem');
        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + (item.menuItem.price * item.quantity);
        }, 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: 'Error adding item to cart', error: error.message });
    }
});

// Update cart item quantity
router.patch('/update/:itemId', auth, async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        // Recalculate total amount
        await cart.populate('items.menuItem');
        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + (item.menuItem.price * item.quantity);
        }, 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: 'Error updating cart', error: error.message });
    }
});

// Remove item from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);

        // Recalculate total amount
        await cart.populate('items.menuItem');
        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + (item.menuItem.price * item.quantity);
        }, 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: 'Error removing item from cart', error: error.message });
    }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();
        
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
});

module.exports = router; 