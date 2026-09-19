import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/?q=${query}&loc=${location}`);
  };

  return (
    <section className="hero-section">
      <div className="container hero-container">
        <h1>Learn from the Best <span>Tutors</span> in your City</h1>
        <p>Over 1 Million students have already found their perfect tutor on Urbon Pro.</p>
        
        <div className="search-box glass">
          <input 
            type="text" 
            placeholder="What do you want to learn?" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Location" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>Find Tutors</button>
        </div>

        <div className="popular-searches">
          <span>Popular:</span>
          <button className="chip" onClick={() => setQuery('Class 10 Math')}>Class 10 Math</button>
          <button className="chip" onClick={() => setQuery('Spoken English')}>Spoken English</button>
          <button className="chip" onClick={() => setQuery('Guitar')}>Guitar</button>
          <button className="chip" onClick={() => setQuery('Python')}>Python</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
