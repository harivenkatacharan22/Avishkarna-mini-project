import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, '../data/users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'villageshare_secret_key_12345';

// Helper to read users
const readUsers = () => {
  try {
    if (!fs.existsSync(usersFilePath)) {
      return [];
    }
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

// Helper to write users
const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing users file:', error);
  }
};

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, username, password, phone, village } = req.body;

  // Simple validation
  if (!name || !username || !password || !phone || !village) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const users = readUsers();

    // Check for existing user
    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user object
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      username,
      password: hashedPassword,
      phone,
      village
    };

    users.push(newUser);
    writeUsers(users);

    // Create token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        phone: newUser.phone,
        village: newUser.village
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const users = readUsers();

    // Check for user
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, username: user.username, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        phone: user.phone,
        village: user.village
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/auth/me
// @desc    Get user data from token
// @access  Private
router.get('/me', authMiddleware, (req, res) => {
  try {
    const users = readUsers();
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      phone: user.phone,
      village: user.village
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
