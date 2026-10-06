/* ===== What makes it the same one: the film's own pictures (prefixed sm_) =====
   The past, drawn with care: a sketched profile in graphite, brass calipers that close on it, a tape stretched for the arm
   span, a hand, cards of measurements in ink, an oak card drawer, and fingerprints drawn ridge by ridge. The present, in the
   series' dark glass: code files that say where they run, keys whose stray spaces show as dots, three source streams, a
   person's outline, a hash that rolls out character by character, rule cards with their priority, a wallet, a test list,
   and ninety keys falling into forty-six learners. */

const SM_RUNS="runs on dbt Core · DuckDB",SM_INK=[58,44,32],SM_BRASS=[214,168,84],SM_AMBER=[255,184,80];
const SM_SRC=SRC3.map(s=>s[1]);

/* ---------- the present: code, keys and small cards ---------- */
// a code file on dark glass: its path on the tab (18 px) and where it runs (18 px) on the right. Lines starting with "--" or "#"
// are comments. o.wrap soft-wraps long lines at the card's width, with a hanging indent, as an editor does; o.p types the
// lines out; o.lit[i] lights line i; o.label replaces the label (null hides it). Returns the card's height.
function sm_fileRows(lines,w,sz,wrap){const cw=sz*0.6,max=Math.max(8,Math.floor((w-44)/cw)),out=[];lines.forEach((l,i)=>{if(!wrap||l.length<=max){out.push([l,i]);return;}
  const ind=(l.match(/^\s*(- )?/)||[""])[0].length;let rest=l,first=true;while(rest.length){const lim=first?max:max-ind;if(rest.length<=lim){out.push([(first?"":" ".repeat(ind))+rest,i]);break;}
    let k=rest.lastIndexOf(" ",lim);if(k<=0)k=lim;out.push([(first?"":" ".repeat(ind))+rest.slice(0,k),i]);rest=rest.slice(k).replace(/^ /,"");first=false;}});return out;}
function sm_fileH(lines,w,o){o=o||{};const sz=o.size||19,lh=o.lh||Math.round(sz*1.6);return 74+sm_fileRows(lines,w,sz,o.wrap).length*lh;}
function sm_file(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||19,lh=o.lh||Math.round(sz*1.6),rows=sm_fileRows(lines,w,sz,o.wrap),h=o.h||74+rows.length*lh,col=o.edge||[170,205,255];if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:12+10*(o.hi||0),ea:0.65,fill:"rgba(6,10,20,0.95)"});
    ctx.fillStyle=rgba(col,0.9);rr(ctx,x+16,y+17,10,10,3);ctx.fill();T(ctx,name,x+36,y+29,{f:"mono",w:500,size:18,color:rgba(col,1)});
    const lab=o.label===undefined?SM_RUNS:o.label;if(lab)T(ctx,lab,x+w-18,y+29,{w:600,size:18,align:"right",color:rgba(o.labelCol||SOFT,0.95)});
    ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+44,w-28,1.2);
    const n=o.p==null?rows.length:rows.length*o.p;rows.forEach(([l,i],r)=>{if(r>=n)return;const yy=y+44+lh*0.5+sz*0.42+r*lh+6,q=clamp(n-r,0,1),cm=/^\s*(--|#)/.test(lines[i]),on=o.lit?o.lit[i]||0:0;
      if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(o.litCol||TRUST,0.16);rr(ctx,x+12,yy-sz*0.95,w-24,lh*0.92,6);ctx.fill();});
      T(ctx,typeOn(l,q),x+22,yy,{f:"mono",w:500,size:sz,color:cm?rgba(SOFT,0.85):rgba(mix([200,225,255],o.litCol||TRUST,on*0.6),0.95)});});});return h;}

// a key in a pill, in its source's colour; "·" marks a stray space and is drawn as a visible amber dot. o.pre: a qualifier
// (SIS|, LMS|, SC|) clipped on in front as q goes 0 to 1. Returns the pill's width.
function sm_keyW(s,sz,pre){return ((s+(pre||"")).length)*(sz||22)*0.6+28;}
function sm_key(ctx,x,y,s,col,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||22,cw=sz*0.6,pre=o.pre||"",q=o.q==null?1:o.q,pw=pre.length*cw*ease(q),w=s.length*cw+28+pw,h=sz+20,X=o.align==="center"?x-w/2:x;if(a<=0.01)return w;
  withA(ctx,a,()=>{if(o.hi)glow(ctx,X+w/2,y,w*0.6,o.hiCol||col,0.3*o.hi);glass(ctx,X,y-h/2,w,h,h/2,col,{fill:"rgba(7,12,24,0.94)",glow:10+8*(o.hi||0),ea:0.85});
    if(pre&&q>0){const pa=fin(q,0,0.4);withA(ctx,pa,()=>{ctx.fillStyle=rgba(col,0.22);rr(ctx,X+4,y-h/2+4,pw+14,h-8,(h-8)/2);ctx.fill();T(ctx,pre,X+14,y+sz*0.36-(1-spring(q*1.6))*26,{f:"mono",w:500,size:sz,color:rgba(mix(col,INK,0.35),1)});});}
    let cx=X+14+pw;for(const ch of s){if(ch==="·"){const da=o.dots==null?1:o.dots;if(da>0){glow(ctx,cx+cw/2,y+sz*0.05+(1-da)*30,10,SM_AMBER,0.5*da);ctx.fillStyle=rgba(SM_AMBER,da);ctx.beginPath();ctx.arc(cx+cw/2,y+sz*0.05+(1-da)*30,sz*0.16,0,TAU);ctx.fill();}}
      else T(ctx,ch,cx,y+sz*0.36,{f:"mono",w:500,size:sz,color:rgba(o.ink||col,1)});cx+=cw;}});return w;}

// a small table of query results: column headers, then rows, monospaced; o.col colours the rule; o.lit lights rows
function sm_rows(ctx,x,y,heads,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||18,cw=sz*0.6,lh=o.lh||34,col=o.col||[170,205,255],pad=o.pad||3;
  const ws=heads.map((h,j)=>Math.max(h.length,...rows.map(r=>(r[j]+"").length))*cw),W_=ws.reduce((s,v)=>s+v,0)+pad*cw*(heads.length-1)+40,H_=(rows.length+1)*lh+22;
  withA(ctx,a,()=>{glass(ctx,x,y,W_,H_,12,col,{glow:10,ea:0.6,fill:"rgba(6,10,20,0.95)"});let cx=x+20;
    heads.forEach((h,j)=>{T(ctx,h,cx,y+lh*0.5+sz*0.5+4,{f:"mono",w:500,size:sz,color:rgba(SOFT,0.95)});cx+=ws[j]+pad*cw;});ctx.fillStyle=rgba(col,0.3);ctx.fillRect(x+14,y+lh+6,W_-28,1.2);
    rows.forEach((r,i)=>{const ra=o.rowA?o.rowA[i]:1;if(ra<=0.01)return;withA(ctx,ra,()=>{const yy=y+lh*(i+1.5)+sz*0.5+8;if(o.lit&&o.lit[i]>0)withA(ctx,o.lit[i],()=>{ctx.fillStyle=rgba(o.litCol||TRUST,0.15);rr(ctx,x+10,yy-sz-4,W_-20,lh-2,6);ctx.fill();});
      let c2=x+20;r.forEach((v,j)=>{T(ctx,v+"",c2,yy,{f:"mono",w:500,size:sz,color:rgba(o.cellCol?o.cellCol(i,j):INK,1)});c2+=ws[j]+pad*cw;});});});});return[W_,H_];}

// a person seen as an outline: head and shoulders in dark glass with a luminous edge; o.dash draws it dashed, o.p draws the edge
function sm_bustPath(ctx,x,y,h){const s=h/300;ctx.beginPath();ctx.moveTo(x-150*s,y);ctx.bezierCurveTo(x-150*s,y-70*s,x-120*s,y-108*s,x-58*s,y-122*s);ctx.bezierCurveTo(x-34*s,y-128*s,x-30*s,y-140*s,x-32*s,y-158*s);
  ctx.bezierCurveTo(x-62*s,y-180*s,x-70*s,y-290*s,x,y-300*s);ctx.bezierCurveTo(x+70*s,y-290*s,x+62*s,y-180*s,x+32*s,y-158*s);ctx.bezierCurveTo(x+30*s,y-140*s,x+34*s,y-128*s,x+58*s,y-122*s);
  ctx.bezierCurveTo(x+120*s,y-108*s,x+150*s,y-70*s,x+150*s,y);ctx.closePath();}
function sm_bust(ctx,x,y,h,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=o.p==null?1:o.p;withA(ctx,a,()=>{
  ctx.save();sm_bustPath(ctx,x,y,h);ctx.fillStyle=o.fill||"rgba(8,14,28,0.92)";ctx.shadowColor=rgba(col,0.45);ctx.shadowBlur=24;ctx.globalAlpha*=fin(p,0.4,0.6);ctx.fill();ctx.restore();
  ctx.save();sm_bustPath(ctx,x,y,h);const g=ctx.createLinearGradient(x-h/2,y-h,x+h/2,y);g.addColorStop(0,"rgba(255,255,255,0.08)");g.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.globalAlpha*=fin(p,0.4,0.6);ctx.fill();ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=o.lw||2.6;ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=12;if(o.dash)ctx.setLineDash(o.dash);
  if(p<1){const L=h*3.2;ctx.setLineDash(o.dash?o.dash:[L*p,L]);}sm_bustPath(ctx,x,y,h);ctx.stroke();ctx.restore();});}

// a source's stream: a soft band of its colour from (x0,y0) to (x1,y1), with flecks of data flowing along it
function sm_stream(ctx,x0,y0,x1,y1,col,t,a,p){if(a<=0.01)return;p=p==null?1:p;const pt=u=>{const v=1-u;return[x0+(x1-x0)*u,v*v*v*y0+3*v*v*u*y0+3*v*u*u*y1+u*u*u*y1];};
  withA(ctx,a,()=>{ctx.save();ctx.lineCap="round";[[26,0.05],[12,0.1],[3,0.45]].forEach(([lw,al])=>{ctx.strokeStyle=rgba(col,al);ctx.lineWidth=lw;ctx.beginPath();for(let i=0;i<=40;i++){const q=pt(i/40*p);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();});
    for(let k=0;k<18;k++){const u=((t*0.16+hash(k,31))%1);if(u>p)continue;const q=pt(u),off=(hash(k,32)-0.5)*14;ctx.fillStyle=rgba(col,0.75*Math.sin(Math.PI*u));rr(ctx,q[0]-5,q[1]+off-3,10,6,2);ctx.fill();}ctx.restore();});}

// a system's faint outline, named, holding a key
function sm_sysBox(ctx,x,y,w,h,k,a){if(a<=0.01)return;const[nm,col]=SRC3[k];withA(ctx,a,()=>{ctx.save();ctx.setLineDash([7,7]);ctx.strokeStyle=rgba(col,0.55);ctx.lineWidth=1.8;rr(ctx,x,y,w,h,18);ctx.stroke();ctx.restore();
  ctx.fillStyle=rgba(col,0.05);rr(ctx,x,y,w,h,18);ctx.fill();T(ctx,nm,x+20,y+32,{w:700,size:20,color:rgba(col,0.95)});});}

// a hash, 64 hex characters in two rows of 32: each character rolls, then settles, left to right from t0
function sm_hex(ctx,x,y,hex,t,t0,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||26,cw=sz*0.6,lh=sz*1.35,col=o.col||INK,H="0123456789abcdef";
  withA(ctx,a,()=>{for(let i=0;i<64;i++){const ts=t0+0.5+i*0.016,r=Math.floor(i/32),c=i%32,set=t>=ts;if(t<t0)continue;
    const ch=set?hex[i]:H[Math.floor(hash(i,Math.floor(t*24))*16)];T(ctx,ch,x+c*cw,y+r*lh,{f:"mono",w:500,size:sz,color:rgba(set?col:SOFT,set?1:0.5)});}});}
const SM_H0="0905e6e2b60bd76bfa5c6d3ed43ac6a4d55cf046c2c0cbce4c590300145f76a2",SM_H1="78e86f0409de0bfa214c7b25a2346d10c541a178bcd7fc875a006de515c1b2ef";

// a rule card: its priority in a circle and the rule in words; on lights it, dim greys it, dash draws it as still to come
function sm_rule(ctx,x,y,w,pri,txt,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const on=o.on||0,col=mix(mix(SOFT,LAYER4[1][1],0.5),o.col||LAYER4[1][1],on),h=o.h||60;
  withA(ctx,a*(1-0.55*(o.dim||0)),()=>{if(on>0)glow(ctx,x+w/2,y+h/2,w*0.55,o.col||LAYER4[1][1],0.22*on);
    if(o.dash){ctx.save();ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(col,0.7);ctx.lineWidth=2;rr(ctx,x,y,w,h,14);ctx.stroke();ctx.restore();}
    else glass(ctx,x,y,w,h,14,col,{glow:8+12*on,ea:0.7,fill:"rgba(7,12,24,0.95)"});
    ctx.fillStyle="rgba(7,12,24,1)";ctx.beginPath();ctx.arc(x+34,y+h/2,20,0,TAU);ctx.fill();ring(ctx,x+34,y+h/2,20,col,1,2.4);
    T(ctx,pri+"",x+34,y+h/2+8,{w:800,size:22,align:"center",color:rgba(col,1)});T(ctx,txt,x+68,y+h/2+8,{w:700,size:22,color:rgba(mix(INK,col,0.2),1)});});}

// Aisha's wallet: her credentials as tiles (an award, three microcredentials, a badge); x6 (0..1) slides in a sixth, one she never earned
function sm_wallet(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const x6=o.x6||0,n=5+(x6>0.5?1:0),h=210;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,TRUST,{glow:12,ea:0.75,fill:"rgba(7,12,24,0.95)"});T(ctx,"Aisha's wallet",x+22,y+38,{w:700,size:22,color:rgba(TRUST,1)});
    T(ctx,n+" credentials",x+w-22,y+38,{w:800,size:22,align:"right",color:rgba(x6>0.5?SM_AMBER:INK,1)});
    const K=[["award",TRUST],["micro",KIND],["micro",KIND],["micro",KIND],["badge",[180,150,255]]],tw_=(w-44-5*12)/6;
    K.forEach(([k,c],i)=>{const tx=x+22+i*(tw_+12),ty=y+66;glass(ctx,tx,ty,tw_,104,10,c,{glow:6,ea:0.7,fill:"rgba(10,16,30,0.96)"});ctx.fillStyle=rgba(c,0.85);rr(ctx,tx+10,ty+12,tw_-20,10,4);ctx.fill();
      for(let r=0;r<3;r++){ctx.fillStyle=rgba(c,0.22);rr(ctx,tx+10,ty+36+r*16,(tw_-20)*(0.9-r*0.2),7,3);ctx.fill();}T(ctx,k,tx+tw_/2,ty+94,{w:600,size:18,align:"center",color:rgba(SOFT,1)});});
    if(x6>0.01){const k=spring(x6*1.6),tx=lerp(x+w+80,x+22+5*(tw_+12),k),ty=y+66;withA(ctx,clamp(x6*3,0,1),()=>{glass(ctx,tx,ty,tw_,104,10,SM_AMBER,{glow:14,ea:0.9,fill:"rgba(26,18,6,0.96)"});
      ctx.fillStyle=rgba(KIND,0.85);rr(ctx,tx+10,ty+12,tw_-20,10,4);ctx.fill();for(let r=0;r<3;r++){ctx.fillStyle=rgba(KIND,0.22);rr(ctx,tx+10,ty+36+r*16,(tw_-20)*(0.9-r*0.2),7,3);ctx.fill();}
      T(ctx,"micro",tx+tw_/2,ty+94,{w:600,size:18,align:"center",color:rgba(SM_AMBER,1)});});}});}

// a test list: each test's name, and a tick that lands one after another as on[i] goes 0 to 1
function sm_tests(ctx,x,y,w,names,on,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const lh=42,h=74+names.length*lh;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,GOOD,{glow:10,ea:0.6,fill:"rgba(6,10,20,0.95)"});
  T(ctx,o.title||"dbt build · tests",x+20,y+34,{w:700,size:20,color:rgba(GOOD,1)});ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+50,w-28,1.2);
  names.forEach((n,i)=>{const yy=y+88+i*lh,q=on[i]||0;T(ctx,n,x+20,yy,{f:"mono",w:500,size:18,color:rgba(INK,0.5+0.45*q)});tick_(ctx,x+w-30,yy-6,26,GOOD,q);});});return h;}

// ninety keys (40 student system, 42 learning platform, 8 short courses) fall into forty-six learners: p goes 0 to 1.
// Each key is [source, learner]; the learners are 40 students and 6 keys that are learners of their own.
const SM_KEYS=(()=>{const K=[];for(let i=0;i<40;i++)K.push([0,i]);for(let i=0;i<37;i++)K.push([1,i]);[40,41,42,37,38].forEach(l=>K.push([1,l]));[0,43,44,45,1,2,3,41].forEach(l=>K.push([2,l]));return K;})();
function sm_learners(ctx,x,y,w,h,p,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const cols=8,cs=(w*0.58)/cols,gx=x+w*0.42,cpos=l=>[gx+(l%cols+0.5)*cs,y+(Math.floor(l/cols)+0.5)*cs],n=[0,0,0];
  withA(ctx,a,()=>{for(let l=0;l<46;l++){const[cx,cy]=cpos(l),q=fin(p,0.45+l*0.004,0.25);const c=l<40?SM_SRC[0]:l<43?SM_SRC[1]:SM_SRC[2];ring(ctx,cx,cy,cs*0.34,mix(SOFT,c,0.6),q*0.9,2);if(l===0&&o.hi)glow(ctx,cx,cy,cs*0.8,TRUST,0.45*o.hi);}
    SM_KEYS.forEach(([s,l],k)=>{const i=n[s]++,sx=x+30+s*70+(i%3)*18,sy=y+16+Math.floor(i/3)*(h-140)/14,[cx,cy]=cpos(l),an=k*2.4,u=ease(fin(p,0.1+k*0.004,0.45)),
      px=lerp(sx,cx+Math.cos(an)*cs*0.16,u),py=lerp(sy,cy+Math.sin(an)*cs*0.16,u)-Math.sin(Math.PI*u)*30;ctx.fillStyle=rgba(SM_SRC[s],0.95);ctx.beginPath();ctx.arc(px,py,5,0,TAU);ctx.fill();});});
  return cpos;}

/* ---------- the past: drawn with care ---------- */
// a man's head in profile, facing right, sketched in graphite: tapering strokes, a shaded side, hair, an ear; p draws it
function sm_profile(ctx,x,y,s,p,t){if(p<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(s,s);const br=Math.sin(t*1.1)*0.6;ctx.translate(0,br);
  const stroke=(pts,w0,w1,q,al)=>{if(q<=0)return;const n=24;for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n;if(u0>q)break;const P0=sm_bz(pts,u0),P1=sm_bz(pts,Math.min(u1,q));ctx.strokeStyle="rgba(46,38,32,"+(al||0.85)+")";ctx.lineWidth=lerp(w0,w1,Math.sin(Math.PI*u0))+0.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(P0[0],P0[1]);ctx.lineTo(P1[0],P1[1]);ctx.stroke();}};
  const q=k=>clamp(p*6-k,0,1);
  // the shaded side, under everything: soft graphite on the back of the head and under the jaw
  if(q(3)>0){ctx.save();ctx.globalAlpha*=q(3)*0.5;const g=ctx.createRadialGradient(-60,-30,10,-60,-10,150);g.addColorStop(0,"rgba(60,50,40,0.35)");g.addColorStop(1,"rgba(60,50,40,0)");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(-40,-20,140,150,0,0,TAU);ctx.fill();
    ctx.strokeStyle="rgba(60,50,40,0.28)";ctx.lineWidth=1;for(let k=0;k<16;k++){ctx.beginPath();ctx.moveTo(-150+k*7,40+k*2);ctx.lineTo(-110+k*7,-20+k*2);ctx.stroke();}ctx.restore();}
  // the face: brow, nose, lips, chin, then the jaw and the neck
  stroke([[40,-170],[78,-150],[96,-110],[92,-80]],1.5,3.2,q(0));
  stroke([[92,-80],[100,-64],[122,-40],[118,-26]],1.5,3.4,q(0.6));
  stroke([[118,-26],[108,-20],[104,-14],[110,-6]],1.4,2.6,q(1.0));
  stroke([[110,-6],[102,6],[110,14],[104,24]],1.4,2.8,q(1.3));
  stroke([[104,24],[100,44],[90,58],[70,62]],1.6,3.2,q(1.6));
  stroke([[70,62],[36,64],[10,52],[-6,30]],1.4,2.8,q(2.0));
  stroke([[24,62],[22,100],[16,140],[18,180]],1.4,3.0,q(2.3));
  stroke([[-96,40],[-92,90],[-88,140],[-80,180]],1.4,3.0,q(2.5));
  // the back of the head and the hair, in loose strokes
  stroke([[40,-170],[-20,-200],[-120,-170],[-140,-80]],1.6,3.6,q(2.8));
  stroke([[-140,-80],[-150,-20],[-120,30],[-96,40]],1.6,3.4,q(3.2));
  for(let k=0;k<9;k++)stroke([[30-k*16,-176+k*3],[0-k*14,-196+k*6],[-50-k*10,-186+k*12],[-80-k*6,-150+k*14]],0.6,1.6,q(3.4+k*0.08),0.55);
  // the ear, the eye and the brow
  stroke([[-30,-60],[-6,-80],[12,-40],[-8,-10]],1.2,2.6,q(4.2));stroke([[-16,-48],[-6,-56],[2,-38],[-8,-26]],0.8,1.4,q(4.4),0.6);
  stroke([[62,-92],[70,-98],[80,-96],[86,-90]],1.0,2.4,q(4.6));stroke([[56,-112],[66,-120],[82,-118],[92,-110]],1.4,3.0,q(4.7));
  ctx.restore();}
function sm_bz(P,u){const v=1-u;return[v*v*v*P[0][0]+3*v*v*u*P[1][0]+3*v*u*u*P[2][0]+u*u*u*P[3][0],v*v*v*P[0][1]+3*v*v*u*P[1][1]+3*v*u*u*P[2][1]+u*u*u*P[3][1]];}
// a left hand, palm down, fingers spread a little, sketched like the head
function sm_hand(ctx,x,y,s,p,t){if(p<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(Math.sin(t*0.7)*0.01);
  const F=[[-62,-10,-92,-150,14],[-26,-30,-40,-196,15],[8,-32,10,-212,15.5],[40,-26,54,-188,14.5],[66,0,104,-110,13]];
  ctx.save();ctx.globalAlpha*=clamp(p*2,0,1);const g=ctx.createLinearGradient(-80,-200,80,60);g.addColorStop(0,"rgba(236,214,186,0.5)");g.addColorStop(1,"rgba(150,120,90,0.45)");ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(-70,10);ctx.bezierCurveTo(-80,60,-40,96,6,96);ctx.bezierCurveTo(54,96,84,60,74,6);ctx.bezierCurveTo(60,-30,-56,-34,-70,10);ctx.fill();
  F.forEach(([bx,by,tx,ty,r],i)=>{const q=clamp(p*5-i*0.6,0,1);if(q<=0)return;const ex=lerp(bx,tx,q),ey=lerp(by,ty,q),an=Math.atan2(ey-by,ex-bx);ctx.save();ctx.translate(bx,by);ctx.rotate(an);const L=Math.hypot(ex-bx,ey-by);
    ctx.beginPath();ctx.moveTo(0,-r);ctx.bezierCurveTo(L*0.5,-r*1.05,L-r,-r*0.85,L,0);ctx.bezierCurveTo(L-r,r*0.85,L*0.5,r*1.05,0,r);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(46,38,32,0.75)";ctx.lineWidth=2;ctx.stroke();ctx.strokeStyle="rgba(46,38,32,0.35)";ctx.lineWidth=1;[0.38,0.68].forEach(k=>{ctx.beginPath();ctx.moveTo(L*k,-r*0.6);ctx.quadraticCurveTo(L*k+3,0,L*k,r*0.6);ctx.stroke();});ctx.restore();});
  ctx.strokeStyle="rgba(46,38,32,0.8)";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-70,10);ctx.bezierCurveTo(-80,60,-40,96,6,96);ctx.bezierCurveTo(54,96,84,60,74,6);ctx.stroke();
  ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-34,96);ctx.lineTo(-38,150);ctx.moveTo(44,94);ctx.lineTo(48,150);ctx.stroke();ctx.restore();ctx.restore();}
// brass calipers, hinged at (x,y), opened to a gap between the tips, pointing along angle an (radians, 0 = down); len is the arm's length
function sm_calipers(ctx,x,y,len,gap,an,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(an);const hw=gap/2;
  [-1,1].forEach(sd=>{const g=ctx.createLinearGradient(sd*hw-12,0,sd*hw+12,len);g.addColorStop(0,"rgb(246,212,140)");g.addColorStop(0.5,rgba(SM_BRASS,1));g.addColorStop(1,"rgb(120,84,34)");
    ctx.fillStyle=g;ctx.strokeStyle="rgba(70,46,16,0.8)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-sd*4,0);ctx.bezierCurveTo(sd*(hw*0.9+len*0.45),len*0.25,sd*(hw+len*0.35),len*0.75,sd*hw+sd*2,len);
    ctx.lineTo(sd*hw-sd*4,len-2);ctx.bezierCurveTo(sd*(hw+len*0.27),len*0.72,sd*(hw*0.9+len*0.36),len*0.27,sd*6,4);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle="rgba(255,240,200,0.5)";ctx.beginPath();ctx.arc(sd*hw,len,3,0,TAU);ctx.fill();});
  const g=ctx.createRadialGradient(-3,-3,1,0,0,13);g.addColorStop(0,"rgb(255,232,170)");g.addColorStop(1,"rgb(130,90,36)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,12,0,TAU);ctx.fill();ctx.strokeStyle="rgba(70,46,16,0.9)";ctx.stroke();
  ctx.restore();});}
// a measuring tape stretched between two brass ends, unrolled as p goes 0 to 1
function sm_tape(ctx,x0,x1,y,p,a){if(a<=0.01||p<=0)return;withA(ctx,a,()=>{const xe=lerp(x0,x1,ease(p));ctx.fillStyle="rgba(232,214,160,0.95)";ctx.fillRect(x0,y-9,xe-x0,18);ctx.strokeStyle="rgba(120,90,40,0.6)";ctx.lineWidth=1;ctx.strokeRect(x0,y-9,xe-x0,18);
  for(let k=0;x0+k*12<xe;k++){ctx.strokeStyle="rgba(60,44,24,0.7)";ctx.beginPath();ctx.moveTo(x0+k*12,y-9);ctx.lineTo(x0+k*12,y-9+(k%5?5:10));ctx.stroke();}
  [x0,xe].forEach(xx=>{ctx.fillStyle=rgba(SM_BRASS,1);rr(ctx,xx-6,y-15,12,30,3);ctx.fill();ctx.strokeStyle="rgba(70,46,16,0.8)";ctx.stroke();});});}
// a card of measurements in ink, its rows written out as on[i] goes 0 to 1
function sm_card(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{kt_paper(ctx,x,y,w,h,t,{seed:o.seed||3,col:[238,226,200],curl:0.6});
  ctx.strokeStyle="rgba(150,90,60,0.35)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+18,y+62);ctx.lineTo(x+w-18,y+62);ctx.stroke();
  if(o.title)T(ctx,o.title,x+24,y+44,{w:800,size:24,color:rgba(SM_INK,0.95)});
  (o.rows||[]).forEach(([k,v],i)=>{const q=o.on?o.on[i]||0:1,yy=y+104+i*46;if(q<=0)return;T(ctx,k,x+24,yy,{w:600,size:22,color:rgba(SM_INK,0.8*clamp(q*3,0,1))});
    T(ctx,typeOn(v,q),x+w-24,yy,{f:"mono",w:500,size:24,align:"right",color:"rgba(40,40,90,0.92)"});ctx.strokeStyle="rgba(90,130,190,0.2)";ctx.beginPath();ctx.moveTo(x+18,yy+14);ctx.lineTo(x+w-18,yy+14);ctx.stroke();});});}
// an oak drawer of cards, seen from above and in front; the cards stand on end, sorted by their numbers
function sm_drawer(ctx,x,y,w,h,t,a){if(a<=0.01)return;withA(ctx,a,()=>{const d=h*0.55;
  ctx.fillStyle="rgb(58,36,20)";ctx.beginPath();ctx.moveTo(x+30,y);ctx.lineTo(x+w-30,y);ctx.lineTo(x+w,y+d);ctx.lineTo(x,y+d);ctx.closePath();ctx.fill();
  for(let i=0;i<22;i++){const u=(i+0.5)/22,cx=lerp(x+40,x+w-40,u),top=y+8+Math.sin(i*1.7)*3;ctx.fillStyle=i%2?"rgb(232,220,192)":"rgb(222,208,178)";ctx.fillRect(cx-9,top,18,d-8);ctx.fillStyle="rgba(120,90,60,0.4)";ctx.fillRect(cx+8,top,2,d-8);
    if(i%4===1){ctx.fillStyle="rgb(214,196,160)";ctx.fillRect(cx-9,top-12,18,14);}}
  const g=ctx.createLinearGradient(x,y+d,x,y+h);g.addColorStop(0,"rgb(140,92,52)");g.addColorStop(1,"rgb(92,58,30)");ctx.fillStyle=g;ctx.fillRect(x,y+d,w,h-d);
  ctx.strokeStyle="rgba(60,34,14,0.45)";ctx.lineWidth=1.2;for(let k=0;k<7;k++){ctx.beginPath();ctx.moveTo(x,y+d+8+k*(h-d-12)/6);for(let xx=0;xx<=w;xx+=40)ctx.lineTo(x+xx,y+d+8+k*(h-d-12)/6+Math.sin(xx*0.02+k*1.3)*3);ctx.stroke();}
  ctx.fillStyle="rgba(255,230,190,0.18)";ctx.fillRect(x,y+d,w,3);
  const hx=x+w/2,hy=y+d+(h-d)/2;ctx.fillStyle=rgba(SM_BRASS,1);rr(ctx,hx-50,hy-12,100,24,8);ctx.fill();ctx.strokeStyle="rgba(70,46,16,0.9)";ctx.lineWidth=1.5;rr(ctx,hx-50,hy-12,100,24,8);ctx.stroke();
  ctx.fillStyle="rgb(240,228,200)";ctx.fillRect(hx-62,hy-50,124,32);ctx.strokeStyle="rgba(70,46,16,0.6)";ctx.strokeRect(hx-62,hy-50,124,32);T(ctx,"19.0–19.9",hx,hy-27,{f:"mono",w:500,size:18,align:"center",color:rgba(SM_INK,1)});});}
// a fingerprint in ink, drawn ridge by ridge as p goes 0 to 1: kind 0 is a loop, kind 1 a whorl
function sm_print(ctx,x,y,r,kind,p,a){if(a<=0.01||p<=0)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.ellipse(0,0,r*0.78,r,0,0,TAU);ctx.clip();
  const g=ctx.createRadialGradient(0,0,r*0.2,0,0,r);g.addColorStop(0,"rgba(40,30,40,0.06)");g.addColorStop(1,"rgba(40,30,40,0)");ctx.fillStyle=g;ctx.fillRect(-r,-r,2*r,2*r);
  ctx.strokeStyle="rgba(36,30,48,0.85)";ctx.lineCap="round";const N=17;
  for(let k=0;k<N;k++){const q=clamp(p*N*1.1-k,0,1);if(q<=0)continue;ctx.lineWidth=2.2+0.5*Math.sin(k*1.3);ctx.beginPath();const R=6+k*r*0.075;
    if(kind===1){for(let i=0;i<=60*q;i++){const an=i/60*TAU*1.0+k*0.4,rr_=R*(1+0.08*Math.sin(an*3+k)),px=Math.cos(an)*rr_*0.82,py=Math.sin(an)*rr_+R*0.05;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}}
    else{for(let i=0;i<=50*q;i++){const u=i/50,an=Math.PI*(0.05+1.9*u),px=-r*0.12+Math.cos(an)*R*0.7-Math.sin(u*Math.PI)*R*0.1,py=-r*0.15-Math.sin(an)*R*0.95+(u>0.5?(u-0.5)*R*1.6:0)+(u<0.5?(0.5-u)*R*0.9:0);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}}
    ctx.stroke();}
  for(let k=0;k<6;k++){const q=clamp(p*8-k-2,0,1);if(q<=0)continue;ctx.lineWidth=2.2;ctx.beginPath();const yy=r*0.55+k*r*0.09;ctx.moveTo(-r,yy+r*0.1);ctx.quadraticCurveTo(0,yy-r*0.25,lerp(-r,r,q),yy+r*0.1);ctx.stroke();}
  ctx.restore();});}

/* ---------- the labs' and scenarios' pictures ----------
   Added to the film bundle's LV registry (Keeping it true's true.js defines it; these keys are prefixed sm_ so they never clash).
   assets/from-words-to-data/learn.js calls each as f(ctx, w, h, state, L): a lab passes its state (compose: {pick}; sort: {pick, checked};
   pick: {pick}; steps: {step}), a scenario passes {q}. Under 560 css px wide (sm_narrow), each lab draws a phone layout with larger words. Any words come from L.vis (the page's learn.en.js or learn.es.js), so each language
   draws its own; keys, file names and hashes are the same in both. */
function sm_fit(c,w,h,bw,bh){const k=Math.min(w/bw,h/bh);c.translate((w-bw*k)/2,(h-bh*k)/2);c.scale(k,k);}
function sm_lab(L,id){return (L.labs||[]).find(x=>x.id===id)||{w:{}};}
function sm_short(hx){return hx?hx.slice(0,8)+"…"+hx.slice(-5):"null";}
// the seven keys of Break the hash: the parts typed, then [string, hash] the raw (or naive) way and the macro's way, and how each reads
const SM_E="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",SM_N1="eb1b4c34dd3372e1523a56b490f0620a99f309f43073320490d5ae54636e2534";
const SM_HSTEPS=[
  {parts:["SIS|S-20417"],raw:["SIS|S-20417",SM_H0],mac:["SIS|S-20417",SM_H0],ra:"same",ma:"same"},
  {parts:["SIS|S-20417·"],raw:["SIS|S-20417·",SM_H1],mac:["SIS|S-20417",SM_H0],ra:"changed",ma:"same"},
  {parts:["sis|s-20417"],raw:["sis|s-20417","8c73518cf662e82e5a12c6951dc494924bce32098a7b9ef3fc3023b836e2447e"],mac:["SIS|S-20417",SM_H0],ra:"changed",ma:"same"},
  {parts:["S-20417","GCDA"],raw:["S-20417GCDA","092fe84979faa2b91b3d24d33c5457ec5881724758a9998ec988ba68eb4bc111"],mac:["S-20417|GCDA","6461c940bdf522268a1f7660374d1a74b4d6cb33b63c2fbc8fa5b0ca8560ca9b"]},
  {parts:["S-20417","··"],raw:["S-20417",SM_N1],mac:["S-20417|<null>","2be6f4e3ac839cbad84df8bcdb4763bebaf0ad201362bfa66de72115c8665e83"]},
  {parts:["··","S-20417"],raw:["S-20417",SM_N1],mac:["<null>|S-20417","f30f0e2a439b5fdf47437d7dfe4065cd808e41022420195781c86c90733aaf26"],ra:"collide",ma:"distinct"},
  {parts:["··","··"],raw:["''",SM_E],mac:["null",null],ra:"blank",ma:"noHash"}];
// Same learner?: the four pairs (left key, its source; right key), and which pairs each way of matching links
const SM_PAIRS=[["SC|aisha.k@mail.example",2,"SIS|S-20417"],["LMS|u-88213",1,"SIS|S-20417"],["SC|nguyen.family@mail.example",2,"SIS|S-20436"],["LMS|u-88231",1,"SIS|S-20417"]];
const SM_LINK={typed:[0,0,0,0],email:[1,1,1,0],rules:[1,1,0,1],decide:[1,1,1,0]};
// Rules in order: the four keys run down the user's stack; fits lists the rules (by item) each key fits, as the SQL proposes them
// (the email rule also proposes Aisha's account, whose email is her student email; a student ID fits only its own rule)
const SM_RUN=[["SIS|S-20417",0,[1]],["LMS|u-88213",1,[2,3,4]],["SC|aisha.k@mail.example",2,[3,4]],["LMS|u-88231",1,[0,2,4]]];
function sm_verdict(c,x,y,v,s){s=s||40;if(v===1||v===true)tick_(c,x,y,s,GOOD,1);else if(v===0.5){c.fillStyle=rgba(SM_AMBER,1);c.beginPath();c.arc(x,y,s*0.24,0,TAU);c.fill();}else cross_(c,x,y,s,BAD,1);}
// a phone-width page: the canvas is under 560 css px wide, so each lab draws a simpler layout with larger words
function sm_narrow(c){const cw=c.canvas&&c.canvas.clientWidth;return !!cw&&cw<560;}
// text that shrinks to fit maxW, never below o.min
function sm_T(c,s,x,y,maxW,o){o=Object.assign({},o);let sz=o.size||28;const fl=o.min||Math.round(sz*0.8);while(sz>fl&&tw(c,s,sz,o.w||600,o.f)>maxW)sz-=1;o.size=sz;T(c,s,x,y,o);return sz;}
// where a key lands in the user's stack, and how that reads
function sm_land(V,pk,ord,j){const fits=SM_RUN[j][2],land=ord.find(i=>fits.includes(i));let txt=V.unplaced,good=null;
  if(land!=null){const own=land===4||land===0;if(j<3){good=!own;txt=own?V.ownLearner:"SIS|S-20417";}else{good=land!==2;txt=land===2?V.wrongMerge:V.ownLearner;}}
  return{head:V.lands+" "+(land==null?"—":pk[land])+":",txt,good};}
// the decision tag a pair carries when decisions are on
const SM_PAIRDEC=[null,null,"D-001","D-003"];
Object.assign(LV,{
  // claim and evidence: each claim, and the evidence picked for it (a query and its result, or a guess), teal when it proves the claim
  sm_l_claims:(c,w,h,st,L)=>{const V=L.vis,S=sm_lab(L,"claims").w.slots||[];c.save();
    if(sm_narrow(c)){sm_fit(c,w,h,960,565);V.claims.forEach((cl,i)=>{const y=i*113,p=st.pick?st.pick[i]:null,o=p==null?null:S[i].opts[p];
        if(!o){c.save();c.setLineDash([10,10]);c.strokeStyle=rgba(SOFT,0.6);c.lineWidth=3;rr(c,8,y+6,944,100,16);c.stroke();c.restore();}
        else glass(c,8,y+6,944,100,16,o.ok?[111,214,200]:BAD,{glow:8,ea:0.8,fill:"rgba(6,10,20,0.95)"});
        sm_T(c,cl,28,y+46,830,{w:700,size:32,min:26,color:rgba(INK,1)});
        if(!o){T(c,V.query+" · "+V.result+" …",28,y+90,{w:600,size:28,color:rgba(SOFT,0.85)});return;}
        if(o.t.indexOf("→")<0){T(c,V.noQuery,28,y+90,{w:600,size:28,color:rgba(SOFT,1)});tag(c,28+tw(c,V.noQuery,28,600)+20,y+81,V.guess,SOFT,{size:26});}
        else T(c,o.t.split(" → ")[0],28,y+90,{f:"mono",w:500,size:30,color:rgba(o.ok?[111,214,200]:BAD,1)});
        sm_verdict(c,906,y+56,o.ok?1:0,44);});c.restore();return;}
    sm_fit(c,w,h,900,530);
    V.claims.forEach((cl,i)=>{const y=6+i*104,p=st.pick?st.pick[i]:null,o=p==null?null:S[i].opts[p];
      T(c,V.claim+" · "+cl,20,y+24,{w:700,size:22,color:rgba(INK,1)});
      if(!o){c.save();c.setLineDash([8,8]);c.strokeStyle=rgba(SOFT,0.6);c.lineWidth=2;rr(c,20,y+36,860,60,12);c.stroke();c.restore();T(c,V.query+" · "+V.result,450,y+73,{w:600,size:20,align:"center",color:rgba(SOFT,0.8)});return;}
      const col=o.ok?[111,214,200]:BAD,gs=o.t.indexOf("→")<0;glass(c,20,y+36,860,60,12,col,{glow:10,ea:0.8,fill:"rgba(6,10,20,0.95)"});
      if(gs){T(c,V.noQuery,40,y+74,{w:600,size:21,color:rgba(SOFT,1)});tag(c,866-tw(c,V.guess,18,700)-26,y+66,V.guess,SOFT,{size:18});}
      else{const[qn,rs]=o.t.split(" → ");T(c,qn,40,y+74,{f:"mono",w:500,size:19,color:rgba(col,1)});T(c,"→ "+rs,46+tw(c,qn,19,500,"mono"),y+74,{f:"mono",w:500,size:19,color:rgba(INK,0.95)});}});c.restore();},
  // rules in order: the stack in the user's order, and where each of four keys lands (on a phone, the keys alone, larger)
  sm_l_rules:(c,w,h,st,L)=>{const V=L.vis,pk=st.pick||{},ord=[0,1,2,3,4].filter(i=>pk[i]!=null).sort((a,b)=>(+pk[a])-(+pk[b])||a-b);c.save();
    const lc=g=>rgba(g==null?SOFT:g?GOOD:BAD,1);
    if(sm_narrow(c)){sm_fit(c,w,h,960,440);SM_RUN.forEach(([k,s],j)=>{const y=36+j*110,r=sm_land(V,pk,ord,j);sm_key(c,16,y,k,SM_SRC[s],{size:30});
        T(c,r.head,24,y+62,{w:600,size:30,color:rgba(SOFT,1)});sm_T(c,r.txt,24+tw(c,r.head,30,600)+12,y+62,920-tw(c,r.head,30,600),{w:700,size:30,min:24,color:lc(r.good)});});c.restore();return;}
    sm_fit(c,w,h,1000,458);
    [0,1,2,3,4].forEach(r=>{const y=10+r*88,i=ord[r];if(i==null){sm_rule(c,20,y,520,"·",V.unplaced,{dash:1,h:72});return;}
      const ok=st.checked?(pk[i]===sm_lab(L,"rules").w.items[i].b):null;sm_rule(c,20,y,520,pk[i],V.rules[i],{h:72,on:ok===false?0.9:0.6,col:ok===false?BAD:i===0?TRUST:LAYER4[1][1]});});
    SM_RUN.forEach(([k,s],j)=>{const y=50+j*108,r=sm_land(V,pk,ord,j);sm_key(c,580,y,k,SM_SRC[s],{size:22});
      T(c,r.head,596,y+48,{w:600,size:22,color:rgba(SOFT,1)});sm_T(c,r.txt,596+tw(c,r.head,22,600)+8,y+48,392-tw(c,r.head,22,600),{w:700,size:22,min:18,color:lc(r.good)});});c.restore();},
  // same learner?: four pairs, linked or not by the way of matching chosen, each with its verdict; a wrong link is red and dashed
  sm_l_same:(c,w,h,st,L)=>{const V=L.vis,k=st.pick||"typed",res=(sm_lab(L,"same").w.res||{})[k]||[],ln=SM_LINK[k]||[];c.save();
    const link=(i,x0,x1,y,lw)=>{const bad=ln[i]&&res[i]===0;c.save();if(ln[i]){c.strokeStyle=rgba(bad?BAD:GOOD,0.9);c.lineWidth=lw;if(bad)c.setLineDash([10,8]);}
      else{c.strokeStyle=rgba(SOFT,0.4);c.lineWidth=lw*0.7;c.setLineDash([4,10]);}c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();c.restore();};
    if(sm_narrow(c)){sm_fit(c,w,h,960,420);SM_PAIRS.forEach(([a,s,b],i)=>{const y=i*105,d=k==="decide"&&SM_PAIRDEC[i];let tx=880;
        if(d){tx-=tw(c,d,26,700)+26;tag(c,tx,y+24,d,TRUST,{size:26});}sm_T(c,V.pairs[i],16,y+34,tx-36,{w:600,size:30,min:24,color:rgba(SOFT,1)});sm_verdict(c,922,y+24,res[i],40);
        const wa=sm_key(c,10,y+78,a,SM_SRC[s],{size:30}),wb=sm_keyW(b,30);link(i,10+wa+10,950-wb-10,y+78,4);sm_key(c,950-wb,y+78,b,SM_SRC[0],{size:30});});c.restore();return;}
    sm_fit(c,w,h,1000,437);
    SM_PAIRS.forEach(([a,s,b],i)=>{const y=62+i*106;T(c,V.pairs[i],20,y-32,{w:600,size:22,color:rgba(SOFT,1)});const wa=sm_key(c,20,y,a,SM_SRC[s],{size:22});
      const x0=20+wa+12,x1=690;link(i,x0,x1-12,y,3);
      if(k==="decide"&&SM_PAIRDEC[i])tag(c,(x0+x1)/2,y,SM_PAIRDEC[i],TRUST,{align:"center",size:20});
      sm_key(c,x1,y,b,SM_SRC[0],{size:22});sm_verdict(c,945,y,res[i]);});c.restore();},
  // break the hash: the parts typed; the raw (or naive) hash beside the macro's, each saying what happened
  sm_l_hash:(c,w,h,st,L)=>{const V=L.vis,S=SM_HSTEPS[st.step||0],two=S.parts.length>1;c.save();
    const colOf=v=>v==="same"||v==="distinct"||v==="noHash"?GOOD:v?BAD:[170,205,255],say=v=>V[v]||(v==="blank"?V.collide:"");
    const sides=[[two?V.naive:V.raw,S.raw,S.ra],[V.macro,S.mac,S.ma]];
    if(sm_narrow(c)){sm_fit(c,w,h,960,376);T(c,V.parts+":",16,46,{w:600,size:30,color:rgba(SOFT,1)});let x=16+tw(c,V.parts+":",30,600)+16;S.parts.forEach(p=>{x+=sm_key(c,x,36,p,SM_SRC[0],{size:30})+14;});
      sides.forEach(([lab,[s,hx],v],r)=>{const Y=72+r*152,col=colOf(v);glass(c,8,Y,944,146,16,col,{glow:8,ea:0.7,fill:"rgba(6,10,20,0.95)"});
        sm_T(c,lab,28,Y+38,900,{w:700,size:28,min:22,color:rgba(col,1)});
        T(c,s.replace(/·/g,"␣")+"  →  "+sm_short(hx),28,Y+86,{f:"mono",w:500,size:30,color:rgba(INK,1)});
        if(v)tag(c,28,Y+122,say(v),col,{size:26});});c.restore();return;}
    sm_fit(c,w,h,1000,392);
    T(c,V.parts+":",20,48,{w:600,size:22,color:rgba(SOFT,1)});let x=20+tw(c,V.parts+":",22,600)+14;S.parts.forEach(p=>{x+=sm_key(c,x,40,p,SM_SRC[0],{size:24})+12;});
    sides.forEach(([lab,[s,hx],v],r)=>{const X=15+r*500,col=colOf(v);
      glass(c,X,78,470,304,16,col,{glow:10,ea:0.7,fill:"rgba(6,10,20,0.95)"});sm_T(c,lab,X+20,116,430,{w:700,size:22,min:18,color:rgba(col,1)});
      T(c,s.replace(/·/g,"␣"),X+20,164,{f:"mono",w:500,size:24,color:rgba(INK,1)});
      if(hx)sm_hex(c,X+20,222,hx,100,0,{size:22,col:mix(INK,col,0.35)});
      if(v){let ts=22;while(ts>17&&tw(c,say(v),ts,700)+26>440)ts--;tag(c,X+235,344,say(v),col,{align:"center",size:ts});}});c.restore();},
  // the scenarios: each drawn in an 800 x 427 frame, so its smallest words (26) stay about 12 px on a phone
  sm_q_ticket:(c,w,h,st,L)=>{const V=L.vis;c.save();sm_fit(c,w,h,800,427);tag(c,24,40,V.q.ticket,TRUST,{size:26});sm_T(c,V.q.two,24,104,752,{w:700,size:32,min:26});
    [["LMS|u-88213",200],["LMS|u-88231",330]].forEach(([k,y])=>{const wk=sm_key(c,24,y,k,SM_SRC[1],{size:28});arrowTo(c,24+wk+14,y,512,266,SM_SRC[1],0.8,{head:16});});
    sm_key(c,526,266,"SIS|S-20417",SM_SRC[0],{size:28});T(c,"?",632,212,{w:800,size:56,align:"center",color:rgba(TRUST,1)});c.restore();},
  sm_q_email:(c,w,h,st,L)=>{const V=L.vis;c.save();sm_fit(c,w,h,800,427);T(c,V.q.email,400,44,{w:700,size:28,align:"center",color:rgba(SOFT,1)});sm_key(c,400,96,"…@mail.example",[200,210,230],{size:28,align:"center"});
    arrowTo(c,360,122,190,240,SM_SRC[0],0.8,{head:16});ring(c,180,286,46,SM_SRC[0],1,4);T(c,V.q.students,180,384,{w:700,size:28,align:"center",color:rgba(SM_SRC[0],1)});
    [530,690].forEach(x=>{arrowTo(c,440,122,x,240,SM_SRC[1],0.8,{head:16});ring(c,x,286,46,SM_SRC[1],1,4);});T(c,V.q.accounts,610,384,{w:700,size:28,align:"center",color:rgba(SM_SRC[1],1)});c.restore();},
  sm_q_agent:(c,w,h,st,L)=>{const V=L.vis;c.save();sm_fit(c,w,h,800,427);kt_agent(c,104,190,44,0,{});T(c,V.q.agent,104,280,{w:700,size:28,align:"center",color:rgba([111,214,200],1)});
    c.save();c.globalAlpha*=0.55;glass(c,214,60,566,270,18,SOFT,{glow:6,ea:0.6,fill:"rgba(6,10,20,0.95)"});c.restore();
    T(c,V.claim+":",238,112,{w:600,size:28,color:rgba(SOFT,1)});tag(c,756-tw(c,V.guess,26,700)-26,104,V.guess,SOFT,{size:26});
    sm_T(c,V.q.uniq,238,170,520,{f:"mono",w:500,size:30,min:24,color:rgba(INK,0.85)});
    T(c,V.query+": —",238,236,{w:600,size:28,color:rgba(SOFT,1)});T(c,V.result+": —",238,292,{w:600,size:28,color:rgba(SOFT,1)});
    sm_T(c,V.q.noq,497,388,560,{w:700,size:28,align:"center",color:rgba(SM_AMBER,1)});c.restore();},
  sm_q_morning:(c,w,h,st,L)=>{const V=L.vis;c.save();sm_fit(c,w,h,800,427);T(c,V.q.vendor+":",24,44,{w:600,size:28,color:rgba(SOFT,1)});sm_key(c,24,98,"AISHA.K@MAIL.EXAMPLE",SM_SRC[2],{size:28});
    [["SC|aisha.k@mail.example","0f45f571…b10f5",SOFT],["SC|AISHA.K@MAIL.EXAMPLE","deac2049…009b4",BAD]].forEach(([k,hx,col],i)=>{const y=178+i*92;
      T(c,"sha256('"+k+"')",24,y,{f:"mono",w:500,size:26,color:rgba(INK,0.9)});T(c,"= "+hx,24,y+38,{f:"mono",w:500,size:26,color:rgba(col,1)});});
    sm_T(c,V.q.morning,400,404,752,{w:700,size:28,min:24,align:"center",color:rgba(BAD,1)});c.restore();},
  sm_q_pr:(c,w,h,st,L)=>{const V=L.vis;c.save();sm_fit(c,w,h,800,427);tag(c,24,36,V.q.pr+" · "+V.q.drop,SM_AMBER,{size:26});
    c.save();c.translate(24,70);c.scale(1.36,1.36);sm_file(c,0,0,552,"models/core/student/_core_student__models.yml",["      - name: learner_key","        …","      - name: learner_bk"],{size:19,lh:32,label:null,lit:{2:1},litCol:BAD});c.restore();
    T(c,V.runs,776,350,{w:600,size:24,align:"right",color:rgba(SOFT,0.95)});
    T(c,"learner_key 0905e6e2…   learner_bk SIS|S-20417",400,404,{f:"mono",w:500,size:26,align:"center",color:rgba(INK,0.9)});c.restore();},
  sm_q_wallet:(c,w,h,st,L)=>{const V=L.vis;c.save();sm_fit(c,w,h,800,427);glass(c,24,60,450,280,18,TRUST,{glow:12,ea:0.75,fill:"rgba(7,12,24,0.95)"});
    sm_T(c,V.q.wallet,46,104,406,{w:700,size:28,min:24,color:rgba(TRUST,1)});T(c,"6 "+V.q.creds,46,142,{w:800,size:28,color:rgba(SM_AMBER,1)});
    [TRUST,KIND,KIND,KIND,[180,150,255],SM_AMBER].forEach((col,i)=>{const x=46+i*70;glass(c,x,170,58,146,10,col,{glow:6,ea:0.8,fill:"rgba(10,16,30,0.96)"});c.fillStyle=rgba(i===5?KIND:col,0.85);rr(c,x+8,184,42,10,4);c.fill();
      for(let r=0;r<4;r++){c.fillStyle=rgba(i===5?KIND:col,0.22);rr(c,x+8,212+r*22,42*(0.9-r*0.15),8,3);c.fill();}});
    glass(c,500,60,276,280,18,GOOD,{glow:10,ea:0.6,fill:"rgba(6,10,20,0.95)"});const gl=V.q.green.split(": ");
    gl.forEach((s,i)=>sm_T(c,s+(i<gl.length-1?":":""),520,104+i*36,236,{w:700,size:26,min:22,color:rgba(GOOD,1)}));
    for(let i=0;i<4;i++){const y=104+gl.length*36+i*44-10;c.fillStyle=rgba(INK,0.25);rr(c,520,y,170,12,4);c.fill();tick_(c,736,y+6,30,GOOD,1);}
    T(c,"?",400,400,{w:800,size:52,align:"center",color:rgba(SM_AMBER,1)});c.restore();},
  sm_q_reopen:(c,w,h,st,L)=>{const V=L.vis;c.save();sm_fit(c,w,h,800,427);sm_T(c,V.q.reopen,24,44,752,{w:700,size:30,min:24});
    const wo=sm_key(c,24,104,"LMS|u-88213",SM_SRC[1],{size:28,a:0.6});arrowTo(c,24+wo+14,104,24+wo+90,104,SM_SRC[1],0.8,{head:14});sm_key(c,24+wo+104,104,"LMS|u-…",SM_SRC[1],{size:28,hi:1});
    T(c,V.q.newId,24+wo+104,166,{w:600,size:26,color:rgba(SOFT,1)});
    [[3,V.rules[2]],[4,V.rules[3]],[9,V.rules[4]]].forEach(([p,t],i)=>{const y=196+i*76;sm_rule(c,24,y,752,p,"",{h:64,on:i===0?0.6:0});
      sm_T(c,t,92,y+42,670,{w:700,size:28,min:22,color:rgba(INK,0.95)});});c.restore();},
  sm_q_code:(c,w,h,st,L)=>{const V=L.vis;c.save();sm_fit(c,w,h,800,427);
    c.save();c.translate(24,16);c.scale(1.04,1.04);sm_file(c,0,0,722,"seeds/reference/student/status_map.csv",["…","SC,1,Active customer,studying","SC,0,Inactive customer,inactive"],{size:19,lh:30,label:V.runs,lit:{2:1}});c.restore();
    c.save();c.setLineDash([10,8]);c.strokeStyle=rgba(SM_AMBER,0.9);c.lineWidth=2.5;rr(c,24,252,752,64,14);c.stroke();c.restore();
    sm_T(c,"+ SC,INACTIVE,Inactive customer,inactive",44,294,712,{f:"mono",w:500,size:26,min:22,color:rgba(SM_AMBER,1)});
    tag(c,24,380,V.q.pr,SM_AMBER,{size:26});const ow=tw(c,V.q.owner,26,700)+26;tag(c,776-ow,380,V.q.owner,TRUST,{size:26});c.restore();}
});
