/* ===== Where one chapter meets the next =====
   The engine (engine3.js) lays the end of each chapter over the next one's first XF seconds, fading it out. Where both chapters show
   the same words a little apart, or at another size, those words show twice for that time, like a ghost (twice.py finds them). The
   older films load this after the engine, and each names its joins in CHAPTER_JOINS, after its last scene():
     glide: chapters that carry the picture on from the one before. The camera (weeds.js's drift) starts where the chapter before
            left it, so what both draw stays put while the engine fades, then glides on to the chapter's own over GL seconds.
     leave: chapters that show the same words in another place. What was there leaves first, over the bare background (bare), and
            then the chapter comes in, over LV seconds: a later moment in the same place.
     cut:   chapters that open on a cut: another place, with the same people or words.
     bare:  (ctx,S,t,sc) draws the background of the chapter coming in with nothing on it, at its own time; or, for each chapter
            that leaves, its own.
   A chapter not named keeps the engine's fade. */
function chapterJoins(J){J=J||{};const GL=1.6,LV=1.2,orig=new Map(SCENES.map(s=>[s,s.draw])),named=new Set();
  const join=id=>{const i=SCENES.findIndex(s=>s.id===id);if(i<1)throw new Error("CHAPTER_JOINS: "+id+" isn't a chapter after the first");
    if(named.has(id))throw new Error("CHAPTER_JOINS: "+id+" is named twice");named.add(id);return[SCENES[i-1],SCENES[i]];};
  let SCR=null;const scratch=cv=>{if(!SCR||SCR.width!==cv.width||SCR.height!==cv.height)SCR=mkCanvas(cv.width,cv.height);return SCR;};
  // the chapter before draws nothing where the engine lays its end over this one
  const quiet=pv=>{const d=pv.draw;pv.draw=function(ctx,S,t,s){if(t<s.dur)return d.apply(this,arguments);
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();};};
  (J.cut||[]).forEach(id=>quiet(join(id)[0]));
  // what was there leaves over the bare background in the first LV/2 seconds, and the chapter comes in over it in the next
  (J.leave||[]).forEach(id=>{const[pv,sc]=join(id),bare=typeof J.bare==="function"?J.bare:J.bare&&J.bare[id],d=sc.draw,da=orig.get(pv);
    if(typeof bare!=="function")throw new Error("CHAPTER_JOINS.leave: give bare, the background "+id+" comes in over");quiet(pv);
    sc.draw=function(ctx,S,t,s){if(t>=LV)return d.apply(this,arguments);const k=clamp(t/LV,0,1),out=k<0.5,c=scratch(ctx.canvas),x=c.getContext("2d");
      ctx.save();bare(ctx,S,t,s);ctx.restore();
      x.save();x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,c.width,c.height);x.restore();
      x.save();if(out)da.call(pv,x,S,pv.dur+t,pv);else d.call(this,x,S,t,s);x.restore();
      ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=out?1-easeCam(k*2):easeCam(k*2-1);ctx.drawImage(c,0,0);ctx.restore();};});
  // the camera carries on: drift's own move, read from an empty drawing, eased from where the chapter before left it to the chapter's own
  const G=J.glide||[];if(!G.length)return;if(typeof drift!=="function")throw new Error("CHAPTER_JOINS.glide: the film has no drift()");
  const D=drift,P=mkCanvas(1,1).getContext("2d"),own={},on=new Set(),seen=new Set();
  const cam=(sc,t,o)=>{P.setTransform(1,0,0,1,0,0);D(P,t,sc,o);return P.getTransform();};
  G.forEach(id=>{const[pv,sc]=join(id),d=sc.draw;on.add(sc);
    // the chapter before's camera options, from drawing it once at its end where it hasn't been drawn yet (a seek straight here)
    sc.draw=function(ctx,S,t,s){if(t<XF+GL&&!seen.has(pv)&&!(pv.id in own)){seen.add(pv);const c=scratch(ctx.canvas),x=c.getContext("2d");
        x.save();try{orig.get(pv).call(pv,x,S,pv.dur,pv);}catch(e){}x.restore();}
      return d.apply(this,arguments);};});
  drift=function(ctx,t,sc,o){if(sc&&sc.id)own[sc.id]=o||{};if(!on.has(sc)||!(t<XF+GL))return D.apply(this,arguments);
    const pv=SCENES[SCENES.indexOf(sc)-1],a=pv.id in own?cam(pv,pv.dur,own[pv.id]):new DOMMatrix(),b=cam(sc,t,o),k=t<XF?0:easeCam((t-XF)/GL);
    ctx.transform(lerp(a.a,b.a,k),lerp(a.b,b.b,k),lerp(a.c,b.c,k),lerp(a.d,b.d,k),lerp(a.e,b.e,k),lerp(a.f,b.f,k));};}
if(typeof CHAPTER_JOINS!=="undefined")chapterJoins(CHAPTER_JOINS);
