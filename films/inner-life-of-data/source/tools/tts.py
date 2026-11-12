import imageio_ffmpeg
from lang import *
import argparse,json,re,time,numpy as np,soundfile as sf
ap=argparse.ArgumentParser(description='Voice every narration line into build/vo/ and write the timings to src/vodur.js.')
ap.add_argument('--keep-timings',action='store_true',help='keep the committed timings, and fail if a voiced line is more than 0.05 s off them (the release workflow uses this, so the video matches the site)');A=ap.parse_args()
import pathlib,sys
sys.path.insert(0,str(next(p for p in pathlib.Path(__file__).resolve().parents if (p/'site-tools/voice_cache.py').is_file())/'site-tools'))
from voice_cache import KokoroVoice,sha256
import hashlib,os,subprocess,tempfile
class HostedVoice:
    """A hosted neural voice (Microsoft's, through edge-tts), for a language whose voice.json says "engine":"edge". The service
    needs a network and may change, so each line is voiced once and kept beside the narration, in src/i18n/<lang>/vo/ (a small MP3
    a line, with lines.json saying which words and settings each was made from). A rebuild, a check or the release workflow then
    decodes the kept lines: no network, and the same sound every time. Only a new or changed line is voiced again."""
    def __init__(self,settings,store):
        self.s,self.store,self.index=settings,store,store/'lines.json';store.mkdir(parents=True,exist_ok=True)
        self.lines=json.loads(self.index.read_text(encoding='utf-8')) if self.index.exists() else {}
    def key(self,text):return hashlib.sha256(json.dumps([self.s['voice'],self.s.get('rate','+0%'),text],ensure_ascii=False).encode()).hexdigest()[:20]
    def save(self,text,target):
        name,kept,key=target.stem,self.store/(target.stem+'.mp3'),self.key(text);made=False
        if self.lines.get(name)!=key or not kept.exists():
            import asyncio,certifi
            if os.environ.get('SSL_CERT_FILE'):certifi.where=lambda:os.environ['SSL_CERT_FILE']  # behind a proxy that signs with its own authority
            import edge_tts
            proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
            for attempt in range(3):
                try:asyncio.run(edge_tts.Communicate(text,self.s['voice'],rate=self.s.get('rate','+0%'),proxy=proxy).save(str(kept)));break
                except Exception:
                    if attempt==2:raise
                    time.sleep(2*(attempt+1))
            self.lines[name]=key;self.index.write_text(json.dumps(dict(sorted(self.lines.items())),indent=0)+'\n',encoding='utf-8');made=True
        if made or not target.exists():
            with tempfile.TemporaryDirectory() as tmp:
                raw=pathlib.Path(tmp)/'line.wav'
                subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-loglevel','error','-i',str(kept),'-ac','1','-ar','24000','-c:a','pcm_s16le',str(raw)],check=True)
                x,sr=sf.read(str(raw),dtype='float32');nz=np.where(np.abs(x)>0.01)[0]
                sf.write(str(target),x[max(0,nz[0]-240):nz[-1]+480] if len(nz) else x,sr)
        return made
src=NARR.read_text(encoding='utf-8');N=json.loads(src[src.index('{'):src.rindex('}')+1])
SAY=[(r'\bdbt\b','D B T'),(r'\bSQL\b','sequel'),(r'\bMCP\b','M C P'),(r'\bZerobus\b','Zero-bus'),(r'\bOpenSharing\b','Open Sharing'),(r'\bLakebase\b','Lake-base'),(r'\b9 am\b','nine A M'),(r'\b140\b','a hundred and forty')]
V={'voice':'af_heart','lang':'en-us','speed':0.95,'say':SAY} if EN else json.loads((PACK/'voice.json').read_text(encoding='utf-8'))
voice=HostedVoice(V,PACK/'vo') if V.get('engine')=='edge' else KokoroVoice(ROOT/'models',V,__file__);dur={};t0=time.time()
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
