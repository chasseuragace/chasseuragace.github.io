'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "5dbb859f472c6c61fd76ac58f50137a7",
"index.html": "9152019eac393732672808fbaf413444",
"/": "9152019eac393732672808fbaf413444",
"main.dart.js": "c88c281066943c9da1e924078416795d",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "a405820efbeb558f1d839c4d1e418474",
"assets/AssetManifest.json": "ab637ece2bf16a09054b39ea85a579c8",
"assets/NOTICES": "56ed7f85e09d63be7ae6e43642d0caae",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "80d27e0a4b558f6e8a743307dabda370",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/images/plp_old.png": "0374c44d6865454ecf1d53042919b100",
"assets/assets/images/orders_old.png": "dd0cdd76e5e99a56d4ac655332e72e07",
"assets/assets/images/description_old.png": "10a2c4bbe063216aa1bdbb6d9513ed2c",
"assets/assets/images/login.png": "90f3aa5d1e07889d6396e4c57ae9ed04",
"assets/assets/images/cart.png": "406336b1c45c97faa786fe71e79c977d",
"assets/assets/images/clothing_old.png": "fb080d1b25c263ce2998fa416db796a0",
"assets/assets/images/plp.png": "486cc2615442abdb8af146db9bcb5679",
"assets/assets/images/review.png": "7d2e3762a3a42f523fa29d83a2ce9589",
"assets/assets/images/register.png": "c2470f969d188232183087f0249a061e",
"assets/assets/images/accounts_old.png": "3e64119c72216582f317b29e082539b9",
"assets/assets/images/home.png": "10aa66251fa5827ce0ab20ca814dd341",
"assets/assets/images/login_old.png": "e8fcd928eddaf59afe7eb12667d2ce7f",
"assets/assets/images/register_old.png": "33dfbd578949297f7ab39541320b02da",
"assets/assets/images/cart_old.png": "8f6f36a35ca230e12400ead914060edb",
"assets/assets/images/fmcg.png": "4aa63ee63eb64b7ea6a1897e6fda3091",
"assets/assets/images/home_old.png": "8b0eb9d3c7c8e7894245a98ea1b2d19a",
"assets/assets/images/accounts.png": "e83ecd13d092b3bb81b9bf5f2320859e",
"assets/assets/images/electronics.png": "486cc2615442abdb8af146db9bcb5679",
"assets/assets/images/app_ranking.png": "3e43b6bb7a0a1a75723138e577fde395",
"assets/assets/images/description.png": "9abd6a8cdc5990cbd92a07f77db6fa53",
"assets/assets/images/pdp_old.png": "d8020dfce12102f6818bbb4d259d072d",
"assets/assets/images/new.png": "e6401f30bbdf31f106c13db9c4159f85",
"assets/assets/images/track_old.png": "66e2706a37c1947a7a1674b1620a573c",
"assets/assets/images/pdp.png": "8004616999662166a89bf1bcc96f0af9",
"assets/assets/images/clothing.png": "53489fb3257171faaf94883fbc5f0eaf",
"assets/assets/images/coupon.png": "c32cf56d39480dc9b95318f2982c7bd6",
"assets/assets/images/review_old.png": "c66e9c90aa265114d1fe2b08a2e4de79",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
