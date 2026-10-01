# Who owns what: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). The series plan gives this film B-flat major, a low harmonium (a reed organ) for the series' mark,
# 1-4-5-8, and a reed-organ pad for the bed; Adelaide in 1858 has the same reed organ, alone.
# The series' rules:
#  - Nothing loops. No pulse, walking bass, repeated figure or random notes: the bed is sustained chords that change with
#    the chapters.
#  - Every sound is something appearing on screen, at the moment it appears. Each effect below uses the same timing as the
#    picture in src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
#  - Everything stays low and soft, filtered below about 2.5 kHz: a quill's soft scratch, a register page turning, the register
#    closing (a thud), soft knocks for references drawn and cards arriving, a muted double knock for a refused reference,
#    a soft wooden latch for a contract and a version tag, muffled keys for code, paper, felt notes, a low stamp.
#    No chimes, pings or shimmers.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def END(sid, lid, off=0):
    """the end of a line, as the film's sc.ends has it"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off

# ---- soft sounds, all low-passed ----
def harmonium(m, start, g=0.05, pan=0.0, sec=2.6):
    """a low reed organ: odd harmonics, a slow breath of an attack, the bellows' small swell, filtered"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x) * w for k, w in ((1, 1), (2, 0.25), (3, 0.5), (5, 0.22), (7, 0.1)))
    e = np.minimum(1, x / 0.09) * np.minimum(1, (sec - x) / 0.9) * (1 + 0.05 * np.sin(2 * np.pi * 3.2 * x))
    put(norm(filt((s * e).astype(np.float32), 'low', 1800)), start, g, pan)
def soft(m, start, g=0.035, pan=0.0):
    """a low felt note, for a moment that lands"""
    felt(m, start, g, pan)
def knock(s, g=0.04, pan=0.0, f=240):
    """a soft wooden knock: a card arriving, a reference drawn"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * f * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * f * 2.2 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def dknock(s, g=0.045, pan=0.0):
    """a muted double knock: refused"""
    knock(s, g, pan, 190); knock(s + 0.13, g * 0.8, pan, 170)
def latch(s, g=0.04, pan=0.0):
    """a soft wooden latch: a small knock and the catch settling just after"""
    knock(s, g, pan, 300); knock(s + 0.07, g * 0.6, pan, 420)
def tap(s, g=0.022, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def lines(t0, n, per, g=0.02, pan=0.3):
    """a muffled key every so often while a card's lines type in (never more than one at a time, and not a rhythm)"""
    for k in range(n):
        tap(t0 + k * per, g * (1 - 0.15 * (k % 2)), pan)
def paper(s, g=0.035, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def pageturn(s, g=0.04, pan=0.0):
    """a register page turning: a slow swell of paper with a soft flutter, kept low"""
    x = tt(0.7); X(filt(noise(0.7), 'band', (220, 1800)) * np.sin(np.pi * x / 0.7) ** 2 * (1 + 0.5 * np.sin(2 * np.pi * 11 * x)), s, g, pan)
def quill(s, sec=1.0, g=0.03, pan=0.0):
    """a quill on paper, softly: low-band noise in uneven strokes, nothing bright"""
    x = tt(sec); gate = (np.sin(2 * np.pi * 6.5 * x + 2.5 * np.sin(2 * np.pi * 1.7 * x)) > 0.1).astype(np.float32)
    X(filt(noise(sec), 'band', (500, 2300)) * filt(gate, 'low', 40) * np.sin(np.pi * x / sec), s, g, pan)
def press(s, g=0.09):
    """a stamp: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.35, 0, 200)
def swell(ch, s, sec=3.0, g=0.022):
    """a soft reed swell, instead of a shimmer"""
    pad(ch, s, sec, g, 'reed')

# chords (MIDI note numbers): B-flat major and its neighbours, voiced low
BBMAJ9 = [46, 53, 57, 60, 62]; EBMAJ9 = [39, 46, 50, 53, 58]; FSUS = [41, 48, 53, 55, 60]; FMAJ = [41, 48, 53, 57, 60]
GM7 = [43, 50, 53, 58]; CM7 = [48, 55, 58, 62]; DM7 = [38, 45, 50, 53, 57]; BBADD = [46, 53, 58, 60, 62]
def mark(start, root, g=0.065):
    """the series' four notes, 1-4-5-8, rising, on the low harmonium"""
    for i, iv in enumerate([0, 5, 7, 12]):
        harmonium(root + iv, start + i * 0.38, g * (1.12 if i == 3 else 1), (i - 1.5) * 0.15, sec=3.4 if i == 3 else 2.2)
def bed(sid, chords, a=None, b=None, g=0.04, tone='reed', bassg=0.02):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)
L0 = lambda sid, t: S0(sid) + t                     # a time inside a chapter, as the scene's t

