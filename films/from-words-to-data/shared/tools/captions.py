"""Write the captions, one per narration line, from the film's own timeline: python tools/captions.py
They go to the film's captions/en.srt and captions/en.vtt.

Spanish captions: FILM_LANG=es python tools/captions.py writes captions/es.srt and es.vtt from src/i18n/es/captions.js,
which maps each English line, exactly as in src/narration.js, to its caption. The picture, the voice and the timings stay
English, so the captions follow the English timeline. It stops if a line has no caption, or a caption matches no line."""
from lang import *
from playwright.sync_api import sync_playwright

CAPS = PACK / 'captions.js'
with sync_playwright() as p:
    b, pg = render_page(p, None if EN else CAPS)
    caps = pg.evaluate("filmInfo().caps")
    if not EN:
        miss, stale = pg.evaluate("()=>{const en=SCENES.flatMap(s=>s.vo.map(c=>c.text));return[en.filter(t=>!(t in CAPTIONS)),Object.keys(CAPTIONS).filter(t=>!en.includes(t))];}")
    b.close()
if not EN and (miss or stale):
    for t in miss:
        print('  no caption for:', t)
    for t in stale:
        print('  no longer in the narration:', t)
    raise SystemExit('%s: %d lines have no caption and %d captions match no line; update it to the narration, then run this again' % (CAPS.relative_to(ROOT), len(miss), len(stale)))


def ts(x, sep):
    ms = int(round(x * 1000))
    return '%02d:%02d:%02d%s%03d' % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, sep, ms % 1000)


out = ROOT.parent / 'captions'
out.mkdir(exist_ok=True)
(out / (LANG + '.srt')).write_text('\n'.join('%d\n%s --> %s\n%s\n' % (i + 1, ts(c['s'], ','), ts(c['e'] + 0.1, ','), c['text']) for i, c in enumerate(caps)))
(out / (LANG + '.vtt')).write_text('WEBVTT\n\n' + '\n'.join('%s --> %s\n%s\n' % (ts(c['s'], '.'), ts(c['e'] + 0.1, '.'), c['text']) for c in caps))
print('wrote captions/%s.srt and %s.vtt,' % (LANG, LANG), len(caps), 'captions')
