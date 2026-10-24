import * as THREE from 'three';
import {BallPhysics,TABLE,BALL,type PhysicsEvent} from './ball-physics';

export function createTennis3D(court:HTMLElement,paddleButton:HTMLButtonElement,onStatus:(s:string)=>void) {
 const canvas=document.createElement('canvas');canvas.className='tennis-canvas';canvas.setAttribute('role','img');canvas.setAttribute('aria-label','A three-dimensional table tennis table, raised net, two paddles and a white ball. Activate the near paddle to play.');
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
 court.prepend(canvas);court.classList.add('webgl-ready');
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(37,1,.1,30);
 scene.add(new THREE.HemisphereLight(0xfffbef,0x788975,2.4));
 const sun=new THREE.DirectionalLight(0xfff8e9,3.8);sun.position.set(-3,6,3);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-2.8;sun.shadow.camera.right=2.8;sun.shadow.camera.top=2.8;sun.shadow.camera.bottom=-2.8;sun.shadow.normalBias=.012;sun.shadow.bias=-.0002;sun.shadow.radius=3;scene.add(sun);
 const fill=new THREE.DirectionalLight(0xe2eced,1.2);fill.position.set(3,2,-3);scene.add(fill);
 const material=(color:string,roughness=.6,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 function box(w:number,h:number,d:number,mat:THREE.Material,x:number,y:number,z:number){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;}
 const green=material('#426e60',.48),edge=material('#29483d',.54),metal=material('#6f8170',.3,.72),rubber=material('#343e32',.9),white=material('#e8eee0',.65);
 const deck=box(TABLE.width,.035,TABLE.length,green,0,TABLE.height-.0175,0);
 box(TABLE.width+.008,.034,TABLE.length+.01,edge,0,TABLE.height-.046,0);
 const inset=.015,lineWidth=.013;
 for(const x of [-TABLE.width/2+inset,TABLE.width/2-inset])box(lineWidth,.0015,TABLE.length-.025,white,x,TABLE.height+.001,0);
 for(const z of [-TABLE.length/2+inset,TABLE.length/2-inset])box(TABLE.width-.025,.0015,lineWidth,white,0,TABLE.height+.001,z);
 box(.003,.0015,TABLE.length-.025,white,0,TABLE.height+.002,0);
 for(const x of [-.62,.62])for(const z of [-1.08,1.08]){
  box(.04,.66,.04,metal,x,.37,z);box(.052,.026,.065,rubber,x,.026,z);
 }
 for(const z of [-1.08,1.08]){box(1.28,.045,.035,metal,0,.27,z);box(1.28,.055,.035,edge,0,.67,z);}
 for(const x of [-.62,.62])box(.035,.04,2.19,metal,x,.45,0);
 // Thin real mesh lines, upright in the same world as the ball and tabletop.
 const meshPoints:number[]=[];
 for(let x=-.8;x<=.8;x+=.017){meshPoints.push(x,TABLE.height,0,x,TABLE.height+TABLE.netHeight,0);}
 for(let y=TABLE.height;y<=TABLE.height+TABLE.netHeight;y+=.016){meshPoints.push(-.8,y,0,.8,y,0);}
 const netGeometry=new THREE.BufferGeometry();netGeometry.setAttribute('position',new THREE.Float32BufferAttribute(meshPoints,3));
 const net=new THREE.LineSegments(netGeometry,new THREE.LineBasicMaterial({color:'#9da996',transparent:true,opacity:.8}));scene.add(net);
 const netSheet=new THREE.Mesh(new THREE.PlaneGeometry(1.6,TABLE.netHeight),new THREE.MeshStandardMaterial({color:'#354738',transparent:true,opacity:.16,side:THREE.DoubleSide,roughness:1}));netSheet.position.set(0,TABLE.height+TABLE.netHeight/2,0);scene.add(netSheet);
 box(1.64,.009,.013,white,0,TABLE.height+TABLE.netHeight,0);
 for(const x of [-.81,.81]){box(.018,.19,.022,metal,x,TABLE.height+.075,0);box(.08,.019,.04,metal,x,TABLE.height-.015,0);}
 // A fine rubber surface on the paddle faces, with laminated wood at the rim.
 const textureCanvas=document.createElement('canvas');textureCanvas.width=textureCanvas.height=128;const tc=textureCanvas.getContext('2d')!;tc.fillStyle='#e5e5e5';tc.fillRect(0,0,128,128);tc.fillStyle='#777';for(let x=4;x<128;x+=8)for(let y=4;y<128;y+=8){tc.beginPath();tc.arc(x,y,1.2,0,Math.PI*2);tc.fill();}const grain=new THREE.CanvasTexture(textureCanvas);grain.wrapS=grain.wrapT=THREE.RepeatWrapping;grain.repeat.set(2,2);
 const wood=material('#c69e68',.5),laminate=material('#66503b',.6);
 const paddles:THREE.Group[]=[];
 function paddle(faceColor:string){const g=new THREE.Group();const rim=new THREE.Mesh(new THREE.CylinderGeometry(.137,.137,.017,56),wood);rim.rotation.x=Math.PI/2;rim.scale.z=1.12;g.add(rim);
  for(const side of [-1,1]){const layer=new THREE.Mesh(new THREE.CylinderGeometry(.131,.131,.003,56),laminate);layer.rotation.x=Math.PI/2;layer.scale.z=1.12;layer.position.z=side*.0095;g.add(layer);const face=new THREE.Mesh(new THREE.CylinderGeometry(.128,.128,.004,56),new THREE.MeshStandardMaterial({color:faceColor,roughness:.82,bumpMap:grain,bumpScale:.0008}));face.rotation.x=Math.PI/2;face.scale.z=1.12;face.position.z=side*.013;g.add(face);}
  const handle=new THREE.Mesh(new THREE.BoxGeometry(.044,.19,.027),wood);handle.position.y=-.205;g.add(handle);for(const x of [-.013,.013]){const stripe=new THREE.Mesh(new THREE.BoxGeometry(.003,.18,.028),laminate);stripe.position.set(x,-.205,0);g.add(stripe);}
  g.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;}});scene.add(g);paddles.push(g);return g;
 }
 const near=paddle('#324f42'),far=paddle('#a45d4d');near.position.set(.19,.94,1.12);near.rotation.set(-.16,-.14,-.26);far.position.set(-.12,1.02,-1.27);far.rotation.set(.16,.1,Math.PI+.2);
 // Actual sphere geometry: lighting/specular response stays coherent as it moves.
 const ball=new THREE.Mesh(new THREE.SphereGeometry(BALL.radius,40,28),new THREE.MeshPhysicalMaterial({color:'#fffdf1',roughness:.34,metalness:0,clearcoat:.18,clearcoatRoughness:.5}));ball.castShadow=true;ball.receiveShadow=true;scene.add(ball);
 const seam=new THREE.Mesh(new THREE.TorusGeometry(BALL.radius+.0001,.00017,4,80),material('#e6e8df',.7));ball.add(seam);seam.rotation.x=.7;
 const bounceRing=new THREE.Mesh(new THREE.RingGeometry(.023,.025,40),new THREE.MeshBasicMaterial({color:'#f1efcf',transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));bounceRing.rotation.x=-Math.PI/2;scene.add(bounceRing);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(15,15),new THREE.ShadowMaterial({opacity:.13}));floor.rotation.x=-Math.PI/2;floor.position.y=.004;floor.receiveShadow=true;scene.add(floor);
 const physics=new BallPhysics();let disposed=false,visible=false,last=0,frame=0,accumulator=0,bounceAt=-10,ringAt=-10,nearAt=-10,farAt=-10,clock=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const status=onStatus;
 function handleEvent(e:PhysicsEvent){
  if(e.type==='table'){bounceAt=clock;ringAt=clock;bounceRing.position.set(e.x,TABLE.height+.004,e.z);court.dataset.tableContacts=String(physics.tableBounces);court.dataset.lastContactHeight=String(e.y);}
  if(e.type==='far-paddle'){farAt=clock;status('Back to you.');}
  if(e.type==='near-paddle'){nearAt=clock;status('A soft landing.');}
  if(e.type==='rest'){paddleButton.removeAttribute('aria-disabled');status('On the table. Your turn again.');}
 }
 function serve(){if(!physics.serve())return;nearAt=clock;paddleButton.setAttribute('aria-disabled','true');court.dataset.tableContacts='0';status('Across the net.');if(!frame&&visible)frame=requestAnimationFrame(render);}
 function place(){ball.position.set(physics.x,physics.y,physics.z);const impact=Math.max(0,1-(clock-bounceAt)/.095);const squash=impact>0?Math.sin(impact*Math.PI)*.14:0;ball.scale.set(1+squash,1-squash,1+squash);ball.rotation.y+=physics.active?.035:0;
  const nearSwing=Math.max(0,1-(clock-nearAt)/.35),farSwing=Math.max(0,1-(clock-farAt)/.3);
  near.rotation.z=-.26+Math.sin(nearSwing*Math.PI)*.42;far.rotation.z=Math.PI+.2-Math.sin(farSwing*Math.PI)*.3;
  // The far paddle follows the incoming ball; contacts occur on its visible face.
  const incoming=physics.active&&physics.phase==='out';far.position.x=THREE.MathUtils.lerp(far.position.x,incoming?physics.x:-.12,.13);far.position.y=THREE.MathUtils.lerp(far.position.y,incoming?Math.max(.9,physics.y):1.02,.17);
  near.position.x=THREE.MathUtils.lerp(near.position.x,physics.phase==='back'||!physics.active?physics.x:.19,.15);near.position.y=THREE.MathUtils.lerp(near.position.y,physics.phase==='back'?Math.max(.86,physics.y):.94,.16);near.position.z=THREE.MathUtils.lerp(near.position.z,physics.active?1.26:physics.z+.045,.18);
  const ringAge=clock-ringAt;bounceRing.visible=ringAge<.35&&!reduced.matches;if(bounceRing.visible){bounceRing.scale.setScalar(1+ringAge*2.2);(bounceRing.material as THREE.MeshBasicMaterial).opacity=.25*(1-ringAge/.35);}
  const projected=near.position.clone().project(camera);const px=(projected.x*.5+.5)*court.clientWidth,py=(-projected.y*.5+.5)*court.clientHeight;paddleButton.style.left=`${px}px`;paddleButton.style.top=`${py}px`;
 }
 function render(t:number){frame=0;if(disposed||!visible)return;const dt=last?Math.min((t-last)/1000,.05):0;last=t;clock+=dt;accumulator+=dt;
  while(accumulator>=1/240){physics.step(1/240).forEach(handleEvent);accumulator-=1/240;}place();renderer.render(scene,camera);
  // Idle renders are limited to interaction/resize/visibility changes.
  if(physics.active||clock-nearAt<.5||clock-farAt<.5)frame=requestAnimationFrame(render);else last=0;
 }
 function draw(){if(visible&&!frame)frame=requestAnimationFrame(render);}
 function resize(){const width=court.clientWidth,height=court.clientHeight;renderer.setSize(width,height,false);camera.aspect=width/height;const mobile=innerWidth<601;camera.position.set(mobile?2.9:3.0,mobile?3.25:3.0,mobile?4.5:4.15);camera.lookAt(0,.52,0);camera.updateProjectionMatrix();draw();}
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(court);
 const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible)draw();else{cancelAnimationFrame(frame);frame=0;}},{threshold:.02});visibility.observe(court);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else draw();});
 function dispose(){disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();visibility.disconnect();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.LineSegments){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose());}});grain.dispose();renderer.dispose();}
 window.addEventListener('pagehide',dispose,{once:true});resize();
 return {serve};
}
