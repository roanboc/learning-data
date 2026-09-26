import base64,json
from lang import *
S=ROOT/'src';D=DIST
FILES=['core.js','logos.js','style2.js','narration.js','vodur.js','ui3.js','scA.js','scB.js','scC.js','scD.js','engine3.js']
# another language swaps in its narration and voice timings, and adds its on-screen text ahead of the i18n hook that applies it
if not EN:FILES=['i18n/%s/strings.js'%LANG,'i18n.js']+[f if f not in('narration.js','vodur.js') else 'i18n/%s/%s'%(LANG,f) for f in FILES]
js='\n'.join((S/f).read_text() for f in FILES if (S/f).exists())
GF='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">'
(D/'render.html').write_text('<!doctype html><html><head><meta charset="utf-8">'+GF+'<style>body{margin:0;background:#000}</style><script>window.__RENDER__=true;</script></head><body><script>\n'+js+'\n</script></body></html>')
au=D/'soundtrack.mp3';tag='<audio id="snd" preload="auto" src="data:audio/mpeg;base64,%s"></audio>'%base64.b64encode(au.read_bytes()).decode() if au.exists() else ''
page=(S/'page.html').read_text()
if not EN and (PACK/'page.json').exists():
    for x,y in json.loads((PACK/'page.json').read_text()):assert x in page,'page.json: not found: '+x;page=page.replace(x,y)
(D/'film.html').write_text(page.replace('<!--FONTS-->',GF).replace('<!--AUDIO-->',tag).replace('/*JS*/',js))
print('built',D.relative_to(ROOT)/'render.html','and',D.relative_to(ROOT)/'film.html','(with soundtrack)' if tag else '(no soundtrack yet: run tools/audio.py, then build again)')
