/* ===== Read by an agent: the film's own pictures =====
   Drawn in the module's way (paper, cards and tags; ink on cream; colour only where it means something), with the opening's things
   of about 2000 and the agent's chat. Every word is at least 28 px as seen; nothing but the captions goes below y 890.
     ra_screen(ctx, o)                 the page on the office's monitor (RA_SCREEN): o.lines (strings), o.typed {line, n} (letters typed
                                       so far), o.mark {line, word, u (the wavy line drawn on), a}, o.popup {line, word, items, a, k, hi},
                                       o.swap {line, from, to, u}, o.pointer [x, y, a], o.caret {line, a}
     ra_printout(ctx, x, y, o)         the checker's word list, printed on continuous paper: o.words [{w, gap, fill}], o.lit, o.a, o.k
     ra_page(ctx, x, y, w, h, o)       a printed page: grey lines of words too small to read, and one real line (o.line, o.word lit)
     ra_screens(ctx, x, y, o)          many small web pages, each with its Cupertino lit: o.n (how many show), o.cols, o.a
     ra_chat(ctx, x, y, w, h, o)       the graduations team's agent: its page, Malia's question, and its answer in violet
     ra_descCard(ctx, x, y, w, rows, o) a column's description, row by row: [{k, v, dash}], wrapped
   The agent's words are violet (AG.violet), as the agent films colour a model's words; nothing else in the film is violet. */

const RA_VIOLET=[88,78,196];
const RA_PAGE_SIZE=30,RA_LH=52;
// where a line of the monitor's page sits, and where a word starts in it
const ra_lineY=i=>RA_SCREEN.page.y+70+i*RA_LH,ra_lineX=()=>RA_SCREEN.page.x+44;
function ra_wordX(ctx,line,word){const i=line.indexOf(word),f={w:500,size:RA_PAGE_SIZE};return i<0?null:[ra_lineX()+dq_tw(ctx,line.slice(0,i),f),dq_tw(ctx,word,f)];}
// a wavy line under a word, drawn on from the left (u 0 to 1): the checker's mark
function ra_wavy(ctx,x0,x1,y,col,u,a){if(u<=0||a<=0)return;const xe=lerp(x0,x1,clamp(u,0,1));ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.6;ctx.lineJoin="round";ctx.beginPath();
  for(let x=x0;x<=xe;x+=2){const y_=y+Math.sin((x-x0)/4.2)*2.6;x===x0?ctx.moveTo(x,y_):ctx.lineTo(x,y_);}ctx.stroke();ctx.restore();}
// the mouse pointer of the time: a white arrow with a dark edge
function ra_arrow(ctx,x,y,a,s){if(a<=0)return;s=s||1;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.shadowColor="rgba(0,0,0,0.25)";ctx.shadowBlur=4;ctx.shadowOffsetX=-2;ctx.shadowOffsetY=3;
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,30);ctx.lineTo(7.5,23);ctx.lineTo(13,35);ctx.lineTo(18,33);ctx.lineTo(12.5,21.5);ctx.lineTo(22,21.5);ctx.closePath();
  ctx.fillStyle="#fff";ctx.fill();ctx.shadowColor="transparent";ctx.strokeStyle="#111";ctx.lineWidth=1.6;ctx.lineJoin="round";ctx.stroke();ctx.restore();}
// the checker's menu under a word: its first offer in bold, then the rest; hi (0 to 1) lights the first, as the pointer rests on it
function ra_menu(ctx,x,y,items,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const f0={w:800,size:RA_PAGE_SIZE},f1={w:500,size:RA_PAGE_SIZE},
    w=Math.max(...items.map((s,i)=>dq_tw(ctx,s,i?f1:f0)))+64,ih=48,h=items.length*ih+(items.length>1?14:0)+12,bb={x,y,w,h,first:[x+8,y+6,w-16,ih]};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null){const k=lerp(0.85,1,ag_spr(o.k,0,0.4));ctx.translate(x,y);ctx.scale(k,k);ctx.translate(-x,-y);}
  ctx.shadowColor="rgba(0,0,0,0.28)";ctx.shadowBlur=14;ctx.shadowOffsetX=-4;ctx.shadowOffsetY=6;ctx.fillStyle="#f1f1ee";ctx.fillRect(x,y,w,h);ctx.shadowColor="transparent";
  ctx.strokeStyle="rgba(70,70,70,0.55)";ctx.lineWidth=1.4;ctx.strokeRect(x+0.5,y+0.5,w-1,h-1);
  const hi=o.hi||0;if(hi>0){ctx.fillStyle="rgba(96,96,92,"+(0.22*hi)+")";ctx.fillRect(x+6,y+6,w-12,ih);}
  items.forEach((s,i)=>{const yy=y+6+i*ih+(i?14:0);if(i===1){ctx.fillStyle="rgba(90,90,90,0.4)";ctx.fillRect(x+12,yy-8,w-24,1.4);}
    dq_T(ctx,s,x+30,yy+ih/2+10,Object.assign({col:i?DQ.soft:DQ.ink},i?f1:f0));});
  ctx.restore();return bb;}
