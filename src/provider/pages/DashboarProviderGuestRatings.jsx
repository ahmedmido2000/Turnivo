import DashboardLayout from '../components/DashboardLayout';
import DashboarProviderGuestRatingsMain from '../components/DashboarProviderGuestRatingsMain';

const DashboarProviderGuestRatings = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboarProviderGuestRatingsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboarProviderGuestRatings;