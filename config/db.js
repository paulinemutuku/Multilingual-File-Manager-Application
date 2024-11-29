const mysql = require('mysql2');

// Create a connection pool to handle multiple connections efficiently
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ericalivia@2004',
  database: 'multilingual_file_manager_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool for use in other parts of the application
module.exports = pool;

// Function to create tables if they do not exist
const createTables = () => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS files (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      path VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS uploads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      filename VARCHAR(255) NOT NULL,
      path VARCHAR(255) NOT NULL,
      size INT NOT NULL,
      type VARCHAR(255) NOT NULL,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`,
    `CREATE TABLE IF NOT EXISTS user(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
    );`
  ];

  tables.forEach((sql) => {
    pool.query(sql, (err, results) => {
      if (err) {
        console.error('Error creating table:', err);
        return;
      }
      console.log('Table created or already exists.');
    });
  });
};

// Call the function to ensure tables are created
createTables();
