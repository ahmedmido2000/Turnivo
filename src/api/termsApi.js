import axios from 'axios';

const BASE_URL = 'https://alrajihy.com/demo/turnivo/api/web/v1/site';

export const getTerms = async (accessToken) => {
  try {
    const response = await axios.get(`${BASE_URL}/term`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': localStorage.getItem('language') || 'en',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
