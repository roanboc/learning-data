# What it must be able to do: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The series' palette (PLAYBOOK.md: vary the sound itself, film to film): for the 1400s, a dark harp over a low drone and open fifths,
# with no borrowed Andean sound (no pan pipes: the story is told in the series' own voice); then nylon-string plucks and a soft flute
# over warm pads, here in F major, for the present, and the series' own mark, four notes rising 1-3-5-8, on the flute and the nylon
# string together, at the title and the end.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. The music is a bed of sustained chords that change with the chapters; nothing repeats in the background.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: wooden knocks, stone, paper, muffled keys, low felt notes, filtered below about 2.5 kHz.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off
def C(sid, lid, off=0):
    return G(sid, lid, off)

# ---- the series' instruments, all low-passed ----
def nylon(m, start, g=0.04, pan=0.0, sec=1.8):
    """a nylon string: a few harmonics that fade from the top, warm and short"""
    f = mf(m); x = tt(sec)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.2 * k) * (1 / k ** 1.4) * np.exp(-x * (1.2 + 1.6 * k)) for k in range(1, 8))
    put(norm(filt((s * np.minimum(1, x / 0.004)).astype(np.float32), 'low', 2200)), start, g, pan)
def dharp(m, start, g=0.04, pan=0.0):
    """a dark harp for the 1400s: the instrument library's harp, with its top taken off"""
    f = mf(m); x = tt(2.6)
    s = sum(np.sin(2 * np.pi * f * k * x + 0.3 * k) * (1 / k ** 2.2) * np.exp(-x * (0.9 + 0.8 * k * k)) for k in range(1, 8))
    put(norm(filt((s * np.minimum(1, x / 0.004)).astype(np.float32), 'low', 1800)), start, g, pan)
def soft(m, start, g=0.04, pan=0.0):
    """a low felt note, for a moment that lands"""
    felt(m, start, g, pan)
def knock(s, g=0.05, pan=0.0):
    """a soft wooden knock, for a card or a note arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 240 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 520 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def stone(s, g=0.04, pan=0.0):
    """a stone set down: a short, dull knock with a little grit"""
    x = tt(0.14); X(norm(filt((np.sin(2 * np.pi * 150 * x) * np.exp(-x * 45) + 0.3 * noise(0.14) * np.exp(-x * 70)).astype(np.float32), 'low', 1000)), s, g, pan)
def tap(s, g=0.03, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.04, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def press(s, g=0.1):
    """a stamp: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def swell(ch, s, sec=3.0, g=0.03):
    """a soft pad swell, instead of a shimmer"""
    pad(ch, s, sec, g, 'warm')

# chords (MIDI note numbers): F major and its neighbours for the present; open fifths over D for the 1400s
FMAJ9 = [41, 48, 52, 55, 57]; BBMAJ9 = [46, 50, 53, 57, 60]; DM9 = [38, 45, 48, 53, 52]; CSUS = [36, 43, 48, 50, 55]
GM7 = [43, 50, 53, 58]; AM7 = [45, 52, 55, 60]; FMAJ7 = [41, 48, 52, 57]
D5 = [38, 45, 50, 57]; A5 = [45, 52, 57, 64]; G5 = [43, 50, 55, 62]; C5 = [36, 43, 48, 55]
def mark(start, root=53, g=0.06):
    """the series' four notes, 1-3-5-8, rising: the flute, doubled by the nylon string"""
    for i, iv in enumerate([0, 4, 7, 12]):
        flute(root + iv, start + i * 0.4, 1.1 if i < 3 else 2.6, g * 0.55, (i - 1.5) * 0.12)
        nylon(root + iv, start + i * 0.4, g, (i - 1.5) * 0.15, sec=2.4 if i == 3 else 1.6)
def bed(sid, chords, a=None, b=None, g=0.04, tone='warm', bassg=0.02):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)


# 1. The runners: a drone and open fifths; a stone for each post as it appears; a dark harp note as the message passes each post,
#    rising along the road; the khipu's cords as harp notes, falling, as they hang; stones as the road is rebuilt; a swell as the
#    whole road lights; the mark under the title
R = 'runners'
tP, tR, R0, tD = W(R, 'posts', 'small post'), W(R, 'posts', 'chasqui'), W(R, 'passed', 'ran'), W(R, 'day', 'Relay')
bed(R, [D5, A5, G5, D5], 0, cq(R, 'breath'), g=0.03, tone='strings', bassg=0.026)
for i in range(5):
    stone(tP - 0.6 + i * 0.15, 0.03, -0.6 + i * 0.3)
for k, (s_, m) in enumerate([(tR - 0.1, 50), (R0 + 3.4, 53), (tD + 1.5, 57), (tD + 3.0, 60)]):
    dharp(m, s_, 0.04, -0.4 + k * 0.25); knock(s_, 0.02, -0.4 + k * 0.25)
tk = W(R, 'passed', 'knotted')
for k, m in enumerate([62, 60, 57, 55, 53]):
    dharp(m, tk + 0.1 + k * 0.26, 0.026, 0.3 + k * 0.1)
knock(W(R, 'day', 'two hundred'), 0.03)
knock(W(R, 'turn', 'Runners', 0.2), 0.028, -0.3)
for k in range(14):
    stone(W(R, 'turn', 'Roads', 0.1) + (k + 0.6) / (14 * 1.2) * 2.2, 0.018, 0.2)
swell([50, 57, 62, 64], W(R, 'lasted', 'ability'), 3.4, 0.03)
bed(R, [FMAJ9], cq(R, 'breath') + 0.4, None, g=0.03, tone='warm', bassg=0.024)
mark(G(R, 'breath', 1.6), 53)
# 2. A familiar map: paper as the note and the org chart go up; a key as each box is named; paper as each box drops to the wall;
#    a low note as the org chart is laid over the map
bed('orgchart', [FMAJ9, BBMAJ9, DM9, CSUS])
paper(S0('orgchart') + 0.3, 0.03, 0.5)
paper(W('orgchart', 'start', 'org chart', -0.2), 0.045, 0.0, 0.7)
for k, word in enumerate(['Network Operations', 'Customer Service', 'Finance', 'Technology', 'Regulatory Affairs']):
    tap(W('orgchart', 'boxes', word, -0.1), 0.018, -0.5 + k * 0.25)
for k in range(5):
    paper(W('orgchart', 'each', 'Each box', 0.4 + k * 0.25), 0.026, -0.5 + k * 0.25, 0.3)
nylon(65, W('orgchart', 'again', 'complete'), 0.022, 0.2)
soft(41, W('orgchart', 'again', 'org chart', -0.5), 0.035); soft(40, W('orgchart', 'again', 'org chart', 0.5), 0.03)
# 3. A team is who: a knock as Grace arrives; paper as the org chart changes, each time; the capabilities land on nylon notes
bed('who', [BBMAJ9, FMAJ9, GM7, CSUS])
knock(W('who', 'grace', 'Grace', -0.3), 0.03, 0.6)
tW, tN, tC = W('who', 'team', 'Two years'), W('who', 'team', 'Next year'), W('who', 'changes', 'changes')
for s_ in [tW, tN, tC, tC + 1.3, tC + 2.6, C('who', 'whoever', -0.2)]:
    paper(s_ + 0.2, 0.022, 0.0, 0.3)
for k in range(3):
    nylon([60, 64, 67][k], W('who', 'changes', 'able to do', k * 0.18), 0.026, -0.4 + k * 0.4)
knock(W('who', 'whoever', 'who does'), 0.02); knock(W('who', 'whoever', 'A capability'), 0.024)
# 4. Not how, not with what: paper for each note; a stamp for each trap; a low felt note as the capability appears under them;
#    a soft key and a nylon note as it survives each change
bed('how', [DM9, BBMAJ9, FMAJ9, CSUS])
paper(S0('how') + 0.3, 0.025, -0.5, 0.3)
paper(W('how', 'system', 'Run', -0.2), 0.03, 0.0, 0.3); press(W('how', 'system', 'with what', -0.15), 0.045)
paper(W('how', 'process', 'Dispatch', -0.2), 0.03, 0.5, 0.3); press(W('how', 'process', 'how', -0.15), 0.045)
soft(41, W('how', 'under', 'manage outages', -0.2), 0.035); nylon(65, W('how', 'under', 'manage outages'), 0.03)
for k, word in enumerate(['restructure', 'new system', 'new process']):
    tap(W('how', 'test', word, -0.1), 0.02, -0.5 + k * 0.5); nylon([60, 62, 64][k], W('how', 'test', word, 0.3), 0.022, -0.5 + k * 0.5)
# 5. Three levels: a key for each card as it lands, rising level by level; a low note as level 4 is struck out
bed('levels', [FMAJ9, DM9, BBMAJ9, CSUS, FMAJ9])
for i in range(8):
    tap(W('levels', 'one', 'Level one', 0.1 + i * 0.12), 0.014, -0.7)
for k, word in enumerate(['monitoring', 'controlling', 'managing']):
    nylon(57 + [0, 2, 4][k], W('levels', 'two', word, -0.1), 0.022, -0.1)
for k, word in enumerate(['finding', 'dispatching', 'restoring', 'keeping']):
    nylon(64 + [0, 1, 3, 5][k], W('levels', 'three', word, -0.1), 0.02, 0.3)
soft(40, W('levels', 'stop', 'nobody'), 0.03, 0.4)
# 6. An owner for each: a knock as each owner's tag goes up; a stamp for the guess
bed('owners', [BBMAJ9, FMAJ9, AM7, CSUS])
for k in range(4):
    knock(W('owners', 'grace', 'Grace', k * 0.18), 0.022, -0.6 + k * 0.4)
knock(W('owners', 'grace', 'Ama'), 0.024, 0.6)
for k in range(2):
    knock(W('owners', 'retail', 'head of retail', k * 0.2), 0.022, 0.0 + k * 0.3)
press(W('owners', 'none', 'guess', -0.15), 0.045)
nylon(65, W('owners', 'person', 'yes'), 0.024)
# 7. Where it hurts: soft notes as the cards take their colours (warm for green, lower for amber, lowest for red); paper as the goal
#    appears; a swell for where the money should go
bed('heat', [FMAJ9, DM9, GM7, CSUS, FMAJ9])
for k, i in enumerate([0, 4, 5, 6, 7]):
    tap(W('heat', 'colour', 'colour', 0.3 + i * 0.08), 0.012, -0.5 + k * 0.25)
nylon(64, W('heat', 'operate', 'green'), 0.026, -0.2); soft(45, W('heat', 'assets', 'amber'), 0.03, 0.1); soft(38, W('heat', 'connect', 'red'), 0.036, 0.5)
paper(W('heat', 'connect', 'The goal', -0.2), 0.026, 0.5, 0.3)
swell([53, 57, 60, 65], W('heat', 'money', 'money', -0.2), 3.0, 0.026)
# 8. Deep only where it hurts: paper as the other cards are set aside; a key for each ability; low notes as the wait is found;
#    paper for the street; a soft swell as the money goes to one capability
bed('deep', [DM9, BBMAJ9, GM7, FMAJ9], 0, cq('deep', 'breath'))
paper(W('deep', 'every', 'Grace opens'), 0.035, 0.0, 0.6)
for word in ['assessing', 'approving', 'installing']:
    tap(W('deep', 'three', word, -0.1), 0.018, -0.1)
nylon(64, W('deep', 'quick', 'quick'), 0.02, 0.0); soft(38, W('deep', 'quick', 'The wait'), 0.035, -0.1)
paper(W('deep', 'oneway', 'built', -0.2), 0.035, 0.5, 0.6); soft(43, W('deep', 'oneway', 'Nobody'), 0.03, 0.5)
nylon(60, W('deep', 'money', 'money'), 0.026); nylon(65, W('deep', 'money', 'money', 0.4), 0.026)
bed('deep', [FMAJ9], cq('deep', 'breath'), None, g=0.032)
# 9. The spine: a knock as each capability lands; soft notes for the goals; paper as the work below keeps changing, each time;
#    a key for the measure and the data rule; an unresolved pair of notes for the number nobody has
bed('spine', [FMAJ9, BBMAJ9, DM9, CSUS])
for k in range(4):
    knock(W('spine', 'fill', 'capabilities', 0.1 + k * 0.15), 0.024, -0.6 + k * 0.3)
for k in range(3):
    soft([53, 57, 60][k], W('spine', 'above', 'goals', -0.1 + k * 0.15), 0.022, -0.5 + k * 0.4)
tc = W('spine', 'stay', 'change')
for k in range(3):
    paper(tc + 1.5 * (k + 1) - 0.5, 0.016, -0.3 + k * 0.3, 0.25)
swell([53, 57, 60, 64], W('spine', 'stay', 'spine', -0.1), 3.0, 0.024)
tap(W('spine', 'data', 'measure'), 0.02, -0.3); tap(W('spine', 'data', 'data rule'), 0.02, 0.3)
nylon(64, W('spine', 'street', 'how much', -0.1), 0.024, 0.2); nylon(62, W('spine', 'street', 'how much', 0.15), 0.02, 0.2)
# 10. Confirmed, for now: a soft thud as each owner confirms; paper as the answer and the next question go up; the mark under the end card
bed('end', [BBMAJ9, FMAJ9], 0, cq('end', 'breath'))
press(W('end', 'confirms', 'confirms', 0.2), 0.04); knock(W('end', 'confirms', 'Ama'), 0.024); knock(W('end', 'confirms', 'head of retail'), 0.024)
soft(43, W('end', 'draft', 'draft'), 0.026)
paper(C('end', 'answer'), 0.04, 0.4, 0.5); paper(W('end', 'next', 'power cut'), 0.035, 0.2, 0.4)
bed('end', [FMAJ9], cq('end', 'breath'), None, g=0.034, tone='strings', bassg=0.026)
mark(G('end', 'breath', 1.4), 53)
