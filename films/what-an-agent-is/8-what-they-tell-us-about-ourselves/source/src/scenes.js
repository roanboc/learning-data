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
  tt_couple(x,tt,{mag:Object.assign({pose:"explain",talk:Math.max(0,talk),smile:0.5,gaze:[3,0]},o.mag||{}),rod:Object.assign({pose:"chin",gaze:[-3,0]},o.rod||{})});
  // rings of sound: from the kettle, the radio and the telephone, towards Rod, fading before they reach him
  const ear=tt_ear(H_.rod,H_.y,H_.s,true);
  if(R.kettle>0)tt_rings(x,366,368,tt,{a:R.kettle,dir:-0.7,spread:1.1,per:1.5});
  if(R.radio>0)tt_rings(x,TT_RADIO[0]+70,TT_RADIO[1],tt+0.4,{a:R.radio,dir:0.1,spread:1.1,per:1.3});
  if(R.phone>0)tt_rings(x,H_.phone[0]-50,H_.phone[1]-20,tt+0.8,{a:R.phone,dir:Math.PI*1.12,spread:1.1,per:0.9});
  // Margaret's bubbles: they leave her mouth and drift to his ear
  const m=tt_mouth(H_.mag,H_.y,H_.s,false);for(const b of (o.bubbles||[])){const u=(tt-b.t0)/2.6;if(u<=0||u>=1.15)continue;const q=ag_sine(Math.min(1,u)),
    bx=lerp(m[0]+16,ear[0]-260,q),by=lerp(m[1]-66,ear[1]-40,q)-Math.sin(Math.PI*q)*26,al=Math.min(1,u*5)*(1-clamp((u-0.7)/0.3,0,1));
    tt_bubble(x,bx,by,132,54,bx+66,by,{fill:b.fill==null?0.6:b.fill,a:al});}
  return ear;}
// Rod's head, close, facing left, for the implant and his brain doing the rest: the camera is 2.2 times closer on (1250, 420)
function tt_rodClose(x,tt,o){o=o||{};if(o.branch>0)tt_branchLight(x,1290,370,0.8,o.branch,1);
  ag_person(x,TT_ROD,1250,600,1.0,{t:tt,flip:true,covered:true,gaze:o.gaze||[-2,0],smile:o.smile||0.2,talk:o.talk||0});
  tt_implant(x,1250,600,1.0,{t:tt,wire:o.wire==null?1:o.wire,pulse:o.pulse||0,a:o.implant==null?1:o.implant});}

// ---- 1 · A rough copy: Rod, deaf, reads Margaret's lips; a hearing aid can't help; a pioneer's doubt; Clark's father; ten years and a
//          rough copy of the inner ear; August 1978; Waltzing Matilda; December; the copy was rough, his brain did the rest; 2019; the
//          same with agents; like us, and not ----
scene("rough",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({lips:wAt(sc,"lips","lips"),voice:wAt(sc,"lips","voice"),louder:wAt(sc,"aid","louder"),
    inner:wAt(sc,"aid","inner ears"),brain:wAt(sc,"aid","brain"),voices:wAt(sc,"cut","voices"),y66:wAt(sc,"doubt","nineteen sixty-six"),sig:wAt(sc,"doubt","electric signals"),
    deaf:wAt(sc,"father","deaf"),rough:wAt(sc,"years","rough copy"),wire:wAt(sc,"implant","a fine wire"),ten:wAt(sc,"implant","ten electrodes"),pulses:wAt(sc,"implant","pulses"),
    went:wAt(sc,"august","went in"),played:wAt(sc,"sang","played"),along:wAt(sc,"sang","sang along"),words:wAt(sc,"december","words"),
    tenE:wAt(sc,"roughwas","ten electrodes"),thou:wAt(sc,"roughwas","thousands"),learned:wAt(sc,"rest","learned"),neurons:wAt(sc,"copies","neurons"),
    wrote:wAt(sc,"copies","what people wrote"),like:wAt(sc,"keep","like us"),not:wAt(sc,"keep","where they're not")}));
  const H_=TT_HOME,talkUntil=c.cut+1.5,bub=[1.4,4.6,8.2,11.6,15.6,19.4].map(t0=>({t0}));
  const homeO=tt=>({talk:ag_io(tt,0.8,talkUntil,0.5),bubbles:bub,rings:{kettle:ag_io(tt,c.cut,c.doubt+2,0.6),radio:ag_io(tt,c.cut+0.8,c.doubt+2,0.6),phone:ag_io(tt,c.cut+1.6,c.doubt+3,0.6)},
    ring:ag_io(tt,c.cut+1.6,c.doubt+3,0.3),rod:{pose:"chin",gaze:tt>P.lips-0.2&&tt<c.aid+1?[-3,1.2]:[-3,0],smile:0.15}});
  const shots=[
    // the living room, the afternoon: she talks, he watches her lips; then wide, the kettle, the radio and the telephone
    {at:0,place:"tt_home",keys:[[0,1000,560,1.1],[c.cut-0.6,960,540,1.0]],d:7,push:0,draw:(x,tt)=>{tt_homeLive(x,tt,homeO(tt));
      const m=tt_mouth(H_.mag,H_.y,H_.s,false);tt_lips(x,m[0],m[1],H_.s,ag_io(tt,P.lips-0.2,c.aid+0.6,0.4));}},
    {at:c.change-0.6,place:"tt_home",keys:[[c.change-0.6,960,540,1.0],[c.change-0.2,1500,400,1.5]],d:2.4,push:0.01,draw:(x,tt)=>tt_homeLive(x,tt,homeO(tt))},
    // a memory rises over the window: a small-town pharmacy (drawn as a soft card, in the screen's space)
    {at:c.father-0.3,keys:[[c.father-0.3,960,540,1.02],[c.father,960,530,1.07]],d:5,push:0.01,draw:(x,tt)=>{x.save();x.scale(2,2);tt_pharmacy(x,960,540,tt,{});x.restore();tt_memWash(x);}},
    {at:c.years-0.4,place:"tt_lab78",keys:[[c.years-0.4,960,560,1.04],[c.years,980,560,1.08]],d:6,push:0.01,draw:(x,tt)=>{
      tt_trolley(x,1060,560,{lit:0,reel:1});ag_person(x,TT_ENG2,1500,664,0.86,{t:tt+2,flip:true,pose:"hold"});
      ag_person(x,TT_CLARK,560,640,0.92,{t:tt,pose:"explain",talk:0.4*ag_io(tt,c.years,c.implant+3,0.5)});ag_person(x,TT_ENG1,920,664,0.86,{t:tt+1,flip:true,pose:"chin"});}},
    // the rough copy of the inner ear: the spiral in a cutaway, its thousands of cells drawn faint; the wire winds in, ten rings settle
    {at:P.rough-0.3,place:"tt_labQuiet",keys:[[P.rough-0.3,960,520,1.0],[P.rough,960,500,1.04]],d:8,push:0.01,draw:(x,tt)=>{
      tt_spiral(x,960,500,330,{dots:0.55,wire:tt_on(tt,P.wire-0.2,2.4),rings:clamp((tt-P.ten+0.2)/0.35,0,10)});}},
    // 1 August 1978: the theatre's doors; then Rod's head, the implant under the skin behind his ear, the wire curling inwards
    {at:c.august-0.3,place:"tt_corridor",keys:[[c.august-0.3,960,540,1.0],[c.august,960,520,1.06]],d:4,push:0.01,draw:(x,tt)=>tt_theatreSign(x,1)},
    {at:P.went-0.1,place:"tt_corridor",keys:[[P.went-0.1,1250,420,2.2]],d:3,push:0.02,draw:(x,tt)=>tt_rodClose(x,tt,{wire:tt_on(tt,P.went+0.2,1.6),smile:0.1})},
    // the lab: Rod in a chair with the coil behind his ear; the engineer starts the tape; ten lights, one after another; Rod sings
    {at:c.sang-0.5,place:"tt_lab78",keys:[[c.sang-0.5,980,560,1.06],[P.along,900,520,1.14]],d:3,push:0.01,draw:(x,tt)=>{const lit=clamp((tt-P.played)/0.22,0,10),sing=ag_in(tt,P.along-0.1,0.5);
      tt_trolley(x,1060,560,{lit,reel:1});tt_chair(x,820,700,0.85);
      ag_person(x,TT_ROD,820,700,0.85,{t:tt,flip:true,talk:sing*(0.4+0.3*Math.sin(tt*6)),smile:lerp(0.1,0.9,ag_in(tt,P.played+1.6,0.8)),gaze:[-2,-0.6]});tt_coil(x,820,700,0.85,1080,640);
      ag_person(x,TT_ENG1,1520,664,0.86,{t:tt+1,flip:true,pose:ag_io(tt,c.sang-0.3,P.played+1.2,0.4)>0.5?"point":"hang"});ag_person(x,TT_CLARK,330,660,0.9,{t:tt+2,smile:0.6*ag_in(tt,P.along,1)});
      const m=tt_mouth(820,700,0.85,true);tt_song(x,m[0]-210,m[1]-30,tt,sing,[196,150,92]);
      tt_tag(x,1210,470,"Waltzing Matilda",{a:ag_in(tt,c.sang,0.4),size:28});}},
    // December 1978: the audiologist hides her mouth behind a card and says a word; Rod says it back
    {at:c.december-0.3,place:"tt_lab78",keys:[[c.december-0.3,960,560,1.1],[c.december,960,540,1.16]],d:4,push:0.01,draw:(x,tt)=>{
      tt_chair(x,1260,700,0.85);ag_person(x,TT_ROD,1260,700,0.85,{t:tt,flip:true,talk:0.5*ag_io(tt,P.words+0.9,P.words+2.2,0.2),smile:0.6,gaze:[-3,0]});
      ag_person(x,TT_AUD,640,690,0.86,{t:tt+1,pose:"hold",talk:0.5*ag_io(tt,P.words-0.4,P.words+0.6,0.2),hold:(c2,h)=>{const n=h.near;ag_box(c2,n[0]-70,n[1]-330,250,330,10,{});}});
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

// (placeholders while the chapters are written)
for(const id of ["five","taught","mixing","wire","feels","machine","human"])scene(id,(ctx,S,t,sc)=>{setScreen(ctx,S);ctx.drawImage(ag_place("lab"),0,0);});
