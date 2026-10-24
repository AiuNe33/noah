import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.wasm':'application/wasm'};
const server=createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const target=resolve(root,'.'+pathname);if(target!==resolve(root)&&!target.startsWith(resolve(root)+sep)){res.writeHead(403).end();return;}const file=(await stat(target)).isDirectory()?resolve(target,'index.html'):target;res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(await readFile(file));}catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'Port 4173 is busy. Close the other preview and try again.':error.message);process.exitCode=1;});
server.listen(4173,'127.0.0.1',()=>console.log('\nNOAH preview: http://127.0.0.1:4173\nOpen this URL in your browser. Keep this window open. Press Ctrl+C to stop.\n'));
