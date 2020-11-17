const FILES_TO_CACHE = [
    '/index.html',
    '/db.js',
    
    '/index.js',


];




const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

// install
self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Your files were pre-cached successfully!');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});



self.addEventListener('fetch', function (evt) {
    if (evt.request.url.includes('/api/')) {
        console.log('[Service Worker] Fetch (data)', evt.request.url);

        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                    .then(response => {
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }

                        return response;
                    })
                    .catch(err => {
                        return cache.match(evt.request);
                    });
            })
        );
        return;
    }
    evt.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request);
            });
        })
    );
});
// const CACHE_NAME = "static-cache-v1";
// const DATA_CACHE_NAME = "data-cache-v1";

// // install
// self.addEventListener("install", function (evt) {
//   evt.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("Your files were pre-cached successfully!");
//       return cache.addAll(FILES_TO_CACHE);
//     }).catch(err => {
//         console.log('some error', err)
//     })
//   );
// });
// // fetch
// self.addEventListener("fetch", function(evt) {
//     const {url} = evt.request;
//     if (url.includes("/api")) {
//       evt.respondWith(
//         caches.open(DATA_CACHE_NAME).then(cache => {
//           return fetch(evt.request)
//             .then(response => {
//               // If the response was good, clone it and store it in the cache.
//               if (response.status === 200) {
//                 cache.put(evt.request, response.clone());
//               }
  
//               return response;
//             })
//             .catch(err => {
//               // Network request failed, try to get it from the cache.
//               return cache.match(evt.request);
//             });
//         }).catch(err => console.log(err))
//       );
//     } else {
//       // respond from static cache, request is not for /api/*
//       evt.respondWith(
//         caches.open(CACHE_NAME).then(cache => {
//           return cache.match(evt.request).then(response => {
//             return response || fetch(evt.request);
//           });
//         })
//       );
//     }
//   });
  
