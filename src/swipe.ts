export type SwipeAction='up'|'down'|'left'|'right';
export type Sensitivity='balanced'|'responsive'|'extra';
type Point={x:number;y:number};
const profiles={
 balanced:{distance:.14,speed:.34,cooldown:650,alpha:.68,stable:130},
 responsive:{distance:.10,speed:.28,cooldown:450,alpha:.78,stable:90},
 extra:{distance:.07,speed:.22,cooldown:350,alpha:.82,stable:70}
};
/** Short trajectory window, intentional displacement and stable-hand rearming. */
export class SwipeDetector{
 point:Point|null=null;level:Sensitivity='responsive';
 private history:(Point&{t:number})[]=[];private cooldown=0;private armed=true;private stableSince:number|null=null;private lastSeen=0;private lastTime=0;
 reset(){this.point=null;this.history=[];this.armed=true;this.stableSince=null;this.lastTime=0;}
 update(raw:Point|null,time:number,level:Sensitivity=this.level):SwipeAction|null{
  if(level!==this.level){this.level=level;this.reset();}
  if(!raw){if(time-this.lastSeen>250)this.reset();return null;}
  if(this.lastSeen&&time-this.lastSeen>250)this.reset();this.lastSeen=time;
  const config=profiles[level],previous=this.point,dt=this.lastTime?Math.max(1,time-this.lastTime)/1000:.05;this.lastTime=time;
  this.point=previous?{x:previous.x*(1-config.alpha)+raw.x*config.alpha,y:previous.y*(1-config.alpha)+raw.y*config.alpha}:raw;
  if(!this.armed){const velocity=previous?Math.hypot(this.point.x-previous.x,this.point.y-previous.y)/dt:0;
   if(velocity<.32){this.stableSince??=time;if(time-this.stableSince>=config.stable){this.armed=true;this.history=[];}}else this.stableSince=null;
   return null;
  }
  this.history.push({...this.point,t:time});this.history=this.history.filter(p=>time-p.t<=280);
  if(time<this.cooldown)return null;
  const first=this.history[0];if(!first||time-first.t<70)return null;
  const dx=this.point.x-first.x,dy=this.point.y-first.y,major=Math.max(Math.abs(dx),Math.abs(dy)),minor=Math.min(Math.abs(dx),Math.abs(dy));
  if(major>=config.distance&&major/((time-first.t)/1000)>=config.speed&&major>minor*1.3){
   this.cooldown=time+config.cooldown;this.armed=false;this.stableSince=null;this.history=[];
   return Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';
  }return null;
 }
}
