'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "89729ddcf512929de11e13bbda7920ce",
"assets/AssetManifest.bin.json": "ce66ec02c926b72c927e8b589d7ecaa5",
"assets/AssetManifest.json": "0f3c9fef3fe7d2f1e52c3a31b8989b4d",
"assets/assets/images/67c24ac7": "d41d8cd98f00b204e9800998ecf8427e",
"assets/assets/images/bmc_button.png": "40242a959afa7680cff9cb33ce9692a7",
"assets/assets/images/e8cc27fe": "d41d8cd98f00b204e9800998ecf8427e",
"assets/assets/images/fe3bf24c": "d41d8cd98f00b204e9800998ecf8427e",
"assets/assets/images/ic_launcher.png": "4abacf34a41465ef6a0f422e25169145",
"assets/assets/images/img_about_detail.png": "8a2d5c09aa472af58f52146787154e39",
"assets/assets/images/img_about_detail_dark.png": "89fac659b7e62a649bd2a5335d30366d",
"assets/assets/images/img_about_icon.png": "ed92ee53de52b146611d82d1ccf44773",
"assets/assets/images/img_about_icon_dark.png": "40bf3c3f395f1afe1e0b55f7d93b7dfc",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "c9d4a7c2ee5225c3b84e51e1d4ca9225",
"assets/NOTICES": "06c8dd6f3352247eee99f2944d003375",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"calculation_guide.svg": "b9f0fdc32ccc5aaeb28ca11cd09f34f2",
"canvaskit/canvaskit.js": "6cfe36b4647fbfa15683e09e7dd366bc",
"canvaskit/canvaskit.js.symbols": "68eb703b9a609baef8ee0e413b442f33",
"canvaskit/canvaskit.wasm": "efeeba7dcc952dae57870d4df3111fad",
"canvaskit/chromium/canvaskit.js": "ba4a8ae1a65ff3ad81c6818fd47e348b",
"canvaskit/chromium/canvaskit.js.symbols": "5a23598a2a8efd18ec3b60de5d28af8f",
"canvaskit/chromium/canvaskit.wasm": "64a386c87532ae52ae041d18a32a3635",
"canvaskit/skwasm.js": "f2ad9363618c5f62e813740099a80e63",
"canvaskit/skwasm.js.symbols": "80806576fa1056b43dd6d0b445b4b6f7",
"canvaskit/skwasm.wasm": "f0dfd99007f989368db17c9abeed5a49",
"canvaskit/skwasm_st.js": "d1326ceef381ad382ab492ba5d96f04d",
"canvaskit/skwasm_st.js.symbols": "c7e7aac7cd8b612defd62b43e3050bdd",
"canvaskit/skwasm_st.wasm": "56c3973560dfcbf28ce47cebe40f3206",
"favicon.png": "ed92ee53de52b146611d82d1ccf44773",
"flutter.js": "76f08d47ff9f5715220992f993002504",
"flutter_bootstrap.js": "145848a82177ee092eba2d9c30589887",
"icons/Icon-192.png": "4abacf34a41465ef6a0f422e25169145",
"icons/Icon-512.png": "f887358779c753429d92a634f2cf5694",
"icons/Icon-maskable-192.png": "4abacf34a41465ef6a0f422e25169145",
"icons/Icon-maskable-512.png": "f887358779c753429d92a634f2cf5694",
"index.html": "f57adfce5a908d681bb401c66d1f7d74",
"/": "f57adfce5a908d681bb401c66d1f7d74",
"main.dart.js": "89e09dd656324193ea08b5cc4180df32",
"manifest.json": "1d9868708e0672c34e871275c0f54913",
"splash/img/branding-1x.png": "8a2d5c09aa472af58f52146787154e39",
"splash/img/dark-1x.png": "53c1dabf290b97cbb157a771bcce9c60",
"splash/img/dark-2x.png": "aa7e9b7690bf8e5159b4dde28e193436",
"splash/img/dark-3x.png": "028cc1958310a3b847afa278386d6eee",
"splash/img/dark-4x.png": "5213fa399bbaa80ced6e846c69d00b39",
"splash/img/light-1x.png": "73e1610397ff5ba920d6baf5499696d0",
"splash/img/light-2x.png": "4abacf34a41465ef6a0f422e25169145",
"splash/img/light-3x.png": "a6ee9b0bdf1d9e3c68338dab75faaf1f",
"splash/img/light-4x.png": "8d0314895c324960cc90ddc930f76a21",
"version.json": "fc8d7f05af45ce0935705f89f2a7fbc2"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
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
