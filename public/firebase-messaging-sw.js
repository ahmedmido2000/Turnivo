/* eslint-env serviceworker */
/* global importScripts, firebase */

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/12.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.10.0/firebase-messaging-compat.js');

const queryParams = new URL(self.location.href).searchParams;

const firebaseConfig = {
  apiKey: queryParams.get('apiKey') || '',
  authDomain: queryParams.get('authDomain') || '',
  projectId: queryParams.get('projectId') || '',
  storageBucket: queryParams.get('storageBucket') || '',
  messagingSenderId: queryParams.get('messagingSenderId') || '',
  appId: queryParams.get('appId') || '',
  measurementId: queryParams.get('measurementId') || '',
};

const hasRequiredFirebaseConfig =
  Boolean(firebaseConfig.apiKey) &&
  Boolean(firebaseConfig.authDomain) &&
  Boolean(firebaseConfig.projectId) &&
  Boolean(firebaseConfig.messagingSenderId) &&
  Boolean(firebaseConfig.appId);

let messaging = null;

if (hasRequiredFirebaseConfig) {
  firebase.initializeApp(firebaseConfig);
  messaging = firebase.messaging();
} else {
  console.warn('[FCM SW] Missing Firebase config. Background messaging disabled.');
}

/**
 * Handle background messages
 * This is called when the app is not in focus but the page is still open
 */
if (messaging) {
  messaging.onBackgroundMessage((payload) => {
    console.log('Background message received:', payload);

    const notificationTitle = payload.notification?.title || 'Turnivo Notification';

    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: payload.notification?.image || '/assets/icon-192x192.png',
      badge: '/assets/badge-72x72.png',
      vibrate: [100, 50, 100],
      tag: payload.data?.tag || 'notification',
      requireInteraction: false,
      data: {
        dateOfArrival: Date.now(),
        primaryKey: payload.data?.primaryKey || 1,
      },
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

/**
 * Handle notification click events
 */
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();
});

/**
 * Handle notification close events
 */
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});
