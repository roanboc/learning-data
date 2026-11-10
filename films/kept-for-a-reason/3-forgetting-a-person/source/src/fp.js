/* ===== Forgetting a person: the film's own people, places and pictures =====
   Drawn with the module's kit, Night glass (films/locks-before-the-data/shared/: glass.js, hall.js, night.js), never changed for this
   film: every name here starts with fp_ or FP_. Sizes are in the 1920 x 1080 frame; every word is drawn with dp_T, at least 28 px as
   seen, on glass or on the dark, and nothing but the captions goes below y 890.
   The opening, Spain from 1998 to 2014, is drawn at night: a print room under a lamp, the web as a dark hall of its own, two lit
   windows, a public building, a court's portico. Its newspaper and its search engine are never named or shown; Mario Costeja
   González is never drawn, and his name is seen only as it's typed into a search box. The university is the module's hall. */

const FP_TITLE="Forgetting a person",FP_LINE="FILM 3 OF 5 · KEPT FOR A REASON",FP_SERIES="Kept for a reason";

/* ---------------------------------------------------------------- the film's people
   Linh Nguyen and Ingrid Holm are the module's cast ("linh", "ingrid" in night.js), drawn as Modern data basics draws them; Mei Tanaka
   is the agent films' ("mei"). The opening's two people, who look him up in 2009, are invented: a client at her desk and a neighbour
   at his door, lit by a lamp at night. */
const FP_CLIENT={name:"A client, 2009",role:"",skin:[214,170,136],hair:{style:"bob",c:[70,46,34]},earrings:[220,200,160],top:{kind:"blazer",c:[66,72,80],inner:[230,226,220]},breath:0.27};
const FP_NEIGH={name:"A neighbour, 2009",role:"",skin:[222,182,152],hair:{style:"cropped",c:[156,150,144]},glasses:[60,56,52],top:{kind:"cardigan",c:[112,100,86],inner:[226,222,212]},breath:0.25};
DP_PEOPLE.push([FP_CLIENT,"lamp"],[FP_NEIGH,"lamp"],"linh");

/* ---------------------------------------------------------------- small helpers */
// made once per chapter, the first time it draws: its cues are known by then
const fp_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the film's time where a chapter starts, so people breathe and blink on across chapters
const fp_g0=sc=>{let s=0;for(const x of SCENES){if(x.id===sc.id)return s;s+=x.dur;}return s;};
// in at t0 (and out at t1), over d seconds
const fp_a=(t,t0,t1,d)=>t1==null?ag_in(t,t0,d||0.45):ag_io(t,t0,t1,d||0.45);
// a rise as something comes in: 18 px below its place to its place, eased, with its opacity
const fp_rise=(t,t0,d)=>18*(1-ag_eo(clamp((t-t0)/(d||0.6),0,1)));
// light laid on what is drawn: a warm lamp or a cool screen
function fp_light(c,x,y,r,col,a){if(!(a>0))return;c.save();c.globalCompositeOperation="lighter";const g=c.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);c.restore();}
// the place-and-year tag at the top left, under the opening's kicker: the latest of [[t, words], ...] passed, crossing over 0.6 s
function fp_tags(ctx,S,t,list,o){o=o||{};let i=-1;for(let k=0;k<list.length;k++)if(t>=list[k][0])i=k;if(i<0)return;setScreen(ctx,S);
  const top=o.top||"Opening story",a=o.a==null?1:o.a;
  const u=ag_in(t,list[i][0],0.6),prev=i>0?list[i-1][1]:null,cur=list[i][1];
  const k0=i===0?u:1;if(k0<=0.01)return;
  withA(ctx,a*k0,()=>{dp_T(ctx,String(top).toUpperCase(),72,98,{w:700,size:28,ls:4,col:"cyan"});
    const w=Math.max(dp_tw(ctx,String(top).toUpperCase(),{w:700,size:28,ls:4}),360),c=DP.F.cyan,g=ctx.createLinearGradient(72,0,72+w,0);
    g.addColorStop(0,rgba(c,1));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.fillRect(72,114,w,2.4);});
  if(prev&&i>0&&u<1)withA(ctx,a*(1-u),()=>dp_T(ctx,prev,72,168,{w:700,size:40}));
  if(cur)withA(ctx,a*(i>0?u:k0),()=>dp_T(ctx,cur,72,168,{w:700,size:40}));}

/* ---------------------------------------------------------------- the opening's places, painted once
   fpPress: the newspaper's print room in Barcelona, 1998, at night: a press in the dark on the left, a lamp over a board where the
   day's page hangs to be checked, a table of folded papers on the right. No landmark, nothing of the city. */
const FP_PAGE=[720,262,340,440];   // the 1998 page on its board, in fpPress: x, y, w, h
const FP_LAMP=[890,96];
function fp_paintPress(c){
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(10,15,17)");g.addColorStop(0.6,"rgb(22,26,27)");g.addColorStop(0.605,"rgb(26,27,27)");g.addColorStop(1,"rgb(11,12,13)");
  c.fillStyle=g;c.fillRect(0,0,W,H);
  // the wall's seams and the floor's boards, faint
  c.strokeStyle="rgba(255,236,214,0.035)";c.lineWidth=2;for(let x=40;x<W;x+=190){c.beginPath();c.moveTo(x,0);c.lineTo(x,650);c.stroke();}
  c.strokeStyle="rgba(255,236,214,0.03)";for(let j=1;j<7;j++){const y=653+Math.pow(j/7,1.6)*427;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  // the lamp's light on the wall and the floor
  fp_light(c,FP_LAMP[0],420,700,[255,204,148],0.16);fp_light(c,FP_LAMP[0],760,560,[255,204,148],0.08);
  // the press, on the left: its frame, three cylinders, the paper roll at its foot and the web of paper running through it
  c.save();
  const frame=[[96,300],[600,300],[640,330],[640,652],[70,652],[70,330]];c.beginPath();frame.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();
  g=c.createLinearGradient(70,300,640,652);g.addColorStop(0,"rgb(40,46,46)");g.addColorStop(1,"rgb(22,26,27)");c.fillStyle=g;c.fill();
  c.strokeStyle="rgba(255,220,180,0.10)";c.lineWidth=2;c.stroke();
  for(const [x,y,r] of [[230,420,82],[420,420,82],[325,560,70]]){const cg=c.createRadialGradient(x-r*0.35,y-r*0.35,r*0.1,x,y,r);cg.addColorStop(0,"rgb(92,96,94)");cg.addColorStop(0.7,"rgb(44,48,48)");cg.addColorStop(1,"rgb(26,28,29)");
    c.fillStyle=cg;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.strokeStyle="rgba(255,226,190,0.16)";c.lineWidth=2;c.beginPath();c.arc(x,y,r-6,Math.PI*1.05,Math.PI*1.6);c.stroke();
    c.fillStyle="rgb(18,20,21)";c.beginPath();c.arc(x,y,r*0.22,0,TAU);c.fill();c.fillStyle="rgba(255,226,190,0.18)";c.beginPath();c.arc(x-3,y-3,r*0.08,0,TAU);c.fill();}
  // the roll of newsprint at its foot, seen end on
  g=c.createRadialGradient(150,590,6,150,600,70);g.addColorStop(0,"rgb(150,140,124)");g.addColorStop(1,"rgb(84,78,70)");c.fillStyle=g;c.beginPath();c.arc(150,600,64,0,TAU);c.fill();
  c.strokeStyle="rgba(40,36,32,0.5)";c.lineWidth=1.4;for(let r=14;r<64;r+=7){c.beginPath();c.arc(150,600,r,0,TAU);c.stroke();}
  c.fillStyle="rgb(40,36,32)";c.beginPath();c.arc(150,600,12,0,TAU);c.fill();
  // the web: from the roll, over the cylinders, out to the table
  c.lineCap="round";c.lineJoin="round";c.strokeStyle="rgb(150,142,128)";c.lineWidth=9;c.beginPath();c.moveTo(150,536);c.bezierCurveTo(170,380,190,338,240,338);
  c.bezierCurveTo(300,338,330,470,330,490);c.bezierCurveTo(340,350,380,338,420,338);c.bezierCurveTo(520,338,560,420,640,470);c.bezierCurveTo(690,500,720,560,740,600);c.stroke();
  c.strokeStyle="rgba(255,236,200,0.18)";c.lineWidth=2;c.stroke();
  c.restore();
  // the table of folded papers, on the right
  c.save();g=c.createLinearGradient(0,708,0,768);g.addColorStop(0,"rgb(58,48,40)");g.addColorStop(1,"rgb(34,28,24)");c.fillStyle=g;
  c.beginPath();c.moveTo(1150,720);c.lineTo(1800,720);c.lineTo(1840,768);c.lineTo(1110,768);c.closePath();c.fill();
  c.fillStyle="rgb(26,22,20)";c.fillRect(1124,768,20,250);c.fillRect(1806,768,20,250);
  for(let s=0;s<4;s++){const x=1200+s*150,hs=[40,58,32,50][s];for(let k=0;k<hs/6;k++){const y=720-k*6;c.fillStyle=k%2?"rgb(176,168,152)":"rgb(150,142,128)";c.fillRect(x+(k%3)*2,y-6,118,6);}}
  fp_light(c,1500,708,360,[255,204,148],0.05);c.restore();
  // the board the page hangs on, under the lamp
  c.save();c.fillStyle="rgb(52,40,32)";rr(c,FP_PAGE[0]-26,FP_PAGE[1]-26,FP_PAGE[2]+52,FP_PAGE[3]+52,8);c.fill();
  c.strokeStyle="rgba(255,220,180,0.14)";c.lineWidth=2;c.stroke();c.fillStyle="rgb(36,28,22)";c.fillRect(FP_PAGE[0]+60,FP_PAGE[1]+FP_PAGE[3]+26,FP_PAGE[2]-120,300);c.restore();
  // the lamp: its cord, its enamel shade, and the bulb's glow under it
  c.save();c.strokeStyle="rgb(20,20,20)";c.lineWidth=3;c.beginPath();c.moveTo(FP_LAMP[0],0);c.lineTo(FP_LAMP[0],FP_LAMP[1]-30);c.stroke();
  c.fillStyle="rgb(40,58,54)";c.beginPath();c.moveTo(FP_LAMP[0]-22,FP_LAMP[1]-34);c.lineTo(FP_LAMP[0]+22,FP_LAMP[1]-34);c.lineTo(FP_LAMP[0]+86,FP_LAMP[1]+18);c.lineTo(FP_LAMP[0]-86,FP_LAMP[1]+18);c.closePath();c.fill();
  c.strokeStyle="rgba(255,226,190,0.22)";c.lineWidth=2;c.stroke();
  fp_light(c,FP_LAMP[0],FP_LAMP[1]+22,150,[255,224,170],0.55);c.fillStyle="rgb(255,236,200)";c.beginPath();c.ellipse(FP_LAMP[0],FP_LAMP[1]+20,40,7,0,0,TAU);c.fill();c.restore();
  // the page itself is drawn live (fp_page), so the camera can come close to it
}
// the web, from 2009 on: a dark hall of its own, its panes far off, a fine grid of points of light
function fp_netGrid(c){c.save();for(let y=60;y<760;y+=48)for(let x=24;x<W;x+=48){const d=Math.hypot(x-960,y-420)/1100;c.fillStyle="rgba(150,225,232,"+(0.07*(1-d)).toFixed(3)+")";c.fillRect(x,y,2,2);}c.restore();}
/* fpWindows: two lit windows in a dark wall at night, 2009: on the left an office where a client works late, on the right an open
   door where a neighbour stands in the light of the hall. The people are drawn live inside them (fp_inWindow). */
const FP_WIN=[[170,190,700,560],[1080,150,560,740]];   // x, y, w, h: the office window, the door
function fp_paintWindows(c){
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(16,18,20)");g.addColorStop(1,"rgb(10,11,12)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the wall's stone courses
  c.strokeStyle="rgba(255,236,214,0.035)";c.lineWidth=2;for(let y=40;y<H;y+=64){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();for(let x=(y/64%2)*90;x<W;x+=180){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+64);c.stroke();}}
  for(const [i,[x,y,w,h]] of FP_WIN.entries()){
    // the room behind, lit warm, darker away from the lamp
    g=c.createRadialGradient(x+w*(i?0.3:0.7),y+h*0.25,20,x+w*0.5,y+h*0.6,Math.max(w,h));g.addColorStop(0,"rgb(96,76,58)");g.addColorStop(1,"rgb(34,28,24)");
    c.fillStyle=g;c.fillRect(x,y,w,h);
    if(i===0){// the office: a shelf of files behind her, and the desk the screen stands on
      c.fillStyle="rgb(58,46,38)";c.fillRect(x+30,y+90,260,14);for(let k=0;k<9;k++){c.fillStyle=["rgb(76,64,54)","rgb(64,58,50)","rgb(86,70,56)"][k%3];c.fillRect(x+38+k*26,y+30,20,60);}
      c.fillStyle="rgb(46,36,30)";c.fillRect(x,y+h-120,w,120);c.fillStyle="rgba(255,220,180,0.10)";c.fillRect(x,y+h-120,w,3);}
    else{// the door: its frame, and the hall's light behind him
      c.fillStyle="rgb(44,36,30)";c.fillRect(x+w-70,y,70,h);c.fillStyle="rgba(255,220,180,0.08)";c.fillRect(x+w-70,y,3,h);}
    // the frame
    c.strokeStyle="rgb(30,26,24)";c.lineWidth=18;c.strokeRect(x-9,y-9,w+18,h+18);c.strokeStyle="rgba(255,220,180,0.12)";c.lineWidth=2;c.strokeRect(x-18,y-18,w+36,h+36);}
  // a sill under the office window, a step under the door
  c.fillStyle="rgb(40,36,34)";c.fillRect(FP_WIN[0][0]-40,FP_WIN[0][1]+FP_WIN[0][3]+9,FP_WIN[0][2]+80,26);
  c.fillStyle="rgb(36,32,30)";c.fillRect(FP_WIN[1][0]-60,FP_WIN[1][1]+FP_WIN[1][3]+9,FP_WIN[1][2]+120,30);
  // the warm light falling out of both onto the street
  fp_light(c,520,800,520,[255,204,148],0.07);fp_light(c,1360,960,520,[255,204,148],0.08);}
// fpAgency: a public building at night, 2010: a wide block of offices, a few windows still lit, glass doors, steps
function fp_paintAgency(c){
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(8,18,24)");g.addColorStop(0.7,"rgb(16,32,38)");g.addColorStop(0.71,"rgb(20,24,26)");g.addColorStop(1,"rgb(10,12,13)");c.fillStyle=g;c.fillRect(0,0,W,H);
  fp_light(c,960,300,900,[104,216,230],0.05);
  const R=ag_rnd(77);
  // the block
  g=c.createLinearGradient(0,210,0,760);g.addColorStop(0,"rgb(52,58,62)");g.addColorStop(1,"rgb(34,38,41)");c.fillStyle=g;c.fillRect(250,210,1420,550);
  c.fillStyle="rgba(255,240,220,0.12)";c.fillRect(250,210,1420,3);c.fillStyle="rgb(40,44,47)";c.fillRect(230,196,1460,20);
  // its windows: four floors of nine, a few lit
  for(let f=0;f<4;f++)for(let k=0;k<9;k++){const x=300+k*152,y=250+f*112,lit=R()<0.22;c.fillStyle=lit?"rgb(214,178,126)":"rgb(24,32,36)";c.fillRect(x,y,104,74);
    if(lit)fp_light(c,x+52,y+37,90,[255,204,148],0.10);else{c.fillStyle="rgba(150,210,220,0.06)";c.fillRect(x,y,104,30);}
    c.fillStyle="rgb(30,34,36)";c.fillRect(x+50,y,4,74);}
  // the entrance: glass doors, lit from inside, under a canopy, and its steps
  c.fillStyle="rgb(28,32,34)";c.fillRect(800,666,320,94);g=c.createLinearGradient(0,672,0,760);g.addColorStop(0,"rgb(196,182,150)");g.addColorStop(1,"rgb(120,110,92)");c.fillStyle=g;c.fillRect(820,676,280,84);
  c.fillStyle="rgb(40,44,46)";for(let k=1;k<4;k++)c.fillRect(820+k*70-2,676,4,84);c.fillStyle="rgb(46,50,52)";c.fillRect(780,650,360,18);
  for(let s=0;s<4;s++){c.fillStyle=s%2?"rgb(30,32,34)":"rgb(36,38,40)";c.fillRect(760-s*24,760+s*16,400+s*48,16);}
  fp_light(c,960,720,300,[255,214,170],0.12);
  // street lamps
  for(const x of [140,1780]){c.fillStyle="rgb(26,28,30)";c.fillRect(x-4,420,8,420);c.fillRect(x-30,420,60,8);fp_light(c,x,430,170,[255,214,170],0.22);}}
// fpCourt: a court's portico at night, 2014: a long beam on six columns, lit from below, wide steps
function fp_paintCourt(c){
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(8,16,22)");g.addColorStop(0.72,"rgb(18,30,36)");g.addColorStop(0.721,"rgb(22,24,26)");g.addColorStop(1,"rgb(10,11,12)");c.fillStyle=g;c.fillRect(0,0,W,H);
  fp_light(c,960,420,900,[104,216,230],0.05);
  // the wall behind the columns, the beam over them (low enough that the place's tag reads on the dark above it)
  c.fillStyle="rgb(30,34,37)";c.fillRect(360,320,1200,450);
  g=c.createLinearGradient(0,236,0,322);g.addColorStop(0,"rgb(150,140,124)");g.addColorStop(1,"rgb(92,86,78)");c.fillStyle=g;c.fillRect(300,236,1320,86);
  c.fillStyle="rgba(255,240,220,0.18)";c.fillRect(300,236,1320,3);c.fillStyle="rgb(60,56,52)";c.fillRect(300,322,1320,10);
  // the columns, lit from below
  for(let k=0;k<6;k++){const x=420+k*216;g=c.createLinearGradient(x-34,0,x+34,0);g.addColorStop(0,"rgb(74,70,64)");g.addColorStop(0.45,"rgb(176,166,148)");g.addColorStop(1,"rgb(70,66,60)");
    c.fillStyle=g;c.fillRect(x-34,332,68,428);c.fillStyle="rgb(110,104,94)";c.fillRect(x-44,332,88,16);c.fillRect(x-44,744,88,16);
    const ug=c.createLinearGradient(0,760,0,460);ug.addColorStop(0,"rgba(255,214,160,0.28)");ug.addColorStop(1,"rgba(255,214,160,0)");c.fillStyle=ug;c.fillRect(x-34,460,68,300);}
  // the steps
  for(let s=0;s<5;s++){c.fillStyle=s%2?"rgb(40,40,40)":"rgb(48,48,47)";c.fillRect(300-s*30,760+s*18,1320+s*60,18);}
  fp_light(c,960,760,700,[255,214,160],0.07);}
AG_PLACES.fpPress=c=>fp_paintPress(c);
AG_PLACES.fpNet=c=>dp_paintHall(c,{seed:31,horizon:820,vx:960,lights:22,panes:5,pools:[[960,1000,760,0.05]],haze:0.06,after:fp_netGrid});
AG_PLACES.fpWindows=c=>fp_paintWindows(c);
AG_PLACES.fpAgency=c=>fp_paintAgency(c);
AG_PLACES.fpCourt=c=>fp_paintCourt(c);
// the university: the module's hall, its lights where this film's people stand
AG_PLACES.fpUni=c=>dp_paintHall(c,{seed:12,horizon:720,vx:960,pools:[[420,990,520,0.10],[1500,990,520,0.08]]});

/* ---------------------------------------------------------------- the opening's pictures */
// the page of 1998: newsprint, columns of type that can't be read (decoration), and the notice, boxed, in the last column; o.hi lights
// the notice; o.lamp how much the lamp warms it. Returns the notice's box [x, y, w, h].
function fp_page(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,m=w/340;if(a<=0)return fp_noticeBox(x,y,w,h);ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=24*m;ctx.shadowOffsetY=8*m;ctx.fillStyle=rgba(o.paper||[214,206,190],1);ctx.fillRect(x,y,w,h);ctx.restore();
  const lg=ctx.createRadialGradient(x+w*0.5,y-h*0.1,0,x+w*0.5,y+h*0.3,h*1.1);lg.addColorStop(0,"rgba(255,236,200,"+(0.16*(o.lamp==null?1:o.lamp)).toFixed(3)+")");lg.addColorStop(1,"rgba(0,0,0,0.20)");ctx.fillStyle=lg;ctx.fillRect(x,y,w,h);
  // the masthead: a dark band and a rule (no name)
  ctx.fillStyle="rgba(28,26,24,0.88)";ctx.fillRect(x+16*m,y+16*m,w-32*m,28*m);ctx.fillRect(x+16*m,y+50*m,w-32*m,2.4*m);
  const R=ag_rnd(1998),cols=4,gx=10*m,cw=(w-32*m-gx*(cols-1))/cols,nb=fp_noticeBox(x,y,w,h);
  for(let i=0;i<cols;i++){const cx=x+16*m+i*(cw+gx);let yy=y+64*m;
    if(i<2&&i===0){ctx.fillStyle="rgba(30,28,26,0.82)";ctx.fillRect(cx,yy,cw*2+gx,11*m);ctx.fillRect(cx,yy+16*m,cw*1.6,11*m);yy+=38*m;}
    if(i===1)yy+=38*m;
    for(;yy<y+h-16*m;yy+=7*m){if(i===3&&yy>nb[1]-8*m&&yy<nb[1]+nb[3]+6*m)continue;const lw=R()<0.12?cw*(0.3+R()*0.5):cw*(0.9+R()*0.1);ctx.fillStyle="rgba(58,54,50,0.55)";ctx.fillRect(cx,yy,lw,2.6*m);}}
  // the notice: a box with a double rule, its own heading, and its lines
  const [bx,by,bw,bh]=nb;ctx.fillStyle="rgba(232,226,212,1)";ctx.fillRect(bx,by,bw,bh);ctx.strokeStyle="rgba(30,28,26,0.85)";ctx.lineWidth=1.6*m;ctx.strokeRect(bx,by,bw,bh);ctx.lineWidth=0.8*m;ctx.strokeRect(bx+3*m,by+3*m,bw-6*m,bh-6*m);
  ctx.fillStyle="rgba(30,28,26,0.85)";ctx.fillRect(bx+12*m,by+12*m,bw-24*m,6*m);for(let yy=by+26*m,k=0;yy<by+bh-10*m;yy+=6*m,k++){ctx.fillStyle="rgba(58,54,50,0.6)";ctx.fillRect(bx+10*m,yy,(bw-20*m)*(k%4===3?0.6:1),2.2*m);}
  if(o.hi>0){ctx.save();ctx.shadowColor=rgba([255,214,160],0.9*o.hi);ctx.shadowBlur=26*m;ctx.strokeStyle=rgba([255,214,160],0.95*o.hi);ctx.lineWidth=3*m;ctx.strokeRect(bx-6*m,by-6*m,bw+12*m,bh+12*m);ctx.restore();}
  ctx.restore();return nb;}
function fp_noticeBox(x,y,w,h){const m=w/340,cw=(w-32*m-30*m)/4;return[x+16*m+3*(cw+10*m),y+h*0.56,cw,h*0.3];}
// a window of the web: frosted glass, a bar along its top with three dots and an address field (no words), and what it shows
function fp_browser(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:18,glowR:34,behind:o.behind});
  ctx.fillStyle="rgba(190,245,245,0.10)";ctx.fillRect(x+2,y+2,w-4,46);ctx.fillStyle="rgba(190,245,245,0.25)";ctx.fillRect(x+2,y+48,w-4,1.4);
  [0,1,2].forEach(i=>{ctx.fillStyle=rgba(DP.T.mut,0.55);ctx.beginPath();ctx.arc(x+28+i*22,y+25,6,0,TAU);ctx.fill();});
  rr(ctx,x+110,y+12,w-140,26,13);ctx.fillStyle="rgba(190,245,245,0.10)";ctx.fill();
  if(o.inside){ctx.save();ctx.beginPath();ctx.rect(x+2,y+50,w-4,h-52);ctx.clip();o.inside(ctx,x,y+50,w,h-50);ctx.restore();}
  ctx.restore();}
// the search box: frosted glass, a magnifier drawn in light, and the words typed so far (u, 0 to 1, of them), with a caret while it
// types; returns its box
function fp_search(ctx,x,y,w,text,u,o){o=o||{};const h=88,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:h/2,glowR:30,behind:o.behind});
  const c=dp_f("cyan");ctx.save();ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=8;ctx.lineWidth=4;ctx.lineCap="round";
  ctx.beginPath();ctx.arc(x+50,y+h/2-5,15,0,TAU);ctx.moveTo(x+61,y+h/2+6);ctx.lineTo(x+73,y+h/2+18);ctx.stroke();ctx.restore();
  const n=Math.round(clamp(u,0,1)*text.length),s=text.slice(0,n);if(s)dp_T(ctx,s,x+98,y+h/2+12,{w:600,size:36});
  if(o.caret&&u<1.02){const cx=x+98+(s?dp_tw(ctx,s,{w:600,size:36}):0)+5;if(u<1||Math.floor((o.t||0)*2.4)%2===0){ctx.fillStyle=rgba(DP.T.ink,0.85);ctx.fillRect(cx,y+h/2-20,3,38);}}
  ctx.restore();return bb;}
// a line of light from a to b, as a link: drawn on by p; cut (0 to 1) breaks it in the middle and lets it fall away in coral
function fp_linkLine(ctx,A,B,p,o){o=o||{};const cut=clamp(o.cut||0,0,1),a=o.a==null?1:o.a;if(p<=0||a<=0)return;ctx.save();ctx.globalAlpha*=a;
  if(cut<=0){dp_link(ctx,A,B,o.col||"cyan",p,{lw:3});ctx.restore();return;}
  const M=[lerp(A[0],B[0],0.5),lerp(A[1],B[1],0.5)],gap=0.08*ag_eo(cut),k=1-ag_in(cut,0.35,0.65);
  const L=[lerp(A[0],B[0],0.5-gap),lerp(A[1],B[1],0.5-gap)],Rr=[lerp(A[0],B[0],0.5+gap),lerp(A[1],B[1],0.5+gap)];
  ctx.globalAlpha*=k;dp_link(ctx,A,L,"coral",1,{lw:3,dot:false});dp_link(ctx,Rr,B,"coral",1,{lw:3,dot:false});
  // the break: a small coral flash where it was cut
  dp_halo(ctx,M[0],M[1],46,"coral",0.5*(1-ag_in(cut,0,0.6)));ctx.restore();}
// a person drawn inside a window of fpWindows, clipped to it; light "lamp"
function fp_inWindow(ctx,i,draw){const [x,y,w,h]=FP_WIN[i];ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();draw(ctx);ctx.restore();}
// a screen on the office desk, its light on her face: what it shows is the notice, as a page in miniature (decoration)
function fp_monitor(ctx,x,y,on){ctx.save();ctx.fillStyle="rgb(24,24,26)";ctx.fillRect(x-8,y+150,16,40);ctx.fillRect(x-60,y+186,120,10);
  rr(ctx,x-130,y,260,160,10);ctx.fillStyle="rgb(20,22,24)";ctx.fill();const g=ctx.createLinearGradient(0,y+10,0,y+150);g.addColorStop(0,"rgb(204,226,230)");g.addColorStop(1,"rgb(160,186,192)");
  ctx.globalAlpha*=on;ctx.fillStyle=g;ctx.fillRect(x-120,y+10,240,140);fp_page(ctx,x-46,y+18,92,124,{lamp:0,paper:[226,232,232]});ctx.restore();}
// a phone held in the neighbour's hand, its back to us: drawn in figure space over his near hand, its screen's light on the edge
// that faces him (u, 0 to 1, how lit it is)
function fp_phone(c,h,u){const [hx,hy]=h.near;c.save();c.translate(hx+4,hy-96);c.rotate(-0.42);rr(c,-26,-62,52,124,10);c.fillStyle="rgb(26,28,31)";c.fill();
  c.strokeStyle="rgba(150,160,170,0.35)";c.lineWidth=2;c.stroke();c.fillStyle="rgba(40,44,48,1)";c.beginPath();c.arc(-12,-46,5,0,TAU);c.fill();
  if(u>0){c.save();c.globalCompositeOperation="lighter";const g=c.createLinearGradient(26,0,60,0);g.addColorStop(0,"rgba(190,226,236,"+(0.45*u).toFixed(3)+")");g.addColorStop(1,"rgba(190,226,236,0)");
    c.fillStyle=g;c.fillRect(26,-62,34,124);c.restore();}
  c.restore();}

/* ---------------------------------------------------------------- the university's pictures */
// a desk in the hall: a slab of dark glass with a lit edge; returns its top's y (where a person behind it is cut)
function fp_desk(ctx,x,y,w,o){o=o||{};const d=o.depth||46,a=o.a==null?1:o.a;if(a<=0)return y;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle="rgb(14,30,34)";ctx.beginPath();ctx.moveTo(x+18,y);ctx.lineTo(x+w-18,y);ctx.lineTo(x+w,y+d);ctx.lineTo(x,y+d);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(190,245,245,0.35)";ctx.fillRect(x+18,y,w-36,2);const g=ctx.createLinearGradient(0,y+d,0,H);g.addColorStop(0,"rgb(10,24,28)");g.addColorStop(1,"rgb(6,16,20)");ctx.fillStyle=g;ctx.fillRect(x,y+d,w,H-y-d);
  ctx.fillStyle="rgba(104,216,230,0.25)";ctx.fillRect(x,y+d,w,1.6);ctx.restore();return y;}
// a laptop on a desk, its screen lit (frosted glass, cyan): the light she writes in
function fp_laptop(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle="rgb(40,50,54)";ctx.beginPath();ctx.moveTo(x-150,y);ctx.lineTo(x+150,y);ctx.lineTo(x+170,y+14);ctx.lineTo(x-170,y+14);ctx.closePath();ctx.fill();
  ctx.save();ctx.translate(x,y);ctx.transform(1,0,o.flip?0.12:-0.12,1,0,0);rr(ctx,-140,-190,280,186,10);ctx.fillStyle="rgb(28,34,38)";ctx.fill();
  const g=ctx.createLinearGradient(0,-180,0,-12);g.addColorStop(0,"rgb(150,214,224)");g.addColorStop(1,"rgb(96,170,184)");ctx.fillStyle=g;ctx.fillRect(-128,-178,256,164);
  ctx.fillStyle="rgba(10,40,48,0.35)";for(let k=0;k<6;k++)ctx.fillRect(-108,-150+k*22,k===0?120:200-(k%3)*40,8);ctx.restore();
  dp_halo(ctx,x,y-100,260,"cyan",0.10);ctx.restore();}
// a map pane: a place where personal data lives, on glass: its name, what keys it under (cyan pills), and its owner; lit (0 to 1)
// when a search finds her there, dim when it doesn't. Returns its box.
function fp_pane(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;const lit=o.lit==null?1:o.lit;
  if(lit>0)dp_halo(ctx,x+w/2,y+h/2,Math.max(w,h)*0.75,o.col||"cyan",0.10*lit);
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:18,glowR:26,glowA:0.4+0.6*lit,behind:o.behind});
  if(lit<1){ctx.fillStyle="rgba(4,14,18,"+(0.42*(1-lit)).toFixed(3)+")";rr(ctx,x+2,y+2,w-4,h-4,16);ctx.fill();}
  dp_T(ctx,o.title,x+22,y+46,{w:700,size:o.titleSize||30,a:0.55+0.45*Math.max(lit,o.dimRead||0)});
  let yy=y+96;(o.pills||[]).forEach(p=>{if(p.a===0)return;dp_pill(ctx,x+22,yy,p.t,p.col||"cyan",{a:(p.a==null?1:p.a)*(0.6+0.4*lit),size:28});yy+=56;});
  (o.lines||[]).forEach(l=>{if(l.a===0)return;dp_T(ctx,l.t,x+22,yy-12,{w:600,size:28,col:l.col||"mut",a:(l.a==null?1:l.a)*(0.6+0.4*lit)});yy+=40;});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- moments: things that come in and go */
// fn(a) draws a thing at opacity a: in at t0, risen 18 px into its place over 0.6 s, and out at t1 (or never); returns what fn does
function fp_up(ctx,t,t0,t1,fn,d){const a=fp_a(t,t0,t1,d);if(a<=0)return null;ctx.save();ctx.translate(0,fp_rise(t,t0));const r=fn(a);ctx.restore();return r;}
// two years on pills, joined by a line of light that draws on (p, 0 to 1); the second comes in as the line reaches it, and o.label under
// the line; x, y: the first pill's left and its words' baseline
function fp_years(ctx,x,y,y0,y1,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||p<=0)return;ctx.save();ctx.globalAlpha*=a;
  const w0=dp_pill(ctx,x,y,y0,"cyan",{size:30}),lx=x+w0+12,rx=lx+(o.gap||110),u=clamp(p,0,1);
  dp_link(ctx,[lx,y-13],[rx,y-13],"cyan",u,{lw:3,dot:false});
  const k=clamp((u-0.85)/0.15,0,1);if(k>0)dp_pill(ctx,rx+12,y,y1,"cyan",{size:30,a:k});
  if(o.label)dp_T(ctx,o.label,(lx+rx)/2,y+60,{w:600,size:28,align:"center",col:"mut",a:clamp((u-0.4)/0.4,0,1)});
  ctx.restore();}
// a decision on a small card: what it's about (its title), and the verdict on a pill in its colour (green allowed, coral denied),
// which comes in by o.pill (0 to 1); returns its box
function fp_verdict(ctx,x,y,w,title,pill,col,o){o=o||{};const a=o.a==null?1:o.a,h=168,bb={x,y,w,h};if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:o.edge||"cyan",r:20,glowR:34,behind:o.behind});dp_T(ctx,title,x+30,y+62,{w:700,size:36});
  const pa=o.pill==null?1:o.pill;if(pa>0)dp_pill(ctx,x+30,y+132,pill,col,{a:pa});ctx.restore();return bb;}
// a small pane with no words, for data scattered in places nobody listed: frosted, faint lines on it; lit (0 to 1) brightens its rim
function fp_ghostPane(ctx,x,y,w,h,lit,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:14,glowR:22,glowA:0.25+0.75*lit,behind:o.behind});
  ctx.fillStyle="rgba(190,245,245,"+(0.10+0.18*lit).toFixed(3)+")";for(let k=0;k<4;k++)ctx.fillRect(x+18,y+26+k*((h-44)/3),(w-36)*(k%2?0.6:0.85),5);
  if(lit<1){ctx.fillStyle="rgba(4,14,18,"+(0.40*(1-lit)).toFixed(3)+")";rr(ctx,x+2,y+2,w-4,h-4,12);ctx.fill();}
  ctx.restore();}
// a place darkened by k, for glass over a bright part of it (the court's columns), so the words on that glass still read
function fp_dim(key,k){return ag_kept("dim:"+key+":"+k,W,H,c=>{c.drawImage(dp_place0(key),0,0,W,H);c.fillStyle="rgba(6,20,26,"+k+")";c.fillRect(0,0,W,H);});}
