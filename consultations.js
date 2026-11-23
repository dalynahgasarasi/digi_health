const express = require('express');
const pool = require('./db');
const { requireAuth, requireRole } = require('./auth');

const router = express.Router();
router.use(requireAuth);

const SELECT_CONSULTATIONS = `
  SELECT c.id, c.description, c.status,
         to_char(c.created_at, 'YYYY-MM-DD HH24:MI') AS created_at,
         p.username AS patient_name,
         r.username AS requested_by_name,
         d.username AS doctor_name
  FROM consultations c
  JOIN users p ON p.id = c.patient_id
  JOIN users r ON r.id = c.requested_by
  LEFT JOIN users d ON d.id = c.doctor_id`;

router.post('/', requireRole('patient', 'chw'), async (req, res) => {
  try {
    const { description, patient_id } = req.body;
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Please describe why you need a consultation.' });
    }
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
      'INSERT INTO consultations (patient_id, requested_by, description) VALUES ($1, $2, $3)',
      [targetId, req.user.id, description.trim()]
    );
    res.status(201).json({ message: 'Consultation requested. A doctor will pick it up.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not request the consultation.' });
  }
});


router.get('/mine', requireRole('patient', 'chw', 'doctor'), async (req, res) => {
  try {
    let where;
    if (req.user.role === 'patient') {
      where = 'WHERE c.patient_id = $1';
    } else if (req.user.role === 'chw') {
      where = 'WHERE c.requested_by = $1';
    } else {
      where = 'WHERE c.doctor_id IS NULL OR c.doctor_id = $1';
    }
    const result = await pool.query(SELECT_CONSULTATIONS + ' ' + where + ' ORDER BY c.created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load consultations.' });
  }
});

router.post('/:id/accept', requireRole('doctor'), async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE consultations SET doctor_id = $1, status = 'accepted' WHERE id = $2 AND status = 'pending' RETURNING id",
      [req.user.id, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'This request is no longer available.' });
    }
    res.json({ message: 'Consultation accepted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not accept the consultation.' });
  }
});

router.post('/:id/complete', requireRole('doctor'), async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE consultations SET status = 'completed' WHERE id = $1 AND doctor_id = $2 AND status = 'accepted' RETURNING id",
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Consultation not found.' });
    }
    res.json({ message: 'Consultation marked as completed.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not update the consultation.' });
  }
});

router.post('/chw-request', requireRole('patient'), async (req, res) => {
  try {
    const me = await pool.query('SELECT location FROM users WHERE id = $1', [req.user.id]);
    const location = me.rows[0] && me.rows[0].location;
    let chw = null;
    if (location) {
      const match = await pool.query(
        "SELECT id, username FROM users WHERE role = 'chw' AND lower(location) = lower($1) LIMIT 1",
        [location]
      );
      chw = match.rows[0] || null;
    }
    await pool.query('INSERT INTO chw_requests (patient_id, chw_id) VALUES ($1, $2)', [req.user.id, chw ? chw.id : null]);
    const message = chw
      ? 'Request sent to ' + chw.username + ', your nearest community health worker.'
      : 'Request sent. No community health worker matched your location yet, so any CHW can pick it up.';
    res.status(201).json({ message: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not send the request.' });
  }
});

router.get('/chw-requests', requireRole('patient', 'chw'), async (req, res) => {
  try {
    const where = req.user.role === 'patient'
      ? 'WHERE q.patient_id = $1'
      : 'WHERE q.chw_id = $1 OR q.chw_id IS NULL';
    const result = await pool.query(
      `SELECT q.id, q.status,
              to_char(q.created_at, 'YYYY-MM-DD HH24:MI') AS created_at,
              p.username AS patient_name, p.location AS patient_location,
              c.username AS chw_name
       FROM chw_requests q
       JOIN users p ON p.id = q.patient_id
       LEFT JOIN users c ON c.id = q.chw_id
       ${where}
       ORDER BY q.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not load requests.' });
  }
});

router.post('/chw-request/:id/respond', requireRole('chw'), async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE chw_requests SET chw_id = $1, status = 'responded' WHERE id = $2 AND status = 'pending' AND (chw_id IS NULL OR chw_id = $1) RETURNING id",
      [req.user.id, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'This request is no longer available.' });
    }
    res.json({ message: 'Marked as responded.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not update the request.' });
  }
});

module.exports = router;