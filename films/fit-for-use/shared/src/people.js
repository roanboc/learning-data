/* ===== Data quality: the people =====
   The people are the agent films' (films/what-an-agent-is/shared/src/people.js, bundled as it is): an adult's proportions, one
   three-quarter head (AG_FACE), arms down, a hand only on the thing the story is about (pose "hold"), a person who fades drawn whole
   first, then faded as one picture. The quality bench is lit as the agent films' lab is, from a window on the right, so they stand in
   it as they are; behind the bench, a person is cut at its back edge (o.cut = DQ_BENCH.back), and the bench hides the hanging arms.

   dq_person(ctx, who, x, y, s, o) draws a person as ag_person does (the same x, y, s and o: t, flip, pose, hold, front, nod, gaze,
   talk, smile, cut, covered), and returns the hands as it does. who is a name in DQ_CAST (this module's people) or in the agent films'
   cast ("mei", "jun", "sam", "noor", "yusuf" and the others), or a spec of someone else (see people.js there; who.over(c, P) paints
   something worn over the whole person in figure space, as the gown's hood is). o.warm (0 to 1) lays
   the hall's warm light over them, for the Great Hall: the side away from the stage lights a little darker, the face a little warmer.
   dq_nameTag(ctx, x, y, who, o) writes a person's name and the line under it (their role): o.align, o.role, o.name, o.col (a colour
   that means something, for the small bar beside it; none by default), o.dark (on the granite or the hall's oak), o.a. */

/* ---------------------------------------------------------------- the cast this module adds
   As the module's plan sets them: Malia Fonoti, the graduations officer, who runs the ceremonies and sends the list to the printer,
   its main user; Andrés Peñaloza, a graduate, Master of Data Analytics, the person the data is about, and, at the ceremony, Andrés in
   his gown ("andresGown": a plain black academic gown, its hood lined in his award's colour, no cap). Mei Tanaka (the registrar's
   office), Jun Park, Sam Okafor, Noor Rahman and Yusuf Demir are the agent films' (AG_CAST). Their clothes wear none of the module's
   six colours. Each was looked at full size, facing both ways, on 5 November 2026. The voice says them as film.json's say has it:
   ["\\bMalia\\b", "Mah-lee-ah"], ["\\bFonoti\\b", "Fo-no-tee"], ["\\bAndr(é|e)s\\b", "Ahn-dress"], ["\\bPe(ñ|n)aloza\\b",
   "Pen-yah-lo-sah"], with the agent films' ["\\bMei\\b", "May"] and ["\\bJun\\b", "Joon"]. Andrés's student number may appear in
   the data, never next to his face. */
const DQ_HOOD=[112,74,150];   // the hood's lining for the Master of Data Analytics: amethyst, which means nothing else in these films
// the hood, worn over the gown: its neckband turned out to show its lining, lying along the gown's opening on both sides and meeting in a
// point on the chest; drawn over the person in figure space (the body's own neckline would paint over anything painted with it), and
// faded with them as one picture
function dq_hood(c,P){const col=P.top.hood||DQ_HOOD,gown=P.top.c;c.save();ag_shape(c,AG_F.torso);c.clip();
  // the gown's facings: darker bands along both edges of its opening, below the hood
  c.fillStyle=rgba(ag_dk(gown,0.45),0.9);c.beginPath();c.moveTo(286,760);c.bezierCurveTo(296,860,304,980,308,1100);c.lineTo(282,1100);c.bezierCurveTo(278,990,272,880,262,780);c.closePath();c.fill();
  c.beginPath();c.moveTo(336,770);c.bezierCurveTo(330,870,322,990,318,1100);c.lineTo(344,1100);c.bezierCurveTo(350,990,356,880,360,780);c.closePath();c.fill();
  // the hood's lining, turned out over both shoulders, broad, framing the neck and meeting in a point on the chest
  ag_soft(c,cc=>{cc.moveTo(170,604);cc.bezierCurveTo(196,586,214,574,230,566);cc.bezierCurveTo(244,626,270,700,312,792);cc.lineTo(311,812);cc.bezierCurveTo(264,742,214,672,170,604);cc.closePath();},
    col,ag_lt(col,0.36),300,640,150,rgba(ag_dk(col,0.6),0.45),10);
  ag_soft(c,cc=>{cc.moveTo(362,600);cc.bezierCurveTo(384,606,404,616,420,628);cc.bezierCurveTo(380,690,342,756,311,812);cc.lineTo(312,792);cc.bezierCurveTo(334,736,350,670,362,600);cc.closePath();},
    ag_dk(col,0.12),ag_lt(col,0.22),330,640,130,rgba(ag_dk(col,0.65),0.45),10);
  // the hood's black edge along the lining's outer side, where it turns over the shoulders
  c.strokeStyle=rgba(ag_dk(gown,0.3),0.8);c.lineWidth=4.5;c.lineCap="round";c.beginPath();c.moveTo(172,606);c.bezierCurveTo(214,672,264,742,310,810);c.stroke();
  c.beginPath();c.moveTo(418,630);c.bezierCurveTo(380,690,342,756,312,810);c.stroke();
  c.restore();}
const DQ_CAST={
  malia:{name:"Malia Fonoti",role:"Graduations officer",skin:[166,112,80],hair:{style:"long",c:[30,22,20]},glasses:[92,62,52],earrings:[232,224,210],
    top:{kind:"blazer",c:[104,70,92],inner:[240,234,226]},breath:0.28},
  andres:{name:"Andrés Peñaloza",role:"Graduate, Master of Data Analytics",skin:[206,156,118],hair:{style:"side",c:[34,26,22]},top:{kind:"sweater",c:[50,54,70]},breath:0.3},
  andresGown:{key:"andresGown",name:"Andrés Peñaloza",role:"Graduate, Master of Data Analytics",skin:[206,156,118],hair:{style:"side",c:[34,26,22]},
    top:{kind:"suit",c:[30,29,33],inner:[238,238,240],tie:[58,62,80],hood:DQ_HOOD},over:dq_hood,breath:0.3}
};
const dq_who=who=>typeof who==="string"&&DQ_CAST[who]?DQ_CAST[who]:who;

/* ---------------------------------------------------------------- a person in the room */
function dq_person(ctx,who,x,y,s,o){o=o||{};const P=dq_who(who),w=o.warm||0;if(!(w>0)&&!P.over)return ag_person(ctx,P,x,y,s,o);
  const a=ctx.globalAlpha;if(a<0.004)return null;const A=AG_FIG.anchor,m=ctx.getTransform(),M=m.translate(x,y).scale(o.flip?-s:s,s).translate(-A[0],-A[1]),cw=ctx.canvas.width,ch=ctx.canvas.height;
  const pt=(fx,fy)=>[M.a*fx+M.c*fy+M.e,M.b*fx+M.d*fy+M.f];let L=1e9,R=-1e9,T0=1e9,B=-1e9;for(const [fx,fy] of [[-260,120],[820,120],[-260,1160],[820,1160]]){const q=pt(fx,fy);L=Math.min(L,q[0]);R=Math.max(R,q[0]);T0=Math.min(T0,q[1]);B=Math.max(B,q[1]);}
  L=Math.max(0,Math.floor(L));T0=Math.max(0,Math.floor(T0));R=Math.min(cw,Math.ceil(R));B=Math.min(ch,Math.ceil(B));if(R<=L||B<=T0)return null;const ww=R-L,hh=B-T0;
  const [pc,px]=ag_buf("dqPerson",cw,ch);px.setTransform(m);let hands;try{hands=ag_person(px,P,x,y,s,Object.assign({},o,{warm:undefined}));
    // what this module wears over a person (the gown's hood), in figure space, breathing with the body and cut where the body is
    if(P.over){const br=Math.sin((o.t||0)*TAU/(P.breath?1/P.breath:3.6))*2.2;px.save();px.translate(x,y);px.scale(o.flip?-s:s,s);px.translate(-A[0],-A[1]);px.translate(0,br);
      if(o.cut!=null){px.beginPath();px.rect(-4000,-4000,9000,4000+A[1]+(o.cut-y)/s-br);px.clip();}P.over(px,P);px.restore();}}
  finally{px.setTransform(1,0,0,1,0,0);px.globalAlpha=1;}
  // the hall's light: from the stage lights in front, a little above; the far side and the body below the chest a little darker
  const K=pt(520,380),rad=820*Math.hypot(M.a,M.b);px.globalCompositeOperation="source-atop";if(w>0){
  let g=px.createRadialGradient(K[0],K[1],0,K[0],K[1],rad);g.addColorStop(0,"rgba(255,214,168,"+(0.1*w)+")");g.addColorStop(0.5,"rgba(60,30,16,"+(0.16*w)+")");g.addColorStop(1,"rgba(40,20,10,"+(0.34*w)+")");px.fillStyle=g;px.fillRect(L,T0,ww,hh);
  const c0=pt(300,720),c1=pt(300,1100);g=px.createLinearGradient(c0[0],c0[1],c1[0],c1[1]);g.addColorStop(0,"rgba(30,14,6,0)");g.addColorStop(1,"rgba(30,14,6,"+(0.3*w)+")");px.fillStyle=g;px.fillRect(L,T0,ww,hh);}
  px.globalCompositeOperation="source-over";ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(pc,L,T0,ww,hh,L,T0,ww,hh);ctx.restore();return hands;}

// a person's name and the line under it (their role); o.col, a small bar in a colour that means something
function dq_nameTag(ctx,x,y,who,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const P_=typeof who==="string"?(DQ_CAST[who]||AG_CAST[who]):who,
    name=o.name||(P_&&P_.name)||String(who),role=o.role!=null?o.role:(P_&&P_.role)||"",al=o.align||"left",dk=!!o.dark;
  ctx.save();ctx.globalAlpha*=a;const nw=dq_tw(ctx,name,{w:800,size:32}),rw2=role?dq_tw(ctx,role,{w:600,size:28}):0,ww=Math.max(nw,rw2),x0=al==="center"?x-ww/2:al==="right"?x-ww:x;
  if(o.col){ctx.fillStyle=rgba(dq_col(o.col,dk),1);rr(ctx,x0-20,y-28,6,role?70:34,3);ctx.fill();}
  dq_T(ctx,name,x0,y,{w:800,size:32,dark:dk});if(role)dq_T(ctx,role,x0,y+38,{w:600,size:28,col:dk?DQ.chalkSoft:DQ.soft});ctx.restore();}
