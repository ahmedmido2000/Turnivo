import axiosInstance from './axiosConfig'

const getLanguage = () => localStorage.getItem('language') || 'en'

export const getNewCleanServices = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-new-clean-service', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching new clean services:', error)
    throw error.response?.data || { message: 'Failed to fetch new clean services' }
  }
}

export const getProgressCleanServices = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-progress-clean-service', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching progress clean services:', error)
    throw error.response?.data || { message: 'Failed to fetch progress clean services' }
  }
}

export const getCompleteCleanServices = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-complete-clean-service', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching complete clean services:', error)
    throw error.response?.data || { message: 'Failed to fetch complete clean services' }
  }
}

export const getRejectCleanServices = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-reject-clean-service', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching reject clean services:', error)
    throw error.response?.data || { message: 'Failed to fetch reject clean services' }
  }
}

export const getCleanServiceDetails = async (accessToken, id) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/provider-clean-service-view', {
      params: { id },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching clean service details:', error)
    throw error.response?.data || { message: 'Failed to fetch clean service details' }
  }
}

export const rejectCleanService = async (accessToken, data) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/reject-clean-service', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    })
    return response.data
  } catch (error) {
    console.error('Error rejecting clean service:', error)
    throw error.response?.data || { message: 'Failed to reject clean service' }
  }
}

export const addCleanServiceBeforeImages = async (accessToken, service_id, images) => {
  try {
    const formData = new FormData()
    formData.append('service_id', service_id)
    images.forEach((image) => {
      formData.append('image[]', image)
    })

    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/provider-add-clean-service-befor', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error adding before images:', error)
    throw error.response?.data || { message: 'Failed to add before images' }
  }
}

export const addCleanServiceAfterImages = async (accessToken, service_id, images) => {
  try {
    const formData = new FormData()
    formData.append('service_id', service_id)
    images.forEach((image) => {
      formData.append('image[]', image)
    })

    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/provider-add-clean-service-after', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error adding after images:', error)
    throw error.response?.data || { message: 'Failed to add after images' }
  }
}

export const changeStatusCleanService = async (accessToken, data) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/change-status-clean-service', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Accept-Language': getLanguage(),
      },
    })
    return response.data
  } catch (error) {
    console.error('Error changing clean service status:', error)
    throw error.response?.data || { message: 'Failed to change clean service status' }
  }
}
export const providerCheckIn = async (accessToken, serviceId) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/provider-check-in', 
      { service_id: serviceId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept-Language': getLanguage(),
        },
      }
    )
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to check in' }
  }
}