const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'urbon'
});

const alterQueries = [
  "ALTER TABLE tutors ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';",
  "ALTER TABLE tutors ADD COLUMN google_meet_link VARCHAR(255);",
  "ALTER TABLE tutors ADD COLUMN resume_url VARCHAR(255);",
  "ALTER TABLE tutors ADD COLUMN id_proof_url VARCHAR(255);",
  "ALTER TABLE tutors ADD COLUMN certificate_url VARCHAR(255);",
  "ALTER TABLE tutors ADD COLUMN payment_status ENUM('unpaid', 'paid', 'pending') DEFAULT 'unpaid';"
];

async function updateDb() {
  for (let query of alterQueries) {
    try {
      await connection.promise().query(query);
      console.log('Executed:', query.split(' ')[2] + ' column added/checked.');
    } catch (err) {
      console.log('Skipping or Error:', err.message);
    }
  }
  console.log('Database update complete.');
  process.exit();
}

updateDb();
