/* ===== Grants by design: the tools' pages =====
   GitHub and Databricks as the film shows them, drawn with the kit's pages (pages.js): a file tree, lines of code in the code font, each
   word in the colour of what it is (a group's name cyan, an identity; its rights green, allowed; a comment quieter), a review, and a
   catalog's permissions. Sizes in the 1920 x 1080 frame; every word 28 px or more. */

// a folder or a file, drawn in light: a folder's tab, or a page with its corner turned
function gd_fileIcon(ctx,x,y,folder,col){const c=dp_f(col||"grey");ctx.save();ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),0.95);ctx.fillStyle=rgba(c,0.22);ctx.lineWidth=2;
  if(folder){ctx.beginPath();ctx.moveTo(x,y-18);ctx.lineTo(x+10,y-18);ctx.lineTo(x+14,y-14);ctx.lineTo(x+30,y-14);ctx.lineTo(x+30,y+4);ctx.lineTo(x,y+4);ctx.closePath();ctx.fill();ctx.stroke();}
  else{ctx.beginPath();ctx.moveTo(x+4,y-20);ctx.lineTo(x+18,y-20);ctx.lineTo(x+26,y-12);ctx.lineTo(x+26,y+6);ctx.lineTo(x+4,y+6);ctx.closePath();ctx.fill();ctx.stroke();}
  ctx.restore();}
/* a file tree from (x, y), 50 apart: rows [depth, name, folder, hi (0 to 1: lit in cyan)]; o.a */
function gd_tree(ctx,x,y,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  rows.forEach(([d,name,folder,hi],i)=>{const rx=x+d*44,ry=y+i*52,h=clamp(hi||0,0,1);
    if(h>0){ctx.save();ctx.globalAlpha*=h;rr(ctx,rx-14,ry-36,dp_tw(ctx,name,{w:500,size:28,f:"mono"})+76,50,10);ctx.fillStyle=rgba(dp_f("cyan"),0.14);ctx.fill();
      ctx.strokeStyle=rgba(dp_f("cyan"),0.9);ctx.lineWidth=2;ctx.shadowColor=rgba(dp_f("cyan"),0.7);ctx.shadowBlur=10;ctx.stroke();ctx.restore();}
    gd_fileIcon(ctx,rx,ry-2,folder,h>0.5?"cyan":"grey");dp_T(ctx,name,rx+44,ry,{w:500,size:28,f:"mono",col:h>0.5?"ink":"mut"});});
  ctx.restore();}
/* lines of code from (x, y), lh apart (42): each line a list of [text, colour] pieces, drawn on in the code font; o.a, o.hi {from, to,
   a, col} lights a block of lines; o.clip [y0, y1] keeps them inside a page; returns where each line's baseline is */
function gd_code_lines(ctx,x,y,lines,o){o=o||{};const a=o.a==null?1:o.a,lh=o.lh||42,ys=[];if(a<=0)return ys;ctx.save();ctx.globalAlpha*=a;
  if(o.clip){ctx.beginPath();ctx.rect(x-30,o.clip[0],2000,o.clip[1]-o.clip[0]);ctx.clip();}
  if(o.hi&&o.hi.a>0){const h=o.hi,c=dp_f(h.col||"cyan");ctx.save();ctx.globalAlpha*=h.a;rr(ctx,x-18,y+h.from*lh-34,h.w||800,(h.to-h.from+1)*lh+6,10);ctx.fillStyle=rgba(c,0.12);ctx.fill();
    ctx.strokeStyle=rgba(c,0.85);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
  lines.forEach((L,i)=>{const ly=y+i*lh;ys.push(ly);if(o.clip&&(ly<o.clip[0]+20||ly>o.clip[1]+6))return;let cx=x;
    for(const [s,col] of L){dp_T(ctx,s,cx,ly,{w:500,size:28,f:"mono",col:col||"ink"});cx+=dp_tw(ctx,s,{w:500,size:28,f:"mono"});}});
  ctx.restore();return ys;}
// a key: value line of the plan's YAML, its pieces coloured: indent, the key (quieter), and the value in its colour
const gd_y=(ind,key,val,col)=>[[" ".repeat(ind)+key,"mut"]].concat(val==null?[]:[[" "+val,col||"ink"]]);
const gd_yc=(ind,s)=>[[" ".repeat(ind)+s,"mut"]];
// a grant in the YAML: two lines, the group in cyan, its rights in green
const gd_yg=(ind,who)=>[[[" ".repeat(ind)+"- principal:","mut"],[" "+who,"cyan"]],[[" ".repeat(ind+2)+"privileges:","mut"],[" [USE_SCHEMA, SELECT]","green"]]];
// the registrar's schemas.yml, as far as the film reads it: the core shelf, its readers, and the study's grant made from its contract
const GD_YAML=[gd_y(0,"resources:"),gd_y(2,"schemas:"),gd_y(4,"core:"),gd_y(6,"catalog_name:","registrar"),gd_y(6,"name:","core"),gd_y(6,"grants:")]
  .concat(gd_yg(8,"registrar_office"),gd_yg(8,"help_desk"),gd_yg(8,"planning_learner_readers"),[gd_yc(8,"# Data sharing agreement 2026-14,"),gd_yc(8,"# until 30 June 2027")],gd_yg(8,"health_progress_study"));
