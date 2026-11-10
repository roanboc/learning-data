/* ===== An agreement first: the scenes =====
   Six chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (af_wartime.js, af_hall.js, and the kit's hall); what moves is drawn live in the shots of ag_shots. In one room the camera glides
   and only what changes fades; between rooms the film cuts (cut: true), and dissolves only where the whole picture changes (to the
   past and back). Every chapter opens on a cut (ag_cutInto, at the end). People stand behind their desks with their arms down; the
   recruit's hand is only on the pen, the officer's and the commander's only on the sheet. Cards are never over a person. */

DP_PEOPLE.push([AF_P.recruit,"lamp"],[AF_P.officer,"lamp"],[AF_P.commander,"lamp"],"anil","mei","yusuf","sam");

const af_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a card that springs in at t0 and goes at t1 (or stays): its k (scale) and a (opacity)
const af_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
// a phase from 0 to 1 over d seconds from t0, eased
const af_ph=(t,t0,d)=>ag_sine(clamp((t-t0)/(d||1),0,1));
const AF_TITLE="An agreement first",AF_SUB="Two papers before any data";

/* ---------------------------------------------------------------- 1 · Signed first: Bletchley Park, then the university */
// the officer at the commander's desk: his pose and what his hand holds at tt, from the moments of the line (P)
function af_officerAt(tt,P){const O=AF_OFFICE,[ox,oy,os]=O.officer,reach=af_reachTo([ox,oy,os,false],O.sheet[0]-50,O.sheet[1]-2,"hold");
  const d0=P.commanders-0.3,d1=d0+1.0,w1=d1+0.5,b0=P.takes-0.4,b1=b0+0.5,l1=b1+0.9,x0=Math.max(l1,P.destroys+0.1),x1=x0+1.0,h1=x1+0.5;
  if(tt<d0)return{pose:"hold",holdBack:(c,h)=>af_heldSheet(c,h,0),flat:0};
  if(tt<d1){const e=af_ph(tt,d0,1.0);return{pose:"hold",pose2:reach,mix:e,holdBack:(c,h)=>af_heldSheet(c,h,(tt-d0)/1.0),flat:0};}
  if(tt<w1)return{pose:reach,pose2:"hang",mix:af_ph(tt,d1,0.5),flat:1};
  if(tt<b0)return{flat:1};
  if(tt<b1)return{pose:"hang",pose2:reach,mix:af_ph(tt,b0,0.5),flat:1};
  if(tt<l1)return{pose:reach,pose2:"hold",mix:af_ph(tt,b1,0.9),holdBack:(c,h)=>af_heldSheet(c,h,1-(tt-b1)/0.9),flat:0};
  if(tt<x1)return{pose:"hold",holdBack:(c,h)=>af_burnSheet(c,h,(tt-x0)/1.0),flat:0};
  if(tt<h1)return{pose:"hold",pose2:"hang",mix:af_ph(tt,x1,0.5),flat:0};
  return{flat:0};}
// the commander reads, his hand on the sheet while the officer waits
function af_commanderAt(tt,P){const O=AF_OFFICE,[cx,cy,cs]=O.commander,reach=af_reachTo([cx,cy,cs,true],O.sheet[0]+44,O.sheet[1]+2,"rest"),r0=P.commanders+1.2,r1=P.then-0.6;
  if(tt<r0||tt>r1+0.5)return{};return tt<r1?{pose:"hang",pose2:reach,mix:af_ph(tt,r0,0.5)}:{pose:reach,pose2:"hang",mix:af_ph(tt,r1,0.5)};}
function af_desk(x,tt,P,o){o=o||{};const O=AF_OFFICE,[ox,oy,os]=O.officer,[cx,cy,cs]=O.commander,of=o.officer||af_officerAt(tt,P),cm=o.commander||af_commanderAt(tt,P);
  if(of.flat)af_sheetFlat(x);
  dp_person(x,AF_P.commander,cx,cy,cs,Object.assign({t:tt,light:"lamp",flip:true,cut:O.back,gaze:[3,6],nod:0.05},cm));
  dp_person(x,AF_P.officer,ox,oy,os,Object.assign({t:tt+1.3,light:"lamp",gaze:[3,3]},of));}
// the park, its huts up (rows a), their windows lit by lit(r, k, i), and the people crossing it
function af_park(x,tt,o){o=o||{};af_huts(x,{rows:o.rows||[1,1,1],rise:o.rise,lit:o.lit});af_walkers(x,tt,{a:o.walk==null?1:o.walk,lit:o.walkLit});}
// a sheet of a coded message under frost: rows of letters in groups of five, drawn as marks, so that only their rhythm shows
function af_groups(c){c.fillStyle="rgba(240,240,250,0.95)";for(let r=0;r<3;r++)for(let g=0;g<4;g++)for(let k=0;k<5;k++){const h=10+((r*31+g*7+k*13)%5)*1.6;
  c.fillRect(1166+g*78+k*13,560+r*34-h,9,h);}}
// a few windows dark, as on any night: a fixed pattern
const af_someLit=(r,k,i)=>((r*7+k*3+i)%5===0?0.15:1);

scene("first",(ctx,S,t,sc)=>{const c=sc.cues,P=af_once(sc,"P",()=>({
    work:wAt(sc,"park","work"),by:wAt(sc,"people","By"),nine:wAt(sc,"people","almost"),secret:wAt(sc,"secret","best-kept"),
    ships:c.ships-0.4,codes:c.codes,change:wAt(sc,"codes","change"),word:c.word-0.4,careless:wAt(sc,"word","careless"),
    run:c.run-0.4,sign:wAt(sc,"signed","sign"),open:sc.ends.signed-0.3,part:c.part-0.4,own:wAt(sc,"part","own"),
    named:c.named-0.4,commanders:wAt(sc,"named","commanders"),waits:wAt(sc,"named","waits"),then:wAt(sc,"named","then"),takes:wAt(sc,"named","takes"),
    destroys:wAt(sc,"named","destroys"),read3:sc.ends.named+0.1,away:wAt(sc,"away","nothing"),
    holds:c.holds-0.4,warning:wAt(sc,"never","warning"),thirty:c.thirty-0.4,thousands:wAt(sc,"thirty","thousands"),years:wAt(sc,"thirty","thirty"),
    too:c.too-0.4,ask:wAt(sc,"too","ask"),no:wAt(sc,"no","no"),yes:wAt(sc,"no","yes"),expose:wAt(sc,"no","expose"),
    papers:wAt(sc,"papers","two"),access:wAt(sc,"papers","access"),title:c.breath}));
  const R=af_routes();
  const i=ag_shots(ctx,S,t,sc.dur,[
    // Bletchley Park at night: the house, then the lawn; the huts come up row after row, and people cross between them; then the camera
    // goes to one hut, where the secret is: a sheet of letters under frost, in groups of five, that no one outside may read
    {at:0,place:"afPark",keys:[[0,960,420,1.16],[P.work,960,560,1.0],[P.secret-0.2,1330,690,1.9]],d:3.2,push:0,draw:(x,tt)=>{
      af_park(x,tt,{rows:[0,1,2].map(r=>ag_in(tt,P.by+r*0.5,0.5)),rise:[0,1,2].map(r=>(1-ag_eo(clamp((tt-P.by-r*0.5)/1.2,0,1)))*60),lit:af_someLit,walk:ag_in(tt,P.by+1.6,1.4)});
      const n=af_pop(tt,P.nine-0.2,P.secret-0.6);dp_card(x,540,120,840,{kick:"By 1945",title:"Almost 9,000 people · 3 in 4 women"},{col:AF_ICE,k:n.k,a:n.a,behind:"afPark"});
      const s=ag_in(tt,P.secret+0.9,0.6);if(s>0){x.save();x.globalAlpha*=s;dp_frost(x,1150,520,330,120,af_groups,{behind:"afPark"});dp_lock(x,1478,536,40,"violet",0);x.restore();}}},
    // the sea: a convoy steered round the submarines by what was read; then, with new codes, the route goes dark and the convoy holds its
    // course towards them. Nothing sinks
    {cut:true,at:P.ships,place:"afSea",keys:[[P.ships,960,520,1.0],[P.ships+0.1,980,540,1.06]],d:12,push:0.01,draw:(x,tt)=>{
      const dark=af_ph(tt,P.change,1.8),v=0.03+0.018*(tt-P.ships);
      af_route(x,R.steer,af_ph(tt,P.ships+0.4,2.6),"green",1-ag_in(tt,P.codes+0.3,1.2));af_subs(x,1,tt);af_convoyAt(x,af_between(R.steer,R.straight,v,dark),1);
      dp_pill(x,960,170,"New codes · the messages go dark","coral",{align:"center",a:ag_in(tt,P.codes+0.2,0.5)});}},
    // one careless word: one small figure among many lit coral for a moment, then not
    {cut:true,at:P.word,place:"afPark",keys:[[P.word,960,600,1.05],[P.word+0.1,960,610,1.1]],d:9,push:0.01,draw:(x,tt)=>{
      af_park(x,tt+40,{lit:af_someLit,walkLit:k=>k===4?ag_io(tt,P.careless,P.careless+1.8,0.4):0});}},
    // a promise first: in a hut, the recruit signs the Official Secrets Act before she's told anything; only then does the door open
    {cut:true,at:P.run,place:"afHut",keys:[[P.run,960,540,1.0],[P.run+0.1,990,560,1.07]],d:12,push:0.01,draw:(x,tt)=>{const [rx,ry,rs]=AF_DESK.recruit,u=clamp((tt-P.sign-0.2)/2.4,0,1);
      af_hutDoor(x,af_ph(tt,P.open,1.6));af_form(x,u);
      dp_person(x,AF_P.recruit,rx,ry,rs,{t:tt,light:"lamp",pose:af_signPose(u),cut:AF_DESK.back,gaze:[3,5],hold:af_penHeld});
      const g=af_pop(tt,P.run+0.9,null);dp_tag(x,840,600,"Official Secrets Act · Declaration",AF_ICE,{to:[720,790],p:ag_in(tt,P.run+1.2,0.6),a:g.a,behind:"afHut"});}},
    // each told only their own part: the huts as separate panes, each with its own lamp, a thin coral line between them
    {cut:true,at:P.part,place:"afPark",keys:[[P.part,960,760,1.45],[P.part+0.2,960,560,1.0]],d:2.6,push:0,draw:(x,tt)=>{
      af_park(x,tt+80,{lit:()=>1,walk:0.6});const p=af_ph(tt,P.own-0.2,1.2);af_hutGaps().forEach(([gx,y0,y1],k)=>dp_link(x,[gx,y1],[gx,y0],"coral",clamp(p*1.4-k*0.04,0,1),{lw:2,dot:false,alpha:0.9}));}},
    // a few named commanders: the officer sets the sheet down, waits while it's read, takes it back and destroys it
    {cut:true,at:P.named,place:"afDesk",keys:[[P.named,960,540,1.0],[P.named+0.1,940,560,1.04]],d:12,push:0.01,draw:(x,tt)=>{af_desk(x,tt,P);
      const r=af_pop(tt,P.read3,null);dp_card(x,60,110,580,{title:"Read · taken back · destroyed"},{col:AF_ICE,k:r.k,a:r.a,behind:"afDesk"});
      const w=af_pop(tt,P.away+0.1,null);dp_card(x,60,300,580,{title:"Nothing done with it may give the secret away"},{col:AF_ICE,k:w.k,a:w.a,behind:"afDesk"});}},
    // it holds: the route comes back, and the convoy follows it round
    {cut:true,at:P.holds,place:"afSea",keys:[[P.holds,960,520,1.0],[P.holds+0.1,950,530,1.05]],d:8,push:0.01,draw:(x,tt)=>{
      af_route(x,R.steer,af_ph(tt,P.holds+0.3,1.6),"green",1);af_subs(x,1,tt);af_convoy(x,R.steer,0.2+0.03*(tt-P.holds),1,tt);}},
    // almost thirty years: the park again, and as all those thousands keep it, every window lit
    {cut:true,at:P.thirty,place:"afPark",keys:[[P.thirty,960,560,1.0],[P.thirty+0.1,960,580,1.05]],d:7,push:0.01,draw:(x,tt)=>{
      af_park(x,tt+120,{lit:(r,k,i)=>Math.max(af_someLit(r,k,i),ag_in(tt,P.thousands+((r*5+k*3+i)%7)*0.12,0.4))});
      const y=af_pop(tt,P.years-0.2,null);dp_card(x,540,120,840,{kick:"Until 1974",title:"Kept secret for almost 30 years"},{col:AF_ICE,k:y.k,a:y.a,behind:"afPark"});}},
    // a university holds secrets too: the hall and the platform; the study's request; a no dims it, a yes with nothing written lets
    // a violet haze spread from it; two papers come first, and the door to the data stays closed
    {cut:true,at:P.too,place:"afHall",keys:[[P.too,960,540,1.0],[P.too+0.1,960,540,1.03]],d:16,push:0.01,draw:(x,tt)=>{
      // all of it leaves as the title card comes in, so nothing shows through it
      const out=1-ag_in(tt,P.title-0.3,0.7);if(!(out>0.003))return;x.save();x.globalAlpha*=out;
      af_platform(x,{a:ag_in(tt,P.too+0.4,0.6)});
      const q=af_pop(tt,P.ask-0.1,null),dim=ag_io(tt,P.no,P.yes-0.2,0.4),lit=ag_io(tt,P.yes,P.expose+1.4,0.5);
      if(lit>0)dp_halo(x,510,250,620,"violet",0.32*lit*ag_in(tt,P.expose-0.4,0.8)+0.1*lit);
      af_request(x,110,170,800,{col:dim>0.01?mix(AF_ICE,DP.F.grey,dim):AF_ICE,a:q.a*(1-0.45*dim),k:q.k,behind:"afHall"});
      af_twoPapers(x,110,520,{ka:Math.max(0,tt-P.papers+0.1),kb:Math.max(0,tt-P.papers-0.3),behind:"afHall"});
      af_door(x,{a:ag_in(tt,P.access-0.2,0.7)});x.restore();}}]);
  // the place and the year, top left, in the park and the hut
  const kA=[0,2,3,4,7].includes(i)?(i===0?ag_in(t,c.place-0.2,0.8):1):0;if(kA>0)dp_kicker(ctx,"Bletchley Park · 1939",null,{a:kA});
  dp_title(ctx,S,t,P.title,AF_TITLE,AF_SUB,"FILM 1 OF 8 · ONLY WHAT YOU MAY SEE");});

/* ---------------------------------------------------------------- 2 · A study asks */
const AF_MEI=[1500,600,1],AF_ANIL=[400,600,1],AF_YUSUF=[420,600,1],AF_SAM=[420,600,1];
function af_mei(x,tt,o){const [mx,my,ms]=AF_MEI;dp_person(x,"mei",mx,my,ms,Object.assign({t:tt,cut:AF_BACK,flip:true,gaze:[3,1]},o||{}));}
// three things a purpose and a date leave unsaid: a coral question and an empty line for each
function af_unsaid(x,tt,P){[["Never?",P.never],["Where?",P.where],["What may leave?",P.leave]].forEach(([s,t0],k)=>{const a=ag_in(tt,t0-0.1,0.4)*(1-ag_in(tt,P.harm-0.6,0.5));if(!(a>0.003))return;
  const y=430+k*76,w=dp_pill(x,140,y,s,"coral",{a});x.save();x.globalAlpha*=a;x.fillStyle="rgba(190,245,245,0.35)";x.fillRect(140+w+20,y+6,840-w-60,2);x.restore();});}

scene("asks",(ctx,S,t,sc)=>{const c=sc.cues,P=af_once(sc,"P",()=>({anil:wAt(sc,"anil","Anil"),progress:wAt(sc,"anil","progress"),support:wAt(sc,"anil","support"),
    asks:wAt(sc,"asks","asks"),office:wAt(sc,"asks","office"),owns:wAt(sc,"owns","Mei"),gave:c.gave,market:wAt(sc,"gave","marketplace"),
    unsaid:wAt(sc,"unsaid","say"),never:wAt(sc,"unsaid","never"),where:wAt(sc,"unsaid","where"),leave:wAt(sc,"unsaid","leave"),
    harm:c.harm,names:wAt(sc,"harm","names"),extra:wAt(sc,"harm","extra"),travel:wAt(sc,"harm","travel"),two:c.two-0.2,each:wAt(sc,"two","each"),use:wAt(sc,"two","use")}));
  const fly=P.office+0.25,land=fly+0.55;
  ag_shots(ctx,S,t,sc.dur,[
    // Anil at his desk in the Faculty of Health: how do its learners progress? A chart with a gap; then his request goes to the registrar
    {at:0,place:"afAnil",keys:[[0,960,540,1.0],[0.1,950,540,1.03]],d:14,push:0.01,draw:(x,tt)=>{const [ax,ay,as]=AF_ANIL;
      dp_person(x,"anil",ax,ay,as,{t:tt,cut:AF_BACK,gaze:[3,1]});
      af_screen(x,clamp((tt-P.progress+0.2)/1.8,0,1),{a:ag_in(tt,P.progress-0.5,0.5)});
      const n=af_pop(tt,P.anil-0.1,P.asks-0.3);af_name(x,1070,110,520,"Faculty of Health","Anil Kurian",{k:n.k,a:n.a,behind:"afAnil"});
      const q=af_pop(tt,P.asks,null),go=clamp((tt-fly)/0.45,0,1),dx=100*ag_sine(go);af_request(x,1000+dx,110,800,{k:q.k,a:q.a*(1-go),behind:"afAnil"});}},
    // the registrar's office: the request lands by Mei, who owns the records. What two films gave it, and what neither says
    {cut:true,at:land-0.25,place:"afMei",keys:[[land-0.25,960,540,1.0],[land,970,540,1.03]],d:30,push:0.01,draw:(x,tt)=>{af_mei(x,tt);
      const m=af_pop(tt,P.owns-0.1,null);af_name(x,1290,110,560,"Owner · registrar's office","Mei Tanaka",{k:m.k,a:m.a,behind:"afMei"});
      const ar=clamp((tt-land+0.25)/0.5,0,1),lx=lerp(10,110,ag_eo(ar));af_request(x,lx,150,800,{full:true,a:ag_sine(ar),behind:"afMei"});
      const g=af_pop(tt,P.gave,P.unsaid-0.4),mk=af_pop(tt,P.market-0.1,P.unsaid-0.4);
      const b1=dp_card(x,110,380,400,{kick:"Access",title:"A purpose and an end date"},{col:AF_ICE,k:g.k,a:g.a,behind:"afMei"});dp_tag(x,110,b1.y+b1.h+24,"Who may see it",AF_ICE,{a:g.a,behind:"afMei"});
      const b2=dp_card(x,540,380,400,{kick:"Requests",title:"Asked in one place"},{col:AF_ICE,k:mk.k,a:mk.a,behind:"afMei"});dp_tag(x,540,b2.y+b2.h+24,"The marketplace",AF_ICE,{a:mk.a,behind:"afMei"});
      af_unsaid(x,tt,P);
      // left unsaid: names beside results, then who gets extra time; copies travel to a laptop and a shared folder
      const h=ag_in(tt,P.names-0.3,0.5)*(1-ag_in(tt,P.two,0.5));af_harm(x,110,380,{a:h,third:ag_in(tt,P.extra-0.1,0.6),behind:"afMei"});
      const cp=ag_in(tt,P.travel-0.2,0.5)*(1-ag_in(tt,P.two,0.5));af_laptop(x,240,770,cp);af_folder(x,720,770,cp);
      af_copy(x,[490,520],[240,700],(tt-P.travel)/1.4,cp);af_copy(x,[560,520],[720,712],(tt-P.travel-0.4)/1.4,cp);
      af_twoPapers(x,110,420,{ka:Math.max(0,tt-P.each),kb:Math.max(0,tt-P.use+0.2),behind:"afMei"});}}]);
  dp_kicker(ctx,"Monday 5 October 2026",null,{a:ag_in(t,0.3,0.8)});});

/* ---------------------------------------------------------------- 3 · A promise from each person */
const AF_BADGES=["Staff","Contractors","Researchers","The data team"];
// those who sign it: a badge each, and a green tick, "Signed", as each is named
function af_signers(x,tt,ks){AF_BADGES.forEach((s,k)=>{const u=ks[k];if(!(u>0.003))return;const bx=240+k*306,by=640,w=290;x.save();x.globalAlpha*=ag_in(u,0,0.4);
  dp_panel(x,bx,by,w,92,{col:AF_ICE,r:16,glowR:24,behind:"hall"});x.save();x.translate(bx+44,by+50);x.scale(0.46,0.46);dp_personPic(x,0,0,"cyan");x.restore();
  dp_T(x,s,bx+86,by+56,{w:700,size:28});const tk=clamp((u-0.35)/0.5,0,1);if(tk>0){dp_tick(x,bx+22,by+128,"green",tk);dp_T(x,"Signed",bx+56,by+138,{w:700,size:28,col:"green",a:tk});}
  x.restore();});}

scene("promise",(ctx,S,t,sc)=>{const c=sc.cues,P=af_once(sc,"P",()=>({own:wAt(sc,"own","confidentiality"),l:[c.l1,c.l2,c.l3,c.l4,c.l5,c.l6],
    who:[wAt(sc,"everyone","staff"),wAt(sc,"everyone","contractors"),wAt(sc,"everyone","researchers"),wAt(sc,"everyone","team")],
    every:wAt(sc,"yearly","every"),yusuf:wAt(sc,"yearly","Yusuf"),groups:c.groups-0.3,only:wAt(sc,"groups","only"),signed:wAt(sc,"groups","signed"),
    agent:c.agent-0.2,owner:wAt(sc,"agent","owner"),ai:wAt(sc,"agent","AI"),renewed:wAt(sc,"renewed","renewed"),bl:c.bletchley-0.2,outlasts:wAt(sc,"bletchley","outlasts")}));
  const sigs=k=>clamp((t-P.who[k])/0.9,0,1);
  ag_shots(ctx,S,t,sc.dur,[
    // the first paper, each person's own: its six lines, set down as they're said; those who sign it; a year going round
    {at:0,place:"hall",keys:[[0,960,540,1.0],[0.1,960,540,1.02]],d:30,push:0.01,draw:(x,tt)=>{
      const p=af_pop(tt,0.05,null);af_promise(x,530,80,860,{kick:"Each person's own",show:i=>ag_in(tt,P.l[i]-0.15,0.4),glow:i=>ag_io(tt,P.l[i]-0.15,i<5?P.l[i+1]-0.15:P.l[5]+2.2,0.3),k:p.k,a:p.a,behind:"hall"});
      af_signers(x,tt,[0,1,2,3].map(k=>clamp((tt-P.who[k]+0.2)/0.9,0,1)));
      af_door(x,{rect:[1500,560,150,220],open:af_ph(tt,P.who[3]+1.2,1.2),a:ag_in(tt,P.who[0]-0.3,0.6),pillA:0,behind:"hall"});
      af_year(x,1490,190,44,clamp((tt-P.every)/2.2,0,1),"Every year",{a:ag_in(tt,P.every-0.3,0.4)});}},
    // Yusuf, in data governance, keeps them
    {cut:true,at:P.yusuf-0.15,place:"afYusuf",keys:[[P.yusuf-0.15,960,540,1.0],[P.yusuf,960,540,1.03]],d:6,push:0.01,draw:(x,tt)=>{const [yx,yy,ys]=AF_YUSUF;
      dp_person(x,"yusuf",yx,yy,ys,{t:tt,cut:AF_BACK,gaze:[3,1]});af_name(x,60,110,560,"Data governance","Yusuf Demir",{behind:"afYusuf"});
      af_register(x,880,170,960,{h:520,kick:"Confidentiality",title:"Signed agreements",keeper:"Renewed every year",open:ag_in(tt,P.yusuf+0.3,0.8),behind:"afYusuf",
        rows:["Anil Kurian","Mei Tanaka","Sam Okafor","Yusuf Demir"].map((n,k)=>[n,{tick:clamp((tt-P.yusuf-0.6-k*0.25)/0.5,0,1)}])});}},
    // access comes through groups: the study's group, and Anil in it only while his promise is signed and current; an agent signs nothing
    {cut:true,at:P.groups,place:"hall",keys:[[P.groups,960,540,1.0],[P.groups+0.1,960,540,1.02]],d:20,push:0.01,draw:(x,tt)=>{
      const st=tt<P.only-0.1?"signed":tt<P.only+1.3?"renew":tt<P.signed-0.1?"lapsed":"signed",ch=[P.only-0.1,P.only+1.3,P.signed-0.1].filter(v=>v<=tt).pop(),
        paused=st==="lapsed"?ag_in(tt,P.only+1.4,0.5):0,g=af_pop(tt,P.groups+0.2,null);
      af_group(x,300,150,760,{title:"Health progress study",members:[{name:"Anil Kurian",state:st,paused,pillA:ch==null?1:ag_in(tt,ch,0.25)}],k:g.k,a:g.a,behind:"hall"});
      dp_tag(x,300,420,"Who is it, really?",AF_ICE,{a:ag_in(tt,P.groups+0.8,0.5),behind:"hall"});
      const ra=af_pop(tt,P.renewed,null);if(ra.a>0)dp_slip(x,300,520,"Renewed · Monday 2 February 2026","green",{a:ra.a,behind:"hall"});
      const ag=ag_in(tt,P.agent,0.6);if(ag>0){ag_model(x,1360,300,74,{t:tt,a:ag,col:"cyan"});
        af_agentCard(x,1150,430,500,{a:ag_in(tt,P.agent+0.3,0.5),sign:clamp((tt-P.owner)/1.4,0,1),behind:"hall"});
        dp_tag(x,1150,690,"AI agents in data work",AF_ICE,{a:ag_in(tt,P.ai-0.1,0.5),behind:"hall"});}}},
    // as at Bletchley: the recruit's signed form under the lamp; then the six lines again
    {at:P.bl,dis:0.9,place:"afHut",keys:[[P.bl,860,540,1.2],[P.bl+0.1,850,550,1.24]],d:3,push:0.01,draw:(x,tt)=>{const [rx,ry,rs]=AF_DESK.recruit;
      af_hutDoor(x,1);af_form(x,1);dp_person(x,AF_P.recruit,rx,ry,rs,{t:tt,light:"lamp",pose:af_signPose(1),cut:AF_DESK.back,gaze:[3,5],hold:af_penHeld});}},
    {at:P.outlasts-0.5,dis:0.9,place:"hall",keys:[[P.outlasts-0.5,960,540,1.0],[P.outlasts,960,540,1.02]],d:4,push:0.01,draw:(x,tt)=>{
      af_promise(x,530,80,860,{kick:"Each person's own",glow:i=>i===5?ag_in(tt,P.outlasts,0.6):0,behind:"hall"});}}]);});

/* ---------------------------------------------------------------- 4 · An agreement for each use */
const AF_AG={x:300,y:84,w:1440};
// the register of agreements, as a table: what was agreed, by whom, until when
const AF_LEDGER={x:720,y:170,w:1160,head:[["What was agreed",0],["By whom",470],["Until",850]],row:["2026-14 · learner records","Mei Tanaka, Anil Kurian","30 June 2027"]};
const AF_SAFES=[["project","purpose"],["data",["may","never"]],["people","who"],["setting","where"],["outputs","leave"]];
scene("agreement",(ctx,S,t,sc)=>{const c=sc.cues,P=af_once(sc,"P",()=>({purpose:c.purpose,from:c.from,may:c.may,course:wAt(sc,"may","course"),never:wAt(sc,"never","Never"),
    who:c.who,where:c.where,leave:c.leave,ends:c.ends,safe:{people:wAt(sc,"safes","people"),project:wAt(sc,"safes","project"),setting:wAt(sc,"safes","setting"),data:wAt(sc,"safes","data"),outputs:wAt(sc,"safes","outputs")},
    mei:wAt(sc,"sign","Mei"),decides:wAt(sc,"sign","decides"),anil:wAt(sc,"sign","Anil"),register:c.register-0.3,agreed:wAt(sc,"register","agreed"),
    bl:c.bletchley-0.2,named:wAt(sc,"bletchley","named"),stays:wAt(sc,"bletchley","stays"),leaves:wAt(sc,"bletchley","leaves")}));
  const signs=tt=>({mei:clamp((tt-P.mei)/1.6,0,1),anil:clamp((tt-P.anil)/1.6,0,1),chip:ag_in(tt,P.anil+1.5,0.4)}),full={purpose:1,from:1,may:1,never:1,who:1,where:1,leave:1,ends:1};
  const agree=(x,tt,o)=>af_agreement(x,AF_AG.x,AF_AG.y,AF_AG.w,Object.assign({behind:"hall"},o));
  ag_shots(ctx,S,t,sc.dur,[
    // Mei and Anil at her table, the second paper between them
    {at:0,place:"afMei",keys:[[0,960,540,1.0],[0.1,960,540,1.03]],d:6,push:0.01,draw:(x,tt)=>{
      dp_person(x,"anil",AF_ANIL[0],600,1,{t:tt,cut:AF_BACK,gaze:[3,1]});af_mei(x,tt);
      const p=af_pop(tt,0.6,null);dp_card(x,660,360,600,{kick:"Data sharing agreement",title:"2026-14"},{col:AF_ICE,k:p.k,a:p.a,behind:"afMei"});}},
    // the agreement, line by line; the Five Safes beside its lines; Mei signs as the owner, Anil for the study
    {cut:true,at:P.purpose-0.3,place:"hall",keys:[[P.purpose-0.3,960,540,1.0],[P.purpose,960,540,1.015]],d:60,push:0.006,draw:(x,tt)=>{
      const b=agree(x,tt,{show:k=>ag_in(tt,P[k]-0.15,0.4),may:ag_in(tt,P.course,0.7),never:ag_in(tt,P.never+0.2,0.7),signs:signs(tt),date:"Monday 12 October 2026",dateA:ag_in(tt,P.anil+1.6,0.5)});
      const rowY=k=>{const i=AF_AGREE.findIndex(r=>r[0]===k),r=b.rows[i];return r.y+r.h/2-14;};
      AF_SAFES.forEach(([s,k])=>{const y=Array.isArray(k)?(rowY(k[0])+rowY(k[1]))/2:rowY(k);af_label(x,AF_AG.x-24,y,s,{a:ag_in(tt,P.safe[s]-0.1,0.4),to:[AF_AG.x,y],behind:"hall"});});
      dp_tag(x,24,b.footY+6,"Who decides",AF_ICE,{a:ag_in(tt,P.decides-0.1,0.5)*(1-ag_in(tt,P.register-0.6,0.4)),to:[AF_AG.x+36,b.footY+50],behind:"hall"});}},
    // Yusuf keeps it in the register of agreements
    {cut:true,at:P.register,place:"afYusuf",keys:[[P.register,960,540,1.0],[P.register+0.1,960,540,1.03]],d:7,push:0.01,draw:(x,tt)=>{const [yx,yy,ys]=AF_YUSUF;
      dp_person(x,"yusuf",yx,yy,ys,{t:tt,cut:AF_BACK,gaze:[3,1]});af_name(x,60,110,560,"Data governance","Yusuf Demir",{behind:"afYusuf"});
      af_ledger(x,AF_LEDGER.x,AF_LEDGER.y,AF_LEDGER.w,{kick:"Data sharing",title:"Register of agreements",head:AF_LEDGER.head,ghosts:2,a:ag_in(tt,P.register+0.2,0.5),behind:"afYusuf",
        rows:[{cells:AF_LEDGER.row,glow:ag_io(tt,P.agreed,P.agreed+3,0.5),a:ag_in(tt,P.register+0.8,0.6)}]});}},
    // as at Bletchley: the officer's hand on the sheet
    {at:P.bl,dis:0.9,place:"afDesk",keys:[[P.bl,980,660,1.45],[P.bl+0.1,990,670,1.5]],d:3,push:0.01,draw:(x,tt)=>{
      af_desk(x,tt,null,{officer:{pose:af_reachTo([AF_OFFICE.officer[0],AF_OFFICE.officer[1],1,false],AF_OFFICE.sheet[0]-50,AF_OFFICE.sheet[1]-2,"hold"),flat:1},commander:{}});}},
    // and back to the agreement: who, where, and what may leave, each lit in turn
    {at:P.named-0.6,dis:0.9,place:"hall",keys:[[P.named-0.6,960,540,1.0],[P.named,960,540,1.015]],d:6,push:0.006,draw:(x,tt)=>{
      agree(x,tt,{may:1,never:1,signs:{mei:1,anil:1,chip:1},date:"Monday 12 October 2026",dateA:1,hi:k=>k==="who"?ag_io(tt,P.named,P.stays-0.2,0.3):k==="where"?ag_io(tt,P.stays,P.leaves-0.2,0.3):k==="leave"?ag_in(tt,P.leaves,0.3):0});}}]);});

/* ---------------------------------------------------------------- 5 · Access, made from the agreement */
const AF_CON={x:80,y:345,w:780},AF_AGY=140;
// the agreement and its contract, at the hall's left: the contract is set down under the agreement (con: its k and a, as af_pop gives them)
function af_papersLeft(x,tt,o){const con=o.con||{k:1,a:1};
  if(con.a>0.003)af_contract(x,AF_CON.x,AF_CON.y,AF_CON.w,{hi:o.hi,ended:o.ended,a:con.a,k:con.k,behind:"afHall"});
  if(o.glow>0)dp_halo(x,AF_CON.x+AF_CON.w/2,AF_AGY+90,460,"cyan",0.22*o.glow);
  dp_card(x,AF_CON.x,AF_AGY,AF_CON.w,{kick:"Data sharing agreement",title:"2026-14",sub:"For a study in the Faculty of Health"},{col:AF_ICE,k:o.k,a:o.a,behind:"afHall"});}
const AF_LINE0=[AF_CON.x+AF_CON.w,AF_CON.y+130];
scene("grant",(ctx,S,t,sc)=>{const c=sc.cues,P=af_once(sc,"P",()=>({made:wAt(sc,"now","made"),written:wAt(sc,"contract","written"),
    columns:wAt(sc,"terms","columns"),group:wAt(sc,"terms","group"),endT:wAt(sc,"terms","end"),team:wAt(sc,"hand","team"),grant:wAt(sc,"hand","grant"),hand:wAt(sc,"hand","hand"),give:wAt(sc,"hand","give"),
    every:wAt(sc,"names","Every"),no:wAt(sc,"names","No"),nov:c.november,faculty:wAt(sc,"november","faculty"),newP:wAt(sc,"stretch","new"),stretch:wAt(sc,"stretch","stretch"),
    support:c.support-0.3,own:wAt(sc,"support","own")}));
  const hi=tt=>i=>[P.columns,P.group,P.endT].map((v,k,a)=>ag_io(tt,v-0.1,k<2?a[k+1]-0.2:P.endT+2.2,0.3))[i];
  const i=ag_shots(ctx,S,t,sc.dur,[
    // the hall and the platform: only now comes access; the agreement, and its contract, which the platform reads
    {at:0,place:"afHall",keys:[[0,960,540,1.0],[0.1,960,540,1.02]],d:20,push:0.01,draw:(x,tt)=>{af_platform(x);
      af_papersLeft(x,tt,{glow:ag_io(tt,P.made-0.1,P.made+1.6,0.4),con:af_pop(tt,P.written,null),hi:hi(tt)});}},
    // Sam, on the platform team, makes the grant from the contract, never by hand
    {cut:true,at:P.team-0.4,place:"afSam",keys:[[P.team-0.4,960,540,1.0],[P.team,960,540,1.03]],d:6,push:0.01,draw:(x,tt)=>{const [sx,sy,ss]=AF_SAM;
      dp_person(x,"sam",sx,sy,ss,{t:tt,cut:AF_BACK,gaze:[3,1]});af_name(x,60,110,560,"Platform team","Sam Okafor",{behind:"afSam"});
      af_contract(x,1000,250,800,{behind:"afSam"});dp_link(x,[1800,420],[1940,420],"cyan",af_ph(tt,P.grant,0.6),{lw:4,dot:false});
      const hd=ag_in(tt,P.hand-0.1,0.3)*(1-ag_in(tt,P.hand+1.1,0.5)),u=clamp((tt-P.hand)/1.2,0,1);if(hd>0){x.save();x.globalAlpha*=hd;x.strokeStyle=rgba(DP.ice,0.8);x.lineWidth=2.4;x.setLineDash([10,9]);x.lineCap="round";
        x.beginPath();for(let k=0;k<=40*u;k++){const v=k/40,xx=lerp(640,1400,v),yy=lerp(724,690,v)+Math.sin(v*23)*10+Math.sin(v*61)*4;k?x.lineTo(xx,yy):x.moveTo(xx,yy);}x.stroke();x.restore();}}},
    // back in the hall: the grant has reached the study's own space, its four columns and nothing else, the line named by its agreement;
    // in November a new purpose stops at the agreement's edge
    {cut:true,at:P.give-0.2,place:"afHall",keys:[[P.give-0.2,960,540,1.0],[P.give,960,540,1.02]],d:24,push:0.01,draw:(x,tt)=>{af_platform(x);
      af_papersLeft(x,tt,{});const lp=0.55+0.45*af_ph(tt,P.give-0.2,0.5);dp_link(x,AF_LINE0,AF_ROOMIN,"cyan",lp,{lw:4});
      af_room(x,{a:ag_in(tt,P.give,0.4),cols:k=>ag_in(tt,P.give+0.4+k*0.18,0.35)});
      if(tt>P.every-0.2&&tt<P.every+1.6)dp_halo(x,1000,400,220,"cyan",0.25*ag_io(tt,P.every-0.2,P.every+1.4,0.4));
      const tg=ag_in(tt,P.give+0.6,0.5);dp_tag(x,860,370,"Agreement 2026-14","cyan",{a:tg,to:[1010,AF_LINE0[1]+(AF_ROOMIN[1]-AF_LINE0[1])*0.5],behind:"afHall"});
      dp_pill(x,AF_CON.x,780,"No agreement, no grant","coral",{a:ag_in(tt,P.no,0.4)*(1-ag_in(tt,P.nov,0.5))});
      // November: the faculty asks the study for names; the request travels to the study's space and stops at its wall
      const rq=af_pop(tt,P.faculty,null),RW=700,rx=lerp(40,AF_PLAT.x-RW-6,ag_eo(clamp((tt-P.faculty)/1.6,0,1)));
      if(rq.a>0){dp_card(x,rx,740,RW,{kick:"Request · to call them",title:"Names of learners who need support"},{col:AF_ICE,a:rq.a,behind:"afHall"});
        const st=ag_in(tt,P.faculty+1.4,0.4);if(st>0)dp_link(x,[AF_PLAT.x,744],[AF_PLAT.x,858],"coral",1,{lw:4,dot:false,alpha:st});
        dp_pill(x,AF_PLAT.x+24,818,"Not in 2026-14","coral",{a:ag_in(tt,P.stretch-0.1,0.4)});}}},
    // the support team asks Mei for an agreement of its own: a new paper, empty but for its purpose to come
    {cut:true,at:P.support,place:"afMei",keys:[[P.support,960,540,1.0],[P.support+0.1,970,540,1.03]],d:5,push:0.01,draw:(x,tt)=>{af_mei(x,tt);
      af_name(x,1290,110,560,"Owner · registrar's office","Mei Tanaka",{behind:"afMei"});
      const sp=clamp((tt-P.support-0.4)/0.6,0,1),lx=lerp(10,110,ag_eo(sp));x.save();x.globalAlpha*=ag_sine(sp);
      const b=af_paper(x,lx,200,820,{kick:"Data sharing agreement",title:"Student support team",rows:[{label:"Purpose",text:"To call learners who need support"},{label:"May have",lines:[""]},{label:"Ends",lines:[""]},{label:"Signed",lines:[""]}]},{behind:"afMei",labelW:180});
      x.save();x.fillStyle="rgba(190,245,245,0.3)";b.rows.slice(1).forEach(r=>x.fillRect(lx+AF_PAD+180,r.base+6,420,1.6));x.restore();x.restore();}}]);
  dp_kicker(ctx,"November 2026",null,{a:i>=2?ag_in(t,P.nov,0.6):0});});

/* ---------------------------------------------------------------- 6 · When it ends */
scene("ends",(ctx,S,t,sc)=>{const c=sc.cues,P=af_once(sc,"P",()=>({ends:wAt(sc,"itself","ends"),deleted:wAt(sc,"deleted","deleted"),yusuf:wAt(sc,"deleted","Yusuf"),closes:wAt(sc,"deleted","closes"),
    totals:c.totals-0.3,holds:wAt(sc,"holds","promise"),leaves:wAt(sc,"holds","leaves"),bl:c.bletchley-0.2,learned:c.learned-0.3,end:c.end-0.3,start:wAt(sc,"end","start"),fin:c.breath}));
  const twoUp=(x,tt,o)=>{af_totals(x,140,190,700,{behind:"hall",a:o.ta,k:o.tk});af_promise(x,930,110,860,{kick:"Anil Kurian's",who:"Anil Kurian",sign:1,chip:1,seed:2.2,glow:i=>i===5?(o.glow||0):0,a:o.pa,k:o.pk,behind:"hall"});};
  const i=ag_shots(ctx,S,t,sc.dur,[
    // the grant ends by itself on its date: the line from the contract thins to nothing; the study's copy frosts over and is gone
    {at:0,place:"afHall",keys:[[0,960,540,1.0],[0.1,960,540,1.02]],d:12,push:0.01,draw:(x,tt)=>{af_platform(x);af_papersLeft(x,tt,{ended:tt>P.ends});
      const th=1-af_ph(tt,P.ends,1.8);if(th>0.01)dp_link(x,AF_LINE0,AF_ROOMIN,"cyan",1,{lw:4*th,alpha:th});
      af_room(x,{cols:()=>1,frost:clamp((tt-P.deleted)/1.4,0,1)});
      const gy=af_ph(tt,P.ends,1.2);dp_tag(x,860,370,"Agreement 2026-14",mix(DP.T.cyan,DP.T.grey,gy),{behind:"afHall"});}},
    // Yusuf closes the agreement in the register
    {cut:true,at:P.yusuf-0.2,place:"afYusuf",keys:[[P.yusuf-0.2,960,540,1.0],[P.yusuf,960,540,1.03]],d:6,push:0.01,draw:(x,tt)=>{const [yx,yy,ys]=AF_YUSUF;
      dp_person(x,"yusuf",yx,yy,ys,{t:tt,cut:AF_BACK,gaze:[3,1]});af_name(x,60,110,560,"Data governance","Yusuf Demir",{behind:"afYusuf"});
      const cl=ag_in(tt,P.closes,0.5);af_ledger(x,AF_LEDGER.x,AF_LEDGER.y,AF_LEDGER.w,{kick:"Data sharing",title:"Register of agreements",head:AF_LEDGER.head,ghosts:2,behind:"afYusuf",
        rows:[{cells:AF_LEDGER.row,col:cl>0.5?"mut":"ink",pill:"Closed",pillA:cl}]});}},
    // the totals stay; Anil's promise holds
    {cut:true,at:P.totals,place:"hall",keys:[[P.totals,960,540,1.0],[P.totals+0.1,960,540,1.02]],d:10,push:0.01,draw:(x,tt)=>{const a=af_pop(tt,P.totals+0.2,null),b=af_pop(tt,P.holds-0.2,null);
      twoUp(x,tt,{ta:a.a,tk:a.k,pa:b.a,pk:b.k,glow:ag_in(tt,P.leaves-0.3,0.6)});}},
    // at Bletchley: the huts at night, every window dark but one
    {at:P.bl,dis:1.0,place:"afPark",keys:[[P.bl,960,560,1.0],[P.bl+0.1,960,570,1.04]],d:6,push:0.01,draw:(x,tt)=>{af_park(x,tt+200,{lit:(r,k,i)=>r===1&&k===3&&i===2?1:0,walk:0});}},
    // the study learned what it needed, and named no one: the totals and Anil's promise, side by side
    {at:P.learned,dis:1.0,place:"hall",keys:[[P.learned,960,540,1.0],[P.learned+0.1,960,540,1.02]],d:10,push:0.01,draw:(x,tt)=>twoUp(x,tt,{glow:0})},
    // access is the end of an agreement: the two papers, and the door to the data at their end, opening a little, then closing
    {at:P.end,later:true,dis:0.5,place:"hall",keys:[[P.end,960,540,1.0],[P.end+0.1,960,540,1.02]],d:6,push:0.01,draw:(x,tt)=>{const out=1-ag_in(tt,P.fin-0.4,0.8);if(!(out>0.003))return;
      x.save();x.globalAlpha*=out;af_twoPapers(x,240,430,{ka:Math.max(0,tt-P.end-0.5),kb:Math.max(0,tt-P.end-0.8),behind:"hall"});
      af_door(x,{rect:[1400,410,240,360],open:0.4*Math.sin(Math.PI*clamp((tt-P.start-0.4)/3.2,0,1)),a:ag_in(tt,P.end+1.2,0.6),behind:"hall"});x.restore();}}]);
  dp_kicker(ctx,"Wednesday 30 June 2027",null,{a:i===0?ag_in(t,0.3,0.8):0});
  dp_end(ctx,S,t,P.fin,AF_TITLE,"Access is the end of an agreement, not the start.","Film 1 of 8","Only what you may see");
  if(t>P.fin)dp_T(ctx,"Next: Know what you hold",960,790,{w:600,size:28,align:"center",col:"mut",a:ag_in(t,P.fin+1.4,0.8)});});

ag_cutInto(["asks","promise","agreement","grant","ends"]);
