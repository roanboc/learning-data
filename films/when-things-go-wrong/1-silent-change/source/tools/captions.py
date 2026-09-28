from lang import *
from playwright.sync_api import sync_playwright
# one caption per narration line, from the film's own timeline, written to the film's captions/<lang>.srt and .vtt.
# A language with only captions (src/i18n/<lang>/captions.js) keeps the English film, so its captions follow the English timeline, each line swapped for its caption.
CAPS=PACK/'captions.js';ONLY=not EN and CAPS.exists()
with sync_playwright() as p:
    b=p.chromium.launch(args=["--allow-file-access-from-files"]);pg=b.new_page()
    if ONLY:pg.add_init_script(path=str(CAPS))
    pg.goto(((ROOT/'dist' if ONLY else DIST)/'render.html').as_uri());pg.wait_for_function("window.__READY__===true",timeout=90000);caps=pg.evaluate("filmInfo().caps")
    if ONLY:miss,stale=pg.evaluate("()=>{const en=SCENES.flatMap(s=>s.vo.map(c=>c.text));return[en.filter(t=>!(t in CAPTIONS)),Object.keys(CAPTIONS).filter(t=>!en.includes(t))];}")
    b.close()
if ONLY and (miss or stale):
    for t in miss:print('  no caption for:',t)
    for t in stale:print('  no longer in the narration:',t)
    raise SystemExit('%s: %d lines have no caption and %d captions match no line; update it to the narration, then run this again'%(CAPS.relative_to(ROOT),len(miss),len(stale)))
def ts(x,sep):ms=int(round(x*1000));return '%02d:%02d:%02d%s%03d'%(ms//3600000,ms//60000%60,ms//1000%60,sep,ms%1000)
out=ROOT.parent/'captions'/LANG
open(str(out)+'.srt','w').write('\n'.join('%d\n%s --> %s\n%s\n'%(i+1,ts(c['s'],','),ts(c['e']+0.1,','),c['text']) for i,c in enumerate(caps)))
open(str(out)+'.vtt','w').write('WEBVTT\n\n'+'\n'.join('%s --> %s\n%s\n'%(ts(c['s'],'.'),ts(c['e']+0.1,'.'),c['text']) for c in caps))
print('wrote',out.relative_to(ROOT.parent),'.srt and .vtt,',len(caps),'captions')
