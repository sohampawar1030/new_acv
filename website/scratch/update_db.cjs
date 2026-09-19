const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'urbon'
});

const alterQueries = [
  "ALTER TABLE tutors ADD COLUMN IF NOT EXISTS status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';",
  "ALTER TABLE tutors ADD COLUMN IF NOT EXISTS google_meet_link VARCHAR(255);",
  "ALTER TABLE tutors ADD COLUMN IF NOT EXISTS resume_url VARCHAR(255);",
  "ALTER TABLE tutors ADD COLUMN IF NOT EXISTS id_proof_url VARCHAR(255);",
  "ALTER TABLE tutors ADD COLUMN IF NOT EXISTS certificate_url VARCHAR(255);",
  "ALTER TABLE tutors ADD COLUMN IF NOT EXISTS payment_status ENUM('unpaid', 'paid', 'pending') DEFAULT 'unpaid';"
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
