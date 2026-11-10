# Tools are hands, and every hand is a permission: the music and sounds, played by tools/audio.py with From words to data's
# instruments (shared/tools/music.py). The film's own palette, reserved for it on 4 November 2026 by the series thread and checked
# against every score on main and on every branch (palettes.md, in the series' project files): two instruments, both made here, as
# music.py has neither.
#  - A hurdy-gurdy, its melody string only: no drone strings and no buzzing bridge. A rosined wheel, turned by a crank, bows the string,
#    and the player's other hand presses keys whose wooden tangents stop it, each key at one place; the hand never touches the string.
#    A hand that acts only through its tool, and only where the tool lets it. A bowed tone, a little nasal, steady, with the soft
#    knock of a key at each new note, and no vibrato (a tangent can't make one).
#  - A rackett, the low, soft double reed of Bodley's time: its long bore folded nine times inside a small wooden cylinder, so a hand's
#    width of wood plays as low as a bassoon. Its bore is a closed pipe, so its odd harmonics lead; played softly, low, and without
#    vibrato, it answers the hurdy-gurdy's key an octave or two down.
# Neither belongs to a tradition whose music the film could borrow, and nothing here imitates the music of any culture: no mode,
# ornament or rhythm of any tradition, and no tune of Oxford's or of its time.
# The marks mean the same all through:
#  - The mark: a key pressed, and its one note, answered low: the hurdy-gurdy's key knocks, its note sounds, and the rackett answers
#    the same note two octaves down. It sounds where a rule holds (Bodley's board; the lock that stops the hidden line; "what a tool
#    can't do, no instruction can make it"; the rule that held for a king), and for the title and the end. Each time on another note,
#    so no figure comes back.
#  - A rule's line, lit on a board: one key and its note, a note to a line, never a tune.
#  - The emptied library: the rackett alone, low and slow, in B-flat minor.
# D-flat major for the 1400s and for the library Bodley restores; B-flat minor from 1550, when the books are taken; D-flat major from
# 1602, through the king, to today; the lab in D-flat major. Every interval is tuned pure from D flat (just intonation, see hz()), and
# the two lines are voiced apart (the hurdy-gurdy above middle C, the rackett two octaves under), so nothing beats.
# The rules the series keeps (its briefs, 4 November 2026; the author's review of What an agent is, the same day):
#  - Music under the opening story, and after it only at a chapter's turn, under a moment on screen or in a pause without words;
#    never a bed under the voice. tools/quiet.py checks it, and that no figure comes back soon or often.
#  - Nothing trembles: the wheel bows evenly, the reed is steady, a long note swells once and eases. No pulse anywhere (film.json
#    lists no urgent chapter): the hidden line is met by hands that can't do what it asks, and nothing rushes.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/scenes.js
#    (the same word and offset), so sound and picture stay together when the voice is re-timed. One at a time: where many things
#    move at once (seventy-two books arriving, or carried away), one soft texture, and only the nearest few heard on their own.
# And everything stays low and soft, below about 2.5 kHz; the two instruments matched by loudness, the effects about 12 dB under.

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
R1 = np.random.default_rng(23)  # this film's own randomness: the wheel's rosin, the reed's breath, the books, the paper

# ---- tuning: just intonation from D flat, so the two lines' notes are whole-number ratios of each other and nothing beats. D-flat
# major's notes and B-flat minor's (its A natural a pure major third over F) are all pure in this table; E flat is the major tone over
# D flat (9/8), and no chord here holds it against G flat or B flat, the two impure pairs it would make
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 25 / 16, 9: 5 / 3, 10: 16 / 9, 11: 15 / 8}
Db3f = 138.59
def hz(m):
    o, pc = divmod(m - 49, 12)
    return Db3f * 2 ** o * _JI[pc]
# the notes by name (MIDI numbers; D flat 3 is 49)
Db1, Eb1, F1, Gb1, Ab1, Bb1, C2 = 25, 27, 29, 30, 32, 34, 36
Db2, Eb2, F2, Gb2, Ab2, A2, Bb2, C3 = 37, 39, 41, 42, 44, 45, 46, 48
Db3, Eb3, F3, Gb3, Ab3, A3, Bb3, C4 = 49, 51, 53, 54, 56, 57, 58, 60
Db4, Eb4, F4, Gb4, Ab4, A4, Bb4, C5 = 61, 63, 65, 66, 68, 69, 70, 72
Db5, Eb5, F5 = 73, 75, 77

# ---- the levels: the two instruments matched by loudness, about as far under the voice as the series' other music; the effects about
# 12 dB under the music (FX scales them all). As the series' other films do since the author's review of 4 November 2026, the music
# sits as low as the governance films' (tools/quiet.py measures it)
HG, RK, FX = 0.028, 0.036, 3.1

# a room of stone and oak round the players, ringing on for about a second and a half. Its level is set by what it rings where the
# notes are (its gain from 100 Hz to 1.5 kHz is one), as the video guidelines ask: scaled by all it rang, as at first, it rang 10 dB
# louder there than its share said. _room() keeps each note as loud as it was dry, as before
def _band(ir):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << int(np.ceil(np.log2(len(ir) * 2))); f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt((np.abs(np.fft.rfft(ir.astype(np.float64), nf))[(f > 100) & (f < 1500)] ** 2).mean()))
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.5)).astype(np.float32))(np.arange(int(1.5 * SR)) / SR)
_IR = filt(_IR, 'low', 1500); _IR[:int(0.02 * SR)] = 0; _IR /= _band(_IR)
def _room(sig, k, a=0.0, b=1.0):
    """the room round a note; it keeps the note as loud as it was dry (its rms from a to b seconds), because a room lifts some pitches
    and hollows others, and every note should sound as loud as its neighbours"""
    if not k:
        return sig
    out = (np.pad(sig, (0, len(_IR) - 1)) + k * fftconvolve(sig, _IR)).astype(np.float32)
    i, j = int(a * SR), max(int(a * SR) + 1, min(len(sig), int(b * SR)))
    r0, r1 = np.sqrt((sig[i:j] ** 2).mean()), np.sqrt((out[i:j] ** 2).mean())
    return out * np.float32(r0 / r1) if r1 > 0 else out

# ---- the hurdy-gurdy's melody string. A bowed string's harmonics fall away as 1/k; the wheel's narrow edge and the small box lift
# the string's nasal middle (round 500 Hz and 1.1 kHz); played softly, nothing above about 2.3 kHz. The wheel catches the string over
# a few hundredths of a second, the upper harmonics last; a key pressed while the wheel turns changes the note at once, with no
# slide, and its tangent's knock; the wheel bows evenly, with only a breath of rosin under the tone. Held notes swell once and ease
def _bowed(f):
    """the weights of the soft melody string's harmonics, at f Hz"""
    n = max(1, int(2300 // f)); k = np.arange(1, n + 1); fk = f * k
    a = (1 / k ** 0.95) * (1 + 0.55 * np.exp(-((fk - 520) / 190) ** 2) + 0.7 * np.exp(-((fk - 1120) / 300) ** 2)) * np.exp(-fk / 2300)
    return a / np.sqrt((a ** 2).sum())
def hg(notes, s, g=1.0, att=0.06, rel=0.22, pan=None, room=0.32, keys=True):
    """a phrase on the melody string, from s: notes are (note, seconds); a key changes the note at once, the string bowed throughout.
    The wheel stops after the last note, over rel seconds"""
    total = sum(d for _, d in notes); n = int((total + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR
    f = np.zeros(n); t0 = 0.0; starts = []
    for m, d in notes:
        i, j = int(t0 * SR), int((t0 + d) * SR); f[i:j] = hz(m); starts.append(t0); t0 += d
    f[int(total * SR):] = hz(notes[-1][0]); ph = 2 * np.pi * np.cumsum(f) / SR
    sig = np.zeros(n); seg = np.searchsorted(np.array(starts), x, side='right') - 1
    for idx, (m, d) in enumerate(notes):
        w = _bowed(hz(m)); on = seg == idx
        if idx == len(notes) - 1:
            on = x >= starts[idx]
        tone = np.zeros(on.sum()); xs = x[on]
        for k, ak in enumerate(w, start=1):
            rise = np.sin(0.5 * np.pi * np.minimum((xs - (starts[idx] if idx else 0)) / (att * (0.6 + 0.4 * k)) + (0.35 if idx else 0), 1)) ** 2
            tone += ak * rise * np.sin(k * ph[on] + 0.3 * k * k)
        sig[on] = tone
    e = np.minimum(1, x / att) * np.where(x > total, np.cos(0.5 * np.pi * np.minimum((x - total) / rel, 1)) ** 2, 1.0)
    if total >= 1.2:
        e = e * (0.86 + 0.14 * np.sin(np.pi * np.clip(x / total, 0, 1)))
    sig = sig * e + 0.006 * filt(noise(n / SR + 0.01)[:n], 'band', (500, 2000)) * e  # the rosin, under the tone
    sig = filt(sig.astype(np.float32), 'low', 2300)
    sig = _room(sig, room, min(0.2, total * 0.3), total)
    mid = np.mean([m for m, _ in notes])
    put(sig.astype(np.float32), s, g * HG, max(-0.3, min(0.3, (mid - 66) * 0.02)) if pan is None else pan)
    if keys:  # each key's tangent, a small wooden knock, on the effects bus with the hands
        for t in starts:
            s_knock(s + t, 0.0035 * FX * g, (0.0 if pan is None else pan), 520)
def note(m, s, d, g=1.0, **k):
    """one key, and its note, held d seconds"""
    hg([(m, d)], s, g, **k)

# ---- the rackett: a double reed on a closed bore, so its odd harmonics lead and its even ones are faint; a soft, round, low buzz,
# its top rolled off above about 1 kHz. The reed speaks a moment after the breath, with a little air as it starts; steady, no vibrato;
# a long note swells once and eases; it stops when the player stops blowing
def _rack(f):
    n = max(1, int(2000 // f)); k = np.arange(1, n + 1); fk = f * k
    a = (1 / k) * np.where(k % 2 == 1, 1.0, 0.28) * (1 + 0.6 * np.exp(-((fk - 440) / 160) ** 2)) * np.exp(-fk / 1100)
    return a / np.sqrt((a ** 2).sum())
def rk(m, a, b, g=1.0, att=0.12, rel=0.35, pan=None, room=0.34):
    """one rackett note from a to b"""
    f = hz(m); sec = max(0.15, b - a); n = int((sec + rel + 0.05) * SR); x = np.arange(n, dtype=np.float64) / SR; sig = np.zeros(n)
    for j, aj in enumerate(_rack(f)):
        k = j + 1; on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.25 * (k - 1))), 1)) ** 2
        sig += aj * on * np.sin(2 * np.pi * f * k * x + 0.5 * k)
    e = np.where(x > sec, np.cos(0.5 * np.pi * np.minimum((x - sec) / rel, 1)) ** 2, 1.0)
    if sec >= 1.0:
        e = e * (0.84 + 0.16 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    sig = sig * e; nb = min(n, int(0.2 * SR))
    sig[:nb] += 0.03 * filt(noise(0.2), 'band', (250, 1200))[:nb] * np.exp(-np.arange(nb) / SR / 0.06)
    sig = filt(sig.astype(np.float32), 'low', 1800)
    sig = _room(sig, room, min(att * 2, sec * 0.5), sec)
    put(sig.astype(np.float32), a, g * RK, -0.08 if pan is None else pan)

# ---- what they play
def mark(m, s, hold=1.6, low=24, g=1.0):
    """the mark: a key pressed and its one note, answered low: the rackett, the same note two octaves (low=24) down, half a second on"""
    note(m, s, hold, g * 0.9, rel=0.5)
    rk(m - low, s + 0.5, s + 0.5 + hold + 0.4, g, att=0.18, rel=0.6)
def duet(line, bass, s, g=1.0, room=0.32):
    """the two together: the hurdy-gurdy's line from s, and the rackett's notes under it, (note, from, to) in seconds after s"""
    hg(line, s, g, room=room)
    for m, a, b in bass:
        rk(m, s + a, s + b, g * 0.85)

# ---- soft sounds, all low-passed, on the effects bus
def knock(s, g=0.010, pan=0.0, f=240):
    """a soft wooden knock: a card set down, a book laid on a desk"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.006, pan=0.0):
    """a muffled click: a key, a small card"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.005, pan=0.0, step=0.2):
    """keys typed softly"""
    for i in range(n):
        tap(s + i * step + 0.04 * R1.uniform(), g if i < 2 else g * 0.75, pan)
def tick(s, g=0.007, pan=0.0):
    """a tick drawn: its two strokes, short and soft"""
    s_tap(s, g * FX, pan); s_tap(s + 0.08, 0.7 * g * FX, pan)
def paper(s, g=0.007, pan=0.0, sec=0.3):
    """a sheet laid down, or a page turned"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2 * np.exp(-x / (0.5 * sec)), s, g * FX, pan)
def slide(s, sec=0.8, g=0.007, pan=0.0, lo=220, hi=1500):
    """a card, a book or a page slid along: a dry, even rub"""
    x = tt(sec); gr = filt(noise(sec), 'low', 25)[:len(x)]; gr = 0.65 + 0.35 * gr / max(1e-9, float(np.abs(gr).max()))
    X(filt(noise(sec), 'band', (lo, hi))[:len(x)] * np.sin(np.pi * x / sec) ** 1.4 * gr, s, g * FX, pan)
def air(s, sec=0.8, g=0.006, pan=0.0, lo=140, hi=900):
    """something moving: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)
def quill(s, sec=1.0, g=0.006, pan=0.0):
    """a pen on paper: a soft, grainy scratch"""
    x = tt(sec); gr = np.abs(filt(noise(sec), 'low', 60)[:len(x)]); gr = gr / max(1e-9, float(gr.max()))
    X(filt(noise(sec), 'band', (600, 2200))[:len(x)] * np.sin(np.pi * x / sec) ** 0.5 * (0.3 + 0.7 * gr), s, g * FX, pan)
def stroke(s, g=0.006, pan=0.0):
    """one stroke of a pen: a line drawn through a word"""
    quill(s, 0.28, g, pan)
def _clink(s, fs, g, pan, dec=26):
    """metal kept low: a few partials, quickly damped, nothing above about 2.3 kHz"""
    x = tt(0.3); c = sum(np.sin(2 * np.pi * f * x + i) * np.exp(-x * (dec + 0.01 * f)) for i, f in enumerate(fs)) * np.minimum(1, x / 0.002)
    X(norm(filt(c.astype(np.float32), 'low', 2300)), s, g, pan)
def chain(s, g=0.006, pan=0.0):
    """an iron chain's links touching: a dull, low clink, damped at once"""
    f = 620 + 140 * R1.uniform(); _clink(s, (f, f * 1.41, f * 2.02), g * FX, pan, 40); _clink(s + 0.04, (f * 1.08, f * 1.53), 0.5 * g * FX, pan, 55)
def taut(s, g=0.007, pan=0.0):
    """a chain drawn taut: its links settling into a line, and the pull stopping"""
    chain(s, g * 0.7, pan); chain(s + 0.12, g, pan); s_knock(s + 0.13, 0.4 * g * FX, pan, 180)
def lock(s, g=0.008, pan=0.0):
    """a small lock closing: two soft metal clicks"""
    _clink(s, (1150, 1720), g * FX, pan, 60); _clink(s + 0.05, (980, 1530), 0.7 * g * FX, pan, 70)
def keyring(s, g=0.007, pan=0.0):
    """a key on a ring: two soft clinks"""
    _clink(s, (1180, 1630, 2050), g * FX, pan); _clink(s + 0.055, (1270, 1710, 2180), 0.7 * g * FX, pan)
def plug(s, g=0.008, pan=0.0):
    """a plug going home in its socket: a dull, firm click"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, 0.6 * g * FX, pan)
def creak(s, sec=0.5, g=0.005, pan=0.0, f0=150, f1=110):
    """oak giving: a desk carried off, a book's leather cover opening; a low, slow creak"""
    x = tt(sec).astype(np.float64); f = f0 + (f1 - f0) * x / sec; ph = 2 * np.pi * np.cumsum(f) / SR
    tone = sum(np.sin(k * ph) / k for k in range(1, 9)); env_ = np.sin(np.pi * x / sec) ** 1.5
    X(filt((tone * env_).astype(np.float32), 'band', (200, 1100)) / 3, s, g * FX, pan)
def flame(s, g=0.006, pan=0.0):
    """a candle's flame catching: a soft, low breath"""
    x = tt(0.5); X(filt(noise(0.5), 'band', (120, 700))[:len(x)] * np.minimum(1, x / 0.03) * np.exp(-x / 0.14), s, g * FX, pan)
def books(s, sec, g=0.004, pan=0.0):
    """many books laid down, or lifted away, far off down the room: one soft texture of paper and wood that swells and eases"""
    x = tt(sec); gr = filt(noise(sec + 0.1), 'low', 6)[:len(x)]; gr = 0.6 + 0.4 * gr / max(1e-9, float(np.abs(gr).max()))
    X(filt(noise(sec), 'band', (240, 1300))[:len(x)] * np.sin(np.pi * x / sec) ** 1.2 * gr, s, g * FX, pan)

# =============================================================================================================================
# 1. The Bodleian's rule: the opening, under the duet all through, with its breaths. Oxford in the 1400s, D-flat major, the
#    hurdy-gurdy's line over the rackett; the duke's books arriving down the long room, a soft swell of paper and wood, and the
#    scholar's own four laid on his desk. 1550: B-flat minor; the books lifted away, the chains left swinging; 1556, the desks carried
#    off. Copied by hand: the pen; once gone, gone for good: one note, and nothing after it. Half a century with no library: the
#    rackett alone, low and slow. A chain swinging under an empty desk; something has to change: the line rises and stays open. Bodley
#    in London, 1598: his letter, and a stroke of the pen for each of seats, shelves and desks; the line climbing home. 1602, D-flat
#    major: the library opens. The rule: one key and its note for each line lit on the board; your notes in your own book, the pen;
#    the candle, and the stroke through it. Every reader's promise; the chained books; the book pulled, the chain taut. The rule holds,
#    whoever asks: the mark. The king in 1645, at war: B-flat minor; the librarian opens the statutes; the king agrees, and the duet comes
#    home. Today: D-flat major, higher. Then the lab: the picture on the wall, the six hands reaching, and the title's mark
rw = lambda lid, word, off=0: W('rule', lid, word, off)
rc = lambda lid, off=0: G('rule', lid, off)
gives, scholars, longroom = rw('duke', 'gives'), rw('duke', 'scholars'), rw('duke', 'long room')
# Oxford, in the 1400s: the long room, its lecterns waiting; the film's first phrase 1 dB softer, as it begins
duet([(Ab4, 1.5), (Bb4, 0.7), (Ab4, 0.7), (F4, 2.2)], [(Db2, 0.0, 5.0)], 0.4, 0.89)
# the duke gives his books: they arrive down the room, far ones first, the nearest four on the scholar's desk last
duet([(F4, 0.8), (Gb4, 0.8), (Ab4, 1.2), (Db5, 2.2)], [(Gb2, 0.0, 2.4), (Ab2, 2.5, 4.9)], gives - 0.35)
books(gives + 0.9, 1.6, 0.0045, px(900))
knock(gives + 2.2, 0.008, px(1290), 230); knock(gives + 2.33, 0.007, px(1720), 250)
# a long room built to hold them: the camera settles down the room
duet([(C5, 1.0), (Bb4, 0.8), (Ab4, 2.4)], [(Ab2, 0.0, 1.8), (Db2, 1.9, 4.2)], longroom - 0.25)
# then, in 1550, in years of religious upheaval: B-flat minor; the books are taken away, sold or lost, the chains left swinging
y1550, away = rw('taken', 'fifteen fifty'), rw('taken', 'taken away')
duet([(Db5, 1.2), (C5, 0.8), (Bb4, 2.0)], [(Bb1, 0.0, 2.2), (Gb2, 2.3, 4.0)], y1550 - 0.3)
books(away, 3.0, 0.0045, px(980))
for d, xx in ((0.5, 760), (1.15, 1260), (1.8, 600), (2.5, 1380)):
    chain(away + d, 0.0045, px(xx))
duet([(F4, 1.0), (Gb4, 0.8), (F4, 2.0)], [(Db2, 0.0, 1.6), (Bb1, 1.7, 3.8)], away + 1.4)
# by 1556, even the desks are sold: the lecterns go, far ones first
even = rw('desks', 'even the desks')
creak(even + 0.1, 0.9, 0.0045, px(1150), 150, 115); air(even + 0.2, 1.4, 0.005, px(960), 120, 700)
duet([(Eb4, 1.0), (Db4, 2.4)], [(Gb2, 0.0, 1.0), (F2, 1.1, 3.4)], even - 0.2)
# each had been copied by hand: the pen; and some had no other copy: once gone, gone for good, one note and nothing after it
nocopy, gone, good = rw('byhand', 'no other copy'), rw('byhand', 'once gone'), rw('byhand', 'for good')
quill(rc('byhand', -0.1), nocopy - rc('byhand') + 0.3, 0.0045, px(560))
hg([(Bb4, 1.3), (A4, 0.9), (Bb4, 1.6)], rc('byhand', 0.1), 0.85)
rk(Gb2, rc('byhand', 0.2), nocopy + 0.6, 0.8)
air(gone, good - gone + 0.6, 0.004, px(560))
note(F4, gone, good - gone + 0.8, 0.8, rel=0.9)
# for half a century, the university has no library: the rackett alone, low and slow
rk(Bb1, rc('nolib', -0.2), rc('nolib', 1.8), 0.9, rel=0.6)
rk(F2, rc('nolib', 2.0), rc('nolib', 3.9), 0.85, rel=0.8)
# a library is only as safe as the hands that can reach it: the empty chain, swinging under its desk, at the end of its swing
something = rw('reach', 'Something')
chain(rc('reach', -0.2), 0.0035, px(980)); chain(38.56, 0.003, px(1010))
hg([(Db4, 1.2), (F4, 1.0), (Ab4, 2.2)], rc('reach', 0.3), 0.85)
rk(Bb1, rc('reach', 0.4), rc('reach', 3.6), 0.8)
# something has to change: the empty room in a warmer light; the line rises and stays open, on A flat
duet([(Bb4, 0.9), (C5, 1.0), (Eb5, 2.4)], [(Ab2, 0.2, 4.1)], something - 0.1, 0.9)
# 1598: Thomas Bodley, in London, his letter in his hand; he offers to restore it, with seats, and shelves, and desks
offers = rw('bodley', 'offers')
paper(rc('bodley', 0.0), 0.006, px(900))
duet([(Gb4, 1.4), (Ab4, 0.8), (Bb4, 2.2)], [(Gb2, 0.0, 2.1), (Eb2, 2.2, 4.4)], rc('bodley', 0.2), 0.9)
paper(offers - 0.2, 0.006, px(960), 0.35)
for w in ('seats', 'shelves', 'desks'):
    stroke(rw('bodley', w, -0.15), 0.005, px(960))
duet([(Ab4, 1.0), (Bb4, 0.6), (C5, 1.6)], [(Ab2, 0.0, 3.4)], offers + 0.6, 0.85)
# it opens on the 8th of November, 1602: D-flat major, home
duet([(Db5, 1.4), (C5, 0.6), (Db5, 0.6), (Ab4, 2.0)], [(Db2, 0.0, 2.4), (Gb2, 2.5, 4.7)], rc('opens', -0.2))
# on one rule: a key and its note for each line lit on the board
take = rw('rule1', 'Take')
note(Ab4, rc('rule1', -0.1), 1.2, 0.8); note(F4, take - 0.1, 1.2, 0.8); note(Gb4, rc('rule2', -0.1), 1.1, 0.8)
rk(Db2, rc('rule1', 0.0), take + 1.3, 0.6)
# your notes go in your own book: the pen; and bring no flame: the candle, and a stroke through it
notes_, fl = rw('rule2', 'your notes'), rw('rule2', 'flame')
quill(notes_, 2.2, 0.0045, px(1280))
flame(fl - 0.7, 0.005, px(1340)); stroke(fl, 0.006, px(1340))
note(Eb4, fl + 0.1, 1.6, 0.75, rel=0.7)
# every reader promises to keep it; the books chained to their shelves; read at the desk, pulled, the chain drawn taut, and nowhere else
chained, readAt, nowhere = rw('promise', 'chained'), rw('promise', 'read at'), rw('promise', 'nowhere else')
duet([(F4, 1.1), (Ab4, 0.8), (Gb4, 0.8), (F4, 1.8)], [(Db2, 0.0, 2.2), (Bb1, 2.3, 4.4)], rc('promise', -0.1), 0.9)
chain(chained, 0.004, px(1100))
slide(readAt, nowhere + 0.4 - readAt, 0.005, px(960), 200, 1100); taut(nowhere + 0.35, 0.006, px(960))
# the rule holds, whoever asks: the mark, on A flat
mark(Ab4, rc('holds', -0.2), 1.6)
# in 1645, King Charles the First, at war and living in Oxford, asks to borrow a book: B-flat minor; the librarian shows him the rule,
# the statutes opening in his hands; the king agrees, and the book stays: the duet comes home, and the chain at rest
showsRule, agrees, stays = rw('shows', 'shows him the rule'), rw('shows', 'agrees'), rw('shows', 'the book stays')
duet([(Db5, 1.2), (C5, 0.9), (Bb4, 1.0), (A4, 1.8)], [(Bb1, 0.0, 2.3), (F2, 2.4, 4.9)], rc('king', 0.0), 0.85)
creak(showsRule + 0.05, 0.45, 0.004, px(700), 210, 170); paper(showsRule + 0.3, 0.006, px(700), 0.4)
duet([(Bb4, 0.9), (Ab4, 0.8), (F4, 1.0), (Db4, 2.4)], [(Gb2, 0.0, 1.8), (Ab2, 1.9, 2.8), (Db2, 2.9, 5.0)], agrees - 0.3, 0.85)
chain(stays + 0.25, 0.0035, px(1100))
# four hundred years on, still there for every reader: today, D-flat major, the line higher
duet([(Ab4, 0.9), (Db5, 1.0), (Eb5, 0.8), (F5, 2.4)], [(Db2, 0.0, 2.6), (Ab2, 2.7, 5.0)], rc('still', 0.0), 0.85)
# and every new reader still makes the promise: the card in their hand, and the declaration
paper(rc('sworn', 0.0), 0.005, px(700)); knock(rc('sworn', 0.25), 0.006, px(1410), 260)
duet([(Eb5, 1.0), (Db5, 2.2)], [(Gb2, 0.0, 1.1), (Ab2, 1.2, 3.2)], rc('sworn', 0.2), 0.8)
# Jun's agent reads in a library too: from the old library, a picture on the lab's wall, back to the lab; every tool it's given is a
# hand: six hands reaching, one after another
every, only = rw('lib', 'Every tool'), rw('safe', 'only what')
air(rc('lib', 0.9), 2.6, 0.005, 0.0, 120, 800)
duet([(F4, 1.2), (Ab4, 1.0), (Db5, 2.0)], [(Db2, 0.0, 4.0)], rc('lib', 0.6), 0.8)
for i in range(6):
    air(every + i * 0.32, 0.5, 0.003, px(1100 + 60 * i), 200, 1000)
# give each hand only what its work needs, and the data stays safe, whoever asks
duet([(Gb4, 1.0), (F4, 0.8), (Eb4, 1.2), (Db4, 2.2)], [(Bb1, 0.0, 1.9), (Ab1, 2.0, 2.9), (Db2, 3.0, 5.0)], only - 0.2, 0.8)
# the title: the mark, on D flat
mark(Db5, rc('breath', 0.4), 2.0)

# =============================================================================================================================
# 2. Every hand is a permission: a phrase at the turn; the count on its card; six hands reaching, a soft touch as each takes its tool.
#    A tool server: its plug going home; whatever it can do, the agent can do: a key for each of read, write, delete, export. A hidden
#    line, the rackett's low note; a thief's key. The least this job needs: three strokes through write, delete and export, and the
#    lock: the mark, on F
hw = lambda lid, word, off=0: W('hands', lid, word, off)
hc = lambda lid, off=0: G('hands', lid, off)
cdc = hw('count', 'census-day count')
hg([(Ab4, 0.8), (Bb4, 0.8), (Db5, 1.8)], hc('count', -0.5), 0.75)
knock(cdc - 0.15, 0.008, px(345), 260)
for w, xx in (('tickets', 1540), ('catalog', 1560), ('docs', 1570), ('queries', 1570), ('writes', 1560), ('builds', 1540)):
    q = hw('needs', w); air(q - 0.3, 0.6, 0.003, px(1100), 200, 1000); tap(q + 0.3, 0.004, px(xx))
can, hidden, thief, least = hw('cando', 'the agent can'), hw('whoever', 'a line hidden'), hw('whoever', 'a thief'), hw('least', 'the least')
air(hc('server', -0.2), 0.9, 0.004, px(500), 200, 900); plug(hc('server', 0.75), 0.008, px(842))
# whatever a tool can do, the agent can do: a key for each, as it lights
for i, m in enumerate((F4, Ab4, Bb4, C5)):
    note(m, hc('cando', 0.2 + 0.32 * i), 0.45 if i < 3 else 1.6, 0.7, rel=0.3 if i < 3 else 0.7)
paper(hc('whoever', 0.0), 0.006, px(370))
rk(Bb1, hidden + 0.1, hidden + 2.0, 0.75, att=0.25, rel=0.7)
keyring(thief + 0.05, 0.006, px(300))
for i in range(3):
    stroke(least + 0.1 + 0.3 * i, 0.005, px(1240 + (i % 2) * 180))
lock(least + 1.0, 0.007, px(1050))
mark(F4, least + 1.15, 1.5)

# =============================================================================================================================
# 3. Rules ask, rights hold: Bodley's two ways, a phrase from the opening at the turn; the reader's promise, and the chain that held the
#    book, drawn taut. Its rules, on their card, each line marked; argued with, the card shaken. Its rights, set where the data lives;
#    the hidden line flies at the lock and stops: the mark, on G flat. Sam: a phrase at the turn; five ticks; and the chapter closes
gw = lambda lid, word, off=0: W('rights', lid, word, off)
gc = lambda lid, off=0: G('rights', lid, off)
duet([(Db5, 1.0), (C5, 0.6), (Db5, 0.6), (Ab4, 1.8)], [(Gb2, 0.0, 3.6)], gc('two', -0.6), 0.75)
held = gw('chain', 'held the book')
slide(held, 1.6, 0.0045, px(1420), 200, 1100); taut(held + 1.55, 0.006, px(1420))
filew, readw, draftw, neverw, argued = gc('file'), gw('file', 'read'), gw('file', 'draft'), gw('file', 'never write'), gw('argue', 'argued with')
paper(filew, 0.006, px(436))
for q in (readw, draftw, neverw):
    stroke(q, 0.004, px(436))
paper(argued, 0.005, px(436), 0.5)
hid, rights, noInstr = gw('argue', 'hidden in a ticket'), gw('where', 'its rights'), gw('where', 'no instruction')
paper(hid - 0.2, 0.005, px(400))
knock(rights - 0.15, 0.008, px(1504), 260)
for i in range(3):
    tap(rights + 0.5 + 0.35 * i, 0.004, px(1504))
air(noInstr + 0.2, 0.8, 0.004, px(1000), 220, 1000)
lock(noInstr + 0.95, 0.008, px(1680))
mark(Gb4, noInstr + 1.1, 1.6)
# Sam, who runs the platform, sets up each hand with the team's rules for AI helpers; each of the five set, a tick
sets = gw('sam', 'sets up each hand')
hg([(F4, 0.7), (Gb4, 0.7), (Ab4, 1.6)], gc('sam', -0.4), 0.7)
knock(sets, 0.007, px(1290), 260)
for q in ('q1', 'q2', 'q3', 'q4', 'q5'):
    tick(gc(q, 0.5), 0.006, px(950))
duet([(Bb4, 0.8), (Ab4, 0.8), (Db5, 1.6)], [(Db2, 0.4, 3.0)], END('rights', 'q5') + 0.5, 0.7)

# =============================================================================================================================
# 4. Six hands: six hands reaching at once, one soft breath of air, and a phrase at the turn; each tool lit as it's named, a soft touch;
#    the ticket, close and pass struck through; what it reads, a line at a time; the sample's rows; the pull request slid out; the
#    sandbox and its draft laid in it. Bodley's rule again, in the lab's words: a key and its note for each line. No hand can delete,
#    send or touch production: three empty places; and the chapter closes
sw = lambda lid, word, off=0: W('six', lid, word, off)
sc_ = lambda lid, off=0: G('six', lid, off)
air(sc_('six', -0.2), 1.2, 0.005, px(1100), 200, 1000)
hg([(Db5, 0.7), (Eb5, 0.7), (F5, 1.8)], sc_('six', 0.2), 0.7)
close, pass_, docs = sw('tickets', 'close'), sw('tickets', 'pass one on'), sw('catalog', 'Docs')
for q, xx in ((sc_('tickets'), 1540), (sc_('catalog'), 1560), (docs, 1570), (sc_('query'), 1570), (sc_('repo'), 1560), (sc_('build'), 1540)):
    tap(q + 0.05, 0.004, px(xx))
paper(sc_('tickets', 0.3), 0.005, px(380)); stroke(close + 0.1, 0.004, px(380)); stroke(pass_ + 0.1, 0.004, px(380))
for w in ('tables', 'owners', 'lineage', 'the glossary', 'the skills'):
    tap(sw('catalog', w, -0.1), 0.003, px(380))
samples, lives, prw, runs = sw('query', 'samples'), sw('query', 'where it lives'), sw('repo', 'pull request'), sw('build', 'runs its drafts')
knock(samples - 0.2, 0.006, px(380), 260)
for i in range(3):
    tap(samples + 0.2 + 0.25 * i, 0.003, px(380))
air(lives, 1.0, 0.004, px(1100), 200, 1000)
slide(prw - 0.3, 0.9, 0.005, px(900))
knock(sc_('build', 0.05), 0.006, px(300), 220); knock(runs + 0.55, 0.006, px(300), 260)
# read here; take nothing away; mark nothing: write in your own book; and bring no flame: a key and its note for each line
take2, mark2 = sw('here', 'Take nothing'), sw('here', 'Mark nothing')
note(Ab4, sc_('here', -0.1), 1.1, 0.7); note(F4, take2 - 0.1, 1.1, 0.7); note(Gb4, mark2 - 0.1, 1.3, 0.7); note(Eb4, sc_('flame', -0.1), 1.4, 0.7, rel=0.6)
for w in ('delete', 'send anything', 'touch production'):
    knock(sw('flame', w, -0.1), 0.005, px(400), 200)
duet([(Db4, 0.9), (Eb4, 0.7), (Db4, 1.8)], [(Gb2, 0.0, 1.6), (Db2, 1.7, 3.4)], END('six', 'flame') + 0.4, 0.7)

# =============================================================================================================================
# 5. Two people to production: the agent's hand to its sandbox; through people, always two: the two instruments together, once. The
#    pull request and its evidence; reviewed, a tick; approved, a tick; going live, the card carried into the count, and the release's
#    tick. Two people, for an agent's change as for anyone's: the duet, closing the chapter
pw = lambda lid, word, off=0: W('prod', lid, word, off)
pc = lambda lid, off=0: G('prod', lid, off)
air(S0('prod') + 0.4, 0.9, 0.004, px(600), 200, 900)
two, query, noor, puts = pw('people', 'always two'), pw('pr', 'the query'), pw('review', 'Noor approves'), pw('live', 'puts it live')
duet([(Ab4, 2.4)], [(Db3, 0.0, 2.4)], two - 0.1, 0.75)
paper(pc('pr', -0.1), 0.006, px(990)); slide(query + 0.2, 1.2, 0.004, px(1100))
tick(pc('review', 0.3), 0.006, px(990)); tick(noor + 0.3, 0.006, px(990))
air(puts + 0.3, 1.5, 0.004, px(1250), 200, 900); tick(puts + 1.7, 0.006, px(990))
duet([(F4, 0.8), (Eb4, 0.8), (Db4, 2.0)], [(Ab2, 0.0, 1.5), (Db2, 1.6, 3.6)], pc('anyone', -0.1), 0.75)

# =============================================================================================================================
# 6. A line nobody could see: one Monday, a phrase at the turn, and Clara typing her ticket; the email pasted in; the camera in to its
#    foot; the hidden line turning amber, the rackett low; the agent reading every word, a breath along the lines. What it reads is data,
#    never orders: the mark, on E flat. Its reply, and the line quoted. Its hands couldn't: names masked, no hand sends. Three things
#    make a leak: a note for each circle, and the leak a low note; the team took away the other two: two strokes, and the line resolves.
#    Sam checks: nothing left the university, a tick, and the chapter closes
lw = lambda lid, word, off=0: W('line', lid, word, off)
lc = lambda lid, off=0: G('line', lid, off)
asks = lw('monday', 'asks for')
hg([(Db5, 0.8), (C5, 0.6), (Ab4, 1.8)], lc('monday', -0.6), 0.7)
keys(asks, 12, 0.0035, px(1190), 0.21)
pastes, foot, tells, white = lc('pastes'), lw('white', 'At its foot'), lw('says', 'It tells'), lw('every', 'the white ones')
slide(pastes + 0.3, 0.9, 0.005, px(640))
air(foot, 1.6, 0.0035, px(700), 160, 800)
rk(Gb1, tells + 0.1, tells + 2.3, 0.75, att=0.3, rel=0.8)
air(lc('every', 0.0), 1.6, 0.0035, px(700), 160, 800)
never = lw('data', 'never orders')
paper(lc('data', 0.0), 0.006, px(1530))
mark(Eb4, never - 0.1, 1.5)
quoting = lw('tells', 'quoting it')
knock(lc('tells', 0.0), 0.007, px(1530), 260); quill(quoting - 0.2, 0.8, 0.004, px(1530))
masked, noHand = lw('couldnt', 'names come masked'), lw('couldnt', 'no hand sends')
knock(masked - 0.2, 0.006, px(380), 260); air(masked, 1.0, 0.0035, px(1100), 200, 1000); knock(noHand, 0.005, px(400), 200)
# three things together make a leak: private data, words from strangers, and a way out; the leak where all three meet
priv, strangers, way, took = lw('three', 'private data'), lw('three', 'words from strangers'), lw('three', 'a way out'), lw('two', 'took away')
note(F4, priv - 0.1, strangers - priv + 0.4, 0.65, rel=0.4)
note(Ab4, strangers - 0.1, way - strangers + 0.4, 0.65, rel=0.4)
note(Db5, way - 0.1, 1.5, 0.65, rel=0.5)
rk(Bb1, way + 0.6, way + 2.4, 0.7, att=0.3, rel=0.7)
# the team took away the other two: two strokes through them, and the line resolves
stroke(took, 0.005, px(745)); stroke(took + 0.4, 0.005, px(960))
duet([(C5, 0.8), (Db5, 1.8)], [(Ab2, 0.0, 2.6)], took + 0.9, 0.7)
# Jun passes it to Sam, who checks: nothing left the university
passes, nothing = lw('sam', 'passes it to Sam'), lw('sam', 'nothing left')
knock(passes + 0.4, 0.006, px(960), 260); tick(nothing + 0.1, 0.006, px(1500))
duet([(F4, 0.8), (Gb4, 0.8), (F4, 2.0)], [(Db2, 0.2, 3.4)], END('line', 'sam') + 0.4, 0.7)

# =============================================================================================================================
# 7. Still on the shelves: the count to the board, a phrase at the turn; its card, the rows, and two ticks. In 1645 the rule held: the
#    mark, on B flat. Bodley's books still on their shelves: today, the duet. Read-only by default: the lock; write only drafts: the
#    pen. The whole library to read: the six hands reaching, and the duet home, to the end's mark, on D flat
ew = lambda lid, word, off=0: W('shelves', lid, word, off)
ec = lambda lid, off=0: G('shelves', lid, off)
byFac, twoP = ew('board', 'by faculty'), ew('nothing', 'nothing changed')
duet([(Ab4, 0.9), (Bb4, 0.7), (C5, 0.7), (Db5, 1.8)], [(Db2, 0.0, 2.2), (Gb2, 2.3, 4.2)], ec('board', -0.4), 0.75)
knock(ec('board', 0.0), 0.007, px(1030), 260)
for i in range(5):
    tap(byFac + 0.22 * i, 0.003, px(1030))
tick(ec('nothing', 0.2), 0.006, px(1030)); tick(twoP + 0.2, 0.006, px(1030))
mark(Bb4, ew('held', 'the rule held', -0.1), 1.6)
duet([(Ab4, 1.0), (Db5, 0.8), (Eb5, 0.8), (Db5, 1.8)], [(Db2, 0.0, 2.4), (Ab2, 2.5, 4.4)], ec('books', -0.3), 0.75)
write = ew('default', 'Write only drafts')
lock(ec('default', 0.05), 0.007, px(560)); stroke(write + 0.05, 0.005, px(560))
whole = ew('belongs', 'the whole library')
air(ec('belongs', -0.1), 1.2, 0.004, px(1100), 200, 1000)
duet([(F4, 0.9), (Ab4, 0.8), (Bb4, 0.8), (Ab4, 0.8), (Db5, 2.2)], [(Db2, 0.0, 2.6), (Gb2, 2.7, 4.2), (Ab2, 4.3, 5.4)], whole - 0.2, 0.75)
mark(Db4, ec('breath', 0.5), 2.4, low=24)
