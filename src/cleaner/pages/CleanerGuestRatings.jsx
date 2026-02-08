import DashboardLayout from '../components/DashboardLayout';
import CleanerGuestRatingsMain from '../components/CleanerGuestRatingsMain';

const CleanerGuestRatings = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerGuestRatingsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerGuestRatings;