import axiosInstance from './axiosConfig';

const getLanguage = () => localStorage.getItem('language') || 'en';

export const getCleanerCalendar = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-calender', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cleaner calendar:', error);
    throw error.response?.data || { message: 'Failed to fetch cleaner calendar' };
  }
};

/**
 * Add provider availability time slots
 * @param {string} accessToken - The access token
 * @param {Array} timeSlots - Array of time slots [{date, time_from, time_to, status}]
 * @returns {Promise} Response
 */
export const addProviderTime = async (accessToken, timeSlots) => {
  try {
    const formData = new FormData();
    
    timeSlots.forEach((slot, index) => {
      formData.append(`provider[${index}][date]`, slot.date);
      formData.append(`provider[${index}][time_from]`, slot.time_from);
      formData.append(`provider[${index}][time_to]`, slot.time_to);
      formData.append(`provider[${index}][status]`, slot.status);
    });

    const response = await axiosInstance.post(
      `/demo/turnivo/api/web/v1/site/provider-add-time?access-token=${accessToken}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept-Language': getLanguage(),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding provider time:', error);
    throw error.response?.data || { message: 'Failed to add provider time' };
  }
};
