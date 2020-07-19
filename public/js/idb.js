// start of offline functionality using index db
let db

// will be used to complete transactions so that the offline application can still do its job and update when needed when it is able to connect to the main server.
const request = indexedDB.open('Budget_Tracker', 1);

request.onupgradeneeded = function(e) {

    const db = e.target.result;

    db.createObjectStore('new_transaction', { autoIncrement: true })
}

request.onsuccess = function(e) {

    db = event.target.result;

    if (navigator.onLine) {

        // soon
    }
}

