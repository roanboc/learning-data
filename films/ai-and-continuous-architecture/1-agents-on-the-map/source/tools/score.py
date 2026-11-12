# Agents on the map: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The series' palette (proposal.md, 11 November 2026): for Babylon, low bowed strings and a soft horn, with clay, brick, basket and
# water as its sounds, and nothing borrowed from the region's music (no instrument, scale or rhythm of it: the story is told in the
# series' own voice); for the present, a harp, with a celesta wherever an agent acts. The series' mark is four notes rising like a
# tower's tiers, each step narrower than the one below (a fifth, a fourth, a third), on the horn and the harp together, at the title
# and the end. This film's key is D minor in Babylon, coming to D major as the tower stands again, and F major in the present; its
# lead is the horn, which answers for the work.
# The films' sound (the author's rule, 20 October 2026, and the review of 4 November 2026):
#  - Music plays under the opening story. After it, music comes now and then: a chapter's chord as it starts, a note under a moment
#    on screen, or a pause without words. Nothing is held under the explaining, and nothing pulses.
#  - Nothing trembles: the strings are bowed without vibrato and the horn is held steady, one voice to a note; every held chord is
#    tuned pure, each key from one table of whole-number ratios, so no two notes a little out of tune beat on a phone's speaker.
#  - Nothing loops, and every sound is an event on screen, at the moment it appears, from the same word and offset as the picture
#    in src/scenes.js, so sound and picture stay together when the voice is re-timed.
#  - Everything stays low and soft: wooden knocks, clay, paper, muffled keys, water, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text(encoding='utf-8'))
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))

# ---- tuning: each key from one table of pure ratios, so every chord's overtones meet exactly and nothing beats ----
JI = [1, 16 / 15, 9 / 8, 6 / 5, 5 / 4, 4 / 3, 45 / 32, 3 / 2, 8 / 5, 5 / 3, 9 / 5, 15 / 8]
BAB, NOW = 50, 53                 # Babylon's tonic, D3; the present's, F3 (MIDI)
def jf(m, tonic):
    """the frequency of MIDI note m, tuned pure in the key whose tonic is the MIDI note tonic"""
    o, d = divmod(m - tonic, 12)
    return mf(tonic) * 2.0 ** o * JI[d]

# ---- Babylon: low bowed strings, a soft horn, and the sounds of the work ----
def bowed(m, start, sec, g=0.02, pan=0.0, rise=1.2, key=BAB):
    """a low bowed string, one voice, no vibrato: its harmonics fall away gently and are taken off above 1.6 kHz, and a faint rasp
    of the bow as it starts to draw; it swells in as the bow draws and fades as it leaves the string"""
    f = jf(m, key); x = tt(sec)
    e = (np.sin(0.5 * np.pi * np.minimum(x / rise, 1)) ** 2 * np.clip((sec - x) / min(1.4, sec * 0.4), 0, 1)).astype(np.float32)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.4 * k) / k ** 1.25 for k in range(1, 11) if f * k < 2400)
    s = s + 0.04 * filt(noise(sec), 'band', (f, min(2000, f * 4))) * np.exp(-x * 2.5)
    put(norm(filt((s * e).astype(np.float32), 'low', 1600)), start, g, pan)
def strings(ch, start, sec, g=0.02, key=BAB):
    """a chord held on low strings: each note bowed in turn, a little apart, across the stereo field"""
    n = len(ch)
    for i, m in enumerate(ch):
        bowed(m, start + 0.3 * i, sec - 0.3 * i, g * (1.0 if i == 0 else 0.8), -0.5 + i / max(1, n - 1), key=key)
def bed(chords, s0, s1, g=0.018):
    """the opening's strings, chord after chord from s0 to s1: each starts 1.2 s before its turn and lasts 2.4 s longer, so the bed
    never drops out and one chord gives way to the next under the voice"""
    d = (s1 - s0) / len(chords)
    for i, ch in enumerate(chords):
        strings(ch, s0 + i * d - 1.2, d + 2.4, g)
def horn(m, start, sec, g=0.02, pan=0.0, key=BAB):
    """a soft horn, held steady: a round tone whose upper harmonics come in a little as it swells, taken off above 1.3 kHz"""
    f = jf(m, key); x = tt(sec); a = min(0.22, sec * 0.3)
    e = (np.sin(0.5 * np.pi * np.minimum(x / a, 1)) ** 2 * np.clip((sec - x) / min(0.6, sec * 0.4), 0, 1)).astype(np.float32)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.3 * k) * (e ** (0.6 * k)) / k ** 1.9 for k in range(1, 8) if f * k < 1800)
    put(norm(filt((s * e).astype(np.float32), 'low', 1300)), start, g, pan)
def phrase(notes, start, g=0.02, pan=0.0, key=BAB):
    """the horn, a few notes in turn: [(note, seconds), ...]"""
    t0 = start
    for m, d in notes:
        horn(m, t0, d + 0.25, g, pan, key); t0 += d

def mud(s, g=0.02, pan=0.0):
    """wet clay pressed into a mould: a soft, low slap"""
    x = tt(0.3); X(norm(filt(noise(0.3), 'low', 700) * np.exp(-x * 18) + 0.6 * np.sin(2 * np.pi * 120 * x) * np.exp(-x * 25)), s, g, pan)
def brick(s, g=0.02, pan=0.0):
    """a fired brick set down on another: a dry, low knock and a little grit"""
    x = tt(0.2); X(norm(filt((np.sin(2 * np.pi * 300 * x) * np.exp(-x * 45) + 0.5 * filt(noise(0.2), 'band', (400, 1500)) * np.exp(-x * 50)).astype(np.float32), 'low', 1600)), s, g, pan)
def basket(s, sec=1.2, g=0.015, pan=0.0):
    """a reed basket carried: a soft creak of the weave, swelling and settling with the steps"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 1500)) * np.sin(np.pi * x / sec) ** 2 * (0.6 + 0.4 * np.sin(2 * np.pi * 1.6 * x)) ** 2, s, g, pan)
def water(s, sec=3.0, g=0.015, pan=0.0):
    """the river along the bank: low water lapping, rising and falling slowly"""
    x = tt(sec); X(filt(noise(sec), 'band', (120, 700)) * np.sin(np.pi * x / sec) ** 2 * (0.7 + 0.3 * np.sin(2 * np.pi * 0.7 * x)), s, g, pan)
def fire(s, sec=2.4, g=0.015, pan=0.0):
    """the kiln's fire: a low breath that swells as it's stoked"""
    x = tt(sec); X(filt(noise(sec), 'band', (70, 450)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def rope(s, sec=1.6, g=0.012, pan=0.0):
    """a rope drawn taut along the ground: a soft rasp that rises a little as it tightens"""
    x = tt(sec); lo = filt(noise(sec), 'band', (250, 700)); hi = filt(noise(sec), 'band', (700, 1500))
    X(((lo * (1 - x / sec) + hi * (x / sec)) * np.sin(np.pi * x / sec)).astype(np.float32), s, g, pan)
def dust(s, sec=1.8, g=0.014, pan=0.0):
    """old brickwork settling: a low fall of grit that swells and dies away"""
    x = tt(sec); X(filt(noise(sec), 'band', (90, 600)) * np.sin(np.pi * np.minimum(1, x / (sec * 0.4)) / 2) * np.exp(-np.maximum(0, x - sec * 0.4) * 2.2), s, g, pan)

# ---- the present: a harp, a celesta where an agent acts, and the sounds of the office ----
def harp_(m, start, g=0.02, pan=0.0, sec=2.8, key=NOW):
    """a harp string, plucked softly and left to ring: its upper harmonics die away fast, taken off above 2.2 kHz"""
    f = jf(m, key); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.3 * k) / k ** 1.6 * np.exp(-x * (0.9 + 0.6 * k * k)) for k in range(1, 9) if f * k < 3000)
    s = s * np.minimum(1, x / 0.003) * np.clip((sec - x) / 0.4, 0, 1)
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g, pan)
def turn(ch, s, g=0.02, pan=0.0, key=NOW):
    """a chapter's chord as its first picture comes in, spread up on the harp and left to ring"""
    for k, m in enumerate(ch):
        harp_(m, s + 0.13 * k, g * (1.0 if k == 0 else 0.8), pan - 0.3 + 0.15 * k, 3.2, key)
