const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { auth, adminAuth } = require('../middleware/auth');

// Get all menu items
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching menu items', error: error.message });
    }
});

// Get menu items by category
router.get('/category/:category', async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ category: req.params.category });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching menu items', error: error.message });
    }
});

// Add new menu item (admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const menuItem = new MenuItem(req.body);
        await menuItem.save();
        res.status(201).json(menuItem);
    } catch (error) {
        res.status(400).json({ message: 'Error creating menu item', error: error.message });
    }
});

// Update menu item (admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(menuItem);
    } catch (error) {
        res.status(400).json({ message: 'Error updating menu item', error: error.message });
    }
});

// Delete menu item (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting menu item', error: error.message });
    }
});

module.exports = router; 