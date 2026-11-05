/* ===== Modern data basics: the people, lit for the dark =====
   The people are the agent films' (films/what-an-agent-is/shared/src/people.js, bundled as it is): an adult's proportions, one
   three-quarter head (AG_FACE), arms down, a hand only on the thing the story is about (pose "hold"). Here they stand in the night
   of the map, so each is drawn whole, then lit: the side away from the light sinks into the navy, a warm light falls on the face
   from the glass in front of them, and a cool rim of light from the map behind them traces their back and the top of their head.
   Skin keeps its own colour where the light falls.

   md_person(ctx, who, x, y, s, o) draws a person as ag_person does (the same who, x, y, s and o: t, flip, pose, hold, front, nod,
   gaze, talk, smile, cut, covered), and returns the hands as it does. who is a name in MD_CAST (this module's people) or in the agent
   films' cast ("noor", "sam", "jun", "mei", "yusuf", "clara", "anil", "david"), or a spec of someone else (see people.js there). o.light:
     key     where the warm light comes from, in figure space (facing right: [560, 360], in front of the face and a little above)
     reach   how far it reaches, in figure units (780)
     shade   how far the side away from it sinks into the night, 0 to 1 (0.62)
     ground  how far the body sinks into the night below the chest, 0 to 1 (0.4)
     warm    how warm the light on the face is, 0 to 1 (0.14)
     rim     the rim's colour (the map's light, MD.flow), rimA its strength (0.7), rimW its width in figure units (7)
   A person fading in or out is drawn whole first and laid on the picture at that opacity, so they never show through themselves.
   md_nameTag(ctx, x, y, who, o) writes a person's name and role under or beside them: o.align, o.role (the line under the name),
   o.col (the colour of their side, for the small bar), o.a. */

/* ---------------------------------------------------------------- the cast this module adds
   As the module's shared numbers set them (/mnt/project-files/modern-data-basics/numbers.md, confirmed by the opening film): Ingrid
   Holm in HR, who owns the HR system's data, in the plum of HR's side; Rohan Desai, Finance's management accountant, in the warm brown
   of Finance's; and Linh Nguyen, the casual tutor the data is about, who wears no colour of a side. Noor Rahman, Sam Okafor and Jun
   Park are the agent films' (AG_CAST). Say rules for the voice are in numbers.md. */
const MD_CAST={
  ingrid:{name:"Ingrid Holm",role:"HR",skin:[236,204,182],hair:{style:"bun",c:[196,176,140]},glasses:[70,62,58],top:{kind:"blazer",c:[98,74,104],inner:[238,234,228]},breath:0.28},
  rohan:{name:"Rohan Desai",role:"Finance",skin:[182,132,98],hair:{style:"side",c:[30,26,26]},glasses:[52,40,34],top:{kind:"blazer",c:[124,104,82],inner:[234,236,240]},breath:0.26},
  linh:{name:"Linh Nguyen",role:"Casual tutor, HI101",skin:[232,196,166],hair:{style:"bob",c:[24,22,26]},earrings:[214,218,226],top:{kind:"cardigan",c:[132,136,142],inner:[236,234,230]},breath:0.3}
};
const md_who=who=>typeof who==="string"&&MD_CAST[who]?MD_CAST[who]:who;
const MD_ROLE={noor:"Data architect",sam:"Data platform",jun:"Data project"};

/* ---------------------------------------------------------------- a person in the night */
function md_person(ctx,who,x,y,s,o){o=o||{};const a=ctx.globalAlpha;if(a<0.004)return null;const W0=md_who(who),L0=Object.assign({key:[560,360],reach:780,shade:0.62,ground:0.4,warm:0.14,rim:MD.flow,rimA:0.7,rimW:7},o.light||{});
  const A=AG_FIG.anchor,m=ctx.getTransform(),M=m.translate(x,y).scale(o.flip?-s:s,s).translate(-A[0],-A[1]),cw=ctx.canvas.width,ch=ctx.canvas.height;
  const pt=(fx,fy)=>[M.a*fx+M.c*fy+M.e,M.b*fx+M.d*fy+M.f],k=Math.hypot(M.a,M.b);
  // the part of the canvas the person (and what the near hand may hold) can reach
  let L=1e9,R=-1e9,T0=1e9,B=-1e9;for(const [fx,fy] of [[-260,120],[820,120],[-260,1160],[820,1160]]){const q=pt(fx,fy);L=Math.min(L,q[0]);R=Math.max(R,q[0]);T0=Math.min(T0,q[1]);B=Math.max(B,q[1]);}
  L=Math.max(0,Math.floor(L));T0=Math.max(0,Math.floor(T0));R=Math.min(cw,Math.ceil(R));B=Math.min(ch,Math.ceil(B));if(R<=L||B<=T0)return null;const w=R-L,h=B-T0;
  // the person, whole, on a canvas of their own
  const [pc,px]=ag_buf("mdPerson",cw,ch);px.setTransform(m);let hands;try{hands=ag_person(px,W0,x,y,s,Object.assign({},o,{light:undefined}));}finally{px.setTransform(1,0,0,1,0,0);px.globalAlpha=1;}
  // the light: the far side sinks into the navy, the near side keeps its colour, and the face takes a little warmth
  const K=pt(L0.key[0],L0.key[1]),rad=L0.reach*k;px.globalCompositeOperation="source-atop";
  let g=px.createRadialGradient(K[0],K[1],0,K[0],K[1],rad);g.addColorStop(0,rgba(MD.navy,0.04));g.addColorStop(0.45,rgba(MD.navy,L0.shade*0.55));g.addColorStop(1,rgba(MD.navy,L0.shade));px.fillStyle=g;px.fillRect(L,T0,w,h);
  // and the body sinks into the night below the chest, so a person rises out of the dark
  if(L0.ground>0){const c0=pt(300,700),c1=pt(300,1100);g=px.createLinearGradient(c0[0],c0[1],c1[0],c1[1]);g.addColorStop(0,rgba(MD.navy,0));g.addColorStop(1,rgba(MD.navy,L0.ground));px.fillStyle=g;px.fillRect(L,T0,w,h);}
  if(L0.warm>0){g=px.createRadialGradient(K[0],K[1],0,K[0],K[1],rad*0.55);g.addColorStop(0,rgba([255,214,172],L0.warm));g.addColorStop(1,rgba([255,214,172],0));px.fillStyle=g;px.fillRect(L,T0,w,h);}
  px.globalCompositeOperation="source-over";
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=a;ctx.drawImage(pc,L,T0,w,h,L,T0,w,h);
  // the rim: the silhouette less itself moved towards the light, so only the edge away from it (and the top of the head) is left
  if(L0.rimA>0){const rw=Math.max(1.5,L0.rimW*k),dir=o.flip?-1:1,[rc,rx]=ag_buf("mdRim",cw,ch);rx.drawImage(pc,L,T0,w,h,L,T0,w,h);
    rx.globalCompositeOperation="destination-out";rx.drawImage(pc,L,T0,w,h,L+dir*rw,T0+rw*0.45,w,h);
    rx.globalCompositeOperation="source-in";const fg=rx.createLinearGradient(0,T0,0,B);fg.addColorStop(0,rgba(L0.rim,1));fg.addColorStop(0.5,rgba(L0.rim,0.7));fg.addColorStop(1,rgba(L0.rim,0.05));rx.fillStyle=fg;rx.fillRect(L,T0,w,h);
    rx.globalCompositeOperation="source-over";ctx.globalCompositeOperation="lighter";ctx.globalAlpha=a*L0.rimA;ctx.drawImage(rc,L,T0,w,h,L,T0,w,h);
    // and its glow: the same edge, made small and laid on again larger, so it spreads softly
    const sw=Math.max(2,Math.ceil(w/6)),sh=Math.max(2,Math.ceil(h/6)),[sc,sx]=ag_buf("mdRimSoft",sw,sh);sx.drawImage(rc,L,T0,w,h,0,0,sw,sh);
    ctx.globalAlpha=a*L0.rimA*0.55;ctx.drawImage(sc,0,0,sw,sh,L,T0,w,h);}
  ctx.restore();return hands;}

// a person's name and the line under it (their role), and a small bar in the colour of their side
function md_nameTag(ctx,x,y,who,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const P_=typeof who==="string"?(MD_CAST[who]||AG_CAST[who]):who,
    name=o.name||(P_&&P_.name)||String(who),role=o.role!=null?o.role:(typeof who==="string"&&MD_ROLE[who])||(P_&&P_.role)||"",al=o.align||"left";
  ctx.save();ctx.globalAlpha*=a;const nw=md_tw(ctx,name,{w:800,size:32}),rw2=role?md_tw(ctx,role,{w:600,size:28}):0,ww=Math.max(nw,rw2),x0=al==="center"?x-ww/2:al==="right"?x-ww:x;
  if(o.col){ctx.save();ctx.shadowColor=rgba(o.col,0.9);ctx.shadowBlur=12;ctx.fillStyle=rgba(o.col,1);rr(ctx,x0-22,y-28,6,role?70:34,3);ctx.fill();ctx.restore();}
  md_T(ctx,name,x0,y,{w:800,size:32});if(role)md_T(ctx,role,x0,y+38,{w:600,size:28,col:MD.soft});ctx.restore();}
