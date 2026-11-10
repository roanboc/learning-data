/* ===== Context and memory, governed: what's governed, and what comes second =====
   The pieces for the order the team sets: the glossary's definitions and the data rules first, each with an owner who reviews every
   change; the memory the platform keeps second, with nobody approving each line. Where the voice names a tool, its official logo stands
   beside the name, unaltered (The Inner Life of Data's logos.js: Databricks and dbt; this film's marks.js: GitHub).
     cm_mark(ctx, k, x, y, h, a)      a tool's logo, h high, its top at y; returns its width (0 until the logos are loaded)
     cm_named(ctx, x, y, text, o)     a name as ag_label writes it, the logo o.mark before it; o.col, o.a, o.align "center"
     cm_flag(ctx, x, y, s, col)       a small flag on a pole, its foot at (x, y): a line an agent flagged
     cm_term(ctx, x, y, w, o)         a term in the business glossary, on Databricks: the term, its definition, its owner; o.hl lights the
                                      definition; o.edge, o.edgeA, o.a, o.k; returns its box
     cm_order(ctx, x, y, w, o)        the order: FIRST, what's governed (the glossary's definitions, the data rules, an owner who reviews
                                      every change), and SECOND, the memory (kept by the platform, nobody approves each line); o.a1, o.a2
                                      (each tier), o.items(i) (the two governed things), o.rev, o.kept, o.noOne, o.line ({text, glow,
                                      flag}: a line in the memory, shown in its tier), o.win (the governed tier lit green); returns both boxes
     cm_tiles(ctx, x, y, cols, rows, u, o)  the memory step's lines pouring in: small cards in a grid, shown up to u (0..1); o.ticked, how
                                      many of the first carry a person's tick */

function cm_mark(ctx,k,x,y,h,a){if(typeof LOGO==="undefined"||!LOGO[k])return 0;const im=LOGO[k],w=h*im.width/im.height;if(a==null||a>=1)return logo(ctx,k,x,y,h);
  if(a<=0)return w;ctx.save();ctx.globalAlpha*=a;logo(ctx,k,x,y,h);ctx.restore();return w;}
function cm_markW(k,h){return typeof LOGO!=="undefined"&&LOGO[k]?h*LOGO[k].width/LOGO[k].height:0;}
function cm_named(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return 0;const T_=String(text).toUpperCase(),h=o.h||34,
    lw=o.mark?cm_markW(o.mark,h):0,gap=lw?12:0,tw=ag_tw(ctx,T_,{w:700,size:28,ls:4}),x0=o.align==="center"?x-(lw+gap+tw)/2:x;
  if(lw)cm_mark(ctx,o.mark,x0,y-29,h,a);ag_label(ctx,x0+lw+gap,y,text,{a,col:o.col});return lw+gap+tw;}
function cm_flag(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=Math.max(2.4,s*0.1);ctx.lineCap="round";ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-s);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+1,y-s);ctx.quadraticCurveTo(x+s*0.38,y-s*1.06,x+s*0.74,y-s*0.86);ctx.lineTo(x+s*0.74,y-s*0.5);ctx.quadraticCurveTo(x+s*0.38,y-s*0.7,x+1,y-s*0.56);ctx.closePath();ctx.fill();ctx.restore();}

/* the glossary's term, as the business glossary on Databricks keeps it (the example project's skills/sync-the-glossary/example_glossary.json:
   term, definition, owner) */
const CM_TERM={term:"Unit offering",def:"A unit taught in a semester, on campus, online or both.",owner:"Mei Tanaka, registrar's office"};
function cm_term(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,inner=w-56,dl=cm_wrap(ctx,o.def||CM_TERM.def,inner,{w:600,size:30}),h=76+50+dl.length*40+18+(o.owner===false?0:74)+16,bb={x,y,w,h};
  if(a<=0||o.measure)return bb;const ea=o.edgeA==null?1:o.edgeA;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:o.edge?0.5+0.4*ea:0.6,glow:o.edge&&ea>0?o.edge:null,glowA:0.6*ea});
  cm_named(ctx,x+28,y+52,o.kick||"Business glossary",{mark:"databricks",h:32,col:AG.blue});
  ag_T(ctx,o.term||CM_TERM.term,x+28,y+112,{w:700,size:36});
  let yy=y+126;const hl=o.hl||0;if(hl>0){ctx.fillStyle=rgba(o.hlCol||AG.green,0.12*hl);rr(ctx,x+14,yy+4,w-28,dl.length*40+18,10);ctx.fill();}
  dl.forEach(l=>{yy+=40;ag_T(ctx,l,x+28,yy,{w:600,size:30,col:AG.ink});});yy+=18;
  if(o.owner!==false){ag_T(ctx,"Owner",x+28,yy+30,{w:700,size:28,col:AG.mut,a:o.ownerA==null?1:o.ownerA});ag_T(ctx,o.owner||CM_TERM.owner,x+28,yy+66,{w:600,size:28,col:AG.ink,a:o.ownerA==null?1:o.ownerA});}
  ctx.restore();return bb;}

/* the order, two tiers on the wall: the governed one above, lit green when it wins, and the memory under it, quieter */
const CM_ORD={h1:236,h2:206,gap:30};
function cm_order(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,a1=(o.a1==null?1:o.a1),a2=(o.a2==null?1:o.a2),t1={x,y,w,h:CM_ORD.h1},t2={x,y:y+CM_ORD.h1+CM_ORD.gap,w,h:CM_ORD.h2};
  if(a<=0)return{t1,t2};ctx.save();ctx.globalAlpha*=a;const it=o.items||(()=>1),win=o.win||0;
  // FIRST: what's governed
  if(a1>0){ctx.save();ctx.globalAlpha*=a1;if(o.k1!=null)ag_about(ctx,x+w/2,y+t1.h/2,lerp(0.7,1,o.k1));
    ag_box(ctx,x,y,w,t1.h,22,{edge:AG.green,edgeA:0.55+0.35*win,glow:win>0?AG.green:null,glowA:0.7*win});
    ag_T(ctx,"1",x+44,y+66,{w:800,size:48,align:"center",col:AG.green});ag_label(ctx,x+86,y+56,"First · what's governed",{col:AG.green});
    [["The glossary's definitions",x+86],["The data rules",x+86+ag_tw(ctx,"The glossary's definitions",{w:700,size:30})+90]].forEach((p,i)=>{const ia=it(i);if(ia<=0)return;
      ctx.save();ctx.globalAlpha*=ia;const bw=ag_tw(ctx,p[0],{w:700,size:30})+56;ag_box(ctx,p[1],y+94,bw,62,31,{edge:AG.green,edgeA:0.6});ag_T(ctx,p[0],p[1]+28,y+136,{w:700,size:30});ctx.restore();});
    const ra=o.rev==null?1:o.rev;if(ra>0){ctx.save();ctx.globalAlpha*=ra;ag_tick(ctx,x+104,y+194,24,rgba(AG.green,1),4);ag_T(ctx,"Each with an owner who reviews every change",x+134,y+204,{w:600,size:28,col:AG.ink});ctx.restore();}
    ctx.restore();}
  // SECOND: the memory the platform keeps
  if(a2>0){const yy=t2.y;ctx.save();ctx.globalAlpha*=a2;if(o.k2!=null)ag_about(ctx,x+w/2,yy+t2.h/2,lerp(0.7,1,o.k2));
    ag_box(ctx,x,yy,w,t2.h,22,{edge:AG.blue,edgeA:0.45});
    ag_T(ctx,"2",x+44,yy+66,{w:800,size:48,align:"center",col:AG.blue});ag_label(ctx,x+86,yy+56,"Second · memory",{col:AG.blue});
    const ka=o.kept==null?1:o.kept;if(ka>0){ctx.save();ctx.globalAlpha*=ka;const lw=cm_mark(ctx,"databricks",x+86,yy+86,32);ag_T(ctx,"Kept by the platform",x+86+lw+(lw?14:0),yy+112,{w:600,size:30,col:AG.ink});ctx.restore();}
    const na=o.noOne==null?1:o.noOne;if(na>0){ctx.save();ctx.globalAlpha*=na;ag_T(ctx,"Nobody approves each line",x+86,yy+168,{w:600,size:28,col:AG.mut});ctx.restore();}
    // a line in the memory, at the tier's right: lit, then flagged
    const L=o.line;if(L&&(L.a==null||L.a>0)){const lw=580,lx=x+w-lw-40,ly=yy+76;ctx.save();ctx.globalAlpha*=L.a==null?1:L.a;
      cm_index(ctx,lx,ly,lw,56,{text:L.text,glow:L.glow>0?AG.amber:null,glowA:L.glow||0});if(L.flag>0){ctx.save();ctx.globalAlpha*=L.flag;const k=Math.min(1,ag_spr(L.flag,0,0.5));
        ag_about(ctx,lx+lw-30,ly+46,lerp(0.4,1,k));cm_flag(ctx,lx+lw-38,ly+50,40,rgba(AG.amber,1));ctx.restore();}ctx.restore();}
    ctx.restore();}
  ctx.restore();return{t1,t2};}

/* the memory step's lines pouring in, more each day than anyone can read: small cards in a grid, the first few ticked by a person */
function cm_tiles(ctx,x,y,cols,rows,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||u<=0)return;const n=cols*rows,show=u*n,W=o.w||96,H=o.h||58,gx=o.gx||14,gy=o.gy||14,R=ag_rnd(17);
  ctx.save();ctx.globalAlpha*=a;for(let i=0;i<n;i++){const f=clamp(show-i,0,1);const jx=(R()-0.5)*6,jy=(R()-0.5)*6,rot=(R()-0.5)*0.05;if(f<=0)continue;
    const c=i%cols,r=Math.floor(i/cols),px=x+c*(W+gx)+jx,py=y+r*(H+gy)+jy;ctx.save();ctx.globalAlpha*=f;ctx.translate(px+W/2,py+H/2);ctx.rotate(rot);
    ctx.save();ctx.shadowColor="rgba(46,38,28,0.14)";ctx.shadowBlur=8;ctx.shadowOffsetY=3;ctx.fillStyle=CM_CARD.base;rr(ctx,-W/2,-H/2,W,H,7);ctx.fill();ctx.restore();
    ctx.strokeStyle=o.glow?rgba(o.glow,0.55):CM_CARD.edge;ctx.lineWidth=1.2;rr(ctx,-W/2,-H/2,W,H,7);ctx.stroke();
    ctx.fillStyle="rgba(86,92,100,0.2)";rr(ctx,-W/2+12,-H/2+16,W*0.6,7,3.5);ctx.fill();rr(ctx,-W/2+12,-H/2+32,W*0.42,7,3.5);ctx.fill();
    if(i<(o.ticked||0))ag_tick(ctx,W/2-18,H/2-16,16,rgba(AG.green,1),3);ctx.restore();}
  ctx.restore();}

/* who may do what with the team's memory, as data governance sets it: a kicker with Databricks' logo, a title, and rows [label, words, a] */
function cm_spec(ctx,x,y,w,kick,title,rows,o){o=o||{};const a=o.a==null?1:o.a,h=128+rows.length*76+12,bb={x,y,w,h};if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.6});
  cm_named(ctx,x+28,y+52,kick,{mark:o.mark||"databricks",h:32});ag_T(ctx,title,x+28,y+102,{w:700,size:34,a:o.titleA==null?1:o.titleA});
  rows.forEach((r,i)=>{const ra=r[2]==null?1:r[2];if(ra<=0)return;const yy=y+128+i*76;ctx.save();ctx.globalAlpha*=ra;
    if(r[3]){ctx.fillStyle=rgba(AG.blue,0.1*r[3]);rr(ctx,x+14,yy,w-28,64,12);ctx.fill();}
    ag_T(ctx,r[0],x+28,yy+42,{w:700,size:28,col:AG.mut});ag_T(ctx,r[1],x+(o.lab||270),yy+42,{w:600,size:30,col:AG.ink});ctx.restore();});
  ctx.restore();return bb;}
