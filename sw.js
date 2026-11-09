const V='diario-v1';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','exceljs.min.js','jszip.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return;
  // red primero para la página (así recibe actualizaciones), caché si no hay conexión
  if(r.mode==='navigate'||u.pathname.endsWith('index.html')||u.pathname.endsWith('/')){
    e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(ch=>ch.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{const c=x.clone();caches.open(V).then(ch=>ch.put(r,c));return x})));
});
