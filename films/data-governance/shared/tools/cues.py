"""The words the pictures and the sounds wait for, and the ones that can't be found where they should be.

A chapter times a moment to a word of a line: wAt(sc, "line", "word") in a film's scenes, and W("chapter", "line", "word") in its
tools/score.py. Both look for the first place the word appears in what the voice reads (the line's "say", or its text). A word that
isn't there quietly falls back to the start of the line, and a word that is only the start of a longer one ("again" in "against")
lands on that word instead, so the moment comes early and nothing says so. build.py calls misplaced(); run this file on its own,
from a film's source folder, to list them: python ../../shared/tools/cues.py"""
import json, pathlib, re

SCENE = re.compile(r'\bscene\("(\w+)"')
IN_SCENE = re.compile(r'\bwAt\(sc,"(\w+)","([^"]+)"')
IN_SCORE = re.compile(r'\bW\(\'(\w+)\', \'(\w+)\', \'([^\']+)\'')


def _obj(path):
    s = pathlib.Path(path).read_text()
    return json.loads(s[s.index('{'):s.rindex('}') + 1])


def _check(narr, sid, lid, word):
    """why the word can't time a moment of this line, or None when it can"""
    ln = next((v for v in narr.get(sid, {}).get('vo', []) if v['id'] == lid), None)
    if ln is None:
        return 'no line %s/%s' % (sid, lid)
    s = ln.get('say') or ln['text']; i = s.find(word)
    if i < 0:
        return '%s/%s: "%s" isn\'t in what the voice reads' % (sid, lid, word)
    whole = re.search(r'(?<!\w)' + re.escape(word) + r'(?!\w)', s)
    if whole is None or whole.start() != i:
        return '%s/%s: "%s" first comes inside a longer word ("%s")' % (sid, lid, word, re.match(r'\w*', s[i:]).group(0))
    return None


def misplaced(narration, scenes=(), score=None):
    """every word a scene or the score waits for that isn't, whole, in its line"""
    narr, out = _obj(narration), []
    for f in scenes:
        js = pathlib.Path(f).read_text(); starts = [(m.start(), m.group(1)) for m in SCENE.finditer(js)]
        for m in IN_SCENE.finditer(js):
            sid = next((k for p, k in reversed(starts) if p < m.start()), None)
            why = _check(narr, sid, m.group(1), m.group(2))
            if why:
                out.append('%s: %s' % (pathlib.Path(f).name, why))
    if score and pathlib.Path(score).exists():
        for m in IN_SCORE.finditer(pathlib.Path(score).read_text()):
            why = _check(narr, *m.groups())
            if why:
                out.append('score.py: %s' % why)
    return out


if __name__ == '__main__':
    src = pathlib.Path.cwd() / 'src'
    bad = misplaced(src / 'narration.js', sorted(src.glob('*.js')), pathlib.Path.cwd() / 'tools' / 'score.py')
    print('\n'.join(bad) if bad else 'every cue word is in its line')
