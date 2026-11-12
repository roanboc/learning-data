/* ===== More than a platform: the film's own pictures =====
   Drawn with the module's look (films/data-that-moves/shared/src/): the navy map, glass cards, words in white. This file adds what
   only this film shows: the learning route as the Topics page draws it (one blue line, an amber loop above for sharing and
   protecting, a violet loop below for agents), a phone, a sheet of paper with a count, a meeting table seen from above, a wheel
   with a hub and ten parts, and six plain shapes for what a visitor can do. No people: the film is shapes and words.
   Every top-level name starts with mp_ or MP_. Sizes are in the 1920 x 1080 frame; every word is at least 28 px. */
const mp_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the route's lines keep the Topics page's colours in its dark look; paper is a sheet on the meeting table
const MP={main:MD.flow,share:[255,200,96],agents:[185,162,255],paper:[244,240,230],dark:"rgba(22,28,44,1)",darkSoft:"rgba(64,74,98,1)"};

/* ---------------------------------------------------------------- the route
   The stations, in the order modules/route.json gives them: [x, y, line, the label's lines]. The main line runs level at MP_Y; the
   loops leave it at MP_J1, after the foundations, and join it again at MP_J2, before the last two stations. */
const MP_Y=372,MP_UP=180,MP_DN=540,MP_J1=[620,MP_Y],MP_J2=[1470,MP_Y];
const MP_ST={
  start:[110,MP_Y,"main",["Start"]],
  ea:[300,MP_Y,"main",["Enterprise","architecture"]],gov:[510,MP_Y,"main",["Data","governance"]],
  model:[760,MP_Y,"main",["Data","modelling"]],basics:[960,MP_Y,"main",["Modern","data basics"]],ae:[1160,MP_Y,"main",["Analytics","engineering"]],dq:[1350,MP_Y,"main",["Data","quality"]],
  mdm:[880,MP_UP,"share",["Master and","reference data"]],prot:[1210,MP_UP,"share",["Data protection","and privacy"]],
  agents:[1045,MP_DN,"agents",["AI agents in data work"]],
  dm:[1572,MP_Y,"main",["Data","management"]],lead:[1782,MP_Y,"main",["Leading","data people"]]};
const MP_ORDER=["start","ea","gov","model","basics","ae","dq","mdm","prot","agents","dm","lead"];
// the groups' names on the map: [x, y, words, line, align]
const MP_GROUPS={found:[405,318,"Foundations","main","center"],build:[1055,318,"Build and monitor","main","center"],share:[1045,128,"Share and protect","share","center"],
  agents:[716,598,"Agents","agents","left"],lead:[1677,318,"Lead","main","center"]};
// a loop's path, how far along it each of its stations is (0 to 1), and where its rise from the main line ends
function mp_loop(y,ids){const a=md_curve(MP_J1,[740,y],{n:28}),b=md_curve([1350,y],MP_J2,{n:28}),pts=a.concat([[1045,y]],b),p=mk(pts.map(q=>P(q[0],q[1]))),at_={},rise=mk(a.map(q=>P(q[0],q[1]))).total/p.total;
  for(const id of ids){const x=MP_ST[id][0];let best=0,d=1e9;for(let i=0;i<=400;i++){const q=at(p,i/400);const dd=Math.abs(q.x-x)+Math.abs(q.y-y)*4;if(dd<d){d=dd;best=i/400;}}at_[id]=best;}
  return{pts,u:at_,rise};}
const MP_LOOP={share:mp_loop(MP_UP,["mdm","prot"]),agents:mp_loop(MP_DN,["agents"])};
// a solid line of the route, as far as u (0 to 1), with a soft light under it
function mp_line(ctx,pts,col,a,u){if(a<=0.004||u<=0)return;const q=md_cut(pts,Math.min(1,u)).map(p=>P(p[0],p[1]));ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.lineJoin="round";
  poly(ctx,q);ctx.strokeStyle=rgba(col,0.16);ctx.lineWidth=18;ctx.stroke();poly(ctx,q);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=6;ctx.stroke();ctx.restore();}
// a station: a ring in its line's colour on the night, a core, or a tick once it's done; lit, it glows; num, it carries a goal's number
function mp_station(ctx,id,o){o=o||{};const s=MP_ST[id],x=s[0],y=s[1],col=MP[s[2]],k=o.k==null?1:o.k,a=o.a==null?1:o.a,lit=o.lit||0,done=o.done||0,num=o.num,numA=o.numA||0;if(k<=0.004||a<=0.004)return;
  ctx.save();ctx.globalAlpha*=a*Math.min(1,k*3);ag_about(ctx,x,y,lerp(0.5,1,k));if(lit>0)glow(ctx,x,y,74,col,0.5*lit);
  ctx.beginPath();ctx.arc(x,y,19+3*lit,0,TAU);ctx.fillStyle="rgba(6,11,24,1)";ctx.fill();ctx.lineWidth=5;ctx.strokeStyle=rgba(col,1);ctx.stroke();
  if(done>0){ctx.beginPath();ctx.arc(x,y,27,-Math.PI/2,-Math.PI/2+TAU*Math.min(1,done));ctx.strokeStyle=rgba(MD.pass,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.stroke();}
  const core=1-numA;
  if(done>=1&&core>0){ctx.globalAlpha*=core;ctx.beginPath();ctx.moveTo(x-9,y+1);ctx.lineTo(x-2,y+8);ctx.lineTo(x+10,y-7);ctx.strokeStyle=rgba(MD.pass,1);ctx.lineWidth=4.5;ctx.lineCap="round";ctx.lineJoin="round";ctx.stroke();ctx.globalAlpha/=core;}
  else if(core>0){ctx.beginPath();ctx.arc(x,y,7+2*lit,0,TAU);ctx.fillStyle=rgba(col,core);ctx.fill();}
  ctx.restore();
  if(num&&numA>0.004){ctx.save();ctx.globalAlpha*=a*numA;glow(ctx,x,y,60,MD.ink,0.3);ctx.beginPath();ctx.arc(x,y,24,0,TAU);ctx.fillStyle=rgba(MD.ink,1);ctx.fill();md_T(ctx,String(num),x,y+10,{w:800,size:28,align:"center",color:MP.dark});ctx.restore();}}
// a station's name: under it, in white; two lines for most
function mp_name(ctx,id,a,lit){if(a<=0.004)return;const s=MP_ST[id];s[3].forEach((l,i)=>md_T(ctx,l,s[0],s[1]+(s[2]==="main"?52:50)+i*34,{w:700,size:28,align:"center",col:lit>0?mix(MD.ink,MP[s[2]],0.25*lit):MD.ink,a}));}
function mp_group(ctx,key,a){if(a<=0.004)return;const g=MP_GROUPS[key];md_label(ctx,g[0],g[1],g[2],{align:g[4],col:MP[g[3]],a});}
/* the whole route, or as much of it as st says: st.mainX (how far the main line has come, in x), st.up and st.dn (how far each loop,
   0 to 1), st.on[id] (a station's arrival, 0 to 1), st.lab[id] (its name), st.lit[id], st.done[id], st.grp[key] (a group's name),
   st.num[id] with st.numA (a goal's numbers), st.a (all of it). Anything left out is whole. */
function mp_route(ctx,st){st=st||{};const a=st.a==null?1:st.a;if(a<=0.004)return;const g=(o,k,d)=>o&&o[k]!=null?o[k]:d;
  const mx=st.mainX==null?MP_ST.lead[0]:st.mainX;
  if(mx>MP_ST.start[0])mp_line(ctx,[[MP_ST.start[0],MP_Y],[mx,MP_Y]],MP.main,a,1);
  mp_line(ctx,MP_LOOP.share.pts,MP.share,a,st.up==null?1:st.up);mp_line(ctx,MP_LOOP.agents.pts,MP.agents,a,st.dn==null?1:st.dn);
  for(const key in MP_GROUPS)mp_group(ctx,key,a*g(st.grp,key,1));
  for(const id of MP_ORDER){const k=g(st.on,id,1);mp_station(ctx,id,{k,a,lit:g(st.lit,id,0),done:g(st.done,id,0),num:g(st.num,id,0),numA:st.numA||0});mp_name(ctx,id,a*g(st.lab,id,k>=1?1:0),g(st.lit,id,0));}}

/* ---------------------------------------------------------------- the opening: a phone, a sheet, a table */
// a phone, its screen saying the enrolment went through; k springs it in
function mp_phone(ctx,x,y,w,h,k,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(k,0,0.6)));
  md_card(ctx,x,y,w,h,{r:44,edge:MD.flow,glow:0.7});md_card(ctx,x+16,y+16,w-32,h-32,{r:30,fill:"rgba(8,14,30,0.96)"});
  ctx.fillStyle="rgba(170,200,245,0.4)";rr(ctx,x+w/2-34,y+30,68,8,4);ctx.fill();
  md_T(ctx,"Data Science 101",x+w/2,y+130,{w:700,size:28,align:"center",col:MD.soft});
  const cy=y+h*0.46;glow(ctx,x+w/2,cy,150,MD.pass,0.35);ctx.beginPath();ctx.arc(x+w/2,cy,62,0,TAU);ctx.fillStyle=rgba(MD.pass,1);ctx.fill();md_icon(ctx,"tick",x+w/2,cy,70,MD.navy,{lw:5});
  md_T(ctx,"Enrolment",x+w/2,cy+130,{w:800,size:34,align:"center"});md_T(ctx,"confirmed",x+w/2,cy+172,{w:800,size:34,align:"center"});ctx.restore();}
// a sheet of paper on the table, a little turned: who brought it, its count, and the word the count is of
function mp_sheet(ctx,cx,cy,w,h,rot,words,a,o){o=o||{};if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(cx,cy);ctx.rotate(rot);
  ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=30;ctx.shadowOffsetY=12;rr(ctx,-w/2,-h/2,w,h,10);ctx.fillStyle=rgba(MP.paper,1);ctx.fill();ctx.shadowColor="transparent";ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  if(o.col){ctx.fillStyle=rgba(o.col,1);rr(ctx,-w/2,-h/2,w,12,6);ctx.fill();}
  const big=o.big||132;
  if(words.head)md_T(ctx,words.head,0,-h/2+70,{w:700,size:o.small?28:32,align:"center",color:MP.darkSoft});
  md_T(ctx,words.num,0,(words.head?big*0.36+10:big*0.3-(words.foot?14:0)),{w:800,size:big,align:"center",color:MP.dark});
  if(words.foot)md_T(ctx,words.foot,0,h/2-(o.small?22:44),{w:600,size:o.small?28:34,align:"center",color:MP.darkSoft});ctx.restore();}
// the meeting table, seen from above: a long pane of glass with a soft edge
function mp_table(ctx,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;glow(ctx,960,540,760,MD.flow,0.08);md_card(ctx,330,236,1260,590,{r:80,fill:"rgba(13,22,44,0.94)"});ctx.restore();}

/* ---------------------------------------------------------------- one word, three systems */
// a row inside the platform: the word, as it arrived, and its count
function mp_row(ctx,x,y,w,col,num,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;md_card(ctx,x,y,w,96,{edge:col,glow:0.5,r:14});led(ctx,x+14,y+18,6,60,col);
  md_T(ctx,"enrolled",x+40,y+60,{w:700,size:32});md_T(ctx,num,x+w-28,y+64,{w:800,size:44,align:"right",col});ctx.restore();}
// who reads it: a card with a name, and later the count it repeats
function mp_reader(ctx,x,y,w,title,col,a,num,numCol,since){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;md_card(ctx,x,y,w,96,{edge:col||null,glow:0.6,r:16});
  md_T(ctx,title,x+28,y+60,{w:800,size:32});ctx.restore();
  if(num&&since>0)md_pill(ctx,x+w-76,y+48,num,{col:numCol,size:30,a:a*ag_in(since,0,0.3),k:since});}
// one of the three things that change the answer: an icon in gold, and its words
function mp_thing(ctx,y,icon,words,a,k){if(a<=0.004)return;const w=md_tw(ctx,words,{w:800,size:64}),x0=960-(w+96)/2;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,960,y-20,lerp(0.9,1,ag_spr(k,0,0.6)));
  glow(ctx,x0+32,y-22,70,MD.agreed,0.3);md_icon(ctx,icon,x0+32,y-22,64,MD.agreed,{lw:3.2});md_T(ctx,words,x0+96,y,{w:800,size:64});ctx.restore();}

/* ---------------------------------------------------------------- a wheel, and two other maps
   The wheel is drawn in the film's own hand: a hub and ten parts around it, with no words but the hub's. p draws it (0 to 1). */
function mp_wheel(ctx,cx,cy,R,p,a,hub){if(a<=0.004)return;p=clamp(p,0,1);const r0=R*0.4;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";
  const rim=ag_sine(p/0.6);ctx.strokeStyle=rgba(MD.flow,0.9);ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+TAU*rim);ctx.stroke();
  for(let i=0;i<10;i++){const f=clamp((p-0.3)/0.5*10-i,0,1);if(f<=0)continue;const an=-Math.PI/2+i*TAU/10;ctx.lineWidth=3;ctx.strokeStyle=rgba(MD.flow,0.75);ctx.beginPath();
    ctx.moveTo(cx+Math.cos(an)*r0,cy+Math.sin(an)*r0);ctx.lineTo(cx+Math.cos(an)*lerp(r0,R,f),cy+Math.sin(an)*lerp(r0,R,f));ctx.stroke();}
  const h=clamp(hub==null?ag_sine((p-0.5)/0.4):hub,0,1);
  if(h>0){glow(ctx,cx,cy,r0*2.2,MD.agreed,0.3*h);ctx.beginPath();ctx.arc(cx,cy,r0,0,TAU);ctx.fillStyle="rgba(11,19,38,0.96)";ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=rgba(MD.agreed,h);ctx.stroke();}
  ctx.restore();}
// where the wheel's hub and ten parts sit, as dots: the hub first
function mp_wheelDots(cx,cy,R){const out=[[cx,cy]];for(let i=0;i<10;i++){const an=-Math.PI/2+(i+0.5)*TAU/10;out.push([cx+Math.cos(an)*R*0.7,cy+Math.sin(an)*R*0.7]);}return out;}
// two other maps of the same ground, as outlines with no words: layers, and a grid
function mp_layers(ctx,cx,cy,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(MD.soft,0.9);ctx.lineWidth=3.5;for(let i=0;i<4;i++){rr(ctx,cx-150+i*18,cy-124+i*64,300-i*36,48,10);ctx.stroke();}ctx.restore();}
function mp_grid(ctx,cx,cy,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(MD.soft,0.9);ctx.lineWidth=3.5;for(let r=0;r<3;r++)for(let c=0;c<4;c++){rr(ctx,cx-158+c*80,cy-112+r*78,70,64,8);ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------- what a visitor can do: six plain shapes, none a picture of the screen */
function mp_tool(ctx,kind,x,y,col,k,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.6,1,ag_spr(k,0,0.6)));glow(ctx,x,y,96,col,0.22);
  ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.lineJoin="round";
  const L=p=>{ctx.beginPath();p.forEach((q,i)=>i?ctx.lineTo(x+q[0],y+q[1]):ctx.moveTo(x+q[0],y+q[1]));ctx.stroke();};
  switch(kind){
    case"watch":ctx.beginPath();ctx.arc(x,y,50,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-15,y-24);ctx.lineTo(x+26,y);ctx.lineTo(x-15,y+24);ctx.closePath();ctx.fill();break;
    case"think":rr(ctx,x-56,y-44,112,88,14);ctx.stroke();ctx.fillRect(x-36,y-22,10,44);ctx.fillRect(x-16,y-22,10,44);
      ctx.beginPath();ctx.arc(x+26,y-10,13,Math.PI*1.05,Math.PI*2.45);ctx.lineTo(x+26,y+10);ctx.stroke();ctx.beginPath();ctx.arc(x+26,y+23,3.6,0,TAU);ctx.fill();break;
    case"lab":ctx.beginPath();ctx.arc(x,y+16,54,Math.PI,TAU);ctx.stroke();L([[-54,16],[54,16]]);for(let i=1;i<6;i++){const an=Math.PI+i*Math.PI/6;L([[Math.cos(an)*42,16+Math.sin(an)*42],[Math.cos(an)*52,16+Math.sin(an)*52]]);}
      L([[0,16],[24,-20]]);ctx.beginPath();ctx.arc(x,y+16,7,0,TAU);ctx.fill();break;
    case"call":for(let i=0;i<3;i++){const yy=y-38+i*38;ctx.beginPath();ctx.arc(x-44,yy,11,0,TAU);ctx.stroke();if(i===1){ctx.beginPath();ctx.arc(x-44,yy,5.5,0,TAU);ctx.fill();}L([[-20,yy-y],[52,yy-y]]);}break;
    case"goal":L([[-58,22],[58,22]]);for(const dx of[-44,0,44]){ctx.beginPath();ctx.arc(x+dx,y+22,11,0,TAU);ctx.fillStyle="rgba(6,11,24,1)";ctx.fill();ctx.stroke();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x+dx,y+22,4.5,0,TAU);ctx.fill();}
      L([[44,22],[44,-40]]);ctx.beginPath();ctx.moveTo(x+44,y-40);ctx.lineTo(x+78,y-28);ctx.lineTo(x+44,y-14);ctx.closePath();ctx.fill();break;
    case"search":L([[-58,-26],[-6,-26]]);L([[-58,0],[-22,0]]);L([[-58,26],[-10,26]]);ctx.beginPath();ctx.arc(x+22,y-4,28,0,TAU);ctx.stroke();L([[42,17],[62,38]]);break;}
  ctx.restore();}
function mp_toolName(ctx,x,y,words,a){if(a<=0.004)return;md_T(ctx,words,x,y,{w:700,size:28,align:"center",a});}
