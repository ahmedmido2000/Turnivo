import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import { logout } from '../../store/authSlice';
import { useCleanerData } from '../context/CleanerDataContext';

const Sidebar = ({ isMobileOpen = false, onMobileClose = () => {} }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [legalDropdownOpen, setLegalDropdownOpen] = useState(false);
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
  const [smartAccessDropdownOpen, setSmartAccessDropdownOpen] = useState(false);
  
  // Navigation hooks
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get user data from context
  const { userFullName, userAvatar, unreadNotificationsCount } = useCleanerData();

  // Function to determine active item based on current path
  const getActiveItemFromPath = (path) => {
    switch (path) {
      case '/cleaner/cleaning-requests':
      case '/cleaner/cleaning-details':
      case '/cleaner/maintenance-requests':
      case '/cleaner/maintenance-details':
      case '/cleaner/material-requests':
      case '/cleaner/material-details': return 'service';
      case '/cleaner/calendar':
      case '/cleaner/availability': return 'calendar';
      case '/cleaner/guest-ratings': return 'ratings';
      case '/cleaner/training':
      case '/cleaner/training-details': return 'training';
      case '/cleaner/company-policies':
      case '/cleaner/work-agreement': return 'legal';
      case '/cleaner/report-problem':
      case '/cleaner/my-problems':
      case '/cleaner/problem-details': return 'report';
      case '/cleaner/smart-lock-requests':
      case '/cleaner/smart-lock-checkin-checkout': return 'smart-access';
      case '/cleaner/shopping-cart': return 'cart';
      default: return 'service';
    }
  };

  // Effect to update active item based on current route
  useEffect(() => {
    const active = getActiveItemFromPath(location.pathname);
    setActiveItem(active);

    // Open dropdown if navigating to a subitem page
    if (location.pathname.includes('maintenance') || 
        location.pathname.includes('material') || 
        location.pathname.includes('cleaning')) {
      setServiceDropdownOpen(true);
    } else if (location.pathname.includes('guest') || location.pathname.includes('my-ratings')) {
      setRatingDropdownOpen(true);
    } else if (location.pathname.includes('company-policies') || location.pathname.includes('work-agreement')) {
      setLegalDropdownOpen(true);
    } else if (location.pathname.includes('report-problem') || location.pathname.includes('my-problems') || location.pathname.includes('problem-details')) {
      setReportDropdownOpen(true);
    } else if (location.pathname.includes('smart-lock')) {
      setSmartAccessDropdownOpen(true);
    }
  }, [location.pathname]);

  const toggleServiceDropdown = () => {
    // Close other dropdowns
    if (ratingDropdownOpen) {
      setRatingDropdownOpen(false);
    }
    if (legalDropdownOpen) {
      setLegalDropdownOpen(false);
    }
    setServiceDropdownOpen(!serviceDropdownOpen);
    // Always make it active when toggling
    if (!serviceDropdownOpen) {
      setActiveItem('service');
      // Navigate to the service management main page when opening the dropdown

    }
  };

  const toggleRatingDropdown = () => {
    // Close other dropdowns
    if (serviceDropdownOpen) {
      setServiceDropdownOpen(false);
    }
    if (legalDropdownOpen) {
      setLegalDropdownOpen(false);
    }
    setRatingDropdownOpen(!ratingDropdownOpen);
    // Always make it active when toggling
    if (!ratingDropdownOpen) {
      setActiveItem('ratings');
      // Navigate to the ratings main page when opening the dropdown
      navigate('/cleaner/guest-ratings');
    }
  };
  
  const toggleLegalDropdown = () => {
    // Close other dropdowns
    if (serviceDropdownOpen) {
      setServiceDropdownOpen(false);
    }
    if (ratingDropdownOpen) {
      setRatingDropdownOpen(false);
    }
    if (reportDropdownOpen) {
      setReportDropdownOpen(false);
    }
    setLegalDropdownOpen(!legalDropdownOpen);
    // Always make it active when toggling
    if (!legalDropdownOpen) {
      setActiveItem('legal');
      // Navigate to the legal main page when opening the dropdown
      navigate('/cleaner/company-policies');
    }
  };

  const toggleReportDropdown = () => {
    // Close other dropdowns
    if (serviceDropdownOpen) {
      setServiceDropdownOpen(false);
    }
    if (ratingDropdownOpen) {
      setRatingDropdownOpen(false);
    }
    if (legalDropdownOpen) {
      setLegalDropdownOpen(false);
    }
    if (smartAccessDropdownOpen) {
      setSmartAccessDropdownOpen(false);
    }
    setReportDropdownOpen(!reportDropdownOpen);
    // Always make it active when toggling
    if (!reportDropdownOpen) {
      setActiveItem('report');
      // Navigate to the report main page when opening the dropdown

    }
  };

  const toggleSmartAccessDropdown = () => {
    // Close other dropdowns
    if (serviceDropdownOpen) {
      setServiceDropdownOpen(false);
    }
    if (ratingDropdownOpen) {
      setRatingDropdownOpen(false);
    }
    if (legalDropdownOpen) {
      setLegalDropdownOpen(false);
    }
    if (reportDropdownOpen) {
      setReportDropdownOpen(false);
    }
    setSmartAccessDropdownOpen(!smartAccessDropdownOpen);
    // Always make it active when toggling
    if (!smartAccessDropdownOpen) {
      setActiveItem('smart-access');
      // Navigate to the smart access main page when opening the dropdown
      navigate('/cleaner/smart-lock-requests');
    }
  };
  
  // Define routes for sidebar items - Cleaner specific routes
  const sidebarItems = [
    {
      id: 'service',
      label: 'Service Management',
      iconPath: "/assets/service-icon.svg",
      hasDropdown: true,
      dropdownOpen: serviceDropdownOpen,
      onToggle: toggleServiceDropdown,
      route: '/cleaner/cleaning-requests',
      subItems: [
        { id: 'cleaning-requests', label: 'Cleaning Requests', route: '/cleaner/cleaning-requests' },
        { id: 'maintenance-requests', label: 'Maintenance Requests', route: '/cleaner/maintenance-requests' },
        { id: 'material-requests', label: 'Materials Requests', route: '/cleaner/material-requests' }
      ]
    },
    {
      id: 'calendar',
      label: 'Calendar & Availability',
      iconPath: "/assets/calendar-icon.svg",
      route: '/cleaner/calendar'
    },
     {
      id: 'smart-access',
      label: 'Smart Access',
      iconPath: "/assets/key-icon.svg",
      hasDropdown: true,
      dropdownOpen: smartAccessDropdownOpen,
      onToggle: toggleSmartAccessDropdown,
      route: '/cleaner/smart-lock-requests',
      subItems: [
        { id: 'smart-lock-requests', label: 'Smart Lock Requests', route: '/cleaner/smart-lock-requests' },
        { id: 'smart-lock-checkin-checkout', label: 'Checkin-Checkout', route: '/cleaner/smart-lock-checkin-checkout' }
      ]
    },
  
    {
      id: 'training',
      label: 'Training',
      iconPath: "/assets/cup-icon.svg",
      route: '/cleaner/training'
    },
    {
      id: 'cart',
      label: 'Shopping Cart',
      iconPath: "/assets/service-icon.svg",
      route: '/cleaner/shopping-cart'
    },
    {
      id: 'legal',
      label: 'Legal & Contracts',
      iconPath: "/assets/legal-icon.svg",
      hasDropdown: true,
      dropdownOpen: legalDropdownOpen,
      onToggle: toggleLegalDropdown,
      route: '/cleaner/company-policies',
      subItems: [
        { id: 'work-agreement', label: 'Work Agreement', route: '/cleaner/work-agreement' },
        { id: 'company-policies', label: 'Company Policies', route: '/cleaner/company-policies' }
      ]
    },
    {
      id: 'report',
      label: 'Report a problem',
      iconPath: "/assets/report-icon.svg",
      hasDropdown: true,
      dropdownOpen: reportDropdownOpen,
      onToggle: toggleReportDropdown,

      subItems: [
        { id: 'my-problems', label: 'My Problems', route: '/cleaner/my-problems' }
      ]
    },
   
  ];

  const bottomItems = [
    {
      id: 'user-profile',
      label: userFullName,
      iconPath: userAvatar,
      isUserProfile: true,
      route: '/cleaner/availability'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      iconPath: "/assets/notification.svg",
      route: '/cleaner/notifications',
      badge: unreadNotificationsCount
    },
    {
      id: 'logout',
      label: 'Logout',
      iconPath: "/assets/logout-icon.svg",
      isLogout: true
    },
    {
      id: 'back',
      label: 'Back to main',
      iconPath: "/assets/undo-icon.svg",
      route: '/'
    }
  ];

  // Set active item based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check if any subitem matches the current path
    let foundActiveItem = null;
    
    // Check main items and subitems
    [...sidebarItems, ...bottomItems].forEach(item => {
      if (item.route === currentPath) {
        foundActiveItem = item.id;
      }
      
      // Check subitems
      if (item.subItems) {
        item.subItems.forEach(subItem => {
          if (subItem.route === currentPath) {
            foundActiveItem = item.id;
            // Open the corresponding dropdown
            if (item.id === 'service') {
              setServiceDropdownOpen(true);
            } else if (item.id === 'ratings') {
              setRatingDropdownOpen(true);
            } else if (item.id === 'legal') {
              setLegalDropdownOpen(true);
            }
          }
        });
      }
    });
    
    if (foundActiveItem) {
      setActiveItem(foundActiveItem);
    }
  }, [location.pathname]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    // Close all dropdowns when collapsing
    if (!isCollapsed) {
      setRatingDropdownOpen(false);
      setServiceDropdownOpen(false);
      setLegalDropdownOpen(false);
    }
  };

  const handleItemClick = (item) => {
    // Handle logout
    if (item.isLogout) {
      dispatch(logout());
      navigate('/login');
      return;
    }
    
    // Close all dropdowns when clicking on a non-dropdown item
    setRatingDropdownOpen(false);
    setServiceDropdownOpen(false);
    setLegalDropdownOpen(false);
    setActiveItem(item.id);
    
    // Navigate to the item's route
    if (item.route) {
      navigate(item.route);
      // Close mobile menu if open
      if (isMobileOpen) {
        onMobileClose();
      }
    }
  };

  const handleSubItemClick = (subItem, parentItemId) => {
    // Set the parent item as active when clicking a subitem
    setActiveItem(parentItemId);
    
    // Navigate to the subitem's route
    if (subItem.route) {
      navigate(subItem.route);
      // Close mobile menu if open
      if (isMobileOpen) {
        onMobileClose();
      }
    }
  };

  // Helper function to get the correct icon based on active state
  const getIcon = (iconPath, isActive, isDropdownOpen = false, isFixedItem = false) => {
    // Fixed bottom items should not change icon on active state
    if (isFixedItem) {
      return iconPath;
    }
    // Item is active if it's the selected item OR if its dropdown is open
    const shouldBeActive = isActive || isDropdownOpen;
    if (shouldBeActive) {
      // Replace .svg with -active.svg
      return iconPath.replace('.svg', '-active.svg');
    }
    return iconPath;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onMobileClose}
        />
      )}
      
      <div className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Header with logo, title and menu icon */}
        <div className="sidebar-header">
          <button
            onClick={handleToggleCollapse}
            className="menu-toggle-btn"
          >
            <FormatListBulletedOutlinedIcon className='' />
          </button>
          <div className="logo-container">
            <img 
              src="/assets/logo.png" 
              alt="Logo" 
              height="40" 
            />
            <span className="sidebar-title">ONS</span>
          </div>
        </div>

        {/* Main content area with scroll */}
        <div className="sidebar-content">
          {/* Main navigation items */}
          {sidebarItems.map((item) => {
            // Check if item should be active (either selected or dropdown open)
            const isItemActive = activeItem === item.id || (item.hasDropdown && item.dropdownOpen);
            
            return (
              <div key={item.id}>
                <div
                  className={`side-item ${isItemActive ? 'active' : ''}`}
                  onClick={item.hasDropdown ? item.onToggle : () => handleItemClick(item)}
                >
                  <span className="side-icon">
                    <img 
                      src={getIcon(item.iconPath, activeItem === item.id, item.dropdownOpen, false)} 
                      alt={item.label}
                    />
                  </span>
                  <span className="side-label">{item.label}</span>
                  {item.hasDropdown && (
                    <span className={`dropdown-arrow ${item.dropdownOpen ? 'open' : ''}`}>
                      {item.dropdownOpen ? <ExpandLess /> : <ExpandMore />}
                    </span>
                  )}
                </div>
                
                {/* Dropdown subitems - only show when not collapsed */}
                {item.hasDropdown && item.dropdownOpen && !isCollapsed && (
                  <div className="dropdown-container">
                    {item.subItems.map((subItem) => (
                      <div
                        key={subItem.id}
                        className="subitem"
                        onClick={() => handleSubItemClick(subItem, item.id)}
                      >
                        {subItem.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom fixed items */}
        <div className="sidebar-bottom">
          {bottomItems.map((item) => (
            <div
              key={item.id}
              className={`side-item ${activeItem === item.id ? 'active' : ''} ${item.isUserProfile ? 'user-profile-item' : ''}`}
              onClick={() => handleItemClick(item)}
            >
              <span className="side-icon">
                {item.isUserProfile ? (
                  <img 
                    src={item.iconPath} 
                    alt={item.label}
                    className="user-avatar"
                  />
                ) : (
                  <img 
                    src={getIcon(item.iconPath, activeItem === item.id, false, true)} 
                    alt={item.label}
                  />
                )}
                {item.badge > 0 && (
                  <span className="notification-badge">{item.badge > 99 ? '99+' : item.badge}</span>
                )}
              </span>
              <span className="side-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;