"""Build the film: python tools/build.py
Writes dist/render.html (for rendering and checking), dist/film.js (the player code the site loads) and dist/film.html
(a standalone player, with the soundtrack embedded once tools/audio.py has made it)."""
import base64, re
from lang import *

SS, S = SHARED / 'src', ROOT / 'src'
# The Inner Life of Data's engine and components; A Sharper Sketch's diagrams, tables and scene helpers; the films' people;
# Silent change's messages and dashboards; From words to data's components and Keeping it true's; In the weeds of data
# crafting's motion helpers; this series' people and components; then the film's own pictures and scenes. The engine comes
# last, then In the weeds' finishing pass for the video.
FILES = [SS / 'core.js', SS / 'logos.js', SS / 'style2.js', S / 'narration.js', S / 'vodur.js', S / 'breath.js', SS / 'ui3.js',
         SKETCH / 'sketch3.js', CHARS / 'people.js', EP1 / 'silent.js', WORDS / 'words.js', TRUE / 'true.js', WEEDS / 'weeds.js',
         EA / 'people.js', EA / 'ea.js'] + [S / f for f in META['src']] + [SS / 'engine3.js', EA / 'mobile.js', WEEDS / 'post.js']
js = '\n'.join(f.read_text() for f in FILES if f.exists())
GF = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">'
# the render page carries its own fonts, so renders need no network and look the same on every machine
FD = SHARED / 'fonts'
FONTS = '<style>' + re.sub(r'url\(([\w.-]+\.woff2)\)', lambda m: 'url(data:font/woff2;base64,%s)' % base64.b64encode((FD / m.group(1)).read_bytes()).decode(), (FD / 'fonts.css').read_text()) + '</style>'
(DIST / 'render.html').write_text('<!doctype html><html><head><meta charset="utf-8">' + FONTS + '<style>body{margin:0;background:#000}</style><script>window.__RENDER__=true;</script></head><body><script>\n' + js + '\n</script></body></html>')
au = DIST / 'soundtrack.mp3'
tag = '<audio id="snd" preload="auto" src="data:audio/mpeg;base64,%s"></audio>' % base64.b64encode(au.read_bytes()).decode() if au.exists() else ''
page = (EA / 'page.html').read_text()
for k in ('title', 'sub', 'howto'):
    page = page.replace('{{%s}}' % k.upper(), META[k])
(DIST / 'film.html').write_text(page.replace('<!--FONTS-->', GF).replace('<!--AUDIO-->', tag).replace('/*JS*/', js))
(DIST / 'film.js').write_text(js)
print('built dist/render.html, dist/film.js and dist/film.html', '(with soundtrack)' if tag else '(no soundtrack yet: run tools/audio.py, then build again)')
