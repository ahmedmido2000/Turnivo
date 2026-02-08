import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken, selectCurrentUser } from '../../store/authSlice';
import { getUserInfo } from '../../api/authApi';
import { getCleanerNotificationBadge } from '../../api/cleanerNotificationApi';

const ClientDataContext = createContext(null);

export const useClientData = () => {
  const context = useContext(ClientDataContext);
  if (!context) {
    throw new Error('useClientData must be used within ClientDataProvider');
  }
  return context;
};

export const ClientDataProvider = ({ children }) => {
  const accessToken = useSelector(selectAccessToken);
  const currentUser = useSelector(selectCurrentUser);
  
  const [userInfo, setUserInfo] = useState(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user info
  const fetchUserInfo = useCallback(async () => {
    if (!accessToken || !currentUser?.user_id) return;
    
    try {
      const response = await getUserInfo(accessToken, currentUser.user_id);
      if (response.status === 1 && response.data?.[0]) {
        setUserInfo(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }, [accessToken, currentUser]);

  // Fetch notifications badge count
  const fetchNotificationBadge = useCallback(async () => {
    if (!accessToken) return;
    
    try {
      const response = await getCleanerNotificationBadge(accessToken);
      if (response.status === 1 && response.data) {
        const count = response.data[0]?.count || response.data?.count || 0;
        setUnreadNotificationsCount(count);
      }
    } catch (error) {
      console.error('Error fetching notification badge:', error);
    }
  }, [accessToken]);

  // Initial fetch
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchUserInfo(),
        fetchNotificationBadge()
      ]);
      setIsLoading(false);
    };

    if (accessToken) {
      fetchAllData();
    }
  }, [accessToken, fetchUserInfo, fetchNotificationBadge]);

  // Refresh functions
  const refreshUserInfo = () => fetchUserInfo();
  const refreshNotifications = () => fetchNotificationBadge();
  const refreshAll = () => {
    fetchUserInfo();
    fetchNotificationBadge();
  };

  const value = {
    // User data
    userInfo,
    userName: userInfo?.name || currentUser?.name || 'User',
    userLastName: userInfo?.last_name || currentUser?.last_name || '',
    userFullName: userInfo 
      ? `${userInfo.name || ''} ${userInfo.last_name || ''}`.trim() 
      : currentUser 
        ? `${currentUser.name || ''} ${currentUser.last_name || ''}`.trim()
        : 'User',
    userEmail: userInfo?.email || currentUser?.email || '',
    userMobile: userInfo?.mobile || currentUser?.mobile || '',
    userAvatar: userInfo?.avatar || currentUser?.avatar || '/assets/user.png',
    userAddress: userInfo?.address || '',
    userDescription: userInfo?.description || '',
    userStatus: userInfo?.status_name || 'Available',
    
    // Notifications
    unreadNotificationsCount,
    
    // Loading state
    isLoading,
    
    // Refresh functions
    refreshUserInfo,
    refreshNotifications,
    refreshAll,
  };

  return (
    <ClientDataContext.Provider value={value}>
      {children}
    </ClientDataContext.Provider>
  );
};

export default ClientDataProvider;
