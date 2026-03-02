import axiosInstance from './axiosConfig';

/**
 * Get services data for the home/services page
 * @returns {Promise} API response with services data
 */
export const getServicesData = async () => {
  const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/lists', {
    params: {
      'access-token': 'q3mdPlSMfSBKo4QrUSXEezb3WU59BLcS'
    }
  });
  return response.data;
};

/**
 * Get home dashboard data (charts and statistics)
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response with dashboard data
 */
export const getHomeDashboardData = async (accessToken) => {
  const response = await axiosInstance.get(`/demo/turnivo/api/web/v1/site/home?access-token=${accessToken}`);
  return response.data;
};

/**
 * Send contact form data
 * @param {Object} formData - {name, mobile, email, body}
 * @returns {Promise} API response
 */
export const sendContactForm = async (formData) => {
  const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/contact', formData);
  return response.data;
};

/**
 * Get terms and conditions/privacy policy
 * @returns {Promise} API response with terms data
 */
export const getTermsAndConditions = async () => {
  const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/term', {
    params: {
      'access-token': 'q3mdPlSMfSBKo4QrUSXEezb3WU59BLcS'
    }
  });
  return response.data;
};

/**
 * Get cities list
 * @returns {Promise} API response with cities data
 */
export const getCities = async () => {
  const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/city', {
    params: {
      'access-token': 'q3mdPlSMfSBKo4QrUSXEezb3WU59BLcS'
    }
  });
  return response.data;
};
