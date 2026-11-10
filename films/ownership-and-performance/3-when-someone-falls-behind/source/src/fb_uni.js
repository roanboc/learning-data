/* ===== When someone falls behind: the university, 2027 =====
   The film's own pictures for the data team's year (prefix fb_). The module's kit draws the rooms, the people, the sheets and the things
   in them, and is never changed for this film; what is here is this film's alone:
     fbMorning, fbOne, fbDecember   the team's room on a morning; the small room where Helena holds her one-to-ones, in the late
                                    afternoon; the same room on a December evening, its lamp on
     fbMap                          a pale sheet with the Pacific's lines of latitude, for the trip to Japan
     FB_TOMAS                       Tomás Ortega, the team's report developer (the agent films' spec, drawn by the kit)
     fb_move(ctx, t, o)             the reports moving off the old warehouse onto the platform, as code, each one reviewed
     fb_weeks(ctx, x, y, o)         ten of Tomás's weeks: those that kept pace with the team, and those that went back for changes
     fb_chart(ctx, x, y, w, h, o)   days from a request to first use, month by month, February to December 2027: the team's line, and
                                    Tomás's own, read in his one-to-ones; the gap between them, where it's asked for
     fb_cal(ctx, x, y, o)           the first Wednesday of each month, July to December, when Tomás and Helena read his plan
     fb_desk(ctx, x, y, o)          an empty workstation: a desk, a chair and a laptop, closed
   Colour keeps the module's meaning: orange the data (the team's days from a request to first use), blue plans (Tomás's own plan),
   green what's done or cleared (the blockers removed, the weeks that kept pace), amber a gap or a risk (the gap, the weeks that went
   back). Tomás's own line is ink: a person is never a colour. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.fbMorning=c=>lp_paintRoom(c,{light:"morning",seed:7});
AG_PLACES.fbOne=c=>lp_paintRoom(c,{light:"late",seed:9,base:[222,206,190]});
AG_PLACES.fbDecember=c=>lp_paintRoom(c,{light:"evening",seed:9,base:[222,206,190],lamp:[1500,280]});
AG_ROOMS.fbDecember="fbOne";
AG_PLACES.fbMap=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(232,226,214)");g.addColorStop(1,"rgb(220,212,198)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // lines of latitude and longitude, faint, curving a little as on a globe
  c.strokeStyle="rgba(86,76,70,0.14)";c.lineWidth=2;for(let k=0;k<8;k++){const y=140+k*96;c.beginPath();c.moveTo(0,y);c.quadraticCurveTo(W/2,y-40,W,y);c.stroke();}
  for(let k=0;k<11;k++){const x=k*192;c.beginPath();c.moveTo(x,0);c.quadraticCurveTo(x+(x-W/2)*0.08,H/2,x,H);c.stroke();}
  // the two coasts, only as soft edges at the frame's sides: Asia at the left, North America at the right
  c.fillStyle="rgba(176,162,140,0.55)";c.beginPath();c.moveTo(0,0);c.lineTo(260,0);c.bezierCurveTo(330,180,250,330,330,470);c.bezierCurveTo(390,600,300,760,240,1080);c.lineTo(0,1080);c.closePath();c.fill();
  c.beginPath();c.moveTo(W,0);c.lineTo(1700,0);c.bezierCurveTo(1640,160,1700,300,1640,430);c.bezierCurveTo(1590,560,1680,740,1720,1080);c.lineTo(W,1080);c.closePath();c.fill();
  g=c.createRadialGradient(W*0.55,H*0.42,H*0.38,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.18));c.fillStyle=g;c.fillRect(0,0,W,H);};

/* ---------------------------------------------------------------- Tomás */
const FB_TOMAS={name:"Tomás Ortega",role:"Report developer",key:"fb-tomas",skin:[198,150,114],hair:{style:"side",c:[46,36,30],streak:[120,108,100]},beard:[58,46,40],
  top:{kind:"cardigan",c:[112,100,88],inner:[226,222,214]},breath:0.27};

/* ---------------------------------------------------------------- the reports moving off the old warehouse */
// o.u (0 to 1: the reports move across, one after another); o.rev (0 to 1: each on the platform is reviewed, a tick); o.a; o.light
function fb_move(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const lt=o.light||"day";ctx.save();ctx.globalAlpha*=a;
  // the old warehouse: a grey cabinet of drawers
  const wx=150,wy=250,ww=440,wh=430;ctx.save();ctx.shadowColor="rgba(52,36,30,0.3)";ctx.shadowBlur=20;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=12;ctx.fillStyle=rgba([150,146,142],1);ctx.fillRect(wx,wy,ww,wh);ctx.restore();
  for(let i=0;i<4;i++){const y=wy+28+i*100;ctx.fillStyle=rgba([170,166,162],1);ctx.fillRect(wx+24,y,ww-48,80);ctx.fillStyle=rgba(LP.graphite,1);ctx.fillRect(wx+ww/2-40,y+34,80,12);}
  lp_T(ctx,"The old warehouse",wx+ww/2,wy-28,{w:700,size:32,align:"center"});
  // the platform: a sheet of code, its lines in data's orange
  lp_sheet(ctx,1300,250,480,430,{col:LP.orange,light:lt,pin:false});lp_T(ctx,"The platform",1540,222,{w:700,size:32,align:"center"});
  for(let i=0;i<8;i++){const lw=[300,220,340,180,260,320,200,280][i];ctx.fillStyle=rgba(i%3===0?LP.orange:LP.mut,0.55);ctx.fillRect(1340+(i%3===1?40:0),310+i*42,lw,12);}
  // the reports, card by card, from the cabinet to the platform; each one reviewed when it lands
  const n=6;for(let k=0;k<n;k++){const u=clamp((o.u||0)*(n+2)/n*1.0-k*0.16,0,1),e=ag_sine(u);if(u<=0)continue;const x=lerp(wx+ww/2,1540,e)-70,y=lerp(wy+wh/2,620-k*0,e)-48-Math.sin(Math.PI*e)*120;
    if(e>=1)continue;ctx.save();ctx.shadowColor="rgba(52,36,30,0.25)";ctx.shadowBlur=10;ctx.shadowOffsetX=-4;ctx.shadowOffsetY=6;ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(x,y,140,96);ctx.restore();
    for(let r=0;r<4;r++){ctx.fillStyle=rgba(LP.orange,0.5);ctx.fillRect(x+16,y+20+r*18,lerp(60,108,(r*37%5)/5),8);}}
  const rv=clamp(o.rev||0,0,1);if(rv>0){ctx.save();ctx.globalAlpha*=ag_sine(rv);const f=lerp(0.6,1,ag_spr(rv*1.2,0,0.5));ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(1740,300,26*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",1740,300,34*f,[255,255,255]);ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- ten of Tomás's weeks */
// a square for each week, April to June: green where his work kept pace with the team's, amber where it went back for changes; o.u
// (0 to 1: they come in one by one); o.a
const FB_WEEKS=[1,0,1,1,0,0,1,0,1,0];
function fb_weeks(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  FB_WEEKS.forEach((ok,i)=>{const u=clamp((o.u==null?1:o.u)*FB_WEEKS.length-i,0,1);if(u<=0)return;const bx=x+i*96,f=lerp(0.7,1,ag_spr(u,0,0.4));ctx.save();ctx.globalAlpha*=ag_sine(u);
    ctx.translate(bx+38,y+38);ctx.scale(f,f);ctx.fillStyle=rgba(ok?LP.green:LP.amber,1);ctx.fillRect(-38,-38,76,76);lp_icon(ctx,ok?"tick":"wait",0,0,40,[255,255,255]);ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the chart: days from a request to first use */
// month by month, February (0) to December (10) 2027. The team's are the measures page's (41 in February, 24 in June, 14 in December);
// Tomás's are his own, from his own work, read only in his one-to-ones (40, 35, 20)
const FB_TEAM=[41,38,33,28,24,22,20,18,17,15,14],FB_TOM=[40,40,38,37,35,33,32,26,29,23,20],FB_MON=["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// o: team (0 to 11: how many months of the team's line are drawn, fractions draw on), tom (the same for Tomás's), gapAt (a month
// whose gap is shaded amber, gapA its opacity), hi ({month: a}: a ring round Tomás's point that month), labels (a: the lines'
// names), a, k, light
function fb_chart(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.orange,light:o.light,pin:false});
  lp_T(ctx,"DAYS FROM A REQUEST TO FIRST USE",x+40,y+66,{w:800,size:28,ls:3,col:LP.orange});
  const px0=x+120,px1=x+w-170,py0=y+120,py1=y+h-90,X=i=>lerp(px0,px1,i/10),Y=v=>lerp(py1,py0,v/45);
  // the axis: days up the side, months along the bottom
  ctx.strokeStyle=rgba(LP.mut,0.35);ctx.lineWidth=2;for(const v of [0,10,20,30,40]){ctx.beginPath();ctx.moveTo(px0,Y(v));ctx.lineTo(px1,Y(v));ctx.stroke();lp_T(ctx,String(v),px0-22,Y(v)+10,{w:600,size:28,col:LP.mut,align:"right"});}
  for(const i of [0,4,10])lp_T(ctx,FB_MON[i],X(i),py1+46,{w:600,size:28,col:LP.mut,align:"center"});
  // the gap, at one month
  if(o.gapAt!=null&&(o.gapA||0)>0.004){const i=o.gapAt,gx=X(i);ctx.save();ctx.globalAlpha*=clamp(o.gapA,0,1);ctx.fillStyle=rgba(LP.amber,0.22);ctx.fillRect(gx-26,Y(FB_TOM[i]),52,Y(FB_TEAM[i])-Y(FB_TOM[i]));
    ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(gx-26,Y(FB_TOM[i]));ctx.lineTo(gx+26,Y(FB_TOM[i]));ctx.moveTo(gx-26,Y(FB_TEAM[i]));ctx.lineTo(gx+26,Y(FB_TEAM[i]));ctx.moveTo(gx,Y(FB_TOM[i]));ctx.lineTo(gx,Y(FB_TEAM[i]));ctx.stroke();ctx.restore();}
  // a line, drawn on month by month (n months, fractions part way), with a dot on each month it reaches
  const line=(vals,n,col,dash,wd)=>{if(n<=0)return;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=wd;ctx.lineCap="round";ctx.lineJoin="round";if(dash)ctx.setLineDash(dash);ctx.beginPath();
    const m=Math.min(10,n-1);for(let i=0;i<=Math.floor(m);i++){const px=X(i),py=Y(vals[i]);if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}
    const f=m-Math.floor(m);if(f>0&&Math.floor(m)<10){const i=Math.floor(m);ctx.lineTo(lerp(X(i),X(i+1),f),lerp(Y(vals[i]),Y(vals[i+1]),f));}ctx.stroke();ctx.setLineDash([]);
    for(let i=0;i<=Math.floor(m);i++){ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(X(i),Y(vals[i]),i===0||i===4||i===10?9:5,0,TAU);ctx.fill();}ctx.restore();};
  line(FB_TEAM,o.team||0,LP.orange,null,8);line(FB_TOM,o.tom||0,LP.ink,[18,12],6);
  // rings round Tomás's points, where the film points at a month
  for(const [i,ra] of Object.entries(o.hi||{})){if(ra<=0.004)continue;ctx.save();ctx.globalAlpha*=clamp(ra,0,1);ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=5;ctx.beginPath();ctx.arc(X(+i),Y(FB_TOM[+i]),22,0,TAU);ctx.stroke();ctx.restore();}
  // the lines' names, at their ends
  const la=(o.labels==null?1:o.labels)*clamp(Math.min(o.team||0,o.tom||99)-1.6,0,1);if(la>0.004){ctx.save();ctx.globalAlpha*=la;
    // each name rides at its line's end, as far as the line is drawn, so it moves smoothly as the line draws on
    const end=(vals,n)=>{const m=clamp(n-1,0,10),i=Math.min(9,Math.floor(m)),f=m-i;return[lerp(X(i),X(i+1),f),lerp(Y(vals[i]),Y(vals[i+1]),f)];};
    const [tx,ty]=end(FB_TEAM,o.team||0),[mx,my]=end(FB_TOM,o.tom||0),sep=Math.max(0,40-(ty-my));
    if((o.team||0)>0)lp_T(ctx,"The team",tx+22,ty+10+sep/2,{w:700,size:28,col:LP.orange});
    if((o.tom||0)>0)lp_T(ctx,"Tomás",mx+22,my-14-sep/2,{w:700,size:28,col:LP.ink});ctx.restore();}
  // the values at the months the film names
  for(const [i,va] of Object.entries(o.vals||{})){if(va<=0.004)continue;ctx.save();ctx.globalAlpha*=clamp(va,0,1);const ix=+i,vx=ix===0?34:0;
    if((o.tom||0)>ix)lp_T(ctx,String(FB_TOM[ix]),X(ix)+vx,Y(FB_TOM[ix])-26,{w:800,size:30,col:LP.ink,align:"center"});
    if((o.team||0)>ix)lp_T(ctx,String(FB_TEAM[ix]),X(ix)+vx,Y(FB_TEAM[ix])+48,{w:800,size:30,col:LP.orange,align:"center"});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the first Wednesday of each month */
const FB_CAL=[["Jul","7"],["Aug","4"],["Sep","1"],["Oct","6"],["Nov","3"],["Dec","1"]];
function fb_cal(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  FB_CAL.forEach(([m,d],i)=>{const u=clamp((o.u==null?1:o.u)*FB_CAL.length-i,0,1);if(u<=0)return;const bx=x+i*150;ctx.save();ctx.globalAlpha*=ag_sine(u);
    lp_sheet(ctx,bx,y,124,124,{light:o.light,pin:false,col:LP.blue});lp_T(ctx,m,bx+62,y+60,{w:700,size:28,col:LP.blue,align:"center"});lp_T(ctx,d,bx+62,y+104,{w:800,size:36,align:"center"});ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- an empty workstation */
function fb_desk(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  // the chair behind the desk, pushed in a little
  ctx.fillStyle=rgba(mix(LP.graphite,LP.wall,0.25),1);ctx.beginPath();ctx.moveTo(x-80,y-170);ctx.quadraticCurveTo(x,y-200,x+80,y-170);ctx.lineTo(x+70,y-40);ctx.lineTo(x-70,y-40);ctx.closePath();ctx.fill();
  lp_table(ctx,x-260,y,520,{});lp_laptop(ctx,x,y-34,200,{});ctx.restore();}
