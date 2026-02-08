import DashboardLayout from '../components/DashboardLayout';
import CleanerTrainingDetailsMain from '../components/CleanerTrainingDetailsMain';

const CleanerTrainingDetails = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerTrainingDetailsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerTrainingDetails;