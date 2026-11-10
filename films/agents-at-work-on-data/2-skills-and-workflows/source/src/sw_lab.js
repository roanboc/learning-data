/* ===== Skills and workflows: the lab's pieces =====
   The module's room, Jun at his desk on the left, and what this film adds to it:
     sw_jun      the oak desk across the bottom left and Jun behind it, cut at its back edge, his arms down out of sight
     sw_file     a file from the example project, on a card: its path, then its lines (frontmatter in mono, headings, steps), each of
                 which can light up while the voice names it; the card scrolls when the file is longer than it
     sw_slim     a skill folded to what the agent reads of it all the time: its name and the line that says when to use it
     sw_cause    one of the causes met so far: how it shows, what settled it, who decided
     sw_rail     the nightly workflow: fixed steps in order on an oak rail, each idle, running, passed or failed; a step that calls the
                 agent is violet
     sw_chat, sw_note, sw_mail   where answers used to stay: one chat, one note, one email
     sw_clock    the time, on a tag
   Colours keep the module's meanings: blue a tool, a skill or a fixed step; violet the model; orange data coming back; green a check
   that passes; amber one that fails. Words are drawn live with ag_T, at least 28 px, above y 890. */

const SW_LAB={jun:[300,600,1],ring:[1124,476]};
const SW_DESK={x:-80,y:1000,w:800,depth:150};
function sw_jun(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const [jx,jy,js]=SW_LAB.jun,D=SW_DESK;ctx.save();ctx.globalAlpha*=a;
  ag_desk(ctx,D.x,D.y,D.w,{depth:D.depth});
  ag_person(ctx,"jun",jx,jy,js,{t,gaze:o.gaze,nod:o.nod||0,talk:o.talk||0,smile:o.smile||0,cut:D.y-D.depth});
  ctx.restore();}

// the example project's seven skills, as their files have them: the name, and the sentence of its description that says when to use it
// (the description's last, copied exactly, so "…" stands for the sentence before it); the router, the eighth file, is SW_ROUTER
const SW_SKILLS=[
  ["draft-a-model","… Use when a model's grain, contract and tests exist, or should, and the SQL doesn't yet."],
  ["draft-the-conceptual-model","… Use when a new question arrives, or an entity, key or identity rule needs writing down."],
  ["profile-a-source","… Use when a new source or table arrives, or before mapping its keys and codes to the model."],
  ["reconcile-and-diff","… Use before asking an owner to approve a change to the core or the marts."],
  ["review-for-governance","… Use on every pull request that changes models, sources, seeds or conceptual models."],
  ["review-metadata","… Use when docs change, before a release, or when someone asks where a definition lives."],
  ["sync-the-glossary","… Use on the scheduled review, when data governance announces a changed term, or when someone asks where a definition comes from."]];
const SW_RECON=3,SW_ROUTER=["choose-the-skill","… Use at the start of any job in this project, before any other skill."];
// the causes met so far, as the skill's file has them (skills/reconcile-and-diff/SKILL.md); the fourth is added on the night of the film
const SW_CAUSES=[
  {title:"Withdrew after census day",shows:"the count is under the census report.",settled:"they still count, as at census (DEC-PLN-02).",by:"Planning, the wallet app team and Noor."},
  {title:"A degree in no faculty",shows:"students under no faculty, beside a new degree.",settled:"every degree belongs to a faculty; the registrar's office names it.",by:"Mei Tanaka, registrar's office."},
  {title:"A student counted twice",shows:"one person with two learner keys.",settled:"a person decides two keys are one (DEC-STU-04).",by:"Mei Tanaka, registrar's office."},
  {title:"Test records",shows:"records made in one week, dated back months.",settled:"they never count (DEC-SIS-05).",by:"Mei Tanaka, registrar's office, 22 October 2026."}];
// the nightly workflow's fixed steps, in order; "Leave out test records" comes in on the night of the film, after Build
const SW_STEPS_NIGHT=["Build","Count as on census day","Run the tests","Compare with the census report"],SW_NEWSTEP="Leave out test records";
// the lab at night, its lamp in the far left corner, so the workflow's rail runs clear of its shade; sw_night lays the night's light over
// what stands in the room (the agent, the sandbox, a tool), drawn before it; the words and cards come after it, at full contrast
const SW_LAMP=[110,770];AG_PLACES.swNight=c=>ag_paintLab(c,{night:true,lamp:SW_LAMP});
const sw_night=x=>ag_roomLight(x,1,{night:true,lamp:SW_LAMP});
// something made of parts, faded as one: drawn whole into a scratch canvas, then laid on at opacity a. Drawn straight at a part
// opacity, each part fades on its own, and the agent's dark band shows through its sphere like a ghost
function sw_fade(ctx,a,fn){if(a<=0.004)return;if(a>=0.996){fn(ctx);return;}const [bc,bx]=ag_buf("swFade",ctx.canvas.width,ctx.canvas.height);
  bx.setTransform(ctx.getTransform());fn(bx);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}
// the agent, faded as one (o.only "light", its band's glow over the night, is drawn straight)
function sw_model(ctx,x,y,r,o){o=o||{};if(o.only)return ag_model(ctx,x,y,r,o);sw_fade(ctx,o.a==null?1:o.a,c=>ag_model(c,x,y,r,Object.assign({},o,{a:1})));}
// a dashed line from (x0, y0) to (x1, y1) with an arrowhead at its end; curve bends it through the corner (x0, y1)
function sw_link(ctx,x0,y0,x1,y1,col,a,curve){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,0.75);ctx.lineWidth=3;ctx.setLineDash([9,9]);ctx.beginPath();ctx.moveTo(x0,y0);
  let ang;if(curve){ctx.quadraticCurveTo(x0,y1,x1,y1);ang=x1<x0?Math.PI:0;}else{ctx.lineTo(x1,y1);ang=Math.atan2(y1-y0,x1-x0);}ctx.stroke();ctx.setLineDash([]);
  ag_arrowHead(ctx,x1,y1,ang,12,rgba(col,0.85));ctx.restore();}
// a row in a list: its words centred in a slim card; o.dashed (the next one, not met yet), o.edge, o.a, o.k; returns its box
function sw_row(ctx,x,y,w,text,o){o=o||{};const a=o.a==null?1:o.a,h=76;if(a<=0.01)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,18,{edge:o.edge||null,edgeA:0.85});if(o.dashed)sw_dash(ctx,x,y,w,h,o.edge||AG.blue,1);ag_T(ctx,text,x+28,y+h/2+11,{w:700,size:32});ctx.restore();return{x,y,w,h};}
// a line from a problem, above the six forms, round the right margin to its form b (a card in the right column); a, its opacity
function sw_toForm(ctx,x0,y0,b,a){if(a<=0.01)return;const ex=b.x+b.w+10,ey=b.y+b.h/2,mx=b.x+b.w+86;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.blue,0.75);ctx.lineWidth=3;ctx.setLineDash([9,9]);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.bezierCurveTo(mx,y0,mx,ey,ex+6,ey);ctx.stroke();ctx.setLineDash([]);ag_arrowHead(ctx,ex,ey,Math.PI,12,rgba(AG.blue,0.85));ctx.restore();}
// a card whose words have gone: soft grey lines where they were (an answer, filed away); la, the lines' own opacity
function sw_blank(ctx,x,y,w,h,a,la){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,22,{});la=la==null?1:la;if(la<=0.01){ctx.restore();return;}ctx.globalAlpha*=la;ctx.strokeStyle="rgba(60,50,40,0.26)";ctx.lineWidth=7;ctx.lineCap="round";
  for(const [f,lw] of [[0.4,0.62],[0.64,0.4]]){const ly=y+h*f;ctx.beginPath();ctx.moveTo(x+30,ly);ctx.lineTo(x+30+(w-60)*lw,ly);ctx.stroke();}ctx.restore();}
// a small rail of three steps, as an icon: plain, fixed steps
function sw_miniRail(ctx,cx,cy,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";
  for(const [c,lw] of [[AG_OAK.dark,8],[AG_OAK.base,5]]){ctx.strokeStyle=rgba(c,1);ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(cx-82,cy);ctx.lineTo(cx+82,cy);ctx.stroke();}
  for(let i=-1;i<=1;i++)ag_box(ctx,cx+i*52-20,cy-20,40,40,10,{edge:AG.blue,edgeA:0.9});ctx.restore();}
// the rail's steps laid out across the frame: n slots from x0 to x1 at y; returns [{x, y, w}]
function sw_slots(n,y,x0,x1){x0=x0==null?220:x0;x1=x1==null?1850:x1;const gap=24,w=(x1-x0-gap*(n-1))/n;return Array.from({length:n},(_,i)=>({x:x0+i*(w+gap),y,w}));}
// a number on a card: its kick, the number large, a line under it; o.num2 and o.m (0 to 1) turn it into another number; o.edge, o.a, o.k
function sw_num(ctx,x,y,w,kick,num,sub,o){o=o||{};const a=o.a==null?1:o.a,h=sub?200:160;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:0.9});
  ag_T(ctx,String(kick).toUpperCase(),x+28,y+52,{w:700,size:28,ls:4,col:o.kickCol||AG.kick});const m=o.num2?clamp(o.m||0,0,1):0;
  if(m<1)ag_T(ctx,num,x+28,y+124,{w:800,size:62,col:AG.ink,a:1-m});if(m>0)ag_T(ctx,o.num2,x+28,y+124,{w:800,size:62,col:o.col2||AG.ink,a:m});
  if(sub)ag_T(ctx,sub,x+28,y+170,{w:500,size:28,col:AG.mut});ctx.restore();return{x,y,w,h};}
// a mark at (x, y): "no" a grey cross (it doesn't fit), "yes" a green tick
function sw_mark(ctx,x,y,kind,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;if(kind==="yes")ag_tick(ctx,x,y,26,rgba(AG.green,1),4.5);
  else{ctx.strokeStyle=rgba(AG.mut,0.95);ctx.lineWidth=4.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-11,y-11);ctx.lineTo(x+11,y+11);ctx.moveTo(x+11,y-11);ctx.lineTo(x-11,y+11);ctx.stroke();}ctx.restore();}
