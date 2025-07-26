const express = require('express');
const User = require('../models/User');
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile (protected route)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Update user profile (protected route)
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// Add car to cart (protected route)
router.post('/cart', auth, async (req, res) => {
  try {
    const { carId, quantity = 1 } = req.body;
    
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const user = await User.findById(req.user.userId);
    const existingItem = user.cart.find(item => item.car.toString() === carId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ car: carId, quantity });
    }

    await user.save();
    await user.populate('cart.car');

    res.json({ message: 'Car added to cart', cart: user.cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error while adding to cart' });
  }
});

// Get user cart (protected route)
router.get('/cart', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart.car');
    res.json(user.cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
});

// Remove car from cart (protected route)
router.delete('/cart/:carId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.cart = user.cart.filter(item => item.car.toString() !== req.params.carId);
    await user.save();

    res.json({ message: 'Car removed from cart', cart: user.cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error while removing from cart' });
  }
});

module.exports = router;
