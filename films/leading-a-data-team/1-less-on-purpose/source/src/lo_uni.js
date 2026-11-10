/* ===== Less, on purpose: the university, 2027 =====
   The film's own pictures for the data team's May and June (prefix lo_). The module's kit draws the rooms, the people, the sheets and
   the things in them, and is never changed for this film; what is here is this film's alone:
     loMorning, loLate            the team's room (the module's lpRoom) on a morning and in late light: one room, so the camera glides
     lo_pile(ctx, t, o)           what piles up on a team's wall: reports, meetings and alerts, each added for a reason (o.u), most of
                                  them leaving (o.thin), the few that stay in a row with a green band (o.keep)
     lo_four(ctx, o)              the series' four ideas, a sheet each; o.first (0 to 1: the others step back, the first says what it is)
     lo_reports(ctx, t, x, y, o)  the old warehouse's 38 reports, a card each, 8 to a row: o.u (they come in), o.cold (the 17 nobody
                                  opened, marked amber), o.used (the 21 people read, outlined green), o.mail (a note flies from each of the
                                  17 to its last readers), o.off (the 17 switched off), o.only ("cold": only the 17), o.s (their size)
     lo_week(ctx, x, y, w, h, kind, o)  a week of standing meetings, Monday to Friday, 9 to 5: "before" (about 8 hours, amber) or
                                  "designed" (about 3 hours, blue); o.u (its meetings come in), o.strike (0 to 1: the ones that stop)
     lo_alerts(ctx, t, x, y, o)   about 60 alerts in a week, a slip each: o.u (they come in), o.sort (into their eight kinds), o.sum (the
                                  kinds that need nothing go into the Monday summary), o.act (the 12 left, each with its note)
     lo_ideas(ctx, x, y, o)       ten ideas for a better university, nine that add something and one that takes something away (o.u, o.ring)
     lo_board(ctx, x, y, o)       the team's board: to do, doing, done
     lo_back(ctx, x, y, o)        eight people's five hours back, which add up to one person's week (o.u, o.sum)
     lo_platform(ctx, t, o)       the 21 reports people read, rebuilt on the platform, each with an owner (o.u, o.own)
     lo_art(ctx, o)               three plain works on the wall, as American artists made them in the 1960s, in greys
     LO_TEAM                      Helena with Noor, Sam, Jun and Ivy, where the five stand together
   Colour keeps the module's meaning: orange the data (the reports, the warehouse's logs), amber a cost or something waiting (the hours in
   meetings, the alerts that need nothing, the 17 nobody opened, a report switched off), blue design and plans (the week the team designs,
   what each thing is for, the plan, the rule), green value or done (the 21 people read, the time back, a copy sent). People are never a
   colour. */

// how far the i-th of n things has come in, as x goes from 0 to 1: each starts k of its own time after the one before (k under 1: they
// overlap), and at x = 1 every one is fully in, the last one too
function lo_st(x,i,n,k){return clamp(x*((n-1)*k+1)-i*k,0,1);}

/* ---------------------------------------------------------------- the places: the team's room, in two more lights */
AG_PLACES.loMorning=c=>lp_paintRoom(c,{light:"morning"});
AG_PLACES.loLate=c=>lp_paintRoom(c,{light:"late"});
AG_ROOMS.loMorning="lpRoom";AG_ROOMS.loLate="lpRoom";

/* ---------------------------------------------------------------- what piles up */
// 36 small sheets: a report (orange band, a little chart), a meeting (amber band, a calendar's rows) or an alert (amber band, a bell's
// lines), each in its place on the wall; o.u (0 to 1: they come in one after another), o.thin (0 to 1: all but six leave), o.keep (0 to
// 1: the six left slide into a row in the middle and take a green band), o.a
const LO_PILE=(()=>{const R=ag_rnd(77),out=[];for(let i=0;i<36;i++)out.push({x:200+R()*1440,y:160+R()*520,k:i%3,tl:(R()-0.5)*0.16,s:R()});return out;})();
const LO_KEEP=[4,11,15,22,27,33];
function lo_glyph(ctx,x,y,w,h,k){ctx.fillStyle=rgba(mix(LP.mut,LP.paper,0.45),1);
  if(k===0){for(let j=0;j<4;j++){const bh=h*(0.22+0.13*((j*5)%4));ctx.fillStyle=rgba(mix(LP.orange,LP.paper,0.35),1);ctx.fillRect(x+w*0.14+j*w*0.19,y+h*0.86-bh,w*0.12,bh);}}
  else if(k===1){for(let j=0;j<3;j++){ctx.fillRect(x+w*0.12,y+h*(0.3+j*0.2),w*0.76,h*0.08);}ctx.fillStyle=rgba(mix(LP.amber,LP.paper,0.45),1);ctx.fillRect(x+w*0.3,y+h*0.46,w*0.32,h*0.12);}
  else{ctx.beginPath();ctx.arc(x+w*0.5,y+h*0.58,h*0.2,Math.PI,0);ctx.lineTo(x+w*0.5+h*0.2,y+h*0.7);ctx.lineTo(x+w*0.5-h*0.2,y+h*0.7);ctx.closePath();ctx.fill();ctx.fillRect(x+w*0.47,y+h*0.72,w*0.06,h*0.06);}}
function lo_pile(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,th=o.thin||0,kp=o.keep||0;ctx.save();ctx.globalAlpha*=a;
  LO_PILE.forEach((p,i)=>{const v=lo_st(u,i,LO_PILE.length,0.5);if(v<=0)return;const kept=LO_KEEP.indexOf(i);let al=ag_sine(v),x=p.x,y=p.y,tl=p.tl,col=p.k===0?LP.orange:LP.amber,w=150,h=104;
    if(kept<0)al*=1-ag_in(th,(i%9)/9*0.5,0.5);
    else{const e=ag_sine(kp);x=lerp(p.x,960-3*190+kept*190+20,e);y=lerp(p.y,380,e);tl=lerp(p.tl,0,e);if(kp>0.5)col=LP.green;}
    if(al<=0.004)return;const f=lerp(0.6,1,ag_spr(v,0,0.45));ctx.save();ctx.translate(x+w/2,y+h/2);ctx.scale(f,f);ctx.rotate(tl);
    lo_card(ctx,-w/2,-h/2,w,h,{a:al,col});ctx.globalAlpha*=al;lo_glyph(ctx,-w/2,-h/2+8,w,h-8,p.k);ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the series' four ideas */
const LO_FOUR=["Minimalism","Kaizen","Ubuntu","Decentralisation and emergence"];
function lo_four(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const fs=o.first||0;ctx.save();ctx.globalAlpha*=a;
  LO_FOUR.forEach((name,i)=>{const v=clamp((o.u==null?1:o.u)*4-i,0,1);if(v<=0)return;const x=150+i*415,y=250,w=380,h=300;ctx.save();ctx.globalAlpha*=ag_sine(v)*(i?1-0.62*fs:1);
    ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(v,0,0.5)));lp_sheet(ctx,x,y,w,h,{light:"day"});
    lp_T(ctx,String(i+1),x+36,y+100,{w:800,size:56,col:LP.mut});let yy=y+168;for(const l of lp_wrap(ctx,name,w-72,{w:800,size:36})){lp_T(ctx,l,x+36,yy,{w:800,size:36});yy+=46;}ctx.restore();});
  if(fs>0.004)lp_T(ctx,"Keep only what does a job",150+36,250+300+64,{w:700,size:32,a:ag_sine(fs)});
  ctx.restore();}

/* ---------------------------------------------------------------- the old warehouse's 38 reports */
// 17 of them not opened in twelve months, by the warehouse's own logs (the module's numbers); the other 21 read by about 260 people
const LO_COLD=[1,3,4,8,10,13,15,18,20,23,25,27,30,31,33,35,37];
const lo_isCold=i=>LO_COLD.indexOf(i)>=0;
function lo_switch(ctx,x,y,s,on,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=rgba(on?LP.green:col||LP.amber,1);rr(ctx,-22,-12,44,24,12);ctx.fill();
  ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(on?10:-10,0,8,0,TAU);ctx.fill();ctx.restore();}
function lo_reports(ctx,t,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const s=o.s||1,cw=80*s,ch=58*s,g=14*s,u=o.u==null?1:o.u,cold=o.cold||0,used=o.used||0,off=o.off||0,mail=o.mail||0;
  ctx.save();ctx.globalAlpha*=a;let n=0;
  for(let i=0;i<38;i++){const c=lo_isCold(i);if(o.only==="cold"&&!c)continue;const k=o.only==="cold"?n++:i,cx=x+(k%(o.cols||8))*(cw+g),cy=y+Math.floor(k/(o.cols||8))*(ch+g);
    const v=lo_st(u,k,38,0.35);if(v<=0)continue;const f=lerp(0.7,1,ag_spr(v,0,0.45));let al=ag_sine(v);if(c)al*=1-0.6*off;
    ctx.save();ctx.translate(cx+cw/2,cy+ch/2);ctx.scale(f,f);lo_card(ctx,-cw/2,-ch/2,cw,ch,{a:al,col:LP.orange});ctx.globalAlpha*=al;lo_glyph(ctx,-cw/2,-ch/2+5*s,cw,ch-5*s,0);ctx.restore();
    if(c&&cold>0.004){ctx.save();ctx.globalAlpha*=ag_sine(lo_st(cold,LO_COLD.indexOf(i),17,0.4))*(1-off);ctx.fillStyle=rgba(LP.amber,1);ctx.beginPath();ctx.arc(cx+cw-9*s,cy+15*s,8*s,0,TAU);ctx.fill();ctx.restore();}
    if(!c&&used>0.004){ctx.save();ctx.globalAlpha*=ag_sine(clamp(used*1.6-((i*7)%38)/38*0.6,0,1));ctx.strokeStyle=rgba(LP.green,1);ctx.lineWidth=4*s;ctx.strokeRect(cx-5*s,cy-5*s,cw+10*s,ch+10*s);ctx.restore();}
    if(c&&off>0.004){ctx.save();ctx.globalAlpha*=ag_sine(lo_st(off,LO_COLD.indexOf(i),17,0.3));lo_switch(ctx,cx+cw/2,cy+ch/2,s*0.9,false);ctx.restore();}
    // a note to the report's last readers, flying out to the right
    if(c&&mail>0.004){const m=lo_st(mail,LO_COLD.indexOf(i),17,0.25);if(m>0&&m<1){const e=ag_sine(m),mx=lerp(cx+cw/2,o.mailTo||1500,e),my=lerp(cy+ch/2,(o.mailY||420)+(LO_COLD.indexOf(i)%5-2)*30,e)-Math.sin(Math.PI*e)*80;
      ctx.save();ctx.globalAlpha*=1-ag_in(m,0.8,0.2);ctx.translate(mx,my);ctx.rotate(-0.1+e*0.2);ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(-26,-17,52,34);ctx.strokeStyle=rgba(LP.mut,0.8);ctx.lineWidth=2;ctx.strokeRect(-26,-17,52,34);
        ctx.beginPath();ctx.moveTo(-26,-17);ctx.lineTo(0,3);ctx.lineTo(26,-17);ctx.stroke();ctx.restore();}}}
  ctx.restore();}
// the grid's size, for laying out what goes beside it
const lo_repW=(s,cols)=>(cols||8)*(80+14)*(s||1)-14*(s||1);

/* ---------------------------------------------------------------- a week of standing meetings */
// before: each person's recurring meetings, about 8 hours a week. Designed (from Monday 10 May): a 15-minute stand-up each morning,
// planning on Monday (45 minutes), a half-hour one-to-one, and a review with the people who asked every second Thursday (1 hour, so half
// an hour a week): about 3 hours. [day 0 to 4, start hour, hours, stops (only for "before": stopped from 10 May)]
const LO_BEFORE=[[0,9,1,1],[0,14,1,1],[1,10,1,1],[1,15,0.5,1],[2,9.5,1,1],[2,13,1,1],[3,11,1,1],[3,15,1,1],[4,10,0.5,1]];
const LO_DESIGNED=[[0,9.25,0.25],[1,9.25,0.25],[2,9.25,0.25],[3,9.25,0.25],[4,9.25,0.25],[0,9.5,0.75],[1,14,0.5],[3,14,1,0,"alt"]];
const LO_DAYS=["M","T","W","T","F"];
function lo_week(ctx,x,y,w,h,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const before=kind==="before",B=before?LO_BEFORE:LO_DESIGNED,col=before?LP.amber:LP.blue;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col,light:o.light==null?"day":o.light,pin:false});
  if(o.title)lp_T(ctx,o.title,x+30,y+62,{w:800,size:32});
  const top=y+(o.title?128:84),bot=y+h-30,gx=x+26,gw=w-52,cw=gw/5,ph=(bot-top)/8;
  LO_DAYS.forEach((d,i)=>lp_T(ctx,d,gx+cw*i+cw/2,top-14,{w:800,size:28,align:"center",col:LP.mut}));
  ctx.strokeStyle=rgba(LP.mut,0.18);ctx.lineWidth=1.5;for(let k=0;k<=8;k++){ctx.beginPath();ctx.moveTo(gx,top+k*ph);ctx.lineTo(gx+gw,top+k*ph);ctx.stroke();}
  B.forEach((b,j)=>{const v=lo_st(o.u==null?1:o.u,j,B.length,0.5);if(v<=0)return;const bx=gx+cw*b[0]+5,by=top+(b[1]-9)*ph+1,bh=Math.max(5,b[2]*ph-2);
    ctx.save();ctx.globalAlpha*=ag_sine(v);const st=before&&b[3]?clamp(o.strike||0,0,1):0;ctx.globalAlpha*=1-0.75*st;
    if(b[4]==="alt"){ctx.fillStyle=rgba(col,0.35);ctx.fillRect(bx,by,cw-10,bh);ctx.setLineDash([8,6]);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.strokeRect(bx+1.5,by+1.5,cw-13,bh-3);ctx.setLineDash([]);}
    else{ctx.fillStyle=rgba(col,0.88);ctx.fillRect(bx,by,cw-10,bh);}
    if(st>0){ctx.strokeStyle=rgba(LP.ink,0.9*st);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bx-4,by+bh/2);ctx.lineTo(bx-4+(cw+2)*ag_sine(st),by+bh/2);ctx.stroke();}
    ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- about 60 alerts in a week */
// eight kinds: the five that come most often need nothing (14, 11, 9, 8 and 6 a week, 48 in all); the other three need someone to act
// (5, 4 and 3: the 12 a week left by 7 June). Each slip has the kind's mark at its left
const LO_KINDS=[14,11,9,8,6,5,4,3],LO_ACT=k=>k>=5;
const LO_SLIPS=(()=>{const out=[];LO_KINDS.forEach((n,k)=>{for(let j=0;j<n;j++)out.push({k,j});});const R=ag_rnd(606);for(let i=out.length-1;i>0;i--){const j=(R()*(i+1))|0;const q=out[i];out[i]=out[j];out[j]=q;}return out;})();
function lo_slip(ctx,x,y,w,h,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;lo_card(ctx,x,y,w,h,{a});ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(LP.amber,1);ctx.fillRect(x,y,Math.max(5,w*0.1),h);
  // the kind's mark: one to three short bars, so the kinds can be told apart without words
  ctx.fillStyle=rgba(mix(LP.mut,LP.paper,0.35),1);for(let b=0;b<1+(k%3);b++)ctx.fillRect(x+w*0.2,y+h*(0.25+b*0.22),w*(0.3+0.1*((k*3+b)%4)),Math.max(2,h*0.12));
  if(o.note>0.004){ctx.globalAlpha*=o.note;ctx.fillStyle=rgba(LP.blue,1);ctx.fillRect(x+w*0.2,y+h*0.78,w*0.62,Math.max(3,h*0.1));}
  ctx.restore();}
// laid out from (x, y): first a grid of 6 by 10 slips, 47 by 27; sorted, a column for each kind, 60 wide; the 12 left, a grid of 4 by 3,
// larger, each with its note in blue. The Monday summary sheet is drawn by the scene
function lo_alerts(ctx,t,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,so=o.sort||0,sm=o.sum||0,ac=o.act||0;ctx.save();ctx.globalAlpha*=a;
  const sumX=o.sumX==null?x+40:o.sumX,sumY=o.sumY==null?y+420:o.sumY;let actN=0;
  LO_SLIPS.forEach((s,i)=>{const v=lo_st(u,i,60,0.3);if(v<=0)return;let al=ag_sine(v);
    const gx=x+(i%6)*55,gy=y+Math.floor(i/6)*35,kx=x+s.k*64,ky=y+s.j*25;let px=lerp(gx,kx,ag_sine(so)),py=lerp(gy,ky,ag_sine(so)),w=47,h=27,note=0;
    if(!LO_ACT(s.k)&&sm>0){const e=ag_sine(clamp(sm*1.6-(s.k*0.1+s.j*0.03),0,1));px=lerp(px,sumX+s.k*14,e);py=lerp(py,sumY+20,e);al*=1-ag_in(e,0.75,0.25);}
    if(LO_ACT(s.k)){const q=actN++;if(ac>0){const e=ag_sine(clamp(ac*1.4-q*0.03,0,1)),ax=(o.actX==null?x:o.actX)+(q%4)*150,ay=(o.actY==null?y:o.actY)+Math.floor(q/4)*104;
      px=lerp(px,ax,e);py=lerp(py,ay,e);w=lerp(47,128,e);h=lerp(27,80,e);note=ag_in(ac,0.7,0.3);}}
    if(al>0.004)lo_slip(ctx,px,py,w,h,s.k,{a:al,note});});
  ctx.restore();}

/* ---------------------------------------------------------------- ten ideas for a better university */
// nine add something (+), one takes something away (−): about one in ten (Adams and colleagues, Nature, 2021). o.u, o.ring, o.a
function lo_ideas(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<10;i++){const v=lo_st(o.u==null?1:o.u,i,10,0.5);if(v<=0)continue;const cx=x+i*92,f=lerp(0.7,1,ag_spr(v,0,0.45));ctx.save();ctx.translate(cx+38,y+38);ctx.scale(f,f);
    lo_card(ctx,-38,-38,76,76,{a:ag_sine(v)});ctx.globalAlpha*=ag_sine(v);ctx.strokeStyle=rgba(LP.ink,1);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(14,0);if(i!==6){ctx.moveTo(0,-14);ctx.lineTo(0,14);}ctx.stroke();ctx.restore();}
  if((o.ring||0)>0.004){ctx.save();ctx.globalAlpha*=o.ring;ctx.strokeStyle=rgba(LP.ink,1);ctx.lineWidth=4;ctx.beginPath();ctx.arc(x+6*92+38,y+38,56,0,TAU);ctx.stroke();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the team's board */
function lo_board(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=o.w||560,h=o.h||380;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light==null?"day":o.light});lp_T(ctx,"THE TEAM'S BOARD",x+30,y+70,{w:800,size:28,ls:3,col:LP.mut});
  const cols=["To do","Doing","Done"],cw=(w-60)/3;cols.forEach((c,i)=>{const cx=x+30+i*cw;lp_T(ctx,c,cx+8,y+120,{w:800,size:28});
    for(let j=0;j<(i===1?2:3);j++){ctx.fillStyle=rgba(i===2?mix(LP.green,LP.paper,0.55):mix(LP.mut,LP.paper,0.72),1);ctx.fillRect(cx+8,y+146+j*62,cw-26,48);}});
  ctx.restore();}

/* ---------------------------------------------------------------- the time back */
// eight bars of five hours, one for each person, that slide together into one bar of forty: about one person's working week.
// o.u (the eight come in), o.sum (they line up end to end, from o.sx), o.bw (a bar's width), o.a
function lo_back(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,sm=ag_sine(o.sum||0),bw=o.bw||140,gap=o.gap||28,bh=46,w0=8*bw+7*gap,w1=8*bw;ctx.save();ctx.globalAlpha*=a;
  // eight bars in a row, one for each person; summed, the gaps close into one bar: one person's whole week
  for(let i=0;i<8;i++){const v=lo_st(u,i,8,0.5);if(v<=0)continue;const px=lerp(x-w0/2+i*(bw+gap),x-w1/2+i*bw,sm),f=lerp(0.7,1,ag_spr(v,0,0.45)),bwi=lerp(bw-4,bw,sm);
    ctx.save();ctx.globalAlpha*=ag_sine(v);ctx.translate(px+bw/2,y+bh/2);ctx.scale(f,f);ctx.fillStyle=rgba(LP.green,1);rr(ctx,-bwi/2,-bh/2,bwi,bh,lerp(8,1,sm));ctx.fill();
    if(i>0&&sm>0.02){ctx.fillStyle=rgba(mix(LP.green,LP.paper,0.45),sm);ctx.fillRect(-bw/2,-bh/2+8,2,bh-16);}
    lp_T(ctx,"5 h",0,10,{w:800,size:28,align:"center",color:"#fff"});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the 21 reports people read, on the platform */
// the platform: a sheet whose lines are data's orange; the 21 come onto it as cards, each with its owner's mark (a small dot and a
// line); o.u (they come), o.own (their owners), o.a
function lo_platform(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const x=o.x||900,y=o.y||200,w=880,h=520;
  lp_sheet(ctx,x,y,w,h,{col:LP.orange,light:o.light==null?"day":o.light,pin:false});lp_T(ctx,"THE PLATFORM",x+36,y+70,{w:800,size:28,ls:3,col:LP.orange});
  let n=0;for(let i=0;i<38;i++){if(lo_isCold(i))continue;const k=n++,v=lo_st(o.u||0,k,21,0.3);if(v<=0)continue;const cx=x+40+(k%7)*118,cy=y+110+Math.floor(k/7)*128;
    ctx.save();ctx.globalAlpha*=ag_sine(v);lo_card(ctx,cx,cy,98,70,{col:LP.orange});lo_glyph(ctx,cx,cy+6,98,64,0);
    const ow=lo_st(o.own||0,k,21,0.3);if(ow>0){ctx.globalAlpha*=ag_sine(ow);ctx.fillStyle=rgba(LP.ink,1);ctx.beginPath();ctx.arc(cx+14,cy+92,9,0,TAU);ctx.fill();ctx.fillRect(cx+30,cy+88,56,8);}
    ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- three plain works, in greys */
// a square, three bars, one long line: plain forms, as the minimal art of the 1960s made them, in greys that mean nothing. o.u, o.a
function lo_art(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  const frames=[[230,200,250,250],[560,200,250,250],[890,200,250,250]];frames.forEach(([x,y,w,h],i)=>{const v=clamp((o.u==null?1:o.u)*3-i,0,1);if(v<=0)return;ctx.save();ctx.globalAlpha*=ag_sine(v);
    lp_sheet(ctx,x,y,w,h,{light:"day",pin:false});ctx.fillStyle=rgba([92,88,86],1);
    if(i===0)ctx.fillRect(x+70,y+70,w-140,h-140);else if(i===1){for(let b=0;b<3;b++)ctx.fillRect(x+60+b*52,y+50,24,h-100);}else ctx.fillRect(x+40,y+h/2-6,w-80,12);ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the five who stand together */
const LO_TEAM=[["helena",380],["noor",680],["sam",980],["jun",1280],["ivy",1580]];

/* ---------------------------------------------------------------- the Monday summary's lines */
// one line for each kind of alert that needs nothing (five kinds), each coming in as its alerts arrive. (x, y) the first line's left; u 0 to 1
function lo_sumLines(ctx,x,y,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004||u<=0)return;ctx.save();ctx.globalAlpha*=a;
  [180,130,160,110,150].forEach((lw,k)=>{const v=clamp(u*5-k,0,1);if(v<=0)return;ctx.save();ctx.globalAlpha*=ag_sine(v);ctx.fillStyle=rgba(LP.amber,1);ctx.beginPath();ctx.arc(x+5,y+k*13+4,4.5,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(mix(LP.mut,LP.paper,0.45),1);ctx.fillRect(x+16,y+k*13,lw*ag_sine(v),8);ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the wall at a quarterly review */
// as it stands after the cuts: the 21 reports people read (the 17 switched off), the designed week, the 12 alerts that need someone. t0: when it comes in
function lo_miniWall(ctx,t,t0,y){y=y||470;const a=ag_in(t,t0,0.6);if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  const ru=ag_in(t,t0,1.4);lo_reports(ctx,t,330,y,{s:0.6,u:ru,used:1,cold:1,off:1});
  lo_week(ctx,870,y-8,280,230,"designed",{a:ag_in(t,t0+0.4,0.4),k:t-t0-0.4,title:"The week"});
  ctx.save();ctx.translate(1250,y+2);ctx.scale(0.5,0.5);lo_alerts(ctx,t,0,0,{sort:1,sum:1,act:1,actX:0,actY:0});ctx.restore();
  ctx.restore();}
