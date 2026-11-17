"""The words the pictures and the sounds wait for, and the ones that can't be found where they should be.

A chapter times a moment to a word of a line: wAt(sc, "line", "word") in a film's scenes, and W("chapter", "line", "word") in its
tools/score.py. Both look for the first place the word appears in what the voice reads (the line's "say", or its text). A word that
isn't there quietly falls back to the start of the line, and a word that is only the start of a longer one ("again" in "against")
lands on that word instead, so the moment comes early and nothing says so. build.py calls misplaced(); run this file on its own,
from a film's source folder, to list them: python ../../shared/tools/cues.py

Most films give the helper a short name in each chapter, const w=(id,word,off)=>wAt(sc,id,word,off), and write w("line", "word").
Until 12 November 2026 only wAt written out in full was read, so about ten thousand of those words were never looked at, and
twelve moments in seven films came early or waited for a word their line doesn't say (A path for every provider timed five
to figures, "16", "2,400", that the voice reads as words). What is read now, in a film's scenes:
  the helper       wAt(sc, "line", "word"), and Keeping it true's kt_w(sc, "line", "word"), the same helper under the name the
                   films drawn with The map before the data's components use
  a short name     NAME = (a, b, c) => wAt(sc, a, b, c), or the same over kt_w, then NAME("line", "word"), wherever NAME still
                   means that helper: a parameter or another declaration of the same name hides it, as it does when the film runs
  the chapter      the scene whose callback was given that sc. In a function outside the scenes, which is handed its sc by
                   whoever calls it, any chapter that has the line will do, and the word has to fail in all of them
Not read: a line or a word that isn't written out where the helper is called, such as a word taken from a list or a table's row.
site-tools/check_site.py holds every film to this file, so a film whose own build doesn't call it is read as well."""
import bisect, functools, json, pathlib, re
from names import tokens

SCENE = re.compile(r'\bscene\("(\w+)"')
IN_SCENE = re.compile(r'\bwAt\(sc,"(\w+)","([^"]+)"')
IN_SCORE = re.compile(r'\bW\(\'(\w+)\', \'(\w+)\', \'([^\']+)\'')
HELPERS = ('wAt', 'kt_w')
OPEN = {'{': '}', '(': ')', '[': ']'}
# a name before ( ... ) { that doesn't make the ( ... ) a list of parameters
NOT_A_FUNCTION = {'if', 'for', 'while', 'switch', 'with'}


def _obj(path):
    s = pathlib.Path(path).read_text()
    return json.loads(s[s.index('{'):s.rindex('}') + 1])


def _said(ln, word):
    """why the word can't time a moment of this line, or None when it can"""
    s = ln.get('say') or ln['text']; i = s.find(word)
    if i < 0:
        return '"%s" isn\'t in what the voice reads' % word
    whole = re.search(r'(?<!\w)' + re.escape(word) + r'(?!\w)', s)
    if whole is None or whole.start() != i:
        return '"%s" first comes inside a longer word ("%s")' % (word, re.search(r'\w*' + re.escape(word) + r'\w*', s).group(0))
    return None


def _check(narr, sid, lid, word):
    """why the word can't time a moment of this line, or None when it can; sid None: the chapter isn't known, so any that has the line"""
    if sid is None:
        found = [(k, v) for k, sc in narr.items() for v in sc.get('vo', []) if v['id'] == lid]
        if not found:
            return 'no line "%s" in any chapter' % lid
        whys = ['%s/%s: %s' % (k, lid, _said(v, word)) for k, v in found if _said(v, word)]
        return whys[0] if len(whys) == len(found) else None
    ln = next((v for v in narr.get(sid, {}).get('vo', []) if v['id'] == lid), None)
    if ln is None:
        return 'no line %s/%s' % (sid, lid)
    why = _said(ln, word)
    return why and '%s/%s: %s' % (sid, lid, why)


def _text(raw):
    """a string as the film reads it, from how it is written between its quotes"""
    try:
        return json.loads('"' + raw.replace("\\'", "'") + '"')
    except ValueError:
        return raw


class _Script:
    """A scene file's tokens, which bracket closes which, and what each name means where."""

    def __init__(self, src):
        self.T = T = list(tokens(src)); n = len(T)
        self.pair, self.around, self.ok = {}, [-1] * n, True
        open_ = []
        for i, (kind, t, _) in enumerate(T):
            if kind == 'p' and t in ')]}':
                if not open_ or OPEN[T[open_[-1]][1]] != t:
                    self.ok = False; break
                o = open_.pop(); self.pair[o] = i; self.pair[i] = o
            self.around[i] = open_[-1] if open_ else -1
            if kind == 'p' and t in OPEN:
                open_.append(i)
        self.ok = self.ok and not open_
        self.lines = [m.end() for m in re.finditer('\n', src)]

    def p(self, i, t):
        return 0 <= i < len(self.T) and self.T[i][0] == 'p' and self.T[i][1] == t

    def name(self, i, t=None):
        return 0 <= i < len(self.T) and self.T[i][0] == 'id' and (t is None or self.T[i][1] == t)

    def line(self, i):
        return bisect.bisect_right(self.lines, self.T[i][2]) + 1

    def block_end(self, i):
        """the } that closes the block around token i, or the end of the file"""
        o = self.around[i]
        while o >= 0 and self.T[o][1] != '{':
            o = self.around[o]
        return self.pair[o] if o >= 0 else len(self.T)

    def value_end(self, i):
        """where the expression that starts at token i ends: the next , or ; beside it, or the bracket that closes around it"""
        while i < len(self.T):
            kind, t, _ = self.T[i]
            if kind == 'p' and t in OPEN:
                i = self.pair[i]
            elif kind == 'p' and t in (',', ';', ')', ']', '}'):
                break
            i += 1
        return i

    def args(self, i):
        """the tokens between the ( at i and its ), as (kind, text)"""
        return [(k, t) for k, t, _ in self.T[i + 1:self.pair[i]]]

    def short(self, i):
        """the helper a short name is: NAME = (a, b[, c]) => HELPER(sc, a, b[, c]) with NAME at token i; None for anything else"""
        if not (self.p(i + 1, '=') and self.p(i + 2, '(')):
            return None
        c = self.pair[i + 2]; params = self.args(i + 2)
        names = [t for k, t in params[::2]]
        if len(names) not in (2, 3) or any(k != 'id' for k, _ in params[::2]) or any(x != ('p', ',') for x in params[1::2]):
            return None
        if not (self.p(c + 1, '=>') and self.name(c + 2) and self.T[c + 2][1] in HELPERS and self.p(c + 3, '(')):
            return None
        same = [('id', 'sc')] + [x for nm in names for x in (('p', ','), ('id', nm))]
        after = self.pair[c + 3] + 1
        whole = after >= len(self.T) or (self.T[after][0] == 'p' and self.T[after][1] in (',', ';', ')', ']', '}'))
        return self.T[c + 2][1] if self.args(c + 3) == same and whole else None


def _meanings(S, wanted):
    """{name: [(from token, to token, what)]} for each name in wanted: where the script gives it a meaning, and what kind:
    ('short', helper) a short name for the helper, ('scene', id) a scene callback's parameter, None anything else.
    The meaning a token sees is the one that starts last among those around it."""
    T, n, out = S.T, len(S.T), {k: [] for k in wanted}

    def give(names, a, b, what=None):
        for nm in names:
            if nm in out:
                out[nm].append((a, b, what))

    def inside(o):
        return {T[j][1] for j in range(o + 1, S.pair[o]) if T[j][0] == 'id'}

    def chapter(o):
        """the chapter whose scene( ... ) call takes the function with the parameters at o: scene("id", (ctx,S,t,sc) => ...)"""
        j = o - 1
        if S.name(j) and not S.name(j, 'function'):
            j -= 1  # a named function expression
        if S.name(j, 'function'):
            j -= 1
        return T[j - 1][1] if S.p(j, ',') and T[j - 1][0] == 'str' and S.p(j - 2, '(') and S.name(j - 3, 'scene') else None

    for i in range(n):
        kind, t, _ = T[i]
        if kind == 'p' and t == '=>':
            body = (i + 1, S.pair[i + 1]) if S.p(i + 1, '{') else (i + 1, S.value_end(i + 1))
            if S.p(i - 1, ')'):
                o = S.pair[i - 1]; sid = chapter(o)
                give(inside(o), *body, what=sid and ('scene', sid))
            elif S.name(i - 1):
                give([T[i - 1][1]], *body)
        elif kind == 'p' and t == '(' and S.p(S.pair[i] + 1, '{') and S.name(i - 1) and T[i - 1][1] not in NOT_A_FUNCTION:
            # function (a, b) { }, function name(a, b) { }, a method name(a, b) { } and catch (e) { }
            sid = chapter(i)
            give(inside(i), S.pair[i] + 1, S.pair[S.pair[i] + 1], what=sid and ('scene', sid))
            if S.name(i - 2, 'function'):
                give([T[i - 1][1]], S.around[i - 2] + 1, S.block_end(i - 2))
        elif kind == 'id' and t in ('const', 'let', 'var'):
            o = S.around[i]
            if o >= 0 and T[o][1] == '(' and S.name(o - 1, 'for'):  # for (const x of xs) ... : to the end of what it repeats
                c = S.pair[o]; end = S.pair[c + 1] if S.p(c + 1, '{') else S.value_end(c + 1)
            else:
                end = S.block_end(i)
            j = i + 1
            while j < n:
                if S.name(j):
                    helper = S.short(j) if T[j][1] in out else None
                    give([T[j][1]], j, end, what=helper and ('short', helper)); j += 1
                elif S.p(j, '[') or S.p(j, '{'):
                    give(inside(j), j, end); j = S.pair[j] + 1
                else:
                    break
                j = S.value_end(j)
                if not S.p(j, ','):
                    break
                j += 1
        elif kind == 'id' and t in out and S.p(i + 1, '=') and not S.p(i - 1, '.') and not any(a == i for a, _, _ in out[t]):
            helper = S.short(i)  # given a value later on, with no const: the helper again, or something this can't follow
            give([t], i, S.block_end(i), what=helper and ('short', helper))
    return out


def _seen(meanings, name, i):
    """(where it starts, what) for the meaning of name that token i sees, or None when the script gives it none there"""
    best = None
    for a, b, what in meanings.get(name, ()):
        if a <= i < b and (best is None or a >= best[0]):
            best = (a, what)
    return best


@functools.lru_cache(maxsize=None)  # a series' shared files are read once, however many films bundle them
def moments(src):
    """[(line number, chapter or None, line id, word)] for every moment the script times to a word that is written out.
    None for the chapter: the helper is given an sc that isn't a scene callback's own. A script whose brackets the tokens can't
    pair is read the old way: the helper written out in full, in the chapter of the scene( before it."""
    if not any(h in src for h in HELPERS):
        return []
    S = _Script(src); T = S.T
    if not S.ok:
        starts = [(m.start(), m.group(1)) for m in SCENE.finditer(src)]
        line = lambda at: src.count('\n', 0, at) + 1
        return [(line(m.start()), next((k for p, k in reversed(starts) if p < m.start()), None), m.group(1), m.group(2)) for m in IN_SCENE.finditer(src)]
    short = {T[i][1] for i in range(len(T)) if S.name(i) and S.short(i)}
    M = _meanings(S, short | {'sc'})

    def chapter(i):
        """the chapter whose sc token i sees: a scene callback's own parameter, or None"""
        seen = _seen(M, 'sc', i)
        return seen[1][1] if seen and seen[1] and seen[1][0] == 'scene' else None

    out = []
    for i in range(len(T)):
        if not (S.name(i) and S.p(i + 1, '(')) or S.p(i - 1, '.') or S.p(i - 1, '?.') or S.name(i - 1, 'function'):
            continue
        t, a, at = T[i][1], S.args(i + 1), i
        if t in HELPERS:
            a = a[2:] if a[:2] == [('id', 'sc'), ('p', ',')] else []
        elif t in short:
            seen = _seen(M, t, i)
            if not (seen and seen[1] and seen[1][0] == 'short'):
                continue  # here the name means something else
            at = seen[0]  # the short name keeps the sc it was written with
        else:
            continue
        if len(a) >= 3 and a[0][0] == 'str' and a[1] == ('p', ',') and a[2][0] == 'str' and (len(a) == 3 or a[3] == ('p', ',')):
            out.append((S.line(i), chapter(at), _text(a[0][1]), _text(a[2][1])))
    return out


def misplaced(narration, scenes=(), score=None):
    """every word a scene or the score waits for that isn't, whole, in its line"""
    narr, out, own = _obj(narration), [], pathlib.Path(narration).resolve().parent
    for f in scenes:
        f = pathlib.Path(f)
        for line, sid, lid, word in moments(f.read_text()):
            why = _check(narr, sid, lid, word)
            # a file shared with other films may time a line this film doesn't have, in a function this film never calls
            if why and (sid is not None or f.resolve().parent == own or not why.startswith('no line')):
                out.append('%s, line %d: %s' % (f.name, line, why))
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
