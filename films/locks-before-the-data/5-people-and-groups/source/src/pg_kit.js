/* ===== People and groups: the film's own helpers =====
   What this film draws that the module's kit doesn't: a place and year tag, the chapter's kicker on the screen, the hotel's brass key
   on its fob, the punched card of the 1970s and the lock it opens, drawn on glass, and the university's own pieces (a person's card in
   the directory, an admin account's badge, the admin groups' slots, a phone with a passkey, a security key, a fake sign-in page, a
   terminal, an email). Every name here starts with pg_ or PG_. Words are the kit's (dp_T), at least 28 px as seen, and colours keep the
   module's meanings: cyan an identity, green allowed, coral denied or closed, amber admin power switched on; gold only the token's chip. */

// the warm light of the 1970s scenes, brass, the punched card's cream, and wood
const PG={warm:[255,206,140],lamp:[255,226,178],brass:[[250,222,150],[214,170,92],[146,104,44]],brassInk:[58,38,12],cream:[[246,238,214],[226,214,184]],
  wood:[[118,80,52],[78,52,34],[46,30,20]],hole:[22,30,32]};
// cue times, worked out once per chapter
function pg_once(sc,k,f){const m=sc.__pg||(sc.__pg={});return m[k]||(m[k]=f());}
// a place and its year, top left on the screen (not under the camera)
function pg_tag(ctx,S,text,a){if(!(a>0.01))return;ctx.save();setScreen(ctx,S);dp_slip(ctx,72,44,text,"cyan",{a,ink:true});ctx.restore();}
// the chapter's name top left, on the screen, while a shot begins
function pg_kick(ctx,S,top,a){if(!(a>0.01))return;ctx.save();setScreen(ctx,S);dp_kicker(ctx,top,null,{a});ctx.restore();}
// a soft shadow under a thing that lies on a table or the floor
function pg_shadow(ctx,x,y,rx,ry,a){if(!(a>0))return;ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);const g=ctx.createRadialGradient(0,0,0,0,0,1);
  g.addColorStop(0,"rgba(0,6,8,"+a+")");g.addColorStop(1,"rgba(0,6,8,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1,0,TAU);ctx.fill();ctx.restore();}
// a glow in light ("lighter") round a point
function pg_glow(ctx,x,y,r,col,a){if(!(a>0))return;ctx.save();ctx.globalCompositeOperation="lighter";const c=Array.isArray(col)?col:dp_f(col),g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,rgba(c,a));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();}

/* ---------------------------------------------------------------- the hotel's key, the punched card and the lock */
// a brass hotel key on a heavy brass fob with the room's number. x, y the fob's middle; s its size (the fob 176 wide at 1); o: rot,
// rim (a colour by meaning) and rimA (0 to 1, a glow round it in that colour), num ("312"), a
function pg_keyShape0(c){c.moveTo(-88,-40);c.lineTo(70,-40);c.bezierCurveTo(104,-40,112,-22,112,0);c.bezierCurveTo(112,22,104,40,70,40);c.lineTo(-88,40);
  c.bezierCurveTo(-104,40,-110,26,-110,0);c.bezierCurveTo(-110,-26,-104,-40,-88,-40);c.closePath();}
function pg_keyShape(c){c.moveTo(-88,-40);c.lineTo(70,-40);c.bezierCurveTo(104,-40,112,-22,112,0);c.bezierCurveTo(112,22,104,40,70,40);c.lineTo(-88,40);
  c.bezierCurveTo(-104,40,-110,26,-110,0);c.bezierCurveTo(-110,-26,-104,-40,-88,-40);c.closePath();
  c.moveTo(-136,-26);c.arc(-150,0,30,-1.1,1.1+TAU-2.2,true);c.closePath();c.rect(-300,-8,124,16);c.rect(-300,6,14,26);c.rect(-276,6,10,18);c.rect(-256,6,12,22);}
function pg_key(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const B=PG.brass;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.scale(s,s);
  if(o.shadow!==false)pg_shadow(ctx,-60,30,250,34,0.5);
  if(o.rimA>0){ctx.save();ctx.shadowColor=rgba(dp_f(o.rim||"coral"),0.95*o.rimA);ctx.shadowBlur=34;ctx.beginPath();if(o.fob)pg_keyShape0(ctx);else pg_keyShape(ctx);ctx.fillStyle=rgba(dp_f(o.rim||"coral"),0.5*o.rimA);ctx.fill();ctx.restore();}
  const met=(x0,x1)=>{const g=ctx.createLinearGradient(x0,-40,x1,40);g.addColorStop(0,rgba(B[0],1));g.addColorStop(0.45,rgba(B[1],1));g.addColorStop(1,rgba(B[2],1));return g;};
  // the key: its bow, a ring that passes through the fob's hole, and its shaft and bit (o.fob: only the fob and its ring, the key in a lock)
  ctx.save();ctx.lineCap="round";if(!o.fob){ctx.strokeStyle=met(-180,-120);ctx.lineWidth=10;ctx.beginPath();ctx.arc(-150,0,26,0,TAU);ctx.stroke();
  ctx.fillStyle=met(-300,-170);ctx.beginPath();rr(ctx,-300,-8,128,16,6);ctx.fill();ctx.fillRect(-300,6,14,26);ctx.fillRect(-276,6,10,18);ctx.fillRect(-256,6,12,22);
  ctx.strokeStyle="rgba(255,244,210,0.5)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-296,-5);ctx.lineTo(-176,-5);ctx.stroke();}
  ctx.strokeStyle=met(-130,-90);ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(-104,0,24,15,0,0,TAU);ctx.stroke();ctx.restore();
  // the fob: heavy brass, a hole at its end, the room's number stamped in it
  ctx.save();ctx.beginPath();ctx.moveTo(-84,-40);ctx.lineTo(70,-40);ctx.bezierCurveTo(104,-40,112,-22,112,0);ctx.bezierCurveTo(112,22,104,40,70,40);ctx.lineTo(-84,40);
  ctx.bezierCurveTo(-100,40,-106,26,-106,0);ctx.bezierCurveTo(-106,-26,-100,-40,-84,-40);ctx.closePath();ctx.fillStyle=met(-100,110);ctx.fill();
  ctx.strokeStyle="rgba(110,74,24,0.9)";ctx.lineWidth=2.4;ctx.stroke();ctx.clip();
  const hg=ctx.createLinearGradient(0,-40,0,0);hg.addColorStop(0,"rgba(255,250,224,0.55)");hg.addColorStop(1,"rgba(255,250,224,0)");ctx.fillStyle=hg;ctx.fillRect(-110,-40,224,40);ctx.restore();
  ctx.fillStyle="rgba(40,24,8,0.85)";ctx.beginPath();ctx.arc(-84,0,9,0,TAU);ctx.fill();
  if(o.num)dp_T(ctx,o.num,16,15,{w:800,size:o.numSize||44,col:PG.brassInk,align:"center",deco:o.deco});
  ctx.restore();}
// a punched plastic card: cream, its holes in a pattern of its own (seed); x, y its top left, w its width (it's 0.62 w tall); o: seed,
// rim and rimA (a glow in a meaning's colour), a, rot (about its middle), holes (the pattern, 32 bits, instead of seed)
function pg_bits(seed){const out=[];for(let i=0;i<32;i++)out.push(hash(i*7.31+seed*3.7,seed*1.9+0.37)>0.5?1:0);return out;}
function pg_punch(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*0.62,r=w*0.05,C=PG.cream,bits=o.holes||pg_bits(o.seed||1);
  ctx.save();ctx.globalAlpha*=a;if(o.rot){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot);ctx.translate(-x-w/2,-y-h/2);}
  if(o.shadow!==false)pg_shadow(ctx,x+w/2,y+h+w*0.02,w*0.56,w*0.07,0.45);
  if(o.rimA>0){ctx.save();ctx.shadowColor=rgba(dp_f(o.rim),0.95*o.rimA);ctx.shadowBlur=w*0.12;rr(ctx,x,y,w,h,r);ctx.fillStyle=rgba(dp_f(o.rim),0.6*o.rimA);ctx.fill();ctx.restore();}
  ctx.save();rr(ctx,x,y,w,h,r);const g=ctx.createLinearGradient(x,y,x+w*0.3,y+h);g.addColorStop(0,rgba(C[0],1));g.addColorStop(1,rgba(C[1],1));ctx.fillStyle=g;ctx.fill();ctx.clip();
  // a notch at the end that goes in first, and a line across it, as the cards had
  ctx.fillStyle="rgba(150,130,96,0.35)";ctx.fillRect(x+w*0.06,y,w*0.012,h);
  // the holes: 8 across, 4 down
  const hr=w*0.03;for(let i=0;i<32;i++){if(!bits[i])continue;const cx=x+w*(0.2+(i%8)*0.094),cy=y+h*(0.2+Math.floor(i/8)*0.2);
    ctx.fillStyle=rgba(PG.hole,1);ctx.beginPath();ctx.arc(cx,cy,hr,0,TAU);ctx.fill();ctx.strokeStyle="rgba(255,255,255,0.5)";ctx.lineWidth=Math.max(1,w*0.004);ctx.beginPath();ctx.arc(cx,cy,hr,0.3,2.6);ctx.stroke();}
  const hg=ctx.createLinearGradient(0,y,0,y+h*0.45);hg.addColorStop(0,"rgba(255,255,255,0.35)");hg.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=hg;ctx.fillRect(x,y,w,h*0.45);ctx.restore();
  rr(ctx,x+0.5,y+0.5,w-1,h-1,r);ctx.strokeStyle="rgba(120,104,76,0.8)";ctx.lineWidth=Math.max(1.2,w*0.005);ctx.stroke();ctx.restore();}
/* the lock's reader, drawn on glass (a frosted panel w wide, 0.56 w tall, its top left at x, y): the pattern card comes in from the
   right, from inside the room, and the guest's card from the left, from the corridor; where they meet, each hole of the guest's card
   that has a hole of the pattern under it lets the light through, green, and a hole that has none shows coral; when every hole
   matches, the lock opens. o: pattern (how far the pattern card is in, 0 to 1), pOut (the old pattern card going out, 0 to 1),
   guest (0 to 1), gOut (0 to 1), seed (the pattern's), gSeed (the guest's card's: the same seed matches), check (0 to 1, the lights and
   the lock's answer), labels, a, k (springs it in), behind, mini (no labels, for a small one) */
function pg_reader(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=Math.round(w*0.56),k=w/1000;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.9,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:24,behind:o.behind});
  // the frame where the cards meet: the lock, in the door
  const fx=x+w*0.5-180*k,fy=y+150*k,fw=360*k,fh=230*k;
  ctx.save();rr(ctx,fx,fy,fw,fh,18*k);ctx.fillStyle="rgba(4,14,18,0.55)";ctx.fill();ctx.strokeStyle=rgba(DP.ice,0.8);ctx.lineWidth=2.4;ctx.stroke();ctx.restore();
  // the door's line through the lock: the corridor to its left, the room to its right
  ctx.save();ctx.strokeStyle=rgba(DP.ice,0.35);ctx.lineWidth=2;ctx.setLineDash([10*k,10*k]);ctx.beginPath();ctx.moveTo(x+w*0.5,y+40*k);ctx.lineTo(x+w*0.5,y+h-36*k);ctx.stroke();ctx.restore();
  if(!o.mini){dp_T(ctx,"Corridor",x+40*k,y+70*k,{w:700,size:28,col:"mut"});dp_T(ctx,"Room",x+w-40*k,y+70*k,{w:700,size:28,col:"mut",align:"right"});}
  const cw=300*k,chh=cw*0.62,cy0=fy+(fh-chh)/2,seed=o.seed||5,gs=o.gSeed==null?seed:o.gSeed;
  // where each card is: the pattern card from the right edge into the frame, the guest's card from the left edge
  const pin=ag_sine(o.pattern||0),pout=ag_sine(o.pOut||0),gin=ag_sine(o.guest||0),gout=ag_sine(o.gOut||0);
  const px=lerp(x+w+40*k,fx+30*k,pin)+(x+w+60*k-fx)*pout,gx=lerp(x-cw-40*k,fx+30*k,gin)-(fx+30*k-x+cw+60*k)*gout;
  ctx.save();rr(ctx,x+2,y+2,w-4,h-4,22);ctx.clip();
  if(pin>0&&pout<1){const pb=pg_bits(seed);
    // the pattern card: a paler card, its holes the same, drawn behind
    pg_punch(ctx,px,cy0,cw,{holes:pb,shadow:false,a:0.92});}
  if(gin>0&&gout<1)pg_punch(ctx,gx,cy0-6*k,cw,{holes:pg_bits(gs),shadow:false,rim:o.old?"coral":null,rimA:o.old?0.85:0});
  // the lights where the holes meet, once both cards are in
  const ck=clamp(o.check||0,0,1);if(ck>0&&pin>0.99&&gin>0.99&&pout<=0&&gout<=0){const gb=pg_bits(gs),pb=pg_bits(seed);
    for(let i=0;i<32;i++){if(!gb[i])continue;const cx=fx+30*k+cw*(0.2+(i%8)*0.094),cyy=cy0-6*k+cw*0.62*(0.2+Math.floor(i/8)*0.2),ok=!!pb[i],q=clamp(ck*3-hash(i,3)*1.2,0,1);
      if(q<=0)continue;const c=dp_f(ok?"green":"coral");ctx.save();ctx.globalAlpha*=q;ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=12;ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(cx,cyy,cw*0.022,0,TAU);ctx.fill();ctx.restore();}}
  ctx.restore();
  if(!o.mini){const lab=(s,sub,lx,ly,al,aa)=>{if(aa<=0)return;dp_T(ctx,s,lx,ly,{w:700,size:30,align:al,a:aa});dp_T(ctx,sub,lx,ly+38,{w:600,size:28,col:"mut",align:al,a:aa});};
    const lb=o.labels==null?1:o.labels,lg=Array.isArray(lb)?lb[0]:lb,lp=Array.isArray(lb)?lb[1]:lb;
    lab("Guest's card","from the corridor",x+40*k,y+h-92*k,"left",lg);
    lab("Pattern card","from inside the room",x+w-40*k,y+h-92*k,"right",lp);}
  // the lock's answer, under the frame
  const v=clamp(o.verdict||0,0,1);if(v>0){const ok=o.old?false:true,lx=x+w*0.5,ly=fy+fh+20*k;
    dp_lock(ctx,lx-(o.mini?0:70*k),ly+46*k,44*k,ok?"green":"coral",ok?ag_sine(v):0);
    if(!o.mini)dp_T(ctx,ok?"Opens":"Opens nothing",lx-30*k,ly+62*k,{w:700,size:30,col:ok?"green":"coral",a:v});}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the university's pieces */
// a person's card in the directory: a small frosted card with their name, and a line under it; returns its box. o: col, a, sub, k, dim
function pg_who(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,w=Math.max(dp_tw(ctx,name,{w:700,size:30}),o.sub?dp_tw(ctx,o.sub,{w:600,size:28}):0)+108,h=o.sub?118:80;
  if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  const col=o.col||"cyan";dp_panel(ctx,x,y,w,h,{col,r:16,glowR:28,behind:o.behind});
  ctx.save();ctx.translate(x+44,y+(o.sub?52:40));ctx.scale(0.46,0.46);dp_personPic(ctx,0,10,o.dim?"grey":col);ctx.restore();
  dp_T(ctx,name,x+86,y+(o.sub?50:51),{w:700,size:30,col:o.dim?"grey":"ink"});if(o.sub)dp_T(ctx,o.sub,x+86,y+92,{w:600,size:28,col:o.subCol||"mut"});
  ctx.restore();return{x,y,w,h};}
// an admin account's badge: a band that says so, the account's name, and the security key it signs in with; 460 x 150.
// o: on (0 to 1, switched on: its band and rim turn amber), a, touch (0 to 1: its security key touched, as it signs in)
function pg_admin(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const on=clamp(o.on||0,0,1),w=460,h=150;ctx.save();ctx.globalAlpha*=a;
  const col=on>0.5?"amber":"grey";dp_panel(ctx,x,y,w,h,{col:on>0?mix(DP.F.grey,DP.F.amber,on):DP.F.grey,r:18,glowA:0.4+0.8*on,behind:o.behind});
  ctx.save();rr(ctx,x,y,w,h,18);ctx.clip();const bc=mix(DP.F.grey,DP.F.amber,on);ctx.fillStyle=rgba(bc,1);ctx.fillRect(x,y,w,46);ctx.restore();
  dp_T(ctx,"ADMIN ACCOUNT",x+24,y+33,{w:800,size:28,ls:3,col:DP.on});
  dp_T(ctx,name,x+24,y+102,{w:700,size:32});pg_seckey(ctx,x+w-62,y+98,0.62,{touch:o.touch});
  ctx.restore();return{x,y,w,h};}
// an admin group: a slot of glass with an amber edge, its name as the directory writes it, and how many are in it; when someone is
// switched on (on, 0 to 1) it fills with solid amber and dark words. 640 x 70 by default; returns its box
function pg_slot(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||640,h=70;if(a<=0.004)return{x,y,w,h};const on=clamp(o.on||0,0,1),A=DP.F.amber;
  ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor=rgba(A,0.25+0.55*on);ctx.shadowBlur=18+26*on;rr(ctx,x,y,w,h,35);ctx.fillStyle="rgba(6,20,26,0.75)";ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,35);ctx.clip();dp_behind(ctx,o.behind);ctx.fillStyle="rgba(6,20,26,0.35)";ctx.fillRect(x,y,w,h);
  if(on>0){ctx.globalAlpha*=on;const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(mix(A,[255,255,255],0.14),1));g.addColorStop(1,rgba(A,1));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);}
  ctx.restore();rr(ctx,x+1,y+1,w-2,h-2,34);ctx.strokeStyle=rgba(mix(A,[255,255,255],0.3),0.95);ctx.lineWidth=2.4;ctx.stroke();
  const ink=on>0.5?DP.on:DP.T.ink;dp_T(ctx,name,x+30,y+45,{w:500,size:28,f:"mono",col:ink});
  if(o.count)dp_T(ctx,o.count,x+w-30,y+45,{w:700,size:28,col:on>0.5?DP.on:"mut",align:"right"});
  ctx.restore();return{x,y,w,h};}
// a security key on its ring: a small black key with a gold contact and a touch disc; x, y its middle; s its size (about 120 long at 1)
function pg_seckey(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.scale(s,s);
  ctx.strokeStyle="rgba(200,226,228,0.9)";ctx.lineWidth=4;ctx.beginPath();ctx.arc(-58,0,16,0,TAU);ctx.stroke();
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=8;rr(ctx,-44,-20,92,40,12);const g=ctx.createLinearGradient(0,-20,0,20);g.addColorStop(0,"rgb(58,66,70)");g.addColorStop(1,"rgb(22,26,28)");ctx.fillStyle=g;ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(170,200,204,0.6)";ctx.lineWidth=1.4;rr(ctx,-44,-20,92,40,12);ctx.stroke();
  ctx.fillStyle="rgba(10,14,16,1)";ctx.beginPath();ctx.arc(-38,0,7,0,TAU);ctx.fill();
  const tg=ctx.createRadialGradient(6,0,2,6,0,15);tg.addColorStop(0,o.touch?rgba(mix(DP.F.cyan,[255,255,255],0.4),1):"rgb(120,132,136)");tg.addColorStop(1,o.touch?rgba(DP.F.cyan,0.8):"rgb(70,80,84)");
  ctx.fillStyle=tg;ctx.beginPath();ctx.arc(6,0,13,0,TAU);ctx.fill();
  ctx.fillStyle="rgb(210,170,80)";ctx.fillRect(48,-11,20,22);ctx.fillStyle="rgba(120,90,30,0.9)";for(let i=0;i<4;i++)ctx.fillRect(50,-9+i*5.4,16,2);
  if(o.touch)pg_glow(ctx,6,0,40,"cyan",0.5*o.touch);
  ctx.restore();}
// a phone held up: its screen shows a sign-in with a passkey. x, y its top left (220 x 440 at s 1); o: face (0 to 1, the face check),
// tick (0 to 1), title, a, behind
function pg_phone(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=220,h=440;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=24;rr(ctx,0,0,w,h,32);ctx.fillStyle="rgb(14,18,20)";ctx.fill();ctx.restore();
  rr(ctx,8,8,w-16,h-16,26);const sg=ctx.createLinearGradient(0,8,0,h-8);sg.addColorStop(0,"rgb(16,44,52)");sg.addColorStop(1,"rgb(8,24,30)");ctx.fillStyle=sg;ctx.fill();
  rr(ctx,0.8,0.8,w-1.6,h-1.6,31);ctx.strokeStyle="rgba(170,220,224,0.55)";ctx.lineWidth=1.6;ctx.stroke();
  // the face check: a frame that draws round, then a tick
  const fc=clamp(o.face||0,0,1),tk=clamp(o.tick||0,0,1),cx=w/2,cy=170;
  ctx.save();ctx.strokeStyle=rgba(DP.F.cyan,0.95);ctx.lineWidth=4;ctx.lineCap="round";for(let i=0;i<4;i++){const ang=i*Math.PI/2;ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);
    ctx.beginPath();ctx.moveTo(-44,-26);ctx.lineTo(-44,-44);ctx.lineTo(-26,-44);ctx.stroke();ctx.restore();}
  if(fc>0){ctx.beginPath();ctx.arc(cx,cy,30,-Math.PI/2,-Math.PI/2+TAU*ag_sine(fc));ctx.stroke();}ctx.restore();
  if(tk>0)dp_tick(ctx,cx,cy,"green",tk);
  ctx.restore();}
// a sign-in page made to look like the real one, in coral: what someone types into it goes to whoever made it. x, y its top left;
// 520 x 400; o: fill (0 to 1, a password and a text code typed into it), caught (0 to 1), a, empty (a page that gets nothing)
function pg_fake(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=520,h=400;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:"coral",r:20,behind:o.behind});
  dp_T(ctx,"Sign in",x+36,y+70,{w:700,size:36});dp_T(ctx,"A fake page",x+w-36,y+70,{w:700,size:28,col:"coral",align:"right"});
  const f=clamp(o.fill||0,0,1),field=(fy,label,n,u)=>{dp_T(ctx,label,x+36,fy,{w:600,size:28,col:"mut"});rr(ctx,x+36,fy+16,w-72,62,12);ctx.fillStyle="rgba(4,14,18,0.6)";ctx.fill();
    ctx.strokeStyle=rgba(DP.F.coral,0.6);ctx.lineWidth=1.6;ctx.stroke();const m=Math.floor(n*clamp(u,0,1));for(let i=0;i<m;i++){ctx.fillStyle=rgba(DP.T.ink,0.9);ctx.beginPath();ctx.arc(x+70+i*30,fy+47,8,0,TAU);ctx.fill();}};
  field(y+140,"Password",10,o.empty?0:f*2);field(y+270,"Code by text",6,o.empty?0:f*2-1);
  if(o.empty&&o.nothing>0)dp_T(ctx,"Nothing to catch",x+w/2,y+h-18,{w:700,size:28,col:"coral",align:"center",a:o.nothing});
  ctx.restore();return{x,y,w,h};}
// a terminal window: lines of monospaced words, each typed on from its time (p 0 to 1 each). x, y its top left; o: lines [[text, p,
// col]], title, a, behind
function pg_term(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=30;rr(ctx,x,y,w,h,16);ctx.fillStyle="rgb(6,14,16)";ctx.fill();ctx.restore();
  rr(ctx,x+0.8,y+0.8,w-1.6,h-1.6,15);ctx.strokeStyle=rgba(DP.F.cyan,0.6);ctx.lineWidth=1.8;ctx.stroke();
  ctx.fillStyle="rgba(20,40,44,1)";ctx.save();rr(ctx,x,y,w,58,16);ctx.clip();ctx.fillRect(x,y,w,58);ctx.restore();
  for(let i=0;i<3;i++){ctx.fillStyle=["rgb(96,112,116)","rgb(96,112,116)","rgb(96,112,116)"][i];ctx.beginPath();ctx.arc(x+30+i*26,y+29,8,0,TAU);ctx.fill();}
  if(o.title)dp_T(ctx,o.title,x+w/2,y+40,{w:600,size:28,col:"mut",align:"center"});
  (o.lines||[]).forEach((l,i)=>{const p=clamp(l[1]==null?1:l[1],0,1);if(p<=0)return;const s=l[0],n=Math.round(s.length*p);
    dp_T(ctx,s.slice(0,n),x+30,y+112+i*48,{w:500,size:28,f:"mono",col:l[2]||"ink"});});
  ctx.restore();}
// an email card: who it's from, its subject, and its lines, each lit on its time (on[i], 0 to 1). x, y its top left; returns its box
function pg_email(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,L=o.lines||[],h=150+L.length*46+18;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,behind:o.behind});
  // an envelope's flap, drawn in light
  ctx.save();ctx.strokeStyle=rgba(DP.F.cyan,0.9);ctx.lineWidth=2.4;ctx.lineJoin="round";rr(ctx,x+30,y+30,64,46,6);ctx.stroke();ctx.beginPath();ctx.moveTo(x+32,y+34);ctx.lineTo(x+62,y+58);ctx.lineTo(x+92,y+34);ctx.stroke();ctx.restore();
  dp_T(ctx,o.from||"",x+116,y+64,{w:600,size:28,col:"mut"});
  dp_T(ctx,o.subject||"",x+30,y+124,{w:700,size:30});
  L.forEach((l,i)=>{const on=o.on?clamp(o.on[i]||0,0,1):1;dp_T(ctx,l,x+30,y+178+i*46,{w:600,size:28,col:on>0.5?"ink":"mut",a:0.45+0.55*on});});
  ctx.restore();return{x,y,w,h};}
// an envelope, small, in light: the sign of an account someone reads their email with
function pg_envelope(ctx,x,y,s,col){const c=dp_f(col||"cyan");ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=8;
  ctx.lineWidth=3;ctx.lineJoin="round";rr(ctx,-24,-17,48,34,5);ctx.stroke();ctx.beginPath();ctx.moveTo(-22,-14);ctx.lineTo(0,4);ctx.lineTo(22,-14);ctx.stroke();ctx.restore();}
// the dotted line of an eligible account to its group: eligible, not in it
function pg_dots(ctx,a,b,col,p,al){p=clamp(p==null?1:p,0,1);if(p<=0)return;const c=dp_f(col||"amber");ctx.save();ctx.globalAlpha*=al==null?1:al;ctx.strokeStyle=rgba(c,0.9);ctx.lineWidth=3;
  ctx.setLineDash([3,12]);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(lerp(a[0],b[0],p),lerp(a[1],b[1],p));ctx.stroke();ctx.restore();}
// a stamp of solid colour, a little turned, that comes down on a row: "Ended"
function pg_stamp(ctx,x,y,text,col,u){u=clamp(u||0,0,1);if(u<=0)return;const k=lerp(1.6,1,ag_eo(u));ctx.save();ctx.globalAlpha*=clamp(u*2,0,1);ctx.translate(x,y);ctx.rotate(-0.08);ctx.scale(k,k);
  dp_pill(ctx,0,10,text,col,{align:"center",size:30});ctx.restore();}
