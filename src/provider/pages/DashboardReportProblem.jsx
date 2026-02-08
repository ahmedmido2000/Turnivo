import DashboardLayout from '../components/DashboardLayout';
import DashboardReportProblemMain from '../components/DashboardReportProblemMain';

const DashboardReportProblem = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardReportProblemMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardReportProblem;