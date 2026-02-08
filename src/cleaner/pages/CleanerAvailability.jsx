import DashboardLayout from '../components/DashboardLayout';
import CleanerAvailabilityMain from '../components/CleanerAvailabilityMain';

const CleanerAvailability = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerAvailabilityMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerAvailability;