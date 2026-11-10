# Forgetting a person: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette, checked on 5 November 2026 against every score.py on main and on every branch, and against the module's palettes list
# (/mnt/project-files/data-protection/palettes.md, where this film's row is): humming tops and a cello, both made here (music.py has
# neither, and no other film of the module plays a cello).
#  - Humming tops: tin pump tops of the 1800s, each tuned to its own note, that hum only while they spin. Pressed, a top spins up
#    into its note; kept at speed, its note holds, even; left alone, it slows, its note sinks a little (about a semitone, as it nearly
#    stops) and fades, and the soft roll of its point on the table fades with it, until it falls still. Hollow and soft, under 2.5 kHz,
#    nothing trembling. The notice of 1998 is a top (F): printed, it hums; through the years it slows and falls still (the matter
#    settled); every search for his name spins it again. At the ruling, the mark: the top pressed as the page stays, then let go as the
#    link from his name goes, to slow and fall still under one held cello note. Linh's place on the mailing list is a top of its own
#    (C): the semester's rebuild spins it while her yes is on the person; once her no is, the next rebuild's plunger is only a dry
#    knock, and her top doesn't hum. What stays, stays at speed: a top kept at its note for one breath.
#  - A cello, bowed softly and close, plain, no vibrato, low and middle, its top rolled off: the person who asks (Costeja, then Linh),
#    and the answer, a phrase that falls to rest. Held under the opening, a breath at a time, and after it only at a few chapter turns,
#    under a moment on screen and at the end.
#  - D minor for the problem, F major for the answer (B flat major as the ruling turns, C as the map waits for a request). No G minor
#    and no G with D or B flat: in this tuning those aren't pure.
# The rules the module keeps (its briefs, 5 November 2026, as every film of the site does since 4 November):
#  - Music only from time to time: under the opening story, and after it only at a chapter's turn, under a moment on screen or in a
#    pause without words; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato; every chord tuned pure (just intonation from F, see hz()).
#    A top's note sinks as it slows, so a top is never left to slow over a held note that has a harmonic in the range it sinks
#    through (an F or an A under the F top): the two would beat. No urgent pulse: nothing in this story is a rush.
#  - Every sound is an event on screen, at the moment it appears. Each one below uses the same timing as the picture in src/story.js
#    and src/scenes.js (the same word and offset), so sound and picture stay together when the voice is re-timed. A burst on screen
#    (nine panes lighting, ten places found) is one soft sound, never one for each.
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
R1 = np.random.default_rng(2020)  # this film's own randomness: the room, the bow, the tops' air

# ---- tuning: just intonation from F, so a chord's notes are whole-number ratios of each other and nothing beats. F major (F A C),
# B flat major (B flat D F), C major (C E G), D minor (D F A) and A minor (A C E) are all pure in this table; G with D or with B flat
# is not (40/27 and 32/27), so no G minor, and G sounds only alone or with C and E
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (53, 174.614)  # F 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
C2, D2, F2, G2, A2, Bb2 = 36, 38, 41, 43, 45, 46
C3, D3, E3, F3, G3, A3, Bb3 = 48, 50, 52, 53, 55, 57, 58
C4, F4 = 60, 65
NOTICE, HERS = F4, C4  # the tops: the notice of 1998, and Linh's place on the tutors' mailing list

# ---- the levels, set so the music's loud moments sit about -28 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films', whose sound the author accepted; the effects about 16 dB under the music (FX scales them all)
TL, CL, FX = 0.062, 0.056, 1.5

# a room round the players: a small, quiet room, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what
# it rings where the notes are (its gain under 1.5 kHz is one), and each held note is set back to its own level after it (_held), as
# the video guidelines ask
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
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))
def _rms1(x):
    x = np.asarray(x, np.float64); return x / max(1e-12, float(np.sqrt((x ** 2).mean())))

# ---- a humming top: a tin pump top, tuned to m, sounding for sec seconds from s.
#  pressed (spin): its plunger drives it up into its note over about a third of a second, with the plunger's breath under it.
#  free: from then on nobody presses it again: it slows (its speed halves in about 1.8 s), its note sinks (at most 6%, as it nearly
#        stops) and fades with its speed, and the low roll of its point on the table fades with it. Without free, it's kept at speed:
#        its note holds, even.
#  fade: from then on it's still spinning, at its note, and fades out of hearing over fd seconds (the film moves on).
# A top's hum is nearly a pure tone (its body is a closed tin drum, its voice a reed in a slot): a little of the octave and the twelfth,
# a breath of air at its note, and the point's soft roll, all under 2.3 kHz
def top(m, s, sec, free=None, fade=None, fd=0.6, g=1.0, pan=0.0, room=0.22):
    f = hz(m); n = int(sec * SR); x = np.arange(n, dtype=np.float64) / SR
    up = 1 - np.exp(-x / 0.11)
    sp = up if free is None else np.where(x > free, up * np.exp(-(x - free) / 2.6), up)
    pitch = f * (0.9 + 0.1 * up) * (1 - 0.06 * (1 - (np.where(x > free, sp, 1.0) if free is not None else 1.0)))
    ph = 2 * np.pi * np.cumsum(pitch) / SR
    amp = np.clip(sp, 0, 1) ** 1.6
    if fade is not None:
        amp = amp * np.cos(0.5 * np.pi * np.clip((x - fade) / fd, 0, 1)) ** 2
    tone = np.sin(ph) + 0.16 * np.sin(2 * ph + 0.5) + 0.07 * np.sin(3 * ph + 1.1) + 0.025 * np.sin(4 * ph + 2.0)
    air = _rms1(filt(R1.standard_normal(n).astype(np.float32), 'band', (f * 0.94, f * 1.07), 2))
    roll = _rms1(filt(R1.standard_normal(n).astype(np.float32), 'band', (70, 240), 2))
    sig = tone * amp + 0.05 * air * amp + 0.03 * roll * np.clip(sp, 0, 1) * (amp if fade is not None else 1.0)
    whoosh = _rms1(filt(R1.standard_normal(n).astype(np.float32), 'band', (220, 1400), 2))
    sig = sig + 0.08 * whoosh * np.exp(-((x - 0.18) / 0.13) ** 2)
    sig = sig * np.minimum(1, x / 0.01) * np.minimum(1, (sec - x) / 0.05)
    put(_held(filt(norm(sig.astype(np.float32)), 'low', 2300), room), s, g * TL, pan)

# ---- the cello, bowed softly and close: every harmonic of a bowed string, each wavering a little on its own, as a bow never holds
# quite still, sent out by the body's resonances (most from 200 to 450 Hz, some round 1 kHz), a little of the bow's hair on the string,
# and the bow's pressure breathing slowly. Played straight, with no vibrato, so its harmonics meet the others' exactly. sec is the whole
# note, its attack and release inside it
BODY = ((205, 1.0, 70), (290, 0.7, 60), (420, 0.9, 140), (620, 0.6, 170), (1000, 0.4, 300))
def _body(fr):
    return (fr / (fr + 140)) * (0.2 + sum(w * np.exp(-((fr - c) / bw) ** 2 / 2) for c, w, bw in BODY))
def _waver(sec, rate, depth):
    n = int(sec * rate) + 4; pts = np.convolve(R1.standard_normal(n + 2), (0.25, 0.5, 0.25), 'valid')
    return (1 + depth * np.interp(np.arange(int(sec * SR)) * rate / SR, np.arange(n), pts)).astype(np.float32)
def cello(m, s, sec, g=1.0, pan=-0.12, att=0.4, rel=0.9, room=0.26):
    f = hz(m); x = tt(sec); n = len(x); ph = 2 * np.pi * f * x.astype(np.float64)
    sig = np.zeros(n, np.float32)
    for k in range(1, 40):
        if f * k > 2100:
            break
        sig = sig + (_body(f * k) / k ** 0.85) * _waver(sec, 3.0 + 0.7 * (k % 3), 0.03)[:n] * np.sin(k * ph + 0.9 * k).astype(np.float32)
    sig = norm(sig) + 0.008 * filt(noise(sec), 'band', (min(1.5 * f, 900), 2000))[:n]
    sig = sig * (1 + 0.04 * np.sin(2 * np.pi * 0.21 * x + 0.6))
    put(_held(filt(norm((sig * env(sec, att, rel)).astype(np.float32)), 'low', 1900), room), s, g * CL, pan)
def double(lo, hi, s, sec, g=1.0, pan=-0.12, att=0.5, rel=1.2):
    """two strings bowed together, a double stop: a pure fifth, fourth or third"""
    cello(lo, s, sec, g * 0.78, pan - 0.05, att, rel); cello(hi, s + 0.02, sec - 0.02, g * 0.66, pan + 0.05, att, rel)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.016, pan=0.0, f=240):
    """a soft wooden knock: a card or a pane set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a pill or a slip, a tick, a key"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.008, pan=0.0):
    """a few keys, typed: unevenly spaced"""
    for i in range(n):
        tap(s + i * 0.17 + 0.05 * R1.uniform(), g if i < 2 else g * 0.7, pan)
def paper(s, g=0.011, pan=0.0, sec=0.4):
    """a sheet laid down"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 1900))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def brush(s, g=0.009, pan=0.0, sec=0.3):
    """something wiped away: a soft, short brush"""
    x = tt(sec); X(filt(noise(sec), 'band', (300, 1500))[:len(x)] * np.sin(np.pi * np.minimum(1, x / sec)) ** 2 * np.exp(-x / sec), s, g * FX, pan)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: something drawn or lit across the frame, as one soft texture"""
    s_air(s, sec, g * FX, pan, lo, hi)
def stamp(s, g=0.015, pan=0.0):
    """a stamp pressed down: a low knock and the slap of its pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def plunger(s, g=0.015, pan=0.0):
    """a top's plunger pressed down with nothing to spin: a dry, low knock and the short breath of its spring"""
    s_knock(s, g * FX, pan, 150); x = tt(0.22); X(filt(noise(0.22), 'band', (150, 700))[:len(x)] * np.exp(-x / 0.05), s - 0.04, g * 0.45 * FX, pan)

# =============================================================================================================================
# 1. The opening, Barcelona to the university, with music all through it.
#    Barcelona, 1998: the cello's low open fifth, D and A, a breath. The notice printed: the top pressed, humming while the lawyer's
#    debt is read, the cello's D minor under it; the years: left alone, it slows and falls still. Online, 2009: the search spins it
#    again; a client and a neighbour, again, softer; he asks, the cello's D; "It says no": the top let go, and silence under
#    "Something has to change". Madrid: the cello alone, rising A to D as he complains; F for the page that stays, D for the links
#    that go. The court: E to A, a question asked up. The ruling: B flat major; sixteen years on, the cello's A. The mark: the top
#    pressed as the page stays, let go as the link from his name goes, slowing to still under the cello's C. Since 2014: F major, the
#    cello rising once, F, A, C, F, under the counter; the twelve thousand, one soft murmur of forms sent. Linh: her card set down,
#    her letter typed, the cello's A minor under "tell me"; her data's panes, one soft breath; "find it all", another; the answer,
#    the cello falling A to F. The title card: the cello's F and C, at rest
F_ = lambda lid, word, off=0: W('story', lid, word, off)
s0 = S0('story')
double(D2, A2, s0 + 0.5, 4.6, 0.85, att=1.1, rel=1.5)
# the notice printed: the top pressed; kept at speed through the lawyer's line, then left alone through the years
tN = F_('order', 'short notice', -0.2); tFree = END('story', 'lawyer')
top(NOTICE, tN, tFree - tN + 6.5, free=tFree - tN, g=0.85, pan=px(890))
double(D3, A3, F_('lawyer', 'auctioned', -0.3), 3.6, 0.7, att=0.7, rel=1.3)
# online: the search spins it again; it slows as the matter is said settled
tS = F_('online', 'a search', -0.1); tS1 = F_('true', 'settled', -0.2)
top(NOTICE, tS, tS1 - tS + 5.0, free=tS1 - tS, g=0.8, pan=px(1020))
tap(F_('true', 'true', -0.25), 0.008, px(1150))
# a client and a neighbour look him up: softer; he asks the newspaper, the cello's D; "It says no", and it's let go
tC = F_('anyone', 'a client', -0.1); tNo = F_('asks', 'It says no', -0.3)
top(NOTICE, tC, tNo - tC + 6.0, free=tNo - tC, g=0.62, pan=0.0)
cello(D3, F_('asks', 'He asks', 0.1), 3.0, 0.75, att=0.5, rel=1.0)
knock(F_('asks', 'remove it', -0.6), 0.013, px(1130), 250)
# Madrid, 2010: the cello alone
tA = F_('agency', 'complains', -0.2)
cello(A2, tA, 1.7, 0.8, att=0.4, rel=0.6); cello(D3, tA + 1.55, 2.8, 0.8, att=0.3, rel=1.2)
knock(F_('agency', 'data protection agency', -0.5), 0.013, px(960), 230)
cello(F3, F_('links', 'keep its page', 0.25), 2.6, 0.72, pan=px(650), att=0.4, rel=1.0)
cello(D3, F_('links', 'remove the links', 0.0), 2.8, 0.72, pan=px(1270), att=0.4, rel=1.2)
# the court: the search engine appeals; Spain's court asks the Court of Justice, rising E to A
tap(F_('court', 'goes to court', -0.5), 0.009, px(960))
cello(E3, F_('court', "Spain's court", -0.3), 1.8, 0.7, att=0.35, rel=0.7); cello(A3, F_('court', 'Court of Justice', -0.3), 2.6, 0.7, att=0.3, rel=1.1)
# Luxembourg: it rules, B flat major; the three lines; sixteen years on, the cello's A, the person
double(Bb2, F3, F_('rules', 'it rules', 0.0), 3.6, 0.8, att=0.6, rel=1.4)
for w, lid in (('true information', 'even'), ('no longer relevant', 'relevant')):
    tap(F_(lid, w, -0.2), 0.008, px(452))
tap(G('story', 'unless', -0.2), 0.008, px(452))
# with the years: the cello's D, low and soft; a strong public reason: its G, apart
cello(D3, F_('relevant', 'no longer relevant', 0.1), 3.2, 0.55, att=0.6, rel=1.2)
cello(G2, F_('unless', 'strong reason', -0.2), 3.0, 0.55, att=0.6, rel=1.2)
cello(A2, F_('him', 'sixteen', -0.4), 2.3, 0.7, att=0.4, rel=0.9)
knock(F_('him', 'no such', -0.2), 0.012, px(1040), 210)
# the mark: the page stays (the top pressed), the link from his name goes (let go, slowing to still under the cello's C)
tP = F_('stays', 'page stays', -0.3); tL = F_('stays', 'link from', -0.1)
top(NOTICE, tP, tL - tP + 7.0, free=tL - tP, g=0.9, pan=px(1020))
cello(C3, tL, 5.6, 0.8, att=0.5, rel=1.8)
brush(tL, 0.008, px(500), 0.5)
# Europe, since 2014: F major, the cello rising once under the counter; one murmur of forms sent
cello(F2, F_('ask', 'directly', 0.0), 3.0, 0.75, att=0.5, rel=1.0)
cello(A2, F_('ask', 'twelve thousand', -0.2), 3.0, 0.75, att=0.5, rel=1.0)
air(F_('ask', 'twelve thousand', -0.3), 2.0, 0.008, px(400), 200, 900)
cello(C3, F_('since', 'two million', -0.4), 3.0, 0.75, att=0.5, rel=1.0)
tap(F_('person', 'A person', -0.3), 0.008, px(960))
cello(F3, F_('person', 'over half', -0.3), 3.0, 0.75, att=0.5, rel=1.2)
# the university, 2026: Linh's card, her letter, her data's places, and what she'll get if they're all found
knock(G('story', 'linh', -0.1), 0.013, px(1320), 240)
keys(G('story', 'writes', 0.1), 4, 0.007, px(1390))
double(A2, E3, F_('writes', 'tell me', -0.2), 3.2, 0.72, att=0.5, rel=1.2)
air(F_('sits', 'more places', -0.4), 1.4, 0.007, px(1300), 180, 800)
air(F_('words', 'find it all', 0.0), 1.2, 0.007, px(1300), 250, 1100)
cello(A3, F_('answer', 'an answer', -0.1), 1.7, 0.75, att=0.35, rel=0.6)
cello(F3, F_('answer', 'every part', -0.2), 2.6, 0.75, att=0.3, rel=1.3)
# the title card: the cello's F and C, at rest
double(F2, C3, G('story', 'breath', 0.2), 4.6, 0.85, att=0.9, rel=1.8)

# =============================================================================================================================
# 2. Four sentences. A cello note for each sentence as it fills its frame, A, C, B flat, A, a phrase that turns and comes back; the
#    cards and pills set down; under "A person can ask": the cello's F and C
F_ = lambda lid, word, off=0: W('four', lid, word, off)
air(G('four', 'fits', -0.2), 0.8, 0.006, 0.0, 200, 900)
for i, (lid, m) in enumerate((('show', A3), ('wrong', C4), ('need', Bb3), ('stop', A3))):
    cello(m, G('four', lid, -0.25), 1.6, 0.62, pan=px(295 + i * 440), att=0.3, rel=0.7)
knock(G('four', 'gdpr', -0.3), 0.012, px(440), 240)
tap(G('four', 'every', -0.2), 0.008, px(400))
knock(G('four', 'rules', -0.3), 0.012, px(640), 230)
tap(G('four', 'why', -0.2), 0.008, px(1400))
double(F3, C4, G('four', 'can', 0.1), 2.8, 0.66, att=0.6, rel=1.2)

# =============================================================================================================================
# 3. Is it really her? Her request set down; someone pretending to be her, a breath; the tick as her signed-in account is seen, and
#    the cello's F under it; the passport copy, in and out; the log, stamped
F_ = lambda lid, word, off=0: W('her', lid, word, off)
knock(G('her', 'sure', -0.6), 0.012, px(960), 240)
air(G('her', 'way', -0.2), 0.9, 0.006, px(300), 150, 600)
brush(F_('way', 'everything', -0.2), 0.008, px(480), 0.4)
tap(F_('account', 'signed in', -0.2), 0.010, px(610))
cello(F3, F_('account', 'signed in', -0.1), 2.4, 0.6, pan=px(700), att=0.35, rel=1.0)
paper(F_('nothing', 'passport', -0.4), 0.009, px(1630), 0.35)
tap(G('her', 'nothing', 0.6), 0.008, px(1500))
paper(G('her', 'trust', -0.5), 0.008, px(1700), 0.3)
knock(G('her', 'trust', -0.2), 0.011, px(960), 230)
stamp(G('her', 'logs', 0.4), 0.012, px(800))
tap(F_('logs', 'The answer is due', -0.2), 0.008, px(1200))

# =============================================================================================================================
# 4. Every place she is. The panes light in silence, each with a soft felt knock as it's set on the map; tables and the export,
#    paper; her name three ways, three taps; the search by every key, one soft texture as the places light; the person record, a
#    knock; lineage, a breath; and as the map is whole, kept before anyone asked: the cello's low C and G, waiting for a request
F_ = lambda lid, word, off=0: W('places', lid, word, off)
for i, w in enumerate(('HR', 'student system', 'archive', 'alumni', 'research', 'learning platform')):
    knock(F_('six', w, -0.3), 0.010, px(220 + i * 296), 250 + 12 * i)
for i, w in enumerate(('hours', 'payroll', 'mailing list', 'signed contracts')):
    knock(F_('around', w, -0.3), 0.009, px(290 + i * 445), 210 + 10 * i)
paper(G('places', 'tables', -0.3), 0.009, px(700), 0.45)
brush(F_('tables', 'spreadsheet', -0.4), 0.008, px(1700), 0.35)
for i, w in enumerate(('with accents', 'without', 'initial')):
    tap(F_('name', w, -0.3), 0.008, px(260 + i * 420))
air(F_('every', 'documents and tools', -0.4), 1.4, 0.007, 0.0, 200, 1000)
knock(G('places', 'record', -0.3), 0.011, px(1060), 240)
air(G('places', 'lineage', -0.2), 1.2, 0.006, px(760), 150, 700)
tap(G('places', 'classes', 0.0), 0.007, px(700))
double(C2, G2, G('places', 'map', 0.3), 3.6, 0.8, att=0.8, rel=1.4)
knock(G('places', 'thirty', -0.2), 0.011, px(1450), 230)

# =============================================================================================================================
# 5. More than a copy. The copy alone, a sheet laid down; the answer's sheet opens out, and the cello's B flat and F under it; each
#    part's row laid down; her students' row hidden and left out
F_ = lambda lid, word, off=0: W('copy', lid, word, off)
paper(G('copy', 'asked', -0.3), 0.008, px(1520), 0.35)
tap(F_('asked', 'A copy alone', -0.2), 0.007, px(1400))
paper(F_('asked', 'A copy alone', 0.9), 0.009, px(630), 0.4)
double(Bb2, F3, G('copy', 'each', -0.2), 3.4, 0.72, att=0.6, rel=1.3)
for lid in ('contracts', 'pay', 'degree'):
    paper(G('copy', lid, -0.3), 0.007, px(500), 0.3)
paper(G('copy', 'degree', 3.3), 0.007, px(500), 0.3)
air(F_('others', "students' names", -0.5), 0.8, 0.006, px(960), 200, 800)
knock(F_('others', 'theirs', -0.2), 0.010, px(1600), 220)
tap(F_('written', 'for her', -0.4), 0.007, px(300))

# =============================================================================================================================
# 6. Off the list. Her person card and the list set down; her yes turned to no, a stamp. Each semester's rebuild: the plunger pressed,
#    and her top hums as her yes brings her back; left alone as her no replaces it, it slows and falls still; her row leaves. The
#    next semester: the plunger pressed again, and her top doesn't hum: only a dry knock, then silence. Under "that she said no": the
#    cello's A, the person who asked
F_ = lambda lid, word, off=0: W('list', lid, word, off)
knock(G('list', 'second', -0.4), 0.011, px(420), 240)
paper(G('list', 'second', -0.2), 0.008, px(1500), 0.35)
brush(G('list', 'deleting', 0.0), 0.008, px(1500), 0.35)
knock(F_('rebuilt', 'contracts', -0.4), 0.010, px(420), 220)
tR = F_('rebuilt', 'on the person', -0.2); tB = END('list', 'back')
plunger(tR - 0.05, 0.010, px(960))
top(HERS, tR, tB - tR + 6.5, free=tB - tR, g=0.7, pan=px(1500))
stamp(F_('replaces', 'her no', -0.2), 0.011, px(170))
tap(G('list', 'next', -0.3), 0.007, px(1700))
brush(G('list', 'next', 0.4), 0.008, px(1500), 0.4)
plunger(F_('kept', 'nothing that reads', -0.4), 0.014, px(960))
tap(F_('kept', 'the record', -0.3), 0.007, px(300))
cello(A2, F_('forget', 'said no', -0.3), 2.8, 0.72, att=0.5, rel=1.2)

# =============================================================================================================================
# 7. What stays, and why. The question set down; each record that stays, a wooden knock as its panel comes in; in the pause after the
#    three, a top kept at its note for one breath (what stays is kept at speed, for its reason); the schedule laid down; the answer's
#    three lines; the page of 1998, and under "stays, for its reason", the cello's F and C
F_ = lambda lid, word, off=0: W('stays', lid, word, off)
knock(G('stays', 'suppose', -0.3), 0.011, px(960), 240)
tap(G('stays', 'not', -0.2), 0.007, px(960))
for i, lid in enumerate(('payrec', 'degree', 'research')):
    knock(G('stays', lid, -0.3), 0.012, px(370 + i * 590), 200 + 20 * i)
tap(F_('last', 'twenty thirty-three', -0.4), 0.007, px(300))
tK = END('stays', 'research') + 0.15
top(NOTICE, tK, 2.6, fade=1.6, fd=0.6, g=0.6, pan=0.0)
paper(F_('decided', 'retention schedule', -0.6), 0.008, px(960), 0.4)
for w, lid, off in (('What stays', 'reason', -0.2), ('The answer', 'says', -0.2), ('challenge', 'no', -0.6)):
    tap(F_(lid, w, off), 0.007, px(400))
paper(F_('like', "newspaper's page", -0.4), 0.008, px(1305), 0.35)
double(F3, C4, G('stays', 'like', 1.6), 3.0, 0.66, att=0.6, rel=1.3)

# =============================================================================================================================
# 8. A reason for every part. The page that stayed, and the link that went, a tap each (the top is still); every place found, one soft
#    texture as the six light; her copy laid down, her no kept, what stays; the end card: the cello's F and C, at rest
F_ = lambda lid, word, off=0: W('reason', lid, word, off)
tap(F_('page', 'stayed', -0.3), 0.007, px(1150))
tap(F_('went', 'link from', -0.3), 0.007, px(400))
air(G('reason', 'found', -0.2), 1.1, 0.006, 0.0, 200, 1000)
paper(G('reason', 'copy', -0.3), 0.008, px(500), 0.35)
knock(G('reason', 'kept', -0.3), 0.010, px(1400), 230)
knock(F_('kept', 'what stays', -0.3), 0.010, px(1400), 210)
double(F2, C3, G('reason', 'breath', 0.1), min(4.9, TOT - G('reason', 'breath', 0.1) - 0.05), 0.85, att=0.9, rel=2.0)
