/* ===== The team comes first: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves, or cuts where both show the same people. Sizes
   in the 1920 x 1080 frame. */

const TF_LAST="Nobody alone, nobody the only one who knows.";
// the film's number and title at the top left, from the second chapter on; dk, 0 to 1: pale words for a dark room
function tf_kick(ctx,S,a,dk){if(a<=0.004)return;setScreen(ctx,S);dk=clamp(dk||0,0,1);const x=96,y=100;
  lp_T(ctx,"3",x,y,{w:800,size:28,col:mix(LP.ink,LP.paper,dk),a});lp_T(ctx,"THE TEAM COMES FIRST",x+lp_tw(ctx,"3",{w:800,size:28})+22,y,{w:800,size:28,ls:3.5,col:mix(LP.mut,[226,216,206],dk),a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function tf_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const tf_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays); a pill the same way, springing in
function tf_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function tf_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// a green tick in a disc, springing in from t0
function tf_tick(ctx,t,t0,x,y,a){if(t<t0)return;const f=lerp(0.6,1,ag_spr(t-t0,0,0.5));ctx.save();ctx.globalAlpha*=ag_in(t,t0,0.3)*(a==null?1:a);ctx.fillStyle=rgba(LP.green,1);
  ctx.beginPath();ctx.arc(x,y,24*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",x,y,32*f,[255,255,255]);ctx.restore();}
// a person fading in at t0 (and out at t1): lp_person's options
function tf_who(ctx,t,t0,t1,who,x,y,s,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.5);if(a<=0.004)return;lp_person(ctx,who,x,y,s,Object.assign({},o,{t,a}));}
// a near hand that rises to hold something from t0 (over 0.45 s), the thing coming in with it: o for lp_person
function tf_holds(t,t0,thing){const m=ag_in(t,t0,0.45);return{pose:"hang",pose2:"hold",mix:m,holdBack:(c,h)=>{if(m<=0.004)return;c.save();c.globalAlpha*=m;thing(c,h);c.restore();}};}
const tf_n=(n,f)=>{const a=[];for(let i=0;i<n;i++)a.push(f(i));return a;};

/* ---------------------------------------------------------------- 1. Through other people: Johannesburg, the 1930s */
scene("stokvel",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),Wm=TF_WOMEN,out={light:"day",wall:0},lt={light:"late",wall:0.12};
  // the members at their table in the room in the yard, the pot on it: drawn the same in every shot of the room
  const table=(x,tt)=>{for(const [i,px,fl] of [[0,300,false],[1,510,false],[2,730,true],[3,940,true]])lp_person(x,Wm[i],px,690,0.66,{t:tt,flip:fl,cut:806,light:lt});
    lp_table(x,160,812,920);tf_pot(x,620,762,0.9,0.5,1);};
  // the stokvel as a ring, on a sheet on the room's wall; o.words: [{text, a, pill, col}] under it, one at a time
  const chart=(x,o)=>{const a=o.a==null?1:o.a;if(a<=0.004)return;x.save();x.globalAlpha*=a;if(o.k!=null)ag_about(x,1470,465,lerp(0.6,1,ag_spr(o.k,0,0.5)));
    lp_sheet(x,1110,140,720,650,{light:"late"});lp_T(x,"A STOKVEL: A SAVINGS GROUP",1146,220,{w:800,size:28,ls:3,col:LP.mut});tf_ring(x,1470,480,150,o.ring);
    for(const wd of (o.words||[]))if(wd.a>0.004){if(wd.pill)lp_pill(x,1470,736,wd.text,{col:wd.col||LP.green,a:wd.a});else lp_T(x,wd.text,1470,748,{w:700,size:30,align:"center",a:wd.a,col:wd.col||LP.ink});}
    x.restore();};
  const rules=(x,tt)=>tf_sheet(x,tt,w("rules","rules",-0.2),150,110,620,{kick:"The group's rules",lines:["How much to pay","How often to meet","Whose turn comes next","What if someone can't pay"]},
    {col:LP.blue,light:"late",u:tf_u(tt,[w("rules","much",-0.2),w("rules","often",-0.2),w("rules","turn",-0.2),w("rules","happens",-0.2)]),out:c.answer-0.5});
  const ubuntu=(x,tt)=>tf_sheet(x,tt,w("ubuntu","Ubuntu",-0.2),1150,200,660,{kick:"Ubuntu · Southern Africa",title:"Umuntu ngumuntu ngabantu",sub:"A saying in isiZulu: a person is a person through other people"},{light:"late"});
  // the team's ring: everyone pays in, everyone holds the work, and the ring holds when one of them steps away
  const teamRing=(x,tt)=>{const s0=c.team+0.1,p0=w("team","pays",-0.2),h0=w("team","alone",-0.7),a0=w("step","step",-0.3),hd=w("step","holds",-0.1);
    x.save();x.globalAlpha*=ag_in(tt,s0,0.4);ag_about(x,960,460,lerp(0.6,1,ag_spr(tt-s0,0,0.5)));
    lp_sheet(x,560,110,800,700,{light:"day"});lp_T(x,"A TEAM",596,190,{w:800,size:28,ls:3,col:LP.mut});
    tf_ring(x,960,470,190,{n:6,work:1,pay:tf_n(6,i=>clamp((tt-p0-i*0.14)/0.9,0,1)),hold:ag_in(tt,h0,1.4),away:{i:2,u:clamp((tt-a0)/1.8,0,1)}});
    const ha=ag_in(tt,h0+0.5,0.4)*(1-ag_in(tt,a0-0.5,0.3)),ga=ag_in(tt,hd,0.4);
    if(ha>0.004)lp_T(x,"Nobody carries the work alone",960,772,{w:700,size:30,align:"center",a:ha});
    if(ga>0.004)lp_pill(x,960,760,"The group holds",{col:LP.green,a:ga,k:tt-hd});x.restore();};
  ag_shots(ctx,S,t,sc.dur,[
    // Johannesburg, the 1930s: a yard of rooms near the city, and women earning what they can
    {at:0,place:"tfYard",keys:[[0,1010,540,1.08],[c.when+0.4,960,540,1.0]],d:3,draw:(x,tt)=>{const f=ag_in(tt,w("yard","women",-0.5),0.8);
      tf_sheet(x,tt,w("when","Johannesburg",-0.2),110,110,600,{kick:"Johannesburg, South Africa",title:"The 1930s"},{light:null,pin:false});
      if(f>0.004){x.save();x.globalAlpha*=f;
        lp_person(x,Wm[0],480,700,0.76,Object.assign({t:tt,light:out},tf_holds(tt,w("earn","washing",-0.3),tf_bundle)));
        lp_person(x,Wm[1],960,700,0.76,Object.assign({t:tt,light:out},tf_holds(tt,w("earn","sewing",-0.3),tf_garment)));
        lp_person(x,Wm[4],1440,700,0.76,Object.assign({t:tt,flip:true,light:out},tf_holds(tt,w("earn","selling",-0.3),tf_basket)));x.restore();}
      tf_tag(x,tt,w("earn","washing",-0.1),null,480,352,"Washing",{align:"center"});
      tf_tag(x,tt,w("earn","sewing",-0.1),null,960,352,"Sewing",{align:"center"});
      tf_tag(x,tt,w("earn","selling",-0.1),null,1440,352,"Selling",{align:"center"});
      tf_tag(x,tt,w("earn","irregular",-0.2),null,960,262,"Low and irregular pay",{align:"center",col:LP.amber});}},
    // eight or ten who trust each other: a stokvel, drawn as a ring
    {at:c.group-0.3,place:"tfMeet",cut:true,keys:[[c.group-0.3,960,540,1.0]],draw:(x,tt)=>{table(x,tt);const s0=c.group+0.1,e0=w("group","Eight",-0.1);
      chart(x,{a:ag_in(tt,s0,0.4),k:tt-s0,ring:{n:8,ring:clamp((tt-w("group","trust",-0.3))/1.6,0,1),show:tf_n(8,i=>clamp((tt-e0-i*0.16)/0.4,0,1)),pot:ag_in(tt,w("group","savings",-0.3),0.5),fill:0},
        words:[{text:"Eight or ten who trust each other",a:ag_in(tt,w("group","trust",0),0.4)}]});}},
    // each pays the same into one pot, one takes it all, in turn, until every member has had hers
    {at:c.turn-0.3,place:"tfMeet",keys:[[c.turn-0.3,1070,540,1.15]],d:1.8,draw:(x,tt)=>{table(x,tt);
      const p1=w("turn","pays",-0.1),T0=w("turn","takes",-0.2),U=w("turn","until",-0.1),pay=tf_n(8,i=>clamp((tt-p1-i*0.12)/0.9,0,1)),inN=pay.filter(v=>v>=1).length;
      chart(x,{ring:{n:8,pot:1,fill:inN/8*(1-ag_in(tt,T0+0.5,0.25)),pay,take:{i:0,u:clamp((tt-T0)/0.9,0,1)},had:tf_n(8,i=>i===0?ag_in(tt,T0+0.8,0.3):ag_in(tt,U+(i-1)*0.24,0.3))},
        words:[{text:"Eight or ten who trust each other",a:1-ag_in(tt,p1-0.6,0.3)},{text:"Each pays the same sum",a:ag_io(tt,p1,T0-0.5,0.3)},{text:"One takes it all, in turn",a:ag_in(tt,T0-0.1,0.4)}]});}},
    // the banks: no account, and no loan
    {at:c.banks-0.3,place:"tfBank",keys:[[c.banks-0.3,960,540,1.0]],draw:(x,tt)=>{
      tf_sheet(x,tt,w("banks","bank",-0.4),90,130,560,{kick:"The banks",title:"Few Black South Africans had an account",sub:"Then, or for decades after, under apartheid"},{col:LP.amber,light:null,pin:false});
      tf_sheet(x,tt,w("lend","lend",-0.3),1270,130,560,{kick:"And no loans",lines:["Their pay was low and irregular","The law kept them from owning property a bank would take as security"]},
        {col:LP.amber,light:null,pin:false,u:tf_u(tt,[w("lend","irregular",-0.3),w("lend","law",-0.2)])});}},
    // what one funeral, a term's fees or a lost wage could do
    {at:c.harm-0.3,place:"tfYardDusk",keys:[[c.harm-0.3,960,540,1.0]],draw:(x,tt)=>{
      tf_who(x,tt,c.harm+0.1,null,Wm[3],1480,700,0.76,{flip:true,light:{light:"evening",wall:0}});
      tf_tag(x,tt,w("harm","safe",-0.3),null,620,260,"No safe place to save",{align:"center",col:LP.amber});
      tf_tag(x,tt,w("harm","borrow",-0.3),null,620,340,"No one to borrow from",{align:"center",col:LP.amber});
      tf_tag(x,tt,w("harm","funeral",-0.1),null,330,540,"A funeral",{align:"center",col:LP.amber});
      tf_tag(x,tt,w("harm","fees",-0.3),null,700,540,"A term's school fees",{align:"center",col:LP.amber});
      tf_tag(x,tt,w("harm","wage",-0.2),null,1070,540,"A lost wage",{align:"center",col:LP.amber});
      tf_pill(x,tt,w("harm","ruin",-0.1),null,700,660,"Could ruin a family",{col:LP.amber});}},
    // something had to change: their own way, out of trust, and the rules they agree together
    {at:c.change-0.3,place:"tfMeet",cut:true,keys:[[c.change-0.3,960,540,1.0]],draw:(x,tt)=>{table(x,tt);
      tf_sheet(x,tt,w("change","built",-0.3),1150,180,600,{kick:"Out of trust",title:"Their own way"},{col:LP.blue,light:"late",out:c.answer-0.7});rules(x,tt);}},
    // every member answers to the others; when one falls on hard times, the group carries her; and the idea behind it
    {at:c.answer-0.3,place:"tfMeet",keys:[[c.answer-0.3,1070,540,1.15]],d:1.8,draw:(x,tt)=>{table(x,tt);rules(x,tt);
      const a0=w("answer","answers",-0.3),n0=w("answer","nobody",-0.3),pay=tf_n(8,i=>clamp((tt-n0-i*0.1)/0.9,0,1)),inN=pay.filter(v=>v>=1).length;
      const b0=w("burial","burial",-0.2),bc=w("burial","carries",-0.2),h2=w("carry","hard",-0.3),c2=w("carry","carries",-0.2),one=tt<h2-0.1;
      chart(x,{a:ag_in(tt,c.answer-0.2,0.4)*(1-ag_in(tt,c.ubuntu-0.3,0.4)),k:tt-c.answer+0.2,ring:{n:8,web:ag_in(tt,a0,1.6),pot:1,fill:inN/8,pay,
          had:tf_n(8,i=>i===5&&!one?1:0),hard:one?{i:5,u:ag_in(tt,b0,0.6)}:{i:2,u:ag_in(tt,h2,0.6)},carry:one?{i:5,u:clamp((tt-bc)/1.4,0,1)}:{i:2,u:clamp((tt-c2)/1.4,0,1)}},
        words:[{text:"Every member answers to the others",a:ag_io(tt,a0,n0-0.2,0.3)},{text:"Almost nobody fails to pay",pill:true,col:LP.green,a:ag_io(tt,n0+0.3,c.burial-0.2,0.35)},
          {text:"A burial society",a:ag_io(tt,b0,c.carry-0.2,0.35)},{text:"The group carries her",pill:true,col:LP.green,a:ag_in(tt,c2+0.2,0.35)}]});
      ubuntu(x,tt);}},
    // savings, credit and a safety net, for decades
    {at:c.decades-0.3,place:"tfMeet",keys:[[c.decades-0.3,960,540,1.0]],d:1.8,draw:(x,tt)=>{table(x,tt);ubuntu(x,tt);
      tf_tag(x,tt,w("decades","savings",-0.1),null,330,420,"Their savings",{align:"center",col:LP.green});
      tf_tag(x,tt,w("decades","credit",-0.1),null,620,420,"Their credit",{align:"center",col:LP.green});
      tf_tag(x,tt,w("decades","safety",-0.1),null,910,420,"Their safety net",{align:"center",col:LP.green});}},
    // today
    {at:c.today-0.3,place:"lpRoom",keys:[[c.today-0.3,960,540,1.0]],draw:(x,tt)=>{const m0=w("today","million",-0.6),b0=w("rand","billion",-0.6);
      if(tt>=m0)lp_figure(x,240,250,660,{kick:"More than",num:"11 million",label:"South Africans in a stokvel"},{col:LP.green,a:ag_in(tt,m0,0.35),k:tt-m0});
      if(tt>=b0)lp_figure(x,1020,250,660,{kick:"Over",num:"R50 billion",label:"Put in together, every year"},{col:LP.green,a:ag_in(tt,b0,0.35),k:tt-b0});
      tf_tag(x,tt,w("today","National",-0.2),null,960,640,"By the National Stokvel Association's count",{align:"center"});}},
    // a team can hold its people the same way
    {at:c.team-0.3,place:"lpRoom",later:true,keys:[[c.team-0.3,960,540,1.0]],draw:(x,tt)=>teamRing(x,tt)}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,"The team comes first","A person is a person through other people","Leading data people · Leading a data team");
});

/* ---------------------------------------------------------------- 2. The team as a whole */
scene("whole",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const hx=tt=>lerp(1400,1600,ag_sine(ag_in(tt,c.watch-0.6,1.4)));
  // the team's ring on a sheet on the wall, as Helena reads it: drawn the same in each shot that shows it
  const ring=(x,tt,o)=>{const a=o.a==null?1:o.a;if(a<=0.004)return;x.save();x.globalAlpha*=a;if(o.k!=null)ag_about(x,1330,470,lerp(0.6,1,ag_spr(o.k,0,0.5)));
    lp_sheet(x,880,110,900,720,{light:"morning"});lp_T(x,"THE TEAM",916,190,{w:800,size:28,ls:3,col:LP.mut});tf_ring(x,1330,480,210,Object.assign({n:7},o.ring));
    for(const wd of (o.words||[]))if(wd.a>0.004)lp_pill(x,1330,780,wd.text,{col:wd.col||LP.green,a:wd.a});x.restore();};
  const i0=ag_shots(ctx,S,t,sc.dur,[
    // her first day; before she judges anyone, she watches
    {at:0,place:"tfMorning",keys:[[0,960,540,1.04],[1.4,960,540,1.0]],d:2.6,draw:(x,tt)=>{
      tf_sheet(x,tt,w("helena","Helena",-0.3),220,180,640,{kick:"Monday 1 February 2027",title:"Helena Novak",sub:"The new data manager"},{light:"morning",out:c.watch-0.7});
      const ta=ag_in(tt,c.watch-0.4,0.8);if(ta>0.004){x.save();x.globalAlpha*=ta;
        for(const [who,px,fl] of [["noor",360,false],["sam",610,false],["jun",900,true],[TF_ERIN,1150,true]])lp_person(x,who,px,650,0.72,{t:tt,flip:fl,cut:814,light:mo});
        lp_table(x,200,820,1110);lp_laptop(x,485,790,170,{glow:0.5});lp_laptop(x,1025,790,170,{glow:0.5});x.restore();}
      tf_who(x,tt,0.5,null,"helena",hx(tt),640,1.0,{flip:true,light:mo,gaze:[-2,1]});}},
    // every week, half an hour with each person, about them
    {at:c.weekly-0.3,place:"tfMorning",later:true,keys:[[c.weekly-0.3,960,540,1.0]],draw:(x,tt)=>{const T0=c.weekly+0.2,step=2.3;
      tf_sheet(x,tt,c.weekly+0.1,170,150,620,{kick:"Every week",title:"Half an hour with each person",sub:"About them, never a status report"},{light:"morning",u:1});
      ["noor","jun","sam",TF_ERIN].forEach((who,k)=>tf_who(x,tt,T0+k*step,k<3?T0+(k+1)*step-0.45:null,who,800,690,0.8,{cut:806,light:mo}));
      lp_person(x,"helena",1150,690,0.8,{t:tt,flip:true,cut:806,light:mo});lp_table(x,620,812,720);
      tf_tag(x,tt,w("asks","how",-0.2),null,975,250,"How are you?",{align:"center"});
      tf_tag(x,tt,w("asks","way",-0.2),null,975,330,"What's in your way?",{align:"center"});
      tf_tag(x,tt,w("asks","proud",-0.2),null,975,410,"What are you proud of?",{align:"center"});}},
    // the team as a whole, against what this team really does; they might look slow, but
    {at:c.whole-0.3,place:"tfMorning",later:true,keys:[[c.whole-0.3,960,540,1.0]],draw:(x,tt)=>{const t0=c.whole+0.1,a=ag_in(tt,t0,0.35)*(1-ag_in(tt,c.slow-0.6,0.4));
      if(a>0.004){x.save();x.globalAlpha*=a;ag_about(x,960,430,lerp(0.6,1,ag_spr(tt-t0,0,0.5)));lp_sheet(x,330,130,1260,620,{light:"morning"});
        lp_T(x,"READING THE TEAM",366,210,{w:800,size:28,ls:3,col:LP.mut});
        const tg=w("whole","together",-0.3),g=ag_sine(ag_in(tt,tg,0.9));if(g>0.004){x.fillStyle=rgba(LP.green,1);rr(x,370,250,1180*g,84,10);x.fill();}
        lp_T(x,"What it achieves together",400,304,{w:800,size:32,color:"#fff",a:ag_in(tt,tg+0.7,0.3)});
        const e0=w("whole","each",-0.2);[150,120,170,96,140,110,160].forEach((h,i)=>{const u=ag_sine(ag_in(tt,e0+i*0.1,0.6));if(u<=0.004)return;x.fillStyle=rgba(mix(LP.mut,LP.paper,0.35),1);rr(x,370+i*170,580-h*u,130,h*u,8);x.fill();});
        lp_T(x,"Each person's work, beside it",370,628,{w:700,size:28,col:LP.mut,a:ag_in(tt,e0+0.5,0.4)});
        const l0=w("really","last",-0.3),r0=w("really","really",-0.3);lp_tag(x,1550,692,"Against what this team really does",{align:"right",col:LP.blue,a:ag_in(tt,r0,0.4)});
        const la=ag_in(tt,l0,0.4);if(la>0.004){const b=lp_tag(x,370,692,"What her last team did",{col:LP.mut,a:la});x.strokeStyle=rgba(LP.mut,la);x.lineWidth=3;x.beginPath();x.moveTo(b.x+18,692);x.lineTo(b.x+18+(b.w-36)*ag_sine(ag_in(tt,l0+0.3,0.5)),692);x.stroke();}
        x.restore();}
      tf_sheet(x,tt,c.slow+0.2,280,170,640,{kick:"Against her last team",title:"They might look slow"},{col:LP.amber,light:"morning",out:c.weighs-0.6});
      tf_sheet(x,tt,w("eleven","eleven",-0.6),1000,170,640,{kick:"What this team really does",lines:["Takes requests in 11 different ways","Keeps a platform running day and night"]},
        {light:"morning",out:c.weighs-0.6,u:tf_u(tt,[w("eleven","eleven",-0.3),w("eleven","platform",-0.3)])});}},
    // managing and leading, and leading weighs a little more: the people first
    {at:c.weighs-0.3,place:"tfMorning",later:true,keys:[[c.weighs-0.3,960,540,1.0]],draw:(x,tt)=>{const b0=c.weighs+0.1;
      tf_balance(x,960,300,{left:"Managing",right:"Leading",tilt:0.075*ag_sine(ag_in(tt,w("weighs","weighs",-0.3),1.4)),a:ag_in(tt,b0,0.5)});
      tf_tag(x,tt,w("first","strength",-0.3),null,960,720,"The people: the team's first strength",{align:"center"});
      tf_pill(x,tt,w("first","wellbeing",-0.2),null,960,806,"Their wellbeing comes first",{col:LP.green});}},
    // wellbeing isn't only comfort; then the gap that matters most
    {at:c.comfort-0.3,place:"tfMorning",later:true,keys:[[c.comfort-0.3,960,540,1.0]],draw:(x,tt)=>{const s0=w("comfort","Sometimes",-0.3),p0=w("comfort","push",-0.2),g0=w("open","gap",-0.3),G=w("gap","gap",-0.3);
      tf_sheet(x,tt,c.comfort+0.1,150,150,640,{kick:"Wellbeing isn't only comfort",lines:["More support","A better tool","Encouragement","A push"]},
        {light:"morning",out:c.gap+0.2,u:tf_u(tt,[w("comfort","support",-0.2),w("comfort","tool",-0.2),w("comfort","encouragement",-0.2),p0])});
      ring(x,tt,{a:ag_in(tt,c.comfort+0.3,0.4),k:tt-c.comfort-0.3,ring:{hard:{i:4,u:ag_in(tt,s0,0.8)},carry:{i:4,u:clamp((tt-p0)/1.4,0,1)},mark:{i:0,a:ag_in(tt,G,0.5)}},
        words:[{text:"No big gap opens",a:ag_io(tt,g0+0.2,G-0.2,0.35)}]});}},
    // every alert at night goes to one person
    {at:c.sam-0.3,place:"tfSam",keys:[[c.sam-0.3,960,540,1.0]],draw:(x,tt)=>{const s0=w("sam","alert",-0.4),x0=w("sixty","sixty",-0.5);
      const al=ag_io(tt,s0,x0,0.3),flash=0.5+0.5*Math.sin(tt*5.5);
      lp_person(x,"sam",600,640,0.95,Object.assign({t:tt,light:{light:"evening"}},{pose:"hold",holdBack:tf_phone({lit:1,alert:al*(0.6+0.4*flash)+(1-al)*ag_in(tt,x0,0.4)*0.8})}));
      tf_glow(x,700,560,320,0.8);
      [["01:12 · A load ran slowly",0.4],["02:47 · A disk filling up",1.3],["04:05 · A job tried again",2.2]].forEach(([s,d],k)=>tf_pill(x,tt,s0+d,x0,1340,290+k*90,s,{col:LP.amber,size:28}));
      if(tt>=x0)lp_figure(x,1060,160,620,{kick:"Night alerts",num:"About 60",label:"A week, most needing nothing"},{col:LP.amber,light:"evening",a:ag_in(tt,x0,0.35),k:tt-x0});
      tf_tag(x,tt,w("sixty","only",-0.2),null,1370,620,"Only Sam knows how to answer them",{align:"center",col:LP.amber});}},
    // the team leans on one person, and he has nobody to lean on
    {at:c.leans-0.3,place:"tfMorning",keys:[[c.leans-0.3,960,540,1.0]],draw:(x,tt)=>{const l0=w("leans","leans",-0.3);
      ring(x,tt,{ring:{mark:{i:0,a:1},lean:{i:0,u:clamp((tt-l0)/1.6,0,1)},names:["Sam"],nameA:ag_in(tt,c.leans,0.4),carry:{i:4,u:1-ag_in(tt,c.leans-0.2,0.9)},had:[0,0,0,0,1-ag_in(tt,c.leans-0.2,0.6)]}});
      tf_tag(x,tt,w("leans","nobody",-0.2),null,500,440,"Nobody for him to lean on",{align:"center",col:LP.amber});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.6,c.weekly-0.3,0.5)});
  tf_kick(ctx,S,ag_in(t,0.6,0.6),ag_io(t,c.sam-0.3,c.leans-0.3,0.5));
});

/* ---------------------------------------------------------------- 3. Said out loud */
scene("aloud",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"},mo={light:"morning"};
  // the stand-up: the team in a row, the next morning
  const row=[["ivy",330,false],["jun",610,false],["noor",890,false],["sam",1170,true],[TF_ERIN,1450,true],["helena",1710,true]];
  const standup=(x,tt,a)=>{if(a<=0.004)return;x.save();x.globalAlpha*=a;for(const [who,px,fl] of row)lp_person(x,who,px,770,0.62,{t:tt,flip:fl,light:mo});x.restore();};
  const glossary=(x,tt)=>tf_sheet(x,tt,w("glossary","glossary",-0.3),1160,140,640,{kick:"Glossary",title:"Used hours",sub:"Hours with people actually in the room"},{col:LP.blue,light:"morning"});
  ag_shots(ctx,S,t,sc.dur,[
    // April: Ivy reviews the agent's draft, and catches what it counts as used
    {at:0,place:"tfLate",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const d0=w("april","drafted",-0.6),b0=w("draft","booked",-0.2),u0=w("draft","room",-0.4),k0=w("caught","catches",-0.1);
      lp_nameTag(x,96,230,"ivy",{role:"Graduate data analyst",a:ag_io(tt,w("april","Ivy",-0.2),c.caught,0.4)});
      const sh=tf_sheet(x,tt,d0,980,150,780,{kick:"Drafted by the agent",title:"Room use, per hour",lines:["Booked hours, from the timetable","Used hours: the same as booked"]},{col:LP.violet,light:"late"});
      const hl=ag_in(tt,b0,0.4);if(sh&&hl>0.004){x.strokeStyle=rgba(LP.amber,hl);x.lineWidth=4;rr(x,1004,374,700,48,10);x.stroke();}
      tf_tag(x,tt,u0,null,1370,560,"Used: people actually in the room",{align:"center",col:LP.blue});
      tf_pill(x,tt,k0,null,1370,660,"Caught, but only just",{col:LP.amber});
      lp_person(x,"ivy",520,690,0.85,{t:tt,cut:806,light:lt});lp_table(x,260,812,740);lp_laptop(x,640,790,200,{glow:0.6});}},
    // the next morning, at stand-up, she says it out loud
    {at:c.standup-0.3,place:"tfMorning",cut:true,keys:[[c.standup-0.3,960,540,1.0]],draw:(x,tt)=>{
      tf_sheet(x,tt,c.standup-0.1,160,140,560,{kick:"The next morning",title:"Stand-up"},{light:"morning"});
      glossary(x,tt);standup(x,tt,1);
      // what each one says, its tail towards them: Ivy, Jun, Helena (at the row's end, so her words end at the frame's margin), then two more
      const say=(t0,t1,px,py,text,to,o)=>tf_say(x,px,py,text,to,Object.assign({align:"center"},o,{a:ag_io(tt,t0,t1,0.4)}));
      say(w("standup","out",-0.1),c.glossary-0.2,330,520,"“I nearly let it through.”",330);
      say(w("thanks","Jun",-0.1),c.more-0.3,610,450,"“Thank you.”",610,{col:LP.green});
      say(w("thanks","Helena",-0.1),c.more-0.3,1840,450,"“What would make it easier to catch?”",1710,{align:"right"});
      say(w("more","two",-0.1),c.name-0.4,890,520,"“A column I hadn't defined.”",890);
      say(w("more","missed",-0.3),c.name-0.4,1170,450,"“A check that never ran.”",1170);}},
    // psychological safety; the hospital teams; 51 work teams
    {at:c.name-0.3,place:"tfMorning",later:true,keys:[[c.name-0.3,960,540,1.0]],draw:(x,tt)=>{const t5=w("teams","teams",-0.4);
      tf_sheet(x,tt,c.name+0.1,300,140,1320,{kick:"Amy Edmondson, 1999",title:"Psychological safety",sub:"A shared belief that the team is safe for taking risks with each other, like admitting a mistake"},
        {light:"morning",u:1});
      tf_sheet(x,tt,w("nurses","nurses",-0.3),300,460,640,{kick:"In some hospital teams",lines:["Nurses talked openly about mistakes with medicines"]},{col:LP.green,light:"morning",out:t5-0.5});
      tf_sheet(x,tt,w("others","others",-0.3),980,460,640,{kick:"In others",lines:["People kept mistakes to themselves"]},{col:LP.amber,light:"morning",out:t5-0.5});
      const ca=ag_in(tt,t5,0.35);if(ca>0.004){x.save();x.globalAlpha*=ca;lp_sheet(x,300,460,1320,230,{light:"morning"});lp_T(x,"51 WORK TEAMS",336,540,{w:800,size:28,ls:3,col:LP.mut});
        tf_chain(x,336,620,[{text:"Felt safer"},{text:"Learned more"},{text:"Did better",pill:true,col:LP.green}],{u:clamp((tt-w("teams","safer",-0.3))/(w("teams","better",0)-w("teams","safer",-0.3)),0,1)});x.restore();}}},
    // said out loud, and thanked: the whole team learns from it
    {at:c.learn-0.3,place:"tfMorning",later:true,keys:[[c.learn-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_textSheet(x,1160,140,640,{kick:"Glossary",title:"Used hours",sub:"Hours with people actually in the room"},{col:LP.blue,light:"morning"});standup(x,tt,1);
      tf_pill(x,tt,w("learn","learns",-0.3),null,700,450,"The whole team learns from it",{col:LP.green});}}
  ]);
  tf_kick(ctx,S,1,0);
});

/* ---------------------------------------------------------------- 4. Nobody the only one */
scene("pairs",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  const four=[["sam",300,false],["noor",560,false],["jun",820,false],[TF_ERIN,1080,false]];
  const people=(x,tt)=>{for(const [who,px,fl] of four)lp_person(x,who,px,740,0.68,{t:tt,flip:fl,light:dy});};
  const runbook=(x,tt,t0)=>tf_runbook(x,410,140,{a:ag_in(tt,t0,0.35),k:tt-t0,light:"day",u:tf_u(tt,[t0+0.3,t0+1.0,t0+1.7,t0+2.4])});
  const i0=ag_shots(ctx,S,t,sc.dur,[
    // by June, twelve alerts a week, and every one needs someone
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const s0=0.4;
      if(tt>=s0){const a=ag_in(tt,s0,0.35);x.save();x.globalAlpha*=a;ag_about(x,650,450,lerp(0.6,1,ag_spr(tt-s0,0,0.5)));lp_sheet(x,300,150,700,600,{col:LP.amber,light:"day"});
        lp_T(x,"NIGHT ALERTS A WEEK",336,226,{w:800,size:28,ls:3,col:LP.amber});
        lp_bars(x,380,250,540,460,[{v:60,label:"February",show:"About 60"},{v:12,label:"June",show:"About 12"}],{max:66,col:LP.amber,u:ag_in(tt,w("june","twelve",-0.8),1.2)});x.restore();}
      tf_tag(x,tt,w("june","needs",-0.3),null,1400,420,"Every one needs someone",{align:"center",col:LP.amber});}},
    // the team pairs on the platform, one alert at a time, and writes down how
    {at:c.pair-0.3,place:"lpRoom",later:true,keys:[[c.pair-0.3,960,540,1.0]],draw:(x,tt)=>{const a0=w("pair","alert",-0.2),r0=w("runbook","runbook",-0.4);
      tf_sheet(x,tt,c.pair+0.1,150,140,580,{kick:"Through June",title:"Pairing on the platform"},{light:"day",out:r0-0.5});runbook(x,tt,r0);
      tf_who(x,tt,c.pair+0.1,null,"sam",560,690,0.8,{cut:806,light:dy});
      tf_who(x,tt,w("pair","Noor",-0.3),null,"noor",800,690,0.8,{cut:806,light:dy});
      tf_who(x,tt,w("pair","Jun",-0.3),null,"jun",1120,690,0.8,{flip:true,cut:806,light:dy});
      tf_who(x,tt,w("pair","Erin",-0.3),null,TF_ERIN,1360,690,0.8,{flip:true,cut:806,light:dy});
      lp_nameTag(x,1500,330,TF_ERIN,{a:ag_io(tt,w("pair","Erin",-0.1),r0-0.6,0.4)});
      lp_table(x,400,812,1120);lp_laptop(x,960,790,200,{glow:0.6});
      tf_pill(x,tt,a0,a0+1.6,960,620,"An alert",{col:LP.amber,size:28});tf_tick(x,tt,a0+1.7,960,620,1-ag_in(tt,r0+3.2,0.4));}},
    // four people can answer every night alert, not one; and from Monday 5 July, a rota
    {at:c.four-0.3,place:"lpRoom",later:true,keys:[[c.four-0.3,960,540,1.0]],draw:(x,tt)=>{const f0=w("four","four",-0.2),r0=w("rota","rota",-0.5);
      people(x,tt);four.forEach(([who,px],k)=>tf_tick(x,tt,f0+k*0.2,px,494));
      tf_pill(x,tt,w("four","night",-0.2),r0-0.6,1480,300,"Four can answer every night alert",{col:LP.green});
      tf_rota(x,1200,130,620,{kick:"The night rota",title:"One week in four",rows:[["Sam","from Monday 5 July"],["Noor","from Monday 12 July"],["Jun","from Monday 19 July"],["Erin","from Monday 26 July"]],
        a:ag_in(tt,r0,0.35),k:tt-r0,u:ag_in(tt,r0+0.3,1.6),light:"day"});}},
    // Sam had answered alone every night; now, three weeks in four, his phone stays quiet
    {at:c.quiet-0.3,place:"tfSam",cut:true,keys:[[c.quiet-0.3,960,540,1.0]],draw:(x,tt)=>{const q0=w("quiet","quiet",-0.4);
      lp_person(x,"sam",600,640,0.95,{t:tt,light:{light:"evening"}});
      tf_tag(x,tt,w("quiet","alone",-0.3),q0-0.4,1340,360,"Until July: every night, alone",{align:"center",col:LP.amber});
      tf_pill(x,tt,q0,null,1340,460,"Now three weeks in four are quiet",{col:LP.green});}},
    // two people for each job that matters most; and Tutu
    {at:c.two-0.3,place:"lpRoom",keys:[[c.two-0.3,960,540,1.0]],draw:(x,tt)=>{const tu=w("tutu","Desmond",-0.3);
      tf_sheet(x,tt,c.two+0.1,300,150,1320,{kick:"Two for each job that matters most",lines:["Night alerts: Sam, Noor, Jun and Erin","The platform: Sam and Erin","The models: Jun and Ivy","The map: Noor and Jun"]},
        {light:"day",out:tu-0.5,u:ag_in(tt,c.two+0.4,1.6)});
      tf_sheet(x,tt,tu,300,220,1320,{kick:"Desmond Tutu, 1999",title:"“A person with Ubuntu does not feel threatened that others are able and good”"},{light:"day"});}},
    // Sam taught three people his nights, and lost nothing by it
    {at:c.lost-0.3,place:"lpRoom",later:true,keys:[[c.lost-0.3,960,540,1.0]],draw:(x,tt)=>{const l0=w("lost","lost",-0.2);
      people(x,tt);four.forEach(([who,px],k)=>{if(k)tf_tick(x,tt,w("lost","taught",0)+k*0.2,px,494);});
      tf_pill(x,tt,l0,null,1480,300,"Sam lost nothing by it",{col:LP.green});}}
  ]);
  tf_kick(ctx,S,1,ag_io(t,c.quiet-0.3,c.two-0.3,0.5));
});

/* ---------------------------------------------------------------- 5. The rota holds */
scene("holds",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"},ev={light:"evening"};
  ag_shots(ctx,S,t,sc.dur,[
    // Sunday 1 August: his mother taken into hospital, and he calls Helena
    {at:0,place:"tfSam",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const k0=w("call","calls",-0.3);
      lp_person(x,"sam",600,640,0.95,Object.assign({t:tt,light:ev},tf_holds(tt,k0-0.3,tf_phone({lit:1,call:ag_in(tt,k0+0.3,0.4)}))));tf_glow(x,700,560,320,0.8*ag_in(tt,k0-0.3,0.5));
      tf_sheet(x,tt,w("call","August",-0.3),1080,150,660,{kick:"Sunday 1 August",title:"His mother is taken into hospital"},{col:LP.amber,light:"evening"});
      tf_tag(x,tt,k0,null,1410,470,"He calls Helena",{align:"center",col:LP.ink});}},
    // she tells him to go, and to switch his phone off
    {at:c.go-0.3,place:"tfHelena",keys:[[c.go-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"helena",1250,640,0.95,{t:tt,flip:true,light:ev,pose:"hold",holdBack:tf_phone({lit:1,call:1})});tf_glow(x,1150,560,320,0.8);
      tf_tag(x,tt,w("go","go",-0.2),null,600,420,"“Go, and switch your phone off.”",{align:"center",col:LP.ink});}},
    // his week on the rota: Jun and Erin take it; Helena moves his other work, and tells the people who asked
    {at:c.week-0.3,place:"lpRoom",keys:[[c.week-0.3,960,540,1.0]],draw:(x,tt)=>{const j0=w("week","Jun",-0.2),m0=w("work","moves",-0.3);
      tf_rota(x,180,140,700,{kick:"The night rota",title:"This week",rows:[["Sam","2 to 8 August"],["Noor","9 to 15 August"]],cover:{i:0,u:clamp((tt-j0)/1.2,0,1),text:"Jun and Erin"},hi:0,
        a:ag_in(tt,c.week-0.1,0.35),k:tt-c.week+0.1,light:"day"});
      tf_who(x,tt,j0-0.3,null,"jun",1180,735,0.7,{light:dy});tf_who(x,tt,j0,null,TF_ERIN,1460,735,0.7,{flip:true,light:dy});
      tf_sheet(x,tt,m0,1060,120,720,{kick:"Moved by Helena",title:"The platform's upgrade",lines:["Two weeks later: Wednesday 25 August","The people who asked are told"]},
        {col:LP.blue,light:"day",u:tf_u(tt,[w("work","waits",-0.2),w("work","tells",-0.2)])});
      tf_tick(x,tt,w("work","date",-0.1),1740,388);}},
    // twice that fortnight an alert comes in the night, and both are answered from the runbooks
    {at:c.alerts-0.3,place:"tfDark",later:true,keys:[[c.alerts-0.3,960,540,1.0]],draw:(x,tt)=>{const a1=w("alerts","alert",-0.3),b0=w("alerts","answered",-0.3);
      tf_runbook(x,150,140,{light:"evening",a:ag_in(tt,c.alerts,0.4)});
      tf_pill(x,tt,a1,b0,1320,480,"Tuesday night: an alert",{col:LP.amber});tf_pill(x,tt,a1+0.6,b0+0.4,1320,580,"Thursday night: an alert",{col:LP.amber});
      tf_pill(x,tt,b0+0.4,null,1320,480,"Jun: answered from the runbook",{col:LP.green,icon:"tick"});tf_pill(x,tt,b0+0.9,null,1320,580,"Erin: answered from the runbook",{col:LP.green,icon:"tick"});}},
    // nobody calls him
    {at:c.nobody-0.3,place:"tfSam",keys:[[c.nobody-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{lp_table(x,700,812,520);
      // his phone on the table, switched off, face down
      x.save();x.fillStyle="rgba(40,30,30,0.3)";x.beginPath();x.ellipse(950,800,96,12,0,0,TAU);x.fill();const g=x.createLinearGradient(880,0,1040,0);g.addColorStop(0,"rgb(46,46,50)");g.addColorStop(1,"rgb(96,96,102)");x.fillStyle=g;
      x.beginPath();x.moveTo(892,778);x.lineTo(1024,778);x.lineTo(1040,796);x.lineTo(876,796);x.closePath();x.fill();x.fillStyle="rgba(255,240,220,0.25)";x.fillRect(900,780,116,2);x.restore();}},
    // Monday 16 August: her first question is about his mother
    {at:c.back-0.3,place:"tfMorning",keys:[[c.back-0.3,960,540,1.0]],draw:(x,tt)=>{const q0=w("back","question",-0.3);
      tf_sheet(x,tt,c.back+0.1,150,140,560,{kick:"Monday 16 August",title:"Sam is back"},{light:"morning"});
      tf_who(x,tt,c.back+0.2,null,"sam",lerp(560,700,ag_sine(ag_in(tt,c.back+0.2,1.4))),650,0.9,{light:{light:"morning"}});
      lp_person(x,"helena",1250,650,0.9,{t:tt,flip:true,light:{light:"morning"}});
      tf_tag(x,tt,q0,null,1250,330,"“How is your mother?”",{align:"center",col:LP.ink});}},
    // like a stokvel carrying a member, the team carried Sam, because everyone had paid in
    {at:c.paid-0.3,place:"tfMorning",later:true,keys:[[c.paid-0.3,960,540,1.0]],draw:(x,tt)=>{const s0=w("paid","stokvel",-0.4),k0=w("paid","carried",-0.4),p0=w("paid","paid",-0.3);
      const sa=ag_in(tt,s0,0.35);if(sa>0.004){x.save();x.globalAlpha*=sa;lp_sheet(x,150,130,780,640,{light:"morning"});lp_T(x,"A STOKVEL",186,210,{w:800,size:28,ls:3,col:LP.mut});
        tf_ring(x,540,470,160,{n:8,pot:1,fill:0.6,hard:{i:5,u:1},carry:{i:5,u:clamp((tt-s0-0.4)/1.4,0,1)}});x.restore();}
      const ta=ag_in(tt,k0-0.4,0.35);if(ta>0.004){x.save();x.globalAlpha*=ta;lp_sheet(x,990,130,780,640,{light:"morning"});lp_T(x,"HELENA'S TEAM",1026,210,{w:800,size:28,ls:3,col:LP.mut});
        tf_ring(x,1380,480,160,{n:8,work:1,names:["Sam"],hard:{i:0,u:1},carry:{i:0,u:clamp((tt-k0)/1.4,0,1)}});x.restore();}
      tf_pill(x,tt,p0,null,960,830,"Everyone had paid in",{col:LP.green});}}
  ]);
  tf_kick(ctx,S,1,Math.max(ag_io(t,-1,c.week-0.3,0.5),ag_io(t,c.alerts-0.3,c.back-0.3,0.5)));
});

/* ---------------------------------------------------------------- 6. Each person, every week */
scene("each",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"},gr={light:"grey"};
  ag_shots(ctx,S,t,sc.dur,[
    // the one-to-ones go on: in September, Jun says he's fine
    {at:0,place:"tfLate",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const j0=w("jun","September",-0.3),m0=w("moves","moves",-0.3);
      tf_sheet(x,tt,0.3,150,140,600,{kick:"Every week",title:"The one-to-ones go on"},{light:"late",out:j0-0.5});
      tf_sheet(x,tt,j0,150,140,600,{kick:"September",title:"Jun says he's fine"},{light:"late",out:m0-0.5});
      tf_sheet(x,tt,m0,150,140,600,{kick:"Moved to November",lines:["One of his projects","Told the people who asked"]},{col:LP.blue,light:"late",u:tf_u(tt,[m0+0.3,w("moves","tells",-0.2)])});
      tf_sheet(x,tt,w("jun","teaching",-0.4),1300,120,560,{kick:"Jun's load",lines:["Teaching two people","Building models","His turn on the rota"]},
        {col:LP.amber,light:"late",u:tf_u(tt,[w("jun","teaching",-0.2),w("jun","building",-0.2),w("jun","rota",-0.3)])});
      tf_tag(x,tt,w("jun","fine",-0.2),m0,800,400,"“I'm fine.”",{align:"center",col:LP.ink});
      lp_person(x,"jun",800,690,0.8,{t:tt,cut:806,light:lt});lp_person(x,"helena",1150,690,0.8,{t:tt,flip:true,cut:806,light:lt});lp_table(x,620,812,720);}},
    // the quarterly review in October: the credit to the team, by name; what slipped, hers to answer for
    {at:c.review-0.3,place:"tfReview",cut:true,keys:[[c.review-0.3,960,540,1.0]],draw:(x,tt)=>{const r0=w("review","credit",-0.4),n0=w("review","name",-0.2),s0=w("review","slipped",-0.6),o0=c.order;
      lp_screen(x,200,150,900,500,{draw:(cx,X,Y,Wd,Hd)=>{lp_T(cx,"QUARTERLY REVIEW · OCTOBER",X+44,Y+70,{w:800,size:28,ls:3,col:LP.mut});
        cx.save();cx.globalAlpha*=ag_in(tt,r0,0.4);cx.fillStyle=rgba(LP.green,1);cx.fillRect(X+44,Y+108,8,120);lp_T(cx,"The credit: the team",X+72,Y+142,{w:800,size:36});
        lp_T(cx,"Noor · Sam · Jun · Yusuf · Marta · Erin · Tomás · Ivy",X+72,Y+196,{w:600,size:28,a:ag_in(tt,n0,0.5)});cx.restore();
        cx.save();cx.globalAlpha*=ag_in(tt,s0,0.4);cx.fillStyle=rgba(LP.amber,1);cx.fillRect(X+44,Y+272,8,120);lp_T(cx,"What slipped",X+72,Y+306,{w:800,size:36});
        lp_T(cx,"Helena answers for it",X+72,Y+360,{w:600,size:28});cx.restore();}});
      [["1  The team",0],["2  Each person",1],["3  Herself",2]].forEach(([s,k])=>tf_pill(x,tt,w("order",["team","each","herself"][k],-0.2),null,1250,300+k*96,s,{col:LP.ink}));
      lp_person(x,"helena",1560,650,0.9,{t:tt,flip:true,light:gr});}},
    // Ubuntu written down as an ethic: Ramose and Metz
    {at:c.ethic-0.3,place:"lpRoom",keys:[[c.ethic-0.3,960,540,1.0]],draw:(x,tt)=>{
      tf_sheet(x,tt,c.ethic+0.1,300,170,1320,{kick:"Ubuntu as an ethic",title:"Mogobe Ramose · Thaddeus Metz",lines:["Sharing a life with others","Caring how their lives go"]},
        {light:"day",u:tf_u(tt,[w("metz","sharing",-0.2),w("metz","caring",-0.2)])});}},
    // the team shares the work, and cares how each of them is doing
    {at:c.cares-0.3,place:"lpRoom",later:true,keys:[[c.cares-0.3,960,540,1.0]],draw:(x,tt)=>{
      for(const [who,px,fl] of [["helena",300,false],["noor",540,false],["sam",780,false],["jun",1140,true],["ivy",1380,true],[TF_ERIN,1620,true]])lp_person(x,who,px,690,0.66,{t:tt,flip:fl,cut:806,light:{light:"day"}});
      lp_table(x,160,812,1600);lp_laptop(x,960,790,180,{glow:0.4});}}
  ]);
  tf_kick(ctx,S,1,0);
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back to the stokvel: a print of its room on the team's wall; then Helena's team did the same
    {at:0,place:"tfMorning",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const t0=c.team-0.3;
      tf_print(x,560,130,800,{a:ag_in(tt,0.3,0.6),light:"morning"});
      tf_tag(x,tt,w("back","pays",-0.2),t0,520,646,"Everyone pays in",{align:"center"});
      tf_tag(x,tt,w("back","turn",-0.2),t0,890,646,"Everyone's turn comes",{align:"center"});
      tf_tag(x,tt,w("back","carries",-0.3),t0,1260,646,"The group carries her",{align:"center",col:LP.green});
      tf_sheet(x,tt,w("team","Helena's",-0.1),420,630,880,{kick:"Helena's team did the same",lines:["Four people learned the nights","When Sam had to go, nobody called him"]},
        {col:LP.green,light:"morning",u:tf_u(tt,[w("team","four",-0.2),w("team","nobody",-0.3)])});
      lp_person(x,"helena",1640,650,0.9,{t:tt,flip:true,light:mo,a:ag_in(tt,0.6,0.8)});}},
    // on Monday
    {at:c.pair-0.3,place:"tfMorning",later:true,keys:[[c.pair-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.5,0.5);
      if(g>0.004){x.save();x.globalAlpha*=g;
        tf_sheet(x,tt,c.pair+0.1,120,150,540,{kick:"One",title:"Pair until two can do each job that matters most, and write it down"},{col:LP.blue,light:"morning"});
        tf_sheet(x,tt,w("leave","Protect",-0.1),690,150,540,{kick:"Two",title:"Protect leave: when someone is away, nobody calls them"},{light:"morning"});
        tf_sheet(x,tt,w("thank","Thank",-0.1),1260,150,540,{kick:"Three",title:"Thank the person who says: I got it wrong"},{light:"morning"});
        tf_sheet(x,tt,w("ask","ask",-0.1),405,500,540,{kick:"Four",title:"In one-to-ones, ask how people are, not only what they did"},{light:"morning"});
        tf_sheet(x,tt,w("new","new",-0.1),975,500,540,{kick:"Five",title:"New? Watch first: the team's shared work before anyone's own"},{col:LP.blue,light:"morning"});x.restore();}
      // the team's ring, whole: nobody alone
      const r0=c.take-0.1,ra=ag_in(tt,r0,0.4)*(1-ag_in(tt,e0,0.8));if(ra>0.004){x.save();x.globalAlpha*=ra;ag_about(x,960,480,lerp(0.6,1,ag_spr(tt-r0,0,0.5)));
        lp_sheet(x,560,140,800,680,{light:"morning"});lp_T(x,"THE TEAM",596,220,{w:800,size:28,ls:3,col:LP.mut});
        tf_ring(x,960,490,190,{n:8,work:1,hold:ag_in(tt,w("take","alone",-0.2),1.4)});x.restore();}}}
  ]);
  lp_end(ctx,S,t,e0,"The team comes first",TF_LAST,"Film 3 of 4","Leading a data team");
  tf_kick(ctx,S,1-ag_in(t,e0,0.8),0);
});
ag_cutInto(["holds"]);
