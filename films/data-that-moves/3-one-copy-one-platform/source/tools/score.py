# One copy, one platform: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The palette, reserved for this film by the module's setup thread on 5 November 2026 (/mnt/project-files/modern-data-basics/
# palettes.md), after checking every score.py and music.py on main and on every branch: a log drum, the orchestra's wooden box with
# tongues cut in its top, struck softly with felt mallets: each tongue its own note, all of them ringing in one body. The partner is a
# second log drum, a bigger box an octave lower, chosen by this film's thread that day: every other colour the site lacks either belongs
# to another culture or sounds like one the site has (palettes.md's list), so the film keeps to the one instrument whose idea it carries,
# as films 1, 4 and 6 did. Both are made here (music.py has neither).
#  - The tongues (strike(), low()): a wooden tongue held at one end, its overtones inharmonic and gone at once; the felt's soft thump;
#    and the box under them, a short hollow knock from its own few resonances, the same for every tongue of a box. Dry, low and short
#    (a note dies within about a second), so they read apart from the site's marimba (long, with its overtone two octaves up), xylophone
#    (bright), kalimba (ringing, with a strong overtone) and boobams (a skin whose pitch drops).
#  - The film's mark: two tongues, two notes, struck apart, then together, one body ringing (mark()): when two tongues are struck at
#    once, their box rings once, a little longer, under both. It sounds as the ledger's line moves from page to page and the ledger shows
#    what each merchant holds, on the title card, as Postgres and the lakehouse use the same rows, as the line moves again at the end,
#    and under the end card. Two pages, two engines, two tongues; one ledger, one copy, one box.
#  - A-flat major, F minor for the problem (Amsterdam's coin, the copies that drift, the claims by email), all tuned pure (just
#    intonation from A flat): F minor's third and fifth are pure here, and no two notes struck together are a little out of tune.
# The module's rules (palettes.md and the author's, 20 October and 4 November 2026; tools/quiet.py checks them):
#  - Music under the opening story; after it, only at a chapter's turn or under a moment on screen; never a bed under the voice. Here
#    that's a struck note or two at a chapter's turn and at a moment, and silence between.
#  - Nothing trembles or pulses, no vibrato; no urgent pulse anywhere (film.json's "urgent" is empty).
#  - Every sound is an event on screen, at the moment it appears, timed by the same word and offset as the picture in src/scenes.js, so
#    sound and picture stay together when the voice is re-timed: a few coins counted out, coins spread on the table, silver shaved from
#    a coin's edge, the balance's beam swinging, a bag of coin set in its pan and a weight beside it, a pen writing a line, a bill laid
#    on a page, a card set down, a tag placed, a claim typed and approved, a breath of air as a lane runs. Nothing from Amsterdam's own
#    music: no carillon, no bells.
# And everything stays low and soft, below about 2.5 kHz.

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
R1 = np.random.default_rng(1609)  # this film's own randomness: the boxes' knock, the felt, the room and the coins

# ---- tuning: just intonation from A flat, so two notes struck together are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (56, 207.652)  # A flat 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
F2, G2, Ab2, Bb2, C3, Db3, Eb3 = 41, 43, 44, 46, 48, 49, 51
F3, G3, Ab3, Bb3, C4, Db4, Eb4, F4, G4, Ab4 = 53, 55, 56, 58, 60, 61, 63, 65, 67, 68

# ---- the levels, set by tools/quiet.py's measure as one speaker plays the score: the music's loud moments under -26.5 dB of full
# scale and its loudest notes under -23, the effects' loud moments under -43 dB (FX scales them)
LL, BL, FX = 0.135, 0.150, 1.5

