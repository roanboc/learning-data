/* ===== What they tell us about ourselves: the film's own places, people and pictures =====
   Everything here is this film's (prefix tt_, for "They tell us"); the module's look, people, agent and cards come from
   films/what-an-agent-is/shared/src/. The places of its stories, each painted once (AG_PLACES): Rod and Margaret's living room in
   Melbourne in 1978, the laboratory where the implant was made, the corridor to the theatre, an office in Buffalo in 1958, a writing
   room in England in 1843 and a study in the Dutch Republic in 1637, by candlelight; and the module's room, with quieter marble where the
   five question cards hang. The people of other times are specs for ag_person, dressed for their time and never likenesses.
   The pictures that carry the film's ideas are drawn live: the inner ear's spiral and the implant's wire, a neuron and its copy, the
   worm, the fly and its map, the brain and its rhythm, and the cards. Living things are drawn with tapering curves, weight and light.
   Sizes are in the 1920 x 1080 frame: every word at least 28 px as seen, and nothing but the captions below y 890. */

/* ---------------------------------------------------------------- words in the corners, tags, and quotations */
// the place and the year, top right, as the series' films have it
function tt_corner(ctx,text,a,o){o=o||{};if(a<=0)return;ag_T(ctx,String(text).toUpperCase(),o.x||1824,o.y||100,{w:700,size:28,ls:3.5,align:"right",col:o.col||AG.violet,a});}
// a small tag on a card: words in a pill, springing in (o.k), o.col its edge and words, o.icon, o.size
function tt_tag(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();if(o.k!=null){ag_about(ctx,x,y,lerp(0.6,1,clamp(o.k,0,1.2)));}
  const b=ag_pill(ctx,x,y,text,{a,col:o.col||null,icon:o.icon,size:o.size||30});ctx.restore();return b;}
// a quotation card: the words in quotation marks (wrapped), then who said it; o.k springs it, o.w its width
function tt_quote(ctx,x,y,words,who,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||900;if(a<=0)return;
  return ag_textCard(ctx,x,y,w,{kick:o.kick,title:words,sub:who},{a,k:o.k,kickCol:o.kickCol||AG.mut});}
// a soft wash of the room's light over a frame: lifts a busy place behind words (o.c the colour)
function tt_wash(ctx,a,o){o=o||{};if(a<=0)return;ctx.save();ctx.fillStyle=rgba(o.c||[244,242,238],clamp(a,0,1));ctx.fillRect(0,0,W,H);ctx.restore();}
// a seeded jitter for hand-drawn things
const tt_rn=(i,k)=>hash(i*13.1+(k||0)*7.7,3.3+(k||0));

/* ---------------------------------------------------------------- people of other times
   Specs for ag_person (see people.js): skin, hair, the top they wear, and anything of their time painted over it. None is a likeness:
   these are the people of the stories, dressed for their time. */
// a moustache and a small beard on the chin, for 1637
function tt_moustache(c,P){c.save();ag_shape(c,AG_F.head);c.clip();const col=P.stache||[60,46,40];
  ag_soft(c,cc=>{cc.moveTo(346,470);cc.bezierCurveTo(356,462,372,462,386,468);cc.bezierCurveTo(390,472,388,476,382,476);cc.bezierCurveTo(372,472,358,474,348,478);cc.closePath();},col,mix(col,[160,150,150],0.4),370,466,30,null);
  ag_soft(c,cc=>{cc.moveTo(352,504);cc.bezierCurveTo(358,498,372,498,378,504);cc.bezierCurveTo(378,520,368,530,362,532);cc.bezierCurveTo(356,524,352,514,352,504);cc.closePath();},col,mix(col,[160,150,150],0.4),366,506,30,null);c.restore();}
// a wide white collar falling over the shoulders, for 1637, and a lace one, for 1843
function tt_band(c,P){ag_soft(c,cc=>{cc.moveTo(222,566);cc.bezierCurveTo(250,610,320,622,366,602);cc.bezierCurveTo(396,640,410,690,400,712);cc.bezierCurveTo(330,730,240,720,180,690);cc.bezierCurveTo(170,650,190,600,222,566);cc.closePath();},
  [238,236,230],[255,255,255],330,640,140,"rgba(60,50,40,0.28)",10);
  c.strokeStyle="rgba(120,110,100,0.35)";c.lineWidth=2;c.beginPath();c.moveTo(292,620);c.quadraticCurveTo(300,670,296,718);c.stroke();}
function tt_lace(c,P){ag_soft(c,cc=>{cc.moveTo(236,568);cc.bezierCurveTo(262,606,322,618,362,602);cc.lineTo(372,622);cc.bezierCurveTo(320,648,250,640,222,592);cc.closePath();},[240,236,228],[255,255,255],320,610,80,"rgba(60,50,40,0.25)",6);
  c.fillStyle="rgba(150,140,130,0.35)";for(let i=0;i<9;i++){const u=i/8,x=lerp(228,368,u),y=lerp(596,622,u)+Math.sin(u*Math.PI)*22;c.beginPath();c.arc(x,y,3,0,TAU);c.fill();}}
// headphones over the head, for 2022: a band over the crown and a cup over the ear
function tt_phones(c,P){const E=AG_FACE.ear;c.save();c.lineCap="round";c.strokeStyle="#3B3C42";c.lineWidth=14;c.beginPath();c.moveTo(E[0]-6,E[1]);c.bezierCurveTo(E[0]-26,330,300,262,372,300);c.stroke();
  ag_soft(c,cc=>ag_rect(cc,E[0]-29,E[1]-36,58,86,24),[70,72,80],[150,152,164],E[0]+5,E[1]-26,50,"rgba(0,0,0,0.4)",8);c.restore();}
const TT_ROD={key:"tt_rod",name:"Rod",skin:[226,184,152],hair:{style:"cropped",c:[118,102,90]},top:{kind:"cardigan",c:[128,108,86],inner:[226,220,204]},breath:0.26};
const TT_MARGARET={key:"tt_margaret",name:"Margaret",skin:[236,198,174],hair:{style:"bob",c:[128,96,72]},earrings:[222,204,170],top:{kind:"sweater",c:[166,130,118]},breath:0.3};
const TT_CLARK={key:"tt_clark",name:"Graeme Clark",skin:[230,190,160],hair:{style:"side",c:[96,76,58]},top:{kind:"blazer",c:[236,234,228],inner:[206,212,220],tie:[104,84,70]},breath:0.27};
const TT_ENG1={key:"tt_eng1",name:"Engineer",skin:[214,170,136],hair:{style:"side",c:[72,56,42]},beard:[76,60,46],top:{kind:"shirt",c:[176,160,130]},breath:0.28};
const TT_ENG2={key:"tt_eng2",name:"Engineer two",skin:[232,196,168],hair:{style:"cropped",c:[60,52,46]},glasses:[60,56,52],top:{kind:"shirt",c:[150,158,150]},breath:0.25};
const TT_AUD={key:"tt_aud",name:"Audiologist",skin:[238,206,180],hair:{style:"bob",c:[92,70,52]},top:{kind:"cardigan",c:[150,148,132],inner:[232,228,216]},breath:0.31};
const TT_PHARM={key:"tt_pharm",name:"Pharmacist",skin:[226,186,156],hair:{style:"side",c:[150,142,134]},glasses:[70,64,58],top:{kind:"blazer",c:[236,234,228],inner:[222,222,216],tie:[90,72,62]},breath:0.24};
// a brimmed hat of the 1950s, over short grey hair
function tt_hat(c,P){const col=P.hatC||[84,78,70];ag_soft(c,cc=>{cc.moveTo(196,352);cc.bezierCurveTo(230,330,330,322,412,340);cc.bezierCurveTo(420,348,410,356,396,354);cc.bezierCurveTo(320,346,250,352,206,366);cc.bezierCurveTo(192,368,188,358,196,352);cc.closePath();},
    ag_dk(col,0.1),ag_lt(col,0.3),340,336,120,"rgba(20,16,12,0.4)",6);
  ag_soft(c,cc=>{cc.moveTo(228,346);cc.bezierCurveTo(226,300,250,270,300,266);cc.bezierCurveTo(350,262,382,290,384,338);cc.bezierCurveTo(330,330,270,334,228,346);cc.closePath();},col,ag_lt(col,0.32),340,280,90,"rgba(20,16,12,0.4)",8);
  c.fillStyle=rgba(ag_dk(col,0.4),1);c.beginPath();c.moveTo(229,338);c.bezierCurveTo(270,326,330,322,383,330);c.lineTo(384,340);c.bezierCurveTo(330,332,270,336,229,348);c.closePath();c.fill();}
const TT_CUST={key:"tt_cust",name:"Customer",skin:[218,176,146],hair:{style:"cropped",c:[170,164,156]},hatC:[96,86,74],hat:{paint:tt_hat},top:{kind:"suit",c:[110,104,96],inner:[220,218,210],tie:[120,90,70]},breath:0.3};
const TT_BOY={key:"tt_boy",name:"Boy",skin:[234,196,168],hair:{style:"side",c:[110,84,60]},top:{kind:"shirt",c:[196,190,174]},breath:0.33};
const TT_ROSEN={key:"tt_rosen",name:"Psychologist",skin:[230,192,162],hair:{style:"side",c:[40,34,30]},top:{kind:"suit",c:[98,96,92],inner:[236,236,232],tie:[78,70,84]},breath:0.27};
const TT_LISTEN={key:"tt_listen",name:"Listener",skin:[176,128,98],hair:{style:"cropped",c:[36,30,28]},top:{kind:"sweater",c:[150,140,124]},hat:{paint:tt_phones},breath:0.29};
// hair of the 1840s: parted in the middle, smoothed down over the ears, gathered in a low bun at the back
function tt_victorian(c,P){const hc=P.hair.c;ag_soft(c,cc=>cc.ellipse(206,468,36,31,0.35,0,TAU),hc,ag_lt(hc,0.3),196,452,40,"rgba(0,0,0,0.45)",8);
  c.strokeStyle=rgba(ag_lt(hc,0.4),0.25);c.lineWidth=2;c.beginPath();c.arc(206,468,20,0.6,2.6);c.stroke();
  c.strokeStyle=rgba(mix(P.skin,[210,170,150],0.5),0.5);c.lineWidth=2.4;c.lineCap="round";c.beginPath();c.moveTo(334,300);c.quadraticCurveTo(300,292,262,302);c.stroke();}
const TT_ADA={key:"tt_ada",name:"Writer",skin:[238,212,194],hair:{style:"bob",c:[52,40,34]},hat:{paint:tt_victorian},top:{kind:"tunic",c:[72,66,76],paint:tt_lace},breath:0.3};
const TT_DESC={key:"tt_desc",name:"Philosopher",skin:[226,190,162],hair:{style:"long",c:[52,42,36]},stache:[58,46,40],hat:{paint:tt_moustache},top:{kind:"tunic",c:[48,46,50],paint:tt_band},breath:0.26};
const TT_SEARLE={key:"tt_searle",name:"Philosopher of 1980",skin:[230,194,166],hair:{style:"cropped",c:[150,140,132]},top:{kind:"blazer",c:[112,98,82],inner:[230,228,220]},breath:0.27};

/* ---------------------------------------------------------------- places of the stories, painted once
   Each paints the whole frame: a wall, a window on the right (the light comes from there, as in the module's room), a floor, and what
   stays put. People and what moves are drawn live over it. */
// a window on the right: the frame, the glass with what's outside (sky), net curtains or blinds; o.night for a dark one
function tt_window(c,x,y,w,h,o){o=o||{};const fr=o.frame||[226,220,206];
  let g=c.createLinearGradient(0,y,0,y+h);if(o.night){g.addColorStop(0,"#1E2534");g.addColorStop(1,"#2B3344");}else{g.addColorStop(0,"#DCE6EE");g.addColorStop(0.7,"#EEF1EE");g.addColorStop(1,"#E8E2D4");}
  c.fillStyle=g;c.fillRect(x,y,w,h);if(o.outside)o.outside(c,x,y,w,h);
  if(o.panes){c.strokeStyle=rgba(fr,1);c.lineWidth=o.night?5:8;for(let i=1;i<o.panes[0];i++){const xx=x+w*i/o.panes[0];c.beginPath();c.moveTo(xx,y);c.lineTo(xx,y+h);c.stroke();}
    for(let j=1;j<o.panes[1];j++){const yy=y+h*j/o.panes[1];c.beginPath();c.moveTo(x,yy);c.lineTo(x+w,yy);c.stroke();}}
  if(o.blinds){c.fillStyle="rgba(236,232,222,0.78)";for(let yy=y+8;yy<y+h*o.blinds;yy+=22)c.fillRect(x,yy,w,13);c.fillStyle="rgba(120,110,96,0.3)";for(let yy=y+8;yy<y+h*o.blinds;yy+=22)c.fillRect(x,yy+12,w,1.5);}
  if(o.net){const ng=c.createLinearGradient(x,0,x+w,0);ng.addColorStop(0,"rgba(250,248,244,0.62)");ng.addColorStop(0.5,"rgba(250,248,244,0.48)");ng.addColorStop(1,"rgba(250,248,244,0.6)");c.fillStyle=ng;c.fillRect(x,y,w,h);
    c.strokeStyle="rgba(200,194,182,0.4)";c.lineWidth=2;for(let xx=x+14;xx<x+w;xx+=26){c.beginPath();c.moveTo(xx,y);c.bezierCurveTo(xx+6,y+h*0.3,xx-6,y+h*0.7,xx+3,y+h);c.stroke();}}
  c.strokeStyle=rgba(fr,1);c.lineWidth=18;c.strokeRect(x-9,y-9,w+18,h+18);c.fillStyle=rgba(mix(fr,[255,255,255],0.3),1);c.fillRect(x-30,y+h+9,w+60,16);c.fillStyle="rgba(60,50,40,0.2)";c.fillRect(x-30,y+h+25,w+60,6);
  if(!o.night){g=c.createRadialGradient(x+w/2,y+h/2,20,x+w/2,y+h/2,Math.max(w,h)*1.3);g.addColorStop(0,"rgba(255,250,236,0.2)");g.addColorStop(1,"rgba(255,250,236,0)");c.fillStyle=g;c.fillRect(x-w,y-h,w*3,h*3);}}
// a wall in a colour, lit from the right, with a soft pattern of the time: o.pattern(c) draws it, o.dado a rail's height
function tt_wall(c,hz,col,o){o=o||{};let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(mix(col,[0,0,0],0.16),1));g.addColorStop(0.7,rgba(col,1));g.addColorStop(1,rgba(mix(col,[255,250,240],0.12),1));
  c.fillStyle=g;c.fillRect(0,0,W,hz);if(o.pattern){c.save();c.beginPath();c.rect(0,0,W,hz);c.clip();o.pattern(c);c.restore();}
  if(o.dado){c.fillStyle=rgba(mix(col,[0,0,0],0.14),1);c.fillRect(0,o.dado,W,hz-o.dado);c.fillStyle=rgba(mix(col,[255,255,255],0.3),1);c.fillRect(0,o.dado-8,W,8);c.fillStyle="rgba(40,30,20,0.18)";c.fillRect(0,o.dado,W,3);}
  g=c.createLinearGradient(0,hz-60,0,hz);g.addColorStop(0,"rgba(40,30,20,0)");g.addColorStop(1,"rgba(40,30,20,0.16)");c.fillStyle=g;c.fillRect(0,hz-60,W,60);}
// a floor from hz down: a flat colour with soft depth, o.lines planks or tiles
function tt_floorFlat(c,hz,col,o){o=o||{};let g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(mix(col,[0,0,0],0.18),1));g.addColorStop(0.3,rgba(col,1));g.addColorStop(1,rgba(mix(col,[0,0,0],0.1),1));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  if(o.tiles){c.strokeStyle="rgba(60,50,40,0.12)";c.lineWidth=1.5;for(let i=-12;i<=12;i++){c.beginPath();c.moveTo(960+i*70,hz);c.lineTo(960+i*260,H);c.stroke();}let d=12;for(let y=hz+d;y<H;y+=d,d*=1.32){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}}
  if(o.weave){const R=ag_rnd(5);c.fillStyle="rgba(255,250,240,0.05)";for(let i=0;i<2400;i++){const x=R()*W,y=hz+R()*(H-hz);c.fillRect(x,y,2+R()*3,1.4);}c.fillStyle="rgba(40,30,20,0.06)";for(let i=0;i<2400;i++){const x=R()*W,y=hz+R()*(H-hz);c.fillRect(x,y,2+R()*3,1.4);}}
  g=c.createLinearGradient(0,hz,0,hz+70);g.addColorStop(0,"rgba(30,22,16,0.22)");g.addColorStop(1,"rgba(30,22,16,0)");c.fillStyle=g;c.fillRect(0,hz,W,70);
  c.fillStyle=rgba(mix(col,[255,255,255],0.25),1);c.fillRect(0,hz-14,W,14);c.fillStyle="rgba(40,30,20,0.28)";c.fillRect(0,hz,W,1.5);}
// the soft shade on the left and the window's warmth on the right, over a whole place
function tt_light(c,warm){let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,24,18,0.2)");g.addColorStop(0.45,"rgba(30,24,18,0.02)");g.addColorStop(1,"rgba(255,246,226,"+(warm||0.08)+")");c.fillStyle=g;c.fillRect(0,0,W,H);}

const TT_HOME={hz:700,table:[500,900,920,110],y:574,s:0.8,rod:1250,mag:670,phone:[1576,646]};   // the living room: the carpet's edge, the table's front edge [x, y, w], where Rod and Margaret sit, the telephone
AG_PLACES.tt_home=c=>{const hz=TT_HOME.hz;
  // a warm cream wallpaper of the seventies, its soft pattern of rounded lozenges barely darker than the paper
  tt_wall(c,hz,[222,206,176],{pattern:cc=>{cc.fillStyle="rgba(150,118,80,0.06)";for(let y=-30;y<hz;y+=96)for(let x=-40+(Math.round(y/96)%2)*60;x<W;x+=120){cc.beginPath();cc.ellipse(x,y,34,44,0,0,TAU);cc.fill();}
    cc.strokeStyle="rgba(150,118,80,0.06)";cc.lineWidth=3;for(let y=-30;y<hz;y+=96)for(let x=-40+(Math.round(y/96)%2)*60;x<W;x+=120){cc.beginPath();cc.ellipse(x,y,48,60,0,0,TAU);cc.stroke();}}});
  // the kitchen through an open doorway on the left: its own wall, tiles, a stove (the kettle on it is drawn live)
  c.fillStyle="#D9D3C2";c.fillRect(70,150,330,hz-150);let g=c.createLinearGradient(70,0,400,0);g.addColorStop(0,"rgba(30,24,18,0.3)");g.addColorStop(1,"rgba(30,24,18,0.08)");c.fillStyle=g;c.fillRect(70,150,330,hz-150);
  c.fillStyle="#E6E1D4";c.fillRect(110,250,250,130);c.fillStyle="rgba(120,110,96,0.25)";for(let i=0;i<5;i++)c.fillRect(118+i*48,258,40,114);
  ag_soft(c,cc=>ag_rect(cc,120,450,230,hz-450,6),[232,228,218],[255,255,255],300,460,200,"rgba(40,30,20,0.25)",12);
  c.fillStyle="#3A3936";c.fillRect(132,436,206,16);c.fillStyle="#2C2B29";for(const x of [170,290]){c.beginPath();c.ellipse(x,438,40,7,0,0,TAU);c.fill();}
  c.fillStyle="rgba(60,56,50,0.5)";for(let i=0;i<4;i++){c.beginPath();c.arc(160+i*50,480,9,0,TAU);c.fill();}c.fillStyle="#BDB6A6";c.fillRect(140,520,190,120);c.strokeStyle="rgba(60,50,40,0.25)";c.lineWidth=2;c.strokeRect(140,520,190,120);
  c.strokeStyle="#C9BFA8";c.lineWidth=22;c.beginPath();c.moveTo(60,hz);c.lineTo(60,140);c.lineTo(410,140);c.lineTo(410,hz);c.stroke();c.strokeStyle="rgba(40,30,20,0.18)";c.lineWidth=3;c.beginPath();c.moveTo(72,hz);c.lineTo(72,152);c.lineTo(398,152);c.lineTo(398,hz);c.stroke();
  // a shelf with the radio on it (the radio's dial is drawn live), above where Margaret sits
  ag_soft(c,cc=>ag_rect(cc,520,246,330,18,4),[150,116,82],[200,170,130],720,250,200,"rgba(40,30,20,0.3)",8);c.fillStyle="rgba(40,30,20,0.18)";c.fillRect(526,264,320,10);
  ag_soft(c,cc=>ag_rect(cc,560,150,180,96,14),[124,92,66],[176,140,104],680,164,120,"rgba(30,20,10,0.4)",10);
  c.fillStyle="#C8BBA2";rr(c,576,166,92,64,8);c.fill();c.strokeStyle="rgba(90,76,60,0.35)";c.lineWidth=2;for(let y=172;y<228;y+=7){c.beginPath();c.moveTo(580,y);c.lineTo(664,y);c.stroke();}
  c.fillStyle="#E8DFC8";c.beginPath();c.arc(704,188,20,0,TAU);c.fill();c.strokeStyle="#5A4A38";c.lineWidth=2.5;c.beginPath();c.moveTo(704,188);c.lineTo(714,176);c.stroke();c.fillStyle="#3E342A";c.beginPath();c.arc(704,226,8,0,TAU);c.fill();
  // the calendar for 1978, between them
  ag_soft(c,cc=>ag_rect(cc,880,130,170,230,6),[244,240,230],[255,255,255],990,150,160,"rgba(40,30,20,0.25)",10);c.fillStyle="#9A8F7E";c.fillRect(962,118,6,18);
  c.fillStyle="#B8A890";c.fillRect(890,140,150,82);c.fillStyle="#E9E1CF";c.beginPath();c.moveTo(890,222);c.lineTo(930,170);c.lineTo(960,198);c.lineTo(994,160);c.lineTo(1040,222);c.closePath();c.fill();
  T(c,"1978",965,262,{w:800,size:34,align:"center",color:"#4A4036"});c.fillStyle="rgba(74,64,54,0.4)";for(let r=0;r<4;r++)for(let k=0;k<7;k++)c.fillRect(898+k*20,278+r*18,12,8);
  // the window on the right with net curtains: the suburb's roofs and a gum tree beyond
  tt_window(c,1390,150,420,470,{panes:[2,1],net:true,frame:[232,226,212],outside:(cc,x,y,w,h)=>{cc.fillStyle="#C9D2C6";cc.beginPath();cc.moveTo(x,y+h*0.74);cc.lineTo(x+w*0.18,y+h*0.62);cc.lineTo(x+w*0.36,y+h*0.74);cc.lineTo(x+w*0.36,y+h*0.66);cc.lineTo(x+w*0.56,y+h*0.6);cc.lineTo(x+w*0.76,y+h*0.68);cc.lineTo(x+w,y+h*0.64);cc.lineTo(x+w,y+h);cc.lineTo(x,y+h);cc.closePath();cc.fill();
    // a gum tree: a pale trunk that forks, and loose clumps of grey-green leaves
    cc.strokeStyle="#B9AE9C";cc.lineCap="round";cc.lineWidth=12;cc.beginPath();cc.moveTo(x+w*0.7,y+h*0.8);cc.bezierCurveTo(x+w*0.7,y+h*0.6,x+w*0.66,y+h*0.5,x+w*0.6,y+h*0.36);cc.stroke();
    cc.lineWidth=7;cc.beginPath();cc.moveTo(x+w*0.69,y+h*0.58);cc.bezierCurveTo(x+w*0.76,y+h*0.48,x+w*0.82,y+h*0.42,x+w*0.86,y+h*0.32);cc.stroke();
    const R=ag_rnd(4);for(let i=0;i<14;i++){const cx=x+w*(0.52+R()*0.4),cy=y+h*(0.18+R()*0.26);cc.fillStyle=rgba(mix([168,182,160],[140,156,134],R()),0.55);cc.beginPath();cc.ellipse(cx,cy,w*(0.05+R()*0.05),h*(0.025+R()*0.03),R()*0.6-0.3,0,TAU);cc.fill();}}});
  // a small side table under the window, for the telephone (drawn live)
  ag_soft(c,cc=>ag_rect(cc,1496,664,160,16,4),[150,116,82],[200,170,130],1600,668,120,"rgba(40,30,20,0.3)",8);c.fillStyle="#8A6A4C";c.fillRect(1508,680,10,hz-680+44);c.fillRect(1634,680,10,hz-680+44);
  tt_floorFlat(c,hz,[146,118,92],{weave:true});
  tt_light(c,0.1);};
// the table, drawn live before the people (they sit behind it, their forearms on it): laminate on a wooden frame
function tt_table(ctx){const T_=TT_HOME.table,x=T_[0],y=T_[1],w=T_[2],d=T_[3];ctx.save();ag_floorShadow(ctx,x+w/2-20,y+150,w*0.56,30,0.3);
  let g=ctx.createLinearGradient(0,y-d,0,y);g.addColorStop(0,"#ECE6D9");g.addColorStop(1,"#DDD4C2");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+50,y-d);ctx.lineTo(x+w-50,y-d);ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();
  g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(40,30,20,0.08)");g.addColorStop(1,"rgba(255,250,236,0.12)");ctx.fillStyle=g;ctx.fill();
  ctx.fillStyle="#B9AE96";ctx.fillRect(x,y,w,18);ctx.fillStyle="rgba(60,50,40,0.2)";ctx.fillRect(x,y+18,w,8);ctx.fillStyle="#9C9078";ctx.fillRect(x+30,y+18,16,170);ctx.fillRect(x+w-46,y+18,16,170);
  ctx.restore();}
// what stands on the table, drawn after the people: a teapot between them and a cup in front of each
function tt_tableThings(ctx,o){o=o||{};const T_=TT_HOME.table,x=T_[0],y=T_[1],w=T_[2];ctx.save();
  const px=x+w/2,py=y-40;ag_floorShadow(ctx,px-6,py+28,62,10,0.25);ag_soft(ctx,cc=>{cc.ellipse(px,py,54,40,0,0,TAU);},[214,206,190],[250,248,242],px+18,py-16,60,"rgba(60,50,40,0.3)",10);
  ctx.strokeStyle="#CFC6B2";ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(px+50,py-6);ctx.quadraticCurveTo(px+86,py-20,px+90,py-40);ctx.stroke();ctx.beginPath();ctx.arc(px-60,py,20,Math.PI*0.6,Math.PI*1.45);ctx.stroke();
  ctx.fillStyle="#E4DCCB";ctx.beginPath();ctx.ellipse(px,py-38,24,8,0,0,TAU);ctx.fill();ctx.fillStyle="#BDB29C";ctx.beginPath();ctx.arc(px,py-46,7,0,TAU);ctx.fill();
  for(const cx of [x+300,x+w-300]){const cy=y-30;ag_floorShadow(ctx,cx,cy+2,30,6,0.25);ag_soft(ctx,cc=>{cc.moveTo(cx-24,cy-30);cc.lineTo(cx+24,cy-30);cc.lineTo(cx+18,cy);cc.lineTo(cx-18,cy);cc.closePath();},[236,232,222],[255,255,255],cx+10,cy-28,30,"rgba(60,50,40,0.25)",6);
    ctx.strokeStyle="#DCD5C6";ctx.lineWidth=5;ctx.beginPath();ctx.arc(cx+(cx<px?-26:26),cy-16,9,cx<px?Math.PI*0.5:-Math.PI*0.5,cx<px?Math.PI*1.5:Math.PI*0.5);ctx.stroke();}
  ctx.restore();}
// Rod and Margaret at their table: Margaret on the left, facing him; Rod on the right, facing her, so his left ear (the implant's) is ours to see.
// o: rod {talk, smile, gaze, nod, flip}, mag {...}, their arms down behind the table; drawn with the table (before) and what's on it (after)
function tt_couple(ctx,t,o){o=o||{};const H_=TT_HOME,cut=H_.table[1]-H_.table[3],r=o.rod||{},m=o.mag||{};tt_table(ctx);
  ag_person(ctx,TT_MARGARET,H_.mag,H_.y,H_.s,Object.assign({t:t+1.3,cut,gaze:[3,0]},m));
  ag_person(ctx,TT_ROD,H_.rod,H_.y,H_.s,Object.assign({t,flip:true,cut,gaze:[3,0]},r));
  tt_tableThings(ctx);}
// where a person's mouth and ear are in the frame: who drawn at (x, y, s), facing right unless flip
function tt_at(x,y,s,flip,fx,fy){return[x+(fx-296)*s*(flip?-1:1),y+(fy-596)*s];}
const tt_mouth=(x,y,s,flip)=>tt_at(x,y,s,flip,AG_FACE.mid[0],AG_FACE.mid[1]),tt_ear=(x,y,s,flip)=>tt_at(x,y,s,flip,AG_FACE.ear[0],AG_FACE.ear[1]);

AG_PLACES.tt_lab78=c=>{const hz=690;
  // an institutional green-grey, a darker dado, a window with blinds on the right
  tt_wall(c,hz,[200,206,194],{dado:470});
  tt_window(c,1430,120,360,300,{blinds:0.62,frame:[214,214,204]});
  // the long bench along the wall, and on it the electronics: grey and beige boxes, dials, an oscilloscope, cables
  c.fillStyle="#6E6152";c.fillRect(0,520,1360,26);c.fillStyle="#5A4E42";c.fillRect(0,546,1360,10);c.fillStyle="#8D8574";c.fillRect(30,556,26,hz-556);c.fillRect(1300,556,26,hz-556);
  const box=(x,y,w,h,col)=>{ag_soft(c,cc=>ag_rect(cc,x,y,w,h,6),col,mix(col,[255,255,255],0.4),x+w*0.7,y+10,w,"rgba(40,30,20,0.32)",10);};
  box(90,360,250,160,[196,188,170]);box(360,300,190,220,[150,152,148]);box(580,390,300,130,[206,198,180]);box(910,330,220,190,[170,172,166]);
  c.fillStyle="#2E3A36";c.beginPath();c.arc(455,380,48,0,TAU);c.fill();c.strokeStyle="#7FA894";c.lineWidth=2.5;c.beginPath();for(let i=0;i<=40;i++){const u=i/40,x=415+u*80,y=380+Math.sin(u*TAU*2)*16;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
  c.fillStyle="#E8E2D2";for(let i=0;i<5;i++){c.beginPath();c.arc(130+i*44,420,13,0,TAU);c.fill();}c.fillStyle="#3A3530";for(let i=0;i<5;i++){c.beginPath();c.arc(130+i*44,420,4,0,TAU);c.fill();}
  c.fillStyle="#3A3530";for(let i=0;i<6;i++)c.fillRect(612+i*42,420,10,40);c.fillStyle="#C2B79F";for(let i=0;i<6;i++)c.fillRect(608+i*42,432,18,8);
  c.fillStyle="#E9E4D6";for(let i=0;i<3;i++){c.beginPath();c.arc(960+i*60,400,18,0,TAU);c.fill();}c.fillStyle="#BCC6C0";c.fillRect(950,450,150,40);
  c.strokeStyle="#2F2C28";c.lineWidth=4;c.beginPath();c.moveTo(340,470);c.bezierCurveTo(360,600,520,560,580,470);c.moveTo(880,470);c.bezierCurveTo(900,580,880,600,910,480);c.stroke();
  // a pinboard with drawings of the ear, and a clock
  ag_soft(c,cc=>ag_rect(cc,1170,120,210,170,4),[188,160,120],[220,200,160],1300,130,150,"rgba(40,30,20,0.3)",8);c.fillStyle="#F2EEE4";c.save();c.translate(1200,140);c.rotate(-0.04);c.fillRect(0,0,90,110);c.restore();c.save();c.translate(1290,150);c.rotate(0.05);c.fillRect(0,0,74,96);c.restore();
  c.strokeStyle="rgba(80,70,60,0.5)";c.lineWidth=2;c.beginPath();for(let i=0;i<=60;i++){const a=i/60*TAU*2.4,r=34-i*0.48;const x=1244+Math.cos(a)*r,y=196+Math.sin(a)*r;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
  c.fillStyle="#F4F1EA";c.beginPath();c.arc(760,150,52,0,TAU);c.fill();c.strokeStyle="#4A4640";c.lineWidth=5;c.stroke();c.lineWidth=4;c.beginPath();c.moveTo(760,150);c.lineTo(760,112);c.moveTo(760,150);c.lineTo(786,164);c.stroke();
  tt_floorFlat(c,hz,[176,170,156],{tiles:true});
  tt_light(c,0.08);};
// a plain wooden chair's back, behind someone seated facing left at (x, y, s): it shows beside their back
function tt_chair(ctx,x,y,s){ctx.save();const cx=x+150*s,top=y-40*s;ag_soft(ctx,cc=>ag_rect(cc,cx-14*s,top,28*s,360*s,8*s),[120,96,72],[176,150,116],cx+8*s,top+20*s,120*s,"rgba(30,20,10,0.35)",8);
  ag_soft(ctx,cc=>ag_rect(cc,cx-110*s,top+6*s,124*s,30*s,10*s),[132,106,80],[186,160,126],cx-20*s,top+10*s,120*s,"rgba(30,20,10,0.35)",6);ctx.restore();}
// the implant's speech processor on its trolley, and the reel-to-reel tape recorder on top (o.reel: the reels' turn in radians)
function tt_trolley(ctx,x,y,o){o=o||{};ctx.save();ag_floorShadow(ctx,x+150,y+300,210,26,0.28);
  ctx.fillStyle="#8B8F94";ctx.fillRect(x+10,y+150,12,150);ctx.fillRect(x+278,y+150,12,150);ctx.fillRect(x,y+250,300,10);
  ctx.fillStyle="#2C2D31";for(const wx of [x+16,x+284]){ctx.beginPath();ctx.arc(wx,y+304,12,0,TAU);ctx.fill();}
  ag_soft(ctx,cc=>ag_rect(cc,x,y+60,300,96,8),[178,176,166],[226,224,214],x+220,y+70,200,"rgba(40,30,20,0.32)",10);   // the processor
  ctx.fillStyle="#3D3B37";for(let i=0;i<10;i++){ctx.beginPath();ctx.arc(x+30+i*26,y+92,7,0,TAU);ctx.fill();}
  const lit=o.lit||0;for(let i=0;i<10;i++){const a=clamp(lit-i,0,1);if(a<=0)continue;ctx.save();ctx.shadowColor=rgba(AG.blue,0.8);ctx.shadowBlur=12;ctx.fillStyle=rgba(mix(AG.blue,[190,230,250],0.5),a);ctx.beginPath();ctx.arc(x+30+i*26,y+92,6,0,TAU);ctx.fill();ctx.restore();}
  ctx.fillStyle="#E8E4D8";ctx.fillRect(x+24,y+120,120,22);ctx.fillStyle="#5A564F";ctx.fillRect(x+160,y+124,120,14);
  // the tape recorder: a case, two reels, a label
  ag_soft(ctx,cc=>ag_rect(cc,x+10,y-110,280,170,10),[118,112,104],[170,164,154],x+220,y-100,200,"rgba(30,20,10,0.35)",10);
  for(const k of [0,1]){const cx=x+80+k*140,cy=y-40;ctx.fillStyle="#2E2D2B";ctx.beginPath();ctx.arc(cx,cy,48,0,TAU);ctx.fill();ctx.fillStyle="#C9C2B2";ctx.beginPath();ctx.arc(cx,cy,40,0,TAU);ctx.fill();
    ctx.save();ctx.translate(cx,cy);ctx.rotate((o.reel||0)*(k?1:1.12));ctx.fillStyle="#7A746A";for(let s=0;s<3;s++){ctx.rotate(TAU/3);ctx.beginPath();ctx.ellipse(0,-22,9,13,0,0,TAU);ctx.fill();}ctx.restore();
    ctx.fillStyle="#2E2D2B";ctx.beginPath();ctx.arc(cx,cy,8,0,TAU);ctx.fill();}
  ctx.strokeStyle="#4A3A2C";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+80,y+8);ctx.lineTo(x+220,y+8);ctx.stroke();
  ctx.restore();}

AG_PLACES.tt_corridor=c=>{const hz=760;tt_wall(c,hz,[214,214,204],{dado:520});
  // double doors with round windows, and the sign above them
  const x=700,y=230,w=520,h=hz-230;ag_soft(c,cc=>ag_rect(cc,x-24,y-24,w+48,h+24,6),[176,172,160],[214,210,200],x+w,y,300,"rgba(40,30,20,0.35)",12);
  for(const k of [0,1]){const dx=x+k*w/2;ag_soft(c,cc=>cc.rect(dx+6,y,w/2-12,h),[196,192,180],[232,228,218],dx+w/2-60,y+60,260,"rgba(40,30,20,0.3)",14);
    c.fillStyle="#C8D3D6";c.beginPath();c.arc(dx+w/4,y+170,52,0,TAU);c.fill();c.strokeStyle="#8E8A80";c.lineWidth=8;c.stroke();c.fillStyle="#9C988C";c.fillRect(dx+(k?20:w/2-50),y+300,30,90);}
  ag_soft(c,cc=>ag_rect(cc,x+w/2-170,110,340,82,8),[242,240,232],[255,255,255],x+w/2+60,120,200,"rgba(40,30,20,0.3)",8);
  tt_floorFlat(c,hz,[180,176,164],{tiles:true});tt_light(c,0.06);};
// the corridor's sign, drawn live so its word is measured: "Theatre"
function tt_theatreSign(ctx,a){ag_T(ctx,"Theatre",960,166,{w:800,size:44,align:"center",col:[60,58,54],a});}

AG_PLACES.tt_office58=c=>{const hz=690;
  // cream walls over dark wood panelling, a window with blinds, a filing cabinet, a blackboard of the time
  tt_wall(c,hz,[222,214,192],{dado:420,pattern:null});
  c.fillStyle="#6B5038";c.fillRect(0,420,W,hz-420);c.strokeStyle="rgba(30,20,10,0.35)";c.lineWidth=3;for(let x=0;x<W;x+=180){c.strokeRect(x+14,440,152,hz-460);}c.fillStyle="#8A6A4A";c.fillRect(0,410,W,14);
  tt_window(c,1420,110,380,320,{blinds:0.7,frame:[206,198,180]});
  ag_soft(c,cc=>ag_rect(cc,120,130,520,300,6),[52,62,58],[90,104,98],520,140,300,"rgba(0,0,0,0.4)",10);c.strokeStyle="rgba(232,232,224,0.55)";c.lineWidth=3;
  c.beginPath();for(let k=0;k<4;k++){c.moveTo(190,200+k*60);c.lineTo(250,230);}c.moveTo(250,230);c.lineTo(330,232);c.stroke();c.beginPath();c.arc(350,232,22,0,TAU);c.stroke();c.beginPath();c.moveTo(372,232);c.lineTo(450,232);c.stroke();   // a sketch of a unit on the board
  ag_soft(c,cc=>ag_rect(cc,1180,300,170,hz-300+40,6),[142,140,132],[190,188,180],1300,320,150,"rgba(30,20,10,0.35)",10);c.fillStyle="#5E5C56";for(let i=0;i<4;i++)c.fillRect(1236,350+i*92,60,10);
  tt_floorFlat(c,hz,[120,96,72],{});tt_light(c,0.08);};
// a desk of the time, its front edge at (x, y), w wide, with papers on it; o.papers draws on the top page (ctx, x, y, w, h)
function tt_oldDesk(ctx,x,y,w,o){o=o||{};const d=70;ctx.save();ag_floorShadow(ctx,x+w/2,y+150,w*0.55,30,0.28);
  let g=ctx.createLinearGradient(0,y-d,0,y);g.addColorStop(0,"#7A5A3E");g.addColorStop(1,"#5E432E");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+28,y-d);ctx.lineTo(x+w-28,y-d);ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();
  ctx.fillStyle="#4E3826";ctx.fillRect(x,y,w,24);ctx.fillStyle="#3E2C1E";ctx.fillRect(x,y+24,w,170);ctx.strokeStyle="rgba(255,230,200,0.12)";ctx.lineWidth=2;ctx.strokeRect(x+20,y+40,w/2-30,120);ctx.strokeRect(x+w/2+10,y+40,w/2-30,120);
  if(o.papers!==false){ctx.save();ctx.translate(x+w*0.42,y-d*0.5);ctx.rotate(-0.06);ctx.fillStyle="#F2EEE2";ctx.fillRect(-110,-28,220,52);ctx.restore();}
  ctx.restore();}

