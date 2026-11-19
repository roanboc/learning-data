/* ===== The people kit: handwriting =====
   A film's key ideas stand apart from its scenes (the author, 17 November 2026: "important information now too merged in the
   scene"). The ideas a film opens with are explained by someone at a board; what to remember, a remark or a conclusion, is a
   person's colourful notes in a book. Both are written by hand as the voice says them, in the kit's handwriting font (kalam.js),
   with a pen's marks round them: a line under a heading, a highlighter's band, a ring, a box, an arrow, a tick. This file holds
   the writing; concepts.js holds the board and the book.

     PK.hand(ctx, s, x, y, o)   words written by hand, their baseline at (x, y). o.size (48), o.w (400; 700 for a heading or a
                                marker), o.col, o.p (0 to 1: how far they are written, from the left), o.a, o.align, o.deco
                                (decoration: too small to read on purpose, as on a board far off). -> {w, x0, x1, pen}
     PK.handW(ctx, s, size, w)  how wide they are
     PK.pen.<mark>(…)           a pen's mark, as rows of points: line, under, hl, strike, box, ring, arrow, tick, cross, star
     PK.strokes(ctx, rows, col, w, p, o)   draws a mark as far as p (0 to 1) -> where the pen is
     PK.ink(ctx, items, t, o)   a board's or a page's writing, item by item, each when its time comes -> where the pen is

   PK.ink's items are rows, drawn in the order given, in the surface's own px from its top left corner:
     {s, x, y, at, d, size, w, col, align, marks}   words. at: when the pen starts, in the scene's seconds (none: they are there
          from the start); d: how long the pen takes (by default from their length). marks: what the pen adds once they are
          written, each [kind, col, at, d]: "under" (a line under them), "under2" (two), "hl" (a highlighter's band), "strike"
          (a line through them: what isn't so), "box" or "ring" (round them). A mark comes right after the words, one after
          the other, unless it has an at of its own. Words with no x go on from the words before them, on their line, a
          space on (gap): a few words of a line in another colour or weight
     {k, at, d, col, …}    a mark of its own: k "line" or "arrow" (x, y, x1, y1, bow), "box" (x, y, w, h), "ring" (x, y, rx, ry),
          "tick", "cross", "star" or "dot" (x, y, r), "hl" or "under" (x, y, w, size)
     {draw(ctx, p, it), at, d, pen(p)}   a drawing of the film's own, p from 0 to 1 (pen: where its pen is)
   A colour is one of the kit's names ("ink", "blue", "green", "amber", "orange", "mut") or [r, g, b]. Colour keeps its meaning
   in handwriting too: ink for the words; blue a plan or a rule, green something done or of value, amber a risk or a cost, orange
   data, for a heading's line, a highlight or a mark. o: {x, y (the surface's corner in the picture), k (its scale), a, lw (the
   pen's width: 5; a marker's 7), deco, aside (1.4: between two items no further apart than this, the pen stays over the page)}.
   -> {pen: [x, y] in the picture, on: 0 to 1 (how far the pen is down on the surface), lift, i (the item), col (its colour)}
   Handwriting is 40 px or more as it is seen: 44 to 56 for a line, 60 to 84 for a heading. */
(K=>{
const {TAU,lerp,clamp,sine,pin,mix,css}=K.u;
K.FT_HAND="Kalam,'Segoe Print','Bradley Hand','Comic Sans MS',cursive";
if(typeof FT!=="undefined")FT.hand=K.FT_HAND;
// the font's two weights, from the film's own script: loading starts here, and the film waits for the page's fonts before it starts
K.handReady=(()=>{try{if(typeof FontFace==="undefined"||typeof document==="undefined"||!document.fonts||!K.KALAM)return Promise.resolve(false);
  return Promise.all([400,700].map(w=>{const f=new FontFace("Kalam","url("+K.KALAM[w]+") format('woff2')",{weight:String(w),style:"normal"});document.fonts.add(f);return f.load();})).then(()=>true,()=>false);}
  catch(e){return Promise.resolve(false);}})();
// a highlighter's colours: the five meanings, light enough to write over
K.HL={blue:[160,204,242],green:[164,222,180],amber:[250,214,122],orange:[250,190,152],violet:[204,194,246],mut:[222,216,206],ink:[222,216,206]};
const colOf=c=>Array.isArray(c)?c:(c&&K.C[c])||K.C.ink,hlOf=c=>Array.isArray(c)?c:(c&&K.HL[c])||K.HL.amber;
K.inkCol=colOf;

K.handW=(ctx,s,size,w)=>ag_tw(ctx,s,{w:w||400,size:size||48,f:"hand"});
K.hand=(ctx,s,x,y,o)=>{o=o||{};const size=o.size||48,wt=o.w||400,W=K.handW(ctx,s,size,wt),p=o.p==null?1:clamp(o.p,0,1),x0=o.align==="center"?x-W/2:o.align==="right"?x-W:x;
  if(p>0&&(o.a==null||o.a>0.004)){ctx.save();if(o.a!=null)ctx.globalAlpha*=clamp(o.a,0,1);
    if(p<1){ctx.beginPath();ctx.rect(x0-8,y-size*1.15,(W+16)*p,size*1.7);ctx.clip();}
    ag_T(ctx,s,x0,y,{w:wt,size,f:"hand",color:css(colOf(o.col)),deco:o.deco||K.inkDeco});ctx.restore();}
  return{w:W,x0,x1:x0+W,pen:[x0+W*p,y-size*0.26]};};

/* ---------------------------------------------------------------- a pen's marks
   A pen's line isn't ruled: its points sway a little, the same way every time. Each mark is rows of points (a row is one stroke),
   so it can be drawn as far as the pen has come. */
const sway=(i,seed,amp)=>(Math.sin(i*0.83+seed*1.7)+0.6*Math.sin(i*2.1+seed*0.9))*amp/1.6;
const seg=(x0,y0,x1,y1,o)=>{o=o||{};const L=Math.hypot(x1-x0,y1-y0)||1,n=Math.max(2,Math.round(L/10)),nx=-(y1-y0)/L,ny=(x1-x0)/L,amp=o.amp==null?1.5:o.amp,out=[];
  for(let i=0;i<=n;i++){const u=i/n,d=(o.bow||0)*Math.sin(Math.PI*u)+(i&&i<n?sway(i,o.seed||0,amp):0);out.push([lerp(x0,x1,u)+nx*d,lerp(y0,y1,u)+ny*d]);}return out;};
K.pen={
  line:(x0,y0,x1,y1,o)=>[seg(x0,y0,x1,y1,o)],
  under:(x,y,w,o)=>{o=o||{};const g=o.gap==null?10:o.gap,a=[seg(x-4,y+g,x+w+6,y+g-2,{seed:x+y,bow:-1.5})];if(o.two)a.push(seg(x+w+2,y+g+9,x-2,y+g+10,{seed:x+y+3,bow:1}));return a;},
  hl:(x,y,w,size)=>[seg(x-8,y-size*0.3,x+w+8,y-size*0.3-1,{seed:x+y,amp:0.8})],          // drawn wide, with a flat end
  strike:(x,y,w,size)=>[seg(x-8,y-size*0.26,x+w+8,y-size*0.32,{seed:x+y,bow:1.5})],
  box:(x,y,w,h,o)=>{const s=x+y,j=i=>sway(i,s,2.4),a=[x+j(1),y+j(2)],b=[x+w+j(3),y+j(4)],c=[x+w+j(5),y+h+j(6)],d=[x+j(7),y+h+j(8)];
    return[[].concat(seg(a[0]+8,a[1],b[0],b[1],{seed:s}),seg(b[0],b[1],c[0],c[1],{seed:s+1}).slice(1),seg(c[0],c[1],d[0],d[1],{seed:s+2}).slice(1),seg(d[0],d[1],a[0]-1,a[1]-2,{seed:s+3}).slice(1),[[a[0]+16,a[1]-3]])];},
  ring:(cx,cy,rx,ry,o)=>{o=o||{};const n=Math.max(26,Math.round((rx+ry)/5)),a0=o.a0==null?-2.5:o.a0,out=[];
    for(let i=0;i<=n;i++){const u=i/n,a=a0+u*TAU*1.07,g=1+0.06*(u-0.5)+0.012*Math.sin(u*9+cx);out.push([cx+Math.cos(a)*rx*g,cy+Math.sin(a)*ry*g]);}return[out];},
  arrow:(x0,y0,x1,y1,o)=>{o=o||{};const b=seg(x0,y0,x1,y1,{bow:o.bow||0,seed:x0+y1,amp:1}),n=b.length,e=b[n-1],q=b[Math.max(0,n-3)],g=Math.atan2(e[1]-q[1],e[0]-q[0]),h=o.head||22;
    return[b,[[e[0]-Math.cos(g-0.5)*h,e[1]-Math.sin(g-0.5)*h],e,[e[0]-Math.cos(g+0.5)*h,e[1]-Math.sin(g+0.5)*h]]];},
  tick:(x,y,r)=>[[[x-r*0.58,y-r*0.02],[x-r*0.34,y+r*0.2],[x-r*0.14,y+r*0.44],[x+r*0.06,y+r*0.12],[x+r*0.34,y-r*0.3],[x+r*0.66,y-r*0.66]]],
  cross:(x,y,r)=>[seg(x-r*0.6,y-r*0.6,x+r*0.6,y+r*0.6,{seed:x,amp:0.8}),seg(x+r*0.6,y-r*0.62,x-r*0.6,y+r*0.58,{seed:y,amp:0.8})],
  star:(x,y,r)=>{const out=[];for(let i=0;i<=5;i++){const a=-Math.PI/2+i*TAU*0.4;out.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);}return[out];}
};
const lenOf=rows=>{let L=0;for(const r of rows)for(let i=1;i<r.length;i++)L+=Math.hypot(r[i][0]-r[i-1][0],r[i][1]-r[i-1][1]);return L;};
// the box a mark's points lie in: [x0, y0, x1, y1]
const boxOf=rows=>{const b=[1e9,1e9,-1e9,-1e9];for(const r of rows)for(const q of r){b[0]=Math.min(b[0],q[0]);b[1]=Math.min(b[1],q[1]);b[2]=Math.max(b[2],q[0]);b[3]=Math.max(b[3],q[1]);}return b;};
K.strokes=(ctx,rows,col,w,p,o)=>{o=o||{};p=p==null?1:clamp(p,0,1);let end=rows[0][0];if(p<=0)return end;
  let left=lenOf(rows)*p+0.01;ctx.save();if(o.a!=null)ctx.globalAlpha*=clamp(o.a,0,1);ctx.strokeStyle=css(colOf(col));ctx.lineWidth=w||5;ctx.lineCap=o.cap||"round";ctx.lineJoin="round";ctx.beginPath();
  for(let k=0;k<rows.length&&left>0;k++){const r=rows[k];ctx.moveTo(r[0][0],r[0][1]);end=r[0];
    for(let i=1;i<r.length&&left>0;i++){const d=Math.hypot(r[i][0]-r[i-1][0],r[i][1]-r[i-1][1]);
      if(d>left){const u=left/(d||1);end=[lerp(r[i-1][0],r[i][0],u),lerp(r[i-1][1],r[i][1],u)];ctx.lineTo(end[0],end[1]);left=0;}else{ctx.lineTo(r[i][0],r[i][1]);end=r[i];left-=d;}}}
  ctx.stroke();ctx.restore();return end;};
// where a mark's pen is at p, without drawing it
const penOn=(rows,p)=>{let left=lenOf(rows)*clamp(p,0,1),end=rows[0][0];for(const r of rows){end=r[0];for(let i=1;i<r.length;i++){const d=Math.hypot(r[i][0]-r[i-1][0],r[i][1]-r[i-1][1]);
    if(d>=left)return[lerp(r[i-1][0],r[i][0],left/(d||1)),lerp(r[i-1][1],r[i][1],left/(d||1))];left-=d;end=r[i];}}return end;};

/* ---------------------------------------------------------------- a surface's writing
   Every stroke of the pen on a board or a page, in the order it is drawn: {i (its item), t0, t1, col, draw(ctx, p), at(p), box
   ([x0, y0, x1, y1]: where it lies), text (words), line (a line drawn along something: a writer walks along it)} */
const durOf=s=>clamp(0.3+String(s).length*0.05,0.5,2.6);
function plan(ctx,items,o){const out=[],lw=o.lw||5;let last=null;
  items.forEach((it,i)=>{const timed=it.at!=null,t0=timed?it.at:-1e9;
    if(it.s!=null){const size=it.size||48,wt=it.w||400,W=K.handW(ctx,it.s,size,wt),
        // words with no x go on from the words before them, on their line, a space on (another colour or weight in one line)
        ix=it.x!=null?it.x:last?last.x1+(it.gap==null?size*0.3:it.gap):0,iy=it.y!=null?it.y:last?last.y:0,
        x0=it.align==="center"?ix-W/2:it.align==="right"?ix-W:ix,d=it.d||durOf(it.s),t1=timed?t0+d:-1e9,col=colOf(it.col||o.col);last={x1:x0+W,y:iy};
      const words={i,t0,t1,own:timed,col,text:true,x0,x1:x0+W,box:[x0,iy-size*0.78,x0+W,iy+size*0.24],draw:(c,p)=>K.hand(c,it.s,x0,iy,{size,w:wt,col,p,deco:o.deco}),at:p=>[x0+W*p,iy-size*0.26]},under=[],over=[];let tm=t1+0.18;
      (it.marks||[]).forEach((m,mi)=>{const [kind,mc,mat,md]=m,hl=kind==="hl",c2=hl?hlOf(mc):colOf(mc||it.col),dd=md||(hl?0.5:kind==="ring"||kind==="box"?0.6:0.4),a0=!timed?-1e9:mat!=null?mat:tm;if(timed&&mat==null)tm=a0+dd+0.12;
        const line=kind!=="box"&&kind!=="ring",r0=kind==="hl"?K.pen.hl(x0,iy,W,size):kind==="under"?K.pen.under(x0,iy,W):kind==="under2"?K.pen.under(x0,iy,W,{two:true}):kind==="strike"?K.pen.strike(x0,iy,W,size):
          kind==="box"?K.pen.box(x0-16,iy-size*0.98,W+32,size*1.36):K.pen.ring(x0+W/2,iy-size*0.3,W/2+36,size*0.86),
          // a writer who walks along a board (o.walk) draws a line back along the words, from where they stand
          rows=o.walk&&line?r0.map(r=>r.slice().reverse()):r0;
        (hl?under:over).push({i,m:mi,t0:a0,t1:timed?a0+dd:-1e9,own:timed&&mat!=null,col:c2,line,box:boxOf(rows),draw:(c,p)=>K.strokes(c,rows,c2,hl?size*0.66:lw*(kind==="strike"?1.1:1),p,hl?{cap:"butt",a:0.78}:{}),at:p=>penOn(rows,p)});});
      out.push(...under,words,...over);return;}
    if(it.draw){const d=it.d||0.6,at=p=>it.pen?it.pen(p):[it.x||0,it.y||0];out.push({i,t0,t1:timed?t0+d:-1e9,own:timed,col:colOf(it.col||o.col),box:it.box||boxOf([[at(0),at(0.25),at(0.5),at(0.75),at(1)]]),draw:(c,p)=>it.draw(c,p,it),at});return;}
    const k=it.k,col=k==="hl"?hlOf(it.col):colOf(it.col||o.col),d=it.d||(k==="dot"?0.2:k==="tick"||k==="cross"?0.35:k==="hl"?0.5:0.55),t1=timed?t0+d:-1e9;
    if(k==="dot"){out.push({i,t0,t1,own:timed,col,box:[it.x-(it.r||7),it.y-(it.r||7),it.x+(it.r||7),it.y+(it.r||7)],draw:(c,p)=>{c.save();c.fillStyle=css(col);c.beginPath();c.arc(it.x,it.y,(it.r||7)*sine(p),0,TAU);c.fill();c.restore();},at:()=>[it.x,it.y]});return;}
    const rows=k==="line"?K.pen.line(it.x,it.y,it.x1,it.y1,{bow:it.bow,seed:it.x+it.y}):k==="arrow"?K.pen.arrow(it.x,it.y,it.x1,it.y1,{bow:it.bow,head:it.head}):k==="box"?K.pen.box(it.x,it.y,it.w,it.h):
      k==="ring"?K.pen.ring(it.x,it.y,it.rx,it.ry):k==="tick"?K.pen.tick(it.x,it.y,it.r||18):k==="cross"?K.pen.cross(it.x,it.y,it.r||18):k==="star"?K.pen.star(it.x,it.y,it.r||18):
      k==="hl"?K.pen.hl(it.x,it.y,it.w,it.size||48):k==="under"?K.pen.under(it.x,it.y,it.w,{two:it.two}):null;
    if(!rows)throw new Error("PK.ink: no mark called "+k);
    out.push({i,t0,t1,own:timed,col,line:k==="line"||k==="arrow"||k==="hl"||k==="under",box:boxOf(rows),draw:(c,p)=>K.strokes(c,rows,col,k==="hl"?(it.size||48)*0.66:(it.lw||lw),p,k==="hl"?{cap:"butt",a:0.78}:{}),at:p=>penOn(rows,p)});});
  return out;}
// every timed stroke, in the order the pen draws them: what a writer's hand and feet follow (concepts.js); all: also what is there
// from the start, in the order given
K.inkPlan=(ctx,items,o,all)=>{const P=plan(ctx,items,o||{});return all?P:P.filter(s=>s.t1>-1e8).sort((x,y)=>x.t0-y.t0);};
K.ink=(ctx,items,t,o)=>{o=o||{};const k=o.k||1,ox=o.x||0,oy=o.y||0,P=plan(ctx,items,o),aside=o.aside==null?1.4:o.aside,a=o.a==null?1:clamp(o.a,0,1);
  // what a row draws of its own (a designed board's or page's drawing, PK.sk) is decoration too where the surface is (PK.inkDeco)
  if(a>0.004){const d0=K.inkDeco;K.inkDeco=!!o.deco;ctx.save();try{ctx.translate(ox,oy);ctx.scale(k,k);ctx.globalAlpha*=a;for(const s of P){const p=s.t1<=-1e8?1:clamp((t-s.t0)/((s.t1-s.t0)||1),0,1);if(p>0)s.draw(ctx,p);}}finally{ctx.restore();K.inkDeco=d0;}}
  // where the pen is: on the stroke being drawn; between two strokes close in time, on its way from one to the next; else lifted away
  const T=P.filter(s=>s.t1>-1e8).sort((x,y)=>x.t0-y.t0);let cur=null,pv=null,nx=null;
  for(const s of T){if(t>=s.t0&&t<=s.t1){if(!cur)cur=s;}else if(s.t1<t){if(!pv||s.t1>=pv.t1)pv=s;}else if(!nx||s.t0<nx.t0)nx=s;}
  const out=q=>[ox+q[0]*k,oy+q[1]*k];
  if(cur)return{pen:out(cur.at(clamp((t-cur.t0)/((cur.t1-cur.t0)||1),0,1))),on:1,lift:0,i:cur.i,col:cur.col};
  if(pv&&nx&&nx.t0-pv.t1<=aside){const u=sine((t-pv.t1)/((nx.t0-pv.t1)||1)),A=pv.at(1),B=nx.at(0);return{pen:out([lerp(A[0],B[0],u),lerp(A[1],B[1],u)]),on:1,lift:Math.sin(Math.PI*u),i:u<0.5?pv.i:nx.i,col:u<0.5?pv.col:nx.col};}
  const kOut=pv?1-pin(t,pv.t1+0.2,0.5):0,kIn=nx?pin(t,nx.t0-0.6,0.5):0;
  if(kIn>=kOut&&nx)return{pen:out(nx.at(0)),on:kIn,lift:1-kIn,i:nx.i,col:nx.col};
  if(pv)return{pen:out(pv.at(1)),on:kOut,lift:1-kOut,i:pv.i,col:pv.col};
  return{pen:null,on:0,lift:1,i:-1,col:K.C.ink};};
})(PK);
