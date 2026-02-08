import DashboardLayout from '../components/DashboardLayout';
import CleanerShoppingCartMain from '../components/CleanerShoppingCartMain';

const CleanerShoppingCart = () => {
  return (
    <DashboardLayout>
      {({ onMobileMenuClick }) => (
        <CleanerShoppingCartMain onMobileMenuClick={onMobileMenuClick} />
      )}
    </DashboardLayout>
  );
};

export default CleanerShoppingCart;