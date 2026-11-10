/* ===== One small change at a time: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt, written out each time so build.py checks the word is
   whole in its line), so the pictures stay with the voice if it's recorded again; the score (tools/score.py) takes the same words. In
   one room the camera glides and only what changes fades; a later moment in a room (later:true) lets what was there leave first;
   between rooms a shot dissolves, and a person who is in both shots at another place comes in once the dissolve is over. People
   breathe and blink on the film's own clock (T: the chapter's start plus its time), so a person who stays put across a change of shot
   or chapter is drawn the same in both. Sizes in the 1920 x 1080 frame. */

const KZ_LAST="Change one small thing, check it, keep what works.";
// the film's number and title at the top left, from the second chapter on
function kz_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"2","One small change at a time",{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function kz_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// a numbered card that comes in empty, its number only, at t0, and fills in at t1: the words fade in over the same paper, clipped
// below the number, so nothing is drawn twice (t1 at least a second after t0, once the card has settled)
function kz_slot(ctx,t,t0,t1,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  const bb=lp_textSheet(ctx,x,y,w,words,{measure:true}),f=ag_in(t,t1,0.5),k=t-t0;
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+w/2,y+bb.h/2,lerp(0.6,1,ag_spr(k,0,0.5)));lp_sheet(ctx,x,y,w,bb.h,Object.assign({},o,{a:1,k:null}));
  lp_T(ctx,String(words.kick).toUpperCase(),x+LP_PAD,y+LP_PAD+44,{w:800,size:28,ls:3,col:o.col||LP.mut});ctx.restore();
  if(f>0.004){ctx.save();ctx.beginPath();ctx.rect(x+2,y+LP_PAD+56,w-4,bb.h-LP_PAD-58);ctx.clip();lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a:a*f,k}));ctx.restore();}
  return bb;}
// lines that come in one by one, each at its own time: lp_textSheet's u
const kz_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag, or a pill, that comes in at t0 and goes at t1 (null: stays)
function kz_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function kz_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// a green tick in a disc, springing in from t0
function kz_tick(ctx,t,t0,x,y,a){if(t<t0)return;const f=lerp(0.6,1,ag_spr(t-t0,0,0.5));ctx.save();ctx.globalAlpha*=ag_in(t,t0,0.3)*(a==null?1:a);ctx.fillStyle=rgba(LP.green,1);
  ctx.beginPath();ctx.arc(x,y,22*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",x,y,30*f,[255,255,255]);ctx.restore();}
// draw in the frame's own coordinates from inside a shot, whatever its camera: a sheet over the hospital, seen close
function kz_scr(ctx,cam,fn){ctx.save();ctx.translate(cam.x,cam.y);ctx.scale(1/cam.z,1/cam.z);ctx.translate(-960,-540);fn(ctx);ctx.restore();}
// a sheet with a drawing on it (the cycle, the stair), springing in with it from t0
function kz_paper(ctx,t,t0,x,y,w,h,draw,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(t-t0,0,0.5)));lp_sheet(ctx,x,y,w,h,{col:o.col,light:o.light===undefined?"day":o.light,pin:o.pin});draw(ctx);ctx.restore();}

/* ---------------------------------------------------------------- 1. Ward by ward: Colombo, 2000 */
scene("wards",(ctx,S,t,sc)=>{const c=sc.cues,T=tt=>tt+sc.start,dy={light:"day"};
  // the hospital's rooms as the story goes: the infections outlined in amber from the line about them until they fall; the rooms that
  // take up the new way lit, their clutter gone: the store first (seen close), then, back in the section, one ward, and the rest ward
  // by ward
  const inf0=wAt(sc,"infect","mothers",-0.1),op0=wAt(sc,"infect","Caesarean",-0.1),nb0=wAt(sc,"infect","newborn",-0.1),fall0=wAt(sc,"fall","fall",-0.2);
  const sp0=wAt(sc,"spread","Ward",-0.1),lit0={"G.2":c.cheap,"1.1":wAt(sc,"spread","first",-0.1)};KZ_ORDER.slice(2).forEach((id,i)=>{lit0[id]=sp0+i*0.42;});
  const rooms=tt=>(id,r)=>{const k=r.kind,ed=k==="ward"?inf0:k==="op"?op0:k==="nursery"?nb0:null,on=lit0[id]!=null?ag_in(tt,lit0[id],0.7):0;
    return{lit:on,tidy:on,edge:ed!=null?LP.amber:null,edgeA:ed!=null?ag_in(tt,ed,0.5)*(1-ag_in(tt,fall0,1.2)):0};};
  const hosp=(x,tt)=>kz_hospital(x,{t:T(tt),room:rooms(tt)});
  // the store's shelves, step by step, as the voice names each
  const shelf=tt=>({sort:ag_in(tt,wAt(sc,"steps","Sort",-0.1),2.0),order:ag_in(tt,wAt(sc,"steps","Set",-0.1),1.6),shine:ag_in(tt,wAt(sc,"steps","Shine",-0.1),1.4),labels:ag_in(tt,wAt(sc,"steps","Standardise",-0.1),0.8)});
  const staff=(x,tt,who,px,fl,a)=>lp_person(x,KZ_STAFF[who],px,727,0.7,{t:T(tt),flip:fl,a,light:dy});
  ag_shots(ctx,S,t,sc.dur,[
    // Colombo, 2000: the hospital cut open, its rooms crowded; who and where; then the infections, outlined in amber. One shot, its
    // camera gliding in to a ward (what an infection is), out to the whole hospital (no money for a fix), then in towards the store
    // (five steps, from Japanese factories): in one room the film never cuts or dissolves
    {at:0,place:"kzColombo",keys:[[0,960,540,1.0],[c.means-0.3,700,560,2.0],[c.money-0.3,960,540,1.0],[c.fives-0.3,848,762,1.7]],d:1.8,draw:(x,tt,cam)=>{hosp(x,tt);
      kz_sheet(x,tt,wAt(sc,"when","Colombo",-0.2),150,52,560,{kick:"Colombo, Sri Lanka",title:"The year 2000"},{light:null,pin:false,out:wAt(sc,"where","director",-0.8)});
      kz_sheet(x,tt,wAt(sc,"where","director",-0.1),150,52,560,{kick:"The director",title:"Dr Wimal Karandagoda"},{light:null,pin:false,out:c.infect-0.6});
      kz_sheet(x,tt,wAt(sc,"where","Castle",-0.2),950,52,820,{kick:"Where mothers give birth",title:"Castle Street Hospital for Women"},{light:null,pin:false,out:c.infect-0.6});
      kz_sheet(x,tt,c.infect+0.2,550,52,820,{kick:"Too many infections",title:"After a Caesarean, and in newborns"},{col:LP.amber,light:null,pin:false,out:c.means-0.7});
      // close on a ward: what an infection is, and what it does
      kz_scr(x,cam,s=>kz_sheet(s,tt,c.means+1.2,1000,60,820,{kick:"An infection",title:"Germs in a wound, or in a baby's body",lines:["Fever and pain","Days more in hospital","Real danger to mother and child"]},
        {col:LP.amber,light:null,pin:false,out:c.money-0.6,u:kz_u(tt,[wAt(sc,"means","fever",-0.1),wAt(sc,"means","days",-0.1),wAt(sc,"means","danger",-0.1)])}));
      // the whole hospital again: no money for a fix; something has to change
      kz_sheet(x,tt,c.money+1.5,560,52,800,{kick:"At first, from the ministry",title:"No money for a fix"},{col:LP.amber,light:null,pin:false,out:c.fives-0.6});
      // towards the store, where the new way begins: five steps, from Japanese factories
      kz_scr(x,cam,s=>kz_sheet(s,tt,wAt(sc,"fives","Japanese",-0.2),560,60,800,{kick:"From Japanese factories",title:"Five steps, called 5S",sub:"Already used by companies in Sri Lanka"},
        {col:LP.blue,light:null,pin:false}));}},
    // the store, close: sort, set in order, shine, standardise, sustain; what it costs, and who does it; then kaizen
    {at:c.steps-0.5,place:"kzStore",dis:1.0,keys:[[c.steps-0.5,960,540,1.0]],draw:(x,tt)=>{const k0=c.kaizen-0.6;
      kz_shelf(x,560,0,shelf(tt));
      kz_sheet(x,tt,c.steps-0.2,70,150,420,{kick:"5S",title:"Five steps",lines:["Sort","Set in order","Shine","Standardise","Sustain"]},
        {col:LP.blue,light:"day",out:k0,u:kz_u(tt,[wAt(sc,"steps","Sort",-0.1),wAt(sc,"steps","Set",-0.1),wAt(sc,"steps","Shine",-0.1),wAt(sc,"steps","Standardise",-0.1),wAt(sc,"steps","sustain",-0.1)])});
      kz_pill(x,tt,wAt(sc,"cheap","costs",-0.1),k0,280,630,"Costs little",{col:LP.green});
      kz_pill(x,tt,wAt(sc,"cheap","everyone",-0.1),k0,280,710,"Everyone can see it",{col:LP.green});
      kz_sheet(x,tt,c.kaizen-0.1,70,150,440,{kick:"Then: kaizen",title:"Small changes",lines:["Proposed by the staff","Tried, and checked","Kept, or dropped"]},
        {col:LP.blue,light:"day",u:kz_u(tt,[wAt(sc,"kaizen","propose",-0.1),wAt(sc,"kaizen","try",-0.1),wAt(sc,"kaizen","keep",-0.1)])});
      staff(x,tt,"nurse",1480,true);staff(x,tt,"orderly",1740,true);
      kz_tag(x,tt,wAt(sc,"own","themselves",-0.2),c.kaizen+1.0,1610,440,"The staff do it themselves",{align:"center",col:LP.ink});}},
    // back to the whole hospital: ward by ward, it spreads; in two years, the infections fall
    {at:c.spread-0.4,place:"kzColombo",dis:1.0,keys:[[c.spread-0.4,960,540,1.0]],draw:(x,tt)=>{hosp(x,tt);
      const f0=c.fall-0.1;if(tt>=f0)kz_fall(x,410,40,1100,{a:ag_in(tt,f0,0.35),k:tt-f0,u:[ag_in(tt,wAt(sc,"fall","half",-0.2),1.0),ag_in(tt,wAt(sc,"fall","more",-0.1),1.0)]});}},
    // and beyond it: other hospitals in Sri Lanka, then public hospitals in fifteen African countries
    {at:c.africa-0.3,place:"kzColombo",later:true,keys:[[c.africa-0.3,960,540,1.0]],draw:(x,tt)=>{
      kz_sheet(x,tt,c.africa+0.5,150,200,560,{kick:"First, in Sri Lanka",title:"Other hospitals"},{col:LP.green,light:null,pin:false});
      const s0=wAt(sc,"africa","Japan's",-0.3);if(tt>=s0)kz_spread(x,780,200,990,{a:ag_in(tt,s0,0.35),k:tt-s0,first:ag_in(tt,wAt(sc,"africa","public",-0.1),1.2),more:ag_in(tt,wAt(sc,"africa","fifteen",-0.1),1.2)});}},
    // the people who did the work
    {at:c.blame-0.4,place:"kzStore",dis:1.0,keys:[[c.blame-0.4,960,540,1.0]],draw:(x,tt)=>{
      kz_shelf(x,560,0,{sort:1,order:1,shine:1,labels:1});
      staff(x,tt,"nurse",660,false);staff(x,tt,"sister",960,false);staff(x,tt,"orderly",1260,true);
      kz_sheet(x,tt,c.blame+0.2,460,56,1000,{kick:"Nobody was told to work harder",title:"The people who did the work improved it"},{light:"day",pin:false});
      kz_pill(x,tt,wAt(sc,"blame","small",-0.1),null,960,384,"A small step at a time",{col:LP.green});}},
    // data work's weekly chores, by hand; and the same way: one small change at a time, each one checked
    {at:c.data-0.4,place:"kzMonday",dis:1.0,keys:[[c.data-0.4,960,540,1.0]],draw:(x,tt)=>{const w0=wAt(sc,"data","weekly",-0.2),s0=c.same+0.2;
      // the chores by hand go before the title card, so only the stair of small changes is left under it
      const g0=c.breath-0.3;
      if(tt>=w0)kz_week(x,120,170,820,{a:ag_in(tt,w0,0.35)*(1-ag_in(tt,g0,0.4)),k:tt-w0,u:ag_in(tt,w0+0.3,1.2),light:"morning"});
      kz_tag(x,tt,wAt(sc,"data","mistakes",-0.1),g0,140,580,"Mistakes slip through",{col:LP.amber});
      kz_tag(x,tt,wAt(sc,"data","hours",-0.1),g0,560,580,"Hours go",{col:LP.amber});
      kz_paper(x,tt,s0,1040,170,760,560,s=>{lp_T(s,"ONE SMALL CHANGE AT A TIME",1076,252,{w:800,size:28,ls:3,col:LP.green});
        kz_stair(s,1110,330,620,330,{u:ag_in(tt,wAt(sc,"same","one",-0.1),4.2)});},{col:LP.green,light:"morning",pin:false});}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,"One small change at a time","Kaizen for data work: small changes, each one checked","Leading data people · Leading a data team");
});

/* ---------------------------------------------------------------- 2. Two hours every Monday */
scene("hours",(ctx,S,t,sc)=>{const c=sc.cues,T=tt=>tt+sc.start,mo={light:"morning"},dy={light:"day"};
  // the wall clock through Ivy's Monday morning: six, half past eight, half past ten
  const clockM=tt=>ag_keys(tt,[[c.job,kz_hm(6)],[c.hand-0.8,kz_hm(6)],[c.hand+0.5,kz_hm(8,30)],[wAt(sc,"hand","checking",-0.1),kz_hm(8,30)],[wAt(sc,"hand","fixing",0),kz_hm(10,30)]]);
  const tk0=c.talk-0.3;
  ag_shots(ctx,S,t,sc.dur,[
    // Ivy, the product she owns, and its promise; then her Monday, hour by hour
    {at:0,place:"kzMonday",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const ch0=c.job-0.3;
      kz_sheet(x,tt,c.own+0.3,720,140,820,{kick:"Since Thursday 1 July 2027",title:"Teaching space use",lines:["Owned by Ivy Reyes","The team's data on how the rooms are used"]},
        {col:LP.orange,light:"morning",out:c.job-0.8,u:kz_u(tt,[wAt(sc,"own","Ivy",-0.1),wAt(sc,"own","data",-0.1)])});
      kz_sheet(x,tt,wAt(sc,"promise","promise",-0.2),720,500,820,{kick:"Its promise to its readers",title:"Every Monday by 07:00",lines:["The week before's bookings and head counts"]},
        {col:LP.blue,light:"morning",out:c.job-0.8,u:ag_in(tt,wAt(sc,"promise","bookings",-0.2),0.5)});
      if(tt>=ch0){kz_monday(x,640,250,1220,{a:ag_in(tt,ch0,0.35),k:tt-ch0,light:"morning",promise:1,job:ag_in(tt,wAt(sc,"job","six",-0.1),0.5),
        hand:ag_in(tt,c.hand+0.3,0.4),handU:ag_in(tt,wAt(sc,"hand","checking",-0.1),wAt(sc,"hand","fixing",0)-wAt(sc,"hand","checking",-0.1)),
        open:ag_in(tt,c.risk-0.1,0.6),reader:ag_in(tt,wAt(sc,"risk","opens",-0.1),0.5)});
        kz_clock(x,330,200,62,clockM(tt),{a:ag_in(tt,ch0,0.4)});}
      lp_person(x,"ivy",330,650,1.0,{t:T(tt),a:ag_in(tt,0.6,0.6),light:mo});}},
    // Tuesday 20 July: her mid-year conversation with Helena
    {at:tk0,place:"kzTalk",dis:1.0,keys:[[tk0,960,540,1.0]],draw:(x,tt)=>{
      kz_sheet(x,tt,wAt(sc,"talk","mid",-0.2),600,140,720,{kick:"Tuesday 20 July",title:"Ivy's mid-year conversation"},{light:"day",out:c.way-0.6});
      kz_sheet(x,tt,wAt(sc,"talk","asks",-0.1),600,350,720,{kick:"Helena asks",title:"What do you want next?",lines:["To make her Monday refresh better","To teach what she learns"]},
        {col:LP.blue,light:"day",out:c.way-0.6,u:kz_u(tt,[wAt(sc,"wants","make",-0.1),wAt(sc,"wants","teach",-0.1)])});
      kz_sheet(x,tt,wAt(sc,"way","asks",-0.1),600,140,720,{kick:"Then Helena asks",title:"What's in the way?",lines:["Ivy: my Monday mornings","Two hours of checks, every week"]},
        {col:LP.amber,light:"day",out:c.idea-0.6,u:kz_u(tt,[wAt(sc,"way","Monday",-0.2),wAt(sc,"way","two",-0.1)])});
      kz_sheet(x,tt,wAt(sc,"time","gives",-0.1),600,456,720,{kick:"So Helena gives it",title:"Ivy's Thursday learning time",lines:["Two hours a week, already hers","Now for this"]},
        {col:LP.blue,light:"day",out:c.idea-0.6,u:kz_u(tt,[wAt(sc,"time","two",-0.1),wAt(sc,"time","now",-0.1)])});
      kz_sheet(x,tt,c.idea+0.1,600,140,720,{kick:"Kaizen's first idea",title:"Improvement is everyone's job",lines:["On their own work","In small steps"]},
        {light:"day",u:kz_u(tt,[wAt(sc,"idea","own",-0.1),wAt(sc,"idea","small",-0.1)])});
      // both come in once the room has, so Ivy, standing where Helena sits, never shows through her
      lp_person(x,"helena",430,690,0.85,{t:T(tt),cut:824,a:ag_in(tt,tk0+0.8,0.6),light:dy});lp_person(x,"ivy",1490,690,0.85,{t:T(tt),flip:true,cut:824,a:ag_in(tt,tk0+1.2,0.6),light:dy});
      // a long table, a little low: it hides both people below their cut, and the sheets above it stay whole
      lp_table(x,140,830,1640);}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.8,c.promise-0.4,0.5)});
  kz_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. Measure, then simplify */
scene("measure",(ctx,S,t,sc)=>{const c=sc.cues,T=tt=>tt+sc.start,mo={light:"morning"};
  const r0=c.test-0.6,n0=c.ninety-0.3,try0=c.try+0.1;
  // the line lit in the plan, do, check, act of skipping her hand check: one after another, as the voice says each
  const tryHi=tt=>{const ts=[try0+0.3,wAt(sc,"try","reads",-0.1),wAt(sc,"try","covers",-0.1),wAt(sc,"try","keeps",-0.1)];let k=-1;ts.forEach((t0,i)=>{if(tt>=t0)k=i;});return k;};
  ag_shots(ctx,S,t,sc.dur,[
    // the cycle every small step runs through, and where it comes from
    {at:0,place:"kzThursday",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      const cu=kz_u(tt,[wAt(sc,"cycle","plan",-0.1),wAt(sc,"cycle","do",-0.1),wAt(sc,"cycle","check",-0.1),wAt(sc,"cycle","act",-0.1)]);
      kz_paper(x,tt,0.5,100,150,860,700,s=>kz_cycle(s,530,500,180,{u:cu}),{light:"day"});
      kz_sheet(x,tt,c.shew+0.2,1040,110,780,{kick:"The cycle's history",lines:["1939: Walter Shewhart draws it as a circle","1950: W. Edwards Deming teaches it in Japan","There, managers make it plan, do, check, act"]},
        {light:"day",u:kz_u(tt,[c.shew+0.4,c.deming-0.1,wAt(sc,"deming","managers",-0.1)])});
      kz_sheet(x,tt,wAt(sc,"imai","Imai's",-0.4),1040,440,780,{kick:"1986 · Masaaki Imai's book",title:"Kaizen",sub:"Change for the better"},{light:"day"});}},
    // Monday 26 July: Ivy times each step; who needs this? Two steps nobody needed, tried and dropped
    {at:c.measure-0.3,place:"kzMonday",dis:1.0,keys:[[c.measure-0.3,960,540,1.0]],draw:(x,tt)=>{
      const st0=wAt(sc,"measure","Monday",-0.3),q0=wAt(sc,"back","asks",0),sa=ag_in(tt,st0,0.35)*(1-ag_in(tt,r0,0.4))+ag_in(tt,n0,0.35);
      let hl=null;if(tt>=q0&&tt<q0+6*0.45)hl=Math.floor((tt-q0)/0.45);if(tt>=c.rooms-0.2&&tt<r0+0.4)hl=1;
      if(sa>0.004)kz_steps(x,720,110,1100,{a:sa,k:tt<n0?tt-st0:tt-n0,light:"morning",rows:tt<n0?ag_in(tt,wAt(sc,"measure","times",-0.1),2.6):1,hl,
        drop:[0,tt<n0?0:1,0,0,ag_in(tt,c.ninety+0.1,0.6),0],total:tt<n0?120:lerp(105,90,ag_in(tt,wAt(sc,"ninety","ninety",-0.3),0.6))});
      kz_pill(x,tt,wAt(sc,"back","who",-0.1),c.rooms-0.4,330,250,"Who needs this?",{col:LP.blue});
      const ts0=wAt(sc,"test","since",-0.2);
      kz_sheet(x,tt,ts0,720,110,1100,{kick:"Since April, in Jun's models",title:"A test of the same 14 rooms"},{col:LP.orange,light:"morning",out:c.copy-0.6});
      if(tt<c.copy-0.2)kz_tick(x,tt,wAt(sc,"test","checked",-0.1),1764,170,1-ag_in(tt,c.copy-0.6,0.4));
      const pb=kz_sheet(x,tt,try0,720,330,1100,{kick:"One Monday, one small change",lines:["Plan: skip her check of the 14 rooms","Do: read the test instead","Check: it covers all 14","Act: keep the change"]},
        {col:LP.blue,light:"morning",out:c.copy-0.6,u:kz_u(tt,[try0+0.3,wAt(sc,"try","reads",-0.1),wAt(sc,"try","covers",-0.1),wAt(sc,"try","keeps",-0.1)])});
      if(pb){const k=tryHi(tt);kz_cycle(x,1640,pb.y+pb.h/2+10,86,{a:ag_in(tt,try0+0.5,0.4)*(1-ag_in(tt,c.copy-0.6,0.4)),small:true,labels:0,hi:k<0?null:k,lw:14});}
      kz_sheet(x,tt,c.copy+0.2,720,110,1100,{kick:"Step five",title:"The copy for Facilities",lines:["Since July, Facilities reads the product's page","She asks them, and drops the copy"]},
        {col:LP.amber,light:"morning",out:c.ninety-0.7,u:kz_u(tt,[wAt(sc,"copy","since",-0.1),wAt(sc,"copy","asks",-0.1)])});
      lp_person(x,"ivy",330,650,1.0,{t:T(tt),light:mo});}}
  ]);
  kz_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Standardise, then automate */
scene("automate",(ctx,S,t,sc)=>{const c=sc.cues,T=tt=>tt+sc.start,mo={light:"morning"},dy={light:"day"};
  const m0=c.muddle-0.3,o0=c.stop-0.3,f0=wAt(sc,"jun","follows",-0.1);
  // the job's checks, one a week from September, and Sam's review of each
  const checks=tt=>[0,1,2].map(i=>ag_in(tt,wAt(sc,"sept","step",-0.1)+i*0.9,0.6));
  ag_shots(ctx,S,t,sc.dur,[
    // the four steps left, as one checklist; the same each Monday; Jun follows it
    {at:0,place:"kzMonday",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const l0=c.list;
      if(tt>=l0)kz_checklist(x,560,140,800,{a:ag_in(tt,l0,0.35),k:tt-l0,light:"morning",u:ag_in(tt,wAt(sc,"list","four",-0.1),2.4),ticks:[0,1,2,3].map(i=>clamp(tt-(f0+i*0.55),0,1))});
      kz_pill(x,tt,wAt(sc,"same","changes",-0.1),c.jun-0.4,760,810,"Shows what changes",{col:LP.green});
      kz_pill(x,tt,wAt(sc,"same","anyone",-0.1),c.jun-0.4,1180,810,"Anyone can follow it",{col:LP.green});
      kz_pill(x,tt,wAt(sc,"jun","same",-0.1),null,960,810,"Same result, same time",{col:LP.green,icon:"tick"});
      lp_person(x,"ivy",330,650,1.0,{t:T(tt),light:mo});
      lp_person(x,"jun",1640,690,0.85,{t:T(tt),flip:true,a:ag_in(tt,c.jun-0.4,0.6),light:mo});}},
    // Thursday afternoons: only then, automate; one step a week into the job, each reviewed by Sam, each beside her own for a Monday
    {at:m0,place:"kzThursday",dis:1.0,keys:[[m0,960,540,1.0]],draw:(x,tt)=>{const j0=c.sept-0.1;
      kz_sheet(x,tt,c.muddle+0.1,560,140,840,{kick:"Only then, automate",title:"Automate a muddle",sub:"and you get a faster muddle"},{col:LP.amber,light:"day",out:c.sept-0.6});
      if(tt>=j0)kz_job(x,560,140,900,{a:ag_in(tt,j0,0.35),k:tt-j0,light:"day",flow:ag_in(tt,j0+0.2,1.2),checks:checks(tt)});
      kz_tag(x,tt,wAt(sc,"review","reviews",-0.1),null,1640,330,"Reviewed by Sam",{align:"center",col:LP.green});
      kz_tag(x,tt,wAt(sc,"review","beside",-0.2),null,330,250,"Beside her own, for a Monday",{align:"center",col:LP.amber});
      lp_person(x,"ivy",330,650,1.0,{t:T(tt),light:dy});
      lp_person(x,"sam",1640,690,0.85,{t:T(tt),flip:true,a:ag_in(tt,c.review-0.6,0.6),light:dy});}},
    // a Monday in October: the job checks before it publishes, and stops if a check fails; ten minutes, checked
    {at:o0,place:"kzMonday",dis:1.0,keys:[[o0,960,540,1.0]],draw:(x,tt)=>{const s0=wAt(sc,"stop","fails",-0.1),t0=c.ten-0.1;
      if(tt<t0)kz_job(x,560,140,900,{a:1-ag_in(tt,c.ten-0.6,0.4),light:"morning",checks:[1,1,1],stop:ag_in(tt,s0,0.5)});
      if(tt>=t0){kz_monday(x,640,250,1220,{a:ag_in(tt,t0,0.35),k:tt-t0,light:"morning",promise:1,job:1,jobText:"The job checks, then publishes",checked:1,
        reader:ag_in(tt,wAt(sc,"safe","opens",-0.1),0.5)});kz_clock(x,330,200,62,kz_hm(8,30)+10*ag_in(tt,wAt(sc,"ten","reads",-0.1),2.6),{a:ag_in(tt,t0,0.4)});}
      kz_pill(x,tt,wAt(sc,"ten","ten",-0.1),null,1250,760,"Ten minutes, checked",{col:LP.green,icon:"tick"});
      lp_person(x,"ivy",330,650,1.0,{t:T(tt),light:mo});}}
  ]);
  kz_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. The leader's part */
scene("leader",(ctx,S,t,sc)=>{const c=sc.cues,T=tt=>tt+sc.start,dy={light:"day"},lt={light:"late"};
  const v0=wAt(sc,"show","review",-0.5),n0=c.no-0.3,h0=c.habit-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    // Helena's part: three things
    {at:0,place:"kzTalk",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      // three cards, empty, as the voice says there were three things; each fills in as it is told
      const k3=wAt(sc,"none","three",-0.2);
      kz_slot(x,tt,k3,wAt(sc,"ask","asked",-0.2),600,150,400,{kick:"One",title:"Ask what's in the way",lines:["Each Tuesday","Room in Sam's week for the reviews"]},
        {col:LP.blue,light:"day",u:kz_u(tt,[wAt(sc,"ask","Tuesday",-0.1),wAt(sc,"ask","room",-0.1)])});
      kz_slot(x,tt,k3+0.2,wAt(sc,"give","gave",-0.2),1030,150,400,{kick:"Two",title:"Give the time",lines:["Thursday afternoons, for this","No meeting may take them"]},
        {col:LP.blue,light:"day",u:kz_u(tt,[wAt(sc,"give","Thursday",-0.1),wAt(sc,"give","meeting",-0.1)])});
      kz_slot(x,tt,k3+0.4,wAt(sc,"show","showed",-0.2),1460,150,400,{kick:"Three",title:"Show the small wins"},{col:LP.green,light:"day"});
      lp_person(x,"helena",330,650,1.0,{t:T(tt),a:ag_in(tt,0.9,0.6),light:dy});}},
    // the review, Thursday 7 October: Ivy's chart in front of the people who use the product, and who did the work
    {at:v0,place:"kzReview",dis:1.0,keys:[[v0,960,540,1.0]],draw:(x,tt)=>{const p0=wAt(sc,"show","people",-0.3);
      if(tt>=v0+0.2)kz_stairs(x,80,150,1020,{a:ag_in(tt,v0+0.2,0.35),k:tt-v0-0.2,light:"late",rows:1,hl:KZ_STAIRS.length-1,rh:58});
      kz_pill(x,tt,wAt(sc,"named","named",-0.1),null,590,830,"The work of Ivy, Jun and Sam",{col:LP.green});
      kz_tag(x,tt,v0+1.2,null,1824,170,"The review · Thursday 7 October",{align:"right",col:LP.mut});
      lp_person(x,LP_CROWD[1],1560,727,0.7,{t:T(tt),flip:true,a:ag_in(tt,p0,0.6),light:lt});
      lp_person(x,"graham",1790,727,0.7,{t:T(tt),flip:true,a:ag_in(tt,p0+0.3,0.6),light:lt});
      lp_person(x,"helena",1270,690,0.85,{t:T(tt),a:ag_in(tt,v0+1.0,0.6),light:lt});}},
    // no target, no programme, no speech: questions, time and a chart
    {at:n0,place:"kzReview",later:true,keys:[[n0,960,540,1.0]],draw:(x,tt)=>{
      kz_sheet(x,tt,c.no+0.1,620,160,520,{kick:"None of these",lines:["A target","A programme","A speech about change"]},
        {col:LP.amber,light:"late",u:kz_u(tt,[wAt(sc,"no","target",-0.1),wAt(sc,"no","programme",-0.1),wAt(sc,"no","speech",-0.1)])});
      kz_sheet(x,tt,wAt(sc,"no","questions",-0.3),1220,160,520,{kick:"Only these",lines:["Questions","Time","A chart"]},
        {col:LP.green,light:"late",u:kz_u(tt,[wAt(sc,"no","questions",-0.1),wAt(sc,"no","time",-0.1),wAt(sc,"no","chart",-0.1)])});
      lp_person(x,"helena",330,650,1.0,{t:T(tt),light:lt});}},
    // the team's Friday half-hour: every week's habit, for everyone
    {at:h0,place:"lpRoom",dis:1.0,keys:[[h0,960,540,1.0]],draw:(x,tt)=>{const p0=h0+1.0;
      kz_sheet(x,tt,c.habit+0.2,560,150,800,{kick:"From Friday 3 September",title:"The team's Friday half-hour",lines:["One measure, one change a week","For everyone"]},
        {col:LP.blue,light:"day",u:kz_u(tt,[wAt(sc,"habit","measure",-0.1),wAt(sc,"habit","everyone",-0.1)])});
      kz_tag(x,tt,wAt(sc,"others","management",-0.2),null,740,500,"The data management films",{align:"center",col:LP.mut});
      kz_tag(x,tt,wAt(sc,"others","quality",-0.2),null,1210,500,"The data quality films",{align:"center",col:LP.mut});
      [["helena",300,false],["ivy",640,false],["jun",980,true],["sam",1320,true],["noor",1660,true]].forEach(([who,px,fl],i)=>
        lp_person(x,who,px,768,0.62,{t:T(tt),flip:fl,a:ag_in(tt,p0+i*0.15,0.6),light:dy}));}}
  ]);
  kz_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,T=tt=>tt+sc.start,mo={light:"morning"},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back to Castle Street: a print of the hospital on the team room's wall; then Ivy's Monday, two hours to ten minutes
    {at:0,place:"kzMonday",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const pa=1-ag_in(tt,c.ivy-0.7,0.4),i0=c.ivy-0.1;
      if(pa>0.004){x.save();x.globalAlpha*=pa;kz_print(x,600,150,900);x.restore();}
      kz_tag(x,tt,wAt(sc,"back","step",-0.2),c.ivy-0.7,1050,700,"Their own wards, a step at a time",{align:"center",col:LP.ink});
      kz_pill(x,tt,wAt(sc,"back","half",-0.3),c.ivy-0.7,1050,790,"Infections fell by half",{col:LP.green});
      if(tt>=i0)kz_stairs(x,620,140,1200,{a:ag_in(tt,i0,0.35),k:tt-i0,light:"morning",rows:1,hl:ag_in(tt,wAt(sc,"ivy","ten",-0.2),0.1)>0.5?KZ_STAIRS.length-1:null});
      lp_person(x,"ivy",330,650,1.0,{t:T(tt),a:ag_in(tt,0.9,0.6),light:mo});}},
    // what to do on Monday; then the cycle, once more round
    {at:c.one-0.3,place:"kzMonday",later:true,keys:[[c.one-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.5,0.5),k0=c.take+0.1;
      if(g>0.004){x.save();x.globalAlpha*=g;
        kz_sheet(x,tt,c.one+0.1,120,150,800,{kick:"One",title:"Pick one chore of your own",lines:["Time each step"]},{light:"morning"});
        kz_sheet(x,tt,wAt(sc,"two","Drop",-0.1),1000,150,800,{kick:"Two",title:"Drop what nobody needs",lines:["Write the rest down, the same each time"]},{light:"morning"});
        kz_sheet(x,tt,wAt(sc,"three","Automate",-0.1),120,440,800,{kick:"Three",title:"Automate one step at a time",lines:["Check each one before you trust it"]},{light:"morning"});
        kz_sheet(x,tt,wAt(sc,"four","lead",-0.2),1000,440,800,{kick:"If you lead",title:"Ask what's in the way",lines:["Give the time","Show the small wins"]},
          {col:LP.blue,light:"morning",u:kz_u(tt,[wAt(sc,"four","give",-0.1),wAt(sc,"four","show",-0.1)])});
        x.restore();}
      kz_paper(x,tt,k0,560,150,800,620,s=>kz_cycle(s,960,470,170,{u:1,hi:tt<wAt(sc,"take","check",-0.1)?0:tt<wAt(sc,"take","keep",-0.1)?2:3,
        dot:clamp((tt-k0)/2.6,0,0.999)}),{light:"morning",out:e0+0.6});}}
  ]);
  lp_end(ctx,S,t,e0,"One small change at a time",KZ_LAST,"Film 2 of 4","Leading a data team");
  kz_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["hours","automate"]);
