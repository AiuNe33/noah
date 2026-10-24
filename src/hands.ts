import {loadHandWorker} from './hand-model';
import {SwipeDetector,type Sensitivity} from './swipe';
export {checkHandModel} from './hand-model';
type Action='up'|'down'|'left'|'right';
export async function startHands(video: HTMLVideoElement, action:(a:Action)=>void, position:(x:number,y:number)=>void, status:(message:string)=>void,sensitivity:()=>Sensitivity=()=> 'responsive') {
 if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia)throw new Error('Hand interaction needs a supported browser on localhost or HTTPS. Keep exploring with mouse, touch or keyboard.');
 if(!window.Worker||!window.createImageBitmap)throw new Error('Hand interaction is unavailable in this browser. Mouse, touch and keyboard still work.');
 let stream:MediaStream|null=null,worker:Worker|null=null,timer:ReturnType<typeof setInterval>|undefined,stopped=false,busy=false;
 const stop=()=>{stopped=true;clearInterval(timer);worker?.terminate();stream?.getTracks().forEach(t=>t.stop());video.srcObject=null;position(0,0);};
 try {
  status('Preparing the locally bundled hand model…');worker=await loadHandWorker();
  status('Hand model ready. Waiting for camera permission…');
  stream=await navigator.mediaDevices.getUserMedia({video:{width:320,height:240,facingMode:'user',frameRate:30},audio:false});video.srcObject=stream;await video.play();
  const swipes=new SwipeDetector();let lastSeen=0;
  worker.onmessage=e=>{busy=false;if(e.data.type==='error'){stop();status('Hand tracking stopped. Disable and enable to try again; mouse, touch and keyboard still work.');return;}
   const {point,time}=e.data;const gesture=swipes.update(point,time,sensitivity());
   if(!point){if(time-lastSeen>350){position(0,0);status('Camera on. Hold one hand in view.');}return;}
   lastSeen=time;status('Hand detected. A small, clear wave is enough.');
   if(swipes.point)position((swipes.point.x-.5)*2,(swipes.point.y-.5)*2);
   if(gesture)action(gesture);
  };
  timer=setInterval(async()=>{if(stopped||busy||video.readyState<2)return;busy=true;try{const frame=await createImageBitmap(video);if(stopped){frame.close();return;}worker!.postMessage({type:'frame',frame,time:performance.now()},[frame]);}catch{busy=false;}},50);
  return {stop};
 }catch(error){stop();if(error instanceof DOMException){if(error.name==='NotAllowedError')throw new Error('Camera access was not allowed. You can still explore everything with mouse, touch or keyboard.');if(error.name==='NotFoundError')throw new Error('No camera was found. Mouse, touch and keyboard still work.');if(error.name==='NotReadableError')throw new Error('The camera is busy or unavailable. Close other camera apps and try again.');}throw error;}
}
