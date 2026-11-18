# Painted stones for the album, same manner as holed.py: paper, soft shading, pen outline, ground shadow.
import numpy as np, os, sys, math
from PIL import Image, ImageFilter, ImageDraw
W,H,S=450,600,3; w,h=W*S,H*S
PAPER=np.array([227,213,199.])
yy,xx=np.mgrid[0:h,0:w].astype(float)
def noise(sc,seed):
    r=np.random.default_rng(seed); n=r.random((h//sc+2,w//sc+2))
    return np.asarray(Image.fromarray((n*255).astype('uint8')).resize((w,h),Image.BICUBIC)).astype(float)/255
def blur(a,r): return np.asarray(Image.fromarray(np.clip(a*255,0,255).astype('uint8')).filter(ImageFilter.GaussianBlur(r))).astype(float)/255
def wob(rx,ry,cx,cy,seed,amp,harm=(2,3,5)):
    r=np.random.default_rng(seed); ph=r.uniform(0,6.28,len(harm))
    ang=np.arctan2((yy-cy)/ry,(xx-cx)/rx); rad=np.hypot((xx-cx)/rx,(yy-cy)/ry)
    f=1+amp*sum(np.sin(k*ang+p)*(1/(i+1)**0.5) for i,(k,p) in enumerate(zip(harm,ph)))
    return rad/f
def lighting(z,gain=38,base=0.6,sigma=6):
    gy,gx=np.gradient(blur(np.clip(z,0,1),sigma))
    return np.clip(base+(gx*2.2+gy*2.2)*gain,0.1,1.3)
def ramp(t,stops):
    t=np.clip(t,0,1.2)[...,None]; out=np.zeros(t.shape[:2]+(3,))
    xs=[s[0] for s in stops]; 
    for c in range(3): out[...,c]=np.interp(t[...,0],xs,[s[1][c] for s in stops])
    return out
def finish(mask,col,path,shadow=(14,10),extra=None,ink=(44,36,34),inkw=0.9,seed=1):
    r=np.random.default_rng(seed)
    out=np.ones((h,w,3))*PAPER
    # paper grain
    out+= (noise(3,99)[...,None]-0.5)*5
    sh=np.roll(np.roll(mask,shadow[0]*S,axis=0),shadow[1]*S,axis=1)
    s=blur(sh.astype(float),24*S/3*1.0)*0.38
    out=out*(1-s[...,None])
    out[mask]=col[mask]
    m=Image.fromarray((mask*255).astype('uint8'))
    e=np.asarray(m.filter(ImageFilter.MaxFilter(5))).astype(int)-np.asarray(m.filter(ImageFilter.MinFilter(5))).astype(int)
    ea=blur(np.clip(e,0,255)/255.0,1.2)*inkw
    out=out*(1-ea[...,None])+np.array(ink)*ea[...,None]
    img=Image.fromarray(np.clip(out,0,255).astype('uint8')).resize((W,H),Image.LANCZOS)
    img.save(path,'WEBP',quality=72,method=6); print(path,os.path.getsize(path))
    return img

def cabochon(path,seed,rx,ry,cx,cy,albedo,amp=0.035,sheen=None,gain=34,tilt=0.0):
    rr=wob(rx,ry,cx,cy,seed,amp,(2,3))
    mask=rr<1
    z=np.clip(1-rr**2,0,1)**0.55
    tex=0.5*noise(90,seed)+0.3*noise(30,seed+1)+0.2*noise(9,seed+2)
    L=lighting(z+0.01*(tex-0.5),gain=gain,base=0.58,sigma=7)
    col=albedo(L,tex,rr,z)
    return mask,col

# ---------------- moonstone ----------------
def moon(path):
    cx,cy=w*0.5,h*0.5
    def alb(L,tex,rr,z):
        t=np.clip(L*0.9,0,1.2)
        col=ramp(t,[(0,(138,138,146)),(0.5,(206,206,212)),(0.9,(240,238,238)),(1.2,(252,251,250))])
        # milky cloud
        col+= ((tex[...,None]-0.5)*np.array([10,10,12]))
        # blue adularescence: a soft crescent near the upper-left of the dome
        u=(xx-cx)/(w*0.40); v=(yy-cy)/(h*0.215)
        d=np.hypot(u+0.22,v+0.28); g=np.exp(-(np.hypot(u+0.12,v+0.12)/0.34)**2)*(rr<1)*1.0
        g2=np.exp(-(np.hypot((u-0.28)/1.6,(v-0.40)/0.6)/0.22)**2)*0.35
        sh=np.clip(g+g2,0,1)[...,None]
        col=col*(1-0.55*sh)+np.array([120,168,240.])*0.55*sh
        # specular glint
        gl=np.exp(-(np.hypot(u+0.38,v+0.45)/0.09)**2)[...,None]
        col=col*(1-gl)+np.array([255,255,255.])*gl
        return col
    mask,col=cabochon(path,5,w*0.44,h*0.27,cx,cy,alb,amp=0.03)
    finish(mask,col,path,seed=5)

# ---------------- tiger's eye ----------------
def tiger(path):
    cx,cy=w*0.5,h*0.5
    def alb(L,tex,rr,z):
        # fibres run diagonally: bands perpendicular to fibre direction, wobbling
        ang=math.radians(-38)
        u=(xx-cx)*math.cos(ang)+(yy-cy)*math.sin(ang)
        v=-(xx-cx)*math.sin(ang)+(yy-cy)*math.cos(ang)
        band=np.sin(v/(h*0.0062)+1.4*noise(200,21)+0.5*np.sin(u/(w*0.2)))
        band2=np.sin(v/(h*0.04)+1.0*noise(260,22))
        b=0.55+0.22*band+0.3*band2
        fine=(noise(5,23)-0.5)*0.12
        t=np.clip(b+fine,0,1)
        base=ramp(t,[(0,(58,32,10)),(0.45,(120,76,22)),(0.75,(190,138,40)),(1,(236,190,80))])
        # chatoyant sheen: bright band across the dome, perpendicular to fibres, position follows the lighting
        sheen=np.exp(-((u+w*0.06)/(w*0.055))**2)*(rr<1)
        base=base*(0.55+0.6*np.clip(L,0,1.1)[...,None])
        base=base*(1-0.55*sheen[...,None])+np.array([252,214,110.])*0.55*sheen[...,None]
        gl=np.exp(-(np.hypot(xx-(cx-w*0.17),yy-(cy-h*0.1))/(w*0.03))**2)[...,None]
        base=base*(1-0.9*gl)+np.array([255,248,225.])*0.9*gl
        return base
    mask,col=cabochon(path,9,w*0.40,h*0.29,cx,cy,alb,amp=0.03,gain=30)
    finish(mask,col,path,seed=9)

# ---------------- rose quartz: rough pale pink piece ----------------
def rose(path):
    cx,cy=w*0.5,h*0.5
    rr=wob(w*0.41,h*0.285,cx,cy,31,0.11,(2,3,4,6))
    mask=rr<1
    # faceted lumps: height from a few random cells + dome
    r=np.random.default_rng(31)
    z=np.clip(1-rr**2,0,1)**0.45
    f=np.zeros_like(z)
    for _ in range(9):
        px,py=r.uniform(0.2,0.8)*w,r.uniform(0.28,0.72)*h; a=r.uniform(0,6.28)
        dx,dy=math.cos(a),math.sin(a); rad=r.uniform(0.1,0.22)*w
        d=((xx-px)*dx+(yy-py)*dy)/rad; k=np.exp(-(np.hypot(xx-px,yy-py)/rad)**2)
        f+= (np.clip(d,-1,1))*k*0.06
    tex=0.5*noise(110,32)+0.3*noise(35,33)+0.2*noise(8,34)
    z=z+f+0.02*(tex-0.5)
    L=lighting(z,gain=44,base=0.62,sigma=5)
    t=np.clip(L*0.92+(tex-0.5)*0.2,0,1.2)
    col=ramp(t,[(0,(150,92,104)),(0.5,(214,150,164)),(0.95,(244,206,214)),(1.2,(255,240,242))])
    # cloudy milkiness + faint white veins
    cl=noise(60,35); col=col*(1-0.25*cl[...,None])+np.array([250,236,238.])*0.25*cl[...,None]
    vn=np.exp(-(np.sin(xx/(w*0.09)+3*noise(200,36)+yy/(h*0.12))/0.15)**2)*0.18
    col=col*(1-vn[...,None])+np.array([252,244,246.])*vn[...,None]
    col+= ((np.random.default_rng(37).random((h,w))-0.5)*18)[...,None]
    # conchoidal fracture arcs
    finish(mask,col,path,seed=31)

# ---------------- obsidian: black glassy flake ----------------
def obsidian(path):
    cx,cy=w*0.5,h*0.52
    poly=[(-0.9,0.72),(-0.78,-0.38),(-0.18,-0.98),(0.62,-0.82),(0.94,-0.05),(0.62,0.9),(-0.2,0.62)]
    # build mask via PIL polygon with slightly jagged edges
    r=np.random.default_rng(41)
    pts=[]
    for i,(a,b) in enumerate(poly):
        c=poly[(i+1)%len(poly)]
        pts.append((a,b))
        for k in (1,2):
            t=k/3; pts.append((a+(c[0]-a)*t+r.uniform(-0.025,0.025), b+(c[1]-b)*t+r.uniform(-0.025,0.025)))
    P=[(cx+x*w*0.41,cy+y*h*0.255) for x,y in pts]
    m=Image.new('L',(w,h),0); ImageDraw.Draw(m).polygon(P,fill=255); mask=np.asarray(m)>127
    # conchoidal ripples radiating from a percussion point at the upper left
    ox,oy=cx-w*0.33,cy-h*0.16
    d=np.hypot((xx-ox)/(w*0.4),(yy-oy)/(h*0.25))
    rip=np.sin(d*22+1.2*noise(120,42))
    # height: a lens (thick middle, thin sharp edge) plus ripples
    dist=np.asarray(m.filter(ImageFilter.GaussianBlur(40))).astype(float)/255
    z=np.clip(dist*1.4,0,1)+0.02*rip*np.clip(dist*2,0,1)
    L=lighting(z,gain=60,base=0.4,sigma=2.5)
    t=np.clip(L*0.9,0,1.2)*np.clip(dist*3.5,0,1)
    col=ramp(t,[(0,(6,6,10)),(0.45,(22,22,32)),(0.8,(70,74,96)),(1.0,(150,156,184)),(1.2,(236,238,250))])
    # thin edge turns smoky brown/translucent
    edge=np.clip(1-dist*4.0,0,1)[...,None]
    col=col*(1-0.8*edge)+np.array([52,38,32.])*0.8*edge
    # glassy highlights along some ripples
    hl=(np.clip(rip,0.9,1)-0.9)/0.1*np.clip(dist*2,0,1)*0.22
    col=col*(1-hl[...,None])+np.array([205,210,235.])*hl[...,None]
    gl=np.exp(-(np.hypot(xx-(cx-w*0.14),yy-(cy-h*0.12))/(w*0.04))**2)[...,None]
    col=col*(1-0.8*gl)+np.array([250,250,255.])*0.8*gl
    finish(mask,col,path,shadow=(12,9),seed=41,ink=(20,16,18),inkw=1.0)

# ---------------- citrine: clear yellow crystal point ----------------
def citrine(path):
    img=Image.new('RGB',(w,h),tuple(int(v) for v in PAPER))
    # draw the crystal on its own layer (RGBA), then composite with shadow + outline
    L=Image.new('RGBA',(w,h),(0,0,0,0)); d=ImageDraw.Draw(L)
    def crystal(cx,base_y,pw,ph,tipH,ang,seed,faces):
        # local coordinates: x across, y up; returns polygons rotated by ang about the base centre
        def T(x,y):
            c,s=math.cos(ang),math.sin(ang); X=x*c-y*s; Y=x*s+y*c
            return (cx+X*S,base_y-Y*S)
        hw=pw/2
        # hexagonal prism seen with three faces: left narrow, middle wide, right medium
        xs=[-hw,-hw*0.42,hw*0.38,hw]
        polys=[]
        shades=faces
        for i in range(3):
            polys.append(([T(xs[i],0),T(xs[i+1],0),T(xs[i+1],ph),T(xs[i],ph)],shades[i]))
        # pyramid tip: shared apex
        apex=T((xs[1]+xs[2])/2+hw*0.1,ph+tipH)
        for i in range(3):
            polys.append(([T(xs[i],ph),T(xs[i+1],ph),apex],shades[i]))
        return polys,apex
    def paint(polys):
        for pts,(c0,c1) in polys:
            # vertical gradient fill via horizontal strips
            ys=[p[1] for p in pts]; y0,y1=int(min(ys)),int(max(ys))
            tmp=Image.new('RGBA',(w,h),(0,0,0,0)); ImageDraw.Draw(tmp).polygon(pts,fill=(255,255,255,255))
            grad=Image.new('RGB',(w,h)); gd=ImageDraw.Draw(grad)
            for y in range(max(0,y0),min(h,y1+1)):
                t=(y-y0)/max(1,(y1-y0)); 
                gd.line([(0,y),(w,y)],fill=tuple(int(c0[k]+(c1[k]-c0[k])*t) for k in range(3)))
            L.paste(grad,(0,0),tmp.split()[3])
            ImageDraw.Draw(L).line(pts+[pts[0]],fill=(60,38,12,255),width=int(1.6*S/1.5))
    # colours (top, bottom): clear yellow, paler near tip, deeper at base
    FA=[((250,222,120),(222,168,50)),((255,238,160),(240,196,80)),((214,152,40),(160,100,22))]
    FB=[((246,216,110),(214,160,44)),((252,232,150),(232,186,70)),((200,140,34),(150,92,20))]
    # a small crystal behind, then the main one
    polys2,_=crystal(w*0.70,h*0.77,70,150,50,math.radians(-22),2,FB); paint(polys2)
    polys,apex=crystal(w*0.44,h*0.86,150,290,105,math.radians(7),1,FA); paint(polys)
    # growth striations (horizontal fine lines) on the prism, and inner glints
    dl=ImageDraw.Draw(L)
    for k in range(14):
        yk=h*0.86-(40+k*19)*S
        dl.line([(w*0.44-52*S+k*0.8*S,yk),(w*0.44+55*S,yk-3*S)],fill=(120,80,20,60),width=2)
        G=Image.new('RGBA',(w,h),(0,0,0,0)); gd=ImageDraw.Draw(G)
    gd.polygon([(w*0.385,h*0.34),(w*0.41,h*0.33),(w*0.42,h*0.72),(w*0.395,h*0.74)],fill=(255,252,232,170))
    G=G.filter(ImageFilter.GaussianBlur(9)); Ga=np.asarray(G).astype(float); La=np.asarray(L).astype(float)
    k=(La[...,3:]/255)*(Ga[...,3:]/255)
    La[...,:3]=La[...,:3]*(1-k)+Ga[...,:3]*k; L=Image.fromarray(La.astype('uint8'),'RGBA')
    # rough broken base: a dull chunk of matrix
    base=[(w*0.15,h*0.88),(w*0.22,h*0.82),(w*0.35,h*0.84),(w*0.52,h*0.80),(w*0.66,h*0.84),(w*0.84,h*0.78),(w*0.88,h*0.86),(w*0.74,h*0.92),(w*0.5,h*0.90),(w*0.3,h*0.93),(w*0.17,h*0.92)]
    B=Image.new('RGBA',(w,h),(0,0,0,0)); ImageDraw.Draw(B).polygon(base,fill=(255,255,255,255))
    bm=np.asarray(B)[...,3]>127
    tex=0.5*noise(40,51)+0.5*noise(8,52)
    bcol=ramp(0.3+0.7*tex,[(0,(110,96,86)),(0.5,(170,152,132)),(1,(214,196,170))])
    Lr=np.asarray(L).astype(float)
    # base behind crystal: composite crystal over base
    full=np.zeros((h,w,4)); full[bm,:3]=bcol[bm]; full[bm,3]=255
    ca=Lr[...,3:]/255
    comp=full[...,:3]*(1-ca)+Lr[...,:3]*ca; alpha=np.clip(full[...,3]/255+ca[...,0],0,1)
    mask=alpha>0.5
    # outline for the base only (crystal has its own pen lines)
    out=np.ones((h,w,3))*PAPER+(noise(3,99)[...,None]-0.5)*5
    sh=np.roll(np.roll(mask,14*S,axis=0),10*S,axis=1); s=blur(sh.astype(float),24)*0.38
    out=out*(1-s[...,None]); out[mask]=comp[mask]
    mm=Image.fromarray((bm*255).astype('uint8'))
    e=np.asarray(mm.filter(ImageFilter.MaxFilter(5))).astype(int)-np.asarray(mm.filter(ImageFilter.MinFilter(5))).astype(int)
    ea=blur(np.clip(e,0,255)/255.0,1.2)*0.8
    out=out*(1-ea[...,None]*(1-ca))+np.array([44,36,34.])*ea[...,None]*(1-ca)
    Image.fromarray(np.clip(out,0,255).astype('uint8')).resize((W,H),Image.LANCZOS).save(path,'WEBP',quality=72,method=6)
    print(path,os.path.getsize(path))

if __name__=='__main__':
    d=sys.argv[1]; which=sys.argv[2:] or ['moon','tiger','rose','obs','cit']
    fn={'moon':('pietra-di-luna',moon),'tiger':('occhio-di-tigre',tiger),'rose':('quarzo-rosa',rose),'obs':('ossidiana',obsidian),'cit':('citrino',citrine)}
    for k in which: n,f=fn[k]; f(os.path.join(d,n+'.webp'))
