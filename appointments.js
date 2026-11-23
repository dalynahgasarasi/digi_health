const express = require('express');
const pool = require('./db');
const { requireAuth, requireRole } = require('./auth');
const router = express.Router();
router.use(requireAuth);

router.get('/doctors', requireRole('patient'), async (req, res) => {
    try {
        const result = await pool.query("SELECT id, username, specialisation FROM users WHERE role = 'doctor' ORDER BY username");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Could not load doctors.' });
    }
});

router.post('/', requireRole('patient'), async (req, res) => {
    try {
        const { doctor_id, appointment_date, appointment_time, description } = req.body;
        if (!doctor_id || !appointment_date || !appointment_time) {
            return res.status(400).json({ message: 'Please choose a doctor, a date and a time.' });
        } 
        const doctor = await pool.query("SELECT id FROM users WHERE id = $1 AND role = 'doctor'", [doctor_id]);
        if (!doctor_id || doctor.rows.length === 0) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }
        await pool.query(
            'INSERT INTO appointments (patient_id, doctor_id, description, appointment_date, appointment_time) VALUES ($1, $2, $3, $4, $5)',
            [req.user.id, doctor.rows[0].id, description || null, appointment_date, appointment_time]
        );
        res.status(201).json({ message: 'Appointment booked.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Could not book the appointment.' });
    }
});

router.get('/mine', requireRole('patient', 'doctor'), async (req, res) => {
    try {
        const column = req.user.role === 'patient' ? 'a.patient_id' : 'a.doctor_id';
        const result = await pool.query(
            `SELECT a.id, a.description, a.status,
                    to_char(a.appointment_date, 'YYYY-MM-DD') AS appointment_date,
                    to_char(a.appointment_time, 'HH24:MI') AS appointment_time,
                    p.username AS patient_name, d.username AS doctor_name
             FROM appointments a
                JOIN users p ON p.id = a.patient_id
                JOIN users d ON d.id = a.doctor_id
                WHERE ${column} = $1
                ORDER BY a.appointment_date, a.appointment_time`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Could not load appointments.' });
    }
});

module.exports = router;