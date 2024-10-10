const CACHE_NAME = 'color-generator-cache-v1';
const BASE_URL = '/color_gen';
const urlsToCache = [
    `${BASE_URL}/`,
    `${BASE_URL}/index.html`,
    `${BASE_URL}/styles.css`,
    `${BASE_URL}/app.js`,
    `${BASE_URL}/images/icon-192.png`,
    `${BASE_URL}/images/icon-512.png`
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});