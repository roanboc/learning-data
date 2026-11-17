"""What a film's hands write, and when, for its score: the Python side of PK.written (src/concepts.js).

A board's rows and a notebook's lines are written as the voice speaks, and then paced (PK.pace): a row waits until whoever writes
has walked to it, and a stroke until the hand has crossed from the one before. So the moment a row is written isn't a word's time
plus an offset, and a score that wants a marker's or a pen's sound where the picture writes asks the film itself. In tools/score.py:

    import pens
    PEN = pens.written({'A': ('owns', 'carmen', 'oo_boardA'), 'N1': ('owns', None, 'oo_note1')})
    for k in PEN['N1']:
        ...   # k['s'] (the row's words, or the mark's kind), k['mark'], k['t0'], k['t1'] (the film's seconds), k['x'], k['y'] (px)

Each entry names a board or a page as the film's chapter draws it: the chapter's id, who writes at the board (None for a page of
notes), and the name of the film's own function that gives the rows from (sc, w), where sc is the chapter and w(line, word, offset)
the moment a word is said. The strokes come back in the order the pen draws them, with the film's times, not the chapter's.
Run tools/build.py first: the times are read from dist/render.html, once for each set of names in one run."""
import json
from lang import *
from playwright.sync_api import sync_playwright

_JS = """(defs)=>{const c=document.createElement('canvas');c.width=1920;c.height=1080;const x=c.getContext('2d'),out={},T=filmInfo().scenes;
  for(const name of Object.keys(defs)){const [sid,who,fn]=defs[name],sc=SCENES.find(s=>s.id===sid),t0=T.find(s=>s.id===sid).start,w=(id,word,off)=>wAt(sc,id,word,off);
    out[name]=PK.written(x,who,PK.pace(x,who,(0,eval)(fn)(sc,w))).map(k=>Object.assign(k,{t0:k.t0+t0,t1:k.t1+t0}));}
  return out;}"""
_SEEN = {}


def written(defs):
    """every stroke of the boards and pages in defs ({name: (chapter, who or None, the film's function)}), as the film writes them"""
    key = json.dumps(defs, sort_keys=True)
    if key not in _SEEN:
        with sync_playwright() as p:
            b, pg = render_page(p)
            _SEEN[key] = pg.evaluate(_JS, defs)
            b.close()
    return _SEEN[key]
