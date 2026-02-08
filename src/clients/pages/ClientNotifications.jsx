import DashboardLayout from '../components/DashboardLayout';
import ClientNotificationsMain from '../components/ClientNotificationsMain';

const ClientNotifications = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <ClientNotificationsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default ClientNotifications;