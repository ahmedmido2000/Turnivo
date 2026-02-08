import DashboardLayout from '../components/DashboardLayout';
import CleanerCleaningDetailsMain from '../components/CleanerCleaningDetailsMain';

const CleanerCleaningDetails = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerCleaningDetailsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerCleaningDetails;