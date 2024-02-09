// install service worker
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("my-cache-name-02").then(function (cache) {
      cache.addAll([
        "/",
        "/index.html",
        "/script.js",
        "/manifest.json",
        "/favicon.ico",
        "/smu-icon-192x192.png",
        "/styles.css",
      ]);
    })
  );
});

// return cached response
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (res) {
      return res;
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data.type === "deleteTodo") {
    // Perform the delete operation even when offline
    const todoText = event.data.todoText;
    // Handle the deletion logic here
  }
});
