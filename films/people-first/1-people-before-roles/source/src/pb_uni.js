/* ===== People before roles: the university, February 2027 =====
   The film's own pictures for Helena's first week (prefix pb_). The module's kit draws the rooms, the people, the sheets and the things
   in them, and is never changed for this film; what is here is this film's alone:
     pbHelena, pbOffice, pbOfficeLate   Helena's room on her first morning; the team's office, where each of the seven works, by day
                                        and late in the afternoon (one room)
     pbTeam, pbTeamFri                  the team's room, by day and on Friday afternoon (one room)
     pbDesk                             Helena's desk seen from above, the window's light across it
     PB_MARTA, PB_ERIN, PB_TOMAS        the three of the seven the kit doesn't hold, as the module's numbers set them
     PB_SEVEN, PB_X7                    the seven, in the order of the chart's boxes, and where each stands in a row
     pb_chart(ctx, y, o)                the chart of seven boxes, a role in each, one line up from each: on the desk, or pinned to a wall
     pb_list(ctx, o)                    the list of 46 open requests, on the desk: unsorted, then sorted
     pb_week(ctx, x, y, w, o)           Helena's first week: five days, a dot for each conversation, a tick on Friday
     pb_arc(ctx, a, b, dip, u, o)       a pencil line from one point to another, with an arrow's head: who turns to whom
     pb_pencil(ctx, x, y, len, an)      the pencil on the desk
     pb_row(ctx, t, P, o)               people standing side by side, a first name over each
     pb_slivers(ctx)                    the two sheets lying on Helena's desk, seen from the front
     pb_truck(ctx, u)                   a small truck crossing the steel bridge
   Colour keeps the module's meaning: blue plans (the chart, its boxes and its lines), orange data (the list of requests, a count from
   a source), green what is done or kept, amber a risk or something waiting. A person is never a colour: the lines that say who
   turns to whom are pencil, and the dots of the week are ink. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.pbHelena=c=>lp_paintRoom(c,{light:"morning",seed:7});
AG_PLACES.pbOffice=c=>lp_paintRoom(c,{light:"day",seed:23});
AG_PLACES.pbOfficeLate=c=>lp_paintRoom(c,{light:"late",seed:23});
AG_ROOMS.pbOfficeLate="pbOffice";
AG_PLACES.pbTeam=c=>lp_paintRoom(c,{light:"day",seed:31,base:[222,206,190]});
AG_PLACES.pbTeamFri=c=>lp_paintRoom(c,{light:"late",seed:31,base:[222,206,190]});
AG_ROOMS.pbTeamFri="pbTeam";
// the desk from above: four boards of warm timber running across, the window's panes of light falling over them from the right
const PB_DESKSUN={x:560,w:1180,top:-60,h:860,slant:280,seed:9},PB_DESKCOL=[255,232,196];
AG_PLACES.pbDesk=c=>{const k=0.5,w=Math.ceil(W*k),h=Math.ceil(H*k),img=c.createImageData(w,h),d=img.data,B=LP.timber,bw=270;
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const X=i/k,Y=j/k,pl=Math.floor(Y/bw),ly=Y-pl*bw;
    const gr=LP_NZ.fbm(X*0.0026+pl*9.1,Y*0.05+pl*3.7,4)-0.5,fig=LP_NZ.fbm(X*0.0011+pl*5.3,Y*0.011+pl*1.9,3)-0.5;
    let L=(pl%2?5:-4)+gr*20+fig*16;if(ly<2.6)L-=24;else if(ly<5)L-=7;
    const q=(j*w+i)*4;d[q]=B[0]+L;d[q+1]=B[1]+L*0.93;d[q+2]=B[2]+L*0.84;d[q+3]=255;}
  const cv=mkCanvas(w,h);cv.getContext("2d").putImageData(img,0,0);c.save();c.imageSmoothingQuality="high";c.drawImage(cv,0,0,w,h,0,0,W,H);c.restore();
  lp_grain(c,0,0,W,H,2,43);
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.3));g.addColorStop(0.45,rgba(LP.shade,0.1));g.addColorStop(1,rgba(LP.shade,0.02));c.fillStyle=g;c.fillRect(0,0,W,H);
  lp_sun(c,PB_DESKSUN,{a:0.8,col:PB_DESKCOL});
  g=c.createRadialGradient(W*0.55,H*0.45,H*0.4,W*0.55,H*0.45,W*0.8);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.3));c.fillStyle=g;c.fillRect(0,0,W,H);};
// a sheet lying on the desk: no pin, and the same sun on it as on the timber round it
function pb_paper(ctx,x,y,w,h,col){lp_sheet(ctx,x,y,w,h,{col,light:null,pin:false});
  lp_sun(ctx,PB_DESKSUN,{a:0.62,col:PB_DESKCOL,clip:c=>{c.beginPath();c.rect(x,y,w,h);c.clip();}});}

/* ---------------------------------------------------------------- the seven
   Marta, Erin and Tomás as the module's numbers set them (/mnt/project-files/leading-data-people/numbers.md), with keys of this
   film's own; Noor, Sam, Jun and Yusuf are the agent films' (AG_CAST), Helena the kit's. */
const PB_MARTA={name:"Marta Silva",role:"Data analyst",key:"pb-marta",skin:[156,108,80],hair:{style:"coily",c:[40,30,26]},earrings:[214,180,120],top:{kind:"cardigan",c:[168,150,126],inner:[70,66,70]},breath:0.3};
const PB_ERIN={name:"Erin Walsh",role:"Platform engineer",key:"pb-erin",skin:[232,196,170],hair:{style:"bun",c:[132,76,48]},earrings:[214,200,170],top:{kind:"sweater",c:[126,106,96]},breath:0.28};
const PB_TOMAS={name:"Tomás Ortega",role:"Report developer",key:"pb-tomas",skin:[198,150,114],hair:{style:"side",c:[46,36,30],streak:[120,108,100]},beard:[58,46,40],
  top:{kind:"cardigan",c:[112,100,88],inner:[226,222,214]},breath:0.27};
// in the order of the chart's boxes: Jun in the middle, the four who turn to him on either side, and Yusuf and Tomás, who read alike
// at this size, at the two ends
const PB_SEVEN=[
  {id:"yusuf",who:"yusuf",name:"Yusuf",box:["Data","governance","lead"]},
  {id:"noor",who:"noor",name:"Noor",box:["Data","architect"]},
  {id:"marta",who:PB_MARTA,name:"Marta",box:["Data","analyst"]},
  {id:"jun",who:"jun",name:"Jun",box:["Analytics","engineer"]},
  {id:"erin",who:PB_ERIN,name:"Erin",box:["Platform","engineer"]},
  {id:"sam",who:"sam",name:"Sam",box:["Data","platform"]},
  {id:"tomas",who:PB_TOMAS,name:"Tomás",box:["Report","developer"]}];
const PB_X7=[240,480,720,960,1200,1440,1680],PB_JUN=3,PB_TURN=[1,2,4,5];
PB_SEVEN.forEach((p,i)=>{p.ph=i*1.7;});const PB_HELENA_PH=11.9;
// people standing side by side: P [{who, x, flip, a, name, ph (their own moment in a breath, so a person breathes the same from shot
// to shot), lift (0 to 1: the name a little larger and higher, as the score plays it)}], drawn from the right so each one's shadow falls on the wall and not on a neighbour; o.s, o.y (where the neck meets the shoulders), o.light, o.names (0 to 1: the first names over their heads)
function pb_row(ctx,t,P,o){o=o||{};const s=o.s||0.5,y=o.y||830,lt=o.light||{light:"day"},na=o.names==null?1:o.names;
  for(let i=P.length-1;i>=0;i--){const p=P[i],a=p.a==null?1:p.a;if(a<=0.004)continue;lp_person(ctx,p.who,p.x,y,s,{t:t+(p.ph==null?i*1.7:p.ph),flip:!!p.flip,light:lt,a});}
  if(na>0.004)for(const p of P){const a=(p.a==null?1:p.a)*na,l=p.lift||0;if(a>0.004&&p.name)lp_T(ctx,p.name,p.x,y-s*310-22-5*l,{w:800,size:30*(1+0.18*l),align:"center",a});}}

/* ---------------------------------------------------------------- the chart of seven boxes
   A sheet 1720 wide from x 100, its top at y: "Data manager" at the top, a line down to a bar, a line from the bar down to each of
   seven boxes, a role in each. o.wall: pinned to a wall in o.light (else it lies on the desk); o.boxes (0 to 7: how many have come);
   o.roles (0 to 1: the words in them); o.lines (0 to 1: every line up lit); o.hi (a box's number) with o.hiA (0 to 1: that box lit);
   o.up (0 to 1: the lit box's one line up); o.all (0 to 1: every box lit); o.arcs ([0 to 1] x 4: the pencil lines from Noor's, Marta's, Erin's and Sam's boxes to
   Jun's); o.a, o.k. */
const PB_CHART={x:100,w:1720,h:380,bw:210,bh:132};
function pb_chart(ctx,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const G=PB_CHART,x=G.x,nb=o.boxes==null?7:o.boxes,ra=o.roles==null?1:o.roles,by=y+150,bar=y+124,B=LP.blue;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+G.w/2,y+G.h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  if(o.wall)lp_sheet(ctx,x,y,G.w,G.h,{col:B,light:o.light||"day"});else pb_paper(ctx,x,y,G.w,G.h,B);
  lp_T(ctx,"THE DATA TEAM",x+LP_PAD,y+82,{w:800,size:28,ls:3,col:B});
  const top=clamp(nb,0,1);
  if(top>0.004){ctx.save();ctx.globalAlpha*=top;lp_T(ctx,"Data manager",960,y+90,{w:800,size:30,align:"center"});
    ctx.strokeStyle=rgba(B,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(960,y+102);ctx.lineTo(960,bar);ctx.stroke();ctx.restore();}
  // the bar grows out from the middle as the boxes come, and each box hangs from it
  const reach=i=>clamp(nb-[3,2,4,1,5,0,6].indexOf(i),0,1);
  ctx.strokeStyle=rgba(B,1);ctx.lineWidth=3;ctx.lineCap="round";
  for(let i=0;i<7;i++){const r=ag_sine(reach(i)),bx=PB_X7[i];if(r<=0.004)continue;
    ctx.save();ctx.globalAlpha*=r;ctx.beginPath();ctx.moveTo(960,bar);ctx.lineTo(bx,bar);ctx.lineTo(bx,by);ctx.stroke();
    const k=lerp(0.7,1,ag_spr(reach(i),0,0.9));ag_about(ctx,bx,by+G.bh/2,k);
    rr(ctx,bx-G.bw/2,by,G.bw,G.bh,10);ctx.fillStyle="rgba(255,255,255,0.62)";ctx.fill();ctx.strokeStyle=rgba(B,1);ctx.lineWidth=3;ctx.stroke();
    if(ra>0.004){const L=PB_SEVEN[i].box,y0=by+G.bh/2-(L.length*36)/2+28;L.forEach((s,n)=>lp_T(ctx,s,bx,y0+n*36,{w:700,size:28,align:"center",a:ra}));}
    ctx.restore();}
  // every line up lit, where the film says what a chart shows
  const la=o.lines||0;if(la>0.004){ctx.save();ctx.globalAlpha*=la;ctx.strokeStyle=rgba(B,1);ctx.lineWidth=7;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(960,y+102);ctx.lineTo(960,bar);
    ctx.moveTo(PB_X7[0],by);ctx.lineTo(PB_X7[0],bar);ctx.lineTo(PB_X7[6],bar);ctx.lineTo(PB_X7[6],by);for(let i=1;i<6;i++){ctx.moveTo(PB_X7[i],bar);ctx.lineTo(PB_X7[i],by);}ctx.stroke();ctx.restore();}
  // every box lit at once (o.all), where the film says what a plan made from the chart is for
  if((o.all||0)>0.004){ctx.save();ctx.globalAlpha*=o.all;ctx.strokeStyle=rgba(B,1);ctx.lineWidth=7;for(let i=0;i<7;i++){rr(ctx,PB_X7[i]-G.bw/2-5,by-5,G.bw+10,G.bh+10,14);ctx.stroke();}ctx.restore();}
  // one box lit, and its one line up
  if(o.hi!=null&&(o.hiA||0)>0.004){const bx=PB_X7[o.hi];ctx.save();ctx.globalAlpha*=o.hiA;ctx.strokeStyle=rgba(B,1);ctx.lineWidth=7;rr(ctx,bx-G.bw/2-5,by-5,G.bw+10,G.bh+10,14);ctx.stroke();ctx.restore();}
  if(o.hi!=null&&(o.up||0)>0.004){const bx=PB_X7[o.hi];ctx.save();ctx.globalAlpha*=o.up;ctx.strokeStyle=rgba(B,1);ctx.lineWidth=7;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx,bar);ctx.lineTo(960,bar);ctx.lineTo(960,y+102);ctx.stroke();ctx.restore();}
  // who turns to whom: pencil, under the boxes
  if(o.arcs)PB_TURN.forEach((i,n)=>{const u=o.arcs[n]||0;if(u<=0.004)return;const left=i<PB_JUN,far=Math.abs(i-PB_JUN)>1;
    pb_arc(ctx,[PB_X7[i]+(left?30:-30),by+G.bh+8],[PB_X7[PB_JUN]+(left?-1:1)*(far?28:70),by+G.bh+10],far?64:38,u,{seed:n});});
  ctx.restore();}
// a pencil line from a to b that dips (or, with a negative dip, rises) on the way, drawn as far as u, an arrow's head at its end
function pb_arc(ctx,a,b,dip,u,o){o=o||{};u=clamp(u,0,1);if(u<=0.004)return;const al=o.a==null?1:o.a,N=44,m=[(a[0]+b[0])/2,(a[1]+b[1])/2+dip*2],P=[],sd=(o.seed||0)*2.1,
    at=v=>{const w=1-v;return[w*w*a[0]+2*w*v*m[0]+v*v*b[0],w*w*a[1]+2*w*v*m[1]+v*v*b[1]];};
  for(let i=0;i<=N;i++){const v=i/N*ag_sine(u),p=at(v);P.push([p[0]+Math.sin(i*1.3+sd)*0.9,p[1]+Math.cos(i*1.9+sd)*0.9]);}
  ctx.save();ctx.globalAlpha*=al;ctx.lineCap="round";ctx.lineJoin="round";
  for(const [dx,lw,aa] of [[0,o.w||3.6,0.9],[0.9,1.4,0.4]]){ctx.strokeStyle=rgba(LP.graphite,aa);ctx.lineWidth=lw;ctx.beginPath();P.forEach((p,i)=>i?ctx.lineTo(p[0]+dx,p[1]+dx):ctx.moveTo(p[0]+dx,p[1]+dx));ctx.stroke();}
  if(u>0.9){const e=at(1),f=at(0.94),an=Math.atan2(e[1]-f[1],e[0]-f[0]),k=clamp((u-0.9)/0.1,0,1),l=15*k;ctx.strokeStyle=rgba(LP.graphite,0.9);ctx.lineWidth=o.w||3.6;ctx.beginPath();
    ctx.moveTo(e[0]-Math.cos(an-0.5)*l,e[1]-Math.sin(an-0.5)*l);ctx.lineTo(e[0],e[1]);ctx.lineTo(e[0]-Math.cos(an+0.5)*l,e[1]-Math.sin(an+0.5)*l);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the list of 46 open requests, and the pencil
   A sheet on the desk, under the chart's right end: the count, and a line for each request, 46 of them. o.num (0 to 1: the count),
   o.u (0 to 1: the lines come), o.sorted (0 to 1: each line goes to its place, longest first), o.a. */
const PB_LIST={x:1160,y:580,w:660,h:290};
const PB_REQ=(()=>{const R=ag_rnd(2027),L=[];for(let i=0;i<46;i++)L.push(34+Math.round(R()*62));const idx=L.map((v,i)=>i).sort((p,q)=>L[q]-L[p]),rank=[];idx.forEach((i,r)=>rank[i]=r);return{L,rank};})();
function pb_list(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const G=PB_LIST,O=LP.orange,nu=o.num==null?1:o.num,u=o.u==null?1:o.u,sd=ag_sine(o.sorted||0);
  ctx.save();ctx.globalAlpha*=a;pb_paper(ctx,G.x,G.y,G.w,G.h,O);
  if(nu>0.004){lp_T(ctx,"46",G.x+LP_PAD,G.y+152,{w:800,size:96,col:O,a:nu});lp_T(ctx,"open requests",G.x+LP_PAD,G.y+200,{w:600,size:28,a:nu});}
  const slot=k=>[G.x+410+(k%2)*112,G.y+40+Math.floor(k/2)*10.4];
  ctx.lineCap="round";ctx.lineWidth=4.6;
  for(let i=0;i<46;i++){const la=clamp(u*46-i,0,1);if(la<=0.004)continue;const p=slot(i),q=slot(PB_REQ.rank[i]),x=lerp(p[0],q[0],sd),y=lerp(p[1],q[1],sd);
    ctx.strokeStyle=rgba(O,0.82*la);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+PB_REQ.L[i],y);ctx.stroke();}
  ctx.restore();}
// a plain pencil lying on the desk, its point towards (x, y): len long, at an angle an (radians)
function pb_pencil(ctx,x,y,len,an,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const wd=15,body=[84,80,86],wood=[222,194,160];ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(an);
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.35)";ctx.shadowBlur=8;ctx.shadowOffsetX=LP.sdx*0.5;ctx.shadowOffsetY=7;ctx.fillStyle=rgba(body,1);ctx.fillRect(30,-wd/2,len-30,wd);ctx.restore();
  ctx.fillStyle=rgba(ag_lt(body,0.16),1);ctx.fillRect(30,-wd/2,len-30,wd*0.34);ctx.fillStyle=rgba(ag_dk(body,0.25),1);ctx.fillRect(30,wd/2-wd*0.26,len-30,wd*0.26);
  ctx.fillStyle=rgba(wood,1);ctx.beginPath();ctx.moveTo(30,-wd/2);ctx.lineTo(4,-1.6);ctx.lineTo(4,1.6);ctx.lineTo(30,wd/2);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(LP.graphite,1);ctx.beginPath();ctx.moveTo(8,-2.4);ctx.lineTo(0,0);ctx.lineTo(8,2.4);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba([196,192,186],1);ctx.fillRect(len-26,-wd/2,14,wd);ctx.fillStyle=rgba([150,140,134],1);ctx.fillRect(len-12,-wd/2,12,wd);ctx.restore();}

/* ---------------------------------------------------------------- Helena's first week
   A sheet with the five days: a dot for each of the seven conversations (two a day from Monday, the seventh on Thursday), and a tick
   on Friday. o.dots (0 to 7), o.fri (0 to 1), o.light, o.a, o.k. */
function pb_week(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=206,bb={x,y,w,h};if(a<=0.004)return bb;const nd=o.dots==null?7:o.dots,D=["Mon","Tue","Wed","Thu","Fri"],cw=(w-LP_PAD*2)/5;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light||"day"});lp_T(ctx,"HELENA'S FIRST WEEK",x+LP_PAD,y+82,{w:800,size:28,ls:3,col:LP.mut});
  let n=0;D.forEach((d,i)=>{const cx=x+LP_PAD+cw*(i+0.5);lp_T(ctx,d,cx,y+130,{w:700,size:28,align:"center",col:LP.mut});
    const k=i<3?2:i===3?1:0;for(let j=0;j<k;j++,n++){const f=ag_spr(clamp(nd-n,0,1),0,0.9);if(f<=0.004)continue;ctx.fillStyle=rgba(LP.ink,1);ctx.beginPath();ctx.arc(cx+(k===2?(j?16:-16):0),y+164,10*f,0,TAU);ctx.fill();}
    if(i===4&&(o.fri||0)>0.004){ctx.save();ctx.globalAlpha*=o.fri;lp_icon(ctx,"tick",cx,y+164,40,LP.green);ctx.restore();}});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- small things */
// the two sheets on Helena's desk, seen from the front: two pale slips lying on the table's top (lp_table at 150, 814, 840 wide)
function pb_slivers(ctx){for(const [x0,w,col] of [[300,330,LP.blue],[672,190,LP.orange]]){const y0=800,y1=768,sk=20;
    ctx.fillStyle="rgba(52,36,30,0.18)";ctx.beginPath();ctx.moveTo(x0-5,y0+3);ctx.lineTo(x0+w-3,y0+3);ctx.lineTo(x0+w+sk-3,y1+3);ctx.lineTo(x0+sk-5,y1+3);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(LP.paper,1);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0+w,y0);ctx.lineTo(x0+w+sk,y1);ctx.lineTo(x0+sk,y1);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0+sk,y1+1);ctx.lineTo(x0+w+sk,y1+1);ctx.stroke();}}
// a small truck on the steel bridge, far up the gorge: u from 0 (the left end) to 1
function pb_truck(ctx,u,o){o=o||{};if(u<=0||u>=1)return;const a=(o.a==null?1:o.a)*clamp(u/0.05,0,1)*clamp((1-u)/0.05,0,1),x=lerp(748,1136,u),y=336.4;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle="rgb(176,166,152)";ctx.fillRect(x-9,y-8.2,12,7);ctx.fillStyle="rgb(112,104,100)";ctx.fillRect(x+3.6,y-6.4,5,5.2);
  ctx.fillStyle="rgb(46,42,44)";for(const dx of [-6,5.4]){ctx.beginPath();ctx.arc(x+dx,y-0.8,1.5,0,TAU);ctx.fill();}ctx.restore();}
