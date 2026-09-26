import base64,json,re
from lang import *
S=ROOT/'src';D=DIST;SS=SHARED/'src'
# shared components and engine from the first film, then this film's narration, timings, pauses and scenes; the engine comes last
FILES=[SS/'core.js',SS/'logos.js',SS/'style2.js',S/'narration.js',S/'vodur.js',S/'breath.js',SS/'ui3.js',S/'sketch3.js',S/'scenes.js',SS/'engine3.js']
js='\n'.join(f.read_text() for f in FILES if f.exists())
GF='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">'
# the render page carries its own fonts, so renders need no network and look the same on every machine
FD=SHARED/'fonts'
FONTS='<style>'+re.sub(r'url\(([\w.-]+\.woff2)\)',lambda m:'url(data:font/woff2;base64,%s)'%base64.b64encode((FD/m.group(1)).read_bytes()).decode(),(FD/'fonts.css').read_text())+'</style>'
(D/'render.html').write_text('<!doctype html><html><head><meta charset="utf-8">'+FONTS+'<style>body{margin:0;background:#000}</style><script>window.__RENDER__=true;</script></head><body><script>\n'+js+'\n</script></body></html>')
au=D/'soundtrack.mp3';tag='<audio id="snd" preload="auto" src="data:audio/mpeg;base64,%s"></audio>'%base64.b64encode(au.read_bytes()).decode() if au.exists() else ''
page=(S/'page.html').read_text()
(D/'film.html').write_text(page.replace('<!--FONTS-->',GF).replace('<!--AUDIO-->',tag).replace('/*JS*/',js))
(D/'film.js').write_text(js)
print('built',D.relative_to(ROOT)/'render.html',',',D.relative_to(ROOT)/'film.js','and',D.relative_to(ROOT)/'film.html','(with soundtrack)' if tag else '(no soundtrack yet: run tools/audio.py, then build again)')
