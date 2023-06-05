'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "3d00a6bc1d16ca94f7bcf65c5cbac15a",
"index.html": "d7f90202fe45ad14fc36904a61d6bb54",
"/": "d7f90202fe45ad14fc36904a61d6bb54",
"main.dart.js": "85dca0db590ffdcb6636534e0671f4d5",
"index.html_old": "7223a5cf378c505fe38f42c238d25858",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "757f508e5a01b4afc923d997bce008a9",
"icons/favicon-16x16.png": "43ba63f9677808d1714bfb483f5da592",
"icons/favicon.ico": "2ac2c3ba7b03711456277fb4ade09bf3",
"icons/apple-icon.png": "fcfefa227d9eb6e900fd780061100cf4",
"icons/apple-icon-144x144.png": "ea6a595bee1bc5d310105d4527bda516",
"icons/android-icon-192x192.png": "179408c0c14f383a608a29f9b0acfcf7",
"icons/apple-icon-precomposed.png": "fcfefa227d9eb6e900fd780061100cf4",
"icons/apple-icon-114x114.png": "cb39da5e7c99f6428140ebadb39cce82",
"icons/ms-icon-310x310.png": "dac1b790f3b8ae67551eb304685f1494",
"icons/Icon-192.png": "da92b0e2644254cbe840b4ca6e4ed551",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/ms-icon-144x144.png": "ea6a595bee1bc5d310105d4527bda516",
"icons/apple-icon-57x57.png": "88ba27df35bba5b01bfa52b95a2acc58",
"icons/apple-icon-152x152.png": "33f0efdf9b7fc4ef0faac61db0f93e92",
"icons/ms-icon-150x150.png": "71fc7bf4b8ad38438ff33d39e7859cc4",
"icons/android-icon-72x72.png": "2bdb35b4878c58404cfe3ad5ed3cc8fc",
"icons/android-icon-96x96.png": "8f95e25558be2d576cd0864fef32dbb3",
"icons/android-icon-36x36.png": "2d74eed91e97b1a66faee03556be341f",
"icons/apple-icon-180x180.png": "c89bb84b8a916a715f2394735c486bee",
"icons/favicon-96x96.png": "8f95e25558be2d576cd0864fef32dbb3",
"icons/android-icon-48x48.png": "91cb1cd063603e57783ae8d25e365c7e",
"icons/apple-icon-76x76.png": "5e304d0f670354522080eb2eacbbc9c8",
"icons/apple-icon-60x60.png": "05c529523df429d09cc5ec5987e15f42",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/android-icon-144x144.png": "ea6a595bee1bc5d310105d4527bda516",
"icons/apple-icon-72x72.png": "2bdb35b4878c58404cfe3ad5ed3cc8fc",
"icons/apple-icon-120x120.png": "d6b3703ac13839309353fcba8c12d4c2",
"icons/Icon-512.png": "c3a3f4f752464d14b6778560c15d3ed1",
"icons/favicon-32x32.png": "2702131cdfaf09f8a71918aac9c6dc29",
"icons/ms-icon-70x70.png": "c65e91a67bda34518caed9a12e3d2a33",
"manifest.json": "947d4fc3b902d59b5cbd971e253d0330",
"Archive.zip": "6715fbb45f142a3aa5a734257f9be17d",
"assets/AssetManifest.json": "ad729864a18138e9b9c401a08cc1d9e0",
"assets/NOTICES": "eda11a80c10f1b15c1af1249146ec8d7",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/packages/youtube_player_iframe/assets/player.html": "dc7a0426386dc6fd0e4187079900aea8",
"assets/packages/sd_ui/assets/images/placeholder.jpg": "9ac0c9ffe17a71eff42c2b0506828ec1",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.smcbin": "5ea503de6e7c5985a1475c9714d7cbd4",
"assets/fonts/MaterialIcons-Regular.otf": "c4aea817193c94b27f20651a9ca3038f",
"assets/assets/svg/review.svg": "0928f9f78ce498c8a4ec03a69707e59a",
"assets/assets/svg/sd_logo.svg": "3b4abd9cf5bf531000433b3b4f3923c0",
"assets/assets/svg/logo_3.svg": "699b2b0102da230c4d2130b1ce1efd68",
"assets/assets/svg/sd_logo_whole.svg": "8105a94d192ef93037da9f123eae5fd6",
"assets/assets/images/IMG_login.png": "a7720aaff7c5f937e8650fb7c6e240c9",
"assets/assets/images/ime.svg": "2d8db0402ddd228e78858aee664c7ed4",
"assets/assets/images/patchImage.png": "fae4b77dd9354ed559266b7756442d92",
"assets/assets/images/chcybersource.png": "9940d143ed8cc192ded9691b7a1a8967",
"assets/assets/images/delete_account.jpg": "5e46fbd17f6ff2da387abab776bfba6f",
"assets/assets/images/IMG_error_not_found.png": "f73d0aa898adefa26eb4dd4b0ad3e075",
"assets/assets/images/IMG_nocoupons.png": "e5223d650ef251ce3f1675526801e824",
"assets/assets/images/IMG_noitem.png": "7fd8c6c2e973c82b9c2214553538ec40",
"assets/assets/images/khalti_logo.png": "555b4595000b7d7ced1e34971e635016",
"assets/assets/images/khalti.png": "f94b6981d3c06934a4881bc0c30ad3ed",
"assets/assets/images/IMG_empty.png": "4c8256826b2ed28dae9c95e3db6dbb7d",
"assets/assets/images/ime.png": "668c1bfa6c4d8436cdb6bb67512b1458",
"assets/assets/images/placeholder.jpg": "9ac0c9ffe17a71eff42c2b0506828ec1",
"assets/assets/images/IMG_error.png": "d37ad1b68d861e7c44924a565fcb9e7f",
"assets/assets/images/IMG_error_connection.png": "3f05ebaed98a69c98e786dc86ff3ab44",
"assets/assets/images/apple.png": "e3e598ccac0257c959e7cf7bc44a8e50",
"assets/assets/images/couponx.png": "df21902034eef35731150976009e325c",
"assets/assets/images/SDLogo_White-Logo.png": "495571e024ec4f80b8dec0fcf83d6aee",
"assets/assets/images/IMG_success_checkout.png": "cc8ef4cb146fd2533498950083d7cf8e",
"assets/assets/images/profile.png": "9acfe78b8e1cfbf4c1b1d1f31745b96b",
"assets/assets/images/paytm.png": "6e767096aad1421cd27e3bacd91a5c81",
"assets/assets/images/IMG_nowishes.png": "08034ed6aaeebd7525923054df5a6efc",
"assets/assets/images/google.png": "2f4b9f7e3d83f4a401d1267d28f81ad3",
"assets/assets/images/IMG_error_checkout.png": "4cb0bfb9ec10fbb007be7666326055ac",
"assets/assets/images/facebook.png": "9fe3b7eaafbfcd83caa803a9d9f07811",
"assets/assets/images/IMG_success.png": "3f0952c6a41c109c70f64528967c85bd",
"assets/assets/images/coupon.png": "a783c410d6da9d156f095411637e3e13",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
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
        // Claim client to enable caching on first launch
        self.clients.claim();
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
      // Claim client to enable caching on first launch
      self.clients.claim();
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
