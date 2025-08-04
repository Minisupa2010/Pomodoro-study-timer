const CACHE_NAME = 'pomodoro-v3'; // <-- Increment the version

// All the assets your app needs to function offline.
const assetsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json', // It's good to cache the manifest too!
  // Add all your icons for a complete offline experience
  'https://i.ibb.co/8gzdnvqp/icon.png', // Assuming this is your 192x192 icon
  '/assets/icons/icon-512.png',      // Your 512x512 icon
  '/assets/icons/icon-180.png'       // Your apple-touch-icon
];

// Install Event: Cache the app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching App Shell');
      return cache.addAll(assetsToCache);
    })
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event: Serve from cache, fall back to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});