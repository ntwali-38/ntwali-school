const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
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

    console.log('Closing initial connection...');
    await connection.end();

    console.log('Connecting to the new database...');
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'school_connect_rwanda'
    });

    console.log('Creating tables...');
    // Drop tables if they exist to ensure clean setup
    await connection.execute('DROP TABLE IF EXISTS messages');
    await connection.execute('DROP TABLE IF EXISTS users');
    await connection.execute('DROP TABLE IF EXISTS schools');
    
    // Create tables
    const createSchoolsTable = `
      CREATE TABLE schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        min_fee INT NOT NULL,
        max_fee INT NOT NULL,
        programs TEXT NOT NULL,
        description TEXT,
        contact_email VARCHAR(255),
        contact_phone VARCHAR(20),
        website VARCHAR(255)
      )
    `;
    
    const createUsersTable = `
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    const createMessagesTable = `
      CREATE TABLE messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        school_id INT NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
      )
    `;
    
    await connection.execute(createSchoolsTable);
    await connection.execute(createUsersTable);
    await connection.execute(createMessagesTable);
    
    // Insert sample schools
    const insertSchools = `
      INSERT IGNORE INTO schools (name, location, min_fee, max_fee, programs, description, contact_email, contact_phone, website) VALUES
      ('Kigali International Community School', 'Kigali', 1500000, 3000000, 'International Baccalaureate, Cambridge IGCSE, Science, Arts', 'A premier international school offering world-class education with IB curriculum.', 'info@kics.edu.rw', '+250 788 123 456', 'https://kics.edu.rw'),
      ('Lycee de Kigali', 'Kigali', 800000, 1500000, 'French Curriculum, Science, Literature, Technical', 'Traditional French education with modern facilities and comprehensive programs.', 'contact@lyceedekigali.rw', '+250 788 234 567', 'https://lyceedekigali.rw'),
      ('Green Hills Academy', 'Kigali', 1200000, 2500000, 'American Curriculum, STEM, Arts, Sports', 'American-style education focusing on STEM and holistic development.', 'admissions@greenhills.rw', '+250 788 345 678', 'https://greenhills.rw'),
      ('Rwanda Coding Academy', 'Kigali', 500000, 1000000, 'Computer Science, Web Development, Mobile Apps', 'Specialized coding school preparing students for tech careers.', 'hello@rwandacoding.rw', '+250 788 456 789', 'https://rwandacoding.rw'),
      ('Musanze Secondary School', 'Musanze', 200000, 600000, 'General Education, Agriculture, Science', 'Community-focused school with strong agricultural programs.', 'info@musanzesecondary.rw', '+250 788 567 890', 'https://musanzesecondary.rw'),
      ('Huye Technical School', 'Huye', 300000, 800000, 'Technical Education, Engineering, Business', 'Technical education center for engineering and business studies.', 'admissions@huyetech.rw', '+250 788 678 901', 'https://huyetech.rw'),
      ('Nyamirambo Boys Secondary School', 'Kigali', 150000, 400000, 'General Education, Science, Arts', 'Traditional boys school with excellent academic record.', 'contact@nyamirambo.edu.rw', '+250 788 789 012', 'https://nyamirambo.edu.rw'),
      ('Gisagara Girls Secondary School', 'Gisagara', 100000, 350000, 'General Education, Home Economics, Science', 'Empowering girls through quality education and leadership.', 'info@gisagaragirls.rw', '+250 788 890 123', 'https://gisagaragirls.rw')
    `;
    
    await connection.execute(insertSchools);

    console.log('Seeding admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id',
      ['Admin User', 'admin@schoolconnect.rw', adminPassword, 'admin']
    );

    console.log('Database setup completed successfully!');
    console.log('Admin credentials:');
    console.log('Email: admin@schoolconnect.rw');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();