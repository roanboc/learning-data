"""Pacing report: how dense the narration is, chapter by chapter: python tools/pace.py
Run after tts.py (it reads the voiced line lengths in src/vodur.js; before the first voicing, it estimates each line at 171 words a minute).
It mirrors the timeline in The Inner Life of Data's engine3.js: each chapter starts after `lead`, lines follow each other with `gap`
(0.7 s after a sentence, 0.3 s where it runs on, unless set) and an optional `pause`, and the chapter ends `tail` seconds after its last line.
The holds, pauses and wordless endings in src/breath.js are added on top. Like A Sharper Sketch, the series flows at about 125 to 135
words a minute, with a beat after every sentence and few long stops (see PLAYBOOK.md, "Narration, sound and pace")."""
import re
from lang import *

GAP, SGAP, LEAD, TAIL = 0.3, 0.7, 0.6, 1.2
MAX_WPM, MAX_VOICE, MIN_BREATH, MIN_SENT, MAX_STOP = 140, 0.82, 1.5, 0.5, 2.5
N = load_obj(NARR); V = load_obj(VODUR) if VODUR.exists() else {}
if not V:
    print('no src/vodur.js yet: line lengths are estimated at 171 words a minute\n')
B = load_obj(ROOT / 'src/breath.js') if (ROOT / 'src/breath.js').exists() else {}
ends = lambda s: re.search(r'[.?!…]["\'”’»)]*$', s.strip()) is not None
rows, tot = [], {'dur': 0, 'words': 0, 'voice': 0, 'runon': 0, 'stops': []}
for sid, sc in N.items():
    b = B.get(sid, {}); hold, pz = b.get('hold', {}), b.get('pause', {})
    t = sc.get('lead') or LEAD; words = voice = 0; quiet = []; sent = []
    for i, ln in enumerate(sc['vo']):
        p = ln.get('pause', 0) + pz.get(ln['id'], 0); t += p; w = len(ln['text'].split()); d = V.get(sid + '/' + ln['id']) or max(1.3, w / 2.85)
        last = i == len(sc['vo']) - 1
        g = (ln['gap'] if ln.get('gap') is not None else (SGAP if ends(ln['text']) and not last else GAP)) + hold.get(ln['id'], 0)
        t += d + g; words += w; voice += d
        if quiet:
            quiet[-1] += p
        quiet.append(g); sent.append(ends(ln['text']))
    tail = (sc.get('tail') or TAIL) + b.get('breathe', 0); dur = t + tail; quiet[-1] += tail
    ids = [ln['id'] for ln in sc['vo']]
    runon = sum(1 for q, e in zip(quiet[:-1], sent[:-1]) if e and q < MIN_SENT)
    stops = [(q, ids[i]) for i, q in enumerate(quiet[:-1]) if q >= MAX_STOP]
    rows.append((sid, dur, words, voice, max(quiet), runon, stops))
    tot['dur'] += dur; tot['words'] += words; tot['voice'] += voice; tot['runon'] += runon; tot['stops'] += [(q, sid + '/' + i) for q, i in stops]
print(f"{'chapter':12}{'duration':>9}{'wpm':>6}{'voice':>7}{'longest quiet':>15}  notes")
for sid, dur, words, voice, breath, runon, stops in rows:
    wpm, share = words / dur * 60, voice / dur; notes = []
    if wpm > MAX_WPM: notes.append(f'dense (over {MAX_WPM} wpm)')
    if share > MAX_VOICE: notes.append(f'voice over {MAX_VOICE:.0%} of the time')
    if breath < MIN_BREATH: notes.append(f'no breather of {MIN_BREATH:.0f} s')
    if runon: notes.append(f'{runon} sentence(s) with under {MIN_SENT} s after them')
    for q, i in stops: notes.append(f'a stop of {q:.1f} s after "{i}"')
    print(f"{sid:12}{dur:8.1f}s{wpm:6.0f}{share:7.0%}{breath:14.1f}s  {', '.join(notes)}")
m, s = divmod(tot['dur'], 60)
print(f"\ntotal {int(m)}:{s:04.1f}, {tot['words']} words, {tot['words']/tot['dur']*60:.0f} wpm, voice {tot['voice']/tot['dur']:.0%} of the time, {tot['words']/max(1,tot['voice'])*60:.0f} wpm while speaking")
print(f"sentences with under {MIN_SENT} s after them: {tot['runon']}; stops of {MAX_STOP} s or more inside chapters: {len(tot['stops'])}" + (f" (longest {max(tot['stops'])[0]:.1f} s)" if tot['stops'] else ''))
