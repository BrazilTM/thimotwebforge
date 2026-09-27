const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

function loadEnv() {
  try {
    const lines = fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  } catch {}
}
loadEnv();
const PORT = Number(process.env.PORT || 3000);
const index = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));

async function order(req, res, body) {
  let data;
  try { data = JSON.parse(body || '{}'); } catch { res.writeHead(400, {'Content-Type':'application/json'}); return res.end(JSON.stringify({error:'Invalid JSON'})); }
  const {name,email,discord,package:pkg,details}=data;
  if(!name||!email||!pkg||!details){res.writeHead(400,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:'Missing required fields'}));}
  const webhook=process.env.DISCORD_WEBHOOK_URL;
  if(!webhook){res.writeHead(503,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:'Discord webhook is not configured'}));}
  const safe=v=>String(v??'').slice(0,1000);
  const payload={username:'Thimot WebForge',embeds:[{title:'🛒 New Website Order',color:0x8065ff,fields:[{name:'Customer',value:safe(name),inline:true},{name:'Email',value:safe(email),inline:true},{name:'Discord',value:safe(discord||'Not provided'),inline:true},{name:'Package',value:safe(pkg),inline:true},{name:'Project details',value:safe(details)}],footer:{text:'Thimot WebForge • New project request'},timestamp:new Date().toISOString()}]};
  try { const r=await fetch(webhook,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); if(!r.ok) throw new Error('Discord HTTP '+r.status); res.writeHead(200,{'Content-Type':'application/json'}); res.end(JSON.stringify({ok:true})); }
  catch(e){ console.error(e); res.writeHead(502,{'Content-Type':'application/json'}); res.end(JSON.stringify({error:'Discord delivery failed'})); }
}
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,`http://${req.headers.host}`);
  if(req.method==='GET' && (url.pathname==='/'||url.pathname==='/index.html')){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(index);}
  if(req.method==='POST' && url.pathname==='/api/order'){let b='';req.on('data',c=>{b+=c;if(b.length>20000)req.destroy();});req.on('end',()=>order(req,res,b));return;}
  res.writeHead(404,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Not found'}));
});
server.listen(PORT,()=>console.log(`Thimot WebForge running at http://localhost:${PORT}`));
