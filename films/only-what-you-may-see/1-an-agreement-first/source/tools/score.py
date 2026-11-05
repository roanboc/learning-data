# An agreement first: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette reserved for this film in the module's palettes (/mnt/project-files/data-protection/palettes.md, 5 November 2026, 13:10 UTC:
# neither instrument in any score.py on main or any branch, nor in any palettes list). Both are made here.
#  - The viola organista (organista()): Leonardo da Vinci's bowed keyboard, drawn in his notebooks about 1488 and first built in 2013.
#    Each key presses its string against a turning wheel, so a note sounds only while its key is held, at one steady level with no
#    vibrato, and stops the moment it's let go, as access lasts only while its agreement does. Low and soft, a few chords: under the
#    opening, as each paper is signed, as the grant is made, and the last chord let go on the agreement's end date.
#  - The chalumeau (chalumeau()): the clarinet's ancestor of about 1700, a soft, round, hollow single reed with one low register and no
#    other, one voice, no vibrato: each person's confidentiality agreement, which keeps to its range. Its note is the one left sounding
#    after the last chord ends ("It holds after I leave").
#  - E minor for the war's secret at risk, G major for the promise and the papers; the chords used (G, C, D, E minor and B minor) are all
#    pure in this film's tuning (just intonation from G), and no A is held with C or E, whose third and fifth would beat.
#  - The film's mark (mark()): a chord of G pressed and let go, and the chalumeau's D left sounding after it: at the title card and the
#    end card.
# The module's rules (its briefs and the governance films' check, tools/quiet.py):
#  - Music under the opening story (the first chapter), with rests where the secret is shown and where something has to come before
#    it; no urgent pulse anywhere (film.json's "urgent" is empty). After the opening, music only at a chapter's turn, under a moment on
#    screen or in a pause without words; never a bed under the voice.
#  - Every sound is an event on screen, at the moment it appears: each uses the same word and offset as src/scenes.js.
#  - Everything stays low and soft, below about 2.5 kHz; a figure isn't played again and again.

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
R1 = np.random.default_rng(1488)  # this film's own randomness: the room, the wheel, the breath

# ---- tuning: just intonation from G, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (55, 196.0)  # G 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
E2, G2, A2, B2, C3, D3, E3, Fs3, G3, A3, B3, C4, D4, E4 = 40, 43, 45, 47, 48, 50, 52, 54, 55, 57, 59, 60, 62, 64
# the chords, each voiced low; two voicings of some, so a chord heard again isn't the same figure
Em, Em2 = (E3, G3, B3), (B2, E3, G3)
Gm, Gu = (G2, D3, B3), (D3, G3, B3)          # G major, low and open; G major, close
Cm, Dm, Dl, Bm = (C3, E3, G3), (D3, Fs3, A3), (A2, D3, Fs3), (B2, D3, Fs3)

# ---- the levels, measured by tools/quiet.py as one speaker plays the score: the music's loud moments under -26.5 dB of full scale and
# its loudest notes under -23, the effects' loud moments under -43 dB (FX scales them)
OL, CL, FX = 0.053, 0.042, 1.6

def _ir(sec, lo):
    """a room's ring: noise that dies away over sec, its top rolled off at lo, after 20 ms. Its level is set by what it rings below lo
    (its gain there about one), not by all it rings: scaled by all of it, a room rings about 10 dB louder there than its share says"""
    x = np.arange(int(sec * SR)) / SR; ir = (R1.standard_normal(len(x)) * np.exp(-6.9 * x / sec)).astype(np.float32)
    ir = filt(ir, 'low', lo); ir[:int(0.02 * SR)] = 0
    return ir / np.sqrt((ir ** 2).sum() * SR / (2 * lo))
ROOM = _ir(1.2, 1900)  # a panelled room, as the huts' and the hall's
def _room(s, wet, body=None):
    """the room round a note. body (from, to, in samples) is where the note is held: the room still moves a held note's level, up or
    down by where its reflections meet the note's partials, so the note is set back to the level it had there before the room"""
    if not wet:
        return s
    r = np.pad(s, (0, len(ROOM) - 1)) + wet * fftconvolve(s, ROOM).astype(np.float32)
    if body:
        a, b = body; r = r * np.float32(np.sqrt((s[a:b] ** 2).mean() / max(1e-12, float((r[a:b] ** 2).mean()))))
    return r

# ---- the viola organista: keys ms pressed together at a and let go at b. Each key presses its string onto the turning wheel: the
# note speaks in a moment (its higher partials a little after the first), holds at one level with no vibrato and no swell, and stops
# when the key is let go, with only the string's short ring as it leaves the wheel, the high partials first. Its partials fall away
# as a bowed string's do, shaped by its wooden body (resonances near 300 and 900 Hz); the wheel's faint rosin hiss runs while a key is
# held. All of it is one sound, so the chord is heard as one instrument
def organista(ms, a, b, g=1.0, pan=0.0, room=0.26):
    sec = max(0.3, b - a); n = int((sec + 0.6) * SR); x = np.arange(n) / SR
    out = np.zeros(n)
    for j, m in enumerate(ms):
        f = hz(m); s = np.zeros(n)
        for k in range(1, int(2300 // f) + 1):
            fk = f * k
            body = 0.6 + 0.4 * np.exp(-((fk - 300) / 160) ** 2) + 0.3 * np.exp(-((fk - 900) / 300) ** 2)
            w = body / k ** 1.12 * (1.0 if fk < 1400 else np.exp(-(fk - 1400) / 330))
            on = np.sin(0.5 * np.pi * np.minimum(1, x / (0.07 * (1 + 0.15 * (k - 1))))) ** 2
            off = np.where(x > sec, np.exp(-(x - sec) / (0.035 + 0.13 / k)), 1.0)
            s = s + w * on * off * np.sin(2 * np.pi * fk * x + 0.7 * k + 1.3 * j)
        out = out + s / max(1e-9, float(np.abs(s).max()))
    held = np.where(x < sec, 1.0, np.exp(-(x - sec) / 0.03)) * np.minimum(1, x / 0.05)
    out = out / len(ms) ** 0.5 + filt(noise(n / SR + 0.01)[:n], 'band', (500, 1900)) * 0.005 * held
    put(_room(filt(out.astype(np.float32), 'low', 2300), room, (int(min(0.3, 0.4 * sec) * SR), int(sec * SR))), a, g * OL, pan)
def chords(seq, t, g=1.0, pan=0.0):
    """chords one after another, each key let go as the next is pressed: seq [(chord, length)]"""
    for ms, d in seq:
        organista(ms, t, t + d, g, pan); t += d

# ---- the chalumeau: one low register, a soft, round, hollow reed. A cylindrical pipe closed at the reed, so its odd partials sound
# and its even ones hardly; tongued softly, its higher partials speak a moment after the first; a little breath round it; no vibrato;
# the note stops when the breath does, with a short ring of the room
def chalumeau(m, a, b, g=1.0, pan=0.1, room=0.2):
    f = hz(m); sec = max(0.2, b - a); n = int((sec + 0.4) * SR); x = np.arange(n) / SR
    s = np.zeros(n)
    for k, w in ((1, 1.0), (2, 0.05), (3, 0.40), (4, 0.04), (5, 0.18), (6, 0.02), (7, 0.08), (9, 0.03)):
        fk = f * k
        if fk > 2300:
            break
        on = np.sin(0.5 * np.pi * np.minimum(1, x / (0.06 + 0.012 * k))) ** 2
        s = s + w * on * np.sin(2 * np.pi * fk * x + 0.5 * k)
    off = np.cos(0.5 * np.pi * np.clip((x - sec) / 0.08, 0, 1)) ** 2
    s = s / max(1e-9, float(np.abs(s).max())) * off
    br = filt(noise(n / SR + 0.01)[:n], 'band', (f * 0.8, min(2200, f * 2.2))) * (0.025 + 0.08 * np.exp(-x / 0.035)) * off
    put(_room(filt((s + br).astype(np.float32), 'low', 2200), room, (int(min(0.25, 0.4 * sec) * SR), int(sec * SR))), a, g * CL, pan)
def phrase(notes, t, g=1.0, pan=0.1):
    """a phrase on the chalumeau: notes [(note, length)], one after another, each tongued"""
    for m, d in notes:
        chalumeau(m, t, t + d - 0.04, g, pan); t += d

def mark(t, hold=2.4, g=1.0):
    """the film's mark: a chord of G pressed and let go, and the chalumeau's D left sounding after it"""
    organista(Gm, t, t + hold, g)
    chalumeau(D4, t + 0.6, t + hold + 1.3, 0.9 * g, pan=0.08)

# ---- the effects, soft and low, each where something happens on screen
def glass(s, g=0.016, pan=0.0):
    """a card of glass set down: a soft, round knock"""
    s_knock(s, g * FX, pan, 520)
def tap(s, g=0.009, pan=0.0):
    """a line set in place: a muffled tap"""
    s_tap(s, g * FX, pan)
def low(s, g=0.016, pan=0.0):
    """a coral pill set down, or something stopped: a low, dull knock"""
    s_knock(s, g * FX, pan, 190)
def pen(s, sec=1.6, g=0.008, pan=0.0):
    """a pen writing a signature: a soft, even scratch, in a few strokes"""
    x = tt(sec); e = np.minimum(1, np.minimum(x, sec - x) / 0.06) * (0.75 + 0.25 * np.abs(np.sin(np.pi * x * 2.6 / sec * 3)))
    X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * e, s, g * FX, pan)
def paper(s, g=0.012, pan=0.0, sec=0.42):
    """a sheet laid down, or slid out from under another"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 1800))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def latch(s, g=0.012, pan=0.0):
    """a door's latch: a small knock and the catch"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.03, g * 0.6 * FX, pan)
def air(s, sec=0.8, g=0.010, pan=0.0, lo=150, hi=900):
    """a breath of air: something sliding across, a sheet burning, a copy frosting over"""
    s_air(s, sec, g * FX, pan, lo, hi)
def sea(s, sec=3.4, g=0.006, pan=0.0):
    """the sea under the chart: one low, soft wash that swells in and dies away"""
    x = tt(sec); e = np.sin(np.pi * np.clip(x / sec, 0, 1)) ** 1.5
    for p in (-0.5, 0.5):
        X(filt((filt(noise(sec), 'band', (90, 700))[:len(x)] * e).astype(np.float32), 'low', 800), s, g * FX, pan + p)

# =============================================================================================================================
# 1. Signed first: Bletchley Park, 1939, in E minor, the viola organista's chords held low, each let go as the next is pressed. A rest
#    where the secret is shown, a soft click as its lock closes. The sea under the chart, and B minor as the codes go dark; one low E
#    for the careless word; a rest for "something has to come before the secret". The recruit signs: G, and the chalumeau's first
#    phrase as her pen moves; the latch as the door opens. The officer's sheet set down, taken up, burned; the cards. The convoy holds
#    its course, D to G; the thirty years, C to G, the chalumeau's D left over the end. The university: G; E minor for the no and the
#    yes with nothing written; two papers, C, then D as access comes last; G, let go before the title card; the mark
fw = lambda lid, word, off=0: W('first', lid, word, off)
fc = lambda lid, off=0: G('first', lid, off)
chords([(Em, 3.9)], 0.5, 0.9)
tBy, tCb = fw('people', 'By'), fw('park', 'codebreakers', -0.6)
chords([(Cm, tBy - 0.1 - tCb)], tCb, 0.85)
chords([(Gm, fc('secret', -0.5) - tBy)], tBy - 0.1, 0.85)
# the secret, under frost: a rest, and its lock closing
tSec = fw('secret', 'best-kept')
latch(tSec + 0.9 + 0.3, 0.010, px(1478))
# the sea: a convoy steered round the submarines; then new codes, and the route goes dark
sea(fc('ships', -0.2), 4.0)
chords([(Dm, fc('codes', -0.1) - fc('ships', -0.3))], fc('ships', -0.3), 0.8)
low(fc('codes', 0.2 + 0.35), 0.014, px(960))
chords([(Bm, END('first', 'codes') + 0.6 - fc('codes', -0.1))], fc('codes', -0.1), 0.8)
# one careless word: one low E, held; then a rest
tCare = fw('word', 'careless')
organista((E2, B2), tCare - 0.2, END('first', 'word') + 0.6, 0.8)
# a promise first: G; the recruit signs, the chalumeau's phrase as her pen moves; the door's latch; C as it opens
tRun = fc('run', -0.4)
chords([(Gu, fw('signed', 'sign', 0.2) - tRun - 0.2)], tRun + 0.2, 0.8)
tSign = fw('signed', 'sign', 0.2)
pen(tSign, 2.4, 0.008, px(700))
phrase([(G3, 0.8), (B3, 0.8), (D4, 1.1)], tSign, 0.85)
tOpen = END('first', 'signed') - 0.3
latch(tOpen, 0.012, px(300))
chords([(Cm, 2.6)], tOpen + 0.1, 0.75)
# each told only their own part: the huts, apart; D, low
chords([(Dl, END('first', 'part') + 0.7 - fc('part', -0.3))], fc('part', -0.3), 0.75)
# a few named commanders: the officer sets the sheet down, takes it back, and burns it; E minor, then C
tCom, tTakes, tDes = fw('named', 'commanders'), fw('named', 'takes'), fw('named', 'destroys')
paper(tCom - 0.3 + 0.9, 0.012, px(960))
paper(tTakes - 0.4 + 0.5, 0.010, px(960), 0.3)
tBurn = max(tTakes - 0.4 + 1.4, tDes + 0.1)
air(tBurn, 1.0, 0.010, px(900), 180, 1000)
chords([(Em2, tTakes - fc('named', -0.4)), (Cm, END('first', 'named') + 0.3 - tTakes)], fc('named', -0.4), 0.75)
glass(END('first', 'named') + 0.1, 0.014, px(350))
glass(fw('away', 'nothing', 0.1), 0.014, px(350))
chords([(Gm, END('first', 'away') + 0.5 - fw('away', 'nothing', -0.2))], fw('away', 'nothing', -0.2), 0.75)
# it holds: the sea again, the route comes back; D, then G as the ships keep their warning
sea(fc('holds', -0.2), 3.6, 0.005)
tWarn = fw('never', 'warning')
chords([(Dm, tWarn - 0.1 - fc('holds', -0.3)), (Gu, END('first', 'never') + 0.6 - tWarn + 0.1)], fc('holds', -0.3), 0.75)
# almost thirty years: the park, every window lit; C, then G, let go, and the chalumeau's D left over it
tYears = fw('thirty', 'thirty')
glass(tYears - 0.2, 0.014, px(960))
chords([(Cm, tYears - fc('thirty', -0.4)), (Gm, END('first', 'thirty') + 0.3 - tYears)], fc('thirty', -0.4), 0.75)
chalumeau(D4, tYears + 0.5, END('first', 'thirty') + 1.2, 0.8)
# the university: the hall; G, close; E minor for the no and the yes with nothing written
glass(fw('too', 'ask', -0.1), 0.014, px(510))
chords([(Gu, fc('no', -0.4) - fc('too', -0.2))], fc('too', -0.2), 0.7)
chords([(Em, END('first', 'no') + 0.3 - fc('no', -0.1))], fc('no', -0.1), 0.7)
# two papers come first, C; access comes last, D; the study gets what it needs, G, let go before the title
tTwo, tAcc = fw('papers', 'two'), fw('papers', 'access')
glass(tTwo - 0.1 + 0.25, 0.014, px(320)); glass(tTwo + 0.3 + 0.25, 0.014, px(780))
chords([(Cm, tAcc - 0.2 - (tTwo - 0.2)), (Dm, END('first', 'papers') + 0.5 - tAcc + 0.2)], tTwo - 0.2, 0.7)
chords([(Gu, fc('breath', -0.9) - fc('nobody', -0.1))], fc('nobody', -0.1), 0.7)
# the title card: the mark, as the seal turns round the lock
mark(fc('breath', 0.5), 2.4, 0.9)

# 2. A study asks: Monday, G, as the date comes in. Anil's card; his request; it flies to the registrar's office and lands by Mei;
#    her card; the two cards the earlier films gave it; three coral questions; copies travel to a laptop and a shared folder, E minor
#    low; two papers come first, C to G
aw = lambda lid, word, off=0: W('asks', lid, word, off)
a0 = S0('asks')
organista(Gu, a0 + 0.5, a0 + 3.0, 0.75)
glass(aw('anil', 'Anil', -0.1), 0.013, px(1330))
glass(aw('asks', 'asks', 0.1), 0.014, px(1400))
tFly = aw('asks', 'office', 0.25)
air(tFly, 0.5, 0.009, px(1500), 200, 1000)
tLand = tFly + 0.55
paper(tLand - 0.25, 0.010, px(300), 0.5)
glass(aw('owns', 'Mei', -0.1), 0.013, px(1570))
glass(aw('gave', 'Who', 0.05), 0.013, px(310)); glass(aw('gave', 'marketplace', -0.1), 0.013, px(740))
for word in ('never', 'where', 'leave'):
    low(aw('unsaid', word, -0.1), 0.012, px(300))
tTr = aw('harm', 'travel')
air(tTr - 0.2, 0.6, 0.008, px(400), 200, 900); air(tTr + 0.2, 0.6, 0.008, px(700), 200, 900)
organista(Em2, tTr - 0.3, END('asks', 'harm') + 0.4, 0.7)
tEach, tUse = aw('two', 'each'), aw('two', 'use')
glass(tEach + 0.2, 0.014, px(320)); glass(tUse, 0.014, px(780))
chords([(Cm, 1.3), (Gu, 1.6)], tEach - 0.1, 0.7)

# 3. A promise from each person: the chalumeau's phrase as the promise is set down, and its D on "It holds after I leave"; each line,
#    a soft tap; the four who sign, a pen each; the small door's latch; the year round; Yusuf's ticks; a member paused, a low open
#    fifth, then G as the promise is signed again; the agent's card, its owner's pen; the renewal; at Bletchley, C, let go, and the
#    chalumeau's D outlasting it
pw = lambda lid, word, off=0: W('promise', lid, word, off)
pc = lambda lid, off=0: G('promise', lid, off)
p0 = S0('promise')
glass(p0 + 0.15, 0.013, px(960))
phrase([(G3, 0.7), (B3, 0.7), (D4, 1.2)], pw('own', 'confidentiality', -0.2), 0.8)
for k in range(6):
    tap(pc('l%d' % (k + 1), -0.1), 0.008, px(760))
chalumeau(D4, pc('l6', 0.1), END('promise', 'l6') + 1.0, 0.8)
for k, word in enumerate(('staff', 'contractors', 'researchers', 'team')):
    pen(pw('everyone', word, 0.1), 0.6, 0.006, px(385 + 306 * k))
latch(pw('everyone', 'team', 1.3), 0.010, px(1575))
tap(pw('yearly', 'every', -0.2), 0.008, px(1490))
tY = pw('yearly', 'Yusuf')
glass(tY - 0.1, 0.013, px(1360))
for k in range(4):
    tap(tY + 0.6 + 0.25 * k + 0.2, 0.007, px(1800))
glass(pc('groups', -0.1), 0.013, px(680))
tOnly, tSigned = pw('groups', 'only'), pw('groups', 'signed')
tap(tOnly + 1.3, 0.008, px(980))
organista((B2, Fs3), tOnly + 1.4, tSigned - 0.1, 0.65)
organista(Gm, tSigned - 0.1, tSigned + 1.8, 0.7)
glass(pc('agent', 0.1), 0.012, px(1400))
pen(pw('agent', 'owner'), 1.4, 0.007, px(1400))
glass(pw('renewed', 'renewed'), 0.012, px(560))
tBl, tOut = pc('bletchley', -0.2), pw('bletchley', 'outlasts')
organista(Cm, tBl + 0.2, tOut + 0.5, 0.7)
chalumeau(D4, tOut - 0.1, tOut + 2.4, 0.8)

# 4. An agreement for each use: D as its card is set down between Mei and Anil; each line of it, a soft tap as it's written; the Five
#    Safes, a tap each; Mei signs, G under her pen; Anil signs, C, then G as the chip is set; the register's line; at Bletchley, the
#    officer's hand on the sheet, E minor
gw = lambda lid, word, off=0: W('agreement', lid, word, off)
gc = lambda lid, off=0: G('agreement', lid, off)
g0 = S0('agreement')
glass(g0 + 0.7, 0.013, px(960))
organista(Dm, g0 + 0.6, g0 + 3.2, 0.7)
for lid in ('purpose', 'from', 'may', 'never', 'who', 'where', 'leave', 'ends'):
    tap(gc(lid, -0.05), 0.008, px(700))
for word in ('people', 'project', 'setting', 'data', 'outputs'):
    tap(gw('safes', word, 0.0), 0.007, px(200))
tMei, tAnil = gw('sign', 'Mei'), gw('sign', 'Anil')
pen(tMei, 1.6, 0.008, px(540)); pen(tAnil, 1.6, 0.008, px(1080))
organista(Gm, tMei - 0.05, tMei + 1.9, 0.7)
glass(tAnil + 1.6, 0.012, px(1600))
chords([(Cm, 1.6), (Gu, 1.7)], tAnil - 0.05, 0.7)
tReg = gc('register', -0.3)
glass(tReg + 0.25, 0.013, px(1300)); pen(tReg + 0.85, 0.8, 0.006, px(1100))
organista(Em, gc('bletchley', -0.1), gw('bletchley', 'named', -0.6), 0.7)

# 5. Access, made from the agreement: G as the agreement glows; the contract slides out from under it; its terms, a tap each; at Sam's
#    desk the grant is made, D to G, the line of light out to the right; back in the hall it reaches the study's space, a soft click;
#    "No agreement, no grant", a low knock; November's request slides in and stops at the platform's edge; E minor, low, as it doesn't
#    stretch; the support team's new paper slides in
rw = lambda lid, word, off=0: W('grant', lid, word, off)
rc = lambda lid, off=0: G('grant', lid, off)
organista(Gu, rw('now', 'made', -0.1), rw('now', 'made', 1.9), 0.7)
tWr = rw('contract', 'written')
glass(tWr + 0.1, 0.013, px(470))
for word in ('columns', 'group', 'end'):
    tap(rw('terms', word, -0.1), 0.008, px(300))
tGr, tGive = rw('hand', 'grant'), rw('hand', 'give')
air(tGr, 0.6, 0.008, px(1860), 300, 1000)
chords([(Dl, 1.5), (Gm, tGive + 1.2 - tGr - 1.4)], tGr - 0.1, 0.7)
pen(rw('hand', 'hand', -0.1), 1.2, 0.005, px(1000))
tReach = tGive - 0.2 + 0.5
s_tap(tReach, 0.010 * FX, px(1160)); s_knock(tReach + 0.01, 0.008 * FX, px(1160), 700)
low(rw('names', 'No'), 0.014, px(300))
tFac = rw('november', 'faculty')
air(tFac, 1.5, 0.008, px(600), 150, 800)
low(tFac + 1.5, 0.014, px(1060))
low(rw('stretch', 'stretch', -0.1), 0.012, px(1200))
organista(Em2, rw('stretch', 'stretch', -0.2), rw('stretch', 'stretch', 1.8), 0.65)
tSup = rc('support', -0.3)
paper(tSup + 0.4, 0.010, px(400), 0.6)

# 6. When it ends: G held from the date, and let go on "ends", as the line of the grant thins to nothing; the copy frosts over; Yusuf's
#    "Closed"; the totals set down; Anil's promise, the chalumeau's D on "after he leaves"; at Bletchley, the park at night, E minor; the
#    two papers set down, the door's latch as it opens a little and closes; the end card: the mark
ew = lambda lid, word, off=0: W('ends', lid, word, off)
ec = lambda lid, off=0: G('ends', lid, off)
e0 = S0('ends')
tEnds = ew('itself', 'ends')
organista(Gm, e0 + 0.4, tEnds, 0.75)
air(ew('deleted', 'deleted'), 1.4, 0.007, px(1410), 200, 900)
low(ew('deleted', 'closes'), 0.013, px(1700))
glass(ec('totals', -0.1), 0.013, px(490))
glass(ew('holds', 'promise', -0.2), 0.013, px(1360))
tLv = ew('holds', 'leaves')
chalumeau(D4, tLv - 0.3, tLv + 2.4, 0.8)
tB = ec('bletchley', -0.2)
organista(Em, tB + 0.2, tB + 3.6, 0.65)
tEnd = ec('end', -0.3)
glass(tEnd + 0.6, 0.013, px(450)); glass(tEnd + 0.9, 0.013, px(906))
tStart = ew('end', 'start')
latch(tStart + 0.5, 0.010, px(1520)); latch(tStart + 3.4, 0.010, px(1520))
mark(ec('breath', 0.5), 2.4, 0.9)
