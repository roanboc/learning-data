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
    i=int(start*SR);j=min(n,i+len(sig))
    if j<=i or i<0:return
    s=sig[:j-i]*g;L[i:j]+=s*np.float32(np.sqrt(0.5*(1-pan)));R[i:j]+=s*np.float32(np.sqrt(0.5*(1+pan)))
def env(sec,a,r):m=int(sec*SR);e=np.ones(m,np.float32);ai,ri=max(1,int(a*SR)),max(1,int(r*SR));e[:ai]=np.linspace(0,1,ai);e[m-ri:]*=np.linspace(1,0,ri);return e
mf=lambda m:440*2**((m-69)/12)
# music: a drawing-table ambience, its own and not the first film's. Warm, slow and open: soft pads in major and Lydian colours,
# a felt-piano motif that places notes sparsely, like a pencil on paper, and no beat. It darkens a little while the numbers disagree,
# and resolves to D major when they match.
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
DM9=[50,57,61,64,66];BM9=[47,54,57,61,62];GL=[43,50,54,57,61];AA9=[45,52,57,59,61];EM9=[40,47,54,55,62];FSM=[42,49,54,57,61]
def prog(sid,chords,a=None,b=None,g=0.04):
    s0=ST[sid]['start']+(a or 0);s1=ST[sid]['start']+(b if b is not None else ST[sid]['dur']);d=(s1-s0)/len(chords)
    for i,ch in enumerate(chords):pad(ch,s0+i*d-1.2,d+2.4,g);drone(ch[0]-12,s0+i*d-1.2,d+2.4)
mrng=np.random.default_rng(11)
def motif(sid,chords,a=None,b=None,every=1.5,g=0.045):
    # sparse notes from each chord, an octave up, drifting across the stereo field
    s0=ST[sid]['start']+(a or 0);s1=ST[sid]['start']+(b if b is not None else ST[sid]['dur']);d=(s1-s0)/len(chords);k=0;t0=s0+0.4
    while t0<s1-0.5:
        ch=chords[min(len(chords)-1,int((t0-s0)/d))];m=ch[int(mrng.integers(1,len(ch)))]+12+(12 if mrng.random()<0.25 else 0)
        felt(m,t0,g*(0.8+0.4*mrng.random()),float(mrng.uniform(-0.6,0.6)));t0+=every*(0.75+0.5*mrng.random());k+=1
cq=lambda sid,cid:ST[sid]['cues'][cid]
prog('drawn',[DM9,GL]);motif('drawn',[DM9,GL],every=1.7)
prog('two',[BM9,EM9],0,cq('two','check'));prog('two',[GL,AA9,DM9],cq('two','check'));motif('two',[GL,AA9,DM9],cq('two','check'),every=1.8)
prog('cls',[GL,DM9,BM9,AA9]);motif('cls',[GL,DM9,BM9,AA9],every=1.6)
prog('census',[EM9,AA9,DM9]);motif('census',[EM9,AA9,DM9],every=1.7)
prog('courses',[BM9,GL,AA9]);motif('courses',[BM9,GL,AA9],every=1.7)
prog('time',[FSM,BM9,DM9]);motif('time',[FSM,BM9,DM9],cq('time','snap'),every=1.2)
prog('levels',[GL,DM9,GL,AA9]);motif('levels',[GL,DM9,GL,AA9],every=1.4,g=0.05)
prog('fit',[DM9,GL,EM9,AA9]);motif('fit',[DM9,GL,EM9,AA9],every=1.5)
prog('end',[BM9,GL],0,cq('end','answer'));prog('end',[DM9,GL,DM9],cq('end','answer'),g=0.05);motif('end',[DM9,GL,DM9],cq('end','answer'),every=1.3,g=0.05)
rng=np.random.default_rng(3)
def X(sig,start,g=0.3,pan=0.0):put(XL,XR,sig.astype(np.float32),start,g,pan)
def click(s,g=0.3):x=tt(0.08);X(rng.standard_normal(len(x))*np.exp(-x*120)*0.5+np.sin(2*np.pi*1800*x)*np.exp(-x*50),s,g)
def tick(s,g=0.18,pan=0):x=tt(0.05);X(np.sin(2*np.pi*2400*x)*np.exp(-x*90),s,g,pan)
def chirp(s,g=0.14):x=tt(0.3);X(np.sin(2*np.pi*(600*x+1300*x*x))*np.sin(np.pi*x/0.3),s,g)
def thud(s,g=0.4):x=tt(0.5);X(np.sin(2*np.pi*70*x)*np.exp(-x*9)+0.2*rng.standard_normal(len(x))*np.exp(-x*30),s,g)
def sweep(s,sec=1.0,g=0.08,f0=500,f1=3000,pan=0.3):x=tt(sec);ph=2*np.pi*np.cumsum(f0+(f1-f0)*(x/sec))/SR;X(np.sin(ph)*np.sin(np.pi*x/sec),s,g,pan)
def whoosh(s,sec=0.9,g=0.12):x=tt(sec);nz=np.convolve(rng.standard_normal(len(x)),np.ones(60)/60,'same');X(nz*np.sin(np.pi*x/sec)**2*4,s,g)
def glitch(s,g=0.08):
    for k in range(8):x=tt(0.04);X(np.sign(rng.standard_normal(len(x)))*np.exp(-x*40),s+k*0.07,g,float(rng.uniform(-0.8,0.8)))
def chime(s,g=0.16,f=880):x=tt(2.0);X(sum(np.sin(2*np.pi*f*r*x)*np.exp(-x/d)*a for r,d,a in[(1,1.6,1),(2.76,1.0,0.5),(5.4,0.6,0.3),(8.93,0.35,0.15)]),s,g)
def shimmer(s,g=0.05):x=tt(3.0);X((np.sin(2*np.pi*1760*x)+0.6*np.sin(2*np.pi*2640*x))*np.minimum(1,x/0.5)*np.exp(-x*0.9),s,g)
def bell(s,g=0.18):x=tt(4.0);X(sum(np.sin(2*np.pi*523*r*x)*np.exp(-x/d)*a for r,d,a in[(0.5,3.5,0.6),(1,3.0,1),(1.19,2.2,0.5),(1.56,1.8,0.4),(2.0,1.5,0.35),(2.74,1.0,0.25),(3.0,0.8,0.2)]),s,g)
def hum(s,sec,g=0.1):x=tt(sec);X((np.sin(2*np.pi*55*x)+0.5*np.sin(2*np.pi*110*x)+0.05*rng.standard_normal(len(x)))*env(sec,0.8,0.8)*(1+0.1*np.sin(2*np.pi*7*x)),s,g)
def buzz(s,g=0.12):x=tt(0.35);X(np.sign(np.sin(2*np.pi*110*x))*np.exp(-x*6)*0.6+np.sin(2*np.pi*220*x)*np.exp(-x*8)*0.4,s,g)
def tone(s,g=0.24):x=tt(3.2);X((np.sin(2*np.pi*660*x)+0.2*np.sin(2*np.pi*1320*x))*np.minimum(1,x/0.3)*np.exp(-x*0.8),s,g)
def pop(s,g=0.14):x=tt(0.12);X(np.sin(2*np.pi*(900+2000*x)*x)*np.exp(-x*30),s,g)
# the tracing paper: a soft sweep each time the reference slides over the sketch
def paper_in(s):whoosh(s,1.2,0.07);sweep(s+0.2,1.0,0.03,900,1800,0.4)
paper_in(G('two','mcds',4.2));paper_in(G('cls','ref',-0.1));paper_in(G('census','ref',-0.1));paper_in(G('courses','admission',-0.1))
chime(G('two','tcsi',0.4),0.1,784)
for i,k in enumerate(['Student','Class','Enrolment','Term','Course']):pop(G('drawn','recap',0.4+i*(G('drawn','over')-G('drawn','recap'))*0.16),0.1)
for i in range(3):pop(G('drawn','over',0.8+i*0.5),0.08)
shimmer(G('drawn','normal',0.5),0.05)
pop(G('two','q',0.0),0.12);thud(G('two','nums',0.0),0.16);thud(G('two','nums',1.6),0.16);glitch(G('two','meaning',0.1),0.06)
# each question: the box splits, the date moves, a box appears; the number in the corner counts down with a tick and lands with a chime
for k in range(3):pop(G('cls','hiding',0.3+k*0.25),0.12)
for s in('unit','offering','classes'):chime(G('cls',s,0.9),0.06,1175)
buzz(G('cls','genie',0.3),0.08)
def countdown(s,n):
    for k in range(n):tick(s+k*(1.0/max(1,n)),0.12,(k%3-1)*0.4)
    chime(s+1.05,0.1,1046)
countdown(G('cls','genie',2.2),6);countdown(G('census','adopt',1.6),4);countdown(G('courses','once',0.6),2);countdown(G('time','snap',1.6),1)
sweep(G('census','adopt',0.3),1.4,0.05,2400,800,-0.3);pop(G('census','summer',0.3),0.1);pop(G('census','summer',1.1),0.1)
buzz(G('courses','one',0.3),0.08);whoosh(G('courses','admission',3.0),1.4,0.07);pop(G('courses','admission',3.7),0.12)
for k in range(4):click(G('time','change',0.4+k*0.9),0.08)
click(G('time','snap',0.3),0.2);shimmer(G('time','snap',0.3),0.06);chime(G('time','snap',2.7),0.14,1318)
whoosh(G('levels','logical',0.2),1.4,0.07);whoosh(G('levels','physical',0.2),1.2,0.07);[pop(G('levels','agree',k*0.6),0.1) for k in range(3)]
sweep(G('fit','lift',0.3),1.8,0.05,600,2400);[pop(G('fit','lift',2.2+k*0.25),0.06) for k in range(9)]
chime(G('fit','adopt',0.4),0.08,880);chime(G('fit','extend',0.4),0.08,660);pop(G('fit','record',0.8),0.12)
pop(G('end','asks',0.0),0.12);chime(G('end','answer',0.2),0.14,1046);shimmer(G('end','version',0.2),0.06);tone(G('end','evolve',0.4),0.1);shimmer(G('end','tag',0.0),0.06)
# the breathing cut: each wordless chapter ending gets its own sound, on its "breath" cue
def B(sid,off=0):return G(sid,'breath',off) if ST[sid].get('breathe') else None
if B('drawn'):[pop(B('drawn',1.9+k*0.8),0.07) for k in range(5)]
if B('two'):[chime(B('two',0.3+k*0.5),0.05,[784,880,988,1046,1175][k]) for k in range(5)]  # one chime per reference box, as it lights (scenes.js)
if B('cls'):[tick(B('cls',1.8+k*0.8),0.1) for k in range(6)]
if B('census'):chime(B('census',0.5),0.06,988);chime(B('census',1.7),0.06,784);chime(B('census',2.9),0.06,988);chime(B('census',4.1),0.06,784)
if B('courses'):sweep(B('courses',0.5),2.0,0.04,600,1800);sweep(B('courses',2.9),2.0,0.04,600,1800)
if B('time'):[tick(B('time',0.4+k*1.3),0.1) for k in range(4)]
if B('levels'):shimmer(B('levels',0.3),0.05)
if B('fit'):[pop(B('fit',0.5+k*0.5),0.06) for k in range(9)]
t=np.arange(n,dtype=np.float32)/SR;duck=np.ones(n,np.float32)
for c in info['caps']:duck[int(max(0,c['s']-0.15)*SR):int((c['e']+0.25)*SR)]=0.42
k=int(0.25*SR);duck=np.convolve(duck,np.ones(k,np.float32)/k,'same')
mute=np.ones(n,np.float32);fade=np.clip((TOT-t)/3.5,0,1).astype(np.float32)
L=vo*0.95+(ML*0.55*duck+XL*0.6)*mute*fade;R=vo*0.95+(MR*0.55*duck+XR*0.6)*mute*fade
pk=max(np.abs(L).max(),np.abs(R).max());L/=pk/0.9;R/=pk/0.9
sf.write(str(BUILD/'mix.wav'),np.stack([L,R],1),SR,subtype='PCM_16')
FF=imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([FF,'-y','-loglevel','error','-i',str(BUILD/'mix.wav'),'-af','loudnorm=I=-16:TP=-1.5:LRA=11','-ar','44100','-c:a','libmp3lame','-b:a','112k',str(DIST/'soundtrack.mp3')],check=True)
print('total %.1fs, vo peak ok, mix written'%TOT)
