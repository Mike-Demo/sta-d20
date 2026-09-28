// Lightweight service worker — cache-first for assets, network-first for navigation
const CACHE_NAME = "sta2e-v1";
const PRECACHE = ["/", "/pwa-icon.svg"];

function buildValidatedUrl(requestUrl) {
  try {
    const url = new URL(requestUrl);

    // Protocol + host checks
    const allowedDomains = [self.location.hostname];
    if (!allowedDomains.includes(url.hostname)) {
      throw new Error("Invalid host");
    }
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Invalid protocol");
    }

    return url.href;
  } catch {
    throw new Error("Invalid URL");
  }
}

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Navigation requests — network-first (so deploys are picked up)
  if (request.mode === "navigate") {
    e.respondWith(
      fetch(buildValidatedUrl(request.url))
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  // Static assets — cache-first
  if (url.pathname.match(/\.(js|css|woff2?|ttf|otf|svg|png|jpg|webp|ico)$/)) {
    e.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(buildValidatedUrl(request.url)).then((res) => {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
            return res;
          }),
      ),
    );
    return;
  }
});
