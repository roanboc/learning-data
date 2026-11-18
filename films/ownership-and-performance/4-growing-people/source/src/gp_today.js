/* ===== Growing people: lesson study today, and a new analyst alone =====
   The rest of the opening's places: a primary classroom in Japan today, where many teachers watch a research lesson; a classroom in
   the United States, where a team of teachers tries lesson study with fractions; and an office at the end of a day, where a new
   analyst works alone. Today's people wear plain clothes of now, the children no uniforms. The rooms keep the 1870s classroom's eye
   line (GP_M.eye), so every room of the opening is one height. */
const GP_TPAL={wall:[238,236,226],green:[56,92,74],curtain:[234,220,184],floor:[204,172,130],desk:[224,194,150],seat:[132,146,160],white:[250,250,246],blind:[228,222,206],
  office:[228,224,216],sky0:[96,104,150],sky1:[226,160,134],city:[74,78,104],cityLit:[246,214,150],strip:[[232,190,190],[204,192,228],[236,224,168],[190,216,208]],box:[204,170,126]};
const gp_t=(n,i)=>PK.S.tone(i==null?GP_TPAL[n]:GP_TPAL[n][i]);

/* ---------------------------------------------------------------- today's people */
Object.assign(GP_CAST,{
  // a teacher in Japan today, who teaches the research lesson, and the teachers who watch it
  sato:{key:"sato",name:"",skin:[238,202,170],hair:{style:"bob",c:[40,32,36]},top:{kind:"sweater",c:[168,140,126]},bottom:{kind:"skirt",c:[84,84,100]},shoe:[240,238,232]},
  obs1:{key:"obs1",name:"",skin:[230,190,156],hair:{style:"short",c:[36,30,32]},glasses:[60,50,50],top:{kind:"jacket",c:[86,96,112],inner:[240,240,236]},bottom:{kind:"trousers",c:[72,74,88]},shoe:[60,50,50]},
  obs2:{key:"obs2",name:"",skin:[240,208,180],hair:{style:"long",c:[44,34,36]},top:{kind:"jacket",c:[172,154,132],inner:[246,240,230]},bottom:{kind:"trousers",c:[92,86,96]},shoe:[70,56,54]},
  obs3:{key:"obs3",name:"",skin:[226,186,150],hair:{style:"crop",c:[60,54,56]},top:{kind:"sweater",c:[118,128,110]},bottom:{kind:"trousers",c:[80,78,84]},shoe:[58,48,48]},
  obs4:{key:"obs4",name:"",skin:[236,198,166],hair:{style:"bun",c:[50,40,40]},glasses:[70,56,56],top:{kind:"sweater",c:[146,124,144]},bottom:{kind:"skirt",c:[76,80,100]},shoe:[66,52,52]},
  // in the United States: a teacher who passes the book on, her colleagues, and the researcher who brings the fractions kit
  ruth:{key:"ruth",name:"",skin:[196,148,112],hair:{style:"long",c:[52,38,32]},top:{kind:"sweater",c:[150,108,98]},bottom:{kind:"trousers",c:[70,72,92]},shoe:[62,50,48]},
  dee:{key:"dee",name:"",skin:[120,82,62],hair:{style:"coily",c:[34,26,26]},earrings:[226,206,160],top:{kind:"jacket",c:[120,148,150],inner:[240,236,228]},bottom:{kind:"skirt",c:[84,76,90]},shoe:[58,46,46]},
  matt:{key:"matt",name:"",skin:[240,206,180],hair:{style:"short",c:[150,110,72]},beard:[150,112,80],top:{kind:"sweater",c:[110,120,140]},bottom:{kind:"trousers",c:[86,82,78]},shoe:[70,56,48]},
  lin:{key:"lin",name:"",skin:[236,200,166],hair:{style:"bob",c:[36,30,32]},glasses:[60,50,50],top:{kind:"jacket",c:[196,176,150],inner:[92,96,112]},bottom:{kind:"trousers",c:[74,70,82]},shoe:[60,48,48]},
  // the new analyst who works alone, and her manager
  ana:{key:"ana",name:"",skin:[214,170,136],hair:{style:"long",c:[64,44,36]},top:{kind:"sweater",c:[150,138,160]},bottom:{kind:"trousers",c:[66,68,86]},shoe:[60,48,50]},
  boss:{key:"boss",name:"",skin:[232,196,168],hair:{style:"short",c:[120,110,104]},glasses:[64,54,54],top:{kind:"jacket",c:[96,90,96],inner:[238,236,230]},bottom:{kind:"trousers",c:[70,70,80]},shoe:[54,44,44]}
});
// children of today, in their own clothes: kid(i) in Japan, usKid(i) in the United States
const GP_TOPS=[[214,170,150],[150,170,160],[226,196,130],[132,140,170],[196,120,110],[120,150,140],[232,220,200],[170,150,190],[110,120,130]];
const gp_jpKid=i=>({key:"jk"+i,name:"",kid:true,skin:GP_KSKIN[(i*2+1)%5],hair:{style:["crop","bob","short","long","crop","bun","short","bob","crop"][i%9],c:[34+(i%3)*8,28,30]},
  top:{kind:"sweater",c:GP_TOPS[(i*4+1)%9]},bottom:{kind:i%3===1?"skirt":"trousers",c:[[70,76,98],[86,78,74],[112,104,96]][i%3]},shoe:[244,242,236]});
const GP_JKIDS=[0,1,2,3,4,5,6,7,8].map(gp_jpKid);
const GP_US_SKIN=[[244,212,186],[198,150,114],[118,78,56],[226,180,146],[160,112,84],[236,196,160]];
const gp_usKid=i=>({key:"uk"+i,name:"",kid:true,skin:GP_US_SKIN[i%6],hair:{style:["coily","long","short","bob","coily","crop"][i%6],c:[[40,32,36],[150,104,62],[30,24,24],[92,60,40],[34,26,26],[62,44,40]][i%6]},
  top:{kind:"sweater",c:GP_TOPS[(i*5+3)%9]},bottom:{kind:i%2?"skirt":"trousers",c:[[70,76,98],[112,104,96],[86,78,74]][i%3]},shoe:[[220,90,80],[70,80,110],[240,240,236]][i%3]});

/* ---------------------------------------------------------------- what they hold */
// a clipboard in one hand, where a teacher who watches notes what the children do
const gp_clip=(ctx,hd,deg,J)=>{const S=PK.S,U=PK.u,k=J.u*1.5,x=hd[0]+10*J.u,y=hd[1]-16*J.u;S.fill(ctx,c=>U.rrect(c,x-30*k,y-44*k,60*k,80*k,3*k),[150,118,86],{w:0.7});
  S.fill(ctx,c=>U.rrect(c,x-25*k,y-36*k,50*k,66*k,2*k),gp_t("white"),{w:0.5,flat:true});S.fill(ctx,c=>U.rrect(c,x-10*k,y-48*k,20*k,10*k,2*k),[170,174,180],{w:0.5,flat:true});
  S.line(ctx,c=>{for(let i=0;i<4;i++){c.moveTo(x-18*k,y-24*k+i*12*k);c.lineTo(x+(i%2?10:18)*k,y-24*k+i*12*k);}},[150,150,160],0.4);};
// a book, closed, held in a hand: a plain cover, nothing written on it; a: how far it is there (it passes from hand to hand)
const gp_tome=a=>(ctx,hd,deg,J)=>{if(a!=null&&a<=0.004)return;const S=PK.S,U=PK.u,k=J.u*1.6,x=hd[0]+14*J.u,y=hd[1]-6*J.u;ctx.save();if(a!=null)ctx.globalAlpha*=Math.min(1,a);
  S.fill(ctx,c=>U.rrect(c,x-36*k,y-50*k,72*k,96*k,4*k),[62,96,108],{w:0.8});S.fill(ctx,c=>U.rrect(c,x+30*k,y-48*k,6*k,92*k,2*k),gp_t("white"),{w:0.5,flat:true});
  S.fill(ctx,c=>U.rrect(c,x-24*k,y-30*k,44*k,8*k,2*k),[226,214,186],{line:false,flat:true});ctx.restore();};
// a strip of paper held up, folded in parts: n parts, one of them coloured (a fraction a child shows)
const gp_strip=(n,o)=>(ctx,hd,deg,J)=>{o=o||{};const S=PK.S,U=PK.u,k=J.u*1.5,w=150*k,h=30*k,x=hd[0]-w*0.15,y=hd[1]-(o.dy==null?40:o.dy)*J.u;
  ctx.save();if(ctx.getTransform().a<0){ctx.translate(hd[0],0);ctx.scale(-1,1);ctx.translate(-hd[0],0);}
  S.fill(ctx,c=>U.rrect(c,x-w/2,y-h/2,w,h,3*k),gp_t("white"),{w:0.7});S.fill(ctx,c=>U.rrect(c,x-w/2,y-h/2,w/n,h,3*k),gp_t("strip",o.col==null?0:o.col),{w:0.6,flat:true});
  S.line(ctx,c=>{for(let i=1;i<n;i++){c.moveTo(x-w/2+i*w/n,y-h/2);c.lineTo(x-w/2+i*w/n,y+h/2);}},null,0.6);ctx.restore();};
// strips of paper lying on a table (the fractions kit), in the table's own px from (x, y)
function gp_strips(ctx,x,y,k){const S=PK.S,U=PK.u;[[0,0,2,0],[60,14,3,1],[-40,26,4,2],[90,-8,4,3],[-80,-6,2,1]].forEach(([dx,dy,n,c],i)=>{const w=110*k,h=20*k;ctx.save();ctx.translate(x+dx*k,y+dy*k*0.4);ctx.rotate((i%3-1)*0.06);
  S.fill(ctx,cc=>U.rrect(cc,-w/2,-h/2,w,h,2*k),gp_t("white"),{w:0.5});S.fill(ctx,cc=>U.rrect(cc,-w/2,-h/2,w/n,h,2*k),gp_t("strip",c),{w:0.4,flat:true});ctx.restore();});}
// a box of the researchers' materials, carried in both hands
const gp_kit=(ctx,hd,deg,J)=>{const S=PK.S,U=PK.u,k=J.u*1.5,x=hd[0]+20*J.u,y=hd[1]-12*J.u;S.fill(ctx,c=>U.rrect(c,x-70*k,y-46*k,140*k,64*k,4*k),gp_t("box"),{w:0.8});
  S.fill(ctx,c=>U.rrect(c,x-70*k,y-46*k,140*k,12*k,3*k),U.dk(gp_t("box"),0.12),{w:0.6,flat:true});for(let i=0;i<3;i++)S.fill(ctx,c=>U.rrect(c,x-50*k+i*34*k,y-64*k,26*k,22*k,2*k),gp_t("strip",i),{w:0.5,flat:true});};
// a form, the year's grade on it, passed across a desk: a (0 to 1) how far it is there
const gp_form=a=>(ctx,hd,deg,J)=>{if(a!=null&&a<=0.004)return;const S=PK.S,U=PK.u,k=J.u*1.5,x=hd[0]+18*J.u,y=hd[1]-14*J.u;ctx.save();if(a!=null)ctx.globalAlpha*=Math.min(1,a);
  S.fill(ctx,c=>U.rrect(c,x-34*k,y-46*k,68*k,88*k,2*k),gp_t("white"),{w:0.6});S.line(ctx,c=>{for(let i=0;i<5;i++){c.moveTo(x-24*k,y-32*k+i*12*k);c.lineTo(x+(i%2?14:24)*k,y-32*k+i*12*k);}},[150,150,160],0.4);
  S.fill(ctx,c=>U.rrect(c,x+6*k,y+20*k,22*k,14*k,2*k),[210,206,200],{w:0.5,flat:true});ctx.restore();};

/* ---------------------------------------------------------------- places */
// a classroom of today, in Japan: windows with curtains on the left, a green board on the right, a clock over it
function gp_japanPlace(ctx){const S=PK.S,U=PK.u;PK.paint.wall(ctx,gp_t("wall"),800);S.begin(ctx,{lw:3,far:0.1,sh:5});
  for(const x of [120,560]){PK.window(ctx,x,190,340,380,(c,x0,y0,w,h)=>gp_view(c,x0,y0,w,h,x>300?1:0),{bar:true,light:false});
    S.fill(ctx,c=>{U.rrect(c,x-46,170,56,420,8);U.rrect(c,x+330,170,56,420,8);},gp_t("curtain"),{});S.line(ctx,c=>{for(const dx of [-30,-12,346,364]){c.moveTo(x+dx,184);c.lineTo(x+dx,580);}},U.dk(gp_t("curtain"),0.25),0.4);}
  S.fill(ctx,c=>U.rrect(c,-20,150,1960,14,3),[200,196,186],{});
  S.fill(ctx,c=>U.rrect(c,1166,206,680,370,6),[184,176,160],{});S.fill(ctx,c=>U.rrect(c,1180,220,652,342,3),gp_t("green"),{line:false,flat:true});
  ctx.save();ctx.globalAlpha*=0.14;ctx.strokeStyle="#fff";ctx.lineWidth=10;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(1240,300);ctx.quadraticCurveTo(1400,290,1560,302);ctx.moveTo(1300,480);ctx.quadraticCurveTo(1500,470,1700,486);ctx.stroke();ctx.restore();
  S.fill(ctx,c=>U.rrect(c,1150,568,712,14,4),[200,192,176],{});PK.clock(ctx,1506,120,40,10.3);
  PK.paint.floorAt(ctx,800,gp_t("floor"),true);PK.paint.skirting(ctx,780);}
// a classroom in the United States: a whiteboard, windows with blinds, a shelf of books
function gp_usPlace(ctx){const S=PK.S,U=PK.u;PK.paint.wall(ctx,[234,228,214],800);S.begin(ctx,{lw:3,far:0.1,sh:5});
  for(const x of [150,600]){PK.window(ctx,x,200,360,360,PK.view.campus,{bld:x>300?0.2:0.6,light:false});S.fill(ctx,c=>U.rrect(c,x,200,360,130,2),gp_t("blind"),{w:0.7});
    S.line(ctx,c=>{for(let y=212;y<330;y+=14){c.moveTo(x+4,y);c.lineTo(x+356,y);}},U.dk(gp_t("blind"),0.25),0.4);}
  PK.board(ctx,1190,214,620,330);PK.paint.shelf(ctx,1180,640,300,77,{});PK.paint.shelf(ctx,1520,640,300,79,{free:80});PK.pot(ctx,1766,640,56,44);PK.plant(ctx,1766,596,0.42,4,0);
  PK.paint.floorAt(ctx,800,[178,170,160],false);PK.paint.skirting(ctx,780);}
// an office at the end of a day: the window at dusk, the city's lights coming on; a desk drawn with whoever sits at it
function gp_cityView(ctx,x,y,w,h){const S=PK.S,U=PK.u,g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,U.css(gp_t("sky0")));g.addColorStop(1,U.css(gp_t("sky1")));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  S.begin(ctx,{lw:1.6,far:0.5,sh:3});const R=U.rnd(17);let bx=x-20;while(bx<x+w){const bw=50+R()*70,bh=h*(0.25+R()*0.45);S.fill(ctx,c=>U.rrect(c,bx,y+h-bh,bw,bh+10,2),gp_t("city"),{w:0.5,flat:true});
    for(let i=0;i<4;i++)for(let j=0;j<Math.floor(bh/36);j++)if(R()<0.4){ctx.fillStyle=U.css(gp_t("cityLit"),0.9);ctx.fillRect(bx+8+i*(bw-16)/4,y+h-bh+12+j*36,(bw-16)/4-6,14);}bx+=bw+6;}}
