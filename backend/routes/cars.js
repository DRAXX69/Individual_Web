const express = require('express');
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// Get all cars (public route)
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit } = req.query;
    let query = { availability: true };

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    let cars = Car.find(query).sort({ createdAt: -1 });

    if (limit) {
      cars = cars.limit(parseInt(limit));
    }

    const result = await cars;
    res.json(result);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Server error while fetching cars' });
  }
});

// Get single car by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ message: 'Server error while fetching car' });
  }
});

// Add new car (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json({ message: 'Car added successfully', car });
  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({ message: 'Server error while adding car' });
  }
});

// Update car (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ message: 'Car updated successfully', car });
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'Server error while updating car' });
  }
});

// Delete car (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Server error while deleting car' });
  }
});

module.exports = router;
