import { Queue } from 'workbox-background-sync';
import { openDB } from 'idb';
const queue = new Queue('myQueueName');


self.addEventListener('install', (event) => {
        console.log('Service Worker instalado');
        self.skipWaiting();
    
});

async function checkAndExecutePendingRequests() {
        const openRequest = indexedDB.open('requests-db', 1);

        //create database if not exist
        openRequest.onupgradeneeded = (event) => {
                const db = event.target.result;
                const objectStore = db.createObjectStore('requests', { autoIncrement: true });
        };

        openRequest.onsuccess = async (event) => {
                const db = event.target.result;
                const transaction = db.transaction('requests', 'readonly');
                const store = transaction.objectStore('requests');

                const getRequest = store.getAll();

                getRequest.onsuccess = async () => {
                        const requests = getRequest.result;
                        if (requests.length === 0) return;
                        for (const request of requests) {
                                try {
                                        const file = request.body.image;
                                        const image = new File([file.arrayBuffer], file.name, { type: file.type });
                                        const formData = new FormData();
                                        formData.append('image', image);
                                        const controller = new AbortController();
                                        const response = await fetch(request.url, {
                                                method: request.method,
                                                body: formData,
                                                signal: controller.signal,
                                        });

                                        setTimeout(() => controller.abort(), 5000);
                                        if (response.ok) {
                                                //the request was successful, delete it from the database
                                                const deleteTransaction = db.transaction('requests', 'readwrite');
                                                const deleteStore = deleteTransaction.objectStore('requests');
                                                deleteStore.delete(request.id);
                                        }
                                } catch (error) {
                                        if (error.name === 'AbortError') {
                                                console.error('the request was aborted, it will be retried later');

                                        }
                                }
                        }
                };
        };

        openRequest.onerror = (event) => {
                console.error('Error al acceder a la base de datos:', event.target.error);
        };
}

const interval = 2 * 60 * 1000; // two minutes -> example
setInterval(() => {
        checkAndExecutePendingRequests();
}, interval);
