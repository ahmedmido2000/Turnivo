import DashboardLayout from '../components/DashboardLayout';
import DashboardCleaningDetailsMain from '../components/DashboardCleaningDetailsMain';

const DashboardCleaningDetails = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardCleaningDetailsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardCleaningDetails;