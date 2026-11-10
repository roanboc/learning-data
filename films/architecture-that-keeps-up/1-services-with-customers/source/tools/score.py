# Services with customers: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (the data management palettes.md, row reserved 10 November 2026 after searching every score.py and
# music.py on main and on every branch, and every palettes.md in the project's files, for "nyckelharpa", "keyed fiddle" and "bowed keys":
# none): a nyckelharpa, made here, as music.py has none.
#  - The nyckelharpa: a keyed fiddle. The player bows its strings and stops each note by pressing a wooden key, not a fingertip, so every
#    note is placed exactly; under the bowed strings lie strings that nobody touches, which ring on by themselves, softly, when a note
#    they share is played. One player serving another's need: a note asked for, and the strings that answer it. Played plain: each note
#    bowed steadily, with no vibrato and no slide, its partials harmonic; the sympathetic strings only as a faint ring after a note stops.
#  - Its partner, the thread's choice: its own low strings plucked with the thumb, a round, short note under the bow. No other plucked
#    or bowed colour the site lacks avoids another culture or an instrument the site has (the module's palettes.md). The nyckelharpa is
#    Swedish; the opening is in India, so nothing in the score is borrowed from the opening's place: no drone, no raga, no instrument of
#    the place.
# The mark: a note offered and a note answered. Three notes rising (A, C sharp, E: a service, offered), then three that answer it from
# above (F sharp, E, high A: the customer, whose need it meets). It is played whole when the hospital says what it is for, its answer
# alone when each layer names its customer at the top, whole again back in Madurai, and at the close an octave lower, held.
# A major, F sharp minor for the opening's problem. Every chord is tuned pure from A (just intonation, see hz()): A, D and E major and F
# sharp minor are pure in this table; B minor is not, and is never played. The reports no one opens are the low F sharp, plucked and
# stopped short. No chapter is urgent: nothing pulses.
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: each bowed note held at one level from the bow's start to its stop; each damped before the next chapter.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/swc_scenes.js, and
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
R1 = np.random.default_rng(1976)  # this film's own randomness: the room, the bow, the paper



# a small room round the instrument, ringing on for about a second. Its level is set by what it rings where the notes are (its gain
# from 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.0)).astype(np.float32))(np.arange(int(1.0 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.014 * SR)] = 0; _IR /= _band(_IR)
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
    """a card laid down: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.005, pan=0.0):
    """something small set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.005, pan=0.0):
    """a card slid along, or a line drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.006, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.005, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)

def rumble(s, sec=3.0, g=0.004, pan=0.0):
    """carts on a road, far off: one soft, low texture of wheels that swells and fades, not a clatter of single knocks"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 7); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (70, 420)) * _bump(x, sec, 1.3) * gr, s, g, pan, 600)

# ---- tuning: just intonation from A, so a chord's notes are whole-number ratios of each other and nothing beats. A, D and E major and
# F sharp minor are pure in this table; B minor is not, and is never played
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 45, 12)
    return 110.0 * 2 ** o * _JI[pc]
A2, Cs3, D3, E3, Fs3, Gs3, A3, Cs4, D4, E4, Fs4, Gs4, A4, Cs5, D5, E5, Fs5, A5 = 45, 49, 50, 52, 54, 56, 57, 61, 62, 64, 66, 68, 69, 73, 74, 76, 78, 81
Fs2, E2, D2 = 42, 40, 38

LB, LP_, FX = 0.034, 0.06, 3.2
LV = [1.0]

def bow(m, s, g=1.0, dur=1.6, pan=None, room=0.22, until=None):
    """one note bowed and stopped by its key: a steady tone with harmonic partials shaped by the body, the bow's soft grain at its start,
    held at one level, stopped over a tenth of a second; then the strings nobody touches ring the same note, faintly, for half a second"""
    f0 = hz(m); d = dur
    if until is not None:
        d = min(d, max(0.2, until - s - 0.7))
    sec = d + 0.8; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k in range(1, 30):
        fk = f0 * k
        if fk > 2300:
            break
        body = 1 + 0.8 * np.exp(-((fk - 520) / 220) ** 2) + 0.5 * np.exp(-((fk - 1150) / 300) ** 2)
        sig += body / k ** 1.15 * np.sin(2 * np.pi * fk * x + 0.7 * k)
    env = np.minimum(1, x / 0.07) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.05))
    sig = sig * env
    sym = 0.1 * np.sin(2 * np.pi * f0 * x) * np.where(x < d, 0.0, np.exp(-(x - d) / 0.5)) * float(np.abs(sig).max() or 1)
    grain = filt(noise(sec + 0.02)[:n], 'band', (500, 1800)) * np.exp(-x / 0.05) * 0.05
    sig = (sig + sym) / max(1e-9, float(np.abs(sig).max())) + grain
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 80)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LB, max(-0.35, min(0.35, (m - 66) * 0.02)) if pan is None else pan)

def pluck(m, s, g=1.0, ring=0.9, pan=None, room=0.18, until=None):
    """the partner: a low string plucked with the thumb, round, its higher partials gone first, damped after ring seconds"""
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 16):
        fk = f0 * k
        if fk > 1500:
            break
        sig += np.sin(np.pi * k * 0.2) / k ** 1.3 * np.sin(2 * np.pi * fk * x) * np.exp(-x / (1.4 / k ** 0.8))
    sig *= np.minimum(1, x / 0.003) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.06))
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 1500), 'high', 40)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LP_, -0.15 if pan is None else pan)

def chord(notes, s, g=1.0, step=0.14, dur=2.0, until=None):
    """a chord placed from its lowest note up, the lowest plucked when it's low, the rest bowed, all stopped together"""
    for i, m in enumerate(notes):
        dd = max(0.5, dur - step * i)
        (pluck(m, s + step * i, g, dd, until=until) if (i == 0 and m < A3) else bow(m, s + step * i, g, dd, until=until))
def figure(notes, s, g=1.0, step=0.26, dur=0.4, last=None, until=None):
    """a short figure, one bowed note at a time, each stopped before the next starts"""
    for i, m in enumerate(notes):
        bow(m, s + step * i, g, last if (last and i == len(notes) - 1) else dur, until=until)
OFFER, ANSWER = (A4, Cs5, E5), (Fs5, E5, A5)
def mark(s, g=1.0, shift=0, step=0.26, last=2.0, bass=(), until=None):
    """the mark: the offer, a breath, and the answer; the thumb's low notes under it at the places given"""
    figure(tuple(m + shift for m in OFFER), s, g, step, 0.4, 0.6, until)
    figure(tuple(m + shift for m in ANSWER), s + 4 * step, g, step, 0.4, last, until)
    for m, i, r in bass:
        pluck(m, s + step * i, 0.9 * g, r, until=until)

# =============================================================================================================================
# 1. Sight, for everyone: the opening. Madurai, 1976: the low A, plucked, alone, then A major as the town comes in. The doctor's card. The
#    beds set in, one soft slide. The cataract: F sharp minor, low, as the lens clouds. What it costs a family: F sharp minor again, then
#    nothing. The short operation: E major. Why most never have it: F sharp minor, low, gone before "Something has to change", which has
#    nothing under it. What the hospital is for: the mark, whole. Who it's for, in groups: three plucked notes, low, middle, high. Six beds
#    for those who pay nothing: D major. The eye camps and the bus: a soft, far rumble, and the offer's notes. The operating room: a pen's
#    stroke for each step. The lenses: a card. What got better: A major, then E and A. A data team: one high A; the title, A major, held
LV[0] = 0.85
ow = lambda lid, word, off=0: W('sight', lid, word, off)
oc = lambda lid, off=0: G('sight', lid, off)
END = E('sight')
pluck(A2, 0.5, 0.85, 3.2, 0.0)
chord((A2, E3, A3, Cs4), ow('when', 'Madurai', 0.2), 0.7, step=0.18, dur=3.0)
card(ow('when', 'Madurai', -0.2), 0.004, px(440))
card(ow('doctor', 'Venkataswamy', -0.4), 0.004, px(1320))
slide(ow('beds', 'eleven', -0.1), 2.0, 0.0035, px(950))
chord((Fs2, Cs3, Fs3, A3), ow('cataract', 'cloudy', -0.1), 0.6, step=0.18, dur=2.6)
pluck(Fs2, ow('harm', 'grandmother', 0.0), 0.6, 1.6)
chord((E2, E3, Gs3, E4), ow('fix', 'operation', -0.1), 0.55, step=0.16, dur=2.0)
card(ow('fix', 'operation', -0.1), 0.0035, px(960))
chord((Fs2, Cs3, A3), ow('cost', 'poor', -0.2), 0.5, step=0.2, dur=2.2, until=oc('change', -0.3))
card(ow('cost', 'poor', -0.2), 0.0035, px(960))
mark(ow('service', 'for', -0.1), 0.7, 0, 0.26, 2.4, bass=((A2, 0, 1.6), (D3, 3, 1.0), (A2, 6, 2.0)))
card(ow('service', 'for', -0.1), 0.004, px(960))
for word, m, x in (('can', A2, 560), ('little', Cs3, 960), ('nothing', E3, 1360)):
    pluck(m, ow('groups', word, -0.1), 0.6, 0.9, px(x) * 0.4)
chord((D3, Fs3, A3, D4), ow('free', 'Six', 0.2), 0.55, step=0.15, dur=2.0)
rumble(ow('camps', 'bus', -0.6), 3.4, 0.004, px(960))
figure(OFFER, ow('camps', 'villages', -0.2), 0.5, 0.3, 0.45, 1.0)
for i in range(4):
    pen(ow('below', 'operating', 0.0) + 0.5 * i, 0.3, 0.0045, px(380 + 380 * i), 2)
tap(ow('below', 'costs', -0.1), 0.0035, px(960))
card(ow('lenses', 'makes', -0.1), 0.004, px(960))
chord((A2, E3, A3, Cs4), ow('today', 'four', -0.2), 0.55, step=0.14, dur=1.8)
card(ow('pays', 'pay', -0.1), 0.0035, px(1340))
chord((E3, Gs3, E4), ow('pays', 'outcomes', 0.0), 0.5, step=0.16, dur=1.4)
chord((A2, E3, A3, Cs4, E4), ow('pays', 'hundred', 0.2), 0.5, step=0.15, dur=2.2)
card(ow('data', 'team', -0.2), 0.0035, px(960))
bow(A4, ow('design', 'someone', 0.0), 0.5, 1.8)
chord((A2, E3, A3, Cs4, E4), oc('breath', 0.3), 0.7, step=0.2, dur=4.4, until=END)

# 2. Four services, one page: the chapter turns on D major; the series' card; the strategy's card, then the team's; the page comes in,
#    and one plucked note for each service as it's named (A, C sharp, E, A); the catalogue's tag; the suppliers, one slide as their lines
#    are drawn
LV[0] = 0.9
sw = lambda lid, word, off=0: W('services', lid, word, off)
sc_ = lambda lid, off=0: G('services', lid, off)
chord((D3, A3, D4, Fs4), S0('services') + 0.2, 0.55, step=0.16, dur=2.2)
card(S0('services') + 0.9, 0.004, px(960))
card(sw('may', 'council', -0.3), 0.004, px(1140))
card(sw('run', 'business', -0.2), 0.0035, px(1140))
card(sw('first', 'services', -0.2), 0.004, px(1140))
for lid, m in (('products', A2), ('platform', Cs3), ('analysis', E3), ('advice', A3)):
    pluck(m, sc_(lid, 0.2), 0.55, 0.9, px(1140) * 0.4)
tap(sw('catalogue', 'catalogue', -0.1), 0.0035, px(1140))
slide(sw('suppliers', 'payroll', -0.2), 2.6, 0.0035, px(400))

# 3. Who each is for: the customers' lines drawn, one slide; the conversations' tag; each group's card, one bowed note each, rising
#    through A major (A, C sharp, E, A); the canvas's tag; Noor's screen, and E major as the services and customers go on her map
LV[0] = 0.9
cw = lambda lid, word, off=0: W('customers', lid, word, off)
cc = lambda lid, off=0: G('customers', lid, off)
slide(cw('groups', 'four', -0.2), 2.2, 0.0035, px(1500))
tap(cw('listen', 'thirty-one', -0.1), 0.0035, px(960))
for lid, m, x in (('decide', A3, 530), ('partners', Cs4, 1390), ('readers', E4, 530), ('whose', A4, 1390)):
    card(cc(lid, -0.1), 0.0035, px(x))
    bow(m, cc(lid, 0.6), 0.45, 1.0, px(x) * 0.4)
tap(cw('canvas', 'canvas', -0.3), 0.0035, px(960))
slide(cc('noor', 0.0), 1.0, 0.0035, px(740))
chord((E3, Gs3, E4), cw('noor', 'customers', 0.0), 0.5, step=0.15, dur=1.8)

# 4. Down every layer: the chapter turns on F sharp minor, low; the service's card; the five layers laid down, a card each; as each is
#    described, one bowed note walking down A major, from high E to low A; each picture names its customer: the answer; the old warehouse:
#    the low F sharp, plucked and stopped short; "why is it there?" has nothing under it
LV[0] = 0.9
lw = lambda lid, word, off=0: W('layers', lid, word, off)
lc = lambda lid, off=0: G('layers', lid, off)
chord((Fs2, Cs3, A3), S0('layers') + 0.2, 0.5, step=0.16, dur=2.0)
card(lw('walk', 'governed', -0.2), 0.004, px(960))
for word in ('strategy', 'business', 'information', 'application', 'technology'):
    card(lw('five', word, -0.1), 0.003, px(960))
for lid, m in (('strategy', E5), ('business', Cs5), ('info', A4), ('app', E4), ('tech', A3)):
    bow(m, lc(lid, 0.3), 0.45, 1.2, 0.0)
figure(ANSWER, lw('each', 'customer', -0.1), 0.5, 0.26, 0.4, 1.6)
slide(lw('none', 'warehouse', -0.1), 1.4, 0.0035, px(970))
pluck(Fs2, lw('none', 'seventeen', -0.1), 0.75, 0.35, None, 0.1)
card(lw('none', 'seventeen', 0.2), 0.0035, px(960))

# 5. Every request lands somewhere: a low knock as the door opens; the requests fly to the trays, one soft slide; 42 of 45: A major; the
#    three that land on none: the low D, plucked; two go to digital services, a slide off to the right; one joins advice and training, a
#    tap and E major; where the page needs to change: the offer's notes, high, an answer still to write
LV[0] = 0.9
dw = lambda lid, word, off=0: W('door', lid, word, off)
dc = lambda lid, off=0: G('door', lid, off)
f0 = dw('list', 'forty-two', -0.3)
card(S0('door') + 0.8, 0.004, px(430))
tap(dw('open', 'opens', -0.2), 0.005, px(960))
slide(f0 + 0.2, 4.8, 0.0035, px(960))
chord((A2, E3, A3, Cs4), f0 + 42 * 0.11 + 0.6, 0.55, step=0.15, dur=1.8)
tap(dw('graham', 'analysis', -0.1), 0.0035, px(1170))
pluck(D3, dw('three', 'none', -0.2), 0.6, 0.9, px(1800) * 0.4)
slide(dw('hand', 'digital', -0.2), 1.4, 0.0035, px(1850))
tap(dw('fill', 'joins', -0.2) + 1.0, 0.0035, px(1570))
chord((E3, Gs3, E4), dw('fill', 'joins', -0.2) + 1.0, 0.5, step=0.15, dur=1.6)
figure((Cs5, E5), dw('gap', 'shows', -0.1), 0.45, 0.3, 0.4, 1.4)

# 6. On Monday: Madurai, framed on the wall: the mark, whole, lower; the two pills: D, then A; each piece of advice laid down; and the
#    close: the mark an octave lower, its last note held as A major into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
card(S0('monday') + 0.8, 0.004, px(560))
mark(mw('back', 'sentence', -0.1), 0.55, -12, 0.28, 1.6, bass=((A2, 0, 1.2), (A2, 6, 1.6)))
pluck(D3, mw('helena', 'request', -0.1), 0.5, 0.9, px(1180) * 0.4)
pluck(A2, mw('helena', 'system', -0.1), 0.5, 1.2, px(1180) * 0.4)
card(mc('define', 0.3), 0.0035, px(400))
for lid, word, x in (('name', 'suppliers', 960), ('walk', 'layer', 1520), ('ask', 'why', 960)):
    card(mw(lid, word, -0.2), 0.0035, px(x))
mark(mw('take', 'them', 0.2), 0.5, -12, 0.3, 5.0, bass=((A2, 0, 2.0), (E2, 3, 1.2), (A2, 6, 5.0)), until=TOT)
chord((Cs4, E4), mw('take', 'them', 0.2 + 0.3 * 6), 0.45, step=0.0, dur=5.0, until=TOT)
