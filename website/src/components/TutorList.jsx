import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const TutorList = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const q = searchParams.get('q') || '';
      const loc = searchParams.get('loc') || '';

      try {
        const res = await axios.get(`http://localhost:5000/api/tutors?q=${q}&loc=${loc}`);
        setTutors(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [location.search]);

  if (loading) return <div className="container">Loading tutors...</div>;

  return (
    <section className="tutor-section container">
      <h2>{tutors.length > 0 ? 'Available Tutors' : 'No tutors found matching your search'}</h2>
      <div className="tutor-grid">
        {tutors.map(tutor => (
          <div key={tutor.id} className="tutor-card glass animate-fade" style={{
            overflow: 'hidden', 
            transition: '0.3s', 
            borderRadius: '25px',
            border: '1px solid var(--border)'
          }}>
            <div style={{padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <img 
                src={tutor.photo_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                alt={tutor.name} 
                onError={(e) => {
                  e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                  e.target.onerror = null;
                }}
                style={{
                  width: '120px', 
                  height: '150px', 
                  objectFit: 'cover', 
                  borderRadius: '15px', 
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  marginBottom: '20px',
                  border: '2px solid white'
                }}
              />
              <div className="tutor-info" style={{width: '100%', textAlign: 'center'}}>
                <h3 style={{margin: '0 0 5px 0', fontSize: '1.3rem', fontWeight: '800'}}>{tutor.name}</h3>
                
                <p style={{color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '10px'}}>
                  {tutor.specialization || 'Professional Educator'}
                </p>

                <p style={{fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: '15px'}}>
                  📍 {tutor.location || 'Online'}
                </p>
                
                <div style={{
                  background: 'rgba(0,137,224,0.03)',
                  padding: '15px',
                  borderRadius: '15px',
                  marginBottom: '20px',
                  minHeight: '60px'
                }}>
                  <p style={{
                    fontSize: '0.85rem', 
                    lineHeight: '1.5', 
                    margin: 0,
                    overflow: 'hidden', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical',
                    color: 'var(--text-soft)'
                  }}>
                    {tutor.bio ? tutor.bio : 'Experienced professional providing personalized lessons.'}
                  </p>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 'bold'}}>
                  <span>💼 {tutor.experience} Yrs</span>
                  <span style={{color: '#10b981'}}>₹{tutor.price_per_hour}/hr</span>
                </div>
                
                <Link to={`/tutor/${tutor.id}`} className="btn btn-primary" style={{width: '100%', borderRadius: '15px', padding: '12px'}}>View Profile</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TutorList;
