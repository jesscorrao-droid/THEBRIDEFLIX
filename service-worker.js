const CACHE_NAME = "brideflix-cache";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./data.js",
    "./manifest.json"
];

// INSTALL
self.addEventListener("install", event => {

    self.skipWaiting();

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES))

    );

});

// ACTIVATE
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys =>

            Promise.all(

                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))

            )

        ).then(() => self.clients.claim())

    );

});

// FETCH
self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        fetch(event.request)

            .then(response => {

                const copy = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, copy));

                return response;

            })

            .catch(() => caches.match(event.request))

    );

});