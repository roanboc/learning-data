/* Learning Data: the learning route, a line map of the topics. It draws itself in every [data-route] box, from the data in
   route.<lang>.js (window.LD_ROUTE, made by site-tools/build_series.py from modules/route.json and the topics), so this file holds
   no topic, no link and no word of its own.
   - Wide boxes get the map: the suggested route as one line, and the other groups as loops above and below it. From 1040 px the
     introduction's card sits at its left, as the first station; a box with data-home (the home page, which plays that film) has none.
     Narrow boxes (under 880 px) get the same route as a list with a rail, each topic opening in place: no sideways panning.
   - A station is a button: selecting it shows its films and series below the map. Its ring shows how many of its films were
     watched, from the same keys path.js reads ("<prefix>:watched"), in this browser only.
   - A goal ("I want to…") lights up the stops of its route and numbers them; the map itself never changes. The goal is kept in
     this browser ("ld-route:goal").
   data-base: the way to the language's home, for the films' links; data-root: the way to the site's root, for the posters;
   data-topics: the way to the Topics page ("" on that page itself, where a topic's link opens its row in the list). */
(()=>{"use strict";
const D=window.LD_ROUTE;if(!D||!D.topics||!D.topics.length)return;
const X=D.text,fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const get=k=>{try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}};
const set=(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
const T=id=>D.topics.find(t=>t.id===id),G=id=>D.groups.find(g=>g.id===id);
const ITEM={};D.topics.forEach(t=>t.items.forEach(i=>{ITEM[i.id]=i;i.topic=t.id;}));
const START=D.topics[0],INTRO=START.items[0];
const seen=i=>i.soon?0:i.films.filter(p=>get(p+":watched")===true).length;
const live=t=>t.items.filter(i=>!i.soon),soon=t=>t.items.filter(i=>i.soon);
const stat=t=>{const it=live(t);return{series:it.filter(i=>i.kind==="series").length,films:it.reduce((a,i)=>a+i.films.length,0),
  min:it.reduce((a,i)=>a+i.min,0),seen:it.reduce((a,i)=>a+seen(i),0),soon:soon(t).length};};
const frac=t=>{const s=stat(t);return s.films?s.seen/s.films:0;};
const dur=m=>{if(m<60)return Math.floor(m)+(m%1?"½":"")+" min";const h=Math.floor(Math.round(m)/60),r=Math.round(m)%60;return h+" h"+(r?" "+r+" min":"");};
const nFilms=n=>n===1?X.film1:fill(X.films,{n:n});
const counts=t=>{const s=stat(t),p=[];if(s.series>1)p.push(fill(X.series,{n:s.series}));p.push(nFilms(s.films),dur(s.min));
  if(s.soon)p.push(s.soon===1?X.more1:fill(X.more,{n:s.soon}));return p.join(" · ");};
const lineOf=t=>G(t.group).line;
const MAIN=D.topics.filter(t=>t!==START&&lineOf(t)==="main"),LOOPS=D.groups.filter(g=>g.line!=="main");
const order=()=>MAIN.concat(LOOPS.flatMap(g=>D.topics.filter(t=>t.group===g.id)));
const nextStop=home=>(!home&&frac(START)<1?START:order().find(t=>frac(t)<1))||null;
const goal=id=>D.goals.find(g=>g.id===id)||null;
const stopsOf=g=>{const st=g.stops.map(id=>ITEM[id]).filter(Boolean),o=[];st.forEach(i=>{if(!o.includes(i.topic))o.push(i.topic);});
  return{st:st,order:o,min:st.reduce((a,i)=>a+i.min,0)};};
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);

function dot(f,num){const r=12,c=2*Math.PI*r;
  return '<svg class="r-dot" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false"><circle cx="16" cy="16" r="15.5" class="d-bg"/><circle cx="16" cy="16" r="'+r+'" class="d-track"/>'+
    (f>0?'<circle cx="16" cy="16" r="'+r+'" class="d-arc" stroke-dasharray="'+(c*Math.min(f,1)).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 16 16)"/>':'')+
    (num?'<text x="16" y="20.6" text-anchor="middle" class="d-num">'+num+'</text>':f>=1?'<path d="M10.6 16.4l3.6 3.6 7.2-7.6" class="d-check"/>':'<circle cx="16" cy="16" r="5" class="d-core"/>')+'</svg>';}
const CHEV='<svg class="r-chev" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M7.5 4.5l5.5 5.5-5.5 5.5"/></svg>';

function draw(box){
  const home=box.hasAttribute("data-home"),base=box.dataset.base||"",root=box.dataset.root||"",topics=box.dataset.topics||"";
  const st={sel:null,goal:null,panel:"station",open:null,w:0};
  const g0=goal(get("ld-route:goal"));if(g0){st.goal=g0.id;st.panel="goal";}
  const img=p=>root+"assets/"+p,topicHref=t=>topics+"#"+t.id;
  const label=t=>{const s=stat(t);return t.name+", "+G(t.group).name+(s.seen?", "+fill(X.of,{n:s.seen,of:s.films}):"");};

  function card(i,extra){
    const s=seen(i),n=i.soon?0:i.films.length;
    const meta=i.soon?'<span class="r-pill">'+esc(X.soon)+'</span>':'<small>'+esc(i.len)+(s?" · "+esc(n===1?X.watched:fill(X.of,{n:s,of:n})):"")+'</small>';
    const pic=i.poster?'<img src="'+esc(img(i.poster))+'" alt="" width="176" height="99" loading="lazy">':'<i class="r-noimg"></i>';
    const body=pic+'<span><small>'+esc(i.kicker)+'</small><b'+(i.lang?' lang="'+i.lang+'"':'')+'>'+esc(i.title)+'</b>'+meta+(extra?'<small>'+esc(extra)+'</small>':'')+'</span>';
    return '<li>'+(i.soon?'<div class="r-sc soon">'+body+'</div>':'<a class="r-sc" href="'+esc(base+i.href)+'">'+body+'</a>')+'</li>';}
  function detail(t,inRail){
    const s=stat(t),nx=nextStop(home),open='<a class="btn primary" href="'+esc(topicHref(t))+'">'+esc(X.open)+'</a>';
    return '<div class="r-about">'+(inRail?'':'<p class="r-kick"><i></i>'+esc(G(t.group).name)+(nx===t?" · "+esc(X.next):"")+'</p><h3>'+esc(t.name)+'</h3>')+
      '<p class="r-who">'+esc(t.who)+'</p><p class="r-line">'+esc(t.line)+'</p>'+
      (inRail?'':'<p class="r-meta">'+esc(counts(t))+(s.seen?" · "+esc(fill(X.of,{n:s.seen,of:s.films})):"")+'</p>'+open)+'</div>'+
      '<ul class="r-items">'+t.items.map(i=>card(i)).join("")+'</ul>'+(inRail?open:'');}
  function intro(num){
    const w=seen(INTRO)>0;
    return '<a class="r-intro'+(st.panel==="station"&&st.sel===START.id?" sel":"")+'" href="'+esc(base+INTRO.href)+'">'+(num?'<span class="r-n">'+num+'</span>':'')+
      '<span class="r-ph"><img src="'+esc(img(INTRO.poster))+'" alt="" width="1280" height="720"></span><span class="r-ib"><span class="r-kick">'+esc(X.start)+'</span><b>'+esc(INTRO.title)+'</b>'+
      '<small>'+esc(START.name)+" · "+esc(INTRO.len)+(w?" · "+esc(X.watched):"")+'</small><span class="btn">'+esc(w?X.again:X.play)+'</span></span></a>';}
  function goals(){
    return '<div class="r-goals" role="group" aria-label="'+esc(X.want)+'"><span class="r-lab">'+esc(X.want)+'</span>'+
      D.goals.map(g=>'<button type="button" class="r-chip" data-goal="'+g.id+'" data-k="g-'+g.id+'" aria-pressed="'+(st.goal===g.id)+'">'+esc(g.name)+'</button>').join("")+
      '<button type="button" class="r-chip" data-goal="" data-k="g-" aria-pressed="'+(!st.goal)+'">'+esc(X.whole)+'</button></div>';}
  function goalHead(g,gi){
    const first=gi.st.find(i=>seen(i)<i.films.length)||gi.st[0],any=gi.st.some(i=>seen(i)>0),all=gi.st.every(i=>seen(i)>=i.films.length);
    return '<p class="r-kick">'+esc(X.yours)+'</p><h3>'+esc(cap(g.name))+'</h3><p class="r-line">'+esc(g.line)+'</p><p class="r-meta">'+esc(fill(X.stops,{n:gi.st.length}))+" · "+esc(dur(gi.min))+'</p>'+
      '<a class="btn primary" href="'+esc(base+first.href)+'">'+esc(all?X.again:any?X.on:X.go)+'</a>';}
  const goalStops=gi=>'<ol class="r-stops">'+gi.st.map(i=>card(i,T(i.topic).name)).join("")+'</ol>';

  function wide(mode,W){
    const side=mode==="side",mw=W-(side?248:0),n=MAIN.length,padL=side?66:52,padR=58;
    const yT=84,yM=222,yB=358,H=430,s=22,g=goal(st.goal),gi=g?stopsOf(g):null;
    const numOf=id=>gi?gi.order.indexOf(id)+1:0,dim=id=>!!gi&&!gi.order.includes(id);
    const first=G(MAIN[0].group).id,last=G(MAIN[n-1].group).id;
    const nF=MAIN.filter(t=>t.group===first).length,nL=first===last?0:MAIN.filter(t=>t.group===last).length;
    // the loops leave and join the line between two stations: those two gaps are wider (by J), so no name sits under a curve
    const J=nL?28:14,col=(mw-padL-padR-(nL?2:1)*J)/(n-1),Xp=i=>padL+i*col+(i>=nF?J:0)+(nL&&i>=n-nL?J:0);
    const xa=(Xp(nF-1)+Xp(nF))/2,xb=nL?(Xp(n-nL-1)+Xp(n-nL))/2:Xp(n-1);
    const path=y=>"M"+(xa-s)+","+yM+" C"+(xa+s*.3)+","+yM+" "+(xa-s*.3)+","+y+" "+(xa+s)+","+y+" L"+(xb-s)+","+y+" C"+(xb+s*.3)+","+y+" "+(xb-s*.3)+","+yM+" "+(xb+s)+","+yM;
    let svg="",html="";
    function station(t,x,y,up,w){const sel=st.panel==="station"&&st.sel===t.id;
      return '<button type="button" class="r-st ln-'+lineOf(t)+(up?" up":"")+(sel?" sel":"")+(dim(t.id)?" dim":"")+'" data-st="'+t.id+'" data-k="s-'+t.id+'" aria-pressed="'+sel+'" aria-label="'+esc(label(t))+
        '" style="left:'+x.toFixed(1)+'px;top:'+(up?y+16:y-16)+'px;max-width:'+w.toFixed(0)+'px"><span class="r-sd">'+dot(frac(t),numOf(t.id))+'</span><span class="r-sl">'+esc(t.name)+'</span></button>';}
    LOOPS.slice(0,2).forEach((gr,k)=>{const up=k===0,y=up?yT:yB,ts=D.topics.filter(t=>t.group===gr.id),off=ts.every(t=>dim(t.id));
      svg+='<path class="r-loop ln-'+gr.line+(off?" dim":"")+'" d="'+path(y)+'"/>';
      html+='<span class="r-gl loop ln-'+gr.line+(off?" dim":"")+'" style="left:'+(xa+s+14)+'px;top:'+(up?y+22:y-38)+'px">'+esc(gr.name)+'</span>';
      const gap=(xb-xa-2*s)/ts.length;ts.forEach((t,j)=>{html+=station(t,xa+s+gap*(j+.5),y,up,Math.min(190,Math.max(84,gap-8)));});});
    svg+='<path class="r-trunk" d="M'+(side?-2:14)+","+yM+" L"+Xp(n-1)+","+yM+'"/>'+(side?'':'<circle class="r-cap" cx="14" cy="'+yM+'" r="6"/>');
    D.groups.filter(gr=>gr.line==="main"&&gr.id!==START.group).forEach(gr=>{const ix=MAIN.map((t,i)=>t.group===gr.id?i:-1).filter(i=>i>=0);if(!ix.length)return;
      const x1=Xp(ix[0])-24,x2=Xp(ix[ix.length-1])+24,y=yM-34;
      svg+='<path class="r-brk" d="M'+x1+","+y+" v-4 q0,-6 6,-6 H"+(x2-6)+" q6,0 6,6 v4"+'"/>';
      html+='<span class="r-gl" style="left:'+((x1+x2)/2)+'px;top:'+(y-34)+'px">'+esc(gr.name)+'</span>';});
    MAIN.forEach((t,i)=>{html+=station(t,Xp(i),yM,false,Math.max(84,col-6));});
    const panel=st.panel==="goal"&&g?'<div class="r-panel goal" aria-live="polite"><div class="r-about">'+goalHead(g,gi)+'</div>'+goalStops(gi)+'</div>':
      '<div class="r-panel ln-'+lineOf(T(st.sel))+'" aria-live="polite">'+detail(T(st.sel),false)+'</div>';
    const ic=home?"":intro(gi&&gi.order.includes(START.id)?numOf(START.id):0);
    return goals()+'<div class="r-wide m-'+mode+'">'+(side?'<div class="r-side" style="margin-top:'+(yM-150)+'px">'+ic+'</div>':ic)+
      '<div class="r-map" style="height:'+H+'px" role="group" aria-label="'+esc(fill(X.map,{n:D.topics.length}))+'"><svg class="r-lines" aria-hidden="true" focusable="false">'+svg+'</svg>'+html+'</div></div>'+
      '<p class="r-legend"><span><i class="ln-main"></i>'+esc(X.route)+'</span><span>'+esc(X.any)+'</span></p>'+panel;}
  function rail(){
    const g=goal(st.goal),gi=g?stopsOf(g):null,numOf=id=>gi?gi.order.indexOf(id)+1:0,dim=id=>!!gi&&!gi.order.includes(id);
    const gs=D.groups.filter(gr=>gr.id!==START.group),mains=gs.filter(gr=>gr.line==="main"),seq=mains.slice(0,-1).concat(gs.filter(gr=>gr.line!=="main"),mains.slice(-1));
    const rows=seq.map((gr,k)=>{const loop=gr.line!=="main";
      return '<li class="r-rg ln-'+gr.line+(loop?" loop":"")+(k===seq.length-1?" end":"")+'">'+(loop?'<i class="r-cn a"></i><i class="r-cn b"></i>':'')+'<p class="r-rh">'+esc(gr.name)+'</p><ol>'+
        D.topics.filter(t=>t.group===gr.id).map(t=>{const op=st.open===t.id;
          return '<li class="r-rs'+(dim(t.id)?" dim":"")+'"><button type="button" class="r-rb" data-rs="'+t.id+'" data-k="r-'+t.id+'" aria-expanded="'+op+'">'+dot(frac(t),numOf(t.id))+
            '<span class="r-rt"><b>'+esc(t.name)+'</b><small>'+esc(counts(t))+'</small></span>'+CHEV+'</button>'+(op?'<div class="r-rd">'+detail(t,true)+'</div>':'')+'</li>';}).join("")+'</ol></li>';}).join("");
    return '<div class="r-narrow">'+(home?"":intro(gi&&gi.order.includes(START.id)?numOf(START.id):0))+goals()+
      (g?'<div class="r-goalcard">'+goalHead(g,gi)+'<details><summary>'+esc(fill(X.stops,{n:gi.st.length}))+'</summary>'+goalStops(gi)+'</details></div>':'')+
      '<ol class="r-rail'+(home?" capped":"")+'">'+rows+'</ol><p class="r-legend"><span>'+esc(X.any)+'</span></p></div>';}
  function render(){
    const w=box.clientWidth;st.w=w;if(!w)return;
    if(!st.sel||!T(st.sel)||(home&&st.sel===START.id))st.sel=(nextStop(home)||MAIN[0]).id;
    const a=document.activeElement,k=a&&box.contains(a)&&a.dataset?a.dataset.k:null;
    box.classList.add("drawn");
    box.innerHTML=w>=880?wide(!home&&w>=1040?"side":"top",w):rail();
    if(k){const e=box.querySelector('[data-k="'+k+'"]');if(e)e.focus({preventScroll:true});}}
  box.addEventListener("click",e=>{
    const s=e.target.closest("[data-st]"),r=e.target.closest("[data-rs]"),g=e.target.closest("[data-goal]");
    if(s){st.sel=s.dataset.st;st.panel="station";render();}
    else if(r){st.open=st.open===r.dataset.rs?null:r.dataset.rs;render();}
    else if(g){st.goal=g.dataset.goal||null;st.panel=st.goal?"goal":"station";set("ld-route:goal",st.goal);render();}});
  if(window.ResizeObserver)new ResizeObserver(()=>{if(box.clientWidth!==st.w)render();}).observe(box);
  else window.addEventListener("resize",render);
  window.addEventListener("pageshow",e=>{if(e.persisted)render();});
  render();}
document.querySelectorAll("[data-route]").forEach(draw);
})();
