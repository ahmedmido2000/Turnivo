import DashboardLayout from '../components/DashboardLayout';
import WorkAgreementMain from '../components/WorkAgreementMain';

const WorkAgreement = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <WorkAgreementMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default WorkAgreement;