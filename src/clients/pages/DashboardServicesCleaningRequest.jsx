import DashboardLayout from '../components/DashboardLayout';
import DashboardServicesCleaningRequestMain from '../components/DashboardServicesCleaningRequestMain';

const DashboardServicesCleaningRequest = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardServicesCleaningRequestMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardServicesCleaningRequest;