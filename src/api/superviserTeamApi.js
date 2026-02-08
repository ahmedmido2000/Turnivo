import axiosInstance from './axiosConfig';

// Get team list
export const getTeam = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/team', {
      params: { 'access-token': accessToken }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching team:', error);
    throw error;
  }
};

// Get pending team requests
export const getPendingTeam = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/pending-team', {
      params: { 'access-token': accessToken }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pending team:', error);
    throw error;
  }
};

// Accept user request
export const acceptUser = async (accessToken, userId) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/acceptance-user', 
      { user_id: userId },
      { params: { 'access-token': accessToken } }
    );
    return response.data;
  } catch (error) {
    console.error('Error accepting user:', error);
    throw error;
  }
};

// Reject user request
export const rejectUser = async (accessToken, userId) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/reject-user', 
      { user_id: userId },
      { params: { 'access-token': accessToken } }
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting user:', error);
    throw error;
  }
};

// Get team member details
export const getTeamMemberDetails = async (accessToken, id) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/team-view', {
      params: { 'access-token': accessToken, id }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching team member details:', error);
    throw error;
  }
};

// Get supervisor provider calendar (team member availability)
export const getSupervisorProviderCalendar = async (accessToken, userId) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/supervisor-provider-calender', 
      { user_id: userId },
      { params: { 'access-token': accessToken } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching supervisor provider calendar:', error);
    throw error;
  }
};

// Get user calendar (supervisor's own calendar)
export const getUserCalendar = async (accessToken) => {
  try {
    const response = await axiosInstance.get('/demo/turnivo/api/web/v1/site/user-calender', {
      params: { 'access-token': accessToken }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user calendar:', error);
    throw error;
  }
};

// Upgrade user
export const upgradeUser = async (accessToken, userId) => {
  try {
    const response = await axiosInstance.post('/demo/turnivo/api/web/v1/site/upgrade-user', 
      { user_id: userId },
      { params: { 'access-token': accessToken } }
    );
    return response.data;
  } catch (error) {
    console.error('Error upgrading user:', error);
    throw error;
  }
};
