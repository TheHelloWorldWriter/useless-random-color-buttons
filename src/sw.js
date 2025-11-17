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
  '/img/manifest/android-chrome-192x192.png',
  '/img/manifest/android-chrome-512x512.png',
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

  // Only cache same-origin requests
  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/index.html'))
        .then((response) => response || caches.match('/index.html'))
    );
    return;
  }

  // Handle other requests with network-first strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful same-origin responses
        if (response.ok && isSameOrigin) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request)
          .then((cachedResponse) => {
            // Return cached response or a proper error response
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return a proper 503 response instead of undefined
            return new Response('Service Unavailable', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});
