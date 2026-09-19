const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'urbon'
});

const query = "ALTER TABLE courses ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' AFTER duration;";

connection.query(query, (err, results) => {
  if (err) {
    if (err.errno === 1060) {
      console.log("Column 'status' already exists in 'courses' table.");
    } else {
      console.error('Error adding column:', err.message);
    }
  } else {
    console.log("Column 'status' added successfully to 'courses' table.");
  }
  process.exit();
});
