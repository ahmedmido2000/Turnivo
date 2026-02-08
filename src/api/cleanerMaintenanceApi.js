import axiosInstance from './axiosConfig';

const getLanguage = () => localStorage.getItem('language') || 'en';

export const getNewMaintenanceServices = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-new-maintenance-service', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching new maintenance services:', error);
    throw error.response?.data || { message: 'Failed to fetch new maintenance services' };
  }
};

export const getProgressMaintenanceServices = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-progress-maintenance-service', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching progress maintenance services:', error);
    throw error.response?.data || { message: 'Failed to fetch progress maintenance services' };
  }
};

export const getCompleteMaintenanceServices = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-complete-maintenance-service', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching complete maintenance services:', error);
    throw error.response?.data || { message: 'Failed to fetch complete maintenance services' };
  }
};

export const getRejectMaintenanceServices = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-reject-maintenance-service', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reject maintenance services:', error);
    throw error.response?.data || { message: 'Failed to fetch reject maintenance services' };
  }
};

export const getMaintenanceServiceDetails = async (accessToken, id) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-maintenance-service-view', {
      params: { id },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance service details:', error);
    throw error.response?.data || { message: 'Failed to fetch maintenance service details' };
  }
};

export const rejectMaintenanceService = async (accessToken, data) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/reject-maintenance-service', data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting maintenance service:', error);
    throw error.response?.data || { message: 'Failed to reject maintenance service' };
  }
};

export const acceptMaintenanceService = async (accessToken, data) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/accept-maintenance-service', data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error accepting maintenance service:', error);
    throw error.response?.data || { message: 'Failed to accept maintenance service' };
  }
};

export const addMaintenanceServiceBeforeImages = async (accessToken, service_id, images) => {
  try {
    const formData = new FormData();
    formData.append('service_id', service_id);
    
    // Add multiple images
    images.forEach((image) => {
      formData.append('image[]', image);
    });

    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/provider-add-maintenance-service-befor', formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding before images:', error);
    throw error.response?.data || { message: 'Failed to add before images' };
  }
};

export const addMaintenanceServiceAfterImages = async (accessToken, service_id, images) => {
  try {
    const formData = new FormData();
    formData.append('service_id', service_id);
    
    // Add multiple images
    images.forEach((image) => {
      formData.append('image[]', image);
    });

    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/provider-add-maintenance-service-after', formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding after images:', error);
    throw error.response?.data || { message: 'Failed to add after images' };
  }
};

export const changeStatusMaintenanceService = async (accessToken, data) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/change-status-maintenance-service', data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error changing maintenance service status:', error);
    throw error.response?.data || { message: 'Failed to change maintenance service status' };
  }
};
