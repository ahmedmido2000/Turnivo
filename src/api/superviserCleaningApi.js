import axiosInstance from './axiosConfig';

const getLanguage = () => localStorage.getItem('language') || 'en';

export const getNewCleanServices = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/supervisor-new-clean-service', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': 'ar',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching new clean services:', error);
    throw error.response?.data || { message: 'Failed to fetch new clean services' };
  }
};

export const getProgressCleanServices = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/supervisor-progress-clean-service', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching progress clean services:', error);
    throw error.response?.data || { message: 'Failed to fetch progress clean services' };
  }
};

export const getCompleteCleanServices = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/supervisor-complete-clean-service', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching complete clean services:', error);
    throw error.response?.data || { message: 'Failed to fetch complete clean services' };
  }
};

export const getRejectCleanServices = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/supervisor-reject-clean-service', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reject clean services:', error);
    throw error.response?.data || { message: 'Failed to fetch reject clean services' };
  }
};

export const getCleanServiceDetails = async (accessToken, id) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/supervisor-clean-service-view', {
      params: { id },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching clean service details:', error);
    throw error.response?.data || { message: 'Failed to fetch clean service details' };
  }
};

export const rejectCleanService = async (accessToken, data) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/reject-clean-service', data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting clean service:', error);
    throw error.response?.data || { message: 'Failed to reject clean service' };
  }
};

export const reselectCleanService = async (accessToken, provider_id, service_id) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/supervisor-reselect-clean-service', 
      { provider_id, service_id },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept-Language': getLanguage(),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error reselecting clean service:', error);
    throw error.response?.data || { message: 'Failed to reselect clean service' };
  }
};
