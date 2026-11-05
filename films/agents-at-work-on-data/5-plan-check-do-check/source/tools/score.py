# Plan, define the check, do, check: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, reserved for this film by the series on 4 November 2026 (palettes.md, after checking every
# score.py on main and on every branch, music.py and series 1's palettes), and checked again by this film's thread the same day: tuned
# bottles, blown across the neck, and a contrabassoon. Both are made here (music.py has neither).
#  - The bottles: each is filled with water to a mark before it's played, so its note is set before anyone blows it, as the check is set
#    before the agent starts (and Singapore's people raised bottles of the water on 9 August 2002). Blown across its neck, a bottle
#    gives a round note, nearly pure, with the player's breath in it: it speaks a moment after the breath arrives and stops when it does.
#    Each bottle plays one note, and keeps its own breath and level; a chord is a few bottles, a player to each.
#  - The contrabassoon: low, soft, with no vibrato. It answers a bottle's note on the same pitch two octaves down, and only where a
#    person holds the work to its mark: the panel in Singapore, Jun approving the tests and reading the pull request, Noor approving.
#  - The mark: water poured into a bottle until it reaches its mark, the air above the water ringing higher as it fills, up to the
#    bottle's note (the air left in a bottle sets its note); then the note it set; then, a moment later, the contrabassoon's answer. It
#    plays where the bottle fills on screen in Singapore, under the title, when the check is decided in chapter 4, and at the end.
#  - F-sharp major, tuned pure over F-sharp (see hz()); D-sharp minor for the problems: in Singapore, would anyone drink it; in the lab,
#    the plan that said nothing about tools, and the first run that fails.
# The rules the series keeps (its briefs and the author's review of the first films, 4 November 2026):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause; never a bed under the voice. tools/quiet.py checks how long and how often it plays, and that no figure comes back soon.
#  - Nothing trembles, pulses or beats: every note comes from one just scale, with no vibrato, and the chords leave out G-sharp, whose
#    intervals with B and D-sharp aren't pure in it. No urgent pulse: nothing in this film is a rush.
#  - Every sound is an event on screen, at the moment it appears: each uses the same word and offset as the picture in src/scenes.js,
#    so sound and picture stay together when the voice is recorded again. Effects come one at a time, soft, and under about 2.2 kHz.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() falls back to the line's start when a word isn't in it; here a missing word stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(25)  # this film's own randomness: the rain, the crowd, the water, the paper

# ---- tuning: just intonation from F-sharp 4 (369.99 Hz, as A = 440 Hz tunes it), so a chord's notes are whole-number ratios of each
# other and nothing beats. Every pitch comes from this one scale, so a note two chords share is the same in both. The chords used are
# F-sharp, B, D-sharp minor, A-sharp minor and C-sharp without its fifth, all pure here
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (66, 440 * 2 ** (-3 / 12))
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
Ds3, Fs3, As3, B3, Cs4, Ds4, Es4, Fs4, As4, B4, Cs5, Ds5, Fs5 = 51, 54, 58, 59, 61, 63, 65, 66, 70, 71, 73, 75, 78
Ds2, Fs2, Cs3 = 39, 42, 49   # the contrabassoon's answers: D-sharp, F-sharp and C-sharp, two octaves under the bottles'

# ---- the levels: the bottles about as far under the voice as the series' other music (matched by loudness, as tools/quiet.py measures
# it), the pour under the note it sets, the contrabassoon a little under the bottles (its partials sit where a phone plays loudest);
# the effects about 12 dB under the music (FX scales them all)
BT, PR, CB, FX = 0.035, 0.034, 0.045, 0.95

# a small room round the bottles and the contrabassoon, ringing on for about a second. Its level is set by what it rings under 1.5 kHz
# (its gain there about one), so a held note keeps its level: scaled by all it rings, the room rang about 12 dB louder there than its
# share said, and a pure note on a frequency where the room's reflections cancel its own sound came out 20 dB quieter than the rest
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.0)).astype(np.float32))(np.arange(int(1.0 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.016 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum() * SR / 3000)
def _room(s, room):
    if not room:
        return s
    return np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)
def _held(s, room):
    """a held note in the room, at its own level: the room still moves a pure note's level by up to 5 dB, up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body"""
    r = _room(s, room); a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b] ** 2).mean() / max(1e-12, (r[a:b] ** 2).mean())))
def _rms1(x):
    """noise scaled to an RMS of one"""
    x = np.asarray(x, np.float64); return x / max(1e-12, float(np.sqrt((x ** 2).mean())))

# ---- a bottle blown across its neck, for sec seconds. Its note is the air in it ringing (the water already at its mark): a sine,
# with a trace of the second and third harmonics where the breath meets the lip. The breath arrives first, a soft hiss, and the note
# grows out of it (a bigger, lower bottle a little slower); the breath also rings in the neck, a faint band of air round the note. The
# breath swells once and settles, so nothing trembles; when it stops, the note stops within a sixth of a second. Returned dry
def _bottle(m, sec, rel=0.16):
    f = hz(m); n = int((sec + rel + 0.04) * SR); x = np.arange(n, dtype=np.float64) / SR
    br = np.random.default_rng(500 + m)  # this bottle's own breath and level
    lev, airy = 10 ** (br.uniform(-1.0, 1.0) / 20), br.uniform(0.85, 1.15)
    low = min(1.0, max(0.0, (440 - f) / 250))
    on = 1 - np.exp(-x / (0.045 + 0.04 * low))
    arc = 0.93 + 0.07 * np.sin(np.pi * np.clip(x / max(sec, 0.6), 0, 1))
    off = np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    ph = 2 * np.pi * f * x
    tone = np.sin(ph) + 0.04 * np.sin(2 * ph + 0.7) + 0.012 * np.sin(3 * ph + 1.3)
    ring = _rms1(filt(br.standard_normal(n).astype(np.float32), 'band', (f * 0.92, f * 1.09), 2))
    hiss = _rms1(filt(br.standard_normal(n).astype(np.float32), 'band', (300, 2000), 2))
    sig = (tone * on * arc + (0.06 + 0.04 * low) * airy * ring) * off
    sig = sig + hiss * airy * (0.018 + 0.05 * np.exp(-x / 0.07)) * np.minimum(1, x / 0.012) * off
    return norm(filt(sig.astype(np.float32), 'low', 2200, 2)) * lev
def bottle(m, a, b, g=1.0, pan=None, room=0.35):
    """one bottle, blown from a to b"""
    put(_held(_bottle(m, b - a), room).astype(np.float32), a, g * BT, max(-0.45, min(0.45, (m - 66) * 0.03)) if pan is None else pan)
def band(notes, a, b, g=1.0, stag=0.09, pans=None):
    """a few bottles together, a player to each: the lowest first, the others a moment after, all let go at b"""
    for i, m in enumerate(notes):
        bottle(m, a + stag * i, b, g * (1.0 if i == 0 else 0.82), None if pans is None else pans[i])

# ---- the pour: water poured into a bottle at an even rate, from the tap, until it reaches the bottle's mark. The air above the water
# rings at its own note, which climbs as the water rises (faster near the top, as the air left gets less), up to the note the bottle
# then plays; the stream itself hisses softly into the water. It stops at the mark. Returned dry, sec long
def _pour(m, sec, start=0.6):
    f1 = hz(m); f0 = f1 * start; n = int((sec + 0.12) * SR); x = np.arange(n, dtype=np.float64) / SR
    u = np.clip(x / sec, 0, 1)
    fr = f0 / np.sqrt(1 - (1 - (f0 / f1) ** 2) * u)
    ph = 2 * np.pi * np.cumsum(fr, dtype=np.float64) / SR
    pr = np.random.default_rng(700 + m)
    lp = lambda: np.clip(_rms1(filt(pr.standard_normal(n).astype(np.float32), 'low', 28, 2)), -3, 3)  # capped, so nothing spikes
    air = lp() * np.cos(ph) + lp() * np.sin(ph) + 0.25 * (lp() * np.cos(2 * ph) + lp() * np.sin(2 * ph))
    stream = _rms1(filt(pr.standard_normal(n).astype(np.float32), 'band', (300, 1800), 2))
    e = np.minimum(1, x / 0.14) * np.where(x > sec, np.maximum(0, 1 - (x - sec) / 0.07), 1.0)
    sig = (air * (0.75 + 0.25 * u) + 0.32 * stream) * e
    return norm(filt(sig.astype(np.float32), 'low', 2200, 2))
def pour(m, a, b, g=1.0, pan=0.0):
    """the bottle filled to its mark, from a to b, ringing up to its note m"""
    put(_room(_pour(m, b - a), 0.3).astype(np.float32), a, g * PR, pan)

# ---- the contrabassoon, low and soft, no vibrato: a double reed's many harmonics, strongest where its body resonates (about 250 Hz,
# and less near 500 Hz and 1.1 kHz), the upper ones falling away as it's played softly. Each harmonic speaks a little after the one
# below it, as a reed does, with a breath of the reed at the start; it ends over a third of a second. Returned dry
def _contra(m, sec, rel=0.32):
    f = hz(m); n = int((sec + rel + 0.04) * SR); x = np.arange(n, dtype=np.float64) / SR
    cr = np.random.default_rng(900 + m)
    sig = np.zeros(n); k = 1
    while f * k < 2200:
        fk = f * k
        a = 0.25 + np.exp(-((fk - 250) / 120) ** 2) + 0.5 * np.exp(-((fk - 500) / 180) ** 2) + 0.12 * np.exp(-((fk - 1100) / 300) ** 2)
        a *= min(1.0, (320 / fk) ** 0.7)
        if k == 1:
            a = max(a, 0.45)
        sig += a * (1 - np.exp(-x / (0.07 + 0.012 * k))) * np.sin(2 * np.pi * fk * x + cr.uniform(0, 2 * np.pi))
        k += 1
    sig = _rms1(sig)
    reed = _rms1(filt(cr.standard_normal(n).astype(np.float32), 'band', (120, 900), 2)) * (0.03 + 0.14 * np.exp(-x / 0.04))
    off = np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    return norm(filt(((sig + reed) * off).astype(np.float32), 'low', 2200, 2))
def contra(m, a, b, g=1.0, pan=0.12):
    """the contrabassoon's answer, from a to b"""
    put(_held(_contra(m, b - a), 0.35).astype(np.float32), a, g * CB, pan)
def mark(m, a, pour_sec=1.6, hold=2.5, answer=1.0, ahold=2.8, g=1.0, pan=0.0):
    """the mark: the bottle filled to its mark from a, its note as the water reaches it, and the contrabassoon's answer two octaves
    down, answer seconds after; returns when the note starts"""
    pour(m, a, a + pour_sec, g, pan); s = a + pour_sec + 0.05
    bottle(m, s, s + hold, g, pan); contra(m - 24, s + answer, s + answer + ahold, g)
    return s

# ---- soft sounds on screen, all low-passed (soft() keeps what's made here under about 2.2 kHz, steeply)
soft = lambda sig: filt(np.asarray(sig, np.float32), 'low', 2200, 4)
def _across(sig, s, g, p0, p1):
    """an effect that moves across the frame while it plays, from pan p0 to p1: its two sides placed together, so heard as one"""
    sig = np.asarray(sig, np.float32); p = np.linspace(p0, p1, len(sig)).astype(np.float32)
    X(sig * np.sqrt(0.5 * (1 - p)), s, g, -1.0); X(sig * np.sqrt(0.5 * (1 + p)), s, g, 1.0)
def _swell(sec, a=0.4, r=0.6):
    x = np.arange(int(sec * SR)) / SR; return (np.minimum(1, x / a) * np.minimum(1, np.maximum(0, sec - x) / r)).astype(np.float32)
def card(s, g=0.016, pan=0.0):
    """a card set in place: a soft papery tuck"""
    x = tt(0.16); X(soft(filt(noise(0.16), 'band', (400, 2000))[:len(x)] * np.exp(-x * 30)), s, g * FX, pan); s_knock(s + 0.01, g * 0.45 * FX, pan, 320)
def sheet(s, g=0.013, pan=0.0, sec=0.45):
    """a page laid down: filtered noise with a swell"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (250, 1900))[:len(x)] * np.sin(np.pi * x / sec) ** 2), s, g * FX, pan)
def slide(s, sec=0.9, g=0.011, p0=0.0, p1=0.0):
    """a card or a page sliding across: a soft, even brush of paper"""
    x = tt(sec); _across(soft(filt(noise(sec), 'band', (300, 1500))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5), s, g * FX, p0, p1)
def keys(a, b, g=0.02, pan=0.0):
    """a row typed in: soft keys, far off and unhurried, as one texture that comes and goes with the words"""
    sec = b - a; n = int(sec * SR); sig = np.zeros(n, np.float32); t = 0.05
    while t < sec - 0.05:
        k = int(t * SR); m = min(n - k, int(0.05 * SR)); y = np.arange(m) / SR
        sig[k:k + m] += filt(R1.standard_normal(m).astype(np.float32), 'band', (300, 1400))[:m] * np.exp(-y * 85) * R1.uniform(0.6, 1.0)
        t += R1.uniform(0.11, 0.19)
    X(soft(sig * _swell(sec, 0.2, 0.2)[:n]), a, g * FX, pan)
def tick(s, g=0.011, pan=0.0):
    """a pencil tick: a quick, soft stroke"""
    x = tt(0.12); X(soft(filt(noise(0.12), 'band', (600, 2000))[:len(x)] * np.sin(np.pi * x / 0.12) ** 0.7), s, g * FX, pan)
def tap(s, g=0.011, pan=0.0):
    """a muffled key, or a pill set in place"""
    s_tap(s, g * FX, pan)
def pencil(s, sec=0.4, g=0.01, pan=0.0):
    """a line written: a soft, even scratch"""
    x = tt(sec); X(soft(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 0.6), s, g * FX, pan)
def pin(s, g=0.016, pan=0.0):
    """a sheet pinned to the board: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def flip(s, g=0.012, pan=0.0):
    """a calendar's leaf turned"""
    x = tt(0.3); X(soft(filt(noise(0.3), 'band', (350, 1800))[:len(x)] * np.sin(np.pi * x / 0.3) ** 2 * (1 + 0.6 * np.exp(-x * 20))), s, g * FX, pan)
def air(s, sec=0.8, g=0.009, p0=0.0, p1=None):
    """something moving through the air of the room: a low breath, from p0 to p1"""
    x = tt(sec); _across(filt(noise(sec), 'band', (140, 900))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, p0, p0 if p1 is None else p1)
def lock(s, g=0.014, pan=0.0):
    """a lock closing: a soft, low double click"""
    s_knock(s, g * FX, pan, 200); s_tap(s + 0.035, g * 0.6 * FX, pan)
def stop(s, g=0.012, pan=0.0):
    """something tried, and held: a soft, dull bump"""
    s_knock(s, g * FX, pan, 150)
def fail(s, g=0.014, pan=0.0):
    """a test fails: a low wooden knock, and a breath of the room"""
    s_knock(s, g * FX, pan, 130); x = tt(0.25); X(filt(noise(0.25), 'band', (90, 500))[:len(x)] * np.exp(-x * 22), s, g * 0.5 * FX, pan)
def land(s, g=0.014, pan=0.0):
    """a card laid on the bench: a soft wooden knock and its paper"""
    s_knock(s, g * FX, pan, 180); x = tt(0.2); X(soft(filt(noise(0.2), 'band', (300, 1500))[:len(x)] * np.exp(-x * 25)), s, g * 0.5 * FX, pan)

# ---- Singapore's water, outside: the rain, the pipes, the drain, the crowd, the inflow. Shaped noise is capped at three times its
# mean (a burble made from the exponential of a slow noise spiked over the voice in an earlier film)
def _shaped(n, rate, depth):
    """a slow, irregular swell for noise: rate in Hz, depth 0 to 1, capped"""
    z = filt(R1.standard_normal(n).astype(np.float32), 'low', rate, 2).astype(np.float64); z = np.exp(depth * 2.2 * z / max(1e-9, z.std()))
    return np.minimum(z, 3 * z.mean()) / (3 * z.mean())
def rain(a, b, g=0.008, p0=-0.7, p1=0.0):
    """rain falling on the sea and on the city: a soft, steady hiss, with the wash of the sea under it, moving in from the left"""
    sec = b - a; n = int(sec * SR)
    hiss = _rms1(filt(R1.standard_normal(n).astype(np.float32), 'band', (350, 1900), 2)) * (0.6 + 0.4 * _shaped(n, 3, 0.4))
    sea = _rms1(filt(R1.standard_normal(n).astype(np.float32), 'band', (120, 500), 2)) * 0.5 * _shaped(n, 0.4, 0.6)
    _across(soft(((hiss + sea) * _swell(sec, 1.6, 1.0)[:n]).astype(np.float32)), a, g * FX, p0, p1)
def flow(a, b, g=0.008, p0=0.0, p1=0.0, lo=110, hi=600):
    """water running in a pipe: low and smooth, with a slow burble"""
    sec = b - a; n = int(sec * SR)
    run = _rms1(filt(R1.standard_normal(n).astype(np.float32), 'band', (lo, hi), 2)) * (0.65 + 0.35 * _shaped(n, 2.5, 0.5))
    _across(soft((run * _swell(sec, 0.6, 0.7)[:n]).astype(np.float32)), a, g * FX, p0, p1)
def crowd(a, b, up, g=0.008, p0=-0.5, p1=0.5):
    """a stadium far off at dusk: many voices as one low murmur, rising as the bottles go up (from up), and quieter as they drink"""
    sec = b - a; n = int(sec * SR); x = np.arange(n) / SR
    voices = sum(_rms1(filt(R1.standard_normal(n).astype(np.float32), 'band', (lo, hi), 2)) * _shaped(n, 4, 0.5)
                 for lo, hi in ((180, 420), (350, 800), (700, 1500)))
    lift = 1 + 0.8 * np.clip((x - (up - a)) / 1.6, 0, 1) * np.clip(1 - (x - (up - a) - 2.6) / 1.5, 0.4, 1)
    _across(soft((voices * lift * _swell(sec, 1.0, 1.0)[:n]).astype(np.float32)), a, g * FX, p0, p1)
def stream(a, b, g=0.008, pan=0.0):
    """clear water pouring from an outfall into a reservoir: a soft, bright fall over the low water"""
    sec = b - a; n = int(sec * SR)
    fall = _rms1(filt(R1.standard_normal(n).astype(np.float32), 'band', (250, 1700), 2)) * (0.7 + 0.3 * _shaped(n, 5, 0.4))
    X(soft((fall * _swell(sec, 0.8, 0.9)[:n]).astype(np.float32)), a, g * FX, pan)

# =============================================================================================================================
# 1. Water people can trust: the opening, under the bottles all through, a chord to each picture, each note held for a breath.
#    Singapore, the late 1990s: F-sharp, open, as the rain comes in from the left; the map and its pipes: B, and D-sharp minor under
#    the agreements' end dates; the street: C-sharp, and F-sharp as the glass of clean water stands; the kitchen, would you drink it:
#    D-sharp minor, low, then A-sharp minor; "Something has to make it trustworthy": C-sharp. The study: F-sharp. The list written
#    first: B, then a bottle for each kind of measure, rising. The plant runs and the bottle fills to its line: the mark, and the panel
#    answers on the contrabassoon. Their two years: B, and C-sharp; "well within the standards": F-sharp, answered again. The parade:
#    B, and the bottles come in one after another, left to right, as the wave of bottles rises. The reservoirs: B. Today: F-sharp, and
#    a high note for the outside audit. The university: A-sharp minor; "nobody can trust what it brings back": D-sharp minor; the
#    check decided first: C-sharp, then F-sharp as the agent's work comes back with its tick. The title: the mark
w = lambda lid, word, off=0: W('water', lid, word, off)
wc = lambda lid, off=0: G('water', lid, off)
# Singapore, late 1990s: the city across the water, the rain moving in from the left
band((Fs3, Cs4, As4), 0.5, wc('piped', -0.6), 0.9, stag=1.1)
rain(w('city', 'island', -1.4), wc('piped', 0.3), 0.006, -0.8, 0.1)
# the map: water piped along the causeway, from the mainland into the island; the two agreements
band((B3, Ds4, Fs4), wc('piped', -0.5), w('piped', 'eleven', -0.4), 0.85, stag=0.15)
band((Ds4, Fs4, As4), w('piped', 'eleven', -0.3), wc('clean', -0.3), 0.8)
flow(w('piped', 'piped', -0.1), wc('clean', -0.2), 0.0058, px(1452), px(934))
card(w('piped', 'eleven', -0.5), 0.012, px(1710)); card(w('piped', 'sixty-one', -0.5), 0.012, px(1710))
# the street, cut open: used water down the drain and under the road, through the membranes and the light, into a glass
band((Cs4, Es4, Cs5), wc('clean', -0.2), w('clean', 'pure', -0.2), 0.8)
band((Fs4, As4, Cs5), w('clean', 'pure', -0.1), wc('fear', -0.1), 0.8)
flow(w('clean', 'used', -0.3), w('clean', 'until', -0.4), 0.0052, px(300), px(1066))
flow(w('clean', 'until', 0.5), w('clean', 'pure', 1.4), 0.004, px(1430), px(1750), 200, 1100)
# the kitchen: would anyone drink it? No trust, no use; trustworthy first
band((Ds3, Ds4, Fs4, As4), wc('fear', -0.05), wc('trust', -0.1), 0.85, stag=0.12)
band((As3, Cs4, Es4), wc('trust', 0.0), wc('change', -0.2), 0.8)
band((Cs4, Es4, Cs5), wc('change', -0.1), wc('study', -0.3), 0.8)
for lid, word in (('fear', 'drink'), ('trust', 'trust'), ('change', 'trustworthy')):
    card(w(lid, word, -0.3 if lid == 'fear' else -0.2), 0.012, px(325))
# 1998 to 2000: the study; the list of how it will be judged, written before any water; then the plant runs and the bottle fills
band((Fs3, Cs4, Fs4, As4), wc('study', -0.2), wc('before', -0.2), 0.85, stag=0.12)
card(wc('study', 0.3), 0.012, px(400))
band((B3, Ds4, Fs4), wc('before', -0.1), wc('measures', 0.0), 0.75)
sheet(w('before', 'write', -0.1), 0.014, px(430), 1.6)
for i, (word, m) in enumerate((('physical', Fs4), ('chemical', As4), ('microbiological', Cs5))):
    pencil(w('measures', word, -0.2), 0.35, 0.008, px(430))
    bottle(m, w('measures', word, -0.15), w('measures', "world's", 0.3), 0.7)
pencil(w('measures', "world's", -0.2), 0.5, 0.008, px(430))
band((Fs3, Cs4), w('measures', "world's", -0.1), w('measures', 'standards', -0.1), 0.6)
flow(w('measures', 'standards', -0.6), wc('panel', -0.3), 0.0045, px(1750), px(1300))
stds = w('measures', 'standards')
mark(Fs4, stds - 0.15, pour_sec=stds + 1.8 - (stds - 0.15), hold=2.6, answer=1.1, ahold=3.0, pan=px(980))
# 2000 to 2002: the panel; the rules; result sheets pinned and ticked, one after another; the years turn; their report
band((B3, Fs4, Ds5), w('panel', 'rules', -0.5), w('report', 'July', -0.3), 0.75, stag=0.14)
card(w('panel', 'rules', -0.3), 0.012, px(440))
t0 = w('panel', 'results', -0.6); step = (w('report', 'July', -0.8) - t0) / 5
for i, sx in enumerate((660, 830, 1000, 1170, 1340)):
    pin(t0 + i * step, 0.012, px(sx + 70)); tick(t0 + i * step + 0.5, 0.008, px(sx + 100))
yr = w('panel', 'two years', -0.3)
flip(yr + 1.2, 0.01, px(1781)); flip(yr + 2.4, 0.01, px(1781))
band((Cs4, Es4, Cs5), w('report', 'July', -0.2), w('report', 'well', -0.15), 0.75)
card(w('report', 'well', -0.5), 0.014, px(1020)); tick(w('report', 'well', -0.25), 0.01, px(1340))
band((Fs4, As4, Cs5), w('report', 'well', -0.1), wc('parade', -0.6), 0.8)
contra(Fs2, w('report', 'well', 0.8), wc('parade', -0.3), 0.8)
# 9 August 2002: the parade at dusk; the wave of bottles rises across the crowd, left to right, and they drink
band((B3, Ds4, Fs4), wc('parade', -0.5), w('parade', 'raise', -0.5), 0.7)
crowd(wc('parade', -0.6), wc('flows', -0.3), w('parade', 'raise', -0.4), 0.0036)
wave = w('parade', 'raise', -0.4)
for i, (m, xx) in enumerate(((Fs3, 300), (Cs4, 700), (Fs4, 1000), (As4, 1350), (Cs5, 1650))):
    bottle(m, wave + 0.4 * i, wc('flows', -0.2), 0.85 if i == 0 else 0.72, px(xx) * 0.6)
# since 2003: the reservoir, clear water flowing in
band((B3, Ds4, B4), wc('flows', 0.0), wc('today', -0.4), 0.7, stag=0.14)
stream(wc('flows', -0.6), wc('today', -0.3), 0.004, px(260))
# today: the lab bench and its sample bottles; about 300 measures, audited every year by experts from outside
band((Fs3, Cs4, As4), wc('today', -0.3), wc('data', -0.7), 0.7)
tap(w('today', 'three hundred', -0.2), 0.01, px(1580)); tap(w('today', 'outside', -0.2), 0.01, px(1480))
bottle(Cs5, w('today', 'outside', -0.1), wc('data', -0.7), 0.6)
# the university: Jun, the agent, the census-day count it's about to change
band((As3, Cs4, Es4), wc('data', -0.6), wc('unless', -0.2), 0.7, stag=0.14)
card(w('data', 'census-day', -0.3), 0.012, px(730))
# what it brings back, and "Trust it?"; it goes back; the check comes first; the agent works, and its answer comes back ticked
band((Ds3, Ds4, Fs4, As4), wc('unless', -0.1), wc('first', -0.3), 0.75, stag=0.12)
air(w('unless', 'brings', -0.2), 1.0, 0.008, px(1150), px(1590)); tap(w('unless', 'brings', 0.7), 0.01, px(1590))
air(wc('first', -0.2), 0.8, 0.007, px(1590), px(1150))
slide(w('first', 'check', -0.3), 0.9, 0.009, px(380), px(730))
band((Cs4, Es4, Cs5), wc('first', -0.2), w('first', 'work', -0.2), 0.75)
air(w('first', 'starts'), 1.5, 0.006, px(1150)); air(w('first', 'work', -0.3), 1.0, 0.007, px(1150), px(1590))
band((Fs4, As4, Cs5), w('first', 'work', -0.1), wc('breath', -0.2), 0.75)
tick(w('first', 'use', -0.3), 0.01, px(1590))
# the title: the mark, and the chord it completes
s = mark(Fs4, wc('breath', 0.1), pour_sec=1.5, hold=2.4, answer=1.0, ahold=2.2)
band((As4, Cs5), s + 1.2, E('water') - 0.1, 0.6)

# =============================================================================================================================
# 2. The long way: one bottle, D-sharp, as the plan comes with a goal and nothing else; the search, the pages, the clock, in silence;
#    one call to Docs, a tap. What it brings back is another university's rule: D-sharp minor; Jun catches it, on the contrabassoon's
#    low D-sharp. The point on the wall: D-sharp minor again, lower, left open
lw = lambda lid, word, off=0: W('long', lid, word, off)
lc = lambda lid, off=0: G('long', lid, off)
card(lw('once', 'goal', -0.4), 0.014, px(800)); bottle(Ds4, lw('once', 'goal', -0.45), lw('once', 'goal', 2.8), 0.75)
keys(lw('once', 'check', -0.1), lw('once', 'check', 2.0), 0.019, px(800))
tap(lw('knew', 'use', -0.2), 0.009, px(600))
air(lw('knew', 'searched', -0.1), 1.4, 0.009, px(1380), px(1660))
flow0 = lw('knew', 'searched', 1.2)
slide(flow0, lw('pages', 'forty', 0.4) - flow0, 0.008, px(1660), px(1380))
tap(lw('docs', 'one call', 0.2), 0.009, px(1446))
air(lw('other', 'brought', -0.2), 1.0, 0.008, px(1200), px(710))
band((Ds4, Fs4, As4), lw('other', 'another', -0.1), lw('caught', 'caught', 0.3), 0.75)
tap(lw('caught', 'caught', -0.1), 0.01, px(710)); contra(Ds2, lw('caught', 'caught', 0.0), lw('caught', 'again', 0.4), 0.8)
air(lw('caught', 'again', -0.1), 1.6, 0.008, px(710), px(1200))
air(lc('broken', 0.2), 1.5, 0.006, px(1660), px(1380))
band((As3, Ds4, Fs4), lw('waste', 'waste', -0.1), lw('waste', 'waste', 5.0), 0.7, stag=0.14)

# 3. Plan: Clara's request; the page, on one F-sharp chord as it comes; each row written in as it's said, the tools' lock; and the
#    limit, on one bottle, C-sharp, left unresolved for the check still to come
pw = lambda lid, word, off=0: W('plan', lid, word, off)
pc = lambda lid, off=0: G('plan', lid, off)
card(pw('asks', 'asks', -0.3), 0.014, px(940))
sheet(pw('page', 'one page', -0.2), 0.016, px(920), 0.55)
band((Cs4, Fs4, As4), pw('page', 'one page', -0.3), pw('page', 'one page', 4.3), 0.75)
for a, b in ((pw('goal', 'students', -0.1), pw('goal', 'students', 2.2)), (pw('reads', "glossary's", -0.1), pw('reads', 'builds', 0.6)),
             (pw('tools', 'Catalog', -0.1), pw('tools', 'read only', 0.6)), (pw('writes', 'only', -0.1), pw('writes', 'only', 2.0)),
             (pw('never', 'names', -0.3), pw('never', 'production', 0.5)), (pw('limit', 'ten', -0.1), pw('limit', 'reports', 0.3))):
    keys(a, b, 0.019, px(920))
lock(pc('tools', -0.1), 0.012, px(1340))
bottle(Cs5, pw('limit', 'reports'), pw('limit', 'reports', 3.0), 0.65)

# 4. Define the check: as the Checks row opens, the mark, the check set before any work. Nobody knows the answer yet: its card comes in
#    beside the page. The checks, on how the levels relate and what one is, written in; the tests fly up; Jun approves them, and the
#    contrabassoon answers the mark; they lock; the agent's arm tries for one and is held. In the tests' place, the agent's two rules:
#    what everyone uses can be wrong (it says so, with evidence), and where nobody can say, the options. Then the plant, still dry, its
#    list whole: B; and its bottle's mark lights, what the water had to meet
dw = lambda lid, word, off=0: W('define', lid, word, off)
dc = lambda lid, off=0: G('define', lid, off)
pour(Fs4, dw('matters', 'matters', -0.45), dw('matters', 'matters', 1.15)); bottle(Fs4, dw('matters', 'matters', 1.2), dw('matters', 'matters', 3.8), 1.0)
card(dw('unknown', 'nobody', -0.3), 0.014, px(1635))
for a, b in ((dw('adds', 'levels', -0.1), dw('adds', 'count already', -0.2)), (dw('one', 'every', -0.1), dw('one', 'every', 1.5)),
             (dw('tests', 'writes', -0.1), dw('tests', 'approves', 0.5)), (dw('only', 'only', -0.1), dw('only', 'person', 1.3))):
    keys(a, b, 0.019, px(920))
air(dw('tests', 'writes', -0.1), 1.4, 0.008, px(1660), px(1635))
tap(dw('tests', 'approves', 0.15), 0.009, px(1500)); tap(dw('tests', 'approves', 0.35), 0.009, px(1500))
contra(Fs2, dw('tests', 'approves', -0.05), dw('tests', 'approves', 2.6), 0.85)
lock(dw('only', 'person', 0.1), 0.012, px(1820)); lock(dw('only', 'person', 0.25), 0.011, px(1820))
air(dw('only', 'moving', -0.5), 1.3, 0.007, px(1700), px(1752)); stop(dw('only', 'moving', 0.15), 0.011, px(1820))
card(dc('wrong', 0.15), 0.014, px(1635)); tap(dw('wrong', 'says so', -0.1), 0.009, px(1635))
card(dc('options', -0.1), 0.014, px(1635))
band((B3, Ds4, Fs4), dc('like', 0.0), dc('like', 4.7), 0.7, stag=0.14)
tap(dw('like', 'written', -0.1), 0.009, px(430))
tap(dw('meet', 'had to meet', -0.1), 0.009, px(700))

# 5. Do: the arms out to Docs, Catalog and Query, and what comes back; the count by level, built; the first run fails a test: D-sharp
#    minor. The query, the 28 with no level; every census day since 2021, the same, and every split short; a lock the agent doesn't
#    touch; the question for Mei: one bottle, C-sharp, open. It goes to her, with two options that both add up, each as it's said;
#    the government's list, the one she picks; her decision: B, warm. The years before, to Planning. The third level goes in; the
#    total turns green; both tests pass: F-sharp, rising. The description, and the pull request with its evidence
ow = lambda lid, word, off=0: W('do', lid, word, off)
oc = lambda lid, off=0: G('do', lid, off)
air(ow('builds', 'three words', -0.4), 0.9, 0.007, px(1230), px(1685))
for i in range(3):
    tap(ow('builds', 'three words', 0.6 + 0.3 * i), 0.007, px(1310))
air(ow('builds', 'tables', -0.3), 0.9, 0.007, px(1230), px(1685))
card(ow('builds', 'count by level', -0.5), 0.014, px(780))
fail(ow('red', 'fails', -0.1), 0.014, px(315))
band((Fs4, As4, Ds5), ow('red', 'fails', -0.15), ow('red', 'fails', 3.8), 0.7)
tap(ow('red', 'eighteen', -0.2), 0.009, px(780)); tap(oc('short', -0.2), 0.009, px(315))
air(ow('looks', 'Query', -0.4), 0.9, 0.007, px(1230), px(1685))
card(ow('looks', 'twenty-eight', -0.3), 0.014, px(810))
card(oc('since', -0.1), 0.014, px(810)); tap(ow('split', 'short', -0.2), 0.008, px(810))
stop(ow('doesnt', 'touch', -0.05), 0.011, px(500))
card(oc('meaning', -0.2), 0.014, px(810)); bottle(Cs5, oc('meaning', -0.3), oc('meaning', 2.8), 0.6)
slide(oc('asks', -1.3), 0.9, 0.008, px(810), px(-100))
slide(oc('asks', -0.35), 0.7, 0.008, px(960), px(1080))
card(ow('asks', 'two options', -0.2), 0.013, px(1080))
tap(oc('options', -0.1), 0.008, px(1080)); tap(ow('options', 'or the level', -0.1), 0.008, px(1080))
card(ow('mei', "government's", -0.3), 0.013, px(1630)); tick(ow('mei', 'non-award', -0.1), 0.01, px(1080))
card(ow('mei', 'own', -0.3), 0.014, px(1080)); land(ow('mei', 'own', -0.1), 0.01, px(1080))
band((B3, Ds4, Fs4, B4), ow('mei', 'own', -0.4), ow('mei', 'own', 3.6), 0.7, stag=0.12)
card(ow('years', 'Planning', -0.3), 0.013, px(1630))
tap(ow('again', 'adds', 0.3), 0.009, px(780))
tick(ow('again', 'eighteen', -0.2), 0.01, px(780)); tick(ow('again', 'eighteen', 0.3), 0.01, px(315)); tick(ow('again', 'every', 0.3), 0.01, px(315))
tap(oc('pass', -0.1), 0.01, px(315))
band((Fs4, As4, Cs5), oc('pass', -0.15), oc('pass', 3.5), 0.75, stag=0.3)
air(ow('pr', 'description', -0.4), 0.9, 0.007, px(1230), px(1685)); card(ow('pr', 'description', -0.15), 0.013, px(780))
sheet(ow('pr', 'pull request', -0.3), 0.016, px(540), 0.55)
ev = oc('evidence', -0.1); slide(ev, ow('evidence', 'claim', 0.4) - ev, 0.007, px(540), px(540))

# 6. Check: Jun reads the pull request against his page, a tick by each row it meets; as the checks' row is ticked, the bottle's note,
#    the work, and the contrabassoon answers it: a person holds the work to its mark. Four of ten rounds; the owner. Noor approves: the
#    same answer on C-sharp, the second person. The agent's review, for reference; into production. As in Singapore: the bottles'
#    F-sharp, with the contrabassoon under it
cw = lambda lid, word, off=0: W('check', lid, word, off)
cc = lambda lid, off=0: G('check', lid, off)
for lid, word in (('jun', 'goal'), ('jun', 'tools'), ('jun', 'names'), ('jun', 'untouched'), ('jun', 'green'), ('rounds', 'four')):
    tick(cw(lid, word, 0.1), 0.01, px(1300))
bottle(Fs4, cw('jun', 'green', 0.15), cw('jun', 'green', 2.3), 0.85); contra(Fs2, cw('jun', 'green', 1.15), cw('jun', 'green', 4.0), 0.85)
tap(cw('rounds', 'four', -0.1), 0.009, px(1635)); tap(cc('his', 0.6), 0.009, px(1635))
tick(cw('noor', 'approve', 0.2), 0.01, px(840)); tap(cw('noor', 'approve', 0.25), 0.008, px(840))
bottle(Cs5, cw('noor', 'approve', 0.2), cw('noor', 'approve', 2.3), 0.75); contra(Cs3, cw('noor', 'approve', 1.2), cw('noor', 'approve', 3.9), 0.8)
tap(cw('never', 'review', -0.2), 0.008, px(840))
slide(cw('never', 'approves', -0.5), 1.0, 0.008, px(840), px(1540))
knock_ = lambda s, g, pan: s_knock(s, g * FX, pan, 260)
knock_(cc('outside', -0.2), 0.008, px(960))
band((As4, Cs5, Fs5), cc('outside', -0.2), cc('outside', 4.4), 0.7, stag=0.14); contra(Fs2, cc('outside', 0.6), cc('outside', 4.4), 0.7)

# 7. What the loop leaves: the steps become a ring, a bottle for each step as it comes on, Plan, Define the check, Do, Check, rising;
#    a light goes round it. A decision, its metadata, a skill, each laid on the bench; and the plan itself, back for the next job: the
#    open fifth of F-sharp, as the next one starts from it
vw = lambda lid, word, off=0: W('leaves', lid, word, off)
vc = lambda lid, off=0: G('leaves', lid, off)
r0 = vw('next', 'loop', -0.4)
air(r0, 1.6, 0.008, px(760))
for i, m in enumerate((Fs4, As4, Cs5, Fs5)):
    tap(r0 + 0.4 * i - 0.05, 0.007, px((760, 930, 760, 590)[i])); bottle(m, r0 + 0.4 * i, r0 + 3.2, 0.62, px((760, 930, 760, 590)[i]) * 0.6)
air(r0 + 1.9, 2.0, 0.006, px(760))
for i, lid in enumerate(('decision', 'meta', 'skill')):
    land(vc(lid, 0.5), 0.013, px(340 + 470 * i))
slide(vc('plan', -0.2), 0.9, 0.009, px(1920), px(1705))
band((Fs4, Cs5), vw('plan', 'starts', -0.3), vw('plan', 'starts', 3.3), 0.65, stag=0.2)

# 8. Trust, earned: the panel, the measures set before the first drop: the bottle's F-sharp, answered as their report comes. The
#    parade: the bottles raised again, C-sharp, F-sharp, A-sharp and C-sharp, left to right. The university: the count goes to the
#    government with its evidence. The takeaway: the mark, the last time, and the end card on the F-sharp chord it completes
tw = lambda lid, word, off=0: W('trust', lid, word, off)
tc = lambda lid, off=0: G('trust', lid, off)
bottle(Fs4, tw('sg', 'first drop', -0.1), tw('sg', 'outside', 0.4), 0.8); contra(Fs2, tw('sg', 'outside', -0.1), tw('sg', 'outside', 2.0), 0.75)
card(tw('sg', 'outside', -0.2), 0.013, px(1020)); tick(tw('sg', 'outside', 0.0), 0.009, px(1340))
crowd(tc('bottle', -0.5), tc('uni', -0.3), tw('bottle', 'raised', -0.4), 0.0033)
wave = tw('bottle', 'raised', -0.3)
for i, (m, xx) in enumerate(((Cs4, 400), (Fs4, 800), (As4, 1200), (Cs5, 1600))):
    bottle(m, wave + 0.4 * i, wave + 3.6, 0.8 if i == 0 else 0.7, px(xx) * 0.6)
card(tc('uni', -0.2), 0.013, px(800))
air(tw('send', 'government', -0.2), 1.1, 0.008, px(800), px(1550)); sheet(tw('send', 'government', 0.8), 0.012, px(1550), 0.4)
tick(tw('send', 'evidence'), 0.01, px(1820))
s = mark(Fs4, tc('take', 0.2), pour_sec=1.5, hold=2.6, answer=1.0, ahold=3.6)
band((As4, Cs5), tc('breath', 0.2), tc('breath', 4.0), 0.6, stag=0.2)
