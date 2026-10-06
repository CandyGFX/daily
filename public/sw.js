// Service Worker for Irfan & Shahana Daily App with Instant Auto-Update
const CACHE_NAME = 'daily-love-moon-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Always fetch HTML / navigation directly from network so updates appear instantly
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Network first for other assets
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// Notification Click handler: open / focus app window
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});

// Push notification event (for background alert & vibration)
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Daily Dhikr Reminder', body: 'SubhanAllah wa bihamdihi — remember Allah in your day.' };
  }
  const title = data.title || 'Daily Dhikr Reminder';
  const options = {
    body: data.body || 'SubhanAllah wa bihamdihi — remember Allah in your day.',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [400, 200, 400, 200, 600],
    tag: 'daily-alert',
    renotify: true,
    data: data
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
