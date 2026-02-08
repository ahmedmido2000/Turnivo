import axiosInstance from './axiosConfig';

const getLanguage = () => localStorage.getItem('language') || 'en';

// Get new material requests
export const getNewMaterialRequests = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/supervisor-material-request-new', {
      params: { 'access-token': accessToken },
      headers: {
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching new material requests:', error);
    throw error.response?.data || { message: 'Failed to fetch new material requests' };
  }
};

// Get in-progress material requests
export const getProgressMaterialRequests = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/supervisor-material-request-inprogress', {
      params: { 'access-token': accessToken },
      headers: {
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching in-progress material requests:', error);
    throw error.response?.data || { message: 'Failed to fetch in-progress material requests' };
  }
};

// Get complete material requests
export const getCompleteMaterialRequests = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/supervisor-material-request-complete', {
      params: { 'access-token': accessToken },
      headers: {
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching complete material requests:', error);
    throw error.response?.data || { message: 'Failed to fetch complete material requests' };
  }
};

// Get rejected/reported material requests
export const getRejectMaterialRequests = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/supervisor-material-request-rejected', {
      params: { 'access-token': accessToken },
      headers: {
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rejected material requests:', error);
    throw error.response?.data || { message: 'Failed to fetch rejected material requests' };
  }
};

// Get material request details (view)
export const getMaterialRequestDetails = async (accessToken, id) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/supervisor-material-request-view', {
      params: { 'access-token': accessToken, id },
      headers: {
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching material request details:', error);
    throw error.response?.data || { message: 'Failed to fetch material request details' };
  }
};

// Reject material request
export const rejectMaterialRequest = async (accessToken, serviceId, comment) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/supervisor-reject-material-request-service', 
      { service_id: serviceId, comment },
      {
        params: { 'access-token': accessToken },
        headers: {
          'Accept-Language': getLanguage(),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting material request:', error);
    throw error.response?.data || { message: 'Failed to reject material request' };
  }
};

// Change status of material request
export const changeStatusMaterialRequest = async (accessToken, serviceId, comment) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/supervisor-change-status-material-request-service', 
      { service_id: serviceId, comment },
      {
        params: { 'access-token': accessToken },
        headers: {
          'Accept-Language': getLanguage(),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error changing material request status:', error);
    throw error.response?.data || { message: 'Failed to change material request status' };
  }
};
