/* ===== People before roles: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Over the gorge the camera moves, so the words
   there are laid on the frame itself, not in the place. Sizes in the 1920 x 1080 frame. */

const PB_TITLE="People before roles",PB_LAST="Know the people before you plan the work.";
// the film's number and title at the top left, from the second chapter on
function pb_kick(ctx,S,a,o){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"1",PB_TITLE,Object.assign({a},o||{}));}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function pb_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const pb_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function pb_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 (and goes at t1)
function pb_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}

/* ---------------------------------------------------------------- the gorge's people, small, in the wide view */
// someone walking the bridge from one bank to the other: from t0, over dur seconds; dir 1 from the left bank, -1 from the right.
// They come along the bank, cross on the floor and go on along the other bank. Drawn between the bridge's far side and its near side
function pb_walk(cc,tt,t0,dur,dir,who,o){const s=lerp(-0.2,1.2,(tt-t0)/dur);if(s<=-0.2||s>=1.2)return;const u=dir>0?s:1-s,a=clamp((s+0.2)/0.05,0,1)*clamp((1.2-s)/0.05,0,1);let p;
  if(u<0){const k=(u+0.2)/0.2,d=pb_deck(0,o);p=[lerp(d[0]-196,d[0],k),lerp(PB_BANK.L.y-2,d[1],k)];}
  else if(u>1){const k=(u-1)/0.2,d=pb_deck(1,o);p=[lerp(d[0],d[0]+196,k),lerp(d[1],PB_BANK.R.y-2,k)];}
  else p=pb_deck(u,o);
  pb_fig(cc,p[0],p[1],50,{who,pose:"walk",t:s*26,shadow:u<0||u>1?0.3:0,flip:dir<0,a});}
// a few people by the stone bases on an ordinary day: nL on the left bank, nR on the right, a(i) each one's opacity
function pb_few(ctx,nL,nR,a){a=a==null?1:a;const L=PB_BANK.L,R=PB_BANK.R;
  for(let i=0;i<nL;i++)pb_fig(ctx,L.x0+250+i*38,L.y+2+(i%2)*4,50,{who:[4,1,6][i%3],pose:i===1?"sit":"stand",flip:i%2===0,a});
  for(let i=0;i<nR;i++)pb_fig(ctx,R.x0+60+i*44,R.y+3+(i%2)*4,50,{who:[3,0,5][i%3],pose:i===2?"sit":"stand",flip:i!==1,a});}
// the days of the renewal: both banks full, families sitting at their cord, men standing by the bases; a(i) each one's opacity
const PB_CROWD=(()=>{const R=ag_rnd(1973),P=[];
  for(let n=0;n<64;n++){const y=372+R()*88,x=24+R()*(y>436?372:446);P.push({x,y,side:0,who:(R()*8)|0,sit:R()<0.38,flip:R()<0.4});}
  for(let n=0;n<54;n++){const y=376+R()*88,x=1896-R()*(y>440?372:440);P.push({x,y,side:1,who:(R()*8)|0,sit:R()<0.3,flip:R()<0.6});}
  return P.sort((p,q)=>p.y-q.y);})();
function pb_crowd(ctx,a){PB_CROWD.forEach((p,i)=>{const al=a(i,p);if(al>0.004)pb_fig(ctx,p.x,p.y,50*pb_near(p.y),{who:p.who,pose:p.sit?"sit":"stand",flip:p.flip,a:al});});}

/* ---------------------------------------------------------------- 1. The bridge they went back to: the Apurímac, 1968 to today */
scene("bridge",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),sun={wall:0},gr={light:"grey",wall:0};
  const steelT=w("steel","steel",-0.3),truckT=w("need","cars",-0.5),wornT=c.left+1.4,rebT=c.rebuild,gatherT=c.today-0.1;
  // the gorge from 1968 to 1970: the steel bridge comes, a truck crosses it, the last walker leaves the rope, and the rope sags and frays
  const years=(x,tt)=>{const wo=ag_sine((tt-wornT)/3.2),o={age:lerp(0.5,1.3,wo),wear:0.55*wo,extra:{r1:12*wo}},su=ag_in(tt,steelT,2.4);
    pb_few(x,2,3,1-ag_in(tt,c.need+0.4,1.6));
    if(su>0.004){x.save();x.beginPath();x.rect(726,300,lerp(0,440,su),70);x.clip();pb_steel(x,{});x.restore();}
    pb_truck(x,(tt-truckT)/5.2);pb_truck(x,(tt-truckT-7.5)/5.2);
    pb_bridge(x,Object.assign({mid:cc=>pb_walk(cc,tt,c.steel-9,15,-1,3,o)},o));};
  ag_shots(ctx,S,t,sc.dur,[
    // the gorge and the river; closer, the bridge of grass and people crossing it; wide again, both banks
    {at:0,place:"pbGorge",keys:[[0,960,540,1.0],[c.rope-0.6,960,468,1.6],[c.only-0.5,960,540,1.0]],d:3.2,push:0,draw:(x,tt)=>{const o={age:0.3};
      pb_few(x,2,3);
      pb_bridge(x,Object.assign({mid:cc=>{pb_walk(cc,tt,c.rope-2.5,17,1,0,o);pb_walk(cc,tt,c.incas-1,17,-1,1,o);pb_walk(cc,tt,c.incas+3.5,17,1,6,o);pb_walk(cc,tt,c.only+0.5,17,-1,3,o);}},o));}},
    // the bank: the cord a family brings, and the hands that make it new
    {at:c.wear-0.3,place:"pbBank",keys:[[c.wear-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      lp_person(x,PB_PEOPLE.woman,420,650,0.9,{t:tt,pose:"hold",hold:(cc,h)=>pb_coil(cc,h.near[0]+34,h.near[1]+58,92,{}),light:sun});
      lp_person(x,PB_PEOPLE.builder,960,650,0.9,{t:tt+1.3,flip:true,light:sun});
      lp_person(x,PB_PEOPLE.woman3,1500,650,0.9,{t:tt+2.1,flip:true,light:sun});}},
    // 1968: the steel bridge, almost a hundred metres away, and a truck on it
    {at:c.steel-0.4,place:"pbGorge",keys:[[c.steel-0.4,960,520,1.0],[c.steel+0.3,946,402,1.85]],d:3.0,dis:1.0,push:0,draw:years},
    // 1970: under a grey sky, the rope bridge left to wear
    {at:c.left-0.3,place:"pbGorgeGrey",keys:[[c.left-0.3,946,402,1.85],[c.left+0.5,958,452,1.72]],d:3.4,dis:1.6,push:0.02,draw:years},
    // October 1972: the bank with nobody on it, last year's rope in the grass, and what the keeper said
    {at:c.keeper-0.3,place:"pbBankGrey",keys:[[c.keeper-0.3,960,540,1.0]],dis:1.2,push:0,draw:(x,tt)=>{
      pb_rope(x,pb_hang([-30,812],[720,838],16),20,{age:1.5,braid:true});
      pb_pill(x,tt,w("keeper","October",-0.1),null,250,176,"October 1972",{col:LP.ink});
      pb_sheet(x,tt,w("sad","My",-0.3),380,236,1160,{kick:"Luis Choqueneira, a keeper of the bridge",title:"“My people feel sad about abandoning the keshwa chaca for a new steel bridge upstream.”"},{light:null,pin:false});
      pb_sheet(x,tt,rebT-0.2,380,496,1160,{title:"“So we're going to rebuild it when the New Year comes.”"},{col:LP.green,light:null,pin:false});}},
    // the new year: the same bank in the sun, and the families back on it with their cord
    {at:c.did-0.4,place:"pbBank",later:true,dis:0.8,keys:[[c.did-0.4,960,540,1.0]],push:0,draw:(x,tt)=>{
      lp_person(x,PB_PEOPLE.woman,420,650,0.9,{t:tt,pose:"hold",hold:(cc,h)=>pb_coil(cc,h.near[0]+34,h.near[1]+58,92,{}),light:sun,a:ag_in(tt,c.did+0.1,0.6)});
      lp_person(x,PB_PEOPLE.builder2,960,650,0.9,{t:tt+1.3,flip:true,light:sun,a:ag_in(tt,c.did+0.7,0.6)});
      lp_person(x,PB_PEOPLE.woman2,1500,650,0.9,{t:tt+2.1,flip:true,light:sun,a:ag_in(tt,w("all","few",-0.2),0.6)});
      pb_sheet(x,tt,w("all","Only",-0.3),560,150,800,{kick:"An elder of Huinchiri, asked in 2012",title:"“Only now does everyone come.”"},{col:LP.green,light:null,pin:false});}},
    // today: each June, four communities, about a thousand people; and both bridges, side by side
    {at:c.today-0.3,place:"pbGorge",keys:[[c.today-0.3,960,540,1.0],[c.unesco-0.4,960,476,1.45],[c.turn-0.5,950,452,1.3]],d:3.2,dis:1.2,push:0,draw:(x,tt)=>{const o={age:0};
      pb_crowd(x,i=>ag_in(tt,gatherT+i*0.022,0.6));pb_steel(x,{});pb_truck(x,(tt-c.turn+0.6)/5.2);
      pb_bridge(x,Object.assign({mid:cc=>{pb_walk(cc,tt,c.minka-1,18,1,0,o);pb_walk(cc,tt,c.minka+2,18,-1,5,o);pb_walk(cc,tt,c.unesco+1,18,1,2,o);pb_walk(cc,tt,c.unesco+4,18,-1,7,o);
        pb_walk(cc,tt,c.died+2,18,1,4,o);pb_walk(cc,tt,c.died+5,18,-1,1,o);pb_walk(cc,tt,c.turn,18,1,3,o);}},o));}},
    // and a data team: seven boxes with a role in each, or the seven people in them
    {at:c.data-0.3,place:"pbTeam",keys:[[c.data-0.3,960,540,1.0]],dis:1.2,push:0,draw:(x,tt)=>{const ga=1-ag_in(tt,c.breath+0.2,0.8),pT=w("data","people",-0.5),kT=w("plan","Know",-0.3);
      x.save();x.globalAlpha*=ga;
      pb_chart(x,130,{wall:true,light:"day",a:ag_in(tt,c.data+0.1,0.4)*lerp(1,0.42,ag_in(tt,kT,0.8)),k:tt-c.data-0.1,boxes:7*clamp((tt-w("data","roles",-0.6))/1.0,0,1),
        all:ag_io(tt,w("plan","boxes",-0.3),kT,0.5)});
      pb_row(x,tt,PB_SEVEN.map((p,i)=>({who:p.who,ph:p.ph,x:PB_X7[i],flip:i>3,a:ag_in(tt,pT+i*0.2,0.6)})),{names:0});
      x.restore();}}
  ]);
  setScreen(ctx,S);
  pb_tag(ctx,t,w("where","Apurímac",-0.3),c.rope-0.7,110,176,"The Apurímac river · Quehue, Cusco, Peru",{col:LP.ink});
  pb_tag(ctx,t,w("rope","keshwa",-0.3),c.only-0.7,960,826,"Q'eswachaka: a bridge of twisted grass",{align:"center",col:LP.ink});
  pb_pill(ctx,t,steelT,c.left-0.5,960,166,"1968",{col:LP.ink});
  pb_tag(ctx,t,w("steel","almost",-0.2),c.left-0.5,960,240,"A steel bridge, almost 100 metres away",{align:"center",col:LP.ink});
  pb_pill(ctx,t,c.left+0.2,c.keeper-0.6,960,166,"1970",{col:LP.ink});
  pb_tag(ctx,t,w("left","decaying",-0.2),c.keeper-0.6,960,240,"Found decaying: not raised for a few years",{align:"center",col:LP.amber});
  const fa=ag_io(t,w("today","thousand",-0.4),c.unesco-0.6,0.4);
  if(fa>0.004)lp_figure(ctx,700,110,520,{kick:"Each June",num:"≈ 1,000",label:"people of four communities, each family with its own cord"},{col:LP.orange,light:null,pin:false,a:fa,k:t-w("today","thousand",-0.4)});
  pb_sheet(ctx,t,w("minka","minka",-0.2),1290,110,520,{kick:"Minka",title:"Unpaid work, shared for everyone's benefit"},{light:null,pin:false,out:c.unesco-0.6});
  pb_sheet(ctx,t,w("unesco","strengthening",-0.5),410,140,1100,{kick:"UNESCO, 2013",title:"“…a means of strengthening their social links and not simply as a transport route”"},{light:null,pin:false,out:c.died-0.5});
  pb_sheet(ctx,t,w("died","If",-0.4),410,140,1100,{kick:"Victoriano Arizapana, a bridge builder",title:"“If we stop preserving it, it would be like if we died.”",sub:"Interview, October 2014"},{light:null,pin:false,out:c.turn-0.5});
  pb_tag(ctx,t,w("turn","carry",-0.3),c.data-0.6,948,296,"Steel: a way across",{align:"center",col:LP.ink});
  pb_tag(ctx,t,w("turn","together",-0.4),c.data-0.6,960,716,"Rope: a way to be together",{align:"center",col:LP.green});
  lp_title(ctx,S,t,c.breath+0.2,PB_TITLE,"The first question: who is here?","Leading data people · People first");
});

/* ---------------------------------------------------------------- 2. A chart and a list */
// Helena at her desk, the two sheets lying on it
function pb_helena(x,tt,light){lp_person(x,"helena",570,676,1.0,{t:tt,cut:806,light});lp_table(x,150,814,840);pb_slivers(x);}
// her desk from above: the pencil, the list and the chart; ch and li as pb_chart and pb_list take them
function pb_desk(x,ch,li){pb_pencil(x,236,818,330,-0.17);pb_list(x,li);pb_chart(x,160,ch);}
// the plan she could make by lunch: a dashed line from the list to each box, drawn as far as u
function pb_fan(x,u,a){if(a<=0.004||u<=0.004)return;x.save();x.globalAlpha*=a;x.strokeStyle=rgba(LP.amber,1);x.lineWidth=3.4;x.lineCap="round";x.setLineDash([12,11]);
  for(let i=0;i<7;i++){const k=ag_sine(clamp(u*1.6-(6-i)*0.1,0,1));if(k<=0.004)continue;const a0=[1200+i*88,586],b=[PB_X7[i],456],m=[(a0[0]+b[0])/2,548];x.beginPath();
    for(let n=0;n<=30;n++){const v=n/30*k,q=1-v,px=q*q*a0[0]+2*q*v*m[0]+v*v*b[0],py=q*q*a0[1]+2*q*v*m[1]+v*v*b[1];n?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();}
  x.restore();}
scene("chart",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},deskT=w("helena","Two",-0.4);
  ag_shots(ctx,S,t,sc.dur,[
    // Monday 1 February: Helena at her desk, two sheets lying on it
    {at:0,place:"pbHelena",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      pb_helena(x,tt,mo);
      pb_sheet(x,tt,c.mon+0.4,1040,170,720,{kick:"Monday 1 February 2027",title:"Helena Novak",lines:["Starts as the university's data manager"]},{light:"morning",u:ag_in(tt,w("helena","starts",-0.1),0.5)});}},
    // the two sheets from above: the chart of seven boxes, and the list of 46 open requests
    {at:deskT,place:"pbDesk",keys:[[deskT,960,540,1.0]],dis:0.9,push:0,draw:(x,tt)=>{const fT=w("tempt","plan",-0.3),sT=w("sort","sort",-0.2),nT=w("sort","changes",-0.3),bT=w("boxes","boxes",-0.3);
      pb_desk(x,{boxes:7*clamp((tt-w("two","seven",-0.3))/1.1,0,1),roles:ag_in(tt,w("two","role",-0.3),0.6),lines:ag_io(tt,w("boxes","reports",-0.3),w("boxes","doesn't",-0.2),0.5),
        hi:clamp(Math.floor((tt-bT)/0.22),0,6),hiA:ag_io(tt,bT,bT+7*0.22,0.2)},
        {num:ag_in(tt,w("two","forty-six",-0.3),0.4),u:ag_in(tt,w("two","forty-six",-0.1),1.4),sorted:(tt-sT)/1.8});
      pb_fan(x,(tt-fT)/1.6,1-ag_in(tt,nT,0.7));
      pb_tag(x,tt,w("tempt","lunch",-0.3),nT,470,650,"A plan for everyone, by lunch?",{align:"center",col:LP.amber});
      pb_pill(x,tt,sT+1.2,null,900,650,"Sorted that day",{col:LP.green,icon:"tick",size:28});
      pb_tag(x,tt,w("sort","Every",-0.2),null,900,728,"As Every area, one job shows",{align:"center",col:LP.ink});
      pb_tag(x,tt,nT+0.3,null,470,650,"Nobody's work changed",{align:"center",col:LP.ink});}},
    // back in her room: the standard on putting people first
    {at:c.iso-0.3,place:"pbHelena",keys:[[c.iso-0.3,960,540,1.0]],dis:1.0,push:0,draw:(x,tt)=>{
      pb_helena(x,tt,mo);
      pb_sheet(x,tt,w("iso","standard",-0.3),1040,170,760,{kick:"ISO 27500:2016",title:"The human-centred organization",lines:["Value people, and make their work meaningful","Individual differences: a strength"]},
        {light:"morning",u:pb_u(tt,[w("iso","value",-0.2),w("iso","differences",-0.3)]),out:c.before-0.3});
      const k0=w("before","sits",-0.3),ka=ag_in(tt,k0,0.35);if(ka>0.004)pb_week(x,1040,150,760,{light:"morning",a:ka,k:tt-k0,dots:0});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.8,deskT-0.4,0.5)});
  pb_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. Four questions, seven people */
// each of the seven where they work: on which side of the frame, the cue for their sheet, and what it says
const PB_HOURS=[
  {id:"noor",who:"noor",cue:"proud",words:{kick:"Proud of",title:"Her map of the university's data",lines:["She'd like more people to argue with it"]},line:"She'd"},
  {id:"sam",who:"sam",cue:"proud",words:{kick:"Proud of",title:"Each morning the data is simply there",lines:["And nobody has to ask"]},line:"nobody"},
  {id:"jun",who:"jun",cue:"proudest",words:{kick:"Proudest",title:"When someone stops asking him",lines:["Because now they know"]},line:"because"},
  {id:"yusuf",who:"yusuf",cue:"Ask",words:{kick:"To work well with him",title:"“Ask me at the start, and I can say yes more often.”"}},
  {id:"marta",who:PB_MARTA,cue:"would",words:{kick:"Would like more of",title:"Hearing what became of a number",lines:["After she sends it"]},line:"after"},
  {id:"erin",who:PB_ERIN,cue:"started",words:{kick:"What she offers",title:"Started the same week as Marta",lines:["They still have lunch on Thursdays"]},line:"They"},
  {id:"tomas",who:PB_TOMAS,cue:"can tell",words:{kick:"Can tell you",title:"Who reads each report",lines:["And what they do with it"]},line:"what"}];
const PB_AHEAD=1.55;
scene("seven",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const shots=[
    // Helena's week, and the four questions she asks each of the seven
    {at:0,place:"pbHelena",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      pb_helena(x,tt,mo);
      pb_week(x,1040,150,760,{light:"morning",dots:2*ag_in(tt,w("hour","Monday",-0.1),0.5)+5*clamp((tt-w("hour","Thursday",-0.6))/1.2,0,1)});
      pb_sheet(x,tt,c.four+0.1,1040,392,760,{kick:"The same four questions",lines:["What are you proud of here?","What would you like more of?","What gets in your way?","What should I know, to work well with you?"]},
        {light:"morning",u:pb_u(tt,[w("q12","proud",-0.4),w("q12","more",-0.5),w("q34","way",-0.5),w("q34","know",-0.5)])});
      pb_tag(x,tt,w("never","never",-0.2),null,1420,780,"Never: health, family, or what isn't offered",{align:"center",col:LP.ink});}}];
  // one at a time, where each of them works: the afternoon turning late as the week goes on. Each comes in PB_AHEAD seconds before
  // their line, in the pause after the line before, as the score plays the figure of their name
  PB_HOURS.forEach((p,i)=>{const left=i%2===0,late=i>=4,lt={light:late?"late":"day"},at=c[p.id]-PB_AHEAD,sx=left?980:140,sT=at+(i?0.6:1.0);
    shots.push({at,place:late?"pbOfficeLate":"pbOffice",later:i>0,dis:i?0.45:1.0,keys:[[at,960,540,1.0]],push:0.02,draw:(x,tt)=>{
      lp_person(x,p.who,left?540:1380,640,1.0,{t:tt+i*2.3,flip:!left,light:lt});
      lp_nameTag(x,sx,196,p.who);
      pb_sheet(x,tt,sT,sx,278,840,p.words,{light:lt.light,u:p.line?ag_in(tt,w(p.id,p.line,-0.3),0.5):1});}});});
  // none of it is on the chart
  shots.push({at:c.none-0.3,place:"pbDesk",keys:[[c.none-0.3,960,540,1.0]],dis:1.0,push:0.03,draw:(x,tt)=>pb_desk(x,{},{sorted:1})});
  ag_shots(ctx,S,t,sc.dur,shots);
  pb_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Who they turn to */
// five of the seven in the team's room, Jun in the middle; the pencil lines from the four who turn to him, each with what they bring
const PB_ASK=[{i:1,what:"her map"},{i:2,what:"a number"},{i:4,what:"a model"},{i:5,what:"an odd load"}],PB_X5=[280,620,960,1300,1640],PB_FIVE={s:0.62,y:820,light:{light:"day"}};
function pb_five(x,tt,T){
  pb_row(x,tt,[1,2,3,4,5].map(i=>({who:PB_SEVEN[i].who,ph:PB_SEVEN[i].ph,name:PB_SEVEN[i].name,x:PB_X5[i-1],flip:i>3,a:ag_in(tt,T.in[i],0.6)})),PB_FIVE);
  PB_ASK.forEach((q,n)=>{const bx=PB_X5[q.i-1],left=q.i<3,far=Math.abs(q.i-3)>1,ta=ag_in(tt,T.arc[n]-0.2,0.4);
    if(ta>0.004)lp_tag(x,bx,540,q.what,{align:"center",col:LP.ink,a:ta});
    pb_arc(x,[bx+(left?34:-34),508],[960+(left?-1:1)*(far?26:84),572],far?-74:-46,(tt-T.arc[n])/0.9,{seed:n+3,w:4});});}
scene("turn",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const T={in:{1:w("show","Noor",-0.4),2:w("ask","Marta",-0.4),3:w("ask","Jun",-0.5),4:w("ask","Erin",-0.4),5:w("show","Sam",-0.4)},
      arc:[w("show","shows",-0.1),w("ask","asks",-0.1),w("ask","So does",0.1),w("show","load",-0.3)]},hT=w("hears","one name",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // one name, again and again; then who says it, and to whom they turn
    {at:0,place:"pbTeam",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      PB_ASK.forEach((q,n)=>pb_tag(x,tt,hT+[0.9,0,0.45,1.35][n],c.ask-0.5,PB_X5[q.i-1],540,"“Ask Jun.”",{align:"center",col:LP.ink}));
      pb_five(x,tt,T);}},
    // the chart: Jun is one box of seven, with one line, up; then the lines it doesn't have
    {at:c.box-0.3,place:"pbDesk",keys:[[c.box-0.3,960,540,1.0]],dis:1.0,push:0.03,draw:(x,tt)=>{const aT=w("shows","turn",-0.5);
      pb_desk(x,{hi:PB_JUN,hiA:ag_in(tt,w("box","one box",-0.3),0.5),up:ag_io(tt,w("box","line",-0.3),c.shows-0.2,0.5),lines:ag_io(tt,w("shows","manages",-0.4),aT,0.5),
        arcs:[0,1,2,3].map(n=>(tt-aT-[0.5,0,0.25,0.75][n])/0.8)},{sorted:1});}},
    // the team's room again: an idea from Southern Africa, and what researchers found
    {at:c.ubuntu-0.3,place:"pbTeam",keys:[[c.ubuntu-0.3,960,540,1.0]],dis:1.0,push:0,draw:(x,tt)=>{
      pb_five(x,tt,T);
      pb_sheet(x,tt,w("ubuntu","Ubuntu",-0.1),410,130,1100,{kick:"Ubuntu",title:"“A person is a person through other people”",sub:"A saying in isiZulu · The team comes first"},{light:"day",out:c.shared-0.4});
      pb_sheet(x,tt,w("shared","shared",-0.3),200,130,900,{kick:"Shared leadership",title:"People in a team leading one another",sub:"Whoever holds the title"},{light:"day",out:c.title-0.4});
      const f0=w("review","forty-two",-0.4),fa=ag_io(tt,f0,c.title-0.4,0.4);
      if(fa>0.004)lp_figure(x,1140,130,580,{kick:"Wang and others, 2014",num:"42",label:"samples: teams that share the leading do better"},{col:LP.orange,light:"day",a:fa,k:tt-f0});
      pb_pill(x,tt,w("title","Anyone",-0.3),c.room-0.4,960,300,"Anyone can lead from where they are",{col:LP.ink,size:36});}},
    // Helena makes room for it: Jun stays where he is, and she asks him
    {at:c.room-0.3,place:"pbTeam",keys:[[c.room-0.3,960,540,1.0],[c.room+0.4,1130,640,1.24]],d:2.6,dis:0.8,push:0,draw:(x,tt)=>{
      pb_row(x,tt,[{who:"jun",ph:PB_SEVEN[PB_JUN].ph,name:"Jun",x:960},{who:"helena",ph:PB_HELENA_PH,name:"Helena",x:1300,flip:true,a:ag_in(tt,w("room","She asks",-0.4),0.7)}],PB_FIVE);
      pb_tag(x,tt,w("room","March",-0.3),null,1130,516,"From March: beside a newcomer",{align:"center",col:LP.green});}}
  ]);
  pb_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. What won't change yet */
// all eight in the team's room: Helena at the left, the seven turned to her
const PB_X8=[162,390,618,846,1074,1302,1530,1758];
// The score plays the seven first names as one phrase, in the row's order (tools/score.py: SING, the same numbers): sing is how long
// ago it began, and each name lifts a little as it is played; where the two instruments end together (PB_SING_ALL), all eight do
const PB_SING=[0,0.62,1.10,1.72,2.20,2.82,3.30],PB_SING_ALL=4.0,pb_lift=u=>u<0?0:ag_in(u,0,0.12)*(1-ag_in(u,0.26,0.5));
function pb_eight(x,tt,a,light,names,sing){const L=i=>sing==null?0:Math.max(i<0?0:pb_lift(sing-PB_SING[i]),pb_lift(sing-PB_SING_ALL));
  pb_row(x,tt,[{who:"helena",ph:PB_HELENA_PH,name:"Helena",x:PB_X8[0],a:a(0),lift:L(-1)}].concat(PB_SEVEN.map((p,i)=>({who:p.who,ph:p.ph,name:p.name,x:PB_X8[i+1],flip:true,a:a(i+1),lift:L(i)}))),
    {s:0.46,y:850,light,names});}
scene("friday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"},inT=Math.max(w("fri","brings",-0.4),2.2);
  ag_shots(ctx,S,t,sc.dur,[
    // Friday 5 February: all seven in the team's room, and what Helena can promise
    {at:0,place:"pbTeamFri",later:true,dis:0.6,keys:[[0,1130,640,1.24],[0.2,960,540,1.0]],d:2.2,push:0,draw:(x,tt)=>{
      pb_eight(x,tt,i=>ag_in(tt,inT+i*0.14,0.6),lt);
      pb_sheet(x,tt,Math.max(c.fri+0.3,2.5),560,130,800,{kick:"Friday 5 February",title:"All seven, in the team's room"},{light:"late",out:c.fear-0.4});
      pb_sheet(x,tt,w("fear","change",-0.4),410,130,1100,{kick:"A hazard of work",title:"Poor organisational change management",sub:"Safe Work Australia, psychosocial hazards"},{col:LP.amber,light:"late",out:c.stays-0.4});
      pb_sheet(x,tt,w("stays","promise",-0.4),410,130,1100,{kick:"What Helena can promise",title:"Who does what stays as it is, this month",lines:["Not promised: that nothing will change","Said: what stays, and for how long"]},
        {col:LP.green,light:"late",u:pb_u(tt,[w("notall","nothing",-0.3),w("notall","only",-0.3)])});}},
    // the gorge, October 1972: four years after the steel bridge came
    {at:c.keeper-0.3,place:"pbGorgeGrey",keys:[[c.keeper-0.3,952,430,1.5]],dis:1.0,push:0.03,draw:(x,tt)=>{pb_steel(x,{});pb_bridge(x,{age:1.3,wear:0.55,extra:{r1:12}});}},
    // her first week, and what she knows at the end of it
    {at:c.week-0.3,place:"pbTeamFri",keys:[[c.week-0.3,960,540,1.0]],dis:1.0,push:0,draw:(x,tt)=>{
      pb_eight(x,tt,()=>1,lt,1,tt-(c.breath-0.5));
      const k0=c.week,ka=ag_in(tt,k0,0.35);if(ka>0.004)pb_week(x,580,130,760,{light:"late",a:ka,k:tt-k0,fri:ag_in(tt,w("week","first",-0.2),0.5)});
      pb_pill(x,tt,w("knows","planned",-0.3),null,960,420,"Nobody's work planned yet",{col:LP.ink,size:30});
      pb_pill(x,tt,w("knows","seven",-0.3),null,960,510,"Seven people, known",{col:LP.green,icon:"tick",size:30});}}
  ]);
  setScreen(ctx,S);
  pb_pill(ctx,t,w("keeper","steel",-0.3),c.week-0.6,952,338,"1968 · the steel bridge",{col:LP.ink,size:28});
  pb_pill(ctx,t,w("keeper","keeper",-0.3),c.week-0.6,960,770,"1972 · “We're going to rebuild it”",{col:LP.green,size:28});
  pb_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"},e0=c.breath+0.6,goT=w("back","went",-0.6);
  ag_shots(ctx,S,t,sc.dur,[
    // the gorge today: steel does the carrying, and people on both banks at the rope
    {at:0,place:"pbGorge",keys:[[0,946,396,1.8],[goT,960,492,1.32]],d:3.4,push:0,draw:(x,tt)=>{const o={age:0};
      pb_crowd(x,()=>1);pb_steel(x,{});pb_truck(x,(tt-0.4)/5.2);
      pb_bridge(x,Object.assign({mid:cc=>{pb_walk(cc,tt,-6,18,1,0,o);pb_walk(cc,tt,-1,18,-1,5,o);pb_walk(cc,tt,3,18,1,2,o);}},o));}},
    // the two sheets, with the pencil's lines on the chart
    {at:c.same-0.3,place:"pbDesk",keys:[[c.same-0.3,960,540,1.0]],dis:1.0,push:0.03,draw:(x,tt)=>{
      pb_desk(x,{arcs:[1,1,1,1]},{sorted:1});
      pb_pill(x,tt,w("same","who",-0.3),null,620,660,"Who is here?",{col:LP.ink,size:36});}},
    // the eight of them, and what to do on Monday
    {at:c.m1-0.3,place:"pbTeam",keys:[[c.m1-0.3,960,540,1.0]],dis:1.0,push:0,draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.4,0.6);
      pb_eight(x,tt,()=>1,dy,1-ag_in(tt,e0-0.2,0.6),tt-(c.take+0.3));
      if(g>0.004){x.save();x.globalAlpha*=g;
        pb_sheet(x,tt,c.m1+0.2,450,130,1020,{kick:"On Monday",lines:["Before you plan anyone's work, sit down with each person","Ask about them at work: proud of what, held up by what",
          "Notice who people turn to, and make room for it","Say early what won't change yet"]},{light:"day",u:pb_u(tt,[w("m1","sit",-0.3),w("m2","Ask",-0.2),w("m3","Notice",-0.2),w("m4","say",-0.3)])});
        x.restore();}
      pb_tag(x,tt,w("next","Wellbeing",-0.2),c.take-0.4,960,520,"Next: Wellbeing is in the work · What do they need?",{align:"center",col:LP.ink});
      pb_pill(x,tt,c.take,e0,960,330,"Know the people before you plan the work",{col:LP.ink,size:38});}}
  ]);
  setScreen(ctx,S);
  pb_tag(ctx,t,0.9,goT,948,250,"Steel does the carrying",{align:"center",col:LP.ink});
  pb_tag(ctx,t,w("back","each other",-0.3),c.same-0.6,960,790,"What they went back for: each other",{align:"center",col:LP.green});
  lp_end(ctx,S,t,e0,PB_TITLE,PB_LAST,"Film 1 of 4","People first");
  pb_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["seven","friday"]);
