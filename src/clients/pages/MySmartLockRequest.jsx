import DashboardLayout from '../components/DashboardLayout';
import DashboardMySmartLockRequestMain from '../components/DashboardMySmartLockRequestMain';

const MySmartLockRequest = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardMySmartLockRequestMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default MySmartLockRequest;
