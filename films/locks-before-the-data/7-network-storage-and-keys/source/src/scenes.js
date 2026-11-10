/* ===== Network, storage and keys: the scenes, chapter by chapter =====
   Each chapter is a run of shots (ag_shots): a place painted once, a slow camera, and what's drawn live. Times come from the cues
   (c.<line>, when each line starts) and from the words of the lines (wAt), so the pictures stay with the voice.
   Rome is three places (the aqueduct, the tank, the street): between them the whole picture changes, so the film dissolves; at the
   same place, the camera glides. From the end of chapter 2 to the end of the film, the film is in one room, the hall: each chapter is
   one shot of it, its camera gliding from where the last chapter left it (ag_cutInto), and what both show is drawn the same at the
   join, so only what changes fades. The platform is drawn by nw_plat from a state each chapter keeps (what is lit, open, shut, on). */

/* ---------------------------------------------------------------- pieces the scenes share */
function nw_once(sc,k,fn){sc.__nw=sc.__nw||{};if(!(k in sc.__nw))sc.__nw[k]=fn();return sc.__nw[k];}
// the place and year, top left, in the opening story: on the screen, not in the place, so the camera doesn't carry it
function nw_where(ctx,S,s,a){if(!(a>0))return;setScreen(ctx,S);dp_kicker(ctx,s,null,{a});}
// a person's name on a small panel over their head (o.sub a quieter line under it)
function nw_name(ctx,x,y,name,sub,a,o){o=o||{};if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;const w=Math.max(dp_tw(ctx,name,{w:700,size:30}),sub?dp_tw(ctx,sub,{w:600,size:28}):0)+48,h=sub?96:66;
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:16,glowR:26});dp_T(ctx,name,x+24,y+42,{w:700,size:30,col:o.ink?"ink":(o.col||"cyan")});if(sub)dp_T(ctx,sub,x+24,y+80,{w:600,size:28,col:"mut"});ctx.restore();}
// a person who comes in and goes, whole: fades in at t0, out at t1 (or never)
function nw_fade(tt,t0,t1,d){return ag_in(tt,t0,d||0.5)*(t1==null?1:1-ag_in(tt,t1,d||0.5));}
// the title card's sub line, and the film's end card: its last line in two lines, the mark, the title, and the series
function nw_end(ctx,S,t,t0,lines,next){const oA=ag_in(t,t0,1.0),tA=ag_in(t,t0+0.6,0.9);if(oA<=0)return;dp_veil(ctx,S,oA*0.9);setScreen(ctx,S);
  withA(ctx,tA,()=>{lines.forEach((l,i)=>dp_T(ctx,l,960,300+i*64,{w:700,size:48,align:"center"}));dp_mark(ctx,960,488,56,(t-t0-0.7)/1.4,1);
    dp_T(ctx,"Network, storage and keys",960,636,{w:800,size:44,align:"center"});dp_T(ctx,"Film 7 of 9 · Locks before the data · Learning Data",960,694,{w:600,size:28,align:"center",col:"mut"});
    if(next)withA(ctx,ag_in(t,t0+1.6,0.8),()=>dp_T(ctx,"Next: "+next,960,790,{w:700,size:30,align:"center",col:"cyan"}));});}

/* ---------------------------------------------------------------- Rome's things, drawn live at each place */
// the aqueduct: the water, the ground over it (cover 1 hides it), the holes and who draws from them, the gangs at the shaft
const NW_HOLES=[[640,748],[1120,748],[1480,748]];
function nw_atAqueduct(x,tt,o){o=o||{};nw_channelWater(x,tt,{low:o.low||0});nw_groundCover(x,o.cover||0);
  // the garden: a pipe from a hole up through the field to a patch of green (natural, not the green that means allowed)
  if(o.garden>0){const g=o.garden,[hx,hy]=NW_HOLES[1];x.save();x.globalAlpha*=(o.holesA==null?1:o.holesA)*(o.closed?1-o.closed[1]:1);x.strokeStyle=rgba(NW_C.lead,1);x.lineWidth=9;x.lineCap="round";x.beginPath();x.moveTo(hx,hy);x.lineTo(hx,lerp(hy,NW_CH.surf-6,ag_sine(g)));x.stroke();
    if(g>0.6){const u=ag_in(g,0.6,0.4);x.globalAlpha*=u;const R=ag_rnd(7);for(let i=0;i<26;i++){const px=hx-40+R()*240,py=NW_CH.surf-8-R()*46,r=10+R()*16;x.fillStyle=rgba(mix([44,70,48],[78,102,64],R()),0.9);x.beginPath();x.arc(px,py,r,0,TAU);x.fill();}}x.restore();}
  (o.holes||[]).forEach((p,i)=>{if(p>0)nw_hole(x,NW_HOLES[i][0],NW_HOLES[i][1],p,{a:(o.holesA==null?1:o.holesA)*(o.closed?1-o.closed[i]:1),to:i===0?[560,850]:null,s:i===0?(o.stream||0):0});});}
// the tank: the water in its basin, the pipes and nozzles, the uses, the records on their shelf, the grant tied to a pipe
function nw_atTank(x,tt,o){o=o||{};nw_basinWater(x,tt,o.fill==null?1:o.fill);nw_pipesOut(x,tt,o.pipes==null?1:o.pipes,{flow:1});if(o.uses)nw_uses(x,o.uses);
  const n=o.records||0;for(let i=0;i<Math.ceil(n);i++){const u=clamp(n-i,0,1),sx=NW_TK.shelf[0]+20+i*56,sy=NW_TK.shelf[1]+30;nw_tablet(x,sx,sy-(1-ag_eo(u))*40,0.7,{a:ag_in(u,0,0.4)});}
  if(o.grant>0){withA(x,o.grant,()=>{x.strokeStyle=rgba(NW_C.leadHi,0.8);x.lineWidth=2;x.beginPath();x.moveTo(1284,628);x.lineTo(1304,636);x.stroke();});nw_tablet(x,1310,656,0.5,{a:o.grant});}
  nw_inflow(x,tt,o.inflow==null?1:o.inflow);}
// the street: the branch pipes into the shops (p, lift), the lead taken out, the public basin
function nw_atStreet(x,tt,o){o=o||{};[300,700,1100].forEach((bx,i)=>nw_branch(x,bx,o.branch?o.branch[i]:0,{lift:o.lift?o.lift[i]:0}));
  if(o.lead>0)nw_leadStack(x,820,598,o.lead);nw_basin(x,tt,o.fill==null?0.2:o.fill,o.run==null?0.3:o.run);}

/* ---------------------------------------------------------------- 1 · Holes in the channels */
scene("holes",(ctx,S,t,sc)=>{const c=sc.cues,P=nw_once(sc,"P",()=>({under:wAt(sc,"aqueducts","under the ground"),hills:wAt(sc,"aqueducts","from the hills"),
    pub:wAt(sc,"uses","public basins"),baths:wAt(sc,"uses","to baths"),houses:wAt(sc,"uses","to houses"),grant:wAt(sc,"uses","a grant from the emperor"),
    office:wAt(sc,"frontinus","water commissioner"),meas:wAt(sc,"measures","measures the water"),more:wAt(sc,"measures","ten thousand"),
    divert:wAt(sc,"watermen","divert it"),tap:wAt(sc,"gardens","tap the channels"),secret:wAt(sc,"pavements","secret pipes"),branches:wAt(sc,"pavements","with branches"),
    shops:wAt(sc,"pavements","the shops"),little:wAt(sc,"little","only a little"),day:wAt(sc,"little","day and night")}));
  ag_shots(ctx,S,t,sc.dur,[
    // dawn over the hills: the arches cross the valley to the city; on "under the ground", the field's ground is cut away to show the
    // channel, the water in it pale silver
    {at:0,place:"nwAqueduct",keys:[[0,860,500,1.10],[1.2,1040,540,1.06]],d:5,push:0.01,draw:(x,tt)=>{
      nw_atAqueduct(x,tt,{cover:1-ag_in(tt,P.under,1.2)});}},
    // the city's distribution tank: the basin, the nozzles at one level, the pipes out to the three uses; a grant tied to a house's pipe;
    // Frontinus by the tank, his tablet in his hand; what he finds at the intakes
    {at:c.tanks-0.3,place:"nwTank",keys:[[c.tanks,1060,480,1.08],[c.frontinus-0.4,900,520,1.03]],d:2.2,push:0.012,draw:(x,tt)=>{
      nw_atTank(x,tt,{pipes:ag_sine((tt-c.tanks-0.4)/2.4),uses:[ag_in(tt,P.pub,0.5),ag_in(tt,P.baths,0.5),ag_in(tt,P.houses,0.5)],grant:ag_in(tt,P.grant,0.5),records:4});
      const fa=nw_fade(tt,c.frontinus-0.2,null,0.6);nw_folk(x,"frontinus",300,720,0.78,{t:tt,pose:"hold",hold:(c2,h)=>nw_heldTablet(c2,h),gaze:[3,0],a:fa});
      nw_name(x,60,236,"Sextus Julius Frontinus","water commissioner, 97",ag_in(tt,P.office-0.3,0.5)*(1-ag_in(tt,P.meas-0.6,0.5)));
      dp_card(x,1180,104,660,{kick:"At the intakes",title:"About 10,000 measures more",sub:"than the records give out"},{col:"coral",a:ag_in(tt,P.more,0.5),k:ag_spr(tt,P.more)});
      }},
    // back along the channel: the holes in it, one after another; a water-man fills his jar at one; a field's pipe to a garden
    {at:c.drawn-0.2,place:"nwAqueduct",keys:[[c.drawn,860,560,1.07],[c.gardens,1060,560,1.07]],d:2.6,push:0.01,draw:(x,tt)=>{
      nw_atAqueduct(x,tt,{holes:[ag_in(tt,c.drawn+0.2,0.6),ag_in(tt,P.tap-0.3,0.6),ag_in(tt,c.drawn+0.9,0.6)],stream:ag_in(tt,P.divert,0.9),garden:clamp((tt-P.tap)/1.4,0,1)});
      nw_folk(x,"waterman",420,790,0.6,{t:tt,pose:"hold",hold:(c2,h)=>nw_heldJar(c2,h,{full:ag_in(tt,P.divert+0.4,2.0)*0.8}),gaze:[3,1],a:nw_fade(tt,c.watermen-0.1)});
      }},
    // a street of shops: under the paving, secret pipes bored up into the shops from the main; the public basin beside it runs low,
    // a woman with her jar beside it; its spout runs dry
    {at:c.pavements-0.2,place:"nwStreet",keys:[[c.pavements,820,520,1.05],[P.little-0.4,1180,520,1.05]],d:2.2,push:0.01,draw:(x,tt)=>{
      const b=i=>ag_sine((tt-P.secret-0.2-i*0.45)/0.9);nw_atStreet(x,tt,{branch:[b(0),b(1),b(2)],fill:lerp(0.45,0.12,ag_in(tt,P.little,1.2)),run:lerp(0.6,0,ag_in(tt,c.stop,1.2))});
      nw_folk(x,"shopkeeper",300,790,0.6,{t:tt,gaze:[3,0],a:nw_fade(tt,P.shops-0.3)});
      nw_folk(x,"woman",1740,780,0.62,{t:tt,flip:true,pose:"hold",hold:(c2,h)=>nw_heldJar(c2,h,{full:0}),gaze:[3,1],a:nw_fade(tt,P.little-0.6)});
      dp_pill(x,1470,330,"Only a little","coral",{size:28,align:"center",a:ag_in(tt,P.little+0.3,0.5)});
      dp_card(x,560,96,520,{kick:"The records",title:"Who draws what?"},{col:"coral",a:ag_in(tt,c.nobody,0.5),k:ag_spr(tt,c.nobody)});
      }}
  ],0.6);
  nw_where(ctx,S,"Rome · 97",ag_in(t,0.8,0.8));});

/* ---------------------------------------------------------------- 2 · Only at the tank */
scene("tank",(ctx,S,t,sc)=>{const c=sc.cues,P=nw_once(sc,"P",()=>({nozzle:wAt(sc,"grant","bronze nozzle"),stamped:wAt(sc,"grant","stamped"),out:wAt(sc,"lead","come out"),
    est:wAt(sc,"lead","estimates the theft"),day:wAt(sc,"written","the day before"),did:wAt(sc,"written","what each did"),ran:wAt(sc,"people","ran for the people"),
    cat:wAt(sc,"files","its catalog is the tank"),hole:wAt(sc,"hole","a hole in the channel")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Frontinus holds the city to its rules, at the tank
    {at:0,place:"nwTank",keys:[[0,900,520,1.03]],push:0.012,draw:(x,tt)=>{nw_atTank(x,tt,{uses:[1,1,1],grant:1,records:4});
      nw_folk(x,"frontinus",300,720,0.78,{t:tt,pose:"hold",hold:(c2,h)=>nw_heldTablet(c2,h),gaze:[3,0]});}},
    // no one may draw from the channels: the holes close, one by one
    {at:c.none-0.2,place:"nwAqueduct",keys:[[c.none,1000,560,1.07]],push:0.01,draw:(x,tt)=>{const cl=i=>ag_in(tt,c.none+0.5+i*0.5,0.6);
      nw_atAqueduct(x,tt,{holes:[1,1,1],closed:[cl(0),cl(1),cl(2)],garden:1,holesA:1});}},
    // only at a tank, through a bronze nozzle stamped with the size granted; every grant in the records
    {at:c.grant-0.2,place:"nwTank",keys:[[c.grant,1000,480,1.06]],push:0.012,draw:(x,tt)=>{nw_atTank(x,tt,{uses:[1,1,1],grant:1,records:4+ag_in(tt,c.records+0.3,0.9)});
      nw_nozzleClose(x,1380,100,{a:ag_in(tt,P.nozzle,0.5)*(1-ag_in(tt,c.records+0.2,0.5)),k:ag_spr(tt,P.nozzle)});
      dp_tag(x,600,108,"The records",'grey',{a:ag_in(tt,c.records,0.5),to:[NW_TK.shelf[0]+130,NW_TK.shelf[1]+30],p:ag_sine((tt-c.records-0.2)/0.6)});}},
    // the branch pipes come out of the paving, and the lead piles up
    {at:c.lead-0.2,place:"nwStreet",keys:[[c.lead,900,520,1.05]],push:0.01,draw:(x,tt)=>{const l=i=>clamp((tt-P.out-i*0.4)/1.2,0,1);
      nw_atStreet(x,tt,{branch:[1,1,1],lift:[l(0),l(1),l(2)],lead:clamp((tt-P.out-0.6)/0.25,0,12),fill:0.12,run:0});
      dp_card(x,1180,96,600,{kick:"Frontinus",title:"He estimated the theft by the lead"},{col:"grey",a:ag_in(tt,P.est,0.5),k:ag_spr(tt,P.est)});}},
    // the gangs at the channel's shaft: what each will do, written the day before, and what each did, recorded; the supply almost doubled
    {at:c.gangs-0.2,place:"nwAqueduct",keys:[[c.gangs,1380,560,1.08],[c.doubled-0.2,1200,540,1.05]],d:2.0,push:0.01,draw:(x,tt)=>{nw_atAqueduct(x,tt,{garden:0});
      nw_folk(x,"gang1",1250,780,0.6,{t:tt,pose:"hold",hold:(c2,h)=>nw_heldTablet(c2,h),gaze:[3,0],a:nw_fade(tt,c.gangs-0.1)});
      nw_folk(x,"gang2",1520,780,0.6,{t:tt,flip:true,gaze:[3,1],a:nw_fade(tt,c.gangs+0.1)});
      // in the sky, clear of the arches and of the place's tag: the two records side by side, then, where the first was, what came of them
      const gd=1-ag_in(tt,c.doubled-0.1,0.4);
      dp_card(x,500,96,560,{kick:"The day before",title:"What each gang will do"},{col:"grey",a:ag_in(tt,P.day,0.5)*gd,k:ag_spr(tt,P.day)});
      dp_card(x,1100,96,560,{kick:"Each day",title:"What each one did"},{col:"grey",a:ag_in(tt,P.did,0.5)*gd,k:ag_spr(tt,P.did)});
      dp_card(x,500,96,560,{kick:"Frontinus",title:"The supply almost doubled"},{col:"green",a:ag_in(tt,c.doubled+0.3,0.5),k:ag_spr(tt,c.doubled+0.3)});}},
    // more basins and fountains ran for the people: the public basin brims, and the woman fills her jar
    {at:c.people-0.2,place:"nwStreet",keys:[[c.people,1260,520,1.05]],push:0.01,draw:(x,tt)=>{const f=ag_in(tt,P.ran,2.0);nw_atStreet(x,tt,{branch:[0,0,0],fill:lerp(0.12,0.92,f),run:lerp(0.1,1,ag_in(tt,c.people,0.8))});
      nw_folk(x,"woman",1740,780,0.62,{t:tt,flip:true,pose:"hold",hold:(c2,h)=>nw_heldJar(c2,h,{full:ag_in(tt,P.ran+0.6,1.6)*0.85}),gaze:[3,1],smile:0.4});}},
    // and those who had drawn water in fear drew it by grant: the shopkeeper, at the tank's house pipe, his grant beside it
    {at:c.care-0.3,place:"nwTank",keys:[[c.care,1120,520,1.04]],push:0.012,draw:(x,tt)=>{nw_atTank(x,tt,{uses:[1,1,1],grant:1,records:5});
      nw_folk(x,"shopkeeper",1700,790,0.6,{t:tt,flip:true,pose:"hold",hold:(c2,h)=>nw_heldJar(c2,h,{full:ag_in(tt,c.care+0.4,1.6)*0.8}),gaze:[3,0],smile:0.35});}},
    // a data platform's files are its water, and its catalog is the tank: the one place to draw, where each grant is checked and every
    // rule applied; every way to the files around it is a hole in the channel (the whole picture changes: a dissolve, into the hall)
    {at:c.files-0.2,place:"nwHall",keys:[[c.files,960,540,1]],push:0.008,draw:(x,tt)=>{const lit=ag_in(tt,P.cat,0.8);
      nw_store(x,{a:ag_in(tt,c.files+0.2,0.6),lit:[0,0,0,0,0]});nw_catTank(x,NW_CAT0.x,NW_CAT0.y,1,{lit,chips:[ag_in(tt,c.draw+0.6,0.4),ag_in(tt,c.draw+1.0,0.4),ag_in(tt,c.draw+1.4,0.4)],a:ag_in(tt,c.files,0.6)});
      dp_link(x,[NW_CAT0.x+440,NW_CAT0.y+200],[NW_H.store.x,NW_CAT0.y+200],"cyan",ag_sine((tt-P.cat-0.2)/0.8),{lw:3});
      nw_wayBus(x,NW_BUS.y,ag_sine((tt-P.hole)/1.4),{a:1-ag_in(tt,c.breath,0.6)});}}
  ],0.6);
  nw_where(ctx,S,"Rome · 97",1-ag_in(t,c.files-0.2,0.6));
  dp_title(ctx,S,t,c.breath,"Network, storage and keys","Private doors, one identity at the files, and a key of your own","FILM 7 OF 9 · LOCKS BEFORE THE DATA");});
// where the catalog stands when it first appears, big, in the middle of the hall
const NW_CAT0={x:520,y:300};

/* ---------------------------------------------------------------- the platform's chapters: pieces they share */
DP_PEOPLE.push("sam","jun");
// someone of the platform team, lit by the hall's glass, faded whole
function nw_who(ctx,who,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.004))return null;ctx.save();ctx.globalAlpha*=a;const h=dp_person(ctx,who,x,y,s,o);ctx.restore();return h;}
// the nine ways around the catalog, in the left column: the two account keys and the signed link (sealed cards), the six people with a
// role on the storage (badges), their role, the counter, and the coral lines from each to the bus into the storage's side.
// w: a, k [3], rev [3], pill, c [6], green (the six on their way through the catalog), stubs [4], bus, busA, n, nA
const NW_WK=[{x:80,y:222,w:360,label:"Account key 1",sub:"opens every file"},{x:80,y:356,w:360,label:"Account key 2",sub:"opens every file"},{x:80,y:490,w:460,label:"Signed link",sub:"2024 to the end of 2027"}];
function nw_ways(x,w){w=w||{};const A=w.a==null?1:w.a;if(A<=0)return;x.save();x.globalAlpha*=A;const bA=w.busA==null?1:w.busA,s=w.stubs||[];
  NW_WK.forEach((k,i)=>{if(s[i]>0)nw_wayStub(x,[k.x+k.w,k.y+60],s[i],{a:bA});});if(s[3]>0)nw_wayStub(x,[624,740],s[3],{a:bA});
  if(w.bus>0)nw_wayBus(x,282,w.bus,{a:bA});
  NW_WK.forEach((k,i)=>{const a=w.k?w.k[i]||0:0;if(a>0)dp_sealed(x,k.x,k.y,k.w,k.label,{sub:k.sub,a,revoked:w.rev?w.rev[i]:0});});
  if(w.pill>0)dp_pill(x,80,664,"Storage Blob Data Contributor, each","grey",{size:28,a:w.pill,glow:8});
  for(let i=0;i<6;i++){const a=w.c?w.c[i]||0:0,g=w.green||0;if(a<=0)continue;if(g<1)nw_personChip(x,70+i*94,690,{a:a*(1-g),col:"coral"});if(g>0)nw_personChip(x,70+i*94,690,{a:a*g,col:"green"});}
  if(w.nA>0)nw_counter(x,w.n||0,{a:w.nA});x.restore();}
// a file's rows as they lie in the storage, plain: bars of light, no words (decoration; the card beside it says what it is)
function nw_sheet(ctx,X,Y,W,Hh,a){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,X,Y,W,Hh,{col:"grey",r:16,glowR:24});const R=ag_rnd(5);
  for(let j=0;j<5;j++){const yy=Y+24+j*((Hh-36)/5);let xx=X+24;for(let k=0;k<5;k++){const bw=40+R()*64;if(xx+bw>X+W-24)break;ctx.fillStyle=rgba(DP.T.mut,0.5);rr(ctx,xx,yy,bw,12,6);ctx.fill();xx+=bw+16;}}ctx.restore();}
// a tool's page that comes in and goes (a), and what's on it (content(ctx, box))
function nw_pg(ctx,X,Y,W,Hh,o,a,content){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;const box=dp_page(ctx,X,Y,W,Hh,o);if(content)content(ctx,box);ctx.restore();}
// two words in one place, the first giving way to the second (u 0 to 1): one leaves, then the other comes
function nw_swap(ctx,s0,s1,x,y,u,o0,o1){if(u<0.5)dp_T(ctx,s0,x,y,Object.assign({},o0,{a:1-ag_sine(u*2)}));else dp_T(ctx,s1,x,y,Object.assign({},o1||o0,{a:ag_sine(u*2-1)}));}
// a card in the left column or at the top right, one at a time: in at t0, out at t1 (or never), springing in
function nw_cardAt(ctx,tt,t0,t1,X,Y,W,words,col){const a=ag_in(tt,t0,0.5)*(t1==null?1:1-ag_in(tt,t1,0.4));if(a<=0)return;dp_card(ctx,X,Y,W,words,{col,a,k:ag_spr(tt,t0)});}
// a small framed picture of one of Rome's places, with its place and year (a fades it)
// what's drawn live in the place (live(ctx), in the place's own coordinates) is drawn into the frame too; it holds no words
function nw_pip(ctx,place,crop,X,Y,Wd,a,live){if(!(a>0))return;const [sx,sy,sw,sh]=crop,Hh=Wd*sh/sw,k=Wd/sw;ctx.save();ctx.globalAlpha*=a;dp_halo(ctx,X+Wd/2,Y+Hh/2,Wd*0.7,"cyan",0.08);
  ctx.save();rr(ctx,X,Y,Wd,Hh,18);ctx.clip();ctx.drawImage(ag_place(place),sx,sy,sw,sh,X,Y,Wd,Hh);if(live){ctx.save();ctx.translate(X,Y);ctx.scale(k,k);ctx.translate(-sx,-sy);live(ctx);ctx.restore();}
  ctx.fillStyle="rgba(4,14,18,0.34)";ctx.fillRect(X,Y,Wd,64);ctx.restore();
  rr(ctx,X+1,Y+1,Wd-2,Hh-2,18);ctx.strokeStyle=rgba(mix(DP.F.cyan,[255,255,255],0.4),0.9);ctx.lineWidth=2.2;ctx.stroke();
  dp_T(ctx,"ROME · 97",X+24,Y+44,{w:700,size:28,ls:4,col:"cyan"});ctx.restore();}

/* ---------------------------------------------------------------- 3 · Nine ways around */
// the platform as chapter 3 leaves it, and chapter 4 finds it
const NW_END3={head:1,rooms:[1,1,1],m:1,lit:0.5,chipsA:0,pl:1,link:1,store:1,storeLit:[1,1,1,1,1],inet:1,doors:[1,1,1,1],shut:[0,0,0,0]};
scene("around",(ctx,S,t,sc)=>{const c=sc.cues,P=nw_once(sc,"P",()=>({db:wAt(sc,"platform","Azure Databricks"),dev:wAt(sc,"platform","development"),test:wAt(sc,"platform","test"),prod:wAt(sc,"platform","production"),
    cont:wAt(sc,"storage","a container for each area"),onlyw:wAt(sc,"only","the only way"),k1:wAt(sc,"keys","Two account keys"),ln:wAt(sc,"link","A link signed"),six:wAt(sc,"six","Six people"),
    notone:wAt(sc,"nine","not one asks"),nog:wAt(sc,"rows","no grant"),door:wAt(sc,"internet","a door on the internet"),any:wAt(sc,"internet","open to any address"),quick:wAt(sc,"wrong","the quickest way")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"nwHall",keys:[[0,960,540,1]],push:0.004,draw:(x,tt)=>{
    // the catalog goes to its place beside production as the workspaces come, each on its name
    const m=ag_in(tt,0.9,1.9),ra=[ag_in(tt,P.dev,0.6),ag_in(tt,P.test,0.6),ag_in(tt,P.prod,0.6)],dim=ag_in(tt,P.notone,0.8)*(1-ag_in(tt,P.nog+0.6,0.8));
    nw_base(x,tt,{head:ag_in(tt,P.db,0.6),rooms:ra,m,lit:lerp(1,0.5,m)+0.5*ag_in(tt,P.onlyw,0.6)*(1-ag_in(tt,P.k1,0.8))-0.25*dim,chips:[1,1,1],chipsA:1-ag_in(tt,0.9,0.8),
      pl:ag_sine((tt-P.onlyw)/0.6),link:1,store:1,storeLit:[0,1,2,3,4].map(i=>ag_in(tt,P.cont+i*0.18,0.4)),
      inet:ag_in(tt,P.door-0.5,0.6),doors:[0,1,2].map(i=>ag_sine((tt-P.door-i*0.3)/0.9)).concat([ag_sine((tt-P.any)/0.6)]),shut:[0,0,0,0]});
    // Sam, who runs the platform, and what he counts: each way to the files that skips the catalog, joined to one coral line into the storage
    const sa=nw_fade(tt,c.counts-0.2,c.keys-0.7,0.5);nw_who(x,"sam",270,664,0.84,{t:tt,gaze:[3,0],a:sa});nw_name(x,60,250,"Sam Okafor","runs the platform",sa*ag_in(tt,c.counts+0.2,0.5));
    const kA=[ag_in(tt,P.k1,0.5),ag_in(tt,P.k1+0.6,0.5),ag_in(tt,P.ln,0.5)],cA=[0,1,2,3,4,5].map(i=>ag_in(tt,P.six+i*0.16,0.4)),n=tt<P.k1?2:tt<P.ln?2:tt<P.six?3:3+Math.round(6*clamp((tt-P.six)/0.96,0,1));
    nw_ways(x,{k:kA,pill:ag_in(tt,P.six+1.0,0.5),c:cA,stubs:[ag_sine((tt-P.k1-0.5)/0.5),ag_sine((tt-P.k1-1.1)/0.5),ag_sine((tt-P.ln-0.5)/0.5),ag_sine((tt-P.six-1.1)/0.4)],
      bus:ag_sine((tt-P.k1-0.9)/1.8),busA:1-0.45*ag_in(tt,P.quick,0.8),n,nA:ag_in(tt,P.k1-0.2,0.5)});
    // nine, and not one through the catalog: the line glows
    if(dim>0)withA(x,dim,()=>nw_wayBus(x,282,1,{a:0.6}));
    // in the files, nothing of the catalog applies
    const fa=ag_in(tt,P.nog-0.2,0.5)*(1-ag_in(tt,P.door-0.9,0.4));dp_card(x,1470,110,410,{kick:"In the files",title:"Every row, plainly",sub:"no grant, mask or filter"},{col:"coral",a:fa,k:ag_spr(tt,P.nog-0.2)});nw_sheet(x,1470,330,410,124,fa);
    // nobody did anything wrong
    dp_pill(x,1060,790,"The quickest way, each time","grey",{size:28,align:"center",a:ag_in(tt,P.quick+0.3,0.5)*(1-ag_in(tt,sc.dur-1.4,0.5)),glow:8});}}]);});

/* ---------------------------------------------------------------- 4 · Doors in, a short list out */
const NW_END4={head:1,rooms:[1,1,1],m:1,lit:0.5,chipsA:0,pl:1,link:1,store:1,storeLit:[1,1,1,1,1],inet:1,doors:[1,1,1,1],shut:[1,1,1,0],net:1,priv:[1,1,1],jobs:1,build:1,cloud:1,allow:[1,1]};
scene("paths",(ctx,S,t,sc)=>{const c=sc.cues,P=nw_once(sc,"P",()=>({pe:wAt(sc,"endpoint","a private endpoint"),inside:wAt(sc,"endpoint","a door inside"),pp:wAt(sc,"path","a private path"),
    mach:wAt(sc,"machines","The machines"),build:wAt(sc,"machines","the build service"),list:wAt(sc,"list","an IP access list"),own:wAt(sc,"list","only the university's own"),
    off:wAt(sc,"off","switches public access off"),all3:wAt(sc,"off","all three"),sv:wAt(sc,"serverless","Serverless compute"),any:wAt(sc,"serverless","reach anywhere"),
    send:wAt(sc,"send","send a table"),pol:wAt(sc,"policy","a network policy"),own2:wAt(sc,"policy","the catalog's own storage"),short:wAt(sc,"policy","a short list"),
    dry:wAt(sc,"dry","dry run"),would:wAt(sc,"dry","what it would have blocked"),on:wAt(sc,"on","it's on"),places:wAt(sc,"on","places on the list")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"nwHall",keys:[[0,960,540,1]],push:0.004,draw:(x,tt)=>{
    const gone=ag_in(tt,0,0.6),outCut=ag_in(tt,P.places,0.8);
    nw_base(x,tt,Object.assign({},NW_END3,{net:ag_in(tt,P.pe-0.3,0.6),priv:[0,1,2].map(i=>clamp((tt-P.inside-i*0.35)/1.0,0,1)),jobs:ag_in(tt,P.mach,0.5),build:ag_in(tt,P.build,0.5),
      only:ag_in(tt,P.own,0.8)*(1-ag_in(tt,c.nodoor,0.4)),shut:[0,1,2].map(i=>ag_in(tt,c.nodoor+i*0.35,0.6)).concat([0]),
      cloud:ag_in(tt,P.sv-0.2,0.6),outs:clamp((tt-P.any)/1.2,0,1),outsA:1-outCut,cross:ag_in(tt,P.would,0.6)*(1-outCut),allow:[ag_sine((tt-P.own2)/0.8),ag_sine((tt-P.short)/0.8)]}));
    // the nine ways leave, for now, as the chapter turns (while the last chapter's end fades over this one, so their words never sit
    // over their own fading copy)
    nw_ways(x,{a:1-gone,k:[1,1,1],pill:1,c:[1,1,1,1,1,1],stubs:[1,1,1,1],bus:1,busA:0.55,n:9,nA:1});
    // a private endpoint, named once; people and jobs on their private path: a light along each door's line
    dp_tag(x,250,372,"Private endpoint","green",{a:ag_in(tt,P.pe,0.5)*(1-ag_in(tt,P.mach-0.4,0.4)),to:[636,404],p:ag_sine((tt-P.pe-0.3)/0.6)});
    for(let i=0;i<3;i++){const u=clamp((tt-P.pp-i*0.35)/1.4,0,1),y=NW_H.rooms[i].y+86;if(u>0&&u<1){const px=lerp(420,800,ag_sine(u));withA(x,Math.sin(Math.PI*u),()=>{dp_halo(x,px,y,30,"green",0.5);x.fillStyle=rgba(dp_f("green"),1);x.beginPath();x.arc(px,y,7,0,TAU);x.fill();});}}
    if(tt>P.mach)dp_link(x,[205,336],[640,404],"green",ag_sine((tt-P.mach-0.3)/0.7),{lw:2.4,alpha:0.85*(1-ag_in(tt,c.out,0.6))});
    if(tt>P.build)dp_link(x,[491,336],[640,404],"green",ag_sine((tt-P.build-0.3)/0.7),{lw:2.4,alpha:0.85*(1-ag_in(tt,c.out,0.6))});
    // for two weeks, the university's addresses only
    nw_cardAt(x,tt,P.list,P.off-0.2,1470,106,410,{kick:"IP access list",title:"The university's addresses",sub:"for two weeks"},"grey");
    // public access off, in all three workspaces
    nw_pg(x,60,380,560,340,{tool:"azure",name:"Microsoft Azure",where:"Networking",title:"Workspace: production"},ag_in(tt,P.off,0.5)*(1-ag_in(tt,c.nodoor+1.4,0.5)),(c2,b)=>{
      dp_T(c2,"Allow Public Network Access",b.x,b.y+26,{w:600,size:28,col:"mut"});const u=ag_in(tt,P.off+0.9,0.6);dp_switch(c2,b.x,b.y+50,1-u,{col:"coral"});
      nw_swap(c2,"Enabled","Disabled",b.x+92,b.y+80,u,{w:600,size:28});dp_pill(c2,b.x,b.y+158,"All three workspaces","grey",{size:28,a:ag_in(tt,P.all3,0.5),glow:8});});
    // a notebook's table, sent anywhere, through serverless compute
    {const u=clamp((tt-P.send)/2.4,0,1);if(u>0&&u<1){const C=NW_H.cloud,q=NW_OUT[5],a=Math.sin(Math.PI*u),p1=ag_sine(u*2),p2=ag_sine(u*2-1),
      px=u<0.5?lerp(900,C.x,p1):lerp(C.x,q[0],p2),py=u<0.5?lerp(600,C.y,p1):lerp(C.y,q[1],p2);dp_slip(x,px,py-30,"A table","grey",{align:"center",a});}}
    // production's network policy: restricted access; a week in dry run, then on
    nw_cardAt(x,tt,P.pol,sc.dur-1.2,60,380,560,{kick:"Network policy",title:"production: restricted access",sub:"only its own storage, and a short list"},"green");
    dp_tag(x,1500,300,"api.uni.example","grey",{size:28,a:ag_in(tt,P.short+0.4,0.5)*(1-ag_in(tt,sc.dur-1.2,0.4)),to:NW_API,p:1});
    dp_pill(x,90,622,"Dry run: one week","grey",{size:28,a:ag_in(tt,P.dry,0.5)*(1-ag_in(tt,c.on-0.2,0.4)),glow:8});
    dp_pill(x,90,622,"On","green",{size:28,a:ag_in(tt,P.on+0.3,0.5)*(1-ag_in(tt,sc.dur-1.2,0.4))});}}]);});

/* ---------------------------------------------------------------- 5 · One identity at the files */
const NW_END5={head:1,rooms:[1,1,1],m:1,lit:1,chips:[1,1,1],chipsA:1,pl:1,link:1,linkW:4,locs:1,store:1,storeLit:[1,1,1,1,1],doors:[1,1,1,1],shut:[1,1,1,1],net:1,netLabel:0,priv:[1,1,1]};
scene("files",(ctx,S,t,sc)=>{const c=sc.cues,P=nw_once(sc,"P",()=>({pub:wAt(sc,"public","public access off"),pe:wAt(sc,"public","its own private endpoints"),ko:wAt(sc,"keysoff","its account keys"),
    ref:wAt(sc,"keysoff","refuses anything"),noth:wAt(sc,"nothing","open nothing"),rg:wAt(sc,"roles","roles go"),thru:wAt(sc,"roles","through the catalog"),grp:wAt(sc,"roles","their group's grants"),
    own:wAt(sc,"one","the catalog's own"),conn:wAt(sc,"one","its access connector"),nosec:wAt(sc,"azure","no secret anyone holds"),cred:wAt(sc,"credential","a storage credential"),
    ext:wAt(sc,"credential","an external location"),thru2:wAt(sc,"every","through the catalog"),chk:wAt(sc,"every","checks the grant"),mask:wAt(sc,"every","the masks"),filt:wAt(sc,"every","filters"),
    rt:wAt(sc,"rome","Rome's tanks")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"nwHall",keys:[[0,960,540,1]],push:0.004,draw:(x,tt)=>{
    const out4=ag_in(tt,c.now+0.2,0.6),chk=[ag_in(tt,P.chk,0.4),ag_in(tt,P.mask,0.4),ag_in(tt,P.filt,0.4)];
    nw_base(x,tt,Object.assign({},NW_END4,{netLabel:1-out4,jobs:1-out4,build:1-out4,cloud:1-out4,allowA:1-out4,inet:1-ag_in(tt,P.pub+0.8,0.6),shut:[1,1,1,ag_in(tt,P.pub+0.3,0.6)],
      lit:lerp(0.5,1,ag_in(tt,P.thru2,0.6)),chips:chk,chipsA:ag_in(tt,P.thru2,0.5),linkW:lerp(3,4,ag_in(tt,P.conn,0.5)),locs:clamp((tt-P.ext)/1.2,0,1)}));
    // the nine ways come back, and close: the keys and the link refused, the six roles gone
    const back=ag_in(tt,c.now+0.4,0.6),rev=[ag_in(tt,P.noth,0.5),ag_in(tt,P.noth+0.3,0.5),ag_in(tt,P.noth+0.6,0.5)],n=tt<P.noth+0.9?9:tt<P.rg+0.4?6:Math.round(6*(1-clamp((tt-P.rg-0.4)/0.9,0,1)));
    nw_ways(x,{a:back,k:[1,1,1],rev,c:[1,1,1,1,1,1],green:ag_in(tt,P.thru,0.8),n,nA:1});
    if(tt>P.thru)dp_link(x,[624,740],[640,606],"green",ag_sine((tt-P.thru-0.4)/0.6),{lw:2.6});
    dp_pill(x,70,846,"Through the catalog, under their group's grants","green",{size:28,a:ag_in(tt,P.grp,0.5)});
    // the tools' pages at the top right, one at a time
    const pg=(t0,t1)=>ag_in(tt,t0,0.45)*(1-ag_in(tt,t1,0.4)),PX=1140,PY=96,PW=750,PH=344;
    nw_pg(x,PX,PY,PW,PH,{tool:"azure",name:"Microsoft Azure",where:"unidataprod › Networking",title:"Networking"},pg(P.pub+0.6,P.ko-0.3),(c2,b)=>{
      dp_field(c2,b.x,b.y+30,"Public network access","Disabled",{col:"coral"});dp_T(c2,"Private endpoints",b.x+360,b.y+30,{w:600,size:28,col:"mut"});
      dp_pill(c2,b.x+360,b.y+84,"dfs · Approved","green",{size:28,a:ag_in(tt,P.pe,0.4),glow:8});dp_pill(c2,b.x+360,b.y+140,"blob · Approved","green",{size:28,a:ag_in(tt,P.pe+0.3,0.4),glow:8});});
    nw_pg(x,PX,PY,PW,PH,{tool:"azure",name:"Microsoft Azure",where:"unidataprod › Configuration",title:"Configuration"},pg(P.ko+0.2,P.rg-0.4),(c2,b)=>{
      dp_T(c2,"Allow storage account key access",b.x,b.y+30,{w:600,size:28,col:"mut"});const u=ag_in(tt,P.ko+0.8,0.6);dp_switch(c2,b.x,b.y+54,1-u,{col:"coral"});
      nw_swap(c2,"Enabled","Disabled",b.x+92,b.y+84,u,{w:600,size:28});dp_pill(c2,b.x,b.y+150,"Anything signed with a key: refused","coral",{size:28,a:ag_in(tt,P.ref,0.5),glow:10});});
    nw_pg(x,PX,PY,PW,PH,{tool:"azure",name:"Microsoft Azure",where:"unidataprod › Access control",title:"Storage Blob Data Contributor"},pg(P.rg-0.2,P.cred-0.4),(c2,b)=>{
      // the six people's row goes; then, in its place, the catalog's own identity
      const six=1-ag_in(tt,P.rg+0.4,0.5),mi=ag_in(tt,P.own,0.5);dp_rows(c2,b.x,b.y,[{t:"Name",w:400},{t:"Type",w:286}],[[{t:"Six people",a:six},{pill:"User",a:six}]],{lh:56,line:false});
      if(mi>0)dp_rows(c2,b.x,b.y,[{t:"",w:400},{t:"",w:286}],[[{mono:true,t:"catalog-connector-prod",a:mi},{pill:"Managed identity",col:"cyan",a:mi}]],{lh:56,line:false});
      dp_pill(c2,b.x,b.y+150,"No secret anyone holds","green",{size:28,a:ag_in(tt,P.nosec,0.5),glow:8});});
    dp_tag(x,1086,736,"Access connector","cyan",{a:ag_in(tt,P.conn,0.5)*(1-ag_in(tt,P.thru2-0.6,0.4)),to:[1425,NW_H.tank.y+NW_H.tank.h/2],p:ag_sine((tt-P.conn-0.3)/0.5)});
    nw_pg(x,PX,PY,PW,PH,{tool:"databricks",name:"Catalog Explorer",where:"External data",title:"Storage credential"},pg(P.cred,P.rt-0.6),(c2,b)=>{
      dp_rows(c2,b.x,b.y,[{t:"Name",w:400},{t:"Type",w:286}],[[{mono:true,t:"catalog_connector_prod"},{pill:"Managed identity",col:"cyan"}]],{lh:56});
      dp_T(c2,"External locations: one for each area",b.x,b.y+152,{w:600,size:28,a:ag_in(tt,P.ext,0.5)});});
    // every read through the catalog: a light from production, through the tank, its checks lit, into the files
    {const u=clamp((tt-P.thru2)/2.6,0,1);if(u>0&&u<1){const T=NW_H.tank,pts=[[900,606],[T.x+T.w/2,T.y+T.h/2],[1600,626]],q=u<0.5?ag_sine(u*2):ag_sine(u*2-1),i=u<0.5?0:1,
      px=lerp(pts[i][0],pts[i+1][0],q),py=lerp(pts[i][1],pts[i+1][1],q);withA(x,Math.min(1,Math.sin(Math.PI*u)*2),()=>{dp_halo(x,px,py,40,"cyan",0.6);x.fillStyle=rgba(dp_f("cyan"),1);x.beginPath();x.arc(px,py,8,0,TAU);x.fill();});}}
    // like Rome's tanks: the one place to draw
    nw_pip(x,"nwTank",[560,150,980,650],1240,100,560,ag_in(tt,P.rt,0.6)*(1-ag_in(tt,sc.dur-1.4,0.5)),c2=>nw_atTank(c2,tt,{grant:1,records:5}));}}]);});

/* ---------------------------------------------------------------- 6 · Each catalog in its own workspace */
// the catalogs, a card for each workspace's, beside its room
const NW_CC=[{y:124,kick:"Development's catalogs",sub:"five, each ending _dev"},{y:326,kick:"Test's catalogs",sub:"five, each ending _test"},{y:528,kick:"Production's catalogs",sub:"registrar, learning, planning, hr, finance"}];
const NW_END6=Object.assign({},NW_END5,{net:0,priv:[0,0,0]});
scene("walls",(ctx,S,t,sc)=>{const c=sc.cues,P=nw_once(sc,"P",()=>({def:wAt(sc,"default","every workspace reaches"),nb:wAt(sc,"dev","a notebook in development"),real:wAt(sc,"dev","production's real records"),
    binds:wAt(sc,"binds","binds each catalog"),alone:wAt(sc,"five","production alone"),tt:wAt(sc,"others","test's to test"),dd:wAt(sc,"others","development's to development"),
    same:wAt(sc,"same","bound the same way"),ge:wAt(sc,"grant","a grant isn't enough"),there:wAt(sc,"grant","a catalog isn't there")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"nwHall",keys:[[0,960,540,1]],push:0.004,draw:(x,tt)=>{
    const gone=ag_in(tt,c.wall+0.2,0.6);
    nw_base(x,tt,Object.assign({},NW_END5,{net:1-gone,priv:[1-gone,1-gone,1-gone],notes:[{note:"A notebook, with a grant",noteA:ag_in(tt,P.nb,0.5)*(1-ag_in(tt,sc.dur-1.4,0.5)),
      note2:"registrar isn't here",note2Col:"coral",note2A:ag_in(tt,P.there,0.5)*(1-ag_in(tt,sc.dur-1.4,0.5))},{},{}]}));
    nw_ways(x,{a:1-gone,k:[1,1,1],rev:[1,1,1],c:[1,1,1,1,1,1],green:1,n:0,nA:1});dp_pill(x,70,846,"Through the catalog, under their group's grants","green",{size:28,a:1-gone});
    withA(x,1-gone,()=>dp_link(x,[624,740],[640,606],"green",1,{lw:2.6}));
    // every workspace reaches every catalog, until each is bound to its own
    const cut=ag_in(tt,P.binds+0.6,0.8),ok=[ag_in(tt,P.dd,0.5),ag_in(tt,P.tt,0.5),ag_in(tt,P.alone,0.5)];
    NW_CC.forEach((k,i)=>{const cy=k.y+66;for(let j=0;j<3;j++){const ry=NW_H.rooms[j].y+86,p=ag_sine((tt-P.def-0.5-0.12*(i*3+j))/0.8);if(p<=0)continue;
      if(i===j){dp_link(x,[580,cy],[700,ry],"grey",p,{lw:2.4,dot:false,alpha:1-ok[i]});if(ok[i]>0)dp_link(x,[580,cy],[700,ry],"green",1,{lw:3,dot:false,alpha:ok[i]});}
      else{const bad=i===2&&j===0?ag_in(tt,P.real,0.5):0;dp_link(x,[580,cy],[700,ry],"grey",p,{lw:2,dot:false,alpha:(1-bad)*(1-cut)*0.85});if(bad>0)dp_link(x,[580,cy],[700,ry],"coral",1,{lw:3,dot:false,alpha:bad*(1-cut)});}}
      nw_cardAt(x,tt,P.def+i*0.2,null,60,k.y,520,{kick:k.kick,sub:k.sub},i===2?"cyan":"grey");});
    dp_tag(x,1110,172,"Production's real records","coral",{a:ag_in(tt,P.real,0.5)*(1-ag_in(tt,P.binds-0.2,0.4))});
    // the binding, in Catalog Explorer: registrar to production alone
    nw_pg(x,1140,96,750,344,{tool:"databricks",name:"Catalog Explorer",where:"registrar › Workspaces",title:"Workspaces"},ag_in(tt,P.binds,0.45)*(1-ag_in(tt,P.same-0.3,0.4)),(c2,b)=>{
      const u=ag_in(tt,P.binds+0.7,0.6);dp_switch(c2,b.x,b.y+10,1-u,{col:"grey",label:"All workspaces have access"});
      dp_rows(c2,b.x,b.y+64,[{t:"Workspace",w:360},{t:"Access",w:300}],[["production",{pill:"Read & Write",col:"green"}]].map(r=>r.map(cl=>typeof cl==="string"?{t:cl,a:ag_in(tt,P.alone,0.5)}:Object.assign({},cl,{a:ag_in(tt,P.alone,0.5)}))),{lh:56});});
    nw_cardAt(x,tt,P.same,P.ge-0.3,1140,110,600,{kick:"Bound the same way",title:"The storage credential",sub:"and the external locations: production only"},"green");
    nw_cardAt(x,tt,P.ge,sc.dur-1.4,1140,110,600,{kick:"From development",title:"A grant isn't enough",sub:"registrar isn't there"},"coral");}}]);});

/* ---------------------------------------------------------------- 7 · The door you switch on */
const NW_END7=Object.assign({},NW_END5,{net:1,netLabel:1,priv:[1,1,1],admin:{a:1,glow:0,open:0,lock:1}});
scene("switch",(ctx,S,t,sc)=>{const c=sc.cues,P=nw_once(sc,"P",()=>({door:wAt(sc,"shut","one more door"),stays:wAt(sc,"shut","it stays shut"),load:wAt(sc,"morning","the nightly load stops"),
    jun:wAt(sc,"morning","Jun Park"),grp:wAt(sc,"group","one group"),rl:wAt(sc,"group","read and list"),empty:wAt(sc,"empty","no one is in it"),on:wAt(sc,"on","switches on"),
    reason:wAt(sc,"on","with a reason"),appr:wAt(sc,"on","Sam approves"),pp:wAt(sc,"reads","the private path"),one:wAt(sc,"reads","reads that one file"),off:wAt(sc,"reads","switches off"),log:wAt(sc,"log","own log"),
    alert:wAt(sc,"log","an alert"),itself:wAt(sc,"forgot","shut by itself"),before:wAt(sc,"gangs","written down before"),rec:wAt(sc,"gangs","recorded as it's done")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"nwHall",keys:[[0,960,540,1]],push:0.004,draw:(x,tt)=>{
    const gone=ag_in(tt,c.shut+0.1,0.6),back=ag_in(tt,c.needs,0.6),open=ag_in(tt,P.pp+1.2,0.4)*(1-ag_in(tt,P.off,0.5)),glow=ag_in(tt,P.appr+0.4,0.6)*(1-ag_in(tt,P.off+0.2,0.6)),
      fin=1-ag_in(tt,sc.dur-1.2,0.5);
    nw_base(x,tt,Object.assign({},NW_END6,{net:back,netLabel:1,priv:[back,back,back],admin:{a:ag_in(tt,P.door,0.6),glow,open,lock:ag_in(tt,P.stays,0.5)*(1-open)},
      storeLit:[1+ag_in(tt,P.one,0.4)*(1-ag_in(tt,P.off,0.5)),1,1,1,1],notes:[{},{},{note:"Nightly load: stopped",noteCol:"coral",noteA:ag_in(tt,P.load,0.5)*fin}]}));
    // the catalogs' cards leave
    NW_CC.forEach((k,i)=>{const cy=k.y+66,ry=NW_H.rooms[i].y+86;dp_link(x,[580,cy],[700,ry],"green",1,{lw:3,dot:false,alpha:1-gone});dp_card(x,60,k.y,520,{kick:k.kick,sub:k.sub},{col:i===2?"cyan":"grey",a:1-gone});});
    // Jun, in the university's network; then, raised, in by the private path to the door, and out again
    const ja=nw_fade(tt,P.jun-0.3,sc.dur-1.3,0.5);nw_who(x,"jun",340,740,0.68,{t:tt,gaze:[3,0],a:ja});nw_name(x,80,420,"Jun Park","",ja*(1-ag_in(tt,P.on,0.4)));
    {const p=ag_sine((tt-P.pp)/1.2),pa=1-ag_in(tt,P.off+0.4,0.6);if(p>0&&pa>0){withA(x,pa,()=>{dp_link(x,[650,505],[1100,505],"amber",clamp(p*2,0,1),{lw:3,dot:false});if(p>0.5)dp_link(x,[1100,505],[1440,538],"amber",clamp(p*2-1,0,1),{lw:3});});}}
    // the group for admin accounts: one role, no one in it
    nw_cardAt(x,tt,P.grp,P.log-0.5,1140,110,750,{kick:"admin_storage_readers",title:"Storage Blob Data Reader",sub:"read and list, nothing more"},"amber");
    dp_pill(x,1860,168,"No one in it","grey",{size:28,align:"right",a:ag_in(tt,P.empty,0.5)*(1-ag_in(tt,P.on,0.4)),glow:8});
    dp_link(x,[1480,328],[1450,494],"amber",ag_sine((tt-P.grp-0.5)/0.6)*(1-ag_in(tt,P.log-0.5,0.4)),{lw:2.2});
    // the power switched on: one hour, a reason, approved; then off
    nw_cardAt(x,tt,P.on,sc.dur-1.2,60,110,560,{kick:"Power switched on",title:"Jun Park (admin)",sub:"Read the storage for one hour"},"amber");
    dp_pill(x,70,344,"A reason given","grey",{size:28,a:ag_in(tt,P.reason,0.5)*fin,glow:8});dp_pill(x,300,344,"Switched off","grey",{size:28,a:ag_in(tt,P.off+0.3,0.5)*fin,glow:8});
    dp_pill(x,70,400,"Approved by Sam Okafor","green",{size:28,a:ag_in(tt,P.appr,0.5)*fin,glow:8});
    // the hour, running out by itself
    {const u=clamp((tt-P.itself+0.4)/1.6,0,1),a=ag_in(tt,P.itself-0.4,0.4)*fin;if(a>0)withA(x,a,()=>{x.save();x.strokeStyle=rgba(dp_f("amber"),0.25);x.lineWidth=6;x.beginPath();x.arc(560,190,32,0,TAU);x.stroke();
      x.strokeStyle=rgba(dp_f("amber"),1);x.shadowColor=rgba(dp_f("amber"),0.8);x.shadowBlur=10;x.beginPath();x.arc(560,190,32,-Math.PI/2,-Math.PI/2+TAU*(1-u));x.stroke();x.restore();if(u>=1)dp_lock(x,560,196,26,"coral",0);});}
    // the storage's own log, and the alert
    nw_cardAt(x,tt,P.log,sc.dur-1.2,1140,110,750,{kick:"The storage's own log",title:"Read · Jun Park (admin)",sub:"last night's file, registrar"},"grey");
    dp_pill(x,1170,384,"Alert: to the platform team","amber",{size:28,a:ag_in(tt,P.alert,0.5)*fin});
    // written down before, recorded as it's done
    dp_tag(x,70,424,"Written down before","grey",{size:28,a:ag_in(tt,P.before,0.5)*fin});dp_tag(x,1170,420,"Recorded as it's done","grey",{size:28,a:ag_in(tt,P.rec,0.5)*fin});}}]);});

/* ---------------------------------------------------------------- 8 · The university's own key */
scene("key",(ctx,S,t,sc)=>{const c=sc.cues,P=nw_once(sc,"P",()=>({enc:wAt(sc,"always","always encrypted"),prov:wAt(sc,"always","the cloud provider kept"),uown:wAt(sc,"own","the university's own"),
    vlt:wAt(sc,"own","a vault"),use:wAt(sc,"use","use the key"),del:wAt(sc,"cant","can't delete it"),ver:wAt(sc,"version","a new version"),kept:wAt(sc,"deleted","kept ninety days"),
    nb:wAt(sc,"workspace","notebooks"),back:wAt(sc,"back","take the key back"),nob:wAt(sc,"nobody","nobody can read")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"nwHall",keys:[[0,960,540,1]],push:0.004,draw:(x,tt)=>{
    const vk1=ag_in(tt,P.vlt+0.4,0.5),gone=ag_in(tt,P.nob,0.8);
    nw_base(x,tt,Object.assign({},NW_END7,{admin:{a:1,glow:0,open:0,lock:1},enc:ag_in(tt,P.enc,0.6),vault:ag_in(tt,P.vlt-0.4,0.6),vk:[ag_in(tt,P.nb,0.5),vk1],vkRev:ag_in(tt,P.back+0.4,0.6),
      vkLine:[ag_sine((tt-P.nb-0.4)/0.7),ag_sine((tt-P.use)/0.5)*(1-0.6*gone)],rows:[0,1,2,3,4].map(()=>1-0.6*gone),out:gone}));
    // the cards of this chapter, one at a time, in the left column
    const L=(t0,t1,w,col)=>nw_cardAt(x,tt,t0,t1,60,300,560,w,col);
    {const a=ag_in(tt,P.enc+0.4,0.5)*(1-ag_in(tt,P.uown,0.4));if(a>0)dp_sealed(x,60,300,560,"Microsoft-managed keys",{sub:"kept by the cloud provider",a});}
    L(P.use,P.del-0.3,{kick:"The storage",title:"Uses the key",sub:"never takes it out"},"cyan");
    L(P.del,P.ver-0.3,{kick:"The platform team",title:"Can't delete it or turn it off",sub:"every use is recorded"},"coral");
    L(P.ver,P.kept-0.3,{kick:"A new version every year",title:"Picked up within a day"},"grey");
    L(P.kept,P.nb-0.3,{kick:"A deleted key",title:"Kept ninety days",sub:"nobody can cut that short"},"grey");
    L(P.nb,P.back-0.3,{kick:"The workspace",title:"Notebooks, queries, disks",sub:"a key from the same vault"},"cyan");
    L(P.back,null,{kick:"If it's taken back",title:"Nobody can read the files",sub:"the cloud provider included"},"coral");
    // the vault makes a new version: a ring of light round the storage's key
    {const u=clamp((tt-P.ver-0.3)/1.2,0,1);if(u>0&&u<1){const k=NW_VK[1];withA(x,Math.sin(Math.PI*u),()=>{x.save();x.strokeStyle=rgba(dp_f("cyan"),1);x.shadowColor=rgba(dp_f("cyan"),0.9);x.shadowBlur=14;x.lineWidth=3;rr(x,k.x-6-10*u,k.y-6-10*u,k.w+12+20*u,108+20*u,22);x.stroke();x.restore();});}}}}]);});

/* ---------------------------------------------------------------- 9 · Only through the catalog */
const NW_ALL={head:1,rooms:[1,1,1],m:1,lit:1,chips:[1,1,1],chipsA:1,pl:1,link:1,linkW:4,locs:1,store:1,storeLit:[1,1,1,1,1],doors:[1,1,1,1],shut:[1,1,1,1],net:1,netLabel:1,priv:[1,1,1],
  cloud:1,allow:[1,0],vault:1,vk:[1,1],vkLine:[1,1],enc:1,admin:{a:1,glow:0,open:0,lock:1}};
scene("end",(ctx,S,t,sc)=>{const c=sc.cues,P=nw_once(sc,"P",()=>({noz:wAt(sc,"rome","a stamped nozzle"),wr:wAt(sc,"rome","written down"),thru:wAt(sc,"uni","only through the catalog"),
    pd:wAt(sc,"doors","private doors"),sl:wAt(sc,"doors","a short list out"),key:wAt(sc,"doors","a key"),sw:wAt(sc,"one","switched on"),wat:wAt(sc,"one","watched")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Rome, the tank: drawn only there, through the stamped nozzle; the gangs' work written down
    {at:0,place:"nwTank",keys:[[0,1040,500,1.07],[c.uni-0.4,960,520,1.03]],push:0.01,draw:(x,tt)=>{nw_atTank(x,tt,{uses:[1,1,1],grant:1,records:5});
      nw_folk(x,"frontinus",300,720,0.78,{t:tt,pose:"hold",hold:(c2,h)=>nw_heldTablet(c2,h),gaze:[3,0]});
      nw_nozzleClose(x,1380,100,{a:ag_in(tt,P.noz,0.5),k:ag_spr(tt,P.noz)});
      dp_tag(x,600,108,"Written down","grey",{a:ag_in(tt,P.wr,0.5),to:[NW_TK.shelf[0]+130,NW_TK.shelf[1]+30],p:ag_sine((tt-P.wr-0.2)/0.6)});}},
    // the university: the files only through the catalog, behind private doors, a short list out, a key of its own; one door switched on
    // under the end card, the hall fades away, so none of its words sit under the card's
    {at:c.uni-0.2,place:"nwHall",keys:[[c.uni,960,540,1]],push:0.006,draw:(x,tt)=>{const g=ag_in(tt,P.sw,0.6)*(1-ag_in(tt,P.wat+0.6,0.8));
      withA(x,1-ag_in(tt,c.takeaway+0.3,1.0),()=>{nw_base(x,tt,Object.assign({},NW_ALL,{admin:{a:1,glow:g,open:0,lock:1-g}}));
      dp_pill(x,1265,846,"Only through the catalog","green",{size:28,align:"center",a:ag_in(tt,P.thru,0.5)});
      dp_pill(x,330,470,"Private doors","green",{size:28,align:"center",a:ag_in(tt,P.pd,0.5)});
      dp_pill(x,1290,110,"A short list out","green",{size:28,align:"center",a:ag_in(tt,P.sl,0.5)});
      dp_pill(x,1440,420,"A key of its own","green",{size:28,align:"right",a:ag_in(tt,P.key,0.5)});});}}
  ],0.8);
  nw_where(ctx,S,"Rome · 97",1-ag_in(t,c.uni-0.2,0.6));
  nw_end(ctx,S,t,c.takeaway+0.3,["No path to the data skips the catalog,","except the one you switch on and watch."],"From a branch to production");});

// the platform's chapters open where the one before ends, in the hall: the camera glides on, and only what changes fades
ag_cutInto(["paths","files","walls","switch","key"]);
