# The question behind the request: the music and sounds, played by tools/audio.py with From words to data's helpers
# (shared/tools/music.py). The module's palette for this film (palettes.md, 5 November 2026: a lead the setup thread reserved, which no
# score on main or on any branch has): an alto trombone, made here, as music.py has none.
#  - The alto trombone, played plain and soft: the slide finds the exact note, then holds it. Brass, like the site's sackbut and brass
#    choirs and series 3's bass trumpet, so it keeps its own ways: soft and dark, each note tongued gently ("doo") and held level, no
#    vibrato, no glissando but the mark's one short approach, nothing above about 2.3 kHz.
#  - Its partner, the thread's choice: a second alto trombone in a cup mute, softer and hollow, a step behind. The film is about asking
#    and listening: the open trombone asks, the muted one answers and says back. Every other colour the site lacks either belongs to
#    another culture or sounds like one it has (the long list in the module's palettes.md), as the module's other threads found; two
#    players of one instrument, one muted, carry the film's idea (one asks, one listens and says it back).
# The mark: a note approached from a little away, settling on its pitch once (the slide finds it, and holds it): the question found.
# It comes when the committee agrees what saving the tower would mean, when one page turns Graham's request into a question, when the
# question is written down with him, when it's answered, back in Pisa at the end, and at the close; each time on its own notes.
# F major, D minor for the problem (the soft ground, the lean, Pavia, the danger, the decision the request hid, the wait). Every two notes
# that sound together are tuned pure from F (just intonation, see hz()): F, B flat and C major, and D and A minor, are pure in this
# table; G with D, or G with B flat, are not, and never sound together. Two players, so never more than two notes at once: each chord is
# a pair, the rest of it left to the ear. Nothing Italian for Pisa: no tune or instrument of the place (the module's palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses: each note steady, with no vibrato, its partials harmonic; each stopped before it would ring into the
#    next chapter. No urgent pulse: nothing in the film is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/qb_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
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
R1 = np.random.default_rng(1173)  # this film's own randomness: the room, the paper, the clay

# ---- tuning: just intonation from F, so two notes sounding together are whole-number ratios of each other and nothing beats. F, B flat
# and C major, and D and A minor, are pure in this table; G held with D or with B flat is not, and never sounds
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 41, 12)
    return 87.30706 * 2 ** o * _JI[pc]
A2, Bb2, C3, D3, E3, F3, G3, A3, Bb3 = 45, 46, 48, 50, 52, 53, 55, 57, 58
C4, D4, E4, F4, G4, A4, Bb4, C5 = 60, 62, 64, 65, 67, 69, 70, 72

# ---- the levels: the open trombone and the muted one matched by loudness, as far under the voice as the module's other music; the
# effects about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LT, LC, FX = 0.060, 0.068, 3.2
LV = [1.0]

# a small hall round the two players, ringing on for about a second and a half. Its level is set by what it rings where the notes are
# (its gain from 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.4)).astype(np.float32))(np.arange(int(1.4 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.018 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the hall round a note; it keeps the note as loud as it was dry (its rms from a to b seconds), as a room lifts some pitches and
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

# ---- the trombone's sound: harmonic partials, as a brass instrument's are, each as strong as the bell lets it out (the lowest a little
# held back) and as playing soft allows (the upper partials fall away fast above about soft Hz; played louder, a brass note brightens,
# and these never are). The lips' buzz builds over the first few hundredths of a second, the upper partials a little after the low ones,
# with a breath of air at the start; then the note holds level until the player stops the air, the upper partials going first. A cup
# mute thins the low end, rings hollow near 1 kHz and takes the top away
def _spec(fk, soft, mute):
    a = fk / (fk + 160.0) / (1.0 + (fk / soft) ** 3)
    if mute:
        a *= (fk / (fk + 320.0)) ** 1.4 * (1 + 0.9 * np.exp(-((fk - 950.0) / 260.0) ** 2)) / (1 + (fk / 1500.0) ** 4)
    return a
def _brass(f0, d, soft, mute=False, approach=0.0, settle=0.22, top=2300):
    """one note: f0 Hz, held d seconds, then stopped; approach cents below the note, settling on it once over settle seconds"""
    sec = d + 0.45; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    if approach:
        u = np.clip(x / settle, 0, 1); f = f0 * 2 ** (-approach * (0.5 + 0.5 * np.cos(np.pi * u)) / 1200)
        ph = 2 * np.pi * np.cumsum(f) / SR
    else:
        ph = 2 * np.pi * f0 * x
    sig = np.zeros(n)
    for k in range(1, 40):
        fk = f0 * k
        if fk > top:
            break
        on = 1 - np.exp(-x / (0.024 + 0.009 * (k - 1)))
        off = np.where(x < d, 1.0, np.exp(-(x - d) / (0.1 / (1 + 0.18 * (k - 1)))))
        sig += _spec(fk, soft, mute) * on * off * np.sin(k * ph + 0.5 * k)
    sig = sig / max(1e-9, float(np.abs(sig).max()))
    br = filt(noise(sec + 0.02)[:n], 'band', (500, 1700)) * np.exp(-x / 0.035); br = br / max(1e-9, float(np.abs(br).max()))
    return (sig + 0.025 * br).astype(np.float32)

def tb(m, s, d=1.2, g=1.0, pan=None, approach=0.0, room=0.24, until=None):
    """the open alto trombone: one note at s, tongued softly and held d seconds; with approach, the mark's short slide onto it"""
    if until is not None:
        d = min(d, max(0.15, until - s - 0.3))
    sig = _brass(hz(m), d, 620.0, False, approach)
    sig = _until(_room(norm(filt(filt(sig, 'low', 2300), 'high', 80)), room, 0.05, min(1.2, d)), s, until)
    put(sig, s, g * LV[0] * LT, max(-0.3, min(0.3, (m - 62) * 0.02 + 0.08)) if pan is None else pan)

def cup(m, s, d=1.2, g=1.0, pan=None, room=0.28, until=None):
    """the second alto trombone, in a cup mute: softer and hollow, a step behind the first"""
    if until is not None:
        d = min(d, max(0.15, until - s - 0.3))
    sig = _brass(hz(m), d, 560.0, True)
    sig = _until(_room(norm(filt(filt(sig, 'low', 1900), 'high', 110)), room, 0.05, min(1.2, d)), s, until)
    put(sig, s, g * LV[0] * LC, -0.18 if pan is None else pan)

# ---- what they play
def pair(lo, hi, s, d=2.0, g=1.0, until=None):
    """two notes together, the muted one below, the open one above (always a pure interval)"""
    cup(lo, s, d, g, until=until); tb(hi, s + 0.04, d - 0.04, g, until=until)
def figure(notes, s, g=1.0, step=0.3, ring=0.32, last=1.4, who=None, until=None):
    """a short figure, a note at a time, each stopped before the next begins"""
    k = len(notes)
    for i, m in enumerate(notes):
        (who or tb)(m, s + step * i, last if i == k - 1 else min(ring, step - 0.04), g, until=until)
def mark(first, to, s, g=1.0, held=2.4, under=None, until=None):
    """the mark: one short note, then the next approached from a little away (70 cents below), settling on its pitch once, and held;
    the muted trombone comes in under it once it has settled, so nothing is ever a little out of tune with anything"""
    tb(first, s, 0.28, g, until=until)
    tb(to, s + 0.32, held, g, approach=70.0, until=until)
    if under is not None:
        cup(under, s + 0.32 + 0.24, held - 0.24, 0.9 * g, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def card(s, g=0.0045, pan=0.0):
    """a sheet pinned up: a soft flap of paper, and the faint press of its pin"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 160, 0.016, 0.06) / 1.35, s, g, pan, 1900)
def tap(s, g=0.004, pan=0.0):
    """something small set down, or a screen woken: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.004, pan=0.0):
    """a marker drawn along, or a screen filling: a dry, even rub that eases off"""
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
def rope(s, g=0.005, pan=0.0):
    """a cord drawn taut between its posts: a short, soft rub of rope, and the posts' dull knock"""
    n = int(0.6 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.62)[:n], 'band', (200, 900)) * _bump(x, 0.4, 1.2) * (x < 0.4) + 0.5 * _knock(n, 115, 0.03, 0.38), s, g, pan, 1200)
def drill(s, sec=2.4, g=0.004, pan=0.0):
    """the augers turning into the clay, far under: one low, soft grind that swells in and eases off, never a run of knocks"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 3); gr = 0.75 + 0.25 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (60, 380)) * _bump(x, sec, 1.2) * gr, s, g, pan, 600)
def soil(s, sec=1.2, g=0.004, pan=0.0):
    """soil drawn up and out: a soft, low slither that pours and stops"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(noise(sec + 0.02)[:n], 'band', (110, 650)) * _bump(x, sec, 0.9), s, g, pan, 900)
def ingot(s, g=0.005, pan=0.0):
    """a lead ingot set on the stack: a dead, low knock, with no ring (lead doesn't ring)"""
    n = int(0.22 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 140, 0.022) + 0.25 * filt(noise(0.24)[:n], 'band', (120, 600)) * np.exp(-x / 0.012), s, g, pan, 1000)
def block(s, g=0.005, pan=0.0):
    """the test footing in place: a heavy, soft thud"""
    n = int(0.4 * SR); x = np.arange(n) / SR
    _fx(_knock(n, 72, 0.06) + 0.2 * filt(noise(0.42)[:n], 'band', (90, 500)) * np.exp(-x / 0.03), s, g, pan, 800)

# =============================================================================================================================
# 1. Saving a leaning tower: the opening, the module's story from outside data. Pisa: the muted trombone's low F, alone, then the open one
#    above it as the tower's card comes in, a step down, as it leans. The soft ground, the lean, Pavia: D minor, low. The cord across
#    the stone ring as the tower closes. The danger in its stone and in the ground: D and A, then D and F, gone before "Something had to
#    change", which has nothing under it. The committee: F major, its sheet and the tower's picture pinned up. What saving it would mean:
#    the mark, C settling onto F, as the blue line half a degree back is drawn. The augers turning in the clay; the test footing and the
#    lead set down; the soil drawn out; as it begins to lean back, B flat and D, warm. The engineer's note pinned up, and signed. The
#    45 cm: A, C and F rising; reopened, F and C; the request that hid a decision, the muted D, low; the page agreed in writing: the
#    mark again, F settling onto A; and F major, held, under the title card
LV[0] = 0.85
ow = lambda lid, word, off=0: W('tower', lid, word, off)
oc = lambda lid, off=0: G('tower', lid, off)
END = E('tower')
cup(F3, 0.6, 3.0, 0.8)
card(ow('when', 'Pisa', -0.1), 0.0035, px(400))
tb(C4, ow('when', 'Pisa', 0.3), 1.4, 0.75); tb(A3, ow('when', 'Pisa', 1.9), 1.9, 0.7)
cup(D3, ow('when', 'soft', -0.3), 2.2, 0.7)
pair(D3, F3, ow('lean', 'further', -0.2), 2.0, 0.65)
card(oc('pavia', 0.3), 0.0035, px(1530))
cup(D3, ow('pavia', 'killing', -0.2), 2.4, 0.7)
rope(ow('closed', 'closed', -0.1), 0.005, px(960))
card(max(oc('closed', 1.7), ow('closed', 'closed', -0.1)), 0.003, px(960))
pair(D3, A3, oc('harm', 0.3), 2.4, 0.6)
pair(D3, F3, ow('risk', 'down', -0.2), 1.6, 0.55, until=oc('change', -0.3))
# the committee, that spring: F major; its sheet, and the tower's picture, pinned up
pair(F3, A3, oc('committee', 0.4), 2.2, 0.6)
card(oc('committee', 0.2), 0.004, px(400)); card(oc('committee', 0.6), 0.0035, px(1510))
tb(C4, ow('committee', 'engineers', 0.0), 1.5, 0.55)
# what saving it would mean: its sheet; the mark, as the blue line half a degree back is drawn; the steadier ground
card(ow('meant', 'saving', -0.2), 0.004, px(1490))
mark(C4, F4, ow('meant', 'half', 0.3), 0.7, 2.6, under=A3)
cup(F3, ow('enough', 'steady', -0.1), 2.0, 0.6)
# the method: the augers turning in under the north side; the test footing set, and the lead stacked on the north side, ingot by ingot
drill(ow('method', 'draw', -0.1), 2.4, 0.004, px(760))
soil(ow('method', 'soil', 0.0), 1.2, 0.0035, px(820))
block(ow('trial', 'test', -0.1), 0.0045, px(610))
for i in range(3):
    ingot(ow('trial', 'lead', -0.1 + 0.45 * i), 0.004, px(860))
# under the tower itself, from February 1999: the soil drawn out again, and as it begins to lean back, B flat and D
soil(ow('soil', 'tower', 0.0), 1.4, 0.0035, px(800))
pair(Bb3, D4, ow('soil', 'lean', -0.2), 2.6, 0.6)
# the engineer's note, pinned up once the camera has come back, and signed
card(oc('note', 1.0), 0.004, px(1540))
pen(ow('note', 'signed', 0.1), 0.9, 0.0045, px(1400), 3)
# 45 cm back at the top: A, C and F rising over the muted F; reopened, F and C; the visitors
card(ow('less', 'forty', -0.3), 0.004, px(400))
cup(F3, ow('less', 'centimetres', -0.3), 2.4, 0.6); figure((A3, C4, F4), ow('less', 'centimetres', -0.3), 0.6, 0.3, 0.26, 1.8)
card(ow('reopen', 'reopened', -0.1), 0.0035, px(1440))
pair(F3, C4, ow('reopen', 'reopened', 0.1), 2.2, 0.55)
# the university: the request, and the decision it hid, the muted D, low
card(ow('data', 'request', -0.2), 0.0035, px(1470)); card(ow('data', 'decision', -0.2), 0.0035, px(1470))
cup(D3, ow('data', 'decision', -0.2), 1.8, 0.65)
# half an hour of listening found it, and one page agreed in writing: the mark, F settling onto A, as "Agreed in writing" comes
mark(F4, A4, ow('found', 'writing', -0.45), 0.6, 2.4, under=F3)
# F major, held under the title card, stopped before the next chapter
pair(F3, C4, oc('breath', 0.5), 4.4, 0.6, until=END)

# 2. A dashboard by Easter: the chapter turns on F and A, as the three films' sheets are pinned up. Graham's email wakes his screen; his
#    request, the open trombone's C falling to A; the dashboard greyed, "no help to anyone", the muted D; Helena's sheet
LV[0] = 0.9
kw = lambda lid, word, off=0: W('ask', lid, word, off)
kc = lambda lid, off=0: G('ask', lid, off)
pair(F3, A3, S0('ask') + 0.4, 2.0, 0.55)
for i, x in enumerate((420, 960, 1500)):
    card(S0('ask') + 0.8 + 0.4 * i, 0.0035, px(x))
tap(kc('email', 0.6), 0.0035, px(1310))
figure((C4, A3), kc('asks', 0.4), 0.55, 0.3, 0.26, 1.2)
cup(D3, kw('nobody', 'nobody', -0.2), 1.6, 0.6)
card(kw('helena', 'asks', -0.1), 0.0035, px(650))

# 3. Half an hour, mostly listening: the chapter turns on C and E, an open question. Each question's sheet pinned up as it's asked; the
#    decision found, F and D; humble inquiry, the muted F alone; active listening: the open trombone's C and E, and the muted one says
#    them back, an octave lower; why, five times, five small tags; and the kinder question, one F
LV[0] = 0.9
lw = lambda lid, word, off=0: W('listen', lid, word, off)
lc = lambda lid, off=0: G('listen', lid, off)
pair(C4, E4, S0('listen') + 0.3, 2.0, 0.5)
card(S0('listen') + 0.9, 0.0035, px(870))
for lid in ('decide', 'when', 'who', 'trust', 'mind'):
    card(lc(lid, -0.05), 0.0035, px(870))
pair(F3, D4, lw('decide', 'hundred', -0.2), 1.6, 0.55)
card(lw('schein', 'Schein', -0.3), 0.0035, px(870))
cup(F3, lw('schein', 'interest', -0.2), 1.8, 0.6)
card(lw('rogers', 'Rogers', -0.3), 0.0035, px(870))
figure((C4, E4), lw('rogers', 'saying', -0.2), 0.5, 0.3, 0.26, 0.7)
figure((C3, E3), lw('rogers', 'saying', 0.9), 0.55, 0.3, 0.26, 0.9, who=cup)
for i in range(5):
    tap(lw('whys', 'five', -0.4 + 0.32 * i), 0.0025, px(540 + 210 * i))
tb(F4, lw('whys', 'what', 0.0), 1.6, 0.45)

# 4. Say it back, write it down: what Helena heard, pinned up, and the muted trombone says back Graham's request, his C and A; Graham
#    stops her at one word, and the open trombone's F; the two kinds of data; back to Pisa, two sheets; Noor writes the question down: the mark, C settling onto F,
#    as it appears; each line under it written; his words picked out; and his reply, F and A, then C
LV[0] = 0.9
aw = lambda lid, word, off=0: W('agree', lid, word, off)
ac = lambda lid, off=0: G('agree', lid, off)
card(ac('back', 0.4), 0.0035, px(780))
figure((C4, A3), aw('back', 'heard', 0.1), 0.6, 0.3, 0.26, 1.2, who=cup)
card(aw('used', 'means', -0.3), 0.0035, px(1460))
tb(F4, aw('used', 'means', -0.1), 1.4, 0.5)
card(aw('data', 'bookings', -0.2), 0.0035, px(730)); card(aw('data', 'head', -0.2), 0.0035, px(1190))
card(aw('pisa', 'Pisa', -0.1), 0.0035, px(650)); card(aw('pisa', 'Here', -0.2), 0.0035, px(1270))
card(ac('write', 0.5), 0.004, px(620))
pen(aw('write', 'writes', 0.0), 0.9, 0.0045, px(620), 3)
mark(C4, F4, aw('question', 'Do', -0.3), 0.6, 2.4, under=A3)
for word, off in (('decision', -0.1), ('dates', -0.1), ('who', -0.1), ('change', -0.1), ('means', -0.3)):
    pen(aw('under', word, off), 0.4, 0.0035, px(620), 2)
slide(aw('words', 'own', -0.1), 0.8, 0.0035, px(450))
card(aw('reply', 'replies', -0.2), 0.0035, px(1480))
pair(F3, A3, aw('reply', 'Yes', -0.1), 1.0, 0.55); tb(C4, aw('reply', 'Yes', 0.95), 1.6, 0.55)

# 5. What the question gave: the page waits its turn, the muted D, low; the team starts from the page; across the week, A; at the peak,
#    F; booked, and nobody came, the muted D again; the answer, A rising to C over the muted F, and its tick; the two who were right,
#    ticked; the dashboard's bars drawn; and the answer in time: the mark, F settling onto A
LV[0] = 0.9
nw = lambda lid, word, off=0: W('answer', lid, word, off)
nc = lambda lid, off=0: G('answer', lid, off)
card(nw('wait', 'waits', -0.1), 0.0035, px(1560))
cup(D3, nw('wait', 'turn', -0.1), 2.2, 0.6)
card(nc('start', 0.6), 0.0035, px(960))
card(nw('week', 'booked', -0.2), 0.0035, px(470)); tb(A3, nw('week', 'booked', 0.0), 0.9, 0.45)
card(nw('peak', 'booked', -0.3), 0.0035, px(1460)); tb(F4, nw('peak', 'booked', -0.1), 1.1, 0.45)
cup(D3, nw('empty', 'nobody', -0.2), 1.4, 0.55)
a0 = nw('so', 'not', -0.2)
card(a0, 0.0035, px(640)); cup(F3, a0, 2.4, 0.55); figure((A3, C4), a0 + 0.05, 0.55, 0.3, 0.26, 1.8)
ticked(a0 + 0.6, 0.004, px(1100))
ticked(nw('both', 'peak', 0.0), 0.004, px(1830)); ticked(nw('both', 'Monday', 0.2), 0.004, px(1850))
slide(nc('dash', 0.2), 1.2, 0.0035, px(960))
card(nw('instead', 'answer', -0.1), 0.0035, px(1500))
mark(F4, A4, nw('instead', 'answer', -0.1), 0.55, 2.2, under=F3)

# 6. On Monday: back in Pisa, framed on the wall: what saving it meant, the mark, C settling onto F, as at the start; the engineer's
#    note pinned up and signed; Graham's page, ticked; the front door's form filling in; each piece of advice pinned up, the fourth
#    over F and A; and the close: the mark, A settling onto F, held as F major into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
card(mw('back', 'agreed', -0.2), 0.0035, px(1050))
mark(C4, F4, mw('back', 'agreed', 0.1), 0.5, 2.2, under=A3)
card(mw('daily', 'signed', -0.3), 0.0035, px(1600)); pen(mw('daily', 'said', 0.0), 0.9, 0.004, px(1600), 3)
ticked(mw('same', 'answer', 0.0), 0.004, px(1430))
tap(mc('form', -0.1), 0.0035, px(960)); slide(mw('form', 'five', -0.3), 1.6, 0.0035, px(960))
card(mc('monday', 0.3), 0.0035, px(400)); card(mw('who', 'who', -0.1), 0.0035, px(960))
card(mw('listen', 'Listen', -0.1), 0.0035, px(1520)); card(mw('write', 'write', -0.1), 0.0035, px(960))
pair(F3, A3, mw('write', 'agree', -0.1), 1.6, 0.45)
mark(A3, F4, mw('take', 'agree', -0.2), 0.5, 5.2, until=TOT)
cup(F3, mw('take', 'agree', 0.36), 5.0, 0.45, until=TOT)
