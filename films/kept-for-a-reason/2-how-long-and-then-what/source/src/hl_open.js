/* ===== How long, and then what: the opening's live pieces =====
   What the opening draws over its places (hl_past.js): transfer boxes piling up, typed sheets and lists, a
   building in section and the Archives in glass filling with drawers, the Act and its schedule on the desk with their stamps, and the
   papers on the platform. Words are typed (IBM Plex Mono) in dark ink on paper, or on the module's cards; every word at least 28 px. */

// how far into its life a thing is at t: in over d from a, out over d from b (0 to 1)
const hl_v=(t,a,b,d)=>ag_in(t,a,d||0.6)*(b==null?1:1-ag_in(t,b,d||0.6));
const HL_INK=[34,28,22],HL_PAPER=[228,218,194];

/* ---------------------------------------------------------------- boxes */
// transfer boxes piled on a cabinet's top, sliding in by u: brown card boxes, a lighter lid edge, a pale label (no words)
function hl_boxes(c,x,y,w,u,seed){if(u<=0)return;const R=hl_rnd(seed||5);let yy=y;c.save();c.globalAlpha*=clamp(u*2,0,1);
  for(let i=0;i<3;i++){const bw=w*(0.78+R()*0.18),bh=74+R()*30,bx=x+(w-bw)/2+(R()-0.5)*20,k=ag_spr(u*1.8,i*0.25,0.8),dy=(1-k)*-90;if(k<=0)break;
    c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=14;c.fillStyle=hl_rgb(mix([126,94,62],[96,72,48],R()));c.fillRect(bx,yy-bh+dy,bw,bh);c.restore();
    c.fillStyle="rgba(255,226,180,0.22)";c.fillRect(bx,yy-bh+dy,bw,3);c.fillStyle="rgba(230,214,180,0.55)";c.fillRect(bx+bw*0.3,yy-bh*0.62+dy,bw*0.4,bh*0.3);yy-=bh;}
  c.restore();}

/* ---------------------------------------------------------------- typed sheets and lists */
// a typed sheet: its title lines in a typewriter's letters, then faint typed lines (decoration); turned by o.rot about its middle
function hl_sheet(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const pad=o.pad||30;c.save();c.globalAlpha*=a;c.translate(x+w/2,y+h/2);c.rotate(o.rot||0);c.translate(-w/2,-h/2);
  c.save();c.shadowColor="rgba(0,0,0,0.5)";c.shadowBlur=22;c.shadowOffsetY=8;c.fillStyle=hl_rgb(o.col||HL_PAPER);c.fillRect(0,0,w,h);c.restore();
  let yy=pad;if(o.title){o.title.forEach((l,i)=>dp_T(c,l,o.center?w/2:pad,yy+30+i*42,{w:700,size:o.size||30,f:"mono",col:HL_INK,align:o.center?"center":"left"}));yy+=30+(o.title.length-1)*42+10;}
  c.fillStyle="rgba(70,58,44,0.32)";const n=o.lines==null?5:o.lines;for(let i=0;i<n;i++){const lw=(i%4===3?0.5:0.86)*(w-2*pad);c.fillRect(pad,yy+22+i*28,lw,5);}
  c.restore();}
// a pile of papers, n sheets, its bottom at y, its middle at x
function hl_pile(c,x,y,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||n<=0)return;const R=hl_rnd(o.seed||9),w=o.w||300;c.save();c.globalAlpha*=a;
  for(let i=0;i<n;i++){const yy=y-i*7,dx=(R()-0.5)*18;c.fillStyle=hl_rgb(mix(HL_PAPER,[150,140,120],0.15+0.35*R()));c.fillRect(x-w/2+dx,yy-6,w,6);c.fillStyle="rgba(0,0,0,0.25)";c.fillRect(x-w/2+dx,yy,w,1);}
  c.restore();}

/* ---------------------------------------------------------------- a building in section, and the Archives in glass */
// a tiny steel cabinet, as the diagrams draw them
function hl_cabIcon(c,x,y,w,h,k){c.fillStyle=hl_rgb(mix([96,104,86],[150,128,90],0.3*k));c.fillRect(x,y,w,h);c.fillStyle="rgba(0,0,0,0.35)";for(let d=1;d<4;d++)c.fillRect(x,y+h*d/4,w,1.5);
  c.fillStyle=rgba(HL_STEEL.brass,0.7);for(let d=0;d<4;d++)c.fillRect(x+w*0.35,y+h*(d+0.5)/4,w*0.3,2);}