# 1. The register is the title: the reed organ alone for 1858; paper as each deed unrolls;
#    a knock where the finger stops at the gap; the register's page turning; the transfer signed and stamped; the register closing (a thud);
#    a swell as it becomes a core model; three knocks for the three tags; the title on the series' mark
bed('register', [BBMAJ9, EBMAJ9, BBMAJ9], 0, cq('register', 'bridge'), g=0.036)
bed('register', [GM7, EBMAJ9], cq('register', 'bridge'), cq('register', 'breath'), g=0.036, tone='warm')
span_ = W('register', 'act', 'tracing') - S0('register') + 1.2
for i in range(6):
    paper(L0('register', 0.9 + i / 6 * span_), 0.026, -0.5 + i * 0.2, 0.4)
knock(W('register', 'act', 'hoping', 0.2), 0.035, 0.1, 200); soft(46, W('register', 'act', 'hoping', 0.3), 0.03)
pageturn(G('register', 'chain', 0.1), 0.04)
paper(G('register', 'transfer', -0.3), 0.03, 0.5)
quill(W('register', 'transfer', 'signed', -0.1), 1.1, 0.026, 0.45)
press(W('register', 'transfer', 'owner', 0.25), 0.08)
soft(53, W('register', 'transfer', 'change', -0.1), 0.03)
thud(END('register', 'transfer', 1.15), 0.12); knock(END('register', 'transfer', 1.17), 0.025, 0, 150)
swell([46, 53, 57, 62], G('register', 'bridge', 0.4), 3.2, 0.024)
for word in ['publishes', 'relies', 'only their owner']:
    knock(W('register', 'bridge', word, -0.1), 0.03, -0.5)
bed('register', [BBMAJ9], cq('register', 'breath'), tone='reed', bassg=0.026)
mark(G('register', 'breath', 0.7), 58)
# 2. Domains: a knock as the project box arrives; a felt note as it goes green; a knock for each territory, a muffled key for each
#    thing it owns; a note for "a domain"; keys as the groups type in; soft notes as the flags rise; a note for "ownership follows meaning"
bed('domains', [BBMAJ9, GM7, EBMAJ9, FSUS])
knock(L0('domains', 0.2), 0.03)
soft(58, W('domains', 'green', 'green', -0.2), 0.03)
for k, (lid, word) in enumerate([('registrar', "registrar's"), ('learning', 'learning team'), ('consumers', 'Planning'), ('consumers', 'wallet')]):
    knock(W('domains', lid, word, -0.1), 0.035, [-0.4, 0.4, -0.4, 0.4][k])
for lid, word in [('registrar', 'learners'), ('registrar', 'awards'), ('registrar', 'credentials'), ('registrar', 'student IDs'),
                  ('learning', 'microcredentials'), ('learning', 'badges'), ('learning', 'keys'), ('learning', 'two platforms')]:
    tap(W('domains', lid, word), 0.02, -0.3 if lid == 'registrar' else 0.3)
for i in range(3):
    tap(W('domains', 'consumers', 'their marts', i * 0.15), 0.02, 0.2 * i - 0.2)
soft(53, W('domains', 'domain', 'domain', -0.1), 0.03)
lines(W('domains', 'follows', 'groups', -0.1), 6, 0.27, 0.018, 0.4)
for i, m in enumerate([58, 62, 65, 70]):
    soft(m, W('domains', 'follows', 'name their domain', -0.2 + i * 0.12), 0.022, -0.5 + i * 0.3)
tap(W('domains', 'follows', 'name their domain', -0.4), 0.02, 0.4)
soft(50, W('domains', 'follows', 'Ownership follows', -0.1), 0.032)
# 3. What a domain publishes: a knock as the product card arrives; keys as the YAML types in; a felt note as each part lights;
#    a latch for the contract and one for the version tag; a knock for each who builds on it, as its arrow is drawn
bed('products', [BBMAJ9, CM7, FMAJ, BBADD])
knock(L0('products', min(0.9, W('products', 'publish', 'product', -0.2) - S0('products'))), 0.04, 0.3)
lines(G('products', 'learner', -0.1), 6, 0.24, 0.018, -0.3)
for lid, word in [('learner', 'grain'), ('owner', 'owner'), ('owner', 'domain'), ('owner', 'glossary')]:
    soft(57 if word == 'grain' else 58, W('products', lid, word, -0.15), 0.022, 0.3)
latch(W('products', 'promise', 'contract', 0.2), 0.04, 0.3)
latch(W('products', 'promise', 'version', -0.15), 0.035, 0.3)
soft(62, W('products', 'promise', 'documentation', -0.15), 0.022, 0.3)
knock(W('products', 'build', "Noor's group", -0.2), 0.03, -0.5); knock(W('products', 'build', "Noor's group", 0.3), 0.025, -0.2)
knock(W('products', 'build', 'Mei owns', -0.2), 0.03, -0.1)
for i in range(2):
    knock(W('products', 'build', 'Everyone', 0.3 + i * 0.2), 0.03, 0.3 + i * 0.3)
# 4. Private, protected, public: a swell as the rings draw; keys as the cards type in; a felt note as each ring is named;
#    a muted double knock as the reference is refused; keys for dbt's message; a soft knock as the reference to Planning's mart goes through;
#    a muted knock as it snaps; a note for the green reference to the core
bed('access', [GM7, EBMAJ9, CM7, FSUS, BBMAJ9])
swell([46, 53, 58, 62], L0('access', 0.7), 3.6, 0.02)
lines(W('access', 'rings', 'access', -0.1), 6, 0.27, 0.017, 0.4)
lines(G('access', 'public', 0.0), 4, 0.3, 0.016, 0.4)
for lid, word, m in [('public', 'Public', 58), ('protected', 'Protected', 55), ('private', 'private', 50)]:
    soft(m, W('access', lid, word, -0.1), 0.03, -0.3)
dknock(W('access', 'refused', 'tries', 0.7), 0.045, -0.2)
lines(W('access', 'refused', 'refuses', -0.2), 5, 0.32, 0.017, 0.4)
knock(W('access', 'allowed', "Planning's mart", 0.7), 0.035, -0.3)
knock(W('access', 'wrong', 'changes', -0.2), 0.03, -0.3, 170)
knock(W('access', 'wrong', 'Consumers build', 0.6), 0.03, -0.2); soft(58, W('access', 'wrong', 'Consumers build', 0.6), 0.035, 0.3)
# 5. Who can read: a knock for each model, and each table; keys for the grant; a soft click as each door opens;
#    a muted double knock where the reference stays refused; a note for the two doors
bed('grants', [EBMAJ9, CM7, BBMAJ9])
for i in range(3):
    knock(L0('grants', 0.6 + i * 0.2), 0.028, -0.5 + i * 0.4)
    knock(W('grants', 'refer', 'its table', -0.2 + i * 0.15), 0.028, -0.5 + i * 0.4, 210)
lines(G('grants', 'grants', 0.0), 5, 0.28, 0.017, 0.5)
knock(W('grants', 'grants', 'grant reading', -0.1), 0.03, 0.1, 330)
knock(G('grants', 'dashboard', -0.1), 0.03, -0.6)
dknock(W('grants', 'dashboard', 'private staging', 0.5), 0.038, -0.3)
knock(W('grants', 'dashboard', 'if a grant', -0.1), 0.032, -0.5, 330)
knock(G('grants', 'doors', -0.1), 0.03, 0.5); soft(53, G('grants', 'doors', 0.1), 0.03, 0.3)
# 6. Across projects: paper as the sketch's box draws; keys for its files; a soft knock as the bridge is drawn, a latch for v1;
#    a muted double knock for each reference stopped at the edge; a knock for the sketch's label
bed('across', [BBMAJ9, FSUS, GM7, EBMAJ9])
paper(W('across', 'today', 'One day', -0.1), 0.03, 0.5, 0.9)
lines(G('across', 'depends', -0.1), 3, 0.3, 0.017, 0.5)
lines(G('across', 'pinned', -0.2), 5, 0.28, 0.017, 0.5)
knock(W('across', 'pinned', 'pinned', 0.3), 0.032, 0.0)
latch(W('across', 'pinned', 'version one', -0.2), 0.038, 0.0)
dknock(W('across', 'only', "wallet's marts", 0.4), 0.038, -0.1)
dknock(W('across', 'only', 'any step', 0.4), 0.034, -0.1)
lines(W('across', 'only', 'Only public', 0.0), 4, 0.33, 0.016, 0.5)
soft(58, W('across', 'only', 'meet on the core', -0.1), 0.03)
knock(W('across', 'sketch', "doesn't run", -0.1), 0.03, 0.5)
# 7. What stays shared: a low swell for the ground; a soft thud as each slab is set down; keys for the cards; a short run of keys as
#    Aisha's key is hashed; a muted double knock as the join breaks; felt notes for the tests that stay green; paper for the package;
#    a low thud as the ground cracks
bed('shared', [BBMAJ9, EBMAJ9, GM7, FSUS, BBMAJ9])
swell([34, 41, 46, 50], W('shared', 'still', 'shared', -0.2), 3.0, 0.02)
for lid, word in [('keysets', 'key sets'), ('hash', 'One macro'), ('package', 'conventions'), ('package', 'glossary')]:
    thud(W('shared', lid, word, -0.1), 0.05); knock(W('shared', lid, word, -0.08), 0.02, 0, 160)
lines(G('shared', 'keysets', 0.0), 5, 0.28, 0.017, 0.0)
lines(G('shared', 'hash', 0.0), 5, 0.3, 0.017, 0.0)
for k in range(5):
    tap(W('shared', 'hash', 'Aisha', 0.1 + k * 0.21), 0.02, -0.4 + 0.2 * k)
tap(W('shared', 'another', 'lower case', -0.1), 0.02, 0.5); tap(W('shared', 'another', 'lower case', 0.15), 0.018, 0.5)
dknock(W('shared', 'another', 'Joins', -0.2), 0.042, 0.0)
for i, m in enumerate([53, 58]):
    soft(m, W('shared', 'another', 'no test', -0.3 + i * 0.15), 0.025, -0.4 + 0.8 * i)
lines(W('shared', 'package', "Macros don't", -0.2), 3, 0.4, 0.017, 0.0)
paper(W('shared', 'package', 'a package', -0.2), 0.035, -0.4, 0.9)
thud(W('shared', 'silos', 'silos', -0.2), 0.06)
# 8. Groups first: knocks for the two costs; keys as the decision types in; a low stamp for Noor's gold tick; a knock for each group;
#    a note as the ten steps light; a soft knock for each owner; a reed swell for the agent; the end card on the series' mark
bed('split', [GM7, EBMAJ9, FSUS], 0, cq('split', 'breath'))
knock(W('split', 'why', 'more to deploy', -0.1), 0.03, 0.4); knock(W('split', 'why', 'keep in step', -0.1), 0.03, 0.4)
lines(G('split', 'decided', -0.2), 6, 0.33, 0.017, 0.4)
press(W('split', 'decided', 'Noor decided', 0.1), 0.08)
for i in range(3):
    knock(W('split', 'decided', 'groups first', -0.2 + i * 0.2), 0.03, -0.5 + i * 0.2)
soft(55, W('split', 'decided', 'Projects later', 0.6), 0.025, 0.4); soft(62, W('split', 'decided', 'Projects later', 0.8), 0.022, 0.4)
for i in range(6):
    knock(W('split', 'hands', 'Many owners', -0.2 + i * 0.15), 0.022, -0.7 + i * 0.2, 220)
swell([46, 53, 57, 62, 65], W('split', 'hands', "isn't a person", -0.4), 3.6, 0.02)
bed('split', [BBMAJ9], cq('split', 'breath'), tone='reed', bassg=0.026)
mark(G('split', 'breath', 0.8), 58, 0.07)
