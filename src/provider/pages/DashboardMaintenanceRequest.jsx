import DashboardLayout from '../components/DashboardLayout';
import DashboardMaintenanceRequestMain from '../components/DashboardMaintenanceRequestMain';

const DashboardMaintenanceRequest = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardMaintenanceRequestMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardMaintenanceRequest;