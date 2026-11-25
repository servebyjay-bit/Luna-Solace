/* ============================================================
   EDIT HERE  -  all images are WebP files in the /images folder.
   Every  src / thumb  is a .webp file path.
   Optional: add  cover-banner-sm.webp  (about half the width) for
   phones. If the -sm file is missing, the full file is used.

   TO CHANGE AN IMAGE: save your new .webp into /images, then change
   the name below (or just overwrite the old file with the same name).

   VIDEOS: paste your Vimeo ID (the number in vimeo.com/123456789)
   into  id:  and change the title / note.
   ============================================================ */

/* HERO BANNER (top of the home page). Wide image, about 2400 x 1120 */
const HERO = {src:"images/cover-banner.webp", alt:"Luna sitting beneath a crescent moon"};

/* PHOTOS page: one line per photo. Change the file name in src to change the image.
   To add a photo, copy a line and change its src. To remove one, delete its line. */
const PHOTOS = [
  {src:"images/images content/1.webp"},
  {src:"images/images content/2.webp"},
  {src:"images/images content/3.webp"},
  {src:"images/images content/4.webp"},
  {src:"images/images content/5.webp"},
  {src:"images/images content/6.webp"},
  {src:"images/images content/7.webp"},
  {src:"images/images content/8.webp"},
  {src:"images/images content/9.webp"},
  {src:"images/images content/10.webp"},
  {src:"images/images content/11.webp"},
  {src:"images/images content/12.webp"},
  {src:"images/images content/13.webp"},
  {src:"images/images content/14.webp"},
  {src:"images/images content/15.webp"},
  {src:"images/images content/16.webp"},
  {src:"images/images content/17.webp"},
  {src:"images/images content/18.webp"},
  {src:"images/images content/19.webp"},
  {src:"images/images content/20.webp"}
];

/* VIDEOS page (thumbnail 16:9, about 1280 x 720) */
const VIDEOS = [
  {id:"", t:"Luna at Play",      n:"Add a Vimeo ID to bring this one to life", thumb:"images/video-1-luna-at-play.webp"},
  {id:"", t:"Sleepy Evenings",   n:"Add a Vimeo ID to bring this one to life", thumb:"images/video-2-sleepy-evenings.webp"},
  {id:"", t:"Mimi, Didi & Luna", n:"Add a Vimeo ID to bring this one to life", thumb:"images/video-3-mimi-didi-luna.webp"}
];

/* ---------- WebP image holder ---------- */
const SZ = {
  photo:{w:900,  h:1125, sm:450, sizes:"(min-width:700px) 340px, 92vw"},
  video:{w:1280, h:720,  sm:640, sizes:"(min-width:700px) 420px, 92vw"},
  banner:{w:2400, h:1120, sm:1200, sizes:"100vw"}
};
function pic(base, alt, kind, eager, sizes){
  base=base.replace(/\.webp$/,"");   /* src may be written with or without .webp */
  const z=SZ[kind];
  return `<picture><source type="image/webp" srcset="${base}-sm.webp ${z.sm}w, ${base}.webp ${z.w}w" sizes="${sizes||z.sizes}">`+
         `<img src="${base}.webp" width="${z.w}" height="${z.h}" alt="${alt}" loading="${eager?"eager":"lazy"}" decoding="async" onload="this.classList.add('ld')" onerror="bad(this)"></picture>`;
}
/* if a file is missing: 1) retry the full-size file, 2) look in the other folder
   (images/ <-> same folder as index.html), 3) show the empty holder */
function bad(img){
  const p=img.parentElement, s=p.querySelector("source");
  if(s){ s.remove(); img.src=img.getAttribute("src"); return; }
  const cur=img.getAttribute("src");
  if(!img.dataset.alt){ img.dataset.alt=1; img.src=cur.startsWith("images/")?cur.slice(7):"images/"+cur; return; }
  (p.closest(".frame,.player,.hero")||p.parentElement).classList.add("empty");
}

/* ---------- render ---------- */
document.getElementById("hero").innerHTML=pic(HERO.src,HERO.alt,"banner",true).replace("<img ",'<img class="banner" fetchpriority="high" ');

const grid=document.getElementById("grid");
PHOTOS.forEach((p,i)=>{
  const fig=document.createElement("figure"); fig.className="card";
  fig.innerHTML=`<div class="frame"><div class="ph">${pic(p.src,"Luna photo "+(i+1),"photo")}</div></div>`;
  fig.onclick=()=>openLB(i); grid.appendChild(fig);
});

const vgrid=document.getElementById("vgrid");
VIDEOS.forEach(v=>{
  const d=document.createElement("div"); d.className="vid";
  d.innerHTML=`<div class="player"><div class="ph">${pic(v.thumb,v.t,"video")}</div><div class="play"></div></div><h3>${v.t}</h3><p>${v.n}</p>`;
  d.querySelector(".player").onclick=function(){
    if(!v.id){ this.querySelector(".play").style.transform="scale(.9)"; return; }
    this.innerHTML=`<iframe src="https://player.vimeo.com/video/${encodeURIComponent(v.id)}?autoplay=1&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${v.t}"></iframe>`;
  };
  vgrid.appendChild(d);
});
/* images that were already cached */
document.querySelectorAll(".ph img,.hero img").forEach(i=>{ if(i.complete&&i.naturalWidth) i.classList.add("ld"); });

/* ---------- lightbox ---------- */
const lb=document.getElementById("lb"), box=document.getElementById("lbbox");
let cur=0;
function showLB(i){
  cur=(i+PHOTOS.length)%PHOTOS.length; const p=PHOTOS[cur];
  box.innerHTML=`<div class="lbimg">${pic(p.src,"Luna photo "+(cur+1),"photo",true,"(min-width:700px) 520px, 86vw")}</div>`;
  box.querySelector("img").classList.add("ld");
  box.animate([{opacity:0,transform:"translateY(8px)"},{opacity:1,transform:"none"}],{duration:450,easing:"ease-out"});
}
function openLB(i){
  showLB(i); document.body.style.overflow="hidden";
  lb.classList.add("open"); requestAnimationFrame(()=>lb.classList.add("vis"));
}
function closeLB(){ lb.classList.remove("vis"); document.body.style.overflow=""; setTimeout(()=>lb.classList.remove("open"),450); }
lb.onclick=e=>{ if(e.target===lb) closeLB(); };
document.getElementById("lbx").onclick=closeLB;
document.getElementById("lbp").onclick=()=>showLB(cur-1);
document.getElementById("lbnx").onclick=()=>showLB(cur+1);
document.addEventListener("keydown",e=>{
  if(!lb.classList.contains("open")) return;
  if(e.key==="Escape") closeLB();
  if(e.key==="ArrowLeft") showLB(cur-1);
  if(e.key==="ArrowRight") showLB(cur+1);
});

/* ---------- routing + reveal ---------- */
const pages=["home","photos","videos"];
const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} }),{threshold:.12});
function route(){
  const h=(location.hash||"#home").slice(1); const now=pages.includes(h)?h:"home";
  pages.forEach(p=>{
    const el=document.getElementById(p); el.classList.remove("show");
    if(p===now){ void el.offsetWidth; el.classList.add("show"); }
  });
  document.querySelectorAll("nav a").forEach(a=>a.classList.toggle("on",a.dataset.p===now));
  window.scrollTo({top:0});
  document.querySelectorAll(`#${now} .card, #${now} .vid`).forEach((el,i)=>{ el.classList.remove("in"); el.style.transitionDelay=(i*90)+"ms"; io.observe(el); });
}
window.addEventListener("hashchange",route); route();

/* ---------- theme ---------- */
const tb=document.getElementById("theme"), root=document.documentElement;
const isDark=()=>root.dataset.theme? root.dataset.theme==="dark" : matchMedia("(prefers-color-scheme:dark)").matches;
function sync(){ tb.textContent=isDark()?"☀":"☾"; }
tb.onclick=()=>{ root.dataset.theme=isDark()?"light":"dark"; sync(); };
sync();