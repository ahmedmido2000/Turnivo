import DashboardLayout from '../components/DashboardLayout';
import CleanerMaterialDetailsMain from '../components/CleanerMaterialDetailsMain';

const CleanerMaterialDetails = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerMaterialDetailsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerMaterialDetails;
