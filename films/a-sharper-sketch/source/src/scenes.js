/* ===== A Sharper Sketch: scenes =====
   The camera stays on the sketch and zooms in. Each chapter asks one question, checks the reference model (TCSI) on tracing paper,
   and changes the sketch: the gap between Genie's number and the census report closes, 131 → 125 → 121 → 119 → 118. */

// builds the boxes of the sketch from a layout: E3(["Student",...], L3, {Student:{sub:"..."}})
function E3(keys,pos,extra,s){const E={};keys.forEach(k=>{if(!pos[k])return;E[k]=Object.assign({x:pos[k][0],y:pos[k][1],name:NAME[k]||k,s:s||1},extra&&extra[k]||{});});return E;}
// moves a layout: shrinks it by k around (960,510) and centres it on (cx,cy)
function lay(pos,k,cx,cy){const o={};Object.keys(pos).forEach(n=>{o[n]=[cx+(pos[n][0]-960)*k,cy+(pos[n][1]-510)*k];});return o;}
const pulse=(t,t0,d)=>t>t0&&t<t0+(d||2.2)?Math.sin(Math.PI*(t-t0)/(d||2.2)):0;
// a short-lived tag: visible from t0 for d seconds
const brief3=(t,t0,d)=>fin(t,t0,0.4)*(1-sstep(t0+(d||3),t0+(d||3)+0.5,t));
function slideIn(t,t0,t1){return (1-ease(clamp((t-t0)/1.2,0,1)))*1900+(t1!=null?ease(clamp((t-t1)/1.1,0,1))*-1900:0);}

// the finished sketch, v2: every box, its line and its pin
const SUB2={Offering:{sub:"census date",subCol:REF},Unit:{sub:"Data Science 101"},Class:{sub:"Tue 9 am tutorial"},Status:{sub:"status · date"},Enrolment:{}};
function sketchV2(ctx,o){o=o||{};const pos=o.pos||L3,s=o.s||1,E=E3(Object.keys(L3),pos,SUB2,s);
  Object.keys(E).forEach(k=>{if(o.pins)Object.assign(E[k],{pin:PINS[k],pinA:o.pinA?o.pinA(k):1,pinP:o.pinP?o.pinP(k):0});if(o.hi)E[k].hi=o.hi(k);if(o.a)E[k].a=o.a(k);if(o.extra&&o.extra[k])Object.assign(E[k],o.extra[k]);});
  return diagram(ctx,E,L3R.map(r=>r.concat([{}])));}

/* ---------- the story: China, 1391, the four columns (the series' pictures: films/model-the-business/shared/src/registers.js) ---------- */
// a person faded as one picture: drawn whole on a spare canvas, then laid on the frame, so no part of them shows through another
let FC_SCR=null;
function fc_faded(ctx,a,fn){if(a<=0.01)return;if(a>=0.995){fn(ctx);return;}const cv=ctx.canvas;if(!FC_SCR||FC_SCR.width!==cv.width||FC_SCR.height!==cv.height)FC_SCR=mkCanvas(cv.width,cv.height);const x=FC_SCR.getContext("2d");
  x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);x.setTransform(ctx.getTransform());fn(x);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(FC_SCR,0,0);ctx.restore();}
// a pill on a point of the land, drawn in the frame at its own size
function fc_pillAt(ctx,S,cam,wx,wy,s,col,a,o){if(a<=0.01)return;const p=toScreen(cam,wx,wy);ctx.save();setScreen(ctx,S);rg_pill(ctx,p.x,p.y,s,col,a,o);ctx.restore();}
// keyframes [time, values...], eased from one to the next
function fc_keys(K,t){if(t<=K[0][0])return K[0].slice(1);for(let i=1;i<K.length;i++){if(t<=K[i][0]){const a=K[i-1],b=K[i],f=easeCam((t-a[0])/((b[0]-a[0])||1));return a.slice(1).map((v,j)=>lerp(v,b[j+1],f));}}return K[K.length-1].slice(1);}
// the rice field at a point of the land, and its middle
const fc_pad=(x,y)=>rg_paddies().find(q=>q.x<=x&&q.x+q.w>=x&&q.y<=y&&q.y+q.h>=y)||rg_paddies()[0];
function fc_mid(q){const P=rg_padPts(q);return[(P[0][0]+P[6][0]+P[7][0]+P[13][0])/4,(P[0][1]+P[13][1])/2];}
function fc_mark(ctx,q,col,a){if(a<=0.01)return;withA(ctx,a,()=>{rg_padPath(ctx,q);ctx.fillStyle=rgba(col,0.24);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;ctx.stroke();});}
// a field, as a register draws it: a plot outlined in ink, with a few strokes in it for its number and its holder's name
function fc_plot(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sd=o.seed||1;
  withA(ctx,a,()=>{ctx.beginPath();for(let k=0;k<6;k++){const an=Math.PI/6+k*Math.PI/3,j=1+(hash(sd*7+k,3)-0.5)*0.3,px=x+Math.cos(an)*r*j,py=y+Math.sin(an)*r*j*0.84;k?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();
    ctx.fillStyle=o.col?rgba(o.col,0.92):rgba(mix([206,204,160],[226,206,160],hash(sd,5)),0.95);ctx.fill();ctx.strokeStyle=rgba(RG_INK,0.85);ctx.lineWidth=Math.max(1.6,r*0.085);ctx.stroke();
    ctx.strokeStyle=rgba(RG_INK,0.42);ctx.lineWidth=Math.max(1.4,r*0.07);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-r*0.2,y-r*0.3);ctx.lineTo(x-r*0.2,y+r*0.3);ctx.moveTo(x+r*0.18,y-r*0.22);ctx.lineTo(x+r*0.18,y+r*0.14);ctx.stroke();});}
/* a household's entry in a register, in four columns written right to left, as the registers were: what it held at the last register
   (i 0), what came in (1), what went out (2), and what it holds now (3). o.n: the fields in each; o.p: how far each column is written
   (0..1); o.hi: how lit each is; o.skip(i, k) leaves a field out (one on its way elsewhere); o.col(i, k) colours one. */
function fc_slot(x,y,w,h,i,k){const cw=w/4,top=y+h*0.2,step=Math.min(cw*0.62,h*0.74/5.4);return[x+w-cw*(i+0.5),top+step*(k+0.5)];}
function fc_entry(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=o.n||[5,1,2,4],cw=w/4,r=Math.min(cw*0.26,h*0.06);
  withA(ctx,a,()=>{ctx.strokeStyle=rgba(RG_INK,0.3);ctx.lineWidth=2;for(let i=1;i<4;i++){const lx=x+w-cw*i;ctx.beginPath();ctx.moveTo(lx,y+h*0.05);ctx.lineTo(lx,y+h*0.95);ctx.stroke();}
    for(let i=0;i<4;i++){const cx=x+w-cw*(i+0.5),p=o.p?o.p[i]:1,hd=fin(p,0,0.25);if(hd<=0)continue;const hl=o.hi?o.hi[i]:0;
      if(hl>0.01){ctx.fillStyle=rgba(o.hiCol||RG_YEL,0.3*hl);ctx.fillRect(cx-cw*0.46,y+h*0.04,cw*0.92,h*0.92);}
      // the column's heading, two short strokes, like a word written at its top
      withA(ctx,hd,()=>{ctx.strokeStyle=rgba(RG_INK,0.8);ctx.lineCap="round";ctx.lineWidth=Math.max(2,cw*0.03);ctx.beginPath();ctx.moveTo(cx-cw*0.06,y+h*0.07);ctx.lineTo(cx-cw*0.06,y+h*0.13);ctx.moveTo(cx+cw*0.06,y+h*0.075);ctx.lineTo(cx+cw*0.06,y+h*0.12);ctx.stroke();});
      for(let k=0;k<n[i];k++){if(o.skip&&o.skip(i,k))continue;const q=clamp(p*(n[i]+1)-k-0.5,0,1);if(q<=0)continue;const[sx,sy]=fc_slot(x,y,w,h,i,k);
        fc_plot(ctx,sx,sy,r*(0.75+0.25*ease(q)),{a:q,seed:i*11+k+(o.seed||0),col:o.col?o.col(i,k):null});}}});}
// one register, open, with an entry across its two pages (o.n, o.p, o.hi...) or one on each (o.L and o.R, each o's own)
function fc_register(ctx,cx,cy,w,h,o){o=o||{};rg_book(ctx,cx,cy,w,h,{col:o.bk||RG_YEL,a:o.a,open:o.open==null?1:o.open,
  left:o.L?(c2,x,y,w2,h2)=>fc_entry(c2,x+w2*0.05,y,w2*0.9,h2,o.L):null,right:o.R?(c2,x,y,w2,h2)=>fc_entry(c2,x+w2*0.05,y,w2*0.9,h2,o.R):null});
  if(o.one&&(o.open==null||o.open>0.95))fc_entry(ctx,cx-w+w*0.04,cy-h/2,2*w-w*0.08,h,o.one);}
// where the k-th field of column i of an entry across a register's two pages sits, in the frame
const fc_oneSlot=(cx,cy,w,h,i,k)=>fc_slot(cx-w+w*0.04,cy-h/2,2*w-w*0.08,h,i,k);
const fc_pageSlot=(cx,cy,w,h,side,i,k)=>{const x0=side<0?cx-w:cx;return fc_slot(x0+w*0.05,cy-h/2,w*0.9,h,i,k);};

/* ---------- 0. Four columns ---------- */
const FC_COLS=["held","came in","went out","holds now"],FC_WRONG=[226,112,92];
scene("cols",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,wd,o)=>wAt(sc,id,wd,o),cW=c("when"),cC=c("change"),cT=c("total"),cH=c("harm"),cN=c("need"),cO=c("cols"),cS=c("sum"),cB=c("back"),cY=c("story"),cD=c("data");
  const cam=camAt([[0,1800,620,0.9],[cW,1800,620,0.9],[cC-0.3,1740,636,1.02],[cC+1.7,1680,660,1.3],[cT-0.3,1680,660,1.3],[cT+1.5,1890,700,1.36],[cH-0.4,1890,700,1.36],[cH+1.6,2240,640,1.55],[cN-0.3,2240,640,1.55],[cN+1.8,1880,610,0.8]],t);
  const dim=0.66*fin(t,cN-0.1,1.3)+0.2*fin(t,cD+0.4,1.4);
  rg_land(ctx,S,cam,t,{dim});setCam(ctx,S,cam);
  const H1=RG_HOUSES[1],H2=RG_HOUSES[2],H3=RG_HOUSES[3],H4=RG_HOUSES[4],H7=RG_HOUSES[7],top=h=>[h[0],h[1]-118*h[2]];
  // the field sold, from the household at the right to the one at the left, and the four that household still holds
  const qS=fc_pad(1690,792),[sx,sy]=fc_mid(qS),px=sx,py=sy,own=[fc_pad(1880,757),fc_pad(2060,792),fc_pad(1830,840),fc_pad(2010,840)];
  const land=1-fin(t,cN+0.4,1.0);
  if(land>0)withA(ctx,land,()=>{
    // the village head brings the register to be made again: the court's yellow book, carried along the road
    const wu=ease(clamp((t-cW-0.2)/8,0,1)),wx=lerp(1080,1400,wu),ws=Math.max(1,Math.round(320/45));
    const hn=rg_fig(ctx,wx,rg_roadY(wx)+4,0.3,{dress:"robe",head:"cap",hold:"book",walk:wu*ws*TAU,a:fin(t,cW-0.4,0.8)*(1-fin(t,cC+1.0,0.8))});
    withA(ctx,fin(t,cW-0.4,0.8)*(1-fin(t,cC+1.0,0.8)),()=>{ctx.fillStyle=rgba(RG_YEL,1);ctx.fillRect(hn[0]-2,hn[1]-26,11,15);glow(ctx,hn[0]+3,hn[1]-18,26,RG_YEL,0.35);});
    // a village changes: a child is born in one house; an old parent is gone from another; a field passes from one to another
    const fam=fin(t,cC+0.6,0.8)*(1-fin(t,cH+0.2,0.8));
    if(fam>0){fc_faded(ctx,fam,c2=>{rg_fig(c2,H1[0]-46,rg_roadY(H1[0]-46)-14,0.3,{head:"wrap",f:1});rg_fig(c2,H1[0]+40,rg_roadY(H1[0]+40)-12,0.29,{dress:"robe",hold:"book",f:-1});});
      const bn=fin(t,w("change","born")-0.2,0.6);if(bn>0){const bx=H1[0]+40-38*0.29,by=rg_roadY(H1[0]+40)-12-188*0.29;glow(ctx,bx,by,40,RG_RIM,0.55*bn*fam);glow(ctx,bx,by,14,[255,240,214],0.8*bn*fam);}
      const gone=fin(t,w("change","die")-0.1,1.6);fc_faded(ctx,fam*(1-gone),c2=>rg_fig(c2,H3[0]-40,rg_roadY(H3[0]-40)-14,0.28,{dress:"robe",head:"cap",f:1,rimA:0.75}));
      if(gone>0&&gone<1)glow(ctx,H3[0]-40,rg_roadY(H3[0]-40)-58,60,RG_RIM,0.3*Math.sin(Math.PI*gone)*fam);}
    // the field sold: from the household at the right to the one at the left
    const fA=fin(t,w("change","fields")-0.2,0.6)*(1-fin(t,cH-0.4,0.6)),mv=fin(t,w("change","sold"),1.2);
    fc_mark(ctx,qS,RG_EARTH,fA);
    if(fA>0&&t<cT+0.2){arrowTo(ctx,sx,sy-6,top(H4)[0]-16,top(H4)[1]+20,RG_EARTH,fA*(1-mv),{bend:-0.22,dash:[10,8],lw:3});arrowTo(ctx,sx,sy-6,top(H2)[0]+16,top(H2)[1]+20,RG_EARTH,fA*(1-fin(t,cT-0.3,0.5)),{bend:0.22,dash:[10,8],lw:3,p:mv});}
    // a new total alone: the household on the right had five fields and has four. Sold, or hidden under another name?
    const oA=fin(t,cT+0.3,0.7)*(1-fin(t,cH-0.4,0.6));if(oA>0)glow(ctx,H4[0],H4[1]-46,120,RG_YEL,0.3*oA);own.forEach((q,i)=>fc_mark(ctx,q,RG_YEL,oA*fin(t,cT+0.3+i*0.15,0.5)));
    const sold=fin(t,w("total","sold")-0.1,0.7)*(1-fin(t,cH-0.4,0.6)),hid=fin(t,w("total","hidden")-0.1,0.7)*(1-fin(t,cH-0.4,0.6));
    arrowTo(ctx,sx,sy-6,top(H2)[0]+16,top(H2)[1]+20,RG_YEL,sold,{bend:0.22,dash:[10,8],lw:3,p:fin(t,w("total","sold")-0.1,1.0)});
    arrowTo(ctx,sx,sy+4,H7[0]-20,top(H7)[1]+10,RG_YEL,hid,{bend:-0.12,dash:[10,8],lw:3,p:fin(t,w("total","hidden")-0.1,1.4)});
    // the hidden field's tax falls on the families who can't hide theirs
    const bA=fin(t,w("harm","falls")-0.2,0.6)*(1-fin(t,cN+0.2,0.8));
    if(bA>0){[RG_HOUSES[6],RG_HOUSES[7],RG_HOUSES[8]].forEach(([hx,hy],k)=>{[0,1,2].forEach(j=>rg_sack(ctx,hx+56+j*24,hy+8-(j===2?26:0),0.5,bA*fin(t,w("harm","falls")+k*0.3+j*0.15,0.4)));});
      const u=ease(clamp((t-w("harm","families")+0.3)/7,0,1)),x=lerp(2290,1990,u);rg_fig(ctx,x,rg_roadY(x)+6,0.3,{a:bA,hold:"pole",full:1,load:1,head:"wrap",f:-1,walk:u*Math.round(300/45)*TAU});}
  });
  // the words of the story, on the land
  fc_pillAt(ctx,S,cam,px,py+46,"sold",RG_EARTH,fin(t,w("change","sold"),0.5)*(1-fin(t,cT-0.3,0.5)));
  fc_pillAt(ctx,S,cam,H4[0],top(H4)[1]-28,"5 fields, now 4",RG_PAPER,fin(t,w("total","total"),0.5)*(1-fin(t,cH-0.4,0.5)));
  fc_pillAt(ctx,S,cam,H4[0],top(H4)[1]-74,"what changed?",RG_YEL,fin(t,w("total","changed"),0.5)*(1-fin(t,cH-0.4,0.5)));
  fc_pillAt(ctx,S,cam,(px+top(H2)[0])/2-40,py-110,"sold?",RG_YEL,fin(t,w("total","sold")+0.4,0.5)*(1-fin(t,cH-0.4,0.5)));
  fc_pillAt(ctx,S,cam,(px+H7[0])/2+60,py+20,"or hidden?",RG_YEL,fin(t,w("total","hidden")+0.6,0.5)*(1-fin(t,cH-0.4,0.5)));
  fc_pillAt(ctx,S,cam,RG_HOUSES[7][0]+70,top(RG_HOUSES[7])[1]-24,"the burden",RG_EARTH,fin(t,w("harm","falls")+0.4,0.5)*(1-fin(t,cN-0.2,0.5)));
  setScreen(ctx,S);
  rg_pill(ctx,960,250,"the registers, made again",RG_YEL,fin(t,w("when","made again"),0.5)*(1-fin(t,cC-0.3,0.5)));
  rg_pill(ctx,960,330,"every ten years",RG_PAPER,fin(t,w("when","every ten years"),0.5)*(1-fin(t,cC-0.3,0.5)));
  yearTag(ctx,96,100,"China, 1391",CLAY,fin(t,cW+0.2,0.6)*(1-fin(t,cN-0.4,0.5)));
  /* the register, its book open: first one household's entry across both pages, then two households, a field going from one to
     the other, then registers checked against the ones before, then the one entry again, every column lit */
  const BX=960,BY=545,PW=400,PH=500,bk=fin(t,cN+0.3,0.8),op=ease(fin(t,cO+0.1,1.1)),dq=fin(t,cD+0.2,0.8);
  const oneA=fin(t,cO+1.0,0.3)*(1-fin(t,cS-0.4,0.35))+fin(t,cY-0.3,0.35),twoA=fin(t,cS+0.05,0.35)*(1-fin(t,cB-0.5,0.35)),bigA=1-fin(t,cB-0.5,0.4)*(1-fin(t,cY-0.6,0.4));
  // the story: each column lit in turn, then all; the number the entry ends on stays lit for the data that follows
  const wd=[w("cols","held"),w("cols","came in"),w("cols","went out"),w("cols","holds now")],
    lit=i=>{if(t<=cY)return 0;const b0=pulse(t,cY+0.4+i*0.55,1.4)*0.9+fin(t,w("story","what changed"),0.6)*0.5;return i===3?Math.max(b0,0.6*dq):b0*(1-dq);};
  if(bk>0)withA(ctx,bk*bigA,()=>{rg_book(ctx,BX,BY+(1-bk)*120,PW,PH,{col:RG_YEL,open:op});
    if(op>0.95){fc_entry(ctx,BX-PW+PW*0.04,BY-PH/2,2*PW-PW*0.08,PH,{a:oneA,n:[5,1,2,4],p:wd.map((x,i)=>t>cY?1:clamp((t-x+0.1)/1.0,0,1)),hi:[0,1,2,3].map(lit),seed:3});
      /* two households: the field is written in the "went out" of the one on the right page, and the same field arrives in the
         "came in" of the one on the left */
      const tr=clamp((t-w("sum","leaves"))/((w("sum","arrives")+0.4)-w("sum","leaves")),0,1),fly=tr>0&&tr<1,go=pulse(t,w("sum","leaves")-0.1,1.2);
      fc_entry(ctx,BX+PW*0.05,BY-PH/2,PW*0.9,PH,{a:twoA,n:[5,0,1,4],seed:7,hi:[0,0,go,0],hiCol:RG_EARTH,col:(i,k)=>i===2?RG_EARTH:null});
      fc_entry(ctx,BX-PW+PW*0.05,BY-PH/2,PW*0.9,PH,{a:twoA,n:[3,1,0,4],seed:9,hi:[0,pulse(t,w("sum","arrives")+0.3,1.2),0,0],hiCol:RG_EARTH,skip:(i,k)=>i===1&&tr<1,col:(i,k)=>i===1?RG_EARTH:null});
      if(fly&&twoA>0){const[ax,ay]=fc_slot(BX+PW*0.05,BY-PH/2,PW*0.9,PH,2,0),[zx,zy]=fc_slot(BX-PW+PW*0.05,BY-PH/2,PW*0.9,PH,1,0),e=ease(tr),fx=lerp(ax,zx,e),fy=lerp(ay,zy,e)-Math.sin(Math.PI*e)*150;
        glow(ctx,fx,fy,50,RG_EARTH,0.4*twoA);fc_plot(ctx,fx,fy,PW*0.9/4*0.26,{a:twoA,seed:7*11+2*11,col:RG_EARTH});}}});
  // the column's names, over the book; as the data line comes, only the one the entry ends on stays
  if(bk>0&&op>0.95)FC_COLS.forEach((s,i)=>{const[cx]=fc_oneSlot(BX,BY,PW,PH,i,0);rg_pill(ctx,cx,247,s,i===3?RG_YEL:RG_PAPER,oneA*bk*bigA*fin(t,wd[i]-0.15,0.4)*(i===3?1:1-0.75*dq),{size:28});});
  rg_pill(ctx,BX-PW/2,247,"3 + 1 − 0 = 4",RG_PAPER,twoA*bk*fin(t,w("sum","add up"),0.5),{size:28});rg_pill(ctx,BX+PW/2,247,"5 + 0 − 1 = 4",RG_PAPER,twoA*bk*fin(t,w("sum","add up")+0.3,0.5),{size:28});
  rg_pill(ctx,BX+PW/2,838,"went out",RG_EARTH,twoA*bk*fin(t,w("sum","leaves"),0.4)*(1-fin(t,cB-0.9,0.4)),{size:28});rg_pill(ctx,BX-PW/2,838,"came in",RG_EARTH,twoA*bk*fin(t,w("sum","arrives"),0.4)*(1-fin(t,cB-0.9,0.4)),{size:28});
  // each register checked against the one before: the old one's "holds now" is the new one's "held"; one that doesn't add up goes back
  const chA=fin(t,cB-0.1,0.5)*(1-fin(t,cY-0.6,0.4));
  if(chA>0)withA(ctx,chA*bk,()=>{const sw=170,sh=230,Y=560,X0=560,X1=1000,sB=w("back","sent"),away=ease(fin(t,sB,1.1)),X2=lerp(1430,1600,away),Y2=lerp(Y,Y+24,away);
    fc_register(ctx,X0,Y,sw,sh,{bk:mix(RG_YEL,[120,100,80],0.35),one:{n:[4,2,1,5],seed:5}});fc_register(ctx,X1,Y,sw,sh,{a:fin(t,cB+0.3,0.5),one:{n:[5,1,2,4],seed:3,hi:[pulse(t,w("back","checked")+0.9,1.6),0,0,0]}});
    const[ox,oy]=fc_oneSlot(X0,Y,sw,sh,3,2),[nx,ny]=fc_oneSlot(X1,Y,sw,sh,0,2),lk=fin(t,w("back","checked")+0.2,1.0);
    arrowTo(ctx,ox,oy-90,nx,ny-90,RG_YEL,lk,{bend:-0.25,dash:[10,8],lw:3,p:lk});
    // a third register whose "holds now" doesn't add up: lit red, then sent back, away to the right
    const wr=fin(t,w("back","doesn't")-0.3,0.5)*(1-fin(t,sB+1.6,0.5));
    if(wr>0)fc_register(ctx,X2,Y2,sw,sh,{a:wr,one:{n:[4,1,1,3],seed:13,hi:[0,0,0,0.5+0.5*fin(t,w("back","doesn't"),0.4)],hiCol:FC_WRONG}});
    yearTag(ctx,X0-120,330,"1381",CLAY,fin(t,cB,0.5));yearTag(ctx,X1-120,330,"1391",CLAY,fin(t,cB+0.3,0.5));
    rg_pill(ctx,(X0+X1)/2,790,"held = what the last one holds",RG_YEL,lk);
    rg_pill(ctx,X2,790,"sent back",FC_WRONG,wr*fin(t,sB,0.5));});
  rg_pill(ctx,960,840,"what changed, and why",RG_YEL,bk*fin(t,w("story","what changed"),0.5)*(1-fin(t,cD,0.5)));
  rg_pill(ctx,960,252,"where did each number come from?",RG_YEL,fin(t,w("need","where"),0.5)*(1-fin(t,cO+0.6,0.5)));
  /* the same need for data: the number the entry ends on says what it counts (its column's name) and on which day (its register's
     year), in the sketch's own colour */
  if(dq>0&&bk>0){const[hx]=fc_oneSlot(BX,BY,PW,PH,3,0),[ox]=fc_oneSlot(BX,BY,PW,PH,0,0),yw=s=>tw(ctx,s,20,500,"mono")+40;
    yearTag(ctx,hx-yw("1391")/2,766,"1391",CLAY,dq*bk);yearTag(ctx,ox-yw("1381")/2,766,"1381",CLAY,0.55*dq*bk);
    const aC=fin(t,w("data","what it counts")-0.1,0.5),aD=fin(t,w("data","which day")-0.1,0.5);
    withA(ctx,aC,()=>tag(ctx,hx,160,"what it counts",SK,{align:"center",size:28}));arrowTo(ctx,hx,184,hx,216,SK,aC,{lw:3,p:aC});
    withA(ctx,aD,()=>tag(ctx,hx,840,"on which day",SK,{align:"center",size:28}));arrowTo(ctx,hx,816,hx,792,SK,aD,{lw:3,p:aD});}
  mtb_title(ctx,S,t,0.15,cW-0.25,"A Sharper Sketch","When a data model needs more precision");
});

/* ---------- 1. The sketch on the map ---------- */
/* the sketch as the film before this one left it, on the university's map: four pins on each box, in the colours that film gives the
   map's four parts (what it's for, who answers for it, where it's written, what it means), and an amber "?" on the two still open: the
   class's meaning and the term's owner (films/model-the-business/1-the-map-behind-the-sketch/source/src/map.js draws the same) */
const FC_PARTS=[[245,206,140],[255,168,138],[150,226,150],[200,172,255]],FC_Q=[255,176,64];
function fc_pinAt(ctx,e,i){const b=entBox(ctx,e),up=b.y<540;return[b.x+(i-1.5)*46,up?b.y-b.h/2-30:b.y+b.h/2+30];}
function fc_pin(ctx,x,y,col,a,q){if(a<=0.01)return;withA(ctx,a,()=>{const r=q?21:15;ctx.fillStyle=q?"rgba(30,18,6,0.95)":rgba(col,1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(q?FC_Q:mix(col,[255,255,255],0.4),1);ctx.lineWidth=2.5;ctx.stroke();if(q){glow(ctx,x,y,46,FC_Q,0.3*q);T(ctx,"?",x,y+10,{w:800,size:28,align:"center",color:rgba(FC_Q,1)});}else glow(ctx,x,y,30,col,0.25);});}
function fc_pins(ctx,E,pins,Q,hi){Object.keys(E).forEach(k=>{const P=pins[k];if(!P)return;const b=entBox(ctx,E[k]),up=b.y<540,edge=up?b.y-b.h/2:b.y+b.h/2;
  [0,1,2,3].forEach(i=>{const v=P[i]||0,q=(Q[k]||{})[i]||0;if(v<=0&&q<=0)return;const[x,y]=fc_pinAt(ctx,E[k],i),g=hi?hi[i]||0:0;
    ctx.save();ctx.strokeStyle=rgba(FC_PARTS[i],0.5*Math.max(v,q));ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,edge);ctx.lineTo(x,y+(up?14:-14));ctx.stroke();ctx.restore();
    if(g>0.01&&v>0)glow(ctx,x,y,60,FC_PARTS[i],0.5*g*v);fc_pin(ctx,x,y,FC_PARTS[i],Math.max(v,q),q);});});}
// what each pin means, in a row under the board; hi lights one
function fc_legend(ctx,y,a,hi){if(a<=0.01)return;const sz=phSz(ctx,28),items=["for","owner","home","meaning"],ws=items.map(s=>tw(ctx,s,sz,600)+52),gap=34,tot=ws.reduce((s,w)=>s+w,0)+gap*3;let x=960-tot/2;
  withA(ctx,a,()=>items.forEach((s,i)=>{const c=FC_PARTS[i],g=hi?hi[i]||0:0;if(g>0.01)glow(ctx,x+15,y,40,c,0.5*g);ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(x+15,y,12,0,TAU);ctx.fill();T(ctx,s,x+38,y+sz*0.36,{w:600,size:sz,color:rgba(mix(SOFT,c,0.5+0.5*g),1)});x+=ws[i]+gap;}));}
scene("drawn",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),w=(id,wd,o)=>wAt(sc,id,wd,o),cR=c("recap"),cM=c("map"),cO=c("over"),cN=c("normal"),B=c("breath");
  const cam=camAt([[0,960,540,1.08],[cR,960,540,1.08],[cO,960,530,1.0],[sc.dur+2,960,530,0.98]],t);
  clearTo(ctx,S);bgW(ctx,S,cam);board(ctx,1,"Conceptual model · the sketch, on the map");
  // the five boxes, each lit as the voice names it
  const nm={Student:"student",Class:"class",Enrolment:"enrolment",Term:"term",Course:"course"},E={};
  Object.keys(V1).forEach(k=>{E[k]={x:V1[k][0],y:V1[k][1],name:k,s:1.25,a:1,hi:pulse(t,w("recap",nm[k])-0.15,1.3)};});E.Term.sub="census date";
  const q=fin(t,cO+0.8);
  diagram(ctx,E,V1R.map((r,i)=>r.concat([{f:1,bad:q*(i===3?0.6+0.4*Math.sin(t*3):0)}])));
  // its place on the map: four pins on each box, all but two; where each box lives (its home) lit; then the map is left behind
  const pl=w("recap","place"),pOut=1-fin(t,w("map","right")-0.1,0.9),pins={},home=fin(t,w("map","where")-0.1,0.5)*(1-fin(t,w("map","doesn't"),0.6));
  ["Student","Enrolment","Course","Class","Term"].forEach((k,i)=>{const v=fin(t,pl+i*0.2,0.5)*pOut;pins[k]=[v,v,v,v];});pins.Class[3]=0;pins.Term[1]=0;
  const qq=(0.75+0.25*Math.sin(t*3.2))*pOut,Q={Class:{3:qq*fin(t,pl+0.6,0.5)},Term:{1:qq*fin(t,pl+0.8,0.5)}};
  fc_pins(ctx,E,pins,Q,[0,0,home,0]);fc_legend(ctx,836,fin(t,pl+1.2,0.6)*pOut,[0,0,home,0]);
  // what the sketch hides: the class, the one census date, the one course
  withA(ctx,q,()=>{[[1368,343,"what is a class?"],[1368,757,"one date for all?"],[576,535,"only one course?"]].forEach(([x,y,s],i)=>withA(ctx,fin(t,cO+0.8+i*0.5),()=>{glow(ctx,x,y,70,EXT,0.25+0.1*Math.sin(t*3+i));tag(ctx,x,y,s,EXT,{align:"center",size:28});}));});
  withA(ctx,fin(t,cO+0.3),()=>{tag(ctx,700,836,"good enough to start",GOOD,{align:"center",size:28});tag(ctx,1220,836,"not good enough to count",BAD,{align:"center",size:28});});
  stamp(ctx,1790,836,"sketch v1",SK,fin(t,cO+0.3));
  // a sweep of light: every model gets sharper when a question needs it
  if(t>cN+0.5&&t<cN+3.5){const u=(t-cN-0.5)/3;glow(ctx,lerp(150,1800,ease(u)),530,260,SK,0.25*Math.sin(Math.PI*u));}
  // the breather: new records arrive and find their place in the simple sketch
  if(sc.breathe&&t>B){for(let k=0;k<5;k++){const t0=B+0.6+k*0.8,u=clamp((t-t0)/1.3,0,1);if(u<=0||u>=1)continue;const q2=at(mk(bez(P(40,250+k*110),P(400,250+k*80),P(800,413),P(972,413),16)),ease(u));dtile(ctx,q2.x,q2.y,lerp(40,26,u),0,{cell:(k*7+3)%24,q:2,app:["sis","lms","sis","hr","sis"][k]},1-sstep(0.85,1,u));}
    [0,1,2,3,4].forEach(k=>{const t0=B+1.9+k*0.8;if(t>t0&&t<t0+0.8)glow(ctx,972,413,120,SK,0.4*(1-(t-t0)/0.8));});}
  vign(ctx,S);
});

/* ---------- 1. Two numbers ---------- */
function asker(ctx,t,a,q,qA){withA(ctx,a,()=>{orb(ctx,330,600,34,t);chip(ctx,330,720,"databricks","Genie","answers in plain words",{align:"center",edge:LAYER.gold});
  withA(ctx,qA,()=>{tag(ctx,500,210,"Head of School",DOM.students.c,{size:18});bubble(ctx,480,245,660,q,DOM.students.c,{size:30});});});}
scene("two",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cA=c("ask"),cQ=c("q"),cN=c("nums"),cC=c("clean"),cM=c("meaning"),cK=c("check"),cT=c("tcsi"),B=c("breath");
  bgW(ctx,S,CAM0);const out=1-sstep(cK-0.2,cK+0.8,t);
  withA(ctx,out,()=>{asker(ctx,t,fin(t,0.2),"How many students were enrolled in Data Science 101 on census date?",fin(t,cQ-0.2));
    withA(ctx,fin(t,cN-0.1),()=>numCard(ctx,1220,250,560,"Genie","131","counted from the lakehouse",CYAN));
    withA(ctx,fin(t,cN+1.6),()=>numCard(ctx,1220,500,560,"Census report","118","sent to government",LAYER.gold,{badge:"certified",badgeCol:LAYER.gold}));
    withA(ctx,fin(t,cC+0.2),()=>{if(phMin(ctx)){tag(ctx,1500,474,"every test passed",GOOD,{align:"center",size:16});tag(ctx,1500,724,"every test passed",GOOD,{align:"center",size:16});}else{tag(ctx,1590,430,"every test passed",GOOD,{size:16});tag(ctx,1590,680,"every test passed",GOOD,{size:16});}});
    withA(ctx,fin(t,cM),()=>{glow(ctx,1500,470,160,BAD,0.18+0.06*Math.sin(t*3));tag(ctx,1500,775,"same data, different meaning",BAD,{align:"center",size:20});});});
  // before changing anything, a wider question: how does this kind of business generally work? Many industries have published models, a first template
  const cI=c("industry"),cF=c("fit"),cMc=c("mcds");
  const bA=fin(t,cK+0.2,0.8);withA(ctx,bA,()=>{board(ctx,1,"Conceptual model");const E={};Object.keys(V1).forEach(k=>{E[k]={x:V1[k][0],y:V1[k][1],name:k};});E.Term.sub="census date";diagram(ctx,E,V1R.map(r=>r.concat([{}])));stamp(ctx,1790,845,"sketch v1",SK,1);
    withA(ctx,fin(t,cK+0.9),()=>tag(ctx,960,280,"how does this kind of business generally work?",C.white,{align:"center",size:24}));
    // first the industries, then, for higher education, several candidate models: which one, and why, is a choice
    const cCh=c("choose"),ind=fin(t,cI+0.2)*(1-sstep(cCh-0.2,cCh+0.4,t)),cand=fin(t,cCh+0.3);
    withA(ctx,ind,()=>{T(ctx,"published industry models: a first template",960,772,{w:600,size:18,align:"center",color:rgba(SOFT,1)});
      ["Banking","Insurance","Retail","Health","Higher education"].forEach((n,i)=>withA(ctx,fin(t,cI+0.6+i*0.35),()=>{const x=440+i*260;tag(ctx,x,820,n,i===4?REF:SOFT,{align:"center",size:18});}));});
    withA(ctx,cand,()=>{T(ctx,t>cMc+0.4?"widely used by universities: MCDS · here we check against TCSI":t>cT+0.4?"one of the choices: TCSI, public, and what universities report":"reference models for higher education: which one, and why?",960,772,{w:600,size:18,align:"center",color:rgba(t>cT+0.4?REF:SOFT,1)});
      const RM=[["TCSI","Australia"],["HESA Data Futures","United Kingdom"],["CEDS","United States"],["MCDS","MortarCAPS"]],pm=phMin(ctx),rw=RM.map(([n,r])=>tw(ctx,n+" · "+r,Math.max(17,pm),700)+26),rx=[];
      RM.forEach((_,i)=>rx.push(i?rx[i-1]+rw[i-1]/2+16+rw[i]/2:150+rw[0]/2));
      RM.forEach(([n,r],i)=>withA(ctx,fin(t,cCh+0.5+i*0.35),()=>{const x=pm?rx[i]:480+i*320,on=i===0?fin(t,cT+0.3):i===3?fin(t,cMc+0.3):0,dim=t>cT+0.3&&on<=0?0.45:1;
        if(on>0)glow(ctx,x,820,130,REF,0.5*on);withA(ctx,dim,()=>tag(ctx,x,820,n+" · "+r,on>0?REF:SOFT,{align:"center",size:17}));}));});});
  const pA=fin(t,cMc+4.2,0.5);if(pA>0){const hi={};if(sc.breathe&&t>B)["Student","Admission","Course","Enrolment","Unit"].forEach((k,i)=>{hi[k]=pulse(t,B+0.3+i*0.5,1.2);});// each box lights on its own chime (tools/audio.py)
    paper(ctx,pA,slideIn(t,cMc+4.2),t,hi);withA(ctx,fin(t,cF+0.2),()=>tag(ctx,1400,835,"a reference to check against, not a model to copy",REF,{align:"center",size:18}));}
  hud(ctx,S,fin(t,cK+0.4),131);
  setCam(ctx,S,CAM0);vign(ctx,S);
});

/* ---------- 2. What is a class? ---------- */
scene("cls",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cQ=c("q"),cR=c("ref"),cH=c("hiding"),cU=c("unit"),cO=c("offering"),cC=c("classes"),cG=c("genie"),cGr=c("grain"),B=c("breath");
  bgW(ctx,S,CAM0);board(ctx,1,"Conceptual model");
  const u=ease(clamp((t-cH-0.2)/1.6,0,1)),uu=clamp((t-cH-0.2)/1.6,0,1),P1=k=>k==='Student'?[lerp(V1[k][0],L2[k][0],ease(clamp(uu*2-1,0,1))),lerp(V1[k][1],L2[k][1],u)]:k==='Course'?[lerp(V1[k][0],L2[k][0],ease(clamp(uu*2,0,1))),lerp(V1[k][1],L2[k][1],u)]:lerpP(V1[k],L2[k],u),PC=k=>lerpP(V1.Class,L2[k],u),split=sstep(0,0.3,u);
  const E={Student:{x:P1("Student")[0],y:P1("Student")[1],name:"Student"},Enrolment:{x:P1("Enrolment")[0],y:P1("Enrolment")[1],name:t>cO+1.2?"Unit enrolment":"Enrolment",hi:pulse(t,cO+0.8,2.4)},
    Course:{x:P1("Course")[0],y:P1("Course")[1],name:"Course"},Term:{x:P1("Term")[0],y:P1("Term")[1],name:"Term",sub:"census date"},
    Class:{x:PC("Class")[0],y:PC("Class")[1],name:"Class",hi:pulse(t,cQ,2.4)+pulse(t,cC,2.4),sub:t>cC?"Tue 9 am tutorial":null,subA:fin(t,cC),pin:t>cC+0.8?"extend":null,pinA:fin(t,cC+0.8)}};
  if(split>0){E.Offering={x:PC("Offering")[0],y:PC("Offering")[1],name:"Unit offering",a:split,hi:pulse(t,cO,2.4),sub:t>cO?"Semester 1 · city campus":null,subA:fin(t,cO),pin:t>cO+0.8?"extend":null,pinA:fin(t,cO+0.8)};
    E.Unit={x:PC("Unit")[0],y:PC("Unit")[1],name:"Unit",a:split,hi:pulse(t,cU,2.4),sub:t>cU?"Data Science 101":null,subA:fin(t,cU),pin:t>cU+0.8?"adopt":null,pinA:fin(t,cU+0.8)};}
  const R=V1R.map(r=>r.concat([{a:1-split}])).concat([["Student","Enrolment","1","*",{a:split}],["Enrolment","Offering","*","1",{a:split}],["Offering","Unit","*","1",{a:split}],["Offering","Class","1","*",{a:split}],["Offering","Term","*","1",{a:split}],["Student","Course","*","1",{a:split}]]);
  R[0][4].a=1;R[3][4].a=1;R[4][4].a=0;R[9][4].a=0;// student–enrolment and student–course stay, drawn once
  diagram(ctx,E,R);
  // what the pins mean, said once
  withA(ctx,brief3(t,cU+0.9,3),()=>tag(ctx,1720,440,"from the reference",ADOPT,{align:"center",size:16}));
  withA(ctx,brief3(t,cO+0.9,3),()=>tag(ctx,1200,440,"ours",EXT,{align:"center",size:16}));
  withA(ctx,brief3(t,cC+0.9,3),()=>tag(ctx,1200,830,"ours",EXT,{align:"center",size:16}));
  // Genie counted places in tutorials: one student in two tutorials is counted twice
  withA(ctx,fin(t,cG)*(1-sstep(B+0.2,B+1,t)),()=>{[[1330,"Tue 9 am tutorial"],[1600,"Thu 2 pm tutorial"]].forEach(([x,s],i)=>{glass(ctx,x-125,220,250,130,14,SK,{glow:10,ea:0.6,fill:"rgba(7,12,24,0.9)"});T(ctx,s,x,252,{w:700,size:18,align:"center",color:rgba(SK,1)});
      dtile(ctx,x-40,300,48,0,{cell:7,q:2,app:"sis",hi:true},1);dtile(ctx,x+30,300,48,0,{cell:(i*9+4)%24,q:2,app:"sis"},1);});
    tag(ctx,1465,390,"one student, counted twice",BAD,{align:"center",size:18});glow(ctx,1290,300,60,BAD,0.35);glow(ctx,1560,300,60,BAD,0.35);});
  withA(ctx,fin(t,cGr),()=>{tag(ctx,760,610,"grain: one row = one student in one unit offering",REF,{align:"center",size:18});});
  stamp(ctx,1790,845,t>cH?"sketch v2 · draft":"sketch v1",t>cH?EXT:SK,1);
  // the reference has units of study and unit enrolments, and no class
  const pA=fin(t,cR-0.1,0.4)*(1-sstep(cH-0.3,cH+0.3,t));if(pA>0)paper(ctx,pA,slideIn(t,cR-0.1),t,{Unit:pulse(t,cR+1.5,3),Enrolment:pulse(t,cR+2.2,3)},{extra:c2=>withA(c2,fin(t,cR+2.6),()=>tag(c2,1560,440,"no class in the reference",REF,{align:"center",size:18}))});
  // the breather: each student lands once in the offering, however many tutorials they attend
  if(sc.breathe&&t>B){for(let k=0;k<6;k++){const t0=B+0.4+k*0.8,v=clamp((t-t0)/1.4,0,1);if(v<=0||v>=1)continue;const q=at(mk([P(90,510),P(760,510),P(1200,510)]),ease(v));dtile(ctx,q.x,q.y,30,0,{cell:(k*5+2)%24,q:2,app:"sis"},1-sstep(0.85,1,v));}
    for(let k=0;k<6;k++){const t0=B+1.8+k*0.8;if(t>t0&&t<t0+0.7)glow(ctx,1200,510,110,SK,0.45*(1-(t-t0)/0.7));}}
  hud(ctx,S,1,countTo(t,cG+2.2,131,125),cG+2.2,t);setCam(ctx,S,CAM0);vign(ctx,S);
});

/* ---------- 3. Whose census date? ---------- */
const SUBC={Unit:{sub:"Data Science 101",pin:"adopt"},Offering:{sub:"Semester 1 · city campus",pin:"extend"},Class:{sub:"Tue 9 am tutorial",pin:"extend"},Enrolment:{name:"Unit enrolment"}};
const L2R=[["Student","Enrolment","1","*"],["Enrolment","Offering","*","1"],["Offering","Unit","*","1"],["Offering","Class","1","*"],["Offering","Term","*","1"],["Student","Course","*","1"]];
scene("census",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cQ=c("q"),cT=c("term"),cR=c("ref"),cS=c("summer"),cA=c("adopt"),B=c("breath");
  bgW(ctx,S,CAM0);board(ctx,1,"Conceptual model");
  const mv=ease(clamp((t-cA-0.3)/1.4,0,1)),E=E3(Object.keys(L2),L2,JSON.parse(JSON.stringify(SUBC)));
  E.Term.name=mv>0.5?"Teaching period":"Term";E.Term.sub=mv>0?null:"census date";E.Term.hi=pulse(t,cQ,2.6);E.Term.subCol=t>cQ?REF:null;if(mv>0.5)E.Term.pin="extend";
  if(mv>=1){E.Offering.sub="census date";E.Offering.subCol=REF;}else if(mv>0)E.Offering.subA=1-sstep(0,0.3,mv);
  E.Offering.hi=pulse(t,cA+1.4,2.4);diagram(ctx,E,L2R.map(r=>r.concat([{}])));
  // the census date moves from the term to the unit offering
  if(mv>0&&mv<1){const p=lerpP([1620,752],[1200,532],mv);T(ctx,"census date",p[0],p[1],{w:600,size:16,align:"center",color:rgba(REF,1)});glow(ctx,p[0],p[1]-6,60,REF,0.4);}
  // above the term it describes: below it, the draft stamp would hide it
  withA(ctx,fin(t,cT+0.2)*(1-sstep(cA,cA+0.5,t)),()=>tag(ctx,1625,626,"one date for everyone",EXT,{align:"center",size:18}));
  // the same unit, two offerings, two census dates
  withA(ctx,fin(t,cS),()=>{calCard(ctx,1120,200,"DS101 · Semester 1","31 Mar",SK,1,pulse(t,cS+0.3,2)+(sc.breathe&&t>B?pulse(t,B+0.5,2)+pulse(t,B+2.9,2):0));calCard(ctx,1450,200,"DS101 · Summer","20 Jan",EXT,fin(t,cS+0.8),pulse(t,cS+1.1,2)+(sc.breathe&&t>B?pulse(t,B+1.7,2)+pulse(t,B+4.1,2):0));});
  withA(ctx,fin(t,cA+2.0),()=>tag(ctx,1200,610,"adopted from the reference",ADOPT,{align:"center",size:16}));
  stamp(ctx,1790,845,"sketch v2 · draft",EXT,1);
  const pA=fin(t,cR-0.1,0.4)*(1-sstep(cS-0.4,cS+0.2,t));if(pA>0)paper(ctx,pA,slideIn(t,cR-0.1),t,{Enrolment:pulse(t,cR+1.4,3.5)},{extra:c2=>withA(c2,fin(t,cR+1.8),()=>tag(c2,760,660,"census date, with each unit enrolment",REF,{align:"center",size:18}))});
  hud(ctx,S,1,countTo(t,cA+1.6,125,121),cA+1.6,t);setCam(ctx,S,CAM0);vign(ctx,S);
});

/* ---------- 4. One student, two courses ---------- */
scene("courses",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cTw=c("twice"),cD=c("double"),cO=c("one"),cA=c("admission"),cOn=c("once"),cL=c("link"),B=c("breath");
  bgW(ctx,S,CAM0);board(ctx,1,"Conceptual model");
  const t0=cA+3.0,uC=ease(clamp((t-t0)/1.4,0,1)),uS=ease(clamp((t-t0-0.9)/1.2,0,1)),aA=fin(t,t0+0.7,0.8);
  const pos=Object.assign({},L2,{Course:lerpP(L2.Course,L3.Course,uC),Student:lerpP(L2.Student,L3.Student,uS),Admission:L3.Admission});
  const E=E3(Object.keys(pos),pos,{Unit:{sub:"Data Science 101",pin:"adopt"},Offering:{sub:"census date",subCol:REF,pin:"extend"},Class:{sub:"Tue 9 am tutorial",pin:"extend"},Term:{pin:"extend"},
    Student:{sub:t>cD&&t<cA+2?"double degree":null,subA:fin(t,cD)},Admission:{a:aA,pin:"adopt",pinA:fin(t,t0+1.4),hi:pulse(t,cL,2.6)}});
  const old=1-aA;diagram(ctx,E,[["Student","Enrolment","1","*",{a:old}],["Student","Course","*","1",{a:old,bad:fin(t,cO)*(0.6+0.4*Math.sin(t*3))*(1-sstep(cA,cA+1,t))}],
    ["Student","Admission","1","*",{a:aA}],["Admission","Course","*","1",{a:aA}],["Admission","Enrolment","1","*",{a:aA}],["Enrolment","Offering","*","1"],["Offering","Unit","*","1"],["Offering","Class","1","*"],["Offering","Term","*","1"]]);
  // two students, each counted twice: once per course
  const merge=ease(clamp((t-cOn-0.4)/1.2,0,1));withA(ctx,fin(t,cTw)*(1-sstep(B+0.5,B+1.3,t)),()=>{[0,1].forEach(i=>{const x=1480+i*230;glass(ctx,x-100,215,200,120,14,merge>0.5?GOOD:BAD,{glow:10,ea:0.6,fill:"rgba(7,12,24,0.9)"});
      dtile(ctx,x-lerp(34,0,merge),270,50,0,{cell:3+i*8,q:2,app:"sis",hi:true},1);dtile(ctx,x+lerp(34,0,merge),270,50,0,{cell:3+i*8,q:2,app:"sis",hi:true},1-merge);
      T(ctx,merge>0.5?"× 1":"× 2",x,322,{w:800,size:20,align:"center",color:rgba(merge>0.5?GOOD:BAD,1)});});
    tag(ctx,1595,380,merge>0.5?"each student counted once":"counted twice",merge>0.5?GOOD:BAD,{align:"center",size:18});});
  withA(ctx,fin(t,cD+0.6)*(1-sstep(cA+1.5,cA+2.2,t)),()=>{tag(ctx,470,250,"Bachelor of Data Science",SK,{size:16});tag(ctx,470,330,"Bachelor of Business",SK,{size:16});});
  withA(ctx,fin(t,cO+0.3)*(1-sstep(cA,cA+0.6,t)),()=>tag(ctx,360,400,"one course only?",BAD,{size:18}));
  withA(ctx,fin(t,cL+0.3),()=>tag(ctx,760,212,"the link gets its own box",ADOPT,{align:"center",size:17}));
  // the breather: each course admission carries its own unit enrolments
  if(sc.breathe&&t>B){[[L3.Student,L3.Admission,L3.Course],[L3.Student,L3.Admission,L3.Enrolment]].forEach((pts,i)=>{for(let k=0;k<2;k++){const v=clamp((t-B-0.5-i*1.2-k*2.4)/1.6,0,1);if(v<=0||v>=1)continue;const q=at(mk(pts.map(p=>P(p[0],p[1]))),ease(v));glow(ctx,q.x,q.y,26,C.white,0.9);glow(ctx,q.x,q.y,80,ADOPT,0.5);}});}
  stamp(ctx,1790,845,"sketch v2 · draft",EXT,1);
  const pA=fin(t,cA-0.1,0.4)*(1-sstep(cA+2.4,cA+3.0,t));if(pA>0)paper(ctx,pA,slideIn(t,cA-0.1),t,{Admission:pulse(t,cA+0.8,2.6)},{extra:c2=>withA(c2,fin(t,cA+1.0),()=>tag(c2,760,215,"one student, one course, one start date",REF,{align:"center",size:18}))});
  hud(ctx,S,1,countTo(t,cOn+0.6,121,119),cOn+0.6,t);setCam(ctx,S,CAM0);vign(ctx,S);
});

/* ---------- 5. Enrolled when? ---------- */
/* the register's four columns, as a data model keeps them: what was there on one day, what came in, what went out, and what's there
   on another; written left to right, on the register's paper. p[i]: how far each column is in (0..1) */
function fc_four(ctx,x,y,w,h,heads,vals,subs,p,a){if(a<=0.01)return;withA(ctx,a,()=>{const cw=w/4;
  ctx.fillStyle=rgba(RG_PAPER,1);rr(ctx,x,y,w,h,14);ctx.fill();ctx.strokeStyle=rgba(RG_YEL,0.9);ctx.lineWidth=4;rr(ctx,x,y,w,h,14);ctx.stroke();
  ctx.strokeStyle=rgba(RG_INK,0.3);ctx.lineWidth=2;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x+cw*i,y+18);ctx.lineTo(x+cw*i,y+h-18);ctx.stroke();}
  heads.forEach((hd,i)=>{const cx=x+cw*(i+0.5),q=p[i];rg_pill(ctx,cx,y-38,hd,i===3?RG_YEL:RG_PAPER,q,{size:28});
    if(q>0.01)withA(ctx,q,()=>{T(ctx,vals[i],cx,y+h*0.5+14,{w:800,size:76,align:"center",color:rgba(i===1||i===2?mix(RG_EARTH,[70,34,12],0.45):RG_INK,1)});
      if(subs[i])T(ctx,subs[i],cx,y+h-34,{w:600,size:28,align:"center",color:rgba(RG_INK,0.78)});});});});}
scene("time",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cQ=c("q"),cT=c("today"),cC=c("change"),cX=c("extend"),cS=c("snap"),B=c("breath");
  // the four columns' card (below) comes over the model: what it covers fades back, so no words show through it
  const cF=c("cols"),fA=fin(t,cF+0.2,0.6),under=1-0.62*fA;
  bgW(ctx,S,CAM0);board(ctx,1,"Conceptual model");
  const strip=fin(t,cC-0.2)*(1-sstep(cX+0.6,cX+1.2,t)),sA=fin(t,cX+1.0,0.8),dim=(1-0.7*strip)*under;
  withA(ctx,dim,()=>sketchV2(ctx,{extra:{Enrolment:{sub:t>cX?"current status":null,subCol:REF,subA:fin(t,cX+0.2)}},pins:true,a:k=>k==="Status"?sA:1,pinA:k=>k==="Status"?fin(t,cX+1.8):1,hi:k=>k==="Enrolment"?pulse(t,cQ,2.4):k==="Status"?pulse(t,cS+0.4,2.6):0}));
  withA(ctx,fin(t,cT)*(1-sstep(cC-0.4,cC,t)),()=>{calCard(ctx,1470,180,"Genie counted","26 Apr",CYAN,1,0);calCard(ctx,1470,320,"Census report","31 Mar",LAYER.gold,fin(t,cT+1.2),0);});
  // one enrolment's story, frame by frame; the census count is a snapshot of one day
  const fr=[{s:"waitlisted",d:"3 Mar",col:EXT},{s:"enrolled",d:"10 Mar",col:GOOD},{s:"census date",d:"31 Mar",col:REF},{s:"withdrew",d:"14 Apr",col:BAD}];
  fr.forEach((f,i)=>{f.a=fin(t,cC+0.4+i*0.9);f.hi=i===2?pulse(t,cC+3.2,2):0;});
  filmStrip(ctx,590,330,fr,strip,0,t);
  withA(ctx,fin(t,cX+1.8)*under,()=>tag(ctx,760,830,"ours: the history of each enrolment",EXT,{align:"center",size:17}));
  if(t>cS+0.3&&t<cS+1.3){const v=(t-cS-0.3);glow(ctx,760,730,320,C.white,0.6*(1-v));}
  withA(ctx,fin(t,cS+0.8)*under,()=>tag(ctx,1200,620,"census count: a snapshot on 31 Mar",REF,{align:"center",size:17}));
  // the breather: changes keep arriving, and each one is kept with its date
  if(sc.breathe&&t>B){for(let k=0;k<4;k++){const v=clamp((t-B-0.4-k*1.3)/1.1,0,1);if(v<=0||v>=1)continue;glow(ctx,760,lerp(560,700,ease(v)),22,C.white,0.9);glow(ctx,760,lerp(560,700,ease(v)),70,EXT,0.5);}}
  stamp(ctx,1790,845,"sketch v2 · draft",EXT,under);
  // like the register's four columns: what was there on census date, what came in, what went out, and what's there today
  if(fA>0){dark(ctx,S,0.5*fA);setCam(ctx,S,CAM0);const ww=(id,wd)=>wAt(sc,id,wd);
    fc_four(ctx,470,420,980,270,["census date","came in","went out","today"],["118","+2","−1","119"],["31 Mar","late, approved","withdrew","26 Apr"],
      [fin(t,ww("cols","census date")-0.1,0.5),fin(t,ww("cols","came in")-0.1,0.5),fin(t,ww("cols","went out")-0.1,0.5),fin(t,ww("cols","today")-0.1,0.5)],fA);}
  hud(ctx,S,1,countTo(t,cS+1.6,119,118),cS+1.6,t);setCam(ctx,S,CAM0);vign(ctx,S);
});

/* ---------- 6. Three levels of precision ---------- */
scene("levels",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cSt=c("still"),cC=c("concept"),cL=c("logical"),cP=c("physical"),cA=c("agree"),cN=c("another"),B=c("breath");
  const cam=camAt([[0,960,540,1],[cL,960,540,1],[cL+1.6,980,520,1.45],[cP,980,520,1.45],[cP+1.4,960,540,1.12],[cA-0.2,960,540,1.12],[cA+0.6,960,540,1]],t);
  bgW(ctx,S,cam);const scA=1-sstep(cA-0.4,cA+0.4,t),lg=fin(t,cL+0.6,1.0),ph=fin(t,cP+0.2,0.8);
  withA(ctx,scA,()=>{board(ctx,1-ph*0.6,null);
    withA(ctx,1-ph*0.95,()=>{const E=E3(Object.keys(L3),L3,{Offering:{sub:lg>0?null:"census date",subCol:REF,attrs:lg>0?[["unit code","id"],["census date","id"],["teaching period",""],["campus",""],["mode",""]]:null,attrA:lg},
        Enrolment:{attrs:lg>0?[["course admission","id"],["unit offering","id"],["current status",""]]:null,attrA:lg},Unit:{sub:"Data Science 101"},Class:{sub:"Tue 9 am tutorial"},Status:{sub:"status · date"}});
      Object.keys(E).forEach(k=>{if(k!=="Enrolment"&&k!=="Offering")E[k].a=1-0.6*lg;});
      diagram(ctx,E,L3R.map(r=>r.concat([{words:r[0]==="Enrolment"&&r[1]==="Offering"?lg:0}])));});
    // the physical model: tables in the platform
    withA(ctx,ph,()=>{const rw=j=>fin(t,cP+0.8+j*0.3);table(ctx,620,300,"unit_enrolment",["course_admission_id","unit_code","census_date","status"],[["CA-20417","DS101","2026-03-31","enrolled"],["CA-20417","BUS110","2026-03-31","enrolled"],["CA-31802","DS101","2026-01-20","withdrew"]],{rowA:rw});
      table(ctx,590,560,"unit_offering",["unit_code","census_date","teaching_period","campus","mode"],[["DS101","2026-03-31","2026-S1","city","on site"],["DS101","2026-01-20","2026-SUM","city","intensive"]],{rowA:rw});});});
  setScreen(ctx,S);
  withA(ctx,scA,()=>{const lab=t<cL+0.6?"Conceptual model · for the business":t<cP+0.2?"Logical model · identifiers, details, how many":"Physical model · tables in the platform";const col=t<cL+0.6?SK:t<cP+0.2?REF:GOOD;
    withA(ctx,fin(t,cC),()=>tag(ctx,960,120,lab,col,{align:"center",size:22}));});
  // three levels, side by side: the same meaning, owned by different people
  const pa=fin(t,cA-0.2,0.8),dimN=1-0.92*fin(t,cN+0.1,0.8);
  withA(ctx,pa*dimN,()=>{[["Conceptual","owned by the business",SK],["Logical","shared",REF],["Physical","owned by engineers",GOOD]].forEach(([n,o,col],i)=>withA(ctx,fin(t,cA+i*0.6),()=>{const x=150+i*560;glass(ctx,x,230,500,470,20,col,{glow:16,ea:0.6,fill:"rgba(7,12,24,0.9)"});T(ctx,n,x+250,285,{w:800,size:30,align:"center",color:rgba(col,1)});
      if(i===0){const E={A:{x:x+140,y:420,name:"Unit enrolment",s:0.7},B:{x:x+360,y:420,name:"Unit offering",s:0.7},C:{x:x+360,y:560,name:"Unit",s:0.7}};diagram(ctx,E,[["A","B","*","1",{s:0.7}],["B","C","*","1",{s:0.7}]]);}
      if(i===1)ent(ctx,{x:x+250,y:470,name:"Unit offering",s:0.72,attrs:[["unit code","id"],["census date","id"],["teaching period",""],["campus",""]]});
      if(i===2)table(ctx,x+40,360,"unit_offering",["unit_code","census_date"],[["DS101","2026-03-31"],["DS101","2026-01-20"],["BUS110","2026-03-31"]],{col:GOOD,cw:[190,230]});
      tag(ctx,x+250,650,o,col,{align:"center",size:18});}));
    withA(ctx,fin(t,cA+2.4),()=>{lane(ctx,[P(400,205),P(1520,205)],[255,255,255],0.5);tag(ctx,960,205,"same meaning, three levels of detail",C.white,{align:"center",size:18});});});
  // a glimpse of the engineers' film: the same tables can take different shapes
  withA(ctx,fin(t,cN+0.5,0.8),()=>{const cx=700,cy=470;[[0,-70],[110,0],[0,70],[-110,0]].forEach(([dx,dy])=>{ctx.strokeStyle=rgba(LAYER.gold,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+dx,cy+dy);ctx.stroke();glass(ctx,cx+dx-34,cy+dy-16,68,32,8,LAYER.gold,{glow:8,ea:0.7});});glass(ctx,cx-44,cy-22,88,44,10,LAYER.gold,{glow:14,ea:0.9});
    for(let k=0;k<9;k++){glass(ctx,1000+k*58,cy-20,54,40,6,LAYER.gold,{glow:6,ea:0.6+0.3*Math.sin(t*2+k)});}T(ctx,"a star",cx,cy+124,{w:600,size:18,align:"center",color:rgba(SOFT,1)});T(ctx,"one wide row per student",1261,cy+56,{w:600,size:18,align:"center",color:rgba(SOFT,1)});
    tag(ctx,960,cy+220,"how to build them: another film",LAYER.gold,{align:"center",size:22});});
  setCam(ctx,S,CAM0);vign(ctx,S);
});

/* ---------- 7. Check, adopt, extend, record ---------- */
scene("fit",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cLi=c("lift"),cCh=c("check"),cAd=c("adopt"),cEx=c("extend"),cRe=c("record"),cCa=c("cage"),B=c("breath");
  const ph=phMin(ctx)>0,cam=camAt([[0,960,540,1],[cRe,960,540,1],[cRe+1.2,ph?1262:1225,530,ph?0.82:0.86],[cCa-0.2,ph?1262:1225,530,ph?0.82:0.86],[cCa+1.0,960,540,1]],t);bgW(ctx,S,cam);board(ctx,1,"Conceptual model");
  const pins=Object.keys(L3),pinT=k=>cLi+2.2+pins.indexOf(k)*0.25,br=sc.breathe&&t>B;
  sketchV2(ctx,{pins:true,pinA:k=>fin(t,pinT(k),0.3),pinP:k=>(PINS[k]==="adopt"?pulse(t,cAd+0.4,2.4):pulse(t,cEx+0.4,2.4))+(br?pulse(t,B+0.5+pins.indexOf(k)*0.5,1.4):0),
    hi:k=>PINS[k]==="adopt"?pulse(t,cAd+0.4,2.4):pulse(t,cEx+0.4,2.4)});
  // the reference lifts away, then the four steps
  const up=ease(clamp((t-cLi-0.3)/1.8,0,1)),cg=pulse(t,cCh+0.3,2.6);if(up<1||cg>0)paper(ctx,up<1?1-up:0.35*cg,0,t,{},{dy:up<1?-760*up:0,rot:-0.006-0.02*up});
  const steps=[["Check",cCh,REF],["Adopt",cAd,ADOPT],["Extend",cEx,EXT],["Record",cRe,C.white]];
  steps.forEach(([s,t0,col],i)=>withA(ctx,fin(t,t0-0.1),()=>{const on=t<(steps[i+1]?steps[i+1][1]:cCa)||t>cCa?1:0.45;withA(ctx,on,()=>tag(ctx,470+i*250,212,(i+1)+"  "+s,col,{align:"center",size:20}));}));
  // the fit register: every difference, and why
  withA(ctx,fin(t,cRe+0.8,0.8)*(1-sstep(cCa-0.3,cCa+0.3,t)),()=>{const pm=phMin(ctx),x=1850,y=200,w=pm?566:460,RG=[["Unit offering","TCSI identifies it by unit","and census date"],["Class","a timetabled activity,","not in TCSI"],["Status change","TCSI keeps the current","status only"],["Teaching period","groups offerings in time"]];
    if(pm){const L=RG.map(r=>phWrap(ctx,r.slice(1).join(" "),w-72,pm,500)),lh=pm*1.16;let yy=y+56+pm*2.3;const h=yy-y+L.reduce((p,l)=>p+(l.length+1)*lh+26,0);
      glass(ctx,x,y,w,h,18,C.white,{glow:14,ea:0.6,fill:"rgba(7,12,24,0.94)"});T(ctx,"Fit register",x+26,y+48,{w:800,size:26});T(ctx,"sketch v2 · checked against TCSI",x+26,y+48+pm*1.2,{w:500,size:16,color:rgba(SOFT,1)});
      RG.forEach((r,i)=>{const y0=yy;withA(ctx,fin(t,cRe+1.4+i*0.5),()=>{led(ctx,x+26,y0-pm*0.8,6,(L[i].length+1)*lh-4,EXT);T(ctx,r[0]+"  ·  extended",x+46,y0,{w:700,size:20,color:rgba(EXT,1)});L[i].forEach((l,j)=>T(ctx,l,x+46,y0+(j+1)*lh,{w:500,size:17,color:rgba(SOFT,1)}));});yy+=(L[i].length+1)*lh+26;});return;}
    glass(ctx,x,y,w,620,18,C.white,{glow:14,ea:0.6,fill:"rgba(7,12,24,0.94)"});T(ctx,"Fit register",x+26,y+48,{w:800,size:26});T(ctx,"sketch v2 · checked against TCSI",x+26,y+78,{w:500,size:16,color:rgba(SOFT,1)});
    [["Unit offering","TCSI identifies it by unit","and census date"],["Class","a timetabled activity,","not in TCSI"],["Status change","TCSI keeps the current","status only"],["Teaching period","groups offerings in time"]].forEach((r,i)=>withA(ctx,fin(t,cRe+1.4+i*0.5),()=>{const yy=y+140+i*118;led(ctx,x+26,yy-18,6,76,EXT);T(ctx,r[0]+"  ·  extended",x+46,yy,{w:700,size:20,color:rgba(EXT,1)});T(ctx,r[1],x+46,yy+28,{w:500,size:17,color:rgba(SOFT,1)});if(r[2])T(ctx,r[2],x+46,yy+52,{w:500,size:17,color:rgba(SOFT,1)});}));});
  withA(ctx,fin(t,cCa+0.9),()=>tag(ctx,960,845,"a starting point, not a cage",C.white,{align:"center",size:18}));
  stamp(ctx,1790,845,"sketch v2 · draft",EXT,1);setCam(ctx,S,CAM0);vign(ctx,S);
});

/* ---------- 8. Pull back ---------- */
/* the end of the story: the Yellow Registers, made every ten years for taxes paid every year, fell behind; the counties' white
   registers, written each year, did the real work, and the yellow ones became a formality. Eleven years, one mark each, in the frame */
const FC_YRS=11,fc_yx=i=>420+i*108,FC_WHITE=[238,234,224];
function fc_years(ctx,t,sc,a){if(a<=0.01)return;const w=(id,wd,o)=>wAt(sc,id,wd,o),cWh=cue(sc,"white"),yL=770;
  const tx=w("yellow","every year"),ty=w("yellow","every ten years"),fb=fin(t,w("yellow","fell behind")-0.2,0.6)*(1-fin(t,cWh+0.2,0.6)),fm=fin(t,w("white","formality")-0.2,1.0),tw0=w("white","white registers");
  withA(ctx,a,()=>{ctx.strokeStyle=rgba(RG_PAPER,0.5);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(fc_yx(0)-60,yL);ctx.lineTo(fc_yx(FC_YRS-1)+60,yL);ctx.stroke();
    for(let i=0;i<FC_YRS;i++){ctx.beginPath();ctx.moveTo(fc_yx(i),yL-9);ctx.lineTo(fc_yx(i),yL+9);ctx.stroke();}
    // taxes, paid every year: a sack on each year's mark
    for(let i=0;i<FC_YRS;i++)rg_sack(ctx,fc_yx(i),yL-8,0.9,fin(t,tx-0.2+i*0.11,0.35));
    // the years between with no register made for them
    if(fb>0){ctx.fillStyle=rgba(FC_WRONG,0.14*fb);rr(ctx,fc_yx(1)-50,452,fc_yx(FC_YRS-2)-fc_yx(1)+100,136,18);ctx.fill();}
    // the court's register, made every ten years: at the first mark and the last; greyed, a formality, once the white ones do the work
    [0,FC_YRS-1].forEach((i,k)=>{const yA=fin(t,ty-0.2+k*0.4,0.5);if(yA>0)rg_book(ctx,fc_yx(i),520,84,116,{col:mix(RG_YEL,[112,100,84],0.6*fm),a:yA*(1-0.35*fm)});});
    // the counties' white registers, written each year, by each year's taxes
    for(let i=0;i<FC_YRS;i++){const wa=fin(t,tw0+0.1+i*0.12,0.4);if(wa>0){if(fm<0.01)glow(ctx,fc_yx(i),650,60,FC_WHITE,0.2*wa*pulse(t,tw0+0.1+i*0.12,1.0));rg_book(ctx,fc_yx(i),650,76,104,{col:FC_WHITE,a:wa});}}});
  rg_pill(ctx,960,420,"every ten years",RG_YEL,a*fin(t,ty+0.2,0.5)*(1-fin(t,cWh,0.6)),{size:28});
  rg_pill(ctx,960,850,"taxes: every year",RG_EARTH,a*fin(t,tx,0.5)*(1-fin(t,cWh,0.6)),{size:28});
  rg_pill(ctx,960,520,"fell behind",FC_WRONG,a*fb,{size:28});
  yearTag(ctx,96,100,"China, the late Ming",CLAY,a*fin(t,w("white","late Ming")-0.2,0.6));
  rg_pill(ctx,960,850,"white registers: each year, for the real work",FC_WHITE,a*fin(t,w("white","real work")-0.3,0.5),{size:28});
  rg_pill(ctx,960,520,"the yellow ones: a formality",RG_YEL,a*fm,{size:28});}
// a side copy: a sheet of rows and columns, lit while it does the work
function fc_sheet(ctx,x,y,w,h,col,a,on){if(a<=0.01)return;withA(ctx,a,()=>{if(on>0.01)glow(ctx,x+w/2,y+h/2,w*0.8,col,0.28*on);glass(ctx,x,y,w,h,12,col,{glow:8+12*on,ea:0.5+0.4*on,fill:"rgba(7,12,24,0.94)"});
  ctx.fillStyle=rgba(col,0.45+0.4*on);ctx.fillRect(x+14,y+14,w-28,18);ctx.strokeStyle=rgba(col,0.3+0.4*on);ctx.lineWidth=1.5;
  for(let r=1;r<5;r++){const yy=y+32+r*(h-46)/5;ctx.beginPath();ctx.moveTo(x+14,yy);ctx.lineTo(x+w-14,yy);ctx.stroke();}
  for(let k=1;k<4;k++){const xx=x+14+k*(w-28)/4;ctx.beginPath();ctx.moveTo(xx,y+32);ctx.lineTo(xx,y+h-14);ctx.stroke();}});}
// a model that doesn't fit the business: kept for show, while side copies do the work
function fc_side(ctx,t,sc,a){if(a<=0.01)return;const w=(id,wd,o)=>wAt(sc,id,wd,o),dn=fin(t,w("side","doesn't")-0.2,0.8),sc2=w("side","side copies"),wk=fin(t,w("side","work")-0.2,0.5);
  withA(ctx,a,()=>{withA(ctx,1-0.55*dn,()=>{glass(ctx,640,240,640,430,22,SK,{glow:14*(1-dn),ea:0.35,fill:"rgba(10,18,36,0.6)"});phAsDeco(true,()=>sketchV2(ctx,{pos:lay(L3,0.4,960,455),s:0.4}));});
    withA(ctx,fin(t,w("side","kept for show")-0.2,0.5),()=>tag(ctx,960,720,"kept for show",SOFT,{align:"center",size:28}));
    [[220,250],[1470,250],[220,520],[1470,520]].forEach(([x,y],i)=>fc_sheet(ctx,x,y,230,160,EXT,fin(t,sc2-0.3+i*0.25,0.5),pulse(t,sc2-0.1+i*0.25,1.4)*0.7+0.6*wk));
    withA(ctx,wk,()=>tag(ctx,960,830,"side copies do the work",EXT,{align:"center",size:28}));});}
scene("end",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cAg=c("again"),cAs=c("asks"),cAn=c("answer"),cV=c("version"),cE=c("evolve"),cYl=c("yellow"),cSd=c("side"),cTg=c("tag");
  // the room of the present, then the registers' land over it, then the present again: each whole picture dissolves into the next
  const lA=fin(t,cYl-0.9,1.0),sA=fin(t,cSd-0.9,0.9);
  if(lA<1){bgW(ctx,S,CAM0);const q1=1-sstep(cV-0.3,cV+0.5,t);
    withA(ctx,q1,()=>{asker(ctx,t,fin(t,0.1),"How many students were enrolled in Data Science 101 on census date?",fin(t,cAg));
      withA(ctx,fin(t,cAs-0.1),()=>{tag(ctx,500,470,"Genie",LAYER.gold,{size:18});bubble(ctx,480,505,660,"Enrolled on census date, in the Semester 1 offering?",LAYER.gold,{size:28});});
      withA(ctx,fin(t,cAn),()=>{numCard(ctx,1220,230,560,"Genie","118","matches the census report",GOOD);
        const hs=phSz(ctx,19),two=tw(ctx,"one row = one student in one unit offering",hs,600)>482,hl=two?Math.round(hs*1.2):0;glass(ctx,1220,470,560,230+hl,18,SK,{glow:12,ea:0.6,fill:"rgba(7,12,24,0.92)"});T(ctx,"How it counted",1248,512,{w:800,size:22}); // the first line is too long for the card at the size a phone needs: it takes two lines there, and the card grows by one
        [two?["one row = one student","in one unit offering"]:["one row = one student in one unit offering"],["enrolled on census date, 31 Mar"],["each student counted once"]].forEach((L,i)=>withA(ctx,fin(t,cAn+0.8+i*0.5),()=>{const y=i?hl:0;led(ctx,1250,538+i*50+y,6,30+(L.length-1)*hl,SK);L.forEach((l,j)=>T(ctx,l,1270,560+i*50+y+j*hl,{w:600,size:19,color:rgba(INK,0.95)}));}));});});
    // the sketch, version 2, with a note that says why it changed; then a new question arrives
    const vA=fin(t,cV-0.1,0.8);withA(ctx,vA,()=>{const pos=lay(L3,0.72,760,520);glass(ctx,110,170,1300,720,22,SK,{glow:18,ea:0.35,fill:"rgba(10,18,36,0.5)"});sketchV2(ctx,{pos,s:0.72,pins:true});
      const fl=t>cE+2.2?t:0;stamp(ctx,1390,845,t>cE+2.2?"sketch v3?":"sketch v2",t>cE+2.2?EXT:GOOD,1,fl?t-cE:0);
      const pm=phMin(ctx);if(pm){const lh=pm*1.25,N=[["added: unit offering, course admission, status history",INK],["why: two numbers disagreed",SOFT],["checked against TCSI",SOFT]].map(([s,c])=>[phWrap(ctx,s,348,pm,600),c]),n=N.reduce((p,q)=>p+q[0].length,0);
        glass(ctx,1460,210,400,66+n*lh+20,18,GOOD,{glow:14,ea:0.6,fill:"rgba(7,12,24,0.94)"});T(ctx,"sketch v2",1486,254,{f:"mono",w:500,size:22,color:rgba(GOOD,1)});let k=0;N.forEach(([L,c])=>L.forEach(l=>T(ctx,l,1486,296+(k++)*lh,{w:600,size:18,color:rgba(c,0.95)})));
        const Q=phWrap(ctx,"How do we count short courses and microcredentials?",348,pm,600),qy=210+66+n*lh+44;withA(ctx,fin(t,cE+0.4),()=>{glass(ctx,1460,qy,400,62+Q.length*lh,18,EXT,{glow:18+8*Math.sin(t*4),ea:0.8,fill:"rgba(7,12,24,0.94)"});T(ctx,"A new question",1486,qy+42,{w:800,size:20,color:rgba(EXT,1)});Q.forEach((l,i)=>T(ctx,l,1486,qy+42+(i+1)*lh,{w:600,size:18}));});return;}
      glass(ctx,1460,210,400,250,18,GOOD,{glow:14,ea:0.6,fill:"rgba(7,12,24,0.94)"});T(ctx,"sketch v2",1486,254,{f:"mono",w:500,size:22,color:rgba(GOOD,1)});
      ["added: unit offering,","course admission, status history","why: two numbers disagreed","checked against TCSI"].forEach((s,i)=>T(ctx,s,1486,296+i*38,{w:600,size:18,color:rgba(i<2?INK:SOFT,0.95)}));
      withA(ctx,fin(t,cE+0.4),()=>{glass(ctx,1460,520,400,150,18,EXT,{glow:18+8*Math.sin(t*4),ea:0.8,fill:"rgba(7,12,24,0.94)"});T(ctx,"A new question",1486,562,{w:800,size:20,color:rgba(EXT,1)});T(ctx,"How do we count short courses",1486,600,{w:600,size:18});T(ctx,"and microcredentials?",1486,630,{w:600,size:18});});});
    vign(ctx,S);}
  if(lA>0&&sA<1){const land=c2=>rg_land(c2,S,{x:1780+10*(t-cYl),y:610,z:0.92},t,{dim:0.5});if(lA<1)fc_faded(ctx,lA,land);else land(ctx);setScreen(ctx,S);fc_years(ctx,t,sc,lA);}
  if(sA>0){withA(ctx,sA,()=>bgW(ctx,S,CAM0));setScreen(ctx,S);fc_side(ctx,t,sc,sA);withA(ctx,sA,()=>vign(ctx,S));}
  mtb_end(ctx,S,t,cTg-0.5,"A Sharper Sketch","Check the reference. Fit it to the business.");
});

// where the chapters meet (From words to data's joins.js): the reference model shows the levels' words in other places, so the
// levels leave first, over the bare grid, and then the reference comes in
const CHAPTER_JOINS={leave:["fit"],bare:(ctx,S)=>{bgW(ctx,S,CAM0);vign(ctx,S);}};
