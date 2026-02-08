import DashboardLayout from '../components/DashboardLayout';
import DashboardProviderMain from '../components/DashboardProviderMain';

const DashboardProviderHome = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardProviderMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardProviderHome;