import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CleanerMyProblemsMain from '../components/CleanerMyProblemsMain';

const CleanerMyProblems = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <DashboardLayout 
      isMobileMenuOpen={isMobileMenuOpen} 
      onMobileMenuClose={() => setIsMobileMenuOpen(false)}
    >
      <CleanerMyProblemsMain onMobileMenuClick={handleMobileMenuToggle} />
    </DashboardLayout>
  );
};

export default CleanerMyProblems;
