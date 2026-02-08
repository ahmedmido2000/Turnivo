import React from 'react';
import Navbar from '../../clients/components/Navbar';
import Footer from '../../clients/components/Footer';
import LegalContent from '../components/LegalContent';

const LegalPrivacy = () => {
  return (
    <div className="bg-light">
      <Navbar />
      <LegalContent title="Privacy Policy" type="privacy" />
      <Footer />
    </div>
  );
};

export default LegalPrivacy;
