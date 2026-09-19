const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'urbon'
});

const addColumn = (table, column, definition) => {
  return new Promise((resolve) => {
    const checkQuery = `SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'urbon' AND TABLE_NAME = '${table}' AND COLUMN_NAME = '${column}'`;
    connection.query(checkQuery, (err, results) => {
      if (err) {
        console.error('Error checking column:', err);
        return resolve();
      }
      if (results.length === 0) {
        const addQuery = `ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`;
        connection.query(addQuery, (err) => {
          if (err) console.error('Error adding column:', err);
          else console.log(`Added ${column} to ${table}`);
          resolve();
        });
      } else {
        console.log(`Column ${column} already exists in ${table}`);
        resolve();
      }
    });
  });
};

connection.connect(async (err) => {
  if (err) {
    console.error('Error connecting:', err);
    return;
  }
  
  await addColumn('enrollments', 'fee_status', "ENUM('pending', 'paid') DEFAULT 'pending'");
  
  process.exit();
});