AG_PLACES.tt_room1843=c=>{const hz=700;
  // a sage damask, a tall window with heavy curtains on the right, a dado and a dark floor
  tt_wall(c,hz,[176,182,160],{dado:500,pattern:cc=>{cc.fillStyle="rgba(70,80,60,0.09)";for(let y=-40;y<500;y+=120)for(let x=-40+(Math.round(y/120)%2)*70;x<W;x+=140){cc.beginPath();cc.moveTo(x,y-38);cc.bezierCurveTo(x+30,y-10,x+30,y+10,x,y+38);cc.bezierCurveTo(x-30,y+10,x-30,y-10,x,y-38);cc.fill();}}});
  tt_window(c,1450,150,300,440,{panes:[2,4],frame:[220,214,200]});
  for(const s of [-1,1]){const cx=s<0?1400:1800;ag_soft(c,cc=>{cc.moveTo(cx-60,124);cc.bezierCurveTo(cx-40,330,cx-70,520,cx-50,hz);cc.lineTo(cx+60,hz);cc.bezierCurveTo(cx+70,520,cx+40,330,cx+60,124);cc.closePath();},[108,92,86],[150,132,124],cx+20,240,260,"rgba(30,20,10,0.4)",18);}
  c.fillStyle="#7A6656";c.fillRect(1360,114,480,18);
  // a framed print on the wall, and a small table with books
  ag_soft(c,cc=>ag_rect(cc,180,170,300,230,4),[150,120,80],[200,170,120],420,180,200,"rgba(30,20,10,0.35)",8);c.fillStyle="#EFE8D6";c.fillRect(200,190,260,190);c.strokeStyle="rgba(90,80,60,0.45)";c.lineWidth=2;
  c.beginPath();c.moveTo(220,350);c.bezierCurveTo(280,280,330,330,440,250);c.stroke();
  tt_floorFlat(c,hz,[96,74,56],{});tt_light(c,0.07);};
// a drawing of columns of gears, an engine that was never built, on a sheet (x, y, w, h); o.turn turns the wheels a little
function tt_engine(ctx,x,y,w,h,o){o=o||{};ctx.save();ag_box(ctx,x,y,w,h,8,{});ctx.beginPath();ctx.rect(x+10,y+10,w-20,h-20);ctx.clip();
  const cols=7,rows=6,cw=(w-60)/cols,rh=(h-90)/rows;ctx.strokeStyle="rgba(70,60,50,0.7)";ctx.lineWidth=2;
  for(let i=0;i<cols;i++){const cx=x+30+cw*(i+0.5);ctx.beginPath();ctx.moveTo(cx,y+24);ctx.lineTo(cx,y+h-50);ctx.stroke();
    for(let j=0;j<rows;j++){const cy=y+40+rh*(j+0.5),r=Math.min(cw,rh)*0.36;ctx.beginPath();ctx.ellipse(cx,cy,r,r*0.38,0,0,TAU);ctx.stroke();
      ctx.save();ctx.translate(cx,cy);ctx.scale(1,0.38);ctx.rotate((o.turn||0)*(i%2?1:-1)+j*0.3);for(let k=0;k<10;k++){ctx.rotate(TAU/10);ctx.beginPath();ctx.moveTo(r,0);ctx.lineTo(r+5,0);ctx.stroke();}ctx.restore();}}
  ctx.fillStyle="rgba(70,60,50,0.55)";ctx.fillRect(x+20,y+h-46,w-40,6);ctx.restore();}

AG_PLACES.tt_study1637=c=>{const hz=720;
  // night, by candlelight: a plaster wall warm where the candle reaches and dark beyond, a beam above, a small leaded window, books
  tt_wall(c,hz,[120,100,80],{});
  c.fillStyle="#3E3024";c.fillRect(0,40,W,46);c.fillStyle="rgba(255,220,170,0.08)";c.fillRect(0,40,W,6);
  tt_window(c,1420,170,260,320,{night:true,panes:[3,4],frame:[70,58,46]});
  c.fillStyle="#4A3A2C";c.fillRect(150,250,460,16);c.fillRect(150,380,460,16);   // shelves of books
  const R=ag_rnd(9);for(const sy of [250,380])for(let x=160;x<600;){const bw=14+R()*20,bh=70+R()*40;c.fillStyle=rgba([[96,62,44],[70,58,46],[110,86,58],[60,50,40]][(R()*4)|0],1);c.fillRect(x,sy-bh,bw,bh);x+=bw+2;}
  tt_floorFlat(c,hz,[70,54,40],{});
  // the candle's light, from where it stands on the desk (850, 560), and the dark at the edges
  let g=c.createRadialGradient(860,520,20,860,520,900);g.addColorStop(0,"rgba(255,206,140,0.42)");g.addColorStop(0.35,"rgba(255,190,120,0.16)");g.addColorStop(1,"rgba(255,190,120,0)");c.save();c.globalCompositeOperation="screen";c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();
  g=c.createRadialGradient(860,520,300,860,520,1300);g.addColorStop(0,"rgba(10,8,12,0)");g.addColorStop(1,"rgba(10,8,12,0.6)");c.fillStyle=g;c.fillRect(0,0,W,H);};
// a candle at (x, y), its flame flickering with t
function tt_candle(ctx,x,y,t,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="#E9E0CC";ctx.fillRect(x-12,y-90,24,90);ctx.fillStyle="#7A6248";ctx.beginPath();ctx.ellipse(x,y,34,9,0,0,TAU);ctx.fill();
  const f=1+0.06*Math.sin(t*11)+0.04*Math.sin(t*17.3),sway=Math.sin(t*3.1)*2;ctx.save();ctx.globalCompositeOperation="screen";let g=ctx.createRadialGradient(x,y-120,2,x,y-120,90);g.addColorStop(0,"rgba(255,214,150,0.5)");g.addColorStop(1,"rgba(255,214,150,0)");ctx.fillStyle=g;ctx.fillRect(x-100,y-220,200,200);ctx.restore();
  g=ctx.createLinearGradient(0,y-150,0,y-92);g.addColorStop(0,"#FFF6D8");g.addColorStop(1,"#F6B860");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,y-92);ctx.bezierCurveTo(x-11,y-104,x-8*f+sway,y-128*f,x+sway,y-92-56*f);ctx.bezierCurveTo(x+8*f+sway,y-128*f,x+11,y-104,x,y-92);ctx.fill();ctx.restore();}
// a small clockwork figure on the desk: a figure on a wind-up base, its key turning
function tt_automaton(ctx,x,y,t,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x,y+4,46,8,0.3);
  ag_soft(ctx,cc=>ag_rect(cc,x-40,y-26,80,26,4),[150,120,70],[210,180,120],x+20,y-22,60,"rgba(30,20,10,0.4)",6);
  const sw=Math.sin(t*2.2)*0.12;ctx.save();ctx.translate(x,y-26);ctx.rotate(sw);ag_soft(ctx,cc=>{cc.moveTo(-14,0);cc.lineTo(14,0);cc.lineTo(9,-56);cc.lineTo(-9,-56);cc.closePath();},[176,150,96],[226,200,140],6,-40,40,"rgba(30,20,10,0.35)",5);
  ag_soft(ctx,cc=>cc.arc(0,-68,13,0,TAU),[196,170,116],[236,214,160],4,-72,16,"rgba(30,20,10,0.3)",4);ctx.strokeStyle="#9A7A44";ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-9,-46);ctx.lineTo(-26,-30+Math.sin(t*4)*6);ctx.moveTo(9,-46);ctx.lineTo(26,-30-Math.sin(t*4)*6);ctx.stroke();ctx.restore();
  ctx.save();ctx.translate(x+40,y-13);ctx.rotate(t*1.4);ctx.strokeStyle="#8A6A3A";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(9,0);ctx.stroke();ctx.restore();ctx.restore();}

// an oak table top seen from above, for the three hands drawing
AG_PLACES.tt_tableTop=c=>{const tex=ag_oakTex();c.save();c.translate(W/2,H/2);c.rotate(Math.PI/2);c.drawImage(tex,-H/2-200,-W/2-80,1500,W+160);c.restore();
  const g=c.createRadialGradient(1100,300,100,960,540,1200);g.addColorStop(0,"rgba(255,250,240,0.12)");g.addColorStop(1,"rgba(30,24,18,0.22)");c.fillStyle=g;c.fillRect(0,0,W,H);};
// the module's room with quieter marble where the question cards hang, across the top
AG_PLACES.tt_labCards=c=>ag_paintLab(c,{quiet:[[960,270,900,190,0.7],[480,90,420,46,0.3],[1124,476,250,210,0.4]]});
// the module's room, its marble quietest in the middle: for the pictures of the questions, drawn on the wall
AG_PLACES.tt_labQuiet=c=>ag_paintLab(c,{quiet:[[960,380,1100,420,0.85],[480,90,420,46,0.4]]});
