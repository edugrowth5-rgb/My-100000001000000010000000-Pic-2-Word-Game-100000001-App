const CACHE_NAME = 'wg-pic2word-v2';
const ASSETS = [
    'index.html',
    'WGstyle.css',
    'WGdata.js',
    'WGapp.js',
    'WGmanifest.json',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Success Zone Core Engine - Caching Offline Assets...');
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (e) => {
    console.log('Service Worker Configured.');
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            return cachedResponse || fetch(e.request);
        })
    );
});
