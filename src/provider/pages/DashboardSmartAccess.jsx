import DashboardLayout from '../components/DashboardLayout';
import DashboardSmartAccessMain from '../components/DashboardSmartAccessMain';

const DashboardSmartAccess = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardSmartAccessMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardSmartAccess;