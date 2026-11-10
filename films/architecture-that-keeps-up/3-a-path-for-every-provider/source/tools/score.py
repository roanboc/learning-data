# A path for every provider: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (/mnt/project-files/data-management/palettes.md, reserved 10 November 2026: a lead no score on
# main or on any branch has, and that no palette names): the long string instrument, made here, as music.py has none.
#  - The long string instrument: brass wires many metres long, stretched across a room at about waist height, and played by walking
#    beside them and drawing rosined fingertips along each wire. The rub sets the wire ringing lengthwise, not side to side, so its
#    note is high for so long a wire, steady and round, with a soft grain of rosin at its start. Each note is placed and held still,
#    then the hand lifts and the wire rings down for a moment. No vibrato, no slide: the note can't bend, as a fixed wire can't.
#  - Its partner, the thread's choice: the same wires plucked near their ends with the thumb, a short, low, round note that stops as
#    the palm damps it. One instrument, two ways to set it ringing: the preferred way (a long, even rub) and a path for when that
#    can't be done (a short pluck).
# The mark: four ways to the same note. Four short figures, each starting somewhere else and taking a different number of steps, all
# arrive on A: the first in one step (E to A), the preferred way; the second in two; the third climbs further; the fourth waits a beat
# and then arrives. Heard together at the close, they arrive at once. It comes in when the box reaches ports by more than one path,
# at the decision tree, when the four paths are drawn, and at the close.
# A major, F sharp minor for the opening's problem (the port with no crane) and for what the timetable never says. Every chord is
# tuned pure from A (just intonation, see hz()): A, D and E major and F sharp minor are pure in this table; B minor, and B held with
# D, are not, and are never played or held together. No urgent pulse: nothing in the film is a rush, even the file cut short, which
# the check stops calmly.
# Nothing borrowed from the opening's world: no ship's horn, no work song, no sea shanty, no dock bell.
# The rules the module keeps (tools/quiet.py checks them): music under the opening story, and after it only at a chapter's turn, under
# a moment on screen or in a pause without words; never a bed under the voice; a figure never played again soon after itself; the
# music and the effects no louder than the governance films'; everything low and soft, below about 2.4 kHz; the effects about 12 dB
# under the music; every sound an event on screen, at the word and offset the picture uses (src/pp_scenes.js).

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
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1957)

# ---- tuning: just intonation from A
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 45, 12)
    return 110.0 * 2 ** o * _JI[pc]
A1, D2, E2, Fs2, A2, B2, Cs3, D3, E3, Fs3, Gs3, A3, B3 = 33, 38, 40, 42, 45, 47, 49, 50, 52, 54, 56, 57, 59
Cs4, D4, E4, Fs4, Gs4, A4, B4, Cs5, D5, E5, A5 = 61, 62, 64, 66, 68, 69, 71, 73, 74, 76, 81

# ---- the levels: the rubbed wire and the plucked one matched by loudness; the effects about 12 dB under the music
LR, LP_, FX = 0.05, 0.068, 3.2
LV = [1.0]

# a large, plain room round the wires (they fill a hall), ringing on for about 1.4 s. Its level is set by what it rings where the
# notes are (its gain from 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry
def _band(ir):
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.4)).astype(np.float32))(np.arange(int(1.4 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.018 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
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

# ---- a wire's partials: harmonic (a wire ringing lengthwise is nearly perfectly harmonic), the upper ones soft; nothing above 2.3 kHz.
# The seventh and those near it, out of tune with a 5-limit scale, are kept low
_ODD = {7: 0.15, 11: 0.3, 13: 0.3, 14: 0.15}
def _wire(f0, x, soft, top=2300, decay=None):
    sig = np.zeros(len(x))
    for k in range(1, 30):
        fk = f0 * k
        if fk > top:
            break
        a = k ** -1.1 * np.exp(-(k - 1) / soft) * _ODD.get(k, 1.0) * (1.0 if k % 2 else 0.75)
        env = 1.0 if decay is None else np.exp(-x / (decay / (1 + 0.6 * (k - 1))))
        sig += a * np.sin(2 * np.pi * fk * x + 0.7 * k) * env
    return sig

def rub(m, s, g=1.0, pan=None, hold=1.2, room=0.3, until=None):
    """the lead: a long wire rubbed by rosined fingertips from s; the note swells in over a tenth of a second with the rosin's soft grain,
    holds steady for hold seconds, and rings down over about 0.6 s once the hand lifts"""
    f0 = hz(m); d = hold
    if until is not None:
        d = min(d, max(0.15, until - s - 0.8))
    sec = d + 0.8; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _wire(f0, x, 3.4 * (330 / f0) ** 0.4)
    env = np.minimum(1, x / 0.11) ** 1.5 * np.where(x < d, 1.0, np.exp(-(x - d) / 0.22))
    sig *= env
    gr = filt(noise(sec + 0.02)[:n], 'band', (max(150, f0 * 0.8), min(2200, f0 * 3)))     # the rosin's grain, mostly at the start
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.05 * gr * np.exp(-x / 0.09) / max(1e-9, float(np.abs(gr).max()))
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 80)), room, 0.0, min(1.2, d)), s, until)
    put(sig, s, g * LV[0] * LR, max(-0.4, min(0.4, (m - 64) * 0.02)) if pan is None else pan)

def pluck(m, s, g=1.0, pan=None, ring=0.9, room=0.25, until=None):
    """the partner: a wire plucked near its end with the thumb, a short, low, round note, damped by the palm after ring seconds"""
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.35; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _wire(f0, x, 2.2, 1500, decay=1.6)
    sig *= (1 - np.exp(-x / 0.003)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.07))
    sig = sig / max(1e-9, float(np.abs(sig).max()))
    sig = sig.astype(np.float32); sig = sig + 0.3 * filt(sig, 'band', (80, 220))
    sig = _until(_room(norm(filt(filt(sig, 'low', 1500), 'high', 40)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LP_, -0.12 if pan is None else pan)

def chord(notes, s, g=1.0, step=0.14, hold=2.0, until=None, low=True):
    """a chord laid in from its lowest wire up, the lowest plucked when it's low, the hands lifting together at the end"""
    for i, m in enumerate(notes):
        h = max(0.4, hold - step * i)
        if low and i == 0 and m < A2 + 1:
            pluck(m, s, g, None, h, until=until)
        else:
            rub(m, s + step * i, g, None, h, until=until)
def figure(notes, s, g=1.0, step=0.26, hold=0.3, last=1.2, until=None, hand=None):
    """a short figure, a note at a time, each lifted before the next sounds, so only pure intervals ring together"""
    k = len(notes)
    for i, m in enumerate(notes):
        (hand or rub)(m, s + step * i, g, None, last if i == k - 1 else hold, until=until)
# the mark's four ways to A
WAY1, WAY2, WAY3, WAY4 = (E4, A4), (Cs4, E4, A4), (A3, Cs4, D4, E4, A4), (Fs4, E4, Cs4, A4)

# ---- the sounds, all soft and low-passed, on the effects bus
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k
def card(s, g=0.0035, pan=0.0):
    """a card laid down: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.004, pan=0.0):
    """something small set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.004, pan=0.0):
    """a line drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.6, g=0.0045, pan=0.0, n=3):
    """a pen's soft scratch, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def landed(s, g=0.006, pan=0.0):
    """a box set down on a quay or a deck: a low, dull, heavy thud, and the steel's short, soft ring under it"""
    n = int(0.6 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 70, 0.07) + 0.25 * _knock(n, 190, 0.12) + 0.2 * filt(noise(0.62)[:n], 'band', (120, 600)) * np.exp(-x / 0.03), s, g, pan, 1000)
def winch(s, sec=2.4, g=0.0035, pan=0.0):
    """a crane's winch drawing its cable in: one low, even hum of gears that swells and settles, never a whine that rises"""
    n = int(sec * SR); x = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 92 * x) + 0.4 * np.sin(2 * np.pi * 184 * x) + 0.2 * filt(noise(sec + 0.02)[:n], 'band', (80, 400))
    _fx(tone * _bump(x, sec, 1.2), s, g, pan, 700)
def roll(s, sec=2.0, g=0.0035, pan=0.0):
    """a crane's wheels rolling along its rails: one soft, low rumble that swells and fades"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 6); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (60, 360)) * _bump(x, sec, 1.3) * gr, s, g, pan, 600)
def net(s, sec=1.6, g=0.003, pan=0.0):
    """a cargo net swung up by hand: a rope's soft creak as it takes the weight, then the sacks' dull shuffle, one sound"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (150, 700)) * _bump(x, sec, 1.0) + 0.4 * _knock(n, 110, 0.05, sec * 0.8), s, g, pan, 900)

# =============================================================================================================================
# 1. The ship that brought its own cranes: Newark, 1956. A major as the port comes in; the Ideal X's card; McLean. The box lifted by the
#    shore crane: its winch, and the box set down on the deck, under the first way to A (one step). The cost card, and D major under the
#    16 cents. The port with no crane: F sharp minor, low; the net swung up by hand; F sharp minor once more, gone before "Something has
#    to change", which has nothing under it. The Gateway City: E major; its cranes roll along their rails, reach out over the quay, and
#    set a box down: the second way to A. The years: the port's own crane, D major; the ships with cranes still calling: the third way.
#    The savings reaching each port: A major. Data's providers, a card each, and the four ways to A one after another, as each provider's
#    path is drawn; then A major, held, under the title card.
LV[0] = 0.85
ow = lambda lid, word, off=0: W('box', lid, word, off)
oc = lambda lid, off=0: G('box', lid, off)
END = E('box')
pluck(A1 + 12, 0.5, 0.8, 0.0, ring=3.0)
chord((A2, E3, A3, Cs4), ow('when', 'Newark', 0.1), 0.7, step=0.18, hold=3.0)
card(ow('when', 'Newark', -0.2), 0.0035, px(380))
card(ow('ideal', 'Ideal', -0.1), 0.0035, px(380))
winch(ow('lift', 'lifted', -0.3), 2.6, 0.0035, px(1500))
landed(ow('lift', 'lifted', -0.4) + 4.2, 0.005, px(1000))
figure(WAY1, ow('lift', 'lifted', -0.4) + 4.2, 0.6, step=0.32, hold=0.35, last=1.6)
card(ow('cost', 'figures', -0.2), 0.0035, px(520))
chord((D3, Fs3, A3, D4), ow('cost', 'sixteen', -0.2), 0.55, step=0.16, hold=2.0, low=False)
chord((Fs2, Cs3, Fs3, A3), oc('needs', 0.1), 0.55, step=0.18, hold=2.4)
net(ow('harm', 'unloaded', -0.2), 1.8, 0.003, px(1300))
card(ow('harm', 'days', 0.0), 0.0035, px(420))
chord((Fs2, A2, Cs3, Fs3), ow('harm', 'cost', 0.0), 0.5, step=0.2, hold=1.8, until=oc('change', -0.4))
card(ow('gateway', 'Gateway', -0.1), 0.0035, px(420))
chord((E2, B2, E3, Gs3), ow('gateway', 'cranes', -0.1), 0.6, step=0.16, hold=2.2)
roll(ow('rails', 'rails', -0.2), 2.2, 0.0035, px(800))
landed(ow('rails', 'reach', -0.2) + 2.8, 0.005, px(1560))
figure(WAY2, ow('rails', 'reach', -0.2) + 2.8, 0.6, step=0.3, hold=0.3, last=1.6)
chord((D3, A3, D4, Fs4), ow('years', 'build', -0.2), 0.5, step=0.16, hold=2.0, low=False)
figure(WAY3, ow('still', 'still', 0.0), 0.5, step=0.24, hold=0.25, last=1.6)
card(ow('reach', 'savings', -0.2), 0.0035, px(480))
chord((A2, E3, Cs4, A4), ow('reach', 'joined', 0.0), 0.55, step=0.16, hold=2.4)
card(ow('data', 'standard', -0.2), 0.0035, px(1500))
# the four paths drawn, and the four ways to A, one after another, each with its own arrival
pq = ow('path', 'path', -0.2)
figure(WAY4, pq + 0.2, 0.5, step=0.26, hold=0.25, last=1.4)
chord((A2, E3, A3, Cs4, E4), oc('breath', 0.3), 0.65, step=0.2, hold=4.4, until=END)

# 2. One preferred way: the chapter turns on D major; the series' card; June, and Helena and Noor; the preferred way written, a pen's
#    strokes for each line, and the first way to A, low, as the deletions' line completes the page; the two films' cards; Sam's list, a
#    tap as each provider's line comes in, and F sharp minor as old and new alike fall short
LV[0] = 0.9
ww = lambda lid, word, off=0: W('way', lid, word, off)
wc = lambda lid, off=0: G('way', lid, off)
chord((D3, A3, D4, Fs4), S0('way') + 0.2, 0.55, step=0.16, hold=2.2, low=False)
card(S0('way') + 1.0, 0.0035, px(960))
card(ww('when', 'June', -0.1), 0.0035, px(960))
card(ww('helena', 'write', -0.1), 0.0035, px(1010))
for lid, word in (('product', 'governed'), ('event', 'event'), ('deleted', 'deleted')):
    pen(ww(lid, word, -0.2), 0.6, 0.004, px(1010), 3)
figure((E3, A3), ww('deleted', 'copy', 0.2), 0.5, step=0.34, hold=0.4, last=1.6, hand=pluck)
card(ww('films', 'Moving', -0.2), 0.0035, px(600)); card(ww('films', 'Deleted', -0.2), 0.0035, px(1320))
card(ww('sam', 'lists', -0.2), 0.0035, px(1190))
for lid in ('sensors', 'payroll', 'timetable', 'labs'):
    tap(wc(lid, 0.0), 0.0035, px(1500))
chord((Fs3, A3, Cs4), ww('short', 'short', 0.0), 0.5, step=0.16, hold=1.8, low=False)

# 3. A tree for the rest: the page's second half, A major, high; each question drawn as it's asked, a line slid out for each branch;
#    the preferred branch, the first way to A an octave down; the deletions' branch, F sharp minor's low A and C sharp; the names' card;
#    the ticks; the repository's text typed, and E major as its picture is drawn from it
LV[0] = 0.9
tw = lambda lid, word, off=0: W('tree', lid, word, off)
chord((A3, Cs4, E4), tw('half', 'tree', -0.3), 0.5, step=0.16, hold=1.8, low=False)
figure((E3, A3), tw('q1', 'events', 0.1), 0.5, step=0.34, hold=0.4, last=1.4)
for lid, word in (('q2', 'changes'), ('q3', 'deleted'), ('q4', 'file'), ('q5', 'spreadsheet')):
    slide(tw(lid, word, 0.4), 0.8, 0.0035, px(1300))
pluck(Fs2, tw('q3', 'compare', 0.0), 0.6, None, ring=1.2)
card(tw('names', 'names', -0.1), 0.0035, px(1400))
pen(tw('each', 'recommendation', -0.2), 0.8, 0.004, px(1700), 4)
pen(tw('repo', 'text', 0.0), 1.2, 0.004, px(600), 5)
chord((E3, B3, E4, Gs4), tw('repo', 'drawn', 0.0), 0.5, step=0.15, hold=2.0, low=False, until=E('tree'))

# 4. What the timetable never says: the chapter turns on A, low; the test's card; the class cancelled, a pen's stroke through it; the
#    hourly changes crossing; F sharp minor as the class stays booked; Graham's empty room; the vendor's card, a held D with nothing
#    under it; the tree's answer, the second way to A; the nightly comparison, a tick for each match and the missing row struck out;
#    live; 212, the third way to A; and A major as the 212 hours stay off Graham's page
LV[0] = 0.9
gw = lambda lid, word, off=0: W('gone', lid, word, off)
gc = lambda lid, off=0: G('gone', lid, off)
pluck(A2, S0('gone') + 0.2, 0.6, None, ring=2.0)
card(S0('gone') + 0.6, 0.0035, px(1130))
pen(gw('cancel', 'cancels', -0.1), 0.5, 0.004, px(470), 2)
chord((Fs2, Cs3, Fs3, A3), gw('stays', 'booked', 0.0), 0.5, step=0.18, hold=1.8)
card(gw('vendor', 'vendor', -0.1), 0.0035, px(1600))
figure((Cs4, E4, A4), gw('tree', 'night', 0.3), 0.5, step=0.28, hold=0.3, last=1.4)
slide(gw('compare', 'booking', -0.2), 1.2, 0.0035, px(960))
pen(gw('compare', 'deleted', -0.4), 0.4, 0.004, px(1500), 2)
card(gc('live', 0.2), 0.0035, px(460))
card(gw('found', 'two hundred', -0.3), 0.0035, px(1100))
figure((A3, Cs4, D4, E4, A4), gw('found', 'mentioned', 0.3), 0.5, step=0.22, hold=0.25, last=1.5)
chord((A2, E3, A3, Cs4), gw('off', 'stay', 0.4), 0.5, step=0.16, hold=2.2, until=E('gone'))

# 5. Four providers, four paths: the paths drawn, the sensors' first (the first way to A), the payroll's; the weaker path's card; the
#    nights' bars; Tuesday's file cut short, the left hand's low F sharp, stopped short, never a pulse; the check stops it: D major;
#    the labs' cards, and Anil's tick; each next step, in writing, a pen's stroke for each line, and E major
LV[0] = 0.9
aw = lambda lid, word, off=0: W('paths', lid, word, off)
ac = lambda lid, off=0: G('paths', lid, off)
figure((E4, A4), aw('sensors', 'event', -0.1), 0.5, step=0.3, hold=0.35, last=1.4)
slide(aw('payroll', 'whole', -0.2), 1.2, 0.0035, px(880))
card(ac('weaker', 0.1), 0.0035, px(480))
card(ac('small', 0.2), 0.0035, px(1310))
card(aw('cut', 'twenty-fourth', -0.2), 0.0035, px(480))
pluck(Fs2, aw('cut', 'short', -0.2), 0.7, None, ring=0.35, room=0.12)
chord((D3, Fs3, A3, D4), aw('cut', 'stops', -0.1), 0.5, step=0.16, hold=2.0, low=False)
card(aw('anil', 'moves', -0.2), 0.0035, px(1040))
tap(aw('anil', 'owns', 0.3), 0.004, px(1264))
card(ac('step', 0.2), 0.0035, px(960))
for word in ('timetable', 'Payroll', 'labs'):
    pen(aw('asks', word, -0.2), 0.5, 0.0035, px(960), 2)
chord((E3, B3, E4, Gs4), aw('asks', 'labs', 1.0), 0.45, step=0.16, hold=1.8, low=False, until=E('paths'))

# 6. Value first: the steps, each token lifted, three notes rising (C sharp, E, A); never held back: the card; Graham's page, its bars
#    rising, and A major as the counts are ones he can trust; Helena's page, still one page: D major
LV[0] = 0.9
vw = lambda lid, word, off=0: W('value', lid, word, off)
vc = lambda lid, off=0: G('value', lid, off)
figure((Cs4, E4, A4), vw('lift', 'step', -0.2), 0.5, step=0.3, hold=0.3, last=1.4)
card(vw('wait', 'never', -0.2), 0.0035, px(450))
slide(vc('page', 0.3), 1.2, 0.0035, px(1270))
chord((A2, E3, A3, Cs4), vw('sees', 'trust', -0.2), 0.5, step=0.16, hold=2.0)
card(vc('one', 0.3), 0.0035, px(1080))
chord((D3, A3, D4, Fs4), vw('one', 'next', 0.2), 0.45, step=0.16, hold=2.0, low=False, until=E('value'))

# 7. On Monday: the Gateway City again, its crane reaching out, and the second way to A; Helena's team's four paths, D major; each piece
#    of advice laid down; and the close: the four ways to A heard together, arriving on A at once, held as A major into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
roll(mw('back', 'cranes', -0.3), 1.6, 0.003, px(1100))
figure((Cs3, E3, A3), mw('back', 'reached', -0.1), 0.5, step=0.28, hold=0.3, last=1.4, hand=pluck)
chord((D3, Fs3, A3, D4), mw('team', 'true', -0.2), 0.45, step=0.16, hold=1.8, low=False)
card(mc('page', 0.3), 0.0035, px(400))
for lid, word, x in (('tree', 'Draw', 960), ('ask', 'Ask', 1520), ('check', 'Check', 960)):
    card(mw(lid, word, -0.1), 0.0035, px(x))
# the four ways, each starting on its own beat so that all four arrive on the same A at the same moment
arr = mw('take', 'first', 0.4) + 1.2
for way, st, g in ((WAY1, 0.34, 0.45), (WAY2, 0.3, 0.4), (WAY3, 0.24, 0.36), (WAY4, 0.28, 0.36)):
    k = len(way)
    for i, m in enumerate(way[:-1]):
        rub(m - 12 if way is WAY3 else m, arr - st * (k - 1 - i), g, None, st * 0.8, until=TOT)
rub(A4, arr, 0.5, 0.0, hold=5.0, until=TOT)
chord((A2, E3, A3, Cs4), arr, 0.5, step=0.0, hold=5.0, until=TOT)
