import DashboardLayout from '../components/DashboardLayout';
import CleanerMaterialRequestMain from '../components/CleanerMaterialRequestMain';

const CleanerMaterialRequest = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerMaterialRequestMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerMaterialRequest;