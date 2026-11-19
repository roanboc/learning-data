# Wellbeing is in the work: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The palette, its own (the module's palettes.md, row 16: reserved by this film's thread on 12 November 2026, after every score.py and
# music.py on main and on the open branches was searched: no film plays a portative organ, and none of this module plays any organ):
# a portative organ, made here, as music.py has none.
#  - The portative organ (an organetto): the small organ of the 1300s that sits on the player's knee, one hand on its keys, the other on
#    its bellows. So it plays one line, a note at a time, and every phrase ends where the bellows must fill again: the pause is part of
#    the instrument. Open wooden pipes, C sharp 4 to F sharp 5 here: mostly the fundamental, a little breath, a soft chiff as each pipe
#    speaks. When the wind runs low a pipe is quieter, thinner (its upper partials go first) and a few cents flat.
#  - Its partner: its own two longest pipes, each stopped with a wooden plug, so it sounds an octave lower, round and hollow (a stopped
#    pipe has only its odd partials): B2 and G sharp 2, touched one at a time under a turn. One instrument, the hand that plays and the
#    hand that gives it wind, as the film's page has what the work asks and what helps.
# The mark: nine notes, F# B C# D# E D# C# A# B. Played with no rests, each note thinner as the wind runs out, until the last doesn't
#    sound: the bridge of 2020, and Marta's week (nine picked up, none finished). Played with its rests written in, three notes to a
#    bellows, whole: the bridge made new in three days, and Marta's three at a time. It has the scale's fourth and seventh notes (E and
#    A sharp), so it can't read as a five-note tune.
# B major, G sharp minor for the problem (the stopped G sharp). Every note is tuned pure from B (just intonation, see hz()), and the
#    organ plays one line: two notes sound together only when a stopped pipe holds under the line, and then on pure intervals from it
#    (never C sharp over the stopped G sharp).
# Kept apart from the site's pipe and reed organs and from Modern data basics' serinette and organette: one line, never a chord held
#    under the voice; a small wooden room, no church's tail; the wind's own shape. And nothing Andean for the bridge: no panpipes, quena
#    or ocarina, and the pipes are kept from reading as one: little breath, each note a key's clean start and stop, even steps, never a
#    slide between notes, no vibrato (the module's palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each pipe steady while its key is down. No urgent pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/ww_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.4 kHz; the effects about 15 dB under the music.

import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    """when a word of a line is spoken, as the film's own wAt() estimates it; a missing word, or one inside a longer word, stops the mix"""
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def after(sid, lid, off=0):
    """when a line has been said: its start, and how long the voice takes over it"""
    return G(sid, lid) + _DUR[sid + '/' + lid] + off
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1349)  # this film's own randomness: the room, the pen

# ---- tuning: just intonation from B, so the notes that sound together are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 35, 12)
    return 61.735413 * 2 ** o * _JI[pc]
Gs2, B2 = 44, 47
Cs4, Ds4, E4, Fs4, Gs4, As4, B4, Cs5, Ds5, E5, Fs5 = 61, 63, 64, 66, 68, 70, 71, 73, 75, 76, 78

# ---- the levels: a held pipe carries more than a plucked string, so the organ sits as far under the voice as the module's other music
# by its loudness, not its peaks; the effects about 15 dB under it (FX scales them all). LV[0] is the chapter's own level
LO, LS, FX = 0.034, 0.033, 3.2
LV = [1.0]

# a small wooden room round the organ, ringing for half a second: no church. Its level is set by what it rings where the notes are (its
# gain from 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry
def _band(ir):
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.5)).astype(np.float32))(np.arange(int(0.5 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.012 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out
def _bn(n, lo, hi):
    """n samples of noise between lo and hi Hz"""
    return filt(noise(n / SR + 0.02)[:n], 'band', (lo, hi)).astype(np.float64)

# ---- the pipes
_OPEN = (1.0, 0.30, 0.13, 0.055, 0.03, 0.016)   # an open wooden pipe: mostly its fundamental, a little of the next few partials
_STOP = ((1, 1.0), (3, 0.32), (5, 0.07))        # a stopped one: its odd partials only, so it is round and hollow
def _amp(wind):
    """how loud a pipe speaks on this much wind"""
    return 0.15 + 0.85 * wind ** 1.2
def pipe(m, s, d, g=1.0, pan=None, wind=1.0, fade=0.0, room=0.22, until=None):
    """an open pipe, speaking at s while its key is down for d seconds. wind (1 to 0): how full the bellows are; as they run out the
    note is quieter, thinner and a few cents flat. fade: the wind giving out inside the note, over its last fade seconds"""
    if until is not None:
        d = min(d, max(0.1, until - s - 0.2))
    n = int((d + 0.2) * SR); x = np.arange(n, dtype=np.float64) / SR
    w = np.full(n, float(wind))
    if fade:
        w = w * (1 - 0.8 * np.clip((x - (d - fade)) / fade, 0, 1) ** 1.3)
    f = hz(m) * 2 ** (-(1 - w) ** 1.5 * 14 / 1200)
    ph = 2 * np.pi * np.cumsum(f) / SR
    sig = np.zeros(n)
    for k, a in enumerate(_OPEN, 1):
        if hz(m) * k > 2300:
            break
        # each partial builds at its own rate (the upper ones first: the pipe's speech); thin wind takes the upper ones first
        sig += a * w ** (0.7 * (k - 1)) * np.sin(k * ph + 0.4 * k) * (1 - np.exp(-x / (0.034 / k ** 0.6)))
    # the chiff: the pipe's second and third partials, and a puff of air, for a few hundredths of a second as it speaks
    chf = (0.22 * np.sin(2 * ph) + 0.16 * np.sin(3 * ph)) * np.exp(-x / 0.028) * (1 - np.exp(-x / 0.003))
    chf = chf + 0.07 * _bn(n, max(500, 1.6 * hz(m)), 2200) * np.exp(-x / 0.016)
    air = 0.05 * _bn(n, min(1500, 1.5 * hz(m)), 2200)                                  # a little breath at the pipe's mouth
    key = (1 - np.exp(-x / 0.008)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.04))   # the key down, and up
    a0 = _amp(1.0) ; lev = (0.15 + 0.85 * w ** 1.2) / a0 if fade else 1.0
    sig = ((sig * lev + chf * min(1.0, 0.4 + wind) + air) * key).astype(np.float32)
    sig = norm(filt(filt(sig, 'low', 2300, 4), 'high', 150)) * np.float32(_amp(wind))
    sig = _room(sig, room, 0.25 if d > 0.6 else 0.0, max(0.3, d - (fade or 0)))
    if until is not None:
        sig = _until(sig, s, until)
    put(sig, s, g * LV[0] * LO, max(-0.3, min(0.3, (m - 71) * 0.025)) if pan is None else pan)
def air(m, s, d=0.45, g=1.0, pan=None):
    """a pipe that doesn't speak: its key goes down and there is no wind left for it, only a breath at its mouth"""
    n = int((d + 0.15) * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _bn(n, min(1400, 1.5 * hz(m)), 2100) * np.sin(np.pi * np.clip(x / (d + 0.1), 0, 1)) ** 0.8 * np.exp(-x / (0.6 * d))
    put(norm(filt(sig.astype(np.float32), 'low', 2000, 4)), s, 0.2 * g * LV[0] * LO, max(-0.3, min(0.3, (m - 71) * 0.025)) if pan is None else pan)
def stopped(m, s, d, g=1.0, pan=-0.1, room=0.22, until=None):
    """one of the two long pipes, stopped: round and hollow, speaking a little slower than the open ones, with almost no breath"""
    if until is not None:
        d = min(d, max(0.1, until - s - 0.25))
    n = int((d + 0.3) * SR); x = np.arange(n, dtype=np.float64) / SR; f0 = hz(m)
    sig = np.zeros(n)
    for k, a in _STOP:
        sig += a * np.sin(2 * np.pi * f0 * k * x + 0.3 * k) * (1 - np.exp(-x / (0.07 / k ** 0.5)))
    sig += 0.1 * np.sin(2 * np.pi * f0 * 5 * x) * np.exp(-x / 0.035) * (1 - np.exp(-x / 0.004))   # its own chiff, a fifth partial
    sig += 0.012 * _bn(n, 250, 900)
    sig = (sig * (1 - np.exp(-x / 0.012)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.07))).astype(np.float32)
    sig = _room(norm(filt(filt(sig, 'low', 1500), 'high', 60)), room, 0.25 if d > 0.6 else 0.0, max(0.3, d))
    if until is not None:
        sig = _until(sig, s, until)
    put(sig, s, g * LV[0] * LS, pan)
def _until(sig, s, until):
    """a sound that must be gone by until (a chapter's cut): faded out over its last 0.15 s"""
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); f = min(n, int(0.15 * SR)); sig[n - f:] *= np.linspace(1, 0, f, dtype=np.float32)
    return sig

# ---- what they play
def line(notes, s, step=0.36, g=1.0, wind=1.0, last=None, fade=0.0, until=None, times=None):
    """a phrase on one bellows: the notes one after another, each key up as the next goes down. wind: one number, or one for each note
    (the bellows running out); last: how long the last key is held; fade: the wind giving out inside the last note"""
    k = len(notes)
    for i, m in enumerate(notes):
        at = s + (times[i] if times else step * i)
        d = (last if (last and i == k - 1) else (times[i + 1] - times[i] if (times and i < k - 1) else step)) - 0.03
        pipe(m, at, d, g, None, wind[i] if isinstance(wind, (list, tuple)) else wind, fade if i == k - 1 else 0.0, until=until)
    return s + (times[-1] if times else step * (k - 1)) + (last or step)
MARK = (Fs4, B4, Cs5, Ds5, E5, Ds5, Cs5, As4, B4)
def breathless(s, step=0.33, g=1.0, w0=1.0, w1=0.4, fails=False):
    """the mark with no rests: nine notes on one bellows, each thinner than the one before; fails: the ninth key goes down on no wind"""
    ws = [w0 + (w1 - w0) * i / 8 for i in range(9)]
    if fails:
        line(MARK[:8], s, step, g, ws[:8], last=step, fade=0.2)
        air(MARK[8], s + step * 8, 0.45, g)
    else:
        line(MARK, s, step, g, ws, last=step * 2.2, fade=step * 1.4)
def whole(s, step=0.36, rest=0.38, g=1.0, last=1.2, low=None, until=None):
    """the mark with its rests written in: three notes to a bellows, the third a little longer, and the bellows filled in the rest that
    follows; low: a stopped pipe under the last note"""
    t1 = s + step * 3.45 + rest; t2 = t1 + step * 3.45 + rest
    line(MARK[:3], s, step, g, last=step * 1.45, until=until); line(MARK[3:6], t1, step, g, last=step * 1.45, until=until)
    end = line(MARK[6:], t2, step, g, last=last, until=until)
    if low:
        stopped(low, t2 + step * 2, last + 0.1, 0.75 * g, until=until)
    return end

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k
def _slow(n, hz_):
    """a slow, uneven swell between 0 and 1, for a texture that isn't flat"""
    g = filt(noise(n / SR + 0.02)[:n], 'low', hz_).astype(np.float64); return g / max(1e-9, float(np.abs(g).max()))

def sheet(s, g=0.0035, pan=0.0):
    """a sheet pinned up or laid down: a soft flap of paper, and its faint landing"""
    n = int(0.17 * SR); x = np.arange(n) / SR
    fl = _bn(n, 360, 1700) * _bump(x, 0.075) * (x < 0.075)
    _fx(fl + 0.55 * _knock(n, 140, 0.018, 0.065) / 1.35, s, g, pan, 1800)
def tap(s, g=0.0032, pan=0.0, low=False):
    """something small set in place, a tag or a pill: one soft, short tap (low: a duller one)"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(_bn(n, 230, 1000) * np.exp(-x / 0.007) + 0.6 * _knock(n, 150 if low else 200, 0.013), s, g, pan, 1100 if low else 1500)
def rub(s, sec=0.9, g=0.0032, pan=0.0):
    """cards slid over a wall, or a line drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(_bn(n, 200, 1250) * _bump(x, sec, 1.4) * (0.7 + 0.3 * _slow(n, 30)), s, g, pan, 1400)
def pen(s, sec=0.5, g=0.0045, pan=0.0, n=2):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        _fx(_bn(m, 700, 2000) * _bump(x, d, 0.6) * (0.3 + 0.7 * np.abs(_slow(m, 60))), t, g, pan, 2100)
def rustle(s, sec=0.8, g=0.0035, pan=0.0):
    """many small cards coming in at once, heard as one: a soft swell of paper, never a card each"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(_bn(n, 450, 1900) * _bump(x, sec, 1.2) * (0.55 + 0.45 * np.abs(_slow(n, 18))), s, g, pan, 2000)
def river(s, sec=4.0, g=0.0035, pan=0.0):
    """the river, far below: one low wash that swells in and away"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(_bn(n, 140, 650) * _bump(x, sec, 1.1) * (0.75 + 0.25 * _slow(n, 3)), s, g, pan, 800)
def rain(s, sec=1.8, g=0.003, pan=0.0):
    """rain on grass rope: a soft, even hush, swelling in and away"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(_bn(n, 700, 2000) * _bump(x, sec, 1.3) * (0.8 + 0.2 * _slow(n, 12)), s, g, pan, 2100)
def gust(s, sec=1.8, g=0.0035, pan=0.0):
    """wind through the gorge: a low breath of air that rises and falls once"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(_bn(n, 110, 480) * _bump(x, sec, 1.6) * (0.7 + 0.3 * _slow(n, 2)), s, g, pan, 600)
def creak(s, g=0.0035, pan=0.0, sec=0.5):
    """a rope taking weight: one low, dry groan"""
    n = int(sec * SR); x = np.arange(n) / SR
    f = 190 + 60 * x / sec; ph = 2 * np.pi * np.cumsum(f) / SR
    body = (np.sin(ph) + 0.4 * np.sin(2 * ph)) * (0.45 + 0.55 * np.abs(np.sin(2 * np.pi * 11 * x) ** 3))
    _fx((body + 0.5 * _bn(n, 200, 700)) * _bump(x, sec, 1.2), s, g, pan, 900)
def twist(s, sec=1.4, g=0.003, pan=0.0):
    """grass rope twisted tight and tied: a dry, fibrous rub, slower and lower than paper"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(_bn(n, 180, 900) * _bump(x, sec, 1.3) * (0.5 + 0.5 * np.abs(_slow(n, 9))), s, g, pan, 1000)
def tread(s, n=4, g=0.003, pan0=0.0, pan1=0.0, gap=0.46):
    """someone walking on a woven floor, or on earth: a few soft, dull footfalls"""
    for i in range(n):
        m = int(0.12 * SR); x = np.arange(m) / SR
        _fx(_knock(m, 105, 0.022) + 0.3 * _bn(m, 180, 700) * np.exp(-x / 0.012), s + gap * i, g, pan0 + (pan1 - pan0) * i / max(1, n - 1), 800)
def fall(s, g=0.004, pan=0.0):
    """the rope giving way: a creak, a low rush of air as the floor drops, and, far below, the river taking it"""
    creak(s - 0.05, 0.8 * g, pan, 0.4)
    n = int(1.1 * SR); x = np.arange(n) / SR
    _fx(_bn(n, 70, 320) * _bump(x, 1.1, 1.3), s + 0.1, g, pan, 420)
    river(s + 0.85, 2.4, 0.85 * g, pan)

# =============================================================================================================================
# 1. Before it falls: the opening. Quehue: the stopped B under the gorge, and the mark's first three notes, whole; its next three as
#    the four communities are named; its last three, home on B, for "since the time of the Incas". Sun, rain and wind: the stopped G
#    sharp, the problem's note. Five months on, sagging: the mark with no rests, thinner note by note, and all nine still sound. 2020,
#    not renewed: the stopped G sharp again; then the mark once more on less wind, and where the bridge falls the ninth key goes down on
#    nothing. Nothing under what people need. The custom: the stopped B on "a date"; the three days' weaving: the mark with its rests,
#    three notes to a bellows, whole. More than five hundred years: one B, held over the stopped B. A team's work wears too: the
#    stopped G sharp; it shows in a person: one thin A sharp, left unresolved. Renewed on a date: the mark's first three as the cards take
#    their order, and its other six, home, under the title card
LV[0] = 1.0
ow = lambda lid, word, off=0: W('bridge', lid, word, off)
oc = lambda lid, off=0: G('bridge', lid, off)
END = E('bridge')
river(0.3, 4.2, 0.0035, 0.0)
stopped(B2, 0.4, 2.6, 0.7)
line(MARK[:3], 0.9, 0.42, 0.85, last=1.0)
sheet(ow('where', 'Quehue', -0.2), 0.0035, px(960))
sheet(ow('who', 'Four', -0.2), 0.0035, px(960))
line(MARK[3:6], ow('who', 'Four', 0.2), 0.46, 0.8, last=0.9)
line(MARK[6:], ow('since', 'account', 0.0), 0.42, 0.8, last=1.9)
stopped(B2, ow('since', 'account', 0.84), 2.0, 0.6)
# a year of weather: sun, rain and wind, a tag each; the rope weakens
rain(ow('wears', 'rain', -0.2), 1.7, 0.003, px(960))
gust(ow('wears', 'wind', -0.2), 1.9, 0.0035, px(1220))
stopped(Gs2, ow('wears', 'weakens', -0.2), 1.9, 0.7)
creak(ow('sag', 'sagging', -0.2), 0.0035, px(820))
breathless(ow('sag', 'sagging', 0.1), 0.33, 0.8, 1.0, 0.42)
tread(ow('holds', 'carries', -0.3), 4, 0.003, px(600), px(680))
# 2020: not renewed; March 2021: it fell
tap(ow('missed', 'twenty', -0.1), 0.0028, px(960))
stopped(Gs2, ow('missed', 'not', -0.1), 1.7, 0.7)
rain(oc('missed', 0.6), 3.4, 0.0026, px(960))
FELL = ow('fell', 'fell', -0.1)
breathless(FELL - 8 * 0.34, 0.34, 0.8, 0.72, 0.2, fails=True)
fall(FELL, 0.004, px(960))
# the custom: each year, on a date, the whole bridge made new, in three days
stopped(B2, ow('custom', 'date', -0.2), 2.0, 0.7)
twist(oc('custom', 0.6), 2.2, 0.0028, px(960))
S3 = oc('three', -0.6)
twist(S3 + 0.2, 1.4, 0.0028, px(380)); twist(S3 + 1.7, 1.4, 0.0028, px(1510))
whole(S3 + 0.2, 0.36, 0.38, 0.85, last=1.5)
tap(ow('june', 'wove', -0.3), 0.003, px(960))
tread(ow('june', 'foot', -0.3), 4, 0.003, px(630), px(700))
sheet(ow('lasts', 'account', -0.3), 0.0035, px(960))
stopped(B2, ow('lasts', 'account', 0.0), 3.0, 0.6)
pipe(B4, ow('lasts', 'account', 0.4), 2.5, 0.75)
# a team's work is arranged too: the desk, and what lands on it
stopped(Gs2, ow('team', 'wears', 0.0), 1.7, 0.7)
pipe(As4, ow('shows', 'person', -0.2), 1.1, 0.8, wind=0.5, fade=0.7)
# renewed on a date: the cards take their order, each with a date; and the title card
REN = ow('look', 'date', -0.3)
line(MARK[:3], REN + 0.3, 0.38, 0.8, last=0.9)
line(MARK[3:6], after('bridge', 'look', 0.3), 0.4, 0.85, last=0.9)
TT = oc('breath', 0.25)
line(MARK[6:], TT, 0.4, 0.85, last=3.4, until=END - 0.4)
stopped(B2, TT + 0.8, 3.4, 0.7, until=END - 0.4)

# 2. Fourteen, all urgent: Helena's card; the 46 on the wall, one soft swell of paper, and the fourteen slid down beside Marta; each
#    called urgent, a duller tap; the last one hopping to the front; nobody to blame. The advice to cope: three thin notes, falling, a
#    line each; the fourteen would still be there: the stopped G sharp, alone; the work, ringed, and B major rising for "the work,
#    before the person"
LV[0] = 1.0
fw = lambda lid, word, off=0: W('fourteen', lid, word, off)
fc = lambda lid, off=0: G('fourteen', lid, off)
MV = fw('marta', 'wait', -0.2)
HOP = fw('last', 'whoever', -0.1)
for (wd, off), m, w in zip((('plan', -0.2), ('push', -0.2), ('day', -0.4)), (Cs5, B4, Gs4), (0.6, 0.48, 0.36)):
    pipe(m, fw('cope', wd, off), 0.5, 0.8, wind=w)
stopped(Gs2, fw('still', 'still', -0.1), 1.6, 0.7)
line((B4, Ds5, Fs5), fw('work', 'before', -0.2), 0.3, 0.8, last=1.2)

# 3. One week, on one page: the sheet; three tags; the page pinned up, and a pen for each line written on it. Nine picked up, none
#    finished: the mark with no rests, on less and less wind, and its ninth key on nothing. Two Sundays: the stopped G sharp. What
#    helps: two full notes, the second answering the first. Both sides are in how the work is arranged: the two stopped pipes, one
#    after the other, in the pause
LV[0] = 1.0
pw = lambda lid, word, off=0: W('page', lid, word, off)
pc = lambda lid, off=0: G('page', lid, off)
breathless(pw('nine', 'nine', 0.2), 0.29, 0.8, 0.85, 0.22, fails=True)
stopped(Gs2, pw('sundays', 'Sundays', -0.3), 1.6, 0.7)
line((Ds5, Fs5), pw('helps', 'Jun', 0.0), 0.42, 0.8, last=0.9)
PB = after('page', 'both', 0.4)
stopped(Gs2, PB, 0.75, 0.7); stopped(B2, PB + 0.78, 1.9, 0.7, until=E('page') - 0.2)

# 4. Three things everyone needs: a sheet and a full note for each, B, D sharp, F sharp. Marta's week read against them: a tag each, and
#    for "alone" the stopped G sharp, alone. The studies: cards only. Needs met: the three notes again, close together, a tick each.
#    The laptop: a dull tap. Nothing on the page is about Marta: the three notes coming home, falling, over the stopped B, in the pause
LV[0] = 1.0
nw = lambda lid, word, off=0: W('needs', lid, word, off)
nc = lambda lid, off=0: G('needs', lid, off)
for wd, m, x in (('say', B4, 390), ('good', Ds5, 960), ('belong', Fs5, 1530)):
    pipe(m, nw('three', wd, -0.2), 0.7, 0.75)
stopped(Gs2, nw('marta', 'alone', -0.1), 1.6, 0.7)
line((B4, Ds5, Fs5), nw('care', 'Meet', -0.2), 0.25, 0.8, last=1.0)
NB = after('needs', 'about', 0.3)
stopped(B2, NB, 2.6, 0.7, until=E('needs') - 0.2)
line((Fs5, Ds5, B4), NB + 0.25, 0.4, 0.8, last=1.5, until=E('needs') - 0.2)

# 5. An order, agreed: the sheet, the page, two tags; what Helena wrote down, a sheet each, and for what both want, the two notes of
#    what helps. Agreed: the fourth falling to the third over the stopped B. Two struck out, a pen; the twelve slid into their order,
#    numbered, dated. Three at a time: the mark with its rests written in, three notes to a bellows, whole. A new request slid in to
#    Helena, and set in its place; and the stopped B, alone, in the pause
LV[0] = 1.0
rw = lambda lid, word, off=0: W('order', lid, word, off)
rc = lambda lid, off=0: G('order', lid, off)
line((Ds5, Fs5), rw('they', 'Both', 0.0), 0.42, 0.8, last=0.9)
AG = rw('agree', 'agree', -0.4)
stopped(B2, AG + 0.05, 2.3, 0.7); line((E5, Ds5), AG + 0.3, 0.6, 0.8, last=1.3)
GONE = rw('agree', 'Two', -0.2)
ORD = rw('agree', 'twelve', -0.4)
whole(rw('three', 'three', -0.3), 0.36, 0.38, 0.85, last=1.0)
PL = rw('door', 'places', -0.3)
stopped(B2, after('order', 'door', 0.5), 2.2, 0.7, until=E('order') - 0.2)

# 6. Where to look: the gorge in 1972: the stopped G sharp; two visitors walking up; gleaming like gold: one high note on thin wind,
#    sagging. The keeper's words: a sheet, and nothing under them; then the mark's last notes on almost no wind, and the last one
#    doesn't sound. The room: the list, a pen for each line; the hazards' list, and a tap as each is marked
LV[0] = 1.0
kw = lambda lid, word, off=0: W('keeper', lid, word, off)
kc = lambda lid, off=0: G('keeper', lid, off)
stopped(Gs2, S0('keeper') + 0.15, 1.8, 0.7)
tread(kc('gold', 0.5), 4, 0.0028, px(1780), px(1560))
pipe(Fs5, kw('gold', 'gleaming', -0.1), 1.3, 0.8, wind=0.5, fade=0.8)
DY = after('keeper', 'dying', 0.15)
line((Cs5, As4), DY, 0.4, 0.8, (0.42, 0.26), last=0.4, fade=0.2); air(B4, DY + 0.8, 0.45, 0.8)

# 7. Three signs, and a limit: the list, and three notes falling, each on less wind than the last, as the signs are named. The World
#    Health Organization's sheet and tags. What a manager does: the same three notes rising, on full wind. Where her part ends: a line
#    drawn, and one note that stops clean. Professional help, kept private: a sheet, a tap, and nothing more
LV[0] = 1.0
sw = lambda lid, word, off=0: W('signs', lid, word, off)
sc_ = lambda lid, off=0: G('signs', lid, off)
for wd, m, w in (('worn', Ds5, 0.62), ('distant', B4, 0.46), ('feeling', Gs4, 0.32)):
    pipe(m, sw('signs', wd, -0.3), 0.55, 0.8, wind=w, fade=0.25)
line((Gs4, B4, Ds5), sw('ask', 'asks', -0.3), 0.4, 0.8, last=1.0,
     times=(0.0, sw('ask', 'listens', -0.3) - sw('ask', 'asks', -0.3), sw('ask', 'changes', -0.3) - sw('ask', 'asks', -0.3)))
LT = sw('part', 'end', -0.6)
pipe(B4, LT + 0.05, 0.9, 0.8)

# 8. Ask everyone, in writing: the seven, a tap for the first name and the last; the five questions, a step of the scale for each;
#    in writing: a pen, and the quiet answer and the loud one, the same note on little wind and on full. The answers shown: a rub as
#    each row of dots is counted; what wears them out: the stopped G sharp. What has changed, and a date for the rest: the fourth
#    falling to the third over the stopped B, in the pause
LV[0] = 1.0
aw = lambda lid, word, off=0: W('ask', lid, word, off)
ac = lambda lid, off=0: G('ask', lid, off)
line((B4, Cs5, Ds5, E5, Fs5), aw('five', 'five', -0.3), 0.3, 0.8, last=0.9)
QT = after('ask', 'quiet', 0.1)
pipe(B4, QT, 0.5, 0.8, wind=0.34); pipe(B4, QT + 0.62, 0.7, 0.8)
stopped(Gs2, ac('wears', 0.2), 1.7, 0.7)
AB = after('ask', 'changed', 0.3)
stopped(B2, AB, 2.5, 0.7, until=E('ask') - 0.2); line((E5, Ds5), AB + 0.25, 0.6, 0.8, last=1.4, until=E('ask') - 0.2)

# 9. On a date: Quehue: last year's bridge cut loose while it still holds, the same soft fall; the new one woven, and the mark's first
#    three notes, whole; never the people: the stopped B, alone. Helena's date: the months drawn out, June ringed, and the five
#    questions' five steps again. Marta's twelve: six ticked; no Sunday: the two notes of what helps. Four things to do this week, a
#    sheet each, and nothing under them. The last line, then the mark with its rests, whole, home on a B held over the stopped B
LV[0] = 1.0
dw = lambda lid, word, off=0: W('date', lid, word, off)
dc = lambda lid, off=0: G('date', lid, off)
fall(dw('cut', 'holds', 0.2), 0.0036, px(1170))
R0 = dc('renew', 0.1)
twist(R0 + 0.2, 1.4, 0.0028, px(520)); twist(R0 + 1.7, 1.4, 0.0028, px(1400))
line(MARK[:3], R0 + 0.2, 0.38, 0.85, last=1.0)
stopped(B2, dw('renew', 'never', -0.2), 2.4, 0.7)
tread(R0 + 5.2, 4, 0.0028, px(560), px(760))
line((B4, Cs5, Ds5, E5, Fs5), dw('june', 'five', -0.3), 0.3, 0.8, last=0.9)
HT = dw('marta', 'twelve', 0.2)
line((Ds5, Fs5), dw('marta', 'Sunday', -0.4), 0.42, 0.8, last=0.9)
whole(after('date', 'end', 0.25), 0.36, 0.38, 0.9, last=3.4, low=B2, until=TOT - 0.15)


# ---- what the hands write: Carmen's and Helena's boards and the pages of Helena's notebook. A row waits until whoever writes has
# walked to it (PK.pace), so the marker's and the pen's sounds ask the film when each row is written (the people kit's tools/pens.py).
# And the messages: each one that comes in, a soft blip that falls; each sent, one that rises
import pens
PEN = pens.written({'A': ('page', 'carmen', 'ww_boardA'), 'B': ('needs', 'carmen', 'ww_boardB'), 'C': ('order', 'helena', 'ww_boardC'),
                    'D': ('keeper', 'carmen', 'ww_boardD'), 'E': ('signs', 'carmen', 'ww_boardE'), 'F': ('ask', 'helena', 'ww_boardF'),
                    'N1': ('fourteen', None, 'ww_note1'), 'N2': ('page', None, 'ww_note2'), 'N3': ('needs', None, 'ww_note3'),
                    'N4': ('order', None, 'ww_note4'), 'N5': ('signs', None, 'ww_note5'), 'N6': ('date', None, 'ww_note6')})
def marker(s, sec=1.6, g=0.004, pan=0.0, n=3):
    """a marker on a whiteboard, a word at a time: a soft, low rub, never a squeak"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        _fx(_bn(m, 350, 1300) * _bump(x, d, 0.7) * (0.4 + 0.6 * np.abs(_slow(m, 40))), t, g, pan, 1500)
def written(name, hand, g, least=0.28):
    """a board's or a page's rows as the hand writes them (PEN): one soft rub for each row and each long mark, a word at a time"""
    for k in PEN[name]:
        d = k['t1'] - k['t0']
        if d >= least:
            hand(k['t0'], d, g, px(k['x']) * 0.5, max(1, round(d / 0.32)))
def pop(s, g=0.0022, pan=0.0, up=True):
    """a message sent (up) or one that arrives: one soft, round blip that rises, or falls, a little"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    f = 430 * 2 ** ((0.4 if up else -0.4) * np.clip(x / 0.07, 0, 1))
    _fx(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, x / 0.005) * np.exp(-x / 0.04), s, g, pan, 1600)

for name in ('A', 'B', 'D', 'E'):
    written(name, marker, 0.004)
for name in ('C', 'F'):
    written(name, marker, 0.004)
for name in ('N1', 'N2', 'N3', 'N4', 'N5', 'N6'):
    written(name, pen, 0.004)
# Marta's inbox: two requests come in, each called urgent
pop(fw('urgent', 'urgent', -0.2), 0.0022, px(1200), up=False); pop(fw('urgent', 'urgent', 0.5), 0.0022, px(1200), up=False)
# Helena's five questions, sent; Jun's answer, sent back
pop(aw('five', 'sends', 0.2), 0.0022, px(1000), up=True); pop(ac('needs', 1.0), 0.0022, px(1000), up=False)
