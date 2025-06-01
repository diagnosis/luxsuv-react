// src/sw.js
// This file will be used by vite-plugin-pwa to generate the service worker

// Cache name
const CACHE_NAME = 'lux-suv-cache-v1';

// Files to cache (already defined in vite.config.js, but you can customize further)
const urlsToCache = [
    '/',
    '/index.html',
    '/images/hero.jpg',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Install event: Cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching files');
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event: Serve cached content when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response; // Return cached response if available
            }
            return fetch(event.request).catch(() => {
                // Fallback for when offline and content isn’t cached
                return caches.match('/index.html');
            });
        })
    );
});