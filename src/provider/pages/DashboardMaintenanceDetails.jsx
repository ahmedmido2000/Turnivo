import DashboardLayout from '../components/DashboardLayout';
import DashboardMaintenanceDetailsMain from '../components/DashboardMaintenanceDetailsMain';

const DashboardMaintenanceDetails = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardMaintenanceDetailsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardMaintenanceDetails;