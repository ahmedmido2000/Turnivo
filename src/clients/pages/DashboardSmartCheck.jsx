import DashboardLayout from '../components/DashboardLayout';
import DashboardSmartCheckMain from '../components/DashboardSmartCheckMain';

const DashboardSmartCheck = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardSmartCheckMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardSmartCheck;