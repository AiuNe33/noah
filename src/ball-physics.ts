/** Metres, seconds and kilograms. Y is height; Z runs along the table. */
export const TABLE = {width:1.525,length:2.74,height:.76,netHeight:.1525};
export const BALL = {radius:.02,mass:.0027,restitution:.86,drag:.12};
export type PhysicsEvent = {type:'table'|'net'|'far-paddle'|'near-paddle'|'floor'|'rest';x:number;y:number;z:number;speedBefore:number;speedAfter:number};
export class BallPhysics {
 x=.19;y=TABLE.height+BALL.radius;z=1.08;vx=0;vy=0;vz=0;
 active=false;phase:'out'|'back'|'settle'='out';time=0;tableBounces=0;
 serve(){if(this.active)return false;this.y=TABLE.height+BALL.radius;this.vx=-this.x*.8;this.vy=3.2;this.vz=-(this.z+.9)/.58;this.active=true;this.phase='out';this.time=0;this.tableBounces=0;return true;}
 step(dt:number):PhysicsEvent[]{
  const events:PhysicsEvent[]=[];if(!this.active)return events;
  const count=Math.ceil(Math.min(dt,.1)/(1/240)),h=Math.min(dt,.1)/count;
  for(let i=0;i<count;i++){
   const prev={x:this.x,y:this.y,z:this.z};this.time+=h;
   const speed=Math.hypot(this.vx,this.vy,this.vz),drag=BALL.drag*speed;
   this.vx*=Math.exp(-drag*h);this.vz*=Math.exp(-drag*h);this.vy=(this.vy-9.81*h)*Math.exp(-drag*h);
   this.x+=this.vx*h;this.y+=this.vy*h;this.z+=this.vz*h;
   const surface=TABLE.height+BALL.radius;
   if(prev.y>=surface-1e-8&&this.y<=surface&&this.vy<0){
    const fraction=(prev.y-surface)/(prev.y-this.y),cx=prev.x+(this.x-prev.x)*fraction,cz=prev.z+(this.z-prev.z)*fraction;
    if(Math.abs(cx)<TABLE.width/2-BALL.radius&&Math.abs(cz)<TABLE.length/2-BALL.radius){
     const before=Math.abs(this.vy);this.vy=before*BALL.restitution;this.vx*=.985;this.vz*=.985;
     // Resolve at the exact tabletop plane, then advance the remaining fraction.
     this.y=surface+this.vy*h*(1-fraction);this.tableBounces++;
     events.push({type:'table',x:cx,y:TABLE.height,z:cz,speedBefore:before,speedAfter:this.vy});
     if(this.phase==='settle'&&this.vy<.16){this.y=surface;this.vx=this.vy=this.vz=0;this.active=false;events.push({type:'rest',x:this.x,y:this.y,z:this.z,speedBefore:before,speedAfter:0});break;}
    }
   }
   // Swept collision with the upright net (including ball radius).
   if(prev.z*this.z<0){const f=prev.z/(prev.z-this.z),netY=prev.y+(this.y-prev.y)*f;
    if(netY-BALL.radius<TABLE.height+TABLE.netHeight&&Math.abs(this.x)<TABLE.width/2){const before=Math.abs(this.vz);this.z=Math.sign(prev.z)*BALL.radius;this.vz*=-.35;events.push({type:'net',x:this.x,y:netY,z:0,speedBefore:before,speedAfter:Math.abs(this.vz)});}
   }
   if(this.phase==='out'&&this.z<=-1.23&&this.vz<0&&this.y>surface){
    const before=Math.hypot(this.vx,this.vy,this.vz);this.z=-1.23;this.vz=3.8;this.vy=2.25;this.vx=.05;this.phase='back';events.push({type:'far-paddle',x:this.x,y:this.y,z:this.z,speedBefore:before,speedAfter:Math.hypot(this.vx,this.vy,this.vz)});
   }else if(this.phase==='back'&&this.z>=1.22&&this.vz>0&&this.y>surface){
    const before=Math.hypot(this.vx,this.vy,this.vz);this.z=1.22;this.vz=-.18;this.vy=-.35;this.vx=0;this.phase='settle';events.push({type:'near-paddle',x:this.x,y:this.y,z:this.z,speedBefore:before,speedAfter:Math.hypot(this.vy,this.vz)});
   }
   if(this.y<BALL.radius){const before=Math.abs(this.vy);this.y=BALL.radius;this.vy=before*.65;events.push({type:'floor',x:this.x,y:0,z:this.z,speedBefore:before,speedAfter:this.vy});if(this.vy<.15){this.active=false;events.push({type:'rest',x:this.x,y:this.y,z:this.z,speedBefore:before,speedAfter:0});}}
  }
  return events;
 }
}
