import React, { useState, useEffect } from 'react';
import { getNotifications } from '../../api/notificationApi';
import Swal from 'sweetalert2';
import ClientHeader from './ClientHeader';

const ClientNotificationsMain = ({ onMobileMenuClick }) => {
  // API state
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('No access token found. Please login again.');
      }

      const response = await getNotifications(accessToken, currentPage);

      if (response && response.status === 1 && response.data && response.data[0]) {
        const { items, _meta } = response.data[0];
        setNotifications(items || []);
        setTotalCount(_meta?.totalCount || 0);
      } else {
        setNotifications([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to fetch notifications');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to fetch notifications. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [currentPage]);

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return dateString;
  };

  return (
    <section>
      <ClientHeader title="Notifications" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
          <div className='dashboard-title m-0'> Notifications ({totalCount})</div>
          <div className="position-relative">
            <select
              id="propertyType"
              className="form-select custom-select-bs unread-bg border-0 py-2"
              defaultValue=""
              required
            >
              <option value="New">New</option>
            </select>

            {/* Bootstrap Icon */}
            <i className="bi bi-chevron-down select-bs-icon"></i>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center mt-4 mb-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-center mt-4 mb-4">
            <p className="text-danger">{error}</p>
          </div>
        )}

        {/* Notifications list */}
        {!loading && !error && (
          <div className="notifications-container row g-0 g-lg-2 mt-2">
            {notifications.length === 0 ? (
              <div className="text-center mt-4 mb-4">
                <p className="text-muted">No notifications found.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`col-12 mt-2 notification-item ${notification.status === 0 ? 'unread-bg' : ''} d-flex justify-content-between align-items-center gap-3`}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className={notification.status === 0 ? 'unread-dot' : 'read-dot'}></div>
                    <img
                      src={notification.msgFrom?.avatar || '/assets/user.png'}
                      alt="user"
                      className="notification-user-img"
                      onError={(e) => {
                        e.target.src = '/assets/user.png';
                      }}
                    />
                    <p className='notification-desc m-0'>
                      <span className='fw-bold'>{notification.msgFrom?.name || 'User'}</span> {notification.msg}
                    </p>
                  </div>
                  <p className='notification-time text-nowrap m-0'>{getTimeAgo(notification.created_at)}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientNotificationsMain;