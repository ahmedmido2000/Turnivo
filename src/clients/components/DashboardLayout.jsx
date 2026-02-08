import { useState } from 'react';
import Sidebar from './Sidebar';
import { ClientDataProvider } from '../context/ClientDataContext';

const DashboardLayout = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <ClientDataProvider>
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
    </ClientDataProvider>
  );
};

export default DashboardLayout;
