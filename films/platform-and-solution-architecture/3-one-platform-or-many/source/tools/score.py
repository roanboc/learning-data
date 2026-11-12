# One platform, or many: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The series' palettes: /mnt/project-files/enterprise-architecture/new-architecture-series/palettes.md, this film's row reserved on 12
# November 2026. An organ and a regal, both made here (music.py has neither):
#  - The lead: an organ's open metal pipes, its principal: one wind and one keyboard for every pipe, so one player sounds every part,
#    tuned once, where a consort needs a player and a tuning for each instrument; as one platform keeps every rule once. Soft, a small
#    breath of wind as each pipe speaks, held level while the key is down, gone when it's let go: chords spread from the bass up under
#    the opening story and at a chapter's turn, never a bed under the voice. Open pipes, never the stopped wooden pipes of The same
#    problem everywhere, and no timpani.
#  - The partner: a regal, the small reed organ of the 1500s, light enough to carry: short beating reeds, nasal and soft, single notes
#    and short phrases, never held chords, never Who is it, really?'s held chords or its gatekeeper's figure. A second instrument kept
#    for a place the organ couldn't be taken, as a second platform is kept only for a reason anyone can name: it plays the barriers,
#    the second platform and the shogunate's checkpoints.
#  - Nothing from the opening's place: no instrument, scale or sound of Japan, and no bells, horns or drums of the road. The river and
#    the road are heard as water, coins, a wooden bar, feet and hooves on earth.
# The series' mark, the relay, in C: the organ plays C, D and G rising and lets the G go as the regal takes it an octave down and
# carries it to C, as a load is handed from one horse to the next. It's played under the title and under the end card. The film's own
# figure, once in the opening and once at the end: the regal plays a short phrase stopped at every barrier, and the organ plays the
# same phrase through, on one wind. C major; A minor for what goes wrong (the barriers and their tolls; three sets of rules). Every
# chord is tuned pure from C (just intonation, see hz()): C, F and G major and A and E minor are pure in this table; D minor is not,
# and no chord puts D with A. No chapter is urgent: nothing pulses.
# The rules the films keep (AGENTS.md, Sound; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: every note held at one level, with no tremulant and no vibrato, and let go.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/scenes.js, and
#    panned to where it is drawn. Everything soft: the organ and the regal below about 2.4 kHz, the effects below about 2.2 kHz and well
#    under the music.

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
R1 = np.random.default_rng(1462)  # this film's own randomness: the room, the wind, the water and the road


# a small room round the organ, ringing on for about a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, so held notes keep their level (held.py)
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.3)).astype(np.float32))(np.arange(int(1.3 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.02 * SR)] = 0; _IR /= _band(_IR)
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
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone, a duller one above it, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2.6 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.002) * k
def _moving(sig, s, g, pan0, pan1, k=4):
    """a sound moving across: overlapping pieces, each faded in and out, each panned a little further along"""
    n = len(sig); e = int(0.03 * SR)
    for i in range(k):
        a, b = max(0, i * n // k - e), min(n, (i + 1) * n // k + e); m = b - a; w = np.ones(m, np.float32)
        if a > 0: w[:2 * e] = np.linspace(0, 1, 2 * e)
        if b < n: w[-2 * e:] = np.linspace(1, 0, 2 * e)
        X(sig[a:b] * w, s + a / SR, g * FX, pan0 + (pan1 - pan0) * (i + 0.5) / k)

def sheet(s, g=0.006, pan=0.0):
    """a card or a page laid down: a short breath of paper, and its faint landing"""
    n = int(0.2 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.22)[:n], 'band', (300, 1700)) * _bump(x, 0.09, 1.6) * (x < 0.09)
    _fx(fl + 0.5 * _thud(n, 170, 0.02, 0.08) / 1.3, s, g, pan, 1800)
def tick(s, g=0.005, pan=0.0):
    """something small set in place: one soft tick of wood"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (300, 1200)) * np.exp(-x / 0.006) * 0.6 + 0.7 * _thud(n, 260, 0.011), s, g, pan, 1500)
def knock(s, g=0.006, pan=0.0):
    """a soft knock on wood, once: something stopped or struck out, without a beep"""
    n = int(0.2 * SR)
    _fx(_thud(n, 150, 0.03), s, g, pan, 1200)
def line(s, sec=0.9, g=0.005, pan=0.0, pan1=None):
    """a line drawn out across a map or a page: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 25); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    sig = filt(noise(sec + 0.02)[:n], 'band', (220, 1200)) * _bump(x, sec, 1.4) * gr
    if pan1 is None:
        _fx(sig, s, g, pan, 1400)
    else:
        _moving(norm(filt(np.asarray(sig, np.float32), 'low', 1400)).astype(np.float32), s, g, pan, pan1)
def hatch(s, sec=2.0, g=0.004, pan=0.0, pan1=None):
    """many fine strokes drawn at once, as one soft texture: a dry rub with a fine, even grain, swelling in and easing off; never a
    patter of single strokes"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = 0.75 + 0.25 * np.abs(np.sin(np.pi * 9.0 * x)) ** 2
    sig = filt(noise(sec + 0.02)[:n], 'band', (260, 1300)) * _bump(x, sec, 1.1) * gr
    if pan1 is None:
        _fx(sig, s, g, pan, 1500)
    else:
        _moving(norm(filt(np.asarray(sig, np.float32), 'low', 1500)).astype(np.float32), s, g, pan, pan1)
def water(s, sec=2.4, g=0.004, pan=0.0, pan1=None):
    """a boat on a slow river: the water against its sides, low and soft, lapping in slow, uneven swells; one texture, never drops"""
    n = int(sec * SR); x = np.arange(n) / SR
    sw = filt(R1.standard_normal(n + 64).astype(np.float32), 'low', 1.4)[:n]; sw = 0.55 + 0.45 * sw / max(1e-9, float(np.abs(sw).max()))
    sig = filt(noise(sec + 0.02)[:n], 'band', (120, 650)) * sw * _bump(x, sec, 0.9)
    sig = norm(filt(np.asarray(sig, np.float32), 'low', 700)).astype(np.float32)
    if pan1 is None:
        X(sig, s, g * FX, pan)
    else:
        _moving(sig, s, g, pan, pan1)
def coin(s, g=0.004, pan=0.0):
    """a copper coin set down on a wooden counter: a small dull knock with the faint, short ring of the metal, its top taken off"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    ring = sum(np.sin(2 * np.pi * f * x + p) * w for f, w, p in ((1240, 1.0, 0.3), (1870, 0.5, 1.1), (2130, 0.3, 2.0))) * np.exp(-x / 0.035)
    _fx(_thud(n, 420, 0.008) + 0.22 * ring * np.minimum(1, x / 0.001), s, g, pan, 2200)
def bar(s, sec=0.6, g=0.005, pan=0.0):
    """a wooden bar lifted out of its brackets: a soft knock as it leaves its seat, then a low, dry rub of wood on wood"""
    n = int((sec + 0.1) * SR); x = np.arange(n) / SR
    rub = filt(noise(sec + 0.12)[:n], 'band', (150, 700)) * _bump(x, sec, 1.2) * 0.6
    _fx(_thud(n, 190, 0.025) + rub, s, g, pan, 900)
def post(s, g=0.006, pan=0.0):
    """a wooden post laid down on an earth road: a soft, heavy fall, and a little earth"""
    n = int(0.4 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 74, 0.07) + 0.5 * _thud(n, 118, 0.04) + 0.25 * filt(noise(0.42)[:n], 'band', (90, 500)) * np.exp(-x / 0.06), s, g, pan, 700)
def feet(s, sec, g=0.004, pan=0.0, pace=1.6, pan1=None):
    """people walking on an earth road, farther off: one soft texture of steps that swells in and fades, not a patter of single steps"""
    n = int(sec * SR); x = np.arange(n) / SR
    beat = 0.55 + 0.45 * np.abs(np.sin(np.pi * pace * x + 0.4)) ** 3
    sig = filt(noise(sec + 0.02)[:n], 'band', (90, 520)) * beat * _bump(x, sec, 0.9)
    if pan1 is None:
        _fx(sig, s, g, pan, 600)
    else:
        _moving(norm(filt(np.asarray(sig, np.float32), 'low', 600)).astype(np.float32), s, g, pan, pan1)
def hooves(s, sec, g=0.004, pan=0.0, pace=1.1, pan1=None):
    """a horse walking on an earth road, farther off: four soft falls to a stride, each a dull knock of earth, heard as one texture
    that swells in and fades, never as a patter of single sounds"""
    n = int(sec * SR); x = np.arange(n) / SR; ph = (pace * x) % 1.0
    fall = sum(np.exp(-((ph - c) % 1.0) / 0.045) * w for c, w in ((0.0, 1.0), (0.24, 0.7), (0.5, 0.9), (0.74, 0.65)))
    sig = filt(noise(sec + 0.02)[:n], 'band', (70, 380)) * (0.3 + 0.7 * np.minimum(1, fall)) * _bump(x, sec, 0.8)
    sig = norm(filt(np.asarray(sig, np.float32), 'low', 450)).astype(np.float32)
    if pan1 is None:
        X(sig, s, g * FX, pan)
    else:
        _moving(sig, s, g, pan, pan1)


# ---- tuning: just intonation from C, so a chord's notes are whole-number ratios of each other and nothing beats. C, F and G major
# and A and E minor are pure in this table; D minor is not, and D is never put with A
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 60, 12)
    return 261.6256 * 2 ** o * _JI[pc]
C2, E2, F2, G2, A2, B2, C3, D3, E3, F3, G3, A3, B3, C4, D4, E4, F4, G4, A4, B4, C5, D5, E5 = \
    36, 40, 41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76

LO, LR, FX = 0.07, 0.05, 5.0
LV = [1.0]

def principal(m, s, sec=1.2, g=1.0, pan=None, room=0.25, until=None):
    """an organ's open metal pipe, its principal, on a soft wind: every harmonic, its octave and twelfth clear and the rest falling
    away, a round, singing voice between a flute's and a string's (an open pipe, so its even harmonics are there; a stopped one has
    mostly odd). Each pipe speaks with a small breath of wind at its mouth, its octave a moment before its own note, then is held at
    one level while the key is down, with no tremulant and no vibrato, and stops as the key is let go; the room carries it on"""
    f0 = hz(m)
    if until is not None:
        sec = min(sec, max(0.2, until - s - 0.2))
    rel = 0.045; n = int((sec + rel * 6) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    sp = 0.032 + 0.03 * min(1.6, 196.0 / f0) ** 0.5   # a lower pipe speaks a little slower
    for k in range(1, 26):
        fk = f0 * k
        if fk > 2400:
            break
        a = 1.0 if k == 1 else 0.5 * (k / 2) ** -1.4
        if k == 1:
            e = np.clip((x - 0.012) / sp, 0, 1) ** 1.4
        else:
            e = np.clip(x / (sp * 0.6), 0, 1) ** 1.2 * (1 + (0.6 if k == 2 else 0.2) * np.exp(-x / 0.04))   # the pipe's speech
        sig += a * e * np.sin(2 * np.pi * fk * x + 0.7 * k)
    sig *= np.where(x < sec, 1.0, np.exp(-(x - sec) / rel))
    br = filt(noise(n / SR + 0.02)[:n], 'band', (700, 2100)) * np.minimum(1, x / 0.004) * np.exp(-x / 0.05)   # the wind at its mouth
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.06 * br / max(1e-9, float(np.abs(br).max()))
    sig = _until(_room(norm(filt(filt(np.asarray(sig, np.float32), 'low', 2400), 'high', 45)), room, 0.15, max(0.3, sec)), s, until)
    put(sig, s, g * LV[0] * LO * (1.0 - 0.25 * max(0, (m - 60) / 16)), max(-0.35, min(0.35, (m - 58) * 0.025)) if pan is None else pan)

def organ(notes, s, sec=1.6, g=1.0, spread=0.1, until=None):
    """a chord on the organ, spread from the bass up, every note on the one wind and let go together, as one player's hands lift"""
    k = len(notes)
    for i, m in enumerate(notes):
        principal(m, s + spread * i, max(0.3, sec - spread * i), g * (1.0 if i == 0 else 0.78), -0.3 + 0.6 * i / max(1, k - 1), until=until)

def regal(m, s, sec=0.4, g=1.0, pan=0.22, room=0.2, until=None):
    """a regal, the small reed organ of the 1500s: a brass tongue beating on its shallot under a short resonator, so a nasal, buzzing
    voice, its own note clear, its harmonics many, with a hump about 1.2 kHz where the short resonator sings and little above 2.3 kHz.
    The reed speaks at once, with a small burr as it starts, is held level, and stops as the key is let go. Single notes and short
    phrases; never a held chord"""
    f0 = hz(m)
    if until is not None:
        sec = min(sec, max(0.12, until - s - 0.12))
    rel = 0.03; n = int((sec + rel * 6) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 48):
        fk = f0 * k
        if fk > 2400:
            break
        a = k ** -0.8 * (1 + 1.5 * np.exp(-((fk - 1200) / 340) ** 2)) * (0.8 if k == 1 else 1.0)
        e = np.clip(x / (0.012 + 0.0015 * min(k, 12)), 0, 1) ** 1.2 * (1 + (0.45 if k >= 3 else 0.0) * np.exp(-x / 0.022))   # the burr
        sig += a * e * np.sin(2 * np.pi * fk * x + 1.1 * k)
    sig *= np.where(x < sec, 1.0, np.exp(-(x - sec) / rel))
    sig = sig / max(1e-9, float(np.abs(sig).max()))
    sig = _until(_room(norm(filt(filt(np.asarray(sig, np.float32), 'low', 2300), 'high', 90)), room, 0.08, max(0.2, sec)), s, until)
    put(sig, s, g * LV[0] * LR, pan)

RELAY_O, RELAY_R = (C4, D4, G4), (G3, C3)
def relay(s, g=1.0, step=0.34, until=None, hold=1.3):
    """the series' mark, in C: the organ's C, D and G rising, and the regal takes the G an octave down and carries it down to C; the
    organ lets its G go as the regal takes it, as a load is handed from one horse to the next"""
    for i, m in enumerate(RELAY_O):
        principal(m, s + step * i, step * 0.92 if i < 2 else step + 0.08, g, until=until)
    regal(RELAY_R[0], s + step * 3, step - 0.02, 0.8 * g, until=until)
    regal(RELAY_R[1], s + step * 4, hold, 0.8 * g, until=until)

FIG = (E4, G4, A4, G4, E4, D4, C4)
def stopped(s, notes=FIG, step=0.46, at=0.2, sec=0.2, g=1.0, pan=0.22):
    """the film's figure on the regal, stopped at every barrier: each note short, and a stop before the next, as a load is stopped
    and pays at each one"""
    for i, m in enumerate(notes):
        regal(m, s + step * i + at, sec, g, pan)
def through(s, step=0.32, g=1.0, bass=C3):
    """the film's figure on the organ, played through on one wind: every note joined to the next, over its low C held the while"""
    principal(bass, s - 0.1, step * len(FIG) + 0.3, 0.75 * g, -0.15)
    for i, m in enumerate(FIG):
        principal(m, s + step * i, step * 0.97 if i < len(FIG) - 1 else step + 0.5, 0.8 * g, 0.12)


# =============================================================================================================================
# 1. A toll at every barrier: the opening. Japan, 1462: the organ's low C alone as the land and the Yodo appear, a tick as Kyoto
#    lights, and C major as the boats go up and down it, on the water. The owners' stretches drawn, one by one. One barrier, close:
#    the regal's A as it's set across the river; the boat comes down to it on the water, pays, a coin; the bar lifts, the boat goes
#    on, the bar comes down; A minor as everyone pays a toll. The count: 380 barriers as hatching, the organ's low E minor; sixty on
#    the road to Ise, hatching, and the regal's E. The harm: the film's figure on the regal, stopped at every barrier as the load comes
#    down by fits and starts; its first coins. The road at dusk, the people waiting: F major as they need a road. The lords clear
#    their lands: the bar lifted, the posts laid down, G major, and the queue walks on, feet and a horse. About 1585: the barriers
#    come down west to east, one soft sweep, and C major. The five roads drawn under one set of rules: the figure on the organ,
#    through, on one wind; 1635. The road: what the domains shared, C major. Travellers pay for what they use: the horse and the
#    porter set off, pilgrims walk to the inn; two million pilgrims, F major. The utility: C major as Ravi comes in, his two
#    platforms drawn, the third product laid down; the regal's A as the bars come in where it would join them; the rules on each, a
#    tick each; kept three times, A minor, low. One platform: the platform widens, the domains set on it, and C major from the bass
#    up. The title: the mark, the regal's C held, and the organ's C major under it
LV[0] = 0.9
ow = lambda lid, word, off=0: W('tolls', lid, word, off)
oc = lambda lid, off=0: G('tolls', lid, off)
END = E('tolls')
principal(C2, 0.6, 3.0, 0.8, 0.0)
tick(1.2, 0.0035, px(700))
organ((C3, G3, C4, E4), ow('year', 'Boats', -0.1), 1.8, 0.65)
water(ow('year', 'Boats', -0.2), 3.2, 0.0035, px(820), px(1000))
for word in ('the court', 'the shogunate', 'temples', 'shrines', 'lords'):
    line(ow('owners', word, -0.3), 0.45, 0.003, px(1000))
regal(A3, ow('barrier', 'barrier', -0.1), 0.6, 0.8)
water(ow('barrier', 'barrier', -0.6), 2.0, 0.0035, px(760), px(940))
coin(ow('barrier', 'pays', 0.5), 0.004, px(1060))
bar(ow('barrier', 'pays', 0.6), 0.6, 0.004, px(960))
organ((A2, E3, A3, C4), ow('barrier', 'toll', -0.1), 1.8, 0.6)
water(ow('barrier', 'pays', 1.0), 2.6, 0.003, px(960), px(1160))
tick(ow('barrier', 'pays', 3.6), 0.003, px(960))
hatch(ow('count', 'Yodo alone', -0.2), 2.4, 0.0035, px(600), px(1300))
organ((E2, B2, E3, G3), ow('count', 'three hundred', -0.1), 1.6, 0.55)
hatch(ow('count', 'sixty', -0.3), 1.6, 0.003, px(860), px(1100))
regal(E4, ow('count', 'sixty', -0.1), 0.5, 0.65)
line(ow('count', 'eighteen', -0.3), 0.5, 0.003, px(800))
stopped(oc('harm', 0.9), g=0.75)
for k in range(3):
    coin(oc('harm', 0.9 + 0.2 + 0.46 * k), 0.003, px(700 + 40 * k))
organ((F2, C3, F3, A3), ow('need', 'needed', -0.1), 1.8, 0.6)
bar(ow('lords', 'clearing', -0.2), 0.8, 0.005, px(1240))
organ((G2, D3, G3, B3), ow('lords', 'clearing', -0.1), 1.8, 0.55)
post(ow('lords', 'clearing', 0.6), 0.005, px(1100))
post(ow('lords', 'clearing', 0.85), 0.005, px(1380))
feet(ow('lords', 'clearing', 1.1), 5.0, 0.003, px(700), 1.6, px(1300))
hooves(ow('lords', 'clearing', 1.4), 4.5, 0.003, px(870), 1.1, px(1400))
hatch(ow('down', 'forbade', -0.2), 3.0, 0.003, px(300), px(1600))
organ((C3, G3, C4, E4, G4), ow('down', 'forbade', -0.1), 1.8, 0.55)
line(oc('rules', -0.2), 2.6, 0.0035, px(700), px(1300))
through(oc('rules', 0.2), g=0.8)
tick(ow('rules', 'sixteen', -0.3), 0.003, px(160))
organ((C3, E3, G3, C4), ow('kept', 'shared', -0.2), 1.8, 0.5)
tick(oc('better', -0.5), 0.003, px(470))
hooves(ow('better', 'a horse', -0.4), 5.0, 0.003, px(1290), 1.1, px(700))
feet(ow('better', 'a porter', -0.4), 4.5, 0.0025, px(1560), 1.6, px(1100))
feet(oc('better', -0.7), 4.2, 0.0025, px(-60), 1.4, px(380))
tick(ow('better', 'seventeen', -0.3), 0.003, px(160))
organ((F2, C3, A3, F4), ow('better', 'two million', -0.2), 1.8, 0.5)
organ((C3, G3, E4), oc('ravi', -0.4), 1.4, 0.5)
tick(ow('ravi', 'Ravi', -0.2), 0.0035, px(270))
line(ow('ravi', 'two data platforms', -0.3), 1.0, 0.0035, px(1000))
sheet(ow('ravi', 'third product', -0.3), 0.004, px(1120))
regal(A3, ow('ravi', 'join', -0.1), 0.5, 0.7)
knock(ow('ravi', 'join', 0.0), 0.004, px(1120))
for word, x in (('permissions', 500), ('policies', 1330), ('logs', 1610)):
    tick(ow('wrong', word, -0.2), 0.003, px(x))
organ((A2, E3, A3), ow('wrong', 'three times', -0.2), 1.6, 0.5)
line(ow('one', 'one platform', -0.2), 1.6, 0.0035, px(1100))
organ((C2, G2, C3, E3, G3), ow('one', 'one platform', -0.1), 2.2, 0.55)
for k in range(3):
    tick(ow('one', 'every domain', 0.3 + 0.24 * k), 0.003, px(790 + 436 * k))
relay(oc('breath', 0.9), 0.65, until=END)
organ((C2, G2, E3), oc('breath', 0.9) + 4 * 0.34, 2.0, 0.45, until=END)

# 2. Two platforms, and a third: the two platforms drawn; the domains set on the data platform, a tick each; the regal's G as the
#    other is named generation's, and its block set down. The measure the enterprise domain needs: a page, and F major at the turn;
#    its two lines drawn. The third product, laid down, its arrows; Ama's ticket, a page, and the organ's E as the question goes to Ravi
LV[0] = 0.9
tw = lambda lid, word, off=0: W('two', lid, word, off)
tc = lambda lid, off=0: G('two', lid, off)
line(tw('bought', 'bought', -0.3), 1.0, 0.0035, px(960))
for k in range(4):
    tick(tw('which', 'every other', -0.15 + 0.225 * k), 0.003, px(298 + 226 * k))
regal(G3, tw('which', "generation's", -0.1), 0.6, 0.65, px(1500) * 0.4)
tick(tw('which', "generation's", 0.3), 0.003, px(1500))
tick(tw('which', 'hydro', -0.2), 0.003, px(1500))
sheet(tw('need', 'one measure', -0.2), 0.004, px(520))
organ((F2, C3, A3, C4), tw('need', 'one measure', -0.1), 1.6, 0.5)
line(tw('need', 'share', 0.0), 0.8, 0.003, px(400))
line(tw('need', 'own farms', 0.0), 0.8, 0.003, px(1100))
sheet(tw('third', 'third product', -0.3), 0.004, px(960))
line(tw('third', 'query both', 0.0), 0.8, 0.003, px(1200))
sheet(tc('ticket', -0.1), 0.004, px(520))
principal(E4, tw('ticket', 'Ravi', -0.1), 1.2, 0.5, px(1340) * 0.4)

# 3. Three sets of rules: A minor as Ravi draws the columns, a page each; each rule set in, a tick; the third product's set, one
#    rub; the masks and their checks; the grants, a tick each; the lineage drawn and stopped at each border, a knock; every
#    platform a barrier: the regal's A, stopped, as the red bars come in
LV[0] = 0.9
lw = lambda lid, word, off=0: W('layers', lid, word, off)
lc = lambda lid, off=0: G('layers', lid, off)
sheet(lw('side', 'draws', -0.2), 0.004, px(350))
sheet(lw('side', 'draws', 0.2), 0.004, px(1570))
organ((A2, E3, A3, C4), lw('side', 'draws', -0.1), 1.6, 0.5)
for word in ("who's who", 'masks', 'lineage', 'log'):
    tick(lw('each', word, -0.25), 0.003, px(960))
sheet(lc('third', -0.3), 0.004, px(960))
line(lw('third', 'set', -0.4), 0.8, 0.003, px(960))
for k, word in enumerate(('masked on', 'masked again')):
    tick(lw('mask', word, -0.2), 0.003, px(550 + 610 * k))
for k in range(2):
    tick(lw('mask', 'checked', -0.1 + 0.3 * k), 0.0025, px(580 + 610 * k))
for k in range(3):
    tick(lw('grant', 'granted', -0.1 + 0.35 * k), 0.0025, px(560 + 610 * k))
line(lw('grant', 'lineage', 0.0), 1.6, 0.003, px(1500), px(300))
for k in range(2):
    knock(lw('grant', 'every border', -0.2 + 0.3 * k), 0.0035, px(1265 - 610 * k))
regal(A3, lw('toll', 'barrier', -0.3), 0.25, 0.7, px(700) * 0.4)
regal(A3, lw('toll', 'barrier', 0.2), 0.3, 0.7, px(1310) * 0.4)

# 4. As simple as it can be: Ravi's rule, a page, and C major; complexity drawn, one rub, and a part fails, a knock and the organ's
#    low A and E. Most: one platform drawn, its domains set on it. A few: a platform and a team in each country, a tick each. Easier:
#    the two chips; months, not years: G major
LV[0] = 0.9
sw_ = lambda lid, word, off=0: W('simple', lid, word, off)
sc_ = lambda lid, off=0: G('simple', lid, off)
sheet(sw_('rule', 'one rule', -0.3), 0.004, px(960))
organ((C3, G3, C4, E4), sw_('rule', 'simplest', -0.1), 1.6, 0.5)
line(sw_('rule', 'Complexity', -0.3), 1.6, 0.003, px(300), px(700))
knock(sw_('rule', 'fail', -0.2), 0.004, px(450))
organ((A2, E3), sw_('rule', 'fail', -0.1), 1.0, 0.45)
line(sc_('most', -0.3), 0.8, 0.003, px(1430))
for k in range(2):
    tick(sc_('most', 0.4 + 0.3 * k), 0.003, px(1240 + 440 * k))
for k in range(3):
    tick(sc_('few', 0.2 + 0.25 * k), 0.003, px(240 + 240 * k))
for word, x in (('open formats', 1150), ('tools', 1500)):
    tick(sw_('easier', word, -0.2), 0.003, px(x))
organ((G2, D3, B3), sw_('easier', 'months', -0.2), 1.6, 0.45)

# 5. Many owners, one platform: the domains set on the one platform, their owners named; a data mesh: F major; the rules the
#    domains agree, drawn across their owners; one platform, many owners: C major with its high G; done badly, the owners gone,
#    one knock, and the organ's low A minor
LV[0] = 0.9
mw = lambda lid, word, off=0: W('mesh', lid, word, off)
mc = lambda lid, off=0: G('mesh', lid, off)
for k in range(2):
    tick(S0('mesh') + 0.9 + 0.45 * k, 0.003, px(351 + 612 * k))
tick(mw('owners', 'one team', 0.1), 0.003, px(351))
organ((F2, C3, F3, A3), mw('mesh', 'data mesh', -0.1), 1.6, 0.5)
line(mw('mesh', 'rules the domains', -0.3), 1.2, 0.003, px(351), px(1575))
organ((C3, E3, G3, G4), mw('simplest', 'one platform', -0.2), 1.6, 0.5)
knock(mw('badly', 'nobody', -0.2), 0.004, px(960))
organ((A2, C3, E3), mw('badly', 'nobody', -0.1), 1.4, 0.45)

# 6. When two can't be helped: the data platform, and the regal's G as a second platform comes in; the three cases, a page each; the
#    same files, drawn, their arrows; one catalogue, a page, its lines; the second set of rules stays, a tick each, and A minor. The
#    1600s: the shogunate's checkpoints light, the regal's C, E and G; a second only for a reason: C major, the regal's G above it
LV[0] = 0.9
uw = lambda lid, word, off=0: W('unavoid', lid, word, off)
uc = lambda lid, off=0: G('unavoid', lid, off)
tick(S0('unavoid') + 0.4, 0.003, px(530))
regal(G3, S0('unavoid') + 0.7, 0.6, 0.65, px(1415) * 0.4)
for word, x in (('company', 380), ('legal entity', 960), ('Data that', 1540)):
    sheet(uw('cases', word, -0.3), 0.0035, px(x))
line(uc('formats', -0.3), 0.8, 0.003, px(960))
line(uw('formats', 'same files', 0.0), 0.6, 0.003, px(960))
sheet(uc('find', -0.2), 0.004, px(960))
line(uc('find', 0.0), 0.8, 0.003, px(960))
tick(uc('stays', -0.1), 0.003, px(290))
tick(uw('stays', 'policies', -0.1), 0.003, px(1200))
organ((A2, E3, C4), uw('stays', 'second set', -0.2), 1.4, 0.45)
for k, (m, x) in enumerate(((C4, 1650), (E4, 1150), (G4, 1580))):
    regal(m, uw('checks', 'checkpoints', -0.2 + 0.25 * k), 0.2 if k < 2 else 0.5, 0.6, px(x) * 0.4)
organ((C3, G3, C4, E4), uc('reason', -0.1), 1.6, 0.45)
regal(G4, uc('reason', 0.4), 0.7, 0.5, 0.1)

# 7. Generation moves: no such reason, the regal's A; the storage drawn, its files; the catalogues, a tick each, the one federating
#    the other, drawn, and F major; Ama's measure, a page; the pull request, a page, reviewed, a tick; generation's reports, a page,
#    checked, a tick. Switched off: the regal's last note, and the organ's C major as the data platform takes generation's products
LV[0] = 0.9
vw = lambda lid, word, off=0: W('move', lid, word, off)
vc = lambda lid, off=0: G('move', lid, off)
regal(A3, vw('none', 'no such reason', -0.1), 0.5, 0.6, px(1495) * 0.4)
line(vc('files', -0.3), 1.0, 0.003, px(960))
for x in (1040, 1270):
    tick(vc('bridge', -0.2) + (0.15 if x > 1100 else 0), 0.003, px(x))
line(vw('bridge', 'federates', -0.1), 0.8, 0.003, px(1150))
organ((F2, C3, F3, A3, C4), vw('bridge', 'federates', 0.0), 1.6, 0.45)
sheet(vw('bridge', "Ama's measure", -0.1), 0.004, px(520))
sheet(vc('code', -0.2), 0.004, px(1400))
tick(vw('code', 'reviews', 0.0), 0.003, px(1400))
sheet(vc('off', -0.3), 0.004, px(1400))
tick(vw('off', 'in test', 0.2), 0.003, px(1400))
regal(C4, vw('off', 'switched off', -0.4), 0.45, 0.55, px(1495) * 0.4)
line(vw('off', 'switched off', -0.4), 1.8, 0.003, px(1100), px(1600))
organ((C2, G2, C3, E3, G3), vw('off', 'switched off', 0.1), 2.0, 0.5)

# 8. Every rule, once: the rules on the one platform's face, and C major with its high E; the mask on every domain's data, a tick
#    each; the rights, a tick; Ama's measure, a page, its bars drawn, its lineage drawn from each farm, and the organ's G; one platform
#    to pay for: no third product, laid down and struck out; the two people who kept it running, building
LV[0] = 0.9
nw = lambda lid, word, off=0: W('once', lid, word, off)
nc = lambda lid, off=0: G('once', lid, off)
organ((C3, G3, C4, E4, E5), nw('once', 'kept once', -0.2), 1.8, 0.45)
for k in range(2):
    tick(nw('once', 'mask', 0.1 + 0.2 * k), 0.003, px(500 + 800 * k))
tick(nw('once', 'rights', 0.0), 0.003, px(200))
sheet(nc('measure', -0.1), 0.004, px(960))
hatch(nc('measure', 0.0), 1.6, 0.0025, px(600), px(1300))
line(nw('measure', 'lineage', 0.0), 0.9, 0.003, px(1100))
principal(G4, nw('measure', 'lineage', 0.1), 1.2, 0.45, 0.0)
sheet(nw('cost', 'no third', -0.2), 0.0035, px(1380))
knock(nw('cost', 'no third', 0.2), 0.0035, px(1516))
tick(nw('cost', 'two people', -0.2), 0.003, px(1470))

# 9. The data practice on the map: its layers, a page each, and C major at the turn; the products, drawn; the data platform's node
#    and its services; generation's, a second node, and the regal's G; its second set of rules, drawn round; what served each
#    domain's products, drawn, and the one that changed; Ravi's rule as a principle, a page, and G major; the move as a work package,
#    a page, ending the day the old platform was switched off, drawn, a tick
LV[0] = 0.9
rw = lambda lid, word, off=0: W('practice', lid, word, off)
rc = lambda lid, off=0: G('practice', lid, off)
sheet(S0('practice') + 0.2, 0.0035, px(960))
sheet(S0('practice') + 0.6, 0.0035, px(960))
organ((C3, G3, C4), S0('practice') + 0.5, 1.4, 0.45)
line(S0('practice') + 0.8, 0.7, 0.003, px(960))
sheet(rc('node', -0.4), 0.0035, px(830))
tick(rc('node', -0.2), 0.003, px(530))
sheet(rw('node', 'second node', -0.3), 0.0035, px(1585))
regal(G3, rw('node', 'second node', -0.1), 0.6, 0.6, px(1585) * 0.4)
tick(rw('node', 'its own services', -0.1), 0.003, px(1585))
line(rw('node', 'second set', -0.2), 1.0, 0.003, px(1585))
line(rc('app', -0.3), 0.9, 0.003, px(800))
line(rw('app', 'served them', 0.3), 1.2, 0.003, px(1500), px(1300))
sheet(rw('principle', 'principle', -0.3), 0.0035, px(960))
organ((G2, D3, G3, B3), rw('principle', 'principle', -0.1), 1.6, 0.45)
sheet(rw('work', 'work package', -0.3), 0.0035, px(840))
line(rw('work', 'ending', 0.0), 0.6, 0.003, px(1200))
tick(rw('work', 'ending', 0.5), 0.003, px(1540))

# 10. One road, many domains: the road past Kuwana, the sixty barriers' ghosts: the figure's first notes on the regal, stopped; then,
#     as the ghosts go out, the figure on the organ, through, on one wind. One platform now, every domain on it. "Next": a tick. The
#     end card: the mark, the regal's C held, and the organ's C major under it to the end
LV[0] = 0.9
zw = lambda lid, word, off=0: W('end', lid, word, off)
zc = lambda lid, off=0: G('end', lid, off)
stopped(zc('road', 0.0), FIG[:3], g=0.6)
through(zw('road', 'sixty barriers', 0.4), g=0.7)
tick(zc('next', -0.1), 0.003, px(960))
relay(zc('breath', 0.6), 0.6, until=TOT)
organ((C2, G2, C3, E3), zc('breath', 0.6) + 4 * 0.34, 3.0, 0.42, until=TOT)
