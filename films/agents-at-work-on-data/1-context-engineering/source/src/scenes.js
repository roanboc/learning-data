/* ===== Context engineering: the seven chapters =====
   Each chapter is a few shots, in the places of past.js and the module's room, cut together (ce_shots): a shot that shows other people,
   or the same ones framed again, comes in on a cut; one that only adds a veil and a card dissolves. Times inside a chapter come from
   its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the voice if it's recorded again. Words
   on screen are on cards, labels and pills, at least 28 px as seen, and above the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const ce_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the shared ag_shots: a shot may dissolve in over its own time (sh.dis, seconds; 0.5 by default); in one room the camera glides on
// from shot to shot, and between rooms a shot marked cut comes in on a cut
const ce_shots=(ctx,S,t,end,shots)=>ag_shots(ctx,S,t,end,shots);
// the corner's kicker: the latest of [[t, num, title], ...] passed, dissolving from the one before; a null num hides it
function ce_kick(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?ag_in(t,mk[i][0],0.5):1;
  if(u<1&&mk[i-1][1])ag_kicker(ctx,mk[i-1][1],mk[i-1][2]||"",{a:a*(1-u)});if(mk[i][1])ag_kicker(ctx,mk[i][1],mk[i][2]||"",{a:a*u});}
// a card that springs in at t0 and goes at t1 (or stays): its k and a, for ag_textCard
const ce_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
const CE_TITLE="Context engineering";
// the room's paper-pale veil, inside a shot (ag_veil resets the camera)
function ce_veil(x,a){if(a<=0.01)return;x.fillStyle="rgba(240,238,233,"+clamp(a,0,1)+")";x.fillRect(-200,-200,W+400,H+400);}
// a figure's point (figure space fx, fy) in the frame, for a person drawn at (x, y, s), facing left if flip
const ce_at=(x,y,s,fx,fy,flip)=>[x+(flip?-1:1)*(fx-AG_FIG.anchor[0])*s,y+(fy-AG_FIG.anchor[1])*s];
// a person's singing mouth: opens and closes slowly, from t0 to t1
const ce_sing=(t,t0,t1)=>t<t0||t>t1?0:(0.3+0.25*Math.sin(t*5.1)+0.15*Math.sin(t*2.3+1))*ag_io(t,t0,t1,0.3);

// ---- 1 · The lines: Arezzo, about 1025; chants learned by ear; Guido's lines; Rome; today's staff; an agent reads only the page ----
scene("lines",(ctx,S,t,sc)=>{const c=sc.cues,P=ce_once(sc,"P",()=>({arezzo:wAt(sc,"when","Arezzo"),guido:wAt(sc,"school","Guido"),teaches:wAt(sc,"school","teaches"),
    ear:c.ear-0.4,byear:wAt(sc,"ear","by"),master:wAt(sc,"ear","master"),signs:c.signs-0.4,small:wAt(sc,"signs","signs"),remind:wAt(sc,"signs","remind"),
    never:wAt(sc,"far","never"),how:wAt(sc,"far","show"),masters:c.master-0.4,agree:wAt(sc,"master","agree"),
    books:c.books-0.4,many:wAt(sc,"books","many"),leo:wAt(sc,"books","Leo"),albert:wAt(sc,"books","Albert"),years:c.years-0.2,ten:wAt(sc,"years","ten"),imperf:wAt(sc,"years","imperfectly"),
    change:c.change-0.5,lines:wAt(sc,"lines","lines"),red:wAt(sc,"colour","F"),yellow:wAt(sc,"colour","yellow"),sits:wAt(sc,"page","sits"),head:wAt(sc,"page","head"),
    days:c.days-0.4,three:wAt(sc,"days","three"),neverD:wAt(sc,"days","never"),tenS:c.ten-0.3,took:wAt(sc,"ten","took"),made:wAt(sc,"ten","made"),
    rome:c.pope-0.5,turns:wAt(sc,"pope","turns"),seat:wAt(sc,"pope","seat"),neverP:wAt(sc,"pope","never"),
    staff:c.staff-0.5,more:wAt(sc,"staff","more"),today:wAt(sc,"staff","today"),agent:c.agent-0.5,reads:wAt(sc,"agent","sing"),page:wAt(sc,"agent","page"),
    someone:wAt(sc,"head","someone"),guesses:wAt(sc,"head","guesses"),put:wAt(sc,"put","Put"),both:wAt(sc,"put","both"),title:c.breath+0.3}));
  ce_shots(ctx,S,t,sc.dur,[
    // the school at Arezzo: Guido at the lectern with his boys; the place and year, and his name
    {at:0,place:"ceSchool",keys:[[0,960,540,1],[0.1,930,530,1.05]],d:12,push:0.01,draw:(x,tt)=>{ce_school(x,tt,{who:CE_PEOPLE.guido,sing:[P.teaches,P.ear+0.4]});
      const p=ce_pop(tt,P.arezzo-0.1,null);ag_textCard(x,110,150,400,{kick:"Arezzo, Italy",title:"About 1025"},{k:p.k,a:p.a});
      const g=ce_pop(tt,P.guido,null);ag_textCard(x,1300,150,360,{title:"Guido",sub:"a monk who teaches"},{tail:{side:"bottom",at:0.15,px:1250,py:372},k:g.k,a:g.a});}},
    // by ear: a master sings a line, and a boy sings it back, one chant at a time
    {cut:true,at:P.ear,place:"ceSchool",keys:[[P.ear,980,560,1.06],[P.ear+0.1,1000,560,1.1]],d:5,push:0.01,draw:(x,tt)=>{const M=[1190,660,1.0];
      ag_person(x,CE_PEOPLE.master,M[0],M[1],M[2],{t:tt,flip:true,talk:ce_sing(tt,P.ear+0.3,P.signs),gaze:[2,1.5]});ag_roomLight(x,1);
      ce_boyBack(x,720,950,1.16,{hair:[60,44,34],turn:0.35,up:0.2+0.1*Math.sin(tt*1.7)});
      const m=ce_at(M[0],M[1],M[2],367,484,true);ce_sound(x,m[0]-6,m[1],825,782,{t:tt,a:ag_io(tt,P.ear+0.4,P.signs,0.4)});
      ag_pill(x,960,190,"by ear",{a:ag_in(tt,P.byear-0.1,0.4),size:30});const mp=ce_pop(tt,P.master,null);ag_pill(x,1420,330,"a master",{a:mp.a,size:30});}},
    // the page close up: the signs over the words, a reminder for a singer who knows the chant; how far does this one rise?
    {cut:true,at:P.signs,place:"cePage",keys:[[P.signs,960,520,1.0],[P.signs+0.1,980,500,1.06]],d:13,push:0.01,draw:(x,tt)=>{
      ce_chant(x,{lines:0,mark:ag_in(tt,P.how-0.3,1.1)});
      const sg=ce_pop(tt,P.small,null);ag_pill(x,640,300,"signs",{a:sg.a,size:30});
      const r=ce_pop(tt,P.remind,null);ag_textCard(x,1080,96,600,{kick:"The signs",title:"A reminder, if you already know the chant"},{k:r.k,a:r.a*(1-ag_in(tt,P.how-0.6,0.5))});
      ce_boyBack(x,1790,935,1.4,{hair:[112,78,50],turn:-0.3,up:0.3,a:ag_in(tt,P.never-0.2,0.8)});}},
    // the masters don't agree: two masters sing the same words, each his own way
    {cut:true,at:P.masters,place:"ceSchool",keys:[[P.masters,960,540,1.02],[P.masters+0.1,960,540,1.05]],d:4,push:0.01,draw:(x,tt)=>{ce_veil(x,0.25);
      ag_person(x,CE_PEOPLE.master,470,670,0.94,{t:tt,talk:ce_sing(tt,P.masters+0.5,P.books),gaze:[2,0]});
      ag_person(x,CE_PEOPLE.albert,1450,670,0.94,{t:tt,flip:true,talk:ce_sing(tt,P.masters+0.8,P.books),gaze:[2,0]});ag_roomLight(x,1);
      const d=ce_pop(tt,P.agree-0.2,null);ce_way(x,640,170,320,0,{k:d.k,a:d.a,diff:ag_in(tt,P.agree+0.4,0.6)});ce_way(x,960,170,320,1,{k:d.k,a:d.a,diff:ag_in(tt,P.agree+0.4,0.6)});}},
    // as many chant books as masters: Leo's, Albert's; then ten years, and still imperfectly
    {cut:true,at:P.books,place:"ceSchool",keys:[[P.books,960,540,1],[P.books+0.1,960,540,1.03]],d:8,push:0.01,draw:(x,tt)=>{ce_veil(x,0.6);
      const b1=ce_pop(tt,P.books+0.1,null),b2=ce_pop(tt,P.books+0.4,null),b3=ce_pop(tt,P.books+0.7,null),dim=1-0.55*ag_in(tt,P.years,0.6);
      ce_book(x,1460,600,300,null,{k:b3.k,a:b3.a*0.6*dim,seed:7});ce_book(x,560,600,340,ag_in(tt,P.leo-0.1,0.4)>0.5?"Leo's":null,{k:b1.k,a:b1.a*dim,seed:3});
      ce_book(x,1010,620,340,ag_in(tt,P.albert-0.1,0.4)>0.5?"Albert's":null,{k:b2.k,a:b2.a*dim,seed:11});
      const q=ce_pop(tt,P.many-0.3,P.years);ag_textCard(x,560,110,800,{kick:"Guido wrote",title:"As many chant books as masters"},{k:q.k,a:q.a});
      const y=ce_pop(tt,P.years+0.2,null);ce_years(x,520,110,880,{k:y.k,a:y.a,fill:ag_sine(clamp((tt-P.ten)/1.8,0,1)),imperf:ag_in(tt,P.imperf-0.1,0.5)});}},
    // something has to change: the page again; a quill draws Guido's lines, the red and the yellow; the signs settle onto them
    {cut:true,at:P.change,place:"cePage",keys:[[P.change,960,520,1.0],[P.change+0.1,960,500,1.04],[P.sits+0.6,960,520,1.0]],d:3,push:0.008,draw:(x,tt)=>ce_drawLines(x,tt,P)},
    // within three days: the boys sing a chant they've never heard, from the page; Guido listens
    {cut:true,at:P.days,place:"ceSchool",keys:[[P.days,900,560,1.08],[P.days+0.1,880,560,1.12]],d:6,push:0.01,draw:(x,tt)=>{
      ce_bookLines(x,1);ce_school(x,tt,{who:CE_PEOPLE.guido,smile:0.45,singing:[P.days+0.3,P.rome+0.5]});
      const d=ce_pop(tt,P.three-0.2,null);ag_textCard(x,1180,140,520,{kick:"Within three days",title:"Chants they have never heard"},{k:d.k,a:d.a*(1-ag_in(tt,P.tenS+0.2,0.4))});
      const v=ag_in(tt,P.tenS,0.6);ce_veil(x,0.6*v);const y=ce_pop(tt,P.tenS+0.2,null);ce_tenYears(x,470,280,980,{k:y.k,a:y.a*v,page:ag_in(tt,P.made-0.2,0.8),ear:ag_sine(clamp((tt-P.took)/1.6,0,1))});}},
    // Rome: Pope John turns the pages of Guido's book, and won't get up until he has learned a verse he's never heard
    {cut:true,at:P.rome,place:"ceRome",keys:[[P.rome,960,540,1.02],[P.rome+0.1,900,540,1.08]],d:7,push:0.01,draw:(x,tt)=>{const [px,py,ps]=CE_ROME.pope,[gx,gy,gs]=CE_ROME.guido;
      const turn=clamp((tt-P.turns)/1.3,0,1)+clamp((tt-P.seat-0.6)/1.3,0,1);
      ag_person(x,CE_PEOPLE.pope,px,py,ps,{t:tt,pose:"hold",hold:(c,h)=>ce_heldBook(c,h,{turn:turn%1}),gaze:[3,3],nod:0.05,covered:true});
      ag_person(x,CE_PEOPLE.guido,gx,gy,gs,{t:tt,flip:true,gaze:[2,1.2],smile:0.35});ag_roomLight(x,1);
      const p=ce_pop(tt,P.rome+0.4,null);ag_textCard(x,110,150,380,{kick:"Rome",title:"About 1028"},{k:p.k,a:p.a});
      const v=ce_pop(tt,P.neverP-0.2,null);ag_textCard(x,1000,170,520,{kick:"Pope John",title:"A verse he had never heard"},{tail:{side:"left",at:0.8,px:900,py:470},k:v.k,a:v.a});}},
    // today's staff: the old page framed on the marble, and one more line
    {at:P.staff,dis:1.2,place:"lab",keys:[[P.staff,960,520,1.02],[P.staff+0.1,960,500,1.05]],d:4,push:0.01,draw:(x,tt)=>{ag_roomLight(x,1);ce_staves(x,tt,P);}},
    // an agent reads like a boy who's never heard the chant: only the page; a meaning in someone's head, and its guess; on the page
    {cut:true,at:P.agent,place:"lab",keys:[[P.agent,960,540,1],[P.agent+0.1,960,530,1.03]],d:14,push:0.01,draw:(x,tt)=>ce_onlyPage(x,tt,P)}]);
  ce_kick(ctx,t,[[0,null],[P.staff+0.6,"Today"],[P.title-0.4,null]],1);
  ag_title(ctx,S,t,P.title,CE_TITLE,null,"AGENTS AT WORK ON DATA · FILM 1 OF 9");});

// the school at Arezzo: the master (o.who) to the right of the lectern, the boys before it, from behind; o.sing [t0, t1] while he sings,
// o.singing [t0, t1] while the boys do; o.covered when the school is a picture whose frame cuts the master off
function ce_school(x,tt,o){const S=CE_SCHOOL,[gx,gy,gs]=S.guido,sg=o.singing;
  ag_person(x,o.who,gx,gy,gs,{t:tt,flip:true,gaze:[2.5,1.4],talk:o.sing?ce_sing(tt,o.sing[0],o.sing[1]):0,smile:o.smile==null?0.25:o.smile,covered:o.covered});
  ag_roomLight(x,1);
  const up=sg?ag_io(tt,sg[0],sg[1],0.5):0;
  if(sg){const m=[[352,640],[702,676],[1032,646]];m.forEach(([bx,by],i)=>ce_sound(x,bx,by-20,640+(i-1)*60,470,{t:tt+i*0.3,a:up*0.8}));}
  S.boys.forEach(([bx,by,bs,hc,tn],i)=>ce_boyBack(x,bx,by,bs,{hair:hc,turn:tn,up:0.25+up*0.25*(0.5+0.5*Math.sin(tt*2.1+i*1.7))}));}
// one master's way of singing the Alleluia: a card with its signs at his own heights; diff (0 to 1) rings the notes where the two differ
const CE_WAYS=[[2,3,5,5,6,4,2,1],[2,4,4,3,5,5,3,2]];
function ce_way(x,cx,cy,w,i,o){const a=o.a==null?1:o.a;if(a<=0)return;const h=170,bx=cx-(i===0?w+20:-20),ps=CE_WAYS[i],other=CE_WAYS[1-i];x.save();x.globalAlpha*=a;
  ag_about(x,bx+w/2,cy+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));ag_box(x,bx,cy,w,h,18,{});
  ps.forEach((p,k)=>{const px=bx+36+k*(w-72)/(ps.length-1),py=cy+124-p*13;x.fillStyle=rgba(CE_P.ink,1);x.save();x.translate(px,py);x.rotate(-0.45);x.beginPath();x.ellipse(0,0,8,6,0,0,TAU);x.fill();x.restore();
    if(p!==other[k]&&o.diff>0.01){x.strokeStyle=rgba(AG.amber,0.85*o.diff);x.lineWidth=2.6;x.beginPath();x.arc(px,py,15,0,TAU);x.stroke();}});
  ag_T(x,"Alleluia",bx+w/2,cy+h+46,{w:700,size:30,align:"center",col:CE_P.ink});x.restore();}
// about ten years, and still imperfectly: ten marks filling as fill goes 0 to 1
function ce_years(x,cx,cy,w,o){const a=o.a==null?1:o.a;if(a<=0)return;const h=230;x.save();x.globalAlpha*=a;ag_about(x,cx+w/2,cy+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));
  ag_box(x,cx,cy,w,h,22,{});ag_T(x,"LEARNING THE CHANTS BY EAR",cx+AG_PAD,cy+AG_PAD+22,{w:700,size:28,ls:4,col:AG.violet});
  ag_T(x,"About ten years",cx+AG_PAD,cy+AG_PAD+72,{w:700,size:36});
  for(let k=0;k<10;k++){const u=clamp(o.fill*10-k,0,1),bx=cx+AG_PAD+k*((w-2*AG_PAD)/10);ag_box(x,bx+4,cy+128,(w-2*AG_PAD)/10-8,40,8,{a:0.35+0.65*u,edge:u>0.5?AG_OAK.dark:null});
    if(u>0.01){x.fillStyle=rgba(AG_OAK.base,u);rr(x,bx+8,cy+132,(w-2*AG_PAD)/10-16,32,6);x.fill();}}
  ag_T(x,"and still imperfectly",cx+w-AG_PAD,cy+AG_PAD+72,{w:700,size:30,col:AG.amber,align:"right",a:o.imperf});x.restore();}
// by ear against from the page, in Guido's words: ten years, against a year, or two at most
function ce_tenYears(x,cx,cy,w,o){const a=o.a==null?1:o.a;if(a<=0)return;const h=300,bw=w-2*AG_PAD-300,seg=bw/10;x.save();x.globalAlpha*=a;ag_about(x,cx+w/2,cy+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));
  ag_box(x,cx,cy,w,h,22,{});ag_T(x,"IN GUIDO'S WORDS",cx+AG_PAD,cy+AG_PAD+22,{w:700,size:28,ls:4,col:AG.violet});
  const row=(yy,lab,n,dash,u,txt)=>{ag_T(x,lab,cx+AG_PAD,yy+12,{w:700,size:32});for(let k=0;k<n;k++){const v=clamp(u*n-k,0,1);if(v<=0)continue;const sx=cx+AG_PAD+300+k*seg;
      if(dash&&k===n-1){x.save();x.globalAlpha*=v;x.strokeStyle=rgba(AG_OAK.dark,0.9);x.lineWidth=2.4;x.setLineDash([7,7]);rr(x,sx+4,yy-18,seg-8,40,8);x.stroke();x.restore();}
      else{x.fillStyle=rgba(AG_OAK.base,v);rr(x,sx+4,yy-18,seg-8,40,8);x.fill();x.strokeStyle=rgba(AG_OAK.dark,0.6*v);x.lineWidth=1.6;rr(x,sx+4,yy-18,seg-8,40,8);x.stroke();}}
    ag_T(x,txt,cx+AG_PAD+300,yy+64,{w:600,size:28,col:AG.mut,a:clamp(u*2,0,1)});};
  row(cy+120,"By ear",10,false,o.ear,"about ten years");row(cy+226,"From the page",2,true,o.page,"a year, or two at most");x.restore();}
// the lines drawn on the page: the quill comes in as something has to change, draws four lines, the two coloured ones light with their
// letters, and the signs settle onto them one by one
function ce_drawLines(x,tt,P){const Q=CE_PAGE,dur=0.75,st=i=>P.lines-0.2+i*0.85,draw=[0,1,2,3].map(i=>clamp((tt-st(i))/dur,0,1));
  const settle=CE_SIGNS.map((g,i)=>clamp((tt-P.sits+0.1-i*0.16)/0.9,0,1));
  ce_staff(x,{draw,letters:[ag_in(tt,P.red-0.1,0.4),ag_in(tt,P.yellow-0.1,0.4)],glow:ag_io(tt,P.red-0.1,P.sits,0.5)});
  ce_chant(x,{settle});
  // the quill: in from the right, then along each line as it's drawn, then away
  let li=-1;for(let i=0;i<4;i++)if(tt>=st(i)-0.25)li=i;const into=ag_sine(clamp((tt-P.change-0.4)/1.4,0,1)),away=ag_sine(clamp((tt-st(3)-dur-0.1)/1.2,0,1));
  let qx=lerp(2100,Q.x[0]-80,into),qy=Q.line0+30;
  if(li>=0){const u=draw[li],y=Q.line0-li*2*Q.step;qx=lerp(Q.x[0]-80,Q.x[1],ag_sine(u));qy=y;if(u>=1&&li<3){const nu=clamp((tt-st(li)-dur)/(0.85-dur),0,1);qx=lerp(Q.x[1],Q.x[0]-80,ag_sine(nu));qy=lerp(y,y-2*Q.step,ag_sine(nu));}}
  ce_quill(x,lerp(qx,2200,away),lerp(qy,qy-200,away),{a:1-away});
  const op=ce_pop(tt,P.sits+1.2,null);ag_pill(x,1240,250,"each sign on a line, or a space",{a:op.a,size:30});}
// the old page, framed on the marble, and today's staff of five lines beside it
function ce_staves(x,tt,P){const fx=200,fy=200,fw=700,fh=380;
  ag_picture(x,fx,fy,fw,fh,{a:ag_in(tt,P.staff,0.6),draw:(c,X,Y,Wd,Hd)=>{c.fillStyle=rgba(CE_P.parch,1);c.fillRect(X,Y,Wd,Hd);
    c.save();c.translate(X,Y);const k=Wd/1500;c.scale(k,k);c.translate(-220,-330);ce_staff(c,{draw:[1,1,1,1],letters:1,deco:1});ce_chant(c,{lines:1});c.restore();}});
  const mx=1060,my=200,mw=660,mh=380,ma=ag_in(tt,P.staff+0.4,0.6);ag_box(x,mx,my,mw,mh,16,{a:ma});
  if(ma>0.01){x.save();x.globalAlpha*=ma;const five=ag_sine(clamp((tt-P.more+0.1)/1.0,0,1)),y0=my+250,sp=34;
    for(let i=0;i<5;i++){const u=i<4?1:five;if(u<=0)continue;x.strokeStyle="rgba(40,40,46,0.85)";x.lineWidth=2.2;x.beginPath();x.moveTo(mx+60,y0-i*sp);x.lineTo(lerp(mx+60,mx+mw-50,u),y0-i*sp);x.stroke();}
    const notes=[[0,2],[1,3],[2,4],[3,4],[4,5],[5,3],[6,2],[7,1]];x.fillStyle="rgba(30,30,34,1)";x.strokeStyle="rgba(30,30,34,1)";x.lineWidth=2.6;
    notes.forEach(([k,p])=>{const nx=mx+150+k*60,ny=y0-p*sp/2;x.save();x.translate(nx,ny);x.rotate(-0.35);x.beginPath();x.ellipse(0,0,13,9,0,0,TAU);x.fill();x.restore();
      x.beginPath();x.moveTo(nx+12,ny-3);x.lineTo(nx+12,ny-92);x.stroke();});
    x.restore();}
  ag_pill(x,fx+fw/2,fy+fh+110,"About 1025",{a:ag_in(tt,P.staff+0.3,0.5),size:30});ag_pill(x,mx+mw/2,my+mh+82,"Today",{a:ag_in(tt,P.today-0.2,0.5),size:30});}
// an agent reads only the page: the term on its card with nothing written for it; Mei with its meaning in her head; the agent's guess;
// then her meaning written onto the page (a dotted line from her card to it), and the agent reading it
function ce_onlyPage(x,tt,P){const ax=1560,ay=470,px=700,py=300,pw=560,h=250,fill=ag_in(tt,P.put+0.9,0.7),mei=ag_in(tt,P.someone-0.3,0.7),out=1-ag_in(tt,P.title-0.6,0.6);
  if(out<=0.004){ag_roomLight(x,1);return;}x.save();x.globalAlpha*=out;
  ag_modelLight(x,ax,ay,90,1,ay+250);ag_ring(x,ax,ay,150,{p:1,from:-90,arrows:[30,150,270]});
  ag_reach(x,[ax-150,ay,ax-220,ay,px+pw+80,py+110,px+pw+4,py+110],ag_sine(clamp((tt-P.agent-0.4)/1.2,0,1)),{grip:1,data:clamp((tt-P.reads+0.2)/1.6,0,1)*(1-ag_in(tt,P.someone,0.3))+clamp((tt-P.both)/1.6,0,1)});
  ag_model(x,ax,ay,90,{t:tt,core:1,think:0.6*ag_io(tt,P.guesses-0.4,P.put+0.4,0.4),label:"Agent"});
  if(mei>0.01){x.save();x.globalAlpha*=mei;ag_person(x,"mei",300,680,0.94,{t:tt,gaze:[2,-0.6],smile:0.2+0.2*fill});x.restore();}
  x.restore();ag_roomLight(x,1);x.save();x.globalAlpha*=out;
  // the page: its term, and where its meaning goes, dashed until it's written
  const pa=ag_in(tt,P.agent+0.2,0.5);ag_box(x,px,py,pw,h,22,{a:pa,edge:fill>0.5?AG.green:null,edgeA:0.7});
  if(pa>0.01){x.save();x.globalAlpha*=pa;ag_T(x,"ON THE PAGE",px+AG_PAD,py+AG_PAD+22,{w:700,size:28,ls:4,col:AG.blue});ag_T(x,"Commencing student",px+AG_PAD,py+AG_PAD+72,{w:700,size:36});
    if(fill<0.99){x.save();x.globalAlpha*=1-fill;x.strokeStyle=rgba(AG.amber,0.85);x.lineWidth=2.4;x.setLineDash([8,8]);rr(x,px+AG_PAD,py+124,pw-2*AG_PAD,90,14);x.stroke();x.restore();
      ag_T(x,"its meaning: not written",px+pw/2,py+180,{w:600,size:28,col:AG.amber,align:"center",a:1-clamp(fill/0.45,0,1)});}
    // one text, then the other, never both at once
    const nw=clamp((fill-0.45)/0.55,0,1);if(nw>0.01){ag_T(x,"its meaning, from its owner",px+AG_PAD,py+180,{w:600,size:30,col:AG.ink,a:nw});ag_tick(x,px+pw-52,py+60,26,rgba(AG.green,nw),4);}
    x.restore();}
  // in Mei's head: its meaning, on a card over her; at "put", a dotted line carries it onto the page
  const cp=ce_pop(tt,P.someone+0.2,null);ag_textCard(x,70,170,460,{kick:"In Mei's head",title:"What commencing means"},{kickCol:AG.blue,tail:{side:"bottom",at:0.5,px:300,py:420},k:cp.k,a:cp.a});
  const wr=ag_sine(clamp((tt-P.put)/0.9,0,1));if(wr>0.01){const p0=[540,250],p1=[620,250],p2=[640,py+170],p3=[px-6,py+170],N=40,n=Math.round(N*wr);
    x.save();x.strokeStyle=rgba(AG.blue,0.85);x.lineWidth=3;x.setLineDash([2,9]);x.lineCap="round";x.beginPath();
    for(let k=0;k<=n;k++){const u=k/N,v=1-u,X=v*v*v*p0[0]+3*v*v*u*p1[0]+3*v*u*u*p2[0]+u*u*u*p3[0],Y=v*v*v*p0[1]+3*v*v*u*p1[1]+3*v*u*u*p2[1]+u*u*u*p3[1];k?x.lineTo(X,Y):x.moveTo(X,Y);}
    x.stroke();x.restore();if(wr>0.97)ag_arrowHead(x,px-2,py+170,0,14,rgba(AG.blue,0.9));}
  // the agent's guess, from names alone, until the meaning is on the page
  const gp=ce_pop(tt,P.guesses-0.2,P.both-0.3);ag_textCard(x,1320,680,480,{kick:"A guess",title:"commencing = ?"},{edge:AG.violet,kickCol:AG.violet,k:gp.k,a:gp.a,tail:{side:"top",at:0.5,px:ax,py:ay+96}});
  x.restore();}

/* ---------------------------------------------------------------- the room, today
   Chapters 2 to 7 share the module's room: Jun at his desk on the left, the agent's ring right of the middle, its three tools down the
   right (CE_ROOM); the cards each chapter needs come and go between them. Things first, then the room's light, then cards and words. */
