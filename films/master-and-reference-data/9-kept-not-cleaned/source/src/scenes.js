/* ===== Kept, not cleaned: scenes =====
   Ten chapters, as in ../script.md: Dujiangyan, split without a dam, its inner channel dug out every dry season down to a mark in its
   bed; the university's clean-up of 2024; the duplicates coming back, intake by intake; the search before create at the application;
   the steward's five measures, each with a limit; an alert, and the case it points at; a change to a list, drafted by an agent and
   decided by its owner; the governance scorecard; a bank that cleans up every three years; and Linh's PhD, with the water let back
   into the inner channel in spring.
   Drawn in watercolour (shared/src/wash.js), made to read on a phone (tools/legible.py): text is at least 28 px in the frame. The camera
   moves in on whatever the narration is about, and every shot drifts slowly; things arrive with a spring. Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

// the camera, as The map before the data moves it (keys are [time, x, y, zoom], each move eased over d seconds), kept inside the place
function m9_focus(ctx,t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z);x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
// every scene's start and end: the place under the camera, and over it all, the paper
function m9_open(ctx,S,t,sc,place,keys,o){o=o||{};setScreen(ctx,S);ctx.save();const cam=m9_focus(ctx,t,keys,o.d||1.6);drift(ctx,t,sc,{z:o.z==null?0.018:o.z,x:o.dx||960,y:o.dy||560});
  if(place)m9_place(ctx,place);return cam;}
function m9_close(ctx,S){ctx.restore();setScreen(ctx,S);}

/* ---------- 1. Kept, every dry season ---------- */
// the river through a year: o says when the dry season comes (dry), the tripods close the inner channel (close), its water drains
// (drain), the diggers go down into its bed (dig), the tripods come down (open), the water comes back (fill), and the land greens again
// (green)
function m9_seasons(ctx,t,o){const dryA=fin(t,o.dry,1.6)*(1-fin(t,o.green,1.6));m9_place(ctx,"river");if(dryA>0.01)withA(ctx,dryA,()=>m9_place(ctx,"riverDry"));
  const dr=ease(clamp((t-o.drain)/1.8,0,1)),fl=ease(clamp((t-o.fill)/1.8,0,1)),cf=ease(clamp((t-o.fill-1.4)/1.3,0,1));
  // the inner channel's water over the dry bed: it drains from the tripods down, and comes back from the head
  if(dryA>0.01){if(t<o.fill)m9_waterIn(ctx,lerp(M9_CLOSE,1,dr),1,clamp((dr-0.55)/0.45,0,1)*M9_CDMAX,M9_CDMAX);else m9_waterIn(ctx,M9_CLOSE,lerp(M9_CLOSE,1,fl),0,cf*M9_CDMAX);}
  const inA=t<o.drain?1:t<o.fill?1-dr:fl;
  m9_flow(ctx,t,M9_MAIN,M9_WMAIN,40,80,3,1,0.34,M9_SEEN);m9_flow(ctx,t,M9_IN,M9_WIN,12,52,7,inA,0.3);
  M9_CAN.forEach((c,i)=>m9_flow(ctx,t,c.p,c.w,Math.ceil(c.L/160),36,11+i,(t<o.drain?1:t<o.fill?0:cf)*0.7,0.1));
  m9_tripods(ctx,t,o.close,o.open);m9_diggers(ctx,t,o.dig,fin(t,o.dig,0.5)*(1-fin(t,o.open-0.7,0.6)));return dryA;}
scene("river",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tMin=w("split","Min River"),tTwo=w("split","in two"),tPl=w("split","Chengdu plain"),tG=c("gravel"),tOut=w("gravel","outer channel"),
    tD=c("dry"),tEv=w("dry","every dry season"),tCl=w("dry","closed off"),tDug=w("dry","dug out"),tMk=w("dry","a mark"),tM=c("mark"),tIr=w("mark","iron bars"),
    tR=c("rule"),tSix=w("rule","six characters"),tDig=w("rule","dig the riverbed"),tSt=c("still"),tWat=w("still","still waters"),tK=c("kept");
  // the camera: the valley; in on the split as the gravel goes by; down the inner channel in the dry season, as it's dug out; across to
  // the cut through its bed; out for the rule; over the plain as the water comes back; out
  m9_open(ctx,S,t,sc,null,[[0,960,540,1],[tMin-0.6,990,480,1.1],[tG-0.5,1000,470,1.7],[tD-0.3,880,560,1.4],[tM-1.1,1120,450,1.18],[tR-0.6,960,520,1],[tSt-0.3,740,640,1.28],[tK-0.3,960,540,1]]);
  const o={dry:tEv-0.2,close:tCl-0.1,drain:tCl+0.5,dig:tDug,open:tSt-0.1,fill:tSt+0.5,green:tSt+2.4};m9_seasons(ctx,t,o);
  m9_gravel(ctx,t,tG-1.2,fin(t,tG-0.8,0.6)*(1-fin(t,tD,0.8)));
  // the channels, named as the river splits; the plain, as it's watered
  const off=t1=>1-fin(t,t1,0.5);
  arrive(ctx,1150,330,t,tMin,()=>withA(ctx,off(tD-0.2),()=>wc_tag(ctx,1150,330,"Min River",{align:"center"})),{dy:8});
  arrive(ctx,1250,628,t,tTwo+0.1,()=>withA(ctx,off(tMk-0.6),()=>wc_tag(ctx,1250,628,"outer channel",{align:"center"})),{dy:8});
  arrive(ctx,760,600,t,tTwo+0.5,()=>withA(ctx,off(tMk-0.6),()=>wc_tag(ctx,760,600,"inner channel",{align:"center"})),{dy:8});
  arrive(ctx,290,540,t,tPl,()=>withA(ctx,off(tG-0.6),()=>wc_tag(ctx,290,540,"to the Chengdu plain",{align:"center"})),{dy:8});
  arrive(ctx,760,474,t,tEv+0.3,()=>withA(ctx,off(tMk-0.6),()=>wc_tag(ctx,760,474,"every dry season",{align:"center"})),{dy:8});
  // the cut through the riverbed, over a veil of paper, once the line has named the mark: dug out down to it, and no deeper; then the rule
  const hush=fin(t,tM-0.8,0.6)*(1-fin(t,tSt-0.6,0.8));m9_hush(ctx,0.5*hush);
  const pa=1-fin(t,tR-0.6,0.6);if(pa>0.01)withA(ctx,pa,()=>{const S9=M9_SEC,cx=S9.x+S9.w/2,my=S9.y+M9_MARK;
    arrive(ctx,cx,S9.y+S9.h/2,t,tM-0.7,()=>m9_section(ctx,t,{tDig:tM-0.5,tDug:tM+0.5,tBars:tIr-0.1,tLine:tM+1.2}),{dy:24,d:0.9,from:0.96});
    arrive(ctx,cx,my+70,t,tM+0.5,()=>withA(ctx,off(tIr-0.6),()=>wc_tag(ctx,cx,my+70,"stone horses, it's said",{align:"center"})),{dy:8});
    arrive(ctx,cx,my+70,t,tIr+0.1,()=>wc_tag(ctx,cx,my+70,"iron bars",{align:"center"}),{dy:8});
    arrive(ctx,cx,my+122,t,tIr+0.5,()=>wc_tag(ctx,cx,my+122,"the oldest cast in 1576",{align:"center",size:28,w:600}),{dy:8});
    arrive(ctx,cx,S9.y+S9.h+40,t,tM+1.9,()=>wc_tag(ctx,cx,S9.y+S9.h+40,"dig until you see it, and no deeper",{align:"center"}),{dy:8});});
  const ra=1-fin(t,tSt-0.6,0.6);if(ra>0.01)withA(ctx,ra,()=>{m9_rule(ctx,960,196,clamp((t-tDig+0.3)/1.6,0,1));
    arrive(ctx,960,296,t,tSix,()=>wc_tag(ctx,960,296,"the rule, six characters long",{align:"center",size:28,w:600}),{dy:8});});
  m9_close(ctx,S);
  wc_year(ctx,64,80,"about 256 BC · Sichuan",fin(t,0.4,0.6)*(1-fin(t,tSt+0.2,0.4)));wc_year(ctx,64,80,"today",fin(t,tWat,0.5));
  wc_paperOver(ctx,S);wc_fadeIn(ctx,S,t,1.4);
  wc_title(ctx,S,t,B+0.6,"Kept, not cleaned","looking after it every day, and checks at entry","Film 9 of 9 · master and reference data");});

/* ---------- 2 to 10, while they're drawn: each place ---------- */
[["cleanup","campus"],["return","plain"],["entry","plain"],["measures","office"],["alert","office"],["agent","admissions"],["scorecard","gov"],["elsewhere","plainB"],["kept","campus"]].forEach(([id,pl])=>
  scene(id,(ctx,S,t,sc)=>{m9_open(ctx,S,t,sc,pl,[[0,960,540,1]]);m9_close(ctx,S);wc_paperOver(ctx,S);}));