# a room round the drums: a small panelled room, ringing on for under a second, and nothing much above 1.8 kHz. Its level is set by
# what it rings under 1.8 kHz (its gain there about one, so `room` is its share), and each note gets its own room. The notes are
# struck and die within about a second, so none is held long enough for the room to move its level
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.8)).astype(np.float32))(np.arange(int(0.8 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.014 * SR)] = 0; _IR /= np.sqrt((_IR ** 2).sum() * SR / 3600)
def _room(s, room):
    return (np.pad(s, (0, len(_IR) - 1)) + room * fftconvolve(s, _IR).astype(np.float32)) if room else s

# ---- the log drums. A tongue's partials (ratio, level, how long it lasts in seconds): the note; the tongue twisting, a little under
# three times the note, gone almost at once; and its first bend above the note, far up (6.27 times it, as for a tongue held at one
# end), gone at once. The box: its own few resonances (pitch, level, how long), the same under every tongue and well away from the
# tongues' notes (the lowest is the air inside it), so it sounds hollow and wooden without a pitch that could beat with a note. The
# felt: how loud its soft thump is
_LEAD = dict(parts=((1.0, 1.0, 0.34), (2.9, 0.28, 0.05), (6.27, 0.05, 0.028)),
             box=((168, 0.5, 0.06), (452, 0.42, 0.035), (610, 0.32, 0.03), (880, 0.2, 0.02)), felt=0.15)
_DEEP = dict(parts=((1.0, 1.0, 0.50), (2.9, 0.45, 0.07), (6.27, 0.04, 0.035)),
             box=((72, 0.45, 0.09), (182, 0.65, 0.06), (236, 0.55, 0.045), (330, 0.45, 0.03)), felt=0.18)
_PH = (0.3, 1.9, 4.1, 5.3)  # the box's resonances start out of step, so their first knock isn't one spike
def _strike(ms, P, ring=1.0):
    """tongues of one box struck at once (a MIDI note, or several): each tongue's sound, the felt's thump, and the box's one hollow
    knock under them all; when more than one tongue is struck, the box rings longer under them (ring), and so do their notes"""
    ms = (ms,) if isinstance(ms, int) else tuple(ms)
    sec = 6 * np.sqrt(ring) * max(d for _, _, d in P['parts']); n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR; s = np.zeros(n)
    for m in ms:
        f = hz(m); v = np.zeros(n)
        for r, a, d in P['parts']:
            if f * r < 2200:
                v += a * np.exp(-x / (d * (np.sqrt(ring) if r == 1.0 else 1))) * np.sin(2 * np.pi * f * r * x + 0.4 * r)
        s += v / max(1e-9, float(np.abs(v).max()))
    s = s / np.sqrt(len(ms))
    box = sum(a * np.sqrt(ring) * np.exp(-x / (d * ring)) * np.sin(2 * np.pi * f * x + ph) for (f, a, d), ph in zip(P['box'], _PH))
    felt = filt(R1.standard_normal(n).astype(np.float32), 'low', 600) * np.exp(-x / 0.005)
    out = (s + box) * np.minimum(1, x / 0.004) + P['felt'] * felt / max(1e-9, float(np.abs(felt).max()))
    out = filt(out.astype(np.float32), 'low', 2300)
    return out / max(1e-9, float(np.abs(out).max()))
def strike(ms, t0, g=1.0, pan=0.0, ring=1.0, room=0.22):
    """the log drum: one tongue (or several, at once) struck softly at t0"""
    put(_room(_strike(ms, _LEAD, ring), room).astype(np.float32), t0, g * LL, pan)
def low(ms, t0, g=1.0, pan=0.0, ring=1.0, room=0.22):
    """the bigger log drum, an octave lower: its tongue (or tongues) struck at t0"""
    put(_room(_strike(ms, _DEEP, ring), room).astype(np.float32), t0, g * BL, pan)
def mark(ta, tb, tog, a=C4, b=Eb4, root=Ab2, g=1.0, pa=-0.3, pb=0.3):
    """the film's mark: two tongues, two notes, struck apart (a at ta, b at tb), then together at tog, with the bigger drum's root
    under them: one body ringing"""
    strike(a, ta, 0.8 * g, pa); strike(b, tb, 0.8 * g, pb)
    strike((a, b), tog, g, 0.0, ring=1.8); low(root, tog, 0.85 * g, 0.0, ring=1.5)

# ---- soft sounds, all low-passed, each where something happens on screen
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a card set down, a system set on the map"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a tag or a pill placed"""
    s_tap(s, g * FX, pan)
def keys(s, n, sec, g=0.007, pan=0.0):
    """a few muffled keys, spread over sec: a claim typed"""
    for i in range(n):
        s_tap(s + sec * i / max(1, n - 1), g * FX * (0.85 + 0.15 * (i % 2)), pan)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: a lane running, a line carried along its arc"""
    s_air(s, sec, g * FX, pan, lo, hi)
def clink(s, g=0.006, pan=0.0, f=1250):
    """a coin, muffled: two of a small disc's partials, gone in a few hundredths of a second"""
    x = tt(0.09); f = f * (0.94 + 0.12 * R1.random())
    c = np.sin(2 * np.pi * f * x) * np.exp(-x / 0.03) + 0.45 * np.sin(2 * np.pi * f * 1.52 * x) * np.exp(-x / 0.018)
    X(norm(filt((c * np.minimum(1, x / 0.002)).astype(np.float32), 'low', 2300)), s, g * FX, pan)
def pour(s, sec=1.2, g=0.007, pan=0.0):
    """coins spread across a table: one soft texture that swells in and out, and three muffled coins in it"""
    x = tt(sec); X(filt(R1.standard_normal(len(x)).astype(np.float32), 'band', (300, 1600)) * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
    for k, d in enumerate((0.22, 0.55, 0.9)):
        clink(s + d * sec, 0.0045 * (1 - 0.15 * k), pan + 0.1 * (k - 1), 1150 + 120 * k)
def shave(s, sec=0.9, g=0.005, pan=0.0):
    """silver shaved from a coin's edge: a thin, soft scrape, a little uneven"""
    x = tt(sec); r = filt(R1.standard_normal(len(x)).astype(np.float32), 'band', (700, 2000))
    X(r * np.sin(np.pi * x / sec) ** 2 * (0.75 + 0.25 * np.sin(2 * np.pi * 7 * x)), s, g * FX, pan)
def quill(s, sec, g=0.005, pan=0.0):
    """a pen writing a line: soft strokes of a nib on paper"""
    x = tt(sec); r = filt(R1.standard_normal(len(x)).astype(np.float32), 'band', (800, 2000))
    strokes = np.clip(np.sin(2 * np.pi * 3.2 * x + 0.6), 0, 1) ** 0.6
    X(r * strokes * np.sin(np.pi * x / sec) ** 0.5, s, g * FX, pan)
def creak(s, g=0.008, pan=0.0):
    """the balance's beam at the end of its swing: a soft, low wooden creak"""
    x = tt(0.3); X(filt(R1.standard_normal(len(x)).astype(np.float32), 'band', (150, 600)) * np.sin(np.pi * x / 0.3) ** 2, s, g * FX, pan)
def setdown(s, g=0.016, pan=0.0):
    """a bag of coin set in its pan: a low knock, and the coins inside shifting"""
    s_knock(s, g * FX, pan, 140); clink(s + 0.03, 0.004, pan, 1100); clink(s + 0.09, 0.0035, pan, 1300)
def weight(s, g=0.010, pan=0.0):
    """a brass weight set in its pan"""
    s_knock(s, g * FX, pan, 330)
def paper(s, g=0.010, pan=0.0, sec=0.25):
    """a bill laid on a page"""
    x = tt(sec); X(filt(R1.standard_normal(len(x)).astype(np.float32), 'band', (250, 1800)) * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def approve(s, g=0.010, pan=0.0):
    """a claim approved: a small, firm click"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def strikeout(s, g=0.012, pan=0.0):
    """a part of the usual design crossed out: a soft, dull knock"""
    s_knock(s, g * FX, pan, 160)

# =============================================================================================================================
# 1. One ledger: the opening, music all through it. Amsterdam, around 1600, F minor: the bigger drum alone at dusk; ships and
#    merchants, a tongue each; coins counted out. Eight hundred kinds of coin, clipped, worn thin, a falling line; the balance that
#    never settles; a thousand owed and about nine hundred paid, a sigh (D flat to C). Slow, disputed, risky; then nothing under
#    "Something had to change". A-flat major from the Wisselbank on: the date, the bank; a bag of coin set down once, weighed, written
#    on its own page; the mark as a payment moves as a line from page to page, struck together as the ledger shows what each merchant
#    holds. Trusted; for over a century, the bills laid on the pages. Data's bags of coin, F minor again: copies, each a little
#    different (C and D flat rubbing); the claims by email, never quite agreed; now written once and read in one copy, A-flat major;
#    the title card: the mark
lw = lambda lid, word, off=0: W('ledger', lid, word, off)
l0 = S0('ledger')
low(F2, l0 + 0.9, 0.85, ring=1.3)
strike(C4, lw('quays', 'Ships', 0.1), 0.6, px(1500))
strike(Ab3, lw('quays', 'merchants pay', 0.1), 0.6, px(560))
tCoin = lw('quays', 'in coin')
for d, f in ((-0.3, 1250), (0.15, 1150), (0.6, 1320)):
    clink(tCoin + d, 0.005, px(640), f)
# the counting table: the coins spread, the card, the clipped coin and the worn one, the balance swinging and never settling
low(F2, lw('kinds', 'Between', -0.2), 0.7)
pour(lw('kinds', 'Between', -0.05), 1.3, 0.006, px(1100))
knock(lw('kinds', 'kinds', -0.35), 0.013, px(426), 240)
strike(Db4, lw('kinds', 'kinds', -0.3), 0.55, px(426))
strike(C4, lw('kinds', 'clipped', 0.3), 0.5, px(740))
shave(lw('kinds', 'shaved', -0.2), 0.9, 0.005, px(740))
tap(lw('kinds', 'clipped', 0.3), 0.008, px(740))
strike(Bb3, lw('kinds', 'worn thin', 0.0), 0.5, px(1180))
tap(lw('kinds', 'worn thin', 0.05), 0.008, px(1180))
tW = lw('weigh', 'weighing')
low(F2, tW - 0.3, 0.7)
creak(tW + 0.65, 0.007, px(705)); creak(tW + 1.96, 0.006, px(705))
strike(G3, lw('weigh', 'nobody knows', 0.0), 0.5, px(425))
tap(lw('weigh', 'nobody knows', 0.05), 0.008, px(425))
# a thousand owed, about nine hundred paid: the card, the bars, and the gap between them
knock(lw('owed', 'a merchant owed', -0.55), 0.013, px(960), 240)
strike(Ab3, lw('owed', 'a merchant owed', -0.5), 0.55); low(F2, lw('owed', 'a merchant owed', -0.5), 0.6)
tGap = lw('owed', 'nine hundred', 0.6)
strike(Db4, tGap, 0.5); strike(C4, tGap + 0.4, 0.45)
# slow, disputed, risky: a pill each; then nothing under "Something had to change"
for word, x in (('slow', 560), ('disputed', 960), ('risky', 1360)):
    tap(lw('change', word, -0.05), 0.009, px(x))
# 31 January 1609: A-flat major. The date's card, the Wisselbank
knock(lw('bank', 'January', -0.15), 0.013, px(416), 240)
low(Ab2, lw('bank', 'January', -0.15), 0.75); strike(C4, lw('bank', 'January', -0.15), 0.55, px(416))
strike(Eb4, lw('bank', 'Wisselbank', 0.0), 0.55)
# brought once: the bag lands in its pan, a weight beside it, the sum written on the merchant's own page
tOnce = lw('deposit', 'once')
setdown(tOnce + 0.85, 0.015, px(444))
strike(Ab3, tOnce + 0.85, 0.5, px(444))
weight(lw('deposit', 'weighs it', 0.05), 0.010, px(716))
tap(lw('deposit', 'weighs it', 0.55), 0.008, px(580))
quill(lw('deposit', 'writes its value', 0.0), 0.9, 0.005, px(975))
tap(lw('deposit', 'own page', -0.05), 0.008, px(975))
strike(F4, lw('deposit', 'own page', -0.05), 0.45, px(975))
# a payment is a line moved from page to page: written on page 112, carried over the spine, written on page 87 (the mark, apart);
# no coin carried; the ledger shows what each merchant holds (the mark, together)
tMv = lw('line', 'a line moved')
quill(tMv - 0.1, 0.6, 0.005, px(590))
air(tMv + 0.2, 1.6, 0.007, 0.0, 200, 1000)
quill(tMv + 1.48, 0.32, 0.005, px(1330))
tap(lw('line', 'no coin', 0.05), 0.008, px(960))
mark(tMv + 0.2, tMv + 1.8, lw('line', 'what each merchant holds', 0.0), Eb4, C4, Ab2, 0.9, px(590), px(1330))
# trusted; for over a century, bills from all over Europe laid on its pages and marked paid
knock(lw('trust', 'five per cent', -0.15), 0.013, px(446), 240)
strike(Ab4, lw('trust', 'five per cent', -0.1), 0.45, px(446))
tap(lw('century', 'over a century', 0.05), 0.008, px(470))
low(Ab2, lw('century', 'over a century', 0.0), 0.6)
tB = lw('century', 'bills', -0.2)
for i, x in enumerate((1410, 975, 1410, 975, 1410)):
    paper(tB + 0.7 * i + 1.0, 0.009, px(x))
# data has its bags of coin too: F minor. The copies set down, then each a little different
low(F2, lw('data', 'bags of coin', 0.0), 0.65)
tCp = lw('data', 'copied')
for i in range(4):
    tap(tCp + 0.15 + 0.22 * i, 0.007, px(1440))
strike((C4, Db4), lw('data', 'a little different', -0.1), 0.5, px(1200))
# the claims by email: two copies set down, the mail along their lanes, never quite agreed
tE = lw('claims', 'email')
tap(tE, 0.007, px(1500)); tap(tE + 0.3, 0.007, px(1500))
air(tE + 0.5, 1.2, 0.006, px(1000), 200, 900)
tap(lw('claims', 'never quite agreed', 0.05), 0.009, px(1500))
strike(Ab3, lw('claims', 'never quite agreed', 0.0), 0.5, px(1500)); low(F2, lw('claims', 'never quite agreed', 0.0), 0.55)
# now each claim is written once, and payroll and Finance read that one copy: A-flat major
knock(lw('now', 'written once', 0.0), 0.012, px(1000), 250)
strike(Eb4, lw('now', 'written once', 0.0), 0.5, px(1000))
tR = lw('now', 'read that one copy', 0.1)
tap(tR, 0.007, px(1640)); tap(tR + 0.2, 0.007, px(1640))
strike(C4, tR, 0.5); low(Ab2, tR, 0.6)
# the breath: the ledger's line becomes the claims app's row; the title card: the mark
knock(G('ledger', 'breath', 0.9), 0.012, px(960), 250)
tT = G('ledger', 'breath', 1.7)
mark(tT, tT + 0.55, tT + 1.1, C4, Eb4, Ab2, 0.85)

# 2. The usual design: the present day, A-flat major at the turn (pay day, E flat over the bigger drum's A flat); Linh, her claims; how they used to go round, F minor (the
#    spreadsheet, the mail, typed again; the faculty's tally; Finance after pay day); the usual design built piece by piece; what it
#    costs, and a copy always a little behind: a note, and the same note again, a little late
uw = lambda lid, word, off=0: W('usual', lid, word, off)
tap(uw('payday', 'Thursday', -0.15), 0.008, px(400))
strike(Eb4, uw('payday', 'pay day', 0.0), 0.5, px(500)); low(Ab2, uw('payday', 'pay day', 0.0), 0.6)
tap(uw('linh', 'Linh', -0.05), 0.008, px(640))
knock(uw('linh', 'hours she claims', -0.25), 0.012, px(950), 240)
paper(uw('sheets', 'Claims', -0.05), 0.010, px(785), 0.35)
air(uw('sheets', 'sent by email', 0.0), 1.0, 0.007, px(1040), 200, 900)
knock(uw('sheets', 'typed again', -0.15), 0.012, px(1470), 240)
strike(Ab3, uw('sheets', 'typed again', -0.15), 0.5, px(1470)); low(F2, uw('sheets', 'typed again', -0.15), 0.6)
knock(uw('tally', 'its own tally', -0.15), 0.011, px(1470), 250)
knock(uw('tally', 'Finance saw', -0.15), 0.011, px(1470), 230)
# the usual design: the app on its own database, the pipeline, the analytics platform and its copy, the reports
knock(uw('ready', 'an app', -0.15), 0.012, px(280), 240)
air(uw('design', 'a pipeline', -0.1), 0.9, 0.007, px(595), 180, 900)
knock(uw('design', 'an analytics platform', -0.15), 0.012, px(1050), 220)
tap(uw('design', 'an analytics platform', 0.55), 0.007, px(1050))
knock(uw('design', 'reports', -0.05), 0.011, px(1675), 260)
tap(uw('cost', 'two sets', 0.05), 0.008, px(600))
tBh = uw('cost', 'always a little behind', 0.0)
tap(tBh + 0.05, 0.008, px(1200))
strike(Ab3, tBh, 0.5, px(900)); low(F2, tBh, 0.55); strike(Ab3, tBh + 0.45, 0.3, px(1200))
tap(tBh + 1.05, 0.008, px(960))

# 3. One copy: A-flat major. Noor's choice, the bigger drum and a tongue together; the app on Lakebase; Linh's claim typed as a row and
#    approved in it (C); Postgres serves the app (C, on its side) and the lakehouse reads the same rows (E flat, on its side), and when
#    the read reaches the rows, both together: the mark. The readers, through Unity Catalog (A flat); one writer for each table; the
#    contracts served to the app and checked; written once, read where it's written (E flat and A flat together)
cw = lambda lid, word, off=0: W('copy', lid, word, off)
c0 = S0('copy')
tap(c0 + 0.35, 0.008, px(640))
knock(cw('noor', 'chose one copy', -0.15), 0.012, px(1050), 240)
strike(Eb4, cw('noor', 'chose one copy', -0.15), 0.5, px(1050)); low(Ab2, cw('noor', 'chose one copy', -0.15), 0.6)
knock(cw('lakebase', 'built on', 0.0), 0.011, px(235), 240)
knock(cw('lakebase', 'Lakebase', 0.0), 0.011, px(704), 260)
tap(cw('lakebase', 'Postgres database', 0.1), 0.007, px(756))
tO = cw('once', 'Linh writes')
knock(tO - 0.25, 0.011, px(988), 230)
tRow = cw('once', 'as a row')
keys(tO + 0.4, 6, max(0.6, tRow - tO - 0.5), 0.006, px(988))
tAp = cw('once', 'approves', 0.3)
approve(tAp, 0.009, px(1250)); strike(C4, tAp, 0.45, px(1250))
# the two engines on one copy: the mark
tSv = cw('engines', 'serves the app', 0.0)
air(tSv - 0.2, 0.9, 0.006, px(704), 180, 900)
knock(cw('engines', 'the lakehouse', -0.15), 0.011, px(1240), 260)
air(cw('engines', 'in place', -0.2), 0.8, 0.006, px(1240), 180, 900)
mark(tSv, cw('engines', 'the lakehouse', 0.0), cw('engines', 'in place', 0.4), C4, Eb4, Ab2, 0.9, px(704), px(1240))
tap(cw('engines', 'without slowing', 0.05), 0.008, px(820))
# the readers, one after another, then Unity Catalog on each of their lanes
tL = cw('readers', "Payroll's list", -0.2)
for i in range(3):
    tap(tL + 0.34 * i + 0.25, 0.007, px(1273))
knock(cw('finance', 'Unity Catalog', -0.05), 0.010, px(1170), 280)
strike(Ab3, cw('finance', 'Unity Catalog', 0.0), 0.5, px(1170))
# one writer for each table; the contracts, from the HR system, served to the app and checked against each claim
tap(cw('writer', 'The app writes', 0.05), 0.008, px(756))
knock(cw('contracts', 'HR system', -0.25), 0.011, px(235), 240)
air(cw('contracts', 'HR system', 0.1), 1.0, 0.006, px(500), 180, 900)
approve(cw('contracts', 'checks each claim', 0.5), 0.008, px(400))
tap(cw('written', 'written once', 0.05), 0.008, px(960))
strike((Eb4, Ab4), cw('written', 'written once', 0.0), 0.5, 0.0, ring=1.4)

# 4. Fewer platforms: what's gone, each part crossed out; the integration services come together on one platform (A flat, E flat and
#    the bigger drum's A flat, together); one catalog, like every other table (C); what still moves (B flat, a question); the hours to
#    pay leave by noon on Tuesday under a contract; one thing moves, on purpose (E flat); the next film's card
fw = lambda lid, word, off=0: W('fewer', lid, word, off)
f0 = S0('fewer')
tap(f0 + 0.35, 0.008, px(960))
strikeout(fw('gone', 'the pipeline', 0.0), 0.011, px(595))
strikeout(fw('gone', 'the second database', 0.0), 0.011, px(1050))
strikeout(fw('gone', 'keeping two copies', 0.0), 0.010, px(1190))
for i, x in enumerate((240, 1700, 1700)):
    tap(fw('together', 'separate platforms', -0.35 + 0.15 * i), 0.006, px(x))
air(fw('together', 'come together', 0.0), 1.2, 0.007, px(960), 160, 900)
tTog = fw('together', 'come together', 0.4)
strike((Ab3, Eb4), tTog, 0.5, 0.0, ring=1.5); low(Ab2, tTog, 0.6)
tap(fw('catalog', 'who may read', -0.1), 0.007, px(756))
tap(fw('catalog', 'every other table', -0.05), 0.008, px(960))
strike(C4, fw('catalog', 'every other table', -0.05), 0.45)
strike(Bb3, fw('moves', 'What still moves', 0.0), 0.45, px(1300))
knock(fw('moves', 'a payroll system', -0.15), 0.012, px(1711), 240)
air(fw('tuesday', 'leave the platform', -0.1), 1.0, 0.007, px(1500), 180, 900)
tap(fw('tuesday', 'by noon', -0.05), 0.008, px(1711))
tap(fw('tuesday', 'under a contract', -0.05), 0.008, px(1711))
tap(fw('purpose', 'One thing moves', 0.05), 0.008, px(960))
strike(Eb4, fw('purpose', 'One thing moves', 0.0), 0.5)
knock(fw('night', 'comes later', 0.15), 0.012, px(960), 240)

# 5. What to choose: the four cards, a tongue for the first two (E flat, C), knocks for the others; here, one copy serves a whole
#    platform (A flat and E flat together); the wheel, the bigger drum's A flat and C; the four steps, rising, as each is said; the
#    official docs
hw = lambda lid, word, off=0: W('choose', lid, word, off)
for lid, word, x in (('keep', 'Keep', 525), ('decide', 'Decide', 1395), ('bought', 'Where', 525), ('both', 'Both', 1395)):
    knock(hw(lid, word, -0.15), 0.012, px(x), 240)
strike(Eb4, hw('keep', 'Keep', -0.15), 0.5, px(525))
strike(C4, hw('decide', 'Decide', -0.15), 0.5, px(1395))
strike((Ab3, Eb4), hw('both', 'Here', 0.0), 0.5, px(1395), ring=1.4)
tWh = hw('wheel', 'There are', -0.1)
air(tWh + 0.1, 1.2, 0.006, px(960), 160, 900)
low(Ab2, hw('wheel', 'standards', 0.0), 0.6); strike(C4, hw('wheel', 'standards', 0.0), 0.45)
for word, m, x in (('Investigate', Ab3, 330), ('adapt', C4, 750), ('implement', Eb4, 1170), ('iterate', Ab4, 1590)):
    strike(m, hw('docs', word, -0.1), 0.42, px(x))
knock(hw('docs', 'official docs', -0.15), 0.012, px(960), 250)

# 6. The same row: back in Amsterdam's ledger, the line moves from page to page again (the mark, apart) and the same ledger shows what
#    everyone held (together); at the university, Linh's claim is one row: four tags, one for each who uses it, and the row lit for all
#    of them (A flat and C together); not one claim copied; the end card: the mark, as on the title card
rw = lambda lid, word, off=0: W('row', lid, word, off)
tM2 = rw('amsterdam', 'a line moved')
quill(tM2 - 0.2, 0.6, 0.005, px(590))
air(tM2, 1.6, 0.006, 0.0, 200, 1000)
quill(tM2 + 1.28, 0.32, 0.005, px(1330))
mark(tM2, tM2 + 1.6, rw('amsterdam', 'the same ledger', 0.0), Eb4, C4, Ab2, 0.85, px(590), px(1330))
knock(rw('onerow', 'one row', -0.15), 0.012, px(1120), 240)
for word, x in (('she writes it', 640), ('her coordinator approves', 1140), ('payroll pays', 640), ('Finance counts', 1140)):
    tap(rw('onerow', word, -0.05), 0.008, px(x))
approve(rw('onerow', 'her coordinator approves', 0.3), 0.007, px(1120))
strike((Ab3, C4), rw('onerow', 'Finance counts', 0.4), 0.5, px(1120), ring=1.4)
tap(rw('paid', 'not one claim', 0.05), 0.008, px(1240))
tEnd = G('row', 'takeaway', -0.8)
mark(tEnd + 0.3, tEnd + 0.85, tEnd + 1.4, C4, Eb4, Ab2, 0.9)
