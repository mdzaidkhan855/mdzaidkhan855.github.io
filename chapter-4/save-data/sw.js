var cacheName = 'latestNews-v1';

// Cache our known resources during install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll([
      './js/main.js',
      './js/article.js',
      './images/newspaper.svg',
      './css/site.css',
      './data/latest.json',
      './data/data-1.json',
      './article.html',
      './index.html'
    ]))
  );
});

// Cache any new resources as they are fetched
self.addEventListener('fetch', function(event) {
	log('inside addEventListner', event.request.headers);
	if(event.request.headers.get('save-data')){
			 // We want to save data, so restrict icons and fonts
			 if (event.request.url.includes('fonts.googleapis.com')) {
			 // return nothing
			 event.respondWith(new Response('', {status: 417, statusText: 'Ignore	fonts to save data.' }));
		}
	 }
	else{
			
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
    .then(function(response) {
      if (response) {
        return response;
      }
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        function(response) {
          if(!response || response.status !== 200) {
            return response;
          }

          var responseToCache = response.clone();
          caches.open(cacheName)
          .then(function(cache) {
            cache.put(event.request, responseToCache);
          });

          return response;
        }
      );
    })
		)};
});
