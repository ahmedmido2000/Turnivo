import DashboardLayout from '../components/DashboardLayout';
import CleanerMaintenanceRequestMain from '../components/CleanerMaintenanceRequestMain';

const CleanerMaintenanceRequest = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerMaintenanceRequestMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerMaintenanceRequest;