// name of the service worker so its uniquely stored and doesn't conflict with other potential service workers.
const CACHE_NAME = 'Budget_Tracker_v1';
const DATA_CACHE_NAME = 'Budget_Tracker_v1';

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
    e.waitUntill(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Files are being cached!');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    
    self.skipWaiting();
})

// setting up how the service worker will behave with files it needs to store on memory.
self.addEventListener('active', function(e){
    e.waitUntill(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('removing old cahced data', key);
                        return caches.delete(key);
                    }
                })
            )
        })
    )
    self.Clients.claim();
})

// finds what files it needs from memmory and what it can load while offline.
self.addEventListener('fetch', function(e){

})