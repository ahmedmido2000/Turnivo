import DashboardLayout from '../components/DashboardLayout';
import DashboardMyRatingsListMain from '../components/DashboardMyRatingsListMain';

const DashboardMyRatings = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardMyRatingsListMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardMyRatings;