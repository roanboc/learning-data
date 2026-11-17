/* ===== No two alike: the university's rooms, the team at its table, and what is drawn on the wall =====
   The team's room on an afternoon is the module's own place, "lpRoom"; this film adds the same room on a Monday morning and a small
   room late on a Wednesday. Everything on the wall is the film's own: scales with nobody's place on them, a scale cut in two with no
   letters on its labels, ten people who took a test twice, a page with five headings, and a meeting's four steps.
     NA_TEAM, na_team(ctx, tt, o)       the eight at the team's table, each with a name; o.names (0 to 1) shows their tags
     na_pair(ctx, tt, o)                Erin and Helena at a small table, for a weekly half hour
     na_bar(ctx, x, y, w, o)            a scale: a soft line with no marks and nobody's place on it; o.u draws it on
     na_marks(ctx, x, y, w, o)          where one typical person's days fell on a scale (a study's count: orange), o.u, o.mid, o.live
     na_cut(ctx, x, y, w, o)            a scale and the people along it, most near the middle; o.cut cuts it in two, o.hop moves one
     na_ten(ctx, x, y, o)               ten people who took a test twice; o.same (0 to 1) fills the four who got the same type again
     na_page(ctx, x, y, w, h, o)        a "How I work" page, small: five headings as bars, lines under each; o.skip leaves one out
     na_says(tt, a, b)                  a mouth that moves from a to b, for someone whose words the voice is giving */

AG_PLACES.naTeamAm=c=>lp_paintRoom(c,{seed:4,light:"morning"});
AG_PLACES.naOne=c=>lp_paintRoom(c,{seed:6,light:"late"});

const na_says=(tt,a,b)=>tt<a||tt>b?0:(0.35+0.35*Math.sin(tt*17.1)+0.3*Math.sin(tt*9.7+1))*sstep(a,a+0.12,tt)*(1-sstep(b-0.12,b,tt));

/* ---------------------------------------------------------------- the team at its table
   Eight seats, left to right: Yusuf and Tomás, who read alike at this size, are kept well apart, and each has a name tag. */
const NA_TEAM=[["noor","Noor",236],["yusuf","Yusuf",440],["jun","Jun",644],["sam","Sam",848],[NA_ERIN,"Erin",1052],[NA_MARTA,"Marta",1256],[NA_TOMAS,"Tomás",1460],["helena","Helena",1672]];
const NA_SEAT_OF=Object.fromEntries(NA_TEAM.map(([w,n,x])=>[n,x]));
const NA_TABLE={x:120,y:836,w:1680,py:596,s:0.5};
function na_team(ctx,tt,o){o=o||{};const B=NA_TABLE,lt=o.light||{light:"day",wall:0.12},A=o.a==null?1:o.a;if(A<=0.004)return;const cut=lp_table(ctx,B.x,B.y,B.w,{a:0});
  NA_TEAM.forEach(([who,name,x],i)=>{const a=A*(o.who&&o.who[name]!=null?o.who[name]:1);if(a<=0.004)return;
    lp_person(ctx,who,x,B.py+(i%2?5:0),B.s,{t:tt+i*0.73,flip:i>=4,cut,light:lt,a,talk:o.talk&&o.talk[name],gaze:(o.gaze&&o.gaze[name])||[2,0.5],nod:o.nod&&o.nod[name],smile:o.smile&&o.smile[name]});});
  ctx.save();ctx.globalAlpha*=A;lp_table(ctx,B.x,B.y,B.w,{depth:84,floor:1064});
  for(const lx of [338,746,1358])lp_laptop(ctx,lx,B.y-44,118,{glow:0.25});ctx.restore();
  const na=(o.names||0)*A;if(na>0.004)NA_TEAM.forEach(([who,name,x])=>{const k=o.tags&&o.tags[name]!=null?o.tags[name]:1;if(k>0.004)lp_tag(ctx,x,374,name,{align:"center",col:LP.ink,a:na*k});});}
// a small speech mark over someone at the table: three dots in a soft bubble; it says nothing, it only shows who is talking
function na_bubble(ctx,x,y,a,k){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y+30,lerp(0.6,1,ag_spr(k==null?9:k,0,0.4)));
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.22)";ctx.shadowBlur=10;ctx.shadowOffsetX=-4;ctx.shadowOffsetY=5;ctx.fillStyle="rgba(250,247,240,0.98)";rr(ctx,x-44,y-26,88,52,26);ctx.fill();
  ctx.beginPath();ctx.moveTo(x-10,y+22);ctx.lineTo(x,y+42);ctx.lineTo(x+12,y+22);ctx.closePath();ctx.fill();ctx.restore();
  ctx.fillStyle=rgba(LP.mut,1);for(const dx of [-20,0,20]){ctx.beginPath();ctx.arc(x+dx,y,6,0,TAU);ctx.fill();}ctx.restore();}
// Erin and Helena at a small table, Erin on the left, facing her: both sit inside the table's width, so its top hides where they end
const NA_PAIR={erin:720,helena:1200,y:690,s:0.95,ty:820,tx:460,tw:1000};
function na_pair(ctx,tt,o){o=o||{};const B=NA_PAIR,lt=o.light||{light:"late"},cut=lp_table(ctx,B.tx,B.ty,B.tw,{a:0});
  lp_person(ctx,NA_ERIN,B.erin,B.y,B.s,{t:tt,cut,light:lt,talk:o.erin,gaze:[2,0.5],smile:o.esmile});
  lp_person(ctx,"helena",B.helena,B.y,B.s,{t:tt+1.1,flip:true,cut,light:lt,talk:o.helena,nod:o.nod,gaze:[2,0.5]});
  lp_table(ctx,B.tx,B.ty,B.tw);}

/* ---------------------------------------------------------------- scales
   A scale is a soft line with rounded ends. Nobody's place is ever marked on one: what is drawn on a scale here is a study's count
   (orange, the module's colour for data) of nobody in particular, or people as plain dots with no names. */
function na_bar(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:clamp(o.u,0,1),h=o.h||12;if(a<=0.004||u<=0)return;ctx.save();ctx.globalAlpha*=a;
  const g=ctx.createLinearGradient(x,0,x+w,0),c0=o.col||[150,138,126];g.addColorStop(0,rgba(ag_lt(c0,0.45),1));g.addColorStop(1,rgba(c0,1));
  ctx.fillStyle=g;rr(ctx,x,y-h/2,w*u,h,h/2);ctx.fill();
  if(o.ends&&u>=1){ctx.fillStyle=rgba(ag_dk(c0,0.25),1);for(const ex of [x,x+w]){ctx.beginPath();ctx.arc(ex,y,h*0.8,0,TAU);ctx.fill();}}ctx.restore();}
// one typical person's days on one scale: forty marks that reach nearly every level, most of them near the person's usual level
// (o.mid, 0 to 1 along it); o.u brings them in, in no order; o.live makes each drift a little, as a day's situation does; o.band
// shows the usual level. Each mark's place is how far it is from the usual level, -1 to 1, the same forty every time
const NA_DAYS=(()=>{const R=ag_rnd(2001),N=40,out=[];for(let i=0;i<N;i++){const q=(i+0.5)/N,f=(q<0.5?-1:1)*(1-Math.sqrt(1-Math.abs(2*q-1)));out.push([f,R(),R()*TAU,0.6+R()*0.8]);}
  for(let i=N-1;i>0;i--){const j=(R()*(i+1))|0,sw=out[i];out[i]=out[j];out[j]=sw;}return out;})();
function na_marks(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:o.u,mid=o.mid==null?0.56:o.mid,t=o.t||0,lv=o.live||0;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  const ba=o.band||0;if(ba>0.004){const bx=x+w*(mid-0.11),bw=w*0.22;ctx.fillStyle=rgba(LP.orange,0.14*ba);rr(ctx,bx,y-66,bw,132,18);ctx.fill();ctx.strokeStyle=rgba(LP.orange,0.7*ba);ctx.lineWidth=2.5;ctx.setLineDash([10,8]);rr(ctx,bx,y-66,bw,132,18);ctx.stroke();ctx.setLineDash([]);}
  NA_DAYS.forEach(([d,v,ph,sp],i)=>{const k=clamp(u*NA_DAYS.length-i,0,1);if(k<=0)return;const px=x+w*clamp(mid+d*(d<0?mid-0.05:0.95-mid)+lv*0.03*Math.sin(t*sp*0.9+ph),0.02,0.98),py=y-18-v*34;
    ctx.fillStyle=rgba(LP.orange,0.82*ag_sine(k));ctx.beginPath();ctx.arc(px,py+(1-ag_spr(k,0,0.9))*-14,7,0,TAU);ctx.fill();});
  ctx.restore();}
// the people who take a test, along one scale: fifty plain dots in fourteen columns, most near the middle, as many on one side as
// on the other. o.cut (0 to 1) draws the cut: one side's dots stay filled and the other's become rings, with no colour that means
// anything. o.near (0 to 1) bands those close to the cut; o.hop (0 to 1) moves one of them a little way across it
const NA_COLS=[7,6,5,3,2,1,1];
const NA_CROWD=(()=>{const out=[];for(const sd of [-1,1])NA_COLS.forEach((n,k)=>{for(let r=0;r<n;r++)out.push([0.5+sd*(k+0.5)*0.05,r,k,sd]);});
  return out.sort((p,q)=>p[1]-q[1]||Math.abs(p[0]-0.5)-Math.abs(q[0]-0.5));})();
// one of them: a filled dot, or (ring, 0 to 1) a ring; a (0 to 1) darkens it as the cut is made
function na_dot(ctx,px,py,r,ring,a){const base=[100,92,88],ink=[58,52,50];ctx.fillStyle=rgba(mix(mix(base,ink,a),[248,244,236],ring),1);ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.fill();
  if(ring>0.004){ctx.strokeStyle=rgba(ink,ring);ctx.lineWidth=3.2;ctx.beginPath();ctx.arc(px,py,r-1.6,0,TAU);ctx.stroke();}}
function na_cut(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,ct=o.cut||0,nr=o.near||0,u=o.u==null?1:o.u,hop=clamp(o.hop||0,0,1),pitch=30;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const A=ctx.globalAlpha;
  if(nr>0.004){const bx=x+w*0.335,bw=w*0.33;ctx.fillStyle=rgba(LP.amber,0.13*nr);rr(ctx,bx,y-252,bw,236,18);ctx.fill();
    ctx.strokeStyle=rgba(LP.amber,0.85*nr);ctx.lineWidth=3;ctx.setLineDash([12,9]);rr(ctx,bx,y-252,bw,236,18);ctx.stroke();ctx.setLineDash([]);}
  na_bar(ctx,x,y,w,{ends:true});
  NA_CROWD.forEach(([cx,row,k,sd],i)=>{const kk=clamp(u*NA_CROWD.length-i,0,1);if(kk<=0)return;const mover=sd<0&&k===0&&row===NA_COLS[0]-1;let px=x+w*cx,py=y-34-row*pitch;
    if(mover&&hop>0){px=x+w*lerp(cx,1-cx,hop);py=y-34-lerp(row,row+1,hop)*pitch-Math.sin(Math.PI*hop)*30;}
    ctx.globalAlpha=A*ag_sine(kk);na_dot(ctx,px,py,11,px>x+w/2?ct:0,ct);
    if(mover&&o.mark>0.004){ctx.strokeStyle=rgba(LP.amber,o.mark);ctx.lineWidth=4;ctx.beginPath();ctx.arc(px,py,18,0,TAU);ctx.stroke();}});
  ctx.globalAlpha=A;
  if(ct>0.004){ctx.strokeStyle=rgba(LP.ink,0.85*ct);ctx.lineWidth=4;ctx.setLineDash([14,10]);ctx.beginPath();ctx.moveTo(x+w/2,y+34);ctx.lineTo(x+w/2,y+34-322*ag_sine(ct));ctx.stroke();ctx.setLineDash([]);}
  ctx.restore();}
// ten people who took a test twice, in a row; o.u brings them in, o.same (0 to 1) fills the four whose type came out the same
function na_ten(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:o.u,sm=o.same||0,gap=o.gap||92;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<10;i++){const k=clamp(u*10-i,0,1);if(k<=0)continue;const px=x+i*gap,sc=lerp(0.6,1,ag_spr(k,0,0.6)),same=i<4;ctx.save();ctx.globalAlpha*=ag_sine(k);ag_about(ctx,px,y,sc);
    // a small person: a head and shoulders, the same for all ten
    const body=()=>{ctx.beginPath();ctx.arc(px,y-34,17,0,TAU);ctx.moveTo(px-30,y+34);ctx.bezierCurveTo(px-30,y-8,px+30,y-8,px+30,y+34);ctx.closePath();};
    body();ctx.fillStyle=rgba(LP.paper,1);ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=rgba(LP.orange,1);body();ctx.stroke();
    if(same&&sm>0.004){ctx.save();ctx.globalAlpha*=clamp(sm*4-i,0,1);body();ctx.fillStyle=rgba(LP.orange,1);ctx.fill();ctx.restore();}ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the page: How I work
   Five headings, each person's words under them. Small pages show their headings as short dark bars and the words as pale lines: no
   two are filled alike, and one that leaves a heading out (o.skip, its number) shows that heading with nothing under it. */
const NA_HEADS=["When I do my best work","How to ask me for something","How to disagree with me","What wears me out","What I'm getting better at"];
function na_page(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const R=ag_rnd(o.seed||1),u=o.u==null?1:o.u;
  lp_sheet(ctx,x,y,w,h,{light:o.light===undefined?"day":o.light,pin:o.pin,tilt:o.tilt,a,k:o.k});ctx.save();ctx.globalAlpha*=a;
  if(o.tilt){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.tilt*Math.PI/180);ctx.translate(-x-w/2,-y-h/2);}
  const top=y+h*0.16,step=(h*0.8)/5,pad=w*0.12;
  for(let i=0;i<5;i++){const yy=top+i*step,k=clamp(u*5-i,0,1);if(k<=0)continue;ctx.globalAlpha=a*ag_sine(k);
    ctx.fillStyle=rgba(LP.ink,0.78);rr(ctx,x+pad,yy,w*(0.34+R()*0.22),Math.max(5,h*0.022),3);ctx.fill();
    const n=o.skip===i?0:1+((R()*2.4)|0);for(let j=0;j<2;j++){const lw=w*(0.4+R()*0.34);if(j>=n)continue;ctx.fillStyle=rgba(LP.mut,0.42);rr(ctx,x+pad,yy+h*0.05+j*h*0.04,lw,Math.max(4,h*0.016),2);ctx.fill();}
    if(o.skip===i&&o.gap>0.004){ctx.globalAlpha=a*o.gap;ctx.strokeStyle=rgba(LP.mut,0.8);ctx.lineWidth=2;ctx.setLineDash([7,6]);rr(ctx,x+pad-6,yy+h*0.04,w-pad*2+12,h*0.085,5);ctx.stroke();ctx.setLineDash([]);}}
  ctx.restore();}
