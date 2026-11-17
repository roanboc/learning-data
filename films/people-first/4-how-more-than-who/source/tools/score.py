# How, more than who: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The palette, its own (the module's palettes.md, row 18: reserved by this film's thread on 12 November 2026, before a note was written,
# after every score.py and music.py on main and on the open branches and every palettes.md of the project was searched): a viola and a
# cello, as a pair, a player to each. Both are on the site, never as two alone, and no film of this module plays either.
#  - The cello, from the left, low; the viola, from the right, high. Two players of one family, neither the leader, who make one tune
#    only by taking turns, as the two builders weave from opposite banks to the middle. Each note is one short pull of the bow: the bow
#    takes the string, its weight eases along the stroke, it lifts, and the string rings on for a moment. No vibrato, never plucked.
#  - Never a chord, and nothing held under another note: two notes sound together only at the meeting note, and in the disagreement.
# The mark, the weave: a note each in turn, the cello climbing (D flat 2, A flat 2, D flat 3, F 3, G flat 3), the viola coming down
#    (C 5, A flat 4, F 4, D flat 4, B flat 3), then both on the same A flat 3, in the middle. The scale's fourth and seventh notes
#    (G flat and C) are in it, so it can't read as a five-note tune. It is put together through the opening as the bridge is, heard
#    whole when the builders meet, line by line as the team writes its page, and whole again at the close. In the disagreement both
#    bow at once, a step apart, and neither waits; when each has said what he saw, they take turns again. Where the bridge stops, the
#    cello plays twice without passing the turn, and the two lines draw near and don't meet.
# D flat major, B flat minor for the problem. Every note is tuned pure from D flat (just intonation, see hz()): D flat, G flat and A flat
#    major and B flat minor are pure in this table; E flat sounds only against A flat.
# Nothing Andean: no pipe, flute or breath (panpipes there are often played in pairs that take turns, note by note, so the turns here
#    are on bowed strings), no harp, guitar, small guitar, violin, drum or brass, and no five-note tune. No river, wind or birdsong
#    as music.
# The rules the module keeps (its briefs; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each note one stroke, steady, its partials harmonic. No urgent pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/hm_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.4 kHz; the effects about 12 dB under the music.

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
R1 = np.random.default_rng(1418)  # this film's own randomness: the room, the bow's hair, the paper

# ---- tuning: just intonation from D flat, so two notes that sound together are whole-number ratios of each other and nothing beats
_JI = {0: 1, 2: 9 / 8, 4: 5 / 4, 5: 4 / 3, 7: 3 / 2, 9: 5 / 3, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 37, 12)
    assert pc in _JI, 'note %d is not in D flat major' % m
    return 69.29566 * 2 ** o * _JI[pc]
Db2, Gb2, Ab2, Bb2, C3, Db3, Eb3, F3, Gb3, Ab3, Bb3, C4 = 37, 42, 44, 46, 48, 49, 51, 53, 54, 56, 58, 60
Db4, Eb4, F4, Gb4, Ab4, Bb4, C5, Db5 = 61, 63, 65, 66, 68, 70, 72, 73

# ---- the levels: the two matched by loudness (each stroke set by the level of its body, not its peak), as far under the voice as the
# module's other music; the effects about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level
LC, LA, FX = 0.029, 0.027, 3.5
LV = [1.0]

# a small wooden room round the two players, ringing for under a second. Its level is set by what it rings where the notes are (its
# gain from 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, measured over its body
def _band(ir):
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.85)).astype(np.float32))(np.arange(int(0.85 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.012 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    if not k:
        return sig
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out
def _until(sig, s, until, f=0.2):
    """a sound that must be gone by until (a time in the film): faded out over its last f seconds"""
    if until is None:
        return sig
    n = int((until - s) * SR)
    if n <= 0:
        return sig[:0]
    if n < len(sig):
        sig = sig[:n].copy(); k = min(n, int(f * SR)); sig[n - k:] *= np.linspace(1, 0, k, dtype=np.float32)
    return sig
def _nz(sec):
    return R1.standard_normal(max(1, int(sec * SR))).astype(np.float32)

# ---- a bowed string: every partial there (the bow holds the string and lets it slip once each turn), shaped by the body that carries it
def _body(f, peaks, top):
    v = 0.4 + sum(g * np.exp(-0.5 * (np.log(f / fc) / wd) ** 2) for fc, g, wd in peaks)
    return v * (1.0 if f < top - 500 else np.exp(-(f - (top - 500)) / 330))
_CELLO = ((185, 0.9, 0.36), (520, 0.6, 0.3), (1180, 0.3, 0.25))                     # a large body: its air and wood sound low
_VIOLA = ((285, 0.8, 0.3), (470, 0.45, 0.24), (1040, 0.6, 0.22), (1650, 0.22, 0.2))  # smaller, and a little veiled and nasal
def _stroke(f0, pull, peaks, top, rise, ph, ease):
    """one pull of the bow, pull seconds long: the string speaks over rise seconds, its low partials first; the bow's weight eases along
    the stroke (ease: how much); then the bow lifts and the string and the body ring on for a moment, the high partials gone first"""
    sec = pull + 0.6; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k in range(1, 64):
        f = f0 * k
        if f > top:
            break
        on = np.sin(0.5 * np.pi * np.minimum(1, x / (rise * (1 + 0.07 * (k - 1))))) ** 2
        off = np.where(x < pull, 1.0, np.exp(-np.maximum(0, x - pull) / (0.17 / (1 + 0.22 * (k - 1)))))
        sig += k ** -1.0 * _body(f, peaks, top) * on * off * np.sin(2 * np.pi * f * x + ph * k * k)
    sig *= (1 - ease * np.clip(x / pull, 0, 1)) * np.clip((sec - x) / 0.03, 0, 1)
    i, j = int(min(0.25, 0.5 * pull) * SR), int(pull * SR)
    sig /= max(1e-9, float(np.sqrt((sig[i:j] ** 2).mean())))                      # every stroke as loud as the next, by its body
    hair = filt(_nz(sec)[:n], 'band', (800, 2000))
    sig += 0.02 * hair / max(1e-9, float(np.abs(hair).max())) * np.sin(0.5 * np.pi * np.minimum(1, x / rise)) ** 2 * (x < pull)
    return sig.astype(np.float32)
_END = {'c': -9.0, 'v': -9.0}                       # when each player's last stroke ends: a player bows one note at a time
def _play(who, m, s, pull, g, pan, until, ease, room):
    lo, hi, peaks, top, rise, ph, lv = (Db2, C4, _CELLO, 2300, 0.085, 0.37, LC) if who == 'c' else (Ab3, Db5, _VIOLA, 2400, 0.065, 1.13, LA)
    assert lo <= m <= hi, 'the %s plays %d to %d, not %d' % ('cello' if who == 'c' else 'viola', lo, hi, m)
    if until is not None:
        pull = min(pull, max(0.3, until - s - 0.45))
    assert s >= _END[who] - 0.02, 'the %s bows one note at a time: a stroke at %.2f s starts before the last one ends (%.2f s)' % (who, s, _END[who])
    _END[who] = s + pull
    sig = _stroke(hz(m), pull, peaks, top, rise * (1.25 if m < Db3 else 1.0), ph, ease)
    sig = filt(filt(sig, 'low', top), 'high', 55 if who == 'c' else 150)
    sig = _until(_room(sig, room, min(0.25, 0.5 * pull), pull), s, until)
    put(sig, s, g * LV[0] * lv, pan)
def c(m, s, pull=0.9, g=1.0, until=None, ease=0.22, room=0.2):
    """the cello, from the left: one pull of the bow"""
    _play('c', m, s, pull, g, -0.3, until, ease, room)
def v(m, s, pull=0.9, g=1.0, until=None, ease=0.22, room=0.2):
    """the viola, from the right: one pull of the bow"""
    _play('v', m, s, pull, g, 0.3, until, ease, room)

# ---- what they play
def turns(notes, s, step=0.5, g=1.0, last=None, first='c', until=None):
    """a note each in turn, the cello first unless first is 'v'; each waits for the other to finish"""
    for i, m in enumerate(notes):
        who = c if (i % 2 == 0) == (first == 'c') else v
        who(m, s + step * i, (last if (last and i == len(notes) - 1) else step * 0.86), g, until)
LOW, HIGH, MEET = (Db2, Ab2, Db3, F3, Gb3), (C5, Ab4, F4, Db4, Bb3), Ab3
def weave(s, step=0.5, g=1.0, pairs=5, meet=None, hold=2.4, until=None):
    """the mark: the cello climbing from the left, the viola coming down from the right, a note each in turn; then (meet: when) both
    on the same A flat, in the middle. pairs: how many of its five pairs are played"""
    for i in range(pairs):
        c(LOW[i], s + step * 2 * i, step * 0.86, g, until); v(HIGH[i], s + step * (2 * i + 1), step * 0.86, g, until)
    if meet is not None:
        c(MEET, meet, hold, 0.74 * g, until, ease=0.3); v(MEET, meet, hold, 0.74 * g, until, ease=0.3)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k
def card(s, x=960, g=0.0035):
    """a sheet pinned up: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); t = np.arange(n) / SR
    fl = filt(_nz(0.18)[:n], 'band', (380, 1800)) * _bump(t, 0.07) * (t < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, px(x), 1900)
def tap(s, x=960, g=0.0032):
    """something small set down, a pill or a tag: one soft, short tap"""
    n = int(0.08 * SR); t = np.arange(n) / SR
    _fx(filt(_nz(0.1)[:n], 'band', (250, 1100)) * np.exp(-t / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, px(x), 1600)
def slide(s, sec=0.9, x=960, g=0.0033):
    """a line or a bar drawn out: a dry, even rub that eases off"""
    n = int(sec * SR); t = np.arange(n) / SR; gr = filt(_nz(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(t, sec, 1.4) * gr, s, g, px(x), 1500)
def pen(s, sec=0.7, x=960, g=0.0045, n=3):
    """a pen's soft scratch on paper, a stroke at a time"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t0 = s + sec / n * i; m = int(d * SR); t = np.arange(m) / SR
        gr = np.abs(filt(_nz(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(_nz(d + 0.02)[:m], 'band', (700, 2100)) * _bump(t, d, 0.6) * (0.3 + 0.7 * gr), t0, g, px(x), 2200)
def ticked(s, x=960, g=0.0042):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, x, g, 2)
def haul(s, sec=6.0, x=960, g=0.0034):
    """grass rope under strain as many hands pull a cable across: one low, dry texture that swells in and eases off, never a creak"""
    n = int(sec * SR); t = np.arange(n) / SR; gr = filt(_nz(sec + 0.02)[:n], 'low', 4); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (140, 620)) * _bump(t, sec, 1.2) * gr, s, g, px(x), 800)
def fall(s, x=960, g=0.0045):
    """a bridge of grass dropping into the gorge: its ropes passing through the air, then a soft, dull landing far below, on water"""
    sec = 2.3; n = int(sec * SR); t = np.arange(n) / SR
    air = filt(_nz(sec + 0.02)[:n], 'band', (160, 900)) * _bump(t, 1.2, 1.6) * (t < 1.2)
    land = filt(_nz(sec + 0.02)[:n], 'band', (70, 420)) * np.where(t > 1.15, np.minimum(1, (t - 1.15) / 0.05) * np.exp(-np.maximum(0, t - 1.2) / 0.3), 0)
    _fx(0.7 * air / max(1e-9, float(np.abs(air).max())) + land / max(1e-9, float(np.abs(land).max())), s, g, px(x), 950)
def door(s, x=960, g=0.0042):
    """a door opened: its latch, one dull click, and the door swinging on its hinges, a soft breath of air"""
    sec = 1.3; n = int(sec * SR); t = np.arange(n) / SR
    sw = filt(_nz(sec + 0.02)[:n], 'band', (120, 520)) * _bump(np.maximum(0, t - 0.12), 1.1, 1.5) * (t > 0.12)
    _fx(_knock(n, 240, 0.012) + 0.55 * sw / max(1e-9, float(np.abs(sw).max())), s, g, px(x), 1200)

# =============================================================================================================================
# 1. Three days in June: the opening. The gorge: two notes from far apart, the cello's lowest and the viola's highest of the mark. The
#    next pair as four communities are named, the third at "in three days". B flat minor for the problem: no family could raise it
#    alone, no drawing, no plan, and it has to hold. G flat, then A flat, as everyone knows their part and trusts everyone else's; D flat
#    for the way of working. A note from each bank as each bank's cords are checked in; a note to each community; three notes for three
#    ropes; one man braids until he tires (the cello, its stroke fading) and another takes his place (the viola, on the same note).
#    The cables: the cello's four for the floor, the viola's two for the handrails; last year's bridge, falling. Then the weave, whole:
#    a note each in turn from both banks, and both on one note where the builders meet. D flat, bright, as they celebrate; a note each
#    for promises and parts; and under the title the weave's last pairs, and the meeting note
LV[0] = 0.95
dw = lambda lid, word, off=0: W('days', lid, word, off)
dc = lambda lid, off=0: G('days', lid, off)
END = E('days')
c(Db2, 0.4, 1.3); v(C5, 1.78, 1.0)
card(dc('where', -0.2), 440)
c(Ab2, dw('june', 'four', 0.0), 1.1); v(Ab4, dw('june', 'bridge', -0.1), 1.1)
tap(dw('june', 'Apurímac', -0.3), 960)
slide(dw('size', 'twenty', -0.2), 1.1, 960)
card(dw('size', 'About', -0.2), 1490)
c(Db3, dw('size', 'About', 0.4), 1.0); v(F4, dw('size', 'three', 0.0), 1.0)
# no family alone, no drawing, no written plan: B flat minor
c(Bb2, dw('alone', 'alone', -0.6), 1.5)
tap(dw('alone', 'alone', -0.9), 640)
v(Db4, dw('alone', 'drawing', -0.2), 0.9); v(Bb3, dw('alone', 'written', -0.2), 1.2)
tap(dw('alone', 'drawing', -0.2), 1470); tap(dw('alone', 'written', -0.2), 1470)
# it has to hold, fifteen metres above the river
c(Bb2, dw('hold', 'hold', -0.3), 1.6); v(F4, dw('hold', 'year', 0.1), 1.2)
tap(dw('hold', 'hold', -0.5), 960)
slide(dw('hold', 'fifteen', -0.6), 1.0, 1012)
c(Db3, dw('hold', 'fifteen', 0.5), 1.4)
# every cord in it; your own part, and trust in everyone else's: G flat, then A flat
c(Gb2, dw('need', 'strength', -0.1), 1.3); v(Bb3, dw('need', 'cord', -0.2), 1.2)
tap(dw('need', 'cord', -1.0), 960)
v(Db4, dw('need', 'own', -0.4), 1.0); c(Ab2, dw('need', 'trust', -0.2), 1.4)
tap(dw('need', 'own', -0.5), 700); tap(dw('need', 'trust', -0.3), 1220)
# a way of working that everyone knows: D flat, a note each in turn
tap(dw('way', 'way', -0.4), 960)
turns((Db3, Ab4, F3, F4), dw('way', 'way', -0.1), 0.52, last=1.2)
# a cord from each family; checked in on both banks: a note from each bank
card(dw('cord', 'promised', -0.3), 960)
v(Ab4, dw('cord', 'promised', 0.1), 1.0); c(Db3, dw('cord', 'forty', 0.0), 1.0)
ck = dw('cord', 'checked', -0.2)
ticked(ck, 470); ticked(ck + 0.5, 1450)
c(F3, ck + 0.05, 0.42); v(Ab3, ck + 0.55, 0.9)
# each community knows its part: a note to each
tap(dc('part', 0.1), 960)
turns((Db3, Ab3, F3, Db4), dc('part', 0.5), 0.45, last=0.9)
tap(dw('part', 'six', -0.3), 735); tap(dw('part', 'mat', -0.3), 1660)
# cords into ropes, three ropes into a cable: three notes, G flat
tap(dw('braid', 'twist', -0.2), 300)
turns((Bb3, Gb3, Db4), dw('braid', 'braid', 0.2), 0.44, last=1.0, first='v')
tap(dw('braid', 'braid', 0.2), 800)
# one man braids until he tires; then another takes his place, on the same note
letgo, b_in = dw('tire', 'tires', -0.1), dw('tire', 'another', 0.5)
c(Ab3, dw('tire', 'braids', -0.2), letgo + 0.3 - dw('tire', 'braids', -0.2), 1.0, ease=0.62)
v(Ab3, b_in, 1.3)
tap(b_in + 0.2, 1300)
# many hands pull the six cables across: the cello's four for the floor, the viola's two for the handrails
T = dc('tie'); cut, meet, home = T + 7.9, dc('weave', 7.2), dc('done', -0.6)
haul(T - 0.6, 6.6, 960)
for m, t0 in ((Db2, T - 0.5), (Ab2, T + 1.1), (Db3, T + 2.3), (F3, T + 3.4)):
    c(m, t0, 0.95)
v(Ab4, T + 4.4, 0.7); v(C5, T + 5.2, 1.0)
tap(dw('tie', 'pull', -0.5), 960); tap(dw('tie', 'tie', -0.3), 1300); tap(dw('tie', 'older', -0.3), 960)
# last year's bridge, cut loose
fall(cut, 960)
tap(cut + 0.2, 960)
# the weave: a note each in turn, from both banks, until they meet in the middle
tap(dw('weave', 'builders', -0.3), 960)
weave(dc('weave', 0.0), 0.36 * 2, 1.0, 5, None)
c(MEET, meet, 2.3, 0.74, ease=0.3); v(MEET, meet, 2.3, 0.74, ease=0.3)
tap(meet - 0.2, 960)
# a bridge for another year; the next day, they celebrate: D flat, bright
tap(dw('done', 'bridge', -0.3), 960)
turns((Db3, F4, Ab3, Db5), dw('done', 'celebrate', -0.1), 0.42, last=1.3)
tap(dw('done', 'next', -0.2), 960)
# promises kept, and parts that everyone knows
card(dw('how', 'promises', -0.3), 490); card(dw('how', 'parts', -0.3), 1430)
c(F3, dw('how', 'promises', 0.0), 1.0); v(Ab4, dw('how', 'parts', 0.0), 1.1)
# a data team's work: four parts, each leaning on the one before
for i in range(4):
    tap(dc('data', 0.2 + 0.7 * i), 420 + 360 * i)
c(Ab2, dw('data', 'leans', -0.1), 1.4)
tap(dw('more', 'how', -0.2), 960); tap(dw('more', 'who', -0.2), 960)
v(Db4, dw('more', 'how', 0.0), 1.2)
# the title: the weave's last two pairs, and the meeting note, gone before the next chapter
t0 = dc('breath', 0.2)
c(F3, t0, 0.5); v(Db4, t0 + 0.58, 0.5); c(Gb3, t0 + 1.16, 0.5); v(Bb3, t0 + 1.74, 0.5)
c(MEET, t0 + 2.4, 2.4, 0.74, END, ease=0.3); v(MEET, t0 + 2.4, 2.4, 0.74, END, ease=0.3)

# 2. Less about who: a study of 180 teams. Its sheets; a note each in turn at "how the team worked together"; a tap as each of the
#    five comes in; a note for keeping your word and one for being clear; and the gorge's two notes as its picture goes up
LV[0] = 0.9
ww = lambda lid, word, off=0: W('who', lid, word, off)
wc = lambda lid, off=0: G('who', lid, off)
card(ww('google', '180', -0.4), 470)
card(wc('quote', -0.2), 1320)
c(Db3, ww('quote', 'more', 0.0), 1.0); v(F4, ww('quote', 'how', 0.2), 1.1)
card(wc('safe', 0.0), 570)
for t0 in (wc('safe', 0.2), ww('word', 'keeping', -0.3), ww('word', 'clear', -0.3), ww('word', 'clear', 1.0), ww('word', 'clear', 1.3)):
    tap(t0, 570)
card(ww('safe', 'later', -0.3), 1435)
c(F3, ww('word', 'keeping', 0.3), 0.9); v(Ab4, ww('word', 'clear', 0.3), 1.0)
p0 = wc('gorge', -0.3)
tap(p0, 1435)
c(Db2, p0 + 0.1, 1.2); v(C5, p0 + 1.45, 1.0)
tap(ww('gorge', 'custom', -0.6), 1435); tap(ww('gorge', 'say', -0.3), 1435)

# 3. Two numbers: the university. A note each for Helena's Wednesday; the check's cards; the two numbers, a step apart, each said in
#    its turn (the cello's B flat for the old report, the viola's C for the new model). Then it turns to the person: both bow at once,
#    a step apart, and neither waits; closer still while two people do all the talking. The studies' two cards, without music. Helena
#    stops it: nothing; and the two numbers again, each in its turn
LV[0] = 0.9
nw = lambda lid, word, off=0: W('number', lid, word, off)
nc = lambda lid, off=0: G('number', lid, off)
c(Ab2, S0('number') + 0.3, 1.1); v(Eb4, S0('number') + 1.5, 1.0)
tap(nw('wed', 'Wednesday', -0.3), 1180)
card(nw('wed', 'Helena', -0.2), 1300)
card(nc('model', -0.1), 560)
card(nc('check', -0.2), 610)
b0 = nw('check', 'both', -0.3)
card(b0, 400); card(b0 + 0.4, 820)
c(Bb2, nw('differ', '18,412', 0.0), 1.3); v(C4, nw('differ', '19,549', 0.0), 1.3)
tap(nw('differ', '19,549', 1.4), 610)
card(nc('tomas', -0.1), 1330)
j0, o0 = nw('wrong', 'your', -0.3), nw('wrong', 'model', -0.5)
card(j0, 1750); card(o0, 170)
v(C4, j0 + 0.1, o0 - j0 + 1.3, 1.0, ease=0.1); c(Bb3, o0 + 0.1, 2.0, 1.0, ease=0.1)
q0 = nw('quiet', 'Two', -0.2)
tap(q0, 960)
c(C4, q0 + 0.3, 1.7, 1.0, ease=0.1); v(Db4, q0 + 0.75, 1.7, 1.0, ease=0.1)
tap(nw('quiet', 'Erin', -0.2), 1298); tap(nw('quiet', 'Marta', -0.2), 396)
card(nw('study', 'conflict', -0.3), 670); card(nw('study', 'Disagreement', -0.3), 1250)
card(nw('stop', "we've", -0.3), 847)
back = nw('stop', 'number', -0.2)
c(Bb2, back + 0.2, 1.2); v(C4, back + 1.6, 1.3, until=E('number'))

# 4. Three things: the table on the wall, a tap for each heading; a pen as each of the six cells is said. Jun's two notes (the viola:
#    what he saw, on the note he held in the disagreement, and what he asks, on the meeting note); then Tomás's two (the cello, the
#    same way): each reaches the middle in his own turn. Where the three things come from: two cards. And Jun's question, rising
LV[0] = 0.9
tw = lambda lid, word, off=0: W('three', lid, word, off)
tc = lambda lid, off=0: G('three', lid, off)
card(tc('ask', 0.2), 960)
tap(tw('ask', 'what you saw', -0.2), 420); tap(tw('ask', 'what you feel', -0.2), 960); tap(tw('ask', 'and what you ask', 0.1), 1380)
pen(tw('jun1', 'I saw', -0.1), 0.7, 520); pen(tc('jun2'), 0.7, 1010); pen(tc('jun3'), 0.7, 1500)
v(C4, tw('jun1', 'I saw', 0.2), 1.2); v(Ab3, tc('jun3', 0.5), 1.4)
pen(tw('tom1', 'I heard', -0.1), 0.7, 520); pen(tc('tom2'), 0.7, 1010); pen(tc('tom3'), 0.5, 1400)
c(Bb3, tw('tom1', 'I heard', 0.2), 1.2); c(Ab3, tc('tom3', 0.3), 1.5)
card(tc('named', 0.1), 580); card(tc('practice', 0.1), 1330)
tap(tw('practice', 'feelings', -0.3), 960)
tap(tw('answer', 'answered', -0.5), 960)
card(tc('answer', -0.1), 190)
qq = tw('answer', 'what does', -0.3)
card(qq, 1690)
v(Ab3, qq + 0.2, 0.42); v(Db4, qq + 0.68, 0.42); v(F4, qq + 1.16, 1.3, until=E('three'))

# 5. A turn each: four notes, a note each in turn, as the rings come in over the eight. Erin's ring, and what she says; Marta's sheets
#    and the bar that grows by 1,137. Both numbers are right: the two notes that clashed, now in turn, and each moving a step outward
#    to a pure fourth. Equal turns: four even notes. The owner's sheet, the ticket, and the glossary written; a note each to end
LV[0] = 0.9
uw = lambda lid, word, off=0: W('turn', lid, word, off)
uc = lambda lid, off=0: G('turn', lid, off)
r0 = uw('round', 'everyone', -0.3)
tap(uw('round', 'turn', -0.4), 960)
turns((Db3, F4, Ab3, Ab4), r0 + 0.3, 0.46, last=1.1)
tap(uc('erin', 0.1), 1298)
card(uw('erin', 'reads', -0.6), 1298)
card(uc('marta', -0.1), 870)
s0, l0 = uc('students', -0.1), uc('learners', -0.1)
card(s0, 860); slide(s0 + 0.8, 1.4, 1190)
card(l0, 1520); slide(uw('learners', '1,137', -0.2), 0.9, 1800)
tap(uw('both', 'right', -0.6), 1190)
turns((Bb3, C4, Ab3, Db4), uw('both', 'Both', 0.2), 0.6, last=1.4)
tap(uw('both', 'never', -0.3), 1190)
card(uc('groups', -0.1), 520)
tap(uw('groups', 'collective', -0.4), 520)
b0 = uw('turns', 'taking', -0.6)
slide(b0, 1.3, 1175); slide(b0 + 0.5, 1.3, 1615)
turns((F4, F3, Ab4, Ab3), uw('turns', 'equally', -0.2), 0.5, last=1.2, first='v')
for wd, x in (("Jun's", 230), ("Tomás's", 500), ("Helena's", 770)):
    tap(uw('owner', wd, -0.2), x)
card(uw('ticket', "registrar's", -0.4), 1420)
card(uw('ticket', 'So Jun', -0.3), 1420)
g0 = uc('glossary', -0.1)
card(g0, 1420); pen(g0 + 0.3, 0.5, 1300, n=2); pen(g0 + 0.9, 0.5, 1300, n=2)
tap(uw('glossary', 'before', -0.3), 1420)
c(Db3, uw('glossary', 'before', 0.2), 1.3); v(F4, uw('glossary', 'model', 0.3), 1.3, until=E('turn'))

# 6. One page: the team's page, written line by line: a pen for each line, and with each a pair of the weave, the cello's note and
#    then the viola's, so the five lines are the weave's five pairs. The studies' cards, without music. At the gorge, the way passed
#    on by doing: the cello's note, then the viola's an octave above, as a child beside a parent. And on Friday, with the page on the
#    wall, both on the meeting note
LV[0] = 0.9
gw = lambda lid, word, off=0: W('page', lid, word, off)
gc = lambda lid, off=0: G('page', lid, off)
tap(gc('thu', -0.2), 960)
card(gw('thu', 'page', -0.5), 960)
card(gc('meet', -0.2), 960)
for i, lid in enumerate(('meet', 'help', 'disagree', 'decide', 'date')):
    pen(gc(lid, -0.1), 0.6, 760)
    c(LOW[i], gc(lid, 0.15), 0.52); v(HIGH[i], gc(lid, 0.77), 0.8)
card(gw('trust', '112', -0.4), 1280)
card(gw('charter', 'charter', -0.6), 1005); card(gw('charter', '32', -0.4), 1520)
tap(gw('small', 'one', -0.3), 1520); tap(gw('small', 'practice', -0.7), 1280)
tap(gw('gorge', 'passed', -0.4), 960)
c(Db3, gw('gorge', 'parents', -0.2), 1.1); v(Db4, gw('gorge', 'children', -0.1), 1.2)
tap(gw('gorge', 'team', -0.3), 960)
tap(gw('wall', 'Friday', -0.2), 1680)
c(MEET, gw('wall', 'wall', -0.3), 2.4, 0.74, E('page'), ease=0.3); v(MEET, gw('wall', 'wall', -0.3), 2.4, 0.74, E('page'), ease=0.3)
tap(gw('wall', 'wall', -0.4), 1680)

# 7. Where the bridge stops: let go around 1970: the cello's low B flat, alone. The bridge falling in March 2021, and cut down in May
#    2025: its fall, twice, and no music. Woven again: the weave's first three pairs, quick, as the sides close from both banks. The
#    weaving kept inside a builder's own family: the cello plays twice and doesn't pass the turn. Fewer of the young speak the work's
#    language: the viola, alone, fading. Custom's three tags. Not a model for a data team: the two lines draw near, a third apart, and
#    don't meet. Then the team's table: a tap for each of the eight, four notes in turn; and a note each for Tomás and the glossary
LV[0] = 0.9
lw = lambda lid, word, off=0: W('limits', lid, word, off)
lc = lambda lid, off=0: G('limits', lid, off)
tap(lc('kept', 0.3), 960); tap(lw('kept', 'always', -0.4), 960)
tap(lw('lapse', 'steel', 0.1), 946)
tap(lw('lapse', 'let', -0.5), 320)
c(Bb2, lw('lapse', 'let', -0.2), 1.9, ease=0.5)
tap(lw('fell', 'pandemic', -0.4), 360); tap(lw('fell', 'March', -0.2), 310)
fall(lw('fell', 'fell', -0.5), 960)
tap(lw('cut', 'May', -0.2), 340)
fall(lw('cut', 'cut', -0.2), 960, 0.004)
a1 = lc('again', -0.4)
weave(a1 + 0.5, 0.2 * 2, 0.95, 3, None)
tap(lw('again', 'wove', -0.4), 1420)
tap(lw('line', 'taught', -0.4), 785)
c(Ab2, lw('line', 'taught', -0.1), 1.1); c(Ab3, lw('line', 'family', -0.2), 1.3)
tap(lw('line', 'tradition', -0.6), 785)
tap(lc('quechua'), 1530)
v(Bb3, lc('quechua', 0.3), 1.7, ease=0.55)
tap(lw('quechua', 'language', -0.4), 1530)
tap(lw('steel', 'most', -0.3), 946); tap(lw('steel', 'visitors', -0.3), 960)
tap(lc('custom', 0.1), 960)
for wd, off in (('makes', -0.6), ('braids', -0.6), ('learn', -0.8)):
    tap(lw('custom', wd, off), 960)
tap(lw('judge', 'own', -0.5), 960); tap(lw('judge', 'model', -0.6), 960)
c(Gb3, lw('judge', 'model', -0.2), 1.1); v(Bb3, lw('judge', 'team', 0.3), 1.5)
a0 = lw('each', 'ask', -0.3)
tap(a0, 960)
for i in range(8):
    tap(a0 + 0.2 + 0.3 * i, (170, 396, 621, 847, 1073, 1298, 1524, 1750)[i], 0.0026)
turns((Db4, Ab3, F4, Db3), lw('each', 'leave', -0.1), 0.52, last=1.2, first='v')
card(lc('tomas', -0.1), 190)
c(Db3, lw('tomas', 'asked', 0.1), 1.3)
card(lw('tomas', 'glossary', -0.7), 1020)
tap(lw('tomas', 'anyone', -0.3), 1672)
v(F4, lw('tomas', 'anyone', 0.0), 1.4, until=E('limits'))

# 8. On Monday: a card for each of the four things; the gorge's two notes as its picture goes up. The door: its latch, and the door
#    swinging; one note as Ivy comes in. And the weave, whole, a last time: a note each in turn, and both on the meeting note as the
#    end card comes, held into the end
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
card(mc('write', -0.1), 540); card(mc('open', -0.1), 540); card(mc('keep', -0.1), 540)
p0 = mw('read', 'bridge', -0.4)
tap(p0, 1425)
c(Db2, p0 + 0.2, 1.1); v(C5, p0 + 1.5, 1.0)
tap(mw('read', 'June', -0.5), 1425)
card(mw('read', 'read', -0.4), 1425)
door(mw('ivy', 'Ivy', -0.7), 1290)
tap(mw('ivy', 'Monday', -0.3), 1626)
v(F4, mw('ivy', 'opens', -0.2), 1.3)
tap(mw('ivy', 'opens', 0.0), 1626)
tap(mc('next', -0.1), 1626)
tap(mc('take', -0.1), 870); tap(mw('take', 'keep', -0.3), 870)
e0 = mc('breath', 0.6)
step = (e0 - mc('take', 0.2)) / 10
weave(mc("take", 0.2), step, 1.0, 5, None, until=TOT)
c(MEET, e0, 3.6, 0.74, TOT - 0.2, ease=0.35); v(MEET, e0, 3.6, 0.74, TOT - 0.2, ease=0.35)
