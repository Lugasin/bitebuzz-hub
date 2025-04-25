const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.get('/', async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
});


module.exports = router;