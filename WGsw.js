const CACHE_NAME = 'pic2word-v1';
const ASSETS = [
    'WGindex.html',
    'WGstyle.css',
    'WGapp.js',
    'WGmanifest.json',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Success Zone Engine - Caching Game Assets...');
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (e) => {
    console.log('Game Service Worker Activated Securely.');
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            return cachedResponse || fetch(e.request);
        })
    );
});
