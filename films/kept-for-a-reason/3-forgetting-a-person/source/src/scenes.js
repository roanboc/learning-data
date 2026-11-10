/* ===== Forgetting a person: chapters 2 to 8 =====
   Each timed to its narration (wAt), in the university's hall: what is shown is frosted glass, cyan an identity (her numbers, the
   places), green allowed or kept for a reason, coral refused or removed, violet personal data that must stay hidden. Each chapter's
   kicker shows for its first seconds, then leaves room. Chapter 8 opens on the page of 1998 and ends on the end card. */

AG_PLACES.fpHall=c=>dp_paintHall(c,{seed:5,horizon:780,vx:960,lights:16,panes:7,pools:[[960,1010,820,0.06]]});
AG_PLACES.fpDesk=c=>dp_paintHall(c,{seed:19,horizon:760,vx:900,lights:14,panes:6,pools:[[960,980,700,0.07]]});
AG_PLACES.fpMap=c=>dp_paintHall(c,{seed:23,horizon:900,vx:960,lights:20,panes:5,pools:[[960,1040,900,0.05]],haze:0.05});
AG_PLACES.fpList=c=>dp_paintHall(c,{seed:41,horizon:780,vx:1000,lights:16,panes:7,pools:[[960,1000,780,0.06]]});

// a chapter's kicker, top left, for its first seconds: "Chapter n" over its name
function fp_kick(ctx,S,t,n,name,out){setScreen(ctx,S);dp_kicker(ctx,"Chapter "+n,name,{a:ag_io(t,0.15,out||4.6,0.6)});}
// a panel of a fixed size with a kicker (in capitals, in col) and words wrapped to fit (size 36 unless o.size), lh apart
function fp_box(ctx,x,y,w,h,kick,words,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:20,glowR:36,behind:o.behind});let yy=y+30;
  if(kick){yy+=20;dp_T(ctx,String(kick).toUpperCase(),x+30,yy,{w:800,size:28,ls:4,col:o.kickCol||o.col||"cyan"});yy+=14;}
  const size=o.size||36,lh=o.lh||Math.round(size*1.28);ag_wrap(ctx,words,w-60,{w:700,size}).forEach((l,i)=>{yy+=i?lh:size+8;dp_T(ctx,l,x+30,yy,{w:700,size});});
  ctx.restore();return{x,y,w,h,end:yy};}

/* ---------------------------------------------------------------- 2 · Four sentences */
const FP_RIGHTS=[["see","Show me what you hold about me."],["correct","That's wrong. Correct it."],["erase","You don't need that any more. Delete it."],["object","Stop using it for that."]];
scene("four",(ctx,S,t,sc)=>{const c=sc.cues,T=fp_once(sc,"T",()=>({most:c.most,fits:c.fits,show:c.show,wrong:c.wrong,need:c.need,stop:c.stop,
    gdpr:c.gdpr,limits:wAt(sc,"gdpr","each with its limits"),forgotten:wAt(sc,"third","right to be forgotten"),every:c.every,
    rules:c.rules,everyone:wAt(sc,"rules","everyone"),thirty:wAt(sc,"rules","thirty days"),why:c.why,can:c.can,must:wAt(sc,"can","must be able")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"fpHall",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
    const ins=[T.show,T.wrong,T.need,T.stop],dim=1-0.4*ag_in(tt,T.can-0.4,0.6);
    // "each fits in a sentence anyone can say": four frames, then each sentence in its own
    FP_RIGHTS.forEach(([k,s],i)=>{const x=90+i*440,fa=ag_in(tt,T.fits-0.2+i*0.12,0.5)*dim;if(fa<=0)return;
      if(tt<ins[i]-0.3+0.5)withA(cx,fa*(1-ag_in(tt,ins[i]-0.3,0.5)),()=>{rr(cx,x,230,410,236,20);cx.strokeStyle="rgba(150,225,232,0.35)";cx.lineWidth=2;cx.setLineDash([10,10]);cx.stroke();cx.setLineDash([]);});
      fp_up(cx,tt,ins[i]-0.3,null,a=>fp_box(cx,x,230,410,236,k,s,{a:a*dim}));});
    fp_up(cx,tt,T.forgotten-0.3,null,a=>dp_pill(cx,970,526,"the right to be forgotten","cyan",{a:a*dim}));
    fp_up(cx,tt,T.gdpr-0.3,T.every-0.5,a=>dp_card(cx,90,580,700,{kick:"Europe's GDPR, since 2018",title:"all four, each with its limits"},{a}));
    fp_up(cx,tt,T.every-0.2,T.rules-0.6,a=>dp_slip(cx,90,620,"Not every law: not all four, or not in the same words","cyan",{a,ink:true}));
    fp_up(cx,tt,T.rules-0.3,null,a=>dp_card(cx,90,580,1100,{kick:"The university's own rules",title:"all four, to everyone it holds data about",sub:"an answer within 30 days"},{a:a*dim}));
    fp_up(cx,tt,T.why-0.2,null,a=>dp_pill(cx,1240,650,"no reason needed","green",{a:a*dim}));
    fp_up(cx,tt,T.can-0.2,null,a=>dp_T(cx,"A person can ask. The university must be able to answer.",960,846,{w:700,size:44,align:"center",a}));}}]);
  fp_kick(ctx,S,t,2,sc.name,T.fits-0.4);});

/* ---------------------------------------------------------------- 3 · Is it really her? */
scene("her",(ctx,S,t,sc)=>{const c=sc.cues,T=fp_once(sc,"T",()=>({sure:c.sure,hers:wAt(sc,"sure","hers"),way:c.way,pretending:wAt(sc,"way","pretending"),everything:wAt(sc,"way","everything"),
    account:c.account,signed:wAt(sc,"account","signed in"),itsHer:wAt(sc,"account","so it's her"),nothing:c.nothing,passport:wAt(sc,"nothing","passport"),safe:wAt(sc,"nothing","keep safe"),
    trust:c.trust,noMore:wAt(sc,"trust","no more"),logs:c.logs,due:wAt(sc,"logs","The answer is due")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"fpDesk",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
    // her request, on glass: what she asked; then where it came from
    const rq=fp_up(cx,tt,T.sure-0.6,null,a=>{const b=fp_box(cx,560,200,800,330,"Request · Linh Nguyen","",{a});
      dp_T(cx,"What do you hold about me?",590,326,{w:700,size:36,a});dp_T(cx,"Take me off the tutors' mailing list.",590,384,{w:700,size:36,a});
      const fa=ag_in(tt,T.account-0.2,0.5);if(fa>0){dp_tick(cx,610,470,"green",ag_in(tt,T.signed-0.2,0.5));dp_T(cx,"from her student account · signed in",650,480,{w:600,size:30,a:a*fa});}
      return b;});
    // anyone could ask: a person in outline, in coral, who could be sent everything
    const pa=ag_io(tt,T.way-0.2,T.account-0.4,0.5);if(pa>0)withA(cx,pa,()=>{dp_halo(cx,300,330,170,"coral",0.10);dp_personPic(cx,300,330,"coral");
      dp_slip(cx,300,440,"someone pretending to be her","coral",{align:"center"});
      fp_up(cx,tt,T.everything-0.3,null,a=>{dp_link(cx,[548,320],[420,330],"coral",ag_in(tt,T.everything-0.2,0.5),{lw:3});dp_pill(cx,300,600,"sent everything","coral",{a,align:"center"});});});
    fp_up(cx,tt,T.itsHer-0.2,null,a=>dp_pill(cx,560,594,"it's her","green",{a}));
    // a passport copy: not needed, one more thing to keep safe; it comes in, and goes
    const sa=ag_io(tt,T.passport-0.4,T.trust-0.5,0.5);if(sa>0){const dx=60*(1-ag_eo(clamp((tt-T.passport+0.4)/0.7,0,1)))+90*ag_in(tt,T.trust-0.5,0.5);
      cx.save();cx.translate(dx,0);withA(cx,sa,()=>{dp_frost(cx,1430,200,400,250,c2=>{c2.fillStyle="rgba(240,240,255,0.9)";c2.fillRect(1450,230,110,140);for(let k=0;k<5;k++)c2.fillRect(1590,236+k*26,200-(k%2)*60,10);},{});
        dp_lock(cx,1480,410,40,"violet",0);dp_T(cx,"passport copy",1520,424,{w:700,size:30});
        fp_up(cx,tt,T.nothing+0.6,null,a=>dp_pill(cx,1430,520,"not needed","coral",{a}));
        fp_up(cx,tt,T.safe-0.5,null,a=>dp_T(cx,"one more thing to keep safe",1430,590,{w:600,size:30,col:"mut",a}));});cx.restore();}
    fp_up(cx,tt,T.trust-0.2,T.logs-0.2,a=>dp_card(cx,560,650,800,{title:"Check with what you already trust",sub:"and ask for no more than that"},{a}));
    // logged, and due
    fp_up(cx,tt,T.logs+0.4,null,a=>dp_slip(cx,560,650,"Logged · Tue 24 Nov 2026","cyan",{a,ink:true}));
    fp_up(cx,tt,T.due-0.2,null,a=>dp_slip(cx,980,650,"Due · Thu 24 Dec 2026","cyan",{a,ink:true}));}}]);
  fp_kick(ctx,S,t,3,sc.name,T.sure);});

/* ---------------------------------------------------------------- 4 · Every place she is */
// the map: her six numbers' places, the four around them, the tables made from them and a copy outside
const FP_SIX=[["HR","E-4417","Ingrid Holm"],["Student system","S-20436","Mei Tanaka"],["Its archive","S-17142","Mei Tanaka"],["Alumni office","A-61207","Alumni relations"],["Research office","R-3082","Research integrity"],["Learning platform","u-88236","Digital learning"]];
const FP_FOUR=[["Hours claimed","claims app","Ingrid Holm"],["Payroll","bought, not on the platform","Ingrid Holm"],["Tutors' mailing list","her yes, 2023","Ingrid Holm"],["Signed contracts","kept as documents","Ingrid Holm"]];
const fp_six=i=>[80+i*296,110,280,176],fp_four=i=>[80+i*445,312,425,150];
// which places a search by "Linh Nguyen" alone finds: the claims app and the mailing list (the rest write her name another way)
const FP_BYNAME=[false,false,false,false,false,false,true,false,true,false];
scene("places",(ctx,S,t,sc)=>{const c=sc.cues,T=fp_once(sc,"T",()=>({where:c.where,six:c.six,hr:wAt(sc,"six","HR"),student:wAt(sc,"six","student system"),archive:wAt(sc,"six","archive"),
    alumni:wAt(sc,"six","alumni"),research:wAt(sc,"six","research"),learning:wAt(sc,"six","learning platform"),
    around:c.around,hours:wAt(sc,"around","hours"),payroll:wAt(sc,"around","payroll"),list:wAt(sc,"around","mailing list"),contracts:wAt(sc,"around","signed contracts"),
    tables:c.tables,copies:wAt(sc,"tables","copies outside"),spreadsheet:wAt(sc,"tables","spreadsheet"),
    name:c.name,missed:wAt(sc,"name","missed"),three:wAt(sc,"name","three ways"),accents:wAt(sc,"name","with accents"),without:wAt(sc,"name","without"),initial:wAt(sc,"name","initial"),
    every:c.every,docs:wAt(sc,"every","documents and tools"),record:c.record,links:wAt(sc,"record","links all six"),lineage:c.lineage,classes:c.classes,where2:wAt(sc,"classes","where else"),
    map:c.map,owner:wAt(sc,"map","an owner"),thirty:c.thirty,start:wAt(sc,"thirty","start looking")}));
  // how lit each of the ten places is: found by the search by name, or by every key
  const litOf=(k,tt)=>{const byName=ag_in(tt,T.missed-0.6,0.5)*(1-ag_in(tt,T.every+0.4,0.5)),wide=ag_in(tt,T.docs-0.4+k*0.14,0.4);
    return byName>0&&!FP_BYNAME[k]?Math.max(1-0.85*byName,wide):1;};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"fpMap",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
    const ins=[T.hr,T.student,T.archive,T.alumni,T.research,T.learning],ins2=[T.hours,T.payroll,T.list,T.contracts];
    // lineage first, under the panes: each place into the tables made from it, and one table out to a spreadsheet
    const lp=clamp((tt-T.lineage+0.2)/1.2,0,1),ta=ag_in(tt,T.tables-0.3,0.5);
    if(ta>0){const TB=[[150,520],[390,520],[630,520],[870,520],[1110,520],[1350,520]];
      cx.save();cx.globalAlpha*=ta;
      for(let i=0;i<6;i++){const b=fp_six(i),q=fp_four(Math.min(3,Math.floor(i*4/6)));if(lp>0){dp_link(cx,[b[0]+b[2]/2,b[1]+b[3]],[TB[i][0]+90,TB[i][1]],"cyan",lp,{lw:2,alpha:0.7,dot:false});}}
      TB.forEach(([x,y],i)=>{const vio=ag_in(tt,T.classes-0.1+i*0.1,0.4);rr(cx,x,y,180,74,10);cx.fillStyle="rgba(10,30,36,0.85)";cx.fill();cx.strokeStyle=rgba(DP.F.cyan,0.55);cx.lineWidth=1.6;cx.stroke();
        for(let r=0;r<3;r++){cx.fillStyle="rgba(190,245,245,0.22)";cx.fillRect(x+14,y+16+r*18,152,6);}
        if(vio>0){cx.fillStyle=rgba(DP.F.violet,vio);cx.fillRect(x+14+((i*37)%90),y+10,26,58);}});
      dp_T(cx,"tables made from them",150,640,{w:600,size:28,col:"mut"});
      const ea=ag_in(tt,T.spreadsheet-0.4,0.5);if(ea>0){withA(cx,ea,()=>{dp_panel(cx,1610,500,230,120,{col:"coral",r:14,glowR:24});dp_T(cx,"an export",1636,552,{w:700,size:30});dp_T(cx,"a spreadsheet",1636,596,{w:600,size:28,col:"mut"});});
        dp_link(cx,[1530,557],[1606,557],"coral",ea*ag_in(tt,T.spreadsheet,0.6),{lw:2.4,dash:[8,8]});}
      cx.restore();}
    // the six places, each with her number, and the four around them
    FP_SIX.forEach(([nm,num,own],i)=>{const [x,y,w,h]=fp_six(i);fp_up(cx,tt,ins[i]-0.3,null,a=>{const lit=litOf(i,tt);
      fp_pane(cx,x,y,w,h,{a,title:nm,titleSize:28,lit,pills:[{t:num,col:"cyan"}],lines:[{t:own,a:ag_in(tt,T.owner-0.3+i*0.12,0.4)||0}]});});});
    FP_FOUR.forEach(([nm,sub,own],i)=>{const [x,y,w,h]=fp_four(i);fp_up(cx,tt,ins2[i]-0.3,null,a=>{const lit=litOf(6+i,tt);
      fp_pane(cx,x,y,w,h,{a,title:nm,titleSize:28,lit,lines:[{t:sub},{t:own,a:ag_in(tt,T.owner-0.3+(6+i)*0.12,0.4)||0}]});});});
    // her name, three ways, and the search: by one name, two places light; by every number and form of her name, all of them
    const na=ag_io(tt,T.three-0.4,T.record-0.5,0.5);
    if(na>0){withA(cx,na,()=>{[["NGUYỄN Thị Linh",T.accents],["Nguyen Thi Linh",T.without],["L. Nguyen",T.initial]].forEach(([s,t0],i)=>{
        fp_up(cx,tt,t0-0.3,null,a=>dp_slip(cx,80+i*420,700,s,"cyan",{a,ink:true}));});});}
    const sa=ag_io(tt,T.name-0.3,T.record-0.5,0.5);if(sa>0){const wide=ag_in(tt,T.every-0.2,0.5);
      withA(cx,sa*(1-wide),()=>dp_slip(cx,1360,700,"search: Linh Nguyen","cyan",{ink:true}));
      withA(cx,sa*wide,()=>dp_slip(cx,1290,700,"every number, every form of her name","green",{ink:true}));
      fp_up(cx,tt,T.docs-0.2,T.record-0.5,a=>dp_T(cx,"in documents and tools as well as tables",1290,820,{w:600,size:28,col:"mut",a}));}
    // her person record, linking all six numbers
    fp_up(cx,tt,T.record-0.3,T.thirty-0.6,a=>{dp_panel(cx,560,682,1000,150,{col:"cyan",r:20,glowR:34,a});withA(cx,a,()=>{dp_T(cx,"PERSON RECORD · P-10482 · ONE PERSON, SIX NUMBERS",594,734,{w:800,size:28,ls:3,col:"cyan"});
      let px=594;FP_SIX.forEach(([nm,num],i)=>{const pa=ag_in(tt,T.links-0.4+i*0.1,0.4);px+=dp_pill(cx,px,800,num,"cyan",{a:pa})+12;});});});
    fp_up(cx,tt,T.classes+0.2,T.thirty-0.6,a=>dp_pill(cx,1350,666,"personal data","violet",{a}));
    fp_up(cx,tt,T.map+0.3,null,a=>dp_slip(cx,80,690,"kept since before anyone asked","cyan",{a,ink:true}));
    fp_up(cx,tt,T.thirty-0.2,null,a=>dp_card(cx,1060,690,780,{kick:"30 days",title:"time to answer, not to start looking"},{a}));}}]);
  fp_kick(ctx,S,t,4,sc.name,T.six-0.4);});

/* ---------------------------------------------------------------- 5 · More than a copy */
// the answer's parts: what, the reason (a green pill), and where from, who else gets it, until when
const FP_PARTS=[["Contracts and hours","contract, then law","from HR and the claims app · shared with payroll · until 7 years after each contract ends"],
  ["Pay records","law","from payroll · sent to the tax office · until 7 years after each contract ends"],
  ["Degree and results","public task","from the student system · shared with no one, unless you ask · kept for good"],
  ["Tutors' mailing list","agreed, Jan 2023","from the application form · shared with no one · until 24 Nov 2026, when you said no"]];
scene("copy",(ctx,S,t,sc)=>{const c=sc.cues,T=fp_once(sc,"T",()=>({asked:c.asked,alone:wAt(sc,"asked","A copy alone"),each:c.each,why:wAt(sc,"each","why it's held"),from:wAt(sc,"each","where it came from"),
    who:wAt(sc,"each","who else"),until:wAt(sc,"each","until when"),contracts:c.contracts,pay:c.pay,degree:c.degree,others:c.others,students:wAt(sc,"others","students' names"),theirs:wAt(sc,"others","theirs"),
    written:c.written,plain:wAt(sc,"written","for her")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"fpHall",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
    // a copy alone: rows of data with no reason, which doesn't say what it's for; it leaves as the answer opens out
    const ca=ag_io(tt,T.asked-0.3,T.each-0.4,0.5);if(ca>0)withA(cx,ca,()=>{dp_panel(cx,1240,170,560,420,{col:"cyan",r:18,glowR:28});
      for(let r=0;r<9;r++)for(let k=0;k<4;k++){cx.fillStyle="rgba(190,245,245,"+(0.14+0.08*((r+k)%2)).toFixed(2)+")";cx.fillRect(1268+k*130,206+r*40,110-(r*7+k*13)%40,10);}
      fp_up(cx,tt,T.alone-0.2,null,a=>dp_pill(cx,1240,660,"a copy alone: no reason","coral",{a}));});
    // the answer, part by part
    const sa=ag_in(tt,T.alone+0.9,0.5);if(sa>0){const x=90,w=1090+650*ag_sine(clamp((tt-T.each+0.3)/1.2,0,1));withA(cx,sa,()=>{dp_panel(cx,x,150,w,640,{col:"cyan",r:22,glowR:40});
        dp_T(cx,"What we hold about you",x+34,214,{w:800,size:40});
        const hd=[["why",T.why],["from",T.from],["shared with",T.who],["until",T.until]];let hx=x+34+dp_tw(cx,"What we hold about you",{w:800,size:40})+40;
        hd.forEach(([s,t0])=>{const a=ag_in(tt,t0-0.2,0.4),pw=dp_tw(cx,s,{w:700,size:28})+36;if(a>0)dp_pill(cx,hx,212,s,"cyan",{a,size:28});hx+=pw+14;});});
      const ins=[T.contracts,T.pay,T.degree,T.degree+3.6];
      FP_PARTS.forEach(([what,why,rest],i)=>{fp_up(cx,tt,ins[i]-0.3,null,a=>{const y=286+i*104;cx.fillStyle="rgba(190,245,245,0.16)";cx.fillRect(x+34,y-38,w-68,1.4);
        dp_T(cx,what,x+34,y+8,{w:700,size:34,a});dp_pill(cx,x+34+dp_tw(cx,what,{w:700,size:34})+24,y+6,why,"green",{a});
        dp_T(cx,rest,x+34,y+52,{w:600,size:28,col:"mut",a});});});
      // other people's data stays out: a row of her students' names and marks, hidden, and left out
      const oa=ag_io(tt,T.students-0.5,T.written-0.4,0.5);if(oa>0){const y=690;withA(cx,oa,()=>{
        dp_frost(cx,x+34,y,1672,78,c2=>{for(let k=0;k<6;k++){c2.fillStyle="rgba(240,240,255,0.9)";c2.fillRect(x+640+k*170,y+18,96,18);c2.fillRect(x+640+k*170,y+46,40,16);}},{r:12});
        dp_T(cx,"her students' names and marks",x+60,y+50,{w:700,size:30});
        fp_up(cx,tt,T.theirs-0.2,null,a=>dp_pill(cx,x+1690,y+52,"theirs, not hers: left out","coral",{a,align:"right"}));});}}
    fp_up(cx,tt,T.plain-0.4,null,a=>dp_pill(cx,90,862,"in plain words, not table names","green",{a}));}}]);
  fp_kick(ctx,S,t,5,sc.name,T.alone+0.3);});

/* ---------------------------------------------------------------- 6 · Off the list */
// the tutors' mailing list: rows of other people (hidden, violet) and hers (k: where her row is)
const FP_LROWS=7,FP_LHER=3;
function fp_list(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const rh=62,h=110+FP_LROWS*rh;
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:22,glowR:40});dp_T(ctx,"Tutors' mailing list",x+30,y+60,{w:800,size:36});
  if(o.badge)dp_pill(ctx,x+w-30,y+58,o.badge,"cyan",{align:"right",a:o.badgeA==null?1:o.badgeA});
  for(let r=0;r<FP_LROWS;r++){const ry=y+96+r*rh;if(r===FP_LHER){const ha=o.her==null?1:o.her;if(ha>0){withA(ctx,ha,()=>{rr(ctx,x+20,ry,w-40,rh-10,10);ctx.fillStyle="rgba(72,222,244,0.12)";ctx.fill();
        dp_T(ctx,"Linh Nguyen",x+40,ry+38,{w:700,size:30});});}continue;}
    dp_frost(ctx,x+20,ry,w-40,rh-10,c2=>{c2.fillStyle="rgba(240,240,255,0.9)";c2.fillRect(x+40,ry+16,150+(r*53)%120,20);},{r:10});}
  ctx.restore();return{x,y,w,h};}
// her person card, with her yes (green) or her no (coral) on it: u 0 the yes, 1 the no
function fp_personCard(ctx,x,y,w,u,o){o=o||{};const a=o.a==null?1:o.a,h=300;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:22,glowR:40});dp_T(ctx,"PERSON · P-10482",x+30,y+56,{w:800,size:28,ls:4,col:"cyan"});dp_T(ctx,"Linh Nguyen",x+30,y+112,{w:700,size:40});
  const ya=1-ag_sine(clamp(u*2,0,1)),na=ag_sine(clamp(u*2-1,0,1));
  if(ya>0)withA(ctx,ya,()=>{dp_pill(ctx,x+30,y+190,"yes","green",{});dp_T(ctx,"Send me news of tutoring work",x+120,y+190,{w:600,size:28});dp_T(ctx,"January 2023",x+120,y+240,{w:600,size:28,col:"mut"});});
  if(na>0)withA(ctx,na,()=>{dp_pill(ctx,x+30,y+190,"no","coral",{});dp_T(ctx,"Take me off the tutors' list",x+120,y+190,{w:600,size:28});dp_T(ctx,"24 November 2026",x+120,y+240,{w:600,size:28,col:"mut"});});
  if(o.glow>0)dp_halo(ctx,x+70,y+180,90,"coral",0.22*o.glow);
  ctx.restore();return{x,y,w,h};}
// the semester's rebuild: a loop of light from the sources to the list; p runs it once (0 to 1)
function fp_loop(ctx,A,B,p,o){o=o||{};if(p<=0)return;const a=o.a==null?1:o.a,col=o.col||"cyan",mx=(A[0]+B[0])/2,my=Math.min(A[1],B[1])-150;ctx.save();ctx.globalAlpha*=a;
  const N=40,u=clamp(p,0,1),pt=k=>{const s=k/N;return[(1-s)*(1-s)*A[0]+2*s*(1-s)*mx+s*s*B[0],(1-s)*(1-s)*A[1]+2*s*(1-s)*my+s*s*B[1]];};
  ctx.strokeStyle=rgba(dp_f(col),0.9);ctx.lineWidth=3;ctx.lineCap="round";ctx.shadowColor=rgba(dp_f(col),0.8);ctx.shadowBlur=8;ctx.beginPath();
  for(let k=0;k<=Math.round(N*u);k++){const q=pt(k);k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();
  if(u>0.02&&u<1){const q=pt(Math.round(N*u));ctx.fillStyle=rgba(mix(dp_f(col),[255,255,255],0.4),1);ctx.beginPath();ctx.arc(q[0],q[1],8,0,TAU);ctx.fill();}
  if(u>=1){const q=pt(N),q0=pt(N-2),an=Math.atan2(q[1]-q0[1],q[0]-q0[0]);ctx.translate(q[0],q[1]);ctx.rotate(an);ctx.fillStyle=rgba(dp_f(col),1);ctx.beginPath();ctx.moveTo(4,0);ctx.lineTo(-14,-9);ctx.lineTo(-14,9);ctx.closePath();ctx.fill();}
  ctx.restore();}
scene("list",(ctx,S,t,sc)=>{const c=sc.cues,T=fp_once(sc,"T",()=>({second:c.second,ticked:c.ticked,box:wAt(sc,"ticked","ticked a box"),news:wAt(sc,"ticked","send me news"),
    yes:c.yes,takeBack:wAt(sc,"yes","take back"),deleting:c.deleting,rebuilt:c.rebuilt,semester:wAt(sc,"rebuilt","Each semester"),contracts:wAt(sc,"rebuilt","contracts"),onPerson:wAt(sc,"rebuilt","on the person"),
    back:c.back,replaces:c.replaces,noW:wAt(sc,"replaces","her no"),date:wAt(sc,"replaces","its date"),next:c.next,leaves:wAt(sc,"next","leaves"),
    kept:c.kept,record:wAt(sc,"kept","the record"),nothing:wAt(sc,"kept","nothing that reads"),forget:c.forget,saidNo:wAt(sc,"forget","said no")}));
  const LX=1180,LY=190,LW=640;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"fpList",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
    const u=ag_in(tt,T.noW-0.2,1.0);
    const pc=fp_up(cx,tt,T.second-0.4,null,a=>fp_personCard(cx,100,190,640,u,{a,glow:ag_io(tt,T.record-0.3,T.forget+2.5,0.6)}));
    // her row: on the list; deleted; back with the rebuild; gone for good the next day
    const del=ag_in(tt,T.deleting,0.6),back=ag_in(tt,T.back-0.6,0.6)*(1-ag_in(tt,T.next+0.4,0.6));
    const her=tt<T.back-0.6?1-del:0.45*back;
    fp_up(cx,tt,T.second-0.2,null,a=>fp_list(cx,LX,LY,LW,{a,her,badge:tt>T.next-0.3?"Wed 25 Nov":null,badgeA:ag_in(tt,T.next-0.3,0.5)}));
    // the sources the list is rebuilt from each semester: HR's contracts of the last two years, and the yes on the person
    const sa=ag_in(tt,T.contracts-0.4,0.5);if(sa>0)withA(cx,sa,()=>dp_card(cx,100,560,640,{kick:"HR's contracts",title:"of the last two years"},{}));
    fp_loop(cx,[760,560],[LX-12,LY+330],clamp((tt-T.onPerson+0.2)/1.4,0,1),{a:1-ag_in(tt,T.back+1.6,0.6)});
    fp_up(cx,tt,T.semester-0.2,T.back+1.4,a=>dp_pill(cx,960,340,"each semester","cyan",{a,align:"center"}));
    // the next semester's rebuild reads the no, and adds nothing
    const nx=clamp((tt-T.nothing+0.4)/1.4,0,1);fp_loop(cx,[760,560],[LX-12,LY+330],nx,{col:"coral",a:1-ag_in(tt,T.forget-0.2,0.6)});
    fp_up(cx,tt,T.nothing-0.4,T.forget-0.2,a=>dp_pill(cx,960,340,"next semester: reads the no, adds no one","coral",{a,align:"center"}));
    fp_up(cx,tt,T.record-0.3,null,a=>dp_slip(cx,100,730,"kept: the record that she asked","coral",{a,ink:true}));
    fp_up(cx,tt,T.saidNo-0.3,null,a=>dp_T(cx,"To forget her here, remember one thing: that she said no.",960,840,{w:700,size:40,align:"center",a}));}}]);
  fp_kick(ctx,S,t,6,sc.name,T.second-0.2);});

/* ---------------------------------------------------------------- 7 · What stays, and why */
// what stays: the kind of record, its reason (green), and until when
const FP_STAYS=[["Pay records","law","7 years after each contract ends","T-26188 · until 20 Nov 2033"],["Degree and results","public task","kept for good",null],["Research data","the project's rules","as long as they require",null]];
scene("stays",(ctx,S,t,sc)=>{const c=sc.cues,T=fp_once(sc,"T",()=>({suppose:c.suppose,altogether:wAt(sc,"suppose","forgotten altogether"),not:c.not,payrec:c.payrec,last:c.last,y2033:wAt(sc,"last","twenty thirty-three"),
    degree:c.degree,research:c.research,decided:c.decided,owners:wAt(sc,"decided","owners"),schedule:wAt(sc,"decided","retention schedule"),reason:c.reason,readOnly:wAt(sc,"reason","read only"),
    says:c.says,why:wAt(sc,"says","why"),no:c.no,challenge:wAt(sc,"no","challenge"),like:c.like,page:wAt(sc,"like","newspaper's page"),isnt:wAt(sc,"like","isn't there")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"fpHall",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
    fp_up(cx,tt,T.suppose-0.3,T.payrec-0.4,a=>dp_card(cx,560,220,800,{kick:"Suppose she asked",title:"Forget me altogether"},{a}));
    fp_up(cx,tt,T.not-0.2,T.payrec-0.4,a=>dp_pill(cx,960,460,"not everything can go","coral",{a,align:"center"}));
    // what stays: three kinds of record, each with its reason and until when
    const ins=[T.payrec,T.degree,T.research];
    FP_STAYS.forEach(([what,why,until,date],i)=>{fp_up(cx,tt,ins[i]-0.3,null,a=>{const x=90+i*590,y=130;
      dp_panel(cx,x,y,560,290,{col:"green",r:22,glowR:40,a});withA(cx,a,()=>{dp_T(cx,what,x+30,y+64,{w:700,size:38});dp_pill(cx,x+30,y+130,why,"green",{});
        dp_T(cx,until,x+30,y+196,{w:600,size:28,col:"mut"});});
      if(date)fp_up(cx,tt,T.y2033-0.4,null,b=>dp_pill(cx,x+30,y+256,date,"cyan",{a:b}));});});
    // the retention schedule, signed before she asked, by the records' owners
    fp_up(cx,tt,T.schedule-0.6,null,a=>{dp_panel(cx,90,450,1740,140,{col:"cyan",r:20,glowR:34,a});withA(cx,a,()=>{dp_T(cx,"RETENTION SCHEDULE",130,504,{w:800,size:28,ls:4,col:"cyan"});
      dp_T(cx,"signed by the records' owners · 14 Oct 2026",130,558,{w:700,size:32});dp_T(cx,"Ingrid Holm, HR · Mei Tanaka, registrar",1060,558,{w:600,size:28,col:"mut"});});});
    const la=1-0.6*ag_in(tt,T.page-0.6,0.6);
    fp_up(cx,tt,T.reason-0.2,null,a=>dp_slip(cx,90,620,"kept for its reason only · read only by those who need it","green",{a:a*la,ink:true}));
    fp_up(cx,tt,T.says-0.2,null,a=>dp_slip(cx,90,712,"the answer says: what stays · why · until when","cyan",{a:a*la,ink:true}));
    fp_up(cx,tt,T.challenge-0.6,null,a=>dp_slip(cx,90,804,"if no: why, and how to challenge it","cyan",{a:a*la,ink:true}));
    // the page of 1998, small: it stays, for its reason
    const pa=ag_in(tt,T.page-0.4,0.6);if(pa>0){withA(cx,pa,()=>{fp_page(cx,1220,624,170,220,{lamp:0.4,hi:0});});
      fp_up(cx,tt,T.like+1.6,null,a=>dp_pill(cx,1420,700,"stays, for its reason","green",{a}));
      fp_up(cx,tt,T.isnt-0.3,null,a=>dp_T(cx,"and isn't there for anything else",1420,770,{w:600,size:28,col:"mut",a}));}}}]);
  fp_kick(ctx,S,t,7,sc.name,T.suppose);});

/* ---------------------------------------------------------------- 8 · A reason for every part */
scene("reason",(ctx,S,t,sc)=>{const c=sc.cues,T=fp_once(sc,"T",()=>({page:c.page,stayed:wAt(sc,"page","stayed"),went:c.went,link:wAt(sc,"went","link from"),noReason:wAt(sc,"went","no reason"),
    found:c.found,copy:c.copy,kept:c.kept,said:wAt(sc,"kept","what stays"),can:c.can}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"fpNet",keys:[[0,835,470,1.15]],push:0.015,draw:(cx,tt)=>{
      const nb=fp_online(cx,{hi:ag_in(tt,T.page,0.6)});fp_search(cx,FP_SBOX[0],FP_SBOX[1],FP_SBOX[2],FP_NAME,1,{});
      fp_up(cx,tt,T.stayed-0.3,null,a=>dp_pill(cx,1150,520,"true, lawful, and it stayed","green",{a}));
      fp_up(cx,tt,T.link-0.3,null,a=>{const sx=FP_SBOX[0]+FP_SBOX[2],sy=FP_SBOX[1]+44;dp_halo(cx,(sx+nb[0])/2,(sy+nb[1]+60)/2,60,"coral",0.25*a);
        dp_pill(cx,150,580,"the link from his name: no reason left","coral",{a});});}},
    {at:T.found-0.6,place:"fpMap",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{const fa=1-ag_in(tt,c.breath,0.9);if(fa>0)withA(cx,fa,()=>{
      // every place found (all of it leaves as the end card comes): the six places, lit
      FP_SIX.forEach(([nm,num],i)=>{const [x,y,w,h]=fp_six(i);fp_pane(cx,x,y,w,h,{title:nm,lit:ag_in(tt,T.found-0.2+i*0.12,0.4),dimRead:1,pills:[{t:num,col:"cyan"}]});});
      fp_up(cx,tt,T.found+0.6,null,a=>dp_slip(cx,80,330,"every place found","cyan",{a,ink:true}));
      // her copy, a reason for every part
      fp_up(cx,tt,T.copy-0.3,null,a=>{dp_panel(cx,80,430,840,330,{col:"cyan",r:22,glowR:40,a});withA(cx,a,()=>{dp_T(cx,"What we hold about you",114,494,{w:800,size:36});
        [["Contracts and hours","contract, then law"],["Pay records","law"],["Degree and results","public task"]].forEach(([w0,r],i)=>{const y=564+i*64;dp_T(cx,w0,114,y,{w:700,size:30});dp_pill(cx,520,y,r,"green",{});});});});
      // her no, kept; what stays, with its date
      fp_up(cx,tt,T.kept-0.3,null,a=>{dp_panel(cx,980,430,860,150,{col:"cyan",r:22,glowR:40,a});withA(cx,a,()=>{dp_pill(cx,1014,520,"no","coral",{});dp_T(cx,"kept on the person · 24 Nov 2026",1100,520,{w:600,size:30});});});
      fp_up(cx,tt,T.said-0.3,null,a=>{dp_panel(cx,980,610,860,150,{col:"green",r:22,glowR:40,a});withA(cx,a,()=>{dp_T(cx,"Pay records",1014,668,{w:700,size:30});dp_pill(cx,1014,728,"law","green",{});
        dp_pill(cx,1110,728,"until 20 Nov 2033","cyan",{});});});});}}
  ]);
  fp_kick(ctx,S,t,8,sc.name,T.page);
  dp_end(ctx,S,t,c.breath,FP_TITLE,"A person can ask. You must be able to answer.","Film 3 of 5",FP_SERIES);});
