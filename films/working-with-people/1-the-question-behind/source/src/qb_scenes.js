/* ===== The question behind the request: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves, or cuts where both show the same words or people.
   Sizes in the 1920 x 1080 frame. */

const QB_LAST="Ask what it's for, and agree it in writing.";
// the film's number and title at the top left, from the second chapter on
function qb_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"1","The question behind the request",{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function qb_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const qb_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function qb_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 and goes at t1 (null: stays)
function qb_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// a figure sheet (one big number) that springs in at t0
function qb_fig(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return;lp_figure(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// a green tick in a disc, springing in from t0
function qb_tick(ctx,t,t0,x,y){if(t<t0)return;const f=lerp(0.6,1,ag_spr(t-t0,0,0.5));ctx.save();ctx.globalAlpha*=ag_in(t,t0,0.3);ctx.fillStyle=rgba(LP.green,1);
  ctx.beginPath();ctx.arc(x,y,22*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",x,y,30*f,[255,255,255]);ctx.restore();}
// the tower in the piazza, with its shadow; lean in degrees
function qb_piazza(x,lean,a){qb_shadow(x,QB_BASE[0],QB_BASE[1],QB_PK,a==null?1:a);qb_tower(x,QB_BASE[0],QB_BASE[1],QB_PK,lean,{a});}
// a rope across the stone ring's front, on posts: the tower closed (o.a)
function qb_rope(x,a){if(a<=0.004)return;const [bx,gy]=QB_BASE;x.save();x.globalAlpha*=a;const P=[[bx-200,gy+30],[bx-100,gy+44],[bx,gy+48],[bx+100,gy+44],[bx+200,gy+30]];
  x.strokeStyle="rgb(150,40,36)";x.lineWidth=3;x.beginPath();for(let i=0;i<P.length-1;i++){const [x0,y0]=P[i],[x1,y1]=P[i+1];x.moveTo(x0,y0-30);x.quadraticCurveTo((x0+x1)/2,(y0+y1)/2-18,x1,y1-30);}x.stroke();
  for(const [px,py] of P){x.fillStyle="rgb(70,62,58)";x.fillRect(px-3,py-36,6,36);x.beginPath();x.arc(px,py-37,5,0,TAU);x.fill();}x.restore();}

/* ---------------------------------------------------------------- 1. Saving a leaning tower: Pisa, 1990 to 2001 */
scene("tower",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),out={light:null,pin:false};
  // the lean: as it was until the soil came out from under the north side, then back by about half a degree, a little at a time
  const s0=w("soil","tower",0),s1=c.less+0.6,lean=tt=>lerp(QB_LEAN0,QB_LEAN1,ag_sine((tt-s0)/(s1-s0)));
  const cutA=tt=>ag_in(tt,w("risk","ground",-0.2),0.8)*(1-ag_in(tt,c.reopen-0.2,0.8));
  const gr=tt=>({a:cutA(tt),lean:lean(tt),t:tt,risk:ag_in(tt,w("risk","leaning",-0.2),0.8)*(1-ag_in(tt,c.change+0.6,0.8)),
    drills:ag_in(tt,w("method","draw",-0.1),2.4),lead:ag_in(tt,w("trial","lead",-0.1),1.4),soil:ag_in(tt,w("method","soil",0),0.8)*(1-ag_in(tt,c.reopen-0.4,0.6))*(tt<w("trial","They",-0.2)||tt>s0-0.4?1:0.25)});
  ag_shots(ctx,S,t,sc.dur,[
    // the tower in its piazza, leaning; Pavia; closed; the danger in its stone and in the ground under it
    {at:0,place:"qbPiazza",push:0.02,keys:[[0,960,540,1.0],[c.closed-0.2,960,600,1.32],[w("risk","ground",-0.4),960,690,1.45],[c.change-0.2,960,540,1.0]],d:1.8,draw:(x,tt)=>{
      qb_piazza(x,lean(tt));qb_ground(x,gr(tt));
      qb_sheet(x,tt,w("when","Pisa",-0.1),120,140,560,{kick:"Pisa, Italy",title:"The bell tower",sub:"Begun in 1173, and leaning since it was being built"},Object.assign({out:c.pavia-0.5},out));
      // the overhang: a plumb line from the foot's edge, and the top hanging out past it
      const ov=ag_io(tt,w("lean","hangs",-0.2),c.pavia-0.4,0.5);if(ov>0.004){const tp=qb_top(QB_BASE[0],QB_BASE[1],QB_PK,lean(tt)),px=QB_BASE[0]+QB_TW.R*QB_PK;x.save();x.globalAlpha*=ov;x.setLineDash([10,8]);x.strokeStyle=rgba(LP.amber,1);x.lineWidth=3;
        x.beginPath();x.moveTo(px,QB_BASE[1]);x.lineTo(px,tp[1]-10);x.stroke();x.setLineDash([]);x.lineWidth=4;x.beginPath();x.moveTo(px,tp[1]+40);x.lineTo(px+QB_TW.R*QB_PK*0.15+58,tp[1]+40);x.stroke();x.restore();
        lp_tag(x,px+90,tp[1]+108,"About 4.5 m out past its base",{col:LP.amber,a:ov});}
      qb_tag(x,tt,w("lean","each",-0.1),c.pavia-0.4,1420,560,"Leaning further every year",{align:"center",col:LP.amber});
      qb_sheet(x,tt,c.pavia+0.3,1240,140,580,{kick:"Pavia · 17 March 1989",title:"A medieval tower collapses",lines:["Four people die"]},Object.assign({col:LP.amber,out:c.closed-0.5},out));
      qb_rope(x,ag_in(tt,w("closed","closed",-0.1),0.6));
      qb_pill(x,tt,Math.max(c.closed+1.7,w("closed","closed",-0.1)),c.risk-0.2,960,800,"Closed to visitors · 7 January 1990",{col:LP.amber});
      qb_tag(x,tt,w("harm","fragile",-0.1),c.risk-0.2,1220,610,"Fragile stone",{align:"left",col:LP.amber});
      qb_tag(x,tt,w("harm","world",-0.2),c.risk-0.2,700,610,"Visitors from across the world",{align:"right",col:LP.ink});
      const gr0=Math.max(w("risk","slightest",-0.1),w("risk","ground",-0.4)+1.5);qb_tag(x,tt,gr0,c.change-0.2,1150,846,"Disturb this ground, and it could fall",{align:"center",col:LP.amber});
      qb_tag(x,tt,w("risk","ground",-0.4)+1.0,c.change-0.2,690,846,"Soft ground",{align:"center",col:LP.ink});
      qb_pill(x,tt,w("change","without",-0.2),null,960,96,"Make it safe, without the work toppling it",{col:LP.amber});}},
    // the committee, that spring
    {at:c.committee-0.3,place:"qbCommittee",keys:[[c.committee-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const mo={light:"morning"},cut=836;
      for(const [ci,px,fl] of [[4,800,false],[2,1160,true],[5,1500,true]])lp_person(x,lp_crowd(ci),px,730,0.75,{t:tt+px*0.001,flip:fl,cut,light:mo});lp_table(x,600,842,1100);
      qb_sheet(x,tt,c.committee+0.2,120,130,560,{kick:"Appointed by Italy's government",title:"An international committee",lines:["Engineers","Architects","Experts in old monuments"]},
        {light:"morning",u:qb_u(tt,[w("committee","engineers",-0.1),w("committee","architects",-0.1),w("committee","experts",-0.1)])});
      // the tower's picture, pinned up for them
      const pa=ag_in(tt,c.committee+0.6,0.4);if(pa>0.004){lp_sheet(x,1290,120,440,330,{light:"morning",a:pa});x.save();x.globalAlpha*=pa;x.beginPath();x.rect(1306,170,408,268);x.clip();
        x.fillStyle="rgb(214,224,232)";x.fillRect(1306,170,408,268);x.fillStyle=rgba(QB_LAWN,1);x.fillRect(1306,400,408,38);qb_tower(x,1500,404,4.0,QB_LEAN0,{ring:[60,7]});x.restore();}}},
    // what saving it would mean; then the ground cut open, the method, the trial and the lead; the soil drawn out; the daily note
    {at:c.meant-0.3,place:"qbPiazza",push:0.02,keys:[[c.meant-0.3,960,540,1.0],[c.method-0.2,960,690,1.45],[c.note-0.9,960,540,1.0]],dis:1.0,d:1.8,draw:(x,tt)=>{
      qb_piazza(x,lean(tt));qb_ground(x,gr(tt));
      qb_axis(x,{a:ag_in(tt,w("meant","half",-0.2),0.6)*(1-ag_in(tt,c.method-0.4,0.5)),target:ag_in(tt,w("meant","half",0.3),0.8)});
      qb_sheet(x,tt,w("meant","saving",-0.2),1180,150,620,{kick:"What saving it would mean",title:"About half a degree",lines:["Too little for anyone to see","Less strain on the stone","Steadier ground under it"]},
        Object.assign({col:LP.blue,out:c.method-0.5,u:qb_u(tt,[w("meant","see",-0.2),w("enough","strain",-0.1),w("enough","steady",-0.1)])},out));
      qb_footing(x,610,QB_BASE[1],{a:ag_in(tt,w("trial","test",-0.1),0.6)*(1-ag_in(tt,c.soil-0.2,0.6)),drills:ag_in(tt,w("trial","test",0.2),1.2),turn:ag_in(tt,w("trial","footing",0.2),1.6)});
      qb_tag(x,tt,w("trial","test",0.1),c.soil-0.3,640,800,"A test footing",{align:"center",col:LP.ink});
      qb_tag(x,tt,w("trial","lead",0),c.note-0.4,820,600,"Lead on the north side",{align:"right",col:LP.ink});
      qb_tag(x,tt,w("method","north",-0.1),c.note-0.4,560,700,"North",{align:"left",col:LP.mut});qb_tag(x,tt,w("method","north",-0.1),c.note-0.4,1360,700,"South",{align:"right",col:LP.mut});
      qb_tag(x,tt,Math.max(w("method","soil",0.1),c.method+1.6),c.trial-0.3,1140,846,"A little soil out, from under the high side",{align:"center",col:LP.blue});
      qb_pill(x,tt,w("soil","February",-0.1),c.note-0.4,1150,846,"From February 1999, under the tower",{col:LP.blue});
      if(tt>c.note+1.0)qb_note(x,1260,150,560,{a:ag_in(tt,c.note+1.0,0.35)*(1-ag_in(tt,c.less-0.5,0.4)),k:tt-c.note-1.0,u:qb_u(tt,[w("note","moved",-0.2),w("note","exactly",-0.2)]),sign:ag_in(tt,w("note","signed",0.1),1.0),light:null,pin:false});}},
    // the lean back by about 45 cm at the top (446 mm by July 2001, Jamiolkowski 2001); reopened, still leaning; two hundred years at least
    {at:c.less-0.3,place:"qbPiazza",push:0.02,keys:[[c.less-0.3,960,540,1.0]],draw:(x,tt)=>{
      qb_piazza(x,lean(tt));qb_ground(x,gr(tt));
      qb_axis(x,{a:ag_in(tt,w("less","top",-0.2),0.6)*(1-ag_in(tt,c.reopen-0.2,0.6)),target:1});
      qb_fig(x,tt,w("less","forty",-0.3),120,140,560,{kick:"Back at the top, by 2001",num:"45 cm",label:"The lean of the early 1800s"},Object.assign({col:LP.green,out:c.years+1.6},out));
      qb_visitors(x,tt,{t0:w("reopen","visitors",-0.3)});
      qb_pill(x,tt,w("reopen","reopened",-0.1),null,1440,240,"Reopened · 15 December 2001",{col:LP.green,icon:"tick"});
      qb_tag(x,tt,w("years","two",-0.2),null,1440,330,"At least 200 years before it leans as far again",{align:"center",col:LP.ink});}},
    // the university: a request for a dashboard, and the building behind it
    {at:c.data-0.3,place:"lpSky",keys:[[c.data-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      qb_building(x,{sc:0.6,ox:120,lit:{"G.01":1,"1.02":1,"2.01":1,"3.02":1,"1.04":1},used:{"G.01":1,"1.02":1,"3.02":1,"1.04":1}});
      qb_sheet(x,tt,w("data","request",-0.2),1140,150,660,{kick:"The request",title:"“A dashboard of room use, by Easter”"},{light:null,pin:false});
      qb_sheet(x,tt,w("data","decision",-0.2),1140,430,660,{kick:"The decision behind it",title:"A new teaching building?",lines:["About A$140 million"]},{col:LP.amber,light:null,pin:false});}},
    // the one page: his words, and the question behind them, agreed in writing
    {at:c.found-0.3,place:"lpRoom",cut:true,keys:[[c.found-0.3,960,540,1.0]],draw:(x,tt)=>{const p0=c.found+0.4;
      const go=1-ag_in(tt,c.breath+0.1,0.5);if(go<=0.004)return;x.save();x.globalAlpha*=go;
      if(tt>=p0)qb_page(x,460,200,1000,{compact:true,a:ag_in(tt,p0,0.35),k:tt-p0,words:1,q:ag_in(tt,w("found","page",-0.2),0.8),light:"day"});
      qb_pill(x,tt,w("found","writing",-0.1),null,960,720,"Agreed in writing",{col:LP.green,icon:"tick"});x.restore();}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,c.data,c.breath,0.5)});
  lp_title(ctx,S,t,c.breath+0.2,"The question behind the request","Find the decision behind it, and agree it in writing","Leading data people · Working with people");
});

/* ---------------------------------------------------------------- 2. A dashboard by Easter */
scene("ask",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),gy={light:"grey"},dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    // the series: three things that go right or wrong with the people who ask for data
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      [["1","Find the question behind a request",LP.blue],["2","Explain so people can decide",null],["3","Say no, and say what instead",null]].forEach(([n,s,col],i)=>
        qb_sheet(x,tt,0.8+i*0.4,180+i*540,280,480,{kick:n,title:s},{col,light:"day"}));}},
    // Graham's email, in his third week
    {at:c.email-0.3,place:"qbGraham",keys:[[c.email-0.3,960,540,1.0]],draw:(x,tt)=>{const e0=c.email+0.6,d0=w("nobody","exactly",-0.2),sw=ag_in(tt,d0,0.4),dw=ag_in(tt,d0+0.5,0.4);
      lp_person(x,"graham",420,700,0.85,{t:tt,cut:794,light:gy});lp_table(x,140,800,680);lp_laptop(x,690,768,200,{glow:0.5});
      lp_nameTag(x,96,230,"graham",{role:"Director of Facilities, new this year",a:ag_in(tt,w("email","Graham",-0.1),0.5)});
      if(tt>=e0)qb_screen(x,860,150,900,440,[[qb_emailIn,1-sw,{hl:ag_in(tt,c.asks,1.2)}],[qb_dashIn,dw,{u:ag_in(tt,d0+0.6,1.4),grey:ag_in(tt,w("nobody","nobody",-0.2),0.8)}]],{a:ag_in(tt,e0,0.5)});
      qb_tag(x,tt,w("clear","thing",-0.1),c.guess-0.4,1080,690,"A thing: a dashboard",{align:"center",col:LP.ink});
      qb_tag(x,tt,w("clear","date",-0.1),c.guess-0.4,1520,690,"A date: Easter",{align:"center",col:LP.ink});
      qb_tag(x,tt,w("guess","guess",-0.1),d0-0.4,1100,690,"A guess at a solution",{align:"center",col:LP.amber});
      qb_tag(x,tt,w("guess","for",-0.1),d0-0.4,1560,690,"What is it for?",{align:"center",col:LP.blue});
      qb_tag(x,tt,w("nobody","time",-0.1),null,1310,690,"On time, and no help to anyone",{align:"center",col:LP.amber});}},
    // Helena asks for half an hour (on the right, so she never shows through Graham as one fades into the other)
    {at:c.helena-0.3,place:"lpRoom",keys:[[c.helena-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"helena",1480,700,0.95,{t:tt,flip:true,light:dy});
      lp_nameTag(x,1824,230,"helena",{align:"right",a:ag_in(tt,w("helena","Helena",-0.1),0.5)});
      qb_sheet(x,tt,w("helena","asks",-0.1),300,200,700,{kick:"Asked for",title:"Half an hour with Graham",lines:["Helena, and Noor Rahman, the data architect"]},{col:LP.blue,light:"day",u:ag_in(tt,w("helena","Noor",-0.1),0.5)});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,c.email,c.helena,0.5)});
  qb_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. Half an hour, mostly listening
   Graham on the left, Helena and Noor on the right, at his table; what each question finds goes up on a sheet between them, one at a
   time (each leaves before the next comes in). */
const QB_MEET={graham:[400,false],helena:[1330,true],noor:[1640,true]};
function qb_meeting(x,tt,o){o=o||{};const gy={light:"grey"},cut=836;for(const [who,[px,fl]] of Object.entries(QB_MEET)){const a=o[who]==null?1:o[who];if(a<=0.004)continue;
    lp_person(x,who,px,730,0.75,{t:tt+px*0.001,flip:fl,cut,a,light:gy,nod:o.nod&&who!=="graham"?o.nod:0});}
  lp_table(x,160,842,1600);}
scene("listen",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),gy={light:"grey"};
  const Q=[["decide","What will you decide with it?",["Whether to ask the University Council for a new teaching building","40 rooms, about A$140 million"],LP.blue,["University","forty"]],
    ["when","By when?",["His paper: Tuesday 1 June","The University Council decides: Thursday 24 June","Easter was a guess at a safe date"],null,["paper","decides","Easter"]],
    ["who","Who else decides?",["The University Council, on his advice","Academics: “the rooms are always full”"],null,["Council","academics"]],
    ["trust","What do you already trust?",["What he has seen on his walks","Empty corridors on Monday mornings and Friday afternoons"],null,["walks","corridors"]],
    ["mind","What would change your mind?",["Short at every hour: ask to build","Short only at some hours: perhaps not"],null,["every","some"]]];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"qbGraham",keys:[[0,960,540,1.0]],push:0.015,draw:(x,tt)=>{const l0=w("meet","listen",-0.3),nod=0.03*Math.sin(tt*1.7)*ag_in(tt,l0,1.0);
      qb_meeting(x,tt,{nod});
      const na=ag_io(tt,0.6,c.decide-0.4,0.5);lp_nameTag(x,96,230,"graham",{a:na});lp_nameTag(x,1824,230,"helena",{align:"right",a:na});lp_nameTag(x,1824,330,"noor",{align:"right",a:na});
      qb_sheet(x,tt,0.9,560,140,620,{kick:"Tuesday 16 February",title:"Thirty minutes",sub:"A few open questions, then mostly listening"},{light:"grey",out:c.decide-0.5});
      Q.forEach(([id,q,lines,col,ws],i)=>{const nx=i+1<Q.length?c[Q[i+1][0]]-0.5:c.schein-0.5;
        qb_sheet(x,tt,c[id]-0.05,560,140,620,{kick:"Ask",title:q,lines},{col,light:"grey",out:nx,u:qb_u(tt,ws.map(wd=>w(id,wd,-0.2)))});});
      // the practice, named once each, on sheets wide enough for the longer line of names
      qb_sheet(x,tt,w("schein","Schein",-0.3),480,140,780,{kick:"Edgar Schein, 2013",title:"Humble Inquiry",lines:["Ask what you don't already know","Out of real interest in the other person"]},
        {light:"grey",out:c.rogers-0.5,u:qb_u(tt,[w("schein","asking",-0.1),w("schein","interest",-0.2)])});
      qb_sheet(x,tt,w("rogers","Rogers",-0.3),480,140,780,{kick:"Carl Rogers and Richard Farson, 1957",title:"Active Listening",lines:["Hear the whole meaning","Then say it back"]},
        {light:"grey",out:c.whys-0.5,u:qb_u(tt,[w("rogers","hearing",-0.1),w("rogers","saying",-0.1)])});
      // why, five times; then the kinder question
      const wy=w("whys","five",-0.4);qb_whys(x,tt,wy,540,250,{a:1-ag_in(tt,w("whys","what",-0.3),0.5)});
      qb_tag(x,tt,w("whys","what",0),null,960,250,"What will you decide with it?",{align:"center",col:LP.blue});}}
  ]);
  qb_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Say it back, write it down */
scene("agree",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),gy={light:"grey"};
  ag_shots(ctx,S,t,sc.dur,[
    // near the end of the half hour: what Helena heard, and the one word Graham stops her at
    {at:0,place:"qbGraham",keys:[[0,960,540,1.0]],push:0.015,draw:(x,tt)=>{
      qb_meeting(x,tt);
      const bw={kick:"What Helena heard",lines:["A decision: whether to ask for a building","A question: how the rooms are used"]},b0=c.back+0.4,bo=c.data-0.5;
      const bb=qb_sheet(x,tt,b0,460,140,640,bw,{light:"grey",out:bo,u:qb_u(tt,[w("back","decision",-0.1),w("back","question",-0.1)])});
      // "used", underlined in amber where Graham stops her
      const ua=ag_in(tt,w("used","stops",-0.1),0.4)*(1-ag_in(tt,bo,0.4));if(bb&&ua>0.004){const pre="A question: how the rooms are ",ux=bb.x+LP_PAD+34+lp_tw(x,pre,{w:600,size:28}),uw=lp_tw(x,"used",{w:600,size:28}),uy=bb.y+LP_PAD+30+44+38+12+38+10;
        x.save();x.strokeStyle=rgba(LP.amber,1);x.lineWidth=5;x.lineCap="round";x.globalAlpha*=ua;x.beginPath();x.moveTo(ux,uy);x.lineTo(ux+uw*ag_sine(ag_in(tt,w("used","stops",0),0.5)),uy);x.stroke();x.restore();}
      qb_sheet(x,tt,w("used","means",-0.3),1140,140,640,{kick:"Graham",title:"“Used” means people in the room",sub:"A booking isn't use"},{light:"grey",out:bo});
      // the two kinds of data the word decides, side by side
      qb_sheet(x,tt,w("data","bookings",-0.2),400,140,540,{kick:"From the timetable",title:"Bookings"},{col:LP.orange,light:"grey",out:c.pisa-0.5});
      qb_sheet(x,tt,w("data","head",-0.2),980,140,540,{kick:"From each room's sensor",title:"Head counts"},{col:LP.orange,light:"grey",out:c.pisa-0.5});
      // back to Pisa along the way: one word of each request, made exact before anyone chose how
      qb_sheet(x,tt,w("pisa","Pisa",-0.1),350,140,600,{kick:"In Pisa",title:"Saving",lines:["Half a degree, not a straight tower"]},{col:LP.blue,light:"grey",out:c.write-0.6});
      qb_sheet(x,tt,w("pisa","Here",-0.2),970,140,600,{kick:"Here",title:"Use",lines:["People in the room, not bookings"]},{col:LP.blue,light:"grey",out:c.write-0.6});}},
    // Noor and Graham write the question down on one page, his words at the top
    {at:c.write-0.3,place:"qbGraham",later:true,keys:[[c.write-0.3,960,540,1.0]],draw:(x,tt)=>{const p0=c.write+0.5,cut=836;
      lp_person(x,"graham",1330,730,0.75,{t:tt,flip:true,cut,light:gy});lp_person(x,"noor",1640,730,0.75,{t:tt+0.7,flip:true,cut,light:gy});lp_table(x,1080,842,780);
      if(tt>=p0)qb_page(x,120,140,1000,{a:ag_in(tt,p0,0.35),k:tt-p0,light:"grey",words:1,q:ag_in(tt,w("question","Do",-0.3),0.8),
        rows:QB_ROWS.map((_,j)=>ag_in(tt,[w("under","decision",-0.1),w("under","dates",-0.1),w("under","who",-0.1),w("under","change",-0.1),w("under","means",-0.3)][j],0.6)),
        hl:ag_in(tt,w("words","own",-0.1),0.8)});
      qb_sheet(x,tt,w("reply","replies",-0.2),1180,110,600,{kick:"That afternoon, by email",title:"“Yes, that's it.”",sub:"Graham"},{col:LP.green,light:"grey"});}}
  ]);
  qb_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. What the question gave */
scene("answer",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"},mo={light:"morning"};
  // the building's rooms: across the week, five of twelve booked (one of them with nobody in it); at the peak, eleven
  const WEEK=["G.01","1.02","2.01","3.02","1.04"],PEAK=["G.01","G.03","1.01","1.02","1.03","1.04","2.01","2.02","2.03","3.01","3.02"],EMPTY_W=["2.01"],EMPTY_P=["1.03","3.01"];
  const map=(ids,v,skip)=>{const m={};for(const id of ids)if(!(skip&&skip.includes(id)))m[id]=v;return m;};
  ag_shots(ctx,S,t,sc.dur,[
    // the page waits its turn
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      qb_page(x,300,140,1000,{light:"day",rows:[1,1,1,1,1]});
      qb_pill(x,tt,w("wait","waits",-0.1),null,1560,420,"Waiting its turn",{col:LP.amber,icon:"wait"});
      qb_tag(x,tt,w("wait","Tuesday",-0.1),null,1560,510,"Until Tuesday 30 March",{align:"center",col:LP.amber});}},
    // in March, Ivy follows the question from the page
    {at:c.ivy-0.3,place:"qbMorning",cut:true,keys:[[c.ivy-0.3,960,540,1.0]],draw:(x,tt)=>{
      qb_page(x,780,140,1000,{light:"morning",rows:[1,1,1,1,1]});
      lp_person(x,"ivy",420,700,0.95,{t:tt,light:mo});
      lp_nameTag(x,96,230,"ivy",{role:"Graduate data analyst, from March",a:ag_in(tt,w("ivy","Ivy",-0.1),0.5)});}},
    // from 30 March: the bookings beside the head counts, across the week and at the peak
    {at:c.start-0.3,place:"lpSky",keys:[[c.start-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const wk=w("week","booked",-0.2),pk=w("peak","booked",-0.3),em=w("empty","nobody",-0.4);
      const L={sc:0.5,ox:80},R={sc:0.5,ox:1072};
      qb_building(x,Object.assign({lit:map(WEEK,ag_in(tt,wk,0.8)),used:map(WEEK,ag_in(tt,wk+0.3,0.8),EMPTY_W),edge:map(EMPTY_W,ag_in(tt,em,0.6))},L));
      qb_building(x,Object.assign({lit:map(PEAK,ag_in(tt,pk,0.8)),used:map(PEAK,ag_in(tt,pk+0.3,0.8),EMPTY_P),edge:map(EMPTY_P,ag_in(tt,em+0.2,0.6))},R));
      qb_pill(x,tt,c.start+0.6,wk-0.4,960,300,"From Tuesday 30 March: bookings beside head counts",{col:LP.orange});
      qb_fig(x,tt,wk,190,150,560,{num:"38%",label:"Booked, across the whole week"},{col:LP.orange,light:null,pin:false});
      qb_fig(x,tt,pk,1170,150,580,{num:"93%",label:"Booked, 10:00 to 14:00, Tuesday to Thursday"},{col:LP.orange,light:null,pin:false});
      qb_tag(x,tt,em,null,960,470,"Booked, and nobody came: one hour in five",{align:"center",col:LP.amber});}},
    // the answer to his question
    {at:c.so-0.3,place:"lpRoom",keys:[[c.so-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const a0=w("so","not",-0.2);
      qb_page(x,140,180,1000,{compact:true,light:"day",tick:clamp(tt-a0-0.6,0,1)});
      qb_pill(x,tt,a0,null,640,640,"Not too few rooms: too few at some hours",{col:LP.green});
      qb_tag(x,tt,w("both","academics",-0.1),null,1500,300,"The academics: full at the peak",{align:"center",col:LP.ink});
      qb_tick(x,tt,w("both","peak",0),1830,300);
      qb_tag(x,tt,w("both","Graham",-0.1),null,1500,420,"Graham: empty on Monday mornings",{align:"center",col:LP.ink});
      qb_tick(x,tt,w("both","Monday",0.2),1850,420);
      qb_tag(x,tt,w("both","hidden",-0.2),null,1500,540,"The week's average hid both",{align:"center",col:LP.amber});}},
    // what a dashboard by Easter might have shown
    {at:c.dash-0.3,place:"lpRoom",later:true,keys:[[c.dash-0.3,960,540,1.0]],draw:(x,tt)=>{
      qb_dash(x,460,160,1000,520,{u:ag_in(tt,c.dash+0.2,1.2),grey:ag_in(tt,w("dash","settled",-0.2),0.8)});
      qb_tag(x,tt,w("dash","settled",-0.1),null,960,770,"Settles nothing",{align:"center",col:LP.amber});}},
    // instead: the answer, weeks before his paper
    {at:c.instead-0.3,place:"lpRoom",later:true,keys:[[c.instead-0.3,960,540,1.0]],draw:(x,tt)=>{
      qb_page(x,140,180,1000,{compact:true,light:"day",tick:1});
      qb_pill(x,tt,w("instead","answer",-0.1),null,1500,340,"Answered · Friday 23 April",{col:LP.green,icon:"tick"});
      qb_tag(x,tt,w("instead","paper",-0.2),null,1500,440,"His paper: Tuesday 1 June",{align:"center",col:LP.ink});}}
  ]);
  qb_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back to Pisa: the tower on the team room's wall, what saving it meant, and the daily note
    {at:0,place:"qbMorning",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      qb_print(x,150,190,560,{light:"morning"});
      qb_sheet(x,tt,w("back","agreed",-0.2),800,190,500,{kick:"In Pisa, first",title:"What saving it would mean",lines:["About half a degree","Too little to see"]},{col:LP.blue,light:"morning"});
      if(tt>=w("daily","signed",-0.3))qb_note(x,1380,190,440,{a:ag_in(tt,w("daily","signed",-0.3),0.35),k:tt-w("daily","signed",-0.3),sign:ag_in(tt,w("daily","said",0),1.0),light:"morning"});}},
    // Graham's request, the same care
    {at:c.same-0.3,place:"qbMorning",later:true,keys:[[c.same-0.3,960,540,1.0]],draw:(x,tt)=>{
      qb_page(x,460,140,1000,{light:"morning",rows:[1,1,1,1,1],tick:clamp(tt-w("same","answer",0),0,1)});}},
    // the team's front door, from June
    {at:c.form-0.3,place:"qbMorning",later:true,keys:[[c.form-0.3,960,540,1.0]],draw:(x,tt)=>{
      qb_form(x,560,150,800,520,{u:ag_in(tt,w("form","five",-0.3),1.6)});
      qb_tag(x,tt,w("form","listening",-0.2),null,960,780,"A form can ask; listening hears what the answers mean",{align:"center",col:LP.ink});}},
    // what to do on Monday; then the last line, alone
    {at:c.monday-0.3,place:"qbMorning",later:true,keys:[[c.monday-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.4,0.6);
      if(g>0.004){x.save();x.globalAlpha*=g;
        qb_sheet(x,tt,c.monday+0.3,140,170,520,{kick:"One",title:"Ask what they'll decide with it, and by when"},{light:"morning"});
        qb_sheet(x,tt,w("who","who",-0.1),700,170,520,{kick:"Two",title:"Ask who else decides, what they trust, what would change their mind"},{light:"morning"});
        qb_sheet(x,tt,w("listen","Listen",-0.1),1260,170,520,{kick:"Three",title:"Listen more than you talk; say back what you heard"},{light:"morning"});
        qb_sheet(x,tt,w("write","write",-0.1),560,560,800,{kick:"Four",title:"Write the question beside their words, and agree it"},{col:LP.blue,light:"morning"});
        x.restore();}
      lp_T(x,QB_LAST,960,470,{w:800,size:56,align:"center",a:ag_in(tt,w("take","Ask",-0.1),0.6)*(1-ag_in(tt,e0,0.8))});}}
  ]);
  lp_end(ctx,S,t,e0,"The question behind the request",QB_LAST,"Film 1 of 3","Working with people");
  qb_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["ask","listen","agree","answer"]);
