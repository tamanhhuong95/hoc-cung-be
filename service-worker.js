"use strict";

const CACHE_NAME = "hoc-cung-be-v25";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./data/vietnamese-grade-1.js",
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

  event.respondWith(cacheFirstWithUpdate(request));
});