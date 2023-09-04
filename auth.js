const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// Registration Page
router.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/../views/signup.html');
});

// Handle Registration
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.redirect('/auth/login');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Login Page
router.get('/login', (req, res) => {
  res.sendFile(__dirname + '/../views/login.html');
});

// Handle Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid username or password');
    }

    req.session.user = user;
    res.redirect('/dashboard'); // Redirect to the dashboard after successful login
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
