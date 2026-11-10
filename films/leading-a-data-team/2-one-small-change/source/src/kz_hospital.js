/* ===== One small change at a time: Colombo, 2000 =====
   The film's own pictures for its opening (prefix kz_). The module's kit draws the rooms, the people, the sheets and the things in
   them, and is never changed for this film; what is here is this film's alone:
     kzColombo                    the sky over the hospital, the ground, and two palms in the kit's quiet grey-olive
     KZ_HOSP, kz_hospital(ctx,o)  the Castle Street Hospital for Women cut open, as the kit cuts open the teaching building
                                  (section.js, whose rooms it reuses): three floors of wards, a nursery, an operating theatre, two
                                  stores and the entrance. Drawn live, so the camera can go close. o.room(id, box) returns how a room
                                  looks now: {lit (0 to 1: its lamp), tidy (0 to 1: the clutter on its floor gone), dim, edge (a
                                  colour that means something: amber for the infections), edgeA}; o.t turns the fans; o.a
     kzStore, kz_shelf(ctx,x,y,o) a store room in the hospital, and its shelves: from cluttered to sorted (sort: what isn't needed
                                  is tagged and goes), set in order (each thing in its place, a label under it), clean (shine), with
                                  the way written down beside it (standardise) and kept up, week after week (sustain)
     KZ_STAFF                     three of the hospital's staff, in the plain white and grey working clothes of the time
     kz_fall(ctx,x,y,w,o)         the infections, before and after two years: two bars that fall by half and by more than half
     kz_minis, kz_spread          small hospitals on a sheet; fifteen, eight then seven: the African countries the approach went
                                  to from 2007
   Nothing Sri Lankan or Japanese is borrowed in the look (no motif, script or pattern of either): the building is a plain public
   hospital of the time, drawn from the kit's section, never from a photograph, and never a likeness of the real hospital. The mothers
   in the wards are drawn lying down, seen from the side, their faces turned away; nobody is shown ill or hurt. Colour keeps the
   module's meaning: amber for the infections and for what isn't needed, green for what got better; the building wears none. */

/* ---------------------------------------------------------------- the place: the sky over the hospital */
const KZ_SKY={top:[166,194,214],low:[244,228,202],ground:[128,110,92],palm:[112,116,96],trunk:[104,92,78]};
function kz_palm(c,x,gy,s,lean){// a coconut palm: a curved trunk and a crown of fronds, in one quiet grey-olive
  c.save();const tx=x+lean*s,ty=gy-330*s;c.strokeStyle=rgba(KZ_SKY.trunk,1);c.lineCap="round";
  for(let k=0;k<12;k++){const u0=k/12,u1=(k+1)/12,f=u=>[lerp(x,tx,u)+Math.sin(u*Math.PI)*24*s*Math.sign(lean||1),lerp(gy,ty,u)];const a=f(u0),b=f(u1);
    c.lineWidth=lerp(16,9,u0)*s;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  c.fillStyle=rgba(KZ_SKY.palm,1);
  for(let i=0;i<9;i++){const an=-Math.PI*0.95+i*(Math.PI*0.95/8)+(i%2?0.06:-0.04),L=(150+30*Math.sin(i*1.7))*s,droop=0.55;
    const ex=tx+Math.cos(an)*L,ey=ty+Math.sin(an)*L*0.62+L*droop*0.5,mx=tx+Math.cos(an)*L*0.5,my=ty+Math.sin(an)*L*0.45-10*s;
    c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(mx-Math.sin(an)*16*s,my+Math.cos(an)*6*s,ex,ey);c.quadraticCurveTo(mx+Math.sin(an)*10*s,my+16*s,tx,ty+6*s);c.fill();}
  c.fillStyle=rgba(mix(KZ_SKY.palm,[255,255,255],0.12),1);c.beginPath();c.ellipse(tx,ty+4*s,14*s,11*s,0,0,TAU);c.fill();c.restore();}
function kz_paintSky(c){const gy=KZ_HOSP.ground;let g=c.createLinearGradient(0,0,0,gy);g.addColorStop(0,rgba(KZ_SKY.top,1));g.addColorStop(1,rgba(KZ_SKY.low,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // a warm, hazy morning: soft clouds low over the city
  c.save();c.filter="blur(30px)";c.fillStyle="rgba(255,250,240,0.55)";for(const [x,y,rx,ry] of [[300,190,260,40],[1560,150,300,46],[960,96,340,34],[1780,300,180,30]]){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}c.restore();
  c.fillStyle=rgba(KZ_SKY.ground,1);c.fillRect(0,gy,W,H-gy);g=c.createLinearGradient(0,gy,0,H);g.addColorStop(0,"rgba(40,30,24,0.16)");g.addColorStop(1,"rgba(40,30,24,0.4)");c.fillStyle=g;c.fillRect(0,gy,W,H-gy);
  kz_palm(c,120,gy,1.05,40);kz_palm(c,1800,gy,0.95,-36);kz_palm(c,1890,gy,0.7,-20);
  c.fillStyle=rgba(LP_SEC.cut,1);c.fillRect(0,gy,W,10);}
AG_PLACES.kzColombo=c=>kz_paintSky(c);

/* ---------------------------------------------------------------- the hospital, cut open */
const KZ_HOSP={x0:250,ground:900,slab:16,wall:16,floors:[
  {h:190,rooms:[{id:"G.1",w:380,kind:"entry"},{id:"G.2",w:420,kind:"store"},{id:"G.3",w:620,kind:"ward"}]},
  {h:170,rooms:[{id:"1.1",w:540,kind:"ward"},{id:"1.2",w:400,kind:"op"},{id:"1.3",w:480,kind:"nursery"}]},
  {h:170,rooms:[{id:"2.1",w:500,kind:"ward"},{id:"2.2",w:500,kind:"ward"},{id:"2.3",w:420,kind:"store"}]}]};
// the order the wards and rooms take up the new way, ward by ward
const KZ_ORDER=["G.2","1.1","G.3","1.3","2.1","1.2","2.2","2.3","G.1"];
const KZ_BED={frame:[96,96,102],sheet:[238,236,230],blanket:[204,196,186],hair:[38,30,28],skin:[150,104,78],cot:[132,132,138],locker:[176,146,112],box:[176,140,100]};
function kz_bed(c,x,fy,o){o=o||{};const L=104;c.save();c.fillStyle=rgba(KZ_BED.frame,1);
  for(const lx of [x+4,x+L-8]){c.fillRect(lx,fy-40,5,40);}c.fillRect(x,fy-44,L,6);c.fillRect(x-2,fy-62,5,22);
  c.fillStyle=rgba(KZ_BED.sheet,1);rr(c,x+2,fy-56,L-4,14,5);c.fill();
  c.fillStyle=rgba(mix(KZ_BED.sheet,[160,150,140],0.18),1);rr(c,x+5,fy-66,26,12,6);c.fill();
  if(o.empty){c.restore();return;}
  // the mother, lying with her face turned away from us: her hair on the pillow, the blanket over her
  c.fillStyle=rgba(KZ_BED.hair,1);c.beginPath();c.ellipse(x+20,fy-68,11,9,-0.2,0,TAU);c.fill();
  c.fillStyle=rgba(KZ_BED.blanket,1);c.beginPath();c.moveTo(x+28,fy-56);c.bezierCurveTo(x+34,fy-74,x+62,fy-74,x+74,fy-66);c.bezierCurveTo(x+88,fy-62,x+98,fy-64,x+L-4,fy-56);c.closePath();c.fill();
  c.fillStyle="rgba(255,252,246,0.35)";c.fillRect(x+30,fy-71,40,2);c.restore();}
function kz_cot(c,x,fy){c.save();c.strokeStyle=rgba(KZ_BED.cot,1);c.lineWidth=3;c.strokeRect(x,fy-50,44,22);for(let i=1;i<5;i++){c.beginPath();c.moveTo(x+i*9,fy-50);c.lineTo(x+i*9,fy-28);c.stroke();}
  c.beginPath();c.moveTo(x+3,fy-28);c.lineTo(x+3,fy);c.moveTo(x+41,fy-28);c.lineTo(x+41,fy);c.stroke();c.fillStyle="rgb(226,214,204)";rr(c,x+6,fy-40,32,8,4);c.fill();c.restore();}
function kz_fan(c,x,y,t){// a ceiling fan, turning slowly
  c.save();c.strokeStyle="rgba(80,72,70,0.9)";c.lineWidth=3;c.beginPath();c.moveTo(x,y);c.lineTo(x,y+16);c.stroke();c.fillStyle="rgba(80,72,70,0.9)";
  const s=Math.cos(t*5.2),k=Math.abs(s);c.beginPath();c.ellipse(x,y+18,36*k+4,3,0,0,TAU);c.fill();c.beginPath();c.ellipse(x,y+18,36*(1-k)+4,2.2,0,0,TAU);c.fill();c.restore();}
// the clutter on a floor before the new way: boxes stacked in the aisle, a bucket, linen piled; it goes as a room takes it up
function kz_clutter(c,r,u,seed){if(u<=0.004)return;const R=ag_rnd(seed),fy=r.y+r.h-8;c.save();c.globalAlpha*=u;
  for(let i=0;i<5;i++){const bx=r.x+30+R()*(r.w-90),bw=26+R()*26,bh=18+R()*22;c.fillStyle=rgba(mix(KZ_BED.box,[90,70,56],R()*0.4),1);c.save();c.translate(bx+bw/2,fy-bh/2);c.rotate((R()-0.5)*0.24);c.fillRect(-bw/2,-bh/2,bw,bh);
    c.fillStyle="rgba(255,240,220,0.22)";c.fillRect(-bw/2,-bh/2,bw,3);c.restore();}
  c.fillStyle="rgb(120,124,130)";const kx=r.x+r.w*0.72;c.beginPath();c.moveTo(kx-12,fy-24);c.lineTo(kx+12,fy-24);c.lineTo(kx+9,fy);c.lineTo(kx-9,fy);c.closePath();c.fill();
  c.fillStyle="rgb(228,224,216)";c.beginPath();c.ellipse(r.x+r.w*0.42,fy-8,22,9,0,0,TAU);c.fill();c.restore();}
function kz_furnish(c,r,st,t){const fy=r.y+r.h-8,tidy=st.tidy==null?1:st.tidy;
  if(r.kind==="ward"){const n=Math.floor((r.w-40)/132);for(let i=0;i<n;i++){const bx=r.x+26+i*132;kz_bed(c,bx,fy);
      c.fillStyle=rgba(KZ_BED.locker,1);c.fillRect(bx+110,fy-30,16,30);}
    kz_fan(c,r.x+r.w*0.3,r.y,t);kz_fan(c,r.x+r.w*0.72,r.y,t+0.4);}
  else if(r.kind==="nursery"){for(let cx=r.x+30;cx<r.x+r.w-60;cx+=66)kz_cot(c,cx,fy);kz_fan(c,r.x+r.w*0.5,r.y,t+0.2);}
  else if(r.kind==="op"){c.fillStyle="rgb(150,156,162)";c.fillRect(r.x+r.w/2-70,fy-50,140,10);c.fillRect(r.x+r.w/2-6,fy-40,12,40);c.fillRect(r.x+r.w/2-40,fy-6,80,6);
    c.fillStyle="rgb(214,222,222)";rr(c,r.x+r.w/2-66,fy-60,132,10,4);c.fill();
    c.strokeStyle="rgba(90,86,88,0.9)";c.lineWidth=3;c.beginPath();c.moveTo(r.x+r.w/2,r.y);c.lineTo(r.x+r.w/2,r.y+34);c.stroke();
    c.fillStyle="rgb(196,198,200)";c.beginPath();c.ellipse(r.x+r.w/2,r.y+44,34,12,0,Math.PI,0);c.fill();c.fillStyle="rgb(150,154,160)";c.fillRect(r.x+r.w*0.78,fy-46,40,46);}
  else if(r.kind==="store"){c.fillStyle="rgb(126,128,134)";for(const sx of [r.x+34,r.x+r.w/2+8]){const sw=r.w/2-60;c.fillRect(sx,fy-120,5,120);c.fillRect(sx+sw-5,fy-120,5,120);
      for(let k=0;k<4;k++){const sy=fy-118+k*38;c.fillRect(sx,sy,sw,4);
        // what's on each shelf: a jumble before, rows after
        const R=ag_rnd(17+k*5+(sx|0));for(let j=0;j<6;j++){const bw=lerp(16+R()*16,sw/6-6,tidy),bh=lerp(10+R()*16,24,tidy),bx=lerp(sx+6+R()*(sw-30),sx+4+j*(sw/6),tidy);
          c.fillStyle=rgba(mix(KZ_BED.box,j%3===1?[200,206,210]:[150,118,86],0.3+0.2*(j%2)),1);c.fillRect(bx,sy-bh,bw,bh);}}}}
  else if(r.kind==="entry"){c.fillStyle="rgb(96,78,66)";c.fillRect(r.x+40,fy-120,70,120);c.fillStyle="rgba(255,236,200,0.18)";c.fillRect(r.x+46,fy-114,58,60);
    c.fillStyle=rgba(LP.timber,1);c.fillRect(r.x+150,fy-34,190,8);c.fillRect(r.x+160,fy-26,6,26);c.fillRect(r.x+324,fy-26,6,26);}
  if(r.kind!=="op")kz_clutter(c,r,1-tidy,(r.x*7+r.y)|0);}
function kz_hospital(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const plan=KZ_HOSP,R=lp_sectionRooms(plan),x1=plan.x0+plan.floors[0].rooms.reduce((s,r)=>s+r.w,0)+plan.wall,
    top=R.reduce((m,r)=>Math.min(m,r.y),1e9)-plan.slab;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(LP_SEC.cut,1);ctx.fillRect(plan.x0,top,x1-plan.x0,plan.ground-top);ctx.fillRect(plan.x0-14,top-16,x1-plan.x0+28,18);
  // a low parapet along the roof, and the flat roof's edge in the warm light
  ctx.fillStyle=rgba(mix(LP_SEC.cut,[255,255,255],0.18),1);ctx.fillRect(plan.x0-14,top-16,x1-plan.x0+28,3);
  for(const r of R){const st=o.room?o.room(r.id,r)||{}:{};lp_secRoom(ctx,r,{lit:st.lit||0});
    ctx.save();ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();kz_furnish(ctx,r,st,o.t||0);
    if(st.dim>0){ctx.fillStyle=rgba(LP_SEC.shade,0.45*st.dim);ctx.fillRect(r.x,r.y,r.w,r.h);}ctx.restore();
    if(st.edge&&(st.edgeA==null||st.edgeA>0.004)){ctx.save();ctx.strokeStyle=rgba(st.edge,st.edgeA==null?1:st.edgeA);ctx.lineWidth=6;ctx.strokeRect(r.x+3,r.y+3,r.w-6,r.h-6);ctx.restore();}}
  ctx.restore();}
const kz_room=id=>lp_roomBox(KZ_HOSP,id);

/* ---------------------------------------------------------------- the store, close: its shelves, from cluttered to kept */
AG_PLACES.kzStore=c=>lp_paintRoom(c,{light:"day",seed:11,base:[226,220,204]});
/* The shelves stand on the floor (936) from x to x + 760, 620 tall. What's on them, each thing once: its kind and size, where it lies
   when cluttered (m: along the shelves, on which board, 0 to 3 from the top, or 4 for the floor in front, and a tilt) and its place once
   set in order (s: board, and slot along it), and whether it's needed (keep). What isn't needed is tagged in amber as the voice says
   "Sort", and goes. */
const KZ_THINGS=[
  {k:"box",w:96,h:64,keep:1,m:[40,3,0.04],s:[0,0]},{k:"box",w:96,h:64,keep:1,m:[250,4,-0.08],s:[0,1]},{k:"box",w:96,h:64,keep:1,m:[470,1,0.05],s:[0,2]},
  {k:"tray",w:120,h:22,keep:1,m:[300,0,0.22],s:[1,0]},{k:"tray",w:120,h:22,keep:1,m:[120,1,-0.12],s:[1,1]},
  {k:"linen",w:84,h:50,keep:1,m:[560,3,0.0],s:[2,0]},{k:"linen",w:84,h:50,keep:1,m:[60,0,-0.05],s:[2,1]},{k:"linen",w:84,h:50,keep:1,m:[650,4,0.06],s:[2,2]},
  {k:"bottle",w:30,h:74,keep:1,m:[380,2,0.0],s:[3,0]},{k:"bottle",w:30,h:74,keep:1,m:[430,3,0.34],s:[3,1]},{k:"bottle",w:30,h:74,keep:1,m:[230,2,-0.2],s:[3,2]},{k:"bottle",w:30,h:74,keep:1,m:[690,1,0.0],s:[3,3]},
  {k:"file",w:70,h:86,keep:1,m:[600,0,-0.1],s:[1,2]},
  {k:"broken",w:110,h:60,keep:0,m:[330,4,0.06]},{k:"box",w:110,h:76,keep:0,m:[520,2,-0.06]},{k:"file",w:70,h:86,keep:0,m:[160,2,0.14]},
  {k:"tray",w:120,h:22,keep:0,m:[470,4,-0.18]},{k:"box",w:84,h:58,keep:0,m:[20,4,0.08]},{k:"broken",w:90,h:50,keep:0,m:[640,2,-0.08]},
  {k:"box",w:76,h:52,keep:0,m:[180,3,0.1]},{k:"linen",w:70,h:40,keep:0,m:[700,0,0.1]}];
const KZ_SHELF={w:760,h:620,boards:4,metal:[124,126,132]};
function kz_thing(c,th,w,h){const k=th.k;c.save();
  if(k==="box"){c.fillStyle=rgba(KZ_BED.box,1);c.fillRect(-w/2,-h,w,h);c.fillStyle="rgba(255,240,220,0.25)";c.fillRect(-w/2,-h,w,6);c.fillStyle="rgba(80,60,44,0.35)";c.fillRect(-4,-h,8,h);}
  else if(k==="tray"){c.fillStyle="rgb(170,176,182)";rr(c,-w/2,-h,w,h,5);c.fill();c.fillStyle="rgba(255,255,255,0.35)";c.fillRect(-w/2+6,-h+3,w-12,3);}
  else if(k==="linen"){c.fillStyle="rgb(236,234,228)";rr(c,-w/2,-h,w,h,10);c.fill();c.strokeStyle="rgba(150,140,130,0.6)";c.lineWidth=2;for(let i=1;i<3;i++){c.beginPath();c.moveTo(-w/2+6,-h+i*h/3);c.lineTo(w/2-6,-h+i*h/3);c.stroke();}}
  else if(k==="bottle"){c.fillStyle="rgba(178,192,196,0.95)";rr(c,-w/2,-h*0.78,w,h*0.78,8);c.fill();c.fillRect(-w*0.2,-h,w*0.4,h*0.24);c.fillStyle="rgb(232,228,220)";c.fillRect(-w/2+3,-h*0.6,w-6,h*0.24);}
  else if(k==="file"){c.fillStyle="rgb(198,170,120)";c.fillRect(-w/2,-h,w,h);c.fillStyle="rgb(240,236,226)";c.fillRect(-w/2+6,-h-8,w-14,10);c.fillStyle="rgba(80,60,44,0.3)";c.fillRect(-w/2,-h,6,h);}
  else if(k==="broken"){// an old stand, bent and missing a wheel: kept for years, needed by nobody
    c.strokeStyle="rgb(110,112,118)";c.lineWidth=6;c.lineCap="round";c.beginPath();c.moveTo(-w/2,-6);c.lineTo(w/2,-6);c.moveTo(-w/4,-6);c.lineTo(-w/6,-h);c.lineTo(w/3,-h+12);c.stroke();
    c.fillStyle="rgb(70,70,76)";c.beginPath();c.arc(-w/2+8,-4,7,0,TAU);c.fill();}
  c.restore();}
// the top of each board (0 to 3 from the top), and of the floor in front (4)
const kz_board=k=>k>=4?944:936-KZ_SHELF.h+40+(k+1)*((KZ_SHELF.h-60)/KZ_SHELF.boards)-12;
/* o: sort (0 to 1: what isn't needed is tagged, then goes off to the left), order (0 to 1: the rest glides to its place), shine (0 to 1:
   the dust goes), labels (0 to 1), tagA (the amber tags' strength, from "Sort"). */
function kz_shelf(ctx,x,y,o){o=o||{};const fy=936,S_=KZ_SHELF,top=fy-S_.h,sh=S_.metal,sort=o.sort||0,order=ag_sine(o.order||0),shine=o.shine||0,tagA=o.tagA==null?ag_in(sort,0,0.25):o.tagA;ctx.save();
  // the shelves' soft shadow on the wall, down and to the left
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(52,40,36,0.22)";ctx.fillRect(x-22,top+26,S_.w-10,S_.h-30);ctx.restore();
  ctx.fillStyle=rgba(sh,1);ctx.fillRect(x,top,10,S_.h);ctx.fillRect(x+S_.w-10,top,10,S_.h);
  for(let k=0;k<S_.boards;k++){const yy=kz_board(k);ctx.fillStyle=rgba(sh,1);ctx.fillRect(x,yy,S_.w,12);ctx.fillStyle="rgba(255,255,255,0.3)";ctx.fillRect(x,yy,S_.w,2);}
  ctx.fillStyle=rgba(sh,1);ctx.fillRect(x,top,S_.w,8);
  // labels on the boards' edges, once each thing has its place: a strip of paper with a dot, no words
  const lab=o.labels||0;if(lab>0){ctx.save();ctx.globalAlpha*=lab;for(const th of KZ_THINGS){if(!th.keep)continue;const yy=kz_board(th.s[0]),px=x+34+th.s[1]*178;
      ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(px+8,yy+1,96,10);ctx.fillStyle=rgba(LP.mut,0.8);ctx.beginPath();ctx.arc(px+18,yy+6,3,0,TAU);ctx.fill();}ctx.restore();}
  // each thing: from where it lay to its place; what isn't needed goes off to the left after its tag
  for(const th of KZ_THINGS){let px=x+th.m[0]+th.w/2,py=kz_board(th.m[1]),tilt=th.m[2],a=1;
    if(th.keep){const tx=x+34+th.s[1]*178+(th.k==="bottle"?40:th.w/2),ty=kz_board(th.s[0]);px=lerp(px,tx,order);py=lerp(py,ty,order);tilt=lerp(tilt,0,order);}
    else{const go=ag_sine(clamp((sort-0.4)/0.6,0,1));px=lerp(px,x-460,go);a=1-go;}
    if(a<=0.004)continue;ctx.save();ctx.globalAlpha*=a;ctx.translate(px,py);ctx.rotate(tilt);kz_thing(ctx,th,th.w,th.h);
    if(!th.keep&&tagA>0.004){ctx.globalAlpha*=tagA;ctx.fillStyle=rgba(LP.amber,1);ctx.beginPath();ctx.moveTo(th.w/2-8,-th.h+2);ctx.lineTo(th.w/2+20,-th.h-10);ctx.lineTo(th.w/2+32,-th.h+12);ctx.lineTo(th.w/2+4,-th.h+24);ctx.closePath();ctx.fill();
      ctx.fillStyle=rgba(LP.paper,1);ctx.beginPath();ctx.arc(th.w/2+10,-th.h+8,3.5,0,TAU);ctx.fill();}
    ctx.restore();}
  // dust, before the shine: a dull film over the boards and specks on them, and smudges on the floor in front
  if(shine<1){const R=ag_rnd(77),da=1-ag_sine(shine);ctx.save();ctx.globalAlpha*=da;ctx.fillStyle="rgba(110,96,80,0.16)";ctx.fillRect(x,top,S_.w,S_.h);
    ctx.fillStyle="rgba(90,76,62,0.28)";for(let i=0;i<70;i++){const k=(R()*4)|0,dx=x+12+R()*(S_.w-24),dy=kz_board(k)-2-R()*3;ctx.fillRect(dx,dy,2+R()*5,2);}
    ctx.fillStyle="rgba(90,74,60,0.16)";for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(x-80+R()*(S_.w+160),fy+18+R()*40,50+R()*60,7+R()*5,0,0,TAU);ctx.fill();}ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the staff
   Plain working clothes of the time, in white and pale grey that mean nothing: a tunic over a shirt; hair tied back or short. Never
   anyone real. Each was looked at full size, facing both ways, before the film used them. */
const KZ_STAFF={
  nurse:{key:"kzNurse",name:"",skin:[152,106,80],hair:{style:"bun",c:[28,22,20]},top:{kind:"tunic",c:[236,236,232],inner:[226,226,220]},breath:0.3},
  orderly:{key:"kzOrderly",name:"",skin:[128,88,64],hair:{style:"cropped",c:[30,26,24]},top:{kind:"tunic",c:[194,196,194],inner:[228,228,224]},breath:0.27},
  sister:{key:"kzSister",name:"",skin:[170,122,94],hair:{style:"bun",c:[40,30,28]},glasses:[58,48,44],top:{kind:"tunic",c:[236,236,232],inner:[214,214,210]},breath:0.29}};

/* ---------------------------------------------------------------- the infections, before and after two years
   o: a, k, light; u (one per row, 0 to 1: the bar falls from where it was, a dashed outline left there, and its words come in). The
   bars are to scale from the sources' falls in two years: 52% after a Caesarean, 58% in newborn babies; the words are the voice's. */
const KZ_FALL=[["After a Caesarean",0.48,"By half"],["In newborn babies",0.42,"By more than half"]];
function kz_fall(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const h=250,lx=x+36,bx=x+360,bw=w-360-336;
  c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));lp_sheet(c,x,y,w,h,{col:LP.green,light:o.light===undefined?null:o.light,pin:false});
  lp_T(c,"INFECTIONS, IN TWO YEARS",lx,y+74,{w:800,size:28,ls:3,col:LP.green});
  KZ_FALL.forEach(([s,v,txt],i)=>{const yy=y+112+i*66,u=o.u?(o.u[i]||0):0,e=ag_sine(u),len=bw*lerp(1,v,e);
    lp_T(c,s,lx,yy+30,{w:600,size:28});
    if(u>0){c.save();c.setLineDash([8,6]);c.strokeStyle=rgba(LP.amber,0.75*Math.min(1,u*3));c.lineWidth=2.5;rr(c,bx,yy+6,bw,32,6);c.stroke();c.restore();}
    c.fillStyle=rgba(LP.amber,0.88);rr(c,bx,yy+6,len,32,6);c.fill();
    lp_T(c,txt,bx+bw+16,yy+32,{w:700,size:28,col:LP.green,a:ag_in(u,0.6,0.4)});});
  c.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- fifteen hospitals, eight then seven */
function kz_mini(c,x,y,s,col,a){if(a<=0.004)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.scale(s,s);c.fillStyle=rgba(col,1);
  c.fillRect(-30,-36,60,36);c.fillRect(-36,-42,72,8);c.fillStyle=rgba(LP.paper,1);for(const wx of [-20,-6,8]){c.fillRect(wx,-28,10,10);}c.fillRect(18,-22,8,22);
  c.fillStyle=rgba(col,1);c.fillRect(-4,-56,8,14);c.fillRect(-11,-52,22,7);c.restore();}
// a green sheet of n small hospitals under its words {kick, title}: the first nf come in with o.first (0 to 1, one after another), the
// rest with o.more; o.a, o.k, o.light
function kz_minis(c,x,y,w,words,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const bb=lp_textSheet(c,x,y,w,words,{measure:true}),h=bb.h+150,nf=o.nf==null?n:o.nf;
  c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(c,x,y,w,h,{col:LP.green,light:o.light===undefined?null:o.light,pin:false});lp_textSheet(c,x,y,w,words,{col:LP.green,light:null,pin:false,a:1});
  const gap=Math.min(96,(w-140)/Math.max(1,n-1)),s=Math.min(0.9,gap/82),x0=x+w/2-gap*(n-1)/2;
  for(let i=0;i<n;i++){const first=i<nf,u=first?(o.first==null?1:o.first):(o.more||0),k=first?i:i-nf,m=first?nf:n-nf;
    kz_mini(c,x0+i*gap,y+bb.h+104,s,first?LP.green:mix(LP.green,LP.paper,0.18),ag_in(u,k/Math.max(1,m)*0.5,0.5));}
  c.restore();return{x,y,w,h};}
function kz_spread(c,x,y,w,o){return kz_minis(c,x,y,w,{kick:"From 2007, with Japan's aid agency",title:"Public hospitals in 15 African countries"},15,Object.assign({nf:8},o));}
