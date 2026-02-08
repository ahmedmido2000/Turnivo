import DashboardLayout from '../components/DashboardLayout';
import DashboardClientProfileMain from '../components/DashboardClientProfileMain';

const DashboardClientProfile = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardClientProfileMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardClientProfile;