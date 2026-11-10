/* ===== The hidden factory: the graduations office =====
   Malia Fonoti's office, drawn for this film in the module's look: the same warm limestone as the bench's wall, a tall window on the
   right, shelves of archive boxes (the enrolment files) at the left, and two desks in pale oak. Malia sits at the left desk, her
   screen angled towards her; her colleague at the right, behind the back of a second screen. People sit behind the desks, cut at
   their back edge (HF_OFF.top), which hides their hanging arms. What a screen shows is drawn on it live, and, to be read, as a page
   standing before the wall (the module's dq_window). Every name here starts with hf_ or HF_.
     hf_offScreen(ctx, u, o)           Malia's screen: u 0 to 1 how much of the spreadsheet shows (rows of cells, no words at this
                                       size: they're decoration); o.ticks (0 to 1, pencil ticks down a column), o.marks (pencil marks
                                       in cells), o.sql (the platform's editor instead), o.a
     HF_MALIA                          Malia as the kit draws her, with the headset she phones graduates on (painted with her head,
                                       inside its picture), so her arms stay down
     hf_colleague                      her colleague, as the film draws them: no name, never a likeness
     hf_office(ctx, t, o)              the people at their desks: o.malia {pose, hold, nod, gaze}, o.col (the colleague, 0 to 1) */

const HF_OFF={top:782,face:830,malia:[520,592,0.96],col:[1590,612,0.86],screen:[[720,470],[1060,500],[1060,740],[720,752]],win:[1640,1900]};
const hf_colleague={key:"hf_colleague",name:"Malia's colleague",skin:[222,184,152],hair:{style:"cropped",c:[60,46,38]},glasses:[50,48,54],top:{kind:"cardigan",c:[120,112,104],inner:[232,230,224]},breath:0.27};
function hf_paintOffice(c){const O=HF_OFF;dq_paintWall(c,{seed:31,sun:0.7});
  // the window in the right of the wall: deep reveals in the stone, pale sky and the light coming in
  const [w0,w1]=O.win;c.fillStyle=rgba([178,164,142],1);c.fillRect(w0-22,90,w1-w0+44,640);
  const g=c.createLinearGradient(0,110,0,700);g.addColorStop(0,"rgb(236,238,234)");g.addColorStop(1,"rgb(250,246,236)");c.fillStyle=g;c.fillRect(w0,110,w1-w0,600);
  c.strokeStyle=rgba([196,184,164],1);c.lineWidth=7;c.strokeRect(w0,110,w1-w0,600);c.lineWidth=5;c.beginPath();c.moveTo((w0+w1)/2,110);c.lineTo((w0+w1)/2,710);c.moveTo(w0,330);c.lineTo(w1,330);c.stroke();
  c.fillStyle="rgba(120,100,76,0.25)";c.fillRect(w0-22,90,22,640);c.fillStyle=rgba([206,194,174],1);c.fillRect(w0-34,724,w1-w0+68,18);
  c.save();c.globalCompositeOperation="lighter";const gb=c.createLinearGradient(w0,0,w0-900,0);gb.addColorStop(0,"rgba(255,240,210,0.12)");gb.addColorStop(1,"rgba(255,240,210,0)");c.fillStyle=gb;
  c.beginPath();c.moveTo(w0,110);c.lineTo(w0,710);c.lineTo(w0-700,O.top);c.lineTo(w0-1000,O.top);c.lineTo(w0-500,110);c.closePath();c.fill();c.restore();
  // the shelves at the left, with the enrolment files' archive boxes, each with a blank paper label
  const shelf=(y,n,seed)=>{const R=ag_rnd(seed);c.fillStyle=rgba([150,118,84],1);c.fillRect(40,y,560,16);c.fillStyle="rgba(40,26,14,0.3)";c.fillRect(40,y+16,560,8);
    let x=60;for(let k=0;k<n;k++){const bw=82+R()*10,bh=140+R()*14,col=mix([176,150,112],[196,174,138],R());ag_soft(c,q=>q.rect(x,y-bh,bw,bh),col,ag_lt(col,0.2),x+bw*0.8,y-bh*0.8,bw,"rgba(60,40,20,0.35)",8,0.4);
      c.fillStyle=rgba([244,238,224],1);c.fillRect(x+16,y-bh+24,bw-32,40);c.strokeStyle="rgba(100,80,60,0.3)";c.lineWidth=1.2;c.strokeRect(x+16,y-bh+24,bw-32,40);
      c.fillStyle="rgba(40,26,14,0.5)";c.beginPath();c.arc(x+bw/2,y-40,9,0,TAU);c.fill();x+=bw+8;}};
  shelf(300,6,3);shelf(560,6,7);
  // the desks: pale oak tops, their fronts darker, the floor's shadow under them
  const desk=(x0,x1)=>{const oak=[196,166,126];c.fillStyle=rgba(ag_dk(oak,0.25),1);c.fillRect(x0+20,O.face,22,1080-O.face);c.fillRect(x1-42,O.face,22,1080-O.face);
    const gd=c.createLinearGradient(x0,0,x1,0);gd.addColorStop(0,rgba(ag_dk(oak,0.08),1));gd.addColorStop(1,rgba(ag_lt(oak,0.12),1));c.fillStyle=gd;c.fillRect(x0,O.top,x1-x0,O.face-O.top);
    c.fillStyle=rgba(ag_dk(oak,0.35),1);c.fillRect(x0,O.face,x1-x0,40);c.fillStyle="rgba(255,248,232,0.4)";c.fillRect(x0,O.top,x1-x0,3);};
  desk(120,1150);desk(1220,1880);
  // the colleague's screen, turned towards them: its back and edge, seen from the side, on a stand
  ag_soft(c,q=>{q.moveTo(1290,500);q.lineTo(1372,520);q.lineTo(1372,742);q.lineTo(1290,752);q.closePath();},[70,72,76],[110,112,118],1360,560,200,"rgba(0,0,0,0.4)",10,0.4);
  c.fillStyle=rgba([40,42,46],1);c.beginPath();c.moveTo(1372,520);c.lineTo(1384,524);c.lineTo(1384,740);c.lineTo(1372,742);c.closePath();c.fill();
  c.fillStyle=rgba([60,62,66],1);c.fillRect(1318,742,30,40);c.fillRect(1290,776,96,10);
  // Malia's screen: its frame and stand; what it shows is drawn live
  const S=O.screen;c.fillStyle=rgba([46,48,52],1);c.beginPath();c.moveTo(S[0][0]-14,S[0][1]-14);c.lineTo(S[1][0]+12,S[1][1]-12);c.lineTo(S[2][0]+12,S[2][1]+12);c.lineTo(S[3][0]-14,S[3][1]+14);c.closePath();c.fill();
  c.fillStyle=rgba([226,228,226],1);c.beginPath();c.moveTo(S[0][0],S[0][1]);for(let k=1;k<4;k++)c.lineTo(S[k][0],S[k][1]);c.closePath();c.fill();
  c.fillStyle=rgba([58,60,64],1);c.fillRect(880,752,40,30);c.fillRect(830,776,140,10);
  // a keyboard and a pad of paper on Malia's desk
  c.fillStyle=rgba([70,72,76],1);c.beginPath();c.moveTo(700,792);c.lineTo(980,792);c.lineTo(1000,818);c.lineTo(690,818);c.closePath();c.fill();
  c.fillStyle=rgba([244,240,230],1);c.fillRect(160,790,170,30);c.fillStyle="rgba(60,50,40,0.25)";c.fillRect(160,818,170,4);
  c.fillStyle=rgba([70,72,76],1);c.beginPath();c.moveTo(1410,792);c.lineTo(1600,792);c.lineTo(1614,816);c.lineTo(1400,816);c.closePath();c.fill();}
AG_PLACES.hfOffice=c=>hf_paintOffice(c);
// Malia's screen, in perspective: a spreadsheet's grid (decoration at this size), pencil ticks and marks, or the platform's editor
function hf_quad(ctx,fn){const S=HF_OFF.screen,a=S[0],b=S[1],d=S[3];ctx.save();ctx.beginPath();ctx.moveTo(S[0][0],S[0][1]);for(let k=1;k<4;k++)ctx.lineTo(S[k][0],S[k][1]);ctx.closePath();ctx.clip();
  // a map from the unit square to the screen: an affine fit is near enough at this angle
  ctx.transform((b[0]-a[0]),(b[1]-a[1]),(d[0]-a[0]),(d[1]-a[1]),a[0],a[1]);fn();ctx.restore();}
function hf_offScreen(ctx,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01||u<=0.001)return;ctx.save();ctx.globalAlpha*=a;hf_quad(ctx,()=>{
  if(o.sql){ctx.fillStyle="rgb(250,250,248)";ctx.fillRect(0,0,1,1);ctx.fillStyle="rgba(120,100,76,0.12)";ctx.fillRect(0,0,1,0.09);
    ctx.fillStyle="rgba(178,62,40,0.85)";ctx.fillRect(0.03,0.025,0.03,0.04);ctx.fillStyle="rgba(60,60,64,0.6)";for(let k=0;k<4;k++)ctx.fillRect(0.06,0.16+k*0.07,0.3+(k%2)*0.2,0.025);
    ctx.fillStyle="rgba(60,60,64,0.12)";ctx.fillRect(0,0.48,1,0.06);for(let k=0;k<6;k++){ctx.fillStyle="rgba(60,60,64,"+(k%2?0.05:0.1)+")";ctx.fillRect(0,0.56+k*0.07,1,0.05);}return;}
  ctx.fillStyle="rgb(252,252,250)";ctx.fillRect(0,0,1,1);ctx.fillStyle="rgba(60,90,70,0.0)";
  const rows=18,cols=5,rh=0.92/rows,cw=[0.08,0.22,0.24,0.24,0.22],show=Math.ceil(rows*u);ctx.fillStyle="rgba(120,110,96,0.16)";ctx.fillRect(0,0,1,0.06);
  for(let r=0;r<show;r++){const y=0.07+r*rh;let x=0;for(let k=0;k<cols;k++){ctx.fillStyle="rgba(70,66,60,"+(k===0?0.18:0.28)+")";ctx.fillRect(x+0.012,y+rh*0.35,cw[k]*(0.45+((r*7+k*3)%5)*0.08),rh*0.3);x+=cw[k];}
    ctx.fillStyle="rgba(120,110,96,0.12)";ctx.fillRect(0,y+rh-0.002,1,0.003);}
  // pencil ticks down the last column, one by one; marks in some cells (corrections)
  const tk=Math.floor(show*(o.ticks||0));ctx.strokeStyle="rgba(76,74,78,0.85)";ctx.lineWidth=0.004;for(let r=0;r<tk;r++){const y=0.07+r*rh+rh*0.5;ctx.beginPath();ctx.moveTo(0.93,y);ctx.lineTo(0.945,y+rh*0.25);ctx.lineTo(0.975,y-rh*0.3);ctx.stroke();}
  for(const [r,k,p] of (o.marks||[])){if(p<=0||r>=show)continue;const y=0.07+r*rh;let x=0;for(let q=0;q<k;q++)x+=cw[q];ctx.strokeStyle="rgba(76,74,78,"+(0.9*clamp(p,0,1))+")";ctx.lineWidth=0.005;
    ctx.beginPath();ctx.ellipse(x+cw[k]*0.35,y+rh*0.5,cw[k]*0.36,rh*0.42,0,0,TAU*clamp(p,0,1));ctx.stroke();}});ctx.restore();}
// Malia's headset: a thin band over her head, an ear pad over her near ear and a short microphone towards her mouth, painted with her
// head (inside its picture: figure x 160 to 440, y 250 to 560), in graphite that means nothing
function hf_headset(c,P){const g=[56,58,62];c.save();c.lineCap="round";c.strokeStyle=rgba(g,1);c.lineWidth=7;c.beginPath();c.moveTo(250,404);c.bezierCurveTo(236,330,262,286,316,282);c.stroke();
  c.strokeStyle=rgba(ag_lt(g,0.4),0.6);c.lineWidth=2;c.beginPath();c.moveTo(246,396);c.bezierCurveTo(234,332,260,292,312,288);c.stroke();
  ag_soft(c,q=>q.ellipse(250,430,20,30,0.1,0,TAU),g,ag_lt(g,0.35),256,416,26,"rgba(0,0,0,0.5)",8,0.5);
  c.strokeStyle=rgba(g,1);c.lineWidth=5;c.beginPath();c.moveTo(262,448);c.bezierCurveTo(286,494,320,504,344,500);c.stroke();
  ag_soft(c,q=>q.ellipse(348,499,8,6,0,0,TAU),g,ag_lt(g,0.4),350,496,8,null);c.restore();}
const HF_MALIA=Object.assign({},DQ_CAST.malia,{key:"hf_maliaHeadset",hat:{paint:hf_headset}});
// the people at their desks
function hf_office(ctx,t,o){o=o||{};const O=HF_OFF,m=o.malia||{},M=O.malia;
  if(o.col!==0)hf_group(ctx,o.col==null?1:o.col,"hfCol",x=>ag_person(x,hf_colleague,O.col[0],O.col[1],O.col[2],{t:t+1.3,flip:true,nod:0.06,gaze:[-3,4],cut:O.top}));
  if(o.maliaA!==0)hf_group(ctx,o.maliaA==null?1:o.maliaA,"hfMalia",x=>dq_person(x,HF_MALIA,M[0],M[1],M[2],Object.assign({t,cut:O.top,gaze:[5,2]},m)));}

/* ---------------------------------------------------------------- the copy, read
   The team's spreadsheet as a page standing before the room (the module's dq_window, with no logo: it's the team's own tool, named by
   what it is), its first rows typed in the mono face. A correction is typed over its cell in graphite, which means nothing; a pencil
   tick at a row's end says it was checked.
     hf_copy(ctx, x, y, w, o)          o.title (the bar's right), o.fix {"row,col": p} (0 to 1: the old words go, the new are typed),
                                       o.ticks (0 to 1: ticks down the rows), o.lit (a row's index: a pale band), o.k, o.a, o.on;
                                       returns {x, y, w, h, row(i): the row's middle y} */
const HF_COPY={cols:[{h:"",w:56},{h:"Given name",w:184},{h:"Family name",w:540},{h:"",w:52}],
  rows:[["1","Sofia","MARTINEZ"],["2","Chloe","Lefevre"],["3","Tom","Ashby"],["4","Eleni","Hatzigeorgiou-Konstantinopoulo"],["5","Aroha","Ngata"]],
  fix:{"0,2":"Martínez","1,1":"Chloé","1,2":"Lefèvre","3,2":"Hatzigeorgiou-Konstantinopoulou"}};
function hf_copy(ctx,x,y,w,o){o=o||{};const C=HF_COPY,rh=56,h=68+18+rh*(C.rows.length+1)+24,bb={x,y,w,h,row:i=>y+86+rh*(i+1)+rh/2};
  dq_window(ctx,x,y,w,h,{product:"Spreadsheet",title:o.title,on:o.on,k:o.k,a:o.a,draw:(c,b)=>{const W_=C.cols.reduce((s,q)=>s+q.w,0),x0=b.x,y0=b.y;
    // the sheet's own grey: its header row and the row numbers' column
    c.fillStyle="rgba(120,110,96,0.1)";c.fillRect(x0,y0,W_,rh);c.fillRect(x0,y0+rh,C.cols[0].w,rh*C.rows.length);
    let cx=x0;C.cols.forEach(q=>{if(q.h)dq_T(c,q.h,cx+14,y0+38,{w:700,size:28,col:DQ.soft});cx+=q.w;});
    if(o.lit!=null){c.fillStyle="rgba(196,172,128,0.26)";c.fillRect(x0+C.cols[0].w,y0+rh*(o.lit+1),W_-C.cols[0].w,rh);}
    C.rows.forEach((r,i)=>{const ry=y0+rh*(i+1);let xx=x0;r.forEach((s,j)=>{if(s==null)return;const q=C.cols[j],fx=C.fix[i+","+j],p=fx&&o.fix?o.fix[i+","+j]||0:0;
        if(j===0){dq_T(c,s,xx+q.w/2,ry+rh/2+10,{w:500,size:28,f:"mono",col:DQ.soft,align:"center"});}
        else{if(p>0){c.fillStyle="rgba(76,74,78,"+(0.08*ag_io(p,0,0.8,0.2))+")";c.fillRect(xx+2,ry+2,q.w-4,rh-4);}
          const oa=1-ag_in(p,0,0.3);if(oa>0)dq_T(c,s,xx+14,ry+rh/2+10,{w:500,size:28,f:"mono",col:DQ.ink,a:oa});
          if(p>0.3){const sub=fx.slice(0,Math.ceil(fx.length*clamp((p-0.3)/0.6,0,1)));dq_T(c,sub,xx+14,ry+rh/2+10,{w:500,size:28,f:"mono",col:HF.pencil});}}
        xx+=q.w;});});
    // the grid's lines
    c.strokeStyle="rgba(110,96,80,0.28)";c.lineWidth=1.2;for(let i=0;i<=C.rows.length+1;i++){c.beginPath();c.moveTo(x0,y0+rh*i);c.lineTo(x0+W_,y0+rh*i);c.stroke();}
    cx=x0;for(let j=0;j<=C.cols.length;j++){c.beginPath();c.moveTo(cx,y0);c.lineTo(cx,y0+rh*(C.rows.length+1));c.stroke();if(j<C.cols.length)cx+=C.cols[j].w;}
    // pencil ticks at the rows' ends, one by one
    const tk=Math.floor(C.rows.length*clamp(o.ticks||0,0,1)+1e-6);c.strokeStyle=rgba(HF.pencil,0.9);c.lineWidth=3.2;c.lineCap="round";c.lineJoin="round";
    for(let i=0;i<tk;i++){const ty=y0+rh*(i+1)+rh/2,tx=x0+W_-26;c.beginPath();c.moveTo(tx-10,ty);c.lineTo(tx-2,ty+9);c.lineTo(tx+14,ty-11);c.stroke();}}});
  return bb;}
