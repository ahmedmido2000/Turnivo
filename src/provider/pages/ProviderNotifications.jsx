import DashboardLayout from '../components/DashboardLayout';
import ProviderNotificationsMain from '../components/ProviderNotificationsMain';

const ProviderNotifications = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <ProviderNotificationsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default ProviderNotifications;