const express = require('express');
const pool = require('./db');
const { requireAuth, requireRole } = require('./auth');

const router = express.Router();
router.use(requireAuth);

const SELECT_SYMPTOMS = `
  SELECT s.id, s.description, s.urgency_level,
         to_char(s.created_at, 'YYYY-MM-DD HH24:MI') AS created_at,
         p.username AS patient_name, l.username AS logged_by_name
  FROM symptoms s
  JOIN users p ON p.id = s.patient_id
  JOIN users l ON l.id = s.logged_by`;

router.post('/', requireRole('patient', 'chw'), async (req, res) => {
  try {
    const { description, urgency_level, patient_id } = req.body;
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Please describe the symptoms.' });
    }
    const level = urgency_level === 'urgent' ? 'urgent' : 'normal';
    let targetId;
    if (req.user.role === 'patient') {
      targetId = req.user.id;
    } else {
      if (!patient_id) {
        return res.status(400).json({ message: 'Please choose a patient.' });
      }
      const check = await pool.query("SELECT id FROM users WHERE id = $1 AND role = 'patient'", [patient_id]);
      if (check.rows.length === 0) {
        return res.status(404).json({ message: 'Patient not found.' });
      }
      targetId = check.rows[0].id;
    }
    await pool.query(
      'INSERT INTO symptoms (patient_id, logged_by, description, urgency_level) VALUES ($1, $2, $3, $4)',
      [targetId, req.user.id, description.trim(), level]
    );
    res.status(201).json({ message: 'Symptoms saved.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not save symptoms.' });
  }
});

router.get('/mine', requireRole('patient'), async (req, res) => {
  try {
    const result = await pool.query(SELECT_SYMPTOMS + ' WHERE s.patient_id = $1 ORDER BY s.created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load symptoms.' });
  }
});


router.get('/patients', requireRole('doctor', 'chw'), async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, location FROM users WHERE role = 'patient' ORDER BY username");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load patients.' });
  }
});


router.get('/recent', requireRole('doctor', 'chw'), async (req, res) => {
  try {
    const result = await pool.query(SELECT_SYMPTOMS + ' ORDER BY s.created_at DESC LIMIT 50');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load symptoms.' });
  }
});

router.get('/patient/:id', requireRole('doctor', 'chw'), async (req, res) => {
  try {
    const result = await pool.query(SELECT_SYMPTOMS + ' WHERE s.patient_id = $1 ORDER BY s.created_at DESC', [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load history.' });
  }
});

module.exports = router;