# Rules that let people decide: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (palettes.md, reserved 5 November 2026 by the setup thread; the partner chosen 10 November 2026 by
# this film's thread): whirly tubes, made here, as music.py has none.
#  - The whirly tube: a corrugated plastic tube swung in a circle by one end. The air rushing through its ridges locks onto one of the
#    tube's overtones, chosen only by how fast it turns: slow, the second; faster, the third, the fourth, the fifth. One simple rule, and
#    the notes emerge, each a breathy, steady tone like a soft flute's, with the rush of air around it. Each note here is one overtone,
#    held steady: no swell, no wobble (the tube's own Doppler sway would read as a tremble), short, and never under the voice for long.
#  - Its partner, the thread's choice: a longer tube swung slowly, sounding only its lowest overtones: a soft, dark, breathy bass, felt
#    more than heard. One instrument in two sizes, the same rule at a slower speed, so nothing else is taken.
# Every tube is cut to a note of D major's harmonic series (just intonation, see hz()): a D tube's overtones are D, A, D, F sharp, A, D,
# E; a G tube's G, D, G, B, D; an A tube's A, E, A, C sharp; a B tube's B, F sharp, B (never its fifth, D sharp). So the notes any of
# them finds fit the others' by nature, tuned pure. D, G and A major and B and F sharp minor are pure in this table; E with G or B is
# not, and never sounds with them.
# The mark: two or three tubes finding notes that fit together. One tube finds its notes alone (D, A, D, F sharp, as it speeds up); a
# second tries a note that doesn't belong (E), then finds one that does (A); a third tries B, then finds the high D; and the three hold
# together, F sharp, A and D: a chord nobody played alone. It plays when the model shows the temples' calendar, under the title, when
# Helena stops deciding, when groups planting together emerge in the model, and at the close.
# D major; B minor for the problem (the push for more rice, every field on its own clock, the pests and the dry fields; the labs nobody
# was in; the old copy). Nothing Balinese for Bali: no gamelan, no bronze, no scale or instrument of the place (the module's
# palettes.md). The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each note one overtone, steady, with no vibrato; each gone before it would ring into the next chapter.
#    No urgent pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/rd_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.4 kHz; the effects about 12 dB under the music.

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
R1 = np.random.default_rng(1988)  # this film's own randomness: the room, the air, the water, the paper

# ---- tuning: just intonation from D, so the tubes' overtones are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 38, 12)
    return 73.41619 * 2 ** o * _JI[pc]
D2, Fs2, G2, A2, B2, D3, E3, Fs3, G3, A3, B3 = 38, 42, 43, 45, 47, 50, 52, 54, 55, 57, 59
Cs4, D4, E4, Fs4, G4, A4, B4, Cs5, D5, E5, Fs5 = 61, 62, 64, 66, 67, 69, 71, 73, 74, 76, 78

# ---- the levels: the tubes and the long tube matched by loudness, as far under the voice as the module's other music; the effects
# about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LT, LB, FX = 0.040, 0.050, 3.2
LV = [1.0]

# a small room round the tubes, ringing on for about a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.0)).astype(np.float32))(np.arange(int(1.0 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.016 * SR)] = 0; _IR /= _band(_IR)
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

# ---- a tube's note: the air locked onto one overtone, a near-sine with a little of its octave and twelfth (the tube's bore is narrow,
# so its tone is flute-like and plain), and the rush of air through the ridges, a narrow band of noise around the note, steady
def _air(f, n, width=(0.8, 1.3)):
    br = filt(noise(n / SR + 0.02)[:n], 'band', (f * width[0], min(f * width[1], 2300)))
    return br / max(1e-9, float(np.abs(br).max()))
def _tone(f, n, oct_=0.12, twelfth=0.04):
    x = np.arange(n, dtype=np.float64) / SR
    return (np.sin(2 * np.pi * f * x) + oct_ * np.sin(2 * np.pi * 2 * f * x + 0.3) + twelfth * np.sin(2 * np.pi * 3 * f * x + 0.9)).astype(np.float32)

def tube(m, s, g=1.0, pan=None, dur=0.6, room=0.22, until=None):
    """a tube swung at the speed that locks it onto this overtone, from s for dur seconds: the air takes the note in about 60 ms (a
    breath, not a swell), holds it steady, and lets it go in about 150 ms as the tube slows"""
    f = hz(m)
    if until is not None:
        dur = min(dur, max(0.12, until - s - 0.3))
    a, r = 0.06, 0.15; n = int((dur + r + 0.05) * SR); x = np.arange(n) / SR
    e = np.clip(x / a, 0, 1) ** 1.5 * np.where(x < dur, 1.0, np.exp(-(x - dur) / (r / 3)))
    sig = (_tone(f, n) + 0.14 * _air(f, n)) * e.astype(np.float32)
    sig = _until(_room(norm(filt(filt(sig, 'low', 2300), 'high', 90)), room, 0.0, min(1.0, dur)), s, until)
    put(sig, s, g * LV[0] * LT, max(-0.4, min(0.4, (m - 66) * 0.025)) if pan is None else pan)

def long(m, s, g=1.0, pan=None, dur=1.6, room=0.2, until=None):
    """the partner: a long tube swung slowly, on one of its lowest overtones: darker, more air in it, taking the note in about 120 ms and
    letting it go in about 300 ms"""
    f = hz(m)
    if until is not None:
        dur = min(dur, max(0.15, until - s - 0.4))
    a, r = 0.12, 0.3; n = int((dur + r + 0.05) * SR); x = np.arange(n) / SR
    e = np.clip(x / a, 0, 1) ** 1.5 * np.where(x < dur, 1.0, np.exp(-(x - dur) / (r / 3)))
    sig = (_tone(f, n, 0.18, 0.03) + 0.2 * _air(f, n, (0.7, 1.5))) * e.astype(np.float32)
    sig = _until(_room(norm(filt(filt(sig, 'low', 1200), 'high', 45)), room, 0.0, min(1.0, dur)), s, until)
    put(sig, s, g * LV[0] * LB, -0.1 if pan is None else pan)

# ---- what they play
def speeds(ms, s, g=1.0, step=0.3, last=1.0, pan=None, until=None):
    """one tube speeding up, its notes one after another as each overtone takes over from the last (each ends as the next begins)"""
    for i, m in enumerate(ms):
        tube(m, s + step * i, g, pan, (last if i == len(ms) - 1 else step + 0.04), until=until)
def held(ms, s, g=1.0, step=0.18, dur=1.8, until=None, bass=None):
    """two or three tubes each on its note, coming in one after another and let go together; the long tube under them if bass"""
    for i, m in enumerate(ms):
        tube(m, s + step * i, g, None, max(0.4, dur - step * i), until=until)
    if bass:
        long(bass, s, 0.9 * g, None, dur + 0.2, until=until)
def mark(s, g=1.0, up=0, until=None, hold=1.8, bass=D2):
    """the mark: one tube finds its notes alone (D, A, D, F sharp as it speeds up, the F sharp held); a second tries E, which doesn't
    belong, then finds A; a third tries B, then finds the high D; and the three hold F sharp, A and D together"""
    k = up; t1 = s + 1.15; t2 = s + 1.75
    tube(D3 + k, s, g * 0.9, None, 0.3, until=until); tube(A3 + k, s + 0.28, g * 0.9, None, 0.3, until=until)
    tube(D4 + k, s + 0.56, g, None, 0.3, until=until); tube(Fs4 + k, s + 0.84, g, None, 2.15 + hold, until=until)
    tube(E4 + k, t1, g * 0.8, 0.25, 0.26, until=until); tube(A4 + k, t1 + 0.3, g, 0.25, 1.25 + hold, until=until)
    tube(B4 + k, t2, g * 0.8, -0.25, 0.26, until=until); tube(D5 + k, t2 + 0.3, g * 0.9, -0.25, 0.65 + hold, until=until)
    if bass:
        long(bass, t2 + 0.3, 0.9 * g, None, 0.65 + hold, until=until)

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
    """a sheet pinned up: a soft flap of paper, and the pin's faint press"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 160, 0.016, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.005, pan=0.0):
    """something small set down, or a screen woken: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.005, pan=0.0):
    """a sheet slid along, or a page carried across: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.006, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def shuffle(s, sec=1.6, g=0.0045, pan=0.0):
    """a handful of cards put up one after another: one soft texture of paper that swells in and settles, not a crackle of flicks"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 9); gr = 0.65 + 0.35 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (300, 1500)) * _bump(x, sec, 1.2) * gr, s, g, pan, 1700)
def drawer(s, g=0.006, pan=0.0, sec=0.55):
    """a wooden drawer slid in or out: a low rub along its runners, and a soft knock as it stops"""
    n = int((sec + 0.2) * SR); x = np.arange(n) / SR
    rub = filt(noise(sec + 0.22)[:n], 'band', (120, 700)) * _bump(x, sec, 1.2) * (x < sec)
    _fx(rub + 0.9 * _knock(n, 110, 0.04, sec), s, g, pan, 1200)
def water(s, sec=3.0, g=0.005, pan=0.0):
    """water running down a canal and into a field: one soft, low rush that swells in and settles, never a burst of drops"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 4); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (140, 900)) * _bump(x, sec, 1.1) * gr, s, g, pan, 1000)

# =============================================================================================================================
# 1. Water, shared: the opening, the module's story from outside data. Bali, the 1970s: the long tube's low D, alone, and the canal's
#    water running down; one tube finding its notes as the place is named. A subak marked, two notes; the water temple, G major, its
#    calendar pinned up. Planting in turns: the water let into each subak's fields in turn, and a note for each group as its fields
#    flood, rising. Harvested together, resting together: the long tube's A, then D. The push: the plan's card and the order's; every
#    field on its own clock: B minor, low, out of step; the planthopper's card; the dry season, the water thinning; the lost harvest,
#    B minor, gone before "Something had to change", which has nothing under it. The model: its cells; the temples' calendar: the mark.
#    The bank, A major; "agreed". The temples set the planting again: D major, low; the pests under control; the report's card;
#    World Heritage: the tube finding its notes again, higher. The data team's hub: one low B as every question comes in; the arrows
#    turn outward; and the mark under the title card, held
LV[0] = 0.85
ow = lambda lid, word, off=0: W('subak', lid, word, off)
oc = lambda lid, off=0: G('subak', lid, off)
END = E('subak')
long(D2, 0.4, 0.85, 0.0, dur=3.2)
water(0.8, 4.2, 0.0045, px(160))
speeds((D3, A3, D4), ow('when', 'Bali', 0.1), 0.65, step=0.32, last=1.4)
card(ow('when', 'Bali', -0.2), 0.004, px(400))
water(ow('years', 'water', -0.3), 2.6, 0.004, px(180))
tube(Fs4, ow('subak', 'subak', 0.2), 0.55, px(700) * 0.4, 0.5); tube(A4, ow('subak', 'subak', 0.5), 0.55, px(700) * 0.4, 1.2)
# the water temple: the groups meet and agree a calendar: G major, and the calendar pinned up
held((G3, D4, B4), oc('temple', 0.1), 0.55, step=0.2, dur=2.2, bass=G2)
card(ow('temple', 'calendar', -0.2), 0.004, px(430))
# planting in turns: the water let into the fields, subak by subak; a note for each group, rising, as its fields flood
water(oc('turns', 0.5), 4.6, 0.0045, px(900))
for k, m in enumerate((D4, Fs4, A4)):
    tube(m, oc('turns', 0.6 + k * 1.8), 0.5, px(900) * 0.3, 1.2 if k < 2 else 1.6)
# harvested together, resting together: the long tube's A, then D
long(A2, ow('rest', 'harvested', -0.1), 0.6, None, dur=1.2); long(D2, ow('rest', 'hungry', -0.1), 0.6, None, dur=1.4)
# the push for more rice: the plan's card, the order's card; every field on its own clock: B minor, low, its notes out of step
card(ow('push', 'grow', -0.3), 0.004, px(430))
card(ow('told', 'plant', -0.2), 0.004, px(1510))
for m, off, d in ((B3, 0.0, 0.5), (Fs4, 0.75, 0.45), (D4, 1.15, 0.5)):
    tube(m, ow('told', 'often', off), 0.42, None, d)
long(B2, ow('clock', 'clock', -0.1), 0.6, None, dur=1.6)
tube(Fs4, ow('clock', 'pests', 0.1), 0.4, 0.2, 0.45); tube(D4, ow('clock', 'next', 0.0), 0.4, -0.2, 0.6)
# the brown planthopper, drawn large; two million tons; the fields it took
card(ow('hopper', 'planthopper', -0.4), 0.004, px(1410))
card(ow('hopper', 'million', -0.3), 0.004, px(480))
long(B2, ow('hopper', 'million', 0.2), 0.55, None, dur=1.8)
# the dry season: the canal's water thinning; the lost harvest: B minor, held low, gone before "Something had to change"
water(ow('dry', 'downstream', -0.2), 2.2, 0.003, px(1340))
card(ow('harm', 'harvest', -0.2), 0.004, px(1490))
held((B3, D4, Fs4), ow('harm', 'harvest', 0.1), 0.45, step=0.24, dur=2.0, until=oc('change', -0.3), bass=B2)
# the model: two rivers and their 172 subaks, the cells coming in; the temples' calendar, the groups planting together: the mark
card(ow('model', 'computer', -0.3), 0.004, px(1580))
slide(ow('model', 'hundred', -0.2), 1.2, 0.0035, px(690))
mark(ow('showed', 'calendar', -0.1), 0.6, hold=1.4)
card(ow('showed', 'calendar', 0.3), 0.004, px(1580))
# 1988: to the bank; "agreed", A major
card(oc('bank', 0.1), 0.004, px(1580))
held((A3, E4, A4, Cs5), ow('bank', 'agreed', -0.1), 0.45, step=0.16, dur=1.6, bass=A2)
# the temples set the planting again: D major, low; pests under control, less spraying: the long tube's D, and the high D
held((D3, A3, D4), ow('back', 'temples', -0.1), 0.5, step=0.22, dur=2.0, bass=D2)
tube(D5, ow('pests', 'control', -0.1), 0.4, 0.15, 1.2)
card(ow('report', 'report', -0.3), 0.004, px(520))
# World Heritage: the tube finding its notes again, an octave up, then let go
card(ow('unesco', 'twenty', -0.4), 0.004, px(1470))
speeds((D4, A4, D5, Fs5), ow('unesco', 'UNESCO', 0.0), 0.45, step=0.3, last=1.6)
# a data team: every question comes in to one place: one low B; then given back, the arrows turning outward; the title: the mark, held
long(B2, oc('data', 0.5), 0.5, None, dur=1.6)
tube(A4, ow('film', 'back', 0.0), 0.4, 0.0, 0.8)
mark(oc('breath', 0.3), 0.6, until=END, hold=2.0)

# 2. Every question, one door: the university, a year from now: the chapter turns on G major, low. The University Council's card; the
#    four officers, one note each as each comes in, the four notes of D major's chord from low to high; Ivy and Teaching space use, its
#    card; the team's one front door, the requests carried to it, one soft slide each; 27, its card; the waiting, the long tube's B;
#    Helena: whose rooms first, B and D together, a question left open; every decision through one place; and the mark as she stops
#    deciding and the arrows turn outward
LV[0] = 0.9
dw = lambda lid, word, off=0: W('door', lid, word, off)
dc = lambda lid, off=0: G('door', lid, off)
held((G3, B3), S0('door') + 0.3, 0.5, step=0.22, dur=1.8, bass=G2)
card(dw('univ', 'September', -0.3), 0.004, px(1520))
card(dw('council', 'Council', -0.3), 0.004, px(1490))
for k, (m, x) in enumerate(((D4, 330), (Fs4, 750), (A4, 1170), (D5, 1590))):
    tube(m, dc('officers', k * 0.25), 0.4, px(x) * 0.4, 0.9 - 0.1 * k)
card(dw('product', 'Teaching', -0.3), 0.004, px(1240))
for k in range(0, 9, 2):
    slide(dw('only', 'question', -0.3 + k * 0.42), 0.9, 0.0028, px(700))
card(dw('asked', 'twenty', -0.4), 0.004, px(350))
long(B2, dw('wait', 'weeks', -0.2), 0.55, None, dur=1.6)
card(dc('helena', 0.3), 0.0035, px(960))
held((B3, D4), dw('helena', 'chose', -0.1), 0.45, step=0.24, dur=1.5)
mark(dw('decide', 'stop', -0.2), 0.55, hold=1.2)

# 3. Three rules, each with its reason: the chapter turns on the long tube's A; Yusuf's first draft pinned up; his eleven, one soft
#    texture of cards; the question, what goes wrong without it, nothing under it; three were needed: three notes, one for each card that
#    keeps its blue band; each rule's card; the other eight into the drawer, slid and shut; Ostrom's card; the ones that lasted, G major,
#    a few clear notes; and D major as the four officers agree the three
LV[0] = 0.9
rw = lambda lid, word, off=0: W('rules', lid, word, off)
rc = lambda lid, off=0: G('rules', lid, off)
long(A2, S0('rules') + 0.3, 0.6, None, dur=1.6)
card(rw('yusuf', 'drafted', -0.3), 0.004, px(940))
shuffle(rw('eleven', 'eleven', -0.4), 1.6, 0.0035, px(1100))
for k, (m, x) in enumerate(((D4, 566), (Fs4, 1046), (A4, 1286))):
    tube(m, rw('three', 'Three', -0.2 + 0.2 * k), 0.45, px(x) * 0.4, 1.0 - 0.15 * k)
for lid, x in (('r1', 320), ('r2', 790), ('r3', 1260)):
    card(rc(lid, -0.1), 0.004, px(x))
slide(rw('drawer', 'drawer', -0.6), 1.0, 0.0035, px(1500)); drawer(rw('drawer', 'drawer', 0.6), 0.005, px(1690))
card(rc('ostrom', 0.2), 0.004, px(530))
card(rw('lasted', 'lasted', -0.3), 0.004, px(1390))
held((G3, B3, D4), rw('lasted', 'few', -0.1), 0.42, step=0.26, dur=1.7)
held((Fs4, A4, D5), rw('with', 'agreed', 0.3), 0.45, step=0.18, dur=1.8, bass=D2)

# 4. The right way, the easy way: the chapter turns on the tube's D and A; the three rules' cards, the screen woken; the template on the
#    big screen; an officer copies it: an afternoon, A and C sharp; Anil's name; who decides what, a pen's stroke for each line; data
#    mesh's card and Team Topologies'; and D major as the four faculties' screens wake and the room reports by hand stop
LV[0] = 0.9
tw = lambda lid, word, off=0: W('tools', lid, word, off)
tc = lambda lid, off=0: G('tools', lid, off)
speeds((D4, A4), S0('tools') + 0.3, 0.45, step=0.3, last=1.2)
for k in range(3):
    card(tw('easy', 'Rules', -0.2 + 0.15 * k), 0.0032, px(485 + 165 * k))
tap(tw('easy', 'Tools', -0.2), 0.004, px(1280))
tap(tw('template', 'template', 0.1), 0.0045, px(960))
held((A3, Cs4), tw('copy', 'afternoon', -0.2), 0.42, step=0.2, dur=1.3)
card(tw('anil', 'Anil', -0.2), 0.0035, px(760))
for word in ('faculties', 'Ivy'):
    pen(tw('whos', word, -0.2), 0.5, 0.0045, px(1180), 2)
for word in ('team', "registrar's"):
    pen(tw('keeps', word, -0.2), 0.5, 0.0045, px(1180), 2)
card(tw('mesh', 'mesh', -0.3), 0.004, px(520)); card(tw('mesh', 'Topologies', -0.3), 0.004, px(1400))
for k in range(4):
    tap(tc('start', 0.3 + 0.25 * k), 0.0035, px(330 + 420 * k))
held((D4, Fs4, A4), tw('start', 'stopped', -0.3), 0.45, step=0.2, dur=2.2, bass=D2)

# 5. Labs on a Monday: the chapter turns on the long tube's D; Lucy's page woken; the counts beside the bookings, slid in; nine labs
#    booked and nobody there: B minor, low; what Lucy knew, her card; rule three's card; the glossary written; released: the tube's D, F
#    sharp and A, rising; then something nobody planned: G and D; Lucy's page carried to Health, then to Arts, each landing with a note of
#    its own tube; and the model again: the cells regrouping year by year, and the mark as groups planting together appear, held through
#    "Nobody had drawn them"
LV[0] = 0.9
lw = lambda lid, word, off=0: W('labs', lid, word, off)
lc = lambda lid, off=0: G('labs', lid, off)
long(D2, S0('labs') + 0.3, 0.55, None, dur=1.8)
tap(lw('labs', 'labs', -0.4), 0.0045, px(1160))
slide(lw('side', 'counts', -0.4), 1.0, 0.0035, px(1160))
held((B3, D4, Fs4), lw('empty', 'nobody', -0.2), 0.42, step=0.22, dur=1.8, bass=B2)
card(lc('why', 0.3), 0.004, px(1020))
card(lw('rule3', 'measure', -0.1), 0.004, px(910))
pen(lw('gloss', 'glossary', 0.0), 0.8, 0.005, px(960), 3)
speeds((D4, Fs4, A4), lw('freed', 'released', -0.1), 0.42, step=0.28, last=1.2)
card(lw('freed', 'hold', -0.3), 0.0035, px(1460))
held((G3, D4), lc('then', 0.2), 0.42, step=0.3, dur=1.4)
slide(lw('spread', 'Health', -0.3), 1.4, 0.004, px(1150)); tube(A4, lw('spread', 'Health', 1.1), 0.4, px(1440) * 0.4, 0.9)
slide(lw('spread', 'Arts', -0.3), 1.4, 0.004, px(780)); tube(Cs5, lw('spread', 'Arts', 1.1), 0.36, px(860) * 0.4, 0.9)
card(lc('model', 0.2), 0.004, px(1580))
mark(lw('emerge', 'appeared', -0.2), 0.55, up=0, hold=2.4, bass=D2)

# 6. Watch what emerges: the chapter turns on the tube's A and E, low, in the late light; the plans for February, a card each; one peak
#    class in six moved, D and F sharp; 27 and 0; Helena watching what emerges: G major, open; the old copy's card, three weeks old, the
#    long tube's B; the drawer opened, the fourth rule slid out and up; the date in the corner, one tap; and the four rules, D major
LV[0] = 0.9
ww = lambda lid, word, off=0: W('watch', lid, word, off)
wc = lambda lid, off=0: G('watch', lid, off)
speeds((A3, E4), S0('watch') + 0.3, 0.42, step=0.32, last=1.3)
card(S0('watch') + 0.6, 0.0035, px(420))
for k in range(4):
    card(ww('plans', 'four', -0.3 + 0.3 * k), 0.003, px(895 + 270 * k))
held((D4, Fs4), ww('moved', 'six', -0.2), 0.42, step=0.24, dur=1.5)
card(ww('none', 'reports', -0.1), 0.0035, px(560)); card(ww('none', 'reports', 0.3), 0.0035, px(1360))
held((D4, G4, B4), ww('role', 'watching', -0.2), 0.4, step=0.24, dur=1.8, bass=G2)
card(wc('problem', 0.0), 0.004, px(960))
long(B2, ww('problem', 'weeks', -0.1), 0.5, None, dur=1.4)
drawer(ww('rule4', 'drawer', -1.0), 0.005, px(1700)); slide(ww('rule4', 'drawer', 0.2), 1.0, 0.0035, px(1100))
tap(ww('date', 'date', -0.3), 0.004, px(1400))
for k in range(4):
    card(wc('four', 0.1 + 0.25 * k), 0.003, px(285 + 455 * k))
held((D3, A3, D4, Fs4), ww('four', 'still', -0.1), 0.42, step=0.2, dur=2.2, until=E('watch'), bass=D2)

# 7. On Monday: Bali comes back: the tube finding its notes, low, as it did at the start; the university's four faculties and their
#    pages: G and B; each piece of advice pinned up; and the close: the mark, its chord held as D major into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
long(D2, S0('monday') + 0.3, 0.6, None, dur=2.4)
speeds((D3, A3, D4, Fs4), mw('bali', 'calendar', -0.2), 0.42, step=0.32, last=1.4)
held((B3, G4), mc('uni', 0.4), 0.4, step=0.26, dur=1.5)
for lid, x in (('m1', 380), ('m2', 960), ('m3', 1540), ('m4', 660), ('m5', 1260)):
    card(mc(lid, 0.3), 0.0035, px(x))
mark(mw('last', 'trust', 0.2), 0.55, up=0, hold=4.2, until=TOT)
