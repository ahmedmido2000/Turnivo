import DashboardLayout from '../components/DashboardLayout';
import DashboardMaterialRequestMain from '../components/DashboardMaterialRequestMain';

const DashboardMaterialRequest = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardMaterialRequestMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardMaterialRequest;