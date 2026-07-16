// Service worker do Mais Saude na Rotina
// Estrategia herdada do app Bolao SSGP: cache apenas dos arquivos do site
// (a casca do app). Dados da API nunca sao cacheados, para o conteudo
// sempre refletir o estado real do banco.

const CACHE = "mais-saude-v1";
const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icone-192.png",
  "./icons/icone-512.png",
  "./icons/icone-512-maskable.png"
];

self.addEventListener("install", (ev) => {
  ev.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)));
  self.skipWaiting();
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (ev) => {
  const url = new URL(ev.request.url);
  // So intercepta arquivos do proprio site; API (outro dominio) passa direto.
  if (url.origin !== self.location.origin) return;
  ev.respondWith(
    caches.match(ev.request).then((hit) => hit || fetch(ev.request))
  );
});
