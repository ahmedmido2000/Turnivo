import { toast } from 'react-toastify';
import { useFCM } from '../hooks/useFCM';
import './NotificationListener.css';

/**
 * NotificationListener Component
 * Listens for foreground notifications and displays them
 * Should be placed in the main App component
 */
const NotificationListener = () => {
  /**
   * Handle notification received
   */
  const handleNotificationReceived = (payload) => {
    console.log('Notification payload:', payload);

    const notification = payload.notification || {};
    const data = payload.data || {};

    const title = notification.title || 'Notification';
    const body = notification.body || 'You have a new message';
    const notificationImage =
      notification.image || data.image || data.icon || data.notification_icon || '';

    const toastContent = (
      <div className="turnivo-notification-card">
        <span className="turnivo-notification-accent" aria-hidden="true" />

        <div className="turnivo-notification-main">
          <div className="turnivo-notification-icon-wrap" aria-hidden="true">
            {notificationImage ? (
              <img
                src={notificationImage}
                alt=""
                className="turnivo-notification-icon"
              />
            ) : (
              <span className="turnivo-notification-icon-fallback">ON</span>
            )}
          </div>

          <div className="turnivo-notification-content">
            <p className="turnivo-notification-title">{title}</p>
            <p className="turnivo-notification-body">{body}</p>
            <span className="turnivo-notification-action">إشعار جديد</span>
          </div>
        </div>
      </div>
    );

    toast.info(toastContent, {
      position: 'top-right',
      autoClose: 6500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      icon: false,
      className: 'turnivo-notification-toast',
      bodyClassName: 'turnivo-notification-toast-body',
      progressClassName: 'turnivo-notification-toast-progress',
    });
  };

  useFCM(handleNotificationReceived);

  // Component doesn't render anything visual
  return null;
};

export default NotificationListener;
