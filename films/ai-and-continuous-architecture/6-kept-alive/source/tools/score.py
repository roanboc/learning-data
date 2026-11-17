# Kept alive: the music and sounds, played by tools/audio.py with From words to data's helpers (shared/tools/music.py). This film's
# palette, reserved on 13 November 2026 in the four architecture series' palettes (the project's
# enterprise-architecture/new-architecture-series/palettes.md): two Wagner tubas and a glockenspiel, both made here (music.py has
# neither). Nothing new fitted that isn't another culture's or the region's, so this film pairs two instruments the site has, which no
# film pairs and no film of this topic plays (Agents on Databricks' Wagner tubas, with a tonewheel organ; four governance films'
# glockenspiel). That pairing is the palettes file's exception, written down as an assumption in the film's assumptions file.
#  - Two Wagner tubas (wt()), soft and low (B flat 2 to F 4): the tuba Wagner had made for horn players, a horn's mouthpiece on a wide,
#    conical bore; a dark, round, solemn note between a horn's and a euphonium's. Plain held notes, two at a time at most, one to each
#    player: the lower player takes the lower note and comes in first (duo()). Each note swells a little in and is held at one level;
#    no vibrato. Wagner gave them to Valhalla, the gods' fortress that is built and at last burns; nothing of his music is quoted.
#  - The film's own figure (hand()): a held note handed from one player to the other, the second coming in as the first lets go, over
#    the same moment, so the note never stops and never swells: kept alive by two players, not one, as the map is kept by a role with a
#    deputy. Once in the opening, where what was left needed keepers; once as Tomás hands to Inés; once in the last pause.
#  - A glockenspiel (gk()), low in its range (G 5 to D 6), struck softly with hard rubber mallets, its top taken off (low-passed at
#    2.4 kHz): one small, clear note at each beat of the map's rhythm (a change checked, the day someone leaves, the month's read, the
#    quarter's tests, the year's confirmations) and where the map agent reads. Never a tune, never a roll.
#  - The series' mark (mark()), under the title and the end card: four notes rising like a tower's tiers, a fifth, a fourth and a third
#    (B flat, F, B flat, D), on the two tubas, and the glockenspiel answering the last, D, two octaves up.
#  - B flat major, G minor where the map has drifted and the tower is left to fall, tuned pure from B flat (hz()). B flat, E flat and
#    F major, G and D minor are pure in this tuning; C with E flat (32/27), C with G (40/27) and A with E flat are not, so no two of
#    those ever sound together (the score stops if they would: _pure()), and there's no C minor.
# The films' sound (the author's rule, 20 October 2026, and the review of 4 November 2026):
#  - Music plays under the opening story, a held note or two to each picture. After it, music comes now and then: two notes under a
#    moment on screen, where a person decides, a glockenspiel note on a beat of the rhythm, or the figure in a pause. Nothing is held
#    under the explaining, and nothing pulses (film.json lists no "urgent" chapter: the missing check is told after it was caught).
#  - Nothing trembles: no vibrato; every pair of notes is tuned pure, and every held note keeps its own level in the room.
#  - Nothing loops, and every sound is an event on screen, at the moment it appears, from the same word and offset as the picture in
#    src/scenes.js, so sound and picture stay together when the voice is re-timed: change one, change both.
#  - Everything stays low and soft, below about 2.4 kHz: dusk air, footsteps on packed earth, workmen's baskets, a ruin crumbling, a
#    stamp, a trowel, paper, cards set down, a pen's ticks and strokes, a plug, a switch thrown, a live wire's low hum, a lock's click,
#    muffled keys, clay, and a breath of air.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads.
# kt_w() falls back to the line's start when a word isn't in it; here a missing word, or one inside a longer word, stops the mix
import json as _json, math as _math, pathlib as _pl
from scipy.signal import fftconvolve
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text(encoding='utf-8'))
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = s.find(word); j = i + len(word)
    assert i >= 0, '%s/%s has no "%s"' % (sid, lid, word)
    assert (i == 0 or not s[i - 1].isalnum()) and (j == len(s) or not s[j].isalnum()), \
        'the first "%s" in %s/%s is inside a longer word' % (word, sid, lid)
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)
def END(sid, lid):
    """when a line's voice stops"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(323)  # this film's own randomness (Alexander died in Babylon in 323 BCE): the room, the breath, the grit

# ---- tuning: just intonation from B flat 3 (233.08 Hz), so two notes held together are whole-number ratios of each other and nothing
# beats. Every pitch comes from this one scale, so a note two pairs share is the same in both
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (58, 233.082)  # B flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
Bb2, C3, D3, Eb3, F3, G3, A3, Bb3, C4, D4, Eb4, F4 = 46, 48, 50, 51, 53, 55, 57, 58, 60, 62, 63, 65
G5, A5, Bb5, C6, D6 = 79, 81, 82, 84, 86
# the notes that are never heard together: C with E flat, C with G, A with E flat (pitch classes counted from B flat)
_IMPURE = {frozenset((2, 5)): 'C with E flat', frozenset((2, 9)): 'C with G', frozenset((11, 5)): 'A with E flat'}
_LEDGER = []  # every note placed: (from, to, MIDI note, line of this score)
def _log(m, a, b):
    import traceback
    _LEDGER.append((a, b, m, [f.lineno for f in traceback.extract_stack() if f.filename.endswith('score.py')][-2:]))
def _pure():
    """stops the mix where two notes that aren't pure in this tuning would sound together"""
    for i, (a, b, m, la) in enumerate(_LEDGER):
        for c, d, q, lb in _LEDGER[i + 1:]:
            k = frozenset(((m - KEY[0]) % 12, (q - KEY[0]) % 12))
            assert not (c < b and a < d and k in _IMPURE), '%s would sound together at %.1f s (score lines %s and %s)' % (_IMPURE[k], max(a, c), la, lb)

# ---- the levels: the tubas and the glockenspiel about as far under the narration as the series' other music (matched by loudness, as
# tools/quiet.py measures it); the effects about 16 dB under the music (FX scales them all)
TL, KL, FX = 0.04, 0.016, 2.6

# ---- the room: a hall of stone, small, ringing on for about a second, nothing much above 1.6 kHz. Its level is set by what it rings
# where the notes are (its gain from 100 Hz to 1.5 kHz is one), and each held note is played into it and set back to its own level,
# where it's held (_held), as the video guidelines ask (held.py checks both)
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.1)).astype(np.float32))(np.arange(int(1.1 * SR)) / SR)
_IR = filt(_IR, 'low', 1600); _IR[:int(0.016 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, amt):
    return np.pad(sig, (0, len(_IR) - 1)) + amt * fftconvolve(sig, _IR).astype(np.float32) if amt else sig
def _held(sig, amt):
    """a note in the room, at its own level: the room's echoes meet a note's own sound at its pitch, adding to it on one note and
    taking from it on another, so the note is set back to the level it had without the room where it's held (within 3 dB of its own
    level, after its first quarter second), as tools/quiet.py measures it"""
    out = _room(sig, amt); h = SR // 100; k = len(sig) // h
    if not amt or k < 35:
        return out
    dry = (sig[:k * h].astype(np.float64).reshape(k, h) ** 2).sum(1); wet = (out[:k * h].astype(np.float64).reshape(k, h) ** 2).sum(1)
    lv = np.convolve(dry, np.ones(10) / 10, 'same')[25:]; on = np.nonzero(lv >= lv.max() * 10 ** -0.3)[0] + 25
    return out * np.float32(np.sqrt(dry[on].sum() / max(1e-12, wet[on].sum())))
def _nz(sec):
    """the film's own noise, the same each time the score plays"""
    return R1.standard_normal(max(1, int(sec * SR))).astype(np.float32)

# ---- a Wagner tuba: one player, soft, with no vibrato. Its partials, exactly in tune, gather round a dark formant near 380 Hz and fall
# away above about 900 Hz, darker than a horn; the note opens a little as it speaks (the upper partials follow the swell, raised to a
# power that grows with their number) and, held, swells once and eases, at one level. A small breath of air as the lips start the note,
# and the lips settle onto the pitch in its first 40 ms, a few cents, once. o.xin, o.xout: the note comes in, or lets go, over that long
# as the other player's note does the opposite (a hand-over: sine squared in, cosine squared out, so the two always add to one);
# o.ph: where its phase starts, in seconds, so a note handed over meets the one it takes over from in phase
WT_LO, WT_HI = Bb2, F4
ROOM = 0.24  # how much of the room each held note carries
PL = {1: -0.16, 2: 0.16}  # the two players' places: the first a little left, the second a little right
def _wt(m, sec, att=0.35, rel=0.7, xin=0.0, xout=0.0, ph=0.0, dyn=0.72, breath=1.0):
    f = hz(m); r = xout or rel; n = int((sec + r + 0.08) * SR); x = np.arange(n) / SR
    a_in = np.sin(0.5 * np.pi * np.minimum(1, x / (xin or att))) ** 2
    a_out = np.cos(0.5 * np.pi * np.clip((x - sec) / r, 0, 1)) ** 2 if xout else np.where(x > sec, np.exp(-(x - sec) * 4.6 / r), 1.0)
    sw = 0.88 + 0.12 * np.sin(np.pi * np.clip(x / sec, 0, 1)) if sec >= 1.2 else np.ones(n)
    br = dyn * sw * (0.62 + 0.38 * np.sin(0.5 * np.pi * np.minimum(1, x / max(0.05, xin or att))) ** 2)
    phase = 2 * np.pi * (np.cumsum(f * (1 - 0.004 * np.exp(-x / 0.04))) / SR + f * ph)
    s = np.zeros(n)
    for k in range(1, int(2100 // f) + 1):
        fk = f * k; w = k ** -0.9 * (0.28 + np.exp(-((fk - 380) / 260) ** 2)) * np.exp(-max(0.0, fk - 900) / 280)
        s += w * br ** (0.5 * (k - 1)) * np.sin(k * phase)
    s = s / max(1e-9, float(np.abs(s).max())) * a_in * a_out * sw
    s = s * np.cos(0.5 * np.pi * np.clip((x - x[-1] + 0.05) / 0.05, 0, 1)) ** 2
    s = s + breath * filt(_nz(n / SR + 0.01)[:n], 'band', (300, 1200)) * 0.005 * np.exp(-x / 0.05)
    return filt(s.astype(np.float32), 'low', 2000)
_PLAYED = {1: [], 2: []}  # each player's notes, (from, to), so neither plays two at once
def wt(m, a, b, p, g=1.0, **o):
    """player p (1 or 2) holds note m from a to b"""
    assert WT_LO <= m <= WT_HI, 'the Wagner tubas play B flat 2 to F 4'
    assert b > a, 'a tuba note ends before it starts (%.2f to %.2f)' % (a, b)
    for c, d in _PLAYED[p]:
        assert b <= c + 0.05 or a >= d - 0.05, 'player %d would hold two notes at once at %.1f s' % (p, max(a, c))
    _PLAYED[p].append((a, b)); _log(m, a, b + (o.get('xout') or 0.5))
    put(_held(_wt(m, b - a, **o), ROOM), a, g * TL, PL[p])
def duo(lo, hi, s, sec, g=1.0, step=0.26):
    """two notes held together: the first player takes the lower and comes in first, the second the higher, a moment after"""
    assert lo < hi
    wt(lo, s, s + sec, 1, g); wt(hi, s + step, s + sec, 2, g * 0.86)
def hand(m, a, h, b, g=1.0, xf=1.0):
    """the film's figure: the first player holds m from a; at h the second comes in on the same note as the first lets go, both over
    xf, in phase, so the note never stops and never swells; the second holds it to b"""
    assert a < h < b - xf
    wt(m, a, h, 1, g, xout=xf); wt(m, h, b, 2, g, xin=xf, ph=h - a, breath=0.0)

# ---- the glockenspiel. A steel bar, free at both ends, struck softly with a hard rubber mallet: its note, the bar's first overtone a
# little under a twelfth over it (2.76 times) and the next (5.40), each gone sooner than the one under it; a short, soft contact with
# no click to speak of. Its top is taken off at 2.4 kHz, so only the note and a trace of its first overtone are heard. It rings on about
# two seconds at G 5, a little less at D 6
GK_LO, GK_HI = G5, D6
def _ktau(m):
    return 0.85 * (777.0 / hz(m)) ** 0.4
def _gk(m):
    f0 = hz(m); tau = _ktau(m); sec = 5 * tau + 0.05; n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    sig = np.sin(2 * np.pi * f0 * x) * np.exp(-x / tau)
    for r, a, d in ((2.756, 0.22, 0.32), (5.404, 0.05, 0.12)):
        sig += a * np.sin(2 * np.pi * r * f0 * x + 0.7 * r) * np.exp(-x / (d * tau))
    sig *= np.minimum(1, x / 0.0012)
    nk = int(0.02 * SR)
    sig[:nk] += 0.03 * filt(_nz(0.02)[:nk], 'band', (600, 1800)) * np.exp(-x[:nk] / 0.003)
    return norm(filt(filt(sig.astype(np.float32), 'low', 2400), 'high', 300))
def gk(m, s, g=1.0, pan=0.0, room=0.1):
    """one bar of the glockenspiel, struck softly"""
    assert GK_LO <= m <= GK_HI, 'the glockenspiel plays G 5 to D 6'
    _log(m, s, s + 2.2 * _ktau(m))
    put(_room(_gk(m), room), s, g * KL, pan)

# ---- the series' mark: B flat, F, B flat, D rising, a tier at a time, on the two tubas (each player moves up as the other holds), and
# the glockenspiel's D answering the last
def mark(s, g=1.0, step=0.5, hold=2.6):
    end = s + step * 3 + hold
    wt(Bb2, s, s + step * 2, 1, g * 0.95); wt(F3, s + step, s + step * 3, 2, g * 0.86)
    wt(Bb3, s + step * 2, end, 1, g * 0.9); wt(D4, s + step * 3, end, 2, g * 0.84)
    gk(D6, s + step * 3 + 0.7, g * 0.9, 0.12)

# ---- the sounds on screen: soft, low, one at a time, each made here, on the effects bus
def _fx(sig, s, g, pan, top=2200):
    X(norm(filt(np.asarray(sig, np.float32), 'low', top)), s, g * FX, pan)
def _hump(x, sec, p=2.0):
    return np.sin(np.pi * np.clip(x / sec, 0, 1)) ** p
def _thud(n, f, d):
    x = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 2.1 * x) * np.exp(-x / (0.5 * d))) * np.exp(-x / d) * np.minimum(1, x / 0.0015)
def steps(s, k, every, g=0.005, pan0=0.0, pan1=0.0):
    """footsteps on packed earth, one at a time: a low, soft thud and a little grit"""
    for i in range(k):
        n = int(0.2 * SR); x = np.arange(n) / SR; pan = pan0 + (pan1 - pan0) * i / max(1, k - 1)
        _fx(_thud(n, 85 + 20 * R1.uniform(), 0.025) + 0.3 * filt(_nz(0.21)[:n], 'band', (300, 900)) * _hump(x, 0.08, 1.5), s + every * i + 0.04 * R1.uniform(), g * (0.85 + 0.3 * R1.uniform()), pan, 900)
def basket(s, g=0.008, pan=0.0):
    """a workman's basket of bricks set down: a dull, soft landing and a little grit settling"""
    n = int(0.32 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 95, 0.035) + 0.35 * filt(_nz(0.34)[:n], 'band', (250, 1100)) * _hump(x, 0.22, 1.4), s, g, pan, 1200)
def rubble(s, sec=1.8, g=0.007, pan=0.0):
    """a ruin crumbling, far off: one low, soft swell of falling earth, with a few dull knocks in it"""
    n = int(sec * SR); x = np.arange(n) / SR; sig = filt(_nz(sec + 0.02)[:n], 'band', (90, 480)) * _hump(x, sec, 1.2)
    for u in (0.22, 0.47, 0.71):
        i = int(u * n); m = min(n - i, int(0.3 * SR)); sig[i:i + m] += 0.6 * _thud(m, 70 + 30 * u, 0.05)
    _fx(sig, s, g, pan, 600)
def stamp(s, g=0.010, pan=0.0):
    """a stamp pressed into a brick's edge: a short, damp press and a low, soft thud as it bears down"""
    n = int(0.3 * SR); x = np.arange(n) / SR
    _fx(0.6 * _thud(n, 120, 0.03) + filt(_nz(0.32)[:n], 'band', (300, 1100)) * _hump(x, 0.12, 2), s, g, pan, 1100)
def clay(s, g=0.010, pan=0.0):
    """clay, softly: a dull knock, as the king's cylinder catches the light"""
    n = int(0.22 * SR); x = np.arange(n) / SR
    _fx(np.sin(2 * np.pi * 190 * x) * np.exp(-x * 40) + 0.35 * filt(_nz(0.22)[:n], 'band', (250, 900)) * np.exp(-x * 55), s, g, pan, 1200)
def trowel(s, sec=0.8, g=0.006, pan=0.0):
    """a trowel drawn over packed earth: a dry scrape that eases off"""
    n = int(sec * SR); x = np.arange(n) / SR; gr = np.abs(filt(_nz(sec + 0.02)[:n], 'low', 45)); gr = gr / max(1e-9, float(gr.max()))
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (300, 1300)) * _hump(x, sec, 1.0) * (0.45 + 0.55 * gr), s, g, pan, 1400)
def hush(s, sec=1.4, g=0.004, pan=0.0):
    """many small things coming in at once (ticks, tiles, rows, bars): one soft hush that swells and fades, never a burst of taps"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (300, 1400)) * _hump(x, sec, 1.6), s, g, pan, 1500)
def paper(s, g=0.010, pan=0.0, sec=0.45):
    """paper, softly: a sheet, a card or a page coming in"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (250, 2000)) * _hump(x, sec, 2), s, g, pan, 2000)
def pencil(s, sec=0.6, g=0.004, pan=0.0, k=3):
    """a pen on paper, a stroke at a time"""
    for i in range(k):
        d = sec / k * R1.uniform(0.7, 0.9); t = s + sec / k * i; m = int(d * SR); x = np.arange(m) / SR
        gr = np.abs(filt(_nz(d + 0.02)[:m], 'low', 50)); gr = gr / max(1e-9, float(gr.max()))
        _fx(filt(_nz(d + 0.02)[:m], 'band', (600, 1900)) * _hump(x, d, 0.7) * (0.35 + 0.65 * gr), t, g, pan, 2000)
def tick(s, g=0.005, pan=0.0):
    """a tick drawn: two quick strokes of a pen"""
    pencil(s, 0.22, g, pan, 2)
def strike(s, g=0.006, pan=0.0, sec=0.4):
    """a line struck through, or a row marked: a pen drawn quickly"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (450, 1800)) * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g, pan, 1900)
def drag(s, sec=1.2, g=0.005, pan=0.0):
    """something drawn or slid across: a slow, dry drag"""
    n = int(sec * SR); x = np.arange(n) / SR
    _fx(filt(_nz(sec + 0.02)[:n], 'band', (350, 1300)) * _hump(x, sec, 1.0), s, g, pan, 1500)
def knock(s, g=0.009, pan=0.0, f=240):
    """a soft wooden knock, for a card, a panel or a tile arriving"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.007, pan=0.0):
    """a muffled key, or a tag set in place"""
    s_tap(s, g * FX, pan)
def keys(s, k=3, g=0.006, pan=0.0, step=0.26):
    """a question typing itself in: a few muffled keys, then softer"""
    for i in range(k):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.7, pan)
def lock(s, g=0.008, pan=0.0):
    """a lock's click: a small click and a low knock"""
    s_tap(s, g * FX, pan); s_knock(s + 0.05, g * 0.7 * FX, pan, 180)
def plug(s, g=0.008, pan=0.0):
    """a cable plugging in: a soft, dull click"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.008, g * 0.6 * FX, pan)
def clunk(s, g=0.010, pan=0.0):
    """a street's power switched off: a switch thrown, low and heavy, and the line going quiet"""
    n = int(0.5 * SR); x = np.arange(n) / SR
    _fx(_thud(n, 70, 0.06) + 0.25 * filt(_nz(0.52)[:n], 'band', (200, 700)) * np.exp(-x / 0.02), s, g, pan, 800)
def hum(s, sec=1.8, g=0.004, pan=0.0):
    """a wire kept live: a low, soft hum that swells and fades, tuned to the film's B flat so it never beats with the tubas"""
    n = int(sec * SR); x = np.arange(n) / SR; f = hz(Bb2) / 2
    _fx(sum(a * np.sin(2 * np.pi * f * k * x + k) for k, a in ((2, 1.0), (3, 0.5), (4, 0.3), (5, 0.12))) * _hump(x, sec, 1.4), s, g, pan, 700)
def air(s, sec=0.9, g=0.008, pan=0.0):
    """things moving across the frame together: a breath of low air"""
    s_air(s, sec, g * FX, pan, 140, 900)


# 1. Allowed to collapse, again: the opening, two held notes to each picture. Babylon at dusk, air, and the tubas' open B flat as
#    Alexander's party walks in, its steps on the packed earth; E flat as the tower Nabopolassar began to rebuild is named. Falling into
#    ruin: G minor, and the ruin crumbling; not kept up: D under B flat. The order to build it again: E flat, air as the tower's outline
#    is drawn, and the workmen's baskets; Strabo's ten thousand men: F major, and paper for his words. Alexander dies: G minor's open
#    fifth; never rebuilt: B flat under G, and air as the outline goes. The quarry: D minor, and baskets as its bricks are carried off.
#    The house wall: E flat, and a stamp as its stamped bricks catch the light; the hole: a trowel. What was left needed keepers: the
#    film's figure, F handed from one player to the other. 1983: B flat and D, paper for the list's card and a key for the year; 2019:
#    F and B flat, a stamp as it's listed. Iraq's archaeologists: E flat, their steps along the edge, a knock for the fence; extremely
#    vulnerable: D minor's fifth. The utility: air, a hush as the map rises tier by tier, a tick as it's kept, and B flat; what it
#    describes keeps moving: air, a key for each lane, and D and G. Under the title, the series' mark
K = 'fall'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
air(0.3, 2.6, 0.007, 0.0)
tNr = w('city', 'nearly', -0.3)
duo(Bb2, F3, 0.8, tNr - 0.8, 0.95, 0.4)
steps(wc('city', 0.9), 7, 0.95, 0.004, px(-60), px(560))
duo(Eb3, G3, tNr, 3.4, 0.85)
duo(G3, Bb3, w('ruin', 'falling into ruin', -0.2), 3.0, 0.85)
rubble(wc('ruin', 0.4), 1.8, 0.006, px(980))
duo(D3, Bb3, w('ruin', 'not been kept up', -0.2), 2.8, 0.8)
tBa = w('order', 'build it again', -0.3)
duo(Eb3, Bb3, tBa, 3.0, 0.85); air(tBa, 1.2, 0.005, px(980))
basket(w('order', 'cleared', 0.4), 0.006, px(760)); basket(w('order', 'cleared', 1.6), 0.006, px(1220))
paper(wc('strabo', -0.1), 0.009, px(1520))
duo(F3, A3, w('strabo', 'ten thousand', -0.2), 3.0, 0.82)
basket(w('strabo', 'two months', -0.2), 0.006, px(700))
duo(G3, D4, w('died', 'Alexander dies', -0.2), 2.8, 0.82)
tNv = w('died', 'never rebuilt', -0.2)
duo(Bb2, G3, tNv, 3.0, 0.82); air(tNv, 1.6, 0.005, px(980))
duo(D3, F3, w('quarry', 'became a quarry', -0.2), 2.8, 0.8)
basket(w('quarry', 'became a quarry', 0.5), 0.006, px(1240)); basket(w('quarry', 'carried', -0.1), 0.006, px(1500))
duo(Eb3, G3, wc('walls', -0.2), 2.8, 0.8)
stamp(w('walls', 'history', -0.3), 0.009, px(1100))
trowel(w('walls', 'a hole', -0.2), 0.8, 0.005, px(960))
hand(F3, wc('need', -0.2), w('need', 'whose job', -0.1), wc('listed', -0.6), 0.85)
tLi = w('listed', 'In nineteen', -0.3)
paper(tLi, 0.009, px(1530)); duo(Bb2, D3, tLi + 0.1, 3.0, 0.82)
tap(w('listed', 'Iraq asked', -0.2), 0.005, px(1400))
tUl = w('listed', 'UNESCO listed', -0.2)
stamp(tUl, 0.008, px(1400)); duo(F3, Bb3, w('listed', 'In twenty nineteen', -0.2), 3.2, 0.8)
tKe = wc('keepers', -0.2)
duo(G3, Eb4, w('keepers', 'archaeologists', -0.2), 3.0, 0.8)
steps(tKe + 0.4, 6, 1.4, 0.004, px(240), px(700)); knock(tKe + 0.6, 0.006, px(960), 200)
duo(D3, A3, w('keepers', 'extremely', -0.2), 2.6, 0.78)
tUt = wc('utility', -0.6)
air(tUt, 1.6, 0.006, 0.0); hush(tUt + 0.3, 2.0, 0.003, 0.0)
tSk = w('utility', 'someone keeps', -0.3)
tick(tSk + 0.2, 0.004, px(940)); duo(Bb2, F3, tSk, 3.0, 0.82)
tMo = wc('moves', -0.4)
air(tMo, 1.2, 0.005, 0.0)
for word, x in (('processes', 300), ('words', 300), ('people', 300), ('what agents', 300)):
    tap(w('moves', word, -0.3), 0.004, px(x))
duo(D3, G3, w('moves', 'keeps moving', -0.2), 2.6, 0.78)
mark(wc('breath', 1.0), 0.95)

# 2. Five steps, not four: air as the street comes in, the crew's steps, and a soft plug as the panels are connected. The field app: a
#    knock as the tablet comes in, a few keys for the question, a hush as its four steps come. The manual: paper, a key as the fifth step
#    lights, and F and B flat. Why it matters: air as the street comes back, a knock as the ladder goes up, the switch thrown, the wire's
#    low hum as the panels keep it live, and the tubas' low D, alone. The copy: paper, and air as the answer comes from it. The week's
#    job sheets: paper, a pen marking the two rows; B flat and F for nobody hurt. Grace's question: an open fifth, F and C, held through
#    the pause
K = 'five'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
air(S0(K) + 0.2, 1.4, 0.006, px(1430))
steps(wc('year', 0.4), 3, 0.7, 0.004, px(1030), px(1130))
plug(w('year', 'connects', 0.3), 0.007, px(1270))
tAs = wc('asks', -0.3)
knock(tAs, 0.008, px(430)); keys(tAs + 0.3, 3, 0.005, px(560))
hush(w('asks', 'It answers', 0.1), 1.6, 0.003, px(430))
paper(wc('five', -0.3), 0.010, px(1440))
tFv = w('five', 'there are five', -0.2)
tap(tFv, 0.005, px(1440)); duo(F3, Bb3, tFv, 2.6, 0.8)
air(wc('why', -0.3), 1.2, 0.005, px(1430))
knock(w('why', 'when a crew', -0.3), 0.007, px(1000), 200)
clunk(w('why', 'switches the street off', 0.0), 0.009, px(1300))
hum(w('why', 'the panels could', -0.1), 2.2, 0.004, px(1280))
wt(D3, w('why', 'hurt the crew', -0.3), w('why', 'hurt the crew', 2.1), 1, 0.85)
paper(wc('copy', -0.3), 0.010, px(1420)); air(w('copy', 'answers from', -0.1), 1.0, 0.005, px(940))
paper(wc('two', -0.3), 0.010, px(960)); strike(w('two', 'caught it', -0.2), 0.005, px(1020))
duo(Bb2, F3, w('two', 'nobody was hurt', -0.2), 2.6, 0.8)
tWe = w('grace', 'what else', -0.2)
tap(tWe, 0.004, px(1520)); duo(F3, C4, tWe, 3.6, 0.78)

# 3. What moved: air as the map comes in and a knock for what's running; the glockenspiel's G as the map agent reads, and a hush as its
#    light passes over the map; a lock's click for read-only, a hush as the data is masked. What it found: a hush for the steps the map
#    doesn't show, a knock for each count, a key for the solar check. The glossary: paper, a key as "buys" is marked. The owners: a
#    knock, and air as their names grey. The agents: air, and paper for each copy. The checks: a tick as each passes, a hush as they
#    pass over the map. None of it came as a change: a knock, a key for each thing that moved, and G minor as the map didn't
K = 'moved'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
air(S0(K) + 0.3, 1.2, 0.006, px(1290)); knock(S0(K) + 0.4, 0.007, px(330))
gk(G5, w('read', 'reads', 0.0), 0.9, px(690))
hush(wc('read', 0.4), 2.4, 0.003, px(1290))
lock(w('read', 'read-only', -0.2), 0.007, px(330))
hush(w('read', 'personal', -0.3), 0.9, 0.003, px(330))
hush(w('steps', 'Nine steps', -0.2), 1.4, 0.003, px(1400))
for lid, word, x in (('steps', 'Nine steps', 900), ('words', 'Three words', 1130), ('people', 'Forty-one', 1360), ('agents', 'two agents', 1590)):
    knock(w(lid, word, -0.2), 0.007, px(x))
tap(w('steps', 'solar check', -0.3), 0.005, px(330))
paper(wc('words', -0.3), 0.010, px(330)); tap(w('words', 'still says', -0.2), 0.005, px(330))
knock(wc('people', -0.3), 0.006, px(330), 300); air(w('people', 'who has left', -0.3), 0.9, 0.004, px(1290))
air(wc('agents', -0.3), 0.9, 0.005, px(330))
paper(w('agents', "the field app's", -0.2), 0.008, px(380)); paper(w('agents', 'the meter agent', -0.2), 0.008, px(380))
tHp = w('passed', 'had passed', -0.3)
for i in range(3):
    tick(tHp + 0.3 * i, 0.004, px(330))
hush(w('passed', 'Every check', -0.1), 2.4, 0.003, px(1290))
knock(wc('never', -0.2), 0.007, px(1290))
for word in ('The work', 'the words', 'the people'):
    tap(w('never', word, -0.2), 0.004, px(330))
tMd = w('never', "the map didn't", -0.2)
tap(tMd, 0.005, px(330)); duo(G3, Bb3, tMd, 2.8, 0.8)

# 4. Last year's words: air as the agent comes in, a knock for its instructions, paper for each copy pasted in. The drift: paper for the
#    copy and the manual, and a pen striking through the equals. The website's chat: a knock for its window, a key for the question, a
#    hush for the answer, a knock for each place it reads. Every agent: air, a lock's click for the tool, a knock for each place it reads
#    through it, the glockenspiel's B flat as they read, and air as the copies go; E flat and B flat, never from a copy. The answer names
#    its version: a knock for the tablet, paper for the manual, a key as the version lights. Tested again: air as the loop turns, a tick
#    as the check passes, and B flat and D for the five steps
K = 'copy'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
air(S0(K) + 0.3, 0.9, 0.005, px(300)); knock(S0(K) + 0.5, 0.007, px(1180))
for nm, x in (('a manual', 750), ('a process', 1170), ('the glossary', 1590)):
    paper(w('paste', nm, -0.25), 0.008, px(x))
paper(wc('drift', -0.3), 0.009, px(780)); knock(wc('drift', -0.1), 0.006, px(1530), 300)
strike(w('drift', 'it drifts', -0.1), 0.005, px(1140))
knock(wc('chat', -0.3), 0.007, px(540)); tap(wc('chat', 0.2), 0.005, px(700)); hush(wc('chat', 0.8), 0.8, 0.003, px(460))
knock(w('chat', 'the glossary', -0.2), 0.006, px(1530), 300); knock(w('chat', 'data products', -0.2), 0.006, px(1530), 300)
air(wc('rule', -0.3), 1.0, 0.005, px(300))
lock(w('rule', 'through a tool', -0.3), 0.007, px(1040))
for word in ('the map', 'the glossary', 'the manuals'):
    knock(w('rule', word, -0.2), 0.006, px(1550), 300)
gk(Bb5, w('rule', 'through a tool', 0.1), 0.85, px(1040))
tNf = w('rule', 'never from a copy', -0.2)
air(tNf - 0.1, 1.0, 0.004, px(720)); duo(Eb3, Bb3, tNf, 2.6, 0.8)
knock(wc('cite', -0.3), 0.007, px(960))
tVe = w('cite', 'names the version', -0.3)
paper(tVe, 0.008, px(305)); tap(tVe + 0.2, 0.005, px(960))
air(wc('retest', -0.2), 1.0, 0.005, px(1630))
tFs = w('retest', 'five steps', -0.2)
tick(tFs + 0.6, 0.005, px(1630)); duo(Bb2, D3, tFs, 2.6, 0.8)

# 5. Someone moves on: a hush as her thirty elements come in, each with her name; E flat and G, warm, as she retires after thirty-one
#    years. The check: a tick as it keeps passing. Where she stood: air. The meter agent: air, a key as her name goes on it, a hush for
#    the five months, and G minor as nobody answers for it. The owner check now: a knock for the checks, another as the new one is added,
#    paper for the staff directory, a pen for who has left and who changed job, paper for the list her manager gets. The new metering
#    lead: a hush as the names change, a key for each handed on, and B flat and F as he confirms them
K = 'leaves'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
hush(wc('lead', 0.0), 1.6, 0.003, px(1210))
duo(Eb3, G3, w('lead', 'She retired', -0.2), 3.2, 0.82)
knock(wc('name', -0.3), 0.006, px(1110), 300); tick(w('name', 'kept passing', -0.3), 0.004, px(800))
air(wc('sees', -0.3), 0.9, 0.004, px(230))
air(wc('agent', -0.3), 0.9, 0.005, px(330)); tap(w('agent', 'handed to her', 0.3), 0.005, px(330))
hush(w('agent', 'five months', -0.2), 2.0, 0.003, px(320))
duo(D3, Bb3, w('agent', 'nobody answered', -0.3), 3.0, 0.8)
knock(wc('now', -0.3), 0.007, px(1100)); knock(w('now', 'also reads', -0.2), 0.006, px(1100), 300)
paper(w('now', 'staff directory', -0.4), 0.009, px(420))
strike(w('now', 'someone leaves', -0.2), 0.004, px(420)); strike(w('now', 'changes job', -0.2), 0.004, px(420))
paper(w('now', 'it lists', -0.2), 0.009, px(1650))
tCo = w('confirm', 'confirms', -0.2)
hush(tCo + 0.1, 2.2, 0.003, px(1210)); tap(w('confirm', 'hands it', -0.1), 0.005, px(1300))
duo(Bb2, F3, tCo, 2.8, 0.8)

# 6. A job, not a project: air as the map comes in, a hush as its owners' ticks are stamped, a drag as the whole is ringed. The book: a
#    knock. A product, not a project: a drag along the line, a tick as it's checked. The capability: a knock as it's put on the map, and
#    G and E flat. Its owner: paper for the card, a key for each row, and the film's figure: B flat, handed from Tomás's player to Inés's
#    as the line says she is his deputy. Its rhythm: a knock as it comes, and the glockenspiel's note at each beat, B flat, D, G as the
#    map agent reads, A, and B flat; air as the agent works
K = 'job'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
air(S0(K) + 0.2, 1.2, 0.006, px(960)); hush(wc('whole', 0.3), 2.4, 0.003, px(960))
drag(w('whole', 'the whole', -0.2), 1.6, 0.004, px(960))
knock(wc('term', -0.3), 0.007, px(960))
drag(w('product', 'as a product', -0.3), 1.6, 0.004, px(960)); tick(w('product', 'checked as', 0.2), 0.004, px(1180))
tKm = w('cap', 'keeping the map', -0.2)
knock(tKm, 0.006, px(1318), 300); duo(G3, Eb4, w('cap', 'a capability', -0.2), 2.8, 0.8)
paper(wc('owner', -0.3), 0.009, px(960))
for lid, word in (('owner', 'a role'), ('owner', 'held by'), ('budget', 'the yearly plan')):
    tap(w(lid, word, -0.3), 0.004, px(960))
hand(Bb3, w('owner', 'held by', -0.2), w('owner', 'as deputy', -0.1), END(K, 'owner') + 0.8, 0.85)
knock(wc('rhythm', -0.3), 0.006, px(960))
for (lid, word), m, x in ((('rhythm', 'On every change'), Bb5, 400), (('rhythm', 'The day someone'), D6, 400), (('month', 'Every month'), G5, 1606),
                          (('quarter', 'Every quarter'), A5, 400), (('quarter', 'every year'), Bb5, 400)):
    gk(m, w(lid, word, 0.0), 0.8, px(x))
air(wc('month', 0.2), 1.0, 0.004, px(1606))

# 7. Five series, one idea: a knock for each tier of the tower as it rises, and B flat and D for the same idea; paper for each series'
#    card; F and B flat as all five meet in one idea; a key for how to keep one map, and paper for each of the two films
K = 'series'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
for k in range(5):
    knock(wc('last', 0.2 + (k + 0.5) * 0.48), 0.005, px(560), 220 + 30 * k)
duo(Bb2, D3, w('last', 'five series', -0.2), 2.8, 0.8)
for lid in ('map', 'business', 'data', 'platform', 'here'):
    paper(wc(lid, -0.3), 0.008, px(1470))
duo(F3, Bb3, w('here', "someone's job", -0.2), 3.0, 0.8)
tap(wc('links', -0.2), 0.004, px(1470))
paper(w('links', 'in a tool', -0.2), 0.008, px(1470)); paper(w('links', 'in a repository', -0.2), 0.008, px(1470))

# 8. Back to Babylon: air as the city wall comes back at dusk; clay as the king's cylinder catches the light, and E flat and G; paper
#    for his words. A request isn't a practice: the ruin crumbling as the tower falls, and B flat under G. Babel: one soft hush as the
#    builders' bubbles come, none answering another. The next spring: a drag as the glossary's words slip one at a time; a hush as the
#    month's bars come, the glockenspiel's G for the monthly read, a tick as each is fixed; a hush for every new home's check; air and a
#    knock as every agent reads this month's words, and F and D. In the last pause, the wall and the map side by side: air, the film's
#    figure once more, D handed from one player to the other, and the glockenspiel's D as the map is kept
K = 'back'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
air(S0(K) + 0.2, 1.4, 0.006, 0.0)
tLw = w('wall', 'left words', -0.2)
clay(tLw + 0.4, 0.009, px(760)); duo(Eb3, G3, tLw, 3.2, 0.82)
paper(w('wall', 'when this wall', -0.4), 0.008, px(600))
tFe = w('practice', 'it fell', -0.2)
rubble(tFe - 0.2, 2.6, 0.006, px(1180)); duo(Bb2, G3, tFe, 3.0, 0.8)
hush(w('babel', 'stopped understanding', -0.2), 1.6, 0.003, px(700))
drag(w('slowly', 'one word', -0.4), 2.2, 0.004, px(960))
tMr = w('spring', 'monthly read', -0.2)
hush(tMr, 2.4, 0.003, px(960)); gk(G5, tMr + 0.2, 0.8, px(960))
tick(w('spring', 'each fixed', 0.3), 0.004, px(960))
hush(w('homes', 'solar home', -0.2), 1.4, 0.003, px(520))
tEa = w('homes', 'every agent', -0.3)
air(tEa, 1.0, 0.005, px(1100)); knock(tEa + 0.2, 0.006, px(1550), 300)
duo(F3, D4, w('homes', "this month's words", -0.2), 2.8, 0.8)
tB = wc('breath')
air(tB - 0.3, 1.4, 0.005, 0.0)
hand(D3, tB - 0.1, tB + 1.3, tB + 3.4, 0.85)
gk(D6, tB + 1.8, 0.85, px(1434))

# 9. Kept alive: paper as the answer's note comes in, and a pen as it's written; B flat and F as Tomás and Inés hear it; the
#    glockenspiel's B flat as the map is kept, and E flat and B flat; a knock for the next topic's card; under the end card, without
#    words, the series' mark
K = 'end'
w = lambda lid, word, off=0: W(K, lid, word, off)
wc = lambda lid, off=0: C(K, lid, off)
tA = wc('answer')
paper(tA - 0.1, 0.010, px(960)); pencil(tA + 0.3, 11.0, 0.004, px(960), 11)
duo(Bb2, F3, w('answer', 'an owner', -0.2), 2.8, 0.8)
tKp = w('next', 'is kept', -0.2)
gk(Bb5, tKp + 0.2, 0.8, px(760)); duo(Eb3, Bb3, tKp, 2.8, 0.8)
knock(w('next', 'Data governance', -0.3), 0.007, px(1230))
mark(wc('breath', 0.7), 0.95)

_pure()
