/// <reference lib="webworker" />
import {FilesetResolver, HandLandmarker} from '@mediapipe/tasks-vision';
let detector: HandLandmarker | null = null;
self.onmessage = async (event: MessageEvent) => {
 try {
  if(event.data.type==='init') {
   const vision = await FilesetResolver.forVisionTasks(event.data.wasmPath);
   detector = await HandLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:event.data.modelPath,delegate:'CPU'},runningMode:'VIDEO',numHands:1,minHandDetectionConfidence:.5,minHandPresenceConfidence:.5,minTrackingConfidence:.5});
   // Verify inference without requesting the camera or using personal imagery.
   const canvas = new OffscreenCanvas(64,64);const ctx=canvas.getContext('2d')!;ctx.fillStyle='#808080';ctx.fillRect(0,0,64,64);
   const frame=canvas.transferToImageBitmap();try{detector.detectForVideo(frame,0);}finally{frame.close();}
   self.postMessage({type:'ready'});
  } else if(event.data.type==='frame'&&detector) {
   const frame:ImageBitmap=event.data.frame;
   try {const result=detector.detectForVideo(frame,event.data.time);const hand=result.landmarks[0];self.postMessage({type:'point',time:event.data.time,point:hand?{x:1-(hand[0].x+hand[5].x+hand[9].x+hand[13].x+hand[17].x)/5,y:(hand[0].y+hand[5].y+hand[9].y+hand[13].y+hand[17].y)/5}:null});}finally{frame.close();}
  }
 }catch(error){self.postMessage({type:'error',message:error instanceof Error?error.message:String(error)});}
};
