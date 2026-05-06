const db = require('../config/database');

class School {
  // Get all schools
  static async getAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM schools');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Search schools by fee range and location
  static async search(minFee, maxFee, location) {
    try {
      const query = 'SELECT * FROM schools WHERE min_fee <= ? AND max_fee >= ? AND location LIKE ?';
      const [rows] = await db.execute(query, [maxFee, minFee, '%' + location + '%']);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = School;
