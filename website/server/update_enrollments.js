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
  
  await addColumn('enrollments', 'course_id', 'INT');
  await addColumn('enrollments', 'status', "ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'");
  await addColumn('enrollments', 'student_phone', 'VARCHAR(20)');
  await addColumn('enrollments', 'message', 'TEXT');
  
  // Add foreign key if it doesn't exist
  connection.query("SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = 'urbon' AND TABLE_NAME = 'enrollments' AND CONSTRAINT_NAME = 'fk_enrollment_course'", (err, results) => {
    if (results && results.length === 0) {
        connection.query("ALTER TABLE enrollments ADD CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL", (err) => {
            if (err) console.error('Error adding FK:', err);
            else console.log('Added foreign key constraint');
            process.exit();
        });
    } else {
        console.log('FK constraint already exists');
        process.exit();
    }
  });
});
