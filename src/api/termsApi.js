import axiosInstance from './axiosConfig';

const BASE_API_PATH = '/demo/turnivo/api/web/v1/site';

export const getTerms = async (accessToken) => {
  try {
    const response = await axiosInstance.get(`${BASE_API_PATH}/term`, {
      params: {
        'access-token': accessToken
      },
      headers: {
        'Accept-Language': localStorage.getItem('language') || 'en',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWorkAgreement = async (accessToken) => {
  try {
    const response = await axiosInstance.get(`${BASE_API_PATH}/work-agreement`, {
      params: {
        'access-token': accessToken
      },
      headers: {
        'Accept-Language': localStorage.getItem('language') || 'en',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
