import React from 'react';
import Navbar from '../../clients/components/Navbar';
import Footer from '../../clients/components/Footer';
import ServicesMain from '../components/ServicesMain';

const Services = () => {
  return (
    <div className="bg-light">
      <Navbar />
      <ServicesMain />
      <Footer />
    </div>
  );
};

export default Services;
