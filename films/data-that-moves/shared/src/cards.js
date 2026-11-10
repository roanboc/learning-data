/* ===== Modern data basics: glass cards, pills, tags, the kicker, the mark, and the title and end cards =====
   Cards are panes of dark glass, as the intro's map draws them: nearly opaque, so words on them read at 8:1 or more; a faint light
   along the top edge; an edge in a colour only when the colour means something (look.js, MD: flow, agreed, pass, fail, wait,
   personal, a system's or a domain's colour), with a soft glow of it. Words on cards: a kicker in capitals, 28 px, letter-spaced, in
   the edge's colour; a title, 36 px; a line under it, 28 px, soft.
     md_card(ctx, x, y, w, h, o)       a pane: o.edge (a colour), o.glow (its strength, 0 to 1), o.r (corner), o.a, o.dash (an outline only,
                                       dashed: something that is shown but not copied), o.fill (a CSS colour)
     md_textCard(ctx, x, y, w, words, o) words {kick, title, sub}: a card that fits them; o.edge, o.kickCol, o.icon (an md_icon kind, at
                                       the top right, in the edge's colour), o.mono (the title in IBM Plex Mono), o.a, o.k (springs from
                                       its centre, 0 to 1), o.measure (only measure); returns {x, y, w, h}
     md_pill(ctx, x, y, text, o)       a solid pill centred on (x, y), dark words on its colour: o.col (MD.pass by default), o.icon
                                       ("tick", "cross", "warn", "lock", "clock", any md_icon kind), o.size (30), o.a, o.k
     md_tag(ctx, x, y, text, o)        an outlined tag, words in its colour: o.col, o.icon, o.align ("left" or "center"), o.size (28), o.a
     md_kicker(ctx, num, title, o)     the film's number and title at the top left
     md_mark(ctx, cx, cy, r, p, a)     the module's mark: a wheel of light drawing itself, its hub gold (the wheel was invented before)
     md_veil(ctx, S, a)                the night laid over the frame, for the title and end cards
     md_title(ctx, S, t, t0, title, sub, line)          the title card from t0
     md_end(ctx, S, t, t0, title, line, n, series)     the end card from t0: the film's line, the mark, the title, "Film 1 of 3 · Data that moves" */

function md_card(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const r=o.r==null?18:o.r,e=o.edge||null;ctx.save();ctx.globalAlpha*=a;
  if(o.dash){ctx.lineWidth=o.lw||2.4;ctx.setLineDash(o.dash===true?[12,10]:o.dash);ctx.strokeStyle=rgba(e||MD.dim,0.95);rr(ctx,x,y,w,h,r);ctx.fillStyle="rgba(8,14,30,0.42)";ctx.fill();ctx.stroke();ctx.restore();return;}
  if(e){ctx.shadowColor=rgba(e,0.5*(o.glow==null?1:o.glow));ctx.shadowBlur=26;}
  rr(ctx,x,y,w,h,r);ctx.fillStyle=o.fill||"rgba(11,19,38,0.94)";ctx.fill();ctx.shadowBlur=0;ctx.shadowColor="transparent";
  const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,"rgba(255,255,255,0.07)");g.addColorStop(0.4,"rgba(255,255,255,0.012)");g.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=g;rr(ctx,x,y,w,h,r);ctx.fill();
  ctx.lineWidth=o.lw||(e?2.2:1.4);ctx.strokeStyle=e?rgba(e,o.edgeA==null?0.9:o.edgeA):"rgba(170,200,245,0.3)";rr(ctx,x,y,w,h,r);ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,0.14)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+r,y+1.5);ctx.lineTo(x+w-r,y+1.5);ctx.stroke();ctx.restore();}
const MD_PAD=28;
function md_textCard(ctx,x,y,w,words,o){o=o||{};const inner=w-MD_PAD*2-(o.icon?52:0),tf={w:700,size:36,f:o.mono?"mono":undefined},tl=words.title?md_wrap(ctx,words.title,inner,tf):[],sl=words.sub?md_wrap(ctx,words.sub,w-MD_PAD*2,{w:500,size:28}):[];
  const h=MD_PAD+(words.kick?40:0)+tl.length*46+sl.length*38+MD_PAD-(words.kick?0:6)+(tl.length||sl.length?0:-10),bb={x,y,w,h};if(o.measure)return bb;
  const a=o.a==null?1:o.a;if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  md_card(ctx,x,y,w,h,{edge:o.edge,glow:o.glow,dash:o.dash});const kc=o.kickCol||o.edge||MD.soft;let yy=y+MD_PAD+24;
  if(words.kick){md_T(ctx,String(words.kick).toUpperCase(),x+MD_PAD,yy,{w:800,size:28,ls:4,col:kc});yy+=18;}else yy-=24;
  for(const l of tl){yy+=46;md_T(ctx,l,x+MD_PAD,yy,Object.assign({col:MD.ink},tf));}
  for(const l of sl){yy+=38;md_T(ctx,l,x+MD_PAD,yy,{w:500,size:28,col:MD.soft});}
  if(o.icon)md_icon(ctx,o.icon,x+w-MD_PAD-18,y+MD_PAD+18,40,o.edge||MD.ink);
  ctx.restore();return bb;}
function md_pill(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||30,col=o.col||MD.pass,icon=o.icon,w=md_tw(ctx,text,{w:800,size})+(icon?100:60),h=size+30,bx=x-w/2,by=y-h/2;
  if(a<=0.004)return{x:bx,y:by,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  ctx.shadowColor=rgba(col,0.55);ctx.shadowBlur=22;rr(ctx,bx,by,w,h,h/2);ctx.fillStyle=rgba(col,1);ctx.fill();ctx.shadowBlur=0;
  const g=ctx.createLinearGradient(0,by,0,by+h);g.addColorStop(0,"rgba(255,255,255,0.28)");g.addColorStop(0.5,"rgba(255,255,255,0)");ctx.fillStyle=g;rr(ctx,bx,by,w,h,h/2);ctx.fill();
  if(icon)md_icon(ctx,icon,bx+44,y,32,MD.navy);md_T(ctx,text,icon?bx+72:x,y+size*0.36,{w:800,size,align:icon?"left":"center",col:MD.navy});ctx.restore();return{x:bx,y:by,w,h};}
function md_tag(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||28,col=o.col||MD.flow,icon=o.icon,w=md_tw(ctx,text,{w:700,size})+(icon?88:44),h=size+24,bx=o.align==="center"?x-w/2:x,by=y-h/2;
  if(a<=0.004)return{x:bx,y:by,w,h};ctx.save();ctx.globalAlpha*=a;md_card(ctx,bx,by,w,h,{edge:col,r:h/2,glow:0.6,fill:"rgba(7,12,26,0.94)"});
  if(icon)md_icon(ctx,icon,bx+36,y,30,col);md_T(ctx,text,bx+(icon?62:22),y+size*0.36,{w:700,size,col});ctx.restore();return{x:bx,y:by,w,h};}

/* ---------------------------------------------------------------- the kicker, the mark, the title and end cards */
function md_kicker(ctx,num,title,o){o=o||{};const x=o.x||96,y=o.y||100,a=o.a==null?1:o.a;if(a<=0.004)return;
  md_T(ctx,num,x,y,{w:500,size:28,f:"mono",col:MD.flow,a});md_T(ctx,String(title).toUpperCase(),x+md_tw(ctx,num,{w:500,size:28,f:"mono"})+24,y,{w:800,size:28,ls:3.5,col:MD.soft,a});}
// the module's mark: a wheel, its rim drawing itself in the map's light, six spokes after it, and a gold hub
function md_mark(ctx,cx,cy,r,p,a){if(a<=0.01)return;p=clamp(p,0,1);ctx.save();ctx.globalAlpha*=a;const rim=ag_sine(p/0.7),sp=clamp((p-0.45)/0.45,0,1);
  ctx.lineCap="round";ctx.shadowColor=rgba(MD.flow,0.9);ctx.shadowBlur=r*0.3;ctx.strokeStyle=rgba(MD.flow,1);ctx.lineWidth=Math.max(2,r*0.09);
  ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*rim);ctx.stroke();
  ctx.lineWidth=Math.max(1.5,r*0.05);for(let i=0;i<6;i++){const f=clamp(sp*6-i,0,1);if(f<=0)continue;const an=-Math.PI/2+i*TAU/6;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*r*0.2,cy+Math.sin(an)*r*0.2);ctx.lineTo(cx+Math.cos(an)*r*lerp(0.2,0.92,f),cy+Math.sin(an)*r*lerp(0.2,0.92,f));ctx.stroke();}
  const hub=ag_sine((p-0.3)/0.5);if(hub>0){ctx.shadowColor=rgba(MD.agreed,0.9);ctx.fillStyle=rgba(MD.agreed,hub);ctx.beginPath();ctx.arc(cx,cy,r*0.17,0,TAU);ctx.fill();}ctx.restore();}
function md_veil(ctx,S,a){if(a<=0)return;setScreen(ctx,S);ctx.fillStyle="rgba(4,8,18,"+clamp(a,0,1)+")";ctx.fillRect(0,0,W,H);}
function md_title(ctx,S,t,t0,title,sub,line){const oA=ag_in(t,t0,0.8),tA=ag_in(t,t0+0.5,0.8);if(oA<=0)return;md_veil(ctx,S,oA*0.9);setScreen(ctx,S);
  withA(ctx,tA,()=>{md_mark(ctx,960,320,64,(t-t0-0.4)/1.8,1);md_T(ctx,title,960,520,{w:800,size:84,align:"center"});
    if(sub)md_T(ctx,sub,960,598,{w:600,size:36,align:"center",col:MD.soft});withA(ctx,ag_in(t,t0+1.2,0.8),()=>md_T(ctx,line,960,700,{w:800,size:28,ls:3.5,align:"center",col:MD.flow}));});}
// n: "Film 1 of 3"; series: the series' name
function md_end(ctx,S,t,t0,title,line,n,series){const oA=ag_in(t,t0,1.0),tA=ag_in(t,t0+0.6,0.9);if(oA<=0)return;md_veil(ctx,S,oA*0.92);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)md_T(ctx,line,960,350,{w:700,size:48,align:"center"});md_mark(ctx,960,496,56,(t-t0-0.7)/1.6,1);md_T(ctx,title,960,650,{w:800,size:44,align:"center"});
    md_T(ctx,(n?n+" · ":"")+(series||"Modern data basics")+" · Learning Data",960,708,{w:600,size:28,align:"center",col:MD.soft});});}
