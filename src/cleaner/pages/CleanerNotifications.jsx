import DashboardLayout from '../components/DashboardLayout';
import CleanerNotificationsMain from '../components/CleanerNotificationsMain';

const CleanerNotifications = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerNotificationsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerNotifications;