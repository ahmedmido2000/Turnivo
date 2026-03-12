/**
 * Notification utilities and helpers
 */

/**
 * Build notification URL based on user role and data
 * @param {number} roleId - User role ID
 * @param {Object} data - Notification data
 * @returns {string} URL to navigate to
 */
export const buildNotificationUrl = (roleId, data = {}) => {
  const { 
    item_id, 
    item_type, 
    cleaning_id, 
    maintenance_id, 
    material_id, 
    notification_type 
  } = data;

  // Determine dashboard base path based on role
  let basePath = '/';
  if (roleId === 3) {
    basePath = '/client';
  } else if (roleId === 4) {
    basePath = '/cleaner';
  } else if (roleId === 5) {
    basePath = '/supervisor';
  } else if (roleId === 6) {
    basePath = '/guest';
  }

  // Build URL based on notification type
  switch (notification_type) {
    case 'cleaning_request':
      return `${basePath}/cleaning-requests${cleaning_id ? `/${cleaning_id}` : ''}`;
    case 'cleaning_details':
      return `${basePath}/cleaning-details${cleaning_id ? `/${cleaning_id}` : ''}`;
    case 'maintenance_request':
      return `${basePath}/maintenance-requests${maintenance_id ? `/${maintenance_id}` : ''}`;
    case 'maintenance_details':
      return `${basePath}/maintenance-details${maintenance_id ? `/${maintenance_id}` : ''}`;
    case 'material_request':
      return `${basePath}/material-requests${material_id ? `/${material_id}` : ''}`;
    case 'material_details':
      return `${basePath}/material-details${material_id ? `/${material_id}` : ''}`;
    case 'problem_report':
      return `${basePath}/problems${item_id ? `/${item_id}` : ''}`;
    case 'rating':
      return `${basePath}/ratings`;
    case 'notification':
      return `${basePath}/notifications`;
    default:
      return basePath;
  }
};

/**
 * Format notification message
 * @param {string} message - Raw message
 * @returns {string} Formatted message
 */
export const formatNotificationMessage = (message) => {
  if (!message) return 'You have a new notification';
  return message.charAt(0).toUpperCase() + message.slice(1);
};

/**
 * Get notification icon based on type
 * @param {string} notificationType - Type of notification
 * @returns {string} Icon URL
 */
export const getNotificationIcon = (notificationType) => {
  const icons = {
    cleaning_request: '/assets/cleaning-icon.svg',
    maintenance_request: '/assets/maintenance-icon.svg',
    material_request: '/assets/material-icon.svg',
    problem_report: '/assets/problem-icon.svg',
    rating: '/assets/rating-icon.svg',
    payment: '/assets/payment-icon.svg',
    message: '/assets/message-icon.svg',
  };

  return icons[notificationType] || '/assets/icon-192x192.png';
};

/**
 * Validate notification payload
 * @param {Object} payload - Notification payload
 * @returns {boolean} Is valid
 */
export const isValidNotificationPayload = (payload) => {
  if (!payload) return false;
  if (!payload.notification && !payload.data) return false;
  return true;
};

/**
 * Check if service worker is supported
 * @returns {boolean} Is supported
 */
export const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};

/**
 * Check if notifications are supported
 * @returns {boolean} Is supported
 */
export const isNotificationSupported = () => {
  return 'Notification' in window;
};

/**
 * Check if notifications are permitted
 * @returns {boolean} Are permitted
 */
export const areNotificationsPermitted = () => {
  return (
    isNotificationSupported() &&
    Notification.permission === 'granted'
  );
};

/**
 * Get notification permission status
 * @returns {string} Permission status: 'granted', 'denied', 'default'
 */
export const getNotificationPermissionStatus = () => {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission;
};
