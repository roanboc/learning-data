/* ===== A case worth funding: the university, May 2027 =====
   The film's own pictures at the university, on the module's kit (prefix cwf_). Helena builds her case on the team's wall, sheet by
   sheet, in May's morning light; on Tuesday 25 May the data council reads it as one page, on the screen in its room. Colour keeps the
   module's meaning: the case and its recommended option in blue (a plan), a cost in amber (the licence, each option's price, the
   reports nobody opens), the warehouse's logs and the platform's cost records in orange (data), and the saving, the benefits and the
   council's yes in green (value). People's clothes wear none of the five.
     cwfRoom, cwfMon   the team's room in May's morning light, and on an afternoon after
     cwfCouncil        the room where the data council meets: the same plaster, a timber dado, the afternoon sun
     cwf_old           the old warehouse on a sheet: a server cabinet, and since when
     cwf_five          the Five Case Model's five questions as a checklist, each ticked as Helena answers it
     cwf_option        one option on a sheet: its letter, what it does, what it costs
     cwf_logs          the warehouse's own logs on a screen: its 38 reports, the 17 nobody opened in a year in amber
     cwf_costs         option C's costs: once, and every year
     cwf_saving        what stops and what starts every year, and the saving between them
     cwf_payback       the payback: the cost once, then the saving month by month, the month it's covered, five years on
     cwf_benefits      each benefit with its owner and its date; o.seen adds when the council sees them
     cwf_page          the one page on the council's screen: words only once the camera is close enough to read them
     cwf_parts         the one page's four parts, the whole film in one shape
     CWF_UNI           Rohan Desai, as the module's numbers seed him (Mei Tanaka is the agent films')
   Sizes are in the 1920 x 1080 frame; every word is at least 28 px as seen, and nothing but the captions goes below y 890. */

AG_PLACES.cwfRoom=c=>lp_paintRoom(c,{light:"morning",seed:21});
AG_PLACES.cwfMon=c=>lp_paintRoom(c,{light:"day",seed:21});
// the council's room: the module's plaster over a timber dado, the rail at y 640, the panels below it in the room's shade
AG_PLACES.cwfCouncil=c=>{lp_paintRoom(c,{light:"day",seed:24,base:[228,214,194]});const T=LP.timber;
  let g=c.createLinearGradient(0,640,0,914);g.addColorStop(0,rgba(mix(T,LP.shade,0.18),1));g.addColorStop(1,rgba(mix(T,LP.shade,0.34),1));c.fillStyle=g;c.fillRect(0,640,W,274);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.22));g.addColorStop(0.5,rgba(LP.shade,0.04));g.addColorStop(1,rgba(LP.sun,0.1));c.fillStyle=g;c.fillRect(0,640,W,274);
  for(let x=40;x<W;x+=310){c.strokeStyle=rgba(mix(T,LP.shade,0.45),0.5);c.lineWidth=3;c.strokeRect(x,676,260,206);c.strokeStyle="rgba(255,246,230,0.18)";c.lineWidth=2;c.strokeRect(x+4,680,252,198);}
  c.fillStyle=rgba(mix(T,LP.shade,0.08),1);c.fillRect(0,628,W,16);c.fillStyle="rgba(255,248,236,0.5)";c.fillRect(0,628,W,2);c.fillStyle=rgba(LP.shade,0.24);c.fillRect(0,644,W,4);};

/* ---------------------------------------------------------------- small helpers */
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function cwf_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
function cwf_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function cwf_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// a whole sheet drawn by f(ctx) that springs in from its centre as k runs from 0 and fades with a
function cwf_spring(ctx,cx,cy,a,k,f){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(k!=null)ag_about(ctx,cx,cy,lerp(0.6,1,ag_spr(k,0,0.5)));f(ctx);ctx.restore();}
const cwf_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;

/* ---------------------------------------------------------------- the old warehouse */
// a server cabinet: graphite, seven trays of drives, a small pale light on each; no colour that means anything
function cwf_cabinet(ctx,x,y,w,h){ctx.save();ctx.shadowColor="rgba(52,36,30,0.3)";ctx.shadowBlur=10;ctx.shadowOffsetX=-5;ctx.shadowOffsetY=5;
  let g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"#3a383d");g.addColorStop(1,"#5e5c62");ctx.fillStyle=g;rr(ctx,x,y,w,h,8);ctx.fill();ctx.restore();
  const n=7,bh=(h-36)/n;for(let i=0;i<n;i++){const by=y+18+i*bh;ctx.fillStyle="#29282c";rr(ctx,x+12,by,w-24,bh-7,4);ctx.fill();
    for(let j=0;j<4;j++){ctx.fillStyle="rgba(255,255,255,0.13)";ctx.fillRect(x+20+j*((w-56)/4),by+5,(w-56)/4-7,bh-17);}
    ctx.fillStyle=i%3===1?"rgba(255,236,200,0.85)":"rgba(226,232,236,0.7)";ctx.beginPath();ctx.arc(x+w-22,by+(bh-7)/2,3.5,0,TAU);ctx.fill();}
  ctx.fillStyle="rgba(255,255,255,0.16)";ctx.fillRect(x+6,y+4,w-12,2);}
// the old warehouse's sheet: the cabinet, then since when and where; returns {x, y, w, h}
function cwf_old(ctx,x,y,w,o){o=o||{};const h=300,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0.004)return bb;
  cwf_spring(ctx,x+w/2,y+h/2,a,o.k,c=>{lp_sheet(c,x,y,w,h,{light:o.light});cwf_cabinet(c,x+40,y+44,124,212);
    const tx=x+200;lp_label(c,tx,y+84,"The old warehouse");lp_T(c,"Since 2012",tx,y+146,{w:800,size:40});
    const ls=lp_wrap(c,"On the university's own servers",w-tx+x-36,{w:600,size:28});ls.forEach((s,i)=>lp_T(c,s,tx,y+194+i*38,{w:600,size:28,col:LP.mut}));});
  return bb;}

/* ---------------------------------------------------------------- the Five Case Model, as a checklist */
const CWF_FIVE=[["Is it needed?","Strategic"],["Is it the best value?","Economic"],["Can it be bought?","Commercial"],["Can it be afforded?","Financial"],["Can it be delivered?","Management"]];
// o.u (0 to 1: the questions come in, one by one), o.tick (0 to 1: each is ticked), o.light, o.a, o.k; returns {x, y, w, h}
function cwf_five(ctx,x,y,w,o){o=o||{};const rh=76,h=214+CWF_FIVE.length*rh+18,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0.004)return bb;
  cwf_spring(ctx,x+w/2,y+h/2,a,o.k,c=>{lp_sheet(c,x,y,w,h,{light:o.light});lp_label(c,x+44,y+84,"The Five Case Model · HM Treasury");
    lp_T(c,"Five questions a good case answers",x+44,y+148,{w:800,size:40});
    CWF_FIVE.forEach(([q,nm],i)=>{const k=o.u==null?1:clamp(o.u*CWF_FIVE.length-i,0,1);if(k<=0)return;const ry=y+214+i*rh;c.save();c.globalAlpha*=ag_sine(k);
      c.strokeStyle=rgba(LP.mut,0.8);c.lineWidth=3;rr(c,x+44,ry,40,40,6);c.stroke();
      const tk=clamp((o.tick||0)*CWF_FIVE.length-i,0,1);if(tk>0){c.save();c.beginPath();c.rect(x+40,ry-10,52*ag_sine(tk),62);c.clip();lp_icon(c,"tick",x+64,ry+20,40,LP.green);c.restore();}
      lp_T(c,q,x+110,ry+32,{w:700,size:32});lp_T(c,nm,x+w-44,ry+32,{w:600,size:28,align:"right",col:LP.mut});
      if(i<CWF_FIVE.length-1){c.fillStyle=rgba(LP.mut,0.16);c.fillRect(x+110,ry+rh-14,w-154,2);}c.restore();});});
  return bb;}

/* ---------------------------------------------------------------- the three options */
const CWF_OPT=[
  {letter:"A",above:"Carry on as now",title:"Renew the licence",lines:["Three more years","An old version, on old servers"],cost:"A$930,000",note:"Over three years"},
  {letter:"B",above:"Move everything",title:"Move all 38 reports",lines:["As they are"],cost:"A$520,000",note:"Once"},
  {letter:"C",above:"Move what's used",title:"Move the 21 used reports",lines:["Rebuilt from governed products","Retire the 17 nobody opens"],cost:"A$380,000",note:"Once",rec:true}];
const CWF_OPTX=[580,990,1400],CWF_OPTW=390,CWF_OPTY=190,CWF_OPTH=560;
// option i on a sheet: o.u (0 to 1: its lines come in), o.cost (0 to 1: its price), o.rec (0 to 1: C turns blue, recommended), o.dim
// (0 to 1: it steps back while another is talked about), o.light, o.a, o.k
function cwf_option(ctx,i,o){o=o||{};const d=CWF_OPT[i],x=CWF_OPTX[i],y=CWF_OPTY,w=CWF_OPTW,h=CWF_OPTH,a=(o.a==null?1:o.a)*(1-0.45*(o.dim||0));if(a<=0.004)return;
  lp_label(ctx,x+w/2,y-34,d.above,{align:"center",col:LP.mut,a});
  cwf_spring(ctx,x+w/2,y+h/2,a,o.k,c=>{const rc=clamp(o.rec||0,0,1);lp_sheet(c,x,y,w,h,{light:o.light,col:rc>0.5?LP.blue:null});
    if(rc>0&&rc<=0.5){c.save();c.globalAlpha*=rc*2;c.fillStyle=rgba(LP.blue,1);c.fillRect(x,y,w,12);c.restore();}
    c.fillStyle=rgba(mix(LP.ink,LP.blue,rc),1);c.beginPath();c.arc(x+66,y+84,30,0,TAU);c.fill();lp_T(c,d.letter,x+66,y+96,{w:800,size:34,align:"center",col:[255,255,255]});
    lp_label(c,x+112,y+94,"Option "+d.letter,{col:rc>0.5?LP.blue:LP.mut});
    const tl=lp_wrap(c,d.title,w-72,{w:800,size:36});let yy=y+130;tl.forEach(s=>{yy+=44;lp_T(c,s,x+36,yy,{w:800,size:36});});yy+=14;
    const u=o.u==null?1:o.u;d.lines.forEach((l,n)=>{const la=clamp(u*d.lines.length-n,0,1);const ls=lp_wrap(c,l,w-106,{w:600,size:28});c.save();c.globalAlpha*=ag_sine(la);
      ls.forEach((s,j)=>{yy+=38;if(j===0){c.fillStyle=rgba(LP.mut,1);c.beginPath();c.arc(x+44,yy-10,6,0,TAU);c.fill();}lp_T(c,s,x+70,yy,{w:600,size:28});});yy+=10;c.restore();});
    const ck=clamp(o.cost==null?1:o.cost,0,1);if(ck>0){c.save();c.globalAlpha*=ag_sine(ck);c.fillStyle=rgba(LP.amber,0.1);c.fillRect(x+20,y+h-150,w-40,124);
      lp_T(c,d.cost,x+36,y+h-76,{w:800,size:52,col:LP.amber});lp_T(c,d.note,x+36,y+h-38,{w:600,size:28,col:LP.mut});c.restore();}});}

/* ---------------------------------------------------------------- the warehouse's own logs */
const CWF_UNOPENED=[1,3,4,7,9,10,12,15,17,18,21,24,26,29,31,34,36];
// on a screen at (x, y), w by h: the 38 reports, each a small card with an orange band (its use, from the logs); o.u (0 to 1: they come
// in), o.amb (0 to 1: the 17 nobody opened in a year turn amber and pale), o.used (0 to 1: the line for the 21 used), o.a
function cwf_logs(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;
  lp_screen(ctx,x,y,w,h,{a,draw:(c,X,Y,Wd,Hd)=>{lp_T(c,"The warehouse's logs",X+24,Y+50,{w:800,size:30,col:LP.orange});
    const cols=6,cw=(Wd-48)/cols,chh=52,gx=X+24,gy=Y+80;
    for(let i=0;i<38;i++){const k=clamp((o.u||0)*38-i,0,1);if(k<=0)continue;const cx=gx+(i%cols)*cw,cy=gy+Math.floor(i/cols)*chh,un=CWF_UNOPENED.indexOf(i)>=0,am=un?clamp(o.amb||0,0,1):0;
      c.save();c.globalAlpha*=ag_sine(k)*(1-0.4*am);c.fillStyle=rgba(LP.paper,1);c.shadowColor="rgba(52,36,30,0.2)";c.shadowBlur=5;c.shadowOffsetX=-3;c.shadowOffsetY=3;c.fillRect(cx,cy,cw-14,chh-12);c.shadowColor="transparent";
      c.fillStyle=rgba(mix(LP.orange,LP.amber,am),1);c.fillRect(cx,cy,cw-14,7);for(let l=0;l<2;l++){c.fillStyle=rgba(mix(LP.mut,[255,255,255],0.5),1);c.fillRect(cx+8,cy+16+l*10,cw-36-l*14,4);}c.restore();}
    const ty=gy+7*chh+30;
    if((o.amb||0)>0)lp_T(c,"17 not opened in a year",X+24,ty,{w:800,size:28,col:LP.amber,a:ag_sine(clamp(o.amb*1.5,0,1))});
    if((o.used||0)>0)lp_T(c,"21 used, by about 260 people",X+24,ty+42,{w:700,size:28,a:ag_sine(o.used)});}});}

/* ---------------------------------------------------------------- what option C costs: once, and every year */
// o.u (0 to 1: the two rows come in), o.src (0 to 1: the cost records' source, in orange), o.light, o.a, o.k; returns {x, y, w, h}
function cwf_costs(ctx,x,y,w,o){o=o||{};const h=480,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0.004)return bb;
  cwf_spring(ctx,x+w/2,y+h/2,a,o.k,c=>{lp_sheet(c,x,y,w,h,{light:o.light,col:LP.amber});lp_label(c,x+44,y+86,"Option C's costs",{col:LP.amber});
    const row=(ry,kick,num,line,k,dot)=>{if(k<=0)return;c.save();c.globalAlpha*=ag_sine(k);lp_label(c,x+44,ry,kick,{col:LP.mut});lp_T(c,num,x+44,ry+64,{w:800,size:52,col:LP.amber});
      if(dot){c.fillStyle=rgba(LP.orange,1);c.beginPath();c.arc(x+52,ry+98,7,0,TAU);c.fill();}lp_T(c,line,x+(dot?72:44),ry+108,{w:600,size:28,col:dot?LP.orange:LP.mut});c.restore();};
    const u=o.u==null?1:o.u;row(y+146,"Once","A$380,000","To move and rebuild the 21 reports",clamp(u*2,0,1),false);
    row(y+318,"Every year","A$40,000","From the platform's cost records",clamp(u*2-1,0,1),true);});
  return bb;}

/* ---------------------------------------------------------------- every year: what stops, what starts, and the saving */
// o.u1, o.u2 (0 to 1: the two bars grow), o.sv (0 to 1: the saving between them, in green), o.light, o.a, o.k; returns {x, y, w, h}
function cwf_saving(ctx,x,y,w,o){o=o||{};const h=470,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0.004)return bb;
  cwf_spring(ctx,x+w/2,y+h/2,a,o.k,c=>{lp_sheet(c,x,y,w,h,{light:o.light,col:LP.green});lp_label(c,x+44,y+86,"Every year, from January 2028",{col:LP.green});
    const bx=x+44,bw=w-88,full=bw*0.68,bar=(ry,v,u,label,val)=>{if(u<=0)return;c.save();c.globalAlpha*=ag_sine(clamp(u*3,0,1));lp_T(c,label,bx,ry,{w:600,size:28,col:LP.mut});
      const l=Math.max(14,full*v*ag_eo(u));c.fillStyle=rgba(LP.amber,1);rr(c,bx,ry+16,l,54,8);c.fill();lp_T(c,val,bx+l+16,ry+56,{w:800,size:32,col:LP.amber});c.restore();};
    bar(y+150,1,o.u1==null?1:o.u1,"Stops: the licence, servers and support","A$310,000");
    bar(y+272,40/310,o.u2==null?1:o.u2,"Starts: running the 21 on the platform","A$40,000");
    const sv=clamp(o.sv||0,0,1);if(sv>0){c.save();c.globalAlpha*=ag_sine(clamp(sv*2,0,1));const x0=bx+full*40/310,x1=bx+full,yb=y+372;
      c.strokeStyle=rgba(LP.green,1);c.lineWidth=4;c.lineCap="round";c.beginPath();c.moveTo(x0,yb-14);c.lineTo(x0,yb);c.lineTo(lerp(x0,x1,ag_eo(sv)),yb);if(sv>0.98){c.lineTo(x1,yb-14);}c.stroke();
      c.fillStyle=rgba(LP.green,0.12);c.fillRect(x0,y+288,(x1-x0)*ag_eo(sv),54);
      lp_T(c,"Saving: A$270,000 a year",x0+((x1-x0)/2),yb+52,{w:800,size:34,align:"center",col:LP.green,a:ag_sine(clamp(sv*2-1,0,1))});c.restore();}});
  return bb;}

/* ---------------------------------------------------------------- the payback */
// the money, month by month from January 2028: A$380,000 spent before it, then A$22,500 saved each month (A$270,000 a year), so it's
// covered in about 17 months and A$970,000 ahead at five years. o.m (0 to 60: the months drawn so far), o.pb (0 to 1: the month it's covered),
// o.end (0 to 1: five years on), o.light, o.a, o.k; returns {x, y, w, h}
function cwf_payback(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0.004)return bb;
  cwf_spring(ctx,x+w/2,y+h/2,a,o.k,c=>{lp_sheet(c,x,y,w,h,{light:o.light,col:LP.green});lp_label(c,x+44,y+86,"The payback",{col:LP.green});
    const px0=x+60,px1=x+w-60,py0=y+140,py1=y+h-96,vmin=-380,vmax=970,X=m=>lerp(px0,px1,m/60),Y=v=>lerp(py1,py0,(v-vmin)/(vmax-vmin)),val=m=>-380+22.5*m;
    // the zero line, dashed, and the months along it
    c.save();c.setLineDash([10,8]);c.strokeStyle=rgba(LP.ink,0.6);c.lineWidth=2.5;c.beginPath();c.moveTo(px0-8,Y(0));c.lineTo(px1+8,Y(0));c.stroke();c.restore();
    lp_T(c,"Jan 2028",px0,py1+52,{w:600,size:28,col:LP.mut});lp_T(c,"Dec 2032",px1,py1+52,{w:600,size:28,col:LP.mut,align:"right"});
    const mEnd=clamp(o.m==null?60:o.m,0,60);if(mEnd>0){const pb=380/22.5;
      // under the line: amber while the cost isn't yet covered, green once it is
      const seg=(m0,m1,col,fa)=>{if(m1<=m0)return;c.fillStyle=rgba(col,fa);c.beginPath();c.moveTo(X(m0),Y(0));for(let m=m0;m<=m1+1e-6;m+=Math.max(0.5,(m1-m0)/40))c.lineTo(X(m),Y(val(m)));c.lineTo(X(m1),Y(val(m1)));c.lineTo(X(m1),Y(0));c.closePath();c.fill();
        c.strokeStyle=rgba(col,1);c.lineWidth=6;c.lineCap="round";c.beginPath();c.moveTo(X(m0),Y(val(m0)));c.lineTo(X(m1),Y(val(m1)));c.stroke();};
      seg(0,Math.min(mEnd,pb),LP.amber,0.14);seg(pb,mEnd,LP.green,0.14);
      c.fillStyle=rgba(LP.amber,1);c.beginPath();c.arc(X(0),Y(-380),9,0,TAU);c.fill();lp_T(c,"−A$380,000",X(0)+30,Y(-380)+16,{w:800,size:30,col:LP.amber});
      const p=clamp(o.pb||0,0,1);if(p>0&&mEnd>=pb){c.save();c.globalAlpha*=ag_sine(p);c.fillStyle=rgba(LP.green,1);c.beginPath();c.arc(X(pb),Y(0),11,0,TAU);c.fill();
        c.strokeStyle=rgba(LP.green,0.8);c.lineWidth=2.5;c.setLineDash([6,6]);c.beginPath();c.moveTo(X(pb),Y(0)-16);c.lineTo(X(pb),py0+24);c.stroke();c.setLineDash([]);
        lp_T(c,"Covered in about 17 months",X(pb)+18,py0+40,{w:800,size:30,col:LP.green});c.restore();}
      // five years on: the gain, in the green under the line's end, where nothing else is written
      const e=clamp(o.end||0,0,1);if(e>0&&mEnd>59.5){c.save();c.globalAlpha*=ag_sine(e);c.fillStyle=rgba(LP.green,1);c.beginPath();c.arc(X(60),Y(val(60)),11,0,TAU);c.fill();
        lp_T(c,"A$970,000 ahead",X(60)-24,Y(0)-74,{w:800,size:34,col:LP.green,align:"right"});lp_T(c,"at five years",X(60)-24,Y(0)-30,{w:600,size:28,col:LP.green,align:"right"});c.restore();}}});
  return bb;}

/* ---------------------------------------------------------------- the benefits, each with an owner and a date */
const CWF_BEN=[
  {what:"A$270,000 a year saved",owner:"Director of digital services",from:"January 2028"},
  {what:"Every report reads one staff list",owner:"Ingrid Holm, HR",from:"December 2027"},
  {what:"Every report has an owner, in the catalog",owner:"Helena Novak",from:"March 2028"}];
// o.u (0 to 1: the rows come in), o.nm (0 to 1: the line between money and what isn't), o.seen (0 to 1: a column for when the council
// sees each one), o.light, o.a, o.k; returns {x, y, w, h}
function cwf_benefits(ctx,x,y,w,o){o=o||{};const rh=104,top=y+226,gap=44,h=226+rh*3+gap+40,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0.004)return bb;
  const cx=[x+44,x+480,x+800,x+w-44],sn=clamp(o.seen||0,0,1),rowY=i=>top+i*rh+(i>0?gap:0);
  cwf_spring(ctx,x+w/2,y+h/2,a,o.k,c=>{lp_sheet(c,x,y,w,h,{light:o.light,col:LP.green});lp_label(c,x+44,y+86,"The benefits",{col:LP.green});
    lp_T(c,"Each with an owner and a date",x+44,y+146,{w:800,size:40});
    lp_label(c,cx[0],y+206,"Benefit",{col:LP.mut});lp_label(c,cx[1],y+206,"Owner",{col:LP.mut});lp_label(c,cx[2],y+206,"From",{col:LP.mut});
    if(sn>0)lp_label(c,cx[3],y+206,"Seen",{col:LP.green,align:"right",a:ag_sine(clamp(sn*2,0,1))});
    const u=o.u==null?1:o.u;CWF_BEN.forEach((b,i)=>{const k=clamp(u*3-i,0,1);if(k<=0)return;const ry=rowY(i);c.save();c.globalAlpha*=ag_sine(k);
      c.fillStyle=rgba(LP.mut,0.18);c.fillRect(x+44,ry,w-88,2);
      const ws=lp_wrap(c,b.what,cx[1]-cx[0]-30,{w:700,size:28});ws.forEach((s,j)=>lp_T(c,s,cx[0],ry+44+j*36,{w:700,size:28}));
      const os=lp_wrap(c,b.owner,cx[2]-cx[1]-30,{w:600,size:28});os.forEach((s,j)=>lp_T(c,s,cx[1],ry+44+j*36,{w:600,size:28}));
      lp_T(c,b.from,cx[2],ry+44,{w:600,size:28});
      if(sn>0){c.save();c.globalAlpha*=ag_sine(clamp(sn*3-i,0,1));lp_T(c,"Each quarter",cx[3],ry+44,{w:700,size:28,col:LP.green,align:"right"});c.restore();}
      c.restore();});
    // the benefits that aren't money, under the first
    const nm=clamp(o.nm||0,0,1);if(nm>0)lp_label(c,cx[0],rowY(1)-14,"Not money",{col:LP.mut,a:ag_sine(nm)});});
  return bb;}

/* ---------------------------------------------------------------- the one page, on the council's screen */
// drawn in the page's own units (1560 by 860, the screen's shape) at scale k from (x, y), so at the camera's zoom z its 28 px words read
// at 28 k z px: o.words (0 to 1: the words; under them, while they're not yet in, the page's lines as bars, which read as a page from
// afar and carry no words), o.hl ("decision", "a", "ask": that part picked out, o.hlA 0 to 1), o.a. It leads with the decision, and the
// ask comes right under it, in its own box; the options and the money on the left, the benefits on the right
const CWF_PW=1560,CWF_PH=860;
const CWF_PAGE={
  kick:"To the data council · Tuesday 25 May 2027",title:"Retire the old warehouse this year, or pay for three more?",
  ask:"A$380,000, and two of the team for six months. A decision today.",
  options:[["A","Renew the licence for three years","A$930,000"],["B","Move all 38 reports as they are","A$520,000"],["C","Move the 21 used, retire 17","A$380,000"]],
  costs:[["Once","A$380,000"],["Every year","A$40,000, not A$310,000"],["Saving","A$270,000 a year, from 2028"],["Paid back","In about 17 months"],["Five years","A$970,000 saved"]],
  benefits:[["The saving","Director of digital services · Jan 2028"],["One staff list","Ingrid Holm, HR · Dec 2027"],["An owner for every report","Helena Novak · Mar 2028"]],
  foot:"The money checked by Rohan Desai, Finance"};
const CWF_PG={kick:62,title:136,askBox:[32,168,1496,92],ask:226,col:312,opt:366,optStep:52,rec:516,costs:580,cost:632,costStep:48,ben:366,benStep:100,seen:668,foot:824,right:860};
function cwf_page(ctx,x,y,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const P=CWF_PAGE,G=CWF_PG,R=G.right,wd=clamp(o.words||0,0,1),hl=o.hl,hA=clamp(o.hlA==null?1:o.hlA,0,1);
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(k,k);
  ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(0,0,CWF_PW,CWF_PH);ctx.fillStyle=rgba(LP.blue,1);ctx.fillRect(0,0,CWF_PW,14);
  // the parts picked out, under the words: the decision, option A, the ask
  const box=(bx,by,bw,bh,col)=>{ctx.fillStyle=rgba(col,0.12*hA);rr(ctx,bx,by,bw,bh,12);ctx.fill();ctx.strokeStyle=rgba(col,0.9*hA);ctx.lineWidth=4;rr(ctx,bx,by,bw,bh,12);ctx.stroke();};
  if(hl==="decision")box(32,90,CWF_PW-64,64,LP.blue);if(hl==="a")box(32,G.opt-30,724,44,LP.amber);
  // the ask's own box, always there in blue
  const [ax,ay,aw,ah]=G.askBox;ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=4;rr(ctx,ax,ay,aw,ah,12);ctx.stroke();
  if(hl==="ask"){ctx.fillStyle=rgba(LP.blue,0.12*hA);rr(ctx,ax,ay,aw,ah,12);ctx.fill();}
  // from afar: the lines as bars
  if(wd<1){ctx.save();ctx.globalAlpha*=1-wd;const bar=(bx,by,bw,h,col)=>{ctx.fillStyle=rgba(col||mix(LP.mut,[255,255,255],0.45),1);rr(ctx,bx,by-h,bw,h,h/2);ctx.fill();};
    bar(50,G.kick,560,18,mix(LP.mut,[255,255,255],0.3));bar(50,G.title,1280,34,mix(LP.ink,[255,255,255],0.25));
    bar(60,G.ask-2,120,18,LP.blue);bar(250,G.ask,940,24,LP.blue);
    bar(50,G.col,260,18,LP.blue);for(let i=0;i<3;i++){bar(50,G.opt+i*G.optStep,520,20);bar(600,G.opt+i*G.optStep,130,20,i===2?LP.blue:LP.amber);}bar(92,G.rec,220,20,LP.blue);
    bar(50,G.costs,300,18,LP.amber);for(let i=0;i<5;i++){bar(50,G.cost+i*G.costStep,150,20);bar(250,G.cost+i*G.costStep,i===1?340:300,20,i>=2?LP.green:LP.amber);}
    bar(R,G.col,420,18,LP.green);for(let i=0;i<3;i++){bar(R,G.ben+i*G.benStep,330,20);bar(R,G.ben+40+i*G.benStep,520,18);}
    bar(R,G.seen,460,20,LP.green);bar(R,G.foot,560,18);ctx.restore();}
  if(wd>0){ctx.save();ctx.globalAlpha*=wd;const L=(s,lx,ly,o2)=>lp_T(ctx,s,lx,ly,Object.assign({w:600,size:28},o2));
    lp_label(ctx,50,G.kick,P.kick,{col:LP.mut});L(P.title,50,G.title,{w:800,size:44});
    lp_label(ctx,60,G.ask-2,"The ask",{col:LP.blue});L(P.ask,250,G.ask,{w:800,size:32,col:LP.ink});
    lp_label(ctx,50,G.col,"Three options",{col:LP.blue});
    P.options.forEach(([l,s,v],i)=>{const yy=G.opt+i*G.optStep,rec=l==="C";L(l,50,yy,{w:800,col:rec?LP.blue:LP.ink});L(s,92,yy,{w:rec?700:600,col:rec?LP.blue:LP.ink});L(v,730,yy,{w:800,align:"right",col:rec?LP.blue:LP.amber});});
    L("Recommended: C",92,G.rec,{w:800,col:LP.blue});
    lp_label(ctx,50,G.costs,"Costs and saving",{col:LP.amber});
    P.costs.forEach(([l,v],i)=>{const yy=G.cost+i*G.costStep;L(l,50,yy,{w:700,col:LP.mut});L(v,250,yy,{w:700,col:i>=2?LP.green:LP.amber});});
    lp_label(ctx,R,G.col,"Benefits, owners and dates",{col:LP.green});
    P.benefits.forEach(([l,v],i)=>{const yy=G.ben+i*G.benStep;L(l,R,yy,{w:700});L(v,R,yy+40,{col:LP.mut});});
    L("Seen by the council each quarter",R,G.seen,{w:700,col:LP.green});
    L(P.foot,R,G.foot,{col:LP.mut});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the one page's four parts */
const CWF_PARTS=[["Options","One of them, carrying on as now",LP.blue],["Costs","Once, and every year",LP.amber],["Benefits","Each with an owner and a date",LP.green],["One clear ask","And a decision, with a date",LP.blue]];
// four bands down a page, each coming in as it's said: o.u (four numbers, 0 to 1), o.light, o.a
function cwf_parts(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const bh=126,gap=14;ctx.save();ctx.globalAlpha*=a;
  CWF_PARTS.forEach(([nm,sub,col],i)=>{const k=o.u?clamp(o.u[i],0,1):1;if(k<=0)return;const by=y+i*(bh+gap);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,(1-ag_spr(k,0,0.5))*20);
    lp_sheet(ctx,x,by,w,bh,{pin:false,light:o.light,col});lp_T(ctx,nm,x+44,by+76,{w:800,size:40,col});lp_T(ctx,sub,x+w-44,by+76,{w:600,size:28,col:LP.mut,align:"right"});ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the people of the case
   As the module's numbers seed them (/mnt/project-files/modern-data-basics/numbers.md, the films of Modern data basics drew them first):
   Rohan Desai, Finance's management accountant, who checks the money (looked at full size, facing both ways, on 10 November 2026).
   Ingrid Holm, who owns the one staff list, is named on the benefits' sheet, not drawn. */
const CWF_UNI={
  rohan:{name:"Rohan Desai",role:"Finance",skin:[182,132,98],hair:{style:"side",c:[30,26,26]},glasses:[52,40,34],top:{kind:"blazer",c:[124,104,82],inner:[234,236,240]},breath:0.26}
};
