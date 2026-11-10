/* ===== Services with customers: the university, May and June 2027 =====
   The film's own pictures at the university, on the module's kit (prefix swc_). Colour keeps the module's meaning: the services, the map
   and its layers in blue (design), a request that lands on a service in green (value), the data on the information layer in orange, and
   the old warehouse's unopened reports in amber (a cost); the suppliers and the customers wear none of the five.
     swcMay, swcJune     the team's room in May's morning light and on June's grey Monday
     swc_services        the page of the team's four services, numbered, in a customer's words
     swc_chain           suppliers on the left, the four services in the middle, the four groups of customers on the right, joined
     swc_customer        one group of customers on a sheet: who, what hurts, what drives them
     swc_map             Noor's map on a screen: the four services and the four groups of customers among the map's other boxes
     swc_layers          one service walked down five layers, a picture each, the customers it serves at the top
     swc_reports         the old warehouse's 38 reports, the 17 no one opened in a year in amber
     swc_door            the front door's requests landing on the four services, and the three that land on none */

AG_PLACES.swcMay=c=>lp_paintRoom(c,{light:"morning",seed:5});
AG_PLACES.swcJune=c=>lp_paintRoom(c,{light:"grey",seed:7});

/* ---------------------------------------------------------------- the four services, on one page */
const SWC_SERVICES=["Governed data products","The platform for data partners","Analysis that answers a decision","Advice and training"];
const SWC_SHORT=["Data products","Platform","Analysis","Advice"];
// o.u: one number a service (0 to 1 each), o.hl: the service picked out (an index, or -1), o.k, o.a
function swc_services(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const rows=4,rh=92,h=200+rows*rh+30;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});
  lp_label(ctx,x+44,y+84,"Helena's team",{col:LP.blue});lp_T(ctx,"Our services",x+44,y+140,{w:800,size:40});
  SWC_SERVICES.forEach((s,i)=>{const k=o.u?clamp(o.u[i],0,1):1;if(k<=0)return;const ry=y+200+i*rh;ctx.save();ctx.globalAlpha*=k;
    const hl=o.hl===i;if(hl){ctx.fillStyle=rgba(LP.blue,0.1);rr(ctx,x+28,ry,w-56,rh-14,10);ctx.fill();}
    ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(x+76,ry+38,26,0,TAU);ctx.fill();lp_T(ctx,String(i+1),x+76,ry+49,{w:800,size:30,align:"center",col:[255,255,255]});
    lp_T(ctx,s,x+124,ry+50,{w:hl?800:600,size:32});ctx.restore();});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- suppliers, services, customers */
const SWC_SUPPLIERS=["Payroll","The timetable","The rooms' sensors","HR","Digital services"];
const SWC_GROUPS=["People who decide","Data partners","Analysts and readers","Staff and students"];
const SWC_GSHORT=["Who decide","Partners","Analysts","Staff, students"];
// o.sup (0 to 1: the suppliers come in), o.cus (0 to 1: the customers), o.link (0 to 1: the lines drawn), o.a
function swc_chain(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  const lx=110,mx=700,mw=520,rx=1810,top=250,step=112;
  // the team's services in the middle, on a sheet
  swc_services(ctx,mx,top-60,mw,{light:o.light,a:1});
  const line=(x0,y0,x1,y1,u)=>{if(u<=0)return;ctx.strokeStyle=rgba(LP.mut,0.55);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,y0);ctx.bezierCurveTo((x0+x1)/2,y0,(x0+x1)/2,y1,lerp(x0,x1,u),lerp(y0,y1,u));ctx.stroke();};
  lp_label(ctx,lx,top-50,"Suppliers",{a:clamp((o.sup||0)*3,0,1)});
  SWC_SUPPLIERS.forEach((s,i)=>{const k=clamp((o.sup||0)*5-i,0,1);if(k<=0)return;const y=top+30+i*step;line(lx+470,y,mx-12,top+260,clamp((o.sup||0)*5-i-0.4,0,1));lp_tag(ctx,lx,y,s,{a:k});});
  lp_label(ctx,rx,top-50,"Customers",{align:"right",a:clamp((o.cus||0)*3,0,1)});
  SWC_GROUPS.forEach((s,i)=>{const k=clamp((o.cus||0)*4-i,0,1);if(k<=0)return;const y=top+60+i*step*1.2;line(mx+mw+12,top+260,rx-420,y,clamp((o.cus||0)*4-i-0.4,0,1));lp_tag(ctx,rx,y,s,{align:"right",a:k});});
  ctx.restore();}

/* ---------------------------------------------------------------- one group of customers */
// words {who, hurts, wants}; o as lp_textSheet: o.u brings in what hurts, then what drives them
function swc_customer(ctx,x,y,w,words,o){o=o||{};return lp_textSheet(ctx,x,y,w,{kick:"Customers",title:words.who,lines:["Hurts: "+words.hurts,"Wants: "+words.wants]},o);}

/* ---------------------------------------------------------------- Noor's map */
// on a screen: the map's own boxes, quiet, and the services (blue) and the customers (outlined) put on it; o.sv, o.cu (0 to 1)
function swc_map(cx,X,Y,Wd,Hd,o){o=o||{};const R=ag_rnd(404),bx=(x,y,w,h,col,fill)=>{cx.strokeStyle=rgba(col,1);cx.lineWidth=3;rr(cx,x,y,w,h,8);if(fill){cx.fillStyle=rgba(col,0.12);cx.fill();}cx.stroke();};
  cx.fillStyle="#FBF9F4";cx.fillRect(X,Y,Wd,Hd);lp_T(cx,"Noor's map",X+30,Y+52,{w:800,size:30,col:LP.mut});
  // the map's other boxes: applications, data, places, quiet
  for(let i=0;i<10;i++){const x=X+40+(i%5)*((Wd-80)/5),y=Y+Hd-150+Math.floor(i/5)*62;bx(x,y,(Wd-80)/5-24,44,mix(LP.mut,[255,255,255],0.45),false);}
  const sv=clamp(o.sv||0,0,1),cu=clamp(o.cu||0,0,1),cw=(Wd-80)/4-24;
  SWC_SHORT.forEach((s,i)=>{const k=clamp(sv*4-i,0,1);if(k<=0)return;cx.save();cx.globalAlpha*=k;const x=X+40+i*((Wd-80)/4),y=Y+230;bx(x,y,cw,64,LP.blue,true);lp_T(cx,s,x+cw/2,y+42,{w:800,size:28,align:"center",col:LP.blue});cx.restore();});
  SWC_GROUPS.forEach((s,i)=>{const k=clamp(cu*4-i,0,1);if(k<=0)return;cx.save();cx.globalAlpha*=k;const x=X+40+i*((Wd-80)/4),y=Y+92;bx(x,y,cw,64,LP.ink,false);
    lp_T(cx,SWC_GSHORT[i],x+cw/2,y+42,{w:600,size:28,align:"center"});cx.strokeStyle=rgba(LP.mut,0.6);cx.lineWidth=2;cx.beginPath();cx.moveTo(x+cw/2,y+64);cx.lineTo(x+cw/2,Y+230);cx.stroke();cx.restore();});}

/* ---------------------------------------------------------------- one service, down five layers */
const SWC_LAYERS=[
  {name:"Strategy",items:["Decide from trusted data"],col:LP.blue},
  {name:"Business",items:["Service and promise","Owner, builder, reviewer"],col:LP.blue},
  {name:"Information",items:["Rooms","Bookings","Counts"],col:LP.orange},
  {name:"Application",items:["The platform","The catalog","The project"],col:LP.mut},
  {name:"Technology",items:["Where it runs"],col:LP.mut}];
// o.u: one number a layer (0 to 1), o.hl: the layer picked out, o.top (0 to 1: the customers it serves, at the top), o.dim (0 to 1: the
// layers' words dimmed, so the stack reads as one shape), o.compact (only the layers' names, 84 px a layer), o.a
function swc_layers(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const cp=!!o.compact,lh=cp?84:118,gap=cp?12:14;ctx.save();ctx.globalAlpha*=a;
  if((o.top||0)>0){ctx.save();ctx.globalAlpha*=o.top;lp_pill(ctx,x+w/2,y-46,"For: people who decide, partners, analysts",{col:LP.ink,size:28});ctx.restore();}
  SWC_LAYERS.forEach((L,i)=>{const k=o.u?clamp(o.u[i],0,1):1;if(k<=0)return;const ly=y+i*(lh+gap);ctx.save();ctx.globalAlpha*=k;ctx.translate(0,(1-ag_spr(k,0,0.5))*20);
    const hl=o.hl===i;lp_sheet(ctx,x,ly,w,lh,{pin:false,light:o.light,col:hl?L.col:null});
    if(cp){lp_label(ctx,x+w/2,ly+lh/2+11,L.name,{align:"center",col:L.col===LP.mut?LP.mut:L.col});ctx.restore();return;}
    lp_label(ctx,x+36,ly+lh/2+12,L.name,{col:hl?(L.col===LP.mut?LP.ink:L.col):LP.mut});
    const dim=1-0.55*(o.dim||0),ix=x+360,iw=(w-360-30)/L.items.length;
    L.items.forEach((s,j)=>{const bx=ix+j*iw,bw=iw-24;ctx.save();ctx.globalAlpha*=dim;ctx.strokeStyle=rgba(L.col,L.col===LP.mut?0.6:1);ctx.lineWidth=3;rr(ctx,bx,ly+22,bw,lh-44,10);ctx.stroke();
      lp_T(ctx,s,bx+bw/2,ly+lh/2+11,{w:600,size:28,align:"center",col:L.col===LP.mut?LP.ink:L.col});ctx.restore();});
    ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the old warehouse's reports */
// 38 small reports in a grid; o.u (0 to 1: they come in), o.amb (0 to 1: the 17 no one opened turn amber); returns nothing
const SWC_UNOPENED=[1,3,4,7,9,10,12,15,17,18,21,24,26,29,31,34,36];
function swc_reports(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const cols=10,cw=86,ch=104;
  for(let i=0;i<38;i++){const k=clamp((o.u||0)*38-i,0,1);if(k<=0)continue;const cx=x+(i%cols)*cw,cy=y+Math.floor(i/cols)*ch,un=SWC_UNOPENED.indexOf(i)>=0,am=un?clamp(o.amb||0,0,1):0;
    ctx.save();ctx.globalAlpha*=k*(1-0.35*am);ctx.fillStyle=rgba(LP.paper,1);ctx.shadowColor="rgba(52,36,30,0.25)";ctx.shadowBlur=8;ctx.shadowOffsetX=-4;ctx.shadowOffsetY=4;ctx.fillRect(cx,cy,62,80);ctx.shadowColor="transparent";
    ctx.fillStyle=rgba(mix(LP.mut,LP.amber,am),1);ctx.fillRect(cx,cy,62,8);
    for(let l=0;l<3;l++){ctx.fillStyle=rgba(mix(LP.mut,[255,255,255],0.5),1);ctx.fillRect(cx+10,cy+22+l*16,42-l*8,5);}
    ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the front door: requests land on the services */
// the four services as trays along the wall, a count over each; o.n: how many requests have landed in each tray (numbers), o.none (0 to
// 1: the three that land on none come in beside them), o.hand (0 to 1: two of them go off to digital services), o.fill (0 to 1: one of
// them moves into advice and training), o.light, o.a
const SWC_TRAYX=[200,600,1000,1400],SWC_TRAYW=340,SWC_TRAYY=660;
function swc_door(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  SWC_SHORT.forEach((s,i)=>{const x=SWC_TRAYX[i],n=(o.n||[0,0,0,0])[i],on=n>0?1:0;
    lp_sheet(ctx,x,SWC_TRAYY,SWC_TRAYW,150,{pin:false,col:LP.blue,light:o.light});
    lp_T(ctx,s,x+SWC_TRAYW/2,SWC_TRAYY+70,{w:800,size:32,align:"center",col:LP.blue});
    lp_T(ctx,String(Math.round(n)),x+SWC_TRAYW/2,SWC_TRAYY+124,{w:800,size:40,align:"center",col:on?LP.green:LP.mut});});
  // the three that land on none, as small cards to the right
  const nn=clamp(o.none||0,0,1);if(nn>0){for(let i=0;i<3;i++){const k=clamp(nn*3-i,0,1),go=i<2?ag_sine(clamp(o.hand||0,0,1)):0,fi=i===2?ag_sine(clamp(o.fill||0,0,1)):0;
      if(k<=0)continue;let x=1800,y=300+i*110;x=lerp(x,2080,go);x=lerp(x,SWC_TRAYX[3]+SWC_TRAYW/2-40,fi);y=lerp(y,SWC_TRAYY-40,fi);
      ctx.save();ctx.globalAlpha*=k*(1-fi*clamp((o.fill||0)*1.6-0.6,0,1));ctx.fillStyle=rgba(LP.paper,1);ctx.shadowColor="rgba(52,36,30,0.25)";ctx.shadowBlur=10;ctx.shadowOffsetX=-4;ctx.shadowOffsetY=5;
      ctx.fillRect(x-40,y-30,80,60);ctx.shadowColor="transparent";ctx.strokeStyle=rgba(LP.mut,1);ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.strokeRect(x-40,y-30,80,60);ctx.setLineDash([]);ctx.restore();}}
  ctx.restore();}
// one request card flying from the door at (sx, sy) into tray i, at u (0 to 1)
function swc_flyer(ctx,sx,sy,i,u){if(u<=0||u>=1)return;const tx=SWC_TRAYX[i]+SWC_TRAYW/2,ty=SWC_TRAYY+20,p=ag_sine(u),x=lerp(sx,tx,p),y=lerp(sy,ty,p)-Math.sin(Math.PI*p)*120;
  ctx.save();ctx.globalAlpha*=Math.min(1,u*6)*Math.min(1,(1-u)*6);ctx.fillStyle=rgba(LP.paper,1);ctx.shadowColor="rgba(52,36,30,0.25)";ctx.shadowBlur=8;ctx.shadowOffsetX=-4;ctx.shadowOffsetY=4;
  ctx.fillRect(x-30,y-22,60,44);ctx.shadowColor="transparent";ctx.fillStyle=rgba(LP.green,1);ctx.fillRect(x-30,y-22,60,6);ctx.restore();}
