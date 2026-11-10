# Kept, not cleaned: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette is this film's own (PLAYBOOK.md: vary the sound itself, film to film; the series' reed organs, viols, strings, choir,
# pianos, harps and glass are left to the films that have them), and it keeps what the series carries from film to film:
#  - The music is a choir of flutes, from a contrabass flute up, one player on each note, held steady: each chord comes in player by
#    player, low to high. As the series decided on 20 October 2026, after the author's review, it plays under the opening, where
#    Dujiangyan's story is told, and after that only from time to time, never as a bed under the voice: at a chapter's turn, blooming
#    in the pause and fading under the first words; in the wordless moment on the five gauges; and on the end card, after the last
#    line, the high flutes coming in last. Three chapters open without a chord, so that music stays under half of each: Past its
#    limit, which has its iron bar; On the scorecard, which has its three notes; and Kept, which opens on the person's notes.
#  - A celesta is the roles, each on the note it has had since One person, many roles: student D, applicant E, researcher G, tutor A,
#    alumna the D above. A list's new value is on B, the one note the roles leave out.
#  - The cello, bowed, is the person, as in One person, many roles: whenever someone stands in white paper as one person, it plays the same D and the
#    A above it; when Daniel's two records are linked, it plays them too. The clarinet carries the series' mark (1-8-5-1), here on B flat
#    under the title, and on D on the end card.
#  - Each of the steward's measures is a tubular bell, its iron bar, struck softly as its gauge is lit, each on its own note. When the
#    oldest case goes past its limit, its bar is struck again; once the case is decided, once more, as its tick comes back.
# The film moves from G minor, at the river in the dry season, to D major, when the water is let back in; the closing chapter turns to G
# major once, as the series is seen as one part of data governance, and comes back to D on the end card. The effects are the river's
# and the paper's: the river itself, softly, while it's on screen; the water parting, draining and let back in; gravel rolling; the
# tripods' wooden poles set down and lifted; spades in gravel; the stone horse and the iron bars at the mark; a strip of paper
# unrolling; and on paper, a pencil, cards and sheets set down, stamps, muffled keys, and a gauge filling like a bottle.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. Where the picture repeats (the diggers' spades, the gravel going round, the stamps, the keys), the sound plays the
#    first round, and the second softer, and stops.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
#  - Nothing is tense, trembling or pulsing (the series, 20 October 2026): no urgent pulse, not even at the alert; no two voices a
#    little out of tune on one note, which beat on a phone's speaker; and only a slight vibrato. tools/quiet.py checks it, and that
#    after the opening no chapter has music for more than half its length, or for 12 seconds without a break.
# And everything stays low and soft: water, wood, paper, a pencil, low notes, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
P = lambda x: max(-0.85, min(0.85, (x - 960) / 960 * 0.9))  # where something is across the frame, as a pan
R9 = np.random.default_rng(9)  # this film's own randomness: the players' wavers, the gravel, the spades

# ---- the music's levels: the bed sits about 21 dB under the voice, as in the series' other films, and the notes over it a little less
BED, NOTE = 2.4, 1.5  # the flutes, low-passed, sit where film 1's bed does at this gain

# ---- the flute choir
# a flute is nearly a pure note, with a little of the octave above it, less the higher it plays, only a trace of the twelfth (more of
# it would beat with the fifth above, which equal temperament tunes a little flat), and air in the tone, more the lower the flute: a
# contrabass flute below C3, a bass flute below G3, an alto flute below C4, flutes above. One cycle of the wave is worked out for each
# pitch and read at the player's own pitch, so a chord of a dozen players costs little
FLUTES = ((48, 0.16, (1, 0.5, 0.04, 0.02)), (55, 0.11, (1, 0.4, 0.035, 0.015)), (60, 0.08, (1, 0.32, 0.03, 0.01)), (128, 0.055, (1, 0.24, 0.03, 0.01)))
_kind = lambda m: next(k for k in FLUTES if m < k[0])
_TB = {}
def _table(m):
    if m not in _TB:
        ph = np.arange(2048) / 2048 * 2 * np.pi; tb = sum(a * np.sin((k + 1) * ph + 0.7 * k) for k, a in enumerate(_kind(m)[2]))
        _TB[m] = (tb / np.abs(tb).max()).astype(np.float32)
    return _TB[m]
def _player(m, sec, on):
    """one flute holding one note steady from `on`: a slight vibrato that comes in late (more in the loudness than in the pitch, as a
    flute's does, and too slight to tremble), and air in the tone. Its phase is summed in double precision: summed in single
    precision, a held note's pitch slips by steps of about a hertz, and notes that should agree beat"""
    x = tt(sec); f = mf(m); rate, p0 = R9.uniform(4.8, 5.6), R9.uniform(0, 6.3)
    vd = np.clip((x - on - R9.uniform(0.8, 1.5)) / 1.0, 0, 1)
    vib = 0.0006 * np.sin(2 * np.pi * rate * x + p0) * vd
    ph = (np.cumsum(f * (1 + vib), dtype=np.float64) / SR * 2048) % 2048; i0 = ph.astype(np.int32); fr = (ph - i0).astype(np.float32); tb = _table(m)
    s = (tb[i0] * (1 - fr) + tb[(i0 + 1) % 2048] * fr) * (1 + 0.025 * np.sin(2 * np.pi * rate * x + p0 + 0.6) * vd)
    a = filt(noise(sec), 'band', (f * 0.8, min(f * 4, 2200))); s = s + _kind(m)[1] * 0.7 * a / (np.std(a) + 1e-9)
    return s
def _chiff(s, t0, f, g):
    """the breath catching as a flute speaks: a short puff of air a little above the note"""
    c = filt(noise(0.09), 'band', (min(f * 2, 1500), min(f * 6, 2300))); c = c / (np.std(c) + 1e-9) * np.exp(-tt(0.09) * 45) * g
    i = int(t0 * SR); k = min(len(c), len(s) - i)
    if k > 0:
        s[i:i + k] += c[:k]
def flutes(ch, start, sec, g=0.03, bloom=0.35, out=3.0):
    """a held chord on the flute choir: one player on each note, the lowest in the middle and the others taking turns on each side,
    coming in low to high a little after each other, each swelling at its own slow rate, and leaving over the last `out` seconds;
    nothing above about 1.8 kHz. With one player on a note, no two are a little out of tune on it, so nothing beats"""
    x = tt(sec); n = len(ch)
    for k, m in enumerate(ch):
        on = k * bloom
        e = np.clip((x - on) / 0.9, 0, 1) ** 1.3 * np.clip((sec - x) / out, 0, 1)
        sw = 1 + 0.08 * np.sin(2 * np.pi * R9.uniform(0.04, 0.09) * x + R9.uniform(0, 6.3))
        s = _player(m, sec, on) * e * sw; _chiff(s, on, mf(m), 0.18)
        put(filt((s * 1.41 / n).astype(np.float32), 'low', 1800), start, g * BED, 0.0 if k == 0 else (0.45 if k % 2 else -0.45))
def bed(keys, end, g=0.03):
    """chords one after another, each from its moment (a little early, so it has bloomed by then) until a little after the next one
    starts: under the opening"""
    for i, (t0, ch) in enumerate(keys):
        t1 = keys[i + 1][0] if i + 1 < len(keys) else end
        flutes(ch, t0 - 1.2, t1 - t0 + 3.6, g)
def turn(sid, ch, g=0.03):
    """a chapter's turn: its chord blooms in the pause after the last chapter's words, across the cut, and fades under its first words"""
    flutes(ch, S0(sid) - 1.6, 5.6, g, 0.25)

# ---- the series' instruments, as in film 1
def clarinet(m, start, sec, g=0.04, pan=0.0):
    """a soft clarinet: odd harmonics, a breath as it speaks, a slight vibrato that comes in late"""
    f = mf(m); x = tt(sec); vib = 1 + 0.0012 * np.sin(2 * np.pi * 5.0 * x) * np.clip((x - 0.35) / 0.5, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib, dtype=np.float64) / SR
    s = np.sin(ph) + 0.05 * np.sin(2 * ph) + 0.36 * np.sin(3 * ph) + 0.16 * np.sin(5 * ph) + 0.07 * np.sin(7 * ph)
    br = filt(noise(sec), 'band', (f * 0.9, f * 3)) * 0.12 * np.exp(-x * 6)
    put(norm(filt(((s + br) * env(sec, 0.09, min(0.35, sec * 0.4))).astype(np.float32), 'low', 2200)), start, g * NOTE, pan)
def cello(m, start, sec, g=0.03, pan=0.0):
    """a cello, bowed: slow to speak and slow to leave, with a slight vibrato"""
    f = mf(m); x = tt(sec); vib = 1 + 0.0015 * np.sin(2 * np.pi * 5.4 * x) * np.clip((x - 0.4) / 0.6, 0, 1)
    ph = 2 * np.pi * np.cumsum(f * vib, dtype=np.float64) / SR
    s = sum(np.sin(k * ph) * (1 / k) * np.exp(-0.22 * k) for k in range(1, 9)) + filt(noise(sec), 'band', (f, f * 5)) * 0.05
    put(norm(filt((s * env(sec, 0.45, min(1.2, sec * 0.45))).astype(np.float32), 'low', 1800)), start, g * NOTE, pan)
def person(s, g=0.026, pan=0.0):
    """the person: the bowed D, and the A above it, the same two notes wherever someone stands in white paper as one person. The A is
    tuned a pure fifth above the D, as a cellist tunes the two strings, so the D's third harmonic and the A's second don't beat"""
    cello(50, s, 3.2, g, pan); cello(50 + 12 * np.log2(1.5), s + 0.55, 2.6, g * 0.55, pan + 0.15)
def lowflute(m, s, sec, g=0.03, pan=0.0):
    """one flute of the choir alone, holding a note"""
    x = tt(sec); sig = _player(m, sec, 0.0) * np.clip(x / 0.5, 0, 1) * np.clip((sec - x) / 1.4, 0, 1)
    _chiff(sig, 0.0, mf(m), 0.18); put(norm(filt(sig.astype(np.float32), 'low', 1800)), s, g * NOTE, pan)
def mark(start, root=62, g=0.05):
    """the series' mark, 1-8-5-1, on the clarinet, over its root an octave down, held by one low flute of the choir"""
    for i, iv in enumerate([0, 12, 7, 0]):
        clarinet(root + iv, start + i * 0.42, 0.9 if i < 3 else 2.8, g * (1 if i == 0 else 0.85), (i - 1.5) * 0.1)
    lowflute(root - 12, start - 0.1, 4.2, g * 0.6)

# ---- this film's instruments
def cel(m, s, g=0.03, pan=0.0, sec=2.6):
    """a celesta, softly: a small steel bar struck by a felt hammer over its wooden resonator, so the note is nearly pure, with the bar's
    own ring above it, dying first; one note, not two a little apart, so it doesn't beat"""
    f = mf(m); x = tt(sec)
    sig = 1.25 * np.sin(2 * np.pi * f * x) * (0.65 * np.exp(-x * 1.7) + 0.35 * np.exp(-x * 0.6)) \
        + 0.1 * np.sin(2 * np.pi * f * 2 * x + 0.5) * np.exp(-x * 2.6) + 0.1 * np.sin(2 * np.pi * f * 2.76 * x + 2) * np.exp(-x * 5) \
        + 0.03 * np.sin(2 * np.pi * f * 5.4 * x) * np.exp(-x * 9)
    sig = (sig + 0.06 * filt(noise(sec), 'band', (700, 2200)) * np.exp(-x * 300)) * np.minimum(1, x / 0.003) * np.clip((sec - x) / 0.3, 0, 1)
    put(norm(filt(sig.astype(np.float32), 'low', 2400)), s, g * NOTE, pan)
ROLE = {'student': 50, 'applicant': 52, 'researcher': 55, 'tutor': 57, 'alumna': 62}
def role(r, s, g=0.03, pan=0.0):
    """a role, on the celesta: an octave above the note it has had since One person, many roles, where the celesta sings"""
    cel(ROLE[r] + 12, s, g, pan)
TUBE = ((1.0, 0.05, 5.0), (2.756, 0.12, 4.2), (5.404, 0.38, 3.4), (8.933, 1.0, 2.8), (13.344, 0.62, 1.9), (18.64, 0.36, 1.3), (24.81, 0.14, 0.8))
def ironbar(m, s, g=0.02, pan=0.0, sec=4.5):
    """a tubular bell, struck softly with a padded mallet: one of the steward's iron bars. A chime rings in a bar's modes (each ratio above,
    with its level and how long it rings); its note is heard an octave under the fourth mode, which the fifth and sixth fill out"""
    f1 = 2 * mf(m) / 8.933; x = tt(sec)
    sig = sum(a * np.sin(2 * np.pi * f1 * r * x + r) * np.exp(-x / d) for r, a, d in TUBE if f1 * r < 2400)
    sig = sig + 0.12 * filt(noise(sec), 'band', (250, 1400)) * np.exp(-x * 140)
    put(norm(filt((sig * np.minimum(1, x / 0.003) * np.clip((sec - x) / 0.6, 0, 1)).astype(np.float32), 'low', 2200)), s, g * NOTE, pan)

# ---- the river's sounds, all on the effects bus
def _sweep(sec, f0, f1, bw=0.5, n=10):
    """noise through a band that moves from f0 to f1 (Hz), in overlapping steps"""
    m = int(sec * SR); out = np.zeros(m, np.float32); L = max(2, int(2 * m / (n + 1))); hop = max(1, L // 2); w = np.hanning(L).astype(np.float32)
    src = noise(sec + 0.5)
    for i, a in enumerate(range(0, m, hop)):
        u = min(1, a / max(1, m - L)); fc = f0 * (f1 / f0) ** u; seg = filt(src[a:a + L], 'band', (fc * (1 - bw / 2), fc * (1 + bw / 2)))
        k = min(len(seg), m - a); out[a:a + k] += seg[:k] * w[:k]
    return out
def river(s0, s1, keys, g=0.03):
    """the river, softly, while it's on screen: a low rush, water burbling over it at uneven moments, and a level that follows the
    picture (keys: (time, level), between them a straight line): close on the split, lower under the paper, back up as the water comes"""
    sec = s1 - s0; x = tt(sec); lv = np.interp(x + s0, [k[0] for k in keys], [k[1] for k in keys]).astype(np.float32)
    e = (lv * np.clip(x / 2.0, 0, 1) * np.clip((sec - x) / 2.5, 0, 1)).astype(np.float32)
    for side in (-0.6, 0.6):
        low = filt(noise(sec), 'band', (80, 420)) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.07 * x + side * 4))
        bb = filt(noise(sec), 'low', 7); bb = np.exp(0.7 * bb / (np.std(bb) + 1e-9)); bb = np.minimum(bb / bb.mean(), 3.0)
        wat = filt(noise(sec), 'band', (300, 1500)) * bb
        X(filt(((0.9 * low + 0.5 * wat) * e).astype(np.float32), 'low', 1800), s0, g, side)
def rush(s, sec=2.4, g=0.03, pan=0.0):
    """water coming: a swell of the river, rising and settling"""
    x = tt(sec); e = np.clip(x / (sec * 0.35), 0, 1) ** 1.5 * np.clip((sec - x) / (sec * 0.6), 0, 1)
    for side in (-0.4, 0.4):
        X(filt((filt(noise(sec), 'band', (150, 1300)) * e).astype(np.float32), 'low', 1600), s, g, pan + side)
def drain(s, sec=1.8, g=0.03, pan=0.0):
    """water going: the channel's water drawing away, its sound sinking and thinning"""
    x = tt(sec); X(filt((_sweep(sec, 900, 260) * np.clip(x / 0.3, 0, 1) * np.clip((sec - x) / (sec * 0.8), 0, 1)).astype(np.float32), 'low', 1600), s, g, pan)
def trickle(s, sec=1.6, g=0.012, pan=0.0):
    """water running into the small canals: a thin, quick burble"""
    x = tt(sec); bb = filt(noise(sec), 'low', 14); bb = np.exp(0.9 * bb / (np.std(bb) + 1e-9)); bb = np.minimum(bb / bb.mean(), 3.0)
    X(filt((filt(noise(sec), 'band', (500, 1700)) * bb * np.sin(np.pi * x / sec) ** 2).astype(np.float32), 'low', 2000), s, g, pan)
def fill(s, sec=1.2, up=True, g=0.016, pan=0.0):
    """a gauge's level going up or down, like water poured into a bottle: a resonance rising as it fills, falling as it empties"""
    x = tt(sec); bb = filt(noise(sec), 'low', 10); bb = np.exp(0.6 * bb / (np.std(bb) + 1e-9)); bb = np.minimum(bb / bb.mean(), 3.0)
    sig = _sweep(sec, 320, 980, 0.18, 14) if up else _sweep(sec, 980, 320, 0.18, 14)
    X(filt((sig * bb * np.sin(np.pi * x / sec) ** 0.8).astype(np.float32), 'low', 2000), s, g, pan)
def gravel(s0, sec, g=0.01, rate=12, pan=0.0):
    """small stones knocking as the river rolls them: a patter at uneven moments, fading as it goes"""
    t0 = 0.0
    while t0 < sec:
        f = R9.uniform(650, 1800); d = 0.05; x = tt(d); a = R9.uniform(0.4, 1.0) * np.clip((sec - t0) / (sec * 0.5), 0, 1)
        X(norm(filt((np.sin(2 * np.pi * f * x) * np.exp(-x * 110) + 0.3 * noise(d) * np.exp(-x * 160)).astype(np.float32), 'low', 2200)), s0 + t0, g * a,
          pan + R9.uniform(-0.3, 0.3))
        t0 += R9.exponential(1 / rate)
def crunch(s, g=0.014, pan=0.0):
    """a spade going into gravel: a short grinding crunch over a low push"""
    sec = 0.22; x = tt(sec); gr = np.zeros_like(x)
    for _ in range(12):
        i = int(R9.uniform(0, 0.14) * SR); gr[i:] += R9.uniform(0.3, 1) * np.exp(-x[:len(x) - i] * 70)
    sig = filt(noise(sec), 'band', (260, 1800)) * gr * 0.7 + np.sin(2 * np.pi * 85 * x) * np.exp(-x * 28)
    X(norm(filt(sig.astype(np.float32), 'low', 2000)), s, g, pan)
def clank(s, g=0.02, pan=0.0, f=170):
    """iron bars set down at the mark: a dull metal knock, its ring kept low"""
    x = tt(1.2); sig = sum(a * np.sin(2 * np.pi * f * r * x + r) * np.exp(-x / d) for r, a, d in ((1.0, 1.0, 0.32), (2.76, 0.45, 0.16), (5.4, 0.15, 0.07)))
    sig = sig + 0.3 * filt(noise(1.2), 'band', (300, 1600)) * np.exp(-x * 80)
    X(norm(filt((sig * np.minimum(1, x / 0.002)).astype(np.float32), 'low', 2000)), s, g, pan)
def thump(s, g=0.03, pan=0.0):
    """stone, found in the bed: a low knock with grit in it"""
    x = tt(0.5); sig = np.sin(2 * np.pi * 105 * x) * np.exp(-x * 16) + 0.5 * filt(noise(0.5), 'band', (250, 1200)) * np.exp(-x * 30)
    X(norm(filt(sig.astype(np.float32), 'low', 1500)), s, g, pan)
def unroll(s, sec=1.6, g=0.02, pan=0.0):
    """a strip of paper unrolling: a soft rustle that flutters with the roll's turns, and the roll coming to rest"""
    x = tt(sec); fl = 0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 5.5 * x * (1 - 0.3 * x / sec)))
    X(filt(noise(sec), 'band', (300, 2000)) * fl * np.clip(x / 0.15, 0, 1) * np.clip((sec - x) / 0.4, 0, 1), s, g, pan); s_knock(s + sec - 0.05, g * 0.6, pan, 180)

# ---- the paper's sounds, as in film 1
def quill(s, sec=0.6, g=0.016, pan=0.0):
    """a pencil writing: a soft scratch that flutters with the strokes"""
    x = tt(sec); fl = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * 7.5 * x + 3 * np.sin(2 * np.pi * 1.3 * x)))
    X(filt(noise(sec), 'band', (700, 2300)) * fl * np.sin(np.pi * x / sec) ** 0.6, s, g, pan)
def tick_(s, g=0.016, pan=0.0):
    """a pencil tick: two short strokes"""
    quill(s, 0.1, g, pan); quill(s + 0.09, 0.16, g * 0.8, pan)
def cross(s, g=0.016, pan=0.0):
    """a pencil cross: two strokes, one after the other"""
    quill(s, 0.14, g, pan); quill(s + 0.2, 0.14, g, pan)
def ring(s, sec=0.8, g=0.016, pan=0.0):
    """a pencil drawn round something: a scratch that swells once round and lifts"""
    x = tt(sec); X(filt(noise(sec), 'band', (600, 2000)) * np.sin(np.pi * x / sec) * (0.7 + 0.3 * np.sin(2 * np.pi * x / sec * 2)), s, g, pan)
def paper(s, g=0.03, pan=0.0, sec=0.45):
    """paper, softly: a card or a sheet picked up or set down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def brush(s, g=0.022, pan=0.0, sec=0.8):
    """a wet brush across the paper: a low, soft swish"""
    x = tt(sec); X(filt(noise(sec), 'band', (180, 1200)) * np.sin(np.pi * x / sec) ** 2 * (1 + 0.3 * np.sin(2 * np.pi * 3 * x)), s, g, pan)
def knock(s, g=0.02, pan=0.0, f=240):
    """a soft wooden knock: a card or a tag set down"""
    s_knock(s, g, pan, f)
def typing(s, sec, g=0.012, pan=0.0, n=5):
    """a few muffled keys, while something is typed in"""
    for k in range(n):
        s_tap(s + k * sec / n + R9.uniform(-0.03, 0.03), g * (0.75 + 0.25 * (k % 2)), pan)
def air(s, sec=0.7, g=0.018, pan=0.0):
    """a breath of air: a line drawn, a card sliding"""
    s_air(s, sec, g, pan, 160, 1000)
def stamp(s, g=0.06, pan=0.0):
    """a stamp: a low thud and a knock, nothing bright"""
    thud(s, g); s_knock(s + 0.01, g * 0.4, pan, 200)

# chords (MIDI note numbers), low to high, voiced for the flutes; the last opens upward, the high flutes coming in above
GM9 = [43, 50, 55, 58, 62, 69]; EBMAJ9 = [39, 46, 55, 58, 62, 65]; CM9 = [36, 43, 51, 55, 58, 62]; D7SUS = [38, 45, 50, 55, 57, 60]
D7 = [38, 45, 54, 57, 60, 62]; EBMAJ7 = [39, 46, 50, 55, 58]; F69 = [41, 48, 55, 57, 60, 62]; BBMAJ9 = [46, 53, 57, 60, 62, 65]
FMAJ9 = [41, 48, 52, 55, 57, 64]; DM9 = [38, 45, 50, 53, 57, 64]; CMAJ9 = [36, 43, 52, 55, 59, 62]; E7SUS4 = [40, 47, 52, 57, 62]
DMAJ9_OPEN = [38, 45, 54, 57, 61, 64, 69, 76]; GMAJ9 = [43, 50, 59, 62, 66, 69]


# 1. Kept, every dry season: G minor. The river, softly, closer on the split; the water parting as it's split in two; the gravel rolling
#    down the outer channel; in the dry season, the tripods set down across the inner channel, its water draining, the spades going
#    into its bed; the cut through the bed, set down over the valley: spades, the stone horse found, the iron bars set at the mark,
#    the pencil line down to it; the rule unrolling; the tripods lifted and the water let back in, running out into the canals, and
#    the land greening; the series' mark under the title, in B flat
J = 'river'; B = C(J, 'breath')
tMin, tTwo, tPl = W(J, 'split', 'Min River'), W(J, 'split', 'in two'), W(J, 'split', 'Chengdu plain')
tG, tD, tEv, tCl, tDug = C(J, 'gravel'), C(J, 'dry'), W(J, 'dry', 'every dry season'), W(J, 'dry', 'closed off'), W(J, 'dry', 'dug out')
tM, tIr, tR, tSix, tDig = C(J, 'mark'), W(J, 'mark', 'iron bars'), C(J, 'rule'), W(J, 'rule', 'six characters'), W(J, 'rule', 'dig the riverbed')
tSt, tK = C(J, 'still'), C(J, 'kept')
bed([(S0(J), GM9), (tG - 0.3, EBMAJ9), (tD - 0.3, CM9), (tM - 0.3, D7SUS), (tIr, D7), (tR - 0.3, EBMAJ7), (tSt - 0.3, F69), (tK - 0.2, GM9), (B + 0.3, BBMAJ9)], E(J) + 1.0)
river(S0(J), B + 2.6, [(0, 0.6), (tG - 0.5, 0.6), (tG + 1.1, 1.0), (tD - 0.3, 1.0), (tD + 1.3, 0.85), (tCl + 0.5, 0.85), (tCl + 2.3, 0.7),
                       (tM - 0.8, 0.7), (tM - 0.2, 0.45), (tR - 0.6, 0.45), (tR, 0.38), (tSt - 0.6, 0.38), (tSt + 0.2, 0.7), (tSt + 1.5, 0.95),
                       (tK, 0.85), (B + 0.6, 0.8), (B + 2.0, 0.0)], 0.05)
rush(tTwo - 0.2, 2.0, 0.022, P(1000))
for t0, x in ((tMin, 1150), (tTwo + 0.1, 1250), (tTwo + 0.5, 760), (tPl, 290), (tEv + 0.3, 760)):
    knock(t0 + 0.05, 0.012, P(x))
gravel(tG - 0.8, 3.6, 0.011, 12, P(1050)); gravel(tG + 2.8, 3.6, 0.006, 8, P(1050))
air(tEv - 0.2, 1.6, 0.012, 0.0)
for i in range(5):
    knock(tCl - 0.1 + i * 0.18 + 0.32, 0.017, P(860 + i * 14), 150 + 12 * i)
drain(tCl + 0.5, 1.8, 0.028, P(800))
# the diggers in the bed, each striking where its spade goes in (src/plan.js: m9_digger's cycle, (t * 0.62 + its phase) at a half), the
# first round, then a second, softer
for i, (u, o, kind, ph) in enumerate([(0.22, -0.2, 'dig', 0), (0.26, 0.24, 'dig', 0.4), (0.33, 0, 'carry', 0.1), (0.4, -0.26, 'dig', 0.7),
                                       (0.46, 0.18, 'dig', 0.2), (0.52, 0, 'carry', 0.6), (0.6, -0.1, 'dig', 0.5), (0.67, 0.24, 'dig', 0.9)]):
    if kind != 'dig':
        continue
    ta = tDug + i * 0.12 + 0.3; n0 = np.ceil(ta * 0.62 + ph - 0.5)
    for r, gg in ((0, 0.011), (1, 0.006)):
        crunch((n0 + r + 0.5 - ph) / 0.62, gg, P(980 - 380 * u))
# the cut through the bed: the big spade at the trench's edge (its phase 0.1), the trench dug from tM - 0.5 to tM + 0.5, the stone horse
# reached, then the iron bars in its place, the pencil line down to them, and the tag under it
paper(tM - 0.7, 0.03, P(1450), 0.6)
for n in range(int(np.ceil((tM - 0.9) * 0.62 + 0.1 - 0.5)), int((tR - 0.6) * 0.62 + 0.1 - 0.5) + 1):
    crunch((n + 0.5 - 0.1) / 0.62, 0.016 if n < (tM + 1.2) * 0.62 else 0.008, P(1250))
s_air(tM - 0.5, 1.0, 0.014, P(1450), 250, 1500)
thump(tM + 0.3, 0.03, P(1430))
knock(tM + 0.55, 0.014, P(1450))
clank(tIr + 0.05, 0.022, P(1400), 165); clank(tIr + 0.2, 0.016, P(1500), 178)
knock(tIr + 0.55, 0.012, P(1450))
quill(tM + 1.2, 0.9, 0.014, P(1420))
knock(tM + 1.95, 0.014, P(1450))
knock(tSix + 0.05, 0.014, 0.0)
unroll(tDig - 0.3, 1.6, 0.02, 0.0)
# the water let back in: the tripods lifted, the inner channel filling, then the canals, and the land greening
for i in range(5):
    knock(tSt - 0.1 + i * 0.15 + 0.1, 0.01, P(860 + i * 14), 200 + 10 * i)
rush(tSt + 0.5, 2.6, 0.03, P(800))
for k, x in enumerate((560, 380, 200)):
    trickle(tSt + 1.9 + k * 0.25, 1.6, 0.01, P(x))
brush(tSt + 2.4, 0.016, 0.0, 1.6)
mark(B + 0.8, 58)

# 2. The clean-up: no chord of its own; the title's B flat fades under its first words. The board set down, each pair of records meeting as it's merged; the six months filling; the badge pressed on;
#    the team's tag; the chart at the side, set down, and a brush along the months with none waiting
J = 'cleanup'; tProj, tMer, tPpl = W(J, 'merged', 'clean-up project'), W(J, 'merged', 'merged'), W(J, 'merged', 'people')
tFour, tSix, tFin, tG = W(J, 'team', 'a team of four'), W(J, 'team', 'six months'), W(J, 'team', 'finished on time'), C(J, 'gone')
paper(tProj - 0.2, 0.03, P(560), 0.6)
DM = tPpl + 0.5 - tMer; ORDER = [3, 11, 7, 0, 13, 5, 9, 1, 14, 6, 2, 10, 4, 12, 8]
for i, k in enumerate(ORDER):  # pair i merges as the merge passes its turn k
    knock(tMer + (k / 15 * 0.78 + 0.12) * DM, 0.007, P(960 + (150 + 118 + (i % 5) * 161 - 738) * 1.3), 300 + 15 * (k % 4))
brush(tSix, 0.012, P(500), 1.4)
stamp(tFin + 0.12, 0.03, P(800))
knock(tFour + 0.3, 0.014, P(1010))
paper(tSix - 0.7, 0.024, P(1450), 0.6)
brush(tG + 0.2, 0.014, P(1500), 1.0)

# 3. Back, intake by intake: its turn on D minor. The chart growing, its line going on, the intakes' cards stacking up; the numbers; the tags; the two
#    applications, on the applicant's note; Linh's two numbers dropping in, each on the student's note; the applications back, stamping
#    a new number on each person who applies: the first round, and the second softer, and then the picture goes on alone
J = 'return'; tBack, tTwo, tSec, tJul, tOne = W(J, 'why', 'came back'), W(J, 'why', 'two routes'), W(J, 'linh', 'second number'), W(J, 'linh', 'July'), W(J, 'linh', 'one of them')
tFix, tCh, tHow, ev = C(J, 'fixed'), W(J, 'fixed', 'change'), W(J, 'fixed', 'how they were made'), C(J, 'every')
turn(J, DM9)
air(S0(J) + 0.8, 1.6, 0.012, 0.0)
quill(S0(J) + 1.0, 2.4, 0.008, P(900))
for t0, x in ((S0(J) + 1.1, 720), (S0(J) + 2.25, 1060)):
    s_air(t0, 0.6, 0.012, P(x), 300, 1600); knock(t0 + 0.55, 0.01, P(x))
knock(ev - 0.05, 0.01, P(700)); knock(ev + 0.45, 0.01, P(1040))
knock(S0(J) + 3.35, 0.012, P(1200))
knock(tBack + 0.05, 0.014, P(1592)); knock(tTwo + 0.05, 0.014, P(1592))
for i, x in enumerate((1452, 1732)):
    paper(tTwo + 0.25 + i * 0.2, 0.022, P(x)); role('applicant', tTwo + 0.35 + i * 0.2, 0.024, P(x))
for t0 in (tSec - 0.1, tJul):
    role('student', t0 + 0.35, 0.03, P(560)); knock(t0 + 0.4, 0.012, P(560))
knock(tOne - 0.15, 0.012, P(560))
for i, x in enumerate((1311, 1675)):
    paper(tFix - 0.2 + i * 0.12, 0.018, P(x))
knock(tHow - 0.15, 0.014, P(1592))
for i, x in enumerate((1311, 1675)):
    for k, gg in ((0, 0.028), (1, 0.016)):
        stamp(tCh + i * 0.45 + k * 0.9 + 0.12, gg, P(x))

# 4. Stopped at the door: its turn on B flat major. The two applications becoming one; the arrow to the search, and the glass looking; each way out,
#    an arrow and its tag; Linh in white paper, on the person's notes, and her new role on the applicant's; Mei's queue, three cards;
#    the new person, a single note; the chart, 2026's intakes stacked under the limit, and the limit drawn, iron at its end; then the river
#    in the dry season, small, the water and the gravel heard again, and its tags
J = 'entry'; tSea, tCre, tM, tAdd = W(J, 'search', 'searching'), W(J, 'search', 'creates a person'), C(J, 'match'), W(J, 'match', 'adds a role')
tLik, tQ, tF, tFif, tStay = W(J, 'match', 'A likely one'), W(J, 'match', "Mei's queue"), C(J, 'fell'), W(J, 'fell', 'under fifty'), W(J, 'fell', 'stayed there')
tR, tSk, tMq = C(J, 'shape'), W(J, 'shape', 'the search keeps'), W(J, 'shape', "Mei's queue digs")
turn(J, BBMAJ9)
paper(S0(J) + 1.9, 0.02, P(420)); knock(S0(J) + 2.3, 0.012, P(420))
air(tSea - 0.2, 0.5, 0.014, P(690)); knock(tSea + 0.2, 0.014, P(868))
s_air(tSea + 0.3, tCre + 1.2 - tSea - 0.3, 0.006, P(868), 300, 1200)
for t0, y in zip((tM - 0.1, tLik - 0.1, tQ + 0.9), (250, 450, 650)):
    air(t0, 0.6, 0.012, P(1060)); knock(t0 + 0.45, 0.012, P(1200)); air(t0 + 0.8, 0.5, 0.01, P(1450))
person(tM + 0.8, 0.022, P(1635))
role('applicant', tAdd + 0.1, 0.026, P(1635))
for k in range(3):
    knock(tLik + 0.85 + k * 0.1, 0.012, P(1645), 220 + 20 * k)
cello(50, tQ + 1.6, 3.0, 0.016, P(1635)); role('applicant', tQ + 1.7, 0.022, P(1635))
paper(tF - 0.3, 0.026, 0.0, 0.6)
for t0, x in ((tFif - 0.2, 1100), (tStay - 0.2, 1330)):
    s_air(t0, 0.7, 0.01, P(x), 300, 1600); knock(t0 + 0.65, 0.01, P(x))
quill(tFif, 0.9, 0.012, 0.0); clank(tFif + 0.85, 0.012, P(1500), 300)
paper(tR - 0.2, 0.026, 0.0, 0.6)
river(tR - 0.4, E(J) + 1.2, [(tR - 0.4, 0.0), (tR + 0.4, 0.45), (E(J), 0.45), (E(J) + 1.2, 0.0)], 0.04)
gravel(tR + 0.2, 3.6, 0.006, 9, P(1000))
knock(tSk + 0.05, 0.012, P(1150)); knock(tMq + 0.05, 0.012, P(880))

# 5. The steward's iron bars: its turn on C major. Mei's name; the clean-up's board, back on her wall, and the badge; the dashboard set down and its
#    gauges with it, everyday work; the iron bars laid across them as they're named, a soft clank each; each measure lit, its iron bar
#    struck, a tubular bell, each a note higher, and its tick once it's read; the tutor's role, on the tutor's note, ringed and closed; the
#    two cards set in the sixth place; and in the wordless moment on the five gauges, an E chord with its fourth held
J = 'measures'; B = C(J, 'breath'); tPj, tEv, tIron = W(J, 'process', 'a project'), W(J, 'process', 'everyday work'), W(J, 'bars', 'iron bars')
tTut, tAct, tT, tPf = W(J, 'roles', 'like a tutor'), W(J, 'roles', 'still active'), C(J, 'nightly'), W(J, 'nightly', 'the platform')
ts = [C(J, k) for k in ('dups', 'oldest', 'roles', 'source', 'requests')]; te = ts[1:] + [tT]
CELLX = [287, 711, 1135, 287, 711, 1135]  # each place's middle across the dashboard
turn(J, CMAJ9); flutes(E7SUS4, B - 1.6, 4.0, 0.03, 0.25, 2.0)  # the wordless moment on the five gauges, gone as the alert begins
knock(S0(J) + 0.75, 0.016, P(1700))
paper(tPj - 0.2, 0.026, P(590), 0.6); stamp(tPj + 0.2, 0.018, P(880))
paper(tEv - 0.2, 0.032, P(710), 0.7)
for i in range(5):
    knock(tEv + 0.4 + i * 0.15 + 0.3, 0.011, P(CELLX[i]), 230 + 15 * i)
    clank(tIron + 0.1 + i * 0.1 + 0.4, 0.009, P(CELLX[i] - 120), 300 + 12 * i)
for i, m in enumerate((60, 64, 67, 71, 72)):
    ironbar(m, ts[i] - 0.1, 0.02, P(CELLX[i]))
    tick_(ts[i] + 0.95, 0.012, P(CELLX[i]))
role('tutor', tTut - 0.1, 0.026, P(1325)); knock(tTut, 0.012, P(1325))
ring(tAct, 0.7, 0.015, P(1325))
tick_(te[2] + 0.45, 0.014, P(1250))
knock(tT + 0.3, 0.014, P(1343)); knock(tPf + 0.3, 0.014, P(1343))

# 6. Past its limit: no chord at its turn; its iron bar is its music. The alert: the oldest case's iron bar struck again; its gauge
#    filling past its bar, a cross as it goes over, and no pulse; the case brought forward, its two records on the student's and the researcher's notes, a pencil round the birth dates;
#    Mei's phone; HR's answer written in; the stamp, the two records linked into one person, on the person's notes; the case put back,
#    the gauge emptying to two days, its bar struck alone and its tick back; the tag
J = 'alert'; tAl, tTw, tW, tBd = W(J, 'monday', 'an alert'), W(J, 'monday', 'twelve days'), C(J, 'waiting'), W(J, 'waiting', 'birth date')
tR, tDec, tRea, tB, tNot = C(J, 'rang'), W(J, 'rang', 'decided'), W(J, 'rang', 'with its reason'), C(J, 'blame'), W(J, 'blame', 'not at a person')
t0 = tAl - 0.2; DA = tTw + 0.5 - t0; tX = t0 + 0.4807 * DA  # where the wait passes its limit, 7 days, as in src/scenes.js
ironbar(64, tAl + 0.35, 0.024, P(1580))
fill(t0, DA, True, 0.014, P(711))
cross(tX + 0.05, 0.016, P(760))
paper(tW - 0.3, 0.03, P(670), 0.6)
role('student', tW - 0.1, 0.024, P(470)); role('researcher', tW + 0.05, 0.024, P(910))
ring(tBd + 0.2, 0.7, 0.014, P(420)); ring(tBd + 0.25, 0.7, 0.012, P(860))
for k in range(4):
    s_tap(tR + k * 0.13, 0.012, P(1700))
quill(tDec - 0.3, 0.7, 0.014, P(400))
stamp(tRea + 0.12, 0.05, P(884))
person(tRea + 0.5, 0.022, P(700))
air(tB - 0.4, 0.6, 0.012, P(670))
fill(tB - 0.2, 1.0, False, 0.012, P(711))
ironbar(64, tB + 0.5, 0.016, P(760)); tick_(tB + 0.55, 0.014, P(760))
knock(tNot - 0.25, 0.014, P(1580))

# 7. Proposed, then decided: its turn on F major. The government's list set down, and its new row, on the note the roles leave out; the list moving
#    aside; the university's list; the change, set down, and its first keys as the agent drafts it, a second round softer; Leila's name; the owner's tick; the row
#    joining the university's list on the same note; the tag
J = 'agent'; tL, tAddOne, tD, tFee, tChg = C(J, 'list'), W(J, 'list', 'added one'), C(J, 'draft'), W(J, 'draft', 'fee categories'), W(J, 'draft', 'a change to the list')
tO, tApp, tDe = C(J, 'owner'), W(J, 'owner', 'approved it'), C(J, 'decides')
turn(J, FMAJ9)
paper(tL + 0.1, 0.026, 0.0, 0.6)
knock(tAddOne + 0.05, 0.012, P(1000)); cel(71, tAddOne + 0.1, 0.022, P(1000))
air(tD - 0.4, 1.2, 0.01, P(600))
paper(tFee - 0.3, 0.024, P(400), 0.6)
paper(tD + 1.0, 0.026, P(1100), 0.6)
typing(tD + 1.3, 1.2, 0.011, P(1150), 6); typing(tD + 2.5, 1.2, 0.006, P(1150), 6)
knock(tO + 0.85, 0.014, P(1700))
tick_(tApp + 0.05, 0.016, P(842))
knock(tApp + 0.95, 0.012, P(400)); cel(71, tApp + 1.0, 0.022, P(400)); brush(tApp + 0.95, 0.01, P(400), 0.6)
knock(tDe + 0.15, 0.014, P(1100))

# 8. On the scorecard: no chord at its turn; its music is its three notes. Yusuf's name; the scorecard set down; the person's row, a brush; the three things, a note each on the
#    celesta as they're named, rising; and the person, on the person's notes, as the line says the person has all three
J = 'scorecard'; tSc, tOther, tTh = W(J, 'yusuf', 'his scorecard'), W(J, 'yusuf', 'every other domain'), C(J, 'three')
tLim, tWay, tPer = W(J, 'three', 'limits'), W(J, 'three', 'a way to change them'), W(J, 'three', 'the person')
knock(S0(J) + 0.65, 0.016, P(300))
paper(tSc - 0.3, 0.03, P(1200), 0.6)
brush(tOther, 0.014, P(1200), 0.7); knock(tOther + 0.3, 0.012, P(1200))
for t0, x, m in ((tTh, 590, 58), (tLim, 1060, 62), (tWay, 1500, 65)):
    knock(t0 + 0.05, 0.012, P(x)); cel(m + 12, t0 + 0.08, 0.02, P(x))
person(tPer + 0.1, 0.022, 0.0)

# 9. Elsewhere: its turn on G minor. The two industries' tags; the bank's chart set down; the line drawn as
#    it climbs, and at each clean-up three years apart, its fall, swept down; the clean-up's tag, the bracket and its tag; then the check
#    at entry, an iron bar struck, and the line staying down
J = 'elsewhere'; tBank, tBackT, tO = W(J, 'bank', 'A bank cleans up'), W(J, 'bank', 'come back every time'), C(J, 'one')
t9 = tBackT + 0.6; YR = lambda v: tBank + (v / 9.3) * (t9 - tBank); tDrop = YR(3)
turn(J, GM9)
knock(C(J, 'bank', 0.25), 0.014, P(730)); knock(C(J, 'bank', 0.65), 0.014, P(1200))
paper(tBank - 0.4, 0.03, 0.0, 0.6)
for v, x in ((3, 590), (6, 960), (9, 1330)):
    s_air(YR(v) - 0.05, 0.4, 0.012, P(x), 200, 900); knock(YR(v) + 0.3, 0.01, P(x), 170)
knock(tDrop + 0.05, 0.012, P(590))
quill(tDrop + 1.2, 0.6, 0.012, P(775)); knock(tDrop + 1.6, 0.01, P(775))
knock(tO + 0.25, 0.014, P(1540)); ironbar(67, tO + 0.6, 0.016, P(1540))

# 10. Kept: no chord at its turn; it opens on the person's notes, Linh in white paper. Her new role painted on, a brush and the student's note, the line to its
#     chip, and the chip; the intake's gauge set down, filling to 38, its tick; the tag; then the river in spring: the tripods lifted, the
#     water let back into the inner channel and out to the canals, the land greening; after the last line, the music again: D major,
#     blooming in the pause, the high flutes coming in last, carried across the cut and fading under the closing chapter's first words
J = 'kept'; B = C(J, 'breath'); tRole, tTh, tShe = W(J, 'phd', 'a new role'), W(J, 'count', 'thirty-eight'), W(J, 'count', "She isn't")
tDu, tRep, tLet = W(J, 'spring', 'at Dujiangyan'), W(J, 'spring', 'repairs are done'), W(J, 'spring', 'let back in')
flutes(DMAJ9_OPEN, B - 1.6, S0('series') + 3.0 - (B - 1.6))
person(S0(J) + 0.6, 0.026, P(640))
brush(tRole, 0.018, P(640), 0.8); role('student', tRole + 0.1, 0.032, P(640))
air(tRole + 0.2, 0.4, 0.012, P(720)); knock(tRole + 0.4, 0.014, P(1035))
knock(tTh - 0.3, 0.014, P(1500)); fill(tTh - 0.4, 1.0, True, 0.012, P(1400)); tick_(tTh + 0.85, 0.014, P(1450))
knock(tShe - 0.05, 0.014, P(1507))
river(tDu - 0.6, TOT, [(tDu - 0.6, 0.0), (tDu + 0.6, 0.55), (tLet - 0.3, 0.55), (tLet + 1.5, 0.95), (B + 0.8, 0.85), (B + 2.6, 0.0)], 0.05)
for i in range(5):
    knock(tRep - 0.1 + i * 0.15 + 0.1, 0.01, P(860 + i * 14), 200 + 10 * i)
rush(tLet - 0.3, 2.6, 0.03, P(800))
for k, x in enumerate((560, 380, 200)):
    trickle(tLet + 1.1 + k * 0.25, 1.6, 0.01, P(x))
brush(tLet + 1.2, 0.016, 0.0, 1.6)

# 11. The same one, everywhere: its turn is Kept's D major, fading under its first words. The series' line drawn, its first card,
#     the other eight set down, the series' mark painted under its name; a pencil for each film's lesson as it's written in its card.
#     In the pause after the four parts, its one chord, G major, as the line is seen from further off; the line shrinking into its
#     place on the wheel; the rim drawn round, data governance's wash, its spokes, the spaces on the rim; master data's card; each
#     piece set in its space as it's named; the next series' badge, Yusuf's card; after the last line, D major again, the high
#     flutes coming in last; the mark on the end card, in D, and its last card
J = 'series'; B = C(J, 'breath'); tNine, tSame = W(J, 'nine', 'Nine films'), W(J, 'nine', 'the same one')
tGv, tLk, tSer, tY = W(J, 'gov', 'data governance'), W(J, 'gov', 'looks after'), W(J, 'next', 'next series'), W(J, 'next', 'Yusuf')
tS, tRt = C(J, 'gov') - 0.3, C(J, 'right') + _DUR[J + '/right']
air(S0(J) + 0.2, 1.6, 0.01, P(500)); knock(S0(J) + 0.35, 0.01, P(200))
paper(tNine + 0.25, 0.016, P(780), 0.6); paper(tNine + 0.75, 0.012, P(1520), 0.6)
brush(tSame + 0.2, 0.012, 0.0, 1.0)
for (lid, word), x in zip((('who', 'once'), ('who', 'declare'), ('roles', 'a start'), ('roles', 'an owner'), ('safe', 'its purpose'),
                           ('safe', 'the lightest'), ('right', 'explain'), ('right', 'stop duplicates')), (768, 768, 960, 960, 1152, 1152, 1633, 1633)):
    quill(W(J, lid, word), 0.9, 0.008, P(x))
flutes(GMAJ9, tRt - 0.2, 6.4, 0.03, 0.25)
air(tS + 0.1, 1.6, 0.01, P(700)); knock(tS + 1.65, 0.01, P(680))
ring(tGv, 1.8, 0.008, P(1220)); brush(tGv - 0.05, 0.012, P(1220), 0.9); quill(tGv + 0.4, 0.5, 0.006, P(950))
quill(tLk + 0.1, 1.0, 0.006, P(1350)); paper(tLk + 0.15, 0.012, P(1350), 0.7)
for word, x in (('someone', 1053), ('one meaning', 1657), ('access', 1657), ('rules', 1053)):
    knock(W(J, 'rest', word), 0.012, P(x))
knock(tSer + 0.05, 0.012, P(1220)); knock(tY + 0.3, 0.012, P(222))
flutes(DMAJ9_OPEN, B - 1.6, TOT - B + 2.6)
mark(B + 1.0, 62)
knock(B + 2.1, 0.01, 0.0)

# and the effects kept under about 2.5 kHz: the pencil's and the keys' edges, softened
for _b in (XL, XR):
    _b[:] = filt(_b, 'low', 2600)
