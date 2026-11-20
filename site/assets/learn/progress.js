/* Learning Data: the Topics page's Progress view (section#progress), drawn in [data-prog] from the route's data in
   route.<lang>.js (window.LD_ROUTE), so this file holds no topic, no link and no word of its own.
   - The route is the one chosen on the learning route ("ld-route:goal", in this browser); changing it here changes it there,
     and the other way round (the "ld-route" event). With no route chosen, every topic counts.
   - Progress on the route, in two lines of bars: films watched and labs seen; then situations answered and right ones. Each
     counts only the route's films and series. Continue goes to the route's next stop.
   - One tile per topic on the route, grouped by the route's stages, with a ring and one row of small counts (a count with
     nothing to count, such as right answers before any answer, is left out). A route shows only its
     topics; "Show all topics" brings the rest back. The next stop is marked.
   - The counts come from path.js (window.LD_STATS), with the keys every page uses. */
(()=>{"use strict";
const D=window.LD_ROUTE,box=document.querySelector("[data-prog]");if(!D||!D.topics||!box)return;
const X=D.text,fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const get=k=>{try{return JSON.parse(localStorage.getItem(k));}catch(e){return null;}};
const set=(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
const S=window.LD_STATS||(()=>({watched:false,labs:0,n:0,ok:0}));
const base=box.dataset.base||"",ITEM={};D.topics.forEach(t=>t.items.forEach(i=>{ITEM[i.id]=i;i.topic=t.id;}));
const T=id=>D.topics.find(t=>t.id===id),goal=id=>D.goals.find(g=>g.id===id)||null;
const IC={fw:'<path d="M7 5.5v9l7.5-4.5z" class="f"/>',ls:'<path d="M8 3h4M9 3v5l-4.5 7.2A1.2 1.2 0 0 0 5.5 17h9a1.2 1.2 0 0 0 1-1.8L11 8V3"/><path d="M6.6 12.5h6.8"/>',
  an:'<path d="M4 5.5A2 2 0 0 1 6 3.5h8a2 2 0 0 1 2 2v5.5a2 2 0 0 1-2 2H9l-3.6 3v-3H6a2 2 0 0 1-2-2z"/>',ok:'<circle cx="10" cy="10" r="6.8"/><path d="M7 10.2l2.1 2.1 4-4.3"/>'};
const icon=k=>'<svg class="pg-ic ic-'+k+'" viewBox="0 0 20 20" aria-hidden="true" focusable="false">'+IC[k]+'</svg>';
let all=false;
// what a set of the route's films and series adds up to
function sum(items){const o={f:0,fn:0,l:0,ln:0,q:0,n:0,ok:0};
  items.forEach(i=>{o.fn+=i.films.length;o.f+=i.films.filter(p=>S(p,0,0).watched).length;
    if(i.pr){const st=S(i.pr[0],i.pr[1],i.pr[2]);o.ln+=i.pr[1];o.l+=st.labs;o.q+=i.pr[2];o.n+=st.n;o.ok+=st.ok;}});return o;}
function bar(k,n,of,label){const f=of?n/of:0;
  return '<span class="pg-b'+(k==="ok"?" ok":"")+'" title="'+esc(label)+'">'+icon(k)+'<span class="pg-t"><i style="width:'+Math.round(100*Math.min(f,1))+'%"></i></span>'+
    '<small><span class="route-sr">'+esc(label)+': </span>'+n+'/'+of+'</small></span>';}
const lines=o=>'<div class="pg-l">'+bar("fw",o.f,o.fn,X.fw)+(o.ln?bar("ls",o.l,o.ln,X.ls):"")+'</div>'+
  (o.q?'<div class="pg-l">'+bar("an",o.n,o.q,X.an)+(o.n?bar("ok",o.ok,o.n,X.ok):"")+'</div>':"");
// a topic's tile: one row of small counts, each with a thin bar under it; a count with nothing to count is left out
function chip(k,n,of,label){return '<li class="pg-c'+(k==="ok"?" ok":"")+'" title="'+esc(label)+'">'+icon(k)+
  '<span><span class="route-sr">'+esc(label)+': </span>'+n+'/'+of+'</span><i style="width:'+Math.round(100*Math.min(of?n/of:0,1))+'%"></i></li>';}
const counts=o=>'<ul class="pg-cs">'+(o.fn?chip("fw",o.f,o.fn,X.fw):"")+(o.ln?chip("ls",o.l,o.ln,X.ls):"")+
  (o.q?chip("an",o.n,o.q,X.an):"")+(o.n?chip("ok",o.ok,o.n,X.ok):"")+'</ul>';
function ring(f){const r=15,c=2*Math.PI*r;
  return '<svg class="pg-ring" viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" focusable="false"><circle cx="20" cy="20" r="'+r+'" class="d-track"/>'+
    (f>0?'<circle cx="20" cy="20" r="'+r+'" class="d-arc" stroke-dasharray="'+(c*Math.min(f,1)).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 20 20)"/>':'')+
    (f>=1?'<path d="M14 20.4l4 4 8-8.4" class="d-check"/>':'')+'</svg>';}
const live=t=>t.items.filter(i=>!i.soon);
function render(){
  const g=goal(get("ld-route:goal")),onRoute=g?g.stops.map(id=>ITEM[id]).filter(i=>i&&!i.soon):D.topics.flatMap(live);
  const routeTopics=[];onRoute.forEach(i=>{if(!routeTopics.includes(i.topic))routeTopics.push(i.topic);});
  const tot=sum(onRoute),nx=onRoute.find(i=>i.films.some(p=>!S(p,0,0).watched)),nxt=nx?nx.topic:null;
  const chips='<div class="r-goals" role="group" aria-label="'+esc(X.want)+'"><span class="r-lab">'+esc(X.want)+'</span>'+
    D.goals.map(x=>'<button type="button" class="r-chip" data-goal="'+x.id+'" aria-pressed="'+(!!g&&g.id===x.id)+'">'+esc(x.name)+'</button>').join("")+
    '<button type="button" class="r-chip" data-goal="" aria-pressed="'+(!g)+'">'+esc(X.alltopics)+'</button></div>';
  const head='<div class="pg-head"><p class="r-kick">'+esc(X.yours)+'</p><h3>'+esc(g?g.name.charAt(0).toUpperCase()+g.name.slice(1):X.alltopics)+'</h3>'+chips+
    '<p class="pg-links"><a href="#route">'+esc(X.seeroute)+' →</a></p></div>';
  const key='<p class="pg-key" aria-label="'+esc(X.key)+'">'+["fw","ls","an","ok"].map(k=>'<span>'+icon(k)+esc(X[k])+'</span>').join("")+'</p>';
  const sumBox='<div class="pg-sum"><p class="r-kick">'+esc(X.onroute)+'</p>'+lines(tot)+
    (nx?'<a class="btn primary" href="'+esc(base+nx.href)+'">'+esc(X.cont)+': '+esc(nx.title)+' →</a>':'')+'</div>';
  const shown=g&&!all?routeTopics:D.topics.map(t=>t.id);
  let tiles="";
  D.groups.forEach(gr=>{const ts=D.topics.filter(t=>t.group===gr.id&&shown.includes(t.id));if(!ts.length)return;
    tiles+='<div class="pg-g ln-'+gr.line+'"><p class="step ix-gh"><i></i>'+esc(gr.name)+'</p><ul class="pg-tiles">'+ts.map(t=>{
      const off=g&&!routeTopics.includes(t.id),its=off?live(t):(g?onRoute.filter(i=>i.topic===t.id):live(t)),o=sum(its),started=o.f||o.l||o.n;
      return '<li class="pg-tile'+(t.id===nxt?" next":"")+(off?" off":"")+'"><a href="'+esc(base+"topics/"+t.id+"/")+'">'+ring(o.fn?o.f/o.fn:0)+
        '<span class="pg-tb"><b>'+esc(t.name)+'</b>'+(t.id===nxt?'<span class="r-pill">'+esc(X.next)+'</span>':'')+
        (g&&!off?'<small>'+esc(fill(X.uses,{s:its.map(i=>i.title).join(", ")}))+'</small>':'')+
        (started?counts(o):'<small class="pg-ns">'+esc(X.notyet)+'</small>')+'</span></a></li>';}).join("")+'</ul></div>';});
  const more=g?'<p class="pg-more"><button type="button" class="btn" data-all aria-pressed="'+all+'">'+esc(all?X.hide:X.showall)+'</button></p>':'';
  box.innerHTML=head+sumBox+key+tiles+more;}
box.addEventListener("click",e=>{const c=e.target.closest("[data-goal]"),a=e.target.closest("[data-all]");
  if(c){set("ld-route:goal",c.dataset.goal||null);all=false;render();window.dispatchEvent(new CustomEvent("ld-route",{detail:"prog"}));}
  else if(a){all=!all;render();}});
window.addEventListener("ld-route",e=>{if(e.detail!=="prog")render();});
window.addEventListener("storage",render);window.addEventListener("pageshow",e=>{if(e.persisted)render();});
render();
})();
