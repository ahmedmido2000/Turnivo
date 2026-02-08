import DashboardLayout from '../components/DashboardLayout';
import CleanerCompanyPoliciesMain from '../components/CleanerCompanyPoliciesMain';

const CleanerCompanyPolicies = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerCompanyPoliciesMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerCompanyPolicies;