/* Learning Data: the three-step path (Watch, Take it apart, Make the call) shown on every page.
   It fills in progress from this browser only, and sends old one-page links (#explore, #practise) to their own pages. */
(()=>{"use strict";
const get=(k,d)=>{try{const v=localStorage.getItem("ld:"+k);return v==null?d:JSON.parse(v);}catch(e){return d;}};
const set=(k,v)=>{try{localStorage.setItem("ld:"+k,JSON.stringify(v));}catch(e){}};
const fill=(s,o)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);
const path=document.querySelector(".path[data-text]");if(!path)return;
// the home page used to hold the labs (#explore, #explore-refine) and the scenarios (#practise)
const old=location.hash.match(/^#(explore|practise)(?:[-/](\w+))?$/);
if(old&&path.dataset.home!=null){location.replace((old[1]==="explore"?"labs/":"scenarios/")+(old[2]?"#"+old[2]:""));return;}
// a chapter link (#t=89) lands on the film
if(/^#t=/.test(location.hash)){const w=document.getElementById("watch");if(w)window.addEventListener("load",()=>w.scrollIntoView());}
const T=JSON.parse(path.dataset.text),li=path.querySelectorAll("li");
function paint(){const seen=get("visited",[]).length,ans=(get("quiz",{}).ans)||{},n=Object.keys(ans).length,ok=Object.values(ans).filter(a=>a&&a.ok).length,watched=get("watched",false);
  const put=(i,done,txt)=>{if(!li[i])return;li[i].classList.toggle("done",!!done);if(txt)li[i].querySelector("span:last-child").textContent=txt;};
  put(0,watched,watched?T.watched:null);put(1,seen>=8,seen?fill(T.labs,{n:seen}):null);put(2,n>=12,n?fill(T.quiz,{n,ok}):null);}
paint();
// the film counts as watched once most of it has played
if(window.FILM&&document.getElementById("film")&&typeof TL!=="undefined"){const iv=setInterval(()=>{if(get("watched",false)){clearInterval(iv);return;}if(FILM.time&&FILM.time()>TL.total*0.85){set("watched",true);paint();clearInterval(iv);}},3000);}
window.addEventListener("storage",paint);window.addEventListener("pageshow",paint);
})();
