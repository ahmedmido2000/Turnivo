import { useState } from 'react';
import Sidebar from './Sidebar';
import { CleanerDataProvider } from '../context/CleanerDataContext';

const DashboardLayout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <CleanerDataProvider>
      <div className="dashboard-container">
        <Sidebar 
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={closeMobileSidebar}
        />
        <div className="dashboard-content">
          {/* Clone children and pass mobile menu toggle function */}
          {typeof children === 'function' 
            ? children({ onMobileMenuClick: toggleMobileSidebar })
            : children
          }
        </div>
      </div>
    </CleanerDataProvider>
  );
};

export default DashboardLayout;
