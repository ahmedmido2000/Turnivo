import axiosInstance from './axiosConfig';

/**
 * Get lists data (property types, cities, platforms, etc.)
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response with lists data
 */
export const getListsData = async (accessToken) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/lists?access-token=${accessToken}`
  );
  return response.data;
};

/**
 * Get all properties with pagination
 * @param {string} accessToken - User's access token
 * @param {number} page - Page number (default: 1)
 * @returns {Promise} API response with properties data
 */
export const getProperties = async (accessToken, page = 1) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/property?access-token=${accessToken}&page=${page}`
  );
  return response.data;
};

/**
 * Get single property by ID
 * @param {string} accessToken - User's access token
 * @param {number} id - Property ID
 * @returns {Promise} API response with property data
 */
export const getPropertyById = async (accessToken, id) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/view-property?access-token=${accessToken}&id=${id}`
  );
  return response.data;
};

/**
 * Create a new property
 * @param {FormData} propertyData - Property data including image file
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response
 */
export const createProperty = async (propertyData, accessToken) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/create-property?access-token=${accessToken}`,
    propertyData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Update an existing property
 * @param {FormData} propertyData - Property data including image file
 * @param {string} accessToken - User's access token
 * @param {number} id - Property ID
 * @returns {Promise} API response
 */
export const updateProperty = async (propertyData, accessToken, id) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/update-property?access-token=${accessToken}&id=${id}`,
    propertyData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Delete a property
 * @param {string} accessToken - User's access token
 * @param {number} id - Property ID
 * @returns {Promise} API response
 */
export const deleteProperty = async (accessToken, id) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/delete-property?access-token=${accessToken}&id=${id}`
  );
  return response.data;
};

/**
 * Get property calendar events
 * @param {string} accessToken - User's access token
 * @param {number} propertyId - Property ID
 * @returns {Promise} API response with calendar data
 */
export const getPropertyCalendar = async (accessToken, propertyId) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/property-calender?access-token=${accessToken}`,
    { property_id: propertyId },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};

/**
 * Create a smart lock request
 * @param {string} accessToken - User's access token
 * @param {Object} requestData - Smart lock request data
 * @param {number} requestData.property_id - Property ID
 * @param {string} requestData.date - Date in format YYYY-MM-DD
 * @param {string} requestData.time_from - Start time
 * @param {string} requestData.time_to - End time
 * @param {number} requestData.price - Price
 * @returns {Promise} API response
 */
export const createSmartLockRequest = async (accessToken, requestData) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/create-smart-lock-request?access-token=${accessToken}`,
    requestData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};

/**
 * Get contact information and settings
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response with contact info and settings
 */
export const getContactInfo = async (accessToken) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/contact-info?access-token=${accessToken}`
  );
  return response.data;
};

/**
 * Add property rule
 * @param {string} accessToken - User's access token
 * @param {number} property_id - Property ID
 * @param {string} property_rule - Property rule text
 * @returns {Promise} API response
 */
export const addPropertyRule = async (accessToken, property_id, property_rule) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/add-property-rule?access-token=${accessToken}`,
    { property_id, property_rule },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};

/**
 * Search for properties by name
 * @param {string} accessToken - User's access token
 * @param {string} name - Property name to search for
 * @returns {Promise} API response with search results
 */
export const searchProperty = async (accessToken, name) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/search-property?access-token=${accessToken}`,
    { name },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};

