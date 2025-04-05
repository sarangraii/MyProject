const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all clients
router.get('/', async (req, res) => {
  try {
    const clients = await User.find().sort({ name: 1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET clients with search functionality
router.get('/search', async (req, res) => {
  const { term } = req.query;
  
  try {
    const searchRegex = new RegExp(term, 'i');
    
    const clients = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ]
    }).sort({ name: 1 });
    
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single client
router.get('/:id', async (req, res) => {
  try {
    const client = await User.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new client
router.post('/', async (req, res) => {
  const client = new User(req.body);
  
  try {
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a client
router.put('/:id', async (req, res) => {
  try {
    const updatedClient = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedClient) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a client
router.delete('/:id', async (req, res) => {
  try {
    const client = await User.findByIdAndDelete(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;