function ra_screen(ctx,o){o=o||{};const S=RA_SCREEN,f={w:500,size:RA_PAGE_SIZE},lines=o.lines||[],shown=[];ctx.save();rr(ctx,S.x,S.y,S.w,S.h,S.r);ctx.clip();
  // each line as far as it's typed; a word being swapped for another (the writer taking the checker's offer) fades into it in place
  lines.forEach((ln,i)=>{if(o.typed&&i>o.typed.line)return;const s=o.typed&&o.typed.line===i?ln.slice(0,Math.max(0,Math.floor(o.typed.n))):ln,x0=ra_lineX(),y=ra_lineY(i);shown[i]=s;
    if(o.swap&&o.swap.line===i){const sw=o.swap,u=clamp(sw.u,0,1),k=s.indexOf(sw.from);if(k>=0&&u>0){const pre=s.slice(0,k),post=s.slice(k+sw.from.length);
        dq_T(ctx,pre,x0,y,Object.assign({col:DQ.ink},f));const px=x0+dq_tw(ctx,pre,f),wf=dq_tw(ctx,sw.from,f),wt=dq_tw(ctx,sw.to,f),ww=lerp(wf,wt,ag_sine(u));
        if(u<1)dq_T(ctx,sw.from,px,y,Object.assign({col:DQ.ink,a:1-ag_in(u,0,0.5)},f));dq_T(ctx,sw.to,px,y,Object.assign({col:DQ.ink,a:ag_in(u,0.4,0.5)},f));
        if(post)dq_T(ctx,post,px+ww,y,Object.assign({col:DQ.ink},f));shown[i]=u>=0.5?pre+sw.to+post:s;return;}}
    if(s)dq_T(ctx,s,x0,y,Object.assign({col:DQ.ink},f));});
  // the caret: a thin bar where the next letter goes, blinking
  if(o.caret&&o.caret.a>0&&shown[o.caret.line]!=null){const i=o.caret.line,cx=ra_lineX()+dq_tw(ctx,shown[i],f)+3,on=o.caret.blink===false||Math.floor((o.caret.t||0)*1.9)%2===0;
    if(on){ctx.fillStyle=rgba(DQ.ink,o.caret.a);ctx.fillRect(cx,ra_lineY(i)-28,2.4,36);}}
  if(o.mark){const m=o.mark,q=ra_wordX(ctx,lines[m.line],m.word);if(q)ra_wavy(ctx,q[0],q[0]+q[1],ra_lineY(m.line)+9,DQ.stop,m.u,m.a==null?1:m.a);}
  if(o.stamp){const m=o.stamp,q=ra_wordX(ctx,lines[m.line],m.word);if(q&&m.a>0){ctx.save();ctx.globalAlpha*=m.a;dq_stampMark(ctx,q[0]+q[1]/2,ra_lineY(m.line)-62,"pass",17);ctx.restore();}}
  let menu=null;if(o.popup){const p=o.popup,q=ra_wordX(ctx,lines[p.line],p.word);if(q)menu=ra_menu(ctx,q[0]-10,ra_lineY(p.line)+20,p.items,{a:p.a,k:p.k,hi:p.hi});}
  ctx.restore();if(o.pointer&&o.pointer[2]>0)ra_arrow(ctx,o.pointer[0],o.pointer[1],o.pointer[2]);return menu;}
// where the checker's menu will sit under a word, and the middle of its first offer: for the pointer to go to
function ra_menuAt(ctx,line,word,i){const q=ra_wordX(ctx,line,word);return q?{x:q[0]-10,y:ra_lineY(i)+20,first:[q[0]+70,ra_lineY(i)+20+6+24]}:null;}

/* ---------------------------------------------------------------- the checker's word list, printed */
// continuous paper of the time, its sprocket holes down both edges, the words typed one to a line; a word that isn't there is a
// dashed box with the word in grey (it fills in, solid, as fill goes from 0 to 1)
function ra_printout(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const words=o.words||[],lh=o.lh||64,w=o.w||620,h=o.h||(words.length*lh+70),f={w:500,size:32,f:"mono"};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  ctx.save();ctx.shadowColor="rgba(60,40,20,0.35)";ctx.shadowBlur=26;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=12;ctx.fillStyle="#f6f4ec";ctx.fillRect(x,y-40,w,h+80);ctx.restore();
  // faint green-grey bands of the old paper, and the tear lines at each fold
  for(let yy=y-40,i=0;yy<y+h+40;yy+=lh*2,i++){ctx.fillStyle="rgba(150,170,150,0.1)";ctx.fillRect(x+54,yy,w-108,lh);}
  ctx.fillStyle="rgba(120,110,90,0.25)";for(let xx=x;xx<x+w;xx+=10)ctx.fillRect(xx,y-40,5,1.2);
  for(const sx of [x+24,x+w-24])for(let yy=y-26;yy<y+h+40;yy+=32){ctx.fillStyle="#cdbf9f";ctx.beginPath();ctx.arc(sx,yy,7.5,0,TAU);ctx.fill();ctx.fillStyle="rgba(80,60,40,0.4)";ctx.beginPath();ctx.arc(sx-1,yy+1,7.5,0,TAU);ctx.fill();}
  for(const lx of [x+48,x+w-48]){ctx.fillStyle="rgba(120,110,90,0.3)";for(let yy=y-40;yy<y+h+40;yy+=8)ctx.fillRect(lx,yy,1.2,4);}
  words.forEach((wd,i)=>{const yy=y+30+i*lh,tx=x+90;
    if(wd.gap){const fu=clamp(wd.fill||0,0,1),bw=dq_tw(ctx,wd.w,f)+44;
      if(fu<1){ctx.save();ctx.globalAlpha*=1-ag_in(fu,0.3,0.5);dq_card(ctx,tx-22,yy-6,bw,lh-8,{dash:true,r:6});dq_T(ctx,wd.w,tx,yy+lh/2+6,Object.assign({col:DQ.dim},f));ctx.restore();}
      if(fu>0){ctx.save();ctx.globalAlpha*=ag_in(fu,0,0.6);dq_T(ctx,wd.w,tx,yy+lh/2+6,Object.assign({col:DQ.ink},f));if(wd.mark)dq_stampMark(ctx,tx+bw+10,yy+lh/2-4,wd.mark,17);ctx.restore();}
      return;}
    if(o.lit===i||(o.lit&&o.lit.includes&&o.lit.includes(i))){ctx.fillStyle="rgba(196,172,128,0.3)";ctx.fillRect(tx-14,yy+2,dq_tw(ctx,wd.w,f)+28,lh-14);}
    if(wd.dots){dq_T(ctx,"…",tx,yy+lh/2+6,Object.assign({col:DQ.soft},f));return;}
    dq_T(ctx,wd.w,tx,yy+lh/2+6,Object.assign({col:DQ.ink},f));});
  ctx.restore();}

/* ---------------------------------------------------------------- a printed page */
// a page of a report or a magazine: its heading and paragraphs as grey lines too small to read (drawn, not written), and one line
// written out, with its word lit; o.head (a masthead band, for the magazine), o.cols (2 for the magazine), o.lineAt (the real line's row)
function ra_page(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const r=ag_rnd(o.seed||5),pad=70,cols=o.cols||1,gut=40,cw=(w-2*pad-(cols-1)*gut)/cols;let bb=null;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));if(o.angle){ctx.translate(x+w/2,y+h/2);ctx.rotate(o.angle);ctx.translate(-x-w/2,-y-h/2);}
  ctx.save();ctx.shadowColor="rgba(60,40,20,0.35)";ctx.shadowBlur=28;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=12;ctx.fillStyle="#fbfaf6";ctx.fillRect(x,y,w,h);ctx.restore();
  let top=y+pad;if(o.head){ctx.fillStyle="rgba(70,72,78,0.85)";ctx.fillRect(x,y,w,96);ctx.fillStyle="rgba(240,240,236,0.55)";ctx.fillRect(x+pad,y+38,w*0.32,16);ctx.fillRect(x+w-pad-w*0.16,y+42,w*0.16,10);top=y+96+50;}
  else{ctx.fillStyle="rgba(60,60,64,0.55)";ctx.fillRect(x+pad,top,w*0.46,15);ctx.fillRect(x+pad,top+30,w*0.3,10);top+=80;}
  const lh=26,real=o.lineAt==null?6:o.lineAt;
  for(let cI=0;cI<cols;cI++){const cx=x+pad+cI*(cw+gut);let yy=top;let row=0;
    while(yy<y+h-pad){if(cI===0&&row===real&&o.line){const f={w:600,size:o.size||30};yy+=18;const lineY=yy+22;dq_T(ctx,o.line,cx,lineY,Object.assign({col:DQ.ink},f));
        if(o.word){const i=o.line.indexOf(o.word),wx=cx+dq_tw(ctx,o.line.slice(0,i),f),ww=dq_tw(ctx,o.word,f);bb={x:wx,y:lineY-28,w:ww,h:38};
          if(o.lit>0){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle="rgba(232,206,150,"+(0.85*o.lit)+")";ctx.fillRect(wx-6,lineY-30,(ww+12)*clamp(o.lit*1.4,0,1),42);ctx.restore();}}
        yy+=58;row++;continue;}
      const para=row%7===6,len=para?0.35+r()*0.3:0.9+r()*0.1;if(!(para&&row%2)){ctx.fillStyle="rgba(96,92,86,0.38)";ctx.fillRect(cx,yy,cw*len,9);}yy+=para?lh*1.6:lh;row++;}}
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- many web pages */
// small pages of the organisations' websites, each with a grey title bar, grey lines and one word lit; they come in one by one
function ra_screens(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const cols=o.cols||8,rows=o.rows||4,pw=o.pw||170,ph=o.ph||124,gx=o.gx||22,gy=o.gy||22,n=o.n==null?cols*rows:o.n,r=ag_rnd(o.seed||9);
  ctx.save();ctx.globalAlpha*=a;for(let i=0;i<cols*rows;i++){const ri=Math.floor(i/cols),ci=i%cols,px=x+ci*(pw+gx)+(r()-0.5)*8,py=y+ri*(ph+gy)+(r()-0.5)*8,on=clamp(n-i,0,1),lr=r(),lc=r();if(on<=0)continue;
    ctx.save();ctx.globalAlpha*=on;ctx.shadowColor="rgba(60,40,20,0.3)";ctx.shadowBlur=12;ctx.shadowOffsetX=-4;ctx.shadowOffsetY=6;ctx.fillStyle="#fbfaf6";ctx.fillRect(px,py,pw,ph);ctx.shadowColor="transparent";
    ctx.fillStyle="rgba(110,112,118,0.6)";ctx.fillRect(px,py,pw,16);ctx.fillStyle="rgba(96,92,86,0.32)";for(let k=0;k<6;k++)ctx.fillRect(px+12,py+28+k*15,(pw-24)*(k===5?0.5:0.9),5);
    const lk=1+Math.floor(lr*4),lx=px+12+lc*(pw-90);ctx.fillStyle="rgba(214,170,90,0.85)";ctx.fillRect(lx,py+25+lk*15,62,11);ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the graduations team's agent */
// its page, with Databricks' mark: Malia's question on a pale card at the right, then the agent's answer at the left, its words violet.
// o.q (the question), o.qA, o.ans (the answer's words), o.ansA, o.sub (a second line under the answer: what it counted), o.subA, o.big
// (the answer's number, set large), o.k, o.a
function ra_chat(ctx,x,y,w,h,o){o=o||{};return dq_window(ctx,x,y,w,h,{logo:"databricks",product:"Databricks",title:o.title||"Genie Agent",a:o.a,k:o.k,on:o.on,draw:(c,b)=>{
    const qf={w:600,size:30},ql=o.q?dq_wrap(c,o.q,b.w*0.7,qf):[],qh=ql.length*42+40,qw=Math.max(...ql.map(l=>dq_tw(c,l,qf)),0)+52;
    if(o.q&&(o.qA==null||o.qA>0)){c.save();c.globalAlpha*=o.qA==null?1:o.qA;const qx=b.x+b.w-qw-10,qy=b.y+20;c.fillStyle="rgba(232,226,212,1)";rr(c,qx,qy,qw,qh,18);c.fill();
      ql.forEach((l,i)=>dq_T(c,l,qx+26,qy+52+i*42,qf));if(o.who)dq_T(c,o.who,qx+qw,qy+qh+40,{w:600,size:28,col:DQ.soft,align:"right"});c.restore();}
    const ay=b.y+20+qh+(o.who?62:30);if(o.ans&&(o.ansA==null||o.ansA>0)){c.save();c.globalAlpha*=o.ansA==null?1:o.ansA;
      // a violet bar beside the agent's answer (the sphere itself is drawn once, in the room, never in its page too)
      c.fillStyle=rgba(RA_VIOLET,0.9);rr(c,b.x+36,ay+14,7,o.sub?(o.big!=null?150:120):(o.big!=null?90:60),3.5);c.fill();
      let yy=ay+56;if(o.big!=null){dq_T(c,String(o.big),b.x+100,ay+80,{w:800,size:84,color:rgba(RA_VIOLET,1)});yy=ay+80;dq_T(c,o.ans,b.x+100+dq_tw(c,String(o.big),{w:800,size:84})+22,yy,{w:600,size:32,color:rgba(RA_VIOLET,1)});}
      else dq_T(c,o.ans,b.x+100,yy,{w:600,size:32,color:rgba(RA_VIOLET,1)});
      if(o.sub&&(o.subA==null||o.subA>0)){const sl=dq_wrap(c,o.sub,b.w-130,{w:500,size:28});sl.forEach((l,i)=>dq_T(c,l,b.x+100,yy+50+i*38,{w:500,size:28,color:rgba(RA_VIOLET,o.subA==null?1:o.subA)}));}
      c.restore();}}});}

/* ---------------------------------------------------------------- a column's description */
// a card holding a column's name (typed), and its description row by row: each row's heading on the left, its words wrapped on the
// right; a row with dash:true is an empty space in a dashed box (nobody wrote it); rowA(i) brings rows in; o.edge, o.k, o.a, o.head
function ra_descCard(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,labW=o.labW||230,vf={w:600,size:30},vw=w-2*DQ_PAD-labW,rh=rows.map(r=>r.dash?62:Math.max(1,dq_wrap(ctx,r.v,vw,vf).length)*42+20),
    head=o.head?92:24,h=head+rh.reduce((s,v)=>s+v,0)+16,bb={x,y,w,h};if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{edge:o.edge,on:o.on});if(o.head){dq_T(ctx,o.head,x+DQ_PAD,y+56,{w:500,size:32,f:"mono"});if(o.type)dq_T(ctx,o.type,x+w-DQ_PAD,y+56,{w:500,size:28,f:"mono",col:DQ.soft,align:"right"});
    ctx.fillStyle="rgba(120,96,70,0.45)";ctx.fillRect(x+16,y+head-8,w-32,2);}
  let yy=y+head;rows.forEach((r,i)=>{const ra=o.rowA?o.rowA(i):1;if(ra>0.004){ctx.save();ctx.globalAlpha*=ra;dq_T(ctx,r.k,x+DQ_PAD,yy+40,{w:700,size:28,col:DQ.soft});
      if(r.dash)dq_card(ctx,x+DQ_PAD+labW,yy+10,vw,44,{dash:true,r:6});else dq_wrap(ctx,r.v,vw,vf).forEach((l,j)=>dq_T(ctx,l,x+DQ_PAD+labW,yy+40+j*42,Object.assign({col:r.col||DQ.ink},vf)));
      ctx.restore();}yy+=rh[i];});
  ctx.restore();return bb;}
