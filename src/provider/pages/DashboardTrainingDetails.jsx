import DashboardLayout from '../components/DashboardLayout';
import DashboardTrainingDetailsMain from '../components/DashboardTrainingDetailsMain';

const DashboardTrainingDetails = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardTrainingDetailsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardTrainingDetails;