/* ===== Hot, warm, cold: the film's own pictures =====
   Drawn with the module's look (films/data-that-moves/shared/src/: MD's colours, glass cards, lanes of light, the map's parts and
   its people), over the module's places and this film's own (hw_places.js). Every top-level name starts with hw_ or HW_.

   Temperature here is how soon data must arrive for the action it serves: hot, within a second or less, usually for a machine that
   acts on its own; warm, within minutes or hours; cold, days or weeks later. It isn't one of the module's colours, so it never takes
   one: it's shown by how data moves, and always said in words. Hot data sits at the top, its events running one by one; warm data in
   the middle, in small batches on a clock; cold data at the foot, one batch a night, still between its runs, under frost. The light
   on each band is only a tint of white: warm white for hot, cool white for cold, never the red of an error, the amber of a person's
   turn or the blue of data moving.
     hw_scr(ctx, S, fn)                  draw in the frame, whatever the camera does
     hw_thermo(ctx, x, y, h, level, o)   a thermometer: its glass, and its column of light up to level (0 cold, 1 hot)
     hw_bands(ctx, x, y, w, o)           the three temperatures, one band each, hot at the top: o.on [hot, warm, cold] (0 to 1, each
                                         springs in), o.hl a band's index (the others dim), o.h, o.lines (false: names only), o.t;
                                         returns each band's box
     hw_frost(ctx, x, y, w, h, a, r)     frost on glass, over a box
     hw_tempTag(ctx, x, y, key, o)       a small tag: a thermometer and the word (HOT, WARM, COLD)
     hw_pin(ctx, x, y, o)                a town on the opening's map, and its label
     hw_arc(a, b, lift)                  a lane's points from a to b, bowed up by lift
     hw_pigeon(ctx, x, y, s, o)          a homing pigeon seen from above; hw_flock(ctx, pts, t, o) birds flying a lane
     hw_wire(ctx, pts, t, o)             a telegraph wire on its poles, its pulses running along it
     hw_timeline(ctx, x, y, w, o)        the moments of a pay week, in order: a change in HR, claims close, the night's load, pay day
     hw_app(ctx, x, y, w, h, o)          the claims app's page: claims, by unit and duty, and where each stands (never an amount)
     hw_bars(ctx, x, y, w, o)            each faculty's spending this year against its budget, as bars without figures
     hw_code(ctx, x, y, lines, o)        lines of code, in IBM Plex Mono
     hw_rows(ctx, t, o)                  three kinds of data on their way across the map, hot at the top: a bank account change, the
                                         contracts, each faculty's spending, each from where it's born, through the platform, to who
                                         acts on it */

const HW={heat:[255,224,196],frost:[206,226,252],snow:[236,243,255],seed:[226,206,160]};
const HW_BAND=[{key:"hot",n:"Hot",tint:[255,224,196],lvl:0.92},{key:"warm",n:"Warm",tint:[238,232,222],lvl:0.55},{key:"cold",n:"Cold",tint:[206,226,252],lvl:0.12}];
const hw_band=k=>HW_BAND.find(b=>b.key===k)||HW_BAND[0];

function hw_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// a phase for what is shown and then put away: 0 before tIn, 1 from tIn+din, back to 0 from tOut over dout
const hw_io=(t,tIn,tOut,din,dout)=>ag_in(t,tIn,din||0.5)*(1-ag_in(t,tOut,dout||0.5));

/* ---------------------------------------------------------------- the thermometer */
function hw_thermo(ctx,x,y,h,level,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=o.w||26,r=w*0.95,top=y,bot=y+h,lv=clamp(level,0,1),col=mix(HW.frost,HW.heat,lv);
  ctx.save();ctx.globalAlpha*=a;
  // the glass: a tube and its bulb
  ctx.beginPath();ctx.moveTo(x-w/2,top+w/2);ctx.arc(x,top+w/2,w/2,Math.PI,0);ctx.lineTo(x+w/2,bot-r*0.7);ctx.arc(x,bot,r,-Math.PI/2+0.55,Math.PI*1.5-0.55);ctx.closePath();
  ctx.fillStyle="rgba(10,17,35,0.92)";ctx.fill();ctx.strokeStyle=rgba(MD.soft,0.85);ctx.lineWidth=2.4;ctx.stroke();
  // the column of light, up to the level
  const ch=(h-w)*lv,cw=w*0.46;glow(ctx,x,bot,r*2.2,col,0.35);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,bot,r*0.68,0,TAU);ctx.fill();
  if(ch>0){rr(ctx,x-cw/2,bot-r*0.5-ch,cw,ch+r*0.5,cw/2);ctx.fill();}
  // its marks: hot at the top, cold at the foot
  if(o.marks!==false)for(const b of HW_BAND){const yy=bot-r*0.5-(h-w)*b.lvl;ctx.strokeStyle=rgba(MD.soft,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w/2+4,yy);ctx.lineTo(x+w/2+16,yy);ctx.stroke();
    if(o.labels)md_T(ctx,b.n.toUpperCase(),x+w/2+26,yy+10,{w:800,size:28,ls:3,col:b.tint});}
  ctx.restore();}

/* ---------------------------------------------------------------- frost on glass, painted once and laid over a box */
function hw_frostTex(){return ag_kept("hwFrost",1024,512,(c,w,h)=>{const rnd=ag_rnd(1802);
  // soft white at the edges, as frost gathers there first
  for(const [x,y,r] of [[0,0,420],[w,0,380],[0,h,360],[w,h,420],[w*0.5,h,300]]){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,"rgba(236,244,255,0.5)");g.addColorStop(1,"rgba(236,244,255,0)");c.fillStyle=g;c.fillRect(0,0,w,h);}
  // its crystals: short branching strokes, densest near the edges
  c.lineCap="round";for(let i=0;i<520;i++){const ex=rnd(),x=ex<0.5?Math.pow(rnd(),2)*w*0.6:w-Math.pow(rnd(),2)*w*0.6,y=rnd()<0.5?Math.pow(rnd(),1.6)*h:h-Math.pow(rnd(),1.6)*h,l=4+rnd()*16,an=rnd()*TAU;
    c.strokeStyle="rgba(236,244,255,"+(0.12+rnd()*0.3).toFixed(3)+")";c.lineWidth=0.8+rnd()*1.2;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(an)*l,y+Math.sin(an)*l);
    for(const s of[-1,1]){const k=0.5,bx=x+Math.cos(an)*l*k,by=y+Math.sin(an)*l*k;c.moveTo(bx,by);c.lineTo(bx+Math.cos(an+s*0.9)*l*0.4,by+Math.sin(an+s*0.9)*l*0.4);}c.stroke();}
  for(let i=0;i<1600;i++){c.fillStyle="rgba(236,244,255,"+(0.05+rnd()*0.18).toFixed(3)+")";const z=0.8+rnd()*1.8;c.fillRect(rnd()*w,rnd()*h,z,z);}});}
function hw_frost(ctx,x,y,w,h,a,r){if(!(a>0.004))return;ctx.save();ctx.globalAlpha*=clamp(a,0,1);rr(ctx,x,y,w,h,r==null?16:r);ctx.clip();ctx.drawImage(hw_frostTex(),x,y,w,h);ctx.restore();}

/* ---------------------------------------------------------------- the three temperatures */
const HW_LINES=[["acted on within a second or less","each event, the moment it happens"],
  ["acted on within minutes or hours","small batches, every few minutes or hours"],
  ["acted on days or weeks later","a batch, each night or each week"]];
function hw_bands(ctx,x,y,w,o){o=o||{};const on=o.on||[1,1,1],h=o.h||150,gap=o.gap||20,boxes=[];
  HW_BAND.forEach((b,i)=>{const yy=y+i*(h+gap),box={x,y:yy,w,h};boxes.push(box);const k=on[i]||0;if(k<=0.004)return;const dim=o.hl==null?1:o.hl===i?1:0.42;
    ctx.save();ctx.globalAlpha*=ag_in(k,0,0.35)*dim;ag_about(ctx,x+w/2,yy+h/2,lerp(0.94,1,Math.min(1,ag_spr(k,0,0.5))));
    md_card(ctx,x,yy,w,h,{edge:b.tint,glow:i===0?0.9:0.5,edgeA:0.7,fill:"rgba(11,19,38,0.94)"});
    // the band's light: warm white low along a hot band, frost over a cold one
    if(i===0){const g=ctx.createLinearGradient(0,yy,0,yy+h);g.addColorStop(0,rgba(b.tint,0.02));g.addColorStop(1,rgba(b.tint,0.12));ctx.fillStyle=g;rr(ctx,x,yy,w,h,18);ctx.fill();}
    if(i===2)hw_frost(ctx,x,yy,w,h,0.55,18);
    hw_thermo(ctx,x+52,yy+22,h-62,b.lvl,{w:20,marks:false});
    md_T(ctx,b.n.toUpperCase(),x+96,yy+(o.lines===false?h/2+12:54),{w:800,size:o.lines===false?36:32,ls:5,col:b.tint});
    if(o.lines!==false){const L=(o.text&&o.text[i])||HW_LINES[i];md_T(ctx,L[0],x+96,yy+96,{w:600,size:28,col:MD.ink});if(L[1])md_T(ctx,L[1],x+96,yy+134,{w:600,size:28,col:MD.soft});}
    // a hot band's changes run along it all the time; a warm band's clock; a cold band is still
    if(i===0&&o.t!=null&&o.flow!==false){const pts=[[x+w-330,yy+h-26],[x+w-30,yy+h-26]];md_flow(ctx,pts,o.t,{kind:"events",col:b.tint,every:0.5,dur:1.2,size:0.6});}
    if(i===1&&o.clock!==false)md_icon(ctx,"clock",x+w-58,yy+52,40,b.tint);
    if(i===2&&o.lock)md_icon(ctx,"lock",x+w-58,yy+52,36,MD.personal);
    ctx.restore();});
  return boxes;}
// a small tag: a thermometer and the temperature's name
function hw_tempTag(ctx,x,y,key,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const b=hw_band(key),txt=(o.text||b.n).toUpperCase(),tw=md_tw(ctx,txt,{w:800,size:28,ls:4}),w=tw+82,h=56,bx=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,bx+w/2,y,lerp(0.6,1,ag_spr(o.k,0,0.5)));md_card(ctx,bx,y-h/2,w,h,{edge:b.tint,r:h/2,glow:0.6,fill:"rgba(7,12,26,0.94)"});
  if(key==="cold")hw_frost(ctx,bx,y-h/2,w,h,0.45,h/2);hw_thermo(ctx,bx+30,y-18,30,b.lvl,{w:10,marks:false});md_T(ctx,txt,bx+52,y+10,{w:800,size:28,ls:4,col:b.tint});ctx.restore();return{x:bx,y:y-h/2,w,h};}

/* ---------------------------------------------------------------- the opening's map: places and the lanes between them */
// a place: a point of light (o.col: warm for seeds in use, frost for the vault), o.lit (0 to 1), o.out (0 to 1: its light gone, a ring
// left), o.label {title, sub} on o.side ("right", "left", "above" or "below"), o.k springs it in
function hw_pin(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const col=o.col||HW.heat,lit=o.lit==null?1:o.lit,out=o.out||0;ctx.save();ctx.globalAlpha*=a;
  // the point springs in; its label only fades, so its words never shrink below their size
  ctx.save();if(o.k!=null)ag_about(ctx,x,y,lerp(0.4,1,Math.min(1.2,ag_spr(o.k,0,0.5))));
  glow(ctx,x,y,46,col,0.55*lit*(1-out));ctx.beginPath();ctx.arc(x,y,13,0,TAU);ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.stroke();
  ctx.fillStyle=rgba(col,(1-out)*(0.4+0.6*lit));ctx.beginPath();ctx.arc(x,y,7,0,TAU);ctx.fill();ctx.restore();
  if(o.label){const L=o.label,side=o.side||"right",la=o.labelA==null?1:o.labelA,tw=Math.max(md_tw(ctx,L.title,{w:800,size:30}),L.sub?md_tw(ctx,L.sub,{w:600,size:28}):0);
    let lx=side==="left"?x-28-tw:side==="right"?x+28:x-tw/2,ly=side==="above"?y-(L.sub?78:40):side==="below"?y+52:y+(L.sub?-6:10);
    ctx.save();ctx.globalAlpha*=la;md_T(ctx,L.title,lx,ly,{w:800,size:30,col:MD.ink});if(L.sub)md_T(ctx,L.sub,lx,ly+36,{w:600,size:28,col:MD.soft});ctx.restore();}
  ctx.restore();}
// a lane's points from a to b, bowed up by lift (px)
function hw_arc(a,b,lift){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2-(lift||0);return bez(P(a[0],a[1]),P(lerp(a[0],mx,0.7),lerp(a[1],my,0.7)),P(lerp(b[0],mx,0.7),lerp(b[1],my,0.7)),P(b[0],b[1]),40).map(p=>[p.x,p.y]);}
/* ---------------------------------------------------------------- the opening's pigeons
   A homing pigeon seen from above, as the map sees it, flying along +x: a body that tapers from the breast to the tail's fan, a small
   round head and its beak, and two long wings from the shoulders, each tapering to its tip, their span opening and closing with
   o.flap (a phase, in turns). Grey-blue with darker tips and a pale edge where the map's light catches it; o.slip a thin slip of paper
   at its leg. hw_pigeon(ctx, x, y, s, o): o.dir its heading (radians), o.a. hw_flock(ctx, pts, t, o): birds along a lane, one every
   o.every s, each crossing in o.dur s, flapping as they go; o.a, o.off, o.s (size). */
const HW_DOVE={body:[150,164,192],dark:[96,108,136],edge:[226,234,252],slip:[244,236,214]};
function hw_pigeon(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const D=HW_DOVE,fl=Math.cos((o.flap||0)*TAU),span=lerp(0.42,1,0.5+0.5*fl),sweep=lerp(0.5,0.1,0.5+0.5*fl);
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.dir||0);ctx.scale(s,s);
  glow(ctx,0,0,58,D.edge,0.22);
  // the wings: each from the shoulder, its leading edge a long curve to the tip, its trailing edge back to the body, tapering
  for(const side of[-1,1]){const tipX=-14-26*sweep,tipY=side*58*span,midY=side*30*span;
    ctx.beginPath();ctx.moveTo(8,side*5);ctx.bezierCurveTo(12,midY,tipX+18,tipY*0.92,tipX,tipY);ctx.bezierCurveTo(tipX-2,tipY*0.7,-10,midY*0.6,-12,side*6);ctx.closePath();
    const g=ctx.createLinearGradient(0,0,0,tipY);g.addColorStop(0,rgba(D.body,1));g.addColorStop(0.7,rgba(mix(D.body,D.dark,0.4),1));g.addColorStop(1,rgba(D.dark,1));ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle=rgba(D.edge,0.75);ctx.lineWidth=1.6/s;ctx.stroke();
    // two dark bars across the wing, as a pigeon's wing has
    ctx.strokeStyle=rgba(D.dark,0.8);ctx.lineWidth=2.2/s;for(const k of[0.38,0.52]){ctx.beginPath();ctx.moveTo(lerp(4,tipX,k*0.6),side*lerp(8,Math.abs(tipY),k));ctx.lineTo(lerp(-6,tipX,k*0.6),side*lerp(7,Math.abs(tipY),k)*0.96);ctx.stroke();}}
  // the tail's fan, and the body tapering to it
  ctx.beginPath();ctx.moveTo(-14,-5);ctx.quadraticCurveTo(-30,-11,-38,-10);ctx.quadraticCurveTo(-41,0,-38,10);ctx.quadraticCurveTo(-30,11,-14,5);ctx.closePath();ctx.fillStyle=rgba(D.dark,1);ctx.fill();ctx.strokeStyle=rgba(D.edge,0.6);ctx.lineWidth=1.2/s;ctx.stroke();
  ctx.beginPath();ctx.moveTo(20,0);ctx.bezierCurveTo(18,-9,0,-10,-16,-5);ctx.quadraticCurveTo(-20,0,-16,5);ctx.bezierCurveTo(0,10,18,9,20,0);ctx.closePath();
  let g=ctx.createLinearGradient(0,-10,0,10);g.addColorStop(0,rgba(mix(D.body,D.edge,0.35),1));g.addColorStop(1,rgba(D.body,1));ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=rgba(D.edge,0.8);ctx.lineWidth=1.4/s;ctx.stroke();
  // the head, a little darker, and its beak
  ctx.beginPath();ctx.arc(24,0,6.5,0,TAU);ctx.fillStyle=rgba(mix(D.body,D.dark,0.35),1);ctx.fill();ctx.strokeStyle=rgba(D.edge,0.8);ctx.lineWidth=1.2/s;ctx.stroke();
  ctx.beginPath();ctx.moveTo(29.5,-1.6);ctx.lineTo(35,0);ctx.lineTo(29.5,1.6);ctx.closePath();ctx.fillStyle=rgba([214,196,170],1);ctx.fill();
  // the slip of paper it carries, rolled at its leg
  if(o.slip){ctx.save();ctx.globalAlpha*=o.slip;rr(ctx,-10,6,13,5,2);ctx.fillStyle=rgba(D.slip,1);ctx.fill();ctx.restore();}
  ctx.restore();}
function hw_flock(ctx,pts,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const p=mk(pts.map(q=>P(q[0],q[1])));
  spawn(t,o.every||1.2,o.dur||3.2,o.off||0,(u,i)=>{if(u<0||u>1)return;const e=lerp(u,ease(u),0.4),q=at(p,e),q2=at(p,Math.min(1,e+0.01)),f=sstep(0,0.1,u)*(1-sstep(0.9,1,u))*a;if(f<=0.004)return;
    const wob=Math.sin(t*2.1+i*1.7)*6;hw_pigeon(ctx,q.x,q.y+wob,o.s||0.62,{dir:Math.atan2(q2.y-q.y,q2.x-q.x),flap:t*3.1+i*0.37,a:f,slip:1});});}
// a telegraph wire between towns: a lane of light on its poles, with words running along it as pulses (o.u how far it's strung)
function hw_wire(ctx,pts,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u;md_lane(ctx,pts,MD.flow,0.85*a,{u});
  // its poles, about every 70 px along it, as far as it's strung
  let run=0,next=0;for(let i=0;i<pts.length;i++){if(i>0)run+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);if(i/(pts.length-1)>u)break;
    if(run>=next){const [x,y]=pts[i];ctx.fillStyle=rgba(MD.flow,0.8*a);ctx.beginPath();ctx.arc(x,y,3.4,0,TAU);ctx.fill();next=run+70;}}
  if(u>=1&&o.flow!==false)md_flow(ctx,pts,t,{kind:"events",col:MD.flow,a,every:o.every||0.7,dur:o.dur||1.4,size:0.7,back:o.back});}

/* ---------------------------------------------------------------- the warm chapter's week
   The moments that decide when a tutor is paid, in order and equally spaced (not to scale): o.stops [{t: "Monday 09:00", s: "a change
   in HR", col, a}], each a point on the line with its time and what happens under it; o.span [{from, to, col, a, dash}] a lane
   along the line between two stops (fractions allowed: the change, on its way to the app); o.t for a dashed lane's motion; o.a. */
function hw_timeline(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const st=o.stops||[],n=st.length,dx=w/Math.max(1,n-1),X=i=>x+i*dx;ctx.save();ctx.globalAlpha*=a;
  md_card(ctx,x-150,y-60,w+300,200,{fill:"rgba(9,15,31,0.92)"});
  ctx.strokeStyle=rgba(MD.dim,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-110,y);ctx.lineTo(x+w+110,y);ctx.stroke();
  for(const sp of o.span||[]){const sa=sp.a==null?1:sp.a;if(sa<=0.004)continue;md_lane(ctx,[[X(sp.from),y],[X(sp.to),y]],sp.col||MD.flow,sa,{dash:sp.dash,t:o.t});}
  st.forEach((m,i)=>{const ma=m.a==null?1:m.a;if(ma<=0.004)return;ctx.save();ctx.globalAlpha*=ma;const mx=X(i),col=m.col||MD.ink;
    glow(ctx,mx,y,24,col,0.6);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(mx,y,9,0,TAU);ctx.fill();
    md_T(ctx,m.t,mx,y+54,{w:800,size:28,align:"center",col});if(m.s)md_T(ctx,m.s,mx,y+94,{w:600,size:28,align:"center",col:MD.soft});ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the claims app
   Its page, as the app's own: claims, each with its unit and duty, and where it stands (waiting for its coordinator, approved).
   Never an amount: a claim's amount is a person's pay. o.rows [[unit, duty, state], ...], state "waiting" or "approved";
   o.rowA (row, i) => opacity; o.lit; o.title. */
function hw_app(ctx,x,y,w,h,o){o=o||{};const st={waiting:{s:"waiting",col:MD.wait,icon:"clock"},approved:{s:"approved",col:MD.pass,icon:"tick"},check:{s:"checking",col:MD.soft,icon:"refresh"}};
  return md_window(ctx,x,y,w,h,{product:"Claims app",title:o.title||"Claims",a:o.a,k:o.k,edge:o.edge,draw:(c,b)=>{
    md_rows(c,b.x+6,b.y,[{h:"Unit",w:150,f:"mono"},{h:"Duty",w:160},{h:"",w:Math.max(160,b.w-322)}],
      (o.rows||[]).map(r=>{const s=st[r[2]]||{s:r[2],col:MD.soft};return[r[0],r[1],{s:s.s,col:s.col,icon:s.icon}];}),{rh:56,rowA:o.rowA,lit:o.lit,litCol:o.litCol});}});}

/* ---------------------------------------------------------------- spending against budget, by faculty
   Four faculties, each a bar for what it has spent this year against its budget (the budget a dashed mark), with no figures: the
   film shows how the answer is kept, not what it says. o.spent [0 to 1, ...] how far each bar has run; o.a; returns its box. */
const HW_FACULTIES=["Arts","Business","Engineering","Health"],HW_SPENT=[0.71,0.64,0.69,0.74];
function hw_bars(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=330;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  md_card(ctx,x,y,w,h,{edge:o.edge,glow:0.5});md_T(ctx,o.title||"Spent this year, against budget",x+28,y+52,{w:700,size:30});
  const bx=x+230,bw=w-262;HW_FACULTIES.forEach((f,i)=>{const yy=y+102+i*58,s=(o.spent?o.spent[i]:1)*HW_SPENT[i];md_T(ctx,f,x+28,yy+10,{w:600,size:28,col:MD.soft});
    rr(ctx,bx,yy-12,bw,24,12);ctx.fillStyle="rgba(150,175,215,0.12)";ctx.fill();if(s>0){rr(ctx,bx,yy-12,bw*s,24,12);ctx.fillStyle=rgba(o.col||MD.dom.finance,0.85);ctx.fill();}
    ctx.strokeStyle=rgba(MD.ink,0.7);ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(bx+bw*0.86,yy-22);ctx.lineTo(bx+bw*0.86,yy+22);ctx.stroke();ctx.setLineDash([]);});
  md_T(ctx,"budget",bx+bw*0.86,y+h-16,{w:600,size:28,align:"center",col:MD.soft});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- code
   lines [{s, col, hl}], in IBM Plex Mono, 28 px, 44 apart; o.hl a line's index (or several) on a band of light; o.n how many lines
   are shown (they come in one by one); o.a */
function hw_code(ctx,x,y,lines,o){o=o||{};const a=o.a==null?1:o.a,lh=o.lh||44,hls=o.hl==null?[]:[].concat(o.hl);if(a<=0.004)return lines.length*lh;ctx.save();ctx.globalAlpha*=a;
  lines.forEach((l,i)=>{const L=typeof l==="string"?{s:l}:l,k=o.n==null?1:clamp(o.n-i,0,1);if(k<=0.004)return;const yy=y+i*lh;ctx.save();ctx.globalAlpha*=k;
    if(hls.includes(i)){ctx.fillStyle=rgba(o.hlCol||MD.flow,0.13);rr(ctx,x-12,yy-32,(o.w||900),lh,8);ctx.fill();}
    md_T(ctx,L.s,x,yy,{w:500,size:28,f:"mono",col:L.col||MD.ink});ctx.restore();});ctx.restore();return lines.length*lh;}

/* ---------------------------------------------------------------- three kinds of data, each on its way across the map
   The film's own close-up of the platform map: three rows, each a kind of data from where it's born (left), through the platform
   (the middle, on Databricks' pane), to who acts on it (right), hot at the top: a change to a bank account (personal: lilac, with a
   lock), from the HR system to payroll, which holds a pay at once; the contracts, from the HR system to the claims app, every five
   minutes; each faculty's spending, from the finance system's ledger to Finance's and the faculties' morning look, each night. Each
   row moves as its temperature has it: events one by one, small batches, one batch a night. o.on [0 to 1, ...] each row comes in;
   o.hl a row's index (the others dim); o.therm (0 to 1) a thermometer on each table, its level unknown; o.temp [0 to 1, ...] each
   row's temperature found: the column settles at its level, and its tag comes in; o.say [words, ...] a line under each row's table,
   o.sayA [0 to 1, ...]; o.night (over 0.5: every row moves once a night, as until September); o.t; o.a. */
const HW_PAYROLL=[176,190,222];
const HW_ROWS=[{sys:"hr",name:"bank_account_changes",reader:"Payroll",rsub:"holds a pay at once",icon:"lock",personal:true,flow:{kind:"events",every:0.45}},
  {sys:"hr",name:"contracts",reader:"Claims app",rsub:"checks each claim",icon:"doc",flow:{kind:"batch",every:1.8,size:0.55}},
  {sys:"fin",name:"spending_by_faculty",reader:"Each morning",rsub:"Finance, the faculties",icon:"person",flow:{kind:"batch",every:4.6}}];
const HW_ROW={y:[222,442,662],sx:96,sw:404,px:600,pw:700,tx:650,tw:600,rx:1420,rw:420};
function hw_rows(ctx,t,o){o=o||{};const a=o.a==null?1:o.a,R=HW_ROW,on=o.on||[1,1,1],tp=o.temp||[0,0,0];if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  const pa=Math.max(on[0],on[1],on[2]);md_platform(ctx,R.px,150,R.pw,670,{a:ag_in(pa,0,0.4),logos:true});
  HW_ROWS.forEach((r,i)=>{const k=on[i]||0;if(k<=0.004)return;const y=R.y[i],dim=o.hl==null?1:o.hl===i?1:0.38,b=HW_BAND[i];
    ctx.save();ctx.globalAlpha*=ag_in(k,0,0.4)*dim;
    const sb=md_system(ctx,R.sx,y,R.sw,r.sys,{}),ty=y+19,tb={x:R.tx,y:ty,w:R.tw,h:72},col=r.personal?MD.personal:MD.flow;
    md_table(ctx,tb.x,tb.y,tb.w,{name:r.name,col,icon:r.personal?"lock":"table"});
    const rb=md_reader(ctx,R.rx,y,R.rw,{title:r.reader,sub:r.rsub,icon:r.icon,col:MD.ink});
    const l1=md_curve(sb.port,[tb.x,tb.y+36],{bend:0.5}),l2=md_curve([tb.x+tb.w,tb.y+36],rb.port,{bend:0.5}),u=ag_sine(clamp(k*1.6-0.3,0,1));
    md_lane(ctx,l1,r.personal?MD.personal:MD.flow,0.8,{u});md_lane(ctx,l2,r.personal?MD.personal:MD.flow,0.8,{u});
    if(o.t!=null&&u>=1){const F=(o.night||0)>0.5?{kind:"batch",every:4.6}:r.flow,fc=r.personal?MD.personal:MD.flow;md_flow(ctx,l1,o.t,{kind:F.kind,col:fc,off:i*0.7,every:F.every,size:F.size});md_flow(ctx,l2,o.t,{kind:F.kind,col:fc,off:i*0.5+0.3,every:F.every,size:F.size});}
    // the thermometer on the table: its level unknown (a slow drift) until its temperature is found
    const th=o.therm||0,f=ag_sine(tp[i]||0);
    if(th>0.004){const drift=0.5+0.18*Math.sin((o.t||0)*1.3+i*2.1),lv=lerp(drift,b.lvl,f);ctx.save();ctx.globalAlpha*=ag_in(th,0,0.5)*(1-ag_in(tp[i]||0,0.2,0.4));
      hw_thermo(ctx,tb.x+tb.w-36,tb.y+12,48,lv,{w:14,marks:false});ctx.restore();}
    if(f>0.004)hw_tempTag(ctx,tb.x+tb.w-14,tb.y+36,b.key,{align:"right",a:ag_in(tp[i],0,0.4),k:tp[i]*2});
    if(o.say&&o.say[i]){const sa=o.sayA?o.sayA[i]:1;if(sa>0.004)md_T(ctx,o.say[i],tb.x+tb.w/2,tb.y+tb.h+44,{w:700,size:28,align:"center",col:b.tint,a:sa});}
    ctx.restore();});
  ctx.restore();}
