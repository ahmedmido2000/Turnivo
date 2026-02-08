import axiosInstance from './axiosConfig';

/**
 * Get Lists - Fetch ServiceList and other lists
 * @param {string} accessToken - The access token
 * @returns {Promise} Response with lists data
 */
export const getLists = async (accessToken) => {
  try {
    const response = await axiosInstance.get(
      `/demo/turnivo/api/web/v1/site/lists?access-token=${accessToken}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching lists:', error);
    throw error;
  }
};
