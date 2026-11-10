/* ===== The team comes first: the university, 2027 =====
   The film's own people, places and sheets at the university (prefix tf_), in the module's sunlit plaster.
     TF_ERIN              Erin Walsh, the team's platform engineer: one of the three the module's numbers left unnamed, named here
     tfMorning, tfLate    the team's room in the morning, and in the late afternoon sun (the module's lpRoom is its afternoon)
     tfDark               the team's room at night (one room with lpRoom: AG_ROOMS)
     tfSam, tfHelena      Sam's room at home, and Helena's, in the evening, a lamp lit
     tfReview             the room of the quarterly review, on a grey October day
     tf_phone             a phone in the hand, its screen dark, lit, or lit with an alert
     tf_rota              the night rota on a sheet: a plan, so its band is blue
     tf_balance           a balance: managing on one side, leading on the other
     tf_chain             a few words joined by arrows, one leading to the next
     tf_print             a framed print of the stokvel's room, for the team's wall at the end
   Colour keeps the module's meaning: blue plans and definitions (the rota, the runbook, the glossary), green done or of value (an alert
   answered, a mistake thanked, the credit), amber risk or cost (the alerts, one person answering all of them, Jun's load), violet only
   the agent (its draft). */

/* ---------------------------------------------------------------- Erin Walsh
   The platform engineer (she/her): the module's numbers name the team's eight, three of them not by name; this film names her, as film
   14 named the report developer. Looked at full size, facing both ways. Her clothes keep clear of the five colours. */
const TF_ERIN={name:"Erin Walsh",role:"Platform engineer",key:"tfErin",skin:[232,196,170],hair:{style:"bun",c:[132,76,48]},earrings:[214,200,170],top:{kind:"sweater",c:[126,106,96]},breath:0.28};

/* ---------------------------------------------------------------- places */
AG_PLACES.tfMorning=c=>lp_paintRoom(c,{light:"morning",seed:4});
AG_PLACES.tfLate=c=>lp_paintRoom(c,{light:"late",seed:6});
AG_PLACES.tfDark=c=>{lp_paintRoom(c,{light:"evening"});tf_lamp(c,1380,300);};
AG_ROOMS.tfDark="lpRoom";
// a lamp on the wall, lit: its pool of light is the room's (lp_paintRoom's "evening")
function tf_lamp(c,x,y){c.save();c.fillStyle=rgba(LP.graphite,1);c.fillRect(x-4,y+18,8,40);c.fillRect(x-22,y+56,44,8);
  const g=c.createLinearGradient(x-46,0,x+46,0);g.addColorStop(0,"rgb(214,190,150)");g.addColorStop(1,"rgb(250,232,196)");c.fillStyle=g;
  c.beginPath();c.moveTo(x-28,y-30);c.lineTo(x+28,y-30);c.lineTo(x+46,y+22);c.lineTo(x-46,y+22);c.closePath();c.fill();
  c.globalCompositeOperation="screen";const q=c.createRadialGradient(x,y+24,0,x,y+24,90);q.addColorStop(0,"rgba(255,226,180,0.8)");q.addColorStop(1,"rgba(255,226,180,0)");c.fillStyle=q;c.fillRect(x-90,y-66,180,180);c.restore();}
// a framed picture on a wall at home: a few soft hills, nothing that means anything
function tf_frame(c,x,y,w,h,o){o=o||{};c.save();c.shadowColor="rgba(40,28,24,0.4)";c.shadowBlur=14;c.shadowOffsetX=LP.sdx*0.6;c.shadowOffsetY=6;c.fillStyle=rgba(mix(LP.timber,LP.shade,0.25),1);c.fillRect(x-10,y-10,w+20,h+20);c.restore();
  let g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgb(226,218,204)");g.addColorStop(1,"rgb(206,196,180)");c.fillStyle=g;c.fillRect(x,y,w,h);
  for(const [k,col] of [[0.55,[170,162,150]],[0.7,[146,138,128]],[0.84,[124,116,108]]]){c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+h*k);
    for(let i=0;i<=8;i++)c.lineTo(x+w*i/8,y+h*k-Math.sin(i*1.3+k*7)*h*0.06);c.lineTo(x+w,y+h);c.closePath();c.fill();}
  if(o.dim){c.fillStyle=rgba(LP.shade,o.dim);c.fillRect(x-10,y-10,w+20,h+20);}}
AG_PLACES.tfSam=c=>{lp_paintRoom(c,{light:"evening",seed:9,base:[214,202,186]});tf_frame(c,240,190,300,220,{dim:0.3});tf_lamp(c,1380,300);};
AG_PLACES.tfHelena=c=>{lp_paintRoom(c,{light:"evening",seed:14,base:[222,210,192],lamp:[1460,300]});tf_frame(c,1080,180,240,300,{dim:0.25});tf_lamp(c,1460,300);};
AG_PLACES.tfReview=c=>lp_paintRoom(c,{light:"grey",seed:21});

/* ---------------------------------------------------------------- a phone in the hand
   tf_phone(o) is a holdBack for lp_person (the hand closes over its foot): o.lit 0 to 1 (its screen on), o.alert 0 to 1 (an alert on it,
   in amber), o.call 0 to 1 (a call: a green band, the line open). In figure space, at the near hand's grip. */
function tf_phone(o){o=o||{};return(c,h)=>{const [x,y]=tf_grip(h),lit=o.lit||0;c.save();c.translate(x+8,y-54);c.rotate(-0.1);
  ag_soft(c,cc=>ag_rect(cc,-36,-68,72,136,13),[38,38,42],[104,104,112],12,-56,70,"rgba(0,0,0,0.45)",8);
  c.fillStyle="rgb(24,24,28)";rr(c,-30,-60,60,120,8);c.fill();
  if(lit>0){c.globalAlpha*=lit;const g=c.createLinearGradient(0,-60,0,60);g.addColorStop(0,"rgb(236,238,242)");g.addColorStop(1,"rgb(214,218,226)");c.fillStyle=g;rr(c,-30,-60,60,120,8);c.fill();
    if(o.alert>0){c.save();c.globalAlpha*=o.alert;c.fillStyle=rgba(LP.amber,1);rr(c,-24,-44,48,26,6);c.fill();c.fillStyle="rgba(255,255,255,0.9)";c.fillRect(-16,-34,32,4);c.fillRect(-16,-26,22,3);c.restore();}
    if(o.call>0){c.save();c.globalAlpha*=o.call;c.fillStyle=rgba(LP.green,1);rr(c,-24,24,48,22,11);c.fill();c.restore();}
    c.globalAlpha=1;}
  c.restore();};}
// the screen's light on whoever holds the phone, at night: a soft cool glow, laid on the frame over them (x, y: the phone, in the frame)
function tf_glow(ctx,x,y,r,a){if(a<=0.004)return;ctx.save();ctx.globalCompositeOperation="soft-light";const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,"rgba(226,236,255,"+(0.75*a)+")");g.addColorStop(1,"rgba(226,236,255,0)");
  ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();}

/* ---------------------------------------------------------------- the night rota
   tf_rota(ctx, x, y, w, o): a sheet with a blue band, its kicker and title (o.kick, o.title), and a row for each week (o.rows: [[who,
   when], ...]), coming in one by one (o.u, 0 to 1); o.hi: a row lit, behind its words; o.cover {i, u, text}: that row's name struck
   through in amber and the names that take it written beside it in green; o.a, o.k, o.light as lp_sheet. Returns its box. */
function tf_rota(ctx,x,y,w,o){o=o||{};const rows=o.rows||[],rh=58,top=y+LP_PAD+30+44+50+18,h=top-y+rows.length*rh+LP_PAD-10,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0.004)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light===undefined?"day":o.light,pin:o.pin});let yy=y+LP_PAD+30;
  lp_T(ctx,String(o.kick||"").toUpperCase(),x+LP_PAD,yy+14,{w:800,size:28,ls:3,col:LP.blue});yy+=44;lp_T(ctx,o.title||"",x+LP_PAD,yy+42,{w:800,size:40});
  rows.forEach((r,i)=>{const ra=o.u==null?1:clamp(o.u*rows.length-i,0,1),ry=top+i*rh;if(ra<=0)return;ctx.save();ctx.globalAlpha*=ag_sine(ra);
    if(o.hi===i){ctx.fillStyle=rgba(LP.blue,0.1);ctx.fillRect(x+16,ry-6,w-32,rh-6);}
    ctx.strokeStyle=rgba(LP.mut,0.3);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+LP_PAD,ry+rh-8);ctx.lineTo(x+w-LP_PAD,ry+rh-8);ctx.stroke();
    lp_T(ctx,r[0],x+LP_PAD,ry+34,{w:800,size:32});lp_T(ctx,r[1],x+w-LP_PAD,ry+34,{w:600,size:28,col:LP.mut,align:"right"});
    const cv=o.cover;if(cv&&cv.i===i&&cv.u>0){const tw=lp_tw(ctx,r[0],{w:800,size:32}),su=ag_sine(clamp(cv.u*2,0,1));ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=4;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(x+LP_PAD-4,ry+23);ctx.lineTo(x+LP_PAD-4+(tw+8)*su,ry+23);ctx.stroke();
      lp_T(ctx,cv.text,x+LP_PAD+tw+24,ry+34,{w:800,size:32,col:LP.green,a:ag_sine(clamp(cv.u*2-1,0,1))});}
    ctx.restore();});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- a balance
   tf_balance(ctx, cx, cy, o): a timber beam on a graphite post (its pivot at cx, cy), a pan hanging from each end with its word on it
   (o.left, o.right); o.tilt, radians, the right side down when positive; o.a. */
function tf_balance(ctx,cx,cy,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const L=380,tl=o.tilt||0,ca=Math.cos(tl),sa=Math.sin(tl);ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(LP.shade,0.16);ctx.beginPath();ctx.ellipse(cx+LP.sdx*3,cy+330,150,14,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(LP.graphite,1);ctx.fillRect(cx-9,cy,18,320);ctx.fillRect(cx-110,cy+316,220,14);ctx.beginPath();ctx.moveTo(cx-26,cy+10);ctx.lineTo(cx,cy-24);ctx.lineTo(cx+26,cy+10);ctx.closePath();ctx.fill();
  ctx.save();ctx.translate(cx,cy-24);ctx.rotate(tl);const g=ctx.createLinearGradient(0,-10,0,10);g.addColorStop(0,rgba(mix(LP.timber,[255,250,240],0.25),1));g.addColorStop(1,rgba(mix(LP.timber,LP.shade,0.3),1));
  ctx.fillStyle=g;rr(ctx,-L-16,-11,2*L+32,22,8);ctx.fill();ctx.restore();
  for(const [sd,word] of [[-1,o.left],[1,o.right]]){const px=cx+sd*L*ca,py=cy-24+sd*L*sa,pb=py+150;
    ctx.strokeStyle=rgba(LP.graphite,0.9);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-110,pb);ctx.moveTo(px,py);ctx.lineTo(px+110,pb);ctx.stroke();
    ctx.save();ctx.shadowColor="rgba(52,36,30,0.28)";ctx.shadowBlur=14;ctx.shadowOffsetX=LP.sdx*0.5;ctx.shadowOffsetY=6;ctx.fillStyle=rgba(LP.paper,1);
    ctx.beginPath();ctx.moveTo(px-150,pb);ctx.lineTo(px+150,pb);ctx.bezierCurveTo(px+140,pb+46,px-140,pb+46,px-150,pb);ctx.closePath();ctx.fill();ctx.restore();
    ctx.fillStyle=rgba(LP.graphite,1);ctx.beginPath();ctx.arc(px,py,7,0,TAU);ctx.fill();
    lp_T(ctx,word,px,pb-16,{w:800,size:34,align:"center"});}
  ctx.restore();}

/* ---------------------------------------------------------------- words joined by arrows
   tf_chain(ctx, x, y, items, o): items [{text, col, pill}] in a row from x, centred on y, gap px apart, each coming in at its own
   time (o.u, 0 to 1 across them): an outlined tag (or a solid pill, pill: true), then an arrow to the next. o.a. */
function tf_chain(ctx,x,y,items,o){o=o||{};const a=o.a==null?1:o.a,gap=o.gap||64;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;let xx=x;
  items.forEach((it,i)=>{const u=o.u==null?1:clamp(o.u*items.length-i,0,1),w=it.pill?lp_tw(ctx,it.text,{w:800,size:30})+60:lp_tw(ctx,it.text,{w:700,size:28})+52;
    if(i>0&&u>0){const ax0=xx-gap+10,ax1=xx-12,au=ag_sine(clamp(u*2,0,1));ctx.strokeStyle=rgba(LP.ink,0.8);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(ax0,y);ctx.lineTo(lerp(ax0,ax1,au),y);ctx.stroke();
      if(au>0.95){ctx.fillStyle=rgba(LP.ink,0.8);ctx.beginPath();ctx.moveTo(ax1+4,y);ctx.lineTo(ax1-12,y-10);ctx.lineTo(ax1-12,y+10);ctx.closePath();ctx.fill();}}
    const ua=ag_sine(clamp(u*2-0.6,0,1));if(it.pill)lp_pill(ctx,xx+w/2,y,it.text,{col:it.col||LP.green,a:ua});else lp_tag(ctx,xx,y,it.text,{col:it.col||LP.ink,a:ua});
    xx+=w+gap;});
  ctx.restore();}

/* ---------------------------------------------------------------- the runbook
   tf_runbook(ctx, x, y, o): the platform's runbook as a pinned sheet, its four steps numbered in two columns, so it stays low enough
   to sit above the people at their table and below the film's title. o.a, o.k (time since it came in, for the spring), o.u (0 to 1:
   the steps one by one), o.light. Returns its box. */
const TF_STEPS=["Read what the alert says","Check the load that failed","Run it again, or wait for it","Write down what you did"];
function tf_runbook(ctx,x,y,o){o=o||{};const w=1100,h=LP_PAD+30+44+2*50+LP_PAD-14,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0.004)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});lp_T(ctx,"RUNBOOK · STEP BY STEP",x+LP_PAD,y+LP_PAD+44,{w:800,size:28,ls:3,col:LP.blue});
  TF_STEPS.forEach((s,n)=>{const la=o.u==null?1:clamp(o.u*4-n,0,1);if(la<=0.004)return;const sx=x+LP_PAD+(n>>1)*(w/2),sy=y+LP_PAD+30+44+(n&1)*50+38;
    ctx.save();ctx.globalAlpha*=ag_sine(la);lp_T(ctx,String(n+1),sx+8,sy,{w:800,size:28,align:"center",col:LP.blue});lp_T(ctx,s,sx+34,sy,{w:600,size:28});ctx.restore();});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- words said aloud
   tf_say(ctx, x, y, text, to, o): lp_tag's outlined words with a small tail from its lower edge towards the speaker at x = to, so it's
   clear who says them when several people stand in a row. o.align, o.col, o.a. */
function tf_say(ctx,x,y,text,to,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const col=o.col||LP.ink,b=lp_tag(ctx,x,y,text,Object.assign({},o,{a}));
  const bx=clamp(to,b.x+34,b.x+b.w-34),by=b.y+b.h,tx=bx+clamp((to-bx)*0.5,-16,16);ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle="rgba(250,247,240,0.97)";ctx.beginPath();ctx.moveTo(bx-13,by-4);ctx.lineTo(tx,by+20);ctx.lineTo(bx+13,by-4);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(bx-12,by-1);ctx.lineTo(tx,by+20);ctx.lineTo(bx+12,by-1);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- a print of the stokvel's room, for the team's wall
   Painted once: the room in the yard where the stokvel meets, its members round the table and the pot on it, in a timber frame. */
function tf_printPic(){return ag_kept("tfPrint",960,540,(c)=>{c.save();c.scale(0.5,0.5);c.drawImage(ag_place("tfMeet"),0,0,W,H);
  const lt={light:"late",wall:0.12};for(const [i,px,fl] of [[0,330,false],[1,560,false],[2,790,true],[3,1020,true]])lp_person(c,TF_WOMEN[i],px,690,0.66,{t:0,flip:fl,cut:806,light:lt});
  lp_table(c,200,812,940);tf_pot(c,680,768,0.9,0.6,1);c.restore();});}
function tf_print(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*9/16;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.34)";ctx.shadowBlur=24;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=12;ctx.fillStyle=rgba(mix(LP.timber,LP.shade,0.2),1);ctx.fillRect(x-18,y-18,w+36,h+36);ctx.restore();
  ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(x-6,y-6,w+12,h+12);ctx.drawImage(tf_printPic(),x,y,w,h);
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,255,255,0.12)");g.addColorStop(0.5,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  if(o.light&&LP_LIGHT[o.light]&&LP_LIGHT[o.light].sun)lp_sun(ctx,LP_LIGHT[o.light].sun,{a:0.6,col:LP_LIGHT[o.light].col,clip:cc=>{cc.beginPath();cc.rect(x-18,y-18,w+36,h+36);cc.clip();}});
  ctx.restore();}
