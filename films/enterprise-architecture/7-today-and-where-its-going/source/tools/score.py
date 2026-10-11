# Today, and where it's going: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The series' palette (PLAYBOOK.md: vary the sound itself, film to film): for the imagined morning in 2045, a soft kalimba over airy
# pads in A-flat, with the lydian fourth for an imagined future (and no synthesised "future" sounds: nothing bright, nothing that
# pulses); then nylon-string plucks and a soft flute over warm pads, here in E-flat major, for the present, and the series' own mark,
# four notes rising 1-3-5-8, on the flute and the nylon string together, at the title and the end. The kalimba comes back, softly, at
# the target and at the end of the path.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. The music is a bed of sustained chords that change with the chapters; nothing repeats in the background.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: wooden knocks, paper, muffled keys, low felt notes, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)

# ---- the series' instruments, all low-passed ----
def nylon(m, start, g=0.04, pan=0.0, sec=1.8):
    """a nylon string: a few harmonics that fade from the top, warm and short"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.2 * k) * (1 / k ** 1.4) * np.exp(-x * (1.2 + 1.6 * k)) for k in range(1, 8))
    put(norm(filt((s * np.minimum(1, x / 0.004)).astype(np.float32), 'low', 2200)), start, g, pan)
def thumb(m, start, g=0.04, pan=0.0):
    """a soft kalimba for the imagined morning: the library's kalimba"""
    kalimba(m, start, g, pan)
def soft(m, start, g=0.04, pan=0.0):
    """a low felt note, for a moment that lands"""
    felt(m, start, g, pan)
def knock(s, g=0.05, pan=0.0):
    """a soft wooden knock, for a card or a note arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 240 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 520 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def tap(s, g=0.03, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.04, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def pencil(s, g=0.02, pan=0.0, sec=0.5):
    """a pencil on paper: a soft, short scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * x)) * np.sin(np.pi * x / sec), s, g, pan)
def press(s, g=0.1):
    """a stamp or a confirmation: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def swell(ch, s, sec=3.0, g=0.03):
    """a soft pad swell, instead of a shimmer"""
    pad(ch, s, sec, g, 'warm')
def van(s, sec=2.2, g=0.03, p0=0.0, p1=-0.8):
    """a van driving off: a low engine that fades as it goes"""
    x = tt(sec); r = filt(noise(sec), 'low', 260) * np.exp(-x * 0.9) * np.minimum(1, x / 0.2)
    n = 6
    for k in range(n):
        a = k / n; X(r[int(a * len(r)):int((a + 1 / n) * len(r))], s + a * sec, g, p0 + (p1 - p0) * a)

# chords (MIDI note numbers): A-flat lydian for the imagined morning; E-flat major and its neighbours for the present
ABL9 = [44, 51, 55, 58, 62]; ABMAJ7 = [44, 51, 55, 60]; FM9 = [41, 48, 51, 55, 56]; BBSUS = [46, 53, 56, 58, 63]
EBMAJ9 = [39, 46, 50, 53, 55]; ABMAJ9 = [44, 51, 55, 58, 60]; CM7 = [36, 43, 46, 51]; BBSUS4 = [46, 53, 58, 60]; FM7 = [41, 48, 51, 56]; EBMAJ7 = [39, 46, 50, 55]
def mark(start, root=51, g=0.06):
    """the series' four notes, 1-3-5-8, rising: the flute, doubled by the nylon string"""
    for i, iv in enumerate([0, 4, 7, 12]):
        flute(root + iv, start + i * 0.4, 1.1 if i < 3 else 2.6, g * 0.55, (i - 1.5) * 0.12)
        nylon(root + iv, start + i * 0.4, g, (i - 1.5) * 0.15, sec=2.4 if i == 3 else 1.6)
def bed(sid, chords, a=None, b=None, g=0.04, tone='warm', bassg=0.02):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)


# 1. An imagined morning: airy pads in A-flat lydian; a swell as the sun comes up; kalimba notes as power starts to move house to house;
#    low felt notes as the readings drift; the van, a knock as the transformer is swapped, and the kalimba; paper as the frame is drawn
#    round the street; paper for the list; the mark under the title
M = 'morning'
bed(M, [ABL9, FM9, ABMAJ7, BBSUS, ABL9], 0, cq(M, 'breath'), g=0.028, tone='warm', bassg=0.018)
swell([44, 51, 55, 62], S0(M) + 0.6, 4.0, 0.022)
for k, m in enumerate([68, 70, 72, 75, 74]):
    thumb(m, W(M, 'street', 'trade', k * 0.45), 0.022, -0.6 + k * 0.3)
soft(41, W(M, 'crew', 'drift'), 0.026, 0.0); soft(40, W(M, 'crew', 'drift', 0.9), 0.022, 0.0)
van(W(M, 'crew', 'crew is sent'), 2.2, 0.022, 0.9, 0.3); knock(W(M, 'crew', 'crew is sent', 2.6), 0.026, 0.1); thumb(63, W(M, 'crew', 'crew is sent', 3.0), 0.02, 0.1)
paper(W(M, 'drawing', 'drawing', -0.2), 0.03, 0.0, 0.8)
paper(C(M, 'today', -0.1), 0.035, -0.5, 0.5)
bed(M, [EBMAJ7], cq(M, 'breath') + 0.4, None, g=0.03, tone='warm', bassg=0.022)
mark(G(M, 'breath', 1.6), 51)
# 2. A hundred and forty systems: paper as the note and the list go up; a knock for each capability; muffled keys as the systems fly
#    to their places (a few, not one per system); a swell as most of them land where you'd expect
L = 'list'
bed(L, [EBMAJ9, ABMAJ9, CM7, BBSUS4])
paper(S0(L) + 0.3, 0.035, 0.2); paper(W(L, 'bought', 'list', -0.2), 0.03, -0.3)
for i in range(8):
    knock(W(L, 'place', 'map', i * 0.08), 0.014, -0.8 + i * 0.22)
for i in range(10):
    tap(W(L, 'place', 'Each system', i * 0.3), 0.01, -0.7 + i * 0.15)
swell([39, 46, 51, 55], C(L, 'most', 0.2), 3.0, 0.022)
# 3. Three, none, and one too many: a knock for each outage system, a low note when the three are bracketed; paper for the
#    spreadsheet; a knock and a low note for the system that serves nothing; a knock for each thing the map shows
F = 'find'
bed(F, [CM7, FM7, ABMAJ9, BBSUS4])
for k, word in enumerate(['an outage', 'network control', 'storm tool']):
    knock(W(F, 'three', word, -0.1), 0.022, -0.7 + k * 0.1)
soft(43, W(F, 'three', 'storm tool', 0.6), 0.026, -0.6)
paper(W(F, 'none', 'spreadsheet', -0.1), 0.03, 0.0); soft(41, C(F, 'none', -0.2), 0.022, 0.0)
knock(W(F, 'orphan', 'one system', -0.1), 0.022, 0.6); soft(38, W(F, 'orphan', 'licence'), 0.024, 0.6)
for k, word in enumerate(['Overlaps', 'gaps', 'shadow']):
    knock(W(F, 'names', word), 0.018, -0.6 + k * 0.6)
# 4. What runs it: a knock for each piece of technology as it's named; felt notes, falling, as a change is followed down; a thud and
#    rising notes as the server is switched off and followed up
Y = 'layers'
bed(Y, [EBMAJ9, CM7, ABMAJ9, BBSUS4])
for word, off, pan in [('two data centres', 0, -0.5), ('two data centres', 0.25, -0.1), ('a cloud', 0, 0.3), ('radio network', 0, 0.7)]:
    knock(W(Y, 'below', word, -0.1 + off), 0.02, pan)
for k, m in enumerate([51, 46, 43]):
    soft(m, W(Y, 'follow', 'Change', 0.4 + k * 0.4), 0.022, -0.5)
thud(W(Y, 'follow', 'Switch off'), 0.04)
for k, m in enumerate([43, 46, 51]):
    soft(m, W(Y, 'follow', 'Switch off', 0.6 + k * 0.3), 0.02, 0.2)
# 5. One map, one notation: paper as the notes go up; a nylon note as each note lands in its layer and turns to glass; a swell as the
#    whole map fills, layer by layer
V = 'views'
bed(V, [ABMAJ9, EBMAJ9, FM7, BBSUS4])
for k in range(4):
    paper(S0(V) + 0.4 + k * 0.15, 0.02, -0.6, 0.3)
for k, word in enumerate(['customer segment', 'pain reliever', 'key activity', 'key resource']):
    nylon([63, 58, 55, 60][k], W(V, 'blocks', word, 1.1), 0.022, 0.4)
swell([39, 46, 51, 58], C(V, 'whole', 0.3), 3.6, 0.026)
# 6. Where it's going: the kalimba as the target is drawn; a knock and a nylon note for each new capability; a knock for each new
#    system; a low note as the licence nobody uses is struck out
T_ = 'target'
bed(T_, [EBMAJ9, ABMAJ9, CM7, BBSUS4])
thumb(63, W(T_, 'second', 'the target'), 0.022, 0.5); thumb(67, W(T_, 'second', 'the target', 0.3), 0.02, 0.5)
for k, word in enumerate(['predicting', 'trading']):
    knock(W(T_, 'new', word, -0.1), 0.02, 0.4 + k * 0.3); nylon([67, 70][k], W(T_, 'new', word), 0.022, 0.4 + k * 0.3)
knock(W(T_, 'change', 'One outage'), 0.016, 0.5); knock(W(T_, 'change', 'capacity'), 0.016, 0.6)
knock(W(T_, 'change', 'capacity', 1.2), 0.016, 0.5); knock(W(T_, 'change', 'capacity', 1.5), 0.016, 0.6)
soft(39, W(T_, 'change', 'gone', -0.2), 0.024, -0.5)
# 7. The gaps: paper as the two sides go up; a nylon note for each gap as it's named, rising
P_ = 'gaps'
bed(P_, [CM7, ABMAJ9, EBMAJ9, BBSUS4])
paper(S0(P_) + 0.3, 0.025, -0.5); paper(S0(P_) + 0.5, 0.025, 0.5)
for k, word in enumerate(['Merge', 'Build', 'Switch off', 'Add sensors', 'Open local']):
    nylon([55, 58, 60, 63, 67][k], W(P_, 'five', word, -0.1), 0.022, 0.0)
# 8. The path, in order: a knock for each plateau; soft taps for the work; a felt note for each dependency; a nylon note as each
#    plateau's date is named; in the wordless moment, the kalimba, rising, as the organisation moves along the path
H = 'path'
bed(H, [EBMAJ9, FM7, ABMAJ9, BBSUS4, EBMAJ9], 0, cq(H, 'breath'))
for i in range(4):
    knock(W(H, 'third', 'plateaus', i * 0.25), 0.02, -0.7 + i * 0.45)
for i in range(6):
    tap(W(H, 'third', 'order', 0.2 + i * 0.18), 0.01, -0.5 + i * 0.2)
soft(46, W(H, 'order', 'capacity model comes'), 0.024, 0.0); soft(43, W(H, 'order', 'sensors come'), 0.022, 0.0)
for k, word in enumerate(['2028', '2033', 'after that']):
    nylon([58, 63, 67][k], W(H, 'dates', word), 0.022, -0.3 + k * 0.4)
bed(H, [ABMAJ9], cq(H, 'breath'), None, g=0.03)
for k in range(4):
    thumb([63, 67, 70, 75][k], G(H, 'breath', k * 0.9), 0.02, -0.6 + k * 0.4)
# 9. Why, written down: paper as the record goes up; a pencil for each field; a knock for the question three years on; a swell as the
#    answer is found
D = 'why'
bed(D, [ABMAJ9, EBMAJ9, CM7, BBSUS4])
paper(S0(D) + 0.3, 0.035, -0.2, 0.6)
for word, off in [('Keep', 0), ('Considered', 0), ('Considered', 1.4), ('Decided by', 0), ('Decided by', 0.8)]:
    pencil(W(D, 'outage', word, off), 0.014, -0.3, 0.4)
knock(W(D, 'later', 'Three years'), 0.022, 0.6); paper(W(D, 'later', 'Three years', 0.1), 0.025, 0.6)
swell([44, 51, 55, 60], W(D, 'later', 'answer'), 3.0, 0.024)
# 10. Three drawings: paper as the notes come back; a thud as Grace confirms today, a knock as the drafts go to the board; a swell as
#     the map is drawn, for now; paper for the answer and the next question; the kalimba once, under the end card, before the mark
Z = 'end'
bed(Z, [EBMAJ9, ABMAJ9, CM7, BBSUS4], 0, cq(Z, 'breath'))
paper(S0(Z) + 0.3, 0.035, -0.3, 0.6)
press(W(Z, 'confirm', 'Grace', 0.3), 0.04); knock(W(Z, 'confirm', 'board'), 0.02, -0.4)
swell([39, 46, 51, 55], C(Z, 'done'), 3.0, 0.022)
paper(C(Z, 'answer'), 0.04, 0.4, 0.5); paper(W(Z, 'next', 'backlog'), 0.035, 0.3, 0.4)
bed(Z, [EBMAJ7], cq(Z, 'breath'), None, g=0.034, tone='strings', bassg=0.026)
thumb(63, G(Z, 'breath', 0.6), 0.016, 0.3)
mark(G(Z, 'breath', 1.4), 51)
