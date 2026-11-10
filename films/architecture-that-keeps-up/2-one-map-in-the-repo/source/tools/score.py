# One map, in the repo: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py).
# The palette, reserved for this film in the module's palettes.md on 10 November 2026, after checking every palettes.md and every
# score.py on main and on every branch that day: no film on the site has either.
#  - The lead: a singing aluminium rod. A long rod held at its middle and stroked lengthwise with rosined fingers rings one pure, high
#    note: its partials are the odd harmonics only (1, 3, 5), each exactly in tune, the third and fifth faint. The stroke brings it in
#    softly, with a breath of rosin; it holds steady while the fingers stroke, and rings down once they stop. Placed and held still:
#    no vibrato, no slide from note to note, nothing that beats.
#  - Its partner: a wooden ruler, twanged on a desk's edge and damped at once by the hand that holds it: one short, dry, low note, and
#    the knock of the wood on the desk. Never left to wobble. It sounds each time a change to the map is merged.
# The mark: three rods, each on its own note (the three copies, the three records), that meet on one: the same A, in two octaves.
# It sounds when the three records point three ways and when MasterMap makes them one, as the copies drift and are made from one source
# again, when Noor says to keep one, back at Ordnance Survey and at the close.
# A major; F sharp minor for the opening's problem (lines with no name, records that can't be matched). Every chord is tuned pure
# from A (just intonation, see hz()): A, D and E major and F sharp minor are pure in this table; B minor is not, and is never played.
# The wrong line in the agent's draft is a D sharp, a note outside the key, stopped short: in tune, never detuned, only not where it
# belongs. Nothing British for Ordnance Survey: no brass band, no church bells, no folk tune (the module's palettes.md).
# The rules the module keeps (its briefs, 5 November 2026; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles or pulses; each rod's note ends before it would ring into the next chapter. No urgent pulse: nothing in the film
#    is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/om_scenes.js, and pans to where it is drawn, so sound and picture stay together when the voice is re-timed.
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
R1 = np.random.default_rng(2001)  # this film's own randomness: the room, the rosin, the paper

# ---- tuning: just intonation from A, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 45, 12)
    return 110.0 * 2 ** o * _JI[pc]
A2, E3, A3, Cs4, D4, E4, Fs4, Gs4, A4, B4, Cs5, D5, Ds5, E5, Fs5, A5 = 45, 52, 57, 61, 62, 64, 66, 68, 69, 71, 73, 74, 75, 76, 78, 81

# ---- the levels: the rods matched by loudness, as far under the voice as the module's other music; the ruler a little under them;
# the effects about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the top of each chapter
LR, LW, FX = 0.05, 0.06, 3.2
LV = [1.0]

# a small room round the rods, ringing on for about a second. Its level is set by what it rings where the notes are (its gain from
# 100 Hz to 1.5 kHz is one), as the video guidelines ask, and _room() keeps each note as loud as it was dry
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

def rod(m, s, g=1.0, pan=None, ring=1.4, room=0.25, until=None):
    """the singing rod: stroked in over about a tenth of a second with a breath of rosin, held steady for ring seconds while the fingers
    stroke, then ringing down once they stop. Odd harmonics only, each exactly in tune"""
    f0 = hz(m); d = ring
    if until is not None:
        d = min(d, max(0.2, until - s - 0.6))
    sec = d + 0.9; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.zeros(n)
    for k, a in ((1, 1.0), (3, 0.1), (5, 0.025)):
        if f0 * k < 2400:
            sig += a * np.sin(2 * np.pi * f0 * k * x + 0.3 * k)
    envl = np.minimum(1.0, x / 0.12) ** 1.5 * np.where(x < d, 1.0, np.exp(-(x - d) / 0.28))
    sig *= envl
    # the rosin under the fingers as the stroke starts: a soft, short hush in the rod's own register
    ro = filt(noise(0.3)[:int(0.3 * SR)], 'band', (max(120, f0 * 0.7), min(2200, max(420, f0 * 1.6)))) * np.exp(-np.arange(int(0.3 * SR)) / SR / 0.06)
    sig = sig / max(1e-9, float(np.abs(sig).max()))
    sig[:len(ro)] += 0.04 * ro / max(1e-9, float(np.abs(ro).max()))
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 90)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LR, max(-0.35, min(0.35, (m - 69) * 0.02)) if pan is None else pan)

def ruler(m, s, g=1.0, pan=0.0, until=None):
    """the wooden ruler, twanged on the desk's edge and damped at once: one short, dry, low note, and the knock of the wood"""
    f0 = hz(m); sec = 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = (np.sin(2 * np.pi * f0 * x) + 0.3 * np.sin(2 * np.pi * f0 * 2 * x) * np.exp(-x / 0.03)) * np.exp(-x / 0.075) * np.minimum(1, x / 0.002)
    kn = np.sin(2 * np.pi * 190 * x) * np.exp(-x / 0.012)
    sig = norm(filt((sig + 0.35 * kn).astype(np.float32), 'low', 1400))
    put(_until(_room(sig, 0.15, 0.0, 0.2), s, until), s, g * LV[0] * LW, pan)

def chord(notes, s, g=1.0, step=0.14, ring=1.8, until=None):
    """rods stroked from the lowest up, each stopped together at the end"""
    for i, m in enumerate(notes):
        rod(m, s + step * i, g, None, max(0.5, ring - step * i), until=until)
def mark(s, g=1.0, three=(Cs5, E5, Fs4), meet=(A4, A5), step=0.5, last=2.2, until=None):
    """the mark: three rods, each on its own note, one after another, then the two that meet on one A, in two octaves"""
    for i, m in enumerate(three):
        rod(m, s + step * i, g * 0.85, None, 0.55, until=until)
    for m in meet:
        rod(m, s + step * len(three) + 0.1, g, None, last, until=until)

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
    """paper slid along, or a line drawn out: a dry, even rub that eases off"""
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
def keys(s, sec=1.2, g=0.004, pan=0.0):
    """text typed in on a screen: one soft, even texture of keys, never a burst of separate clicks"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = np.abs(filt(noise(sec + 0.02)[:n], 'low', 14)); gr = 0.6 + 0.4 * gr / max(1e-9, float(gr.max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (300, 1200)) * _bump(x, sec, 0.8) * gr, s, g, pan, 1300)

# =============================================================================================================================
# 1. One database, every map: the opening, the film's story from outside data. Great Britain, the late 1990s: A major, the rods
#    stroked in one by one as the map comes in. Ordnance Survey's sheet laid down. The map cut into tiles: paper slid apart. Only lines,
#    no name: one rod's E, alone. The three records, a sheet each, each with its own note of F sharp minor, as each points its own way:
#    the mark's three notes, apart. The same place?: F sharp and A together, low. The new road drawn: a line drawn out. Nothing under
#    "Something has to change". MasterMap: the three notes meet on one A, in two octaves, the ruler's low A under it, as the tiles join.
#    Three identifiers pinned, a tap each. The council and the water company point to the same building: D major, then a tick. Each
#    change dated: a sheet laid down; 500 million: A major. The three copies drift: their three notes again, apart; one source, and
#    every copy made from it: the three meet on one; A major, held, under the title card
LV[0] = 0.85
ow = lambda lid, word, off=0: W('tiles', lid, word, off)
oc = lambda lid, off=0: G('tiles', lid, off)
END = E('tiles')
chord((A3, E4, A4, Cs5), ow('when', 'Britain', -0.2), 0.7, step=0.3, ring=2.6)
card(ow('os', 'Survey', -0.3), 0.004, px(340))
slide(ow('tiles', 'cut', -0.1), 1.4, 0.004, px(1200))
rod(E5, ow('lines', 'lines', -0.1), 0.6, px(1100) * 0.4, ring=1.2)
for i, (word, m) in enumerate((('Councils', Fs4), ('water', A4), ('emergency', Cs5))):
    card(ow('users', word, -0.1), 0.0035, px(350))
    rod(m, ow('match', 'matches', -0.1) + 0.35 * i, 0.55, px(350) * 0.4, ring=0.9)
chord((Fs4, A4), ow('sure', 'same', -0.1), 0.5, step=0.2, ring=1.6)
slide(ow('road', 'road', -0.1), 1.6, 0.004, px(1500))
mark(ow('launch', 'MasterMap', -0.3), 0.75, step=0.45, last=2.6)
ruler(A2, ow('launch', 'seamless', -0.3), 0.8, 0.0)
for i, x in enumerate((1240, 1620, 1260)):
    tap(ow('toid', 'identifier', -0.2) + 0.4 * i, 0.004, px(x))
chord((D4, Fs4, A4), ow('point', 'point', -0.1), 0.55, step=0.16, ring=1.6)
ticked(ow('point', 'doubt', -0.1), 0.0045, px(1236))
card(ow('history', 'version', -0.2), 0.0035, px(350))
chord((A3, E4, A4, Cs5), ow('grew', 'million', -0.3), 0.5, step=0.12, ring=1.8)
for i, x in enumerate((330, 960, 1590)):
    card(oc('data', 0.2 + 0.3 * i), 0.0035, px(x))
mark(ow('one', 'source', -0.2), 0.6, step=0.4, last=2.0)
chord((A2, E3, A3, Cs5, E5), oc('breath', 0.3), 0.65, step=0.2, ring=4.2, until=END)

# 2. Three pictures of one target: the chapter turns on D major, high; the series' sheet laid down. Helena's sheet; her target picture
#    drawn in. Three pictures of it, a sheet or a screen each. The council, 25 May: its sheet; the old warehouse ringed on the slide,
#    one rod's C sharp, alone. Which picture is true?: F sharp and A, low, a question left open. The project managers' deck; out of
#    date, a tap. Noor: copies drift, keep one source: the mark, its three notes meeting on one
LV[0] = 0.9
cw = lambda lid, word, off=0: W('copies', lid, word, off)
cc = lambda lid, off=0: G('copies', lid, off)
chord((D4, Fs4, A4), S0('copies') + 0.2, 0.55, step=0.16, ring=2.0)
card(S0('copies') + 0.9, 0.004, px(960))
card(cw('spring', 'Helena', -0.2), 0.0035, px(1220))
slide(cw('spring', 'target', 0.1), 1.4, 0.0035, px(1220))
for i, x in enumerate((330, 960, 1590)):
    card(cc('three', 0.2 + 0.35 * i), 0.0035, px(x))
card(cw('may', 'Tuesday', -0.2), 0.004, px(390))
rod(Cs5, cw('slide', 'old', -0.2), 0.55, px(1260) * 0.4, ring=1.4)
chord((Fs4, A4), cw('which', 'Which', -0.2), 0.5, step=0.2, ring=1.4)
card(cc('pm', 0.2), 0.0035, px(610))
tap(cw('pm', 'March', 0), 0.0035, px(610))
mark(cw('noor', 'drift', -0.3), 0.55, step=0.32, last=1.8, until=E('copies'))

# 3. The map moves into the repo: the chapter turns on A and E; the repository's files come in, one soft texture of keys; the standard
#    and the team's own, each picked out with a tap. The diagram typed, then drawn: keys, then a line drawn out. Each night: the four
#    things made from it, a rod for each, rising through A major. The seven places; the repository's pill, a tap. Made from the map:
#    four ticks, and A major
LV[0] = 0.9
rw = lambda lid, word, off=0: W('repo', lid, word, off)
rc = lambda lid, off=0: G('repo', lid, off)
chord((A3, E4, A4), S0('repo') + 0.2, 0.5, step=0.18, ring=2.0)
keys(rw('june', 'repository', -0.2), 1.6, 0.0035, px(600))
tap(rw('standard', 'exchange', -0.2), 0.0035, px(600)); tap(rw('own', 'own', -0.2), 0.0035, px(600))
keys(rw('text', 'text', -0.2), 1.4, 0.0035, px(530))
slide(rw('text', 'picture', -0.3), 1.8, 0.0035, px(1400))
for i, (lid, word, m) in enumerate((('night', "tool's", A4), ('night', 'wiki', Cs5), ('night', 'picture', E5), ('who', 'who', A5))):
    rod(m, rw(lid, word, 0.2), 0.5, px(1460) * 0.4, ring=0.8)
tap(rw('places', 'repository', -0.2), 0.0035, px(960))
ticked(rw('cant', 'made', -0.3), 0.0045, px(1700))
chord((A3, Cs5, E5), rw('cant', 'made', 0.3), 0.5, step=0.14, ring=1.8, until=E('repo'))

# 4. Every change, reviewed: the chapter turns on E major; the pull request's sheet; the reviewers; July's sheet; the code and the map
#    together: a tap; the check passes and the change is merged: a tick, and the ruler's twang; a source with no place: one low rod's
#    F sharp, stopped short. Saved up, or every change: the lanes drawn out; tomorrow's legacy: F sharp and A, low. The decision
#    record laid down; what was decided: A
LV[0] = 0.9
gw = lambda lid, word, off=0: W('change', lid, word, off)
gc = lambda lid, off=0: G('change', lid, off)
chord((E4, Gs4, B4), S0('change') + 0.2, 0.5, step=0.16, ring=1.8)
card(gw('pr', 'reason', -0.3), 0.0035, px(1560))
card(gw('july', 'July', -0.2), 0.0035, px(1560))
tap(gw('same', 'together', -0.4), 0.0035, px(660))
ticked(gw('check', 'check', -0.2), 0.0045, px(240))
ruler(A2, gw('check', 'check', 0.2), 0.75, px(240))
rod(Fs4, gw('check', 'fails', 0.2), 0.5, px(1780) * 0.4, ring=0.5)
slide(gc('wait', 0.2), 3.0, 0.0035, px(960))
chord((Fs4, A4), gw('legacy', 'legacy', -0.3), 0.5, step=0.2, ring=1.4)
card(gw('record', 'record', -0.3), 0.004, px(960))
rod(A4, gw('record', 'why', 0.0), 0.5, None, ring=1.6, until=E('change'))

# 5. An agent drafts, a person decides: Helena's notes laid down; the draft typed in, a texture of keys, and its diagram drawn; Noor's
#    review; the wrong line: a D sharp, outside the key, stopped short; the fix typed over it: A and E; approved and merged: the ruler,
#    and a tick. The rule: A major, the agent's side and Noor's
LV[0] = 0.9
aw = lambda lid, word, off=0: W('agent', lid, word, off)
ac = lambda lid, off=0: G('agent', lid, off)
card(aw('august', 'notes', -0.4), 0.004, px(980))
keys(aw('writes', 'writes', -0.2), 2.0, 0.0035, px(550))
slide(aw('writes', 'diagram', -0.2), 1.8, 0.0035, px(1430))
rod(Ds5, aw('wrong', 'wrong', -0.2), 0.55, px(1220) * 0.4, ring=0.4, room=0.12)
chord((A4, E5), aw('fix', 'fix', 0.3), 0.5, step=0.18, ring=1.0)
ruler(A2, aw('fix', 'approves', -0.2), 0.75, px(1570))
ticked(aw('fix', 'approves', 0.0), 0.0045, px(1570))
chord((A3, E4, A4, Cs5), aw('rule', 'decides', -0.2), 0.5, step=0.14, ring=1.8, until=E('agent'))

# 6. Everyone's job, starting with hers: the chapter turns on D major; Helena's first pull request, reviewed and merged: the ruler. The
#    team beside her. The year's history scrolls by: a line slid out; the old warehouse retired: a tick, and A major. The council reads
#    the history: its sheet laid down
LV[0] = 0.9
ew = lambda lid, word, off=0: W('everyone', lid, word, off)
chord((D4, Fs4, A4), S0('everyone') + 0.2, 0.5, step=0.16, ring=1.8)
ruler(A2, ew('hers', 'first', 1.1), 0.7, px(1500))
slide(ew('dec', 'history', -0.3), 3.0, 0.0035, px(620))
ticked(ew('dec', 'retired', -0.2), 0.0045, px(1760))
chord((A3, E4, A4), ew('dec', 'retired', 0.2), 0.5, step=0.14, ring=1.8)
card(ew('council', 'reviews', -0.3), 0.0035, px(410))

# 7. On Monday: Ordnance Survey comes back, framed on the wall: the mark, its three notes meeting on one, as the identifier is named;
#    Helena's team did the same: the four things made from the map, rising through A major; each piece of advice laid down; and the
#    close: the mark an octave lower, its A held as A major into the end card
LV[0] = 0.9
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
mark(mw('back', 'database', -0.2), 0.5, step=0.4, last=1.6)
for i, m in enumerate((A4, Cs5, E5, A5)):
    rod(m, mc('helena', 0.6 + 0.3 * i), 0.45, px(1460) * 0.4, ring=0.7)
card(mc('repo', 0.3), 0.0035, px(390))
for lid, word, x in (('review', 'Review', 960), ('make', 'Make', 1530), ('agents', 'agents', 640), ('job', "everyone's", 1280)):
    card(mw(lid, word, -0.1), 0.0035, px(x))
mark(mw('take', 'everything', -0.3), 0.5, three=(Cs4, E4, Fs4), meet=(A3, A4), step=0.45, last=5.0, until=TOT)
chord((E4, Cs5), mw('take', 'everything', -0.3 + 0.45 * 3 + 0.1), 0.4, step=0.0, ring=5.0, until=TOT)
