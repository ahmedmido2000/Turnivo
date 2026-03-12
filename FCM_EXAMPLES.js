/**
 * EXAMPLES - Firebase Cloud Messaging Usage
 * 
 * This file contains various examples of how to use FCM
 * in your React application
 */

// ============================================
// Example 1: Basic Usage (Already Integrated)
// ============================================

// The NotificationListener component in App.jsx automatically:
// ✅ Initializes FCM when user logs in
// ✅ Listens for foreground messages
// ✅ Shows toast notifications
// ✅ Handles notification clicks

// NO ADDITIONAL CODE NEEDED for basic functionality


// ============================================
// Example 2: Custom Notification Handling
// ============================================

/*
// Edit src/components/NotificationListener.jsx
// Customize the handleNotificationReceived function:

const handleNotificationReceived = (payload) => {
  const notification = payload.notification || {};
  const data = payload.data || {};

  // Custom logic before showing notification
  if (data.notification_type === 'cleaning_request') {
    // Play custom sound
    new Audio('/sounds/notification.mp3').play();
  }

  // Custom styling for different notification types
  let toastType = 'info';
  if (data.notification_type === 'problem_report') {
    toastType = 'warning';
  } else if (data.notification_type === 'payment') {
    toastType = 'success';
  }

  const toastContent = (
    <div className={`notification-${data.notification_type}`}>
      <img src={notification.image} alt="icon" />
      <div>
        <strong>{notification.title}</strong>
        <p>{notification.body}</p>
      </div>
    </div>
  );

  toast[toastType](toastContent, {
    position: 'top-right',
    autoClose: 5000,
    onClick: () => {
      window.location.href = data.url || '/';
    }
  });
};
*/


// ============================================
// Example 3: Manual FCM Initialization
// ============================================

/*
import { useEffect } from 'react';
import { useFCM } from '../hooks/useFCM';

function MyCustomComponent() {
  const handleNotification = (payload) => {
    console.log('Notification received:', payload);
    // Custom handling here
  };

  const { initializeFCM, cleanupFCM, getStoredToken } = useFCM(handleNotification);

  useEffect(() => {
    // Manually initialize FCM
    initializeFCM();

    return () => {
      // Cleanup on component unmount
      cleanupFCM();
    };
  }, [initializeFCM, cleanupFCM]);

  return (
    <div>
      <p>FCM Token: {getStoredToken()}</p>
    </div>
  );
}
*/


// ============================================
// Example 4: Programmatic Token Management
// ============================================

/*
import { 
  requestNotificationPermission,
  getOrCreateFCMToken,
  getStoredFCMToken,
  clearFCMToken 
} from '../services/firebase';
import { sendFCMToken, removeFCMToken } from '../api/notificationApi';

// Request permission and get token
const token = await requestNotificationPermission();

// Get existing token
const storedToken = getStoredFCMToken();

// Send token to server
await sendFCMToken(token, accessToken);

// Clear token from browser
clearFCMToken();

// Remove token from server
await removeFCMToken(accessToken);
*/


// ============================================
// Example 5: Role-Based Notification Routing
// ============================================

/*
import { buildNotificationUrl } from '../utils/notificationUtils';
import { useSelector } from 'react-redux';

function NavigateToNotification() {
  const roleId = useSelector(state => state.auth.roleId);

  const handleNotificationClick = (data) => {
    const url = buildNotificationUrl(roleId, {
      notification_type: data.notification_type,
      cleaning_id: data.cleaning_id,
      maintenance_id: data.maintenance_id,
      material_id: data.material_id,
    });

    window.location.href = url;
  };

  return null; // Just provides navigation logic
}
*/


// ============================================
// Example 6: Notification Validation
// ============================================

/*
import {
  isValidNotificationPayload,
  isNotificationSupported,
  areNotificationsPermitted,
  getNotificationPermissionStatus
} from '../utils/notificationUtils';

// Check if notifications are supported
if (!isNotificationSupported()) {
  console.warn('This browser does not support notifications');
}

// Check if notifications are permitted
if (!areNotificationsPermitted()) {
  console.warn('User has not granted notification permission');
}

// Get permission status
const status = getNotificationPermissionStatus();
console.log('Permission status:', status); // 'granted', 'denied', or 'default'

// Validate payload before processing
if (isValidNotificationPayload(payload)) {
  // Process notification
}
*/


// ============================================
// Example 7: Notification Formatting
// ============================================

/*
import { 
  formatNotificationMessage,
  getNotificationIcon
} from '../utils/notificationUtils';

const formattedMessage = formatNotificationMessage(rawMessage);
const iconUrl = getNotificationIcon(notificationType);

const toastContent = (
  <div>
    <img src={iconUrl} alt="icon" />
    <p>{formattedMessage}</p>
  </div>
);

toast.info(toastContent);
*/


// ============================================
// Example 8: FCM with React Query
// ============================================

/*
import { useMutation } from '@tanstack/react-query';
import { sendFCMToken } from '../api/notificationApi';

function useSendFCMToken() {
  return useMutation({
    mutationFn: ({ token, accessToken }) => 
      sendFCMToken(token, accessToken),
    onSuccess: (data) => {
      console.log('Token sent successfully:', data);
      toast.success('Notifications enabled');
    },
    onError: (error) => {
      console.error('Failed to send token:', error);
      toast.error('Failed to enable notifications');
    }
  });
}

// Usage
const { mutate: sendToken } = useSendFCMToken();
sendToken({ token: fcmToken, accessToken });
*/


