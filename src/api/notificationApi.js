import axiosInstance from './axiosConfig';

/**
 * Get notifications
 * @param {string} accessToken - User's access token
 * @param {number} page - Page number for pagination (optional)
 * @returns {Promise} API response with notifications
 */
export const getNotifications = async (accessToken, page = 1) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/notification?access-token=${accessToken}&page=${page}`
  );
  return response.data;
};

/**
 * Get notification badge count
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response with notification badge count
 */
export const getNotificationBadge = async (accessToken) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/notification-budge?access-token=${accessToken}`
  );
  return response.data;
};

/**
 * Send FCM token to server
 * @param {string} fcmToken - The FCM token
 * @param {string} accessToken - User's access token
 * @returns {Promise} Response from server
 */
export const sendFCMToken = async (fcmToken, accessToken) => {
  try {
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    if (!fcmToken) {
      throw new Error('FCM token not found');
    }

    const formData = new FormData();
    formData.append('access-token', accessToken);
    formData.append('value', fcmToken);
    formData.append('type', 'web');

    const response = await axiosInstance.post(
      '/demo/turnivo/api/web/v1/site/device-token',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('FCM token sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending FCM token:', error);
    throw error;
  }
};

/**
 * Remove FCM token from server
 * @param {string} accessToken - User's access token
 * @returns {Promise} Response from server
 */
export const removeFCMToken = async (accessToken) => {
  try {
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const currentToken = localStorage.getItem('fcm_token');

    const formData = new FormData();
    formData.append('access-token', accessToken);
    formData.append('value', currentToken || '');
    formData.append('type', 'delete');

    const response = await axiosInstance.post(
      '/demo/turnivo/api/web/v1/site/device-token',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('FCM token removed successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error removing FCM token:', error);
    throw error;
  }
};
