/** Bundled classic worker: MediaPipe's WASM loader uses importScripts(). */
export async function loadHandWorker():Promise<Worker>{
 const base=new URL(import.meta.env.BASE_URL,document.baseURI);
 const worker=new Worker(new URL('workers/hand-worker.js',base));
 try{await new Promise<void>((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(new Error('Hand tracking took too long to initialize. Refresh and try again.')),45000);
  const fail=(message:string)=>{clearTimeout(timeout);reject(new Error(message));};
  worker.onmessage=e=>{if(e.data.type==='ready'){clearTimeout(timeout);resolve();}else if(e.data.type==='error'){fail(`Hand tracking could not initialize: ${e.data.message||'model startup failed'}`);}};
  worker.onerror=()=>fail('The hand worker could not start. Try opening this page in a recent Chrome or Edge.');
  worker.postMessage({type:'init',wasmPath:new URL('vendor/mediapipe/',base).href,modelPath:new URL('models/hand_landmarker.task',base).href});
 });return worker;}catch(error){worker.terminate();throw error;}
}
export async function checkHandModel(){const worker=await loadHandWorker();worker.terminate();}
