import axiosInstance from './axiosConfig';

/**
 * Fetch all trainings
 * @param {string} accessToken - Access token
 * @returns {Promise<object>} API response
 */
export const getTrainings = async (accessToken) => {
  try {
    const response = await axiosInstance.get(`/demo/turnivo/api/web/v1/site/training?access-token=${accessToken}`, {
      headers: {
        'Accept-Language': localStorage.getItem('language') || 'en',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trainings:', error);
    throw error.response?.data || { message: 'Failed to load trainings' };
  }
};

/**
 * Fetch training details by id
 * @param {string} accessToken - Access token
 * @param {number|string} id - Training ID
 * @returns {Promise<object>} API response
 */
export const getTrainingById = async (accessToken, id) => {
  try {
    const response = await axiosInstance.get(`/demo/turnivo/api/web/v1/site/training-view`, {
      params: { 'access-token': accessToken, id },
      headers: {
        'Accept-Language': localStorage.getItem('language') || 'en',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching training details:', error);
    throw error.response?.data || { message: 'Failed to load training details' };
  }
};
