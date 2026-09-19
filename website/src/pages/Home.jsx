import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import HowItWorks from '../components/HowItWorks';
import TutorList from '../components/TutorList';
import Newsletter from '../components/Newsletter';

const Home = () => {
  return (
    <div className="animate-fade">
      <Hero />
      <Stats />
      <HowItWorks />
      <main>
        <TutorList />
      </main>
      
      <Newsletter />
    </div>
  );
};

export default Home;
