import imageio_ffmpeg
from lang import *
import json,numpy as np,soundfile as sf,subprocess
from scipy.signal import resample_poly
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=["--allow-file-access-from-files"]);pg=b.new_page();pg.goto((DIST/'render.html').as_uri());pg.wait_for_function("window.__READY__===true",timeout=90000);info=pg.evaluate("filmInfo()");b.close()
json.dump(info,open(BUILD/'timeline.json','w'))
SR=44100;TOT=info['total'];n=int(TOT*SR)+SR;ST={s['id']:s for s in info['scenes']}
def G(sid,cid,off=0):return ST[sid]['start']+ST[sid]['cues'][cid]+off
vo=np.zeros(n,np.float32)
for c in info['caps']:
    x,sr=sf.read(str(BUILD/'vo'/('%s__%s.wav'%(c['sid'],c['id']))),dtype='float32');x=resample_poly(x,147,80).astype(np.float32);i=int(c['s']*SR);vo[i:i+len(x)]+=x[:n-i]
ML=np.zeros(n,np.float32);MR=np.zeros(n,np.float32);XL=np.zeros(n,np.float32);XR=np.zeros(n,np.float32)
def tt(sec):return np.arange(int(sec*SR),dtype=np.float32)/SR
def put(L,R,sig,start,g=1.0,pan=0.0):
    # a sound that starts before 0:00 is trimmed, not skipped, so the opening chapter has its music
    i=int(start*SR)
    if i<0:sig=sig[-i:];i=0
    j=min(n,i+len(sig))
    if j<=i:return
    s=sig[:j-i]*g;L[i:j]+=s*np.float32(np.sqrt(0.5*(1-pan)));R[i:j]+=s*np.float32(np.sqrt(0.5*(1+pan)))
def env(sec,a,r):m=int(sec*SR);e=np.ones(m,np.float32);ai,ri=max(1,int(a*SR)),max(1,int(r*SR));e[:ai]=np.linspace(0,1,ai);e[m-ri:]*=np.linspace(1,0,ri);return e
mf=lambda m:440*2**((m-69)/12)
# music: this episode's own. Soft pads and a sparse felt piano in A minor while something is wrong, with a quiet low pulse while Sam
# investigates, then a warm C major from the fix onwards: the first film's palette, in a minor key, resolving at the contract.
def pad(ch,start,sec,g=0.04):
    x=tt(sec);e=env(sec,2.5,3.0);sw=1+0.08*np.sin(2*np.pi*0.07*x)
    for pan,det in((-0.8,0.997),(0.8,1.003),(0.0,1.0)):
        s=np.zeros_like(x)
        for m in ch:
            f=mf(m)*det
            s+=(np.sin(2*np.pi*f*x+m)+0.18*np.sin(4*np.pi*f*x+m)).astype(np.float32)
        put(ML,MR,s*e*sw/len(ch),start,g*(0.7 if pan==0 else 1),pan)
def felt(m,start,g=0.05,pan=0.0):
    x=tt(3.2);f=mf(m);a=np.minimum(1,x/0.008)
    s=sum(np.sin(2*np.pi*f*k*x)*np.exp(-x*(1.1+0.9*k))*w for k,w in((1,1),(2,0.35),(3,0.12),(4,0.05)))
    put(ML,MR,(s*a).astype(np.float32),start,g,pan)
def drone(m,start,sec,g=0.025):x=tt(sec);put(ML,MR,(np.sin(2*np.pi*mf(m)*x)*env(sec,3,3)).astype(np.float32),start,g,0)
AM9=[45,52,55,59,62];FM7=[41,48,52,57,60];CA9=[48,55,59,62,64];G6=[43,50,55,59,64];DM9=[38,45,53,57,64];EM7=[40,47,50,55,59]
def prog(sid,chords,a=None,b=None,g=0.06):
    # each chord starts 2 s early and lasts 4 s longer, so chords and chapters overlap and the bed never drops out
    s0=ST[sid]['start']+(a or 0);s1=ST[sid]['start']+(b if b is not None else ST[sid]['dur']);d=(s1-s0)/len(chords)
    for i,ch in enumerate(chords):pad(ch,s0+i*d-2.0,d+4.0,g);drone(ch[0]-12,s0+i*d-2.0,d+4.0,0.035)
mrng=np.random.default_rng(11)
def motif(sid,chords,a=None,b=None,every=1.5,g=0.045):
    # sparse notes from each chord, an octave up, drifting across the stereo field
    s0=ST[sid]['start']+(a or 0);s1=ST[sid]['start']+(b if b is not None else ST[sid]['dur']);d=(s1-s0)/len(chords);t0=s0+0.4
    while t0<s1-0.5:
        ch=chords[min(len(chords)-1,int((t0-s0)/d))];m=ch[int(mrng.integers(1,len(ch)))]+12+(12 if mrng.random()<0.25 else 0)
        felt(m,t0,g*(0.8+0.4*mrng.random()),float(mrng.uniform(-0.6,0.6)));t0+=every*(0.75+0.5*mrng.random())
def beat(s0,s1,g=0.05,bpm=58):
    # a quiet low pulse, like a slow heartbeat, that fades in and out rather than stopping dead
    per=60/bpm;k=0;t0=s0
    while t0<s1:
        f=min(1,(t0-s0)/3,(s1-t0)/3);x=tt(0.5);s=np.sin(2*np.pi*55*x*(1-0.3*x))*np.exp(-x*9)
        put(ML,MR,s.astype(np.float32),t0,g*f,0);put(ML,MR,(s*0.6).astype(np.float32),t0+0.28,g*f*0.7,0);t0+=per
cq=lambda sid,cid:ST[sid]['cues'][cid]
S0=lambda sid:ST[sid]['start']
prog('banner',[AM9,FM7]);motif('banner',[AM9,FM7],every=1.8)
prog('night',[AM9,FM7,DM9,EM7]);motif('night',[AM9,FM7,DM9,EM7],every=2.0,g=0.035);beat(G('night','unknown',0.5),S0('night')+ST['night']['dur']+2)
prog('sam',[FM7,AM9]);motif('sam',[FM7,AM9],every=1.7)
prog('thread',[AM9,G6,FM7]);motif('thread',[AM9,G6,FM7],every=1.6,g=0.035);beat(S0('thread')+1.5,S0('bronze')+ST['bronze']['dur']-1,0.04)
prog('bronze',[DM9,EM7]);motif('bronze',[DM9,EM7],every=1.8)
prog('halves',[FM7,AM9],0,cq('halves','weeks'));prog('halves',[DM9,EM7,FM7],cq('halves','weeks'),cq('halves','knew'),0.05);prog('halves',[FM7,G6,CA9],cq('halves','knew'))
motif('halves',[FM7,AM9],0,cq('halves','weeks'),every=1.8);motif('halves',[FM7,G6,CA9],cq('halves','knew'),every=1.6)
prog('fix',[CA9,G6]);motif('fix',[CA9,G6],every=1.4)
prog('recover',[FM7,CA9,G6,CA9]);motif('recover',[FM7,CA9,G6,CA9],every=1.5)
prog('contract',[CA9,FM7,AM9,G6]);motif('contract',[CA9,FM7,AM9,G6],every=1.4,g=0.05)
prog('later',[CA9,G6,FM7]);motif('later',[CA9,G6,FM7],every=1.6)
prog('end',[FM7,CA9],g=0.07);motif('end',[FM7,CA9],every=1.3,g=0.05)
rng=np.random.default_rng(3)
def X(sig,start,g=0.3,pan=0.0):put(XL,XR,sig.astype(np.float32),start,g,pan)
def tick(s,g=0.18,pan=0):x=tt(0.05);X(np.sin(2*np.pi*2400*x)*np.exp(-x*90),s,g,pan)
def thud(s,g=0.4):x=tt(0.5);X(np.sin(2*np.pi*70*x)*np.exp(-x*9)+0.2*rng.standard_normal(len(x))*np.exp(-x*30),s,g)
def sweep(s,sec=1.0,g=0.08,f0=500,f1=3000,pan=0.3):x=tt(sec);ph=2*np.pi*np.cumsum(f0+(f1-f0)*(x/sec))/SR;X(np.sin(ph)*np.sin(np.pi*x/sec),s,g,pan)
def whoosh(s,sec=0.9,g=0.12):x=tt(sec);nz=np.convolve(rng.standard_normal(len(x)),np.ones(60)/60,'same');X(nz*np.sin(np.pi*x/sec)**2*4,s,g)
def chime(s,g=0.16,f=880):x=tt(2.0);X(sum(np.sin(2*np.pi*f*r*x)*np.exp(-x/d)*a for r,d,a in[(1,1.6,1),(2.76,1.0,0.5),(5.4,0.6,0.3),(8.93,0.35,0.15)]),s,g)
def shimmer(s,g=0.05):x=tt(3.0);X((np.sin(2*np.pi*1760*x)+0.6*np.sin(2*np.pi*2640*x))*np.minimum(1,x/0.5)*np.exp(-x*0.9),s,g)
def bell(s,g=0.18):x=tt(4.0);X(sum(np.sin(2*np.pi*523*r*x)*np.exp(-x/d)*a for r,d,a in[(0.5,3.5,0.6),(1,3.0,1),(1.19,2.2,0.5),(1.56,1.8,0.4),(2.0,1.5,0.35),(2.74,1.0,0.25),(3.0,0.8,0.2)]),s,g)
def buzz(s,g=0.12):x=tt(0.35);X(np.sign(np.sin(2*np.pi*110*x))*np.exp(-x*6)*0.6+np.sin(2*np.pi*220*x)*np.exp(-x*8)*0.4,s,g)
def tone(s,g=0.24,f=660):x=tt(3.2);X((np.sin(2*np.pi*f*x)+0.2*np.sin(4*np.pi*f*x))*np.minimum(1,x/0.3)*np.exp(-x*0.8),s,g)
def pop(s,g=0.14):x=tt(0.12);X(np.sin(2*np.pi*(900+2000*x)*x)*np.exp(-x*30),s,g)
def ping(s,g=0.1):chime(s,g,1318)          # a message arriving
# 1. the banner, and Ana's message
pop(G('banner','note',0.2),0.1);ping(G('banner','asks',0.9));shimmer(G('banner','breath',0.1),0.06);tone(G('banner','breath',0.2),0.08,440)
# 2. the night: tests pass, one fails, the build stops, the alert waits
[tick(G('night','test',0.6+k*0.6),0.08,(k%3-1)*0.4) for k in range(5)];buzz(G('night','unknown',0.4),0.1);thud(G('night','stops',0.8),0.2);chime(G('night','alert',0.2),0.08,660)
# 3. Sam's reply
ping(G('sam','reply',0.6))
# 4. through the screen, then one step at a time along the lineage
whoosh(S0('thread')+0.9,2.2,0.08);sweep(S0('thread')+1.2,1.8,0.03,400,1600)
for s,off in(('steps',0.3),('steps',3.0),('staging',0.2)):tick(G('thread',s,off),0.14)
buzz(G('thread','staging',1.6),0.06)
# 5. bronze
pop(G('bronze','arrived',0.6),0.1);shimmer(G('bronze','new',0.5),0.05)
# 6. two halves: messages and a call, the flashback's two paths, the paths meeting, the decision and the sketch
ping(G('halves','ask',1.0));ping(G('halves','ben',0.2));chime(G('halves','mei',0.2),0.08,988)
whoosh(G('halves','weeks',-0.4),1.4,0.07);sweep(G('halves','notices',-0.2),2.2,0.04,600,1500,-0.4);sweep(G('halves','notices',1.6),2.2,0.04,600,1500,0.4)
tone(G('halves','knew',0.3),0.08,494);tone(G('halves','knew',1.5),0.08,659);chime(G('halves','decides',0.3),0.1,1046);shimmer(G('halves','sketch',0.9),0.06)
# 7. the fix
pop(G('fix','small',1.4),0.12);chime(G('fix','review',0.2),0.1,1175);[tick(G('fix','review',2.4+k*0.5),0.1) for k in range(3)]
# 8. recover
sweep(G('recover','rerun',0.2),2.0,0.05,500,2000);tone(G('recover','would',1.8),0.08,330);chime(G('recover','versions',0.4),0.1,988);bell(G('recover','confirm',0.2),0.12)
# 9. the contract: the four arrive, two paths become one card, four owners sign, and it's checked all the time
[pop(G('contract','meet',0)-ST['contract']['cues']['meet']+0.3+k*0.35,0.08) for k in range(4)]
sweep(G('contract','agree',-0.2),1.8,0.05,600,2400);[pop(G('contract','owners',0.4+k*0.5),0.1) for k in range(4)];chime(G('contract','checks',0.2),0.1,1318)
# 10. three weeks later
tick(G('later','weeks',0.6),0.1);buzz(G('later','amber',0.4),0.06);chime(G('later','define',3.4),0.12,1175);bell(G('later','monday',0.2),0.1)
# 11. pull back
shimmer(S0('end')+0.5,0.05);chime(G('end','tag',0.0),0.14,1046);tick(G('end','breath',1.2),0.08)
# the music sits low under the voice (0.42) and lifts about 4 dB when the voice rests (0.67). It goes down in 0.4 s, just before a line,
# and comes back up over 1.2 s, starting 0.9 s after the line, so short pauses keep it down instead of making it pump
t=np.arange(n,dtype=np.float32)/SR;CR=100;DK,LF=0.42,0.67;tg=np.full(int(TOT*CR)+CR,LF,np.float32)
for c in info['caps']:tg[int(max(0,c['s']-0.45)*CR):int((c['e']+0.9)*CR)]=DK
dk=np.empty_like(tg);v=LF
for i,x in enumerate(tg):v=max(x,v-(LF-DK)/(0.4*CR)) if x<v else min(x,v+(LF-DK)/(1.2*CR));dk[i]=v
duck=np.interp(t,np.arange(len(dk),dtype=np.float32)/CR,dk).astype(np.float32)
fade=(np.clip((TOT-t)/3.5,0,1)*np.clip(t/1.5,0,1)).astype(np.float32)
L=vo*0.95+(ML*0.87*duck+XL*0.6)*fade;R=vo*0.95+(MR*0.87*duck+XR*0.6)*fade
pk=max(np.abs(L).max(),np.abs(R).max());L/=pk/0.9;R/=pk/0.9
sf.write(str(BUILD/'mix.wav'),np.stack([L,R],1),SR,subtype='PCM_16')
FF=imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([FF,'-y','-loglevel','error','-i',str(BUILD/'mix.wav'),'-af','loudnorm=I=-16:TP=-1.5:LRA=11','-ar','44100','-c:a','libmp3lame','-b:a','112k',str(DIST/'soundtrack.mp3')],check=True)
print('total %.1fs, vo peak ok, mix written'%TOT)
