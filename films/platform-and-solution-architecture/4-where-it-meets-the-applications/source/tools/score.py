# Where it meets the applications: the music and sounds, played by tools/audio.py with From words to data's helpers
# (shared/tools/music.py). The series' palettes: /mnt/project-files/enterprise-architecture/new-architecture-series/palettes.md, this
# film's row reserved on 12 November 2026. A hurdy-gurdy and a bandora, both made here (music.py has neither):
#  - The lead: a hurdy-gurdy. A wheel, turned by a crank, bows its melody string while the other hand presses the keys that stop it, so
#    the sound never breaks between notes: one line, joined, as a farmer's horse went the whole way. Low and plain (F 4 to C 6), every
#    note at one level, no vibrato, no buzzing bridge. Its drone string, the bourdon on F, sounds only under a phrase where nothing is
#    said (the title and the end card), never under the voice. Kept apart from Tools are hands' hurdy-gurdy (its melody string alone,
#    nasal near 520 Hz and 1.1 kHz, a knock for every key): this one's soundbox sings lower (near 300 and 650 Hz), its keys are quiet,
#    and it has its bourdon.
#  - The partner: a bandora, the wire-strung bass of the English consort, plucked softly with the fingertip, low (F 2 to F 4): each
#    note plucked, ringing, and gone before the next is plucked; single notes and short phrases, never strummed. Kept apart from From a
#    branch to production's bandora (plucked a fifth of the way along, warm near 230 Hz, played with an organ): this one is plucked a
#    seventh of the way along, so its seventh harmonic is gone, its body warms it lower (near 180 Hz), and it plays with a hurdy-gurdy.
#  - Nothing from the opening's place: no instrument, scale or sound of Japan, and no bells, horns or drums of the road. The rivers, the
#    passes and the road are heard as water, hooves, feet, coins and a load set down.
# The series' mark, the relay, in F: the hurdy-gurdy plays F, G and C rising and lets the C go as the bandora takes it an octave down and
# carries it down to F, as a load is handed from one horse to the next; under the title and under the end card, over the bourdon. The
# film's own figure, once in the opening and once at the end: the bandora plays its phrase plucked note by note, each note stopped, as
# goods went from station to station (the relay); the hurdy-gurdy plays its own phrase through without a break, as a farmer's horse
# went the whole way (the chuma); at the end the two play together, each its own line, in tenths, as one ruling let each load go its
# way. F major; D minor and A minor for what goes wrong (the change of horse, the cost, the courts; the flows nobody can see; the read
# that broke; the queue). Every chord is tuned pure from F (just intonation, see hz()): F, B flat and C major and D and A minor are pure
# in this table; G minor is not, and no chord puts G with D or with B flat. No chapter is urgent: nothing pulses.
# The rules the films keep (AGENTS.md, Sound; tools/quiet.py checks them):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words; never a
#    bed under the voice; a figure never played again soon after itself; the music and the effects no louder than the governance films'.
#  - Nothing trembles: every note held at one level, with no vibrato, and let go.
#  - Every sound is an event on screen, at the moment it appears, with the same word and offset as the picture in src/scenes.js, and
#    panned to where it is drawn. Everything soft: the hurdy-gurdy and the bandora below about 2.3 kHz, the effects below about 2.2 kHz
#    and well under the music.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() falls back to the line's start when a word is missing; here that stops the mix, so a typo can't move a sound
import json as _json, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text(encoding='utf-8'))
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
R1 = np.random.default_rng(1764)  # this film's own randomness: the room, the rosin, the water, the hooves and the paper


# a small timber room round the two instruments, ringing on for about a second. Its level is set by what it rings where the notes are
# (its gain from 100 Hz to 1.5 kHz is one), and _room() keeps each note as loud as it was dry, so held notes keep their level (held.py)
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.018 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds)"""
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
def _thud(n, f, d, at=0.0):
    """a small, soft knock inside a sound n samples long, at at seconds: a low, rounded tone, a duller one above it, gone in d"""
    x = np.arange(n) / SR - at; k = np.where(x >= 0, 1.0, 0.0); x = np.maximum(x, 0)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2.6 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.002) * k
def _moving(sig, s, g, pan0, pan1, k=4):
    """a sound moving across: overlapping pieces, each faded in and out, each panned a little further along"""
    n = len(sig); e = int(0.03 * SR)
    for i in range(k):
        a, b = max(0, i * n // k - e), min(n, (i + 1) * n // k + e); m = b - a; w = np.ones(m, np.float32)
        if a > 0: w[:2 * e] = np.linspace(0, 1, 2 * e)
        if b < n: w[-2 * e:] = np.linspace(1, 0, 2 * e)
        X(sig[a:b] * w, s + a / SR, g * FX, pan0 + (pan1 - pan0) * (i + 0.5) / k)
def _texture(sig, s, g, pan, pan1, top):
    if pan1 is None:
        _fx(sig, s, g, pan, top)
    else:
        _moving(norm(filt(np.asarray(sig, np.float32), 'low', top)).astype(np.float32), s, g, pan, pan1)

def sheet(s, g=0.006, pan=0.0):
    """a card or a page laid down: a short breath of paper, and its faint landing"""
    n = int(0.2 * SR); x = np.arange(n) / SR
    fl = filt(noise(0.22)[:n], 'band', (300, 1700)) * _bump(x, 0.09, 1.6) * (x < 0.09)
    _fx(fl + 0.5 * _thud(n, 165, 0.02, 0.08) / 1.3, s, g, pan, 1800)
def tick(s, g=0.005, pan=0.0):
    """something small set in place: one soft tick of wood"""
    n = int(0.08 * SR); x = np.arange(n) / SR
    _fx(filt(noise(0.1)[:n], 'band', (300, 1200)) * np.exp(-x / 0.006) * 0.6 + 0.7 * _thud(n, 250, 0.011), s, g, pan, 1500)
def knock(s, g=0.006, pan=0.0):
    """a soft knock on wood, once: something stopped or struck out, without a beep"""
    n = int(0.2 * SR)
    _fx(_thud(n, 145, 0.03), s, g, pan, 1200)
def seal(s, g=0.006, pan=0.0):
    """a seal pressed on paper: a soft, low press, and the paper under it"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 120, 0.04) + 0.25 * filt(noise(0.32)[:n], 'band', (250, 1100)) * np.exp(-x / 0.03), s, g, pan, 1100)
def line(s, sec=0.9, g=0.005, pan=0.0, pan1=None):
    """a line drawn out across a map or a page: a dry, even rub that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = filt(noise(sec + 0.02)[:n], 'low', 25); gr = 0.7 + 0.3 * gr / max(1e-9, float(np.abs(gr).max()))
    _texture(filt(noise(sec + 0.02)[:n], 'band', (220, 1200)) * _bump(x, sec, 1.4) * gr, s, g, pan, pan1, 1400)
def hatch(s, sec=2.0, g=0.004, pan=0.0, pan1=None):
    """many fine strokes drawn at once, as one soft texture: a dry rub with a fine, even grain, swelling in and easing off; never a
    patter of single strokes"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = 0.75 + 0.25 * np.abs(np.sin(np.pi * 9.0 * x)) ** 2
    _texture(filt(noise(sec + 0.02)[:n], 'band', (260, 1300)) * _bump(x, sec, 1.1) * gr, s, g, pan, pan1, 1500)
def stream(s, sec=2.8, g=0.004, pan=0.0, pan1=None):
    """a mountain river over stones, farther off: white water, a broad, soft rush that swells and falls a little, unevenly, many times
    a second, as one texture; never drops or a patter"""
    n = int(sec * SR); x = np.arange(n) / SR
    sw = filt(R1.standard_normal(n + 64).astype(np.float32), 'low', 9.0)[:n]; sw = 0.6 + 0.4 * sw / max(1e-9, float(np.abs(sw).max()))
    sig = filt(noise(sec + 0.02)[:n], 'band', (180, 1300)) * sw * _bump(x, sec, 0.8)
    _texture(sig, s, g, pan, pan1, 1400)
def coin(s, g=0.004, pan=0.0):
    """a copper coin set down on a wooden counter: a small dull knock with the faint, short ring of the metal, its top taken off"""
    n = int(0.16 * SR); x = np.arange(n) / SR
    ring = sum(np.sin(2 * np.pi * f * x + p) * w for f, w, p in ((1180, 1.0, 0.4), (1790, 0.5, 1.3), (2090, 0.3, 2.2))) * np.exp(-x / 0.035)
    _fx(_thud(n, 400, 0.008) + 0.22 * ring * np.minimum(1, x / 0.001), s, g, pan, 2200)
def load(s, g=0.006, pan=0.0):
    """a horse's load, bales in straw rope, set down: a soft, heavy fall and a little straw"""
    n = int(0.4 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 80, 0.06) + 0.45 * _thud(n, 126, 0.035) + 0.3 * filt(noise(0.42)[:n], 'band', (200, 900)) * np.exp(-x / 0.05), s, g, pan, 900)
def feet(s, sec, g=0.004, pan=0.0, pace=1.6, pan1=None):
    """people walking on an earth road, farther off: one soft texture of steps that swells in and fades, not a patter of single steps"""
    n = int(sec * SR); x = np.arange(n) / SR
    beat = 0.55 + 0.45 * np.abs(np.sin(np.pi * pace * x + 0.4)) ** 3
    _texture(filt(noise(sec + 0.02)[:n], 'band', (90, 520)) * beat * _bump(x, sec, 0.9), s, g, pan, pan1, 600)
def hooves(s, sec, g=0.004, pan=0.0, pace=1.1, pan1=None):
    """a horse walking on an earth road, farther off: four soft falls to a stride, each a dull knock of earth, heard as one texture
    that swells in and fades, never as a patter of single sounds"""
    n = int(sec * SR); x = np.arange(n) / SR; ph = (pace * x) % 1.0
    fall = sum(np.exp(-((ph - c) % 1.0) / 0.045) * w for c, w in ((0.0, 1.0), (0.25, 0.7), (0.5, 0.9), (0.75, 0.65)))
    sig = filt(noise(sec + 0.02)[:n], 'band', (70, 380)) * (0.3 + 0.7 * np.minimum(1, fall)) * _bump(x, sec, 0.8)
    sig = norm(filt(np.asarray(sig, np.float32), 'low', 450)).astype(np.float32)
    if pan1 is None:
        X(sig, s, g * FX, pan)
    else:
        _moving(sig, s, g, pan, pan1)


# ---- tuning: just intonation from F, so a chord's notes are whole-number ratios of each other and nothing beats. F, B flat and C major
# and D and A minor are pure in this table; G minor is not, and G is never put with D or B flat
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
def hz(m):
    o, pc = divmod(m - 65, 12)
    return 349.2282 * 2 ** o * _JI[pc]
F2, A2, Bb2, C3, D3, E3, F3, G3, A3, Bb3, C4, D4, E4, F4, G4, A4, Bb4, C5, D5, E5, F5, G5, A5, C6 = \
    41, 45, 46, 48, 50, 52, 53, 55, 57, 58, 60, 62, 64, 65, 67, 69, 70, 72, 74, 76, 77, 79, 81, 84

LH, LB, FX = 0.065, 0.088, 5.0
LV = [1.0]

# ---- the hurdy-gurdy. The melody string, bowed by the wheel: a bowed string's harmonics fall away about as 1/k; this soundbox sings
# near 300 Hz (its air) and 650 Hz (its top), a little at 1.4 kHz; played softly, nothing above about 2.3 kHz. The wheel catches the
# string over a few hundredths of a second, its upper harmonics a moment later; a key changes the note at once, with no slide, the next
# note's harmonics taking over in a few thousandths of a second; a breath of rosin under the tone; every note at one level, no vibrato.
# The bourdon, a thicker drone string on F 2, bowed by the same wheel, darker, its top taken off above about 1.1 kHz
def _hgw(f, top=2300, tilt=1.05):
    n = max(1, int(top // f)); k = np.arange(1, n + 1); fk = f * k
    a = k ** -tilt * (1 + 0.55 * np.exp(-((fk - 300) / 120) ** 2) + 0.6 * np.exp(-((fk - 650) / 190) ** 2)
                      + 0.3 * np.exp(-((fk - 1400) / 280) ** 2)) * np.exp(-fk / 2600)
    return a / np.sqrt((a ** 2).sum())
def _bowed(notes, att, rel, top, tilt):
    """the signal of a bowed phrase: notes are (note, seconds), joined; rises over att, and fades over rel after its last note"""
    total = sum(d for _, d in notes); n = int((total + rel + 0.05) * SR); x = np.arange(n) / SR
    st = np.cumsum([0.0] + [d for _, d in notes[:-1]]); idx = np.clip(np.searchsorted(st, x, side='right') - 1, 0, len(notes) - 1)
    fr = np.array([hz(m) for m, _ in notes]); fz = np.convolve(fr[idx], np.ones(int(0.003 * SR)) / int(0.003 * SR), mode='same')
    fz[:int(0.003 * SR)] = fr[0]; fz[-int(0.003 * SR):] = fr[-1]; ph = 2 * np.pi * np.cumsum(fz) / SR   # a key stops the string at once
    ws = [_hgw(f, top, tilt) for f in fr]; K = max(len(w) for w in ws); Wt = np.zeros((len(notes), K))
    for i, w in enumerate(ws):
        Wt[i, :len(w)] = w
    sm = np.ones(int(0.006 * SR)) / int(0.006 * SR); sig = np.zeros(n)
    for k in range(K):
        wk = np.convolve(Wt[idx, k], sm, mode='same')                                # the next note's harmonics take over
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (0.7 + 0.12 * k)), 1)) ** 2   # the wheel catches the string
        sig += wk * on * np.sin((k + 1) * ph + 0.45 * (k + 1) ** 2)
    sig *= np.where(x > total, np.cos(0.5 * np.pi * np.minimum((x - total) / rel, 1)) ** 2, 1.0)
    return sig, total
def hg(notes, s, g=1.0, pan=0.12, room=0.3, rel=0.2, until=None):
    """a phrase on the melody string, from s: notes are (note, seconds), every note joined to the next, the string bowed throughout"""
    if until is not None:
        notes = list(notes); room_left = until - s - rel - 0.1
        while notes and sum(d for _, d in notes) > room_left:
            m, d = notes[-1]; cut = sum(d_ for _, d_ in notes) - room_left
            if d - cut >= 0.12: notes[-1] = (m, d - cut); break
            notes.pop()
        if not notes:
            return
    sig, total = _bowed(notes, 0.06, rel, 2300, 1.05); n = len(sig); x = np.arange(n) / SR
    env = np.minimum(1, x / 0.06) * np.where(x > total, np.cos(0.5 * np.pi * np.minimum((x - total) / rel, 1)) ** 2, 1.0)
    sig = sig / max(1e-9, float(np.abs(sig).max())) + 0.012 * filt(noise(n / SR + 0.01)[:n], 'band', (700, 2000)) * env   # the rosin
    st = np.cumsum([0.0] + [d for _, d in notes]); sig = norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 70))
    sig = _rooms(sig, room, [(a + min(0.12, (b - a) * 0.25), b - 0.03) for a, b in zip(st[:-1], st[1:])])
    _notes(_until(sig, s, until), s, g * LV[0] * LH, pan, st[1:-1])
def _rooms(sig, k, spans):
    """the room round a joined phrase, each note kept as loud as it was dry (its rms over its body, spans in seconds): its echoes meet
    each note's own sound at its pitch, so one note would come out louder or quieter than the next; the gain moves from one note's to
    the next over the same short fade the note changes in"""
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32); gs = []
    for a, b in spans:
        i, j = int(a * SR), max(int(a * SR) + 1, int(b * SR)); r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
        gs.append(r0 / r1 if r1 > 0 else 1.0)
    gain = np.full(len(out), gs[-1], np.float32); f = int(0.02 * SR)
    for i, (a, b) in enumerate(spans):
        lo = 0 if i == 0 else int(spans[i - 1][1] * SR + 0.03 * SR); hi = int(b * SR + 0.03 * SR) if i < len(spans) - 1 else len(out)
        gain[lo:hi] = gs[i]
    sm = np.ones(2 * f, np.float32) / (2 * f)
    return out * np.convolve(gain, sm, mode='same').astype(np.float32)
def _notes(sig, s, g, pan, cuts):
    """a joined phrase put on the music bus a note at a time: cut where each note changes, with short fades that add up to one, so
    the pieces are the phrase exactly, and each note is heard, and checked, as itself"""
    n = len(sig); f = int(0.02 * SR); i0 = int(s * SR); edges = [0] + [int(c * SR) for c in cuts if 2 * f < c * SR < n - 2 * f] + [n]
    up, down = (0.5 - 0.5 * np.cos(np.linspace(0, np.pi, 2 * f))).astype(np.float32), (0.5 + 0.5 * np.cos(np.linspace(0, np.pi, 2 * f))).astype(np.float32)
    for a, b in zip(edges[:-1], edges[1:]):
        a0, b0 = max(0, a - f), min(n, b + f); w = np.ones(b0 - a0, np.float32)
        if a > 0: w[:2 * f] = up
        if b < n: w[-2 * f:] = down
        put(sig[a0:b0] * w, (i0 + a0 + 0.5) / SR, g, pan)   # on the very sample it was cut at, so the pieces meet exactly
def bourdon(s, sec, g=0.45, pan=0.0, until=None):
    """the bourdon, F 2, bowed under a phrase where nothing is said: it rises slowly as the wheel takes it, holds level, and stops with
    the wheel"""
    if until is not None:
        sec = min(sec, until - s - 0.5)
    if sec <= 0.3:
        return
    sig, total = _bowed([(F2, sec)], 0.35, 0.4, 1100, 1.25)
    sig = _room(norm(filt(filt(sig.astype(np.float32), 'low', 1100), 'high', 50)), 0.3, 0.5, sec)
    put(_until(sig, s, until), s, g * LV[0] * LH, pan)

# ---- the bandora: a wire string over a wide, shallow body, plucked softly with the fingertip about a seventh of the way along, so its
# seventh harmonic is gone; wire rings a touch brighter than gut, its harmonics a hair sharp; the body warms it near 180 Hz and a little
# near 420 Hz; the fingertip's touch is a small, soft thump. Each note rings and dies away, or is stopped by the player's fingers
# (stop, in seconds) before the next is plucked. Nothing trembles: one string to a note
def bandora(m, s, g=1.0, pan=-0.18, room=0.25, stop=None, until=None):
    f = hz(m); ring = 1.7 if f < 120 else 1.35; sec = stop if stop else ring * 2.2
    if until is not None:
        sec = min(sec, until - s - 0.15)
    if sec <= 0.05:
        return
    n = int((sec + 0.1) * SR); x = np.arange(n) / SR; sig = np.zeros(n)
    for k in range(1, 40):
        fk = f * k * np.sqrt(1 + 1.2e-5 * k * k)
        if fk > 2300:
            break
        a = abs(np.sin(np.pi * k / 7)) / k ** 1.1 * (1 + 0.6 * np.exp(-((fk - 180) / 80) ** 2) + 0.35 * np.exp(-((fk - 420) / 140) ** 2))
        sig += a * np.sin(2 * np.pi * fk * x + 0.4 * k) * np.exp(-x * (1 + 0.45 * (k - 1)) / ring)
    sig *= np.minimum(1, x / 0.004)
    nt = int(0.03 * SR); sig[:nt] += filt(noise(0.03)[:nt], 'band', (100, 700)) * np.exp(-np.arange(nt) / SR / 0.005) * 0.06
    sig *= np.cos(0.5 * np.pi * np.clip((x - sec) / 0.07, 0, 1)) ** 2                                    # stopped, or let go
    sig = sig / max(1e-9, float(np.abs(sig).max()))
    sig = _room(norm(filt(filt(sig.astype(np.float32), 'low', 2300), 'high', 45)), room, 0.01, min(0.5, sec))
    put(_until(sig, s, until), s, g * LV[0] * LB, pan)

# ---- what they play
def mark(s, g=1.0, step=0.34, until=None, hold=1.5, drone=True):
    """the series' mark, in F: the hurdy-gurdy's F, G and C rising, and the bandora takes the C an octave down and carries it down to
    F; the hurdy-gurdy lets its C go as the bandora takes it, as a load is handed from one horse to the next. Over the bourdon, where
    nothing is said"""
    if drone:
        bourdon(s - 0.25, step * 4 + hold + 0.4, 0.4 * g, until=until)
    hg([(F4, step), (G4, step), (C5, step + 0.06)], s, g, until=until)
    bandora(C4, s + step * 3, 0.85 * g, stop=step - 0.04, until=until)
    bandora(F3, s + step * 4, 0.85 * g, until=until)
    return s + step * 4

FIG_B = (F3, A3, C4, A3, Bb3, A3, F3)     # the bandora's line: plucked, each note stopped, station by station
FIG_H = (A4, C5, F5, E5, D5, C5, A4)      # the hurdy-gurdy's: joined, the whole way; together, a tenth above the bandora's
def stopped(s, step=0.46, stop=0.3, g=1.0, notes=FIG_B):
    """the film's figure on the bandora: each note plucked and stopped before the next, as a load stopped at every station"""
    for i, m in enumerate(notes):
        bandora(m, s + step * i, g, stop=stop if i < len(notes) - 1 else None)
def through(s, step=0.46, g=1.0, last=1.4):
    """the film's figure on the hurdy-gurdy, played through: every note joined to the next, as a horse went the whole way"""
    hg([(m, step) for m in FIG_H[:-1]] + [(FIG_H[-1], last)], s, g)


# =============================================================================================================================
# 1. A horse the whole way: the opening. Japan, the 1600s: the hurdy-gurdy's first phrase over the bandora's F as the land appears and
#    the camera comes down on Shinano; its ranges drawn as one soft texture of strokes, a tick as its name appears; the rivers, white
#    water over stones; the passes, a horse's hooves. The relay on the road at dusk: the horse comes in to the station, and the bandora
#    plays the film's figure, stopped at every station, as the load moves to the next horse; the load set down on it; the fare and the
#    fee, two coins. Every change costs: D minor, low; the horses going off; the officials' procession, feet and hooves; a load set
#    down to wait. The mountain villages: A minor. The chuma, straight through: hooves passing left to right, and the hurdy-gurdy's
#    figure through, on one wind of the wheel. The courts: four papers, and D minor, low. What each needed: B flat. 1764: the ruling,
#    a page, written; both kinds of horse under it; C major; its seal, and F major as the farmers help keep the relay. After 1764: the
#    road from Iida to Matsumoto, a tick at its count; the horses spread to both coasts, one soft texture of lines, and the
#    hurdy-gurdy rising. The utility: 34 flows nobody can see, A minor; each sorted to its route and put on one map, F major. The
#    title: the mark over the bourdon
LV[0] = 0.9
ow = lambda lid, word, off=0: W('chuma', lid, word, off)
oc = lambda lid, off=0: G('chuma', lid, off)
END = E('chuma')
bandora(F2, 0.6, 0.8)
hg([(C5, 1.6), (A4, 0.8), (Bb4, 0.8), (C5, 1.0), (F5, 2.2)], 0.9, 0.7)
bandora(C3, 3.3, 0.7)
hatch(1.4, 2.6, 0.003, px(700), px(1300))
tick(ow('year', 'Shinano', -0.3), 0.003, px(1000))
stream(ow('year', 'rivers', -0.3), 3.0, 0.0035, px(900), px(1250))
hooves(ow('year', 'passes', -0.3), 3.6, 0.003, px(800), 1.0, px(1100))
bandora(F2, ow('year', 'passes', 0.2), 0.7)
hooves(oc('relay', -0.6), 3.4, 0.0035, px(250), 1.1, px(640))
stopped(ow('relay', 'next station', -0.1), g=0.85)
load(ow('relay', 'moves', 1.1), 0.005, px(1150))
for k in range(2):
    coin(ow('relay', 'pays again', 0.7 + 0.45 * k), 0.004, px(860 + 60 * k))
bandora(D3, oc('harm', -0.1), 0.8)
hg([(F4, 1.0), (A4, 1.6)], oc('harm', 0.15), 0.6)
hooves(oc('harm', -0.4), 4.0, 0.003, px(960), 1.1, px(1500))
feet(ow('harm', 'officials', -0.3), 5.0, 0.003, px(1700), 1.5, px(1000))
hooves(ow('harm', 'officials', -0.1), 4.6, 0.0025, px(1800), 1.0, px(1100))
load(ow('harm', 'loads wait', -0.3), 0.005, px(620))
bandora(A2, oc('villages', -0.1), 0.75)
hg([(E5, 0.9), (C5, 1.5)], oc('villages', 0.2), 0.55)
hooves(oc('chuma', -0.4), 8.0, 0.0035, px(-100), 1.2, px(1700))
bandora(F2, ow('chuma', 'straight through', -0.2), 0.75)
through(ow('chuma', 'straight through', -0.1), g=0.8)
tick(ow('chuma', 'chūma', -0.2), 0.003, px(960))
for i in range(4):
    sheet(ow('hit', 'From', -0.2 + 0.45 * i), 0.0035, px(560 + 270 * i))
bandora(D3, ow('hit', 'court', 0.0), 0.75)
hg([(A4, 0.8), (F4, 1.4)], ow('hit', 'court', 0.2), 0.5)
bandora(Bb2, oc('need', -0.1), 0.75)
hg([(D5, 0.9), (F5, 1.5)], oc('need', 0.15), 0.55)
sheet(oc('ruling', -0.2), 0.005, px(960))
line(oc('ruling', 0.2), 3.2, 0.003, px(800), px(1150))
bandora(C3, oc('ruling', 0.3), 0.75)
hg([(G4, 0.8), (C5, 0.8), (E5, 1.6)], oc('ruling', 0.5), 0.55)
hooves(oc('ruling', 0.5), 5.0, 0.003, px(200), 1.2, px(900))
line(oc('written', 0.2), 3.6, 0.003, px(800), px(1150))
seal(ow('written', 'relay going', -0.1), 0.005, px(1250))
bandora(F2, ow('written', 'help keep', -0.1), 0.75)
hg([(A4, 0.7), (C5, 0.7), (F5, 1.8)], ow('written', 'help keep', 0.1), 0.55)
tick(ow('better', 'nine thousand', -0.3), 0.003, px(1610))
hatch(ow('better', 'spread', -0.2), 2.6, 0.003, px(700), px(1400))
bandora(F2, ow('better', 'spread', 0.0), 0.75)
hg([(C5, 0.6), (D5, 0.6), (F5, 0.6), (A5, 2.0)], ow('better', 'spread', 0.1), 0.5)
tick(ow('better', 'both coasts', -0.3), 0.003, px(960))
sheet(oc('unseen', -0.6), 0.004, px(1100))
hatch(ow('unseen', 'thirty-four', -0.3), 1.6, 0.003, px(600), px(1700))
bandora(A2, ow('unseen', 'thirty-four', -0.1), 0.7)
hg([(C5, 0.9), (E5, 1.5)], ow('unseen', 'thirty-four', 0.15), 0.5)
tick(ow('sort', 'Ravi', -0.2), 0.003, px(200))
hatch(ow('sort', 'sort', 0.0), 2.4, 0.003, px(600), px(1600))
bandora(F3, ow('sort', 'one map', -0.1), 0.7)
hg([(A4, 0.6), (C5, 1.6)], ow('sort', 'one map', 0.1), 0.5)
t_ = mark(oc('breath', 0.9), 0.65, until=END)
hg([(A4, 2.0)], t_ + 0.3, 0.45, until=END)

# 2. Flows nobody can see: the integration platform laid down; each application, a tick as it's named, and the hurdy-gurdy's C over
#    the bandora's F as the platform joins them. The gateway's call and its answer, each a line along the platform; the news, up to
#    the events and out to three applications. Every message checked and logged, one soft texture. Yasmin, a tick; the 34 flows that
#    aren't on her map, a soft texture, and A minor. The nightly read, a line; "upgraded", a card; the read broken, a knock, and D
#    minor; retail's reports, a card. Her rule, a card, and C major, a question
LV[0] = 0.9
uw = lambda lid, word, off=0: W('unseen', lid, word, off)
uc = lambda lid, off=0: G('unseen', lid, off)
sheet(S0('unseen') + 0.3, 0.004, px(1135))
bandora(F3, uw('apps', 'joins', -0.1), 0.7)
hg([(C5, 1.4)], uw('apps', 'joins', 0.1), 0.5)
for k, word in enumerate(('billing', 'customer system', 'outages', 'metering', 'work orders')):
    tick(uw('apps', word, -0.2), 0.0025, px(555 + 290 * k))
line(uw('how', 'asks another', 0.0), 0.7, 0.003, px(1135), px(845))
line(uw('how', 'asks another', 1.1), 0.7, 0.003, px(845), px(1135))
line(uw('how', 'news', 0.0), 0.75, 0.003, px(845), px(1280))
hatch(uw('how', 'news', 0.9), 1.2, 0.0025, px(1280), px(700))
hatch(uw('logged', 'checked', -0.1), 0.8, 0.0025, px(555), px(1715))
tick(uw('yasmin', 'Yasmin', -0.1), 0.003, px(200))
hatch(uw('yasmin', 'thirty-four', -0.2), 1.6, 0.003, px(600), px(1700))
bandora(A2, uw('yasmin', 'thirty-four', 0.0), 0.7)
hg([(E5, 1.6)], uw('yasmin', 'thirty-four', 0.2), 0.45)
line(uw('broke', 'nightly', -0.2), 0.8, 0.003, px(845))
sheet(uw('broke', 'upgraded', -0.2), 0.004, px(845))
knock(uw('broke', 'read broke', -0.1), 0.0045, px(845))
bandora(D3, uw('broke', 'read broke', 0.0), 0.7)
hg([(A4, 1.6)], uw('broke', 'read broke', 0.2), 0.45)
sheet(uw('broke', "retail's reports", -0.2), 0.004, px(1540))
sheet(uc('ask', -0.1), 0.004, px(1135))
bandora(C3, uc('ask', 0.2), 0.7)
hg([(E5, 0.7), (G5, 1.3)], uc('ask', 0.4), 0.45)

# 3. Two kinds of traffic: Ravi agrees with half, the hurdy-gurdy's A over the bandora's F. Small messages, one at a time, each a line
#    from one application to another. Bulk: the night's readings, one broad soft texture down into the data platform, and B flat; its
#    chips, a tick each. Sent through as messages: the readings queue at the integration platform, hooves that stop and start, and the
#    bandora's D and A, each stopped. Both are flows: F major, at the turn
LV[0] = 0.9
kw = lambda lid, word, off=0: W('kinds', lid, word, off)
kc = lambda lid, off=0: G('kinds', lid, off)
bandora(F3, kc('half', 0.4), 0.65)
hg([(A4, 1.4)], kc('half', 0.6), 0.45)
for word, a, b in (('customer moved', 845, 555), ('fault', 1135, 1715), ('job', 1715, 1135)):
    line(kw('small', word, -0.1), 1.3, 0.003, px(a), px(b))
hatch(kc('bulk', -0.1), 2.6, 0.003, px(1425), px(1465))
bandora(Bb2, kc('bulk', 0.1), 0.7)
hg([(D5, 0.8), (F5, 1.4)], kc('bulk', 0.3), 0.45)
tick(kw('bulk', 'forty million', -0.2), 0.0025, px(1135))
tick(kw('bulk', 'Lakeflow', -0.3), 0.0025, px(1610))
hooves(kc('through', 0.0), 6.0, 0.0025, px(1425), 0.9, px(1280))
bandora(D3, kw('through', 'station', 0.0), 0.7, stop=0.32)
bandora(A2, kw('through', 'slower', 0.0), 0.7, stop=0.45)
bandora(F2, kc('road', 0.1), 0.7)
hg([(F4, 0.5), (A4, 0.5), (C5, 1.6)], kc('road', 0.3), 0.45)

# 4. The simplest route for each: a rule for each kind, a tick. Bulk loads natively, the platform's own connectors drawn, one soft
#    texture. Events: the data platform subscribes, its flows drawn, and the second way struck out, a knock; B flat. Served back
#    through the gateway, a line; C major. The simplest route for each: F major. Two films, a tick each
LV[0] = 0.9
rw = lambda lid, word, off=0: W('route', lid, word, off)
rc = lambda lid, off=0: G('route', lid, off)
tick(rw('sort', 'one rule', -0.2), 0.003, px(1135))
hatch(rw('bulk', 'natively', -0.2), 2.2, 0.003, px(500), px(1700))
knock(rw('events', 'second way', -0.4), 0.004, px(845))
line(rw('events', 'subscribes', -0.2), 1.4, 0.003, px(1280))
bandora(Bb2, rw('events', 'subscribes', 0.0), 0.7)
hg([(F5, 1.6)], rw('events', 'subscribes', 0.2), 0.45)
line(rw('serve', 'gateway', -0.1), 1.4, 0.003, px(990))
bandora(C3, rw('serve', 'gateway', 0.0), 0.7)
hg([(C5, 0.6), (E5, 1.4)], rw('serve', 'gateway', 0.2), 0.45)
bandora(F2, rc('simplest', 0.0), 0.7)
hg([(A4, 0.6), (F5, 1.6)], rc('simplest', 0.2), 0.45)
tick(rc('films', -0.2), 0.003, px(820))
tick(rw('films', 'A path', -0.2), 0.003, px(1450))

# 5. One map, both teams: the flow map laid down, its rows written, and F major. A pull request, a card, reviewed, a tick. The ruling
#    of 1764, a page, and the hurdy-gurdy's C, D and F over the bandora's B flat. All 34 flows seen, a tick
LV[0] = 0.9
mw = lambda lid, word, off=0: W('map', lid, word, off)
mc = lambda lid, off=0: G('map', lid, off)
sheet(mw('map', 'one map', -0.3), 0.004, px(1135))
bandora(F2, mw('map', 'one map', -0.1), 0.7)
hg([(C5, 0.7), (A4, 0.7), (C5, 1.4)], mw('map', 'one map', 0.1), 0.45)
line(mw('map', 'where it starts', -0.2), 2.0, 0.003, px(800), px(1500))
sheet(mw('keep', 'pull request', -0.2), 0.004, px(1440))
tick(mw('keep', 'reviewed', 0.1), 0.003, px(1440))
sheet(mc('ruling', -0.1), 0.004, px(1620))
bandora(Bb2, mc('ruling', 0.1), 0.7)
hg([(C5, 0.5), (D5, 0.5), (F5, 1.8)], mc('ruling', 0.3), 0.45)
tick(mc('sees', -0.2), 0.003, px(1135))

# 6. A score for the outage app: Grace, a tick; her ticket, a card, and the hurdy-gurdy's G over the bandora's C. A feeder, drawn. The
#    score's data product set down on the platform; every hour, a tick. Served back through the gateway, a line up and down into the
#    outage app; an API it already calls, a tick, and F major. The pull request, a card, reviewed; the route added, on the map, a tick
#    each. In test: the outage app, a card; checked, a tick; the ticket closes, a tick, and F major
LV[0] = 0.9
sw_ = lambda lid, word, off=0: W('score', lid, word, off)
sc_ = lambda lid, off=0: G('score', lid, off)
tick(sw_('ask', 'Grace', -0.1), 0.003, px(200))
sheet(sw_('ask', 'ticket', -0.2), 0.004, px(760))
bandora(C3, sw_('ask', 'ticket', 0.0), 0.7)
hg([(G4, 1.4)], sw_('ask', 'ticket', 0.2), 0.45)
line(sc_('feeder', -0.3), 1.0, 0.003, px(1210), px(1770))
load(sc_('make', 0.4), 0.004, px(805))
tick(sw_('make', 'every hour', -0.2), 0.0025, px(1465))
line(sw_('route', 'gateway', -0.6), 2.0, 0.003, px(930), px(1135))
tick(sw_('route', 'an API', -0.2), 0.0025, px(1465))
bandora(F3, sw_('route', 'already calls', -0.1), 0.7)
hg([(A4, 0.5), (C5, 1.5)], sw_('route', 'already calls', 0.1), 0.45)
sheet(sc_('review', -0.1), 0.004, px(760))
tick(sw_('review', 'reviews', 0.0), 0.003, px(760))
tick(sw_('review', 'adds', 0.1), 0.003, px(1290))
tick(sw_('review', 'on the map', 0.1), 0.003, px(1290))
sheet(sc_('test', -0.1), 0.004, px(1500))
tick(sw_('test', 'checks', 0.2), 0.003, px(1500))
tick(sw_('test', 'ticket closes', 0.1), 0.003, px(760))
bandora(F2, sw_('test', 'ticket closes', 0.0), 0.7)
hg([(C5, 0.5), (F5, 1.8)], sw_('test', 'ticket closes', 0.2), 0.45)

# 7. Better together: the count, a tick for each kind, and the hurdy-gurdy's A over the bandora's F at the first. Nothing reads the
#    customer system unseen: its next upgrade, a tick. The two platforms help each other, a tick each. Better together: F major, the
#    hurdy-gurdy's A, C and F over the bandora's F and C
LV[0] = 0.9
tw = lambda lid, word, off=0: W('together', lid, word, off)
tc = lambda lid, off=0: G('together', lid, off)
for word, x in (('native', 720), ('events', 1240), ('gateway', 1640)):
    tick(tw('count', word, -0.3), 0.003, px(x))
bandora(F3, tw('count', 'native', -0.1), 0.7)
hg([(C5, 0.6), (A4, 1.4)], tw('count', 'native', 0.1), 0.45)
tick(tw('customer', 'upgraded', -0.2), 0.003, px(1135))
tick(tc('help', -0.2), 0.003, px(1135))
tick(tw('help', 'serves', -0.2), 0.003, px(1135))
bandora(F2, tc('better', -0.1), 0.7)
bandora(C3, tc('better', 0.5), 0.6)
hg([(A4, 0.5), (C5, 0.5), (F5, 2.2)], tc('better', 0.1), 0.45)

# 8. The data practice on the map: its layers, a page, and the hurdy-gurdy's C over the bandora's F. The integration platform, a node
#    beside the data platform, a page; its gateway and its events, a tick each. The flows, each drawn, a line each. The rule as a
#    principle, a page: B flat, then F
LV[0] = 0.9
pw = lambda lid, word, off=0: W('practice', lid, word, off)
pc = lambda lid, off=0: G('practice', lid, off)
sheet(S0('practice') + 0.3, 0.0035, px(960))
bandora(F3, S0('practice') + 0.5, 0.65)
hg([(C5, 1.4)], S0('practice') + 0.7, 0.42)
sheet(pc('node', -0.4), 0.0035, px(540))
tick(pw('node', 'a gateway', -0.3), 0.003, px(280))
tick(pw('node', 'events', -0.3), 0.003, px(530))
for word, x in (('drawn', 575), ('labelled', 1080), ('route', 1370)):
    line(pw('flows', word, -0.3), 0.6, 0.003, px(x))
sheet(pw('principle', 'principle', -0.3), 0.0035, px(960))
bandora(Bb2, pw('principle', 'principle', -0.1), 0.65)
bandora(F2, pw('principle', 'principle', 0.7), 0.65)
hg([(D5, 0.8), (C5, 1.6)], pw('principle', 'principle', 0.1), 0.42)

# 9. Two kinds of horse, one ruling: the road at dusk, the farmers' horses going one way and a station's horse the other, each its
#    hooves; and the film's figure, both lines together, the bandora's stopped at every station and the hurdy-gurdy's joined through,
#    in tenths. Every flow on one map, a tick. "Next", a tick. The end card: the mark over the bourdon, to the end
LV[0] = 0.9
zw = lambda lid, word, off=0: W('end', lid, word, off)
zc = lambda lid, off=0: G('end', lid, off)
hooves(S0('end') + 0.3, 6.5, 0.003, px(-200), 1.2, px(900))
hooves(S0('end') + 0.6, 6.5, 0.0025, px(2060), 1.0, px(1100))
stopped(zc('road', 0.4), g=0.7)
through(zc('road', 0.4), g=0.65)
tick(zw('data', 'one map', -0.3), 0.003, px(1135))
tick(zc('next', -0.1), 0.003, px(1135))
t_ = mark(zc('breath', 0.6), 0.6, until=TOT, hold=2.5)
hg([(A4, 2.4)], t_ + 0.3, 0.42, until=TOT)
