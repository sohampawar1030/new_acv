import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [tutors, setTutors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [mainTab, setMainTab] = useState('tutors'); // 'tutors' or 'courses'
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteReason, setDeleteReason] = useState('');

  useEffect(() => {
    const isDemo = localStorage.getItem('demo_mode') === 'true';
    if (isDemo) {
        setTutors([
            { id: 1, name: 'John Doe', email: 'john@test.com', status: 'pending', payment_status: 'paid', bio: 'Math expert with PhD', specialization: 'Mathematics Expert', experience: 12, location: 'Pune', price_per_hour: 800 },
            { id: 2, name: 'Jane Smith', email: 'jane@test.com', status: 'approved', payment_status: 'paid', bio: 'English Specialist', specialization: 'Spoken English', experience: 5, location: 'Mumbai', price_per_hour: 400 },
            { id: 3, name: 'Mark Wilson', email: 'mark@test.com', status: 'rejected', payment_status: 'unpaid', bio: 'Music teacher', specialization: 'Guitar Teacher', experience: 3, location: 'Delhi', price_per_hour: 300, rejection_reason: 'Incomplete documentation' }
        ]);
        setCourses([
            { id: 1, title: 'Advanced Calculus', description: 'Deep dive into calculus', tutor_name: 'John Doe', price: 1500, duration: '2 Months', status: 'pending' },
            { id: 2, title: 'English Speaking', description: 'Fluent english in 30 days', tutor_name: 'Jane Smith', price: 999, duration: '1 Month', status: 'approved' }
        ]);
        setLoading(false);
        return;
    }
    fetchTutors();
    fetchCourses();
  }, []);

  const fetchTutors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/tutors');
      setTutors(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tutors:', error);
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleAction = async (id, status, paymentStatus, reason = '') => {
    try {
      await axios.post('http://localhost:5000/api/admin/tutors/status', {
        id,
        status,
        payment_status: paymentStatus,
        rejection_reason: reason
      });
      
      if (status === 'rejected') {
        alert(`Email sent to candidate with reason: ${reason}. Instructions given to fix in 24 hours.`);
      } else {
        alert(`Tutor status updated to ${status}`);
      }
      
      setShowRejectModal(false);
      setRejectReason('');
      fetchTutors();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCourseAction = async (id, status) => {
    try {
      await axios.post('http://localhost:5000/api/admin/courses/status', { id, status });
      alert(`Course ${status} successfully`);
      fetchCourses();
    } catch (error) {
      console.error('Error updating course status:', error);
    }
  };

  const openRejectModal = (tutor) => {
    setSelectedTutor(tutor);
    setShowRejectModal(true);
  };

  const handleDelete = (tutor) => {
    setSelectedTutor(tutor);
    setShowDeleteModal(true);
  };

  const handleFinalDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/tutors/${selectedTutor.id}`);
      alert(`Account Deleted permanently. Email sent to ${selectedTutor.email} with reason: ${deleteReason}`);
      setShowDeleteModal(false);
      setDeleteReason('');
      fetchTutors();
    } catch (error) {
      console.error('Error deleting tutor:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const filteredTutors = tutors.filter(t => t.status === activeTab);

  return (
    <div className="container" style={{marginTop: '120px', paddingBottom: '100px'}}>
      {/* Custom Delete Modal */}
      {showDeleteModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 2001, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)'}}>
          <div className="glass animate-float" style={{padding: '40px', borderRadius: '30px', maxWidth: '450px', width: '90%', textAlign: 'center', border: '2px solid #333'}}>
            <div style={{fontSize: '3rem', marginBottom: '15px'}}>⚠️</div>
            <h2 style={{marginBottom: '15px'}}>Confirm Deletion</h2>
            <p style={{color: 'var(--text-soft)', marginBottom: '20px'}}>You are about to permanently delete <strong>{selectedTutor?.name}</strong>. Their login access will be revoked immediately.</p>
            
            <textarea 
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Reason for deletion (this will be sent to the tutor via email)"
              style={{width: '100%', height: '100px', padding: '15px', borderRadius: '15px', border: '1px solid #ddd', marginBottom: '20px', outline: 'none', background: 'rgba(255,255,255,0.05)', color: '#333'}}
            />

            <div style={{display: 'flex', gap: '15px'}}>
              <button onClick={handleFinalDelete} className="btn btn-primary" style={{flex: 1, padding: '15px', background: '#333'}}>Delete & Revoke</button>
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-outline" style={{flex: 1, padding: '15px'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)'}}>
          <div className="glass animate-float" style={{padding: '40px', borderRadius: '30px', maxWidth: '500px', width: '90%', textAlign: 'center', border: '2px solid #e74c3c'}}>
            <h2 style={{marginBottom: '15px', color: '#e74c3c'}}>Reject Candidate</h2>
            <p style={{color: 'var(--text-soft)', marginBottom: '20px'}}>State the reason for rejection. An email will be sent to <strong>{selectedTutor?.name}</strong> immediately.</p>
            
            <textarea 
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Platform fee unpaid or Incomplete documentation. Please fix within 24 hours."
              style={{width: '100%', height: '120px', padding: '15px', borderRadius: '15px', border: '1px solid #ddd', marginBottom: '20px', outline: 'none', background: 'rgba(255,255,255,0.05)', color: '#333'}}
            />

            <div style={{display: 'flex', gap: '15px'}}>
              <button 
                onClick={() => handleAction(selectedTutor.id, 'rejected', selectedTutor.payment_status, rejectReason)} 
                className="btn btn-primary" 
                style={{flex: 1, padding: '15px', background: '#e74c3c'}}
              >
                Send Email & Reject
              </button>
              <button onClick={() => setShowRejectModal(false)} className="btn btn-outline" style={{flex: 1, padding: '15px'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px'}}>
        <div>
            <h1 style={{fontSize: '1.8rem'}}>Admin Dashboard</h1>
            <p style={{color: 'var(--text-soft)', fontSize: '0.9rem'}}>Manage tutors and course approvals</p>
        </div>
        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
            <button 
                onClick={handleLogout}
                className="btn btn-outline"
                style={{borderColor: '#ef4444', color: '#ef4444', padding: '8px 20px', borderRadius: '12px', fontSize: '0.9rem'}}
            >
                Logout
            </button>
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '30px', overflowX: 'auto', whiteSpace: 'nowrap', msOverflowStyle: 'none', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', paddingBottom: '10px'}}>
            <div style={{display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '15px', padding: '5px'}}>
                <button 
                    onClick={() => setMainTab('tutors')}
                    className={`btn ${mainTab === 'tutors' ? 'btn-primary' : ''}`}
                    style={{padding: '8px 20px', borderRadius: '12px', background: mainTab === 'tutors' ? 'var(--primary)' : 'transparent', color: mainTab === 'tutors' ? 'white' : '#666', border: 'none', fontSize: '0.9rem'}}
                >
                    Tutors
                </button>
                <button 
                    onClick={() => setMainTab('courses')}
                    className={`btn ${mainTab === 'courses' ? 'btn-primary' : ''}`}
                    style={{padding: '8px 20px', borderRadius: '12px', background: mainTab === 'courses' ? 'var(--primary)' : 'transparent', color: mainTab === 'courses' ? 'white' : '#666', border: 'none', fontSize: '0.9rem'}}
                >
                    Courses ({courses.length})
                </button>
            </div>
      </div>

      {mainTab === 'tutors' ? (
        <>
            <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                <button 
                    onClick={() => setActiveTab('pending')} 
                    className={`btn ${activeTab === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                    style={{padding: '10px 15px', fontSize: '0.85rem'}}
                >
                    Pending ({tutors.filter(t => t.status === 'pending').length})
                </button>
                <button 
                    onClick={() => setActiveTab('approved')} 
                    className={`btn ${activeTab === 'approved' ? 'btn-primary' : 'btn-outline'}`}
                    style={{padding: '10px 15px', fontSize: '0.85rem'}}
                >
                    Approved ({tutors.filter(t => t.status === 'approved').length})
                </button>
                <button 
                    onClick={() => setActiveTab('rejected')} 
                    className={`btn ${activeTab === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
                    style={{padding: '10px 15px', fontSize: '0.85rem'}}
                >
                    Rejected ({tutors.filter(t => t.status === 'rejected').length})
                </button>
            </div>

            <div className="glass" style={{borderRadius: '20px', overflow: 'hidden'}}>
                <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed'}}>
                <thead style={{background: 'rgba(0,137,224,0.1)'}}>
                    <tr>
                    <th style={{padding: '20px', width: '40%'}}>Tutor Details</th>
                    <th style={{padding: '20px', width: '25%'}}>Documents</th>
                    <th style={{padding: '20px', width: '15%'}}>Payment</th>
                    <th style={{padding: '20px', width: '20%'}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                    <tr><td colSpan="4" style={{padding: '40px', textAlign: 'center'}}>Loading data...</td></tr>
                    ) : filteredTutors.length > 0 ? filteredTutors.map(tutor => (
                    <tr key={tutor.id} style={{borderBottom: '1px solid var(--border)'}}>
                        <td style={{padding: '20px', verticalAlign: 'top'}}>
                        <div style={{fontWeight: '600', fontSize: '1.1rem'}}>{tutor.name}</div>
                        <div style={{fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: '10px'}}>{tutor.email}</div>
                        <div className="glass" style={{padding: '12px', borderRadius: '15px', fontSize: '0.85rem', background: 'rgba(0,137,224,0.05)', border: '1px solid rgba(0,137,224,0.1)'}}>
                            <div style={{marginBottom: '5px', fontWeight: 'bold', color: 'var(--primary)'}}>
                                🎯 {tutor.specialization || 'No Specialization'}
                            </div>
                            <div style={{marginBottom: '8px', maxHeight: '100px', overflowY: 'auto', lineHeight: '1.4'}}>
                                <strong>Bio:</strong> {tutor.bio || 'Not provided'}
                            </div>
                            <div style={{display: 'flex', gap: '15px', fontSize: '0.8rem', color: 'var(--text-soft)', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '8px'}}>
                            <span>💼 {tutor.experience} Yrs Exp</span>
                            <span>📍 {tutor.location}</span>
                            <span>💰 ₹{tutor.price_per_hour}/hr</span>
                            </div>
                        </div>
                        </td>
                        <td style={{padding: '20px', verticalAlign: 'top'}}>
                        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                            <a href={tutor.resume_url || '#'} target="_blank" className="badge" style={{background: tutor.resume_url ? '#27ae60' : '#bdc3c7', textDecoration: 'none', fontSize: '0.7rem', padding: '5px 10px', borderRadius: '8px'}}>Resume</a>
                            <a href={tutor.id_proof_url || '#'} target="_blank" className="badge" style={{background: tutor.id_proof_url ? '#27ae60' : '#bdc3c7', textDecoration: 'none', fontSize: '0.7rem', padding: '5px 10px', borderRadius: '8px'}}>ID</a>
                            <a href={tutor.education_url || '#'} target="_blank" className="badge" style={{background: tutor.education_url ? '#27ae60' : '#bdc3c7', textDecoration: 'none', fontSize: '0.7rem', padding: '5px 10px', borderRadius: '8px'}}>Education</a>
                            <a href={tutor.exp_proof_url || '#'} target="_blank" className="badge" style={{background: tutor.exp_proof_url ? '#27ae60' : '#bdc3c7', textDecoration: 'none', fontSize: '0.7rem', padding: '5px 10px', borderRadius: '8px'}}>Exp Proof</a>
                            <a href={tutor.address_proof_url || '#'} target="_blank" className="badge" style={{background: tutor.address_proof_url ? '#27ae60' : '#bdc3c7', textDecoration: 'none', fontSize: '0.7rem', padding: '5px 10px', borderRadius: '8px'}}>Address</a>
                        </div>
                        </td>
                        <td style={{padding: '20px', verticalAlign: 'top'}}>
                        <span style={{
                            color: tutor.payment_status === 'paid' ? '#27ae60' : '#f39c12',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            display: 'inline-block',
                            marginTop: '5px'
                        }}>
                            {tutor.payment_status.toUpperCase()}
                        </span>
                        </td>
                        <td style={{padding: '20px', verticalAlign: 'top'}}>
                        <div style={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                            {(tutor.status === 'pending' || tutor.status === 'rejected') && (
                            <button 
                                onClick={() => handleAction(tutor.id, 'approved', 'paid')}
                                className="btn btn-primary" 
                                style={{padding: '8px 15px', fontSize: '0.85rem'}}
                            >
                                Approve
                            </button>
                            )}
                            {tutor.status !== 'rejected' && (
                            <button 
                                onClick={() => openRejectModal(tutor)}
                                className="btn btn-outline" 
                                style={{padding: '8px 15px', fontSize: '0.85rem', borderColor: '#e74c3c', color: '#e74c3c'}}
                            >
                                Reject
                            </button>
                            )}
                            {tutor.status === 'rejected' && (
                            <div style={{color: '#e74c3c', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '5px'}}>
                                Reason: {tutor.rejection_reason}
                            </div>
                            )}
                            <button 
                            onClick={() => handleDelete(tutor)}
                            className="btn btn-outline" 
                            style={{padding: '8px 15px', fontSize: '0.85rem', borderColor: '#333', color: '#333'}}
                            >
                            🗑️ Delete
                            </button>
                        </div>
                        </td>
                    </tr>
                    )) : (
                    <tr><td colSpan="4" style={{padding: '60px', textAlign: 'center', color: 'var(--text-soft)'}}>No {activeTab} candidates found.</td></tr>
                    )}
                </tbody>
                </table>
            </div>

        </>
      ) : (
        <div className="glass" style={{borderRadius: '20px', overflow: 'hidden'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed'}}>
                <thead style={{background: 'rgba(0,137,224,0.1)'}}>
                    <tr>
                        <th style={{padding: '20px', width: '40%'}}>Course Title</th>
                        <th style={{padding: '20px', width: '20%'}}>Tutor</th>
                        <th style={{padding: '20px', width: '20%'}}>Price & Duration</th>
                        <th style={{padding: '20px', width: '20%'}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.length > 0 ? courses.map(course => (
                        <tr key={course.id} style={{borderBottom: '1px solid var(--border)'}}>
                            <td style={{padding: '20px', verticalAlign: 'top'}}>
                                <div style={{fontWeight: '600', fontSize: '1.1rem'}}>{course.title}</div>
                                <div style={{fontSize: '0.85rem', color: 'var(--text-soft)', marginTop: '5px'}}>{course.description}</div>
                            </td>
                            <td style={{padding: '20px', verticalAlign: 'top'}}>
                                <div style={{fontWeight: '500'}}>{course.tutor_name}</div>
                            </td>
                            <td style={{padding: '20px', verticalAlign: 'top'}}>
                                <div style={{fontWeight: 'bold', color: '#10b981'}}>💰 ₹{course.price}</div>
                                <div style={{fontSize: '0.85rem', color: 'var(--text-soft)', marginTop: '5px'}}>⏳ {course.duration}</div>
                            </td>
                            <td style={{padding: '20px', verticalAlign: 'top'}}>
                                <div style={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                                    <button 
                                        onClick={() => handleCourseAction(course.id, 'approved')}
                                        className="btn btn-primary" 
                                        style={{padding: '8px 15px', fontSize: '0.85rem', background: '#27ae60'}}
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleCourseAction(course.id, 'rejected')}
                                        className="btn btn-outline" 
                                        style={{padding: '8px 15px', fontSize: '0.85rem', borderColor: '#e74c3c', color: '#e74c3c'}}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="4" style={{padding: '60px', textAlign: 'center', color: 'var(--text-soft)'}}>No courses awaiting approval.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
