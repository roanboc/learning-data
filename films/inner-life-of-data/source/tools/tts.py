import imageio_ffmpeg
from lang import *
import argparse,json,re,time,numpy as np,soundfile as sf
ap=argparse.ArgumentParser(description='Voice every narration line into build/vo/ and write the timings to src/vodur.js.')
ap.add_argument('--keep-timings',action='store_true',help='keep the committed timings, and fail if a voiced line is more than 0.05 s off them (the release workflow uses this, so the video matches the site)');A=ap.parse_args()
import pathlib,sys
sys.path.insert(0,str(next(p for p in pathlib.Path(__file__).resolve().parents if (p/'site-tools/voice_cache.py').is_file())/'site-tools'))
from voice_cache import KokoroVoice
src=NARR.read_text(encoding='utf-8');N=json.loads(src[src.index('{'):src.rindex('}')+1])
SAY=[(r'\bdbt\b','D B T'),(r'\bSQL\b','sequel'),(r'\bMCP\b','M C P'),(r'\bZerobus\b','Zero-bus'),(r'\bOpenSharing\b','Open Sharing'),(r'\bLakebase\b','Lake-base'),(r'\b9 am\b','nine A M'),(r'\b140\b','a hundred and forty')]
V={'voice':'af_heart','lang':'en-us','speed':0.95,'say':SAY} if EN else json.loads((PACK/'voice.json').read_text(encoding='utf-8'))
voice=KokoroVoice(ROOT/'models',V,__file__);dur={};t0=time.time()
for sid,sc in N.items():
    for ch in sc['vo']:
        fn=BUILD/'vo'/('%s__%s.wav'%(sid,ch['id']))
        txt=ch['text']
        for a,b in V['say']:txt=re.sub(a,b,txt)
        generated=voice.save(txt,fn)
        info=sf.info(str(fn));dur[sid+'/'+ch['id']]=round(info.frames/info.samplerate,3)
        if generated:print(sid,ch['id'],dur[sid+'/'+ch['id']],'%.0fs'%(time.time()-t0),flush=True)
if A.keep_timings:
    src=VODUR.read_text(encoding='utf-8');old=json.loads(src[src.index('{'):src.rindex('}')+1])
    off=[k for k in sorted(set(old)|set(dur)) if k not in old or k not in dur or abs(old[k]-dur[k])>0.05]
    for k in off[:20]:print('  %-20s committed %s, voiced %s'%(k,old.get(k,'-'),dur.get(k,'-')))
    if off:raise SystemExit('%d lines differ from %s: run tools/tts.py and commit the timings'%(len(off),VODUR.relative_to(ROOT)))
    print('DONE',round(sum(dur.values()),1),'s of speech; the committed timings match',flush=True)
else:
    VODUR.write_text('const VODUR='+json.dumps(dur)+';\n',encoding='utf-8');print('DONE',round(sum(dur.values()),1),'s of speech',flush=True)
