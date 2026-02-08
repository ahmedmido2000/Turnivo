import DashboardLayout from '../components/DashboardLayout';
import CleanerCleaningRequestMain from '../components/CleanerCleaningRequestMain';

const CleanerCleaningRequest = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerCleaningRequestMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerCleaningRequest;