const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const schoolId = req.body.school_id || req.body.schoolId;
    const { subject, message } = req.body;
    if (!schoolId || !subject || !message) {
      return res.status(400).json({ error: 'school_id, subject and message are required' });
    }

    const [result] = await db.query(
      'INSERT INTO messages (sender_id, school_id, subject, message) VALUES (?, ?, ?, ?)',
      [req.user.userId, schoolId, subject, message]
    );

    return res.status(201).json({ message: 'Message sent successfully', id: result.insertId });
  } catch (error) {
    console.error('Create message error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

router.get('/my', authenticateToken, async (req, res) => {
  try {
    const [messages] = await db.query(
      `SELECT m.*, s.name AS school_name
       FROM messages m
       LEFT JOIN schools s ON s.id = m.school_id
       WHERE m.sender_id = ?
       ORDER BY m.created_at DESC`,
      [req.user.userId]
    );
    return res.json({ messages });
  } catch (error) {
    console.error('My messages error:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [messages] = await db.query(
      `SELECT m.*, u.name AS sender_name, s.name AS school_name
       FROM messages m
       LEFT JOIN users u ON u.id = m.sender_id
       LEFT JOIN schools s ON s.id = m.school_id
       ORDER BY m.created_at DESC`
    );
    return res.json({ messages });
  } catch (error) {
    console.error('All messages error:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/:id/reply', authenticateToken, async (req, res) => {
  try {
    const { reply } = req.body;
    await db.query('UPDATE messages SET status = "replied", message = CONCAT(message, ? ) WHERE id = ?', [`\n\nReply: ${reply}`, req.params.id]);
    return res.json({ message: 'Reply sent' });
  } catch (error) {
    console.error('Reply message error:', error);
    return res.status(500).json({ error: 'Failed to send reply' });
  }
});

module.exports = router;
