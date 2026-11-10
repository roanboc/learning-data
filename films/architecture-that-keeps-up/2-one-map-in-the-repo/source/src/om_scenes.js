/* ===== One map, in the repo: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Sizes in the 1920 x 1080 frame. */

const OM_MOD={module:"Data management",mark:dm_mark};
// the film's number and title at the top left, from the second chapter on
function om_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"2","One map, in the repo",{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function om_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const om_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function om_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 and goes at t1 (null: stays)
function om_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}

/* ---------------------------------------------------------------- 1. One database, every map: Great Britain, from the late 1990s */
const OM_M={x:640,y:190,s:1.12};
const om_at=(lx,ly)=>om_mp(OM_M,lx,ly);
scene("tiles",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const cut0=w("tiles","cut",-0.1),join0=w("launch","seamless",-0.3),fill0=w("toid","feature",-0.2),road0=w("road","road",-0.1);
  const [sx,sy]=om_at(532,259),[nx,ny]=om_at(520,350),[ex,ey]=om_at(410,248);
  // the town, as it is at tt: one paper map, then tiles, then one seamless database of things
  const town=(x,tt,o)=>om_map(x,Object.assign({},OM_M,{split:ag_in(tt,cut0,1.4)*(1-ag_in(tt,join0,1.6)),grid:ag_in(tt,cut0,0.6),fill:ag_in(tt,fill0,1.4),
    road:ag_in(tt,road0,1.8)},o||{}));
  // the three records, each the organisation's own name for the school; recs: how far each is in (0 to 1)
  const RX=90,RW=530,RY=[150,390,630];
  const RECS=[["A council","St Anne's Primary"],["A water company","Property 40712"],["The emergency services","School, Grove Road"]];
  ag_shots(ctx,S,t,sc.dur,[
    // the paper map, turned digital, then cut into tiles; who keeps it
    {at:0,place:"omDesk",keys:[[0,1000,520,1.06],[c.when+0.6,960,540,1.0]],d:3,draw:(x,tt)=>{town(x,tt);
      om_sheet(x,tt,w("when","Britain",-0.2),RX,170,RW,{kick:"Great Britain",title:"The late 1990s"},{light:null,pin:false,out:c.os-0.5});
      om_sheet(x,tt,w("os","Survey",-0.3),RX,170,RW,{kick:"Ordnance Survey",title:"The national mapping agency",lines:["The country's most detailed maps"]},
        {light:null,pin:false,out:c.lines-0.5,u:ag_in(tt,w("os","detailed",-0.1),0.5)});
      om_tag(x,tt,cut0+0.4,c.lines-0.5,RX,560,"Digital, cut into tiles",{col:LP.ink});}},
    // close in on one building: only lines
    {at:c.lines-0.3,place:"omDesk",keys:[[c.lines-0.3,960,540,1.0],[c.lines+0.2,sx-60,sy+20,1.9],[c.users-1.9,960,540,1.0]],d:1.6,draw:(x,tt)=>{town(x,tt);
      om_tag(x,tt,w("lines","lines",-0.1),c.users-2.0,sx-210,sy-110,"Only lines",{col:LP.ink,align:"center"});
      om_tag(x,tt,w("lines","name",-0.1),c.users-2.0,sx+40,sy+80,"No name, no number",{col:LP.amber,align:"center"});}},
    // each organisation's own record of the same school, matched to the lines its own way; then a new road, changed by each on its own
    {at:c.users-0.2,place:"omDesk",later:true,keys:[[c.users-0.2,960,540,1.0]],draw:(x,tt)=>{const out=c.launch-0.5,m0=w("match","matches",-0.1),h0=w("harm","school",-0.2);
      town(x,tt,{hl:ag_io(tt,h0,out,0.6),hlCol:LP.amber});
      const tg=[[sx,sy],[nx,ny],[ex,ey]];
      RECS.forEach((r,i)=>{const t0=w("users",["Councils","water","emergency"][i],-0.1);const b=om_sheet(x,tt,t0,RX,RY[i],RW,{kick:r[0],title:r[1]},{light:null,pin:false,out});
        if(!b)return;const lu=ag_in(tt,m0+i*0.35,1.0)*(1-ag_in(tt,out,0.4));
        if(lu>0){x.save();x.globalAlpha*=lu;x.setLineDash([12,9]);x.strokeStyle=rgba(LP.amber,1);x.lineWidth=4;const x0=b.x+b.w,y0=b.y+b.h/2,u=ag_sine(lu);
          x.beginPath();x.moveTo(x0,y0);x.lineTo(lerp(x0,tg[i][0],u),lerp(y0,tg[i][1],u));x.stroke();x.setLineDash([]);x.fillStyle=rgba(LP.amber,1);
          x.beginPath();x.arc(lerp(x0,tg[i][0],u),lerp(y0,tg[i][1],u),8,0,TAU);x.fill();x.restore();}
      });
      const [rx,ry]=om_at(760,470);om_tag(x,tt,road0+0.9,out,rx,ry+70,"Each changes it on its own",{align:"center",col:LP.amber});
      om_pill(x,tt,w("sure","same",-0.1),out,sx,sy-150,"The same place?",{col:LP.amber});}},
    // one seamless database, every feature with its identifier, kept up to date
    {at:c.launch-0.3,place:"omDesk",later:true,keys:[[c.launch-0.3,960,540,1.0]],draw:(x,tt)=>{town(x,tt);const s0=c.survey-0.4,i0=w("toid","identifier",-0.2);
      om_sheet(x,tt,w("launch","MasterMap",-0.3),RX,170,RW,{kick:"2001 · OS MasterMap",title:"One seamless database",sub:"Of the whole country, instead of tiles"},{col:LP.blue,light:null,pin:false,out:c.toid-0.4});
      om_sheet(x,tt,w("toid","million",-0.3),RX,170,RW,{kick:"Every feature",title:"About 440 million at first",lines:["Its own identifier: a TOID","A version, and a date"]},
        {col:LP.blue,light:null,pin:false,out:s0,u:om_u(tt,[i0,w("toid","version",-0.1)])});
      const ch=ag_io(tt,i0,c.point-0.5,0.5);
      if(ch>0){om_chip(x,sx+40,sy-150,"TOID 1000005567801",{a:ch,k:tt-i0,px:sx,py:sy});
        const [ax,ay]=om_at(915,80),[bx,by]=om_at(810,238);om_chip(x,ax-80,ay+150,"TOID 1000005561240",{a:ch*ag_in(tt,i0+0.4,0.4),px:ax,py:ay});
        om_chip(x,bx+40,by+300,"TOID 1000005563377",{a:ch*ag_in(tt,i0+0.8,0.4),px:bx,py:by});}
      // surveyors on the ground and in the air; users receive only what changed
      om_tripod(x,250,500,1.0,ag_io(tt,w("survey","ground",-0.2),c.point-0.5,0.5));om_plane(x,420,250,0.9,ag_io(tt,w("survey","air",-0.2),c.point-0.5,0.5));
      om_tag(x,tt,w("survey","ground",0),c.point-0.5,250,640,"On the ground",{align:"center",col:LP.ink});
      om_tag(x,tt,w("survey","air",0),c.point-0.5,420,150,"From the air",{align:"center",col:LP.ink});
      om_tag(x,tt,w("survey","receive",-0.1),c.point-0.5,RX,760,"Users receive only what changed",{col:LP.blue});}},
    // the council and the water company point to the same building; each change dated
    {at:c.point-0.3,place:"omDesk",later:true,keys:[[c.point-0.3,960,540,1.0]],draw:(x,tt)=>{const p0=w("point","point",-0.1),hs=c.history-0.4;
      town(x,tt,{hl:ag_in(tt,p0+0.6,0.6),hlCol:LP.green});
      [[0,"A council"],[1,"A water company"]].forEach(([i,k])=>{const b=om_sheet(x,tt,c.point+0.1+i*0.3,RX,RY[i],RW,{kick:k,title:"TOID 1000005567801"},{col:LP.green,light:null,pin:false,out:hs});
        if(!b)return;const lu=ag_in(tt,p0+i*0.3,1.0)*(1-ag_in(tt,hs,0.4));if(lu>0){x.save();x.globalAlpha*=lu;x.strokeStyle=rgba(LP.green,1);x.lineWidth=4;const x0=b.x+b.w,y0=b.y+b.h/2,u=ag_sine(lu);
          x.beginPath();x.moveTo(x0,y0);x.lineTo(lerp(x0,sx,u),lerp(y0,sy,u));x.stroke();x.restore();}});
      om_pill(x,tt,w("point","doubt",-0.1),hs,sx,sy-150,"The same building",{col:LP.green,icon:"tick"});
      om_sheet(x,tt,w("history","version",-0.2),RX,170,RW,{kick:"The school's feature",title:"TOID 1000005567801",lines:["Version 1 · first drawn","Version 2 · a new wing","Version 3 · a new hall"]},
        {col:LP.blue,light:null,pin:false,out:c.grew-0.4,u:om_u(tt,[w("history","changed",-0.2),w("history","when",-0.6),w("history","when",-0.2)])});
      const g0=w("grew","million",-0.3);if(tt>g0){const a=ag_in(tt,g0,0.35);lp_figure(x,RX,190,RW,{kick:"By 2016",num:"500 million+",label:"Features, each with its identifier"},{col:LP.green,light:null,pin:false,a,k:tt-g0});}}},
    // a data team's architecture: three copies that drift apart; then one source, and every copy made from it
    {at:c.data-0.3,place:"lpRoom",keys:[[c.data-0.3,960,540,1.0]],push:0,draw:(x,tt)=>{const d0=w("data","copies",-0.1),o0=w("one","source",-0.2),m0=w("one","make",-0.1),fd=1-ag_in(tt,c.breath+0.2,0.8);
      const dr=ag_in(tt,d0+0.4,2.2)*(1-ag_in(tt,m0,1.4));x.save();x.globalAlpha*=fd;
      const src=ag_in(tt,o0,0.5);if(src>0){lp_textSheet(x,700,120,520,{kick:"One source",title:"The architecture"},{col:LP.blue,light:"day",a:src,k:tt-o0});}
      ["The map","The wiki","The slides"].forEach((k,i)=>{const cx=330+i*630,yy=470+dr*[30,-24,44][i],tl=dr*[-4,3,-5][i];
        const a=ag_in(tt,c.data+0.2+i*0.3,0.4);if(a<=0.004)return;
        x.save();x.globalAlpha*=a;x.translate(cx,yy+130);x.rotate(tl*Math.PI/180);x.translate(-cx,-yy-130);
        lp_sheet(x,cx-250,yy,500,300,{light:"day",col:i===0?LP.blue:null});lp_T(x,k,cx,yy+64,{w:800,size:32,align:"center"});
        om_target(x,cx-220,yy+80,440,210,{warehouse:i===0?0:dr*(i===2?1:0.6)});x.restore();
        if(src>0)om_arrow(x,960,330,cx,yy-14,ag_in(tt,m0+0.3+i*0.25,0.8),{col:LP.blue});
        om_tickAt(x,cx+250-34,yy+40,clamp(tt-m0-1.2-i*0.2,0,1));});
      x.restore();}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,"One map, in the repo","One source for the architecture, and every copy made from it","Data management · Architecture that keeps up",OM_MOD);
});

/* ---------------------------------------------------------------- 2. Three pictures of one target */
scene("copies",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"},gr={light:"grey"};
  const COP=[{k:"Noor's map",s:"The architecture tool",wh:0},{k:"The wiki",s:"A page",wh:0.6},{k:"The council's slides",s:"For the data council",wh:1}];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      om_sheet(x,tt,0.9,560,240,800,{kick:"Architecture that keeps up",title:"The product owner's side of a data manager's job",lines:["Borrowed from architecture"]},
        {col:LP.blue,light:"day",u:ag_in(tt,w("series","borrowed",-0.1),0.5)});}},
    // Helena, and her target picture
    {at:c.spring-0.3,place:"lpRoom",later:true,keys:[[c.spring-0.3,960,540,1.0]],draw:(x,tt)=>{
      om_sheet(x,tt,w("spring","Helena",-0.2),900,160,640,{kick:"Spring 2027",title:"Helena Novak",sub:"The data manager"},{light:"day",out:c.three-0.5});
      const p0=w("spring","target",-0.2);if(tt>p0){const a=ag_in(tt,p0,0.35)*(1-ag_in(tt,c.three-0.5,0.4));x.save();x.globalAlpha*=a;
        lp_sheet(x,900,450,640,330,{col:LP.blue,light:"day"});lp_T(x,"The target picture",1220,514,{w:800,size:32,align:"center"});om_target(x,940,540,560,220,{u:ag_in(tt,p0+0.3,1.6)});x.restore();}
      lp_person(x,"helena",470,640,1.0,{t:tt,light:dy});}},
    // three times over, each changed by hand
    {at:c.three-0.3,place:"lpRoom",later:true,keys:[[c.three-0.3,960,540,1.0]],draw:(x,tt)=>{
      COP.forEach((p,i)=>{const t0=c.three+0.2+i*0.35,cx=330+i*630;if(tt<t0)return;const a=ag_in(tt,t0,0.35);x.save();x.globalAlpha*=a;ag_about(x,cx,450,lerp(0.6,1,ag_spr(tt-t0,0,0.5)));
        if(i===1)lp_sheet(x,cx-260,230,520,420,{light:"day"});
        else lp_screen(x,cx-260,230,520,420,{draw:()=>{}});
        lp_T(x,p.k,cx,300,{w:800,size:32,align:"center"});lp_T(x,p.s,cx,344,{w:600,size:28,align:"center",col:LP.mut});
        om_target(x,cx-230,380,460,240,{warehouse:p.wh*ag_in(tt,w("each","hand",-0.2),1.2)});x.restore();
        om_tag(x,tt,w("each","hand",0)+i*0.3,null,cx,720,"Changed by hand",{align:"center",col:LP.amber});});
      om_tag(x,tt,w("each","right",-0.1),null,960,170,"Each right the day it was made",{align:"center",col:LP.ink});}},
    // the data council, 25 May: the old warehouse still in the target on its slide
    {at:c.may-0.3,place:"omCouncil",keys:[[c.may-0.3,960,540,1.0]],draw:(x,tt)=>{const s0=w("slide","old",-0.2);
      lp_screen(x,820,170,880,520,{draw:(cx,X,Y,Wd,Hd)=>{lp_T(cx,"The target · data platform",X+40,Y+60,{w:800,size:32});om_target(cx,X+60,Y+90,Wd-120,Hd-120,{warehouse:1});
        const hu=ag_in(tt,s0,0.6);if(hu>0){const bx=X+60+(Wd-120)*0.5,by=Y+90+(Hd-120)*0.86;cx.strokeStyle=rgba(LP.amber,hu);cx.lineWidth=5;cx.beginPath();cx.ellipse(bx,by,(Wd-120)*0.17,(Hd-120)*0.14,0,0,TAU);cx.stroke();}}});
      om_tag(x,tt,s0+0.3,null,1260,760,"The old warehouse, still in the target",{align:"center",col:LP.amber});
      om_sheet(x,tt,w("may","Tuesday",-0.2),110,150,560,{kick:"25 May · The data council",title:"Retire the old warehouse?"},{col:LP.blue,light:"grey",out:c.which-0.5});
      om_sheet(x,tt,w("which","Which",-0.2),110,150,560,{title:"Which picture is true?",lines:["Nobody in the room can say for sure"]},{col:LP.amber,light:"grey",u:ag_in(tt,w("which","Nobody",-0.1),0.5)});
      lp_person(x,"helena",400,700,0.82,{t:tt,light:gr});}},
    // the project managers' page, and Noor
    {at:c.pm-0.3,place:"lpRoom",keys:[[c.pm-0.3,960,540,1.0]],draw:(x,tt)=>{const n0=w("noor","Noor",-0.3);
      om_sheet(x,tt,c.pm+0.2,300,170,620,{kick:"For project managers",title:"Who does what, when and how",sub:"A deck from March"},{light:"day",out:c.noor+0.6});
      om_pill(x,tt,w("pm","March",0),c.noor+0.6,610,560,"Out of date",{col:LP.amber});
      om_sheet(x,tt,w("noor","drift",-0.3),300,170,620,{kick:"Noor Rahman · The data architect",title:"Copies drift. Keep one source."},{col:LP.blue,light:"day"});
      lp_person(x,"noor",1440,640,1.0,{t:tt,flip:true,a:ag_in(tt,n0,0.6),light:dy});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("spring","university",-0.3),c.three,0.5)});
  om_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. The map moves into the repo */
const OM_MMD=["flowchart LR","  timetable --> platform","  sensors --> platform","  payroll --> platform","  platform --> room_use"];
const OM_SEVEN=["The architecture tool","The glossary","The document library","The repository","The data platform","The catalogue","The tracker"];
scene("repo",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  ag_shots(ctx,S,t,sc.dur,[
    // the repository: the map's files beside the platform's code; the standard, and what's the team's own
    {at:0,place:"omMorning",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const r0=w("june","repository",-0.2),s0=w("standard","exchange",-0.2),o0=w("own","own",-0.2);
      const hl=tt<o0?3:4,hlA=tt<o0?ag_in(tt,s0,0.5):ag_in(tt,o0,0.5);
      lp_screen(x,120,150,980,640,{draw:(cx,X,Y,Wd,Hd)=>om_repo(cx,X,Y,Wd,Hd,{u:ag_in(tt,r0,1.8),hl,hlA})});
      om_sheet(x,tt,w("june","June",-0.2),1200,160,600,{kick:"June 2027",title:"The map's source moves into the repository",lines:["As files, beside the platform's code"]},
        {col:LP.blue,light:"morning",out:c.standard-0.4,u:ag_in(tt,w("june","files",-0.1),0.5)});
      om_sheet(x,tt,w("standard","ArchiMate's",-0.2),1200,160,600,{kick:"ArchiMate · The Open Group",title:"A standard language for architecture",lines:["Its exchange format, as a file"]},
        {col:LP.blue,light:"morning",out:c.own-0.4,u:ag_in(tt,s0,0.5)});
      om_sheet(x,tt,o0,1200,160,600,{kick:"Then what's the team's own",title:"Standards first",lines:["Each product's owner","Then what's relevant to you"]},
        {col:LP.blue,light:"morning",u:om_u(tt,[w("own","owner",-0.1),w("own","relevant",-0.1)])});}},
    // a diagram kept as text, and drawn from it
    {at:c.text-0.3,place:"omMorning",later:true,keys:[[c.text-0.3,960,540,1.0]],draw:(x,tt)=>{const t0=w("text","text",-0.2),d0=w("text","picture",-0.3);
      lp_screen(x,100,170,860,500,{draw:(cx,X,Y,Wd,Hd)=>om_code(cx,X,Y,Wd,Hd,OM_MMD,{head:"views/target.mmd",u:ag_in(tt,t0,1.6)})});
      om_flow(x,1400,440,0.95,{u:ag_in(tt,d0,2.0)});
      om_tag(x,tt,w("text","Mermaid",-0.1),null,530,760,"Mermaid · draw.io",{align:"center",col:LP.blue});
      om_tag(x,tt,w("text","read",-0.2),null,1400,760,"A change you can read",{align:"center",col:LP.blue});}},
    // each night, everything else made from it
    {at:c.night-0.3,place:"omMorning",later:true,keys:[[c.night-0.3,960,540,1.0]],draw:(x,tt)=>{const n0=w("night","night",-0.2);
      om_fan(x,{light:"morning",u:ag_in(tt,c.night,0.4),k:tt-c.night,lit:[ag_in(tt,w("night","tool's",-0.2),1.0),ag_in(tt,w("night","wiki",-0.2),1.0),ag_in(tt,w("night","picture",-0.2),1.0),ag_in(tt,w("who","who",-0.2),1.0)]});
      om_tag(x,tt,n0,null,200,640,"Each night",{col:LP.ink});}},
    // the seven places; the repository is one
    {at:c.places-0.3,place:"omMorning",later:true,keys:[[c.places-0.3,960,540,1.0]],draw:(x,tt)=>{const p0=w("places","seven",-0.2),r0=w("places","repository",-0.2);
      om_sheet(x,tt,w("places","Where",-0.3),660,140,600,{kick:"Where each piece lives",title:"Seven places for the team's work"},{light:"morning",out:c.cant-0.5});
      OM_SEVEN.forEach((s,i)=>{const row=i<4?0:1,col=row?i-4:i,n=row?3:4,cx=960+(col-(n-1)/2)*430,cy=470+row*120,on=i===3?ag_in(tt,r0,0.5):0;
        const a=ag_in(tt,p0+i*0.15,0.4)*(1-ag_in(tt,c.cant-0.5,0.4));if(a<=0.004)return;
        if(on>0)lp_pill(x,cx,cy,s,{col:LP.blue,a:a*on,k:tt-r0});lp_tag(x,cx,cy,s,{align:"center",col:LP.mut,a:a*(1-on)});});
      // the wiki and the slides, made from the map now
      const k0=w("cant","made",-0.3);om_fan(x,{light:"morning",a:ag_in(tt,c.cant-0.3,0.5),u:1,lit:[1,1,1,1],ticks:clamp(tt-k0,0,1)});}}
  ]);
  om_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Every change, reviewed */
scene("change",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  const FILES=[{name:"platform/pipelines/sensors.py",note:"the code",col:LP.orange},{name:"architecture/model.xml",note:"current state",col:LP.blue},{name:"architecture/views/current.mmd",note:"its picture",col:LP.blue}];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const p0=w("pr","pull",-0.2),f0=w("july","adds",-0.2),s0=w("same","same",-0.2),k0=w("check","check",-0.2);
      lp_screen(x,100,130,1120,700,{draw:(cx,X,Y,Wd,Hd)=>{if(tt<c.pr+0.2)return;cx.save();cx.globalAlpha*=ag_in(tt,c.pr+0.2,0.5);
        om_pr(cx,X,Y,Wd,Hd,{num:24,title:"Add the rooms' sensor feed",by:"Sam Okafor",why:"hourly counts for room use",files:FILES,fu:ag_in(tt,f0,1.4),fhl:tt>s0+0.6?1:null,
          reviewers:["Noor","Helena","Jun"],ru:ag_in(tt,w("who","review",-0.4),0.6),check:{text:"Every new source has a place on the map",state:"pass",u:ag_in(tt,k0,0.5)}});cx.restore();}});
      om_sheet(x,tt,w("pr","reason",-0.3),1300,150,520,{kick:"Every change",title:"A pull request",lines:["With its reason","Reviewed by someone else"]},
        {col:LP.blue,light:"day",out:w("who","Data",-0.8),u:om_u(tt,[w("pr","reason",-0.1),w("pr","someone",-0.1)])});
      om_sheet(x,tt,w("who","Data",-0.3),1300,150,520,{kick:"Data partners",title:"Propose changes too",sub:"In the faculties"},{light:"day",out:c.july-0.4});
      om_sheet(x,tt,w("july","July",-0.2),1300,150,520,{kick:"July 2027",title:"The rooms' sensor feed",sub:"Added to the platform"},{col:LP.orange,light:"day",out:c.same+0.4});
      om_sheet(x,tt,w("same","together",-0.4),1300,150,520,{title:"The code and the map change together"},{col:LP.blue,light:"day",out:w("check","fails",-0.8)});
      om_sheet(x,tt,w("check","fails",-0.3),1300,150,520,{kick:"The check",title:"A new source with no place on the map"},{col:LP.amber,light:"day"});
      om_crossAt(x,1300+520-40,190,clamp(tt-w("check","fails",0.2),0,1));}},
    // saved up, or updated with every change
    {at:c.wait-0.3,place:"lpRoom",later:true,keys:[[c.wait-0.3,960,540,1.0]],draw:(x,tt)=>{const l0=w("legacy","legacy",-0.3);
      lp_sheet(x,240,150,1440,640,{light:"day",a:ag_in(tt,c.wait,0.35)});
      om_lanes(x,300,250,1320,{a:ag_in(tt,c.wait,0.35),u:ag_in(tt,c.wait+0.2,3.6)});
      om_pill(x,tt,l0,null,1440,440,"Tomorrow's legacy",{col:LP.amber});}},
    // a decision record beside a big choice
    {at:c.record-0.3,place:"lpRoom",later:true,keys:[[c.record-0.3,960,540,1.0]],draw:(x,tt)=>{const r0=w("record","record",-0.3);
      om_sheet(x,tt,r0,560,170,800,{kick:"Decision record 7",title:"Retire the old warehouse",lines:["Decided: move the 21 used reports, retire the other 17","Why: one platform, and the licence ends on 31 December"]},
        {col:LP.blue,light:"day",u:om_u(tt,[w("record","decided",-0.1),w("record","why",-0.1)])});
      om_tag(x,tt,w("record","Nygard",-0.2),null,960,700,"Michael Nygard, 2011",{align:"center",col:LP.ink});}}
  ]);
  om_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. An agent drafts, a person decides */
const OM_DRAFT=["flowchart LR","  timetable --> platform","  payroll --> platform","  platform --> payroll_reports","  old_warehouse --> payroll_reports","  old_warehouse:::retired"];
scene("agent",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  const bad=4,wr0=w("wrong","wrong",-0.2),fx0=w("fix","fix",-0.1),ap0=w("fix","approves",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // Helena's notes, and the agent
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      om_sheet(x,tt,w("august","notes",-0.4),700,170,560,{kick:"Helena's notes · August",title:"Retire the old warehouse",lines:["By 17 December","Payroll and HR reports move to the platform"]},
        {light:"day",u:ag_in(tt,w("august","notes",0),1.0)});
      lp_person(x,"helena",380,640,1.0,{t:tt,light:dy});
      ag_model(x,1560,500,74,{t:tt,think:ag_io(tt,w("august","draft",-0.2),c.writes+3,0.5)});
      om_tag(x,tt,w("august","agent",-0.1),null,1560,660,"The team's agent",{align:"center",col:LP.violet});}},
    // the draft, as text, and its diagram
    {at:c.writes-0.3,place:"lpRoom",later:true,keys:[[c.writes-0.3,960,540,1.0]],draw:(x,tt)=>{const d0=w("writes","writes",-0.2);
      lp_screen(x,90,160,840,560,{draw:(cx,X,Y,Wd,Hd)=>{cx.fillStyle=rgba(LP.violet,0.9);cx.fillRect(X,Y,Wd,10);om_code(cx,X,Y,Wd,Hd,OM_DRAFT,{head:"views/target.mmd",u:ag_in(tt,d0,2.2)});}});
      om_flow(x,1415,430,1.0,{u:ag_in(tt,w("writes","diagram",-0.2),2.0),retire:ag_in(tt,w("writes","diagram",1.0),0.8),bad:ag_in(tt,w("writes","diagram",1.0),0.6)});
      om_tag(x,tt,d0+0.3,null,510,790,"Drafted by the agent",{align:"center",col:LP.violet});}},
    // Noor reviews it, line by line; one wrong line; the fix, checked; approved
    {at:c.review-0.3,place:"lpRoom",later:true,keys:[[c.review-0.3,960,540,1.0]],draw:(x,tt)=>{const fu=ag_in(tt,fx0+0.4,1.0);
      lp_screen(x,640,150,1160,560,{draw:(cx,X,Y,Wd,Hd)=>{cx.fillStyle=rgba(LP.violet,0.9);cx.fillRect(X,Y,Wd,10);
        const sc_=tt<wr0?Math.min(bad,Math.max(0,Math.floor((tt-c.review)*2.4))):bad;
        om_code(cx,X,Y,Wd,Hd,OM_DRAFT,{head:"views/target.mmd",hl:{i:sc_,col:tt<wr0?LP.blue:(fu>0.5?LP.green:LP.amber),a:1},swap:{i:bad,text:"  platform --> payroll_reports",u:fu}});
        if(ap0<tt)lp_pill(cx,X+Wd-230,Y+Hd-60,"Approved by Noor",{col:LP.green,icon:"tick",a:ag_in(tt,ap0,0.4),k:tt-ap0});}});
      om_tag(x,tt,wr0+0.3,fx0+0.3,1220,790,"Payroll's reports, from a warehouse that's gone",{align:"center",col:LP.amber});
      lp_person(x,"noor",330,640,1.0,{t:tt,light:dy});}},
    // the rule
    {at:c.rule-0.3,place:"lpRoom",later:true,keys:[[c.rule-0.3,960,540,1.0]],draw:(x,tt)=>{const p0=w("rule","proposes",-0.2),d0=w("rule","decides",-0.2);
      ag_model(x,520,470,70,{t:tt});lp_person(x,"noor",1400,640,1.0,{t:tt,flip:true,light:dy});
      om_pill(x,tt,p0,null,520,640,"Proposes",{col:LP.violet});om_pill(x,tt,d0,null,1400,250,"Decides",{col:LP.green});
      om_sheet(x,tt,c.rule+0.3,700,160,520,{kick:"The agent films",title:"The same rule"},{light:"day"});}}
  ]);
  om_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. Everyone's job, starting with hers */
scene("everyone",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"},gr={light:"grey"};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"omLate",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const p0=w("hers","first",-0.3);
      lp_screen(x,760,170,1020,480,{draw:(cx,X,Y,Wd,Hd)=>{if(tt<p0)return;cx.save();cx.globalAlpha*=ag_in(tt,p0,0.5);
        om_pr(cx,X,Y,Wd,Hd,{num:1,title:"First map in the repository",by:"Helena Novak",why:"one source for our architecture",files:[{name:"architecture/model.xml",note:"current and target",col:LP.blue}],
          approved:{text:"Reviewed by Noor",u:ag_in(tt,p0+1.4,0.5),k:tt-p0-1.4}});cx.restore();}});
      lp_person(x,"helena",400,640,1.0,{t:tt,light:lt});}},
    // the principal engineers beside her; anyone can propose
    {at:c.beside-0.3,place:"omLate",later:true,keys:[[c.beside-0.3,960,540,1.0]],draw:(x,tt)=>{
      for(const [who,px,fl,word] of [["helena",330,false,null],["sam",760,false,"principal"],["jun",1160,true,"engineers"],["noor",1590,true,"keep"]])
        lp_person(x,who,px,720,0.72,{t:tt,flip:fl,a:word?ag_in(tt,w("beside",word,-0.2),0.6):1,light:lt});
      om_tag(x,tt,w("beside","anyone",-0.1),null,960,190,"Anyone on the team can propose a change",{align:"center",col:LP.blue});}},
    // the year's history, by 17 December
    {at:c.dec-0.3,place:"omLate",later:true,keys:[[c.dec-0.3,960,540,1.0]],draw:(x,tt)=>{const h0=w("dec","history",-0.3),r0=w("dec","retired",-0.2),u=ag_in(tt,h0,3.0);
      lp_screen(x,120,140,1000,680,{draw:(cx,X,Y,Wd,Hd)=>om_history(cx,X,Y,Wd,Hd,{u,n:Math.round(lerp(2,63,ag_sine(u)))})});
      om_sheet(x,tt,w("dec","Friday",-0.3),1220,170,580,{kick:"Friday 17 December",title:"The old warehouse is retired"},{col:LP.green,light:"late"});
      om_tickAt(x,1220+580-40,210,clamp(tt-r0,0,1));
      om_tag(x,tt,w("dec","reason",-0.2),null,1510,520,"Each change with its reason",{align:"center",col:LP.blue});}},
    // the council reads the history
    {at:c.council-0.3,place:"omCouncil",cut:true,keys:[[c.council-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_screen(x,820,170,880,560,{draw:(cx,X,Y,Wd,Hd)=>om_history(cx,X,Y,Wd,Hd,{u:1,n:63})});
      om_sheet(x,tt,w("council","reviews",-0.3),110,170,600,{kick:"The data council's reviews",title:"Read the map's history",lines:["Not a slide made the night before"]},
        {col:LP.blue,light:"grey",u:ag_in(tt,w("council","slide",-0.1),0.5)});
      lp_person(x,"helena",400,700,0.82,{t:tt,light:gr});}}
  ]);
  om_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back to Ordnance Survey: a print of the seamless map on the team room's wall
    {at:0,place:"omMorning",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      lp_sheet(x,440,130,1080,620,{light:"morning"});om_map(x,{x:480,y:160,s:1.0,fill:1,hl:ag_in(tt,w("back","identifier",-0.2),0.6)});
      om_tag(x,tt,w("back","database",-0.1),null,700,770,"One database",{align:"center",col:LP.blue});
      om_tag(x,tt,w("back","identifier",-0.1),null,1070,770,"An identifier",{align:"center",col:LP.blue});
      om_tag(x,tt,w("back","date",-0.2),null,1430,770,"A date",{align:"center",col:LP.blue});}},
    // Helena's team did the same: one map, every other picture from it
    {at:c.helena-0.3,place:"omMorning",later:true,keys:[[c.helena-0.3,960,540,1.0]],draw:(x,tt)=>{
      om_fan(x,{light:"morning",u:ag_in(tt,c.helena,0.4),k:tt-c.helena,lit:[0,1,2,3].map(i=>ag_in(tt,c.helena+0.6+i*0.3,0.9)),ticks:clamp(tt-w("helena","picture",0.4),0,1)});}},
    // what to do on Monday; then the map and what's made from it, as it becomes the end card
    {at:c.repo-0.3,place:"omMorning",later:true,keys:[[c.repo-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.4,0.6);
      if(g>0.004){x.save();x.globalAlpha*=g;
        om_sheet(x,tt,c.repo+0.3,120,150,540,{kick:"One",title:"Your architecture in a repository, as files"},{col:LP.blue,light:"morning"});
        om_sheet(x,tt,w("review","Review",-0.1),690,150,540,{kick:"Two",title:"Review every change like code"},{col:LP.blue,light:"morning"});
        om_sheet(x,tt,w("make","Make",-0.1),1260,150,540,{kick:"Three",title:"Make the wiki and the slides from it"},{light:"morning"});
        om_sheet(x,tt,w("agents","agents",-0.1),360,470,560,{kick:"Four",title:"Let agents draft; review what they draft"},{col:LP.violet,light:"morning"});
        om_sheet(x,tt,w("job","everyone's",-0.1),1000,470,560,{kick:"Five",title:"Everyone's job, starting with yours"},{light:"morning"});
        x.restore();}
      om_fan(x,{light:"morning",a:ag_in(tt,c.take-0.2,0.6)*(1-ag_in(tt,e0,0.8)),u:1,k:tt-c.take,lit:[0,1,2,3].map(i=>ag_in(tt,w("take","everything",-0.3)+i*0.2,0.8))});}}
  ]);
  // the last line is too wide for one line of the end card, so it is drawn here in two, at the card's size and with its fade
  lp_end(ctx,S,t,e0,"One map, in the repo",null,"Film 2 of 3","Architecture that keeps up",OM_MOD);
  {const tA=ag_in(t,e0+0.6,0.9);if(tA>0){setScreen(ctx,S);withA(ctx,tA,()=>{lp_T(ctx,"One map in the repository; every change updates it;",960,296,{w:700,size:48,align:"center"});lp_T(ctx,"everything else comes from it.",960,358,{w:700,size:48,align:"center"});});}}
  om_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["copies","agent"]);
