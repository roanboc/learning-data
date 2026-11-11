# Know what you hold: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py). A new
# palette, checked on 5 November 2026 against every score.py on main and on every branch, and against the module's other films
# (/mnt/project-files/data-protection/palettes.md, where this film's thread took it): porcelain bells and a sordun, both made here
# (music.py has neither).
#  - Porcelain bells, as in the carillon of porcelain bells in Meissen's Frauenkirche (1929): small bells of fired porcelain, struck softly
#    with a felt mallet, a short, clear, warm note, kept low (under 2.4 kHz). One bell for each class, the strictest the lowest: special
#    A3, direct C4, pseudonymous E4, indirect G4, none C5. A column named is one bell struck once, where its class is first named on
#    screen, and nothing plays under the voice besides; the five together are the title and the end. In Chile they are the octagons,
#    which named what each pack held.
#  - The sordun, the soft double reed of the late 1500s, its bore folded up and down inside one wooden column: low, quiet, one voice, no
#    vibrato. Its few long notes sound under the opening (Chile, 2012 to 2016), as Chile comes back in the last chapter, and at the end.
#  - A minor for 2012, a parent who can't tell; E, held, as something has to change; C major for the law, the octagons and what they did.
#    Every interval is tuned pure (just intonation from C, see hz()): A minor, C major and F major are pure in this table, and so are the
#    bells' own partials against each other and against the sordun (a bell's partials are whole-number ratios of its note: the tierce
#    of A3 is C4 exactly), so nothing beats; D, whose fifth with A isn't pure here, is never played.
# The rules the module keeps (its briefs, 5 November 2026, as the governance and agent films do):
#  - Music only from time to time: under the opening story (chapter 1), and after it only under a moment on screen (a class named), as
#    Chile comes back and at the end; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato, and no urgent pulse (film.json lists no urgent chapter).
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same word and offset as the picture in
#    src/scenes.js, scenes2.js and scenes3.js, so sound and picture stay together when the voice is re-timed. A burst on screen (a row of
#    slots, chips glowing one after another) is one soft sound, never one for each.
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
def END(sid, lid):
    """when a line's voice stops"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(2016)  # this film's own randomness: the room, the breath, the paper

# ---- tuning: just intonation from C, so a chord's notes, and a bell's partials, are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (36, 65.406)  # C 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
C2, E2, F2, G2, A2, C3 = 36, 40, 41, 43, 45, 48
A3, C4, E4, G4, C5 = 57, 60, 64, 67, 72
BELL = {'special': A3, 'direct': C4, 'pseudonymous': E4, 'indirect': G4, 'none': C5}   # one bell for each class, the strictest the lowest

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py), as
# low as the governance films', whose sound the author accepted; the sordun under the bells; the effects about 16 dB under the music
# (FX scales them all)
PL, SL, FX = 0.075, 0.050, 1.7

# a room round the players: a hall of glass, ringing on for about a second and a half, nothing much above 1.8 kHz. Its level is set by
# what it rings where the notes are (its gain under 1.5 kHz is one), and each held note is set back to its own level in it (_held), as
# the video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.4)).astype(np.float32))(np.arange(int(1.4 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.02 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a note in the room, at its own level: the room moves a pure note's level up or down by where its reflections meet it, so the note
    is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- a porcelain bell, struck softly with a felt mallet: a bell's partials (the hum an octave under the note, the note, its minor
# third, fifth and octave, and two faint ones above), each a whole-number ratio of the note, so two bells, or a bell and the sordun,
# meet exactly and never beat; the higher partials die sooner, and the higher bells ring shorter. The felt: a soft start (4 ms) and a
# small, low thump, nothing bright. Struck once and left to ring
_BP = ((0.5, 0.20, 2.0), (1.0, 1.0, 1.5), (1.2, 0.34, 1.1), (1.5, 0.18, 0.8), (2.0, 0.40, 0.7), (2.5, 0.09, 0.4), (3.0, 0.07, 0.3))
def pbell(m, s, g=1.0, pan=0.0, room=0.3):
    f = hz(m); ring = 1.15 if m <= A3 else 1.0 if m <= C4 else 0.92 if m <= G4 else 0.8
    sec = 4.6 * ring; x = tt(sec).astype(np.float64); sig = np.zeros_like(x)
    for i, (r, a, d) in enumerate(_BP):
        if f * r > 2400:
            continue
        sig = sig + a * np.sin(2 * np.pi * f * r * x + 0.6 * i) * np.exp(-x / (d * ring))
    sig = sig * np.sin(0.5 * np.pi * np.minimum(1, x / 0.004)) ** 2
    nt = int(0.03 * SR); sig[:nt] += filt(noise(0.03)[:nt], 'low', 500) * np.exp(-np.arange(nt) / SR / 0.006) * 0.08
    sig = sig * np.cos(0.5 * np.pi * np.clip((x - sec + 0.25) / 0.25, 0, 1)) ** 2
    put(_held(filt((sig / max(1e-9, float(np.abs(sig).max()))).astype(np.float32), 'low', 2400), room), s, g * PL, pan)
def named(cls, s, g=1.0, pan=0.0):
    """a column named: its class's bell, struck once"""
    pbell(BELL[cls], s, g, pan)
def five(s, g=1.0, step=0.22):
    """the five bells, the strictest first, ringing on together: the title and the end"""
    for i, m in enumerate((A3, C4, E4, G4, C5)):
        pbell(m, s + step * i, g * (1.0 if i == 0 else 0.8), 0.5 * (i / 4 - 0.5))

# ---- the sordun: a double reed in a cylindrical bore, folded up and down inside one column, so the odd harmonics sound most and the
# even ones softly, with a little of a double reed's nasal ring around 600 Hz; dark, with nothing above 1.6 kHz at this level. The
# higher harmonics speak a moment after the first; a faint breath as the note starts. Held steady, with no vibrato; a note of 1.2 s or
# more swells a little and eases, once. One voice: a note ends as the next begins
def sordun(m, a, b, g=1.0, att=0.3, rel=0.7, pan=0.0, room=0.3):
    f = hz(m); sec = max(0.4, b - a); n = int((sec + rel + 0.1) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for k in range(1, int(1600 // f) + 1):
        fk = f * k
        w = (1.0 if k % 2 else 0.38) / k ** 0.85 * np.exp(-max(0.0, fk - 500) / 420) * (1 + 0.35 * np.exp(-((fk - 620) / 180) ** 2))
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.12 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * (4.6 + 0.4 * (k - 1)) / rel), 1.0)
        s = s + w * on * off * np.sin(2 * np.pi * fk * x + 0.37 * k)
    if sec >= 1.2:
        s = s * (0.9 + 0.1 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s / max(1e-9, float(np.abs(s).max()))
    br = filt(noise(n / SR + 0.01)[:n], 'band', (300, 1400)) * 0.006 * (np.where(x < sec, 1.0, np.exp(-(x - sec) * 20)) + 1.5 * np.exp(-x / 0.06))
    put(_held(filt((s + br).astype(np.float32), 'low', 1600), room), a, g * SL, pan)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.012, pan=0.0, f=240):
    """a soft knock on glass in a frame: a card or a slip set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.007, pan=0.0):
    """a muffled tap: a chip set in its place, a row lit"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.009, pan=0.0, sec=0.4):
    """a card laid down, or a box turned in the hand"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.007, pan=0.0, lo=150, hi=900):
    """a breath of air: light running along the glass, something sliding across"""
    s_air(s, sec, g * FX, pan, lo, hi)
def lock(s, g=0.009, pan=0.0):
    """a small lock turning: the key the code is made with"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)

# =============================================================================================================================
# 1. High in (the opening, with music all through it, and rests where the story asks a question). Chile, 2012, the back of a packet:
#    the sordun's low A. A parent who can't tell: C. Is thirty-three grams a lot? Nothing. One child in four: F, low. Something has to
#    change: E, held over the pause. A law: C. The limits: nothing. June 2016: G, and the octagons land, two bells, as C answers it.
#    The maker, the schools: nothing. A quarter less bought: G to C again. Makers take sugar out: nothing. The front says which to be
#    careful with: C. The title: the five bells together, over the sordun's low C
H = lambda lid, word, off=0: W('high', lid, word, off)
sordun(A2, G('high', 'place', -0.2), END('high', 'back') + 0.5, 0.85, att=1.4, rel=1.2)
sordun(C3, H('print', 'small print', -0.3), END('high', 'print') + 0.4, 0.8, att=0.6, rel=1.0)
sordun(F2, H('obese', 'one child', -0.2), END('high', 'obese') + 0.3, 0.8, att=0.8, rel=1.1)
sordun(E2, H('change', 'Parents', -0.1), G('high', 'law', -0.1), 0.85, att=0.6, rel=0.6)
sordun(C3, H('law', 'a law', -0.1), END('high', 'law') + 0.4, 0.8, att=0.4, rel=1.0)
sordun(G2, H('octagon', 'June', -0.1), H('octagon', 'black octagon', -0.1), 0.8, att=0.5, rel=0.5)
sordun(C3, H('octagon', 'black octagon', -0.05), END('high', 'octagon') + 0.5, 0.8, att=0.3, rel=1.0)
sordun(G2, H('bought', 'households', -0.1), H('bought', 'a quarter', -0.1), 0.75, att=0.5, rel=0.5)
sordun(C3, H('bought', 'a quarter', -0.05), END('high', 'bought') + 0.8, 0.75, att=0.3, rel=1.1)
sordun(C3, H('front', 'The front', -0.2), G('high', 'breath', 0.2), 0.7, att=0.6, rel=0.6)
# the back of the packet: the box turned, its table of numbers, and one number lifted out with a question
paper(H('back', 'on the back', -0.1), 0.009, px(960), 0.5)
tap(H('back', 'energy', 0.0), 0.006, px(1300))
tap(G('high', 'lot', 0.0), 0.007, px(1300)); tap(G('high', 'lot', 0.5), 0.006, px(1612))
# the end of the aisle: the children, the law and its limits
air(G('high', 'obese', -0.4), 1.0, 0.006, px(500), 150, 700)
paper(H('obese', 'one child', 0.3), 0.009, px(540), 0.4)
knock(H('law', 'a law', 0.0), 0.011, px(1370), 230)
knock(H('limits', 'sets limits', 0.0), 0.010, px(1370), 230)
for w_, x_ in (('sugars', 1090), ('sodium', 1230), ('saturated', 1380), ('calories', 1580)):
    tap(H('limits', w_, 0.0), 0.005, px(x_))
# the front, from June 2016: the two octagons land (two bells), the stop sign's outline, their words, the maker's recipe, the school rules
bO = H('octagon', 'black octagon')
pbell(A3, bO, 0.75, px(1100)); pbell(C4, bO + 0.45, 0.65, px(1100))
air(H('octagon', 'stop sign', 0.0), 0.9, 0.006, px(1100), 200, 1000)
tap(H('octagon', 'high in sugars', 0.0), 0.006, px(1400)); tap(H('octagon', 'high in sugars', 0.6), 0.006, px(1400))
paper(H('maker', 'maker', 0.0), 0.009, px(400), 0.45)
knock(H('schools', 'school', 0.0), 0.008, px(1500), 200); knock(H('schools', 'advertised', 0.0), 0.008, px(1500), 200)
# drinks bought, against what was expected: the chart's card, its line drawn, the quarter
paper(G('high', 'bought', -0.3), 0.009, px(960), 0.45)
air(G('high', 'bought', 0.0), 3.0, 0.005, px(860), 150, 800)
tap(H('bought', 'a quarter', 0.0), 0.007, px(960))
# makers take sugar and sodium out; the box turns to its back and to its front again
air(H('reform', 'sugar', 0.0), 1.2, 0.006, px(400), 150, 800)
air(H('reform', 'sodium', 0.0), 1.0, 0.006, px(1740), 150, 800)
paper(G('high', 'front', 0.3), 0.008, px(960), 0.5); paper(H('front', 'The front', -0.1), 0.008, px(960), 0.5)
# the title card
tT = G('high', 'breath', 0.3)
five(tT, 0.85)
sordun(C2, tT + 0.1, E('high') + 0.4, 0.75, att=1.0, rel=1.4)

# 2. Plain words (from here, music only now and then). The learner table's slots; Anil's card; the agreement Mei signed; the register's
#    question. Its three answers until now, each a class named: three bells, direct, pseudonymous, none. The chips set in the table: a tap
#    for a few. The study could have both: the agreement's two phrases, and a question to each chip
P = lambda lid, word, off=0: W('plain', lid, word, off)
air(P('tables', 'the front', 0.0), 0.9, 0.005, px(240), 200, 900)
paper(P('tuesday', 'Anil', 0.0), 0.008, px(1310), 0.4)
paper(P('signed', 'signed', 0.35), 0.009, px(560), 0.5)
paper(G('plain', 'question', 0.0), 0.009, px(1310), 0.45)
named('direct', P('three', 'direct', 0.0), 0.8, px(1300))
named('pseudonymous', P('three', 'pseudonymous', 0.0), 0.75, px(1300))
named('none', P('three', 'none', 0.0), 0.7, px(1300))
tap(P('three', 'name', 0.0), 0.006, px(420)); tap(P('three', 'student', 0.0), 0.006, px(420))
tap(P('none', 'Course', 0.0), 0.006, px(420)); tap(P('none', 'Date of birth', 0.0), 0.006, px(420))
paper(P('both', 'both', -0.1), 0.009, px(1310), 0.45)
tap(P('both', 'both', 0.9), 0.006, px(900)); tap(P('both', 'both', 1.2), 0.006, px(900))

# 3. Two more classes. Yusuf's list; the two classes he adds slide in; indirect and special, each named: its bell. A course of twelve,
#    and one birthday lit. Strictest first: the list sorts itself. The agreement's plain words get their classes: a tap as each chip
#    lands (the classes were named a moment ago; no bell again)
Q = lambda lid, word, off=0: W('classes', lid, word, off)
paper(Q('yusuf', 'the list', -0.3), 0.009, px(780), 0.45)
air(Q('adds', 'adds two', 0.0), 0.9, 0.005, px(780), 200, 900)
named('indirect', G('classes', 'indirect', 0.0), 0.8, px(780))
paper(G('classes', 'birthday', -0.2), 0.008, px(1500), 0.4)
tap(Q('birthday', 'a birthday', 0.0), 0.007, px(1500))
named('special', G('classes', 'special', 0.0), 0.8, px(780))
air(Q('five', 'strictest first', 0.0), 1.0, 0.005, px(780), 200, 900)
paper(G('classes', 'words', -0.1), 0.009, px(960), 0.45)
for lid, w_ in (('names', 'direct'), ('names', 'special'), ('code', 'pseudonymous'), ('code', 'indirect'), ('code', 'none')):
    tap(Q(lid, w_, 0.0), 0.006, px(1300))

# 4. A level for each table. The four panes come in (one breath of air); each level's slip set down as it's said, a soft knock; the
#    restricted pane frosts. The floors card, and its two rows lit. No music: the classes rang, the levels are glass
L4 = lambda lid, word, off=0: W('levels', lid, word, off)
air(G('levels', 'level', 0.3), 1.4, 0.005, px(960), 150, 800)
for t_, x_ in ((G('levels', 'public'), 290), (L4('public', 'Internal'), 740), (G('levels', 'confidential'), 1180), (L4('confidential', 'Restricted'), 1630)):
    knock(t_, 0.008, px(x_), 260)
air(L4('confidential', 'Restricted', 0.1), 0.9, 0.005, px(1630), 150, 700)
paper(G('levels', 'floors', 0.0), 0.009, px(960), 0.45)
tap(L4('floors', 'never public', -0.6), 0.006, px(760)); tap(G('levels', 'restricted', 0.0), 0.006, px(760))

# 5. What it holds. Exam support's values, and why Mei knows: for a disability. Its class turns special: the special bell, as the chip
#    takes its ring. The whole table would be restricted: its slip changes; the help desk and Planning, shut out. Exam support moves to a
#    table of its own: a slide, and the special bell, softly, as it lands; the support table's slip; the learner table confidential again
O5 = lambda lid, word, off=0: W('holds', lid, word, off)
paper(O5('support', 'Its values', -0.2), 0.009, px(1310), 0.45)
tap(O5('why', 'for a disability', 0.0), 0.006, px(1310))
named('special', O5('health', 'special', 0.0), 0.8, px(420))
knock(O5('strict', 'restricted', 0.3), 0.008, px(330), 260)
tap(O5('strict', 'the help desk', 0.0), 0.006, px(1200)); tap(O5('strict', 'Planning', 0.0), 0.006, px(1420))
paper(O5('moves', 'a table of its own', -0.1), 0.009, px(1330), 0.45)
mv = O5('moves', 'moves')
air(mv, 1.8, 0.006, px(760), 150, 800)
named('special', mv + 1.8, 0.55, px(1330))
knock(O5('moves', 'restricted', 0.0), 0.008, px(1330), 260)
tap(O5('moves', 'the few', 0.0), 0.006, px(1330))
knock(O5('stays', 'confidential', 0.3), 0.008, px(330), 260)

# 6. Named at the source. Where the data is born: light along the table's edge. Like the octagon (a card, its two rows); the list of
#    classes, and the owner picks one for each column: the chips glow in turn, one breath. A scan suggests a class for Email, its dotted
#    line; Mei confirms it, and the column is named by its owner: the direct bell. A new column with no class: the sign-off sheet, and it
#    doesn't go through
S6 = lambda lid, word, off=0: W('source', lid, word, off)
air(S6('who', 'at the source', -0.2), 1.2, 0.005, px(120), 150, 800)
paper(G('source', 'like', -0.1), 0.009, px(1320), 0.45)
tap(S6('like', 'the Ministry', 0.0), 0.006, px(1320)); tap(S6('like', 'the maker', 0.0), 0.006, px(1320))
paper(G('source', 'list', -0.05), 0.009, px(1320), 0.45)
air(S6('list', 'the owner picks', 0.0), 2.2, 0.005, px(560), 200, 900)
paper(S6('scan', 'A scan', -0.15), 0.009, px(1320), 0.45)
air(S6('scan', 'A scan', 0.2), 0.6, 0.005, px(900), 200, 1000)
ok6 = S6('scan', 'looks like an email', 1.1)
named('direct', ok6, 0.6, px(560)); tap(ok6, 0.006, px(560))
paper(S6('new', 'a new column', -0.1), 0.009, px(620), 0.5)
knock(S6('new', "doesn't go through", 0.0), 0.008, px(620), 200)
tap(S6('new', 'a question', 0.0), 0.006, px(620))

# 7. The class follows. Light runs along the glass from the learner table to the study (one breath); course and results ride over and
#    land, a tap each. The key's sealed card; the student number rides out, turns into the code at the key (a small lock) and lands; the
#    date of birth rides out, becomes the year and lands. Mei names the code pseudonymous and the year indirect: their bells, as she
#    names them. Exam support's light stops short of the study: a cross. The totals: their light, their card, their count hidden under
#    ten, and their new class, none: its bell. The class goes wherever the column goes: every chip glows once, left to right
F = lambda lid, word, off=0: W('follows', lid, word, off)
air(G('follows', 'carries', 0.2), 1.8, 0.006, px(580), 150, 900)
rW = F('reach', 'Course and results')
tap(rW + 1.5, 0.006, px(740)); tap(rW + 1.8, 0.006, px(740))
nW = F('code', 'The student number')
knock(nW - 0.6, 0.008, px(575), 250)
tap(nW, 0.006, px(470)); lock(nW + 1.0, 0.009, px(575)); tap(nW + 2.8, 0.006, px(1040))
dW = F('year', 'The date of birth')
tap(dW + 1.0, 0.006, px(600)); tap(dW + 2.6, 0.006, px(1040))
named('pseudonymous', F('mei', 'pseudonymous', 0.0), 0.7, px(760))
named('indirect', F('mei', 'indirect', 0.0), 0.7, px(760))
nv = F('never', 'never reaches')
air(nv, 0.8, 0.005, px(800), 150, 800); knock(nv + 0.8, 0.007, px(860), 200)
tW = F('totals', "Anil's totals")
air(tW, 1.0, 0.005, px(1265), 150, 900); paper(tW + 0.6, 0.008, px(1590), 0.45)
tap(F('totals', 'under ten hidden', 0.0), 0.006, px(1590))
named('none', F('totals', 'none', 0.0), 0.7, px(1350))
air(F('goes', 'wherever the column goes', 0.0), 1.6, 0.006, px(960), 200, 1000)

# 8. Named first. Chile again: the sordun's C, as it comes back. The box: families, schools and makers, each a soft knock as it's
#    named. The hall as the last chapter left it: every column's chip glows once, every pane's slip; the next question's outlines. The
#    end card: the five bells, and the sordun's low C
N = lambda lid, word, off=0: W('named', lid, word, off)
sordun(C3, G('named', 'sugar', -0.3), END('named', 'sugar') + 0.6, 0.7, att=0.6, rel=1.0)
for w_, i in (('families', 0), ('schools', 1), ('makers', 2)):
    knock(N('acted', w_, 0.0), 0.008, px(1450), 230 + 15 * i)
air(N('now', 'every column', 0.0), 1.8, 0.006, px(960), 200, 1000)
air(N('now', 'every table', 0.0), 1.4, 0.005, px(960), 150, 800)
air(N('next', 'Which way to hide', 0.0), 0.8, 0.005, px(960), 200, 900)
tEnd = G('named', 'breath', 0.6)
five(tEnd, 0.8)
sordun(C2, tEnd + 0.1, E('named') + 0.4, 0.7, att=1.0, rel=1.6)
