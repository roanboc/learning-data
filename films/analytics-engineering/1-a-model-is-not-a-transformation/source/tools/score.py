# A model is not a transformation: the music and sounds, played by tools/audio.py with From words to data's instruments
# (shared/tools/music.py). A new palette for a new series (PLAYBOOK.md: vary the sound itself): an electric piano, a plucked
# bass and a soft brushed pulse at 88 beats a minute, in D dorian, for the workshop; a harp and strings for the 1870s.
# The series' mark is its own: four notes rising, 1-4-5-8, on the electric piano, at the title and at the end.
# Effects: paper for the prints, a stamp when version three is approved, keys when code is typed, soft pops as files and
# nodes appear, chimes for tests that pass, and a glassy shimmer where the agent works.

# when a word of a line is spoken, as the film's own kt_w() estimates it: along the line's voiced length, from the words the voice reads
import json as _json, pathlib as _pl
_obj = lambda f: (lambda s: _json.loads(s[s.index('{'):s.rindex('}') + 1]))((_pl.Path('src') / f).read_text())
_NARR, _DUR = _obj('narration.js'), _obj('vodur.js')
def W(sid, lid, word, off=0):
    ln = next(v for v in _NARR[sid]['vo'] if v['id'] == lid); s = ln.get('say') or ln['text']; i = max(0, s.find(word))
    return G(sid, lid) + _DUR[sid + '/' + lid] * i / len(s) + off

# chords (MIDI note numbers): D dorian and its neighbours
DM9 = [38, 45, 48, 52, 53]; G13 = [43, 50, 53, 57, 59]; AM7 = [45, 52, 55, 60]; CMAJ9 = [48, 55, 59, 62, 64]
BBMAJ7 = [46, 53, 57, 62]; FMAJ7 = [41, 48, 52, 57]; EM7 = [40, 47, 50, 55]; DSUS = [38, 45, 50, 55, 57]
DMAJ9 = [38, 45, 49, 52, 54]; GMAJ7 = [43, 50, 54, 59]
def mark(start, root, g=0.07):
    """the series' four notes, 1-4-5-8, rising"""
    for i, iv in enumerate([0, 5, 7, 12]):
        epiano(root + iv, start + i * 0.36, g * (1.15 if i == 3 else 1), (i - 1.5) * 0.15, sec=3.2 if i == 3 else 2.2)
def groove(s0, s1, g=1.0):
    """the workshop's pulse: a soft kick, brushes and a closed hat"""
    pulse(s0, s1, 88, [(0, kick, 0.035, 0), (1, brush, 0.02, -0.2), (1.5, hat, 0.008, 0.3), (2, kick, 0.025, 0), (3, brush, 0.022, 0.2), (3.5, hat, 0.008, -0.3)], g=g, fade=2.5)
def walk(s0, s1, roots, g=0.05):
    """a plucked bass, one root a bar, with a passing note"""
    per = 60 / 88 * 4; k = 0; t0 = s0
    while t0 < s1 - 0.3:
        r = roots[k % len(roots)]; bass(r, t0, per * 0.7, g, 0); bass(r + 7, t0 + per * 0.75, per * 0.2, g * 0.6, 0); t0 += per; k += 1

# 1. A plan is not a building: 1870s, a harp over strings in D; paper as the prints are handed out; the site in silence
prog('plan', [DMAJ9, GMAJ7, DMAJ9], 0, cq('plan', 'breath') + 1.0, g=0.045, tone='strings', bassg=0.025)
ostinato(S0('plan') + 0.6, G('plan', 'brick', 1.2), [62, 69, 66, 74, 69, 66], 0.52, harp, 0.03, -0.1)
rustle(W('plan', 'copy', 'one copy'), 0.05, 0.3); rustle(W('plan', 'copy', 'every trade'), 0.045, 0.5)
drone(38, G('plan', 'breath'), 3.2, 0.02, 'strings')
# 2. Where we left off: the present, the electric piano enters; four soft pops for the four offices; a stamp for v3
prog('recap', [DM9, G13, CMAJ9, AM7], g=0.045, tone='warm')
motif('recap', [DM9, G13, CMAJ9, AM7], every=1.4, g=0.035, inst=epiano)
for i in range(4):
    pop(G('recap', 'offices', 1.0 + i * 0.25), 0.07, -0.45 + i * 0.3)
for j, word in enumerate(['What a thing', 'What makes', 'What one row', 'when each']):
    ping(W('recap', 'four', word), 0.05, -0.4 + j * 0.27)
stamp(W('recap', 'v3', 'approved', -0.05), 0.12)
# 3. Many shapes, one model: a card for each shape; the pulse starts on "a middle way"
prog('shapes', [DM9, BBMAJ7, CMAJ9, DM9], g=0.045, tone='warm')
motif('shapes', [DM9, BBMAJ7, CMAJ9, DM9], every=1.2, g=0.032, inst=epiano)
for word in ['normalised', 'stars', 'vault', 'anchors', 'hooks', 'wide']:
    card(W('shapes', 'many', word), 0.04)
groove(W('shapes', 'middle', 'middle way'), E('shapes') + 1.0, 0.7)
# 4. Someone has to build it: the bass walks in; the data arrives unevenly; a lift when Jun steps in
prog('build', [DM9, FMAJ7, EM7, G13], g=0.045, tone='warm')
walk(S0('build') + 0.5, E('build'), [38, 41, 40, 43], 0.045); groove(S0('build'), E('build'), 0.8)
for i in range(3):
    whoosh(G('build', 'arrive', 0.3 + i * 0.35), 0.5, 0.05, -0.4 + i * 0.4)
shimmer(G('build', 'jun', 0.3), 0.03)
# 5. The building work: the workshop in full; keys as the code is typed; pops as tables appear; a chime for the test
prog('work', [DM9, G13, AM7, DM9], g=0.04, tone='warm')
walk(S0('work'), E('work'), [38, 43, 45, 38], 0.045); groove(S0('work'), E('work'), 1.0)
motif('work', [DM9, G13, AM7, DM9], every=1.6, g=0.03, inst=epiano)
for k in range(10):
    key(G('work', 'file', 0.2 + k * 0.22), 0.035, -0.3)
for k in range(8):
    key(G('work', 'order', 0.1 + k * 0.24), 0.03, -0.3)
pop(W('work', 'order', 'a table'), 0.06, 0.4); pop(W('work', 'order', 'a view'), 0.06, 0.4)
chime(W('work', 'order', 'documentation', 0.8), 0.08, 1320, 0.5)
# 6. The name that misleads: the pulse drops out; a question in the harmony; the label lifts; the title on the series' mark
prog('name', [BBMAJ7, AM7, DSUS], 0, cq('name', 'breath'), g=0.045, tone='warm')
sweep(W('name', 'step', 'The model is', -0.2), 1.2, 0.04, 600, 1800, 0.3)
prog('name', [DM9], cq('name', 'breath'), g=0.05, tone='strings', bassg=0.03)
mark(G('name', 'breath', 0.7), 62)
# 7. Three hundred models: the graph grows to a fast, quiet figure; the core glows on a warm chord; a question at the end
prog('models', [DM9, CMAJ9, G13, AM7], g=0.04, tone='warm')
ostinato(S0('models') + 0.5, G('models', 'core'), [74, 69, 72, 76, 69, 72], 0.17, pluck, 0.022, 0.2)
groove(S0('models'), G('models', 'which'), 0.8)
pad([50, 57, 62, 66], W('models', 'core', 'core', -0.2), 4.0, 0.03, 'warm')
tone(W('models', 'which', 'None'), 0.04, 587)
# 8. Where the model lives: steady and clear; keys for the YAML; a chime for each test that passes
prog('lives', [DM9, G13, CMAJ9, DM9], g=0.04, tone='warm')
walk(S0('lives'), E('lives'), [38, 43, 48, 38], 0.04); groove(S0('lives'), E('lives'), 0.8)
for k in range(10):
    key(G('lives', 'yaml', -0.1 + k * 0.16), 0.03, 0.0)
for i in range(4):
    chime(W('lives', 'check', 'the tests', 0.3 + i * 0.35), 0.06, [1175, 1319, 1480, 1568][i], -0.3 + i * 0.2)
# 9. Ten steps: a pop for each station; the agent's shimmer; a bell for "a person approves"
prog('steps', [DM9, G13, AM7, CMAJ9, DM9], g=0.04, tone='warm')
walk(S0('steps'), E('steps'), [38, 43, 45, 48], 0.04); groove(S0('steps'), E('steps'), 0.9)
for lid, word in [('s1', 'Start'), ('s1', 'Learn'), ('s1', 'Define'), ('s4', 'Name'), ('s4', 'Write the tests'), ('s4', 'Build'), ('s7', 'Validate'), ('s7', 'Review'), ('s7', 'Keep'), ('s7', 'evolve')]:
    pop(W('steps', lid, word), 0.05, 0.0)
for i in range(10):
    shimmer(G('steps', 'agent', 0.2 + (i + 0.6) * 0.44), 0.012, 2093 + i * 110)
bell(W('steps', 'agent', 'person approves', 0.1), 0.06, 587)
# 10. The series: a card for each film to come, over the groove
prog('series', [G13, AM7, BBMAJ7, CMAJ9], g=0.04, tone='warm')
walk(S0('series'), E('series'), [43, 45, 46, 48], 0.04); groove(S0('series'), E('series'), 0.9)
for lid, word in [('list1', 'question'), ('list1', 'same one'), ('list1', 'Grain'), ('list2', 'Contracts'), ('list2', 'layers'), ('list2', 'owns'), ('list2', 'agent'), ('list2', 'written')]:
    card(W('series', lid, word), 0.045)
# 11. Pull back: the harp comes back for the 1870s, the electric piano for the present; the series' mark on a D major chord
prog('end', [DMAJ9, GMAJ7], 0, cq('end', 'breath'), g=0.045, tone='strings', bassg=0.025)
ostinato(S0('end'), G('end', 'data'), [62, 69, 66, 74], 0.52, harp, 0.025, -0.3)
motif('end', [DMAJ9, GMAJ7], cq('end', 'data'), cq('end', 'breath'), every=1.0, g=0.03, inst=epiano)
pad([50, 57, 61, 64, 66], G('end', 'breath'), 6.0, 0.045, 'strings'); drone(38, G('end', 'breath'), 6.0, 0.03, 'strings')
mark(G('end', 'breath', 0.8), 62, 0.075)
