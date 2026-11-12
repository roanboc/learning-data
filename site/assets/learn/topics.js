/* Learning Data: the Topics page's two views, and the search of every film's words. The page's words and links are in its
   HTML, so this file holds none.
   - The views: the learning route (section#route, drawn by route.js) and the list (#list). Without this script the page is the
     list. The switch (.view-switch) picks one and keeps the choice in this browser ("ld-topics:view"); a first visit gets the
     route. #route and #list pick a view; a topic's link (#data-governance, as every breadcrumb has it) shows the list with
     that topic's row open.
   - Each row's ring (.ix-ring) shows how many of the topic's films were watched, from the same keys path.js reads.
   - The search (#ix-q) reads assets/learn/search.<lang>.json (data-index) the first time someone types: every film's title,
     series, topic, intro and captions. A result names the film and the lines that say the words, each a link to that second
     of the film (#t=). Words match from their start, with or without accents; if nothing says a word, it is shortened until
     something does ("agentic" finds "agent"), and the page says so. */
(()=>{"use strict";
const list=document.getElementById("list");if(!list)return;
const route=document.getElementById("route"),sw=document.querySelector(".view-switch");
const get=k=>{try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}};
const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
const rows=[...list.querySelectorAll("section.topic")],row=id=>rows.find(r=>r.id===id);
const q=document.getElementById("ix-q"),tools=list.querySelector(".ix-tools"),out=document.getElementById("ix-results"),cnt=document.getElementById("ix-count");

// ---- each row's ring: the share of its films that were watched
function rings(){rows.forEach(r=>{let n=0,of=0;
  r.querySelectorAll(".tc-progress").forEach(p=>{const ps=p.dataset.films?p.dataset.films.split(" "):p.dataset.progress?[p.dataset.progress]:[];
    of+=ps.length;n+=ps.filter(x=>get(x+":watched")===true).length;});
  const ring=r.querySelector(".ix-ring");if(ring)ring.style.setProperty("--f",of?n/of:0);});}

// ---- the two views
const canRoute=!!(route&&sw&&window.LD_ROUTE);
function show(view,keep){
  if(!canRoute)view="list";
  if(route)route.hidden=view!=="route";list.hidden=view!=="list";
  if(sw)sw.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.view===view));
  if(!keep)set("ld-topics:view",view);}
function fromHash(){
  let h="";try{h=decodeURIComponent(location.hash.slice(1));}catch(e){}
  const r=h&&row(h);
  if(r){if(q&&q.value){q.value="";search();}show("list",true);r.querySelector("details").open=true;r.scrollIntoView();return true;}
  if(h==="list"||h==="route"){show(h,true);return true;}
  return false;}
if(sw){sw.hidden=!canRoute;sw.addEventListener("click",e=>{const b=e.target.closest("[data-view]");if(!b)return;
  show(b.dataset.view);history.replaceState(null,"",location.pathname+location.search+"#"+b.dataset.view);});}
if(!fromHash())show(get("ld-topics:view")==="list"?"list":"route",true);
window.addEventListener("hashchange",fromHash);
rings();window.addEventListener("pageshow",e=>{if(e.persisted)rings();});

// ---- the search
if(!q||!out)return;
tools.hidden=false;
const X=JSON.parse(q.dataset.text),base=q.dataset.base||"",root=q.dataset.root||"";
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const norm=s=>String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const AC={a:"aáàäâ",e:"eéèëê",i:"iíìïî",o:"oóòöô",u:"uúùüû",n:"nñ",c:"cç"};
// a word, from its start, with or without accents, in the text as it is written
const rx=w=>new RegExp("(^|[^\\p{L}\\p{N}])("+[...w].map(c=>AC[c]?"["+AC[c]+"]":c.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("")+")","giu");
const has=(text,w)=>{const i=text.indexOf(w);if(i<0)return false;if(i===0||!/[a-z0-9]/.test(text[i-1]))return true;return new RegExp("(^|[^a-z0-9])"+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).test(text);};
const mark=(s,ws)=>{let h=esc(s);ws.forEach(w=>{h=h.replace(rx(w),"$1<mark>$2</mark>");});return h;};
const clock=t=>Math.floor(t/60)+":"+String(t%60).padStart(2,"0");
let IDX=null,wait=null,timer=0;
function load(){
  if(!wait)wait=fetch(q.dataset.index).then(r=>{if(!r.ok)throw new Error(r.status);return r.json();}).then(d=>{
    d.films.forEach(f=>{f.T=norm(f.t);f.S=norm(f.s+" "+f.m);f.X=norm(f.x);f.C=f.c.map(c=>norm(c[1]));f.A=f.T+" "+f.S+" "+f.X+" "+f.C.join(" ");});
    d.groups.forEach(g=>{g.T=norm(g.t);g.A=g.T+" "+norm(g.x);});IDX=d;}).catch(()=>{IDX=false;});
  return wait;}
// A word few films say counts for more than one they all say ("contract" over "data"), and the words said together count most.
function find(ws,phrase){
  const N=IDX.films.length,wt={};ws.forEach(w=>{wt[w]=Math.log(1+N/(IDX.films.filter(f=>has(f.A,w)).length||1));});
  const films=[],groups=IDX.groups.filter(g=>ws.every(w=>has(g.A,w))).sort((a,b)=>ws.some(w=>has(b.T,w))-ws.some(w=>has(a.T,w)));
  IDX.films.forEach(f=>{if(!ws.every(w=>has(f.A,w)))return;
    let score=0;const said=[];
    ws.forEach(w=>{score+=wt[w]*((has(f.T,w)?50:0)+(has(f.S,w)?15:0)+(has(f.X,w)?10:0));});
    f.C.forEach((c,i)=>{let v=0;ws.forEach(w=>{if(has(c,w))v+=wt[w];});if(v){if(phrase&&c.includes(phrase))v*=3;said.push([v,i]);}});
    said.sort((a,b)=>b[0]-a[0]||a[1]-b[1]);
    score+=said.slice(0,8).reduce((a,x)=>a+x[0],0)*2;
    films.push({f:f,score:score,said:said.slice(0,3).sort((a,b)=>a[1]-b[1]).map(x=>f.c[x[1]])});});
  films.sort((a,b)=>b.score-a.score);
  return{films:films,groups:groups};}
const STOP=new Set("a an and the of to in on for is it de la el los las un una y en que del con por para es lo al".split(" "));
function search(){
  const text=q.value.trim(),all=[...new Set(norm(text).split(/[^a-z0-9]+/).filter(w=>w.length>1))];
  const kept=all.filter(w=>!STOP.has(w)),ws=kept.length?kept:all,phrase=all.length>1?norm(text).replace(/[^a-z0-9]+/g," ").trim():"";
  const on=ws.length>0;
  list.querySelectorAll(".ix-group").forEach(g=>{g.hidden=on;});out.hidden=!on;cnt.hidden=!on;
  if(!on){out.innerHTML="";cnt.textContent="";return;}
  if(IDX===null){cnt.textContent=X.loading;load().then(search);return;}
  if(IDX===false){cnt.textContent=X.off;out.innerHTML="";return;}
  let use=ws,res=find(ws,phrase),near="";
  if(!res.films.length){
    // no film says it: shorten each word no film says, until one does ("agentic" finds "agent"), and say so
    const short=ws.map(w=>{let v=w;while(v.length>4&&!IDX.films.some(f=>has(f.A,v)))v=v.slice(0,-1);return v;});
    if(short.join(" ")!==ws.join(" ")){const r2=find(short,"");
      if(r2.films.length){near=fill(X.near,{q:text,s:short.join(" ")});use=short;res={films:r2.films,groups:res.groups.concat(r2.groups.filter(g=>!res.groups.includes(g)))};}}}
  const n=res.films.length;
  if(!n&&!res.groups.length){cnt.textContent=fill(X.none,{q:text});out.innerHTML="";return;}
  cnt.textContent=(near?near+" ":"")+(n?(n===1?X.film1:fill(X.films,{n:n})):"");
  let h="";
  if(res.groups.length)h+='<h2>'+esc(X.topics)+'</h2><ul class="ix-links">'+res.groups.slice(0,6).map(g=>
    '<li><a href="'+esc(g.k==="topic"?"#"+g.u.split("#")[1]:base+g.u)+'"><span>'+mark(g.t,use)+'</span><small>'+esc(g.k==="topic"?X.topic:X.series)+'</small></a></li>').join("")+'</ul>';
  if(n)h+='<h2>'+esc(n===1?X.film1:fill(X.films,{n:n}))+'</h2><ul class="ix-hits">'+res.films.slice(0,40).map(r=>{const f=r.f,u=esc(base+f.u);
    return '<li class="ix-hit"><a href="'+u+'" tabindex="-1" aria-hidden="true"><img src="'+esc(root+"assets/"+f.p)+'" alt="" width="1280" height="720" loading="lazy"></a><div><h3><a href="'+u+'">'+mark(f.t,use)+'</a></h3>'+
      '<p class="ix-in">'+mark([f.s,f.m].filter(Boolean).join(" · "),use)+'</p>'+
      (r.said.length?'<ul class="ix-said" aria-label="'+esc(X.said)+'">'+r.said.map(c=>'<li><a href="'+u+'#t='+c[0]+'"><b>'+clock(c[0])+'</b><span>'+mark(c[1],use)+'</span></a></li>').join("")+'</ul>':
        '<p class="ix-x">'+mark(f.x,use)+'</p>')+'</div></li>';}).join("")+'</ul>';
  out.innerHTML=h;}
q.addEventListener("input",()=>{clearTimeout(timer);timer=setTimeout(search,140);});
q.addEventListener("focus",load,{once:true});
q.addEventListener("keydown",e=>{if(e.key==="Escape"&&q.value){q.value="";search();}});
})();
