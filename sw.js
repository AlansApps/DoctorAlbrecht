/* DoctorAlbrecht service worker — generated at build time from scripts/sw-template.js.
 * App shell: cache-first for versioned assets. Content packs are NOT cached here
 * (they live in IndexedDB), so nothing is stored twice.
 * New versions wait: the page decides when to activate (never mid-question).
 */
const VERSION = 'a09a438b54ac';
const SHELL = ["./","assets/AppState-laEzk2RM.js","assets/CardScreen-B11qlnf2.js","assets/CaseScreen-BRdUF779.js","assets/ListenScreen-krMLifKw.js","assets/MacroScreen-W_a4YR2F.js","assets/QuestionsScreen-mqog7gHw.js","assets/ReviewScreen-Do8ZeKr5.js","assets/SettingsScreen-CA1kjFYD.js","assets/TopicsScreen-DcDl8m08.js","assets/VoiceSettings-C7i55tiZ.js","assets/atkinson-hyperlegible-next-latin-ext-wght-normal-C6vrW8VD.woff2","assets/atkinson-hyperlegible-next-latin-wght-normal-BcXVPD7q.woff2","assets/en-B8nmPpAK.js","assets/index-BzaxKzLv.css","assets/index-CvYAWknA.js","assets/manrope-latin-ext-wght-normal-Ch3YOpNY.woff2","assets/manrope-latin-wght-normal-DHIcAJRg.woff2","assets/sessionActions-BUdctBaY.js","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","icons/icon.svg","index.html","manifest.webmanifest"];
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
    // Hash routing: every navigation is the app shell. Network first with a deadline,
    // so a slow connection falls back to the cached shell instead of hanging.
    const cached = () => caches.match('./index.html', { ignoreSearch: true }).then((r) => r || caches.match('./'));
    event.respondWith(
      new Promise((resolve) => {
        let done = false;
        const timer = setTimeout(() => cached().then((r) => { if (!done && r) { done = true; resolve(r); } }), 3000);
        fetch(req).then(
          (res) => { if (!done) { done = true; clearTimeout(timer); resolve(res); } },
          () => cached().then((r) => { if (!done) { done = true; clearTimeout(timer); resolve(r || Response.error()); } }),
        );
      }),
    );
    return;
  }
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req)),
  );
});
