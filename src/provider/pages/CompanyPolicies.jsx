import DashboardLayout from '../components/DashboardLayout';
import CompanyPoliciesMain from '../components/CompanyPoliciesMain';

const CompanyPolicies = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CompanyPoliciesMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CompanyPolicies;