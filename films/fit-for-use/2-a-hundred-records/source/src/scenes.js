/* ===== A hundred records: the scenes =====
   Six chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (brewery.js, and the module's bench and bench seen from above); what moves is drawn live in the shots of ag_shots. In one room
   the camera glides on from shot to shot and only what changes fades; a later moment in the same room (later:true) lets what was
   there leave before what comes later comes in. Between rooms a shot dissolves, or comes in on a cut (cut:true) where both show the
   same things: the four cards Gosset drew become the bench's first four records, in the same places. The title card ends chapter 1,
   the end card chapter 6. */

const hr_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
const hr_k=(tt,t0)=>Math.max(0,tt-t0);                       // a card's spring: seconds since it came in
const HR_TY=588,HR_TS=0.98;                                   // the team behind the bench: where they stand, their size
const HR_TEAM=[["malia",230],["mei",590],["jun",950]];
const HR_G={x:520,y:590,s:0.98};                              // Gosset behind his bench
const HR_ROW={xs:[790,950,1110,1270],y:480,w:150,h:96};       // four cards in a row: Gosset's, then the bench's first four records
const HR_VALS=["65.8","63.4","67.1","64.9"];                  // four of his measurements, typed on his cards
const HR_YIELD=["2.8","3.4","3.1","2.6"];                     // a handful of results from four plots
const HR_LIT=[[2,1],[4,1],[3,2],[5,2]];                       // the four plots of a trial
// the chapter's kicker, in the frame's top left: on the wall in ink, on the granite in chalk; dk 0 to 1 crosses between them
function hr_kick(ctx,S,a,dk){if(a<=0.004)return;setScreen(ctx,S);dk=clamp(dk||0,0,1);
  if(dk<1)dq_kicker(ctx,"2","A hundred records",{a:a*(1-dk)});if(dk>0)dq_kicker(ctx,"2","A hundred records",{a:a*dk,dark:true});}
// the team at the bench, each faded as one picture: o.a (a number, or (i, key) => a), o.gaze
function hr_team(cx,tt,o){o=o||{};HR_TEAM.forEach(([k,x],i)=>{const a=o.a==null?1:typeof o.a==="function"?o.a(i,k):o.a;if(a<=0.004)return;
  cx.save();cx.globalAlpha*=a;dq_person(cx,k,x,HR_TY,HR_TS,{t:tt,cut:DQ_BENCH.back,gaze:o.gaze||[3,0],smile:o.smile==null?0.3:o.smile});cx.restore();});}
function hr_gosset(cx,tt,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;cx.save();cx.globalAlpha*=a;
  dq_person(cx,HR_GOSSET,HR_G.x,HR_G.y,HR_G.s,{t:tt,cut:DQ_BENCH.back,gaze:o.gaze||[3,1],smile:0.2});cx.restore();}
// a plot of the trial, picked out in pale light
function hr_plotLit(cx,i,j,a){if(a<=0.004)return;const q=HR_PLOT(i,j);cx.save();cx.globalAlpha*=a;hr_quad(cx,q);cx.fillStyle="rgba(255,246,222,0.2)";cx.fill();
  cx.lineJoin="round";cx.strokeStyle="rgba(255,250,236,0.95)";cx.lineWidth=4;hr_quad(cx,q);cx.stroke();cx.restore();}
// a whole season, spring to autumn, on a card: u 0 to 1 moves the day along
function hr_season(cx,x,y,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=440,h=176;cx.save();cx.globalAlpha*=a;if(o.k!=null)ag_about(cx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(cx,x,y,w,h,{});dq_label(cx,x+DQ_PAD,y+52,"A whole season");
  const x0=x+DQ_PAD+12,x1=x+w-DQ_PAD-12,ly=y+96,p=lerp(x0,x1,ag_sine(u));cx.fillStyle="rgba(120,104,84,0.3)";rr(cx,x0,ly-3,x1-x0,6,3);cx.fill();
  cx.fillStyle=rgba(DQ.ink,0.85);rr(cx,x0,ly-3,Math.max(6,p-x0),6,3);cx.fill();cx.beginPath();cx.arc(p,ly,10,0,TAU);cx.fill();
  dq_T(cx,"Spring",x0-6,y+148,{w:600,size:28,col:DQ.soft});dq_T(cx,"Autumn",x1+6,y+148,{w:600,size:28,col:DQ.soft,align:"right"});cx.restore();}

/* ---------------------------------------------------------------- 1 · A few careful trials */
scene("first",(ctx,S,t,sc)=>{const c=sc.cues,T=hr_once(sc,"T",()=>({
    william:wAt(sc,"dublin","William"),better:wAt(sc,"barley","better"),which:wAt(sc,"barley","which"),how:wAt(sc,"barley","how"),
    sowing:wAt(sc,"field","sowing"),season:wAt(sc,"field","season"),handful:wAt(sc,"field","handful"),
    mislead:wAt(sc,"mislead","mislead"),wrong:wAt(sc,"mislead","wrong"),turn:wAt(sc,"mislead","turn"),
    large:wAt(sc,"maths","large"),nobody:wAt(sc,"maths","Nobody"),worked:wAt(sc,"worked","worked"),sure:wAt(sc,"worked","sure"),
    before:wAt(sc,"cards","Before"),hand:wAt(sc,"cards","by hand"),thousand:wAt(sc,"cards","three thousand"),shuffled:wAt(sc,"cards","shuffled"),drawn:wAt(sc,"cards","drawn"),
    published:wAt(sc,"student","published"),tables:wAt(sc,"student","tables"),asStudent:wAt(sc,"student","Student"),names:wAt(sc,"student","not under"),
    enough:wAt(sc,"enough","enough"),more:wAt(sc,"enough","more"),
    eleven:wAt(sc,"kiln","eleven"),grain:wAt(sc,"kiln","little more"),worse:wAt(sc,"kiln","worse"),
    medicine:wAt(sc,"still","medicine"),farming:wAt(sc,"still","farming"),factories:wAt(sc,"still","factories"),
    data:wAt(sc,"data","data"),records:wAt(sc,"data","records"),closely:wAt(sc,"data","closely"),whole:wAt(sc,"data","whole list"),
    passed:wAt(sc,"uni","passed"),n41:wAt(sc,"uni","forty-one"),
    hundred:wAt(sc,"friday","hundred"),n79:wAt(sc,"honest","Seventy-nine"),map:wAt(sc,"honest","map")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Dublin, 1899: Gosset at his bench; the brewery wants better barley, of two kinds
    {at:0,place:"hrLab",keys:[[0,800,500,1.1],[T.better-0.8,960,540,1.0]],d:2.8,push:0.015,draw:(cx,tt)=>{
      dq_label(cx,96,100,"Dublin · 1899",{a:ag_in(tt,0.5,0.8)});
      hr_gosset(cx,tt);
      dq_nameTag(cx,722,318,HR_GOSSET,{a:ag_in(tt,T.william-0.2,0.5)});
      dq_textCard(cx,1000,410,460,{kick:"The brewery wants",title:"Better barley",sub:"Which kind to grow, and how"},{a:ag_in(tt,T.better-0.3,0.4),k:hr_k(tt,T.better-0.3)});
      hr_jar(cx,1110,858,1,{tone:"pale",seed:5,a:ag_in(tt,T.which-0.2,0.5)});hr_jar(cx,1300,858,1,{tone:"warm",seed:9,a:ag_in(tt,T.how-0.2,0.5)});}},
    // a trial: a few plots, a whole season, a handful of results; and what a handful can do
    {at:T.sowing-1.3,place:"hrField",keys:[[0,960,540,1.0]],push:0.035,draw:(cx,tt)=>{
      HR_LIT.forEach(([i,j],k)=>hr_plotLit(cx,i,j,ag_in(tt,T.sowing+0.1+k*0.18,0.4)));
      hr_season(cx,1400,60,clamp((tt-T.season+0.1)/2.4,0,1),{a:ag_in(tt,T.season-0.3,0.4),k:hr_k(tt,T.season-0.3)});
      dq_chip(cx,960,62,"A handful of results",{align:"center",a:ag_in(tt,T.handful+0.7,0.4)});
      HR_LIT.forEach(([i,j],k)=>{const t0=T.handful-0.1+k*0.2,u=ag_eo(clamp((tt-t0)/0.9,0,1));if(tt<t0)return;const p=hr_inPlot(i,j,0.5,0.5);
        hr_numCard(cx,lerp(p[0]-75,645+k*160,u),lerp(p[1]-48,112,u),HR_YIELD[k],{a:ag_in(tt,t0,0.25),edge:"steel"});});
      dq_textCard(cx,70,560,500,{title:"The wrong barley, for a year?"},{icon:"why",a:ag_in(tt,T.wrong-0.2,0.4),k:hr_k(tt,T.wrong-0.2)});
      dq_textCard(cx,1350,560,500,{title:"Good barley, turned away?"},{icon:"why",a:ag_in(tt,T.turn-0.2,0.4),k:hr_k(tt,T.turn-0.2)});}},
    // back at his bench: the day's arithmetic and its question; his answer, tried by hand on cards, then published, and what it gave
    {at:c.maths-0.6,place:"hrLab",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      hr_gosset(cx,tt,{gaze:[4,1]});
      const cA=ag_in(tt,c.maths-0.3,0.5)*(1-ag_in(tt,T.before-0.3,0.5));
      if(cA>0){const many=ag_in(tt,T.large-0.2,1.4)*(1-ag_in(tt,c.change+0.2,1.0)),few=ag_in(tt,T.nobody,0.8),q=ag_in(tt,T.nobody+0.6,0.4)*(1-ag_in(tt,T.worked+0.5,0.5)),
          stu=clamp((tt-T.worked-0.1)/1.6,0,1),curveA=lerp(1,0.32,ag_in(tt,c.change+0.2,1.0));
        hr_curves(cx,780,150,640,420,{label:"The day's arithmetic",many,manyCurve:ag_in(tt,T.large-0.2,1.4),curveA,few,q,student:stu,a:cA,k:hr_k(tt,c.maths-0.3),
          notes:[{t:"Large numbers",x:1392,y:252,a:many,align:"right"},{t:"A few",x:808,y:252,a:few*(1-ag_in(tt,T.worked,0.4))},
            {t:"For a few",x:1392,y:252,a:ag_in(tt,T.worked+1.0,0.5),col:"steel",align:"right"}]});}
      // 3,000 measurements on 3,000 cards, shuffled, drawn four at a time
      const out=1-ag_in(tt,T.published-0.6,0.5),sA=ag_in(tt,T.hand-0.3,0.5)*out;
      hr_stack(cx,900,862,{a:sA,cut:clamp((tt-T.shuffled+0.1)/0.9,0,1)});
      dq_chip(cx,1015,662,"3,000 measurements · 3,000 cards",{align:"center",a:ag_in(tt,T.thousand-0.1,0.4)*out});
      HR_ROW.xs.forEach((x,k)=>{const t0=T.drawn+0.15+k*0.32,u=ag_eo(clamp((tt-t0)/0.7,0,1));if(tt<t0)return;
        hr_numCard(cx,lerp(940,x,u),lerp(700,HR_ROW.y,u),HR_VALS[k],{a:ag_in(tt,t0,0.2)*out,ruled:true,rot:(1-u)*0.3});});
      dq_chip(cx,1105,418,"750 samples of four",{align:"center",a:ag_in(tt,T.drawn+1.7,0.4)*out});
      // 1908: the paper, by Student, and his name turned face down
      const jA=ag_in(tt,T.published-0.3,0.6)*(1-ag_in(tt,T.eleven-0.7,0.5));
      hr_journal(cx,850,90,{a:jA,k:hr_k(tt,T.published-0.3),lit:ag_in(tt,T.asStudent-0.1,0.4)});
      hr_nameCard(cx,370,140,{turn:clamp((tt-T.names-0.2)/0.6,0,1),a:ag_in(tt,T.asStudent+0.4,0.4)*(1-ag_in(tt,T.enough+0.8,0.5))});
      // what the tables gave: enough, or more trials
      const gA=1-ag_in(tt,T.eleven-0.7,0.5);
      if(tt>T.enough-0.3&&gA>0){dq_tag(cx,1462,600,"pass",{to:[1360,640],text:"ENOUGH",k:hr_k(tt,T.enough-0.3),a:gA});
        if(tt>T.more-0.3)dq_tag(cx,1462,704,"hold",{to:[1360,656],text:"MORE TRIALS",k:hr_k(tt,T.more-0.3),a:gA});}
      // the kiln-dried seed: eleven pairs, and what they showed
      const pA=ag_in(tt,T.eleven-0.4,0.5)*(1-ag_in(tt,c.still-0.4,0.5));
      hr_pairs(cx,760,110,{a:pA,k:hr_k(tt,T.eleven-0.4),n:clamp((tt-T.eleven)*7,0,11)});
      dq_textCard(cx,760,470,400,{kick:"Kiln-dried seed",title:"A little more grain",sub:"about 14 to 1"},{edge:"steel",a:pA*ag_in(tt,T.grain-0.2,0.4),k:hr_k(tt,T.grain-0.2)});
      dq_textCard(cx,1180,470,400,{kick:"Kiln-dried seed",title:"Worse barley",sub:"almost certain"},{edge:"steel",a:pA*ag_in(tt,T.worse-0.2,0.4),k:hr_k(tt,T.worse-0.2)});
      // still used: in medicine, in farming, in factories
      const hA=1-ag_in(tt,c.data-0.3,0.5);
      [["Medicine",T.medicine,880],["Farming",T.farming,1100],["Factories",T.factories,1320]].forEach(([s,t0,x])=>dq_chip(cx,x,400,s,{align:"center",a:ag_in(tt,t0-0.15,0.35)*hA}));
      // and for data: a few, looked at closely
      HR_ROW.xs.forEach((x,k)=>{const t0=c.data+0.1+k*0.12;if(tt>t0)hr_numCard(cx,x,HR_ROW.y,HR_VALS[k],{a:ag_in(tt,t0,0.35),k:hr_k(tt,t0),ruled:true});});}},
    // the cut: the same four cards, now records of the university's graduation list; it passed every check, yet 41 were printed again
    {at:T.records-0.15,place:"bench",cut:true,keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const rA=1-ag_in(tt,c.uni-0.6,0.5);
      HR_ROW.xs.forEach((x,k)=>hr_mini(cx,x,HR_ROW.y,HR_ROW.w,HR_ROW.h,{a:rA,lit:ag_in(tt,T.closely-0.1+k*0.1,0.3)}));
      hr_tray(cx,560,780,800,{label:"Graduation list",n:64,a:ag_in(tt,T.whole-0.2,0.5)});
      dq_label(cx,96,100,"The university · December 2025",{a:ag_in(tt,c.uni-0.3,0.5)});
      [700,960,1220].forEach((x,k)=>{const t0=T.passed-0.25+k*0.2;if(tt<t0)return;
        dq_dial(cx,x,330,66,{lo:55,hi:100,v:[86,92,80][k],vu:ag_eo(clamp((tt-t0-0.3)/0.9,0,1)),u:ag_in(tt,t0,0.6),a:ag_in(tt,t0,0.3),k:hr_k(tt,t0)});
        if(tt>t0+0.6)dq_tag(cx,x-40,474,"pass",{to:[x,400],k:hr_k(tt,t0+0.6)});});
      dq_chip(cx,960,186,"Every check passed",{align:"center",col:"pass",icon:"tick",a:ag_in(tt,T.passed+0.5,0.4)});
      hr_certs(cx,1440,330,{n:5,a:ag_in(tt,T.n41-0.3,0.5),k:hr_k(tt,T.n41-0.3)});
      dq_figure(cx,1606,680,"41","printed again",{align:"center",a:ag_in(tt,T.n41+0.1,0.5)});}},
    // Friday 6 February: three people and a hundred records; 79 perfect, and where the rest went wrong
    {at:c.friday-0.7,place:"bench",later:true,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      hr_team(cx,tt);
      dq_label(cx,96,100,"Friday 6 February 2026");
      hr_hundred(cx,1268,330,{cw:52,ch:34,gap:8,appear:i=>ag_in(tt,T.hundred-0.3+(i%10)*0.03+Math.floor(i/10)*0.05,0.3),
        mark:i=>tt>T.n79-0.2+(i%10)*0.04+Math.floor(i/10)*0.06?(HR_HUNDRED.isBad(i)?"stop":"pass"):null,lit:i=>HR_HUNDRED.isBad(i)?ag_in(tt,T.map,0.5):0});
      dq_figure(cx,1564,250,"79","perfect of 100",{align:"center",col:"steel",a:ag_in(tt,T.n79+0.4,0.5)});}}]);
  dq_title(ctx,S,t,c.breath,"A hundred records",null,"FILM 2 OF 4 · FIT FOR USE");
});


/* ---------------------------------------------------------------- the bench's own pieces, for chapters 2 to 6 */
// three records of December's list, as the team saw them: one with a field marked wrong, one perfect, and one whose award the list
// allows and is wrong (a double degree recorded as one award). The list holds no accents, so none is typed here
const HR_REC1={head:"December 2025",id:"S-19362",rows:[{k:"Given name",v:"Daniel"},{k:"Family name",v:"Nunez"},{k:"Award",v:"Bachelor of Commerce"},{k:"Ceremony",v:"DEC25-2"},{k:"Conferred on",v:"2025-12-10"}]};
const HR_REC2={head:"December 2025",id:"S-19518",rows:[{k:"Given name",v:"Priya"},{k:"Family name",v:"Desai"},{k:"Award",v:"Bachelor of Nursing"},{k:"Ceremony",v:"DEC25-4"},{k:"Conferred on",v:"2025-12-11"}]};
const HR_REC3={head:"December 2025",id:"S-19740",rows:[{k:"Given name",v:"Hannah"},{k:"Family name",v:"Kowalski"},{k:"Award",v:"Bachelor of Laws"},{k:"Ceremony",v:"DEC25-1"},{k:"Conferred on",v:"2025-12-09"}]};
// errors by kind, as the bars say them, and which of the hundred has each
const HR_KINDS={names:["accent","cut","swap"]};
const hr_has=(i,kind)=>{const k=HR_HUNDRED.kinds(i);return kind==="names"?k.some(x=>HR_KINDS.names.includes(x)):k.includes(kind);};
// a card with a big figure: its kick, the number and a line under it (o.col for the number, o.lineA, o.edge, o.on, o.dark words)
function hr_figCard(cx,x,y,w,kick,value,line,o){o=o||{};const a=o.a==null?1:o.a,h=line?236:196,bb={x,y,w,h};if(a<=0.004)return bb;cx.save();cx.globalAlpha*=a;
  if(o.k!=null)ag_about(cx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));dq_card(cx,x,y,w,h,{edge:o.edge,on:o.on});dq_label(cx,x+DQ_PAD,y+50,kick,{col:o.kickCol});
  dq_T(cx,String(value),x+DQ_PAD,y+150,{w:800,size:96,col:o.col||DQ.ink});if(line)dq_T(cx,line,x+DQ_PAD,y+202,{w:600,size:28,col:DQ.soft,a:o.lineA==null?1:o.lineA});
  cx.restore();return bb;}
// the platform's Quality tab, small: the monitors that watch the table arrive whole and on time (o.rows 0 to 1 brings them in)
function hr_quality(cx,x,y,w,h,o){o=o||{};return dq_window(cx,x,y,w,h,{logo:"databricks",product:"Databricks",title:"Quality",a:o.a,k:o.k,draw:(c,b)=>{
  const n=o.rows==null?2:o.rows*2;dq_rows(c,b.x+8,b.y+6,[{h:"Monitor",w:b.w-16}],[[{s:"Freshness",mark:"pass"}],[{s:"Completeness",mark:"pass"}]],{rh:62,rowA:(r,i)=>clamp(n-i,0,1)});}});}
// a name as it was written, then as the list holds it (u 0 to 1): in the typed face every letter keeps its place, so only the
// accents go
function hr_accent(cx,x,y,u,o){o=o||{};const a=o.a==null?1:o.a,F={w:500,size:44,f:"mono"},w=dq_tw(cx,"Chloe Lefevre",F)+DQ_PAD*2+8,h=122;if(a<=0.004)return{x,y,w,h};
  cx.save();cx.globalAlpha*=a;if(o.k!=null)ag_about(cx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));dq_card(cx,x,y,w,h,{on:o.on,ruled:30,ruleTop:92});
  const v=ag_sine(clamp(u,0,1));if(v<1)dq_T(cx,"Chloé Lefèvre",x+DQ_PAD+4,y+80,Object.assign({a:1-v},F));if(v>0)dq_T(cx,"Chloe Lefevre",x+DQ_PAD+4,y+80,Object.assign({a:v},F));
  cx.restore();return{x,y,w,h};}
// the whole list as a strip, a line for each graduate, the oldest admitted at the left: o.caps picks out the names in capitals (every
// one admitted before 2020), o.hundred the hundred most recent at the right end
function hr_strip(cx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=360,bb={x,y,w,h};if(a<=0.004)return bb;const n=2031,sx=x+DQ_PAD,sw=w-2*DQ_PAD,sy=y+84,sh=150,old=0.3,
    caps=o.caps||0,hu=o.hundred||0,r=ag_rnd(43);cx.save();cx.globalAlpha*=a;if(o.k!=null)ag_about(cx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(cx,x,y,w,h,{on:"granite"});dq_label(cx,x+DQ_PAD,y+52,"December's list · 2,031 graduates");
  cx.fillStyle="rgba(120,104,84,0.08)";cx.fillRect(sx,sy,sw,sh);
  const p0=sx+sw*(1-100/n);if(hu>0){cx.fillStyle=rgba([196,172,128],0.45*hu);cx.fillRect(p0-3,sy-8,sx+sw-p0+6,sh+16);}
  for(let i=0;i<n;i++){const u=i/n,lx=sx+u*sw,cp=u<old&&r()<312/(old*n);cx.fillStyle=cp&&caps>0?rgba(mix([120,104,84],DQ.steel,caps),0.5+0.5*caps):"rgba(120,104,84,0.5)";
    cx.fillRect(lx,sy+(cp&&caps>0?0:12),cp&&caps>0?1.4:0.9,cp&&caps>0?sh:sh-24);}
  // what each end is: before 2020, and the hundred
  cx.fillStyle="rgba(92,82,72,0.6)";cx.fillRect(sx,sy+sh+14,sw*old,2);cx.fillRect(p0,sy+sh+14,sx+sw-p0,2);
  dq_T(cx,"Admitted before 2020",sx,sy+sh+52,{w:600,size:28,col:DQ.soft});dq_T(cx,"312 in capitals",sx,sy+sh+90,{w:700,size:28,col:"steel",a:caps});
  dq_T(cx,"The hundred",sx+sw,sy+sh+52,{w:600,size:28,col:DQ.soft,align:"right",a:Math.max(0.4,hu)});cx.restore();return bb;}
// a label over a dial (the check's name), a dial whose brass is what's allowed and whose needle is what's found (o.read), and a tag under it
function hr_check(cx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;cx.save();cx.globalAlpha*=a;
  if(o.label)dq_T(cx,o.label,x,y-r-34,{w:700,size:28,align:"center"});
  dq_dial(cx,x,y,r,{min:0,max:o.max||400,lo:o.lo,hi:o.hi,v:o.v,vu:o.vu,u:o.u,read:o.read,ticks:8,k:o.k});
  if(o.tag>0)dq_tag(cx,x-30,y+r+70,o.tagV||"hold",{to:[x,y+r+4],k:o.tag,text:o.tagText});
  cx.restore();}

/* ---------------------------------------------------------------- 2 · A hundred, by hand */
scene("look",(ctx,S,t,sc)=>{const c=sc.cues,T=hr_once(sc,"T",()=>({
    malia:wAt(sc,"who","Malia"),mei:wAt(sc,"who","Mei"),jun:wAt(sc,"who","Jun"),january:wAt(sc,"january","January"),cert:wAt(sc,"january","certificate"),
    dec:wAt(sc,"hundred","December's"),hundred:wAt(sc,"hundred","hundred"),
    fields:wAt(sc,"fields","fields"),names:wAt(sc,"fields","the names"),award:wAt(sc,"fields","the award"),cer:wAt(sc,"fields","the ceremony"),date:wAt(sc,"fields","the date"),
    mark:wAt(sc,"mark","mark"),nothing:wAt(sc,"mark","nothing marked"),perfect:wAt(sc,"mark","perfect"),
    n79:wAt(sc,"later","seventy-nine"),n21:wAt(sc,"errors","Twenty-one"),n26:wAt(sc,"errors","twenty-six"),
    n15:wAt(sc,"names","Fifteen"),acc:wAt(sc,"names","accents"),cut:wAt(sc,"names","cut short"),swap:wAt(sc,"names","swapped"),
    awards:wAt(sc,"rest","awards"),cers:wAt(sc,"rest","ceremonies"),dates:wAt(sc,"rest","dates"),
    friday:wAt(sc,"redman","Friday afternoon"),recs:wAt(sc,"tools","a hundred records"),people:wAt(sc,"tools","the people"),aft:wAt(sc,"tools","an afternoon")}));
  // which errors the grid lights, as the voice names each kind
  const kindAt=tt=>tt<T.n15-0.2?null:tt<T.acc-0.1?"names":tt<T.cut-0.1?"accent":tt<T.swap-0.1?"cut":tt<T.awards-0.1?"swap":tt<T.cers-0.1?"award":tt<T.dates-0.1?"ceremony":tt<c.redman-0.6?"date":null;
  ag_shots(ctx,S,t,sc.dur,[
    // two o'clock at the bench: who they are, what they agreed in January, and December's list
    {at:0,place:"bench",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      hr_team(cx,tt);
      dq_clock(cx,1716,190,70,14,0,{a:ag_in(tt,0.4,0.6)});dq_T(cx,"Friday 6 February",1716,312,{w:700,size:28,align:"center",col:DQ.soft,a:ag_in(tt,0.6,0.6)});
      [["malia",100,T.malia],["mei",460,T.mei],["jun",820,T.jun]].forEach(([k,x,t0])=>dq_nameTag(cx,x,214,k,{a:ag_in(tt,t0-0.2,0.5)}));
      dq_chip(cx,1290,364,"Agreed in January",{icon:"calendar",a:ag_in(tt,T.january-0.2,0.4)});
      dq_textCard(cx,1290,404,540,{kick:"For a certificate",title:"Every name exactly right"},{edge:"brass",a:ag_in(tt,T.cert-0.3,0.4),k:hr_k(tt,T.cert-0.3)});
      hr_tray(cx,1080,782,740,{label:"December 2025 · built in full",n:70,a:ag_in(tt,T.dec-0.2,0.5),pull:ag_in(tt,T.hundred,0.6)});}},
    // on the bench, close: one record and the fields a certificate and a ceremony need; a field marked wrong; a record with nothing marked
    {at:T.fields-0.6,place:"benchTop",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      const lit=tt<T.names-0.1?[]:tt<T.award-0.1?[0,1]:tt<T.cer-0.1?[2]:tt<T.date-0.1?[3]:tt<T.mark-0.2?[4]:[],m=tt>T.mark+0.5;
      const r1=dq_record(cx,180,150,700,{head:HR_REC1.head,id:HR_REC1.id,rows:HR_REC1.rows.map((r,i)=>i===1&&m?Object.assign({},r,{mark:"stop"}):r)},
        {on:"granite",lit,a:ag_in(tt,T.fields-0.4,0.5),k:hr_k(tt,T.fields-0.4)});
      dq_chip(cx,180,r1.y+r1.h+52,"Should be Núñez",{col:"brass",on:"granite",a:ag_in(tt,T.mark+0.9,0.4)});
      const r2=dq_record(cx,1040,150,700,HR_REC2,{on:"granite",a:ag_in(tt,T.nothing-0.4,0.5),k:hr_k(tt,T.nothing-0.4)});
      if(tt>T.perfect-0.2)dq_tag(cx,r2.x+r2.w-170,r2.y+r2.h+60,"pass",{to:[r2.x+r2.w-170,r2.y+r2.h-4],text:"PERFECT",k:hr_k(tt,T.perfect-0.2),on:"granite"});}},
    // two hours later: the hundred, marked; 79 perfect; 21 with an error, 26 errors, by kind
    {later:true,at:c.later-0.5,place:"benchTop",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      const kind=kindAt(tt);
      hr_hundred(cx,110,160,{cw:88,ch:54,gap:10,on:"granite",mark:i=>{const d=(i%10)*0.05+Math.floor(i/10)*0.07;return HR_HUNDRED.isBad(i)?"stop":tt>T.n79-0.5+d?"pass":null;},
        lit:i=>kind&&hr_has(i,kind)?1:0});
      dq_chip(cx,110,108,"2 pm to 4 pm",{icon:"clock",on:"granite",a:ag_in(tt,c.later,0.4)});
      const fA=1-ag_in(tt,T.n15-0.5,0.4);
      dq_figure(cx,1200,330,"79","perfect of 100",{col:"steel",dark:true,a:ag_in(tt,T.n79,0.5)*fA});
      dq_figure(cx,1200,600,"21","with an error",{dark:true,a:ag_in(tt,T.n21-0.1,0.5)*fA});
      dq_figure(cx,1560,600,"26","errors in all",{dark:true,a:ag_in(tt,T.n26-0.1,0.5)*fA});
      hr_bars(cx,1150,150,720,[{k:"Names",v:15},{k:"Accents lost",v:8,sub:1},{k:"Cut short",v:3,sub:1},{k:"Given and family swapped",v:4,sub:1},{k:"Awards",v:6},{k:"Ceremonies",v:3},{k:"Conferral dates",v:2}],
        {label:"26 errors",max:15,on:"granite",a:ag_in(tt,T.n15-0.3,0.5),u:i=>ag_in(tt,[T.n15,T.acc,T.cut,T.swap,T.awards,T.cers,T.dates][i]-0.2,0.6)});}},
    // back at the bench, four o'clock: what Thomas Redman calls it, and all it needs
    {at:c.redman-0.5,place:"bench",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      hr_team(cx,tt);
      dq_clock(cx,1716,190,70,16,0);dq_T(cx,"Friday 6 February",1716,312,{w:700,size:28,align:"center",col:DQ.soft});
      dq_textCard(cx,1240,370,600,{kick:"Thomas Redman calls it",title:"The Friday afternoon measurement"},{a:ag_in(tt,T.friday-0.6,0.4),k:hr_k(tt,T.friday-0.6)});
      [["A hundred records","card",T.recs],["The people who know them","people",T.people],["An afternoon","clock",T.aft]].forEach(([s_,ic,t0],k)=>dq_chip(cx,1240,610+k*64,s_,{icon:ic,a:ag_in(tt,t0-0.15,0.35)}));}}]);
  hr_kick(ctx,S,ag_in(t,0.3,0.6),ag_in(t,T.fields-0.6,0.5)*(1-ag_in(t,c.redman-0.5,0.5)));
});

/* ---------------------------------------------------------------- 3 · Is a hundred enough? */
scene("sure",(ctx,S,t,sc)=>{const c=sc.cues,T=hr_once(sc,"T",()=>({
    hundred:wAt(sc,"all","a hundred records"),gq:wAt(sc,"question","Gosset's"),
    like:wAt(sc,"margin","like the rest"),eight:wAt(sc,"margin","about eight"),five:wAt(sc,"act","one record in five"),
    recent:wAt(sc,"recent","most recent"),now:wAt(sc,"recent","made now"),everyone:wAt(sc,"plain","everyone"),n79:wAt(sc,"plain","seventy-nine"),
    n41:wAt(sc,"puzzle","forty-one"),two:wAt(sc,"puzzle","two certificates"),n21:wAt(sc,"over","twenty-one"),n400:wAt(sc,"over","over four hundred"),
    hand:wAt(sc,"hidden","by hand"),nobody:wAt(sc,"hidden","nobody counted"),factory:wAt(sc,"factory","hidden factory")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bench",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
    hr_team(cx,tt);
    // December's list, all of it: the hundred most recent at its end, then the older cards greyed, the list as it was made years ago
    hr_tray(cx,560,782,1300,{label:"December 2025 · 2,031 graduates",n:130,a:ag_in(tt,0.4,0.6),pull:ag_in(tt,T.hundred,0.6),
      grey:tt>T.recent?0.86*ag_sine(clamp((tt-T.recent)/1.6,0,1)):null});
    // Gosset's question again, with his four cards
    const qA=ag_in(tt,T.gq-0.4,0.4)*(1-ag_in(tt,c.margin-0.3,0.4));
    dq_textCard(cx,1230,150,620,{kick:"Gosset's question",title:"How far can a few be trusted?"},{a:qA,k:hr_k(tt,T.gq-0.4)});
    HR_VALS.forEach((v,k)=>hr_numCard(cx,1240+k*126,380,v,{w:110,h:72,ruled:true,a:qA*ag_in(tt,T.gq+0.2+k*0.12,0.3)}));
    // the measure and how far it can be trusted; one in five wrong; everyone understands it
    const mA=ag_in(tt,c.margin-0.2,0.5)*(1-ag_in(tt,c.puzzle-0.5,0.5));
    hr_margin(cx,1220,160,640,{label:"Perfect in every hundred",v:79,lo:71,hi:87,vText:"79",vu:ag_in(tt,T.like-0.2,1.2),u:ag_in(tt,T.eight-0.3,1.2),a:mA,k:hr_k(tt,c.margin-0.2)});
    dq_T(cx,"good to about 8 either way",1250,500,{w:600,size:28,col:"steel",a:mA*ag_in(tt,T.eight+0.6,0.5)});
    const oA=1-ag_in(tt,T.recent-0.6,0.4);
    for(let k=0;k<5;k++)hr_mini(cx,1250+k*118,560,100,64,{mark:k===2?"stop":null,a:oA*ag_in(tt,T.five-0.3+k*0.1,0.3)});
    dq_T(cx,"about 1 in 5 wrong",1250,676,{w:600,size:28,col:DQ.soft,a:oA*ag_in(tt,T.five+0.5,0.4)});
    dq_chip(cx,1640,680,"Most recent · as it's made now",{align:"center",a:ag_in(tt,T.now-0.3,0.4)*(1-ag_in(tt,T.everyone-0.4,0.4))});
    dq_figure(cx,1250,650,"79","of a hundred",{col:"steel",a:ag_in(tt,T.n79-0.3,0.5)*(1-ag_in(tt,c.puzzle-0.5,0.5))});
    // the puzzle: 41 reprinted, about 2 in 100; 21 in 100 with an error, over 400; put right by hand, and not counted
    const pA=1;
    hr_figCard(cx,1190,170,320,"Printed again","41","about 2 in 100",{edge:"steel",a:pA*ag_in(tt,T.n41-0.3,0.4),k:hr_k(tt,T.n41-0.3),lineA:ag_in(tt,T.two-0.2,0.4)});
    const f2=hr_figCard(cx,1540,170,320,"With an error","21","in 100 · over 400",{edge:"steel",a:pA*ag_in(tt,T.n21-0.3,0.4),k:hr_k(tt,T.n21-0.3),lineA:ag_in(tt,T.n400-0.2,0.4)});
    if(tt>T.hand-0.3)dq_tag(cx,1830,480,"none",{to:[1780,f2.y+f2.h-4],text:"PUT RIGHT BY HAND",size:28,flip:true,k:hr_k(tt,T.hand-0.3)});
    dq_T(cx,"nobody counted that work",1846,568,{w:600,size:28,col:DQ.soft,align:"right",a:ag_in(tt,T.nobody-0.2,0.4)});
    dq_textCard(cx,1400,598,460,{kick:"A later film",title:"The hidden factory"},{dash:false,a:ag_in(tt,T.factory-0.3,0.4),k:hr_k(tt,T.factory-0.3)});}}]);
  hr_kick(ctx,S,1,0);
});

/* ---------------------------------------------------------------- 4 · The whole list, described */
scene("profile",(ctx,S,t,sc)=>{const c=sc.cues,T=hr_once(sc,"T",()=>({
    good:wAt(sc,"where","how good"),look:wAt(sc,"where","where to look"),two:wAt(sc,"where","two thousand"),whole:wAt(sc,"describe","whole list"),
    nb:wAt(sc,"notebook","notebook"),click:wAt(sc,"notebook","one click"),keeps:wAt(sc,"notebook","keeps"),dp:wAt(sc,"notebook","data profiling"),
    row:wAt(sc,"profiling","every row"),col:wAt(sc,"profiling","each column"),
    empty:wAt(sc,"columns","empty"),diff:wAt(sc,"columns","different"),short:wAt(sc,"columns","shortest"),long:wAt(sc,"columns","longest"),most:wAt(sc,"columns","come up most"),
    dec:wAt(sc,"december","December's"),n2031:wAt(sc,"december","two thousand"),
    thirty:wAt(sc,"thirty","thirty"),field:wAt(sc,"thirty","length of the field"),freq:wAt(sc,"capitals","most frequent"),twice:wAt(sc,"capitals","same name twice"),caps1:wAt(sc,"capitals","once in capitals"),
    custom:wAt(sc,"metrics","custom metrics"),n41:wAt(sc,"fortyone","Forty-one"),n312:wAt(sc,"caps","Three hundred"),before:wAt(sc,"caps","before twenty twenty"),
    none:wAt(sc,"accents","not one name"),eight:wAt(sc,"accents","Eight"),gone:wAt(sc,"accents","every accent"),
    since:wAt(sc,"since","since twenty twenty"),row2:wAt(sc,"everyrow","every row"),
    good2:wAt(sc,"said","how good"),prof:wAt(sc,"said","The profile"),look2:wAt(sc,"said","where to look")}));
  // the profile window, its family_name row's longest value, and where the camera goes to read it
  const P={x:90,y:120,w:1260,h:440},cell=[P.x+24+8+300+210+280+190+95,P.y+68+18+8+60*2+30];
  ag_shots(ctx,S,t,sc.dur,[
    // the bench: a hundred say how good, not where to look among two thousand; so the platform describes the whole list
    {at:0,place:"bench",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      hr_team(cx,tt);
      hr_tray(cx,560,782,1300,{label:"December 2025 · 2,031 graduates",n:130,pull:1-ag_in(tt,T.two-0.3,0.6),grey:0.86*(1-ag_sine(clamp((tt-T.look)/1.2,0,1))),lit:ag_in(tt,T.whole-0.3,0.6)});
      dq_chip(cx,1500,660,"Where to look?",{align:"center",icon:"lens",a:ag_in(tt,T.look-0.2,0.4)*(1-ag_in(tt,T.whole-0.4,0.4))});}},
    // on the platform: a notebook's quick profile in one click; for one the team keeps, the table's Quality tab, and data profiling
    {at:T.nb-0.5,place:"benchTop",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      hr_cell(cx,100,150,780,400,{on:"granite",menu:ag_in(tt,T.click-0.2,0.5),a:ag_in(tt,T.nb-0.4,0.5),k:hr_k(tt,T.nb-0.4)});
      hr_catalog(cx,960,110,880,640,{on:"granite",lit:ag_in(tt,T.keeps+0.2,0.5),a:ag_in(tt,T.keeps-0.3,0.5),k:hr_k(tt,T.keeps-0.3)});
      hr_monitor(cx,1000,380,800,300,{on:"granite",lit:ag_in(tt,T.dp+0.1,0.5),type:ag_in(tt,c.profiling-0.4,0.5),a:ag_in(tt,T.dp-0.3,0.4),k:hr_k(tt,T.dp-0.3)});}},
    // the profile: a row for each column, the metrics as they're named, the most frequent; December's list; then what stands out
    {later:true,at:c.profiling-0.4,place:"benchTop",keys:[[0,960,540,1.0],[c.stand-0.2,cell[0]-120,cell[1]+40,1.22],[T.freq-0.4,1340,420,1.22],[c.metrics-0.9,960,540,1.0]],d:1.8,push:0,draw:(cx,tt)=>{
      const cols=tt<T.empty-0.2?0:tt<T.diff-0.2?1:tt<T.short-0.2?2:tt<T.long-0.2?3:4;
      hr_profile(cx,P.x,P.y,P.w,P.h,{on:"granite",cols,lit30:ag_in(tt,T.thirty-0.2,0.5),rowA:i=>ag_in(tt,T.col-0.3+i*0.18,0.35)});
      hr_frequent(cx,1410,120,430,{on:"granite",a:ag_in(tt,T.most-0.2,0.5),k:hr_k(tt,T.most-0.2),lit:ag_in(tt,T.twice-0.2,0.6)});
      dq_chip(cx,P.x,P.y+P.h+56,"Slice · December 2025 · 2,031 graduates",{icon:"calendar",on:"granite",a:ag_in(tt,T.dec-0.3,0.4)});
      if(tt>T.field-0.4)dq_tag(cx,cell[0]-60,P.y+P.h+70,"steel",{to:[cell[0],cell[1]+26],text:"THE FIELD'S LENGTH · 30",size:28,k:hr_k(tt,T.field-0.4),on:"granite"});}},
    // counts of his own, as custom metrics: what each counts on December's list, and an accent that's gone
    {later:true,at:c.metrics-0.5,place:"benchTop",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      hr_metric(cx,90,120,1270,600,{on:"granite",fill:clamp((tt-T.custom+0.4)/2.4,0,1)});
      [["41",T.n41,"At 30 characters",null],["312",T.n312,"In capitals only","all admitted before 2020"],["0",T.none,"A letter outside A to Z",null]].forEach(([v,t0,l1,l2],k)=>{
        const y=200+k*168;if(tt<t0-0.3)return;dq_tag(cx,1440,y,"steel",{to:[1362,y-16],text:v,size:36,k:hr_k(tt,t0-0.3),on:"granite",icon:false});
        dq_T(cx,l1,1412,y+76,{w:700,size:28,dark:true,a:ag_in(tt,t0,0.4)});if(l2)dq_T(cx,l2,1412,y+112,{w:600,size:28,col:DQ.chalkSoft,a:ag_in(tt,T.before-0.2,0.4)});});
      hr_accent(cx,1400,722,ag_in(tt,T.gone-0.2,1.0),{on:"granite",a:ag_in(tt,T.eight-0.3,0.4),k:hr_k(tt,T.eight-0.3)});}},
    // the hundred had none in capitals; only the profile, which reads every row, could see them
    {later:true,at:c.since-0.5,place:"benchTop",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      dq_label(cx,140,190,"The hundred",{dark:true});
      hr_hundred(cx,140,220,{cw:40,ch:26,gap:6,on:"granite"});
      dq_T(cx,"none in capitals",140,580,{w:700,size:28,dark:true,a:ag_in(tt,c.since+0.3,0.4)});
      dq_T(cx,"all admitted since 2020",140,618,{w:600,size:28,col:DQ.chalkSoft,a:ag_in(tt,T.since-0.2,0.4)});
      hr_strip(cx,700,190,1100,{a:ag_in(tt,c.everyrow-0.4,0.5),k:hr_k(tt,c.everyrow-0.4),caps:ag_in(tt,T.row2,0.8),hundred:ag_in(tt,T.row2+0.6,0.6)});}},
    // what each said
    {later:true,at:c.said-0.5,place:"benchTop",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      dq_textCard(cx,330,300,600,{kick:"The hundred",title:"How good",sub:"79 of 100"},{on:"granite",kickCol:"steel",a:ag_in(tt,T.good2-0.3,0.4),k:hr_k(tt,T.good2-0.3)});
      dq_textCard(cx,990,300,600,{kick:"The profile",title:"Where to look",sub:"Cut at 30 · in capitals · accents gone"},{on:"granite",kickCol:"steel",a:ag_in(tt,T.prof-0.3,0.4),k:hr_k(tt,T.prof-0.3)});}}]);
  hr_kick(ctx,S,1,ag_in(t,T.nb-0.5,0.5));
});

/* ---------------------------------------------------------------- 5 · Then the checks */
scene("checks",(ctx,S,t,sc)=>{const c=sc.cues,T=hr_once(sc,"T",()=>({
    write:wAt(sc,"now","write checks"),cut:wAt(sc,"cut","cut short"),caps:wAt(sc,"upper","capitals"),accent:wAt(sc,"none","single accent"),
    eight:wAt(sc,"chance","Eight"),chance:wAt(sc,"chance","isn't chance"),owns:wAt(sc,"owner","Mei owns"),malia:wAt(sc,"owner","Malia"),level:wAt(sc,"owner","their level"),
    holds:wAt(sc,"level","holds"),stops:wAt(sc,"level","none stops"),project:wAt(sc,"dbt","the project"),monday:wAt(sc,"dbt","Monday"),night:wAt(sc,"dbt","every night"),
    mon:wAt(sc,"monitor","monitoring"),time:wAt(sc,"monitor","on time"),quality:wAt(sc,"monitor","Quality"),
    nocheck:wAt(sc,"cant","no check"),swapped:wAt(sc,"allowed","swapped"),awards:wAt(sc,"allowed","the awards"),cers:wAt(sc,"allowed","the ceremonies"),dates:wAt(sc,"allowed","the dates"),
    values:wAt(sc,"allowed","allowed values"),wrong:wAt(sc,"allowed","Allowed, and wrong"),outside:wAt(sc,"outside","something outside"),next:wAt(sc,"outside","next film")}));
  // the three checks, as Jun writes them from what the profile showed: each one's name, its scale, what's allowed, what it finds
  const CH=[{x:620,label:"Family name at 30",max:400,lo:0,hi:10,v:41,read:"41",t:T.cut},{x:900,label:"In capitals only",max:400,lo:0,hi:10,v:312,read:"312",t:T.caps},
    {x:1180,label:"No accent at all",max:200,lo:10,hi:200,v:0,read:"0",t:T.accent}];
  const jun=(cx,tt)=>dq_person(cx,"jun",260,HR_TY,HR_TS,{t:tt,cut:DQ_BENCH.back,gaze:[3,0]});
  ag_shots(ctx,S,t,sc.dur,[
    // Jun writes the checks; Mei owns them, and with Malia agrees their level: each holds for a person, none stops the list
    {at:0,place:"bench",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      jun(cx,tt);
      for(const [k,x,t0] of [["mei",1480,T.owns],["malia",1770,T.malia]]){const a=ag_in(tt,t0-0.4,0.6);if(a>0){cx.save();cx.globalAlpha*=a;dq_person(cx,k,x,HR_TY,HR_TS,{t:tt,flip:true,cut:DQ_BENCH.back,gaze:[3,0]});cx.restore();}}
      CH.forEach((q,i)=>{const t0=q.t-0.4;if(tt<t0)return;hr_check(cx,q.x,330,86,{label:q.label,max:q.max,lo:q.lo,hi:q.hi,v:q.v,read:q.read,u:ag_in(tt,t0+0.2,0.6),vu:ag_eo(clamp((tt-t0-0.5)/1.2,0,1)),
        a:ag_in(tt,t0,0.4),k:hr_k(tt,t0),tag:tt>T.holds-0.2+i*0.25?hr_k(tt,T.holds-0.2+i*0.25):0});
        if(tt>T.owns-0.1)dq_chip(cx,q.x,150,"Mei Tanaka",{align:"center",icon:"person",a:ag_in(tt,T.owns-0.1+i*0.15,0.35)});});
      dq_chip(cx,1180,170,"8 in the hundred lost theirs",{align:"center",col:"steel",a:ag_in(tt,T.eight-0.2,0.4)*(1-ag_in(tt,T.owns-0.5,0.4))});
      dq_chip(cx,900,640,"None stops the list on its own",{align:"center",a:ag_in(tt,T.stops-0.2,0.4)});}},
    // in the project, with dbt, every night from Monday; the platform's monitoring watches the rest
    {at:T.project-0.4,place:"bench",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      jun(cx,tt);
      hr_checksFile(cx,540,100,900,620,{a:ag_in(tt,T.project-0.2,0.5),k:hr_k(tt,T.project-0.2),files:ag_in(tt,T.project,1.0),lines:clamp((tt-T.project-0.6)*5,0,HR_CHECKS_YML.length),lit:tt>T.project+1.8?[4,5]:[]});
      dq_chip(cx,990,764,"Every night · from Monday 9 February",{align:"center",icon:"refresh",a:ag_in(tt,T.monday-0.3,0.4)});
      hr_quality(cx,1480,200,400,280,{a:ag_in(tt,T.mon-0.3,0.5),k:hr_k(tt,T.mon-0.3),rows:ag_in(tt,T.time-0.4,0.8)});
      dq_T(cx,"Quality on the platform",1480,530,{w:600,size:28,col:DQ.soft,a:ag_in(tt,T.quality-0.2,0.4)});}},
    // what no check of the list can see: allowed values, wrong
    {at:c.cant-0.6,place:"benchTop",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      const kind=tt<T.swapped-0.1?null:tt<T.awards-0.1?"swap":tt<T.cers-0.1?"award":tt<T.dates-0.1?"ceremony":tt<T.values?"date":null,grey=ag_in(tt,T.nocheck-0.2,0.6);
      hr_hundred(cx,110,160,{cw:88,ch:54,gap:10,on:"granite",mark:i=>HR_HUNDRED.isBad(i)?(HR_HUNDRED.unseen(i)&&grey>0.5?"none":"stop"):"pass",lit:i=>kind&&hr_has(i,kind)?1:HR_HUNDRED.unseen(i)?0.5*grey:0});
      if(tt>T.nocheck)dq_tag(cx,560,820,"none",{to:[560,786],text:"NOT SEEN BY A CHECK",size:28,k:hr_k(tt,T.nocheck),on:"granite"});
      const rA=ag_in(tt,T.values-0.5,0.5),r3=dq_record(cx,1140,150,700,{head:HR_REC3.head,id:HR_REC3.id,rows:HR_REC3.rows.map((r,i)=>i===2&&tt>T.wrong+0.3?Object.assign({},r,{mark:"stop"}):r)},
        {on:"granite",lit:tt>T.values-0.3?[2]:[],litCol:null,a:rA,k:hr_k(tt,T.values-0.5)});
      if(rA>0&&tt>T.values)dq_tag(cx,r3.x+r3.w-220,r3.y+r3.h+62,"pass",{to:[r3.x+r3.w-220,r3.y+r3.h-4],text:"ALLOWED",k:hr_k(tt,T.values),on:"granite"});
      dq_chip(cx,1140,r3.y+r3.h+150,"Two awards: Arts, and Laws",{col:"brass",on:"granite",a:ag_in(tt,T.wrong+0.4,0.4)});}},
    // something outside the list to compare with: a reference, the next film
    {later:true,at:c.outside-0.5,place:"benchTop",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      const r3=dq_record(cx,230,200,700,{head:HR_REC3.head,id:HR_REC3.id,rows:HR_REC3.rows},{on:"granite",lit:[2]});
      const b=dq_textCard(cx,1170,250,520,{kick:"Something outside the list",title:"A reference"},{edge:"brass",on:"granite",a:ag_in(tt,T.outside-0.2,0.4),k:hr_k(tt,T.outside-0.2)});
      const u=ag_sine(clamp((tt-T.outside-0.2)/0.9,0,1));if(u>0){cx.save();cx.setLineDash([12,10]);cx.strokeStyle=rgba(DQ_TONE.brass.dark,0.9);cx.lineWidth=3;cx.beginPath();
        const y0=r3.rows[2].cy;cx.moveTo(r3.x+r3.w+14,y0);cx.lineTo(lerp(r3.x+r3.w+14,b.x-14,u),lerp(y0,b.y+b.h/2,u));cx.stroke();cx.restore();}
      dq_chip(cx,1170,b.y+b.h+60,"Next · Valid isn't true",{on:"granite",a:ag_in(tt,T.next-0.3,0.4)});}}]);
  hr_kick(ctx,S,ag_in(t,0.3,0.6),ag_in(t,c.cant-0.6,0.5));
});

/* ---------------------------------------------------------------- 6 · Look first */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,T=hr_once(sc,"T",()=>({
    every:wAt(sc,"back","every barley"),enough:wAt(sc,"back","enough"),more:wAt(sc,"back","more were needed"),
    recs:wAt(sc,"same","a hundred records"),people:wAt(sc,"same","the people"),whole:wAt(sc,"same","whole list"),
    again:wAt(sc,"start","measure again"),worked:wAt(sc,"start","changes worked"),first:wAt(sc,"measured","measured first"),errs:wAt(sc,"measured","where the errors are")}));
  const end=c.takeaway-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    // back in Dublin: four careful trials, and what his tables said
    {at:0,place:"hrLab",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      dq_label(cx,96,100,"Dublin · 1899");
      hr_gosset(cx,tt,{gaze:[4,1]});
      HR_ROW.xs.forEach((x,k)=>hr_numCard(cx,x,HR_ROW.y,HR_VALS[k],{ruled:true,a:ag_in(tt,0.4+k*0.12,0.4)}));
      if(tt>T.enough-0.3)dq_tag(cx,900,650,"pass",{to:[870,HR_ROW.y+HR_ROW.h-4],text:"ENOUGH",k:hr_k(tt,T.enough-0.3)});
      if(tt>T.more-0.3)dq_tag(cx,1180,650,"hold",{to:[1190,HR_ROW.y+HR_ROW.h-4],text:"MORE TRIALS",k:hr_k(tt,T.more-0.3)});}},
    // the team did the same: a hundred records, then the whole list described; 79 to start from; the checks where the errors are
    {at:c.same-0.5,place:"bench",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      hr_team(cx,tt);
      const gA=ag_in(tt,T.recs-0.3,0.5)*(1-ag_in(tt,c.start-0.4,0.4));
      hr_hundred(cx,1268,330,{cw:52,ch:34,gap:8,a:gA,mark:i=>HR_HUNDRED.isBad(i)?"stop":"pass"});
      const tA=ag_in(tt,T.whole-0.2,0.5)*(1-ag_in(tt,c.start-0.4,0.4));
      dq_chip(cx,1564,250,"The whole list, described",{align:"center",col:"steel",icon:"list",a:tA});
      const mA=ag_in(tt,c.start-0.1,0.5)*(1-ag_in(tt,c.measured-0.5,0.4));
      const m=hr_margin(cx,1220,200,640,{label:"Perfect in every hundred",v:79,lo:71,hi:87,vText:"79",u:1,a:mA});
      if(m)hr_again(cx,m,{a:mA*ag_in(tt,T.again-0.2,0.5),v:lerp(79,90,ag_sine(clamp((tt-T.again)/2.2,0,1)))});
      CHECKS_CLOSE.forEach((q,i)=>{const t0=T.first-0.4+i*0.2;hr_check(cx,q.x,360,72,{max:q.max,lo:q.lo,hi:q.hi,v:q.v,read:q.read,a:ag_in(tt,t0,0.4),k:hr_k(tt,t0)});
        if(tt>T.errs-0.4+i*0.2)dq_tag(cx,q.x-24,560,"steel",{to:[q.x,436],text:q.read,size:32,icon:false,k:hr_k(tt,T.errs-0.4+i*0.2)});});
      dq_T(cx,"where the errors are",1564,680,{w:700,size:30,align:"center",col:"steel",a:ag_in(tt,T.errs,0.5)});}}]);
  dq_end(ctx,S,t,end,"A hundred records","Look at a hundred records before you write a single check.","Film 2 of 4","Fit for use");
  const na=ag_in(t,end+1.4,0.6);if(na>0){setScreen(ctx,S);dq_T(ctx,"Next · Valid isn't true",960,800,{w:600,size:30,align:"center",col:DQ.chalkSoft,a:na});}
});
// the three checks at the end, smaller, over the counts they came from
const CHECKS_CLOSE=[{x:1330,max:400,lo:0,hi:10,v:41,read:"41"},{x:1564,max:400,lo:0,hi:10,v:312,read:"312"},{x:1798,max:200,lo:10,hi:200,v:0,read:"0"}];

// chapters that open where the one before ends, on the bench with the team: the camera glides on, and only what changes fades
ag_cutInto(["look","sure","profile"]);
