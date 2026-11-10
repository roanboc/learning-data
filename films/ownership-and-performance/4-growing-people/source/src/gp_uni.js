/* ===== Growing people: the university, 2027, and the opening's diagrams =====
   The film's own pictures (prefix gp_). The module's kit draws the rooms, the people, the sheets and the things in them, and is never
   changed for this film; what is here is this film's alone:
     gpMorning, gpOne, gpDecember   the team's room on a morning; the small room where Helena holds her one-to-ones, late in the
                                    afternoon; the same room on a December evening, its lamp on
     gpGrey                         a room on a grey day, for the analyst who works alone
     gp_cycle(ctx, cx, cy, r, o)    lesson study's cycle, round a ring, its steps on the diagonals: choose a goal, plan it together, one
                                    teaches while the others watch, improve it for next time (o.u: drawn round; o.hi: [a0..a3], each lit)
     gp_schools(ctx, x, y, o)       twenty schools of 1877 in two rows, the first's middle at (x, y): in the first, the four in ten with a
                                    single teacher; in the second, the three in ten with a single classroom (o.one, o.room: their amber)
     gp_goals(ctx, x, y, o)         Ivy's three goals on a blue sheet, written one by one (o.n, 0 to 3), each met with a green tick
                                    (o.done: [a0, a1, a2]), and the day they agree them (o.agreed)
     gp_route(ctx, x, y, o)         her one page: the route of Graham's question, from his decision back to the sensors (o.u, row by row)
     gp_split(ctx, x, y, w, o)      600 results on feedback as one bar: where it helped (o.g), and the third and more where it made the work
                                    worse (o.am)
     gp_weeks(ctx, x, y, o)         a year of Tuesdays, a small square each (o.u), against one review a year, crossed out (o.x)
     gp_steps(ctx, x, y, o)         analyst, owner, coach: three steps up, each with more to own (o.u: built; o.at: where she stands)
     gp_teams(ctx, x, y, o)         the trial's 39 teams of teachers, a dot each (o.u)
     gp_strip(ctx, x, y, w, o)      a fraction strip on paper: a whole, halves and quarters, one quarter shaded
     gp_shut(ctx, x, y, s, o)       a book, closed, lying on a sheet
   Colour keeps the module's meaning: blue plans (Ivy's goals, the cycle), orange data (Teaching space use), green what's done or what
   helped (each goal met, what her work changed), amber a risk or a cost (the teacher alone, feedback about the person, the rushed review),
   violet the agent only (its draft). People are never a colour. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.gpMorning=c=>lp_paintRoom(c,{light:"morning",seed:4});
AG_PLACES.gpOne=c=>lp_paintRoom(c,{light:"late",seed:12,base:[222,206,190]});
AG_PLACES.gpDecember=c=>lp_paintRoom(c,{light:"evening",seed:12,base:[222,206,190],lamp:[1500,280]});
AG_ROOMS.gpDecember="gpOne";
AG_PLACES.gpGrey=c=>lp_paintRoom(c,{light:"grey",seed:6});

/* ---------------------------------------------------------------- lesson study's cycle */
const GP_CYCLE=["Choose a goal","Plan it together","One teaches, the others watch","Improve it for next time"];
function gp_cycle(ctx,cx,cy,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,hi=o.hi||[],at=k=>-Math.PI/4+k*Math.PI/2;ctx.save();ctx.globalAlpha*=a;
  // the ring, in four arcs between the steps (which sit on its diagonals, so its middle stays clear), each ending in an arrowhead:
  // clockwise from the top right
  ctx.strokeStyle=rgba(LP.blue,0.85);ctx.fillStyle=rgba(LP.blue,0.85);ctx.lineWidth=6;ctx.lineCap="round";
  for(let k=0;k<4;k++){const p=clamp(u*4-k,0,1);if(p<=0)continue;const a0=at(k)+0.42,a1=a0+(Math.PI/2-0.84)*ag_sine(p);
    ctx.beginPath();ctx.arc(cx,cy,r,a0,a1);ctx.stroke();
    if(p>0.9){const ex=cx+Math.cos(a1)*r,ey=cy+Math.sin(a1)*r,d=a1+Math.PI/2;ctx.beginPath();ctx.moveTo(ex+Math.cos(d)*18,ey+Math.sin(d)*18);
      ctx.lineTo(ex+Math.cos(d+2.5)*20,ey+Math.sin(d+2.5)*20);ctx.lineTo(ex+Math.cos(d-2.5)*20,ey+Math.sin(d-2.5)*20);ctx.closePath();ctx.fill();}}
  lp_T(ctx,"Lesson study",cx,cy+14,{w:800,size:40,align:"center",a:ag_in(u,0.5,0.4)});
  // the four steps, outlined until they're said, then solid
  GP_CYCLE.forEach((s,k)=>{const x=cx+Math.cos(at(k))*r,y=cy+Math.sin(at(k))*r,sa=clamp(u*4-k+0.6,0,1);if(sa<=0)return;
    const h=clamp(hi[k]||0,0,1);lp_tag(ctx,x,y,s,{align:"center",col:LP.blue,a:sa*(1-h)});if(h>0.004)lp_pill(ctx,x,y,s,{col:LP.blue,size:28,a:sa*h});});
  ctx.restore();}

/* ---------------------------------------------------------------- the schools of 1877 */
// one small school, s its size (1: 80 px wide): its roof, its walls, a door and a window, in ink on paper; amber (0 to 1) where it
// stands for the problem
function gp_school(ctx,x,y,amb,s){const ink=rgba(mix(LP.ink,LP.amber,amb),1);ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle=rgba(mix(LP.paper,mix(LP.amber,LP.paper,0.72),amb),1);ctx.strokeStyle=ink;ctx.lineWidth=4;ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(-40,-6);ctx.lineTo(0,-40);ctx.lineTo(40,-6);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.rect(-32,-6,64,46);ctx.fill();ctx.stroke();
  ctx.fillStyle=ink;ctx.fillRect(-8,14,16,26);ctx.strokeRect(14,4,12,12);ctx.restore();}
// two rows of ten, 150 px apart, the first row's middle at (x, y) and the second 250 px below
function gp_schools(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const one=o.one||0,room=o.room||0,u=o.u==null?1:o.u;ctx.save();ctx.globalAlpha*=a;
  const A=[1,4,6,9],B=[2,5,8];
  for(let r=0;r<2;r++)for(let k=0;k<10;k++){const sa=clamp(u*12-k*0.6-r*2,0,1);if(sa<=0)continue;ctx.save();ctx.globalAlpha*=ag_sine(sa);
    gp_school(ctx,x+(k-4.5)*150,y+r*250,r===0?(A.includes(k)?one:0):(B.includes(k)?room:0),1.35);ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- Ivy's goals */
const GP_GOALS=[["Know the whole route of one question's data","by Easter"],["Have a pull request merged","by May"],["Own a data product","by mid-year"]];
function gp_goals(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||980,h=338,bb={x,y,w,h};if(a<=0.004)return bb;const n=o.n==null?3:o.n,done=o.done||[];
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light===undefined?"day":o.light});
  lp_T(ctx,"IVY'S GOALS",x+LP_PAD,y+LP_PAD+44,{w:800,size:28,ls:3,col:LP.blue});
  GP_GOALS.forEach(([g,by],i)=>{const la=ag_sine(clamp(n-i,0,1));if(la<=0.004)return;const yy=y+LP_PAD+124+i*70;ctx.save();ctx.globalAlpha*=la;
    ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(x+LP_PAD+18,yy-10,18,0,TAU);ctx.fill();lp_T(ctx,String(i+1),x+LP_PAD+18,yy,{w:800,size:28,align:"center",color:"#fff"});
    const tw=lp_tw(ctx,g,{w:600,size:28});lp_T(ctx,g,x+LP_PAD+52,yy,{w:600,size:28});lp_T(ctx,by,x+LP_PAD+52+tw+14,yy,{w:600,size:28,col:LP.mut});
    const d=clamp(done[i]||0,0,1);if(d>0.004){const tx=x+w-LP_PAD-26;ctx.save();ctx.globalAlpha*=d;ag_about(ctx,tx,yy-10,lerp(0.6,1,ag_spr(d*1.2,0,0.5)));
      ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(tx,yy-10,24,0,TAU);ctx.fill();lp_icon(ctx,"tick",tx,yy-10,30,[255,255,255]);ctx.restore();}
    ctx.restore();});
  if(o.agreed>0.004)lp_pill(ctx,x+w-210,y+h+46,"Agreed, Friday 5 March",{col:LP.blue,icon:"tick",size:28,a:o.agreed,k:o.agreedK});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- Ivy's page: the route of Graham's question */
const GP_ROUTE=["His decision: ask for a new building?","The question behind it","The data that answers it","Where it's born: bookings, sensors","Who keeps it, and the rule for it"];
function gp_route(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||820,h=640;if(a<=0.004)return;const u=o.u==null?1:o.u;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:o.col||null,light:o.light===undefined?"day":o.light});
  lp_T(ctx,"ONE PAGE",x+LP_PAD,y+LP_PAD+44,{w:800,size:28,ls:3,col:LP.mut});lp_T(ctx,"The route of Graham's question",x+LP_PAD,y+LP_PAD+98,{w:800,size:40});
  GP_ROUTE.forEach((s,i)=>{const ra=ag_sine(clamp(u*GP_ROUTE.length-i,0,1));if(ra<=0.004)return;const by=y+176+i*90,bx=x+LP_PAD,bw=w-LP_PAD*2;ctx.save();ctx.globalAlpha*=ra;
    ctx.strokeStyle=rgba(LP.mut,0.8);ctx.lineWidth=2.5;rr(ctx,bx,by,bw,62,10);ctx.stroke();lp_T(ctx,s,bx+24,by+41,{w:600,size:28});
    if(i<GP_ROUTE.length-1){ctx.strokeStyle=rgba(LP.mut,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bx+bw/2,by+64);ctx.lineTo(bx+bw/2,by+88);ctx.stroke();}ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- 600 results on feedback, as one bar */
function gp_split(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const g=clamp(o.g||0,0,1),am=clamp(o.am||0,0,1),h=78,cut=0.62;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(mix(LP.paper,LP.mut,0.12),1);rr(ctx,x,y,w,h,12);ctx.fill();
  ctx.save();rr(ctx,x,y,w,h,12);ctx.clip();ctx.fillStyle=rgba(LP.green,1);ctx.fillRect(x,y,w*ag_sine(g)*lerp(1,cut,ag_sine(am)),h);
  if(am>0){ctx.fillStyle=rgba(LP.amber,1);const aw=w*(1-cut)*ag_sine(am);ctx.fillRect(x+w-aw,y,aw,h);}ctx.restore();
  if(g>0.5)lp_T(ctx,"Helped",x+28,y+h/2+10,{w:800,size:28,color:"#fff",a:ag_in(g,0.5,0.5)});
  if(am>0.5)lp_T(ctx,"Worse",x+w-28,y+h/2+10,{w:800,size:28,align:"right",color:"#fff",a:ag_in(am,0.5,0.5)});
  ctx.restore();}

/* ---------------------------------------------------------------- a year of Tuesdays */
function gp_weeks(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,xa=o.x||0;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<46;i++){const col=i%23,row=Math.floor(i/23),fa=clamp(u*46-i,0,1);ctx.strokeStyle=rgba(LP.green,0.6);ctx.lineWidth=2;rr(ctx,x+col*44,y+row*48,34,34,6);ctx.stroke();
    if(fa>0){ctx.fillStyle=rgba(LP.green,fa);rr(ctx,x+col*44,y+row*48,34,34,6);ctx.fill();}}
  // one review a year: a single large square, then crossed out
  if(o.once>0.004){const ox=x+23*44+60,oy=y,sz=82;ctx.save();ctx.globalAlpha*=o.once;ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=4;rr(ctx,ox,oy,sz,sz,8);ctx.stroke();
    if(xa>0){ctx.lineWidth=6;ctx.lineCap="round";const p=ag_sine(xa);ctx.beginPath();ctx.moveTo(ox+10,oy+10);ctx.lineTo(ox+10+(sz-20)*p,oy+10+(sz-20)*p);ctx.stroke();
      if(xa>0.5){const q=ag_sine((xa-0.5)*2);ctx.beginPath();ctx.moveTo(ox+sz-10,oy+10);ctx.lineTo(ox+sz-10-(sz-20)*q,oy+10+(sz-20)*q);ctx.stroke();}}ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- analyst, owner, coach */
const GP_STEPS=[["Analyst",LP.green],["Owner",LP.green],["Coach",LP.blue]];
// three steps standing on the floor at y, from x: each sw wide and sh higher than the last, its pill over it
function gp_steps(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,sw=o.sw||360,sh=o.sh||110;ctx.save();ctx.globalAlpha*=a;
  GP_STEPS.forEach(([s,col],i)=>{const p=ag_sine(clamp(u*3-i,0,1));if(p<=0.004)return;const bx=x+i*sw,bh=(i+1)*sh,top=y-bh;ctx.save();ctx.globalAlpha*=p;
    ctx.save();ctx.shadowColor="rgba(52,36,30,0.28)";ctx.shadowBlur=16;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=10;ctx.fillStyle=rgba(mix(LP.timber,LP.paper,0.35),1);ctx.fillRect(bx,top,sw,bh);ctx.restore();
    ctx.fillStyle=rgba(mix(LP.timber,[255,250,240],0.5),1);ctx.fillRect(bx,top,sw,10);
    lp_pill(ctx,bx+sw/2,top-52,s,{col,size:34,icon:i<2?"tick":null,k:u*3-i});ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the trial's teams (in ink: the film never says how many used lesson study), a fraction strip, a book */
function gp_teams(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<39;i++){const p=clamp(u*39-i,0,1);if(p<=0)continue;const cx=x+(i%13)*58,cy=y+Math.floor(i/13)*58;ctx.fillStyle=rgba(mix(LP.ink,LP.paper,0.3),p);ctx.beginPath();ctx.arc(cx,cy,lerp(8,19,ag_spr(p,0,0.5)),0,TAU);ctx.fill();}
  ctx.restore();}
function gp_strip(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(LP.ink,0.85);ctx.lineWidth=3;
  for(let r=0;r<3;r++){const yy=y+r*66,n=[1,2,4][r];ctx.strokeRect(x,yy,w,48);for(let k=1;k<n;k++){ctx.beginPath();ctx.moveTo(x+w*k/n,yy);ctx.lineTo(x+w*k/n,yy+48);ctx.stroke();}}
  ctx.fillStyle=rgba(LP.green,0.35*(o.shade==null?1:o.shade));ctx.fillRect(x+2,y+132+2,w/4-4,44);
  ctx.restore();}
function gp_shut(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=230*s,h=300*s,col=[104,92,84];ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.3)";ctx.shadowBlur=18;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=10;ctx.fillStyle=rgba(col,1);rr(ctx,x,y,w,h,8*s);ctx.fill();ctx.restore();
  ctx.fillStyle=rgba(ag_dk(col,0.25),1);ctx.fillRect(x,y,22*s,h);ctx.fillStyle="rgba(255,250,240,0.16)";ctx.fillRect(x+22*s,y,w-22*s,10*s);
  ctx.fillStyle=rgba([238,232,218],1);ctx.fillRect(x+w-10*s,y+10*s,6*s,h-20*s);
  ctx.strokeStyle="rgba(255,250,240,0.35)";ctx.lineWidth=3*s;ctx.strokeRect(x+50*s,y+60*s,w-90*s,70*s);ctx.restore();}

/* ---------------------------------------------------------------- the people of this part */
// a new analyst, alone with her work: one of the kit's crowd
const GP_ANALYST=lp_crowd(2);
// a sheet of paper in the near hand, in figure space: Ivy's one page, Graham's note
const gp_paper=(lines)=>(c,h)=>{const [x,y]=h.near;c.save();c.translate(x+14,y-40);c.rotate(-0.16);c.save();c.shadowColor="rgba(52,36,30,0.3)";c.shadowBlur=10;c.shadowOffsetX=-4;c.shadowOffsetY=4;
  c.fillStyle=rgba([248,244,234],1);c.fillRect(0,0,110,146);c.restore();c.strokeStyle=rgba([150,140,130],0.6);c.lineWidth=3;
  for(let k=0;k<(lines||6);k++){c.beginPath();c.moveTo(14,22+k*19);c.lineTo(96-(k%3)*12,22+k*19);c.stroke();}c.restore();};
