// Pizarra nuevas normas · funciona sin conexión una vez abierta una vez
const CACHE='pizarra-nuevas-normas-v1';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    if(r.mode==='navigate'){ // red primero para recibir actualizaciones; caché si no hay conexión
      e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(k=>k.put('./index.html',c));return res}).catch(()=>caches.match('./index.html')));return}
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(k=>k.put(r,c));return res})));return}
  if(/(^|\.)(googleapis|gstatic)\.com$/.test(u.hostname)){ // tipografías
    e.respondWith(caches.open(CACHE).then(c=>c.match(r).then(m=>{const net=fetch(r).then(res=>{c.put(r,res.clone());return res}).catch(()=>m);return m||net})))}
});
