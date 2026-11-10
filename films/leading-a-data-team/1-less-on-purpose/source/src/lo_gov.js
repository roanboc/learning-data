/* ===== Less, on purpose: Britain, 2010 to 2013 =====
   The opening's own pictures (prefix lo_). The module's kit draws the rooms, the people, the sheets and the things in them, and is never
   changed for this film; what is here is this film's alone. Nothing here is a likeness of a real website: no crest, no logo, no
   typeface of its own, and the pages' words are the film's. Martha Lane Fox is never drawn: her review is a sheet.
     loOffice, loHome, loLondon   the wall of the web in 2010, a government office's wall on a grey day, where the many websites' pages
                                  hang; a home on an evening, its lamp lit; the new team's room in London on a grey day, 2011 and 2012
     LO_RESIDENT                  someone at home in 2010, looking for the right page (the agent films' spec, drawn by the kit)
     lo_card(ctx, x, y, w, h, o)  a small sheet, light enough to draw by the hundred: o.col (its band), o.tilt, o.a
     lo_page(ctx, x, y, w, h, i, o)   one small web page of site i: its header in the site's own grey, a nav, a title, lines
     lo_pages(ctx, t, o)          hundreds of small pages in a grid on the wall, each site's own look (none in a colour that means
                                  something): o.n (0 to 1: they come in from the middle), o.same (0 to 1: three that say the same thing,
                                  outlined in amber), o.dim (0 to 1), o.box (0 to 1: they fly into the archive box at LO_BOX), o.a
     lo_twoPages(ctx, o)          two pages, larger, that give the same advice in different words (o.a, o.k)
     lo_letter(ctx, x, y, o)      the review of October 2010 as a sheet: its title, and its advice line by line (o.u)
     lo_box(ctx, x, y, o)         an archive box with its label; o.fill (0 to 1: pages inside it)
     lo_stacks(ctx, o)            the two old sites' pages in two stacks on a table, o.left (0 to 1: how much of each is left);
                                  lo_stackNames(ctx, o) their names, drawn after the pages that fly from them
     lo_sort(ctx, t, o)           the two sites' pages read one by one: most go to the archive box, a few become needs on the wall (o.u)
     lo_plain(ctx, x, y, w, o)    one plain page: a title, a few short lines and a green button (what the person came for)
   Colour keeps the module's meaning: amber the cost and the confusion (the money, the same advice twice), blue the design (the review's
   advice, the principles), green what people got (the needs kept, the results, the button that does what they came for). The pages
   themselves wear only greys. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.loOffice=c=>lp_paintRoom(c,{light:"grey",seed:11,base:[220,212,200]});
AG_PLACES.loHome=c=>lp_paintRoom(c,{light:"evening",seed:13,base:[222,204,186],lamp:[1520,250]});
AG_PLACES.loLondon=c=>lp_paintRoom(c,{light:"grey",seed:21,base:[226,214,198]});

/* ---------------------------------------------------------------- someone at home, 2010 */
const LO_RESIDENT={name:"",key:"lo-resident",skin:[232,198,172],hair:{style:"bun",c:[176,170,164]},glasses:[70,60,56],earrings:[206,196,180],
  top:{kind:"cardigan",c:[124,112,104],inner:[232,228,220]},breath:0.29};

/* ---------------------------------------------------------------- a small sheet, cheap enough to draw by the hundred */
function lo_card(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  if(o.tilt){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.tilt);ctx.translate(-x-w/2,-y-h/2);}
  // its shadow, soft enough without a blur: two offset layers, down and to the left
  ctx.fillStyle="rgba(52,36,30,0.10)";ctx.fillRect(x-5,y+6,w,h);ctx.fillStyle="rgba(52,36,30,0.12)";ctx.fillRect(x-2.5,y+3,w,h);
  ctx.fillStyle=rgba(o.paper||LP.paper,1);ctx.fillRect(x,y,w,h);if(o.col){ctx.fillStyle=rgba(o.col,1);ctx.fillRect(x,y,w,Math.max(4,h*0.1));}
  ctx.restore();}

/* ---------------------------------------------------------------- the many websites' pages
   Each site its own grey header, its own layout; nothing in a colour that means something. */
const LO_TONES=[[128,124,120],[150,140,128],[112,116,120],[160,152,140],[134,136,124],[118,108,104],[170,164,156],[140,132,136],[104,104,108]];
const lo_hash=i=>{let h=(i+1)*2654435761>>>0;h^=h>>>15;h=Math.imul(h,2246822519)>>>0;h^=h>>>13;return h>>>0;};
function lo_page(ctx,x,y,w,h,i,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const hs=lo_hash(i),tone=o.tone||LO_TONES[(o.site==null?hs:lo_hash(o.site+5000))%LO_TONES.length],lay=(hs>>>8)%4;
  lo_card(ctx,x,y,w,h,{a,tilt:o.tilt});ctx.save();ctx.globalAlpha*=a;if(o.tilt){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.tilt);ctx.translate(-x-w/2,-y-h/2);}
  const hh=h*0.2;ctx.fillStyle=rgba(tone,1);ctx.fillRect(x,y,w,hh);ctx.fillStyle=rgba(mix(tone,[255,255,255],0.55),1);ctx.fillRect(x+w*0.06,y+hh*0.3,w*0.16,hh*0.4);
  const p=w*0.08,ink=mix(LP.mut,LP.paper,0.35),pale=mix(LP.mut,LP.paper,0.62);let cx=x+p,cw=w-2*p;
  if(lay===1){ctx.fillStyle=rgba(mix(tone,LP.paper,0.7),1);ctx.fillRect(x,y+hh,w*0.24,h-hh);cx=x+w*0.3;cw=w*0.62;}
  if(lay===2){ctx.fillStyle=rgba(mix(tone,LP.paper,0.55),1);ctx.fillRect(x+p,y+hh+h*0.08,cw,h*0.22);}
  const y0=y+hh+h*(lay===2?0.38:0.12);ctx.fillStyle=rgba(ink,1);ctx.fillRect(cx,y0,cw*0.62,Math.max(2,h*0.07));
  ctx.fillStyle=rgba(pale,1);const n=lay===3?5:3;for(let k=0;k<n;k++){const ly=y0+h*(0.16+k*0.11);if(ly>y+h-h*0.06)break;ctx.fillRect(cx,ly,cw*(k%2?0.78:0.92),Math.max(1.5,h*0.045));}
  if(lay===3){ctx.fillStyle=rgba(mix(tone,LP.paper,0.4),1);ctx.fillRect(x+w-p-w*0.22,y+hh+h*0.1,w*0.22,h*0.3);}
  ctx.restore();}
// the grid: 24 by 12 pages, each 58 by 44, from (149, 151)
const LO_G={cols:24,rows:12,w:58,h:44,gx:10,gy:10,x0:149,y0:151};
// three pages, in three different sites, that give the same advice
const LO_SAME=[[3,5],[8,15],[2,19]];
// where the archive box stands (its middle at the foot) when the pages go into it
const LO_BOX={x:1640,y:860};
function lo_pages(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const G=LO_G,n=o.n==null?1:o.n,cxm=G.x0+(G.cols*(G.w+G.gx)-G.gx)/2,cym=G.y0+(G.rows*(G.h+G.gy)-G.gy)/2;
  const dmax=Math.hypot(cxm-G.x0,cym-G.y0),bx=o.box||0;ctx.save();ctx.globalAlpha*=a*(1-0.5*(o.dim||0));
  for(let r=0;r<G.rows;r++)for(let c=0;c<G.cols;c++){const i=r*G.cols+c,px=G.x0+c*(G.w+G.gx),py=G.y0+r*(G.h+G.gy),d=Math.hypot(px+G.w/2-cxm,py+G.h/2-cym)/dmax,
      hs=lo_hash(i+700);let u=clamp((n*1.18-d*0.92-((hs%97)/97)*0.08)/0.1,0,1);if(u<=0)continue;
    // into the box: each page leaves in its own moment, flies in an arc, and shrinks into the box's mouth
    let x=px,y=py,s=1,al=ag_sine(u),tl=((hs>>>4)%11-5)*0.006;
    if(bx>0){const v=clamp(bx*1.7-((hs>>>9)%100)/100*0.7,0,1),e=ag_sine(v);if(v>=1)continue;
      x=lerp(px,LO_BOX.x-G.w/2,e);y=lerp(py,LO_BOX.y-170-G.h/2,e)-Math.sin(Math.PI*e)*90;s=lerp(1,0.55,e);al*=1-ag_in(v,0.82,0.18);tl+=e*0.5*(hs%2?1:-1);}
    // each page a little askew and its own size; the pages of one site (a block of 3 by 2) share their header's grey
    const jx=((hs>>>12)%9-4)*1.4,jy=((hs>>>16)%9-4)*1.2,js=1+((hs>>>20)%7-3)*0.03,site=Math.floor(c/3)+Math.floor(r/2)*8;
    const f=lerp(0.7,1,ag_spr(u,0,0.5));ctx.save();ctx.translate(x+G.w/2+jx,y+G.h/2+jy);ctx.scale(f*s*js,f*s*js);lo_page(ctx,-G.w/2,-G.h/2,G.w,G.h,i,{a:al,tilt:tl+((hs>>>24)%9-4)*0.006,site});ctx.restore();}
  // the three that give the same advice, outlined in amber
  const sa=(o.same||0)*(1-clamp(bx*3,0,1));if(sa>0.004){ctx.strokeStyle=rgba(LP.amber,sa);ctx.lineWidth=4;
    for(const [r,c] of LO_SAME){const px=G.x0+c*(G.w+G.gx),py=G.y0+r*(G.h+G.gy);ctx.strokeRect(px-5,py-5,G.w+10,G.h+10);}}
  ctx.restore();}

/* ---------------------------------------------------------------- two pages, larger: the same advice in different words */
function lo_bigPage(ctx,x,y,w,h,title,lines,tone,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:null,pin:false});ctx.fillStyle=rgba(tone,1);ctx.fillRect(x,y,w,44);ctx.fillStyle=rgba(mix(tone,[255,255,255],0.55),1);ctx.fillRect(x+22,y+14,70,16);
  const tl=lp_wrap(ctx,title,w-60,{w:800,size:32});let yy=y+44+52;for(const l of tl){lp_T(ctx,l,x+30,yy,{w:800,size:32});yy+=42;}
  ctx.fillStyle=rgba(mix(LP.mut,LP.paper,0.55),1);for(let k=0;k<lines;k++){ctx.fillRect(x+30,yy+k*26,(w-60)*(k%3===2?0.62:0.9),10);}
  if(o.ring>0.004){ctx.strokeStyle=rgba(LP.amber,o.ring);ctx.lineWidth=5;ctx.strokeRect(x-8,y-8,w+16,h+16);}
  ctx.restore();}
function lo_twoPages(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;
  lo_bigPage(ctx,150,150,470,300,"Renewing your passport",5,LO_TONES[2],{a,k:o.k,ring:o.ring});
  lo_bigPage(ctx,1300,170,470,300,"Passport renewal: how to apply",4,LO_TONES[5],{a:a*(o.b==null?1:o.b),k:o.k2,ring:o.ring});}

/* ---------------------------------------------------------------- the review of October 2010, as a sheet */
// o.u (0 to 1: its four points come in), o.a, o.k; returns its box
function lo_letter(ctx,x,y,o){o=o||{};return lp_textSheet(ctx,x,y,o.w||760,{kick:"October 2010 · Martha Lane Fox",title:"A review of Directgov",
  lines:["One website for the whole of government","One team that answers for what people find","Don't move the old pages across","Write only what people need; archive the rest"]},
  {col:LP.blue,light:null,a:o.a,k:o.k,u:o.u});}

/* ---------------------------------------------------------------- an archive box */
// (x, y): the middle of its foot; o.fill (0 to 1: the pages inside it show over its rim); o.a; o.label (its words)
function lo_box(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=o.w||300,h=w*0.62;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle="rgba(52,36,30,0.16)";ctx.beginPath();ctx.ellipse(x-14,y+4,w*0.56,16,0,0,TAU);ctx.fill();
  // the pages inside, their tops over the rim
  const f=clamp(o.fill||0,0,1);if(f>0){for(let k=0;k<9;k++){const px=x-w*0.42+k*w*0.094,ph=lerp(4,30,f)*(0.6+0.4*((k*37)%10)/10);ctx.fillStyle=rgba(k%2?LP.paper:mix(LP.paper,LP.wall,0.3),1);ctx.fillRect(px,y-h-ph,w*0.09,ph+6);}}
  let g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,rgba(mix([168,146,116],LP.shade,0.28),1));g.addColorStop(1,rgba([176,154,122],1));ctx.fillStyle=g;ctx.fillRect(x-w/2,y-h,w,h);
  ctx.fillStyle=rgba(mix([168,146,116],LP.shade,0.4),1);ctx.fillRect(x-w/2,y-h,w,10);
  // its hand hole, and a label
  ctx.fillStyle=rgba(mix([168,146,116],LP.shade,0.6),1);rr(ctx,x-w*0.13,y-h+28,w*0.26,18,9);ctx.fill();
  const lw=w*0.72,lx=x-lw/2,ly=y-h*0.55;ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(lx,ly,lw,58);ctx.strokeStyle=rgba(LP.mut,0.4);ctx.lineWidth=1.5;ctx.strokeRect(lx+4,ly+4,lw-8,50);
  lp_T(ctx,o.label||"Archived",x,ly+40,{w:800,size:30,align:"center"});ctx.restore();}

/* ---------------------------------------------------------------- the two old sites, read page by page */
// two stacks of pages on a table, each with its name; o.left (0 to 1: how much of each stack is left), o.a
const LO_STACKS=[[250,"Directgov",30],[620,"Business Link",22]];
function lo_stacks(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const left=o.left==null?1:o.left;
  lp_table(ctx,110,800,700,{floor:null});
  for(const [sx,name,n] of LO_STACKS){const k=Math.max(2,Math.round(n*left));
    for(let j=0;j<k;j++){const yy=780-j*9,dx=((j*29)%7-3)*2;ctx.fillStyle="rgba(52,36,30,0.1)";ctx.fillRect(sx-112+dx-4,yy+2,224,9);ctx.fillStyle=rgba(j%2?LP.paper:mix(LP.paper,LP.wall,0.25),1);ctx.fillRect(sx-112+dx,yy,224,8);}}
  ctx.restore();}
// the two stacks' names, where each stack's top was: drawn after the pages that fly from them, so they stay readable
function lo_stackNames(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;for(const [sx,name,n] of LO_STACKS)lp_T(ctx,name,sx,780-n*9-30,{w:800,size:32,align:"center",a});}
// o.u (0 to 1): pages leave the stacks one after another; four in five arc down into the box, one in five up onto the wall of needs,
// where it lands as a card with a green band. o.a
const LO_NEEDS=[[1150,210],[1310,210],[1470,210],[1630,210],[1150,330],[1310,330],[1470,330],[1630,330]];
function lo_sort(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=clamp(o.u||0,0,1),N=40;ctx.save();ctx.globalAlpha*=a;
  let need=0;for(let k=0;k<N;k++){const keep=k%5===2,from=k%2?[620,600]:[250,560],s0=k/N*0.86,v=clamp((u-s0)/0.14,0,1);if(v<=0){if(keep)need++;continue;}const e=ag_sine(v);
    if(keep){const q=LO_NEEDS[need%LO_NEEDS.length];need++;const x=lerp(from[0],q[0],e),y=lerp(from[1],q[1],e)+Math.sin(Math.PI*e)*60;
      if(v<1)lo_card(ctx,x-60,y-40,120,80,{col:LP.green,tilt:(1-e)*0.3});continue;}
    if(v>=1)continue;const x=lerp(from[0],LO_BOX.x,e),y=lerp(from[1],LO_BOX.y-200,e)-Math.sin(Math.PI*e)*170,s=lerp(1,0.6,e);
    lo_page(ctx,x-58*s/2*1.6,y-44*s/2*1.6,58*s*1.6,44*s*1.6,k+40,{a:1-ag_in(v,0.85,0.15),tilt:e*0.6*(k%2?1:-1)});}
  // the cards that have landed on the wall of needs, each with its lines
  let m=0;for(let k=0;k<N;k++){if(k%5!==2)continue;const s0=k/N*0.86,v=clamp((u-s0)/0.14,0,1),q=LO_NEEDS[m%LO_NEEDS.length];m++;if(v<1)continue;
    lo_card(ctx,q[0]-60,q[1]-40,120,80,{col:LP.green});ctx.fillStyle=rgba(mix(LP.mut,LP.paper,0.45),1);ctx.fillRect(q[0]-44,q[1]-14,80,7);ctx.fillRect(q[0]-44,q[1]+2,62,6);ctx.fillRect(q[0]-44,q[1]+16,72,6);}
  ctx.restore();}

/* ---------------------------------------------------------------- one plain page */
// (x, y) its top left, w wide; a plain heading, three short lines and a green button: what the person came to do. o.a, o.k
function lo_plain(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*1.18;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:null,pin:false});ctx.fillStyle=rgba(LP.ink,1);ctx.fillRect(x,y,w,40);
  lp_T(ctx,o.title||"Renew a passport",x+34,y+104,{w:800,size:36});
  ctx.fillStyle=rgba(mix(LP.mut,LP.paper,0.5),1);for(let k=0;k<3;k++)ctx.fillRect(x+34,y+140+k*30,(w-68)*(k===2?0.6:0.92),11);
  const bw=Math.min(w-68,230),by=y+h-118;ctx.fillStyle=rgba(mix(LP.green,LP.shade,0.35),1);ctx.fillRect(x+34,by+6,bw,64);ctx.fillStyle=rgba(LP.green,1);ctx.fillRect(x+34,by,bw,64);
  lp_T(ctx,"Start now",x+34+bw/2,by+43,{w:800,size:30,align:"center",color:"#fff"});ctx.restore();}
