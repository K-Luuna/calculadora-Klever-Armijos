const CACHE_NAME = 'facturacion-pwa-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './public/css/estilos.css',
  './public/js/clientes.js',
  './public/js/productos.js',
  './public/js/factura.js',
  './public/img/Logo_ESPE.png',
  './public/img/icon-192.png',
  './public/img/icon-512.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación del SW
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});

// Intercepción de peticiones
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
