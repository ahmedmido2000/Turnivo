import DashboardLayout from '../components/DashboardLayout';
import DashboardMaterialDetailsMain from '../components/DashboardMaterialDetailsMain';

const DashboardMaterialDetails = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardMaterialDetailsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardMaterialDetails;
