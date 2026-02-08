import axiosInstance from './axiosConfig';

/**
 * Create a report problem request
 * @param {string} accessToken - User access token
 * @param {Object} data - Report payload
 * @returns {Promise<object>} API response
 */
export const createReportProblem = async (accessToken, data) => {
  try {
    const response = await axiosInstance.post(
      `/demo/turnivo/api/web/v1/site/create-report-problem?access-token=${accessToken}`,
      data,
      {
        headers: {
          'Accept-Language': localStorage.getItem('language') || 'en',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error creating report problem request:', error);
    throw error.response?.data || { message: 'Failed to submit problem report' };
  }
};

/**
 * Get list of reported problems for provider/cleaner
 * @param {string} accessToken - User access token
 * @param {number} page - Page number for pagination
 * @returns {Promise<object>} API response
 */
export const getProviderReportProblems = async (accessToken, page = 1) => {
  try {
    const response = await axiosInstance.get(
      `/demo/turnivo/api/web/v1/site/provider-report-problem`,
      {
        params: {
          'access-token': accessToken,
          page,
        },
        headers: {
          'Accept-Language': localStorage.getItem('language') || 'en',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching report problems:', error);
    throw error.response?.data || { message: 'Failed to fetch report problems' };
  }
};

/**
 * Get single report problem details
 * @param {string} accessToken - User access token
 * @param {number} id - Problem ID
 * @returns {Promise<object>} API response
 */
export const getProviderReportProblemView = async (accessToken, id) => {
  try {
    const response = await axiosInstance.get(
      `/demo/turnivo/api/web/v1/site/provider-report-problem-view`,
      {
        params: {
          'access-token': accessToken,
          id,
        },
        headers: {
          'Accept-Language': localStorage.getItem('language') || 'en',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching report problem details:', error);
    throw error.response?.data || { message: 'Failed to fetch report problem details' };
  }
};
