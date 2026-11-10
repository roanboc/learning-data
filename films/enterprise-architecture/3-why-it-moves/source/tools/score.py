# Why it moves: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The series' palette (PLAYBOOK.md: vary the sound itself, film to film): open strings and a low drone for 1965, darkening as the
# grid goes out, then nylon-string plucks and a soft flute over warm pads, here in D major, for the present, and the series' own
# mark, four notes rising 1-3-5-8, on the flute and the nylon string together, at the title and the end.
# The rules from In the weeds of data crafting hold:
#  - Nothing loops. The music is a bed of sustained chords that change with the chapters; nothing repeats in the background.
#  - Every sound is an event on screen, at the moment it appears. Each effect below uses the same timing as the picture in
#    src/scenes.js (the same word, and the same offset), so sound and picture stay together when the voice is re-timed.
# And everything stays low and soft: wooden knocks, paper, muffled keys, low felt notes, filtered below about 2.5 kHz.

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
def soft(m, start, g=0.04, pan=0.0):
    """a low felt note, for a moment that lands"""
    felt(m, start, g, pan)
def knock(s, g=0.05, pan=0.0):
    """a soft wooden knock, for a card or a note arriving"""
    x = tt(0.18); X(norm(filt((np.sin(2 * np.pi * 240 * x) * np.exp(-x * 38) + 0.4 * np.sin(2 * np.pi * 520 * x) * np.exp(-x * 60)).astype(np.float32), 'low', 1400)), s, g, pan)
def tap(s, g=0.03, pan=0.0):
    """a muffled key"""
    x = tt(0.06); X(norm(filt(noise(0.06), 'band', (250, 1400)) * np.exp(-x * 90)), s, g, pan)
def paper(s, g=0.04, pan=0.0, sec=0.45):
    """paper, softly: filtered noise with a swell"""
    x = tt(sec); X(filt(noise(sec), 'band', (250, 2200)) * np.sin(np.pi * x / sec) ** 2, s, g, pan)
def quill(s, n, per, g=0.012, pan=0.2):
    """a quill on parchment: short, soft scratches as a line is written"""
    for k in range(n):
        x = tt(0.09); X(filt(noise(0.09), 'band', (500, 2200)) * np.sin(np.pi * x / 0.09), s + k * per, g * (0.7 + 0.3 * ((k * 7) % 3) / 2), pan)
def press(s, g=0.1):
    """a stamp or a closing cover: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def swell(ch, s, sec=3.0, g=0.03):
    """a soft pad swell, instead of a shimmer"""
    pad(ch, s, sec, g, 'warm')

# chords (MIDI note numbers): D major and its neighbours for the present; D minor and open fifths for 1965
DMAJ9 = [38, 45, 49, 52, 54]; GMAJ9 = [43, 47, 50, 54, 57]; BM7 = [47, 54, 57, 62]; EM9 = [40, 47, 50, 55, 54]
ASUS = [45, 52, 57, 59, 64]; FSM7 = [42, 49, 52, 57]; DMAJ7 = [38, 45, 49, 54]
D5 = [38, 45, 50, 57]; DM = [38, 45, 50, 53, 57]; C5 = [36, 43, 48, 55]; G5 = [43, 50, 55, 62]; BB5 = [46, 53, 58, 65]
def mark(start, root=57, g=0.06):
    """the series' four notes, 1-3-5-8, rising: the flute, doubled by the nylon string"""
    for i, iv in enumerate([0, 4, 7, 12]):
        flute(root + iv, start + i * 0.4, 1.1 if i < 3 else 2.6, g * 0.55, (i - 1.5) * 0.12)
        nylon(root + iv, start + i * 0.4, g, (i - 1.5) * 0.15, sec=2.4 if i == 3 else 1.6)
def bed(sid, chords, a=None, b=None, g=0.04, tone='warm', bassg=0.02):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)


# 1. The night the lights went out: a drone and open strings; a knock as the relay trips; a low felt note for each city that goes
#    dark, falling; a soft note as each utility's area is outlined; a press as the rulebook closes; a knock for each tag; the grid
#    relit on a swell; the mark under the title
bed('blackout', [D5, DM, BB5, C5, D5], 0, cq('blackout', 'breath'), g=0.032, tone='strings', bassg=0.026)
knock(W('blackout', 'relay', 'switched off'), 0.04, -0.3); soft(38, W('blackout', 'relay', 'switched off', 0.1), 0.03, -0.3)
for k, m in enumerate([50, 48, 46, 45, 43, 41]):
    soft(m, W('blackout', 'spread', 'spread', k * 0.55), 0.022, -0.4 + k * 0.16)
for k in range(4):
    soft(57 + [0, 2, 4, 7][k], W('blackout', 'watched', 'its own', k * 0.2), 0.018, -0.45 + k * 0.3)
press(W('blackout', 'council', 'wrote'), 0.06)
for word in ['A shock', 'what it revealed', 'what had to become', 'a rule to hold']:
    knock(W('blackout', 'chain', word), 0.03)
swell([50, 54, 57, 62], cq('blackout', 'breath'), 3.0, 0.03)
bed('blackout', [DMAJ9], cq('blackout', 'breath') + 0.4, None, g=0.03, tone='warm', bassg=0.024)
mark(G('blackout', 'breath', 1.6), 50)
# 2. Three letters: paper as the note and each letter arrive; a key for each line read; a low note as the threads pull
bed('letters', [DMAJ9, GMAJ9, BM7, ASUS])
paper(S0('letters') + 0.3, 0.03, -0.2)
for lid, pan in [('minister', -0.5), ('regulator', 0.0), ('valley', 0.5)]:
    paper(C('letters', lid, -0.3), 0.04, pan, 0.6)
for lid, words in [('minister', ['lower bills', 'a dividend', 'net zero']), ('regulator', ['cut', 'next five']), ('valley', ['objects', 'new line'])]:
    for word in words:
        tap(W('letters', lid, word, -0.1), 0.016, 0.2)
soft(43, W('letters', 'right', 'pull'), 0.035); soft(38, W('letters', 'right', 'pull', 0.4), 0.03)
# 3. Who cares: a knock as Ama arrives; paper for each stakeholder; a nylon note as the definition lands
bed('cares', [GMAJ9, DMAJ9, EM9, ASUS])
knock(W('cares', 'ama', 'Ama', -0.3), 0.03, 0.6)
paper(C('cares', 'customers', 0.0), 0.03, -0.5, 0.3)
for k, word in enumerate(['minister', 'regulator', 'community', 'staff']):
    paper(W('cares', 'others', word, -0.2), 0.03, -0.3 + k * 0.2, 0.3)
nylon(62, W('cares', 'stakeholder', 'stakeholder'), 0.03, 0.2)
# 4. What pushes: a low, soft push for each driver as its arrow reaches the utility
bed('pushes', [DMAJ9, BM7, GMAJ9, ASUS])
for lid, word, m in [('list', 'Decarbonisation', 45), ('list', 'Affordability', 43), ('list', 'Ageing', 41), ('solar', 'rooftop solar', 38)]:
    paper(W('pushes', lid, word, -0.1), 0.028, 0.0, 0.3); soft(m, W('pushes', lid, word, 0.5), 0.03)
nylon(66, W('pushes', 'pressure', 'pressure'), 0.03, 0.2)
# 5. What it means here: paper for each assessment, a key as its source is clipped on; a stamp for the opinion
bed('means', [EM9, DMAJ9, FSM7, ASUS])
for lid, word in [('poles', 'third'), ('flow', 'built'), ('bills', 'rose')]:
    paper(W('means', lid, word, -0.3), 0.03, 0.3, 0.3); tap(W('means', lid, word, 0.2), 0.02, 0.3)
paper(W('means', 'opinion', 'Without', -0.2), 0.03, -0.5, 0.3); press(W('means', 'opinion', 'opinion'), 0.05)
# 6. What must become true: a nylon note for each goal; a softer one as each outcome lands; a stamp for the one nobody could check
bed('goals', [DMAJ9, GMAJ9, DMAJ7, ASUS])
for k, word in enumerate(['Keep bills', 'Replace', 'Connect']):
    nylon([62, 64, 66][k], W('goals', 'list', word, -0.1), 0.03, -0.4 + k * 0.4)
for lid in ['charge', 'days']:
    paper(C('goals', lid, 0.0), 0.028, 0.2, 0.3); nylon(69, C('goals', lid, 0.6), 0.022, 0.3)
press(W('goals', 'check', 'checked'), 0.05)
# 7. When goals pull apart: paper as the sketch goes up; a low strain under the tug-of-war; stillness, then a swell for "principles"
bed('collide', [BM7, EM9, FSM7], 0, cq('collide', 'breath'))
paper(S0('collide') + 0.2, 0.045, 0.0, 0.9)
for word, lid, pan in [('Connecting', 'collide', 0.5), ('costs money', 'cost', -0.5), ('through the valley', 'cost', 0.0)]:
    knock(W('collide', lid, word), 0.03, pan); soft(40, W('collide', lid, word, 0.1), 0.024, pan)
soft(38, W('collide', 'loudest', 'another way'), 0.03)
swell([50, 54, 57, 62], W('collide', 'loudest', 'principles'), 3.4, 0.03)
bed('collide', [DMAJ9], cq('collide', 'breath'), None, g=0.034)
# 8. Principles that can be tested: a knock for each principle; a stamp for the one nothing could fail; a soft tick or a low note
#    for each check; the mark's first two notes as the upgrade wins
bed('principles', [DMAJ9, GMAJ9, BM7, ASUS, DMAJ9])
for lid, word in [('have', 'Use what'), ('costed', 'Every option'), ('info', 'customer information')]:
    knock(W('principles', lid, word, -0.1), 0.032)
press(W('principles', 'sustain', 'nothing'), 0.05)
for j, res in enumerate([[-1, 1, 0], [1, 1, 0]]):
    for i, r in enumerate(res):
        s = W('principles', 'checked', 'new line', i * 0.5 + j * 0.25)
        if r > 0: tap(s, 0.022, 0.3)
        elif r < 0: soft(40, s, 0.03, -0.3)
nylon(62, W('principles', 'checked', 'Upgrading'), 0.03); nylon(66, W('principles', 'checked', 'Upgrading', 0.4), 0.03)
# 9. The chain: a knock as each link of the chain lands; a felt note as the principles span it; a soft, unresolved note for the question
bed('chain', [DMAJ9, BM7, GMAJ9, ASUS])
knock(W('chain', 'drawn', 'chain'), 0.03, -0.6)
for k, word in enumerate(['drivers', 'Assessments', 'Goals', 'outcomes']):
    knock(W('chain', 'links', word, -0.1), 0.028, -0.3 + k * 0.2)
soft(50, W('chain', 'beside', 'Principles'), 0.03); paper(C('chain', 'number', -0.2), 0.03, 0.0, 0.4)
for word in ['working day', 'Connected']:
    nylon(64, W('chain', 'what', word), 0.026, -0.3); nylon(61, W('chain', 'what', word, 0.25), 0.022, -0.3)
# 10. Checked, for now: a stamp-like thud as Ama confirms; paper as the answer and the next question go up; the mark under the end card
bed('end', [GMAJ9, DMAJ9], 0, cq('end', 'breath'))
press(W('end', 'confirms', 'confirms', 0.2), 0.05)
paper(C('end', 'answer'), 0.04, 0.4, 0.5); paper(W('end', 'next', 'what'), 0.035, 0.2, 0.4)
bed('end', [DMAJ9], cq('end', 'breath'), None, g=0.034, tone='strings', bassg=0.026)
mark(G('end', 'breath', 1.4), 50)
