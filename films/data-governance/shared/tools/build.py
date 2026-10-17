"""Build the film: python tools/build.py
Writes dist/render.html (for rendering and checking), dist/film.js (the player code the site loads) and dist/film.html
(a standalone player, with the soundtrack embedded once tools/audio.py has made it)."""
import base64, re
from lang import *

SS, S = SHARED / 'src', ROOT / 'src'
# The Inner Life of Data's engine and helpers; A Sharper Sketch's scene helpers; the films' people; From words to data's
# people and helpers; In the weeds of data crafting's people and motion helpers; the master and reference data series' watercolour
# and its people in pencil and wash (bundled as they are, never changed for this series); this series' people and rooms; then the
# film's own pictures and scenes. The engine comes last, then this series' finishing pass.
FILES = [SS / 'core.js', SS / 'logos.js', SS / 'style2.js', S / 'narration.js', S / 'vodur.js', S / 'breath.js', SS / 'ui3.js',
         SKETCH / 'sketch3.js', CHARS / 'people.js', WORDS / 'words.js', WEEDS / 'weeds.js', WEEDS / 'people.js',
         MR / 'wash.js', MR / 'people.js', GOV / 'people.js', GOV / 'rooms.js'] + [S / f for f in META['src']] + [SS / 'engine3.js', GOV / 'finish.js']
# every file is joined into one script, so a name declared at the top level of two files would silently replace the first
# A few are replaced on purpose, by exactly one later file each: master data's people.js draws the character sheet's people in
# pencil and wash, and this series' finish.js prepares the watercolour before the film starts
from names import clashes
MEANT = {'person': 2, 'outlined': 2, 'litFill': 2, 'seam': 2, 'limb': 2, 'prepAssets': 2}
twice = [(k, v) for k, v in clashes([f for f in FILES if f.exists()]) if MEANT.get(k) != len(v)]
if twice:
    raise SystemExit('These names are declared at the top level of two files; rename the film\'s own:\n' + '\n'.join('  %s: %s' % (k, ', '.join(v)) for k, v in twice))
# a moment timed to a word that isn't in its line, or that only starts a longer word, comes early without a sound
from cues import misplaced
bad = misplaced(NARR, [S / f for f in META['src']], ROOT / 'tools' / 'score.py')
if bad:
    raise SystemExit('These cue words aren\'t, whole, in the line they wait for:\n' + '\n'.join('  ' + b for b in bad))
# a caption of more than about 140 characters wraps to three lines in the player, and its box covers the picture above the
# caption band: split the line in two where the voice can pause (in narration.js, and in each language's captions.js)
long = [(len(v['text']), sid + '/' + v['id']) for sid, sc in load_obj(NARR).items() for v in sc['vo'] if len(v['text']) > 140]
for f in sorted((S / 'i18n').glob('*/captions.js')):
    s = f.read_text()
    long += [(len(c), '%s "%s…"' % (f.parent.name, c[:40])) for c in json.loads(s[s.index('||{},') + 5:s.rindex('}') + 1]).values() if len(c) > 140]
if long:
    raise SystemExit('These captions would run to three lines in the player; split their lines:\n' + '\n'.join('  %d characters: %s' % x for x in long))
js = '\n'.join(f.read_text() for f in FILES if f.exists())
GF = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">'
# the render page carries its own fonts, so renders need no network and look the same on every machine
FD = SHARED / 'fonts'
FONTS = '<style>' + re.sub(r'url\(([\w.-]+\.woff2)\)', lambda m: 'url(data:font/woff2;base64,%s)' % base64.b64encode((FD / m.group(1)).read_bytes()).decode(), (FD / 'fonts.css').read_text()) + '</style>'
(DIST / 'render.html').write_text('<!doctype html><html><head><meta charset="utf-8">' + FONTS + '<style>body{margin:0;background:#000}</style><script>window.__RENDER__=true;</script></head><body><script>\n' + js + '\n</script></body></html>')
au = DIST / 'soundtrack.mp3'
tag = '<audio id="snd" preload="auto" src="data:audio/mpeg;base64,%s"></audio>' % base64.b64encode(au.read_bytes()).decode() if au.exists() else ''
page = (GOV / 'page.html').read_text()
for k in ('title', 'sub', 'howto'):
    page = page.replace('{{%s}}' % k.upper(), META[k])
(DIST / 'film.html').write_text(page.replace('<!--FONTS-->', GF).replace('<!--AUDIO-->', tag).replace('/*JS*/', js))
(DIST / 'film.js').write_text(js)
print('built dist/render.html, dist/film.js and dist/film.html', '(with soundtrack)' if tag else '(no soundtrack yet: run tools/audio.py, then build again)')
