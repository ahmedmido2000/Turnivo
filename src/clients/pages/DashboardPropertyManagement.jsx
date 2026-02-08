import DashboardLayout from '../components/DashboardLayout';
import DashboardPropertyManagementMain from '../components/DashboardPropertyManagementMain';

const DashboardPropertyManagement = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardPropertyManagementMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardPropertyManagement;