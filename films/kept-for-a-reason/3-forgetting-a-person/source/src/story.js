/* ===== Forgetting a person: chapter 1, Found by his name (the opening story) =====
   Timed to its narration: wAt(sc, "line", "word") is the moment a word is said (in a line the voice reads differently, a word of what
   it says). The places are painted once (fp.js); what moves is drawn live in the shots of ag_shots. Between rooms a shot dissolves
   in, and what both pictures show is drawn in the same place, so nothing shows twice: the page of 1998 leaves the print room for the
   web inside the same window of glass, under the same camera. The place and the year are on the tag at the top left; the title card
   ends the chapter. */

const FP_BROW=[680,192,420,540];          // the window of the web the page is shown in: x, y, w, h (the page sits at FP_PAGE in it)
const FP_SBOX=[70,404,600];               // the search box: x, y, w
const FP_NAME="Mario Costeja González";
// the page in its window of the web, its notice lit by hi; returns the notice's box
function fp_online(ctx,o){o=o||{};let nb=null;fp_browser(ctx,FP_BROW[0],FP_BROW[1],FP_BROW[2],FP_BROW[3],{a:o.a,inside:c=>{nb=fp_page(c,FP_PAGE[0],FP_PAGE[1],FP_PAGE[2],FP_PAGE[3],{lamp:o.lamp==null?0.5:o.lamp,hi:o.hi});}});
  return nb||fp_noticeBox(FP_PAGE[0],FP_PAGE[1],FP_PAGE[2],FP_PAGE[3]);}
// the two links from the search box to the notice: drawn on by p, cut by cut
function fp_links(ctx,nb,p,cut,o){o=o||{};const sx=FP_SBOX[0]+FP_SBOX[2],sy=FP_SBOX[1]+44;
  fp_linkLine(ctx,[sx,sy-12],[nb[0],nb[1]+nb[3]*0.3],clamp(p,0,1),{cut,a:o.a});
  fp_linkLine(ctx,[sx,sy+12],[nb[0],nb[1]+nb[3]*0.7],clamp(p-0.15,0,1)/0.85,{cut,a:o.a});}

scene("story",(ctx,S,t,sc)=>{const c=sc.cues,G0=fp_once(sc,"g0",()=>fp_g0(sc)),T=fp_once(sc,"T",()=>({
    order:c.order,labour:wAt(sc,"order","labour ministry"),notice:wAt(sc,"order","short notice"),
    lawyer:c.lawyer,property:wAt(sc,"lawyer","property"),whoever:wAt(sc,"lawyer","whoever"),
    years:c.online,goOnline:wAt(sc,"online","go online"),y2009:wAt(sc,"online","two thousand nine"),search:wAt(sc,"online","a search"),links:wAt(sc,"online","shows links"),
    trueW:wAt(sc,"true","true"),settled:wAt(sc,"true","settled"),
    anyone:c.anyone,client:wAt(sc,"anyone","a client"),neighbour:wAt(sc,"anyone","neighbour"),news:wAt(sc,"anyone","as if"),
    asks:c.asks,remove:wAt(sc,"asks","remove it"),saysNo:wAt(sc,"asks","It says no"),lawfully:wAt(sc,"asks","lawfully"),
    change:c.change,
    agency:c.agency,complains:wAt(sc,"agency","complains"),dpa:wAt(sc,"agency","data protection agency"),
    keep:wAt(sc,"links","keep its page"),removeL:wAt(sc,"links","remove the links"),
    court:c.court,goesCourt:wAt(sc,"court","goes to court"),spainCourt:wAt(sc,"court","Spain's court"),cjeu:wAt(sc,"court","Court of Justice"),
    rules:c.rules,itRules:wAt(sc,"rules","it rules"),
    even:c.even,trueInfo:wAt(sc,"even","true information"),
    relevant:wAt(sc,"relevant","no longer relevant"),
    unless:c.unless,
    him:c.him,sixteen:wAt(sc,"him","sixteen"),noSuch:wAt(sc,"him","no such"),
    stays:c.stays,pageStays:wAt(sc,"stays","page stays"),linkGoes:wAt(sc,"stays","link from"),
    ask:c.ask,directly:wAt(sc,"ask","directly"),firstDay:wAt(sc,"ask","first day"),twelve:wAt(sc,"ask","twelve thousand"),
    since:c.since,million:wAt(sc,"since","two million"),links8:wAt(sc,"since","eight and a half"),
    person:c.person,half:wAt(sc,"person","over half"),refusal:wAt(sc,"person","refusal"),
    linh:c.linh,contract:wAt(sc,"linh","contract"),
    writes:c.writes,tell:wAt(sc,"writes","tell me"),takeOff:wAt(sc,"writes","take me off"),
    sits:c.sits,places:wAt(sc,"sits","more places"),
    words:c.words,findAll:wAt(sc,"words","find it all"),
    answer:c.answer,anAnswer:wAt(sc,"answer","an answer"),every:wAt(sc,"answer","every part")}));
  const P=FP_PAGE,nb0=fp_noticeBox(P[0],P[1],P[2],P[3]);
  ag_shots(ctx,S,t,sc.dur,[
    // Barcelona, 1998: the print room at night, the page under the lamp, its notice; years pass, and the page goes behind glass
    {at:0,place:"fpPress",push:0,d:1.8,keys:[[0,960,540,1.0],[T.order-0.8,1000,470,1.24],[T.years-0.6,890,470,1.5]],draw:(cx,tt)=>{
      fp_page(cx,P[0],P[1],P[2],P[3],{hi:ag_in(tt,T.notice-0.2,0.6)*(1-ag_in(tt,T.years-0.7,0.5))});
      const out=T.years-0.7;
      fp_up(cx,tt,T.labour-0.4,out,a=>{dp_link(cx,[nb0[0]+nb0[2]+6,nb0[1]+20],[1130,300],"cyan",ag_in(tt,T.labour-0.2,0.6),{alpha:a});
        dp_card(cx,1130,236,540,{kick:"Notice of auction",title:"by order of the labour ministry"},{a});});
      fp_up(cx,tt,T.property-0.5,out,a=>dp_card(cx,1130,452,540,{title:"his property",sub:"to pay social security"},{a}));
      fp_up(cx,tt,T.whoever-0.3,out,a=>dp_pill(cx,1130,700,"sold to whoever bids most","cyan",{a}));
      // the years, and the window of glass that comes round the page as it goes online
      fp_years(cx,1100,486,"1998","2009",clamp((tt-T.years)/(T.y2009-T.years+0.3),0,1),{a:ag_in(tt,T.years-0.1,0.4)});
      const ba=ag_in(tt,T.goOnline-0.6,0.6);if(ba>0)fp_online(cx,{a:ba,lamp:1});}},
    // online, 2009: the same page in the same window, now in the web; his name typed in a search box, and two links to the notice
    {at:T.goOnline-0.2,place:"fpNet",dis:0.8,push:0,d:1.8,keys:[[0,890,470,1.5],[T.goOnline+0.8,835,470,1.15]],draw:(cx,tt)=>{
      const nb=fp_online(cx,{lamp:1-0.5*ag_in(tt,T.goOnline+0.2,1.2),hi:ag_in(tt,T.links+0.4,0.5)});
      fp_years(cx,1100,486,"1998","2009",clamp((tt-T.years)/(T.y2009-T.years+0.3),0,1),{a:1-ag_in(tt,T.links-0.3,0.5)});
      const sa=ag_in(tt,T.search-0.6,0.5);
      if(sa>0)fp_search(cx,FP_SBOX[0],FP_SBOX[1],FP_SBOX[2],FP_NAME,clamp((tt-T.search+0.1)/1.3,0,1),{a:sa,caret:true,t:tt});
      fp_links(cx,nb,clamp((tt-T.links)/0.8,0,1),0);
      fp_up(cx,tt,T.trueW-0.25,null,a=>dp_pill(cx,1150,520,"true","green",{a}));
      fp_up(cx,tt,T.settled-0.25,null,a=>dp_slip(cx,1150,566,"settled years ago","cyan",{a,ink:true}));}},
    // anyone who looks him up: a client at her desk, a neighbour at his door, at night, each reading it
    {at:T.anyone-0.5,place:"fpWindows",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      fp_inWindow(cx,0,c=>{withA(c,1,()=>{dp_person(c,FP_CLIENT,470,520,0.95,{t:tt+G0,light:"lamp",gaze:[3,1],cut:630});
        fp_monitor(c,690,470,1);fp_light(c,560,370,180,[170,214,230],0.09);});});
      fp_inWindow(cx,1,c=>{withA(c,1,()=>{dp_person(c,FP_NEIGH,1320,500,1.0,{t:tt+G0+3.1,light:"lamp",pose:"hold",hold:(c2,h)=>fp_phone(c2,h,1),gaze:[2,5],nod:0.06,cut:890});
        fp_light(c,1430,380,170,[170,214,230],0.10);});});
      dp_tag(cx,560,40,"a client","cyan",{a:ag_in(tt,T.client-0.3,0.5),to:[470,236],p:ag_in(tt,T.client-0.1,0.5)});
      dp_tag(cx,1100,40,"a neighbour","cyan",{a:ag_in(tt,T.neighbour-0.3,0.5),to:[1320,206],p:ag_in(tt,T.neighbour-0.1,0.5)});}},
    // back at the newspaper: he asks it to remove the notice; it won't. Something has to change
    {at:T.asks-0.5,place:"fpPress",keys:[[0,1000,500,1.18]],push:0.02,draw:(cx,tt)=>{
      const out=T.change-0.5;fp_page(cx,P[0],P[1],P[2],P[3],{hi:0.5*ag_io(tt,T.asks,out,0.6),lamp:1-0.4*ag_in(tt,T.change-0.4,0.8)});
      fp_up(cx,tt,T.remove-0.6,out,a=>dp_card(cx,1130,214,560,{kick:"His request",title:"Please remove the notice"},{a}));
      fp_up(cx,tt,T.saysNo-0.2,out,a=>dp_pill(cx,1130,440,"won't remove","coral",{a}));
      fp_up(cx,tt,T.lawfully-0.4,out,a=>dp_card(cx,1130,488,560,{kick:"Its answer",title:"printed lawfully, as ordered"},{a}));
      fp_up(cx,tt,T.change-0.2,null,a=>dp_slip(cx,890,394,"The notice follows him","cyan",{a,align:"center",size:40,ink:true}));}},
    // Madrid, 2010: the data protection agency, and its decision: the page stays, the links go
    {at:T.agency-0.5,place:"fpAgency",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const out=T.keep-0.5;
      fp_up(cx,tt,T.dpa-0.5,out,a=>dp_card(cx,560,80,800,{kick:"His complaint, 2010",title:"Spain's data protection agency",sub:"the public body that upholds its privacy law"},{a}));
      fp_up(cx,tt,T.keep-0.2,null,a=>fp_verdict(cx,400,290,500,"The newspaper's page","stays","green",{a,pill:ag_in(tt,T.keep+0.3,0.4)}));
      fp_up(cx,tt,T.removeL-0.4,null,a=>fp_verdict(cx,1020,290,500,"The links to it","remove","coral",{a,pill:ag_in(tt,T.removeL,0.4)}));}},
    // the search engine appeals; Spain's court asks the Court of Justice
    {later:true,at:T.court-0.6,place:"fpAgency",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      fp_up(cx,tt,T.goesCourt-0.5,null,a=>dp_slip(cx,960,150,"The search engine appeals","cyan",{a,align:"center",ink:true}));
      const b1=fp_up(cx,tt,T.spainCourt-0.3,null,a=>dp_slip(cx,330,330,"Spain's court","cyan",{a,ink:true}));
      const b2=fp_up(cx,tt,T.cjeu-0.3,null,a=>dp_slip(cx,1010,330,"Court of Justice of the EU","cyan",{a,ink:true}));
      if(b1)dp_link(cx,[b1.x+b1.w+10,365],[1000,365],"cyan",clamp((tt-T.cjeu+0.6)/0.6,0,1),{lw:3});}},
    // Luxembourg, 13 May 2014: the ruling, in three lines; sixteen years on, there's no such reason
    {at:T.rules-0.5,place:"fpCourt",keys:[[0,960,540,1.0],[T.even-0.6,960,500,1.06]],d:2.0,push:0.01,draw:(cx,tt)=>{
      const ra=ag_in(tt,T.trueInfo-0.6,0.5);if(ra>0){withA(cx,ra,()=>{dp_panel(cx,380,250,1160,400,{col:"cyan",r:22,glowR:40,behind:fp_dim("fpCourt",0.62)});
        dp_T(cx,"THE RULING",430,316,{w:800,size:28,ls:4,col:"cyan"});});
        const L=[["true and lawful",T.trueInfo-0.2],["no longer relevant, or excessive, with time",T.relevant-0.2],["unless the public has a strong reason",T.unless-0.2]];
        L.forEach(([s,t0],i)=>{const a=ag_in(tt,t0,0.5)*ra;if(a<=0)return;const y=404+i*86+fp_rise(tt,t0);
          withA(cx,a,()=>{dp_halo(cx,452,y-14,26,"cyan",0.3);cx.fillStyle=rgba(DP.F.cyan,1);cx.beginPath();cx.arc(452,y-14,7,0,TAU);cx.fill();dp_T(cx,s,480,y,{w:700,size:40});});});}
      fp_years(cx,420,740,"1998","2014",clamp((tt-T.sixteen+0.4)/1.0,0,1),{a:ag_in(tt,T.sixteen-0.5,0.4),gap:150,label:"16 years on"});
      fp_up(cx,tt,T.noSuch-0.2,null,a=>dp_pill(cx,1040,740,"for him: no such reason","coral",{a}));}},
    // online, 2014: the page stays; the link from his name is cut
    {at:T.stays-0.6,place:"fpNet",keys:[[0,835,470,1.15]],push:0.015,draw:(cx,tt)=>{
      const nb=fp_online(cx,{hi:ag_in(tt,T.pageStays-0.2,0.5)});
      fp_search(cx,FP_SBOX[0],FP_SBOX[1],FP_SBOX[2],FP_NAME,1,{});
      fp_links(cx,nb,1,clamp((tt-T.linkGoes+0.1)/1.0,0,1));
      fp_up(cx,tt,T.pageStays-0.2,null,a=>dp_pill(cx,1150,520,"the page stays","green",{a}));
      fp_up(cx,tt,T.linkGoes+0.3,null,a=>dp_pill(cx,150,580,"the link from his name goes","coral",{a}));}},
    // Europe, since 2014: anyone can ask; the requests, each reviewed by a person; a little over half come down
    {later:true,at:T.ask-0.6,place:"fpNet",keys:[[0,835,470,1.15],[T.ask-0.2,960,540,1.0]],d:1.8,push:0.015,draw:(cx,tt)=>{
      const fa=ag_in(tt,T.ask+0.1,0.5);
      if(fa>0)withA(cx,fa,()=>{dp_panel(cx,110,190,700,420,{col:"cyan",r:22,glowR:40});dp_T(cx,"Ask to remove a link",150,262,{w:700,size:40});
        for(let k=0;k<3;k++){rr(cx,150,300+k*74,620,50,12);cx.fillStyle="rgba(190,245,245,0.10)";cx.fill();cx.strokeStyle="rgba(190,245,245,0.28)";cx.lineWidth=1.5;cx.stroke();}
        dp_pill(cx,150,566,"send","cyan",{});});
      fp_up(cx,tt,T.firstDay-0.3,null,a=>dp_slip(cx,110,650,"first day · over 12,000","cyan",{a,ink:true}));
      const ma=ag_in(tt,T.million-0.5,0.5);
      if(ma>0)withA(cx,ma,()=>{cx.save();cx.translate(0,fp_rise(tt,T.million-0.5));dp_panel(cx,960,190,860,210,{col:"cyan",r:22,glowR:40});
        dp_T(cx,"over 2.2 million requests",1000,278,{w:800,size:56});
        withA(cx,ag_in(tt,T.links8-0.3,0.5),()=>dp_T(cx,"for 8.5 million links",1000,350,{w:600,size:36,col:"mut"}));cx.restore();});
      fp_up(cx,tt,T.person-0.3,null,a=>dp_slip(cx,960,440,"each reviewed by a person","cyan",{a,ink:true}));
      // the bar: a little over half removed (green), the rest refused, each with a reason (coral)
      const ba=ag_in(tt,T.half-0.4,0.4);if(ba>0){const x=960,y=560,w=860,h=52,gp=ag_sine(clamp((tt-T.half+0.2)/1.0,0,1)),rp=ag_sine(clamp((tt-T.refusal+0.4)/0.8,0,1));
        withA(cx,ba,()=>{rr(cx,x,y,w,h,h/2);cx.fillStyle="rgba(190,245,245,0.08)";cx.fill();cx.strokeStyle="rgba(190,245,245,0.3)";cx.lineWidth=1.5;cx.stroke();
          cx.save();rr(cx,x,y,w,h,h/2);cx.clip();cx.fillStyle=rgba(DP.F.green,1);cx.fillRect(x,y,w*0.542*gp,h);cx.fillStyle=rgba(DP.F.coral,1);cx.fillRect(x+w*0.542,y,w*0.458*rp,h);cx.restore();});
        fp_up(cx,tt,T.half,null,a=>dp_pill(cx,x,y+118,"removed","green",{a}));
        fp_up(cx,tt,T.refusal-0.2,null,a=>dp_pill(cx,x+w*0.542+10,y+118,"refused, with a reason","coral",{a}));}}},
    // the university, 2026: Linh, her contract's end, her letter; her data in more places than anyone could list
    {at:T.linh-0.6,place:"fpUni",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const top=fp_desk(cx,170,690,700);dp_person(cx,"linh",430,540,1,{t:tt+G0,cut:top,gaze:[3,1]});fp_laptop(cx,700,690,{});
      const out=T.sits-0.5;
      fp_up(cx,tt,T.linh-0.1,out,a=>dp_card(cx,1000,130,640,{kick:"Linh Nguyen",title:"Casual tutor",sub:"contract ends 20 Nov 2026"},{a}));
      const la=ag_io(tt,T.writes-0.3,out,0.5);
      if(la>0){cx.save();cx.translate(0,fp_rise(tt,T.writes-0.3));withA(cx,la,()=>{dp_panel(cx,1000,380,780,250,{col:"cyan",r:22,glowR:40});
          dp_T(cx,"FROM LINH · 24 NOV 2026",1040,440,{w:800,size:28,ls:4,col:"cyan"});
          withA(cx,ag_in(tt,T.tell-0.2,0.5),()=>dp_T(cx,"What do you hold about me?",1040,512,{w:700,size:36}));
          withA(cx,ag_in(tt,T.takeOff-0.2,0.5),()=>dp_T(cx,"Take me off the tutors' mailing list.",1040,572,{w:700,size:36}));});cx.restore();}
      // her data, scattered: panes with no words, lit one by one as the university finds it all
      const SC=[[1010,150],[1290,110],[1570,170],[1060,360],[1350,330],[1630,390],[1010,570],[1300,560],[1590,600]];
      SC.forEach(([x,y],k)=>{const a=ag_in(tt,T.places-0.4+k*0.12,0.5)*(1-0.6*ag_in(tt,T.anAnswer-0.6,0.6));if(a<=0)return;
        fp_ghostPane(cx,x,y,230,140,ag_in(tt,T.findAll+k*0.1,0.4),{a});});
      fp_up(cx,tt,T.findAll-0.2,T.anAnswer-0.7,a=>dp_pill(cx,1300,800,"find it all","cyan",{a,align:"center"}));
      fp_up(cx,tt,T.anAnswer-0.3,null,a=>dp_card(cx,1040,330,760,{title:"an answer, with a reason for every part"},{a}));}}
  ]);
  fp_tags(ctx,S,t,[[0.4,"Barcelona · 1998"],[T.goOnline,"Online · 2009"],[T.anyone-0.5,"Barcelona · 2009"],[T.agency-0.3,"Madrid · 2010"],[T.rules-0.3,"Luxembourg · 13 May 2014"],
    [T.stays-0.4,"Online · 2014"],[T.ask-0.4,"Europe · since 2014"],[T.linh-0.5,"The university · 2026"]]);
  dp_title(ctx,S,t,c.breath,FP_TITLE,"What a person can ask, and how to answer",FP_LINE);});
