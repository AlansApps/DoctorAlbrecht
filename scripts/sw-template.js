/* TarjetAlan service worker — generated at build time from scripts/sw-template.js.
 * App shell: cache-first for versioned assets. Content packs are NOT cached here
 * (they live in IndexedDB), so nothing is stored twice.
 * New versions wait: the page decides when to activate (never mid-question).
 */
const VERSION = '__SHELL_VERSION__';
const SHELL = __PRECACHE__;
const CACHE = `tarjetalan-shell-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Delete old shells only once this version is active and valid.
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('tarjetalan-shell-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/content/')) return; // manifest/packs: network, stored in IndexedDB by the app

  if (req.mode === 'navigate') {
    // Hash routing: every navigation is the app shell.
    event.respondWith(
      fetch(req).catch(() => caches.match('./index.html', { ignoreSearch: true }).then((r) => r || caches.match('./'))),
    );
    return;
  }
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)),
  );
});
