const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const router = express.Router();
const ROLES = ['patient', 'chw', 'doctor'];

router.post('/register', async (req, res) => {
    try {
        const { username, password, role, phone_number, language, location, specialisation } = req.body;
        if (!username || !phone_number || !password || !ROLES.includes(role)) {
            return res.status(400).json({ message: 'Please fill in all required fields.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }
        const existing = await pool.query('SELECT id FROM users WHERE phone_number = $1', [phone_number]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'User already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (username, phone_number, password_hash, language, role, location, specialisation) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [username, phone_number, hashedPassword, language || 'English' , role, location || null, specialisation || null]
        );
        res.status(201).json({ message: 'Account created successfully. Please login.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Could not create account. Please try again later.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { phone_number, password } = req.body;
        if (!phone_number || !password) {
            return res.status(400).json({ message: 'Please fill in all required fields.' });
        }
        const result = await pool.query('SELECT * FROM users WHERE phone_number = $1', [phone_number]);
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Wrong phone number or password.' });
        }
        const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '8h' }); 
        res.json({ token, user: { id: user.id, username: user.username, role: user.role, phone_number: user.phone_number, language: user.language, location: user.location, specialisation: user.specialisation } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Could not login. Please try again later.' });
    }
});
function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.replace('Bearer ', '');
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please log in first.' });
    }
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission to access this resource.' });
        }
        next();
    };
}

module.exports = { router, requireAuth, requireRole };