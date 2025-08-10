// controllers/auth.controller.js
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');
const bcrypt = require('bcryptjs');

// POST /auth/login
async function login(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username & password required' });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: '8h' }
    );

    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /auth/register
async function register(req, res) {
  try {
    const { username, password, role } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Name, username & password required' });

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(409).json({ message: 'Username already exists' });

    let userRole = 'user';
    if (role && req.user && req.user.role === 'admin') {
      userRole = role;
    }
    const saltRounds = 10;
    const userPass = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, passwordHash: userPass, role: userRole });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      jwtSecret,
      { expiresIn: '8h' }
    );

    res.status(201).json({ token, role: newUser.role, username: newUser.username });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { login, register };
