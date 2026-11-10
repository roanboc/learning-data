/* ===== Know what you hold: chapters 3 to 5 =====
   Data governance (Yusuf's list of classes, then a table's level), and back in the registrar's office (what exam support holds). The
   film cuts into chapter 3 (Mei is in both pictures), glides on into chapter 4 (the same room), and cuts into chapter 5 (the learner
   table is in both); the joins are named at the end of scenes3.js. */

/* ---------------------------------------------------------------- 3 · Two more classes */
// Yusuf's list, strictest first: each class a chip with its one line under it (760 wide). o.n3 (0 to 1) takes it from the three
// classes of Mei's register (direct, pseudonymous, none) to the five; o.lit {class: 0 to 1}; o.ring, special's second ring; o.first
// (0 to 1), the "strictest first" line down its left side; o.pulse (0 to 1), a glow at its top
const KW_LIST={special:"harm if it got out: health, disability, faith",direct:"names a person by itself",pseudonymous:"leads back only with a key kept elsewhere",
  indirect:"names no one alone; with others, singles one out",none:"says nothing about who someone is"};
function kw_classList(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return null;const w=760,n=ag_sine(clamp(o.n3==null?1:o.n3,0,1));
  const at3={direct:0,pseudonymous:1,none:2},at5={special:0,direct:1,pseudonymous:2,indirect:3,none:4},P=96,top=y+172,h=lerp(442,634,n);
  ctx.save();ctx.globalAlpha*=clamp(a,0,1);dp_panel(ctx,x,y,w,h,{col:"grey",r:20,glowR:34});
  dp_T(ctx,"CLASSES OF PERSONAL DATA",x+30,y+58,{w:800,size:28,ls:4,col:"cyan"});dp_T(ctx,"data governance",x+30,y+98,{w:500,size:28,col:"mut"});
  const f=clamp(o.first||0,0,1);
  if(f>0){dp_T(ctx,"strictest first",x+w-30,y+98,{w:600,size:28,align:"right",a:f});
    const x0=x+15,y0=top-40,y1=lerp(y0,top+4*P+26,ag_sine(f));ctx.save();ctx.strokeStyle=rgba(DP.ice,0.8);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.shadowColor=rgba(DP.ice,0.6);ctx.shadowBlur=8;
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0,y1);if(f>=0.98){ctx.moveTo(x0-7,y1-10);ctx.lineTo(x0,y1);ctx.lineTo(x0+7,y1-10);}ctx.stroke();ctx.restore();
    if(o.pulse>0)dp_halo(ctx,x0,y0+10,46,"violet",0.55*o.pulse);}
  KW_ORDER.forEach(cls=>{const isNew=at3[cls]==null,ra=isNew?ag_in(n,0.55,0.45):1;if(ra<=0.001)return;
    const yy=top+(isNew?at5[cls]:lerp(at3[cls],at5[cls],n))*P,L=o.lit&&o.lit[cls]||0;ctx.save();ctx.globalAlpha*=ra;
    if(L>0){ctx.save();ctx.globalAlpha*=L;const g=ctx.createLinearGradient(x+20,0,x+w-20,0);g.addColorStop(0,rgba(DP.F.violet,0.14));g.addColorStop(1,rgba(DP.F.violet,0));
      ctx.fillStyle=g;rr(ctx,x+22,yy-48,w-44,92,14);ctx.fill();ctx.restore();}
    kw_chip(ctx,x+30,yy,cls,{glow:L,ring:cls==="special"?(o.ring==null?1:o.ring):undefined});
    dp_T(ctx,KW_LIST[cls],x+30,yy+40,{w:500,size:28,col:mix(dp_t("mut"),dp_t("ink"),L)});ctx.restore();});
  ctx.restore();return{x,y,w,h};}
// a course of twelve learners: twelve small tiles of glass, and a birthday that singles one out (280 by 440); o.lit (0 to 1)
function kw_tiles(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return null;const w=280,h=440,L=clamp(o.lit||0,0,1);ctx.save();ctx.globalAlpha*=clamp(a,0,1);
  dp_panel(ctx,x,y,w,h,{col:"grey",r:20,glowR:30});
  dp_T(ctx,"A COURSE",x+30,y+58,{w:800,size:28,ls:4,col:"cyan"});dp_T(ctx,"12 learners",x+30,y+102,{w:700,size:32});
  const s=46,g=12,gx=x+(w-(4*s+3*g))/2,gy=y+136,pick=6,vc=dp_f("indirect");
  for(let i=0;i<12;i++){const tx=gx+(i%4)*(s+g),ty=gy+Math.floor(i/4)*(s+g),on=i===pick?L:0;
    if(on>0)dp_halo(ctx,tx+s/2,ty+s/2,s*1.3,"indirect",0.5*on);
    rr(ctx,tx,ty,s,s,10);ctx.fillStyle=rgba(mix([150,214,220],vc,on),0.10+0.85*on);ctx.fill();ctx.strokeStyle=rgba(mix(DP.ice,vc,on),0.45+0.5*on);ctx.lineWidth=1.6;ctx.stroke();}
  if(L>0){const tx=gx+(pick%4)*(s+g)+s/2,ty=gy+Math.floor(pick/4)*(s+g)+s;
    dp_link(ctx,[x+30+60,y+362],[tx,ty+4],"indirect",ag_eo(L),{dot:false,alpha:0.9});
    dp_pill(ctx,x+30,y+406,"14 May","indirect",{a:ag_in(L,0,0.4)});}
  ctx.restore();return{x,y,w,h};}
// the agreement's plain words, each with its class beside it (800 by 560): o.chips {row: {k, a, ring}} as each is said, o.lit {row: 0 to 1}
const KW_AGR=[["Never","coral"],["anything that names a learner","direct"],["anything about their health","special"],["May have","green"],
  ["a code in place of who they are","pseudonymous"],["their year of birth","indirect"],["each learner's course and results","none"]];
function kw_agreeClasses(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return null;const w=800,h=560;ctx.save();ctx.globalAlpha*=clamp(a,0,1);
  dp_panel(ctx,x,y,w,h,{col:"grey",r:20,glowR:34});
  dp_T(ctx,"DATA SHARING AGREEMENT 2026-14",x+30,y+58,{w:800,size:28,ls:4,col:"grey"});
  const ys=[124,182,248,324,382,448,514];
  KW_AGR.forEach((r,i)=>{const yy=y+ys[i];if(r[1]==="coral"||r[1]==="green"){dp_T(ctx,r[0].toUpperCase(),x+30,yy,{w:800,size:28,ls:4,col:r[1]});return;}
    const L=o.lit&&o.lit[i]!=null?o.lit[i]:1;dp_T(ctx,r[0],x+30,yy,{w:500,size:28,a:0.5+0.5*L});
    const ch=o.chips&&o.chips[i];if(ch)kw_chip(ctx,x+w-30,yy,r[1],{align:"right",k:ch.k,a:ch.a,ring:r[1]==="special"?ch.ring:undefined});});
  ctx.restore();return{x,y,w,h};}

scene("classes",(ctx,S,t,sc)=>{const c=sc.cues,T=kw_once(sc,"T",()=>({
    yusuf:c.yusuf,yW:wAt(sc,"yusuf","Yusuf"),list:wAt(sc,"yusuf","the list"),adds:c.adds,addsW:wAt(sc,"adds","adds two"),
    indirect:c.indirect,cols:wAt(sc,"indirect","other columns"),birthday:c.birthday,bday:wAt(sc,"birthday","a birthday"),
    special:c.special,harm:wAt(sc,"special","harm"),five:c.five,first:wAt(sc,"five","strictest first"),applies:wAt(sc,"five","the strictest that"),
    words:c.words,names:c.names,nDirect:wAt(sc,"names","direct"),nAbout:wAt(sc,"names","Nothing about"),nSpecial:wAt(sc,"names","special"),
    code:c.code,cPseudo:wAt(sc,"code","pseudonymous"),cYear:wAt(sc,"code","Their year"),cIndirect:wAt(sc,"code","indirect"),cCourse:wAt(sc,"code","Course and results"),cNone:wAt(sc,"code","none"),
    breath:c.breath}));
  const listA=tt=>ag_in(tt,T.list-0.3,0.5)*(1-ag_in(tt,T.words-0.7,0.45)),agrA=tt=>ag_in(tt,T.words-0.1,0.5);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"kwGov",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      // Mei, who brought the agreement, and Yusuf, who keeps the list
      kw_person(cx,"mei",KW_AT.meiGov,{t:tt,flip:false,gaze:[2,1]});
      kw_person(cx,"yusuf",KW_AT.yusufGov,{t:tt,gaze:[-2,1]});
      kw_name(cx,1890,205,"Yusuf Demir","Data governance lead",{a:ag_in(tt,T.yW-0.2,0.5),align:"right"});
      // the list: Mei's three classes, then five, strictest first
      kw_classList(cx,480,236,{a:listA(tt),n3:clamp((tt-T.addsW)/0.9,0,1),
        lit:{indirect:kw_io(tt,T.indirect,T.special-0.3,0.4),special:kw_io(tt,T.special,T.five,0.4)},ring:clamp((tt-T.special-0.2)/0.9,0,1),
        first:clamp((tt-T.first)/1.0,0,1),pulse:kw_io(tt,T.applies,T.applies+1.0,0.3)});
      // a course of twelve, and a birthday that points to one
      kw_tiles(cx,1262,236,{a:kw_io(tt,T.birthday-0.2,T.special-0.3,0.45),lit:clamp((tt-T.bday)/0.8,0,1)});
      // the agreement's plain words, now with classes
      kw_agreeClasses(cx,470,236,{a:agrA(tt),
        lit:{1:ag_in(tt,T.names,0.4),2:ag_in(tt,T.nAbout,0.4),4:ag_in(tt,T.code,0.4),5:ag_in(tt,T.cYear,0.4),6:ag_in(tt,T.cCourse,0.4)},
        chips:{1:{k:ag_spr(tt,T.nDirect,0.7),a:ag_in(tt,T.nDirect,0.2)},2:{k:ag_spr(tt,T.nSpecial,0.7),a:ag_in(tt,T.nSpecial,0.2),ring:clamp((tt-T.nSpecial-0.2)/0.8,0,1)},
          4:{k:ag_spr(tt,T.cPseudo,0.7),a:ag_in(tt,T.cPseudo,0.2)},5:{k:ag_spr(tt,T.cIndirect,0.7),a:ag_in(tt,T.cIndirect,0.2)},6:{k:ag_spr(tt,T.cNone,0.7),a:ag_in(tt,T.cNone,0.2)}}});}}
  ]);
  kw_kick(ctx,S,"Two more classes","Data governance",ag_in(t,0.3,0.5)*(1-ag_in(t,T.indirect,0.6)));});

/* ---------------------------------------------------------------- 4 · A level for each table */
// a table's pane, small (415 by 324): its name (or an empty slot), its owner, its level on a slip, and a few faint rows; frost and
// rim as its level says. o.frost, o.rim, o.level, o.levelA, o.lit, o.ownerLit
function kw_tablePane(ctx,x,y,name,owner,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return null;const w=415,h=324;ctx.save();ctx.globalAlpha*=clamp(a,0,1);
  kw_pane(ctx,x,y,w,h,{frost:o.frost||0,rim:o.rim||0,behind:o.behind});
  if(name)dp_T(ctx,name,x+30,y+62,{w:700,size:32});else kw_slot(ctx,x+30,y+68,220,{});
  if(owner)dp_T(ctx,owner,x+30,y+104,{w:500,size:28,col:mix(dp_t("mut"),dp_t("ink"),o.ownerLit||0)});
  if(o.level&&o.levelA>0)kw_level(ctx,x+30,y+140,o.level,{align:"left",a:o.levelA,lit:o.lit});
  ctx.fillStyle=rgba(DP.ice,0.16);[0.8,0.6,0.7].forEach((v,i)=>{rr(ctx,x+30,y+240+i*24,(w-60)*v,8,4);ctx.fill();});
  ctx.restore();return{x,y,w,h};}
// the two floors the columns set (1100 by 250): the classes as chips, an arrow, and the least strict level allowed; o.r1, o.r2 (0 to 1,
// each line), o.glow [g1, g2]
function kw_floors(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return null;const w=1100,h=250;ctx.save();ctx.globalAlpha*=clamp(a,0,1);
  dp_panel(ctx,x,y,w,h,{col:"grey",r:20,glowR:34});
  dp_T(ctx,"FLOORS FROM THE COLUMNS",x+30,y+58,{w:800,size:28,ls:4,col:"cyan"});
  [[["direct","pseudonymous","indirect"],"never public",o.r1],[["special"],"restricted",o.r2]].forEach((r,i)=>{const yy=y+140+i*72,ra=r[2]==null?1:r[2];if(ra<=0.001)return;
    ctx.save();ctx.globalAlpha*=ra;let cx0=x+30;r[0].forEach(cl=>{cx0+=kw_chip(ctx,cx0,yy,cl,{glow:o.glow&&o.glow[i]})+14;});
    const ax=cx0+12,ay=yy-12;ctx.strokeStyle=rgba(DP.ice,0.85);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax+66,ay);
    ctx.moveTo(ax+54,ay-9);ctx.lineTo(ax+66,ay);ctx.lineTo(ax+54,ay+9);ctx.stroke();dp_T(ctx,r[1],ax+86,yy,{w:700,size:30});ctx.restore();});
  ctx.restore();return{x,y,w,h};}
// the four tables of chapter 4, left to right, and their levels
const KW_PANES=[["Published totals","Planning","public"],["Timetable","Timetabling","internal"],["Learner table","registrar's office","confidential"],[null,null,"restricted"]];
const KW_PANEX=[85,530,975,1420];

scene("levels",(ctx,S,t,sc)=>{const c=sc.cues,T=kw_once(sc,"T",()=>({
    level:c.level,each:wAt(sc,"level","Each table"),harm:wAt(sc,"level","how much harm"),owner:wAt(sc,"level","Its owner"),
    pub:c.public,inter:wAt(sc,"public","Internal"),conf:c.confidential,restr:wAt(sc,"confidential","Restricted"),
    floors:c.floors,never:wAt(sc,"floors","never public"),restricted:c.restricted,isR:wAt(sc,"restricted","is restricted"),breath:c.breath}));
  const lv=[T.pub,T.inter,T.conf,T.restr],L=KW_LEVEL;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"kwGov",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      KW_PANES.forEach((p,i)=>{const at=lv[i],k=ag_sine(clamp((tt-at)/0.9,0,1)),q=L[p[2]];
        kw_tablePane(cx,KW_PANEX[i],236,p[0],p[1],{a:ag_in(tt,T.level+0.3+i*0.2,0.5),frost:q.frost*k,rim:q.rim*k,level:p[2],levelA:ag_in(tt,at,0.45),
          lit:i===3?kw_io(tt,T.isR,T.isR+1.4,0.4):0,ownerLit:kw_io(tt,T.owner,T.owner+1.6,0.4)});});
      kw_floors(cx,410,600,{a:ag_in(tt,T.floors,0.5),r1:0.45+0.55*ag_in(tt,T.never-0.6,0.4),r2:0.45+0.55*ag_in(tt,T.restricted,0.4),
        glow:[kw_io(tt,T.never-0.6,T.never+1.4,0.4),kw_io(tt,T.isR,T.isR+1.4,0.4)]});}}
  ]);
  kw_kick(ctx,S,"A level for each table",null,ag_in(t,0.4,0.5)*(1-ag_in(t,T.pub-0.6,0.6)));});

/* ---------------------------------------------------------------- 5 · What it holds */
// a group that reads the learner table, on a small card (210 by 94); o.a, o.dim (0 to 1)
function kw_group(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return;ctx.save();ctx.globalAlpha*=clamp(a,0,1)*(1-0.6*(o.dim||0));
  dp_panel(ctx,x,y,210,94,{col:"grey",r:18,glowR:24});dp_T(ctx,name,x+105,y+58,{w:700,size:30,align:"center"});ctx.restore();}
const KW_SUP=[1100,500];   // where the support table stands in the office, beside the learner table
scene("holds",(ctx,S,t,sc)=>{const c=sc.cues,T=kw_once(sc,"T",()=>({
    support:c.support,ex:wAt(sc,"support","exam support"),vals:wAt(sc,"support","Its values"),v1:wAt(sc,"support","extra time"),v2:wAt(sc,"support","a separate room"),v3:wAt(sc,"support","a reader"),
    why:c.why,dis:wAt(sc,"why","for a disability"),health:c.health,spec:wAt(sc,"health","special"),owner:c.owner,its:wAt(sc,"owner","Its owner"),
    strict:c.strict,restr:wAt(sc,"strict","restricted"),desk:wAt(sc,"strict","the help desk"),plan:wAt(sc,"strict","Planning"),too:wAt(sc,"strict","too strict"),
    moves:c.moves,mv:wAt(sc,"moves","moves"),own:wAt(sc,"moves","a table of its own"),sup:wAt(sc,"moves","the support table"),mR:wAt(sc,"moves","restricted"),few:wAt(sc,"moves","the few"),
    stays:c.stays,conf:wAt(sc,"stays","confidential"),breath:c.breath}));
  // the learner table: restricted while exam support is in it, confidential again once it has gone
  const up=tt=>ag_sine(clamp((tt-T.restr)/0.9,0,1))*(1-ag_sine(clamp((tt-T.conf+0.2)/0.9,0,1)));
  const slip=tt=>tt<T.restr+0.3?["confidential",1-ag_in(tt,T.restr,0.3)]:tt<T.conf+0.3?["restricted",ag_in(tt,T.restr+0.3,0.3)*(1-ag_in(tt,T.conf,0.3))]:["confidential",ag_in(tt,T.conf+0.3,0.3)];
  const mvU=tt=>clamp((tt-T.mv)/1.8,0,1);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"kwOffice",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      const u=mvU(tt),out=clamp(u*1.1,0,1),sl=slip(tt),exL=kw_io(tt,T.ex-0.2,T.strict,0.4),sp=clamp((tt-T.spec)/1.0,0,1);
      const ch=kw_chips(KW_NOW,{exam:{from:sp<1?"none":null,cls:sp>0.5?"special":"none",u:sp,ring:clamp((tt-T.spec-0.3)/0.8,0,1),glow:kw_io(tt,T.ex,T.spec+1.2,0.4)}});
      if(sp<=0)ch.exam={cls:"none",glow:kw_io(tt,T.ex,T.spec+1.2,0.4)};
      kw_learner(cx,KW_LTX,KW_LTY,{chips:ch,level:"confidential",frost:0.8+0.2*up(tt),rim:up(tt),levelText:sl[0],levelA:sl[1],out:u>0?out:0,
        light:{exam:Math.max(exL,kw_io(tt,T.owner,T.its+0.8,0.4))}});
      // what exam support holds, and why
      kw_card(cx,1100,236,430,[["kick","Exam support"],["sub","its values"],["line","extra time"],["line","a separate room"],["line","a reader"],["gap",6],["line","given for a disability"]],
        {a:kw_io(tt,T.vals-0.2,T.strict-0.3,0.45),ra:{2:ag_in(tt,T.v1,0.35),3:ag_in(tt,T.v2,0.35),4:ag_in(tt,T.v3,0.35),6:ag_in(tt,T.dis,0.4)}});
      // those who read the learner table every day: shut out while it is restricted
      const dim=up(tt);kw_group(cx,1100,236,"Help desk",{a:ag_in(tt,T.desk,0.45),dim});kw_group(cx,1320,236,"Planning",{a:ag_in(tt,T.plan,0.45),dim});
      // exam support moves to a table of its own
      const sa=ag_in(tt,T.own-0.1,0.5);if(sa>0)kw_support(cx,KW_SUP[0],KW_SUP[1],{a:sa,row:u>=1?1:0,slipA:ag_in(tt,T.mR,0.4),readers:ag_in(tt,T.few,0.4),glow:kw_io(tt,T.mv+1.8,T.mv+3.0,0.4)});
      if(u>0&&u<1){const e=ag_sine(u),y0=KW_LTY+KW_LT.top+6*KW_LT.rowH,y1=KW_SUP[1]+268,x0=KW_LTX+36,x1=KW_SUP[0]+34,cw=kw_chipW(cx,"special");
        const px=lerp(x0,x1,e),py=lerp(y0,y1,e)+Math.sin(Math.PI*e)*66;
        // on a strip of glass (it comes in as the row slides out, and goes as it lands), dipping under the other rows' chips on its way
        dp_panel(cx,px-20,py-40,dp_tw(cx,KW_COLS[6].name,{w:600,size:30})+40,56,{col:"grey",r:14,glowR:18,a:clamp(u/0.08,0,1)*clamp((1-u)/0.08,0,1)});
        kw_row(cx,px,py,KW_COLS[6],{val:false});kw_chip(cx,lerp(KW_LTX+KW_LT.chipX,KW_SUP[0]+470-30-cw,e),py,"special",{});}
      // Mei, who knows what it holds
      kw_person(cx,"mei",KW_AT.meiOffice,{t:tt,gaze:[-2,1]});
      kw_name(cx,1890,205,"Mei Tanaka","Registrar's office",{a:ag_in(tt,T.its-0.2,0.5),align:"right",lit:kw_io(tt,T.its,T.its+1.4,0.4)});}}
  ]);
  kw_kick(ctx,S,"What it holds","Registrar's office",ag_in(t,0.3,0.5)*(1-ag_in(t,T.why,0.6)));});
