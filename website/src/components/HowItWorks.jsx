import React from 'react';

const HowItWorks = () => {
  const steps = [
    { icon: '🔍', title: 'Search', desc: 'Find the best tutors for your subject and city.' },
    { icon: '📅', title: 'Book', desc: 'Schedule a free demo class at your convenience.' },
    { icon: '🚀', title: 'Learn', desc: 'Start your learning journey with expert guidance.' }
  ];

  return (
    <section id="how-it-works" className="how-it-works container">
      <h2 className="section-title">How it <span>Works</span></h2>
      <div className="steps-grid">
        {steps.map((step, index) => (
          <div key={index} className="step-card glass animate-fade" style={{animationDelay: `${index * 0.2}s`}}>
            <div className="step-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
