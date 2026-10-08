# What it must be able to do: the music and sounds, played by tools/audio.py with From words to data's instruments (shared/tools/music.py).
# The series' palette (PLAYBOOK.md: vary the sound itself, film to film): a lute over a low drone for the Andes, the past, then
# nylon-string plucks, a soft flute and warm pads, here in G major, for the present, and the series' own mark, four notes rising
# 1-3-5-8, on the flute and the nylon string together, at the title and the end.
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
def press(s, g=0.1):
    """a stamp or a closing cover: a low thud and a knock, nothing bright"""
    thud(s, g); knock(s + 0.01, g * 0.4)
def lute_note(m, start, g=0.04, pan=0.0):
    """a lute, for the past: the Andes, and the posts the message passes"""
    lute(m, start, g, pan)
def mark(start, root=55, g=0.06):
    """the series' four notes, 1-3-5-8, rising: the flute, doubled by the nylon string"""
    for i, iv in enumerate([0, 4, 7, 12]):
        flute(root + iv, start + i * 0.4, 1.1 if i < 3 else 2.6, g * 0.55, (i - 1.5) * 0.12)
        nylon(root + iv, start + i * 0.4, g, (i - 1.5) * 0.15, sec=2.4 if i == 3 else 1.6)
def bed(sid, chords, a=None, b=None, g=0.04, tone='warm', bassg=0.02):
    """the chapter's chords, sustained, one after another"""
    prog(sid, chords, a, b, g=g, tone=tone, bassg=bassg)

# chords (MIDI note numbers): G major and its neighbours for the present; a drone for the Andes
GMAJ9 = [43, 47, 50, 54, 57]; CMAJ9 = [36, 40, 43, 47, 50]; EM7 = [40, 47, 50, 54]; DMAJ7 = [38, 45, 49, 54]
AM7 = [45, 48, 52, 55]; BM7 = [47, 54, 57, 62]; GM7 = [43, 46, 50, 54]; D5 = [38, 45, 50, 57]


# 1. The road that carried messages: a drone and a lute for the Andes; a lute note for each relay post as the message passes it;
#    the road, and a soft note as the message reaches the last post; the mark under the title
bed('road', [D5, GM7, CMAJ9, D5], 0, cq('road', 'breath'), g=0.03, tone='strings', bassg=0.024)
for k in range(5):
    lute_note([55, 57, 59, 62, 64][k], W('road', 'posts', 'relays', 0.6 + k * 0.45), 0.045, -0.5 + k * 0.25)
soft(43, W('road', 'outlasts', 'outlasts'), 0.03, 0.0)
mark(G('road', 'breath', 1.0), 55)
# 2. A note on the wall: paper for the question; a knock for each team's note, as it goes on the wall; a low note as it's said
#    that it isn't complete
bed('wall', [GMAJ9, EM7, CMAJ9, AM7])
paper(C('wall', 'note', 0.3), 0.03, 0.0, 0.5)
for k, (word, pan) in enumerate([('Network', -0.5), ('Customer', -0.2), ('Finance', 0.2), ('Regulatory', 0.5)]):
    knock(W('wall', 'teams', word, -0.2), 0.03, pan)
soft(38, W('wall', 'complete', 'isn'), 0.03, 0.0)
# 3. A team isn't a thing you can do: a press as the stamp lands on the team; a nylon note as Grace says what a team is; a knock for
#    each capability note as it is named
bed('team', [DMAJ7, GMAJ9, EM7, CMAJ9])
press(W('team', 'team', 'is a team'), 0.05)
nylon(62, W('team', 'team', 'is a team', 0.4), 0.03, 0.2)
for word, pan in [('manage outages', -0.4), ('maintain assets', 0.0), ('connect customers', 0.4)]:
    knock(W('team', 'list', word, -0.1), 0.03, pan)
# 4. What, not who: paper for the definition; a knock for the test; a tick for manage outages; a low felt note for the team's question
bed('what', [GMAJ9, AM7, DMAJ7, EM7])
paper(C('what', 'says', 0.0), 0.03, -0.3, 0.4)
knock(W('what', 'test', 'would it still'), 0.03, 0.0)
tap(W('what', 'outages', 'Manage outages'), 0.02, -0.3)
soft(43, W('what', 'outages', 'The team'), 0.03, 0.3)
# 5. Three levels: a knock as each level-1 box arrives; a soft knock per level-2 box; a knock for each level-3 step, in order
bed('levels', [GMAJ9, DMAJ7, EM7, CMAJ9, GMAJ9])
for i in range(5):
    knock(C('levels', 'top', 0.2 + i * 0.25), 0.03, -0.6 + i * 0.3)
for word, pan in [('manage outages', -0.3), ('maintain assets', 0.0)]:
    knock(W('levels', 'parts', word, -0.1), 0.026, pan)
knock(W('levels', 'connect', 'Connect customers', -0.1), 0.026, 0.4)
for word in ['a fault is found', 'a crew is sent', 'supply comes back']:
    knock(W('levels', 'depth', word, -0.2), 0.028, -0.2)
# 6. Owners: a tap for each gold tick, as a name is read; a press for the stamp on the box that has no owner
bed('owners', [CMAJ9, GMAJ9, EM7, DMAJ7])
for word, pan in [('Grace', -0.4), ('Farah', 0.0), ('Ama', 0.4)]:
    tap(W('owners', 'names', word, -0.1), 0.02, pan)
press(W('owners', 'gap', 'no owner'), 0.05)
# 7. Where it hurts: a rising felt note for the heat as each level-2 box warms; a nylon note on the hottest; paper for the target
bed('heat', [AM7, GMAJ9, CMAJ9, EM7])
for k, m in enumerate([43, 47, 50]):
    soft(m, W('heat', 'heat', 'heat map', k * 0.2), 0.026, -0.3 + k * 0.3)
nylon(57, W('heat', 'hot', 'thirty-five', -0.1), 0.028, 0.2)
paper(W('heat', 'hot', 'The outcome', -0.1), 0.028, 0.4, 0.3)
tap(W('heat', 'look', 'where to look'), 0.02, 0.0)
# 8. The spine stays: a knock as Network Operations splits; paper for the teams as they slide to their homes; a warm swell on the spine
bed('spine', [GMAJ9, EM7, CMAJ9, DMAJ7])
knock(W('spine', 'reorg', 'splits'), 0.034, 0.0)
paper(W('spine', 'move', 'The teams move', 0.4), 0.03, -0.3, 0.5)
swell_t = W('spine', 'stable', 'stable spine')
soft(50, swell_t, 0.03, 0.0)
# 9. Just enough: a low note for each faint level; a press for "stop here"; a soft, closing note for the fewer boxes
bed('depth', [GMAJ9, AM7, DMAJ7], 0, cq('depth', 'breath'))
nylon(64, W('depth', 'deeper', 'level 4'), 0.024, -0.3); nylon(60, W('depth', 'deeper', 'level 5'), 0.022, -0.3)
press(W('depth', 'declare', 'stop there'), 0.05)
soft(38, W('depth', 'fewer', 'Fewer'), 0.028, 0.0)
bed('depth', [GMAJ9], cq('depth', 'breath'), None, g=0.032)
# 10. Checked, for now: a press as Grace confirms; paper as the answer and the next question go up; the mark under the end card
bed('end', [CMAJ9, GMAJ9], 0, cq('end', 'breath'))
press(W('end', 'confirms', 'confirms', 0.2), 0.05)
paper(C('end', 'answer'), 0.04, 0.4, 0.5); paper(W('end', 'next', 'how value'), 0.035, 0.2, 0.4)
bed('end', [GMAJ9], cq('end', 'breath'), None, g=0.034, tone='strings', bassg=0.026)
mark(G('end', 'breath', 1.4), 55)
