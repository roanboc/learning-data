# Declare it, then build it: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette for a new series (PLAYBOOK.md: vary the sound itself): warm pads and a mellow electric
# piano in D dorian for the present, a harp and strings for the 1870s, and the series' own mark, 1-4-5-8, at the title and the end.
# Two rules, from the first cut's review:
#  - Nothing loops. No drum pulse, walking bass, repeated figure or random notes: the music is a bed of sustained chords that
#    change with the chapters, so nothing in the background repeats or competes with the pictures.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: wooden knocks, muffled keys, soft paper, low felt notes and a thud for the stamp,
# filtered below about 2.5 kHz. No chimes, pings, shimmers, hi-hats or bright clicks.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off

# ---- soft sounds, all low-passed ----
def ep(m, start, g=0.05, pan=0.0, sec=2.8):
    """a mellow electric piano: the FM tone without the bright tine, filtered"""
    f = mf(m); x = tt(sec); idx = 1.1 * np.exp(-x * 3.5) + 0.2
    s = np.sin(2 * np.pi * f * x + idx * np.sin(2 * np.pi * f * x)) * np.exp(-x * 0.9) * np.minimum(1, x / 0.01) * (1 + 0.1 * np.sin(2 * np.pi * 4.5 * x))
    put(norm(filt(s.astype(np.float32), 'low', 2200)), start, g, pan)
def soft(m, start, g=0.04, pan=0.0):
    """a low felt note, for a moment that lands"""
    felt(m, start, g, pan)
def knock(s, g=0.05, pan=0.0):
    """a soft wooden knock, for a card or a node arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 240 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 520 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def tap(s, g=0.03, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.04, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def softbrush(start, g=0.02, pan=0.0, sec=0.26):
    x = tt(sec); X(filt(noise(sec), 'band', (300, 2400)) * np.sin(np.pi * x / sec) ** 1.5, start, g, pan)
def press(s, g=0.1):
    """a stamp: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def swell(ch, s, sec=3.0, g=0.03):
    """a soft pad swell, instead of a shimmer"""
    pad(ch, s, sec, g, 'warm')

# chords (MIDI note numbers): D dorian and its neighbours
DM9 = [38, 45, 48, 52, 53]; G13 = [43, 50, 53, 57, 59]; AM7 = [45, 52, 55, 60]; CMAJ9 = [48, 55, 59, 62, 64]
BBMAJ7 = [46, 53, 57, 62]; FMAJ7 = [41, 48, 52, 57]; EM7 = [40, 47, 50, 55]; DSUS = [38, 45, 50, 55, 57]
DMAJ9 = [38, 45, 49, 52, 54]; GMAJ7 = [43, 50, 54, 59]
def mark(start, root, g=0.07):
    """the series' four notes, 1-4-5-8, rising"""
    for i, iv in enumerate([0, 5, 7, 12]):
        ep(root + iv, start + i * 0.36, g * (1.15 if i == 3 else 1), (i - 1.5) * 0.15, sec=3.2 if i == 3 else 2.2)
def bed(sid, chords, a=None, b=None, g=0.042, tone='warm', bassg=0.022):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)
def lines(t0, n, per, g=0.022, pan=-0.3):
    """one muffled key per line of code, as each line is typed"""
    for k in range(n):
        tap(t0 + k * per, g, pan)

# 1. A plan is not a building: strings in D, one harp roll as the sheet appears; paper for each copy; a knock for each callout
bed('plan', [DMAJ9, GMAJ7, DMAJ9], 0, cq('plan', 'breath') + 1.0, tone='strings')
for k, m in enumerate([62, 66, 69, 74]):
    harp(m, S0('plan') + 0.8 + k * 0.12, 0.03, -0.2 + k * 0.12, bright=0.6)
paper(W('plan', 'copy', 'one copy', 0.6), 0.04, 0.3); paper(W('plan', 'copy', 'every trade', 0.6), 0.035, 0.5)
for word in ['every wall', 'how thick', 'what it carries']:
    knock(W('plan', 'exact', word), 0.035)
paper(G('plan', 'brick', -0.2), 0.03, 0.0, 0.8); soft(50, W('plan', 'brick', 'single brick'), 0.04)
drone(38, G('plan', 'breath'), 3.2, 0.02, 'strings')
# 2. Where we left off: the present; four knocks as the offices appear; a note as the model is written; four notes for the four questions; a low stamp for v3
bed('recap', [DM9, G13, CMAJ9, AM7])
for i in range(4):
    knock(G('recap', 'offices', 1.0 + i * 0.25), 0.045, -0.45 + i * 0.3)
soft(57, W('recap', 'agreed', 'agreed'), 0.035); ep(62, W('recap', 'agreed', 'wrote it down'), 0.035, 0.1)
for j, word in enumerate(['What a thing', 'What makes', 'What one row', 'when each']):
    soft([57, 60, 62, 64][j], W('recap', 'four', word, -0.2), 0.03, -0.4 + j * 0.27)
press(W('recap', 'v3', 'approved', 0.12), 0.09)
knock(G('recap', 'series'), 0.035, 0.5)
# 3. Many shapes, one model: a knock as each shape arrives; a swell as they fold into the middle way; a knock for each stage
bed('shapes', [DM9, BBMAJ7, CMAJ9, DM9])
for word in ['normalised', 'stars', 'vault', 'anchors', 'hooks', 'wide']:
    knock(W('shapes', 'many', word, -0.1), 0.032)
swell([50, 57, 60, 64], W('shapes', 'middle', 'middle way', 0.1), 2.5, 0.022)
for word in ['business keys', 'every version', 'one wide row']:
    knock(W('shapes', 'middle', word, 0.0), 0.035)
# 4. Someone has to build it: paper as the model turns to a blueprint; a knock for each source; a key for each row; a low note for the gap; a swell as Jun steps in
bed('build', [DM9, FMAJ7, EM7, G13])
paper(W('build', 'still', 'blueprint', -0.4), 0.035, 0.0, 0.9)
for i in range(3):
    knock(G('build', 'arrive', 0.3 + i * 0.35), 0.035, -0.4 + i * 0.2)
    tap(W('build', 'arrive', 'its own keys', -0.3 + i * 0.25), 0.022, 0.1)
soft(50, G('build', 'turn'), 0.04)
swell([50, 57, 62, 66], G('build', 'jun', -0.3), 3.0, 0.022); paper(W('build', 'jun', 'At the'), 0.025, 0.4)
# 5. The building work: a knock for each way to transform data; a note as dbt lights; one key per line as the files are typed; knocks as the tables appear; a note for the passing test
bed('work', [DM9, G13, AM7, DM9])
for word in ['notebooks', 'stored procedures', 'pipeline tools', 'dbt']:
    knock(W('work', 'tools', word, -0.1), 0.032)
soft(62, W('work', 'tools', 'dbt', 0.1), 0.03)
lines(G('work', 'file', 0.05), 6, 0.4); lines(G('work', 'order', 0.05), 5, 0.4)
soft(57, W('work', 'order', 'refer to each other'), 0.03)
knock(W('work', 'order', 'a view', -0.1), 0.04, 0.4); knock(W('work', 'order', 'a table', -0.1), 0.04, 0.4)
lines(W('work', 'order', 'tests and documentation'), 5, 0.32, 0.018, 0.4)
soft(62, W('work', 'order', 'documentation', 0.8), 0.035, 0.4)
# 6. The name that misleads: a knock as the label appears; a swell as it lifts to the blueprint; the title on the series' mark
bed('name', [BBMAJ7, AM7, DSUS], 0, cq('name', 'breath'))
knock(W('name', 'calls', 'a model', -0.2), 0.04, -0.3)
swell([50, 57, 60, 65], W('name', 'step', 'The model is', -0.3), 2.4, 0.022)
soft(57, W('name', 'apart', 'connecting'), 0.03)
bed('name', [DM9], cq('name', 'breath'), tone='strings', bassg=0.028)
mark(G('name', 'breath', 0.7), 62)
# 7. Three hundred models: a knock for each file picked out; a warm chord as the core glows; a low note for "none of them"
bed('models', [DM9, CMAJ9, G13, AM7])
for word in ['tidies', 'matches', 'stitches']:
    knock(W('models', 'steps', word, -0.2), 0.035)
pad([50, 57, 62, 66], W('models', 'core', 'core', -0.2), 4.0, 0.028, 'warm')
soft(50, W('models', 'which', 'None'), 0.045)
# 8. Where the model lives: one key per two lines of YAML; paper as the Markdown opens; a low felt note for each test that passes
bed('lives', [DM9, G13, CMAJ9, DM9])
lines(G('lives', 'yaml', -0.2), 7, 0.23, 0.02, 0.0)
paper(G('lives', 'md', -0.2), 0.03, 0.4)
for i in range(4):
    soft([57, 60, 62, 65][i], W('lives', 'check', 'the tests', 0.3 + i * 0.35), 0.032, -0.3 + i * 0.2)
# 9. Ten steps: a knock as each station lights; a soft swell while the agent goes round; two felt notes for "a person approves"
bed('steps', [DM9, G13, AM7, CMAJ9, DM9])
for lid, word in [('s1', 'Start'), ('s1', 'Learn'), ('s1', 'Define'), ('s4', 'Name'), ('s4', 'Write the tests'), ('s4', 'Build'), ('s7', 'Validate'), ('s7', 'Review'), ('s7', 'Keep'), ('s7', 'evolve')]:
    knock(W('steps', lid, word, -0.1), 0.032)
swell([50, 57, 62, 64, 69], G('steps', 'agent', -0.2), 4.6, 0.02)
soft(55, W('steps', 'agent', 'person approves', -0.4), 0.045); soft(62, W('steps', 'agent', 'person approves', -0.2), 0.032)
# 10. The series: a knock as each film's card arrives
bed('series', [G13, AM7, BBMAJ7, CMAJ9])
for lid, word in [('list1', 'question'), ('list1', 'same one'), ('list1', 'Grain'), ('list2', 'Contracts'), ('list2', 'layers'), ('list2', 'owns'), ('list2', 'agent'), ('list2', 'written')]:
    knock(W('series', lid, word, -0.2), 0.032)
# 11. Pull back: one harp roll for the 1870s, the piano for the present; the series' mark on a D major chord
bed('end', [DMAJ9, GMAJ7], 0, cq('end', 'breath'), tone='strings')
for k, m in enumerate([62, 66, 69, 74]):
    harp(m, S0('end') + 0.3 + k * 0.12, 0.028, -0.3 + k * 0.1, bright=0.6)
soft(50, W('end', 'bp', 'makes it true'), 0.035); ep(62, G('end', 'data', -0.2), 0.035, 0.3)
pad([50, 57, 61, 64, 66], G('end', 'breath'), 6.0, 0.042, 'strings'); drone(38, G('end', 'breath'), 6.0, 0.028, 'strings')
mark(G('end', 'breath', 0.8), 62, 0.075)
