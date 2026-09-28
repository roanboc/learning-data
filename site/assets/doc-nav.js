/* Learning Data: "On this page" on the Making of page (built by site-tools/build_pages.py).
   It marks the section being read (aria-current="location"), keeps that link in view in the sidebar, and on phones names the section
   in a bar that opens the list. Without it, the list still shows and every link works. */
(()=>{"use strict";
const nav=document.querySelector(".doc-nav");if(!nav)return;
const btn=nav.querySelector(".doc-nav-btn"),now=nav.querySelector(".doc-now"),toc=nav.querySelector(".doc-toc"),wide=matchMedia("(min-width:1100px)");
const items=[...toc.querySelectorAll("a")].map(a=>({a,el:document.getElementById(decodeURIComponent(a.hash.slice(1)))})).filter(x=>x.el);
if(!items.length)return;
nav.classList.add("js");btn.hidden=false;
let cur=null;
function show(open){nav.classList.toggle("open",open);btn.setAttribute("aria-expanded",String(open));}
function update(){
  // the section being read: the last one whose heading has passed the top of the window (under the header, and the bar on phones)
  const line=(parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||80)+24;let c=items[0];
  for(const it of items){if(it.el.getBoundingClientRect().top<=line)c=it;else break;}
  if(c===cur)return;
  if(cur)cur.a.removeAttribute("aria-current");cur=c;c.a.setAttribute("aria-current","location");now.textContent=c.a.textContent;
  if(wide.matches){const top=c.a.offsetTop,view=nav.clientHeight;if(top<nav.scrollTop+48||top>nav.scrollTop+view-72)nav.scrollTop=Math.max(0,top-view/3);}
}
let raf=0;addEventListener("scroll",()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;update();});},{passive:true});
addEventListener("resize",update);update();
btn.addEventListener("click",()=>show(!nav.classList.contains("open")));
items.forEach(({a})=>a.addEventListener("click",()=>show(false)));
addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open")){show(false);btn.focus();}});
document.addEventListener("click",e=>{if(nav.classList.contains("open")&&!nav.contains(e.target))show(false);});
})();
