/* Learning Data: progress, kept in this browser only. One script for every film page except A Sharper Sketch's (sketch.js does it there).
   - A film's three-step path (.path[data-text]): the store prefix comes from data-store (default "ld"), the counts from data-labs and data-quiz (default 8 and 12).
   - "Watched" for the film in section#watch[data-store], once 85% of its length has actually played (seconds of playback,
     not where the playhead is: one late chapter isn't the film), or once it reaches the end after half of it has played.
     A page without it records nothing, so one film's page can never mark another film as watched.
   - Progress on topic cards: [data-progress="<prefix>"] (optional data-labs, data-quiz) inside [data-progress-text]; on a series' card,
     how many of its films were watched: [data-films="<prefix> <prefix>…"] inside [data-series-text].
   - A chapter link (#t=89) scrolls to #watch, with or without a stepper.
   - On the home page only (data-home), old one-page links (#explore, #practise) go to their own pages.
   Prefixes: "ld" The Inner Life of Data; "ld3" A Sharper Sketch (a historical name: renaming it would erase visitors' progress);
   "ld-silent-change" Silent change; "ld-too-good-to-be-true" Too good to be true (its labs and scenarios are in assets/too-good-to-be-true/learn.js). */
(()=>{"use strict";
const store=p=>({get:(k,d)=>{try{const v=localStorage.getItem(p+":"+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},
  set:(k,v)=>{try{localStorage.setItem(p+":"+k,JSON.stringify(v));}catch(e){}}});
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
// the intro keeps its answers under .ans, A Sharper Sketch at the top level; only numbered keys are answers
const stats=p=>{const s=store(p),q=s.get("quiz",{})||{},a=q.ans||q,ans=Object.keys(a).filter(k=>/^\d+$/.test(k)&&a[k]).map(k=>a[k]),v=s.get("visited",[]);
  return{watched:!!s.get("watched",false),labs:Array.isArray(v)?v.length:0,n:ans.length,ok:ans.filter(x=>x.ok).length};};
const path=document.querySelector(".path[data-text]");
// the home page used to hold the labs (#explore, #explore-refine) and the scenarios (#practise)
const old=location.hash.match(/^#(explore|practise)(?:[-/](\w+))?$/);
if(old&&path&&path.dataset.home!=null){location.replace((old[1]==="explore"?"labs/":"scenarios/")+(old[2]?"#"+old[2]:""));return;}
const watch=document.getElementById("watch");
if(/^#t=/.test(location.hash)&&watch)window.addEventListener("load",()=>watch.scrollIntoView());
function paint(){
  if(path){const T=JSON.parse(path.dataset.text),li=path.querySelectorAll("li"),st=stats(path.dataset.store||"ld"),NL=+(path.dataset.labs||8),NQ=+(path.dataset.quiz||12);
    const put=(i,done,txt)=>{if(!li[i])return;li[i].classList.toggle("done",!!done);if(txt)li[i].querySelector("span:last-child").textContent=txt;};
    put(0,st.watched,st.watched?T.watched:null);put(1,st.labs>=NL,st.labs?fill(T.labs,{n:st.labs}):null);put(2,st.n>=NQ,st.n?fill(T.quiz,st):null);}
  document.querySelectorAll("[data-progress]").forEach(el=>{const box=el.closest("[data-progress-text]");if(!box)return;
    const T=JSON.parse(box.dataset.progressText),st=stats(el.dataset.progress),out=[];
    if(st.watched)out.push(T.watched);
    if(st.labs&&el.dataset.labs)out.push(fill(T.labs,{n:st.labs,of:el.dataset.labs}));
    if(st.n&&el.dataset.quiz)out.push(fill(T.quiz,{n:st.n,of:el.dataset.quiz,ok:st.ok}));
    el.textContent=out.join(" · ");el.hidden=!out.length;});
  document.querySelectorAll("[data-films]").forEach(el=>{const box=el.closest("[data-series-text]");if(!box)return;
    const T=JSON.parse(box.dataset.seriesText),ps=el.dataset.films.split(" "),n=ps.filter(p=>stats(p).watched).length;
    el.textContent=n?fill(T.films,{n:n,of:ps.length}):"";el.hidden=!n;});}
paint();window.addEventListener("storage",paint);window.addEventListener("pageshow",paint);
// the film on this page counts as watched once most of it has played. Each second, the playhead's progress counts
// only while the film plays, and only up to the time that passed, so a seek or a chapter jump adds nothing
if(watch&&watch.dataset.store&&watch.querySelector("#film")&&window.FILM&&typeof TL!=="undefined"){const s=store(watch.dataset.store);
  let played=0,prev=null;const iv=setInterval(()=>{
    if(s.get("watched",false)){clearInterval(iv);return;}if(!FILM.time)return;
    const now={t:FILM.time(),at:performance.now()/1000,on:FILM.playing()};
    if(prev&&prev.on&&now.on){const d=now.t-prev.t;if(d>0&&d<=now.at-prev.at+0.5)played+=d;}
    prev=now;
    if(played>=TL.total*0.85||(played>=TL.total*0.5&&now.t>=TL.total-1)){s.set("watched",true);paint();clearInterval(iv);}},1000);}
})();