const ce_steps=(tt,t0,d)=>t0==null||tt<t0?-1:Math.floor((tt-t0)/d)%3;   // the lit step while the agent works round its ring
const CE_Q={kick:"From Planning · Clara Jensen",title:"How many of the 18,412 students on census day were commencing?",sub:"for next year's plan"};

// ---- 2 · A word nobody wrote down: Clara's question; the agent reads what its tools reach; no meaning anywhere; a guess, sure of itself ----
scene("word",(ctx,S,t,sc)=>{const c=sc.cues,P=ce_once(sc,"P",()=>({asks:wAt(sc,"today","asks"),plan:wAt(sc,"today","plan"),com:wAt(sc,"ask","commencing"),
    gives:c.gives-0.4,agent:wAt(sc,"gives","agent"),tools:wAt(sc,"gives","tools"),read:wAt(sc,"gives","read"),reads:c.reads,tables:wAt(sc,"reads","tables"),
    code:wAt(sc,"reads","code"),docs:wAt(sc,"reads","docs"),nothing:c.nothing,means:wAt(sc,"nothing","means"),names:wAt(sc,"names","names"),must:wAt(sc,"names","must"),
    counts:wAt(sc,"count","counts"),query:wAt(sc,"count","query"),sure:wAt(sc,"count","sure")}));
  ce_shots(ctx,S,t,sc.dur,[
    // Clara asks Jun, for next year's plan; the word in it
    {at:0,place:"lab",keys:[[0,960,540,1],[0.1,950,530,1.03]],d:8,push:0.01,draw:(x,tt)=>{ce_jun(x,tt,{gaze:[2,-1.2]});
      ag_person(x,"clara",1560,650,0.94,{t:tt,flip:true,talk:ag_talk(sc,"ask",tt)*0.7,gaze:[2,0.2],smile:0.3});ag_roomLight(x,1);
      const q=ce_pop(tt,P.asks-0.1,null);ag_textCard(x,560,170,680,CE_Q,{kickCol:AG.blue,tail:{side:"right",at:0.75,px:1400,py:430},k:q.k,a:q.a});
      ce_dash(x,900,560,"commencing",{a:ag_in(tt,P.com-0.1,0.4)});}},
    // Jun gives it to his agent: its tools, each read only; it reads what they reach; nothing says what the word means; it guesses, and counts
    {cut:true,at:P.gives,place:"lab",keys:[[P.gives,960,540,1],[P.gives+0.1,960,530,1.02]],d:30,push:0.01,draw:(x,tt)=>ce_reads(x,tt,P)}]);
  ce_kick(ctx,t,[[0,"Today"]],ag_in(t,0.2,0.6));});
