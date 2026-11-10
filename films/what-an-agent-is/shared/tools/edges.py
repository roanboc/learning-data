"""Nothing painted for a person reaches past the edge of their picture. This module's check.py runs it after steady.py; python tools/check.py
runs it, or on its own, from a film's source folder: python ../../shared/tools/edges.py (series 2's films: python
../../../what-an-agent-is/shared/tools/edges.py).

Each person is painted once into kept pictures (people.js, ag_fig and ag_layer): the head, with the hair and the hat, into a picture of
figure x 160 to 440, y 250 to 560, and the body into one of x 30 to 500, y 262 to 1108. What a painter draws past a picture's edge is
cut off there, in a straight line, and the cut moves with the person. In How it goes wrong a woman's mantle, painted with her head
(who.hat.paint) to fall over her shoulders, stopped flat above them; in Skills and workflows the top of two turbans was cut flat.
Paint a hat inside the head's picture. Paint a cloth that falls further, such as a mantle or a shawl to the shoulders, as its own
picture, laid over the person and moved with their head, or split it between the head's picture and the body's (who.top.paint),
the two meeting at y 560, as Skills and workflows does its shawls.

It makes each person's pictures again while the film is drawn (check.py's other checks draw it; on its own it draws ten frames a
second), paints each one once more on a canvas MARGIN wider on every side, and lists each picture with paint (at least INK of 255
opaque) more than PAST past its edge over at least AREA square units. People end flat at figure y 1100 by design and ag_bottomShows
keeps that edge out of sight, so a body's bottom edge doesn't count."""
import sys

INK = 32      # of 255: paint this opaque or more counts
PAST = 1      # figure units past the edge: the antialiased edge itself doesn't count
AREA = 20     # square figure units of paint past the edge before a picture counts as cut (a stray pixel doesn't)
MARGIN = 400  # figure units of canvas round each picture when it's painted again

WATCH = r"""()=>{
if(typeof ag_layer!=="function"||typeof AG_PEOPLE==="undefined")return false;
if(!window.__EDGES){const E=window.__EDGES={rec:[]},orig=ag_layer;
  // each kept picture: its painter and the picture made (its box); the caller names a picture that isn't a person's head or body
  ag_layer=function(paint,box){const L=orig.apply(this,arguments);let by="";
    try{by=(new Error().stack||"").split("\n").slice(2).map(l=>l.trim().replace(/^at /,"").split(" ")[0]).find(n=>n&&!/^(ag_layer|ag_fig|ag_figBody|Object\.|<anonymous>)/.test(n))||"";}catch(e){}
    E.rec.push({paint,L,by});return L;};}
// make every person's pictures again, so the painters are seen
for(const k of Object.keys(AG_PEOPLE))delete AG_PEOPLE[k];
window.__EDGES.rec.length=0;return true;}"""

DRAW = r"""(o)=>{const cv=document.createElement("canvas");cv.width=192;cv.height=108;const x=cv.getContext("2d");
for(let f=0;f/30<TL.total;f+=o.step){x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation="source-over";x.clearRect(0,0,192,108);
  try{renderFrame(x,0.1,f/30);}catch(e){}}
return Math.floor(TL.total*30/o.step);}"""

MEASURE = r"""(o)=>{const E=window.__EDGES;if(!E)return null;
const who=new Map();
for(const [k,F] of Object.entries(AG_PEOPLE)){const nm=F.P&&F.P.name||k;who.set(F.head,{who:nm,what:"head",body:false});
  for(const L of Object.values(F.bodies))who.set(L,{who:nm,what:"body",body:true});}
const M=o.margin,out=[];let n=0;
for(const r of E.rec){const b=r.L.box,W=b[2]-b[0]+2*M,H=b[3]-b[1]+2*M,id=who.get(r.L)||{who:r.by||"a picture",what:"",body:false};n++;
  const cv=document.createElement("canvas");cv.width=W;cv.height=H;const c=cv.getContext("2d");c.translate(M-b[0],M-b[1]);
  try{r.paint(c);}catch(e){out.push({who:id.who,what:id.what,box:b,err:String(e)});continue;}
  const d=c.getImageData(0,0,W,H).data,far={left:0,top:0,right:0,bottom:0};let area=0;
  for(let y=0;y<H;y++){const fy=y-M+b[1],dt=b[1]-fy,db=id.body?-1:fy-b[3];
    for(let x=0;x<W;x++){if(d[(y*W+x)*4+3]<o.ink)continue;const fx=x-M+b[0],dl=b[0]-fx,dr=fx-b[2];
      if(Math.max(dl,dt,dr,db)<=o.past)continue;area++;
      if(dl>far.left)far.left=dl;if(dt>far.top)far.top=dt;if(dr>far.right)far.right=dr;if(db>far.bottom)far.bottom=db;}}
  if(area>=o.area)out.push({who:id.who,what:id.what,box:b,far,area});}
return{pictures:n,people:Object.keys(AG_PEOPLE).length,cut:out};}"""


def watch(pg):
    """Run on a page with the film loaded (lang.render_page) before the checks that draw the film: each person's pictures are made again
    from then on, and seen. False when the film has no such people."""
    return pg.evaluate(WATCH)


def check(pg):
    """Returns (what it checked, a line for each picture that cuts off what is painted past its edge). Draws the film itself, ten frames
    a second, when nothing has made a picture since watch() (or watch() wasn't called)."""
    if not pg.evaluate("()=>!!(window.__EDGES&&window.__EDGES.rec.length)"):
        if not watch(pg):
            return "the film draws no one in the module's people's pictures", []
        pg.evaluate(DRAW, dict(step=3))
    r = pg.evaluate(MEASURE, dict(margin=MARGIN, ink=INK, past=PAST, area=AREA))
    lines = []
    for c in r['cut']:
        name = c['who'] + ("'s " + c['what'] if c['what'] else '')
        b = c['box']
        where = 'x %d to %d, y %d to %d of the figure' % (b[0], b[2], b[1], b[3])
        if c.get('err'):
            lines.append('%s: its painter fails when painted again (%s)' % (name, c['err']))
            continue
        past = ', '.join('%d past the %s' % (round(v), k) for k, v in sorted(c['far'].items(), key=lambda kv: -kv[1]) if v > PAST)
        lines.append('%s picture (%s): paint reaches %s, %d square units in all, and is cut off there in a straight line' % (name, where, past, c['area']))
    return 'looked at %d pictures of %d people' % (r['pictures'], r['people']), sorted(lines)


if __name__ == '__main__':
    from lang import render_page
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b, pg = render_page(p)
        msg, bad = check(pg)
        b.close()
    print(msg)
    for l in bad:
        print('  ' + l)
    if bad:
        sys.exit("people's pictures that cut off what is painted past their edge: %d" % len(bad))
    print("nothing painted for a person reaches past their picture's edge")
