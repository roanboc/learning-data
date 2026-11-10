/* ===== Learning while doing: Angicos, 1963 =====
   The film's own places, people and things for its opening story, in the module's matte, sunlit language, lit from the right as its
   rooms are (prefix lw_). Nothing here is a likeness or a copy of a photograph: the town, the rooms and the clothes are drawn from what
   is known of a small town of the sertão of Rio Grande do Norte in the early 1960s (low plastered houses with a parapet over the door,
   a darker band along the foot of the wall, timber shutters; the caatinga's grey-green scrub, mandacaru cacti and a carnaúba palm; a
   flat-topped serra far off), in this film's own style. Paulo Freire and the president are named on cards, never drawn.
     lwTown, lwTownEve     the main street, by day and at dusk, its windows lit where a culture circle meets (one room: AG_ROOMS)
     lwCircle              a culture circle's room at night: a whitewashed wall, a bare bulb, a slide projected on the wall
     lwClass               an adult class before Freire's team: the same kind of room, a children's primer on an easel
     lwAbroad              a plain wall far away, for the book written in exile
     lw_windows(c, lit)    the street's windows, lit as a culture circle meets behind them (lit: one value per window, 0 to 1)
     lw_slide(c, o)        what the projector shows on the wall: the hammock, the word, its syllables, their families, new words
     lw_primer, lw_book    the primer's open pages; the book, its cover of this film's own design
     LW_PEOPLE             learners and coordinators of 1963: dressed for their time and place, never likenesses
   Colour keeps the module's meaning: what people couldn't do, and the plan stopped, in amber; the plan in blue; hours and words done in
   green. The town itself wears none of the five. */

const LW_K={sky0:[160,186,206],sky1:[214,218,214],sky2:[240,228,206],eve0:[52,56,88],eve1:[128,100,122],eve2:[220,150,112],dusk:[64,58,86],
  hill:[176,174,176],hillEve:[92,80,98],scrub:[124,128,100],scrubDk:[92,98,78],branch:[118,108,98],cactus:[96,116,90],palm:[110,118,92],
  earth:[198,152,110],earthDk:[160,116,82],earthHi:[224,192,152],kerb:[206,198,186],lit:[255,206,140],
  lime:[238,232,220],ochre:[228,196,140],rose:[226,186,170],cream:[236,220,186],barra:[150,138,128],barraR:[146,90,76],
  door:[132,72,60],doorB:[150,106,62],doorG:[112,100,90],tile:[164,92,64],tileDk:[118,64,46],
  slide:[252,244,222],sepia:[96,72,52],page:[244,236,214],grape:[98,56,72],cover:[122,48,42]};

/* ---------------------------------------------------------------- the street
   One row of houses along the far side of the street, its foot at LW_GROUND; each house {x, w, h (the wall's height), col, top (its
   parapet: "flat", "step", "curve", or "roof" for a tiled roof seen over the wall), door (its middle, from x), wins (windows' middles)}.
   The windows are kept in LW_WINS, in order, so a scene can light them. */
const LW_GROUND=690;
const LW_HOUSES=[
  {x:-40,w:250,h:200,col:"lime",top:"roof",door:150,wins:[60],barra:"barra",shut:"doorG"},
  {x:210,w:240,h:232,col:"ochre",top:"step",door:70,wins:[170],barra:"barraR",shut:"door"},
  {x:450,w:270,h:214,col:"lime",top:"flat",door:200,wins:[70],barra:"barra",shut:"doorB"},
  {x:720,w:200,h:242,col:"rose",top:"curve",door:100,wins:[],barra:"barraR",shut:"doorG"},
  {x:920,w:300,h:222,col:"lime",top:"flat",door:84,wins:[188,256],barra:"barra",shut:"door"},
  {x:1220,w:230,h:238,col:"cream",top:"step",door:160,wins:[62],barra:"barraR",shut:"doorB"},
  {x:1450,w:250,h:208,col:"ochre",top:"roof",door:76,wins:[180],barra:"barra",shut:"doorG"},
  {x:1700,w:300,h:226,col:"lime",top:"flat",door:220,wins:[70,140],barra:"barraR",shut:"door"}];
const LW_DOOR={w:66,h:150},LW_WIN={w:62,h:84,y:112};
const LW_WINS=[];for(const h of LW_HOUSES)for(const wx of h.wins)LW_WINS.push({x:h.x+wx-LW_WIN.w/2,y:LW_GROUND-LW_WIN.y-LW_WIN.h,w:LW_WIN.w,h:LW_WIN.h});
// the evening's colour over a thing lit by day: the dusk's cool blue-violet, so the warm windows stand out
const lw_eve=(col,eve,k)=>eve?mix(col,LW_K.dusk,k==null?0.58:k):col;

function lw_hills(c,eve){const col=eve?LW_K.hillEve:LW_K.hill,top=eve?mix(col,LW_K.eve1,0.3):mix(col,LW_K.sky1,0.25);
  // the serra: a long flat top far off on the right, its ends sloping, and low rounded hills on the left, both in haze
  let g=c.createLinearGradient(0,380,0,LW_GROUND);g.addColorStop(0,rgba(top,1));g.addColorStop(1,rgba(col,1));c.fillStyle=g;
  c.beginPath();c.moveTo(820,LW_GROUND);c.lineTo(960,420);c.bezierCurveTo(990,398,1030,388,1080,386);c.lineTo(1640,378);c.bezierCurveTo(1700,380,1736,394,1764,412);c.lineTo(1980,470);c.lineTo(1980,LW_GROUND);c.closePath();c.fill();
  c.beginPath();c.moveTo(-20,LW_GROUND);c.lineTo(-20,450);c.bezierCurveTo(80,424,170,420,260,440);c.bezierCurveTo(330,430,420,434,520,456);c.lineTo(720,LW_GROUND);c.closePath();c.fill();
  // the serra's face catches the light from the right: a paler band under its rim
  c.fillStyle=rgba(eve?LW_K.eve2:[236,228,214],eve?0.14:0.3);c.beginPath();c.moveTo(1080,386);c.lineTo(1640,378);c.lineTo(1650,394);c.lineTo(1090,402);c.closePath();c.fill();}
// a bush of the caatinga: overlapping soft blobs, darker below
function lw_bush(c,x,y,r,R,eve){for(let k=0;k<7;k++){const bx=x+(R()-0.5)*r*1.6,by=y-R()*r*0.7,br=r*(0.45+R()*0.4),col=lw_eve(mix(LW_K.scrub,LW_K.scrubDk,R()*0.7),eve,0.62);
  const g=c.createRadialGradient(bx+br*0.3,by-br*0.3,0,bx,by,br);g.addColorStop(0,rgba(ag_lt(col,0.12),1));g.addColorStop(1,rgba(ag_dk(col,0.12),1));c.fillStyle=g;c.beginPath();c.arc(bx,by,br,0,TAU);c.fill();}}
// bare branches of a dry tree, forking up from x at y
function lw_twigs(c,x,y,h,R,eve){c.save();c.strokeStyle=rgba(lw_eve(LW_K.branch,eve,0.6),1);c.lineCap="round";
  const br=(x0,y0,an,len,w,d)=>{if(d>4||len<12)return;const x1=x0+Math.sin(an)*len,y1=y0-Math.cos(an)*len;c.lineWidth=w;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();
    br(x1,y1,an-0.25-R()*0.45,len*(0.55+R()*0.25),w*0.66,d+1);if(R()<0.8)br(x1,y1,an+0.2+R()*0.45,len*(0.5+R()*0.25),w*0.66,d+1);};
  br(x,y,(R()-0.5)*0.2,h*0.42,6,0);c.restore();}
// a mandacaru: a tall green column with arms that turn up, ribbed, lit from the right
function lw_cactus(c,x,y,h,eve){const col=lw_eve(LW_K.cactus,eve,0.6),hi=ag_lt(col,0.22),dk=ag_dk(col,0.3),w=h*0.1;
  const col3=(x0,y0,y1,wd)=>{const g=c.createLinearGradient(x0-wd/2,0,x0+wd/2,0);g.addColorStop(0,rgba(dk,1));g.addColorStop(0.65,rgba(col,1));g.addColorStop(1,rgba(hi,1));c.fillStyle=g;
    c.beginPath();c.moveTo(x0-wd/2,y0);c.lineTo(x0-wd/2,y1+wd/2);c.arc(x0,y1+wd/2,wd/2,Math.PI,0);c.lineTo(x0+wd/2,y0);c.closePath();c.fill();
    c.strokeStyle=rgba(dk,0.35);c.lineWidth=1.4;for(const f of [-0.2,0.15]){c.beginPath();c.moveTo(x0+f*wd,y0);c.lineTo(x0+f*wd,y1+wd*0.6);c.stroke();}};
  col3(x,y,y-h,w);
  // two arms: out, then up
  for(const [s,at,up] of [[-1,0.42,0.32],[1,0.55,0.26]]){const ay=y-h*at,ax=x+s*w*1.5;c.fillStyle=rgba(s<0?dk:col,1);c.beginPath();c.moveTo(x,ay-w*0.35);c.quadraticCurveTo(ax,ay-w*0.35,ax,ay-w);c.lineTo(ax+s*w*0.9,ay-w);c.quadraticCurveTo(ax+s*w*0.9,ay+w*0.45,x,ay+w*0.45);c.closePath();c.fill();
    col3(ax+s*w*0.45,ay-w*0.8,ay-h*up-w,w*0.86);}}
// a carnaúba palm: a slim grey trunk, and a round crown of fan leaves of uneven length, the lower ones drooping, the old ones dry
function lw_palm(c,x,y,h,R,eve){const tr=lw_eve([150,140,128],eve,0.6);c.strokeStyle=rgba(tr,1);c.lineWidth=11;c.lineCap="round";c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+10,y-h*0.5,x+4,y-h);c.stroke();
  c.strokeStyle=rgba(ag_lt(tr,0.25),0.6);c.lineWidth=3;c.beginPath();c.moveTo(x+3,y);c.quadraticCurveTo(x+13,y-h*0.5,x+7,y-h);c.stroke();
  const cx=x+4,cy=y-h;
  for(let k=0;k<17;k++){const an=-Math.PI*1.04+k/16*Math.PI*1.08+(R()-0.5)*0.16,droop=Math.max(0,Math.sin(an))*0.9+0.08,len=50+R()*34,dry=k<2||k>14,
      col=lw_eve(dry?[150,136,104]:mix(LW_K.palm,LW_K.scrubDk,R()*0.5),eve,0.62),
      ex=cx+Math.cos(an)*len,ey=cy+Math.sin(an)*len*0.7+droop*len*0.5,mx=cx+Math.cos(an)*len*0.45,my=cy+Math.sin(an)*len*0.32;
    // a stalk, then the leaf fanning out from its end into fingers
    c.strokeStyle=rgba(col,1);c.lineWidth=2.2;c.beginPath();c.moveTo(cx,cy);c.lineTo(mx,my);c.stroke();
    c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(mx,my);const n=6,sp=0.34;
    for(let f=0;f<=n;f++){const a2=Math.atan2(ey-my,ex-mx)-sp+f/n*2*sp,l2=Math.hypot(ex-mx,ey-my)*(0.86+0.14*Math.sin(f*1.7+k));c.lineTo(mx+Math.cos(a2)*l2,my+Math.sin(a2)*l2);
      if(f<n){const a3=a2+sp/n;c.lineTo(mx+Math.cos(a3)*l2*0.72,my+Math.sin(a3)*l2*0.72);}}
    c.closePath();c.fill();}}
function lw_scrub(c,eve){const R=ag_rnd(63);
  for(let x=-40;x<1980;x+=60+R()*50)lw_bush(c,x,LW_GROUND-160-R()*30,40+R()*26,R,eve);
  for(const x of [120,640,1110,1590,1880])lw_twigs(c,x,LW_GROUND-180,180+R()*60,R,eve);
  lw_palm(c,1330,LW_GROUND-200,250,R,eve);lw_palm(c,560,LW_GROUND-200,210,R,eve);
  lw_cactus(c,170,LW_GROUND-190,190,eve);lw_cactus(c,1560,LW_GROUND-190,230,eve);}
// one house: its wall, its parapet, the band at its foot, its door and windows (shutters closed by day; the windows a scene lights are
// drawn again by lw_windows)
function lw_house(c,h,eve){const G=LW_GROUND,top=G-h.h,x0=h.x,x1=h.x+h.w,base=lw_eve(LW_K[h.col],eve,0.6),sh=lw_eve(LW_K[h.shut],eve,0.5);
  // the roof over the wall, for a house without a parapet
  if(h.top==="roof"){const tl=lw_eve(LW_K.tile,eve,0.55);let g=c.createLinearGradient(0,top-46,0,top+6);g.addColorStop(0,rgba(ag_dk(tl,0.12),1));g.addColorStop(1,rgba(tl,1));c.fillStyle=g;
    c.beginPath();c.moveTo(x0-14,top+6);c.lineTo(x0+30,top-46);c.lineTo(x1-30,top-46);c.lineTo(x1+14,top+6);c.closePath();c.fill();
    c.strokeStyle=rgba(lw_eve(LW_K.tileDk,eve,0.55),0.55);c.lineWidth=2;for(let x=x0+6;x<x1;x+=16){c.beginPath();c.moveTo(x,top+4);c.lineTo(x+(x-(x0+x1)/2)*0.06,top-42);c.stroke();}
    c.fillStyle=rgba(lw_eve(LW_K.tileDk,eve,0.55),1);c.fillRect(x0-14,top+2,h.w+28,7);}
  // the wall, lit from the right
  let g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,rgba(ag_dk(base,0.06),1));g.addColorStop(1,rgba(ag_lt(base,0.06),1));c.fillStyle=g;c.fillRect(x0,top,h.w,h.h);
  // the parapet: a cornice along the top, and its shape
  const cor=lw_eve(ag_lt(LW_K[h.col],0.35),eve,0.6);
  if(h.top!=="roof"){c.fillStyle=rgba(base,1);c.beginPath();c.moveTo(x0,top);
    if(h.top==="step"){const m=(x0+x1)/2;c.lineTo(x0,top);c.lineTo(m-60,top);c.lineTo(m-60,top-18);c.lineTo(m-28,top-18);c.lineTo(m-28,top-32);c.lineTo(m+28,top-32);c.lineTo(m+28,top-18);c.lineTo(m+60,top-18);c.lineTo(m+60,top);c.lineTo(x1,top);}
    else if(h.top==="curve"){const m=(x0+x1)/2;c.lineTo(m-70,top);c.quadraticCurveTo(m,top-50,m+70,top);c.lineTo(x1,top);}
    c.lineTo(x1,top+2);c.lineTo(x0,top+2);c.closePath();c.fill();
    c.fillStyle=rgba(cor,1);c.fillRect(x0,top+16,h.w,7);c.fillStyle=rgba(ag_dk(base,0.25),0.5);c.fillRect(x0,top+23,h.w,4);}
  // the band along the foot of the wall
  c.fillStyle=rgba(lw_eve(LW_K[h.barra],eve,0.55),1);c.fillRect(x0,G-44,h.w,44);c.fillStyle=rgba(ag_lt(lw_eve(LW_K[h.barra],eve,0.55),0.2),1);c.fillRect(x0,G-46,h.w,3);
  // a little shade where it meets a taller neighbour on its right, and down its left edge
  c.fillStyle="rgba(40,30,40,0.10)";c.fillRect(x0,top,10,h.h);
  // the door: two timber leaves in a reveal
  const dx=x0+h.door-LW_DOOR.w/2,dy=G-LW_DOOR.h;lw_opening(c,dx,dy,LW_DOOR.w,LW_DOOR.h,sh,eve,true);
  for(const wx of h.wins)lw_opening(c,x0+wx-LW_WIN.w/2,G-LW_WIN.y-LW_WIN.h,LW_WIN.w,LW_WIN.h,sh,eve,false);}
// a door or a window: the reveal's shadow on its left and top (the light is from the right), then its shutters, closed
function lw_opening(c,x,y,w,h,col,eve,door){c.fillStyle="rgba(30,22,26,0.45)";c.fillRect(x-4,y-4,w+8,h+4);
  let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(ag_dk(col,0.18),1));g.addColorStop(1,rgba(ag_lt(col,0.1),1));c.fillStyle=g;c.fillRect(x+3,y+4,w-3,h-4);
  c.strokeStyle=rgba(ag_dk(col,0.4),0.7);c.lineWidth=2;c.beginPath();c.moveTo(x+w/2,y+4);c.lineTo(x+w/2,y+h);c.stroke();
  for(const u of door?[0.3,0.62]:[0.5]){c.beginPath();c.moveTo(x+6,y+h*u);c.lineTo(x+w-4,y+h*u);c.stroke();}
  c.fillStyle="rgba(30,22,26,0.28)";c.fillRect(x+3,y+4,w-3,5);
  // the sill
  if(!door){c.fillStyle=rgba(lw_eve([230,224,212],eve,0.6),1);c.fillRect(x-8,y+h,w+16,7);}}
function lw_street(c,eve){const G=LW_GROUND;
  // the pavement along the houses, then the street's beaten earth, paler in the middle where the sun falls
  c.fillStyle=rgba(lw_eve(LW_K.kerb,eve,0.6),1);c.fillRect(0,G,W,16);c.fillStyle=rgba(lw_eve(ag_dk(LW_K.kerb,0.25),eve,0.6),1);c.fillRect(0,G+16,W,6);
  const k=0.5,w=Math.ceil(W*k),hh=Math.ceil((H-G-22)*k),img=c.createImageData(w,hh),d=img.data;
  for(let j=0;j<hh;j++)for(let i=0;i<w;i++){const X=i/k,Y=j/k,n=LP_NZ.fbm(X*0.004,Y*0.012,4)-0.5,f=LP_NZ.fbm(X*0.03,Y*0.06,2)-0.5,v=j/hh,
      base=mix(LW_K.earthHi,LW_K.earth,clamp(0.35+v*0.6,0,1)),col=lw_eve(base,eve,0.6),L=n*26+f*10,q=(j*w+i)*4;
    d[q]=col[0]+L;d[q+1]=col[1]+L*0.92;d[q+2]=col[2]+L*0.84;d[q+3]=255;}
  const cv=mkCanvas(w,hh);cv.getContext("2d").putImageData(img,0,0);c.drawImage(cv,0,0,w,hh,0,G+22,W,H-G-22);
  // the houses' short shadows on the pavement, down and to the left
  c.fillStyle="rgba(40,28,30,0.12)";c.fillRect(0,G,W,8);}
function lw_paintTown(c,eve){let g=c.createLinearGradient(0,0,0,LW_GROUND);
  if(!eve){g.addColorStop(0,rgba(LW_K.sky0,1));g.addColorStop(0.6,rgba(LW_K.sky1,1));g.addColorStop(1,rgba(LW_K.sky2,1));}
  else{g.addColorStop(0,rgba(LW_K.eve0,1));g.addColorStop(0.55,rgba(LW_K.eve1,1));g.addColorStop(1,rgba(LW_K.eve2,1));}
  c.fillStyle=g;c.fillRect(0,0,W,LW_GROUND+20);
  // the sun's glow, high on the right by day; at dusk the last light low on the right
  const sg=c.createRadialGradient(1760,eve?560:60,0,1760,eve?560:60,eve?760:620);sg.addColorStop(0,eve?"rgba(255,190,130,0.45)":"rgba(255,248,226,0.7)");sg.addColorStop(1,"rgba(255,240,220,0)");c.fillStyle=sg;c.fillRect(0,0,W,LW_GROUND);
  lw_hills(c,eve);lw_scrub(c,eve);for(const h of LW_HOUSES)lw_house(c,h,eve);lw_street(c,eve);
  if(eve){c.fillStyle="rgba(26,22,44,0.16)";c.fillRect(0,0,W,H);}}
AG_PLACES.lwTown=c=>lw_paintTown(c,false);
AG_PLACES.lwTownEve=c=>lw_paintTown(c,true);
AG_ROOMS.lwTownEve="lwTown";
// the street's windows, lit from inside where a culture circle meets: a warm lamp's light behind the open shutters, and its glow on
// the wall around (lit: a value per window of LW_WINS, 0 to 1)
function lw_windows(c,lit){LW_WINS.forEach((wn,i)=>{const a=clamp(lit[i]||0,0,1);if(a<=0.004)return;c.save();c.globalAlpha*=a;
  const gl=c.createRadialGradient(wn.x+wn.w/2,wn.y+wn.h/2,0,wn.x+wn.w/2,wn.y+wn.h/2,wn.w*1.6);gl.addColorStop(0,"rgba(255,196,120,0.35)");gl.addColorStop(1,"rgba(255,196,120,0)");c.fillStyle=gl;c.fillRect(wn.x-wn.w*1.2,wn.y-wn.h,wn.w*3.4,wn.h*3);
  let g=c.createLinearGradient(0,wn.y,0,wn.y+wn.h);g.addColorStop(0,"rgb(255,214,150)");g.addColorStop(1,"rgb(236,160,92)");c.fillStyle=g;c.fillRect(wn.x+3,wn.y+4,wn.w-3,wn.h-4);
  // the shutters folded back against the reveal, dark
  c.fillStyle="rgba(70,40,34,0.85)";c.fillRect(wn.x+3,wn.y+4,7,wn.h-4);c.fillRect(wn.x+wn.w-7,wn.y+4,7,wn.h-4);
  // a bare bulb's brighter spot near the top
  const b=c.createRadialGradient(wn.x+wn.w*0.55,wn.y+wn.h*0.3,0,wn.x+wn.w*0.55,wn.y+wn.h*0.3,wn.w*0.5);b.addColorStop(0,"rgba(255,246,220,0.9)");b.addColorStop(1,"rgba(255,246,220,0)");c.fillStyle=b;c.fillRect(wn.x,wn.y,wn.w,wn.h);
  c.restore();});}

/* ---------------------------------------------------------------- the rooms at night
   A culture circle met in a house or a school room, at night after work, under a bare bulb; the slides were projected on the wall.
   lwCircle and lwClass are the module's limewash room in the evening, with a bulb hanging over its lamp's pool of light. */
function lw_bulb(c,x,y){c.strokeStyle="rgba(40,34,30,0.9)";c.lineWidth=2.4;c.beginPath();c.moveTo(x,0);c.lineTo(x,y-14);c.stroke();
  c.fillStyle="rgb(70,62,56)";c.fillRect(x-7,y-18,14,14);
  const g=c.createRadialGradient(x,y+6,0,x,y+6,90);g.addColorStop(0,"rgba(255,244,214,0.95)");g.addColorStop(0.18,"rgba(255,226,170,0.55)");g.addColorStop(1,"rgba(255,210,150,0)");c.fillStyle=g;c.fillRect(x-90,y-84,180,180);
  c.fillStyle="rgb(255,248,226)";c.beginPath();c.ellipse(x,y+8,11,14,0,0,TAU);c.fill();}
AG_PLACES.lwCircle=c=>{lp_paintRoom(c,{light:"evening",seed:7,base:[228,220,204],lamp:[330,250]});lw_bulb(c,330,190);};
AG_PLACES.lwClass=c=>{lp_paintRoom(c,{light:"evening",seed:3,base:[222,218,204],lamp:[700,250]});lw_bulb(c,700,190);};
AG_PLACES.lwAbroad=c=>lp_paintRoom(c,{light:"grey",seed:9,base:[214,210,204]});
// the slide's light on the wall: a warm white rectangle with soft edges, and the projector's faint beam from below on the left
const LW_SL={x:1040,y:150,w:640,h:420,from:[930,760]};
function lw_slideLight(c,a){if(a<=0.004)return;const S=LW_SL;c.save();c.globalAlpha*=a;c.globalCompositeOperation="screen";
  c.fillStyle="rgba(255,236,190,0.07)";c.beginPath();c.moveTo(S.from[0],S.from[1]-8);c.lineTo(S.x,S.y);c.lineTo(S.x+S.w,S.y+S.h*0.06);c.lineTo(S.x+S.w,S.y+S.h);c.lineTo(S.x,S.y+S.h);c.lineTo(S.from[0],S.from[1]+8);c.closePath();c.fill();
  c.restore();c.save();c.globalAlpha*=a;c.shadowColor="rgba(255,236,190,0.6)";c.shadowBlur=40;c.fillStyle=rgba(LW_K.slide,1);c.fillRect(S.x,S.y,S.w,S.h);c.restore();}
// the projector on the table: a small boxy machine, its lens towards the wall
function lw_projector(c,x,y,a){if(a<=0.004)return;c.save();c.globalAlpha*=a;const col=[70,66,64];
  ag_soft(c,cc=>ag_rect(cc,x-70,y-62,128,62,8),col,ag_lt(col,0.3),x+30,y-50,90,"rgba(0,0,0,0.4)",8);
  ag_soft(c,cc=>cc.ellipse(x+64,y-32,12,18,0,0,TAU),[40,38,40],[200,196,186],x+66,y-38,14,null);
  c.fillStyle="rgba(255,240,200,0.8)";c.beginPath();c.ellipse(x+70,y-32,4,9,0,0,TAU);c.fill();
  c.fillStyle="rgb(52,48,48)";c.fillRect(x-56,y-74,64,12);c.restore();}
/* lw_slide(c, o): what the slide shows, inside LW_SL. o: pic (the hammock, 0 to 1), word (belota under it), syl (its syllables),
   fam (their families, a row each), news ([0 to 1, ...] for the new words the learners make), a */
const LW_FAM=[["ba","be","bi","bo","bu"],["la","le","li","lo","lu"],["ta","te","ti","to","tu"]],LW_NEW=["bola","lata","bota"];
function lw_slide(c,o){const S=LW_SL,a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;c.save();c.beginPath();c.rect(S.x,S.y,S.w,S.h);c.clip();
  const ink=LW_K.sepia,pic=o.pic||0,word=o.word||0,syl=o.syl||0,fam=o.fam||0;
  if(pic>0.004){c.save();c.globalAlpha*=pic*(1-fam);lw_hammock(c,S.x+S.w/2,S.y+150,470);c.restore();}
  if(word>0.004){const wa=word*(1-syl);if(wa>0.004)lp_T(c,"belota",S.x+S.w/2,S.y+S.h-56,{w:800,size:72,align:"center",col:ink,a:wa});}
  if(syl>0.004){const y=fam>0.004?S.y+86:S.y+S.h-56,sz=fam>0.004?56:72;lp_T(c,"be · lo · ta",S.x+S.w/2,lerp(S.y+S.h-56,y,ag_sine(fam)),{w:800,size:lerp(72,sz,ag_sine(fam)),align:"center",col:ink,a:syl});}
  if(fam>0.004)LW_FAM.forEach((row,i)=>{const fa=clamp(fam*3-i,0,1);if(fa<=0.004)return;
    row.forEach((s,j)=>lp_T(c,s,S.x+90+j*88,S.y+176+i*72,{w:700,size:44,align:"center",col:ink,a:fa}));});
  c.restore();
  // the words the learners make from them, at the slide's right, in green: something they did
  (o.news||[]).forEach((u,i)=>{if(u<=0.004)return;lp_T(c,LW_NEW[i],S.x+S.w-40,S.y+176+i*72,{w:800,size:44,align:"right",col:LP.green,a:u});});
  c.restore();}
// a hammock slung between two posts, its cords gathered at each end, a fringe of tassels (belotas) along its sides: drawn in sepia,
// as a slide's line drawing
function lw_hammock(c,cx,y,w){const ink=rgba(LW_K.sepia,1),x0=cx-w/2,x1=cx+w/2;c.save();c.strokeStyle=ink;c.lineCap="round";c.lineJoin="round";
  // the posts
  c.lineWidth=7;for(const x of [x0,x1]){c.beginPath();c.moveTo(x,y-110);c.lineTo(x,y+140);c.stroke();}
  // the cords from each post to the cloth
  c.lineWidth=2;for(let k=0;k<6;k++){const u=k/5;c.beginPath();c.moveTo(x0+4,y-80);c.lineTo(x0+96,y-30+u*44);c.moveTo(x1-4,y-80);c.lineTo(x1-96,y-30+u*44);c.stroke();}
  // the cloth, sagging
  c.fillStyle="rgba(150,104,72,0.18)";c.lineWidth=4;c.beginPath();c.moveTo(x0+96,y-32);c.quadraticCurveTo(cx,y+130,x1-96,y-32);c.lineTo(x1-96,y+14);c.quadraticCurveTo(cx,y+150,x0+96,y+14);c.closePath();c.fill();c.stroke();
  c.lineWidth=1.6;for(let k=1;k<6;k++){const v=k/6;c.beginPath();c.moveTo(x0+96,lerp(y-32,y+14,v));c.quadraticCurveTo(cx,lerp(y+130,y+150,v),x1-96,lerp(y-32,y+14,v));c.stroke();}
  // the tassels along the lower edge: a knot, then a little bunch of threads
  for(let k=0;k<13;k++){const u=(k+0.5)/13,px=lerp(x0+100,x1-100,u),py=y+14+(1-Math.pow(2*u-1,2))*68+2;
    c.lineWidth=2;c.beginPath();c.moveTo(px,py);c.lineTo(px,py+14);c.stroke();c.beginPath();c.arc(px,py+18,4.5,0,TAU);c.fillStyle=ink;c.fill();
    for(const dx of [-5,-2,2,5]){c.beginPath();c.moveTo(px,py+21);c.lineTo(px+dx,py+38);c.stroke();}}
  c.restore();}

/* ---------------------------------------------------------------- things
   lw_easel and lw_primer: the old way, a children's primer open on an easel; lw_book: the book written in exile, its cover of this
   film's own design; lw_hours: the forty hours, a square for each, done in green; lw_heldPaper, lw_heldLetter, lw_heldNote: what the
   near hand holds, in figure space (lp_person's o.holdBack, so the fingers close over it) */
function lw_easel(c,x,y,h){const tb=[150,112,78];c.save();c.strokeStyle=rgba(tb,1);c.lineCap="round";c.lineWidth=12;
  c.beginPath();c.moveTo(x-110,y+h);c.lineTo(x-20,y);c.moveTo(x+110,y+h);c.lineTo(x+20,y);c.stroke();c.strokeStyle=rgba(ag_dk(tb,0.25),1);c.beginPath();c.moveTo(x,y+30);c.lineTo(x,y+h+10);c.stroke();c.restore();}
function lw_primer(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*0.62,m=x+w/2;c.save();c.globalAlpha*=a;
  // the two pages, curving down into the spine, a soft shadow under them
  c.save();c.shadowColor="rgba(30,22,24,0.45)";c.shadowBlur=24;c.shadowOffsetX=-8;c.shadowOffsetY=12;c.fillStyle=rgba(LW_K.page,1);
  c.beginPath();c.moveTo(x,y+10);c.quadraticCurveTo(x+w*0.25,y-8,m,y+12);c.quadraticCurveTo(x+w*0.75,y-8,x+w,y+10);c.lineTo(x+w,y+h);c.quadraticCurveTo(x+w*0.75,y+h-14,m,y+h+4);c.quadraticCurveTo(x+w*0.25,y+h-14,x,y+h);c.closePath();c.fill();c.restore();
  let g=c.createLinearGradient(m-60,0,m+60,0);g.addColorStop(0,"rgba(90,70,50,0)");g.addColorStop(0.5,"rgba(90,70,50,0.28)");g.addColorStop(1,"rgba(90,70,50,0)");c.fillStyle=g;c.fillRect(m-60,y+4,120,h);
  // the left page: a bunch of grapes, as a children's book draws it
  const gx=x+w*0.25,gy=y+h*0.42;c.fillStyle="rgb(110,86,60)";c.fillRect(gx-3,gy-74,6,30);
  c.fillStyle="rgb(118,124,80)";c.beginPath();c.ellipse(gx+28,gy-62,30,14,-0.4,0,TAU);c.fill();
  for(const [dx,dy] of [[-30,-36],[0,-38],[30,-36],[-44,-6],[-14,-8],[16,-8],[44,-6],[-30,22],[0,22],[30,22],[-14,50],[16,50],[0,76]]){
    const cg=c.createRadialGradient(gx+dx+6,gy+dy-6,2,gx+dx,gy+dy,17);cg.addColorStop(0,rgba(ag_lt(LW_K.grape,0.4),1));cg.addColorStop(1,rgba(LW_K.grape,1));c.fillStyle=cg;c.beginPath();c.arc(gx+dx,gy+dy,16,0,TAU);c.fill();}
  // the right page: its one line
  lp_T(c,"Eva viu a uva.",x+w*0.75,y+h*0.5,{w:800,size:44,align:"center",col:[60,48,40]});
  c.restore();}
function lw_book(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*1.5,sp=w*0.12;c.save();c.globalAlpha*=a;
  if(o.k!=null)ag_about(c,x+w/2,y+h,lerp(0.8,1,ag_spr(o.k,0,0.5)));
  c.save();c.shadowColor="rgba(30,22,24,0.4)";c.shadowBlur=26;c.shadowOffsetX=-12;c.shadowOffsetY=14;c.fillStyle=rgba(LW_K.cover,1);c.fillRect(x,y,w,h);c.restore();
  // the spine's edge on the left, the cover lit from the right
  let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(0,0,0,0.3)");g.addColorStop(sp/w,"rgba(0,0,0,0.05)");g.addColorStop(1,"rgba(255,240,220,0.12)");c.fillStyle=g;c.fillRect(x,y,w,h);
  c.fillStyle="rgba(0,0,0,0.25)";c.fillRect(x+sp,y,3,h);
  // the cover: a pale band, the title, a thin rule, the author
  c.fillStyle="rgba(244,232,210,0.92)";c.fillRect(x+sp+30,y+h*0.16,w-sp-60,6);
  const tl=lp_wrap(c,"Pedagogy of the Oppressed",w-sp-70,{w:800,size:44});tl.forEach((l,i)=>lp_T(c,l,x+sp+30,y+h*0.16+64+i*54,{w:800,size:44,color:"rgb(246,236,216)"}));
  lp_T(c,"Paulo Freire",x+sp+30,y+h*0.82,{w:600,size:32,color:"rgb(236,220,196)"});c.restore();}
function lw_hours(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const n=40,cols=10,sz=34,gap=10,done=o.done||0;c.save();c.globalAlpha*=a;
  for(let i=0;i<n;i++){const cx=x+(i%cols)*(sz+gap),cy=y+Math.floor(i/cols)*(sz+gap),u=clamp(done-i,0,1);
    c.fillStyle="rgba(250,247,240,0.9)";rr(c,cx,cy,sz,sz,6);c.fill();c.strokeStyle=rgba(LP.mut,0.45);c.lineWidth=2;rr(c,cx,cy,sz,sz,6);c.stroke();
    if(u>0){c.fillStyle=rgba(LP.green,u);rr(c,cx+3,cy+3,sz-6,sz-6,4);c.fill();}}
  c.restore();}
// a sheet of paper held up in the near hand, typed lines on it and, where a name should be signed, a thumbprint
function lw_heldPaper(c,h){const [x,y]=h.near;c.save();c.translate(x+22,y-40);c.rotate(-0.08);
  c.save();c.shadowColor="rgba(40,30,20,0.3)";c.shadowBlur=14;c.shadowOffsetX=-5;c.shadowOffsetY=8;c.fillStyle="rgb(242,236,222)";c.fillRect(-20,-170,170,214);c.restore();
  c.fillStyle="rgba(80,72,66,0.55)";for(let k=0;k<7;k++)c.fillRect(-4,-150+k*20,k===6?70:134-(k%3)*18,5);
  c.strokeStyle="rgba(80,72,66,0.5)";c.lineWidth=2;c.beginPath();c.moveTo(40,10);c.lineTo(136,10);c.stroke();
  const tg=c.createRadialGradient(90,-6,2,90,-6,22);tg.addColorStop(0,"rgba(58,48,70,0.75)");tg.addColorStop(1,"rgba(58,48,70,0.15)");c.fillStyle=tg;c.beginPath();c.ellipse(90,-6,16,21,0.2,0,TAU);c.fill();
  c.strokeStyle="rgba(240,234,224,0.45)";c.lineWidth=1.2;for(const r of [5,9,13]){c.beginPath();c.ellipse(90,-6,r*0.75,r,0.2,0.4,TAU-0.6);c.stroke();}c.restore();}
// a letter in its envelope, held in the near hand: an address in someone else's hand, a stamp
function lw_heldLetter(c,h){const [x,y]=h.near;c.save();c.translate(x+18,y-34);c.rotate(-0.12);
  c.save();c.shadowColor="rgba(40,30,20,0.3)";c.shadowBlur=14;c.shadowOffsetX=-5;c.shadowOffsetY=8;c.fillStyle="rgb(236,226,204)";c.fillRect(-20,-110,196,120);c.restore();
  c.fillStyle="rgba(150,84,70,0.75)";c.fillRect(132,-100,30,36);c.strokeStyle="rgba(70,56,50,0.55)";c.lineWidth=2.4;c.lineCap="round";
  for(const [ly,lw] of [[-56,110],[-36,128],[-16,92]]){c.beginPath();c.moveTo(14,ly);for(let k=0;k<=lw;k+=8)c.lineTo(14+k,ly+Math.sin(k*0.5+ly)*3);c.stroke();}c.restore();}
// a small notebook, open, held up to write in
function lw_heldNote(c,h){const [x,y]=h.near;c.save();c.translate(x+24,y-46);c.rotate(-0.1);
  c.save();c.shadowColor="rgba(40,30,20,0.3)";c.shadowBlur=12;c.shadowOffsetX=-5;c.shadowOffsetY=8;c.fillStyle="rgb(90,72,58)";c.fillRect(-16,-140,150,178);c.restore();
  c.fillStyle="rgb(244,238,222)";c.fillRect(-8,-132,134,162);c.strokeStyle="rgba(70,60,54,0.5)";c.lineWidth=2;c.lineCap="round";
  for(let k=0;k<5;k++){const ly=-108+k*26;c.beginPath();c.moveTo(4,ly);for(let s=0;s<=96-(k%2)*30;s+=7)c.lineTo(4+s,ly+Math.sin(s*0.6+k)*3);c.stroke();}c.restore();}

/* ---------------------------------------------------------------- the people of Angicos, 1963, for lp_person
   Learners: a farm worker in a straw hat, a builder in his work shirt, a washerwoman with her hair under a head cloth, an older woman, a
   young man, a cook; coordinators: students from the university in Natal, in the plain shirts and blouses of the early 1960s. Their hands hold
   only what the story is about. Each hat or cloth stays inside the head's picture (figure x 160 to 440, y 250 to 560). */
function lw_straw(c,P){const st=[214,188,134],band=[92,66,48];
  // the brim's shade on the forehead first, then the brim, then the crown over its far side
  c.save();ag_shape(c,AG_F.head);c.clip();const sg=c.createLinearGradient(0,360,0,430);sg.addColorStop(0,"rgba(40,24,16,0.32)");sg.addColorStop(1,"rgba(40,24,16,0)");c.fillStyle=sg;c.fillRect(160,340,280,100);c.restore();
  ag_soft(c,cc=>cc.ellipse(304,350,132,30,-0.07,0,TAU),st,ag_lt(st,0.4),370,336,150,rgba(ag_dk(st,0.6),0.4),10);
  c.strokeStyle=rgba(ag_dk(st,0.3),0.55);c.lineWidth=2;c.beginPath();c.ellipse(304,350,118,25,-0.07,0.15,Math.PI-0.15);c.stroke();
  const crown=cc=>{cc.moveTo(230,352);cc.bezierCurveTo(226,314,236,280,262,268);cc.bezierCurveTo(284,258,328,258,350,268);cc.bezierCurveTo(372,280,382,314,380,346);cc.bezierCurveTo(342,358,270,360,230,352);cc.closePath();};
  ag_soft(c,crown,st,ag_lt(st,0.4),352,286,110,rgba(ag_dk(st,0.6),0.45),10);
  c.save();ag_shape(c,crown);c.clip();c.fillStyle=rgba(band,1);c.beginPath();c.moveTo(220,334);c.quadraticCurveTo(304,322,390,328);c.lineTo(390,350);c.quadraticCurveTo(304,346,220,356);c.closePath();c.fill();
  c.strokeStyle=rgba(ag_dk(st,0.25),0.35);c.lineWidth=1.6;for(let k=0;k<5;k++){c.beginPath();c.moveTo(232,290+k*9);c.quadraticCurveTo(304,280+k*9,378,288+k*9);c.stroke();}
  // the dent along the crown's top
  c.strokeStyle=rgba(ag_dk(st,0.35),0.5);c.lineWidth=2.4;c.beginPath();c.moveTo(270,272);c.quadraticCurveTo(306,284,344,272);c.stroke();c.restore();}
function lw_scarf(col){return(c,P)=>{
  // the cloth over the head from the brow to the nape, tied at the back of the head, its two ends hanging behind
  const cloth=cc=>{cc.moveTo(380,350);cc.bezierCurveTo(382,312,360,280,318,272);cc.bezierCurveTo(272,264,226,282,212,322);cc.bezierCurveTo(202,352,206,392,216,424);cc.bezierCurveTo(230,420,240,410,244,396);
    cc.bezierCurveTo(250,370,262,350,288,342);cc.bezierCurveTo(320,334,356,338,380,350);cc.closePath();};
  ag_soft(c,cloth,col,ag_lt(col,0.32),346,296,130,rgba(ag_dk(col,0.6),0.45),12);
  const ends=cc=>{cc.moveTo(214,420);cc.bezierCurveTo(196,452,190,500,198,540);cc.lineTo(222,536);cc.bezierCurveTo(218,500,222,462,234,432);cc.closePath();};
  ag_soft(c,ends,ag_dk(col,0.12),ag_lt(col,0.2),220,460,60,rgba(ag_dk(col,0.6),0.4),8);
  ag_soft(c,cc=>cc.ellipse(222,420,20,14,0.4,0,TAU),ag_dk(col,0.06),ag_lt(col,0.3),228,414,22,rgba(ag_dk(col,0.6),0.4),6);
  // a faint check woven into the cloth, and the fold over the brow
  c.save();ag_shape(c,cloth);c.clip();c.strokeStyle=rgba(ag_lt(col,0.35),0.28);c.lineWidth=3;for(let k=0;k<8;k++){c.beginPath();c.moveTo(200+k*26,260);c.lineTo(180+k*26,430);c.stroke();}
  c.strokeStyle=rgba(ag_dk(col,0.4),0.55);c.lineWidth=2.4;c.beginPath();c.moveTo(250,374);c.bezierCurveTo(280,352,330,342,378,350);c.stroke();c.restore();};}
const LW_PEOPLE={
  farmer:{name:"A farm worker",key:"lw-farmer",skin:[170,120,88],hair:{style:"cropped",c:[34,30,28]},top:{kind:"shirt",c:[206,196,174]},hat:{paint:lw_straw},breath:0.27},
  builder:{name:"A builder",key:"lw-builder",skin:[128,88,62],hair:{style:"coily",c:[26,22,20]},top:{kind:"shirt",c:[150,138,112]},breath:0.3},
  washer:{name:"A washerwoman",key:"lw-washer",skin:[150,104,76],hair:{style:"cropped",c:[24,20,20]},earrings:[220,196,140],top:{kind:"apron",c:[176,124,118],apron:[222,214,196]},hat:{paint:lw_scarf([150,80,66])},breath:0.31},
  elder:{name:"An older learner",key:"lw-elder",skin:[206,160,124],hair:{style:"bun",c:[180,174,168]},top:{kind:"tunic",c:[146,126,112]},breath:0.25},
  youth:{name:"A young learner",key:"lw-youth",skin:[112,76,54],hair:{style:"cropped",c:[22,18,16]},top:{kind:"shirt",c:[222,212,190]},breath:0.33},
  cook:{name:"A cook",key:"lw-cook",skin:[196,150,116],hair:{style:"bun",c:[30,24,22]},earrings:[214,190,140],top:{kind:"tunic",c:[170,146,108]},breath:0.3},
  coord:{name:"A coordinator",key:"lw-coord",skin:[226,188,156],hair:{style:"bob",c:[58,40,30]},earrings:[220,200,150],top:{kind:"shirt",c:[232,220,178]},breath:0.32},
  student:{name:"A student from Natal",key:"lw-student",skin:[206,164,128],hair:{style:"side",c:[34,28,26]},glasses:[44,38,34],top:{kind:"shirt",c:[236,234,226]},breath:0.29}
};
