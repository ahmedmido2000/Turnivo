import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CleanerSmartLockRequestsMain from '../components/CleanerSmartLockRequestsMain';

const CleanerSmartLockRequests = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <DashboardLayout 
      isMobileMenuOpen={isMobileMenuOpen} 
      onMobileMenuClose={() => setIsMobileMenuOpen(false)}
    >
      <CleanerSmartLockRequestsMain onMobileMenuClick={handleMobileMenuToggle} />
    </DashboardLayout>
  );
};

export default CleanerSmartLockRequests;
