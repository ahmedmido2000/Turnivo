import axiosInstance from './axiosConfig';

/**
 * Guest login with email and code
 * @param {string} email - Guest's email address
 * @param {string} code - Temporary code
 * @param {number} property_id - Property ID
 * @returns {Promise} API response with access token
 */
export const guestLogin = async (email,  temp_code , property_id) => {
  const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/guest-login', {
    email,
     temp_code,
    property_id
  });
  return response.data;
};

/**
 * Create a report problem by guest
 * @param {string} accessToken - Guest's access token
 * @param {number} property_id - Property ID
 * @param {string} type - Type of problem (1=clean, 2=maintenance)
 * @param {string} temp_code - Temporary code
 * @param {string} description - Problem description
 * @returns {Promise} API response
 */
export const guestCreateReportProblem = async (accessToken, property_id, type, temp_code, description) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/guest-create-report-problem?access-token=${accessToken}`,
    {
      property_id,
      type,
      temp_code,
      description
    }
  );
  return response.data;
};

/**
 * Send contact message
 * @param {string} accessToken - Guest's access token
 * @param {string} name - Current user name
 * @param {string} email - Email address
 * @param {string} body - Message body
 * @returns {Promise} API response
 */
export const guestContact = async (accessToken, name, email, body) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/contact?access-token=${accessToken}`,
    {
      name,
      email,
      body
    }
  );
  return response.data;
};

/**
 * Rate service by guest
 * @param {string} accessToken - Guest's access token
 * @param {number} property_id - Property ID
 * @param {string} temp_code - Temporary code
 * @param {number} rate - Rating (1-5 stars)
 * @param {string} comment - Rating comment
 * @returns {Promise} API response
 */
export const guestRateService = async (accessToken, property_id, temp_code, rate, comment) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/guest-rate-service?access-token=${accessToken}`,
    {
      property_id,
      temp_code,
      rate,
      comment
    }
  );
  return response.data;
};

/**
 * Guest checkout
 * @param {string} accessToken - Guest's access token
 * @param {number} property_id - Property ID
 * @returns {Promise} API response
 */
export const guestCheckout = async (accessToken, property_id) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/guest-checkout?access-token=${accessToken}`,
    {
      property_id
    }
  );
  return response.data;
};