function ce_reads(x,tt,P){const ring=ag_in(tt,P.agent-0.4,1.2),arm=i=>clamp((tt-[P.tables,P.code,P.docs][i]+0.3)/1.1,0,1),back=i=>clamp((tt-[P.tables,P.code,P.docs][i]-0.6)/1.6,0,1),
    guess=ag_in(tt,P.names-0.1,0.6),done=ag_in(tt,P.counts,0.5);
  CE_ROOM.tools.forEach((tl,i)=>{const s=ag_in(tt,P.tools-0.3+i*0.25,0.6);ce_tool(x,i,{a:s,dx:(1-s)*60,touch:arm(i)>0.95&&back(i)<1?1:0});if(arm(i)>0)ag_reach(x,ce_arm(i),ag_sine(arm(i)),{grip:1,data:back(i)});});
  if(ring>0){const lit=guess>0.5?0:ce_steps(tt,P.reads,0.6);ce_agent(x,tt,{p:ring,core:ring,a:ring,lit:done>0.5?2:lit,col:AG.violet,think:guess*(1-done),stepA:[ring,ring,ring]});}
  ce_jun(x,tt,{gaze:tt<P.counts?[3,-0.6]:[3,-1.0],nod:0});
  ag_roomLight(x,1);
  const g=ce_pop(tt,P.gives+0.2,null);ag_textCard(x,440,130,420,{kick:"Goal",title:"How many were commencing?"},{kickCol:AG.blue,tail:{side:"bottom",at:0.1,px:420,py:390},k:g.k,a:g.a*(1-ag_in(tt,P.counts-0.3,0.4))});
  // what Catalog brings back: the tables and their columns, names and nothing more
  const ca=ce_pop(tt,P.tables+0.6,P.nothing+0.1);ce_code(x,900,90,560,"Catalog · core_learner",["learner_key","status","enrolled_award_key","valid_from"],{k:ca.k,a:ca.a,edge:AG.blue});
  // what Docs brings back: nothing on the word
  const da=ce_pop(tt,P.docs+0.6,P.names-0.1);ag_textCard(x,900,110,560,{kick:"Docs",title:"Nothing on “commencing”"},{kickCol:AG.blue,edge:AG.amber,k:da.k,a:da.a*ag_in(tt,P.nothing,0.3)});
  ce_dash(x,1090,770,"commencing = ?",{a:ag_io(tt,P.means-0.2,P.names-0.4,0.4),col:AG.amber});
  // its guess, from the names, and its count, with its query attached and no doubt in it
  const gp=ce_pop(tt,P.names,null);ag_textCard(x,700,700,780,{kick:"Reasoning from the names",title:"commencing = enrolment began this year"},{edge:AG.violet,kickCol:AG.violet,tail:{side:"top",at:0.62,px:1124,py:600},k:gp.k,a:gp.a});
  const ap=ce_pop(tt,P.counts-0.1,null);ag_evidence(x,440,110,540,{kick:"Answer",title:"6,931 students were commencing"},[{kick:"Query",title:"enrolment began in 2026",col:AG.orange}],
    {clip:"Query attached",open:clamp((tt-P.query)/1.0,0,1),side:"right",ew:300,k:ap.k,a:ap.a});}

// ---- 3 · In one head, and one inbox: the query runs, but means the wrong thing; Mei knows; 719 coming back; an email from 2021 ----
scene("inbox",(ctx,S,t,sc)=>{const c=sc.cues,P=ce_once(sc,"P",()=>({runs:wAt(sc,"query","runs"),means:wAt(sc,"query","means"),asks:c.asks-0.3,mei:wAt(sc,"asks","Mei"),
    knows:wAt(sc,"knows","knows"),first:wAt(sc,"knows","first"),back:c.back,coming:wAt(sc,"back","coming"),rule:wAt(sc,"back","rule"),
    right:c.right-0.3,were:wAt(sc,"right","were"),num:wAt(sc,"right","right"),harm:c.harm,email:c.email-0.4,written:wAt(sc,"email","written"),moved:wAt(sc,"email","moved"),
    inbox:c.inbox,head:wAt(sc,"inbox","head"),one:wAt(sc,"inbox","inbox"),agent:wAt(sc,"inbox","agent"),careless:c.careless-0.4,reads:wAt(sc,"careless","reads"),writes:wAt(sc,"careless","writes")}));
  ce_shots(ctx,S,t,sc.dur,[
    // the query, close: careful, and it runs; but what does the word mean?
    {at:0,place:"lab",keys:[[0,960,540,1],[0.1,960,520,1.04]],d:5,push:0.01,draw:(x,tt)=>{ce_jun(x,tt,{gaze:[3,-0.9]});ag_roomLight(x,1);
      ce_code(x,560,130,860,"The agent's query",["select count(*) from core_learner","where status = 'studying'","  and valid_from <= census_date","  and year(valid_from) = 2026"],
        {k:1,a:ag_in(tt,0.2,0.5),hi:{from:3,to:3,col:AG.violet,a:ag_in(tt,P.means-0.3,0.5)}});
      ag_pill(x,820,520,"it runs",{icon:"tick",col:AG.green,a:ag_in(tt,P.runs-0.1,0.4)});ag_pill(x,1180,520,"but what does it mean?",{icon:"warn",col:AG.amber,a:ag_in(tt,P.means-0.2,0.4)});}},
    // Jun asks Mei, in the registrar's office; she knows at once; coming back isn't commencing, by the government's rule too
    {cut:true,at:P.asks,place:"lab",keys:[[P.asks,960,540,1],[P.asks+0.1,960,530,1.03]],d:16,push:0.01,draw:(x,tt)=>{ce_jun(x,tt,{gaze:[2.5,-0.5],nod:0.06*ag_io(tt,P.back+1,P.back+2,0.3)});
      ag_person(x,"mei",1560,650,0.94,{t:tt,flip:true,talk:Math.max(ag_talk(sc,"knows",tt),ag_talk(sc,"back",tt))*0.7,gaze:[2,0.3],smile:0.35});ag_roomLight(x,1);
      const n=ce_pop(tt,P.mei,null);ag_pill(x,1560,190,"Mei Tanaka · registrar's office",{a:n.a,size:28});
      const k=ce_pop(tt,P.knows,null);ag_textCard(x,520,150,760,{kick:"Commencing",title:"Starting a course at the university for the first time"},{kickCol:AG.blue,tail:{side:"right",at:0.6,px:1420,py:400},k:k.k,a:k.a});
      const b=ce_pop(tt,P.coming-0.3,null);ag_textCard(x,520,430,760,{title:"Coming back after leave or a break isn't commencing"},{tail:{side:"right",at:0.3,px:1420,py:420},k:b.k,a:b.a});
      ag_pill(x,900,690,"the government's rule too",{a:ag_in(tt,P.rule-0.3,0.4),size:30});}},
    // the count, worked out: 6,931, of whom 719 were coming back: 6,212; and what the wrong one would have done
    {cut:true,at:P.right,place:"lab",keys:[[P.right,960,540,1],[P.right+0.1,960,530,1.02]],d:6,push:0.01,draw:(x,tt)=>{ag_roomLight(x,1);
      const cp=ce_pop(tt,P.right+0.2,null);ce_calc(x,560,200,800,[ag_in(tt,P.right+0.3,0.4),ag_in(tt,P.were-0.2,0.4),ag_in(tt,P.num-0.1,0.4)],{k:cp.k,a:cp.a});
      const h=ce_pop(tt,P.harm,null);ag_textCard(x,560,590,800,{kick:"In next year's plan",title:"719 new students who weren't new"},{kickCol:AG.amber,edge:AG.amber,k:h.k,a:h.a});}},
    // the meaning, written once: an email from 2021, to someone who has since moved on; in one head and one inbox, out of the agent's reach
    {cut:true,at:P.email,place:"lab",keys:[[P.email,960,540,1],[P.email+0.1,960,530,1.03]],d:14,push:0.01,draw:(x,tt)=>ce_oneInbox(x,tt,P)}]);
  ce_kick(ctx,t,[[0,"Today"]],1);});
function ce_oneInbox(x,tt,P){const into=ag_in(tt,P.one-0.4,1.0),ib=[900,700],cl=ag_in(tt,P.careless,0.6),mv=ag_sine(clamp((tt-P.careless-0.1)/1.5,0,1)),
    ax=lerp(1560,960,mv),ay=lerp(430,330,mv);
  // the agent, over on the right: its hand reaches for the inbox and stops short
  const reach=ag_sine(clamp((tt-P.agent+0.5)/1.2,0,1))*(1-0.25*ag_in(tt,P.agent+0.8,0.6));
  ag_modelLight(x,ax,ay,80,1,ay+240);if(cl<0.99)ag_reach(x,[ax-80,ay+30,ax-200,ay+120,1220,640,1100,650],reach*0.78*(1-cl),{grip:0.3});ag_model(x,ax,ay,80,{t:tt,core:1,label:"Agent"});
  x.save();x.globalAlpha*=1-cl;ag_person(x,"mei",340,660,0.94,{t:tt,gaze:[2,0.6]});x.restore();ag_roomLight(x,1);
  ce_inbox(x,ib[0],ib[1],380,{mail:ag_in(tt,P.inbox-0.2,0.8),a:ag_in(tt,P.inbox-0.4,0.5)*(1-cl)});
  // the email, written once; as it goes, a letter carries it down into the inbox
  const ea=ag_in(tt,P.email+0.3,0.4)*(1-clamp(into/0.15,0,1));
  ag_textCard(x,520,170,760,{kick:"Email · 2021",title:"Re: what “commencing” means",sub:"From Mei, to someone in Planning who has since moved on"},{a:ea,kickCol:AG.blue});
  const lt=ce_fly(into,{x:900,y:260,s:1},{x:ib[0],y:ib[1]-60,s:0.7}),la=clamp(into/0.15,0,1)*(1-clamp((into-0.85)/0.15,0,1));if(la>0.01)ce_letter(x,lt.x,lt.y,170*lt.s,la);
  ag_pill(x,340,240,"in one head",{a:ag_io(tt,P.head-0.2,P.careless,0.4),size:30});ag_pill(x,ib[0],ib[1]+96,"and one inbox",{a:ag_io(tt,P.one+0.4,P.careless,0.4),size:30});
  ag_pill(x,1260,560,"out of its reach",{icon:"warn",col:AG.amber,a:ag_io(tt,P.agent+0.6,P.careless,0.4),size:30});
  // what it read decides what it wrote: the agent between the two
  if(cl>0.01){const r=ce_pop(tt,P.reads-0.3,null),w=ce_pop(tt,P.writes-0.3,null);
    ag_textCard(x,140,250,520,{kick:"What it read",title:"Tables, columns, code, docs",sub:"no meaning for the word"},{kickCol:AG.blue,edge:AG.blue,k:r.k,a:r.a*cl});
    ag_textCard(x,1260,250,520,{kick:"What it wrote",title:"A guess: 6,931",sub:"said like a fact"},{kickCol:AG.violet,edge:AG.violet,k:w.k,a:w.a*cl});
    for(const [x0,x1,t0] of [[672,866,P.reads],[1054,1248,P.writes]]){const u=ag_in(tt,t0,0.5)*cl;if(u<=0.01)continue;x.save();x.globalAlpha*=u;x.strokeStyle=rgba(AG.mut,0.6);x.lineWidth=3;
      x.beginPath();x.moveTo(x0,ay);x.lineTo(x1-10,ay);x.stroke();ag_arrowHead(x,x1-6,ay,0,14,rgba(AG.mut,0.8));x.restore();}}}
// a letter, closed, centred at (x, y), w wide; a
function ce_letter(x,cx,cy,w,a){const h=w*0.62;x.save();x.globalAlpha*=a;ag_floorShadow(x,cx+6,cy+h/2+18,w*0.42,10,0.18);
  ag_box(x,cx-w/2,cy-h/2,w,h,8,{});x.strokeStyle="rgba(120,110,96,0.45)";x.lineWidth=2;x.beginPath();x.moveTo(cx-w/2+8,cy-h/2+8);x.lineTo(cx,cy+4);x.lineTo(cx+w/2-8,cy-h/2+8);x.stroke();x.restore();}

// ---- 4 · What an agent reads: its context, in four kinds; the word missing from the metadata; context engineering ----
scene("reads",(ctx,S,t,sc)=>{const c=sc.cues,P=ce_once(sc,"P",()=>({context:wAt(sc,"context","context"),four:wAt(sc,"context","four"),code:wAt(sc,"code","Code"),
    meta:wAt(sc,"meta","Metadata"),skills:wAt(sc,"skills","Skills"),tools:wAt(sc,"tools","tools"),missing:wAt(sc,"missing","missing"),guess:wAt(sc,"missing","guess"),
    fact:wAt(sc,"missing","fact"),eng:c.engineering,choosing:wAt(sc,"engineering","Choosing"),writing:wAt(sc,"engineering","writing"),ce:wAt(sc,"engineering","engineering")}));
  ce_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,960,540,1],[0.1,960,530,1.03]],d:sc.dur,push:0.01,draw:(x,tt)=>{ag_roomLight(x,1);
    const on=[P.code,P.meta,P.skills,P.tools].map(w=>ag_in(tt,w-0.2,0.9)),data=[P.code,P.meta,P.skills,P.tools].map(w=>clamp((tt-w-0.6)/1.6,0,1));
    // the agent comes down from where the last chapter left it (960, 330, 80 across) once the chapters' crossfade is over
    const dn=ag_sine(clamp((tt-0.8)/1.2,0,1));
    ce_context(x,tt,on,{data,miss:ag_in(tt,P.missing-0.2,0.5),guess:ag_in(tt,P.guess,0.6),think:0.6*ag_io(tt,P.guess-0.2,P.eng,0.4),lit:tt>P.missing-0.2&&tt<P.eng?1:null,label:"Agent",
      at:[960,lerp(330,470,dn)],r:lerp(80,96,dn)});
    ag_label(x,960,110,"Its context",{align:"center",col:AG.blue,a:ag_in(tt,P.context-0.1,0.5)});
    const e=ce_pop(tt,P.choosing-0.2,null);ag_textCard(x,640,680,640,{kick:"Context engineering",title:"Choosing what goes in, and writing it down"},{kickCol:AG.blue,edge:AG.blue,k:e.k,a:e.a});}}]);
  ce_kick(ctx,t,[[0,"Today"]],1);});

// ---- 5 · On the page: Mei writes it once, in the glossary; the project copies it, with its source; a test; the contract; a rule ----
const CE_YAML=["- name: commencing_student","  owner: Mei Tanaka, registrar's office","  source:","    term: Commencing student","    synced_on: 2026-11-04"];
const CE_COL=["is_commencing      boolean","  {{ doc(\"commencing_student\") }}"];
const CE_CONTRACT=["- name: is_commencing","  logicalType: boolean","  required: true","  description: 'True when the learner was a commencing student in this",
  "    award on the census date. **Commencing student.** A student who","    started a course at the university for the first time in the year …'"];
const CE_RULE=["Before you count by a word, look up what it means: in the business","glossary, and in the conceptual model that copies its term with",
  "source: (decision DEC-PRJ-11). A column's name is a hint, not a meaning.","If the word isn't there, don't guess: ask its owner."];
// the glossary's definition, word for word (the example project's skills/sync-the-glossary/example_glossary.json)
const CE_DEF="A student who started a course at the university for the first time in the year being counted. A student who comes back to a course they had already started, after leave or a break, isn't commencing.";
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,P=ce_once(sc,"P",()=>({writes:wAt(sc,"glossary","writes"),glossary:wAt(sc,"glossary","glossary"),owns:wAt(sc,"glossary","owns"),
    copy:c.copy-0.4,copies:wAt(sc,"copy","copies"),where:wAt(sc,"copy","where"),column:wAt(sc,"copy","column"),test:c.test-0.4,four:wAt(sc,"test","four"),
    new_:wAt(sc,"test","new"),back:wAt(sc,"test","back"),second:wAt(sc,"test","second"),last:wAt(sc,"test","last"),contract:c.contract-0.4,promises:wAt(sc,"contract","promises"),
    says:wAt(sc,"contract","says"),rule:c.rule-0.4,look:wAt(sc,"rule","look"),ask:wAt(sc,"rule","ask"),guess:wAt(sc,"rule","guess")}));
  ce_shots(ctx,S,t,sc.dur,[
    // Mei writes the meaning in the business glossary, once, and owns it
    {at:0,place:"lab",keys:[[0,960,540,1],[0.1,960,530,1.03]],d:8,push:0.01,draw:(x,tt)=>{ag_person(x,"mei",330,660,0.94,{t:tt,gaze:[2.5,-0.3],smile:0.35});ag_roomLight(x,1);
      const g=ce_pop(tt,P.writes-0.1,null);ag_textCard(x,700,170,1000,{kick:"Business glossary",title:"Commencing student",sub:CE_DEF},
        {kickCol:AG.blue,edge:AG.blue,k:g.k,a:g.a});
      ag_pill(x,1200,580,"Owner: Mei Tanaka, registrar's office",{a:ag_in(tt,P.owns-0.2,0.4),size:30});}},
    // the project copies it into Planning's data, with where it came from; a new column carries it
    {cut:true,at:P.copy,place:"lab",keys:[[P.copy,960,540,1],[P.copy+0.1,960,530,1.02]],d:7,push:0.01,draw:(x,tt)=>{ag_roomLight(x,1);
      // the glossary's card, where the last shot left it: its definition fades, then it moves aside and shrinks, so it never shows twice
      const df=ag_in(tt,P.copy+0.35,0.25),mv=ag_sine(clamp((tt-P.copy-0.5)/0.6,0,1));
      if(df<1)ag_textCard(x,700,170,1000,{kick:"Business glossary",title:"Commencing student",sub:CE_DEF},{kickCol:AG.blue,edge:AG.blue,a:1-df});
      if(df>0)ag_textCard(x,lerp(700,100,mv),lerp(170,250,mv),lerp(1000,420,mv),{kick:"Business glossary",title:"Commencing student"},{kickCol:AG.blue,edge:AG.blue,a:df});
      const ar=ag_in(tt,P.copies-0.2,0.6);if(ar>0.01){x.save();x.globalAlpha*=ar;x.strokeStyle=rgba(AG.blue,0.7);x.lineWidth=3;x.beginPath();x.moveTo(530,330);x.lineTo(lerp(530,640,ar),330);x.stroke();ag_arrowHead(x,lerp(530,640,ar)+4,330,0,14,rgba(AG.blue,0.9));x.restore();}
      const y=ce_pop(tt,P.copies,null);ce_code(x,660,170,1160,"models/marts/planning/_planning__conceptual.yml",CE_YAML,{path:true,k:y.k,a:y.a,hi:{from:2,to:4,col:AG.blue,a:ag_in(tt,P.where-0.2,0.5)}});
      const cl=ce_pop(tt,P.column-0.2,null);ce_code(x,660,560,1160,"Planning's data · mart_planning__near_award",CE_COL,{k:cl.k,a:cl.a,edge:AG.green});}},
    // a test on four students: one new, one back from leave, one starting a second course, one who began last year
    {cut:true,at:P.test,place:"lab",keys:[[P.test,960,540,1],[P.test+0.1,960,530,1.02]],d:10,push:0.01,draw:(x,tt)=>{ag_roomLight(x,1);
      const p=ce_pop(tt,P.test+0.2,null);ce_tests(x,360,190,1200,[ag_in(tt,P.new_,0.4),ag_in(tt,P.back,0.4),ag_in(tt,P.second,0.4),ag_in(tt,P.last,0.4)],{k:p.k,a:p.a});
      ag_pill(x,960,700,"4 of 4 pass",{icon:"tick",col:AG.green,a:ag_in(tt,P.last+1.2,0.4)});}},
    // Planning's contract promises the column, and what it means
    {cut:true,at:P.contract,place:"lab",keys:[[P.contract,960,540,1],[P.contract+0.1,960,530,1.02]],d:6,push:0.01,draw:(x,tt)=>{ag_roomLight(x,1);
      const p=ce_pop(tt,P.contract+0.2,null);ce_code(x,230,220,1460,"governance/5-data-contracts/mart_planning__near_award.yaml",CE_CONTRACT,{path:true,k:p.k,a:p.a,hi:{from:3,to:5,col:AG.blue,a:ag_in(tt,P.says-0.2,0.5)}});}},
    // the notes for agents gain a rule
    {cut:true,at:P.rule,place:"lab",keys:[[P.rule,960,540,1],[P.rule+0.1,960,530,1.02]],d:8,push:0.01,draw:(x,tt)=>{ag_roomLight(x,1);
      const p=ce_pop(tt,P.rule+0.2,null);ce_note(x,230,220,1460,{k:p.k,a:p.a,hi:ag_in(tt,P.ask-0.3,0.5)});}}]);
  ce_kick(ctx,t,[[0,"Today"]],1);});
// the project's notes for agents, AGENTS.md, and its new rule (in the project at lines 88 to 94)
function ce_note(x,cx,cy,w,o){const a=o.a==null?1:o.a;if(a<=0)return;const lh=44,h=AG_PAD*2+44+52+CE_RULE.length*lh;x.save();x.globalAlpha*=a;ag_about(x,cx+w/2,cy+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));
  ag_box(x,cx,cy,w,h,22,{edge:AG.blue,edgeA:0.6});ag_T(x,"AGENTS.md",cx+AG_PAD,cy+AG_PAD+22,{w:500,size:28,f:"mono",col:AG.blue});ag_T(x,"What words mean",cx+AG_PAD,cy+AG_PAD+78,{w:800,size:40});
  const y0=cy+AG_PAD+78+56;if(o.hi>0.01){x.save();x.globalAlpha*=o.hi;x.fillStyle=rgba(AG.blue,0.1);rr(x,cx+14,y0+(CE_RULE.length-1)*lh-32,w-28,lh+6,10);x.fill();x.fillStyle=rgba(AG.blue,0.9);rr(x,cx+14,y0+(CE_RULE.length-1)*lh-32,6,lh+6,3);x.fill();x.restore();}
  CE_RULE.forEach((l,i)=>ag_T(x,l,cx+AG_PAD,y0+i*lh,{w:i===CE_RULE.length-1?700:500,size:30,col:AG.ink}));x.restore();}

// ---- 6 · One context for the team: each agent its owner's, with notes of its own; then one context, reviewed like code, owned ----
const CE_TEAM=[["jun",360,"Jun's notes","commencing: enrolled this year"],["clara",960,"Clara's notes","commencing: a new student number"],["sam",1560,"Sam's notes","commencing: first year of a degree"]];
scene("team",(ctx,S,t,sc)=>{const c=sc.cues,P=ce_once(sc,"P",()=>({wired:wAt(sc,"before","wired"),notes:wAt(sc,"before","notes"),chant:wAt(sc,"masters","chant"),
    owner:wAt(sc,"masters","owner's"),told:wAt(sc,"masters","told"),one:c.one-0.4,keeps:wAt(sc,"one","keeps"),reviewed:wAt(sc,"one","reviewed"),owner2:wAt(sc,"one","owner"),
    every:wAt(sc,"same","agent"),reads:wAt(sc,"same","reads"),change:c.change,changes:wAt(sc,"change","changes"),once:wAt(sc,"change","once"),new_:wAt(sc,"change","new")}));
  ce_shots(ctx,S,t,sc.dur,[
    // until now: each person's own agent, with notes of its own, each a little different, like the chant books named after their masters
    {at:0,place:"lab",keys:[[0,960,540,1],[0.1,960,530,1.02]],d:14,push:0.01,draw:(x,tt)=>{ce_team(x,tt,{gaze:0});ag_roomLight(x,1);
      ce_teamNotes(x,tt,CE_TEAM.map((m,i)=>ce_pop(tt,P.notes-0.6+i*0.35,null)),ag_in(tt,P.chant-0.2,0.6));}},
    // now: one context, in the project, reviewed like code, an owner for every meaning; every agent and every person reads the same page
    {cut:true,at:P.one,place:"lab",keys:[[P.one,960,540,1],[P.one+0.1,960,530,1.02]],d:18,push:0.01,draw:(x,tt)=>{
      const rd=ag_in(tt,P.every-0.4,0.8),ch=ag_io(tt,P.changes-0.1,sc.dur+1,0.4);ce_team(x,tt,{own:0,read:rd,data:clamp((tt-P.once)/1.6,0,1),gaze:rd});ag_roomLight(x,1);ce_project(x,tt,P,ch);}}]);
  ce_kick(ctx,t,[[0,"Today"]],1);});
// the three people along the foot of the frame, each with their own agent by their head; o.read (0 to 1) each agent's arm reaching up
// to the one context, o.data the meaning coming down to all three at once, o.gaze (0 to 1) their eyes going up to it
function ce_team(x,tt,o){CE_TEAM.forEach(([who,px],i)=>{const ax=px+150,ay=520,up=o.read||0;
  ag_modelLight(x,ax,ay,40,0.8,null);
  if(up>0.01)ag_reach(x,[ax,ay-40,ax,ay-100,lerp(ax,960,0.6),436,lerp(ax,960,0.85),424],ag_sine(up),{grip:1,data:o.data||0,k:0.8});
  ag_model(x,ax,ay,40,{t:tt+i,core:0.9});
  ag_person(x,who,px,820,0.7,{t:tt,gaze:[2,-1.6*(o.gaze||0)-0.4],flip:i===2});});}
// each agent's own notes, a card above it with its owner's name; book (0 to 1) puts a small chant book on each, named after its owner
// as the masters' were
function ce_teamNotes(x,tt,pops,book){CE_TEAM.forEach(([who,px,kick,note],i)=>{const p=pops[i];
  const b=ag_textCard(x,px-200,150,440,{kick,title:note},{kickCol:AG.mut,tail:{side:"bottom",at:0.8,px:px+150,py:478},k:p.k,a:p.a});
  if(book>0.01&&p.a>0.01)ce_book(x,px+180,190,84,null,{a:book*p.a,seed:3+i*4});});}
// the one context: the project's card, its four kinds, reviewed like code, and the term with its owner; ch (0 to 1) its one change
function ce_project(x,tt,P,ch){const p=ce_pop(tt,P.keeps-0.2,null),cx=560,cy=60,w=800,h=360;x.save();x.globalAlpha*=p.a;ag_about(x,cx+w/2,cy+h/2,lerp(0.5,1,clamp(p.k,0,1.2)));
  ag_box(x,cx,cy,w,h,24,{edge:AG.blue,edgeA:0.75});ag_T(x,"THE PROJECT · ONE CONTEXT",cx+AG_PAD,cy+AG_PAD+22,{w:700,size:28,ls:4,col:AG.blue});
  ["Code","Metadata","Skills","Tools"].forEach((k,i)=>ag_pill(x,cx+110+i*193,cy+128,k,{size:28,col:AG.blue}));
  const rv=ag_in(tt,P.reviewed-0.2,0.4);ag_pill(x,cx+210,cy+218,"reviewed like code",{icon:"tick",col:AG.green,a:rv,size:28});
  const ow=ag_in(tt,P.owner2-0.2,0.4);ag_box(x,cx+AG_PAD,cy+262,w-2*AG_PAD,72,16,{a:ow,edge:ch>0.5?AG.green:null});
  if(ow>0.01){ag_T(x,"Commencing student",cx+AG_PAD+24,cy+308,{w:700,size:30,a:ow});ag_T(x,"owner: Mei Tanaka",cx+w-AG_PAD-24,cy+308,{w:600,size:28,col:AG.mut,align:"right",a:ow});}
  if(ch>0.01)ag_pill(x,cx+w-200,cy+218,"changed once",{icon:"draft",col:AG.blue,a:ch,size:28});
  x.restore();}

// ---- 7 · A verse never heard: the agent looks the word up and counts 6,212, citing Mei's definition; a new analyst reads it too ----
scene("verse",(ctx,S,t,sc)=>{const c=sc.cues,P=ce_once(sc,"P",()=>({asks:wAt(sc,"again","asks"),looks:wAt(sc,"looks","looks"),counts:wAt(sc,"looks","counts"),cites:wAt(sc,"looks","cites"),
    newA:c.new-0.4,analyst:wAt(sc,"new","analyst"),reads:wAt(sc,"new","reads"),agent:wAt(sc,"new","agent"),boys:c.boys-0.4,guido:wAt(sc,"boys","Guido's"),both:wAt(sc,"boys","both"),
    once:c.once,end:c.breath+0.2}));
  ce_shots(ctx,S,t,sc.dur,[
    // Jun asks again; this time the agent looks the word up in Docs, counts with Query, and cites Mei's definition
    // a later moment in the same room (later:true): the team leaves, then Jun at his desk comes in, as the camera glides on
    {later:true,at:0,place:"lab",keys:[[0,960,540,1],[0.1,955,535,1.02]],d:10,push:0.01,draw:(x,tt)=>ce_again(x,tt,P)},
    // a new analyst in Planning reads the same definition her agent reads. A later moment in the lab: Jun's desk leaves before hers comes
    // in (dissolved one into the other, the two desks and the agent showed twice)
    {later:true,at:P.newA,place:"lab",keys:[[P.newA,960,540,1],[P.newA+0.1,950,530,1.03]],d:7,push:0.01,draw:(x,tt)=>{
      const ax=1000,ay=470;ag_modelLight(x,ax,ay,56,1,null);ag_reach(x,[ax-56,ay+10,ax-110,ay+40,880,420,850,410],ag_sine(clamp((tt-P.agent+0.6)/1.0,0,1)),{grip:1,data:clamp((tt-P.agent)/1.6,0,1),k:0.8});
      ag_model(x,ax,ay,56,{t:tt,core:1});
      ce_desk(x,CE_LUCIA,1460,640,0.98,1060,1010,860,{t:tt,flip:true,gaze:[2.5,0.4],smile:0.3});
      ce_screen(x,200,190,640,380,{a:1});ag_roomLight(x,1);
      const n=ce_pop(tt,P.analyst-0.2,null);ag_textCard(x,1290,110,500,{title:"Lucía Ortega",sub:"Planning · new this week"},{tail:{side:"bottom",at:0.3,px:1450,py:330},k:n.k,a:n.a});}},
    // like Guido's boys: the school, framed on the marble
    {cut:true,at:P.boys,place:"lab",keys:[[P.boys,960,520,1.02],[P.boys+0.1,960,510,1.05]],d:6,push:0.01,draw:(x,tt)=>{ag_roomLight(x,1);
      ag_picture(x,460,170,1000,562,{a:ag_in(tt,P.boys,0.6),img:ag_place("ceSchool"),draw:(c,X,Y,Wd,Hd)=>{c.save();c.translate(X,Y);c.scale(Wd/W,Hd/H);ce_bookLines(c,1);
        ce_school(c,tt,{who:CE_PEOPLE.guido,smile:0.45,singing:[P.boys,P.end+4],covered:true});c.restore();}});}}]);
  ce_kick(ctx,t,[[0,"Today"],[P.end-0.4,null]],1);
  ag_end(ctx,S,t,P.end,CE_TITLE,"Write it down once, and people and agents both use it.","Film 1 of 9","Agents at work on data");});
function ce_again(x,tt,P){const docs=clamp((tt-P.looks+0.2)/1.0,0,1),docB=clamp((tt-P.looks-0.6)/1.4,0,1),q=clamp((tt-P.counts+0.4)/1.0,0,1),qB=clamp((tt-P.counts+0.4)/1.4,0,1);
  CE_ROOM.tools.forEach((tl,i)=>{const u=i===2?docs:i===1?q:0,b=i===2?docB:i===1?qB:0;ce_tool(x,i,{touch:u>0.95&&b<1?1:0});if(u>0)ag_reach(x,ce_arm(i),ag_sine(u),{grip:1,data:b});});
  ce_agent(x,tt,{lit:tt>P.cites?2:ce_steps(tt,P.looks-0.4,0.6),col:tt>P.cites?AG.green:AG.violet});
  ce_jun(x,tt,{gaze:[3,-0.8],nod:0.07*ag_io(tt,P.cites+0.6,P.cites+1.4,0.3),smile:0.25*ag_in(tt,P.cites+0.6,0.8)});ag_roomLight(x,1);
  const g=ce_pop(tt,P.asks-0.2,P.counts);ag_textCard(x,440,130,420,{kick:"Goal",title:"How many were commencing?"},{kickCol:AG.blue,tail:{side:"bottom",at:0.1,px:420,py:390},k:g.k,a:g.a});
  const d=ce_pop(tt,P.looks+0.5,P.cites+0.2);ag_textCard(x,900,90,560,{kick:"Docs · business glossary",title:"Commencing student",sub:"Owner: Mei Tanaka"},{kickCol:AG.blue,edge:AG.green,icon:"tick",k:d.k,a:d.a});
  const ap=ce_pop(tt,P.cites-0.4,null);ag_evidence(x,440,110,560,{kick:"Answer",title:"6,212 students were commencing"},
    [{kick:"Definition",title:"Commencing student, Mei Tanaka",col:AG.blue},{kick:"Query",title:"6,212 of 18,412",col:AG.orange},{kick:"Test",title:"4 of 4 cases pass",col:AG.green}],
    {open:clamp((tt-P.cites)/1.6,0,1),side:"right",ew:300,k:ap.k,a:ap.a});}

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["word","inbox","reads","page","team","verse"]);
