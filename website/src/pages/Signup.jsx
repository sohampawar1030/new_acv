import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        ...formData,
        role
      });
      
      setSuccess('Account created successfully! Please login to complete your profile.');
      
      setTimeout(() => {
        navigate(`/login${redirectPath ? `?redirect=${redirectPath}` : ''}`);
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Error during signup. Please check your details.');
    }
  };

  return (
    <div className="container" style={{marginTop: '150px', display: 'flex', justifyContent: 'center', paddingBottom: '100px'}}>
      <div className="glass" style={{padding: '50px', borderRadius: '30px', width: '100%', maxWidth: '500px', textAlign: 'center'}}>
        <h2 style={{fontSize: '2rem', marginBottom: '10px'}}>Create Account</h2>
        <p style={{color: '#64748b', marginBottom: '30px'}}>Join Urbon Pro to start your journey</p>

        {error && (
          <div className="animate-float" style={{
            background: 'rgba(231, 76, 60, 0.1)', 
            border: '1px solid #e74c3c', 
            color: '#e74c3c', 
            padding: '12px', 
            borderRadius: '12px', 
            marginBottom: '20px', 
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="animate-float" style={{
            background: 'rgba(39, 174, 96, 0.1)', 
            border: '1px solid #27ae60', 
            color: '#27ae60', 
            padding: '12px', 
            borderRadius: '12px', 
            marginBottom: '20px', 
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            ✅ {success}
          </div>
        )}
        
        <div style={{display: 'flex', gap: '10px', marginBottom: '30px'}}>
          <button 
            className={`btn ${role === 'student' ? 'btn-primary' : 'btn-outline'}`} 
            style={{flex: 1}}
            onClick={() => setRole('student')}
          >
            I'm a Student
          </button>
          <button 
            className={`btn ${role === 'tutor' ? 'btn-primary' : 'btn-outline'}`} 
            style={{flex: 1}}
            onClick={() => setRole('tutor')}
          >
            I'm a Tutor
          </button>
        </div>

        <form onSubmit={handleSignup} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div style={{textAlign: 'left'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Full Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="John Doe" 
              value={formData.name}
              onChange={handleInputChange}
              style={{width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-soft)', color: 'var(--text)', outline: 'none'}} 
            />
          </div>
          <div style={{textAlign: 'left'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="name@example.com" 
              value={formData.email}
              onChange={handleInputChange}
              style={{width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-soft)', color: 'var(--text)', outline: 'none'}} 
            />
          </div>
          <div style={{textAlign: 'left'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleInputChange}
              style={{width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-soft)', color: 'var(--text)', outline: 'none'}} 
            />
          </div>
          <div style={{textAlign: 'left'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>City</label>
            <input 
              type="text" 
              name="city"
              placeholder="e.g. Pune" 
              value={formData.city}
              onChange={handleInputChange}
              style={{width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-soft)', color: 'var(--text)', outline: 'none'}} 
            />
          </div>
          
          {role === 'tutor' && (
            <div style={{background: 'rgba(0,137,224,0.1)', padding: '15px', borderRadius: '12px', fontSize: '0.9rem', color: 'var(--primary)', textAlign: 'left'}}>
              ℹ️ Your tutor profile will be reviewed by our admin team before it goes live on the dashboard.
            </div>
          )}
          
          <button 
            type="button" 
            className="btn btn-primary" 
            style={{padding: '15px', fontSize: '1rem', marginTop: '10px'}}
            onClick={handleSignup}
          >
            Create {role === 'student' ? 'Student' : 'Tutor'} Account
          </button>
        </form>

        <p style={{marginTop: '30px', color: '#64748b'}}>
          Already have an account? <Link to={`/login${redirectPath ? `?redirect=${redirectPath}` : ''}`} style={{color: 'var(--primary)', fontWeight: '600', textDecoration: 'none'}}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
