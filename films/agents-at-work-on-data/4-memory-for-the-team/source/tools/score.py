# Memory: from one chat to the team: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette, reserved for this film in the series' palettes (4 November 2026) and checked that day
# against every score.py on main and on every branch: no film plays a viola d'amore or an ocarina (Change without surprises has a
# section of violas, bowed; this is one viola d'amore, and what it's heard for is the strings beneath it). Both are made here.
#  - The viola d'amore (viola()): one note at a time, bowed softly, held steady with no vibrato. Beneath its played strings run seven
#    more that no one touches, tuned to B major; each rings when the bowed note shares a partial with it, and goes on ringing after the
#    bow stops. It is the memory the team shares: one crew's lesson, heard by every crew. In 1974, and wherever a lesson stays with one
#    person, the strings beneath are damped (ring=0) and the note ends with the bow; from 1976, and wherever the team keeps a lesson,
#    they answer. The film's mark: one note bowed, B, and the strings beneath answering (mark()).
#  - The ocarina (ocarina()): an alto in C, breathed softly, with no vibrato and no room round it; its note ends when the breath
#    does, and nothing rings on after it. It plays a session: one chat, gone when it ends; and in 1974, the warning one airline kept
#    for its own pilots.
#  - G-sharp minor for the night of the crash, B major after; the chords used (B, E, F sharp, G sharp minor and D sharp minor) are all
#    pure in this film's tuning (just intonation from B), and C sharp is never held with G sharp or E, whose fifth and third would beat.
# The series' rules (its briefs, 4 November 2026):
#  - Music under the opening story, with silence where the jet is lost: from just before "struck" to "Six weeks before", no music
#    and no sound, and no urgent pulse anywhere (film.json's "urgent" is empty). After the opening, music only at a chapter's turn,
#    under a moment on screen or in a pause without words; never a bed under the voice. tools/quiet.py checks it.
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
R1 = np.random.default_rng(24)  # this film's own randomness: the rooms, the bow, the breath

# ---- tuning: just intonation from B, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (59, 246.942)  # B 3: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
Gs2, B2, Cs3, E3, Fs3, Gs3, As3, B3, Cs4, Ds4, E4, Fs4, Gs4, B4 = 44, 47, 49, 52, 54, 56, 58, 59, 61, 63, 64, 66, 68, 71
# the ocarina's notes, an alto in C: from A sharp 4 up
oAs4, oB4, oCs5, oDs5, oE5, oFs5, oGs5 = 70, 71, 73, 75, 76, 78, 80
# the seven strings beneath, tuned to B major: B 2, F sharp 3, B 3, D sharp 4, F sharp 4, B 4, D sharp 5
SYM = (47, 54, 59, 63, 66, 71, 75)

# ---- the levels, measured by tools/quiet.py on 4 November 2026 as one speaker plays the score: the music's loud moments about
# -28 dB of full scale and its loudest notes under -24, as the series' films after the author's review; the effects' loud moments
# under -43 dB (FX scales them)
VL, OL, FX = 0.050, 0.021, 1.5

def _ir(sec, lo):
    """a room's ring: noise that dies away over sec, its top rolled off at lo, after 20 ms. Its level is set by what it rings below lo
    (its gain there about one), not by all it rings: scaled by all of it, the room rang about 10 dB louder there than its share said"""
    x = np.arange(int(sec * SR)) / SR; ir = (R1.standard_normal(len(x)) * np.exp(-6.9 * x / sec)).astype(np.float32)
    ir = filt(ir, 'low', lo); ir[:int(0.02 * SR)] = 0
    return ir / np.sqrt((ir ** 2).sum() * SR / (2 * lo))
