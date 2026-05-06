const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/school-profiles', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT sp.*, u.email AS owner_email
       FROM school_profiles sp
       JOIN users u ON u.id = sp.user_id
       ORDER BY sp.created_at DESC`
    );
    return res.json({ profiles: rows });
  } catch (error) {
    console.error('List school profiles error:', error);
    return res.status(500).json({ error: 'Failed to fetch school profiles' });
  }
});

router.put('/school-profiles/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.query('UPDATE school_profiles SET status = "approved" WHERE id = ?', [req.params.id]);
    return res.json({ message: 'School profile approved' });
  } catch (error) {
    console.error('Approve school profile error:', error);
    return res.status(500).json({ error: 'Failed to approve profile' });
  }
});

router.put('/school-profiles/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.query('UPDATE school_profiles SET status = "rejected" WHERE id = ?', [req.params.id]);
    return res.json({ message: 'School profile rejected' });
  } catch (error) {
    console.error('Reject school profile error:', error);
    return res.status(500).json({ error: 'Failed to reject profile' });
  }
});

module.exports = router;
