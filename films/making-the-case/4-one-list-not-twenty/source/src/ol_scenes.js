/* ===== One list, not twenty: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between places a shot dissolves. Sizes in the 1920 x 1080 frame. */

const OL_TITLE="One list, not twenty",OL_LAST="One door, one list, ordered in the open.",OL_MOD={module:"Data management",mark:dm_mark};
function ol_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"4",OL_TITLE,{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function ol_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
const ol_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
const ol_n=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0);
function ol_tagAt(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function ol_pillAt(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// where and when, at the top right, over every shot
function ol_where(ctx,S,t,t0,t1,text){const a=ag_io(t,t0,t1==null?1e9:t1,0.5);if(a>0.004){setScreen(ctx,S);lp_sceneTag(ctx,text,{a});}}
// a card that springs in at t0 and goes from out
function ol_cardAt(ctx,t,t0,out,x,y,w,words,v,o){const a=ag_in(t,t0,0.35)*(out!=null?1-ag_in(t,out,0.4):1);if(a<=0.004)return;
  ol_card(ctx,x,y,w,words,v,Object.assign({},o,{a,k:t-t0}));}
// the board on the team's screen, in the tracker: the same place in every shot that shows it
const OL_SCR=[330,150,1260,600];
function ol_boardAt(ctx,a,o){if(a<=0.004)return;lp_screen(ctx,OL_SCR[0],OL_SCR[1],OL_SCR[2],OL_SCR[3],{a,draw:(cx,X,Y,Wd,Hd)=>ol_board(cx,X,Y,Wd,Hd,o)});}

/* ---------------------------------------------------------------- 1. Flying ambulances: the Rhine, 1792, to Aboukir, 1799 */
// the wounded who never got help, at Speyer: 18 of the 26 (the rest were reached in time, or walked back)
const OL_LOST=(()=>{const R=ag_rnd(1792),idx=OL_FALLEN.map((_,i)=>i).sort(()=>R()-0.5);return new Set(idx.slice(0,18));})();
// the flying ambulances at work: each of six carriages goes from its post to one of the wounded, bandages them there, and back
function ol_flyWork(ctx,tt,t0,post,pts,o){o=o||{};const n=pts.length,per=o.per||1.5,cars=o.cars||6;
  pts.forEach((p,i)=>{const s=t0+Math.floor(i/cars)*per+(i%cars)*0.16,u=(tt-s)/per,done=u>=0.5;
    ol_wound(ctx,p[0],p[1],{r:o.r||11,ok:done?ag_sine(clamp((u-0.5)*4,0,1)):0,a:o.a==null?1:o.a});
    if(u>0&&u<1){const k=u<0.5?ag_sine(u*2):ag_sine((1-u)*2),x=lerp(post[0],p[0],k),y=lerp(post[1],p[1],k),an=Math.atan2(p[1]-post[1],p[0]-post[0])+(u<0.5?0:Math.PI);
      ol_cart(ctx,x,y,an,o.s||1);}});}
// the requests where they lie: eleven heaps, one for each place they arrive, as many in each as wait there
const OL_HEAPS=[[250,250],[530,210],[810,262],[1050,214],[290,474],[580,512],[860,470],[1070,520],[320,706],[620,742],[910,702]];
const OL_HEAP=(()=>{const R=ag_rnd(2027),seen={},out=[];OL_FROM.forEach(i=>{const k=seen[i]=(seen[i]||0)+1,[hx,hy]=OL_HEAPS[i];
  out.push({i,x:hx+(((k-1)%3)-1)*54+(R()-0.5)*16,y:hy+(Math.floor((k-1)/3)-1.2)*30+(R()-0.5)*10,r:(R()-0.5)*0.24});});return out;})();
function ol_chipAt(ctx,x,y,r,a,s){if(a<=0.004)return;s=s||1;ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.scale(s,s);ol_chip(ctx,-39,-24,78,48,a);ctx.restore();}
function ol_heaps(ctx,tt,t0,a){OL_HEAP.forEach(q=>ol_chipAt(ctx,q.x,q.y,q.r,a*ag_in(tt,t0+q.i*0.14,0.4)));}
// through the one door, onto the one list: each request flies to the door, in, and out onto its place on the list
const OL_DOOR1=[1180,380,170,556],OL_L1=ol_listBox(1400,110);
function ol_through(ctx,tt,f0){const [dx,dy,dw,dh]=OL_DOOR1,dc=[dx+dw/2,dy+dh*0.48];let n=0;
  OL_HEAP.forEach((q,j)=>{const u=(tt-f0-j*0.032)/1.5;const [sx,sy,cw,ch]=ol_slot(OL_L1,j,7);
    if(u<=0){ol_chipAt(ctx,q.x,q.y,q.r,1);return;}
    if(u>=1){n++;ol_chip(ctx,sx,sy,cw,ch,1);return;}
    if(u<0.5){const k=ag_sine(u*2);ol_chipAt(ctx,lerp(q.x,dc[0],k),lerp(q.y,dc[1],k),q.r*(1-k),1-0.75*k,lerp(1,0.6,k));}
    else{const k=ag_sine((u-0.5)*2);ol_chipAt(ctx,lerp(dc[0]+dw*0.3,sx+cw/2,k),lerp(dc[1],sy+ch/2,k),0,0.25+0.75*k,lerp(0.6,1,k));}});
  return n;}

scene("flying",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),out={light:"day",wall:0},gy={light:"grey"};
  const rh=(x,tt)=>ol_sheet(x,tt,w("rhine","Rhine",-0.3),130,130,560,{kick:"France at war",title:"The Rhine, 1792"},{light:null,pin:false});
  const fall0=w("lie","fall",-0.2),end0=w("lie","ends",-0.1),sets0=w("lie","sets",-0.2),most0=w("die","Most",-0.1);
  const f1=w("list","door",-0.4);
  ag_shots(ctx,S,t,sc.dur,[
    // the Rhine's valley, autumn 1792
    {at:0,place:"olRhine",keys:[[0,960,540,1.05],[2.5,960,540,1.0]],d:3,draw:(x,tt)=>{rh(x,tt);}},
    // a young surgeon in its army
    {at:w("rhine","Dominique-Jean",-0.5),place:"olRhine",keys:[[0,960,540,1.0]],draw:(x,tt)=>{rh(x,tt);
      ol_sheet(x,tt,w("rhine","Dominique-Jean",-0.3),130,330,620,{kick:"A young army surgeon",title:"Dominique-Jean Larrey"},{light:null,pin:false});
      ol_larrey(x,1420,640,1.0,{t:tt,flip:true,light:out});}},
    // the field, from above: the fighting; the field hospital a league behind it; the wounded left where they fall until it ends;
    // then the field hospital's carriage, stuck behind the wagons; most die waiting
    {at:c.league-0.3,place:"olPlan",keys:[[0,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      ol_fight(x,{a:1-ag_in(tt,end0,1.2)});
      ol_tent(x,OL_P.amb[0],OL_P.amb[1],1.3);
      ol_tagAt(x,tt,w("league","ambulance",-0.2),null,900,800,"The ambulance: its field hospital",{align:"right",col:LP.ink});
      ol_dim(x,1070,374,742,ag_in(tt,w("league","league",-0.2),0.6)*(1-ag_in(tt,c.die-0.5,0.5)),"One league","about 4 km");
      ol_wagons(x,ag_in(tt,sets0,1.0));
      ol_tagAt(x,tt,w("lie","wagons",-0.2),c.die-0.5,1110,600,"The army's wagons",{col:LP.mut});
      const u=ag_sine(clamp((tt-sets0-0.4)/4.0,0,1))*0.13,p=ol_roadAt(0.04+u);if(tt>sets0)ol_cart(x,p[0],p[1],-Math.PI/2,1.1,[118,104,96]);
      OL_FALLEN.forEach((q,i)=>ol_wound(x,q[0],q[1],{a:ag_in(tt,fall0+i*0.05,0.3),dim:OL_LOST.has(i)?ag_in(tt,most0+(i%9)*0.12,1.2):0}));
      ol_tagAt(x,tt,w("die","day",-0.1),null,1110,560,"A day, or a day and a half",{col:LP.amber});}},
    // Larrey's design, pinned on a limewashed wall: a light carriage on springs that follows the front line
    {at:c.fly-0.3,place:"olWall",keys:[[0,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const p0=w("fly","flying",-0.3);
      if(tt>=p0)ol_plate(x,640,130,1120,{u:ag_in(tt,p0+0.2,2.6),notes:[ag_in(tt,w("fly","springs",-0.1),0.5),0,0],k:tt-p0,light:"grey",a:ag_in(tt,p0,0.35)});
      ol_tagAt(x,tt,w("fly","follows",-0.1),null,1200,840,"It follows the front line",{align:"center",col:LP.blue});
      ol_larrey(x,330,650,1.0,{t:tt,light:gy});}},
    // from 1793: bandaged where they fall, carried back while the battle goes on
    {at:c.bandage-0.3,place:"olPlan",keys:[[0,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const b0=w("bandage","bandage",-0.2);
      ol_fight(x,{a:1});ol_tent(x,OL_P.amb[0],OL_P.amb[1],1.3);
      ol_tent(x,OL_P.post[0],OL_P.post[1]+30,0.9,[214,226,240]);
      ol_flyWork(x,tt,b0,[OL_P.post[0],OL_P.post[1]+30],OL_FALLEN,{per:1.5});
      ol_tagAt(x,tt,c.bandage+0.2,null,1010,480,"The flying ambulance",{col:LP.blue});}},
    // Aboukir, 1799: eight hundred wounded, none left waiting more than a quarter of an hour
    {at:c.aboukir-0.3,place:"olBay",keys:[[0,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const a0=w("aboukir","Aboukir",-0.3),q0=w("quarter","quarter",-0.4);
      ol_flyWork(x,tt,a0+0.6,OL_BAY.post,OL_BAY.pts,{per:1.4,cars:6,r:9,s:0.9});ol_tent(x,OL_BAY.post[0],OL_BAY.post[1],0.9,[214,226,240]);
      ol_sheet(x,tt,a0,120,290,640,{kick:"Aboukir, Egypt, 1799",title:"800 wounded"},{light:null,pin:false});
      ol_sheet(x,tt,q0,120,520,640,{kick:"By his own account",title:"None waited more than a quarter of an hour"},{col:LP.green,light:null,pin:false});}},
    // a data team's field: requests lie in many places, and wait weeks
    {at:c.data-0.3,place:"olRoom",keys:[[0,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      ol_heaps(x,tt,w("data","requests",-0.4),1);
      ol_tagAt(x,tt,w("data","weeks",-0.1),c.list-0.4,1300,480,"Waiting weeks",{col:LP.amber});}},
    // through one door, onto one list: the wordless moment that becomes the title
    {at:c.list-0.3,place:"olRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      ol_frontDoor(x,OL_DOOR1[0],OL_DOOR1[1],OL_DOOR1[2],OL_DOOR1[3],ag_in(tt,f1-0.4,0.8),ag_in(tt,c.list-0.2,0.5));
      ol_list(x,OL_L1,{fly:0,a:ag_in(tt,c.list,0.5),light:"day"});
      const n=ol_through(x,tt,f1);if(n>0)lp_T(x,String(n),OL_L1.x+OL_L1.w-30,OL_L1.y+76,{w:800,size:44,align:"right"});
      ol_pillAt(x,tt,w("list","most",-0.1),null,1000,190,"The most needed first",{col:LP.green,icon:"tick"});}}
  ]);
  ol_where(ctx,S,t,c.speyer-0.2,c.fly-0.6,"Speyer, autumn 1792");
  ol_where(ctx,S,t,c.bandage,c.aboukir-0.6,"From 1793");
  lp_title(ctx,S,t,c.breath+0.2,OL_TITLE,"One way in, and one order, for all the data work","Data management · Making the case",OL_MOD);
});
// the coast at Aboukir: the flying ambulances' post behind the shore, and the wounded on the land
const OL_BAY={post:[1060,800],pts:ol_fallen(1799,40,[860,360,1440,700]).map(q=>[q[0],q[1]])};

/* ---------------------------------------------------------------- 2. Eleven ways in */
const OL_DBOX=[700,150,1150,560];
scene("doors",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),day={light:"day"};
  const hel=(x,tt,a)=>lp_person(x,"helena",280,640,1.0,{t:tt,a,light:day});
  const T=[w("places","inboxes",-0.2),w("places","inboxes",-0.05),w("places","tracker",-0.2),w("places","spreadsheets",-0.2),w("places","spreadsheets",-0.05),w("places","spreadsheets",0.1),
    w("places","chat",-0.2),w("places","chat",-0.05),w("more","form",-0.2),w("more","agents'",-0.2),w("more","council's",-0.2)];
  ag_shots(ctx,S,t,sc.dur,[
    // Helena's team, and the eleven places requests reach it
    {at:0,place:"olRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const tw0=w("twice","twice",-0.2),f0=w("first","first",-0.2);
      ol_doors(x,OL_DBOX,{u:T.map(t0=>ag_in(tt,t0,0.4)),count:ag_in(tt,w("twice","see",-0.2),0.6),hl:tt>tw0&&tt<c.first-0.2?[0,4]:[],light:"day"});
      const ln=ag_io(tt,tw0,c.first-0.2,0.4);if(ln>0.004){const p=ol_doorMid(0,OL_DBOX),q=ol_doorMid(4,OL_DBOX);x.save();x.globalAlpha*=ln;x.setLineDash([12,10]);
        x.strokeStyle=rgba(LP.amber,1);x.lineWidth=4;x.beginPath();x.moveTo(p[0]+60,p[1]+30);x.lineTo(q[0]-60,q[1]-30);x.stroke();x.restore();}
      ol_tagAt(x,tt,tw0+0.3,c.first-0.4,1275,770,"Asked twice, to be heard",{align:"center",col:LP.amber});
      ol_tagAt(x,tt,f0,null,700,762,"Answered: whoever reaches the team first",{col:LP.ink});
      ol_tagAt(x,tt,w("first","bigger",-0.1),null,700,832,"Bigger needs wait, unseen",{col:LP.amber});
      lp_nameTag(x,470,300,"helena",{a:ag_in(tt,w("uni","Helena",-0.2),0.5)});hel(x,tt,1);}},
    // Jena, 1806: the walking wounded reach the surgeons first, and the worst wounds wait
    {at:c.jena-0.3,place:"olPlan",keys:[[0,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      ol_jena(x,{walk:ag_in(tt,w("walk","walk",-0.4),3.4)});
      ol_tagAt(x,tt,c.jena+0.4,null,960,712,"The surgeons' tent",{align:"center",col:LP.mut});
      ol_tagAt(x,tt,w("walk","walk",0.2),null,1180,800,"Those who could walk came first",{col:LP.ink});
      ol_tagAt(x,tt,w("walk","worst",-0.1),null,600,700,"The worst wounds waited",{align:"right",col:LP.amber});}},
    // so the roadmap's first work package
    {at:c.package-0.3,place:"olRoom",keys:[[0,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      ol_sheet(x,tt,w("package","work",-0.3),760,210,820,{kick:"The roadmap · work package 1",title:"One front door, and one list",lines:["By 30 June 2027"]},
        {col:LP.blue,light:"day",u:ag_in(tt,w("package","June",-0.2),0.5)});
      hel(x,tt,1);}}
  ]);
  ol_where(ctx,S,t,w("uni","university",-0.3),c.twice,"The university, 2027 · imagined");
  ol_where(ctx,S,t,c.jena,c.package-0.6,"Jena, 1806");
  ol_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. One front door */
const OL_DBOX3=[560,150,780,430],OL_L3=ol_listBox(1380,120);
scene("door",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const g0=w("gather","sixty-one",-0.3),gF=(tt)=>ag_in(tt,g0,3.2),tw0=w("twins","joins",-0.3),th0=w("thanks","closed",-0.4),cl0=c.left-0.1;
  // how far each request has flown onto the list, as ol_list moves it (so the places' counts empty as their requests leave)
  const kOf=(fly,j)=>ag_sine(clamp(fly*1.5-j/OL_N*0.5,0,1));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"olMonday",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const fly=gF(tt),gone=1-ag_in(tt,c.close-0.6,0.5);
      ol_frontDoor(x,200,190,250,746,ag_in(tt,w("open","opens",-0.2),1.2),1);
      // the day it opens, and its form's five questions
      ol_sheet(x,tt,0.9,520,150,520,{kick:"The front door opens",title:"Monday 7 June 2027"},{light:"morning",out:c.close-0.6});
      if(gone>0.004)ol_form(x,1100,140,720,{a:ag_in(tt,w("open","form",-0.2),0.35)*gone,k:tt-w("open","form",-0.2),light:"morning",
        u:ol_u(tt,[w("five","decision",-0.2),w("five","By",-0.1),w("five","Who",-0.1),w("five","data",-0.2),w("five","else",-0.2)])});
      ol_tagAt(x,tt,w("what","for",-0.1),c.close-0.6,1460,650,"What it's for, not what to build",{align:"center",col:LP.blue});
      // the old doors, each closed kindly with a note pointing to the front door; then their requests fly onto the one list
      const d0=c.close-0.1,left=i=>{let n=0,m=0;OL_FROM.forEach((f,j)=>{if(f===i){m++;if(kOf(fly,j)>0.5)n++;}});return m?n/m:0;};
      ol_doors(x,OL_DBOX3,{u:OL_PLACES.map((_,i)=>ag_in(tt,d0+i*0.05,0.4)),count:1,compact:1,cols:4,note:ag_in(tt,w("close","note",-0.4),1.6),left,
        a:1-ag_in(tt,g0+3.6,0.6),light:"morning"});
      ol_tagAt(x,tt,w("gov","access",-0.2),c.gather-0.4,950,650,"Access, or what a word means: to data governance",{align:"center",col:LP.ink});
      ol_tagAt(x,tt,w("gov","from",-0.1),c.gather-0.4,950,728,"From A capability, not a project",{align:"center",col:LP.mut});
      // the one list: sixty-one, then the nine duplicates join their twins, seven leave with thanks, forty-five are left
      const la=ag_in(tt,g0-0.6,0.5);if(la>0.004){let arrived=0;for(let j=0;j<OL_N;j++)if(kOf(fly,j)>=0.999)arrived++;
        const n=Math.round(arrived-9*ag_in(tt,tw0+0.2,1.4)-7*ag_in(tt,th0+0.3,1.2));
        ol_list(x,OL_L3,{fly,from:i=>ol_doorMid(i,OL_DBOX3,4),twin:ag_in(tt,tw0,1.6),thanks:ag_in(tt,th0,1.4),close:ag_in(tt,cl0,1.2),count:n>0?n:null,a:la,light:"morning"});}
      ol_tagAt(x,tt,w("twins","Nine",-0.1),c.thanks-0.4,1330,330,"9 duplicates, each asker told",{align:"right",col:LP.ink});
      ol_tagAt(x,tt,w("thanks","Seven",-0.1),c.left-0.4,1330,430,"7 no longer needed: closed, with thanks",{align:"right",col:LP.green});
      ol_tagAt(x,tt,w("left","tracker",-0.3),null,1330,530,"In the tracker the team already uses",{align:"right",col:LP.ink});}}
  ]);
  ol_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Ordered in the open */
// each request's [opportunity, risk prevented, effort]; its value is the first two together, and its place in the order value ÷ effort
const OL_ANIL={who:"Anil, Faculty of Health",what:"Casual staff, from the one staff list"},OL_ANILV=[2,3,1];
const OL_DASH={who:"A head of school",what:"A new dashboard",why:"No decision named yet",when:"Looked at again: Monday 5 July"},OL_DASHV=[1,1,3];
scene("order",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    // after Jena, Larrey's order: the most dangerously wounded first; those hurt less can wait
    {at:0,place:"olPlan",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      ol_jena(x,{walk:1,order:ag_in(tt,w("rule","most",-0.2),4.0)});
      ol_sheet(x,tt,0.8,120,150,620,{kick:"Larrey's order, after Jena",title:"The most dangerously wounded first",lines:["Without regard to rank or distinction"]},
        {light:null,pin:false,u:ag_in(tt,w("rule","rank",-0.2),0.5)});
      ol_tagAt(x,tt,w("wait","less",-0.2),null,1290,700,"Those hurt less could wait",{align:"center",col:LP.ink});}},
    // the team's list, ordered the same way: Anil's request, then a dashboard asked for three times
    {at:c.weigh-0.3,place:"olRoom",keys:[[0,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const a0=c.weigh+0.3,d0=c.dash-0.1,out=c.board-0.6;
      ol_cardAt(x,tt,a0,out,140,150,760,OL_ANIL,OL_ANILV,{light:"day",
        u:ol_u(tt,[w("weigh","opportunity",-0.2),w("weigh","risk",-0.2),w("effort","effort",-0.2)]),
        val:ag_in(tt,c.value,0.6),score:ag_in(tt,w("effort","puts",-0.2),0.5),hl:1,hlA:ag_io(tt,w("anil","risk",-0.3),c.dash-0.4),
        top:ag_in(tt,w("anil","top",-0.3),0.4),topK:tt-w("anil","top",-0.3)});
      ol_tagAt(x,tt,w("value","value",-0.3),c.loud-0.5,140,680,"Value: the opportunity and the risk prevented",{col:LP.green});
      ol_tagAt(x,tt,w("anil","spreadsheet",-0.2),c.dash-0.5,940,394,"His own copy of staff records",{col:LP.amber});
      ol_cardAt(x,tt,d0,out,1020,150,760,OL_DASH,OL_DASHV,{light:"day",u:ag_in(tt,d0+0.3,1.2),val:ag_in(tt,d0+1.1,0.5),score:ag_in(tt,w("dash","decision",-0.2),0.5),
        wait:ag_in(tt,w("dash","waits",-0.2),0.4),waitK:tt-w("dash","waits",-0.2),why:ol_n(tt,[w("dash","why",-0.2),w("dash","when",-0.1)])});
      ol_tagAt(x,tt,w("dash","three",-0.2),out,1400,816,"Asked for three times",{align:"center",col:LP.amber});
      ol_pillAt(x,tt,w("loud","Never",-0.1),out,520,700,"Never by who asks, or how loudly",{col:LP.ink});}},
    // the list is a board in the tracker, open to anyone; the data council reads it every month
    {at:c.board-0.3,place:"olRoom",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      ol_boardAt(x,ag_in(tt,c.board,0.5),{lanes:1});
      ol_tagAt(x,tt,w("board","anyone",-0.2),null,640,840,"Anyone at the university can see it",{align:"center",col:LP.ink});
      ol_tagAt(x,tt,w("board","council",-0.2),null,1310,840,"The data council reads it every month",{align:"center",col:LP.ink});}}
  ]);
  ol_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Six at once */
scene("six",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    // the team's time, split on purpose; without the split, requests would take it all
    {at:0,place:"olRoom",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const s0=c.split+0.2;
      if(tt>=s0)ol_split(x,260,190,1400,{a:ag_in(tt,s0,0.35),k:tt-s0,light:"day",u:ol_u(tt,[w("split","half",-0.2),w("split","third",-0.2),w("split","rest",-0.2)]),
        flood:ag_in(tt,w("why","take",-0.3),1.4)*(1-ag_in(tt,c.limit-1.4,1.0))});
      ol_tagAt(x,tt,c.why,c.limit-0.8,960,640,"Without the split",{align:"center",col:LP.amber});
      ol_tagAt(x,tt,w("why","nothing",-0.2),c.limit-0.8,960,720,"Nothing on the roadmap moves",{align:"center",col:LP.amber});}},
    // at most six in progress at once: three, two and one; finish, then start
    {at:c.limit-0.3,place:"olRoom",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const cw=OL_SCR[2]/4,wipX=OL_SCR[0]+cw*2.5;
      ol_boardAt(x,ag_in(tt,c.limit,0.5),{lanes:ag_in(tt,w("limit","three",-0.2),0.8),hl:tt>=w("limit","six",-0.2)?"wip":null,pull:ag_in(tt,w("pull","moves",-0.3),1.6)});
      ol_pillAt(x,tt,w("limit","six",-0.1),c.kanban-0.4,wipX,840,"Six at most",{col:LP.blue});
      ol_tagAt(x,tt,w("kanban","limit",-0.2),c.sooner-0.4,700,840,"A limit on work in progress",{align:"center",col:LP.blue});
      ol_tagAt(x,tt,w("kanban","Anderson",-0.3),c.sooner-0.4,1300,840,"Kanban: David J. Anderson, 2010",{align:"center",col:LP.mut});
      ol_tagAt(x,tt,w("sooner","fewer",-0.2),c.pull-0.4,960,840,"Fewer started: each finishes sooner",{align:"center",col:LP.green});
      ol_pillAt(x,tt,w("pull","Finish",-0.1),null,960,840,"Finish, then start",{col:LP.green,icon:"tick"});}}
  ]);
  ol_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. Not now, and when */
const OL_ROOMS={who:"The registrar's office",what:"Rooms' data for the new timetable"},OL_ROOMSV=[3,3,2];
const OL_CLARA={who:"Clara, Planning",what:"A new student forecast model",why:"The timetable's date can't move",when:["Current model refreshed by 27 August","The new one by 29 October"]},OL_CLARAV=[3,1,3];
scene("when",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),gy={light:"grey"};
  ag_shots(ctx,S,t,sc.dur,[
    // the University Council's decision; the rooms' data the registrar's office needs for it, near the top
    {at:0,place:"olJuly",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const r0=w("rooms","registrar's",-0.3);
      ol_sheet(x,tt,0.9,140,160,720,{kick:"Thursday 24 June 2027",title:"The University Council",lines:["The timetable changes from 2028"]},
        {light:"grey",u:ag_in(tt,w("council","timetable",-0.2),0.5)});
      ol_cardAt(x,tt,r0,null,1000,150,760,OL_ROOMS,OL_ROOMSV,{light:"grey",u:ag_in(tt,r0+0.3,1.2),val:ag_in(tt,r0+1.1,0.5),score:ag_in(tt,w("late","goes",-0.3),0.5),
        hl:1,hlA:ag_in(tt,w("late","risk",-0.3),0.4),top:ag_in(tt,w("late","top",-0.3),0.4),topK:tt-w("late","top",-0.3)});
      ol_tagAt(x,tt,w("late","date",-0.2),null,1380,680,"Its date can't move",{align:"center",col:LP.amber});}},
    // Clara's request: the same list, weighed the same way; not now, with a reason and a date
    {at:c.clara-0.3,place:"olJuly",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const k0=w("clara","asks",-0.2);
      lp_person(x,"clara",280,640,1.0,{t:tt,a:ag_in(tt,c.clara+0.2,0.6),light:gy});
      lp_nameTag(x,470,300,"clara",{a:ag_in(tt,w("clara","Clara",-0.1),0.5)});
      ol_cardAt(x,tt,k0,null,1000,150,760,OL_CLARA,OL_CLARAV,{light:"grey",u:ag_in(tt,w("clara","model",0),2.0),val:ag_in(tt,w("clara","model",1.6),0.5),score:ag_in(tt,w("same","weighed",-0.1),0.5),
        wait:ag_in(tt,w("same","not now",-0.2),0.4),waitK:tt-w("same","not now",-0.2),
        why:ol_n(tt,[w("reason","timetable's",-0.2),w("reason","current",-0.2),w("reason","new one",-0.2)])});
      ol_tagAt(x,tt,w("ldp","Saying",-0.1),null,1380,840,"Saying it well: Leading data people",{align:"center",col:LP.mut});}},
    // emergency departments still do this: triage, today
    {at:c.ats-0.3,place:"olJuly",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const s0=c.ats+0.2;
      if(tt>=s0)ol_triage(x,360,150,1200,{a:ag_in(tt,s0,0.35),k:tt-s0,light:"grey",u:ag_in(tt,w("ats","five",-0.2),2.6),src:"The Australasian Triage Scale (ACEM)",srcA:ag_in(tt,w("ats","Australia",-0.1),0.5)});
      ol_pillAt(x,tt,w("never","Not now",-0.1),null,960,800,"Not now always comes with a when",{col:LP.amber,icon:"wait"});}}
  ]);
  ol_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 7. On Monday */
const OL_DO=[["One","Close every side door","Kindly, each with a note",null],["Two","Ask what it's for","Not what to build",LP.blue],
  ["Three","Order it in the open","By value and effort",null],["Four","Protect time","And limit what's in progress",LP.blue],["Five","A reason and a date","And the list open to everyone",LP.amber]];
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),day={light:"day"},b0=c.breath-0.5,e0=c.breath+1.6;
  const DT=[w("close","close",-0.2),w("close","ask",-0.2),c.order-0.1,c.time-0.1,c.tell-0.1];
  ag_shots(ctx,S,t,sc.dur,[
    // back to Larrey: his design, framed on the team's wall; Helena's team does the same with data
    {at:0,place:"olRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      ol_print(x,160,190,560,ag_in(tt,0.8,0.6));
      ol_tagAt(x,tt,1.4,null,440,640,"Larrey's flying ambulance, 1793",{align:"center",col:LP.mut});
      ol_pillAt(x,tt,w("helena","door",-0.2),null,1110,330,"Every request through one door",{col:LP.green,icon:"tick"});
      ol_pillAt(x,tt,w("helena","needed",-0.2),null,1110,440,"The most needed first",{col:LP.green,icon:"tick"});
      lp_person(x,"helena",1600,640,1.0,{t:tt,flip:true,a:ag_in(tt,c.helena-0.6,0.6),light:day});}},
    // what to do on Monday
    {at:c.close-0.3,place:"olRoom",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,b0-0.1,0.5);if(g<=0.004)return;x.save();x.globalAlpha*=g;
      const P=[[140,170],[700,170],[1260,170],[420,520],[980,520]];
      OL_DO.forEach(([k,ti,ln,col],i)=>ol_sheet(x,tt,DT[i],P[i][0],P[i][1],520,{kick:k,title:ti,lines:[ln]},{col,light:"day"}));x.restore();}},
    // the wordless end: the board, its six in progress and its not now, each with a date
    {at:b0,place:"olRoom",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{ol_boardAt(x,ag_in(tt,b0+0.3,0.6),{lanes:1,hl:"wip"});}}
  ]);
  lp_end(ctx,S,t,e0,OL_TITLE,OL_LAST,"Film 4 of 4","Making the case",OL_MOD);
  ol_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["doors","six"]);
