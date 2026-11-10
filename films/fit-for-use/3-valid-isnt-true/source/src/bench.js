/* ===== Valid isn't true: the university's things, on the quality bench =====
   This film's own pictures for the bench, in the kit's look (films/fit-for-use/shared, never changed for one film): Zoë Lefèvre, the
   list in its card tray, the rules as gauge cards, the portal's page, the three references (the graduate, the folder seen at enrolment,
   always closed, and the exam boards' bound lists), award cards, the envelope to the printer. Brass is the reference, steel blue a
   measure, the verdicts' colours their verdicts; nothing else here uses them. Every top-level name starts with vt_ or VT_. */

// Zoë Lefèvre, a March graduate, new in this film: drawn to the kit's rules (an adult's proportions, one three-quarter head, arms
// down), in none of the module's six colours; looked at full size, facing both ways, on 5 November 2026
const VT_ZOE={key:"vtZoe",name:"Zoë Lefèvre",role:"Graduate, Bachelor of Arts",skin:[236,202,178],hair:{style:"long",c:[98,64,42]},earrings:[224,216,204],
  top:{kind:"cardigan",c:[188,140,134],inner:[240,234,226]},breath:0.3};
// where people stand behind the bench: their y, and the height they're cut at
const VT_P={y:588,s:0.98,cut:DQ_BENCH.back};

// a name typed in the mono face, its accented letters in brass (the graduate's own spelling, the reference); u types it letter by letter
function vt_name(ctx,s,x,y,o){o=o||{};const size=o.size||34,f={w:500,size,f:"mono"},n=o.u==null?s.length:Math.floor(clamp(o.u,0,1)*s.length+1e-6),shown=s.slice(0,n),a=o.a==null?1:o.a;if(a<=0.004)return;
  const x0=o.align==="center"?x-dq_tw(ctx,s,f)/2:x,acc=c=>/[\u00C0-\u017E]/.test(c);
  // the name in runs: plain letters in ink, accented ones in brass
  let i=0;while(i<shown.length){const k=acc(shown[i]);let j=i;while(j<shown.length&&acc(shown[j])===k)j++;
    dq_T(ctx,shown.slice(i,j),x0+dq_tw(ctx,shown.slice(0,i),f),y,Object.assign({col:k?"brass":(o.col||DQ.ink),a},f));i=j;}
  if(o.caret&&n<s.length){const px=x0+dq_tw(ctx,shown,f);ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(DQ.ink,0.8);ctx.fillRect(px+2,y-size*0.8,3,size);ctx.restore();}}

// the list: index cards standing in an oak tray on the bench, seen from the front. x its middle, y its foot on the bench; o.w (480),
// o.label and o.sub on the paper label on its front; o.a, o.k (springs up from its foot)
function vt_tray(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=o.w||480,fh=112,top=y-fh;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x,y,lerp(0.7,1,ag_spr(o.k,0,0.6)));
  ag_floorShadow(ctx,x-14,y-2,w*0.56,10,0.55);
  // the cards behind the tray's front, their tops stepping forward, a few tabs, lit from the right
  const R=ag_rnd(1064),n=11;for(let i=0;i<n;i++){const yy=top-64+i*5+R()*3,xx=x-w/2+16,cw=w-32;let g=ctx.createLinearGradient(xx,0,xx+cw,0);
    const base=mix(DQ.paper,[150,138,118],0.03+0.05*(n-i)/n+0.04*R());g.addColorStop(0,rgba(mix(base,[0,0,0],0.06),1));g.addColorStop(1,rgba(base,1));ctx.fillStyle=g;ctx.fillRect(xx,yy,cw,top-yy+6);
    ctx.fillStyle="rgba(110,90,66,0.38)";ctx.fillRect(xx,yy,cw,1.3);
    if(i%3===1){const tx=xx+40+R()*(cw-150);ctx.fillStyle=rgba(mix(base,[150,138,118],0.08),1);ctx.fillRect(tx,yy-14,70,16);ctx.fillStyle="rgba(110,90,66,0.38)";ctx.fillRect(tx,yy-14,70,1.3);ctx.fillRect(tx,yy-14,1.3,14);}}
  // the tray's front: oak, lit from the right, a darker foot
  let g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,rgba(ag_dk(DQ.oak,0.28),1));g.addColorStop(1,rgba(ag_lt(DQ.oak,0.1),1));ctx.fillStyle=g;rr(ctx,x-w/2,top,w,fh,6);ctx.fill();
  g=ctx.createLinearGradient(0,top,0,y);g.addColorStop(0,"rgba(255,236,206,0.18)");g.addColorStop(0.12,"rgba(255,236,206,0)");g.addColorStop(1,"rgba(0,0,0,0.25)");ctx.fillStyle=g;rr(ctx,x-w/2,top,w,fh,6);ctx.fill();
  // the label, in a small graphite frame
  if(o.label){const lw=o.lw||w-70,lh=o.sub?86:58,lx=x-lw/2,ly=top+(fh-lh)/2;ctx.fillStyle=rgba(DQ.graphite,1);rr(ctx,lx-5,ly-5,lw+10,lh+10,5);ctx.fill();ctx.fillStyle=rgba(DQ.paper,1);ctx.fillRect(lx,ly,lw,lh);
    dq_T(ctx,o.label,x,ly+(o.sub?36:40),{w:700,size:30,align:"center"});if(o.sub)dq_T(ctx,o.sub,x,ly+72,{w:500,size:28,align:"center",col:DQ.soft});}
  ctx.restore();}

// a rule as a gauge card: its words on a card with a brass edge (a requirement), and a steel light along its foot while it measures
// (o.lit, 0 to 1); o.a, o.k; returns its box
function vt_rule(ctx,x,y,w,title,o){o=o||{};const bb=dq_textCard(ctx,x,y,w,{kick:o.kick||"check",title},{edge:"brass",icon:"gauge",a:o.a,k:o.k});
  const l=clamp(o.lit||0,0,1),a=o.a==null?1:o.a;if(l>0.004&&a>0.004){ctx.save();ctx.globalAlpha*=a*l;ctx.fillStyle=rgba(DQ.steel,1);rr(ctx,x+16,bb.y+bb.h-14,w-32,7,3.5);ctx.fill();ctx.restore();}
  return bb;}

// a phone, its screen the portal's page: "Your name, as it will be printed", the name, and two buttons. x, y its top left (440 x 700);
// o.name (as the list holds it), o.typed (the name as she writes it, typed as o.tu goes 0 to 1, over o.name once it starts), o.press
// (1 "This is my name", 2 "This isn't my name"), o.pu (the press, 0 to 1), o.a, o.k
const VT_PHONE={w:440,h:700};
function vt_portal(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=VT_PHONE.w,h=VT_PHONE.h;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.6)));
  ctx.save();dq_shadow(ctx,o.on);ctx.fillStyle=rgba(DQ.graphite,1);rr(ctx,x,y,w,h,46);ctx.fill();ctx.restore();
  let g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,255,255,0.1)");g.addColorStop(0.5,"rgba(255,255,255,0)");ctx.fillStyle=g;rr(ctx,x,y,w,h,46);ctx.fill();
  const sx=x+18,sy=y+18,sw=w-36,sh=h-36;ctx.fillStyle="rgb(252,250,245)";rr(ctx,sx,sy,sw,sh,30);ctx.fill();
  ctx.fillStyle=rgba(DQ.graphite,1);rr(ctx,x+w/2-46,sy+10,92,20,10);ctx.fill();
  dq_label(ctx,sx+30,sy+92,"Graduation",{size:28});
  dq_T(ctx,"Your name, as it",sx+30,sy+150,{w:700,size:32});dq_T(ctx,"will be printed",sx+30,sy+192,{w:700,size:32});
  // the name, in its field: the list's, or, once typing starts, hers, its accents in brass
  const fy=sy+232,typing=o.typed&&o.tu>0;ctx.strokeStyle=typing?rgba(DQ.ink,0.75):"rgba(110,90,66,0.45)";ctx.lineWidth=typing?2.6:1.6;rr(ctx,sx+24,fy,sw-48,74,12);ctx.stroke();
  if(typing)vt_name(ctx,o.typed,sx+44,fy+50,{size:32,u:o.tu,caret:true});else if(o.name)dq_T(ctx,o.name,sx+44,fy+50,{w:500,size:32,f:"mono"});
  // the two buttons; the one pressed fills with ink, and its words turn cream
  [["This is my name",1],["This isn't my name",2]].forEach(([s,i],k)=>{const by=sy+352+k*104,p=o.press===i?clamp(o.pu==null?1:o.pu,0,1):0;
    ctx.fillStyle=rgba(mix([252,250,245],DQ.ink,0.92*p),1);rr(ctx,sx+24,by,sw-48,78,39);ctx.fill();ctx.strokeStyle=rgba(DQ.ink,0.7);ctx.lineWidth=2;rr(ctx,sx+24,by,sw-48,78,39);ctx.stroke();
    dq_T(ctx,s,sx+sw/2,by+50,{w:700,size:30,align:"center",color:rgba(mix(DQ.ink,DQ.paper,p),1)});});
  ctx.restore();}

// the identity document seen at enrolment, as a closed buff folder standing on the bench, tied with string; it's never opened, and no
// document is ever shown. x its middle, y its foot; o.a, o.k; o.touch (0 to 1) leans it a little towards the left, as if laid on a card
function vt_folder(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=300,h=380,L=x-w/2,T0=y-h;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x,y,lerp(0.7,1,ag_spr(o.k,0,0.6)));if(o.touch){ctx.translate(x,y);ctx.rotate(-0.05*ag_sine(o.touch));ctx.translate(-x,-y);}
  ag_floorShadow(ctx,x-12,y-2,w*0.56,10,0.5);
  const buff=[222,206,172];ctx.save();dq_shadow(ctx,"wall",0.8);ctx.fillStyle=rgba(ag_dk(buff,0.08),1);ctx.beginPath();ctx.moveTo(L+18,T0+8);ctx.lineTo(L+120,T0+8);ctx.lineTo(L+136,T0-22);ctx.lineTo(L+230,T0-22);ctx.lineTo(L+246,T0+8);ctx.lineTo(L+w-6,T0+8);ctx.lineTo(L+w-6,y);ctx.lineTo(L+18,y);ctx.closePath();ctx.fill();ctx.restore();
  // the papers inside, their edges just showing at the top and the open side
  ctx.fillStyle=rgba(DQ.paper,1);rr(ctx,L+8,T0+6,w-4,h-10,3);ctx.fill();ctx.strokeStyle="rgba(120,96,64,0.3)";ctx.lineWidth=1;rr(ctx,L+8,T0+6,w-4,h-10,3);ctx.stroke();
  ctx.beginPath();ctx.moveTo(L+w+1,T0+16);ctx.lineTo(L+w+1,y-8);ctx.stroke();
  let g=ctx.createLinearGradient(L,0,L+w,0);g.addColorStop(0,rgba(ag_dk(buff,0.1),1));g.addColorStop(1,rgba(ag_lt(buff,0.08),1));ctx.fillStyle=g;rr(ctx,L,T0+14,w,h-14,6);ctx.fill();
  ctx.strokeStyle="rgba(120,96,64,0.45)";ctx.lineWidth=1.4;rr(ctx,L,T0+14,w,h-14,6);ctx.stroke();
  // its cream label, written by hand: two lines of ink too small to read, there to say it's a file, not to be read
  ctx.save();dq_shadow(ctx,"wall",0.3);ctx.fillStyle=rgba(DQ.paper,1);rr(ctx,x-96,T0+56,192,70,5);ctx.fill();ctx.restore();ctx.strokeStyle="rgba(120,96,64,0.45)";ctx.lineWidth=1.2;rr(ctx,x-96,T0+56,192,70,5);ctx.stroke();
  ctx.strokeStyle=rgba(DQ.ink,0.55);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-72,T0+82);ctx.bezierCurveTo(x-30,T0+78,x+10,T0+86,x+60,T0+80);ctx.moveTo(x-72,T0+104);ctx.bezierCurveTo(x-44,T0+101,x-16,T0+107,x+18,T0+103);ctx.stroke();
  // the tape, round it both ways, and its bow: a darker brown than the folder, so it reads as tied shut
  const tape=[128,92,58],ty=T0+h*0.56;ctx.strokeStyle=rgba(tape,0.95);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(L,ty);ctx.lineTo(L+w,ty);ctx.moveTo(x+40,T0+14);ctx.lineTo(x+40,y);ctx.stroke();
  ctx.lineWidth=3.4;ctx.beginPath();ctx.ellipse(x+22,ty-9,18,9,-0.5,0,TAU);ctx.moveTo(x+76,ty-9);ctx.ellipse(x+58,ty-9,18,9,0.5,0,TAU);ctx.moveTo(x+40,ty);ctx.quadraticCurveTo(x+30,ty+14,x+20,ty+30);ctx.moveTo(x+40,ty);ctx.quadraticCurveTo(x+52,ty+14,x+62,ty+28);ctx.stroke();
  ctx.fillStyle=rgba(tape,1);ctx.beginPath();ctx.arc(x+40,ty-2,6,0,TAU);ctx.fill();
  ctx.restore();}

// the exam boards' approved lists: three bound volumes lying one on another, brass corners on their covers, a cream label on each spine.
// x the stack's middle, y its foot; o.a, o.k
function vt_boards(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.7,1,ag_spr(o.k,0,0.6)));
  ag_floorShadow(ctx,x-14,y-2,250,10,0.55);
  const vols=[[0,400,58,[60,56,58]],[-14,384,52,[84,62,46]],[10,370,50,[60,56,58]]];let yy=y;
  for(const [dx,w,h,col] of vols){const L=x-w/2+dx,T0=yy-h;let g=ctx.createLinearGradient(L,0,L+w,0);g.addColorStop(0,rgba(ag_dk(col,0.25),1));g.addColorStop(1,rgba(ag_lt(col,0.12),1));ctx.fillStyle=g;rr(ctx,L,T0,w,h,7);ctx.fill();
    // the pages' edge, a cream line along the top; the spine's bands and label
    ctx.fillStyle=rgba(mix(DQ.paper,[0,0,0],0.08),1);ctx.fillRect(L+10,T0+3,w-20,5);ctx.fillStyle="rgba(255,240,214,0.18)";ctx.fillRect(L,T0+10,w,2);
    ctx.fillStyle=rgba(DQ.paper,0.92);ctx.fillRect(L+w/2-60,T0+16,120,h-30);ctx.fillStyle="rgba(110,90,66,0.5)";for(let k=0;k<3;k++)ctx.fillRect(L+w/2-44,T0+22+k*7,88,1.6);
    // the brass corners
    ctx.fillStyle=rgba(DQ.brass,1);for(const cx of [L,L+w-26]){ctx.beginPath();ctx.moveTo(cx,T0+(cx===L?0:0));ctx.lineTo(cx+26,T0);ctx.lineTo(cx===L?cx:cx+26,T0+h);ctx.closePath();}ctx.fill();
    ctx.fillStyle="rgba(255,236,190,0.35)";ctx.fillRect(L,T0,w,1.5);yy=T0;}
  ctx.restore();}

// an award, on a small card: the list's (steel edge: what the list measured) or the boards' (brass edge: the reference); o.dash (a
// place with no card: the award is missing), o.glow (a verdict's colour lighting the empty place), o.a, o.k; returns its box
const VT_AWARD={w:330,h:104};
function vt_award(ctx,x,y,title,o){o=o||{};const a=o.a==null?1:o.a,w=VT_AWARD.w,h=VT_AWARD.h;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  if(o.glow>0.004){ctx.save();ctx.globalAlpha*=o.glow;ctx.fillStyle=rgba(dq_tone(o.glowCol||"stop").col,0.14);rr(ctx,x-8,y-8,w+16,h+16,14);ctx.fill();ctx.restore();}
  dq_card(ctx,x,y,w,h,{edge:o.edge,dash:o.dash});
  if(!o.dash||o.ghost){dq_T(ctx,"AWARD",x+DQ_PAD,y+42,{w:800,size:28,ls:4,col:o.edge?dq_tone(o.edge).word:DQ.soft,a:o.dash?0.8:1});dq_T(ctx,title,x+DQ_PAD,y+84,{w:700,size:30,col:o.dash?DQ.soft:DQ.ink});}
  if(o.glow>0.004&&o.dash){ctx.save();ctx.globalAlpha*=o.glow;ctx.strokeStyle=rgba(dq_tone(o.glowCol||"stop").col,1);ctx.lineWidth=3;ctx.setLineDash([12,9]);rr(ctx,x+2,y+2,w-4,h-4,8);ctx.stroke();ctx.restore();}
  ctx.restore();return{x,y,w,h};}

// the envelope to the printer: buff, its flap closed (o.close, 0 to 1), its words on a label; x, y its top left (600 x 380); o.a, o.k
function vt_envelope(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=600,h=380,buff=[222,204,166];ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.6)));
  ctx.save();dq_shadow(ctx,o.on);ctx.fillStyle=rgba(buff,1);rr(ctx,x,y,w,h,6);ctx.fill();ctx.restore();
  let g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(ag_dk(buff,0.08),1));g.addColorStop(1,rgba(ag_lt(buff,0.06),1));ctx.fillStyle=g;rr(ctx,x,y,w,h,6);ctx.fill();
  // the flap, folding down from the top over the opening
  const c=ag_sine(clamp(o.close==null?1:o.close,0,1)),fy=y+lerp(-150,150,c);ctx.fillStyle=rgba(ag_dk(buff,lerp(0.18,0.06,c)),1);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w/2,fy);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(120,96,64,0.45)";ctx.lineWidth=1.6;ctx.stroke();
  if(o.label){const lx=x+70,ly=y+186,lw=w-140,lh=o.sub?120:72;ctx.fillStyle=rgba(DQ.paper,1);ctx.fillRect(lx,ly,lw,lh);ctx.strokeStyle="rgba(110,90,66,0.35)";ctx.lineWidth=1.2;ctx.strokeRect(lx,ly,lw,lh);
    dq_T(ctx,o.label,lx+24,ly+46,{w:700,size:32});if(o.sub)dq_T(ctx,o.sub,lx+24,ly+92,{w:500,size:28,col:DQ.soft});}
  ctx.restore();}

// people the data is about, as small icons in a row (n of them, each s px), in ink, or a meaning's colour; o.a, o.u (they come in left
// to right, 0 to 1)
function vt_folk(ctx,x,y,n,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;for(let i=0;i<n;i++){const ia=a*(o.u==null?1:sstep(i/n*0.8,i/n*0.8+0.2,o.u));if(ia<=0.004)continue;
  dq_icon(ctx,"person",x+i*s*1.05,y,s,o.col||DQ.soft,{a:ia});}}

// a count: a big number, and its words beside it, in ink or a meaning's colour; returns its width
function vt_count(ctx,x,y,num,words,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||64,nf={w:700,size},nw=dq_tw(ctx,num,nf);if(a<=0.004)return nw;
  dq_T(ctx,num,x,y,Object.assign({col:o.col||DQ.ink,a,dark:o.dark},nf));if(words)dq_T(ctx,words,x+nw+18,y-Math.round(size*0.06),{w:500,size:o.wsize||30,col:o.wcol||(o.dark?DQ.chalkSoft:DQ.soft),dark:o.dark,a});
  return nw;}
