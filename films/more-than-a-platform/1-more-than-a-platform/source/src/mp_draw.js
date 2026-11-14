/* ===== More than a platform: the film's own pictures =====
   Drawn with the module's look (films/data-that-moves/shared/src/): the navy map, glass cards, words in white. This file adds what
   only this film shows: the learning route as the Topics page draws it (one blue line, an amber loop above for sharing and
   protecting, a violet loop below for agents), an empty place the platform leaves (one of four things it can't do alone), a card
   of code and a card of boxes (the two halves courses give), a role on a timeline, a folder and the project's tree, a wheel with a
   hub and ten parts, diagrams that look only at themselves, and plain shapes for what a visitor can do. No people: the film is shapes and words.
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

/* ---------------------------------------------------------------- what a platform can't do alone
   One of four places around the platform: dashed and empty until it's named, then its words in white on a gold edge. */
function mp_place(ctx,x,y,w,words,a,fill){if(a<=0.004)return;const h=104;ctx.save();ctx.globalAlpha*=a;
  if(fill<1)md_card(ctx,x,y,w,h,{dash:true,edge:MD.dim,r:20});
  if(fill>0){ctx.save();ctx.globalAlpha*=fill;md_card(ctx,x,y,w,h,{edge:MD.agreed,glow:0.6,r:20});md_T(ctx,words,x+w/2,y+h/2+11,{w:700,size:32,align:"center"});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the two halves
   A card of code with nothing around it, and a card of boxes and arrows with no code under them. */
const MP_CODE=["select learner_id,","  sum(credit_points)","from core_credit","group by learner_id"];
function mp_codeCard(ctx,x,y,w,h,a,k){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.85,1,ag_spr(k,0,0.6)));
  md_card(ctx,x,y,w,h,{r:18});md_label(ctx,x+32,y+56,"Too technical",{col:MD.wait});
  MP_CODE.forEach((l,i)=>md_T(ctx,l,x+32,y+124+i*44,{w:500,size:28,f:"mono",col:i===0||i===2?MD.flow:MD.ink}));ctx.restore();}
function mp_boxCard(ctx,x,y,w,h,a,k){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.85,1,ag_spr(k,0,0.6)));
  md_card(ctx,x,y,w,h,{r:18});md_label(ctx,x+32,y+56,"Too neutral",{col:MD.wait});
  const bx=[[x+48,y+110],[x+w/2-70,y+190],[x+w-188,y+110]];ctx.strokeStyle=rgba(MD.soft,0.9);ctx.lineWidth=3;
  for(const [bx_,by_] of bx){rr(ctx,bx_,by_,140,70,12);ctx.stroke();}
  const ar=(a_,b_)=>{ctx.beginPath();ctx.moveTo(a_[0],a_[1]);ctx.lineTo(b_[0],b_[1]);ctx.stroke();const an=Math.atan2(b_[1]-a_[1],b_[0]-a_[0]);ctx.beginPath();ctx.moveTo(b_[0],b_[1]);ctx.lineTo(b_[0]-14*Math.cos(an-0.45),b_[1]-14*Math.sin(an-0.45));ctx.lineTo(b_[0]-14*Math.cos(an+0.45),b_[1]-14*Math.sin(an+0.45));ctx.closePath();ctx.fillStyle=rgba(MD.soft,0.9);ctx.fill();};
  ar([bx[0][0]+140,bx[0][1]+52],[bx[1][0]-4,bx[1][1]+24]);ar([bx[1][0]+144,bx[1][1]+24],[bx[2][0],bx[2][1]+52]);ctx.restore();}
// a role on the timeline: a card with the role's name, and a dot on the line 270 px under its top
function mp_role(ctx,x,y,w,words,a,k){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+w/2,y+50,lerp(0.8,1,ag_spr(k,0,0.6)));
  md_card(ctx,x,y,w,100,{edge:MD.flow,glow:0.5,r:18});md_T(ctx,words,x+w/2,y+61,{w:800,size:32,align:"center"});
  ctx.strokeStyle=rgba(MD.flow,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w/2,y+100);ctx.lineTo(x+w/2,y+258);ctx.stroke();ctx.beginPath();ctx.arc(x+w/2,y+270,12,0,TAU);ctx.fillStyle=rgba(MD.flow,1);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the example project
   A folder with a branch mark, as the route on the site shows the project: on the route it is a small badge; opened, it is the tree. */
function mp_folder(ctx,x,y,s,col,a){if(a<=0.004)return;const u=s/48;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(u,u);
  ctx.beginPath();ctx.moveTo(-22,-14);ctx.lineTo(-8,-14);ctx.lineTo(-3,-9);ctx.lineTo(22,-9);ctx.lineTo(22,16);ctx.lineTo(-22,16);ctx.closePath();
  ctx.fillStyle="rgba(7,12,26,0.96)";ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3.4;ctx.lineJoin="round";ctx.stroke();
  // the branch mark: two dots joined, and a third off the line
  ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(-8,10);ctx.lineTo(-8,-2);ctx.moveTo(-8,4);ctx.quadraticCurveTo(6,4,8,-2);ctx.stroke();
  for(const [px,py] of [[-8,10],[-8,-3],[8,-3]]){ctx.beginPath();ctx.arc(px,py,3,0,TAU);ctx.fillStyle=rgba(col,1);ctx.fill();}ctx.restore();}
// the badge on the route, beside Analytics engineering: a dark disc with the folder in it
function mp_badge(ctx,x,y,a,k){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.5,1,ag_spr(k,0,0.6)));glow(ctx,x,y,40,MD.agreed,0.4);
  ctx.beginPath();ctx.arc(x,y,20,0,TAU);ctx.fillStyle="rgba(7,12,26,1)";ctx.fill();ctx.strokeStyle=rgba(MD.agreed,1);ctx.lineWidth=2.6;ctx.stroke();mp_folder(ctx,x,y+1,26,MD.agreed,1);ctx.restore();}
// the project's tree: [name, depth, kind] rows; kind "code" or "gov" or "doc"; lit(i) is how much row i glows, band(i) its highlighter
const MP_TREE=[["models/",0,"code"],["tests/",0,"code"],["sources/",0,"code"],["governance/",0,"gov"],["1-glossary/",1,"gov"],["2-owners/",1,"gov"],
  ["3-architecture-map/",1,"gov"],["4-data-products/",1,"gov"],["5-data-contracts/",1,"gov"],["docs/decisions.md",0,"doc"]];
function mp_tree(ctx,x,y,rh,a,lit,band){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  MP_TREE.forEach((r,i)=>{const yy=y+i*rh,xx=x+r[1]*44,b=band(i),l=lit(i);
    if(b>0.004){ctx.fillStyle=rgba(MD.agreed,0.2*b);rr(ctx,xx-10,yy-rh/2+4,lerp(0,md_tw(ctx,r[0],{w:500,size:28,f:"mono"})+76,b),rh-8,8);ctx.fill();}
    if(r[1]){ctx.strokeStyle="rgba(170,200,245,0.25)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(xx-28,yy-rh/2);ctx.lineTo(xx-28,yy);ctx.lineTo(xx-12,yy);ctx.stroke();}
    const col=r[2]==="code"?MD.flow:r[2]==="gov"?MD.agreed:MD.soft;
    if(r[2]==="doc")md_icon(ctx,"doc",xx+16,yy,30,mix(MD.soft,MD.agreed,b));else mp_folder(ctx,xx+16,yy,30,mix(col,MD.ink,0.15*l),1);
    md_T(ctx,r[0],xx+46,yy+10,{w:500,size:28,f:"mono",col:mix(MD.ink,col,0.35*Math.max(l,b))});});ctx.restore();}
// one of three neutral blocks: what a tool does, not which tool
function mp_cap(ctx,x,y,w,icon,words,a,k){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+w/2,y+70,lerp(0.8,1,ag_spr(k,0,0.6)));
  md_card(ctx,x,y,w,140,{edge:MD.flow,glow:0.5,r:20});md_icon(ctx,icon,x+w/2,y+48,44,MD.flow);md_T(ctx,words,x+w/2,y+112,{w:700,size:32,align:"center"});ctx.restore();}

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

/* ---------------------------------------------------------------- diagrams that look only at themselves
   A small outline, turned inward: a circle, a grid, a triangle or a stack, with a short arrow that points back at itself. */
function mp_inward(ctx,kind,x,y,col,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.lineJoin="round";
  if(kind===0){ctx.beginPath();ctx.arc(x,y,34,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(x,y,14,0,TAU);ctx.stroke();}
  else if(kind===1){for(let r=0;r<2;r++)for(let q=0;q<2;q++){rr(ctx,x-30+q*32,y-30+r*32,28,28,5);ctx.stroke();}}
  else if(kind===2){ctx.beginPath();ctx.moveTo(x,y-34);ctx.lineTo(x+34,y+26);ctx.lineTo(x-34,y+26);ctx.closePath();ctx.stroke();}
  else{for(let i=0;i<3;i++){rr(ctx,x-34+i*6,y-28+i*20,68-i*12,16,5);ctx.stroke();}}
  ctx.beginPath();ctx.arc(x,y,48,-0.6,0.9);ctx.stroke();const an=0.9;ctx.beginPath();ctx.moveTo(x+48*Math.cos(an),y+48*Math.sin(an));ctx.lineTo(x+48*Math.cos(an)+9,y+48*Math.sin(an)-12);ctx.stroke();
  ctx.restore();}

/* ---------------------------------------------------------------- what a visitor can do : six plain shapes, none a picture of the screen */
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