function gp_officePlace(ctx){const S=PK.S,U=PK.u;PK.paint.wall(ctx,gp_t("office"),800);S.begin(ctx,{lw:3,far:0.1,sh:5});
  PK.window(ctx,240,180,640,400,(c,x,y,w,h)=>gp_cityView(c,x,y,w,h),{light:false});
  // a calendar on the wall: a year of squares, with nothing written in them
  S.fill(ctx,c=>U.rrect(c,1060,200,220,250,4),gp_t("white"),{});for(let r=0;r<4;r++)for(let q=0;q<3;q++)S.fill(ctx,c=>U.rrect(c,1076+q*68,234+r*52,58,42,2),[236,232,226],{w:0.4,flat:true});
  S.fill(ctx,c=>U.rrect(c,1060,200,220,24,4),[150,140,150],{w:0.6,flat:true});
  // the door out, on the right, and a coat stand by it
  PK.door(ctx,1650,800,240,540,{col:[176,160,140],glass:true});S.fill(ctx,c=>{U.rrect(c,1440,330,12,470,4);U.rrect(c,1400,786,92,14,4);},[110,100,96],{});
  S.fill(ctx,c=>{U.rrect(c,1404,340,40,120,16);U.ell(c,1470,360,22,30);},[150,120,110],{w:0.7});
  PK.paint.floorAt(ctx,800,[150,152,158],false);PK.paint.skirting(ctx,780);}
AG_PLACES.gpJapan=gp_japanPlace;AG_PLACES.gpUS=gp_usPlace;AG_PLACES.gpOffice=gp_officePlace;

/* ---------------------------------------------------------------- sets drawn every frame */
// a child of today at a school desk, seen from the side (the 1870s pupil, with a modern chair and desk); o as gp_pupil's
const gp_kidAt=(ctx,P,x,fl,h,o)=>{const S=PK.S,U=PK.u;o=Object.assign({t:0},o||{});const top=fl-0.37*h,x0=x+0.11*h,w=0.52*h,lw={lw:U.clamp(h*0.0056,1.4,6.5),sh:U.clamp(h*0.0078,1.5,8.5)},
    po=Object.assign({},o,{flip:false,seat:PK.seatOf(h)*1.04}),pose=o.pose||"sit";
  S.begin(ctx,lw);PK.chair(ctx,x-0.012*h,fl,h,false,{col:GP_TPAL.seat});PK.person(ctx,P,x,fl,h,pose,Object.assign({},po,{part:"lower"}));
  S.begin(ctx,lw);PK.desk(ctx,x0+w/2,top,w,fl,{col:GP_TPAL.desk,k:h/600});if(o.on)o.on(ctx,{x0,w,top,k:h/600});
  return PK.person(ctx,P,x,fl,h,pose,Object.assign({},po,{part:"upper"},o.hand?{reachN:o.hand,reachNk:o.handK==null?1:o.handK}:{},{reachF:o.reachF||[x0+w*0.2,top-0.012*h]}));};
// today's class in Japan, at the seats of the 1870s room: the same rows, children of now
function gp_jpClass(ctx,tt,o){o=o||{};GP_SEATS.forEach(([i,x,fl],j)=>{const h=gp_kidH(fl),top=fl-0.37*h,w=o.write?o.write(i,tt):0.5+0.5*Math.sin(tt*0.6+i*2.3),sx=x+0.11*h+0.52*h*0.4;
  gp_kidAt(ctx,GP_JKIDS[i],x,fl,h,{t:tt+i*1.1,hand:[sx+Math.sin(tt*8+i)*0.005*h*w,top-0.014*h],handK:0.3+0.7*w,expr:o.expr?o.expr(i,tt):"listen",gaze:o.look?o.look(i,tt):[0.7,-0.1+0.3*w],
    pose:PK.poseMix("sit","sitWork",0.4+0.4*w),on:(c,D)=>{gp_note(c,D.x0+D.w*0.4,D.top,D.k);}});if(o.after)o.after(ctx,i,j);});}
// a notebook open on a desk, seen from the side
function gp_note(ctx,x,y,k){const S=PK.S,U=PK.u;S.fill(ctx,c=>U.pg(c,[[x-50*k,y],[x+50*k,y],[x+44*k,y-7*k],[x-44*k,y-7*k]]),gp_t("white"),{w:0.5});}
