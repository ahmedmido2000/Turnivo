import DashboardLayout from '../components/DashboardLayout';
import DashboardPropertyProblemDetailsMain from '../components/DashboardPropertyProblemDetailsMain';

const DashboardPropertyProblemDetails = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <DashboardPropertyProblemDetailsMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default DashboardPropertyProblemDetails;
