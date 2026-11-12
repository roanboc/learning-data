/* ===== How long, and then what: the university =====
   The module's hall with the film's own lights; the platform as a tall block of clear glass, its shelves of frosted cards becoming
   glass drawers once the schedule labels them; the three stages of a record; the retention schedule; Linh's contracts and their end
   dates; a drawer under a hold; and a record's line through time. Every word at least 28 px, on the kit's cards, slips and pills. */

AG_PLACES.hlHall=c=>dp_paintHall(c,{seed:19,horizon:720,vx:960,pools:[[250,1010,420,0.11],[1670,1010,420,0.11],[960,860,760,0.05]]});

/* ---------------------------------------------------------------- the platform */
// A tall block of clear glass, its shelves top to bottom; each shelf s: {n: frosted cards on it (0 to 8; a fraction fades the last),
// warm: the cards lit (in use), coral: the first card's rim turning coral (0 to 1), drawer: the shelf becoming a glass drawer (0 to 1),
// label: the drawer's words, a: the shelf's light}. o.a the block's own light. Returns the shelves' boxes.
const HL_BLOCK={x:760,y:150,w:400,h:690};
function hl_block(c,shelves,o){o=o||{};const B=HL_BLOCK,a=o.a==null?1:o.a,n=shelves.length,rh=B.h/n,ice=DP.ice,out=[];if(a<=0)return out;c.save();c.globalAlpha*=a;
  // the glass: nearly clear, a light along its edges and a sheen down one side
  c.save();c.shadowColor=rgba(DP.F.cyan,0.30);c.shadowBlur=40;rr(c,B.x,B.y,B.w,B.h,10);c.fillStyle="rgba(10,30,36,0.42)";c.fill();c.restore();
  let g=c.createLinearGradient(B.x,0,B.x+B.w,0);g.addColorStop(0,"rgba(190,245,245,0.10)");g.addColorStop(0.18,"rgba(190,245,245,0.02)");g.addColorStop(1,"rgba(190,245,245,0.06)");rr(c,B.x,B.y,B.w,B.h,10);c.fillStyle=g;c.fill();
  for(let i=0;i<n;i++){const s=shelves[i],y=B.y+i*rh,sa=s.a==null?1:s.a,cards=s.n==null?8:s.n,box={x:B.x+12,y:y+8,w:B.w-24,h:rh-14};out.push(box);
    // the shelf: a plate of glass, its edge lit
    c.fillStyle=rgba(ice,0.42*sa+0.1);c.fillRect(B.x+8,y+rh-6,B.w-16,2.4);
    // its cards: frosted, standing, lit warm while in use, the first one's rim coral as it turns
    for(let k=0;k<8;k++){const ka=clamp(cards-k,0,1)*sa;if(ka<=0)continue;const cx=B.x+22+k*46,cy=y+16,cw=36,ch=rh-26;c.save();c.globalAlpha*=ka;
      c.fillStyle=s.warm?"rgba(255,226,180,0.24)":"rgba(190,240,240,0.15)";rr(c,cx,cy,cw,ch,5);c.fill();
      const rim=k===0&&s.coral?mix(ice,DP.F.coral,s.coral):s.warm?[255,226,180]:ice;c.strokeStyle=rgba(rim,k===0&&s.coral?0.6+0.4*s.coral:0.55);c.lineWidth=k===0&&s.coral?2.4+s.coral:1.6;
      if(k===0&&s.coral){c.shadowColor=rgba(DP.F.coral,0.8*s.coral);c.shadowBlur=14*s.coral;}rr(c,cx,cy,cw,ch,5);c.stroke();c.restore();}
    // the shelf as a drawer: a front of glass across it, its words
    const d=clamp(s.drawer||0,0,1);if(d>0){c.save();c.globalAlpha*=d;dp_panel(c,box.x,box.y,box.w,box.h,{r:8,glowR:24,behind:o.behind});
      if(s.label)dp_T(c,s.label,box.x+box.w/2,box.y+box.h/2+11,{w:700,size:30,align:"center"});c.restore();}}
  // the block's rim, brighter at the top
  g=c.createLinearGradient(0,B.y,0,B.y+B.h);g.addColorStop(0,rgba(ice,0.95));g.addColorStop(1,rgba(ice,0.45));rr(c,B.x+1,B.y+1,B.w-2,B.h-2,10);c.strokeStyle=g;c.lineWidth=2.4;c.stroke();
  c.restore();return out;}
// a shelf's middle on its right edge, for a tag's line
const hl_shelfAt=(i,n)=>[HL_BLOCK.x+HL_BLOCK.w,HL_BLOCK.y+(i+0.5)*HL_BLOCK.h/n];
// a grey tag on a shelf: a grey slip with its words in ice white, like the film's other grey slips (grey's own words are too faint
// over the hall's light), its middle on the shelf's line, and a line of light from its left edge to the shelf (to), drawn on by p
function hl_greyTag(c,x,to,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const size=o.size||28;c.save();c.globalAlpha*=a;
  const bb=dp_slip(c,x,to[1]-(size+40)/2,text,"grey",{ink:true,size,behind:o.behind});dp_link(c,[bb.x,to[1]],to,"grey",o.p==null?1:o.p);c.restore();}

/* ---------------------------------------------------------------- frosted cards and panes */
// a small frosted card standing for a record: its words (one or two lines), its rim; o.warm, o.dim, o.coral (its rim), o.a
function hl_rec(c,x,y,w,lines,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||(lines.length>1?96:64);if(a<=0)return{x,y,w,h};c.save();c.globalAlpha*=a*(1-0.55*(o.dim||0));
  dp_panel(c,x,y,w,h,{col:o.coral?mix(DP.F.cyan,DP.F.coral,o.coral):o.warm?[255,214,160]:"cyan",r:12,glowR:22,glowA:o.coral?1+o.coral:0.8,behind:o.behind});
  lines.forEach((l,i)=>dp_T(c,l,x+w/2,y+(lines.length>1?40+i*38:h/2+11),{w:i?500:700,size:28,align:"center",col:i?"mut":"ink",f:o.mono&&!i?"mono":undefined}));
  c.restore();return{x,y,w,h};}
// a pane of frosted glass with its name at the top
function hl_pane(c,x,y,w,h,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;dp_panel(c,x,y,w,h,{r:18,behind:o.behind,glowA:o.glow||0.8});
  dp_T(c,name,x+w/2,y+54,{w:700,size:36,align:"center"});c.fillStyle=rgba(DP.ice,0.35);c.fillRect(x+30,y+76,w-60,1.5);c.restore();}
// words struck through with a line of coral, drawn on by p
function hl_strike(c,x,y,w,p){if(p<=0)return;c.save();c.strokeStyle=rgba(DP.F.coral,1);c.lineWidth=5;c.lineCap="round";c.shadowColor=rgba(DP.F.coral,0.8);c.shadowBlur=10;
  c.beginPath();c.moveTo(x,y);c.lineTo(x+w*clamp(p,0,1),y-4*clamp(p,0,1));c.stroke();c.restore();}
// a band of solid colour across something, its words in dark capitals (the kit's band), settling in by u; text a line, or an array of
// lines (each centred, 40 apart, the band as tall as they need); it widens, round its middle, to fit its longest line
function hl_bandAcross(c,x,y,w,h,col,text,u){if(u<=0)return;const L=(Array.isArray(text)?text:[text]).map(s=>String(s).toUpperCase()),q={w:800,size:30,ls:5};
  const tw=Math.max(...L.map(s=>dp_tw(c,s,q)))+64;if(w<tw){x-=(tw-w)/2;w=tw;}h=Math.max(h,24+L.length*40);
  c.save();c.globalAlpha*=clamp(u*2,0,1);const k=ag_spr(u,0,1),yy=y-(1-k)*30;
  c.save();c.shadowColor=rgba(dp_f(col),0.7);c.shadowBlur=20;rr(c,x,yy,w,h,10);c.fillStyle=rgba(dp_f(col),1);c.fill();c.restore();
  const g=c.createLinearGradient(0,yy,0,yy+h);g.addColorStop(0,"rgba(255,255,255,0.28)");g.addColorStop(0.5,"rgba(255,255,255,0)");rr(c,x,yy,w,h,10);c.fillStyle=g;c.fill();
  L.forEach((s,i)=>dp_T(c,s,x+w/2,yy+h/2+10+(i-(L.length-1)/2)*40,Object.assign({align:"center",col:DP.on},q)));c.restore();}

/* ---------------------------------------------------------------- the retention schedule */
// The university's schedule: a frosted table, its five columns, its rows coming in (rows[i] 0 to 1), each row's reason a green pill
// (pills 0 to 1 lights them), the owners' names (cyan, an identity; they may come first), the line saying who keeps it, and the
// owners' signature
const HL_SCHED={x:100,y:118,w:1720,cols:[[34,"Kind of record"],[504,"Owner"],[760,"Why"],[1010,"How long"],[1450,"Then"]],
  rows:[[["Pay records","contracts, hours, pay"],"Ingrid Holm","law",["7 years after","each contract ends"],"Deleted"],
        [["Academic records","degrees, results"],"Mei Tanaka","public task",["For good"],"Kept for good"],
        [["Tutors' mailing list"],"Ingrid Holm","agreed",["Until a no, or 2 years","without contact"],"Deleted"],
        [["Applications","not hired"],"Ingrid Holm","fair interest",["12 months after","the decision"],"Deleted"]]};
function hl_schedule(c,o){o=o||{};const S=HL_SCHED,a=o.a==null?1:o.a;if(a<=0)return;const rows=o.rows||[1,1,1,1],head=o.head||[1,1,1,1,1],rh=104,y0=S.y+150,h=150+rh*4+(o.kept>0||o.signed>0?118:28);
  c.save();c.globalAlpha*=a;dp_panel(c,S.x,S.y,S.w,h,{r:22,behind:o.behind,glowA:1+(o.glow||0)*1.5,glowR:46+40*(o.glow||0)});
  dp_T(c,"Retention schedule",S.x+34,S.y+62,{w:700,size:40});
  // the column heads, each lighting as it's named
  for(let i=0;i<5;i++){const [cx,name]=S.cols[i],l=clamp(head[i],0,1);dp_T(c,name,S.x+cx,S.y+124,{w:700,size:28,col:l>0.5?"cyan":"mut",ls:1});}
  c.fillStyle=rgba(DP.ice,0.4);c.fillRect(S.x+24,S.y+140,S.w-48,1.6);
  for(let r=0;r<4;r++){const u=clamp(rows[r],0,1),R=S.rows[r],y=y0+r*rh;
    // the owner's name, which may come before the rest of the row (o.owners: one value for every row, or one for each)
    if(Array.isArray(o.owners)&&o.owners[r]>0)dp_pill(c,S.x+S.cols[1][0],y+44,R[1],"identity",{a:clamp(o.owners[r],0,1)});
    if(u<=0)continue;const dy=(1-ag_eo(u))*20;c.save();c.globalAlpha*=clamp(u*1.5,0,1);c.translate(0,dy);
    R[0].forEach((l,i)=>dp_T(c,l,S.x+S.cols[0][0],y+38+i*38,{w:i?500:700,size:28,col:i?"mut":"ink"}));
    const owner=Array.isArray(o.owners)?0:clamp(o.owners==null?1:o.owners,0,1);if(owner>0)dp_pill(c,S.x+S.cols[1][0],y+44,R[1],"identity",{a:owner});
    dp_pill(c,S.x+S.cols[2][0],y+44,R[2],"allowed",{a:clamp(o.pills==null?1:o.pills,0,1),glow:12+18*(o.pillGlow||0)});
    R[3].forEach((l,i)=>dp_T(c,l,S.x+S.cols[3][0],y+38+i*38,{w:600,size:28,col:i?"mut":"ink"}));
    dp_T(c,R[4],S.x+S.cols[4][0],y+38,{w:700,size:28});
    c.fillStyle=rgba(DP.ice,0.18);c.fillRect(S.x+24,y+rh-8,S.w-48,1.2);c.restore();}
  const yb=y0+4*rh;
  if(o.kept>0)withA(c,clamp(o.kept,0,1),()=>dp_T(c,"Kept by Yusuf Demir, data governance",S.x+34,yb+50,{w:600,size:28,col:"mut"}));
  if(o.signed>0){const u=clamp(o.signed,0,1);dp_tick(c,S.x+S.w-430,yb+40,"allowed",u);withA(c,clamp(u*1.5,0,1),()=>dp_T(c,"Signed · 14 October 2026",S.x+S.w-390,yb+50,{w:700,size:28,col:"green"}));}
  c.restore();return{x:S.x,y:S.y,w:S.w,h};}

/* ---------------------------------------------------------------- Linh's contracts */
const HL_CONTRACTS=[["T-23014","Semester 1, 2023","23 Jun 2030"],["T-23187","Semester 2, 2023","17 Nov 2030"],["T-24021","Semester 1, 2024","21 Jun 2031"],
  ["T-24166","Semester 2, 2024","15 Nov 2031"],["T-25033","Semester 1, 2025","27 Jun 2032"],["T-25172","Semester 2, 2025","21 Nov 2032"],
  ["T-26041","Semester 1, 2026","27 Jun 2033"],["T-26188","Semester 2, 2026","20 Nov 2033"]];
const HL_CX=540,HL_CY=160,HL_CH=80;
// one contract's card (u 0 to 1 coming in), its end date's slip (p 0 to 1), dimmed by dim, the slip lit by o.lit (0 to 1)
function hl_contract(c,i,u,p,o){o=o||{};if(u<=0)return;const [id,sem,until]=HL_CONTRACTS[i],y=HL_CY+i*HL_CH,dim=o.dim||0;c.save();c.globalAlpha*=clamp(u*1.5,0,1)*(1-0.6*dim);
  c.translate((1-ag_eo(u))*-30,0);dp_panel(c,HL_CX,y,470,64,{r:12,glowR:20,behind:o.behind});
  dp_T(c,id,HL_CX+24,y+43,{w:700,size:28,f:"mono"});dp_T(c,sem,HL_CX+190,y+43,{w:500,size:28,col:"mut"});c.restore();
  if(p>0){c.save();c.globalAlpha*=clamp(p*1.5,0,1)*(1-0.6*dim);const k=ag_spr(p,0,0.9);c.translate(0,(1-k)*-14);const b=dp_slip(c,HL_CX+500,y-3,"Until "+until,"grey",{ink:true,size:28,behind:o.behind});
    if(o.lit>0&&b){c.globalCompositeOperation="lighter";c.shadowColor=rgba(DP.F.cyan,0.9*o.lit);c.shadowBlur=22;rr(c,b.x,b.y,b.w,b.h,b.h/2);c.strokeStyle=rgba(DP.F.cyan,0.55*o.lit);c.lineWidth=2.4;c.stroke();}
    c.restore();}}

/* ---------------------------------------------------------------- a record's line through time */
// a line of light from a record's event to past its end date: the end date marked, and the two coral zones, too soon before it and
// too long after it, each lighting 0 to 1
function hl_lifeline(c,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const x0=200,x1=1720,xe=1060,y=470;c.save();c.globalAlpha*=a;
  for(const [za,zb,l,word] of [[x0+120,xe,o.soon||0,"Too soon"],[xe,x1,o.long||0,"Too long"]]){c.save();c.globalAlpha*=0.35+0.65*l;
    rr(c,za+6,y-64,zb-za-12,128,16);c.fillStyle=rgba(DP.F.coral,0.10+0.16*l);c.fill();c.strokeStyle=rgba(DP.F.coral,0.5+0.5*l);c.lineWidth=2;c.stroke();
    dp_T(c,word,(za+zb)/2,y-88,{w:700,size:30,align:"center",col:"coral"});c.restore();}
  c.save();c.strokeStyle=rgba(DP.ice,0.95);c.lineWidth=4;c.shadowColor=rgba(DP.F.cyan,0.8);c.shadowBlur=12;c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();c.restore();
  c.fillStyle=rgba(DP.ice,1);c.beginPath();c.arc(x0,y,9,0,TAU);c.fill();
  c.save();c.strokeStyle=rgba(DP.ice,1);c.lineWidth=3;c.beginPath();c.moveTo(xe,y-70);c.lineTo(xe,y+70);c.stroke();c.restore();
  dp_T(c,"Event",x0,y+60,{w:700,size:28,align:"center",col:"mut"});dp_T(c,"End date",xe,y+110,{w:700,size:30,align:"center"});c.restore();}
