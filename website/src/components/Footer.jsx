import React from 'react';

const Footer = () => {
  return (
    <footer className="container" style={{padding: '50px 0', borderTop: '1px solid var(--border)', marginTop: '50px', textAlign: 'center'}}>
      <div style={{marginBottom: '20px'}}>
        <span className="logo-text">Urbon<span>Pro</span></span>
      </div>
      <p style={{color: 'var(--text-soft)'}}>&copy; 2026 Urbon Pro. All rights reserved. Your gateway to expert learning.</p>
    </footer>
  );
};

export default Footer;
