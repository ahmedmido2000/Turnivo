import DashboardLayout from '../components/DashboardLayout';
import DashboardCalendarMain from '../components/DashboardCalendarMain';

const DashboardCalendar = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardCalendarMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardCalendar;