import axiosInstance from './axiosConfig';

const getLanguage = () => localStorage.getItem('language') || 'en';

export const getCleanerNotifications = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/notification', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error.response?.data || { message: 'Failed to fetch notifications' };
  }
};

export const getCleanerNotificationBadge = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/notification-budge', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notification badge:', error);
    throw error.response?.data || { message: 'Failed to fetch notification badge' };
  }
};
