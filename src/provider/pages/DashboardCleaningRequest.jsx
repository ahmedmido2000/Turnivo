import DashboardLayout from '../components/DashboardLayout';
import DashboardCleaningRequestMain from '../components/DashboardCleaningRequestMain';

const DashboardCleaningRequest = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardCleaningRequestMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardCleaningRequest;