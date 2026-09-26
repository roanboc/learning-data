import imageio_ffmpeg
from lang import *
import argparse,json,re,time,numpy as np,soundfile as sf
ap=argparse.ArgumentParser(description='Voice every narration line into build/vo/ and write the timings to src/vodur.js.')
ap.add_argument('--keep-timings',action='store_true',help='keep the committed timings, and fail if a voiced line is more than 0.05 s off them (the release workflow uses this, so the video matches the site)');A=ap.parse_args()
from kokoro_onnx import Kokoro
src=open(NARR).read();N=json.loads(src[src.index('{'):src.rindex('}')+1])
SAY=[(r'\bTCSI\b','T C S I'),(r'\b9 am\b','nine A M'),(r'\b131\b','a hundred and thirty-one'),(r'\b118\b','a hundred and eighteen'),(r'\b101\b','one oh one')]
V={'voice':'af_heart','lang':'en-us','speed':0.95,'say':SAY} if EN else json.load(open(PACK/'voice.json'))
k=Kokoro(str(MODELS/'kokoro-v1.0.onnx'),str(MODELS/'voices-v1.0.bin'));dur={};t0=time.time()
for sid,sc in N.items():
    for ch in sc['vo']:
        fn=str(BUILD/'vo'/('%s__%s.wav'%(sid,ch['id'])))
        import os
        if os.path.exists(fn):
            info=sf.info(fn);dur[sid+'/'+ch['id']]=round(info.frames/info.samplerate,3);continue
        txt=ch['text']
        for a,b in V['say']:txt=re.sub(a,b,txt)
        s,sr=k.create(txt,voice=V['voice'],speed=V['speed'],lang=V['lang'])
        nz=np.where(np.abs(s)>0.01)[0];s=s[max(0,nz[0]-240):nz[-1]+480] if len(nz) else s
        sf.write(str(BUILD/'vo'/('%s__%s.wav'%(sid,ch['id']))),s,sr);dur[sid+'/'+ch['id']]=round(len(s)/sr,3)
        print(sid,ch['id'],dur[sid+'/'+ch['id']],'%.0fs'%(time.time()-t0),flush=True)
if A.keep_timings:
    src=open(VODUR).read();old=json.loads(src[src.index('{'):src.rindex('}')+1])
    off=[k for k in sorted(set(old)|set(dur)) if k not in old or k not in dur or abs(old[k]-dur[k])>0.05]
    for k in off[:20]:print('  %-20s committed %s, voiced %s'%(k,old.get(k,'-'),dur.get(k,'-')))
    if off:raise SystemExit('%d lines differ from %s: run tools/tts.py and commit the timings'%(len(off),VODUR.relative_to(ROOT)))
    print('DONE',round(sum(dur.values()),1),'s of speech; the committed timings match',flush=True)
else:
    open(VODUR,'w').write('const VODUR='+json.dumps(dur)+';\n');print('DONE',round(sum(dur.values()),1),'s of speech',flush=True)
