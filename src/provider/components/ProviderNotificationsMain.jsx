import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars } from '@fortawesome/free-solid-svg-icons';
import { Person, Settings, Logout } from '@mui/icons-material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { Link } from 'react-router-dom';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import { getNotifications, getNotificationBadge } from '../../api/notificationApi';
import { useSelector } from 'react-redux';
import ProviderHeader from './ProviderHeader';

const ProviderNotificationsMain = ({ onMobileMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { token: accessToken } = useSelector((state) => state.auth);
  
  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('all');
  
  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!accessToken) return;
      try {
        setLoading(true);
        const response = await getNotifications(accessToken, currentPage);
        console.log('Notifications Response:', response);
        
        if (response.status === 1 && response.data && response.data[0]) {
          const notificationData = response.data[0];
          setNotifications(notificationData.items || []);
          
          // Update badge count from meta data
          if (notificationData._meta) {
            setBadgeCount(notificationData._meta.totalCount || 0);
          }
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [accessToken, currentPage]);

  // Fetch notification badge count
  useEffect(() => {
    const fetchBadgeCount = async () => {
      if (!accessToken) return;
      try {
        const response = await getNotificationBadge(accessToken);
        console.log('Badge Response:', response);
        
        if (response.status === 1 && response.data) {
          setBadgeCount(response.data.count || response.data.badge || 0);
        }
      } catch (error) {
        console.error('Failed to fetch badge count:', error);
      }
    };
    fetchBadgeCount();
  }, [accessToken]);

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    if (filterType === 'new') return notif.status === 0;
    if (filterType === 'read') return notif.status === 1;
    return true;
  });

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
    console.log(`Clicked on ${item}`);
    setIsDropdownOpen(false);
    // Add your navigation logic here
  };



  return (
    <section>
      <ProviderHeader title="Notifications" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <div className='dashboard-title m-0'> Notifications ({badgeCount})</div>
                             <div className="position-relative">
                    <select
                      id="propertyType"
                      className="form-select custom-select-bs unread-bg border-0 py-2"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      required
                    >
                      <option value="all">All</option>
                      <option value="new">New</option>
                      <option value="read">Read</option>
                    </select>

                    {/* Bootstrap Icon */}
                    <i className="bi bi-chevron-down select-bs-icon"></i>
                  </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="notifications-container row g-0 g-lg-2 mt-2">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`col-12 mt-2 notification-item ${notification.status === 0 ? 'unread-bg' : ''} d-flex justify-content-between align-items-center gap-3`}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className={notification.status === 0 ? "unread-dot" : "read-dot"}></div>
                    <img 
                      src={notification.msgFrom?.avatar || "/assets/user.png"} 
                      alt="user" 
                      className="notification-user-img" 
                      onError={(e) => { e.target.src = "/assets/user.png"; }}
                    />
                    <p className='notification-desc m-0'>
                      {notification.msgFrom?.name && (
                        <span className='fw-bold'>{notification.msgFrom.name} </span>
                      )}
                      {notification.msg_nl || notification.msg}
                    </p>
                  </div>
                  <p className='notification-time text-nowrap m-0'>
                    {formatTimeAgo(notification.created_at)}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p className="text-muted">No notifications found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProviderNotificationsMain;