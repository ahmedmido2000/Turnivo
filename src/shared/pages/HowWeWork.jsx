import React from 'react';
import Navbar from '../../clients/components/Navbar';
import Footer from '../../clients/components/Footer';
import HowWeWorkMain from '../components/HowWeWorkMain';

const HowWeWork = () => {
  return (
    <div className="bg-light">
      <Navbar />
      <HowWeWorkMain />
      <Footer />
    </div>
  );
};

export default HowWeWork;
