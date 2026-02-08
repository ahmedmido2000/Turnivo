import DashboardLayout from '../components/DashboardLayout';
import DashboardMyRatingsMain from '../components/DashboardMyRatingsMain';

const DashboardServiceRatings = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardMyRatingsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardServiceRatings;
