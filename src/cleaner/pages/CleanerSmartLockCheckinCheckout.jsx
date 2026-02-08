import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CleanerSmartLockCheckinCheckoutMain from '../components/CleanerSmartLockCheckinCheckoutMain';

const CleanerSmartLockCheckinCheckout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <DashboardLayout 
      isMobileMenuOpen={isMobileMenuOpen} 
      onMobileMenuClose={() => setIsMobileMenuOpen(false)}
    >
      <CleanerSmartLockCheckinCheckoutMain onMobileMenuClick={handleMobileMenuToggle} />
    </DashboardLayout>
  );
};

export default CleanerSmartLockCheckinCheckout;
