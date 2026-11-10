# Better every week: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (the data management palettes.md, row reserved 10 November 2026 after searching every score.py,
# music.py, sound.py and audio.py on main and on every branch, and every palettes.md in the project's files, for "psalmodi", "salmodi",
# "bowed monochord", "one-string", "single-string", "box zither", "people's organ", "sifferskrift" and "number notation": none): a
# psalmodikon, made here, as music.py has none.
#  - The psalmodikon: the long, narrow box with one bowed string that village schools and churches in the Nordic countries used in the
#    1800s, where there was no organ, to lead singing in tune. Its frets are numbered, so anyone could play a tune written in numbers,
#    and it was used until a better way came, as the Job Methods card says of every method. Each note is pressed onto its staple fret
#    with a soft click, then bowed plain and held at one level: no vibrato, no slide, one note at a time (it has one string), never a
#    drone. Its colour is the hollow of a long, narrow wooden box: broad, low body resonances and a faint ripple from the box's length;
#    no strings that ring by themselves after a note, no buzzing bridge, no horn and no nasal peak, so it doesn't read as a violin.
#  - Its partner: a larger psalmodikon, its box twice as long, an octave lower, bowed once under a turn and left to settle.
#    Nothing in the score is American from the 1940s, and nothing Japanese for kaizen; no factory whistles and no machine rhythms.
# The mark: the long way, then the better way. Six notes that wind to the home note (in the psalmodikon's own numbers 3, 4, 2, 5, 7, 1:
# C, D flat, B flat, E flat, G, A flat), then the same arrival in two (7, 1: G, A flat), as the film's team turns six days into one.
# The six notes play under the worker's long way, whole under the title, under the team's own long way (the four steps of a request)
# and at the close; the two alone when the course's better way arrives, and when one day replaces six.
# A flat major, F minor for the opening's problem. Every chord is tuned pure from A flat (just intonation, see hz()): A flat, D flat and
# E flat major and F and C minor are pure in this table; B flat minor is not, and is never played. No chapter is urgent: nothing pulses.
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: each bowed note held at one level from the bow's start to its stop; each damped before the next chapter.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/bw_scenes.js, and
#    panned to where it is drawn. Everything low and soft, below about 2.4 kHz; the effects about 12 dB under the music.

# when a word of a line is spoken, as the film's own wAt() estimates it: along the line's voiced length, from the words the voice reads.
# wAt() takes a word's first appearance, even inside a longer word, and falls back to the line's start when it's missing; here either
# stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
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
R1 = np.random.default_rng(1942)  # this film's own randomness: the room, the bow, the paper


# a small room round the instrument, ringing on for about a second. Its level is set by what it rings where the notes are (its gain
# from 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.9)).astype(np.float32))(np.arange(int(0.9 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.012 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds), as a room lifts some pitches and
    hollows others, and every note should sound as loud as its neighbours"""
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
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.006, pan=0.0):
    """a sheet laid down: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.005, pan=0.0):
    """something small set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.005, pan=0.0):
    """a line drawn out, or a sheet slid along: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.006, pan=0.0, n=3):
    """a pencil's soft scratch on card, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.005, pan=0.0):
    """a tick drawn: two quick strokes of a pencil"""
    pen(s, 0.24, g, pan, 2)
def stamp(s, g=0.005, pan=0.0):
    """a rubber stamp pressed on a part: a soft, padded thud, low, with no ring"""
    n = int(0.12 * SR); x = np.arange(n) / SR
    _fx(0.8 * _knock(n, 120, 0.02) + 0.25 * filt(noise(0.14)[:n], 'band', (150, 600)) * np.exp(-x / 0.012), s, g, pan, 900)

# ---- tuning: just intonation from A flat, so a chord's notes are whole-number ratios of each other and nothing beats. A flat, D flat
# and E flat major and F and C minor are pure in this table; B flat minor is not, and is never played
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 44, 12)
    return 103.826 * 2 ** o * _JI[pc]
Db2, Eb2, F2, Ab2, Bb2, C3, Db3, Eb3, F3 = 37, 39, 41, 44, 46, 48, 49, 51, 53
Ab3, Bb3, C4, Db4, Eb4, F4, G4, Ab4, Bb4, C5, Db5, Eb5 = 56, 58, 60, 61, 63, 65, 67, 68, 70, 72, 73, 75
LONG, BETTER = (C4, Db4, Bb3, Eb4, G4, Ab4), (G4, Ab4)   # the mark: 3 4 2 5 7 1, then 7 1

LS, LL, FX = 0.046, 0.075, 3.2
LV = [1.0]
_ONE = [0.0]   # when the psalmodikon's last note stops: it has one string, so a note starts only after the one before has stopped

def _body(f, box=1.0):
    """the long, narrow box: broad low resonances (box, its length; twice as long for the partner, so everything an octave lower) and a
    faint ripple from the box's length; no narrow peak anywhere, so no nasal or violin colour"""
    return (0.55 + 0.8 * np.exp(-((f * box - 300) / 150) ** 2) + 0.55 * np.exp(-((f * box - 760) / 240) ** 2)
            + 0.2 * np.exp(-((f * box - 1500) / 450) ** 2)) * (1 + 0.18 * np.cos(2 * np.pi * f * box / 185))

def note(m, s, g=1.0, dur=1.0, pan=None, room=0.18, until=None):
    """one note: pressed onto its staple fret (a soft click), then bowed plain, held at one level, and stopped; one at a time"""
    assert s >= _ONE[0] - 1e-6, 'the psalmodikon has one string: a note at %.2f s starts before the one before stops (%.2f s)' % (s, _ONE[0])
    f0 = hz(m); d = dur
    if until is not None:
        d = min(d, max(0.2, until - s - 0.5))
    on = 0.06; sec = on + d + 0.4; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; xb = x - on
    sig = np.zeros(n)
    for k in range(1, 30):
        fk = f0 * k
        if fk > 2300:
            break
        sig += _body(fk) / k ** 1.25 * np.sin(2 * np.pi * fk * xb + 0.6 * k)
    env = np.where(xb < 0, 0.0, np.minimum(1, np.maximum(xb, 0) / 0.1)) * np.where(xb < d, 1.0, np.exp(-(xb - d) / 0.05))
    sig = sig * env / max(1e-9, float(np.abs(sig).max()))
    clk = 0.05 * _knock(n, 640, 0.004) + 0.03 * filt(noise(sec + 0.02)[:n], 'band', (400, 1500)) * np.exp(-np.maximum(xb, 0) / 0.04) * (xb >= 0)
    sig = _until(_room(norm(filt(filt((sig + clk).astype(np.float32), 'low', 2300), 'high', 80)), room, on, min(1.0, on + d)), s, until)
    put(sig, s, g * LV[0] * LS, max(-0.3, min(0.3, (m - 63) * 0.02)) if pan is None else pan)
    _ONE[0] = s + on + d + 0.05

def low(m, s, g=1.0, dur=1.4, settle=0.8, pan=-0.12, room=0.2, until=None):
    """the partner: the larger psalmodikon, an octave lower, bowed once under a turn, held, then the bow lifts and it settles"""
    f0 = hz(m); d = dur
    if until is not None:
        d = min(d, max(0.3, until - s - settle - 0.1))
    sec = d + settle + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 30):
        fk = f0 * k
        if fk > 1800:
            break
        dk = settle / 3 / k ** 0.6    # after the bow lifts, the higher partials die first
        sig += _body(fk, 2.0) / k ** 1.3 * np.sin(2 * np.pi * fk * x + 0.5 * k) * np.where(x < d, 1.0, np.exp(-(x - d) / dk))
    sig *= np.minimum(1, x / 0.18)
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.03 * filt(noise(sec + 0.02)[:n], 'band', (200, 900)) * np.exp(-x / 0.06)
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 1800), 'high', 40)), room, 0.25, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LL, pan)

def line(notes, s, g=1.0, step=0.42, dur=0.3, last=None, until=None):
    """a tune, one note at a time, each stopped before the next is pressed"""
    for i, m in enumerate(notes):
        note(m, s + step * i, g, last if (last and i == len(notes) - 1) else dur, until=until)
def mark(s, g=1.0, step=0.44, gap=0.9, last=2.0, under=None, until=None):
    """the mark: the long way (six notes winding to the home note), a breath, and the better way (the same arrival in two); the partner's
    low A flat under the arrival"""
    line(LONG, s, g, step, 0.3, 0.6, until)
    t2 = s + step * 5 + 0.66 + gap
    line(BETTER, t2, g, step, 0.3, last, until)
    if under is not False:
        low(Ab2, t2 + step, 0.85 * g, max(0.6, last - 0.4), 0.9, until=until)
    return t2 + step + last

# =============================================================================================================================
# 1. A better way, on a card: the opening. The United States, 1940: the partner's low A flat, bowed once, then A flat major rising, one
#    note at a time. Too few supervisors: the low F. The long way: the mark's six notes winding under the worker's path, a soft rub as the
#    path is drawn, the stamp, the box set on the scale. What it costs: F minor, the partner's low F under a held C. "Something had to
#    change" has nothing under it. Training Within Industry: D flat major. Job Methods, from 1942: the high A flat. The card's lines, a
#    pencil stroke each. The pocket card: E flat. The course's better way: the mark's arrival in two. Thirty details become fourteen and
#    86 in 100: A flat major. Japan: the D flat, low. A data team: one note; the Friday half-hour and one day, not six: E flat, then the
#    title: the mark, whole, held
LV[0] = 0.85
ow = lambda lid, word, off=0: W('card', lid, word, off)
oc = lambda lid, off=0: G('card', lid, off)
END = E('card')
low(Ab2, 0.4, 0.8, 2.6, 1.0, 0.0)
line((Ab3, C4, Eb4), ow('when', 'United', 0.0), 0.7, 0.62, 0.45, 1.6)
card(ow('when', 'United', -0.2), 0.004, px(420))
tap(ow('when', 'millions', -0.1), 0.0035, px(1600))
low(F2, ow('few', 'supervisors', 0.0), 0.6, 1.6, 0.9)
card(ow('few', 'lead', -0.3), 0.0035, px(1300))
card(ow('job', 'Picture', -0.2), 0.004, px(1480))
line(LONG, ow('walk', 'walks', -0.1), 0.6, 0.62, 0.42, 1.0)
slide(ow('walk', 'walks', 0.0), 2.8, 0.0035, px(600))
stamp(ow('walk', 'stamps', 0.1), 0.0045, px(1080))
tap(ow('walk', 'scale', 0.0), 0.0035, px(1565))
low(F2, ow('harm', 'heavy', -0.3), 0.55, 1.8, 1.0)
note(C4, ow('harm', 'heavy', 0.0), 0.5, 1.6)
tap(ow('harm', 'time', -0.1), 0.0035, px(1470))
low(Db3, oc('twi', 0.1), 0.55, 1.6, 0.9)
note(F4, ow('twi', 'Training', 0.1), 0.55, 1.4)
card(ow('twi', 'Training', -0.2), 0.004, px(1110))
tap(ow('twi', 'ten', -0.1), 0.0035, px(1500))
card(ow('jm', 'Job', -0.2), 0.004, px(1160))
note(Ab4, ow('jm', 'small', 0.0), 0.5, 1.4)
for lid, word in (('steps', 'Break'), ('steps', 'question'), ('better', 'drop'), ('better', 'write')):
    pen(ow(lid, word, 0.0), 0.45, 0.0045, px(1150), 2)
card(ow('pocket', 'pocket', -0.2), 0.004, px(1190))
note(Eb4, ow('pocket', 'until', -0.1), 0.5, 1.8)
slide(ow('shield', 'bench', -0.2), 1.2, 0.0035, px(760))
line(BETTER, ow('shield', 'neither', -0.1), 0.6, 0.44, 0.3, 1.8)
low(Ab2, ow('shield', 'neither', 0.34), 0.5, 1.4, 1.0)
card(ow('lighter', 'thirty', -0.2), 0.004, px(560))
note(C5, ow('lighter', 'fourteen', 0.0), 0.45, 1.4)
card(ow('plants', 'eighty-six', -0.3), 0.004, px(580))
low(Ab2, ow('plants', 'eighty-six', 0.0), 0.5, 1.6, 1.0)
note(Eb4, ow('plants', 'quarter', -0.1), 0.45, 1.6)
low(Db3, ow('japan', 'Japan', -0.1), 0.45, 1.4, 1.0)
card(ow('data', 'data', -0.2), 0.0035, px(960))
note(Ab3, ow('friday', 'Friday', 0.0), 0.45, 1.2)
card(ow('friday', 'Friday', -0.2), 0.0035, px(960))
card(ow('one', 'day', -0.2), 0.0035, px(960))
note(Eb4, ow('one', 'six', 0.1), 0.45, 1.4)
mark(oc('breath', 0.3), 0.6, 0.42, 0.7, 2.2, until=END)

# 2. Half an hour on Fridays: the chapter turns on the partner's low E flat and a G; the September sheet; the two waits already fixed;
#    the Friday half-hour on the calendar: the high A flat; the four words of the rules, a sheet; plan, do, check, act: the ring drawn,
#    one soft rub; the data quality module's Thursdays: a tag
LV[0] = 0.9
fw = lambda lid, word, off=0: W('friday', lid, word, off)
fc = lambda lid, off=0: G('friday', lid, off)
low(Eb2, S0('friday') + 0.2, 0.55, 1.4, 1.0, 0.0)
note(G4, S0('friday') + 0.9, 0.5, 1.4)
card(fw('sept', 'September', -0.2), 0.004, px(460))
tap(fw('fixes', 'two', -0.1), 0.0035, px(1110))
card(fw('half', 'Friday', -0.2), 0.004, px(840))
note(Ab4, fw('half', 'Fridays', 0.0), 0.45, 1.6)
card(fw('rules', 'One', -0.2), 0.004, px(520))
slide(fw('rules', 'plan', -0.1), 1.4, 0.0035, px(1400))
tap(fw('dq', 'quality', -0.1), 0.0035, px(960))

# 3. Six days to one: the chapter turns on F minor, low; Noor's screen; the six working days, the low F under an A flat; the card's
#    first step: a pencil stroke; the four steps of a request, a sheet each, with the mark's six notes winding under them, as the long way
#    did in 1940; why wait for Monday? one tap; Ivy's change, a sheet, and an E flat left open, a week to wait
LV[0] = 0.9
sw = lambda lid, word, off=0: W('six', lid, word, off)
sc_ = lambda lid, off=0: G('six', lid, off)
low(F2, S0('six') + 0.2, 0.55, 1.4, 1.0, 0.0)
slide(sw('first', 'tracker', -0.2), 1.0, 0.0035, px(720))
tap(sw('start', 'six', -0.1), 0.0035, px(720))
note(Ab3, sw('start', 'six', 0.0), 0.45, 1.6)
pen(sw('card', 'break', -0.1), 0.45, 0.0045, px(960), 2)
for word, x in (('lands', 330), ('waits', 750), ('goes', 1170), ('reads', 1590)):
    card(sw('steps', word, -0.2), 0.0035, px(x))
line(LONG, sw('steps', 'lands', 0.2), 0.5, 0.62, 0.42, 0.9)
tap(sw('why', 'Monday', -0.1), 0.0035, px(750))
card(sw('ivy', 'change', -0.2), 0.004, px(1320))
note(Eb4, sw('ivy', 'working', 0.0), 0.45, 1.8)
tap(sw('week', 'week', -0.2), 0.0035, px(1320))

# 4. Kept or dropped, out loud: Friday 10 September, its sheet; one day, not six: the mark's arrival in two, over the low A flat, and a
#    tick for kept; the second change, a sheet; dropped: one soft tap and the partner's low D flat, left to settle; fifteen Fridays, the
#    chips laid down in one soft rub, and A flat major as the count comes in
LV[0] = 0.9
kw = lambda lid, word, off=0: W('kept', lid, word, off)
kc = lambda lid, off=0: G('kept', lid, off)
card(S0('kept') + 0.6, 0.004, px(720))
line(BETTER, kw('kept', 'One', 0.0), 0.55, 0.44, 0.3, 1.8)
low(Ab2, kw('kept', 'One', 0.44), 0.5, 1.4, 1.0)
ticked(kw('kept', 'keeps', 0.0), 0.0045, px(1600))
card(kw('second', 'ten', -0.2), 0.004, px(1320))
tap(kw('dropped', 'drop', -0.1), 0.004, px(1320))
low(Db3, kw('dropped', 'drop', 0.0), 0.45, 1.2, 1.0)
slide(kw('count', 'Every', 0.0), 2.6, 0.0035, px(960))
note(C5, kw('count', 'fourteen', 0.0), 0.45, 1.6)

# 5. Written into the procedure: the chapter turns on D flat major, low; the ask procedure's page; its second step rewritten, pencil
#    strokes, and the high A flat as the date goes in; the six pages; 14 days: A flat major; six in a hundred: a tap; the fortnightly
#    review: C, held
LV[0] = 0.9
ww = lambda lid, word, off=0: W('written', lid, word, off)
wc = lambda lid, off=0: G('written', lid, off)
low(Db3, S0('written') + 0.2, 0.55, 1.4, 1.0, 0.0)
note(F4, S0('written') + 0.9, 0.45, 1.4)
card(ww('same', 'procedure', -0.2), 0.004, px(960))
pen(ww('ask', 'second', 0.0), 0.9, 0.0045, px(540), 3)
note(Ab4, ww('ask', 'date', 0.0), 0.45, 1.4)
card(ww('lasts', 'someone', -0.2), 0.0035, px(1440))
card(ww('days', 'fourteen', -0.3), 0.004, px(580))
low(Ab2, ww('days', 'fourteen', 0.0), 0.5, 1.4, 1.0)
note(Eb4, ww('days', 'fourteen', 0.2), 0.45, 1.4)
card(ww('quality', 'six', -0.3), 0.0035, px(1340))
card(ww('wins', 'review', -0.2), 0.004, px(960))
note(C5, ww('wins', 'wins', 0.0), 0.45, 1.6)

# 6. On Monday: the pocket card again, its last step, over the partner's low D flat and an F; each procedure's page beside it; the four
#    things to do, a sheet each; and the close: the mark, whole, slower, its last note held into the end card over the low A flat
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
low(Db3, S0('monday') + 0.2, 0.5, 1.4, 1.0, 0.0)
card(S0('monday') + 0.8, 0.004, px(530))
note(F4, mw('back', 'until', -0.1), 0.45, 1.6)
card(mw('pages', 'page', -0.2), 0.0035, px(1420))
for lid, word, x in (('protect', 'protect', 540), ('measure', 'Pick', 1380), ('change', 'Change', 540), ('write', 'Write', 1380)):
    card(mw(lid, word, -0.2), 0.0035, px(x))
mark(mw('take', 'One', 0.0), 0.5, 0.5, 1.0, 3.4, until=TOT)
