const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const pool = require('./db');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('DigiHealth');
});

app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS TIME');
    res.json({ OK: true, time: result.rows[0].time });
  } catch (error) {
    console.error(error);
    res.status(500).json({ OK: false, error: 'Database query failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});