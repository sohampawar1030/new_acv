import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import TutorProfile from './pages/TutorProfile';
import TutorDashboard from './pages/TutorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Payment from './pages/Payment';
import PaymentPage from './pages/PaymentPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        {localStorage.getItem('demo_mode') === 'true' && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(16, 185, 129, 0.9)',
            color: 'white',
            padding: '8px 15px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            zIndex: 9999,
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
            pointerEvents: 'none',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            🟢 Demo Mode Active
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/:category" element={<SearchPage />} />
          <Route path="/tutor/:id" element={<TutorProfile />} />
          <Route path="/tutor-dashboard" element={<TutorDashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/tutor-payment" element={<PaymentPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
