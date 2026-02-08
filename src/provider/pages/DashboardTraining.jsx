import DashboardLayout from '../components/DashboardLayout';
import DashboardTrainingMain from '../components/DashboardTrainingMain';

const DashboardTraining = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardTrainingMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardTraining;