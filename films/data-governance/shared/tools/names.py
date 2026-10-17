"""The names each file of the film declares at its top level, and the ones declared twice.

Every file a film is made of is joined into one script, so a function declared in two files is silently replaced by the
second, and a const declared twice stops the film loading. build.py calls clashes(); run this file on its own to list
every top-level name: python names.py file.js [file.js ...]"""
import re, sys

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


if __name__ == '__main__':
    import pathlib
    fs = [pathlib.Path(a) for a in sys.argv[1:]]
    for f in fs:
        print(f.name, ' '.join(sorted({n for n, _ in top_level(f.read_text())})))
    for k, v in clashes(fs):
        print('declared twice:', k, v)
