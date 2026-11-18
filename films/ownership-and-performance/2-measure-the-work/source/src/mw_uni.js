/* ===== Measure the work, not the people: the university, 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner and the campus; and,
   apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is this film's own in
   them: who sits where, what a screen shows and the small cards that come out of it, the board's rows that Carmen Vidal and Helena
   write, the pages Helena keeps, Ivy's call with Mei, Helena's chat with Graham, and the director's message, which comes to Helena's
   laptop as a message with no picture: the director is never drawn. Every time comes from the voice: sc is the chapter, w a word's
   time in a line. Colour means what it means in the film: orange data, amber a wait or a cost, green done or better, blue a plan or
   a rule. */
AG_PLACES.mwTeam=PK.place.team;AG_PLACES.mwCorner=PK.place.corner;AG_PLACES.mwCampus=PK.place.campus;
AG_PLACES.mwBoard=PK.place.board;AG_PLACES.mwNotes=c=>PK.place.notes(c,{});
const MW_T=PK.ROOMS.team,MW_CA=PK.ROOMS.campus,MW_CO=PK.ROOMS.corner;
const MW_HI=PK.hAt(MW_T.mid,MW_T.eye),MW_HB=PK.hAt(MW_T.back,MW_T.eye),MW_HC=PK.hAt(MW_CA.near,MW_CA.eye),MW_IVY={x:560,floor:MW_T.mid};
const mw_hT=fl=>PK.hAt(fl,MW_T.eye);
// a face that speaks from t0 to t1, on a base expression
const mw_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};

/* ---------------------------------------------------------------- the team's room
   o.clock: the time on the wall (null: no hands); o.sam, o.jun, o.ivy: what PK.atDesk takes for each (null: the desk stands empty);
   o.show: what Ivy's screen shows; o.behind(x): what stands between the back desks and hers (someone at the board); o.bare: the room
   with nobody in it and nothing going on. Returns {ivy, sam, jun}: their joints. */
function mw_team(x,tt,o){o=o||{};const r={};PK.clock(x,MW_T.clock[0],MW_T.clock[1],MW_T.clock[2],o.clock===undefined?9:o.clock);
  r.sam=PK.atDesk(x,o.sam===null?null:"sam",1230,MW_T.back,MW_HB,Object.assign({t:tt,w:0.45*MW_HB},o.sam||{}));
  r.jun=PK.atDesk(x,o.jun===null?null:"jun",1808,MW_T.back,MW_HB,Object.assign({t:tt+3,flip:true,w:0.45*MW_HB},o.jun||{}));
  if(o.behind)o.behind(x);
  r.ivy=PK.atDesk(x,o.ivy===null?null:"ivy",MW_IVY.x,MW_IVY.floor,MW_HI,Object.assign({t:tt+1,flip:true,w:0.84*MW_HI,sx:205,screen:"monitor",show:o.bare?null:o.show||mw_scrRows(1),
    on:(c,D)=>{PK.S.begin(c,{lw:2.6,sh:3});PK.mug(c,D.x1+34,D.top,0.7,PK.col("mug"),tt,!o.bare&&o.steam!==false);}},o.ivy||{}));return r;}
AG_BARE.mwTeam=(x,tt)=>mw_team(x,tt,{sam:null,jun:null,ivy:null,clock:null,bare:true});
// what a screen shows, too small for words: rows of a list, k of them filled in
const mw_scrRows=(k,warn)=>(c,x,y,w,h)=>{const U=PK.u,n=4,rh=h/(n+0.6);warn=warn||0;for(let i=0;i<n;i++){const yy=y+rh*(i+0.55),on=U.clamp(k*n-i,0,1);
    c.fillStyle=U.css([206,208,204]);c.beginPath();U.rrect(c,x+w*0.1,yy-rh*0.16,w*(0.44+0.1*((i*3)%3)),rh*0.32,4);c.fill();
    c.fillStyle=U.css(U.mix([206,208,204],U.mix(PK.C.orange,PK.C.amber,warn),on));c.beginPath();U.rrect(c,x+w*0.66,yy-rh*0.2,w*0.22,rh*0.4,4);c.fill();}};
/* a card that comes out of a screen: rows of [words, how far each has come in (0 to 1), its colour, a tick (0 to 1) or none].
   x0, y: the card's top left; tail: the screen; a: how far the card is there */
function mw_screen(x,x0,y,a,rows,tail){const U=PK.u,tick=rows.some(r=>r[3]!=null),wd=Math.max(...rows.map(r=>ag_tw(x,r[0],{w:700,size:30})));
  PK.callout(x,x0,y,wd+(tick?118:64),34+58*rows.length,tail||[205,474],a,(c,bx,by)=>rows.forEach(([s,k,col,tk],i)=>{const yy=by+46+58*i,q=U.clamp(k==null?1:k,0,1);
    if(tick)PK.tick(c,bx+46,yy,20,U.clamp(tk==null?q:tk,0,1));ag_T(c,s,bx+(tick?82:32),yy+11,{w:700,size:30,col:col||PK.C.ink,a:q});}));}

/* ---------------------------------------------------------------- small charts, in a card that comes out of a screen
   Each draws inside a callout's box (x, y, w, h); p: how far it is drawn */
// how a request flows, in four parts: the wait is the longest, in amber
function mw_flowCard(c,x,y,w,h,p){const U=PK.u,parts=[["Asked",0.1,PK.C.mut],["Waiting",0.46,PK.C.amber],["Building",0.3,PK.C.orange],["In use",0.14,PK.C.green]],x0=x+30,x1=x+w-30,by=y+116;
  ag_T(c,"ONE REQUEST, START TO END",x+30,y+52,{w:800,size:28,ls:3,col:PK.C.mut});let cx=x0;
  parts.forEach(([s,f,col],i)=>{const a=U.pin(p,i*0.2,0.25),ww=(x1-x0)*f;c.save();c.globalAlpha*=a;c.fillStyle=U.css(col);c.beginPath();U.rrect(c,cx+3,by-22,Math.max(4,ww-6),44,10);c.fill();c.restore();
    if(i===1)ag_T(c,s,cx+ww/2,by+70,{w:800,size:30,align:"center",col,a});cx+=ww;});}
// the load: squares for the pieces of work open at once, against the limit of six (a blue line); n how many (9, then fewer);
// over (0 to 1): the ones over the limit turn amber
function mw_loadCard(c,x,y,w,h,n,over,lim){const U=PK.u,g=12,sq=Math.min(58,(w-68-8*g)/9),x0=x+34,yy=y+96;ag_T(c,"LOAD: WORK OPEN AT ONCE",x+30,y+52,{w:800,size:28,ls:3,col:PK.C.mut});
  for(let i=0;i<9;i++){const k=U.clamp(n-i,0,1);if(k<=0.004)continue;const col=i>=6?U.mix(PK.C.orange,PK.C.amber,over):PK.C.orange;c.save();c.globalAlpha*=k;c.fillStyle=U.css(col);c.beginPath();U.rrect(c,x0+i*(sq+g),yy,sq,sq,8);c.fill();c.restore();}
  const lx=x0+6*(sq+g)-g/2,la=lim==null?1:lim;c.save();c.globalAlpha*=la;c.strokeStyle=U.css(PK.C.blue);c.lineWidth=5;c.setLineDash([12,9]);c.beginPath();c.moveTo(lx,yy-16);c.lineTo(lx,yy+sq+16);c.stroke();c.restore();
  ag_T(c,"Limit: 6",lx-10,yy+sq+56,{w:800,size:28,align:"right",col:PK.C.blue,a:la});}

// promises met: March's bar, then August's growing to it (p, 0 to 1), in green
function mw_promCard(c,x,y,w,h,p){const U=PK.u,x0=x+170,bw=w-300;ag_T(c,"PROMISES MET",x+30,y+52,{w:800,size:28,ls:3,col:PK.C.mut});
  [["March",0.58,1],["August",0.82,U.clamp(p,0,1)]].forEach(([s,v,k],i)=>{const yy=y+110+i*62;ag_T(c,s,x+30,yy+10,{w:700,size:28,col:PK.C.mut});
    c.fillStyle=U.css(i?PK.C.green:U.mix(PK.C.green,[214,208,196],0.45));c.beginPath();U.rrect(c,x0,yy-17,Math.max(6,bw*v*k),34,8);c.fill();
    ag_T(c,Math.round(100*v*k)+"%",x0+bw*v*k+14,yy+10,{w:800,size:30,col:i?PK.C.green:PK.C.mut,a:U.clamp(k*3,0,1)});});}
// the days from a request to its first use, in February, June and December (orange bars), and sent back, July and December
function mw_daysCard(c,x,y,w,h,p){const U=PK.u,x0=x+110,bw=w-220;ag_T(c,"DAYS TO FIRST USE",x+30,y+52,{w:800,size:28,ls:3,col:PK.C.mut});
  [["Feb",41,1],["Jun",24,1],["Dec",14,U.clamp(p/0.6,0,1)]].forEach(([s,v,k],i)=>{const yy=y+104+i*54;ag_T(c,s,x+30,yy+10,{w:700,size:28,col:PK.C.mut});
    c.fillStyle=U.css(PK.C.orange);c.beginPath();U.rrect(c,x0,yy-15,Math.max(6,bw*v/41*k),30,7);c.fill();ag_T(c,String(Math.round(v*k)),x0+bw*v/41*k+14,yy+10,{w:800,size:30,col:PK.C.orange,a:U.clamp(k*3,0,1)});});
  const q=U.clamp((p-0.6)/0.4,0,1);ag_T(c,"SENT BACK",x+30,y+h-34,{w:800,size:28,ls:3,col:PK.C.mut,a:q});ag_T(c,"12 in 100  \u2192  6 in 100",x+250,y+h-34,{w:800,size:30,col:PK.C.green,a:q});}
// the team's room in the evening: the window dark beyond the glass, its frame drawn again over it (k: how far evening has come)
function mw_evening(x,k){if(k<=0.004)return;const U=PK.u,w=MW_T.win;x.save();x.globalAlpha*=k;const g=x.createLinearGradient(0,w[1],0,w[1]+w[3]);g.addColorStop(0,U.css([40,48,86]));g.addColorStop(1,U.css([96,92,120]));
  x.fillStyle=g;x.fillRect(w[0],w[1],w[2],w[3]);x.fillStyle=U.css([246,222,160]);for(const [a,b] of [[0.62,0.6],[0.7,0.6],[0.78,0.6],[0.62,0.74],[0.78,0.74]])x.fillRect(w[0]+w[2]*a,w[1]+w[3]*b,18,22);x.restore();
  PK.windowFrame(x,w[0],w[1],w[2],w[3],{});}

/* ---------------------------------------------------------------- the team's board, and who explains at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach); Helena
   writes the team's own page there, and what the team finds at its readings. The film cuts between the room, where its board shows
   the rows small, and the board seen close (the place mwBoard), where they are large enough to read: both draw the same rows at the
   same times, so whoever writes is at the same row in both. */
const MW_RB={x:742,y:206,k:0.35,deco:true,floor:848,rest:1212};
// what the caller leaves undefined (say, events, rest) keeps the room's own
const mw_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},MW_RB,{h:mw_hT(MW_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
/* the team turned to the board: Ivy at her desk, turned round; Jun at hers; Sam on a chair he has pulled round; and, when Carmen
   explains, Helena standing at the side with her notebook. o.who: who explains ("carmen" or "helena"); o.rows: the board's rows;
   o.say: when they speak ([[t0, t1], …]); o.events: PK.face's, for them; o.ivy, o.sam, o.jun, o.helena: faces (PK.face's result);
   o.note (0 to 1): Helena looks down and writes. Returns {ivy, sam, jun, helena, at}: their joints (at: whoever explains). */
const MW_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
function mw_lesson(x,tt,o){o=o||{};const who=o.who||"carmen",lis=g=>PK.face(tt,{expr:"listen",gaze:[1,g]},[]);let Jc=null;
  const R=mw_team(x,tt,{clock:o.clock,sam:Object.assign({turn:1,work:0,pose:"sit"},o.sam||lis(-0.25)),jun:Object.assign({work:0,pose:"sit"},o.jun||lis(-0.2)),show:o.show,
    behind:cx=>{if(o.behind)o.behind(cx);Jc=mw_roomBoard(cx,tt,o.rows||[],who,{say:o.say,events:o.events,rest:o.rest});},
    ivy:Object.assign({turn:1,work:0,pose:"sit"},o.ivy||lis(-0.3))});
  if(who!=="helena"&&o.helena!==null){const wr=o.note||0;
    R.helena=PK.person(x,"helena",1620,930,mw_hT(912),PK.poseMix("clasp",MW_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||lis(-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}
  R.at=Jc;return R;}

/* the boards' rows, as functions of the chapter and the word times (sc, w), in the board's own px (1250 by 524). Each row has the
   time the voice says it; PK.pace then makes a row wait until whoever writes can have walked to it. So they are laid out for
   someone who walks: on from left to right, what is added later to the right, and nothing drawn back along words. */
// 1. management, fitted to the work (Carmen)
const mw_boardA=(sc,w)=>[
  {s:"Managing and leading",x:70,y:108,size:68,w:700,col:"blue",at:w("sides","Managing",-0.2),d:1.3},
  {s:"two sides of one role",x:70,y:194,size:52,at:w("sides","two sides",-0.1),d:1.1},
  {s:"Hard to see, hard to improve",x:70,y:292,size:52,at:w("see","hard to see",-0.3),d:1.5},
  {s:"so a leader measures",x:70,y:374,size:56,w:700,col:"blue",at:w("see","leader",-0.3),d:1.1},
  {s:"+ dates, plans",size:52,at:w("see","dates",-0.1),d:0.8},
  {s:"fitted to the work:",x:70,y:462,size:52,at:w("fit","fit",-0.3),d:1.0},
  {k:"cross",x:560,y:444,r:16,col:"amber",at:w("fit","hours",-0.3),d:0.25},
  {s:"hours, tickets per person",x:596,y:462,size:50,col:"mut",at:w("fit","hours",0),d:1.2}];
// 2. the team's page: four measures in two pairs (Helena)
const mw_boardB=(sc,w)=>[
  {s:"The team's page, from July",x:70,y:100,size:62,w:700,col:"blue",at:w("page","team's page",-0.3),d:1.4},
  {s:"Days to first use",x:70,y:196,size:52,at:w("days","Days",-0.1),d:1.0},
  {s:"Feb 41, Jun 24",size:52,w:700,col:"orange",at:w("days","forty-one",-0.1),d:1.0},
  {s:"Sent back",x:70,y:286,size:52,at:w("back","Sent back",-0.1),d:0.6},
  {s:"Promises met",x:70,y:376,size:52,at:w("promise","Promises",-0.1),d:0.8},
  {s:"Load,",x:70,y:466,size:52,at:w("load","load",-0.1),d:0.5},
  {s:"limit 6",size:52,w:700,col:"blue",at:w("load","load",0.6),d:0.6},
  {k:"line",x:880,y:176,x1:880,y1:272,bow:-44,col:"green",at:w("pairs","speed",-0.3),d:0.4},{s:"a pair",x:960,y:240,size:50,col:"green",at:w("pairs","speed",0.1),d:0.5},
  {k:"line",x:880,y:356,x1:880,y1:452,bow:-44,col:"green",at:w("pairs","promises",-0.3),d:0.4},{s:"a pair",x:960,y:420,size:50,col:"green",at:w("pairs","promises",0.1),d:0.5}];
// 3. the first reading: what slowed June's work (Helena)
const mw_boardR=(sc,w)=>{const t0=w("june","take",-0.1);return[
  {s:"What slowed the work?",x:70,y:104,size:66,w:700,col:"blue",at:w("what","what slowed",-0.2),d:1.3},
  {s:"June: 24 days",x:70,y:214,size:56,w:700,at:w("june","June's",-0.3),d:0.9},
  {s:"8 queue",x:300,y:318,size:50,at:t0+0.5,d:0.6},{s:"7 access",x:520,y:318,size:50,w:700,col:"amber",at:t0+1.3,d:0.6},
  {s:"7 build",x:760,y:318,size:50,at:t0+2.1,d:0.6},{s:"2 review",x:960,y:318,size:50,at:t0+2.9,d:0.6},
  {k:"ring",x:612,y:302,rx:118,ry:48,col:"amber",at:w("access","waiting",-0.3),d:0.6}];};
// 4. pairs: Accelerate (Carmen)
const mw_boardC=(sc,w)=>[
  {s:"Accelerate, 2018",x:70,y:100,size:44,col:"mut",at:sc.cues.accel+0.1,d:0.9},
  {s:"The best teams:",x:70,y:206,size:58,at:w("accel","best teams",-0.3),d:0.9},
  {s:"fast",size:66,w:700,col:"green",at:w("accel","fast",-0.1),d:0.4},{s:"and",size:58,at:w("accel","and stable",0),d:0.3},{s:"stable",size:66,w:700,col:"green",at:w("accel","stable",-0.1),d:0.5},
  {s:"measured side by side",x:70,y:316,size:58,w:700,col:"blue",at:w("accel","measured",-0.1),d:1.1}];
// 5. not a target: Goodhart and Strathern; a count per person; Deming, at the right (Carmen)
const mw_boardD=(sc,w)=>[
  {s:"Goodhart, 1975; Strathern",x:70,y:96,size:44,col:"mut",at:sc.cues.goodhart+0.2,d:1.2},
  {s:"A measure made a target",x:70,y:178,size:60,w:700,col:"blue",at:w("strathern","when a measure",-0.1),d:1.3},
  {s:"stops being a good measure",x:70,y:250,size:52,at:w("strathern","ceases",-0.2),d:1.3},
  {s:"Tickets per person:",x:70,y:340,size:52,at:w("split","Count tickets",-0.1),d:1.0},
  {s:"work split small,",x:110,y:404,size:48,col:"amber",at:w("split","split",-0.1),d:0.8},{s:"easy picks,",size:48,col:"amber",at:w("split","pick easy",-0.1),d:0.6},
  {s:"less help, mistakes hidden",x:110,y:462,size:48,col:"amber",at:w("split","stop helping",-0.1),d:1.4},
  {s:"Deming, 1986:",x:800,y:96,size:44,col:"mut",at:sc.cues.deming+0.2,d:0.7},
  {s:"94 in 100 problems",x:800,y:178,size:48,w:700,col:"orange",at:w("deming","ninety-four",-0.1),d:1.0},
  {s:"the system's",x:800,y:250,size:56,w:700,col:"blue",at:w("deming","the system",-0.1),d:0.7}];

/* ---------------------------------------------------------------- Helena's notebook: what she keeps (the page's own px)
   One pen writes a page, so its strokes come one after the other, each with the time to cross to it: the film gives each row the
   time the voice says it, in the order the pen writes them, and paces the page (PK.pace(ctx, null, rows)). Glosses go in one
   muted column at the right. */
// 3. what slowed the work: the two waits found, their fixes, and what they gave (the page is 1,100 px wide: glosses at x 720)
const mw_note1=(sc,w)=>[
  {s:"What slowed it?",x:70,y:124,size:88,w:700,col:"blue",at:sc.cues.most-0.4,d:0.8,marks:[["under","blue",null,0.3]]},
  {k:"dot",x:96,y:244,r:9,col:"amber",at:w("most","waits",-0.4),d:0.12},{s:"Access on day one",x:130,y:262,size:62,at:w("most","waits",-0.25),d:0.9},
  {s:"7 days to 1",x:720,y:262,size:42,col:"mut",at:w("most","found",-0.2),d:0.6},
  {k:"dot",x:96,y:374,r:9,col:"amber",at:w("most","removed",-0.4),d:0.12},{s:"Fifteen minutes first",x:130,y:392,size:62,at:w("most","removed",-0.25),d:0.9},
  {s:"sent back halved",x:720,y:392,size:42,col:"mut",at:w("most","one at",0),d:0.7},
  {s:"Nobody was slow",x:130,y:536,size:66,w:700,at:sc.ends.most+0.3,d:0.8,marks:[["hl","green"]]}];
// 4. read in pairs: what each measure hides, alone
const mw_note2=(sc,w)=>[
  {s:"Read in pairs",x:70,y:124,size:88,w:700,col:"blue",at:sc.cues.honest-0.3,d:0.8,marks:[["under","blue",null,0.3]]},
  {s:"Speed, alone",x:130,y:262,size:62,at:w("honest","Speed",-0.1),d:0.7},{k:"arrow",x:478,y:242,x1:590,y1:242,col:"amber",at:w("honest","hide",-0.45),d:0.3},
  {s:"hides rushed work",x:625,y:262,size:50,col:"amber",at:w("honest","rushed",-0.4),d:0.9},
  {s:"Promises, alone",x:130,y:392,size:62,at:w("honest","Promises",-0.1),d:0.8},{k:"arrow",x:548,y:372,x1:600,y1:372,col:"amber",at:w("honest","tired",-0.6),d:0.25},
  {s:"hides tired people",x:625,y:392,size:50,col:"amber",at:w("honest","tired",-0.3),d:0.9},
  {s:"Read them together",x:130,y:536,size:66,w:700,at:sc.ends.honest-0.1,d:0.9,marks:[["hl","green"]]}];
// 5. not a target: written in the pause that ends the chapter, from just after the last line (mw_N3), each stroke after the one
// before has ended and the pen has crossed to the next (PK.pace), and done a second before the chapter ends
const mw_N3=sc=>sc.cues.breath-1.3;
const mw_note3=sc=>{const b=mw_N3(sc);return[
  {s:"Not a target",x:70,y:124,size:88,w:700,col:"blue",at:b+0.5,d:0.7,marks:[["under","blue",null,0.3]]},
  {k:"cross",x:100,y:244,r:15,col:"amber",at:b+1.95,d:0.25},{s:"No count per person",x:140,y:262,size:62,at:b+2.25,d:0.9},
  {k:"tick",x:100,y:374,r:18,col:"green",at:b+3.5,d:0.25},{s:"The team's page instead",x:140,y:392,size:62,at:b+3.8,d:1.0},
  {s:"Growth: each one's own goals",x:140,y:536,size:58,at:b+5.15,d:1.1,marks:[["hl","blue"]]}];};
// 6. on Monday: the four things to keep, and beside three of them, in one column, what each means; the last, ringed, sums up
const mw_note4=(sc,w)=>{const c=sc.cues,dot=(y,col,at)=>({k:"dot",x:92,y:y-18,r:9,col,at,d:0.15});return[
  {s:"On Monday",x:70,y:122,size:88,w:700,col:"blue",at:w("flow","work sent back",0.1),d:0.6,marks:[["under","blue",null,0.3]]},
  dot(252,"orange",w("flow","promises",0)),{s:"Measure the flow",x:128,y:252,size:62,at:w("flow","promises",0.1),d:0.9},
  {s:"not the people",x:720,y:252,size:42,col:"mut",at:w("flow","load",0.2),d:0.7},
  dot(372,"green",w("pair","Pair",-0.3)),{s:"Pair each measure",x:128,y:372,size:62,at:w("pair","Pair",-0.1),d:0.9,marks:[["hl","green"]]},
  {s:"with its partner",x:720,y:372,size:42,col:"mut",at:w("pair","balances",-0.3),d:0.8},
  dot(492,"blue",w("read","Read",-0.3)),{s:"Read them together",x:128,y:492,size:62,at:w("read","Read",-0.1),d:0.9},
  {s:"what slowed it?",x:720,y:492,size:42,col:"mut",at:w("read","what slowed",-0.1),d:0.7},
  // the last has no dot: the ring round it would run through one
  {s:"Rank people? No: show the flow",x:128,y:618,size:62,at:w("rank","rank",-0.4),d:w("rank","show",0.4)-w("rank","rank",-0.4),marks:[["ring","blue",sc.ends.rank+0.1]]}];};

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: with Ivy (o.ivy true), or alone at her laptop (o.laptop: its screen faces her). o.lean (0 to 1):
   Helena leans in; o.he, o.ie: their faces; o.who2: who sits across from her (Ivy by default); o.type (0 to 1): her hands on the laptop's keys; o.book: her notebook, shut, on the table; o.t0: when the shot starts (two people
   cross the lawn outside once, from then); o.sheet: a sheet on the table, between them (Ivy's goals). Returns {helena, ivy, laptop}:
   their joints, and where the laptop's screen is. */
const MW_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},MW_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const MW_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
const MW_TYPE={mode:"sit",lean:14,head:8,aN:[46,96,"flat"],aF:[44,96,"flat"],lN:[86,4],lF:[82,-4]};
function mw_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=MW_CO,lean=o.lean||0,ty_=o.type||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={};
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[7,t0+1,22,false,34,92],[12,t0+7,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(PK.poseMix(MW_SITH,MW_SITH2,lean),MW_TYPE,ty_);
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});const W2=o.who2||"ivy";if(o.ivy)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  PK.person(x,"helena",hx,F,H,hp,{t:tt,part:"lower"});if(o.ivy)PK.person(x,W2,ix,F,H,MW_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});if(!o.laptop)PK.mug(x,tx-60,ty+10,0.9,PK.col("mug2"),tt,true);
  if(o.sheet){S.begin(x,{lw:2.4,sh:3});S.poly(x,[[tx-70,ty-4,1],[tx+90,ty-10,1],[tx+120,ty+8,1],[tx-50,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(tx-30+i*8,ty+1-i*5);c.lineTo(tx+70+i*8,ty-3-i*5);}},PK.C.blue,0.6);}
  if(o.laptop){S.begin(x,{lw:2.8,far:0,sh:3});PK.laptop(x,tx-40,ty,{k:1.5,flip:true});r.laptop=[tx-60,ty-120];}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  const keys=[tx-150,ty-6];
  r.helena=PK.person(x,"helena",hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(ty_>0.01?[U.lerp(790,keys[0],ty_),U.lerp(ty-4,keys[1],ty_)]:[790,ty-4]),reachF:o.handF||(ty_>0.01?[U.lerp(806,keys[0]-30,ty_),U.lerp(ty-12,keys[1]+2,ty_)]:[806,ty-12]),hold:o.hold,holds:!!o.hold},o.hf||{}));
  if(o.ivy)r.ivy=PK.person(x,W2,ix,F,H,MW_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}

/* ---------------------------------------------------------------- what people write to each other
   Helena's chat with Graham, as her laptop has it: two lines, each typed as the voice says its part (f1, f2: when); and as
   Graham's phone has it, where he answers at ta, typed in a second. It says what the voice says: a not now, with a reason and a date (the date is the
   film's own, a Monday two weeks before the director's message). */
const MW_SAID=[{s:"Not now, sorry: we're at our limit."},{lines:["We'll start yours","on Monday 30 August."]}];
const mw_chat=(f1,f2)=>({title:"Graham Ellis",who:["graham"],me:"helena",msgs:[[f1+1.6,f1-0.1],[f2+1.5,f2-0.1]].map(([at,from],i)=>Object.assign({who:"helena",at,type:at-from},MW_SAID[i]))});
const mw_chat2=ta=>({title:"Helena Novak",who:["helena"],me:"graham",msgs:MW_SAID.map(m=>Object.assign({who:"helena",at:-1e3},m)).concat([{who:"graham",s:"Thanks for saying. That works.",at:ta,type:1.0}])});
/* the director's message, as Helena's laptop has it: a message from the director of digital services, with no picture, its lines
   coming in as the voice says them (la: how far each has come in, 0 to 1); then Helena's answer, typed in (ra: how far each of its
   lines is typed, 0 to 1), and the director's reply (da). The panel's size comes from its words. */
const MW_MAIL={from:"From the director of digital services",ask:["Could I have a count of tickets","closed by each person, each month?","I'd like to know if the team is getting faster,","and if anyone needs help."],
  re:["Not a count per person, I'm afraid.","Here's our page, and what our readings changed."],back:["Thanks. I'll take it to the quarterly review."]};
function mw_mailSize(x){const all=[MW_MAIL.from].concat(MW_MAIL.ask,MW_MAIL.re,MW_MAIL.back),wd=Math.max(...all.map(s=>ag_tw(x,s,{w:600,size:30})));return{w:Math.ceil(wd+80),h:84+4*44+20+2*44+28+44+40};}
function mw_mail(c,x,y,w,h,la,ra,da){const U=PK.u;ag_T(c,MW_MAIL.from.toUpperCase(),x+30,y+48,{w:800,size:28,ls:1,col:PK.C.mut});
  let yy=y+96;MW_MAIL.ask.forEach((s,i)=>{ag_T(c,s,x+30,yy,{w:600,size:30,a:U.clamp(la[i]||0,0,1)});yy+=44;});yy+=20;
  MW_MAIL.re.forEach((s,i)=>{const k=U.clamp(ra[i]||0,0,1);if(k<=0.004){yy+=44;return;}const n=Math.max(1,Math.round(s.length*k)),part=s.slice(0,n);ag_T(c,part,x+30,yy,{w:700,size:30,col:PK.C.blue});yy+=44;});yy+=28;
  MW_MAIL.back.forEach(s=>{ag_T(c,s,x+30,yy,{w:600,size:30,a:U.clamp(da||0,0,1)});yy+=44;});}
