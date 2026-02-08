import DashboardLayout from '../components/DashboardLayout';
import DashboardProperyProblemMain from '../components/DashboardProperyProblemMain';

const DashboardProperyProblem = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardProperyProblemMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardProperyProblem;