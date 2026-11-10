/* ===== Data quality: the module's look =====
   The films of Data quality (Fit for use, Quality as a habit) share one look, assumed on 5 November 2026 for the author to review
   (films/fit-for-use/decided.md): the quality bench. The data team's workroom at the university: a wall of warm limestone lit from
   a window on the right, and a long bench of dark speckled granite, the flat stone inspectors measure on. Records are cream index
   cards, each field typed in the mono face; checks are the inspector's tools, a dial gauge and a tolerance band; results are tags
   tied on with string. The Great Hall, in warm oak, is where the ceremonies happen. People are the agent films', unchanged. No film
   grain, no watercolour.
   The module's files, bundled in this order after The Inner Life of Data's helpers (core.js, style2.js, ui3.js, and its logos.js
   for a film that names its tools), A Sharper Sketch's scene() (sketch3.js) and the agent films' kit, people and agent
   (films/what-an-agent-is/shared/src/kit.js, people.js, agent.js: the camera, the shots, pictures painted once, the people):
     look.js   the palette and what each colour means, words, the places (the bench, the bench from above, the Great Hall), props
               and icons
     people.js the cast this module adds, dq_person and dq_nameTag
     cards.js  paper cards, records, tags, chips, the tolerance band, the dial gauge, figures, the kicker, the module's mark, and
               the title and end cards
     tools.js  the tools' pages, each with a small bar naming the product and its logo, and what goes in them: rows and code
   Every top-level name starts with dq_ or DQ_. A film's own pictures and helpers go in its own source with a prefix of its own;
   never change these files for one film.
   Sizes are in the 1920 x 1080 frame. Every word is at least 28 px as seen, and nothing but the captions goes below y 890. */

/* ---------------------------------------------------------------- colours, and what each means in every film of the module
   Six colours carry meaning, and only these: the four verdicts (pass, hold, stop, not checked), brass for the requirement or the
   reference (what good means for this use), and steel blue for a measure taken. Everything else is paper, stone, granite, oak and
   ink, which mean nothing. Each meaning has three tones (DQ_TONE): col for tags, fills and lines; word for its words on paper or the
   wall (4.5:1 or more on paper); dark for lines and words drawn straight on the granite or the hall's oak. */
const DQ={
  ink:[40,34,28],          // words on paper and on the wall
  soft:[92,82,72],         // quieter words, 6.7:1 on paper
  dim:[150,138,124],       // rules and frames that only hold things together; never words
  paper:[247,241,228],     // a record's card, a page, a tag's reinforcing ring: cream
  chalk:[242,235,220],     // words on the granite or the hall's oak
  chalkSoft:[200,190,172], // quieter words there, 8:1 on the granite
  stone:[214,202,184],     // the wall: warm limestone
  granite:[38,36,36],      // the bench: dark speckled granite
  graphite:[58,58,62],     // a gauge's bezel, a lamp: enamel and steel that mean nothing
  string:[222,204,166],    // the string a tag is tied on with
  oak:[112,72,44],         // the Great Hall's panelling
  // the verdicts
  pass:[52,122,78],        // a check passes
  hold:[196,132,26],       // a check holds the data for a person to look at
  stop:[178,58,46],        // a check stops it
  none:[112,110,106],      // not checked
  // what good means, and what was found
  brass:[178,138,62],      // the requirement or the reference: what good means for this use
  steel:[62,104,136]       // a measure taken
};
const DQ_TONE={
  pass:{col:DQ.pass,word:[44,108,68],dark:[124,200,144]},
  hold:{col:DQ.hold,word:[146,94,12],dark:[236,184,78]},
  stop:{col:DQ.stop,word:[166,50,40],dark:[234,118,102]},
  none:{col:DQ.none,word:[98,96,92],dark:[178,174,168]},
  brass:{col:DQ.brass,word:[122,90,36],dark:[230,196,118]},
  steel:{col:DQ.steel,word:[54,94,124],dark:[134,176,212]}
};
// the verdicts as tags say them: the tag's colour, its words and their colour (white, or ink on amber), and its icon
const DQ_VERDICT={
  pass:{col:DQ.pass,text:"PASS",ink:[255,255,255],icon:"tick"},
  hold:{col:DQ.hold,text:"HOLD",ink:DQ.ink,icon:"pause"},
  stop:{col:DQ.stop,text:"STOP",ink:[255,255,255],icon:"cross"},
  none:{col:DQ.none,text:"NOT CHECKED",ink:[255,255,255],icon:"dash"}
};
// a meaning's tone: dq_tone("hold").word; a colour ([r, g, b]) passes through as all three
const dq_tone=m=>typeof m==="string"?DQ_TONE[m]:{col:m,word:m,dark:m};

/* ---------------------------------------------------------------- words
   dq_T draws with The Inner Life of Data's T (so the legibility check measures it; {deco:1} marks decoration on purpose), in ink
   unless o.col (a colour, or a meaning's name such as "steel", in its word tone, or its dark tone with o.dark) or o.color (a CSS
   colour) says otherwise; o.ls spaces the letters, in px; o.f "mono" for what is typed (records, code, values). Size 28 by default.
   dq_tw and dq_wrap measure and wrap as the agent films' ag_tw and ag_wrap do. dq_label writes a heading in capitals. */
function dq_col(c,dark){return typeof c==="string"?(dark?DQ_TONE[c].dark:DQ_TONE[c].word):c;}
function dq_T(ctx,s,x,y,o){o=o||{};const a=o.a==null?1:o.a,col=o.color||rgba(o.col?dq_col(o.col,o.dark):(o.dark?DQ.chalk:DQ.ink),a),ls=o.ls||0,q=Object.assign({},o,{color:col,size:o.size||28});
  if(!ls){T(ctx,s,x,y,q);return;}
  const dx=o.align==="center"?ls/2:(o.align==="right"||o.align==="end")?ls:0;ctx.save();ctx.letterSpacing=ls+"px";T(ctx,s,x+dx,y,q);ctx.restore();}
const dq_tw=(ctx,s,o)=>ag_tw(ctx,s,o),dq_wrap=(ctx,s,maxW,o)=>ag_wrap(ctx,s,maxW,o);
function dq_label(ctx,x,y,text,o){o=o||{};dq_T(ctx,String(text).toUpperCase(),x,y,{w:800,size:o.size||28,ls:o.ls==null?4:o.ls,align:o.align||"left",col:o.col||(o.dark?DQ.chalkSoft:DQ.soft),dark:o.dark,a:o.a});}

/* ---------------------------------------------------------------- noise, for the stone, the granite and the oak
   dq_noise(seed) is smooth value noise, n(x, y, octaves) from 0 to 1; dq_field paints a rectangle at a lower resolution, pixel by
   pixel, then scales it up smoothly (what is soft anyway, such as stone's tone); dq_specks scatters the granite's crystals at full
   resolution, light, white and black, in a few paths so they paint at once. */
function dq_noise(seed){const N=256,v=new Float32Array(N*N),r=ag_rnd(seed||7);for(let i=0;i<N*N;i++)v[i]=r();
  const f=(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),u=x-xi,w=y-yi,x0=xi&255,y0=yi&255,x1=(x0+1)&255,y1=(y0+1)&255,su=u*u*(3-2*u),sw=w*w*(3-2*w),
      a=v[y0*N+x0],b=v[y0*N+x1],c=v[y1*N+x0],d=v[y1*N+x1];return a+(b-a)*su+(c-a)*sw+(a-b-c+d)*su*sw;};
  return(x,y,oct)=>{let s=0,amp=1,fr=1,n=0;for(let o=0;o<(oct||4);o++){s+=amp*f(x*fr+o*17.3,y*fr+o*9.1);n+=amp;amp*=0.5;fr*=2.03;}return s/n;};}
function dq_field(c,x,y,w,h,k,fn){const ww=Math.max(1,Math.ceil(w/k)),hh=Math.max(1,Math.ceil(h/k)),cv=mkCanvas(ww,hh),cx=cv.getContext("2d"),im=cx.createImageData(ww,hh),d=im.data,out=[0,0,0];
  for(let j=0;j<hh;j++){const py=y+(j+0.5)*k;for(let i=0;i<ww;i++){fn(x+(i+0.5)*k,py,out);const p=(j*ww+i)*4;d[p]=out[0];d[p+1]=out[1];d[p+2]=out[2];d[p+3]=255;}}
  cx.putImageData(im,0,0);c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality="high";c.drawImage(cv,0,0,ww,hh,x,y,w,h);c.restore();}
function dq_specks(c,x,y,w,h,o){o=o||{};const r=ag_rnd(o.seed||5),sq=o.squash==null?1:o.squash,n=Math.round(w*h*(o.density||0.016)),
    kinds=o.kinds||[[0.44,[110,106,102],1.0,1.7],[0.28,[152,148,142],1.0,2.6],[0.09,[208,204,196],0.9,1.6],[0.19,[10,9,9],1.4,3.4]],paths=kinds.map(()=>[new Path2D(),new Path2D(),new Path2D()]);
  for(let i=0;i<n;i++){let q=r(),k=0;while(k<kinds.length-1&&q>kinds[k][0]){q-=kinds[k][0];k++;}const K=kinds[k],s=K[2]+r()*(K[3]-K[2]);
    paths[k][(r()*3)|0].rect(x+r()*w,y+r()*h,Math.max(0.7,s*(0.55+r()*0.9)),Math.max(0.5,s*sq*(0.55+r()*0.9)));}
  const A=o.a==null?1:o.a;c.save();kinds.forEach((K,k)=>paths[k].forEach((p,j)=>{c.fillStyle=rgba(K[1],[0.34,0.58,0.85][j]*A);c.fill(p);}));c.restore();}
// light laid on a place: a soft pool of colour col at (x, y), radius r, strength a, added to what is there
function dq_pool(c,x,y,r,col,a,sy){c.save();c.globalCompositeOperation="lighter";c.translate(x,y);c.scale(1,sy||1);const g=c.createRadialGradient(0,0,0,0,0,r);
  g.addColorStop(0,rgba(col,a));g.addColorStop(0.45,rgba(col,a*0.45));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(-r,-r,2*r,2*r);c.restore();}

/* ---------------------------------------------------------------- granite
   dq_granite(c, x, y, w, h, o) paints dark speckled granite: its tone mottled, then its crystals. o.squash (1: seen from above; less:
   seen at a low angle, the crystals flattened), o.base (its colour), o.seed, o.density (crystals per square pixel, 0.016). */
function dq_granite(c,x,y,w,h,o){o=o||{};const sq=o.squash==null?1:o.squash,b=o.base||DQ.granite,nz=dq_noise(o.seed||11);
  dq_field(c,x,y,w,h,o.k||3,(px,py,out)=>{const u=px/300,v=(py-y)/(300*sq)+y/300,m=nz(u,v,4),f=nz(u*6.2,v*6.2,2),kk=0.84+0.3*m+0.14*(f-0.5);out[0]=b[0]*kk;out[1]=b[1]*kk;out[2]=b[2]*kk;});
  dq_specks(c,x,y,w,h,{seed:(o.seed||11)+1,squash:sq,density:o.density,a:o.speckA});}

/* ---------------------------------------------------------------- the places
   Three places, each painted once (AG_PLACES; check.py times it, and each paints in well under 2 s):
     "bench"     the workroom: the wall of warm limestone, lit from a window on the right (the sun lies on the wall in a soft patch,
                 crossed by the window's bars), and the granite bench along the bottom of the frame. People stand behind it, cut
                 at its back edge (o.cut = DQ_BENCH.back); its front, under the captions, is dark and calm. Cards and gauges stand
                 in front of the wall, which takes their shadow.
     "benchTop"  the bench seen from above: the granite plate filling the frame, a warm pool of lamp light and the window's daylight
                 from the right. Records, tags and gauges lie on it, in the frame's own coordinates.
     "hall"      the Great Hall, at the height of the stage: tall windows above, oak panelling with pilasters, and the stage's plum
                 backcloth in the middle, warmly lit. A person on the stage is seen from the waist up (y + 504 s at least 1080),
                 or stands behind the lectern (dq_lectern, cut at its top).
   A film paints a variant of one as a place of its own, under its own prefix: AG_PLACES.hf_dusk=c=>dq_paintBench(c,{sun:0}).
   dq_paintBench's o: sun (0 to 1, the patch of sun on the wall, 1), blocks (false: plain limewashed stone, no joints), seed.
   DQ_BENCH holds the bench's lines: back (its back edge, where people are cut), front (its front edge), face (the foot of its
   front face). DQ_HALL holds the hall's: the windows' sill, the cornice, the backcloth's edges. */
const DQ_BENCH={back:800,front:906,face:972};
const DQ_HALL={sill:270,cornice:318,cloth:[700,1220]};
// the wall's courses of limestone, each a row of blocks of their own lengths and tones, the lowest resting on the bench
function dq_courses(seed){const r=ag_rnd(seed||29),rows=[];for(let y1=DQ_BENCH.back;y1>-300;y1-=262){const y0=y1-262,xs=[];let x=-r()*520;while(x<W+40){xs.push(x);x+=500+r()*300;}
  rows.push({y0,y1,xs,tone:xs.map(()=>[r()-0.5,r()-0.5,r()*1000])});}return rows;}
function dq_paintWall(c,o){o=o||{};const nz=dq_noise(o.seed||23),b=o.base||[226,212,188],blocks=o.blocks!==false,rows=dq_courses((o.seed||23)+6),sun=o.sun==null?1:o.sun;
  const block=(px,py)=>{for(const r of rows)if(py>=r.y0&&py<r.y1){let k=0;while(k+1<r.xs.length&&r.xs[k+1]<=px)k++;return r.tone[k];}return null;};
  // the sun through the window on the right, lying on the wall: a soft parallelogram, lower further from the window, with the
  // window's two mullions and its transom across it
  const sunAt=(px,py)=>{if(sun<=0)return 0;const sl=0.2,top=86+(1980-px)*sl,bot=700+(1980-px)*sl,u=(py-top)/(bot-top);if(px<1180||u<-0.1||u>1.1)return 0;
    let e=sstep(1180,1270,px)*sstep(-0.07,0.05,u)*(1-sstep(0.95,1.07,u));for(const mx of [1468,1730])e*=1-0.85*(1-sstep(0,30,Math.abs(px-mx)-9));e*=1-0.8*(1-sstep(0,0.05,Math.abs(u-0.36)-0.011));return e*sun;};
  dq_field(c,0,0,W,H,2,(px,py,out)=>{const bt=blocks?block(px,py):null,ox=bt?bt[2]:0,
      // the stone's own tone: broad clouds, finer mottling inside each block, and faint beds of the limestone running level
      m=nz(px/620,py/620,3),f=nz((px+ox)/110,(py+ox)/110,3),bed=nz((px+ox)/520,(py+ox*0.3)/16,2),g=nz(px/26,py/26,2),
      tn=bt?bt[0]*0.055:0,hue=bt?bt[1]:0,
      lit=0.93+0.08*sstep(-200,W+200,px)-0.06*(1-sstep(0,460,py)),s=sunAt(px,py),k=lit*(0.94+0.06*m+0.06*(f-0.5)+0.035*(bed-0.5)+0.03*(g-0.5)+tn)+0.1*s;
    out[0]=Math.min(255,b[0]*k+10*s+hue*3);out[1]=Math.min(255,b[1]*k+6*s);out[2]=Math.min(255,b[2]*k-hue*4);});
  // the stone's pores: a few fine dark and light flecks
  dq_specks(c,0,0,W,DQ_BENCH.back,{seed:(o.seed||23)+2,density:0.0035,a:0.35,kinds:[[0.7,[150,130,104],0.8,1.8],[0.3,[246,240,228],0.8,1.6]]});
  if(!blocks)return;
  // the joints: thin lines of lime mortar, a little lighter than the stone, shadowed along the edge of the block above (the light
  // falls from above) and on the side away from the window
  c.save();for(const r of rows){const hy=r.y1;if(hy>0&&hy<DQ_BENCH.back-2){c.fillStyle="rgba(236,226,206,0.55)";c.fillRect(0,hy-1.5,W,3.5);c.fillStyle="rgba(104,86,64,0.5)";c.fillRect(0,hy-2.5,W,1.6);c.fillStyle="rgba(255,250,240,0.4)";c.fillRect(0,hy+2,W,1.2);}
    for(const x of r.xs){if(x<0||x>W)continue;const y0=Math.max(0,r.y0+2),hh=Math.min(DQ_BENCH.back,r.y1)-y0-2;if(hh<=0)continue;
      c.fillStyle="rgba(236,226,206,0.55)";c.fillRect(x-1.5,y0,3.5,hh);c.fillStyle="rgba(104,86,64,0.42)";c.fillRect(x+2,y0,1.4,hh);c.fillStyle="rgba(255,250,240,0.32)";c.fillRect(x-2.6,y0,1.1,hh);}}
  c.restore();}
function dq_paintBench(c,o){o=o||{};const B=DQ_BENCH;dq_paintWall(c,o);
  // the shadow the bench and the cards along it cast on the wall, just above its back edge
  let g=c.createLinearGradient(0,B.back-90,0,B.back);g.addColorStop(0,"rgba(70,52,34,0)");g.addColorStop(1,"rgba(70,52,34,0.3)");c.fillStyle=g;c.fillRect(0,B.back-90,W,90);
  // the top, seen at a low angle: the crystals flattened, a sheen where it takes the wall's light at the back and the window's on the right
  dq_granite(c,0,B.back,W,B.front-B.back,{squash:0.28,seed:31,density:0.022});
  g=c.createLinearGradient(0,B.back,0,B.front);g.addColorStop(0,"rgba(214,200,180,0.2)");g.addColorStop(0.35,"rgba(214,200,180,0.06)");g.addColorStop(1,"rgba(214,200,180,0)");c.fillStyle=g;c.fillRect(0,B.back,W,B.front-B.back);
  c.save();c.beginPath();c.rect(0,B.back,W,B.front-B.back);c.clip();dq_pool(c,1560,B.back+40,620,[255,236,206],0.13,0.16);c.restore();
  c.fillStyle="rgba(24,20,18,0.8)";c.fillRect(0,B.back-1,W,2.5);
  // the front edge catches the light; the front face below it, darker, its crystals round; then the shadow under the bench
  dq_granite(c,0,B.front,W,B.face-B.front,{squash:1,seed:37,base:[30,28,28],density:0.018});
  g=c.createLinearGradient(0,B.front,0,B.face);g.addColorStop(0,"rgba(255,248,236,0.1)");g.addColorStop(0.3,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0.3)");c.fillStyle=g;c.fillRect(0,B.front,W,B.face-B.front);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(236,226,210,0.3)");g.addColorStop(0.7,"rgba(236,226,210,0.55)");g.addColorStop(1,"rgba(255,246,230,0.75)");c.fillStyle=g;c.fillRect(0,B.front-1,W,2);
  g=c.createLinearGradient(0,B.face,0,H);g.addColorStop(0,"#0c0a09");g.addColorStop(0.25,"#16130f");g.addColorStop(1,"#1d1914");c.fillStyle=g;c.fillRect(0,B.face,W,H-B.face);
  c.fillStyle="rgba(255,240,220,0.06)";c.fillRect(0,B.face+30,W,1.5);}
function dq_paintTop(c,o){o=o||{};dq_granite(c,0,0,W,H,{squash:1,seed:o.seed||41,density:0.017});
  // the lamp's warm pool, the window's daylight from the right, and the plate's edges falling into shadow
  dq_pool(c,o.lamp?o.lamp[0]:760,o.lamp?o.lamp[1]:420,1150,[255,214,164],0.11);
  const g=c.createLinearGradient(W,0,W*0.45,0);g.addColorStop(0,"rgba(226,232,240,0.09)");g.addColorStop(1,"rgba(226,232,240,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const v=c.createRadialGradient(W*0.47,H*0.45,H*0.4,W/2,H/2,W*0.72);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.42)");c.fillStyle=v;c.fillRect(0,0,W,H);}
// the Great Hall: tall leaded windows above, a moulded cornice, oak panelling in bays between fluted pilasters, and the stage's plum
// velvet backcloth in the middle, under a pelmet, warmly lit from the front
function dq_paintHall(c,o){o=o||{};const D=DQ_HALL,nz=dq_noise(o.seed||53),oak=DQ.oak,plaster=[214,196,166],velvet=[78,42,70],c0=D.cloth[0],c1=D.cloth[1],top=D.cornice+30,pel=top+64;
  // the plaster, the oak's grain and the velvet's folds, painted at once
  dq_field(c,0,0,W,H,2,(px,py,out)=>{let col;
    if(py<D.sill+10){const m=nz(px/380,py/380,3),f=nz(px/40,py/40,2);col=plaster.map(v=>v*(0.88+0.1*m+0.04*(f-0.5)));}
    else if(px>c0&&px<c1&&py>pel){const u=(px-c0)/(c1-c0),wob=nz(px/90,py/520,2),ph=(px-c0)/68*Math.PI+wob*2.2,fold=0.5+0.5*Math.sin(ph),crest=Math.pow(fold,6),
        k=0.6+0.42*fold+0.06*(nz(px/30,py/30,2)-0.5);col=velvet.map((v,i)=>v*k+crest*[46,30,46][i]);col=col.map(v=>v*(0.92+0.08*Math.sin(u*Math.PI)));}
    else{const gr=nz(px/18,py/420,3),ry=nz(px/160,py/60,2),m=nz(px/300,py/300,2);col=oak.map((v,i)=>v*(0.78+0.3*gr+0.08*ry+0.08*m)+[6,2,0][i]);}
    const lit=0.7+0.4*(1-Math.min(1,Math.hypot((px-960)/1150,(py-600)/760)));out[0]=Math.min(255,col[0]*lit);out[1]=Math.min(255,col[1]*lit);out[2]=Math.min(255,col[2]*lit);});
  // the windows: stone jambs and a deep reveal, leaded panes of slightly different glass, a stone mullion, bright with the day
  const r=ag_rnd(57);for(const wx of [120,1430]){const ww=370,wt=-30,wb=D.sill;
    c.fillStyle="rgba(176,156,124,1)";c.fillRect(wx-30,wt,ww+60,wb-wt+16);c.fillStyle="rgba(120,100,76,0.55)";c.fillRect(wx-30,wt,14,wb-wt+16);c.fillStyle="rgba(232,218,194,0.5)";c.fillRect(wx+ww+16,wt,14,wb-wt+16);
    const pw=ww/2-10;for(const side of [0,1]){const x0=wx+side*(pw+20),g=c.createLinearGradient(0,wt,0,wb);g.addColorStop(0,"#eef1f2");g.addColorStop(0.6,"#fbf5e6");g.addColorStop(1,"#f4e6c6");c.fillStyle=g;c.fillRect(x0,wt,pw,wb-wt);
      // diamond quarries of old glass, each a little different, held in lead
      c.save();c.beginPath();c.rect(x0,wt,pw,wb-wt);c.clip();const q=38;for(let i=-8;i<14;i++)for(let j=-2;j<12;j++){const cx=x0+i*q+(j%2)*q/2,cy=wb-j*q*0.85;
        c.fillStyle="rgba("+(r()<0.5?"214,196,160":"200,206,212")+","+(r()*0.2)+")";c.beginPath();c.moveTo(cx,cy-q*0.85/2);c.lineTo(cx+q/2,cy);c.lineTo(cx,cy+q*0.85/2);c.lineTo(cx-q/2,cy);c.closePath();c.fill();}
      c.strokeStyle="rgba(70,62,56,0.7)";c.lineWidth=2;for(let k=-20;k<30;k++){const bx=x0+k*q/2;c.beginPath();c.moveTo(bx,wb);c.lineTo(bx+(wb-wt)/0.85*0.5*1.0,wt);c.stroke();c.beginPath();c.moveTo(bx,wb);c.lineTo(bx-(wb-wt)/0.85*0.5*1.0,wt);c.stroke();}
      c.restore();c.fillStyle="rgba(90,80,70,0.85)";c.fillRect(x0,wb-110,pw,5);}
    let g=c.createLinearGradient(wx+ww/2-10,0,wx+ww/2+10,0);g.addColorStop(0,"#8c7656");g.addColorStop(0.5,"#c8b08a");g.addColorStop(1,"#9a8462");c.fillStyle=g;c.fillRect(wx+pw,wt,20,wb-wt);
    g=c.createLinearGradient(0,wb,0,wb+18);g.addColorStop(0,"#d8c6a4");g.addColorStop(1,"#8a7454");c.fillStyle=g;c.fillRect(wx-40,wb,ww+80,18);
    dq_pool(c,wx+ww/2,wb-90,460,[255,240,214],0.16,0.75);}
  // the cornice: fillets, a bold curved moulding and dentils, lit from above, its shadow on the panels below
  let g=c.createLinearGradient(0,D.sill+14,0,top);g.addColorStop(0,"#5a3a22");g.addColorStop(0.12,"#c89c6c");g.addColorStop(0.22,"#7a5030");g.addColorStop(0.42,"#b4865a");g.addColorStop(0.62,"#6e4628");g.addColorStop(0.7,"#3a2414");g.addColorStop(1,"#5a3a22");
  c.fillStyle=g;c.fillRect(0,D.sill+14,W,top-D.sill-14);for(let x=6;x<W;x+=26){c.fillStyle="rgba(206,164,116,0.5)";c.fillRect(x,top-18,14,3);c.fillStyle="rgba(28,16,8,0.45)";c.fillRect(x,top-15,14,11);}
  g=c.createLinearGradient(0,top,0,top+40);g.addColorStop(0,"rgba(24,12,4,0.55)");g.addColorStop(1,"rgba(24,12,4,0)");c.fillStyle=g;c.fillRect(0,top,W,40);
  // the panels: raised and fielded, the bevels lit from above and in front; two tiers in each bay
  const bays=[[0,c0-40],[c1+40,W]],tiers=[[top+52,650],[700,1040]];
  for(const [b0,b1] of bays){const n=Math.max(1,Math.round((b1-b0)/320)),pw=(b1-b0-40)/n;for(let i=0;i<n;i++)for(const [t0,t1] of tiers){const x0=b0+20+i*pw+22,x1=x0+pw-44,bv=22;
      c.fillStyle="rgba(24,12,4,0.42)";c.fillRect(x0-6,t0-6,x1-x0+12,5);c.fillRect(x0-6,t0-6,5,t1-t0+12);c.fillStyle="rgba(255,222,176,0.16)";c.fillRect(x0-6,t1+1,x1-x0+12,4);c.fillRect(x1+1,t0-6,4,t1-t0+12);
      const bev=(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach((q,j)=>j?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();c.fill();};
      bev([[x0,t0],[x1,t0],[x1-bv,t0+bv],[x0+bv,t0+bv]],"rgba(255,222,176,0.17)");bev([[x0,t1],[x1,t1],[x1-bv,t1-bv],[x0+bv,t1-bv]],"rgba(24,12,4,0.3)");
      bev([[x0,t0],[x0+bv,t0+bv],[x0+bv,t1-bv],[x0,t1]],"rgba(24,12,4,0.14)");bev([[x1,t0],[x1-bv,t0+bv],[x1-bv,t1-bv],[x1,t1]],"rgba(255,222,176,0.08)");
      c.fillStyle="rgba(255,226,180,0.05)";c.fillRect(x0+bv,t0+bv,x1-x0-2*bv,t1-t0-2*bv);}}
  // the pilasters beside the backcloth: fluted, with a moulded capital under the cornice
  for(const px of [c0-20,c1+20]){g=c.createLinearGradient(px-38,0,px+38,0);g.addColorStop(0,"#4a2c16");g.addColorStop(0.25,"#9c6c42");g.addColorStop(0.55,"#7a4e2c");g.addColorStop(0.85,"#a87a4c");g.addColorStop(1,"#3a2210");
    c.fillStyle=g;c.fillRect(px-38,top,76,H-top);for(const fx of [-20,-7,7,20]){c.fillStyle="rgba(28,14,6,0.32)";c.fillRect(px+fx-3,top+70,6,H);c.fillStyle="rgba(255,220,170,0.12)";c.fillRect(px+fx+3,top+70,1.5,H);}
    g=c.createLinearGradient(0,top,0,top+56);g.addColorStop(0,"#c89a68");g.addColorStop(0.4,"#7a4e2c");g.addColorStop(0.7,"#b4865a");g.addColorStop(1,"#4a2c16");c.fillStyle=g;c.fillRect(px-50,top,100,56);}
  // the pelmet over the backcloth, and the backcloth's edges deepening into its folds
  g=c.createLinearGradient(0,top,0,pel);g.addColorStop(0,"#3e2032");g.addColorStop(0.5,"#6a3a5c");g.addColorStop(1,"#2c1424");c.fillStyle=g;c.fillRect(c0+18,top,c1-c0-36,pel-top);
  c.fillStyle="rgba(230,196,214,0.16)";c.fillRect(c0+18,top+6,c1-c0-36,2);c.fillStyle="rgba(14,6,12,0.55)";c.fillRect(c0+18,pel,c1-c0-36,10);
  g=c.createLinearGradient(c0,0,c1,0);g.addColorStop(0,"rgba(14,6,12,0.6)");g.addColorStop(0.1,"rgba(14,6,12,0)");g.addColorStop(0.9,"rgba(14,6,12,0)");g.addColorStop(1,"rgba(14,6,12,0.6)");c.fillStyle=g;c.fillRect(c0+18,pel,c1-c0-36,H-pel);
  // the stage lights' warm pool where people stand, and the room falling into shadow at its edges
  dq_pool(c,960,600,820,[255,212,156],0.13,0.72);
  const v=c.createRadialGradient(W/2,H*0.52,H*0.36,W/2,H/2,W*0.7);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(14,6,2,0.46)");c.fillStyle=v;c.fillRect(0,0,W,H);}
AG_PLACES.bench=c=>dq_paintBench(c);
AG_PLACES.benchTop=c=>dq_paintTop(c);
AG_PLACES.hall=c=>dq_paintHall(c);

/* ---------------------------------------------------------------- props, drawn live in a place's coordinates
   dq_lectern(ctx, x, y, s)   the hall's oak lectern, its top at (x, y), 500 px wide at s 1: draw it, then the person behind it,
                              cut at its top (o.cut = y - 28 s), no wider than it (s 0.95 or less at the lectern's s 1)
   dq_clock(ctx, x, y, r, h, m, o)  a plain wall clock showing h:m (o.a); for the bench's wall
   dq_lamp(ctx, x, y, s, o)   a pendant lamp in graphite enamel, hanging from the top of the frame to (x, y), its light on (o.on 0 to 1);
                              a film hangs it where no card goes over it */
function dq_lectern(ctx,x,y,s,o){o=o||{};s=s||1;const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  let g=ctx.createLinearGradient(-230,0,230,0);g.addColorStop(0,"#4c2e18");g.addColorStop(0.55,"#8a5a34");g.addColorStop(1,"#5e3a20");
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-214,10);ctx.lineTo(214,10);ctx.lineTo(186,600);ctx.lineTo(-186,600);ctx.closePath();ctx.fill();
  // a raised panel on its front, and the shadow of the reading slope under the top
  ctx.fillStyle="rgba(255,226,180,0.12)";ctx.fillRect(-150,96,300,3);ctx.fillRect(147,96,3,300);ctx.fillStyle="rgba(20,10,4,0.3)";ctx.fillRect(-150,396,300,3);ctx.fillRect(-150,96,3,300);
  g=ctx.createLinearGradient(0,10,0,60);g.addColorStop(0,"rgba(20,10,4,0.45)");g.addColorStop(1,"rgba(20,10,4,0)");ctx.fillStyle=g;ctx.fillRect(-214,10,428,50);
  g=ctx.createLinearGradient(0,-28,0,18);g.addColorStop(0,"#c08a58");g.addColorStop(0.45,"#9a6a3e");g.addColorStop(1,"#5a3820");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-250,-28);ctx.lineTo(250,-28);ctx.lineTo(236,18);ctx.lineTo(-236,18);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(255,236,206,0.42)";ctx.fillRect(-250,-29,500,2);ctx.restore();}
function dq_clock(ctx,x,y,r,h,m,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  ctx.shadowColor="rgba(60,44,28,0.3)";ctx.shadowBlur=r*0.25;ctx.shadowOffsetX=-r*0.06;ctx.shadowOffsetY=r*0.08;ctx.fillStyle=rgba(DQ.graphite,1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.shadowColor="transparent";
  const g=ctx.createRadialGradient(x+r*0.2,y-r*0.3,0,x,y,r*0.9);g.addColorStop(0,"#fbf7ee");g.addColorStop(1,"#ebe3d2");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*0.88,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(DQ.ink,0.85);ctx.lineCap="round";for(let i=0;i<60;i++){const an=i/60*TAU,big=i%5===0,r0=r*(big?0.7:0.78);ctx.lineWidth=big?r*0.045:r*0.015;ctx.beginPath();ctx.moveTo(x+Math.sin(an)*r0,y-Math.cos(an)*r0);ctx.lineTo(x+Math.sin(an)*r*0.83,y-Math.cos(an)*r*0.83);ctx.stroke();}
  const hand=(an,len,wd)=>{ctx.lineWidth=wd;ctx.beginPath();ctx.moveTo(x-Math.sin(an)*len*0.18,y+Math.cos(an)*len*0.18);ctx.lineTo(x+Math.sin(an)*len,y-Math.cos(an)*len);ctx.stroke();};
  ctx.strokeStyle=rgba(DQ.ink,1);hand(((h%12)+m/60)/12*TAU,r*0.46,r*0.07);hand(m/60*TAU,r*0.68,r*0.045);ctx.fillStyle=rgba(DQ.ink,1);ctx.beginPath();ctx.arc(x,y,r*0.06,0,TAU);ctx.fill();ctx.restore();}
function dq_lamp(ctx,x,y,s,o){o=o||{};s=s||1;const a=o.a==null?1:o.a,on=o.on==null?1:o.on;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle="rgba(40,38,38,0.9)";ctx.lineWidth=2.5*s;ctx.beginPath();ctx.moveTo(x,-10);ctx.lineTo(x,y-70*s);ctx.stroke();ctx.translate(x,y);ctx.scale(s,s);
  if(on>0){ctx.save();ctx.globalCompositeOperation="lighter";const cg=ctx.createLinearGradient(0,0,0,700);cg.addColorStop(0,"rgba(255,226,180,"+(0.1*on)+")");cg.addColorStop(1,"rgba(255,226,180,0)");ctx.fillStyle=cg;
    ctx.beginPath();ctx.moveTo(-96,0);ctx.lineTo(96,0);ctx.lineTo(360,700);ctx.lineTo(-360,700);ctx.closePath();ctx.fill();ctx.restore();}
  ctx.fillStyle="#2c2c30";rr(ctx,-14,-82,28,22,6);ctx.fill();
  let g=ctx.createLinearGradient(-110,0,110,0);g.addColorStop(0,"#2a2a2e");g.addColorStop(0.62,"#4c4c52");g.addColorStop(0.8,"#8a8a90");g.addColorStop(1,"#3a3a3e");ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(-22,-62);ctx.bezierCurveTo(-60,-58,-104,-30,-110,0);ctx.lineTo(110,0);ctx.bezierCurveTo(104,-30,60,-58,22,-62);ctx.closePath();ctx.fill();
  ctx.fillStyle=on>0?rgba(mix([60,52,44],[255,236,200],on),1):"#1a1a1c";ctx.beginPath();ctx.ellipse(0,0,110,14,0,0,TAU);ctx.fill();
  if(on>0)glow(ctx,0,4,120,[255,214,160],0.5*on);ctx.restore();}

/* ---------------------------------------------------------------- icons
   dq_icon(ctx, kind, x, y, s, col, o) draws an icon centred on (x, y), s px across, in a colour ([r, g, b] or a meaning's name, in its
   word tone, or dark tone with o.dark), with lines that keep their weight at any size. Kinds: "tick" (pass), "pause" (hold), "cross" (stop),
   "dash" (not checked), "warn", "clock", "calendar", "person", "people", "form" (a form someone fills in), "card" (a record), "table", "lens" (looking
   closely, a profile), "list", "printer", "certificate", "cap" (a graduation), "seat", "programme" (the printed booklet), "count" (a
   tally), "building" (the government), "link" (lineage), "why" (a question), "flag" (a report), "mail" (telling someone), "chat",
   "gauge", "band", "tag", "lock", "refresh", "hourglass", "sheet" (a spreadsheet), "tools" (the platform). */
function dq_icon(ctx,kind,x,y,s,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const c=rgba(dq_col(col,o.dark),1),u=s/48;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(u,u);
  ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=o.lw||3.6;ctx.lineCap="round";ctx.lineJoin="round";const L=pts=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();},
    O=(cx,cy,r)=>{ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();},F=(cx,cy,r)=>{ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();},R=(x0,y0,w,h,r)=>{rr(ctx,x0,y0,w,h,r);ctx.stroke();};
  switch(kind){
    case"tick":ctx.lineWidth=o.lw||5;L([[-15,1],[-4,12],[16,-12]]);break;
    case"cross":ctx.lineWidth=o.lw||5;L([[-12,-12],[12,12]]);L([[12,-12],[-12,12]]);break;
    case"warn":ctx.beginPath();ctx.moveTo(0,-19);ctx.lineTo(20,16);ctx.lineTo(-20,16);ctx.closePath();ctx.stroke();L([[0,-6],[0,5]]);F(0,11,2.6);break;
    case"dash":ctx.lineWidth=o.lw||5;L([[-13,0],[13,0]]);break;
    case"pause":ctx.lineWidth=o.lw||5.4;L([[-6,-12],[-6,12]]);L([[6,-12],[6,12]]);break;
    case"clock":O(0,0,18);L([[0,-10],[0,0],[8,6]]);break;
    case"calendar":R(-18,-14,36,32,4);L([[-18,-4],[18,-4]]);L([[-9,-20],[-9,-10]]);L([[9,-20],[9,-10]]);F(-7,6,2.6);F(2,6,2.6);F(11,6,2.6);break;
    case"person":O(0,-9,8);ctx.beginPath();ctx.moveTo(-15,18);ctx.quadraticCurveTo(-14,3,0,3);ctx.quadraticCurveTo(14,3,15,18);ctx.stroke();break;
    case"people":O(-8,-9,7);O(10,-6,6);ctx.beginPath();ctx.moveTo(-21,18);ctx.quadraticCurveTo(-20,4,-8,4);ctx.quadraticCurveTo(4,4,5,18);ctx.stroke();ctx.beginPath();ctx.moveTo(9,5);ctx.quadraticCurveTo(20,5,21,16);ctx.stroke();break;
    case"form":ctx.beginPath();ctx.moveTo(-14,-20);ctx.lineTo(7,-20);ctx.lineTo(14,-13);ctx.lineTo(14,20);ctx.lineTo(-14,20);ctx.closePath();ctx.stroke();R(-8,-10,16,7,1.5);L([[-8,4],[8,4]]);L([[-8,12],[3,12]]);break;
    case"card":R(-20,-14,40,28,3);L([[-13,-5],[13,-5]]);L([[-13,3],[13,3]]);L([[-13,10],[3,10]]);break;
    case"table":R(-18,-15,36,30,4);L([[-18,-5],[18,-5]]);L([[-18,5],[18,5]]);L([[-4,-15],[-4,15]]);break;
    case"lens":O(-4,-4,12);L([[5,5],[17,17]]);break;
    case"list":for(const yy of [-11,0,11]){F(-14,yy,2.6);L([[-6,yy],[16,yy]]);}break;
    case"printer":R(-12,-20,24,12,2);R(-20,-8,40,18,4);ctx.beginPath();ctx.rect(-12,4,24,16);ctx.save();ctx.fillStyle="rgba(255,255,255,0)";ctx.restore();ctx.stroke();L([[-7,11],[7,11]]);L([[-7,16],[4,16]]);break;
    case"certificate":R(-20,-15,40,26,2);L([[-12,-6],[12,-6]]);L([[-12,1],[6,1]]);O(10,13,6);L([[6,18],[4,24]]);L([[14,18],[16,24]]);break;
    case"cap":ctx.beginPath();ctx.moveTo(-22,-6);ctx.lineTo(0,-16);ctx.lineTo(22,-6);ctx.lineTo(0,4);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(-12,0);ctx.lineTo(-12,10);ctx.quadraticCurveTo(0,18,12,10);ctx.lineTo(12,0);ctx.stroke();L([[18,-4],[18,10]]);break;
    case"seat":L([[-10,-18],[-10,4],[12,4]]);L([[-10,4],[-12,18]]);L([[12,4],[14,18]]);L([[-10,-18],[-4,-18]]);break;
    case"programme":ctx.beginPath();ctx.moveTo(0,-14);ctx.quadraticCurveTo(-10,-20,-20,-16);ctx.lineTo(-20,16);ctx.quadraticCurveTo(-10,12,0,18);ctx.quadraticCurveTo(10,12,20,16);ctx.lineTo(20,-16);ctx.quadraticCurveTo(10,-20,0,-14);ctx.closePath();ctx.stroke();L([[0,-14],[0,18]]);break;
    case"count":for(const xx of [-14,-6,2,10])L([[xx,-14],[xx,14]]);L([[-19,10],[16,-10]]);break;
    case"building":L([[-20,18],[20,18]]);ctx.beginPath();ctx.moveTo(-20,-8);ctx.lineTo(0,-20);ctx.lineTo(20,-8);ctx.closePath();ctx.stroke();for(const xx of [-13,-4,4,13])L([[xx,-3],[xx,12]]);break;
    case"link":ctx.save();ctx.rotate(-Math.PI/4);R(-20,-7,22,14,7);R(-2,-7,22,14,7);ctx.restore();break;
    case"why":ctx.lineWidth=o.lw||4.4;ctx.beginPath();ctx.arc(0,-6,10,Math.PI*1.05,Math.PI*2.25);ctx.quadraticCurveTo(0,0,0,7);ctx.stroke();F(0,15,2.8);break;
    case"flag":L([[-14,20],[-14,-18]]);ctx.beginPath();ctx.moveTo(-14,-18);ctx.quadraticCurveTo(0,-24,16,-16);ctx.lineTo(16,2);ctx.quadraticCurveTo(0,-6,-14,0);ctx.stroke();break;
    case"mail":R(-20,-14,40,28,3);L([[-19,-12],[0,3],[19,-12]]);break;
    case"chat":ctx.beginPath();ctx.moveTo(-18,-14);ctx.lineTo(18,-14);ctx.quadraticCurveTo(22,-14,22,-10);ctx.lineTo(22,6);ctx.quadraticCurveTo(22,10,18,10);ctx.lineTo(-2,10);ctx.lineTo(-12,19);ctx.lineTo(-11,10);ctx.lineTo(-18,10);ctx.quadraticCurveTo(-22,10,-22,6);ctx.lineTo(-22,-10);ctx.quadraticCurveTo(-22,-14,-18,-14);ctx.closePath();ctx.stroke();break;
    case"gauge":ctx.beginPath();ctx.arc(0,6,19,Math.PI,0);ctx.stroke();L([[0,6],[10,-8]]);F(0,6,3);break;
    case"band":L([[-21,6],[21,6]]);for(const xx of [-21,-7,7,21])L([[xx,2],[xx,10]]);ctx.lineWidth=7;ctx.globalAlpha*=0.45;L([[-9,-6],[9,-6]]);ctx.globalAlpha/=0.45;ctx.lineWidth=o.lw||3.6;L([[3,-14],[3,0]]);break;
    case"tag":ctx.beginPath();ctx.moveTo(-20,0);ctx.lineTo(-10,-11);ctx.lineTo(20,-11);ctx.lineTo(20,11);ctx.lineTo(-10,11);ctx.closePath();ctx.stroke();O(-9,0,3.5);break;
    case"lock":ctx.beginPath();ctx.arc(0,-7,10,Math.PI,0);ctx.stroke();rr(ctx,-15,-6,30,24,5);ctx.fill();break;
    case"refresh":ctx.beginPath();ctx.arc(0,0,15,-0.6,Math.PI*1.45);ctx.stroke();ctx.beginPath();ctx.moveTo(15,-16);ctx.lineTo(14,-4);ctx.lineTo(3,-8);ctx.closePath();ctx.fill();break;
    case"hourglass":L([[-13,-19],[13,-19]]);L([[-13,19],[13,19]]);ctx.beginPath();ctx.moveTo(-10,-19);ctx.quadraticCurveTo(-10,-4,0,0);ctx.quadraticCurveTo(10,4,10,19);ctx.moveTo(10,-19);ctx.quadraticCurveTo(10,-4,0,0);ctx.quadraticCurveTo(-10,4,-10,19);ctx.stroke();break;
    case"sheet":R(-20,-16,40,32,3);L([[-20,-6],[20,-6]]);L([[-20,4],[20,4]]);L([[-6,-16],[-6,16]]);L([[7,-16],[7,16]]);break;
    case"tools":R(-20,-16,40,32,4);L([[-20,-6],[20,-6]]);F(-14,-11,1.8);F(-8,-11,1.8);L([[-12,4],[-4,10],[-12,16]].map(p=>[p[0],p[1]-3]));L([[2,13],[12,13]]);break;
  }
  ctx.restore();}
