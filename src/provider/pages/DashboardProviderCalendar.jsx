import DashboardLayout from '../components/DashboardLayout';
import DashboardProviderCalendarMain from '../components/DashboardProviderCalendarMain';

const DashboardProviderCalendar = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardProviderCalendarMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardProviderCalendar;