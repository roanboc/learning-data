/* ===== Valid isn't true: the seven chapters =====
   Each chapter is a few shots (the agent films' ag_shots): a place painted once, a slow camera, and what's drawn live over it. The
   opening goes from Edo at dawn to a map of the time, to Ezo's shore by day and then, later in the same place, by night (later:true:
   the day's team leaves before the night comes in), to the map of all Japan, and to the bench. The coast sheet lies over the shore in
   screen space, so it stays put while the day turns to night. The bench chapters open where the one before ends (ag_cutInto), so the
   camera glides on and only what changes fades; a person who stays is drawn in the same place, on the film's own clock, so their
   breath doesn't jump at the join. Times inside a chapter come from its cues and the words of its lines (wAt), so the pictures stay with
   the voice. Words on screen are at least 28 px as seen, and above the captions (y 890). Every top-level name starts with vt_ or VT_. */

// made once per chapter, the first time it draws: its cues are known by then
const vt_once=(sc,fn)=>sc.__vt||(sc.__vt=fn());
// when the chapter starts in the film: people breathe and blink on the film's clock
const vt_g0=sc=>{let s=0;for(const x of SCENES){if(x.id===sc.id)return s;s+=x.dur;}return s;};
// a card that springs in at t0 and goes at t1 (or stays): its k (seconds since it started, as the kit's cards take it) and its a
const vt_pop=(t,t0,t1,d)=>({k:Math.max(0,t-t0),a:t1==null?ag_in(t,t0,d||0.35):ag_io(t,t0,t1,d||0.35)});
// draws fn whole into a buffer, then lays it over at opacity a: a team, a ship or a tray that fades doesn't show through itself
function vt_whole(ctx,a,fn){if(!(a>0.004))return;if(a>=0.995){fn(ctx);return;}const [bc,bx]=ag_buf("vtWhole",ctx.canvas.width,ctx.canvas.height);bx.setTransform(ctx.getTransform());
  fn(bx);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}
// a person behind the bench, faded as one picture (the kit's people do that when the alpha is under 1)
function vt_who(ctx,who,x,G,a,o){if(!(a>0.004))return;ctx.save();ctx.globalAlpha*=a;dq_person(ctx,who,x,VT_P.y,VT_P.s,Object.assign({t:G,cut:VT_P.cut},o||{}));ctx.restore();}
// the day, on a chip under the kicker, in screen space
function vt_date(ctx,S,s,a){if(!(a>0.004))return;setScreen(ctx,S);dq_chip(ctx,96,166,s,{icon:"calendar",a});}
// the team's work on the beach, stretch after stretch, per seconds each: the rope pulled taut, the line sighted, the rope let go
function vt_survey(tt,t0,per){const u=(tt-t0)/per;if(u<0)return{taut:0,sight:0};const f=u-Math.floor(u);
  return{taut:ag_sine(f/0.3)*(1-ag_sine((f-0.82)/0.18)),sight:ag_sine((f-0.25)/0.25)*(1-ag_sine((f-0.7)/0.25))};}
// how many of the sheet's ten stretches are drawn: one each survey stretch, drawn on once it's been sighted
function vt_stretches(tt,t0,per){const u=(tt-t0)/per;if(u<0)return 0;const k=Math.floor(u);return Math.min(10,k+ag_sine((u-k-0.5)/0.4));}
// words in the mono face in runs, each [text, colour]
function vt_runs(ctx,runs,x,y,o){o=o||{};const f={w:500,size:o.size||30,f:"mono"};let xx=x;for(const [s,col] of runs){dq_T(ctx,s,xx,y,Object.assign({col:col||DQ.ink,a:o.a},f));xx+=dq_tw(ctx,s,f);}}
// a record's truth, under it: a soft lead ("as she writes it") and the name, what differs in brass
function vt_truth(ctx,lead,runs,x,y,a){if(!(a>0.004))return;const f={w:600,size:28};dq_T(ctx,lead,x,y,Object.assign({col:DQ.soft,a},f));
  const nx=x+dq_tw(ctx,lead,f)+16;if(typeof runs==="string")vt_name(ctx,runs,nx,y,{size:30,a});else vt_runs(ctx,runs,nx,y,{a});}
// a verdict's stamp beside a pair of awards, as the check compares them
function vt_pair(ctx,x,y0,y1,m,u,a){if(!(a>0.004)||u<=0.004)return;const e=ag_sine(u);ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=m==="stop"?rgba(DQ_TONE.stop.col,0.95):rgba(DQ.ink,0.55);
  ctx.lineWidth=3;ctx.setLineDash(m==="stop"?[9,8]:[]);ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,lerp(y0,y1,e));ctx.stroke();ctx.setLineDash([]);
  if(e>0.98)dq_stampMark(ctx,x+30,(y0+y1)/2,m,16);ctx.restore();}

/* ---------------------------------------------------------------- 1 · Under the stars
   Edo at dawn: the party sets out along the road, and a small map of Japan marks the way north to Ezo. A map of the time: a cape as
   drawn, and where it really lay, miles off. Ezo's shore by day: a ship on the horizon; the shogunate wants a true map; the team
   measures the beach stretch by stretch, and the sheet lays the walk up the coast, each stretch with its own green tick, the error
   widening behind them until the end is miles out; a reference is needed. The same shore by night: the stars come out, one crosses the
   south, the quadrant turns to it, and its height is marked in brass; the brass line of latitude crosses the sheet, and the walk's end
   is pulled to it. The map of all Japan, coast by coast, the years counting on the tag; finished, the base of the country's maps; one
   degree, his and today's. Then the bench: the list, allowed, 88 still wrong; its stars, the graduates, who put all 88 right. */
scene("stars",(ctx,S,t,sc)=>{const c=sc.cues,P=vt_once(sc,()=>{const q={g0:vt_g0(sc),setout:wAt(sc,"ino","set out"),ezoW:wAt(sc,"ezo","Ezo"),hok:wAt(sc,"ezo","Hokkaido"),
      cape:wAt(sc,"maps","a cape"),miles:wAt(sc,"maps","miles"),really:wAt(sc,"maps","really lay"),russian:wAt(sc,"ships","Russian"),shog:wAt(sc,"ships","the shogunate"),
      stretch:wAt(sc,"foot","each stretch"),small:wAt(sc,"error","small error"),pile:wAt(sc,"pile","pile up"),agree:wAt(sc,"agree","agree with itself"),
      milesOut:wAt(sc,"agree","miles out"),ref:wAt(sc,"change","a reference"),night:wAt(sc,"night","on clear nights")-0.5,starsW:wAt(sc,"night","the stars"),
      hgt:wAt(sc,"height","height"),south:wAt(sc,"height","the south"),north:wAt(sc,"height","how far north"),disagreed:wAt(sc,"corrected","disagreed"),
      corr:wAt(sc,"corrected","corrected the walk"),finished:wAt(sc,"map","finished"),base:wAt(sc,"map","the base"),oneDeg:wAt(sc,"degree","one degree"),
      ns:wAt(sc,"degree","north to south"),frac:wAt(sc,"degree","a fraction"),list:wAt(sc,"uni","the graduation list"),allowed:wAt(sc,"uni","allowed"),
      wrong:wAt(sc,"wrong","still wrong"),stars2:wAt(sc,"needed","stars"),grads:wAt(sc,"right","graduates"),right:wAt(sc,"right","right"),before:wAt(sc,"right","before")};
    q.per=(q.milesOut-0.4-q.stretch)/10;return q;});
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"vt_edo",keys:[[0,880,580,1.1],[c.ino+1,960,540,1.0]],d:3.4,draw:(x,tt)=>{
      vt_party(x,tt,ag_sine((tt-P.setout+0.4)/8),1);
      vt_inset(x,1260,70,{a:ag_in(tt,c.ezo-0.2,0.5),k:tt-c.ezo+0.2,route:ag_sine((tt-c.ezo-0.3)/2.4),ezo:ag_in(tt,P.ezoW,0.6),hok:ag_in(tt,P.hok,0.6)});}},
    {at:c.maps-0.2,place:"vt_oldmap",keys:[[0,960,540,1],[P.cape-1.0,1060,560,1.12]],d:2.8,draw:(x,tt)=>vt_oldLife(x,ag_in(tt,P.cape,0.6),ag_in(tt,P.really-0.2,0.8),ag_in(tt,P.miles,1.2))},
    {at:c.ships-0.2,place:"vt_shore",keys:[[0,960,540,1]],draw:(x,tt)=>{
      vt_whole(x,ag_io(tt,P.russian-0.3,c.foot+0.4,0.8),cx=>vt_ship(cx,lerp(1580,1440,ag_sine((tt-P.russian+0.3)/10)),VT_SH.hz+3,58,1));
      const sv=vt_survey(tt,P.stretch-0.2,P.per);vt_whole(x,ag_in(tt,c.foot-0.4,0.8),cx=>vt_team(cx,tt,{set:1,taut:sv.taut,sight:sv.sight}));
      let q=vt_pop(tt,P.shog,c.foot-0.6);dq_textCard(x,120,150,720,{kick:"The shogunate wanted",title:"A true map of the coast"},{edge:"brass",k:q.k,a:q.a});
      q=vt_pop(tt,P.ref,null);dq_textCard(x,120,150,760,{kick:"Something had to change",title:"A reference its errors can't reach"},{edge:"brass",k:q.k,a:q.a});}},
    {at:P.night,place:"vt_shoreNight",later:true,keys:[[0,960,540,1]],draw:(x,tt)=>{
      const out=ag_in(tt,P.starsW-0.8,3.4),cr=lerp(0.22,0.5,ag_sine((tt-P.hgt+0.4)/(P.south-P.hgt+0.4))),[sx,sy]=vt_starAt(cr),ang=lerp(0.62,vt_starAng(cr),ag_sine((tt-P.hgt+0.2)/1.6));
      vt_stars(x,tt,{out});vt_bigStar(x,sx,sy,ag_in(tt,P.starsW-0.2,1.0),1.2);vt_quadrant(x,ang,1);vt_figure(x,935,VT_Q.y,236,{dir:-1,jacket:VT_CLOTH.leader,lean:0.12});
      vt_height(x,ang,ag_in(tt,P.south+0.2,1.2),1);dq_T(x,"its height",630,600,{w:700,size:30,align:"right",col:"brass",dark:true,a:ag_in(tt,P.south+0.8,0.6)});}},
    {at:c.years-0.2,place:"vt_page",keys:[[0,1330,500,1.2],[c.years+2.6,960,540,1.0]],d:2.6,draw:(x,tt)=>{
      vt_japan(x,{walk:ag_sine((tt-c.years-0.1)/4.6),ink:ag_in(tt,P.finished,1.2),lines:1-ag_in(tt,P.finished+0.8,1.2)});
      let q=vt_pop(tt,P.finished+0.2,c.degree-0.4);dq_textCard(x,140,220,700,{title:"Finished by his teams",sub:"three years after his death"},{k:q.k,a:q.a});
      q=vt_pop(tt,P.base,c.degree-0.4);dq_textCard(x,140,420,700,{title:"The base of Japan's maps",sub:"for decades"},{edge:"brass",k:q.k,a:q.a});
      q=vt_pop(tt,c.degree,null);vt_degree(x,140,300,{his:ag_in(tt,P.oneDeg,1.0),today:ag_in(tt,P.ns+0.3,1.0),frac:ag_in(tt,P.frac,0.6),k:q.k,a:q.a});}},
    {at:c.uni-0.2,place:"bench",keys:[[0,960,540,1]],draw:(x,tt)=>{vt_who(x,"jun",300,P.g0+tt,1);
      let q=vt_pop(tt,P.list-0.3,null);vt_whole(x,q.a,cx=>vt_tray(cx,760,872,{label:"The March list",sub:"1,064 graduates",k:q.k}));
      // the words go as the title comes, so none shows through it; Jun and the list stay, and the next chapter opens on them
      const T1=c.breath-0.2;q=vt_pop(tt,P.allowed,T1);dq_tag(x,1060,836,"pass",{text:"ALLOWED · 1,064 OF 1,064",to:[1000,814],k:q.k,a:q.a,on:"granite",angle:0.02});
      const rt=ag_in(tt,P.right,0.8),wa=ag_io(tt,P.wrong,T1,0.5),nw=vt_count(x,1100,440,"88",null,{size:120,col:mix(DQ_TONE.hold.word,DQ_TONE.pass.word,rt),a:wa});
      dq_T(x,"still wrong",1100+nw+22,432,{w:700,size:32,col:"hold",a:wa*(1-ag_in(tt,P.right-0.2,0.3))});
      dq_T(x,"put right",1100+nw+22,432,{w:700,size:32,col:"pass",a:ag_io(tt,P.right+0.2,T1,0.4)});
      dq_chip(x,1100,520,"before a single certificate was printed",{icon:"certificate",col:"pass",a:ag_io(tt,P.before,T1,0.5)});
      vt_bigStar(x,1130,236,ag_io(tt,P.stars2,T1,0.8),1.4);vt_folk(x,1206,236,10,44,{col:"brass",u:ag_in(tt,P.grads,1.4),a:ag_io(tt,P.grads,T1,0.3)});}}]);
  // the coast sheet, over the shore in screen space: it stays put while the day turns to night
  const shA=ag_io(t,P.stretch-0.6,c.years-0.6,0.6);if(shA>0.004){setScreen(ctx,S);const pull=ag_in(t,P.corr,1.6),end=vt_sheetEnd(pull),e0=vt_sheetEnd(0),io=(t0,t1)=>ag_io(t,t0,t1,0.4);
    vt_sheet(ctx,t,{n:vt_stretches(t,P.stretch-0.2,P.per),wedge:ag_in(t,P.small,2.0),lat:ag_in(t,P.north,1.2),pull,a:shA});
    withA(ctx,shA,()=>{dq_T(ctx,"small errors,",1566,480,{w:700,size:28,col:DQ.soft,a:io(P.pile,P.corr)});dq_T(ctx,"piling up",1566,516,{w:700,size:28,col:DQ.soft,a:io(P.pile+0.3,P.corr)});
      dq_T(ctx,"each passes,",1566,620,{w:700,size:28,col:"pass",a:io(P.agree,P.corr)});dq_T(ctx,"agrees with itself",1566,656,{w:700,size:28,col:DQ.soft,a:io(P.agree+0.3,P.corr)});
      const da=io(P.milesOut,P.corr-0.2),tr=VT_TRUE[VT_TRUE.length-1];if(da>0.004){ctx.save();ctx.globalAlpha*=da;ctx.strokeStyle=rgba(DQ.ink,0.8);ctx.lineWidth=3;ctx.setLineDash([8,8]);
        ctx.beginPath();ctx.moveTo(e0[0]-10,e0[1]+8);ctx.lineTo(tr[0]+10,tr[1]-6);ctx.stroke();ctx.restore();}
      dq_T(ctx,"miles out",1604,214,{w:700,size:28,a:da});
      dq_T(ctx,"how far north",1140,236,{w:700,size:28,col:"brass",a:ag_in(t,P.north+0.4,0.6)});
      const ga=io(P.disagreed,P.corr+1.4);if(ga>0.004&&VT_FIX[1]-end[1]>4){ctx.save();ctx.globalAlpha*=ga;ctx.strokeStyle=rgba(DQ.brass,1);ctx.lineWidth=3;ctx.setLineDash([6,6]);
        ctx.beginPath();ctx.moveTo(end[0]+20,end[1]);ctx.lineTo(end[0]+20,VT_FIX[1]);ctx.stroke();ctx.restore();}
      dq_T(ctx,"corrected",1604,290,{w:700,size:28,col:"steel",a:ag_in(t,P.corr+1.2,0.5)});});}
  // the place and year; the years counting up as the coasts are walked; then the university
  vt_tags(ctx,S,t,[[0.8,"Edo · 1800"],[c.maps,"Maps of the time"],[c.ships,"Ezo · 1800"],[c.years-0.6,null]]);
  const ya=ag_io(t,c.years+0.3,c.uni-0.4,0.4);if(ya>0.004)vt_tag(ctx,S,"Japan · "+(t<c.map-0.2?Math.round(lerp(1800,1816,ag_sine((t-c.years-0.4)/4.4))):1821),ya);
  vt_tag(ctx,S,"The university · February 2026",ag_io(t,c.uni+0.3,c.breath,0.5));
  dq_title(ctx,S,t,c.breath,"Valid isn't true",null,"Fit for use · Film 3 of 4");});

/* ---------------------------------------------------------------- 2 · Every name allowed
   The bench: Jun, and the list in its tray. The three rules come in as they're said, as gauge cards in a column on the right, each
   measuring (steel) from then on; all 1,064 pass, a green tag on the tray. Valid, in data quality's words: allowed, and only that.
   Three records, each allowed, each wrong, with what the person writes under it in brass. Then the doubts, as amber tags on the list:
   twelve names exactly 30 long, not one accent; no check can say which, or whose; it's a question about the world. */
function vt_allowed(x,tt,c,P){const G=P.g0+tt,A1=c.zoe-0.6,B1=c.doubts-0.5;
  vt_who(x,"jun",300,G,1);
  // the list: it goes while three of its records are looked at, and comes back for the doubts
  const trA=tt<B1?1-ag_in(tt,A1,0.4):ag_in(tt,c.doubts-0.3,0.5);vt_whole(x,trA,cx=>vt_tray(cx,760,872,{label:"The March list",sub:"1,064 graduates",k:tt<B1?9:tt-c.doubts+0.3}));
  // the rules, as said, then measuring; all pass
  let q=vt_pop(tt,P.empty-0.3,A1);vt_rule(x,1180,110,640,"Not empty",{k:q.k,a:q.a,lit:ag_in(tt,P.empty+0.4,0.5)});
  q=vt_pop(tt,P.letters-0.3,A1);vt_rule(x,1180,272,640,"Letters, spaces, hyphens, apostrophes",{k:q.k,a:q.a,lit:ag_in(tt,P.letters+0.6,0.5)});
  q=vt_pop(tt,P.most-0.3,A1);dq_band(x,1180,484,640,{min:0,max:40,lo:1,hi:30,v:11,vu:ag_in(tt,P.field,1.0),ticks:8,numEvery:2,u:ag_in(tt,P.most+0.3,0.8),label:"At most 30 characters",hiText:"the student system's field",edge:"brass",k:q.k,a:q.a});
  q=vt_pop(tt,c.pass,A1);dq_tag(x,1060,836,"pass",{text:"ALLOWED · 1,064 OF 1,064",to:[1000,814],k:q.k,a:q.a,on:"granite",angle:0.02});
  q=vt_pop(tt,c.valid,A1);dq_textCard(x,560,170,560,{kick:"In data quality's words",title:"Every name is valid"},{k:q.k,a:q.a});
  q=vt_pop(tt,P.allowedW-0.5,A1);dq_textCard(x,560,350,560,{title:"Valid only means allowed"},{k:q.k,a:q.a});
  // three records, each allowed, each wrong: what the person writes, under each in brass
  const recs=[[c.zoe-0.2,130,[{k:"Given name",v:"Zoe"},{k:"Family name",v:"Lefevre"}],"as she writes it:","Zoë Lefèvre"],
    [P.cutS-0.2,370,[{k:"Family name",v:"Fitzwilliam-Montgomery Ashwort"}],"as he writes it:",[["Fitzwilliam-Montgomery Ashwort",DQ.ink],["h","brass"]]],
    [P.swap-0.2,540,[{k:"Given name",v:"Kowalski"},{k:"Family name",v:"Marta"}],"as she writes it:",[["Marta Kowalski","brass"]]]];
  for(const [t0,y,rows,lead,truth] of recs){q=vt_pop(tt,t0,B1);if(q.a<=0.004)continue;const r=dq_record(x,560,y,600,{rows},{k:q.k,a:q.a,labW:200});
    const tq=vt_pop(tt,t0+0.4,B1);dq_tag(x,r.x+r.w+48,r.y+r.h/2,"pass",{text:"ALLOWED",to:[r.x+r.w,r.y+r.h/2],k:tq.k,a:tq.a});
    vt_truth(x,lead,truth,560+DQ_PAD,r.y+r.h+38,ag_io(tt,t0+0.9,B1,0.4));}
  // the doubts: from the first checks of a hundred records, as amber tags on the list; no check can say which, or whose
  q=vt_pop(tt,P.hundred-0.3,null);dq_chip(x,560,190,"First checks · 100 records",{icon:"lens",a:q.a});
  q=vt_pop(tt,c.twelve,null);dq_tag(x,1060,560,"hold",{text:"12 NAMES · EXACTLY 30 CHARACTERS",icon:"why",size:28,to:[990,700],k:q.k,a:q.a});
  q=vt_pop(tt,P.accent,null);dq_tag(x,1060,660,"hold",{text:"NOT ONE ACCENT ON THE LIST",icon:"why",size:28,to:[996,742],k:q.k,a:q.a});
  q=vt_pop(tt,c.cant,c.world-0.3);dq_textCard(x,560,270,700,{kick:"No check can say",title:"which were cut short, or whose accents are missing"},{k:q.k,a:q.a});
  q=vt_pop(tt,c.world+0.1,null);dq_textCard(x,560,270,700,{title:"A question about the world, not about the data"},{edge:"brass",k:q.k,a:q.a});}
