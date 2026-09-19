import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TutorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/tutors/${id}`)
      .then(res => setTutor(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:5000/api/tutors/${id}/courses`)
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const [inquiry, setInquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [inquirySent, setInquirySent] = useState(false);

  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollData, setEnrollData] = useState({ phone: '', message: '' });
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Redirect to payment page with enrollment data
    navigate('/payment', {
      state: {
        enrollmentData: {
          student_id: user.id,
          tutor_id: id,
          course_id: selectedCourse.id,
          amount: selectedCourse.price,
          student_phone: enrollData.phone,
          message: enrollData.message,
          tutor_name: tutor.name,
          course_title: selectedCourse.title
        }
      }
    });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/inquiries', {
        tutor_id: id,
        student_name: inquiry.name,
        student_email: inquiry.email,
        student_phone: inquiry.phone,
        subject: 'General Inquiry',
        message: inquiry.message
      });
      setInquirySent(true);
      setInquiry({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Error sending inquiry:', err);
      alert('Error sending inquiry. Please try again.');
    }
  };

  const userRole = localStorage.getItem('role');
  const loggedInTutorId = localStorage.getItem('tutor_id');
  const isOwnProfile = String(loggedInTutorId) === String(id);
  const isTutorViewer = userRole === 'tutor';

  if (!tutor) return <div className="container" style={{marginTop: '150px'}}>Loading...</div>;

  return (
    <div className="container" style={{marginTop: '150px', paddingBottom: '100px'}}>
      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)'}}>
          <div className="glass animate-float" style={{padding: '40px', borderRadius: '30px', maxWidth: '500px', width: '90%', textAlign: 'center', border: '1px solid var(--primary)'}}>
            <h2 style={{marginBottom: '10px'}}>Enroll in Course</h2>
            <p style={{color: 'var(--text-soft)', marginBottom: '25px'}}>Apply for <strong>{selectedCourse?.title}</strong> by {tutor.name}</p>
            
            {enrollSuccess ? (
              <div style={{padding: '30px', background: 'rgba(39, 174, 96, 0.1)', borderRadius: '20px', color: '#27ae60'}}>
                <div style={{fontSize: '3rem', marginBottom: '15px'}}>✅</div>
                <h3>Request Sent!</h3>
                <p>The tutor has been notified. You will see the status in your dashboard once they approve.</p>
                <button onClick={() => { setShowEnrollModal(false); setEnrollSuccess(false); }} className="btn btn-primary" style={{marginTop: '20px', width: '100%'}}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Your Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="e.g. +91 9876543210"
                    value={enrollData.phone}
                    onChange={(e) => setEnrollData({...enrollData, phone: e.target.value})}
                    style={{width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', background: 'rgba(255,255,255,0.05)', color: '#333'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '500'}}>Message to Tutor (Optional)</label>
                  <textarea 
                    placeholder="Why do you want to join this course?"
                    value={enrollData.message}
                    onChange={(e) => setEnrollData({...enrollData, message: e.target.value})}
                    style={{width: '100%', height: '100px', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', background: 'rgba(255,255,255,0.05)', color: '#333'}}
                  ></textarea>
                </div>
                <div style={{background: 'rgba(0,137,224,0.05)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(0,137,224,0.1)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                    <span>Course Fee:</span>
                    <span style={{fontWeight: 'bold', color: '#10b981'}}>₹{selectedCourse?.price}</span>
                  </div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-soft)'}}>ℹ️ Secure payment is required to send your enrollment request to the teacher.</div>
                </div>
                <div style={{display: 'flex', gap: '15px'}}>
                  <button type="submit" className="btn btn-primary" style={{flex: 1}}>Proceed to Payment</button>
                  <button type="button" onClick={() => setShowEnrollModal(false)} className="btn btn-outline" style={{flex: 1}}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="profile-header glass" style={{display: 'flex', gap: '40px', padding: '40px', borderRadius: '20px'}}>
        <img src={tutor.photo_url} alt={tutor.name} style={{width: '200px', height: '200px', borderRadius: '20px', objectFit: 'cover'}} />
        <div className="info">
          <h1 style={{fontSize: '2.5rem', marginBottom: '10px'}}>{tutor.name}</h1>
          <p className="location" style={{fontSize: '1.2rem', color: '#64748b', marginBottom: '20px'}}>📍 {tutor.location}</p>
          <div className="stats" style={{display: 'flex', gap: '30px', marginBottom: '30px'}}>
            <div>
              <span style={{display: 'block', fontSize: '1.5rem', fontWeight: 'bold'}}>⭐ {tutor.rating}</span>
              <span style={{color: '#64748b'}}>Rating</span>
            </div>
            <div>
              <span style={{display: 'block', fontSize: '1.5rem', fontWeight: 'bold'}}>{tutor.experience}+</span>
              <span style={{color: '#64748b'}}>Years Exp.</span>
            </div>
            {(!isTutorViewer || isOwnProfile) && (
              <div>
                <span style={{display: 'block', fontSize: '1.5rem', fontWeight: 'bold'}}>₹{tutor.price_per_hour}</span>
                <span style={{color: '#64748b'}}>Per Hour</span>
              </div>
            )}
          </div>
          <button 
            className="btn btn-primary" 
            style={{padding: '15px 40px', fontSize: '1.1rem'}}
            onClick={() => {
              const meetLink = tutor.google_meet_link || 'https://meet.google.com/new';
              alert(`Your Demo Class is ready! \n\nClick here to join the Google Meet: \n${meetLink}`);
              window.open(meetLink, '_blank');
            }}
          >
            Book a Demo Class
          </button>
        </div>
      </div>

      <div className="profile-details" style={{marginTop: '40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px'}}>
        <div className="main-content" style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
          <div className="glass" style={{padding: '30px', borderRadius: '20px'}}>
            <h2>About Me</h2>
            <p style={{fontSize: '1.1rem', marginTop: '20px', lineHeight: '1.8'}}>{tutor.bio}</p>
          </div>

          {(!isTutorViewer || isOwnProfile) && (
            <div className="glass" style={{padding: '30px', borderRadius: '20px'}}>
              <h2 style={{marginBottom: '20px'}}>Available Courses</h2>
              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '20px'}}>
                {(() => {
                  const visibleCourses = courses.filter(course => isOwnProfile || course.status === 'approved');

                  if (visibleCourses.length > 0) {
                    return visibleCourses.map((course) => (
                      <div key={course.id} className="course-card" style={{
                        padding: '20px', 
                        borderRadius: '15px', 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid var(--border)',
                        position: 'relative'
                      }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                            <h3 style={{margin: 0, color: 'var(--primary)'}}>{course.title}</h3>
                            {isOwnProfile && (
                              <span style={{
                                fontSize: '0.7rem', 
                                padding: '2px 8px', 
                                borderRadius: '10px', 
                                background: course.status === 'approved' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(243, 156, 18, 0.1)',
                                color: course.status === 'approved' ? '#27ae60' : '#f39c12',
                                fontWeight: 'bold'
                              }}>
                                {course.status ? course.status.toUpperCase() : 'PENDING'}
                              </span>
                            )}
                          </div>
                          <span style={{fontWeight: 'bold', color: '#10b981'}}>₹{course.price}</span>
                        </div>
                        <p style={{fontSize: '0.9rem', color: 'var(--text-soft)', marginBottom: '15px'}}>{course.description}</p>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem'}}>
                          <span>⏱️ {course.duration}</span>
                          <button 
                            className="btn btn-primary" 
                            style={{padding: '8px 15px', fontSize: '0.8rem'}}
                            onClick={() => {
                              const loggedInUser = localStorage.getItem('user');
                              if (!loggedInUser) {
                                window.location.href = `/login?redirect=${window.location.pathname}`;
                              } else {
                                setSelectedCourse(course);
                                setShowEnrollModal(true);
                              }
                            }}
                          >
                            Enroll Now
                          </button>
                        </div>
                      </div>
                    ));
                  } else {
                    return <p style={{color: 'var(--text-soft)'}}>No special courses listed yet.</p>;
                  }
                })()}
              </div>
            </div>
          )}
          
          <div className="glass" style={{padding: '30px', borderRadius: '20px'}}>
            <h2>Education & Skills</h2>
            <ul style={{marginTop: '20px', listStyle: 'none'}}>
            {tutor.skills ? (
              tutor.skills.split('\n').filter(s => s.trim()).map((skill, index) => (
                <li key={index} style={{marginBottom: '10px', display: 'flex', alignItems: 'start', gap: '10px'}}>
                  <span style={{color: 'var(--primary)'}}>✅</span> 
                  <span>{skill.trim()}</span>
                </li>
              ))
            ) : (
              <>
                <li style={{marginBottom: '10px'}}>✅ Certified Educator</li>
                <li style={{marginBottom: '10px'}}>✅ Expert in Subject Matter</li>
                <li style={{marginBottom: '10px'}}>✅ 50+ Students Taught</li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="sidebar">
          <div className="contact-card glass" style={{padding: '30px', borderRadius: '20px'}}>
            <h3>Interested?</h3>
            <p style={{margin: '15px 0'}}>Send an inquiry to {tutor.name.split(' ')[0]}</p>
            {inquirySent ? (
              <div style={{background: 'rgba(39, 174, 96, 0.1)', color: '#27ae60', padding: '15px', borderRadius: '12px', textAlign: 'center'}}>
                ✅ Inquiry sent successfully!
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  required
                  value={inquiry.name}
                  onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                  style={{padding: '12px', borderRadius: '10px', border: '1px solid #ddd'}} 
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  required
                  value={inquiry.email}
                  onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                  style={{padding: '12px', borderRadius: '10px', border: '1px solid #ddd'}} 
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  required
                  value={inquiry.phone}
                  onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                  style={{padding: '12px', borderRadius: '10px', border: '1px solid #ddd'}} 
                />
                <textarea 
                  placeholder="Tell us what you want to learn..." 
                  required
                  value={inquiry.message}
                  onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                  style={{padding: '12px', borderRadius: '10px', border: '1px solid #ddd', height: '100px'}}
                ></textarea>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
