# Hot, warm, cold: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette. The module's setup thread reserved a pyrophone for this film on 5 November 2026; on 11 November the film was split in
# two, and the pyrophone went with the seed vault to film 4, *Read often, kept close*, whose idea it carries (a tube sounds while it's
# hot, and falls silent as it cools). This film, now about data that arrives in time for the people who act on it, opens on Reuter's
# pigeons, and takes (/mnt/project-files/modern-data-basics/palettes.md):
#  - A serinette, the small bird organ of the 18th century: a barrel, pinned with a tune, opens tiny pipes one after another, and it was
#    played to teach a caged bird its song. Here it is a tune that arrives, note by note, each pinned to its moment. Short notes, each
#    a pipe's soft speech (a breath of air at its start, then an even tone) and gone; no vibrato, no trill, no held chords under the
#    voice. The tune, D 5 to D 6, low-passed so nothing sits above about 2.4 kHz.
#  - The partner: the merline, the larger bird organ made for blackbirds, an octave lower, D 4 to D 5, rounder; and its few stopped
#    pipes, D 3 to A 3, hollow, slower to speak, the ground under a turn. A second bird organ rather than a second colour, as films 1,
#    3, 4 and 6 found: every colour the site lacks belongs to another culture or sounds like one the site has. The organs the site has
#    are large and held; these are small, short and pinned, and never hold a chord under the voice.
#  - The mark: a call of three notes, D, F sharp, A, the last landing on the moment something arrives in time (the birds crossing,
#    the title, each speed's data arriving, the end card).
#  - D major for data that arrives in time, and for what got better; B minor for the problem (the train too late, the tutors paid
#    late, the stolen pay). Just intonation from D (hz()), so D, G and A major and B minor are pure; no chord holds E with F sharp and A.
#  - Three speeds, three pipes: cold is the merline's low D, warm the serinette's A, hot its high D, each sounded alone where a speed
#    is named or its data arrives.
# The rules every film keeps (AGENTS.md, Sound; the module's palettes.md):
#  - Music under the opening story, then only at a chapter's turn, under a moment on screen or in a pause without words, at most about
#    once every 10 seconds; never a bed under the voice. tools/quiet.py checks how much, how often and how loud.
#  - Nothing trembles, pulses or beats: no vibrato, no tremolo, no ostinato; every chord tuned pure. No urgent pulse: the stolen pay
#    and the tutors paid late are told calmly (film.json lists no urgent chapter).
#  - Every sound is an event on screen, at its moment: each uses the same word and offset as the picture in src/scenes.js, so sound and
#    picture stay together when the voice is re-timed. Effects one at a time, soft, below about 2.5 kHz. No sound from the opening's
#    places: no post horn, no train whistle, no birdsong, no wingbeats played as music.

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
R1 = np.random.default_rng(1850)  # this film's own randomness: the pipes' breath, the air

# ---- tuning: just intonation from D, so a chord's notes are whole-number ratios of each other and nothing beats
_JI = {0: 1, 1: 16 / 15, 2: 9 / 8, 3: 6 / 5, 4: 5 / 4, 5: 4 / 3, 6: 45 / 32, 7: 3 / 2, 8: 8 / 5, 9: 5 / 3, 10: 9 / 5, 11: 15 / 8}
KEY = (38, 73.416)  # D 2: its MIDI note and its pitch
def hz(m):
    o, pc = divmod(m - KEY[0], 12)
    return KEY[1] * 2 ** o * _JI[pc]
D3, Fs3, G3, A3, B3 = 50, 54, 55, 57, 59                                                   # the merline's stopped pipes
D4, Fs4, G4, A4, B4, Cs5 = 62, 66, 67, 69, 71, 73                                          # the merline
D5, E5, Fs5, G5, A5, B5, Cs6, D6 = 74, 76, 78, 79, 81, 83, 85, 86                          # the serinette
HOT, WARM, COLD = D6, A5, D4                                                               # three speeds, three pipes

# ---- the levels, set so the music's loud moments sit under -26.5 dB of full scale as one speaker plays the score (tools/quiet.py),
# as low as the governance films'; the merline a little under the serinette; the effects far under the music (FX scales them all)
SL, ML, GL, FX = 0.050, 0.050, 0.055, 1.4

# a room round the instrument: a small drawing room, ringing on for under a second, nothing much above 1.8 kHz. Its level is set by
# what it rings where the notes are (its gain from 100 Hz to 1.5 kHz is one), and each held note is set back to its own level (_held)
_IR = (lambda x: (R1.standard_normal(len(x)) * np.exp(-6.9 * x / 0.9)).astype(np.float32))(np.arange(int(0.9 * SR)) / SR)
_IR = filt(_IR, 'low', 1800); _IR[:int(0.015 * SR)] = 0
_IR /= np.sqrt((np.abs(np.fft.rfft(_IR.astype(np.float64), 1 << 17))[(lambda f: (f > 100) & (f < 1500))(np.fft.rfftfreq(1 << 17, 1 / SR))] ** 2).mean())
def _room(s, wet):
    return np.pad(s, (0, len(_IR) - 1)) + wet * fftconvolve(s, _IR).astype(np.float32) if wet else s
def _held(s, wet):
    """a note in the room, at its own level: the room moves a pure note's level up or down by where its reflections meet it, so
    the note is set back to the level it had before the room, measured over its body, not its start and end"""
    r = _room(s, wet)
    if not wet:
        return r
    a = min(int(0.05 * SR), len(s) // 4); b = max(a + 1, len(s) - int(0.12 * SR))
    return r * float(np.sqrt((s[a:b].astype(np.float64) ** 2).mean() / max(1e-12, (r[a:b].astype(np.float64) ** 2).mean())))

# ---- the bird organs: a small flue pipe, opened by the barrel's pin and closed when the pin passes
_rms = lambda v: float(np.sqrt((v.astype(np.float64) ** 2).mean())) + 1e-9
def _pipe(m, sec, harm, att, rel, chiff, stopped=False):
    """one pipe's note: harm, its harmonics' levels (a stopped pipe has only the odd ones); chiff, how much breath it speaks with"""
    f = hz(m); n = int((sec + rel + 0.05) * SR); x = np.arange(n) / SR
    on = np.sin(0.5 * np.pi * np.minimum(x / att, 1)) ** 2
    env = on * np.where(x > sec, np.exp(-(x - sec) * 4.6 / rel), 1.0)
    ks = [1, 3, 5] if stopped else [1, 2, 3, 4]
    s = sum(a * np.sin(2 * np.pi * k * f * x + 0.3 * i) for i, (k, a) in enumerate(zip(ks, harm))) / sum(harm)
    # the pipe's speech: a short breath of air round its note as it opens, about 14 dB under it, gone within 60 ms
    br = filt(R1.standard_normal(n).astype(np.float32), 'band', (f * 0.9, min(2300.0, f * 1.6))); br *= 0.2 * chiff / _rms(br)
    br *= np.exp(-x / 0.03)
    return filt(((s + br) * env).astype(np.float32), 'low', 2400)
def pipe(m, a, dur=0.22, g=1.0, pan=0.0, room=0.25):
    """a serinette pipe: one note of the tune, short, pinned to its moment"""
    put(_held(_pipe(m, max(0.08, dur), (1.0, 0.22, 0.08, 0.03), 0.018, 0.12, 1.0), room), a, g * SL, pan)
def merle(m, a, dur=0.35, g=1.0, pan=0.0, room=0.25):
    """a merline pipe: an octave lower, rounder"""
    put(_held(_pipe(m, max(0.1, dur), (1.0, 0.16, 0.05), 0.03, 0.18, 0.7), room), a, g * ML, pan)
def ground(m, a, b, g=1.0, pan=-0.1, room=0.3):
    """the merline's stopped pipe: hollow, slower to speak, the ground under a turn"""
    put(_held(_pipe(m, max(0.4, b - a), (1.0, 0.12, 0.03), 0.25, 0.6, 0.3, stopped=True), room), a, g * GL, pan)
def tune(notes, a, step=0.24, g=1.0, pan=0.0, last=0.5, low=False):
    """a few notes of the barrel's tune, one after another, the last held a little longer"""
    for i, m in enumerate(notes):
        (merle if low else pipe)(m, a + step * i, last if i == len(notes) - 1 else step * 0.85, g, pan)
def mark(s, g=1.0, pan=0.0):
    """the mark: D, F sharp, A, the last landing on the moment (s is when the A sounds)"""
    tune((D5, Fs5, A5), s - 0.44, 0.22, g, pan, 0.7)
def chord(lo, hi, a, b, g=1.0, pan=0.0):
    """a stopped pipe under a merline note or two, sounded together: only at a turn, never under the voice for long"""
    ground(lo, a, b, g * 0.9, pan * 0.5)
    for i, m in enumerate(hi):
        merle(m, a + 0.05 * i, max(0.3, b - a - 0.2), g * (0.8 if len(hi) > 1 else 1.0), pan)

# ---- the effects, soft and low, each where something happens on screen
def knock(s, g=0.013, pan=0.0, f=240):
    """a soft knock: a card or a window set down"""
    s_knock(s, g * FX, pan, f)
def tap(s, g=0.008, pan=0.0):
    """a muffled tap: a row lit, a tag, a key"""
    s_tap(s, g * FX, pan)
def air(s, sec=0.9, g=0.007, pan=0.0, lo=150, hi=900):
    """a breath of air: something moving across, down or up"""
    s_air(s, sec, g * FX, pan, lo, hi)
def paper(s, g=0.009, pan=0.0, sec=0.4):
    """a sheet laid down"""
    x = tt(sec); X(filt(R1.standard_normal(len(x)).astype(np.float32), 'band', (250, 1800)) * np.sin(np.pi * x / sec) ** 2, s, g * FX, pan)
def lock(s, g=0.009, pan=0.0):
    """a small lock closing: what is personal"""
    s_knock(s, g * FX, pan, 420); s_tap(s + 0.012, g * 0.6 * FX, pan)
def wings(s, g=0.006, pan=0.0):
    """a bird lifting off: one soft breath of air, rising; not a wingbeat"""
    s_air(s, 0.7, g * FX, pan, 250, 1200)

# =============================================================================================================================
# 1. The pigeon post: the opening, with music all through it.
#    April 1850: the stopped D, and Reuter's tune begins. Two telegraph lines: a few notes along each as it's drawn. 122 kilometres with
#    no wire: B minor. Traders act the same day: G to B. The train, hours after trading had begun: a knock, B minor. A price that comes
#    after you've had to decide: F sharp under A, alone. Before they acted, so the news had to cross faster: A rising to D. The birds:
#    one breath of air as they lift, and the tune rising. The slip of paper: a sheet; the telegraph sends it on: a tap. About two
#    hours, six ahead of the train: the mark, landing as they arrive. Only for a while, until the wire: G major. Fresh enough means
#    in time: D major. Until September, once a night: a tap; everyone wanted theirs live: A to B. 23 tutors paid late: a knock and
#    B minor; a thief: a small lock. Now in time for the action: the mark. The title: the stopped D, and the mark
P = lambda lid, word, off=0: W('pigeons', lid, word, off)
p0 = S0('pigeons')
ground(D3, p0 + 0.5, P('april', 'Paul Julius', 0.6), 0.8)
tune((D5, E5, Fs5), P('april', 'Paul Julius', 0.0), 0.26, 0.9, px(760), 0.6)
merle(A4, P('april', 'sells the news', 0.0), 0.9, 0.8, px(760))
tune((A5, Fs5, D5), P('lines', 'Berlin to Aachen', 0.2), 0.3, 0.8, px(1150), 0.5)
tune((D5, E5, G5), P('lines', 'Paris to Brussels', 0.2), 0.3, 0.8, px(450), 0.5)
chord(B3, (Fs4, D5), P('gap', 'no wire', 0.0), P('gap', 'no wire', 2.0), 0.7, px(665))
tune((G4, B4), P('traders', 'the same day', 0.0), 0.3, 0.8, px(960), 0.6, low=True)
knock(P('train', 'by train', 0.0), 0.012, px(665), 170)
chord(B3, (D5,), P('train', 'hours after', 0.0), P('train', 'hours after', 1.8), 0.6, px(665))
chord(Fs3, (A4,), P('useless', 'no use to you', 0.0), P('useless', 'no use to you', 1.6), 0.55, px(960))
tune((A4, D5), P('need', 'before they acted', 0.1), 0.34, 0.8, px(960), 0.7, low=True)
wings(P('birds', 'flew the prices', 0.0), 0.006, px(569))
tune((D5, E5, Fs5, A5), P('birds', 'flew the prices', 0.3), 0.22, 0.9, px(665), 0.6)
paper(P('slip', 'thin slip', 0.0), 0.009, px(1300), 0.4)
tap(P('slip', 'the telegraph sent', 0.1), 0.007, px(1150))
mark(P('hours', 'about two hours', 0.5), 1.0, px(760))
ground(B3, P('hours', 'ahead of the train', 0.0), P('hours', 'ahead of the train', 1.2), 0.5, px(665))
chord(G3, (B4, D5), P('while', 'until the wire', 0.0), P('while', 'until the wire', 2.0), 0.6, px(665))
chord(D3, (Fs4, A4), P('fresh', 'in time for', 0.0), P('fresh', 'in time for', 2.0), 0.6, px(960))
tap(P('night', 'once a night', 0.0), 0.007, px(500))
tune((A5, B5), P('night', 'wanted theirs live', 0.0), 0.3, 0.7, px(1300), 0.5)
knock(P('slow', 'twenty-three', 0.0), 0.012, px(1630), 170)
chord(B3, (D5,), P('slow', 'twenty-three', 0.05), P('slow', 'twenty-three', 1.6), 0.55, px(1630))
lock(P('slow', 'a thief', 0.1), 0.009, px(1630))
mark(P('now', 'in time for the action', 0.6), 0.9, px(960))
tT = G('pigeons', 'breath', 0.2)
ground(D3, tT, E('pigeons') + 0.3, 0.75)
mark(tT + 1.0, 0.9, px(960))

# 2. When someone acts: September, Noor: F sharp over the stopped D. Her question: a tap for its card. People would always like it
#    fresher: a tap; what they do next: a tap. Cold, warm and hot: each its own pipe, where its word is said and its band comes in. The
#    business's call: a tap. The data's contract: a sheet laid down, and A major, what's agreed
Q = lambda lid, word, off=0: W('act', lid, word, off)
chord(D3, (Fs4,), Q('noor', 'Noor', -0.1), Q('noor', 'Noor', 1.6), 0.55, px(360))
tap(Q('noor', 'when does someone act', 0.0), 0.008, px(1300))
tap(Q('watch', 'what they do next', 0.0), 0.007, px(1300))
merle(COLD, Q('cold', 'cold', 0.0), 0.9, 0.8, px(1300))
pipe(WARM, Q('warm', 'warm', 0.0), 0.8, 0.8, px(1300))
pipe(HOT, Q('hot', 'hot', 0.0), 0.7, 0.75, px(1300))
tap(Q('offer', "the business's call", 0.0), 0.007, px(1300))
paper(Q('contract', "data's contract", -0.1), 0.009, px(1300), 0.4)
chord(A3, (Cs5,), Q('contract', 'how fresh', 0.0), Q('contract', 'how fresh', 1.8), 0.55, px(1300))

# 3. Cold: Rohan in Finance each morning: G over B. Talked over once a month: a tap. A view each night at two: a knock, and the cold
#    pipe. Jun's dbt model: a sheet; tested: a tap. Most analysis should stay cold: A over the stopped D
C = lambda lid, word, off=0: W('cold', lid, word, off)
chord(G3, (B4,), C('rohan', 'Rohan', -0.1), C('rohan', 'Rohan', 1.6), 0.5, px(300))
tap(C('meeting', 'once a month', 0.0), 0.007, px(1300))
tVw = C('enough', 'each night at two', 0.0)
knock(tVw, 0.011, px(910), 250)
merle(COLD, tVw + 0.1, 1.0, 0.8, px(910))
paper(C('dbt', 'dbt model', -0.2), 0.009, px(1030), 0.4)
tap(C('dbt', 'tested', 0.2), 0.008, px(1530))
chord(D3, (A4,), C('most', 'should stay cold', 0.0), C('most', 'should stay cold', 1.8), 0.55, px(1180))

# 4. Warm: the claims app set down, approved by noon: a sheet. HR's system: a tap. Changes on Monday morning: a tap. Until September,
#    once a night: a tap. 23 tutors waited: a knock, B minor. The ERP, in 2028: the merline's G. The platform fills the gap, as the
#    pigeons did: a breath of air, and D rising to F sharp. Each change pushed as it's made: its air arriving, a tap. Every five
#    minutes: the warm pipe. This Monday, every claim approved by noon: a tap for each, and D major
M = lambda lid, word, off=0: W('warm', lid, word, off)
m0 = S0('warm')
knock(m0 + 0.4, 0.012, px(1540), 250)
paper(M('claims', 'approved by noon', 0.1), 0.009, px(1540), 0.4)
tap(M('checks', "HR's", 0.0), 0.008, px(306))
tap(M('change', 'Monday morning', 0.0), 0.007, px(500))
tap(M('night', 'once a night', 0.0), 0.007, px(500))
tTu = M('late', 'twenty-three', -0.1)
knock(tTu, 0.012, px(960), 170)
chord(B3, (D5,), tTu + 0.05, tTu + 2.0, 0.55, px(960))
merle(G4, M('why', 'twenty twenty-eight', 0.0), 0.9, 0.7, px(1300))
air(M('gap', 'as the pigeons did', 0.0), 1.0, 0.006, px(620), 250, 1100)
tune((D5, Fs5), M('gap', 'as the pigeons did', 0.2), 0.26, 0.75, px(620), 0.6)
tap(M('mix', 'Working around', 0.0), 0.007, px(960))
air(M('push', "as it's made", 0.0), 1.0, 0.007, px(616), 250, 1100)
tap(M('push', 'Zerobus', 0.1), 0.007, px(616))
pipe(WARM, M('five', 'Every five minutes', 0.0), 0.8, 0.8, px(920))
tNo = M('monday', 'every claim', 0.0)
for i in range(3):
    tap(tNo + 0.3 + 0.25 * i, 0.007, px(1540))
chord(D3, (Fs4, A4), tNo + 0.9, tNo + 2.6, 0.5, px(1540))

# 5. Hot: the action must come at once: the hot pipe. In August, passwords stolen: a knock, B minor. A stranger's account: F sharp,
#    low. No report next morning: a tap. Now each change is checked the moment it's made: the hot pipe. A rule holds that one pay: a
#    small lock. Four held: a tap; one was not. An event carries only what changed; the nightly file: a sheet. Hot needs the cold path
#    beside it: the cold pipe. Keep hot for a machine: the hot pipe, and D major
H = lambda lid, word, off=0: W('hot', lid, word, off)
pipe(HOT, H('machine', 'at once', 0.0), 0.6, 0.75, px(960))
tAu = H('august', 'stole', 0.0)
knock(tAu, 0.012, px(500), 160)
chord(B3, (D5,), tAu + 0.05, tAu + 1.8, 0.55, px(500))
ground(Fs3, H('stranger', "stranger's account", 0.0), H('stranger', "stranger's account", 1.4), 0.5, px(1300))
tap(H('report', 'next morning', 0.0), 0.007, px(1300))
pipe(HOT, H('rule', "the moment it's made", 0.0), 0.6, 0.75, px(920))
lock(H('hold', 'holds that one pay', 0.0), 0.009, px(1240))
tap(H('held', 'four changes', 0.0), 0.007, px(1480))
paper(H('only', 'the nightly file', 0.0), 0.009, px(700), 0.4)
merle(COLD, H('costs', 'the cold path', 0.0), 0.9, 0.75, px(700))
chord(D3, (A4,), H('few', 'Keep hot', 0.0), H('few', 'Keep hot', 1.8), 0.5, px(960))

# 6. In time to act: in 1851 the wire closes the gap: G major. To London: the merline's A. At the university, each kind of data in
#    time: the mark. Spending, contracts, a bank account change: the cold pipe, the warm, the hot, each as its row lights. Today,
#    2,960 paid: a card set down. Set by when someone acts: A over the stopped D. The docs: a tap for each word. Next: a card. The end
#    card: the stopped D, and the mark
Z = lambda lid, word, off=0: W('close', lid, word, off)
chord(G3, (B4, D5), Z('wire', 'the wire closed', 0.0), Z('wire', 'the wire closed', 2.0), 0.55, px(665))
merle(A4, Z('london', 'London', 0.0), 0.9, 0.7, px(91))
mark(Z('university', 'in time for', 0.5), 0.85, px(960))
merle(COLD, Z('three', 'Spending', 0.0), 0.5, 0.7, px(1300))
pipe(WARM, Z('three', 'contracts', 0.0), 0.5, 0.7, px(1300))
pipe(HOT, Z('three', 'within a second', 0.0), 0.5, 0.7, px(1300))
knock(G('close', 'today', 0.3), 0.011, px(1270), 250)
chord(D3, (A4,), G('close', 'takeaway', 0.0), G('close', 'takeaway', 2.2), 0.5, px(1270))
for i, w_ in enumerate(('investigate', 'adapt', 'implement', 'iterate')):
    tap(Z('docs', w_, 0.0), 0.007, px(960 + 180 * i))
knock(G('close', 'next', 0.2), 0.011, px(1270), 250)
tEn = G('close', 'breath', 0.3)
ground(D3, tEn, E('close') + 0.2, 0.7)
mark(tEn + 1.2, 0.85, px(960))
