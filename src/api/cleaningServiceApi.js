import axiosInstance from './axiosConfig';

/**
 * Get lists data (cleaning service types, plans, addition services, etc.)
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
 * Get user calendar (available appointments)
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response with calendar data
 */
export const getUserCalendar = async (accessToken) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/user-calender?access-token=${accessToken}`
  );
  return response.data;
};

/**
 * Get plans/packages
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response with plans data
 */
export const getPlans = async (accessToken) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/plan?access-token=${accessToken}`
  );
  return response.data;
};

/**
 * Create cleaning service request
 * @param {Object} serviceData - Service request data
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response
 */
export const createCleaningService = async (serviceData, accessToken) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/create-clean-service?access-token=${accessToken}`,
    serviceData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};

/**
 * Get new orders
 * @param {string} accessToken - User's access token
 * @param {number} page - Page number for pagination (optional)
 * @returns {Promise} API response with new orders
 */
export const getNewOrders = async (accessToken, page = 1) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/my-new-clean-service?access-token=${accessToken}&page=${page}`
  );
  return response.data;
};

/**
 * Get progress orders
 * @param {string} accessToken - User's access token
 * @param {number} page - Page number for pagination (optional)
 * @returns {Promise} API response with progress orders
 */
export const getProgressOrders = async (accessToken, page = 1) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/my-progress-clean-service?access-token=${accessToken}&page=${page}`
  );
  return response.data;
};

/**
 * Get completed orders
 * @param {string} accessToken - User's access token
 * @param {number} page - Page number for pagination (optional)
 * @returns {Promise} API response with completed orders
 */
export const getCompletedOrders = async (accessToken, page = 1) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/my-complete-clean-service?access-token=${accessToken}&page=${page}`
  );
  return response.data;
};

/**
 * Get canceled orders
 * @param {string} accessToken - User's access token
 * @param {number} page - Page number for pagination (optional)
 * @returns {Promise} API response with canceled orders
 */
export const getCanceledOrders = async (accessToken, page = 1) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/my-cancelled-clean-service?access-token=${accessToken}&page=${page}`
  );
  return response.data;
};

/**
 * Cancel an order
 * @param {number} orderId - Order ID to cancel
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response
 */
export const cancelOrder = async (orderId, accessToken) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/cancel-clean-service?access-token=${accessToken}`,
    { cleanservice_id: orderId },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};

/**
 * Get service details by ID
 * @param {number} serviceId - Service ID to view
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response with service details
 */
export const getServiceDetails = async (serviceId, accessToken) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/clean-service-view?access-token=${accessToken}&id=${serviceId}`
  );
  return response.data;
};

/**
 * ===== MAINTENANCE SERVICE API FUNCTIONS =====
 */

/**
 * Get new maintenance orders
 * @param {string} accessToken - User's access token
 * @param {number} page - Page number for pagination (optional)
 * @returns {Promise} API response with new maintenance orders
 */
export const getNewMaintenanceOrders = async (accessToken, page = 1) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/my-new-maintenance-service?access-token=${accessToken}&page=${page}`
  );
  return response.data;
};

/**
 * Get progress maintenance orders
 * @param {string} accessToken - User's access token
 * @param {number} page - Page number for pagination (optional)
 * @returns {Promise} API response with progress maintenance orders
 */
export const getProgressMaintenanceOrders = async (accessToken, page = 1) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/my-progress-maintenance-service?access-token=${accessToken}&page=${page}`
  );
  return response.data;
};

/**
 * Get completed maintenance orders
 * @param {string} accessToken - User's access token
 * @param {number} page - Page number for pagination (optional)
 * @returns {Promise} API response with completed maintenance orders
 */
export const getCompletedMaintenanceOrders = async (accessToken, page = 1) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/my-complete-maintenance-service?access-token=${accessToken}&page=${page}`
  );
  return response.data;
};

/**
 * Get cancelled maintenance orders
 * @param {string} accessToken - User's access token
 * @param {number} page - Page number for pagination (optional)
 * @returns {Promise} API response with cancelled maintenance orders
 */
export const getCancelledMaintenanceOrders = async (accessToken, page = 1) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/my-cancelled-maintenance-service?access-token=${accessToken}&page=${page}`
  );
  return response.data;
};

/**
 * Cancel a maintenance order
 * @param {number} maintenanceServiceId - Maintenance service ID to cancel
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response
 */
export const cancelMaintenanceOrder = async (maintenanceServiceId, accessToken) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/cancel-maintenance-service?access-token=${accessToken}`,
    { maintenanceservice_id: maintenanceServiceId },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};

/**
 * Get maintenance service details by ID
 * @param {number} serviceId - Service ID to view
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response with service details
 */
export const getMaintenanceServiceDetails = async (serviceId, accessToken) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/maintenance-service-view?access-token=${accessToken}&id=${serviceId}`
  );
  return response.data;
};

/**
 * Create maintenance service request
 * @param {Object} serviceData - Service request data
 * @param {number} serviceData.property_id - Property ID
 * @param {number} serviceData.maintenance_service_type_id - Maintenance service type ID
 * @param {number} serviceData.maintenance_importance_type_id - Maintenance importance type ID
 * @param {string} serviceData.description - Service description
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response
 */
export const createMaintenanceService = async (serviceData, accessToken) => {
  const response = await axiosInstance.post(
    `/demo/turnivo/api/web/v1/site/create-maintenance-service?access-token=${accessToken}`,
    serviceData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
};

/**
 * ===== PROPERTY PROBLEM API FUNCTIONS =====
 */

/**
 * Get property problems list
 * @param {string} accessToken - User's access token
 * @param {number} page - Page number for pagination (optional)
 * @returns {Promise} API response with property problems list
 */
export const getPropertyProblems = async (accessToken, page = 1) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/my-report-problem?access-token=${accessToken}&page=${page}`
  );
  return response.data;
};

/**
 * Get property problem details by ID
 * @param {number} problemId - Problem ID to view
 * @param {string} accessToken - User's access token
 * @returns {Promise} API response with problem details
 */
export const getPropertyProblemDetails = async (problemId, accessToken) => {
  const response = await axiosInstance.get(
    `/demo/turnivo/api/web/v1/site/report-problem-view?access-token=${accessToken}&id=${problemId}`
  );
  return response.data;
};

