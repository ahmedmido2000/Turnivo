import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CleanerProblemDetailsMain from '../components/CleanerProblemDetailsMain';

const CleanerProblemDetails = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <DashboardLayout 
      isMobileMenuOpen={isMobileMenuOpen} 
      onMobileMenuClose={() => setIsMobileMenuOpen(false)}
    >
      <CleanerProblemDetailsMain onMobileMenuClick={handleMobileMenuToggle} />
    </DashboardLayout>
  );
};

export default CleanerProblemDetails;
