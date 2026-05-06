const mysql = require('mysql2');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root', // Change this to your MySQL username
  password: '', // Change this to your MySQL password
  database: 'school_connect_rwanda'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

module.exports = promisePool;