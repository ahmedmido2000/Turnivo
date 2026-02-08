import DashboardLayout from '../components/DashboardLayout';
import DashboardPropertyDetailsMain from '../components/DashboardPropertyDetailsMain';

const DashboardPropertyDetails = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardPropertyDetailsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardPropertyDetails;