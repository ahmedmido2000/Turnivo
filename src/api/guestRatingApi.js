import axiosInstance from './axiosConfig';

/**
 * Get guest ratings
 * @param {string} accessToken - The access token for authentication
 * @param {number} page - The page number for pagination (default: 1)
 * @returns {Promise} - Promise with the ratings data
 */
export const getGuestRatings = async (accessToken, page = 1) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/guest-rate', {
      params: {
        'access-token': accessToken,
        page: page
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching guest ratings:', error);
    throw error;
  }
};

/**
 * Get my ratings
 * @param {string} accessToken - The access token for authentication
 * @param {number} page - The page number for pagination (default: 1)
 * @returns {Promise} - Promise with the ratings data
 */
export const getMyRatings = async (accessToken, page = 1) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/my-rate', {
      params: {
        'access-token': accessToken,
        page: page
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching my ratings:', error);
    throw error;
  }
};

/**
 * Rate a service
 * @param {string} accessToken - User's access token
 * @param {number} service_id - Service ID
 * @param {number} type - Service type
 * @param {number} rate - Rating (1-5 stars)
 * @param {string} comment - Rating comment
 * @returns {Promise} API response
 */
export const rateService = async (accessToken, service_id, type, rate, comment) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/rate-service?access-token=${accessToken}`,
    { service_id, type, rate, comment },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};
