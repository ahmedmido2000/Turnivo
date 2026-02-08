import axiosInstance from './axiosConfig';

/**
 * Join team as a cleaner/provider
 * @param {Object} data - Cleaner registration data
 * @param {string} data.first_name - First name
 * @param {string} data.last_name - Last name
 * @param {string} data.email - Email address
 * @param {string} data.phone - Phone number
 * @param {string} data.address - Address
 * @param {string} data.postcode - Postal code
 * @param {number} data.city_id - City ID
 * @param {string} data.region - Region/Province
 * @param {string} data.lat - Latitude (optional)
 * @param {string} data.lang - Longitude (optional)
 * @param {string} data.experience - Experience (yes/no or 1/0)
 * @param {string} data.company - Company name (optional)
 * @param {string} data.start_date - Start date
 * @returns {Promise} Response from the server
 */
// https://alrajihy.com/demo/turnivo/api/web/v1/site/join-team
export const joinTeam = async (data) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/join-team', data);
    return response.data;
  } catch (error) {
    console.error('Error joining team:', error);
    throw error.response?.data || { message: 'Failed to submit registration' };
  }
};

/**
 * Get terms and policies
 * @param {number} id - Term ID (1 for Company Policies, 2 for Work Agreement, etc.)
 * @returns {Promise} Response from the server
 */
export const getTerms = async (id = null) => {
  try {
    // /demo/turnivo/api/web/v1/site/term
    const url = id ? `/demo/turnivo/api/web/v1/site/term?id=${id}` : '/site/term';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching terms:', error);
    throw error.response?.data || { message: 'Failed to fetch terms' };
  }
};

/**
 * Update cleaner profile
 * @param {Object} data - Profile update data
 * @param {string} data.name - First name
 * @param {string} data.last_name - Last name
 * @param {string} data.mobile - Mobile phone number
 * @param {string} data.address - Address
 * @param {string} data.description - Profile description
 * @returns {Promise} Response from the server
 */
export const updateCleanerProfile = async (data) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await axiosInstance.post(
      `/demo/turnivo/api/web/v1/site/profile?access-token=${accessToken}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};
