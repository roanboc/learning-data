/* ===== Who did what: the scenes, chapter by chapter =====
   Each chapter is a run of shots (ag_shots): a place painted once, a slow camera, and what's drawn live. Times come from the cues
   (c.<line>, when each line starts) and from the words of the lines (wAt), so the pictures stay with the voice. The opening is in
   Australia, 1953 to 1963 (wd_past.js); the rest in the university's hall (wd_pieces.js), by day, in the morning and late at night,
   which is one room: from shot to shot and chapter to chapter the camera glides on from where it is, what stays stays put, and only
   what changes fades; a later moment, with other things on the glass, is marked later:true, so what was there leaves first. Jun's home
   is a room of its own, and so is each place of the opening: between rooms the picture dissolves. */

DP_PEOPLE.push("sam","jun",["jun","lamp"],[WD_WARREN,"lamp"]);
function wd_once(sc,k,fn){sc.__wd=sc.__wd||{};if(!(k in sc.__wd))sc.__wd[k]=fn();return sc.__wd[k];}
// where people stand in the hall, and Warren at the bench
const WD_SAM={x:300,y:612,s:1},WD_JUN={x:300,y:612,s:1},WD_W={x:470,y:604,s:1,cut:706};
function wd_sam(ctx,t,o){o=o||{};dp_person(ctx,"sam",o.x||WD_SAM.x,o.y||WD_SAM.y,WD_SAM.s,Object.assign({t},o.p||{}));}
function wd_jun(ctx,t,o){o=o||{};dp_person(ctx,"jun",o.x||WD_JUN.x,o.y||WD_JUN.y,o.s||WD_JUN.s,Object.assign({t,light:o.light||"glass"},o.p||{}));}
function wd_warren(ctx,t,o){o=o||{};dp_person(ctx,WD_WARREN,WD_W.x,WD_W.y,WD_W.s,Object.assign({t,light:"lamp",cut:WD_W.cut},o.p||{}));}

/* ---------------------------------------------------------------- pieces the scenes share */
// the security review's card: its three questions (q[i] each one's opacity) and, at the end, each one's answer (ans[i])
const WD_QS=["Who signed in, and from where?","Who switched on admin power, and what did they do with it?","What changed production, and who approved it?"];
const WD_AS=["One was wrong: a copied session, stopped in 12 minutes","Switched on 23 times, each with a reason, an approval and a record","11 changes, each reviewed; each release approved by Noor Rahman"];
function wd_review(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const q=o.q||[1,1,1],an=o.ans||[0,0,0],inner=w-150;
  const ql=WD_QS.map(s=>ag_wrap(ctx,s,inner,{w:700,size:30})),al=WD_AS.map(s=>ag_wrap(ctx,s,inner,{w:600,size:28}));
  let h=150;ql.forEach((l,i)=>{h+=l.length*40+(an[i]>0||o.room?al[i].length*38+8:0)+30;});h=Math.max(h,o.minH||0);
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.9,1,o.k));dp_panel(ctx,x,y,w,h,{col:"cyan",r:24,glowR:40});
  dp_T(ctx,"SECURITY REVIEW",x+36,y+56,{w:800,size:28,ls:4,col:"cyan"});dp_T(ctx,o.title||"The last 90 days",x+36,y+106,{w:700,size:40});
  let yy=y+170;ql.forEach((lines,i)=>{ctx.save();ctx.globalAlpha*=q[i];ctx.fillStyle=rgba(DP.F.cyan,1);ctx.beginPath();ctx.arc(x+58,yy-10,20,0,TAU);ctx.fill();
      dp_T(ctx,String(i+1),x+58,yy,{w:800,size:28,align:"center",col:DP.on});dp_lines(ctx,lines,x+100,yy,40,{w:700,size:30});ctx.restore();yy+=lines.length*40;
    if(an[i]>0||o.room){ctx.save();ctx.globalAlpha*=an[i];dp_lines(ctx,al[i],x+100,yy+4,38,{w:600,size:28,col:"green"});ctx.restore();yy+=al[i].length*38+8;}
    yy+=30;});
  ctx.restore();return{x,y,w,h};}
// a speech card: someone's words in quotes, who said them over them
function wd_said(ctx,x,y,who,words,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;dp_card(ctx,x,y,o.w||560,{kick:who,title:"“"+words+"”"},{col:o.col||"cyan",a,k:o.k});}
// a laptop on a table, shut (open 0) or open (1), its screen lit when open
function wd_laptop(ctx,x,y,s,open,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle="rgba(0,0,0,0.35)";ctx.beginPath();ctx.ellipse(0,6,190,16,0,0,TAU);ctx.fill();
  const g=ctx.createLinearGradient(0,-18,0,4);g.addColorStop(0,"rgb(120,128,130)");g.addColorStop(1,"rgb(64,70,72)");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-170,0);ctx.lineTo(170,0);ctx.lineTo(150,-16);ctx.lineTo(-150,-16);ctx.closePath();ctx.fill();
  if(open>0){const u=ag_sine(open),hh=230*u;ctx.fillStyle="rgb(40,46,48)";ctx.beginPath();ctx.moveTo(-150,-16);ctx.lineTo(150,-16);ctx.lineTo(150-6*u,-16-hh);ctx.lineTo(-150+6*u,-16-hh);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(mix([20,40,46],[150,220,226],0.5*u),1);ctx.fillRect(-136+6*u,-6-hh+16,272-12*u,hh-26);}
  else{ctx.fillStyle="rgb(96,104,106)";ctx.fillRect(-150,-22,300,6);ctx.fillStyle="rgba(226,236,236,0.35)";ctx.fillRect(-150,-22,300,1.4);}
  ctx.restore();}
// a lamp on a table, its warm shade lit
function wd_lamp(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="rgb(34,30,26)";ctx.fillRect(-6,-150,12,150);ctx.fillRect(-46,-8,92,10);
  ctx.fillStyle="rgb(232,196,140)";ctx.beginPath();ctx.moveTo(-50,-150);ctx.lineTo(50,-150);ctx.lineTo(80,-80);ctx.lineTo(-80,-80);ctx.closePath();ctx.fill();
  ctx.save();ctx.globalCompositeOperation="lighter";const g=ctx.createRadialGradient(0,-90,0,0,-90,260);g.addColorStop(0,"rgba(255,214,160,0.35)");g.addColorStop(1,"rgba(255,214,160,0)");ctx.fillStyle=g;ctx.fillRect(-260,-350,520,520);ctx.restore();ctx.restore();}
// the four records, side by side: each a tool's mark and name, what it keeps, and a band of how long against a ruler of 90 days
const WD_RECS=[{tool:"databricks",name:"Databricks",what:"Audit table · system.access.audit",days:365},{tool:"github",name:"GitHub",what:"Audit log",days:180,sub:{what:"Who pushed or copied code",days:7}},
  {tool:"entra",name:"Microsoft Entra ID",what:"Sign-ins and switch-ons",days:30,gone:"Already gone · questions 1 and 2"},{tool:"storage",name:"Azure Storage",what:"Storage log",days:0}];
function wd_chart(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const row=o.row||[1,1,1,1],gone=o.gone||0,h=740,X0=x+760,DX=(w-800)/90;
  ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,h,{col:"cyan",r:24,glowR:40});
  dp_T(ctx,"FOUR RECORDS",x+36,y+56,{w:800,size:28,ls:4,col:"cyan"});dp_T(ctx,"How long each one keeps",x+36,y+106,{w:700,size:40});
  // the ruler: today on the left, 90 days back on the right
  const ry=y+170;ctx.fillStyle=rgba(DP.T.mut,0.6);ctx.fillRect(X0,ry,90*DX,2);for(const d of [0,30,60,90]){ctx.fillRect(X0+d*DX-1,ry-10,2,20);
    dp_T(ctx,d===0?"Today":d===90?"90 days ago":d+" days",X0+d*DX,ry-22,{w:600,size:28,col:"mut",align:d===0?"left":d===90?"right":"center"});}
  WD_RECS.forEach((r,i)=>{const ra=row[i];if(ra<=0)return;const yy=y+230+i*124;ctx.save();ctx.globalAlpha*=ra;
    wd_tool(ctx,x+36,yy+34,r.tool,r.name,{h:34,size:30});dp_T(ctx,r.what,x+36,yy+76,{w:600,size:28,col:"mut",f:r.what.indexOf("system.")>=0?undefined:undefined});
    const bw=ag_sine(clamp(ra*1.2-0.2,0,1)),by=yy+16;
    if(r.days>0){const end=Math.min(r.days,90),L=end*DX*bw;ctx.save();ctx.shadowColor=rgba(DP.F.cyan,0.6);ctx.shadowBlur=10;ctx.fillStyle=rgba(DP.F.cyan,0.9);rr(ctx,X0,by,Math.max(8,L),30,8);ctx.fill();ctx.restore();
      dp_T(ctx,r.days+" days",X0+12,by+25,{w:800,size:28,col:DP.on});
      if(r.days>90&&bw>0.98){ctx.fillStyle=rgba(DP.F.cyan,0.9);ctx.beginPath();ctx.moveTo(X0+90*DX+4,by-4);ctx.lineTo(X0+90*DX+26,by+15);ctx.lineTo(X0+90*DX+4,by+34);ctx.closePath();ctx.fill();}
      if(r.days<90&&r.gone&&gone>0){const gx=X0+r.days*DX,gw=(90-r.days)*DX*ag_sine(gone);ctx.save();ctx.strokeStyle=rgba(DP.F.coral,1);ctx.setLineDash([10,8]);ctx.lineWidth=2.4;rr(ctx,gx+4,by,Math.max(8,gw-4),30,8);ctx.stroke();ctx.restore();
        withA(ctx,ag_in(gone,0.4,0.5),()=>dp_T(ctx,r.gone||"Already gone",gx+(90-r.days)*DX/2,by+24,{w:700,size:28,col:"coral",align:"center"}));}
      if(r.sub){const sy=by+52,sL=r.sub.days*DX*bw;ctx.fillStyle=rgba(DP.F.cyan,0.55);rr(ctx,X0,sy,Math.max(8,sL),14,6);ctx.fill();
        dp_T(ctx,r.sub.what+": "+r.sub.days+" days",X0,sy+48,{w:600,size:28,col:"mut"});}}
    else{ctx.save();ctx.strokeStyle=rgba(DP.F.grey,0.9);ctx.setLineDash([10,8]);ctx.lineWidth=2.4;rr(ctx,X0,by,90*DX*bw,30,8);ctx.stroke();ctx.restore();
      dp_T(ctx,"Only where someone has asked for it",X0+16,by+25,{w:700,size:28,col:"grey"});}
    ctx.restore();});
  ctx.restore();}
// a stream of the record from (x0, y0) to (x1, y1): a line of light and small rows running along it (on 0 to 1, flow its speed)
function wd_stream(ctx,x0,y0,x1,y1,t,o){o=o||{};const on=o.on==null?1:o.on,a=o.a==null?1:o.a;if(a<=0||on<=0)return;const c=dp_f(o.col||"cyan"),p=o.p==null?1:o.p;ctx.save();ctx.globalAlpha*=a;
  const cx=(x0+x1)/2,pt=u=>{const m=1-u;return[m*m*m*x0+3*m*m*u*cx+3*m*u*u*cx+u*u*u*x1,m*m*m*y0+3*m*m*u*y0+3*m*u*u*y1+u*u*u*y1];};
  ctx.strokeStyle=rgba(c,0.35*on);ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<=40;k++){const q=pt(k/40*p);k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();
  const n=6;for(let i=0;i<n;i++){const u=((t*(o.flow||0.22)+i/n)%1);if(u>p)continue;const q=pt(u),fa=Math.min(1,u*6,(1-u)*6)*on;ctx.save();ctx.globalAlpha*=fa;ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=10;
    ctx.fillStyle=rgba(mix(c,[255,255,255],0.4),1);rr(ctx,q[0]-14,q[1]-4,28,8,4);ctx.fill();ctx.restore();}
  ctx.restore();}
// a magnifier over the record, and its words: every search is recorded
function wd_lens(ctx,x,y,r,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const c=DP.F.cyan;ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=14;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.4),1);ctx.lineWidth=5;
  ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();ctx.lineWidth=10;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+r*0.72,y+r*0.72);ctx.lineTo(x+r*1.4,y+r*1.4);ctx.stroke();ctx.restore();}
// small green ticks where coral question marks were: n of them at pts, u turning them (0 all question marks, 1 all ticks)
function wd_turn(ctx,pts,u,t0,t,o){o=o||{};pts.forEach((p,i)=>{const k=clamp(u*pts.length-i,0,1);if(k<1)wd_qmark(ctx,p[0],p[1],o.r||40,1,(1-k)*(o.a==null?1:o.a));if(k>0)dp_tick(ctx,p[0],p[1],"green",k);});}

// the browser add-on, on a card of glass: its piece of a puzzle, its name, and a line (o.sub) under it; o.col its colour
function wd_addonCard(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const col=o.col||"cyan";ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,170,{col,r:22,glowR:30,behind:o.behind});wd_addon(ctx,x+86,y+96,0.62,{col});
  dp_T(ctx,"BROWSER ADD-ON",x+170,y+56,{w:800,size:28,ls:4,col});dp_T(ctx,"Tab Tidy",x+170,y+102,{w:700,size:36});dp_T(ctx,o.sub||"",x+170,y+142,{w:600,size:28,col:col==="coral"?"coral":"mut"});
  ctx.restore();}
// a clean laptop, on a card of glass: the laptop open, its screen lit, and the words under it
function wd_laptopCard(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+200,y+130,lerp(0.94,1,o.k));
  dp_panel(ctx,x,y,400,260,{col:"green",r:22,glowR:30,behind:o.behind});wd_laptop(ctx,x+200,y+176,0.62,1);
  dp_T(ctx,"A clean laptop",x+200,y+232,{w:700,size:30,align:"center",col:"green"});ctx.restore();}
// an emergency account's card: amber, its number; its lines come in (o.b) as the voice says them, and a switch always on (o.on)
function wd_eaCard(ctx,x,y,w,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+75,lerp(0.94,1,o.k));
  dp_panel(ctx,x,y,w,150,{col:"amber",r:22,glowR:30});dp_T(ctx,"EMERGENCY ACCOUNT "+n,x+30,y+48,{w:800,size:28,ls:4,col:"amber"});
  const b=o.b==null?1:o.b;if(b>0){ctx.save();ctx.globalAlpha*=b;dp_T(ctx,"Belongs to no one",x+30,y+96,{w:700,size:34});dp_T(ctx,"Its power always on",x+30,y+132,{w:600,size:28,col:"mut"});ctx.restore();}
  dp_switch(ctx,x+w-112,y+56,1,{col:"amber",a:o.on==null?1:o.on});ctx.restore();}
// a security key: a small dark body, its gold contacts at one end, a ring at the other, and a touch button that glows (o.glow)
function wd_secKey(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);const gl=o.glow||0;
  if(gl>0)dp_halo(ctx,0,0,70,"green",0.5*gl);
  ctx.fillStyle="rgb(36,40,44)";rr(ctx,-46,-18,92,36,10);ctx.fill();ctx.strokeStyle="rgba(214,236,236,0.45)";ctx.lineWidth=1.4;rr(ctx,-46,-18,92,36,10);ctx.stroke();
  ctx.fillStyle="rgb(214,178,92)";rr(ctx,-66,-11,22,22,3);ctx.fill();ctx.fillStyle="rgba(120,90,30,0.8)";for(let k=0;k<3;k++)ctx.fillRect(-62,-7+k*6,14,2);
  ctx.strokeStyle="rgba(214,236,236,0.6)";ctx.lineWidth=3;ctx.beginPath();ctx.arc(34,0,8,0,TAU);ctx.stroke();
  ctx.fillStyle=gl>0?rgba(mix(DP.F.green,[255,255,255],0.3),0.6+0.4*gl):"rgb(70,110,112)";ctx.beginPath();ctx.arc(2,0,9,0,TAU);ctx.fill();ctx.restore();}
// the recorder in a plane's tail, lit through the skin: a small bright box and its glow (a its light)
function wd_tailBox(ctx,x,y,a){if(!(a>0))return;dp_halo(ctx,x,y,120,"cyan",0.45*a);ctx.save();ctx.globalAlpha*=a;ctx.shadowColor=rgba(DP.F.cyan,1);ctx.shadowBlur=16;
  ctx.fillStyle=rgba(mix(DP.F.cyan,[255,255,255],0.5),0.95);rr(ctx,x-26,y-16,52,32,6);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- 1 · A box that survives */
scene("box",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({chem:wAt(sc,"warren","chemist"),tanks:wAt(sc,"warren","fuel tanks"),comets:wAt(sc,"asked","two Comets"),first:wAt(sc,"asked","first jet"),
    crashed:wAt(sc,"asked","have crashed"),sea:wAt(sc,"more","over the sea"),noone:wAt(sc,"more","no one on board"),crew:wAt(sc,"left","what the crew"),
    fly:wAt(sc,"again","fly again"),full:wAt(sc,"again","full of passengers"),fail:wAt(sc,"again","fail the same way")}));
  const comet=(x,tt)=>{const u=clamp((tt-P.comets+0.4)/9,0,1);x.save();x.beginPath();x.rect(1334,114,452,532);x.clip();wd_comet(x,lerp(1700,1310,u),lerp(392,374,u),0.3,{lit:0.85,lights:1});x.restore();};
  ag_shots(ctx,S,t,sc.dur,[
    // Melbourne, 1953: Warren at the bench, a fuel tank cut open on it; then the window, where a Comet crosses the night
    {at:0,place:"wdLab",keys:[[0,940,560,1.08],[P.comets-0.6,1060,470,1.16]],d:2.6,push:0.015,draw:(x,tt,cam)=>{
      if(tt>P.comets-1)comet(x,tt);wd_warren(x,tt);
      wd_corner(x,cam,"Melbourne · 1953",ag_in(tt,0.8,0.6));
      dp_card(x,1420,380,330,{kick:"The tank",title:"Fuel tanks",sub:"what Warren knows"},{col:"cyan",a:ag_io(tt,P.tanks,P.comets-0.6),k:ag_spr(tt,P.tanks)});
      wd_name(x,470,772,"David Warren","Chemist",ag_in(tt,P.chem-0.3,0.5)*(1-ag_in(tt,P.comets-0.8,0.5)));
      dp_card(x,1345,128,430,{kick:"1953",title:"The Comet",sub:"the first jet airliner"},{col:"cyan",a:ag_in(tt,P.first-0.2,0.5),k:ag_spr(tt,P.first-0.2)});
      dp_slip(x,1560,452,"Two have crashed: why?","coral",{align:"center",a:ag_in(tt,P.crashed,0.5)});}},
    // 1954, over the sea: a plane's light high up, then only the calm sea
    {at:c.more-0.3,place:"wdSea",keys:[[c.more-0.3,960,540,1.0]],push:0.03,draw:(x,tt,cam)=>{
      const u=clamp((tt-c.more+0.3)/7,0,1),la=1-ag_in(tt,P.noone-0.6,1.2);if(la>0){const px=lerp(180,900,u),py=lerp(260,226,u);wd_comet(x,px,py,0.24,{lit:0.8,lights:1,dusk:0.5,a:la});}
      wd_corner(x,cam,"Over the sea · 1954",ag_in(tt,c.more,0.6));
      dp_card(x,560,380,800,{kick:"1954",title:"Two more Comets lost",sub:"No one on board survives"},{col:"coral",a:ag_in(tt,P.noone,0.6),k:ag_spr(tt,P.noone)});}},
    // the investigators' table: twisted panels, and questions no one can answer
    {at:c.left-0.3,place:"wdTable",keys:[[c.left-0.3,960,560,1.04]],push:0.03,draw:(x,tt,cam)=>{
      dp_card(x,600,96,720,{title:"What did the crew see or hear?"},{col:"coral",a:ag_in(tt,P.crew,0.6),k:ag_spr(tt,P.crew)});
      [[700,470,c.left+0.6],[1240,430,c.left+1.0],[980,400,c.left+1.4],[520,560,c.guess+0.2],[1430,560,c.guess+0.4],[860,330,c.guess+0.6],[1120,320,c.guess+0.8]].forEach(([qx,qy,q0],i)=>{
        const bob=Math.sin(tt*1.4+i)*4;wd_qmark(x,qx,qy+bob,40,ag_spr(tt,q0),1);});}},
    // the planes fly again: an airport at dusk, passengers walking up the steps, the cabin's windows lighting one by one
    {at:c.again-0.3,place:"wdApron",keys:[[c.again-0.3,960,560,1.0]],push:0.03,draw:(x,tt,cam)=>{const u=tt-c.again;
      wd_comet(x,250,560,1.7,{lit:0.9,n:Math.floor(clamp((tt-P.full+0.6)*4,0,19)),gear:1,dusk:0.7,door:1});wd_stair(x,420,752,476,600,1);
      [[640,0],[760,1],[880,2],[1010,3]].forEach(([x0,i])=>{const walk=Math.max(0,u-i*0.25)*46,px=x0-walk;if(px<470){const up=clamp((470-px)/120,0,1);
          wd_walker(x,lerp(470,436,up),lerp(762,690,up)+i*0,108,u*6+i,{flip:1,hat:i%2===0,bag:i%2,a:1-ag_in(up,0.8,0.2)});}else wd_walker(x,px,762+i*3,108,u*6+i,{flip:1,hat:i%2===0,bag:i%2});});
      wd_qmark(x,1180,330,40,ag_spr(tt,P.fail),1);
      wd_corner(x,cam,"An airport · 1954",ag_in(tt,c.again,0.6));}}
  ]);});

/* ---------------------------------------------------------------- 2 · Kept where no crash can reach */
scene("tail",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({box:wAt(sc,"box","A small box"),over:wAt(sc,"box","over and over"),kept:wAt(sc,"box","always kept"),
    tail:wAt(sc,"sits","in the tail"),boss:wAt(sc,"spy","his boss"),y58:wAt(sc,"keeps","By"),four:wAt(sc,"keeps","four hours"),
    oneMore:wAt(sc,"first","one more crash"),aus:wAt(sc,"first","Australia is the first"),hear:wAt(sc,"lost","investigators can hear"),fix:wAt(sc,"lost","fix it on every"),
    rec:wAt(sc,"platform","a recorder"),guess:wAt(sc,"without","only guess"),open:wAt(sc,"without","stays open"),see:wAt(sc,"with","see who did what"),close:wAt(sc,"with","close the way in"),
    show:wAt(sc,"with","show what didn't happen")}));
  const QP=[[740,250],[1060,210],[900,140],[640,420],[1160,380]];
  ag_shots(ctx,S,t,sc.dur,[
    // Melbourne, 1954: Warren's note, by its own title; then the box it proposes, a loop of wire that keeps the last hours over and over
    {at:0,place:"wdLab",keys:[[0,960,520,1.08],[P.box-0.4,1000,500,1.12]],d:2.2,push:0.015,draw:(x,tt,cam)=>{wd_warren(x,tt);
      wd_corner(x,cam,"Melbourne · 1954",ag_in(tt,0.4,0.6));
      wd_benchNote(x,640,736,clamp((tt-0.8)/3.2,0,1),ag_in(tt,0.4,0.8));
      dp_card(x,1320,130,440,{kick:"April 1954",title:"A Device for Assisting Investigation into Aircraft Accidents"},{col:"cyan",a:ag_in(tt,0.9,0.6)*(1-ag_in(tt,P.box-0.6,0.5)),k:ag_spr(tt,0.9)});
      const ia=ag_in(tt,P.box,0.6);if(ia>0){x.save();x.globalAlpha*=ia;ag_about(x,1540,330,lerp(0.94,1,ag_spr(tt,P.box)));dp_panel(x,1320,130,440,420,{col:"cyan",r:24,glowR:40});
        dp_T(x,"THE IDEA",1356,186,{w:800,size:28,ls:4,col:"cyan"});wd_recorder(x,1540,310,0.7,tt,{glow:ag_in(tt,P.kept,0.8)});
        const oa=ag_in(tt,P.over,0.6);if(oa>0){dp_T(x,"Keeps the last hours,",1356,456,{w:700,size:30,a:oa});dp_T(x,"over and over",1356,498,{w:700,size:30,a:oa});}x.restore();}}},
    // in the tail, where a crash is least likely to reach; the pilots' fear, and his boss's doubt
    {at:c.sits-0.3,place:"wdHigh",keys:[[c.sits-0.3,960,540,1.0]],push:0.03,draw:(x,tt,cam)=>{const drift=(tt-c.sits)*6;
      wd_comet(x,150-drift,560,1.5,{lit:0.7,lights:1});
      const gx=150-drift+890*1.5,gy=560-12*1.5,gl=ag_in(tt,P.tail,0.8);wd_tailBox(x,gx,gy,gl);
      dp_tag(x,860,150,"Where a crash is least likely to reach","cyan",{a:ag_in(tt,P.tail+0.2,0.6)*(1-ag_in(tt,c.spy,0.5)),to:[gx,gy-18],p:clamp((tt-P.tail-0.4)/0.6,0,1),behind:"wdHigh"});
      // their own words, as Warren told them (IEEE Spectrum, 2021); the voice says them in short
      wd_said(x,140,150,"Pilots","A spy flying alongside",{a:ag_in(tt,c.spy+0.2,0.5),k:ag_spr(tt,c.spy+0.2),w:560});
      wd_said(x,740,150,"His boss","Get on with blowing up fuel tanks",{a:ag_in(tt,P.boss,0.5),k:ag_spr(tt,P.boss),w:760});}},
    // 1958: the box, finished
    {at:c.keeps-0.3,place:"wdLab",keys:[[c.keeps-0.3,960,520,1.1]],push:0.02,draw:(x,tt,cam)=>{wd_warren(x,tt);
      wd_corner(x,cam,"Melbourne · 1958",ag_in(tt,c.keeps,0.6));
      wd_recorder(x,812,668,0.62,tt,{a:ag_in(tt,c.keeps,0.6)});
      dp_card(x,1320,140,440,{kick:"1958",title:"Four hours",sub:"of voices and the instruments' readings"},{col:"cyan",a:ag_in(tt,P.four,0.6),k:ag_spr(tt,P.four)});}},
    // Queensland, 1960: one more crash no one can explain; then the rule, the first in the world
    {at:c.first-0.3,place:"wdCoast",keys:[[c.first-0.3,960,540,1.0]],push:0.03,draw:(x,tt,cam)=>{
      wd_corner(x,cam,"Queensland · 1960",ag_in(tt,c.first,0.6));
      dp_card(x,600,200,720,{kick:"1960",title:"29 lives lost",sub:"The cause is never found"},{col:"coral",a:ag_in(tt,P.oneMore,0.6)*(1-ag_in(tt,P.aus-0.3,0.5)),k:ag_spr(tt,P.oneMore)});
      dp_card(x,560,200,800,{kick:"Australia · 1963",title:"The first country to require recorders",sub:"on its airliners"},{col:"green",a:ag_in(tt,P.aus,0.6),k:ag_spr(tt,P.aus)});}},
    // the investigators hear the last minutes; the cause is found and fixed on every other plane
    {at:c.lost-0.3,place:"wdTable",keys:[[c.lost-0.3,960,600,1.06]],push:0.02,draw:(x,tt,cam)=>{
      wd_recorder(x,1060,640,0.55,tt,{glow:ag_in(tt,P.hear,0.8)});wd_phones(x,760,650,1.0,1);
      const wa=ag_in(tt,P.hear,0.6);if(wa>0){x.save();x.globalAlpha*=wa;x.strokeStyle=rgba(DP.ice,0.8);x.lineWidth=2.4;x.beginPath();for(let k=0;k<=80;k++){const xx=860+k*5,amp=18*Math.sin(k*0.5+tt*6)*Math.sin(k*0.07+tt);x.lineTo(xx,470+amp);}x.stroke();x.restore();}
      dp_slip(x,960,150,"Its last minutes, heard","cyan",{align:"center",a:ag_in(tt,P.hear,0.6)});}},
    {at:P.fix-0.3,place:"wdDawn",keys:[[P.fix-0.3,960,540,1.0]],push:0.03,draw:(x,tt,cam)=>{
      [[150,330,0.62,0],[700,470,0.5,0.5],[1150,300,0.42,1.0]].forEach(([px,py,s,k])=>{const dx=(tt-P.fix)*14;wd_comet(x,px+dx,py,s,{lit:0.4,lights:1,dusk:0.2});
        dp_tick(x,px+dx+990*s,py-150*s,"green",clamp((tt-P.fix-0.6-k)/0.6,0,1));});}},
    // a data platform needs a recorder too: the platform in the hall, its record a strip of light beneath it; without one, questions; with one, ticks
    {at:c.platform-0.3,place:"wdHall",keys:[[c.platform-0.3,960,520,1.08]],push:0.02,draw:(x,tt,cam)=>{
      const rec=ag_in(tt,P.rec,0.8)*(1-ag_in(tt,c.without,0.5))+ag_in(tt,P.see-0.2,0.6);wd_platform(x,960,720,420,560,{t:tt,rec,door:1});
      dp_slip(x,960,790,"The platform's record","cyan",{align:"center",a:ag_in(tt,P.rec+0.2,0.6)*(1-ag_in(tt,c.without,0.4))});
      const out=1-ag_in(tt,c.breath-0.6,0.6);
      wd_turn(x,QP,clamp((tt-P.see)/2.0,0,1),0,tt,{a:ag_in(tt,P.guess-0.4,0.5)*out,r:38});
      dp_pill(x,960,560,"The way in stays open","coral",{align:"center",a:ag_in(tt,P.open,0.5)*(1-ag_in(tt,P.close,0.5))});
      dp_pill(x,960,560,"The way in, closed","green",{align:"center",a:ag_in(tt,P.close+0.2,0.5)*out});}}
  ]);
  dp_title(ctx,S,t,c.breath,"Who did what","If you can't see it, you can't say it's protected.","FILM 9 OF 9 · LOCKS BEFORE THE DATA");});

/* ---------------------------------------------------------------- 3 · Three questions, four memories */
scene("questions",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({locks:[wAt(sc,"locked","sign-ins"),wAt(sc,"locked","doors"),wAt(sc,"locked","power"),wAt(sc,"locked","changes")],
    review:wAt(sc,"review","security review"),held:wAt(sc,"review","they held"),table:wAt(sc,"table","audit table"),gh:wAt(sc,"github","GitHub's"),week:wAt(sc,"github","only a week"),
    dir:wAt(sc,"directory","The directory"),sto:wAt(sc,"storage","the storage"),gone:wAt(sc,"gone","already gone")}));
  const L=["Sign-ins","Doors","Power","Changes"];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",later:true,keys:[[0,960,540,1.0]],push:0.02,draw:(x,tt)=>{wd_sam(x,tt);wd_name(x,300,170,"Sam Okafor","Runs the platform",ag_in(tt,0.6,0.6));
      wd_platform(x,860,740,360,560,{t:tt});
      L.forEach((s,i)=>{const a=ag_in(tt,P.locks[i],0.4);if(a<=0)return;const yy=240+i*84;x.save();x.globalAlpha*=a;dp_panel(x,720,yy,280,66,{col:"cyan",r:16,glowR:16});dp_lock(x,758,yy+36,34,"cyan",0);dp_T(x,s,792,yy+44,{w:700,size:30});x.restore();});
      wd_review(x,1150,150,700,{a:ag_in(tt,P.review,0.6),k:ag_spr(tt,P.review),q:[ag_in(tt,c.signed,0.5),ag_in(tt,c.power,0.5),ag_in(tt,c.changed,0.5)]});}},
    {at:c.four-0.2,place:"wdHall",later:true,keys:[[c.four-0.2,960,520,1.0]],push:0.015,draw:(x,tt)=>{
      wd_chart(x,110,110,1700,{row:[ag_in(tt,P.table-0.2,1.0),ag_in(tt,P.gh-0.2,1.0),ag_in(tt,P.dir-0.2,1.0),ag_in(tt,P.sto-0.2,1.0)],gone:clamp((tt-P.gone+0.3)/0.9,0,1)});}}
  ]);});

/* ---------------------------------------------------------------- 4 · One record, out of reach */
scene("store",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({store:wAt(sc,"sent","one store apart"),team:wAt(sc,"sent","security team"),year:wAt(sc,"locked","for a year"),admin:wAt(sc,"locked","not even an admin"),
    off:wAt(sc,"off","Switching a record off"),quiet:wAt(sc,"off","goes quiet"),told:wAt(sc,"off","someone is told"),own:wAt(sc,"names","their own name"),agents:wAt(sc,"names","agents too"),book:wAt(sc,"names","AI agents"),
    few:wAt(sc,"people","read by few"),reason:wAt(sc,"people","for a reason"),search:wAt(sc,"people","every search")}));
  const SX=1070,SY=130,SW=790,SH=700,src=[[90,210],[90,350],[90,490],[90,630]],WX=340;
  // what the store keeps, a row as each thing is done: three as the records are sent, one when a record is switched off, and the agent's
  // when the voice names agents; each names who did it on a cyan chip, at the same place in every row (WX)
  const ROWS=[{time:"09:12",tool:"entra",what:"Sign-in",who:"Sam Okafor",at:P.store+0.5},{time:"09:14",tool:"databricks",what:"Load",who:"registrar-loader",at:P.store+1.3},
    {time:"09:15",tool:"github",what:"Push",who:"Jun Park",at:P.team+0.3},{time:"09:40",tool:"storage",what:"Record off",who:"Sam Okafor",col:"coral",at:P.off+0.7},
    {time:"09:52",tool:"databricks",what:"Read",who:"project check agent",agent:true,at:P.agents-0.2}];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",later:true,keys:[[0,960,540,1.0]],push:0.012,draw:(x,tt)=>{
      // the four records on the left, each streaming to the store as it's written; the storage's switched off for a moment, the directory's gone quiet
      WD_RECS.forEach((r,i)=>{const [rx,ry]=src[i],a=ag_in(tt,0.2+i*0.25,0.5);x.save();x.globalAlpha*=a;dp_panel(x,rx,ry,470,92,{col:"cyan",r:18,glowR:18});wd_tool(x,rx+26,ry+60,r.tool,r.name,{h:34,size:30});x.restore();
        const swOff=i===3?ag_io(tt,P.off,P.off+2.8,0.3):0,quiet=i===2?ag_io(tt,P.quiet,P.quiet+2.6,0.6):0;
        wd_stream(x,rx+470,ry+46,SX,SY+170+i*90,tt+i*0.7,{on:(1-swOff)*(1-quiet),p:ag_sine((tt-0.6-i*0.2)/1.6),flow:0.28});
        if(i===3)dp_switch(x,rx+372,ry+26,1-swOff,{col:"green",a:ag_in(tt,P.off-0.7,0.4)*(1-ag_in(tt,P.off+4.2,0.5))});});
      wd_bell(x,800,50,44,tt,{ring:tt>P.quiet?P.quiet+0.2:P.off+0.3,a:ag_io(tt,P.off-0.2,c.names-0.5,0.4)});
      dp_slip(x,800,128,tt<P.quiet?"Switched off: recorded":"Gone quiet: someone is told","amber",{align:"center",a:ag_io(tt,P.off+0.4,c.names-0.5,0.4)});
      // the store, apart: its rows, its locked copy, and the coral rim on the side that faces the platform team
      wd_store(x,SX,SY,SW,SH,{a:ag_in(tt,P.store-0.3,0.6),lock:clamp((tt-P.year+0.4)/0.8,0,1),rim:clamp((tt-P.admin)/0.8,0,1),draw:(cx,b)=>{
        ROWS.forEach((r,i)=>{const ya=ag_in(tt,r.at,0.5);if(ya<=0)return;const yy=b.y+i*76;
          wd_rec(cx,b.x,yy,b.w,{time:r.time,tool:r.tool,what:r.what,who:r.who,col:r.col,whoX:r.agent?WX+44:WX},{a:ya,k:ag_spr(tt,r.at)});
          if(r.agent){cx.save();cx.globalAlpha*=ya;dp_sphereIcon(cx,b.x+WX+18,yy+32,17,tt);cx.restore();}
          // each name lights in turn as the voice says everyone is in it under their own name
          const pulse=Math.max(0,1-Math.abs(tt-(P.own+i*0.3))/0.7);if(pulse>0){const pw=dp_tw(cx,r.who,{w:700,size:28})+36,px=b.x+(r.agent?WX+44:WX);dp_halo(cx,px+pw/2,yy+32,pw*0.75,"cyan",0.32*pulse);}});
        dp_T(cx,"AI agents in data work",b.x+WX+44,b.y+4*76+104,{w:700,size:28,col:"cyan",a:ag_in(tt,P.book,0.5)});}});
      dp_pill(x,SX+SW/2,100,"No change · no delete","coral",{align:"center",a:ag_in(tt,P.admin+0.2,0.5)*(1-ag_in(tt,c.off-0.2,0.5))});
      // kept like personal data: a lens over the store, read by few, for a reason, and every search recorded
      wd_lens(x,1740,404,58,ag_in(tt,P.few,0.6));
      dp_slip(x,800,40,"Read by few, for a reason","cyan",{align:"center",a:ag_in(tt,P.reason,0.5)});
      dp_slip(x,800,124,"Every search recorded","cyan",{align:"center",a:ag_in(tt,P.search,0.5)});}},
    // Warren's pilots feared a spy in the cockpit; the record is read to find out what happened
    {at:c.pilots-0.3,place:"wdHigh",keys:[[c.pilots-0.3,960,540,1.0]],push:0.03,draw:(x,tt,cam)=>{const drift=(tt-c.pilots)*6;wd_comet(x,150-drift,560,1.5,{lit:0.7,lights:1});
      wd_tailBox(x,150-drift+890*1.5,560-12*1.5,1);
      wd_said(x,140,150,"Pilots","A spy flying alongside",{a:ag_in(tt,c.pilots+0.2,0.5)*(1-ag_in(tt,c.read-0.2,0.5)),w:560});
      dp_card(x,560,140,800,{title:"Read to find out what happened",sub:"not to watch the people in it"},{col:"cyan",a:ag_in(tt,c.read+0.2,0.6),k:ag_spr(tt,c.read+0.2)});}}
  ]);});

/* ---------------------------------------------------------------- 5 · A bell for great power */
scene("bell",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({bell:wAt(sc,"bells","ring a bell"),ans:wAt(sc,"bells","always answers"),wrong:wAt(sc,"morning","gone wrong"),back:wAt(sc,"morning","put the learner"),
    hour:wAt(sc,"switches","for an hour"),reason:wAt(sc,"switches","with a reason"),appr:wAt(sc,"switches","Sam approves"),known:wAt(sc,"alert","known task"),
    on:wAt(sc,"rest","the switch-on"),restore:wAt(sc,"rest","the restore"),offR:wAt(sc,"rest","the switch-off"),risky:wAt(sc,"others","risky sign-in"),emerg:wAt(sc,"others","emergency account"),
    quiet:wAt(sc,"others","gone quiet")}));
  const bells=[[480,"Power switched on","Platform team",P.bell],[880,"A risky sign-in","Security on-call",P.risky],[1280,"An emergency account","Security and platform",P.emerg],[1680,"A record off or quiet","Security team",P.quiet]];
  ag_shots(ctx,S,t,sc.dur,[
    // the first bell, for power
    {at:0,place:"wdHallMorning",later:true,keys:[[0,960,540,1.0]],push:0.015,draw:(x,tt)=>{wd_bell(x,960,250,70,tt,{ring:P.bell+0.1,label:tt>c.first?"Power switched on":"",who:tt>P.ans?"Someone always answers":""});}},
    // one morning, a bad load: Jun switches on his admin account's power to restore the table, for an hour, with a reason; Sam approves
    {at:c.morning-0.3,place:"wdHallMorning",later:true,keys:[[c.morning-0.3,960,540,1.0]],push:0.015,draw:(x,tt)=>{wd_jun(x,tt);wd_name(x,300,170,"Jun Park","Builds the data project",ag_in(tt,c.morning,0.6));
      wd_tbl(x,700,180,380,"learners",{a:ag_in(tt,c.morning+0.3,0.5)*(1-ag_in(tt,c.switches-0.4,0.4)),rows:4});
      dp_slip(x,700,404,"02:00 load: rows loaded twice","coral",{a:ag_in(tt,P.wrong,0.5)*(1-ag_in(tt,c.switches-0.4,0.4))});
      const pa=ag_in(tt,c.switches-0.2,0.6);if(pa>0){const b=dp_page(x,700,120,1150,640,{tool:"pim",name:"Privileged Identity Management",where:"Microsoft Entra ID",title:"Switch on: restore a table",col:"amber",a:pa});
        x.save();x.globalAlpha*=pa;dp_field(x,b.x,b.y+30,"Account","Jun Park (admin)");dp_field(x,b.x+470,b.y+30,"Group","admin_table_restorers",{mono:true});
        dp_field(x,b.x,b.y+150,"For","1 hour",{a:ag_in(tt,P.hour,0.4)});dp_field(x,b.x+470,b.y+150,"Reason","Put learners back after last night's load",{a:ag_in(tt,P.reason,0.4)});
        dp_switch(x,b.x,b.y+270,clamp((tt-P.appr)/0.6,0,1),{col:"amber",label:tt>P.appr?"Switched on":"Waiting for approval"});
        dp_T(x,"Approved by Sam Okafor",b.x+470,b.y+298,{w:700,size:30,col:"green",a:ag_in(tt,P.appr,0.4)});dp_tick(x,b.x+440,b.y+288,"green",clamp((tt-P.appr)/0.6,0,1));x.restore();}}},
    // the platform team's alert, at once; it matches a known task
    {at:c.alert-0.3,place:"wdHallMorning",later:true,keys:[[c.alert-0.3,960,540,1.0]],push:0.015,draw:(x,tt)=>{
      wd_bell(x,420,190,56,tt,{ring:c.alert+0.2,label:"Platform team"});
      dp_card(x,700,170,1060,{kick:"Power switched on · 09:12",title:"Jun Park (admin) · Restore a table · 1 hour"},{col:"amber",a:ag_in(tt,c.alert+0.3,0.5),k:ag_spr(tt,c.alert+0.3)});
      dp_slip(x,700,380,"Matches today's task","green",{a:ag_in(tt,P.known,0.5)});dp_tick(x,1100,415,"green",clamp((tt-P.known-0.2)/0.6,0,1));
      // the record keeps the rest
      const rows=[{time:"09:12",tool:"entra",what:"Switched on: restore a table",who:"approved by Sam Okafor",col:"amber",t0:P.on},{time:"09:20",tool:"databricks",what:"RESTORE TABLE learners",mono:true,who:"Jun Park (admin)",t0:P.restore},
        {time:"09:32",tool:"entra",what:"Switched off",who:"Jun Park (admin)",t0:P.offR}];
      rows.forEach((r,i)=>wd_rec(x,160,520+i*84,1600,Object.assign({a:ag_in(tt,r.t0,0.5)},r),{k:ag_spr(tt,r.t0)}));}},
    // the other bells, each with who answers it; few, so none is ignored
    {at:c.others-0.3,place:"wdHallMorning",later:true,keys:[[c.others-0.3,960,540,1.0]],push:0.015,draw:(x,tt)=>{
      bells.forEach(([bx,lab,who,t0],i)=>wd_bell(x,bx-120,350,54,tt,{ring:i?t0:c.others,a:i?ag_in(tt,t0-0.2,0.4):1,label:lab,who}));
      dp_slip(x,960,660,"Few bells, so none is ignored","cyan",{align:"center",a:ag_in(tt,c.few+0.2,0.5)});}}
  ]);});

/* ---------------------------------------------------------------- 6 · The night a session was copied */
scene("night",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({bell:wAt(sc,"evening","the bell rings"),country:wAt(sc,"session","another country"),never:wAt(sc,"session","never works"),
    shut:wAt(sc,"home","laptop"),hands:wAt(sc,"addon","changed hands"),copied:wAt(sc,"addon","copied his sign-ins"),until:wAt(sc,"whoever","until the session ends"),
    off:wAt(sc,"ends","switches his account off"),dir:wAt(sc,"ends","in the directory"),gh:wAt(sc,"ends","in GitHub"),plat:wAt(sc,"ends","on the platform"),twelve:wAt(sc,"refuse","Twelve minutes"),refused:wAt(sc,"refuse","refuse it")}));
  const panes=[["entra","Microsoft Entra ID","dir"],["github","GitHub","gh"],["databricks","Databricks","plat"]];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHallNight",later:true,keys:[[0,960,540,1.0]],push:0.015,draw:(x,tt)=>{wd_clock(x,80,80,"21:40",{h:21.67});
      wd_bell(x,960,180,62,tt,{ring:P.bell+0.1,label:"A risky sign-in",who:"Security on-call",a:ag_in(tt,P.bell-0.4,0.4)});
      dp_card(x,560,520,800,{kick:"Jun Park's session",title:"In use from another country",sub:"at an hour he never works"},{col:"coral",a:ag_in(tt,P.country-0.2,0.5),k:ag_spr(tt,P.country-0.2)});}},
    // Jun at home: his laptop shut since six; the add-on that changed hands, and the copy of his session it took
    {at:c.home-0.3,place:"wdHome",keys:[[c.home-0.3,960,540,1.0]],push:0.02,draw:(x,tt,cam)=>{wd_lamp(x,1560,700,1);wd_jun(x,tt,{x:640,y:600,light:"lamp",p:{cut:700}});
      wd_laptop(x,1060,712,0.9,0);dp_slip(x,1060,770,"Shut since 18:00","cyan",{align:"center",a:ag_in(tt,P.shut,0.5)});wd_clock(x,80,80,"21:41",{h:21.68});
      const out=1-ag_in(tt,c.whoever-0.4,0.4);
      wd_addonCard(x,1150,110,620,{a:ag_in(tt,c.addon,0.5)*(1-ag_in(tt,P.hands-0.3,0.3))*out,col:"cyan",sub:"Used for a year"});
      wd_addonCard(x,1150,110,620,{a:ag_in(tt,P.hands+0.05,0.35)*out,col:"coral",sub:"Changed hands: a new update"});
      // the copy comes out from under his session and is carried off
      // (its name shows once it's clear of his session's words: under his card, it isn't seen)
      const cu=ag_sine(clamp((tt-P.copied)/2.6,0,1));if(tt>P.copied-0.4){const ca=(1-ag_in(cu,0.75,0.25))*ag_in(tt,P.copied,0.3),la=ag_in(cu,0.28,0.15);
        x.save();x.globalAlpha*=ca;dp_sealed(x,1150+cu*600,330+cu*190,520,"",{behind:"wdHome"});x.restore();
        if(la>0){x.save();x.globalAlpha*=ca*la;dp_sealed(x,1150+cu*600,330+cu*190,520,"A copy",{behind:"wdHome"});x.restore();}
        dp_sealed(x,1150,330,520,"Jun's session",{sub:"GitHub and the platform",a:ag_in(tt,P.copied-0.4,0.5),behind:"wdHome"});}
      dp_card(x,1150,110,620,{title:"Whoever holds it is Jun",sub:"until the session ends"},{col:"coral",a:ag_in(tt,P.until-0.4,0.5),k:ag_spr(tt,P.until-0.4)});}},
    // the first step: end it, everywhere
    {at:c.step-0.3,place:"wdHallNight",later:true,keys:[[c.step-0.3,960,540,1.0]],push:0.015,draw:(x,tt)=>{
      const done=clamp((tt-P.twelve-0.4)/0.6,0,1);wd_steps(x,110,170,560,[done>0?1+done:ag_in(tt,c.step+0.3,0.5),0,0,0,0]);
      const out=1-ag_in(tt,sc.dur-1.7,0.9);
      wd_clock(x,110,80,tt<P.twelve?"21:40":"21:52",{h:tt<P.twelve?21.67:21.87,col:tt<P.twelve?"cyan":"green",a:out});
      panes.forEach(([k,n,cue],i)=>{const yy=180+i*170,pa=ag_in(tt,P.off-0.2+i*0.1,0.5)*out;if(pa<=0)return;x.save();x.globalAlpha*=pa;dp_panel(x,820,yy,980,130,{col:"cyan",r:20,glowR:20});wd_tool(x,856,yy+80,k,n,{h:40,size:34});
        dp_pill(x,1760,yy+80,"Sessions ended","coral",{align:"right",a:ag_in(tt,P[cue],0.4)});x.restore();});
      dp_sealed(x,820,720,560,"The copy of Jun's session",{revoked:clamp((tt-P.refused)/0.8,0,1),a:ag_in(tt,P.off,0.5)*out});}}
  ]);});

/* ---------------------------------------------------------------- 7 · What the record showed */
scene("showed",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({zip:wAt(sc,"download","downloaded"),rule:wAt(sc,"nopush","no change to a rule"),appr:wAt(sc,"nopush","no approval"),
    nodoor:wAt(sc,"platform","no door"),nolearner:wAt(sc,"code","no learner's data"),taken:wAt(sc,"wiped","taken off"),morning:wAt(sc,"wiped","next morning"),clean:wAt(sc,"wiped","clean laptop"),
    know:wAt(sc,"nothing","how they know"),notwho:wAt(sc,"review","not who"),browsers:wAt(sc,"now","browsers take"),gh:wAt(sc,"now","GitHub takes"),first:wAt(sc,"secret","end it first"),did:wAt(sc,"secret","read what it did")}));
  const st=tt=>{const s=[2,ag_in(tt,c.read,0.5),0,0,0];if(tt>P.taken)s[1]=1+clamp((tt-P.taken)/0.6,0,1),s[2]=ag_in(tt,P.taken,0.5);if(tt>P.clean)s[2]=1+clamp((tt-P.clean-0.4)/0.6,0,1);
    if(tt>c.nothing){s[3]={done:clamp((tt-P.know)/0.6,0,1),text:"Nothing to put back"};}if(tt>c.review)s[4]=tt>P.gh+1.2?1+clamp((tt-P.gh-1.2)/0.6,0,1):ag_in(tt,c.review,0.5);return s;};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHallNight",keys:[[0,960,540,1.0]],push:0.01,draw:(x,tt)=>{
      wd_steps(x,110,170,560,st(tt));
      // the morning: a warm light rises in the hall
      const mo=ag_in(tt,P.morning,1.2);if(mo>0){x.save();x.globalCompositeOperation="lighter";const g=x.createRadialGradient(1700,80,0,1700,80,1500);g.addColorStop(0,"rgba(255,226,186,"+(0.10*mo).toFixed(3)+")");g.addColorStop(1,"rgba(255,226,186,0)");x.fillStyle=g;x.fillRect(0,0,W,H);x.restore();}
      // what the copy did, in the one store
      const ra=1-ag_in(tt,P.taken-0.3,0.5);if(ra>0){x.save();x.globalAlpha*=ra;wd_store(x,760,120,1090,700,{title:"Security team's store",draw:(cx,b)=>{
          dp_pill(cx,b.x,b.y+40,"Jun's session · another country","cyan",{size:28});
          wd_rec(cx,b.x,b.y+90,b.w,{time:"21:47",tool:"github",what:"Downloaded uni-example/data-platform as a ZIP file",a:ag_in(tt,P.zip,0.5)});
          [["No push",c.nopush],["No rule changed",P.rule],["No approval",P.appr]].forEach(([s0,t0],i)=>wd_rec(cx,b.x,b.y+174+i*76,b.w,{tool:"github",what:s0,whatCol:"mut",tick:"grey",a:ag_in(tt,t0,0.4)}));
          wd_rec(cx,b.x,b.y+174+3*76,b.w,{tool:"databricks",what:"Nothing: no door on the open internet",whatCol:"mut",tick:"grey",a:ag_in(tt,P.nodoor-0.6,0.4)});
          dp_pill(cx,b.x,b.y+174+4*76+48,"The code: no secret, no learner's data","green",{size:28,a:ag_in(tt,P.nolearner-0.6,0.5)});}});x.restore();}
      // the way in, closed; Jun back at work the next morning on a clean laptop
      const wa=ag_io(tt,P.taken-0.2,c.review-0.4,0.5);if(wa>0){x.save();x.globalAlpha*=wa;wd_addon(x,1000,300,0.8,{col:"grey",name:"Tab Tidy",a:1-ag_in(tt,P.taken+1.0,0.8)});
        dp_slip(x,1000,470,"Taken off every browser","green",{align:"center",a:ag_in(tt,P.taken+0.4,0.5)});x.restore();
        const ja=ag_io(tt,P.morning-0.3,c.review-0.4,0.5);if(ja>0){x.save();x.globalAlpha*=ja;wd_jun(x,tt,{x:1560,y:612,p:{flip:true}});x.restore();}
        wd_laptopCard(x,900,120,tt,{a:wa*ag_in(tt,P.clean-0.2,0.5),k:ag_spr(tt,P.clean-0.2)});}
      // a review without blame, and what it changed
      const va=ag_in(tt,c.review,0.5)*(1-ag_in(tt,c.secret-0.4,0.5));if(va>0){dp_card(x,800,150,1040,{kick:"A review without blame",title:"What made it possible?",sub:"Not who."},{col:"cyan",a:va,k:ag_spr(tt,c.review)});
        dp_card(x,800,440,1040,{title:"Browsers take only add-ons the university approves"},{col:"green",a:va*ag_in(tt,P.browsers,0.5),k:ag_spr(tt,P.browsers)});
        dp_card(x,800,600,1040,{title:"GitHub takes requests only from the university's network"},{col:"green",a:va*ag_in(tt,P.gh,0.5),k:ag_spr(tt,P.gh)});}}},
    // a leaked secret: the same steps, from the first
    {at:c.secret-0.3,place:"wdHallNight",later:true,keys:[[c.secret-0.3,960,540,1.0]],push:0.01,draw:(x,tt)=>{
      const e=tt>P.first+0.5?1+clamp((tt-P.first-0.5)/0.6,0,1):ag_in(tt,c.secret+0.1,0.5);wd_steps(x,110,170,560,[e,ag_in(tt,P.did,0.5),0,0,0]);
      dp_sealed(x,820,250,620,"A token found in code",{revoked:clamp((tt-P.first-0.3)/0.8,0,1),a:ag_in(tt,c.secret+0.1,0.5)});
      dp_slip(x,820,420,"The same steps","cyan",{a:ag_in(tt,P.did,0.5)});}}
  ]);});

/* ---------------------------------------------------------------- 8 · The glass to break */
scene("glass",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({other:wAt(sc,"approved","someone else"),fails:wAt(sc,"whatif","fails"),rule:wAt(sc,"whatif","a wrong rule"),
    noone:wAt(sc,"noone","belong to no one"),always:wAt(sc,"noone","always on"),safes:wAt(sc,"keys","two safes"),bld:wAt(sc,"keys","two buildings"),every:wAt(sc,"rules","rings every bell"),
    open:wAt(sc,"test","open a safe"),signin:wAt(sc,"test","check it works"),lock:wAt(sc,"test","lock the key away"),knows:wAt(sc,"rings","everyone knows")}));
  const admins=["Jun Park (admin)","Sam Okafor (admin)"];
  ag_shots(ctx,S,t,sc.dur,[
    // every admin power: switched on for a task, approved by someone else; but what if the sign-in service fails, or a wrong rule locks them all out?
    {at:0,place:"wdHall",later:true,keys:[[0,960,540,1.0]],push:0.015,draw:(x,tt)=>{const lock=clamp((tt-P.rule-0.3)/0.8,0,1);
      admins.forEach((n,i)=>{const yy=240+i*100,a=ag_in(tt,0.3+i*0.3,0.5);if(a<=0)return;x.save();x.globalAlpha*=a;dp_pill(x,160,yy,n,"amber",{size:30});
        const tp=clamp((tt-P.other-i*0.2)/0.6,0,1);x.save();x.globalAlpha*=1-ag_in(lock,0,0.4);dp_tick(x,600,yy-14,"green",tp);x.restore();dp_cross(x,600,yy-14,"coral",clamp((lock-0.3)/0.7,0,1));x.restore();});
      dp_slip(x,160,400,"Switched on for a task, approved by someone else","cyan",{a:ag_in(tt,P.other,0.5)*(1-ag_in(tt,P.rule,0.4))});
      dp_pill(x,160,450,"Locked out","coral",{a:ag_in(lock,0.5,0.5)});
      const ea=ag_in(tt,c.whatif,0.5);if(ea>0){x.save();x.globalAlpha*=ea;dp_panel(x,1120,170,600,150,{col:"cyan",r:22,glowR:26});wd_tool(x,1156,250,"entra","Microsoft Entra ID",{h:40,size:34});
        dp_T(x,"Signs everyone in",1156,294,{w:600,size:28,col:"mut"});x.restore();}
      wd_qmark(x,1790,245,40,ag_spr(tt,P.fails),1);
      dp_card(x,1120,380,600,{title:"A wrong rule",sub:"locks every admin out"},{col:"coral",a:ag_in(tt,P.rule,0.5),k:ag_spr(tt,P.rule)});
      wd_qmark(x,1790,452,40,ag_spr(tt,P.rule+0.3),1);}},
    // the glass to break: two emergency accounts in the directory, kept in two safes in two buildings, tested every 90 days
    {at:c.two-0.3,place:"wdHall",later:true,keys:[[c.two-0.3,960,540,1.0]],push:0.015,draw:(x,tt)=>{
      const ga=ag_in(tt,c.two,0.6);if(ga>0){x.save();x.globalAlpha*=ga;dp_wall(x,160,120,1600,330,{frosted:false,col:"amber"});dp_T(x,"BREAK GLASS",960,104,{w:800,size:28,ls:6,col:"amber",align:"center"});x.restore();}
      [0,1].forEach(i=>wd_eaCard(x,230+i*760,160,700,i+1,{a:ag_in(tt,c.two+0.2+i*0.3,0.5),k:ag_spr(tt,c.two+0.2+i*0.3),b:ag_in(tt,P.noone-0.2+i*0.2,0.5),on:ag_in(tt,P.always,0.5)}));
      dp_T(x,"No rule that could lock everyone out applies to them",960,404,{w:700,size:28,col:"green",align:"center",a:ag_in(tt,c.rules,0.6)});
      // the safes, a security key in each; the first opened for the test, signed in with, and locked away again
      [0,1].forEach(i=>{const sa=ag_in(tt,P.safes+i*0.3,0.5);if(sa<=0)return;const sx=[470,1290][i],op=i===0?ag_io(tt,P.open,P.lock+0.4,0.8):0;
        wd_safe(x,sx,500,0.62,op,{a:sa,inside:cx=>{wd_secKey(cx,130,140,1.5,{glow:i===0?ag_io(tt,P.signin-0.2,P.lock,0.4):0});}});
        dp_slip(x,sx+80,690,"Building "+(i?"B":"A"),"cyan",{align:"center",a:ag_in(tt,P.bld+i*0.2,0.5)});});
      dp_tick(x,690,540,"green",clamp((tt-P.signin)/0.6,0,1)*(1-ag_in(tt,P.lock+0.6,0.5)));
      // any sign-in rings every bell; at the test too, and everyone knows it's the test
      [0,1,2,3].forEach(i=>wd_bell(x,840+i*80,505,26,tt,{ring:tt>c.rings?c.rings+0.2+i*0.1:P.every+i*0.12,a:ag_in(tt,P.every-0.4,0.4)}));
      dp_slip(x,960,610,"Any sign-in rings every bell","cyan",{align:"center",a:ag_in(tt,P.every,0.5)*(1-ag_in(tt,c.rings-0.1,0.3))});
      dp_slip(x,960,610,"Planned test","green",{align:"center",a:ag_in(tt,P.knows,0.4)});
      dp_slip(x,960,790,"Tested every 90 days, by two people","cyan",{align:"center",a:ag_in(tt,c.test,0.5)});}}
  ]);});

/* ---------------------------------------------------------------- 9 · A copy nobody can delete */
scene("copy",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({seven:wAt(sc,"history","seven days"),late:wAt(sc,"late","found too late"),del:wAt(sc,"late","deletes a table"),
    apart:wAt(sc,"nightly","a place apart"),own:wAt(sc,"nightly","admins of its own"),admin:wAt(sc,"thirty","not even an admin"),beside:wAt(sc,"monthly","beside the real table"),
    match:wAt(sc,"monthly","they match"),hope:wAt(sc,"hope","only a hope")}));
  // the last four nights, by day, not by date: the module's series keep their own dates
  const days=["Friday","Saturday","Sunday","Monday"];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",later:true,keys:[[0,960,540,1.0]],push:0.015,draw:(x,tt)=>{
      const del=clamp((tt-P.del)/0.8,0,1),back=ag_in(tt,c.nightly-0.6,0.5);
      wd_tbl(x,110,170,420,"learners",{empty:del*(1-back),rows:4});
      wd_versions(x,150,450,10,46,{keep:7,p:clamp((tt-c.history)/1.4,0,1),a:ag_in(tt,c.history,0.4)*(1-del*(1-back))});
      dp_T(x,"7 days of history",150,530,{w:700,size:28,col:"mut",a:ag_in(tt,P.seven,0.5)*(1-del*(1-back))});
      dp_cross(x,150+9*46,450,"coral",clamp((tt-P.late)/0.6,0,1)*(1-del)*(1-back));
      // every night, a copy to a place apart, with admins of its own; locked 30 days
      wd_clock(x,700,180,"02:00",{h:2,a:ag_in(tt,c.nightly,0.5)*(1-ag_in(tt,c.monthly-0.4,0.4))});
      const pa=ag_in(tt,P.apart-0.3,0.6);if(pa>0){wd_store(x,1140,130,700,640,{a:pa,title:"A place apart",draw:(cx,b)=>{dp_T(cx,"Admins of its own",b.x,b.y+26,{w:700,size:30,col:"mut",a:ag_in(tt,P.own,0.5)});
          days.forEach((d,i)=>{const da=ag_in(tt,P.apart+0.3+i*0.35,0.4);if(da<=0)return;const yy=b.y+60+i*86;cx.save();cx.globalAlpha*=da;dp_panel(cx,b.x,yy,b.w,70,{col:"cyan",r:14,glowR:12});
            dp_lock(cx,b.x+36,yy+38,32,"cyan",0);dp_T(cx,"Production · "+d,b.x+72,yy+46,{w:600,size:28});dp_T(cx,"Locked 30 days",b.x+b.w-24,yy+46,{w:700,size:28,col:"cyan",align:"right",a:ag_in(tt,c.thirty,0.5)});cx.restore();});}});}
      // a copy on its way across
      const cu=clamp((tt-P.apart+0.6)/1.4,0,1);if(cu>0&&cu<1){dp_slip(x,lerp(620,1180,ag_sine(cu)),lerp(300,250,ag_sine(cu)),"Production · "+days[3],"cyan",{size:28});}
      // not even an admin
      const ad=ag_io(tt,P.admin-0.4,c.monthly-0.3,0.5);if(ad>0){const r=ag_sine(clamp((tt-P.admin+0.4)/0.8,0,1));dp_pill(x,lerp(600,800,r),720,"Sam Okafor (admin)","amber",{a:ad});dp_pill(x,1160,800,"Locked until it's due","coral",{align:"right",a:ad*ag_in(tt,P.admin+0.3,0.4)});}
      // once a month, one is restored beside the real table, and checked
      const ma=ag_in(tt,P.beside,0.6);if(ma>0){wd_tbl(x,620,170,460,"learners_restored",{a:ma,rows:4});dp_tick(x,575,265,"green",clamp((tt-P.match)/0.6,0,1));
        dp_slip(x,620,400,"They match","green",{a:ag_in(tt,P.match+0.2,0.4)});}
      dp_card(x,110,760,1000,{title:"A copy nobody has restored is only a hope"},{col:"cyan",a:ag_in(tt,P.hope-0.6,0.5),k:ag_spr(tt,P.hope-0.6)});}}
  ]);});

/* ---------------------------------------------------------------- 10 · Seen */
scene("seen",(ctx,S,t,sc)=>{const c=sc.cues,P=wd_once(sc,"P",()=>({one:wAt(sc,"afternoon","one place"),wrong:wAt(sc,"signins","one was wrong"),reason:wAt(sc,"power","each with a reason"),
    rev:wAt(sc,"production","each change reviewed"),two:wAt(sc,"job","every night at two"),itself:wAt(sc,"job","as itself"),air:wAt(sc,"box","in the air"),
    plat:wAt(sc,"same","for the platform")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",later:true,keys:[[0,960,540,1.0]],push:0.015,draw:(x,tt)=>{wd_sam(x,tt);wd_name(x,300,170,"Sam Okafor","Runs the platform",ag_in(tt,0.4,0.6));
      wd_review(x,700,110,1150,{title:"Three months on",room:true,ans:[ag_in(tt,P.wrong,0.6),ag_in(tt,P.reason-0.4,0.6),ag_in(tt,P.rev-0.4,0.6)]});
      dp_slip(x,700,700,"All from one place: the security team's store","cyan",{a:ag_in(tt,P.one,0.5)});}},
    {at:c.job-0.2,place:"wdHall",later:true,keys:[[c.job-0.2,960,540,1.0]],push:0.02,draw:(x,tt)=>{
      dp_badge(x,160,270,600,372,{kind:"Workload",col:"cyan",title:"registrar-loader",lines:[["Signs in as itself",null],["every night at 02:00",null]],pic:dp_gearPic,t:tt,chip:true});
      for(let i=0;i<90;i++){const u=clamp((tt-P.two)*30-i,0,1);if(u<=0)continue;const col=i%15,row=Math.floor(i/15),xx=900+col*60,yy=310+row*56;x.save();x.globalAlpha*=u;
        x.fillStyle=rgba(DP.F.green,0.9);x.beginPath();x.arc(xx,yy,12,0,TAU);x.fill();x.restore();}
      dp_T(x,"90 nights, 90 sign-ins, each under its own name",900,710,{w:700,size:30,a:ag_in(tt,P.itself,0.5)});}},
    {at:c.box-0.3,place:"wdDawn",keys:[[c.box-0.3,960,540,1.0]],push:0.03,draw:(x,tt,cam)=>{const dx=(tt-c.box)*16;wd_comet(x,220+dx,520,1.1,{lit:0.4,lights:1,dusk:0.15});
      wd_tailBox(x,220+dx+890*1.1,520-12*1.1,1);
      dp_card(x,560,140,800,{title:"No one has to guess what happened"},{col:"cyan",a:ag_in(tt,c.guess+0.3,0.6),k:ag_spr(tt,c.guess+0.3)});}},
    {at:c.same-0.3,place:"wdHall",keys:[[c.same-0.3,960,520,1.08]],push:0.02,draw:(x,tt)=>{wd_platform(x,960,720,420,560,{t:tt,rec:1,door:1});
      const out=1-ag_in(tt,c.breath-0.6,0.6);if(out>0){x.save();x.globalAlpha*=out;[[740,250],[1060,210],[900,140],[640,420],[1160,380]].forEach(([px,py],i)=>dp_tick(x,px,py,"green",clamp((tt-P.plat-i*0.15)/0.6,0,1)));x.restore();}}}
  ]);
  dp_end(ctx,S,t,c.breath,"Who did what","If you can't see it, you can't say it's protected.","Film 9 of 9","Locks before the data");});

ag_cutInto(["questions","store","bell","night","showed","glass","copy","seen"]);
