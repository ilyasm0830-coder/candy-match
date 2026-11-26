// CandyMatch Adventure offline support (v4)
const V='cma-v4',CORE=['./','game.html','index.html','privacy.html','manifest.webmanifest','icon-192.png','icon-512.png','bear.webp','kingdom.jpg'];
const clean=async r=>{if(!r.redirected)return r;const b=await r.blob();return new Response(b,{status:r.status,statusText:r.statusText,headers:r.headers})};
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>Promise.allSettled(CORE.map(async u=>{const r=await fetch(u,{cache:'reload'});if(r.ok)await c.put(u,await clean(r))}))))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;const u=new URL(q.url);const imm=u.hostname==='www.gstatic.com';if(u.origin!==location.origin&&!imm)return;
 e.respondWith((async()=>{const c=await caches.open(V),hit=await c.match(q,{ignoreSearch:!imm});if(imm&&hit)return hit;
  try{const net=fetch(q.mode==='navigate'?q.url:q);
   // wait as long as needed when nothing is saved yet; only use the saved copy if the network is slow
   const r=hit?await Promise.race([net,new Promise((_,j)=>setTimeout(j,5000))]):await net;
   if(r.ok){c.put(q,await clean(r.clone()))}return await clean(r)}
  catch(x){if(hit)return hit;try{return await fetch(q)}catch(y){return new Response('Offline',{status:503})}}})())});
