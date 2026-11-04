# A model, reasoning, hands and a loop: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, checked on 3 November 2026 against every score.py on main and on every branch, and against the
# series' other films (palettes.md): one clean electric guitar, played two ways, and an electric bass, all made here, as music.py has
# none of them.
#  - The guitar plucked softly with the thumb, on its neck pickup, its tone turned down: the hands reaching, and the data coming back.
#    The same guitar's harmonics (a string touched lightly over a fret as it's plucked: a pure, round note) for a check that passes,
#    and a note muted with the side of the hand for one that doesn't, yet.
#  - The guitar held by an e-bow, a small magnet held over a string that hears the string and pushes it again, so it sounds for as long
#    as it's held: a loop of its own, as Sperry's box and the agent are. It swells, holds steady and, lifted off, rings on as a plucked
#    string does. It holds the chords, at a chapter's turn and under a moment; and a held chord is a person who watches and decides.
#  - An electric bass, played with the thumb, round and low: each correction, the pilot's arms, Sperry's box bringing the wing back,
#    and the agent's loop going round again.
# The marks mean the same all through:
#  - The loop: three plucked notes, G, C and D, for "Plan", "Act" and "Check", each as the agent's light reaches its step. When the
#    check passes, the line falls home, B then G (home()); while it fails, the e-bow takes up the D and holds it with its fourth, a G
#    above, unresolved (fails()).
#  - Sperry's box: its loop has no "Plan", so its figure is the loop's without its first note: C and D, then home (boxfig()). A plain
#    script plays the box's figure too, the same way every time.
#  - A correction: the bass's two notes, D then G (fix()).
#  - The three tools: each its own plucked note as it arrives, Catalog C, Query E and Docs G, and the same note as its data comes back
#    or a plan names it.
# G major; E minor for the problem in 1914, and C for the box; the chapters turn on E minor (Jun's question), C (a model writes),
# B minor (reasoning: A minor's fifth is out of tune here), C (hands), G (the loop, the answer, the close) and D (a plain script).
# Every chord is tuned pure from G (just intonation, see hz()); A is never held with E, nor F with C (their fifths aren't pure here),
# no two notes a semitone apart are held together, and the seventh partial, which beats against any 5-limit note, is left low.
# The rules the series keeps (its briefs, 3 November 2026, as the governance and master data films did):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks that after the opening no chapter has music for more than
#    half its length, or for 12 seconds without a break, that it comes in at most once every 10 seconds on average, that no figure
#    comes back soon after itself, and that the music and the effects sit as low as the governance films' (the author's review, 4
#    November 2026, found this film's audio "a bit disruptive and repetitive": its music came in every five seconds, Sperry's box
#    played its figure six times, and its music sat 2 to 4 dB louder than theirs, its effects 6 to 9 dB).
#  - Nothing trembles or pulses: each note is one string, steady, with no vibrato or bend, its partials harmonic; every chord pure; the
#    plucked notes damped by the player before they'd ring into the next chapter. No urgent pulse: the failed check isn't a crisis, only
#    a reason to go round again.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.4 kHz; the effects about 12 dB under the music.

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
R1 = np.random.default_rng(12)  # this film's own randomness: the river, the crowd, the paper

# ---- tuning: just intonation from G, so a chord's notes are whole-number ratios of each other and nothing beats. G, C, D, E minor and
# B minor are all pure in this table, and D major too (A is 9/8 of G, a pure fifth over D); A with E, and F with C, are a comma off
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 55, 12)
    return 196.0 * 2 ** o * _JI[pc]
G1, B1, C2, D2, E2, G2, B2, C3, D3, E3, Fs3, G3, A3, B3 = 31, 35, 36, 38, 40, 43, 47, 48, 50, 52, 54, 55, 57, 59
C4, D4, E4, Fs4, G4, B4, C5, D5, E5, Fs5, G5 = 60, 62, 64, 66, 67, 71, 72, 74, 76, 78, 79
PLAN, ACT, CHECK = G4, C5, D5       # the loop's three notes
TOOL = (C4, E4, G4)                 # Catalog, Query, Docs

# ---- the levels: the plucked guitar, the e-bow (a note of a chord) and the bass matched by loudness, about as far under the voice as
# the series' other music; the effects about 12 dB under the music (FX scales them all). LV[0] is the chapter's own level, set at the
# top of each chapter below. After the author's review (4 November 2026: "a bit disruptive and repetitive"), the plucked notes and the
# bass are 5 dB lower and the e-bow 2.5 dB, so the music's loud moments sit as low as the governance films' (tools/quiet.py measures
# it), and the effects 7 dB lower, as soft as theirs
LG, LH, LM, LE, LB, FX = 0.071, 0.052, 0.071, 0.035, 0.096, 3.4
LV = [1.0]

# a small room round the instruments, ringing on for about a second
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.016 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum())
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

# ---- the guitar's string. Its partials are harmonic, each as strong as where the thumb plucks it and where the pickup hears it allow
# (a string can't move at a point it's held still by, so some partials are weak: the pickup's comb), the higher ones softer and gone
# sooner. The seventh partial, out of tune with every note of a 5-limit scale, and the few above it that are, are kept low
PICK, NECK = 0.27, 0.24   # where the thumb plucks and where the neck pickup sits, as parts of the string's length from the bridge
_comb = lambda k, at: abs(np.sin(np.pi * k * at))
_SEVEN = {7: 0.2, 11: 0.4, 13: 0.4, 14: 0.2}
def _pan(m, pan):
    return max(-0.3, min(0.3, (m - 66) * 0.02)) if pan is None else pan
def _thump(sec, n, f=280, d=0.01):
    """the thumb's soft touch on the string: a little low noise, gone in a hundredth of a second"""
    x = np.arange(n) / SR; th = filt(noise(sec + 0.02)[:n], 'low', f) * np.exp(-x / d)
    return th / max(1e-9, float(np.abs(th).max()))

def gtr(m, s, g=1.0, pan=None, ring=None, f=None, room=0.22, until=None, soft=6.5):
    """a string plucked softly with the thumb at s, on the neck pickup, the tone turned down; it rings on, the higher partials fading
    first, until the player damps it after ring seconds (by default it rings about two and a half times its fundamental's decay);
    until: a time in the film by which it's gone whatever ring says"""
    f0 = f or hz(m); t1 = 2.4 * (330 / f0) ** 0.3; d = ring if ring else t1 * 2.6
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 40):
        fk = f0 * k
        if fk > 2500:
            break
        a = _comb(k, PICK) * _comb(k, NECK) / k * np.exp(-(k - 1) / soft) * _SEVEN.get(k, 1.0)
        sig += a * np.sin(2 * np.pi * fk * x) * np.exp(-x / (t1 / (1 + 0.55 * (k - 1))))
    sig *= (1 - np.exp(-x / 0.004)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.05))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.04 * _thump(sec, n)
    sig = filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 70)
    sig = _until(_room(norm(sig), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LG, _pan(m, pan))

def harm(m, s, g=1.0, pan=None, ring=None, room=0.3, until=None):
    """a harmonic: the string touched lightly over a fret as the thumb plucks it, so it rings only in its higher ways, at the note heard
    here: a pure, round note, a little like a small bell, that fades slowly; a check that passes"""
    f0 = hz(m); t1 = 1.4 * (500 / f0) ** 0.3; d = ring if ring else t1 * 2.6
    if until is not None:
        d = min(d, max(0.12, until - s - 0.3))
    sec = d + 0.3; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k, a in ((1, 1.0), (2, 0.09), (3, 0.025)):
        if f0 * k < 2500:
            sig += a * np.sin(2 * np.pi * f0 * k * x) * np.exp(-x / (t1 / (1 + 0.7 * (k - 1))))
    sig *= (1 - np.exp(-x / 0.007)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.06))
    th = filt(noise(sec + 0.02)[:n], 'band', (300, 1200)) * np.exp(-x / 0.006)
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.02 * th / max(1e-9, float(np.abs(th).max()))
    sig = _until(_room(norm(filt(sig.astype(np.float32), 'low', 2300)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LH, _pan(m, pan))

def mute(m, s, g=1.0, pan=None, room=0.12):
    """a note muted with the side of the hand as the thumb plucks it: short and dull; a check that doesn't pass yet, or nothing found"""
    f0 = hz(m); sec = 0.55; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 16):
        if f0 * k > 1800:
            break
        a = _comb(k, PICK) * _comb(k, NECK) / k * np.exp(-(k - 1) / 2.2) * _SEVEN.get(k, 1.0)
        sig += a * np.sin(2 * np.pi * f0 * k * x) * np.exp(-x / (0.15 / (1 + 0.9 * (k - 1))))
    sig *= 1 - np.exp(-x / 0.005)
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.12 * _thump(sec, n, 240, 0.014)
    sig = _room(norm(filt(sig.astype(np.float32), 'low', 1600)), room, 0.0, 0.3)
    put(sig, s, g * LV[0] * LM, _pan(m, pan))

def ebow(m, a, b, g=1.0, att=0.9, rel=1.6, pan=None, f=None, room=0.3, until=None):
    """a string held by the e-bow from a to b: the magnet pushes it each time it swings, so it swells over att, its fundamental first
    and its higher partials a moment after, and then holds steady, with no vibrato and no bow on the string; lifted off at b, the
    string rings on and fades over rel, the higher partials first, as a plucked one does"""
    f0 = f or hz(m); sec = max(0.4, b - a)
    if until is not None:
        rel = min(rel, max(0.25, until - b - 0.05))
    n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 30):
        fk = f0 * k
        if fk > 2400:
            break
        ak = (1 / k ** 1.15) * (0.35 + 0.65 * _comb(k, NECK)) * np.exp(-fk / 2600) * _SEVEN.get(k, 1.0)
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.2 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-np.maximum(x - sec, 0) * 4.6 * (1 + 0.5 * (k - 1)) / rel), 1.0)
        sig += ak * on * off * np.sin(2 * np.pi * fk * x + 0.7 * k)
    sig /= max(1e-9, float(np.abs(sig).max()))
    sig = _until(_room(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 60), room, min(att * 1.5, sec * 0.5), sec), a, until)
    put(sig, a, g * LV[0] * LE, _pan(m, pan) * 0.6)

def ebass(m, s, g=1.0, pan=0.0, ring=None, room=0.1, until=None):
    """the electric bass, plucked with the thumb at s: round and low; its harmonics carry the note on a phone's speaker, which can't play
    the fundamental; ring: seconds until the player damps it"""
    f0 = hz(m); t1 = 1.5 * (100 / f0) ** 0.25; d = ring if ring else t1 * 2.4
    if until is not None:
        d = min(d, max(0.12, until - s - 0.25))
    sec = d + 0.25; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for k in range(1, 24):
        fk = f0 * k
        if fk > 1600:
            break
        a = _comb(k, 0.23) * _comb(k, 0.15) / k ** 0.4 * np.exp(-(k - 1) / 8) * _SEVEN.get(k, 1.0)
        sig += a * np.sin(2 * np.pi * fk * x) * np.exp(-x / (t1 / (1 + 0.3 * (k - 1))))
    sig *= (1 - np.exp(-x / 0.005)) * np.where(x < d, 1.0, np.exp(-(x - d) / 0.06))
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.07 * _thump(sec, n, 180, 0.015)
    sig = _until(_room(norm(filt(filt(sig.astype(np.float32), 'low', 1600), 'high', 35)), room, 0.0, min(1.0, d)), s, until)
    put(sig, s, g * LV[0] * LB, pan)

# ---- what they play
def chord(notes, a, b, g=1.0, att=0.9, rel=1.6, stag=0.15, until=None):
    """an e-bow chord: each note on its own string, the e-bow taking them one after another, from the lowest"""
    for i, m in enumerate(notes):
        ebow(m, a + stag * i, b, g, att, rel, (i - (len(notes) - 1) / 2) * 0.25, until=until)
def home(s, g=1.0, step=0.55, ring=1.6, pan=None, until=None):
    """a check passes: the line falls home, B then G"""
    gtr(B4, s, g, pan, ring); gtr(G4, s + step, g, pan, ring, until=until)
def fails(s, hold, g=1.0):
    """a check fails: the e-bow takes up the D and holds it with its fourth, a G above, and it doesn't resolve"""
    ebow(D5, s, s + hold, 0.75 * g, att=0.5, rel=1.2); ebow(G5, s + 0.12, s + hold, 0.5 * g, att=0.6, rel=1.0)
def boxfig(s, step=0.45, g=1.0, ring=1.2, pan=None, last=None, until=None):
    """Sperry's box, and a plain script: C and D, then home, B and G: the loop's figure with no plan"""
    for i, m in enumerate((C5, D5, B4, G4)):
        gtr(m, s + step * i, g, pan, last if (i == 3 and last) else ring, until=until)
def mark(s, steps=(0.45, 0.45), g=1.0, ring=1.2, pan=None):
    """the loop: plan, act, check, one note as the light reaches each step"""
    t = s
    for i, m in enumerate((PLAN, ACT, CHECK)):
        gtr(m, t, g, pan, ring); t += steps[i] if i < 2 else 0
def fix(s, step=1.2, g=1.0, ring=1.2, until=None):
    """a correction: the bass's two notes, D, then G as it comes right"""
    ebass(D2, s, g, ring=min(ring, step + 0.05)); ebass(G2, s + step, g, ring=ring + 0.4, until=until)

# ---- the sounds, all soft and low-passed, on the effects bus. Each one's own, made here
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _bump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _knock(n, f, d, at=0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone with a dull overtone, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 2.3 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015) * k

def river(s, sec, g=0.006, pan=0.0):
    """the Seine at the bank, low and soft: small waves, each a swell of low water noise, at uneven gaps, so they make no beat; they
    come and go with the shot"""
    n = int(sec * SR); x = np.arange(n) / SR; out = 0.2 * filt(noise(sec + 0.02)[:n], 'band', (80, 300)); t = 0.15 * R1.uniform()
    while t < sec - 0.3:
        d = R1.uniform(0.35, 0.8); i, j = int(t * SR), min(n, int((t + d) * SR))
        out[i:j] += filt(noise(d + 0.02)[:j - i], 'band', (150, 900)) * _bump(np.arange(j - i) / SR, d) * R1.uniform(0.45, 1.0)
        t += d * R1.uniform(0.5, 1.0) + R1.uniform(0.15, 0.55)
    out *= np.minimum(1, x / 0.7) * np.minimum(1, (sec - x) / 0.9)
    _fx(out, s, g, pan, 1400)
def crowd(s, sec, g=0.006, pan=0.0):
    """a crowd along the far bank: many voices together, a murmur with no words, low as from across the water"""
    n = int(sec * SR); x = np.arange(n) / SR; out = np.zeros(n)
    for lo, hi in ((260, 620), (520, 1100), (900, 1500)):
        v = filt(noise(sec + 0.02)[:n], 'band', (lo, hi))
        sw = np.interp(x, np.linspace(0, sec, max(4, int(sec * 3))), R1.uniform(0.5, 1.0, max(4, int(sec * 3))))
        out += v * sw
    out *= np.minimum(1, x / 1.0) * np.minimum(1, (sec - x) / 1.2)
    _fx(out, s, g, pan, 1500)
def cheer(s, sec=3.0, g=0.009, pan=0.0):
    """the crowd cheers: the murmur swells to a shout, and people clap, each at their own pace, so the claps make no beat"""
    n = int(sec * SR); x = np.arange(n) / SR
    out = filt(noise(sec + 0.02)[:n], 'band', (350, 1600)) * (np.minimum(1, x / 0.35) * np.exp(-np.maximum(0, x - 0.6) / 1.2))
    for p in range(9):
        t = R1.uniform(0.15, 0.5)
        while t < sec - 0.3:
            i = int(t * SR); j = min(n, i + int(0.03 * SR)); u = np.arange(j - i) / SR
            out[i:j] += 0.5 * filt(noise(0.05)[:j - i], 'band', (500, 1800)) * np.exp(-u / 0.006) * np.exp(-t / 1.6)
            t += R1.uniform(0.3, 0.48)
    out *= np.minimum(1, (sec - x) / 0.8)
    _fx(out, s, g, pan, 1800)
def engine(s, sec, g=0.008, p0=-0.5, p1=0.5, top=500):
    """the flying boat's engine as it passes: its propeller's low, rough drone, as from far off, swelling as it comes and fading as it
    goes, its pitch falling a little as it passes; in tune with G (49 Hz, two octaves under G), so it rubs against nothing"""
    n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; u = x / sec
    f = 49.0 * (1.02 - 0.04 * (0.5 - 0.5 * np.cos(np.pi * u))); ph = 2 * np.pi * np.cumsum(f, dtype=np.float64) / SR
    tone = sum(np.sin(k * ph) / k ** 1.2 for k in range(1, 9) if k not in (7,))
    sig = (0.35 * tone / 3 + filt(noise(sec + 0.02)[:n], 'band', (60, 420))) * _bump(x, sec, 1.3)
    sig = norm(filt(sig.astype(np.float32), 'low', top)); k = np.linspace(0, 1, n, dtype=np.float32)
    X(sig * (1 - k), s, g * FX, p0); X(sig * k, s, g * FX, p1)
def gust(s, sec=1.3, g=0.008, pan=0.0):
    """a gust over the wings: air that rises and falls, brighter at its height"""
    n = int(sec * SR); x = np.arange(n) / SR; e = _bump(x, sec, 1.5)
    _fx(filt(noise(sec + 0.02)[:n], 'band', (150, 600)) * e + 0.6 * filt(noise(sec + 0.02)[:n], 'band', (500, 1400)) * e ** 2, s, g, pan, 1600)
def slip(s, sec=1.9, g=0.007, pan=0.0):
    """the aeroplane slipping sideways and down: air whose pitch falls as it goes, and fades"""
    n = int(sec * SR); x = np.arange(n) / SR; u = x / sec
    hi = filt(noise(sec + 0.02)[:n], 'band', (500, 1300)); lo = filt(noise(sec + 0.02)[:n], 'band', (130, 450))
    _fx((hi * (1 - u) + lo * u) * _bump(x, sec, 1.2), s, g, pan, 1500)
def air(s, sec=1.0, g=0.006, pan=0.0, lo=140, hi=800):
    """a card carried through the air: a soft breath that rises and falls"""
    n = int(sec * SR); _fx(filt(noise(sec + 0.02)[:n], 'band', (lo, hi)) * _bump(np.arange(n) / SR, sec), s, g, pan, 1200)
def whir(s, sec=2.6, g=0.006, pan=0.0):
    """gyroscopes spinning up: a soft whir whose pitch rises to G's and settles, gone before it could hold"""
    n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; u = np.clip(x / (0.6 * sec), 0, 1)
    f = 30 + 68 * (1 - (1 - u) ** 2); ph = 2 * np.pi * np.cumsum(f, dtype=np.float64) / SR
    tone = np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.25 * np.sin(4 * ph)
    _fx((0.5 * tone / 1.75 + filt(noise(sec + 0.02)[:n], 'band', (250, 900))) * np.minimum(1, x / 0.3) * np.minimum(1, (sec - x) / (0.4 * sec)), s, g, pan, 1100)
def puff(s, g=0.008, pan=0.0):
    """compressed air let through a valve: a short, soft puff"""
    n = int(0.5 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.52)[:n], 'band', (200, 1300)) * (1 - np.exp(-x / 0.012)) * np.exp(-x / 0.11), s, g, pan, 1400)
def knock(s, g=0.008, pan=0.0, f=170, d=0.03):
    """a soft knock: a piston at the end of its stroke"""
    n = int(0.25 * SR); x = np.arange(n) / SR
    _fx(_knock(n, f, d) + 0.15 * filt(noise(0.27)[:n], 'band', (300, 1200)) * np.exp(-x / 0.008), s, g, pan, 1500)
def land(s, g=0.008, pan=0.0):
    """the model settling into the empty place in the loop: a soft, low, rounded knock, with a faint give"""
    knock(s, g, pan, 120, 0.06)
def creak(s, g=0.006, pan=0.0, sec=0.45):
    """the wing's wood and wire under a step: a slow give, a run of tiny, uneven catches"""
    n = int(sec * SR); out = np.zeros(n); t = 0.0
    while t < sec - 0.01:
        i = int(t * SR); j = min(n, i + int(0.012 * SR)); u = np.arange(j - i) / SR
        out[i:j] += np.sin(2 * np.pi * 520 * u) * np.exp(-u / 0.0025) * R1.uniform(0.6, 1.0)
        t += (1 / 85) * R1.uniform(0.8, 1.25) * (1 + 0.5 * t / sec)
    _fx(out * _bump(np.arange(n) / SR, sec, 0.8), s, g, pan, 1300)
def card(s, g=0.006, pan=0.0):
    """a card laid down: a soft flap of paper, and its faint landing"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.18)[:n], 'band', (380, 1800)) * _bump(x, 0.07) * (x < 0.07)
    _fx(fl + 0.6 * _knock(n, 150, 0.018, 0.06) / 1.35, s, g, pan, 1900)
def tablecard(s, g=0.007, pan=0.0):
    """a card set on the judges' wooden table: paper, then the wood's low knock"""
    card(s, g * 0.8, pan); knock(s + 0.06, g * 0.7, pan, 140, 0.035)
def calpage(s, g=0.007, pan=0.0):
    """a calendar's page turned over: a longer flap of paper, and its soft fall"""
    n = int(0.45 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.47)[:n], 'band', (300, 1900)) * _bump(x, 0.36, 1.5) * (x < 0.36) + 0.5 * _knock(n, 160, 0.02, 0.36) / 1.35, s, g, pan, 1900)
def tap(s, g=0.005, pan=0.0):
    """something small set down: one soft, short tap"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (250, 1100)) * np.exp(-x / 0.007) + 0.6 * _knock(n, 210, 0.012), s, g, pan, 1600)
def slide(s, sec=0.9, g=0.005, pan=0.0):
    """a card or a block slid along: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 30); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _fx(filt(noise(sec + 0.02)[:n], 'band', (200, 1300)) * _bump(x, sec, 1.4) * gr, s, g, pan, 1500)
def joint(s, g=0.005, pan=0.0):
    """an arm's joint turning: a short, muffled rub, and a soft stop"""
    n = int(0.22 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.24)[:n], 'band', (150, 650)) * _bump(x, 0.16) * (x < 0.16) + 0.4 * _knock(n, 230, 0.01, 0.16) / 1.35, s, g, pan, 1100)
def lock(s, g=0.007, pan=0.0):
    """a lock turning, softly: two low clicks"""
    n = int(0.3 * SR); _fx(_knock(n, 260, 0.009) + 0.8 * _knock(n, 200, 0.012, 0.11), s, g, pan, 1600)
def rattle(s, g=0.005, pan=0.0):
    """a locked card shaken: three soft knocks against its catch"""
    n = int(0.6 * SR); _fx(sum(_knock(n, 240, 0.008, at) * w for at, w in ((0, 1), (0.21, 0.8), (0.42, 0.55))), s, g, pan, 1500)
def plug(s, g=0.006, pan=0.0):
    """a plug pushed home: a short rub, and a soft, low click"""
    n = int(0.25 * SR); x = np.arange(n) / SR
    _fx(0.5 * filt(noise(0.27)[:n], 'band', (200, 900)) * _bump(x, 0.1) * (x < 0.1) + _knock(n, 300, 0.008, 0.1), s, g, pan, 1600)
def unplug(s, g=0.005, pan=0.0):
    """a plug pulled out: a soft click, and a short rub"""
    n = int(0.25 * SR); x = np.arange(n) / SR - 0.03
    _fx(_knock(n, 280, 0.007) + 0.5 * filt(noise(0.27)[:n], 'band', (200, 900)) * _bump(np.maximum(x, 0), 0.12) * (x > 0) * (x < 0.12), s, g, pan, 1600)
def clip(s, g=0.004, pan=0.0):
    """the paperclip: a small, dull metal tick, its ring cut short"""
    n = int(0.12 * SR); x = np.arange(n) / SR
    _fx(sum(np.sin(2 * np.pi * f * x) * np.exp(-x / d) * a for f, d, a in ((780, 0.02, 1), (2110, 0.008, 0.4))), s, g, pan, 2300)
def pen(s, sec=0.7, g=0.006, pan=0.0, n=3):
    """a name signed: the pen's soft scratch, a stroke for each letter"""
    for i in range(n):
        d = sec / n * R1.uniform(0.7, 0.9); t = s + sec / n * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(noise(d + 0.02)[:m], 'low', 60)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(noise(d + 0.02)[:m], 'band', (700, 2100)) * _bump(x, d, 0.6) * (0.3 + 0.7 * gr), t, g, pan, 2200)
def ticked(s, g=0.005, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pen(s, 0.24, g, pan, 2)
def rustle(s, sec, g=0.004, pan=0.0, k=7):
    """pages in the air round the model: soft paper, here and there"""
    for i in range(k):
        t = s + sec * (i + R1.uniform(0.1, 0.9)) / k; d = R1.uniform(0.12, 0.22); m = int(d * SR)
        _fx(filt(noise(d + 0.02)[:m], 'band', (350, 1700)) * _bump(np.arange(m) / SR, d, 1.5), t, g * R1.uniform(0.6, 1.0), pan + R1.uniform(-0.2, 0.2), 1800)

# =============================================================================================================================
# 1. Hands off: the opening, the series' story from outside data. 1914 by the Seine: the river and the crowd, a few seconds each; the
#    e-bow holds G as the crowds line the river; the flying boat comes in, its engine far off; the bass enters with Sperry and Cachin.
#    The problem, E minor: each gust a breath of air, the first with a plucked note that leans away and the bass bringing it back, the
#    second the bass alone; the chord thins as his arms and back ache, to the bass alone as the aeroplane slips and falls; on
#    "Something has to change", nothing. The box, C: the gyroscopes spin up under a held fifth on the e-bow; the aeroplane tips, a note
#    leans, the valve puffs, the piston knocks, and the bass's two notes bring it level. Over the river the engine passes; Sperry lets
#    go and raises his hands: the box's figure, the guitar alone. Cachin climbs out, the wing creaks and dips, and the bass brings it
#    back; the crowd cheers. The prize, G, the e-bow rising to the third; today's pilots, who watch and decide, held. In the room, the
#    box's figure for its hands, check and loop, and a muted note where a plan would be; the model drops in, its plan's note; the
#    agent's ring, the loop's mark whole for the first time, and the title on G
LV[0] = 0.84
ow = lambda lid, word, off=0: W('off', lid, word, off)
oc = lambda lid, off=0: G('off', lid, off)
river(0.2, 5.4, 0.003, px(900))
crowd(ow('date', 'crowds', -1.4), 5.6, 0.003, px(700))
ebow(G3, 0.5, oc('hard', -0.8), 0.9, att=1.8, rel=1.4, pan=-0.12)
ebow(D4, 0.95, oc('hard', -0.8), 0.8, att=1.8, rel=1.4, pan=0.0)
ebow(B4, ow('date', 'crowds'), oc('hard', -0.8), 0.6, att=1.6, rel=1.2, pan=0.12)
prog = oc('last', -0.2)
engine(prog, 4.6, 0.004, -0.85, -0.2, 450)
ebass(G2, ow('last', 'young'), 0.85, ring=2.4)
ebass(D2, ow('last', 'Emil'), 0.75, ring=1.4)
# the problem: E minor, from the shot of Sperry flying by hand; three gusts, each a breath of air: the first a plucked note leaning away
# and his arms bringing the wing back on the bass, the second the bass alone, softer, the third only the air (the same figure three
# times in four seconds sounded repetitive); the chord thins as he aches
pit = oc('hard', -0.5); g1 = ow('gust', 'gust')
ebow(E3, pit, oc('fall', -0.5), 0.9, att=1.4, rel=1.2, pan=-0.12)
ebow(B3, pit + 0.2, oc('ache'), 0.75, att=1.4, rel=1.6, pan=0.0)
ebow(G4, pit + 0.4, g1 + 4.6, 0.55, att=1.4, rel=1.6, pan=0.12)
for k, gt in enumerate((g1, g1 + 1.7, g1 + 3.4)):
    gust(gt - 0.4, 1.3, 0.0045 - 0.0005 * k, px(1300))
    if k == 0:
        gtr(C5, gt, 0.7, px(1100), ring=0.5)
    if k < 2:
        ebass(E2, gt + 0.25, 0.8 if k == 0 else 0.55, ring=1.1)
# the slip, drawn: the bass alone, one low note left to hang, no correction coming; the air of the slide; then silence
ebass(E2, oc('fall', -0.4), 0.85, ring=5.6, until=oc('change', -0.3))
slip(ow('fall', 'slip', -0.2), 1.9, 0.004, px(1100))
# Sperry's box, C major: the gyroscopes spin up under a held fifth, the third at "four gyroscopes"; the aeroplane tips and a note leans;
# the valve's puff, the piston's knock, and the bass's two notes, D at the pistons and G as it's level; the piston comes back
box = oc('box', -0.6)
whir(box + 0.15, 2.8, 0.0035, px(666))
ebow(C3, box + 0.1, ow('feels', 'level', 0.4), 0.9, att=1.6, rel=1.3, pan=-0.12)
ebow(G3, box + 0.3, ow('feels', 'level', 0.4), 0.8, att=1.6, rel=1.3, pan=0.0)
ebow(E4, ow('box', 'four'), ow('feels', 'level', 0.4), 0.55, att=1.4, rel=1.2, pan=0.12)
gtr(B4, ow('feels', 'tips', -0.2), 0.6, px(666), ring=0.6)
puff(ow('feels', 'feels'), 0.0045, px(520))
knock(ow('feels', 'pistons', 0.35), 0.0045, px(560))
fix(ow('feels', 'pistons'), ow('feels', 'level') - ow('feels', 'pistons'), 0.85, ring=1.3)
knock(ow('feels', 'level', 0.9), 0.0035, px(560), 150)
# over the river: the flying boat passes the grandstand, the crowd's heads turning; then in the cockpit, Sperry lets go and raises his
# hands: the box's figure, the guitar alone
pas = oc('hands', -0.5)
engine(pas, 3.6, 0.005, -0.35, 0.3, 650); crowd(pas + 0.1, 2.6, 0.003, px(1100))
lets = ow('hands', 'lets')
for i, (m, t) in enumerate(((C5, lets), (D5, ow('hands', 'raises', -0.15)), (B4, ow('hands', 'raises', 0.5)), (G4, ow('hands', 'raises', 1.1)))):
    gtr(m, t, 0.75, px(960), ring=3.0 if i == 3 else 1.8)
# Cachin climbs out along the wing, two steps, the wood giving; the wing dips under him, a note leans, and the bass brings it back
creak(ow('wing', 'climbs'), 0.0035, px(1200)); creak(ow('wing', 'climbs', 0.9), 0.003, px(1320))
gtr(B4, ow('dips', 'dips', -0.3), 0.6, px(1100), ring=0.6)
fix(ow('dips', 'dips', 0.4), ow('dips', 'brings') - ow('dips', 'dips', 0.4), 0.85, ring=1.4)
cheer(ow('dips', 'back', 0.3), 3.2, 0.005, px(980))
# the prize, G: the judges' table, the card laid down, the e-bow rising to the third; it holds through his hands at rest and into
# today's flight deck, and lets go as the timeline shows how little is flown by hand
prize = oc('prize', -0.45); first = ow('prize', 'first', -0.15)
ebow(G3, prize + 0.1, ow('auto', 'only'), 0.85, att=1.2, rel=2.0, pan=-0.12)
ebow(D4, prize + 0.3, ow('auto', 'only'), 0.75, att=1.2, rel=2.0, pan=0.0)
ebow(G4, prize + 0.5, first, 0.5, att=0.8, rel=0.35, pan=0.12)
ebow(B4, first, ow('auto', 'only'), 0.55, att=0.6, rel=1.8, pan=0.12)
tablecard(first, 0.004, px(1430))
# and they stay in their seats, to watch, and decide: held
ebow(G3, oc('seats'), oc('nomodel', -0.6), 0.8, att=1.1, rel=1.2, pan=-0.12)
ebow(D4, oc('seats', 0.15), oc('nomodel', -0.6), 0.7, att=1.1, rel=1.2, pan=0.0)
ebow(B4, ow('seats', 'watch', -0.2), oc('nomodel', -0.6), 0.5, att=0.9, rel=1.2, pan=0.12)
# the box in the room: its figure for its hands, its check (it tips, amber) and its loop (level again); a muted note where its plan
# would be. Its one known job goes without music: the figure played again three seconds later sounded repetitive
rx = px(1124)
for m, t, r in ((C5, ow('nomodel', 'hands'), 1.0), (D5, ow('nomodel', 'check'), 1.0), (B4, ow('nomodel', 'loop'), 0.9), (G4, ow('nomodel', 'loop', 0.45), 0.9)):
    gtr(m, t, 0.65, rx, ring=r)
mute(G3, ow('nomodel', 'model'), 0.75, rx)
# a model that reasons, dropped into the loop: it settles where the muted note was, and its plan sounds; the ring closes to the agent's,
# its steps come one by one with the loop's notes, and the line falls home as the title comes; the e-bow holds G under the title
ins = ow('agent', 'inside', -0.3)
land(ins + 0.72, 0.005, rx); gtr(PLAN, ins + 0.72, 0.7, rx, ring=1.1)
ag = ow('agent', 'agent')
for m, t in ((PLAN, ag - 0.2), (ACT, ag + 0.3), (CHECK, ag + 0.8)):
    gtr(m, t, 0.7, rx, ring=1.2)
title = oc('breath', 0.2)
gtr(B4, ag + 1.5, 0.7, rx, ring=1.4); gtr(G4, title, 0.75, rx, ring=3.0, until=E('off'))
chord((G3, D4, B4), title, E('off') - 0.9, 0.8, att=1.4, rel=0.8, until=E('off'))

# 2. Jun's question: the chapter turns on E minor, the e-bow alone. Census day's calendar; the afternoon's clock card; the five small
#    steps by hand, a tap each; the question carried to the agent as its goal; its ring, and the loop's three notes as its light goes
#    round, falling home as its check turns green
LV[0] = 0.8
qw = lambda lid, word, off=0: W('question', lid, word, off)
qc = lambda lid, off=0: G('question', lid, off)
chord((E3, B3, G4), S0('question') + 0.15, S0('question') + 2.6, 0.75, att=1.0, rel=1.4)
calpage(qc('census'), 0.005, px(1300))
card(qc('byhand'), 0.006, px(1580))
for i, word in enumerate(('find', 'read', 'query', 'check', 'fix')):
    tap(qw('byhand', word, -0.1), 0.005, px(560 + 130 * i))
air(qw('gives', 'gives', 0.1), 1.3, 0.004, px(800))
tk = qw('gives', 'takes')
for i, m in enumerate((PLAN, ACT, CHECK)):
    gtr(m, tk + 0.55 * i, 0.6, px(1124), ring=0.9)
home(qw('gives', 'checks', 0.35), 0.6, ring=1.2, pan=px(1124))

# 3. A model writes: the chapter turns on C. Pages in the air round the model as it learns; a plucked note for each word it writes,
#    "The university has about", and the three words it might write next, the likeliest the one it takes, the line's obvious end; the
#    question, and its guess, laid down without music; the records shut behind glass; nothing looked up: a muted note
LV[0] = 1.0
ww = lambda lid, word, off=0: W('writes', lid, word, off)
wc = lambda lid, off=0: G('writes', lid, off)
chord((C3, G3, E4), S0('writes') + 0.15, S0('writes') + 2.6, 0.75, att=1.0, rel=1.4)
rustle(wc('learned'), 3.8, 0.004, px(1124))
lk = ww('learned', 'likely', -0.3)
for i, m in zip((0, 4, 15, 19), (C4, D4, E4, G4)):
    gtr(m, lk + 1.3 * i / 24, 0.55, px(1300), ring=0.8)
for i, m in enumerate((C5, D5, B4)):
    gtr(m, ww('learned', 'likely', 1.0 + 0.15 * i), 0.3, px(1300 + 150 * i), ring=0.35)
gtr(C5, ww('learned', 'likely', 2.2), 0.6, px(1300), ring=1.2)
card(wc('guess'), 0.005, px(700))
lock(ww('guess', 'never', -0.1), 0.006, px(1520))
mute(G3, ww('alone', 'look'), 0.7, px(1400))

# 4. Reasoning: the chapter turns on B minor. The plan written out, a note for each of its three lines, rising; the census report laid
#    down, and the rules; each line of the plan meets the rules and passes, three harmonics; the results ride back as feedback, and
#    "checks against rules", without music
LV[0] = 1.0
rw = lambda lid, word, off=0: W('reasons', lid, word, off)
rc = lambda lid, off=0: G('reasons', lid, off)
chord((B2, Fs3, D4), S0('reasons') + 0.15, S0('reasons') + 2.6, 0.75, att=1.0, rel=1.4)
for m, (lid, word) in zip((B3, D4, Fs4), (('plan', 'find'), ('plan', 'count'), ('report', 'check'))):
    gtr(m, rw(lid, word), 0.55, px(1600), ring=1.0)
card(rw('report', 'census', -0.1), 0.005, px(705)); card(rc('rules', -0.1), 0.005, px(687))
for i, m in enumerate((B4, D5, Fs5)):
    harm(m, rw('rules', 'evidence', 0.8 + 0.35 * i), 0.55, px(1600), ring=1.3)

# 5. Hands: the chapter turns on C. A model can't open a table: the closed card rattles on its catch; but tools can: three arms
#    unfold; each tool card arrives with its own note, Catalog C, Query E and Docs G, and an arm takes hold; their servers set down;
#    the plugs pushed home through the open standard; a second agent plugs in from above and leaves; and the lock: they can only read
LV[0] = 1.0
hw = lambda lid, word, off=0: W('hands', lid, word, off)
hc = lambda lid, off=0: G('hands', lid, off)
chord((C3, G3, E4), S0('hands') + 0.15, S0('hands') + 2.6, 0.75, att=1.0, rel=1.4)
rattle(hw('third', 'open'), 0.005, px(1550))
for i in range(3):
    joint(hw('third', 'tools', -0.1 + 0.3 * i), 0.005, px(1400))
for i, (word, m) in enumerate((('Catalog', C4), ('Query', E4), ('Docs', G4))):
    gtr(m, hw('three', word), 0.65, px(1660), ring=1.4); joint(hw('three', word, 0.55), 0.004, px(1450))
for i in range(3):
    tap(hw('server', 'server', -0.2 + 0.25 * i), 0.005, px(1724))
plug(hw('mcp', 'standard', 0.25), 0.006, px(1500))
plug(hw('mcp', 'any', 0.35), 0.005, px(1795)); unplug(hw('mcp', 'use', 0.9), 0.005, px(1795))
lock(hw('read', 'only', -0.1), 0.006, px(1660))

# 6. A loop: the loop's notes as its light reaches each step, as it's named. Round one: the Catalog and the query touched, their data
#    coming back with their tools' notes; the check, and its fail: the D held with its fourth. The model thinks, in silence. Round two:
#    a new plan, its note; the rule from Docs and the new query, touched; the new query's data; the check, and it passes, falling home,
#    and a held G. Unlike Sperry's box, which can only push back (its correction), the model decides what to try next (the plan's
#    note). The loop stops: when the checks pass, at its limit, or when it needs a person (held). After the author's review (4 November
#    2026: "a bit disruptive and repetitive"), the chapter's sixteen figures in a minute were too many: the acts, a second plan note,
#    the second round's tool notes and the stops before "a person" now go without music
LV[0] = 1.0
lw = lambda lid, word, off=0: W('loop', lid, word, off)
lc = lambda lid, off=0: G('loop', lid, off)
rx = px(1124)
for m, t in ((PLAN, lw('fourth', 'plan')), (ACT, lw('fourth', 'act')), (CHECK, lw('fourth', 'check'))):
    gtr(m, t, 0.6, rx, ring=0.8)
for t, y in ((lw('counts', 'Catalog', -0.3), 236), (lw('counts', 'Query', -0.3), 404), (lw('rule', 'Docs', -0.3), 572), (lc('again', 0.2), 404)):
    tap(t, 0.007, px(1660))
gtr(TOOL[0], lw('counts', 'Catalog', 1.5), 0.4, px(1400), ring=0.6); gtr(TOOL[1], lw('counts', 'Query', 1.5), 0.4, px(1400), ring=0.6)
gtr(CHECK, lw('short', 'check'), 0.6, rx, ring=0.5); fails(lw('short', 'check', 0.2), 1.6, 0.85)
gtr(PLAN, lc('rule', -0.3), 0.6, rx, ring=0.9)
gtr(TOOL[1], lc('again', 2.0), 0.4, px(1400), ring=0.6)
gtr(CHECK, lw('passes', 'matches', -0.3), 0.6, rx, ring=0.6)
home(lw('passes', 'matches'), 0.65, ring=1.0, pan=rx)
chord((G3, D4), lw('passes', 'matches', 0.55), lw('passes', 'passes', 0.3), 0.6, att=0.8, rel=1.2)
fix(lw('unlike', 'push'), 0.7, 0.7, ring=0.8)
gtr(PLAN, lw('unlike', 'decides'), 0.55, px(1050), ring=1.0)
chord((G3, D4, B4), lw('stops', 'person', -0.1), E('loop') - 1.2, 0.5, att=0.6, rel=0.9, until=E('loop'))

# 7. The answer, with its evidence: the agent lets go of its tools, the arms' joints, and they slide away; the answer carried to Jun
#    and laid down, without music; the evidence comes out from under the clip, a card for each piece as it's named, its check among
#    them, without music (its harmonic made the music come in six times in thirty seconds); "Approved by", and Jun signs: a held chord,
#    a person deciding (the chord is kept for him: it also sounded as the answer was laid down, which played it twice in eighteen
#    seconds); and it goes up to Planning
LV[0] = 1.1
aw = lambda lid, word, off=0: W('answer', lid, word, off)
br = aw('brings', 'brings')
for i in range(3):
    joint(br - 0.15 + 0.2 * i, 0.0025, px(1440))
slide(br + 0.4, 1.0, 0.003, px(1700))
air(br, 1.2, 0.0035, px(900)); card(br + 1.3, 0.0035, px(732))
clip(aw('evid', 'tables', -0.3), 0.004, px(890))
for t in (aw('evid', 'tables', -0.2), aw('evid', 'rule', -0.2), aw('evid', 'both', -0.2), aw('evid', 'both', 0.3), aw('evid', 'check', -0.2)):
    card(t, 0.0025, px(1270))
card(aw('decides', 'approval', -0.1), 0.0025, px(732))
pen(aw('decides', 'decides', -0.05), 0.7, 0.0035, px(500))
chord((G3, D4, B4), aw('decides', 'decides'), aw('decides', 'Planning', 0.6), 0.7, att=0.8, rel=1.3, until=E('answer'))
air(aw('decides', 'Planning', 0.2), 1.1, 0.0035, px(732))

# 8. A plain script: the chapter turns on D. Next March's calendar, its page turned to 2027; the recipe card, and the steps that worked
#    slid into it; its test, a card; saved in the project; Noor's review, and her approval, a held chord; then the recipe runs each
#    census day: the box's figure, once (three times in four seconds sounded repetitive; the picture shows the three years); like
#    Sperry's box, its gyroscopes' whir. The agent's four minutes. Once, the long way: the long arm's joints, and a muted note for the
#    plan that named no tools; the slow data from the web comes back without music. Today each plan names its tools, their three notes,
#    and the arms given; then the two columns: the plain script, the box's figure, and the agent, the loop's three notes, left open:
#    steps nobody can write in advance
LV[0] = 0.88
sw = lambda lid, word, off=0: W('script', lid, word, off)
sq = lambda lid, off=0: G('script', lid, off)
chord((D3, A3, Fs4), S0('script') + 0.15, S0('script') + 2.6, 0.75, att=1.0, rel=1.4)
calpage(sw('march', 'March', 0.2), 0.005, px(452))
card(sw('march', 'steps', -0.35), 0.005, px(1140))
slide(sw('march', 'steps', 0.2), 0.9, 0.004, px(1250)); slide(sw('march', 'steps', 0.65), 0.9, 0.004, px(1200))
knock(sw('recipe', 'project', -0.1), 0.005, px(1140), 150)
card(sw('recipe', 'Noor', -0.25), 0.005, px(1140)); ticked(sw('recipe', 'approves'), 0.005, px(1270))
chord((G3, D4), sw('recipe', 'approves'), sw('recipe', 'approves', 1.4), 0.55, att=0.6, rel=1.1)
boxfig(sw('runs', 'runs', -0.2), 0.2, 0.55, ring=0.7, pan=px(1140))
whir(sw('runs', 'like', -0.1), 2.2, 0.003, px(1744))
card(sw('took', 'four', -0.1), 0.005, px(1750))
card(sq('web', -0.25), 0.005, px(480))
for i in range(3):
    joint(sw('web', 'searched', -0.2 + 0.4 * i), 0.004, px(1440))
mute(D4, sw('docs', 'plan', -0.1), 0.6, px(480))
nm = sw('names', 'names')
for f, m in ((1 / 21, TOOL[0]), (10 / 21, TOOL[1]), (17 / 21, TOOL[2])):
    gtr(m, nm + f, 0.55, px(600), ring=0.9)
for i in range(3):
    joint(sw('names', 'gives', 0.1 + 0.18 * i + 0.35), 0.004, px(1450))
boxfig(sw('known', 'plain', -0.7), 0.3, 0.55, ring=0.8, pan=px(640))
mark(sw('keep', 'agents', -0.3), (0.4, 0.4), 0.55, ring=1.4, pan=px(1220))

# 9. Back in the seat: 1914 again, the river and the engine as the flying boat crosses; the box's one job in its corner, without music
#    (its figure had just played for the plain script); Sperry back in his seat, held. Today: the agent's loop once round, without
#    music, and its answer brought home; Jun signs. An agent is a model that reasons, with hands, in a loop: the parts gather into the
#    ring, and it glows, held on into the end card: the loop's mark whole over it, and the title on G (one chord, not the same one twice
#    in six seconds)
LV[0] = 0.85
tw = lambda lid, word, off=0: W('seat', lid, word, off)
tc = lambda lid, off=0: G('seat', lid, off)
river(S0('seat') + 0.1, 3.6, 0.003, px(900)); engine(S0('seat'), 4.4, 0.004, -0.3, 0.25, 600)
chord((G3, D4), tw('held', 'seat', -0.5), tw('held', 'seat', 0.7), 0.5, att=0.8, rel=0.9)
home(tw('took', 'brought', 0.1), 0.6, ring=1.0, pan=px(900))
pen(tw('took', 'decide', -0.1), 0.6, 0.004, px(500))
en = tc('breath')
chord((G3, D4, B4), tw('is', 'loop', 0.95), TOT - 0.3, 0.5, att=1.4, rel=0.25, until=TOT)
mark(en, (0.42, 0.42), 0.55, ring=1.4)
home(en + 1.4, 0.55, step=0.6, ring=2.6, until=TOT)
