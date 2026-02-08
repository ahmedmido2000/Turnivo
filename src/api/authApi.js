import axiosInstance from './axiosConfig';

/**
 * Login user with email
 * @param {string} email - User's email address
 * @returns {Promise} API response with activation code
 */
export const loginUser = async (email) => {
  const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/login', { email });
  return response.data;
};

/**
 * Activate user account with activation code
 * @param {string|number} activation_code - 4-digit activation code
 * @returns {Promise} API response with user data and access token
 */
export const activateUser = async (activation_code) => {
  const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/activate', { 
    activation_code: String(activation_code) 
  });
  return response.data;
};

/**
 * Get user info by ID
 * @param {string} accessToken - User's access token
 * @param {number} userId - User's ID
 * @returns {Promise} API response with user info
 */
export const getUserInfo = async (accessToken, userId) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/user-info?access-token=${accessToken}&id=${userId}`
  );
  return response.data;
};

/**
 * Get user profile
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response with user profile data
 */
export const getUserProfile = async (accessToken) => {
  const response = await axiosInstance.get(`/demo/turnivo/api/web/v1/site/profile?access-token=${accessToken}`);
  return response.data;
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @param {string} profileData.name - User's first name
 * @param {string} profileData.last_name - User's last name
 * @param {string} profileData.email - User's email
 * @param {string} profileData.mobile - User's mobile number
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response
 */
export const updateUserProfile = async (profileData, accessToken) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/profile?access-token=${accessToken}`,
    profileData
  );
  return response.data;
};

/**
 * Submit contact form
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - User's name
 * @param {string} contactData.email - User's email
 * @param {string} contactData.body - Message body
 * @returns {Promise} API response
 */
export const submitContactForm = async (contactData) => {
  const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/contact', contactData);
  return response.data;
};
