// Simple precache + offline fallback
const CACHE = 'techy-static-v1';
const ASSETS = [
  './index.html','./contrast.html','./search.html','./gallery.html','./articles.html','./about.html','./contact.html',
  './style.css','./main.js','./contrast.js','./data.js','./search.js','./gallery.js',
  './manifest.json','./favicon.svg','./README.md'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE && caches.delete(k)))).then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(()=> caches.match('./index.html')))
  );
});
