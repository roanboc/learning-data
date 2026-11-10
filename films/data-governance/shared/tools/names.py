"""The names each file of the film declares at its top level, and the ones declared twice; and names written twice in one object.

Every file a film is made of is joined into one script, so a function declared in two files is silently replaced by the
second, and a const declared twice stops the film loading. build.py calls clashes(); run this file on its own to list
every top-level name: python names.py file.js [file.js ...]

An object that names a key twice keeps only the last value, with no error either. A chapter's moments are such an object: in
A product with an owner, `close` named two moments and the register's shot began at the other's time; in Tools are hands, `take`
named two, and a line on a board never came in on its word. build.py calls keys_twice() on every file the film is made of."""
import bisect, re, sys

WORD = re.compile(r'[A-Za-z_$][\w$]*')


def top_level(src):
    """The names declared at the top level of a script: function declarations, and const, let and var (each name in a list)."""
    names, depth, i, n, prev = [], 0, 0, len(src), ''
    decl = None  # inside a const/let/var at the top level: the next name at depth 0 after a comma is declared too
    while i < n:
        c = src[i]
        if src.startswith('//', i):
            i = src.find('\n', i); i = n if i < 0 else i; continue
        if src.startswith('/*', i):
            i = src.find('*/', i + 2); i = n if i < 0 else i + 2; continue
        if c in '"\'`':
            j = i + 1
            while j < n and src[j] != c:
                j += 2 if src[j] == '\\' else 1
            i = j + 1; prev = 'x'; continue
        if c == '/' and prev in '(,=:[!&|?{};+-*%<>~^' :
            j = i + 1; cls = False
            while j < n and (src[j] != '/' or cls):
                if src[j] == '\\': j += 1
                elif src[j] == '[': cls = True
                elif src[j] == ']': cls = False
                elif src[j] == '\n': break
                j += 1
            i = j + 1; prev = 'x'; continue
        if c in '{([':
            depth += 1
        elif c in '})]':
            depth -= 1
        elif c == ';' and depth == 0:
            decl = None
        elif c == ',' and depth == 0 and decl:
            m = WORD.match(src, i + 1 + len(src[i + 1:]) - len(src[i + 1:].lstrip()))
            if m: names.append((m.group(0), decl))
        m = WORD.match(src, i) if (c.isalpha() or c in '_$') and (i == 0 or not (src[i - 1].isalnum() or src[i - 1] in '_$.')) else None
        if m:
            w = m.group(0)
            if depth == 0 and w == 'function':
                f = re.compile(r'\s*\*?\s*([A-Za-z_$][\w$]*)').match(src, m.end())
                if f: names.append((f.group(1), 'function'))
            elif depth == 0 and w in ('const', 'let', 'var'):
                f = re.compile(r'\s+([A-Za-z_$][\w$]*)').match(src, m.end())
                if f: names.append((f.group(1), w)); decl = w
            i = m.end(); prev = 'x'; continue
        if not c.isspace():
            prev = c
        i += 1
    return names


def clashes(files):
    """[(name, [file, ...])] for every name declared at the top level of more than one of the files (or twice in one)."""
    where = {}
    for f in files:
        for name, kind in top_level(f.read_text()):
            where.setdefault(name, []).append(f.name)
    return [(k, v) for k, v in where.items() if len(v) > 1]


# ---- names written twice in one object
PUNCT = ['>>>=', '...', '===', '!==', '**=', '<<=', '>>=', '>>>', '&&=', '||=', '??=', '=>', '==', '!=', '<=', '>=', '&&', '||', '??',
         '?.', '++', '--', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '**', '<<', '>>']
NUM = re.compile(r'(?:0[xX][\da-fA-F_]+|\d[\d_]*(?:\.[\d_]*)?(?:[eE][+-]?\d+)?|\.\d[\d_]*(?:[eE][+-]?\d+)?)n?')
# after these, a / starts a regular expression; after anything else it divides
REGEX_AFTER = set('( , = : [ ! & | ? { } ; + - * % < > ~ ^'.split()) | (set(PUNCT) - {'++', '--'}) | {
    'return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'new', 'delete', 'void', 'throw', 'instanceof', 'yield', 'await', None}
# after these, a { opens an object; after anything else (a ), =>, a keyword, a ; or a }) it opens a block
OBJECT_AFTER = {'(', ',', '=', ':', '[', '?', '||', '&&', '??', 'return', '...', '+', '!', '&&=', '||=', '??='}


def tokens(s, i=0):
    """(kind, text, offset) for each token of JavaScript source s from offset i: kind is id, str, num, re, tpl or p (punctuation).
    A template literal is one token, its ${...} parts included."""
    n, prev = len(s), None
    while i < n:
        c = s[i]
        if c.isspace() or c == '﻿':
            i += 1; continue
        if s.startswith('//', i):
            j = s.find('\n', i); i = n if j < 0 else j; continue
        if s.startswith('/*', i):
            j = s.find('*/', i + 2); i = n if j < 0 else j + 2; continue
        if c in '"\'':
            j = i + 1
            while j < n and s[j] != c:
                j += 2 if s[j] == '\\' else 1
            yield 'str', s[i + 1:j], i; prev = 'str'; i = j + 1; continue
        if c == '`':
            j = _template_end(s, i); yield 'tpl', s[i:j], i; prev = 'tpl'; i = j; continue
        if c == '/' and prev in REGEX_AFTER:
            j, cls = i + 1, False
            while j < n and (cls or s[j] != '/') and s[j] != '\n':
                if s[j] == '\\': j += 1
                elif s[j] == '[': cls = True
                elif s[j] == ']': cls = False
                j += 1
            j += 1
            while j < n and s[j].isalnum(): j += 1
            yield 're', s[i:j], i; prev = 're'; i = j; continue
        m = WORD.match(s, i)
        if m:
            w = m.group(); yield 'id', w, i; prev = w if w in REGEX_AFTER else 'id'; i = m.end(); continue
        m = NUM.match(s, i)
        if m and m.end() > i:
            yield 'num', m.group(), i; prev = 'num'; i = m.end(); continue
        p = next((q for q in PUNCT if s.startswith(q, i)), c)
        yield 'p', p, i; prev = p; i += len(p)


def _template_end(s, i):
    """the offset just past the template literal that starts with the backquote at s[i]"""
    j, n = i + 1, len(s)
    while j < n and s[j] != '`':
        if s[j] == '\\':
            j += 2; continue
        if s.startswith('${', j):
            depth, k = 1, n
            for kind, t, at in tokens(s, j + 2):
                if kind == 'p' and t == '{': depth += 1
                elif kind == 'p' and t == '}':
                    depth -= 1
                    if not depth:
                        k = at + 1; break
            j = k; continue
        j += 1
    return j + 1


def keys_in_twice(src):
    """[(line, key, first line)] for each key an object literal in src names a second time"""
    toks, out, stack, prev = list(tokens(src)), [], [], None
    starts = [m.end() for m in re.finditer('\n', src)]
    line = lambda at: bisect.bisect_right(starts, at) + 1
    for i, (kind, t, at) in enumerate(toks):
        if kind == 'p' and t in ('{', '(', '['):
            obj = t == '{' and prev in OBJECT_AFTER
            stack.append([obj, {}, obj])  # an object?, its keys and their lines, and whether a key comes next
        elif kind == 'p' and t in ('}', ')', ']'):
            if stack:
                stack.pop()
        elif stack and stack[-1][0]:
            top = stack[-1]
            if kind == 'p' and t == ',':
                top[2] = True
            elif top[2]:
                top[2] = False
                # key: value, a method key(...), or a shorthand key; get x() and set x() are passed over, as they share a name on purpose
                if kind in ('id', 'str', 'num') and i + 1 < len(toks) and toks[i + 1][1] in (':', '(', ',', '}'):
                    if t in top[1]:
                        out.append((line(at), t, top[1][t]))
                    else:
                        top[1][t] = line(at)
        prev = t if kind == 'p' or (kind == 'id' and t in REGEX_AFTER) else kind
    return out


def keys_twice(files):
    """a line for each key named twice in one object, in any of the files"""
    return ['%s, line %d: "%s" again (first on line %d)' % (f.name, ln, k, first) for f in files for ln, k, first in keys_in_twice(f.read_text())]


if __name__ == '__main__':
    import pathlib
    fs = [pathlib.Path(a) for a in sys.argv[1:]]
    for f in fs:
        print(f.name, ' '.join(sorted({n for n, _ in top_level(f.read_text())})))
    for k, v in clashes(fs):
        print('declared twice:', k, v)
    for l in keys_twice(fs):
        print('named twice in one object:', l)
