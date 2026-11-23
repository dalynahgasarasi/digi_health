require('dotenv').config();
const express = require('express');
const pool = require('./db');
const { router: authRouter } = require('./auth');
const symptomsRouter = require('./symptoms');
const appointmentsRouter = require('./appointments');
const consultationsRouter = require('./consultations');
const prescriptionsRouter = require('./prescriptions');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/symptoms', symptomsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use(express.static('public'));
app.use('/api/auth', authRouter);
app.use('/api/consultations', consultationsRouter);
app.use('/api/prescriptions', prescriptionsRouter);
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