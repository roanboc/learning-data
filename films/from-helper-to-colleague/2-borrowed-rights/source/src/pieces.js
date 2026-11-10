/* ===== Borrowed rights: the lab's pieces =====
   Where things stand in the module's lab (BL), and the film's pieces there, prefixed br_ / BR_:
     the helper: the module's sphere, wearing its person's badge on a blue lanyard (br_badge: their own staff card, a small portrait in
     their colours beside their name), floating above the person whose sign-in it works on (br_helper); an agent with a name of its
     own wears its own badge (ag_badge), with its owner's tag beside it or under it (br_agent);
     cards, lists and pills as 3.1 has them (br_card, br_list, br_pillL); a card of a title and lines (br_doc), and a ticket (br_ticket);
     the step a helper asks to be allowed (br_prompt); a record that would have been (br_ghost); a log, each row with who really did it
     beside it (br_log); the helper's own setting (br_setting); a sample with names masked (br_sample); the project's page for agents
     (br_page); drafts standing in the sandbox (br_drafts); a place on the university's map (br_map); a ticket's tag on its way (br_tag);
     the corner tag of the opening (br_corner).
   Colours keep the module's meanings: blue tools and structure (the tools that only read, the sandbox, what stays Jun's), violet the
   model thinking, orange data coming back, green a check that passes, amber something wrong (the step that would approve as Jun, the
   record that would have said so, the words hidden in a ticket). Every word is drawn live with ag_T, at least 28 px, above y 890. */

const BL={helper:{x:250,y:228,r:62},person:{x:372,y:700,s:0.8},small:{x:680,y:800,w:1160},tray:{x:1250,y:796,w:760},
  agentR:{x:1640,y:560,r:62}};
// the lab, its marble quieter where this film puts its words: the cards on the right, the helper, the kicker
const BR_QUIET=[[1240,300,640,200,0.5],[1240,580,640,170,0.4],[560,250,250,150,0.35],[420,96,360,46,0.3]];
AG_PLACES.brLab=c=>ag_paintLab(c,{quiet:BR_QUIET});
const BR_KICK=(x,o)=>ag_kicker(x,"3.2","Borrowed rights",o);
// a value worked out once for a chapter (its cues and words), kept on it
function br_once(sc,k,fn){sc.__br=sc.__br||{};if(!(k in sc.__br))sc.__br[k]=fn();return sc.__br[k];}

/* ---------------------------------------------------------------- the corner tag: where and when, at the top left of the opening */
function br_corner(ctx,text,a){if(a<=0)return;const w=ag_tw(ctx,text.toUpperCase(),{w:700,size:30,ls:3})+56;
  ag_box(ctx,72,64,w,62,31,{a:a*0.92});ag_T(ctx,text.toUpperCase(),100,106,{w:700,size:30,ls:3,col:AG.kick,a});}
// the corner tags of a chapter, over its shots: [[from, to, words], ...]
function br_tags(ctx,S,t,list){setScreen(ctx,S);for(const [t0,t1,s] of list){const a=ag_in(t,t0,0.5)*(1-ag_in(t,t1-0.4,0.4));if(a>0)br_corner(ctx,s,a);}}

/* ---------------------------------------------------------------- a person's badge, and the helper that wears it */
// a small portrait in a person's own colours, s px square, its top left at (x, y): their top, their skin, their hair, their glasses
function br_portrait(ctx,x,y,s,who){const P=ag_spec(who),hair=P.hair.c,skin=P.skin,top=P.top.c,cx=x+s*0.5,st=P.hair.style;
  ctx.save();ctx.beginPath();ag_rect(ctx,x,y,s,s,6);ctx.clip();
  let g=ctx.createLinearGradient(0,y,0,y+s);g.addColorStop(0,"#E4E9ED");g.addColorStop(1,"#CBD3DA");ctx.fillStyle=g;ctx.fillRect(x,y,s,s);
  if(st==="long"||st==="bob"){ctx.fillStyle=rgba(hair,1);ctx.beginPath();ag_rect(ctx,cx-s*0.24,y+s*0.22,s*0.48,s*(st==="long"?0.62:0.4),s*0.16);ctx.fill();}
  ctx.fillStyle=rgba(top,1);ctx.beginPath();ctx.ellipse(cx,y+s*1.06,s*0.46,s*0.34,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(ag_dk(skin,0.12),1);ctx.fillRect(cx-s*0.075,y+s*0.6,s*0.15,s*0.16);
  ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.ellipse(cx,y+s*0.47,s*0.175,s*0.215,0,0,TAU);ctx.fill();
  const cap=st==="coily"?[0.4,0.21,0.19]:st==="cropped"?[0.37,0.18,0.12]:[0.4,0.195,0.165];
  ctx.fillStyle=rgba(hair,1);ctx.beginPath();ctx.ellipse(cx,y+s*cap[0],s*cap[1],s*cap[2],0,Math.PI,TAU);ctx.closePath();ctx.fill();
  if(P.glasses){ctx.strokeStyle=rgba(P.glasses,0.9);ctx.lineWidth=Math.max(1,s*0.035);for(const dx of [-0.075,0.075]){ctx.beginPath();ctx.arc(cx+s*dx,y+s*0.47,s*0.06,0,TAU);ctx.stroke();}}
  ctx.restore();ctx.strokeStyle="rgba(60,50,40,0.28)";ctx.lineWidth=1.5;ctx.beginPath();ag_rect(ctx,x,y,s,s,6);ctx.stroke();}
// a person's badge on a blue lanyard hanging from (x, y), as they wear it: their staff card, their portrait beside their name. A helper
// on their sign-in wears it (an agent with a name of its own wears its own, ag_badge); o.t sways it a little, o.drop, o.a
function br_badge(ctx,x,y,who,o){o=o||{};const a=o.a==null?1:o.a,P=ag_spec(who),drop=o.drop||46,ps=40,w=ag_tw(ctx,P.name,{w:700,size:28})+48+ps+14,h=64;
  if(a<=0)return{w,h};const sw=Math.sin((o.t||0)*1.3)*0.025;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(sw);
  ctx.strokeStyle=rgba(AG.blue,0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-26,0);ctx.lineTo(-8,drop-10);ctx.moveTo(26,0);ctx.lineTo(8,drop-10);ctx.stroke();
  ctx.fillStyle="#9AA0A8";ctx.fillRect(-9,drop-14,18,14);
  ag_box(ctx,-w/2,drop,w,h,10,{});ctx.fillStyle=rgba(AG.blue,0.85);ctx.fillRect(-w/2+10,drop+4,w-20,5);
  br_portrait(ctx,-w/2+16,drop+15,ps,P);ag_T(ctx,P.name,-w/2+16+ps+14,drop+h/2+16,{w:700,size:28});ctx.restore();return{w,h};}
// a glow round a badge hanging at (x, y + drop), w wide, h tall: what says who the agent is, or is taken for, lit
function br_badgeGlow(ctx,x,y,w,h,a,col){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;ctx.shadowColor=rgba(col||AG.blue,0.8);ctx.shadowBlur=26;
  ctx.strokeStyle=rgba(col||AG.blue,0.9);ctx.lineWidth=4;rr(ctx,x-w/2-6,y-6,w+12,h+12,14);ctx.stroke();ctx.restore();}
// a helper on a person's sign-in: the sphere, its light on the wall, and that person's badge (who) below it; o.at, o.glow (the badge
// lit), o.think, o.core, o.a
function br_helper(ctx,t,who,o){o=o||{};const P_=o.at||BL.helper,a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  const core=o.core==null?1:o.core;ag_modelLight(ctx,P_.x,P_.y,P_.r,core);ag_model(ctx,P_.x,P_.y,P_.r,{t,core,think:o.think||0});
  const hy=P_.y+P_.r+4,drop=o.drop||46,bw=ag_tw(ctx,ag_spec(who).name,{w:700,size:28})+102;
  br_badgeGlow(ctx,P_.x,hy+drop,bw,64,o.glow,o.glowCol);br_badge(ctx,P_.x,hy,who,{t,drop});ctx.restore();}
// an agent with a name of its own: the sphere, its own badge (name), and its owner's tag (o.owner) under the badge, or beside it
// (o.ownerSide "right"); o.at, o.glow, o.ownerA, o.think, o.core, o.a
function br_agent(ctx,t,name,o){o=o||{};const P_=o.at||BL.agentR,a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  const core=o.core==null?1:o.core;ag_modelLight(ctx,P_.x,P_.y,P_.r,core);ag_model(ctx,P_.x,P_.y,P_.r,{t,core,think:o.think||0});
  const hy=P_.y+P_.r+4,drop=o.drop||46,bw=ag_tw(ctx,name,{w:700,size:28})+48;
  br_badgeGlow(ctx,P_.x,hy+drop,bw,58,o.glow,o.glowCol);ag_badge(ctx,P_.x,hy,name,{t,drop});
  if(o.owner){const oa=o.ownerA==null?1:o.ownerA;if(o.ownerSide==="right")br_pillL(ctx,P_.x+bw/2+16,hy+drop+29,o.owner,{size:28,a:oa});
    else ag_pill(ctx,P_.x,hy+drop+58+44,o.owner,{size:28,a:oa});}
  ctx.restore();}
// the one person a moment needs, below the helper, facing the cards; o.at, o.dx, o.p (gaze, nod, talk), o.a; people fade whole
function br_who(ctx,who,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const S=o.at||BL.person;
  withA(ctx,a,()=>ag_person(ctx,who,S.x+(o.dx||0),S.y,S.s,Object.assign({t,gaze:[4,-1]},o.p||{})));}

/* ---------------------------------------------------------------- cards, lists, pills, icons */
function br_card(ctx,x,y,w,kick,title,sub,o){o=o||{};return ag_textCard(ctx,x,y,w,{kick,title,sub},{kickCol:o.kickCol||AG.kick,edge:o.edge,edgeA:o.edgeA,tail:o.tail,a:o.a,k:o.k,icon:o.icon});}
// a pill whose left edge is at x (ag_pill takes its middle)
function br_pillL(ctx,x,y,text,o){o=o||{};const w=ag_tw(ctx,text,{w:700,size:o.size||30})+(o.icon?96:56);return ag_pill(ctx,x+w/2,y,text,o);}
// a circle with a line through it: what a tool may not do
function br_no(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=s*0.12;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,s*0.42,0,TAU);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-s*0.29,y+s*0.29);ctx.lineTo(x+s*0.29,y-s*0.29);ctx.stroke();ctx.restore();}
// an icon by name at (x, y), in a CSS colour: tick, lock, no, warn, draft
function br_icon(ctx,icon,x,y,col){if(icon==="tick")ag_tick(ctx,x,y,20,col,3.6);else if(icon==="lock")ag_lock(ctx,x,y+4,26,col);else if(icon==="no")br_no(ctx,x,y,26,col);
  else if(icon==="warn")ag_warn(ctx,x,y,28,col);else if(icon==="draft")ag_pen(ctx,x,y,26,col);}
// a line of a list or a card: [{t, a, icon, col (the icon's colour, or the words' when there's no icon), tc (the words' colour)}]
// a line's words come in once its gap has opened (its a past 0.35), so a card grows, then each line types in
function br_row(ctx,l,x,ly,o){const la=clamp(((l.a==null?1:l.a)-0.35)/0.65,0,1);if(la<=0)return;const ic=l.icon||(l.tick?"tick":null),col=l.col||(ic==="tick"?AG.green:AG.blue);
  if(ic){ctx.save();ctx.globalAlpha*=la;br_icon(ctx,ic,x+14,ly-10,rgba(col,1));ctx.restore();}
  ag_T(ctx,l.t,x+(ic?44:0),ly,{w:700,size:30,col:l.tc||(l.col&&!ic?l.col:AG.ink),a:la});}
// how far a card's lines reach, in lines: each line opens its gap as it comes in (over the first 60% of its a), and the card reaches
// the furthest one; l.slot is a line's place (a line that takes another's place, in the same slot, doesn't grow the card)
function br_reach(lines){let r=0;lines.forEach((l,i)=>{const a=l.a==null?1:l.a,s=l.slot==null?i:l.slot;if(a>0)r=Math.max(r,s+ag_sine(clamp(a/0.6,0,1)));});return r;}
// a card of lines that come in one by one: kick, then lines, each 46 px, the card growing as each comes in; returns its box
function br_list(ctx,x,y,w,kick,lines,o){o=o||{};const h=64+br_reach(lines)*46+14,a=o.a==null?1:o.a;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:o.edgeA==null?0.5:o.edgeA,glow:o.glow?(o.edge||AG.blue):null,glowA:o.glow||0});
  ag_T(ctx,String(kick).toUpperCase(),x+28,y+48,{w:700,size:28,ls:3,col:o.kickCol||AG.blue});
  lines.forEach((l,i)=>br_row(ctx,l,x+28,y+64+(l.slot==null?i:l.slot)*46+34,o));ctx.restore();return{x,y,w,h};}
// a card with a kick, a title (wrapped, 36 px, or o.tsize) and lines under it (as br_list's, growing as they come in); o.edge, o.edgeA, o.glow, o.kickCol,
// o.tcol (the title's colour), o.k, o.a; o.measure only measures it. Returns its box
function br_doc(ctx,x,y,w,kick,title,lines,o){o=o||{};lines=lines||[];const ts=o.tsize||36,lh=ts+8,tl=title?ag_wrap(ctx,title,w-56,{w:700,size:ts}):[],
    top=kick?66:28,h=top+tl.length*lh+br_reach(lines)*46+(kick||tl.length?28:14),a=o.a==null?1:o.a,b={x,y,w,h};if(a<=0||o.measure)return b;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:o.edgeA==null?0.6:o.edgeA,glow:o.glow?(o.edge||AG.blue):null,glowA:o.glow||0});
  if(kick)ag_T(ctx,String(kick).toUpperCase(),x+28,y+50,{w:700,size:28,ls:3,col:o.kickCol||AG.kick});
  let yy=y+top;for(const l of tl){yy+=lh;ag_T(ctx,l,x+28,yy,{w:700,size:ts,col:o.tcol||AG.ink});}
  lines.forEach((l,i)=>br_row(ctx,l,x+28,yy+46*((l.slot==null?i:l.slot)+1)-4,o));ctx.restore();return b;}
// a ticket: its kick (TICKET, or o.kick) and what it asks for
function br_ticket(ctx,x,y,w,text,o){o=o||{};return br_doc(ctx,x,y,w,o.kick||"Ticket",text,o.lines,Object.assign({kickCol:AG.blue,tsize:32,edge:AG.blue,edgeA:0.35},o));}

/* ---------------------------------------------------------------- the step a helper asks to be allowed, and the record that would have been */
// a card asking to allow a step: o.kick (above), o.title (the step), o.warn (amber: the step is wrong), o.allow and o.deny (0 to 1: that
// button lit, Don't allow in green with a tick), o.stack (0 to 1: the steps allowed before it, a pile of cards behind); returns its box
function br_prompt(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=266,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  const n=Math.round(clamp(o.stack||0,0,1)*7);for(let i=n;i>=1;i--)ag_box(ctx,x+i*8,y-i*8,w,h,22,{});
  const col=o.warn?AG.amber:AG.violet;
  ag_box(ctx,x,y,w,h,22,{edge:col,edgeA:0.75,glow:o.warn?AG.amber:null,glowA:o.warn?0.55:0});
  ag_T(ctx,String(o.kick||"Allow this step?").toUpperCase(),x+28,y+50,{w:700,size:28,ls:3,col});
  ag_T(ctx,o.title||"",x+28,y+112,{w:700,size:38,col:o.warn?AG.amber:AG.ink});
  const by=y+h-66,bw=(w-56-20)/2;
  [["Allow",o.allow||0,AG.violet],["Don't allow",o.deny||0,AG.green]].forEach(([s,lit,bc],i)=>{const bx=x+28+i*(bw+20);
    ag_box(ctx,bx,by-30,bw,60,30,{edge:lit>0.02?bc:null,edgeA:0.9*lit,glow:lit>0.02?bc:null,glowA:lit});
    if(i===1&&lit>0.02){ctx.save();ctx.globalAlpha*=lit;ag_tick(ctx,bx+40,by,22,rgba(bc,1),3.6);ctx.restore();}
    ag_T(ctx,s,bx+bw/2+(i===1?14*lit:0),by+10,{w:700,size:30,align:"center",col:lit>0.5?bc:AG.ink});});
  ctx.restore();return b;}
// a record that would have been: a card in dashes, a little see-through, its words in amber
function br_ghost(ctx,x,y,w,kick,title,o){o=o||{};const a=o.a==null?1:o.a,h=title?150:94,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  ctx.fillStyle="rgba(243,241,237,0.86)";rr(ctx,x,y,w,h,22);ctx.fill();
  ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=3;ctx.setLineDash([12,9]);rr(ctx,x,y,w,h,22);ctx.stroke();ctx.setLineDash([]);
  ag_T(ctx,String(kick).toUpperCase(),x+28,y+50,{w:700,size:28,ls:3,col:AG.amber});
  if(title)ag_T(ctx,title,x+28,y+112,{w:700,size:38,col:AG.amber});ctx.restore();return b;}

/* ---------------------------------------------------------------- a log, and who really did each step */
// a log: kick, and rows [{at, who, what, by (a person, or "agent"), a}]; o.by (0 to 1) shows, beside each row, who really did it, under
// the words WHO DID IT; returns its box
function br_log(ctx,x,y,w,kick,rows,o){o=o||{};const a=o.a==null?1:o.a,h=64+rows.length*48+18,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.5});
  ag_T(ctx,String(kick).toUpperCase(),x+28,y+48,{w:700,size:28,ls:3,col:AG.blue});
  const by=clamp(o.by||0,0,1),ww=Math.max(...rows.map(r=>ag_tw(ctx,r.who,{w:700,size:30})))+26,aw=ag_tw(ctx,"00:00",{w:500,size:28,f:"mono"})+24;
  if(by>0)ag_T(ctx,"WHO DID IT",x+w-28,y+48,{w:700,size:28,ls:3,align:"right",col:AG.violet,a:by});
  rows.forEach((r,i)=>{const ra=r.a==null?1:r.a;if(ra<=0)return;const ly=y+64+i*48+36;
    ag_T(ctx,r.at,x+28,ly,{w:500,size:28,f:"mono",col:AG.mut,a:ra});ag_T(ctx,r.who,x+28+aw,ly,{w:700,size:30,a:ra});ag_T(ctx,r.what,x+28+aw+ww,ly,{w:500,size:30,a:ra});
    const s=by*ra;if(s>0&&r.by){ctx.save();ctx.globalAlpha*=s;const mx=x+w-76,my=ly-10;
      if(r.by==="agent")ag_model(ctx,mx,my,17,{core:1});else br_portrait(ctx,mx-18,my-18,36,r.by);ctx.restore();}});
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the helper's own setting, a sample, the project's page */
// the helper's own setting: two choices with a dot on the one that's on (o.sel 0: ask before each step; 1: go on without asking; between
// them the dot moves); returns its box
function br_setting(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=64+2*58+20,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{});
  ag_T(ctx,"THE HELPER'S OWN SETTING",x+28,y+48,{w:700,size:28,ls:3,col:AG.kick});
  ["Ask before each step","Go on without asking"].forEach((s,i)=>{const cy=y+64+i*58+30;ctx.strokeStyle=rgba(AG.mut,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+46,cy,14,0,TAU);ctx.stroke();
    ag_T(ctx,s,x+78,cy+11,{w:700,size:30});});
  const dy=lerp(y+94,y+152,ag_sine(clamp(o.sel||0,0,1)));ctx.fillStyle=rgba(AG.ink,0.9);ctx.beginPath();ctx.arc(x+46,dy,8,0,TAU);ctx.fill();
  ctx.restore();return b;}
// a sample a tool gives back: kick, its columns and its rows, each name masked; o.p (0 to 1) brings the rows in; returns its box
const BR_SAMPLE={cols:["Name","School","Casual"],rows:[["••••••","Nursing","yes"],["•••••••","Midwifery","no"],["•••••","Public Health","no"]]};
function br_sample(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,R=BR_SAMPLE.rows,h=64+48+R.length*46+18,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.orange,edgeA:0.55});
  ag_T(ctx,"A SAMPLE · 20 ROWS AT MOST",x+28,y+48,{w:700,size:28,ls:3,col:AG.orange});
  const cx=[x+28,x+250,x+w-150];BR_SAMPLE.cols.forEach((c,i)=>ag_T(ctx,c,cx[i],y+100,{w:600,size:28,col:AG.mut}));
  ctx.fillStyle="rgba(60,50,40,0.14)";ctx.fillRect(x+28,y+116,w-56,1.5);
  R.forEach((r,j)=>{const ra=clamp((o.p==null?1:o.p)*R.length-j,0,1);if(ra<=0)return;const ly=y+112+j*46+42;r.forEach((v,i)=>ag_T(ctx,v,cx[i],ly,{w:j===0&&i===0?700:600,size:30,col:i===0?AG.mut:AG.ink,a:ra}));});
  ctx.restore();return b;}
// the project's page for agents: its file's name, a section's heading and its lines (o.p 0 to 1 brings them in, one by one)
function br_page(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,L=o.lines||[],h=150+L.length*46+16,b={x,y,w,h};if(a<=0)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  ctx.save();ctx.shadowColor=AG.card.shadow;ctx.shadowBlur=30;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=14;ctx.fillStyle="#FAF9F6";ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.fillStyle=rgba(AG.blue,0.85);ctx.fillRect(x,y,w,6);
  ag_T(ctx,"AGENTS.md",x+32,y+56,{w:500,size:28,f:"mono",col:AG.mut});
  ag_T(ctx,o.head||"On a person's sign-in",x+32,y+114,{w:700,size:36});
  const p=o.p==null?1:o.p;L.forEach((l,i)=>{const la=clamp(p*L.length-i,0,1);if(la<=0)return;const ly=y+170+i*46;
    ctx.fillStyle=rgba(AG.ink,0.75*la);ctx.beginPath();ctx.arc(x+46,ly-10,4.5,0,TAU);ctx.fill();ag_T(ctx,l,x+66,ly,{w:600,size:30,a:la});});
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the sandbox's drafts, a ticket's tag, a place on the map */
// drafts standing in the sandbox's tray (box: its inside, as ag_sandbox returns it): small cards, each with a pen and its words,
// list [[text, a], ...], each as wide as its words, side by side in the middle of the tray
function br_drafts(ctx,box,list){if(!box)return;const n=list.length,gap=24,h=74,ws=list.map(([s])=>ag_tw(ctx,s,{w:700,size:28})+86),tot=ws.reduce((p,q)=>p+q,0)+gap*(n-1);
  let xx=box.x+(box.w-tot)/2;
  list.forEach(([s,a],i)=>{const w=ws[i],x=xx;xx+=w+gap;if(!(a>0))return;const y=box.y+box.h-h-4+(1-ag_eo(a))*20;
    ctx.save();ctx.globalAlpha*=clamp(a*1.4,0,1);ag_box(ctx,x,y,w,h,12,{edge:AG.blue,edgeA:0.45});ag_pen(ctx,x+32,y+h/2,24,rgba(AG.blue,1));
    ag_T(ctx,s,x+58,y+h/2+10,{w:700,size:28});ctx.restore();});}
// a ticket's tag: a pill with a small square at its left (blue), centred on (x, y); o.a, o.k, o.glow
function br_tag(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,col=o.col||AG.blue,w=ag_tw(ctx,text,{w:700,size:28})+72,h=54;if(a<=0)return{x:x-w/2,y:y-h/2,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.5,1,o.k));
  ag_box(ctx,x-w/2,y-h/2,w,h,h/2,{edge:col,edgeA:0.75,glow:o.glow?col:null,glowA:o.glow||0});
  ctx.fillStyle=rgba(col,0.9);rr(ctx,x-w/2+20,y-8,16,16,4);ctx.fill();ag_T(ctx,text,x-w/2+48,y+10,{w:700,size:28});ctx.restore();return{x:x-w/2,y:y-h/2,w,h};}
// the tag on its way from a to b (u 0 to 1), lifted a little in the middle
function br_tagMove(ctx,a,b,u,text,o){const k=ag_sine(u),x=lerp(a.x,b.x,k),y=lerp(a.y,b.y,k)-Math.sin(Math.PI*clamp(u,0,1))*50;return br_tag(ctx,x,y,text,o);}
// a place on the university's map: the service, the role in it and the agent assigned to that role, three cards linked from top to
// bottom, each coming in as o.p passes its third; o.glow lights the agent's; o.a, o.t
function br_map(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const p=o.p==null?1:o.p,t=o.t||0;ctx.save();ctx.globalAlpha*=a;
  ag_T(ctx,"THE UNIVERSITY'S MAP",x,y+28,{w:700,size:28,ls:3,col:AG.blue});
  const C=[["Service","Change a data product"],["Role","Planning contributor"],["Agent","planning agent"]],h=112,gap=46;let yy=y+52;
  C.forEach(([k,s],i)=>{const ca=clamp(p*3-i,0,1);if(ca<=0){yy+=h+gap;return;}ctx.save();ctx.globalAlpha*=ca;
    if(i>0){ctx.strokeStyle=rgba(AG.blue,0.6);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(x+70,yy-gap+4);ctx.lineTo(x+70,yy-6);ctx.stroke();ag_arrowHead(ctx,x+70,yy-6,Math.PI/2,9,rgba(AG.blue,0.8));}
    const ag=i===2;ag_box(ctx,x,yy,w,h,20,{edge:AG.blue,edgeA:ag?0.5+0.4*(o.glow||0):0.45,glow:ag&&o.glow?AG.blue:null,glowA:o.glow||0});
    ag_T(ctx,k.toUpperCase(),x+28,yy+44,{w:700,size:28,ls:3,col:AG.blue});ag_T(ctx,s,x+28,yy+88,{w:700,size:34});
    if(ag)ag_model(ctx,x+w-56,yy+h/2,26,{t,core:1});ctx.restore();yy+=h+gap;});
  ctx.restore();}
