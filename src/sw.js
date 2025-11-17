const CACHE_VERSION = 5;
const CACHE_NAME = `useless-random-color-buttons-v${CACHE_VERSION}`;

// Static assets to cache for offline support
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/output.css',
  '/js/main.js',
  '/js/game.js',
  '/js/settings.js',
  '/js/utils.js',
  '/js/config.js',
  '/img/github.svg',
  '/site.webmanifest',
  '/favicon.ico'
];

// Install the Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Network-first strategy with cache fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request);
      })
  );
});
