import DashboardLayout from '../components/DashboardLayout';
import CleanerMaintenanceDetailsMain from '../components/CleanerMaintenanceDetailsMain';

const CleanerMaintenanceDetails = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerMaintenanceDetailsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerMaintenanceDetails;