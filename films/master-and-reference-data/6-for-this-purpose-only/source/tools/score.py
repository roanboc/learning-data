# For this purpose only: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). The palette is the film's own (PLAYBOOK.md: vary the sound itself, film to film), with the series' mark:
# a string section holds the chords, bowed, every note starting together and swelling slowly, the violins to the left and the
# cellos to the right; a harp plucks the roles, each on the note it has in the whole series (the student's D, the tutor's A, the
# researcher's G, the alumna's high D), so a door rings its role's note when it arrives or opens; a horn, softly, is the person:
# whenever Linh stands in white paper, it plays the same D and the A above it; and the clarinet carries the series' mark, one note,
# its octave, its fifth and the note again (1-8-5-1), over the plucked root. The film starts in E minor, by the fire where the oath
# is given, and ends in E major. The effects are the house's: a book's board lifted, the fire on its altar, footsteps on the street,
# a door's latch, its hinges and a knock on it, then cards and tags set down, a pencil, a few muffled keys, drawers, a phone.
# The series' rules (its proposal's Decided table, 20 October 2026) and In the weeds of data crafting's hold:
#  - The strings play under the opening, the oath's story from long ago. After it, music comes in only from time to time: at each
#    chapter's turn, in the pause without words between one chapter's last line and the next one's first, on the next chapter's
#    chord; under a moment on screen (a door's note, the person's); and on the end card. It's never a constant bed under the voice.
#  - Nothing loops, trembles or pulses: one steady voice to a note, since voices a little out of tune with each other beat on a
#    phone's speaker; no vibrato, even on the horn and the clarinet; and no urgent pulse, not even when the appeal's email reaches Linh.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: knocks, paper, muffled keys, a pencil, low notes, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
P = lambda x: max(-0.85, min(0.85, (x - 960) / 960 * 0.9))  # where something is across the frame, as a pan
_rng = np.random.default_rng(66)  # the film's own randomness: the fire's cracks, the keys' spacing, the cards' riffle

# ---- the film's instruments, all low-passed ----
# the music's levels: the strings sit about 21 dB under the voice through the opening, as in the other series' films, and a turn's chord
# about as far under it in its pause; a harp's note or the horn's comes through a chord by about 4 dB at its peak (measured, as
# tools/audio.py mixes them)
BED, NOTE, HARP, HORN = 1.8, 1.6, 1.6, 1.4
def strings(ch, start, sec, g=0.03, a=1.8, r=2.6):
    """a string section holding a chord, bowed: every note starts together and swells (over a seconds) and fades (over r); one steady
    voice to a note, with no vibrato, since voices a little out of tune with each other beat on a phone's speaker, and a little noise
    from the bow; the high notes to the left, as the violins sit, the low ones to the right; nothing above about 1.5 kHz"""
    x = tt(sec); n = len(ch)
    e = np.clip(x / a, 0, 1) ** 1.6 * np.clip((sec - x) / r, 0, 1) * (1 - 0.15 * np.clip((x - 2.4) / max(1.0, sec - 5.0), 0, 1))
    for k, m in enumerate(ch):
        pan = 0.5 - 1.0 * k / max(1, n - 1); f = mf(m); ph = 2 * np.pi * f * x
        s = sum(np.sin(h * ph + 0.9 * h * k) / h * np.exp(-0.2 * h) for h in range(1, 7))
        s = s + 0.05 * norm(filt(noise(sec), 'band', (f, min(f * 4, 1400))))
        put(filt((s * e).astype(np.float32), 'low', 1500), start, g * BED * 1.7 / n, pan)
def bed(keys, end, g=0.03):
    """the chapter's chords, each from its moment (a little early, so it has swelled by then) until a little after the next one starts"""
    for i, (t0, ch) in enumerate(keys):
        t1 = keys[i + 1][0] if i + 1 < len(keys) else end
        strings(ch, t0 - 1.2, t1 - t0 + 3.6, g)
def last_end(sid):
    """when a chapter's last line ends"""
    ln = _NARR[sid]['vo'][-1]; return G(sid, ln['id']) + _DUR[sid + '/' + ln['id']]
def first(sid):
    """when a chapter's first line begins"""
    return G(sid, _NARR[sid]['vo'][0]['id'])
def turn(ch, s0, s1, g=0.03):
    """the music at a chapter's turn: a chord that swells in as one chapter's last line ends (s0) and is all but gone as the next
    one's first line begins (s1), so it plays in the pause without words between them"""
    a = s0 + 0.1; sec = s1 + 0.5 - a
    strings(ch, a, sec, g, a=min(1.0, sec * 0.4), r=min(1.5, sec * 0.55))
def harp_(m, start, g=0.03, pan=0.0, sec=2.4):
    """a harp string, plucked: round, its top fading fast, and nothing above about 2 kHz"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.3 * k) * (1 / k ** 1.5) * np.exp(-x * (0.9 + 0.5 * k * k)) for k in range(1, 9))
    s = s * np.minimum(1, x / 0.003) + 0.03 * filt(noise(sec), 'band', (f * 2, min(f * 6, 2400))) * np.exp(-x * 60)
    put(norm(filt(s.astype(np.float32), 'low', 2000)), start, g * NOTE * HARP, pan)
# each role's note, the same as in the rest of the series, an octave up for the harp; the appeal asking for donations has one too
ROLE = {'student': 62, 'applicant': 64, 'researcher': 67, 'tutor': 69, 'alumna': 74}
DONOR = 71
def role(r, s, g=0.03, pan=0.0):
    harp_(ROLE[r], s, g, pan)
def horn(m, start, sec, g=0.03, pan=0.0):
    """a horn, softly: slow to speak, round, held steady, its tone opening as it swells and closing again as it fades"""
    f = mf(m); x = tt(sec); e = env(sec, 0.24, min(1.1, sec * 0.45))
    ph = 2 * np.pi * f * x
    s = sum(np.sin(h * ph) * (1 / h ** 1.2) * e ** (1 + 0.45 * (h - 1)) for h in range(1, 9))
    s = s + 0.02 * filt(noise(sec), 'band', (f, f * 4)) * np.exp(-x * 12)
    put(norm(filt(s.astype(np.float32), 'low', 1200)), start, g * NOTE * HORN, pan)
def person(s, g=0.03, pan=0.0):
    """the person: the horn's D, and the A above it, the same two notes wherever she stands in white paper"""
    horn(50, s, 3.4, g, pan); horn(57, s + 0.5, 2.9, g * 0.6, pan + 0.1)
def clarinet(m, start, sec, g=0.04, pan=0.0):
    """the series' soft clarinet: odd harmonics and a breath as it speaks, played straight, as a clarinet usually is"""
    f = mf(m); x = tt(sec)
    ph = 2 * np.pi * f * x
    s = np.sin(ph) + 0.05 * np.sin(2 * ph) + 0.36 * np.sin(3 * ph) + 0.16 * np.sin(5 * ph) + 0.07 * np.sin(7 * ph)
    br = filt(noise(sec), 'band', (f * 0.9, f * 3)) * 0.12 * np.exp(-x * 6)
    put(norm(filt(((s + br) * env(sec, 0.09, min(0.35, sec * 0.4))).astype(np.float32), 'low', 2200)), start, g * NOTE, pan)
def mark(start, root=64, g=0.05):
    """the series' mark, 1-8-5-1, on the clarinet, over the root, plucked on the harp"""
    for i, iv in enumerate([0, 12, 7, 0]):
        clarinet(root + iv, start + i * 0.42, 0.9 if i < 3 else 2.8, g * (1 if i == 0 else 0.85), (i - 1.5) * 0.1)
    harp_(root - 12, start, g * 0.6); harp_(root - 12, start + 1.26, g * 0.5)

# ---- the house's sounds, and the paper's ----
# the effects' level, all together: their peaks stand about 14 dB under the music at that moment, as in The map before the data
# (measured as tools/audio.py mixes them)
FX = 1.0
def fx(sig, s, g, pan=0.0):
    X(sig, s, g * FX, pan)
def wood(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a board, a card or a drawer coming to rest"""
    s_knock(s, g * FX, pan, f)
def _burst(sec, lo, hi, k):
    """a short burst of filtered noise that dies away at rate k"""
    x = tt(sec); return filt(noise(sec), 'band', (lo, hi)) * np.exp(-x * k)
def rap(s, g=0.026, pan=0.0):
    """knuckles on a wooden door: a low, short knock, the panel ringing for a moment"""
    x = tt(0.22)
    body = np.sin(2 * np.pi * 118 * x) * np.exp(-x * 30) + 0.5 * np.sin(2 * np.pi * 265 * x + 1) * np.exp(-x * 45) + 0.22 * np.sin(2 * np.pi * 410 * x + 2) * np.exp(-x * 60)
    fx(norm(filt((body + 0.5 * _burst(0.22, 300, 1600, 140)).astype(np.float32), 'low', 1800)), s, g, pan)
def rattle(s, g=0.006, pan=0.0):
    """a latch rattling in its keeper"""
    fx(norm(filt(_burst(0.03, 600, 2000, 160).astype(np.float32), 'low', 2200)), s, g, pan)
def knock(t0, g=0.026, pan=0.0):
    """a request knocking at a shut door, as the door shakes on its latch (m6_shake): two raps, and the latch rattling between them"""
    rap(t0 + 0.04, g, pan); rap(t0 + 0.21, g * 0.7, pan)
    rattle(t0 + 0.125, g * 0.25, pan); rattle(t0 + 0.29, g * 0.15, pan)
def latch(s, g=0.02, pan=0.0):
    """a wooden latch lifted or dropped: a small click, and a low clunk"""
    x = tt(0.14); clunk = np.sin(2 * np.pi * 180 * x) * np.exp(-x * 45) + 0.4 * np.sin(2 * np.pi * 390 * x) * np.exp(-x * 70)
    fx(norm(filt((0.7 * _burst(0.14, 700, 2200, 220) + clunk).astype(np.float32), 'low', 2200)), s, g, pan)
def swing(s, sec=0.9, g=0.016, pan=0.0):
    """a door swinging on its hinges: the air it moves, and the low, soft creak of the wood, its note bending as it turns"""
    x = tt(sec); w = np.sin(np.pi * x / sec) ** 2; f = 128 + 34 * np.sin(np.pi * x / sec)
    cr = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.65 + 0.35 * norm(filt(noise(sec), 'low', 22)))
    fx((filt(noise(sec), 'band', (120, 700)) * w + 0.04 * filt(cr.astype(np.float32), 'low', 900) * w).astype(np.float32), s, g, pan)
def shut(s, g=0.026, pan=0.0):
    """a door shut: a soft, low thud against its frame, then its latch"""
    x = tt(0.3); ph = 2 * np.pi * np.cumsum(70 + 40 * np.exp(-x * 30)) / SR
    fx(norm(filt((np.sin(ph) * np.exp(-x * 16) + 0.3 * _burst(0.3, 100, 600, 40)).astype(np.float32), 'low', 900)), s, g, pan)
    latch(s + 0.05, g * 0.5, pan)
def fire(s0, s1, g=0.014, pan=0.0):
    """the fire on its altar, while it's on screen: a low hush that breathes unevenly, and now and then a soft crack of wood, never
    twice alike"""
    sec = s1 - s0; x = tt(sec); w = np.clip(x / 1.2, 0, 1) * np.clip((sec - x) / 1.4, 0, 1)
    sig = 0.5 * filt(noise(sec), 'band', (80, 420)) * (0.75 + 0.25 * norm(filt(noise(sec), 'low', 1.5)))
    k = _rng.uniform(0.1, 0.4)
    while k < sec - 0.1:
        i = int(k * SR); b = _burst(_rng.uniform(0.008, 0.03), 300, 1800, _rng.uniform(90, 200)) * _rng.uniform(0.4, 1.5); sig[i:i + len(b)] += b[:len(sig) - i]
        k += _rng.exponential(0.24) + 0.05
    fx((sig * w).astype(np.float32), s0, g, pan)
def steps(ts, g=0.016, pans=None):
    """footsteps on a packed earth street: a soft, low heel and a little grit, no two alike"""
    for i, s in enumerate(ts):
        x = tt(0.2); heel = np.sin(2 * np.pi * np.cumsum(95 + 50 * np.exp(-x * 40)) / SR) * np.exp(-x * 28)
        fx(norm(filt((heel + 0.35 * _burst(0.2, 250, 1400, 35)).astype(np.float32), 'low', 1600)), s, g * _rng.uniform(0.8, 1.0), pans[i] if pans else 0.0)
def cloth(s, sec=0.8, g=0.01, pan=0.0):
    """a rustle of cloth, as someone moves their arms"""
    x = tt(sec); fx(filt(noise(sec), 'band', (150, 1100)) * np.sin(np.pi * x / sec) ** 2 * (0.6 + 0.4 * norm(filt(noise(sec), 'low', 7))), s, g, pan)
def board(s, g=0.016, pan=0.0):
    """the book's top board lifted off its leaves: a soft scrape of wood on palm leaf"""
    x = tt(0.4); fx(filt(noise(0.4), 'band', (150, 900)) * np.sin(np.pi * x / 0.4) ** 2, s, g, pan)
def card(s, g=0.026, pan=0.0, sec=0.4):
    """a card or a sheet set down: a soft slide of paper, and a light touch as it lands"""
    x = tt(sec); fx(filt(noise(sec), 'band', (220, 1800)) * np.sin(np.pi * x / sec) ** 2 * (1 - 0.5 * x / sec), s, g, pan)
    wood(s + sec * 0.8, g * 0.22, pan, 300)
def tag(s, g=0.016, pan=0.0):
    """a tag set on something: a light tap of paper"""
    fx(norm(filt(_burst(0.08, 300, 1500, 70).astype(np.float32), 'low', 1800)), s, g, pan); wood(s + 0.005, g * 0.35, pan, 260)
def graphite(s, sec=0.6, g=0.012, pan=0.0):
    """a pencil on paper: a soft grain that follows the stroke"""
    x = tt(sec); gr = np.clip(0.55 + 0.45 * norm(filt(noise(sec), 'low', 14)), 0, 1)
    fx(filt(noise(sec), 'band', (500, 2000)) * gr * np.sin(np.pi * x / sec) ** 0.5, s, g, pan)
def ringp(s, sec=0.8, g=0.012, pan=0.0):
    """a pencil drawn round something: the grain swells once round, and lifts"""
    x = tt(sec); fx(filt(noise(sec), 'band', (500, 1900)) * np.sin(np.pi * x / sec) * (0.75 + 0.25 * np.sin(np.pi * x / sec * 3)), s, g, pan)
def tickp(s, g=0.014, pan=0.0):
    """a pencil tick: a short stroke and a longer one"""
    graphite(s, 0.1, g, pan); graphite(s + 0.09, 0.18, g * 0.8, pan)
def crossp(s, g=0.014, pan=0.0):
    """a pencil cross: two strokes, one after the other"""
    graphite(s, 0.16, g, pan); graphite(s + 0.22, 0.16, g, pan)
def strike(s, sec=0.6, g=0.014, pan=0.0):
    """a line of red ink drawn through something: a quick, even stroke"""
    x = tt(sec); fx(filt(noise(sec), 'band', (450, 1800)) * np.clip(x / 0.05, 0, 1) * np.clip((sec - x) / 0.12, 0, 1), s, g, pan)
def keys(s, sec, g=0.011, pan=0.0, n=6):
    """a few muffled keys while something is typed in, never quite evenly"""
    for k in range(n):
        s_tap(s + (k + _rng.uniform(-0.25, 0.25)) * sec / n, g * FX * _rng.uniform(0.75, 1.0), pan)
def air(s, sec=0.7, g=0.016, pan=0.0):
    """a breath of air: a line drawn, a card or a note carried across"""
    s_air(s, sec, g * FX, pan, 160, 1000)
def wash_(s, sec=0.8, g=0.014, pan=0.0):
    """a wet brush laying a wash over something"""
    x = tt(sec); fx(filt(noise(sec), 'band', (180, 1100)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def buzz(s, g=0.02, pan=0.0):
    """a phone in a hand, buzzing twice as a message comes in: a low hum, felt more than heard"""
    for d in (0.0, 0.34):
        x = tt(0.22); m = np.sin(2 * np.pi * 150 * x) + 0.5 * np.sin(2 * np.pi * 300 * x) + 0.25 * np.sin(2 * np.pi * 450 * x)
        fx(norm(filt((m * np.clip(x / 0.02, 0, 1) * np.clip((0.22 - x) / 0.04, 0, 1)).astype(np.float32), 'low', 700)), s + d, g, pan)
def riffle(s, sec=1.6, g=0.012, pan=0.0):
    """cards riffled as they're counted: quick, then slower, as the count comes to rest"""
    k = 0.0
    while k < sec:
        fx(norm(filt(_burst(0.03, 300, 1800, 120).astype(np.float32), 'low', 2000)), s + k, g * (1 - 0.5 * k / sec) * _rng.uniform(0.7, 1.0), pan)
        k += 0.035 + 0.11 * (k / sec) ** 2
def drawer(s, g=0.014, pan=0.0):
    """a drawer pulled out to search it: a low slide of wood, and a soft stop"""
    x = tt(0.5); fx(filt(noise(0.5), 'band', (100, 800)) * np.sin(np.pi * x / 0.5) ** 2 * (0.7 + 0.3 * norm(filt(noise(0.5), 'low', 30))), s, g, pan)
    wood(s + 0.46, g * 0.5, pan, 170)
def seal(s, g=0.03, pan=0.0):
    """a date pressed on: a soft, low press, and a knock"""
    thud(s, g * FX); wood(s + 0.01, g * 0.4, pan, 210)

# the camera of a scene that moves (src/scenes.js's m6_focus): where x on the place is in the frame at time t, as a pan
def _cam(t, keys, d=1.6):
    x, z = keys[0][1], keys[0][3]
    for k in keys[1:]:
        u = min(1, max(0, (t - k[0]) / d))
        if u <= 0: break
        u = 0.5 - 0.5 * np.cos(np.pi * u); x, z = x + (k[1] - x) * u, z + (k[3] - z) * u
    return x, max(1, z)
def Pc(x, t, keys):
    cx, z = _cam(t, keys); return P((x - cx) * z + 960)

# chords (MIDI note numbers), low to high
EM9 = [40, 47, 54, 55, 59, 62]; EM7 = [40, 47, 55, 59, 62]; CMAJ7 = [36, 43, 52, 55, 59]; CMAJ9 = [36, 43, 52, 55, 59, 62]; AM7 = [45, 52, 55, 60, 64]
AM9 = [45, 52, 55, 59, 60, 64]; GMAJ7 = [43, 50, 54, 59, 62]; GMAJ9 = [43, 50, 54, 57, 59]; G6 = [43, 50, 55, 59, 64]; B7SUS4 = [47, 52, 54, 57, 64]
B7 = [47, 51, 54, 57, 63]; FMAJ7 = [41, 48, 52, 57, 60]; FMAJ9 = [41, 48, 52, 55, 57, 64]; D69 = [38, 45, 52, 54, 59]; DSUS2 = [38, 45, 50, 52, 57]
DMAJ9 = [38, 45, 54, 57, 61, 64]; DMAJ7 = [38, 45, 54, 57, 61]; BM9 = [47, 54, 57, 61, 62]; BM7 = [47, 54, 57, 62, 66]; A7SUS = [45, 52, 55, 57, 62]
DM9 = [38, 45, 53, 57, 60, 64]; GSUS4 = [43, 50, 55, 60, 62]; GMAJ = [43, 50, 55, 59, 62]; ASUS2 = [45, 52, 57, 59, 64]; AADD9 = [45, 52, 57, 59, 61, 64]
B9SUS = [47, 54, 57, 61, 64]; EMAJ9 = [40, 47, 56, 59, 63, 66]
# where her doors are across the frame (src/plan.js: M6_RX, and each door's middle), and her four roles, in their order there
DX = [635, 990, 1345, 1700]; ROLES4 = ['student', 'alumna', 'tutor', 'researcher']


# 1. What stays in the house: E minor. The book's cord unwound and its board lifted and set down; its name; the fire on its altar while
#    it's on screen, and the teacher's arms as he gives the oath; the oath's leaf, its line written in, and its note; then the village:
#    the healer's steps along the street, the door unlatched and opening on its light, a step inside; "to heal"; a step out, the door
#    swung shut and latched behind him, and his steps on along the street; the series' mark under the title
J = 'house'; B = C(J, 'breath')
tBook, tCS, tFire, tGave, tLine, tPec = C(J, 'book'), W(J, 'book', 'Charaka Samhita'), C(J, 'fire'), W(J, 'fire', 'gave it'), C(J, 'line'), W(J, 'line', 'the peculiar')
tHome, tHeal, tStays, tPur = C(J, 'home'), W(J, 'home', 'to heal'), C(J, 'stays'), C(J, 'purpose')
bed([(S0(J), EM9), (C(J, 'fire', -0.3), CMAJ7), (C(J, 'line', -0.3), AM9), (C(J, 'home', -0.3), GMAJ7), (C(J, 'stays', -0.2), CMAJ9),
     (C(J, 'purpose', -0.3), AM7), (W(J, 'purpose', 'for every', -0.3), B7SUS4), (B + 0.3, EM9)], E(J) - 0.9)
cloth(tBook + 0.3, 0.7, 0.0156, P(820))
board(tBook + 0.85, 0.016, P(990)); wood(tBook + 2.48, 0.018, P(990), 150)
tag(tCS, 0.02, 0.0)
fire(tFire - 1.0, tHome - 0.4, 0.048, -0.15)
cloth(tGave - 0.2, 0.9, 0.013, -0.4)
card(tLine - 0.3, 0.024, 0.0, 0.5)
graphite(tPec, 1.9, 0.016, -0.15); graphite(tPec + 1.95, 0.85, 0.016, 0.05)
tag(tPec + 3.0, 0.0175, P(1500))
VK = [[0, 640, 560, 1.14], [tStays - 0.6, 860, 560, 1.08], [tPur + 0.6, 960, 540, 1]]  # the village's camera
tw0, tArr, tOut, tW2 = tHome - 1.7, tHeal - 0.2, tStays - 1.3, tStays + 0.4; dc = 635; sp = (dc + 140) / (tArr - tw0)
fall = [38 * (np.pi / 2 + k * np.pi) for k in range(-1, 17)]  # where his feet land: the walk's phase is x/38 (past.js, m6_oldBody)
tin = [tw0 + (x + 140) / sp for x in fall if x < dc]
steps(tin, 0.0128, [Pc(x, t0, VK) for x, t0 in zip(fall, tin)])
latch(tArr - 0.72, 0.016, Pc(dc + 60, tArr, VK)); swing(tArr - 0.7, 0.8, 0.0196, Pc(dc, tArr, VK))
steps([tArr + 0.25], 0.0088, [Pc(dc, tArr, VK)])
tag(tHeal, 0.0175, Pc(dc, tHeal, VK))
steps([tOut + 0.35], 0.0096, [Pc(dc, tOut, VK)])
swing(tStays + 0.05, 0.7, 0.0168, Pc(dc, tStays, VK)); shut(tStays + 0.68, 0.0176, Pc(dc, tStays, VK))
tout = [(x, tW2 + (x - dc) / sp) for x in fall if dc < x < 1990]
steps([t0 for x, t0 in tout], 0.012, [Pc(x, t0, VK) for x, t0 in tout])
mark(B + 0.8)

# 2. An appeal. Owen's card; the appeal, on the donor's note, and the request typed into it; the results, on the student's
#    note, and the line to them; "given for teaching and awards" in a hand outside the data; the pencil round the empty tag; the list
#    lifted off the results and set down on the appeal
J = 'appeal'
tAdv, tPlan, tTop, tAsk, tReg, tYr = W(J, 'today', 'Advancement'), W(J, 'today', 'plans an appeal'), C(J, 'top'), W(J, 'top', 'asks the registry'), W(J, 'top', 'the registry'), W(J, 'top', "this year's")
tTeach, tNoth, tList = W(J, 'given', 'to teach them'), W(J, 'goes', 'nothing in the data'), W(J, 'goes', 'the list goes')
card(tTop, 0.022, P(290))
card(tPlan - 0.2, 0.028, P(930)); harp_(DONOR, tPlan - 0.1, 0.028, P(930))
keys(tAsk - 0.1, 1.4, 0.022, P(820), 7)
card(tReg - 0.2, 0.028, P(1580)); role('student', tReg - 0.1, 0.03, P(1580))
air(tYr + 0.2, 0.8, 0.016, P(1240))
graphite(tTeach - 0.2, 1.4, 0.0176, P(1560))
ringp(tNoth - 0.1, 0.8, 0.0192, P(1740))
air(tList - 0.1, 1.2, 0.018, P(1180)); card(tList + 0.95, 0.022, P(780), 0.3)

# 3. A wish left behind. The appeal's email set down, and who it goes to typed in; her student record, on the
#    student's note; the email carried across to her and buzzing in her hand, its new "to:" typed in; her alumni record, on the
#    alumna's note, and the note pinned to it; the pencil line towards the student record, and its cross; the line that links them, its
#    tag, and the pencil round the note
J = 'wish'
tEm, tGoes, tLinh, tAs = W(J, 'month', "the appeal's email"), W(J, 'month', 'goes to'), W(J, 'reaches', 'Linh'), W(J, 'reaches', 'as a student')
tGrad, tAsk, tNev, tLk, tOne = W(J, 'said', 'graduated'), W(J, 'said', 'not to ask'), W(J, 'kept', 'never heard'), C(J, 'linked'), W(J, 'linked', 'the wish was')
card(tEm - 0.3, 0.026, P(1550)); keys(tGoes, 0.9, 0.02, P(1450), 6)
card(tAs - 0.4, 0.024, P(1550)); role('student', tAs - 0.3, 0.03, P(1550))
air(tLinh - 0.2, 1.2, 0.018, P(1000)); buzz(tLinh + 1.0, 0.007, P(400))
keys(tAs + 0.1, 0.9, 0.02, P(780), 6)
card(tGrad - 0.2, 0.024, P(1550)); role('alumna', tGrad - 0.1, 0.028, P(1550))
card(tAsk, 0.018, P(1600), 0.35); tag(tAsk + 0.7, 0.015, P(1600))
graphite(tNev - 0.1, 0.9, 0.0176, P(1626)); crossp(tNev + 0.8, 0.021, P(1626))
air(tLk - 0.1, 0.7, 0.016, P(1320)); tag(tLk + 0.5, 0.0175, P(1180))
ringp(tOne - 0.1, 0.9, 0.0192, P(1600))

# 4. What each role is for. Linh in white paper, on the person's notes; her four records set down, each ringing
#    its role's note; each purpose tagged on its door as it's named; the list of purposes, and the pencil round its owner and date; the
#    rule's tag; the appeal's request, on the donor's note, carried from door to door: knocking at the student's, the alumna's unlatched
#    and opening on her note, knocking at the tutor's and the researcher's
J = 'purposes'
tOath, tOne, tOwn, tRule, tOnly, tWr, tDoor, tNo = W(J, 'each', 'its own oath'), W(J, 'list', 'one list'), W(J, 'list', 'an owner'), C(J, 'rule'), W(J, 'rule', 'only for'), W(J, 'rule', 'written on it'), W(J, 'open', "alumna's door"), W(J, 'open', 'and no other')
person(S0(J) + 0.3, 0.026, P(205))
for i, r in enumerate(ROLES4):
    card(tOath + i * 0.2, 0.012, P(DX[i])); role(r, tOath + i * 0.2 + 0.1, 0.026, P(DX[i]))
for i, ws in enumerate([[('student', 'teaching'), ('student', 'awards')], [('alumna', 'news'), ('alumna', 'events'), ('alumna', 'fundraising')], [('tutor', 'employment')], [('researcher', 'her project')]]):
    for lid, word in ws:
        tag(W(J, lid, word), 0.0163, P(DX[i] - 10))
card(tOne - 0.3, 0.024, P(1167), 0.5)
ringp(tOwn - 0.1, 0.8, 0.0192, P(920))
tag(tOnly - 0.2, 0.0175, P(1165))
card(tRule - 0.3, 0.016, P(205), 0.3); harp_(DONOR, tRule - 0.2, 0.024, P(205))
kS, kA, kT, kR = tWr + 0.1, tDoor, tNo + 0.45, tNo + 1.25
for k0, x in zip((kS, kA, kT, kR), DX):
    air(k0 - 0.7, 0.7, 0.01, P(x - 170))
knock(kS, 0.03, P(DX[0])); knock(kT, 0.0275, P(DX[2])); knock(kR, 0.0275, P(DX[3]))
latch(kA + 0.1, 0.016, P(DX[1] + 60)); swing(kA + 0.15, 0.9, 0.0196, P(DX[1])); role('alumna', kA + 0.35, 0.026, P(DX[1]))

# 5. Wishes on the person. The note lifted off her alumni record and carried to her, set on her on the person's notes; opened
#    into its fields, each written in; her no swings the alumna's door shut, and the pencil latch holds it; the request carried back to
#    it, and knocking; the rail from the note on her, to that door, then on to every door, each with its latch; the tag; the pencil
#    round her settings
J = 'wishes'
tOn, tData, tCl, tAlD, tHo, tWh, tUnt = C(J, 'on'), C(J, 'data'), C(J, 'closes'), W(J, 'closes', "the alumna's door"), C(J, 'holds'), W(J, 'holds', 'wherever she appears'), W(J, 'holds', 'until she changes')
tF = [W(J, 'data', s) for s in ('what she asked', 'for which purpose', 'when', 'to whom', 'how to change')]
card(tOn + 0.3, 0.016, P(1010), 0.3); air(tOn + 0.35, 1.2, 0.016, P(600)); tag(tOn + 1.55, 0.0175, P(208)); person(tOn + 1.5, 0.026, P(208))
card(tData - 0.3, 0.022, P(235), 0.6)
graphite(tF[0] - 0.1, 0.35, 0.0176, P(110)); tag(tF[1] - 0.1, 0.0163, P(220))
for t0, n in zip(tF[2:], (5, 7, 7)):
    keys(t0 - 0.05, 0.6, 0.018, P(200), n)
swing(tAlD - 0.1, 0.8, 0.0196, P(DX[1])); shut(tAlD + 0.62, 0.0176, P(DX[1]))
graphite(tAlD + 0.4, 0.5, 0.0176, P(1120)); latch(tAlD + 0.88, 0.012, P(1130))
air(tCl, 0.9, 0.01, P(1350)); knock(tAlD + 1.1, 0.0275, P(DX[1]))
graphite(tCl - 0.1, 1.1, 0.016, P(760)); graphite(tCl + 1.2, 0.4, 0.0144, P(1167)); graphite(tHo - 0.1, 1.2, 0.016, P(1520))
for i, (dr, dl) in ((0, (-0.6, -0.2)), (2, (-0.3, 0.1)), (3, (0.0, 0.4))):
    graphite(tWh + dr, 0.4, 0.0128, P(DX[i] + 177)); graphite(tWh + dl, 0.5, 0.0144, P(DX[i] + 135)); latch(tWh + dl + 0.48, 0.01, P(DX[i] + 135))
tag(tWh + 0.3, 0.0175, P(1165))
ringp(tUnt, 0.8, 0.0192, P(216))

# 6. Written into the platform. Jun's card; the model's YAML set down and typed in; the test set down, its cross and what it
#    found typed in; the missing line typed, and the test's tick; the two policies set down and typed, one a little after the other;
#    the table, the wash over its grades, the red lines through the rows of those who said no, and the rows closing up; each table the
#    policies reach, and its chip; the tag
J = 'platform'
tJun, tYaml, tTest, tFails, tNoP = W(J, 'tags', 'Jun writes'), W(J, 'tags', 'transformed'), C(J, 'test'), W(J, 'test', 'fails'), W(J, 'test', 'has no purpose')
tTwo, tMask, tTagged, tLeaves, tEvery = W(J, 'policy', 'two policies'), C(J, 'mask'), W(J, 'mask', 'tagged for teaching'), W(J, 'filter', 'leaves out'), W(J, 'once', 'every table')
fix = tNoP + 0.6
card(tJun, 0.02, P(220))
card(tYaml - 0.4, 0.026, P(830), 0.5); keys(tYaml + 0.1, 2.3, 0.02, P(780), 14)
card(tTest - 0.2, 0.024, P(1565))
crossp(tFails, 0.021, P(1300)); keys(tFails + 0.36, 0.9, 0.018, P(1460), 7)
keys(fix, 0.7, 0.02, P(760), 5); tickp(fix + 1.2, 0.021, P(1300))
card(tTwo + 0.1, 0.024, P(795), 0.5); card(tTwo + 0.5, 0.024, P(1525), 0.5)
keys(tTwo + 0.3, 1.4, 0.018, P(760), 9); keys(tTwo + 0.7, 1.4, 0.018, P(1490), 9)
card(tMask - 0.2, 0.026, P(1160), 0.5)
wash_(tTagged, 0.8, 0.014, P(1687))
strike(tLeaves - 0.1, 0.65, 0.016, P(1140)); card(tLeaves + 1.0, 0.012, P(1160), 0.6)
for i in range(3):
    t0 = tEvery - 0.3 + i * 0.25; air(t0, 0.6, 0.01, P(700 + i * 460)); tag(t0 + 0.3, 0.0175, P(700 + i * 460))
tag(tEvery + 0.8, 0.0175, P(1160))

# 7. The appeal, again. The appeal's count set down; the alumni's record; the request, on the donor's note, carried to its
#    door, which unlatches and opens on the alumna's note; the count riffling up to 2,140, and its list set down; those who said no
#    taken off, the red lines through their names, and their tags; the pencil round Linh's; who it will ask; the results' record, on the
#    student's note, the request carried to its door, knocking, and the door staying shut
J = 'again'; B = C(J, 'breath')
tNext, tAlu, tAllow, tSels, tOff, tBec, tSits, tLinh, tRes, tStay = C(J, 'next'), W(J, 'next', 'goes to alumni'), W(J, 'next', 'as their role'), W(J, 'select', 'selects'), C(J, 'off'), W(J, 'off', 'because'), W(J, 'off', 'sits on the person'), W(J, 'off', 'Linh is one'), C(J, 'results'), W(J, 'results', 'stay with teaching')
card(tNext - 0.2, 0.026, P(430))
card(tAlu - 0.2, 0.024, P(1025))
harp_(DONOR, tAllow - 0.85, 0.022, P(760)); air(tAllow - 0.9, 0.7, 0.01, P(900))
latch(tAllow + 0.15, 0.016, P(1085)); swing(tAllow + 0.2, 0.9, 0.0196, P(1025)); role('alumna', tAllow + 0.4, 0.026, P(1025))
riffle(tSels, 1.6, 0.0176, P(600)); card(tSels + 0.3, 0.022, P(430))
tag(tOff + 0.25, 0.02, P(650))
strike(tBec, 0.75, 0.014, P(240)); strike(tBec + 0.15, 0.75, 0.012, P(260))
tag(tBec + 0.45, 0.015, P(700)); tag(tBec + 0.6, 0.015, P(700))
ringp(tLinh, 0.8, 0.0192, P(230))
seal(tSits + 0.3, 0.013, P(430))
card(tRes - 0.4, 0.024, P(1645)); role('student', tRes - 0.3, 0.028, P(1645))
air(tStay + 0.05 - 0.7, 0.7, 0.01, P(1340)); knock(tStay + 0.05, 0.0275, P(1645))

# 8. What do you hold about me? Mei's card; Linh's request set down; four drawers pulled out, one in each office that
#    used to search; the person in white paper, on her notes, and a line to each record, each on its role's note (the student's twice,
#    for two student records); the answer set down, its sections typed in and their sources tagged; the correction's red line, and the
#    pencil round the office that keeps it; the date it was answered; what each role would keep, a tag each; the pencil round her
#    degree and her project's data
J = 'request'
tAsks, tFour, tPers, tLinks, tSrc, tOff = W(J, 'asks', 'asks the university'), W(J, 'used', 'four offices'), W(J, 'now', 'the person'), W(J, 'now', 'the links'), C(J, 'source'), W(J, 'fix', 'the office')
tReady, tKeep, tDeg, tProj = W(J, 'days', 'ready in days'), W(J, 'forget', 'keep only'), W(J, 'must', 'Her degree'), W(J, 'must', "her project's data")
card(S0(J) + 0.6, 0.02, P(220))
card(tAsks - 0.3, 0.028, P(930))
for i, x in enumerate([805, 1165, 805, 1165]):
    drawer(tFour - 0.3 + i * 0.18, 0.0154, P(x))
person(tPers - 0.1, 0.026, P(592))
for i, r in enumerate(['student', 'student', 'alumna', 'tutor', 'researcher']):
    air(tLinks + i * 0.22, 0.6, 0.007, P(700)); role(r, tLinks + i * 0.22 + 0.35, 0.022, P(990))
card(tSrc - 0.3, 0.028, P(1571), 0.6)
for i in range(4):
    keys(tSrc - 0.2 + i * 0.55 + 0.15, 0.6, 0.016, P(1420), 4); tag(tSrc - 0.2 + i * 0.55 + 0.5, 0.0137, P(1800))
graphite(tOff - 0.4, 0.8, 0.0192, P(1180)); ringp(tOff, 0.8, 0.0192, P(860))
seal(tReady - 0.1, 0.012, P(1700))
for i in range(5):
    tag(tKeep - 0.2 + i * 0.22, 0.0175, P(1560))
ringp(tDeg, 0.8, 0.0192, P(1450)); ringp(tProj, 0.8, 0.0192, P(1560))

# 9. Elsewhere. The two panels; the loyalty card's data, and its tag; the credit check, its request carried to the door
#    and knocking; the patient's consent for study A, and its tag; study B's request, on the researcher's note, knocking at study A's
#    door; asked, a consent for study B, its tag, and its own door unlatched and opening
J = 'elsewhere'
tE, tDisc, tCred, tOne, tNext, tAg = C(J, 'every'), W(J, 'shop', 'for discounts'), W(J, 'shop', 'who gets credit'), W(J, 'hospital', 'one study'), C(J, 'next'), W(J, 'next', 'asks again')
for i, x in enumerate([490, 1430]):
    card(tE - 0.2 + i * 0.25, 0.024, P(x), 0.5)
card(tE + 0.1, 0.016, P(305)); harp_(66, tE + 0.2, 0.022, P(305))
card(tE + 0.35, 0.016, P(1225)); harp_(59, tE + 0.45, 0.022, P(1225))
tag(tDisc, 0.0175, P(305))
card(tCred - 0.9, 0.022, P(705)); kC = tCred + 0.5
air(kC - 0.7, 0.7, 0.01, P(500)); knock(kC, 0.0275, P(305))
tag(tOne, 0.0175, P(1225))
harp_(ROLE['researcher'], tNext - 0.25, 0.02, P(1635)); kA = tNext + 0.6
air(kA - 0.7, 0.7, 0.01, P(1430)); knock(kA, 0.0275, P(1225))
card(tAg, 0.022, P(1635)); tag(tAg + 0.5, 0.0175, P(1635)); kB = tAg + 1.3
air(kB - 0.7, 0.7, 0.01, P(1430)); latch(kB + 0.12, 0.016, P(1695)); swing(kB + 0.15, 0.9, 0.0196, P(1635)); harp_(ROLE['researcher'], kB + 0.35, 0.024, P(1635))

# 10. For this purpose only. The house, its door shut on its light; Linh in white paper and her four doors, shut,
#     on the person's notes and each role's; the pencil round the note on her; the last line, on its own; then
#     E major on the end card, and the series' mark
J = 'only'; B = C(J, 'breath')
tKeeps, tWish, tLine = C(J, 'keeps'), W(J, 'keeps', "Linh's wishes"), C(J, 'line')
bed([(B + 0.3, EMAJ9)], TOT + 1.0)
person(tKeeps - 0.1, 0.026, P(205))
for i, r in enumerate(ROLES4):
    role(r, tKeeps + 0.15 + i * 0.15, 0.022, P(DX[i]))
ringp(tWish, 0.8, 0.0192, P(286))
mark(B + 1.0)

# The turns. After the opening, the music comes in at each chapter's turn, in the pause between its last line and the next chapter's
# first, on the next chapter's chord: E minor as the email goes out, C as the university writes its own oath, A minor for her wishes,
# D for the platform, G for the appeal again, A minor for her request, B minor for elsewhere and E minor for the end. The appeal's
# numbers settle on G, in the pause without words that ends chapter 7.
for a, b, ch in [('appeal', 'wish', EM9), ('wish', 'purposes', CMAJ9), ('purposes', 'wishes', AM9), ('wishes', 'platform', DMAJ9),
                 ('platform', 'again', GMAJ9), ('request', 'elsewhere', BM7), ('elsewhere', 'only', EM9)]:
    turn(ch, last_end(a), first(b))
turn(G6, last_end('again'), E('again') - 0.6); turn(AM9, E('again') - 0.9, first('request'))
