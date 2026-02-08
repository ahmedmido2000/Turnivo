import DashboardLayout from '../components/DashboardLayout';
import DashboardTeamWorkMain from '../components/DashboardTeamWorkMain';

const DashboardTeamWork = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardTeamWorkMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardTeamWork;