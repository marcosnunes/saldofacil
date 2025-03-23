const CACHE_NAME = 'saldo-facil-cache-v2'; // Alterado o CACHE_NAME
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/style-index.css',
  '/style.css',
  '/config.js',
  '/utils.js',
  '/service-worker.js',
  '/assets/icon-192x192.png',
  '/assets/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network
        return fetch(event.request)
          .catch(() => {
            // Network error (offline)
            console.log('Offline: Requisição falhou:', event.request.url);
            return new Response(
              '<h1>Você está offline.</h1><p>Algumas funcionalidades podem não estar disponíveis.</p>',
              {
                headers: { 'Content-Type': 'text/html' }
              }
            );
          });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});