scene("allowed",(ctx,S,t,sc)=>{const c=sc.cues,P=vt_once(sc,()=>({g0:vt_g0(sc),empty:wAt(sc,"rules","not empty"),letters:wAt(sc,"rules","letters"),most:wAt(sc,"thirty","at most"),
    field:wAt(sc,"thirty","field"),allowedW:wAt(sc,"means","allowed"),cutS:wAt(sc,"short","a name cut short"),swap:wAt(sc,"short","a given name"),
    hundred:wAt(sc,"doubts","a hundred records"),accent:wAt(sc,"twelve","not one accent")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bench",keys:[[0,960,540,1],[c.doubts-0.4,1000,520,1.04]],d:2.4,draw:(x,tt)=>vt_allowed(x,tt,c,P)}]);
  setScreen(ctx,S);dq_kicker(ctx,"2","Every name allowed",{a:ag_in(t,0.8,0.5)});vt_date(ctx,S,"February 2026",ag_in(t,c.feb,0.5));});

/* ---------------------------------------------------------------- 3 · A reference outside the data
   Ino's star, and what a reference is: outside the data, knowing the truth, out of the errors' reach. Jun and the list go; the list's
   three references come in, each as it's said, from the closest to the truth: the graduate (Zoë), the document seen at enrolment (a
   closed folder, never opened), and the exam boards' approved lists, kept apart. A brass arrow over them points to the closest; what
   the closest and the farthest can tell, and what each costs; checking against a reference measures accuracy. */
function vt_reference(x,tt,c,P){const G=P.g0+tt,go=c.graduate-1.2;
  vt_who(x,"jun",300,G,1-ag_in(tt,go,0.6));vt_whole(x,1-ag_in(tt,go,0.6),cx=>vt_tray(cx,760,872,{label:"The March list",sub:"1,064 graduates",k:9}));
  vt_bigStar(x,700,300,ag_io(tt,P.stars-0.2,c.three-0.8,0.6),1.5);
  let q=vt_pop(tt,P.outside-0.3,c.three-0.8);dq_textCard(x,800,200,820,{kick:"A reference",title:"Something outside the data",sub:"that knows the truth, and that the data's errors can't reach"},{edge:"brass",k:q.k,a:q.a});
  // the three, from the closest to the truth
  vt_who(x,VT_ZOE,300,G,ag_in(tt,c.graduate-0.2,0.6));
  dq_chip(x,300,200,"The graduate",{align:"center",col:"brass",a:ag_in(tt,c.graduate,0.5)});
  q=vt_pop(tt,c.document,null);vt_whole(x,q.a,cx=>vt_folder(cx,960,846,{k:q.k}));dq_chip(x,960,200,"The document seen at enrolment",{align:"center",col:"brass",a:q.a});
  dq_chip(x,960,266,"checked once",{align:"center",a:ag_in(tt,P.once,0.5)});
  q=vt_pop(tt,c.boards,null);vt_whole(x,q.a,cx=>vt_boards(cx,1560,850,{k:q.k}));dq_chip(x,1560,200,"The exam boards' approved lists",{align:"center",col:"brass",a:ag_in(tt,c.boards+0.3,0.5)});
  dq_chip(x,1560,266,"kept apart",{align:"center",a:ag_in(tt,P.apart,0.5)});dq_chip(x,1560,332,"who completed each award, and when",{align:"center",a:ag_in(tt,P.who,0.5)});
  // closer to the truth: the arrow points to the graduate
  const ar=ag_in(tt,P.closest,1.2);if(ar>0.004){const x0=1560,x1=300,y=146,xe=lerp(x0,x1+40,ag_sine(ar));x.save();x.strokeStyle=rgba(DQ.brass,1);x.fillStyle=rgba(DQ.brass,1);x.lineWidth=5;x.lineCap="round";
    x.beginPath();x.moveTo(x0,y);x.lineTo(xe,y);x.stroke();x.beginPath();x.moveTo(xe-18,y);x.lineTo(xe+6,y-13);x.lineTo(xe+6,y+13);x.closePath();x.fill();x.restore();
    dq_T(x,"closer to the truth",930,124,{w:700,size:28,col:"brass",align:"center",a:ag_in(tt,P.closest+0.8,0.5)});}
  // what each can tell, and what it costs
  const off=c.accuracy-0.4;
  q=vt_pop(tt,P.anything-0.2,off);dq_chip(x,470,400,"anything about their name",{a:q.a});q=vt_pop(tt,P.wait-0.3,off);dq_chip(x,470,470,"ask, and wait",{icon:"hourglass",a:q.a});
  q=vt_pop(tt,P.night-0.2,off);dq_chip(x,1560,560,"there every night",{icon:"clock",align:"center",a:q.a});q=vt_pop(tt,P.spelling-0.3,off);dq_chip(x,1560,630,"nothing of spelling",{align:"center",a:q.a});
  q=vt_pop(tt,c.accuracy+0.1,null);dq_textCard(x,1240,400,600,{kick:"In data quality's words",title:"Accuracy: whether it's true"},{edge:"brass",k:q.k,a:q.a});}
scene("reference",(ctx,S,t,sc)=>{const c=sc.cues,P=vt_once(sc,()=>({g0:vt_g0(sc),stars:wAt(sc,"had","stars"),closest:wAt(sc,"three","closest"),outside:wAt(sc,"needs","outside the data"),
    once:wAt(sc,"document","checked once"),apart:wAt(sc,"boards","kept apart"),who:wAt(sc,"boards","who completed"),anything:wAt(sc,"ask","anything"),wait:wAt(sc,"ask","wait"),
    night:wAt(sc,"every","every night"),spelling:wAt(sc,"every","spelling")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bench",keys:[[0,960,540,1]],d:2.4,draw:(x,tt)=>vt_reference(x,tt,c,P)}]);
  setScreen(ctx,S);dq_kicker(ctx,"3","A reference outside the data",{a:ag_in(t,0.8,0.5)});});

/* ---------------------------------------------------------------- 4 · Ask the graduate
   Zoë, and the portal's page beside her, as large as a card: her name as it would be printed, and two buttons; she presses "This
   isn't my name" and types it, its accents in brass. The answers as counts: 1,013 answered, 925 confirmed, 88 corrected, and what the
   88 were; all of them allowed. A certificate carries a legal name: Mei, and the folder, the next reference; 84 matched, 4 had changed
   their name and sent the document. The list takes each name as confirmed, with the date; 51 didn't answer. The one name exactly 30
   long that really is that long: its amber tag turns green. A check raises a doubt; a reference settles it. */
// the 1,064 graduates as one bar: those who answered fill it in ink as it's said, then the 925 who confirmed turn green and the 88 who
// corrected turn amber; the 51 who didn't answer stay empty at its end
function vt_answerBar(x,tt,c,a){if(a<=0.004)return;const X=600,Y=300,BW=1040,BH=44,k=BW/1064,aw=1013*k*ag_sine((tt-c.answered)/1.2),g=ag_in(tt,c.confirmed,0.6),h=ag_in(tt,c.corrected,0.6);
  x.save();x.globalAlpha*=a;x.fillStyle=rgba(DQ.paper,0.92);rr(x,X,Y,BW,BH,12);x.fill();x.save();rr(x,X,Y,BW,BH,12);x.clip();
  x.fillStyle=rgba(DQ.ink,0.62);x.fillRect(X,Y,aw,BH);
  if(g>0.004){x.fillStyle=rgba(DQ_TONE.pass.col,g);x.fillRect(X,Y,Math.min(aw,925*k),BH);}
  if(h>0.004){x.fillStyle=rgba(DQ_TONE.hold.col,h);x.fillRect(X+925*k,Y,clamp(aw-925*k,0,88*k),BH);}
  x.fillStyle=rgba(DQ.paper,0.9*Math.max(g,h));x.fillRect(X+925*k-1.5,Y,3,BH);x.restore();
  x.strokeStyle="rgba(110,90,66,0.5)";x.lineWidth=1.6;rr(x,X,Y,BW,BH,12);x.stroke();x.restore();}
function vt_ask(x,tt,c,P){const G=P.g0+tt,z1=c.answered-0.6,L1=c.legal-0.4,T1=c.took-0.4,O1=c.one-0.4;
  // Zoë stays while her answer, the others' and her row on the list are shown; she goes before another graduate's name comes in
  vt_who(x,VT_ZOE,300,G,1-ag_in(tt,c.one-0.7,0.6));
  // what the registrar's office asked, as the graduates registered; the portal's page beside Zoë
  let q=vt_pop(tt,c.asked+0.2,z1);dq_textCard(x,1120,170,680,{kick:"The registrar's office asked",title:"Is this your name?",sub:"exactly as it will be printed"},{k:q.k,a:q.a});
  dq_chip(x,1120,420,"while registering for the March ceremonies",{icon:"seat",a:ag_io(tt,P.reg-0.2,z1,0.4)});
  q=vt_pop(tt,c.showed-0.2,z1);vt_whole(x,q.a,cx=>vt_portal(cx,560,96,{name:"Zoe Lefevre",typed:"Zoë Lefèvre",tu:(tt-P.typed-0.2)/1.8,press:tt>P.pressed-0.1?2:0,pu:ag_in(tt,P.pressed,0.35),k:q.k}));
  // the answers: 1,013 answered, 925 confirmed, 88 corrected, and what the 88 were; all of them allowed
  const bA=ag_io(tt,c.answered,L1,0.4);vt_answerBar(x,tt,c,bA);vt_count(x,600,262,"1,013","of 1,064 answered · 95%",{size:88,a:bA});
  vt_count(x,600,440,"925","confirmed their name as it was",{col:"pass",size:72,a:ag_io(tt,c.confirmed,L1,0.4)});
  const nw=vt_count(x,600,540,"88","corrected it",{col:"hold",size:72,a:ag_io(tt,c.corrected,T1,0.4)});
  const bars=[[P.f51,"lost their accents",51],[P.f19,"given and family names swapped",19],[P.f11,"cut short",11],[P.f7,"misspelt",7]];
  bars.forEach(([t0,s,n],i)=>{const a=ag_io(tt,t0-0.2,L1,0.4);if(a<=0.004)return;const y=606+i*48,len=n*8*ag_sine((tt-t0+0.2)/0.8);
    dq_T(x,s,640,y,{w:600,size:28,col:DQ.soft,a});if(len>1){x.save();x.globalAlpha*=a;x.fillStyle=rgba(DQ_TONE.hold.col,0.9);rr(x,1100,y-22,len,26,5);x.fill();x.restore();}
    dq_T(x,String(n),1100+len+16,y,{w:700,size:28,col:"hold",a:a*ag_in(tt,t0+0.5,0.3)});});
  dq_chip(x,600+nw+18+dq_tw(x,"corrected it",{w:500,size:30})+30,526,"all 88 allowed",{icon:"tick",col:"pass",a:ag_io(tt,c.allowed,L1,0.4)});
  // a legal name: Mei's team checks each correction against the next reference, the document seen at enrolment
  dq_chip(x,600,262,"a certificate carries the legal name",{icon:"certificate",a:ag_io(tt,c.legal,T1,0.4)});
  vt_who(x,"mei",1720,G,ag_in(tt,P.mei-0.3,0.6),{flip:true});
  q=vt_pop(tt,P.doc-0.2,null);vt_whole(x,q.a,cx=>vt_folder(cx,1330,846,{k:q.k,touch:ag_io(tt,c.matched-0.3,c.matched+1.2,0.4)+ag_io(tt,P.settled-0.2,P.settled+1.2,0.4)}));
  dq_chip(x,1330,400,"seen at enrolment",{align:"center",col:"brass",a:q.a});
  vt_count(x,600,636,"84","matched the document",{col:"pass",size:72,a:ag_io(tt,c.matched,T1,0.4)});
  const fa=ag_io(tt,c.four,T1,0.4),fw=vt_count(x,600,730,"4","had changed their name since,",{col:"pass",size:72,a:fa});
  dq_T(x,"and sent the new document",600+fw+18,766,{w:500,size:30,col:DQ.soft,a:fa*ag_in(tt,P.sent-0.3,0.4)});
  // the list takes each name as its graduate confirmed it, with the date; those who didn't answer, as the student system held them
  q=vt_pop(tt,c.took,O1);const r=dq_record(x,600,196,560,{rows:[{k:"Name as printed",v:""},{k:"Confirmed on",v:"11 February 2026"}]},{k:q.k,a:q.a,labW:220,fixed:true});
  const na=q.a*ag_in(tt,c.took+0.45,0.3);if(na>0.004){x.save();x.globalAlpha*=na;vt_name(x,"Zoë Lefèvre",600+DQ_PAD+220,r.rows[0].cy+10,{size:30});x.restore();}
  x.save();x.globalAlpha*=ag_io(tt,P.date-0.2,O1,0.4);x.fillStyle=rgba(DQ.brass,1);rr(x,600+10,r.rows[1].y+4,6,50,3);x.fill();x.restore();
  q=vt_pop(tt,c.didnt,O1);dq_textCard(x,600,430,560,{kick:"Didn't answer · 51",title:"Printed as the student system held them"},{k:q.k,a:q.a});
  // the one name exactly 30 long: the document settles it
  q=vt_pop(tt,c.one+0.1,null);const r2=dq_record(x,200,230,600,{rows:[{k:"Family name",v:"Herath Mudiyanselage Wijeratne"}]},{k:q.k,a:q.a,labW:200});
  const tA=vt_pop(tt,c.one+0.6,P.settled+0.3);dq_tag(x,r2.x+r2.w+48,r2.y+r2.h/2,"hold",{text:"EXACTLY 30 CHARACTERS",icon:"why",size:28,to:[r2.x+r2.w,r2.y+r2.h/2],k:tA.k,a:tA.a});
  const tB=vt_pop(tt,P.settled+0.7,null);dq_tag(x,r2.x+r2.w+48,r2.y+r2.h/2,"pass",{text:"REALLY 30 CHARACTERS",size:28,to:[r2.x+r2.w,r2.y+r2.h/2],k:tB.k+0.5,a:tB.a});
  q=vt_pop(tt,c.doubt,null);dq_textCard(x,200,420,760,{title:"A check can raise a doubt"},{edge:"hold",k:q.k,a:q.a});
  q=vt_pop(tt,c.settle,null);dq_textCard(x,200,560,760,{title:"Only a reference can settle it"},{edge:"brass",k:q.k,a:q.a});}
scene("ask",(ctx,S,t,sc)=>{const c=sc.cues,P=vt_once(sc,()=>({g0:vt_g0(sc),reg:wAt(sc,"portal","registered"),pressed:wAt(sc,"zoe","pressed"),typed:wAt(sc,"zoe","typed"),f51:wAt(sc,"corrected","fifty-one"),
    f19:wAt(sc,"corrected","nineteen"),f11:wAt(sc,"cut","eleven"),f7:wAt(sc,"cut","seven"),mei:wAt(sc,"next","Mei's team"),doc:wAt(sc,"next","the document"),
    sent:wAt(sc,"four","sent"),date:wAt(sc,"took","with the date"),settled:wAt(sc,"one","settled")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bench",keys:[[0,960,540,1]],d:2.4,draw:(x,tt)=>vt_ask(x,tt,c,P)}]);
  setScreen(ctx,S);dq_kicker(ctx,"4","Ask the graduate",{a:ag_in(t,0.8,0.5)});vt_date(ctx,S,"9 to 20 February",ag_io(t,c.portal,c.answered-0.6,0.5));});

/* ---------------------------------------------------------------- 5 · Another record, kept apart
   Jun, and a double degree's two awards. On Monday 23 February the check lays the boards' approved awards (brass) over the list's
   (steel), award by award: 1,101 and 1,099; two Bachelor of Arts awards missing, for graduates the student system held with Laws only;
   every row on the list passed. Found in time, both printed; every other award and date agreed. The boards' lists see the gap because
   they're kept apart: a copy of the student system, in their place, agrees with the list as it was, and both are wrong. Then Ezo by
   night: the stars fix how far north, not how far east, which needed a clock his teams didn't have. Back at the bench, the boards'
   lists: they can say an award is missing, not how a name is spelled. */
const VT_AX=i=>470+i*345,VT_ROW={boards:330,list:520};
function vt_apart(x,tt,c,P){const G=P.g0+tt,M0=c.monday-0.3,K0=c.kept-0.4,C0=c.copy;
  vt_who(x,"jun",280,G,1);
  // a double degree: two awards, two certificates
  let q=vt_pop(tt,c.double+0.4,P.listW-0.6);vt_award(x,520,300,"Bachelor of Arts",{k:q.k,a:q.a});q=vt_pop(tt,c.double+0.8,P.listW-0.6);vt_award(x,870,300,"Bachelor of Laws",{k:q.k,a:q.a});
  dq_chip(x,520,470,"two awards, two certificates",{icon:"certificate",a:ag_io(tt,P.twoCert-0.3,M0,0.4)});
  // the boards' approved awards, and the list's, award by award; after the copy, a copy of the student system in the boards' place
  const W4=["Bachelor of Arts","Bachelor of Laws","Bachelor of Arts","Bachelor of Laws"],bA=ag_io(tt,P.boardsW-0.3,C0-0.1,0.4),cA=ag_io(tt,C0+0.3,c.like-0.3,0.4),
    fixed=ag_in(tt,P.both,0.6)*(1-ag_in(tt,C0-0.1,0.4)),asWas=ag_in(tt,C0+0.3,0.4);
  dq_T(x,"The exam boards' approved lists",VT_AX(0),VT_ROW.boards-18,{w:700,size:28,col:"brass",a:bA});
  dq_T(x,"A copy of the student system",VT_AX(0),VT_ROW.boards-18,{w:700,size:28,col:"steel",a:cA});
  const lA=ag_io(tt,P.listW-0.3,c.like-0.3,0.4);
  // the list's name under its row, the boards' over theirs: the stamps between the rows stay clear
  dq_T(x,"The list",VT_AX(0),VT_ROW.list+VT_AWARD.h+40,{w:700,size:28,col:"steel",a:lA*(1-ag_in(tt,C0-0.1,0.3))});
  dq_T(x,"The list, as it was",VT_AX(0),VT_ROW.list+VT_AWARD.h+40,{w:700,size:28,col:"steel",a:lA*ag_in(tt,C0+0.3,0.4)});
  W4.forEach((s,i)=>{const miss=i%2===0,glow=ag_io(tt,c.missing,P.both,0.5)*(miss?1:0);
    // each card fades in as it springs, one after another: none waits, small, for its turn
    if(bA>0.004)vt_award(x,VT_AX(i),VT_ROW.boards,s,{edge:"brass",k:tt-P.boardsW+0.3-i*0.12,a:bA*ag_in(tt,P.boardsW-0.3+i*0.12,0.25)});
    if(cA>0.004)vt_award(x,VT_AX(i),VT_ROW.boards,s,{edge:"steel",dash:miss,ghost:miss,a:cA});
    if(lA>0.004){const li=ag_in(tt,P.listW-0.3+i*0.12,0.25);if(miss){const sol=fixed*(1-asWas);vt_award(x,VT_AX(i),VT_ROW.list,s,{edge:"steel",dash:true,ghost:true,glow,glowCol:"stop",a:lA*li*(1-sol)});
        vt_award(x,VT_AX(i),VT_ROW.list,s,{edge:"steel",a:lA*sol});}
      else vt_award(x,VT_AX(i),VT_ROW.list,s,{edge:"steel",k:tt-P.listW+0.3-i*0.12,a:lA*li});}
    const px=VT_AX(i)+VT_AWARD.w/2,y0=VT_ROW.boards+VT_AWARD.h+8,y1=VT_ROW.list-8;
    // the check's verdicts, award by award: the two missing ones fail until both certificates are put back, then pass like the rest
    const u0=ag_in(tt,P.byAward+i*0.35,0.5);if(miss){vt_pair(x,px,y0,y1,"stop",u0,ag_io(tt,P.byAward,P.both+0.2,0.3));vt_pair(x,px,y0,y1,"pass",1,ag_io(tt,P.both+0.2,C0-0.1,0.3));}
    else vt_pair(x,px,y0,y1,"pass",u0,ag_io(tt,P.byAward,C0-0.1,0.3));
    vt_pair(x,px,y0,y1,"pass",ag_in(tt,C0+0.6+i*0.25,0.5),ag_io(tt,C0+0.6,c.like-0.3,0.3));});
  q=vt_pop(tt,c.approved,K0);vt_count(x,VT_AX(0),250,"1,101","approved by the boards",{col:"brass",a:q.a});
  q=vt_pop(tt,c.held,K0);vt_count(x,VT_AX(2),250,"1,099","on the list",{col:"steel",a:q.a});
  dq_chip(x,VT_AX(0),734,"Arts and Laws, held with Laws only",{a:ag_io(tt,c.laws,c.found-0.3,0.4)});
  q=vt_pop(tt,c.passed,c.found-0.3);dq_tag(x,1290,740,"pass",{text:"EVERY ROW PASSED",to:[VT_AX(3)+VT_AWARD.w/2,VT_ROW.list+VT_AWARD.h],k:q.k,a:q.a});
  dq_chip(x,VT_AX(0),734,"found three days before the list went",{icon:"clock",a:ag_io(tt,c.found,c.agreed-0.3,0.4)});
  dq_chip(x,1110,734,"both Arts certificates printed",{icon:"certificate",col:"pass",a:ag_io(tt,P.both,c.agreed-0.3,0.4)});
  dq_chip(x,VT_AX(0),734,"every other award and date agreed",{icon:"tick",col:"pass",a:ag_io(tt,c.agreed,K0,0.4)});
  // kept apart; a copy would agree, and both be wrong
  const k1=dq_chip(x,VT_AX(0),250,"kept apart",{col:"brass",a:ag_io(tt,c.kept,C0-0.4,0.4)});
  dq_chip(x,k1.x+k1.w+16,250,"made from the boards' own decisions",{a:ag_io(tt,P.own-0.3,C0-0.4,0.4)});
  dq_chip(x,VT_AX(0),734,"they agree, and both are wrong",{icon:"tick",a:ag_io(tt,P.bothWrong-0.2,c.like-0.3,0.4)});
  q=vt_pop(tt,c.consistent,c.like-0.3);dq_textCard(x,VT_AX(2),120,640,{kick:"In data quality's words",title:"Consistent, not accurate"},{k:q.k,a:q.a});}
// back at the bench: the boards' lists can say an award is missing, not how a name is spelled
function vt_apartEnd(x,tt,c,P){const G=P.g0+tt,t0=c.spelled-0.3;vt_who(x,"jun",280,G,1);
  vt_boards(x,960,850,{});dq_chip(x,960,470,"The exam boards' approved lists",{align:"center",col:"brass"});
  dq_chip(x,960,550,"can say an award is missing",{align:"center",icon:"tick",col:"pass",a:ag_in(tt,P.missingW-0.3,0.5)});
  dq_chip(x,960,622,"can't say how a name is spelled",{align:"center",icon:"dash",col:"none",a:ag_in(tt,P.spelledW-0.3,0.5)});}
scene("apart",(ctx,S,t,sc)=>{const c=sc.cues,P=vt_once(sc,()=>({g0:vt_g0(sc),twoCert:wAt(sc,"double","two certificates"),listW:wAt(sc,"monday","the list"),
    boardsW:wAt(sc,"monday","exam boards'"),byAward:wAt(sc,"monday","award by award"),both:wAt(sc,"found","both Arts"),own:wAt(sc,"made","own decisions"),
    bothWrong:wAt(sc,"copy","both would be wrong"),notEast:wAt(sc,"east","not how far east"),clock:wAt(sc,"east","an exact clock"),none:wAt(sc,"east","none"),
    missingW:wAt(sc,"spelled","missing"),spelledW:wAt(sc,"spelled","spelled")}));
  const N0=c.like-0.1,N1=c.spelled-0.3;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bench",keys:[[0,960,540,1]],d:2.4,draw:(x,tt)=>vt_apart(x,tt,c,P)},
    {at:N0,place:"vt_shoreNight",keys:[[0,960,540,1]],draw:(x,tt)=>{const [sx,sy]=vt_starAt(0.5),ang=vt_starAng(0.5);
      vt_stars(x,tt,{out:1});vt_bigStar(x,sx,sy,1,1.2);vt_quadrant(x,ang,1);vt_figure(x,935,VT_Q.y,236,{dir:-1,jacket:VT_CLOTH.leader,lean:0.12});
      const q=vt_pop(tt,P.clock-0.3,null);dq_textCard(x,120,480,600,{kick:"How far east",title:"An exact clock to carry",sub:"his teams had none"},{edge:"none",k:q.k,a:q.a});}},
    {at:N1,place:"bench",keys:[[0,960,540,1]],draw:(x,tt)=>vt_apartEnd(x,tt,c,P)}]);
  // by night, the sheet as the stars left it: north fixed, east still open
  const shA=ag_io(t,N0+0.3,N1-0.6,0.6);if(shA>0.004){setScreen(ctx,S);const ea=ag_in(t,P.notEast,0.8);
    vt_sheet(ctx,t,{n:10,wedge:1,lat:1,pull:1,bandK:lerp(1,2.4,ea),a:shA});
    withA(ctx,shA,()=>{dq_T(ctx,"how far north",1140,236,{w:700,size:28,col:"brass",a:ag_in(t,N0+1.0,0.6)});
      const e=vt_sheetEnd(1);dq_T(ctx,"how far east?",e[0],e[1]+64,{w:700,size:28,col:"steel",align:"center",a:ea});});}
  vt_tag(ctx,S,"Ezo · 1800",ag_io(t,N0+0.3,N1-0.4,0.5));
  const day=1-ag_io(t,N0-0.3,N1,0.4);setScreen(ctx,S);dq_kicker(ctx,"5","Another record, kept apart",{a:ag_in(t,0.8,0.5)*day});
  vt_date(ctx,S,"Monday 23 February",ag_io(t,c.monday+0.2,N0-0.3,0.5));});

/* ---------------------------------------------------------------- 6 · Say which reference
   Jun, and the project's file of the list's checks, beside each its owner, its dimension and, for the awards check, its reference;
   the name checks have no reference but the rule. For names, the reference is the graduate, with the date each was confirmed. The
   data contract's rule for awards names its dimension and its method; the scorecard counts allowed and true apart. A check is only as
   true as its reference: say which, and the reader knows what it can tell, and what it can't. */
const VT_CHECKS=["names_are_allowed","  owner: Mei Tanaka","  dimension: validity","awards_match_the_boards","  owner: Mei Tanaka","  dimension: accuracy",
  [["  reference: ",null],["the exam boards' approved lists","brass"]],"name_as_printed",[["  reference: ",null],["the graduate","brass"]],"  confirmed_on: name_confirmed_on"];
function vt_which(x,tt,c,P){const G=P.g0+tt,W0=c.contract-0.4,C1=c.scorecard-0.4;vt_who(x,"jun",280,G,1);
  // the file of checks: each line as it's said
  const at=[c.beside-0.2,P.owner,P.measures,c.beside,P.owner+0.2,P.measures+0.2,P.ref,c.graduate,c.graduate+0.4,P.date],wa=ag_io(tt,c.every+0.3,W0,0.4);
  const lit=tt<c.validity-0.2?[]:tt<c.awards-0.2?[0,1,2]:tt<c.graduate-0.2?[3,4,5,6]:[7,8,9];
  dq_window(x,480,140,1360,600,{logo:"dbt",product:"dbt",title:"the list's checks",a:wa,draw:(cx,b)=>{dq_code(cx,b.x+12,b.y,VT_CHECKS,{lh:46,w:b.w-24,lit,lineA:(l,i)=>ag_in(tt,at[i],0.4)});
    dq_chip(cx,b.x+560,b.y+46*2+23,"no reference but the rule itself",{col:"none",a:ag_io(tt,c.validity+0.6,c.awards-0.2,0.4)});
    dq_chip(cx,b.x+560,b.y+46*2+23,"a name is allowed, and no more",{a:ag_io(tt,c.nomore+0.2,c.awards-0.2,0.4)*0});}});
  // the data contract
  // the rule as the contract has it (governance/5-data-contracts/mart_graduations__graduation_list.yaml), its other lines left out
  const ca=ag_io(tt,c.contract+0.1,C1,0.4),cl=tt<P.dim-0.1?[]:tt<P.method-0.1?[3]:[4];
  dq_window(x,480,160,1360,460,{product:"Data contract",title:"the graduation list",a:ca,draw:(cx,b)=>dq_code(cx,b.x+12,b.y,["quality:","  - id: awards_match_the_boards","    …",
    [["    dimension: ",null],["accuracy","steel"]],[["    method: ",null],["reconciliation","steel"]]],{lh:46,w:b.w-24,lit:cl,lineA:(l,i)=>ag_in(tt,[c.contract+0.1,c.contract+0.3,c.contract+0.3,P.dim,P.method][i],0.4)})});
  // the scorecard: allowed, and true
  const sa=ag_in(tt,c.scorecard+0.1,0.4);if(sa>0.004){x.save();x.globalAlpha*=sa;dq_card(x,480,190,1160,300,{});dq_label(x,508,242,"Scorecard · the graduation list",{});
    dq_rows(x,508,268,[{h:"Dimension",w:250},{h:"Says",w:220},{h:"Check",w:520,f:"mono"},{h:"",w:110}],
      [["Validity","allowed","names_are_allowed",{s:"",mark:"pass"}],["Accuracy","true","awards_match_the_boards",{s:"",mark:"pass"}]],
      {rh:56,rowA:(r,i)=>ag_in(tt,i?P.trueW-0.2:P.allowedW-0.2,0.4)});x.restore();}
  let q=vt_pop(tt,c.only,null);dq_textCard(x,480,540,900,{title:"A check is only as true as its reference"},{edge:"brass",k:q.k,a:q.a});
  dq_chip(x,480,700,"what it can tell",{icon:"tick",col:"pass",a:ag_in(tt,P.tell-0.2,0.5)});
  const w1=dq_tw(x,"what it can tell",{w:700,size:28})+84;dq_chip(x,480+w1+20,700,"what it can't",{icon:"dash",col:"none",a:ag_in(tt,P.cant-0.2,0.5)});}
scene("which",(ctx,S,t,sc)=>{const c=sc.cues,P=vt_once(sc,()=>({g0:vt_g0(sc),owner:wAt(sc,"beside","owner"),measures:wAt(sc,"beside","what it measures"),
    ref:wAt(sc,"beside","its reference"),date:wAt(sc,"graduate","the date"),dim:wAt(sc,"contract","the dimension"),method:wAt(sc,"contract","the method"),
    allowedW:wAt(sc,"scorecard","allowed"),trueW:wAt(sc,"scorecard","true"),tell:wAt(sc,"say","what it can tell"),cant:wAt(sc,"say","what it can't")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bench",keys:[[0,960,540,1]],d:2.4,draw:(x,tt)=>vt_which(x,tt,c,P)}]);
  setScreen(ctx,S);dq_kicker(ctx,"6","Say which reference",{a:ag_in(t,0.8,0.5)});});

/* ---------------------------------------------------------------- 7 · Allowed, and true
   Ezo's shore by day, the team at work and the sheet over it; by night, the stars, and the walk's end pulled to their latitude. The
   bench on Thursday 26 February: Zoë, and the list in its envelope to the printer; what was put right, and found; every name allowed
   all along, and now 1,013 confirmed by the person they belong to. A check says it's allowed; only a reference says it's true. */
function vt_trueEnd(x,tt,c,P){const G=P.g0+tt,X0=c.check-0.4,E0=c.breath-0.1;vt_who(x,VT_ZOE,300,G,ag_in(tt,c.printer-0.4,0.6));
  let q=vt_pop(tt,c.printer,E0);vt_whole(x,q.a,cx=>vt_envelope(cx,520,300,{label:"To the printer",sub:"the March list · 5 pm",close:ag_in(tt,P.went,1.0),k:q.k}));
  q=vt_pop(tt,P.eighty-0.2,X0);dq_chip(x,1180,330,"88 names put right by the graduates",{icon:"tick",col:"pass",a:q.a});
  q=vt_pop(tt,P.twoAw-0.2,X0);dq_chip(x,1180,420,"2 awards found in the boards' lists",{icon:"tick",col:"pass",a:q.a});
  q=vt_pop(tt,c.along,X0);dq_chip(x,1180,510,"every name allowed, all along",{icon:"tick",col:"pass",a:q.a});
  q=vt_pop(tt,c.now+0.2,X0);dq_figure(x,1180,680,"1,013","confirmed by the person they belong to",{col:"brass",size:96,a:q.a});
  q=vt_pop(tt,c.check,E0);dq_textCard(x,1180,300,640,{kick:"A check",title:"says it's allowed"},{edge:"pass",k:q.k,a:q.a});
  q=vt_pop(tt,c.reference,E0);dq_textCard(x,1180,480,640,{kick:"A reference",title:"says it's true"},{edge:"brass",k:q.k,a:q.a});}
scene("true",(ctx,S,t,sc)=>{const c=sc.cues,P=vt_once(sc,()=>({g0:vt_g0(sc),byNight:wAt(sc,"walked","by night"),north:wAt(sc,"stars","how far north"),really:wAt(sc,"stars","really"),
    went:wAt(sc,"printer","printer"),eighty:wAt(sc,"put","eighty-eight"),twoAw:wAt(sc,"put","two awards")}));
  const N0=P.byNight-0.4,B0=c.printer-0.4;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"vt_shore",keys:[[0,960,540,1]],draw:(x,tt)=>{const sv=vt_survey(tt,0.3,1.4);vt_team(x,tt,{set:1,taut:sv.taut,sight:sv.sight});}},
    {at:N0,place:"vt_shoreNight",later:true,keys:[[0,960,540,1]],draw:(x,tt)=>{const cr=lerp(0.3,0.5,ag_sine((tt-N0)/(c.stars-N0))),[sx,sy]=vt_starAt(cr),ang=vt_starAng(cr);
      vt_stars(x,tt,{out:ag_in(tt,N0,2.0)});vt_bigStar(x,sx,sy,ag_in(tt,N0+0.6,0.8),1.2);vt_quadrant(x,ang,1);vt_figure(x,935,VT_Q.y,236,{dir:-1,jacket:VT_CLOTH.leader,lean:0.12});
      vt_height(x,ang,ag_in(tt,P.north,1.2),1);}},
    {at:B0,place:"bench",keys:[[0,960,540,1]],draw:(x,tt)=>vt_trueEnd(x,tt,c,P)}]);
  // the sheet: the walk, then the stars
  const shA=ag_io(t,0.5,B0-0.4,0.6);if(shA>0.004){setScreen(ctx,S);
    vt_sheet(ctx,t,{n:lerp(6,10,ag_sine((t-0.5)/(c.walk+1.6))),wedge:1,lat:ag_in(t,P.north,1.2),pull:ag_in(t,P.really,1.6),a:shA});
    withA(ctx,shA,()=>{dq_T(ctx,"the walk:",1600,560,{w:700,size:28,col:"steel",a:ag_in(t,c.walk,0.5)});dq_T(ctx,"how far",1600,596,{w:700,size:28,col:DQ.soft,a:ag_in(t,c.walk+0.3,0.5)});
      dq_T(ctx,"they came",1600,632,{w:700,size:28,col:DQ.soft,a:ag_in(t,c.walk+0.5,0.5)});
      dq_T(ctx,"the stars: how far north",1140,236,{w:700,size:28,col:"brass",a:ag_in(t,P.north+0.3,0.6)});});}
  vt_tags(ctx,S,t,[[0.3,"Ezo · 1800"],[B0-0.4,null]]);
  setScreen(ctx,S);dq_kicker(ctx,"7","Allowed, and true",{a:ag_in(t,B0+0.4,0.6)});vt_date(ctx,S,"Thursday 26 February",ag_in(t,c.printer+0.2,0.5));
  dq_end(ctx,S,t,c.breath,"Valid isn't true","A check says it's allowed. Only a reference says it's true.","Film 3 of 4","Fit for use");});

ag_cutInto(["allowed","reference","ask","apart","which"]);
