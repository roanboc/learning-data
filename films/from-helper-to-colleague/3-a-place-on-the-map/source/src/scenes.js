/* ===== A contributor joins: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (past.js, lab.js); what moves is drawn live in the shots of ag_shots. The opening is Southern California: the hills, the lot where
   help arrives and the map on its table, in 1970 and the years after. Then the university's lab, one room for the rest of the film,
   where the camera glides on from shot to shot and a later moment lets what was there leave first (later:true); between the 1970
   places and the lab, the whole picture changes, so it dissolves. People and the agent move on the film's own clock (cj_gt), so where
   one chapter glides into the next they breathe as one and stay put. The title card ends chapter 2, the end card chapter 7. */

const cj_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the film's own clock: a chapter's time plus where the chapter starts
const cj_gt=(sc,tt)=>sc.start+tt;
// a pill or a card that comes in at t0, springing, and leaves at t1 (null: it stays)
function cj_pillAt(ctx,x,y,text,tt,t0,t1,o){o=o||{};const a=ag_in(tt,t0,0.4)*(t1==null?1:1-ag_in(tt,t1,0.4));if(a<=0)return null;
  ctx.save();ag_about(ctx,x,y,lerp(0.8,1,Math.min(1,ag_spr(tt,t0,0.5))));const b=ag_pill(ctx,x,y,text,Object.assign({},o,{a:a*(o.a==null?1:o.a)}));ctx.restore();return b;}
function cj_cardAt(ctx,x,y,w,words,tt,t0,t1,o){o=o||{};const a=ag_in(tt,t0,0.4)*(t1==null?1:1-ag_in(tt,t1,0.4));if(a<=0)return null;
  return ag_textCard(ctx,x,y,w,words,Object.assign({kickCol:AG.kick},o,{a:a*(o.a==null?1:o.a),k:Math.min(1,ag_spr(tt,t0,0.5))}));}

/* ---------------------------------------------------------------- 1970: the leaders, their words and their radios */
// three crew leaders from three kinds of agency: apart, each on its own radio channel (B), and side by side, once they all cooperate,
// facing the gap where one shared way of working was missing (D: drawn the same at the opening's end and the next chapter's start)
const CJ_LB=[{p:CJ_CAPT,x:380,y:660,s:0.95,f:false,mk:0,kind:"City",word:"Sector 2",ch:"on channel 2",col:CJ_MARKC[0]},
  {p:CJ_COUNTY,x:960,y:660,s:0.95,f:true,mk:4,kind:"County",word:"Division B",ch:"on channel 7",col:CJ_MARKC[4],ph:0.7},
  {p:CJ_FOREST,x:1540,y:660,s:0.95,f:true,mk:1,kind:"Federal",word:"Zone 4",ch:"on channel 5",col:CJ_MARKC[1],ph:1.4}];
const CJ_LD=[{p:CJ_COUNTY,x:220,y:690,s:0.9,ph:0.7},{p:CJ_FOREST,x:480,y:690,s:0.9,ph:1.4},{p:CJ_CAPT,x:740,y:690,s:0.9}];
// a leader; o.radio holds the radio up, o.lamp lights it, o.talk opens the mouth. Returns the aerial's tip in the frame, or null
function cj_leader(ctx,L,gt,o){o=o||{};const q={t:gt+(L.ph||0),flip:!!L.f,smile:o.smile||0,talk:o.talk||0,gaze:o.gaze||[2,0]};
  if(o.radio){q.pose="hold";q.hold=cj_holdRadio({talk:o.lamp});}
  const h=ag_person(ctx,L.p,L.x,L.y,L.s,q);if(!o.radio||!h||!h.near)return null;
  const fx=h.near[0]+14+16*1.15,fy=h.near[1]+40-206*1.15;return[L.x+(fx-296)*L.s*(L.f?-1:1),L.y+(fy-596)*L.s];}
// a leader's card over their head: what kind of agency, their word for the same place, their channel; the agency's plain mark
function cj_wordCard(ctx,L,title,sub,a,k){if(a<=0.01)return;const b=ag_textCard(ctx,L.x-180,112,360,{kick:L.kind,title,sub},{kickCol:AG.kick,a,k});
  cj_mark(ctx,b.x+b.w-46,b.y+46,20,L.mk,{a});}
// the leaders side by side, and the gap where one shared way of working was missing; o.missing (0 to 1) the gap, o.coop the pill
function cj_together(ctx,gt,o){o=o||{};CJ_LD.forEach(L=>ag_person(ctx,L.p,L.x,L.y,L.s,{t:gt+(L.ph||0),gaze:[3,-1],smile:0.12}));
  const B=CJ_BD,m=o.missing||0;
  if(m>0.01){ctx.save();ctx.globalAlpha*=m;ctx.fillStyle="rgba(246,243,236,0.8)";rr(ctx,B.x,B.y,B.w,B.h,18);ctx.fill();ctx.setLineDash([18,14]);ctx.strokeStyle=rgba(AG.mut,0.7);ctx.lineWidth=4;rr(ctx,B.x,B.y,B.w,B.h,18);ctx.stroke();ctx.setLineDash([]);
    ag_T(ctx,"one way of working",B.x+B.w/2,B.y+B.h/2-4,{w:700,size:40,align:"center",col:AG.mut});
    ag_T(ctx,"they all shared",B.x+B.w/2,B.y+B.h/2+52,{w:700,size:40,align:"center",col:AG.mut});ctx.restore();
    ag_pill(ctx,B.x+B.w/2,B.y,"missing",{col:AG.amber,icon:"warn",a:m*(o.miss==null?1:o.miss)});}
  if((o.coop||0)>0.01)ag_pill(ctx,480,300,"every agency cooperated",{a:o.coop});}
// a crew's card on its way from the check-in to its slot on the board: u 0 to 1, along an arc
function cj_flyCard(ctx,from,to,u,words,o){o=o||{};const e=ag_sine(u),x=lerp(from[0],to[0],e),y=lerp(from[1],to[1],e)-150*Math.sin(Math.PI*e);
  cj_tcard(ctx,x,y,CJ_CW,words,{h:CJ_CH,a:o.a==null?1:o.a,band:o.band});}
// the crews' cards in their agencies' colours
const CJ_BANDK={C0_0:0,C0_1:4,C0_2:1,C0_3:2,C1_0:3,C1_1:0,C1_2:5,C1_3:6,C2_0:2,C2_1:4,C2_2:1};
const cj_band=k=>mix(CJ_MARKC[k%7],[255,255,255],0.3);
const cj_bandOf=key=>CJ_BANDK[key]==null?null:cj_band(CJ_BANDK[key]);
// where a later crew's card goes: under the last card of column i
const cj_below=(i,n)=>{const s=cj_slot("C"+i+"_0");return{x:s.x,y:s.y+n*(CJ_CH+6)};};
// the agencies' marks spread over the map's land, more and more of them (seeded, so every render puts them in the same places)
const CJ_SPREAD=(()=>{const R=ag_rnd(41),out=[];let n=0;while(out.length<34&&n<2000){n++;const x=150+R()*1640,y=120+R()*760;
  const cy=x<1300?600+x*0.37:1080;if(y>cy-60)continue;if(x>1140&&y<330)continue;if(out.some(p=>Math.hypot(p[0]-x,p[1]-y)<90))continue;out.push([x,y,out.length%7]);}return out;})();

/* ---------------------------------------------------------------- 1 · Thirteen days in 1970 */
scene("first",(ctx,S,t,sc)=>{const T=cj_once(sc,"T",()=>({
    days:wAt(sc,"place","For thirteen"),died:wAt(sc,"lost","Sixteen"),came:wAt(sc,"came","Some"),
    own:wAt(sc,"own","Each agency"),words:wAt(sc,"own","own words"),radio:wAt(sc,"own","radio"),
    reach:wAt(sc,"reach","struggled"),voices:wAt(sc,"reach","too many voices"),
    picture:wAt(sc,"picture","nobody"),all:wAt(sc,"picture","all the fires"),
    send:wAt(sc,"send","hard"),where:wAt(sc,"send","where"),
    best:wAt(sc,"best","Every agency"),missing:wAt(sc,"best","missing"),change:wAt(sc,"change","Something")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the hills in the autumn of 1970: the fires along the far ridge, the smoke leaning away from the wind; then help on the road
    {at:0,place:"cjHills",keys:[[0,960,540,1.0]],push:0.03,draw:(cx,tt)=>{const gt=cj_gt(sc,tt);
      const E=[[0,0],[2,2],[4,4],[1,1],[3,3]];
      cj_hillsLife(cx,gt,{engines:E.map((e,i)=>{const u=(tt-(T.came-0.8+i*2.2))/17;return[u*0.92,CJ_ENG[e[0]],e[1],clamp(u*10,0,1)];}).filter(e=>e[0]>0)});
      cj_scr(cx,S,()=>cj_tag(cx,"Southern California · 1970",ag_in(tt,0.6,0.6)*(1-ag_in(tt,T.own-1.4,0.5))));
      cj_pillAt(cx,1500,140,"13 days",tt,T.days,T.died-0.7,{size:30});
      cj_cardAt(cx,1180,104,640,{kick:"In thirteen days",title:"16 people died",sub:"about 700 homes and other buildings lost"},tt,T.died-0.2,T.came-0.6);
      cj_cardAt(cx,1180,104,640,{kick:"Came to help",title:"About 20,000 firefighters",sub:"from about 500 agencies: city, county, state and federal"},tt,T.came+0.1,T.own-1.4);}},
    // the lot at the hills' foot: three leaders from three kinds of agency, each organised its own way, with its own words, on its own
    // radio channel; near the fires, too many voices on too many channels
    {at:T.own-0.9,place:"cjCamp",keys:[[0,960,540,1.0]],push:0.025,draw:(cx,tt)=>{const gt=cj_gt(sc,tt);
      CJ_LB.forEach((L,i)=>{const busy=ag_io(tt,T.reach-0.3+i*0.4,T.picture-1.3,0.3),on=busy>0.5&&Math.sin(gt*5.3+i*2.1)>-0.2;
        const ae=cj_leader(cx,L,gt,{radio:true,lamp:on,talk:on?0.35:0});
        if(ae&&busy>0.01)cj_waves(cx,ae[0],ae[1],gt+i*0.33,busy,L.col);});
      CJ_LB.forEach((L,i)=>cj_wordCard(cx,L,L.word,L.ch,ag_in(tt,T.own-0.3+i*0.35,0.4),Math.min(1,ag_spr(tt,T.own-0.3+i*0.35,0.5))));
      cj_pillAt(cx,960,62,"too many voices, on too many channels",tt,T.voices-0.2,null,{col:AG.amber,icon:"warn"});}},
    // the map on its table: each agency's own sheet, each drawn at another hour, none with all the fires; then engines that wait far
    // from the fire that needs them
    {at:T.picture-0.9,place:"cjMap",keys:[[0,960,540,1.0]],push:0.025,draw:(cx,tt)=>{
      const g=k=>0.55+0.45*ag_in(tt,T.picture+k,4);
      cj_fire(cx,640,330,110,tt,{g:g(0)});cj_fire(cx,1280,250,90,tt,{g:g(0.6)});cj_fire(cx,880,560,70,tt,{g:g(1.2)});
      cj_fire(cx,1500,640,120,tt,{g:0.5+0.5*ag_in(tt,T.send,5)});
      const sa=1-ag_in(tt,T.send-0.4,0.6);
      cj_sheet(cx,140,110,420,290,{a:ag_in(tt,T.picture-0.4,0.4)*sa,mark:1,fires:[[0.12,-0.08,0.13]],when:"Tue 2 a.m.",rot:-0.05});
      cj_sheet(cx,1380,110,420,290,{a:ag_in(tt,T.picture-0.1,0.4)*sa,mark:4,fires:[[-0.18,0.05,0.12],[0.2,0.1,0.08]],when:"Mon 9 p.m.",rot:0.04});
      cj_sheet(cx,700,600,420,290,{a:ag_in(tt,T.picture+0.2,0.4)*sa,mark:0,fires:[[0.05,-0.12,0.1]],when:"Tue 6 a.m.",rot:-0.02});
      cj_pillAt(cx,960,72,"no one up-to-date picture of all the fires",tt,T.all-0.1,T.send-0.4,{col:AG.amber,icon:"warn"});
      // engines waiting by a town, far from the fire that grows; the way to it unknown
      const wa=ag_in(tt,T.send-0.2,0.5);[[300,528,0],[372,528,2],[444,528,4],[336,570,1],[408,570,3]].forEach((e,i)=>cj_token(cx,e[0],e[1],CJ_ENG[e[2]],wa*ag_in(tt,T.send+i*0.12,0.3)));
      if(wa>0.01){const u=ag_sine(clamp((tt-T.where+0.4)/1.2,0,1));cx.save();cx.globalAlpha*=wa;cx.setLineDash([14,12]);cx.strokeStyle=rgba(AG.amber,0.8);cx.lineWidth=4;
        cx.beginPath();cx.moveTo(490,548);cx.quadraticCurveTo(980,420,lerp(490,1380,u),lerp(548,630,u));cx.stroke();cx.setLineDash([]);cx.restore();
        ag_pill(cx,930,470,"?",{col:AG.amber,a:wa*ag_in(tt,T.where+0.6,0.4),size:36});}
      cj_pillAt(cx,960,72,"engines and crews, sent where?",tt,T.where-0.1,null,{col:AG.amber,icon:"warn"});}},
    // side by side on the lot: every agency cooperated as well as it could; what was missing was one way of working they all shared
    {at:T.best-0.9,place:"cjCamp",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      cj_together(cx,cj_gt(sc,tt),{coop:ag_in(tt,T.best+0.2,0.4),missing:ag_in(tt,T.missing-0.3,0.6)});}}],0.6);
});

/* ---------------------------------------------------------------- 2 · One way of working */
// the agent in the lab, where this chapter leaves it and the next finds it
const CJ_AG={x:1500,y:470,r:92,floor:730};
scene("scope",(ctx,S,t,sc)=>{const c=sc.cues,T=cj_once(sc,"T",()=>({
    seven:wAt(sc,"began","seven of"),fs:wAt(sc,"began","Firescope"),
    door:wAt(sc,"door","Its"),every:wAt(sc,"door","everyone"),
    card:wAt(sc,"card","Each crew"),board:wAt(sc,"card","one board"),structure:wAt(sc,"card","one structure"),
    role:wAt(sc,"role","Each place"),answers:wAt(sc,"role","one person"),seven2:wAt(sc,"seven","Nobody"),
    plain:wAt(sc,"plain","the same"),codes:wAt(sc,"plain","no codes"),
    wide:wAt(sc,"wide","By"),widely:wAt(sc,"wide","widely"),
    national:wAt(sc,"national","In"),std:wAt(sc,"national","national standard"),
    team:wAt(sc,"team","Crews"),checkin:wAt(sc,"team","check in"),one:wAt(sc,"team","one team"),
    uni:wAt(sc,"uni","At the university"),agent:wAt(sc,"uni","the planning agent"),
    alone:wAt(sc,"alone","on its own"),may:wAt(sc,"alone","what it may do"),who:wAt(sc,"alone","who answers"),stop:wAt(sc,"alone","who can stop"),
    crew:wAt(sc,"checks","like a crew"),place:wAt(sc,"checks","takes its place"),see:wAt(sc,"checks","anyone can see"),who2:wAt(sc,"checks","who answers")}));
  const end=c.breath;
  ag_shots(ctx,S,t,sc.dur,[
    // 1972: seven of the agencies build that way of working together, FIRESCOPE, in the gap the opening left (the leaders stay put)
    {at:0,place:"cjCamp",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{const gt=cj_gt(sc,tt);
      cj_together(cx,gt,{coop:1-ag_in(tt,T.seven-0.6,0.5),missing:1-ag_in(tt,T.fs-1.0,0.6)});
      for(let i=0;i<7;i++)cj_mark(cx,1092+i*96,316,30,i,{a:ag_in(tt,T.seven+0.12*i,0.4)});
      cj_cardAt(cx,1130,400,500,{kick:"1972",title:"FIRESCOPE",sub:"seven agencies, one way of working"},tt,T.fs-0.3,null,{kickCol:AG.blue,edge:AG.blue});
      cj_scr(cx,S,()=>cj_tag(cx,"Southern California · 1972",ag_in(tt,0.8,0.6)));}},
    // its Incident Command System: everyone who arrives checks in; each crew is written on a card, and the card takes its place on one
    // board, in one structure; each place has a role and one person it answers to; nobody leads more than about seven
    {later:true,at:T.door-0.6,place:"cjCamp",keys:[[0,760,560,1.12],[T.card+1.0,1300,540,1.1]],d:2.0,push:0.01,draw:(cx,tt)=>{const gt=cj_gt(sc,tt);
      const land=T.card+0.7+1.6,show=k=>{if(k==="top"||k[0]==="L")return 1;if(k==="C0_2")return ag_in(tt,land-0.05,0.1);
        const i=CJ_SLOTS.findIndex(s=>s.key===k);return ag_in(tt,T.board+0.3+i*0.06,0.3);};
      cj_board(cx,{show,lines:ag_in(tt,T.answers-0.2,0.8),lit:1,litA:ag_in(tt,T.answers+0.4,0.5),count:ag_in(tt,T.seven2-0.1,0.4),band:cj_bandOf});
      cj_checkin(cx,{});ag_person(cx,CJ_CLERK,440,700,0.8,{t:gt,cut:756,gaze:[3,1]});
      ag_person(cx,CJ_COUNTY,740,700,0.9,{t:gt+0.7,flip:true,gaze:[2,1]});
      // the crew's card, written at the table, then on its way to its place
      const wa=ag_in(tt,T.card-0.2,0.4),u=clamp((tt-(T.card+0.7))/1.6,0,1),to=cj_slot("C0_2");
      if(wa>0.01&&u<1)cj_flyCard(cx,[520,684],[to.x,to.y],u,to.words,{a:wa,band:cj_bandOf("C0_2")});
      cj_pillAt(cx,460,286,"everyone checks in",tt,T.every-0.1,T.card+0.4,{col:AG.blue});}},
    // and everyone uses the same plain words, with no codes: the three leaders again, every one saying the same
    {later:true,at:T.plain-0.7,place:"cjCamp",keys:[[0,960,540,1.0]],d:1.8,push:0.015,draw:(cx,tt)=>{const gt=cj_gt(sc,tt);
      CJ_LB.forEach((L,i)=>{const on=ag_in(tt,T.plain+i*0.5,0.2)>0.5&&ag_in(tt,T.plain+i*0.5+1.4,0.2)<0.5;cj_leader(cx,L,gt,{radio:true,lamp:on,talk:on?0.3:0});});
      CJ_LB.forEach((L,i)=>cj_wordCard(cx,L,"Division B",null,ag_in(tt,T.plain-0.1+i*0.25,0.4),Math.min(1,ag_spr(tt,T.plain-0.1+i*0.25,0.5))));
      cj_pillAt(cx,960,62,"the same plain words, with no codes",tt,T.codes-0.2,null,{col:AG.green,icon:"tick"});}},
    // the years after: by 1981 the major fire agencies of Southern California use it widely, and for more than fires; in 2004 it
    // becomes part of the national standard in the United States, for emergencies of every kind
    {at:T.wide-0.9,place:"cjMap",keys:[[0,960,540,1.0]],push:0.03,draw:(cx,tt)=>{
      CJ_SPREAD.forEach((m,i)=>cj_mark(cx,m[0],m[1],22,m[2],{a:ag_in(tt,T.wide+0.2+i*0.18,0.4)}));
      cj_cardAt(cx,1180,104,640,{kick:"1981",title:"Used widely in Southern California",sub:"and more and more for emergencies other than fires"},tt,T.wide-0.2,T.national-0.7,{kickCol:AG.blue});
      cj_cardAt(cx,1180,104,640,{kick:"2004",title:"Part of the national standard",sub:"in the United States, for emergencies of every kind"},tt,T.national,null,{kickCol:AG.blue,edge:AG.blue});
      cj_scr(cx,S,()=>{cj_tag(cx,"Southern California · 1981",ag_in(tt,T.wide-0.4,0.5)*(1-ag_in(tt,T.national-0.7,0.4)));cj_tag(cx,"United States · 2004",ag_in(tt,T.national,0.5));});}},
    // crews from anywhere arrive, check in, and work as one team: the board full, each crew's card in its agency's colour
    {at:T.team-0.9,place:"cjCamp",keys:[[0,1180,540,1.06]],push:0.02,draw:(cx,tt)=>{const gt=cj_gt(sc,tt);
      const to=cj_below(2,3),u=clamp((tt-(T.checkin+0.2))/1.6,0,1),landed=u>=1,b=cj_band(5);
      cj_board(cx,{lines:1,lit:null,band:cj_bandOf,extra:landed?[{x:to.x,y:to.y,w:CJ_CW,words:"Crew 14",band:b}]:[]});
      cj_checkin(cx,{});ag_person(cx,CJ_CLERK,440,700,0.8,{t:gt,cut:756,gaze:[3,1]});
      if(!landed)cj_flyCard(cx,[520,684],[to.x,to.y],u,"Crew 14",{a:ag_in(tt,T.checkin-0.4,0.4),band:b});
      cj_pillAt(cx,1380,880-60,"one team",tt,T.one-0.1,null,{col:AG.green,icon:"tick"});}},
    // the university, Monday 2 November 2026: a new kind of colleague joins Planning, the planning agent. If it simply started, nobody
    // could say what it may do, who answers for it, or who can stop it; so, like a crew at a fire, it checks in first
    {at:T.uni-0.9,place:"cjWall",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{const gt=cj_gt(sc,tt),A=CJ_AG;
      const out=1-ag_in(tt,end-1.0,0.6);
      cj_agent(cx,A.x,A.y,A.r,gt,{label:"planning agent",floor:A.floor,a:ag_in(tt,T.agent-0.5,0.7),think:0.2});
      // its check-in card, under it, like a crew's
      const ka=ag_in(tt,T.crew,0.4)*out;if(ka>0.01){cx.save();cx.globalAlpha*=ka;ag_about(cx,A.x,A.y+A.r+90,lerp(0.8,1,Math.min(1,ag_spr(tt,T.crew,0.5))));
        cj_tcard(cx,A.x-150,A.y+A.r+60,300,"planning agent",{h:64,band:AG.blue});cx.restore();}
      ag_roomLight(cx,1);
      cj_scr(cx,S,()=>cj_tag(cx,"The university · Monday 2 November 2026",ag_in(tt,T.uni,0.6)*out));
      // the three questions; two of them answered once it has its place
      const Q=[["What may it do?","What it may do",T.may,T.see],["Who answers for it?","Who answers for it",T.who,T.who2],["Who can stop it?",null,T.stop,null]];
      Q.forEach((q,i)=>{const y=320+i*120;cj_pillAt(cx,640,y,q[0],tt,q[2]-0.1,q[3]==null?end-1.0:q[3]-0.2,{col:AG.amber,icon:"warn"});
        if(q[1])cj_pillAt(cx,640,y,q[1],tt,q[3]+0.2,end-1.0,{col:AG.green,icon:"tick"});});
      cj_pillAt(cx,A.x,A.y+A.r+200,"its place on the map",tt,T.place-0.1,end-1.0,{col:AG.blue});}}]);
  ag_title(ctx,S,t,end,"A contributor joins",null,"FILM 3 OF 7 · FROM HELPER TO COLLEAGUE");
});

/* ---------------------------------------------------------------- 3 · Two newcomers */
scene("monday",(ctx,S,t,sc)=>{const T=cj_once(sc,"T",()=>({
    year:wAt(sc,"tickets","All year"),now:wAt(sc,"tickets","Now"),name:wAt(sc,"tickets","a name of its own"),
    same:wAt(sc,"same","Both"),
    badge:wAt(sc,"badge","Lucía"),ident:wAt(sc,"badge","The agent"),never:wAt(sc,"badge","never"),
    role:wAt(sc,"role","Lucía"),owner:wAt(sc,"owner","Lucía"),rights:wAt(sc,"rights","rights come"),never2:wAt(sc,"rights","never its own"),
    admin:wAt(sc,"admin","An agent"),wrong:wAt(sc,"admin","wrong hands"),
    signed:wAt(sc,"signed","Lucía"),touches:wAt(sc,"signed","the data"),
    differ:wAt(sc,"differ","One thing"),helper:wAt(sc,"differ","helper works"),alone:wAt(sc,"alone","works alone"),place:wAt(sc,"alone","a place of its own")}));
  const rows=[T.badge,T.role,T.owner,T.rights,T.signed,T.differ-0.6];
  ag_shots(ctx,S,t,sc.dur,[
    // Lucía comes in; the agent is where the last chapter left it. Planning's tickets, drafted all year on Jun's sign-in, become the
    // planning agent's, under its own name; then both are welcomed the same way, line by line
    {at:0,place:"cjWall",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{const gt=cj_gt(sc,tt);
      const la=ag_in(tt,0.1,0.9);if(la>0){cx.save();cx.globalAlpha*=la;ag_person(cx,CJ_LUCIA,200,640,0.9,{t:gt,smile:0.3,gaze:[3,0]});cx.restore();}
      const m=ag_sine(clamp((tt-(T.same-1.6))/1.6,0,1)),ax=lerp(CJ_AG.x,1750,m),ay=lerp(CJ_AG.y,520,m),ar=lerp(CJ_AG.r,84,m);
      const bk=clamp((tt-T.ident)/1.0,0,1),la2=1-ag_in(tt,T.ident+0.4,0.5);
      cj_agent(cx,ax,ay,ar,gt,{label:la2>0.5?"planning agent":null,floor:lerp(CJ_AG.floor,690,m),think:0.2});
      if(bk>0){const fall=1-clamp(ag_spr(bk,0,0.5),0,1.2);ag_badge(cx,ax+34,ay+ar-4-fall*160,"planning agent",{t:gt,drop:56,a:clamp(bk*3,0,1)});}
      ag_roomLight(cx,1);
      cj_pillAt(cx,200,300,"Lucía Ortega",tt,0.6,T.same-0.6,{});
      // Planning's tickets: on Jun's sign-in all year, then the planning agent's
      const ta=ag_in(tt,T.year-0.2,0.5)*(1-ag_in(tt,T.same-1.6,0.5)),mv=ag_sine(clamp((tt-T.now)/1.4,0,1));
      cj_tickets(cx,lerp(560,1000,mv),330,{a:ta,edge:mv>0.5?AG.violet:null});
      cj_pillAt(cx,730,520,"drafted by Jun's helper, on his sign-in",tt,T.year+0.4,T.now-0.2,{});
      cj_pillAt(cx,1170,520,"the planning agent's, under its own name",tt,T.name-0.2,T.same-1.6,{col:AG.violet});
      // the welcome, line by line
      cj_welcome(cx,380,170,{head:ag_in(tt,T.same-0.2,0.5),rows:k=>ag_in(tt,rows[k]-0.1,0.5),lit:k=>tt>=rows[k]&&tt<rows[k+1]-0.2?AG.blue:null});
      cj_pillAt(cx,1750,800,"never a person's",tt,T.never-0.1,T.role-0.4,{col:AG.blue});
      cj_pillAt(cx,980,836,"never its own rights, and never an admin's",tt,T.never2-0.1,T.admin-0.3,{col:AG.blue,icon:"lock"});
      cj_pillAt(cx,980,836,"in the wrong hands: anything an admin can, only faster",tt,T.wrong-0.2,T.signed-0.4,{col:AG.amber,icon:"warn"});
      cj_pillAt(cx,980,836,"Clara answers for the data it touches",tt,T.touches-0.1,T.differ-0.8,{col:AG.blue});}},
    // one thing differs: Lucía's helper works on her sign-in, with her rights, while she watches; the planning agent works alone, so it
    // needs a place of its own (a later moment: the welcome leaves first)
    {later:true,at:T.differ-0.6,place:"cjWall",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{const gt=cj_gt(sc,tt);
      ag_desk(cx,110,870,760,{});
      ag_screen(cx,560,610,250,150,{stand:870-70-610-150+6});
      ag_person(cx,CJ_LUCIA,360,560,0.84,{t:gt,cut:800,gaze:[4,1],smile:0.3});
      cj_agent(cx,980,690,54,gt,{label:"Lucía's helper",floor:820,ph:1.3,think:0.3});
      cj_agent(cx,1560,470,90,gt,{label:"planning agent",floor:730,think:0.2});
      ag_roomLight(cx,1);
      cj_cardAt(cx,110,120,700,{kick:"Lucía's helper",title:"Works on her sign-in",sub:"with her rights, while she watches"},tt,T.helper-0.2,null,{kickCol:AG.violet});
      cj_cardAt(cx,1130,120,700,{kick:"The planning agent",title:"Works alone",sub:"so it needs a place of its own"},tt,T.alone-0.2,null,{kickCol:AG.violet,edge:AG.blue});}}]);
});

/* ---------------------------------------------------------------- 4 · A place on the map */
// the map's elements in the order they come in, so the map builds from its teams
const CJ_ORDER=["clara","lucia","marts","jun","noor","count","mei","sis","yusuf","govrole","govagent"];
scene("map",(ctx,S,t,sc)=>{const T=cj_once(sc,"T",()=>({
    map:wAt(sc,"noor","university's map"),
    drawn:wAt(sc,"drawn","It's drawn"),assigned:wAt(sc,"drawn","assigned"),owner:wAt(sc,"drawn","with an owner"),
    may:wAt(sc,"may","Its role"),m:[wAt(sc,"may","read the project"),wAt(sc,"may","draft on"),wAt(sc,"build","build in"),wAt(sc,"build","open a pull")],
    n:[wAt(sc,"maynot","approve"),wAt(sc,"maynot","merge"),wAt(sc,"maynot","change production"),wAt(sc,"maynot","change an approved"),wAt(sc,"maynot","change what"),wAt(sc,"maynot","grant")],
    a:[wAt(sc,"asks","Clara"),wAt(sc,"asks","Mei"),wAt(sc,"asks","Noor"),wAt(sc,"asks","Jun")],
    guess:wAt(sc,"guess","When"),decides:wAt(sc,"guess","a person decides"),
    census:wAt(sc,"census","The same day"),jun:wAt(sc,"census","census agent"),
    three:wAt(sc,"three","three agents"),role:wAt(sc,"three","a role"),owner2:wAt(sc,"three","an owner"),third:wAt(sc,"third","The third"),never:wAt(sc,"third","never approves")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Noor puts it on the university's map, where every person, team and system already has a place; it's drawn as the map draws
    // software that works beside people: assigned to a role, with an owner; its role's rights beside it; the census agent; three agents
    {later:true,at:0,place:"cjWall",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{const gt=cj_gt(sc,tt);
      ag_person(cx,"noor",150,700,0.95,{t:gt,smile:0.2,gaze:[4,-1]});
      ag_roomLight(cx,1);
      const dim=ag_in(tt,T.may-0.6,0.6)*(1-ag_in(tt,T.census-0.6,0.6))+0.55*ag_in(tt,T.three-0.2,0.6);
      const glowA=k=>ag_io(tt,T.three+k*0.35,T.never+2.2,0.4);
      cj_map(cx,{show:k=>ag_in(tt,T.map-0.4+CJ_ORDER.indexOf(k)*0.13,0.4),spring:true,dim,keep:dim>0.3&&tt>T.three-1?["clara","jun","yusuf","govagent","govrole"]:["clara"],
        glow:k=>k==="govagent"&&glowA(2)>0?AG.violet:null});
      const pa=ag_in(tt,T.drawn-0.2,0.5);
      cj_newOnMap(cx,{pagent:pa,prole:ag_in(tt,T.assigned-0.5,0.5),passign:clamp((tt-T.assigned)/0.9,0,1),powner:clamp((tt-T.owner)/0.9,0,1),
        cagent:ag_in(tt,T.jun-0.2,0.5),crole:ag_in(tt,T.jun+0.6,0.5),cassign:clamp((tt-T.jun-1.2)/0.9,0,1),cowner:clamp((tt-T.jun-2.0)/0.9,0,1),
        glow:k=>(k==="pagent"&&glowA(0)>0)||(k==="cagent"&&glowA(1)>0)?AG.violet:(k==="prole"||k==="crole")&&ag_io(tt,T.role,T.never+2.2,0.4)>0?AG.blue:null});
      // the role's rights: may, may not, whom it asks; when it isn't sure, it asks, and a person decides
      cj_rights(cx,1090,90,790,{a:ag_in(tt,T.may-0.4,0.5)*(1-ag_in(tt,T.census-0.7,0.5)),k:Math.min(1,ag_spr(tt,T.may-0.4,0.5)),
        may:i=>ag_in(tt,T.m[i]-0.15,0.35),maynot:i=>ag_in(tt,T.n[i]-0.15,0.35),asks:i=>ag_in(tt,T.a[i]-0.15,0.35),glow:ag_io(tt,T.guess-0.2,T.census-0.8,0.4),rule:ag_in(tt,T.decides-0.3,0.4)});
      // the governance review agent was already there: it reviews pull requests, and never approves them
      cj_pillAt(cx,1420,598,"reviews, never approves",tt,T.never-0.3,null,{col:AG.blue,icon:"lock"});}}]);
});

/* ---------------------------------------------------------------- 5 · The gate */
const CJ_STAGES=[["1","Suggests"],["2","Acts for you, step by step"],["3","Acts for you, within limits"],["4","A contributor that proposes"],["5","A contributor with a mandate"]];
// the five stages, from 1 at the bottom to 5 at the top: o.show(k), o.lit(k) a colour; returns each row's box
function cj_ladder(ctx,x,y,w,o){o=o||{};const out=[];CJ_STAGES.forEach((s,k)=>{const yy=y-k*118,b={x,y:yy,w,h:96};out.push(b);const a=o.show?o.show(k):1;if(a<=0.01)return;
    const lit=o.lit?o.lit(k):null;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,yy,w,96,18,{edge:lit,edgeA:0.85});
    ctx.fillStyle=rgba(lit||AG.mut,lit?0.95:0.55);ctx.beginPath();ctx.arc(x+52,yy+48,26,0,TAU);ctx.fill();
    ag_T(ctx,s[0],x+52,yy+60,{w:800,size:32,align:"center",col:[250,250,248]});ag_T(ctx,s[1],x+100,yy+59,{w:700,size:32});ctx.restore();});return out;}
scene("gate",(ctx,S,t,sc)=>{const T=cj_once(sc,"T",()=>({
    gate:wAt(sc,"before","its gate"),
    week:wAt(sc,"redo","The week before"),sandbox:wAt(sc,"redo","in a sandbox"),redid:wAt(sc,"redo","it redid"),
    bar:wAt(sc,"bar","Clara and Jun"),b36:wAt(sc,"bar","at least"),none:wAt(sc,"bar","none wrong"),
    r37:wAt(sc,"result","Thirty-seven"),r3:wAt(sc,"result","On three"),r0:wAt(sc,"result","None was"),
    matters:wAt(sc,"matters","That last"),
    audit:wAt(sc,"audit","Audit"),name:wAt(sc,"audit","under its own name"),
    stage:wAt(sc,"stage","So for"),four:wAt(sc,"stage","stage four"),word:wAt(sc,"word","For what"),one:wAt(sc,"word","stage one"),
    never:wAt(sc,"never","It never"),prod:wAt(sc,"never","every change")}));
  const AGX=420,AGY=636;
  ag_shots(ctx,S,t,sc.dur,[
    // before it worked alone, its gate: the week before, in a sandbox, it redid Planning's last 40 tickets against the bar Clara and
    // Jun set first; 37 matched, on 3 it asked, none was confidently wrong; and audit is on from its first run
    {later:true,at:0,place:"cjWall",keys:[[0,960,540,1.0]],push:0.01,draw:(cx,tt)=>{const gt=cj_gt(sc,tt);
      const sb=ag_sandbox(cx,AGX,790,560,{label:"Sandbox · nothing reaches anyone",a:ag_in(tt,T.sandbox-0.3,0.5)});
      cj_agent(cx,AGX,AGY,80,gt,{label:"planning agent",floor:760,think:0.25+0.5*ag_io(tt,T.redid,T.bar,0.6)});
      ag_roomLight(cx,1);
      cj_cardAt(cx,110,110,620,{kick:"Before it worked alone",title:"Its gate"},tt,T.gate-0.4,null,{kickCol:AG.blue,edge:AG.blue});
      cj_scr(cx,S,()=>cj_tag(cx,"The week before",ag_in(tt,T.week-0.1,0.5),{x:1300}));
      // Planning's last 40 tickets, done again one after another; marked once a person's result is set against them
      const per=(T.bar-T.redid-0.4)/40;
      cj_grid(cx,860,150,{a:ag_in(tt,T.redid-0.4,0.5),done:i=>clamp((tt-T.redid-i*per)/0.5,0,1),mark:i=>{const asked=CJ_ASKED.indexOf(i)>=0;return ag_in(tt,(asked?T.r3:T.r37)+0.2+(asked?CJ_ASKED.indexOf(i)*0.25:i*0.02),0.3);}});
      // the bar, then what it did against it
      const ba=1-ag_in(tt,T.audit-0.8,0.5);
      cj_cardAt(cx,860,612,560,{kick:"The bar, set first",title:"At least 36 of 40 done as a person did them",sub:"and none wrong without saying so"},tt,T.bar-0.2,null,{kickCol:AG.blue,edge:AG.blue,a:ba});
      const R=[["37 matched",T.r37,AG.green,"tick"],["3: not sure, so it asked",T.r3,AG.blue,null],["0 confidently wrong",T.r0,AG.green,"tick"]];
      R.forEach((r,i)=>{const y=650+i*80,gl=i===2?ag_io(tt,T.matters,T.audit-0.8,0.5):0;
        if(gl>0){cx.save();cx.globalAlpha*=gl*ba;const g=cx.createRadialGradient(1660,y,10,1660,y,230);g.addColorStop(0,rgba(AG.green,0.22));g.addColorStop(1,rgba(AG.green,0));cx.fillStyle=g;cx.fillRect(1430,y-120,460,240);cx.restore();}
        cj_pillAt(cx,1660,y,r[0],tt,r[1]-0.1,null,{col:r[2],icon:r[3],a:ba});});
      // the audit log, under its own name
      cj_audit(cx,860,612,800,{a:ag_in(tt,T.audit-0.2,0.5),rows:i=>ag_in(tt,T.name-0.6+i*0.35,0.3)});}},
    // so for Planning's tickets it starts at stage 4: it proposes, and people review; for what a word means, stage 1: it only suggests.
    // It never approves its own change; every change to production is approved by a person other than its author
    {later:true,at:T.stage-0.6,place:"cjWall",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      ag_roomLight(cx,1);
      const L=cj_ladder(cx,120,688,660,{show:k=>ag_in(tt,T.stage-0.2+k*0.15,0.4),lit:k=>(k===3&&ag_in(tt,T.four-0.2,0.3)>0)||(k===0&&ag_in(tt,T.one-0.2,0.3)>0)?AG.blue:null});
      const link=(b,y,a)=>{if(a<=0.01)return;cx.save();cx.globalAlpha*=a;cx.strokeStyle=rgba(AG.blue,0.8);cx.lineWidth=3.5;cx.beginPath();cx.moveTo(b.x+b.w,b.y+48);cx.lineTo(880,y);cx.stroke();cx.restore();};
      const a4=ag_in(tt,T.four,0.4),a1=ag_in(tt,T.one,0.4);link(L[3],L[3].y+48,a4);link(L[0],L[0].y+48,a1);
      cj_cardAt(cx,880,L[3].y-30,620,{kick:"Planning's tickets",title:"Stage 4",sub:"it proposes, and people review"},tt,T.four,null,{kickCol:AG.blue,edge:AG.blue});
      cj_cardAt(cx,880,L[0].y-30,620,{kick:"What a word means",title:"Stage 1",sub:"it only suggests"},tt,T.one,null,{kickCol:AG.blue,edge:AG.blue});
      cj_pillAt(cx,1440,96,"it never approves its own change",tt,T.never-0.1,null,{col:AG.blue,icon:"lock"});
      cj_pillAt(cx,1440,176,"production: approved by a person other than its author",tt,T.prod-0.1,null,{col:AG.green,icon:"tick",size:28});}}]);
});

/* ---------------------------------------------------------------- 6 · Who owns it, and who can stop it */
scene("stop",(ctx,S,t,sc)=>{const T=cj_once(sc,"T",()=>({
    written:wAt(sc,"written","Who may"),own:wAt(sc,"own","Only a person"),set:wAt(sc,"set","Only Sam's"),stop:wAt(sc,"stop","Clara may"),
    sam:wAt(sc,"stop","So may Sam"),anyone:wAt(sc,"anyone","anyone who sees"),cord:wAt(sc,"anyone","pull the cord")}));
  ag_shots(ctx,S,t,sc.dur,[
    // who may do what with an agent, written down: who may own it, set it up, stop it, and ask for it to stop
    {later:true,at:0,place:"cjWall",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      ag_roomLight(cx,1);
      ag_label(cx,960,150,"Who may do what with an agent",{align:"center",a:ag_in(tt,T.written-0.2,0.5)});
      cj_cardAt(cx,150,200,790,{kick:"Own it",title:"Only a person, never a team",sub:"Clara answers for everything the planning agent does, and only she may sign for it"},tt,T.own-0.2,null,{kickCol:AG.blue,edge:AG.blue});
      cj_cardAt(cx,980,200,790,{kick:"Set it up",title:"Only Sam's platform team",sub:"for its owner, and once it has a place on the map"},tt,T.set-0.2,null,{kickCol:AG.blue,edge:AG.blue});
      cj_cardAt(cx,150,520,790,{kick:"Stop it",title:"Clara, or Sam",sub:"Sam at any hour, without asking first"},tt,T.stop-0.2,null,{kickCol:AG.blue,edge:AG.blue});
      cj_cardAt(cx,980,520,790,{kick:"Ask them to stop it",title:"Anyone who sees it go wrong",sub:"as anyone on a production line may pull the cord"},tt,T.anyone-0.2,null,{kickCol:AG.blue,edge:AG.blue});}}]);
});

