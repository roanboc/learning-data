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
# music: this episode's own, from the series' palette. A bright C major for the committee's good news, which freezes into A minor; a quiet low pulse
# while the total rises and while Sam follows the thread; the third Tuesday and the fix resolve to a warm C major.
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
# 1. a sunny committee (C major), frozen; 2. the number and its limits (calm); 3. the night: minor, with the pulse as the total rises;
# 4. three Tuesdays: minor, lifting to C major for the third; 5. choosing the level; 6. the thread, with the pulse; 7. the fix, warm; 8. resolved
prog('open',[CA9,G6],0,cq('open','version'));prog('open',[AM9,FM7],cq('open','version'));motif('open',[CA9,G6],0,cq('open','version'),every=1.6)
prog('limits',[FM7,CA9,G6]);motif('limits',[FM7,CA9,G6],every=1.8,g=0.035)
prog('night',[AM9,FM7,DM9,EM7]);motif('night',[AM9,FM7,DM9,EM7],every=2.0,g=0.035);beat(G('night','total',0.4),S0('night')+ST['night']['dur']+2)
prog('tuesdays',[AM9,FM7],0,cq('tuesdays','error'));prog('tuesdays',[DM9,G6,CA9],cq('tuesdays','error'));motif('tuesdays',[DM9,G6,CA9],cq('tuesdays','error'),every=1.6)
prog('level',[FM7,CA9,G6,AM9]);motif('level',[FM7,CA9,G6,AM9],every=1.8,g=0.035)
prog('thread',[AM9,G6,FM7]);motif('thread',[AM9,G6,FM7],every=1.6,g=0.035);beat(S0('thread')+1.0,S0('thread')+ST['thread']['dur']-1,0.04)
prog('reload',[FM7,CA9,G6,CA9]);motif('reload',[FM7,CA9,G6,CA9],every=1.5)
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
# 1. the committee: the number, the vote, the freeze, the title
pop(G('open','number',0.3),0.1);[pop(G('open','approve',1.2+k*1.5),0.08) for k in range(3)];whoosh(G('open','version',0.2),1.2,0.08);shimmer(G('open','breath',0.1),0.06);tone(G('open','breath',0.2),0.08,440)
# 2. through the screen, the card, Leila, the bands
whoosh(S0('limits')+0.9,2.2,0.08);sweep(S0('limits')+1.2,1.8,0.03,400,1600);pop(G('limits','card',0.3),0.1);chime(G('limits','leila',0.2),0.08,988)
tick(G('limits','warn',-0.3),0.1);tick(G('limits','warn',0.1),0.1);tick(G('limits','error',0.1),0.12)
# 3. the night: the sync stalls, copies pour in, row checks pass, the needle swings into red
buzz(G('night','restart',0.4),0.08);[tick(G('night','rows',1.6+k*1.0),0.1,(k-1)*0.4) for k in range(3)];sweep(G('night','total',0.6),1.8,0.05,300,1400);buzz(G('night','red',0.2),0.12);thud(G('night','red',0.3),0.2)
# 4. three Tuesdays: the vote, the crack, the warning lost, the gate closing, the decision moved
pop(G('tuesdays','none',1.4),0.1);thud(G('tuesdays','later',0.4),0.15);ping(G('tuesdays','channel',0.2));pop(G('tuesdays','channel',3.6),0.08)
thud(G('tuesdays','error',0.6),0.2);chime(G('tuesdays','david',0.2),0.1,988);shimmer(G('tuesdays','breath',0.2),0.05)
# 5. choosing the level: a closing date, Leila reads it, the alarms fall away, the two cards
sweep(G('level','real',0.6),1.6,0.04,500,1500);ping(G('level','real',2.4));ping(G('level','real',4.2));whoosh(G('level','reads',2.4),1.0,0.06);[pop(G('level','count',0.6+k*0.45),0.08) for k in range(4)];chime(G('level','count',4.4),0.1,1175)
# 6. the thread, step by step, then the key
for k in range(3):tick(G('thread','upstream',0.8+k*1.3),0.14)
pop(G('thread','pairs',-0.2),0.1);chime(G('thread','id',0.2),0.08,988);buzz(G('thread','key',0.4),0.08)
# 7. fixed at the source, reloaded, rebuilt, compared
ping(G('reload','rosa',2.4));chime(G('reload','source',3.4),0.1,1175);whoosh(G('reload','patch',0.6),1.6,0.07);sweep(G('reload','patch',2.6),2.2,0.05,500,2000)
sweep(G('reload','rebuild',0.1),1.8,0.05,600,2400);chime(G('reload','travel',1.6),0.1,988);bell(G('reload','wednesday',0.2),0.12)
# 8. pull back: the new test stays behind, the last line, and a file that doesn't arrive
chime(G('end','behind',0.8),0.1,1318);chime(G('end','tag',0.0),0.14,1046);tick(G('end','breath',0.6),0.08);tick(G('end','breath',1.6),0.06)
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
