import DashboardLayout from '../components/DashboardLayout';
import CleanerWorkAgreementMain from '../components/CleanerWorkAgreementMain';

const CleanerWorkAgreement = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerWorkAgreementMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerWorkAgreement;