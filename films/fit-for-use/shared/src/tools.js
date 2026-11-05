/* ===== Data quality: the tools' pages =====
   Tools look like their pages, drawn for the film, never a click-by-click tour and never a screenshot: a light page with a small bar
   along its top naming the product, with its official logo where the film's film.json says "logos": true (The Inner Life of Data's
   Databricks and dbt marks, logos.js there), and no release status anywhere on it. The page stands before the wall or lies on the
   granite like the cards (o.on), with the same soft shadow. What it shows is drawn by the film in its body, often with the rows and
   the code below. Every word is at least 28 px as seen: a page drawn small is a picture, and its words are marked as decoration
   ({deco: 1}). The student system, the portal and the printer are the university's own and named by what they do, never by a maker.
     dq_window(ctx, x, y, w, h, o)     a tool's page: o.logo (a logo's key: "databricks", "dbt"), o.product ("Databricks"), o.title (what
                                       the page is, at the right of the bar: "Catalog Explorer"), o.edge (a colour that means something),
                                       o.on, o.a, o.k; o.draw(ctx, body) draws in the body {x, y, w, h}; returns the body
     dq_rows(ctx, x, y, cols, rows, o) a table of words: cols [{h: "NAME", w: 300, f: "mono"}, ...] (each column's heading, width and
                                       font), rows [[cell, ...], ...], a cell a string or {s, col (a meaning or a colour), icon, f, mark
                                       (a verdict's round stamp after the words)}; o.rh (row height, 54), o.lit (a row's index, or
                                       several: a pale band, and o.litCol a bar in a colour that means something), o.rowA(row, i) (rows
                                       coming in one by one), o.a; returns the height drawn
     dq_code(ctx, x, y, lines, o)      code or a file, typed: lines, each a string or [[text, col], ...] (runs, col a meaning or a
                                       colour); o.lh (line height, 44), o.lit (a line's index, or several: a pale band), o.lineA(line, i),
                                       o.size (28), o.a; returns the height drawn */

function dq_window(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,bar=68,body={x:x+24,y:y+bar+18,w:w-48,h:h-bar-40};if(a<=0.004)return body;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{edge:o.edge,on:o.on,r:12,fill:"rgb(252,250,245)"});
  ctx.save();rr(ctx,x+1.5,y+1.5,w-3,bar,11);ctx.clip();ctx.fillStyle="rgba(120,100,76,0.08)";ctx.fillRect(x,y,w,bar);ctx.restore();
  ctx.fillStyle="rgba(110,90,66,0.22)";ctx.fillRect(x+12,y+bar,w-24,1.5);
  let tx=x+26;if(o.logo&&typeof LOGO!=="undefined"&&LOGO[o.logo])tx+=logo(ctx,o.logo,x+24,y+bar/2-19,38)+14;
  if(o.product)dq_T(ctx,o.product,tx,y+bar/2+10,{w:800,size:28});if(o.title)dq_T(ctx,o.title,x+w-26,y+bar/2+10,{w:600,size:28,align:"right",col:DQ.soft});
  if(o.draw){ctx.save();rr(ctx,x+3,y+bar+2,w-6,h-bar-5,10);ctx.clip();o.draw(ctx,body);ctx.restore();}
  ctx.restore();return body;}
function dq_rows(ctx,x,y,cols,rows,o){o=o||{};const a=o.a==null?1:o.a,rh=o.rh||54,lits=o.lit==null?[]:[].concat(o.lit),W_=cols.reduce((s,c)=>s+c.w,0);if(a<=0.004)return rh*(rows.length+1);ctx.save();ctx.globalAlpha*=a;
  let cx=x;for(const c of cols){if(c.h)dq_T(ctx,String(c.h).toUpperCase(),cx+14,y+36,{w:800,size:28,ls:3,col:DQ.soft});cx+=c.w;}
  ctx.fillStyle="rgba(110,90,66,0.3)";ctx.fillRect(x,y+rh-1,W_,1.6);
  rows.forEach((r,i)=>{const ra=o.rowA?o.rowA(r,i):1;if(ra<=0.004)return;const ry=y+rh*(i+1);ctx.save();ctx.globalAlpha*=ra;
    if(lits.includes(i)){ctx.fillStyle="rgba(196,172,128,0.22)";rr(ctx,x-6,ry+4,W_+12,rh-8,8);ctx.fill();if(o.litCol){ctx.fillStyle=rgba(dq_tone(o.litCol).col,1);rr(ctx,x-6,ry+4,6,rh-8,3);ctx.fill();}}
    ctx.fillStyle="rgba(110,90,66,0.14)";ctx.fillRect(x,ry+rh-1,W_,1.2);
    let xx=x;r.forEach((cell,j)=>{const c=cols[j]||{w:200},q=typeof cell==="object"&&cell?cell:{s:String(cell==null?"":cell)},f=q.f||c.f;let tx=xx+14;
      if(q.icon){dq_icon(ctx,q.icon,tx+16,ry+rh/2,30,q.col||DQ.ink);tx+=42;}
      dq_T(ctx,q.s,tx,ry+rh/2+10,{w:f==="mono"?500:600,size:28,f,col:q.col||DQ.ink});
      if(q.mark)dq_stampMark(ctx,tx+dq_tw(ctx,q.s,{w:f==="mono"?500:600,size:28,f})+26,ry+rh/2,q.mark,15);xx+=c.w;});
    ctx.restore();});
  ctx.restore();return rh*(rows.length+1);}
function dq_code(ctx,x,y,lines,o){o=o||{};const a=o.a==null?1:o.a,lh=o.lh||44,size=o.size||28,lits=o.lit==null?[]:[].concat(o.lit);if(a<=0.004)return lh*lines.length;ctx.save();ctx.globalAlpha*=a;
  lines.forEach((ln,i)=>{const la=o.lineA?o.lineA(ln,i):1;if(la<=0.004)return;const ly=y+i*lh;ctx.save();ctx.globalAlpha*=la;
    if(lits.includes(i)){ctx.fillStyle="rgba(196,172,128,0.24)";ctx.fillRect(x-12,ly+4,(o.w||900)+24,lh-6);}
    let xx=x;for(const [s,col] of typeof ln==="string"?[[ln,null]]:ln){dq_T(ctx,s,xx,ly+lh*0.7,{w:500,size,f:"mono",col:col||DQ.ink});xx+=dq_tw(ctx,s,{w:500,size,f:"mono"});}
    ctx.restore();});
  ctx.restore();return lh*lines.length;}
