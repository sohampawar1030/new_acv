import React from 'react';

const Newsletter = () => {
  return (
    <section className="container" style={{margin: '100px auto', textAlign: 'center'}}>
      <div className="glass" style={{padding: '60px', borderRadius: '40px'}}>
        <h2 style={{fontSize: '2.5rem', marginBottom: '20px'}}>Join our Newsletter</h2>
        <p style={{color: 'var(--text-soft)', marginBottom: '30px'}}>Get the latest updates on new courses and top tutors directly in your inbox.</p>
        <div style={{display: 'flex', gap: '10px', maxWidth: '500px', margin: '0 auto'}}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            style={{flex: 1, padding: '15px 25px', borderRadius: '30px', border: '1px solid var(--border)', background: 'var(--bg-soft)', color: 'var(--text)', outline: 'none'}} 
          />
          <button className="btn btn-primary">Subscribe</button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
