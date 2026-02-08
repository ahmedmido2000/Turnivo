import DashboardLayout from '../components/DashboardLayout';
import DashboarGuestRatingsMain from '../components/DashboarGuestRatingsMain';

const DashboarGuestRatings = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboarGuestRatingsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboarGuestRatings;