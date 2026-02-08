import React from 'react';
import Navbar from '../../clients/components/Navbar';
import Footer from '../../clients/components/Footer';
import LegalContent from '../components/LegalContent';

const TermsAndConditions = () => {
  return (
    <div className="bg-light">
      <Navbar />
      <LegalContent title="Terms and Conditions" type="terms" />
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
