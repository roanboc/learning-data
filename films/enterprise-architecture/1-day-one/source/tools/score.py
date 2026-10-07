# Day one: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for a new series (PLAYBOOK.md: vary the sound itself): a lute over a low drone for 1085, then nylon-string plucks
# and a soft flute over warm pads in A major for the present, and the series' own mark, four notes rising 1-3-5-8, on the flute
# and the nylon string together, at the title and the end.
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
def quill(s, n, per, g=0.012, pan=0.2):
    """a quill on parchment: short, soft scratches as a line is written"""
    for k in range(n):
        x = tt(0.09); X(filt(noise(0.09), 'band', (500, 2200)) * np.sin(np.pi * x / 0.09), s + k * per, g * (0.7 + 0.3 * ((k * 7) % 3) / 2), pan)
def press(s, g=0.1):
    """a stamp or a closing cover: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def swell(ch, s, sec=3.0, g=0.03):
    """a soft pad swell, instead of a shimmer"""
    pad(ch, s, sec, g, 'warm')

# chords (MIDI note numbers): A major and its neighbours for the present; D, open, for 1085
AMAJ9 = [45, 52, 56, 59, 61]; DMAJ9 = [38, 45, 49, 52, 54]; FSM7 = [42, 49, 52, 57]; EADD = [40, 47, 52, 56, 59]
BM7 = [47, 54, 57, 62]; CSM7 = [49, 56, 59, 64]; DMAJ7 = [38, 45, 49, 54]; ESUS = [40, 47, 52, 57, 59]
D5 = [38, 45, 50, 57]; DM = [38, 45, 50, 53, 57]; C5 = [36, 43, 48, 55]
def mark(start, root=57, g=0.06):
    """the series' four notes, 1-3-5-8, rising: the flute, doubled by the nylon string"""
    for i, iv in enumerate([0, 4, 7, 12]):
        flute(root + iv, start + i * 0.4, 1.1 if i < 3 else 2.6, g * 0.55, (i - 1.5) * 0.12)
        nylon(root + iv, start + i * 0.4, g, (i - 1.5) * 0.15, sec=2.4 if i == 3 else 1.6)
def bed(sid, chords, a=None, b=None, g=0.04, tone='warm', bassg=0.02):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)

# 1. Before you can govern it: a low drone and open strings in D; the lute as the map is drawn; a quill as the entry is written;
#    a knock for each question; paper as the pages gather; a thud as the cover closes; the mark under the title
bed('govern', [D5, DM, C5, D5], 0, cq('govern', 'breath') + 1.0, g=0.034, tone='strings', bassg=0.026)
for k, m in enumerate([50, 57, 62, 64, 69]):
    lute(m, S0('govern') + 0.6 + k * 0.16, 0.03, -0.3 + k * 0.12)
t0 = W('govern', 'sent', 'surveyors', 0.8)
for i in range(4):
    quill(t0 + i * 1.3, 8, 0.13)
for word in ['Who holds', 'What is on', 'What is it worth']:
    knock(W('govern', 'ask', word), 0.035, 0.2)
lute(57, W('govern', 'then', 'then and now', -0.1), 0.028, 0.3); lute(62, W('govern', 'then', 'then and now', 0.25), 0.028, 0.4)
paper(C('govern', 'book', -0.1), 0.05, 0.0, 1.2); press(C('govern', 'book', 1.4), 0.08)
soft(50, W('govern', 'know', 'know what it is'), 0.04)
bed('govern', [AMAJ9], cq('govern', 'breath') + 0.8, None, g=0.03, tone='warm', bassg=0.024)
mark(G('govern', 'breath', 1.6))
# 2. Day one: the present, in A; a swell as the lines light; a knock for each tag; paper for each thing on the desk; a key for the list;
#    a knock for each question asked; a low note for the question mark
bed('dayone', [AMAJ9, DMAJ9, FSM7, EADD])
knock(W('dayone', 'starts', 'owned by'), 0.03)
swell([57, 61, 64, 69], W('dayone', 'runs', 'poles and wires'), 2.6, 0.02)
for word, pan in [('poles and wires', 0.0), ('hydro', -0.6), ('wind farms', 0.6), ('homes', 0.3)]:
    knock(W('dayone', 'runs', word), 0.03, pan)
for word, pan in [('badge', -0.7), ('org chart', -0.3), ('list', 0.1), ('invitation', -0.3)]:
    paper(W('dayone', 'lunch', word), 0.04, pan, 0.4)
for k in range(5):
    tap(W('dayone', 'lunch', 'list', 0.3 + k * 0.3), 0.018, 0.1)
for i in range(3):
    knock(C('dayone', 'asks', 0.1 + i * 0.55), 0.035, 0.3 + i * 0.15)
soft(45, W('dayone', 'know', 'what to ask'), 0.045, 0.5)
# 3. True, and not enough: a knock for each piece; a low felt note for each thing it can't tell; a swell as the pieces fail to fit
bed('pieces', [FSM7, DMAJ7, BM7, ESUS])
for i in range(4):
    knock(W('pieces', 'true', 'given', i * 0.25), 0.032, -0.6 + i * 0.4)
for k, word in [('org', 'not what'), ('sys', 'not what'), ('manual', 'six years'), ('slogan', 'slide')]:
    soft(45, W('pieces', k, word), 0.026)
swell([42, 49, 52, 56], C('pieces', 'puzzle', -0.2), 3.0, 0.022); knock(C('pieces', 'puzzle', 1.2), 0.03); knock(C('pieces', 'puzzle', 1.5), 0.026, 0.3)
# 4. A way of looking: a knock as each layer lands; a nylon note for each question; a low note when looking from the bottom fails
bed('looking', [AMAJ9, CSM7, DMAJ9, EADD])
l0 = W('looking', 'way', 'layers', -0.3)
for i in range(6):
    knock(l0 + (i + 0.3) / 6.5 * 2.4, 0.026, -0.4 + i * 0.16)
for k, (lid, word) in enumerate([('why', 'Why'), ('how', 'How'), ('runs', 'what runs')]):
    nylon([61, 64, 69][k], W('looking', lid, word, -0.1), 0.04, -0.3 + k * 0.3)
swell([57, 61, 64], C('looking', 'above'), 2.4, 0.02)
soft(40, W('looking', 'bottom', 'still not know'), 0.045)
# 5. Many maps, the same lessons: a knock as each method arrives; a swell as the lessons gather; one nylon note per lesson
bed('methods', [DMAJ9, AMAJ9, BM7, EADD])
for lid, word in [('three', 'Toe-gaff'), ('three', 'Arky-mate'), ('three', 'Zack-man'), ('more', 'Business architecture'), ('more', 'process frameworks'), ('more', 'domain-driven'), ('more', 'data management')]:
    knock(W('methods', lid, word, -0.15), 0.03)
g0 = W('methods', 'champ', 'Under the vocabulary')
swell([45, 52, 57, 61], g0, 3.0, 0.024)
for j in range(5):
    nylon([57, 61, 64, 66, 69][j], g0 + j * 0.3 + 0.5, 0.026, -0.4 + j * 0.2)
# 6. Rough first: paper for each canvas and each note; a key for each box and chevron drawn; a swell as they turn to glass; a brush for the red pen
bed('rough', [AMAJ9, FSM7, DMAJ9, ESUS])
paper(C('rough', 'starts', 0.2), 0.045, -0.4, 0.8); paper(W('rough', 'canvas', 'paid for', -0.6), 0.045, 0.4, 0.8)
for word, off, pan in [('who the utility', 0, -0.2), ('what they need', 0, -0.2), ('what they need', 0.4, -0.5), ('paid for', 0, 0.5), ('paid for', 0.4, 0.6), ('paid for', 0.7, 0.3)]:
    paper(W('rough', 'canvas', word, off), 0.03, pan, 0.25)
paper(C('rough', 'argue', -0.4), 0.03, -0.3, 0.25); paper(W('rough', 'argue', 'argued', -0.2), 0.03, -0.2, 0.6)
for i in range(6):
    tap(W('rough', 'later', 'capability map', i * 0.12), 0.02, -0.3 + i * 0.12)
for i in range(4):
    tap(W('rough', 'later', 'value streams', i * 0.15), 0.02, -0.3 + i * 0.2)
swell([57, 61, 64, 68], W('rough', 'later', 'formal notation'), 3.0, 0.024)
for word, off in [('correct', -0.3), ('drawing', 0), ('drawing', 0.4)]:
    brush(W('rough', 'early', word, off), 0.02, 0.5)
# 7. Evidence, then confirmation: a knock for each note; paper for each source clipped on; a low note as the unsourced note fades;
#    a stamp-like thud, soft, for each confirmation; the chords lift in the wordless ending as the wall turns to glass
bed('evidence', [DMAJ9, AMAJ9, FSM7, EADD], 0, cq('evidence', 'breath'))
for i in range(8):
    knock(S0('evidence') + 0.3 + i * 0.12, 0.02, -0.4 + (i % 4) * 0.25)
for word, off in [('annual report', 0), ("regulator's decision", 0), ('statement of expectations', 0), ('an interview', 0), ('an interview', 0.8), ('an interview', 1.1), ('an interview', 1.4)]:
    paper(W('evidence', 'source', word, off), 0.03, 0.2, 0.25)
soft(42, C('evidence', 'draft', -0.6), 0.03, 0.1)
for off in [0, 0.5]:
    press(W('evidence', 'draft', "says it's right", off), 0.05)
bed('evidence', [AMAJ9, CSM7], cq('evidence', 'breath'), None, g=0.04)
for off in [0.6, 1.2, 1.8, 2.4]:
    press(G('evidence', 'breath', off), 0.035); nylon(64 + int(off * 3) % 5, G('evidence', 'breath', off), 0.022, 0.2)
# 8. Why this matters for data: a knock as the rule arrives; a felt note for each empty socket; a low note for the wrong bill;
#    a swell and three knocks as the rule finds its home
bed('data', [FSM7, BM7, DMAJ9, AMAJ9])
knock(C('data', 'rule'), 0.04)
for k, word in enumerate(['Which process', 'Who owns', 'Which goal']):
    soft([52, 54, 57][k], W('data', 'qs', word, -0.1), 0.03, [-0.6, 0.6, 0.0][k])
soft(40, W('data', 'guess', 'wrong'), 0.045, 0.4)
swell([57, 61, 64, 69], C('data', 'home'), 3.2, 0.028)
for j in range(3):
    knock(C('data', 'home', 0.3 + j * 0.35), 0.03, [-0.6, 0.6, 0.0][j])
# 9. The series: one nylon note as each film lights, rising through the scale
bed('series', [AMAJ9, DMAJ9, EADD, AMAJ9])
nylon(57, W('series', 'eleven', 'builds the map'), 0.03)
SC = [57, 59, 61, 62, 64, 66, 68, 69, 71, 73, 74]
for i, word in enumerate(['who it serves', 'why it moves', 'what it must be able', 'how value', 'who does what', 'what runs it']):
    nylon(SC[i + 1], W('series', 'seven', word, -0.1), 0.026, -0.4 + i * 0.12)
for i, word in enumerate(['the questions', 'rules with', 'a change', 'a map that']):
    nylon(SC[i + 7], W('series', 'four', word, -0.1), 0.026, 0.2 + i * 0.1)
# 10. The first note: the lute once more for the surveyors' questions; paper as the note goes up; the mark under the end card
bed('end', [DMAJ9, AMAJ9], 0, cq('end', 'breath'))
for k, word in enumerate(['What is this', 'Who holds', 'worth']):
    lute([57, 62, 64][k], W('end', 'qs', word, -0.1), 0.026, -0.3)
paper(C('end', 'note'), 0.045, 0.3, 0.5)
bed('end', [AMAJ9], cq('end', 'breath'), None, g=0.034, tone='strings', bassg=0.026)
mark(G('end', 'breath', 1.4))
