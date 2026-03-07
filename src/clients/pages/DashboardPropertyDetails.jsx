import DashboardLayout from '../components/DashboardLayout';
import DashboardPropertyDetailsMain from '../components/DashboardPropertyDetailsMain';

const DashboardPropertyDetails = ({ isToken = false }) => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardPropertyDetailsMain 
          onMobileMenuClick={onMobileMenuClick} 
          isToken={isToken}
        />
      )}
    </DashboardLayout>
  );
};

export default DashboardPropertyDetails;