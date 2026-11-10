/* ===== Design it simple: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Sizes in the 1920 x 1080 frame. */

const DS_TITLE="Design it simple",DS_LAST="Start from the decision; design the fewest parts that serve it.";
const DS_MOD={module:"Data management",mark:dm_mark};
function ds_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"3",DS_TITLE,{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function ds_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
const ds_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
function ds_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function ds_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// someone sitting behind a low desk: drawn first, cut where the desk's top hides them, then the desk
function ds_atDesk(ctx,who,px,py,s,dx,dy,dw,o){const cut=dy-24;ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,cut+H);ctx.clip();lp_person(ctx,who,px,py,s,o);ctx.restore();
  ds_desk(ctx,dx,dy,dw,{paper:true,a:o&&o.a});}
// how far a line has been said, 0 to 1, from just before its start to just after its end
const ds_said=(sc,id,tt)=>clamp((tt-sc.cues[id]+0.1)/(sc.ends[id]-sc.cues[id]+0.2),0,1);
// the five basic letters and the five with a stroke added, in rows on the desk's paper, beside the mouth
const DS_ROW1=["g","n","m","s","ng"],DS_ROW2=["k","d","b","j","h"],DS_PART=["root","tip","lips","teeth","throat"];

/* ---------------------------------------------------------------- 1. Letters for everyone: Korea, 1443 to 1446 */
scene("letters",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},yd={light:"day",wall:0.08},rm={light:"day"};
  const strokes0=w("made","mouth",-0.1),added0=w("shapes","stroke",-0.1);
  ag_shots(ctx,S,t,sc.dur,[
    // Korea, the 1440s: the kingdom of Joseon, its palace in the morning
    {at:0,place:"dsSky",keys:[[0,1010,580,1.1],[0.4,960,540,1.0]],d:5.5,draw:(x,tt)=>{ds_sun(x,1700,320,40,1);ds_palace(x);
      ds_sheet(x,tt,c.korea-0.1,150,110,560,{kick:"Korea, the 1440s",title:"The kingdom of Joseon",lines:["Under King Sejong"]},{light:null,pin:false,u:ag_in(tt,w("korea","Sejong",-0.3),0.5)});}},
    // Chinese characters: a sign for each word, thousands of them
    {at:c.chars-0.3,place:"dsDesk",keys:[[c.chars-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const s0=w("chars","characters",-0.1),s1=w("chars","thousands",-0.2);
      ds_signs(x,880,110,840,700,{n:0.1*ag_in(tt,c.chars+0.1,s0-c.chars+0.4)+0.9*ag_in(tt,s1,2.4),cols:9,rows:10,seed:1440});
      ds_tag(x,tt,w("chars","sign",-0.1),null,220,330,"A sign for each word",{col:LP.ink});
      ds_tag(x,tt,s1,null,220,430,"Thousands of them",{col:LP.ink});
      ds_tag(x,tt,w("chars","another",-0.1),null,220,530,"Made for another language",{col:LP.ink});}},
    // years to learn them; and in a court, a person's words written down in signs they couldn't read: one wrong sign, no way to check
    {at:c.years-0.3,place:"dsYard",keys:[[c.years-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const r0=w("court","written",-0.2),wr=w("wrong","wrong",-0.1),ca=ag_in(tt,c.court-0.4,0.6);
      if(ca>0.004)ds_atDesk(x,DS_PEOPLE.clerk,1600,664,0.86,1380,846,440,{t:tt,flip:true,light:yd,a:ca});
      lp_person(x,DS_PEOPLE.farmer,400,650,1.0,{t:tt,light:yd});
      ds_pill(x,tt,w("years","years",-0.1),c.court-0.5,1010,300,"Years to learn",{col:LP.amber,icon:"wait"});
      ds_tag(x,tt,w("years","most",0),c.court-0.5,1010,410,"Most couldn't write what they meant",{align:"center",col:LP.amber});
      const ra=ag_in(tt,r0,0.4);if(ra>0.004){x.save();x.globalAlpha*=ra;lp_sheet(x,780,120,460,470,{light:"day",k:tt-r0});
        ds_signs(x,810,160,400,400,{cols:6,rows:7,wrong:[3,2],amb:ag_in(tt,wr,0.6),n:ag_in(tt,r0,1.6),seed:1444});x.restore();}
      ds_tag(x,tt,w("court","read",-0.1),null,1010,650,"Written in signs he can't read",{align:"center",col:LP.amber});
      ds_tag(x,tt,wr+0.5,null,1010,730,"One wrong sign could punish him",{align:"center",col:LP.amber});
      ds_tag(x,tt,w("wrong","check",-0.1),null,1010,810,"No way to check",{align:"center",col:LP.amber});}},
    // King Sejong started from what people needed
    {at:c.start-0.3,place:"dsStudy",keys:[[c.start-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      ds_atDesk(x,DS_PEOPLE.king,560,660,0.95,320,842,480,{t:tt,light:mo});
      lp_nameTag(x,150,220,DS_PEOPLE.king,{role:"King of Joseon",a:ag_in(tt,c.start+0.3,0.5)});
      ds_sheet(x,tt,w("start","needed",-0.2),1040,220,700,{kick:"What people needed",title:"To write the way they speak"},{col:LP.blue,light:"morning"});}},
    // 28 letters: the consonants drawn from the mouth and throat; five shapes, a stroke added for a stronger sound; the vowels' three marks
    {at:c.made-0.3,place:"dsDesk",keys:[[c.made-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const f0=c.made+0.1;
      const fA=ag_io(tt,f0,strokes0-0.3,0.4);if(fA>0.004)lp_figure(x,240,180,440,{kick:"1443",num:"28",label:"letters, for everyone"},{col:LP.blue,light:null,a:fA,k:tt-f0});
      const mA=ag_in(tt,strokes0-0.1,0.5),cur=clamp(Math.floor((tt-strokes0)/0.4),0,4);
      if(mA>0.004)ds_mouth(x,190,170,0.95,{a:mA,hl:tt<added0?DS_PART[cur]:null,hlA:mA});
      DS_ROW1.forEach((k,i)=>{const t0=strokes0+i*0.4;if(tt>t0)ds_letter(x,k,820+i*190,170,150,{p:ag_sine((tt-t0)/0.5)});});
      DS_ROW2.forEach((k,i)=>{const t0=added0+i*0.25;if(tt>t0-0.1){ds_letter(x,k,820+i*190,390,150,{p:1,a:ag_in(tt,t0-0.1,0.2),add:LP.blue});}});
      ds_tag(x,tt,w("shapes","Five",-0.1),c.vowels-0.3,1290,600,"Five basic shapes",{align:"center",col:LP.ink});
      ds_tag(x,tt,added0+0.3,c.vowels-0.3,1290,680,"A stroke added: a stronger sound",{align:"center",col:LP.blue});
      const v=[w("vowels","heaven",-0.1),w("vowels","earth",-0.1),w("vowels","person",-0.1)];
      [["dot",1010,"Heaven"],["eu",1210,"The earth"],["i",1410,"A person"]].forEach(([k,lx,lab],i)=>{if(tt<v[i])return;
        ds_letter(x,k,lx,610,130,{p:ag_sine((tt-v[i])/0.5)});lp_T(x,lab,lx+65,800,{w:600,size:28,align:"center",a:ag_in(tt,v[i]+0.2,0.4)});});}},
    // put together a syllable at a time, they write any word
    {at:c.blocks-0.3,place:"dsDesk",later:true,keys:[[c.blocks-0.3,960,540,1.0]],draw:(x,tt)=>{const b0=w("blocks","syllable",-0.3),b1=w("blocks","any",-0.2);
      ds_block(x,"han",520,180,400,{u:[0,1,2].map(i=>ag_sine((tt-b0-i*0.35)/0.5))});
      ds_block(x,"geul",1000,180,400,{u:[0,1,2].map(i=>ag_sine((tt-b1-i*0.3)/0.5))});
      ds_tag(x,tt,b0+0.4,null,720,700,"One syllable",{align:"center",col:LP.ink});ds_tag(x,tt,b1+0.4,null,1200,700,"Any word",{align:"center",col:LP.ink});}},
    // one of his scholars objected; the king argued for it, and published the letters in 1446, with a book to explain them
    {at:c.objected-0.3,place:"dsStudy",keys:[[c.objected-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const p0=w("published","published",-0.2),ar=w("published","argued",-0.1);
      ds_atDesk(x,DS_PEOPLE.king,560,660,0.95,320,842,480,{t:tt,light:mo});
      lp_person(x,DS_PEOPLE.scholar,1500,650,0.98,{t:tt,flip:true,light:mo,a:ag_in(tt,c.objected-0.2,0.7)});
      lp_nameTag(x,1496,200,DS_PEOPLE.scholar,{role:"A scholar of the court",align:"center",a:ag_in(tt,w("objected","Choe",-0.1),0.5)*(1-ag_in(tt,p0,0.4))});
      ds_sheet(x,tt,w("objected","objected",-0.1),700,170,520,{kick:"He objected",lines:["It would turn people away from learning in characters"]},{col:LP.amber,light:"morning",out:ar});
      ds_pill(x,tt,ar+0.2,null,520,230,"The king argued for it",{col:LP.blue});
      const bA=ag_in(tt,p0,0.4);if(bA>0.004){ds_book(x,860,350,150,{a:bA,k:tt-p0});lp_T(x,"1446",935,620,{w:800,size:40,align:"center",a:bA});
        ds_tag(x,tt,w("published","book",-0.1),null,935,700,"A book to explain them",{align:"center",col:LP.blue});}}},
    // the book's closing words: a quick learner, before the morning is over; anyone, within ten days
    {at:c.morning-0.3,place:"dsSky",keys:[[c.morning-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const m0=w("morning","morning",-0.6);
      ds_sun(x,1640,lerp(470,300,ag_sine((tt-m0+1.2)/4.5)),40,1);ds_palace(x);
      ds_sheet(x,tt,w("morning","closing",-0.2),70,80,600,{kick:"The book's closing words",lines:["A quick learner: before the morning is over","Anyone: within ten days"]},
        {col:LP.green,light:null,pin:false,u:ds_u(tt,[w("morning","quick",-0.1),w("morning","anyone",-0.1)])});}},
    // today: Hangul, written in both Koreas; in the South about 98 adults in 100 read and write
    {at:c.today-0.3,place:"dsDesk",keys:[[c.today-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const h0=w("today","Hangul",-0.2),d0=w("today","ninety-eight",-0.3);
      ds_block(x,"han",240,150,340,{a:ag_in(tt,c.today-0.2,0.5)});ds_block(x,"geul",640,150,340,{a:ag_in(tt,c.today,0.5)});
      ds_tag(x,tt,h0,null,650,640,"Hangul",{align:"center",col:LP.ink});ds_tag(x,tt,w("today","both",-0.1),null,650,720,"Both Koreas write with it",{align:"center",col:LP.ink});
      if(tt>d0-0.3)ds_dots(x,1240,180,46,98*ag_in(tt,d0,1.6),{a:ag_in(tt,d0-0.3,0.4)});
      ds_tag(x,tt,d0+0.6,null,1447,720,"In the South: 98 adults in 100",{align:"center",col:LP.green});}},
    // data is the same; a year from now, at a university: eleven ways to ask, three copies of the staff list, 41 working days
    {at:c.same-0.3,place:"lpRoom",keys:[[c.same-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      ds_sheet(x,tt,c.same,460,260,1000,{kick:"Data is the same",title:"A design people can learn in a morning is a design they use"},{col:LP.blue,light:"day"});}},
    {at:c.uni-0.3,place:"lpRoom",later:true,keys:[[c.uni-0.3,960,540,1.0]],draw:(x,tt)=>{const f=[w("uni","eleven",-0.2),w("uni","three",-0.2),w("uni","forty-one",-0.2)];
      [["Ways to ask for data","11"],["Copies of the staff list","3"],["Working days to wait","41"]].forEach(([k,n],i)=>{const a=ag_in(tt,f[i],0.35);if(a>0.004)lp_figure(x,140+i*560,280,520,{kick:k,num:n},{col:LP.amber,a,k:tt-f[i]});});}},
    // its new data manager and team design the target simply; simple enough to learn in a morning
    {at:c.team-0.3,place:"lpRoom",later:true,keys:[[c.team-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"helena",360,640,1.0,{t:tt,light:rm,a:ag_in(tt,c.team-0.1,0.6)});lp_nameTag(x,110,250,"helena",{a:ag_in(tt,c.team+0.3,0.5)});
      [["five","Five principles"],["small","A small team, with partners"],["six","Six procedures"],["front","One front door"]].forEach(([wd,lab],i)=>{
        ds_sheet(x,tt,w("team",wd,-0.2),780+(i%2)*540,190+((i/2)|0)*230,500,{title:lab},{col:LP.blue,light:"day"});});
      ds_pill(x,tt,c.learn,null,1310,720,"Learn it in a morning",{col:LP.green,icon:"tick"});}},
    // the room, bare, under the title
    {at:c.breath+0.4,place:"lpRoom",later:true,keys:[[c.breath+0.4,960,540,1.0]],draw:()=>{}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("uni","university",-0.3),c.breath,0.5)});
  lp_title(ctx,S,t,c.breath+0.2,DS_TITLE,"The fewest parts that serve each decision","Data management · A plan in ninety days",DS_MOD);
});

/* ---------------------------------------------------------------- 2. Five principles */
scene("rules",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),rm={light:"day"};
  const ro=[w("p1","Nothing",-0.1),w("p2","No",-0.1),w("p3","The",-0.1),w("p4","No",-0.1),w("p5","not",-0.1)],
    hiOut=ag_io(t,w("out","rules",-0.1),c.why,0.4),let0=w("shapes","Five",-0.1),q1=c.tool,q2=c.copy;
  ag_shots(ctx,S,t,sc.dur,[
    // March 2027: Helena, with the current state on the wall, in five layers; next, define the target by Monday 5 April
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      ds_layers(x,{kind:"now",x:200,a:ag_in(tt,0.5,0.5)*(1-ag_in(tt,c.define-0.3,0.5)),u:[0,1,2,3,4].map(i=>ag_in(tt,w("march","current",-0.2)+i*0.25,0.6)),light:"day"});
      lp_person(x,"helena",1560,640,1.0,{t:tt,flip:true,light:rm,a:ag_in(tt,0.3,0.6)*(1-ag_in(tt,c.write-0.4,0.5))});
      lp_nameTag(x,1830,250,"helena",{align:"right",a:ag_io(tt,w("march","Helena",-0.1),c.define,0.5)});
      const p0=c.define+0.1;ds_sheet(x,tt,p0,240,220,760,{kick:"Her ninety days",title:"Define the target, the state to reach",lines:["Discover: done","Define: by Monday 5 April","Plan: next"]},
        {col:LP.blue,light:"day",u:ag_in(tt,p0+0.6,1.2),out:c.write-0.4});}},
    // the rules they'll design by: five principles, each with what it rules out
    {at:c.write-0.3,place:"lpRoom",later:true,keys:[[c.write-0.3,960,540,1.0]],draw:(x,tt)=>{
      ds_sheet(x,tt,c.write+0.1,1260,180,600,{kick:"Before drawing anything",title:"The rules they design by"},{col:LP.blue,light:"day",out:c.why-0.4});
      for(let i=0;i<5;i++){const p0=c["p"+(i+1)]-0.1;if(tt<p0)continue;const hi=i===3?ag_io(tt,w("tool","platform",-0.2),c.copy-0.3,0.4):i===1?ag_io(tt,w("copy","One",-0.2),let0-0.3,0.4):0;
        ds_prin(x,i,{a:ag_in(tt,p0,0.35),k:tt-p0,ro:ag_in(tt,ro[i],0.5),hi:Math.max(hi,hiOut*0.6),letter:ag_in(tt,let0+i*0.3,1.0),light:"day"});}
      ds_sheet(x,tt,w("why","map",-0.2),1260,180,600,{kick:"The map before the data",title:"Why it moves"},{light:"day",out:c.tool-0.4});
      ds_pill(x,tt,w("anyone","check",-0.1),c.tool-0.4,1560,480,"Anyone can check a choice",{col:LP.green,icon:"tick"});
      // two choices, each settled by one principle
      ds_sheet(x,tt,q1,1260,180,600,{kick:"A choice",title:"A tool of their own for the faculties?"},{light:"day",out:q2-0.4});
      ds_pill(x,tt,w("tool","platform",-0.1),q2-0.4,1560,480,"The platform will do",{col:LP.green,icon:"tick"});
      ds_sheet(x,tt,q2,1260,180,600,{kick:"A choice",title:"A copy of the staff list for each faculty?"},{light:"day",out:let0-0.4});
      ds_pill(x,tt,w("copy","One",-0.1),let0-0.4,1560,480,"One list, governed once",{col:LP.green,icon:"tick"});
      ds_tag(x,tt,let0+0.6,null,1560,420,"Five shapes, every letter",{align:"center",col:LP.ink});
      ds_tag(x,tt,let0+1.6,null,1560,500,"Five principles, every choice",{align:"center",col:LP.blue});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.3,c.define,0.5)});ds_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 3. The target, in five layers */
scene("target",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),rm={light:"day"},L=["strat","biz","info","app","tech"];
  const layer=i=>({at:c[L[i]]-0.3,place:"lpRoom",later:true,keys:[[c[L[i]]-0.3,960,540,1.0]],draw:(x,tt)=>ds_layerPage(x,i,ds_said(sc,L[i],tt),{k:tt-c[L[i]]+0.2,light:"day"})});
  ag_shots(ctx,S,t,sc.dur,[
    // Helena and Noor draw the target on Noor's map, in the same five layers
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const m0=w("map","draw",-0.1);
      lp_person(x,"helena",330,640,1.0,{t:tt,light:rm,a:ag_in(tt,0.4,0.6)});
      lp_person(x,"noor",1600,660,0.95,{t:tt,flip:true,light:rm,a:ag_in(tt,w("map","Noor",-0.6),0.6)});
      lp_nameTag(x,1830,250,"noor",{align:"right",a:ag_in(tt,w("map","Noor",0),0.5)});
      const sA=ag_in(tt,m0-0.3,0.5);if(sA>0.004)lp_screen(x,640,170,640,500,{a:sA,draw:(cc,sx,sy,sw,sh)=>{
        DS_LAYER.forEach((L0,i)=>{const yy=sy+30+i*(sh-60)/5,ra=ag_in(tt,w("map","same",-0.2)+i*0.2,0.5);if(i){cc.fillStyle=rgba(LP.mut,0.2);cc.fillRect(sx+24,yy,sw-48,2);}
          lp_T(cc,L0.name,sx+36,yy+(sh-60)/10+10,{w:800,size:30,a:ra});cc.strokeStyle=rgba(LP.blue,0.35*ra);cc.lineWidth=2;cc.setLineDash([8,8]);cc.strokeRect(sx+300,yy+14,sw-340,(sh-60)/5-28);cc.setLineDash([]);});}});}},
    layer(0),layer(1),layer(2),layer(3),layer(4),
    // each page has its picture, drawn with it; drawn together, every system and every copy has a decision behind it
    {at:c.pic-0.3,place:"lpRoom",later:true,keys:[[c.pic-0.3,960,540,1.0]],draw:(x,tt)=>{const r0=c.pic-0.1;
      ds_layers(x,{kind:"target",x:330,u:[0,1,2,3,4].map(i=>ag_in(tt,r0+i*0.2,0.5)),threads:ag_in(tt,w("together","Drawn",-0.1),2.4),light:"day",k:tt-r0});
      ds_pill(x,tt,w("pic","picture",-0.1),null,1520,320,"Each page has its picture",{col:LP.blue});
      ds_pill(x,tt,w("together","decision",-0.2),null,1520,420,"A decision behind each part",{col:LP.green,icon:"tick"});
      ds_tag(x,tt,w("same","The",-0.1),null,1520,560,"The same one, everywhere",{align:"center",col:LP.ink});
      ds_tag(x,tt,w("product","A",-0.1),null,1520,650,"A product with an owner",{align:"center",col:LP.ink});}}
  ]);
  ds_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. A small team in the middle */
scene("team",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),rm={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    // who builds what? Today, the worst of two designs: one queue at the centre, private copies at the edges
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const q0=w("centre","queue",-0.2),e0=w("edges","copies",-0.2);
      ds_sheet(x,tt,0.5,660,130,600,{title:"Who builds what?"},{light:"day"});
      ds_tag(x,tt,w("who","worst",-0.2),null,960,330,"Today: the worst of two designs",{align:"center",col:LP.amber});
      ds_tag(x,tt,c.centre,null,480,440,"At the centre: one queue",{align:"center",col:LP.ink});
      ds_queue(x,170,560,640,{u:ag_in(tt,q0,1.2),a:ag_in(tt,q0-0.2,0.3)});
      ds_pill(x,tt,w("centre","forty-one",-0.2),null,480,790,"41 working days",{col:LP.amber,icon:"wait"});
      ds_tag(x,tt,c.edges,null,1440,440,"At the edges: their own copies",{align:"center",col:LP.ink});
      ds_copies(x,1170,500,{u:ag_in(tt,e0,1.2),dis:ag_in(tt,w("edges","disagree",-0.2),0.8),a:ag_in(tt,e0-0.2,0.3)});
      ds_tag(x,tt,w("edges","disagree",0),null,1440,800,"Numbers that disagree",{align:"center",col:LP.amber});}},
    // the way between: a small team in the middle keeps the platform, the standards, the shared products and the guardrails, and helps;
    // seven data partners build their own area's products with its tools
    {at:c.between-0.3,place:"lpRoom",later:true,keys:[[c.between-0.3,960,540,1.0]],draw:(x,tt)=>{const j=["platform","standards","shared","guardrails"].map(k=>w("core",k,-0.1)),p0=w("partners","Seven",-0.1);
      ds_ring(x,{core:ag_in(tt,c.between+0.2,0.6),jobs:j.map(t0=>ag_in(tt,t0,0.5)),u:[0,1,2,3,4,5,6].map(k=>ag_in(tt,p0+k*0.2,0.5)),help:ag_in(tt,w("partners","tools",-0.2),1.4),hi:-1});
      ds_tag(x,tt,w("between","mesh",-0.2),c.core,1630,300,"Data mesh",{align:"center",col:LP.ink});
      ds_tag(x,tt,w("between","Strengholt",-0.2),c.core,1630,380,"Piethein Strengholt",{align:"center",col:LP.ink});
      ds_pill(x,tt,w("core","helps",-0.1),c.partners,1630,340,"And it helps",{col:LP.green});
      ds_sheet(x,tt,w("day","day",-0.3),1390,200,480,{title:"About a day a week",lines:["Given by their dean or director"]},{col:LP.blue,light:"day"});
      ds_sheet(x,tt,w("ldp","leading",-0.2),1390,520,480,{kick:"Leading data people",lines:["How a leader lets people decide"]},{light:"day"});}},
    // she sends the draft to everyone she spoke to; a head of school writes back: partners take people away from teaching
    {at:c.draft-0.3,place:"lpRoom",later:true,keys:[[c.draft-0.3,960,540,1.0]],draw:(x,tt)=>{const s0=w("draft","sends",-0.2),r0=w("draft","writes",-0.2),gone=ag_in(tt,c.forty-0.4,0.5);
      ds_sheet(x,tt,c.draft,160,200,560,{kick:"The draft",title:"The target, in five layers",lines:["To the 31 people she spoke to"]},{col:LP.blue,light:"day",out:c.forty-0.4});
      for(let k=0;k<31;k++){const f=ag_in(tt,s0+k*0.03,0.4)*(1-gone);if(f<=0.004)continue;const i=k%8,jj=(k/8)|0,rx=1100+i*84,ry=600+jj*76,hd=k===13?ag_in(tt,r0,0.5):0;
        ds_reader(x,rx,ry,15,f);if(hd>0.004){x.save();x.globalAlpha*=f*hd;x.strokeStyle=rgba(LP.amber,1);x.lineWidth=4;x.beginPath();x.arc(rx,ry-4,32,0,TAU);x.stroke();x.restore();}}
      ds_sheet(x,tt,r0,1000,160,780,{kick:"A head of school writes back",title:"Partners take people away from teaching"},{col:LP.amber,light:"day"});
      ds_tag(x,tt,w("fair","fair",-0.1),c.forty-0.4,440,600,"A fair worry",{align:"center",col:LP.ink});
      // about 40 people already do data work part of their week, in spreadsheets; a partner's day is that same work, planned and helped
      const f0=w("forty","forty",-0.2);ds_marks(x,160,200,{u:ag_in(tt,f0,1.6),a:ag_in(tt,f0-0.3,0.3)});
      ds_tag(x,tt,f0+0.8,null,530,570,"About 40 people, part of their week",{align:"center",col:LP.ink});
      ds_sheet(x,tt,c.answer,1000,440,780,{kick:"A partner's day",title:"The same work, planned by the dean",lines:["Done with the team's tools and help"]},
        {col:LP.green,light:"day",u:ag_in(tt,w("answer","tools",-0.2),0.5)});}},
    // a good design still has to be argued for, as the king argued for his letters
    {at:c.argue-0.3,place:"dsStudy",keys:[[c.argue-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      ds_atDesk(x,DS_PEOPLE.king,560,660,0.95,320,842,480,{t:tt,light:{light:"morning"}});
      lp_person(x,DS_PEOPLE.scholar,1500,650,0.98,{t:tt,flip:true,light:{light:"morning"}});
      ds_pill(x,tt,w("argue","argued",-0.3),null,960,230,"A good design still has to be argued for",{col:LP.blue});}}
  ]);
  ds_kick(ctx,S,1-ag_in(t,c.argue-0.3,0.8));
});

/* ---------------------------------------------------------------- 5. A page for each */
scene("pages",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),rm={light:"day"};
  const st=w("step","Step",-0.1),wt=w("waited","four",-0.2),fx=w("fix","reviewer",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // six procedures, a page each
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const nm=["Ask","choose","build","release","fix","retire"].map(k=>w("six",k,-0.1)),off=sc.ends.six+0.6;
      ds_pageRow(x,130,240,250,{u:ag_in(tt,c.six+0.2,1.6),his:nm.map((t0,k)=>ag_io(tt,t0,k<5?nm[k+1]:off,0.25)),light:"day"});}},
    // each page names who asks, decides, builds and checks, its steps and what it leaves behind; and its picture: the roles and the work between them
    {at:c.roles-0.3,place:"lpRoom",later:true,keys:[[c.roles-0.3,960,540,1.0]],draw:(x,tt)=>{
      ds_buildPage(x,110,124,820,{u:ds_u(tt,[w("roles","asks",-0.2),w("roles","steps",-0.2),w("roles","behind",-0.2)]),a:ag_in(tt,c.roles-0.2,0.4),k:tt-c.roles+0.2,light:"day"});
      const p0=w("picture","picture",-0.2);if(tt>p0-0.3){lp_sheet(x,990,200,820,520,{light:"day",a:ag_in(tt,p0-0.3,0.4),k:tt-p0+0.3});ds_flow(x,1020,300,760,360,{u:ag_in(tt,p0,2.4)});}}},
    // it all starts at one front door: one form, five questions; it opens on Monday 7 June; governance's services are behind it too
    {at:c.door-0.3,place:"lpRoom",later:true,keys:[[c.door-0.3,960,540,1.0]],draw:(x,tt)=>{const qs=["What","By","Who","data","else"].map(k=>w("q",k,-0.2));
      lp_door(x,560,190,320,700,{a:ag_in(tt,c.door-0.1,0.5),open:0.25*ag_in(tt,w("door","front",-0.2),1.2)});
      ds_form(x,1100,120,700,{u:ds_u(tt,qs),a:ag_in(tt,w("door","form",-0.2),0.4),k:tt-w("door","form",-0.2),light:"day"});
      ds_pill(x,tt,w("opens","seventh",-0.4),null,1450,840,"Opens Monday 7 June",{col:LP.blue});
      ds_tag(x,tt,w("gov","governance",-0.2),null,320,420,"Governance's services, too",{align:"center",col:LP.ink});
      ds_tag(x,tt,w("gov","capability",-0.2),null,320,500,"A capability, not a project",{align:"center",col:LP.ink});}},
    // one partner tries them first: Anil, who kept his own spreadsheet, builds Health's report of casual teaching hours by the build page
    {at:c.tries-0.3,place:"lpRoom",later:true,keys:[[c.tries-0.3,960,540,1.0]],draw:(x,tt)=>{const b0=w("build","builds",-0.2);
      lp_person(x,"anil",1560,640,1.0,{t:tt,flip:true,light:rm,a:ag_in(tt,c.tries-0.1,0.6)});lp_nameTag(x,1830,250,"anil",{align:"right",a:ag_in(tt,w("anil","Anil",-0.1),0.5)});
      ds_tag(x,tt,w("tries","partner",-0.2),c.anil,700,400,"One partner tries them first",{align:"center",col:LP.blue});
      ds_grid(x,300,240,520,400,{a:ag_io(tt,w("anil","spreadsheet",-0.3),b0,0.4),edge:LP.amber,rows:9,cols:6});
      ds_tag(x,tt,w("anil","spreadsheet",0),b0,560,720,"His own spreadsheet",{align:"center",col:LP.amber});
      ds_report(x,220,170,680,560,{a:ag_in(tt,b0,0.5),k:tt-b0,u:ag_in(tt,b0+0.4,1.2),light:"day"});
      ds_tag(x,tt,w("build","staff",-0.2),null,560,800,"From the one staff list",{align:"center",col:LP.orange});
      ds_tag(x,tt,w("build","page",-0.2),null,1090,330,"By the build page",{align:"center",col:LP.blue});}},
    // step four said the team checks it; his change waited four working days; now one reviewer, from a rota, within two
    {at:c.step-0.3,place:"lpRoom",later:true,keys:[[c.step-0.3,960,540,1.0]],draw:(x,tt)=>{
      ds_buildPage(x,110,124,820,{step:ag_in(tt,st,0.4),fix:ag_in(tt,fx,1.2),light:"day",k:tt-c.step+0.2});
      lp_sheet(x,990,200,820,520,{light:"day",k:tt-c.step+0.2});ds_flow(x,1020,300,760,360,{wait:ag_in(tt,wt,0.5)*(1-ag_in(tt,fx,0.5)),fix:ag_in(tt,fx+0.4,0.8)});
      ds_tag(x,tt,w("waited","everyone",-0.1),fx,1400,790,"Everyone thought someone else had it",{align:"center",col:LP.amber});
      ds_pill(x,tt,w("tried","fixed",-0.6),null,1400,800,"Tried by one partner, fixed before everyone",{col:LP.green,icon:"tick"});}}
  ]);
  ds_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 6. Simple enough to run */
scene("run",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),rm={light:"day"},e0=c.breath+0.6;
  // the whole design, small: the target, five principles, a small team and its partners, six pages, one door
  const whole=(x,tt,ts,a)=>{if(a<=0.004)return;x.save();x.globalAlpha*=a;const cx=[380,670,960,1250,1540],lab=["The target","Five principles","A team, 7 partners","Six pages","One door"];
    for(let i=0;i<5;i++){const f=ag_spr(tt,ts[i],0.5);if(f<=0)continue;x.save();x.globalAlpha*=Math.min(1,f);ag_about(x,cx[i],520,lerp(0.7,1,Math.min(1,f)));
      if(i===0)ds_mini(x,cx[i]-80,420,160,200,{col:LP.blue,lines:5});
      else if(i===1)for(let k=0;k<5;k++){x.fillStyle=rgba(LP.paper,1);x.fillRect(cx[i]-100,424+k*40,200,30);x.fillStyle=rgba(LP.blue,1);x.fillRect(cx[i]-100,424+k*40,200,5);}
      else if(i===2)ds_miniRing(x,cx[i],520,88,{});
      else if(i===3)for(let k=0;k<6;k++)ds_mini(x,cx[i]-108+k*36,450,30,140,{col:LP.blue,lines:2});
      else ds_miniDoor(x,cx[i]-50,420,100,200);
      x.restore();lp_T(x,lab[i],cx[i],690,{w:700,size:28,align:"center",a:ag_in(tt,ts[i]+0.1,0.4)});}x.restore();};
  ag_shots(ctx,S,t,sc.dur,[
    // Monday 5 April: the define milestone; every part fits on a page: simple enough to explain is simple enough to run
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const ts=[w("all","target",-0.2),w("all","principles",-0.2),w("all","small",-0.2),w("all","six",-0.2),w("all","door",-0.2)];
      ds_sheet(x,tt,c.milestone-0.1,560,130,800,{kick:"Monday 5 April",title:"The define milestone"},{col:LP.blue,light:"day"});
      ds_pill(x,tt,w("milestone","milestone",0),null,960,350,"The target, written down",{col:LP.green,icon:"tick"});
      whole(x,tt,ts,1);ds_pill(x,tt,w("simple","page",-0.2),null,960,800,"Every part fits on a page",{col:LP.blue});}},
    // in April, Anil becomes the first data partner
    {at:c.anil-0.3,place:"lpRoom",later:true,keys:[[c.anil-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"anil",1600,640,1.0,{t:tt,flip:true,light:rm,a:ag_in(tt,c.anil-0.1,0.6)});lp_nameTag(x,1830,250,"anil",{align:"right",a:ag_in(tt,c.anil+0.3,0.5)});
      ds_ring(x,{core:1,u:[1,1,1,1,1,1,1].map((v,k)=>k===3?ag_in(tt,c.anil+0.5,0.6):ag_in(tt,c.anil+0.2,0.6)*0.5),hi:3,a:ag_in(tt,c.anil,0.5)});
      ds_pill(x,tt,w("anil","first",-0.2),null,963,850,"The first data partner",{col:LP.green,icon:"tick"});}},
    // in 1446 the king's letters could be learned in a morning, so people used them
    {at:c.back-0.3,place:"dsDesk",keys:[[c.back-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      DS_ROW1.forEach((k,i)=>ds_letter(x,k,300+i*270,200,170,{}));
      ds_block(x,"han",560,430,300,{a:ag_in(tt,c.back+0.4,0.6)});ds_block(x,"geul",1060,430,300,{a:ag_in(tt,c.back+0.6,0.6)});
      ds_tag(x,tt,w("back","morning",-0.2),null,960,800,"Learned in a morning, so people used them",{align:"center",col:LP.green});}},
    // at the university, a design anyone can learn in a morning is one people use: to ask, to build, and to check
    {at:c.uni-0.3,place:"lpRoom",keys:[[c.uni-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const p=[w("uni","ask",-0.2),w("uni","build",-0.2),w("uni","check",-0.2)];
      ds_sheet(x,tt,c.uni,460,200,1000,{kick:"At the university",title:"A design anyone can learn in a morning"},{col:LP.blue,light:"day",out:c.take-0.4});
      ["To ask","To build","To check"].forEach((lab,i)=>ds_pill(x,tt,p[i],c.take-0.4,700+i*260,560,lab,{col:LP.green,icon:"tick"}));
      ds_sheet(x,tt,w("next","Next",-0.2),1250,620,560,{kick:"Next",title:"From gaps to a roadmap"},{light:"day",out:c.take-0.4});
      // the five shapes again, for the last line
      DS_ROW1.forEach((k,i)=>{const t0=c.take+i*0.3;if(tt>t0)ds_letter(x,k,560+i*170,380,130,{p:ag_sine((tt-t0)/0.6),a:1-ag_in(tt,e0,0.8)});});}}
  ]);
  lp_end(ctx,S,t,e0,DS_TITLE,DS_LAST,"Film 3 of 4","A plan in ninety days",DS_MOD);
  ds_kick(ctx,S,(1-ag_io(t,c.back-0.3,c.uni-0.3,0.6))*(1-ag_in(t,e0,0.8)));
});
ag_cutInto(["rules","target","team","run"]);
