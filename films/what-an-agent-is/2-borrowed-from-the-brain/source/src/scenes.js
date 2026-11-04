/* ===== Borrowed from the brain: the nine chapters =====
   Each chapter is cut into shots (ag_shots), each a place under a slow camera; every moment waits for a word of the narration
   (wAt(sc, line, word)), so the pictures stay with the voice if it's recorded again. tools/score.py times its sounds to the same words.
   The opening asks why the perceptron was modelled on a nerve cell (Why look to nature); its story is Cajal's, Barcelona 1888, to the
   title (A thicket). Then inside a nerve cell, nature's trials, the gaps a brain fills, what models borrowed and what they didn't,
   likely words, sure and wrong, and the picture that held. The film's places are in bb_past.js and bb_life.js; what people built on
   the nerve cell in bb_model.js. */

const BB_NUM="1.2",BB_TITLE="Borrowed from the brain";
function bb_kick(ctx,a,o){o=o||{};a=a==null?1:a;if(a<=0)return;
  // the place behind the title is busy or mid-toned in the film's nature scenes: a soft patch of shade (under the light title) or of
  // haze (under the dark one) keeps it readable, about 3:1 or better, like the marble behind the title in the lab
  if(o.scrim){ctx.save();ctx.translate(390,92);ctx.scale(1,0.15);const g=ctx.createRadialGradient(0,0,0,0,0,560),c=o.dark?[14,16,22]:[252,250,246];
    g.addColorStop(0,rgba(c,o.scrim*a));g.addColorStop(0.62,rgba(c,o.scrim*a*0.7));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.fillRect(-560,-560,1120,1120);ctx.restore();}
  ag_kicker(ctx,BB_NUM,BB_TITLE,{a,dark:o.dark,x:o.x,y:o.y});}
// the title through a chapter's shots: look[i] is [dark, scrim] for shot i (or a function of t giving it); at a dissolve the two looks
// cross with the pictures, at a cut they change with them
function bb_kickShots(ctx,t,shots,i,look,a,dis){a=a==null?1:a;if(a<=0)return;const L=k=>{const v=look[Math.min(k,look.length-1)];return typeof v==="function"?v(t):v;};
  const cur=L(i),u=i>0&&!shots[i].cut?ease(clamp((t-shots[i].at)/(dis||0.6),0,1)):1,prev=i>0?L(i-1):cur;
  const d=lerp(prev[0],cur[0],u),sl=lerp(prev[0]?0:prev[1],cur[0]?0:cur[1],u),sd=lerp(prev[0]?prev[1]:0,cur[0]?cur[1]:0,u);
  if(d<1)bb_kick(ctx,a*(1-d),{scrim:sl/(1-d||1)});if(d>0)bb_kick(ctx,a*d,{dark:true,scrim:sd/(d||1)});}
// a place-and-year tag, drawn in screen space from inside a shot (so it stays put while the camera moves, and dissolves with its shot);
// under the kicker (BB_UNDER) in the chapters that have one
function bb_tagS(ctx,S,s,a,o){if(a>0)bb_scr(ctx,S,()=>bb_tag(ctx,s,a,o));}
const BB_UNDER={x:96,y:130};
// a card's kicker in the room's grey, for people and things that aren't the model
const BB_K={kickCol:AG.kick};

/* ---------------------------------------------------------------- pictures kept once, for cards */
// a brain as the anatomy book draws it
function bb_brainPic(){return ag_kept("bb:brainpic",700,520,c=>{bb_brain(c,350,236,0.78);});}
// Cajal's drawing: three cells in ink, separate, their branches reaching close to the next cell, never joined
const BB_DA=bb_cell(5101,{x:560,y:330,r:20,reach:150,dirs:6,depth:3,wig:0.42,spines:true,axon:{ang:0.36,len:330,bend:0.18,ends:3,endLen:44},axW:7});
const BB_DB=bb_cell(5102,{x:990,y:520,r:22,reach:160,dirs:6,depth:3,wig:0.42,spines:true,axon:{ang:0.3,len:330,bend:0.18,ends:3,endLen:44},axW:7});
const BB_DC=bb_cell(5103,{x:1400,y:690,r:20,reach:130,dirs:6,depth:2,wig:0.42,spines:true,axon:{ang:0.45,len:160,bend:0.2,ends:3,endLen:36},axW:7});
const BB_DJ=BB_DA.A[BB_DA.A.length-1];   // where A's long fibre ends, by B's branches: the gap he drew
// the branch of B nearest A's fibre's end: the way a message comes in, from its tip to B's body
const BB_DBIN=(()=>{let best=0,d=1e9;BB_DB.B.forEach((b,i)=>{if(b.kids.length)return;const q=b.P[b.P.length-1],e=Math.hypot(q[0]-BB_DJ[0],q[1]-BB_DJ[1]);if(e<d){d=e;best=i;}});return bb_toBody(BB_DB,best);})();
function bb_drawing(ctx,ua,ub,uc,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;for(const [cl,u] of [[BB_DA,ua],[BB_DB,ub],[BB_DC,uc]])bb_drawCell(ctx,cl,{u,ink:true,knob:5});ctx.restore();}
function bb_drawingPic(){const B=BB_SHEET;return ag_kept("bb:drawing",B.w,B.h,c=>{bb_paper(c,0,0,B.w,B.h);c.translate(-B.x,-B.y);bb_drawing(c,1,1,1,1);});}
// points P moved d to the side (for an arrow drawn alongside a fibre)
function bb_beside(P,d){return P.map((p,i)=>{const a=P[Math.max(0,i-1)],b=P[Math.min(P.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;return[p[0]-dy/l*d,p[1]+dx/l*d];});}
// a thin leader from a label to what it names
function bb_leader(ctx,a,b,al,col){if(al<=0)return;ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=rgba(col||BB.inkSoft,0.7);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.restore();}
// an amber cross: a guess that's wrong
function bb_cross(ctx,x,y,s,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.amber,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-s,y-s);ctx.lineTo(x+s,y+s);ctx.moveTo(x+s,y-s);ctx.lineTo(x-s,y+s);ctx.stroke();ctx.restore();}
// a card with a kicker and one line of words in parts [[text, colour, alpha], ...]; o.w a fixed width; returns its box
function bb_line(ctx,x,y,parts,o){o=o||{};const a=o.a==null?1:o.a,f={w:700,size:36};let w=0;for(const p of parts)w+=ag_tw(ctx,p[0],f);const bw=o.w||w+56,h=o.kick?138:100;
  if(a<=0)return{x,y,w:bw,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+bw/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));ag_box(ctx,x,y,bw,h,22,{edge:o.edge,edgeA:0.75});
  let yy=y+50;if(o.kick){ag_T(ctx,String(o.kick).toUpperCase(),x+28,yy,{w:700,size:28,ls:4,col:o.kickCol||AG.kick});yy+=54;}else yy+=12;
  let xx=x+28;for(const p of parts){const pa=p[2]==null?1:p[2];if(pa>0)ag_T(ctx,p[0],xx,yy,{w:700,size:36,col:p[1]||AG.ink,a:pa});xx+=ag_tw(ctx,p[0],f);}ctx.restore();return{x,y,w:bw,h};}
// a framed picture that springs in: o.draw(c, x, y, w, h) paints inside it, or o.img
function bb_framed(ctx,x,y,w,h,a,k,o){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,clamp(k==null?1:k,0,1.2)));ag_picture(ctx,x,y,w,h,o||{});ctx.restore();}
// the model, as the module draws it: the sphere, its light on the wall and its shadow on the floor
function bb_model(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_modelLight(ctx,x,y,r,1,o.floor||y+r+120);ag_model(ctx,x,y,r,{t,core:o.core==null?0.6:o.core,think:o.think||0});ctx.restore();}

/* ================================================================ 1 · Why look to nature */
// 1958: three trials. Each time the perceptron is shown a card (the spot on the left or the right), guesses, and is told if it was right;
// after the wrong guess, its numbers move
const BB_D0=[0.4,-0.6,0.9,-0.2,0.7,-1.0],BB_DN=[0.25,-0.3,-0.35,0.3,-0.25,0.35];
function bb_trial(t,t0){const D=1.75,T=[[0,0,true],[1,0,false],[1,1,true]],i=Math.floor((t-t0)/D),u=(t-t0)/D-i;
  const nud=ag_sine(clamp((t-(t0+D*1.62))/0.5,0,1)),dial=j=>BB_D0[j]+BB_DN[j]*nud;
  if(t<t0||i>=T.length)return{show:0,card:1,guess:null,right:null,nudge:0,dial};
  const [card,guess,right]=T[i];return{show:ag_in(u,0.02,0.16)*(1-ag_in(u,0.9,0.09)),card,guess:u>0.36&&u<0.93?guess:null,right:u>0.5&&u<0.93?right:null,nudge:i===1?ag_io(u,0.6,0.88,0.06):0,dial};}
// the cell he modelled it on, in ink, and the unit it became, in violet
const BB_C58=bb_cell(1958,{x:560,y:420,r:22,reach:170,dirs:6,depth:3,wig:0.4,spines:true,axon:{ang:Math.PI*0.5,len:280,bend:0.2,ends:3,endLen:40},axW:7});
const BB_ARC58=bb_smooth([[690,306],[860,232],[1060,240],[1170,336]],8);
function bb_sketchUnit(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:o.u;if(a<=0||u<=0)return;ctx.save();ctx.globalAlpha*=a;const wc=mix(BB_VI,[120,116,140],0.3);
  for(let i=0;i<3;i++){const k=ag_in(u,i*0.1,0.35),yy=y+(i-1)*120;if(k<=0)continue;bb_wire(ctx,[x-230,yy],[x-r*0.92,y+(i-1)*r*0.42],{w:5,u:k,col:wc,alpha:0.8});
    ctx.fillStyle=rgba(wc,0.8*k);ctx.beginPath();ctx.arc(x-230,yy,7,0,TAU);ctx.fill();}
  const ku=ag_in(u,0.35,0.35);if(ku>0){ctx.save();ctx.globalAlpha*=ku;bb_wire(ctx,[x+r,y],[x+220,y],{w:6,col:wc,alpha:0.85});ag_arrowHead(ctx,x+226,y,0,16,rgba(wc,0.9));bb_unit(ctx,x,y,r,{on:o.on||0});ctx.restore();}
  ctx.restore();}
// nature's trials: three lines that last, to a bird, a seed and a brain, and many that end early, growing left to right
const BB_TRY=(()=>{const R=ag_rnd(1859);
  const keep=[[[470,520],[650,470],[860,380],[1090,320],[1300,300],[1460,300]],[[470,520],[650,470],[860,540],[1090,515],[1300,530],[1460,520]],[[470,520],[640,580],[860,650],[1090,700],[1300,730],[1460,740]]].map(p=>bb_smooth(p,8));
  const dead=[];for(let i=0;i<16;i++){const L=keep[i%3],u=0.1+R()*0.72,q=bb_along(L,u),s=R()<0.5?-1:1,len=70+R()*110,P=[[q[0],q[1]]];let a=q[2]+s*(0.5+R()*0.5),x=q[0],y=q[1];
    for(let k=1;k<=4;k++){a+=(R()-0.5)*0.4;x+=Math.cos(a)*len/4;y+=Math.sin(a)*len/4;P.push([x,y]);}dead.push({P:bb_smooth(P,4),u});}
  return{keep,dead};})();
function bb_trials(ctx,t,t0,tKeep){const g=ag_in(t,t0,3.6),fade=ag_in(t,tKeep,1.0);
  bb_inkArrow(ctx,[[470,232],[1470,232]],ag_in(t,t0,1.2),4,0.85,BB.inkSoft);
  withA(ctx,ag_in(t,t0+0.4,0.6),()=>ag_T(ctx,"Billions of years",970,206,{w:600,size:32,align:"center",col:BB.inkSoft}));
  BB_TRY.dead.forEach(d=>{const k=clamp((g-d.u)/0.14,0,1);if(k<=0)return;bb_ink(ctx,d.P,k,3.2,lerp(1,0.26,fade));
    if(k>=1){const e=d.P[d.P.length-1];ctx.save();ctx.globalAlpha*=lerp(0.9,0.26,fade);ctx.strokeStyle=rgba(BB.ink,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(e[0],e[1],6,0,TAU);ctx.stroke();ctx.restore();}});
  BB_TRY.keep.forEach(L=>bb_ink(ctx,L,g,5,1));
  // the designs that work, at the ends of the lines that last
  const ic=i=>ag_in(t,tKeep+0.2+i*0.25,0.4),kk=i=>lerp(0.6,1,clamp(ag_spr(t,tKeep+0.2+i*0.25,0.5),0,1.2));
  if(ic(0)>0){ctx.save();ctx.globalAlpha*=ic(0);ag_about(ctx,1530,300,kk(0));bb_buzzard(ctx,1530,300,0.26,{col:BB.ink});ctx.restore();}
  if(ic(1)>0){ctx.save();ctx.globalAlpha*=ic(1);ag_about(ctx,1530,520,kk(1));ctx.translate(1494,532);bb_seedShape(ctx,0.56,-0.35);ctx.restore();}
  if(ic(2)>0){ctx.save();ctx.globalAlpha*=ic(2);ag_about(ctx,1530,745,kk(2));ctx.strokeStyle=rgba(BB.ink,0.9);ctx.lineWidth=3.2;ctx.lineJoin="round";ctx.beginPath();bb_brainPath(ctx,1530,750,0.16);ctx.stroke();
    ctx.lineWidth=2.2;for(const [p0,p1,p2] of [[[1502,744],[1518,730],[1532,744]],[[1526,756],[1544,742],[1556,754]],[[1508,722],[1526,712],[1546,722]]]){ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.quadraticCurveTo(p1[0],p1[1],p2[0],p2[1]);ctx.stroke();}ctx.restore();}}
// seeds falling from the maple: [x, y, start (s after "seed"), speed down, drift]
const BB_FALL=[[430,170,-0.4,118,24],[1230,-60,0.3,134,18],[830,190,1.4,112,30]];
// a magnifying glass over the brain: the tangle a lens shows, too dense to follow
function bb_magnifier(ctx,x,y,r,a,k){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.7,1,clamp(k,0,1.2)));
  ctx.save();ctx.translate(x,y);ctx.rotate(0.75);ag_soft(ctx,c=>ag_rect(c,r+10,-17,210,34,15),[96,70,50],[176,136,100],r+130,-17,130,"rgba(0,0,0,0.4)",6,0.6);ctx.restore();
  bb_lens(ctx,x,y,r,c=>c.drawImage(bb_thicketTex(),x-r*1.1,y-r*1.1,r*2.2,r*2.2),{rim:12});
  ctx.strokeStyle=rgba(BB.brass,0.95);ctx.lineWidth=7;ctx.beginPath();ctx.arc(x,y,r+15,0,TAU);ctx.stroke();ctx.restore();}

scene("nature",(ctx,S,t,sc)=>{const C=sc.cues;
  const t58=wAt(sc,"start","nineteen fifty-eight"),tShowed=wAt(sc,"start","showed a program"),tPer=wAt(sc,"start","the perceptron");
  const tCell=C.cell,tModel=wAt(sc,"cell","modelled it"),tWhy=C.why,tTry=C.trying,tKeep=wAt(sc,"trying","keeping the ones");
  const tBirds=C.birds,tWright=C.wright,tTw=wAt(sc,"wright","twisting their wingtips"),tTwist=C.twist,tSeed=C.seed,tSpins=wAt(sc,"seed","spins down");
  const tEx=C.example,tBrain=wAt(sc,"example","a brain"),tWired=C.wired,tSee=wAt(sc,"wired","nobody could see");
  const shots=[
    // Washington, 1958: Frank Rosenblatt and the perceptron, as the first film drew it; it learns from three cards
    {at:0,place:"bbNavy",keys:[[0,960,540,1.0],[1.6,900,530,1.07]],d:3.2,push:0.02,draw(ctx,t){const tr=bb_trial(t,tShowed+0.2);
      bb_perceptron(ctx,560,250,{on:1,card:tr.card,show:tr.show,guess:tr.guess,right:tr.right,dial:tr.dial,nudge:tr.nudge});
      ag_person(ctx,BB_CAST.rosenblatt,250,640,0.92,{t,gaze:[3,1],nod:0.04+0.03*ag_io(t,tPer-0.4,tPer+1.0,0.4)});
      bb_tagS(ctx,S,"Washington, D.C. · 1958",ag_in(t,t58,0.6));}},
    // on paper: the nerve cell he modelled it on, and the unit it became; why look to nature? The page turns: nature's trials
    {at:tCell-0.4,place:"bbSheet",keys:[[0,960,500,1.0]],push:0.02,draw(ctx,t){
      // the first page, until the next one has slid over it
      const turn=ag_eo(ag_in(t,tTry-0.5,0.9));if(turn<1){
      bb_drawCell(ctx,BB_C58,{u:ag_in(t,tCell-0.2,1.6),ink:true});
      bb_inkArrow(ctx,BB_ARC58,ag_in(t,tModel-0.1,0.9),4,1);
      withA(ctx,ag_in(t,tModel+0.4,0.5),()=>ag_T(ctx,"modelled on",930,212,{w:600,size:32,align:"center",col:BB.inkSoft}));
      bb_sketchUnit(ctx,1290,450,64,{u:ag_in(t,tModel+0.1,1.0)});
      bb_cardAt(ctx,760,690,400,{title:"Why look to nature?"},t,tWhy-0.1,null);}if(turn>0){const B=BB_SHEET;bb_paper(ctx,B.x+(1-turn)*1520,B.y,B.w,B.h);}
      if(turn>=1)bb_trials(ctx,t,tTry+0.1,tKeep);}},
    // birds: watched for centuries; Wilbur Wright saw buzzards twist their wingtips to keep their balance
    {at:tBirds-0.4,place:"bbSky",keys:[[0,960,520,1.0],[tWright-0.3,1180,430,1.7]],d:2.4,push:0.02,draw(ctx,t){
      const tw=Math.sin((t-tTw)*2.4)*0.9*ag_io(t,tTw-0.2,tTwist-0.3,0.5);
      bb_buzzard(ctx,520+120*Math.cos(t*0.3),300+40*Math.sin(t*0.3),0.42,{roll:-0.2+0.1*Math.sin(t*0.3)});
      bb_buzzard(ctx,1620+80*Math.cos(t*0.35+2),230+30*Math.sin(t*0.35+2),0.34,{roll:0.15});
      const bx=1180+24*Math.sin(t*0.25),by=430+12*Math.sin(t*0.4);bb_buzzard(ctx,bx,by,0.9,{twist:tw,roll:-0.12*tw});
      // which way each wingtip turns: one up, the other down
      const aa=ag_io(t,tTw,tTwist-0.4,0.4);if(aa>0){const up=clamp(tw*3,-1,1),dn=-up;
        for(const [side,v] of [[1,up],[-1,dn]]){const x=bx+side*206,k=Math.abs(v);if(k<0.05)continue;const s=v>0?-1:1,P=bb_smooth([[x,by-8+s*-6],[x+side*10,by-8+s*28],[x+side*4,by-8+s*58]],6);
          ctx.save();ctx.shadowColor="rgba(250,248,240,0.9)";ctx.shadowBlur=10;bb_inkArrow(ctx,P,1,4,aa*k);ctx.restore();}}}},
    // Kitty Hawk, 1902: the brothers' glider, its wings warping
    {at:tTwist-0.4,place:"bbDunes",keys:[[0,960,500,1.0],[tSeed-1.4,1000,480,1.06]],d:2.6,push:0.02,draw(ctx,t){const u=t-tTwist,tw=Math.sin(u*1.7)*0.75,x=880+u*22,y=420+Math.sin(u*0.9)*10;
      ag_floorShadow(ctx,x+40,930,380,26,0.18);bb_glider(ctx,x,y,0.82,{twist:tw,roll:-0.07*tw});
      bb_tagS(ctx,S,"Kitty Hawk, North Carolina · 1902",ag_in(t,tTwist+0.3,0.6));}},
    // the maple's seeds, spinning down like tiny helicopters
    {at:tSeed-0.4,place:"bbMaple",keys:[[0,960,520,1.04],[tSpins,920,580,1.1]],d:2.6,push:0.02,draw(ctx,t){
      for(const [x0,y0,ts,vy,dr] of BB_FALL){const u=t-(tSeed+ts);if(u<0)continue;const y=y0+u*vy,x=x0+u*dr+Math.sin(u*2.2)*26;if(y>1180)continue;bb_seedSpin(ctx,x,y,1.05,t+ts,{rate:7.5});}}},
    // the only working example of a machine that learns: a brain; but in 1888 nobody could see how it was wired
    {at:tEx-0.4,place:"bbBrain",keys:[[0,960,520,1.0],[tWired,1010,470,1.08]],d:2.6,push:0.015,draw(ctx,t){
      bb_brainLights(ctx,t,0.45*ag_in(t,tBrain-0.3,1.2)*(1-ag_in(t,tSee-0.4,0.8)));
      bb_magnifier(ctx,1050,430,170,ag_in(t,tSee-0.5,0.5),ag_spr(t,tSee-0.5,0.6));}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);});

/* ================================================================ 2 · A thicket (the opening story: Barcelona, 1888, to the title) */
// the ward: the brain, and the part the blood no longer reaches
function bb_strokeCard(ctx,x,y,t,t0){const a=ag_in(t,t0-0.3,0.4);if(a<=0)return;const w=380,h=282;bb_framed(ctx,x,y,w,h,a,ag_spr(t,t0-0.3,0.5),{img:bb_brainPic()});
  const k=ag_in(t,t0+0.2,1.2);if(k<=0)return;const px=x+190*w/700,py=y+262*h/520,r=44*ag_sine(k),g=ctx.createRadialGradient(px,py,0,px,py,r+1);
  g.addColorStop(0,"rgba(58,30,38,0.78)");g.addColorStop(0.7,"rgba(70,36,44,0.5)");g.addColorStop(1,"rgba(70,36,44,0)");ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,r+1,0,TAU);ctx.fill();ctx.restore();}
// words that don't come: a speech bubble by the patient, its dots trying, then still
function bb_speech(ctx,t,t0,t1,mx,my){const a=ag_in(t,t0-0.5,0.4)*(1-ag_in(t,t1,0.5));if(a<=0)return;const x=mx+70,y=my-170,w=170,h=96;
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,mx,my,lerp(0.6,1,clamp(ag_spr(t,t0-0.5,0.5),0,1.2)));
  ag_card(ctx,c=>ag_cardPath(c,x,y,w,h,24,{side:"bottom",a:x+26,b:x+66,px:mx+10,py:my-12}),{x,y,w,h},{});
  const still=ag_in(t,t0+0.7,0.8);for(let i=0;i<3;i++){const p=0.5+0.5*Math.sin(t*5-i*0.9),k=lerp(0.35+0.55*p,0.12,still);ctx.fillStyle=rgba(AG.mut,k);ctx.beginPath();ctx.arc(x+52+i*33,y+h/2,8,0,TAU);ctx.fill();}
  ctx.restore();}
// the stain picks a few cells, it seems at random: when each one shows (s after "black")
const BB_PICK=[0.15,0.95,0.4,1.4,0.65,1.15];
// young birds' brains: a thinner thicket
function bb_youngCard(ctx,x,y,t,t0){const a=ag_in(t,t0-0.2,0.4);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+240,y+195,lerp(0.6,1,clamp(ag_spr(t,t0-0.2,0.5),0,1.2)));
  ag_box(ctx,x,y,480,390,22,{});ag_T(ctx,"YOUNG BIRDS",x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});
  bb_finch(ctx,x+250,y+250,0.9,{young:true});ag_T(ctx,"A thinner thicket",x+28,y+356,{w:700,size:34});ctx.restore();}
// a round inset magnifying the gap: A's fibre's end, and B's branch, close but never joined
function bb_gapInset(ctx,cx,cy,r,k,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,cx,cy,lerp(0.6,1,clamp(k,0,1.2)));
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fillStyle=rgba(BB.paper,1);ctx.fill();ctx.clip();
  const ka=[cx-r*0.2,cy-r*0.11],kb=[cx+r*0.2,cy+r*0.13];
  bb_ink(ctx,bb_smooth([[cx-r-20,cy-r*0.62],[cx-r*0.62,cy-r*0.34],[ka[0]-12,ka[1]-6]],6),1,10,1);
  ctx.fillStyle=rgba(BB.ink,0.95);ctx.beginPath();ctx.arc(ka[0],ka[1],16,0,TAU);ctx.fill();
  bb_ink(ctx,bb_smooth([[cx+r+20,cy+r*0.7],[cx+r*0.66,cy+r*0.42],[kb[0]+12,kb[1]+8]],6),1,13,1);
  ctx.beginPath();ctx.ellipse(kb[0],kb[1],17,13,0.6,0,TAU);ctx.fill();
  // a second branch of B's, behind, for the look of the drawing
  bb_ink(ctx,bb_smooth([[cx+r*0.66,cy+r*0.42],[cx+r*0.5,cy+r*0.8],[cx+r*0.36,cy+r*1.1]],5),1,6,0.8);ctx.restore();
  ctx.strokeStyle=rgba(BB.ink,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();ctx.restore();}
// a message, one way: along A's fibre, across, in through B's branch to its body, out along B's fibre (u 0..3)
function bb_message(ctx,u){if(u<=0||u>=3)return;if(u<1)bb_run(ctx,BB_DA.A,u,8,{r:18});else if(u<1.15){const q=BB_DJ;bb_spark(ctx,q[0],q[1],18,1);}
  else if(u<2)bb_run(ctx,BB_DBIN,(u-1.15)/0.85,8,{r:18});else bb_run(ctx,BB_DB.A,u-2,8,{r:18});}
// the messengers at the gap he drew: sparks crossing from A's ends to B
function bb_messengers(ctx,t,a){if(a<=0)return;const J=BB_DJ,R=ag_rnd(11);ctx.save();ctx.globalAlpha*=a;for(let i=0;i<14;i++){const ph=((t*0.55+i/14)%1),dx=(R()-0.5)*18,dy=(R()-0.5)*12;
  bb_spark(ctx,J[0]+4+dx+ph*22,J[1]+dy+ph*10,5,Math.sin(Math.PI*ph));}ctx.restore();}
// the design his picture gave machines: simple units, each listening to many others, passing one message on
const BB_DESIGN=[{x:560,n:3,y:520,dy:190},{x:990,n:3,y:520,dy:190},{x:1400,n:1,y:520,dy:0}];
const BB_NETT=[{x:470,n:4,y:500,dy:120},{x:700,n:5,y:500,dy:110},{x:1220,n:5,y:500,dy:110},{x:1450,n:4,y:500,dy:120}];

