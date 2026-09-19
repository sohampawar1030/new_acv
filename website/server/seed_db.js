const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'urbon'
});

const seedQueries = [
  "INSERT IGNORE INTO categories (name, icon) VALUES ('Tuition', 'school'), ('Languages', 'language'), ('Hobbies', 'palette'), ('IT Courses', 'code'), ('Exam Prep', 'assignment');",
  "INSERT IGNORE INTO users (name, email, password, role) VALUES ('Rahul Sharma', 'rahul@example.com', 'pass123', 'tutor'), ('Priya Patel', 'priya@example.com', 'pass123', 'tutor'), ('Amit Verma', 'amit@example.com', 'pass123', 'tutor'), ('Admin', 'admin@urbonpro.com', 'admin123', 'admin');",
  "INSERT IGNORE INTO tutors (user_id, bio, experience, rating, photo_url, location, price_per_hour, status, google_meet_link) VALUES (1, 'Expert Math tutor with 10 years of experience.', 10, 4.8, 'https://images.unsplash.com/photo-1599566150163-29194dcaad36', 'Bangalore', 500, 'approved', 'https://meet.google.com/abc-defg-hij'), (2, 'Certified Spanish instructor.', 5, 4.9, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', 'Mumbai', 700, 'approved', 'https://meet.google.com/xyz-pqrs-uvw'), (3, 'Full stack developer teaching MERN.', 8, 4.7, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'Delhi', 1000, 'approved', 'https://meet.google.com/mno-stuv-wxyz');",
  "INSERT IGNORE INTO enrollments (student_id, tutor_id, amount, fee_status) VALUES (4, 1, 5000, 'paid'), (4, 2, 3500, 'pending');"
];

async function seed() {
  for (let query of seedQueries) {
    try {
      await connection.promise().query(query);
      console.log('Seeded data...');
    } catch (err) {
      console.error('Error seeding data:', err.message);
    }
  }
  console.log('Seeding complete.');
  process.exit();
}

seed();
