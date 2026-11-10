/* ===== Learning while doing: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves, or cuts where both show the same people (the
   circle's learners in the street, Ivy at the page and then at Sam's desk). Sizes in the 1920 x 1080 frame. */

const LW_LAST="Learn on the real work, beside someone, then teach it.";
// the light on people out of doors in Angicos, and under a bare bulb at night
const LW_OUT={light:"day",wall:0},LW_NIGHT={light:"evening",wall:0.12,shade:0.5,warm:0.4};
// the film's number and title at the top left, from the second chapter on; pale in a room at night (ev, 0 to 1)
function lw_kick(ctx,S,a,ev){if(a<=0.004)return;setScreen(ctx,S);ev=ev||0;
  if(ev<1)lp_kicker(ctx,"3","Learning while doing",{a:a*(1-ev)});if(ev>0)lp_kicker(ctx,"3","Learning while doing",{a:a*ev,light:"evening"});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function lw_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// a sheet with one number, the same way
function lw_fig(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_figure(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const lw_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag, or a pill, that comes in at t0 and goes at t1 (null: stays)
function lw_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function lw_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// a row of tags, each coming in at its own time, laid out from their drawn widths
function lw_tags(ctx,t,words,x,y,t0,step,o){let px=x;words.forEach((s,i)=>{const b=lp_tag(ctx,px,y,s,Object.assign({},o,{a:ag_in(t,t0+i*step,0.4)}));px+=b.w+18;});}
// a green tick in a disc, springing in from t0
function lw_tick(ctx,t,t0,x,y){if(t<t0)return;const f=lerp(0.6,1,ag_spr(t-t0,0,0.5));ctx.save();ctx.globalAlpha*=ag_in(t,t0,0.3);ctx.fillStyle=rgba(LP.green,1);
  ctx.beginPath();ctx.arc(x,y,22*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",x,y,30*f,[255,255,255]);ctx.restore();}
// a near hand that comes up over 0.45 s from t0 to hold what fn draws (and goes down from t1): lp_person's pose, blended from the one
// before, and the thing held, faded in as the hand arrives
function lw_hold(t,t0,t1,fn){const u=ag_in(t,t0,0.45)*(t1==null?1:1-ag_in(t,t1,0.45));if(u<=0)return{};
  return{pose:"hang",pose2:"hold",mix:u,holdBack:(c,h)=>{const pa=ag_in(u,0.5,0.5);if(pa<=0)return;c.save();c.globalAlpha*=pa;fn(c,h);c.restore();}};}
// the desk where two pair: someone on the left (Jun) and Ivy on the right behind it, one laptop between them; o.la, o.ra fade either
function lw_desk(x,tt,o){o=o||{};const L={light:o.light||"day"};
  lp_person(x,o.left||"jun",760,760,0.76,{t:tt,cut:860,a:o.la==null?1:o.la,light:L});
  lp_person(x,o.right||"ivy",1160,760,0.76,{t:tt,flip:true,cut:860,a:o.ra==null?1:o.ra,light:L});
  lp_table(x,440,866,1040,{floor:1040});lp_laptop(x,960,838,200,{glow:0.6});}
// the culture circle's room at night, drawn the same in every moment of it: four learners behind the table, the projector on it, the
// coordinator by the wall; o.sl the slide's light, o.slide what it shows (lw_slide), o.hrs the forty hours on a sheet ({a, k, done})
function lw_circle(x,tt,o){o=o||{};const sl=o.sl||0;lw_slideLight(x,sl);if(o.slide&&sl>0.004)lw_slide(x,Object.assign({},o.slide,{a:sl}));
  const hr=o.hrs;if(hr&&hr.a>0.004){x.save();x.globalAlpha*=hr.a;if(hr.k!=null)ag_about(x,1360,336,lerp(0.6,1,ag_spr(hr.k,0,0.5)));
    lp_sheet(x,1100,176,520,320,{light:"evening"});lp_label(x,1140,236,"Forty hours");lw_hours(x,1140,276,{done:hr.done});x.restore();}
  for(const [k,px] of [["elder",170],["builder",400],["washer",630],["youth",860]])lp_person(x,LW_PEOPLE[k],px,690,0.74,{t:tt,cut:794,light:LW_NIGHT});
  lp_table(x,40,800,980);lw_projector(x,930,786,1);
  lp_person(x,LW_PEOPLE.coord,1770,660,0.84,{t:tt,flip:true,light:LW_NIGHT});}

/* ---------------------------------------------------------------- 1. Their own words: Angicos, 1963 */
scene("circles",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),P=LW_PEOPLE,out=LW_OUT,nt=LW_NIGHT;
  // the street on the day the president comes, drawn the same until the town goes dark
  const crowd=(x,tt)=>{for(const [k,px,fl] of [["farmer",300,false],["washer",620,false],["elder",960,false],["youth",1300,true],["cook",1620,true]])
    lp_person(x,P[k],px,720,0.74,{t:tt,flip:fl,light:out});};
  const order=[5,2,8,0,10,3,7,1,9,4,6];          // the order the street's windows light in
  const h0=c.steps+0.6,h1=w("forty","fortieth",0.3); // the forty hours fill, one by one, until the fortieth
  ag_shots(ctx,S,t,sc.dur,[
    // Angicos, by day; the evening classes, and who signs up
    {at:0,place:"lwTown",keys:[[0,1000,560,1.1],[c.when+0.4,960,540,1.0]],d:3,draw:(x,tt)=>{
      lw_sheet(x,tt,c.when+0.2,150,120,600,{kick:"Angicos, Brazil",title:"January 1963",sub:"A small town in the dry north-east"},{light:null,pin:false,out:c.adults-0.4});
      lw_sheet(x,tt,c.adults+0.2,150,120,600,{kick:"Evening classes",title:"About 380 adults sign up"},{light:null,pin:false,out:c.guides-0.6});
      for(const [k,px,fl,word,tag] of [["farmer",860,false,"farm","Farm workers"],["builder",1240,false,"builders","Builders"],["washer",1620,true,"washerwomen","Washerwomen"]]){
        const t0=w("adults",word,-0.3);lp_person(x,P[k],px,700,0.82,{t:tt,flip:fl,a:ag_in(tt,t0,0.6),light:out});lw_tag(x,tt,t0+0.3,null,px,380,tag,{align:"center"});}}},
    // some twenty students from the university in Natal run the classes, at night
    {at:c.guides-0.3,place:"lwCircle",keys:[[c.guides-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      lp_person(x,P.student,330,660,0.9,{t:tt,light:nt});lp_person(x,P.coord,690,660,0.9,{t:tt,light:nt});
      lw_sheet(x,tt,w("guides","twenty",-0.2),1040,200,680,{kick:"From the university in Natal",title:"Some twenty students",lines:["Trained by an educator, Paulo Freire"]},
        {light:"evening",u:ag_in(tt,w("guides","trained",-0.1),0.5)});}},
    // the problem: three adults in four can't read or write, so they can't vote; they sign papers they can't read, others read their letters
    {at:c.read-0.3,place:"lwTown",keys:[[c.read-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      lw_sheet(x,tt,c.read+0.1,140,120,700,{kick:"Angicos, 1963",title:"Three adults in four can't read or write",lines:["So they can't vote","They sign papers they can't read","Others read their letters to them"]},
        {col:LP.amber,light:null,pin:false,u:lw_u(tt,[w("vote","vote",-0.2),w("letters","sign",-0.1),w("letters","letters",-0.1)])});
      lp_person(x,P.farmer,1100,700,0.82,Object.assign({t:tt,light:out},lw_hold(tt,w("letters","sign",-0.1),null,lw_heldPaper)));
      lp_person(x,P.washer,1500,700,0.82,Object.assign({t:tt,flip:true,light:out},lw_hold(tt,w("letters","letters",-0.1),null,lw_heldLetter)));}},
    // the old way: a children's primer, nothing about their lives; many give up; something has to change
    {at:c.primers-0.3,place:"lwClass",keys:[[c.primers-0.3,960,540,1.0],[c.change-0.2,1000,520,1.06]],dis:1.0,draw:(x,tt)=>{const g0=w("primers","give",-0.2);
      lw_easel(x,1360,300,600);lw_primer(x,1010,240,700);
      lp_person(x,P.elder,220,700,0.8,{t:tt,light:nt});
      lp_person(x,P.youth,490,700,0.8,{t:tt,a:1-ag_in(tt,g0,0.8),light:nt});
      lp_person(x,P.cook,760,700,0.8,{t:tt,a:1-ag_in(tt,g0+0.3,0.8),light:nt});
      lw_tag(x,tt,w("primers","Eva",-0.1),null,1360,180,"Eva saw the grape",{align:"center"});
      lw_tag(x,tt,w("primers","nothing",-0.1),g0-0.1,1360,740,"Nothing about their lives",{align:"center",col:LP.amber});
      lw_tag(x,tt,g0+0.3,null,1360,740,"Many give up",{align:"center",col:LP.amber});}},
    // Freire's team listens for the town's own words, writes down about 400, and chooses a handful
    {at:c.own-0.3,place:"lwTown",keys:[[c.own-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const f0=w("listen","handful",-0.1);
      lw_sheet(x,tt,c.own+0.1,140,110,680,{kick:"Freire's team",title:"The town's own words",lines:["Listening to how people talk","About 400 words written down","A handful chosen"]},
        {light:null,pin:false,u:lw_u(tt,[w("listen","listen",-0.1),w("listen","four",-0.1),f0])});
      lw_tags(x,tt,["belota","voto","povo"],140,530,f0+0.4,0.2,{col:LP.ink});lw_tags(x,tt,["sapato","milho","feira"],140,610,f0+1.0,0.2,{col:LP.ink});
      lp_person(x,P.student,1080,700,0.82,Object.assign({t:tt,light:out},lw_hold(tt,w("listen","write",-0.5),null,lw_heldNote)));
      lp_person(x,P.farmer,1500,700,0.82,{t:tt,flip:true,light:out});}},
    // a culture circle, each evening: learners, and a coordinator; a picture from their lives, one word, its syllables, new words; one
    // small step each evening, to the fortieth hour
    {at:c.circle-0.3,place:"lwCircle",keys:[[c.circle-0.3,960,540,1.0],[w("picture","picture",-0.2),1180,430,1.22],[c.steps-0.3,960,540,1.0]],d:1.6,dis:1.0,draw:(x,tt)=>{
      const p0=w("picture","picture",-0.3),s0=w("syllables","break",-0.1),sl=ag_in(tt,p0,0.8)*(1-ag_in(tt,c.steps-0.2,0.6));
      lw_circle(x,tt,{sl,slide:{pic:ag_in(tt,p0+0.3,0.8),word:ag_in(tt,w("picture","belota",-0.1),0.5),syl:ag_in(tt,s0,0.6),fam:ag_in(tt,w("syllables","syllables",0.2),1.2),
          news:[0,1,2].map(i=>ag_in(tt,w("syllables","new",0.1)+i*0.35,0.5))},
        hrs:{a:ag_in(tt,c.steps+0.3,0.4),k:tt-c.steps-0.3,done:40*clamp((tt-h0)/(h1-h0),0,1)}});
      lw_tag(x,tt,w("circle","learners",-0.1),c.picture-0.4,515,390,"Learners",{align:"center"});
      lw_tag(x,tt,w("circle","coordinator",-0.1),c.picture-0.4,1880,320,"A coordinator, not a teacher",{align:"right"});
      lw_tag(x,tt,w("picture","tassels",-0.2),s0-0.2,1360,620,"A hammock's tassels",{align:"center"});
      lw_tag(x,tt,w("steps","knows",-0.3),null,515,390,"What each person knows counts",{align:"center"});
      lw_pill(x,tt,w("forty","April",-0.2),null,1360,560,"2 April 1963 · the last class",{col:LP.green,icon:"tick"});}},
    // the fortieth hour: the president comes; the organisers' count, still argued over
    {at:w("forty","president",-0.3),place:"lwTown",cut:true,keys:[[w("forty","president",-0.3),960,540,1.0]],draw:(x,tt)=>{
      crowd(x,tt);
      lw_tag(x,tt,w("forty","president",0.1),c.count-0.3,960,340,"The president of Brazil comes",{align:"center"});
      lw_fig(x,tt,w("count","count",-0.1),140,110,620,{kick:"The organisers' count",num:"About 300",label:"can now read and write"},{col:LP.green,light:null,pin:false,out:c.spread-0.7});
      lw_tag(x,tt,w("count","argue",-0.1),c.spread-0.7,1880,340,"Still argued over: how many, and how well",{align:"right"});}},
    // a year later, at dusk (the street's people gone first): the method spreads, and a national plan; that April it's stopped, and Freire
    // jailed, then exiled
    {at:c.spread-0.3,place:"lwTownEve",later:true,keys:[[c.spread-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const s0=w("spread","spreads",-0.2),k0=w("stop","stops",-0.1);
      lw_windows(x,LW_WINS.map((_,i)=>ag_in(tt,s0+order.indexOf(i)*0.3,0.8)*(1-ag_in(tt,k0+order.indexOf(i)*0.06,0.5))));
      lw_sheet(x,tt,w("spread","national",-0.2),140,120,660,{kick:"January 1964",title:"A national plan",lines:["To take the method across Brazil"]},{col:LP.blue,light:null,pin:false});
      lw_pill(x,tt,k0+0.4,null,470,450,"Stopped, April 1964",{col:LP.amber,icon:"cross"});
      lw_tag(x,tt,w("stop","jailed",-0.1),null,140,540,"Freire: jailed, then exiled",{col:LP.amber});}},
    // abroad, the book
    {at:c.book-0.3,place:"lwAbroad",keys:[[c.book-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const b0=c.book+0.2;
      if(tt>=b0)lw_book(x,420,190,320,{a:ag_in(tt,b0,0.4),k:tt-b0});
      lw_tag(x,tt,w("book","writes",-0.1),null,840,330,"Written in exile, in Chile, 1968");
      lw_tag(x,tt,w("book","most-cited",-0.2),null,840,430,"One of the most-cited books in the social sciences");}},
    // learning data work can feel like those primers
    {at:c.data-0.3,place:"lpRoom",keys:[[c.data-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      lp_screen(x,560,190,800,380,{a:ag_in(tt,c.data-0.1,0.5),draw:(cx,X,Y,Wd,Hd)=>lw_tutorial(cx,X,Y,Wd,Hd)});
      lw_tag(x,tt,w("data","nothing",-0.1),null,960,660,"Nothing about your job",{align:"center",col:LP.amber});}},
    // skills grow faster on the real work, a small step at a time, beside someone who knows; and what you learn, you can teach
    {at:c.real-0.3,place:"lpRoom",later:true,keys:[[c.real-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.breath+0.2,0.8);
      if(g>0.004){x.save();x.globalAlpha*=g;lw_desk(x,tt,{light:"day"});x.restore();}
      lw_tag(x,tt,w("real","real",-0.1),c.breath+0.2,620,210,"On the real work",{align:"center"});
      lw_tag(x,tt,w("real","small",-0.1),c.breath+0.2,1300,210,"A small step at a time",{align:"center"});
      lw_tag(x,tt,w("real","beside",-0.1),c.breath+0.2,620,300,"Beside someone who knows",{align:"center"});
      lw_tag(x,tt,w("real","teach",-0.1),c.breath+0.2,1300,300,"Then teach it",{align:"center",col:LP.green});}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,"Learning while doing","Small steps on the real work, beside someone who knows","Leading data people · The new skills");
});

/* ---------------------------------------------------------------- 2. Beside Jun, an hour a day */
scene("beside",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const o0=w("jun","opens",-0.3);
  // the small changes, each finished in a day, and who reviewed it
  const CH=[["check","Tuesday","A check that every room has a name","Noor"],["clearer","Wednesday","A clearer description of a model","Sam"],["better","Thursday","A better name for a column","Noor"]];
  const rv=[w("review","Noor",-0.1),w("review","Sam",-0.1),w("review","Sam",0.5)];
  ag_shots(ctx,S,t,sc.dur,[
    // Ivy's first day; Jun opens the team's real project, not a course
    {at:0,place:"lwMorning",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      lw_sheet(x,tt,w("ivy","Ivy",-0.1),1080,170,640,{kick:"Monday 1 March 2027",title:"Ivy Reyes",sub:"Graduate data analyst",lines:["A degree in statistics"]},
        {light:"morning",out:c.jun-0.6,u:ag_in(tt,w("ivy","statistics",-0.2),0.5)});
      lp_screen(x,1080,150,700,480,{a:ag_in(tt,o0,0.5),draw:(cx,X,Y,Wd,Hd)=>lw_tree(cx,X,Y,Wd,Hd,{u:ag_in(tt,o0+0.3,1.4)})});
      lp_person(x,"jun",300,640,1.0,{t:tt,a:ag_in(tt,c.jun-0.5,0.6),light:mo});
      lp_person(x,"ivy",760,640,1.0,{t:tt,a:ag_in(tt,0.9,0.6),light:mo});}},
    // an hour a day for six weeks: one types, the other reads, asks and thinks ahead, and they swap; each day one small change, finished,
    // reviewed by someone else; the fifth week's, from her own page; twenty-five in six weeks; then changes of her own
    {at:c.pair-0.3,place:"lwMorning",later:true,keys:[[c.pair-0.3,960,540,1.0]],draw:(x,tt)=>{
      const su=ag_sine(ag_in(tt,w("pair","swap",-0.1),0.9)),tA=ag_in(tt,c.small-0.4,0.4);
      lw_desk(x,tt,{light:"morning",la:1-ag_in(tt,w("own","own",-0.6),0.8)+ag_in(tt,w("xp","two",-0.6),0.8)});
      lw_sheet(x,tt,c.pair+0.3,1420,150,420,{kick:"Pairing",title:"An hour a day",sub:"Her first six weeks"},{light:"morning",out:c.small-0.4});
      // who types and who reads, over their heads; at the swap the two tags change places, one passing over the other
      const ta=ag_in(tt,w("pair","types",-0.1),0.4)*(1-tA),ra=ag_in(tt,w("pair","reads",-0.1),0.4)*(1-tA);
      if(ta>0.004)lp_tag(x,lerp(1160,760,su),400-60*Math.sin(Math.PI*su),"Types",{align:"center",a:ta});
      if(ra>0.004)lp_tag(x,lerp(760,1160,su),400+40*Math.sin(Math.PI*su),"Reads, asks, thinks ahead",{align:"center",a:ra});
      CH.forEach(([word,day,title,by],i)=>{const t0=w("small",word,-0.2),a=ag_in(tt,t0,0.35)*(1-ag_in(tt,c.fifth-0.4,0.4));
        lw_change(x,120+i*590,140,500,{kick:day+" · Ivy and Jun",title},{a,k:tt-t0,light:"morning",rev:ag_in(tt,rv[i],0.4),revK:tt-rv[i],by:"Reviewed by "+by});});
      const f0=w("fifth","fifth",-0.2),g0=w("fourteen","goes",-0.1),fa=ag_in(tt,f0,0.35)*(1-ag_in(tt,c.count-0.4,0.4));
      const b5=lw_change(x,560,110,800,{kick:"Week 5 · From her own page",title:"The 14 renumbered rooms, matched",lines:["With a check, so no room drops out without a word"]},
        {a:fa,k:tt-f0,light:"morning",rev:ag_in(tt,g0,0.4),revK:tt-g0,by:"Reviewed by Noor, and in"});
      if(b5)lw_pill(x,tt,w("fourteen","renumbered",-0.1),g0-0.45,960,b5.y+b5.h+44,"14 renumbered rooms",{col:LP.amber});
      lw_weeks(x,555,120,{a:ag_in(tt,c.count+0.1,0.4)*(1-ag_in(tt,c.own-0.4,0.4)),n:clamp((tt-w("count","twenty-five",-0.4))/2.4,0,1)*25});
      const o6=w("own","writes",-0.2),r6=w("own","reviews",-0.1);
      lw_change(x,660,130,600,{kick:"Week 6",title:"Written by Ivy, on her own"},{a:ag_in(tt,o6,0.35)*(1-ag_in(tt,c.xp-0.4,0.4)),k:tt-o6,light:"morning",rev:ag_in(tt,r6,0.4),revK:tt-r6,by:"Reviewed by Jun"});
      lw_sheet(x,tt,w("xp","extreme",-0.2),560,130,800,{kick:"Extreme programming",title:"Two people, one keyboard",sub:"A way of making software, from the late 1990s"},{light:"morning"});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("ivy","university",-0.3),c.jun-0.3,0.5)});
  lw_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. Two hours every Thursday */
scene("thursday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"},lt={light:"late"};
  // the week of 1 April on the wall, and where its days and hours are (lw_week's own layout), for the meeting that moves
  const WK={x:300,y:150,w:1000,h:600},top=WK.y+110,dw=(WK.w-110)/5,hh=(WK.y+WK.h-30-top)/8,X=d=>WK.x+90+d*dw+dw/2,Y=h=>top+(h-9)*hh;
  // the meetings that fill a March week's gaps: no quiet week ever comes
  const FULL=[[0,10,2.5],[0,14,0.5],[0,15,1.5],[1,11,1],[1,12.5,2],[1,16,1],[2,9,1],[2,12,1.5],[2,14,2],[2,16,1],[3,11,1.5],[3,13,1.5],[3,15.5,1],[4,11,1.5],[4,14.5,0.5],[4,15,1.5]];
  const MO=["Updated in January","Updated in February","Updated in March"];
  ag_shots(ctx,S,t,sc.dur,[
    // the tools' docs change every month; learning saved for a quiet week never happens
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const m0=w("tools","every",-0.2),q0=c.wait-0.2;
      lw_sheet(x,tt,c.tools+0.1,300,170,580,{title:"dbt's docs",lines:MO},{light:"day",out:c.wait-0.5,u:clamp((tt-m0)/1.6,0,1)});
      lw_sheet(x,tt,c.tools+0.4,1040,170,580,{title:"Databricks' docs",lines:MO},{light:"day",out:c.wait-0.5,u:clamp((tt-m0-0.3)/1.6,0,1)});
      ["8","15","22"].forEach((d,i)=>{const t0=q0+0.3+i*0.35;if(tt>=t0)lw_week(x,520+i*60,150+i*60,820,470,{a:ag_in(tt,t0,0.35)*(1-ag_in(tt,c.time-0.5,0.4)),k:tt-t0,title:"Week of "+d+" March",full:1,extra:FULL,cover:i>0,back:i<2?ag_in(tt,t0+0.35,0.15):0});});
      lw_tag(x,tt,w("wait","never",-0.1),c.time-0.5,960,820,"No quiet week",{align:"center",col:LP.amber});}},
    // two hours every Thursday afternoon, from 1 April, free of meetings; Helena keeps it free, and a meeting asked for then moves
    {at:c.time-0.3,place:"lpRoom",later:true,keys:[[c.time-0.3,960,540,1.0]],draw:(x,tt)=>{const m0=w("helena","meeting",-0.2),f0=w("helena","offered",-0.2);
      lw_week(x,WK.x,WK.y,WK.w,WK.h,{title:"From Thursday 1 April",learn:ag_in(tt,w("time","two",-0.1),0.6),skip:6});
      lw_tag(x,tt,w("time","free",-0.1),null,X(3),810,"Free of meetings",{align:"center",col:LP.blue});
      lw_ask(x,"A meeting",{a:ag_in(tt,m0,0.35),at:clamp((tt-f0)/1.2,0,1),from:[X(3),Y(13.3)],to:[X(4),Y(15.5)+29]});
      lp_person(x,"helena",1640,650,0.95,{t:tt,flip:true,a:ag_in(tt,w("helena","Helena",-0.4),0.6),light:dy});
      lp_nameTag(x,1640,250,"helena",{align:"center",a:ag_in(tt,w("helena","Helena",-0.1),0.5)});}},
    // each picks one thing the work needs, from the tools' own docs, open beside the work; tries it on the real project, and writes it
    // down in the team's notes, beside the code
    {at:c.pick-0.3,place:"lpRoom",later:true,keys:[[c.pick-0.3,960,540,1.0]],draw:(x,tt)=>{const d1=w("pick","Databricks",-0.1),n0=w("try","write",-0.3),v=ag_in(tt,n0+0.3,0.3);
      lp_screen(x,260,150,1400,620,{draw:(cx,X0,Y0,Wd,Hd)=>{
        if(v<1){cx.save();cx.globalAlpha*=1-ag_in(tt,n0,0.3);lw_docs(cx,X0,Y0,Wd,Hd,{tab:tt>=d1?1:0,title:tt>=d1?"Time travel on a table":"Testing your models",add:ag_in(tt,w("try","try",-0.1),1.0)});cx.restore();}
        if(v>0){cx.save();cx.globalAlpha*=v;lw_notes(cx,X0,Y0,Wd,Hd,{u:0.75*ag_in(tt,n0+0.4,1.0)});cx.restore();}}});
      lw_tag(x,tt,w("pick","one",-0.1),c.try-0.4,960,830,"One thing the work needs",{align:"center"});}},
    // Ivy picks the sensors' counts: what one number in Sam's feed really means; she reads the guide and Sam's notes, then a week of counts
    {at:c.ivy-0.3,place:"lwLate",keys:[[c.ivy-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const g0=w("read","guide",-0.2),n0=w("read","notes",-0.2),k0=w("read","week",-0.3);
      lp_person(x,"ivy",400,650,0.95,{t:tt,light:lt});
      lw_fig(x,tt,w("ivy","sensors'",-0.1),820,170,560,{kick:"Sam's feed",num:"31",label:"One hour's count: what does it mean?"},{col:LP.orange,light:"late",out:g0-0.5});
      lw_sheet(x,tt,g0,820,150,440,{kick:"Reading",title:"The sensors' guide"},{light:"late"});
      lw_sheet(x,tt,n0,1320,150,440,{kick:"Reading",title:"Sam's notes"},{light:"late"});
      lp_screen(x,820,410,940,360,{a:ag_in(tt,k0,0.5),draw:(cx,X0,Y0,Wd,Hd)=>lw_counts(cx,X0+30,Y0+20,Wd-60,Hd-30,{u:ag_in(tt,k0+0.2,1.2),scan:clamp((tt-k0-1.4)/3.6,0,1)})});}}
  ]);
  lw_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Teach it to keep it */
scene("teach",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"},gy={light:"grey"};
  const P0=w("may","page",-0.2),R=[w("peak","most",-0.2),w("gap","zero",-0.2),w("heads","heads",-0.2)];
  ag_shots(ctx,S,t,sc.dur,[
    // 13 May, in the learning time: Ivy teaches the team, one page in twenty minutes; the camera goes down the page, part by part
    {at:0,place:"lwLate",later:true,keys:[[0,960,540,1.0],[R[0]-0.2,1258,380,1.45],[c.gap-0.2,1258,540,1.45],[c.heads-0.2,1258,690,1.45]],d:1.6,draw:(x,tt)=>{
      lw_sheet(x,tt,0.7,130,150,640,{kick:"Thursday 13 May",title:"Ivy teaches the team",lines:["In the learning time","One page, twenty minutes"]},
        {light:"late",out:R[0]-0.5,u:lw_u(tt,[w("may","learning",-0.1),w("may","page",-0.1)])});
      for(const [who,px] of [["helena",160],["noor",390],["sam",620]])lp_person(x,who,px,740,0.68,{t:tt,cut:844,light:lt});lp_table(x,20,850,800,{floor:1040});
      if(tt>=P0)lw_page(x,1140,150,740,{a:ag_in(tt,P0,0.35),k:tt-P0,rows:R.map(t0=>ag_in(tt,t0,0.8)),light:"late"});
      lp_person(x,"ivy",930,640,0.92,{t:tt,flip:true,light:lt});}},
    // getting ready, she found two things she couldn't explain, and asked Sam
    {at:c.ready-0.3,place:"lwGrey",cut:true,keys:[[c.ready-0.3,960,540,1.0]],draw:(x,tt)=>{const q0=w("ready","two",-0.1),l0=w("ready","learned",-0.1);
      lp_person(x,"ivy",600,650,0.92,{t:tt,light:gy});lp_person(x,"sam",1320,650,0.92,{t:tt,flip:true,a:ag_in(tt,w("ready","asked",-0.4),0.6),light:gy});
      const b1=lp_tag(x,960,230,"31: in the hour, or at once?",{align:"center",a:ag_in(tt,q0,0.4)}),b2=lp_tag(x,960,310,"A gap, or nobody there?",{align:"center",a:ag_in(tt,q0+0.6,0.4)});
      lw_tick(x,tt,l0,b1.x+b1.w+34,230);lw_tick(x,tt,l0+0.2,b2.x+b2.w+34,310);}},
    // Fiorella and Mayer: students who prepared to teach, then taught it, remembered more
    {at:c.study-0.3,place:"lwGrey",later:true,keys:[[c.study-0.3,960,540,1.0]],draw:(x,tt)=>{
      lw_sheet(x,tt,c.study+0.2,460,220,1000,{kick:"Logan Fiorella and Richard Mayer, 2013",title:"Students who prepared to teach, then taught it",lines:["Remembered more of it later","Than those who only studied it"]},
        {light:"grey",u:lw_u(tt,[w("taught","remembered",-0.1),w("taught","only",-0.1)])});}},
    // Freire, years after Angicos, in the circle's room
    {at:c.freire-0.3,place:"lwCircle",keys:[[c.freire-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      lw_sheet(x,tt,c.freire+0.3,460,260,1000,{kick:"Paulo Freire, 1996",title:"“Whoever teaches learns in teaching, and whoever learns teaches in learning.”"},{light:"evening"});}},
    // now the whole team reads a count the same way, not only Sam
    {at:c.spread-0.3,place:"lwLate",keys:[[c.spread-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      for(const [who,px,fl] of [["helena",260,false],["noor",610,false],["sam",960,false],["jun",1310,true],["ivy",1660,true]])lp_person(x,who,px,720,0.72,{t:tt,flip:fl,light:lt});
      lw_pill(x,tt,w("spread","same",-0.2),null,960,400,"The whole team reads a count one way",{col:LP.green,icon:"tick"});}}
  ]);
  lw_kick(ctx,S,1-ag_io(t,c.heads-0.5,c.ready-0.3,0.5),ag_io(t,c.freire-0.3,c.spread-0.3,1.0));
});

/* ---------------------------------------------------------------- 5. Nobody the only one */
scene("two",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"},lt={light:"late"};
  const J={x:330,y:120,w:1100};
  ag_shots(ctx,S,t,sc.dur,[
    // only one person knows how to run it: one absence away from trouble
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const a0=w("absence","absence",-0.3);
      lp_person(x,"sam",840,760,0.76,{t:tt,cut:860,a:1-ag_in(tt,a0,0.9),light:dy});lp_table(x,560,866,800,{floor:1040});lp_laptop(x,1080,838,200,{glow:0.6});
      lw_tag(x,tt,w("absence","only",-0.1),a0-0.2,960,330,"Only one person knows how",{align:"center",col:LP.amber});
      lw_tag(x,tt,a0+0.4,null,960,330,"One absence away from trouble",{align:"center",col:LP.amber});}},
    // the nine jobs that must keep running, and who can run each; five with only one name
    {at:c.list-0.3,place:"lpRoom",later:true,keys:[[c.list-0.3,960,540,1.0]],draw:(x,tt)=>{const j0=c.list+0.1;
      lw_jobs(x,J.x,J.y,J.w,{k:tt-j0,a:ag_in(tt,j0,0.35),u:clamp((tt-w("list","nine",-0.2))/2.0,0,1),one:ag_in(tt,w("five","Five",-0.1),0.6),light:"day"});
      lw_tag(x,tt,w("list","May",-0.1),null,1880,170,"In May",{align:"right"});}},
    // they pair on those too, a job at a time, and write each one down, step by step
    {at:c.pairs-0.3,place:"lwLate",keys:[[c.pairs-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const r0=w("pairs","write",-0.2);
      lp_person(x,"sam",330,760,0.76,{t:tt,cut:860,light:lt});lp_person(x,"ivy",700,760,0.76,{t:tt,flip:true,cut:860,light:lt});
      lp_table(x,60,866,920,{floor:1040});lp_laptop(x,515,838,200,{glow:0.6});
      if(tt>=r0)lw_runbook(x,1060,150,760,{a:ag_in(tt,r0,0.35),k:tt-r0,u:clamp((tt-w("pairs","step",-0.1))/1.6,0,1),light:"late"});}},
    // by 30 June every job has two names; Ivy's on two of them; anyone can be away, and the work goes on
    {at:c.june-0.3,place:"lpRoom",keys:[[c.june-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      lw_jobs(x,J.x,J.y,J.w,{one:1,second:ag_in(tt,w("june","every",-0.1),1.0),ivy:ag_in(tt,w("ivy","Ivy's",-0.1),0.6),light:"day"});
      lw_tag(x,tt,w("june","Wednesday",-0.1),null,1880,170,"Wednesday 30 June",{align:"right",col:LP.green});
      lw_tag(x,tt,w("away","holiday",-0.2),null,1670,420,"On holiday, or ill",{align:"center"});
      lw_pill(x,tt,w("away","goes",-0.2),null,1670,500,"The work goes on",{col:LP.green,icon:"tick"});}}
  ]);
  lw_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. Why it works */
scene("why",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const e0=c.ericsson-0.4,r0=c.rule-0.4,d0=c.docs-0.4;
      // the same, trade after trade
      lw_sheet(x,tt,c.trades+0.1,460,200,1000,{kick:"How adults learn at work",title:"The same, trade after trade"},{light:"day",out:c.lave-0.5});
      // Lave and Wenger: apprentices, from tailors in Liberia to midwives in Mexico; newcomers at the edge of the real work, moving in
      lw_sheet(x,tt,w("lave","Jean",-0.1),140,150,640,{kick:"Jean Lave and Etienne Wenger, 1991",title:"Apprentices",lines:["Tailors in Liberia","Midwives in Mexico"]},
        {light:"day",out:e0,u:lw_u(tt,[w("lave","tailors",-0.1),w("lave","midwives",-0.1)])});
      const ra=ag_in(tt,w("edge","Newcomers",-0.1),0.5)*(1-ag_in(tt,e0,0.4));if(ra>0.004)lw_ring(x,1350,500,290,{a:ra,in:ag_in(tt,w("edge","edge",-0.1),5.0)});
      lw_tag(x,tt,w("edge","edge",-0.1),e0,140,520,"First at its edge");
      lw_tag(x,tt,w("edge","tasks",-0.1),e0,140,600,"Small tasks that matter",{col:LP.green});
      lw_tag(x,tt,w("edge","beside",-0.1),e0,140,680,"Beside people who know");
      // Ericsson: practice aimed at what you can't do yet, with quick feedback from someone who can, as at Jun and Ivy's desk
      lw_sheet(x,tt,w("ericsson","Anders",-0.1),460,140,1000,{kick:"Anders Ericsson, 1993",title:"Practice aimed at what you can't do yet",lines:["With quick feedback from someone who can"]},
        {light:"day",out:r0,u:ag_in(tt,w("ericsson","feedback",-0.2),0.5)});
      const da=ag_in(tt,c.ericsson,0.8)*(1-ag_in(tt,r0,0.6));if(da>0.004){x.save();x.globalAlpha*=da;lw_desk(x,tt,{light:"day"});x.restore();}
      // the rule of thumb: about 70, 20 and 10; dashed once it's called a rule of thumb, not a measurement
      lw_sheet(x,tt,c.rule+0.1,560,150,800,{kick:"A rule of thumb",title:"Where people learn at work"},{light:"day",out:d0});
      const sa=ag_in(tt,c.rule+0.2,0.4)*(1-ag_in(tt,d0,0.4));
      if(sa>0.004)lw_split(x,360,420,1200,{a:sa,u:[ag_in(tt,w("rule","seventy",-0.1),0.5),ag_in(tt,w("twenty","twenty",-0.1),0.5),ag_in(tt,w("twenty","ten",-0.1),0.5)],soft:ag_in(tt,w("thumb","rule",-0.1),0.8)});
      lw_tag(x,tt,w("thumb","measurement",-0.2),d0,960,690,"A rule of thumb, not a measurement",{align:"center"});
      // courses and docs still count: start from the official docs, then learn it on the work
      lp_screen(x,360,150,1200,600,{a:ag_in(tt,c.docs-0.1,0.5),draw:(cx,X0,Y0,Wd,Hd)=>lw_docs(cx,X0,Y0,Wd,Hd,{tab:0,title:"Testing your models",add:ag_in(tt,w("docs","work",-0.2),1.0)})});}}
  ]);
  lw_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back to Angicos: their own words, a small step each evening, in a circle with someone beside them
    {at:0,place:"lwCircle",keys:[[0,980,520,1.06],[c.back+0.5,960,540,1.0]],d:3,draw:(x,tt)=>{lw_circle(x,tt,{sl:1,slide:{pic:1,word:1}});}},
    // Ivy did the same with data
    {at:c.ivy-0.3,place:"lwMorning",keys:[[c.ivy-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      lp_person(x,"ivy",560,640,1.0,{t:tt,light:mo});
      lw_pill(x,tt,w("ivy","learned",-0.1),null,1250,330,"Learned on the real work",{col:LP.green,icon:"tick"});
      lw_pill(x,tt,w("ivy","taught",-0.1),null,1250,430,"Taught what she learned",{col:LP.green,icon:"tick"});
      lw_pill(x,tt,w("ivy","second",-0.1),null,1250,530,"Second name on two jobs",{col:LP.green,icon:"tick"});}},
    // what to do on Monday
    {at:c.real-0.3,place:"lwMorning",later:true,keys:[[c.real-0.3,960,540,1.0]],draw:(x,tt)=>{
      lw_sheet(x,tt,c.real+0.3,140,170,520,{kick:"One",title:"Learn on the real work, beside someone who knows"},{light:"morning"});
      lw_sheet(x,tt,w("step","small",-0.1),700,170,520,{kick:"Two",title:"One small step at a time, and finish it"},{light:"morning"});
      lw_sheet(x,tt,w("time","calendar",-0.2),1260,170,520,{kick:"Three",title:"Learning time in the calendar, kept free",lines:["Start from the official docs"]},
        {col:LP.blue,light:"morning",u:ag_in(tt,w("time","official",-0.1),0.5)});
      lw_sheet(x,tt,w("teach","Write",-0.1),560,540,800,{kick:"Four",title:"Write down what you learn, and teach it"},{col:LP.green,light:"morning"});}},
    // learn on the real work, beside someone, then teach it
    {at:c.last-0.3,place:"lwMorning",later:true,keys:[[c.last-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,e0,0.8);
      if(g>0.004){x.save();x.globalAlpha*=g;lw_desk(x,tt,{light:"morning"});x.restore();}}}
  ]);
  lp_end(ctx,S,t,e0,"Learning while doing",LW_LAST,"Film 3 of 3","The new skills");
  lw_kick(ctx,S,1-ag_in(t,e0,0.8),1-ag_in(t,c.ivy-0.3,1.0));
});
// thursday ends where teach opens (Ivy's learning time, late in the day), teach ends on the team and two opens on Sam alone, two ends
// on the nine jobs and why opens in the same room: each opens on what the one before ends on
ag_cutInto(["teach","two","why"]);
