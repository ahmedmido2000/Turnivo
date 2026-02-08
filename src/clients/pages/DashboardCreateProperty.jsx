import DashboardLayout from '../components/DashboardLayout';
import DashboardCreatePropertyMain from '../components/DashboardCreatePropertyMain';

const DashboardCreateProperty = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardCreatePropertyMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardCreateProperty;