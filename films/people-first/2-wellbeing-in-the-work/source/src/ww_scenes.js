/* ===== Wellbeing is in the work: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Sizes in the 1920 x 1080 frame. */

const WW_LAST="Fix the work before you ask people to cope.";
// the film's number and title at the top left, from the second chapter on
function ww_kick(ctx,S,a,o){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"2","Wellbeing is in the work",Object.assign({a},o||{}));}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options. The line above the title isn't
// wrapped, so the sheet is made at least as wide as that line is drawn
function ww_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  if(words.kick)w=Math.max(w,Math.ceil(lp_tw(ctx,String(words.kick).toUpperCase(),{w:800,size:28,ls:3}))+LP_PAD*2);
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const ww_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function ww_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 (and goes at t1)
function ww_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// a list (ww_list) that springs in at t0 and goes from o.out; it returns the list's box even before it shows
function ww_listAt(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);return ww_list(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// people crossing the bridge o: each [where they start, how fast, who, which way]; they step on at one base and off at the other
function ww_cross(ctx,tt,o,list){for(const [u0,sp,who,back] of list){const u=u0+sp*tt;if(u<=0.02||u>=0.98)continue;const p=ww_deck(u,o);
  ww_fig(ctx,p[0],p[1],50,{who,pose:"walk",t:tt+u0*9,flip:!!back,shadow:0,a:clamp(Math.min(u-0.02,0.98-u)/0.03,0,1)});}}
// people on the banks: a few families by each base (n on each side), or the many who come for the renewal (o.many)
function ww_banks(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const L=WW_BANK.L,R=WW_BANK.R;ctx.save();ctx.globalAlpha*=a;
  if(o.many){for(let i=0;i<8;i++)ww_fig(ctx,L.x0+24+i*44,L.y+6+(i%2)*5,50,{who:[1,3,5,7,0,2][i%6],pose:i%3===2?"stand":"sit",flip:i%2===1});
    for(let i=0;i<5;i++)ww_fig(ctx,L.x0+318+i*18-(i%2)*6,L.y-3+(i%3)*3,49,{who:[0,2,4,6][i%4],pose:"stand",flip:i%2===0});
    for(let i=0;i<9;i++)ww_fig(ctx,R.x0+16+i*40,R.y+4+(i%2)*5,50,{who:i,pose:i%4===0?"sit":"stand",flip:i%3!==0});}
  else{ww_fig(ctx,L.x0+250,L.y+4,50,{who:1,pose:"stand"});ww_fig(ctx,L.x0+290,L.y+7,50,{who:4,pose:"stand"});ww_fig(ctx,R.x0+70,R.y+5,50,{who:3,pose:"stand",flip:true});}
  ctx.restore();}

/* ---------------------------------------------------------------- 1. Before it falls: Quehue, Peru */
scene("bridge",(ctx,S,t,sc)=>{const c=sc.cues;
  const rainT=wAt(sc,"wears","rain",-0.2),windT=wAt(sc,"wears","wind",-0.2),fellT=wAt(sc,"fell","fell",-0.1),b0=c.custom+0.5,pileT=wAt(sc,"team","arranged",-0.2),renT=wAt(sc,"look","date",-0.3);
  // the bridge by the story's own clock: years since it was last made new, how much of its floor is gone, how low one handrail hangs
  const age=tt=>ag_keys(tt,[[c.wears,0.1],[c.sag+1.4,0.42],[c.holds+2,0.5],[c.missed+0.2,1.0],[fellT,1.75]]),
    wear=tt=>ag_keys(tt,[[c.wears,0],[c.sag+1.4,0.5],[c.missed+0.2,0.62],[fellT,0.86]]),low=tt=>ag_keys(tt,[[c.wears,0],[c.sag+1.4,12],[fellT,18]]),
    wind=tt=>ag_io(tt,windT,c.sag+0.4,0.8)+0.5*ag_io(tt,c.missed+1.2,fellT-0.2,0.8),rain=tt=>ag_io(tt,rainT,windT+0.9,0.7)+0.8*ag_io(tt,c.missed+0.6,fellT+1.4,0.8);
  const old=tt=>{const a=age(tt);return{age:a,wear:wear(tt),extra:{r1:low(tt)},sag:ww_sag(a)+2.6*Math.sin(tt*1.7)*wind(tt)};};
  // people crossing: each [where they start, how fast, who, which way]; they step on at one base and off at the other
  const cross=(x,tt,o,list)=>{for(const [u0,sp,who,back] of list){const u=u0+sp*tt;if(u<=0.02||u>=0.98)continue;const p=ww_deck(u,o);
    ww_fig(x,p[0],p[1],50,{who,pose:"walk",t:tt+u0*9,flip:!!back,shadow:0,a:clamp(Math.min(u-0.02,0.98-u)/0.03,0,1)});}};
  // the worn bridge, and one person crossing it while it still carries: across and gone before 2020
  const worn=(x,tt)=>{const o=old(tt),k=clamp((tt-fellT)/0.95,0,1);if(k<=0)ww_bridge(x,Object.assign({mid:m=>cross(m,tt-(c.sag-2.4),o,[[0.02,0.0566,2,false]])},o));else ww_fall(x,o,k);
    ww_fallen(x,{age:1.75,k:0.22*ag_in(tt,fellT+2,8),a:ag_in(tt,fellT+0.5,0.6)});ww_ends(x,{age:1.75,a:ag_in(tt,fellT+0.55,0.5)});ww_weather(x,tt,{rain:rain(tt),wind:wind(tt)});};
  ag_shots(ctx,S,t,sc.dur,[
    // the bridge, new, on a dry day: where, who, since when
    {at:0,place:"wwGorge",keys:[[0,960,470,1.3],[0.3,960,540,1.0]],d:4.4,push:0,draw:(x,tt)=>{const o={age:0.1};
      ww_banks(x,{});ww_bridge(x,Object.assign({mid:m=>cross(m,tt,o,[[0.2,0.04,0,false],[0.3,0.04,3,false],[0.86,-0.036,4,true]])},o));
      ww_sheet(x,tt,wAt(sc,"where","Quehue",-0.2),90,56,560,{kick:"The Andes of Peru",title:"Quehue",sub:"A bridge of grass rope over the Apurímac"},{light:null,pin:false,out:c.wears-0.6});
      // how high it hangs: from the floor's middle down to the water
      const ha=ag_io(tt,wAt(sc,"where","fifteen",-0.2),c.who-0.3,0.5);if(ha>0.004){const p=ww_deck(0.5,o);x.save();x.globalAlpha*=ha;x.setLineDash([10,8]);x.strokeStyle=rgba(LP.paper,0.95);x.lineWidth=3;x.lineCap="butt";
        x.beginPath();x.moveTo(p[0],p[1]+12);x.lineTo(p[0],846);x.moveTo(p[0]-16,846);x.lineTo(p[0]+16,846);x.stroke();x.restore();
        lp_tag(x,p[0]+28,690,"About 15 metres",{col:LP.ink,a:ha});}
      ww_sheet(x,tt,wAt(sc,"who","Four",-0.2),1270,40,560,{kick:"Four communities",lines:["Huinchiri","Chaupibanda","Choccayhua","Ccollana Quehue"]},{light:null,pin:false,out:c.wears-0.6,u:ag_in(tt,wAt(sc,"who","Four",0.1),1.6)});
      ww_tag(x,tt,wAt(sc,"since","account",-0.3),c.wears-0.6,960,650,"By their own account: since the time of the Incas",{align:"center",col:LP.ink});}},
    // a year of weather: the sky turns, the rope loosens, the floor thins; then, from far off again, the year it was not renewed, and the fall
    {at:rainT-0.5,place:"wwGorgeGrey",keys:[[rainT-0.5,960,540,1.0],[c.sag-0.2,960,500,1.75],[c.missed-3.6,960,540,1.0]],d:3.0,dis:1.6,push:0,draw:(x,tt)=>{worn(x,tt);
      // where the floor hung when it was new, as a pale dashed line
      const da=ag_io(tt,c.sag+0.3,c.missed-3.4,0.6);if(da>0.004){const P=ww_span("f0",0,1,{age:0});x.save();x.globalAlpha*=da;x.setLineDash([9,7]);x.strokeStyle="rgba(250,247,240,0.9)";x.lineWidth=2.2;x.beginPath();P.forEach((p,k)=>k?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();x.restore();}
      ww_tag(x,tt,c.missed-0.1,c.custom-0.6,480,120,"June 2019: made new",{align:"center",col:LP.green});
      ww_tag(x,tt,wAt(sc,"missed","twenty",-0.1),c.custom-0.6,960,120,"2020: not renewed",{align:"center",col:LP.amber});
      ww_tag(x,tt,wAt(sc,"fell","March",-0.1),c.custom-0.6,1440,120,"March 2021: it fell",{align:"center",col:LP.amber});
      ww_sheet(x,tt,wAt(sc,"need","need",-0.3),620,190,680,{kick:"What people who cross need",title:"Rope renewed before it fails",sub:"Not repaired after"},{light:null,pin:false,out:c.custom-0.6});}},
    // the custom: on a date, the whole bridge made new, by about a thousand people in three days
    {at:c.custom-0.3,place:"wwGorge",later:true,dis:0.8,keys:[[c.custom-0.3,960,540,1.0]],push:0.02,draw:(x,tt)=>{const s0=c.three-0.6;
      const tie=0.5*ag_in(tt,s0,3.0),fl=0.5*ag_in(tt,s0+0.7,3.0),mt=0.5*ag_in(tt,s0+2.6,2.2),done=tt>s0+4.9,
        o={age:0,f:[0,1,2,3].map(k=>ag_sine(ag_in(tt,b0+k*0.5,2.2))),r:[0,1].map(k=>ag_sine(ag_in(tt,b0+2.4+k*0.5,2.0))),ties:[tie,tie],floor:[fl,fl],mat:[mt,mt]};
      ww_banks(x,{many:1,a:ag_in(tt,c.custom,0.8)});
      ww_bridge(x,Object.assign({mid:m=>{if(done){cross(m,tt-s0-4.9,o,[[0.02,0.05,1,false],[-0.06,0.05,6,false],[0.98,-0.045,5,true]]);return;}
        // the two builders, each at his own bank's end of the work, as the sides are tied on
        if(tie>0.01&&tie<0.5)for(const [u,fp,who] of [[Math.max(0.04,tie-0.02),false,0],[Math.min(0.96,1-tie+0.02),true,2]]){const p=ww_deck(u,o);ww_fig(m,p[0],p[1],50,{who,pose:"astride",flip:fp,shadow:0,a:clamp(Math.min(tie/0.03,(0.5-tie)/0.03),0,1)});}}},o));
      ww_tag(x,tt,wAt(sc,"custom","date",-0.3),c.june-0.5,700,150,"Each year, on a date",{align:"center",col:LP.blue});
      ww_tag(x,tt,wAt(sc,"custom","whole",-0.2),c.june-0.5,1220,150,"The whole bridge, made new",{align:"center",col:LP.ink});
      ww_tag(x,tt,wAt(sc,"three","thousand",-0.3),c.june-0.5,960,230,"About a thousand people, in three days",{align:"center",col:LP.ink});
      ww_tag(x,tt,wAt(sc,"june","wove",-0.3),c.lasts-0.5,960,150,"June 2021: woven again, with their own means",{align:"center",col:LP.green});
      ww_tag(x,tt,wAt(sc,"june","foot",-0.3),c.lasts-0.5,960,650,"People cross it on foot today",{align:"center",col:LP.ink});
      ww_sheet(x,tt,wAt(sc,"lasts","rope",-0.3),300,120,600,{kick:"Its rope lasts",title:"A year or two"},{col:LP.amber,light:null,pin:false,out:c.team-0.5});
      ww_sheet(x,tt,wAt(sc,"lasts","account",-0.3),1020,120,600,{kick:"The bridge, by its people's account",title:"More than 500 years"},{col:LP.green,light:null,pin:false,out:c.team-0.5});}},
    // a team's work is arranged too: one desk, and what lands on it; renewed on a date, it is an order with dates
    {at:c.team-0.3,place:"lpRoom",keys:[[c.team-0.3,960,540,1.0]],dis:1.4,push:0,draw:(x,tt)=>{const ga=1-ag_in(tt,c.breath+0.2,0.8);x.save();x.globalAlpha*=ga;
      ww_desk(x,1180,800,{});
      for(let k=0;k<14;k++){const t0=pileT+k*0.2,u=ag_in(tt,t0,0.35);if(u<=0)continue;const [px,py,rot]=ww_pileAt(k,1330,770),[bx,by]=ww_blockAt(k,{x:868,y:420,dx:104,dy:96}),
          m=ag_sine(ag_in(tt,renT+0.3+(13-k)*0.07,0.9)),lift=Math.sin(Math.PI*m)*40;
        ww_req(x,lerp(px,bx,m),lerp(lerp(py-90,py,ag_eo(u)),by,m)-lift,{a:u,rot:rot*(1-m),urgent:ag_in(tt,wAt(sc,"team","wears",-0.2)+k*0.05,0.4)*(1-m),date:ag_in(tt,renT+1.5+k*0.05,0.4)});}
      ww_sheet(x,tt,wAt(sc,"team","arranged",-0.5),150,170,640,{kick:"A team's work is arranged too",lines:["How much lands at once","Who decides its order","Who is alone on it"]},{light:"day",u:ag_in(tt,wAt(sc,"team","arranged",0),2.4)});
      ww_tag(x,tt,wAt(sc,"shows","person",-0.4),c.look-0.3,1180,480,"The wear shows in a person",{align:"center",col:LP.amber});
      ww_tag(x,tt,renT,null,1180,310,"Renewed on a date",{align:"center",col:LP.blue});
      ww_pill(x,tt,wAt(sc,"look","well",-0.3),null,470,560,"People stay well",{col:LP.green});
      ww_pill(x,tt,wAt(sc,"look","done",-0.5),null,470,650,"The work gets done",{col:LP.green});x.restore();}}
  ]);
  // words over the close view, in the frame's own size
  setScreen(ctx,S);
  ww_tag(ctx,t,wAt(sc,"wears","sun",-0.2),c.sag-0.4,700,150,"Sun",{align:"center",col:LP.ink});ww_tag(ctx,t,rainT,c.sag-0.4,960,150,"Rain",{align:"center",col:LP.ink});ww_tag(ctx,t,windT,c.sag-0.4,1220,150,"Wind",{align:"center",col:LP.ink});
  ww_tag(ctx,t,c.sag+0.2,c.holds-0.3,960,150,"Five months after one renewal",{align:"center",col:LP.ink});
  ww_tag(ctx,t,wAt(sc,"sag","sagging",-0.2),c.holds-0.3,640,800,"Sagging in the middle",{align:"center",col:LP.amber});
  ww_tag(ctx,t,wAt(sc,"sag","handrail",-0.2),c.holds-0.3,1280,800,"One handrail lower than the other",{align:"center",col:LP.amber});
  ww_tag(ctx,t,wAt(sc,"holds","carries",-0.3),wAt(sc,"holds","Wait",-0.3),960,150,"It still carries people",{align:"center",col:LP.ink});
  ww_tag(ctx,t,wAt(sc,"holds","Wait",0),c.missed-0.5,960,150,"Wait until it can't: the sign is a fall",{align:"center",col:LP.amber});
  lp_title(ctx,S,t,c.breath+0.2,"Wellbeing is in the work","Fix the work before you ask people to cope","Leading data people · People first");
});

/* ---------------------------------------------------------------- 2. Fourteen, all urgent */
scene("fourteen",(ctx,S,t,sc)=>{const c=sc.cues,dy={light:"day"};
  const gT=c.marta-0.2,dimT=wAt(sc,"marta","forty",0.3),mvT=wAt(sc,"marta","wait",-0.2),hopT=wAt(sc,"last","whoever",-0.1),ringT=wAt(sc,"work","work",-0.3);
  const G={x:470,y:216,dx:88,dy:78},B={x:560,y:616,dx:124,dy:96};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lpRoom",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
    // Helena, new this month
    lp_person(x,"helena",1650,670,0.95,{t:tt,flip:true,light:dy,a:ag_in(tt,0.3,0.9)});
    ww_sheet(x,tt,wAt(sc,"helena","Helena",-0.3),300,180,640,{kick:"February 2027",title:"Helena Novak",sub:"The new data manager"},{light:"day",out:c.marta-0.8});
    // Marta, beside the fourteen that wait on her
    const ma=ag_in(tt,wAt(sc,"marta","Marta",-0.6),0.7);lp_person(x,WW_MARTA,300,690,0.9,{t:tt,light:dy,a:ma});lp_nameTag(x,150,300,WW_MARTA,{a:ma});
    // the 46 open requests on the wall: the fourteen come down beside her, and the others go
    const rest=1-ag_in(tt,c.urgent-0.9,0.6),dim=ag_in(tt,dimT,0.6),hop=ag_sine(ag_in(tt,hopT,1.2));
    for(let i=0;i<46;i++){if(WW_MINE.indexOf(i)>=0)continue;const u=ag_in(tt,gT+i*0.016,0.3);if(u>0){const [gx,gy]=ww_gridAt(i,G);ww_req(x,gx,gy,{w:80,h:54,a:u*rest,dim});}}
    const one=(k,sl,al,lift)=>{const i=WW_MINE[k],u=ag_in(tt,gT+i*0.016,0.3)*al;if(u<=0)return;const [gx,gy]=ww_gridAt(i,G),m=ag_sine(ag_in(tt,mvT+k*0.06,1.1));
      ww_req(x,lerp(gx,sl[0],m),lerp(gy,sl[1],m)-lift,{w:lerp(80,96,m),h:lerp(54,64,m),a:u,urgent:ag_in(tt,c.urgent+0.3+k*0.07,0.4)});};
    // nobody decides their order: whoever asked last comes first, and every other one waits a place longer
    const slot=(k,d)=>{const p=ww_blockAt(k,B);return[p[0]+(d||0)*B.dx,p[1]];},mixp=(p,q,u)=>[lerp(p[0],q[0],u),lerp(p[1],q[1],u)];
    for(let k=0;k<13;k++){if(k===6){one(6,mixp(slot(6),slot(6,1),hop),1-hop,0);if(hop>0)one(6,mixp(slot(7,-1),slot(7),hop),hop,0);}else one(k,mixp(slot(k),slot(k+1),hop),1,0);}
    one(13,mixp(slot(13),slot(0),hop),1,Math.sin(Math.PI*hop)*80);
    // the work, ringed: where Helena looks first
    const ru=ag_sine(ag_in(tt,ringT,1.2));if(ru>0){const bx=B.x-72,by=B.y-58,bw=6*B.dx+144,bh=B.dy+116,len=2*(bw+bh);x.save();x.strokeStyle=rgba(LP.blue,1);x.lineWidth=6;x.lineJoin="round";x.setLineDash([len*ru,len]);rr(x,bx,by,bw,bh,22);x.stroke();x.restore();}
    ww_tag(x,tt,wAt(sc,"marta","forty",-0.2),c.urgent-0.9,954,150,"46 open requests",{align:"center",col:LP.orange});
    ww_tag(x,tt,mvT+0.9,c.urgent-0.2,932,512,"14 wait on one person",{align:"center",col:LP.amber});
    ww_tag(x,tt,c.urgent+0.3,c.last-0.2,932,512,"Each one called urgent",{align:"center",col:LP.amber});
    ww_tag(x,tt,c.last+0.3,c.cope-0.5,690,512,"Nobody decides their order",{align:"center",col:LP.amber});
    ww_tag(x,tt,hopT+0.2,c.cope-0.5,1180,512,"Whoever asked last comes first",{align:"center",col:LP.amber});
    ww_pill(x,tt,c.blame+0.1,c.cope-0.5,932,250,"Nobody is to blame",{col:LP.ink});
    ww_tag(x,tt,wAt(sc,"blame","eleven",-0.3),c.cope-0.5,932,340,"The requests came in 11 ways",{align:"center",col:LP.ink});
    ww_tag(x,tt,wAt(sc,"blame","see",-0.5),c.cope-0.5,932,420,"The people asking couldn't see each other's",{align:"center",col:LP.ink});
    ww_sheet(x,tt,c.cope+0.2,582,150,700,{kick:"Helena could ask Marta to cope",lines:["Plan better","Push back","Take a day off"]},
      {light:"day",u:ww_u(tt,[wAt(sc,"cope","plan",-0.2),wAt(sc,"cope","push",-0.2),wAt(sc,"cope","day",-0.4)]),out:c.work-0.4});
    ww_tag(x,tt,wAt(sc,"still","still",-0.3),c.work-0.4,932,512,"The fourteen would still be there",{align:"center",col:LP.amber});
    ww_pill(x,tt,wAt(sc,"work","before",-0.4),null,932,470,"The work, before the person",{col:LP.blue});}}]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.8,c.marta-0.7,0.5)});
  ww_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. One week, on one page */
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,mo={light:"morning"},us=ts=>ts.map(t0=>ag_in(t,t0,0.5));
  ag_shots(ctx,S,t,sc.dur,[
    // Marta's half-hour: the two of them at a table, with her inbox and her calendar
    {at:0,place:"wwOne",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      lp_person(x,WW_MARTA,620,690,0.95,{t:tt,cut:812,light:mo});lp_person(x,"helena",1300,690,0.95,{t:tt,flip:true,cut:812,light:mo});
      lp_table(x,360,820,1200);
      ww_sheet(x,tt,wAt(sc,"monday","Monday",-0.1),600,120,720,{kick:"Monday 8 February",title:"Marta's week, on one page"},{light:"morning"});
      ww_tag(x,tt,wAt(sc,"from","inbox",-0.3),null,960,420,"From her inbox",{align:"center",col:LP.ink});
      ww_tag(x,tt,wAt(sc,"from","calendar",-0.3),null,960,492,"From her calendar",{align:"center",col:LP.ink});
      ww_tag(x,tt,wAt(sc,"from","memory",-0.4),null,960,564,"Not from memory",{align:"center",col:LP.mut});}},
    // the page, line by line: what the work asks, what helps, and what researchers call the two sides
    {at:c.asks-0.4,place:"wwOne",later:true,dis:0.6,keys:[[c.asks-0.4,960,540,1.0]],push:0,draw:(x,tt)=>{const u1=t0=>ag_in(tt,t0,0.5);
      ww_weekPage(x,260,130,1400,{light:"morning",heads:[u1(wAt(sc,"asks","asks",-0.5)),u1(wAt(sc,"helps","helps",-0.5))],
        asks:[u1(wAt(sc,"asks","fourteen",-0.2)),u1(wAt(sc,"asks","urgent",-0.2)),u1(wAt(sc,"asks","order",-0.5)),u1(wAt(sc,"nine","nine",-0.2)),u1(wAt(sc,"sundays","Sundays",-0.5))],
        helps:[u1(wAt(sc,"helps","knows",-0.2)),u1(wAt(sc,"helps","Jun",-0.2))],jdr:[ag_in(tt,wAt(sc,"jdr","demands",-0.4),0.6),ag_in(tt,wAt(sc,"jdr","resources",-0.4),0.6)]});
      ww_pill(x,tt,wAt(sc,"both","arranged",-0.6),null,960,812,"Both are mostly in how the work is arranged",{col:LP.ink});}}
  ]);
  ww_kick(ctx,S,1,{light:"morning"});
});

/* ---------------------------------------------------------------- 4. Three things everyone needs */
scene("needs",(ctx,S,t,sc)=>{const c=sc.cues;
  const N=[["One","A say in it","say","No say in her order","say"],["Two","To be good at it","good","Good at it, and finishes little","good"],["Three","To belong","belong","Alone with the fourteen","alone"]];
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"wwOne",later:true,dis:0.6,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
    // the three needs, across the top for the whole chapter
    N.forEach(([k,title,wd],i)=>ww_sheet(x,tt,wAt(sc,"three",wd,-0.3),120+i*570,150,540,{kick:k,title},{light:"morning"}));
    // Marta's week, read against each of them
    const pa=ag_io(tt,c.marta-0.5,c.better-0.6,0.5);ww_miniPage(x,810,500,300,{a:pa,light:"morning",pin:false});
    N.forEach(([k,title,wd,read,rw],i)=>{const t0=wAt(sc,"marta",rw,-0.3),la=ag_io(tt,t0,c.better-0.6,0.4);
      if(la>0.004){x.save();x.globalAlpha*=la;x.strokeStyle=rgba(LP.mut,0.7);x.lineWidth=3;x.setLineDash([8,7]);x.beginPath();x.moveTo(lerp(860,1060,i/2),500);x.lineTo(390+i*570,420);x.stroke();x.restore();}
      ww_tag(x,tt,t0,c.better-0.6,390+i*570,392,read,{align:"center",col:LP.amber});});
    ww_tag(x,tt,wAt(sc,"names","Richard",-0.4),c.better-0.6,960,770,"Self-determination theory · Richard Ryan and Edward Deci, 2000",{align:"center",col:LP.ink});
    // what hundreds of studies found since
    ww_sheet(x,tt,c.better+0.2,460,390,1000,{kick:"Hundreds of studies since",title:"People supported in these needs are better off",lines:["At work, in school and in sport","And they do somewhat better"]},
      {light:"morning",u:ww_u(tt,[wAt(sc,"better","work",-0.3),wAt(sc,"better","somewhat",-0.4)]),out:c.care-0.5});
    ww_tag(x,tt,c.better+1.2,c.care-0.5,960,790,"Slemp and others, 2024: 881 samples, 443,556 people",{align:"center",col:LP.ink});
    // needs met; and what taking an annoyance away does not do
    N.forEach((n,i)=>{const ta=ag_io(tt,wAt(sc,"care","Meet",-0.2)+i*0.25,c.laptop-0.4,0.4);if(ta>0.004){x.save();x.globalAlpha*=ta;const f=lerp(0.6,1,ag_spr(tt-wAt(sc,"care","Meet",-0.2)-i*0.25,0,0.5));
      x.fillStyle=rgba(LP.green,1);x.beginPath();x.arc(620+i*570,196,24*f,0,TAU);x.fill();lp_icon(x,"tick",620+i*570,196,30*f,[255,255,255]);x.restore();}});
    ww_pill(x,tt,wAt(sc,"care","care",-0.4),c.about-0.5,960,430,"Needs met: people care about the work",{col:LP.green});
    const la=ag_io(tt,wAt(sc,"laptop","laptop",-0.8),c.about-0.5,0.5);lp_table(x,540,780,340,{a:la});lp_laptop(x,710,752,220,{a:la});
    ww_tag(x,tt,wAt(sc,"laptop","annoys",-0.6),c.about-0.5,960,512,"Taking away what annoys them: not the same thing",{align:"center",col:LP.mut});
    ww_tag(x,tt,wAt(sc,"laptop","laptop",-0.3),c.about-0.5,930,640,"A faster laptop",{col:LP.ink});
    ww_tag(x,tt,wAt(sc,"laptop","gives",-0.2),c.about-0.5,930,712,"Still no say in her order",{col:LP.amber});
    // and the page itself: all of it about the work
    const pb=ag_in(tt,c.about-0.1,0.5);ww_miniPage(x,810,400,300,{a:pb,k:tt-c.about+0.1,light:"morning",pin:false});
    ww_pill(x,tt,wAt(sc,"about","nothing",-0.2),null,960,660,"Nothing on the page is about Marta",{col:LP.ink});
    ww_pill(x,tt,wAt(sc,"about","All",-0.2),null,960,750,"All of it is about the work",{col:LP.blue});}}]);
  ww_kick(ctx,S,1,{light:"morning"});
});

