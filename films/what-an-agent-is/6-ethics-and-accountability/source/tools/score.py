# Ethics we can't read, accountability it can't hold: the music and sounds, played by tools/audio.py with From words to data's
# instruments (shared/tools/music.py). A new palette, chosen on 3 November 2026 and checked against every score.py on main and on every
# branch, and against the series' other films (palettes.md): two instruments, both made here, as music.py has neither.
#  - A slate lithophone: a row of stone bars, struck softly with felt mallets. A short, dry, clear note, its overtones those of a stone
#    bar, not in tune with the note, gone in a moment: the act, and the call. The law, carved in stone.
#  - A melodica: a small keyboard of free reeds, blown by a person's breath, played soft and in its middle range. It holds the chords,
#    and it answers: the person.
# Neither belongs to a tradition whose music the film could borrow, and nothing here imitates the music of any culture: no mode, ornament
# or rhythm of any tradition, and nothing from Mesopotamia's.
# The marks mean the same all through:
#  - The call is two rising notes on the stone, a fifth apart, the second left open: A and E in D, C and G in F.
#  - The answer is the melodica, falling home through the call's last note: F, E, D in D minor; A, G, F in F major; F sharp, E, D in
#    D major. A call with no answer is a question left open: "Someone has to answer for it", and Yusuf's "who answers?".
#  - The nights are the stone alone, lower and slower: the call's fifth, D and A, a note at a time.
#  - The error, said once: one low melodica note, D, held, and silence after it.
# D minor for Babylon's problem; F major once the law answers, and for the lab; D minor again where an agent goes wrong; D major at the
# end. Every chord is tuned pure from D (just intonation, see hz()); F major tunes G its own way.
# The rules the series keeps (its briefs, 3 November 2026, as the governance and master data films did):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks that after the opening no chapter has music for more than
#    half its length, or for 12 seconds without a break.
#  - Nothing trembles: every reed is one reed, steady, with no vibrato; the melodica breathes, one slow swell to a long note, never a
#    beat; every chord is tuned pure, voiced open; a stone note never lasts two seconds. The one urgent sound is in "Whoever holds the
#    rope" (film.json lists it in "urgent"): soft, quick, low clicks tied to the counter on screen, getting faster with it, and stopping
#    dead when the attackers are shut out.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft, below about 2.5 kHz; the stone and the melodica matched by loudness, the effects about 12 dB under.

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
def END(sid, lid):
    """when a line's voice stops (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(16)  # this film's own randomness: the mallets, the breath, the earth, the paper

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats. D minor's chords (D
# minor, G minor, B flat, A) and D major's (D, A) are all pure in this table, and so are F major's F, B flat, D minor and A minor; F
# major's C needs its G a comma higher, 9/8 over F (27/20 of D) instead of 4/3 of D, and FMAJ switches it. G is never held across the
# switch, and no chord here holds C with the lower G or E with G (the two impure pairs)
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
D3f = 146.83
FMAJ = [False]
def hz(m):
    o, pc = divmod(m - 50, 12)
    return D3f * 2 ** o * (27 / 20 if pc == 5 and FMAJ[0] else _JI[pc])
D3, E3, F3, Fs3, G3, A3, Bb3, C4, Cs4, D4, E4, F4, Fs4, G4, A4, Bb4, C5, Cs5, D5 = 50, 52, 53, 54, 55, 57, 58, 60, 61, 62, 64, 65, 66, 67, 69, 70, 72, 73, 74
# the chords, voiced open in the melodica's middle range, lowest first: a minor chord is never close and low, so it doesn't flutter
Dm, Gm, Bb, A_, F_, C_, Am, Dmaj = (D3, A3, F4), (G3, D4, Bb4), (Bb3, F4, D5), (A3, E4, Cs5), (F3, C4, A4), (E3, C4, G4), (A3, E4, C5), (D3, A3, Fs4)
HOLLOW = (D3, A3, D4)  # the open chord with no third: a call left unanswered

# ---- the levels: the stone and the melodica matched by loudness (a stone note's first half second against a held reed), about as far
# under the voice as the series' other music; the effects about 12 dB under the music (FX scales them all)
# After the author's review of the series' opening films (4 November 2026), the music is 1.5 dB lower and the effects 7 dB, so
# the music's and the effects' loud moments sit as low as the governance films' (tools/quiet.py measures them)
SL, ML_, FX = 0.093, 0.046, 3.1

# a small room of plaster and oak round the players, ringing on for about a second and a quarter. Its level is set by what it rings
# where the notes are (its gain from 100 Hz to 1.5 kHz is one), as the video guidelines ask: scaled by all it rang, as at first, it
# rang 10 dB louder there than its share said. _room() keeps each note as loud as it was dry, as before
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.25)).astype(np.float32))(np.arange(int(1.25 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.018 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0, keep=None):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds), because a room lifts some pitches
    and hollows others, and every note should sound as loud as its neighbours. keep: the whole cut to that many seconds, room and all"""
    if not k:
        return sig
    ir = _IR if keep is None else _IR[:max(1, int(min(len(_IR), keep * SR - len(sig))))]
    out = (np.pad(sig, (0, len(ir) - 1)) + k * fftconvolve(sig, ir)).astype(np.float32)
    if keep is not None:
        out = out[:int(keep * SR)]; f = min(len(out), int(0.12 * SR)); out[-f:] *= np.linspace(1, 0, f, dtype=np.float32)
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out

# ---- the slate lithophone: a bar of slate, struck near its end with a felt mallet. A bar's ways of ringing are not in tune with its
# note: the first overtone is 2.76 times it, the next 5.4 times, with a faint twist of the stone near 3.9 times; the felt barely wakes
# them and they die within a tenth of a second or so, while the note itself rings on, short and clear, and fades in about a second (a
# low bar a little longer). The mallet's touch is a dry, soft knock. Nothing above about 2.4 kHz, and never two seconds, room and all
def stone(m, s, g=1.0, pan=None, f=None, room=0.22):
    """a bar struck at s"""
    f0 = f or hz(m); tau = 0.3 * (330 / f0) ** 0.45; sec = min(1.85, tau * 5.2); x = tt(sec).astype(np.float64); sig = np.zeros(len(x))
    for r, a, k in ((1.0, 1.0, 1.0), (2.756, 0.17, 0.3), (3.9, 0.035, 0.1), (5.404, 0.05, 0.13)):
        if f0 * r < 2400:
            sig += a * np.sin(2 * np.pi * f0 * r * x + 0.7 * r) * np.exp(-x / (tau * k))
    sig *= 1 - np.exp(-x / 0.0022)
    tock = filt(noise(sec + 0.01)[:len(x)], 'band', (260, 1500)) * np.exp(-x / 0.005)
    sig = sig + 0.05 * tock / max(1e-9, float(np.abs(tock).max()))
    sig = norm(filt(sig.astype(np.float32), 'low', 2400))
    sig = _room(sig, room, 0.0, 0.5, keep=1.9)
    put(sig.astype(np.float32), s, g * SL, max(-0.3, min(0.3, (m - 60) * 0.02)) if pan is None else pan)

# ---- the melodica: one brass reed to a key, set going by the player's breath through a short tube. A free reed's sound has every
# harmonic, each softer than the last, the even ones a little weaker, with the small body's lift near 1.1 kHz; played softly the top
# rolls off, nothing above about 2.3 kHz. A reed speaks a moment after the breath, the higher harmonics last, with a little air as it
# starts; held steady, no vibrato, and a long note swells once and eases, as a breath does; it stops when the key lifts
def _reed(f):
    """the weights of a soft melodica reed's harmonics, at f Hz"""
    n = max(1, int(2300 // f)); k = np.arange(1, n + 1); fk = f * k
    a = (1 / k ** 1.05) * (1 + 0.5 * np.exp(-((fk - 1100) / 420) ** 2)) * np.exp(-fk / 2000) * np.where(k % 2 == 0, 0.78, 1.0)
    return a / np.sqrt((a ** 2).sum())
def melo(m, a, b, g=1.0, att=0.09, rel=0.12, pan=None, room=0.3):
    """one reed held from a to b, let go over rel seconds"""
    f = hz(m); sec = max(0.12, b - a); n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for j, aj in enumerate(_reed(f)):
        k = j + 1; on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.3 * (k - 1))), 1)) ** 2
        sig += aj * on * np.sin(2 * np.pi * f * k * x + 0.4 * k * k)
    env = np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    if sec >= 1.0:
        env = env * (0.84 + 0.16 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    sig = sig * env; nb = min(n, int(0.18 * SR))  # the breath as the reed speaks
    sig[:nb] += 0.02 * filt(noise(0.18), 'band', (400, 1800))[:nb] * np.exp(-np.arange(nb) / SR / 0.05)
    sig = filt(sig.astype(np.float32), 'low', 2300)
    sig = _room(sig, room, min(att * 2, sec * 0.5), sec)
    put(sig.astype(np.float32), a, g * ML_, max(-0.3, min(0.3, (m - 62) * 0.015)) if pan is None else pan)

# ---- what they play
def chord(c, a, b, g=0.7, att=0.35, rel=0.5, top=True):
    """the melodica holds a chord from a to b, its lowest note a little louder; top=False leaves out the top note, when the answer
    plays above it"""
    for i, m in enumerate(c if top else c[:-1]):
        melo(m, a + 0.02 * i, b, g * (0.85 if i == 0 else 0.7), att, rel)
def call(s, lo=A3, hi=E4, g=1.0, step=0.34):
    """the call: two rising notes on the stone, the second left open"""
    stone(lo, s, g * 0.9); stone(hi, s + step, g)
def answer(s, notes, hold, under=(), g=0.8, step=0.44):
    """the answer: the melodica falling home, a note to a step, the last held for hold seconds; under: the home chord's lower notes,
    joining as it arrives"""
    for i, m in enumerate(notes[:-1]):
        melo(m, s + step * i, s + step * (i + 1), g * 0.9, att=0.07, rel=0.06)
    t = s + step * (len(notes) - 1)
    melo(notes[-1], t, t + hold, g, att=0.07, rel=0.7)
    for i, m in enumerate(under):
        melo(m, t + 0.04 * i, t + hold, g * (0.5 if i == 0 else 0.42), att=0.3, rel=0.7)
def night(s, g=0.8, step=1.2):
    """the night: the stone alone, lower and slower, D, then A"""
    stone(D3, s, g); stone(A3, s + step, g * 0.85)

# ---- soft sounds, all low-passed, on the effects bus
def knock(s, g=0.010, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.007, pan=0.0):
    """a muffled click: a key, a button, a small card"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.007, pan=0.0, step=0.13):
    """keys typed softly"""
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.7, pan)
def tick(s, g=0.008, pan=0.0):
    """a tick drawn: its two strokes, short and soft"""
    s_tap(s, g * FX, pan); s_tap(s + 0.08, 0.7 * g * FX, pan)
def paper(s, g=0.008, pan=0.0, sec=0.3):
    """a sheet laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2 * np.exp(-x / (0.5 * sec)), s, g * FX, pan)
def slide(s, sec=0.8, g=0.008, pan=0.0):
    """a card or a note slid along: a dry, even rub"""
    x = tt(sec); gr = filt(noise(sec), 'low', 25)[:len(x)]; gr = 0.65 + 0.35 * gr / max(1e-9, float(np.abs(gr).max()))
    X(filt(noise(sec), 'band', (220, 1500))[:len(x)] * np.sin(np.pi * x / sec) ** 1.4 * gr, s, g * FX, pan)
def air(s, sec=0.8, g=0.007, pan=0.0, lo=140, hi=900):
    """something moving: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)
def pencil(s, sec=1.0, g=0.007, pan=0.0):
    """a line written on a card: a soft, grainy scratch"""
    x = tt(sec); gr = np.abs(filt(noise(sec), 'low', 70)[:len(x)]); gr = gr / max(1e-9, float(gr.max()))
    X(filt(noise(sec), 'band', (600, 2200))[:len(x)] * np.sin(np.pi * x / sec) ** 0.5 * (0.3 + 0.7 * gr), s, g * FX, pan)
def pin(s, g=0.010, pan=0.0):
    """a card pinned to the wall: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def stamp(s, g=0.014, pan=0.0):
    """a rubber stamp pressed on the gate's card: a padded thud"""
    x = tt(0.25); X(norm(filt((np.sin(2 * np.pi * 120 * x) * np.exp(-x * 25) + 0.4 * filt(noise(0.25), 'band', (150, 800))[:len(x)] * np.exp(-x * 35)).astype(np.float32), 'low', 900)), s, g * FX, pan)
def _clink(s, fs, g, pan, dec=26):
    """metal kept low: a few partials, quickly damped, nothing above about 2.3 kHz"""
    x = tt(0.3); c = sum(np.sin(2 * np.pi * f * x + i) * np.exp(-x * (dec + 0.01 * f)) for i, f in enumerate(fs)) * np.minimum(1, x / 0.002)
    X(norm(filt(c.astype(np.float32), 'low', 2300)), s, g, pan)
def lock(s, g=0.008, pan=0.0):
    """a small lock closing: two soft metal clicks"""
    _clink(s, (1150, 1720), g * FX, pan, 60); _clink(s + 0.05, (980, 1530), 0.7 * g * FX, pan, 70)
def keyring(s, g=0.008, pan=0.0):
    """a small key on a ring: two soft clinks"""
    _clink(s, (1180, 1630, 2050), g * FX, pan); _clink(s + 0.055, (1270, 1710, 2180), 0.7 * g * FX, pan)
def clock(s, g=0.010, pan=0.0):
    """a clock's single tick: a dry little knock"""
    s_knock(s, g * FX, pan, 520); s_tap(s + 0.003, 0.6 * g * FX, pan)
def creak(s, sec=0.5, g=0.006, pan=0.0, f0=150, f1=110):
    """wood giving: a balance's beam, a gate's hinge, a rail; a low, slow creak"""
    x = tt(sec).astype(np.float64); f = f0 + (f1 - f0) * x / sec; ph = 2 * np.pi * np.cumsum(f) / SR
    tone = sum(np.sin(k * ph) / k for k in range(1, 9)); env = np.sin(np.pi * x / sec) ** 1.5
    X(filt((tone * env).astype(np.float32), 'band', (200, 1100)) / 3, s, g * FX, pan)
def gate(s, g=0.008, pan=0.0):
    """the gate's two halves swinging open: their hinges, a moment apart, and the air they move"""
    creak(s, 0.6, g, pan - 0.08, 170, 120); creak(s + 0.12, 0.6, 0.8 * g, pan + 0.08, 160, 115); air(s + 0.1, 0.8, 0.6 * g, pan)
def shut(s, g=0.008, pan=0.0):
    """the gate's halves closing: a soft knock"""
    knock(s, g, pan, 190)
def rail(s, sec=1.0, g=0.007, pan=0.0):
    """an oak rail rising round the test copy: wood sliding, and a soft knock as it stops"""
    x = tt(sec); X(filt(noise(sec), 'band', (150, 800))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan); knock(s + sec * 0.95, 0.9 * g, pan, 200)
def rustle(s, g=0.006, pan=0.0, sec=0.4):
    """cloth: someone turns"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1800))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def step(s, g=0.007, pan=0.0, floor='earth'):
    """a footstep: a sandal on packed earth, or a shoe on the lab's oak"""
    if floor == 'earth':
        s_knock(s, g * FX, pan, 120); x = tt(0.06); X(filt(noise(0.06), 'band', (300, 1400))[:len(x)] * np.exp(-x / 0.012), s + 0.004, 0.5 * g * FX, pan)
    else:
        s_knock(s, g * FX, pan, 160); s_tap(s + 0.01, 0.4 * g * FX, pan)
def steps(t0, t1, every, g=0.006, pan=0.0, floor='earth', jit=0.02, u0=None):
    """footsteps from t0 to t1, one every so many seconds; u0: when the walker's picture starts, so the feet land as it draws them"""
    t = t0 if u0 is None else u0 + np.ceil((t0 - u0) / every) * every
    while t < t1:
        step(t + jit * R1.uniform(-1, 1), g * (0.85 + 0.15 * R1.uniform()), pan, floor); t += every
def hoof(s, g=0.006, pan=0.0):
    """a hoof set down on packed earth: a soft, low thud, and a little grit"""
    s_knock(s, g * FX, pan, 95); x = tt(0.05); X(filt(noise(0.05), 'band', (250, 1100))[:len(x)] * np.exp(-x / 0.01), s + 0.006, 0.35 * g * FX, pan)
def hooves(t0, t1, u0, rate=2.2, g=0.005, pan=0.0):
    """an ox walking, from t0 to t1: its hooves land as the drawing sets them down (every 1/rate seconds after the picture's start u0)"""
    k = int(np.ceil((t0 - u0) * rate))
    while u0 + k / rate < t1:
        hoof(u0 + k / rate, g * (0.8 + 0.2 * R1.uniform()), pan); k += 1
def scrape(s, sec, g=0.004, pan=0.0):
    """a plough's share in the earth: a low, even tearing that swells and eases with the oxen's pull"""
    x = tt(sec); sw = filt(noise(sec + 0.1), 'low', 1.5)[:len(x)]; sw = 0.7 + 0.3 * sw / max(1e-9, float(np.abs(sw).max()))
    X(filt(noise(sec), 'band', (120, 900))[:len(x)] * sw * np.minimum(1, x / 0.5) * np.minimum(1, (sec - x) / 0.8), s, g * FX, pan)
def wheels(s, sec, g=0.003, pan=0.0):
    """a cart's wooden wheels, far off: a low roll, and now and then a creak"""
    x = tt(sec); X(filt(noise(sec), 'band', (60, 320))[:len(x)] * np.minimum(1, x / 0.6) * np.minimum(1, (sec - x) / 0.8), s, g * FX, pan)
    for t in np.arange(0.4, sec - 0.5, 1.3):
        creak(s + t + 0.2 * R1.uniform(), 0.35, 0.35 * g, pan, 230, 200)
def snort(s, g=0.007, pan=0.0):
    """an ox's breath through its nose: a short, low rush of air"""
    x = tt(0.4); X(filt(noise(0.4), 'band', (150, 700))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / 0.12), s, g * FX, pan)
def rope(s, g=0.008, pan=0.0):
    """a rope pulled taut: a short rub of fibre, and its pull"""
    x = tt(0.3); X(filt(noise(0.3), 'band', (250, 1200))[:len(x)] * np.sin(np.pi * x / 0.3) ** 2, s, 0.7 * g * FX, pan); s_knock(s + 0.22, 0.6 * g * FX, pan, 140)
def rasp(s, n, g=0.005, pan=0.0, rate=2.2):
    """a rasp drawn along a horn's tip, n strokes: a dry, gritty file, the push firmer than the return"""
    for i in range(n):
        for d, gg in ((0.0, 1.0), (0.5 / rate, 0.45)):
            sec = 0.17; x = tt(sec); gr = np.abs(filt(noise(sec), 'low', 260)[:len(x)]); gr = gr / max(1e-9, float(gr.max()))
            X(filt(noise(sec), 'band', (700, 2200))[:len(x)] * np.sin(np.pi * x / sec) ** 0.8 * (0.35 + 0.65 * gr), s + i / rate + d, g * gg * FX, pan)
def silver(s, g=0.006, pan=0.0):
    """a coil of silver set on a pan: a dull clink, damped at once, and the pan's soft knock"""
    f = 1200 + 300 * R1.uniform(); _clink(s, (f, f * 1.37, f * 1.71), g * FX, pan, 45); s_knock(s + 0.004, 0.5 * g * FX, pan, 300)
def hoe(s, g=0.006, pan=0.0):
    """a hoe into the earth: a soft thud and the soil"""
    s_knock(s, g * FX, pan, 110); x = tt(0.14); X(filt(noise(0.14), 'band', (200, 1000))[:len(x)] * np.exp(-x / 0.035), s + 0.01, 0.5 * g * FX, pan)
def clicks(s0, s1, ramp=1.6, g=0.006, pan=0.0):
    """the counter racing: soft, quick, low clicks, from about four a second to about ten as it climbs, then steady, and stopping dead
    at s1 (twelve a second, with the counter's other sounds, came to thirteen sounds in a second, a crackle: 4 November 2026)"""
    t = s0
    while t < s1:
        u = min(1.0, (t - s0) / ramp); rate = 4 + 6 * u ** 1.5 if u < 1 else 10
        x = tt(0.03); X(norm(filt(noise(0.03), 'band', (300, 1100)) * np.exp(-x / 0.004)), t, g * FX * (0.75 + 0.25 * R1.uniform()), pan + 0.1 * R1.uniform(-1, 1))
        t += 1 / rate * (0.85 + 0.3 * R1.uniform())

# =============================================================================================================================
# 1. The ox that gores: the opening, under the melodica all through, D minor until the law answers. Babylon, soft and open; the field
#    by the canal, the plough's share in the earth, the pair's hooves, and a cart's wheels far off on the road; G minor and A as an ox
#    lowers its horns at a passer-by, who steps back, and its owner hauls the rope; the street emptied, people hurrying past, D minor
#    and its sixth for the family and the work that fed them; the ox chewing, a balance hung empty. "Someone has to answer for it": the
#    stone's call, and nothing answers, a hollow chord held. King Hammurabi's stone: the melodica answers for the first time, home in D
#    minor. The law: the condition on G minor, B flat and A; the silver laid on the pan, coil by coil, and the beam settling; a hired
#    worker's hoe. The owner knew what to do: the horn rasped, the rope tied, and the chords move to F major. The ox still did the heavy
#    work: the call and the answer together, at home. Then the lab: the team, the count's tick, and the title holds the answer's last note
ow = lambda lid, word, off=0: W('ox', lid, word, off)
oc = lambda lid, off=0: G('ox', lid, off)
# Babylon: D minor, soft and open, then its sixth; the field by the canal, the oxen at the plough
chord(Dm, 0.35, 3.6, 0.8, att=0.9)
chord(Bb, 3.85, 6.6, 0.7)
chord(Dm, 6.85, oc('gore', -1.6), 0.7)
scrape(0.2, oc('gore', -0.1), 0.0045, px(560))
hooves(0.3, oc('gore', -0.1), 0.0, 2.2, 0.0045, px(980)); hooves(0.3, oc('gore', -0.1), -0.4, 2.2, 0.0028, px(1050))
wheels(0.4, oc('gore', -0.2), 0.0026, px(1400))
# an ox can gore: G minor; it lowers its horns and lunges, the passer-by steps back, the owner hauls the rope; it tosses its head: A
stab, again = ow('gore', 'stabbing'), ow('gore', 'may gore again')
chord(Gm, oc('gore', -0.3), again - 0.2, 0.7)
chord(A_, again - 0.05, END('ox', 'gore') + 0.3, 0.65)
snort(stab - 0.3, 0.007, px(820)); hoof(stab - 0.25, 0.006, px(760)); hoof(stab - 0.05, 0.005, px(700))
step(stab + 0.05, 0.007, px(1230)); step(stab + 0.38, 0.006, px(1290))
rope(stab + 0.5, 0.008, px(450))
snort(again + 0.05, 0.006, px(840)); hoof(again + 0.1, 0.005, px(720))
# the street emptied: people hurrying past to something out of frame; the family at their door; the field left half-ploughed
fam, work = ow('kills', 'his family'), ow('kills', 'the work')
chord(Dm, oc('kills', -0.25), fam - 0.15, 0.65)
chord(Bb, fam + 0.05, work - 0.05, 0.6)
chord(Gm, work + 0.15, END('ox', 'kills') + 0.35, 0.55)
for k, pn in ((0.0, px(760)), (0.12, px(1020))):
    steps(oc('kills', -0.2) + k, fam - 0.3, 0.25, 0.005, pn)
air(work + 0.6, 1.6, 0.005, px(1100))
# the ox can't be asked why: it chews, calm, and a man lifts his hands to it; it can't pay: a balance hangs empty beside it
pay = ow('why', "It can't pay")
chord(Dm, oc('why', -0.25), pay - 0.1, 0.6)
chord(Gm, pay + 0.1, END('ox', 'why') + 0.2, 0.55)
rustle(oc('why', 0.2), 0.005, px(1250)); creak(pay + 0.1, 0.5, 0.005, px(1640), 190, 160)
# someone has to answer for it: the neighbours turn, one by one, to the temple; the stone's call, and nothing answers: a hollow chord, held
for i, xx in enumerate((520, 640, 780, 960, 1120)):
    rustle(oc('answer', 0.1 + 0.32 * i), 0.0045, px(xx), 0.35)
call(ow('answer', 'answer', 0.0))
chord(HOLLOW, ow('answer', 'answer', 0.75), oc('stone', -0.35), 0.6, att=0.6, rel=0.4)
# King Hammurabi's stone: the melodica answers for the first time, falling home in D minor; then its sixth, as anyone wronged can learn
# where they stand
answer(oc('stone', -0.25), (F4, E4, D4), 2.6, (D3, A3))
chord(Bb, oc('stone', 3.4), END('ox', 'stone') + 0.2, 0.55)
# the law: if the owner was warned, and didn't blunt its horns or keep it tied up: G minor, B flat, and A, the condition left open
wb, wt = ow('warned', 'blunt'), ow('warned', 'tied up')
chord(Gm, oc('warned', -0.25), wb - 0.2, 0.6)
chord(Bb, wb - 0.05, wt - 0.15, 0.6)
chord(A_, wt, END('ox', 'warned') + 0.15, 0.6)
# the owner pays thirty shekels of silver: D minor; the coils laid on the pan one by one, and the beam settling level; then its sixth
th = ow('pays', 'thirty')
chord(Dm, oc('pays', 0.1), th - 0.75, 0.6)
chord(Bb, th + 0.6, END('ox', 'pays') + 0.3, 0.55)
for i in range(9):
    silver(th - 0.7 + i * 0.1 + 0.25, 0.006 - 0.0002 * i, px(800 + (i % 3 - 1) * 40))
creak(th - 0.05, 0.55, 0.006, px(960), 170, 140)
# nearly three years of a hired worker's pay: his hoe strikes the earth, stroke by stroke, as three suns cross the sky
chord(Gm, oc('wage', -0.25), oc('wage', 1.4), 0.55)
chord(Dm, oc('wage', 1.6), END('ox', 'wage') + 0.3, 0.55)
for n_ in range(4):
    hoe(oc('wage', n_ / 0.85), 0.006, px(1000))
# so an owner knew what to do: he rasps the horn's tips round, walks to the post and ties the rope; the chords move to F major
kb, kt, ka = ow('knew', 'blunt'), ow('knew', 'keep it'), ow('knew', 'or answer')
chord(Bb, oc('knew', -0.25), kt - 0.2, 0.6)
FMAJ[0] = True
chord(C_, kt - 0.05, ka - 0.15, 0.6)
chord(F_, ka, END('ox', 'knew') + 0.6, 0.65)
rasp(kb - 0.1, max(1, int((kt - 0.4 - (kb - 0.1)) * 2.2)), 0.005, px(830))
steps(kt - 0.2, kt + 0.6, 0.45, 0.006, px(1300))
rope(kt + 0.4, 0.008, px(1180))
# and a family knew that someone would answer for their loss: D minor, then B flat, as she nods
chord(Dm, oc('family', -0.25), ow('family', 'answer', -0.15), 0.55)
chord(Bb, ow('family', 'answer', 0.05), END('ox', 'family') + 0.25, 0.55)
# the ox still did the heavy work: the field again, the plough in the earth; the stone's call, and as a person answered for it, the
# melodica's answer, home in F, with the chord under it
st0 = oc('still', -0.3)
call(st0 + 0.05, C4, G4)
answer(ow('still', 'a person answered'), (A4, G4, F4), 2.3, (F3, C4))
scrape(st0, oc('same', 1.6) - st0, 0.004, px(620))
hooves(st0 + 0.2, oc('same', 1.4), st0, 2.2, 0.004, px(900))
# the same with an agent: the field becomes a picture on the lab's wall; Jun beside the agent; then the team, and the count's tick. The
# B-flat chord holds from "a person must" to "stand behind" (since 4 November 2026; it was struck again for the team, 2.6 s later)
must, team, stand = ow('same', 'a person must'), ow('behind', 'a team'), ow('behind', 'stand behind')
air(oc('same', -0.2), 1.3, 0.006, 0.0)
chord(Dm, oc('same', 0.15), must - 0.2, 0.55)
chord(Bb, must - 0.05, stand - 0.15, 0.55)
step(must - 0.1, 0.006, px(330), 'oak'); step(must + 0.3, 0.005, px(330), 'oak')
for i, xx in enumerate((170, 650, 860)):
    step(team - 0.1 + i * 0.3, 0.005, px(xx), 'oak'); step(team + 0.3 + i * 0.3, 0.004, px(xx), 'oak')
chord(C_, stand, END('ox', 'behind') + 0.15, 0.55)
knock(stand + 0.05, 0.010, px(1510), 260); tick(stand + 0.45, 0.008, px(1510))
# the title holds the answer's last note: F, over its chord
chord((F3, C4, F4), END('ox', 'behind') + 0.35, oc('breath', 5.3), 0.52, att=0.5, rel=0.9)

# 2. A strong helper: the title's F lets go as the lab comes back. The agent's steps race round: its hands on the tools, a flurry of
#    soft taps. At two last night: the stone alone, lower and slower, and the clock's tick; the count fails, a low knock; the plain rerun,
#    a breath round; it fails too; the note slid in. By morning, the fix in the test copy, and its tick. Yusuf comes in; the two bubbles;
#    Jun turns. "If its fix is wrong, who answers?": the stone's call, in F, and nothing answers
hw = lambda lid, word, off=0: W('helper', lid, word, off)
hc = lambda lid, off=0: G('helper', lid, off)
h0 = S0('helper')
for i in range(3):
    tap(h0 + 0.5 + 0.3 * i, 0.005, px(1500))
fa = hw('fast', 'faster')
keys(fa - 0.2, 16, 0.005, px(1450), 0.14)
air(fa, 1.4, 0.005, px(1120))
# the night: the stone alone, lower and slower; the clock at 02:00
night(hc('two', -0.35))
clock(hc('two', 0.05), 0.010, px(1390))
failed, reports, reruns, too, make = hw('two', 'failed'), hw('two', 'reports'), hw('rerun', 'reruns'), hw('rerun', 'failed too'), hw('rerun', 'make the checks pass')
knock(failed + 0.05, 0.009, px(1620), 170)
paper(reports + 0.1, 0.006, px(1700), 0.25)
air(reruns, 0.9, 0.006, px(1620), 200, 1000)
knock(too + 0.05, 0.009, px(1620), 165)
slide(make, 0.6, 0.007, px(700)); paper(make + 0.45, 0.006, px(700))
# by morning: the agent's fix, laid in the test copy; its checks pass
fix, passed = hw('morning', 'a fix'), hw('morning', 'the checks passed')
paper(fix + 0.1, 0.007, px(1440)); knock(fix + 0.2, 0.008, px(670), 250)
tick(passed + 0.25, 0.008, px(670))
# Jun asks Yusuf: Yusuf comes in from the left; the two bubbles; Jun turns to the agent
steps(hc('asks', -0.35), hc('asks', 0.5), 0.42, 0.005, px(240), 'oak')
could, ifw, whoA = hw('asks', 'could it'), hw('who', 'If its fix'), hw('who', 'who answers')
knock(could - 0.1, 0.007, px(860), 300); knock(ifw, 0.007, px(350), 300)
rustle(whoA + 0.3, 0.005, px(650))
# who answers? The stone's call, and nothing answers
call(END('helper', 'who') + 0.3, C4, G4)

# 3. Values we can't read: D minor at the turn. Jun opens the fix: its card, and the count's; 37 students gone, the count rolling down,
#    and one low melodica note, held, and silence after it. The 37 on the calendar step away; they still count. The ox chewing, out of
#    doors; the agent's band brightening; what it learned from, three breaths flowing in; billions of numbers, the lens passing. Jun
#    tries again: the two notes slid in, the agent's bubbles, the draft in the test copy; the count outlined in amber
FMAJ[0] = False
vw = lambda lid, word, off=0: W('values', lid, word, off)
vc = lambda lid, off=0: G('values', lid, off)
v0 = S0('values')
chord(Dm, v0 - 0.9, v0 + 0.35, 0.6, att=0.4)
chord(Bb, v0 + 0.55, vc('opens', 0.3), 0.5, rel=0.6)
knock(v0 + 0.55, 0.009, px(890), 250); knock(v0 + 0.8, 0.009, px(1540), 250)
gone = vw('opens', 'students are gone')
knock(gone - 0.25, 0.008, px(890), 190)
for i in range(8):
    tap(gone + 0.05 + 0.15 * i, 0.004, px(1540))
melo(D3, gone + 0.1, gone + 2.7, 0.85, att=0.25, rel=0.9)
tick(vc('opens', 0.85), 0.007, px(890))
wd = vw('opens', 'withdrew')
paper(wd - 0.45, 0.006, px(1230), 0.35); rustle(wd + 0.1, 0.005, px(1500), 1.2)
rustle(vc('count', 0.1), 0.005, px(1000), 0.9)
air(vc('nox', -0.2), 1.2, 0.004, 0.0)
does = vw('nox', 'An agent does')
air(does - 0.1, 1.0, 0.005, px(1124), 120, 700)
for wd_ in ('what people wrote', 'ratings', 'principles'):
    air(vw('learned', wd_, -0.2), 1.0, 0.005, px(1400))
bil, nob, noe = vw('numbers', 'billions'), vw('numbers', 'nobody'), vw('numbers', 'not even')
air(vc('numbers', -0.3), 1.2, 0.006, 0.0, 120, 800)
slide(bil - 0.3, 0.7, 0.004, px(720)); slide(nob - 0.2, 0.8, 0.004, px(1000)); slide(noe - 0.2, 0.5, 0.004, px(1120))
why, stops, removes, no_ = vw('again', 'Asked why'), vw('again', 'it stops'), vw('pass', 'it removes them'), vw('knows', 'it says no')
slide(why - 0.4, 0.5, 0.006, px(720)); knock(stops + 0.05, 0.007, px(1550), 300)
slide(vc('pass', -0.1), 0.5, 0.006, px(720)); knock(removes + 0.05, 0.007, px(1530), 300); paper(removes + 0.1, 0.006, px(1440))
knock(vc('knows', 0.05), 0.007, px(720), 300); knock(no_ + 0.05, 0.007, px(1450), 300)
keeps = vw('help', 'keeps the count right')
knock(keeps - 0.35, 0.008, px(1625), 250); knock(keeps + 0.05, 0.008, px(1625), 170)

# 4. Sorry isn't answering: G minor to F at the turn. The apology's bubble; three cards come down in a row; what it says, and the paths
#    in the field of numbers; three empty places; the promise fades as day turns to night and back, and the team's memory is written on
#    its card; the law's card, and its tag. Like the ox's owner: the picture; and as "answers for it" appears beside Jun, the melodica
#    answers, home in F: the question of chapter 2, answered
sw = lambda lid, word, off=0: W('sorry', lid, word, off)
sc_ = lambda lid, off=0: G('sorry', lid, off)
s0 = S0('sorry')
chord(Gm, s0 - 1.6, s0 - 0.25, 0.48, att=0.4)
FMAJ[0] = True
chord(F_, s0 - 0.05, sc_('says', 0.15), 0.48, rel=0.6)
sorry_ = sw('says', 'sorry')
knock(sorry_ - 0.25, 0.007, px(1550), 300)
takes = sw('more', 'takes more')
for i in range(3):
    knock(takes - 0.2 + i * 0.18 + 0.35, 0.008, px([356, 960, 1564][i]), 250)
knock(sc_('explain', -0.25), 0.007, px(480), 260)
air(sw('explain', 'can explain'), 1.0, 0.004, px(1250)); air(sw('explain', "isn't always", -0.2), 1.0, 0.004, px(1250))
tap(sw('explain', "isn't always", 0.45), 0.006, px(1250))
for wd_, xx in (('no pay', 700), ('no job', 960), ('no name', 1220)):
    knock(sw('follows', wd_, -0.1), 0.006, px(xx), 320)
unless = sw('promise', 'unless')
knock(unless - 0.1, 0.007, px(426), 250); pencil(unless + 0.1, 2.3, 0.006, px(426)); air(unless + 0.4, 0.8, 0.004, px(700))
knock(sc_('law', -0.05), 0.008, px(960), 250); tap(sw('law', 'sued'), 0.006, px(1250))
air(sc_('owner', -0.3), 1.4, 0.005, 0.0)
hooves(sc_('owner', -0.2), sw('owner', 'Here', -0.8), sc_('owner', -1.0), 2.2, 0.003, px(400))
here = sw('owner', 'Here')
answer(here + 0.2, (A4, G4, F4), 1.5, (F3, C4), 0.72)

# 5. Whoever holds the rope: the answer's F becomes D minor's third, and A, at the turn. The owner leads the ox, and another hand takes
#    the rope: it follows just the same. Jun's note goes into the ring. A hidden line: the message lands, the line picked out, a thread
#    drawn to the agent. The key slides to a gloved hand, and the tools answer it. 2025: the card. The attackers' small tasks, each one
#    ticked. Its speed: the counter races, the film's one urgent sound, and stops dead as they're shut out, a lock. In the wrong hands:
#    the stranger leads the ox away
FMAJ[0] = False
rw = lambda lid, word, off=0: W('rope', lid, word, off)
rc = lambda lid, off=0: G('rope', lid, off)
r0 = S0('rope')
chord((D3, A3), r0 - 0.45, r0 + 0.6, 0.5, att=0.4)
chord(A_, r0 + 0.75, rc('pulls', 0.2), 0.45, rel=0.6)
holds = rw('pulls', 'whoever holds')
hooves(r0 + 0.1, holds + 0.2, r0 - 1.0, 2.2, 0.0045, px(700))
steps(r0 + 0.1, holds + 0.2, 1.0, 0.004, px(1200), u0=r0 - 1.0)
rope(holds + 0.3, 0.008, px(1100))
hooves(holds + 0.25, rw('pulls', 'An agent works', -0.3), holds - 1.5, 2.2, 0.0045, px(700))
steps(holds + 0.25, rw('pulls', 'An agent works', -0.3), 1.0, 0.004, px(1200), u0=holds - 1.5)
words = rw('pulls', 'gives it words')
paper(rw('pulls', 'An agent works'), 0.006, px(700)); air(words, 1.2, 0.005, px(900))
tap(rc('jun', 0.35), 0.006, px(1124))
hid, steer, tell = rw('hidden', 'hidden'), rw('hidden', 'steer'), rw('hidden', "can't always tell")
paper(rc('hidden', 0.0), 0.007, px(430)); tap(hid + 0.4, 0.006, px(430))
air(steer - 0.3, 1.1, 0.005, px(780)); air(tell, 0.9, 0.004, px(430))
steals, rights = rw('key', 'steals'), rw('key', 'gets its rights')
air(steals - 0.5, 0.8, 0.005, px(80)); slide(steals + 0.1, 0.9, 0.006, px(250)); keyring(steals + 0.9, 0.008, px(120))
for i in range(3):
    tap(rights + 0.1 * i, 0.006, px(1500))
knock(rc('y2025', 0.1), 0.008, px(960), 250); tap(rw('y2025', 'most of the work', 0.2), 0.006, px(960))
testing, small = rw('told', 'testing defences'), rw('told', 'one small')
knock(testing - 0.4, 0.007, px(306), 300)
for i in range(7):
    t0 = small - 0.3 + i * 0.7
    tap(t0 + 0.1, 0.004, px(560)); tick(t0 + 0.85, 0.005, px(780)); tap(t0 + 1.5, 0.003, px(1000))
speed, often, shut_ = rw('tricked', 'its speed'), rw('tricked', 'often'), rw('caught', 'shut')
knock(speed - 0.3, 0.007, px(660), 250)
clicks(speed, shut_, 1.6, 0.010, px(660))
tap(often + 0.1, 0.005, px(660))
air(shut_, 0.9, 0.005, px(100)); lock(shut_ + 0.35, 0.009, px(660))
wr0 = rc('wrong', -0.3)
hooves(wr0 + 0.1, E('rope') - 0.3, rc('wrong') - 5, 2.2, 0.0045, px(900))
steps(wr0 + 0.1, E('rope') - 0.4, 1.0, 0.004, px(1400), u0=rc('wrong') - 5)

# 6. An ox untied: D minor at the turn, the unease of an agent that strays. The ox wanders off, its loose rope. Jun's note. It reaches onto
#    the open web and pushes at other universities' locked pages: the reach stretches out, one low melodica note held, and the page stays
#    locked. Three plain notes. The 2026 card, its two tags. The makers' guidelines. Out of doors again, the untied ox, and the stone's call
#    left open, a question carried into the next chapter. No urgent sound here: nothing is racing
tw = lambda lid, word, off=0: W('stray', lid, word, off)
tc = lambda lid, off=0: G('stray', lid, off)
t0_ = S0('stray')
chord(Dm, t0_ - 1.0, t0_ + 0.4, 0.5, att=0.4)
hooves(t0_ + 0.1, tc('compare', -0.5), t0_ - 0.5, 2.2, 0.0045, px(760))
steps(t0_ + 0.1, tc('compare', -0.5), 1.0, 0.004, px(900), u0=t0_ - 0.5)
rope(t0_ + 0.35, 0.007, px(320))
paper(tc('compare', 0.0), 0.006, px(540)); tap(tc('compare', 0.5), 0.005, px(1124))
webr, push = tw('web', 'the open web'), tw('web', 'pushed at the pages')
air(webr - 0.2, 1.2, 0.005, px(1124))
melo(D3, push, push + 2.4, 0.8, att=0.25, rel=0.9)
lock(push + 0.35, 0.007, px(560))
for wd_ in ('No one told it', "didn't know", 'only wanted'):
    tap(tw('blind', wd_, 0.05), 0.005, px(1360))
knock(tc('y2026', 0.1), 0.008, px(960), 250)
tap(tw('y2026', 'broke out', 0.1), 0.006, px(700)); tap(tw('y2026b', "another company's", 0.1), 0.006, px(1150))
paper(tc('held', 0.0), 0.006, px(470)); keys(tc('held', 0.6), 4, 0.004, px(600), 0.14)
tap(tw('heldb', "don't always hold", 0.0), 0.005, px(770))
cross = tw('fence', "a fence it can't cross")
hooves(tc('fence', -0.2), E('stray') - 0.3, tc('fence') - 2.4, 2.2, 0.0045, px(760))
steps(tc('fence', -0.2), E('stray') - 0.4, 1.0, 0.004, px(1100), u0=tc('fence') - 2.4)
call(cross + 0.2, A3, E4, 0.9)

# 7. Blunt the horns: G minor to B flat at the turn. Four warnings pinned on the wall; the elder, out of doors. Excessive agency: its card
#    and three lines. The owner rasps the horn tips round; in the lab the tools' locks close, the names masked on their way, the hand
#    only into the test copy. The rail rises round it; night; the agreed job. The gate: Jun's stamp, a second person's; Jun's own change
#    through the same gate, its halves opening and closing. The agent's hand toward the stamp, and the place greyed for it. Europe's
#    card. The log typed out; each Stop button, in turn
bw = lambda lid, word, off=0: W('horns', lid, word, off)
bc = lambda lid, off=0: G('horns', lid, off)
b0 = S0('horns')
chord(Gm, b0 - 1.6, b0 - 0.2, 0.55, att=0.4)
chord(Bb, b0 + 0.0, bc('warned', 0.25), 0.5, rel=0.6)
for i, xx in enumerate((210, 590, 260, 640)):
    pin(b0 + 0.3 + i * 0.3 + 0.15, 0.009, px(xx))
air(bw('warned', "as the ox's owner", -0.2), 1.0, 0.004, 0.0)
knock(bw('agency', 'excessive agency', -0.15), 0.008, px(446), 250)
for wd_ in ('more tools', 'rights', 'freedom'):
    tap(bw('agency', wd_, 0.05), 0.005, px(446))
rd = bw('blunt', 'only read')
r_0 = bc('blunt', -0.3)
rasp(r_0 + 0.2, max(1, int((rd - 0.5 - r_0) * 2.2)), 0.005, px(860))
for i in range(3):
    lock(rd + 0.05 + 0.12 * i, 0.007, px(1500))
nm, dr = bw('bluntb', 'never sees'), bw('bluntb', 'writes only drafts')
paper(nm - 0.3, 0.006, px(300)); keys(nm + 0.1, 6, 0.004, px(400), 0.2)
knock(dr - 0.2, 0.007, px(1440), 220); air(dr, 0.9, 0.005, px(1350)); paper(dr + 0.75, 0.006, px(1440))
tu, ag_, rp = bw('tied', 'tied up'), bw('tied', 'the agreed job'), bw('tied', 'and report')
rail(tu - 0.1, 1.0, 0.007, px(1440))
knock(ag_ - 0.15, 0.007, px(416), 250); tick(rp + 0.1, 0.007, px(416))
rv, sp2, any_ = bw('nothing', 'Jun reviews'), bw('nothing', 'a second person'), bw('nothing', "anyone's change")
stamp(rv + 0.15, 0.012, px(880)); stamp(sp2 + 0.45, 0.012, px(1200))
tap(any_ - 0.35, 0.005, px(760)); gate(any_, 0.007, px(1040)); shut(any_ + 1.5, 0.007, px(1040))
nv = bw('never', 'never approves')
air(bc('never', 0.0), 0.9, 0.005, px(900)); knock(nv + 0.05, 0.007, px(1190), 150)
knock(bc('europe', 0.05), 0.008, px(960), 250)
for wd_ in ('understand', 'watch them', 'can stop'):
    tap(bw('europe', wd_, 0.05), 0.005, px(960))
knock(bc('team', 0.0), 0.008, px(960), 250)
sees, anyT = bw('team', 'Jun sees'), bw('team', 'anyone on the team')
for i in range(4):
    keys(sees + 0.5 * i, 3, 0.004, px(700), 0.09)
for i, xx in enumerate((432, 788, 1144, 1500)):
    tap(anyT + i * 0.45 + 0.1, 0.007, px(xx))

# 8. A person answers: the night at the turn, the stone alone, lower and slower; the clock; the count fails again; the agent's hand into
#    the test copy. Morning: Jun, the report and its lines. Mei's bubble, "They count". The stamps, Jun's and Noor's; the gate opens, the
#    fix goes live, the count's tick, the three names. In Babylon: out of doors, the field. "The agent acts.": the stone's call; "A
#    person answers.": the melodica answers, home in D major. Through the night, and morning: the team, and the count's tick. The end
#    card holds the answer's last note, in D major
aw = lambda lid, word, off=0: W('answers', lid, word, off)
ac = lambda lid, off=0: G('answers', lid, off)
a0 = S0('answers')
night(a0 - 1.45)
clock(a0 + 0.45, 0.010, px(1390)); knock(a0 + 0.65, 0.008, px(1625), 250)
fails, alone = aw('again', 'fails again'), aw('again', 'alone')
knock(fails + 0.05, 0.009, px(1625), 165); air(alone - 0.3, 1.0, 0.005, px(1350))
knock(ac('report', 0.35), 0.008, px(1260), 250); step(ac('report', 0.4), 0.005, px(330), 'oak'); step(ac('report', 0.8), 0.004, px(330), 'oak')
for wd_ in ('the cause', 'a fix', 'the checks it ran', 'a question'):
    pencil(aw('report', wd_, 0.3), 0.6, 0.005, px(1260))
air(ac('mei', -0.3), 1.2, 0.004, px(700)); knock(aw('mei', 'they count', -0.05), 0.007, px(1460), 300)
stamp(aw('approve', 'Jun reviews', 0.25), 0.012, px(860)); stamp(aw('approve', 'Noor approves', 0.25), 0.012, px(1200))
sent = ac('sent')
gate(sent - 0.3, 0.007, px(1040)); air(sent, 1.6, 0.005, px(1000)); tick(sent + 1.4, 0.008, px(1635))
tap(aw('sent', 'government', 0.05), 0.005, px(1700))
for i, xx in enumerate((1490, 1635, 1780)):
    tap(aw('sent', 'people answer', 0.15 * i), 0.006, px(xx))
shut(aw('sent', 'people answer', 1.2), 0.006, px(1040))
air(ac('babylon', -0.3), 1.2, 0.004, 0.0)
ask_ = aw('babylon', 'It asked its owner')
scrape(ask_ - 0.3, ac('acts', 1.2) - ask_ + 0.3, 0.0035, px(620))
hooves(ask_ - 0.1, ac('acts', 1.0), ask_ - 2, 2.2, 0.0035, px(900))
# the agent acts, a person answers: the call, and the answer, home in D major
call(ac('acts', 0.05))
pa = aw('acts', 'A person answers')
answer(pa + 0.05, (Fs4, E4, D4), 2.4, (D3, A3))
air(pa + 0.9, 1.4, 0.005, 0.0)
# a team can let it work through the night, and stand behind the result: the morning, the team, and the count's tick
stand = aw('night', 'stand behind')
for i, xx in enumerate((170, 420, 650, 860)):
    step(stand - 0.2 + i * 0.2 + 0.2, 0.005, px(xx), 'oak')
knock(stand + 0.05, 0.009, px(1510), 260); tick(stand + 0.45, 0.008, px(1510))
# the end card: the answer's last note, D, held over its chord
end = ac('breath')
chord((D3, A3, D4, Fs4), end + 0.2, TOT - 0.2, 0.45, att=0.7, rel=1.2)
# and nothing, music or effect, above about 2.5 kHz
soften(2500)
