/* eslint-disable no-useless-catch */
import axiosInstance from './axiosConfig';

const getLanguage = () => localStorage.getItem('language') || 'en';

// Get all available materials for selection
export const getMaterials = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-material', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new material request (order)
export const createMaterialRequest = async (accessToken, data) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/provider-create-material-request', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get new material requests
export const getNewMaterialRequests = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-material-request-new', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get complete material requests
export const getCompleteMaterialRequests = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-material-request-complete', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get cancelled material requests
export const getCancelledMaterialRequests = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-material-request-cancelled', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cancel a material request
export const cancelMaterialRequest = async (accessToken, materialsRequestId) => {
  try {
    const response = await axiosInstance.post(
      '/demo/turnivo/api/web/v1/site/provider-material-cancel-request',
      { matrails_request_id: materialsRequestId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': getLanguage(),
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get material request details by ID
export const getMaterialRequestView = async (accessToken, id) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-material-request-view', {
      params: { id },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
