const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'urbon'
});

const alterQueries = [
  "ALTER TABLE tutors ADD COLUMN specialization VARCHAR(255) AFTER price_per_hour;",
  "ALTER TABLE tutors ADD COLUMN skills TEXT AFTER specialization;"
];

async function updateDb() {
  for (let query of alterQueries) {
    try {
      await connection.promise().query(query);
      console.log('Executed:', query);
    } catch (err) {
      console.log('Skipping or Already Exists:', err.message);
    }
  }

  // Seed some data for Class 12 Tuition testing
  try {
    const [tutors] = await connection.promise().query("SELECT id FROM tutors LIMIT 5");
    if (tutors.length > 0) {
      // Set the first tutor as a Class 12 specialist
      await connection.promise().query(
        "UPDATE tutors SET specialization = 'Class 12 Tuition', skills = 'Mathematics, Physics' WHERE id = ?",
        [tutors[0].id]
      );
      console.log(`Updated tutor ID ${tutors[0].id} with Class 12 specialization for testing.`);
    }
  } catch (err) {
    console.error('Error seeding test data:', err.message);
  }

  console.log('Database update complete.');
  process.exit();
}

updateDb();
