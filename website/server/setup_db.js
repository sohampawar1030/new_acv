const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root'
});

const queries = [
  "CREATE DATABASE IF NOT EXISTS urbon;",
  "USE urbon;",
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'tutor') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS tutors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    bio TEXT,
    experience INT,
    rating DECIMAL(3, 2) DEFAULT 0,
    photo_url VARCHAR(255),
    location VARCHAR(255),
    price_per_hour DECIMAL(10, 2),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    google_meet_link VARCHAR(255),
    resume_url VARCHAR(255),
    id_proof_url VARCHAR(255),
    certificate_url VARCHAR(255),
    payment_status ENUM('unpaid', 'paid', 'pending') DEFAULT 'unpaid',
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`,
  `CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(255)
  );`,
  `CREATE TABLE IF NOT EXISTS tutor_categories (
    tutor_id INT,
    category_id INT,
    PRIMARY KEY (tutor_id, category_id),
    FOREIGN KEY (tutor_id) REFERENCES tutors(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );`,
  `CREATE TABLE IF NOT EXISTS enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    tutor_id INT,
    amount DECIMAL(10, 2),
    fee_status ENUM('pending', 'paid') DEFAULT 'pending',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (tutor_id) REFERENCES tutors(id)
  );`,
  `CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT,
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255),
    student_phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES tutors(id)
  );`,
  `CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    duration VARCHAR(100),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES tutors(id)
  );`
];

async function setup() {
  for (let query of queries) {
    try {
      await connection.promise().query(query);
      console.log('Executed:', query.substring(0, 50) + '...');
    } catch (err) {
      console.error('Error executing query:', err.message);
    }
  }
  console.log('Database setup complete.');
  process.exit();
}

setup();
