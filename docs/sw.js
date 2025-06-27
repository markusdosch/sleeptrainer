// sw.js - Minimal service worker for index.html caching
const CACHE_NAME = 'app-cache-v1';
const INDEX_URL = '/index.html';

// Install event - pre-cache index.html
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.add(INDEX_URL))
    );
});

// Fetch event - network-first strategy for index.html
self.addEventListener('fetch', event => {
    // Only handle requests for index.html
    if (event.request.url.endsWith('/index.html') ||
        (event.request.url.endsWith('/') && event.request.mode === 'navigate')) {

        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Network request successful - update cache and return response
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(INDEX_URL, responseClone));
                    }
                    return response;
                })
                .catch(() => {
                    // Network failed - return cached version
                    return caches.match(INDEX_URL);
                })
        );
    }
});