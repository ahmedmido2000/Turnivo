import DashboardLayout from '../components/DashboardLayout';
import DashboardAvailabilityMain from '../components/DashboardAvailabilityMain';

const DashboardAvailability = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardAvailabilityMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardAvailability;