import DashboardLayout from '../components/DashboardLayout';
import DashboardServicesMaintenanceMain from '../components/DashboardServicesMaintenanceMain';

const DashboardServicesMaintenance = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardServicesMaintenanceMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardServicesMaintenance;