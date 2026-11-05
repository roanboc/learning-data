# A place on the map: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, reserved for this film by the series thread on 5 November 2026 after checking every score.py on main and on every
# branch (/mnt/project-files/agentic-data-engineering/series-3/palettes.md), both made here (music.py has neither):
#  - The lead, a Novachord, the electronic keyboard of 1939 that could play whole chords: a new kind of player, given its own written
#    part and a chair beside the others. Its vibrato is switched off and its tone kept soft and plain: each note a divided-down
#    tone, its odd harmonics stronger than its even ones, through the instrument's soft resonators (near 380 Hz and 1 kHz), its upper
#    harmonics opening a moment after the key goes down, and a gentle release. It plays only for the agents: the planning agent, and
#    the workload agent once.
#  - The partner, tromba marinas, the tall bowed one-string instruments of the 1400s to the 1700s, played only in their string's
#    natural harmonics; the bridge's loose foot rattles on the soundboard as the string swings, a soft, nasal, trumpet-like buzz that
#    starts once the bow is well in. Bowed softly, mid-register, with no vibrato. They are the people: in 1970 each agency on its own
#    string (F sharp, A and C sharp), so their notes never make one structure; from 1972 every voice on one string, A, each a harmonic
#    of it, so their chord is one structure. tromba() refuses a note that isn't a harmonic of its string.
#  - The mark: the people hold the string's second, fourth and sixth harmonics (A, A, E), with the fifth (C sharp), between the
#    fourth and the sixth, left open; the Novachord comes in on its cue on that C sharp and takes its place inside the chord. Heard as
#    the planning agent takes its place in the opening, as Noor assigns it to its role, as the check holds every agent to its place,
#    and on the end card.
#  - Keys, all tuned pure (just intonation from A, see hz()): F sharp minor for 1970's problem, and for the agent with no place yet;
#    A major from FIRESCOPE on. No B or D sounds with F sharp or C sharp, so no interval is a little out of tune and nothing beats.
# The rules the module keeps (the author's, 20 October and 4 November 2026; tools/quiet.py checks them):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. Silence where the dead are told.
#  - Nothing trembles, rolls or pulses (no chapter is urgent): no vibrato, no tremolo, no ostinato, no slide.
#  - Every sound is an event on screen, at the moment it appears, timed by the same word and offset as the picture in src/scenes.js,
#    so sound and picture stay together when the voice is re-timed: a card laid down, a pen as a card is written or a line signed,
#    wind on the hills, a radio's hiss as it lights, a soft lock where a rule closes. A burst on screen (40 tickets done, 37 ticks,
#    the board's cards) is one soft sound, never one for each.
#  - Each held note keeps its own level in the room (_band, _held; held.py checks it).
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
    """when a line's voice stops (the film's sc.ends)"""
    return G(sid, lid) + _DUR[sid + '/' + lid]
def px(x):
    """where something drawn at x (in the 1920 px frame) sits in the stereo field"""
    return max(-0.85, min(0.85, (x - 960) / 960 * 0.9))
R1 = np.random.default_rng(1972)  # this film's own randomness: the room, the bow, the paper

# ---- tuning: just intonation from A, so the string's harmonics and the Novachord's notes are the same pitches, and a chord's notes
# are whole-number ratios of each other
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (45, 110.0)  # A 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
Fs1, A1, Cs2 = 30, 33, 37                                     # the strings: 1970's three, and from 1972 the one, A
Fs2, A2, Cs3, E3, Fs3, A3, Cs4, E4, Fs4, A4 = 42, 45, 49, 52, 54, 57, 61, 64, 66, 69

# ---- the levels: the music's loud moments at about -28 dB of full scale as one speaker plays the score (tools/quiet.py), as low as
# the governance films'; the effects about 14 dB under the music (FX scales them all)
TL, NL, FX = 0.040, 0.040, 1.3

# a room round the players: a quiet hall, ringing on for about a second, nothing much above 1.7 kHz. Its level is set by what it rings
# where the notes are (its gain from 100 Hz to 1.5 kHz is one), so a held note keeps its level, as the video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.2)).astype(np.float32))(np.arange(int(1.2 * SR)) / SR)
_IR = filt(_IR, 'low', 1700); _IR[:int(0.02 * SR)] = 0
def _band(h):
    """a room's gain where the notes are: the square root of its mean power from 100 Hz to 1.5 kHz"""
    nf = 1 << 17; p = np.abs(np.fft.rfft(np.asarray(h, np.float64), nf)) ** 2; f = np.fft.rfftfreq(nf, 1 / SR)
    return float(np.sqrt(p[(f > 100) & (f < 1500)].mean()))
_IR /= _band(_IR)
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a held note in the room, at its own level: even at a gain of one, the room moves a pure note's level up or down by where its
    reflections meet it, so the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- the tromba marina: one long string, bowed above the bridge and touched lightly so that only one of its natural harmonics
# sounds; its swing is a bowed string's (every harmonic, falling away as 1/k), warmed by the long box near 560 Hz and 1.2 kHz. The
# bridge's loose foot lifts and strikes the board on each swing once the bow is well in: its rattle is the string's swing clipped,
# band-limited and soft, so the note turns a little nasal as it grows. A faint touch of hair as the bow starts. No vibrato
def tromba(m, a, b, g=1.0, pan=0.0, string=A1, att=0.22, rel=0.45, room=0.3, buzz=0.4):
    f, o = hz(m), hz(string); k = f / o
    assert abs(k - round(k)) < 1e-6 and round(k) >= 2, 'a tromba marina plays only its string\'s harmonics: %d on %d' % (m, string)
    sec = max(0.4, b - a); n = int((sec + rel + 0.15) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for j in range(1, int(2300 // f) + 1):
        fj = f * j
        w = (1 + 0.9 * np.exp(-((fj - 560) / 240) ** 2) + 0.45 * np.exp(-((fj - 1180) / 280) ** 2)) * np.exp(-max(0.0, fj - 1300) / 450) / j
        s = s + w * np.sin(2 * np.pi * fj * x + 0.41 * j)
    s = s / max(1e-9, float(np.abs(s[:int(0.5 * SR)]).max()))
    e = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2 * np.where(x > sec, np.exp(-(x - sec) * 6.9 / rel), 1.0)
    z = filt(np.clip(s - 0.55, 0.0, None).astype(np.float32), 'band', (350, 2100)).astype(np.float64)
    z = z / max(1e-9, float(np.abs(z).max()))
    sig = s * e + buzz * z * e * np.clip((e - 0.4) / 0.4, 0, 1)
    sig = sig + filt(noise(n / SR + 0.01)[:n], 'band', (300, 1500)) * 0.012 * np.exp(-x / 0.1) * np.minimum(1, x / 0.01)
    sig = filt((sig / max(1e-9, float(np.abs(sig).max()))).astype(np.float32), 'low', 2300)
    put(_held(sig, room), a, g * TL, pan)
def trombas(notes, a, b, g=0.8, pans=None, step=0.0, string=A1, **k):
    """several trombas, each on its own note (all of the same string unless string is a list), coming in step seconds apart"""
    for i, m in enumerate(notes):
        tromba(m, a + i * step, b, g, pans[i] if pans else 0.0, string[i] if isinstance(string, (list, tuple)) else string, **k)

# ---- the Novachord: a divided-down tone, its odd harmonics stronger than its even ones, through soft resonators near 380 Hz and
# 1 kHz and rolled off above them; the upper harmonics open a moment after the key goes down (its "normal" attack), and the note
# fades gently when the key comes up (a little sustain). Vibrato off. stop=True: the key lifted and damped at once
def nova(m, a, b, g=1.0, pan=0.0, att=0.08, rel=0.8, room=0.3, stop=False):
    f = hz(m); sec = max(0.3, b - a); rel = 0.12 if stop else rel; n = int((sec + rel + 0.15) * SR); x = np.arange(n) / SR; s = np.zeros(n)
    for j in range(1, int(2200 // f) + 1):
        fj = f * j
        w = (1.0 if j % 2 else 0.3) / j * (1 + 0.6 * np.exp(-((fj - 380) / 200) ** 2) + 0.35 * np.exp(-((fj - 1050) / 260) ** 2)) * np.exp(-max(0.0, fj - 1200) / 380)
        s = s + w * np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.25 * (j - 1))), 1)) ** 2 * np.sin(2 * np.pi * fj * x + 0.29 * j)
    s = s * np.where(x > sec, np.exp(-(x - sec) * 6.9 / rel), 1.0)
    put(_held(filt((s / max(1e-9, float(np.abs(s).max()))).astype(np.float32), 'low', 2200), room), a, g * NL, pan)
def chord(notes, a, b, g=0.7, pan=0.0, step=0.0, spread=0.2, **k):
    """the Novachord's chord: its notes together (or step seconds apart), a little spread across the field"""
    c = len(notes)
    for i, m in enumerate(notes):
        nova(m, a + i * step, b, g / np.sqrt(max(1, c) / 2), pan + spread * (i / max(1, c - 1) - 0.5) if c > 1 else pan, **k)

def mark(a, cue, b, g=0.75, pan=0.0, order=(0, 1, 2), step=0.0):
    """the mark: the people hold the string's 2nd, 4th and 6th harmonics (A 2, A 3, E 4), the 5th (C sharp 4) left open between the
    4th and the 6th; on its cue the Novachord comes in on that C sharp and takes its place inside the chord"""
    H = (A2, A3, E4)
    for i, j in enumerate(order):
        tromba(H[j], a + i * step, b, g * (0.85 if j == 0 else 0.75), pan + 0.25 * (j - 1))
    nova(Cs4, cue, b, g * 0.95, pan)

# ---- the effects, soft and low, each where something happens on screen
def paper(s, g=0.012, pan=0.0, sec=0.42):
    """a card laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def shuffle(s, sec=1.2, g=0.008, pan=0.0):
    """many cards, or many tickets done, as one soft texture that swells in and out (never one sound for each)"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1800))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def pencil(s, sec=0.7, g=0.006, pan=0.0):
    """a pen writing: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.minimum(1, np.minimum(x, sec - x) / 0.08), s, g * FX, pan)
def slide(s, g=0.009, pan=0.0, sec=0.5):
    """a stack of cards slid along the wall"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1400))[:len(x)] * np.sin(np.pi * np.minimum(1, x / sec)) ** 2, s, g * FX, pan)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a badge set on, a mark set down"""
    s_tap(s, g * FX, pan)
def lock(s, g=0.010, pan=0.0):
    """a small lock closing: a rule that holds"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def air(s, sec=2.0, g=0.008, pan=0.0, lo=120, hi=700):
    """wind over the hills, or an engine far off on the road: a breath of low air"""
    s_air(s, sec, g * FX, pan, lo, hi)
def radio(s, sec=0.9, g=0.006, pan=0.0):
    """a radio lit: its soft hiss, band-limited and swelling once, never a crackle"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 1.5, s, g * FX, pan)

# =============================================================================================================================
# 1. Thirteen days in 1970: F sharp minor, each agency on its own string. The wind on the hills; F sharp alone, then A with "thirteen
#    days". Silence where the dead and the lost homes are told. Help comes: C sharp, A and F sharp, each from its own string, as the
#    engines come up the road. Each leader's card, its own note on its own string (C sharp, A, F sharp). Too many voices: only the
#    radios' hiss. No one picture: the sheets laid down, a low F sharp. Engines sent where?: C sharp, unresolved. Every agency
#    cooperated: the three strings together, F sharp minor, never one structure; "missing" in silence. "Something had to change": E,
#    the one string's third harmonic, leaning towards A
fw = lambda lid, word, off=0: W('first', lid, word, off)
fc = lambda lid, off=0: G('first', lid, off)
f0 = S0('first')
air(f0 + 0.3, 6.0, 0.008, px(1100))
tromba(Fs2, f0 + 0.8, fw('lost', 'Sixteen', -0.9), 0.62, -0.25, Fs1, att=1.2, rel=0.9)
tromba(A2, fw('place', 'For thirteen'), fw('lost', 'Sixteen', -0.9), 0.55, 0.2, A1, att=0.6, rel=0.9)
P_came = fw('came', 'Some')
air(P_came - 0.6, 3.0, 0.007, px(500)); air(P_came + 3.8, 3.0, 0.006, px(900))
tromba(Cs3, P_came + 0.4, P_came + 6.8, 0.55, -0.35, Cs2, att=0.7)
tromba(A2, P_came + 2.4, P_came + 7.2, 0.5, 0.3, A1, att=0.7)
tromba(Fs2, P_came + 4.4, P_came + 7.8, 0.55, 0.0, Fs1, att=0.7)
P_own = fw('own', 'Each agency')
for i, (m, st) in enumerate(((Cs4, Cs2), (A3, A1), (Fs3, Fs1))):
    tromba(m, P_own - 0.3 + i * 0.35, P_own + 2.6, 0.52, px(380 + 580 * i), st)
P_reach = fw('reach', 'struggled')
for i in range(3):
    radio(P_reach - 0.3 + i * 0.4, 0.9, 0.006, px(380 + 580 * i))
P_pic = fw('picture', 'nobody')
paper(P_pic - 0.4, 0.011, px(350)); paper(P_pic + 0.2, 0.011, px(910))
tromba(Fs2, P_pic - 0.2, P_pic + 3.4, 0.55, 0.0, Fs1, att=0.6)
P_where = fw('send', 'where')
tromba(Cs3, P_where + 0.6, P_where + 3.2, 0.52, px(930), Cs2, att=0.4)
P_best = fw('best', 'Every agency')
trombas((Fs2, A2, Cs3), P_best + 0.2, fw('best', 'missing', -0.4), 0.5, [-0.4, 0.0, 0.4], 0.0, [Fs1, A1, Cs2], att=0.5)
tromba(E3, fc('change', 0.2), S0('scope') + 3.0, 0.5, 0.0, A1, att=0.8, rel=1.0)

# 2. One way of working: A major, every voice on one string. FIRESCOPE: the seven agencies' marks set down (one soft tap), and as
#    its card comes, A, E and A, harmonics of one string, the third left open. Everyone checks in: the card written (a pen), laid on
#    the board, the board's cards as one soft texture; as the card takes its place, the string's chord with its C sharp: one
#    structure. "One person it answers to": A, held. The same plain words: A in three octaves, one word. 1981: the chord widens; 2004:
#    the card laid down, a high A joins. One team: Crew 14 lands, the full chord. The university: silence as the lab comes in; the
#    planning agent appears, and the Novachord sounds for the first time, alone, on C sharp. "Nobody could say": the Novachord's F
#    sharp minor, the agent with no place. Like a crew, it checks in: its card, the people's A, A and E, and the Novachord comes in
#    on the C sharp left open as it takes its place (the mark). The title: the people's open chord and the Novachord's A major
sw = lambda lid, word, off=0: W('scope', lid, word, off)
sc_ = lambda lid, off=0: G('scope', lid, off)
tap(sw('began', 'seven of', 0.3), 0.009, px(1380))
P_fs = sw('began', 'Firescope')
paper(P_fs - 0.3, 0.012, px(1380))
trombas((A2, E3, A3), P_fs + 0.1, P_fs + 4.4, 0.55, [-0.25, 0.0, 0.25], 0.5)
P_card = sw('card', 'Each crew')
pencil(P_card - 0.1, 0.8, 0.006, px(520))
P_land = P_card + 0.7 + 1.6
paper(P_land, 0.012, px(1300)); shuffle(sw('card', 'one board', 0.3), 1.0, 0.007, px(1300))
trombas((A2, E3, A3, Cs4), P_land + 0.05, P_land + 3.4, 0.5, [-0.3, -0.1, 0.1, 0.3], 0.18)
tromba(A3, sw('role', 'one person', 0.4), sw('role', 'one person', 3.0), 0.5, px(1300))
P_plain = sw('plain', 'the same')
for i, m in enumerate((A2, A3, A4)):
    tromba(m, P_plain - 0.1 + i * 0.25, P_plain + 3.0, 0.48, px(380 + 580 * i))
P_wide = sw('wide', 'By')
paper(P_wide - 0.2, 0.011, px(1500))
trombas((A2, E3), P_wide + 0.6, P_wide + 7.4, 0.48, [-0.3, 0.3], 0.3)
trombas((A3, Cs4, E4), P_wide + 3.0, P_wide + 7.6, 0.46, [-0.2, 0.0, 0.2], 1.2)
P_nat = sw('national', 'In')
paper(P_nat, 0.012, px(1500))
tromba(A4, P_nat + 0.4, P_nat + 4.0, 0.46, px(1500))
P_c14 = sw('team', 'check in', 0.2 + 1.6)
paper(P_c14, 0.012, px(1500))
trombas((A2, E3, A3, Cs4, E4), P_c14 + 0.05, P_c14 + 3.6, 0.46, [-0.35, -0.15, 0.0, 0.15, 0.35], 0.12)
nova(Cs4, sw('uni', 'the planning agent', -0.3), sw('uni', 'the planning agent', 3.0), 0.7, px(1500), att=0.12)
chord((Fs3, A3, Cs4), sw('alone', 'what it may do', -0.1), sw('alone', 'who can stop', 0.6), 0.62, px(900), 0.0, 0.25)
P_crew = sw('checks', 'like a crew')
paper(P_crew, 0.012, px(1500))
mark(P_crew + 0.3, sw('checks', 'takes its place', -0.1), sw('checks', 'anyone can see', 0.4), 0.75, px(1300), (0, 1, 2), 0.35)
P_title = sc_('breath')
trombas((A2, E3), P_title + 0.2, P_title + 4.2, 0.5, [-0.2, 0.2])
chord((A3, Cs4, E4), P_title + 0.9, P_title + 4.2, 0.62, 0.0, 0.0, 0.3)

# 3. Two newcomers: a person's A (a tromba) as Lucía comes in, and the Novachord's C sharp as the planning agent is named. Planning's
#    tickets laid down, then slid along to the agent. The welcome, card by card; the badge set on the agent, and its own note, E.
#    "Never its own rights": the lock. Clara signs on its behalf (a pen), and answers for it: a person's A and E. The planning
#    agent works alone: the Novachord's C sharp, alone, needing a place
mw = lambda lid, word, off=0: W('monday', lid, word, off)
mc = lambda lid, off=0: G('monday', lid, off)
tromba(A3, S0('monday') + 0.6, S0('monday') + 3.2, 0.55, px(200))
nova(Cs4, mw('two', 'the planning agent', -0.1), mw('two', 'the planning agent', 2.4), 0.6, px(1500))
paper(mw('tickets', 'All year', -0.2), 0.011, px(730)); slide(mw('tickets', 'Now', 0.2), 0.009, px(1000), 1.2)
paper(mw('same', 'Both', -0.2), 0.011, px(980))
for lid, word in (('badge', 'Lucía'), ('role', 'Lucía'), ('owner', 'Lucía'), ('rights', 'rights come'), ('signed', 'Lucía')):
    paper(mw(lid, word, -0.1), 0.009, px(980))
P_badge = mw('badge', 'The agent')
tap(P_badge + 0.5, 0.010, px(1750))
nova(E4, P_badge + 0.45, P_badge + 2.2, 0.55, px(1750))
lock(mw('rights', 'never its own', -0.1), 0.010, px(980))
pencil(mw('signed', 'Clara signs', 0.0), 0.8, 0.006, px(1250))
P_touch = mw('signed', 'the data')
trombas((A3, E4), P_touch - 0.1, P_touch + 2.6, 0.5, [px(900), px(1060)], 0.3)
paper(mw('differ', 'helper works', -0.2), 0.010, px(460)); paper(mw('alone', 'works alone', -0.2), 0.010, px(1480))
nova(Cs4, mw('alone', 'a place of its own', -0.2), mw('alone', 'a place of its own', 2.4), 0.6, px(1480))

# 4. A place on the map: the map, the people's low A and E as it's named. The work: the tickets laid down under the capability. The
#    process: as its bracket closes over the seven steps, the string's open chord. The people keep the rest: a tromba for each person
#    as they come (E, A, E: the 3rd, 4th and 6th harmonics). Separation of duties: the lock. Noor assigns the planning agent to its
#    role: the people hold A, A and E, and the Novachord comes in on the C sharp left open (the mark); Clara's owner line, a pen. The
#    rights laid down; "a person decides": a person's rising fourth, E to A. The workload agent placed: the Novachord's E; its stages
#    laid down. Three agents, each with a role and an owner: the people's A and A, the Novachord's C sharp and E. The third never
#    approves: the lock
pw = lambda lid, word, off=0: W('map', lid, word, off)
pc = lambda lid, off=0: G('map', lid, off)
trombas((A2, E3), pw('noor', "university's map", -0.2), pw('noor', "university's map", 2.8), 0.5, [px(1300), px(1600)], 0.4)
tap(pw('work', 'the capability', -0.2), 0.008, px(300)); paper(pw('work', "Planning's tickets", -0.2), 0.011, px(270))
P_br = pw('process', 'to production', -0.2)
trombas((A2, E3, A3), P_br + 0.4, P_br + 3.6, 0.48, [-0.4, 0.0, 0.4])
for i, (w_, m) in enumerate((('Jun reviews', E3), ('Clara approves', A3), ('Noor releases', E4))):
    tromba(m, pw('people', w_, -0.15), pw('people', w_, 2.6), 0.5, px(1474 + 258 * (i - 1)))
lock(pw('sod', 'never approves', -0.2), 0.010, px(1087))
mark(pw('agent', 'Then Noor'), pw('agent', 'assigned the planning agent', -0.1), pw('agent', 'Clara as its owner', 0.6), 0.75, px(700), (1, 2, 0), 0.0)
pencil(pw('agent', 'Clara as its owner', 0.1), 1.0, 0.006, px(1090))
paper(pw('may', 'Its role', -0.4), 0.012, px(1485))
P_dec = pw('guess', 'a person decides', -0.3)
tromba(E3, P_dec, P_dec + 0.45, 0.5, px(1485), att=0.1, rel=0.25); tromba(A3, P_dec + 0.5, P_dec + 2.8, 0.55, px(1485))
P_wl = pw('workload', 'workload agent', -0.2)
nova(E4, P_wl, P_wl + 2.4, 0.55, px(670))
paper(pw('stages', 'Its stage', -0.2), 0.011, px(1200))
P_three = pw('three', 'three agents')
trombas((A2, A3), P_three, P_three + 3.2, 0.48, [-0.3, 0.3])
chord((Cs4, E4), P_three + 0.5, P_three + 3.2, 0.6, px(670), 0.0, 0.2)
lock(pw('third', 'never approves', -0.3), 0.010, px(1680))

# 5. The gate: its card laid down, and the Novachord's C sharp, alone, before its test. The sandbox's 40 tickets done again: one soft
#    texture; the bar laid down. Thirty-seven matched: one soft texture as the ticks come, and the Novachord's A major. The audit
#    log's four lines, a tap each. Clara agrees stage four: a person's rising fourth, E to A; Noor writes it on the assignment (a
#    pen). The check: the people hold E, A and A, and as the last column passes, the Novachord's C sharp takes its place (the mark);
#    the ticks as three soft taps, one for each thing it checks
gw = lambda lid, word, off=0: W('gate', lid, word, off)
gc = lambda lid, off=0: G('gate', lid, off)
P_gate = gw('before', 'its gate', -0.4)
paper(P_gate, 0.012, px(420)); nova(Cs4, P_gate + 0.3, P_gate + 2.6, 0.58, px(420))
P_redid = gw('redo', 'it redid')
shuffle(P_redid - 0.2, (gw('bar', 'Clara and Jun') - P_redid) * 0.9, 0.006, px(1330))
paper(gw('bar', 'Clara and Jun', -0.2), 0.011, px(1140))
P_37 = gw('result', 'Thirty-seven')
shuffle(P_37 + 0.2, 1.0, 0.006, px(1330))
chord((A3, Cs4, E4), P_37 + 0.2, P_37 + 2.8, 0.58, px(1330), 0.0, 0.25)
P_audit = gw('audit', 'under its own name', -0.6)
for i in range(4):
    tap(P_audit + i * 0.35, 0.008, px(1260))
P_four = gw('stage', 'stage four')
tromba(E3, P_four - 0.3, P_four + 0.15, 0.5, px(1200), att=0.1, rel=0.25); tromba(A3, P_four + 0.2, P_four + 2.6, 0.55, px(1200))
pencil(gw('word', 'Noor wrote', 0.1), 0.9, 0.006, px(1200))
P_chk = gw('check', 'a check fails', -0.2)
for i, w_ in enumerate(('an owner', 'a role', 'a stage for each')):
    tap(gw('check', w_, -0.1), 0.009, px((190, 1680, 1200)[i]))
mark(P_chk, gw('check', 'a stage for each', 0.1), END('gate', 'check') + 1.6, 0.72, 0.0, (2, 1, 0), 0.4)

# 6. Who owns it, and who can stop it: each card laid down. Only a person may own it: a person's A. Clara may stop it: the
#    Novachord's C sharp, stopped short, the key lifted and damped
ow = lambda lid, word, off=0: W('stop', lid, word, off)
for lid, word, x in (('own', 'Only a person', 545), ('set', "Only Sam's", 1375), ('stop', 'Clara may', 545), ('anyone', 'anyone who sees', 1375)):
    paper(ow(lid, word, -0.2), 0.011, px(x))
tromba(A3, ow('own', 'Only a person', 0.1), ow('own', 'Only a person', 2.6), 0.55, px(545))
nova(Cs4, ow('stop', 'Clara may', 0.0), ow('stop', 'stop it', 0.25), 0.55, px(545), stop=True)

# 7. One structure to join: 1970's board, and the string's whole chord, C sharp in it, as "one structure to join" comes; Engine 52
#    lands on the board. The planning agent's card laid down, then its second half. The end card: the people hold E, A and A, and the
#    Novachord comes in on the C sharp left open, then its own E and A above (the mark, the last time)
cw = lambda lid, word, off=0: W('close', lid, word, off)
cc = lambda lid, off=0: G('close', lid, off)
P_join = cw('back', 'one structure', -0.2)
trombas((A2, E3, A3, Cs4), P_join, P_join + 3.4, 0.46, [-0.3, -0.1, 0.1, 0.3], 0.2)
paper(cw('since', 'take their place', 1.0), 0.012, px(1180))
paper(cw('now', 'The planning agent', -0.3), 0.012, px(1485))
paper(cw('so', 'So everyone', -0.3), 0.010, px(1485))
P_end = cc('breath')
mark(P_end + 0.2, P_end + 1.1, P_end + 4.2, 0.72, 0.0, (0, 2, 1), 0.3)
chord((E4, A4), P_end + 1.8, P_end + 4.2, 0.5, 0.0, 0.25, 0.2)
