require('dotenv').config();
const express = require('express');
const pool = require('./db');
const { router: authRouter } = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use('/api/auth', authRouter);

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS time');
    res.json({ OK: true, time: result.rows[0].time });
  } catch (error) {
    console.error(error);
    res.status(500).json({ OK: false, error: 'Database query failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});