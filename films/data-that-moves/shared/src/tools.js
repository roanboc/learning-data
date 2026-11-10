/* ===== Modern data basics: the tools' pages =====
   Tools look like their pages, drawn for the film at the level of architecture, never a click-by-click tour: a window of dark glass
   with a small bar along its top naming the product, with its official logo where the film's film.json says "logos": true (The
   Inner Life of Data's Databricks and dbt marks, this module's Microsoft Fabric, Power BI and mirrored catalog marks, logos.js), and
   no release status anywhere on it. What the page shows is drawn by the film in the window's body, often with the rows and the tree
   below. Every word is at least 28 px as seen: a page drawn small is a picture, and its words are marked as decoration ({deco: 1}).
     md_window(ctx, x, y, w, h, o)    a tool's page: o.logo (a logo's key), o.product ("Databricks"), o.title (what the page is, at the
                                      right of the bar: "Catalog"), o.edge (a colour that means something), o.lit, o.a, o.k;
                                      o.draw(ctx, body) draws in the body {x, y, w, h}; returns the body
     md_rows(ctx, x, y, cols, rows, o) a table of words: cols [{h: "FIELD", w: 300, f: "mono"}, ...] (each column's heading, width and
                                      font), rows [[cell, ...], ...], a cell a string or {s, col, icon, f}; o.rh (row height, 54), o.lit
                                      (a row's index, or several: they glow), o.rowA (row, i) => its opacity (rows coming in one by one),
                                      o.a; returns the height drawn
     md_tree(ctx, x, y, items, o)     a catalog's tree: items [{name, kind ("catalog", "schema", "table", "view", "volume", "metric view",
                                      "streaming table", "materialized view", "foreign table", "mirrored table"), depth, col, a}], o.rh (52),
                                      o.indent (40), o.a; returns the height drawn */

function md_window(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,bar=68,body={x:x+20,y:y+bar+16,w:w-40,h:h-bar-36};if(a<=0.004)return body;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));if(o.lit)glow(ctx,x+w/2,y+h/2,Math.max(w,h)*0.6,o.edge||MD.flow,0.25*o.lit);
  md_card(ctx,x,y,w,h,{edge:o.edge||[150,175,215],glow:o.edge?0.7:0.25,edgeA:o.edge?0.85:0.45,r:18,fill:"rgba(10,17,35,0.96)"});
  ctx.save();rr(ctx,x+1,y+1,w-2,bar,17);ctx.clip();ctx.fillStyle="rgba(255,255,255,0.045)";ctx.fillRect(x,y,w,bar);ctx.restore();
  ctx.strokeStyle="rgba(170,200,245,0.18)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+12,y+bar);ctx.lineTo(x+w-12,y+bar);ctx.stroke();
  let tx=x+24;if(o.logo&&typeof LOGO!=="undefined"&&LOGO[o.logo])tx+=logo(ctx,o.logo,x+22,y+bar/2-19,38)+14;
  if(o.product)md_T(ctx,o.product,tx,y+bar/2+10,{w:800,size:28});if(o.title)md_T(ctx,o.title,x+w-24,y+bar/2+10,{w:600,size:28,align:"right",col:MD.soft});
  if(o.draw){ctx.save();rr(ctx,x+2,y+bar+1,w-4,h-bar-3,16);ctx.clip();o.draw(ctx,body);ctx.restore();}
  ctx.restore();return body;}
function md_rows(ctx,x,y,cols,rows,o){o=o||{};const a=o.a==null?1:o.a,rh=o.rh||54,lits=o.lit==null?[]:[].concat(o.lit),W_=cols.reduce((s,c)=>s+c.w,0);if(a<=0.004)return rh*(rows.length+1);ctx.save();ctx.globalAlpha*=a;
  let cx=x;for(const c of cols){if(c.h)md_T(ctx,String(c.h).toUpperCase(),cx+14,y+36,{w:800,size:28,ls:3,col:MD.soft});cx+=c.w;}
  ctx.strokeStyle="rgba(170,200,245,0.22)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x,y+rh);ctx.lineTo(x+W_,y+rh);ctx.stroke();
  rows.forEach((r,i)=>{const ra=o.rowA?o.rowA(r,i):1;if(ra<=0.004)return;const ry=y+rh*(i+1);ctx.save();ctx.globalAlpha*=ra;
    if(lits.includes(i)){const lc=o.litCol||MD.flow;ctx.fillStyle=rgba(lc,0.13);rr(ctx,x-6,ry+5,W_+12,rh-8,10);ctx.fill();ctx.strokeStyle=rgba(lc,0.8);ctx.lineWidth=1.8;rr(ctx,x-6,ry+5,W_+12,rh-8,10);ctx.stroke();}
    let xx=x;r.forEach((cell,j)=>{const c=cols[j]||{w:200},q=typeof cell==="object"&&cell?cell:{s:String(cell==null?"":cell)},f=q.f||c.f;let tx=xx+14;
      if(q.icon){md_icon(ctx,q.icon,tx+16,ry+rh/2,30,q.col||MD.ink);tx+=42;}
      md_T(ctx,q.s,tx,ry+rh/2+10,{w:f==="mono"?500:600,size:28,f,col:q.col||MD.ink});xx+=c.w;});
    ctx.restore();});
  ctx.restore();return rh*(rows.length+1);}
const MD_TREE_ICON={catalog:"store",schema:"volume",table:"table",view:"view",volume:"volume","metric view":"contract","streaming table":"stream","materialized view":"refresh","foreign table":"query","mirrored table":"mirror"};
function md_tree(ctx,x,y,items,o){o=o||{};const a=o.a==null?1:o.a,rh=o.rh||52,ind=o.indent||40;if(a<=0.004)return rh*items.length;ctx.save();ctx.globalAlpha*=a;
  items.forEach((it,i)=>{const ia=it.a==null?1:it.a;if(ia<=0.004)return;const yy=y+i*rh,xx=x+(it.depth||0)*ind,col=it.col||MD.ink;ctx.save();ctx.globalAlpha*=ia;
    if(it.depth){ctx.strokeStyle="rgba(170,200,245,0.25)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(xx-ind+16,yy-rh/2+10);ctx.lineTo(xx-ind+16,yy+rh/2-4);ctx.lineTo(xx-6,yy+rh/2-4);ctx.stroke();}
    md_icon(ctx,MD_TREE_ICON[it.kind]||"table",xx+16,yy+rh/2-4,30,it.col||MD.flow);md_T(ctx,it.name,xx+42,yy+rh/2+6,{w:it.kind==="catalog"||it.kind==="schema"?700:500,size:28,f:it.kind==="catalog"||it.kind==="schema"?undefined:"mono",col});
    ctx.restore();});
  ctx.restore();return rh*items.length;}
