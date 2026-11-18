import numpy as np, os, sys
from PIL import Image, ImageFilter, ImageDraw
rng=np.random.default_rng(11)
W,H=450,600; S=3
w,h=W*S,H*S
paper=np.array([227,213,199.])
# paper with faint grain
bg=np.ones((h,w,3))*paper
yy,xx=np.mgrid[0:h,0:w].astype(float)
cx,cy=w*0.5,h*0.5
# blob outline: radial noise
def blob(rx,ry,seed,amp=0.07):
    r=np.random.default_rng(seed); ph=r.uniform(0,6.28,5)
    ang=np.arctan2((yy-cy)/ry,(xx-cx)/rx)
    rad=np.hypot((xx-cx)/rx,(yy-cy)/ry)
    wob=1+amp*(np.sin(2*ang+ph[0])*1+0.6*np.sin(3*ang+ph[1])+0.4*np.sin(5*ang+ph[2]))
    return rad/wob
rr=blob(w*0.40,h*0.265,3)
inside=rr<1
# hole: off-centre, slightly irregular
hx,hy=cx+w*0.04,cy-h*0.03
hr=np.hypot((xx-hx)/(w*0.13),(yy-hy)/(w*0.15))
ang=np.arctan2(yy-hy,xx-hx); hr=hr/(1+0.08*np.sin(3*ang+1.0)+0.05*np.sin(5*ang))
hole=hr<1
body=inside&~hole
# height-field for shading: dome + hole rim
z=np.clip(1-rr**2,0,1)**0.6
# bulge around the hole (rim smoothly drops into hole)
rim=np.clip((hr-1)/0.6,0,1)
z=z*(0.55+0.45*rim)
# noise texture (multi-scale)
def noise(sc,seed):
    r=np.random.default_rng(seed)
    n=r.random((h//sc+2,w//sc+2))
    return np.asarray(Image.fromarray((n*255).astype('uint8')).resize((w,h),Image.BICUBIC)).astype(float)/255
tex=0.5*noise(120,1)+0.3*noise(40,2)+0.2*noise(12,3)
zz=z*1.0+0.12*(tex-0.5)
gy,gx=np.gradient(np.asarray(Image.fromarray((np.clip(zz,0,1)*255).astype('uint8')).filter(ImageFilter.GaussianBlur(6))).astype(float)/255)
# light from top-left
lit=np.clip(0.6+(gx*2.2+gy*2.2)*38,0.0,1.3)
lit=np.clip(lit,0.15,1.2)
# base colours: grey river stone with warm brown tones
dark=np.array([70,64,62.]); mid=np.array([146,138,128.]); light=np.array([214,208,194.])
t=np.clip(lit*0.9+ (tex-0.5)*0.25,0,1.2)
col=np.where(t[...,None]<0.6, dark+(mid-dark)*(t[...,None]/0.6), mid+(light-mid)*np.clip((t[...,None]-0.6)/0.6,0,1))
# warm ochre stain patches
st=noise(90,7)
col=col+((st[...,None]-0.5)*np.array([26,14,-8]))
gr=(rng.random((h,w))-0.5)*34; col=col+gr[...,None]
# speckles
sp=rng.random((h,w))
col[(sp>0.9965)&body]=[60,58,60]; col[(sp<0.002)&body]=[236,232,222]
# soft ground shadow (down-right), under paper
sh=Image.fromarray((np.roll(np.roll(inside&~hole,28*S//2*2,axis=0),20*S//2*2,axis=1)*255).astype('uint8')).filter(ImageFilter.GaussianBlur(26))
shd=np.asarray(sh).astype(float)/255*0.35
out=bg*(1-shd[...,None])+bg*0 
out=out.copy()
# hole interior: paper seen through + inner wall shadow on lit side
wall=np.clip(1-hr,0,1)
hole_col=paper[None,None,:]*(1-0.35*np.clip((hr-0.6)/0.4,0,1)[...,None]) 
out[hole]=hole_col[hole]*(1)
# also darker inside edge to show thickness (upper-left wall visible)
edge_in=(hr>0.8)&hole
wallshade=np.clip((xx-hx)*-0.5+(yy-hy)*-0.5,-1,1)
out[edge_in]=out[edge_in]*0.65
out[body]=col[body]
img=Image.fromarray(np.clip(out,0,255).astype('uint8'))
# pen outline: edge of body mask
m=Image.fromarray((body*255).astype('uint8'))
edge=np.asarray(m.filter(ImageFilter.MaxFilter(5))).astype(int)-np.asarray(m.filter(ImageFilter.MinFilter(5))).astype(int)
e=Image.fromarray(np.clip(edge,0,255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
ea=np.asarray(e).astype(float)/255
arr=np.asarray(img).astype(float)
ink=np.array([44,36,34.])
arr=arr*(1-ea[...,None]*0.9)+ink*ea[...,None]*0.9
img=Image.fromarray(np.clip(arr,0,255).astype('uint8')).resize((W,H),Image.LANCZOS)
img.save(sys.argv[1],'WEBP',quality=72,method=6)
print(os.path.getsize(sys.argv[1]))
