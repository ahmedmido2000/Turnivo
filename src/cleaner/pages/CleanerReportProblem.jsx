import DashboardLayout from '../components/DashboardLayout';
import CleanerReportProblemMain from '../components/CleanerReportProblemMain';

const CleanerReportProblem = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerReportProblemMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerReportProblem;