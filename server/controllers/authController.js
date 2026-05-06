const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'schoolconnect_secret_2026';

class AuthController {
    // Register new user
    static async register(req, res) {
        try {
            const { name, email, password, role = 'user' } = req.body;

            // Validate input
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Name, email, and password are required' });
            }

            // Check if user already exists
            const checkUserQuery = 'SELECT id FROM users WHERE email = ?';
            const [existingUsers] = await db.query(checkUserQuery, [email]);

            if (existingUsers.length > 0) {
                return res.status(409).json({ error: 'Email already registered' });
            }

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert new user
            const insertQuery = `
                INSERT INTO users (name, email, password, role) 
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await db.query(insertQuery, [name, email, hashedPassword, role]);

            // Get created user
            const getUserQuery = 'SELECT id, name, email, role FROM users WHERE id = ?';
            const [newUser] = await db.query(getUserQuery, [result.insertId]);

            // Generate JWT token
            const token = jwt.sign(
                { userId: newUser[0].id, email: newUser[0].email, role: newUser[0].role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: newUser[0]
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Registration failed. Please try again.' });
        }
    }

    // Login user
    static async login(req, res) {
        try {
            const { email, password, role } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // Find user by email
            const getUserQuery = 'SELECT id, name, email, password, role FROM users WHERE email = ?';
            const [users] = await db.query(getUserQuery, [email]);

            if (users.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const user = users[0];

            // Check if role matches (if provided)
            if (role && user.role !== role) {
                return res.status(401).json({ error: `Invalid login for ${role} role` });
            }

            // Compare passwords
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;

            res.json({
                message: 'Login successful',
                token,
                user: userWithoutPassword
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed. Please try again.' });
        }
    }

    // Get user profile
    static async getProfile(req, res) {
        try {
            const userId = req.user.userId;

            const getUserQuery = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
            const [users] = await db.query(getUserQuery, [userId]);

            if (users.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ user: users[0] });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ error: 'Failed to get profile' });
        }
    }

    // Update user profile
    static async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const { name, email, password } = req.body;

            // Build update query dynamically
            let updateQuery = 'UPDATE users SET ';
            const updateFields = [];
            const updateValues = [];

            if (name) {
                updateFields.push('name = ?');
                updateValues.push(name);
            }

            if (email) {
                // Check if email is already taken by another user
                const checkEmailQuery = 'SELECT id FROM users WHERE email = ? AND id != ?';
                const [existingUsers] = await db.query(checkEmailQuery, [email, userId]);

                if (existingUsers.length > 0) {
                    return res.status(400).json({ error: 'Email is already taken' });
                }

                updateFields.push('email = ?');
                updateValues.push(email);
            }

            if (password) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                updateFields.push('password = ?');
                updateValues.push(hashedPassword);
            }

            if (updateFields.length === 0) {
                return res.status(400).json({ error: 'No fields to update' });
            }

            updateQuery += updateFields.join(', ') + ' WHERE id = ?';
            updateValues.push(userId);

            await db.query(updateQuery, updateValues);

            // Get updated user
            const getUserQuery = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
            const [updatedUser] = await db.query(getUserQuery, [userId]);

            res.json({
                message: 'Profile updated successfully',
                user: updatedUser[0]
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ error: 'Failed to update profile' });
        }
    }

    // Get admin statistics
    static async getStats(req, res) {
        try {
            const [userCount] = await db.query('SELECT COUNT(*) as count FROM users');
            const [schoolCount] = await db.query('SELECT COUNT(*) as count FROM schools');
            const [messageCount] = await db.query('SELECT COUNT(*) as count FROM messages');

            res.json({
                totalUsers: userCount[0].count,
                totalSchools: schoolCount[0].count,
                totalMessages: messageCount[0].count
            });

        } catch (error) {
            console.error('Get stats error:', error);
            res.status(500).json({ error: 'Failed to get statistics' });
        }
    }

    // Get admin messages
    static async getMessages(req, res) {
        try {
            const getMessagesQuery = `
                SELECT m.*, u.name as sender_name, u.email as sender_email, s.name as school_name
                FROM messages m
                JOIN users u ON m.sender_id = u.id
                JOIN schools s ON m.school_id = s.id
                ORDER BY m.created_at DESC
            `;

            const [messages] = await db.query(getMessagesQuery);

            res.json({ messages });

        } catch (error) {
            console.error('Get messages error:', error);
            res.status(500).json({ error: 'Failed to get messages' });
        }
    }

    // Admin: Get all users
    static async getAllUsers(req, res) {
        try {
            const getUsersQuery = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
            const [users] = await db.query(getUsersQuery);

            res.json({ users });
        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({ error: 'Failed to get users' });
        }
    }

    // Admin: Delete user
    static async deleteUser(req, res) {
        try {
            const { userId } = req.params;

            // Prevent admin from deleting themselves
            if (parseInt(userId) === req.user.userId) {
                return res.status(400).json({ error: 'Cannot delete your own account' });
            }

            const deleteQuery = 'DELETE FROM users WHERE id = ?';
            const [result] = await db.query(deleteQuery, [userId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }

    // Admin: Update user role
    static async updateUserRole(req, res) {
        try {
            const { userId } = req.params;
            const { role } = req.body;

            if (!['admin', 'user', 'school'].includes(role)) {
                return res.status(400).json({ error: 'Invalid role. Must be admin, user or school' });
            }

            // Prevent changing own role to user if only admin
            if (parseInt(userId) === req.user.userId && role === 'user') {
                const checkAdminsQuery = 'SELECT COUNT(*) as adminCount FROM users WHERE role = "admin"';
                const [adminCount] = await db.query(checkAdminsQuery);
                if (adminCount[0].adminCount <= 1) {
                    return res.status(400).json({ error: 'Cannot change role. At least one admin must remain.' });
                }
            }

            const updateQuery = 'UPDATE users SET role = ? WHERE id = ?';
            const [result] = await db.query(updateQuery, [role, userId]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'User role updated successfully' });
        } catch (error) {
            console.error('Update user role error:', error);
            res.status(500).json({ error: 'Failed to update user role' });
        }
    }
}

module.exports = AuthController;
