import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Check user on mount and when storage changes
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (name) => {
    if (window.innerWidth <= 1024) {
      setActiveDropdown(activeDropdown === name ? null : name);
    }
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-container">
        <Link to="/" className="logo" style={{textDecoration: 'none'}} onClick={closeMenu}>
          <span className="logo-text">Urbon<span>Pro</span></span>
        </Link>


        <div className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
          <div className={`dropdown mega-dropdown ${activeDropdown === 'tuition' ? 'active' : ''}`}>
            <div className="dropbtn" onClick={() => toggleDropdown('tuition')}>Tuition</div>
            <div className="dropdown-content mega-content">
              <div className="mega-column">
                <h4>School</h4>
                <Link to="/search/class-12-tuition" onClick={closeMenu}>Class 12 Tuition</Link>
                <Link to="/search/class-11-tuition" onClick={closeMenu}>Class 11 Tuition</Link>
                <Link to="/search/class-10-tuition" onClick={closeMenu}>Class 10 Tuition</Link>
                <Link to="/search/class-9-tuition" onClick={closeMenu}>Class 9 Tuition</Link>
                <Link to="/search/class-8-tuition" onClick={closeMenu}>Class 8 Tuition</Link>
                <Link to="/search/class-7-tuition" onClick={closeMenu}>Class 7 Tuition</Link>
                <Link to="/search/class-6-tuition" onClick={closeMenu}>Class 6 Tuition</Link>
                <Link to="/search/class-1-to-5-tuition" onClick={closeMenu}>Class 1 to 5 Tuition</Link>
                <Link to="/search/nursery-kg-tuition" onClick={closeMenu}>Nursery-KG Tuition</Link>
              </div>
              <div className="mega-column">
                <h4>College & Subjects</h4>
                <Link to="/search/btech-tuition" onClick={closeMenu}>BTech Tuition</Link>
                <Link to="/search/bcom-tuition" onClick={closeMenu}>BCom Tuition</Link>
                <Link to="/search/bba-tuition" onClick={closeMenu}>BBA Tuition</Link>
                <Link to="/search/mathematics" onClick={closeMenu}>Mathematics</Link>
                <Link to="/search/english" onClick={closeMenu}>English</Link>
                <Link to="/search/science" onClick={closeMenu}>Science</Link>
              </div>
              <div className="mega-column">
                <h4>More</h4>
                <Link to="/search/all-tuitions" onClick={closeMenu}>All Tuitions</Link>
                <Link to="/search/online-tuitions" onClick={closeMenu}>Online Tuitions</Link>
                <Link to="/search/ncert-solutions" onClick={closeMenu}>NCERT Solutions <span className="badge">New</span></Link>
                <Link to="/search/cbse-syllabus" onClick={closeMenu}>CBSE Syllabus</Link>
              </div>
            </div>
          </div>

          <div className={`dropdown mega-dropdown ${activeDropdown === 'languages' ? 'active' : ''}`}>
            <div className="dropbtn" onClick={() => toggleDropdown('languages')}>Languages</div>
            <div className="dropdown-content mega-content">
              <div className="mega-column">
                <h4>Foreign Languages</h4>
                <Link to="/search/spoken-english" onClick={closeMenu}>Spoken English</Link>
                <Link to="/search/german-language" onClick={closeMenu}>German Language</Link>
                <Link to="/search/french-language" onClick={closeMenu}>French Language</Link>
                <Link to="/search/spanish-language" onClick={closeMenu}>Spanish Language</Link>
                <Link to="/search/japanese-language" onClick={closeMenu}>Japanese Language</Link>
              </div>
              <div className="mega-column">
                <h4>Indian Languages</h4>
                <Link to="/search/hindi-language" onClick={closeMenu}>Hindi Language</Link>
                <Link to="/search/kannada-language" onClick={closeMenu}>Kannada Language</Link>
                <Link to="/search/tamil-language" onClick={closeMenu}>Tamil Language</Link>
                <Link to="/search/telugu-language" onClick={closeMenu}>Telugu Language</Link>
                <Link to="/search/marathi-speaking" onClick={closeMenu}>Marathi Speaking</Link>
              </div>
              <div className="mega-column">
                <h4>Other & More</h4>
                <Link to="/search/chinese-language" onClick={closeMenu}>Chinese Language</Link>
                <Link to="/search/arabic-language" onClick={closeMenu}>Arabic Language</Link>
                <Link to="/search/sanskrit-language" onClick={closeMenu}>Sanskrit Language</Link>
                <Link to="/search/all-languages" onClick={closeMenu}>All Languages</Link>
              </div>
            </div>
          </div>

          <div className={`dropdown mega-dropdown ${activeDropdown === 'hobbies' ? 'active' : ''}`}>
            <div className="dropbtn" onClick={() => toggleDropdown('hobbies')}>Hobbies</div>
            <div className="dropdown-content mega-content">
              <div className="mega-column">
                <h4>Dance & Music</h4>
                <Link to="/search/dance" onClick={closeMenu}>Dance</Link>
                <Link to="/search/hindustani-music" onClick={closeMenu}>Hindustani Music</Link>
                <Link to="/search/guitar" onClick={closeMenu}>Guitar</Link>
                <Link to="/search/keyboard" onClick={closeMenu}>Keyboard</Link>
              </div>
              <div className="mega-column">
                <h4>Hobbies</h4>
                <Link to="/search/yoga" onClick={closeMenu}>Yoga</Link>
                <Link to="/search/cooking" onClick={closeMenu}>Cooking</Link>
                <Link to="/search/photography" onClick={closeMenu}>Photography</Link>
                <Link to="/search/drawing" onClick={closeMenu}>Drawing</Link>
                <Link to="/search/painting" onClick={closeMenu}>Painting</Link>
              </div>
              <div className="mega-column">
                <h4>Other & More</h4>
                <Link to="/search/singing" onClick={closeMenu}>Singing</Link>
                <Link to="/search/violin" onClick={closeMenu}>Violin</Link>
                <Link to="/search/handwriting" onClick={closeMenu}>Handwriting</Link>
                <Link to="/search/all-hobby-classes" onClick={closeMenu}>All Hobby Classes</Link>
              </div>
            </div>
          </div>

          <div className={`dropdown mega-dropdown ${activeDropdown === 'it' ? 'active' : ''}`}>
            <div className="dropbtn" onClick={() => toggleDropdown('it')}>IT</div>
            <div className="dropdown-content mega-content">
              <div className="mega-column">
                <h4>Programming</h4>
                <Link to="/search/python-training" onClick={closeMenu}>Python Training</Link>
                <Link to="/search/java-training" onClick={closeMenu}>Java Training</Link>
                <Link to="/search/net-training" onClick={closeMenu}>.Net Training</Link>
                <Link to="/search/javascript-training" onClick={closeMenu}>JavaScript Training</Link>
              </div>
              <div className="mega-column">
                <h4>IT Training</h4>
                <Link to="/search/microsoft-excel" onClick={closeMenu}>Microsoft Excel</Link>
                <Link to="/search/sap" onClick={closeMenu}>SAP</Link>
                <Link to="/search/aws" onClick={closeMenu}>AWS</Link>
                <Link to="/search/angularjs" onClick={closeMenu}>Angular.JS</Link>
              </div>
              <div className="mega-column">
                <h4>Other & More</h4>
                <Link to="/search/devops-training" onClick={closeMenu}>DevOps Training</Link>
                <Link to="/search/data-science" onClick={closeMenu}>Data Science</Link>
                <Link to="/search/all-it-courses" onClick={closeMenu}>All IT Courses</Link>
              </div>
            </div>
          </div>
          
          <div className={`dropdown mega-dropdown ${activeDropdown === 'exam' ? 'active' : ''}`}>
            <div className="dropbtn" onClick={() => toggleDropdown('exam')}>Exam Coaching</div>
            <div className="dropdown-content mega-content">
              <div className="mega-column">
                <h4>Study Abroad</h4>
                <Link to="/search/ielts-coaching" onClick={closeMenu}>IELTS Coaching</Link>
                <Link to="/search/gre-coaching" onClick={closeMenu}>GRE Coaching</Link>
                <Link to="/search/gmat-coaching" onClick={closeMenu}>GMAT Coaching</Link>
                <Link to="/search/toefl-coaching" onClick={closeMenu}>TOEFL Coaching</Link>
              </div>
              <div className="mega-column">
                <h4>Study in India</h4>
                <Link to="/search/engineering-entrance" onClick={closeMenu}>Engineering Entrance</Link>
                <Link to="/search/medical-entrance" onClick={closeMenu}>Medical Entrance</Link>
                <Link to="/search/ca-coaching" onClick={closeMenu}>CA Coaching</Link>
                <Link to="/search/mba-entrance" onClick={closeMenu}>MBA Entrance</Link>
              </div>
              <div className="mega-column">
                <h4>Other & More</h4>
                <Link to="/search/upsc-coaching" onClick={closeMenu}>UPSC Coaching</Link>
                <Link to="/search/ssc-exam-coaching" onClick={closeMenu}>SSC Exam Coaching</Link>
                <Link to="/search/all-exam-coaching" onClick={closeMenu}>All Exam Coaching</Link>
              </div>
            </div>
          </div>
          
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <div style={{display: 'flex', flexDirection: mobileMenuOpen ? 'column' : 'row', alignItems: 'center', gap: '15px', width: mobileMenuOpen ? '100%' : 'auto'}}>
              <span style={{fontWeight: '600', color: 'var(--primary)'}}>
                Hi, {user.name?.split(' ')[0] || 'User'}
              </span>
              
              {user.role === 'tutor' && (
                <Link to="/tutor-dashboard" className="btn btn-outline" style={{width: mobileMenuOpen ? '100%' : 'auto'}} onClick={closeMenu}>Dashboard</Link>
              )}
              
              {user.role === 'student' && (
                <Link to="/student-dashboard" className="btn btn-outline" style={{width: mobileMenuOpen ? '100%' : 'auto'}} onClick={closeMenu}>My Dashboard</Link>
              )}
              
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-outline" style={{width: mobileMenuOpen ? '100%' : 'auto'}} onClick={closeMenu}>Admin Panel</Link>
              )}

              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  localStorage.removeItem('demo_mode');
                  setUser(null);
                  closeMenu();
                  window.location.href = '/';
                }} 
                className="btn btn-primary" 
                style={{width: mobileMenuOpen ? '100%' : 'auto', background: '#ef4444', borderColor: '#ef4444'}}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: mobileMenuOpen ? 'column' : 'row', gap: '10px', width: mobileMenuOpen ? '100%' : 'auto'}}>
              <Link to="/login" className="btn btn-outline" style={{width: mobileMenuOpen ? '100%' : 'auto'}} onClick={closeMenu}>Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{width: mobileMenuOpen ? '100%' : 'auto'}} onClick={closeMenu}>Sign Up</Link>
            </div>
          )}
        </div>
        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{zIndex: 1001}}>
          <span style={{transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none', background: 'var(--text)'}}></span>
          <span style={{opacity: mobileMenuOpen ? 0 : 1, background: 'var(--text)'}}></span>
          <span style={{transform: mobileMenuOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none', background: 'var(--text)'}}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