// a dashed edge round a card: a draft, not yet approved
function sw_dash(ctx,x,y,w,h,col,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(col||AG.blue,0.85);ctx.lineWidth=2.6;rr(ctx,x+6,y+6,w-12,h-12,17);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- a file on a card
   lines: [{k, t, hi, a}] k "front" (frontmatter, mono: "key: value", the key in blue), "h1", "h2", "li" (a step), "p", "gap"; t the
   words; hi 0 to 1 lights it (a soft blue band and a bar at its left); a its own fade. The card is w by h from (x, y); its path heads it in
   mono; o.scroll moves the lines up by that many px inside it; o.a, o.k (springs from its centre), o.edge (a colour), o.draft (a dashed
   edge: a draft not yet approved). Returns each line's top, as drawn, in the frame */
const SW_FS={front:{w:500,size:28,f:"mono",lh:40},h1:{w:800,size:36,lh:54},h2:{w:700,size:32,lh:50},li:{w:500,size:28,lh:40},p:{w:500,size:28,lh:40},gap:{lh:18}};
function sw_layout(ctx,lines,inner){return lines.map(l=>{const st=SW_FS[l.k]||SW_FS.p;if(l.k==="gap")return{l,rows:[],h:st.lh};
  const rows=ag_wrap(ctx,l.t,inner-(l.k==="li"?34:0),{w:st.w,size:st.size,f:st.f});return{l,rows,h:rows.length*st.lh+(l.k==="h2"?6:0)};});}
// o.lw: the width its lines are laid out at, when the card grows to it (the lines keep their breaks as it opens, instead of a word
// jumping up to the line above in one frame each time one fits; the card shows what fits)
function sw_file(ctx,x,y,w,h,path,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return[];const head=74,inner=(o.lw||w)-56,L=sw_layout(ctx,lines,inner),tops=[];
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:0.85});
  if(o.draft){ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(o.edge||AG.blue,0.8);ctx.lineWidth=2.4;rr(ctx,x+6,y+6,w-12,h-12,18);ctx.stroke();ctx.restore();}
  ag_T(ctx,path,x+28,y+48,{w:500,size:28,f:"mono",col:AG.blue});
  ctx.strokeStyle="rgba(60,50,40,0.14)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+24,y+head);ctx.lineTo(x+w-24,y+head);ctx.stroke();
  ctx.save();ctx.beginPath();ctx.rect(x+2,y+head+2,w-4,h-head-6);ctx.clip();let yy=y+head+18-(o.scroll||0);
  for(const it of L){const l=it.l,st=SW_FS[l.k]||SW_FS.p,la=l.a==null?1:l.a,hi=clamp(l.hi||0,0,1);tops.push(yy);
    if(la>0.01&&it.rows.length){if(hi>0.01){ctx.fillStyle=rgba(AG.blue,0.1*hi*la);ctx.fillRect(x+14,yy-2,w-28,it.h+2);ctx.fillStyle=rgba(AG.blue,0.85*hi*la);ctx.fillRect(x+14,yy-2,5,it.h+2);}
      it.rows.forEach((r,i)=>{const by=yy+st.size+(st.lh-st.size)/2-4+i*st.lh;
        if(l.k==="front"){const c=r.indexOf(":");if(i===0&&c>0){const key=r.slice(0,c+1);ag_T(ctx,key,x+28,by,{w:500,size:28,f:"mono",col:AG.blue,a:la});
            ag_T(ctx,r.slice(c+1),x+28+ag_tw(ctx,key,{w:500,size:28,f:"mono"}),by,{w:500,size:28,f:"mono",a:la});}else ag_T(ctx,r,x+28,by,{w:500,size:28,f:"mono",a:la});}
        else if(l.k==="li")ag_T(ctx,r,x+28+(i?34:0),by,{w:st.w,size:st.size,a:la});
        else ag_T(ctx,r,x+28,by,{w:st.w,size:st.size,a:la,col:l.k==="h2"?AG.blue:AG.ink});});}
    yy+=it.h*(l.k==="gap"?1:clamp(l.grow==null?1:l.grow,0,1));}
  ctx.restore();
  // a soft fade where the lines leave the card at its foot
  const g=ctx.createLinearGradient(0,y+h-46,0,y+h-6);g.addColorStop(0,"rgba(238,236,231,0)");g.addColorStop(1,"rgba(238,236,231,0.95)");ctx.fillStyle=g;ctx.fillRect(x+4,y+h-46,w-8,40);
  ctx.restore();return tops;}
// the height a file's lines take, laid out at width w
function sw_fileH(ctx,w,lines){return sw_layout(ctx,lines,w-56).reduce((s,it)=>s+it.h,0)+74+36;}

/* ---------------------------------------------------------------- a skill, folded: its name and its line
   o.read 0 to 1 (a soft light passes over it: the agent reads its line), o.lit 0 to 1 (a blue edge: chosen), o.dim, o.a, o.k; o.rows 2
   gives its line two rows (the card is then 142 high, not 104) */
function sw_slim(ctx,x,y,w,name,desc,o){o=o||{};const a=o.a==null?1:o.a,h=o.rows===2?142:104;if(a<=0)return{x,y,w,h};const lit=clamp(o.lit||0,0,1),rd=clamp(o.read||0,0,1);
  ctx.save();ctx.globalAlpha*=a*(1-0.55*(o.dim||0));if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,18,{edge:lit>0.05?AG.blue:null,edgeA:0.9*lit,glow:lit>0.05?AG.blue:null,glowA:lit});
  if(rd>0.01&&rd<0.99){const sx=x+w*rd;const g=ctx.createLinearGradient(sx-120,0,sx+40,0);g.addColorStop(0,rgba(AG.violet,0));g.addColorStop(0.75,rgba(AG.violet,0.12));g.addColorStop(1,rgba(AG.violet,0));
    ctx.save();ctx.beginPath();rr(ctx,x,y,w,h,18);ctx.clip();ctx.fillStyle=g;ctx.fillRect(sx-120,y,160,h);ctx.restore();}
  ag_T(ctx,name,x+26,y+44,{w:500,size:28,f:"mono",col:lit>0.5?AG.blue:AG.ink});
  const mw=w-52,cut=d=>{if(ag_tw(ctx,d,{w:500,size:28})<=mw)return d;while(d.length>4&&ag_tw(ctx,d+"…",{w:500,size:28})>mw)d=d.slice(0,-1);return d.replace(/[ ,.;:]+$/,"")+"…";};
  if(o.rows===2){const L=ag_wrap(ctx,desc,mw,{w:500,size:28});ag_T(ctx,L[0],x+26,y+84,{w:500,size:28,col:AG.mut});if(L[1])ag_T(ctx,cut(L.slice(1).join(" ")),x+26,y+122,{w:500,size:28,col:AG.mut});}
  else ag_T(ctx,cut(desc),x+26,y+84,{w:500,size:28,col:AG.mut});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a cause met so far
   c {title, shows, settled, by}: three lines under its title; o.parts 0 to 3 (how many lines show), o.mark ("no": a grey cross, it doesn't
   fit; "yes": a green tick) with o.markA, o.edge, o.dashed (a new one, still a draft), o.a, o.k; returns its box */
function sw_causeH(ctx,w,c){const L=[["Shows",c.shows],["Settled",c.settled],["Decided by",c.by]];let n=0;for(const [k,v] of L)n+=ag_wrap(ctx,k+": "+v,w-56,{w:500,size:28}).length;return 28+44+n*38+22;}
function sw_cause(ctx,x,y,w,c,o){o=o||{};const a=o.a==null?1:o.a,h=sw_causeH(ctx,w,c);if(a<=0)return{x,y,w,h};const parts=o.parts==null?3:o.parts;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,18,{edge:o.edge||null,edgeA:0.85});
  if(o.dashed){ctx.save();ctx.setLineDash([10,9]);ctx.strokeStyle=rgba(o.edge||AG.blue,0.8);ctx.lineWidth=2.2;rr(ctx,x+5,y+5,w-10,h-10,14);ctx.stroke();ctx.restore();}
  ag_T(ctx,c.title,x+28,y+28+32,{w:700,size:32});let yy=y+28+44;
  [["Shows",c.shows],["Settled",c.settled],["Decided by",c.by]].forEach(([k,v],i)=>{const rows=ag_wrap(ctx,k+": "+v,w-56,{w:500,size:28}),pa=clamp(parts-i,0,1);
    rows.forEach((r,j)=>{if(pa>0.01){if(j===0){const kw=ag_tw(ctx,k+":",{w:700,size:28});ag_T(ctx,k+":",x+28,yy+30,{w:700,size:28,col:AG.mut,a:pa});ag_T(ctx,r.slice(k.length+1),x+28+kw,yy+30,{w:500,size:28,a:pa});}
      else ag_T(ctx,r,x+28,yy+30,{w:500,size:28,a:pa});}yy+=38;});});
  const mA=o.markA==null?1:o.markA;if(o.mark&&mA>0.01){const mx=x+w-44,my=y+46;ctx.save();ctx.globalAlpha*=mA;
    if(o.mark==="yes")ag_tick(ctx,mx,my,26,rgba(AG.green,1),4.5);else{ctx.strokeStyle=rgba(AG.mut,0.9);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(mx-10,my-10);ctx.lineTo(mx+10,my+10);ctx.moveTo(mx+10,my-10);ctx.lineTo(mx-10,my+10);ctx.stroke();}
    ctx.restore();}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the nightly workflow
   steps [{x, y, w, num, label, state, a, k, test}] on one rail: state 0 idle, 1 running (a blue light), 2 passed (green, a tick),
   3 failed (amber), 4 the agent's step (violet); test 0 to 1 hangs a small "test" tag under it. o.p 0 to 1 draws the rail; o.a */
