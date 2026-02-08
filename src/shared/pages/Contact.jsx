import React from 'react';
import Navbar from '../../clients/components/Navbar';
import Footer from '../../clients/components/Footer';
import ContactUsMain from '../components/ContactUsMain';

const Contact = () => {
  return (
    <div className="bg-light">
      <Navbar />
      <ContactUsMain />
      <Footer />
    </div>
  );
};

export default Contact;
