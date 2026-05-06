const db = require('../db');

class SchoolController {
    // Get all schools
    static async getAllSchools(req, res) {
        try {
            const query = `
                SELECT DISTINCT id, name, location, min_fee, max_fee, programs, description, contact_email, contact_phone, website, image_url
                FROM schools
                ORDER BY name
            `;
            const [schools] = await db.query(query);
            res.json(schools);
        } catch (error) {
            console.error('Error fetching schools:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get school by ID
    static async getSchoolById(req, res) {
        try {
            const { id } = req.params;
            const query = 'SELECT * FROM schools WHERE id = ?';
            const [schools] = await db.query(query, [parseInt(id, 10)]);

            if (schools.length === 0) {
                return res.status(404).json({ error: 'School not found' });
            }

            res.json(schools[0]);
        } catch (error) {
            console.error('Error fetching school by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Search schools
    static async searchSchools(req, res) {
        try {
            const { minFee, maxFee, location, program } = req.body;

            // Build query dynamically
            let query = 'SELECT * FROM schools WHERE 1=1';
            const params = [];

            if (minFee) {
                query += ' AND min_fee >= ?';
                params.push(parseInt(minFee));
            }

            if (maxFee) {
                query += ' AND max_fee <= ?';
                params.push(parseInt(maxFee));
            }

            if (location) {
                query += ' AND location LIKE ?';
                params.push(`%${location}%`);
            }

            if (program) {
                query += ' AND programs LIKE ?';
                params.push(`%${program}%`);
            }

            query += ' ORDER BY name';

            const [schools] = await db.query(query, params);
            res.json(schools);
        } catch (error) {
            console.error('Error searching schools:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Create new school (admin only)
    static async createSchool(req, res) {
        try {
            const {
                name,
                location,
                min_fee,
                max_fee,
                programs,
                description,
                contact_email,
                contact_phone,
                website,
                image_url
            } = req.body;

            // Validate required fields
            if (!name || !location || !min_fee || !max_fee || !programs) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const query = `
                INSERT INTO schools (
                    name, location, min_fee, max_fee, programs, 
                    description, contact_email, contact_phone, website, image_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const [result] = await db.query(query, [
                name, location, parseInt(min_fee), parseInt(max_fee), programs,
                description, contact_email, contact_phone, website, image_url
            ]);

            res.status(201).json({
                message: 'School created successfully',
                schoolId: result.insertId
            });

        } catch (error) {
            console.error('Error creating school:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Update school (admin only)
    static async updateSchool(req, res) {
        try {
            const { id } = req.params;
            const {
                name,
                location,
                min_fee,
                max_fee,
                programs,
                description,
                contact_email,
                contact_phone,
                website,
                image_url
            } = req.body;

            // Check if school exists
            const [existingSchool] = await db.query('SELECT id FROM schools WHERE id = ?', [id]);
            if (existingSchool.length === 0) {
                return res.status(404).json({ error: 'School not found' });
            }

            // Build update query dynamically
            let updateQuery = 'UPDATE schools SET ';
            const updateFields = [];
            const updateValues = [];

            if (name) {
                updateFields.push('name = ?');
                updateValues.push(name);
            }

            if (location) {
                updateFields.push('location = ?');
                updateValues.push(location);
            }

            if (min_fee) {
                updateFields.push('min_fee = ?');
                updateValues.push(parseInt(min_fee));
            }

            if (max_fee) {
                updateFields.push('max_fee = ?');
                updateValues.push(parseInt(max_fee));
            }

            if (programs) {
                updateFields.push('programs = ?');
                updateValues.push(programs);
            }

            if (description !== undefined) {
                updateFields.push('description = ?');
                updateValues.push(description);
            }

            if (contact_email !== undefined) {
                updateFields.push('contact_email = ?');
                updateValues.push(contact_email);
            }

            if (contact_phone !== undefined) {
                updateFields.push('contact_phone = ?');
                updateValues.push(contact_phone);
            }

            if (website !== undefined) {
                updateFields.push('website = ?');
                updateValues.push(website);
            }

            if (image_url !== undefined) {
                updateFields.push('image_url = ?');
                updateValues.push(image_url);
            }

            if (updateFields.length === 0) {
                return res.status(400).json({ error: 'No fields to update' });
            }

            updateQuery += updateFields.join(', ') + ' WHERE id = ?';
            updateValues.push(id);

            await db.query(updateQuery, updateValues);

            res.json({ message: 'School updated successfully' });

        } catch (error) {
            console.error('Error updating school:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Delete school (admin only)
    static async deleteSchool(req, res) {
        try {
            const { id } = req.params;

            // Check if school exists
            const [existingSchool] = await db.query('SELECT id FROM schools WHERE id = ?', [id]);
            if (existingSchool.length === 0) {
                return res.status(404).json({ error: 'School not found' });
            }

            await db.query('DELETE FROM schools WHERE id = ?', [id]);

            res.json({ message: 'School deleted successfully' });

        } catch (error) {
            console.error('Error deleting school:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = SchoolController;
