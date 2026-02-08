import DashboardLayout from '../components/DashboardLayout';
import DashboardServiceDetailsMain from '../components/DashboardServiceDetailsMain';

const DashboardServiceDetails = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardServiceDetailsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardServiceDetails;