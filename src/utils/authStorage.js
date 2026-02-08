/**
 * Save user data and access token to localStorage
 * @param {Object} data - User data object containing access_token and user info
 */
export const saveUserData = (data) => {
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
  }
  
  if (data.data) {
    localStorage.setItem('user_data', JSON.stringify(data.data));
  }
};

/**
 * Update user data in localStorage (merge with existing data)
 * @param {Object} updates - Fields to update in user data
 */
export const updateUserData = (updates) => {
  const currentData = getUserData();
  if (currentData) {
    const updatedData = { ...currentData, ...updates };
    localStorage.setItem('user_data', JSON.stringify(updatedData));
  }
};

/**
 * Get user data from localStorage
 * @returns {Object|null} User data object or null if not found
 */
export const getUserData = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Get access token from localStorage
 * @returns {string|null} Access token or null if not found
 */
export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

/**
 * Clear all authentication data from localStorage
 */
export const clearUserData = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('user_email'); // Clear email from login step
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token and data
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  const userData = getUserData();
  return !!(token && userData);
};

/**
 * Save email temporarily during login flow
 * @param {string} email - User's email
 */
export const saveUserEmail = (email) => {
  sessionStorage.setItem('user_email', email);
};

/**
 * Get saved email from login flow
 * @returns {string|null} Email or null if not found
 */
export const getUserEmail = () => {
  return sessionStorage.getItem('user_email');
};

/**
 * Save activation code temporarily (for debugging/resend)
 * @param {string|number} code - Activation code
 */
export const saveActivationCode = (code) => {
  sessionStorage.setItem('activation_code', String(code));
};

/**
 * Get saved activation code
 * @returns {string|null} Activation code or null if not found
 */
export const getActivationCode = () => {
  return sessionStorage.getItem('activation_code');
};
