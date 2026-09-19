import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const isDemo = localStorage.getItem('demo_mode') === 'true';
    if (isDemo) {
        setEnrollments([
            { id: 1, name: 'Tutor Ajay', specialization: 'Hindi Language Expert', amount: 1999, fee_status: 'paid', photo_url: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1921&auto=format&fit=crop' },
            { id: 2, name: 'Tutor Priya', specialization: 'Mathematics Specialist', amount: 2500, fee_status: 'pending', photo_url: 'https://images.unsplash.com/photo-1544717297-fa154da09f9b?q=80&w=2070&auto=format&fit=crop' }
        ]);
        setLoading(false);
        return;
    }
    if (user && user.id) {
      axios.get(`http://localhost:5000/api/student/enrollments/${user.id}`)
        .then(res => {
          setEnrollments(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  if (loading) return <div className="container" style={{marginTop: '150px'}}>Loading your learning dashboard...</div>;

  return (
    <div className="container" style={{marginTop: '120px', paddingBottom: '100px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
        <div>
          <h1 style={{marginBottom: '5px'}}>My Learning Dashboard</h1>
          <p style={{color: 'var(--text-soft)', fontSize: '1.1rem'}}>Hello, {user?.name || 'Student'}!</p>
        </div>
        <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
          <div className="glass" style={{padding: '10px 20px', borderRadius: '15px'}}>
            <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>Total Enrolled: {enrollments.length}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="btn btn-outline"
            style={{borderColor: '#e74c3c', color: '#e74c3c', padding: '10px 25px', borderRadius: '12px'}}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="grid grid-3" style={{alignItems: 'start'}}>
        <div style={{gridColumn: window.innerWidth < 768 ? '1' : 'span 2'}}>
          <section className="glass" style={{padding: '25px', borderRadius: '25px', marginBottom: '30px'}}>
            <h2 style={{marginBottom: '25px'}}>My Enrolled Courses</h2>
            {enrollments.length === 0 ? (
              <p style={{color: 'var(--text-soft)', textAlign: 'center', padding: '20px'}}>You haven't enrolled in any courses yet. Start learning today!</p>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                {enrollments.map((en, index) => (
                  <div key={index} className="glass" style={{padding: '15px', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px'}}>
                    <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                      <img src={en.photo_url} alt={en.name} style={{width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover'}} />
                      <div>
                        <h3 style={{margin: 0, fontSize: '1rem'}}>{en.name}</h3>
                        <p style={{margin: '3px 0', fontSize: '0.8rem', color: 'var(--text-soft)'}}>{en.specialization}</p>
                      </div>
                    </div>
                    <div style={{textAlign: 'right', flex: window.innerWidth < 768 ? '1 1 100%' : 'none'}}>
                      <span className="badge" style={{
                        background: en.fee_status === 'paid' ? '#10b981' : '#f59e0b',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        {en.fee_status.toUpperCase()}
                      </span>
                      <p style={{margin: '5px 0 0 0', fontSize: '0.9rem', fontWeight: 'bold'}}>₹{en.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="glass" style={{padding: '25px', borderRadius: '25px'}}>
            <h2 style={{marginBottom: '20px'}}>Recorded Sessions</h2>
            <div style={{background: 'rgba(0,0,0,0.03)', padding: '30px', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border)'}}>
              <p style={{color: 'var(--text-soft)', fontSize: '0.9rem'}}>Your recorded classes will appear here after the live sessions.</p>
              <button className="btn btn-outline" style={{marginTop: '15px', fontSize: '0.85rem'}}>View Archive</button>
            </div>
          </section>
        </div>

        <div style={{gridColumn: window.innerWidth < 768 ? '1' : 'span 1'}}>
          <div className="glass" style={{padding: '25px', borderRadius: '25px', marginBottom: '25px', borderLeft: '5px solid var(--primary)'}}>
            <h3 style={{fontSize: '1.2rem'}}>Next Class</h3>
            <div style={{marginTop: '15px', padding: '15px', background: 'rgba(0,137,224,0.05)', borderRadius: '15px'}}>
              <p style={{fontWeight: 'bold', margin: 0, fontSize: '1rem'}}>Mathematics Live</p>
              <p style={{fontSize: '0.85rem', color: 'var(--primary)', margin: '5px 0', fontWeight: '600'}}>Tomorrow at 4:00 PM</p>
              <button className="btn btn-primary" style={{width: '100%', marginTop: '10px', padding: '10px', fontSize: '0.9rem'}}>Join Meet</button>
            </div>
          </div>

          <div className="glass" style={{padding: '25px', borderRadius: '25px'}}>
            <h3 style={{fontSize: '1.2rem'}}>Upcoming Tests</h3>
            <p style={{fontSize: '0.9rem', color: 'var(--text-soft)', marginTop: '15px'}}>No tests scheduled for this week.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
