# A platform that watches itself: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette (/mnt/project-files/modern-data-basics/palettes.md, where the module's setup thread reserved
# the lead for this film on 5 November 2026, and this film's thread chose the partner): two terpsitones, both made here (music.py has
# none).
#  - The terpsitone, the dance platform of 1932 whose space senses a body moving above it and turns it into tone: a platform that
#    senses, as Genie ZeroOps senses the jobs and tables it watches. Played as plain notes, stepped, never sliding, with no vibrato:
#    a tone near a sine, a little of its second and third harmonics, and a soft breath of air at its edge (the dancer's body moving
#    over the platform), which keeps it apart from the site's ondes Martenot, trautonium and soft synthesisers. Middle register.
#  - The partner: a second terpsitone, an octave and more lower, with a rounder tone, played by a second dancer: the people who decide.
#    It sounds only where a person decides, reviews or approves, and under the story's turns; never for the agent. A person's decision
#    is its rising fourth, F to B flat. Chosen here, as film 4 chose a second ophicleide, because every plucked or struck colour the
#    site lacks either belongs to another culture or sounds like one the site has; and no clavioline, which sounds like the ondes.
#  - The mark: a still note that steps up when something moves, then settles back (F, G, F), where something is sensed: the 1202 light,
#    the computer saying what was wrong, the agent finding the failure, "The platform proposes", and the end card.
#  - B flat major for the platform, the people and what they agree; G minor for what goes wrong (the 1202 alarm's cost, the night the
#    job fails, the fix that mended the night but not its cause). Just intonation from B flat (hz()): B flat, E flat, F major, G minor
#    and D minor are pure; C sounds with neither E flat nor G.
# The rules every film keeps (AGENTS.md, Sound; the module's palettes.md):
#  - Music under the opening story, then only at a chapter's turn, under a moment on screen or in a pause without words, at most about
#    once every 10 seconds; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato; every chord tuned pure. No urgent pulse: the night the job
#    fails is told calmly (film.json lists no urgent chapter). No beeps, tones or countdown for Apollo 11: the terpsitone's notes come
#    in slowly, and nothing on the module's display makes a sound.
#  - Every sound is an event on screen, at its moment: each uses the same word and offset as the picture in src/scenes.js, so sound and
#    picture stay together when the voice is re-timed. Effects one at a time, soft, below about 2.5 kHz.

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
R1 = np.random.default_rng(1932)  # this film's own randomness: the room, the breath, the paper

# ---- tuning: just intonation from B flat, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (46, 116.541)  # B flat 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
F2, G2, Bb2, D3, Eb3, F3 = 41, 43, 46, 50, 51, 53                              # the partner, low
Bb3, D4, Eb4, F4, G4, A4, Bb4, C5, D5 = 58, 62, 63, 65, 67, 69, 70, 72, 74      # the lead

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films'; the partner a little under the lead; the effects far under the music (FX scales them all)
TL, PL, FX = 0.060, 0.050, 1.4

# a room round the dancers: a small, quiet hall, ringing on for about a second, nothing much above 1.8 kHz. Its level is set by what it
# rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), and each held note is set back to its own level (_held), as the
# video guidelines ask
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 1.2)).astype(np.float32))(np.arange(int(1.2 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.02 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a held note in the room, at its own level: the room moves a pure note's level up or down by where its reflections meet it, so
    the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a, b = int(0.25 * SR), max(int(0.25 * SR) + 1, len(s) - int(0.3 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- the terpsitone: a tone near a sine with a little of its second and third harmonics, coming in slowly (no click, nothing like a
# beep), and a soft breath of air round the note, a little more as it starts: the dancer moving over the platform. Stepped, never
# sliding; no vibrato; a note of 1.2 s or more swells a little and eases, once
def _terp(m, sec, h2, h3, att, rel, breath):
    f = hz(m); n = int((sec + rel + 0.1) * SR); x = np.arange(n) / SR
    on = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    off = np.where(x > sec, np.exp(-(x - sec) * 4.6 / rel), 1.0)
    s = np.sin(2 * np.pi * f * x) + h2 * np.sin(2 * np.pi * 2 * f * x + 0.3) + h3 * np.sin(2 * np.pi * 3 * f * x + 0.7)
    if sec >= 1.2:
        s = s * (0.92 + 0.08 * np.sin(np.pi * np.clip(x / sec, 0, 1)))
    s = s * on * off / (1 + h2 + h3)
    br = filt(noise(n / SR + 0.01)[:n], 'band', (max(90.0, f * 0.8), min(2100.0, f * 3.0))) * 0.05 * breath * (0.5 * on * off + 1.5 * np.exp(-x / 0.14) * on)
    return filt((s + br).astype(np.float32), 'low', 2200)
def terp(m, a, b, g=1.0, pan=0.0, att=0.12, rel=0.6, room=0.3):
    """the lead: a note from a to b"""
    put(_held(_terp(m, max(0.25, b - a), 0.16, 0.05, att, rel, 1.0), room), a, g * TL, pan)
def low(m, a, b, g=1.0, pan=-0.1, att=0.3, rel=0.9, room=0.3):
    """the partner: the second dancer, lower and rounder, where a person decides"""
    put(_held(_terp(m, max(0.3, b - a), 0.34, 0.12, att, rel, 0.6), room), a, g * PL, pan)
def steps(notes, s, step, g=1.0, pan=0.0, hold=0.36, last=1.2):
    """stepped notes, one after another, the last one held"""
    for i, m in enumerate(notes):
        terp(m, s + step * i, s + step * i + (last if i == len(notes) - 1 else hold), g, pan, att=0.08, rel=0.35 if i < len(notes) - 1 else 0.8)
def mark(s, g=1.0, pan=0.0, still=1.0, up=0.85, back=1.4):
    """the mark: a still note that steps up when something moves, then settles back (F, G, F)"""
    terp(F4, s, s + still, g, pan, att=0.25, rel=0.25); terp(G4, s + still, s + still + up, g * 0.95, pan, att=0.07, rel=0.25)
    terp(F4, s + still + up, s + still + up + back, g, pan, att=0.07, rel=0.9)
def decide(s, g=1.0, hold=1.4, pan=-0.1):
    """a person decides: the partner's rising fourth, F to B flat"""
    low(F2, s, s + 0.42, g * 0.9, pan, att=0.1, rel=0.25); low(Bb2, s + 0.48, s + 0.48 + hold, g, pan, att=0.12, rel=0.8)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.014, pan=0.0, f=240):
    """a soft knock: a card or a window set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.009, pan=0.0):
    """a muffled tap: a row lit, a key"""
    s_tap(s, g * FX, pan)
def keys(s, n, g=0.008, pan=0.0, step=0.16):
    for i in range(n):
        tap(s + i * step + 0.03 * R1.uniform(), g if i < 2 else g * 0.7, pan)
def paper(s, g=0.010, pan=0.0, sec=0.4):
    """a sheet laid down, a page turned"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 1800))[:len(x)] * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def air(s, sec=0.8, g=0.008, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across, falling or rising"""
    s_air(s, sec, g * FX, pan, lo, hi)
def lock(s, g=0.009, pan=0.0):
    """a small lock closing"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def click(s, g=0.010, pan=0.0):
    """a job starts, a button pressed: a soft, dull click"""
    s_knock(s, g * FX, pan, 300); s_tap(s + 0.006, g * 0.7 * FX, pan)
def thud(s, g=0.020, pan=0.0):
    """the module touching down: a soft, low thud, felt more than heard"""
    s_knock(s, g * FX, pan, 95); s_knock(s + 0.01, g * 0.5 * FX, pan, 150)

# =============================================================================================================================
# 1. The 1202 alarm: the opening, with music all through it.
#    20 July 1969: the platform's home, B flat, the partner's low B flat and the lead's F. The descent: the lead steps down, D, C, B flat,
#    as the module comes down. The light comes on: the mark (it senses its work is more than its time). More work than time: G minor,
#    open. "Houston": one note, asking. If the computer stopped, or an abort: G minor, the lead falling B flat, A, G as they'd turn back.
#    Built to watch itself: B flat, the lead's fourth rising; it starts again, keeps the steering (B flat, F) and drops the rest (the
#    bars fall: a breath of air). It raises the alarm so people can decide: a person decides. The guidance officer: one warm note. The
#    rule they'd agreed: B flat major. The word goes up: a person decides, and the go rising. Four more alarms: four steps rising, each
#    a go. Eagle lands: the thud and the dust, B flat major. It watched itself and said what was wrong: the mark; people who knew:
#    the partner. This November, the job fails: G minor, a knock. By morning, a person decides. The title: B flat, F, then B flat
A = lambda lid, word, off=0: W('alarm', lid, word, off)
a0 = S0('alarm')
low(Bb2, a0 + 0.4, A('date', 'nineteen', 0.8), 0.8, att=1.0, rel=1.2)
terp(F4, a0 + 1.2, A('date', 'nineteen', 0.6), 0.7, att=0.6, rel=1.0)
terp(D5, A('descent', 'flying', 0.0), A('descent', 'flying', 1.3), 0.55, px(700), att=0.3, rel=0.4)
terp(C5, A('descent', 'down to the Moon', 0.0), A('descent', 'down to the Moon', 1.2), 0.55, px(800), att=0.25, rel=0.4)
terp(Bb4, A('descent', 'its computer steering', 0.0), A('descent', 'its computer steering', 1.9), 0.6, px(900), att=0.25, rel=0.9)
mark(A('light', 'a light comes on', 0.1), 0.7, px(760))
low(G2, A('more', 'more work', -0.1), A('more', 'more work', 1.9), 0.75, att=0.4, rel=0.9)
terp(D4, A('more', 'more work', 0.05), A('more', 'more work', 1.8), 0.55, px(1680), att=0.3, rel=0.9)
terp(A4, A('ask', 'Houston', -0.05), A('ask', 'Houston', 1.3), 0.5, px(960), att=0.3, rel=0.8)
tSt = A('stakes', 'stopped', -0.2)
low(G2, tSt, A('stakes', 'turn back', 0.4), 0.7, att=0.6, rel=1.0)
terp(Bb4, tSt + 0.2, tSt + 1.3, 0.5, px(500), att=0.25, rel=0.3)
terp(A4, A('stakes', 'abort', 0.0), A('stakes', 'abort', 1.0), 0.5, px(1300), att=0.15, rel=0.3)
terp(G4, A('stakes', 'turn back', 0.0), A('stakes', 'turn back', 1.5), 0.5, px(1400), att=0.15, rel=0.9)
low(Bb2, A('built', 'MIT', -0.1), A('built', 'watch itself', 1.2), 0.7, att=0.5, rel=1.0)
terp(F4, A('built', 'watch itself', -0.2), A('built', 'watch itself', 0.6), 0.55, att=0.2, rel=0.25)
terp(Bb4, A('built', 'watch itself', 0.65), A('built', 'watch itself', 1.9), 0.55, att=0.08, rel=0.8)
terp(D5, A('restart', 'starts again', 0.0), A('restart', 'starts again', 0.75), 0.5, px(1540), att=0.1, rel=0.3)
tKp = A('restart', 'keeps the steering', 0.0)
terp(Bb4, tKp, tKp + 1.5, 0.55, px(600), att=0.15, rel=0.8); low(F3, tKp + 0.05, tKp + 1.5, 0.55, att=0.3, rel=0.8)
air(A('restart', 'drops the rest', 0.1), 0.9, 0.008, px(1300), 140, 700)
terp(G4, A('raised', 'raises the alarm', 0.0), A('raised', 'raises the alarm', 0.8), 0.45, px(960), att=0.2, rel=0.5)
decide(A('raised', 'people can decide', 0.1), 0.8, hold=1.4)
terp(F4, A('bales', 'guidance officer', 0.0), A('bales', 'guidance officer', 1.3), 0.45, px(560), att=0.4, rel=0.9)
tMe = A('meant', 'meant go on', -0.2)
low(Bb2, tMe, tMe + 2.4, 0.7, att=0.4, rel=1.0); terp(D4, tMe + 0.12, tMe + 2.1, 0.5, px(1380), att=0.3, rel=1.0)
tGo = A('go', 'the word goes up', 0.4)
decide(tGo, 0.85, hold=1.6, pan=px(840)); air(tGo + 0.2, 1.6, 0.007, px(840), 200, 1000)
for i, m in enumerate((F4, G4, A4, Bb4)):
    terp(m, G('alarm', 'four', 0.35 + 0.42 * i), G('alarm', 'four', 0.35 + 0.42 * i + (0.36 if i < 3 else 1.1)), 0.45, px(500), att=0.08, rel=0.35 if i < 3 else 0.8)
tLd = A('landed', 'lands', 0.0)
thud(tLd, 0.020, px(1180)); air(tLd + 0.05, 1.8, 0.007, px(1180), 120, 600)
low(Bb2, tLd + 0.1, tLd + 2.9, 0.75, att=0.5, rel=1.2); terp(D4, tLd + 0.25, tLd + 2.6, 0.5, px(1180), att=0.4, rel=1.2)
mark(A('kept', 'watched itself', -0.1), 0.6, px(1130))
low(Bb2, A('kept', 'people who knew', 0.0), A('kept', 'people who knew', 1.7), 0.6, att=0.4, rel=1.0)
tUn = A('uni', 'This November', -0.2)
low(G2, tUn, tUn + 2.4, 0.7, att=0.4, rel=1.0); terp(Bb3, tUn + 0.15, tUn + 2.0, 0.5, att=0.3, rel=1.0)
knock(A('uni', 'fails one night', 0.0), 0.012, px(810), 160)
tMo = A('decide', 'By morning', 0.0)
terp(D4, tMo, tMo + 0.8, 0.5, px(960), att=0.25, rel=0.3); terp(F4, tMo + 0.85, tMo + 2.0, 0.5, px(960), att=0.08, rel=0.8)
knock(tMo, 0.010, px(960), 260)
decide(A('decide', 'a person decides', 0.05), 0.8, hold=1.4)
tT = G('alarm', 'breath', 0.3)
low(Bb2, tT, E('alarm') + 0.3, 0.75, att=1.0, rel=1.4)
terp(F4, tT + 0.2, tT + 1.6, 0.6, att=0.4, rel=0.4); terp(Bb4, tT + 1.65, E('alarm') + 0.2, 0.6, att=0.1, rel=1.4)

# 2. The night the job failed: no music under the claim; the claims job on the map: one note, D; the app's new version: A, brighter,
#    and the tutors' keys; its contract still says decimal hours: B flat major, the agreement. At 22:03 the job fails: G minor, the
#    partner's low G, the lead sighing B flat to A, and a low knock. Nothing wrong reaches payroll: a small lock. Pay day's card
N = lambda lid, word, off=0: W('night', lid, word, off)
knock(N('casual', 'claim the hours', -0.25), 0.012, px(1290), 250)
terp(D5, N('job', 'the claims job', 0.1), N('job', 'the claims job', 1.3), 0.45, px(960), att=0.3, rel=0.8)
click(N('job', 'builds the hours to pay', -0.1), 0.010, px(770))
terp(A4, N('version', 'goes live', -0.1), N('version', 'goes live', 1.3), 0.45, px(270), att=0.3, rel=0.8)
keys(N('type', 'as they say them', 0.1), 3, 0.007, px(270), 0.18)
tCo = N('contract', 'still says', -0.1)
low(Bb2, tCo, tCo + 1.9, 0.6, att=0.4, rel=0.9); terp(D4, tCo + 0.12, tCo + 1.7, 0.45, px(270), att=0.3, rel=0.9)
tF = N('fails', 'the job fails', -0.1)
knock(tF + 0.05, 0.014, px(770), 150)
low(G2, tF, tF + 2.8, 0.7, att=0.3, rel=1.1)
terp(Bb3, tF + 0.15, tF + 1.2, 0.5, px(770), att=0.2, rel=0.3); terp(A4 - 12, tF + 1.25, tF + 2.6, 0.5, px(770), att=0.08, rel=1.0)
lock(N('waits', 'Nothing wrong', 0.05), 0.009, px(1440))
knock(N('noon', 'eight hundred and fifty-six', -0.1), 0.012, px(1660), 240)

# 3. Watching overnight: the platform is watching: its still note, F, over the partner's B flat. The agent's page set down. It finds the
#    failure: the mark. It traces the cause up the lineage: a breath of air rising, and a knock where the hours changed form. Three
#    things it touches: three cards set down. It proposes a fix: B flat to D. By morning, one insight in Sam's inbox: E flat major, a
#    person's turn; nothing in production changed: a small lock. The owners' names: a tap for each
Wt = lambda lid, word, off=0: W('watch', lid, word, off)
tWa = Wt('watching', 'watching', -0.2)
low(Bb2, tWa, tWa + 2.2, 0.65, att=0.5, rel=1.0); terp(F4, tWa + 0.1, tWa + 2.0, 0.5, px(960), att=0.4, rel=1.0)
knock(Wt('sam', 'Genie ZeroOps', -0.1), 0.012, px(1280), 250)
mark(Wt('detect', 'finds the failure', 0.0), 0.6, px(1100))
air(Wt('cause', 'traces the cause', 0.1), 2.6, 0.007, px(1460), 160, 800)
knock(Wt('cause', 'changed form', 0.0), 0.011, px(1460), 230)
for w_ in ('the hours for the payroll system', "payroll's export", 'casual teaching cost'):
    knock(Wt('touches', w_, 0.0), 0.010, px(1460), 250)
tFx = Wt('fix', 'proposes a fix', 0.1)
paper(tFx - 0.1, 0.009, px(1460), 0.35)
terp(Bb4, tFx, tFx + 0.5, 0.45, px(1460), att=0.15, rel=0.3); terp(D5, tFx + 0.55, tFx + 1.8, 0.45, px(1460), att=0.08, rel=0.9)
tIn = Wt('inbox', 'By morning', 0.0)
low(Eb3, tIn, tIn + 2.0, 0.6, att=0.4, rel=1.0); terp(G4, tIn + 0.12, tIn + 1.8, 0.45, px(1280), att=0.3, rel=1.0)
lock(Wt('inbox', 'nothing in production', 0.1), 0.009, px(1280))
for i, x_ in enumerate((270, 400, 1660)):
    tap(Wt('knows', 'who owns what', 0.1 + 0.35 * i), 0.007, px(x_))

# 4. A person approves: Tuesday, half past eight: B flat major, the morning. Sam checks the claims, a tap for each row; the push he
#    asks for, a click as he confirms; the pull request laid down, a tap for each test. Noor approves: a person decides. An agent
#    never approves: a small lock, and no music. The job runs again: G settling to F, and a click as each task turns green. Paid:
#    the lead's fourth rising, and pay day's card. "The platform proposes": the mark; "a person approves": a person decides
P_ = lambda lid, word, off=0: W('approve', lid, word, off)
p0 = S0('approve')
low(Bb2, p0 + 0.6, p0 + 2.8, 0.6, att=0.6, rel=1.0); terp(D4, p0 + 0.75, p0 + 2.6, 0.45, px(960), att=0.4, rel=1.0)
knock(p0 + 0.35, 0.011, px(1230), 250)
for i in range(3):
    tap(P_('checks', 'the cause against the claims', 0.05 + 0.2 * i), 0.007, px(800))
knock(P_('checks', 'push its fix', 0.0), 0.011, px(1510), 250)
click(P_('asks', 'confirms', 0.0), 0.010, px(1680))
air(P_('asks', 'confirms', 0.35), 1.2, 0.006, px(1500), 180, 900)
paper(P_('pr', 'opens a pull request', -0.15), 0.010, px(980), 0.4)
tap(P_('pr', 'its tests run', 0.6), 0.007, px(820)); tap(P_('pr', 'every change', 0.0), 0.007, px(820))
decide(P_('noor', 'Noor', 0.15), 0.85, hold=1.5, pan=px(1640))
lock(G('approve', 'never', 0.1), 0.009, px(980))
tRn = P_('runs', 'runs again', 0.0)
terp(G4, tRn, tRn + 0.6, 0.45, px(770), att=0.2, rel=0.25); terp(F4, tRn + 0.65, tRn + 1.9, 0.45, px(770), att=0.08, rel=0.9)
click(tRn + 0.5, 0.009, px(770)); click(tRn + 1.7, 0.009, px(1130))
tPd = P_('paid', 'casual staff are paid', 0.0)
knock(tPd - 0.05, 0.012, px(1210), 250)
terp(F4, tPd, tPd + 0.5, 0.45, px(1210), att=0.2, rel=0.25); terp(Bb4, tPd + 0.55, tPd + 1.9, 0.45, px(1210), att=0.08, rel=0.9)
low(D3, tPd + 0.5, tPd + 1.9, 0.5, att=0.3, rel=0.9)
knock(G('approve', 'proposes', -0.15), 0.011, px(960), 250)
mark(P_('proposes', 'proposes', -0.2), 0.6, px(800), still=0.8, up=0.7, back=1.2)
decide(P_('proposes', 'a person approves', 0.1), 0.85, hold=1.8)

# 5. The contract first: the fix mended the night, not its cause: G minor. A good change for tutors: a tap. Ingrid's pull request asks
#    to change the contract first: A, open, the decision proposed, and its card. Everyone who reads the hours knows: the gold lanes,
#    a breath of air, B flat major. Apollo 11 again: the lead's F, alone. The document between two systems laid down; 13% of the
#    computer's time: a low knock. The checklist changed and the software learned to check: a page turned, D stepping up to F
C = lambda lid, word, off=0: W('contract', lid, word, off)
tMd = C('mended', 'not its cause', -0.1)
low(G2, tMd, tMd + 2.0, 0.65, att=0.4, rel=1.0); terp(D4, tMd + 0.12, tMd + 1.8, 0.45, px(520), att=0.3, rel=1.0)
tap(C('good', 'a good one', 0.0), 0.007, px(560))
paper(C('first', 'also asks', -0.2), 0.009, px(980), 0.35)
terp(A4, C('first', 'change the contract first', 0.0), C('first', 'change the contract first', 1.3), 0.45, px(1630), att=0.3, rel=0.9)
knock(C('first', 'change the contract first', 0.0), 0.011, px(1630), 250)
tKn = C('knows', 'everyone who reads', 0.0)
air(tKn, 1.8, 0.007, px(960), 180, 900)
low(F3, tKn + 0.1, tKn + 2.0, 0.55, att=0.4, rel=1.0); terp(Bb4, tKn + 0.2, tKn + 1.9, 0.45, px(1300), att=0.3, rel=1.0)
terp(F4, C('apollo', 'On Apollo', 0.0), C('apollo', 'On Apollo', 1.9), 0.45, px(1180), att=0.5, rel=1.0)
paper(C('document', 'a document', -0.1), 0.010, px(960), 0.4)
knock(C('document', 'thirteen percent', 0.0), 0.011, px(1280), 170)
tCh = C('checklist', 'the checklist changed', 0.0)
paper(tCh - 0.1, 0.009, px(960), 0.3)
low(Bb2, tCh, tCh + 2.2, 0.6, att=0.4, rel=1.0)
terp(D4, tCh + 0.1, tCh + 0.7, 0.45, px(960), att=0.2, rel=0.25); terp(F4, C('checklist', 'the software', 0.0), C('checklist', 'the software', 1.5), 0.45, px(960), att=0.08, rel=0.9)

# 6. Don't reinvent the wheel: watching systems isn't new: the lead's F, calm, and three cards set down. What's new: the platform's
#    first hours of the work, overnight: four steps rising as the four steps light, as the four alarms did. Decide who reviews and who
#    approves: a person decides. The wheel: B flat major. Investigate, adapt, implement, iterate: a tap for each. The end card: the
#    mark over the partner's B flat, and B flat to close
Z = lambda lid, word, off=0: W('close', lid, word, off)
terp(F4, Z('old', 'Watching systems', 0.0), Z('old', 'Watching systems', 1.5), 0.4, px(960), att=0.5, rel=1.0)
for w_, x_ in (('alerts', 460), ('people on call', 950), ('blameless reviews', 1440)):
    knock(Z('old', w_, -0.1), 0.010, px(x_), 250)
tNw = Z('now', 'the first hours', 0.4)
for i, m in enumerate((F4, G4, A4, Bb4)):
    terp(m, tNw + 0.35 * i, tNw + 0.35 * i + (0.32 if i < 3 else 1.1), 0.4, px(520 + 293 * i), att=0.08, rel=0.3 if i < 3 else 0.8)
decide(Z('choose', 'decide who reviews', 0.1), 0.8, hold=1.4)
tWh = Z('wheel', 'reinvent the wheel', 0.0)
low(Bb2, tWh, tWh + 2.0, 0.6, att=0.4, rel=1.0); terp(D4, tWh + 0.12, tWh + 1.8, 0.45, px(960), att=0.3, rel=1.0)
for i, w_ in enumerate(('investigate', 'adapt', 'implement', 'iterate')):
    tap(Z('iterate', w_, 0.0), 0.007, px(560 + 270 * i))
tap(Z('iterate', 'the official docs', 0.0), 0.007, px(960))
tEn = G('close', 'breath', 0.3)
low(Bb2, tEn, E('close') + 0.2, 0.7, att=1.0, rel=1.6)
mark(tEn + 0.3, 0.6, px(960), still=1.0, up=0.8, back=1.0)
terp(Bb4, tEn + 3.2, E('close') + 0.1, 0.55, px(960), att=0.15, rel=1.4)