function sw_rail(ctx,steps,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||!steps.length)return;ctx.save();ctx.globalAlpha*=a;const h=124,p=o.p==null?1:o.p;
  const y=steps[0].y+h/2,x0=steps[0].x-30,x1=steps[steps.length-1].x+steps[steps.length-1].w+30,xe=lerp(x0,x1,ag_sine(p));
  if(p>0){ctx.lineCap="round";ctx.strokeStyle=rgba(AG.shadow,0.14);ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(x0+AG.sdx,y+10);ctx.lineTo(xe+AG.sdx,y+10);ctx.stroke();
    ctx.strokeStyle=rgba(AG_OAK.dark,1);ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(xe,y);ctx.stroke();ctx.strokeStyle=rgba(AG_OAK.base,1);ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(xe,y);ctx.stroke();
    ctx.strokeStyle=rgba(AG_OAK.hi,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y-3);ctx.lineTo(xe,y-3);ctx.stroke();}
  for(const s of steps){const sa=s.a==null?1:s.a;if(sa<=0.01)continue;const col=s.state===2?AG.green:s.state===3?AG.amber:s.state===4?AG.violet:s.state===1?AG.blue:null;
    ctx.save();ctx.globalAlpha*=sa;if(s.k!=null)ag_about(ctx,s.x+s.w/2,s.y+h/2,lerp(0.6,1,clamp(s.k,0,1.2)));
    ag_box(ctx,s.x,s.y,s.w,h,20,{edge:col,edgeA:0.9,glow:s.state===1||s.state===4?col:null,glowA:s.state===1||s.state===4?0.8:0});
    ag_T(ctx,String(s.num),s.x+26,s.y+46,{w:500,size:28,f:"mono",col:col||AG.blue});
    const rows=ag_wrap(ctx,s.label,s.w-40,{w:700,size:30});rows.slice(0,2).forEach((r,i)=>ag_T(ctx,r,s.x+26,s.y+(rows.length>1?82:90)+i*34,{w:700,size:30,col:s.state===4?AG.violet:AG.ink}));
    if(s.state===2)ag_tick(ctx,s.x+s.w-38,s.y+38,24,rgba(AG.green,1),4);else if(s.state===3)ag_warn(ctx,s.x+s.w-38,s.y+38,30,rgba(AG.amber,1));
    if(s.test>0.01)ag_pill(ctx,s.x+s.w/2,s.y+h+44,"with a test",{col:AG.green,icon:"tick",a:s.test,size:28});
    ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- where an answer used to stay */
// a chat: a window with two bubbles, the person's (o.ask, its words, if given) and the agent's (its edge violet); o.a, o.k, o.label
// (on a tag under it)
function sw_chat(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,18,{});ctx.fillStyle="rgba(60,50,40,0.08)";ctx.fillRect(x+2,y+2,w-4,30);for(let i=0;i<3;i++){ctx.fillStyle="rgba(60,50,40,0.25)";ctx.beginPath();ctx.arc(x+22+i*18,y+17,5,0,TAU);ctx.fill();}
  if(o.ask){ag_box(ctx,x+20,y+50,w-40,66,14,{});ag_T(ctx,o.ask,x+42,y+93,{w:700,size:28,col:AG.ink});ag_box(ctx,x+w*0.2,y+134,w*0.76,h-134-22,14,{edge:AG.violet,edgeA:0.5});
    ctx.strokeStyle="rgba(60,50,40,0.3)";ctx.lineWidth=3;ctx.lineCap="round";for(const [f,lw] of [[0.3,0.56],[0.5,0.62],[0.7,0.4]]){const ly=y+134+(h-156)*f;ctx.beginPath();ctx.moveTo(x+w*0.2+22,ly);ctx.lineTo(x+w*0.2+22+w*lw,ly);ctx.stroke();}
    ctx.restore();if(o.label)ag_label(ctx,x+w/2,y+h+50,o.label,{align:"center",col:AG.mut,a});return;}
  ag_box(ctx,x+20,y+50,w*0.62,h*0.24,14,{});ag_box(ctx,x+w*0.32,y+60+h*0.28,w*0.6,h*0.26,14,{edge:AG.violet,edgeA:0.5});
  ctx.strokeStyle="rgba(60,50,40,0.3)";ctx.lineWidth=3;ctx.lineCap="round";for(const [lx,ly,lw] of [[x+36,y+50+h*0.1,w*0.4],[x+w*0.32+16,y+60+h*0.38,w*0.4],[x+w*0.32+16,y+60+h*0.46,w*0.28]]){ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+lw,ly);ctx.stroke();}
  ctx.restore();if(o.label)ag_label(ctx,x+w/2,y+h+50,o.label,{align:"center",col:AG.mut,a});}
// a note: a square of paper, a little turned, its corner folded
function sw_note(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+w/2);ctx.rotate(-0.04);if(o.k!=null){const s=lerp(0.6,1,clamp(o.k,0,1.2));ctx.scale(s,s);}ctx.translate(-w/2,-w/2);
  ctx.shadowColor=AG.card.shadow;ctx.shadowBlur=26;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=12;ctx.fillStyle="#EFE6C8";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(w,0);ctx.lineTo(w,w-34);ctx.lineTo(w-34,w);ctx.lineTo(0,w);ctx.closePath();ctx.fill();
  ctx.shadowColor="transparent";ctx.fillStyle="#D9CDA8";ctx.beginPath();ctx.moveTo(w,w-34);ctx.lineTo(w-34,w-34);ctx.lineTo(w-34,w);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(60,50,40,0.35)";ctx.lineWidth=3;ctx.lineCap="round";for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(24,36+i*30);ctx.lineTo(w-30-(i%2)*30,36+i*30);ctx.stroke();}
  ctx.restore();if(o.label)ag_label(ctx,x+w/2,y+w+50,o.label,{align:"center",col:AG.mut,a});}
// an email: an envelope
function sw_mail(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=w*0.64;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,12,{});ctx.strokeStyle="rgba(60,50,40,0.3)";ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x+8,y+8);ctx.lineTo(x+w/2,y+h*0.56);ctx.lineTo(x+w-8,y+8);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+8,y+h-8);ctx.lineTo(x+w*0.4,y+h*0.46);ctx.moveTo(x+w-8,y+h-8);ctx.lineTo(x+w*0.6,y+h*0.46);ctx.stroke();ctx.restore();
  if(o.label)ag_label(ctx,x+w/2,y+h+50,o.label,{align:"center",col:AG.mut,a});}

// the time on a tag, with a small clock face; (x, y) its centre
function sw_clock(ctx,x,y,text,a){if(a<=0.01)return;const b=ag_pill(ctx,x,y,text,{a,size:30,icon:"clock"});ctx.save();ctx.globalAlpha*=a;const cx=b.x+40,cy=y;
  ctx.strokeStyle=rgba(AG.ink,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,13,0,TAU);ctx.stroke();ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,cy-8);ctx.moveTo(cx,cy);ctx.lineTo(cx+6,cy+2);ctx.stroke();ctx.restore();}
