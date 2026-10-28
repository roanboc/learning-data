/* ===== Change without surprises: the university's pictures =====
   Only the university's own places, from the series' rooms.js: Mei's desk, Jun's desk and the data team's room and its board, Yusuf's
   office and its shelf, the meeting room, Planning. The pictures are the film's own papers: Monday night's change notice for award, the
   change board's calendar and form, Jun's change request, the register's page "Who uses what", the impact note and its three
   headings, the bar of credit towards an award, the wallet on a learner's phone, the table of credentials as a ruled page, Mei's stamp,
   the new mark, the two editions, Jun's notice in two kinds of words, and the new box on the change request form. In plain words: the
   series' first pack shows no file, code or technical screen. Every name starts with cw_ or CW. */

/* ---------- helpers ---------- */
// made once per chapter, the first time it draws: its cues are known by then
const cw_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the year and the place in the top corner: the latest one passed, dissolving from the one before
function cw_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1)wc_year(ctx,56,72,mk[i-1][1],a*(1-u));wc_year(ctx,56,72,mk[i][1],a*u);}
// a tag that springs in at t0 and goes at t1 (or stays)
function cw_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}
// the words on a thing the camera closes in on: read when it's close, and only a texture of words while it's far, so they're
// marked as decoration while smaller than 28 px as seen. Each of them is read somewhere in its chapter, close. o.max shrinks a
// line to fit a width.
function cw_T(ctx,s,x,y,o){o=Object.assign({},o||{});let sz=o.size||28;if(o.max){const w=tw(ctx,s,sz,o.w||600,o.f);if(w>o.max)sz*=o.max/w;}o.size=sz;
  const m=ctx.getTransform(),k=Math.sqrt(Math.abs(m.a*m.d-m.b*m.c))*W/ctx.canvas.width;if(sz*k<27)o.deco=1;wc_T(ctx,s,x,y,o);}
// a name card, as the series introduces people: the name, then the role; it rises a little as it comes
function cw_nameCard(ctx,x,y,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60);
  withA(ctx,a,()=>{ctx.save();ctx.translate(0,12*(1-a));wc_panel(ctx,x,y,w,112,{kind:"card",seed:3});wc_T(ctx,name,x+30,y+48,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,role,x+30,y+90,{w:600,size:28,col:WC_MUTED});ctx.restore();});}
// where a figure's hand is on the place, for a pose: the figure stands at (x, y) at scale s
function cw_handAt(id,x,y,s,pose,side){const P_=PEOPLE[id],k=s*P_.build.h,po=POSE[pose],h=handAt(P_,side,side<0?po.L:po.R,0);return[x+k*h[0],y+k*h[1]];}

/* ---------- 1967, held and carried ---------- */
// a bundle of the booklets, held in both hands: their edges, and the top one's cover with its H
function cw_heldBooklets(n){return(cx,P_,hands)=>{if(n<=0)return;const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+12);
  for(let i=0;i<n;i++){cx.fillStyle=rgba(i%2?[238,234,224]:[252,250,244],1);cx.fillRect(-72,-(i+1)*9,144,9);}cx.strokeStyle=rgba(WC_PENCIL,0.5);cx.lineWidth=1.6;cx.strokeRect(-72,-n*9,144,n*9);
  cx.translate(0,-n*9);cx.transform(1,0,0,0.42,0,0);cx.fillStyle=rgba([252,250,244],1);cx.fillRect(-72,-200,144,200);cx.strokeRect(-72,-200,144,200);cx.restore();
  cw_H(cx,mx,my+12-n*9-46,62,CW.navy,0);fingers(cx,P_,[[mx-74,my+4],[mx+74,my+4]]);};}
// a pack of milk in the right hand
function cw_heldTetra(cx,P_,hands){const r=hands[1];cw_tetra(cx,r[0]+6,r[1]+52,104);fingers(cx,P_,[[r[0],r[1]+6]]);}

const WC_PLACES={x67dawn:c=>cw_paintStreet(c,"dawn"),x67night:c=>cw_paintStreet(c,"night"),x67day:c=>cw_paintStreet(c,"day"),
  x66border:cw_paintBorder,x66borderBar:cw_paintBorderBar,x66road:cw_paintRoad66,x63office:cw_paintOffice63,x63officeT:cw_paintOffice63T,x67pole:cw_paintPole,
  x67post:cw_paintPost,x67postT:cw_paintPostT,x67grocer:cw_paintGrocer,x67grocerT:cw_paintGrocerT,x67desk:cw_paintDesk67,x67deskT:cw_paintDesk67T};
