# An application or a platform?: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The series' palettes: /mnt/project-files/enterprise-architecture/new-architecture-series/palettes.md, this film's row written on 12 November
# 2026. A continuo, a harpsichord and a bassoon, both made here (music.py has neither). None of the topic's own films plays either (The map
# before the data: a lute, nylon strings, a flute, pads, felt and electric pianos, a vibraphone, a harp, a marimba, a kalimba, a celesta,
# strings, a bell), and no film on the site pairs them: searched that day in every score.py on main and on every branch.
#  - The lead: a harpsichord, its one eight-foot register. The quill plucks each string close to its end, so a note speaks at once, clear
#    and a little nasal, its upper partials dying first, until the key is let go and the damper falls. It spreads the chords from the bass
#    up, as a continuo player spreads them, and plays a single note as each thing is set in place. One string to a note, so nothing beats.
#  - The partner: a bassoon, soft and low, each note held at one level, with no vibrato and no swell: the continuo's bass line, a note for
#    each place named and each thing that goes wrong, and the end of the series' mark.
#  - A continuo is the part that carries every voice in a piece and never plays its tune. Its first printed parts came out in Italy from
#    1600 to 1602, the same years as the road's first order, and for about a century and a half a keyboard and a bass instrument, often a
#    harpsichord and a bassoon, played one under almost every piece: as the platform carries every domain's logic and owns none of it.
#  - Nothing from the opening's place: no instrument, scale or sound of Japan. The road is heard as feet on earth and a runner's breath,
#    no bells, horns or drums of the road.
# The series' mark, the relay: a phrase handed from one player to the next, as a letter from station to station. The harpsichord plays
# three notes rising (D, E, A); the bassoon takes the A and carries it down to D. It's played as the relay is first described, under the
# title, and, lower, at the close. D major; B minor for what goes wrong. Every chord is tuned pure from D (just intonation, see hz()); E
# minor, which isn't pure in this table, is never played. No chapter is urgent: nothing pulses.
# The rules the films keep (AGENTS.md, Sound; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: plucked notes, each left to ring and then damped, and bassoon notes held level, none more than a few seconds.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/scenes.js, and
#    panned to where it is drawn. Everything soft: the bassoon below about 2.4 kHz, the harpsichord below about 3.5 kHz with its top
#    taken off, the effects below about 2.2 kHz and about 12 dB under the music.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() falls back to the line's start when a word is missing; here that stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text(encoding='utf-8'))
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1601)  # this film's own randomness: the room, the quill's click, the feet on the road


# a small room round the players, ringing on for about a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, so held notes keep their level (held.py)
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.016 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds)"""
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out
def _until(sig, s, until):
    """a sound that must be gone by until (a time in the film, a chapter's cut): faded out over its last 0.15 s"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); f = min(n, int(0.15 * SR)); sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return sig


# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _thud(n, f, d, at=0.0):
    """a small, soft knock of wood inside a sound n samples long, at at seconds: a low, rounded tone, a duller one above it, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2.6 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.002) * k

def sheet(s, g=0.006, pan=0.0):
    """a sheet or a card laid down: a short breath of paper, and its faint landing"""
    n = int(0.2 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.22)[:n], 'band', (300, 1700)) * _bump(x, 0.09, 1.6) * (x < 0.09)
    _fx(fl + 0.5 * _thud(n, 170, 0.02, 0.08) / 1.3, s, g, pan, 1800)
def tick(s, g=0.005, pan=0.0):
    """something small set in place: one soft tick of wood"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (300, 1200)) * np.exp(-x / 0.006) * 0.6 + 0.7 * _thud(n, 260, 0.011), s, g, pan, 1500)
def line(s, sec=0.9, g=0.005, pan=0.0):
    """a line drawn out across a map or a page: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 25); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (220, 1200)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1400)
def brush(s, sec=0.6, g=0.005, pan=0.0, n=3):
    """a brush writing on paper, a stroke at a time: soft and low, each stroke swelling and lifting"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        _fx(filt(noise(d + 0.02)[:m], 'band', (400, 1600)) * _bump(x, d, 0.8), t, g, pan, 1700)
def seal(s, g=0.008, pan=0.0):
    """the seal pressed on the order: a low, soft thud of the block on the paper, and the paper's faint give under it"""
    n = int(0.35 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 95, 0.05) + 0.35 * filt(noise(0.37)[:n], 'band', (200, 900)) * np.exp(-x / 0.03), s, g, pan, 1200)
def feet(s, sec, g=0.004, pan=0.0, pace=1.6):
    """people walking on an earth road, farther off: one soft texture of steps that swells in and fades, not a patter of single steps"""
    n = int(sec * SR); x = np.arange(n) / SR
    beat = 0.55 + 0.45 * np.abs(np.sin(np.pi * pace * x + 0.4)) ** 3
    _fx(filt(noise(sec + 0.02)[:n], 'band', (90, 520)) * beat * _bump(x, sec, 0.9), s, g, pan, 600)
def run_by(s, sec=1.6, g=0.004, pan0=-0.6, pan1=0.6):
    """a runner passing: a breath of air and quick, soft steps, moving across"""
    n = int(sec * SR); x = np.arange(n) / SR; steps = 0.6 + 0.4 * np.abs(np.sin(np.pi * 2.6 * x)) ** 4
    sig = norm(filt(filt(noise(sec + 0.02)[:n], 'band', (140, 800)) * steps * _bump(x, sec, 1.5), 'low', 900)).astype(np.float32)
    k = 4; e = int(0.03 * SR)
    for i in range(k):  # moving across: four overlapping pieces, each faded in and out, each panned a little further along
        a, b = max(0, i * n // k - e), min(n, (i + 1) * n // k + e); m = b - a; w = np.ones(m, np.float32)
        if a > 0: w[:2 * e] = np.linspace(0, 1, 2 * e)
        if b < n: w[-2 * e:] = np.linspace(1, 0, 2 * e)
        X(sig[a:b] * w, s + a / SR, g * FX, pan0 + (pan1 - pan0) * (i + 0.5) / k)

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D, G and A major and
# B minor are pure in this table; E minor is not, and is never played
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 50, 12)
    return 146.8324 * 2 ** o * _JI[pc]
D2, E2, Fs2, G2, A2, B2, Cs3, D3, E3, Fs3, G3, A3, B3, Cs4, D4, E4, Fs4, G4, A4, B4, D5 = 38, 40, 42, 43, 45, 47, 49, 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 74

LH, LB, FX = 0.141, 0.089, 5.0
LV = [1.0]

def hpsi(m, s, g=1.0, ring=None, pan=None, room=0.18, until=None):
    """the harpsichord, its one eight-foot register: a quill plucks the string close to its end, so the note speaks at once, clear and a
    little nasal, its upper partials dying first; it falls quickly at first, then rings on, until the key is let go and the damper stops
    it (at ring). A low string rings about six seconds, a high one two. One string to a note, so nothing beats"""
    f0 = hz(m); u = min(1.0, max(0.0, (m - 38) / 36))
    beta = 0.085 + 0.06 * u           # where the quill plucks, as a part of the string's length: nearer its end in the bass
    T = 6.0 * (1 - u) + 2.0 * u       # how long the lowest partial rings
    d = ring or T * 0.8
    if until is not None:
        d = min(d, max(0.15, until - s - 0.25))
    sec = d + 0.2; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 40):
        fk = f0 * k
        if fk > 3500:
            break
        body = 1 + 0.6 * np.exp(-((fk - 260) / 120) ** 2) + 0.45 * np.exp(-((fk - 640) / 220) ** 2) + 0.3 * np.exp(-((fk - 1500) / 500) ** 2)
        tk = T / (1 + 0.3 * (k - 1))
        sig += body * abs(np.sin(np.pi * k * beta)) / k ** 0.85 * np.sin(2 * np.pi * fk * x + 0.37 * k) * (
            0.45 * np.exp(-x / (0.3 * tk)) + 0.55 * np.exp(-x / tk))
    sig *= np.minimum(1, x / 0.0012) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.05))
    m_ = min(n, int(0.02 * SR)); cl = np.zeros(n)   # the quill's soft click as it passes the string
    cl[:m_] = filt(noise(0.02)[:m_], 'band', (900, 2800)) * np.exp(-np.arange(m_) / SR / 0.003)
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.03 * cl / max(1e-9, float(np.abs(cl).max()))
    sig = _until(_room(norm(filt(filt(np.asarray(sig, np.float32), 'low', 3200), 'high', 45)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LH * (1 - 0.35 * u), max(-0.35, min(0.35, (m - 62) * 0.02)) if pan is None else pan)  # the treble softer

def roll(notes, s, g=1.0, step=0.11, ring=None, until=None):
    """a chord on the harpsichord, spread from the bass up, as a continuo player spreads it"""
    for i, m in enumerate(notes):
        hpsi(m, s + step * i, g * (1.0 if i == 0 else 0.85), ring, until=until)

def bassoon(m, s, sec=0.9, g=1.0, pan=None, room=0.18, until=None):
    """the bassoon, soft and low, as it plays a continuo's bass line: a double reed in a long, narrow, conical bore, its lowest partial
    weak and the next few strong, with two broad peaks (about 460 Hz and 1.2 kHz) that give it its dark, round voice. Each note is
    tongued softly, held at one level with no vibrato and no swell, and let go"""
    f0 = hz(m)
    if until is not None:
        sec = min(sec, max(0.2, until - s - 0.25))
    rel = 0.15; n = int((sec + rel * 3) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 30):
        fk = f0 * k
        if fk > 2400:
            break
        form = 0.2 + np.exp(-((fk - 460) / 170) ** 2) + 0.5 * np.exp(-((fk - 1200) / 260) ** 2)
        sig += form * (0.35 if k == 1 else 1.0) / k ** 0.6 * np.sin(2 * np.pi * fk * x + 0.9 * k)
    env = np.clip(x / 0.06, 0, 1) ** 1.5 * np.where(x < sec, 1.0, np.exp(-(x - sec) / (rel / 3)))
    tg = filt(noise(n / SR + 0.02)[:n], 'band', (250, 1400)) * np.exp(-x / 0.035)   # the reed's soft start under the tongue
    sig = sig * env / max(1e-9, float(np.abs(sig).max())) + 0.06 * tg / max(1e-9, float(np.abs(tg).max()))
    sig = _until(_room(norm(filt(filt(np.asarray(sig, np.float32), 'low', 2300), 'high', 50)), room, 0.08, max(0.2, sec)), s, until)
    put(sig, s, g * LV[0] * LB, max(-0.4, min(0.4, (m - 50) * 0.03)) if pan is None else pan)

RELAY_H, RELAY_B = (D4, E4, A4), (A3, D3)
def relay(s, g=1.0, shift=0, step=0.32, until=None):
    """the series' mark: three notes rising on the harpsichord, then the bassoon takes the last note and carries it down; the
    harpsichord lets its A go as the bassoon takes it, as a runner stops where the next one starts"""
    for i, m in enumerate(RELAY_H):
        hpsi(m + shift, s + step * i, g, 1.6 if i < 2 else step + 0.12, until=until)
    bassoon(RELAY_B[0] + shift, s + step * 3, step + 0.04, 0.75 * g, until=until)
    bassoon(RELAY_B[1] + shift, s + step * 4, 1.3, 0.75 * g, until=until)


# =============================================================================================================================
# 1. Five roads from Edo: the opening. Japan, 1601: the harpsichord's low D, alone, then D major spread as the land comes in. Edo
#    and Kyoto, a bassoon note each as each is named; the domains drawn, one line. The walk: B minor, low, and the slow walker's two weeks. What
#    Ieyasu needed: A major, then D. The order: a sheet as it arrives, the brush writing it, D major as the horses stand ready; the seal:
#    pressed, with nothing under it. The roads drawn out, one long line; the stations, a harpsichord note for each of three. The relay: the mark,
#    as the letter runs station to station; three or four days: D major. The shared road: feet on the earth, a runner passing, G major
#    and D. Ravi and the platform: D major as he's named; the four domains set down on it, a note each. On the map it's one more box: B
#    minor, low, and the bassoon's low B for the question. Drawn as a platform, with owners: G, then D. The title: the mark, then D major
LV[0] = 0.85
ow = lambda lid, word, off=0: W('road', lid, word, off)
oc = lambda lid, off=0: G('road', lid, off)
END = E('road')
hpsi(D2, 0.6, 0.8, 5.0, 0.0)
roll((D2, A2, D3, Fs3, A3), ow('year', 'sixteen oh one', 0.3), 0.7, 0.12, 3.6)
bassoon(D3, ow('domains', 'Edo', -0.1), 0.9, 0.75, px(1400))
bassoon(A2, ow('domains', 'Kyoto', -0.1), 0.9, 0.75, px(560))
line(ow('domains', 'many domains', -0.2), 1.6, 0.004, px(980))
roll((B2, Fs3, B3, D4), ow('slow', 'two weeks', -0.2), 0.6, 0.14, 3.0)
roll((A2, E3, A3, Cs4), ow('need', 'days', -0.3), 0.55, 0.12, 2.0)
hpsi(D3, ow('need', 'weeks', 0.0), 0.5, 2.6)
sheet(oc('order', -0.1), 0.006, px(430))
brush(ow('order', 'keep', -0.3), 2.4, 0.004, px(430), 5)
roll((D2, A2, Fs3, A3, D4), ow('order', 'thirty-six', -0.2), 0.55, 0.12, 2.8, until=oc('seal', -0.1))
seal(ow('seal', 'seal', -0.1), 0.008, px(540))
line(oc('roads', 0.2), 3.4, 0.004, px(1000))
for k, (m, x) in enumerate(((A3, 1250), (Fs3, 980), (D3, 700))):
    hpsi(m, ow('roads', 'stations', 0.1) + 0.42 * k, 0.6, 1.4, px(x) * 0.6)
relay(ow('fast', 'station', -0.2), 0.75)
roll((D2, A2, D3, Fs3, A3), ow('fast', 'three or four', 0.1), 0.55, 0.12, 3.0)
feet(oc('shared', -0.4), 8.6, 0.0035, px(700))
run_by(ow('shared', 'couriers', -1.6), 2.2, 0.0035, -0.7, 0.3)
roll((G2, D3, G3, B3), ow('shared', 'every domain', -0.1), 0.5, 0.14, 2.4)
roll((D2, A2, Fs3, D4), ow('shared', 'each on their own', 0.0), 0.5, 0.14, 2.6)
roll((D2, A2, D3, Fs3), ow('ravi', 'Ravi', -0.1), 0.55, 0.12, 2.6)
for k, (m, x) in enumerate(((D3, 738), (Fs3, 1032), (A3, 1326), (D4, 1620))):
    hpsi(m, ow('ravi', 'every domain', -0.2) + 0.3 * k + 0.6, 0.55, 1.4, px(x) * 0.6)
roll((B2, Fs3, B3), ow('wrong', 'one more application', -0.1), 0.5, 0.16, 2.2)
bassoon(B2, ow('wrong', 'whose rule', -0.2), 1.2, 0.6, px(1230))
roll((G2, D3, G3, B3), oc('better', 0.1), 0.5, 0.14, 2.0)
roll((D2, A2, D3, Fs3, A3), ow('better', 'owner', -0.1), 0.55, 0.12, 2.8)
relay(oc('breath', 0.9), 0.59, until=END)
roll((D2, A2, D3, Fs3, A3, D4), oc('breath', 0.9) + 5 * 0.32 + 0.2, 0.46, 0.14, 4.0, until=END)

# 2. Where it sits: the chapter turns on A major; the six layers laid down, one sheet; the bottom two lit: a bassoon note. The hundred and forty
#    systems open out, one line; the four named, a tick each. The information layer: a sheet. The one box, data warehouse: the bassoon's
#    low B. Ravi and Tomás; the sticky note: a sheet; "a word that means two things": A, on the harpsichord, left open
LV[0] = 0.9
mw = lambda lid, word, off=0: W('map', lid, word, off)
mc = lambda lid, off=0: G('map', lid, off)
roll((A2, E3, A3, Cs4), S0('map') + 0.2, 0.5, 0.14, 2.2)
sheet(S0('map') + 0.6, 0.004, px(960))
bassoon(D3, mw('layers', 'bottom two', -0.1), 0.9, 0.5, px(960) * 0.4)
line(mc('list', -0.2), 2.0, 0.0035, px(960))
for word, x in (('billing', 505), ('outages', 805), ('meter data', 1105), ('finance', 1405)):
    tick(mw('list', word, -0.15), 0.0035, px(x))
sheet(mw('above', 'information', -0.2), 0.0035, px(960))
bassoon(B2, mw('box', 'data warehouse', -0.2), 1.1, 0.55, px(960) * 0.4)
sheet(mw('ask', 'move it', -0.2), 0.004, px(1400))
hpsi(A3, mw('ask', 'a word', -0.1), 0.45, 2.4)

# 3. A word that means two things: the product comes in, a sheet, its components set in, one line; "sold as one": a tick. The service,
#    your data platform: the chapter's chord, A major, as it opens; the parts round the product, a tick each; the team, its rules (a
#    sheet) and its support; the two words, each a tick
LV[0] = 0.9
vw = lambda lid, word, off=0: W('words', lid, word, off)
vc = lambda lid, off=0: G('words', lid, off)
sheet(S0('words') + 0.4, 0.004, px(500))
line(vw('vendor', 'many components', -0.2), 1.4, 0.0035, px(500))
tick(vw('vendor', 'sold as one', -0.1), 0.0035, px(500))
roll((A2, E3, A3, Cs4), vc('yours', -0.1), 0.5, 0.14, 2.2)
for word, x in (('identity', 1040), ('network', 1040), ('integration', 1040), ('orchestration', 1690), ('reporting tools', 1690), ('watches', 1690)):
    tick(vw('parts', word, -0.15), 0.003, px(x))
tick(vw('team', 'team', -0.2), 0.0035, px(1080))
sheet(vw('team', 'rules', -0.2), 0.0035, px(1350))
tick(vw('team', 'support', -0.2), 0.0035, px(1620))
tick(vw('keep', 'product', -0.3), 0.0035, px(528))
tick(vw('keep', 'service', -0.3), 0.0035, px(1336))

# 4. The test: billing arrives, a sheet; its rules written in, the brush; its owner, a tick. The platform, its capabilities laid out,
#    one line; the four domains set down on it, a note each, rising through D major. The test itself: D major for the application's
#    line, then the platform's, G and D
LV[0] = 0.9
tw_ = lambda lid, word, off=0: W('test', lid, word, off)
tc = lambda lid, off=0: G('test', lid, off)
sheet(S0('test') + 0.4, 0.004, px(460))
brush(tw_('billing', 'tariffs', -0.2), 1.4, 0.0035, px(460), 3)
tick(tw_('owner', 'head of retail', -0.2), 0.0035, px(460))
line(tw_('none', 'bring data in', -0.2), 2.4, 0.0035, px(1370))
for (lid, word), m, x in ((('many', 'network'), D3, 1028), (('many', 'retail'), Fs3, 1256), (('many', 'finance'), A3, 1484), (('ent', 'enterprise'), D4, 1712)):
    hpsi(m, tw_(lid, word, -0.2) + 0.7, 0.5, 1.4, px(x) * 0.6)
sheet(tc('test', -0.1), 0.004, px(960))
roll((D2, A2, D3, Fs3), tw_('test', 'application', -0.1), 0.45, 0.12, 2.0)
roll((G2, D3, G3, B3, D4), tw_('test', 'platform', -0.1), 0.5, 0.12, 2.6)

# 5. Not every shared system: the finance system arrives, a sheet; its three parts, a tick each; the line card: a sheet, then B minor
#    for logic inside, and D major for logic brought to it
LV[0] = 0.9
ew = lambda lid, word, off=0: W('erp', lid, word, off)
ec = lambda lid, off=0: G('erp', lid, off)
sheet(S0('erp') + 0.4, 0.004, px(960))
for word, x in (('finance', 536), ('procurement', 960), ('people', 1384)):
    tick(ew('erp', word, -0.2), 0.0035, px(x))
sheet(ec('line', -0.1), 0.004, px(960))
bassoon(B2, ew('line', 'inside', -0.1), 1.0, 0.45, px(500) * 0.4)
roll((D2, A2, D3, Fs3), ew('line', 'brought', -0.1), 0.45, 0.12, 2.0)

# 6. Whose logic: back on the road, the courier running in and slowing at the station; his letter, the sender's: A on the harpsichord.
#    The platform: the domains' products set down, a note each; one pushed into the components and refused, the bassoon's low B, stopped short;
#    "never the platform team": a tick as it's struck through
LV[0] = 0.9
lw = lambda lid, word, off=0: W('logic', lid, word, off)
lc = lambda lid, off=0: G('logic', lid, off)
run_by(S0('logic') + 0.2, 3.2, 0.0035, 0.8, 0.0)
hpsi(A3, lw('horses', 'letters', -0.4), 0.45, 2.4, px(1500) * 0.4)
roll((G2, D3, G3, B3), lc('runs', -0.1), 0.45, 0.14, 2.0)
for k, m in enumerate((D3, Fs3, A3, D4)):
    hpsi(m, lw('runs', 'data products', -0.4) + 0.22 * k + 0.8, 0.45, 1.3, px(478 + 294 * k) * 0.6)
bassoon(B2, lw('runs', 'never', -0.2) + 0.2, 0.6, 0.55, px(840), until=lw('runs', 'never', 0.0) + 0.9)
tick(lw('always', 'platform team', 0.2), 0.0035, px(1640))

# 7. A number nobody owns: the chart, a sheet; the March bar jumps: B minor, low, the bassoon; the rule in the storm tool's export, a sheet,
#    struck through by the update, a tick; whose rule? Three tags, a tick each, and nothing under them. The map and the catalogue find
#    the owner: D major as Ama comes in; the ticket, the glossary, the pull request, a sheet each; reviewed: a tick. Back to nine: the
#    mark's last two notes, on the bassoon
LV[0] = 0.9
nw = lambda lid, word, off=0: W('minutes', lid, word, off)
nc = lambda lid, off=0: G('minutes', lid, off)
sheet(S0('minutes') + 0.4, 0.004, px(1560))
bassoon(B2, nw('jump', 'nineteen', -0.3), 1.0, 0.55, px(1560) * 0.4)
roll((B2, Fs3, B3), nw('jump', 'nineteen', 0.0), 0.4, 0.16, 1.8)
sheet(nw('why', 'export', -0.2), 0.0035, px(350))
tick(nw('why', 'dropped', -0.1), 0.0035, px(580))
for word, x in (("platform team's", 880), ('no notes', 880), ('had left', 880)):
    tick(nw('whose', word, -0.3), 0.003, px(x))
sheet(nw('find', 'catalogue', -0.2), 0.0035, px(490))
roll((D2, A2, D3, Fs3, A3), nw('find', 'Ama', -0.3), 0.5, 0.12, 2.4)
sheet(nc('ticket', -0.2), 0.004, px(520))
sheet(nw('ticket', 'glossary', -0.2), 0.0035, px(520))
sheet(nc('build', -0.1), 0.0035, px(520))
tick(nw('build', 'reviews', 0.0), 0.0035, px(520))
bassoon(A3, nw('check', 'back to nine', 0.2), 0.36, 0.5, px(1560) * 0.4)
bassoon(D3, nw('check', 'back to nine', 0.52), 1.2, 0.55, px(1560) * 0.4)

# 8. An owner who answers to all: the road at dusk, a rider, a merchant's porter, the villages with their loads: feet on the earth,
#    once, and G major as the shogunate is named. The platform: the sponsor and its product owner, a tick each; a line from every
#    domain up to them; it answers for how well it serves: D major; the four measures, a sheet each
LV[0] = 0.9
qw = lambda lid, word, off=0: W('owner', lid, word, off)
qc = lambda lid, off=0: G('owner', lid, off)
feet(S0('owner') + 0.3, 9.0, 0.0035, px(700), 1.3)
roll((G2, D3, G3, B3), qw('road', 'shogunate', -0.1), 0.45, 0.14, 2.2)
tick(qw('sponsor', 'sponsor', -0.2), 0.0035, px(760))
tick(qw('sponsor', 'platform product owner', -0.2), 0.0035, px(1160))
line(qw('all', 'every domain', -0.2), 1.4, 0.0035, px(960))
roll((D2, A2, D3, Fs3), qw('all', 'how well', -0.1), 0.45, 0.12, 2.0)
for k, word in enumerate(('build', 'first', 'reliable', 'costs')):
    sheet(qw('measured', word, -0.2), 0.003, px(345 + 420 * k))

# 9. Why the map matters most here: the six layers, one sheet; the domains across the top; the platform's band over every layer: A
#    major; "from inside one domain", struck through: the bassoon's low B
LV[0] = 0.9
yw = lambda lid, word, off=0: W('why', lid, word, off)
yc = lambda lid, off=0: G('why', lid, off)
sheet(S0('why') + 0.3, 0.004, px(960))
roll((A2, E3, A3, Cs4, E4), yw('crosses', 'every layer', -0.2), 0.45, 0.12, 2.2)
bassoon(B2, yw('inside', 'any one', -0.1), 1.0, 0.45, px(1020) * 0.4)

# 10. The data practice on the map: the two layers laid in, a sheet; the platform's services, a tick each; Databricks under them,
#     realising them, one line; the data product, a sheet, its owner a tick, its output port and tables, a tick each; no rule in the
#     platform's components: the bassoon's low B, then D major as the rule is shown in the product, with its owner
LV[0] = 0.9
pw = lambda lid, word, off=0: W('practice', lid, word, off)
pc = lambda lid, off=0: G('practice', lid, off)
sheet(S0('practice') + 0.4, 0.004, px(960))
for k, word in enumerate(('storage', 'compute', 'catalogue')):
    tick(pw('tech', word, -0.2), 0.003, px(480 + 360 * k))
line(pw('tech', 'realises', -0.2), 1.0, 0.0035, px(860))
sheet(pw('app', 'pipeline', -0.2), 0.0035, px(860))
tick(pw('app', 'owned', -0.2), 0.003, px(860))
tick(pw('port', 'Where others', -0.2), 0.003, px(1430))
tick(pw('port', 'artifacts', -0.2), 0.003, px(1460))
bassoon(B2, pc('none', -0.1), 1.0, 0.45, px(960) * 0.4)
roll((D2, A2, D3, Fs3, A3), pw('none', 'product', -0.2), 0.45, 0.12, 2.4)

# 11. Every domain's road: the map at night, travellers as lights on every road: the mark, lower, as the letters are named; the
#     platform with every domain and every owner: D major, from its low D up; "Next": an A on the harpsichord; the end card: the mark, then D major, held
#     to the end
LV[0] = 0.9
zw = lambda lid, word, off=0: W('end', lid, word, off)
zc = lambda lid, off=0: G('end', lid, off)
relay(zw('letters', 'letters', -0.1), 0.6, -12)
roll((D2, Fs3, A3, D4), zw('data', 'every domain', -0.1), 0.5, 0.14, 2.6)
hpsi(A3, zc('next', 0.1), 0.4, 2.0)
relay(zc('breath', 0.7), 0.5, until=TOT)
roll((D2, A2, D3, Fs3, A3, D4), zc('breath', 0.7) + 5 * 0.32 + 0.2, 0.42, 0.14, 4.6, until=TOT)
