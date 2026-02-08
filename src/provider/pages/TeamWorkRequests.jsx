import DashboardLayout from '../components/DashboardLayout';
import TeamWorkRequestsMain from '../components/TeamWorkRequestsMain';

const TeamWorkRequests = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <TeamWorkRequestsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default TeamWorkRequests;