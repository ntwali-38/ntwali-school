const mysql = require('mysql2/promise');

async function createDatabase() {
  let connection;

  try {
    console.log('Connecting to MySQL...');
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    console.log('Creating database...');
    await connection.execute('CREATE DATABASE IF NOT EXISTS school_connect_rwanda');

    await connection.end();

    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'school_connect_rwanda'
    });

    console.log('Creating table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        min_fee INT NOT NULL,
        max_fee INT NOT NULL,
        programs TEXT NOT NULL
      )
    `);

    console.log('Inserting sample data...');
    const schools = [
      ['Kigali International Community School', 'Kigali', 1500000, 3000000, 'International Baccalaureate, Cambridge IGCSE, Science, Arts'],
      ['Lycee de Kigali', 'Kigali', 800000, 1500000, 'French Curriculum, Science, Literature, Technical'],
      ['Green Hills Academy', 'Kigali', 1200000, 2500000, 'American Curriculum, STEM, Arts, Sports'],
      ['Rwanda Coding Academy', 'Kigali', 500000, 1000000, 'Computer Science, Web Development, Mobile Apps'],
      ['Musanze Secondary School', 'Musanze', 200000, 600000, 'General Education, Agriculture, Science'],
      ['Huye Technical School', 'Huye', 300000, 800000, 'Technical Education, Engineering, Business'],
      ['Nyamirambo Boys Secondary School', 'Kigali', 150000, 400000, 'General Education, Science, Arts'],
      ['Gisagara Girls Secondary School', 'Gisagara', 100000, 350000, 'General Education, Home Economics, Science'],
      ['Rubavu Technical College', 'Rubavu', 400000, 900000, 'Technical Education, Tourism, ICT'],
      ['Muhanga Secondary School', 'Muhanga', 180000, 500000, 'General Education, Agriculture, Arts']
    ];

    for (const school of schools) {
      await connection.execute(
        'INSERT INTO schools (name, location, min_fee, max_fee, programs) VALUES (?, ?, ?, ?, ?)',
        school
      );
    }

    console.log('Database setup completed successfully!');
    console.log('Sample data inserted.');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createDatabase();