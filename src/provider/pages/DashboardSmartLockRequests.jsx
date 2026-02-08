import DashboardLayout from '../components/DashboardLayout';
import DashboardSmartLockRequestsMain from '../components/DashboardSmartLockRequestsMain';

const DashboardSmartLockRequests = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardSmartLockRequestsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardSmartLockRequests;