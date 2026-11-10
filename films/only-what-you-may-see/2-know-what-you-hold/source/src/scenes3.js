/* ===== Know what you hold: chapters 6 to 8 =====
   Named at the source (the registrar's office again, gliding on from chapter 5), the class follows (the wide hall: the learner table,
   the study's own space and the published totals), and named first (Chile in 2016, then the hall as chapter 7 leaves it, and the end
   card). The chapters' joins are named at the end of this file. */

/* ---------------------------------------------------------------- 6 · Named at the source */
// a small card of the octagon: the box's front, and who does what (440 by 200); o.a, o.r1, o.r2 (0 to 1, its two lines)
function kw_octCard(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return;ctx.save();ctx.globalAlpha*=clamp(a,0,1);
  dp_panel(ctx,x,y,440,200,{col:"grey",r:20,glowR:30});kw_box(ctx,x+84,y+182,0.29,{turn:1,oct:[1,1],small:1});
  dp_T(ctx,"CHILE, 2016",x+160,y+58,{w:800,size:28,ls:4,col:"cyan"});
  dp_T(ctx,"Ministry: the limits",x+160,y+116,{w:600,size:28,a:o.r1==null?1:o.r1});dp_T(ctx,"maker: the octagon",x+160,y+164,{w:600,size:28,a:o.r2==null?1:o.r2});
  ctx.restore();}
// the sign-off sheet for a new column (720 by 360): its class empty, then "Not through", then the question; o.a, o.no, o.q (0 to 1)
function kw_signoff(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return;const w=720,h=360;ctx.save();ctx.globalAlpha*=clamp(a,0,1);
  dp_panel(ctx,x,y,w,h,{col:"grey",r:20,glowR:34});
  dp_T(ctx,"SIGN-OFF",x+30,y+58,{w:800,size:28,ls:4,col:"cyan"});dp_T(ctx,"New column: home postcode",x+30,y+112,{w:700,size:36});
  dp_T(ctx,"Decided in “Who may see it”",x+30,y+152,{w:500,size:28,col:"mut"});
  dp_T(ctx,"Class",x+30,y+232,{w:600,size:28,col:"mut"});kw_slot(ctx,x+124,y+232,200,{});
  dp_pill(ctx,x+360,y+232,"Not through","coral",{a:o.no||0});
  dp_T(ctx,"What does it tell about a person?",x+30,y+310,{w:700,size:30,a:o.q||0});
  ctx.restore();}

scene("source",(ctx,S,t,sc)=>{const c=sc.cues,T=kw_once(sc,"T",()=>({
    who:c.who,its:wAt(sc,"who","Its owner"),src:wAt(sc,"who","at the source"),born:wAt(sc,"who","where the data is born"),
    like:c.like,min:wAt(sc,"like","the Ministry"),maker:wAt(sc,"like","the maker"),list:c.list,picks:wAt(sc,"list","the owner picks"),
    scan:c.scan,scanW:wAt(sc,"scan","A scan"),looks:wAt(sc,"scan","looks like an email"),only:wAt(sc,"scan","Only Mei knows"),health:wAt(sc,"scan","about health"),
    nw:c.new,col:wAt(sc,"new","a new column"),no:wAt(sc,"new","doesn't go through"),q:wAt(sc,"new","a question"),breath:c.breath}));
  const ok=T.looks+1.1,em=[KW_LTX+KW_LT.chipX,KW_LTY+KW_LT.top+2*KW_LT.rowH];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"kwOffice",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      // the learner table, exam support gone from it; the owner picks each class, and a scan's suggestion for email is confirmed
      const ch=kw_chips(KW_NOW,{});["num","name","email","dob","course","results"].forEach((k,i)=>{ch[k].glow=kw_io(tt,T.picks+i*0.28,T.picks+i*0.28+0.9,0.3);});
      ch.email.glow=Math.max(ch.email.glow,kw_io(tt,T.scanW,ok+0.8,0.4));
      const dim=1-0.85*ag_in(tt,T.col-0.3,0.5);
      kw_learner(cx,KW_LTX,KW_LTY,{a:dim,chips:ch,level:"confidential",out:1});
      // where the data is born: a soft light along the table's left edge, where its records come in
      const bl=kw_io(tt,T.src-0.2,T.like,0.6);if(bl>0){cx.save();cx.globalAlpha*=bl*dim;const g=cx.createLinearGradient(0,0,KW_LTX+40,0);g.addColorStop(0,"rgba(150,230,236,0)");g.addColorStop(1,"rgba(150,230,236,0.32)");
        cx.fillStyle=g;cx.fillRect(0,KW_LTY+20,KW_LTX+40,kw_ltH({out:1})-40);cx.restore();}
      if(tt>ok){cx.save();cx.globalAlpha*=1-ag_in(tt,T.col-0.3,0.5);dp_tick(cx,em[0]+kw_chipW(cx,"direct")+34,em[1]-12,"green",clamp((tt-ok)/0.4,0,1));cx.restore();}
      kw_support(cx,KW_SUP[0],KW_SUP[1],{glow:kw_io(tt,T.only,T.health+1.0,0.4),lit:kw_io(tt,T.only,T.health+1.0,0.4)});
      // like the octagon; the list of classes; a scan's suggestion
      kw_octCard(cx,1100,236,{a:kw_io(tt,T.like-0.1,T.list-0.4,0.45),r1:ag_in(tt,T.min,0.4),r2:ag_in(tt,T.maker,0.4)});
      kw_card(cx,1100,236,440,[["kick","List of classes"],["sub","data governance"],["sub","five, strictest first"]],{a:kw_io(tt,T.list-0.05,T.scan-0.4,0.45)});
      const sa=kw_io(tt,T.scanW-0.15,T.nw-0.4,0.45);if(sa>0){const bb=kw_card(cx,1100,226,440,[["kick","A scan suggests"],["chips",[["direct","for Email"]]],["sub","it looks like an email"],["line","confirmed by Mei Tanaka",{col:"green"}]],
          {a:sa,ra:{3:ag_in(tt,ok,0.4)},chipO:()=>({dash:tt<ok?1:0})});
        kw_dots(cx,[1096,bb.ys[1][0]-12],[em[0]+kw_chipW(cx,"direct")+8,em[1]-12],"violet",ag_eo((tt-T.scanW-0.2)/0.6));}
      // a new column with no class: the sign-off sheet, in front of the table
      kw_signoff(cx,206,348,{a:ag_in(tt,T.col-0.1,0.5),no:ag_in(tt,T.no,0.4),q:ag_in(tt,T.q,0.4)});
      kw_person(cx,"mei",KW_AT.meiOffice,{t:tt,gaze:[-2,1]});
      kw_name(cx,1890,205,"Mei Tanaka","Registrar's office",{align:"right",lit:Math.max(kw_io(tt,T.its,T.its+1.4,0.4),kw_io(tt,T.only,T.only+1.6,0.4))});}}
  ]);
  kw_kick(ctx,S,"Named at the source","Where the data is born",ag_in(t,T.src-0.3,0.5)*(1-ag_in(t,T.list,0.6)));});

/* ---------------------------------------------------------------- 7 · The class follows
   The wide hall: the learner table at the left, its owner's name under it and the support table beside her name; the study's own space
   in the middle; the published totals at the right, on clear glass. Every table carries its level's slip, as every table has since
   chapter 4. Light runs along the glass from each column to what is made from it, and its chip rides on it; a value that changes on the
   way rides as a small pill and lands as the study's value. The key the learner code is made with is a sealed card, never shown.
   kw_hall7 draws it all at time tt of chapter 7 (T its times); chapter 8 draws it as chapter 7 leaves it (tt far on, KW_T0's times all
   0), with o.wave (0 to 1, every chip glows once, left to right), o.panes (0 to 1, every pane's rim and slip glow) and o.hide (0 to 1,
   a dashed outline round each violet chip). */
const KW_T0=new Proxy({},{get:()=>0});
const KW_W={lt:[30,70,420,546],stu:[700,70,540,500],tot:[1290,70,600,560],sup:[322,640,420,210],key:[460,92,230],cross:[860,598],mei:[30,640],anil:[1240,600]};
// the learner table's rows, small: [column, name, its first row's value or null, baseline from the pane's top]
const KW_LTS=[["num","Student number","S-20412",182],["name","Name",null,270],["email","Email",null,322],["dob","Date of birth","14 May 1987",374],["course","Course",null,462],["results","Results",null,514]];
// the study's rows: [column, name, value or null, baseline from its top, class]
const KW_STU=[["code","Learner code","a7772705…",182,"pseudonymous"],["year","Year of birth","1987",284,"indirect"],["course","Course",null,386,"none"],["results","Results",null,442,"none"]];
// the light's paths: from the learner table's right edge to the study's left edge, each at its rows' chips; exam support's, from the
// support table toward the study, stopped short of it; the totals', from the study to the published totals
const KW_RAIL={code:[[450,240],[700,240]],year:[[450,432],[610,432],[610,342],[700,342]],course:[[450,520],[640,520],[640,444],[700,444]],
  results:[[450,572],[670,572],[670,500],[700,500]],exam:[[742,804],[860,804],[860,622]],tot:[[1240,300],[1290,300]]};
// a path's length
function kw_len(pts){let L=0;for(let i=1;i<pts.length;i++)L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);return L;}
function kw_hall7(cx,tt,T,o){o=o||{};const [lx,ly,lw,lh]=KW_W.lt,[ux,uy,uw,uh]=KW_W.stu,[ox,oy,ow,oh]=KW_W.tot,[sx,sy,sw,sh]=KW_W.sup,K=KW_W.key,
    wave=o.wave||0,pg=o.panes||0,hide=o.hide||0;
  const wv=i=>wave>0?kw_io(wave*1.6,i*0.07,i*0.07+0.55,0.2):0;   // the wave of glows, i from left to right
  const outline=(x,y,cls)=>{if(hide<=0||KW_CLASS[cls].col==="none")return;const w=kw_chipW(cx,cls),top=y-KW_CH+12;cx.save();cx.globalAlpha*=hide;cx.setLineDash([8,8]);
    cx.strokeStyle=rgba(DP.ice,0.7);cx.lineWidth=2;rr(cx,x-10,top-10,w+20,KW_CH+20,(KW_CH+20)/2);cx.stroke();cx.restore();};
  // a table: its pane, frosted as far as its level says, its name, and its level's slip under the name
  const table=(x,y,w,h,name,level,lit)=>{const L=KW_LEVEL[level];kw_pane(cx,x,y,w,h,{frost:L.frost,rim:L.rim});
    if(pg>0)kw_pane(cx,x,y,w,h,{frost:0,rim:level==="restricted"?pg:0,a:0.5*pg});
    dp_T(cx,name,x+28,y+50,{w:700,size:32});kw_level(cx,x+28,y+68,level,{align:"left",lit:Math.max(lit||0,pg)});};
  // the learner table, at the source
  table(lx,ly,lw,lh,"Learner table","confidential");
  KW_LTS.forEach((r,i)=>{const yy=ly+r[3];dp_T(cx,r[1],lx+28,yy,{w:600,size:28});if(r[2])dp_T(cx,r[2],lx+28,yy+36,r[0]==="num"?{w:500,size:28,f:"mono",col:"mut"}:{w:500,size:28,col:"mut"});
    const cls=KW_NOW[r[0]],L=Math.max(wv(1+i),kw_io(tt,T.nobody,T.nobody+1.2,0.3));kw_chip(cx,lx+lw-24,yy,cls,{align:"right",glow:L});outline(lx+lw-24-kw_chipW(cx,cls),yy,cls);});
  // the support table, restricted, beside its owner's name; its one column never reaches the study
  table(sx,sy,sw,sh,"Support table","restricted");dp_T(cx,"Exam support",sx+28,sy+176,{w:600,size:28});
  kw_chip(cx,sx+sw-24,sy+176,"special",{align:"right",glow:wv(7)});outline(sx+sw-24-kw_chipW(cx,"special"),sy+176,"special");
  if(tt>T.never){const u=clamp((tt-T.never)/0.8,0,1);kw_run(cx,KW_RAIL.exam,u,"violet",{alpha:0.8});if(u>=1)dp_cross(cx,KW_W.cross[0],KW_W.cross[1],"coral",clamp((tt-T.never-0.8)/0.4,0,1));}
  // the light along the glass, from the learner table to the study
  const run=(k,at)=>kw_run(cx,KW_RAIL[k],clamp((tt-at)/1.3,0,1),"ice",{alpha:0.55+0.3*wv(8)});
  run("code",T.carries+0.2);run("year",T.carries+0.35);run("course",T.carries+0.5);run("results",T.carries+0.65);
  // the study's own space; each row comes in as what rides to it reaches the glass, and its value or chip lands where it rides to
  table(ux,uy,uw,uh,"Health progress study","confidential");
  const rowIn={code:T.numW+1.75,year:T.dobW+1.5,course:T.reachW+1.1,results:T.reachW+1.4},land={code:T.numW+2.8,year:T.dobW+2.6,course:T.reachW+1.5,results:T.reachW+1.8},
    fill={code:T.mPseudo,year:T.mIndirect};
  KW_STU.forEach((r,i)=>{const k=r[0],yy=uy+r[3],ra=ag_in(tt,rowIn[k],0.4);if(ra<=0.001)return;
    const cw=kw_chipW(cx,r[4]),L=Math.max(wv(9+i),k==="year"||k==="course"?kw_io(tt,T.point,T.point+1.4,0.3):0);
    dp_T(cx,r[1],ux+340,yy,{w:600,size:28,a:ra});
    if(r[2]&&tt>=land[k])dp_T(cx,r[2],ux+340,yy+36,k==="code"?{w:500,size:28,f:"mono",col:"mut"}:{w:500,size:28,col:"mut"});
    if(fill[k]!=null){const fa=ag_in(tt,fill[k],0.35);if(fa<1)kw_slot(cx,ux+28,yy,cw,{a:ra*(1-fa)});if(fa>0)kw_chip(cx,ux+28,yy,r[4],{k:ag_spr(tt,fill[k],0.7),a:fa,glow:L});}
    else if(tt>=land[k])kw_chip(cx,ux+28,yy,r[4],{glow:L});
    outline(ux+28,yy,r[4]);});
  // what rides along the light: course and results as they are, out of the learner table's edge and into their places in the study
  const ride=(k,cls,at)=>{const u=clamp((tt-at)/1.5,0,1);if(u<=0||u>=1)return;const R=KW_RAIL[k],w=kw_chipW(cx,cls),e=R[R.length-1],
      p=kw_along([[R[0][0]+w/2+6,R[0][1]]].concat(R.slice(1),[[ux+28+w/2,e[1]]]),ag_sine(u));
    kw_chip(cx,p[0],p[1]+12,cls,{align:"center",a:ag_in(u,0,0.1)});};
  ride("course","none",T.reachW);ride("results","none",T.reachW+0.3);
  // a value that changes on the way rides as a pill (s0, then s1 from time sw), and lands as the study's value, its words where the
  // row's words go (left at ux + 340, baseline by): st, its distance along the path by time ([[time, px or -1 for the end], ...])
  const pill=(k,s0,s1,sw,st,by,mono)=>{const t0=st[0][0],t1=st[st.length-1][0];if(tt<t0||tt>=t1)return;
    const f={w:500,size:28,f:mono?"mono":undefined},R=KW_RAIL[k],s=tt<sw?s0:s1,w=dp_tw(cx,s,f)+32,w0=dp_tw(cx,s0,f)+32,
      e=R[R.length-1],pts=[[R[0][0]+w0/2+6,R[0][1]]].concat(R.slice(1),[[e[0]+40,by-10],[ux+340+dp_tw(cx,s1,f)/2,by-10]]),L=kw_len(pts),
      p=kw_along(pts,ag_keys(tt,st.map(q=>[q[0],q[1]<0?L:q[1]]))/L),
      sa=tt<sw?1-ag_in(tt,sw-0.12,0.12):ag_in(tt,sw,0.12),inA=ag_in(tt,t0,0.25),ld=ag_in(tt,t1-0.45,0.45);
    cx.save();cx.globalAlpha*=inA*sa*(1-ld);dp_panel(cx,p[0]-w/2,p[1]-26,w,52,{col:"grey",r:14,glowR:18});cx.restore();
    dp_T(cx,s,p[0],p[1]+10,Object.assign({align:"center",col:mix(dp_t("ink"),dp_t("mut"),ld),a:inA*sa},f));};
  const swK=T.numW+1.0;
  pill("code","S-20412","a7772705…",swK,[[T.numW,0],[T.numW+0.5,40],[T.numW+1.3,40],[T.numW+2.8,-1]],uy+182+36,1);
  pill("year","14 May 1987","1987",T.dobW+1.0,[[T.dobW,0],[T.dobW+1.0,153],[T.dobW+1.1,153],[T.dobW+2.6,-1]],uy+284+36,0);
  // the key the code is made with: a sealed card, its words its name only; it glows as the code is made, and as the voice names it
  dp_sealed(cx,K[0],K[1],K[2],"The key",{a:ag_in(tt,T.numW-0.6,0.5)});
  const kg=Math.max(kw_io(tt,swK-0.4,swK+0.5,0.3),kw_io(tt,T.keyW,T.keyW+1.4,0.3));
  if(kg>0){dp_halo(cx,K[0]+52,K[1]+44,70,"violet",0.5*kg);cx.save();cx.globalAlpha*=kw_io(tt,swK-0.4,swK+0.5,0.3);
    dp_link(cx,[K[0]+K[2]/2,K[1]+96],[K[0]+K[2]/2,KW_RAIL.code[0][1]-28],"violet",1);cx.restore();}
  // the published totals, on clear glass: public
  table(ox,oy,ow,oh,"Published totals","public",Math.max(kw_io(tt,T.pubW,T.pubW+1.4,0.4),wv(14)));
  const tr=clamp((tt-T.totW)/1.0,0,1);if(tr>0)kw_run(cx,KW_RAIL.tot,tr,"ice",{alpha:0.8});
  const ta=ag_in(tt,T.totW+0.6,0.5);if(ta>0){cx.save();cx.globalAlpha*=ta;
    dp_T(cx,"LEFT AFTER FIRST YEAR",ox+28,oy+200,{w:800,size:28,ls:4,col:"cyan"});dp_T(cx,"by course",ox+28,oy+238,{w:500,size:28,col:"mut"});
    [["Nursing","38"],["Public health","21"],["Faculty of Health","80"]].forEach((r,i)=>{dp_T(cx,r[0],ox+28,oy+292+i*46,{w:600,size:30});dp_T(cx,r[1],ox+ow-30,oy+292+i*46,{w:700,size:30,align:"right"});});
    dp_T(cx,"counts under 10 hidden",ox+28,oy+432,{w:500,size:28,col:"mut",a:ag_in(tt,T.tenW,0.4)});
    const na=ag_in(tt,T.noneW,0.35);if(na<1)kw_slot(cx,ox+28,oy+504,kw_chipW(cx,"none"),{a:1-na});if(na>0)kw_chip(cx,ox+28,oy+504,"none",{k:ag_spr(tt,T.noneW,0.7),a:na,glow:wv(15)});
    cx.restore();}
  // who: Mei, who owns the learner table and the support table and names what changes; Anil, whose study it is
  kw_name(cx,KW_W.mei[0],KW_W.mei[1],"Mei Tanaka","Registrar's office",{a:ag_in(tt,T.carries-0.6,0.5),lit:kw_io(tt,T.stepW,T.mIndirect+1.0,0.4)});
  kw_name(cx,KW_W.anil[0],KW_W.anil[1],"Anil Kurian","Faculty of Health",{a:ag_in(tt,T.carries-0.4,0.5),align:"right",lit:kw_io(tt,T.totW,T.totW+1.8,0.4)});}

scene("follows",(ctx,S,t,sc)=>{const c=sc.cues,T=kw_once(sc,"T",()=>({
    carries:c.carries,nobody:wAt(sc,"carries","Nobody"),reach:c.reach,reachW:wAt(sc,"reach","Course and results"),
    code:c.code,numW:wAt(sc,"code","The student number"),keyW:wAt(sc,"code","a key"),year:c.year,dobW:wAt(sc,"year","The date of birth"),
    step:c.step,stepW:wAt(sc,"step","from the owner"),mei:c.mei,mPseudo:wAt(sc,"mei","pseudonymous"),mIndirect:wAt(sc,"mei","indirect"),point:wAt(sc,"mei","with a course"),
    never:wAt(sc,"never","never reaches"),totals:c.totals,totW:wAt(sc,"totals","Anil's totals"),tenW:wAt(sc,"totals","under ten hidden"),noneW:wAt(sc,"totals","none"),pubW:wAt(sc,"totals","a public table"),
    goes:c.goes,goesW:wAt(sc,"goes","wherever the column goes"),breath:c.breath}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"kwWide",keys:[[0,960,540,1.0]],push:0.01,draw:(cx,tt)=>{kw_hall7(cx,tt,T,{wave:clamp((tt-T.goesW)/1.6,0,1)});}}
  ]);});

/* ---------------------------------------------------------------- 8 · Named first */
scene("named",(ctx,S,t,sc)=>{const c=sc.cues,T=kw_once(sc,"T",()=>({
    sugar:c.sugar,acted:c.acted,named:wAt(sc,"acted","It named"),fam:wAt(sc,"acted","families"),sch:wAt(sc,"acted","schools"),mak:wAt(sc,"acted","makers"),
    either:c.either,now:c.now,col:wAt(sc,"now","every column"),tab:wAt(sc,"now","every table"),before:wAt(sc,"now","before anyone opens it"),
    next:c.next,hide:wAt(sc,"next","Which way to hide"),protect:c.protect,breath:c.breath}));
  const B={x:960,y:1010,s:1.35};
  ag_shots(ctx,S,t,sc.dur,[
    // the aisle, 2016: the parent, the box with its octagons, and octagons along the shelves
    {at:0,place:"kwAisle16",keys:[[0,960,540,1.0],[2,930,548,1.03]],push:0.02,draw:(cx,tt)=>{
      dp_person(cx,KW_PARENT,700,640,0.95,{t:tt,pose:"hold",gaze:[3,1],holdBack:(c,h)=>kw_box(c,h.near[0]+44,h.near[1]+64,0.4,{turn:0.9,small:1,oct:[1,1]})});}},
    // the box close up, as families, schools and makers saw it
    {at:T.named-0.25,place:"kwShelf",cut:true,keys:[[0,960,560,1.0]],push:0.015,draw:(cx,tt)=>{
      // (the recipe and the three who acted leave first, so only the box dissolves into the hall)
      const lv=1-ag_in(tt,T.either-0.95,0.4);kw_box(cx,B.x,B.y,B.s,{turn:1,oct:[1,1]});kw_recipe(cx,230,360,{sugar:0.45,a:lv});
      [["families",T.fam],["schools",T.sch],["makers",T.mak]].forEach(([w,at],i)=>dp_pill(cx,1330,470+i*84,w,"grey",{a:ag_in(tt,at,0.4)*lv}));}},
    // the hall, as chapter 7 left it: every column with its class, every table with its level
    {at:T.either-0.5,place:"kwWide",keys:[[0,960,540,1.0]],push:0.01,draw:(cx,tt)=>{cx.save();cx.globalAlpha*=1-0.6*ag_in(tt,T.breath,1.0);
      kw_hall7(cx,1e6,KW_T0,{wave:clamp((tt-T.col)/1.8,0,1)*(tt<T.col+3?1:0),panes:kw_io(tt,T.tab,T.tab+1.8,0.5),hide:ag_in(tt,T.hide,0.6)});cx.restore();}}
  ]);
  const ka=ag_in(t,0.3,0.5)*(1-ag_in(t,T.named-0.6,0.5));kw_kick(ctx,S,"Named first","Chile, 2016",ka,{scrim:1});
  dp_end(ctx,S,t,T.breath,"Know what you hold","You can't protect what you haven't named.","Film 2 of 8","Only what you may see");});

// the chapters that open on what the one before ends on: Mei is in both pictures (3), the same room (4 and 6), the learner table in both (5, 7)
ag_cutInto(["classes","levels","holds","source","follows"]);
