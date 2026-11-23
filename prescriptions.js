const express = require('express');
const pool = require('./db');
const { requireAuth, requireRole } = require('./auth');

const router = express.Router();
router.use(requireAuth);

const SELECT_PRESCRIPTIONS = `
  SELECT rx.id, rx.instruction_dosage,
         to_char(rx.prescription_date, 'YYYY-MM-DD') AS prescription_date,
         p.username AS patient_name, d.username AS doctor_name
  FROM prescriptions rx
  JOIN users p ON p.id = rx.patient_id
  JOIN users d ON d.id = rx.doctor_id`;

router.post('/', requireRole('doctor'), async (req, res) => {
  try {
    const { patient_id, instruction_dosage } = req.body;
    if (!patient_id || !instruction_dosage || !instruction_dosage.trim()) {
      return res.status(400).json({ message: 'Please choose a patient and write the prescription.' });
    }
    const check = await pool.query("SELECT id FROM users WHERE id = $1 AND role = 'patient'", [patient_id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    await pool.query(
      'INSERT INTO prescriptions (patient_id, doctor_id, instruction_dosage) VALUES ($1, $2, $3)',
      [check.rows[0].id, req.user.id, instruction_dosage.trim()]
    );
    res.status(201).json({ message: 'Prescription saved.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not save the prescription.' });
  }
});

router.get('/mine', requireRole('patient'), async (req, res) => {
  try {
    const result = await pool.query(SELECT_PRESCRIPTIONS + ' WHERE rx.patient_id = $1 ORDER BY rx.id DESC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load prescriptions.' });
  }
});

router.get('/patient/:id', requireRole('doctor', 'chw'), async (req, res) => {
  try {
    const result = await pool.query(SELECT_PRESCRIPTIONS + ' WHERE rx.patient_id = $1 ORDER BY rx.id DESC', [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load prescriptions.' });
  }
});

module.exports = router;