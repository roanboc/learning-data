/* ===== No two alike: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Sizes in the 1920 x 1080 frame. */

const NA_LAST="Ask each person how they work. Never sort them.";
// the film's number and title at the top left, from the second chapter on
function na_kick(ctx,S,a,o){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"3","No two alike",Object.assign({a},o||{}));}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function na_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const na_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function na_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 (and goes at t1)
function na_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// a bare sheet the film draws on itself: in at t0, out at t1 (null: stays); returns its opacity
function na_board(ctx,t,t0,t1,x,y,w,h,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a>0.004)lp_sheet(ctx,x,y,w,h,Object.assign({light:"day"},o||{},{a,k:t-t0}));return a;}
// words on a board: they come in at t0
function na_w(ctx,t,t0,s,x,y,o){const a=ag_in(t,t0,0.45);if(a>0.004)lp_T(ctx,s,x,y,Object.assign({},o||{},{a:a*((o&&o.a)==null?1:o.a)}));}
// the people on the banks of the gorge, as the series' other films leave them: a few on each side, standing or sitting
// where the gift lies: at the near end of the teacher's mat
const NA_GIFT=[1262,846,0.76];
function na_banks(ctx){const L=NA_QB_BANK.L,R=NA_QB_BANK.R;
  for(let i=0;i<5;i++)na_qb_fig(ctx,L.x0+70+i*58,L.y+5+(i%2)*5,50,{who:[1,3,5,7,2][i],pose:i%3===2?"sit":"stand",flip:i%2===1});
  for(let i=0;i<6;i++)na_qb_fig(ctx,R.x0+40+i*52,R.y+4+(i%2)*5,50,{who:[0,2,4,6,1,3][i],pose:i%4===0?"sit":"stand",flip:i%3!==0});}

/* ---------------------------------------------------------------- 1. Two answers: Lu, about 2,500 years ago */
scene("lu",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),luT=c.where-0.6,BR={age:0};
  const wideT=w("gift","So",-0.5),outT=c.team-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    // the series' bridge, new, three people crossing; the camera closes in on them as the film says why it leaves
    {at:0,place:"naGorge",keys:[[0,960,500,1.0],[0.8,1040,474,2.1]],d:luT+0.6,push:0,draw:(x,tt)=>{na_banks(x);
      na_qb_bridge(x,Object.assign({mid:cc=>{for(const [u0,wh] of [[0.14,0],[0.21,3],[0.4,4]]){const u=u0+0.026*tt,p=na_qb_deck(u,BR);na_qb_fig(cc,p[0],p[1],50,{who:wh,pose:"walk",t:tt+u0*9,shadow:0});}}},BR));}},
    // Lu: the teacher's hall, the four on their mats. One room, so the camera only glides, and nobody moves
    {at:luT,place:"naLu",dis:1.8,d:2.4,push:0,keys:[[luT,960,540,1.0],[c.teacher-0.5,1203,648,1.34],[wideT,640,560,1.5],[c.rule-2.3,960,540,1.0]],draw:(x,tt)=>{
      const say=(a,b)=>na_says(tt,a,b);
      na_luFour(x,tt,{talk:{
        kong:say(w("bold","teacher",0),E.bold)+say(w("holds","teacher",0),E.holds)+say(w("first","your",-0.1),E.first)+say(w("ranyou","act",-0.1),E.ranyou)+say(w("why","Ran",-0.1),E.why)+say(w("office","yes",-0.1),E.office),
        zilu:say(w("zilu","when",-0.1),E.zilu),ranyou:say(w("ranyou","asks",-0.1),w("ranyou","question",0.5)),gongxi:say(w("third","confused",-0.4),E.third)}});
      na_gift(x,NA_GIFT[0],NA_GIFT[1],NA_GIFT[2],ag_in(tt,w("gift","bundle",-0.4),0.7));
      // where and when
      na_sheet(x,tt,c.where+0.3,110,70,600,{kick:"Lu · now eastern China",title:"About 2,500 years ago"},{light:null,pin:false,out:c.teacher-0.7});
      // the teacher, and the gift
      na_tag(x,tt,w("teacher","Kong",-0.2),wideT-0.2,1540,312,"Kong Qiu · Confucius",{align:"center",col:LP.ink});
      na_tag(x,tt,w("teacher","turns",-0.2),wideT-0.2,1240,404,"Turns no student away",{align:"center",col:LP.ink});
      na_tag(x,tt,w("gift","bundle",-0.1),wideT-0.2,1240,474,"For a bundle of dried meat",{align:"center",col:LP.ink});
      // the two students, and what each one's way costs him
      na_tag(x,tt,c.bold-0.1,outT,300,312,"Zilu · bold",{align:"center",col:LP.ink});
      na_tag(x,tt,w("bold","tigers",-0.3),c.tell-0.3,310,250,"Fights tigers bare-handed",{align:"center",col:LP.amber});
      na_tag(x,tt,c.holds-0.1,outT,640,312,"Ran You · holds back",{align:"center",col:LP.ink});
      na_tag(x,tt,w("holds","set",-0.3),c.tell-0.3,724,250,"Sets his own limit",{align:"center",col:LP.amber});
      // one rule for both
      na_pill(x,tt,c.rule+0.3,c.need-0.4,470,92,"One rule for both would fail one of them",{col:LP.amber});
      na_tag(x,tt,w("tell","Tell",0.1),c.need-0.4,470,164,"Both go ahead: Zilu fights the tiger",{align:"center",col:LP.amber});
      na_tag(x,tt,w("tell","wait",-0.4),c.need-0.4,470,226,"Both wait: Ran You never starts",{align:"center",col:LP.amber});
      na_pill(x,tt,w("need","needs",-0.3),c.zilu-0.4,470,150,"Each needs an answer of his own",{col:LP.ink});
      // the same question, twice
      na_sheet(x,tt,w("zilu","asks",-0.3),60,56,520,{kick:"Zilu asks",title:"Should I act at once?"},{light:null,pin:false,out:c.ranyou-0.5});
      na_sheet(x,tt,w("first","says",-0.3),980,56,880,{kick:"The teacher answers",title:"Your father and elder brothers are alive",lines:["He means: ask them first"]},
        {light:null,pin:false,out:c.ranyou-0.5,u:ag_in(tt,c.means+0.1,0.5)});
      na_sheet(x,tt,w("ranyou","asks",-0.3),400,56,520,{kick:"Ran You asks",title:"Should I act at once?"},{light:null,pin:false,out:c.third-0.5});
      na_sheet(x,tt,w("ranyou","act",-0.4),1180,56,520,{kick:"The teacher answers",title:"Act at once"},{light:null,pin:false,out:c.third-0.5});
      // the third student, who heard both answers, and the teacher's reason
      na_tag(x,tt,c.third,c.office-0.5,300,250,"Told: ask first",{align:"center",col:LP.ink});
      na_tag(x,tt,c.third+0.2,c.office-0.5,640,250,"Told: act at once",{align:"center",col:LP.ink});
      na_tag(x,tt,w("third","Gongxi",-0.2),outT,960,327,"Gongxi Hua",{align:"center",col:LP.ink});
      na_sheet(x,tt,w("third","confused",-0.5),1010,56,620,{kick:"He heard both answers",title:"I'm confused. May I ask?"},{light:null,pin:false,out:c.why-0.4});
      na_sheet(x,tt,c.why+0.1,1000,56,860,{kick:"The teacher",lines:["Ran You holds back, so I urged him on","Zilu has the energy of two, so I held him back"]},
        {light:null,pin:false,out:c.office-0.5,u:na_u(tt,[w("why","Ran",0),w("why","Zilu",-0.1)])});
      na_pill(x,tt,w("person","person",-0.4),c.fit-0.3,470,150,"He answered the person, as well as the question",{col:LP.ink});
      na_pill(x,tt,w("fit","answer",-0.5),c.office-0.5,470,150,"Each gets the answer he needs",{col:LP.green});
      // what it gave them
      na_sheet(x,tt,w("office","yes",-0.4),1010,56,760,{kick:"Could they serve in government?",title:"Yes, both"},{col:LP.green,light:null,pin:false,out:c.count-0.5});
      na_tag(x,tt,w("office","decisive",-0.2),outT,300,250,"Decisive",{align:"center",col:LP.green});
      na_tag(x,tt,w("office","skilled",-0.2),outT,640,250,"Skilled",{align:"center",col:LP.green});
      na_sheet(x,tt,w("count","counts",0.1),1010,56,840,{kick:"A historian, centuries later",title:"77 students mastered what he taught",lines:["These two, so unlike, are both among them"]},
        {col:LP.green,light:null,pin:false,u:ag_in(tt,w("count","both",-0.4),0.5)});}},
    // and a data team: the eight at their table, no two alike, and a page for each
    {at:c.team-0.4,place:"lpRoom",dis:1.6,keys:[[c.team-0.4,960,540,1.0]],push:0,draw:(x,tt)=>{const ga=1-ag_in(tt,c.breath+0.2,0.8),p0=w("each","each",-0.3);if(ga<=0.004)return;x.save();x.globalAlpha*=ga;
      na_team(x,tt,{});
      na_pill(x,tt,w("team","no",-0.2),c.each-0.4,960,150,"No two people work the same way",{col:LP.ink});
      na_pill(x,tt,w("team","leaves",-0.4),c.each-0.4,960,240,"One way for all leaves someone out",{col:LP.amber});
      NA_TEAM.forEach(([who,name,px],i)=>{const k=tt-p0-i*0.16,a=ag_in(tt,p0+i*0.16,0.35);if(a>0.004)na_page(x,px-52,224,104,136,{seed:11+i*7,a,k,pin:false,tilt:(i%3-1)*1.4});});
      na_pill(x,tt,w("each","hears",-0.3),null,960,130,"The team hears what every one of them knows",{col:LP.green});
      x.restore();}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,c.team+0.6,c.breath,0.5)});
  lp_title(ctx,S,t,c.breath+0.2,"No two alike","Ask each person how they work","Leading data people · People first");
});

/* ---------------------------------------------------------------- 2. Erin's silence */
scene("silence",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning",wall:0.12},lt={light:"late"};
  // who talks, in turn, while the plan is made: everyone but Erin
  const TURNS=["Noor","Sam","Yusuf","Marta","Jun","Tomás","Helena","Sam","Noor","Marta","Yusuf","Jun"],t0=c.plan+1.2,step=1.25,stopT=c.guess-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    // Monday 15 February: the eight plan two weeks, and Erin says nothing
    {at:0,place:"naTeamAm",keys:[[0,960,540,1.0],[c.quiet-0.3,1010,520,1.06]],d:3,push:0,draw:(x,tt)=>{const talk={},n=Math.floor((tt-t0)/step),on=tt>=t0&&tt<stopT&&n<TURNS.length;
      if(on)talk[TURNS[n]]=na_says(tt,t0+n*step+0.05,t0+(n+1)*step-0.15);
      na_team(x,tt,{light:mo,names:ag_in(tt,c.plan-0.2,0.6),talk,tags:{Erin:1-ag_in(tt,w("quiet","Erin",-0.3),0.3),Helena:0},gaze:{Erin:[0,2.5]}});
      na_tag(x,tt,w("when","Helena",-0.2),null,1672,374,"Helena",{align:"center",col:LP.ink});
      if(on){const u=(tt-t0)/step-n;na_bubble(x,NA_SEAT_OF[TURNS[n]],306,ag_io(u,0.02,0.82,0.12),u*step);}
      na_sheet(x,tt,w("when","Helena",-0.3),560,60,800,{kick:"February 2027",title:"Helena Novak, the data manager",sub:"Her third week"},{light:"morning",out:c.plan-0.5});
      na_sheet(x,tt,w("plan","plan",-0.4),620,60,680,{kick:"Monday 15 February",title:"The plan for two weeks"},{col:LP.blue,light:"morning",out:c.guess-0.7});
      na_tag(x,tt,w("quiet","Erin",-0.3),null,1052,374,"Erin Walsh",{align:"center",col:LP.ink});
      na_tag(x,tt,w("quiet","nothing",-0.3),null,1052,312,"Says nothing",{align:"center",col:LP.ink});
      na_sheet(x,tt,w("guess","reads",-0.3),1300,60,540,{kick:"Helena's first guess",title:"Not interested"},{col:LP.amber,light:"morning"});
      na_pill(x,tt,w("guess","wrong",-0.3),null,1570,296,"It's wrong",{col:LP.amber,icon:"cross"});}},
    // Tuesday morning: Erin's note
    {at:c.note-0.3,place:"naTeamAm",later:true,keys:[[c.note-0.3,960,540,1.0]],draw:(x,tt)=>{
      na_sheet(x,tt,c.note+0.2,200,170,820,{kick:"Tuesday morning · a note from Erin",title:"Two things the plan missed",lines:["Two pieces of platform work can't both be tested in the same week"]},
        {light:"morning",u:ag_in(tt,w("miss","two",-0.2),0.5)});
      lp_person(x,"helena",1440,650,1.0,{t:tt,flip:true,light:{light:"morning"},gaze:[2,1]});}},
    // Wednesday: Erin's weekly half hour, and the question. Helena is in both shots, so it's a cut
    {at:c.ask-0.3,place:"naOne",cut:true,keys:[[c.ask-0.3,960,540,1.0]],draw:(x,tt)=>{
      na_pair(x,tt,{helena:na_says(tt,w("ask","how",-0.1),E.ask),erin:na_says(tt,w("after","think",-0.4),E.after),nod:0.03*ag_io(tt,w("after","Send",0),E.after+0.4,0.6)});
      na_sheet(x,tt,w("ask","asks",-0.4),560,56,800,{kick:"Wednesday · Erin's weekly half hour",title:"How do you work best in a meeting like Monday's?"},{col:LP.blue,light:"late",out:w("after","think",-0.9)});
      na_sheet(x,tt,w("after","think",-0.5),560,56,800,{kick:"Erin says",title:"I think after a meeting, not in it",lines:["Send me the question the day before","I'll come with an answer"]},
        {light:"late",out:c.known-0.5,u:na_u(tt,[w("after","Send",-0.1),w("after","come",-0.3)])});
      na_sheet(x,tt,c.known+0.1,80,140,800,{kick:"The teacher in Lu",title:"Knew his students for years"},{light:"late",out:c.say-0.3});
      na_sheet(x,tt,w("known","Helena",-0.3),1040,140,800,{kick:"Helena",title:"Has known her team for two weeks"},{light:"late",out:c.say-0.3});
      na_pill(x,tt,w("say","say",-0.2),null,960,170,"A person can say how they work",{col:LP.green,size:34});
      na_pill(x,tt,w("say","So",-0.2),null,960,268,"So she asks",{col:LP.blue,size:34});}}
  ]);
  na_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. By degree */
const NA_TRAITS=[["Open to new things","open"],["Organised","organised"],["Outgoing","outgoing"],["Agreeable","agreeable"],["Steady under pressure","steady"]];
scene("degree",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    // five broad traits, each a scale
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{const a=na_board(x,tt,0.3,null,330,126,1260,740),s0=w("scale","scale",-0.3);if(a<=0.004)return;x.save();x.globalAlpha*=a;
      na_w(x,tt,c.how+0.2,"HOW DO PEOPLE DIFFER?",378,200,{w:800,size:28,ls:3,col:LP.mut});
      na_w(x,tt,w("how","five",-0.3),"Five broad traits",378,260,{w:800,size:44});
      na_w(x,tt,w("how","Big",-0.3),"Often called the Big Five",820,260,{w:600,size:28,col:LP.mut});
      NA_TRAITS.forEach(([name,word],i)=>{const y=388+i*88;na_w(x,tt,w("five",word,-0.25),name,378,y+11,{w:700,size:32});
        na_bar(x,840,y,640,{u:ag_sine(ag_in(tt,s0+i*0.12,0.9)),ends:true});});
      na_w(x,tt,s0+0.5,"Less",840,336,{w:600,size:28,col:LP.mut});na_w(x,tt,s0+0.5,"More",1480,336,{w:600,size:28,col:LP.mut,align:"right"});
      na_pill(x,tt,w("scale","degree",-0.4),null,960,812,"By degree, not by type",{col:LP.ink});
      x.restore();}},
    // one typical person, over two or three weeks
    {at:c.days-0.3,place:"lpRoom",later:true,keys:[[c.days-0.3,960,540,1.0]],draw:(x,tt)=>{const a=na_board(x,tt,c.days,null,260,150,1400,620),bx=430,bw=1060,by=590,mid=0.56;if(a<=0.004)return;x.save();x.globalAlpha*=a;
      na_w(x,tt,w("days","study",-0.3),"ONE STUDY · A TYPICAL PERSON · TWO OR THREE WEEKS",308,224,{w:800,size:28,ls:3,col:LP.orange});
      na_w(x,tt,w("days","nearly",-0.3),"Nearly every level of every trait",308,290,{w:800,size:44});
      na_w(x,tt,c.days+0.4,"How outgoing, for one",308,382,{w:700,size:32});
      na_bar(x,bx,by,bw,{u:ag_sine(ag_in(tt,c.days+0.4,0.9)),ends:true});
      na_w(x,tt,c.days+0.9,"Less",bx,by+52,{w:600,size:28,col:LP.mut});na_w(x,tt,c.days+0.9,"More",bx+bw,by+52,{w:600,size:28,col:LP.mut,align:"right"});
      na_marks(x,bx,by,bw,{u:ag_in(tt,w("days","weeks",-0.3),3.4),mid,t:tt,live:ag_in(tt,w("usual","moved",-0.3),0.8),band:ag_in(tt,w("usual","usual",-0.3),0.6)});
      na_tag(x,tt,w("usual","usual",-0.1),null,bx+bw*mid,by-104,"A usual level of their own",{align:"center",col:LP.orange});
      na_tag(x,tt,w("usual","situation",-0.5),null,bx+bw*mid,by+126,"Moves with the situation",{align:"center",col:LP.orange});
      x.restore();}},
    // the years move it too
    {at:c.years-0.3,place:"lpRoom",later:true,keys:[[c.years-0.3,960,540,1.0]],draw:(x,tt)=>{const a=na_board(x,tt,c.years,null,300,170,1320,560),g0=w("years","between",-0.2),u=ag_sine(ag_in(tt,g0,2.2));if(a<=0.004)return;x.save();x.globalAlpha*=a;
      na_w(x,tt,w("years","average",-0.4),"ON AVERAGE, ACROSS MANY STUDIES",348,244,{w:800,size:28,ls:3,col:LP.orange});
      na_w(x,tt,c.years+0.2,"The years move it too",348,310,{w:800,size:44});
      [["Organised","organised",0.36,0.62],["Steady under pressure","steadier",0.4,0.6]].forEach(([name,word,p0,p1],i)=>{const y=470+i*150,bx=840,bw=660,px=bx+bw*lerp(p0,p1,u),k=ag_in(tt,w("years",word,-0.3),0.5);
        if(k<=0.004)return;x.save();x.globalAlpha*=k;lp_T(x,name,348,y+11,{w:700,size:32});na_bar(x,bx,y,bw,{ends:true});
        x.strokeStyle=rgba(LP.orange,0.5);x.lineWidth=6;x.lineCap="round";x.beginPath();x.moveTo(bx+bw*p0,y);x.lineTo(px,y);x.stroke();
        x.fillStyle=rgba(LP.orange,1);x.beginPath();x.arc(px,y,15,0,TAU);x.fill();
        lp_T(x,"Age "+Math.round(lerp(20,40,u)),px,y-34,{w:800,size:30,col:LP.orange,align:"center"});x.restore();});
      x.restore();}},
    // not the last word
    {at:c.last-0.3,place:"lpRoom",later:true,keys:[[c.last-0.3,960,540,1.0]],draw:(x,tt)=>{
      na_sheet(x,tt,c.last+0.1,430,270,1060,{kick:"The five aren't the last word",title:"Among farmers and foragers in Bolivia, researchers didn't find them"},{col:LP.amber,light:"day"});}},
    // no place is the right one: a team has a use for each
    {at:c.right-0.3,place:"lpRoom",later:true,keys:[[c.right-0.3,960,540,1.0]],draw:(x,tt)=>{const a=na_board(x,tt,c.right,null,280,170,1360,560);if(a<=0.004)return;x.save();x.globalAlpha*=a;
      na_w(x,tt,c.right+0.2,"NO PLACE ON A SCALE IS THE RIGHT ONE",328,244,{w:800,size:28,ls:3,col:LP.mut});
      [[["Rushes ahead","rushes"],["Holds back","holds"]],[["Thinks aloud","aloud"],["Thinks afterwards","afterwards"]]].forEach(([l,r],i)=>{const y=388+i*140,ta=w("team",l[1],-0.4),tb=w("team",r[1],-0.4);
        na_bar(x,700,y,520,{u:ag_sine(ag_in(tt,w("right","scale",-0.3)+i*0.25,0.8)),ends:true});
        na_tag(x,tt,ta,null,650,y,l[0],{align:"right",col:LP.green});na_tag(x,tt,tb,null,1270,y,r[0],{align:"left",col:LP.green});});
      na_pill(x,tt,w("right","use",-0.4),null,960,654,"A team has a use for each",{col:LP.green,icon:"tick"});
      x.restore();}},
    // for understanding, never for assessing; what shows how someone is doing
    {at:c.never-0.3,place:"lpRoom",later:true,keys:[[c.never-0.3,960,540,1.0]],draw:(x,tt)=>{
      na_sheet(x,tt,w("never","understanding",-0.5),200,170,720,{kick:"Traits are for",title:"Understanding people"},{col:LP.green,light:"day"});
      na_sheet(x,tt,w("never","never",-0.3),1000,170,720,{kick:"Never for",title:"Assessing them"},{col:LP.amber,light:"day"});
      na_sheet(x,tt,c.outcomes+0.2,460,450,1000,{kick:"How someone is doing shows in",lines:["The results of their work","How the team works together"]},
        {light:"day",u:na_u(tt,[w("outcomes","results",-0.3),w("outcomes","team",-0.3)])});}}
  ]);
  na_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 4. A scale, cut in two */
// the rules Helena sets, on a blue sheet (a plan): each comes in at its time; a tick marks the ones the test's own makers ask for
function na_rules(ctx,tt,x,y,w,T,o){const a=na_board(ctx,tt,T.in,null,x,y,w,446,{col:LP.blue});if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  lp_T(ctx,"YES, AS A WAY TO START TALKING",x+44,y+82,{w:800,size:28,ls:3,col:LP.blue});lp_T(ctx,"Four rules",x+44,y+142,{w:800,size:44});
  ["It's each person's choice","Your results are yours; you share what you choose","Read as degrees, not boxes","Never used to hire, hand out work or judge"].forEach((s,i)=>{const k=ag_in(tt,T.rows[i],0.5),yy=y+212+i*58;if(k<=0.004)return;
    ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(x+56,yy-10,7,0,TAU);ctx.fill();lp_T(ctx,s,x+84,yy,{w:600,size:28});ctx.restore();
    const tk=i===2?0:ag_in(tt,T.ticks+(i>2?2:i)*0.25,0.4);if(tk>0.004){ctx.save();ctx.globalAlpha*=tk;lp_icon(ctx,"tick",x+w-64,yy-10,lerp(20,36,ag_spr(tt-T.ticks-(i>2?2:i)*0.25,0,0.5)),LP.green);ctx.restore();}});
  ctx.restore();}
scene("cut",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  const cutT=w("type","cut",-0.3),butT=w("steady","But",-0.5),hopT=w("steady","small",-0.2);
  // the scale and the people along it: used twice, the second time with one of them a little way across the cut
  const scale=(x,tt,o)=>{const a=na_board(x,tt,o.in,null,300,130,1320,690);if(a<=0.004)return;x.save();x.globalAlpha*=a;
    lp_T(x,"A TYPE IS A SCALE, CUT IN TWO",348,206,{w:800,size:28,ls:3,col:LP.mut});
    na_cut(x,420,676,1080,{u:o.u,cut:o.cut,near:o.near,hop:o.hop,mark:o.mark});
    for(const [la,tx,txt,ring] of [[o.l1,700,"One label",0],[o.l2,1240,"Another label",1]])if(la>0.004){const bb=lp_tag(x,tx,278,txt,{align:"center",col:LP.ink,a:la});
      x.save();x.globalAlpha*=la;na_dot(x,bb.x-24,278,11,ring,1);x.restore();}
    x.restore();};
  ag_shots(ctx,S,t,sc.dur,[
    // Thursday, at the team's table: Yusuf's idea
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0],[c.idea+0.3,900,546,1.05]],d:3,push:0,draw:(x,tt)=>{
      const yT=w("test","took",-0.4);na_team(x,tt,{names:1,talk:{Yusuf:na_says(tt,yT,E.test)},gaze:{Erin:[2,0.5]}});
      na_bubble(x,NA_SEAT_OF.Yusuf,306,ag_io(tt,yT,E.test,0.25),tt-yT);
      na_sheet(x,tt,c.idea+0.3,560,70,800,{kick:"Thursday 18 February",title:"Yusuf Demir has an idea"},{light:"day",out:c.test-0.4});
      na_sheet(x,tt,w("test","test",-0.4),520,70,880,{kick:"In an earlier job",title:"A test that sorts people into types",lines:["It gave his team words for their differences"]},
        {light:"day",u:ag_in(tt,w("test","words",-0.4),0.5)});}},
    // what a type is
    {at:c.type-0.3,place:"lpRoom",later:true,keys:[[c.type-0.3,960,540,1.0]],draw:(x,tt)=>{
      scale(x,tt,{in:c.type,u:ag_in(tt,c.type+0.2,1.4),cut:ag_in(tt,cutT,0.8),l1:ag_in(tt,w("type","One",-0.1),0.4),l2:ag_in(tt,w("type","other",-0.1),0.4),near:ag_in(tt,w("middle","middle",-0.4),0.6)});
      na_tag(x,tt,w("middle","close",-0.4),null,960,766,"Most people are close to the cut",{align:"center",col:LP.amber});}},
    // 1991: four in ten got the same type again
    {at:c.again-0.3,place:"lpRoom",later:true,keys:[[c.again-0.3,960,540,1.0]],draw:(x,tt)=>{const a=na_board(x,tt,c.again,butT-0.1,360,170,1200,560),f0=w("again","four",-0.3);if(a<=0.004)return;x.save();x.globalAlpha*=a;
      na_w(x,tt,c.again+0.2,"US NATIONAL RESEARCH COUNCIL, 1991",408,244,{w:800,size:28,ls:3,col:LP.orange});
      na_w(x,tt,w("again","twice",-0.6),"People who took one such test twice",408,310,{w:800,size:40});
      na_ten(x,546,450,{u:ag_in(tt,w("again","twice",-0.4),1.2),same:ag_in(tt,f0,1.0)});
      na_w(x,tt,f0+0.3,"Typically, 4 in 10 got the same type again",960,572,{w:800,size:36,col:LP.orange,align:"center"});
      na_w(x,tt,c.steady+0.2,"The scores themselves held up well enough",960,656,{w:600,size:28,col:LP.mut,align:"center"});
      x.restore();}},
    // near the cut, a small change in a score is a different label
    {at:butT,place:"lpRoom",later:true,keys:[[butT,960,540,1.0]],draw:(x,tt)=>{const hop=ag_sine(ag_in(tt,hopT,0.9));
      scale(x,tt,{in:butT+0.1,u:1,cut:1,l1:1,l2:1,near:0,hop,mark:ag_in(tt,butT+0.5,0.4)});
      na_tag(x,tt,hopT+0.5,null,960,766,"A small change in a score: a different label",{align:"center",col:LP.amber});}},
    // Helena says yes, with four rules
    {at:c.yes-0.3,place:"lpRoom",later:true,keys:[[c.yes-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"helena",430,650,0.98,{t:tt,light:dy,talk:na_says(tt,w("yes","yes",-0.1),w("yes","yes",0.5))});
      na_rules(x,tt,880,110,940,{in:c.yes+0.2,rows:[w("rules1","choice",-0.6),w("rules1","results",-0.4),w("rules2","degrees",-0.6),w("rules2","never",-0.3)],ticks:w("makers","three",-0.2)});
      na_tag(x,tt,w("makers","three",0.5),c.start-0.3,1350,612,"The test's makers ask for these three",{align:"center",col:LP.green});
      na_pill(x,tt,w("start","start",-0.3),null,1350,640,"A test can start a conversation",{col:LP.green});
      na_pill(x,tt,w("start","decide",-0.4),null,1350,724,"It can't decide anything",{col:LP.amber});}}
  ]);
  na_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 5. How I work */
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  const HT=[w("heads1","best",-0.5),w("heads1","ask",-0.5),w("heads2","disagree",-0.5),w("heads2","wears",-0.4),w("heads2","better",-0.6)];
  ag_shots(ctx,S,t,sc.dur,[
    // the page, and its five headings
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{const a=na_board(x,tt,0.3,null,500,96,920,770);if(a<=0.004)return;x.save();x.globalAlpha*=a;
      na_w(x,tt,c.keep+0.3,"A PAGE IN EACH PERSON'S OWN WORDS",548,170,{w:800,size:28,ls:3,col:LP.mut});
      na_w(x,tt,w("keep","How",-0.3),"How I work",548,246,{w:800,size:56});
      // the page is a practice of teams, and no study stands behind it: the film says so, as the series' plan asks
      na_w(x,tt,w("heads1","five",-0.3),"From practice, not from a study",1372,246,{w:600,size:28,col:LP.mut,align:"right"});
      NA_HEADS.forEach((s,i)=>{const k=ag_in(tt,HT[i],0.5),y=344+i*100;if(k<=0.004)return;x.save();x.globalAlpha*=k;lp_T(x,s,548,y,{w:700,size:32});
        x.fillStyle=rgba(LP.mut,0.3);rr(x,548,y+22,lerp(520,760,(i*37%10)/10),6,3);x.fill();x.restore();});
      x.restore();}},
    // Helena writes hers first
    {at:c.first-0.3,place:"lpRoom",later:true,keys:[[c.first-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"helena",430,650,0.98,{t:tt,light:dy});
      na_page(x,840,170,300,400,{seed:5,a:ag_in(tt,c.first+0.2,0.4),k:tt-c.first-0.2});
      na_tag(x,tt,w("first","shares",-0.3),null,990,626,"Shared Thursday 18 February",{align:"center",col:LP.ink});
      na_sheet(x,tt,w("hers","last",-0.5),1200,190,640,{kick:"Under the last heading",title:"What I'm getting better at",lines:["Asking, instead of guessing"]},{light:"day",u:ag_in(tt,w("hers","asking",-0.3),0.5)});}},
    // each of the seven writes one too
    {at:c.seven-0.3,place:"lpRoom",later:true,keys:[[c.seven-0.3,960,540,1.0]],draw:(x,tt)=>{const p0=w("seven","seven",-0.4),gp=ag_in(tt,w("friday","Two",-0.3),0.5);
      for(let i=0;i<7;i++){const a=ag_in(tt,p0+i*0.14,0.35);if(a>0.004)na_page(x,152+i*236,230,200,270,{seed:31+i*13,a,k:tt-p0-i*0.14,tilt:(i%3-1)*1.2,skip:i===2?3:i===5?1:null,gap:gp});}
      na_pill(x,tt,w("friday","all",-0.3),null,960,140,"Friday 26 February: all seven have shared a page",{col:LP.green,icon:"tick"});
      na_tag(x,tt,w("friday","Two",-0.1),null,960,580,"Two left a heading out: that's theirs to leave",{align:"center",col:LP.ink});
      na_tag(x,tt,w("seven","shares",-0.3),w("friday","Two",-0.3),960,580,"Each shares what they choose",{align:"center",col:LP.ink});}},
    // Erin's page, and what no page says
    {at:c.erin-0.3,place:"lpRoom",later:true,keys:[[c.erin-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,NA_ERIN,430,650,0.98,{t:tt,light:dy});
      na_sheet(x,tt,c.erin+0.2,900,150,820,{kick:"Erin's page",title:"How to ask me for something",lines:["In writing, the day before"]},{light:"day",u:ag_in(tt,w("erin","writing",-0.4),0.5)});
      na_pill(x,tt,w("nokind","kind",-0.4),null,1310,560,"Not what kind of person anyone is",{col:LP.ink});
      na_pill(x,tt,w("nokind","how",-0.3),null,1310,644,"How to work with one person",{col:LP.green});}}
  ]);
  na_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 6. For the whole range */
