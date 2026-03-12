import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  registerServiceWorker,
  requestNotificationPermission,
  setupForegroundMessageListener,
  getStoredFCMToken,
  clearFCMToken,
} from '../services/firebase';
import { sendFCMToken, removeFCMToken } from '../api/notificationApi';

/**
 * Custom hook for Firebase Cloud Messaging
 * Handles FCM initialization, token management, and message listening
 * @param {Function} onNotificationReceived - Callback when notification is received
 * @returns {Object} FCM state and methods
 */
export const useFCM = (onNotificationReceived) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  /**
   * Initialize FCM
   */
  const initializeFCM = useCallback(async () => {
    try {
      // Check if user is authenticated
      if (!token || !user) {
        console.log('User not authenticated, skipping FCM initialization');
        return;
      }

      // Register service worker for background messages
      await registerServiceWorker();

      let unsubscribe = () => {};

      // Request notification permission and get FCM token
      const fcmToken = await requestNotificationPermission();

      if (fcmToken) {
        const lastSyncedToken = localStorage.getItem('fcm_last_synced_token');
        const lastSyncedAccessToken = localStorage.getItem('fcm_last_synced_access_token');

        if (lastSyncedToken !== fcmToken || lastSyncedAccessToken !== token) {
          // Send token to server only when needed
          try {
            await sendFCMToken(fcmToken, token);
            localStorage.setItem('fcm_last_synced_token', fcmToken);
            localStorage.setItem('fcm_last_synced_access_token', token);
            console.log('FCM initialization completed successfully');
          } catch (error) {
            console.error('Error sending FCM token to server:', error);
            // Don't throw error, continue with local functionality
          }
        } else {
          console.log('FCM token already synced for this user');
        }
      }

      // Setup foreground message listener
      if (onNotificationReceived) {
        unsubscribe = setupForegroundMessageListener((payload) => {
          onNotificationReceived(payload);
        });
      }

      return unsubscribe;
    } catch (error) {
      console.error('Error during FCM initialization:', error);
      return () => {};
    }
  }, [token, user, onNotificationReceived]);

  /**
   * Cleanup FCM
   */
  const cleanupFCM = useCallback(async () => {
    try {
      // Remove token from server
      if (token) {
        try {
          await removeFCMToken(token);
        } catch (error) {
          console.error('Error removing FCM token from server:', error);
        }
      }

      // Clear local token
      clearFCMToken();
      localStorage.removeItem('fcm_last_synced_token');
      localStorage.removeItem('fcm_last_synced_access_token');
      console.log('FCM cleanup completed');
    } catch (error) {
      console.error('Error during FCM cleanup:', error);
    }
  }, [token]);

  /**
   * Initialize FCM when user logs in
   */
  useEffect(() => {
    let unsubscribe = () => {};

    if (token && user) {
      initializeFCM().then((cleanupListener) => {
        if (typeof cleanupListener === 'function') {
          unsubscribe = cleanupListener;
        }
      });
    }

    return () => {
      unsubscribe();
    };
  }, [token, user, initializeFCM]);

  return {
    initializeFCM,
    cleanupFCM,
    getStoredToken: getStoredFCMToken,
  };
};