ROOM = _ir(1.3, 1900)  # a wooden room round the viola d'amore
def _room(s, wet, body=None):
    """the room round a note. body (from, to, in samples) is where the note is held: the room still moves a held note's level, up or
    down by where its reflections meet the note's partials (up to 7 dB in this film's notes), so the note is set back to the level it
    had there before the room"""
    if not wet:
        return s
    r = np.pad(s, (0, len(ROOM) - 1)) + wet * fftconvolve(s, ROOM).astype(np.float32)
    if body:
        a, b = body; r = r * np.float32(np.sqrt((s[a:b] ** 2).mean() / max(1e-12, float((r[a:b] ** 2).mean()))))
    return r

def _shares(f, fs):
    """how strongly a bowed note f sets a string fs ringing: by the partials they share, exactly, in this tuning"""
    e = 0.0
    for k in range(1, 9):
        for j in range(1, 7):
            if abs(f * k - fs * j) < 0.002 * fs * j:
                e += 1.0 / (k * j)
    return e

# ---- the viola d'amore: one note bowed from a to b, steady, with no vibrato. Its partials fall away as a bowed string's do, shaped
# by the body (a low resonance near 280 Hz, another near 750 Hz), the higher ones speaking a moment after the first; a faint rosin
# hiss from the bow, a little more as the note starts. ring (0 to 1): how far the strings beneath answer; each builds while the bow
# plays and rings on after it stops, dying away over ringsec. All of it is one sound, so the strings are heard as the note's own
def viola(m, a, b, g=1.0, att=0.35, rel=0.8, ring=0.0, ringsec=3.0, pan=-0.12, room=0.32):
    f = hz(m); sec = max(0.3, b - a); n = int((sec + rel + (ringsec if ring else 0.0) + 0.1) * SR); x = np.arange(n) / SR
    s = np.zeros(n)
    for k in range(1, int(2300 // f) + 1):
        fk = f * k
        body = 0.55 + 0.45 * np.exp(-((fk - 280) / 140) ** 2) + 0.35 * np.exp(-((fk - 750) / 260) ** 2)
        w = body / k ** 1.05 * (1.0 if fk < 1500 else np.exp(-(fk - 1500) / 380))
        on = np.sin(0.5 * np.pi * np.minimum(x / (att * (1 + 0.12 * (k - 1))), 1)) ** 2
        off = np.where(x > sec, np.exp(-(x - sec) * (4.6 + 0.6 * (k - 1)) / rel), 1.0)
        s = s + w * on * off * np.sin(2 * np.pi * fk * x + 0.4 * k)
    if sec >= 1.2:
        s = s * (0.9 + 0.1 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s / max(1e-9, float(np.abs(s).max()))
    bow = np.where(x < sec, 1.0, np.exp(-(x - sec) * 14)) * np.minimum(1, x / 0.06)
    s = s + filt(noise(n / SR + 0.01)[:n], 'band', (400, 1800)) * 0.006 * bow * (1 + 2.0 * np.exp(-x / 0.12))
    if ring > 0:
        held = np.where(x < sec, 1 - np.exp(-x / 0.45), (1 - np.exp(-sec / 0.45)) * np.exp(-(x - sec) * 4.6 / ringsec))
        for fs in (hz(q) for q in SYM):
            e = _shares(f, fs)
            if e <= 0:
                continue
            ph = R1.uniform(0, 2 * np.pi)
            tone = sum(np.sin(2 * np.pi * fs * j * x + ph * j) / j ** 1.4 for j in range(1, 7) if fs * j < 2300)
            s = s + 0.32 * ring * min(1.0, e) * held * tone
    put(_room(filt(s.astype(np.float32), 'low', 2300), room, (int(min(0.25, 0.4 * sec) * SR), int(sec * SR))), a, g * VL, pan)

def mark(t, hold=2.2, g=1.0, ringsec=4.0, pan=-0.05):
    """the film's mark: one note bowed, B 3, and the strings beneath answering, ringing on after it"""
    viola(B3, t, t + hold, g, att=0.5, rel=1.0, ring=1.0, ringsec=ringsec, pan=pan)

# ---- the ocarina: an alto in C, breathed softly, with no vibrato and no room. Nearly a pure tone, with its breath round it and a
# little chiff as it speaks; when the breath stops, so does the note
def ocarina(m, a, b, g=1.0, att=0.06, pan=0.15):
    f = hz(m); sec = max(0.15, b - a); n = int((sec + 0.12) * SR); x = np.arange(n) / SR
    on = np.sin(0.5 * np.pi * np.minimum(1, x / att)) ** 2
    off = np.cos(0.5 * np.pi * np.clip((x - sec) / 0.07, 0, 1)) ** 2
    ph = 2 * np.pi * f * x
    tone = np.sin(ph) + 0.035 * np.sin(2 * ph) + 0.012 * np.sin(3 * ph)
    br = filt(noise(n / SR + 0.01)[:n], 'band', (f * 0.7, min(2400, f * 1.5))) * (0.03 + 0.10 * np.exp(-x / 0.04))
    put(filt(((tone + br) * on * off).astype(np.float32), 'low', 2400), a, g * OL, pan)
def breath(notes, t, g=1.0, pan=0.15):
    """a phrase on the ocarina: notes [(note, length)], one after another, each with its own breath"""
    for m, d in notes:
        ocarina(m, t, t + d, g, pan=pan); t += d + 0.06

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.018, pan=0.0, f=240):
    """a soft wooden knock: a card set down, a frame hung"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.010, pan=0.0):
    """a muffled tap: a line written, a pill set in place"""
    s_tap(s, g * FX, pan)
def paper(s, g=0.014, pan=0.0, sec=0.45):
    """a sheet of paper laid down, or slid into an envelope"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2000))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def flick(s, g=0.010, pan=0.0):
    """a strip of paper lifted, a row turned up: short and light"""
    paper(s, g, pan, 0.16)
def pin(s, g=0.016, pan=0.0):
    """a notice pinned to a board: a small, dull tuck"""
    s_knock(s, g * FX, pan, 360); s_tap(s + 0.004, g * 0.5 * FX, pan)
def pencil(s, sec=0.8, g=0.008, pan=0.0):
    """a pen writing on paper: a soft, even scratch"""
    x = tt(sec); X(filt(noise(sec), 'band', (500, 2000))[:len(x)] * np.minimum(1, np.minimum(x, sec - x) / 0.08), s, g * FX, pan)
def strike(s, g=0.009, pan=0.0, sec=0.5):
    """a line struck through: a pen drawn quickly"""
    x = tt(sec); X(filt(noise(sec), 'band', (450, 1800))[:len(x)] * np.minimum(1, x / 0.02) * np.exp(-x / (0.6 * sec)), s, g * FX, pan)
def stamp(s, g=0.020, pan=0.0):
    """a stamp pressed down: a low knock and the slap of its pad"""
    s_knock(s, g * FX, pan, 130); x = tt(0.09); X(filt(noise(0.09), 'band', (200, 1200))[:len(x)] * np.exp(-x / 0.015), s + 0.005, g * 0.5 * FX, pan)
def air(s, sec=0.8, g=0.010, pan=0.0, lo=140, hi=900):
    """a breath of air: something sliding across, papers flying"""
    s_air(s, sec, g * FX, pan, lo, hi)
def lock(s, g=0.010, pan=0.0):
    """a small lock closing"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def rain(a, b, g=0.0045):
    """rain and wet snow on the hills: a soft, even hiss that swells in and dies away, one sound and not many drops, a little
    different on each side"""
    sec = b - a; x = tt(sec)
    e = np.minimum(1, x / 1.6) * np.minimum(1, (sec - x) / 1.2)
    for p in (-0.55, 0.55):
        s = filt(noise(sec), 'band', (280, 1700))[:len(x)] * 0.7 + filt(noise(sec), 'low', 380)[:len(x)] * 0.6
        X(filt((s * e).astype(np.float32), 'low', 1700), a, g * FX, p)
def engine(a, b, g=0.006, p0=-0.7, p1=0.6):
    """a jet far off in the cloud: a low, soft roar that rises and falls as it passes, moving across as the jet does"""
    sec = b - a; x = tt(sec).astype(np.float64); u = x / sec
    s = filt(noise(sec), 'band', (55, 380))[:len(x)] * np.sin(np.pi * np.clip(u, 0, 1)) ** 1.4
    s = filt(s.astype(np.float32), 'low', 420)
    X((s * (1 - u)).astype(np.float32), a, g * FX, p0); X((s * u).astype(np.float32), a, g * FX, p1)

# =============================================================================================================================
# 1. Cleared for the approach: the opening, music all through but for the crash. Virginia, 1974: the viola d'amore in G-sharp minor,
#    its strings beneath damped, one long note at a time, falling as the jet comes down: G sharp under the place, D sharp as the jet
#    flies through the cloud, B as the controller clears the crew, A sharp and F sharp for the two readings of the same words, G sharp
#    low for the ridge, let go before "struck". Then nothing, no music and no sound, until "Six weeks before". The rain, soft, under the
#    hills; the jet far off as it crosses the cloud. October: the viola again, low, as the other crew narrowly misses the ridge. The
#    airline's warning to its own pilots: the ocarina, three notes, the last cut short where the way to the others stops; the notice
#    pinned. "Something had to change": a pause. 1976: B major, and the strings beneath answer for the first time, more as each of
#    pilot, controller and mechanic is named; the forms go off in envelopes; "in confidence", a small lock. NASA: the envelopes land in
#    the tray, the strip with the name lifted; the alerts fly out. "Now one crew's lesson reaches every crew": the alerts pinned on
#    every board, and the mark. The university: the crew rooms, framed, the viola alone and damped; the chat, the ocarina, cut short;
#    the colleague's mistake, two low notes; the team's memory, the strings answering as both agents read it. The title card: the mark
aw = lambda lid, word, off=0: W('approach', lid, word, off)
ac = lambda lid, off=0: G('approach', lid, off)
a0 = S0('approach')
tCloud, tClears = aw('cloud', 'passenger jet'), aw('cleared', 'controller', -0.5)
rain(a0 + 0.2, tClears + 0.4)
engine(tCloud - 0.6, tClears + 0.3)
viola(Gs3, a0 + 0.8, aw('place', 'nineteen', 0.6), 0.85, att=1.2, rel=1.2)
viola(Ds4, tCloud - 0.2, aw('cloud', 'Dulles', 0.4), 0.75, att=1.0, rel=1.2)
viola(B3, tClears + 0.3, END('approach', 'cleared') + 0.2, 0.8, att=0.8, rel=1.0)
viola(As3, aw('crew', 'To the crew', -0.1), END('approach', 'crew'), 0.75, att=0.6, rel=0.9)
viola(Fs3, aw('ctrl', 'controllers', -0.3), END('approach', 'ctrl') + 0.3, 0.75, att=0.6, rel=0.9)
tStruck = aw('died', 'struck')
viola(Gs2, aw('ridge', 'ridge', -0.6), tStruck - 0.9, 0.9, att=0.9, rel=0.55)
# six weeks before: the October sky, the jet far off again, the viola low as it narrowly misses the ridge
tBefore = aw('before', 'Six weeks', -0.4)
engine(tBefore + 0.6, aw('warned', 'warned', -0.8), 0.005, -0.4, 0.75)
viola(Gs3, tBefore + 0.4, aw('before', 'narrowly missed', -0.2), 0.75, att=1.2, rel=0.9)
viola(B3, aw('before', 'narrowly missed', 0.0), END('approach', 'before') + 0.4, 0.7, att=0.6, rel=1.0)
# the airline's warning to its own pilots: the notice pinned, and the ocarina, three notes, the last cut short as the way stops
tWarn = aw('warned', 'warned')
pin(tWarn + 0.3, 0.016, px(495))
breath([(oDs5, 0.55), (oCs5, 0.55), (oB4, 0.42)], tWarn + 0.2, 0.9, px(500))
# a pilot who reported a mistake could be punished: the form raised; the viola, low, under it, then a pause before 1976
viola(Gs3, aw('punish', 'pilot', -0.4), aw('punish', 'Something had to change', -0.2), 0.7, att=0.9, rel=1.0)
# 1976: B major; the strings beneath answer for the first time, and more as each of pilot, controller and mechanic is named
t76 = aw('y1976', 'In nineteen', -0.3)
viola(B3, t76 + 0.2, aw('y1976', 'every pilot', -0.1), 0.8, att=0.7, rel=0.9, ring=0.7, ringsec=2.6)
viola(Ds4, aw('y1976', 'every pilot', 0.1), aw('y1976', 'controller', 0.0), 0.7, att=0.3, rel=0.7, ring=0.8, ringsec=2.4)
viola(Fs4, aw('y1976', 'controller', 0.15), aw('y1976', 'mechanic', 0.0), 0.65, att=0.3, rel=0.7, ring=0.8, ringsec=2.4)
viola(B4, aw('y1976', 'mechanic', 0.15), END('approach', 'y1976') + 0.6, 0.6, att=0.3, rel=1.0, ring=0.9, ringsec=3.0)
# in confidence: the forms go off in envelopes, one from each room; a small lock; the viola's E, warm, under it
tGo = aw('confide', 'in confidence', -0.3)
for i in range(3):
    paper(tGo + 0.25 * i + 0.1, 0.012, px(200 + 640 * i), 0.4)
lock(aw('confide', 'in confidence', 0.1), 0.010, px(960))
viola(E3, aw('confide', 'They could', -0.1), END('approach', 'confide'), 0.75, att=0.9, rel=1.0, ring=0.6, ringsec=2.4)
# NASA: the envelopes land in the tray; the strip with the name lifted off; the alerts fly out; F sharp, then D sharp, answering
tN = aw('nasa', 'NASA', -0.4)
for k in range(4):
    paper(tN + 0.2 + 0.35 * k + 0.95, 0.009, px(520), 0.3)
flick(aw('nasa', 'took out the names', -0.1), 0.010, px(900))
viola(Fs3, tN + 0.3, END('approach', 'nasa') + 0.2, 0.75, att=0.9, rel=1.0, ring=0.6, ringsec=2.4)
tSent = aw('sent', 'sent')
air(tSent + 0.15, 1.3, 0.010, px(500), 160, 900)
viola(Ds4, tSent + 0.1, END('approach', 'sent') + 0.2, 0.7, att=0.5, rel=0.9, ring=0.7, ringsec=2.4)
# now one crew's lesson reaches every crew: the alert pinned on each board, and the mark
tEvery = aw('reach', 'every crew')
for i in range(3):
    pin(tEvery - 0.4 + 0.25 * i + 0.3, 0.014, px(450 + 640 * i))
mark(tEvery - 0.1, 2.4, 0.9, 4.0)
# fifty years of it: the card; the viola low, the strings still ringing
knock(aw('count', 'two point three', -0.3), 0.014, px(960), 260)
viola(B2, aw('count', 'two point three', 0.2), END('approach', 'count'), 0.7, att=1.2, rel=1.2, ring=0.6, ringsec=2.6)
# the university: the crew rooms, framed and hung; the viola alone, damped, as lessons get lost the same way
tUni = aw('stakes', 'At the university', -0.3)
knock(tUni + 0.9, 0.014, px(960), 220)
viola(Gs3, tUni + 0.6, END('approach', 'stakes'), 0.65, att=1.0, rel=0.9)
# the chat: the ocarina, as its card opens, and cut short where the way to the colleague's agent stops; the colleague's mistake
tChat = aw('chat', "one person's agent")
breath([(oB4, 0.45), (oDs5, 0.6)], tChat - 0.1, 0.85, px(320))
breath([(oCs5, 0.35)], aw('chat', 'stays', 0.9), 0.75, px(900))
tMis = aw('chat', 'same mistake')
viola(Ds4, tMis + 0.05, tMis + 0.5, 0.6, att=0.12, rel=0.4); viola(As3, tMis + 0.6, tMis + 1.4, 0.6, att=0.12, rel=0.6)
# memory the team shares: the file set out; both agents read it, and the strings answer
knock(aw('team', 'Memory', -0.1), 0.014, px(1030), 260)
viola(Fs3, aw('team', 'every agent', 0.1), END('approach', 'team') + 0.6, 0.75, att=0.6, rel=1.0, ring=0.9, ringsec=2.6)
# the title card: the mark, as the ring closes round the sphere
mark(ac('breath', 0.9), 2.2, 0.9, 3.6)

# 2. One chat: April. The ocarina as Jun's session opens; the count 37 short, two low notes on the viola, damped; Mei's two cards,
#    each set down; "counts again", the ocarina's rising fifth; the lesson flies to the agent's own memory, a breath of air; the session
#    closes, the ocarina's last note cut short, nothing ringing after it; the team's notes pinned, and the week's pages turned
ow = lambda lid, word, off=0: W('onechat', lid, word, off)
o0 = S0('onechat')
breath([(oB4, 0.5), (oDs5, 0.8)], ow('april', 'Jun asks', 0.2), 0.85, px(1300))
viola(B3, ow('short', 'thirty-seven short', 0.1), ow('short', 'thirty-seven short', 0.6), 0.6, att=0.12, rel=0.4)
viola(Fs3, ow('short', 'thirty-seven short', 0.7), ow('short', 'thirty-seven short', 1.5), 0.6, att=0.12, rel=0.6)
knock(ow('mei', 'Jun asks Mei', 0.1), 0.014, px(840), 260)
knock(ow('mei', 'They count', -0.2), 0.014, px(1080), 260)
tAg = ow('again', 'counts again')
breath([(oB4, 0.32), (oFs5, 0.7)], tAg + 0.25, 0.8, px(1500))
air(ow('own', 'the lesson goes there', -0.3), 1.1, 0.009, px(900), 180, 900)
knock(ow('own', 'memory of its own'), 0.012, px(830), 280)
breath([(oDs5, 0.4), (oB4, 1.1)], ow('stays', 'stays', 0.1), 0.8, px(1500))
pin(ow('notes', 'notes for agents', -0.1), 0.014, px(1500))
tWk = ow('notes', 'busy week', -0.2)
for d in range(5):
    flick(tWk + 0.25 + 0.27 * d, 0.006, px(1500))

# 3. Weeks later: June. Clara's session opens, the ocarina, as Jun's did; her total 37 short, two low notes falling a fourth; the
#    way to Jun's agent stops halfway, a dull tap; the budget figures stamped 37 short; and, like the crew six weeks before, the
#    viola alone, damped, as the crew rooms are hung
ww = lambda lid, word, off=0: W('weeks', lid, word, off)
breath([(oB4, 0.5), (oDs5, 0.8)], ww('june', 'asks her own agent', 0.2), 0.85, px(440))
tTot = ww('same', 'Its total')
viola(Ds4, tTot + 0.6, tTot + 1.05, 0.6, att=0.12, rel=0.4); viola(As3, tTot + 1.15, tTot + 1.95, 0.6, att=0.12, rel=0.6)
tap(ww('knew', 'never seen', 0.2) + 0.55, 0.010, px(1320))
stamp(ww('budget', 'budget figures', 0.6), 0.018, px(440))
viola(Gs3, ww('back', 'Like the crew', -0.2), END('weeks', 'back') + 0.4, 0.7, att=0.9, rel=1.0)
knock(ww('back', 'Like the crew', -0.1), 0.012, px(990), 220)

# 4. A session, and what lasts: Tulving's card, set down, and a short note at the turn; episodic memory, the ocarina, gone when it
#    ends; semantic memory, the viola, its strings ringing on; the sessions passing the model, each a breath of air; the record's
#    lines, a few soft taps, and its scroll; lasting memory, the viola again; the fact, the preference and the decision, each set down;
#    "it outlasts the episode", one note with the strings ringing long after it
kw = lambda lid, word, off=0: W('kinds', lid, word, off)
k0 = S0('kinds')
knock(kw('tulving', 'In nineteen', 0.1), 0.014, px(960), 260)
viola(B3, kw('tulving', 'In nineteen', 0.3), kw('tulving', 'two kinds', 0.2), 0.65, att=0.8, rel=0.9, ring=0.4, ringsec=2.0)
breath([(oAs4, 1.2)], kw('episodic', 'Episodic memory', -0.1), 0.8, px(550))
viola(Fs3, kw('semantic', 'Semantic memory', -0.1), kw('semantic', 'facts and meanings', 0.4), 0.7, att=0.5, rel=0.9, ring=1.0, ringsec=3.0)
tMo = kw('model', 'keeps nothing', -0.6)
for i in range(3):
    air(tMo - 0.1 + 1.15 * i + 0.3, 1.0, 0.007, px(400 + 200 * i), 180, 800)
tAsk = kw('record', 'who asked')
for i in range(4):
    tap(tAsk - 0.4 + 0.55 * i + 0.3, 0.008, px(1400))
paper(kw('long', 'long'), 0.009, px(1450), 1.4)
viola(Ds4, kw('lasting', 'Lasting memory', -0.1), kw('lasting', 'a line or two', 0.3), 0.65, att=0.5, rel=0.9, ring=0.9, ringsec=2.6)
for lid, word in (('fact', 'A fact'), ('pref', 'A preference'), ('decision', 'A decision')):
    knock(kw(lid, word, -0.1), 0.013, px(500), 280)
viola(B3, kw('like', 'outlasts', -0.3), kw('like', 'outlasts', 1.0), 0.65, att=0.4, rel=0.9, ring=1.0, ringsec=3.4)

# 5. Memory for the team: the agent writes its proposal, a pen; each field, a soft tap; the three checks, three more; Mei reads it
#    (the picture of the analysts' office hung); she approves it, the stamp, and B bowed with the strings answering; it drops into the
#    team's memory, a knock, and as each agent reads it the strings answer; Clara's answer with its entry, the ocarina's rising fifth;
#    the lesson's homes, three cards set down; "whose agent got it wrong", struck out; "the lesson, not the blame", E, warm
tw = lambda lid, word, off=0: W('team', lid, word, off)
pencil(tw('propose', 'proposes', 0.1), 0.9, 0.008, px(1290))
for word in ('what was learned', 'where it came from', 'who confirmed'):
    tap(tw('entry', word, -0.1), 0.008, px(1290))
for x, word in ((990, "No students' names"), (1240, 'no IDs'), (1530, 'nothing sensitive')):
    tap(tw('clean', word, 0.1), 0.008, px(x))
knock(tw('review', "NASA's analysts", -0.1), 0.012, px(195), 220)
tApp = tw('meiok', 'approves', 0.1)
stamp(tApp + 0.25, 0.018, px(1110))
viola(B3, tApp + 0.2, tApp + 2.0, 0.75, att=0.25, rel=0.9, ring=0.9, ringsec=2.4)
knock(tw('shared', "team's memory", 0.35), 0.016, px(1370), 240)
tSt = tw('shared', 'when a session starts')
viola(Ds4, tSt - 0.1, tSt + 1.4, 0.7, att=0.4, rel=0.9, ring=1.0, ringsec=2.8)
breath([(oB4, 0.3), (oFs5, 0.7)], tw('asks', 'answers', 0.3), 0.8, px(470))
for x, word in ((590, 'a skill'), (990, 'a test'), (1390, 'the glossary')):
    knock(tw('home', word, -0.1), 0.012, px(x), 280)
strike(tw('blame', 'whose agent', 0.6), 0.009, px(960))
viola(E3, tw('blame', 'not the blame', -0.2), END('team', 'blame') + 0.6, 0.7, att=0.8, rel=1.0, ring=0.7, ringsec=2.4)

# 6. When memory is wrong: "can be wrong", G sharp, damped; April's first answer, had it been kept: its card turns up in the file,
#    a flick, and as the mistake reaches every agent the strings answer, in G-sharp minor; nothing goes in without a person, the two
#    pills set down; the file from outside, laid down, its hidden row turned up; the agent reaches for it and writes its proposal;
#    "turned it down", the stamp, and two low notes falling; memory poisoning: the false card, and the strings answering low as the
#    mistake spreads; the rule, B with the strings answering
rw = lambda lid, word, off=0: W('wrong', lid, word, off)
viola(Gs3, rw('canbe', 'Memory', -0.1), END('wrong', 'canbe') + 0.6, 0.65, att=0.5, rel=0.9)
flick(rw('first', 'first answer', -0.1), 0.010, px(1370))
viola(Ds4, rw('taught', 'every agent', -0.1), rw('taught', 'same mistake', 0.4), 0.65, att=0.5, rel=0.9, ring=0.8, ringsec=2.2)
for x, word in ((820, 'corrected'), (1100, 'removed')):
    tap(rw('person', word, 0.0), 0.009, px(x))
paper(rw('planted', 'planted', -0.2), 0.012, px(470), 0.45)
flick(rw('file', 'hidden line', 0.25), 0.010, px(470))
air(rw('proposed', 'read it', -0.2), 0.9, 0.008, px(1000), 180, 900)
pencil(rw('proposed', 'proposed it', 0.05), 0.7, 0.008, px(1430))
tDown = rw('down', 'turned it down', 0.1)
stamp(tDown + 0.12, 0.018, px(980))
viola(Cs4, tDown + 0.3, tDown + 0.75, 0.6, att=0.12, rel=0.4); viola(Gs3, tDown + 0.95, tDown + 1.8, 0.6, att=0.12, rel=0.6)
knock(rw('poison', 'one false entry', -0.2), 0.013, px(1510), 260)
viola(Gs2, rw('poison', 'every agent after it', -0.1), END('wrong', 'poison') + 0.3, 0.75, att=0.6, rel=0.9, ring=0.8, ringsec=2.2)
viola(B3, rw('only', 'only what people confirmed', -0.2), rw('only', 'never what', 0.4), 0.7, att=0.6, rel=0.9, ring=0.9, ringsec=2.6)

# 7. Every crew: the warning of six weeks before, the ocarina's three notes again, the last cut short; today, the alert pinned on every
#    board and B with the strings answering; the university, each agent reading the team's memory, the strings ringing on; the three
#    checks; the takeaway and the end card: the mark, one last time
ew = lambda lid, word, off=0: W('every', lid, word, off)
breath([(oDs5, 0.55), (oCs5, 0.55), (oB4, 0.42)], ew('warning', 'warning', 0.2), 0.8, px(500))
tToday = ew('today', 'every crew')
for i in range(3):
    pin(tToday - 0.3 + 0.25 * i + 0.3, 0.014, px(450 + 640 * i))
viola(B3, ew('today', 'Today', -0.1), END('every', 'today') + 0.3, 0.7, att=0.5, rel=0.9, ring=0.9, ringsec=2.6)
for x, word in ((560, 'Reviewed by a person'), (960, 'kept without names'), (1390, 'corrected')):
    tap(ew('kept', word, 0.1), 0.008, px(x))
mark(ew('takeaway', 'Let the agent', -0.4) + 1.3, 2.4, 0.85, 4.0)
