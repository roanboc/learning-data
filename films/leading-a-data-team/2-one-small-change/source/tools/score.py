# One small change at a time: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The module's palette for this film (palettes.md, row 8: a lead the setup thread reserved on 5 November 2026, which no score on main has
# and no other module's palette names): a tubulum, made here, as music.py has none.
#  - The tubulum: open plastic pipes, each cut to the length of one note, laid side by side and struck at their open ends. Each pipe is
#    tuned by cutting it a little shorter, which raises its note: an instrument tuned one small change at a time. Here it's played open,
#    with soft felt beaters that never cover the pipe's end, so each pipe sounds as an open pipe: a soft knock, then the air inside
#    sounds its note, round and hollow, every harmonic in it, and dies away by itself within half a second or so. Data protection's
#    Network, storage and keys plays plastic pipes too, slapped shut with a paddle (a closed pipe: a lower, popping note, its odd
#    harmonics only): these are struck open, an octave above the same pipe slapped, with the even harmonics too, and no slap.
#  - Its partner, the thread's choice: the tubulum's own longest pipes, struck open with a larger, softer beater: a round, low note
#    that rings a little longer, under the turns. One instrument in two sizes, as the film's idea is one thing made better in small
#    steps, not a second voice; and every other struck colour the site lacks belongs to another culture or sounds like one the site has
#    (the long list in the module's palettes.md), as the module's other threads found too.
# The mark: a short figure, played again with one note changed for the better. E flat, G, F, D: it stops short, on the note below
# home. Then E flat, G, F, E flat: the same pipes, but the last one cut a little shorter, so its D rises to E flat, and the figure comes
# home. It's heard when the staff at Castle Street try a change and keep it, when Ivy tries skipping her hand check and keeps the change,
# and at the close, under "Change one small thing, check it, keep what works", its last note held into the end card.
# E flat major, C minor for the opening's problem (the infections, and no money for a fix), and E flat major once the staff take up
# the new way. Every chord is tuned pure from E flat (just intonation, see hz()): E flat, A flat and B flat major, and C and G minor,
# are all pure in this table; F minor, and F held with A flat or C, are not, and never sound together. Nothing Sri Lankan or Japanese
# for the hospital, or for kaizen: no pentatonic tune, no gong, no instrument of either place (the module's palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each pipe struck once, steady, with no vibrato or bend, its partials harmonic; a pipe can't be held, so
#    nothing drones. No urgent pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/kz_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.3 kHz; the effects about 12 dB under the music.

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
R1 = np.random.default_rng(2000)  # this film's own randomness: the room, the paper, the felt

# ---- tuning: just intonation from E flat, so a chord's notes are whole-number ratios of each other and nothing beats. E flat, A flat
# and B flat major, and C and G minor, are pure in this table; F minor, and F held with A flat or C, are not, and never sound together
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 39, 12)
    return 77.78175 * 2 ** o * _JI[pc]
Eb2, F2, G2, Ab2, Bb2, C3, D3, Eb3, F3, G3, Ab3, Bb3 = 39, 41, 43, 44, 46, 48, 50, 51, 53, 55, 56, 58
C4, D4, Eb4, F4, G4, Ab4, Bb4, C5, D5, Eb5, G5 = 60, 62, 63, 65, 67, 68, 70, 72, 74, 75, 79

# ---- the levels: the pipes and the long pipes matched by loudness, as far under the voice as the module's other music; the effects
# about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LP, LL, FX = 0.078, 0.1, 3.2
LV = [1.0]

# a small room round the pipes, ringing on for about a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.0)).astype(np.float32))(np.arange(int(1.0 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.012 * SR)] = 0; _IR /= _band(_IR)
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
def _felt(sec, n, f=380, d=0.005):
    """a felt beater meeting the pipe's rim: a little low noise, gone in a few thousandths of a second"""
    x = np.arange(n) / SR; th = filt(noise(sec + 0.02)[:n], 'low', f) * np.exp(-x / d)
    return th / max(1e-9, float(np.abs(th).max()))

# ---- an open pipe's partials: every harmonic, as an open pipe has (open at both ends), softer as they rise, since the felt is soft
# and the pipe is narrow; each higher one gone sooner. The second and third, which give an open pipe its hollow sound, a little
# stronger than a plain fall would make them; the seventh, out of tune with every note of a 5-limit scale, and the few above it that are,
# kept low
_ODD = {2: 1.15, 3: 1.1, 7: 0.25, 11: 0.35, 13: 0.35, 14: 0.25}
def _pipe(f0, x, t1, soft, top=2300):
    sig = np.zeros(len(x))
    for k in range(1, 30):
        fk = f0 * k
        if fk > top:
            break
        a = k ** -1.25 * np.exp(-(k - 1) / soft) * _ODD.get(k, 1.0)
        sig += a * np.sin(2 * np.pi * fk * x + 0.5 * k) * np.exp(-x / (t1 / (1 + 0.55 * (k - 1))))
    return sig
def _air(f0, n, sec, d=0.035):
    """the breath of air in the pipe as it's struck: a little noise, sounding only at the pipe's first two notes, gone at once"""
    x = np.arange(n) / SR; a = np.zeros(n, np.float32)
    for k, g in ((1, 1.0), (2, 0.5)):
        fk = f0 * k
        if fk < 2000:
            a += g * filt(noise(sec + 0.02)[:n], 'band', (fk * 0.97, fk * 1.03))
    a = a * np.exp(-x / d).astype(np.float32)
    return a / max(1e-9, float(np.abs(a).max()))

def pipe(m, s, g=1.0, pan=None, room=0.25, until=None):
    """a pipe struck at its open end with a soft felt beater at s: a soft knock, then the air in it sounds its note, round and hollow,
    and dies away by itself"""
    f0 = hz(m); t1 = 0.42 * (155 / f0) ** 0.35; sec = min(2.2, 7 * t1 + 0.15)
    if until is not None:
        sec = min(sec, max(0.2, until - s))
    n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _pipe(f0, x, t1, 3.6 * (155 / f0) ** 0.4)
    sig *= (1 - np.exp(-x / 0.0018))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.05 * _felt(sec, n) + 0.08 * _air(f0, n, sec)
    sig = sig.astype(np.float32)
    sig = _until(_room(norm(filt(filt(sig, 'low', 2300), 'high', 70)), room, 0.0, min(0.6, sec)), s, until)
    put(sig, s, g * LV[0] * LP, max(-0.35, min(0.35, (m - 63) * 0.02)) if pan is None else pan)

def low(m, s, g=1.0, pan=None, room=0.2, until=None):
    """one of the longest pipes, struck open with a larger, softer beater: softer at its start, a round, low note with few high
    partials, ringing a little longer, felt more than heard"""
    f0 = hz(m); t1 = 0.75 * (78 / f0) ** 0.3; sec = min(3.0, 6 * t1 + 0.2)
    if until is not None:
        sec = min(sec, max(0.2, until - s))
    n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = _pipe(f0, x, t1, 2.2, 1400)
    sig *= (1 - np.exp(-x / 0.004))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.06 * _felt(sec, n, 240, 0.009) + 0.06 * _air(f0, n, sec, 0.05)
    sig = sig.astype(np.float32)
    sig = _until(_room(norm(filt(filt(sig, 'low', 1400), 'high', 40)), room, 0.0, min(0.8, sec)), s, until)
    put(sig, s, g * LV[0] * LL, -0.12 if pan is None else pan)

# ---- what they play
def chord(notes, s, g=1.0, step=0.13, until=None):
    """a chord struck from its lowest pipe up, a long pipe for any note below E flat 3"""
    for i, m in enumerate(notes):
        (low if m < Eb3 else pipe)(m, s + step * i, g, until=until)
def figure(notes, s, g=1.0, step=0.24, until=None):
    """a short figure, a pipe at a time"""
    for i, m in enumerate(notes):
        (low if m < Eb3 else pipe)(m, s + step * i, g, until=until)
MARK = (Eb4, G4, F4, D4)          # the mark: it stops short, on the note below home
BETTER = (Eb4, G4, F4, Eb4)       # the same pipes, the last cut a little shorter: D rises to E flat, and the figure comes home
def mark(notes, s, g=1.0, step=0.26, down=0, bass=(), until=None):
    """the mark, in its register (down octaves lower), and the long pipes under it, each at the place in the figure it's given"""
    for i, m in enumerate(notes):
        (low if m - 12 * down < Eb3 else pipe)(m - 12 * down, s + step * i, g, until=until)
    for m, i in bass:
        low(m, s + step * i, 0.85 * g, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.0035, pan=0.0):
    """a sheet pinned up: a soft flap of paper, and the pin's faint press"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 160, 0.016, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.004, pan=0.0):
    """something small set down, or a label pressed on: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.004, pan=0.0):
    """a bar drawn out, or a box slid along a shelf: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def pen(s, sec=0.7, g=0.005, pan=0.0, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.0045, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)
def struck(s, g=0.0045, pan=0.0):
    """a line drawn through a step: one long stroke of a pen"""
    pen(s, 0.45, g, pan, 1)
def box(s, g=0.005, pan=0.0):
    """a box lifted off a shelf and taken away: a short scrape of card on the shelf, and its soft lift"""
    n = int(0.42 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.44)[:n], 'band', (220, 1000)) * _bump(x, 0.3, 1.2) * (x < 0.3) + 0.4 * _knock(n, 130, 0.03, 0.02), s, g, pan, 1300)
def cloth(s, sec=0.8, g=0.004, pan=0.0):
    """a cloth wiped along a shelf: one soft stroke that swells and fades"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (300, 1500)) * _bump(x, sec, 1.1), s, g, pan, 1600)

# =============================================================================================================================
# 1. Ward by ward: the opening, the module's story from outside data. Colombo, 2000: the long pipe's low E flat, alone, then E flat major
#    as the hospital comes in; the sheets pinned up. The infections, outlined in amber ward by ward: C minor's notes one at a time, low,
#    as each kind of room is outlined; C minor under the danger to mother and child; the long pipe's A flat under "no money", and nothing
#    under "Something has to change". The five steps: B flat major as the way arrives; in the store, a pipe on each step, rising, with a
#    box lifted away, things set down, a cloth wiped along, labels pressed on. The staff, A flat major. Kaizen: the mark, short of home,
#    as the staff propose a change and try it; then the same pipes with the last one cut a little shorter, home, as they keep it. Ward
#    by ward: one pipe for each ward that takes it up, rising. The infections fall: E flat major. Fifteen countries: A flat major.
#    Nobody was told to work harder: A flat, then E flat, as the people who did the work improved it. Data work's chores by hand: C and
#    A flat, low, under the mistakes and the hours. One small change at a time: the stair drawn, a pipe for each step, rising to D, the
#    note below home; and E flat major under the title card, home
LV[0] = 0.85
ow = lambda lid, word, off=0: W('wards', lid, word, off)
oc = lambda lid, off=0: G('wards', lid, off)
END = E('wards')
low(Eb2, 0.5, 0.85, 0.0)
chord((Eb3, Bb3, Eb4, G4), ow('when', 'Colombo', 0.1), 0.65, step=0.17)
card(ow('when', 'Colombo', -0.2), 0.0035, px(430))
card(ow('where', 'director', -0.1), 0.0035, px(430))
card(ow('where', 'Castle', -0.2), 0.0035, px(1360))
# the infections: the wards outlined in amber, then the operating theatre, then the nursery, each with a note of C minor, low to high
low(C3, ow('infect', 'mothers', -0.1), 0.7)
pipe(G3, ow('infect', 'Caesarean', -0.1), 0.6, px(900) * 0.4)
pipe(Eb4, ow('infect', 'newborn', -0.1), 0.55, px(1300) * 0.4)
card(oc('infect', 0.2), 0.0035, px(960))
# close on a ward: what an infection is; C minor under the danger to mother and child
card(oc('means', 1.2), 0.0035, px(1410))
chord((C3, G3, C4, Eb4), ow('means', 'danger', -0.1), 0.5, step=0.16)
# no money for a fix: one low A flat, as the sheet goes up; nothing under "Something has to change"
card(oc('money', 1.5), 0.0035, px(960))
low(Ab2, ow('money', 'nothing', 0.0), 0.65, until=oc('change', -0.5))
# towards the store: five steps, from Japanese factories: B flat major, as the way arrives
card(ow('fives', 'Japanese', -0.2), 0.0035, px(960))
chord((Bb2, F3, Bb3, D4), ow('fives', 'five', 0.0), 0.5, step=0.15)
# the store, close: a pipe on each step as it's named, rising; a box lifted away, things set in order, a cloth along the shelf, labels
card(oc('steps', -0.2), 0.0035, px(280))
for word, m in (('Sort', Eb3), ('Set', F3), ('Shine', G3), ('Standardise', Ab3), ('sustain', Bb3)):
    pipe(m, ow('steps', word, 0.05), 0.5, px(560) * 0.4)
box(ow('steps', 'Sort', 0.3), 0.005, px(700)); box(ow('steps', 'Sort', 1.3), 0.0045, px(420))
tap(ow('steps', 'Set', 0.4), 0.004, px(560)); tap(ow('steps', 'Set', 1.1), 0.0035, px(700))
cloth(ow('steps', 'Shine', 0.1), 1.0, 0.004, px(560))
tap(ow('steps', 'Standardise', 0.2), 0.0035, px(560))
# costs little, everyone can see it; the staff do it themselves: A flat major, warm
tap(ow('cheap', 'costs', 0.0), 0.0035, px(280)); tap(ow('cheap', 'everyone', 0.0), 0.0035, px(280))
chord((Ab2, Eb3, C4, Ab4), ow('own', 'themselves', 0.0), 0.5, step=0.15)
# kaizen: the mark, short of home, as the staff propose a change and try it; home, as they keep it
card(oc('kaizen', -0.1), 0.0035, px(290))
mark(MARK, ow('kaizen', 'small', 0.0), 0.6, step=0.26, bass=((C3, 0),))
mark(BETTER, ow('kaizen', 'keep', 0.0), 0.6, step=0.26, bass=((Eb2, 0), (Bb2, 3)))
# back to the whole hospital: the first ward to take it up, then ward by ward, a pipe for each as it lights, rising
pipe(Eb3, ow('spread', 'first', 0.0), 0.45, px(528) * 0.4)
for i, m in enumerate((G3, Bb3, Eb4, G4, Bb4, Eb5, G5)):
    pipe(m, ow('spread', 'Ward', -0.1 + 0.42 * i), 0.4, px(400 + 160 * i) * 0.4)
# in two years, the infections fall by half: E flat major, from low; the bars drawn shorter
card(oc('fall', -0.1), 0.0035, px(960))
slide(ow('fall', 'half', -0.2), 1.0, 0.0035, px(900)); slide(ow('fall', 'more', -0.1), 1.0, 0.0035, px(900))
chord((Eb2, Bb2, G3, Eb4), ow('fall', 'half', 0.0), 0.55, step=0.16)
# and beyond: other hospitals in Sri Lanka; fifteen African countries: A flat major, the sheet's hospitals set down in two groups
card(oc('africa', 0.5), 0.0035, px(430))
card(ow('africa', 'Japan', -0.3), 0.0035, px(1275))
tap(ow('africa', 'public', 0.0), 0.0035, px(1100)); tap(ow('africa', 'fifteen', 0.0), 0.0035, px(1500))
chord((Ab2, Ab3, C4, Eb4), ow('africa', 'fifteen', 0.1), 0.5, step=0.14)
# nobody was told to work harder: A flat, then E flat, as the people who did the work improved it, a small step at a time
card(oc('blame', 0.2), 0.0035, px(960))
chord((Ab3, C4, Eb4), oc('blame', 0.3), 0.45, step=0.18)
chord((Eb3, G3, Bb3, Eb4), ow('blame', 'improved', -0.1), 0.45, step=0.18)
tap(ow('blame', 'small', -0.1), 0.0035, px(960))
# data work's chores by hand: C and A flat, low, under the mistakes and the hours
card(ow('data', 'weekly', -0.2), 0.0035, px(530))
low(C3, ow('data', 'mistakes', 0.0), 0.55, px(300) * 0.4)
low(Ab2, ow('data', 'hours', 0.0), 0.55, px(640) * 0.4)
# one small change at a time: the stair drawn, a pipe for each step, rising to D, the note below home; then home under the title card
card(oc('same', 0.2), 0.0035, px(1420))
for i, m in enumerate((Eb4, F4, G4, Ab4, Bb4, C5, D5)):
    pipe(m, ow('same', 'one', -0.1 + 0.6 * i), 0.4, px(1110 + 90 * i) * 0.4)
chord((Eb2, Bb2, Eb3, G3, Bb3, Eb4), oc('breath', 0.3), 0.65, step=0.2, until=END)

# 2. Two hours every Monday: the chapter turns on G minor, low; Ivy's product and its promise, pinned up; the job publishes at six, one
#    pipe; her two hours by hand, drawn out along the morning; not checked yet, a low C, and a reader who opens the page; her mid-year
#    conversation, A flat major as the room turns; what's in the way, a B flat left open; the time Helena gives, E flat major; and
#    kaizen's first idea, three pipes rising
LV[0] = 0.9
hw = lambda lid, word, off=0: W('hours', lid, word, off)
hc = lambda lid, off=0: G('hours', lid, off)
chord((G2, D3, G3, Bb3), S0('hours') + 0.3, 0.5, step=0.16)
card(hc('own', 0.3), 0.0035, px(1130))
card(hw('promise', 'promise', -0.2), 0.0035, px(1130))
card(hc('job', -0.3), 0.0035, px(1250))
pipe(Eb4, hw('job', 'six', 0.0), 0.5, px(705) * 0.4)
slide(hw('hand', 'checking', -0.1), 2.0, 0.0035, px(1200))
low(C3, hc('risk', -0.1), 0.6)
tap(hw('risk', 'opens', -0.1), 0.0035, px(1000))
chord((Ab2, Eb3, Ab3, C4), hc('talk', 0.3), 0.5, step=0.16)
card(hw('talk', 'mid', -0.2), 0.0035, px(960))
card(hw('talk', 'asks', -0.1), 0.0035, px(960))
card(hw('way', 'asks', -0.1), 0.0035, px(960))
pipe(Bb3, hw('way', 'way', 0.1), 0.5)
card(hw('time', 'gives', -0.1), 0.0035, px(960))
chord((Eb3, G3, Bb3, Eb4), hw('time', 'Thursday', 0.0), 0.5, step=0.16)
card(hc('idea', 0.1), 0.0035, px(960))
figure((Bb3, Eb4, G4), hw('idea', 'everyone', 0.0), 0.45, step=0.3)

# 3. Measure, then simplify: the cycle drawn, a pipe for each arc as the voice names it; its history pinned up; kaizen, change for the
#    better, E flat major; Ivy's refresh timed, its rows drawn out, and a low C under its two hours; who needs this?; the test since
#    April, ticked; one Monday, one small change: the mark, short of home, as she skips her check, and home as she keeps the change; the
#    copy for Facilities; two steps struck through, and B flat major under the ninety minutes
LV[0] = 0.9
mw = lambda lid, word, off=0: W('measure', lid, word, off)
mc = lambda lid, off=0: G('measure', lid, off)
card(S0('measure') + 0.5, 0.0035, px(530))
for word, m in (('plan', Bb3), ('do', D4), ('check', F4), ('act', Bb4)):
    pipe(m, mw('cycle', word, 0.0), 0.45, px(530) * 0.4)
card(mc('shew', 0.2), 0.0035, px(1430))
card(mw('imai', 'Imai', -0.4), 0.0035, px(1430))
chord((Eb3, Bb3, Eb4, G4), mw('imai', 'kaizen', 0.0), 0.45, step=0.15)
card(mw('measure', 'Monday', -0.3), 0.0035, px(1270))
slide(mw('measure', 'times', -0.1), 2.4, 0.0035, px(1270))
low(C3, mw('measure', 'hundred', 0.0), 0.55)
tap(mw('back', 'who', -0.1), 0.0035, px(330))
card(mw('test', 'since', -0.2), 0.0035, px(1270))
ticked(mw('test', 'checked', -0.1), 0.0045, px(1764))
card(mc('try', 0.1), 0.0035, px(1270))
mark(MARK, mw('try', 'skips', 0.0), 0.5, step=0.26, down=1, bass=((C3, 0),))
mark(BETTER, mw('try', 'keeps', 0.0), 0.5, step=0.26, down=1, bass=((Ab2, 0), (Eb2, 3)))
card(mc('copy', 0.2), 0.0035, px(1270))
card(mc('ninety', -0.3), 0.0035, px(1270))
struck(mc('ninety', 0.1), 0.0045, px(1270))
chord((Bb2, F3, D4, Bb4), mw('ninety', 'ninety', 0.0), 0.45, step=0.15)

# 4. Standardise, then automate: the chapter turns on E flat, from its fifth; the checklist pinned up, each step's what-good-looks-like;
#    Jun follows it, a tick for each step, and G minor under the same result in the same time; only then, automate: a muddle, a low C;
#    one check a week into the job, a pipe for each, rising; Sam's review, the hand check beside it; the job stops when a check fails,
#    a low A flat; ten minutes, checked: E flat major, ringing on as nobody opens the page to a number that's wrong
LV[0] = 0.9
aw = lambda lid, word, off=0: W('automate', lid, word, off)
ac = lambda lid, off=0: G('automate', lid, off)
chord((Bb2, Eb3, G3, Eb4), S0('automate') + 0.3, 0.45, step=0.18)
card(ac('list', 0.0), 0.0035, px(960))
tap(aw('same', 'changes', -0.1), 0.0035, px(760)); tap(aw('same', 'anyone', -0.1), 0.0035, px(1180))
for i in range(4):
    ticked(aw('jun', 'follows', -0.1 + 0.55 * i), 0.004, px(608))
chord((G3, Bb3, D4, G4), aw('jun', 'same', 0.0), 0.45, step=0.16)
card(ac('muddle', 0.1), 0.0035, px(980))
low(C3, aw('muddle', 'muddle', 0.0), 0.55)
card(ac('sept', -0.1), 0.0035, px(1010))
for i, m in enumerate((Eb4, G4, Bb4)):
    pipe(m, aw('sept', 'step', -0.1 + 0.9 * i), 0.45, px(610) * 0.4)
tap(aw('review', 'reviews', -0.1), 0.0035, px(1640))
tap(aw('review', 'beside', -0.2), 0.0035, px(330))
low(Ab2, aw('stop', 'fails', 0.0), 0.6, px(1150) * 0.4)
card(ac('ten', -0.1), 0.0035, px(1250))
chord((Eb2, Bb2, G3, Bb3, Eb4), aw('ten', 'ten', 0.0), 0.5, step=0.16)
tap(aw('safe', 'opens', -0.1), 0.0035, px(1140))

# 5. The leader's part: three cards pinned up, empty, as the voice says there were three things; as each fills in, a pipe, rising
#    through E flat major; the review: the stair of small changes, as in the opening, rising to its last step; who did the work; none of
#    these, only these; the team's Friday half-hour, B flat major as the room turns to the whole team; the other films' tags
LV[0] = 0.9
lw = lambda lid, word, off=0: W('leader', lid, word, off)
lc = lambda lid, off=0: G('leader', lid, off)
for i, xx in enumerate((800, 1230, 1660)):
    card(lw('none', 'three', -0.2 + 0.2 * i), 0.0035, px(xx))
pipe(Eb4, lw('ask', 'asked', -0.2), 0.45, px(800) * 0.4)
pipe(G4, lw('give', 'gave', -0.2), 0.45, px(1230) * 0.4)
pipe(Bb4, lw('show', 'showed', -0.2), 0.45, px(1660) * 0.4)
card(lw('show', 'review', 0.0), 0.0035, px(590))
for i, m in enumerate((Eb3, F3, G3, Ab3, Bb3, C4, Eb4)):
    pipe(m, lw('show', 'chart', -0.1 + 0.3 * i), 0.4, px(590) * 0.4)
tap(lw('named', 'named', -0.1), 0.0035, px(590))
card(lc('no', 0.1), 0.0035, px(880)); card(lw('no', 'questions', -0.3), 0.0035, px(1480))
chord((Bb2, F3, Bb3, D4), lc('habit', 0.2), 0.45, step=0.16)
tap(lw('others', 'management', -0.2), 0.0035, px(740)); tap(lw('others', 'quality', -0.2), 0.0035, px(1210))

# 6. On Monday: Castle Street comes back, framed on the wall: the long pipe's low E flat, the opening's first sound; their own wards, a
#    step at a time, the opening's pipes ward by ward, rising; Ivy's Monday, from two hours to ten minutes, the stair once more; each
#    piece of advice pinned up; and the close: the mark, short of home, as the voice says change one small thing, then home as it says
#    keep what works, its last note held as E flat major into the end card
LV[0] = 0.9
ew = lambda lid, word, off=0: W('monday', lid, word, off)
ec = lambda lid, off=0: G('monday', lid, off)
low(Eb2, S0('monday') + 0.3, 0.6)
tap(ew('back', 'step', -0.2), 0.0035, px(1050))
for i, m in enumerate((Eb3, G3, Bb3, Eb4, G4, Bb4)):
    pipe(m, ew('back', 'step', 0.0 + 0.4 * i), 0.38, px(700 + 120 * i) * 0.4)
tap(ew('back', 'half', -0.3), 0.0035, px(1050))
card(ec('ivy', -0.1), 0.0035, px(1220))
for i, m in enumerate((Bb3, C4, D4, Eb4, F4, G4, Bb4)):
    pipe(m, ew('ivy', 'ten', -0.2 + 0.28 * i), 0.38, px(1220) * 0.4)
for lid, word, xx in (('one', 'pick', 520), ('two', 'Drop', 1400), ('three', 'Automate', 520), ('four', 'lead', 1400)):
    card(ew(lid, word, -0.1), 0.0035, px(xx))
card(ec('take', 0.1), 0.0035, px(960))
mark(MARK, ew('take', 'Change', 0.0), 0.5, step=0.24, bass=((C3, 0),))
mark(BETTER, ew('take', 'keep', 0.0), 0.5, step=0.24, bass=((Eb2, 0), (Bb2, 3)), until=TOT)
chord((Eb3, G3, Bb3), ew('take', 'keep', 0.24 * 3 + 0.5), 0.45, step=0.2, until=TOT)
chord((Eb2, Bb2, Eb3, G3, Bb3, Eb4), ec('breath', 0.8), 0.5, step=0.24, until=TOT)
