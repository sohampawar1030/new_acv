const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const connection = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(uploadDir));

// Multer Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Basic Route
app.get('/', (req, res) => {
  res.send('Urbon Pro API is running');
});

// Get all tutors or search
app.get('/api/tutors', (req, res) => {
  const { q, loc } = req.query;
  let query = "SELECT users.name, tutors.* FROM tutors JOIN users ON tutors.user_id = users.id WHERE tutors.status = 'approved'";
  let params = [];

  if (q || loc) {
    if (q) {
      query += ' AND (users.name LIKE ? OR tutors.bio LIKE ? OR tutors.specialization LIKE ? OR tutors.skills LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (loc) {
      query += ' AND tutors.location LIKE ?';
      params.push(`%${loc}%`);
    }
  }

  connection.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get single tutor
app.get('/api/tutors/:id', (req, res) => {
  const query = `
    SELECT users.name, users.email, tutors.* 
    FROM tutors 
    JOIN users ON tutors.user_id = users.id 
    WHERE tutors.id = ?
  `;
  connection.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Tutor not found' });
    res.json(results[0]);
  });
});

// Admin: Get all tutors
app.get('/api/admin/tutors', (req, res) => {
  const query = "SELECT users.name, users.email, tutors.* FROM tutors JOIN users ON tutors.user_id = users.id ORDER BY tutors.id DESC";
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Admin: Update tutor status
app.post('/api/admin/tutors/status', (req, res) => {
  const { id, status, payment_status } = req.body;
  const query = "UPDATE tutors SET status = ?, payment_status = ? WHERE id = ?";
  connection.query(query, [status, payment_status, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tutor status updated successfully' });
  });
});

// Admin: Get all courses for approval
app.get('/api/admin/courses', (req, res) => {
  const query = `
    SELECT courses.*, users.name as tutor_name 
    FROM courses 
    JOIN tutors ON courses.tutor_id = tutors.id 
    JOIN users ON tutors.user_id = users.id 
    WHERE courses.status = 'pending' 
    ORDER BY courses.created_at DESC
  `;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Admin: Update course status
app.post('/api/admin/courses/status', (req, res) => {
  const { id, status } = req.body;
  const query = "UPDATE courses SET status = ? WHERE id = ?";
  connection.query(query, [status, id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `Course ${status} successfully` });
  });
});

// User Signup
app.post('/api/signup', (req, res) => {
  const { name, email, password, role, city } = req.body;
  
  const userQuery = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
  
  connection.query(userQuery, [name, email, password, role], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const userId = result.insertId;
    
    if (role === 'tutor') {
      const tutorQuery = "INSERT INTO tutors (user_id, location, status) VALUES (?, ?, 'pending')";
      connection.query(tutorQuery, [userId, city], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Tutor registered and awaiting approval', userId });
      });
    } else {
      res.json({ message: 'Student registered successfully', userId });
    }
  });
});

// Get students for a tutor
app.get('/api/tutors/:id/students', (req, res) => {
  const query = `
    SELECT users.name, users.email, enrollments.amount, enrollments.fee_status, enrollments.enrolled_at 
    FROM enrollments 
    JOIN users ON enrollments.student_id = users.id 
    WHERE enrollments.tutor_id = ?
  `;
  connection.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// User Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // First check if email exists
  const checkEmailQuery = "SELECT id FROM users WHERE email = ?";
  connection.query(checkEmailQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (results.length === 0) {
      return res.status(401).json({ message: 'This email ID is not in our database. Please sign up to create an account.' });
    }

    // Email exists, now check password
    const query = "SELECT users.*, tutors.id as tutor_id FROM users LEFT JOIN tutors ON users.id = tutors.user_id WHERE users.email = ? AND users.password = ?";
    connection.query(query, [email, password], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(401).json({ message: 'Password चुकीचा आहे, कृपया पुन्हा प्रयत्न करा' });
      
      const user = results[0];
      res.json({ 
        id: user.id, 
        role: user.role, 
        tutor_id: user.tutor_id,
        name: user.name 
      });
    });
  });
});

// Upload Endpoint
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Update Tutor Profile
app.post('/api/tutors/profile', (req, res) => {
  const { tutor_id, bio, experience, price_per_hour, location, photo_url, specialization, skills, resume_url, id_proof_url, certificate_url, payment_status } = req.body;
  const query = "UPDATE tutors SET bio = ?, experience = ?, price_per_hour = ?, location = ?, photo_url = ?, specialization = ?, skills = ?, resume_url = ?, id_proof_url = ?, certificate_url = ?, payment_status = ?, is_submitted = TRUE WHERE id = ?";
  connection.query(query, [bio, experience, price_per_hour, location, photo_url, specialization, skills, resume_url, id_proof_url, certificate_url, payment_status, tutor_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Profile updated successfully' });
  });
});

// Delete Tutor and Revoke Access (Cascading)
app.delete('/api/admin/tutors/:id', (req, res) => {
  const { id } = req.params;
  
  const getUserIdQuery = "SELECT user_id FROM tutors WHERE id = ?";
  connection.query(getUserIdQuery, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Tutor not found' });
    
    const userId = results[0].user_id;
    
    // 1. Delete from child tables first to avoid FK errors
    const deleteCategories = "DELETE FROM tutor_categories WHERE tutor_id = ?";
    const deleteEnrollments = "DELETE FROM enrollments WHERE tutor_id = ?";
    const deleteTutor = "DELETE FROM tutors WHERE id = ?";
    const deleteUser = "DELETE FROM users WHERE id = ?";

    connection.query(deleteCategories, [id], (err) => {
      if (err) console.error('Error deleting categories:', err);
      
      connection.query(deleteEnrollments, [id], (err) => {
        if (err) console.error('Error deleting enrollments:', err);
        
        connection.query(deleteTutor, [id], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          
          connection.query(deleteUser, [userId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Tutor and all associated records deleted successfully' });
          });
        });
      });
    });
  });
});

// Create Enrollment Request
app.post('/api/enroll', (req, res) => {
  const { student_id, tutor_id, course_id, amount, student_phone, message } = req.body;
  const query = "INSERT INTO enrollments (student_id, tutor_id, course_id, amount, status, student_phone, message) VALUES (?, ?, ?, ?, 'pending', ?, ?)";
  connection.query(query, [student_id, tutor_id, course_id, amount, student_phone, message], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Enrollment request sent successfully', id: result.insertId });
  });
});

// Update Enrollment Status (Approve/Reject)
app.patch('/api/enrollments/:id/status', (req, res) => {
  const { status } = req.body;
  const query = "UPDATE enrollments SET status = ? WHERE id = ?";
  connection.query(query, [status, req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `Enrollment ${status} successfully` });
  });
});

// Update Fee Status Manually
app.patch('/api/enrollments/:id/fee-status', (req, res) => {
  const { fee_status } = req.body;
  const query = "UPDATE enrollments SET fee_status = ? WHERE id = ?";
  connection.query(query, [fee_status, req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Fee status updated successfully' });
  });
});

// Get Student's Enrollments
app.get('/api/student/enrollments/:studentId', (req, res) => {
  const query = `
    SELECT enrollments.*, users.name as tutor_name, tutors.photo_url, tutors.specialization, courses.title as course_title 
    FROM enrollments 
    JOIN tutors ON enrollments.tutor_id = tutors.id 
    JOIN users ON tutors.user_id = users.id 
    LEFT JOIN courses ON enrollments.course_id = courses.id
    WHERE enrollments.student_id = ?
    ORDER BY enrollments.enrolled_at DESC
  `;
  connection.query(query, [req.params.studentId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get Tutor's Enrollments (including pending requests)
app.get('/api/tutor/enrollments/:tutorId', (req, res) => {
  const query = `
    SELECT enrollments.*, users.name as student_name, users.email as student_email, courses.title as course_title 
    FROM enrollments 
    JOIN users ON enrollments.student_id = users.id 
    LEFT JOIN courses ON enrollments.course_id = courses.id
    WHERE enrollments.tutor_id = ?
    ORDER BY enrollments.enrolled_at DESC
  `;
  connection.query(query, [req.params.tutorId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Send Inquiry
app.post('/api/inquiries', (req, res) => {
  const { tutor_id, student_name, student_email, student_phone, subject, message } = req.body;
  const query = "INSERT INTO inquiries (tutor_id, student_name, student_email, student_phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(query, [tutor_id, student_name, student_email, student_phone, subject, message], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Inquiry sent successfully', id: result.insertId });
  });
});

// Get Tutor's Inquiries
app.get('/api/tutors/:id/inquiries', (req, res) => {
  const query = "SELECT * FROM inquiries WHERE tutor_id = ? ORDER BY created_at DESC";
  connection.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Update Inquiry Status
app.patch('/api/inquiries/:id/status', (req, res) => {
  const { status } = req.body;
  const query = "UPDATE inquiries SET status = ? WHERE id = ?";
  connection.query(query, [status, req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Inquiry status updated' });
  });
});

// Delete Inquiry
app.delete('/api/inquiries/:id', (req, res) => {
  const query = "DELETE FROM inquiries WHERE id = ?";
  connection.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Inquiry deleted successfully' });
  });
});

// Add Course
app.post('/api/courses', (req, res) => {
  const { tutor_id, title, description, price, duration } = req.body;
  const query = "INSERT INTO courses (tutor_id, title, description, price, duration) VALUES (?, ?, ?, ?, ?)";
  connection.query(query, [tutor_id, title, description, price, duration], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Course added successfully', id: result.insertId });
  });
});

// Get Tutor's Courses
app.get('/api/tutors/:id/courses', (req, res) => {
  const query = "SELECT * FROM courses WHERE tutor_id = ? ORDER BY created_at DESC";
  connection.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Delete Course
app.delete('/api/courses/:id', (req, res) => {
  const query = "DELETE FROM courses WHERE id = ?";
  connection.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Course deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
