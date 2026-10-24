import test from 'node:test';import assert from 'node:assert/strict';
import {SwipeDetector} from '../src/swipe.ts';
function run(points,level='responsive'){const d=new SwipeDetector(),events=[];points.forEach((p,i)=>{const a=d.update(p,i*50,level);if(a)events.push(a);});return{d,events};}
test('small deliberate wave triggers responsive mode within 200 ms',()=>{const {events}=run([0,.04,.09,.14,.18].map(x=>({x:.3+x,y:.5})));assert.deepEqual(events,['right']);});
test('normal tracking jitter never triggers a swipe',()=>{const {events}=run(Array.from({length:60},(_,i)=>({x:.5+(i%2?.008:-.008),y:.5+(i%3)*.003})));assert.deepEqual(events,[]);});
test('a single prolonged wave triggers only once',()=>{const {events}=run(Array.from({length:25},(_,i)=>({x:.1+i*.025,y:.5})));assert.deepEqual(events,['right']);});
test('a settled hand rearms for a second wave after a short pause',()=>{const sequence=[.2,.24,.29,.34,.38,...Array(10).fill(.38),.34,.29,.24,.20];const {events}=run(sequence.map(x=>({x,y:.5})));assert.deepEqual(events,['right','left']);});
test('hand loss does not create a jump gesture on reacquisition',()=>{const d=new SwipeDetector();d.update({x:.1,y:.5},0);d.update(null,400);assert.equal(d.update({x:.9,y:.5},450),null);});
