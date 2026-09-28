"""Write the captions, one per narration line, from the film's own timeline: python tools/captions.py
They go to the film's captions/en.srt and captions/en.vtt."""
from lang import *
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b, pg = render_page(p)
    caps = pg.evaluate("filmInfo().caps")
    b.close()


def ts(x, sep):
    ms = int(round(x * 1000))
    return '%02d:%02d:%02d%s%03d' % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, sep, ms % 1000)


out = ROOT.parent / 'captions'
out.mkdir(exist_ok=True)
(out / 'en.srt').write_text('\n'.join('%d\n%s --> %s\n%s\n' % (i + 1, ts(c['s'], ','), ts(c['e'] + 0.1, ','), c['text']) for i, c in enumerate(caps)))
(out / 'en.vtt').write_text('WEBVTT\n\n' + '\n'.join('%s --> %s\n%s\n' % (ts(c['s'], '.'), ts(c['e'] + 0.1, '.'), c['text']) for c in caps))
print('wrote captions/en.srt and en.vtt,', len(caps), 'captions')
