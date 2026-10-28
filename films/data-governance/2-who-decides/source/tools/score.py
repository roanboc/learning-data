# Who decides: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for this film (PLAYBOOK.md: vary the sound itself; the series' organ and timpani, brass and music box, recorders and
# marimba, felt piano, strings and clarinet, glass harmonica and handbells, harp and celesta, viola, flugelhorn and double bass,
# guitar, electric piano and flute, and double reeds are left to the films that have them): a cello and a vibraphone, both made here
# (music.py has neither), each standing for one thing, as the film's colours do:
#  - The vibraphone, its motor off so nothing trembles, struck softly with yarn mallets, is a call. It means the same all through.
#    A call is the key's fifth, and it's answered by the note a fourth above, home: on the line, a lamp lights and the supervisor
#    comes; at the university, Jun's slip names Mei and she has it in her hands. A gap is home falling a semitone, and left there:
#    "TBC" in the register, the sheet sent back, a name in a spreadsheet with no time behind it. A gap filled rises from that note,
#    home and on to the third: the names confirmed, Clara signs, the time given back. At the very end Mei's question is a call
#    with no answer yet.
#  - The cello is a person who answers or decides. Bowed and close, it comes in when someone comes to help on the line, and at the
#    university at a chapter's turn, under the moment someone answers. Plucked, low and soft, it walks with the engine line while the
#    line moves, and stops when it stops.
#  - The series' mark, 1-5-4-8, plays on the cello, with the vibraphone an octave above it, under the title and the end card.
# G mixolydian for the engine line in 1960s Japan (no borrowed Japanese instruments or scales: the story is told in the series' own
# voice); E-flat major for the university today. The turn comes as "a right to decide about data needs the same": the cello holds
# G, the note the two keys share, while the bass falls a major third to E-flat.
# The series' sound (decided with the master data films, 20 October 2026; tools/quiet.py checks it):
#  - Music under the opening, then only from time to time, never as a bed under the voice: after the opening no chapter has music for
#    more than half its length, or for 12 seconds without a break.
#  - Nothing tense, trembling or pulsing: no urgent pulse, not even when the line stops; no tremolo; a slight vibrato on the upper
#    cello only, coming in late, and none on a note held under others.
#  - Nothing beats on a phone's one speaker: every note is tuned just, a whole-number ratio of G, and the two keys share G, C, D and F
#    exactly, so a note held across the turn stays in tune; no chord holds a fifth that isn't pure (G mixolydian never sounds A and E
#    together, nor F and C; E-flat never sounds F minor).
#  - Nothing loops. Where the picture repeats (lamps, names written, pins), the sound plays the first round, the rest softer.
#  - Every effect is something on screen, at the moment it appears, timed like the picture in src/scenes.js (the same word and the
#    same offset), so sound and picture stay together when the voice is re-timed: the line's low murmur while it moves, a cord's
#    wooden handle, a button, a low tock as a lamp lights, a part pushed home, a binder's cover, paper, a pen, a marker, pins, a paper
#    clip, rubber stamps, and a soft knock as a card, a speech bubble or a request arrives, all below about 2.5 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# Before the voice is recorded, a line lasts as long as the film itself estimates (engine3.js: 2.7 words a second, at least 1.3 s)
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR = _obj('narration.js')
_DUR = _obj('vodur.js') if (_pl.Path('src') / 'vodur.js').exists() else \
    {sid + '/' + v['id']: max(1.3, len(v['text'].split()) / 2.7) for sid, sc in _NARR.items() for v in sc['vo']}
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def E_(sid, lid, off=0):
    """when a line ends (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off
R2 = np.random.default_rng(2)  # this film's own randomness: the players' small unevenness

# ---- tuning: just, over G. G mixolydian's notes are G's own ratios; E-flat major's are E-flat's (4/5 of G), which makes them the
# same G, C, D and F, so the two keys share four notes exactly
JUST = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    """a MIDI note's pitch, just, over G3 = 196 Hz"""
    o, d = divmod(m - 55, 12); return 196.0 * JUST[d] * 2 ** o
# the notes, by name (MIDI numbers)
Eb2, F2, G2, A2, B2, C3, D3, E3, Eb3, F3 = 39, 41, 43, 45, 47, 48, 50, 52, 51, 53
G3, Ab3, A3, Bb3, B3, C4, D4, Eb4, E4, F4, G4, Ab4, Bb4, C5, Eb5 = 55, 56, 57, 58, 59, 60, 62, 63, 64, 65, 67, 68, 70, 72, 75

# ---- this film's instruments ----
def vib(m, start, g=0.045, pan=0.15, until=None):
    """the vibraphone, its motor off: an aluminium bar struck with a soft yarn mallet. Its note, swelling a moment as the resonator
    under the bar takes it up; its partial two octaves above (tuned so, as a vibraphone's bars are), gone in a moment; and the mallet's
    soft touch. The pedal is down: a low bar rings for seconds, a high one less, and nothing trembles. until: when the pedal lifts,
    and the note is damped"""
    f = hz(m); lo = max(0.0, np.log2(f / 174.6)); d1 = 0.5 + 0.38 * lo; sec = min(7.0, 5.5 / d1)
    if until is not None:
        sec = max(0.4, min(sec, until - start + 0.3))
    x = tt(sec)
    s = np.sin(2 * np.pi * f * x) * np.exp(-x * d1) * (1 + 0.3 * (1 - np.exp(-x * 30)))
    if 4 * f < 2400:
        s = s + 0.26 * np.sin(2 * np.pi * 4 * f * x + 0.4) * np.exp(-x * (3 * d1 + 2.2))
    s = s * np.minimum(1, x / 0.003) + 0.05 * filt(noise(sec), 'band', (0.6 * f, min(2.5 * f, 1800)))[:len(x)] * np.exp(-x * 140)
    put(norm(filt((s * env(sec, 0.001, 0.3 if until is not None else 0.6)).astype(np.float32), 'low', 2400)), start, g, pan)
def roll(notes, s, g=0.04, gap=0.07, pan=0.15):
    """a chord on the vibraphone, its notes struck one after another from the lowest, each a little softer"""
    for i, m in enumerate(notes):
        vib(m, s + i * gap * (0.85 + 0.3 * R2.random()), g * (1 - 0.08 * i), pan + 0.06 * i)
BODY = ((205, 1.0, 70), (290, 0.7, 60), (420, 0.9, 140), (620, 0.6, 170), (1000, 0.4, 300))  # the cello's body: (Hz, weight, width)
def _body(fr):
    """how much of a harmonic at fr the cello's body sends out: little below 150 Hz, most from 200 to 450, some round 1 kHz"""
    return (fr / (fr + 140)) * (0.2 + sum(w * np.exp(-((fr - c) / bw) ** 2 / 2) for c, w, bw in BODY))
def _waver(sec, rate, depth):
    """a slow, uneven wavering, as a bow never holds quite still: random points rate times a second, joined smoothly"""
    n = int(sec * rate) + 4; pts = np.convolve(R2.standard_normal(n + 2), (0.25, 0.5, 0.25), 'valid')
    return (1 + depth * np.interp(np.arange(int(sec * SR)) * rate / SR, np.arange(n), pts)).astype(np.float32)
def cello(m, start, sec, g=0.036, pan=-0.15, vb=0.0, att=0.35, rel=0.8):
    """a cello, bowed softly and close: every harmonic of a bowed string, each wavering a little on its own, sent out by the body's
    resonances (so, with a vibrato, each harmonic swells and dips as it moves across them), a little of the bow's hair on the string,
    and the bow's pressure breathing slowly. A note that starts quickly (att under 0.2 s) has the bow's soft bite. vb is a slight
    vibrato that comes in late, for the upper cello; a note held under others plays straight, so its harmonics meet theirs exactly"""
    f = hz(m); x = tt(sec); n = len(x)
    fi = f * (1 + vb * np.sin(2 * np.pi * 5.0 * x + 1.1) * np.clip((x - 0.45) / 0.8, 0, 1)) if vb else np.full(n, f, np.float32)
    ph = 2 * np.pi * np.cumsum(fi) / SR; c = np.arange(0, n, 441); fc = fi[c]
    s = np.zeros(n, np.float32)
    for k in range(1, 40):
        if f * k > 2300:
            break
        a = np.interp(np.arange(n), c, _body(fc * k)) if vb else _body(f * k)
        s = s + (a / k ** 0.85) * _waver(sec, 3.0 + 0.7 * (k % 3), 0.05) * np.sin(k * ph + 0.9 * k)
    s = norm(s) + 0.01 * filt(noise(sec), 'band', (min(1.5 * f, 900), 2100))[:n]
    if att < 0.2:
        s = s + 0.05 * filt(noise(sec), 'band', (700, 2000))[:n] * np.exp(-x * 30)
    s = s * (1 + 0.05 * np.sin(2 * np.pi * 0.21 * x + 0.6))
    put(norm(filt((s * env(sec, att, rel)).astype(np.float32), 'low', 2000)), start, g, pan)
def pizz(m, start, g=0.03, pan=-0.22):
    """the cello plucked, low and soft, with the side of a finger: a round note that fades in a second or so, its upper harmonics
    first, and the body's thump at its own pitch"""
    f = hz(m); sec = 1.8; x = tt(sec); d1 = 1.5 + 0.4 * max(0.0, np.log2(f / 65.4)); s = np.zeros_like(x)
    for k in range(1, 16):
        if f * k > 1800:
            break
        s = s + abs(np.sin(np.pi * k * 0.2)) / k ** 1.3 * np.sin(2 * np.pi * f * k * x + 0.3 * k) * np.exp(-x * (d1 + 2.4 * (k - 1)))
    th = f if f < 130 else f / 2
    s = s * np.minimum(1, x / 0.003) + 0.3 * np.sin(2 * np.pi * th * x) * np.exp(-x * 30)
    put(norm(filt((s * env(sec, 0.001, 0.3)).astype(np.float32), 'low', 1600)), start, g, pan)
def walk(spans, chords, step=1.32, g=0.03):
    """the line moving: the cello plucked once a step through each span (spans: [(from, to)]), round the notes of the chord in force
    (chords: [(from, [notes])]), resting at the end of each phrase of eight, so it walks rather than ticks"""
    for a, b in spans:
        t, i = a, 0
        while t < b - 0.2:
            ch = [n for s, n in chords if s <= t + 1e-6][-1]
            if i % 8 != 7:
                pizz(ch[i % len(ch)], t + 0.015 * R2.standard_normal(), g * (1.0 if i % 4 == 0 else 0.82) * (0.88 + 0.12 * R2.random()))
            t += step * (0.97 + 0.06 * R2.random()); i += 1
def turn(s, lo, hi, g=0.032):
    """the two cellos at a chapter's turn: the lower holds its note, straight; the upper moves through its notes (hi: [(note, seconds)])
    with a slight vibrato; both swell in and fade"""
    sec = sum(d for _, d in hi) + 1.6
    cello(lo, s, sec, g * 0.8, -0.32, 0.0, 0.7, 1.4)
    t = s + 0.3
    for i, (m, d) in enumerate(hi):
        last = i == len(hi) - 1
        cello(m, t, d + (1.3 if last else 0.18), g, -0.08, 0.0018, 0.45 if i == 0 else 0.14, 1.2 if last else 0.22)
        t += d
def call(s, g=0.045, key='Eb'):
    """a call: the key's fifth"""
    vib(D4 if key == 'G' else Bb3, s, g)
def answer(s, g=0.045, key='Eb'):
    """its answer: home, a fourth above"""
    vib(G4 if key == 'G' else Eb4, s, g)
def gap(s, g=0.04):
    """a gap: home, falling a semitone, and left there"""
    vib(Eb4, s, g); vib(D4, s + 0.42, g * 0.92)
def filled(s, g=0.042, until=None):
    """a gap filled: from that note, home and on to the third"""
    for i, m in enumerate((D4, Eb4, G4)):
        vib(m, s + 0.3 * i, g * (0.85 + 0.075 * i), 0.15, until)
def mark(s, g=0.06):
    """the series' four notes, 1-5-4-8, in E-flat: the cello, bowed and singing, with the vibraphone an octave above it"""
    for i, iv in enumerate([0, 7, 5, 12]):
        cello(51 + iv, s + i * 0.48, 0.66 if i < 3 else 3.0, g * 0.8, -0.1, 0.0015 if i < 3 else 0.0024, 0.06, 0.22 if i < 3 else 1.3)
        vib(63 + iv, s + i * 0.48, g * 0.5, 0.18)

# ---- soft sounds, all below about 2.5 kHz. A pen or a key is fainter than a knock, so each kind has its own level, to sit about 25 to
# 32 dB under the voice: heard in a pause, there under a line, never over it
PEN, LOUD = 1.7, 1.4  # a pen's strokes, and the things that arrive (cards, stamps, pins, a cord, a lamp), each against a knock
def knock(s, g=0.024, pan=0.0, f=260):
    """a soft wooden knock: a card, a tag or a speech bubble arriving, a request reaching someone"""
    s_knock(s, LOUD * g, pan, f)
def tap(s, g=0.014, pan=0.0):
    """a muffled key, or a click"""
    s_tap(s, g, pan)
def paper(s, g=0.024, pan=0.0, sec=0.45):
    """paper, softly: filtered noise that swells and fades"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (250, 2000)), 'low', 2200)[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, LOUD * g, pan)
def slide(s, g=0.02, pan=0.0, sec=0.7):
    """a sheet slid across a desk: a long, low hush"""
    x = tt(sec); X(filt(noise(sec), 'band', (180, 1300))[:len(x)] * np.sin(np.pi * x / sec) ** 1.4, s, LOUD * g, pan)
def stroke(s, sec=0.2, g=0.013, pan=0.0, lo=650, hi=1900):
    """one stroke of a pen on paper: grit, swelling and fading"""
    x = tt(sec); X(filt(filt(noise(sec), 'band', (lo, hi)), 'low', 2200)[:len(x)] * np.sin(np.pi * x / sec) ** 0.6 * (0.75 + 0.25 * np.sin(2 * np.pi * 23 * x + 1.3)), s, PEN * g, pan)
def pen(s, sec=0.8, g=0.013, pan=0.0, lo=650, hi=1900):
    """writing: short strokes, each a little different"""
    t = 0.0
    while t < sec - 0.05:
        d = 0.05 + 0.09 * R2.random(); stroke(s + t, d, g * (0.6 + 0.4 * R2.random()), pan, lo, hi); t += d + 0.02 + 0.05 * R2.random()
def marker(s, sec=0.8, g=0.012, pan=0.0):
    """a marker on a board or on glass: rounder strokes, and lower"""
    pen(s, sec, g, pan, 300, 1200)
def tick(s, g=0.013, pan=0.0):
    """a tick: down, then up and longer"""
    stroke(s, 0.05, g * 0.8, pan); stroke(s + 0.06, 0.11, g, pan)
def pin(s, g=0.026, pan=0.0):
    """a push pin into cork: a small, dull tuck"""
    s_knock(s, LOUD * g, pan, 360); s_tap(s + 0.004, LOUD * g * 0.5, pan)
def rubber(s, g=0.042, pan=0.0):
    """a rubber stamp on paper: a padded thump, and the paper under it"""
    x = tt(0.25); X(norm((np.sin(2 * np.pi * 120 * x) * np.exp(-x * 22) + 0.5 * filt(noise(0.25), 'band', (200, 1200))[:len(x)] * np.exp(-x * 45)).astype(np.float32)), s, LOUD * g, pan)
def clip(s, g=0.018, pan=0.0):
    """a paper clip slid on: a small, dull snap of wire"""
    x = tt(0.14)
    X(norm(filt((np.sin(2 * np.pi * 1150 * x) * np.exp(-x * 70) + 0.5 * np.sin(2 * np.pi * 1730 * x) * np.exp(-x * 90)
                 + 0.6 * filt(noise(0.14), 'band', (400, 2000))[:len(x)] * np.exp(-x * 160)).astype(np.float32), 'low', 2200)), s, LOUD * g, pan)
    s_tap(s + 0.03, LOUD * g * 0.6, pan)
def cover(s, sec=1.0, g=0.022, pan=0.0):
    """a binder's cover swung open and laid down: air, then a soft, flat thud"""
    s_air(s, sec * 0.8, g * 0.7, pan, 160, 900); s_knock(s + sec, LOUD * g, pan, 150)
def air(s, sec=0.8, g=0.018, pan=0.0):
    """a breath of air: a card flying, a thread closing"""
    s_air(s, sec, g, pan)
def latch(s, g=0.028, pan=0.0):
    """a cord pulled: the rope through its eye, and its wooden handle's soft clack"""
    x = tt(0.16); X(filt(noise(0.16), 'band', (350, 1500))[:len(x)] * np.sin(np.pi * x / 0.16) ** 2, s - 0.14, LOUD * g * 0.45, pan)
    s_knock(s, LOUD * g, pan, 520)
def button(s, g=0.02, pan=0.0):
    """a button on a post pressed: a short, padded click"""
    s_knock(s, LOUD * g, pan, 420); s_tap(s + 0.008, LOUD * g * 0.5, pan)
def tock(s, g=0.028, pan=0.0, f=175):
    """a lamp lighting on the board above the line: a low tock"""
    s_knock(s, LOUD * g, pan, f)
def home(s, g=0.024, pan=0.0):
    """a part pushed home on an engine: a dull, low knock of metal"""
    x = tt(0.3)
    X(norm(filt((np.sin(2 * np.pi * 190 * x) * np.exp(-x * 22) + 0.5 * np.sin(2 * np.pi * 524 * x) * np.exp(-x * 35)
                 + 0.3 * filt(noise(0.3), 'band', (150, 900))[:len(x)] * np.exp(-x * 50)).astype(np.float32), 'low', 1500)), s, LOUD * g, pan)
def murmur(s0, s1, g=0.014, stops=()):
    """the engine line, far off and low, while it moves: a hum of machines under 300 Hz, never quite steady, and now and then a tool's
    soft knock somewhere along it. It fades in and out with the line's shots, and winds down when the line stops (stops: [(when it
    stops, when it goes again)])"""
    sec = s1 - s0; x = tt(sec); u = x + s0
    run = np.clip(x / 1.5, 0, 1) * np.clip((sec - x) / 1.5, 0, 1)
    for a, b in stops:
        run = run * np.where(u < a - 0.6, 1.0, np.where(u < b, np.clip((a + 0.6 - u) / 1.2, 0, 1), np.clip((u - b) / 2.0, 0, 1)))
    hum = filt(noise(sec), 'band', (45, 300))[:len(x)] * (0.78 + 0.13 * np.sin(2 * np.pi * 0.13 * x + 0.4) + 0.09 * np.sin(2 * np.pi * 0.071 * x + 2.0))
    X((hum * run).astype(np.float32), s0, g, 0.0)
    t = s0 + 1.3
    while t < s1 - 1.0:
        if all(not (a - 0.6 <= t <= b + 1.0) for a, b in stops):
            s_knock(t, g * 0.55 * (0.6 + 0.4 * R2.random()), -0.6 + 1.2 * R2.random(), 140 + 90 * R2.random())
        t += 1.7 + 2.3 * R2.random()

# ======== 1. The cord: the engine line, Japan, the 1960s ========
# The line moves: its murmur, and the cello plucked, walking with it. A worker pulls the cord: the handle's clack, a lamp's tock, and
# the call; again, softer, as the board is seen close; the supervisor comes, and the answer, the bowed cello coming in with him.
# Station 6: a button, the call and the answer, softer; then the lamp turns red and the line stops: the walk and the murmur stop, and
# the cellos hold a note that wants to move until the part is home and the line goes again. Every worker could: lamps light along the
# line, the first call clear, the rest softer. Within reach: the call, and the answer as someone who could decide comes. A right to
# decide about data needs the same: the upper cello holds G while the lower falls to E-flat; the vibraphone rolls E-flat major in the
# wordless pause, and the mark plays under the title
c1 = lambda lid, off=0: G('cord', lid, off)
find, pull, lamp = W('cord', 'cord', 'finds'), W('cord', 'cord', 'pulls', 0.1), c1('lamp')
sup, help_ = W('cord', 'lamp', 'supervisor', -0.5), W('cord', 'lamp', 'help')
s6, stop, team = c1('stops', -0.5), W('cord', 'stops', 'stops'), W('cord', 'stops', 'team')
did, reach, within, decide = c1('did', -0.4), c1('reach', -0.4), W('cord', 'reach', 'within'), W('cord', 'reach', 'someone')
data, breath, title = c1('data', -0.4), c1('breath'), c1('breath', 0.7)
seat, fixed6 = min(help_ + 1.0, c1('stops', -1.4)), c1('did', -1.2)
# when each supervisor gets there, as the film walks him (gv_walk: his distance at 250 px a second)
arrive1, arrive6, arriveR = min(sup + 3.69, seat + 0.25), s6 + 2.01, decide + 1.9
murmur(0.0, breath + 1.4, 0.014, [(stop, fixed6 + 0.3), (did + 1.9, did + 2.9)])
walk([(1.0, stop - 0.3), (fixed6 + 0.3, did + 1.8), (did + 3.0, data + 2.6)],
     [(0, [G2, D3, B2, D3]), (c1('cord'), [G2, D3, A2, D3]), (lamp, [G2, C3, E3, C3]), (fixed6, [G2, B2, D3, B2]),
      (reach, [G2, D3, A2, F3]), (data, [G2, D3, B2, G2])])
for k, a in enumerate((find - 0.15, find + 0.75)):  # the bracket won't seat: two tries
    knock(a + 0.35, 0.012 * (1 - 0.2 * k), -0.1, 300)
latch(pull + 0.3, 0.028, -0.1); tock(pull + 0.34, 0.026, -0.1)
call(pull + 0.34, 0.046, 'G'); call(lamp + 0.1, 0.028, 'G')
answer(arrive1, 0.046, 'G'); home(seat + 0.2, 0.022, -0.05)
cello(B3, arrive1 + 0.1, stop - arrive1 + 0.2, 0.03, -0.08, 0.0018, 0.6, 0.5)
# station 6: pressed, lit, answered; then red, and the line stops
button(s6 + 0.35, 0.02, 0.3); tock(s6 + 0.57, 0.022, 0.3); call(s6 + 0.57, 0.034, 'G'); answer(arrive6, 0.034, 'G')
tock(stop + 0.02, 0.024, 0.3, 150)
cello(G2, stop - 0.2, fixed6 - stop + 2.6, 0.026, -0.32, 0.0, 0.7, 1.6)
cello(A3, stop - 0.05, fixed6 - stop + 0.5, 0.028, -0.08, 0.0018, 0.4, 0.3)
cello(B3, fixed6 + 0.3, 2.6, 0.028, -0.08, 0.0018, 0.25, 1.4)
home(fixed6 + 0.3, 0.022, 0.25)
# every worker could, and they did: four lamps along the line, the fourth red as the line stops a moment
for k, (a, m, r) in enumerate(((0.3, D4, False), (0.9, B3, False), (1.4, G3, True), (3.0, A3, False))):
    t = did + a; q = 1.0 if k == 0 else 0.62
    latch(t + 0.05, 0.02 * q, [-0.7, 0.55, 0.0, -0.4][k]); tock(t + 0.06, 0.02 * q, [-0.7, 0.55, 0.0, -0.4][k])
    vib(m, t + 0.06, 0.034 * q, [-0.3, 0.4, 0.1, -0.2][k])
tock(did + 1.92, 0.018, 0.0, 150)
# within reach: the call, and someone who could decide comes at once
latch(within + 0.45, 0.026, -0.4); tock(within + 0.32, 0.024, -0.4); call(within + 0.32, 0.044, 'G')
answer(arriveR, 0.044, 'G')
# the turn: the upper cello holds G, the lower falls from G to E-flat, the key the university is in
cello(G3, arriveR + 0.15, title - arriveR + 0.05, 0.03, -0.08, 0.0016, 0.7, 1.2)
cello(G2, data + 0.3, E_('cord', 'data', -0.7) - data - 0.1, 0.024, -0.32, 0.0, 0.8, 0.5)
cello(Eb2, E_('cord', 'data', -0.75), breath - E_('cord', 'data') + 3.4, 0.026, -0.32, 0.0, 0.5, 1.8)
roll([Eb3, Bb3, Eb4, G4], breath + 0.1, 0.034)
mark(title + 0.25)

# ======== 2. To be confirmed ========
# The binder's cover; the policy's two tags; "TBC" written in red, three owners and four stewards, with the gap as the first is
# written; the thread on his screen, its four questions, and no decision
desk2, open2 = G('tbc', 'says', -0.9), G('tbc', 'says', 0.1)
three2, half2 = W('tbc', 'register', 'Three'), W('tbc', 'register', 'half')
cover(open2, 1.05, 0.022, 0.1)
knock(W('tbc', 'says', 'students', 0.05), 0.02, -0.3, 300); knock(W('tbc', 'says', 'courses', 0.05), 0.018, -0.1, 320)
for k in range(3):
    pen(three2 + 0.45 * k, 0.5, 0.013 * (1 if k == 0 else 0.75), 0.35)
for k in range(4):
    pen(half2 + 0.4 * k, 0.45, 0.009, 0.4)
gap(three2 + 0.05)
hl2, op2, none2 = W('tbc', 'thread', 'award'), W('tbc', 'thread', 'thread', 0.1), W('tbc', 'thread', 'decided', -0.1)
tap(hl2, 0.014, 0.1); tap(op2, 0.016, 0.1)
for i in range(4):
    tap(op2 + 0.32 + 0.45 * i, 0.009, -0.2 + 0.12 * i)
knock(none2 + 0.1, 0.018, 0.1, 200)

# ======== 3. Already written ========
# His question in a bubble; the line for award written on the list; their reason in a bubble; a tick on each office's glass; then,
# in the register, each TBC giving way to its name: the gap filled, and the cellos, as the names come in
who3, mei3, bec3 = W('written', 'asks', 'who'), W('written', 'award', 'Mei'), W('written', 'built', 'because')
fl3, reg3 = G('written', 'confirm', -0.35), W('written', 'confirm', 'asks', -0.25)
knock(who3 - 0.05, 0.022, -0.2, 280)
pen(mei3 - 0.2, 0.5, 0.012, -0.1)
knock(bec3 + 0.05, 0.02, 0.4, 300)
marker(fl3 + 2.05, 0.3, 0.011, -0.2); marker(fl3 + 2.85, 0.3, 0.008, -0.45)
pen(reg3 + 0.35, 2.4, 0.011, 0.3)
filled(reg3 + 0.35)
turn(reg3 + 0.9, Eb2, [(Bb3, 2.2), (Ab3, 1.2), (G3, 2.2)])

# ======== 4. Three roles ========
# Three blank cards pinned; a line written under them; Mei's two cards set down, and her name on both: the cellos together, one chord
# for one person in two roles; Sam's card, his team's name, and his answer in a bubble
three4, names4 = W('roles', 'sorts', 'three'), W('roles', 'sorts', 'whatever')
for k in range(3):
    pin(three4 + 0.3 * k + 0.4, 0.026 * (1, 0.85, 0.75)[k], (-0.5, 0.0, 0.5)[k])
pen(names4, 1.4, 0.011, 0.0)
knock(W('roles', 'owner', 'owner', 0.4), 0.02, 0.1, 240); knock(W('roles', 'steward', 'steward', 0.4), 0.018, 0.1, 230)
bth4 = W('roles', 'both', 'both')
pen(bth4 - 0.2, 0.85, 0.012, 0.1)
turn(bth4 - 0.25, Eb2, [(G3, 2.6)])
cuc4 = W('roles', 'custodian', 'custodian')
knock(cuc4 + 0.4, 0.02, -0.4, 250); pen(cuc4 + 0.6, 0.8, 0.011, -0.4)
knock(W('roles', 'custodian', "doesn't", 0.15), 0.02, 0.3, 300)

# ======== 5. Who decides what ========
# The eight areas' cards pinned, the first clear, the rest softer; the shared band and its two cards; what Yusuf writes on the
# meeting room's board; the deputy vice-chancellor's tag; then the board again, each area lit as the owner decides the rest: the
# cellos, and home on the vibraphone as the last area lights
d0 = S0('domains')
for i in range(8):
    pin(d0 + 0.1 + 0.08 * i + 0.3, 0.024 * (1 if i == 0 else 0.5), -0.6 + 0.17 * i)
gov5, glo5, cla5 = W('domains', 'shared', 'Governance'), W('domains', 'shared', 'glossary'), W('domains', 'shared', 'classify')
pin(gov5 + 0.3, 0.022, 0.0); knock(glo5 + 0.1, 0.018, -0.3, 270); knock(cla5 + 0.0, 0.018, 0.2, 290)
wb5, cdec5, next5, dvc5 = W('domains', 'council', 'council', -0.35), W('domains', 'council', 'decides'), W('domains', 'council', 'next'), W('domains', 'limit', 'deputy')
for a, sec in ((wb5 - 1.2, 1.9), (cdec5, 0.75), (next5 - 0.1, 0.75), (dvc5 - 0.5, 0.55), (dvc5, 0.85)):
    marker(a, sec, 0.01, -0.3)
knock(E_('domains', 'limit', 0.4), 0.02, 0.5, 260)
ow5 = W('domains', 'rest', 'owner')
turn(ow5 - 0.2, Eb2, [(Bb3, 2.0), (C4, 1.4), (Bb3, 1.8)])
vib(Eb4, ow5 + 0.55, 0.03)

# ======== 6. Required ========
# The gold card pinned; the sheet slid in; Jun's sheet back, its empty line: the gap; the note written in red, and the stamp; his
# question and Clara's answer in bubbles; her name, the note struck through, her signature, the stamp: the gap filled, and the
# cellos, home as the council's oldest action is stamped done
own6, sheet6 = W('required', 'required', 'owner'), G('required', 'sheet', -0.3)
back6, empty6, note6 = G('required', 'back', -0.3), W('required', 'back', 'empty'), W('required', 'back', 'note')
asks6, clara6, sgn6, cl6 = G('required', 'signs', -0.3), W('required', 'signs', 'Clara'), W('required', 'signs', 'signs'), W('required', 'closed', 'closed')
pin(own6 + 0.35, 0.026, -0.1)
slide(sheet6, 0.02, 0.0, 0.8); slide(back6, 0.022, 0.0, 0.85)
gap(empty6 + 0.05)
pen(note6 + 0.1, 1.35, 0.012, 0.2); rubber(note6 + 1.35, 0.038, 0.3)
knock(asks6 + 0.55, 0.022, 0.3, 280); knock(clara6 + 0.15, 0.02, -0.3, 320)
pen(sgn6 - 0.3, 0.85, 0.012, -0.1); pen(sgn6 + 0.4, 0.7, 0.012, 0.1, 800, 2100); stroke(sgn6 + 0.6, 0.36, 0.012, -0.1)
rubber(sgn6 + 1.05, 0.042, 0.3)
filled(sgn6 + 1.05)
turn(sgn6 + 1.5, Eb2, [(G3, 2.4), (Ab3, max(0.8, cl6 - sgn6 - 4.2)), (G3, 2.2)])
rubber(cl6 + 0.0, 0.04, 0.2)

# ======== 7. Asked by name ========
# The slip clipped on, its three names written in from the register; "kept by Yusuf Demir" written at its foot; a name struck through
# and written again there, and on the slip with it; Jun's request, its slip clipped and filled, sent: it reaches Mei, and the slip
# calls her by name. Then the line again: the cord, the lamp, the call, and the supervisor coming, the answer; and Mei with the
# request in her hands, the slip glowing as the lamp did: the call and the answer in E-flat, and the cellos
rt7, fill7, kp7 = W('asked', 'slip', 'routing'), W('asked', 'slip', 'filled'), W('asked', 'keeps', 'keeps')
chg7, name7, fol7 = W('asked', 'keeps', 'change'), W('asked', 'keeps', 'name'), W('asked', 'keeps', 'follows')
mei7 = G('asked', 'mei', -0.3); sl7 = mei7 - 1.9; ms7 = W('asked', 'mei', 'Mei')
like7, work7 = G('asked', 'like', -0.3), W('asked', 'like', 'work', -0.25); t07 = like7 + 0.45
clip(rt7 + 0.4, 0.018, -0.2)
for i in range(3):
    pen(fill7 + 0.25 * i, 0.4, 0.011 * (1 if i == 0 else 0.7), -0.2)
pen(kp7, 0.95, 0.011, 0.3); stroke(chg7 + 0.05, 0.4, 0.012, 0.3); pen(name7, 1.0, 0.011, 0.3); pen(fol7, 0.7, 0.008, -0.2)
clip(sl7 + 0.45, 0.016, 0.0)
for i in range(3):
    pen(sl7 + 0.3 + 0.2 * i, 0.3, 0.008, 0.0)
air(mei7 - 0.7, 0.8, 0.016, 0.0)
slide(mei7 + 0.1, 0.018, 0.0, 0.8); knock(mei7 + 0.95, 0.022, 0.0, 240)
call(ms7 - 0.05, 0.03)
murmur(like7 - 0.2, work7 + 0.5, 0.012)
latch(t07 + 0.45, 0.024, 0.2); tock(t07 + 0.32, 0.022, 0.2); call(t07 + 0.32, 0.04, 'G'); answer(t07 + 1.66, 0.04, 'G')
call(work7 + 0.25, 0.04); answer(work7 + 1.05, 0.044)
turn(work7 + 1.3, Eb2, [(G3, 2.2), (Ab3, 1.2), (G3, 2.0)])

# ======== 8. Where the work is ========
# What, who, when and why going up beside her screen, one by one; the mapping's entry begun in the course area's decision book, and
# who decides it; each area's why lit: the cellos; the thread of twenty-three replies greyed, and closed
for i, k in enumerate(('what', 'who', 'when', 'why')):
    knock(W('logged', 'written', k, 0.15), 0.02 * (1 if i == 0 else 0.8), 0.25 + 0.1 * i, 250 + 25 * i)
dbook8, why8, find8 = W('logged', 'logs', 'decision'), W('logged', 'next', 'why'), W('logged', 'not', 'find')
pen(dbook8 + 0.2, 1.5, 0.011, 0.3); pen(dbook8 + 1.6, 0.65, 0.011, 0.3)
turn(why8 - 0.15, Eb2, [(Bb3, 2.0), (G3, 2.2)])
tap(find8 + 0.4, 0.012, 0.1); air(find8 + 0.4, 0.9, 0.014, 0.1)

# ======== 9. Time to answer ========
# The questions she always answered, in bubbles, and a tick on each; two hours in each week, blocked in on her calendar, with the
# cellos, as her manager gives her the time; Yusuf's cards for her role, and the lines on them; the spreadsheet; her time flown off
# the desk, her name greyed: the gap; the time back, her name with it: the gap filled, ringing out before the line comes back
for i in range(3):
    knock(S0('time') + (1.1, 2.4, 3.7)[i] + 0.15, 0.02 * (1, 0.85, 0.75)[i], (-0.5, 0.0, 0.6)[i], (300, 320, 280)[i])
alw9 = W('time', 'ask', 'always')
for i in range(3):
    tick(alw9 - 0.1 + 0.25 * i, 0.012 * (1 if i == 0 else 0.75), (-0.4, 0.05, 0.5)[i])
two9 = W('time', 'hours', 'two')
for k in range(4):
    marker(two9 + 0.02 + 0.28 * k, 0.42, 0.009 * (1 if k == 0 else 0.7), -0.2 + 0.13 * k)
turn(two9 - 0.1, Eb2, [(Bb3, 2.4)])
desk9 = G('time', 'scope', -0.3)
knock(desk9 + 0.55, 0.02, -0.3, 240); knock(W('time', 'scope', 'scope', 0.25), 0.018, 0.0, 250)
pen(W('time', 'scope', 'award', -0.1), 0.35, 0.01, 0.0); knock(W('time', 'someone', 'someone', 0.25), 0.018, 0.4, 260)
pen(W('time', 'someone', 'Yusuf', -0.1), 0.35, 0.009, 0.4); pen(W('time', 'someone', 'council', -0.1), 0.4, 0.009, 0.4)
pull9, wo9, nm9, back9 = E_('time', 'someone', 0.2), W('time', 'name', 'without'), W('time', 'name', 'name'), E_('time', 'name', 0.5)
paper(pull9 + 0.3, 0.018, 0.0, 0.5)
air(wo9 - 0.1, 0.9, 0.02, -0.3)
gap(nm9 + 0.05, 0.036)
air(back9, 0.8, 0.016, -0.3)
filled(back9 + 0.6, 0.04, S0('which') + 0.25)  # the pedal lifts as the line comes back

# ======== 10. Which award? ========
# The line once more: the cord, the lamp, the call and the answer; Mei with the request, its slip glowing: the call and the answer,
# ringing under the film's line, which lands without anything else under it. The request laid down; her screen; four more places
# that define award, set down round her, right to left; the gold question mark: Mei's question is a call, with no answer yet. In the
# wordless pause it rings out, and the mark plays under the end card
cord10, here10 = W('which', 'line', 'cord'), W('which', 'line', 'Here', -0.35); t010 = cord10 + 0.1
murmur(S0('which'), here10 + 0.6, 0.012)
latch(t010 + 0.45, 0.024, 0.3); tock(t010 + 0.32, 0.022, 0.3); call(t010 + 0.32, 0.04, 'G'); answer(t010 + 1.66, 0.04, 'G')
call(here10 + 0.35, 0.04); answer(here10 + 1.15, 0.044)
slide(G('which', 'opens', -0.3), 0.016, 0.0, 0.6)
which10, found10, agree10 = G('which', 'five'), W('which', 'five', 'found'), W('which', 'five', 'agree')
tap(which10 + 0.1, 0.012, 0.3)
for j in range(4):
    knock(found10 + 0.2 + 0.45 * j + 0.3, 0.02 * (1, 0.85, 0.75, 0.7)[j], (0.45, 0.2, -0.2, -0.45)[j], (260, 300, 240, 320)[j])
call(agree10 + 0.25, 0.042)
mark(G('which', 'breath', 0.6))
