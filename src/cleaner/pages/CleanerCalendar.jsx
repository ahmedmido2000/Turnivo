import DashboardLayout from '../components/DashboardLayout';
import CleanerCalendarMain from '../components/CleanerCalendarMain';

const CleanerCalendar = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerCalendarMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerCalendar;