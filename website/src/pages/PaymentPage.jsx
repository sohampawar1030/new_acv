import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    
    // Get profile data passed from TutorDashboard
    const profileData = location.state?.profileData;
    const tutorId = localStorage.getItem('tutor_id');

    useEffect(() => {
        if (!profileData || !tutorId) {
            alert('Invalid access. Redirecting to dashboard...');
            navigate('/tutor-dashboard');
        }
    }, [profileData, tutorId, navigate]);

    const handlePayment = async () => {
        setIsProcessing(true);
        
        // Simulate network delay for payment
        setTimeout(async () => {
            try {
                // 1. Update Profile & Submit to Admin
                const isDemo = localStorage.getItem('demo_mode') === 'true';
                
                if (!isDemo) {
                    await axios.post('http://localhost:5000/api/tutors/profile', {
                        ...profileData,
                        tutor_id: tutorId,
                        payment_status: 'paid',
                        is_submitted: true
                    });
                } else {
                    // For demo mode, we just simulate the success
                    console.log('Demo Mode: Profile submitted with fake payment');
                }

                setPaymentSuccess(true);
                setIsProcessing(false);
                
                // Redirect back after success message
                setTimeout(() => {
                    navigate('/tutor-dashboard');
                }, 3000);

            } catch (err) {
                console.error(err);
                alert('Error processing submission. Please try again.');
                setIsProcessing(false);
            }
        }, 2000);
    };

    if (paymentSuccess) {
        return (
            <div className="container" style={{marginTop: '150px', textAlign: 'center'}}>
                <div className="glass animate-float" style={{padding: '60px', borderRadius: '40px', maxWidth: '600px', margin: '0 auto'}}>
                    <div style={{fontSize: '5rem', marginBottom: '20px'}}>✅</div>
                    <h1 style={{marginBottom: '20px'}}>Payment Successful!</h1>
                    <p style={{fontSize: '1.2rem', color: 'var(--text-soft)', marginBottom: '30px'}}>
                        Your payment of ₹499 has been received. Your profile has been submitted to the admin for review.
                    </p>
                    <p style={{color: 'var(--primary)', fontWeight: '600'}}>Redirecting to your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{marginTop: '120px', paddingBottom: '100px'}}>
            <div className="glass" style={{maxWidth: '800px', margin: '0 auto', padding: '40px', borderRadius: '30px'}}>
                <div style={{textAlign: 'center', marginBottom: '40px'}}>
                    <h1 style={{fontSize: '2.5rem', marginBottom: '10px'}}>Secure Checkout</h1>
                    <p style={{color: 'var(--text-soft)'}}>Complete your tutor activation</p>
                </div>

                <div className="grid grid-2" style={{gap: '40px'}}>
                    {/* Left Side: Summary */}
                    <div style={{background: 'rgba(0,137,224,0.03)', padding: '30px', borderRadius: '25px', border: '1px solid var(--border)'}}>
                        <h3 style={{marginBottom: '20px'}}>Order Summary</h3>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                            <span style={{color: 'var(--text-soft)'}}>Platform Activation Fee</span>
                            <span style={{fontWeight: '600'}}>₹499.00</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                            <span style={{color: 'var(--text-soft)'}}>Taxes (GST 0%)</span>
                            <span style={{fontWeight: '600'}}>₹0.00</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '2px dashed var(--border)', fontSize: '1.2rem', fontWeight: 'bold'}}>
                            <span>Total</span>
                            <span style={{color: 'var(--primary)'}}>₹499.00</span>
                        </div>
                        
                        <div style={{marginTop: '30px', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981', fontSize: '0.9rem', textAlign: 'center'}}>
                            🛡️ 100% Secure Payment
                        </div>
                    </div>

                    {/* Right Side: Payment Methods */}
                    <div>
                        <h3 style={{marginBottom: '20px'}}>Payment Method</h3>
                        
                        {/* Fake Payment Options */}
                        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                            <div className="glass" style={{padding: '20px', borderRadius: '15px', border: '2px solid var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px'}}>
                                <div style={{width: '24px', height: '24px', borderRadius: '50%', border: '6px solid var(--primary)'}}></div>
                                <div>
                                    <div style={{fontWeight: 'bold'}}>UPI / QR Code</div>
                                    <div style={{fontSize: '0.8rem', color: 'var(--text-soft)'}}>Google Pay, PhonePe, Paytm</div>
                                </div>
                                <span style={{marginLeft: 'auto', fontSize: '1.5rem'}}>📱</span>
                            </div>

                            <div className="glass" style={{padding: '20px', borderRadius: '15px', border: '1px solid var(--border)', opacity: 0.6, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '15px'}}>
                                <div style={{width: '24px', height: '24px', borderRadius: '50%', border: '1px solid var(--border)'}}></div>
                                <div>
                                    <div style={{fontWeight: 'bold'}}>Credit / Debit Card</div>
                                    <div style={{fontSize: '0.8rem', color: 'var(--text-soft)'}}>Visa, Mastercard, RuPay</div>
                                </div>
                                <span style={{marginLeft: 'auto', fontSize: '1.5rem'}}>💳</span>
                            </div>

                            <div style={{marginTop: '20px'}}>
                                <button 
                                    onClick={handlePayment} 
                                    disabled={isProcessing}
                                    className="btn btn-primary" 
                                    style={{width: '100%', padding: '18px', fontSize: '1.1rem'}}
                                >
                                    {isProcessing ? '🔄 Processing Payment...' : 'Complete Payment ₹499'}
                                </button>
                                <button onClick={() => navigate('/tutor-dashboard')} className="btn btn-outline" style={{width: '100%', marginTop: '10px', border: 'none'}}>
                                    Cancel and Return
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
