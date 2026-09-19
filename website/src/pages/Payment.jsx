import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enrollmentData } = location.state || {};
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!enrollmentData) {
    return <div className="container" style={{marginTop: '150px'}}>Invalid access. Please start enrollment from the tutor profile.</div>;
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment gateway delay
    setTimeout(async () => {
      try {
        await axios.post('http://localhost:5000/api/enroll', {
          ...enrollmentData,
          fee_status: 'paid'
        });
        setIsSuccess(true);
        setIsProcessing(false);
        
        setTimeout(() => {
          navigate('/student-dashboard');
        }, 3000);
      } catch (err) {
        console.error(err);
        alert('Payment processed but failed to register enrollment. Please contact support.');
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="container" style={{marginTop: '120px', display: 'flex', justifyContent: 'center', paddingBottom: '100px'}}>
      <div className="glass" style={{padding: '40px', borderRadius: '30px', maxWidth: '500px', width: '90%', textAlign: 'center'}}>
        {isSuccess ? (
          <div className="animate-fade">
            <div style={{fontSize: '5rem', marginBottom: '20px'}}>🎉</div>
            <h2 style={{color: '#27ae60'}}>Payment Successful!</h2>
            <p style={{margin: '20px 0'}}>Your enrollment request has been sent to the teacher for approval.</p>
            <p style={{fontSize: '0.9rem', color: 'var(--text-soft)'}}>Redirecting to your dashboard...</p>
          </div>
        ) : (
          <>
            <h2 style={{marginBottom: '10px'}}>Secure Checkout</h2>
            <p style={{color: 'var(--text-soft)', marginBottom: '30px'}}>Complete your payment to {enrollmentData.tutor_name}</p>

            <div style={{background: 'rgba(0,137,224,0.05)', padding: '20px', borderRadius: '20px', marginBottom: '30px', textAlign: 'left', border: '1px solid rgba(0,137,224,0.1)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                <span style={{color: 'var(--text-soft)'}}>Course:</span>
                <span style={{fontWeight: 'bold'}}>{enrollmentData.course_title}</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem'}}>
                <span style={{fontWeight: '600'}}>Total Amount:</span>
                <span style={{fontWeight: 'bold', color: 'var(--primary)'}}>₹{enrollmentData.amount}</span>
              </div>
            </div>

            <form onSubmit={handlePayment} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              <div style={{textAlign: 'left'}}>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '0.9rem'}}>Card Holder Name</label>
                <input type="text" placeholder="John Doe" required style={{width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd'}} />
              </div>
              <div style={{textAlign: 'left'}}>
                <label style={{display: 'block', marginBottom: '8px', fontSize: '0.9rem'}}>Card Number</label>
                <input type="text" placeholder="4242 4242 4242 4242" required style={{width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd'}} />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                <div style={{textAlign: 'left'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '0.9rem'}}>Expiry</label>
                  <input type="text" placeholder="MM/YY" required style={{width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd'}} />
                </div>
                <div style={{textAlign: 'left'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontSize: '0.9rem'}}>CVV</label>
                  <input type="password" placeholder="***" required style={{width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd'}} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="btn btn-primary" 
                style={{padding: '18px', fontSize: '1.1rem', marginTop: '10px', background: isProcessing ? '#64748b' : 'var(--primary)'}}
              >
                {isProcessing ? 'Processing Payment...' : `Pay ₹${enrollmentData.amount} Now`}
              </button>
            </form>

            <div style={{marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px', opacity: 0.5}}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{height: '20px'}} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" style={{height: '20px'}} />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Razorpay_logo.webp" alt="Razorpay" style={{height: '20px'}} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;
