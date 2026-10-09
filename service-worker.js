"use strict";

const CACHE_NAME = "hoc-cung-be-v29";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./data/vietnamese-grade-1.js",
  "./data/english-grade-1.js",
  "./assets/english-grade-1/media-manifest.json",
  "./child-profiles.js",
  "./cloud-sync.js",
  "./child-settings.js",
  "./firebase-config.js",
  "./feedback-config.js",
  "./parent-auth.js",
  "./parent-tools.js",
  "./manifest.webmanifest",
  "./assets/branding/logo-hoc-cung-be-web.png",
  "./assets/backgrounds/van-mieu-quoc-tu-giam.webp",
  "./assets/english-grade-1/images/letters-abcd.webp",
  "./assets/english-grade-1/images/letters-efgh.webp",
  "./assets/english-grade-1/images/letters-ijkl.webp",
  "./assets/english-grade-1/images/letters-mnop.webp",
  "./assets/english-grade-1/images/letters-qrst.webp",
  "./assets/english-grade-1/images/letters-uvwxyz.webp",
  "./assets/english-grade-1/images/uppercase-lowercase.webp",
  "./assets/english-grade-1/images/greetings.webp",
  "./assets/english-grade-1/images/numbers.webp",
  "./assets/english-grade-1/images/colors.webp",
  "./assets/english-grade-1/images/school-things.webp",
  "./assets/english-grade-1/images/family.webp",
  "./assets/english-grade-1/images/body.webp",
  "./assets/english-grade-1/images/animals.webp",
  "./assets/english-grade-1/images/fruits.webp",
  "./assets/english-grade-1/images/toys.webp",
  "./assets/english-grade-1/images/actions.webp",
  "./assets/english-grade-1/images/review.webp",
  "./assets/english-grade-1/posters/greetings.webp",
  "./assets/english-grade-1/posters/colors.webp",
  "./assets/english-grade-1/posters/actions.webp",
  "./assets/icons/favicon-32.png",
  "./assets/icons/favicon-48.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-96.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-192.png",
  "./assets/icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("hoc-cung-be-") && key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

function cacheFirstWithUpdate(request) {
  return caches.match(request).then((cached) => {
    const update = fetch(request).then((response) => {
      if (response && response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
      return response;
    }).catch(() => cached);
    return cached || update;
  });
}

function cacheMediaRange(request) {
  return caches.open(CACHE_NAME).then(async (cache) => {
    const cached = await cache.match(request.url, { ignoreSearch: true, ignoreVary: true });
    if (cached) return cached;
    const response = await fetch(new Request(request.url, { credentials: request.credentials, mode: "same-origin" }));
    if (response && response.ok) cache.put(request.url, response.clone());
    return response;
  }).catch(() => caches.match(request.url, { ignoreSearch: true, ignoreVary: true }));
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  // Firebase Auth/Phone Auth, Firestore, Google Identity, SDK CDN and reCAPTCHA stay network-only.
  if (url.hostname.endsWith("firebaseapp.com") || url.hostname.endsWith("googleapis.com") || url.hostname.endsWith("gstatic.com") || url.hostname.endsWith("google.com") || url.hostname.endsWith("recaptcha.net")) return;
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request).then((cached) => cached || caches.match("./index.html") || caches.match("./"))));
    return;
  }

  if (request.destination === "video") { event.respondWith(cacheMediaRange(request)); return; }
  event.respondWith(cacheFirstWithUpdate(request));
});