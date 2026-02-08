import DashboardLayout from '../components/DashboardLayout';
import DashboardPaymentMain from '../components/DashboardPaymentMain';

const DashboardPayment = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardPaymentMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardPayment;