/* ---------------------------------------------------------------- 5. An order, agreed */
scene("order",(ctx,S,t,sc)=>{const c=sc.cues,dy={light:"day"};
  // the nine who asked, seated along one table, and Helena standing at its end
  const room=(x,tt)=>{WW_ASKERS.forEach((p,i)=>lp_person(x,p,236+i*160,742,0.5,{t:tt+i*0.7,flip:i>4,cut:806,light:dy}));lp_person(x,"helena",1680,640,0.62,{t:tt,flip:true,cut:806,light:dy});lp_table(x,120,812,1740);};
  const goneT=wAt(sc,"agree","Two",-0.2),ordT=wAt(sc,"agree","twelve",-0.4),dateT=wAt(sc,"agree","date",-0.4),handT=wAt(sc,"three","three",-0.3),newT=wAt(sc,"door","new",-0.5),placeT=wAt(sc,"door","places",-0.3);
  const C={x:330,y:250,dx:150,dy:120,n:7},D={x:405,y:250,dx:150,dy:120,n:6},GONE=[3,10];
  ag_shots(ctx,S,t,sc.dur,[
    // Wednesday 10 February: the page, brought to the people who asked
    {at:0,place:"wwMeet",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{room(x,tt);
      ww_sheet(x,tt,wAt(sc,"room","Wednesday",-0.1),120,140,720,{kick:"Wednesday 10 February",title:"The nine people who asked, in one room"},{light:"day"});
      const pa=ag_in(tt,wAt(sc,"room","page",-0.5),0.5);ww_miniPage(x,980,150,280,{a:pa,k:tt-wAt(sc,"room","page",-0.5),light:"day"});
      ww_tag(x,tt,wAt(sc,"room","page",-0.1),null,1120,372,"Marta's week, on one page",{align:"center",col:LP.ink});
      ww_tag(x,tt,wAt(sc,"evidence","evidence",-0.3),null,1120,444,"As evidence, with no blame",{align:"center",col:LP.ink});
      ww_tag(x,tt,wAt(sc,"evidence","None",-0.2),null,480,444,"None had seen the others' requests",{align:"center",col:LP.amber});}},
    // what Helena wrote down before she went
    {at:c.team-0.4,place:"wwMeet",later:true,dis:0.6,keys:[[c.team-0.4,960,540,1.0]],push:0,draw:(x,tt)=>{
      ww_sheet(x,tt,wAt(sc,"team","team",-0.3),120,140,820,{kick:"The team wants",title:"One order, three requests at a time, no weekends in the plan"},{light:"day"});
      ww_sheet(x,tt,wAt(sc,"they","They",-0.1),980,140,820,{kick:"They want",title:"Their number, by their date"},{light:"day"});
      ww_sheet(x,tt,wAt(sc,"they","Both",-0.2),120,460,820,{kick:"Both want",title:"Numbers to rely on, on a date they can plan around"},{col:LP.green,light:"day"});
      ww_sheet(x,tt,wAt(sc,"least","least",-0.3),980,460,820,{kick:"The least she can accept",title:"An agreed order, with a date for each request"},{col:LP.blue,light:"day"});
      ww_tag(x,tt,c.team+0.1,null,960,780,"Helena comes prepared",{align:"center",col:LP.ink});}},
    // in the room: two are no longer needed, and twelve get an order and a date; three in hand; a new one goes to Helena
    {at:c.agree-0.4,place:"wwMeet",later:true,dis:0.6,keys:[[c.agree-0.4,960,540,1.0]],push:0,draw:(x,tt)=>{room(x,tt);
      const re=ag_sine(ag_in(tt,ordT,1.2));let n=0;
      for(let k=0;k<14;k++){const p=ww_blockAt(k,C),gi=GONE.indexOf(k),u=ag_in(tt,c.agree-0.1+k*0.03,0.3);
        if(gi>=0){ww_req(x,p[0],p[1],{w:120,h:80,a:u*(1-ag_in(tt,goneT+1.5,0.6)),gone:ag_in(tt,goneT+gi*0.25,0.5)});continue;}
        const q=ww_blockAt(n,D),nA=ag_in(tt,ordT+0.9+n*0.09,0.4);
        ww_req(x,lerp(p[0],q[0],re),lerp(p[1],q[1],re),{w:120,h:80,a:u,n:n+1,nA,date:ag_in(tt,dateT+n*0.05,0.4),hand:n<3?ag_in(tt,handT+n*0.15,0.4):0});n++;}
      // a new request: to Helena first, then into the order, with whoever asked
      const nu=ag_in(tt,newT,1.0),pu=ag_sine(ag_in(tt,placeT,1.2));if(nu>0){const q=ww_blockAt(12,D),sx=lerp(1980,1500,ag_eo(nu)),sy=420;
        ww_req(x,lerp(sx,q[0],pu),lerp(sy,q[1],pu)-Math.sin(Math.PI*pu)*50,{w:120,h:80,a:nu,n:13,nA:ag_in(tt,placeT+1.0,0.4),date:ag_in(tt,placeT+1.3,0.4)});}
      ww_pill(x,tt,wAt(sc,"agree","agree",-0.4),null,860,140,"Agreed, in half an hour",{col:LP.green,icon:"tick"});
      ww_tag(x,tt,goneT+0.3,c.three-0.4,1340,236,"2 no longer needed",{col:LP.mut});
      ww_tag(x,tt,ordT+0.5,c.three-0.4,1340,316,"12: an order, and a date each",{col:LP.blue});
      ww_tag(x,tt,handT,c.door-0.4,1340,236,"From Thursday: three at a time",{col:LP.blue});
      ww_tag(x,tt,wAt(sc,"three","own",-0.4),c.door-0.4,1340,316,"Three is Marta's own number",{col:LP.ink});
      ww_tag(x,tt,c.door+0.2,null,1340,236,"For now: new requests go to Helena",{col:LP.blue});}}
  ]);
  ww_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. Where to look */
scene("keeper",(ctx,S,t,sc)=>{const c=sc.cues,sun={wall:0},dy={light:"day"},cutT=c.dying-0.3;
  ag_shots(ctx,S,t,sc.dur,[
    // October 1972: left for a time, the bridge still hangs, whole to look at. Two visitors walk up to it; its keeper stands at its base
    {at:0,place:"wwGorge",keys:[[0,960,520,1.12],[0.4,960,540,1.0]],d:3.4,push:0,draw:(x,tt)=>{
      ww_bridge(x,{age:0.2,sag:100});
      ww_fig(x,416,WW_BANK.L.y+3,50,{who:0,pose:"stand",flip:true});
      WW_FAR.forEach((who,i)=>ww_fig(x,352-46*i-33*(cutT-tt),WW_BANK.L.y+5+i,50,{who,pose:"walk",t:tt+i*0.5}));
      ww_sheet(x,tt,wAt(sc,"gold","nineteen",-0.3),90,56,560,{kick:"October 1972",title:"Left for a time",sub:"Still hanging, whole to look at"},{light:null,pin:false});
      ww_tag(x,tt,wAt(sc,"gold","gleaming",-0.3),null,960,650,"Gleaming like gold",{align:"center",col:LP.ink});}},
    // at the edge: the keeper stops them
    {at:cutT,place:"wwBank",cut:true,keys:[[cutT,960,540,1.0]],push:0.02,draw:(x,tt)=>{
      lp_person(x,WW_VISITORS[1],340,650,0.92,{t:tt,light:sun});lp_person(x,WW_VISITORS[0],830,640,0.92,{t:tt+0.6,light:sun});
      lp_person(x,WW_PEOPLE.builder,1460,640,0.92,{t:tt+1.1,flip:true,light:sun});
      const qT=wAt(sc,"dying","Don't",-0.3);ww_quote(x,900,50,900,{quote:"“Don't cross! The bridge is dying!”",by:"Luis Choqueneira, a keeper of the bridge · October 1972"},{a:ag_in(tt,qT,0.35),k:tt-qT});
      ww_tag(x,tt,wAt(sc,"knew","sound",-0.5),null,585,290,"It looked sound to them",{align:"center",col:LP.ink});
      ww_tag(x,tt,wAt(sc,"knew","knew",-0.3),null,1150,290,"He knew its rope",{align:"center",col:LP.ink});}},
    // a manager can learn where to look in the work; and what Safe Work Australia calls such things
    {at:c.where-0.3,place:"lpRoom",keys:[[c.where-0.3,960,540,1.0]],dis:1.2,push:0,draw:(x,tt)=>{
      lp_person(x,"helena",250,700,0.92,{t:tt,light:dy});
      const hz=[wAt(sc,"hazards","demands",-0.3),wAt(sc,"hazards","control",-0.5),wAt(sc,"hazards","support",-0.5)];
      ww_listAt(x,tt,wAt(sc,"where","where",-0.4),440,150,700,{kick:"Where to look in the work",lines:WW_LOOK},{col:LP.blue,light:"day",
        us:[wAt(sc,"where","much",-0.3),wAt(sc,"where","decides",-0.3),wAt(sc,"more","often",-0.3),wAt(sc,"more","alone",-0.4),wAt(sc,"more","Nights",-0.2),wAt(sc,"more","unclear",-0.4),wAt(sc,"more","thanks",-0.3)].map(t0=>ag_in(tt,t0,0.5)),
        marks:[ag_in(tt,hz[0],0.5),ag_in(tt,hz[1],0.5),0,ag_in(tt,hz[2],0.5),0,0,0]});
      ww_listAt(x,tt,wAt(sc,"hazards","Safe",-0.2),1180,150,680,{kick:"Safe Work Australia",title:"Hazards at work",lines:["Job demands","Low job control","Poor support"]},
        {col:LP.amber,size:36,light:"day",us:hz.map(t0=>ag_in(tt,t0,0.5))});}}
  ]);
  ww_kick(ctx,S,ag_in(t,c.where+0.2,0.6));
});

/* ---------------------------------------------------------------- 7. Three signs, and a limit */
scene("signs",(ctx,S,t,sc)=>{const c=sc.cues,dy={light:"day"},outA=c.ask-0.5,outB=c.part-0.5;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lpRoom",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
    lp_person(x,"helena",250,700,0.92,{t:tt,light:dy});
    // three signs to notice early, and whose they are
    ww_listAt(x,tt,wAt(sc,"signs","three",-0.3),440,150,700,{kick:"Three signs to notice early",lines:["Worn out","Distant from the job","Feeling no longer good at it"]},
      {col:LP.amber,size:36,light:"day",out:outB,us:[wAt(sc,"signs","worn",-0.3),wAt(sc,"signs","distant",-0.3),wAt(sc,"signs","feeling",-0.3)].map(t0=>ag_in(tt,t0,0.5))});
    ww_sheet(x,tt,wAt(sc,"who","World",-0.3),1180,150,680,{kick:"Burn-out",title:"Comes from stress at work that has not been managed",sub:"World Health Organization, 2019"},{light:"day",out:outA});
    ww_pill(x,tt,wAt(sc,"notmed","matter",-0.4),outA,1520,512,"A matter of work",{col:LP.ink});
    ww_tag(x,tt,wAt(sc,"notmed","not",-0.2),outA,1520,598,"Not classed as a medical condition",{align:"center",col:LP.ink});
    // what a manager who notices one does, and what the same organization asks of employers
    ww_listAt(x,tt,c.ask+0.1,1180,150,680,{kick:"A manager who notices one",lines:["Asks","Listens","Changes the work first"]},
      {col:LP.blue,size:36,nums:true,light:"day",out:outB,us:[wAt(sc,"ask","asks",-0.3),wAt(sc,"ask","listens",-0.3),wAt(sc,"ask","changes",-0.3)].map(t0=>ag_in(tt,t0,0.5))});
    ww_sheet(x,tt,wAt(sc,"employers","recommends",-0.6),1180,500,680,{kick:"Also recommended",title:"Employers act directly on working conditions",sub:"World Health Organization"},{light:"day",out:outB});
    // where a manager's part ends
    const lt=wAt(sc,"part","end",-0.6),la=ag_in(tt,lt,0.9);
    if(la>0.004){x.save();x.strokeStyle=rgba(LP.mut,0.85);x.lineWidth=4;x.setLineDash([14,12]);x.lineCap="butt";x.beginPath();x.moveTo(960,250);x.lineTo(960,250+610*ag_sine(la));x.stroke();x.restore();}
    ww_tag(x,tt,lt+0.2,null,960,196,"A manager's part has an end",{align:"center",col:LP.ink});
    ww_sheet(x,tt,wAt(sc,"part","part",-0.3),440,290,470,{kick:"Her part",title:"The work"},{col:LP.blue,light:"day"});
    ww_tag(x,tt,wAt(sc,"part","clinician",-0.7),null,675,530,"Helena is not a clinician",{align:"center",col:LP.ink});
    ww_sheet(x,tt,wAt(sc,"help","more",-0.4),1010,290,720,{kick:"When it is more than work",title:"She points to professional help",sub:"Such as the university's staff support service"},{col:LP.green,light:"day"});
    ww_pill(x,tt,wAt(sc,"help","private",-0.7),null,1370,650,"And keeps it private",{col:LP.ink});}}]);
  ww_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 8. Ask everyone, in writing */
scene("ask",(ctx,S,t,sc)=>{const c=sc.cues,dy={light:"day"},late={light:"late"};
  ag_shots(ctx,S,t,sc.dur,[
    // the seven of the team, each by first name
    {at:0,place:"lpRoom",later:true,dis:0.6,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      WW_TEAM.forEach(([who,name],i)=>{const px=264+i*232;lp_person(x,who,px,826,0.56,{t:tt+i*0.6,flip:i>3,light:dy});
        ww_tag(x,tt,wAt(sc,"wait","seven",-0.5)+i*0.08,null,px,590,name,{align:"center",col:LP.ink});});
      ww_sheet(x,tt,wAt(sc,"wait","wait",-0.5),510,150,900,{kick:"Helena doesn't wait for signs",title:"She asks all seven about the work"},{light:"day"});}},
    // Friday 12 February: the same five questions, to answer in writing
    {at:c.five-0.3,place:"lpRoom",later:true,dis:0.6,keys:[[c.five-0.3,960,540,1.0]],push:0,draw:(x,tt)=>{const q0=wAt(sc,"five","five",-0.3);
      const bb=ww_listAt(x,tt,wAt(sc,"five","Friday",-0.2),120,200,900,{kick:"Friday 12 February · To all seven",lines:WW_QUESTIONS},{col:LP.blue,nums:true,light:"day",us:WW_QUESTIONS.map((q,i)=>ag_in(tt,q0+i*0.3,0.5))});
      ww_sheet(x,tt,wAt(sc,"quiet","writing",-0.6),1060,200,780,{kick:"In writing",title:"The quiet answer counts as much as the loud one"},{light:"day",out:c.needs-0.8});
      // three are about the needs; two ask what wears you out, and what would help
      const br=(i0,i1,t0,text)=>{const a=ag_in(tt,t0,0.4);if(a<=0.004)return;const y0=bb.rows[i0]-32,y1=bb.ends[i1]+8,bx=bb.x+bb.w+22;
        x.save();x.globalAlpha*=a;x.strokeStyle=rgba(LP.ink,0.9);x.lineWidth=4;x.lineCap="round";x.lineJoin="round";x.beginPath();x.moveTo(bx,y0);x.lineTo(bx+14,y0);x.lineTo(bx+14,y1);x.lineTo(bx,y1);x.stroke();x.restore();
        lp_tag(x,bx+36,(y0+y1)/2,text,{col:LP.ink,a});};
      br(0,2,c.needs-0.1,"Three: about the three needs");br(3,4,wAt(sc,"needs","Two",-0.2),"Two: what wears you out, what would help");}},
    // Friday 19 February: the answers, shown to all seven
    {at:c.show-0.3,place:"wwLate",keys:[[c.show-0.3,960,540,1.0]],dis:1.2,push:0,draw:(x,tt)=>{
      WW_TEAM.forEach(([who],i)=>lp_person(x,who,300+i*190,742,0.5,{t:tt+i*0.7,flip:i>3,cut:806,light:late}));lp_person(x,"helena",1680,640,0.62,{t:tt,flip:true,cut:806,light:late});lp_table(x,120,812,1740);
      const a0=wAt(sc,"show","answers",-0.5),w0=c.wears+0.1;
      ww_answers(x,96,120,700,{a:ag_in(tt,a0,0.35),k:tt-a0,light:"late",kick:"Friday 19 February · As counts",us:[wAt(sc,"counts","Two",-0.2),wAt(sc,"counts","Three",-0.2),wAt(sc,"counts","All",-0.2)].map(t0=>ag_in(tt,t0,0.9))});
      ww_tag(x,tt,wAt(sc,"show","words",-0.5),c.changed-0.5,446,524,"And in the words each agreed to share",{align:"center",col:LP.ink});
      ww_answers(x,826,120,754,{rows:WW_WEARS,col:LP.amber,a:ag_in(tt,w0,0.35),k:tt-w0,light:"late",kick:"What wears them out",us:[wAt(sc,"wears","meetings",-0.5),wAt(sc,"wears","requests",-0.3),wAt(sc,"wears","nights",-0.3)].map(t0=>ag_in(tt,t0,0.9))});
      ww_pill(x,tt,wAt(sc,"changed","changed",-0.4),null,446,524,"Changed already: Marta's order",{col:LP.green,icon:"tick"});
      ww_pill(x,tt,wAt(sc,"changed","date",-0.5),null,1203,524,"The rest: from Monday 15 March",{col:LP.blue});}}
  ]);
  ww_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 9. On a date */
scene("date",(ctx,S,t,sc)=>{const c=sc.cues,dy={light:"day"},e0=c.breath+0.4,cutT=wAt(sc,"cut","holds",0.2),s0=c.renew+0.1,old={age:1.0,wear:0.3,extra:{r1:8}};
  ag_shots(ctx,S,t,sc.dur,[
    // the renewal, in an ordinary year: the new cables are across and tied; then last year's bridge is cut loose, while it still holds
    {at:0,place:"wwGorge",keys:[[0,960,540,1.0]],push:0.02,draw:(x,tt)=>{const k=clamp((tt-cutT)/0.95,0,1),tie=0.5*ag_in(tt,s0,3.0),fl=0.5*ag_in(tt,s0+0.7,3.0),mt=0.5*ag_in(tt,s0+2.6,2.2),done=tt>s0+4.9,
        o={age:0,f:1,r:1,ties:[tie,tie],floor:[fl,fl],mat:[mt,mt]};
      ww_banks(x,{many:1});
      if(k<=0)ww_bridge(x,old);else ww_fall(x,old,k);
      ww_fallen(x,{age:1.0,k:0.22*ag_in(tt,cutT+2,8),a:ag_in(tt,cutT+0.5,0.6)});
      ww_bridge(x,Object.assign({mid:m=>{if(done){ww_cross(m,tt-s0-4.9,o,[[0.02,0.05,1,false],[-0.06,0.05,6,false],[0.98,-0.045,5,true]]);return;}
        if(tie>0.01&&tie<0.5)for(const [u,fp,who] of [[Math.max(0.04,tie-0.02),false,0],[Math.min(0.96,1-tie+0.02),true,2]]){const p=ww_deck(u,o);ww_fig(m,p[0],p[1],50,{who,pose:"astride",flip:fp,shadow:0,a:clamp(Math.min(tie/0.03,(0.5-tie)/0.03),0,1)});}}},o));
      ww_sheet(x,tt,wAt(sc,"cut","Quehue",-0.3),90,56,640,{kick:"Each year, at Quehue",title:"The old bridge is cut loose while it still holds"},{light:null,pin:false,out:c.renew-0.5});
      ww_tag(x,tt,0.9,c.renew-0.5,1380,150,"The new cables are already across",{align:"center",col:LP.green});
      ww_tag(x,tt,1.2,cutT-0.5,960,650,"Last year's bridge",{align:"center",col:LP.mut});
      ww_tag(x,tt,Math.max(wAt(sc,"cut","Nobody",-0.2),cutT+0.4),c.renew-0.5,960,650,"Nobody waits to see how long it would have lasted",{align:"center",col:LP.ink});
      ww_tag(x,tt,wAt(sc,"renew","rope",-0.5),null,600,150,"Made new there: the rope",{align:"center",col:LP.green});
      ww_tag(x,tt,wAt(sc,"renew","team",-0.4),null,1280,150,"In a team: the way the work is arranged",{align:"center",col:LP.blue});
      ww_pill(x,tt,wAt(sc,"renew","never",-0.3),null,960,650,"Never the people",{col:LP.ink});}},
    // Helena's team has its date too
    {at:c.june-0.3,place:"lpRoom",keys:[[c.june-0.3,960,540,1.0]],dis:1.2,push:0,draw:(x,tt)=>{
      lp_person(x,"helena",250,700,0.92,{t:tt,light:dy});
      ww_sheet(x,tt,wAt(sc,"june","date",-0.5),520,150,880,{kick:"Helena's team has its date too",title:"In June: the same five questions again"},{col:LP.blue,light:"day"});
      ww_months(x,520,430,{u:ag_in(tt,wAt(sc,"june","June",-0.9),1.4),ring:ag_in(tt,wAt(sc,"june","June",0.2),1.0),light:"day"});}},
    // Marta's twelve, by the end of February
    {at:c.marta-0.3,place:"lpRoom",later:true,dis:0.6,keys:[[c.marta-0.3,960,540,1.0]],push:0,draw:(x,tt)=>{const E={x:640,y:330,dx:190,dy:180,n:6},dT=wAt(sc,"marta","six",-0.2),hT=wAt(sc,"marta","twelve",0.2);
      lp_person(x,WW_MARTA,300,700,0.92,{t:tt,light:dy});lp_nameTag(x,150,330,WW_MARTA,{});
      for(let k=0;k<12;k++){const p=ww_blockAt(k,E);ww_req(x,p[0],p[1],{w:140,h:92,a:ag_in(tt,c.marta+0.1+k*0.04,0.3),n:k+1,date:1,done:k<6?ag_in(tt,dT+k*0.12,0.4):0,hand:k>5&&k<9?ag_in(tt,hT+(k-6)*0.1,0.4):0});}
      ww_tag(x,tt,c.marta+0.2,null,1115,150,"Friday 26 February",{align:"center",col:LP.mut});
      ww_tag(x,tt,wAt(sc,"marta","delivered",-0.5),null,1115,226,"6 delivered, each on its date",{align:"center",col:LP.green});
      ww_tag(x,tt,hT+0.2,null,830,640,"3 in hand",{align:"center",col:LP.blue});
      ww_tag(x,tt,hT+0.5,null,1400,640,"3 waiting, each with a date",{align:"center",col:LP.ink});
      ww_pill(x,tt,wAt(sc,"marta","Sunday",-0.6),null,1115,750,"No Sunday worked in February",{col:LP.green});}},
    // what to do this week
    {at:c.week-0.3,place:"lpRoom",later:true,dis:0.6,keys:[[c.week-0.3,960,540,1.0]],push:0,draw:(x,tt)=>{const g=1-ag_in(tt,c.end-0.6,0.6);
      if(g>0.004){x.save();x.globalAlpha*=g;
        ww_sheet(x,tt,wAt(sc,"week","write",-0.3),120,120,820,{kick:"One",title:"Write one person's week on one page, with them"},{light:"day"});
        ww_sheet(x,tt,wAt(sc,"take","Take",-0.1),980,120,820,{kick:"Two",title:"Take it to the people who ask; agree a pace the team can keep"},{col:LP.blue,light:"day"});
        ww_sheet(x,tt,wAt(sc,"write","Ask",-0.1),120,440,820,{kick:"Three",title:"Ask everyone in writing; show the answers; say when you'll ask again"},{col:LP.orange,light:"day"});
        ww_sheet(x,tt,wAt(sc,"one","Change",-0.1),980,440,820,{kick:"Four",title:"Change one thing in the work now; put a date on the rest"},{col:LP.green,light:"day"});
        x.restore();}
      ww_tag(x,tt,wAt(sc,"next","alike",-0.7),c.end-0.6,960,800,"Next: No two alike",{align:"center",col:LP.ink});}}
  ]);
  // the end card comes over the room; the last line is drawn once, over it, so it stands steady from the moment it is said
  lp_end(ctx,S,t,e0,"Wellbeing is in the work",null,"Film 2 of 4","People first");
  const la=ag_in(t,c.end+0.1,0.6);if(la>0.004){setScreen(ctx,S);lp_T(ctx,WW_LAST,960,350,{w:700,size:48,align:"center",a:la});}
  ww_kick(ctx,S,ag_in(t,c.june+0.2,0.6)*(1-ag_in(t,e0,0.8)));
});
ag_cutInto(["fourteen","page","needs","signs","ask"]);
