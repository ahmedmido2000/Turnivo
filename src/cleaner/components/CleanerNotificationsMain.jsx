import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getCleanerNotifications, getCleanerNotificationBadge } from '../../api/cleanerNotificationApi';
import { selectAccessToken } from '../../store/authSlice';
import CleanerHeader from './CleanerHeader';
const CleanerNotificationsMain = ({ onMobileMenuClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useSelector(selectAccessToken);
  



  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        if (!accessToken) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please login to continue',
          });
          return;
        }

        const [notifRes, badgeRes] = await Promise.all([
          getCleanerNotifications(accessToken),
          getCleanerNotificationBadge(accessToken),
        ]);

        if (notifRes.status === 1 && notifRes.data?.[0]?.items) {
          setNotifications(notifRes.data[0].items);
        } else {
          setNotifications([]);
        }

        if (badgeRes.status === 1 && typeof badgeRes.data !== 'undefined') {
          const num = Number(badgeRes.data) || 0;
          setBadgeCount(num);
        } else {
          setBadgeCount(0);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load notifications',
        });
        setNotifications([]);
        setBadgeCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);



  return (
    <section>
      <CleanerHeader title="Notifications" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <div className='dashboard-title m-0'> Notifications ({notifications.length})</div>
            <div className="position-relative">
              <select
                id="propertyType"
                className="form-select custom-select-bs unread-bg border-0 py-2"
                defaultValue=""
                required
              >
                <option value="New">New</option>
              </select>

              <i className="bi bi-chevron-down select-bs-icon"></i>
            </div>
        </div>
        <div className="notifications-container row g-0 g-lg-2 mt-2">
          {isLoading ? (
            <div className="col-12 text-center my-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="col-12 text-center text-muted my-3">No notifications found.</div>
          ) : (
            notifications.map((item) => {
              const isUnread = item.status === 1;
              return (
                <div
                  key={item.id}
                  className={`col-12 mt-2 notification-item d-flex justify-content-between align-items-center gap-3 ${isUnread ? 'unread-bg' : ''}`}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className={isUnread ? 'unread-dot' : 'read-dot'}></div>
                    <img src={item.msgFrom?.avatar || '/assets/user.png'} alt="user" className="notification-user-img" />
                    <p className='notification-desc m-0'>
                      <span className='fw-bold'>{item.msgFrom?.name || 'User'}</span> {item.msg || ''}
                    </p>
                  </div>
                  <p className='notification-time text-nowrap m-0'>{item.created_at || ''}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default CleanerNotificationsMain;