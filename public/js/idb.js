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
        uploadTransaction();
    }
}

request.onerror = function(e) {
    console.log(e.target.errorCode);
}

function saveRecord(record) {

    const transaction = db.transaction(['new_transaction'], 'readwrite');

    const transactionObjectStore = transaction.objectStore('new_transaction');

    transactionObjectStore.add(record);
}

function uploadTransaction() {
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    const transactionObjectStore = transaction.objectStore('new_transaction');

    const getAll = transactionObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }

                const transaction = db.transaction(['new_transaction'], 'readwrite');
                const transactionObjectStore = transaction.objectStore('new_transaction');

                transactionObjectStore.clear();

                alert('All saved data has been submitted');
            })
            .catch(err => console.log(err))
        }
    }
}

window.addEventListener('online', uploadTransaction);