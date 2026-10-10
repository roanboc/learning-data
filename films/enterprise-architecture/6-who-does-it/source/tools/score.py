# Who does it, and where meaning changes: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). The series' palette (PLAYBOOK.md: vary the sound itself, film to film): for Japan, a soft marimba over two
# low hums a minor third apart, E and G (fifty and sixty cycles are in the ratio five to six, a minor third), one for each side of the
# line, and no borrowed Japanese instruments (the story is told in the series' own voice); then nylon-string plucks and a soft flute
# over warm pads, here in G major, for the present, and the series' own mark, four notes rising 1-3-5-8, on the flute and the nylon
# string together, at the title and the end. The two hums come back, softly, wherever the film stands at the edge between the network
# and retail.
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
def mallet(m, start, g=0.04, pan=0.0):
    """a soft marimba for Japan: the library's marimba, its top taken off"""
    marimba(m, start, g, pan)
def hum(m, start, sec, g=0.02, pan=0.0):
    """one side's hum: a low, steady tone with a soft fade at each end (the two sides sit a minor third apart)"""
    x = tt(sec); f = mf(m); e = np.minimum(1, x / 1.2) * np.minimum(1, (sec - x) / 1.6)
    s = (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * 2 * f * x) + 0.12 * np.sin(2 * np.pi * 3 * f * x)) * e
    put(norm(filt(s.astype(np.float32), 'low', 900)), start, g, pan)
def whir(start, m, g=0.03, pan=0.0, sec=1.6):
    """an early generator spinning up: a low tone that rises to its pitch and settles"""
    x = tt(sec); f = mf(m) * (0.55 + 0.45 * (1 - np.exp(-x * 3))); ph = 2 * np.pi * np.cumsum(f) / SR
    s = (np.sin(ph) + 0.3 * np.sin(2 * ph)) * np.minimum(1, x / 0.3) * np.minimum(1, (sec - x) / 0.6)
    put(norm(filt(s.astype(np.float32), 'low', 700)), start, g, pan)
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
def roll_(s, sec=2.4, g=0.03, pan=0.0):
    """the ground, far off: a low roll that rises and falls (no crash)"""
    x = tt(sec); X(filt(noise(sec), 'low', 160) * np.sin(np.pi * x / sec) ** 1.5, s, g, pan)
def van(s, sec=2.2, g=0.03, p0=0.0, p1=-0.8):
    """a van driving off: a low engine that fades as it goes"""
    x = tt(sec); r = filt(noise(sec), 'low', 260) * np.exp(-x * 0.9) * np.minimum(1, x / 0.2)
    n = 6
    for k in range(n):
        a = k / n; X(r[int(a * len(r)):int((a + 1 / n) * len(r))], s + a * sec, g, p0 + (p1 - p0) * a)
def wind(s, sec=3.0, g=0.035, pan=0.0):
    """a gust, low: filtered noise that swells and falls"""
    x = tt(sec); X(filt(noise(sec), 'band', (120, 900)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def thunder(s, g=0.04, pan=0.0):
    """thunder, far off and soft: a low roll, nothing sharp"""
    roll_(s, 2.6, g, pan)

# chords (MIDI note numbers): E minor for Japan; G major and its neighbours for the present
EM9 = [40, 47, 50, 54, 55]; CMAJ7 = [36, 43, 47, 52]; AM7 = [45, 52, 55, 60]; DSUS = [38, 45, 50, 52, 57]; BM7 = [35, 42, 45, 50]
GMAJ9 = [43, 50, 54, 57, 59]; CMAJ9 = [36, 43, 47, 50, 52]; EM7 = [40, 47, 50, 55]; DSUS4 = [38, 45, 50, 55]; AM9 = [45, 52, 55, 59, 60]; GMAJ7 = [43, 50, 54, 59]
def mark(start, root=55, g=0.06):
    """the series' four notes, 1-3-5-8, rising: the flute, doubled by the nylon string"""
    for i, iv in enumerate([0, 4, 7, 12]):
        flute(root + iv, start + i * 0.4, 1.1 if i < 3 else 2.6, g * 0.55, (i - 1.5) * 0.12)
        nylon(root + iv, start + i * 0.4, g, (i - 1.5) * 0.15, sec=2.4 if i == 3 else 1.6)
def bed(sid, chords, a=None, b=None, g=0.04, tone='warm', bassg=0.02):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)
def edge(s, sec, g=0.012):
    """the two sides' hums, softly, where the film stands at an edge: E on the network's side, G on retail's"""
    hum(40, s, sec, g, -0.6); hum(43, s, sec, g, 0.6)


# 1. Two frequencies: soft pads in E minor and the marimba; each generator spins up as its panel opens, and its side's hum starts with
#    its wave (the east on E, panned right, where the map draws it; the west on G, panned left); marimba notes as the grids grow;
#    a felt note as the line is drawn; a far roll and low notes as the east's stations go dark; a swell as power piles up in the west;
#    knocks for the converters, taps for the thin stream, three low taps for the turns of power cuts; a knock for the converter built
#    since; a swell for the edge; the mark under the title
J = 'two'
bed(J, [EM9, CMAJ7, AM7, DSUS, EM9], 0, cq(J, 'breath'), g=0.028, tone='warm', bassg=0.02)
whir(W(J, 'tokyo', 'Germany', -0.3), 52, 0.026, 0.5); whir(W(J, 'osaka', 'American', -0.3), 55, 0.026, -0.5)
hum(40, W(J, 'tokyo', 'fifty'), C(J, 'quake') - W(J, 'tokyo', 'fifty') + 0.4, 0.02, 0.5)
hum(43, W(J, 'osaka', 'sixty'), C(J, 'quake') - W(J, 'osaka', 'sixty') + 0.4, 0.02, -0.5)
mallet(64, W(J, 'tokyo', 'Tokyo', -0.2), 0.028, 0.4); mallet(67, W(J, 'osaka', 'Osaka', -0.2), 0.028, -0.4)
for k in range(5):
    mallet([52, 55, 59, 62, 64][k], W(J, 'grow', 'grids', k * 0.55), 0.022, 0.5 if k % 2 else -0.5)
soft(40, W(J, 'grow', 'meet'), 0.03, 0.1)
roll_(W(J, 'quake', 'loses', -0.4), 2.8, 0.03, 0.4)
for k, m in enumerate([47, 45, 43, 40]):
    soft(m, W(J, 'quake', 'loses', k * 0.35), 0.024, 0.6 - k * 0.1)
swell([40, 47, 52, 55], W(J, 'quake', 'west has'), 3.0, 0.024)
for k in range(3):
    knock(W(J, 'convert', 'converter', -0.2 + k * 0.15), 0.022, 0.1 + k * 0.05)
for k in range(3):
    tap(W(J, 'convert', 'about one', k * 0.4), 0.012, 0.2)
for k in range(3):
    soft(36, W(J, 'convert', 'Around Tokyo', k * 1.11), 0.02, 0.5)
knock(W(J, 'costly', 'more converters', -0.1), 0.024, 0.0)
swell([40, 47, 52, 55], W(J, 'edge', 'same word'), 3.4, 0.026)
bed(J, [EM7], cq(J, 'breath') + 0.4, None, g=0.03, tone='warm', bassg=0.022)
mark(G(J, 'breath', 1.6), 55)
# 2. A name on each step: paper as the note goes up; a soft knock for each step; a pencil for each name, a red pencil for each
#    strike; a knock for each role as it's named; a felt note for each actor, and one for the actor who changes
N = 'names'
bed(N, [GMAJ9, EM7, CMAJ9, DSUS4])
paper(S0(N) + 0.3, 0.035, 0.2)
for i in range(7):
    knock(C(N, 'night', 0.1 + i * 0.16), 0.016, -0.7 + i * 0.23)
pencil(W(N, 'night', 'Priya'), 0.02, -0.6); pencil(W(N, 'night', 'Sam'), 0.02, -0.2)
for i in range(7):
    pencil(W(N, 'grace', 'crosses', i * 0.18), 0.014, -0.7 + i * 0.23, 0.3)
for k, word in enumerate(['call-taker', 'duty controller', 'crew leader']):
    knock(W(N, 'role', word, -0.1), 0.024, -0.5 + k * 0.5); nylon([55, 59, 62][k], W(N, 'role', word), 0.022, -0.5 + k * 0.5)
for k in range(3):
    soft([43, 47, 50][k], W(N, 'actor', 'an actor', k * 0.25), 0.022, -0.5 + k * 0.5)
nylon(57, W(N, 'actor', 'come and go', 0.4), 0.024, 0.0)
# 3. A partner, and a contract: paper as the utility's frame is drawn; a knock for each team; a knock and a low note for the
#    contractor; paper for the contract, a pencil for its terms; a felt note as the partner changes and the contract holds
P = 'partner'
bed(P, [CMAJ9, GMAJ9, AM9, DSUS4])
paper(S0(P) + 0.2, 0.03, -0.3, 0.6)
knock(W(P, 'units', 'contact centre', -0.1), 0.024, -0.6); knock(W(P, 'units', 'control room', -0.1), 0.024, -0.1)
knock(W(P, 'crew', 'contractor', -0.1), 0.024, 0.6); soft(43, W(P, 'crew', 'a partner'), 0.026, 0.6)
paper(W(P, 'contract', 'written', -0.2), 0.035, 0.3, 0.5); pencil(W(P, 'contract', 'contract'), 0.016, 0.3, 0.8)
soft(47, W(P, 'next', 'Partners change', 0.3), 0.026, 0.6); nylon(59, W(P, 'next', 'contract goes'), 0.024, 0.3)
# 4. An agent on the night shift: a low felt chord as the agent appears; a muffled key for each report; a knock for each fault it
#    groups, a nylon note for each proposed rank; paper for its rights, a knock for each row; low notes as the hard cases go to the
#    duty controller
A = 'agent'
bed(A, [EM7, CMAJ9, GMAJ9, DSUS4], tone='warm')
soft(43, S0(A) + 0.4, 0.026); soft(50, S0(A) + 0.5, 0.02)
for i in range(9):
    tap(C(A, 'reads', 0.2 + i * 0.34), 0.012, -0.8 + i * 0.1)
for i in range(3):
    knock(W(A, 'groups', 'faults', i * 0.3), 0.022, 0.5)
for i in range(3):
    nylon([62, 64, 59][i], W(A, 'groups', 'proposes', i * 0.15), 0.018, 0.7)
paper(C(A, 'rights', 0.2), 0.03, -0.5, 0.5)
knock(W(A, 'rights', 'It may'), 0.02, -0.5); knock(W(A, 'rights', 'may not'), 0.022, -0.5); knock(C(A, 'escalate'), 0.02, -0.5)
soft(40, W(A, 'escalate', 'duty controller', -0.2), 0.028, 0.4); nylon(55, W(A, 'escalate', 'recommends'), 0.022, 0.3)
# 5. How many customers?: paper as the question goes up; a knock and a low note for each number; paper as the house is drawn;
#    the van driving off, and back; a pencil for each account, a felt note for the connection point that holds
K = 'count'
bed(K, [GMAJ9, CMAJ9, EM7, DSUS4])
paper(W(K, 'ask', 'how many', -0.3), 0.035, 0.0)
knock(W(K, 'retail', 'Retail', -0.1), 0.024, -0.5); soft(43, W(K, 'retail', 'three'), 0.026, -0.5)
knock(W(K, 'network', 'network', -0.1), 0.024, 0.5); soft(40, W(K, 'network', 'five'), 0.026, 0.5)
paper(C(K, 'move', -0.4), 0.03, 0.0, 0.5)
van(W(K, 'move', 'moves out'), 2.2, 0.026, -0.2, -0.9); van(W(K, 'move', 'moves out', 3.0), 1.8, 0.022, 0.9, 0.3)
pencil(W(K, 'move', 'closes'), 0.016, -0.5); pencil(W(K, 'move', 'opens'), 0.016, -0.5)
soft(47, W(K, 'move', 'connection point'), 0.026, 0.5); knock(W(K, 'move', "doesn't"), 0.018, 0.5)
swell([43, 50, 55, 59], W(K, 'both', 'different'), 3.0, 0.024)
# 6. A wall between them: the two hums, softly, as the wall goes up; paper for the principle and for the list; a knock as the battery
#    appears; the list hitting the wall: a thud and a low note
L = 'wall'
bed(L, [EM7, CMAJ9, AM7, BM7])
edge(W(L, 'rules', 'separate'), C(L, 'breath') - W(L, 'rules', 'separate'))
paper(W(L, 'rules', "The utility's", -0.1), 0.03, 0.0)
paper(W(L, 'solar', 'applied', -0.2), 0.03, -0.5); knock(W(L, 'solar', 'To a retailer'), 0.022, 0.5)
press(W(L, 'must', 'cross'), 0.05); soft(38, W(L, 'must', 'cross'), 0.03)
# 7. Two organisations in one: paper as each domain's frame is drawn; a knock for each card; taps for each word; a swell as
#    meaning changes at the edge, and the two hums under "customer"
D = 'domains'
bed(D, [GMAJ9, EM7, CMAJ9, DSUS4])
paper(W(D, 'draw', 'the network', -0.1), 0.03, -0.5, 0.6); paper(W(D, 'draw', 'retail', -0.1), 0.03, 0.5, 0.6)
knock(W(D, 'domain', 'organisation in'), 0.02, -0.5); knock(W(D, 'domain', 'organisation in', 0.25), 0.02, 0.5)
for i in range(4):
    knock(W(D, 'own', 'capabilities', -0.1 + i * 0.12), 0.014, -0.6 + i * 0.1)
for i in range(2):
    knock(W(D, 'own', 'capabilities', 0.1 + i * 0.12), 0.014, 0.4 + i * 0.1)
for k, word in enumerate(['connection point', 'feeder', 'outage', 'account', 'tariff', 'bill']):
    tap(W(D, 'own', word, -0.1), 0.014, -0.6 + k * 0.24)
swell([43, 50, 55, 59], W(D, 'meaning', 'Meaning'), 3.2, 0.024); edge(W(D, 'meaning', 'Customer', -0.1), 4.0, 0.014)
# 8. One definition for everyone?: a knock as the one card appears; taps as both sides' words pile in; a stamp: fits neither side;
#    a thud as the list would cross; paper for each side's own meaning; the gate opening (the hums, once more); paper for the list,
#    a pencil for each row; in the wordless moment, soft taps as messages cross
O = 'one'
bed(O, [CMAJ9, AM7, EM7, DSUS4, GMAJ9], 0, cq(O, 'breath'))
knock(W(O, 'tempt', 'one definition', -0.2), 0.026)
for i in range(4):
    tap(C(O, 'fit', -0.6 + i * 0.25), 0.014, -0.6 if i < 2 else 0.6)
press(W(O, 'fit', 'neither'), 0.04)
thud(W(O, 'fit', 'carry', 0.9), 0.05)
paper(W(O, 'instead', 'each domain'), 0.025, -0.5); paper(W(O, 'instead', 'each domain', 0.3), 0.025, 0.5)
edge(W(O, 'instead', 'translation', -0.3), 5.0, 0.014); soft(43, W(O, 'instead', 'translation'), 0.026)
paper(W(O, 'instead', 'a short', -0.1), 0.03, 0.0)
for k, word in enumerate(['Which connection', 'Which retailer', 'Planned', 'life support']):
    pencil(W(O, 'list', word), 0.015, 0.0, 0.4)
bed(O, [GMAJ9], cq(O, 'breath'), None, g=0.032)
for k in range(5):
    tap(G(O, 'breath', 0.4 + k * 0.55), 0.01, -0.5 if k % 2 else 0.5)
# 9. Where it can fail: paper as the house goes up, the van arriving, a felt note as life support lights; paper for retail's record;
#    paper for the network's list; a gust as the storm comes; low notes as the message waits, late; far thunder twice
F = 'fails'
bed(F, [EM7, CMAJ9, AM7, BM7])
paper(S0(F) + 0.3, 0.03, 0.5, 0.5); van(W(F, 'movein', 'moves'), 1.6, 0.02, 0.9, 0.6)
soft(52, W(F, 'movein', 'life support'), 0.024, 0.5); paper(W(F, 'movein', 'retail hears'), 0.03, 0.5)
paper(C(F, 'cross', -0.1), 0.03, -0.5); wind(W(F, 'cross', 'storm', -0.2), 3.0, 0.026, -0.5)
soft(40, C(F, 'late'), 0.03, 0.1); soft(39, C(F, 'late', 0.5), 0.026, 0.1)
thunder(W(F, 'late', 'late', 0.4), 0.03, -0.5); thunder(W(F, 'late', 'wrong list'), 0.026, -0.5)
edge(W(F, 'like', 'the edge'), 3.6, 0.014)
# 10. Drawn, for now: paper as the wall comes back; a thud as each owner confirms; paper for the agent's rights, a knock for its
#     owner; paper for the answer and the next question; the mark under the end card
Z = 'end'
bed(Z, [GMAJ9, CMAJ9, EM7, DSUS4], 0, cq(Z, 'breath'))
paper(S0(Z) + 0.3, 0.035, -0.3, 0.6)
press(W(Z, 'confirm', 'Grace'), 0.04); press(W(Z, 'confirm', 'head of retail', 0.4), 0.04); press(W(Z, 'confirm', 'Ama'), 0.04)
paper(C(Z, 'agent'), 0.03, -0.5); knock(W(Z, 'agent', 'owner'), 0.022, -0.5)
paper(C(Z, 'answer'), 0.04, 0.4, 0.5); paper(W(Z, 'next', 'opens'), 0.035, 0.3, 0.4)
bed(Z, [GMAJ7], cq(Z, 'breath'), None, g=0.034, tone='strings', bassg=0.026)
mark(G(Z, 'breath', 1.4), 55)
