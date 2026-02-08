import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useClientData } from '../context/ClientDataContext';

const ClientHeader = ({ title, onMobileMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get user data from context
  const { 
    userFullName, 
    userAvatar, 
    unreadNotificationsCount 
  } = useClientData();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownItemClick = (item) => {
    setIsDropdownOpen(false);
    if (item === 'logout') {
      dispatch(logout());
      navigate('/login');
    } else if (item === 'profile') {
      navigate('/client/profile');
    }
  };

  return (
    <div className="dashboard-main-nav px-md-3 px-1 py-1">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-0">
          <button 
            className="mobile-menu-btn"
            onClick={onMobileMenuClick}
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h2 className="mb-0 dashboard-title">{title}</h2>
        </div>
        <div className="d-flex justify-content-end gap-2 align-items-center">
          <div className="dashboard-lang-btn d-flex gap-1 align-items-center">
            <img src="/assets/global.svg" alt="language" />
            <span>English</span>
          </div>
          <Link to='/client/notifications' className="notification-icon-container">
            <img src="/assets/notification.svg" alt="notification" />
            {unreadNotificationsCount > 0 && (
              <span className="notification-badge">{unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}</span>
            )}
          </Link>
          
          {/* User Profile Dropdown */}
          <div className="user-dropdown-container d-none d-md-block" ref={dropdownRef}>
            <div 
              className="user-profile-trigger d-flex gap-2 align-items-center"
              onClick={toggleDropdown}
            >
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`dropdown-chevron ${isDropdownOpen ? 'open' : ''}`}
              />
              <span className="user-name">{userFullName}</span>
              <img 
                src={userAvatar} 
                alt="User Profile" 
                className="user-avatar-small"
              />
            </div>
            
            {isDropdownOpen && (
              <div className="user-dropdown-menu">
                <div 
                  className="dropdown-item d-flex gap-2 align-items-center"
                  onClick={() => handleDropdownItemClick('profile')}
                >
                  <img src="/assets/user-square.svg" alt="profile" />
                  <span>Profile</span>
                </div>
                <div 
                  className="dropdown-item d-flex gap-2 align-items-center"
                  onClick={() => handleDropdownItemClick('settings')}
                >
                  <img src="/assets/setting-icon.svg" alt="settings" />
                  <span>Settings</span>
                </div>
                <div 
                  className="dropdown-item d-flex gap-2 align-items-center"
                  onClick={() => handleDropdownItemClick('logout')}
                >
                  <img src="/assets/logout-icon.svg" alt="logout" />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
