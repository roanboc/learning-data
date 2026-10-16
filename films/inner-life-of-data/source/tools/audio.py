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
    i=int(start*SR)
    if i<0:sig=sig[-i:];i=0  # a sound that starts before 0:00, like the first chapter's music, plays from 0:00 instead of not at all
    j=min(n,i+len(sig))
    if j<=i:return
    s=sig[:j-i]*g;L[i:j]+=s*np.float32(np.sqrt(0.5*(1-pan)));R[i:j]+=s*np.float32(np.sqrt(0.5*(1+pan)))
def env(sec,a,r):m=int(sec*SR);e=np.ones(m,np.float32);ai,ri=max(1,int(a*SR)),max(1,int(r*SR));e[:ai]=np.linspace(0,1,ai);e[m-ri:]*=np.linspace(1,0,ri);return e
mf=lambda m:440*2**((m-69)/12)
def pad(ch,start,sec,g=0.05):
    x=tt(sec);e=env(sec,1.6,2.0);lfo=1+0.15*np.sin(2*np.pi*0.18*x)
    for pan,det in((-0.7,0.998),(0.7,1.002)):
        s=np.zeros_like(x)
        for m in ch:
            f=mf(m)*det
            for k in range(1,5):s+=np.sin(2*np.pi*f*k*x+k).astype(np.float32)*(1/k**1.7)
        put(ML,MR,s*e*lfo,start,g,pan)
A9=[45,57,60,64,67,71];F9=[41,53,57,60,64,67];C9=[48,55,59,62,64,67];G9=[43,55,59,62,64,69];D9=[50,57,60,64,65,69];X9=[46,57,58,64,65,70]
def prog(sid,chords,a=None,b=None,g=0.05):
    s0=ST[sid]['start']+(a or 0);s1=ST[sid]['start']+(b if b is not None else ST[sid]['dur']);d=(s1-s0)/len(chords)
    for i,ch in enumerate(chords):pad(ch,s0+i*d-0.8,d+1.6,g)
prog('tap',[A9]);prog('in',[A9,F9,C9,G9]);prog('sketch',[D9],0,ST['sketch']['cues']['wrong']);prog('sketch',[X9],ST['sketch']['cues']['wrong'],ST['sketch']['cues']['right'],0.045);prog('sketch',[C9],ST['sketch']['cues']['right'])
prog('refine',[A9,F9,C9,G9]);prog('gold',[F9,C9,A9,G9]);prog('layers',[C9,G9]);prog('meaning',[A9,F9],g=0.042);prog('speeds',[C9,G9]);tw=G('out','twist')
prog('out',[A9,F9],0,ST['out']['cues']['twist']);prog('out',[C9,G9,C9],ST['out']['cues']['twist']);prog('people',[F9,C9]);prog('end',[A9,F9],0,ST['end']['cues']['seats']);prog('end',[C9],ST['end']['cues']['seats'],g=0.06)
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
# ---- soft and low (PLAYBOOK.md): the bright effects above, redefined under the same names and with the same arguments, so every
# cue keeps its timing: a chime, a ping or a bell becomes a low felt note, a tick or a click a muffled key, a pop a wooden knock,
# a sweep or a whoosh a breath of air, a shimmer a warm swell, a thud or the projector's hum low-passed; everything sits below
# about 2 kHz. The bell the narration names ("rings a bell") keeps its own sound. urgent() is a rhythm for the
# moments of error or rush: it starts and stops with them, and nothing in it is bright
from scipy.signal import butter as _butter, sosfilt as _sosfilt
_srng=np.random.default_rng(11)
def _flt(x,kind,f):
    sos=_butter(2,[f[0]/(SR/2),min(0.99,f[1]/(SR/2))],btype='band',output='sos') if kind=='band' else _butter(2,min(0.99,f/(SR/2)),btype=kind,output='sos')
    return _sosfilt(sos,x).astype(np.float32)
def _nz(sec):return _srng.standard_normal(max(1,int(sec*SR))).astype(np.float32)
def _nm(s):p=float(np.abs(s).max()) if len(s) else 0;return s/p if p>0 else s
def _down(f,top=520.0):
    while f>top:f/=2
    return f
def _knock(s,g=0.05,pan=0.0,f=240):x=tt(0.18);X(_nm(_flt((np.sin(2*np.pi*f*x)*np.exp(-x*38)+0.4*np.sin(2*np.pi*f*2.17*x)*np.exp(-x*60)).astype(np.float32),'low',1400)),s,g,pan)
def _tap(s,g=0.03,pan=0.0):x=tt(0.06);X(_nm(_flt(_nz(0.06),'band',(250,1400))*np.exp(-x*90)),s,g,pan)
def _note(f,s,g=0.04,pan=0.0,sec=2.2):
    f=_down(f);x=tt(sec);sig=sum(np.sin(2*np.pi*f*k*x)*np.exp(-x*(1.5+1.2*k))*w for k,w in((1,1),(2,0.3),(3,0.08)))
    X(_nm(_flt((sig*np.minimum(1,x/0.006)).astype(np.float32),'low',1800)),s,g,pan)
def _air(s,sec=0.8,g=0.04,pan=0.0,lo=150,hi=1100):x=tt(sec);X(_flt(_nz(sec),'band',(lo,hi))*np.sin(np.pi*x/sec)**2,s,g,pan)
def tick(s,g=0.18,pan=0):_tap(s,g*0.3,pan)
def click(s,g=0.3,pan=0):_tap(s,g*0.25,pan)
def chirp(s,g=0.14,pan=0.0):_note(660,s,g*0.4,pan,1.0)
def sweep(s,sec=1.0,g=0.08,f0=500,f1=3000,pan=0.3):_air(s,sec,g*0.5,pan,160,1000)
def whoosh(s,sec=0.9,g=0.12,pan=0.0):_air(s,sec,g*0.6,pan,120,900)
def glitch(s,g=0.08,pan=0.0):x=tt(0.3);X(_flt((np.sign(np.sin(2*np.pi*180*x))*(np.sin(2*np.pi*23*x)>0)*np.exp(-x*7)*0.6).astype(np.float32),'low',700),s,g,pan)
def chime(s,g=0.16,f=880,pan=0.0):_note(f,s,g*0.4,pan,2.0)
def shimmer(s,g=0.05,pan=0.0):f=220.0;x=tt(2.8);X(((np.sin(2*np.pi*f*x)+0.5*np.sin(2*np.pi*f*1.5*x))*np.sin(np.pi*x/2.8)**2).astype(np.float32),s,g*0.6,pan)
def thud(s,g=0.4):x=tt(0.5);X(_flt((np.sin(2*np.pi*70*x)*np.exp(-x*9)+0.2*_nz(0.5)*np.exp(-x*30)).astype(np.float32),'low',900),s,g)
def hum(s,sec,g=0.1):x=tt(sec);X(_flt(((np.sin(2*np.pi*55*x)+0.5*np.sin(2*np.pi*110*x)+0.05*_nz(sec))*env(sec,0.8,0.8)*(1+0.1*np.sin(2*np.pi*7*x))).astype(np.float32),'low',900),s,g)
def buzz(s,g=0.12,pan=0.0):x=tt(0.35);X(_flt((np.sign(np.sin(2*np.pi*110*x))*np.exp(-x*6)*0.6).astype(np.float32),'low',600),s,g*0.9,pan)
def tone(s,g=0.24,f=660,pan=0.0):_note(f,s,g*0.3,pan,2.8)
def pop(s,g=0.14,pan=0.0):_knock(s,g*0.35,pan,300)
def urgent(s0,s1,bpm=104,root=40,g=0.05,fade=1.2,steps=(0,0,7,0),pan=0.0):
    # a short, muted bass note on every beat (steps: each beat's interval above root; (0,0,1,0) leans on the semitone for an error,
    # (0,0,7,0) drives for a rush), a soft low drum on one and three, and a muffled key on the off-beats, all under about 1 kHz
    per=60/bpm;t0=s0;k=0
    while t0<s1:
        f=min(1,(t0-s0)/fade+0.06,(s1-t0)/fade)
        if f>0:
            fr=mf(root+steps[k%len(steps)]);x=tt(per*0.85);b=(np.sin(2*np.pi*fr*x)+0.7*np.sin(4*np.pi*fr*x)+0.3*np.sin(6*np.pi*fr*x))*np.exp(-x*6)*np.minimum(1,x/0.005)
            put(ML,MR,_nm(_flt(b.astype(np.float32),'low',900)),t0,g*f,pan)
            if k%2==0:x=tt(0.35);ph=2*np.pi*np.cumsum(48+70*np.exp(-x*26))/SR;put(ML,MR,_nm((np.sin(ph)*np.exp(-x*9)).astype(np.float32)),t0,g*0.9*f,0.0)
            x=tt(0.05);put(ML,MR,_nm(_flt(_nz(0.05),'band',(250,1100))*np.exp(-x*100)),t0+per/2,g*0.45*f,pan+0.2)
        t0+=per;k+=1
# the feeling under the picture: an urgent pulse, leaning on the semitone, while the sketch is wrong; another while bronze's pieces
# are rough, until dbt starts on them; a short drive under the question that needs an answer right now; and a slow, uneasy
# one while the copies fall behind, until the fourth way. The calm chapters have none (PLAYBOOK.md, "Let rhythm follow the feeling")
tpz=ST['out'].get('pauses',{}).get('twist',1.0)
urgent(G('sketch','wrong',-0.2),G('sketch','right',0.3),bpm=96,root=33,g=0.21,steps=(0,0,1,0))
urgent(G('refine','closer'),G('refine','sources',0.7),bpm=96,root=33,g=0.22,steps=(0,0,1,0))
urgent(G('speeds','now',-0.2),G('speeds','years',-0.3),bpm=112,root=36,g=0.2)
urgent(G('out','copies',1.1),tw-tpz-0.1,bpm=84,root=33,g=0.2,steps=(0,0,1,0),fade=1.6)
tp=G('tap','tap',-0.3);click(tp,0.35);chirp(tp+0.1);whoosh(G('tap','stored',0.1));chime(G('tap','stored',1.4),0.14,1320);whoosh(G('tap','follow',0.3),1.4,0.14)
for i in range(4):chime(G('in','colours',i*0.3),0.06,[660,784,880,988][i])
for k in range(0,10,2):tick(G('in','events')+k*1.1,0.1,-0.4);tick(G('in','events')+0.4+k*1.3,0.08,0.4)
hum(G('in','integ'),2.5,0.06);whoosh(G('in','zerobus',0.1),1.2,0.12)
for i in range(8):thud(G('in','files',0.4+i*0.09+0.6),0.12);tick(G('in','auto',0.4+i*0.55),0.16)
sweep(G('in','auto',0.2),1.2,0.05);chime(G('in','bronze',0.2),0.1,587)
for i in range(3):pop(G('sketch','model',0.3+i*0.8),0.12)
whoosh(G('sketch','concept',0.5),1.4,0.08);glitch(G('sketch','wrong',0.1),0.1);buzz(G('sketch','downstream',0.2),0.1)
for i in range(0,24,2):tick(G('sketch','right',0.3+i*0.066),0.08,(i%5-2)/3)
chime(G('sketch','right',2.0),0.14,1046)
whoosh(G('refine','closer',0.3),1.1,0.12);glitch(G('refine','rough',0.1),0.09);buzz(G('refine','tests',0.9),0.12);buzz(G('refine','orphan',0.7),0.12);chime(G('refine','staging',1.0),0.1,880);shimmer(G('refine','silver',0.2),0.06);sweep(G('refine','trace',0.2),2.2,0.05,3000,600,-0.3)
shimmer(G('gold','split',0.2),0.07)
for i in range(4):whoosh(G('gold','split',1.6+i*0.35),0.7,0.05)
pop(G('gold','marts',0.2),0.12);pop(G('gold','exposure',0.1),0.12);chime(G('gold','gold',0.1),0.12,784)
sweep(G('layers','dbtgov',0.2),2.6,0.05,400,2400);hum(G('layers','dbx'),3.0,0.07)
glitch(G('meaning','noise',0.1),0.06);pop(G('meaning','catalog',0.0));pop(G('meaning','define',0.0));click(G('meaning','uc',1.5),0.15)
for k in range(8):chime(G('meaning','reads')+k*0.5,0.05,1318)
shimmer(G('meaning','onto',0.2),0.08)
q0=G('speeds','now',3.4);pop(q0,0.12);pop(q0+0.35,0.14);sweep(G('speeds','years',0.3),1.5,0.05);whoosh(G('speeds','sync',0.1),1.0,0.08)
bell(G('out','events',0.8),0.16);[tick(G('out','sql')+k*0.15,0.05,(k%3-1)*0.5) for k in range(20)];[tick(G('out','copies')+k*0.6,0.09) for k in range(8)];buzz(G('out','stale',0.8),0.1)
tone(tw,0.24);hum(G('out','projector'),G('out','one',2)-G('out','projector'),0.07);whoosh(G('out','share',0.2),1.0,0.08);whoosh(G('out','mirror',0.2),1.0,0.08);sweep(G('out','fed',0.2),1.2,0.05,2400,600)
sweep(G('people','app',0.2),1.0,0.05);[click(G('people','fix',0.8)+k*0.1,0.06) for k in range(16)];whoosh(G('people','fix',2.6),1.2,0.08);shimmer(G('people','genie',0.1),0.07);pop(G('people','ask'),0.12);pop(G('people','answer'),0.14);click(G('people','perms',0.2),0.12)
whoosh(G('end','recap',0.3),2.0,0.08);chime(G('end','seats',0.1),0.14,1046);shimmer(G('end','tag',0.0),0.06)
# the breathing cut: each wordless chapter ending gets its own sound, placed on its "breath" cue (the music already rises when the voice rests)
def B(sid,off=0):return G(sid,'breath',off) if ST[sid].get('breathe') else None
if B('in'):shimmer(B('in',0.2),0.04);thud(B('in',1.3),0.12);sweep(B('in',1.9),1.2,0.05);tick(B('in',2.1),0.16);chime(B('in',3.3),0.08,587)
if B('sketch'):
    for d in(0.6,2.0):pop(B('sketch',d+1.0),0.12);glitch(B('sketch',d+1.1),0.05);chime(B('sketch',d+1.1),0.08,1046)
