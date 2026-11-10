"""Pacing report: how dense the narration is, scene by scene, so pauses can be planned rather than guessed.
Run after tts.py (it reads the voiced line lengths in src/vodur.js): python tools/pace.py, or FILM_LANG=es python tools/pace.py.
It mirrors the timeline in src/engine3.js: each scene starts after `lead`, lines follow each other with `gap` (0.3 s unless set)
and an optional `pause` before a line, and the scene ends `tail` seconds after its last line. The holds, pauses and wordless
endings in src/breath.js are added on top."""
import json
from lang import *

GAP,LEAD,TAIL=0.3,0.6,1.2
# guides for a film that flows, pausing only where it matters (see PLAYBOOK.md, "Narration, sound and pace")
MAX_WPM,MAX_VOICE,MIN_BREATH=140,0.82,1.5
load=lambda p:(lambda s:json.loads(s[s.index('{'):s.rindex('}')+1]))(open(p).read())
N,V=load(NARR),load(VODUR)
B=load(ROOT/'src/breath.js') if (ROOT/'src/breath.js').exists() else {}
rows,tot=[],{'dur':0,'words':0,'voice':0}
for sid,sc in N.items():
    b=B.get(sid,{});hold,pz=b.get('hold',{}),b.get('pause',{})
    t=sc.get('lead') or LEAD;words=voice=0;quiet=[]
    for ln in sc['vo']:
        p=ln.get('pause',0)+pz.get(ln['id'],0);t+=p;w=len(ln['text'].split());d=V.get(sid+'/'+ln['id']) or max(1.3,w/2.7)
        g=(ln['gap'] if ln.get('gap') is not None else GAP)+hold.get(ln['id'],0)
        t+=d+g;words+=w;voice+=d
        if quiet:quiet[-1]+=p
        quiet.append(g)
    tail=(sc.get('tail') or TAIL)+b.get('breathe',0);dur=t+tail;quiet[-1]+=tail
    rows.append((sid,sc['name'],dur,words,voice,max(quiet)))
    tot['dur']+=dur;tot['words']+=words;tot['voice']+=voice
print(f"{'scene':10}{'duration':>9}{'wpm':>6}{'voice':>7}{'longest quiet':>15}  notes")
for sid,name,dur,words,voice,breath in rows:
    wpm,share=words/dur*60,voice/dur;notes=[]
    if wpm>MAX_WPM:notes.append(f'dense (over {MAX_WPM} wpm)')
    if share>MAX_VOICE:notes.append(f'voice over {MAX_VOICE:.0%} of the time')
    if breath<MIN_BREATH:notes.append(f'no breather of {MIN_BREATH:.0f} s')
    print(f"{sid:10}{dur:8.1f}s{wpm:6.0f}{share:7.0%}{breath:14.1f}s  {', '.join(notes)}")
m,s=divmod(tot['dur'],60)
print(f"\ntotal {int(m)}:{s:04.1f}, {tot['words']} words, {tot['words']/tot['dur']*60:.0f} wpm, voice {tot['voice']/tot['dur']:.0%} of the time")