scene("range",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"},mo={light:"morning",wall:0.12},e0=c.breath+0.6;
  const hT=w("asks","Helena",-0.5),spT=w("speaks","speaks",-0.3);
  ag_shots(ctx,S,t,sc.dur,[
    // she changes the meeting: four steps
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      lp_person(x,"helena",430,650,0.98,{t:tt,light:dy});
      na_pill(x,tt,c.change+0.2,c.ways1-0.4,1340,250,"She doesn't ask Erin to change",{col:LP.ink});
      na_pill(x,tt,w("change","changes",-0.3),c.ways1-0.4,1340,340,"She changes the meeting",{col:LP.blue});
      na_sheet(x,tt,c.ways1+0.1,880,120,940,{kick:"From Monday 22 February",title:"Every meeting she runs",lines:["The question goes out the working day before","Everyone writes for two minutes first","Then each person gets a turn","Anyone can add to it until the end of the next day"]},
        {col:LP.blue,light:"day",u:na_u(tt,[w("ways1","question",-0.4),w("ways2","writes",-0.4),w("ways2","turn",-0.7),w("ways3","add",-0.4)])});}},
    // that Monday, Erin speaks in her turn. Helena is in both shots, so it's a cut
    {at:c.speaks-0.4,place:"naTeamAm",cut:true,keys:[[c.speaks-0.4,960,540,1.0],[c.speaks+0.4,1010,520,1.06]],d:3,push:0,draw:(x,tt)=>{
      na_team(x,tt,{light:mo,names:1,talk:{Erin:na_says(tt,spT,spT+3.4)},gaze:{Erin:[2,0]}});
      na_bubble(x,1052,306,ag_io(tt,spT,spT+3.4,0.25),tt-spT);
      na_sheet(x,tt,c.speaks+0.1,620,60,680,{kick:"Monday 22 February",title:"A turn for each person"},{col:LP.blue,light:"morning",out:c.both-0.4});
      na_pill(x,tt,w("both","aloud",-0.5),null,680,130,"Thinks aloud",{col:LP.green,icon:"tick"});
      na_pill(x,tt,w("both","afterwards",-0.5),null,1230,130,"Thinks afterwards",{col:LP.green,icon:"tick"});
      na_pill(x,tt,w("both","Nobody",-0.3),null,960,226,"Nobody has to become someone else",{col:LP.ink});}},
    // back in Lu: where the story stops being a guide
    {at:c.leader-0.4,place:"naLu",dis:1.6,keys:[[c.leader-0.4,960,540,1.0]],push:0,draw:(x,tt)=>{
      na_luFour(x,tt,{});na_gift(x,NA_GIFT[0],NA_GIFT[1],NA_GIFT[2],1);
      na_tag(x,tt,w("leader","held",-0.3),null,300,312,"Zilu: held back",{align:"center",col:LP.ink});
      na_tag(x,tt,w("leader","urged",-0.3),null,640,312,"Ran You: urged on",{align:"center",col:LP.ink});
      na_pill(x,tt,w("leader","leader",-0.4),null,1380,130,"A leader changes her way too",{col:LP.blue});
      na_pill(x,tt,w("asks","decided",-0.5),null,1380,226,"But he decided what each one needed",{col:LP.amber});}},
    // Helena asks
    {at:hT,place:"naOne",dis:1.4,keys:[[hT,960,540,1.0]],draw:(x,tt)=>{
      na_pair(x,tt,{helena:na_says(tt,hT+0.5,hT+1.4),erin:na_says(tt,w("asks","says",-0.2),E.asks+0.4)});
      na_pill(x,tt,hT+0.5,null,960,200,"Helena asks",{col:LP.blue});
      na_pill(x,tt,w("asks","says",-0.3),null,960,290,"Each person says it for themselves",{col:LP.green});}},
    // on Monday
    {at:c.monday-0.3,place:"lpRoom",dis:1.4,keys:[[c.monday-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.4,0.6);
      if(g>0.004){x.save();x.globalAlpha*=g;
        na_sheet(x,tt,c.monday+0.2,140,200,790,{kick:"On Monday",title:"Don't sort your people",lines:["Not by a type","Not by a test","Not by a first impression"]},
          {col:LP.amber,light:"day",u:na_u(tt,[w("monday","type",-0.3),w("monday","test",-0.3),w("monday","first",-0.3)])});
        na_sheet(x,tt,c.do+0.1,990,200,790,{kick:"Instead",title:"Ask each one how they work best",lines:["Write your own page first","Build the team's ways for the whole range"]},
          {col:LP.green,light:"day",u:na_u(tt,[w("do","Write",-0.2),w("do","build",-0.3)])});
        x.restore();}
      na_tag(x,tt,w("next","next",-0.3),c.take-0.4,960,690,"Next: How, more than who",{align:"center",col:LP.ink});
      const ta=ag_in(tt,c.take,0.4)*(1-ag_in(tt,e0,0.8));
      if(ta>0.004){for(const [s,wd,px,col] of [["Ask each person how they work","Ask",620,LP.green],["Never sort them","Never",1360,LP.amber]])
        {const t1=w("take",wd,-0.1);lp_pill(x,px,470,s,{col,size:34,a:ta*ag_in(tt,t1,0.4),k:tt-t1});}}}}
  ]);
  lp_end(ctx,S,t,e0,"No two alike",NA_LAST,"Film 3 of 4","People first");
  na_kick(ctx,S,ag_in(t,0.6,0.6)*(1-ag_in(t,e0,0.8))*(1-ag_io(t,c.leader-0.6,hT+0.5,0.6)));
});
ag_cutInto(["cut","page","range"]);