// ============================================
// Example 9: FCM Logout Handling
// ============================================

/*
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { removeFCMToken } from '../api/notificationApi';
import { clearFCMToken } from '../services/firebase';

function useLogout() {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (accessToken) => {
      // Remove token from server
      await removeFCMToken(accessToken);
      
      // Clear local storage
      clearFCMToken();
    },
    onSuccess: () => {
      // Clear auth state
      dispatch(logout());
      
      // Redirect to login
      window.location.href = '/login';
    }
  });
}
*/


// ============================================
// Example 10: Notification Event Listener
// ============================================

/*
import { useEffect } from 'react';
import { setupForegroundMessageListener } from '../services/firebase';

function useNotificationListener() {
  useEffect(() => {
    // Setup listener
    const unsubscribe = setupForegroundMessageListener((payload) => {
      console.log('Message received:', payload);
      
      // Extract data
      const title = payload.notification?.title;
      const body = payload.notification?.body;
      const notificationUrl = payload.data?.url;

      // Custom event dispatch
      const event = new CustomEvent('fcm-notification', {
        detail: { title, body, url: notificationUrl }
      });
      window.dispatchEvent(event);
    });

    return unsubscribe;
  }, []);
}

// Listen to custom event in another component
function MyComponent() {
  useEffect(() => {
    const handleNotification = (event) => {
      console.log('Notification event:', event.detail);
    };

    window.addEventListener('fcm-notification', handleNotification);
    return () => window.removeEventListener('fcm-notification', handleNotification);
  }, []);

  return null;
}
*/


// ============================================
// Example 11: Service Worker Message Handling
// ============================================

/*
// In public/firebase-messaging-sw.js (already implemented)
// Customize the notification display:

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title;
  const notificationOptions = {
    body: payload.notification?.body,
    icon: payload.notification?.image,
    badge: '/assets/badge.png',
    vibrate: [100, 50, 100],
    data: {
      url: payload.data?.url || '/',
      primaryKey: payload.data?.primaryKey || 1,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click (already implemented)
self.addEventListener('notificationclick', (event) => {
  // Navigate to URL in data
  const url = event.notification.data?.url || '/';
  clients.matchAll({ type: 'window' }).then((clientList) => {
    if (clientList.length > 0) {
      clientList[0].navigate(url);
      clientList[0].focus();
    } else {
      clients.openWindow(url);
    }
  });
});
*/


// ============================================
// Example 12: Testing Notifications
// ============================================

/*
// In browser console, run these tests:

// Test 1: Check if service worker is registered
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
});

// Test 2: Check notification permission
console.log('Notification permission:', Notification.permission);

// Test 3: Get stored FCM token
console.log('FCM Token:', localStorage.getItem('fcm_token'));

// Test 4: Get Firebase Messaging instance
import { getFirebaseMessaging } from '../services/firebase';
const messaging = getFirebaseMessaging();
console.log('Messaging instance:', messaging);

// Test 5: Trigger foreground message manually
const testPayload = {
  notification: {
    title: 'Test Notification',
    body: 'This is a test message'
  },
  data: {
    url: '/client/dashboard',
    notification_type: 'test'
  }
};
// This would require setting up a test listener
*/


// ============================================
// Example 13: Error Handling
// ============================================

/*
import { requestNotificationPermission } from '../services/firebase';
import { toast } from 'react-toastify';

async function initializeNotifications() {
  try {
    const token = await requestNotificationPermission();
    
    if (!token) {
      toast.warn('Notification permission denied. You won\'t receive notifications.');
      return;
    }
    
    toast.success('Notifications enabled!');
  } catch (error) {
    console.error('Error initializing notifications:', error);
    toast.error('Failed to enable notifications');
  }
}
*/


// ============================================
// Example 14: Notification Badge/Counter
// ============================================

/*
import { useState, useEffect } from 'react';

function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Listen for notification events
    const handleNotification = (payload) => {
      setUnreadCount(prev => prev + 1);
      
      // Update badge
      if ('setAppBadge' in navigator) {
        navigator.setAppBadge(unreadCount + 1);
      }
    };

    // Setup listener
    const unsubscribe = setupForegroundMessageListener(handleNotification);
    
    return () => {
      unsubscribe();
      // Clear badge on cleanup
      if ('clearAppBadge' in navigator) {
        navigator.clearAppBadge();
      }
    };
  }, [unreadCount]);

  return <span className="badge">{unreadCount}</span>;
}
*/


// ============================================
// Export Examples (for documentation)
// ============================================

export const FCM_EXAMPLES = {
  basic: 'NotificationListener component (already integrated)',
  customHandling: 'Edit NotificationListener.jsx for custom behavior',
  manualInit: 'Use useFCM() hook for manual control',
  tokenManagement: 'Use firebase.js functions for token handling',
  roleBasedRouting: 'Use buildNotificationUrl() for role-based routing',
  validation: 'Use notificationUtils.js validation functions',
  formatting: 'Use notificationUtils.js formatting functions',
  reactQuery: 'Combine with useMutation for server sync',
  logoutHandling: 'Clear tokens when user logs out',
  eventListener: 'Use setupForegroundMessageListener() for events',
  serviceWorker: 'Customize firebase-messaging-sw.js for background',
  testing: 'Use browser console for debugging',
  errorHandling: 'Always wrap in try-catch blocks',
  badge: 'Use navigator.setAppBadge() for badge counter',
};

export default FCM_EXAMPLES;