// a government building cut open, floor by floor: a frame of light, each floor's room warm and filling with cabinets as fill[i] goes 0 to 1
function hl_section(c,x,y,w,h,fill,a){if(a<=0)return;const n=fill.length,fh=h/n,ice=DP.ice;c.save();c.globalAlpha*=a;
  for(let i=0;i<n;i++){const fy=y+h-(i+1)*fh,f=clamp(fill[i],0,1);c.fillStyle="rgba(6,20,26,0.55)";c.fillRect(x,fy,w,fh);
    if(f>0){c.fillStyle=rgba([255,206,140],0.16*f);c.fillRect(x,fy,w,fh);const m=Math.floor(f*16);for(let j=0;j<m;j++)hl_cabIcon(c,x+14+j*((w-28)/16),fy+fh-8-fh*0.62,(w-28)/16-6,fh*0.62,f);}
    c.fillStyle=rgba(ice,0.5);c.fillRect(x,fy+fh-2,w,2);}
  c.strokeStyle=rgba(ice,0.85);c.lineWidth=2.4;c.shadowColor=rgba(DP.F.cyan,0.6);c.shadowBlur=10;c.strokeRect(x,y,w,h);
  c.beginPath();c.moveTo(x-20,y);c.lineTo(x+w/2,y-70);c.lineTo(x+w+20,y);c.closePath();c.stroke();c.restore();}
// the National Archives' building drawn in lines of light (a podium, a row of columns, the attic, a low pediment), filling from the
// bottom with cabinets as u goes 0 to 1
function hl_archGlass(c,x,y,w,h,u,a){if(a<=0)return;const ice=DP.ice,pod=h*0.13,att=h*0.2,colH=h-pod-att;c.save();c.globalAlpha*=a;
  c.fillStyle="rgba(6,20,26,0.55)";c.fillRect(x,y,w,h);
  if(u>0){c.save();c.beginPath();c.rect(x,y+h-(h)*u,w,h*u);c.clip();c.fillStyle=rgba([255,206,140],0.16);c.fillRect(x,y,w,h);
    const rows=8,cols=18,cw=(w-24)/cols,ch=(h-20)/rows;for(let r=0;r<rows;r++)for(let k=0;k<cols;k++)hl_cabIcon(c,x+12+k*cw+2,y+h-10-(r+1)*ch+4,cw-4,ch-8,1);c.restore();}
  c.strokeStyle=rgba(ice,0.85);c.lineWidth=2.4;c.shadowColor=rgba(DP.F.cyan,0.6);c.shadowBlur=10;c.strokeRect(x,y,w,h);
  c.beginPath();c.moveTo(x,y+h-pod);c.lineTo(x+w,y+h-pod);c.moveTo(x,y+att);c.lineTo(x+w,y+att);c.stroke();
  c.lineWidth=1.6;for(let i=0;i<10;i++){const cx=x+w*(i+0.5)/10;c.beginPath();c.moveTo(cx,y+att);c.lineTo(cx,y+h-pod);c.stroke();}
  c.lineWidth=2.4;c.beginPath();c.moveTo(x+w*0.25,y);c.lineTo(x+w/2,y-h*0.12);c.lineTo(x+w*0.75,y);c.stroke();c.restore();}
// a drawer's front, as the diagrams draw them: lit warm, or dimmed to grey (dim 0 to 1)
function hl_drawerIcon(c,x,y,w,h,dim){const col=mix([110,118,98],[56,62,62],dim),warm=1-dim;
  c.save();c.shadowColor=rgba([255,206,140],0.35*warm);c.shadowBlur=18*warm;c.fillStyle=hl_rgb(col);c.fillRect(x,y,w,h);c.restore();
  c.fillStyle=rgba([255,236,210],0.25*warm+0.06);c.fillRect(x,y,w,2);c.fillStyle=hl_rgb(mix(HL_STEEL.card,[80,84,84],dim));c.fillRect(x+w*0.25,y+h*0.18,w*0.5,h*0.2);
  c.fillStyle=hl_rgb(mix(HL_STEEL.brass,[70,74,74],dim));c.fillRect(x+w*0.3,y+h*0.55,w*0.4,h*0.1);}

/* ---------------------------------------------------------------- the desk: the Act, its schedule, the stamps */
// the page of the Act of 7 July 1943, typed; and, as it turns (turn 0 to 1), the page under it: a records disposal schedule, its three
// columns, its rows faint typed lines (decoration); lit 0 to 1 lights each of its columns "How long" and "Then"
function hl_actPage(c,P,o){o=o||{};const turn=clamp(o.turn||0,0,1),k=Math.cos(turn*Math.PI/2),hh=P.h*k;
  // while the Act's page still covers the schedule (its top edge at lim), each of the schedule's words comes in as the edge uncovers it
  const lim=turn>0&&turn<1?P.y+P.h-hh:null,T=(s,x,y,q)=>{const a=lim==null?1:clamp((lim-y-10)/24,0,1);if(a>0)withA(c,a,()=>dp_T(c,s,x,y,q));};
  const sched=()=>{hl_sheet(c,P.x,P.y,P.w,P.h,{lines:0,col:[230,222,200]});
    T("Records disposal schedule",P.x+P.w/2,P.y+84,{w:700,size:34,f:"mono",align:"center",col:HL_INK});
    c.fillStyle="rgba(34,28,22,0.6)";c.fillRect(P.x+40,P.y+112,P.w-80,2);
    const cols=[[P.x+40,"Kind of record",0],[P.x+420,"How long",o.litLong||0],[P.x+640,"Then",o.litThen||0]];
    for(const [x,s,l] of cols){if(l>0){c.save();c.globalAlpha*=l;c.fillStyle="rgba(255,206,110,0.42)";c.fillRect(x-14,P.y+124,dp_tw(c,s,{w:700,size:30,f:"mono"})+28,P.h-150);c.restore();}
      T(s,x,P.y+166,{w:700,size:30,f:"mono",col:HL_INK});}
    c.fillStyle="rgba(34,28,22,0.45)";c.fillRect(P.x+40,P.y+186,P.w-80,1.5);
    c.fillStyle="rgba(70,58,44,0.30)";for(let r=0;r<11;r++){const yy=P.y+226+r*40;c.fillRect(P.x+40,yy,300-(r%3)*50,5);c.fillRect(P.x+420,yy,150-(r%2)*40,5);c.fillRect(P.x+640,yy,100+(r%2)*20,5);}};
  // the Act's words; once its page folds away, read already, they are part of the page's picture (deco), however small the fold makes them
  const act=()=>{hl_sheet(c,P.x,P.y,P.w,P.h,{lines:0});const deco=turn>0?1:0;
    dp_T(c,"AN ACT",P.x+P.w/2,P.y+92,{w:700,size:40,f:"mono",align:"center",col:HL_INK,ls:6,deco});
    ["To provide for the disposal of","certain records of the United","States Government."].forEach((l,i)=>dp_T(c,l,P.x+P.w/2,P.y+170+i*46,{w:600,size:32,f:"mono",align:"center",col:HL_INK,deco}));
    c.fillStyle="rgba(70,58,44,0.30)";for(let r=0;r<9;r++)c.fillRect(P.x+60,P.y+356+r*34,(r%4===3?0.5:0.86)*(P.w-120),5);};
  if(turn<=0){act();return;}
  sched();if(turn>=1)return;
  // the Act's page folding down over its bottom edge, towards us, foreshortened and falling into shadow, until it's gone edge-on
  c.save();c.beginPath();c.rect(P.x-40,P.y+P.h-hh,P.w+80,hh);c.clip();c.translate(0,P.y+P.h);c.scale(1,Math.max(0.001,k));c.translate(0,-(P.y+P.h));act();
  c.fillStyle="rgba(20,14,8,"+(0.3*(1-k)).toFixed(3)+")";c.fillRect(P.x,P.y,P.w,P.h);c.restore();}
// a rubber stamp's mark, landing (u 0 to 1: it drops and presses, then stays): a ring of ink round its words, and a green tick
function hl_stamp(c,x,y,words,u,rot){if(u<=0)return;const k=1+0.5*(1-ag_eo(clamp(u*2.5,0,1))),a=clamp(u*3,0,1),w=dp_tw(c,words,{w:700,size:30})+120,h=76;
  c.save();c.globalAlpha*=a;c.translate(x,y);c.rotate(rot||0);c.scale(k,k);
  c.strokeStyle="rgba(24,104,64,0.85)";c.lineWidth=4;rr(c,-w/2,-h/2,w,h,12);c.stroke();rr(c,-w/2+7,-h/2+7,w-14,h-14,8);c.lineWidth=1.5;c.stroke();
  dp_T(c,words,-w/2+92,11,{w:700,size:30,col:[16,84,50]});c.restore();
  if(u>0.35){c.save();c.translate(x,y);c.rotate(rot||0);dp_tick(c,-w/2+48,0,"allowed",clamp((u-0.35)*3,0,1));c.restore();}}

/* ---------------------------------------------------------------- the platform's papers */
// the papers heaped on the cart's open crate: most grey (the useless), a few warm white (the valuable), mixed; lift (0 to 1) raises two
// warm ones, each with its words, and sink (0 to 1) takes them back down among the grey
const HL_HEAP=(()=>{const R=hl_rnd(1945),s=[];for(let i=0;i<22;i++){const warm=[3,9,15,19].includes(i);s.push({x:520+R()*420,y:610+R()*90-i*2,w:150+R()*60,r:(R()-0.5)*0.5,warm});}return s;})();
function hl_heap(c,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;
  for(const s of HL_HEAP){c.save();c.translate(s.x,s.y);c.rotate(s.r);c.shadowColor="rgba(0,0,0,0.4)";c.shadowBlur=8;c.fillStyle=s.warm?"rgb(246,236,212)":"rgb(120,124,122)";c.fillRect(-s.w/2,-14,s.w,28);c.restore();
    if(s.warm){c.save();c.globalCompositeOperation="lighter";hl_glow(c,s.x,s.y,70,[255,214,160],0.18*(o.warm==null?1:o.warm));c.restore();}}
  c.restore();}
