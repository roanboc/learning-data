/* ===== v4 scenes, part B ===== */
/* ---------- laid out to read on a phone (PLAYBOOK.md, "Make it read on a phone") ----------
   phone.js raises every piece of text that isn't decoration to the size that reads, after the camera's zoom. These film-local helpers
   place things by the size they're drawn at. il_fit gives a label's size: as asked, or raised to the size that reads, while it fits
   the room it has; past that it's as large as fits, and small print (decoration) once that's under the size that reads, so a label's
   size never jumps as the camera moves. il_seen says how much of a span is in the frame, so what the frame would cut can step back. */
function il_m(ctx){return typeof phMin==="function"?phMin(ctx):0;}
function il_sz(ctx,s){return Math.max(s,il_m(ctx));}
function il_deco(on,fn){return on&&typeof phAsDeco==="function"?phAsDeco(true,fn):fn();}
function il_fit(ctx,s,base,room,w,f){const m=il_m(ctx),e=tw(ctx,s,100,w||600,f)/100,fit=e>0?room/e:1e9,want=Math.max(base,m);return{size:Math.min(want,fit),deco:m>0&&fit<m-0.01};}
// with o.seen, a line the frame would cut steps back before its words are cut (a heading at the frame's edge as the camera moves)
function il_T(ctx,s,x,y,room,o){const f=il_fit(ctx,s,o.size||24,room,o.w||600,o.f),v=o.seen?sstep(0.97,1,il_seen(ctx,x,x+tw(ctx,s,f.size,o.w||600,o.f))):1;
  withA(ctx,v,()=>T(ctx,s,x,y,Object.assign({},o,{size:f.size,deco:f.deco?1:0})));return f;}
// a tag as large as its room allows; with o.seen, a tag the frame would cut steps back, measured at the size it's drawn
function il_tag(ctx,x,y,s,c,base,room,o){const f=il_fit(ctx,s,base,room-26,700),w=tw(ctx,s,f.size,700)+26,X=o.align==="center"?x-w/2:x,v=o.seen?il_whole(ctx,X,X+w):1;
  withA(ctx,v,()=>il_deco(f.deco,()=>tag(ctx,x,y,s,c,Object.assign({},o,{size:f.size}))));return f;}
function il_seen(ctx,x0,x1){const m=ctx.getTransform(),k=W/ctx.canvas.width,a=(m.a*x0+m.e)*k,b=(m.a*x1+m.e)*k;return clamp((Math.min(b,W)-Math.max(a,0))/Math.max(1,b-a),0,1);}
// how much to show of something the frame may cut: all of it while it's whole in the frame, fading out as the edge reaches it
const il_whole=(ctx,x0,x1)=>sstep(0.9,1,il_seen(ctx,x0,x1));
// the same for a box that the frame may cut at any edge: how much of its width, then of its height, is in the frame
function il_seen2(ctx,x0,y0,x1,y1){const m=ctx.getTransform(),k=W/ctx.canvas.width,a=(m.d*y0+m.f)*k,b=(m.d*y1+m.f)*k;return il_seen(ctx,x0,x1)*clamp((Math.min(b,H)-Math.max(a,0))/Math.max(1,b-a),0,1);}
// a chip, as chip draws it, grows as a whole until its smaller line reads, by at most 1.7; where even that leaves its words too small
// (from afar), it's small print, so its box still holds its words
function il_chip(ctx,x,y,k,title,sub,o){o=o||{};const base=sub?(o.ss||17):(o.ts||22);return il_deco(il_m(ctx)>base*1.75,()=>chip(ctx,x,y,k,title,sub,o));}
// an application's card as appCard draws it here (its name, no line under it, no cells), with its name stepping back while the
// frame cuts it, so a side the close-up cuts shows no cut words
function il_appCard(ctx,x,y,w,h,a,ts){const c=APP[a].c,n=APP[a].n;glass(ctx,x,y,w,h,16,c,{glow:18,ea:0.55});led(ctx,x+12,y+16,5,h-32,c);
  withA(ctx,il_whole(ctx,x+32,x+32+tw(ctx,n,ts,700)),()=>T(ctx,n,x+32,y+42,{w:700,size:ts}));dbGlyph(ctx,x+w-44,y+h/2+2,c,0.9);}
const il_logoW=(k,h)=>{const im=LOGO[k];return im?h*im.width/im.height:h;};

function Iss(x,a,r){if(x<=a)return 0;if(x>=a+r)return x-a-r/2;const u=(x-a)/r;return r*(u*u*u-u*u*u*u/2);}
const RF2={X0:222,X1:1330,Y:560,V:65,INT:1.1,STG:548,DED:610,LEN:770,INTG:958,JOIN:1070};
function rfT(sc,t){const a=cue(sc,"rough")-0.3,b=Math.max(cue(sc,"rough")+4.6,cue(sc,"sources")+0.7),r=0.6;return t-(Iss(t,a,r)-Iss(t,b-r,r));}
// the four rough pieces the line about them names, picked by index: the four last in from the bronze vault when the belt stops, so
// every language's timing gets all four (glitch, duplicate, error, clock), whatever the line's pace
function rfKeys(sc){if(sc._k)return sc._k;const te=x=>rfT(sc,x),V=RF2.V,I=RF2.INT;
  const kE=Math.round((te(cue(sc,"tests")+0.9)-(RF2.STG-RF2.X0)/V)/I),kO=Math.round((te(cue(sc,"orphan")+0.7)-(RF2.INTG-RF2.X0)/V)/I);
  const tf=te(cue(sc,"rough")+1),kmax=Math.floor((tf-(300-RF2.X0)/V)/I),EX=[kmax-3,kmax-2,kmax-1,kmax];
  const role={};["glitch","dup","err","clock"].forEach((r,i)=>{role[EX[i]]=r;});sc._k={kE,kO,EX,role};return sc._k;}
// a rough piece's tag: above or below it, in turn, so neighbours' tags don't meet
function rfProps(k,sc){const K=rfKeys(sc);let err=hash(k,51)<0.06,dup=!err&&hash(k,52)<0.1,orphan=!err&&!dup&&hash(k,53)<0.05,tag=null;
  if([K.kE-1,K.kE+1,K.kO-1,K.kO+1].indexOf(k)>=0||K.EX.indexOf(k)>=0){err=false;dup=false;orphan=false;}
  if(k===K.kE){err=true;dup=false;orphan=false;}if(k===K.kO){orphan=true;err=false;dup=false;}
  const r=K.role[k];if(r==="glitch")tag=["glitches",APP.lms.c,-60];else if(r==="dup"){dup=true;tag=["duplicate",APP.hr.c,64];}else if(r==="err"){err=true;tag=["error",BAD,-60];}else if(r==="clock")tag=["different clocks",C.hot,66];
  return{cell:((hash(k,54)*24)|0),app:["sis","lms","hr","fin"][((k%4)+4)%4],err,dup,orphan,tag,rot:(hash(k,55)-0.5)*0.7,t0:k*RF2.INT};}
// a dbt stage, drawn as chip draws it (logo, name, the line under it): the name at the size that reads, the line as large as the
// stage's room allows, which from afar, with three stages side by side, is small print
// il_stageBox measures it, il_stage draws what was measured; the three stages' lines share one size (il_stageFit), the size the
// tightest of them fits, so a row's lines are all read or all small print together
function il_stagePad(ctx){const ts=il_sz(ctx,20),lh=Math.round(ts*1.4),lw=Math.max(il_logoW("dbt",lh),lh*0.9);return{ts,lh,lw,pad:12+lw+10+14};}
function il_stageFit(ctx,rows){const p=il_stagePad(ctx);return rows.map(([sub,room])=>il_fit(ctx,sub,16,room-p.pad,500)).reduce((a,b)=>a.size<b.size?a:b);}
function il_stageBox(ctx,x,y,title,sub,f,align){const{ts,lh,lw,pad}=il_stagePad(ctx),ss=f.size;
  const w=pad+Math.max(tw(ctx,title,ts,700),tw(ctx,sub,ss,500)),tb=10+ts*0.8,sb=tb+5+ss*0.95,h=sb+ss*0.28+12,X=align==="right"?x-w:(align==="left"?x:x-w/2),Y=y-h/2;
  return{x:X,y:Y,w,h,ts,ss,lh,lw,tb,sb,deco:f.deco,title,sub};}
// a row of tags under their places (cx), one size for all: each starts at its place, or just right of the one before it (and of x0),
// so none meets its neighbour; il_rowFit finds the largest size at which the row ends by x1 with no tag pushed more than cap from its
// place, and from afar, where that's under the size that reads, the row is small print together
function il_row(ctx,items,s,x0,gap){let L=x0;return items.map(([cx,str])=>{const w=tw(ctx,str,s,700)+26,l=Math.max(cx-w/2,L);L=l+w+gap;return{x:l+w/2,w,l,sh:l+w/2-cx};});}
function il_rowFit(ctx,items,base,x0,x1,gap,cap){const m=il_m(ctx),ok=s=>{const r=il_row(ctx,items,s,x0,gap),q=r[r.length-1];return q.l+q.w<=x1&&r.every(z=>z.sh<=cap);};
  let lo=6,hi=60;for(let i=0;i<18;i++){const md=(lo+hi)/2;if(ok(md))lo=md;else hi=md;}return{size:Math.min(Math.max(base,m),lo),deco:m>0&&lo<m-0.01};}
// a tag at a size already chosen (f, from il_fit or il_rowFit); with o.seen, it steps back while the frame would cut it
function il_tagF(ctx,x,y,s,c,f,o){const w=tw(ctx,s,f.size,700)+26,X=o.align==="center"?x-w/2:x,v=o.seen?il_whole(ctx,X,X+w):1;
  withA(ctx,v,()=>il_deco(f.deco,()=>tag(ctx,x,y,s,c,Object.assign({},o,{size:f.size}))));return w;}
function il_stage(ctx,b){glass(ctx,b.x,b.y,b.w,b.h,12,null,{fill:"rgba(7,12,24,0.9)",glow:0,ea:0.6});logo(ctx,"dbt",b.x+12,b.y+(b.h-b.lh)/2,b.lh);const tx=b.x+12+b.lw+10;
  T(ctx,b.title,tx,b.y+b.tb,{w:700,size:b.ts});T(ctx,b.sub,tx,b.y+b.sb,{w:500,size:b.ss,deco:b.deco?1:0,color:rgba(SOFT,0.95)});return b;}
scene("refine",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cRe=c("recipes"),cRu=c("runs"),cCl=c("closer"),cRo=c("rough"),cSo=c("sources"),cSt=c("staging"),cTe=c("tests"),cIn=c("inter"),cOr=c("orphan"),cSi=c("silver"),cTr=c("trace");
  // each close-up frames what its line names; a stage or a test the frame would cut steps back, so no words are cut by the frame
  const cam=camAt([[0,820,520,0.95],[cCl-0.6,820,520,0.95],[cCl+2.2,430,560,2.4],[Math.max(cRo+3.8,cSo-0.5),430,560,2.4],[cSo+0.9,450,540,1.5],[cSt-0.6,450,540,1.5],[cSt+0.9,690,520,1.55],[cTe-0.5,690,520,1.55],[cTe+0.9,640,600,1.7],[cIn-0.6,640,600,1.7],[cIn+1.2,1310,560,1.55],[cSi-0.6,1310,560,1.55],[cSi+1.2,1580,540,1.35],[cTr-0.5,1580,540,1.35],[cTr+1.6,960,540,0.95],[sc.dur+2,960,540,0.97]],t);
  bgW(ctx,S,cam);const te=rfT(sc,t),Y=RF2.Y;
  // the recipes card and the warehouse are the wide view's: they step back as the camera goes in on the belt, and come back only
  // whole as it pulls out again
  const far=(1-sstep(1.05,1.3,cam.z))*il_whole(ctx,340,1300);
  vault(ctx,30,440,190,330,LAYER.bronze,(r,cc)=>hash(r*31+cc,5)>0.7?null:APP[["sis","lms","hr","fin"][(hash(r*7+cc,6)*4)|0]].c,null);T(ctx,"Bronze",125,482,{w:800,size:22,align:"center",color:rgba(LAYER.bronze,1)});
  beam(ctx,[P(222,Y),P(1330,Y)],[210,225,255],[[40,0.03],[14,0.06]]);
  // dbt's card, as tall as its lines at the size they're drawn; its lineage in the title row, clear of the longer lines
  const pA=fin(t,cRe)*far,s1=il_sz(ctx,19),s2=il_sz(ctx,17),dY=70+s1*0.95,cY=dY+8+s2,ch=cY+s2*0.3+18,y0=308-ch;
  withA(ctx,pA,()=>{glass(ctx,340,y0,960,ch,18,DBT,{glow:18,ea:0.55});logo(ctx,"dbt",366,y0+20,44);T(ctx,"dbt",424,y0+54,{w:800,size:34});T(ctx,"models, tests, docs and lineage, in version control",424,y0+dY,{w:500,size:19,color:rgba(SOFT,0.95)});T(ctx,"select * from {{ ref('stg_enrolments') }}",424,y0+cY,{f:"mono",w:500,size:17,color:"rgba(255,190,170,0.95)"});
    const nx=[900,990,1080,1170,1250],ny=i=>y0+28+((i+1)%2)*24;nx.forEach((x,i)=>{const lit=t>cTr?clamp((t-cTr-0.3-(4-i)*0.3)/0.3,0,1):0;if(i){ctx.strokeStyle=rgba(DBT,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(nx[i-1]+12,ny(i-1));ctx.lineTo(x-12,ny(i));ctx.stroke();}ctx.fillStyle=rgba(mix(DBT,[255,240,200],lit),0.95);ctx.beginPath();ctx.arc(x,ny(i),10+4*lit,0,TAU);ctx.fill();if(lit>0)glow(ctx,x,ny(i),30,LAYER.gold,lit*0.8);});});
  const housing=(x0,x1,a)=>withA(ctx,a,()=>{glass(ctx,x0,450,x1-x0,220,22,DBT,{glow:14,ea:0.45,fill:"rgba(30,20,30,0.28)"});const ta=fin(t,cTe-0.2);for(let k=0;k<Math.floor((x1-x0-40)/26);k++){const cx=x0+26+k*26;ctx.save();ctx.globalAlpha*=ta;ctx.strokeStyle=rgba(GOOD,0.9);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(cx-5,662);ctx.lineTo(cx-1,666);ctx.lineTo(cx+6,657);ctx.stroke();ctx.restore();}});
  const gA=[fin(t,cRe+0.8),fin(t,cRe+1.3),fin(t,cRe+1.8)];housing(540,840,gA[1]);housing(950,1190,gA[2]);
  withA(ctx,gA[0],()=>gate(ctx,330,Y,180,[190,225,255],"tests"));withA(ctx,gA[1],()=>{gate(ctx,RF2.DED,Y,180,[190,225,255],"dedupe");gate(ctx,RF2.LEN,Y,180,[190,225,255],"lens");});withA(ctx,gA[2],()=>gate(ctx,RF2.JOIN,Y,180,[190,225,255],"join"));
  // the three stages, each in its own room: sources ends before staging's room, intermediate starts after it
  // a stage the close-up's frame would cut steps back, with its lines; the three lines under the names share one size
  const STG=[[490,"sources","declared, freshness checked",0,cSo,"right",490,330],[690,"staging models","clean each source, one clock",1,cSt,"center",380,690],[890,"intermediate models","joined as the sketch says",2,cIn,"left",490,1070]],
    sF=il_stageFit(ctx,STG.map(r=>[r[2],r[6]]));
  STG.forEach(([x,tt,sb,i,cc,al,room,lx])=>{
    const b=il_stageBox(ctx,x,390,tt,sb,sF,al);withA(ctx,gA[i]*il_whole(ctx,b.x,b.x+b.w),()=>{const hl=t>cc&&t<cc+2.5?0.6*(1-(t-cc)/2.5):0;if(hl>0)glow(ctx,lx,390,160,DBT,hl);il_stage(ctx,b);
      ctx.save();ctx.strokeStyle=rgba(DBT,0.45);ctx.setLineDash([4,6]);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(lx,b.y+b.h);ctx.lineTo(lx,450);ctx.stroke();if(pA>0.01){ctx.globalAlpha*=pA;ctx.beginPath();ctx.moveTo(lx,310);ctx.lineTo(lx,b.y);ctx.stroke();}ctx.restore();});});
  // the tests under each stage, one size for the three: read in the close-ups, small print together from afar; the first clears the
  // bronze vault, and each clears the one before it
  withA(ctx,fin(t,cTe-0.2),()=>{const TS=[[330,"✓ tests: freshness, not null"],[690,"✓ tests: unique, accepted values"],[1070,"✓ tests: relationships"]],tf=il_rowFit(ctx,TS,16,234,1372,16,90);
    il_row(ctx,TS,tf.size,234,16).forEach((q,i)=>il_tagF(ctx,q.x,700,TS[i][1],GOOD,tf,{align:"center",seen:1}));});
  // the SQL warehouse, under the belt and clear of the captions, its lights after its words
  withA(ctx,fin(t,cRu-0.1)*far,()=>{const ts=il_sz(ctx,26),ss=il_sz(ctx,18),wy=745,tb=10+ts*0.8,sb=tb+4+ss*0.95,h=sb+ss*0.3+12;glass(ctx,340,wy,960,h,18,DBX,{glow:16,ea:0.5});logo(ctx,"databricks",362,wy+(h-48)/2,48);T(ctx,"SQL warehouse",424,wy+tb,{w:800,size:26});T(ctx,"runs the SQL that dbt compiles",424,wy+sb,{w:500,size:18,color:rgba(SOFT,0.95)});
    const gx=424+Math.max(tw(ctx,"SQL warehouse",ts,800),tw(ctx,"runs the SQL that dbt compiles",ss,500))+40,nc=Math.floor((1284-gx)/28),gy=wy+(h-52)/2;
    for(let r=0;r<3;r++)for(let cc=0;cc<nc;cc++){ctx.fillStyle=rgba(DBX,0.2+0.7*Math.abs(Math.sin(t*2+r*18+cc*1.7+hash(r*18+cc,3)*6)));rr(ctx,gx+cc*28,gy+r*20,20,12,3);ctx.fill();}});
  const sA=0.45+0.55*fin(t,cIn),t0f=cIn+1.0,t1f=cSi+0.4;
  withA(ctx,sA,()=>{glass(ctx,1392,318,468,318,14,LAYER.silver,{glow:24});const ex=1404,ey=330,cw=444/6,ch=294/4;const filled=cc=>{const i=ORDER24.indexOf(cc);const tc=t0f+i*(t1f-t0f)/24;return sstep(tc+0.7,tc+0.9,t);};
    // the sketch behind the picture is a faint replay of the earlier diagram: texture
    il_deco(true,()=>sketchA(ctx,ex+6,ey+10,432,270,false,0.5*(1-sstep(cSi,cSi+1.5,t)),{}));pictureCells(ctx,ex,ey,444,294,filled);
    for(let i=0;i<24;i++){const cc=ORDER24[i],tc=t0f+i*(t1f-t0f)/24;if(t<tc||t>tc+0.9)continue;const u=ease((t-tc)/0.8),tx=ex+(cc%6)*cw+cw/2,ty=ey+((cc/6)|0)*ch+ch/2;const q=at(mk(bez(P(1200,Y),P(1300,Y),P(tx-100,ty),P(tx,ty),12)),u);dtile(ctx,q.x,q.y,lerp(46,cw,u),0,{cell:cc,q:2},1-sstep(0.85,1,(t-tc)/0.9));}
    if(t>cSi-0.3)il_chip(ctx,1626,284,"databricks","Silver","one consistent picture",{align:"center",edge:LAYER.silver});});
  withA(ctx,fin(t,cIn+0.5),()=>il_tag(ctx,1400,662,"pieces placed by the sketch",[150,225,255],17,500,{}));
  const k1=Math.floor(te/RF2.INT),k0=Math.floor((te-(RF2.X1-RF2.X0)/RF2.V)/RF2.INT)-1,tags=[],K=rfKeys(sc);let failE=0,failO=0;
  for(let k=k0;k<=k1;k++){const p=rfProps(k,sc),x=RF2.X0+(te-p.t0)*RF2.V;if(x<RF2.X0-10||x>RF2.X1+10)continue;
    const q=x<RF2.DED?0:(x<RF2.LEN?1:2),sm=1-sstep(RF2.LEN-40,RF2.LEN,x),y=Y+Math.sin(te*1.7+k)*10*sm,al=sstep(RF2.X0,RF2.X0+24,x)*(1-sstep(RF2.X1-70,RF2.X1,x));
    // every failed piece stops with a red flash; a failed test's tag is only for the piece its line tells of (kE, kO, which reach their
    // stops just after their lines begin): it fades in, holds, and goes
    if(p.err&&x>=RF2.STG){const d=(x-RF2.STG)/RF2.V;if(d<0.5)glow(ctx,RF2.STG,y,40+60*(1-d/0.5),BAD,1-d/0.5);if(k===K.kE&&t>=cTe-0.1&&d<3.5)failE=Math.max(failE,sstep(0,0.25,d)*(1-sstep(3,3.5,d)));continue;}
    if(p.orphan&&x>=RF2.INTG){const d=(x-RF2.INTG)/RF2.V;if(d<0.5)glow(ctx,RF2.INTG,y,40+60*(1-d/0.5),BAD,1-d/0.5);if(k===K.kO&&t>=cOr-0.1&&d<3.5)failO=Math.max(failO,sstep(0,0.3,d)*(1-sstep(3,3.5,d)));continue;}
    const sp={cell:p.cell,q,app:p.app,err:p.err||(p.orphan&&x>RF2.LEN+30)};
    if(p.dup&&x<RF2.DED+40){const m=sstep(RF2.DED-6,RF2.DED+36,x);dtile(ctx,x-38*(1-m),y+14*(1-m),46,p.rot*1.2*sm,sp,al*(1-m));}
    dtile(ctx,x,y,q===2?50:46,p.rot*sm,sp,al);if(p.tag)tags.push([x,y+p.tag[2],p.tag[0],p.tag[1]]);}
  const exA=fin(t,cRo-0.2)*(1-sstep(Math.max(cRo+4.2,cSo+0.3),Math.max(cRo+4.8,cSo+0.9),t));if(exA>0)withA(ctx,exA,()=>tags.forEach(g=>tag(ctx,g[0],g[1],g[2],g[3],{align:"center",size:15})));
  if(failE>0)withA(ctx,failE,()=>tag(ctx,512,505,"✗ not_null",BAD,{align:"center",size:15}));if(failO>0)withA(ctx,failO,()=>tag(ctx,912,505,"✗ relationships",BAD,{align:"center",size:15}));
  // raw and clean, side by side under silver, their names beside them, where the close-ups keep them clear of the captions; while
  // the frame would cut the pair, it steps back; while the warehouse shows, the pair moves right as far as the raw name, measured at
  // the size it's drawn, needs to clear the warehouse's corner (a longer word than "raw" in another language)
  {const ls0=il_sz(ctx,18),wr=tw(ctx,"raw",ls0,700),dx=Math.max(0,1300+16-(1380-wr))*fin(t,cRu-0.1)*far;
    withA(ctx,fin(t,cSt+1.2)*il_whole(ctx,dx+1380-wr,dx+1660+tw(ctx,"clean",ls0,700)),()=>{const ry=738,ls=ls0;ctx.save();ctx.translate(dx,0);dtile(ctx,1436,ry,80,-0.05,{cell:14,q:0,app:"lms",hi:true});dtile(ctx,1604,ry,80,0,{cell:14,q:2,hi:true});T(ctx,"raw",1380,ry+ls*0.35,{w:700,size:18,align:"right",color:rgba(APP.lms.c,1)});T(ctx,"clean",1660,ry+ls*0.35,{w:700,size:18});
    ctx.strokeStyle=rgba(INK,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1494,ry);ctx.lineTo(1544,ry);ctx.moveTo(1532,ry-12);ctx.lineTo(1546,ry);ctx.lineTo(1532,ry+12);ctx.stroke();ctx.restore();});}
  if(t>cTr){const u=ease(clamp((t-cTr-0.2)/2.2,0,1)),L=mk([P(1400,478),P(1330,Y),P(RF2.JOIN,Y),P(RF2.LEN,Y),P(RF2.DED,Y),P(330,Y),P(125,Y),P(-400,Y)]),n=60,sub=[];for(let i=0;i<=n;i++)sub.push(at(L,u*i/n));beam(ctx,sub,LAYER.gold,[[16,0.08],[6,0.25],[2.2,0.95]]);withA(ctx,fin(t,cTr+1.4),()=>il_tag(ctx,700,632,"lineage: every step recorded",LAYER.gold,17,600,{align:"center"}));}
  // the breather: a fresh batch runs clean, the checks ripple, new pieces land in silver, and light runs back along the lineage to bronze
  const B=c("breath");if(sc.breathe&&t>B){
    [B+0.4].forEach(s0=>{const v=(t-s0)/1.4;if(v>0&&v<1){glow(ctx,lerp(300,1190,v),662,60,GOOD,0.8*Math.sin(v*Math.PI));glow(ctx,lerp(300,1190,v),700,40,GOOD,0.4*Math.sin(v*Math.PI));}});
    const ex=1404,ey=330,cw=444/6,chh=294/4;[0.9,1.7,2.5].forEach((d,i)=>{const s0=B+d,v=(t-s0)/0.9;if(v<0)return;const cc=ORDER24[(i*7+3)%24],tx=ex+(cc%6)*cw+cw/2,ty=ey+((cc/6)|0)*chh+chh/2;
      if(v<1){const q=at(mk(bez(P(1300,Y),P(1360,Y),P(tx-100,ty),P(tx,ty),12)),ease(v));dtile(ctx,q.x,q.y,lerp(46,cw,v),0,{cell:cc,q:2},1);}else if(v<1.8)glow(ctx,tx,ty,60,LAYER.silver,0.6*(1-(v-1)/0.8));});
    const Lm=mk([P(1400,478),P(1330,Y),P(RF2.JOIN,Y),P(RF2.LEN,Y),P(RF2.DED,Y),P(330,Y),P(125,Y)]);[B+2.1].forEach(s0=>{const v=(t-s0)/2.0;if(v>0&&v<1){const q=at(Lm,ease(v));glow(ctx,q.x,q.y,26,C.white,0.9);glow(ctx,q.x,q.y,90,LAYER.gold,0.45);}});}
  vign(ctx,S);
});

/* ---------- 4. Gold: business domains, data products, exposures ---------- */
const GW=[{d:"teaching",k:"live",x:1000},{d:"students",k:"rules",x:1480},{d:"research",k:"modern",x:1960},{d:"finance",k:"realism",x:2440}];
// a shorter name under a product's picture, for a name too long for the room it has there; only where the film's language has the
// shorter name too (a language pack names its products shortly already), so no English is left in another language's film
const IL_SHORT={"Weekly teaching load":"Teaching load","Admissions funnel":"Admissions","Applications trend":"Applications","Grants and outputs":"Grants, outputs","Forecast accuracy":"Forecasts","Rooms in use now":"Rooms in use"},IL_CAPW=124,IL_CAPD=106;
const il_short=s=>{const sh=IL_SHORT[s];return sh&&(typeof L10N==="undefined"||!L10N.map||L10N.map[sh]!=null)?sh:null;};
// the size all 24 names under the pictures share: they read in a close-up of one wing (the longest as wide as IL_CAPW), and are small
// print from afar, where they ease down until the longest is IL_CAPD wide, inside its picture's width, so neighbours keep a gap
function il_caps(ctx){const m=il_m(ctx),want=Math.max(12.5,m);let e=0;GW.forEach(w=>{for(let n=0;n<6;n++){const s=pvTitle(w.d,n),sh=il_short(s);let q=tw(ctx,s,100,600)/100;if(sh)q=Math.min(q,tw(ctx,sh,100,600)/100);e=Math.max(e,q);}});
  const fit=IL_CAPW/e,k=m>fit?clamp((m-fit)/(0.12*fit),0,1):0,size=Math.min(want,fit)*(1-k*(1-IL_CAPD/IL_CAPW));return{size,deco:m>0&&fit<m-0.01,room:size*e+0.01};}
// a product's name, or its shorter name where the name is wider than the longest name the row is sized for
const il_cap=(ctx,s,C)=>{const sh=il_short(s);return sh&&tw(ctx,s,C.size,600)>C.room?sh:s;};
// a wing, laid out from the sizes its words are drawn at: its name, and its count under it (the number reads; from afar the words
// after it are small print), the painting, the audience's tag, and two rows of products with their names
function il_wingL(ctx){const m=il_m(ctx),ns=Math.max(26,m),ny=270+ns*0.74,cd=m>24,cs=cd?24:Math.max(16,m),qs=Math.max(cs,m),cy=ny+4+qs*0.8,P=Math.max(322,cy+cs*0.25+12),r1=P+291,r2=r1+130,C=il_caps(ctx);
  return{ns,ny,cs,qs,cd,cy,P,r1,r2,C,bot:r2+79+C.size*1.05+16};}
scene("gold",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cSp=c("split"),cPr=c("products"),cSu=c("subject"),cAn=c("analysts"),cEx=c("execs"),cRp=c("reports"),cLi=c("live"),cMa=c("marts"),cXp=c("exposure"),cGo=c("gold");
  const cam=camAt([[0,380,540,1.2],[cSp+0.3,380,540,1.2],[cSp+2.6,1470,540,0.62],[cSu-0.2,1470,540,0.62],[cAn+0.4,2660,540,1.9],[cEx-0.7,2660,540,1.9],[cEx+0.9,2180,540,1.9],[cRp-0.7,2180,540,1.9],[cRp+0.9,1700,540,1.9],[cLi-0.7,1700,540,1.9],[cLi+0.9,1220,540,1.9],[cMa-0.6,1220,540,1.9],[cMa+1.2,1700,570,1.3],[cGo-0.6,1700,570,1.3],[cGo+1.6,1470,540,0.62]].concat(sc.breathe?[[c("breath")+0.3,1470,540,0.62],[c("breath")+2.8,1230,560,1.45],[sc.dur+2,1250,560,1.5]]:[[sc.dur+2,1470,540,0.64]]),t);
  bgW(ctx,S,cam);
  glass(ctx,46,366,508,348,16,LAYER.silver,{glow:24});ctx.drawImage(master2(1),60,380,480,320);il_chip(ctx,300,330,"databricks","Silver","one consistent picture",{align:"center",edge:LAYER.silver});
  const scanX=60+((t*0.35)%1)*480;ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle="rgba(200,230,255,0.5)";ctx.fillRect(scanX-2,380,4,320);ctx.restore();
  lane(ctx,[P(556,540),P(664,556)],[255,255,255],1);
  ctx.save();ctx.shadowColor="rgba(200,225,255,0.8)";ctx.shadowBlur=20;ctx.beginPath();ctx.moveTo(700,488);ctx.lineTo(752,590);ctx.lineTo(648,590);ctx.closePath();ctx.fillStyle="rgba(200,225,255,0.14)";ctx.fill();ctx.strokeStyle="rgba(230,240,255,0.95)";ctx.lineWidth=2.5;ctx.stroke();ctx.restore();
  const lit=fin(t,cSp+0.2,1.0),L=il_wingL(ctx);
  // the plaque that labels the census painting covers the lower half of the students wing while it shows
  const pa=fin(t,cMa+0.2)*(1-sstep(cGo+0.6,cGo+1.2,t))*sstep(1.0,1.2,cam.z);
  GW.forEach((w,i)=>{const d=DOM[w.d].c,ry=150+i*14,cx=w.x+220;if(lit>0){const Ln=[P(730,560),P(760,ry),P(cx,ry),P(cx,250)];lane(ctx,Ln,d,lit);spawn(t,0.7,1.4,i*0.17,u=>{const q=at(mk(Ln),u);glow(ctx,q.x,q.y,12,d,lit);});}
    // a wing the close-up cuts at the frame's edge is context: it dims to a faint shape, so the words in its paintings, cut by the
    // frame, don't read, and the names under its pictures step back
    const foc=sstep(0.9,1,il_seen(ctx,w.x,w.x+440)),wa=fin(t,cSp+1.0+i*0.35);withA(ctx,wa*(0.12+0.88*foc),()=>{glass(ctx,w.x,250,440,L.bot-250,20,d,{glow:22,ea:0.55});led(ctx,w.x+24,264,392,3,d);// its name and its count step back while the frame cuts them (a longer name in another language reaches the edge)
      withA(ctx,il_whole(ctx,w.x+24,w.x+24+tw(ctx,DOM[w.d].n,L.ns,800)),()=>T(ctx,DOM[w.d].n,w.x+24,L.ny,{w:800,size:26}));
      const nq=String(22+i*6),nx=w.x+24+tw(ctx,nq,L.qs,600)+tw(ctx," ",L.cs,600);withA(ctx,il_whole(ctx,w.x+24,nx+tw(ctx,"data products",L.cs,600)),()=>{T(ctx,nq,w.x+24,L.cy,{w:600,size:L.qs,color:rgba(d,1)});T(ctx,"data products",nx,L.cy,{w:600,size:L.cs,deco:L.cd?1:0,color:rgba(d,1)});});
      // its paintings and pictures fade further than its frame and name: the words painted in them are cut by the frame
      const pf=0.3+0.7*foc,rv=clamp((t-cSp-1.6-i*0.35)/1.2,0,1);if(rv>0){ctx.save();ctx.globalAlpha*=pf;ctx.beginPath();ctx.rect(w.x,L.P+240-240*rv,440,300);ctx.clip();ledFrame(ctx,w.x+40,L.P,360,240,d,painting2(w.k),{pad:10,glow:26});if(w.k==="live")liveOverlay(ctx,w.x+40,L.P,360,240,t);ctx.restore();}
      // the students' pictures step back under the plaque, which would leave their lower edges showing
      const under=(w.d==="students"?1-pa:1)*pf,capA=foc;
      for(let n=0;n<6;n++){const r=(n/3)|0,k=n%3,a2=clamp((t-cSp-2.2-i*0.3-n*0.08)/0.4,0,1)*under,px=w.x+40+k*127,py=r?L.r2:L.r1;if(a2<=0)continue;withA(ctx,a2,()=>{ledFrame(ctx,px,py,114,76,d,pv(w.d,n),{pad:3,lw:1.8,glow:10});pvLive(ctx,w.d,n,px,py,114,76,t);
        // a name the frame's top or bottom edge would cut (the lower row, below a close-up's frame) steps back too
        const cy=py+79+L.C.size*0.8,cv=capA*sstep(0.97,1,il_seen2(ctx,px,cy-L.C.size*0.78,px+114,cy+L.C.size*0.26));
        if(cv>0.01)withA(ctx,cv,()=>{const s=pvTitle(w.d,n);T(ctx,il_cap(ctx,s,L.C),px,cy,{w:600,size:L.C.size,deco:L.C.deco?1:0,color:rgba(SOFT,0.95)});});});}});});
  // each audience's tag under its painting, while its wing is the one in view
  const aud=[[cAn,"for analysts","every detail",3],[cEx,"for executives","the essence",2],[cRp,"for government reports","strict rules",1],[cLi,"for live operations","right now",0]];
  aud.forEach(([cc,a1,a2,i])=>{const w=GW[i],foc=sstep(0.9,1,il_seen(ctx,w.x,w.x+440));withA(ctx,fin(t,cc+0.3)*(1-sstep(cMa-0.3,cMa+0.2,t))*foc,()=>il_tag(ctx,w.x+220,L.P+269,a1+" · "+a2,DOM[w.d].c,17,420,{align:"center"}));});
  if(pa>0)withA(ctx,pa,()=>{const rows=[["DATA PRODUCT","Census enrolments"],["DBT MART","fct_census_enrolments · contract","dbt"],["DBT EXPOSURE","Government census report","dbt"],["OWNER","Student services"]],m=il_m(ctx),vs=Math.max(21,m),lo=18+Math.max(il_logoW("dbt",28),26)+10;
    const pw=clamp(Math.max(...rows.map(r=>(r[2]?lo:18)+tw(ctx,r[1],vs,700)))+18,380,432),px=1700-pw/2,py=L.P+252,rh=m?Math.max(52,m*2.3):52;plaque(ctx,px,py,pw,rows,DOM.students.c);
    const xa=fin(t,cXp);if(xa>0){ctx.save();ctx.globalAlpha*=xa;ctx.shadowColor=rgba(DBT,0.9);ctx.shadowBlur=18;ctx.strokeStyle=rgba(DBT,0.95);ctx.lineWidth=2.5;rr(ctx,px+8,py+16+2*rh-6,pw-16,rh,10);ctx.stroke();ctx.restore();}});
  // the breather: in the Teaching wing, a live data product shows its plaque, and its exposure lights up
  const B=c("breath");if(sc.breathe&&t>B+1.3)withA(ctx,fin(t,B+1.3,0.6)*(1-sstep(sc.dur-0.5,sc.dur,t)),()=>{const m=il_m(ctx),rh=m?Math.max(52,m*2.3):52,py=L.P+252;plaque(ctx,1012,py,416,[["DATA PRODUCT","Rooms in use now"],["DBT EXPOSURE","Campus operations screen","dbt"]],DOM.teaching.c);
    const xa=fin(t,B+2.3);if(xa>0){ctx.save();ctx.globalAlpha*=xa;ctx.shadowColor=rgba(DBT,0.9);ctx.shadowBlur=18;ctx.strokeStyle=rgba(DBT,0.95);ctx.lineWidth=2.5;rr(ctx,1020,py+16+rh-6,400,rh,10);ctx.stroke();ctx.restore();}});
  vign(ctx,S);
});

/* ---------- 5. The layers together ---------- */
// the lineage's steps: their code names are texture, drawn small, and each box fits the name it's drawn with; the stage headings
// over them ("from source to exposure") share one size and read when the camera is on dbt
const IL_NS=15,IL_HD=[[540,"sources",250],[860,"staging",180],[1060,"intermediate",190],[1260,"marts",180],[1470,"exposures",220]];
scene("layers",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cBa=c("back"),cAp=c("appdom"),cBs=c("bsg"),cBu=c("busdom"),cDg=c("dbtgov"),cDx=c("dbx"),dB=nextCue(sc,"bsg")-cBs,eDx=Math.max(cDx+1.4,(sc.ends&&sc.ends.dbx)||cDx+4);
  // the whole system from afar, then the camera goes to each part as its line names it: the application side and the three layers,
  // the business side and what consumes it, dbt over every step, and the lakehouse under it all; then back out
  const cam=sc._cam||camAt([[0,1135,560,1.1],[cBa+2.2,1118,540,0.87],[cAp-0.4,1118,540,0.87],[cAp+1.2,710,690,1.4],[cBu-0.6,710,690,1.4],[cBu+1.2,1730,650,1.6],[cDg-0.7,1730,650,1.6],[cDg+1.3,860,560,1.15],[cDx-0.6,860,560,1.15],[cDx+1.2,900,660,1.5],[eDx,900,660,1.5],[sc.dur+2,1118,560,0.87]],t);
  // a side a close-up cuts recedes to a faint context (its words step back where the frame cuts them), and dbt's card, drawn over
  // every step, steps back while the frame cuts it; the card ends at CB, leaving room under it for the compile and run tags
  bgW(ctx,S,cam);const m=il_m(ctx),seen=(x0,x1)=>sstep(0.92,1,il_seen(ctx,x0,x1)),side=(x0,x1)=>0.15+0.85*seen(x0,x1),CB=408;
  withA(ctx,fin(t,cBa)*sstep(0.96,1,il_seen2(ctx,120,190,1600,CB)),()=>{glass(ctx,120,190,1480,CB-190,20,DBT,{glow:18,ea:0.5});logo(ctx,"dbt",146,214,46);T(ctx,"dbt",146,302,{w:800,size:34});
    const ls=il_sz(ctx,19),l1=302+8+ls*0.9;il_T(ctx,"recipes, tests,",146,l1,320,{w:500,size:19,color:rgba(SOFT,0.95)});il_T(ctx,"docs, lineage",146,l1+ls*1.15,320,{w:500,size:19,color:rgba(SOFT,0.95)});
    const hf=IL_HD.map(([x,n,r])=>il_fit(ctx,n.toUpperCase(),14,r,800)).reduce((a,b)=>a.size<b.size?a:b);
    IL_HD.forEach(([x,n])=>T(ctx,n.toUpperCase(),x,226,{w:800,size:hf.size,align:"center",deco:hf.deco?1:0,color:rgba(DBT,0.85)}));
    const N={src_sis:[540,262],src_lms:[540,318],src_hr:[540,374],stg_enrolments:[860,280],stg_classes:[860,356],int_class_enrolments:[1060,318],fct_class_fill:[1260,280],dim_students:[1260,356],"Executive dashboard":[1470,280],"Census report":[1470,356]};
    const E=[["src_sis","stg_enrolments"],["src_lms","stg_enrolments"],["src_sis","stg_classes"],["stg_enrolments","int_class_enrolments"],["stg_classes","int_class_enrolments"],["int_class_enrolments","fct_class_fill"],["stg_enrolments","dim_students"],["fct_class_fill","Executive dashboard"],["fct_class_fill","Census report"],["dim_students","Census report"]];
    const nw=n=>tw(ctx,n,IL_NS,500,"mono")+24,g=clamp((t-cDg-0.2)/2.6,0,1),col=x=>clamp((g*1.3-(x-540)/930),0,1);
    ctx.save();E.forEach(([a,b])=>{const A=N[a],B=N[b],f=col(B[0]);ctx.strokeStyle=rgba(mix(DBT,LAYER.gold,f),0.45+0.5*f);ctx.lineWidth=2+1.5*f;ctx.beginPath();ctx.moveTo(A[0]+nw(a)/2,A[1]);ctx.bezierCurveTo(A[0]+nw(a)/2+40,A[1],B[0]-nw(b)/2-40,B[1],B[0]-nw(b)/2,B[1]);ctx.stroke();});ctx.restore();
    Object.keys(N).forEach(n=>{const[x,y]=N[n],w=nw(n),ex=n[0]===n[0].toUpperCase(),f=col(x);if(f>0)glow(ctx,x,y,60,LAYER.gold,0.35*f);ctx.fillStyle=ex?"rgba(255,105,75,0.22)":"rgba(10,16,32,0.95)";rr(ctx,x-w/2,y-17,w,34,8);ctx.fill();ctx.strokeStyle=rgba(mix(DBT,LAYER.gold,f),ex?1:0.75);ctx.lineWidth=1.6;rr(ctx,x-w/2,y-17,w,34,8);ctx.stroke();T(ctx,n,x,y+6,{f:"mono",w:500,size:IL_NS,align:"center",deco:1});});});
  // dbt compiles, Databricks runs: each tag sits over the vaults' tops, its lower edge just above them at the size it's drawn
  withA(ctx,fin(t,cDg+0.4),()=>[[720,"dbt compiles the SQL"],[1100,"Databricks runs it"]].forEach(([x,s],i)=>{const f=il_fit(ctx,s,14,360-26,700),ty=462-6-(f.size+16)/2;
    ctx.save();ctx.strokeStyle=rgba(DBT,0.55);ctx.setLineDash([5,7]);ctx.lineDashOffset=-t*20;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,CB+2);ctx.lineTo(x,788);ctx.stroke();ctx.restore();il_tagF(ctx,x,ty,s,i?[255,160,140]:DBT,f,{align:"center",seen:1});}));
  // what each layer does, in a tag inside its vault: the three share one size, the size the longest fits inside a vault's width
  const V=[[420,"Bronze",LAYER.bronze,(r,cc)=>hash(r*31+cc,5)>0.75?null:APP[["sis","lms","hr","fin"][(hash(r*7+cc,6)*4)|0]].c,"keeps what arrived"],[780,"Silver",LAYER.silver,(r,cc)=>hash(r*31+cc,8)>0.8?null:[220,232,255],"makes it consistent"],[1140,"Gold",LAYER.gold,(r,cc)=>hash(r*31+cc,9)>0.8?null:DOM[["students","teaching","research","finance"][(hash(r*5+cc,7)*4)|0]].c,"makes it useful"]],
    vf=V.map(v=>il_fit(ctx,v[4],15,226-26,700)).reduce((a,b)=>a.size<b.size?a:b);
  V.forEach(([x,n,e,f,cap],i)=>withA(ctx,fin(t,cBa+0.3+i*0.2),()=>{vault(ctx,x,462,240,310,e,f,n,null);withA(ctx,fin(t,cBs+i*dB/3),()=>il_tagF(ctx,x+120,742,cap,e,vf,{align:"center",seen:1}));}));
  // the lakehouse: its name, then its three parts in a row after it, as large as the bar leaves them room for
  withA(ctx,fin(t,cBa+0.2),()=>{glass(ctx,380,792,1040,80,18,DBX,{glow:16+16*fin(t,cDx)*(1-sstep(cDx+2,cDx+3,t)),ea:0.5});logo(ctx,"databricks",400,808,48);T(ctx,"Databricks Lakehouse",460,842,{w:800,size:26});
    const P3=["Delta Lake storage","SQL warehouses","Unity Catalog"],x0=460+tw(ctx,"Databricks Lakehouse",il_sz(ctx,26),800)+24,em=P3.reduce((a,s)=>a+tw(ctx,s,100,700)/100,0),fit=(1408-x0-24-78)/em,ts=Math.min(Math.max(17,m),fit),dc=m>0&&fit<m-0.01;
    let x=x0;P3.forEach((s,i)=>{const w=tw(ctx,s,ts,700)+26;withA(ctx,(0.5+0.5*fin(t,cDx+0.4+i*0.5))*seen(x,x+w),()=>il_deco(dc,()=>tag(ctx,x,832,s,[255,160,140],{size:ts})));x+=w+12;});});
  const apA=fin(t,cBa+0.4),pulse=t>cAp&&t<cAp+2.5?1-(t-cAp)/2.5:0;
  // the application side: its systems' names share the size that fits their cards, clear of the cards' icons, and are small print from afar
  withA(ctx,apA*side(40,340),()=>{il_T(ctx,"APPLICATION DOMAINS",40,456,370,{w:800,size:15,seen:1,color:rgba(SOFT,0.9)});const AP=["sis","lms","hr","fin"],af=AP.map(a=>il_fit(ctx,APP[a].n,20,196,700)).reduce((p,q)=>p.size<q.size?p:q);
    AP.forEach((a,i)=>{il_deco(af.deco,()=>il_appCard(ctx,40,470+i*100,300,86,a,af.size));if(pulse>0)glow(ctx,190,513+i*100,160,APP[a].c,0.4*pulse);const Ln=[P(342,513+i*100),P(380,513+i*100),P(400,617),P(420,617)];lane(ctx,Ln,APP[a].c,0.9);spawn(t,0.9,0.9,i*0.2,u=>{const q=at(mk(Ln),u);glow(ctx,q.x,q.y,10,APP[a].c,1);});});});
  withA(ctx,apA,()=>{lane(ctx,[P(660,617),P(780,617)],[235,240,255],0.9);lane(ctx,[P(1020,617),P(1140,617)],[235,240,255],0.9);spawn(t,0.6,0.8,0,u=>{glow(ctx,lerp(660,780,u),617,10,C.white,1);glow(ctx,lerp(1020,1140,u),617,10,C.white,1);});});
  const buA=fin(t,cBa+0.6),bp=t>cBu&&t<cBu+2.5?1-(t-cBu)/2.5:0;
  withA(ctx,buA*side(1470,1880),()=>{il_T(ctx,"BUSINESS DOMAINS",1470,456,410,{w:800,size:15,seen:1,color:rgba(SOFT,0.9)});["students","teaching","research","finance"].forEach((d,i)=>{const y=470+i*100,cc=DOM[d].c;glass(ctx,1470,y,410,86,14,cc,{glow:14+20*bp,ea:0.6});led(ctx,1482,y+14,5,58,cc);il_T(ctx,DOM[d].n,1502,y+36,268,{w:700,size:21,seen:1});
    for(let k=0;k<4;k++){ledFrame(ctx,1502+k*64,y+47,52,33,cc,pv(d,k),{pad:2,lw:1.5,glow:8});pvLive(ctx,d,k,1502+k*64,y+47,52,33,t);}const pn="+"+(18+i*5);withA(ctx,il_whole(ctx,1786,1786+tw(ctx,pn,il_sz(ctx,18),700)),()=>T(ctx,pn,1786,y+70,{w:700,size:18,color:rgba(cc,1)}));
    const Ln=[P(1380,617),P(1420,617),P(1440,y+43),P(1470,y+43)];lane(ctx,Ln,cc,0.9);spawn(t,0.9,0.7,i*0.2,u=>{const q=at(mk(Ln),u);glow(ctx,q.x,q.y,10,cc,1);});});});
  const coA=fin(t,cBa+0.8),cp=t>cBu&&t<cBu+3?1-(t-cBu)/3:0;
  // what consumes it: the three chips, as chip draws them; from afar, where they'd outgrow their room, small print
  withA(ctx,coA*side(1932,2120),()=>{il_T(ctx,"CONSUMPTION",1932,456,330,{w:800,size:15,seen:1,color:rgba(SOFT,0.9)});[513,613,713,813].forEach(y=>lane(ctx,[P(1882,y),P(1908,y)],[235,240,255],0.7));lane(ctx,[P(1908,513),P(1908,813)],[235,240,255],0.6);
    const ys=[530,650,770];ys.forEach(y=>lane(ctx,[P(1908,y),P(1934,y)],[235,240,255],0.8));spawn(t,0.8,0.8,0.3,u=>{glow(ctx,1908,lerp(513,813,u),10,C.white,0.9);});
    [["Databricks Apps","for staff and students"],["Genie","ask in plain words"],["Dashboards and SQL","for analysts and leaders"]].forEach(([a,b],k)=>{if(cp>0)glow(ctx,2080,ys[k],170,LAYER.gold,0.35*cp);il_deco(m>25,()=>chip(ctx,1934,ys[k],"databricks",a,b,{ts:19,ss:15,lh:28}));});});
  // the breather: one pulse of light travels through the whole platform, from a source system to Genie
  const Bb=cue(sc,"breath");if(sc.breathe&&t>Bb){const path=mk([P(190,513),P(400,617),P(540,617),P(900,617),P(1260,617),P(1440,560),P(1675,513),P(1908,513),P(1908,650),P(2090,650)]),u=ease(clamp((t-Bb-0.3)/(sc.breathe-1.0),0,1)),q=at(path,u),fa=1-sstep(sc.dur-0.8,sc.dur,t);
    glow(ctx,q.x,q.y,50,C.white,0.95*fa);glow(ctx,q.x,q.y,160,LAYER.gold,0.45*fa);const sub=[];for(let i=0;i<=40;i++)sub.push(at(path,u*i/40));beam(ctx,sub,LAYER.gold,[[14,0.06*fa],[5,0.22*fa],[2,0.9*fa]]);}
  vign(ctx,S);
});
