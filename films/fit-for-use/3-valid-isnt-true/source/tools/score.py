# Valid isn't true: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, reserved for this film in /mnt/project-files/data-quality/palettes.md on 5 November 2026 and checked that day against
# every palettes.md in the project files and every score.py on main (no singing arc and no terpodion anywhere; the data management
# module, which first listed a terpodion, left it to this film): a singing arc and a terpodion, both made here (music.py has neither).
#  - The singing arc, the arc lamp of 1900 made to sing by a tuned circuit: it sings exactly the note its circuit sets, true or not. A
#    plain, warm electric tone, with a faint fizz that rides on its own cycle (so it never beats against the note) and a soft start as
#    the arc strikes. It plays what a check measures: the walk's stretches, the list's rules, "allowed".
#  - The terpodion, made in Berlin in 1816: a keyboard presses small wooden bars against a turning, coated cylinder, and the rubbed
#    wood sounds, soft, steady and woody, with a little friction as each note starts. It plays the reference, the note the arc is held
#    to: Ino's stars, the graduate, the exam boards' lists, the document seen at enrolment.
#  - The mark, as the title comes and again at the end, one note at a time so nothing beats: the terpodion's E alone; the arc's E, a
#    little flat; the arc's E again, true; and only then the two together, an octave apart.
#  - E major for what's true; C sharp minor for the problem: the doubts, the missing awards. The walk's stretches climb E major, each
#    one a few cents flatter than the last, the error piling up unheard, until the stars' note pulls the walk's end back in tune.
# The rules every film keeps (AGENTS.md, Sound; tools/quiet.py checks them):
#  - Music under the opening story (chapter 1, its title included); after it only from time to time, at a chapter's turn, under a
#    moment on screen or in a pause without words; never a bed under the voice.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato, no urgent pulse (nothing in this story is a rush); every
#    chord is tuned pure (just intonation from E, see hz()); a note sung a little flat never sounds with another note it could beat
#    against: the flat walk and the true stars take turns.
#  - Every sound is an event on screen, at the moment it appears, timed from the same word and offset as the picture in src/scenes.js,
#    so sound and picture stay together when the voice is re-timed. A burst on screen (ten stretches, four award cards) is a few soft
#    sounds, never one for each grain.
# And everything stays low and soft, below about 2.2 kHz.

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
R1 = np.random.default_rng(1816)  # this film's own randomness: the room, the rub, the paper

# ---- tuning: just intonation from E, so a chord's notes are whole-number ratios of each other and nothing beats. E major (E G sharp
# B), A major, B major, C sharp minor and G sharp minor are all pure in this table; F sharp with A is not (32/27), so no F sharp minor
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (52, 164.814)  # E 3: its MIDI note and its pitch
def hz(m, cents=0.0):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc] * 2 ** (cents / 1200)
Cs3, Ds3, E3, Fs3, Gs3, A3, B3, Cs4, Ds4, E4, Fs4, Gs4, A4, B4 = 49, 51, 52, 54, 56, 57, 59, 61, 63, 64, 66, 68, 69, 71
B2, Cs2, E2 = 47, 37, 40
WALK = (E3, Fs3, Gs3, A3, B3, Cs4, Ds4, E4, Fs4, Gs4)  # the walk: a note for each of the sheet's ten stretches
DRIFT = 4.0                                              # cents flatter, stretch after stretch: the last is 36 cents flat

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the effects about 16 dB under the music (FX scales them all)
AL, TL, FX = 0.054, 0.062, 1.4

# a room round the players: a small, quiet hall, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what
# it rings where the notes are (its gain under 1.5 kHz is one), so a held note keeps its level, as the video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.2)).astype(np.float32))(np.arange(int(1.2 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.02 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a held note in the room, at its own level: even at a gain of one, the room moves a pure note's level up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.2 * SR), max(int(0.2 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- the singing arc: a tuned circuit makes the arc sing one plain note, near a sine, with a little of the arc's own unevenness in
# its second and third harmonics; a faint electric fizz, shaped by the note's own cycle so it sits on the pitch; and, as the arc
# strikes, a soft breath of hiss. Held steady, with no vibrato. cents: how far off its circuit is set (the walk drifts flat);
# glide=(cents0, sec): it starts that far off and is brought to `cents` over sec, as the walk was corrected to the stars
def arc(m, a, b, g=1.0, pan=0.0, cents=0.0, glide=None, att=0.2, rel=0.4, room=0.28):
    f0 = hz(m); sec = max(0.3, b - a); n = int((sec + rel + 0.1) * SR); x = np.arange(n) / SR
    c = np.full(n, float(cents))
    if glide:
        c0, gs = glide; c = c0 + (cents - c0) * (0.5 - 0.5 * np.cos(np.pi * np.clip(x / gs, 0, 1)))
    ph = 2 * np.pi * np.cumsum(f0 * 2 ** (c / 1200)) / SR
    s = np.sin(ph) + 0.16 * np.sin(2 * ph + 0.3) + 0.07 * np.sin(3 * ph + 0.9) + 0.02 * np.sin(4 * ph + 1.7)
    fz = filt(noise(n / SR + 0.01)[:n], 'band', (500, 1800)) * (0.5 + 0.5 * np.cos(ph)) ** 2 * 0.07
    hs = filt(noise(n / SR + 0.01)[:n], 'band', (300, 1500)) * 0.05 * np.exp(-x / 0.07) * np.minimum(1, x / 0.01)
    on = np.sin(0.5 * np.pi * np.minimum(1, x / att)) ** 2
    off = np.where(x > sec, np.exp(-(x - sec) * 4.6 / rel), 1.0)
    s = (s + fz) * on * off; s = s / max(1e-9, float(np.abs(s).max())) + hs
    put(_held(filt(s.astype(np.float32), 'low', 2200), room), a, g * AL, pan)

# ---- the terpodion: a wooden bar rubbed by a turning, coated cylinder. A rubbed bar sounds all its harmonics, the odd ones a little
# stronger; the wood is warm round 300 to 700 Hz and soft above 900 Hz. Friction takes a moment to lock in: the higher harmonics speak
# a little after the first, the pitch settles from a few cents low in a twentieth of a second, and a short rasp of rubbing starts the
# note, then a faint steady rub under it. A note of 1.2 s or more swells a little and eases, once; nothing trembles
def terp(m, a, b, g=1.0, pan=0.0, att=0.16, rel=0.5, room=0.3):
    f0 = hz(m); sec = max(0.3, b - a); n = int((sec + rel + 0.12) * SR); x = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f0 * 2 ** (-12 * np.exp(-x / 0.05) / 1200)) / SR
    s = np.zeros(n)
    for k in range(1, int(2200 // f0) + 1):
        fk = f0 * k
        w = (1 + 0.8 * np.exp(-((fk - 520) / 260) ** 2)) * np.exp(-max(0.0, fk - 900) / 500) / k ** 1.1 * (1.15 if k % 2 else 0.8)
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.15 * (k - 1))), 1)) ** 2
        s = s + w * on * np.sin(k * ph + 0.5 * k)
    if sec >= 1.2:
        s = s * (0.9 + 0.1 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    off = np.where(x > sec, np.exp(-(x - sec) * 4.6 / rel), 1.0)
    rub = filt(noise(n / SR + 0.01)[:n], 'band', (250, 1400)) * (0.05 * np.exp(-x / 0.08) + 0.006)
    s = (s / max(1e-9, float(np.abs(s).max())) + rub) * off
    put(_held(filt(s.astype(np.float32), 'low', 2200), room), a, g * TL, pan)
def troll(notes, s, step=0.12, sec=1.8, g=1.0, pan=0.0, spread=0.25):
    """the terpodion's notes pressed one after another, the lowest first, and held together as a chord"""
    k = len(notes)
    for i, m in enumerate(notes):
        terp(m, s + step * i, s + sec, g * (1.0 if i == 0 else 0.8) / np.sqrt(max(1, k) / 2.5), pan + spread * (i / max(1, k - 1) - 0.5))
def aroll(notes, s, step=0.12, sec=1.4, g=1.0, pan=0.0, spread=0.25):
    """the arc's notes struck one after another and held together"""
    k = len(notes)
    for i, m in enumerate(notes):
        arc(m, s + step * i, s + sec, g * (1.0 if i == 0 else 0.8) / np.sqrt(max(1, k) / 2.5), pan + spread * (i / max(1, k - 1) - 0.5))
def mark(s, end=None):
    """the mark: the terpodion's E alone; the arc's E a little flat; the arc's E again, true; then the two together, an octave apart.
    One note at a time, each let go before the next, so the flat one never sounds with a true one"""
    terp(E3, s, s + 0.9, 0.95, rel=0.4)
    arc(E3, s + 1.3, s + 1.95, 0.9, cents=-35, rel=0.3)
    arc(E3, s + 2.4, s + 3.05, 0.95, rel=0.3)
    terp(E3, s + 3.5, end or s + 5.6, 0.95, att=0.2, rel=1.2); arc(E4, s + 3.56, end or s + 5.6, 0.65, att=0.3, rel=1.2)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a card set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a chip, a row lit, a key"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.008, pan=0.0, step=0.26):
    for i in range(n):
        tap(s + i * step + 0.04 * R1.uniform(), g if i < 2 else g * 0.7, pan)
def paper(s, g=0.012, pan=0.0, sec=0.4):
    """a sheet laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pencil(s, sec=0.6, g=0.007, pan=0.0):
    """a pen drawing a line: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.minimum(1, np.minimum(x, sec - x) / 0.08), s, g * FX, pan)
def stamp(s, g=0.016, pan=0.0):
    """a verdict's stamp pressed down: a low knock and the slap of its pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across, the night coming"""
    s_air(s, sec, g * FX, pan, lo, hi)
def click(s, g=0.011, pan=0.0):
    """a button pressed: a soft, dull click"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, g * 0.7 * FX, pan)
def thud(s, g=0.016, pan=0.0):
    """something heavier set down: bound volumes, a folder"""
    s_knock(s, g * FX, pan, 150); paper(s + 0.01, g * 0.4, pan, 0.18)

# =============================================================================================================================
# 1. Under the stars: the opening, with music all through it.
#    Edo at dawn: the terpodion's open fifth, E and B, low; the party sets out, G sharp. The map of the time: the cape as drawn, the
#    arc's E a little flat; where it really lay, the terpodion's E, true, once the arc has gone. The Russian ship: C sharp minor, low.
#    The walk: an arc note for each stretch as the sheet draws it, climbing E major, each a few cents flatter than the last. Something
#    had to change: A major. The night, and the star: the terpodion's B; how far north: E major, open. Where they disagreed, the arc's
#    last note as the walk left it; corrected: brought up to true, and the terpodion joins. The map finished: E major. His degree and
#    today's: the arc's G sharp, then the terpodion's. The bench: the checks' "allowed", the arc's E major; 88 still wrong, C sharp
#    minor; the list's stars: the terpodion's B; put right: E major, both together. The title: the mark.
S = lambda lid, word, off=0: W('stars', lid, word, off)
s0 = S0('stars')
terp(E3, s0 + 0.4, S('ino', 'set out', 0.6), 0.7, att=1.4, rel=1.4, pan=-0.1)
terp(B3, s0 + 1.0, S('ino', 'set out', 0.6), 0.5, att=1.4, rel=1.4, pan=0.1)
terp(Gs3, S('ino', 'set out', 0.1), S('ezo', 'Ezo', 0.2), 0.5, att=0.5, rel=1.2, pan=px(700))
air(s0 + 0.6, 2.4, 0.007, px(300), 160, 700)
paper(G('stars', 'ezo', -0.2), 0.010, px(1500), 0.4)
air(G('stars', 'ezo', 0.3), 2.4, 0.006, px(1560), 200, 900)
# the map of the time: the cape as drawn, a little flat; where it really lay, true, after the flat note has gone
paper(G('stars', 'maps', -0.1), 0.010, 0.0, 0.5)
arc(E3, S('maps', 'a cape', 0.1), S('maps', 'a cape', 1.0), 0.6, cents=-35, pan=px(1140))
pencil(S('maps', 'miles', 0.1), 0.9, 0.006, px(1300))
terp(E3, S('maps', 'really lay', -0.1), S('maps', 'really lay', 1.6), 0.65, att=0.3, rel=0.9, pan=px(1420))
# Ezo's shore by day; the Russian ship on the horizon: C sharp minor, low; the shogunate's card
air(G('stars', 'ships', -0.2), 2.0, 0.007, 0.0, 150, 700)
troll((Cs3, E3), S('ships', 'Russian', -0.1), 0.3, 2.4, 0.6, px(1500))
knock(S('ships', 'the shogunate', 0.0), 0.012, px(480), 240)
# the walk: the team at work; an arc note for each stretch as the sheet draws it, climbing, each a few cents flatter than the last
tSt = S('foot', 'each stretch'); tMo = S('agree', 'miles out'); per = (tMo - 0.4 - tSt) / 10
knock(G('stars', 'foot', -0.4), 0.010, px(530), 200)
for k_, m_ in enumerate(WALK):
    t_ = tSt - 0.2 + (k_ + 0.6) * per
    arc(m_, t_, t_ + 0.55, 0.5 - 0.012 * k_, cents=-DRIFT * k_, att=0.12, rel=0.3, pan=px(1300 + 15 * k_))
# something had to change: A major, as the card comes
knock(S('change', 'a reference', 0.0), 0.012, px(500), 240)
troll((A3, Cs4, E4), S('change', 'a reference', 0.0), 0.14, 2.0, 0.6)
# the night comes, the stars come out; the star: the terpodion's B; how far north: E major, open
air(S('night', 'on clear nights', -0.5), 3.0, 0.007, 0.0, 150, 800)
terp(B3, S('night', 'the stars', 0.0), S('night', 'the stars', 2.2), 0.6, att=0.4, rel=1.0, pan=px(386))
knock(S('height', 'height', -0.2), 0.009, px(800), 170)
troll((E3, B3, E4), S('height', 'how far north', 0.0), 0.16, 2.4, 0.6, px(1460))
# where the walk and the stars disagreed: the walk's end as it was; corrected: brought up to true, then the terpodion joins
tDis = S('corrected', 'disagreed', 0.0); tCor = S('corrected', 'corrected the walk', 0.0)
arc(Gs4, tDis, tDis + 0.7, 0.45, cents=-DRIFT * 9, rel=0.3, pan=px(1578))
arc(Gs4, tCor, tCor + 2.6, 0.45, cents=0.0, glide=(-DRIFT * 9, 1.5), att=0.3, rel=0.8, pan=px(1578))
troll((E3, B3), tCor + 1.7, 0.14, 2.6, 0.55, px(1460))
# the map of all Japan, finished: E major; his degree and today's, the same note
paper(G('stars', 'years', -0.2), 0.010, 0.0, 0.5)
knock(S('map', 'finished', 0.2), 0.012, px(490), 240)
troll((E3, Gs3, B3, E4), S('map', 'finished', 0.1), 0.13, 2.4, 0.65)
knock(S('map', 'the base', 0.0), 0.012, px(490), 240)
knock(G('stars', 'degree', 0.0), 0.011, px(490), 240)
arc(Gs3, S('degree', 'one degree', 0.05), S('degree', 'one degree', 1.0), 0.45, pan=px(600))
terp(Gs3, S('degree', 'north to south', 0.35), S('degree', 'north to south', 1.6), 0.5, att=0.3, rel=0.8, pan=px(600))
# the university: the list in its tray; the checks say every name is allowed: the arc's E major; 88 still wrong: C sharp minor
air(G('stars', 'uni', -0.2), 1.2, 0.006, 0.0, 160, 700)
knock(S('uni', 'the graduation list', -0.3), 0.014, px(760), 200)
aroll((E3, Gs3, B3), S('uni', 'allowed', 0.0), 0.12, 1.4, 0.6, px(1300))
tap(S('uni', 'allowed', 0.05), 0.010, px(1300))
arc(Cs3, S('wrong', 'still wrong', -0.1), S('wrong', 'still wrong', 1.6), 0.5, rel=0.7, pan=px(1150))
# the list needed its stars: the terpodion's B; the graduates put all 88 right: E major, the two together
terp(B3, S('needed', 'stars', -0.1), S('needed', 'stars', 1.7), 0.55, att=0.35, rel=0.9, pan=px(1130))
troll((E3, Gs3), S('right', 'right', 0.0), 0.14, 2.2, 0.6, px(1200)); arc(B3, S('right', 'right', 0.3), S('right', 'right', 2.2), 0.4, pan=px(1300))
tap(S('right', 'before', 0.05), 0.009, px(1400))
# the title: the mark, its last two notes ringing into the next chapter's first second
mark(G('stars', 'breath', 0.25), S0('allowed') + 1.2)

# 2. Every name allowed: the date, the list; the rules set down as they're said; all 1,064 pass: the arc's E major, its third on top.
#    Three records, each allowed: Zoë's name as she writes it, the terpodion's G sharp. The doubts: C sharp minor on the arc. A
#    question about the world: the terpodion's low E
A_ = lambda lid, word, off=0: W('allowed', lid, word, off)
tap(G('allowed', 'feb', 0.0), 0.009, px(260))
knock(G('allowed', 'holds', 0.2), 0.014, px(760), 200)
knock(A_('rules', 'not empty', -0.3), 0.011, px(1500), 240)
knock(A_('rules', 'letters', -0.3), 0.011, px(1500), 240)
knock(A_('thirty', 'at most', -0.3), 0.011, px(1500), 240)
air(A_('thirty', 'field', 0.0), 0.9, 0.006, px(1500), 200, 900)
aroll((B2, E3, Gs3), G('allowed', 'pass', 0.0), 0.12, 1.5, 0.55, px(1300))
tap(G('allowed', 'pass', 0.05), 0.010, px(1300))
knock(G('allowed', 'valid', 0.0), 0.012, px(840), 240)
knock(A_('means', 'allowed', -0.5), 0.012, px(840), 240)
for t0_ in (G('allowed', 'zoe', -0.2), A_('short', 'a name cut short', -0.2), A_('short', 'a given name', -0.2)):
    knock(t0_, 0.011, px(860), 240); tap(t0_ + 0.45, 0.009, px(1300))
terp(Gs3, G('allowed', 'zoe', 0.7), G('allowed', 'zoe', 2.4), 0.55, att=0.3, rel=0.9, pan=px(760))
tap(A_('doubts', 'a hundred records', -0.3), 0.009, px(800))
tap(G('allowed', 'twelve', 0.05), 0.010, px(1300))
arc(Cs3, G('allowed', 'twelve', 0.1), G('allowed', 'twelve', 1.9), 0.5, rel=0.8, pan=px(1250)); arc(E3, G('allowed', 'twelve', 0.25), G('allowed', 'twelve', 1.9), 0.4, rel=0.8, pan=px(1350))
tap(A_('twelve', 'not one accent', 0.05), 0.010, px(1300))
knock(G('allowed', 'cant', 0.0), 0.012, px(910), 240)
knock(G('allowed', 'world', 0.1), 0.012, px(910), 240)
terp(E3, G('allowed', 'world', 0.15), G('allowed', 'world', 2.6), 0.6, att=0.5, rel=1.2, pan=px(910))

# 3. A reference outside the data: Ino's star, the terpodion's B, at the turn. The arrow, closer to the truth: a breath of air. The
#    graduate comes: the terpodion's E and G sharp. The folder; the boards' bound lists, heavier. Accuracy, whether it's true: the arc
#    and the terpodion together, an octave apart
R_ = lambda lid, word, off=0: W('reference', lid, word, off)
terp(B3, R_('had', 'stars', -0.1), R_('had', 'stars', 1.8), 0.55, att=0.35, rel=1.0, pan=px(700))
knock(R_('needs', 'outside the data', -0.3), 0.012, px(1210), 240)
air(R_('three', 'closest', 0.0), 1.3, 0.007, px(930), 200, 900)
troll((E3, Gs3), G('reference', 'graduate', -0.1), 0.16, 1.8, 0.55, px(300))
tap(G('reference', 'graduate', 0.05), 0.009, px(300))
thud(G('reference', 'document', 0.0), 0.014, px(960))
tap(R_('document', 'checked once', 0.0), 0.009, px(960))
thud(G('reference', 'boards', 0.0), 0.016, px(1560))
for w_ in ('kept apart', 'who completed'):
    tap(R_('boards', w_, 0.0), 0.009, px(1560))
for w_, x_ in (('anything', 470), ('wait', 470)):
    tap(R_('ask', w_, -0.2), 0.008, px(x_))
for w_ in ('every night', 'spelling'):
    tap(R_('every', w_, -0.2), 0.008, px(1560))
knock(G('reference', 'accuracy', 0.1), 0.012, px(1540), 240)
terp(E3, G('reference', 'accuracy', 0.2), G('reference', 'accuracy', 2.6), 0.6, att=0.3, rel=1.1, pan=px(1540))
arc(E4, G('reference', 'accuracy', 0.26), G('reference', 'accuracy', 2.6), 0.4, att=0.3, rel=1.1, pan=px(1540))

# 4. Ask the graduate: the office's question, the date, the portal; Zoë presses "This isn't my name" and types it: the terpodion's
#    G sharp and E once her name stands as she writes it. The bar fills; the 925 who confirmed: the terpodion's E and B. All 88
#    allowed: the arc's E, alone. Mei's folder; 84 matched it: the terpodion's B. The list takes each name with its date. A check
#    can raise a doubt: C sharp minor on the arc; only a reference can settle it: the terpodion's E major
K_ = lambda lid, word, off=0: W('ask', lid, word, off)
knock(G('ask', 'asked', 0.2), 0.012, px(1460), 240)
tap(G('ask', 'portal', 0.0), 0.009, px(260))
tap(K_('portal', 'registered', -0.2), 0.009, px(1460))
knock(G('ask', 'showed', -0.2), 0.012, px(780), 300)
click(K_('zoe', 'pressed', -0.1), 0.011, px(780))
keys(K_('zoe', 'typed', 0.2), 7, 0.007, px(780), 0.25)
troll((E3, Gs3), K_('zoe', 'typed', 2.1), 0.16, 1.8, 0.5, px(560))
air(G('ask', 'answered', 0.0), 1.2, 0.006, px(1120), 200, 900)
troll((E3, B3), G('ask', 'confirmed', 0.0), 0.14, 1.8, 0.55, px(1000))
tap(G('ask', 'corrected', 0.0), 0.009, px(700))
for w_, l_ in (('fifty-one', 'corrected'), ('nineteen', 'corrected'), ('eleven', 'cut'), ('seven', 'cut')):
    air(K_(l_, w_, -0.2), 0.7, 0.004, px(1250), 250, 1000)
tap(G('ask', 'allowed', 0.0), 0.009, px(1100))
arc(E3, G('ask', 'allowed', 0.05), G('ask', 'allowed', 1.6), 0.45, rel=0.7, pan=px(1100))
tap(G('ask', 'legal', 0.0), 0.009, px(900))
thud(K_('next', 'the document', -0.2), 0.014, px(1330))
terp(B3, G('ask', 'matched', 0.0), G('ask', 'matched', 1.7), 0.5, att=0.3, rel=0.9, pan=px(1330))
tap(G('ask', 'four', 0.0), 0.009, px(800))
knock(G('ask', 'took', 0.0), 0.012, px(880), 240)
tap(K_('took', 'with the date', -0.2), 0.009, px(620))
knock(G('ask', 'didnt', 0.0), 0.012, px(880), 240)
knock(G('ask', 'one', 0.1), 0.012, px(500), 240)
tap(G('ask', 'one', 0.6), 0.009, px(1100))
stamp(K_('one', 'settled', 0.7), 0.012, px(1100))
knock(G('ask', 'doubt', 0.0), 0.012, px(580), 240)
arc(Cs3, G('ask', 'doubt', 0.05), G('ask', 'doubt', 1.9), 0.45, rel=0.6, pan=px(580)); arc(E3, G('ask', 'doubt', 0.2), G('ask', 'doubt', 1.9), 0.35, rel=0.6, pan=px(620))
knock(G('ask', 'settle', 0.0), 0.012, px(580), 240)
troll((E3, Gs3, B3), G('ask', 'settle', 0.1), 0.14, 2.4, 0.6, px(580))

# 5. Another record, kept apart: a double degree's two awards; the boards' row and the list's, each one soft sheet; the check's
#    verdicts, award by award: two stamps for the missing, two taps for the rest. 1,101 approved: the terpodion's B. The missing
#    two: C sharp minor on the arc. Every row passed: the arc's open fifth on B, hollow. Both certificates printed: E major, the two
#    together. Kept apart: the terpodion's low E. A copy: two arcs on one note, a little flat, agreeing with each other. Ino's stars:
#    the terpodion's B. No clock: one soft tick
P_ = lambda lid, word, off=0: W('apart', lid, word, off)
knock(G('apart', 'double', 0.4), 0.011, px(685), 240); knock(G('apart', 'double', 0.8), 0.011, px(1035), 240)
tap(G('apart', 'monday', 0.2), 0.009, px(260))
paper(P_('monday', "exam boards'", -0.3), 0.010, px(1100), 0.5)
paper(P_('monday', 'the list', -0.3), 0.010, px(1100), 0.5)
tBy = P_('monday', 'award by award', 0.0)
for i_ in range(4):
    (stamp if i_ % 2 == 0 else tap)(tBy + 0.35 * i_ + 0.4, 0.011 if i_ % 2 == 0 else 0.008, px(665 + 345 * i_))
terp(B3, G('apart', 'approved', 0.05), G('apart', 'approved', 1.7), 0.55, att=0.3, rel=0.9, pan=px(600))
tap(G('apart', 'held', 0.05), 0.009, px(1300))
arc(Cs3, G('apart', 'missing', 0.05), G('apart', 'missing', 2.0), 0.45, rel=0.7, pan=px(700)); arc(E3, G('apart', 'missing', 0.2), G('apart', 'missing', 2.0), 0.35, rel=0.7, pan=px(1300))
tap(G('apart', 'laws', 0.0), 0.009, px(700))
tap(G('apart', 'passed', 0.6), 0.010, px(1450))
arc(B2, G('apart', 'passed', 0.7), G('apart', 'passed', 2.2), 0.42, rel=0.7, pan=px(1450)); arc(Fs3, G('apart', 'passed', 0.85), G('apart', 'passed', 2.2), 0.32, rel=0.7, pan=px(1450))
tap(G('apart', 'found', 0.0), 0.009, px(700))
tBo = P_('found', 'both Arts', 0.2)
tap(tBo, 0.009, px(1300))
troll((E3, Gs3), tBo + 0.05, 0.14, 2.0, 0.55, px(1100)); arc(B3, tBo + 0.3, tBo + 2.0, 0.38, pan=px(1150))
tap(G('apart', 'agreed', 0.0), 0.009, px(700))
tap(G('apart', 'kept', 0.0), 0.009, px(520))
terp(E3, G('apart', 'kept', 0.1), G('apart', 'kept', 2.0), 0.5, att=0.4, rel=1.0, pan=px(520))
tap(P_('made', 'own decisions', -0.3), 0.008, px(800))
paper(G('apart', 'copy', 0.3), 0.010, px(1100), 0.5)
tBw = P_('copy', 'both would be wrong', -0.2)
arc(E3, tBw, tBw + 1.8, 0.35, cents=-30, rel=0.7, pan=px(900)); arc(E3, tBw, tBw + 1.8, 0.35, cents=-30, rel=0.7, pan=px(1300))
knock(G('apart', 'consistent', 0.0), 0.012, px(1480), 240)
air(G('apart', 'like', -0.1), 2.0, 0.007, 0.0, 150, 800)
terp(B3, G('apart', 'like', 0.6), G('apart', 'like', 2.4), 0.5, att=0.4, rel=1.0, pan=px(386))
knock(P_('east', 'an exact clock', -0.3), 0.010, px(420), 240)
s_knock(P_('east', 'none', 0.0), 0.006 * FX, px(420), 320)
for w_ in ('missing', 'spelled'):
    tap(P_('spelled', w_, -0.3), 0.009, px(960))

# 6. Say which reference: the project's file of checks; its lines as Jun writes them. No reference but the rule itself: the arc's E,
#    alone. The awards check's reference, the boards' lists: the terpodion's B. For names, the graduate: the terpodion's G sharp. The
#    test's method; the scorecard counts them apart: allowed, the arc's E; true, the terpodion's G sharp. Only as true as its reference: the two
#    together
H_ = lambda lid, word, off=0: W('which', lid, word, off)
air(G('which', 'every', 0.2), 0.9, 0.007, px(1160), 200, 900); knock(G('which', 'every', 0.35), 0.012, px(1160), 240)
keys(G('which', 'beside', -0.2), 3, 0.007, px(700), 0.45)
tap(G('which', 'validity', 0.6), 0.009, px(1300))
arc(E3, G('which', 'validity', 0.65), G('which', 'validity', 2.2), 0.45, rel=0.8, pan=px(1300))
terp(B3, G('which', 'awards', 0.1), G('which', 'awards', 1.8), 0.5, att=0.3, rel=0.9, pan=px(1000))
tap(G('which', 'graduate', 0.0), 0.009, px(800))
terp(Gs3, G('which', 'graduate', 0.4), G('which', 'graduate', 2.0), 0.5, att=0.3, rel=0.9, pan=px(800))
knock(G('which', 'contract', 0.1), 0.012, px(1160), 240)
for w_ in ('its method', 'reconciliation'):
    tap(H_('contract', w_, 0.0), 0.008, px(900))
knock(G('which', 'scorecard', 0.1), 0.012, px(1060), 240)
arc(E3, H_('scorecard', 'allowed', -0.1), H_('scorecard', 'allowed', 0.9), 0.4, rel=0.4, pan=px(1100))
terp(Gs3, H_('scorecard', 'true', -0.1), H_('scorecard', 'true', 1.4), 0.45, att=0.25, rel=0.7, pan=px(1100))
knock(G('which', 'only', 0.0), 0.012, px(930), 240)
terp(E3, G('which', 'only', 0.2), G('which', 'only', 2.6), 0.55, att=0.3, rel=1.1, pan=px(930)); arc(E4, G('which', 'only', 0.26), G('which', 'only', 2.6), 0.36, att=0.3, rel=1.1, pan=px(930))
for w_ in ('what it can tell', "what it can't"):
    tap(H_('say', w_, -0.2), 0.009, px(700))

# 7. Allowed, and true: Ezo by day, the walk's last two stretches, flat as they were; by night, the star; how far north they really
#    were: the walk's end brought up to true, and the terpodion joins. The bench: the list to the printer, the envelope closed; what
#    was put right; 1,013 confirmed by the person they belong to: the terpodion's E major. A check says it's allowed: the arc's E. Only
#    a reference says it's true: the terpodion's E. The end card: the reference alone, then the two together
T_ = lambda lid, word, off=0: W('true', lid, word, off)
t7 = S0('true')
air(t7 + 0.2, 1.8, 0.006, 0.0, 150, 700)
arc(Fs4, G('true', 'walked', 1.6), G('true', 'walked', 2.6), 0.42, cents=-DRIFT * 8, att=0.12, rel=0.5, pan=px(1500))
arc(Gs4, G('true', 'walked', 3.0), G('true', 'walked', 4.1), 0.42, cents=-DRIFT * 9, att=0.12, rel=0.5, pan=px(1560))
tN = T_('walked', 'by night', -0.4)
air(tN, 2.2, 0.007, 0.0, 150, 800)
terp(B3, tN + 0.7, tN + 2.6, 0.5, att=0.4, rel=1.0, pan=px(386))
tRe = T_('stars', 'really', 0.0)
arc(Gs4, tRe, tRe + 2.4, 0.42, cents=0.0, glide=(-DRIFT * 9, 1.5), att=0.3, rel=0.8, pan=px(1578))
troll((E3, B3), tRe + 1.7, 0.14, 2.4, 0.5, px(1460))
paper(G('true', 'printer', 0.0), 0.010, px(680), 0.5)
knock(T_('printer', 'printer', 0.6), 0.012, px(680), 200)
for w_ in ('eighty-eight', 'two awards'):
    tap(T_('put', w_, -0.2), 0.009, px(1380))
tap(G('true', 'along', 0.0), 0.009, px(1380))
troll((E3, Gs3, B3), G('true', 'now', 0.25), 0.13, 2.2, 0.55, px(1380))
knock(G('true', 'check', 0.0), 0.012, px(1500), 240)
arc(E3, G('true', 'check', 0.1), G('true', 'check', 1.3), 0.42, rel=0.6, pan=px(1500))
knock(G('true', 'reference', 0.0), 0.012, px(1500), 240)
terp(E3, G('true', 'reference', 0.1), G('true', 'reference', 1.6), 0.5, att=0.3, rel=0.8, pan=px(1500))
tEnd = G('true', 'breath', 0.2)
terp(E3, tEnd, tEnd + 0.8, 0.6, rel=0.4)
terp(E3, tEnd + 1.25, E('true'), 0.65, att=0.25, rel=1.6); arc(E4, tEnd + 1.3, E('true'), 0.45, att=0.3, rel=1.6)
