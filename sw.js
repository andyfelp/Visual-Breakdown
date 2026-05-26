const CACHE = 'vb-v2';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  // Don't skipWaiting — wait for user to close all tabs before activating
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  // Only delete OLD caches, never touch localStorage
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
