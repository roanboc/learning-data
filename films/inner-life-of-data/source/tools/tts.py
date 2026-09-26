import imageio_ffmpeg
from lang import *
import json,re,time,numpy as np,soundfile as sf
from kokoro_onnx import Kokoro
src=open(NARR).read();N=json.loads(src[src.index('{'):src.rindex('}')+1])
SAY=[(r'\bdbt\b','D B T'),(r'\bSQL\b','sequel'),(r'\bMCP\b','M C P'),(r'\bZerobus\b','Zero-bus'),(r'\bOpenSharing\b','Open Sharing'),(r'\bLakebase\b','Lake-base'),(r'\b9 am\b','nine A M'),(r'\b140\b','a hundred and forty')]
V={'voice':'af_heart','lang':'en-us','speed':0.95,'say':SAY} if EN else json.load(open(PACK/'voice.json'))
k=Kokoro(str(ROOT/'models/kokoro-v1.0.onnx'),str(ROOT/'models/voices-v1.0.bin'));dur={};t0=time.time()
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
open(VODUR,'w').write('const VODUR='+json.dumps(dur)+';\n');print('DONE',round(sum(dur.values()),1),'s of speech',flush=True)
