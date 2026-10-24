import './style.css';
import './refinements.css';
import './art-direction.css';
import './tennis3d.css';
import './home-hands.css';
import {tableArt} from './scene-table';
import {media, type Photo} from './media';

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s)!;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const chapters = ['home','table-tennis','violin','travel','music'];
let current = 0, travelIndex = 0, artist = 'nabi', musicIndex = 0;
const arrow = '<span aria-hidden="true">↗</span>';
function photo(p: Photo, cls = '', eager = false) {
 return `<button class="photo ${cls}" data-full="${p.src}" aria-label="Enlarge: ${p.alt}"><img src="${p.src}" alt="${p.alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"><span class="enlarge" aria-hidden="true">↗</span></button>`;
}
$('#app').innerHTML = `
<a class="skip" href="#table-tennis">Skip to interests</a>
<header><a class="wordmark" href="#home" aria-label="NOAH, home">n<span>o</span>ah<span class="brand-dot">.</span></a><nav aria-label="Chapters"><a href="#table-tennis">Play</a><a href="#violin">Violin</a><a href="#travel">Travel</a><a href="#music">Music</a></nav><a class="header-note" href="#about">A little about me ${arrow}</a></header>
<main>
<section class="hero" id="home" aria-labelledby="hero-title">
 <div class="hero-top"><span class="eyebrow"><i></i> A SMALL INTERACTIVE WORLD</span><span class="edition">PERSONAL EXPLORATIONS — VOL. 01</span></div>
 <div class="hero-heading"><h1 id="hero-title">NOAH</h1><div class="name"><span>Junzhe Cai</span><span class="serif">a work in motion.</span></div></div>
 <div class="hero-world"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span class="world-label label-left">A little curiosity.<br>A lot to explore.</span><span class="world-label label-right">Music, movement,<br>and moments in between.</span><span class="scribble">Who am I?</span><section id="hand-panel" class="home-hand-settings" aria-labelledby="hand-heading"><div class="hand-panel-top"><h3 id="hand-heading">Explore with a wave</h3><span id="home-hand-state">CAMERA OFF</span></div><p>Camera processing stays on your device. No video uploads.</p><label class="sensitivity-control" for="hand-sensitivity">Sensitivity <select id="hand-sensitivity" aria-label="Sensitivity"><option value="balanced">Balanced</option><option value="responsive" selected>Responsive</option><option value="extra">Extra responsive</option></select></label><video id="hand-video" autoplay muted playsinline></video><p id="hand-status" role="status">Wave up/down for chapters, sideways for photos or a hit.</p><button class="primary-button" id="enable-hand">Enable Hand Interaction</button><button class="text-button" id="disable-hand" hidden>Disable Hand Interaction</button><button class="text-button" id="check-hand">Check compatibility (no camera)</button></section></div>
 <div class="hero-bottom"><a class="scroll-link" href="#table-tennis"><span class="circle-arrow">↓</span> SCROLL TO GET TO KNOW ME</a><div class="study">Soochow University<br><span>Data Science and Big Data Technology / DSBD</span></div><span class="small-index">01 — 05</span></div>
</section>
<section id="table-tennis" class="scene tennis" aria-labelledby="tennis-title"><div class="section-top"><span class="eyebrow">01 / MOVEMENT</span><span class="small-label">A LITTLE BACK AND FORTH</span></div><div class="tennis-copy"><h2 id="tennis-title">Let’s <span class="serif">play.</span></h2><p>Sometimes, getting to know someone<br>starts with a simple back and forth.</p><span class="topic">TABLE TENNIS</span></div><div class="court" aria-label="Interactive table tennis scene">${tableArt}<div class="paddle far" aria-hidden="true"><div></div></div><div class="ball-shadow"></div><div class="ping-ball"></div><button class="paddle near" id="paddle" aria-label="Hit the table tennis ball"><span></span></button><span class="court-note">YOUR MOVE ↗</span></div><div class="tennis-bottom"><span class="interaction-hint"><span class="tiny-dot"></span> Click the paddle. See where it goes.</span><span id="rally-status" role="status">Ready when you are.</span></div></section>
<section id="violin" class="scene violin" aria-labelledby="violin-title"><div class="section-top"><span class="eyebrow">02 / RESONANCE</span><span class="small-label">FINDING MY OWN RHYTHM</span></div><div class="editorial-heading"><h2 id="violin-title">In good<br><span class="serif">company.</span></h2><div><span class="topic">VIOLIN</span><p>A few strings. A shared rhythm.<br>A different way to say something.</p></div></div><div class="violin-images"><figure class="violin-main">${photo(media.violin[0])}<figcaption><span>01 — A shared rhythm</span><span>VIOLIN / ON STAGE</span></figcaption></figure><figure class="violin-secondary">${photo(media.violin[1])}<figcaption>02 — Together, on stage</figcaption></figure><span class="violin-aside serif">More than<br>the notes.</span></div></section>
<section id="travel" class="scene travel" aria-labelledby="travel-title"><div class="section-top"><span class="eyebrow">03 / WANDER</span><span class="small-label">A CHANGE OF SCENERY</span></div><div class="travel-layout"><div class="travel-copy"><h2 id="travel-title">Else<span class="serif">where.</span></h2><p>Looking up. Taking the long way.<br>Making space for a different view.</p><span class="topic">TRAVEL / PHOTO NOTES</span><div class="travel-controls"><button id="travel-prev" class="round-button" aria-label="Previous travel photo">←</button><span id="travel-count" aria-live="polite">01 / ${String(media.travel.length).padStart(2,'0')}</span><button id="travel-next" class="round-button" aria-label="Next travel photo">→</button></div><div class="travel-dots" aria-label="Choose travel photo">${media.travel.map((_,i)=>`<button data-travel="${i}" aria-label="Travel photo ${i+1}" aria-pressed="${i===0}"></button>`).join('')}</div><p class="drag-hint">DRAG, SWIPE OR USE THE ARROW KEYS</p></div><figure class="travel-frame" id="travel-frame" tabindex="0" aria-label="Travel gallery. Use left and right arrows.">${photo(media.travel[0])}<figcaption><span id="travel-caption">${media.travel[0].label}</span><span>↗ A CLOSER LOOK</span></figcaption></figure><div class="travel-peek" aria-hidden="true"><img id="travel-peek" src="${media.travel[1].src}" alt="" loading="lazy"></div></div></section>
<section id="music" class="scene music" aria-labelledby="music-title"><div class="section-top"><span class="eyebrow">04 / FEELING</span><span class="small-label">SOME MOMENTS STAY WITH YOU</span></div><div class="editorial-heading"><h2 id="music-title">For the <span class="serif">feeling.</span></h2><p>The lights go down.<br>The world sounds a little different.</p></div><div class="music-layout"><div class="artist-list" role="tablist" aria-label="Music artist"><button role="tab" id="nabi-tab" aria-selected="true" aria-controls="music-panel" data-artist="nabi"><span>01</span>Nabi <span>↗</span></button><button role="tab" id="joker-tab" aria-selected="false" tabindex="-1" aria-controls="music-panel" data-artist="joker"><span>02</span>Joker Xue <span>↗</span></button><div class="music-note"><div class="sound-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><span>MUSIC / LIVE MOMENTS<br>Some things are better felt.</span></div></div><div id="music-panel" role="tabpanel" aria-labelledby="nabi-tab"><figure id="music-photo">${photo(media.nabi[0])}<figcaption><span id="music-label">Nabi</span><div id="music-controls" hidden><button id="music-prev" aria-label="Previous music photo">←</button><span id="music-count">1 / 2</span><button id="music-next" aria-label="Next music photo">→</button></div><span>LIVE / PHOTO NOTES</span></figcaption></figure></div></div></section>
<footer id="about"><span class="eyebrow">A FEW PIECES OF WHO I AM.</span><div class="footer-title">Still <span class="serif">exploring.</span><a href="#home" aria-label="Back to top">↗</a></div><div class="footer-bottom"><span>NOAH / Junzhe Cai</span><span>Soochow University · DSBD</span><span>Made of small moments.</span></div></footer>
</main>
<aside class="scene-nav" aria-label="Scene progress">${chapters.map((c,i)=>`<a href="#${c}" aria-label="${['Home','Table Tennis','Violin','Travel','Music'][i]}" ${i===0?'aria-current="location"':''}><span></span></a>`).join('')}</aside>
<button id="hand-toggle" class="hand-toggle" aria-controls="hand-panel"><span aria-hidden="true">✳</span> Hand interaction <span class="off">OFF</span></button>

<dialog id="lightbox" aria-label="Enlarged photo"><button class="dialog-close" aria-label="Close photo">×</button><img alt=""><p></p></dialog>`;

function go(index: number) { $(`#${chapters[Math.max(0,Math.min(4,index))]}`).scrollIntoView({behavior: reduced.matches?'instant':'smooth'}); }
const observer = new IntersectionObserver(entries => {
 const active = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
 if (!active) return;
 current = chapters.indexOf(active.target.id);
 document.querySelectorAll('.scene-nav a').forEach((a,i)=>i===current?a.setAttribute('aria-current','location'):a.removeAttribute('aria-current'));
 document.querySelectorAll('header nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${chapters[current]}`));
}, {threshold:[.25,.5,.7]});
chapters.forEach(c=>observer.observe($(`#${c}`)));
function updatePhoto(container: HTMLElement, p: Photo) { const b=container.querySelector<HTMLButtonElement>('.photo')!; const img=b.querySelector('img')!; b.dataset.full=p.src; b.setAttribute('aria-label',`Enlarge: ${p.alt}`); img.src=p.src; img.alt=p.alt; img.hidden=false; b.classList.remove('missing'); }
function travel(delta: number, absolute=false) {const count=media.travel.length; travelIndex=(absolute?delta:travelIndex+delta+count)%count; updatePhoto($('#travel-frame'),media.travel[travelIndex]); $('#travel-caption').textContent=media.travel[travelIndex].label; $('#travel-count').textContent=`${String(travelIndex+1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`; $('#travel-peek').setAttribute('src',media.travel[(travelIndex+1)%count].src); document.querySelectorAll('[data-travel]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===travelIndex)));}
$('#travel-prev').addEventListener('click',()=>travel(-1)); $('#travel-next').addEventListener('click',()=>travel(1));
document.querySelectorAll<HTMLElement>('[data-travel]').forEach(b=>b.addEventListener('click',()=>travel(Number(b.dataset.travel),true)));
function music(delta=0) {const photos=media[artist];musicIndex=(musicIndex+delta+photos.length)%photos.length;updatePhoto($('#music-photo'),photos[musicIndex]);$('#music-label').textContent=photos[musicIndex].label;$('#music-controls').hidden=photos.length<2;$('#music-count').textContent=`${musicIndex+1} / ${photos.length}`;$('#music-panel').setAttribute('aria-labelledby',`${artist}-tab`);}
document.querySelectorAll<HTMLButtonElement>('[data-artist]').forEach(b=>{b.addEventListener('click',()=>{artist=b.dataset.artist!;musicIndex=0;document.querySelectorAll<HTMLButtonElement>('[data-artist]').forEach(t=>{t.setAttribute('aria-selected',String(t===b));t.tabIndex=t===b?0:-1;});music();});b.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=$<HTMLButtonElement>(`#${e.key==='Home'?'nabi':e.key==='End'?'joker':artist==='nabi'?'joker':'nabi'}-tab`);next.click();next.focus();}});});
$('#music-prev').addEventListener('click',()=>music(-1));$('#music-next').addEventListener('click',()=>music(1));
let hitting=false;
let tennis3D:{serve:()=>void}|null=null;
// The basic CSS interaction remains available if WebGL cannot initialize.
import('./tennis3d').then(({createTennis3D})=>{
 try{tennis3D=createTennis3D($('.court'),$<HTMLButtonElement>('#paddle'),message=>$('#rally-status').textContent=message);}
 catch{$('#rally-status').textContent='Simple view. Click the paddle to play.';$('.tennis-canvas')?.remove();$('.court').classList.remove('webgl-ready');}
}).catch(()=>{$('#rally-status').textContent='Simple view. Click the paddle to play.';});
function hit(){if(tennis3D){tennis3D.serve();return;}if(hitting)return;hitting=true;$('#paddle').setAttribute('aria-disabled','true');$('.court').classList.add('playing');$('#rally-status').textContent='A little back and forth.';setTimeout(()=>{$('.court').classList.remove('playing');hitting=false;$('#paddle').removeAttribute('aria-disabled');$('#rally-status').textContent='Your turn again.';},reduced.matches?350:1650);}
$('#paddle').addEventListener('click',hit);
let touchStart=0,dragged=false;
$('#travel-frame').addEventListener('pointerdown',(e)=>{touchStart=e.clientX;dragged=false;});
$('#travel-frame').addEventListener('pointerup',(e)=>{if(Math.abs(e.clientX-touchStart)>45){dragged=true;travel(e.clientX<touchStart?1:-1);}});
const lightbox=$<HTMLDialogElement>('#lightbox'); let previousFocus:HTMLElement|null=null;
document.addEventListener('click',e=>{const b=(e.target as HTMLElement).closest<HTMLButtonElement>('.photo');if(!b||dragged){dragged=false;return;}previousFocus=b;const img=b.querySelector('img')!;$('#lightbox img').setAttribute('src',b.dataset.full!);$('#lightbox img').setAttribute('alt',img.alt);$('#lightbox p').textContent=img.alt;lightbox.showModal();});
lightbox.querySelector('button')!.addEventListener('click',()=>lightbox.close());lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});lightbox.addEventListener('close',()=>previousFocus?.focus());
document.addEventListener('error',e=>{const img=e.target;if(img instanceof HTMLImageElement&&img.closest('.photo')){img.hidden=true;img.closest('.photo')!.classList.add('missing');}},true);
document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||(e.target as HTMLElement).closest('input,textarea,select,[contenteditable], [role="tablist"]'))return;
 if(['ArrowDown','PageDown','ArrowUp','PageUp','Home','End'].includes(e.key)){e.preventDefault();go(e.key==='Home'?0:e.key==='End'?4:current+(['ArrowUp','PageUp'].includes(e.key)?-1:1));}
 if(['ArrowLeft','ArrowRight'].includes(e.key)){if(current===3){e.preventDefault();travel(e.key==='ArrowLeft'?-1:1);}else if(current===4){e.preventDefault();music(e.key==='ArrowLeft'?-1:1);}}
});
$('.hero').addEventListener('pointermove',(e)=>{if(reduced.matches||e.pointerType==='touch')return;const x=(e.clientX/innerWidth-.5)*10,y=(e.clientY/innerHeight-.5)*8;$('.hero-world').setAttribute('style',`--px:${x}px;--py:${y}px`);});
$('.hero').addEventListener('pointerleave',()=>$('.hero-world').removeAttribute('style'));
$('#hand-toggle').addEventListener('click',()=>{go(0);setTimeout(()=>$<HTMLButtonElement>(handControl?'#disable-hand':'#enable-hand').focus({preventScroll:true}),reduced.matches?0:450);});
let handControl: {stop:()=>void}|null=null;
function setHandStatus(message:string){const label=$('#hand-status');if(label.textContent!==message)label.textContent=message;}
$('#enable-hand').addEventListener('click',async()=>{const b=$<HTMLButtonElement>('#enable-hand');b.disabled=true;$('#hand-status').textContent='Loading hand interaction…';try {const {startHands}=await import('./hands');handControl=await startHands($<HTMLVideoElement>('#hand-video'),action=>{if(action==='up')go(current-1);else if(action==='down')go(current+1);else if(current===1)hit();else if(current===3)travel(action==='left'?-1:1);else if(current===4)music(action==='left'?-1:1);},(x,y)=>{if(!reduced.matches)$('.hero-world').setAttribute('style',`--px:${x*8}px;--py:${y*6}px`);},setHandStatus,()=>$<HTMLSelectElement>('#hand-sensitivity').value as import('./swipe').Sensitivity);b.hidden=true;$('#disable-hand').hidden=false;$('#hand-toggle .off').textContent='ON';$('#home-hand-state').textContent='CAMERA ON';$('#hand-video').classList.add('enabled');$('#hand-status').textContent='Hand interaction is on. Hold up one hand, then wave.';}catch(error){$('#hand-status').textContent=error instanceof Error?error.message:'Hand interaction is unavailable. You can keep exploring normally.';}finally{b.disabled=false;}});
function stopHands(){handControl?.stop();handControl=null;$('#enable-hand').hidden=false;$('#disable-hand').hidden=true;$('#hand-toggle .off').textContent='OFF';$('#home-hand-state').textContent='CAMERA OFF';$('#hand-video').classList.remove('enabled');$('#hand-status').textContent='Wave up/down for chapters, sideways for photos or a hit.';$('.hero-world').removeAttribute('style');}
$('#disable-hand').addEventListener('click',stopHands);window.addEventListener('pagehide',stopHands);document.addEventListener('visibilitychange',()=>{if(document.hidden&&handControl)stopHands();});

// Animate text leaves independently so photographs and click targets stay steady.
let textSequence = 0;
function floatText(root: Node) {
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const leaves:Text[]=[];
 if(root.nodeType===Node.TEXT_NODE)leaves.push(root as Text);
 while(walker.nextNode())leaves.push(walker.currentNode as Text);
 for(const leaf of leaves){
  if(!leaf.textContent?.trim()||leaf.parentElement?.closest('svg,script,style,select,textarea,.floating-type'))continue;
  const span=document.createElement('span');span.className='floating-type';
  span.style.setProperty('--float-delay',`${-(textSequence++%17)*.47}s`);
  span.style.setProperty('--float-duration',`${7.5+(textSequence%7)*.5}s`);
  leaf.replaceWith(span);span.append(leaf);
 }
}
floatText($('#app'));
const textObserver=new MutationObserver(records=>{
 for(const record of records)for(const node of record.addedNodes)floatText(node);
});
textObserver.observe($('#app'),{childList:true,subtree:true});

$('#check-hand').addEventListener('click',async()=>{
 const check=$<HTMLButtonElement>('#check-hand');const enable=$<HTMLButtonElement>('#enable-hand');check.disabled=true;enable.disabled=true;
 $('#hand-status').textContent='Checking local hand model and inference. Camera stays off…';
 try{const {checkHandModel}=await import('./hands');await checkHandModel();$('#hand-status').textContent='Hand model ready. Compatibility check passed; no camera was used. Click Enable Hand Interaction to continue.';}
 catch(error){$('#hand-status').textContent=error instanceof Error?error.message:'Hand tracking is unavailable in this browser.';}
 finally{check.disabled=false;enable.disabled=false;}
});
