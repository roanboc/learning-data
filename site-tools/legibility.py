"""How well each film reads on a phone: python site-tools/legibility.py [--json report.json]
Builds nothing: run each film's tools/build.py first (its dist/render.html is what's measured). For every film the release workflow
renders, and The map before the data's, it draws the film once a second and records the size every piece of text is drawn at, after
the camera's zoom and the phone layer (films/from-words-to-data/shared/src/phone.js), while clearly visible. A phone held sideways
shows the 1920-pixel frame about 850 pixels wide, so text under about 28 px in the frame is too small to read there (each film's
tools/legible.py checks one film, frame by frame, and the playbook has the rule). Text drawn as decoration is skipped."""
import argparse, json, pathlib, re, statistics
from playwright.sync_api import sync_playwright
ap = argparse.ArgumentParser(description=__doc__); ap.add_argument('--json'); A = ap.parse_args()
R = pathlib.Path(__file__).resolve().parents[1]
wf = (R / '.github' / 'workflows' / 'release.yml').read_text()
films = json.loads(wf[wf.index("cat > films.json <<'EOF'") + 24:wf.index("\n          EOF")])
films += [x for x in [{"name": "Day one", "dir": "films/enterprise-architecture/1-day-one/source", "player": "dist/film.js"},
          {"name": "Who it serves, and how it pays", "dir": "films/enterprise-architecture/2-who-it-serves/source", "player": "dist/film.js"}] if x["dir"] not in {f["dir"] for f in films}]
JS = """([EV])=>{const seen={};let sid="",deco=0;
  const c=document.createElement('canvas');c.width=1920;c.height=1080;const x=c.getContext('2d');
  const T0=window.T;window.T=function(ctx,s,X,Y,o){const d=deco;if(o&&o.deco)deco++;try{return T0(ctx,s,X,Y,o);}finally{deco=d;}};
  const P=CanvasRenderingContext2D.prototype,F0=P.fillText;
  const alphaOf=st=>{if(typeof st!=="string")return 1;const m=st.match(/rgba?\\(([^)]+)\\)/);if(m){const p=m[1].split(',');return p.length>3?parseFloat(p[3]):1;}return 1;};
  P.fillText=function(s,X,Y){const off=deco||(typeof PH_OFF!=="undefined"&&PH_OFF);if(this.canvas===c&&!off&&s!=null&&String(s).trim()){const m=this.getTransform(),k=Math.sqrt(Math.abs(m.a*m.d-m.b*m.c));
    const fm=this.font.match(/([\\d.]+)px/),sz=(fm?parseFloat(fm[1]):10)*k,a=this.globalAlpha*alphaOf(this.fillStyle),fx=m.a*X+m.c*Y+m.e,fy=m.b*X+m.d*Y+m.f;
    if(a>0.6&&fx>-40&&fx<1960&&fy>0&&fy<1110){const key=sid+"\\u0000"+s;if(!seen[key]||sz<seen[key])seen[key]=sz;}}return F0.apply(this,arguments);};
  for(let t=0;t<TL.total;t+=EV){sid=SCENES[sceneIndex(t)].id;renderFrame(x,1,t);}
  P.fillText=F0;window.T=T0;return {total:TL.total,sizes:Object.values(seen)};}"""
out = []
with sync_playwright() as p:
    b = p.chromium.launch(args=["--allow-file-access-from-files"])
    for f in films:
        page = R / f['dir'] / pathlib.Path(f['player']).parent / 'render.html'
        pg = b.new_page(viewport={"width": 1920, "height": 1080}); pg.goto(page.as_uri())
        pg.wait_for_function("window.__READY__===true", timeout=180000)
        r = pg.evaluate(JS, [1.0]); pg.close()
        z = r['sizes']; n = len(z); small = sum(1 for v in z if v < 26.6); tiny = sum(1 for v in z if v < 20)
        out.append(dict(name=f['name'], minutes=round(r['total'] / 60, 1), texts=n, small=small, tiny=tiny,
                        pct=round(100 * small / max(1, n)), median=round(statistics.median(z), 1) if z else 0))
        print('%-34s %4d texts  %3d%% under 28 px  %3d under 20 px  median %s' % (f['name'], n, out[-1]['pct'], tiny, out[-1]['median']), flush=True)
    b.close()
if A.json:
    json.dump(out, open(A.json, 'w'), indent=1)
