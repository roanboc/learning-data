/* ===== Decades in the making: the film's own kit =====
   What this film adds to the module's shared look (films/what-an-agent-is/shared/src), with the prefix dm_:
     DM          the past's colours: plaster, stone, dark wood, parchment, iron, clay, bronze, paper and a lamp's warm light
     dm_where    the place and year in the corner of a scene from the past ("EUROPE · THE 1440S"), in the kicker's style
     dm_rail     the oak timeline along the lab's marble wall: a rail with a groove of decades, and a tab for each year the film
                 visits; the camera seems to travel along it as the year in focus changes
     dm_tab      one year's tab, hanging from the rail
     dm_people   the people of other times, as specs for ag_person
     dm_ease     helpers: a value between two cue times, and a spring that can start late
   Sizes are in the 1920 x 1080 frame; words are at least 28 px as seen, and nothing but the captions goes below y 890. */

const DM={plaster:[228,220,206],plasterDk:[196,184,166],stone:[188,178,162],wood:[124,92,64],woodDk:[86,62,44],woodLt:[168,132,96],
  parch:[240,229,204],parchDk:[214,198,166],ink:[44,40,48],iron:[74,76,82],ironLt:[132,134,140],clay:[190,132,96],clayLt:[222,170,130],
  bronze:[148,116,74],bronzeLt:[204,170,116],paper:[246,241,230],lamp:[255,214,150],sea:[198,210,214],land:[236,229,214],landEdge:[176,164,144]};

// the place and year of a scene from the past, in the corner, as the kicker sits in the lab's scenes
function dm_where(ctx,text,a,o){o=o||{};if(a<=0)return;const s=String(text).toUpperCase(),x=o.x||96,y=o.y||100,w=ag_tw(ctx,s,{w:700,size:28,ls:4});
  // on a small pale label, so it reads over anything the camera brings into the corner
  ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="rgba(246,243,236,0.82)";rr(ctx,x-18,y-36,w+36,50,10);ctx.fill();ctx.restore();
  ag_T(ctx,s,x,y,{w:700,size:28,ls:4,col:AG.kick,a});}

/* ---------------------------------------------------------------- the timeline along the wall
   dm_rail(ctx, o): the oak rail across the frame at o.y (196), with the year o.focus (a number, eased by the caller) at x = 960 and
   o.ppy pixels to a year; a groove under it with a short mark for each decade; tabs for o.years [{y: 1958, label, lit: 0..1, a}],
   each hanging from the rail where its year falls; o.a fades the whole rail; o.draw (0..1) draws the rail itself from the left.
   Returns x(year), so a scene can put its exhibits under its year. */
function dm_rail(ctx,o){const y=o.y||196,ppy=o.ppy||40,f=o.focus||1990,a=o.a==null?1:o.a,X=yr=>960+(yr-f)*ppy;if(a<=0)return X;
  const dr=o.draw==null?1:o.draw,x0=-40,x1=lerp(x0,W+40,ag_sine(dr));
  ctx.save();ctx.globalAlpha*=a;
  // the rail's shadow on the marble, falling down and a little left
  ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(46,38,28,0.18)";ctx.fillRect(x0-6,y+10,x1-x0,16);ctx.restore();
  // the groove: a thin line with a mark for each decade, under the rail
  ctx.strokeStyle="rgba(60,52,44,0.28)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y+40);ctx.lineTo(x1,y+40);ctx.stroke();
  const d0=Math.floor((f-960/ppy)/10)*10,d1=Math.ceil((f+960/ppy)/10)*10;
  for(let d=d0;d<=d1;d+=10){const x=X(d);if(x>x1)break;ctx.lineWidth=d%50===0?3:2;ctx.beginPath();ctx.moveTo(x,y+32);ctx.lineTo(x,y+48);ctx.stroke();}
  // the rail: oiled oak, lit from the right, its ends rounded
  const rh=22,g=ctx.createLinearGradient(0,y-rh/2,0,y+rh/2);g.addColorStop(0,rgba(AG_OAK.hi,1));g.addColorStop(0.45,rgba(AG_OAK.base,1));g.addColorStop(1,rgba(AG_OAK.dark,1));
  ctx.fillStyle=g;rr(ctx,x0,y-rh/2,x1-x0,rh,rh/2);ctx.fill();
  ctx.strokeStyle="rgba(255,250,240,0.6)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0+12,y-rh/2+3);ctx.lineTo(x1-12,y-rh/2+3);ctx.stroke();
  // the grain: a few long, soft lines
  ctx.strokeStyle="rgba(120,96,66,0.22)";ctx.lineWidth=1.2;for(const k of [-4,2,6]){ctx.beginPath();ctx.moveTo(x0+20,y+k);ctx.lineTo(x1-20,y+k+0.5);ctx.stroke();}
  // a tab fades as it nears the frame's edge, so a year sliding past is never cut in half
  const m=ctx.getTransform(),s0=ctx.canvas.width/W;
  for(const tb of (o.years||[])){const x=X(tb.y);if(x<-200||x>W+200||x>x1+20)continue;const fx=(m.a*x+m.c*y+m.e)/s0,ea=clamp((Math.min(fx,W-fx)-24)/56,0,1);if(ea<=0)continue;
    dm_tab(ctx,x,y,tb.label||String(tb.y),{lit:tb.lit||0,a:(tb.a==null?1:tb.a)*ea,w:tb.w,drop:tb.drop,pin:tb.pin,grow:tb.grow});}
  ctx.restore();return X;}
// a year's tab: a small oak plate hanging from the rail on a brass pin; lit (0..1) brings it forward, larger, with a soft light
function dm_tab(ctx,x,y,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const lit=o.lit||0,pin=clamp(o.pin||0,0,1),ps=ag_sine(pin),grow=o.grow==null?0.16:o.grow,
    k=(1+grow*ag_sine(lit))*(1-ps),tw=ag_tw(ctx,label,{w:700,size:34}),w=o.w||Math.max(132,tw+44),h=58,dr=(o.drop||0)*(1-ps);
  ctx.save();ctx.globalAlpha*=a;
  // a year too close to its neighbours to hang a tab: a brass stud on the rail, which glows when lit
  if(pin>0){const r=4+5*ps;if(lit>0){ctx.save();ctx.globalAlpha*=lit*ps;const gl=ctx.createRadialGradient(x,y,0,x,y,48);gl.addColorStop(0,"rgba(255,244,220,0.95)");gl.addColorStop(1,"rgba(255,244,220,0)");
      ctx.fillStyle=gl;ctx.fillRect(x-48,y-48,96,96);ctx.restore();}
    ctx.save();ctx.globalAlpha*=ps;const g=ctx.createRadialGradient(x-r*0.35,y-r*0.4,0,x,y,r);g.addColorStop(0,"#EEDAB0");g.addColorStop(0.55,"#BD9E6A");g.addColorStop(1,"#7E6440");
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();}
  if(k>0.02){ctx.strokeStyle="rgba(80,66,50,0.6)";ctx.lineWidth=2;if(dr>0.5){ctx.beginPath();ctx.moveTo(x,y+14);ctx.lineTo(x,y+22+dr);ctx.stroke();}
    ctx.translate(x,y+22+dr);ctx.scale(k,k);
    // the pin, or where its string meets the tab
    ctx.fillStyle="#9C8669";ctx.beginPath();ctx.arc(0,dr>0.5?0:-8,5,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(0,8);ctx.stroke();
    if(lit>0){ctx.save();ctx.globalAlpha*=lit;const gl=ctx.createRadialGradient(0,40,0,0,40,w*0.9);gl.addColorStop(0,"rgba(255,248,232,0.85)");gl.addColorStop(1,"rgba(255,248,232,0)");
      ctx.fillStyle=gl;ctx.fillRect(-w,-40,w*2,170);ctx.restore();}
    // the label goes before the tab gets small, so no year is ever drawn too small to read
    ctx.globalAlpha*=clamp(1-pin*2.5,0,1);ag_box(ctx,-w/2,8,w,h,12,{});
    ctx.fillStyle=rgba(AG_OAK.base,0.55+0.45*lit);rr(ctx,-w/2,8+h-6,w,6,3);ctx.fill();
    ag_T(ctx,label,0,8+h/2+12,{w:700,size:34,align:"center",col:mix(AG.mut,AG.ink,lit)});}
  ctx.restore();}

/* ---------------------------------------------------------------- the people of other times (specs for ag_person)
   Dressed for their time, in the module's matte style; nobody of the past is drawn as a likeness, since no portrait of the
   1440s or 1450s survives that was drawn from life. */
const DM_PEOPLE={
  // a scribe in the 1440s: a plain wool gown and a close cap
  scribe:{key:"dm_scribe",name:"A scribe",skin:[224,186,152],hair:{style:"cropped",c:[92,70,50]},top:{kind:"tunic",c:[96,88,104]},breath:0.24,
    hat:{paint:(c,P)=>dm_cap(c,[70,62,76])}},
  // Johannes Gutenberg, a metalworker, around 1450: a leather apron over a linen shirt, a felt cap; his face is ours, not a portrait
  gutenberg:{key:"dm_gutenberg",name:"Johannes Gutenberg",skin:[222,182,148],hair:{style:"side",c:[82,62,46]},beard:[88,66,50],top:{kind:"apron",c:[132,96,66],inner:[226,218,200]},breath:0.25,
    hat:{paint:(c,P)=>dm_bonnet(c,[78,70,62])}},
  // Johann Fust, a merchant of Mainz: a gown with a fur collar
  fust:{key:"dm_fust",name:"Johann Fust",skin:[230,196,166],hair:{style:"side",c:[120,110,100]},top:{kind:"tunic",c:[98,54,52],paint:(c,P)=>dm_furCollar(c)},breath:0.22,
    hat:{paint:(c,P)=>dm_chaperon(c,[60,30,34])}},
  // a psychologist in 1958: a suit and tie
  y1958:{key:"dm_1958",name:"Frank Rosenblatt",skin:[232,198,170],hair:{style:"side",c:[42,34,30]},top:{kind:"suit",c:[78,82,92],inner:[240,240,234],tie:[58,62,86]},breath:0.27},
  // two reporters at the demonstration in July 1958: a press photographer in a fedora, and a reporter with her notebook
  press:{key:"dm_press",name:"A press photographer",skin:[214,170,136],hair:{style:"cropped",c:[60,46,36]},top:{kind:"suit",c:[104,96,84],inner:[236,232,222],tie:[96,52,46]},breath:0.28,
    hat:{paint:(c,P)=>dm_fedora(c,[74,66,58])}},
  reporter:{key:"dm_reporter",name:"A reporter",skin:[176,124,94],hair:{style:"bob",c:[36,28,26]},earrings:[226,222,210],top:{kind:"blazer",c:[70,82,98],inner:[238,234,226]},breath:0.3},
  // someone in 2022 who ranks a model's answers
  rater:{key:"dm_rater",name:"A rater",skin:[182,132,102],hair:{style:"bob",c:[34,28,30]},earrings:[208,214,226],top:{kind:"sweater",c:[112,130,150]},breath:0.29}
};
// a close cloth cap over the crown (figure space: the head runs from y 300 to 526, the crown about x 212 to 389)
function dm_cap(c,col,brim){const f=cc=>{cc.moveTo(206,384);cc.bezierCurveTo(198,320,250,284,300,282);cc.bezierCurveTo(352,282,392,312,396,370);
    cc.bezierCurveTo(380,358,344,352,300,354);cc.bezierCurveTo(258,356,226,366,206,384);cc.closePath();};
  ag_soft(c,f,col,ag_lt(col,0.35),330,300,120,rgba(ag_dk(col,0.7),0.45),14);
  if(brim){const b=cc=>{cc.moveTo(200,388);cc.bezierCurveTo(240,360,350,350,402,372);cc.bezierCurveTo(404,382,398,388,390,386);cc.bezierCurveTo(340,370,250,376,206,398);cc.closePath();};
    ag_soft(c,b,ag_dk(col,0.1),ag_lt(col,0.3),340,366,80,rgba(ag_dk(col,0.7),0.4),6);}}
// a soft cloth bonnet, a craftsman's: a full crown leaning back, its band at the brow (figure space; a person's picture ends at y 262)
function dm_bonnet(c,col){const f=cc=>{cc.moveTo(204,404);cc.bezierCurveTo(180,336,212,276,284,268);cc.bezierCurveTo(350,262,396,290,398,352);
    cc.bezierCurveTo(398,362,394,368,388,370);cc.bezierCurveTo(340,352,262,362,214,412);cc.closePath();};
  ag_soft(c,f,col,ag_lt(col,0.32),320,284,130,rgba(ag_dk(col,0.7),0.45),16);
  ag_folds(c,f,[[[236,306],[290,316],[340,298]],[[222,352],[262,334],[300,334]]],rgba(ag_dk(col,0.6),0.4),rgba(ag_lt(col,0.3),0.4));
  const b=cc=>{cc.moveTo(206,412);cc.bezierCurveTo(260,360,338,350,392,368);cc.lineTo(394,384);cc.bezierCurveTo(340,368,262,378,212,426);cc.closePath();};
  ag_soft(c,b,ag_dk(col,0.12),ag_lt(col,0.25),350,370,80,rgba(ag_dk(col,0.7),0.4),5);}
// a chaperon, a merchant's hat of the 1450s: a padded roll round the head and cloth folded over its top (figure space)
function dm_chaperon(c,col){const top=cc=>{cc.moveTo(212,366);cc.bezierCurveTo(196,300,246,266,310,266);cc.bezierCurveTo(372,266,408,300,402,356);cc.closePath();};
  ag_soft(c,top,col,ag_lt(col,0.3),330,276,130,rgba(ag_dk(col,0.7),0.45),16);
  ag_folds(c,top,[[[236,318],[286,290],[330,284]],[[250,342],[310,314],[372,316]],[[300,276],[350,284],[384,318]]],rgba(ag_dk(col,0.6),0.45),rgba(ag_lt(col,0.3),0.4));
  const roll=cc=>{cc.moveTo(194,380);cc.bezierCurveTo(206,334,300,322,406,344);cc.bezierCurveTo(420,356,420,382,406,394);cc.bezierCurveTo(320,376,240,390,206,424);cc.bezierCurveTo(190,416,188,394,194,380);cc.closePath();};
  ag_soft(c,roll,ag_dk(col,0.05),ag_lt(col,0.35),360,344,120,rgba(ag_dk(col,0.7),0.5),12);
  ag_folds(c,roll,[[[230,376],[300,350],[380,354]]],rgba(ag_dk(col,0.6),0.4),rgba(ag_lt(col,0.35),0.4));}
// a fedora of the 1950s, worn low: a pinched crown, a dark band and a brim turned down at the front (figure space; a picture ends at y 262)
function dm_fedora(c,col){const brim=cc=>{cc.moveTo(180,374);cc.bezierCurveTo(198,350,300,340,410,350);cc.bezierCurveTo(428,353,432,366,418,372);
    cc.bezierCurveTo(330,370,240,380,192,394);cc.bezierCurveTo(176,394,172,382,180,374);cc.closePath();};
  const crown=cc=>{cc.moveTo(214,362);cc.bezierCurveTo(206,322,214,288,244,276);cc.bezierCurveTo(270,268,298,276,316,272);cc.bezierCurveTo(344,266,372,274,380,300);
    cc.bezierCurveTo(386,320,386,340,384,356);cc.bezierCurveTo(330,348,260,352,214,362);cc.closePath();};
  ag_soft(c,brim,ag_dk(col,0.08),ag_lt(col,0.3),360,350,120,rgba(ag_dk(col,0.7),0.45),8);
  ag_soft(c,crown,col,ag_lt(col,0.32),340,282,120,rgba(ag_dk(col,0.7),0.45),14);
  ag_folds(c,crown,[[[246,292],[298,288],[352,290]]],rgba(ag_dk(col,0.6),0.5),rgba(ag_lt(col,0.3),0.4));
  const band=cc=>{cc.moveTo(212,344);cc.bezierCurveTo(270,332,340,330,386,338);cc.lineTo(386,356);cc.bezierCurveTo(340,348,270,350,214,362);cc.closePath();};
  ag_soft(c,band,[40,34,32],[84,74,68],350,338,80,null,0);}
// a press camera of the 1950s held at the chest: a leather-covered box with its lens to the front, and a flash gun on top whose round
// reflector faces the same way (figure space, at the near hand); flash: 0..1, the bulb going off
function dm_pressCamera(c,h,flash){const [x,y]=h.near;c.save();c.translate(x+14,y-26);
  // the box, its leather and its lens
  ag_soft(c,cc=>ag_rect(cc,-70,-72,150,140,12),[40,40,44],[104,104,110],66,-62,150,"rgba(0,0,0,0.45)",8);
  c.strokeStyle="rgba(255,255,255,0.08)";c.lineWidth=2;for(let k=0;k<6;k++){c.beginPath();c.moveTo(-62,-58+k*22);c.lineTo(72,-58+k*22);c.stroke();}
  ag_soft(c,cc=>ag_rect(cc,80,-46,44,92,6),[54,54,58],[120,120,126],116,-38,70,null,0);
  ag_soft(c,cc=>cc.ellipse(126,0,15,38,0,0,TAU),[26,28,36],[110,130,160],130,-14,40,"rgba(0,0,0,0.4)",3);
  // the flash gun: a short stem, the reflector seen from the side, its bulb
  c.strokeStyle="rgba(150,152,158,1)";c.lineWidth=8;c.lineCap="round";c.beginPath();c.moveTo(10,-72);c.lineTo(18,-104);c.stroke();
  const dish=cc=>cc.ellipse(24,-160,28,60,0.06,0,TAU);
  ag_soft(c,dish,[176,180,188],[246,247,250],34,-190,80,"rgba(30,30,40,0.4)",6);
  c.save();ag_shape(c,dish);c.clip();const g=c.createRadialGradient(34,-158,4,30,-160,64);g.addColorStop(0,"rgba(255,255,255,0.95)");g.addColorStop(0.5,"rgba(214,218,226,0.6)");
  g.addColorStop(1,"rgba(150,156,168,0.5)");c.fillStyle=g;c.beginPath();c.ellipse(32,-160,20,52,0.06,0,TAU);c.fill();c.restore();
  c.strokeStyle="rgba(120,124,134,0.9)";c.lineWidth=4;c.beginPath();c.ellipse(24,-160,28,60,0.06,0,TAU);c.stroke();
  ag_soft(c,cc=>cc.ellipse(38,-160,9,13,0,0,TAU),[236,234,224],[255,255,250],40,-166,14,null,0);
  if(flash>0){c.save();c.globalCompositeOperation="lighter";const f=c.createRadialGradient(40,-160,4,40,-160,240);f.addColorStop(0,"rgba(255,252,236,"+(0.95*flash)+")");
    f.addColorStop(0.25,"rgba(255,246,220,"+(0.55*flash)+")");f.addColorStop(1,"rgba(255,246,220,0)");c.fillStyle=f;c.beginPath();c.arc(40,-160,240,0,TAU);c.fill();c.restore();}
  c.restore();}
// a reporter's notebook held at the chest (figure space, at the near hand)
function dm_notebook(c,h){const [x,y]=h.near;c.save();c.translate(x+6,y-46);c.rotate(-0.18);
  c.save();c.shadowColor="rgba(40,30,20,0.3)";c.shadowBlur=10;c.shadowOffsetX=-4;c.shadowOffsetY=6;c.fillStyle="#F4F0E4";c.fillRect(-46,-70,92,124);c.restore();
  c.strokeStyle="rgba(120,120,130,0.9)";c.lineWidth=3;for(let i=0;i<7;i++){c.beginPath();c.arc(-34+i*11.5,-70,4,Math.PI,TAU);c.stroke();}
  c.fillStyle="rgba(60,60,80,0.45)";for(let i=0;i<6;i++)c.fillRect(-36,-48+i*16,i%3===2?44:68,3);c.restore();}
// a fur collar over a gown's shoulders (figure space)
function dm_furCollar(c){const f=cc=>{cc.moveTo(170,600);cc.bezierCurveTo(220,560,300,560,330,600);cc.bezierCurveTo(372,566,440,570,470,610);
    cc.bezierCurveTo(470,650,440,670,400,660);cc.bezierCurveTo(372,700,330,706,320,700);cc.bezierCurveTo(300,720,250,700,230,680);cc.bezierCurveTo(196,670,170,640,170,600);cc.closePath();};
  ag_soft(c,f,[118,92,70],[176,150,120],380,600,140,"rgba(40,26,16,0.45)",14);
  c.save();ag_shape(c,f);c.clip();c.strokeStyle="rgba(70,50,34,0.35)";c.lineWidth=2;const r=ag_rnd(41);for(let i=0;i<70;i++){const x=170+r()*300,y=570+r()*130;c.beginPath();c.moveTo(x,y);c.lineTo(x+4,y+10);c.stroke();}c.restore();}

/* ---------------------------------------------------------------- helpers */
// 0 before a, 1 after b, eased (sine) between
const dm_btw=(t,a,b)=>ag_sine(clamp((t-a)/Math.max(0.001,b-a),0,1));
// a count that runs from 0 to n between a and b, easing out, as whole numbers
const dm_count=(t,a,b,n)=>Math.round(n*ag_eo(clamp((t-a)/Math.max(0.001,b-a),0,1)));
// a number with thousands separators
const dm_num=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,",");
