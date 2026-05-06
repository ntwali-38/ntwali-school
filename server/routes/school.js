const express = require('express');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const requireSchool = (req, res, next) => {
  if (req.user?.role !== 'school') return res.status(403).json({ error: 'School access required' });
  return next();
};

router.post('/profile', authenticateToken, requireSchool, async (req, res) => {
  try {
    const userId = req.user.userId;
    const payload = req.body;
    const [existing] = await db.query('SELECT id FROM school_profiles WHERE user_id = ?', [userId]);
    if (existing.length) return res.status(409).json({ error: 'Profile already exists' });
    await db.query(
      `INSERT INTO school_profiles
      (user_id, school_name, location, description, min_fee, max_fee, programs, contact_email, contact_phone, website)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        payload.school_name,
        payload.location,
        payload.description || '',
        payload.min_fee || 0,
        payload.max_fee || 0,
        payload.programs || '',
        payload.contact_email || '',
        payload.contact_phone || '',
        payload.website || ''
      ]
    );
    return res.status(201).json({ message: 'School profile created' });
  } catch (error) {
    console.error('Create school profile error:', error);
    return res.status(500).json({ error: 'Failed to create school profile' });
  }
});

router.get('/profile', authenticateToken, requireSchool, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM school_profiles WHERE user_id = ?', [req.user.userId]);
    return res.json({ profile: rows[0] || null });
  } catch (error) {
    console.error('Get school profile error:', error);
    return res.status(500).json({ error: 'Failed to fetch school profile' });
  }
});

router.put('/profile', authenticateToken, requireSchool, async (req, res) => {
  try {
    const userId = req.user.userId;
    const payload = req.body;
    const [existing] = await db.query('SELECT id FROM school_profiles WHERE user_id = ?', [userId]);
    if (!existing.length) return res.status(404).json({ error: 'School profile not found' });
    await db.query(
      `UPDATE school_profiles
       SET school_name=?, location=?, description=?, min_fee=?, max_fee=?, programs=?, contact_email=?, contact_phone=?, website=?
       WHERE user_id=?`,
      [
        payload.school_name,
        payload.location,
        payload.description || '',
        payload.min_fee || 0,
        payload.max_fee || 0,
        payload.programs || '',
        payload.contact_email || '',
        payload.contact_phone || '',
        payload.website || '',
        userId
      ]
    );
    return res.json({ message: 'School profile updated' });
  } catch (error) {
    console.error('Update school profile error:', error);
    return res.status(500).json({ error: 'Failed to update school profile' });
  }
});

router.get('/messages', authenticateToken, requireSchool, async (req, res) => {
  try {
    const [profile] = await db.query('SELECT school_id, id FROM school_profiles WHERE user_id = ?', [req.user.userId]);
    if (!profile.length) return res.json({ messages: [] });
    const schoolId = profile[0].school_id || profile[0].id;
    const [messages] = await db.query(
      `SELECT m.*, u.name AS student_name
       FROM messages m
       LEFT JOIN users u ON u.id = m.sender_id
       WHERE m.school_id = ?
       ORDER BY m.created_at DESC`,
      [schoolId]
    );
    return res.json({ messages });
  } catch (error) {
    console.error('School messages error:', error);
    return res.status(500).json({ error: 'Failed to fetch school messages' });
  }
});

module.exports = router;