/* ---------------------------------------------------------------- 7 · One structure to join */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,T=cj_once(sc,"T",()=>({
    join:wAt(sc,"back","one structure"),since:wAt(sc,"since","Since then"),take:wAt(sc,"since","take their place"),
    now:wAt(sc,"now","The planning agent"),place:wAt(sc,"now","a place on the map"),role:wAt(sc,"now","a role"),owner:wAt(sc,"now","an owner"),rights:wAt(sc,"now","rights from"),ask:wAt(sc,"now","people to ask"),
    so:wAt(sc,"so","So everyone"),may:wAt(sc,"so","what it may do"),who:wAt(sc,"so","who answers"),stop:wAt(sc,"so","who can stop")}));
  const end=c.breath;
  ag_shots(ctx,S,t,sc.dur,[
    // 1970: help couldn't become one team until there was one structure to join; since then, crews check in and take their place
    {at:0,place:"cjCamp",keys:[[0,1180,540,1.06]],push:0.02,draw:(cx,tt)=>{const gt=cj_gt(sc,tt);
      const to=cj_below(0,4),u=clamp((tt-(T.take-0.6))/1.6,0,1),landed=u>=1,b=cj_band(3);
      cj_board(cx,{lines:1,band:cj_bandOf,extra:[{x:cj_below(2,3).x,y:cj_below(2,3).y,w:CJ_CW,words:"Crew 14",band:cj_band(5)}].concat(landed?[{x:to.x,y:to.y,w:CJ_CW,words:"Engine 52",band:b}]:[])});
      cj_checkin(cx,{});ag_person(cx,CJ_CLERK,440,700,0.8,{t:gt,cut:756,gaze:[3,1]});
      if(!landed)cj_flyCard(cx,[520,684],[to.x,to.y],u,"Engine 52",{a:ag_in(tt,T.since-0.2,0.4),band:b});
      cj_pillAt(cx,1380,198,"one structure to join",tt,T.join-0.2,null,{col:AG.blue});}},
    // the planning agent has done the same: a place on the map, a role, an owner, rights from its role, and people to ask; so everyone
    // knows what it may do, who answers for it, and who can stop it
    {at:T.now-0.9,place:"cjWall",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      ag_roomLight(cx,1);
      cj_map(cx,{dim:0.85,keep:["clara"]});cj_newOnMap(cx,{pagent:1,prole:1,passign:1,powner:1,cagent:1,crole:1,cassign:1,cowner:1,a:1,
        glow:k=>(k==="pagent"&&ag_in(tt,T.place-0.2,0.4)>0)?AG.violet:(k==="prole"&&ag_in(tt,T.role-0.2,0.4)>0)?AG.blue:null});
      const L=[["a place on the map",T.place],["a role: planning contributor",T.role],["an owner: Clara Jensen",T.owner],["rights from its role",T.rights],["people to ask",T.ask]];
      cj_list(cx,1090,90,790,"The planning agent",L.map(l=>[l[0],ag_in(tt,l[1]-0.15,0.35)]),{a:ag_in(tt,T.now-0.3,0.5)});
      const Q=[["what it may do: its role says",T.may],["who answers for it: Clara",T.who],["who can stop it: Clara, or Sam",T.stop]];
      cj_list(cx,1090,520,790,"So everyone knows",Q.map(q=>[q[0],ag_in(tt,q[1]-0.15,0.35)]),{a:ag_in(tt,T.so-0.3,0.5),col:AG.green});}}]);
  // the end card: the film's lesson, and the next film
  ag_end(ctx,S,t,end,"A contributor joins",null,"Film 3 of 7","From helper to colleague");
  const a1=ag_in(t,end+0.6,0.9);if(a1>0){setScreen(ctx,S);ag_T(ctx,"Before an agent works alone,",960,296,{w:700,size:48,align:"center",a:a1});
    ag_T(ctx,"it's architected like a colleague.",960,364,{w:700,size:48,align:"center",a:a1});}
  const na=ag_in(t,end+1.2,0.6);if(na>0){setScreen(ctx,S);ag_T(ctx,"Next: Helpers on your behalf",960,790,{w:600,size:30,align:"center",col:AG.mut,a:na});}
});
// a short list on a card: its kicker, then rows [text, how far in (0 to 1)], each with a tick; o.col the ticks' colour
function cj_list(ctx,x,y,w,kick,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return null;const h=86+rows.length*54+18;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,w,h,22,{edge:o.col||AG.blue,edgeA:0.55});ag_T(ctx,String(kick).toUpperCase(),x+32,y+56,{w:700,size:28,ls:4,col:o.col||AG.blue});
  rows.forEach((r,i)=>{const u=clamp(r[1],0,1);if(u<=0.01)return;const yy=y+112+i*54;ctx.save();ctx.globalAlpha*=u;ag_tick(ctx,x+50,yy-10,24,rgba(o.col||AG.green,1),4);
    ag_T(ctx,r[0],x+84,yy,{w:600,size:30});ctx.restore();});ctx.restore();return{x,y,w,h};}

// chapters that open where the one before ends: on the lot, the leaders stay put as it glides on; in the lab, the agent stays where
// it is, and a later moment lets what the last chapter shows leave first (the map, the gate and the rules each start as one)
ag_cutInto(["scope","monday","map","gate","stop"]);
