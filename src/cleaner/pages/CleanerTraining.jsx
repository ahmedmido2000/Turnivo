import DashboardLayout from '../components/DashboardLayout';
import CleanerTrainingMain from '../components/CleanerTrainingMain';

const CleanerTraining = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerTrainingMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerTraining;