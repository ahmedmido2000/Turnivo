import DashboardLayout from '../components/DashboardLayout';
import DashboardAddWorkEmpMain from '../components/DashboardAddWorkEmpMain';

const DashboardAddWorkEmp = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardAddWorkEmpMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardAddWorkEmp;