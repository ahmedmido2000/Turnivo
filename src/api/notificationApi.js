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
