import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const categories = [
  "Class 12 Tuition", "Class 11 Tuition", "Class 10 Tuition", "Class 9 Tuition", "Class 8 Tuition", "Class 7 Tuition", "Class 6 Tuition", "Class 1 to 5 Tuition", "Nursery-KG Tuition",
  "BTech Tuition", "BCom Tuition", "BBA Tuition", "Mathematics", "English", "Science",
  "Spoken English", "German Language", "French Language", "Spanish Language", "Japanese Language", "Hindi Language", "Kannada Language", "Tamil Language", "Telugu Language", "Marathi Speaking",
  "Dance", "Hindustani Music", "Guitar", "Keyboard", "Yoga", "Cooking", "Photography", "Drawing", "Painting", "Singing", "Violin", "Handwriting",
  "Python Training", "Java Training", ".Net Training", "JavaScript Training", "Microsoft Excel", "SAP", "AWS", "Angular.JS", "DevOps Training", "Data Science",
  "IELTS Coaching", "GRE Coaching", "GMAT Coaching", "TOEFL Coaching", "Engineering Entrance", "Medical Entrance", "CA Coaching", "MBA Entrance", "UPSC Coaching", "SSC Exam Coaching"
];

const TutorDashboard = () => {
  const [tutorData, setTutorData] = useState({
    name: '',
    email: '',
    bio: '',
    experience: 0,
    price_per_hour: 0,
    location: '',
    status: 'pending',
    payment_status: 'unpaid',
    photo_url: '',
    photo_local_url: '',
    resume_url: '',
    id_proof_url: '',
    certificate_url: '',
    specialization: '',
    skills: '',
    is_submitted: false
  });

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const isDemo = localStorage.getItem('demo_mode') === 'true';
    if (isDemo) {
      const fakeUrl = URL.createObjectURL(file);
      setTutorData(prev => ({ ...prev, [type]: fakeUrl }));
      alert(`${type.replace('_url', '').replace('_', ' ').toUpperCase()} uploaded successfully (Demo Mode)!`);
      return;
    }

    const formData = new FormData();
    formData.append('photo', file); // API expects 'photo' field name

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTutorData(prev => ({ ...prev, [type]: res.data.imageUrl }));
      alert(`${type.replace('_url', '').replace('_', ' ').toUpperCase()} uploaded successfully!`);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading file.');
    }
  };
  const [students, setStudents] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'profile', 'inquiries', 'courses', or 'enrollments'
  const [newCourse, setNewCourse] = useState({ title: '', description: '', price: '', duration: '' });
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showPaymentModalConfirm, setShowPaymentModalConfirm] = useState(false);
  const [profileStep, setProfileStep] = useState(1);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const navigate = useNavigate();

  const tutorId = localStorage.getItem('tutor_id');

  const fetchEnrollments = () => {
    axios.get(`http://localhost:5000/api/tutor/enrollments/${tutorId}`)
      .then(res => setEnrollments(res.data))
      .catch(err => console.error('Error fetching enrollments:', err));
  };

  const fetchInquiries = () => {
    axios.get(`http://localhost:5000/api/tutors/${tutorId}/inquiries`)
      .then(res => setInquiries(res.data))
      .catch(err => console.error('Error fetching inquiries:', err));
  };

  useEffect(() => {
    if (!tutorId || tutorId === 'undefined' || tutorId === 'null') {
      navigate('/login');
      return;
    }

    const isDemo = localStorage.getItem('demo_mode') === 'true';

    if (isDemo) {
        setTutorData({
            name: 'Demo Tutor',
            email: 'tutor@demo.com',
            bio: 'Experienced educator with over 10 years of teaching expertise in Mathematics and Science.',
            experience: 10,
            price_per_hour: 500,
            location: 'Mumbai, India',
            status: 'approved',
            payment_status: 'paid',
            photo_url: 'https://images.unsplash.com/photo-1544717297-fa154da09f9b?q=80&w=2070&auto=format&fit=crop',
            specialization: 'Mathematics Expert',
            skills: 'Calculus, Algebra, Geometry'
        });
        setEnrollments([
            { id: 1, student_name: 'Soham Pawar', student_phone: '7030806080', course_title: 'Maths Advanced', status: 'pending', fee_status: 'pending', enrolled_at: new Date() },
            { id: 2, student_name: 'Neha Gupta', student_phone: '9876543210', course_title: 'Maths Advanced', status: 'approved', fee_status: 'paid', enrolled_at: new Date() }
        ]);
        setInquiries([
            { id: 1, student_name: 'Rahul Kumar', student_email: 'rahul@test.com', student_phone: '9999888777', message: 'Hello, I am interested in your Calculus classes.', status: 'new', created_at: new Date() }
        ]);
        setCourses([
            { id: 1, title: 'Maths Advanced', description: 'Complete calculus and algebra for standard 12th.', price: 2999, duration: '3 Months', status: 'approved' }
        ]);
        return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/tutors`);
        const current = res.data.find(t => String(t.id) === String(tutorId));
        if (current) {
          setTutorData(prev => ({ 
            ...prev, 
            ...current,
            bio: current.bio || '',
            skills: current.skills || '',
            price_per_hour: current.price_per_hour || 0,
            experience: current.experience || 0,
            specialization: current.specialization || ''
          }));
          if (current.status === 'approved') setActiveTab('dashboard');
          else setActiveTab('profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
    fetchEnrollments();
    fetchInquiries();

    axios.get(`http://localhost:5000/api/tutors/${tutorId}/courses`)
      .then(res => setCourses(res.data))
      .catch(err => console.error('Error fetching courses:', err));

    const interval = setInterval(() => {
        fetchEnrollments();
        fetchInquiries();
    }, 10000);
    return () => clearInterval(interval);
  }, [navigate, tutorId]);

  const handleInputChange = (e) => {
    setTutorData({ ...tutorData, [e.target.name]: e.target.value });
  };

  const handleEnrollmentAction = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/enrollments/${id}/status`, { status });
      alert(`Student Enrollment ${status} successfully`);
      fetchEnrollments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFinalSubmit = async () => {
    const isDemo = localStorage.getItem('demo_mode') === 'true';
    if (isDemo) {
      setTutorData({ ...tutorData, payment_status: 'paid', is_submitted: true });
      setIsEditingReview(false);
      setMessage('Profile submitted successfully (Demo Mode)!');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/tutors/profile', {
        tutor_id: tutorId,
        bio: tutorData.bio,
        experience: tutorData.experience,
        price_per_hour: tutorData.price_per_hour,
        location: tutorData.location,
        photo_url: tutorData.photo_url,
        resume_url: tutorData.resume_url,
        id_proof_url: tutorData.id_proof_url,
        certificate_url: tutorData.certificate_url,
        specialization: tutorData.specialization,
        skills: tutorData.skills
      });
      setTutorData({ ...tutorData, payment_status: 'paid' });
      setShowPaymentModal(false);
      setProfileStep(1); // Reset for next time if needed
      setMessage('Profile and Documents updated successfully!');
      // Update local state status to trigger "Under Review" screen
      setTutorData(prev => ({ ...prev, is_submitted: true }));
      setIsEditingReview(false);
    } catch (err) {
      console.error(err);
      setMessage('Error updating profile.');
    }
  };

  const renderUnderReview = () => (
    <div className="animate-fade" style={{textAlign: 'center', padding: '60px 20px'}}>
      <div className="glass" style={{padding: '50px', borderRadius: '30px', maxWidth: '600px', margin: '0 auto'}}>
        <div style={{fontSize: '4rem', marginBottom: '20px'}}>⏳</div>
        <h2 style={{fontSize: '2rem', marginBottom: '15px'}}>Profile Under Review</h2>
        <p style={{color: 'var(--text-soft)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px'}}>
          Thank you for completing your profile! Our admin team is currently verifying your documents and details. 
          This process usually takes 24-48 hours.
        </p>
        <div style={{background: 'rgba(0,137,224,0.1)', padding: '20px', borderRadius: '15px', textAlign: 'left', marginBottom: '30px'}}>
          <h4 style={{marginBottom: '10px', color: 'var(--primary)'}}>What happens next?</h4>
          <ul style={{fontSize: '0.9rem', color: 'var(--text-soft)', paddingLeft: '20px'}}>
            <li>We verify your ID and certificates.</li>
            <li>Once approved, your profile will be visible to students.</li>
            <li>You will receive full access to your dashboard.</li>
          </ul>
        </div>
        <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
          <button onClick={() => setIsEditingReview(true)} className="btn btn-primary" style={{padding: '12px 30px'}}>✏️ Edit Profile</button>
          <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="btn btn-outline" style={{padding: '12px 30px'}}>Logout</button>
        </div>
      </div>
    </div>
  );

  const renderProfileForm = () => (
    <div className="grid grid-1 animate-fade" style={{maxWidth: '800px', margin: '0 auto'}}>
      <div className="glass" style={{padding: '40px', borderRadius: '30px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
          <h2 style={{margin: 0}}>{tutorData.payment_status === 'paid' ? 'Edit Profile' : 'Complete Profile'}</h2>
          <div style={{display: 'flex', gap: '10px'}}>
            <span style={{
              width: '30px', 
              height: '30px', 
              borderRadius: '50%', 
              background: profileStep === 1 ? 'var(--primary)' : 'rgba(0,137,224,0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white'
            }}>1</span>
            <span style={{
              width: '30px', 
              height: '30px', 
              borderRadius: '50%', 
              background: profileStep === 2 ? 'var(--primary)' : 'rgba(0,137,224,0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white'
            }}>2</span>
          </div>
        </div>

        {profileStep === 1 ? (
          <form onSubmit={(e) => { e.preventDefault(); setProfileStep(2); }} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <div className="input-group">
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>Designation / Specialization</label>
              <input 
                type="text" 
                name="specialization" 
                list="category-list"
                value={tutorData.specialization} 
                onChange={handleInputChange} 
                className="glass w-100" 
                style={{padding: '12px', borderRadius: '10px'}} 
                placeholder="e.g. Maths Expert or select from list" 
              />
              <datalist id="category-list">
                {categories.map((cat, index) => (
                  <option key={index} value={cat} />
                ))}
              </datalist>
            </div>
            <div className="input-group">
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>About Me (Bio)</label>
              <textarea name="bio" value={tutorData.bio} onChange={handleInputChange} className="glass w-100" style={{padding: '12px', borderRadius: '10px', height: '120px'}} placeholder="Write about your teaching style and expertise..." />
            </div>
            <div className="grid grid-2" style={{gap: '20px'}}>
              <div className="input-group">
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>Experience (Years)</label>
                <input type="number" name="experience" value={tutorData.experience} onChange={handleInputChange} className="glass w-100" style={{padding: '12px', borderRadius: '10px'}} />
              </div>
              <div className="input-group">
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>Price per Hour (₹)</label>
                <input type="number" name="price_per_hour" value={tutorData.price_per_hour} onChange={handleInputChange} className="glass w-100" style={{padding: '12px', borderRadius: '10px'}} />
              </div>
            </div>
            <div className="input-group">
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>City / Location</label>
              <input type="text" name="location" value={tutorData.location} onChange={handleInputChange} className="glass w-100" style={{padding: '12px', borderRadius: '10px'}} placeholder="e.g. Pune, Maharashtra" />
            </div>
            <button type="submit" className="btn btn-primary" style={{padding: '15px', marginTop: '10px'}}>
              Next: Upload Documents ➔
            </button>
          </form>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '30px'}}>
            <div className="glass" style={{padding: '20px', borderRadius: '15px', border: '1px dashed var(--border)'}}>
              <h4 style={{marginBottom: '15px', color: 'var(--primary)'}}>📄 Required Documents</h4>
              <p style={{fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: '20px'}}>Please upload your documents for verification. Max size 5MB each.</p>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                <div className="upload-item">
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>Resume / CV {tutorData.resume_url && '✅'}</label>
                  <input type="file" onChange={(e) => handleFileUpload(e, 'resume_url')} accept=".pdf,.doc,.docx" />
                </div>

                <div className="upload-item">
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>ID Proof (Aadhar/PAN) {tutorData.id_proof_url && '✅'}</label>
                  <input type="file" onChange={(e) => handleFileUpload(e, 'id_proof_url')} accept="image/*,.pdf" />
                </div>

                <div className="upload-item">
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>Qualification Certificate {tutorData.certificate_url && '✅'}</label>
                  <input type="file" onChange={(e) => handleFileUpload(e, 'certificate_url')} accept="image/*,.pdf" />
                </div>

                <div className="upload-item">
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}}>Profile Photo {tutorData.photo_url && '✅'}</label>
                  <input type="file" onChange={(e) => handleFileUpload(e, 'photo_url')} accept="image/*" />
                </div>
              </div>
            </div>

            <div style={{display: 'flex', gap: '15px'}}>
              <button onClick={() => setProfileStep(1)} className="btn btn-outline" style={{flex: 1, padding: '15px'}}>
                ⬅ Back to Info
              </button>
              <button 
                onClick={() => {
                  if (!tutorData.resume_url || !tutorData.id_proof_url) {
                    alert('Please upload at least your Resume and ID Proof before submitting.');
                    return;
                  }
                  tutorData.payment_status === 'paid' ? handleFinalSubmit() : setShowPaymentModal(true);
                }} 
                className="btn btn-primary" 
                style={{flex: 2, padding: '15px'}}
              >
                {tutorData.payment_status === 'paid' ? 'Save Changes' : 'Finalize & Submit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderEnrollments = () => {
    const groupedEnrollments = enrollments.reduce((acc, curr) => {
      const course = curr.course_title || 'General / Individual Coaching';
      if (!acc[course]) acc[course] = [];
      acc[course].push(curr);
      return acc;
    }, {});

    return (
      <div className="animate-fade">
        <h2 style={{marginBottom: '30px'}}>Student Enrollments</h2>
        {Object.keys(groupedEnrollments).length > 0 ? Object.entries(groupedEnrollments).map(([courseName, students]) => (
          <div key={courseName} className="glass" style={{padding: '25px', borderRadius: '25px', marginBottom: '30px', borderLeft: '8px solid var(--primary)'}}>
            <h3 style={{marginBottom: '15px', color: 'var(--primary)'}}>📚 {courseName}</h3>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{textAlign: 'left', fontSize: '0.9rem', color: 'var(--text-soft)', borderBottom: '1px solid var(--border)'}}>
                    <th style={{padding: '12px'}}>Student</th>
                    <th style={{padding: '12px'}}>Fee Status</th>
                    <th style={{padding: '12px'}}>Status</th>
                    <th style={{padding: '12px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(enroll => (
                    <tr key={enroll.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                      <td style={{padding: '12px'}}>
                        <div style={{fontWeight: '600'}}>{enroll.student_name}</div>
                        <div style={{fontSize: '0.75rem', color: 'var(--text-soft)'}}>📞 {enroll.student_phone}</div>
                      </td>
                      <td style={{padding: '12px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                          <span style={{fontSize: '0.75rem', fontWeight: 'bold', color: enroll.fee_status === 'paid' ? '#10b981' : '#ef4444'}}>
                              {enroll.fee_status ? enroll.fee_status.toUpperCase() : 'PENDING'}
                          </span>
                          {enroll.fee_status !== 'paid' && (
                            <button 
                              onClick={() => {
                                setSelectedEnrollment(enroll);
                                setShowPaymentModalConfirm(true);
                              }}
                              className="btn btn-outline" 
                              style={{padding: '2px 8px', fontSize: '0.65rem', borderColor: '#10b981', color: '#10b981'}}
                            >
                              Confirm Payment
                            </button>
                          )}
                        </div>
                      </td>
                      <td style={{padding: '12px'}}>
                        <span style={{fontSize: '0.75rem', fontWeight: 'bold', color: enroll.status === 'approved' ? '#27ae60' : '#f39c12'}}>{enroll.status.toUpperCase()}</span>
                      </td>
                      <td style={{padding: '12px'}}>
                        {enroll.status === 'pending' && (
                          <div style={{display: 'flex', gap: '8px'}}>
                            <button onClick={() => handleEnrollmentAction(enroll.id, 'approved')} className="btn btn-primary" style={{padding: '4px 10px', fontSize: '0.7rem', background: '#27ae60'}}>Approve</button>
                            <button onClick={() => handleEnrollmentAction(enroll.id, 'rejected')} className="btn btn-outline" style={{padding: '4px 10px', fontSize: '0.7rem', borderColor: '#e74c3c', color: '#e74c3c'}}>Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )) : <div className="glass" style={{padding: '50px', textAlign: 'center', borderRadius: '25px'}}>No requests.</div>}
      </div>
    );
  };

  const renderInquiries = () => (
    <div className="animate-fade">
        <h2 style={{marginBottom: '25px'}}>Student Inquiries</h2>
        <div style={{display: 'grid', gap: '20px'}}>
            {inquiries.length > 0 ? inquiries.map((inq) => (
                <div key={inq.id} className="glass" style={{padding: '25px', borderRadius: '20px', borderLeft: inq.status === 'new' ? '6px solid #ef4444' : '6px solid #64748b'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px'}}>
                        <div>
                            <h3 style={{margin: 0}}>{inq.student_name}</h3>
                            <div style={{fontSize: '0.85rem', color: 'var(--text-soft)'}}>📧 {inq.student_email} | 📞 {inq.student_phone}</div>
                        </div>
                        <button 
                            onClick={() => {
                                setDeleteId(inq.id);
                                setShowDeleteModal(true);
                            }}
                            className="btn btn-outline" 
                            style={{padding: '5px 15px', fontSize: '0.8rem', borderColor: '#ef4444', color: '#ef4444'}}
                        >
                            🗑️ Delete
                        </button>
                    </div>
                    <div style={{background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)'}}>
                        <p style={{margin: 0, color: 'var(--text-soft)'}}>{inq.message}</p>
                    </div>
                </div>
            )) : <div className="glass" style={{padding: '50px', textAlign: 'center', borderRadius: '25px'}}>No messages.</div>}
        </div>
    </div>
  );

  const renderCourses = () => (
    <div className="animate-fade">
      <div className="glass" style={{padding: '35px', borderRadius: '25px', marginBottom: '40px'}}>
        <h2 style={{marginBottom: '20px'}}>✨ Create New Course</h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            await axios.post('http://localhost:5000/api/courses', { ...newCourse, tutor_id: tutorId });
            alert('Course submitted for approval!');
            setNewCourse({ title: '', description: '', price: '', duration: '' });
            // Refetch courses
            axios.get(`http://localhost:5000/api/tutors/${tutorId}/courses`)
              .then(res => setCourses(res.data));
          } catch (err) { console.error(err); }
        }} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <input 
            type="text" 
            placeholder="Course Title (e.g. Class 12 Tuition)" 
            required 
            list="course-category-list"
            value={newCourse.title} 
            onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} 
            className="glass w-100" 
            style={{padding: '12px', borderRadius: '10px'}} 
          />
          <datalist id="course-category-list">
            {categories.map((cat, index) => (
              <option key={index} value={cat} />
            ))}
          </datalist>
          <textarea placeholder="Course Description" required value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} className="glass w-100" style={{padding: '12px', borderRadius: '10px', height: '80px'}} />
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
            <input type="number" placeholder="Price (₹)" required value={newCourse.price} onChange={(e) => setNewCourse({...newCourse, price: e.target.value})} className="glass w-100" style={{padding: '12px', borderRadius: '10px'}} />
            <input type="text" placeholder="Duration (e.g. 3 Months)" required value={newCourse.duration} onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})} className="glass w-100" style={{padding: '12px', borderRadius: '10px'}} />
          </div>
          <button type="submit" className="btn btn-primary" style={{padding: '15px', fontSize: '1rem'}}>Submit for Approval</button>
        </form>
      </div>

      <div className="glass" style={{padding: '35px', borderRadius: '25px'}}>
        <h2 style={{marginBottom: '25px'}}>📚 My Courses</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px'}}>
          {courses.length > 0 ? courses.map((course) => (
            <div key={course.id} className="glass" style={{padding: '25px', borderRadius: '20px', position: 'relative', border: '1px solid rgba(255,255,255,0.05)'}}>
               <div style={{position: 'absolute', top: '15px', right: '15px'}}>
                  <span style={{
                    fontSize: '0.7rem', 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    background: course.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(243, 156, 18, 0.1)',
                    color: course.status === 'approved' ? '#10b981' : '#f39c12',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {course.status || 'PENDING'}
                  </span>
                </div>
              <h3 style={{fontSize: '1.3rem', marginBottom: '10px', paddingRight: '80px'}}>{course.title}</h3>
              <p style={{color: 'var(--text-soft)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5'}}>{course.description}</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px'}}>
                <span style={{fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem'}}>₹{course.price}</span>
                <span style={{fontSize: '0.85rem', color: 'var(--text-soft)'}}>⏱️ {course.duration}</span>
              </div>
            </div>
          )) : (
            <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '40px'}}>
              <p style={{color: 'var(--text-soft)'}}>You haven't created any courses yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="animate-fade">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px'}}>
        <h1 style={{fontSize: '1.8rem'}}>Welcome, {tutorData.name.split(' ')[0]}!</h1>
        <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="btn btn-outline" style={{borderColor: '#ef4444', color: '#ef4444', padding: '8px 20px', fontSize: '0.9rem'}}>Logout</button>
      </div>
      <div className="grid grid-3">
        <div className="glass" style={{padding: '20px', borderRadius: '20px', textAlign: 'center', borderBottom: '4px solid var(--primary)'}}>
          <p style={{fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 'bold'}}>TOTAL ENROLLMENTS</p>
          <h2 style={{fontSize: '1.8rem', margin: '10px 0'}}>{enrollments.length}</h2>
        </div>
        <div className="glass" style={{padding: '20px', borderRadius: '20px', textAlign: 'center', borderBottom: '4px solid #10b981', cursor: 'pointer'}} onClick={() => setActiveTab('enrollments')}>
          <p style={{fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 'bold'}}>NEW REQUESTS</p>
          <h2 style={{fontSize: '1.8rem', margin: '10px 0', color: '#10b981'}}>{enrollments.filter(e => e.status === 'pending').length}</h2>
        </div>
        <div className="glass" style={{padding: '20px', borderRadius: '20px', textAlign: 'center', borderBottom: '4px solid #ef4444', cursor: 'pointer'}} onClick={() => setActiveTab('inquiries')}>
          <p style={{fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 'bold'}}>INQUIRIES</p>
          <h2 style={{fontSize: '1.8rem', margin: '10px 0', color: '#ef4444'}}>{inquiries.filter(i => i.status === 'new').length}</h2>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container" style={{marginTop: '120px', paddingBottom: '100px'}}>
      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)'}}>
          <div className="glass animate-float" style={{padding: '40px', borderRadius: '30px', maxWidth: '400px', width: '90%', textAlign: 'center', border: '1px solid #ef4444'}}>
            <div style={{fontSize: '3.5rem', marginBottom: '20px'}}>⚠️</div>
            <h2 style={{marginBottom: '10px'}}>Delete Message?</h2>
            <p style={{color: 'var(--text-soft)', marginBottom: '30px'}}>Are you sure you want to delete this inquiry? This action cannot be undone.</p>
            <div style={{display: 'flex', gap: '15px'}}>
              <button 
                onClick={async () => {
                  try {
                    await axios.delete(`http://localhost:5000/api/inquiries/${deleteId}`);
                    setInquiries(inquiries.filter(i => i.id !== deleteId));
                    setShowDeleteModal(false);
                  } catch (err) { console.error(err); }
                }}
                className="btn btn-primary" 
                style={{flex: 1, background: '#ef4444', border: 'none'}}
              >
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-outline" style={{flex: 1}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Payment Confirmation Modal */}
      {showPaymentModalConfirm && selectedEnrollment && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)'}}>
          <div className="glass animate-float" style={{padding: '40px', borderRadius: '30px', maxWidth: '400px', width: '90%', textAlign: 'center', border: '1px solid #10b981'}}>
            <div style={{fontSize: '3.5rem', marginBottom: '20px'}}>💰</div>
            <h2 style={{marginBottom: '10px'}}>Confirm Payment?</h2>
            <p style={{color: 'var(--text-soft)', marginBottom: '30px'}}>Are you sure you want to mark payment for <strong>{selectedEnrollment.student_name}</strong> as received?</p>
            <div style={{display: 'flex', gap: '15px'}}>
              <button 
                onClick={async () => {
                  try {
                    await axios.patch(`http://localhost:5000/api/enrollments/${selectedEnrollment.id}/fee-status`, { fee_status: 'paid' });
                    fetchEnrollments();
                    setShowPaymentModalConfirm(false);
                  } catch (err) { console.error(err); }
                }}
                className="btn btn-primary" 
                style={{flex: 1, background: '#10b981', border: 'none'}}
              >
                Yes, Received
              </button>
              <button onClick={() => setShowPaymentModalConfirm(false)} className="btn btn-outline" style={{flex: 1}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Tutor Profile Submission / Payment Modal */}
      {showPaymentModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 4000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(15px)'}}>
          <div className="glass animate-float" style={{padding: '50px', borderRadius: '40px', maxWidth: '500px', width: '95%', textAlign: 'center', border: '1px solid var(--primary)'}}>
            <div style={{fontSize: '4rem', marginBottom: '20px'}}>🚀</div>
            <h2 style={{marginBottom: '15px'}}>One Final Step!</h2>
            <p style={{color: 'var(--text-soft)', marginBottom: '30px', lineHeight: '1.6'}}>
              To activate your tutor profile and start receiving students, there is a one-time platform activation fee of <strong>₹499</strong>.
            </p>
            <div style={{background: 'rgba(0,137,224,0.05)', padding: '20px', borderRadius: '20px', marginBottom: '30px', textAlign: 'left'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                <span>Activation Fee</span>
                <span>₹499</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid var(--border)', paddingTop: '10px'}}>
                <span>Total Amount</span>
                <span style={{color: 'var(--primary)'}}>₹499</span>
              </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <button 
                onClick={() => {
                  navigate('/tutor-payment', { state: { profileData: tutorData } });
                  setShowPaymentModal(false);
                }}
                className="btn btn-primary" 
                style={{padding: '18px', fontSize: '1.1rem'}}
              >
                Pay & Submit Profile
              </button>
              <button onClick={() => setShowPaymentModal(false)} className="btn btn-outline" style={{padding: '12px'}}>Cancel</button>
            </div>
            <p style={{fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: '20px'}}>
              * Secure payment gateway integration will be added in production.
            </p>
          </div>
        </div>
      )}

      {tutorData.status === 'approved' && (
        <div style={{display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '10px', overflowX: 'auto', whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none'}}>
          <button onClick={() => setActiveTab('dashboard')} className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`} style={{padding: '8px 20px', border: 'none', fontSize: '0.9rem'}}>Dashboard</button>
          <button onClick={() => setActiveTab('enrollments')} className={`btn ${activeTab === 'enrollments' ? 'btn-primary' : 'btn-outline'}`} style={{padding: '8px 20px', border: 'none', position: 'relative', fontSize: '0.9rem'}}>
            Enrollments {enrollments.filter(e => e.status === 'pending').length > 0 && <span style={{position: 'absolute', top: '-5px', right: '-5px', background: '#10b981', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{enrollments.filter(e => e.status === 'pending').length}</span>}
          </button>
          <button onClick={() => setActiveTab('inquiries')} className={`btn ${activeTab === 'inquiries' ? 'btn-primary' : 'btn-outline'}`} style={{padding: '8px 20px', border: 'none', position: 'relative', fontSize: '0.9rem'}}>
            Inquiries {inquiries.filter(i => i.status === 'new').length > 0 && <span style={{position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{inquiries.filter(i => i.status === 'new').length}</span>}
          </button>
          <button onClick={() => setActiveTab('courses')} className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-outline'}`} style={{padding: '8px 20px', border: 'none', fontSize: '0.9rem'}}>Courses</button>
          <button onClick={() => setActiveTab('profile')} className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`} style={{padding: '8px 20px', border: 'none', fontSize: '0.9rem'}}>Profile</button>
        </div>
      )}
      {tutorData.status === 'approved' ? (
        activeTab === 'dashboard' ? renderDashboard() :
        activeTab === 'enrollments' ? renderEnrollments() :
        activeTab === 'inquiries' ? renderInquiries() :
        activeTab === 'courses' ? renderCourses() : renderProfileForm()
      ) : (
        tutorData.status === 'rejected' ? (
          <div className="animate-fade">
            <div className="glass" style={{padding: '20px', borderRadius: '15px', background: 'rgba(231, 76, 60, 0.1)', border: '1px solid #e74c3c', color: '#e74c3c', marginBottom: '30px', textAlign: 'center'}}>
              <strong>Profile Rejected:</strong> {tutorData.rejection_reason || 'Please update your details and resubmit.'}
            </div>
            {renderProfileForm()}
          </div>
        ) : (
          (tutorData.is_submitted && !isEditingReview) ? renderUnderReview() : renderProfileForm()
        )
      )}
    </div>
  );
};

export default TutorDashboard;
