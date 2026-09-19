import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const SearchPage = () => {
  const { category } = useParams();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');

  // Format category name for display (e.g., class-12-tuition -> Class 12 Tuition)
  const formatCategory = (cat) => {
    return cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const displayCategory = formatCategory(category || 'Tuition');

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        // In a real app, you'd filter by category on the backend
        const response = await axios.get(`http://localhost:5000/api/tutors?q=${displayCategory}`);
        setTutors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tutors:', error);
        setLoading(false);
      }
    };
    fetchTutors();
  }, [category]);

  return (
    <div className="search-page animate-fade">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <Link to="/">Home</Link> &rsaquo; <span>{displayCategory}</span>
        </nav>

        <div className="search-header glass">
          <h1>Find Best {displayCategory} in India</h1>
          <p>Select from over {tutors.length * 100}+ expert tutors near you. Last updated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          
          <div className="location-filter">
            <div className="input-group">
              <span className="icon">📍</span>
              <input 
                type="text" 
                placeholder="Enter location or Pincode" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button className="btn btn-primary">Find Tutors</button>
            </div>
          </div>
        </div>

        <div className="search-layout">
          {/* Main Content: Tutor List */}
          <div className="tutor-list-container">
            {loading ? (
              <div className="loading">Loading top tutors...</div>
            ) : (
              tutors.map(tutor => (
                <div key={tutor.id} className="tutor-search-card glass">
                  <div className="tutor-main">
                    <img 
                      src={tutor.photo_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                      alt={tutor.name} 
                      onError={(e) => {
                        e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                        e.target.onerror = null;
                      }}
                    />
                    <div className="tutor-details">
                      <div className="tutor-top">
                        <h3>{tutor.name}</h3>
                        <div className="rating">⭐ {tutor.rating} <span>(12 reviews)</span></div>
                      </div>
                      <div className="tutor-meta">
                        <span>💻 Online Classes</span>
                        <span>✅ Verified</span>
                        <span>🎓 {tutor.experience} yrs Exp</span>
                      </div>
                      {localStorage.getItem('role') !== 'tutor' && (
                        <p className="tutor-price">₹{tutor.price_per_hour} per hour</p>
                      )}
                      <p className="tutor-bio">{tutor.bio}</p>
                      <div className="tutor-actions">
                        <Link to={`/tutor/${tutor.id}`} className="btn btn-primary">Contact Tutor</Link>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => {
                            const meetLink = tutor.google_meet_link || 'https://meet.google.com/new';
                            alert(`Your Demo Class is ready! \n\nClick here to join the Google Meet: \n${meetLink}`);
                            window.open(meetLink, '_blank');
                          }}
                        >
                          Book Demo Class
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <aside className="search-sidebar">
            <div className="sidebar-box glass">
              <h3>Looking for {displayCategory}?</h3>
              <p>Find Online or Offline {displayCategory} on UrbonPro.</p>
              <button className="btn btn-primary w-100">Find Now</button>
            </div>

            <div className="sidebar-box glass">
              <h3>Do you offer {displayCategory}?</h3>
              <p>Join our community of expert tutors and start teaching.</p>
              <button className="btn btn-outline w-100">Create Free Profile</button>
            </div>

            <div className="sidebar-box glass">
              <h3>Popular Questions</h3>
              <ul className="sidebar-links">
                <li><Link to="/">Average fees for {displayCategory}?</Link></li>
                <li><Link to="/">How to choose the best tutor?</Link></li>
                <li><Link to="/">Benefits of online learning?</Link></li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
