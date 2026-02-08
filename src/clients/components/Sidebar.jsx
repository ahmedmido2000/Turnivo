import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import { logout } from '../../store/authSlice';
import { useClientData } from '../context/ClientDataContext';

const Sidebar = ({ isMobileOpen = false, onMobileClose = () => {} }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('home');
  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [checkinDropdownOpen, setCheckinDropdownOpen] = useState(false);
  
  // Navigation hooks
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get user data from context
  const { userFullName, userAvatar, unreadNotificationsCount } = useClientData();

  // Function to determine active item based on current path
  const getActiveItemFromPath = (path) => {
    switch (path) {
      case '/client/dashboard': return 'home';
      case '/client/property-management':
      case '/client/property-details':
      case '/client/create-property': return 'property';
      case '/client/smart-checkin-checkout':
      case '/client/my-smart-lock-request': return 'checkin';
      case '/client/calendar': return 'calendar';
      case '/client/contact-us': return 'contact';
      case '/client/profile': return 'user-profile';
      case '/client/payment': return 'payment';
      case '/client/cleaning-request':
      case '/client/maintenance':
      case '/client/maintenance-orders':
      case '/client/additional-services':
      case '/client/orders':
      case '/client/service-details': return 'service';
      case '/client/property-problem':
      case '/client/property-problem-details': return 'reports';
      case '/client/guest-ratings':
      case '/client/my-ratings':
      case '/client/service-ratings': return 'ratings';
      default: return 'home';
    }
  };

  // Effect to update active item based on current route
  useEffect(() => {
    const active = getActiveItemFromPath(location.pathname);
    setActiveItem(active);

    // Open dropdown if navigating to a subitem page
    const subItemPaths = ['/client/cleaning-request', '/client/maintenance', '/client/additional-services', '/client/guest-ratings', '/client/my-ratings', '/client/service-ratings', '/client/my-smart-lock-request'];
    if (subItemPaths.includes(location.pathname)) {
      if (location.pathname.includes('guest') || location.pathname.includes('my-ratings') || location.pathname.includes('service-ratings')) {
        setRatingDropdownOpen(true);
      } else if (location.pathname.includes('my-smart-lock-request')) {
        setCheckinDropdownOpen(true);
      } else {
        setServiceDropdownOpen(true);
      }
    }
  }, [location.pathname]);

  
  const toggleServiceDropdown = () => {
    // Close rating dropdown if it's open
    if (ratingDropdownOpen) {
      setRatingDropdownOpen(false);
    }
    // Close checkin dropdown if it's open
    if (checkinDropdownOpen) {
      setCheckinDropdownOpen(false);
    }
    setServiceDropdownOpen(!serviceDropdownOpen);
    // Always make it active when toggling
    if (!serviceDropdownOpen) {
      setActiveItem('service');
      // Navigate to the service management main page when opening the dropdown
    }
  };

  
  const toggleRatingDropdown = () => {
    // Close service dropdown if it's open
    if (serviceDropdownOpen) {
      setServiceDropdownOpen(false);
    }
    // Close checkin dropdown if it's open
    if (checkinDropdownOpen) {
      setCheckinDropdownOpen(false);
    }
    setRatingDropdownOpen(!ratingDropdownOpen);
    // Always make it active when toggling
    if (!ratingDropdownOpen) {
      setActiveItem('ratings');
      // Navigate to the ratings main page when opening the dropdown
      navigate('/client/my-ratings');
    }
  };
  
  const toggleCheckinDropdown = () => {
    // Close rating dropdown if it's open
    if (ratingDropdownOpen) {
      setRatingDropdownOpen(false);
    }
    // Close service dropdown if it's open
    if (serviceDropdownOpen) {
      setServiceDropdownOpen(false);
    }
    setCheckinDropdownOpen(!checkinDropdownOpen);
    // Always make it active when toggling
    if (!checkinDropdownOpen) {
      setActiveItem('checkin');
      // Navigate to the checkin main page when opening the dropdown
      navigate('/client/smart-checkin-checkout');
    }
  };
  
  // Define routes for sidebar items
  const sidebarItems = [
    {
      id: 'home',
      label: 'Home',
      iconPath: "/assets/home-icon.svg",
      route: '/client/dashboard'
    },
    {
      id: 'property',
      label: 'Property management',
      iconPath: "/assets/property-icon.svg",
      route: '/client/property-management'
    },
    {
      id: 'service',
      label: 'Service Management',
      iconPath: "/assets/service-icon.svg",
      hasDropdown: true,
      dropdownOpen: serviceDropdownOpen,
      onToggle: toggleServiceDropdown,
      route: '/client/orders',
      subItems: [
        { id: 'cleaning-requests', label: 'Cleaning Requests', route: '/client/orders' },
        { id: 'maintenance-requests', label: 'Maintenance Requests', route: '/client/maintenance-orders' },

      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      iconPath: "/assets/report-icon.svg",
      route: '/client/property-problem'
    },
    {
      id: 'checkin',
      label: 'Smart checkin/checkout',
      iconPath: "/assets/key-icon.svg",
      hasDropdown: true,
      dropdownOpen: checkinDropdownOpen,
      onToggle: toggleCheckinDropdown,
      route: '/client/smart-checkin-checkout',
      subItems: [
        { id: 'my-smart-lock-request', label: 'my-smart-lock-request', route: '/client/my-smart-lock-request' }
      ]
    },
    {
      id: 'calendar',
      label: 'Calendar',
      iconPath: "/assets/calendar-icon.svg",
      route: '/client/calendar'
    },
      {
      id: 'payment',
      label: 'Payment and smart wallet',
      iconPath: "/assets/wallet-icon.svg",
      route: '/client/payment'
    },
    {
      id: 'ratings',
      label: 'Ratings & Feedback',
      iconPath: "/assets/medal-icon.svg",
      hasDropdown: true,
      dropdownOpen: ratingDropdownOpen,
      onToggle: toggleRatingDropdown,
      route: '/client/my-ratings',
      subItems: [
        { id: 'guest-reviews', label: 'Guest Reviews', route: '/client/guest-ratings' },
        { id: 'my-ratings', label: 'My Ratings', route: '/client/my-ratings' },
      ]
    },
   {
      id: 'contact',
      label: 'Contact us',
      iconPath: "/assets/contact-us.svg",
      route: '/client/contact-us'
    },
 
  ];

  const bottomItems = [
    {
      id: 'user-profile',
      label: userFullName,
      iconPath: userAvatar,
      isUserProfile: true,
      route: '/client/profile'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      iconPath: "/assets/notification.svg",
      route: '/client/notifications',
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
            } else if (item.id === 'checkin') {
              setCheckinDropdownOpen(true);
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
      setCheckinDropdownOpen(false);
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
    setCheckinDropdownOpen(false);
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