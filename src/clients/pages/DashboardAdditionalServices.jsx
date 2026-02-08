import DashboardLayout from '../components/DashboardLayout';
import DashboardAdditionalServicesMain from '../components/DashboardAdditionalServicesMain';

const DashboardAdditionalServices = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardAdditionalServicesMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardAdditionalServices;