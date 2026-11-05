/* ===== A mandate, written and enforced: the five stages and their gates =====
   Five stages, not a switch's fs_stages, copied whole from that film's source (its branch claude/project-thread-x3g9en, 2c63ffcf, 5
   November 2026) under this film's prefix, as the series' briefs ask, so the stages keep 3.1's look, words and colours. If 3.1 changes
   it before this film merges, it's copied again. Its own notes follow, unchanged but for the name.
   wm_stages(ctx, x, y, w, o) draws the series' picture of the five stages: five oak steps rising from left to right on the floor, each
   with its number on its face and a card on its top with its name (the plan's names, or o.short for one word or two), and a slim gate
   before each step, a post with a round knob that turns green once the gate is passed. Everything it needs is inside it, and it calls
   only the module's shared helpers (ag_box, ag_T, ag_tw, ag_floorShadow, ag_tick, ag_about), so a later film can copy it
   whole, under its own prefix, and keep its look, its words and its colours (blue for the stages and their gates, green for a gate
   passed).
     x, y   the left end of the floor line the steps stand on; w their width (1660 fills the frame; 1160 or more keeps every word at
            least 28 px as seen at zoom 1)
     o.a    the whole picture's opacity; o.k [5] each step springing in (0 to 1), o.lit [5] each stage lit (a blue edge, 0 to 1),
            o.dim (0 to 1) the stages not lit, quieter; o.col [5] a colour for a stage's edge instead of blue (amber for a stage a task
            moved down from, green for one passed)
     o.short  the short names, on one line, for a small picture (true or 1); between 0 and 1 the names change over: the long
              fade out in the first half, and the short come in in the second, so the two never show at once
     o.gates  [5] each gate shown (0 to 1), or true for all; o.passed [5] each gate passed (0 to 1): its knob turns green, with a tick
     o.gate   {i, a, k, x, y, w}: the words of gate i (0 to 4, the gate before stage i + 1) on a card at (x, y) (w wide, or as wide as
              its words), with a line to the gate's knob
     o.facts  {i, a, x, y, w}: stage i's three facts on a card at (x, y): whose identity, what it may do, what the person does
   It returns {stages: [{x, y, w, h, cx, top, face}], gates: [{x, y}]}: each stage's card, the middle of its step, the top of its step,
   its face; each gate's knob. */
function wm_stages(ctx,x,y,w,o){o=o||{};
  const NAMES=[["Suggests"],["Acts for you,","step by step"],["Acts for you,","within limits"],["A contributor","that proposes"],["A contributor","with a mandate"]],
    SHORT=["Suggests","Step by step","Within limits","Proposes","Mandate"],
    GATES=[["The team's conventions and glossary,","written down for it to read"],["A development space,","with no sensitive data"],["Its limits, and how it will be checked,","set before it starts"],
      ["A place on the map,","with an owner and a role"],["A track record,","and a mandate its owner signs"]],
    FACTS=[["Yours, but it uses none","Drafts in a chat; runs nothing","Accepts or rejects every line"],
      ["Yours, delegated","Runs queries in your session, read only","Approves each action"],
      ["Yours, narrowed","Works alone; drafts only in a sandbox","Checks it against the checks set first"],
      ["Its own, with no secret it can see","Opens a pull request from its own space","Owns it, and reviews every change"],
      ["Its own","In test, agreed tasks alone, then a report","Another person approves production"]],
    BLUE=[38,102,132],GREEN=[50,116,80],OAK={base:[208,188,156],dark:[156,136,106],hi:[242,233,216]};
  const a=o.a==null?1:o.a,k=w/1660,bw=300*k,gap=40*k,rise=86*k,depth=16*k,ch=128,sm=o.short===true?1:clamp(o.short||0,0,1),arr=(v,i,d)=>v==null?d:(v===true?1:(Array.isArray(v)?(v[i]==null?d:v[i]):v));
  const out={stages:[],gates:[]};
  for(let i=0;i<5;i++){const sx=x+i*(bw+gap),top=y-(i+1)*rise,cy=top-depth-14-ch;out.stages.push({x:sx,y:cy,w:bw,h:ch,cx:sx+bw/2,top,face:{x:sx,y:top,w:bw,h:y-top}});
    out.gates.push({x:sx-gap/2,y:top-depth-40*k});}
  if(a<=0)return out;
  ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w/2-8,y+10,w*0.56,26,0.22);
  for(let i=0;i<5;i++){const S=out.stages[i],kk=arr(o.k,i,1);if(kk<=0)continue;const lit=clamp(arr(o.lit,i,0),0,1),dim=(o.dim||0)*(1-lit),col=(o.col&&o.col[i])||BLUE;
    ctx.save();ctx.globalAlpha*=clamp(kk*1.6,0,1)*(1-0.55*dim);ag_about(ctx,S.cx,y,lerp(0.6,1,clamp(kk,0,1.2)));
    // the step: an oak block, its top a lighter strip receding a little, its face with the stage's number
    const f=S.face;let g=ctx.createLinearGradient(0,f.y,0,y);g.addColorStop(0,rgba(OAK.base,1));g.addColorStop(1,rgba(OAK.dark,1));
    ctx.save();ctx.shadowColor="rgba(46,38,28,0.24)";ctx.shadowBlur=24*k;ctx.shadowOffsetX=-7;ctx.shadowOffsetY=10;ctx.fillStyle=g;ctx.fillRect(f.x,f.y,f.w,f.h);ctx.restore();
    g=ctx.createLinearGradient(0,f.y-depth,0,f.y);g.addColorStop(0,rgba(mix(OAK.hi,[255,255,255],0.3),1));g.addColorStop(1,rgba(OAK.hi,1));ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(f.x+depth*0.6,f.y-depth);ctx.lineTo(f.x+f.w-depth*0.6,f.y-depth);ctx.lineTo(f.x+f.w,f.y);ctx.lineTo(f.x,f.y);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(OAK.dark,0.5);ctx.lineWidth=1.2;for(let j=1;j<4;j++){const gy=f.y+f.h*j/4;ctx.beginPath();ctx.moveTo(f.x+6,gy+Math.sin(j*3.1+i)*2);ctx.bezierCurveTo(f.x+f.w*0.3,gy-3,f.x+f.w*0.7,gy+3,f.x+f.w-6,gy);ctx.stroke();}
    if(lit>0){ctx.fillStyle=rgba([255,250,236],0.26*lit);ctx.fillRect(f.x,f.y,f.w,f.h);ctx.fillStyle=rgba(col,0.9*lit);ctx.fillRect(f.x,f.y-2,f.w,4);}
    const nsz=Math.max(36,Math.min(56,f.h*0.62));ag_T(ctx,String(i+1),S.cx,f.y+Math.min(f.h*0.5+nsz*0.36,f.h-10*k),{w:800,size:nsz,align:"center",col:lit>0.4?col:[110,92,66]});
    // the stage's card on its step: it shows once its step has nearly sprung to full size, so its words never show small
    ctx.globalAlpha*=clamp((kk-0.85)/0.12,0,1);
    ag_box(ctx,S.x,S.y,S.w,S.h,18,{edge:lit>0.02?col:null,edgeA:0.35+0.6*lit,glow:lit>0.02?col:null,glowA:lit});
    ag_T(ctx,"STAGE "+(i+1),S.x+16,S.y+36,{w:700,size:28,ls:3,col:lit>0.4?col:[80,86,94]});
    const sa=clamp(sm*2-1,0,1),la=clamp(1-sm*2,0,1);
    if(sa>0)ag_T(ctx,SHORT[i],S.x+16,S.y+82,{w:700,size:30,a:sa});
    if(la>0)NAMES[i].forEach((l,j)=>ag_T(ctx,l,S.x+16,S.y+78+j*38,{w:700,size:32,a:la}));
    ctx.restore();}
  // the gates: a slim post and its knob before each step; a passed gate's knob turns green, with a tick
  for(let i=0;i<5;i++){const ga=arr(o.gates,i,0),G=out.gates[i];if(ga<=0)continue;const ps=clamp(arr(o.passed,i,0),0,1),top=G.y,bot=i?out.stages[i-1].top:y;
    ctx.save();ctx.globalAlpha*=ga;ctx.fillStyle="#4A4C52";ctx.fillRect(G.x-3,top,6,bot-top);ag_floorShadow(ctx,G.x+AG.sdx*0.5,bot+2,12,4,0.3);
    const kc=mix(BLUE,GREEN,ps);ctx.save();ctx.shadowColor=rgba(kc,0.5);ctx.shadowBlur=12;ctx.fillStyle=rgba(kc,1);ctx.beginPath();ctx.arc(G.x,top,15,0,TAU);ctx.fill();ctx.restore();
    if(ps>0.05)ag_tick(ctx,G.x,top+1,13,"rgba(255,255,255,"+ps+")",3.2);ctx.restore();}
  // the words of one gate, on a card, with a line to its knob
  const gw=o.gate;if(gw&&gw.a>0){const G=out.gates[gw.i],L=GATES[gw.i],kick="GATE TO STAGE "+(gw.i+1),
      cw=gw.w||Math.max(ag_tw(ctx,kick,{w:700,size:28,ls:4}),...L.map(l=>ag_tw(ctx,l,{w:700,size:36})))+56,chh=28+38+L.length*44+28,b={x:gw.x,y:gw.y,w:cw,h:chh};
    ctx.save();ctx.globalAlpha*=gw.a;ctx.strokeStyle=rgba(BLUE,0.6);ctx.lineWidth=2.4;ctx.setLineDash([8,7]);ctx.beginPath();
    const sx=clamp(G.x,b.x+30,b.x+b.w-30);ctx.moveTo(sx,b.y+b.h);ctx.lineTo(G.x,G.y-18);ctx.stroke();ctx.setLineDash([]);
    if(gw.k!=null)ag_about(ctx,b.x+cw/2,b.y+chh/2,lerp(0.8,1,gw.k));ag_box(ctx,b.x,b.y,cw,chh,22,{edge:BLUE,edgeA:0.5});
    ag_T(ctx,kick,b.x+28,b.y+50,{w:700,size:28,ls:4,col:BLUE});L.forEach((l,j)=>ag_T(ctx,l,b.x+28,b.y+66+44*(j+1),{w:700,size:36}));ctx.restore();}
  // a stage's three facts
  const fc=o.facts;if(fc&&fc.a>0){const F=FACTS[fc.i],rows=[["Whose identity",F[0]],["What it may do",F[1]],["The person",F[2]]],h=58+rows.length*70+20;
    ctx.save();ctx.globalAlpha*=fc.a;if(fc.k!=null)ag_about(ctx,fc.x+fc.w/2,fc.y+h/2,lerp(0.6,1,fc.k));
    ag_box(ctx,fc.x,fc.y,fc.w,h,22,{edge:BLUE,edgeA:0.5});
    ag_T(ctx,"STAGE "+(fc.i+1)+" · "+SHORT[fc.i].toUpperCase(),fc.x+28,fc.y+50,{w:700,size:28,ls:3,col:BLUE});
    rows.forEach((r,j)=>{const ry=fc.y+58+j*70;ag_T(ctx,r[0],fc.x+28,ry+30,{w:600,size:28,col:[86,92,100]});ag_T(ctx,r[1],fc.x+28,ry+64,{w:700,size:32});});
    ctx.restore();}
  ctx.restore();return out;}
