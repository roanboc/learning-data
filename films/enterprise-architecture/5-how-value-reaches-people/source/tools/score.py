# How value reaches people: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The series' palette (PLAYBOOK.md: vary the sound itself, film to film): for Mumbai, a warm electric piano over soft pads, and a muted
# metal tock each time a tin changes hands (no borrowed Indian instruments: the story is told in the series' own voice); for the storm,
# G minor; then nylon-string plucks and a soft flute over warm pads, here in B-flat major, for the present, and the series' own mark,
# four notes rising 1-3-5-8, on the flute and the nylon string together, at the title and the end. The tock comes back in chapter 4,
# where the work changes hands between teams.
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
def keys(m, start, g=0.04, pan=0.0, sec=2.6):
    """a warm electric piano for Mumbai: a soft bell-less tone, its top taken off"""
    f = mf(m); x = tt(sec); idx = 1.2 * np.exp(-x * 3.0) + 0.2
    s = np.sin(2 * np.pi * f * x + idx * np.sin(2 * np.pi * f * x)) * np.exp(-x * 1.0) * (1 + 0.1 * np.sin(2 * np.pi * 4.2 * x))
    put(norm(filt((s * np.minimum(1, x / 0.006)).astype(np.float32), 'low', 1800)), start, g, pan)
def soft(m, start, g=0.04, pan=0.0):
    """a low felt note, for a moment that lands"""
    felt(m, start, g, pan)
def knock(s, g=0.05, pan=0.0):
    """a soft wooden knock, for a card or a note arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 240 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 520 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def tock(s, g=0.04, pan=0.0):
    """a tin changing hands: a muted metal tock, short, its ring cut below 2 kHz"""
    x = tt(0.3); X(norm(filt((np.sin(2 * np.pi * 620 * x) * np.exp(-x * 26) + 0.5 * np.sin(2 * np.pi * 1180 * x) * np.exp(-x * 40) + 0.3 * np.sin(2 * np.pi * 310 * x) * np.exp(-x * 30)).astype(np.float32), 'low', 1900)), s, g, pan)
def tap(s, g=0.03, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.04, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def press(s, g=0.1):
    """a stamp or a confirmation: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def swell(ch, s, sec=3.0, g=0.03):
    """a soft pad swell, instead of a shimmer"""
    pad(ch, s, sec, g, 'warm')
def train(s, sec=2.4, g=0.05, p0=-0.6, p1=0.6):
    """the train crossing the screen: a low roll that rises and falls as it moves, and a few soft clacks of its wheels"""
    x = tt(sec); r = filt(noise(sec), 'low', 380) * np.sin(np.pi * x / sec) ** 1.5
    n = 6
    for k in range(n):
        a = k / n; X(r[int(a * len(r)):int((a + 1 / n) * len(r))], s + a * sec, g, p0 + (p1 - p0) * a)
    for k in range(4):
        knock(s + 0.4 + k * 0.45, 0.012, p0 + (p1 - p0) * (0.2 + k * 0.2))
def wind(s, sec=3.0, g=0.035, pan=0.0):
    """a gust, low: filtered noise that swells and falls"""
    x = tt(sec); X(filt(noise(sec), 'band', (120, 900)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def crack(s, g=0.05, pan=0.0):
    """a branch breaking: a short, dull crack, nothing sharp"""
    x = tt(0.25); X(norm(filt(noise(0.25) * np.exp(-x * 30) + 0.6 * np.sin(2 * np.pi * 180 * x) * np.exp(-x * 25), 'low', 1600)), s, g, pan)
def crackle(s, sec=1.2, g=0.02, pan=0.0):
    """the wire on the ground: a few soft, low sparks"""
    for k in range(7):
        x = tt(0.05); X(filt(noise(0.05), 'band', (300, 1600)) * np.exp(-x * 80), s + k * sec / 7 + 0.03 * ((k * 5) % 3), g * (0.6 + 0.4 * ((k * 3) % 2)), pan)
def buzz2(s, g=0.03, pan=0.0):
    """a phone on silent, buzzing twice: low pulses"""
    for k in range(2):
        x = tt(0.35); X(np.sin(2 * np.pi * 150 * x) * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * x)) * np.sin(np.pi * x / 0.35), s + k * 0.55, g, pan)

# chords (MIDI note numbers): B-flat major and its neighbours for the present; G minor for the storm
BBMAJ9 = [46, 53, 57, 60, 62]; EBMAJ7 = [39, 46, 50, 55]; GM9 = [43, 50, 53, 58, 62]; CM7 = [48, 55, 58, 63]; FSUS = [41, 48, 53, 55, 60]
DM7 = [38, 45, 48, 53]; BBMAJ7 = [46, 53, 57, 62]; GM = [43, 50, 55, 58]; CM = [48, 55, 60, 63]; EBMAJ = [39, 46, 51, 55]; DSUS = [38, 45, 50, 55]
def mark(start, root=58, g=0.06):
    """the series' four notes, 1-3-5-8, rising: the flute, doubled by the nylon string"""
    for i, iv in enumerate([0, 4, 7, 12]):
        flute(root + iv, start + i * 0.4, 1.1 if i < 3 else 2.6, g * 0.55, (i - 1.5) * 0.12)
        nylon(root + iv, start + i * 0.4, g, (i - 1.5) * 0.15, sec=2.4 if i == 3 else 1.6)
def bed(sid, chords, a=None, b=None, g=0.04, tone='warm', bassg=0.02):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)


# 1. Lunch, across the city: warm pads and the electric piano; a soft swell as the camera goes down from the map to the kitchen, and
#    again as it comes back up to the whole city; a tock and a note as the lunch changes hands, rising along the route; soft taps as
#    the lid's marks appear; the train's roll as it crosses; a knock for each figure; a swell as the sorting at every station lights;
#    a knock for each of the customer's three stages; the mark under the title
L = 'lunch'
T0 = W(L, 'hands', 'By')
swell([46, 53, 58, 62], W(L, 'kitchen', 'A home-cooked', 0.3), 2.2, 0.02); swell([46, 53, 57, 62], C(L, 'scale', -0.6), 2.6, 0.022)
bed(L, [BBMAJ9, EBMAJ7, FSUS, BBMAJ9], 0, cq(L, 'breath'), g=0.03, tone='warm', bassg=0.022)
for k, (s_, m) in enumerate([(W(L, 'kitchen', 'the tin to', 0.5), 58), (T0 + 2.15, 62), (T0 + 5.0, 65), (T0 + 7.2, 70)]):
    tock(s_, 0.035, -0.6 + k * 0.4); keys(m, s_ + 0.02, 0.03, -0.6 + k * 0.4)
for k in range(4):
    tap(C(L, 'code', k * 0.4), 0.014, 0.5)
train(T0 + 2.2, 2.3, 0.045, -0.3, 0.4)
for k, word in enumerate(['five thousand', 'two hundred', 'almost no']):
    knock(W(L, 'scale', word), 0.024, -0.2 + k * 0.2)
swell([46, 53, 58, 62], C(L, 'detail', 0.0), 3.0, 0.026)
for k, word in enumerate(['lunch leaves', 'lunch arrives', 'the tin']):
    knock(W(L, 'customer', word), 0.026, -0.5 + k * 0.5); keys([58, 62, 65][k], W(L, 'customer', word, 0.05), 0.022, -0.5 + k * 0.5)
bed(L, [BBMAJ7], cq(L, 'breath') + 0.4, None, g=0.03, tone='warm', bassg=0.024)
mark(G(L, 'breath', 1.6), 58)
# 2. The lights go out: paper as the note goes up; a gust as the storm comes in; the limb cracks, its leaves rustle as it falls, it
#    lands on the line, the line snaps; sparks as the wire lies on the ground; low notes as the windows go dark; the phone buzzing;
#    knocks for the two tags
S = 'storm'
tF = W(S, 'branch', 'falls')
bed(S, [BBMAJ7], 0, cq(S, 'branch') - 0.4, g=0.03)
bed(S, [GM, CM, EBMAJ, DSUS], cq(S, 'branch') - 0.8, None, g=0.032, tone='strings', bassg=0.026)
paper(S0(S) + 0.3, 0.035, 0.1)
wind(C(S, 'branch', -0.8), 3.2, 0.04, -0.3); wind(tF - 0.2, 2.4, 0.03, 0.3)
crack(tF, 0.05, -0.3); paper(tF + 0.05, 0.022, -0.4, 1.1); thud(tF + 0.85, 0.08); knock(tF + 1.3, 0.03, -0.3); crackle(tF + 1.3, 1.4, 0.016, -0.3)
for k, m in enumerate([43, 41, 38]):
    soft(m, W(S, 'branch', 'Forty', -0.6 + k * 0.2), 0.03, -0.3 + k * 0.3)
buzz2(W(S, 'call', 'calls'), 0.03, 0.5)
knock(W(S, 'teams', 'three teams'), 0.026); knock(W(S, 'teams', 'a rule'), 0.026)
# 3. From the household's side: paper as the household is sketched; a knock and a nylon note for each stage, rising; soft taps as
#    each value lands; a swell as the stream is named; three knocks for meter to cash
D = 'side'
bed(D, [BBMAJ9, GM9, EBMAJ7, FSUS])
paper(W(D, 'farah', 'Farah', 0.3), 0.035, 0.0, 0.6)
for k, word in enumerate(['Someone', 'Help', 'lights', 'And someone']):
    knock(W(D, 'list', word), 0.026, -0.6 + k * 0.4); nylon([58, 62, 65, 70][k], W(D, 'list', word, 0.05), 0.026, -0.6 + k * 0.4)
for k in range(4):
    tap(W(D, 'gets', 'Each', 0.0 + k * 0.2), 0.014, -0.6 + k * 0.4)
swell([46, 53, 57, 62], W(D, 'stream', 'value stream'), 3.2, 0.026)
for k in range(3):
    knock(W(D, 'handful', 'meter to cash', k * 0.2), 0.02, 0.0 + k * 0.2)
# 4. Three teams, one stream: a knock for each capability; paper as the lanes appear; a low note for the hand-off that goes wrong;
#    the tock again, for each hand-off, as in Mumbai
T = 'teams'
bed(T, [GM9, BBMAJ9, CM7, FSUS])
for k, word in enumerate(['Finding', 'Dispatching', 'Restoring', 'Informing']):
    knock(W(T, 'caps', word, -0.1), 0.026, -0.6 + k * 0.4)
paper(W(T, 'three', 'three teams', -0.2), 0.03, 0.0, 0.6)
soft(40, W(T, 'sees', 'go wrong', -0.3), 0.036, 0.0); thud(W(T, 'sees', 'go wrong', -0.3), 0.05)
for k in range(4):
    tock(C(T, 'tins', 0.2 + k * 0.15), 0.026, -0.6 + k * 0.4)
# 5. Four kinds of process: paper as the map goes up; a knock as each group is named; a nylon note for restore supply, a felt note
#    as evaluation measures it
P = 'map'
bed(P, [EBMAJ7, BBMAJ9, DM7, FSUS])
paper(W(P, 'grace', 'process map', -0.2), 0.04, 0.0, 0.8)
for k, word in enumerate(['Strategic', 'Operational', 'Support', 'Evaluation']):
    knock(W(P, 'groups', word, -0.1), 0.024, -0.3 + k * 0.2)
nylon(62, W(P, 'restore', 'Restoring'), 0.026); soft(50, W(P, 'restore', 'Evaluation'), 0.028)
# 6. Levels, again: paper for the small map; a knock for the process; a tap for each step, rising; soft taps for the ticks, and a low
#    note for the one step that needs more
V = 'levels'
bed(V, [BBMAJ9, GM9, FSUS])
paper(W(V, 'two', 'Level one', -0.1), 0.03, -0.4, 0.4); knock(W(V, 'two', 'Level two', 0.1), 0.026, -0.2)
for k, word in enumerate(['Take', 'Find', 'Decide', 'Send', 'Repair', 'Switch', 'Confirm']):
    nylon(58 + [0, 2, 4, 5, 7, 9, 10][k], W(V, 'three', word, -0.1), 0.018, -0.7 + k * 0.23)
for k in range(6):
    tap(C(V, 'enough', 0.2 + k * 0.08), 0.01, -0.6 + k * 0.24)
soft(43, C(V, 'enough', 0.8), 0.03, -0.2)
# 7. The edges: a knock as each letter of the SIPOC lands; paper for its items; a tap and a nylon note for the fault record, and a
#    felt note as it goes to the regulator
E = 'edges'
bed(E, [DM7, BBMAJ9, EBMAJ7, FSUS])
for k, (lid, word) in enumerate([('sipoc', 'Who supplies'), ('sipoc', 'what comes in'), ('edges', 'edges'), ('sipoc', 'what goes out'), ('sipoc', 'to whom')]):
    knock(W(E, lid, word, -0.1), 0.024, -0.6 + k * 0.3)
for lid, word in [('in', 'calls'), ('in', 'alarms'), ('in', 'where each crew'), ('out', 'power back'), ('out', 'a time'), ('out', 'fault record')]:
    paper(W(E, lid, word, -0.1), 0.02, 0.0, 0.25)
tap(W(E, 'record', 'start'), 0.02, 0.2); nylon(65, W(E, 'record', 'start', 0.1), 0.022, 0.2); soft(46, W(E, 'record', 'regulator'), 0.028, 0.5)
# 8. Who goes first: a knock and a low note for each fault; a knock as the two crews appear; a stamp for habit; soft taps as the rule
#    is drawn; a nylon note as each fault reaches its answer; the crews driving off, low
F = 'first'
bed(F, [GM, EBMAJ7, CM7, FSUS, BBMAJ9], 0, cq(F, 'breath'))
for k, (word, m) in enumerate([('Hill Street', 43), ('Riverside', 41), ('east side', 38)]):
    knock(W(F, 'faults', word, -0.1), 0.026, -0.5 + k * 0.5); soft(m, W(F, 'faults', word, 0.1), 0.026, -0.5 + k * 0.5)
knock(W(F, 'tonight', 'two crews'), 0.024, 0.6)
press(W(F, 'habit', 'biggest', 0.6), 0.05)
for k in range(7):
    tap(C(F, 'rule', -0.2 + k * 0.23), 0.012, -0.6 + k * 0.2)
for k, (word, dur, m) in enumerate([('wires down', 2.0, 58), ('Then life', 2.4, 62), ('most homes', 2.8, 53)]):
    nylon(m, W(F, 'rule', word, dur), 0.026, -0.5 + k * 0.5)
knock(W(F, 'rule', 'wires down', 2.0), 0.022, -0.5); knock(W(F, 'rule', 'Then life', 2.4), 0.022, 0.0)
wind(G(F, 'breath', 0.2), 1.6, 0.02, 0.2); wind(G(F, 'breath', 0.8), 1.6, 0.02, 0.4)
bed(F, [BBMAJ9], cq(F, 'breath'), None, g=0.032)
# 9. What the rule needs: paper for each fact as it's pinned to the rule; a low note for the number nobody is sure of; a swell for
#    where the data rules are
N = 'needs'
bed(N, [GM9, EBMAJ7, CM7, FSUS])
for lid in ['wires', 'life', 'homes']:
    paper(C(N, lid), 0.03, 0.0, 0.35)
soft(41, W(N, 'homes', "isn't sure"), 0.032, 0.4)
swell([46, 53, 57, 62], W(N, 'where', 'order'), 3.0, 0.026)
# 10. Back on: the lights come back on rising felt notes and a swell; the phone, twice; paper as the wall comes back; a thud as each
#     owner confirms; paper for the rule, the answer and the next question; the mark under the end card
Z = 'end'
bed(Z, [GM9, BBMAJ9, EBMAJ7], 0, cq(Z, 'breath'))
for k, m in enumerate([46, 50, 53, 58]):
    soft(m, W(Z, 'back', 'lights', -0.3 + k * 0.14), 0.028, -0.4 + k * 0.25)
swell([46, 53, 58, 62], W(Z, 'back', 'lights', -0.3), 3.6, 0.03)
buzz2(W(Z, 'back', 'message', -0.2), 0.024, 0.5)
paper(C(Z, 'confirm', -0.7), 0.035, 0.0, 0.6)
press(W(Z, 'confirm', 'Farah', 0.2), 0.04); press(W(Z, 'confirm', 'Grace'), 0.04)
paper(W(Z, 'rule', 'written', -0.2), 0.035, -0.3, 0.5); knock(W(Z, 'rule', 'Grace owns'), 0.024, -0.3)
paper(C(Z, 'answer'), 0.04, 0.4, 0.5); paper(W(Z, 'next', 'who does'), 0.035, 0.2, 0.4)
bed(Z, [BBMAJ7], cq(Z, 'breath'), None, g=0.034, tone='strings', bassg=0.026)
mark(G(Z, 'breath', 1.4), 58)
