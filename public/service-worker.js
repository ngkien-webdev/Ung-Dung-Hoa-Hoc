// Service Worker for Offline Chemistry App Support
const CACHE_NAME = 'chemistry-app-v1';

// Resources to cache initially
const INITIAL_CACHE_RESOURCES = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
  '/favicon.ico',
  '/manifest.json',
  '/service-worker.js',
  // Additional resources
  '/placeholder.svg',
  '/og-image.png'
];

// Install event - Cache initial resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching initial resources');
        return cache.addAll(INITIAL_CACHE_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Respond with cached resources or fetch from network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if response is not valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the fetched response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // If fetch fails, try to return a fallback
            if (event.request.url.indexOf('/api/') !== -1) {
              return new Response(JSON.stringify({ 
                error: 'You are currently offline. Please connect to the internet and try again.' 
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            }
            
            // For HTML pages, return a custom offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            // For images, return a placeholder
            if (event.request.headers.get('accept').includes('image')) {
              return caches.match('/placeholder.svg');
            }
          });
      })
  );
});

// Background sync for pending operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-language-data') {
    event.waitUntil(syncLanguageData());
  }
});

// Function to sync language data
async function syncLanguageData() {
  try {
    // Get stored pending operations from IndexedDB
    const db = await openDB();
    const tx = db.transaction('pendingOperations', 'readonly');
    const store = tx.objectStore('pendingOperations');
    const operations = await store.getAll();
    
    if (operations.length === 0) {
      return;
    }
    
    // Process each pending operation
    for (const operation of operations) {
      try {
        // Send the operation to the server
        const response = await fetch('/api/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(operation)
        });
        
        if (response.ok) {
          // Remove the operation from the pending queue
          const deleteTx = db.transaction('pendingOperations', 'readwrite');
          const deleteStore = deleteTx.objectStore('pendingOperations');
          await deleteStore.delete(operation.id);
        }
      } catch (error) {
        console.error('Error processing sync operation', error);
      }
    }
  } catch (error) {
    console.error('Error during background sync', error);
  }
}

// Helper function to open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ChemistryAppOfflineDB', 1);
    
    request.onerror = (event) => {
      reject(new Error('Failed to open database'));
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('pendingOperations')) {
        db.createObjectStore('pendingOperations', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }
  
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url
    },
    actions: [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        const url = event.notification.data.url || '/';
        
        // If a window is already open, focus it
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