if B('refine'):sweep(B('refine',0.4),1.4,0.04,600,2400);[pop(B('refine',d+0.9),0.1) for d in(0.9,1.7,2.5)];sweep(B('refine',2.1),2.0,0.05,3000,600,-0.3)
if B('gold'):whoosh(B('gold',0.3),2.5,0.06);pop(B('gold',1.3),0.12);pop(B('gold',2.3),0.1)
if B('layers'):sweep(B('layers',0.3),max(1.0,ST['layers']['breathe']-1.0),0.05,400,2400);chime(B('layers',ST['layers']['breathe']-0.8),0.1,784)
if B('meaning'):
    for k in range(4):chime(B('meaning',0.3+k*0.9),0.04,[1318,1175,1568,1318][k])
if B('speeds'):[pop(B('speeds',d),0.12) for d in(0.3,1.2,2.1)];sweep(B('speeds',0.3),ST['speeds']['breathe']-0.9,0.04,500,1500)
if B('out'):
    for d in(0.6,2.2):tone(B('out',d),0.1);shimmer(B('out',d+0.15),0.06);buzz(B('out',d+0.4),0.06)
if B('people'):shimmer(B('people',0.2),0.06);[pop(B('people',0.5+i*0.9),0.09) for i in range(3)]
# the music sits low under the voice (0.42) and lifts about 4 dB when the voice rests (0.67). It goes down in 0.4 s, just before a line,
# and comes back up over 1.2 s, starting 0.9 s after the line, so pauses shorter than about 1.3 s keep it down instead of making it pump
t=np.arange(n,dtype=np.float32)/SR;CR=100;DK,LF=0.42,0.67;tg=np.full(int(TOT*CR)+CR,LF,np.float32)
for c in info['caps']:tg[int(max(0,c['s']-0.45)*CR):int((c['e']+0.9)*CR)]=DK
dk=np.empty_like(tg);v=LF
for i,x in enumerate(tg):v=max(x,v-(LF-DK)/(0.4*CR)) if x<v else min(x,v+(LF-DK)/(1.2*CR));dk[i]=v
duck=np.interp(t,np.arange(len(dk),dtype=np.float32)/CR,dk).astype(np.float32)
# before "And the fourth way changes everything", the music and effects dip for the pause; cutting them to silence sounded like a fault
mute=np.interp(t,[tw-tpz-0.35,tw-tpz,tw-0.1,tw+0.2],[1,0.4,0.4,1]).astype(np.float32)
fade=(np.clip((TOT-t)/3.5,0,1)*np.clip(t/1.5,0,1)).astype(np.float32)
L=vo*0.95+(ML*0.55*duck+XL*0.6)*mute*fade;R=vo*0.95+(MR*0.55*duck+XR*0.6)*mute*fade
pk=max(np.abs(L).max(),np.abs(R).max());L/=pk/0.9;R/=pk/0.9
sf.write(str(BUILD/'mix.wav'),np.stack([L,R],1),SR,subtype='PCM_16')
FF=imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([FF,'-y','-loglevel','error','-i',str(BUILD/'mix.wav'),'-af','loudnorm=I=-16:TP=-1.5:LRA=11','-ar','44100','-c:a','libmp3lame','-b:a','112k',str(DIST/'soundtrack.mp3')],check=True)
print('total %.1fs, vo peak ok, mix written'%TOT)