scene("cajal",(ctx,S,t,sc)=>{const C=sc.cues,br=C.breath;
  const tSlices=C.slices,tThicket=C.thicket,tGolgi=wAt(sc,"net","Camillo Golgi"),tFused=wAt(sc,"net","fused"),tStarts=wAt(sc,"nobody","where a message starts"),tLearns=wAt(sc,"nobody","how a brain learns");
  const tStroke=C.stroke,tCuts=wAt(sc,"stroke","cuts off the blood"),tSpeech=wAt(sc,"stroke","take away their speech"),tDoctors=C.doctors,tBroken=wAt(sc,"doctors","what it has broken"),tHeal=wAt(sc,"doctors","whether it will heal");
  const tStain=C.stain,tBlack=wAt(sc,"stain","turns a few cells black"),tNobodyK=wAt(sc,"random","Nobody knows why"),tYoung=C.young,tBirds=wAt(sc,"young","young birds"),tWhole=C.whole;
  const tDrew=C.drew,tSep=wAt(sc,"drew","separate cells"),tNever=wAt(sc,"drew","never joined"),tOneway=C.oneway,tIn=wAt(sc,"oneway","in through the branches"),tOut=wAt(sc,"oneway","out along one long fibre");
  const tBerlin=C.berlin,tLook=wAt(sc,"berlin","look down his microscopes"),tAgree=wAt(sc,"berlin","and agree"),tNobel=C.nobel,tShare=wAt(sc,"nobel","share the Nobel Prize"),tDefends=wAt(sc,"nobel","still defends his net");
  const tNeuron=C.neuron,tTheN=wAt(sc,"neuron","the neuron"),tMed=C.medicine,tGaps=wAt(sc,"medicine","at the gaps he drew"),tMach=C.machines,tNothing=wAt(sc,"machines","nothing to copy");
  const tDesign=C.design,tMany=wAt(sc,"design","many simple cells"),tPass=wAt(sc,"design","passing one message on"),tToday=C.today;
  const J=BB_DJ;
  const shots=[
    // Barcelona, 1888: Cajal at his table, a doctor who teaches anatomy; the camera moves in to his microscope
    {at:0,place:"bbRoom",keys:[[0,960,540,1.0],[tSlices-0.3,1000,520,1.14]],d:2.6,push:0.02,draw(ctx,t){bb_room(ctx,t,{nod:0.1+0.06*ag_in(t,tSlices,1.0)});
      bb_tagS(ctx,S,"Barcelona · 1888",ag_in(t,0.9,0.6));}},
    // under the lens: a thicket of fibres; Golgi's idea, one continuous net; the questions it leaves
    {at:tThicket-0.4,place:"bbLens",keys:[[0,960,500,1.0]],push:0.02,draw(ctx,t){bb_thicket(ctx,1);
      bb_golgiNet(ctx,ag_in(t,tFused-0.2,2.2),0.9*ag_in(t,tFused-0.3,0.5),[44,30,22]);
      bb_portrait(ctx,90,230,380,440,BB_CAST.golgi88,"Camillo Golgi",t,{a:ag_in(t,tGolgi-0.3,0.4),k:ag_spr(t,tGolgi-0.3,0.5),gaze:[3,1]});
      bb_cardAt(ctx,1420,300,440,{title:"Where does a message start?"},t,tStarts-0.2,null);
      bb_cardAt(ctx,1420,480,440,{title:"How does a brain learn?"},t,tLearns-0.2,null);}},
    // a ward: a stroke has taken someone's speech; the doctor can't tell what it has broken, or whether it will heal
    {at:tStroke-0.4,place:"bbWard",keys:[[0,960,540,1.0]],push:0.025,draw(ctx,t){
      bb_pillow(ctx);ag_person(ctx,BB_CAST.patient,240,650,0.9,{t,covered:true,gaze:[2,1],nod:0.04});bb_bed(ctx);
      ag_person(ctx,BB_CAST.doctor,1290,640,0.95,{t:t+0.6,flip:true,gaze:[-3,1],nod:0.05+0.04*ag_in(t,tDoctors,1.0)});
      bb_strokeCard(ctx,620,120,t,tCuts);bb_speech(ctx,t,tSpeech,tDoctors+1.2,304,552);
      bb_pillAt(ctx,1250,200,"What has it broken?",t,tBroken-0.15,null);bb_pillAt(ctx,1250,290,"Will it heal?",t,tHeal-0.15,null);}},
    // Golgi's stain: a few cells turn black, the rest clear; which few, nobody knows
    {at:tStain-0.4,place:"bbLens",keys:[[0,960,480,1.0]],push:0.02,draw(ctx,t){bb_thicket(ctx,1-ag_in(t,tBlack-0.2,1.8));
      BB_STAINED.forEach((cl,i)=>bb_drawCell(ctx,cl,{ink:true,u:ag_in(t,tBlack+BB_PICK[i],1.0)}));
      bb_cardAt(ctx,1430,380,420,{title:"Nobody knows why, even today"},t,tNobodyK-0.2,null);}},
    // Cajal makes it work reliably, on young birds' brains, where the thicket is thinner
    {at:tYoung-0.4,place:"bbRoom",keys:[[0,980,520,1.08]],push:0.02,draw(ctx,t){bb_room(ctx,t,{nod:0.14});bb_youngCard(ctx,1360,150,t,tBirds);}},
    // each black cell whole, like a tree in winter (the poster)
    {at:tWhole-0.4,place:"bbLens",keys:[[0,960,480,1.0],[tWhole+0.6,960,500,1.06]],d:2.6,push:0.015,draw(ctx,t){bb_thicket(ctx,0.16);
      bb_drawCell(ctx,BB_TREE,{ink:true,u:ag_in(t,tWhole-0.3,1.5)});}},
    // he draws what he sees: separate cells, never joined; a message goes one way, in through the branches, out along the fibre
    {at:tDrew-0.4,place:"bbSheet",keys:[[0,960,500,1.0]],push:0.02,draw(ctx,t){
      bb_drawing(ctx,ag_in(t,tDrew+0.2,1.6),ag_in(t,tSep,1.6),ag_in(t,tSep+0.8,1.4),1);
      const ga=ag_in(t,tNever-0.3,0.4)*(1-ag_in(t,tOneway+0.4,0.5));if(ga>0){ctx.save();ctx.globalAlpha*=ga;ctx.strokeStyle=rgba(BB.ink,0.7);ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(J[0]+10,J[1]+6,26,0,TAU);ctx.stroke();ctx.restore();
        bb_leader(ctx,[J[0]-6,J[1]+30],[742,548],ga);bb_gapInset(ctx,700,650,110,ag_spr(t,tNever-0.3,0.5),ga);
        bb_word(ctx,"never joined",700,812,{a:ga,w:700,size:32,align:"center",col:BB.ink});}
      const wa=ag_in(t,tIn-0.4,0.5);if(wa>0){bb_inkArrow(ctx,bb_beside(BB_DBIN,-22),ag_in(t,tIn-0.4,0.8),3.5,wa,BB.inkSoft);
        const s=BB_DBIN[0];bb_word(ctx,"in",s[0]-30,s[1]-26,{a:wa,w:700,size:34,align:"center",col:BB.ink});}
      const wb=ag_in(t,tOut-0.3,0.5);if(wb>0){const P=bb_beside(BB_DB.A,-26);bb_inkArrow(ctx,P,ag_in(t,tOut-0.3,1.0),3.5,wb,BB.inkSoft);
        const e=bb_along(P,0.55);bb_word(ctx,"out",e[0]+10,e[1]-30,{a:wb,w:700,size:34,align:"center",col:BB.ink});}
      bb_message(ctx,clamp((t-(tIn-1.2))/1.1,0,3));}},
    // Berlin, 1889: the leading anatomists look down his microscopes, and agree
    {at:tBerlin-0.4,place:"bbBerlin",keys:[[0,960,520,1.0]],push:0.025,draw(ctx,t){const cut=654,look=0.06+0.24*ag_io(t,tLook-0.3,tAgree-0.2,0.6),sm=0.5*ag_in(t,tAgree,0.6);
      ag_person(ctx,BB_CAST.cajal,330,450,0.98,{t,cut,gaze:[3,1],nod:0.06});
      ag_person(ctx,BB_CAST.kolliker,1010,440,1.0,{t:t+0.7,cut,flip:true,gaze:[-2,3],nod:look,smile:sm});
      ag_person(ctx,BB_CAST.anat,1590,450,0.96,{t:t+1.3,cut,flip:true,gaze:[-2,3],nod:look,smile:sm});
      for(const [x,s] of [[560,0.72],[880,0.8],[1460,0.78]])bb_scope(ctx,x,770,s);
      bb_pillAt(ctx,1010,96,"Agrees",t,tAgree-0.1,null,{icon:"tick",col:AG.green});bb_pillAt(ctx,1590,106,"Agrees",t,tAgree+0.2,null,{icon:"tick",col:AG.green});
      bb_tagS(ctx,S,"Berlin · 1889",ag_in(t,tBerlin+0.3,0.6));}},
    // Stockholm, 1906: they share the Nobel Prize; Golgi still defends his net
    {cut:true,at:tNobel-0.4,place:"bbHall",keys:[[0,960,540,1.0]],push:0.025,draw(ctx,t){
      ag_person(ctx,BB_CAST.cajal06,600,610,0.95,{t,gaze:[3,0],smile:0.2});
      ag_person(ctx,BB_CAST.golgi,1320,610,0.95,{t:t+0.9,flip:true,gaze:[-3,0]});
      bb_cardAt(ctx,420,130,360,{kick:"Cajal",title:"Separate cells"},t,tShare+0.3,null,BB_K);
      bb_cardAt(ctx,1140,130,360,{kick:"Golgi",title:"One net"},t,tDefends-0.2,null,BB_K);
      bb_tagS(ctx,S,"Stockholm · 1906",ag_in(t,tNobel+0.3,0.6));}},
    // the neuron; today's medicines work at the gaps he drew; machines had nothing to copy, until his picture gave them a design
    {at:tNeuron-0.4,place:"bbSheet",keys:[[0,960,500,1.0],[tMed-0.3,J[0]+12,J[1]+6,2.3],[tMach+0.2,960,500,1.0]],d:1.8,push:0,draw(ctx,t){
      bb_drawing(ctx,1,1,1,1-0.75*ag_in(t,tMany-0.3,1.2));
      const na=ag_io(t,tTheN-0.2,tMed-0.5,0.5);if(na>0){bb_leader(ctx,[1086,340],[1004,492],na,BB.ink);bb_word(ctx,"The neuron",1080,322,{a:na,w:700,size:34,col:BB.ink});}
      bb_messengers(ctx,t,ag_io(t,tGaps-0.6,tMach+0.4,0.4));
      const ra=ag_io(t,tGaps-0.3,tMach-0.2,0.5);if(ra>0){ctx.save();ctx.globalAlpha*=ra;ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(BB.ink,0.75);ctx.lineWidth=2;ctx.beginPath();ctx.arc(J[0]+12,J[1]+6,26,0,TAU);ctx.stroke();ctx.restore();}
      bb_scr(ctx,S,()=>{bb_pillAt(ctx,960,670,"Many medicines work here",t,tGaps-0.1,tMach-0.2);bb_tag(ctx,"Today",ag_io(t,tMed+0.1,tMach-0.2,0.5));});
      // machines: a unit with nothing to copy
      const qa=ag_in(t,tNothing-0.4,0.5)*(1-ag_in(t,tMany-0.4,0.5));if(qa>0){ctx.save();ctx.globalAlpha*=qa;ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(BB_VI,0.8);ctx.lineWidth=4;ctx.beginPath();ctx.arc(1380,250,62,0,TAU);ctx.stroke();ctx.setLineDash([]);
        ag_T(ctx,"?",1380,276,{w:800,size:72,align:"center",col:BB_VI});ctx.restore();}
      // the design: simple units, each listening to many others, passing one message on
      const da=ag_in(t,tMany-0.3,0.6);if(da>0){const sig=t>tPass-0.3?((t-tPass+0.3)*0.95)%2.6:-1;bb_net(ctx,BB_DESIGN,{r:30,u:ag_in(t,tMany-0.3,1.6),sig,a:da,alpha:0.5,sigma:true});
        const ua=ag_in(t,tMany+1.2,0.5)*da;if(ua>0){ctx.save();ctx.globalAlpha*=ua;bb_wire(ctx,[1432,520],[1540,520],{w:5,col:mix(BB_VI,[120,116,140],0.3),alpha:0.8,sig:sig>2?(sig-2)/0.6:null});ag_arrowHead(ctx,1548,520,0,15,rgba(mix(BB_VI,[120,116,140],0.3),0.9));ctx.restore();}}}},
    // today's models are still built from it
    {at:tToday-0.4,place:"lab",keys:[[0,960,540,1.0]],push:0.02,draw(ctx,t){withA(ctx,0.32,()=>bb_net(ctx,BB_NETT,{r:22,sig:((t-tToday)*0.8)%3.4,alpha:0.4,sigma:false}));
      bb_model(ctx,960,500,120,t,{core:0.7,think:0.3,floor:760});}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  ag_title(ctx,S,t,br,BB_TITLE,"What models took from nerve cells","FILM 2 OF 10 · WHAT AN AGENT IS");});

/* ================================================================ 3 · Inside a nerve cell */
// the cells of Hebb's idea: two that fire together, and the link between them that grows
const BB_HA=bb_cell(1949,{x:430,y:520,r:30,reach:180,dirs:6,depth:3,wig:0.36,spines:true,axon:{ang:0.05,len:440,bend:0.2,ends:3,endLen:50},axW:10});
const BB_HJ=BB_HA.A[BB_HA.A.length-1];
const BB_HB=bb_cell(1950,{x:BB_HJ[0]+180,y:BB_HJ[1]+24,r:28,reach:170,dirs:6,depth:3,wig:0.38,spines:true,axon:{ang:0.25,len:240,bend:0.2,ends:3,endLen:40},axW:9});
// a signal coming in along points P, from t0, taking d seconds
function bb_inAt(ctx,P,t,t0,d){const u=(t-t0)/d;if(u>0&&u<1)bb_run(ctx,P,u,7,{r:15});}
// excite or hold back: two small connections on a card
function bb_exciteCard(ctx,x,y,t,tEx,tHold){const a=ag_in(t,tEx-0.3,0.4);if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+220,y+165,lerp(0.6,1,clamp(ag_spr(t,tEx-0.3,0.5),0,1.2)));
  ag_box(ctx,x,y,440,330,22,{});const ke=ag_in(t,tEx,0.6),kh=ag_in(t,tHold,0.6);
  bb_miniSyn(ctx,x+110,y+150,0.6,"excite",ke,t);bb_miniSyn(ctx,x+330,y+150,0.6,"hold",kh,t);
  ag_T(ctx,"Excite",x+110,y+296,{w:700,size:30,align:"center"});withA(ctx,ag_in(t,tHold-0.2,0.4),()=>ag_T(ctx,"Hold back",x+330,y+296,{w:700,size:30,align:"center"}));ctx.restore();}

scene("cell",(ctx,S,t,sc)=>{const C=sc.cues;
  const tBr=C.branches,tFires=C.fires,tIt=wAt(sc,"fires","it fires"),tSame=C.same,tGap=C.gap,tTouch=wAt(sc,"gap","almost touches"),tChem=wAt(sc,"gap","chemical messengers");
  const tEx=wAt(sc,"some","excite"),tHold=wAt(sc,"some","hold it back"),tChange=C.change,tHebb=C.hebb,tTog=wAt(sc,"hebb","fire together"),tStr=wAt(sc,"hebb","grows stronger");
  const tRab=C.rabbit,tUse=wAt(sc,"rabbit","with use"),tLearn=C.learning;
  // the pulses, and the trace that draws them: small bumps first (too few arrived), then pulses, each the same size
  const P1=tIt-0.15,P2=tSame+0.5,P3=tSame+1.9,tr0=tBr+0.2,tr1=tSame+3.2,fr=x=>(x-tr0)/(tr1-tr0);
  const EV=[[fr(tBr+1.3),0.22],[fr(tBr+2.4),0.3],[fr(P1+0.08),1],[fr(P2+0.08),1],[fr(P3+0.08),1]];
  const TIPS=BB_N1TIPS;
  const shots=[
    // a neuron: its branches take signals in; when enough arrive together, it fires, a pulse down its long fibre, all or nothing
    {at:0,place:"bbTissue",keys:[[0,900,520,1.0],[tSame+2.4,1180,520,1.45]],d:1.8,push:0.015,draw(ctx,t){
      BB_AROUND.forEach(cl=>bb_drawCell(ctx,cl,{col:[150,104,84],a:0.55}));
      bb_drawCell(ctx,BB_N2,{col:BB_LIVE,a:0.92,u:ag_in(t,0.4,2.0)});bb_drawCell(ctx,BB_N1,{col:BB_LIVE,u:ag_in(t,0.2,2.6)});
      // a few signals come in, and nothing happens; then enough, together
      [0,5,9].forEach((i,k)=>bb_inAt(ctx,TIPS[i],t,tBr+0.3+k*0.08,1.0));[2,7].forEach((i,k)=>bb_inAt(ctx,TIPS[i],t,tBr+1.4+k*0.1,1.0));
      for(const p of [P1,P2,P3])TIPS.forEach((P,i)=>{if(p!==P1&&i%5===4)return;bb_inAt(ctx,P,t,p-1.0+(i%3)*0.03,1.0);});
      bb_cellGlow(ctx,BB_N1,0.25*ag_io(t,tBr+1.25,tBr+1.6,0.15)+0.3*ag_io(t,tBr+2.35,tBr+2.7,0.15));
      bb_pulse(ctx,BB_N1,clamp((t-P1)/1.7,0,1));bb_pulse(ctx,BB_N1,clamp((t-P2)/1.4,0,1));bb_pulse(ctx,BB_N1,clamp((t-P3)/1.4,0,1));
      bb_cellGlow(ctx,BB_N2,0.6*(ag_io(t,P1+1.6,P1+2.1,0.2)+ag_io(t,P2+1.3,P2+1.8,0.2)+ag_io(t,P3+1.3,P3+1.8,0.2)));}},
    // close up, at its end: the gap, and the chemical messengers that carry the signal across; some excite, some hold back; connections change
    {cut:true,at:tGap-0.3,place:"bbTissue",keys:[[0,1300,560,1.9]],push:0.02,draw(ctx,t){
      bb_scr(ctx,S,()=>{const t0=tChem-0.7;
        bb_synapse(ctx,t,{t0,glow:0.8*ag_io(t,t0+1.7,tEx-0.2,0.5)+0.6*ag_io(t,tChange+0.3,tHebb,0.5),grow:ag_in(t,tChange+0.1,1.8),bound:ag_io(t,t0+1.5,t0+3.2,0.4)});
        const la=ag_in(t,tTouch+0.2,0.4),G=BB_SYN.gap;bb_leader(ctx,[1150,438],[G[0]+14,G[1]-10],la,[250,240,226]);bb_pillAt(ctx,1250,420,"The gap",t,tTouch+0.2,null);
        bb_leader(ctx,[640,662],[882,576],ag_in(t,tChem+0.1,0.4),[250,240,226]);bb_pillAt(ctx,600,690,"Chemical messengers",t,tChem+0.1,null);
        bb_exciteCard(ctx,1430,92,t,tEx,tHold);});}},
    // Hebb, 1949: when two cells fire together, the link between them grows stronger; rabbits, 1973: links grow stronger with use
    {cut:true,at:tHebb-0.3,place:"bbTissue",keys:[[0,960,540,1.0]],push:0.02,draw(ctx,t){
      const fires=[tTog-0.6,tTog+1.2,tStr+0.1,tUse-0.6,tUse+0.9],link=clamp(fires.reduce((s,p)=>s+0.22*ag_in(t,p+1.0,0.6),0),0,1);
      BB_AROUND.slice(0,3).forEach(cl=>bb_drawCell(ctx,cl,{col:[150,104,84],a:0.45}));
      bb_drawCell(ctx,BB_HB,{col:BB_LIVE});bb_drawCell(ctx,BB_HA,{col:BB_LIVE,knob:lerp(5,10,link)});
      if(link>0){const g=ctx.createRadialGradient(BB_HJ[0]+30,BB_HJ[1],4,BB_HJ[0]+30,BB_HJ[1],90);g.addColorStop(0,rgba(BB.spark,0.5*link));g.addColorStop(1,rgba(BB.spark,0));ctx.fillStyle=g;ctx.fillRect(BB_HJ[0]-60,BB_HJ[1]-90,180,180);}
      for(const p of fires){bb_pulse(ctx,BB_HA,clamp((t-p)/1.2,0,1));bb_cellGlow(ctx,BB_HB,0.7*ag_io(t,p+1.0,p+1.6,0.25));}
      bb_scr(ctx,S,()=>{bb_portrait(ctx,1440,150,360,410,BB_CAST.hebb,"Donald Hebb",t,{a:ag_in(t,tHebb+0.2,0.4)*(1-ag_in(t,tRab-0.6,0.5)),k:ag_spr(t,tHebb+0.2,0.5),gaze:[-2,1],flip:true});
        const ra=ag_in(t,tRab,0.4);if(ra>0){ctx.save();ctx.globalAlpha*=ra;ag_about(ctx,1630,270,lerp(0.6,1,clamp(ag_spr(t,tRab,0.5),0,1.2)));ag_box(ctx,1420,140,420,260,22,{});bb_rabbit(ctx,1640,352,0.74,t);ctx.restore();}
        bb_graph(ctx,1420,420,420,290,ag_in(t,tRab+0.8,2.6),{title:"Link strength",u0:0.36,mark:"use",a:ag_in(t,tRab+0.5,0.4),k:ag_spr(t,tRab+0.5,0.5)});
        bb_pillAt(ctx,760,800,"Learning: connections that change",t,tLearn+0.2,null);});
      bb_tagS(ctx,S,"Montreal · 1949",ag_in(t,tHebb+0.4,0.5)*(1-ag_in(t,tRab-0.5,0.4)),BB_UNDER);
      bb_tagS(ctx,S,"Oslo · 1973",ag_in(t,tRab+0.1,0.5),BB_UNDER);}}];
  const si=ag_shots(ctx,S,t,sc.dur,shots,0.6);
  bb_kickShots(ctx,t,shots,si,[[1,0.35]],ag_in(t,0.2,0.8));
  const ta=ag_in(t,tFires-0.2,0.5)*(1-ag_in(t,tSame+2.6,0.5));if(ta>0)bb_trace(ctx,1320,96,520,250,clamp((t-tr0)/(tr1-tr0),0,1),{title:"All or nothing",ev:EV,k:ag_spr(t,tFires-0.2,0.5),a:ta});});

/* ================================================================ 4 · Nature's trials */
// how many nerve cells each animal has, on a card at the top right, one after another
function bb_counter(ctx,t,list){for(const [a0,a1,title] of list){const a=ag_in(t,a0,0.4)*(1-ag_in(t,a1,0.4));if(a>0)ag_textCard(ctx,1450,60,420,{kick:"Nerve cells",title},{a,kickCol:AG.kick,k:Math.min(1,ag_spr(t,a0,0.5))});}}
// the inset over the sea slug: its big nerve cells; then, as it learns, a connection that grows stronger
function bb_slugInset(ctx,t,tBig,tConn,a){if(a<=0)return;const cx=1580,cy=470,r=180;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,cx,cy,lerp(0.6,1,clamp(ag_spr(t,tBig-0.2,0.5),0,1.2)));
  const sw=ag_in(t,tConn-0.4,0.6);if(sw<1)withA(ctx,1-sw,()=>bb_bigCells(ctx,cx,cy,r,ag_in(t,tBig-0.2,1.6)));
  if(sw>0)withA(ctx,sw,()=>bb_lens(ctx,cx,cy,r,c=>{const g=c.createRadialGradient(cx+r*0.3,cy-r*0.3,10,cx,cy,r);g.addColorStop(0,"rgb(240,230,206)");g.addColorStop(1,"rgb(206,190,160)");c.fillStyle=g;c.fillRect(cx-r,cy-r,r*2,r*2);
    const k=ag_in(t,tConn+0.3,1.4);c.save();ag_about(c,cx,cy+10,lerp(0.95,1.2,k));bb_miniSyn(c,cx,cy+10,0.95,"excite",lerp(0.25,1,k),t);c.restore();},{rim:16}));ctx.restore();}

scene("animals",(ctx,S,t,sc)=>{const C=sc.cues;
  const t600=wAt(sc,"long","six hundred million"),tJelly=C.jelly,tNet=wAt(sc,"jelly","a net of nerve cells"),tFood=wAt(sc,"jelly","catch food");
  const tSlug=C.slug,t20=wAt(sc,"slug","about twenty thousand"),tBig=wAt(sc,"slug","big enough to see"),tKandel=C.kandel,tConn=wAt(sc,"kandel","its connections change");
  const tBee=C.bee,tMil=wAt(sc,"bee","about a million"),tSes=wAt(sc,"bee","smaller than a sesame seed"),tDance=C.dance,tCol=wAt(sc,"dance","colours"),tSc=wAt(sc,"dance","scents"),tHome=wAt(sc,"dance","the way home"),tDn=wAt(sc,"dance","and dance");
  const tOct=C.octopus,tHalf=wAt(sc,"octopus","about half a billion"),tTwo=wAt(sc,"octopus","two thirds"),tArm=wAt(sc,"octopus","each arm"),tTaste=wAt(sc,"octopus","taste on its own");
  const tFinch=C.finch,tFather=wAt(sc,"finch","from its father"),tPract=wAt(sc,"finch","practising"),tHuman=C.human,t86=wAt(sc,"human","eighty-six billion"),tTril=wAt(sc,"human","a hundred trillion"),tWatts=C.watts,t20w=wAt(sc,"watts","twenty watts");
  const shots=[
    // the sea: a jellyfish, no brain, just a net of nerve cells; it swims and catches food. Down to the sea floor: a sea slug
    {at:0,place:"bbSea",keys:[[0,960,470,1.05],[tSlug-0.8,900,780,1.6]],d:1.9,push:0.01,draw(ctx,t){
      bb_jelly(ctx,980-40*Math.sin(t*0.2),400-t*5,0.72,t,{net:ag_in(t,tNet-0.2,1.0),food:clamp((t-tFood+0.3)/2.4,0,1)});
      bb_slug(ctx,860,884,0.62,t);
      bb_scr(ctx,S,()=>{bb_pillAt(ctx,960,190,"More than 600 million years",t,t600-0.2,tJelly+0.4);
        bb_slugInset(ctx,t,tBig,tConn,ag_in(t,tBig-0.2,0.4)*(1-ag_in(t,tBee-0.8,0.4)));});
      bb_tagS(ctx,S,"New York · the 1970s",ag_in(t,tKandel+0.2,0.5)*(1-ag_in(t,tBee-0.8,0.4)),BB_UNDER);}},
    // a meadow: a honeybee, a million nerve cells in a brain smaller than a sesame seed; it learns colours, scents, the way home, and dances
    {at:tBee-0.4,place:"bbMeadow",keys:[[0,960,540,1.0],[tDance,1000,520,1.06]],d:2.4,push:0.02,draw(ctx,t){
      const u=ag_sine(ag_in(t,tBee-0.4,2.4)),bx=lerp(1560,906,u)+Math.sin(t*3)*10*(1-u),by=lerp(260,524,u)+Math.sin(t*4.3)*8*(1-u),fly=1-ag_in(t,tBee+2.0,0.5);
      bb_bee(ctx,bx,by,0.55,t,{fly});
      bb_seedBrain(ctx,110,190,ag_in(t,tSes-0.3,0.4)*(1-ag_in(t,tDance-0.4,0.5)),Math.min(1,ag_spr(t,tSes-0.3,0.5)));
      bb_pillAt(ctx,330,800,"Colours",t,tCol-0.1,tOct-0.9);bb_pillAt(ctx,600,800,"Scents",t,tSc-0.1,tOct-0.9);bb_pillAt(ctx,900,800,"The way home",t,tHome-0.1,tOct-0.9);
      bb_scr(ctx,S,()=>bb_combView(ctx,1440,520,250,(t-tDn)*1.1,t,ag_in(t,tDn-0.3,0.5)*(1-ag_in(t,tOct-0.9,0.4))));}},
    // a reef: an octopus, half a billion, two thirds of them in its arms; each arm tastes on its own
    {at:tOct-0.4,place:"bbReef",keys:[[0,960,560,1.02],[tArm,1060,600,1.12]],d:2.0,push:0.02,draw(ctx,t){bb_shell(ctx,1330,652,0.9);
      bb_octopus(ctx,820,700,0.85,t,{glow:ag_in(t,tTwo-0.2,1.0),reach:ag_sine(ag_in(t,tArm-0.3,1.6)),taste:ag_in(t,tTaste,0.8)});
      bb_scr(ctx,S,()=>bb_pillAt(ctx,900,190,"Two thirds in its arms",t,tTwo,tFinch-0.6));}},
    // a branch: a young zebra finch learns its song from its father, practising for weeks
    {at:tFinch-0.4,place:"bbBranch",keys:[[0,960,520,1.0],[tPract,1000,500,1.06]],d:2.4,push:0.02,draw(ctx,t){
      const fs=ag_io(t,tFather-0.4,tFather+2.2,0.3),ys=ag_io(t,tPract-0.2,tHuman-0.6,0.3),wob=lerp(1,0.25,ag_in(t,tPract+0.4,2.6));
      bb_finch(ctx,700,550,1.1,{open:fs*(0.5+0.5*Math.sin(t*11))});bb_finch(ctx,1300,530,1.0,{young:true,flip:true,open:ys*(0.5+0.5*Math.sin(t*9.3))});
      bb_song(ctx,836,460,t,{dir:1,a:fs});bb_song(ctx,1176,450,t,{dir:-1,wob,a:ys,alpha:0.85});}},
    // and a human brain: about 86 billion, more than a hundred trillion connections, on about 20 watts
    {at:tHuman-0.4,place:"bbBrain",keys:[[0,960,520,1.0],[tWatts,1080,480,1.04]],d:2.4,push:0,draw(ctx,t){bb_brainLights(ctx,t,ag_in(t,tHuman+0.3,1.2));
      bb_pillAt(ctx,700,820,"More than 100 trillion connections",t,tTril-0.2,null);
      const ba=ag_in(t,tWatts-0.3,0.5);bb_bulb(ctx,1600,430,0.9,ag_in(t,t20w,0.8),ba);bb_pillAt(ctx,1600,690,"About 20 watts",t,t20w,null);}}];
  const si=ag_shots(ctx,S,t,sc.dur,shots,0.6);bb_kickShots(ctx,t,shots,si,[[0,0.5],[0,0.45],[0,0.5],[0,0.35],[1,0.45]]);
  bb_counter(ctx,t,[[tJelly+0.4,tSlug-0.5,"A net, no brain"],[t20-0.2,tBee-0.5,"About 20,000"],[tMil-0.2,tOct-0.5,"About 1 million"],[tHalf-0.2,tFinch-0.5,"About half a billion"],[t86-0.2,1e9,"About 86 billion"]]);});

/* ================================================================ 5 · Filling the gaps */
scene("gaps",(ctx,S,t,sc)=>{const C=sc.cues;
  const tGuess=C.guess,tNerve=wAt(sc,"blind","the nerve leaves"),tNo=wAt(sc,"blind","no cells to catch light"),tSpot=wAt(sc,"blind","a blind spot"),tNever=C.never,tHole=wAt(sc,"never","a hole there"),tIn=wAt(sc,"never","fills it in");
  const shots=[
    // an eye cut in half: light from a candle through the lens onto the lining at the back; where the nerve leaves, nothing catches it
    {at:0,place:"bbEye",keys:[[0,960,500,1.0],[tNerve-0.3,1180,520,1.32],[tNever-0.4,1000,500,1.0]],d:1.8,push:0,draw(ctx,t){bb_flame(ctx,200,480,1.2,t);
      bb_eyeLight(ctx,t,{u:ag_in(t,tGuess+0.4,1.6),blind:ag_in(t,tNo-0.2,1.2)});
      bb_pillAt(ctx,1440,440,"The nerve to the brain",t,tNerve,tNever-0.6);bb_pillAt(ctx,1119,640,"Blind spot",t,tSpot-0.1,tNever-0.6);}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);bb_kick(ctx);
  // what you'd see if nothing filled it: a hole in the pattern; and what you see: the pattern, filled in from round it
  const ca=ag_in(t,tHole-0.6,0.5);if(ca>0){ctx.save();ctx.globalAlpha*=ca;ag_about(ctx,1480,370,lerp(0.6,1,clamp(ag_spr(t,tHole-0.6,0.5),0,1.2)));
    ag_box(ctx,1180,170,600,400,22,{});bb_cloth(ctx,1206,196,548,348,{fill:ag_in(t,tIn-0.1,1.4),r:66});ctx.restore();}});

/* ================================================================ 6 · Borrowed, not copied */
const BB_C43=bb_cell(1943,{x:520,y:470,r:22,reach:170,dirs:6,depth:3,wig:0.4,spines:true,axon:{ang:0.05,len:190,bend:0.2,ends:3,endLen:40},axW:7});
const BB_ARC43=bb_smooth([[560,330],[720,240],[930,236],[1110,320]],8);
// a sheet's heading in ink, that changes: the old one fades before the new one comes
function bb_heading(ctx,t,list){for(const [a0,a1,s] of list){const a=ag_in(t,a0,0.5)*(1-ag_in(t,a1,0.4));if(a>0)ag_T(ctx,s,960,206,{w:700,size:34,align:"center",col:BB.inkSoft,a});}}

scene("borrowed",(ctx,S,t,sc)=>{const C=sc.cues;
  const tUnit=wAt(sc,"unit","a simple unit"),tDrew43=wAt(sc,"unit","drew"),tAdds=C.adds,tFire=wAt(sc,"adds","fires if the total"),tW=C.weights,tNud=wAt(sc,"weights","nudged"),tHebbs=wAt(sc,"weights","like Hebb's links");
  const tEdges=C.edges,tAngle=wAt(sc,"edges","fire for edges"),tFeed=C.feed,tLayers=C.layers,tToday=C.today,tBill=wAt(sc,"today","billions of weights"),tCopy=C.copy,tIdea=wAt(sc,"copy","an idea");
  const tComplex=C.complex,t2021=wAt(sc,"complex","twenty twenty-one"),tMimic=wAt(sc,"complex","five to eight layers"),tChild=C.child,tFew=wAt(sc,"child","a few examples"),tMany=wAt(sc,"child","a great many");
  const tWing=C.wing,tBorrW=wAt(sc,"wing","borrowed the wing"),tFlap=wAt(sc,"wing","not the flapping");
  const ang=tt=>0.35+0.95*Math.sin((tt-tEdges)*0.85);
  const shots=[
    // 1943: Cajal's cell, drawn as a unit that adds up its inputs and fires past a set level; 1958: weights, nudged as it learns
    {at:0,place:"bbSheet",keys:[[0,960,500,1.0]],push:0.02,draw(ctx,t){
      bb_heading(ctx,t,[[0.6,tW-0.2,"McCulloch and Pitts · 1943"],[tW+0.3,1e9,"Rosenblatt · 1958"]]);
      bb_drawCell(ctx,BB_C43,{ink:true,u:ag_in(t,0.3,1.4)});bb_inkArrow(ctx,BB_ARC43,ag_in(t,tDrew43-0.1,0.9),4,1);
      const ins=[0,1,2].map(i=>{const v=(t-tAdds-0.1-i*0.22)/0.8;return v>0&&v<1?v:null;}),arrived=[0,1,2].reduce((s,i)=>s+0.3*ag_in(t,tAdds+0.7+i*0.22,0.3),0);
      const fire=clamp((t-tFire-0.2)/0.9,0,1),wa=ag_in(t,tW+0.1,0.6),nud=ag_sine(ag_in(t,tNud,1.2));
      bb_mcp(ctx,1230,470,{r:76,vals:[1,1,1],on:ins,fill:arrived,level:0.62,fire:fire>0&&fire<1?fire:0,gauge:1-ag_in(t,tW-0.4,0.5),
        wts:[lerp(0.8,0.9,nud),lerp(0.3,0.5,nud),lerp(-0.5,-0.3,nud)],wa,u:ag_in(t,tUnit-0.3,1.4),glow:0.3*ag_in(t,tFire+1.0,0.5)*(1-ag_in(t,tW,0.5))});}},
    // Baltimore, 1959: a cell in a cat's brain that fires for an edge at one angle
    {at:tEdges-0.4,keys:[[0,960,540,1.0]],push:0.02,draw(ctx,t){bb_lab1959(ctx,t,{ang:ang(t)});
      bb_spikes(ctx,1080,660,640,200,t,ang,0.35,{title:"One cell",a:ag_in(t,tAngle-0.5,0.5)});
      bb_tagS(ctx,S,"Baltimore · 1959",ag_in(t,tEdges+0.3,0.6),BB_UNDER);}},
    // edges feed shapes; networks that read pictures borrowed the layers; today's models: weighted inputs, billions of weights;
    // an idea, not a brain; one real cell takes a network of five to eight layers; a child, a few examples; a model, a great many
    {at:tFeed-0.4,place:"lab",keys:[[0,960,540,1.0]],push:0,draw(ctx,t){
      const la=1-ag_in(t,tToday-0.5,0.6),sig=t<tLayers?0.9+((t-tFeed)*1.0)%1.8:((t-tLayers)*1.1)%3.6;
      bb_layers(ctx,960,480,{u:ag_in(t,tFeed-0.2,1.2),more:ag_in(t,tLayers-0.2,1.0),sig,a:la});
      const ma=ag_in(t,tToday-0.2,0.6)*(1-ag_in(t,tComplex-0.5,0.6));bb_model(ctx,360,500,110,t,{a:ma,core:0.6,think:0.3,floor:720});
      bb_weights(ctx,680,300,1020,360,t,ag_in(t,tBill-0.6,0.8)*(1-ag_in(t,tCopy-0.4,0.5)));
      bb_pillAt(ctx,1190,740,"Billions of weights, set by training",t,tBill,tCopy-0.4);
      const ca=ag_in(t,tCopy,0.5)*(1-ag_in(t,tComplex-0.5,0.6));bb_framed(ctx,1180,300,440,327,ca,ag_spr(t,tCopy,0.5),{img:bb_brainPic()});
      if(ca>0)ag_T(ctx,"≠",800,540,{w:700,size:96,align:"center",col:AG.mut,a:ag_in(t,tIdea-0.3,0.5)*(1-ag_in(t,tComplex-0.5,0.6))});
      bb_oneCell(ctx,960,470,{t,cell:ag_in(t,tComplex,1.4),eq:ag_in(t,tMimic-0.6,0.5),net:ag_in(t,tMimic-0.4,1.4),sig:t>tMimic+1?((t-tMimic-1)*1.6)%7:null,a:ag_in(t,tComplex-0.2,0.5)*(1-ag_in(t,tChild-0.5,0.5))});
      bb_tagS(ctx,S,"Jerusalem · 2021",ag_in(t,t2021-0.2,0.5)*(1-ag_in(t,tChild-0.5,0.5)),BB_UNDER);
      bb_examples(ctx,960,470,{kA:ag_in(t,tFew-0.6,1.6),kB:ag_in(t,tMany-0.4,1.6),a:ag_in(t,tChild-0.2,0.5),k:Math.min(1,ag_spr(t,tChild-0.2,0.5))});}},
    // like a plane: it borrowed the wing, but not the flapping
    {at:tWing-0.4,place:"bbSky",keys:[[0,960,500,1.0]],push:0.02,draw(ctx,t){
      bb_buzzard(ctx,560,400+10*Math.sin(t*2),1.0,{flap:Math.sin(t*5.5)*(0.6+0.4*ag_in(t,tFlap-0.4,0.6)),roll:-0.04});
      bb_plane(ctx,1360,400,0.95,{wing:ag_in(t,tBorrW-0.2,0.6)});
      bb_pillAt(ctx,560,640,"A bird",t,tWing+0.1,null);bb_pillAt(ctx,1360,680,"A plane",t,tWing+0.4,null);}}];
  const si=ag_shots(ctx,S,t,sc.dur,shots,0.6);bb_kickShots(ctx,t,shots,si,[[1,0.3],[1,0.2],[0,0],[0,0.35]]);});

/* ================================================================ 7 · Likely words */
const BB_PROMPT="A bee tells the hive where food is by".split(" ");
// the sentence the model is writing: its words so far (n of them, the last fading in), and a slot for the next, with a word in it
function bb_prompt(ctx,x,y,n,wd,wa,a){if(a<=0)return;const f={w:700,size:36},sp=ag_tw(ctx," ",f);ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,1040,138,22,{});ag_T(ctx,"THE MODEL WRITES",x+28,y+50,{w:700,size:28,ls:4,col:BB_VI});
  let xx=x+28;const yy=y+104;BB_PROMPT.forEach((s,i)=>{const k=clamp(n-i,0,1);if(k>0)ag_T(ctx,s,xx,yy,{w:700,size:36,a:k});xx+=ag_tw(ctx,s,f)+sp;});
  const sa=clamp(n-BB_PROMPT.length,0,1);if(sa>0){ctx.fillStyle=rgba(BB_VI,0.6*sa);rr(ctx,xx,yy+12,200,5,2.5);ctx.fill();if(wd&&wa>0)ag_T(ctx,wd,xx,yy,{w:700,size:36,col:BB_VI,a:wa*sa});}
  ctx.restore();}
// spins of the wheel, in order: {t0, d, i (the slice it lands on), rows (the chances then)}; returns the wheel's turn and the slice landed on
function bb_spin(t,list){let rot=0,pick=null;for(const s of list){if(t<s.t0)break;const base=bb_wheelTo(s.rows,s.i,0);let to=base;while(to<rot+TAU*2.5)to+=TAU;
  const u=clamp((t-s.t0)/s.d,0,1),from=rot;rot=from+(to-from)*(1-Math.pow(1-u,3));pick=u>=1?s.i:null;if(u<1)break;}return{rot,pick};}
// many people asking at once: small cards with a question mark, coming in to the model from the left
function bb_asks(ctx,t,t0,mx,my,a){if(a<=0)return;for(let i=0;i<9;i++){const u=clamp((t-t0-i*0.32)/1.3,0,1);if(u<=0||u>=1)continue;const e=ag_sine(u),sy=500+((i*137)%5)*70,x=lerp(90,mx-70,e),y=lerp(sy,my,e)-Math.sin(Math.PI*e)*50,k=lerp(1,0.7,e);
  // each comes in from the left edge of the frame, faded in, and goes into the model
  ctx.save();ctx.globalAlpha*=a*ag_in(u,0,0.25)*(1-ag_in(u,0.8,0.2));ag_about(ctx,x,y,k);ag_box(ctx,x-60,y-36,120,72,18,{});ag_T(ctx,"?",x,y+14,{w:800,size:40,align:"center",col:AG.mut});ctx.restore();}}

scene("likely",(ctx,S,t,sc)=>{const C=sc.cues;
  const tOne=C.one,tWords=wAt(sc,"one","one word at a time"),tChance=C.chance,tEvery=wAt(sc,"chance","every word it knows"),tBee=C.bee,tDanc=wAt(sc,"bee","dancing"),tBuzz=wAt(sc,"bee","buzzing");
  const tWheel=C.wheel,tSpin=wAt(sc,"wheel","spinning a wheel"),tNot=wAt(sc,"wheel","but not always"),tAgain=C.again,tDiff=wAt(sc,"again","a different answer"),tEarly=wAt(sc,"again","one word changes");
  const tDial=C.dial,tLow=wAt(sc,"low","Turned down"),tWins=wAt(sc,"low","almost always wins"),tHigh=wAt(sc,"high","Turned up"),tVary=wAt(sc,"high","answers vary more"),tWrong=wAt(sc,"high","more often go wrong");
  const tZero=wAt(sc,"zero","right down"),tStays=wAt(sc,"zero","a little chance stays"),tBusy=C.busy,tSums=wAt(sc,"busy","its sums"),tHair=wAt(sc,"busy","a hair different"),tTip=wAt(sc,"busy","tip a close choice"),br=C.breath;
  // the temperature, and the chances it gives; when many ask at once, a close choice between two words
  const T=ag_keys(t,[[0,1],[tLow-0.2,1],[tLow+1.0,0.35],[tHigh-0.2,0.35],[tHigh+1.2,2.2],[tZero-0.3,2.2],[tZero+0.9,0.08],[tBusy-0.2,0.08],[tBusy+0.8,1]]);
  const hair=ag_in(t,tHair,0.4),tie=ag_in(t,tBusy+0.2,1.0),TIE=[["dancing",46-0.9*hair],["buzzing",5],["waggling",45+0.9*hair],["flying",2],["singing",1]];
  const rowsAt=(TT,tb)=>{const r=bb_temper(BB_NEXT,TT);if(tb>0)r.forEach((q,i)=>{q[1]=lerp(q[1],TIE[i][1],tb);});const s=r.reduce((a,q)=>a+q[1],0);r.extra=Math.max(100-s,0.7);return r;};
  const rows=rowsAt(T,tie),R1=rowsAt(1,0),RL=rowsAt(0.35,0),RH=rowsAt(2.2,0),RT=rowsAt(1,1);
  const sp=bb_spin(t,[{t0:tSpin-0.2,d:2.2,i:0,rows:R1},{t0:tNot-0.3,d:2.0,i:1,rows:R1},{t0:tWins-0.6,d:2.0,i:0,rows:RL},{t0:tVary-0.5,d:1.8,i:2,rows:RH},{t0:tWrong-0.7,d:1.6,i:4,rows:RH},{t0:tTip-1.3,d:1.8,i:2,rows:RT}]);
  const shots=[{at:0,place:"lab",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
    const think=ag_io(t,tOne,tEvery+0.6,0.4)*0.6+0.4*ag_io(t,tSpin-0.4,tAgain,0.5)+0.5*ag_io(t,tBusy,tTip+0.6,0.4);bb_model(ctx,300,640,100,t,{core:0.6+0.3*think,think,floor:770});
    // the dial: temperature
    const da=ag_in(t,tDial-0.2,0.5)*(1-ag_in(t,br-0.9,0.5));if(da>0)bb_dial(ctx,300,330,60,clamp(Math.log(T/0.08)/Math.log(2.2/0.08),0,1),{a:da,k:ag_spr(t,tDial-0.2,0.5)});
    // the sentence, word by word; the word the wheel lands on goes in its slot
    const n=clamp((t-tOne-0.3)/((tWords-tOne+0.6)/BB_PROMPT.length),0,BB_PROMPT.length+1),pa=ag_in(t,tOne+0.1,0.4)*(1-ag_in(t,tDial-0.6,0.5));
    const land=(t>tSpin+2.0&&t<tNot-0.2)?"dancing":(t>tNot+1.7&&t<tAgain-0.2)?"buzzing":null,wa=land==="dancing"?ag_io(t,tSpin+2.0,tNot-0.2,0.25):land==="buzzing"?ag_io(t,tNot+1.7,tAgain-0.2,0.25):0;
    bb_prompt(ctx,480,150,n,land,wa,pa);
    // the chances: as bars (with every other word it knows), and as a wheel
    const ba=ag_in(t,tEvery-0.4,0.6)*(1-ag_in(t,tAgain-0.6,0.5))+ag_in(t,tDial+0.6,0.6)*(1-ag_in(t,br-0.9,0.5));
    const bpick=t>tDanc-0.1&&t<tBuzz-0.1?0:t>tBuzz-0.1&&t<tWheel?1:sp.pick;
    bb_chances(ctx,560,360,rows,{u:ag_in(t,tEvery-0.4,1.0),tail:ag_in(t,tEvery,0.6)*(1-ag_in(t,tDial,0.5)),pick:bpick,wrong:sp.pick===4?4:null,a:ba});
    const wh=ag_in(t,tWheel-0.2,0.5)*(1-ag_in(t,br-0.9,0.5));bb_wheel(ctx,1600,560,210,rows,sp.rot,{pick:sp.pick,wrong:sp.pick===4?4:null,a:wh,k:Math.min(1,ag_spr(t,tWheel-0.2,0.5))});
    // the same question, two answers: one word changes early on, and the rest follows
    const aa=ag_in(t,tDiff-0.4,0.4)*(1-ag_in(t,tDial-0.6,0.5)),ab=ag_in(t,tEarly-0.3,0.4)*(1-ag_in(t,tDial-0.6,0.5));
    bb_line(ctx,480,330,[["…by ",null],["dancing",BB_VI],[": its waggle points the way.",null]],{kick:"Asked once",a:aa,k:Math.min(1,ag_spr(t,tDiff-0.4,0.5))});
    bb_line(ctx,480,500,[["…by ",null],["buzzing",BB_VI],[" near the flowers.",null]],{kick:"Asked again",a:ab,k:Math.min(1,ag_spr(t,tEarly-0.3,0.5))});
    // many people at once
    bb_asks(ctx,t,tBusy-0.1,300,640,1-ag_in(t,br-0.9,0.5));}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);bb_kick(ctx);});

/* ================================================================ 8 · Sure, and wrong */
scene("sure",(ctx,S,t,sc)=>{const C=sc.cues,br=C.breath;
  const tMiss=C.missing,tLikely=wAt(sc,"missing","still writes likely words"),tBirth=C.birthday,tThree=wAt(sc,"birthday","asked three times"),tDates=wAt(sc,"birthday","three different dates"),tWrong=wAt(sc,"birthday","all wrong");
  const tOnce=C.once,tSeen=wAt(sc,"once","seen once"),tNever=wAt(sc,"once","or never"),tNoPat=wAt(sc,"once","no pattern to learn"),tTests=C.tests,tGuess=wAt(sc,"tests","reward a guess"),tIdk=wAt(sc,"tests","I don't know"),tBlank=wAt(sc,"tests","a blank never will");
  const tBrains=C.brains,tFillG=wAt(sc,"brains","fill gaps too"),tFluent=C.fluent,tChecked=wAt(sc,"fluent","a checked one");
  const ANS=[["Asked once","3 July",tLikely-0.2],["Asked again","15 June",tDates-0.5],["A third time","1 January",tDates+0.3]];
  // the camera picks up where "likely" left it (its push ends at 1.015), so the crossfade shows the lab once
  const shots=[{at:0,place:"lab",keys:[[0,960,540,1.015]],push:0.015,draw(ctx,t){
    bb_model(ctx,300,640,100,t,{core:0.6,think:0.5*ag_io(t,tMiss,tWrong,0.5),floor:770});
    // the question, and three different dates, all wrong
    const qa=ag_in(t,tMiss+0.3,0.4)*(1-ag_in(t,tOnce-0.4,0.5));bb_cardAt(ctx,480,150,720,{kick:"A question",title:"The researcher's birthday?"},t,tMiss+0.3,tOnce-0.4,BB_K);
    const wr=ag_in(t,tWrong-0.1,0.5);ANS.forEach(([kick,date,t0],i)=>{const x=480+i*330,a=ag_in(t,t0,0.4)*(1-ag_in(t,tOnce-0.4,0.5));if(a<=0)return;
      const b=ag_textCard(ctx,x,330,300,{kick,title:date},{a,k:Math.min(1,ag_spr(t,t0,0.5)),kickCol:wr>0.5?AG.amber:BB_VI,edge:wr>0?AG.amber:null,edgeA:0.75*wr});bb_cross(ctx,x+258,372,12,a*wr);});
    // a fact seen once, or never: no pattern to learn
    const pa=ag_in(t,tOnce-0.2,0.5)*(1-ag_in(t,tTests-0.4,0.5));bb_pages(ctx,600,330,{u:ag_in(t,tOnce-0.2,1.0),mark:ag_in(t,tSeen-0.2,0.4)*(1-ag_in(t,tNever,0.6)),a:pa});
    bb_pillAt(ctx,1360,480,"No pattern to learn",t,tNoPat-0.1,tTests-0.4);
    // tests that reward a guess over "I don't know"
    bb_test(ctx,560,240,{g:ag_in(t,tGuess-0.2,0.4),b:ag_in(t,tIdk-0.2,0.4),a:ag_in(t,tTests-0.2,0.4)*(1-ag_in(t,tBrains-0.4,0.5)),k:Math.min(1,ag_spr(t,tTests-0.2,0.5))});
    // brains fill gaps too, as surely
    const fa=ag_in(t,tBrains-0.2,0.5)*(1-ag_in(t,tFluent-0.4,0.5));bb_framed(ctx,660,230,560,340,fa,ag_spr(t,tBrains-0.2,0.5),{draw:(c,x,y,w,h)=>bb_cloth(c,x,y,w,h,{fill:ag_in(t,tFillG-0.2,1.4),r:60})});
    if(fa>0)ag_T(ctx,"Filled in, from round it",940,672,{w:600,size:30,align:"center",col:AG.mut,a:fa});
    // a fluent answer isn't a checked one
    const ea=ag_in(t,tFluent-0.2,0.5)*(1-ag_in(t,br-0.6,0.5));
    bb_answer(ctx,480,260,520,"Born on 15 June.",{kick:"Fluent",wrong:true,a:ea,k:Math.min(1,ag_spr(t,tFluent-0.2,0.5))});
    ag_evidence(ctx,1110,260,600,{kick:"Checked",title:"Looked up, not guessed"},[{kick:"Source",title:"Staff records",col:AG.orange},{kick:"Check",title:"Date matches",col:AG.green}],
      {open:ag_in(t,tChecked-0.4,1.2),a:ag_in(t,tChecked-0.8,0.5)*(1-ag_in(t,br-0.6,0.5)),k:Math.min(1,ag_spr(t,tChecked-0.8,0.5)),kickCol:AG.green,edge:AG.green});
    bb_tagS(ctx,S,"A study · 2025",ag_in(t,tBirth+0.3,0.5)*(1-ag_in(t,tOnce-0.4,0.5)),BB_UNDER);}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);bb_kick(ctx);});

/* ================================================================ 9 · A picture that held */
const BB_HELD=[{x:620,n:3,y:470,dy:140},{x:960,n:4,y:470,dy:115},{x:1300,n:2,y:470,dy:140}];
scene("held",(ctx,S,t,sc)=>{const C=sc.cues,br=C.breath;
  const tCheck=wAt(sc,"held","others could check it"),tGap=C.gap,tEM=wAt(sc,"gap","electron microscopes"),tShowed=wAt(sc,"gap","showed the gap"),tWide=wAt(sc,"gap","twenty millionths");
  const tBuilt=C.built,tUnits=wAt(sc,"built","simple units"),tConn=wAt(sc,"built","connections that change"),tFill=C.fill,tDiff=wAt(sc,"fill","a little differently"),tChk=C.check,tEv=wAt(sc,"check","against the evidence"),tCajal=wAt(sc,"check","as Cajal's drawings"),tNext=C.next,tLoop=wAt(sc,"next","in a loop");
  const R1=bb_temper(BB_NEXT,1);R1.extra=2;
  const sp=bb_spin(t,[{t0:tFill+0.2,d:1.6,i:0,rows:R1},{t0:tDiff-0.6,d:1.5,i:1,rows:R1},{t0:tDiff+1.1,d:1.4,i:2,rows:R1}]);
  const WORDS=["dancing","buzzing","waggling"];
  const shots=[
    // the drawing, checked: in Berlin, 1889, and in the 1950s by electron microscopes, which showed the gap
    {at:0,place:"bbSheet",keys:[[0,960,500,1.0]],push:0.02,draw(ctx,t){bb_drawing(ctx,1,1,1,1);
      bb_pillAt(ctx,640,190,"Berlin · 1889",t,tCheck-0.2,null,{icon:"tick",col:AG.green});
      const em=ag_eo(ag_in(t,tEM-0.3,1.0)),ea=ag_in(t,tEM-0.3,0.3);bb_em(ctx,1060+(1-em)*900,300,500,289,{a:ea,mark:ag_in(t,tWide-0.4,0.6)});
      const la=ag_in(t,tShowed,0.6);if(la>0){ctx.save();ctx.globalAlpha*=la;ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(BB.inkSoft,0.7);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(BB_DJ[0]+18,BB_DJ[1]);ctx.lineTo(1024,440);ctx.stroke();ctx.restore();}
      bb_pillAt(ctx,1130,190,"Electron microscope · 1950s",t,tShowed-0.2,null,{icon:"tick",col:AG.green});
      bb_pillAt(ctx,1310,680,"About 20 millionths of a millimetre",t,tWide-0.1,null);}},
    // models are built on that picture; they fill gaps with what's likely, a little differently each time; check them against the
    // evidence, as his drawings were checked; next: a model that reasons, with hands, in a loop
    {at:tBuilt-0.4,place:"lab",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
      const na=ag_in(t,tBuilt-0.2,0.6)*(1-ag_in(t,tFill-0.4,0.5));
      bb_net(ctx,BB_HELD,{r:30,u:ag_in(t,tBuilt-0.2,1.9),sig:t<tUnits?null:((t-tUnits)*0.9)%2.8,a:na,alpha:0.5,w:(i,j,k)=>1.6+3.4*(0.5+0.5*Math.sin(t*0.9*ag_in(t,tConn-0.3,1)+i*1.7+j*1.3+k*0.7))});
      // the model moves to the middle for its loop
      const mv=ag_sine(ag_in(t,tNext-0.6,1.6)),mx=lerp(300,960,mv),my=lerp(640,470,mv),la=ag_in(t,tNext+0.9,0.2);
      const ma=ag_in(t,tFill-0.4,0.6);if(la<1)bb_model(ctx,mx,my,lerp(100,88,mv),t,{a:ma*(1-la),core:0.6,think:0.4*ag_io(t,tFill,tChk,0.5),floor:lerp(770,700,mv)});
      // the loop goes before the end card comes up over it
      if(la>0)ag_loop(ctx,960,470,{t,R:180,r:88,p:ag_in(t,tNext+0.9,1.8),core:0.7,think:0.3,a:la*(1-ag_in(t,br-0.4,0.9)),label:null});
      // a little differently each time
      const wa=ag_in(t,tFill-0.2,0.5)*(1-ag_in(t,tChk-0.5,0.5));bb_wheel(ctx,1000,500,170,R1,sp.rot,{pick:sp.pick,a:wa,k:Math.min(1,ag_spr(t,tFill-0.2,0.5))});
      const w=sp.pick==null?null:WORDS[sp.pick];bb_line(ctx,1240,440,[["…by ",null],[w||"______",w?BB_VI:AG.mut,w?1:0.7],[".",null]],{kick:"The model",w:420,a:wa});
      // checked against the evidence, as his drawings were
      const ca=ag_in(t,tEv-0.6,0.5)*(1-ag_in(t,tNext-0.6,0.5));
      ag_evidence(ctx,500,220,560,{kick:"The model",title:"A likely answer"},[{kick:"Source",title:"The records",col:AG.orange},{kick:"Check",title:"It matches",col:AG.green}],{open:ag_in(t,tEv-0.2,1.2),a:ca,k:Math.min(1,ag_spr(t,tEv-0.6,0.5))});
      const pa=ag_in(t,tCajal-0.4,0.5)*(1-ag_in(t,tNext-0.6,0.5));bb_framed(ctx,1220,240,500,298,pa,ag_spr(t,tCajal-0.4,0.5),{img:bb_drawingPic()});
      bb_pillAt(ctx,1470,640,"Checked",t,tCajal+0.4,tNext-0.6,{icon:"tick",col:AG.green});}}];
  const si=ag_shots(ctx,S,t,sc.dur,shots,0.6);bb_kickShots(ctx,t,shots,si,[[1,0.3],[0,0]],1-ag_in(t,br-0.4,0.5));
  ag_end(ctx,S,t,br,BB_TITLE,"A likely answer isn't a checked one.","Film 2 of 10");});

// chapters that open on a cut: Borrowed, not copied opens on paper, as Filling the gaps ends on it
ag_cutInto(["borrowed"]);
