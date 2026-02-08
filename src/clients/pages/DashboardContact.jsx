import DashboardLayout from '../components/DashboardLayout';
import DashboardContactMain from '../components/DashboardContactMain';

const DashboardContact = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardContactMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardContact;