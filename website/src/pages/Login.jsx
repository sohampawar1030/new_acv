import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    // Demo Mode Check (For Vercel/Testing without DB)
    const demoAccounts = {
      'student@demo.com': { id: 'demo_s', name: 'Demo Student', role: 'student' },
      'tutor@demo.com': { id: 'demo_t', name: 'Demo Tutor', role: 'tutor', tutor_id: 'demo_t_id' },
      'admin@demo.com': { id: 'demo_a', name: 'Demo Admin', role: 'admin' }
    };

    if (demoAccounts[email] && password === 'test123') {
      const userData = demoAccounts[email];
      setSuccess('Demo Login successful! Redirecting...');
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userData.role);
      localStorage.setItem('tutor_id', userData.tutor_id || '');
      localStorage.setItem('demo_mode', 'true');
      
      setTimeout(() => {
        if (userData.role === 'admin') window.location.href = '/admin';
        else if (userData.role === 'tutor') window.location.href = '/tutor-dashboard';
        else if (userData.role === 'student') window.location.href = '/student-dashboard';
      }, 1000);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      const userData = response.data;
      
      setSuccess('Login successful! Redirecting...');
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userData.role);
      localStorage.setItem('tutor_id', userData.tutor_id || '');
      
      setTimeout(() => {
        if (redirectPath) {
          window.location.href = redirectPath;
        } else {
          if (userData.role === 'admin') window.location.href = '/admin';
          else if (userData.role === 'tutor') window.location.href = '/tutor-dashboard';
          else if (userData.role === 'student') window.location.href = '/student-dashboard';
          else window.location.href = '/';
        }
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div className="container" style={{marginTop: '150px', display: 'flex', justifyContent: 'center'}}>
      <div className="glass" style={{padding: '50px', borderRadius: '30px', width: '100%', maxWidth: '450px', textAlign: 'center', position: 'relative', zIndex: 10}}>
        <h2 style={{fontSize: '2rem', marginBottom: '10px'}}>Welcome Back</h2>
        <p style={{color: '#64748b', marginBottom: '30px'}}>Log in to manage your classes and inquiries</p>

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
        
        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div style={{textAlign: 'left'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none'}} 
            />
          </div>
          <div style={{textAlign: 'left'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none'}} 
            />
          </div>
          <button 
            type="button" 
            onClick={handleLogin}
            className="btn btn-primary" 
            style={{padding: '15px', fontSize: '1rem', marginTop: '10px'}}
          >
            Log In
          </button>
        </form>

        <p style={{marginTop: '30px', color: '#64748b'}}>
          Don't have an account? <Link to={`/signup${redirectPath ? `?redirect=${redirectPath}` : ''}`} style={{color: 'var(--primary)', fontWeight: '600', textDecoration: 'none'}}>Sign Up</Link>
        </p>

        <div style={{marginTop: '40px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
          <p style={{fontSize: '0.8rem', color: '#64748b', marginBottom: '15px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px'}}>Quick Demo Access (No DB Required)</p>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center'}}>
            {[
              { label: 'Student Demo', email: 'student@demo.com' },
              { label: 'Tutor Demo', email: 'tutor@demo.com' },
              { label: 'Admin Demo', email: 'admin@demo.com' }
            ].map(acc => (
              <button 
                key={acc.email}
                onClick={() => { setEmail(acc.email); setPassword('test123'); setTimeout(() => handleLogin(), 100); }}
                style={{
                  padding: '8px 15px', 
                  borderRadius: '10px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  background: 'rgba(255,255,255,0.05)', 
                  color: 'var(--text-soft)', 
                  fontSize: '0.8rem', 
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
              >
                {acc.label}
              </button>
            ))}
          </div>
          <p style={{fontSize: '0.7rem', color: '#64748b', marginTop: '10px'}}>Password for all: <strong>test123</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
