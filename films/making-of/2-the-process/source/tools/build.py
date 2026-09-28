import base64,json,re
from lang import *
S=ROOT/'src';D=DIST;SS=SHARED/'src'
# The Inner Life of Data, as the site plays it in English, sealed in a function so its names don't meet this film's:
# ILD.renderFrame(ctx,S,t) draws any moment of it, and ILD.prepAssets() gets its pictures and logos ready.
ILD_FILES=['core.js','logos.js','style2.js','narration.js','vodur.js','breath.js','ui3.js','scA.js','scB.js','scC.js','scD.js']
eng=(SS/'engine3.js').read_text();eng=eng[:eng.index('if(window.__RENDER__)')]
ild='const ILD=(function(){\n'+'\n'.join((SS/f).read_text() for f in ILD_FILES)+'\n'+eng+'\nCAPS_ON=false;return{renderFrame,prepAssets,TL,SCENES};})();'
# shared components and engine from The Inner Life of Data, the first Making of film's components, then this film's narration, timings, pauses, components and scenes; the engine comes last,
# and waits for the embedded film's assets too (PREP_MORE), so a render never draws it half-loaded
# the pictures from the making of (style boards, a first-cut frame, a style frame, and the later films' posters), small copies in art/
ART='const ART_SRC={'+','.join('"%s":"data:image/jpeg;base64,%s"'%(p.stem,base64.b64encode(p.read_bytes()).decode()) for p in sorted((ROOT/'art').glob('*.jpg')))+'};'
FILES=[SS/'core.js',SS/'logos.js',SS/'style2.js',S/'narration.js',S/'vodur.js',S/'breath.js',SS/'ui3.js',F1/'frames.js',S/'process.js',S/'scenes.js']
engine=eng=(SS/'engine3.js').read_text();hook='async function prepAssets(){'
assert engine.count(hook)==1,'engine3.js changed: update the PREP_MORE hook in tools/build.py'
engine=engine.replace(hook,hook+'if(typeof PREP_MORE==="function")await PREP_MORE();')
js=ild+'\n'+ART+'\n'+'\n'.join(f.read_text() for f in FILES if f.exists())+'\n'+engine
GF='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">'
# the render page carries its own fonts, so renders need no network and look the same on every machine
FD=SHARED/'fonts'
FONTS='<style>'+re.sub(r'url\(([\w.-]+\.woff2)\)',lambda m:'url(data:font/woff2;base64,%s)'%base64.b64encode((FD/m.group(1)).read_bytes()).decode(),(FD/'fonts.css').read_text())+'</style>'
(D/'render.html').write_text('<!doctype html><html><head><meta charset="utf-8">'+FONTS+'<style>body{margin:0;background:#000}</style><script>window.__RENDER__=true;</script></head><body><script>\n'+js+'\n</script></body></html>')
au=D/'soundtrack.mp3';tag='<audio id="snd" preload="auto" src="data:audio/mpeg;base64,%s"></audio>'%base64.b64encode(au.read_bytes()).decode() if au.exists() else ''
page=(S/'page.html').read_text()
# the site plays both Making of films on one page, so each player is sealed in a function, its elements carry a prefix ("nqr-film", "nqr-play"…),
# and a page can rename its chapters in window.SCENE_NAMES["nqr"] before the script loads (the Spanish page does)
PFX='nqr'
site_js='(function(){\n'+js.replace('document.getElementById("','document.getElementById("'+PFX+'-')+'\n{const N=(window.SCENE_NAMES||{})["'+PFX+'"];if(N)SCENES.forEach(s=>{if(N[s.id])s.name=N[s.id];});}\n})();'
assert site_js.count('getElementById("'+PFX+'-')>=8,'the player finds its elements by id: update the prefix step in tools/build.py'
(D/'film.html').write_text(page.replace('<!--FONTS-->',GF).replace('<!--AUDIO-->',tag.replace('id="snd"','id="'+PFX+'-snd"')).replace('/*JS*/',site_js))
(D/'film.js').write_text(site_js)
print('built',D.relative_to(ROOT)/'render.html',',',D.relative_to(ROOT)/'film.js','and',D.relative_to(ROOT)/'film.html','(with soundtrack)' if tag else '(no soundtrack yet: run tools/audio.py, then build again)')
