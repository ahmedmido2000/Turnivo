import { getApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const env = import.meta.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

const VAPID_KEY = env.VITE_FIREBASE_VAPID_KEY;
let serviceWorkerRegistrationPromise = null;

const hasRequiredFirebaseConfig = () => {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId
  );
};

const getFirebaseApp = () => {
  if (!hasRequiredFirebaseConfig()) {
    console.warn('Firebase config is missing. Check VITE_FIREBASE_* env variables.');
    return null;
  }

  return getApps().length ? getApp() : initializeApp(firebaseConfig);
};

const buildServiceWorkerUrl = () => {
  const query = new URLSearchParams({
    apiKey: firebaseConfig.apiKey || '',
    authDomain: firebaseConfig.authDomain || '',
    projectId: firebaseConfig.projectId || '',
    storageBucket: firebaseConfig.storageBucket || '',
    messagingSenderId: firebaseConfig.messagingSenderId || '',
    appId: firebaseConfig.appId || '',
    measurementId: firebaseConfig.measurementId || '',
  });

  return `/firebase-messaging-sw.js?${query.toString()}`;
};

const getServiceWorkerRegistration = async () => {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  if (!serviceWorkerRegistrationPromise) {
    serviceWorkerRegistrationPromise = navigator.serviceWorker
      .register(buildServiceWorkerUrl(), {
        scope: '/',
      })
      .then(async (registration) => {
        await navigator.serviceWorker.ready;
        console.log('Service Worker registered:', registration);
        return registration;
      })
      .catch((error) => {
        serviceWorkerRegistrationPromise = null;
        throw error;
      });
  }

  return serviceWorkerRegistrationPromise;
};

/**
 * Initialize Firebase
 */
export const initializeFirebase = () => {
  return getFirebaseApp();
};

/**
 * Get Firebase Messaging instance
 * @returns {Object} Messaging instance
 */
export const getFirebaseMessaging = () => {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }

  return getMessaging(app);
};

/**
 * Request notification permission and get FCM token
 * @returns {Promise<string|null>} FCM Token or null if permission denied
 */
export const requestNotificationPermission = async () => {
  try {
    // Check if the browser supports notification
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return null;
    }

    // Check if notification permission is already granted
    if (Notification.permission === 'granted') {
      return await getOrCreateFCMToken();
    }

    // Request permission if not granted
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        return await getOrCreateFCMToken();
      }
    }

    return null;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

/**
 * Get or create FCM Token
 * Prevents duplicate token sending by checking localStorage
 * @returns {Promise<string|null>} FCM Token or null
 */
export const getOrCreateFCMToken = async () => {
  try {
    const messaging = getFirebaseMessaging();
    if (!messaging) {
      return null;
    }

    if (!VAPID_KEY) {
      console.warn('VAPID key is missing. Check VITE_FIREBASE_VAPID_KEY.');
      return null;
    }

    const serviceWorkerRegistration = await registerServiceWorker();

    // Check if we already have a stored token
    const storedToken = localStorage.getItem('fcm_token');
    const tokenTimestamp = localStorage.getItem('fcm_token_timestamp');
    const currentTime = Date.now();

    // If token exists and is less than 7 days old, return it
    if (storedToken && tokenTimestamp) {
      const timeDifference = currentTime - parseInt(tokenTimestamp, 10);
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      if (timeDifference < sevenDaysInMs) {
        return storedToken;
      }
    }

    // Get new token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: serviceWorkerRegistration || undefined,
    });

    if (token) {
      // Store token with timestamp
      localStorage.setItem('fcm_token', token);
      localStorage.setItem('fcm_token_timestamp', currentTime.toString());
      console.log('FCM Token generated:', token);
      return token;
    } else {
      console.log('Failed to get FCM token');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

/**
 * Get stored FCM token
 * @returns {string|null} Stored FCM Token or null
 */
export const getStoredFCMToken = () => {
  return localStorage.getItem('fcm_token');
};

/**
 * Clear FCM token from localStorage
 */
export const clearFCMToken = () => {
  localStorage.removeItem('fcm_token');
  localStorage.removeItem('fcm_token_timestamp');
};

/**
 * Setup foreground message listener
 * @param {Function} onMessageCallback Callback function to handle messages
 * @returns {Function} Unsubscribe function
 */
export const setupForegroundMessageListener = (onMessageCallback) => {
  try {
    const messaging = getFirebaseMessaging();
    if (!messaging) {
      return () => {};
    }

    if (typeof onMessageCallback !== 'function') {
      return () => {};
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      onMessageCallback(payload);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up foreground message listener:', error);
    return () => {};
  }
};

/**
 * Register service worker for background message handling
 */
export const registerServiceWorker = async () => {
  try {
    if ('serviceWorker' in navigator) {
      if (!hasRequiredFirebaseConfig()) {
        return null;
      }

      return await getServiceWorkerRegistration();
    }

    return null;
  } catch (error) {
    console.error('Error registering service worker:', error);
    return null;
  }
};
