const mysql = require('mysql2');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_connect_rwanda'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

module.exports = promisePool;