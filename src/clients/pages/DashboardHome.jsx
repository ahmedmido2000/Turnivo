import DashboardLayout from '../components/DashboardLayout';
import DashboardMain from '../components/DashboardMain';

const DashboardHome = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardHome;