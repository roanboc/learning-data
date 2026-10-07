# Who it serves, and how it pays: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# A new palette for a new series (PLAYBOOK.md: vary the sound itself): a lute over a low drone for 1882, then nylon-string plucks
# and a soft flute over warm pads, here in E major, for the present, and the series' own mark, four notes rising 1-3-5-8, on the flute
# and the nylon string together, at the title and the end.
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

# chords (MIDI note numbers): E major and its neighbours for the present; D, open, for 1882 (A major's, kept for the canvases)
AMAJ9 = [45, 52, 56, 59, 61]; DMAJ9 = [38, 45, 49, 52, 54]; FSM7 = [42, 49, 52, 57]; EADD = [40, 47, 52, 56, 59]
BM7 = [47, 54, 57, 62]; CSM7 = [49, 56, 59, 64]; DMAJ7 = [38, 45, 49, 54]; ESUS = [40, 47, 52, 57, 59]
D5 = [38, 45, 50, 57]; DM = [38, 45, 50, 53, 57]; C5 = [36, 43, 48, 55]; G5 = [43, 50, 55, 62]
EMAJ9 = [40, 47, 51, 54, 56]; CSM9 = [37, 44, 47, 52, 51]; GSM7 = [44, 51, 54, 59]; BSUS = [47, 54, 59, 61, 64]
def mark(start, root=57, g=0.06):
    """the series' four notes, 1-3-5-8, rising: the flute, doubled by the nylon string"""
    for i, iv in enumerate([0, 4, 7, 12]):
        flute(root + iv, start + i * 0.4, 1.1 if i < 3 else 2.6, g * 0.55, (i - 1.5) * 0.12)
        nylon(root + iv, start + i * 0.4, g, (i - 1.5) * 0.15, sec=2.4 if i == 3 else 1.6)
def bed(sid, chords, a=None, b=None, g=0.04, tone='warm', bassg=0.02):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)

# 1. Light, not electricity: a drone and open strings for 1882; a lute as the street lights; soft felt notes for the gas lamp's faults;
#    a warm nylon note for the steady light; paper and a knock as the plate is weighed; a knock for each thing he knew; the mark under the title
bed('edison', [D5, G5, D5, DM], 0, cq('edison', 'breath') + 1.0, g=0.034, tone='strings', bassg=0.026)
for k, m in enumerate([50, 57, 62, 66, 69]):
    lute(m, W('edison', 'opened', 'power station', k * 0.5), 0.026, -0.4 + k * 0.2)
for word in ['hot', 'smoky', 'fires']:
    soft(45, W('edison', 'gas', word), 0.026, -0.3)
nylon(66, W('edison', 'sold', 'steady'), 0.035, 0.3); knock(W('edison', 'sold', 'priced'), 0.03)
paper(W('edison', 'sold', 'measured', -0.2), 0.03, 0.0, 0.6); knock(W('edison', 'sold', 'zinc', 1.2), 0.035, 0.2)
for word in ['who he served', 'what they were', 'how it would pay']:
    knock(W('edison', 'knew', word), 0.032)
lute(62, C('edison', 'knew', 0.2), 0.026, 0.2)
bed('edison', [EMAJ9], cq('edison', 'breath') + 0.8, None, g=0.03, tone='warm', bassg=0.024)
mark(G('edison', 'breath', 1.6), 52)
# 2. Who is it for?: paper for the note, the report and the two canvases; a soft note as the question is asked; a knock as Farah arrives
bed('recap', [EMAJ9, AMAJ9, CSM9, BSUS])
paper(S0('recap') + 0.3, 0.03, -0.3); paper(C('recap', 'report', -0.2), 0.04, 0.2, 0.6)
for k in ['safe', 'affordable', 'reliable', 'clean', 'ours']:
    tap(W('recap', 'report', k, -0.1), 0.016, 0.2)
soft(52, W('recap', 'whom', 'for whom'), 0.035); knock(W('recap', 'whom', 'Farah', -0.3), 0.03, 0.6)
paper(W('recap', 'sheets', 'each kind'), 0.035, -0.2, 0.5); paper(W('recap', 'sheets', 'each thing'), 0.035, 0.2, 0.5)
# 3. Who pays, who uses, who decides: a knock for each person; paper for each segment; a low note for the two who aren't customers
bed('segments', [AMAJ9, EMAJ9, GSM7, BSUS])
for word, pan in [('A tenant', -0.6), ('The landlord', 0.0), ('the regulator', 0.6)]:
    knock(W('segments', 'tenant', word), 0.032, pan)
for i, s in enumerate(['households', 'households in hardship', 'businesses', 'homes with solar']):
    paper(W('segments', 'names', s, -0.1), 0.03, -0.6 + i * 0.4, 0.3)
for word in ['The minister', 'the regulator']:
    soft(40, W('segments', 'others', word), 0.03)
# 4 to 6. The households' canvas: paper as it goes up; one nylon note per job, a low felt note per pain, a high nylon note per gain;
#    paper for each offer and each pain reliever, and a soft note as each one reaches its pain
bed('jobs', [EMAJ9, AMAJ9, EMAJ9])
paper(S0('jobs') + 0.2, 0.045, 0.0, 0.9)
for k, (lid, word) in enumerate([('lights', 'Keep'), ('worry', 'Not worry'), ('climate', 'their bit')]):
    nylon([59, 61, 64][k], W('jobs', lid, word, -0.1), 0.03, 0.5)
bed('pains', [CSM9, GSM7, AMAJ9])
for lid, word in [('wrong', 'too high'), ('guess', 'Bills'), ('cut', 'A power')]:
    soft(44, W('pains', lid, word, -0.2), 0.03, 0.2)
for k, (lid, word) in enumerate([('win', 'Knowing'), ('understand', 'A bill'), ('less', 'Paying')]):
    nylon([64, 66, 68][k], W('pains', lid, word, -0.1), 0.028, 0.2)
bed('offers', [AMAJ9, BSUS, EMAJ9])
for word in ['Electricity', 'A connection', 'Outage', 'A hardship']:
    paper(W('offers', 'list', word, -0.1), 0.028, -0.5, 0.25)
for lid in ['meters', 'text', 'plan']:
    paper(C('offers', lid, -0.1), 0.028, -0.2, 0.25); soft(52, C('offers', lid, 1.4), 0.026, 0.2)
# 7. Fit is a rule: a soft tick for each link that fits; a swell as the gains are created; a low note for the pain nothing relieves;
#    a knock for each choice; a stamp when the canvas fits
bed('fit', [EMAJ9, CSM9, AMAJ9, BSUS], 0, cq('fit', 'breath'))
for k in range(3):
    tap(W('fit', 'every', 'relieves', k * 0.15), 0.02, 0.2)
swell([52, 56, 59, 64], W('fit', 'every', 'Every gain'), 2.6, 0.022)
for k in range(3):
    tap(W('fit', 'every', 'Every gain', 1.4 + (k + 3) * 0.15), 0.02, 0.2)
paper(C('fit', 'solar', -0.5), 0.035, 0.5, 0.7); soft(40, W('fit', 'solar', 'waiting months'), 0.045, 0.5)
knock(W('fit', 'either', 'missing capability'), 0.03, 0.2); knock(W('fit', 'either', 'decided not'), 0.03, 0.6)
press(W('fit', 'clear', 'missing capability'), 0.05); paper(W('fit', 'clear', 'on the list'), 0.03, 0.3, 0.4)
bed('fit', [EMAJ9], cq('fit', 'breath'), None, g=0.036)
press(G('fit', 'breath', 0.2), 0.07)
# 8. How each offering pays: paper as each canvas goes up and each note lands; a key as each row of the table appears
bed('pays', [AMAJ9, CSM9, BSUS, EMAJ9])
paper(W('pays', 'each', 'how each'), 0.04, -0.4, 0.8); paper(W('pays', 'each', 'one for each', 0.3), 0.04, 0.4, 0.8)
for lid, word, pan in [('each', 'its own', -0.4), ('each', 'economics', -0.4), ('network', 'regulator allows', -0.3), ('network', 'poles, wires', -0.4), ('retail', 'Retail supply', 0.4), ('retail', 'tariffs', 0.4), ('retail', 'wholesale', 0.3)]:
    paper(W('pays', lid, word), 0.026, pan, 0.25)
for lid, off in [('network', 0.5), ('retail', 0.5), ('hardship', 0.3)]:
    tap(C('pays', lid, off), 0.022, 0.0)
nylon(64, W('pays', 'hardship', 'public value'), 0.03, 0.5)
# 9. From canvas to map: a knock as each layer lands; a nylon note as each block moves to its layer; a key for the table; a soft note for the data
bed('map', [EMAJ9, GSM7, AMAJ9, BSUS])
l0 = W('map', 'derived', 'architecture', -0.3)
for i in range(6):
    knock(l0 + (i + 0.3) / 6.5 * 1.6, 0.024, 0.3)
for k, word in enumerate(['Segments', 'Pains and gains', 'What relieves', 'Key activities']):
    nylon([59, 61, 64, 66][k], W('map', 'become', word), 0.028, -0.3 + k * 0.2)
tap(C('map', 'tables'), 0.022, 0.3); soft(52, W('map', 'later', 'what each number'), 0.028, 0.3)
# 10. An answer, for now: a stamp-like thud as Farah confirms; paper as the answer and the next question go up; the mark under the end card
bed('end', [AMAJ9, EMAJ9], 0, cq('end', 'breath'))
press(W('end', 'confirms', 'confirms', 0.2), 0.05)
paper(C('end', 'answer'), 0.04, 0.4, 0.5); paper(W('end', 'next', 'why'), 0.035, 0.0, 0.4)
bed('end', [EMAJ9], cq('end', 'breath'), None, g=0.034, tone='strings', bassg=0.026)
mark(G('end', 'breath', 1.4), 52)