def cel(m, start, g=0.01, pan=0.0, key=NOW):
    """the celesta, where an agent acts: a small, clear bell of a note, its brightness taken off at 2.4 kHz"""
    f = jf(m, key); x = tt(2.0)
    s = (np.sin(2 * np.pi * f * x) * np.exp(-x / 1.0) + 0.25 * np.sin(2 * np.pi * 4 * f * x + 0.5) * np.exp(-x / 0.25)) * np.minimum(1, x / 0.003)
    put(norm(filt(s.astype(np.float32), 'low', 2400)), start, g, pan)
def low(m, start, g=0.02, pan=0.0, key=NOW):
    """a low felt note, for something that goes wrong or stays with a person"""
    f = jf(m, key); x = tt(3.0)
    s = sum(np.sin(2 * np.pi * f * k * x) * np.exp(-x * (1.1 + 0.9 * k)) * w for k, w in ((1, 1), (2, 0.3), (3, 0.1)))
    put(norm((s * np.minimum(1, x / 0.008)).astype(np.float32)), start, g, pan)
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock, for a card or a window arriving"""
    s_knock(s, g, pan, f)
def tap(s, g=0.012, pan=0.0):
    """a muffled key"""
    s_tap(s, g, pan)
def paper(s, g=0.015, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def pencil(s, g=0.008, pan=0.0, sec=0.5):
    """a pen on a note: a soft, short scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 1900)) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * x)) * np.sin(np.pi * x / sec), s, g, pan)
def air(s, sec=0.9, g=0.012, pan=0.0):
    """things moving across the frame together: a breath of low air"""
    s_air(s, sec, g, pan, 140, 900)
def press(s, g=0.02, pan=0.0):
    """a stamp or a cross: a low thud and a knock, nothing bright"""
    x = tt(0.3); X(norm(np.sin(2 * np.pi * np.cumsum(60 + 60 * np.exp(-x * 30)) / SR) * np.exp(-x * 14)), s, g, pan); s_knock(s + 0.01, g * 0.4, pan, 200)
def click(s, g=0.012, pan=0.0):
    """a switch thrown: two muffled clicks, close together"""
    s_tap(s, g, pan); s_knock(s + 0.04, g * 0.5, pan, 420)
def slot(s, g=0.012, pan=0.0):
    """an element set in its place: a short, soft slide and a low knock as it settles"""
    x = tt(0.22); X(filt(noise(0.22), 'band', (300, 1500)) * np.sin(np.pi * x / 0.22) ** 2, s, g * 0.8, pan); s_knock(s + 0.18, g * 0.7, pan, 240)
def typing(s, sec, g=0.006, pan=0.0, seed=3):
    """someone typing: muffled keys in a human rhythm, quicker and slower, with a short stop between words"""
    r = np.random.default_rng(seed); t0 = s
    while t0 < s + sec:
        s_tap(t0, g * r.uniform(0.7, 1.1), pan + r.uniform(-0.05, 0.05))
        t0 += r.uniform(0.11, 0.19) + (r.uniform(0.15, 0.3) if r.random() < 0.18 else 0)

def mark(start, g=0.02, key=NOW, root=NOW):
    """the series' mark, four notes rising like a tower's tiers, each step narrower than the one below (a fifth, a fourth, a third):
    the horn, doubled by the harp"""
    for i, iv in enumerate([0, 7, 12, 16 if key == NOW else 15]):
        horn(root + iv, start + i * 0.45, 1.2 if i < 3 else 2.8, g * 0.7, (i - 1.5) * 0.12, key)
        harp_(root + iv, start + i * 0.45, g, (i - 1.5) * 0.15, 2.4 if i < 3 else 3.4, key)

# chords (MIDI note numbers), Babylon's in D minor and the present's in F major, each tuned pure in its key
DM, BB, GM, FMJ, AMJ, DMJ = [38, 45, 53], [34, 41, 50], [43, 50, 58], [41, 48, 57], [33, 40, 49], [38, 45, 54]
NF, NBB, NDM, NC, NAM = [41, 48, 53, 57], [46, 53, 58, 62], [50, 57, 62, 65], [48, 55, 60, 64], [45, 52, 57, 60]


# 1. Many hands: the opening. Low strings under the whole story, from the dark before dawn to the tower standing again, chord after
#    chord in D minor, coming to D major as their god's house stands; the horn, three times: as Etemenanki is named, as the king is
#    told to raise it, and as it stands again. Dust as the ruin is shown; air as the tower that has to stand appears over it; a knock as
#    the scale is drawn, and a basket as the carrier walks it; the surveyor's rod, and the rope drawn out for the plan; clay pressed into
#    a mould, the kiln's fire, a basket carried and the river under the boat, each as its task is named; bricks set down as the king
#    carries them, and as the tower rises. Then the present: the harp, in F, as the many hands appear, a celesta as the agent among them
#    comes forward, a harp note for a task, a role and someone who answers, two for "it helps", a low note for the whole job and the
#    people it harms; and under the title, the series' mark
K = 'hands'
tNow = C(K, 'now')
bed([DM, BB, GM], S0(K) + 0.4, C(K, 'must'))
bed([FMJ, DM, BB, FMJ, GM], C(K, 'must'), C(K, 'rose'))
strings(AMJ, C(K, 'rose', -1.2), C(K, 'son') - C(K, 'rose') + 2.4, 0.018)
strings(DMJ, C(K, 'son', -0.6), tNow - C(K, 'son') + 1.8, 0.018)
phrase([(57, 1.4), (62, 2.6)], W(K, 'city', 'Marduk', -0.2), 0.018, 0.1)
dust(W(K, 'ruin', 'collapse', -0.1), 2.0, 0.014, 0.0)
air(W(K, 'must', 'raise'), 1.6, 0.012, 0.0)
phrase([(62, 0.9), (65, 0.9), (69, 2.6)], W(K, 'must', 'heavens', -0.4), 0.018, -0.1)
knock(C(K, 'big', 0.4), 0.014, 0.0, 200); basket(C(K, 'big', 0.8), 1.6, 0.012, px(720))
knock(W(K, 'plan', 'rod', -0.2), 0.014, px(430), 320)
rope(W(K, 'plan', 'ropes', -0.2), 2.0, 0.012, px(1400))
tMo, tFi, tCa, tBr = W(K, 'tasks', 'moulding'), W(K, 'tasks', 'firing'), W(K, 'tasks', 'carrying'), W(K, 'tasks', 'bringing')
mud(tMo - 0.2, 0.018, px(420)); mud(tMo + 0.5, 0.014, px(420))
fire(tFi - 0.3, 2.4, 0.016, px(236))
basket(tCa - 0.2, 1.4, 0.013, px(600))
water(tBr - 0.4, 3.6, 0.016, px(1700))
tBk = W(K, 'name', 'bricks')
brick(tBk + 0.6, 0.016, px(860)); brick(tBk + 1.9, 0.013, px(880))
phrase([(55, 1.0), (58, 1.0), (62, 2.4)], W(K, 'name', 'answered', -0.3), 0.017, 0.0)
tRo = C(K, 'rose')
for i in range(3):
    brick(tRo + 0.8 + i * 1.1, 0.012, px(900 + 60 * i))
tSo = C(K, 'son')
for i in range(4):
    brick(tSo + 0.8 + i * 1.3, 0.011, px(1020 - 50 * i))
air(tSo + 0.6, 5.6, 0.008, 0.0)
phrase([(57, 1.1), (62, 1.1), (66, 3.0)], W(K, 'son', 'stood again', -0.3), 0.018, 0.0)
turn(NF, tNow + 0.4, 0.016, 0.0)
cel(72, tNow + 0.4 + 12 * 0.06 + 0.3, 0.008, px(960))
for word, m, x in [('a task', 60, 620), ('a role', 65, 960), ('someone who answers', 69, 1300)]:
    harp_(m, W(K, 'help', word, -0.1), 0.016, px(x))
tHp = W(K, 'help', 'helps')
harp_(65, tHp, 0.013, 0.0); harp_(69, tHp + 0.12, 0.011, 0.1)
tWh = W(K, 'help', 'whole', -0.2)
air(tWh, 1.0, 0.01, 0.0); low(38, W(K, 'help', 'harm', -0.2), 0.022, px(1560))
mark(G(K, 'breath', 1.2), 0.02)

# 2. On Tomás's map: the chapter's chord, F, as Tomás and his note come in, and paper for the note; a knock for each layer as the map
#    stacks; a celesta note for each of the two agents on it; a slot for each as it's assigned its role, and paper for its rights;
#    air as the platform slides in under the map, a knock for the architects' own work, and a pencil for the loop of a map kept
#    alive; paper and a knock for the AI agents module's card, and a harp note as the map shows who answers
M = 'map'
turn(NF, S0(M) + 0.6, 0.016, px(400))
paper(C(M, 'note', -0.3), 0.014, px(380))
tL6 = W(M, 'layers', 'six', -0.3)
for l in range(6):
    knock(tL6 + 0.3 + l * 0.3, 0.009, px(1240), 200 + 14 * l)
cel(72, W(M, 'two', 'outage agent'), 0.008, px(1460)); cel(76, W(M, 'two', 'map agent'), 0.007, px(1690))
for k in range(2):
    slot(C(M, 'rights', 0.1 + 0.4 * k), 0.01, px(1460 + 210 * k))
paper(W(M, 'rights', 'rights', -0.2), 0.01, px(1400))
air(W(M, 'series', 'platform', -0.2), 1.1, 0.01, 0.0)
knock(W(M, 'series', 'own work', -0.3), 0.01, px(400)); pencil(W(M, 'series', 'kept alive', -0.2), 0.007, px(1290), 0.7)
tMd = C(M, 'module')
paper(tMd - 0.2, 0.012, px(380)); knock(tMd, 0.01, px(380))
harp_(69, W(M, 'module', 'who answers', -0.1), 0.014, px(1510))

# 3. A plan nobody saw: the chapter's chord, D minor on the harp, as Farah brings the household in; a knock as the chat's window
#    opens, and keys as the household's question is typed; the celesta as the chat says yes. Two weeks later: paper for the bill, a
#    press for the late fee and a low note for the warning that the power could be cut. A knock for the vendor's update, a switch as
#    the chat is switched on; air as the whole activity is drawn round the agent nobody put on the map; a knock for the billing
#    officer's role and paper for the regulator's rules. Keys as the plans run down the contact centre's notes, a press as billing
#    doesn't read them, and a low note as the count reaches 212
U = 'unseen'
turn(NDM, W(U, 'farah', 'household', -0.3), 0.015, px(240))
knock(W(U, 'farah', 'website', -0.3), 0.01, px(800))
typing(W(U, 'farah', 'more time', -0.2), 1.6, 0.005, px(700))
tYs = C(U, 'yes', -0.1)
cel(72, tYs + 0.2, 0.009, px(1000)); cel(77, tYs + 0.5, 0.008, px(1000))
paper(C(U, 'fee', 0.1), 0.014, px(1440))
press(W(U, 'fee', 'late fee', -0.1), 0.016, px(1440))
low(38, W(U, 'fee', 'warning'), 0.022, px(1440))
knock(C(U, 'vendor', 0.1), 0.01, px(1440)); click(W(U, 'vendor', 'switched'), 0.012, px(1440))
air(W(U, 'whole', 'whole', -0.2), 1.2, 0.01, px(800))
knock(W(U, 'officer', 'billing officer', -0.3), 0.01, px(1440)); paper(W(U, 'officer', "regulator's", -0.3), 0.012, px(1440))
typing(C(U, 'notes', 0.3), 2.6, 0.005, px(800), seed=7)
press(W(U, 'notes', 'billing', 0.6), 0.014, px(1440))
low(41, W(U, 'notes', 'two hundred', -0.1), 0.02, px(1440))

# 4. How many agents?: the chapter's chord, B-flat, as Tomás's question goes up; a knock for the IT service management tool's window,
#    and keys as its rows fill; paper for each trace Tomás reads: release notes, contracts, logs and each team's answer. A slot for
#    each agent he finds, as its card lands: the crew planner, the meter agent and the field app's assistant (finding an agent isn't
#    its act, so no celesta); a harp note for the helper, which works on a person's sign-in; and the chapter's chord again, F, as the
#    tally comes to six and a helper
F_ = 'find'
turn(NBB, S0(F_) + 0.6, 0.015, px(750))
tIt = W(F_, 'ask', 'IT service', -0.3)
knock(tIt, 0.01, px(540)); typing(tIt + 0.4, 1.4, 0.004, px(540), seed=4)
for word in ['release notes', 'contracts', 'logs', "each team's answer"]:
    paper(W(F_, 'look', word, -0.2), 0.011, px(1300))
slot(W(F_, 'four', 'crew planner', -0.1), 0.011, px(280)); slot(W(F_, 'four', 'meter agent', -0.1), 0.011, px(660))
slot(C(F_, 'field', 0.1), 0.011, px(1040))
harp_(57, W(F_, 'helper', 'assistant', -0.1), 0.013, px(1420))
turn([41, 48, 57, 60], C(F_, 'seven', 0.1), 0.014, px(1420))

# 5. Software in a role: the chapter's chord, C, as the application is drawn; a slot as it's assigned its role, and a harp note as
#    the role is its own; a knock for the billing officer's role, and a press and a low note as the line to it is crossed out; then
#    air as the process glides in, and a harp note as the activity stays with the people who own it
R = 'role'
turn(NC, W(R, 'drawn', 'an application', -0.3), 0.014, px(520))
slot(W(R, 'drawn', 'assigned', -0.2), 0.012, px(520))
harp_(64, W(R, 'own', 'own', -0.1), 0.013, px(790))
knock(W(R, 'why', 'every right', -0.2), 0.01, px(1320))
press(W(R, 'why', 'no one', -0.1), 0.014, px(960)); low(40, W(R, 'why', 'no one', -0.05), 0.016, px(960))
air(C(R, 'tasks', 0.1), 1.2, 0.01, 0.0)
harp_(60, W(R, 'tasks', 'people', -0.1), 0.012, px(1600))

# 6. How far, task by task: the process carries on from the chapter before, so no new chord. Paper as it's written down; four knocks,
#    rising, as the four steps come in under it; a harp note for each step where the agent does the work, run, draft and verify,
#    higher the further it may go, a knock for inform, and a low note for the one that stays with the officer; paper and a knock for
#    the Five stages, and a switch for "not a switch"
FA = 'far'
paper(W(FA, 'process', 'written', -0.2), 0.012, px(1404))
for k, word in enumerate(['inform', 'draft', 'verify', 'run the task']):
    knock(W(FA, 'levels', word, -0.1), 0.009, px(700 + 150 * k), 200 + 40 * k)
for lid, m, i in [('run', 69, 0), ('draft', 64, 1), ('verify', 65, 3)]:
    harp_(m, C(FA, lid, 0.2), 0.013, px(140 + i * 330 + 154))
knock(C(FA, 'inform', 0.2), 0.01, px(140 + 2 * 330 + 154), 220)
low(38, C(FA, 'none', 0.2), 0.016, px(140 + 4 * 330 + 154))
tSt = C(FA, 'stages')
paper(tSt + 0.1, 0.012, px(1560)); knock(tSt + 0.3, 0.009, px(1560)); click(W(FA, 'stages', 'not a switch'), 0.01, px(1600))

# 7. Its own name, and a hand-off: the chapter's chord, B-flat, as the agent's own identity comes in; a key for each identity's card;
#    a press as an officer's sign-in is crossed out; keys as the log fills, and a switch as the chat is stopped on its own; a knock
#    for the hand-off's card, a harp note for "a person, the same day", and the celesta as the agent says so
N = 'name'
turn(NBB, W(N, 'identity', 'own identity', -0.2), 0.014, px(330))
tap(W(N, 'pair', 'read bills', -0.2), 0.012, px(940)); tap(W(N, 'pair', 'only write', -0.2), 0.012, px(940))
press(W(N, 'identity', 'never', -0.1), 0.012, px(1530))
typing(C(N, 'logs', 0.2), 1.8, 0.005, px(1100), seed=9); click(W(N, 'logs', 'stopped'), 0.012, px(1500))
knock(C(N, 'hands', 0.1), 0.01, px(1170))
harp_(65, W(N, 'person', 'same day', -0.2), 0.014, px(1480))
cel(72, W(N, 'person', 'says so', -0.2), 0.008, px(760))

# 8. Someone who answers: the chapter's chord, D minor, as Farah's question goes up, with paper; a press for each who doesn't answer,
#    the vendor and Tomás; two harp notes, gold, for the head of retail; a knock for each framework; then a low note as the agent's
#    approval is crossed out, and a harp note for "approving is a person's job"
A = 'answers'
turn(NDM, C(A, 'who', -0.2), 0.014, px(1010)); paper(C(A, 'who', -0.1), 0.012, px(1010))
press(W(A, 'not', 'Not the vendor', 0.3), 0.012, px(520 + 186)); press(W(A, 'not', 'Not Tomás', 0.2), 0.012, px(960 + 186))
tOw = W(A, 'owner', 'answers', -0.2)
harp_(65, tOw, 0.014, px(1600)); harp_(69, tOw + 0.15, 0.012, px(1600))
knock(W(A, 'frames', "NIST's", -0.1), 0.009, px(860)); knock(W(A, 'frames', 'I S O', -0.1), 0.009, px(1260))
low(41, W(A, 'approve', 'never approves', -0.1), 0.016, px(560))
harp_(65, W(A, 'approve', "person's", -0.2), 0.013, px(1200))

# 9. Every agent on the map: the chapter's chord, F, as the register comes in; a slot for each agent as its row arrives; keys for
#    the crew planner's chain; a switch as the vendor's setting goes off, and the celesta, falling, as the chat goes from run to
#    draft; air as the check sweeps down the register, and a soft key for each tick; a knock for the flag; then paper as the 212
#    plans' card comes in, and the harp, rising, as billing honours them, refunds the fees and calls each household
L = 'all'
turn(NF, S0(L) + 0.9, 0.014, 0.0)
for i in range(6):
    slot(C(L, 'each', 0.4 + i * 0.5), 0.009, px(960))
for word in ['drafts rosters', 'supervisor', 'Grace']:
    tap(W(L, 'crew', word, -0.2), 0.009, px(700))
click(W(L, 'off', 'switched off', -0.1), 0.012, px(1040))
tDr = W(L, 'off', 'drafts')
cel(77, tDr - 0.1, 0.008, px(890)); cel(72, tDr + 0.2, 0.007, px(890))
tSc = W(L, 'check', 'check runs', -0.2)
air(tSc, 2.6, 0.009, 0.0)
for i in range(6):
    tap(tSc + 0.4 + i * 0.35, 0.006, px(1790))
knock(C(L, 'flag', 0.1), 0.01, px(1786), 180)
paper(C(L, 'plans', -0.1), 0.012, 0.0)
for word, m in [('honours', 60), ('refunds', 65), ('calls', 69)]:
    harp_(m, W(L, 'plans', word, -0.2), 0.012, px(640))

# 10. Many languages, one plan: Babylon again. Its strings, low, as the city comes back and the page opens on the story of Babel,
#     and the horn as Babylon's tower is said to have inspired it; paper for the page. Nothing as the builders in the story stop: the
#     music stops with them. Then the strings again, and the horn, as Babylon's real builders come from many lands; the rope drawn
#     for the plan, clay for each task, and the horn as a name answers for the work; and under the pause, the strings in D major,
#     the tower standing
B_ = 'babel'
strings(DM, S0(B_) + 0.3, 6.2, 0.016)
paper(C(B_, 'story', -0.1), 0.012, px(1440))
horn(57, W(B_, 'story', 'inspired', -0.2), 2.4, 0.014, px(800))
strings(BB, C(B_, 'real', -0.3), 6.2, 0.016)
phrase([(58, 1.0), (62, 1.0), (65, 2.2)], W(B_, 'real', 'many lands', -0.2), 0.016, 0.0)
rope(W(B_, 'shared', 'the plan', -0.2), 2.0, 0.011, px(1100))
for k in range(4):
    mud(W(B_, 'shared', 'a task', -0.2 + k * 0.25), 0.011, px(340 + k * 440))
strings(DMJ, G(B_, 'breath', -0.6), E(B_) - G(B_, 'breath', -0.6) + 0.6, 0.016)

# 11. Agents on the map: the chapter's chord, F, as Tomás's note gets its answer, with paper, and a pen as the answer is written; a
#     slot for each agent as it takes its place on the map, and air as the platform slides in under them. Under the end card,
#     without words, the series' mark
E_ = 'end'
tAn = C(E_, 'answer')
turn(NF, tAn + 0.3, 0.014, px(400)); paper(tAn + 0.4, 0.012, px(400))
pencil(tAn + 0.6, 0.006, px(400), 5.6)
for k in range(6):
    slot(tAn + 0.3 + k * 0.36, 0.007, px(1022 + 136 * k))
air(W(E_, 'next', 'platform', -0.4), 1.2, 0.01, 0.0)
mark(G(E_, 'breath', 0.7), 0.02)

# the whole score a little louder, the music by 2 dB and the effects by 3 dB, so it sits where the films the author accepted sit (the
# music's loud moments about -29 dB, the effects' about -45.5 dB, as tools/quiet.py measures them)
for _b, _k in ((ML, 1.26), (MR, 1.26), (XL, 1.41), (XR, 1.41)):
    _b *= _k
