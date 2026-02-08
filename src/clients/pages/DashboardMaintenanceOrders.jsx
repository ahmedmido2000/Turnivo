import DashboardLayout from '../components/DashboardLayout';
import DashboardMaintenanceOrdersMain from '../components/DashboardMaintenanceOrdersMain';

const DashboardMaintenanceOrders = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardMaintenanceOrdersMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardMaintenanceOrders;