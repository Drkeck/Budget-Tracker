// name of the service worker so its uniquely stored and doesn't conflict with other potential service workers.
const APP_PREFIX = 'Budget_Tracker-';
const VERSION = 'version_1';

const CACHE_NAME = APP_PREFIX + VERSION;
// files to be stored in memory.
const FILES_TO_CACHE = [
    '/',
    'index.html',
    'manifest.json',
    '/css/styles.css',
    '/js/index.js',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];

// installing the service worker and potentially removing an older one.
self.addEventListener('install', function(e){
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('Files are being cached!');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    
    self.skipWaiting();
})

// setting up how the service worker will behave with files it needs to store on memory.
self.addEventListener('active', function(e){
    e.waitUntil(
        caches.keys().then(function(keyList) {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            })
            cacheKeepList.push(CACHE_NAME)

            return Promise.all(
                keyList.map(function(key, i) {
                    if (cacheKeepList.indexOf(key) === -1) {
                        console.log('deleting cahce: ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                })
            )
        })
    )
})

// finds what files it needs from memmory and what it can load while offline.
self.addEventListener('fetch', function(e){
    // checks to see if the fetch if for an api and if it has older results in memory
    if (e.request.url.includes('/api/')) {
        e.respondWith(
            caches
                .open(DATA_CACHE_NAME)
                .then(cache => {
                    return fetch(e.request)
                        .then(response => {
                            if (response.status === 200) {
                                cache.put(e.request.url, response.clone());
                            }

                            return response;
                        })
                        .catch(err =>{
                            return cache.match(e.request);
                        })
                })
                .catch(err => console.log(err))
        )
        return
    }
// checks for other requests such as CSS/JS/HTML/PNG or other files the application needs is in memory and can be pulled from.
    e.respondWith(
        fetch(e.request).catch(function() {
            return caches.match(e.request).then(function(response) {
                if (response) {
                    return response
                } else if (e.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/');
                }
            })
        })
    )
})