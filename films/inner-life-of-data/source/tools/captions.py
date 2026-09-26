from lang import *
from playwright.sync_api import sync_playwright
# one caption per narration line, from the film's own timeline, written next to the player as captions.<lang>.srt and .vtt
with sync_playwright() as p:
    b=p.chromium.launch(args=["--allow-file-access-from-files"]);pg=b.new_page();pg.goto((DIST/'render.html').as_uri());pg.wait_for_function("window.__READY__===true",timeout=90000);caps=pg.evaluate("filmInfo().caps");b.close()
def ts(x,sep):ms=int(round(x*1000));return '%02d:%02d:%02d%s%03d'%(ms//3600000,ms//60000%60,ms//1000%60,sep,ms%1000)
out=ROOT.parent/('captions.%s'%LANG)
open(str(out)+'.srt','w').write('\n'.join('%d\n%s --> %s\n%s\n'%(i+1,ts(c['s'],','),ts(c['e']+0.1,','),c['text']) for i,c in enumerate(caps)))
open(str(out)+'.vtt','w').write('WEBVTT\n\n'+'\n'.join('%s --> %s\n%s\n'%(ts(c['s'],'.'),ts(c['e']+0.1,'.'),c['text']) for c in caps))
print('wrote',out.name+'.srt','and .vtt,',len(caps),'captions')
