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
# music: lighter and more playful than The Inner Life of Data. A bright, open C and F with added notes and quick felt-piano motifs;
# a held, suspended chord while the frame is frozen and taken apart; the pulse under time and the two ways to play; everything returns in the last chapter
FA9=[41,48,55,57,64];GS4=[43,50,55,60,62];DM11=[38,45,53,57,60,64]
prog('frame',[CA9,G6],0,cq('frame','closer'));prog('frame',[FA9,GS4],cq('frame','closer'),g=0.05);motif('frame',[CA9,G6],0,cq('frame','closer'),every=1.4)
prog('data',[FA9,CA9]);motif('data',[FA9,CA9],every=1.2,g=0.04)
prog('draw',[CA9,FA9,G6]);motif('draw',[CA9,FA9,G6],every=1.0,g=0.04)
prog('layers',[FA9,CA9,DM11,G6]);motif('layers',[FA9,CA9,DM11,G6],every=1.2,g=0.04)
prog('parts',[CA9,G6,FA9]);motif('parts',[CA9,G6,FA9],every=0.9,g=0.04)
prog('camera',[DM11,G6,CA9]);motif('camera',[DM11,G6,CA9],every=1.6,g=0.035)
prog('time',[AM9,FA9,CA9,G6]);motif('time',[AM9,FA9,CA9,G6],every=1.3,g=0.035);beat(S0('time')+1.0,S0('time')+ST['time']['dur']-1,0.035,bpm=66)
prog('play',[FA9,CA9,DM11,G6]);motif('play',[FA9,CA9,DM11,G6],every=1.4,g=0.035)
prog('again',[FA9,G6,CA9],g=0.07);motif('again',[FA9,G6,CA9],every=0.8,g=0.05)
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
# effects
def G2(sid,cid,off=0):return G(sid,cid,off)
# 1. the film stops, the camera dives to one pixel, the numbers appear, the title
tick(G('frame','stop',1.0),0.14);thud(G('frame','stop',1.0),0.1);sweep(G('frame','closer',-0.3),2.6,0.05,300,2400);shimmer(G('frame','squares',0.6),0.05)
[pop(G('frame','rgb',0.2+k*0.8),0.09) for k in range(3)];shimmer(G('frame','breath',0.2),0.06);tone(G('frame','breath',0.3),0.07,523)
# 2. zooming out, counting
whoosh(S0('data')+0.3,2.4,0.07);[tick(G('data','count',0.2+k*1.6),0.1) for k in range(2)];tick(G('data','thirty',0.3),0.1);sweep(G('data','thirty',0.3),1.4,0.03,600,1800)
# 3. each line of code draws its shape; the pixels of an edge
pop(G('draw','rect',0.4),0.1);[pop(G('draw','more',-0.1+k*0.8),0.08) for k in range(4)];[tick(G('draw','raster',0.3+k*0.12),0.05,(k-3)*0.2) for k in range(7)];shimmer(G('draw','edge',0.3),0.05);whoosh(G('draw','real',-0.2),0.9,0.06)
# 4. five sheets, pressed together, the swap, two lights, the glitch
[pop(G('layers','five',k*0.62),0.08) for k in range(5)];thud(G('layers','order',0.8),0.1);whoosh(G('layers','swap',0.0),1.0,0.06);chime(G('layers','light',0.9),0.08,988);shimmer(G('layers','lens',0.0),0.05);buzz(G('layers','glitch',2.6),0.05)
# 5. the function, ten rows, the real one, one fix everywhere
[pop(G('parts','give',0.3+k*0.75),0.07) for k in range(4)];[tick(G('parts','rows',0.3+k*0.28),0.07,(k-5)*0.12) for k in range(10)];whoosh(G('parts','really',-0.2),0.9,0.05);sweep(G('parts','same',2.6),1.0,0.05,700,2200);chime(G('parts','same',3.6),0.09,1175)
# 6. the camera's numbers, then the flight
[tick(G('camera','notlens',1.6+k*0.6),0.08) for k in range(3)];whoosh(G('camera','fly',0.4),4.0,0.09);sweep(G('camera','fly',0.6),3.6,0.03,300,1500)
# 7. the clock, dragged back and forward; the curves; the formula
whoosh(G('time','back',0.3),1.6,0.07);whoosh(G('time','back',1.9),1.8,0.07);tick(G('time','where',1.2),0.1);[pop(G('time','random',0.6+k*0.1),0.05) for k in range(10)];chime(G('time','exact',1.2),0.08,1318)
# 8. two ways to play: the live player, the frames, the sizes, the flipbook
ping(G('play','live',4.0));whoosh(G('play','video',0.2),1.0,0.05);[tick(G('play','video',1.0+k*0.35),0.05,0.5) for k in range(8)];pop(G('play','diff',0.4),0.08)
thud(G('play','sizes',0.4),0.12);pop(G('play','sizes',3.4),0.08);pop(G('play','sizes',6.0),0.06);[tick(G('play','flip',0.2+k*0.25),0.04,-0.4) for k in range(12)]
# 9. the list returns, the film plays on, the last line
[pop(G('again','list',d),0.08) for d in (0,0.75,1.5,2.35,3.4,4.4)];sweep(G('again','on',-0.3),1.4,0.05,500,2000);bell(G('again','end',0.0),0.1);chime(G('again','breath',1.0),0.1,1046)
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
