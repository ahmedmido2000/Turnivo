import DashboardLayout from '../components/DashboardLayout';
import DashboardOrdersMain from '../components/DashboardOrdersMain';

const DashboardOrders = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardOrdersMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardOrders;