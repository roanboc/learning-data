/* ===== What they tell us about ourselves: the eight chapters =====
   Each chapter is a few shots (ag_shots), cut together with short dissolves. Times inside a chapter come from its cues (when each
   line starts) and the words of its lines (wAt), so the pictures stay with the voice if it's recorded again. Words on screen are on
   cards, tags and pages, at least 28 px as seen, and above the captions; a place's year and name sit in the corner of the screen, so
   the camera doesn't move them. Things first, then the room's light, then cards and words. */

// made once per chapter, the first time it draws: its cues are known by then
const tt_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
const TT_TITLE="What they tell us about ourselves";
// a corner label: in from t0, out at t1 (or it stays)
const tt_cornerAt=(ctx,t,text,t0,t1,o)=>tt_corner(ctx,text,t1==null?ag_in(t,t0,0.5):ag_io(t,t0,t1,0.5),o);
// a card that springs in at t0 and goes at t1 (or stays): its k and a
const tt_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
// a draw-on from t0 over d seconds, eased
const tt_on=(t,t0,d)=>ag_sine(clamp((t-t0)/(d||1),0,1));
// the room's paper-pale veil inside a shot
function tt_veil(x,a){if(a<=0.01)return;x.save();x.fillStyle="rgba(240,238,233,"+clamp(a,0,1)+")";x.fillRect(-200,-200,W+400,H+400);x.restore();}
// a soft line of sound rising from (x, y): a wavering stroke that drifts up and fades (u 0 to 1 how far), for singing
function tt_song(x,px,py,tt,u,col){if(u<=0)return;x.save();x.lineCap="round";for(let k=0;k<3;k++){const v=((tt*0.4+k/3)%1),yy=py-v*220,al=u*Math.sin(Math.PI*v)*0.8;if(al<=0.01)continue;
  x.strokeStyle=rgba(col||[196,150,92],al);x.lineWidth=3.5;x.beginPath();for(let i=0;i<=30;i++){const w=i/30,xx=px-40+w*170+v*40,y2=yy-w*30+Math.sin(w*TAU*1.5+tt*3+k)*12;i?x.lineTo(xx,y2):x.moveTo(xx,y2);}x.stroke();}x.restore();}

/* ---------------------------------------------------------------- Rod and Margaret's living room, live
   The kettle, the radio and the telephone, each giving off soft rings of sound that fade before they reach Rod; Margaret's speech
   bubbles drifting to him (empty, or, once he hears, filled with soft lines of words). */
const TT_RADIO=[650,206];
// a memory's light: warm, soft at the edges
function tt_memWash(x){const g=x.createRadialGradient(960,540,320,960,540,1160);g.addColorStop(0,"rgba(250,238,218,0)");g.addColorStop(1,"rgba(236,220,196,0.88)");
  x.fillStyle=g;x.fillRect(0,0,W,H);x.fillStyle="rgba(250,238,218,0.14)";x.fillRect(0,0,W,H);}
// o.talk: Margaret talking (0 to 1); o.rings {kettle, radio, phone} 0 to 1; o.ring the telephone's own ringing; o.bubbles [{t0, fill}]: a
// bubble leaves her at t0 and reaches him 2.6 s later; o.rod, o.mag: options for each; o.turn 0 to 1 Rod turning to the telephone
function tt_homeLive(x,tt,o){o=o||{};const H_=TT_HOME,R=o.rings||{};
  tt_kettle(x,290,434,tt,{steam:R.kettle||0});tt_phone(x,H_.phone[0],H_.phone[1]+18,tt,{ring:o.ring||0});
  const talk=(o.talk||0)*(0.35+0.35*Math.sin(tt*9.3)*Math.sin(tt*3.1+1));
  tt_couple(x,tt,{mag:Object.assign({talk:Math.max(0,talk),smile:0.5,gaze:[3,0]},o.mag||{}),rod:Object.assign({gaze:[-3,0]},o.rod||{})});
  // rings of sound: from the kettle, the radio and the telephone, towards Rod, fading before they reach him
  const ear=tt_ear(H_.rod,H_.y,H_.s,true);
  if(R.kettle>0)tt_rings(x,366,368,tt,{a:R.kettle,dir:-0.7,spread:1.1,per:1.5});
  if(R.radio>0)tt_rings(x,TT_RADIO[0]+70,TT_RADIO[1],tt+0.4,{a:R.radio,dir:0.1,spread:1.1,per:1.3});
  if(R.phone>0)tt_rings(x,H_.phone[0]-50,H_.phone[1]-20,tt+0.8,{a:R.phone,dir:Math.PI*1.12,spread:1.1,per:0.9});
  // Margaret's bubbles: they leave her mouth and drift to his ear
  const m=tt_mouth(H_.mag,H_.y,H_.s,false);for(const b of (o.bubbles||[])){const u=(tt-b.t0)/2.6;if(u<=0||u>=1.15)continue;const q=ag_sine(Math.min(1,u)),
    bx=lerp(m[0]+16,ear[0]-(o.reach?285:260),q),by=lerp(m[1]-66,ear[1]-40,q)-Math.sin(Math.PI*q)*26,al=Math.min(1,u*5)*(1-clamp((u-(o.reach?0.85:0.7))/(o.reach?0.15:0.3),0,1));
    tt_bubble(x,bx,by,132,54,bx+66,by,{fill:b.fill==null?0.6:b.fill,a:al});}
  return ear;}
// Rod's head, close, facing left, for the implant and his brain doing the rest: the camera is 2.2 times closer on (1250, 420)
function tt_rodClose(x,tt,o){o=o||{};if(o.branch>0)tt_branchLight(x,1290,370,0.8,o.branch,1);
  ag_person(x,TT_ROD,1250,600,1.0,{t:tt,flip:true,covered:true,gaze:o.gaze||[-2,0],smile:o.smile||0.2,talk:o.talk||0});
  tt_implant(x,1250,600,1.0,{t:tt,wire:o.wire==null?1:o.wire,pulse:o.pulse||0,a:o.implant==null?1:o.implant});}

// ---- 1 · A rough copy: Rod, deaf, reads Margaret's lips; a hearing aid can't help; a pioneer's doubt; Clark's father; ten years and a
//          rough copy of the inner ear; August 1978; Waltzing Matilda; December; the copy was rough, his brain did the rest; 2019; the
//          same with agents; like us, and not ----
/* ---------------------------------------------------------------- today: the team at the long oak table, the agent at rest at its
   right end, the five questions on the wall above them. Each question's chapter takes its card off the wall (tt_cardFwd: forward,
   larger, the room veiled behind it) and puts it back with its tag */
const TT_SEATS=[["jun",270,false],["mei",580,false],["noor",890,false],["sam",1200,true],["yusuf",1500,true]];
const TT_REST=[1750,560,105,52];   // the agent at rest: x, y, the ring's radius, the sphere's
// a cup of coffee on the table, its foot at (x, y)
function tt_cup(ctx,x,y,s){s=s||1;ctx.save();ag_floorShadow(ctx,x+4,y+2,26*s,5*s,0.25);
  ag_soft(ctx,cc=>{cc.moveTo(x-20*s,y-36*s);cc.lineTo(x+20*s,y-36*s);cc.bezierCurveTo(x+20*s,y-10*s,x+14*s,y,x,y);cc.bezierCurveTo(x-14*s,y,x-20*s,y-10*s,x-20*s,y-36*s);cc.closePath();},[226,222,214],[250,248,244],x+8*s,y-30*s,30*s,"rgba(40,40,40,0.25)",6);
  ctx.strokeStyle="#D8D2C6";ctx.lineWidth=5*s;ctx.beginPath();ctx.arc(x+22*s,y-22*s,9*s,-Math.PI/2,Math.PI/2);ctx.stroke();
  ctx.fillStyle="#7A5A40";ctx.beginPath();ctx.ellipse(x,y-35*s,17*s,4*s,0,0,TAU);ctx.fill();ctx.restore();}
// the team: o.talk, o.gaze, o.smile, o.nod, o.pose2, o.mix, o.hold (each a list by seat: a hand that lifts something, from arms
// down), o.core and o.think for the agent
function tt_team(x,tt,o){o=o||{};const [rx,ry,R,r]=TT_REST;
  ag_loop(x,rx,ry,{t:tt,R,r,label:null,stepA:[0,0,0],core:o.core==null?0.4:o.core,think:o.think||0});
  ag_desk(x,60,1060,1800,{depth:190,th:30});
  TT_SEATS.forEach(([w,px,f],i)=>ag_person(x,w,px,740,0.5,{t:tt+px/100,flip:f,pose:o.pose2&&o.pose2[i]?"hang":null,cut:870,gaze:(o.gaze&&o.gaze[i])||[3,0],
    talk:o.talk?o.talk[i]||0:0,smile:o.smile?o.smile[i]:0.25,nod:o.nod?o.nod[i]||0:0,pose2:o.pose2?o.pose2[i]||null:null,mix:o.mix?o.mix[i]||0:0,
    hold:o.hold?o.hold[i]||null:null}));
  TT_SEATS.forEach(([w,px,f])=>tt_cup(x,px+(f?-80:80),950,1.1));}
// the room as a chapter opens or closes: the team, and the row with card i off the wall (tags: 0 to 1 for each card's tag)
function tt_roomRow(x,tt,i,tags,o){o=o||{};tt_team(x,tt,Object.assign({gaze:TT_SEATS.map(()=>[3,-1.5])},o));tt_qrow(x,{out:i,tags});ag_roomLight(x,1);}
// card i off the wall, in screen space: u 0 on the wall to 1 forward (in the middle, larger); the room veiled behind it as it comes
function tt_cardFwd(ctx,i,u,a){if(a<=0.01||u<=0)return;const w=TT_QW,h=224,q=ag_sine(clamp(u,0,1)),s=lerp(1,1.5,q),
  cx=lerp(TT_QX(i)+w/2,960,q),cy=lerp(TT_QY+h/2,470,q)-Math.sin(Math.PI*q)*40;
  tt_veil(ctx,0.72*q*a);ctx.save();ctx.globalAlpha*=a;ctx.translate(cx,cy);ctx.scale(s,s);tt_qcard(ctx,i,-w/2,-h/2,{lift:Math.min(1,u*3),pin:q<0.04,lit:q});ctx.restore();}
const tt_tagsBefore=i=>[0,1,2,3,4].map(j=>j<i?1:0);
// a chapter's first shot: the room, card i about to come forward; its last, from t0: card i goes back to the wall and its tag settles
const tt_openShot=i=>({at:0,place:"lab",keys:[[0,960,540,1]],d:2,push:0,draw:(x,tt)=>tt_roomRow(x,tt,i,tt_tagsBefore(i))});
const tt_closeShot=(i,t0)=>({at:t0,place:"lab",keys:[[t0,960,540,1]],d:2,push:0,draw:(x,tt)=>tt_roomRow(x,tt,tt<t0+1.9?i:-1,[0,1,2,3,4].map(j=>j<i?1:j===i?ag_in(tt,t0+1.9,0.5):0))});
// over the shots: card i forward as the chapter opens (it fades as the shot at t1 comes in), and back to the wall from t0
function tt_cardMoves(ctx,t,i,t1,t0){tt_cardFwd(ctx,i,tt_on(t,0.3,1.5),1-ag_in(t,t1,0.6));if(t0!=null&&t>=t0&&t<t0+1.9)tt_cardFwd(ctx,i,1-tt_on(t,t0+0.4,1.5),ag_in(t,t0,0.6));}
// a memory, full frame: the pharmacy where Graeme Clark watched his father go deaf
const tt_pharmShot=(t0,d)=>({at:t0,keys:[[t0,960,540,1.02],[t0+0.4,960,530,1.07]],d:d||5,push:0.01,draw:(x,tt)=>{x.save();x.scale(2,2);tt_pharmacy(x,960,540,tt,{});x.restore();tt_memWash(x);}});

scene("rough",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({lips:wAt(sc,"lips","lips"),voice:wAt(sc,"lips","voice"),louder:wAt(sc,"aid","louder"),
    inner:wAt(sc,"aid","inner ears"),brain:wAt(sc,"aid","brain"),voices:wAt(sc,"cut","voices"),y66:wAt(sc,"doubt","nineteen sixty-six"),sig:wAt(sc,"doubt","electric signals"),
    deaf:wAt(sc,"father","deaf"),rough:wAt(sc,"years","rough copy"),wire:wAt(sc,"implant","a fine wire"),ten:wAt(sc,"implant","ten electrodes"),pulses:wAt(sc,"implant","pulses"),
    went:wAt(sc,"august","went in"),played:wAt(sc,"sang","played"),along:wAt(sc,"sang","sang along"),words:wAt(sc,"december","words"),
    tenE:wAt(sc,"roughwas","ten electrodes"),thou:wAt(sc,"roughwas","thousands"),learned:wAt(sc,"rest","learned"),neurons:wAt(sc,"copies","neurons"),
    wrote:wAt(sc,"copies","what people wrote"),like:wAt(sc,"keep","like us"),not:wAt(sc,"keep","where they're not")}));
  const H_=TT_HOME,talkUntil=c.cut+1.5,bub=[1.4,4.6,8.2,11.6,15.6,19.4].map(t0=>({t0}));
  const homeO=tt=>({talk:ag_io(tt,0.8,talkUntil,0.5),bubbles:bub,rings:{kettle:ag_io(tt,c.cut,c.doubt+2,0.6),radio:ag_io(tt,c.cut+0.8,c.doubt+2,0.6),phone:ag_io(tt,c.cut+1.6,c.doubt+3,0.6)},
    ring:ag_io(tt,c.cut+1.6,c.doubt+3,0.3),rod:{gaze:tt>P.lips-0.2&&tt<c.aid+1?[-3,1.2]:[-3,0],smile:0.15}});
  const shots=[
    // the living room, the afternoon: she talks, he watches her lips; then wide, the kettle, the radio and the telephone
    {at:0,place:"tt_home",keys:[[0,1000,560,1.1],[c.cut-0.6,960,540,1.0]],d:7,push:0,draw:(x,tt)=>{tt_homeLive(x,tt,homeO(tt));
      const m=tt_mouth(H_.mag,H_.y,H_.s,false);tt_lips(x,m[0],m[1],H_.s,ag_io(tt,P.lips-0.2,c.aid+0.6,0.4));}},
    {cut:true,at:c.change-0.6,place:"tt_home",keys:[[c.change-0.6,960,540,1.0],[c.change-0.2,1500,400,1.5]],d:2.4,push:0.01,draw:(x,tt)=>tt_homeLive(x,tt,homeO(tt))},
    // a memory rises over the window: a small-town pharmacy (drawn as a soft card, in the screen's space)
    tt_pharmShot(c.father-0.3),
    {at:c.years-0.4,place:"tt_lab78",keys:[[c.years-0.4,960,560,1.04],[c.years,980,560,1.08]],d:6,push:0.01,draw:(x,tt)=>{
      tt_trolley(x,1060,560,{lit:0,reel:1});ag_person(x,TT_ENG2,1500,664,0.86,{t:tt+2,flip:true});
      ag_person(x,TT_CLARK,560,640,0.92,{t:tt,talk:0.4*ag_io(tt,c.years,c.implant+3,0.5)});ag_person(x,TT_ENG1,920,664,0.86,{t:tt+1,flip:true});}},
    // the rough copy of the inner ear: the spiral in a cutaway, its thousands of cells drawn faint; the wire winds in, ten rings settle
    {at:P.rough-0.3,place:"tt_labQuiet",keys:[[P.rough-0.3,960,520,1.0],[P.rough,960,500,1.04]],d:8,push:0.01,draw:(x,tt)=>{
      tt_spiral(x,960,500,330,{dots:0.55,wire:tt_on(tt,P.wire-0.2,2.4),rings:clamp((tt-P.ten+0.2)/0.35,0,10)});}},
    // 1 August 1978: the theatre's doors; then Rod's head, the implant under the skin behind his ear, the wire curling inwards
    {at:c.august-0.3,place:"tt_corridor",keys:[[c.august-0.3,960,540,1.0],[c.august,960,520,1.06]],d:4,push:0.01,draw:(x,tt)=>tt_theatreSign(x,1)},
    {cut:true,at:P.went-0.1,place:"tt_corridor",keys:[[P.went-0.1,1250,420,2.2]],d:3,push:0.02,draw:(x,tt)=>tt_rodClose(x,tt,{wire:tt_on(tt,P.went+0.2,1.6),smile:0.1})},
    // the lab: Rod in a chair with the coil behind his ear; the engineer starts the tape; ten lights, one after another; Rod sings
    {cut:true,at:c.sang-0.5,place:"tt_lab78",keys:[[c.sang-0.5,980,560,1.06],[P.along,900,520,1.14]],d:3,push:0.01,draw:(x,tt)=>{const lit=clamp((tt-P.played)/0.22,0,10),sing=ag_in(tt,P.along-0.1,0.5);
      tt_trolley(x,1060,560,{lit,reel:1});tt_chair(x,820,700,0.85);
      ag_person(x,TT_ROD,820,700,0.85,{t:tt,flip:true,talk:sing*(0.4+0.3*Math.sin(tt*6)),smile:lerp(0.1,0.9,ag_in(tt,P.played+1.6,0.8)),gaze:[-2,-0.6]});tt_coil(x,820,700,0.85,1080,640);
      ag_person(x,TT_ENG1,1520,664,0.86,{t:tt+1,flip:true});ag_person(x,TT_CLARK,330,660,0.9,{t:tt+2,smile:0.6*ag_in(tt,P.along,1)});
      const m=tt_mouth(820,700,0.85,true);tt_song(x,m[0]-210,m[1]-30,tt,sing,[196,150,92]);
      tt_tag(x,1210,470,"Waltzing Matilda",{a:ag_in(tt,c.sang,0.4),size:28});}},
    // December 1978: the audiologist hides her mouth behind a card (held before her face: front, not hold) and says a word; Rod says it back
    // (a later moment in the same room, later:true: the summer's people leave, then December's come in)
    {later:true,at:c.december-0.3,place:"tt_lab78",keys:[[c.december-0.3,960,560,1.1],[c.december,960,540,1.16]],d:4,push:0.01,draw:(x,tt)=>{
      tt_chair(x,1260,700,0.85);ag_person(x,TT_ROD,1260,700,0.85,{t:tt,flip:true,talk:0.5*ag_io(tt,P.words+0.9,P.words+2.2,0.2),smile:0.6,gaze:[-3,0]});
      ag_person(x,TT_AUD,640,690,0.86,{t:tt+1,pose:"hold",talk:0.5*ag_io(tt,P.words-0.4,P.words+0.6,0.2),front:(c2,h)=>{const n=h.near;ag_box(c2,n[0]-10,n[1]-310,200,290,10,{});}});
      tt_bubble(x,840,300,170,64,920,300,{a:ag_io(tt,P.words-0.3,P.words+1.0,0.3),fill:0.9});tt_bubble(x,1000,280,170,64,1080,280,{a:ag_io(tt,P.words+0.9,P.words+2.6,0.3),fill:0.9});}},
    // the copy was rough: the spiral again, its thousands of cells bright beside the ten blue rings
    {at:c.roughwas-0.3,place:"tt_labQuiet",keys:[[c.roughwas-0.3,960,500,1.04],[c.roughwas,960,520,1.0]],d:6,push:0.01,draw:(x,tt)=>{
      tt_spiral(x,960,500,330,{dots:1,bright:tt_on(tt,P.thou-0.2,1.2),wire:1,rings:10,lit:clamp((tt-P.tenE+0.2)/0.12,0,10)});}},
    // Rod's brain did the rest: warm light branching behind his head from the ten pulses
    {at:c.rest-0.3,place:"tt_home",keys:[[c.rest-0.3,1250,420,2.2]],d:3,push:0.03,draw:(x,tt)=>tt_rodClose(x,tt,{branch:tt_on(tt,c.rest+0.2,3.6),pulse:1,smile:0.5})},
    // 2019: a pale map of the world, and lights spreading across it
    {at:c.y2019-0.3,place:"tt_labQuiet",keys:[[c.y2019-0.3,960,520,1.0],[c.y2019,960,500,1.04]],d:6,push:0.01,draw:(x,tt)=>tt_worldMap(x,180,170,1560,tt_on(tt,c.y2019,4.6))},
    // the same with agents: the spiral dissolves into the agent's sphere in its ring; neurons in its band, pages flowing in
    {at:c.same-0.3,dis:0.9,place:"lab",keys:[[c.same-0.3,1124,500,1.12],[c.copies,1060,520,1.0]],d:2.6,push:0.01,draw:(x,tt)=>{const [rx,ry]=[1124,476],u=tt_on(tt,c.same+0.2,1.6);
      if(u<1)tt_spiral(x,rx,ry,lerp(200,90,u),{dots:0.8,wire:1,rings:10,a:1-u});
      ag_loop(x,rx,ry,{t:tt,a:u,label:null,stepA:[0,0,0],core:u});tt_roughCopy(x,rx,ry,88,tt,{a:u,neurons:ag_in(tt,P.neurons-0.2,0.8),pages:ag_in(tt,P.wrote-0.3,0.8)});
      ag_roomLight(x,1);
      const L=tt_pop(tt,P.like),N=tt_pop(tt,P.not);tt_tag(x,rx-420,ry-40,"like us",{a:L.a,k:L.k,col:AG.green});tt_tag(x,rx-420,ry+60,"not like us",{a:N.a,k:N.k,col:AG.amber});}}];
  // the window and the memory: a camera move inside the first shot (to the window at "change"), then the pharmacy card
  ag_shots(ctx,S,t,sc.dur,shots,0.6);setScreen(ctx,S);
  // over the living room: the hearing-aid card, then in 1966 the pulses and the doubt, the 'foreign language' tag
  const card=ag_io(t,c.aid-0.5,c.cut-0.2,0.5)+ag_io(t,c.doubt-0.3,c.change-0.3,0.5),cp=clamp((t-c.aid+0.2)/5.0,0,1);
  if(card>0.01){ctx.save();ctx.translate(70,60);ctx.scale(0.82,0.82);tt_aidCard(ctx,0,0,t,{a:card,p:t<c.doubt-0.4?cp:1,pulses:ag_in(t,P.sig-0.4,0.6),q:ag_in(t,c.foreign+0.4,0.6)});ctx.restore();
    tt_tag(ctx,812,262,"‘foreign language’",{a:card*ag_in(t,c.foreign-0.1,0.4),k:clamp(ag_spr(t,c.foreign-0.1,0.8),0,1.2),size:28});}
  // the memory: a small-town pharmacy, a man cupping his ear, a customer leaning in, a boy watching
    // the corner: the place and year of each scene
  tt_cornerAt(ctx,t,"Melbourne, Australia · 1978",1.6,c.doubt-0.4);tt_cornerAt(ctx,t,"1966",P.y66-0.2,c.change-0.4);
  tt_cornerAt(ctx,t,"1967–1977",c.years-0.2,c.august-0.4);tt_cornerAt(ctx,t,"1 August 1978",c.august-0.1,c.sang-0.5);tt_cornerAt(ctx,t,"December 1978",c.december-0.1,c.roughwas-0.4);
  // the copy's two tags, and the 'foreign language' tag that fades as his brain learns it; 2019's count
  const tg=ag_io(t,P.thou-0.2,c.rest-0.4,0.4);if(tg>0.01){tt_tag(ctx,1420,250,"thousands of cells",{a:tg,k:clamp(ag_spr(t,P.thou-0.2,0.8),0,1.2)});tt_tag(ctx,1420,760,"10 electrodes",{a:ag_io(t,P.tenE-0.1,c.rest-0.4,0.4),col:AG.blue});}
  const fl=ag_io(t,c.rest-0.2,P.learned+0.6,0.4);if(fl>0.01)tt_tag(ctx,700,200,"‘foreign language’",{a:fl*(1-ag_in(t,P.learned,1.2))});
  const yt=ag_io(t,c.y2019+0.3,c.same-0.4,0.4);if(yt>0.01)tt_tag(ctx,960,820,"2019 · more than 700,000 implants",{a:yt,k:clamp(ag_spr(t,c.y2019+0.3,0.8),0,1.2)});
  ag_title(ctx,S,t,c.breath,TT_TITLE,"five open questions","FILM 8 OF 9 · WHAT AN AGENT IS");});

scene("five",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({counted:wAt(sc,"counted","counted"),query:wAt(sc,"counted","query"),checked:wAt(sc,"signed","checked"),
    signed:wAt(sc,"signed","signed"),noans:wAt(sc,"noanswer","no answer")}));
  const ask=[c.jun,c.mei,c.noor,c.sam,c.yusuf].map(v=>v+0.5),A={x:300,y:120,w:500},RG=[1480,430];
  const shots=[
    // the answer comes out of the agent with its evidence; Mei checks it and signs at its foot
    {at:0,place:"lab",keys:[[0,1180,470,1.16],[c.counted-0.6,960,520,1.0]],d:2.8,push:0.01,draw:(x,tt)=>{const out=tt_on(tt,P.counted-0.2,1.1);
      ag_loop(x,RG[0],RG[1],{t:tt,R:170,r:83,label:null,stepA:[0,0,0],think:ag_io(tt,c.counted-0.2,P.counted+0.6,0.3)});
      ag_desk(x,180,1060,1000,{depth:190,th:30});
      ag_person(x,"mei",980,770,0.72,{t:tt,flip:true,cut:870,gaze:tt>c.signed-0.6?[3,-2.2]:[2,-1],nod:0.05*ag_io(tt,P.signed,P.signed+1.2,0.3)});
      if(out>0)ag_evidence(x,lerp(RG[0]-A.w/2,A.x,out),lerp(RG[1]-104,A.y,out),A.w,{title:"18,412 students",sub:"this term"},[{title:"the query",col:AG.orange}],
        {side:"right",ew:300,open:clamp((tt-P.query+0.1)/1.2,0,1),k:clamp(ag_spr(tt,P.counted-0.2,0.8),0,1.2),a:ag_in(tt,P.counted-0.2,0.3)});
      const so=ag_in(tt,c.signed+0.2,0.5);if(so>0.01)tt_signoff(x,A.x,A.y+232+20*(1-so),A.w,clamp((tt-P.checked)/(P.signed+0.9-P.checked),0,1),so);
      ag_roomLight(x,1);}},
    // over coffee: each question rises from the one who asks it and pins itself to the wall, in a row (a later moment: Mei and her
    // cards leave, then the team comes in)
    {later:true,at:c.coffee-0.4,place:"lab",keys:[[c.coffee-0.4,960,620,1.14],[c.coffee,960,540,1.0]],d:2.6,push:0,draw:(x,tt)=>{
      const cur=ask.reduce((k,a,i)=>tt>=a-0.5?i:k,-1),talk=ask.map((a,i)=>0.45*ag_io(tt,a-0.5,a+1.7,0.25)*(0.55+0.45*Math.sin(tt*8.7+i)));
      tt_team(x,tt,{talk,gaze:TT_SEATS.map((_,i)=>i===cur?[3,-2.5]:[3,0]),smile:TT_SEATS.map((_,i)=>i===cur?0.5:0.25)});
      ask.forEach((a,i)=>{const u=clamp((tt-a)/1.5,0,1);if(u<=0)return;const q=ag_sine(u),px=TT_SEATS[i][1];
        tt_qcard(x,i,lerp(px-TT_QW/2,TT_QX(i),q),lerp(470,TT_QY,q)-Math.sin(Math.PI*q)*30,{k:clamp(ag_spr(tt,a,0.9),0,1.2),lift:1-ag_in(tt,a+1.3,0.4),
          lit:ag_io(tt,a,(ask[i+1]||P.noans)-0.3,0.4),a:ag_in(tt,a,0.3),pin:u>0.92});});
      const oq=ag_in(tt,P.noans,0.5);if(oq>0.01)tt_tag(x,960,440,"open questions",{a:oq,k:clamp(ag_spr(tt,P.noans,0.8),0,1.2)});
      ag_roomLight(x,1);}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.7);setScreen(ctx,S);
  tt_cornerAt(ctx,t,"Today",c.today-0.2,sc.dur-0.8);});

scene("taught",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({rough:wAt(sc,"perceptron","rough copy"),sense:wAt(sc,"senses","senses"),rem:wAt(sc,"senses","remembers"),
    act:wAt(sc,"senses","acts"),guess:wAt(sc,"descend","guessing"),predict:wAt(sc,"friston","predict"),errors:wAt(sc,"friston","errors"),ten:wAt(sc,"rods","ten rough signals"),
    voices:wAt(sc,"rods","voices"),next:wAt(sc,"levels","the next word"),story:wAt(sc,"levels","where the story"),five:wAt(sc,"cell","five to eight"),nk:wAt(sc,"nobody","nobody knows"),
    end:sc.dur-2.8}));
  const words=["Once","upon","a","time,","in","a","town","by","the","sea,","there","lived","a","girl","who","kept","a","lighthouse,","and","every","night","she"];
  const lt0=c.y2022+0.9,rodE=tt_ear(1250,700,0.85,true);
  const shots=[
    tt_openShot(0),
    // Buffalo, 1958: a man at a desk with papers, and on his page a neuron beside its copy
    {at:c.perceptron-0.5,place:"tt_office58",keys:[[c.perceptron-0.5,960,540,1.04],[c.perceptron,960,520,1.08]],d:5,push:0.01,draw:(x,tt)=>{
      tt_oldDesk(x,560,880,800,{});ag_person(x,TT_ROSEN,960,574,0.8,{t:tt,cut:790,gaze:[0,2.5]});}},
    {cut:true,at:P.rough-0.5,place:"tt_office58",keys:[[P.rough-0.5,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{tt_wash(x,0.4,{c:[60,48,36]});tt_page(x,300,160,1320,680,{rot:-0.012});
      tt_neuron(x,600,480,0.9,{grow:tt_on(tt,P.rough-0.3,1.6),fire:ag_io(tt,P.sense,P.act+1.2,0.4)});
      tt_perceptron(x,1190,480,1.15,{p:tt_on(tt,P.rough+0.9,1.6),fire:ag_io(tt,P.act-0.1,c.descend-0.6,0.3)});
      const tg=(w,at,X,Y)=>{const q=tt_pop(tt,at);tt_tag(x,X,Y,w,{a:q.a,k:q.k});};tg("sense",P.sense-0.1,1190-253,300);tg("remember",P.rem-0.1,1190-161,670);tg("act",P.act-0.1,1190+265,570);}},
    // today's models descend from it: the copy multiplies into a lattice that becomes the agent's band; words come out, each guessed first
    {at:c.descend-0.4,place:"lab",keys:[[c.descend-0.4,1060,500,1.06],[c.descend+3,960,540,1.0]],d:3,push:0,draw:(x,tt)=>{const [rx,ry]=[1124,476],g=tt_on(tt,c.descend+2.4,1.4);
      ag_loop(x,rx,ry,{t:tt,think:0.4+0.4*g,label:null,stepA:[0,0,0]});tt_lattice(x,520,430,640,380,tt_on(tt,c.descend,2.4),g,{bx:rx,by:ry,a:1-ag_in(tt,c.descend+3.6,0.6)});
      ag_roomLight(x,1);const w0=P.guess+0.2;tt_wordRow(x,["The","census","counts","every","student"],240,800,tt,{at:[w0,w0+0.55,w0+1.1,w0+1.65,w0+2.2]});}},
    // 2022: a person listening; a soft violet guess lights just before each word arrives
    {at:c.y2022-0.4,place:"tt_labQuiet",keys:[[c.y2022-0.4,960,540,1.0]],d:2,push:0.015,draw:(x,tt)=>{
      ag_person(x,TT_LISTEN,560,640,1.05,{t:tt,covered:true,gaze:[3,0]});const la=1-ag_in(tt,c.friston,0.6);
      const g=tt_listen(x,words,880,700,430,tt,lt0,{a:la});tt_headGuess(x,590,410,140,g*la);
      const lp=tt_on(tt,c.friston+0.3,1.6);if(lp>0)tt_miniLoop(x,1280,430,170,{p:lp,a:ag_in(tt,c.friston+0.2,0.4),lit:tt>P.errors?2:tt>P.predict+0.6?1:0});}},
    // Rod in 1978: ten rough signals, settling into the voice he remembers
    {at:c.rods-0.4,place:"tt_lab78",keys:[[c.rods-0.4,1000,540,1.04],[c.rods,1000,520,1.08]],d:5,push:0.01,draw:(x,tt)=>{
      tt_chair(x,1250,700,0.85);ag_person(x,TT_ROD,1250,700,0.85,{t:tt,flip:true,gaze:[-3,-0.5],smile:0.2+0.4*ag_in(tt,P.voices,1)});tt_coil(x,1250,700,0.85,1760,620);
      const mk=ag_in(tt,P.ten-0.3,0.8),glow=ag_in(tt,P.voices-0.2,1.2);
      if(mk>0.01){tt_glow(x,570,360,300,0.5*glow,TT_WARM);tt_memory(x,330,200,480,320,"margaret",(c2,w,h)=>{c2.drawImage(ag_place("tt_home"),-380,-300);
        ag_person(c2,TT_MARGARET,w*0.42,h*1.05,0.95,{t:tt+1,covered:true,talk:0.3*(0.5+0.5*Math.sin(tt*7)),smile:0.6,gaze:[3,0]});},{a:mk});}
      for(let i=0;i<10;i++){const u=(tt-P.ten-i*0.14)/1.3;if(u<=0||u>=1.1)continue;const q=ag_sine(Math.min(1,u)),px=lerp(rodE[0],760,q),py=lerp(rodE[1],380,q)-Math.sin(Math.PI*q)*170,
        al=Math.min(1,u*6)*(1-clamp((u-0.85)/0.25,0,1));x.save();x.shadowColor=rgba(AG.blue,0.8);x.shadowBlur=10;x.fillStyle=rgba(AG.blue,al);x.beginPath();x.arc(px,py,9,0,TAU);x.fill();x.restore();}}},
    // the copy stops somewhere: a brain guesses at many levels at once
    {at:c.stops-0.4,place:"tt_labQuiet",keys:[[c.stops-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{
      ag_person(x,TT_LISTEN,560,640,1.05,{t:tt,covered:true,gaze:[3,0]});tt_headGuess(x,590,410,140,0.5+0.3*Math.sin(tt*3));
      tt_levels(x,860,330,tt,{rows:[ag_in(tt,P.next-0.2,0.5),ag_in(tt,P.next+0.9,0.5),ag_in(tt,P.story-0.2,0.5)]});}},
    // one kind of brain cell, and the network it took to imitate it
    {at:c.cell-0.4,place:"tt_labQuiet",keys:[[c.cell-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{
      tt_neuron(x,600,440,0.95,{grow:tt_on(tt,c.cell,1.6)});tt_layers(x,1090,430,5+3*tt_on(tt,P.five+0.4,1.8),{a:ag_in(tt,P.five-0.4,0.5)});
      const q=tt_pop(tt,P.five+0.6);tt_tag(x,960,820,"1 brain cell · a network 5 to 8 layers deep",{a:q.a,k:q.k});}},
    // how a brain learns from its errors: the loop's way back turns to a dotted line, and a question mark
    {at:c.nobody-0.4,place:"tt_labQuiet",keys:[[c.nobody-0.4,960,540,1.0]],d:2,push:0.015,draw:(x,tt)=>tt_miniLoop(x,960,460,190,{p:1,dotted:tt_on(tt,P.nk-0.4,1.2)})},
    tt_closeShot(0,P.end)];
  ag_shots(ctx,S,t,sc.dur,shots,0.7);setScreen(ctx,S);
  tt_cardMoves(ctx,t,0,c.perceptron-0.5,P.end);
  tt_cornerAt(ctx,t,"Buffalo, New York · 1958",c.perceptron-0.1,c.descend-0.6);tt_cornerAt(ctx,t,"2022 · 9 people · a podcast",c.y2022-0.1,c.friston-0.2);
  const pc=ag_io(t,P.predict-0.2,c.rods-0.6,0.4);if(pc>0.01)tt_tag(ctx,1280,700,"predict · compare · learn",{a:pc,k:clamp(ag_spr(t,P.predict-0.2,0.8),0,1.2)});});

scene("mixing",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({whatever:wAt(sc,"lovelace","whatever"),combining:wAt(sc,"ways","combining"),exploring:wAt(sc,"ways","exploring"),
    changing:wAt(sc,"ways","changing"),mcomb:wAt(sc,"model","combine"),mexpl:wAt(sc,"model","explore"),life:wAt(sc,"brings","a life"),intention:wAt(sc,"brings","an intention"),
    reasonW:wAt(sc,"brings","a reason"),notsci:wAt(sc,"science","not for science"),mean:wAt(sc,"choice","what we mean"),achoice:wAt(sc,"choice","a choice"),end:sc.dur-2.8,three:wAt(sc,"boden","three ways")}));
  const H0=c.others+0.15,seg=[[H0,H0+1.4],[H0+1.75,H0+2.85],[H0+3.2,H0+4.3]];
  const shots=[tt_openShot(1),
    // the agent writes a short poem: each word made of small pages that stream into the ring and come out as words
    {cut:true,at:2.4,place:"lab",keys:[[2.4,1000,500,1.04]],d:2,push:0.012,draw:(x,tt)=>{const [rx,ry]=[1124,476];ag_loop(x,rx,ry,{t:tt,think:0.8,label:null,stepA:[0,0,0]});
      tt_roughCopy(x,rx,ry,88,tt,{pages:1,neurons:0,from:"right"});ag_roomLight(x,1);tt_poem(x,180,330,tt,3.0,{src:[rx-60,ry],rate:0.2});}},
    // a grandmother draws a house and passes the pencil; a parent adds a tree; a child adds a sun with a face no one else would have drawn
    {at:c.others-0.4,place:"tt_tableTop",keys:[[c.others-0.4,960,520,1.0]],d:2,push:0.02,draw:(x,tt)=>{
      tt_page(x,560,190,800,640,{rot:0.02,rules:false});const pr=k=>tt_on(tt,seg[k][0],seg[k][1]-seg[k][0]),tip=tt_drawing(x,980,560,1.0,pr(0),pr(1),pr(2));
      const hand=(k,first,last,ang,s,o)=>{const [a,b]=seg[k],io=ag_io(tt,a-0.5,b+0.25,0.45);if(io<=0.01)return;const p=tt>=a&&tt<=b&&tip?tip:tt<a?first:last,d=760*(1-io);
        tt_handTop(x,p[0]+Math.cos(ang)*d,p[1]+Math.sin(ang)*d,ang,s,o);};
      hand(0,[680,550],[698,574],-2.4,1.0,{age:1,sleeve:[120,110,130],skin:[228,194,170]});
      hand(1,[1010,680],[1020,606],0.15,1.0,{sleeve:[90,110,130],skin:[200,150,116]});
      hand(2,[1230,452],[1305,450],1.25,0.72,{sleeve:[200,120,90],skin:[236,204,178]});}},
    // England, 1843: Lovelace writing her notes, a drawing of the engine's columns of gears beside her
    {at:c.lovelace-0.4,place:"tt_room1843",keys:[[c.lovelace-0.4,960,560,1.06],[c.lovelace,960,540,1.0]],d:4,push:0.01,draw:(x,tt)=>{
      tt_engine(x,150,150,360,300,{turn:tt});tt_oldDesk(x,560,880,760,{});ag_person(x,TT_ADA,940,574,0.8,{t:tt,cut:790,gaze:[0,2.5]});
      const q=tt_pop(tt,P.whatever-0.2);tt_quote(x,600,110,"‘whatever we know how to order it to perform’","Ada Lovelace",{w:720,a:q.a,k:q.k});}},
    // Boden's three ways; the agent's violet lines rearrange inside the first two
    {at:c.boden-0.4,place:"tt_labQuiet",keys:[[c.boden-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{
      [["combine",P.combining,P.mcomb],["explore",P.exploring,P.mexpl],["rules",P.changing,null]].forEach(([k,at,vat],i)=>{const q=tt_pop(tt,P.three+i*0.3);
        tt_bodenCard(x,k,150+i*570,250,480,tt_on(tt,at+0.1,1.6),vat?ag_in(tt,vat-0.1,0.8):0,{a:q.a,k:q.k});});}},
    // what a person brings: a life, an intention, a reason
    {at:c.brings-0.4,place:"lab",keys:[[c.brings-0.4,1060,540,1.0]],d:2,push:0.015,draw:(x,tt)=>{tt_glow(x,980,420,520,0.5*ag_in(tt,P.life-0.3,1.2),TT_WARM);
      ag_person(x,"mei",1480,620,0.92,{t:tt,flip:true,gaze:[3,-1],smile:0.35});
      [["a life",P.life],["an intention",P.intention],["a reason",P.reasonW]].forEach(([w,at],i)=>{const q=tt_pop(tt,at-0.15);
        if(q.a>0.01)ag_textCard(x,780,170+i*160+30*(1-ag_sine(clamp((tt-at+0.15)/0.8,0,1))),380,{title:w},{a:q.a,k:q.k});});
      ag_roomLight(x,1);}},
    tt_pharmShot(c.reason-0.4,4),
    // Boden's answer
    {at:c.science-0.4,place:"tt_labQuiet",keys:[[c.science-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{const X=430,Y=220,Wd=1060;
      ag_box(x,X,Y,Wd,400,26,{});ag_T(x,"whether a computer could really be creative",X+56,Y+92,{w:700,size:40});
      x.strokeStyle="rgba(60,50,40,0.14)";x.lineWidth=1.5;x.beginPath();x.moveTo(X+56,Y+134);x.lineTo(X+Wd-56,Y+134);x.stroke();
      [["not for science alone",P.notsci],["partly what we mean",P.mean],["partly a choice",P.achoice]].forEach(([w,at],i)=>{const v=ag_in(tt,at-0.15,0.45);if(v<=0.01)return;
        const yy=Y+200+i*70;x.save();x.globalAlpha*=v;x.fillStyle=rgba(AG_OAK.dark,1);x.beginPath();x.arc(X+70,yy-11,7,0,TAU);x.fill();x.restore();
        ag_T(x,w,X+96+16*(1-v),yy,{w:600,size:34,a:v});});}},
    tt_closeShot(1,P.end)];
  ag_shots(ctx,S,t,sc.dur,shots,0.7);setScreen(ctx,S);tt_cardMoves(ctx,t,1,2.4,P.end);
  tt_cornerAt(ctx,t,"England · 1843",c.lovelace-0.1,c.boden-0.5);tt_cornerAt(ctx,t,"1990 · Margaret Boden",c.boden-0.1,c.brings-0.5);});

scene("wire",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({w302:wAt(sc,"worm","three hundred and two"),wrig:wAt(sc,"wriggles","wriggles"),notmuch:wAt(sc,"wriggles","not much more"),
    map:wAt(sc,"wriggles","a map"),how:wAt(sc,"wriggles","how each"),n139:wAt(sc,"fly","a hundred and thirty-nine"),sugar:wAt(sc,"sugar","sugar"),predicted:wAt(sc,"sugar","predicted"),
    b86:wAt(sc,"billion","eighty-six billion"),madefor:wAt(sc,"speech","made for speech"),music:wAt(sc,"speech","music"),rain:wAt(sc,"searle","simulated rainstorm"),
    mind:wAt(sc,"others","a mind is"),nobody:wAt(sc,"who","Nobody knows"),end:sc.dur-2.8}));
  const H_=TT_HOME;
  const shots=[tt_openShot(2),
    // a worm a millimetre long, drawn large, its 302 neurons inside it
    {at:c.worm-0.4,place:"tt_tableTop",keys:[[c.worm-0.4,960,480,1.0],[c.worm,960,470,1.1]],d:4,push:0.01,draw:(x,tt)=>{tt_worm(x,960,470,1200,tt,{});
      const q=tt_pop(tt,P.w302-0.1);tt_tag(x,960,800,"302 neurons · 1986",{a:q.a,k:q.k});}},
    // its copy on a computer: it wriggles, but not much more
    {at:c.openworm-0.4,place:"lab",keys:[[c.openworm-0.4,960,540,1.0]],d:2,push:0.015,draw:(x,tt)=>{ag_desk(x,260,1060,1400,{depth:300,th:30});
      ag_screen(x,560,250,800,500,{stand:60,draw:(c2,X,Y,w,h)=>tt_worm(c2,X+w/2,Y+h/2,w*0.8,tt,{blue:1})});ag_roomLight(x,1);
      const a1=tt_pop(tt,P.wrig-0.3),a2=tt_pop(tt,P.notmuch-0.2);tt_tag(x,1600,420,"wriggles",{a:a1.a,k:a1.k});tt_tag(x,1600,520,"much more · not yet",{a:a2.a,k:a2.k});}},
    // a map doesn't say how each connection works, or when
    {at:P.how-0.5,place:"tt_labQuiet",keys:[[P.how-0.5,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{tt_wireMap(x,960,430,1400,560,{draw:tt_on(tt,P.how-0.4,1.2),dials:tt_on(tt,P.how+0.6,1.2)});
      const q=tt_pop(tt,P.how+1.0);tt_tag(x,960,800,"how strong? when?",{a:q.a,k:q.k});}},
    // 2024: a fly, and its whole brain's map
    {at:c.fly-0.4,place:"tt_labQuiet",keys:[[c.fly-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{tt_fly(x,960,500,0.55,{t:tt});
      tt_flyBrain(x,960,240,520,{lit:0,a:ag_in(tt,c.fly+0.8,1.0)});const q=tt_pop(tt,P.n139-0.1);tt_tag(x,1480,240,"139,255 neurons",{a:q.a,k:q.k});}},
    // sugar: in the model of the map a path of neurons lights, and in the real fly's brain the same ones
    {at:c.sugar-0.4,place:"tt_labQuiet",keys:[[c.sugar-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{tt_fly(x,880,560,0.5,{t:tt});tt_drop(x,1040,600,34,ag_in(tt,P.sugar-0.4,0.5));
      tt_flyBrain(x,560,300,460,{lit:tt_on(tt,P.sugar+0.4,1.2)});tt_flyBrain(x,1360,300,460,{blue:1,lit:tt_on(tt,P.predicted,1.2)});
      const tk=ag_in(tt,P.sugar+1.4,0.4);if(tk>0.01)ag_tick(x,960,250,40*clamp(ag_spr(tt,P.sugar+1.4,0.6),0,1.2),rgba(AG.green,tk),6);}},
    // we have about 86 billion: the fly's map shrinks to a dot beside a human head
    {at:c.billion-0.4,place:"tt_labQuiet",keys:[[c.billion-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{const u=tt_on(tt,c.billion-0.3,1.3);
      if(u<1)tt_flyBrain(x,lerp(960,640,u),lerp(300,560,u),lerp(460,14,u),{lit:1,a:1-0.6*u});
      tt_headOutline(x,1100,430,620,{fill:ag_in(tt,P.b86-0.3,1.4),a:ag_in(tt,c.billion,0.8)});
      if(u>0.8){tt_glow(x,640,560,30,ag_in(tt,c.billion+0.8,0.4),[255,200,160]);x.fillStyle=rgba([206,104,84],1);x.beginPath();x.arc(640,560,7,0,TAU);x.fill();}
      const q=tt_pop(tt,P.b86);tt_tag(x,1100,820,"about 86 billion",{a:q.a,k:q.k});}},
    // a copy can act like us without working like us: Rod's implant was made for speech; music comes through blurred
    {at:c.act-0.4,place:"tt_home",keys:[[c.act-0.4,960,540,1.0],[c.ear,1050,480,1.12]],d:3,push:0.01,draw:(x,tt)=>{
      tt_homeLive(x,tt,{talk:ag_io(tt,c.act,c.speech+1.2,0.5),bubbles:[0.3,3.3,6.3,9.3,12.3].map(v=>({t0:c.act+v,fill:0.8})),reach:true,rod:{gaze:[-3,0],smile:0.45}});
      tt_implant(x,H_.rod,H_.y,H_.s,{t:tt,pulse:1});
      const nb=ag_io(tt,P.music-0.4,c.exactly-0.3,0.4);if(nb>0.01){tt_rings(x,TT_RADIO[0]+70,TT_RADIO[1],tt,{a:nb*0.7,dir:0.1,spread:1.1,per:1.3});tt_notes(x,700,230,1180,380,tt,{a:nb,blur:1});}
      const q=tt_pop(tt,P.madefor-0.1);tt_tag(x,1500,180,"made for speech",{a:q.a,k:q.k});}},
    // 1980: a simulated rainstorm, and a man in front of it, dry
    {at:c.exactly-0.4,place:"lab",keys:[[c.exactly-0.4,960,540,1.0]],d:2,push:0.015,draw:(x,tt)=>{
      ag_screen(x,420,170,900,560,{stand:0,draw:(c2,X,Y,w,h)=>tt_rain(c2,X,Y,w,h,tt)});ag_person(x,TT_SEARLE,1500,600,1.0,{t:tt,flip:true,gaze:[3,-0.5]});ag_roomLight(x,1);
      const q=tt_pop(tt,P.rain-0.2);tt_tag(x,870,800,"a simulated rainstorm · nobody gets wet",{a:q.a,k:q.k});}},
    // the other side comes down to balance it; nobody knows who's right
    {at:c.others-0.4,place:"tt_labQuiet",keys:[[c.others-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{const rIn=ag_in(tt,P.mind-0.3,0.6),
      tilt=lerp(lerp(-0.16,0.05,ag_sine(tt_on(tt,P.mind,1.2))),0,ag_sine(tt_on(tt,P.nobody,1.6)));
      tt_balance(x,960,230,1100,tilt,{title:"a simulated rainstorm",sub:"nobody gets wet"},{title:"a mind is what a brain does"},{cw:560,post:420,ca:[1,rIn],k:[null,clamp(ag_spr(tt,P.mind-0.3,0.8),0,1.2)]});}},
    tt_closeShot(2,P.end)];
  ag_shots(ctx,S,t,sc.dur,shots,0.7);setScreen(ctx,S);tt_cardMoves(ctx,t,2,c.worm-0.4,P.end);
  tt_cornerAt(ctx,t,"since 2011",c.openworm-0.1,P.how-0.6);tt_cornerAt(ctx,t,"2024",c.fly-0.1,c.billion-0.5);tt_cornerAt(ctx,t,"1980 · John Searle",c.exactly-0.1,c.others-0.5);});

scene("feels",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({one:wAt(sc,"one","work as one"),news:wAt(sc,"another","news shared"),chal:wAt(sc,"test","challenged"),
    hard:wAt(sc,"chalmers","the hard problem"),phys:wAt(sc,"why","physical"),rich:wAt(sc,"why","rich inner life")}));
  const H_=TT_HOME;
  const shots=[tt_openShot(3),
    // Rod and Margaret, close: pulses run along the wire; the implant hears nothing; Rod does, and laughs at what she says
    {at:c.pulses-0.4,place:"tt_home",keys:[[c.pulses-0.4,960,440,1.42],[c.pulses,960,430,1.5]],d:4,push:0.01,draw:(x,tt)=>{
      tt_glow(x,960,410,360,0.75*ag_in(tt,c.roddid-0.1,1.4),TT_WARM);
      const laugh=ag_io(tt,c.roddid+0.3,c.chalmers,0.3);
      tt_homeLive(x,tt,{talk:ag_io(tt,c.pulses-0.4,c.roddid+0.4,0.4),bubbles:[0.2,3.0,5.8].map(v=>({t0:c.pulses+v,fill:0.8})),reach:true,
        rod:{gaze:[-3,0],smile:lerp(0.25,1,ag_in(tt,c.roddid+0.1,0.6)),talk:laugh*(0.35+0.3*Math.abs(Math.sin(tt*11))),nod:0.04*laugh*Math.sin(tt*9)},mag:{smile:lerp(0.5,0.9,laugh)}});
      tt_implant(x,H_.rod,H_.y,H_.s,{t:tt,pulse:ag_in(tt,c.pulses+0.6,0.5)});}},
    // 1995, the hard problem: a brain at work on one side, a life felt from inside on the other, and a question between them
    {at:c.chalmers-0.4,place:"tt_labQuiet",keys:[[c.chalmers-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{
      const ba=ag_in(tt,c.chalmers+0.3,0.7),pa=ag_in(tt,P.hard-0.2,0.8),qm=tt_pop(tt,P.hard+0.4),q=tt_pop(tt,c.why-0.3),t1=tt_pop(tt,P.phys),t2=tt_pop(tt,P.rich);
      tt_brain(x,500,540,0.95,{a:ba,sweep:{u:((tt*0.9)%1+1)%1,a:ba}});tt_couplePic(x,1180,330,560,420,tt,pa);tt_gapLine(x,720,1120,560,qm.a,960);
      ag_T(x,"?",960,590,{w:800,size:84,align:"center",col:AG.amber,a:qm.a});
      tt_tag(x,500,830,"physical processing",{a:t1.a,k:t1.k});tt_tag(x,1460,830,"a rich inner life",{a:t2.a,k:t2.k});
      tt_quote(x,330,160,"‘Why should physical processing give rise to a rich inner life at all?’",null,{w:1260,a:q.a,k:q.k});}},
    // two theories: parts that work as one; news shared across the brain
    {at:c.theories-0.4,place:"tt_labQuiet",keys:[[c.theories-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{
      tt_net(x,700,420,230,{k:tt_on(tt,c.one+0.3,1.8),t:tt});const ba=ag_in(tt,c.another-0.2,0.6);
      tt_brain(x,1320,420,0.62,{outline:1,a:ba});tt_broadcast(x,1320,420,0.62,tt_on(tt,P.news-0.2,1.4),ba);
      const q1=tt_pop(tt,P.one),q2=tt_pop(tt,P.news+0.2);tt_tag(x,700,780,"parts that work as one",{a:q1.a,k:q1.k});tt_tag(x,1320,780,"news shared across the brain",{a:q2.a,k:q2.k});}},
    // 2025: a test of both, with rules agreed beforehand; marks on both columns, amber on both
    {at:c.test-0.4,place:"tt_labQuiet",keys:[[c.test-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{tt_testSheet(x,460,140,1000,720,{marks:tt_on(tt,P.chal-0.4,2.4),k:clamp(ag_spr(tt,c.test-0.2,0.8),0,1.2),a:ag_in(tt,c.test-0.3,0.4)});}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.7);setScreen(ctx,S);tt_cardMoves(ctx,t,3,c.pulses-0.4,null);
  tt_cornerAt(ctx,t,"1995 · David Chalmers · the hard problem",c.chalmers-0.1,c.theories-0.5);tt_cornerAt(ctx,t,"2025 · 256 people · rules agreed beforehand",c.test-0.1,sc.dur-0.4);});

scene("machine",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({awake:wAt(sc,"llinas","awake"),dream:wAt(sc,"llinas","dreaming"),forty:wAt(sc,"llinas","forty times"),
    micro:wAt(sc,"penrose","microtubules"),wipe:wAt(sc,"critics","wipe out"),tests:wAt(sc,"disagree","tests go on"),none:wAt(sc,"none","None"),obvious:wAt(sc,"none","nothing obvious"),
    end:sc.dur-2.8}));
  const sheet={at:0,place:"tt_labQuiet",keys:[[0,960,540,1]],d:2,push:0,draw:(x,tt)=>tt_testSheet(x,460,140,1000,720,{marks:1})};
  const shots=[sheet,
    {at:0.05,place:"lab",keys:[[0,960,540,1]],d:2,push:0,draw:(x,tt)=>tt_roomRow(x,tt,3,tt_tagsBefore(3))},
    // a calm brain, a fast shimmer sweeping through it, awake and dreaming; in deep sleep it fades
    {at:c.llinas-0.4,place:"tt_labQuiet",keys:[[c.llinas-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{
      const sky=clamp((tt-P.dream+0.2)/1.0,0,1)+clamp((tt-c.sleep-0.2)/1.4,0,1),slow=lerp(1,0.25,clamp(sky-1,0,1)),sa=1-0.85*clamp(sky-1,0,1);
      tt_sky(x,760,80,400,210,sky);tt_brain(x,960,500,0.8,{sweep:{u:((tt*1.25*slow)%1+1)%1,a:sa*ag_in(tt,c.llinas+0.6,0.8)}});
      const aw=ag_io(tt,P.awake-0.1,c.sleep,0.4),dr=ag_io(tt,P.dream-0.1,c.sleep,0.4),ds=ag_in(tt,c.sleep+0.3,0.5);
      tt_tag(x,640,190,"awake",{a:aw*(sky<0.5?1:0.55)});tt_tag(x,1280,190,"dreaming",{a:dr*(sky>0.5?1:0.55)});tt_tag(x,1280,250,"deep sleep",{a:ds});
      const q=tt_pop(tt,P.forty-0.1);tt_tag(x,1490,520,"about 40 times a second",{a:q.a*(1-0.5*ds),k:q.k});
      tt_signs(x,960,800,tt_on(tt,c.ties+0.3,1.8),{a:ag_io(tt,c.ties,c.penrose-0.6,0.5)});}},
    // into a neuron, to its tiny tubes, a pearly shimmer moving in them
    {cut:true,at:c.penrose-0.4,place:"tt_labQuiet",keys:[[c.penrose-0.4,960,520,1.0],[c.penrose+0.6,960,522,3.0]],d:2.8,push:0,draw:(x,tt)=>tt_neuron(x,960,520,1.5,{grow:1})},
    {cut:true,at:P.micro-0.5,place:"tt_labQuiet",keys:[[P.micro-0.5,960,500,1.08],[P.micro,960,520,1.0]],d:2.4,push:0.01,draw:(x,tt)=>{const gone=tt>P.wipe+0.1;
      tt_tubes(x,360,240,1200,420,{pearl:gone?0:ag_in(tt,P.micro,0.6),t:tt});const m=tt_pop(tt,P.micro+0.2);tt_tag(x,960,700,"microtubules",{a:m.a,k:m.k});
      const g=tt_pop(tt,P.wipe+0.3),n=tt_pop(tt,c.disagree+0.3),o=tt_pop(tt,P.tests-0.1);
      tt_tag(x,560,790,"gone too fast to matter?",{a:g.a,k:g.k,col:AG.amber});tt_tag(x,1360,790,"not so fast",{a:n.a,k:n.k});tt_tag(x,960,790,"tests go on",{a:o.a,k:o.k});}},
    // what Llinás wrote, and what he later asked
    {at:c.y2001-0.4,place:"lab",keys:[[c.y2001-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{ag_desk(x,120,1060,1680,{depth:300,th:30});tt_book(x,600,780,{});ag_roomLight(x,1);
      const q1=tt_pop(tt,c.y2001+1.2),q2=tt_pop(tt,c.y2007+0.4);
      tt_quote(x,980,150,"‘I sincerely doubt it is a plausible scenario worth pursuing at any serious level.’","Rodolfo Llinás · 2001",{w:820,a:q1.a,k:q1.k});
      tt_quote(x,980,470,"‘Filaments? Microtubules? Quantum mechanics?’",null,{w:820,kick:"2007",a:q2.a,k:q2.k});}},
    // 2023: fourteen signs, none of today's systems showing enough of them
    {at:c.y2023-0.4,place:"lab",keys:[[c.y2023-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{const [rx,ry]=[1124,476];ag_loop(x,rx,ry,{t:tt,label:null,stepA:[0,0,0]});ag_roomLight(x,1);
      tt_checklist(x,300,150,420,{k:clamp(ag_spr(tt,c.y2023+0.6,0.8),0,1.2),a:ag_in(tt,c.y2023+0.5,0.4)});
      const q1=tt_pop(tt,P.none),q2=tt_pop(tt,P.obvious);tt_tag(x,960,770,"no current system conscious",{a:q1.a,k:q1.k});
      tt_tag(x,960,840,"no obvious barrier to building ones that show the signs",{a:q2.a,k:q2.k});}},
    // showing the signs, and feeling anything: a gap of bare marble between them
    {at:c.whether-0.4,place:"tt_labQuiet",keys:[[c.whether-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{const u=ag_sine(tt_on(tt,c.whether,1.6));
      tt_checklist(x,lerp(300,200,u),150,420,{});
      tt_couplePic(x,lerp(1100,1180,u),170,560,420,tt,ag_in(tt,c.whether+0.2,0.6));}},
    tt_closeShot(3,P.end)];
  ag_shots(ctx,S,t,sc.dur,shots,0.7);setScreen(ctx,S);
  tt_cardFwd(ctx,3,1,ag_in(t,0.1,0.6)*(1-ag_in(t,c.llinas-0.4,0.6)));if(t>=P.end&&t<P.end+1.9)tt_cardFwd(ctx,3,1-tt_on(t,P.end+0.4,1.5),ag_in(t,P.end,0.6));
  const nm=ag_io(t,c.llinas,c.penrose-0.5,0.5);if(nm>0.01)ag_textCard(ctx,96,60,340,{title:"Rodolfo Llinás"},{a:nm});
  const ph=ag_io(t,c.penrose-0.1,c.y2001-0.5,0.5);if(ph>0.01)ag_textCard(ctx,96,60,700,{title:"Roger Penrose · Stuart Hameroff",sub:"a physicist · an anaesthesiologist"},{a:ph});
  tt_cornerAt(ctx,t,"2023 · 19 researchers",c.y2023-0.1,c.whether-0.5);});

// Rod and Margaret at their table, framed, in a warm light: a life felt from inside
function tt_couplePic(x,X,Y,w,h,tt,a){if(a<=0.01)return;ag_picture(x,X,Y,w,h,{a,draw:(c2,PX,PY,pw,ph)=>{c2.save();c2.beginPath();c2.rect(PX,PY,pw,ph);c2.clip();c2.translate(PX,PY);
  c2.scale(pw/1100,pw/1100);c2.translate(-560,-260);c2.drawImage(ag_place("tt_home"),0,0);
  tt_couple(c2,tt,{mag:{talk:0.4*(0.5+0.5*Math.sin(tt*7))},rod:{smile:1}});tt_glow(c2,960,520,420,1,[255,220,170]);c2.restore();}});}
// a dotted line from x0 to x1 at y, broken around m (the middle by default) where a question mark stands
function tt_gapLine(ctx,x0,x1,y,a,m){if(a<=0.01)return;m=m==null?(x0+x1)/2:m;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG_OAK.dark,0.75);ctx.lineWidth=5;ctx.lineCap="round";ctx.setLineDash([2,16]);
  ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(m-70,y);ctx.moveTo(m+70,y);ctx.lineTo(x1,y);ctx.stroke();ctx.restore();}
// the sign-off Mei keeps: a small card in her near hand, with the agent's pen, her signature and a green tick (no words: too small to
// read); drawn in figure space, over her hand
function tt_heldSign(a){return (c2,h)=>{if(a<=0.01)return;const n=h.near;c2.save();c2.globalAlpha*=a;c2.translate(n[0]-70,n[1]-200);c2.rotate(-0.05);
  ag_box(c2,0,0,340,230,22,{edge:AG.green,edgeA:0.75});ag_pen(c2,44,50,34,rgba(AG.violet,1));c2.fillStyle="rgba(120,112,104,0.4)";rr(c2,92,40,200,16,8);c2.fill();
  c2.strokeStyle=rgba(AG.ink,0.75);c2.lineWidth=5;c2.lineCap="round";c2.beginPath();
  for(let i=0;i<=40;i++){const u=i/40,xx=60+u*220,yy=122-Math.sin(u*TAU*2.4)*14*Math.sin(Math.PI*u);i?c2.lineTo(xx,yy):c2.moveTo(xx,yy);}c2.stroke();
  ag_tick(c2,56,186,34,rgba(AG.green,1),7);c2.fillStyle=rgba(AG.green,0.5);rr(c2,100,176,180,16,8);c2.fill();c2.restore();};}
const TT_LIFT={near:[10,128,"hold"]};   // Mei's near hand up, holding the sign-off; her far arm stays down

scene("human",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({settled:wAt(sc,"settled","Nobody has settled"),like:wAt(sc,"building","like us"),not:wAt(sc,"building","where they're not"),
    dk:wAt(sc,"building","still don't know"),hand:wAt(sc,"helps","what to hand"),keep:wAt(sc,"helps","what to keep")}));
  const H_=TT_HOME,cards=[["a body that can be hurt",c.body],["a life lived with others",c.life],["feelings",c.feelings],["choosing what matters, and answering for it",c.choosing]];
  const ans=["Yes:","we","count","each","student","once,","on","census","day."],a0=c.today+1.5;
  const shots=[tt_openShot(4),
    // the Dutch Republic, 1637: a study at night, a candle, a man writing, a small clockwork figure on his desk
    {at:c.descartes-0.4,place:"tt_study1637",keys:[[c.descartes-0.4,960,560,1.06],[c.descartes,960,540,1.0]],d:4,push:0.01,draw:(x,tt)=>{
      tt_oldDesk(x,520,880,780,{});ag_person(x,TT_DESC,900,574,0.8,{t:tt,cut:790,gaze:[0,2.5]});tt_candle(x,1180,820,tt,1);tt_automaton(x,700,830,tt,1);
      const q=tt_pop(tt,c.descartes+2.4);tt_quote(x,360,110,"a machine could never arrange its words to answer whatever is said to it",null,{w:860,a:q.a,k:q.k});}},
    // today, machines do: a question goes into the ring, and an answer comes straight out, word by word
    {at:c.today-0.4,place:"lab",keys:[[c.today-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{const [rx,ry]=[1124,476],u=ag_sine(tt_on(tt,c.today+0.6,0.8));
      ag_loop(x,rx,ry,{t:tt,think:ag_io(tt,c.today+1.1,a0+2.2,0.3),label:null,stepA:[0,0,0]});ag_roomLight(x,1);
      if(u<1){x.save();x.globalAlpha*=1-clamp((u-0.75)/0.25,0,1);const qx=lerp(470,rx,u),qy=lerp(250,ry,u)-Math.sin(Math.PI*u)*30,s=lerp(1,0.25,u*u);x.translate(qx,qy);x.scale(s,s);
        ag_textCard(x,-230,-60,460,{title:"Can you say that more simply?"},{});x.restore();}
      tt_wordRow(x,ans,560,800,tt,{at:ans.map((_,i)=>a0+i*0.22)});}},
    // if not language, then what? four cards float in, unlit, one at a time
    {at:c.body-0.6,place:"lab",keys:[[c.body-0.6,960,540,1.0]],d:2,push:0.015,draw:(x,tt)=>{ag_roomLight(x,1);
      cards.forEach(([w,at],i)=>{const q=tt_pop(tt,at-0.1),X=[330,1010,330,1010][i],Y=[230,230,470,470][i]+Math.sin(tt*0.9+i*1.7)*6;
        if(q.a>0.01)ag_textCard(x,X,Y+24*(1-ag_sine(clamp((tt-at+0.1)/0.9,0,1))),580,{title:w},{a:q.a*0.94,k:q.k});});}},
    // Melbourne, 1978: her words reach him, filled; he answers; the telephone rings, and he hears it
    {at:c.heard-0.4,place:"tt_home",keys:[[c.heard-0.4,960,540,1.06],[c.heard,960,540,1.0]],d:5,push:0.01,draw:(x,tt)=>{const rg=ag_io(tt,c.heard+4.0,c.building,0.3);
      tt_homeLive(x,tt,{talk:ag_io(tt,c.heard-0.2,c.heard+2.6,0.4),bubbles:[0.0,1.8].map(v=>({t0:c.heard+v,fill:0.85})),reach:true,ring:rg,
        rings:{phone:rg},rod:{gaze:tt>c.heard+4.3?[-3,-1.4]:[-3,0],smile:0.7,talk:0.4*ag_io(tt,c.heard+2.8,c.heard+4.2,0.3)*(0.5+0.5*Math.sin(tt*8))}});
      tt_implant(x,H_.rod,H_.y,H_.s,{t:tt,pulse:1});}},
    // the spiral and its wire, and the agent: like us, not like us, and how much we still don't know
    {at:c.building-0.4,place:"lab",keys:[[c.building-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{
      tt_spiral(x,520,470,230,{dots:1,wire:1,rings:10,lit:10});ag_loop(x,1400,470,{t:tt,label:null,stepA:[0,0,0],think:0.3});tt_roughCopy(x,1400,470,88,tt,{neurons:0.6,pages:0.6});ag_roomLight(x,1);
      const L=tt_pop(tt,P.like),N=tt_pop(tt,P.not),D=tt_pop(tt,P.dk),go=1-ag_in(tt,c.helps-0.9,0.4);
      tt_tag(x,960,520,"like us",{a:L.a*go,k:L.k,col:AG.green});tt_tag(x,960,610,"not like us",{a:N.a*go,k:N.k,col:AG.amber});tt_tag(x,960,700,"still don't know",{a:D.a*go,k:D.k});}},
    // the room: Jun hands the agent a task, read only; the sign-off stays with Mei; the five questions on the wall, each with its tag
    {cut:true,at:c.helps-0.4,place:"lab",keys:[[c.helps-0.4,1000,560,1.08],[c.answers,960,540,1.0]],d:4,push:0,draw:(x,tt)=>{const t0=c.helps-0.4,back=tt>=t0+1.9,lift=ag_sine(tt_on(tt,P.keep-0.3,0.8));
      tt_team(x,tt,{pose2:[null,TT_LIFT],mix:[0,lift],hold:[null,tt_heldSign(clamp(lift*2.5,0,1))],
        gaze:TT_SEATS.map((_,i)=>i===0?[3,-1]:[3,0]),smile:[0.5,0.45,0.35,0.35,0.35],core:0.4+0.5*ag_io(tt,P.hand+1.4,c.answers,0.6)});
      tt_qrow(x,{out:back?-1:4,tags:[1,1,1,1,ag_in(tt,t0+1.9,0.5)],a:1-ag_in(tt,c.breath,0.8)});
      const u=tt_on(tt,P.hand-0.4,1.6);if(u>0&&u<1){const q=ag_sine(u),s=lerp(1,0.3,clamp((u-0.82)/0.18,0,1));x.save();x.globalAlpha*=1-clamp((u-0.76)/0.1,0,1);
        x.translate(lerp(330,TT_REST[0],q),lerp(520,TT_REST[1],q)-Math.sin(Math.PI*q)*30);x.scale(s,s);ag_textCard(x,-170,-60,340,{title:"count students",sub:"read only"},{edge:AG.blue});x.restore();}
      const fl=ag_in(tt,c.answers-0.4,2.4);if(fl>0.01){x.save();const g=x.createLinearGradient(1920,0,700,0);g.addColorStop(0,"rgba(255,236,200,"+(0.22*fl)+")");g.addColorStop(1,"rgba(255,236,200,0)");
        x.fillStyle=g;x.fillRect(0,653,W,H-653);x.restore();}
      ag_roomLight(x,1);
      // the fifth card goes back to the wall in the room, under the shot's camera, so it lands where the row is drawn: over the shots, in
      // the frame, it landed 22 px from it while the camera was still closing in, and jumped there in one frame
      if(!back)tt_cardFwd(x,4,1-tt_on(tt,c.helps,1.5),ag_in(tt,t0,0.6));}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.7);setScreen(ctx,S);tt_cardMoves(ctx,t,4,c.descartes-0.4,null);
  tt_cornerAt(ctx,t,"The Dutch Republic · 1637",c.descartes-0.1,c.today-0.5,{col:[236,222,200]});
  ag_end(ctx,S,t,c.breath,TT_TITLE,"We don't have the answers yet. Keep wondering.","Film 8 of 9");});

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["five", "taught", "mixing", "wire", "feels", "human"]);
