<CsoundSynthesizer>
<CsOptions>
-odac -d -m0
</CsOptions>
<CsInstruments>
sr = 48000
ksmps = 64
nchnls = 2
0dbfs = 1
seed 0

gaDryL init 0
gaDryR init 0
gaRevL init 0
gaRevR init 0

; ---------- binaural (HRTF) ----------
; Measured head-related transfer functions (Csound's data set for the running
; sample rate: 44.1, 48 or 96 kHz). Sources are placed around the listener's head;
; "bin" = 1 for binaural, 0 for plain stereo.
gSHL sprintf "hrtf-%d-left.dat", sr
gSHR sprintf "hrtf-%d-right.dat", sr

; ---------- binaural room ----------
; Four room buses, one per quarter around the listener (front-right, back-right,
; back-left, front-left). Each feeds an hrtfearly room model, so a sound's wall,
; floor and ceiling reflections arrive from its own side of the room. A shared
; hrtfreverb gives the binaural late tail.
gaQ1 init 0
gaQ2 init 0
gaQ3 init 0
gaQ4 init 0

opcode RoomSend, 0, akk
  asig, kaz, kamt xin
  k1 = cos((kaz - 45)*$M_PI/180)
  k2 = cos((kaz - 135)*$M_PI/180)
  k3 = cos((kaz - 225)*$M_PI/180)
  k4 = cos((kaz - 315)*$M_PI/180)
  k1 = (k1 < 0 ? 0 : k1)
  k2 = (k2 < 0 ? 0 : k2)
  k3 = (k3 < 0 ? 0 : k3)
  k4 = (k4 < 0 ? 0 : k4)
  gaQ1 = gaQ1 + asig*k1*kamt
  gaQ2 = gaQ2 + asig*k2*kamt
  gaQ3 = gaQ3 + asig*k3*kamt
  gaQ4 = gaQ4 + asig*k4*kamt
endop

; D major pentatonic, two octaves (semitones from root)
giScale ftgen 0, 0, -8, -2, 0, 2, 4, 7, 9, 12, 14, 16

; ---------- conductor: decides when drops and harmonic tides happen ----------
instr 1
  kTime timeinsts
  kNextDrop init 0.2
  kNextPad init 0
  kNextSh init 3
  kSlow oscili 0.5, 1/97
  kSlow = kSlow + 0.5
  if kTime >= kNextDrop then
    kdur random 1.4, 3.8
    event "i", 2, 0, kdur
    kc random 0, 1
    if kc > 0.86 then
      event "i", 2, 0.08, kdur*0.8
      event "i", 2, 0.19, kdur*0.6
    endif
    kgap random 0.25, 2.6
    kNextDrop = kTime + kgap*(1.7 - 1.25*kSlow)
  endif
  if kTime >= kNextPad then
    kpd random 42, 62
    kr1 random 0, 4.99
    kr2 random 0, 7.99
    kr3 random 0, 7.99
    kn1 table int(kr1), giScale
    kn2 table int(kr2), giScale
    kn3 table int(kr3), giScale
    event "i", 4, 0, kpd, 38 + kn1
    event "i", 4, 0.7, kpd, 50 + kn2
    event "i", 4, 1.6, kpd, 57 + kn3
    kgp random 24, 36
    kNextPad = kTime + kgp
  endif
  ; shimmer: a sparkling source that circles the head
  if kTime >= kNextSh then
    ksd random 14, 22
    event "i", 5, 0, ksd
    ksg random 25, 45
    kNextSh = kTime + ksg
  endif
endin

; ---------- droplet: bubble chirp + inharmonic porcelain partials ----------
instr 2
  irnd random 0, 7.99
  isemi table int(irnd), giScale
  ; pitch varies over three octaves (lower ones more likely), slightly detuned each time
  io random 0, 1
  ioct = (io < 0.4 ? 0 : (io < 0.8 ? 1 : 2))
  idet random -0.3, 0.3
  ifreq = cpsmidinn(62 + isemi + 12*ioct + idet)
  iamp random 0.04, 0.13
  ; stereo placement: 30% toward left or right, side chosen at random per drop
  iside random 0, 1
  ipan = (iside > 0.5 ? 0.65 : 0.35)
  ; binaural placement: anywhere around the head, a little above ear level,
  ; drifting downward as it rings, like a drop falling past you
  iaz random 0, 360
  iel random -5, 50
  kel line iel, p3, iel - 30
  ; each drop also travels 50-130 degrees around you while it rings
  itrav random 50, 130
  itd random 0, 1
  itrav = (itd > 0.5 ? itrav : -itrav)
  kaz line iaz, p3, iaz + itrav
  kaz wrap kaz, 0, 360
  ; distance: near drops are louder and dry, far drops quieter and wetter
  inear random 0, 1
  igain = 0.55 + 1.1*inear
  idry = 0.35 + 0.9*inear
  iwet = 0.95 - 0.7*inear
  kf expseg ifreq*0.62, 0.035, ifreq, p3-0.035, ifreq*1.015
  aenv expseg 0.0001, 0.004, 1, p3-0.004, 0.0001
  aen2 expseg 0.0001, 0.003, 1, p3*0.35, 0.0001, p3*0.65, 0.0001
  a1 poscil aenv, kf
  a2 poscil aen2*0.2, kf*2.756
  a3 poscil aen2*0.08, kf*5.404
  asig = (a1 + a2 + a3) * iamp
  kbin chnget "bin"
  kbin port kbin, 0.3
  ; high cut: soft (3.75 kHz) in stereo; opened up in 3D, because the
  ; ear's direction cues (above / behind / in front) live above 4 kHz
  kcut chnget "cut"
  kcut = (kcut < 200 ? 3750 : kcut)
  kcut = kcut + (11000 - kcut)*kbin
  asig butlp asig, kcut
  asig butlp asig, kcut
  ; a tiny bright tick at the start of each drop gives the ear an exact position
  atk expseg 1, 0.006, 0.0001, p3-0.006, 0.0001
  an noise 1, 0
  an buthp an, 2500
  asig = asig + an*atk*iamp*0.5*kbin
  aSL, aSR pan2 asig, ipan
  aBL, aBR hrtfmove2 asig*igain, kaz, kel, gSHL, gSHR, 4, 9, sr
  aL = aSL*(1-kbin) + aBL*kbin*1.4
  aR = aSR*(1-kbin) + aBR*kbin*1.4
  RoomSend asig*igain, kaz, (0.6 + 0.8*(1-inear))*kbin
  kdry = 0.3 + (idry - 0.3)*kbin
  kwet = 0.85 + (iwet - 0.85)*kbin
  gaDryL = gaDryL + aL*kdry
  gaDryR = gaDryR + aR*kdry
  gaRevL = gaRevL + aL*kwet
  gaRevR = gaRevR + aR*kwet
endin

; ---------- water: band-passed noise breathing like waves ----------
instr 3
  kw1 oscili 1, 1/11.3
  kw2 oscili 1, 1/17.9
  kw3 oscili 1, 1/61
  kamp = 0.55 + 0.25*kw1 + 0.2*kw2
  kamp port kamp, 0.4
  kcf = 380 + 700*kamp + 250*kw3
  aNL noise 0.5, 0.7
  aNR noise 0.5, 0.7
  aL butbp aNL, kcf, kcf*0.7
  aR butbp aNR, kcf*1.07, kcf*0.7
  aSh noise 0.04, 0
  aSh butbp aSh, 3200 + 800*kw2, 1500
  kgain = kamp*kamp*0.9
  aL = aL*kgain + aSh*kamp*0.3
  aR = aR*kgain + aSh*kamp*0.3
  ; slow wave-like drift between left and right (about 26 s per cycle)
  kwp oscili 0.36, 1/26
  kwpan = 0.5 + kwp
  aL = aL * sqrt(2*(1-kwpan))
  aR = aR * sqrt(2*kwpan)
  kbw chnget "bin"
  kbw port kbw, 0.3
  kwg = 1 - 0.4*kbw
  gaDryL = gaDryL + aL*0.55*kwg
  gaDryR = gaDryR + aR*0.55*kwg
  gaRevL = gaRevL + aL*0.35*kwg
  gaRevR = gaRevR + aR*0.35*kwg
endin

; ---------- tide: slow sine chord tones that swell and fade ----------
instr 4
  ifreq = cpsmidinn(p4)
  ; each chord tone drifts slowly from one side to the other over its life
  iside random 0, 1
  ioff random 0.28, 0.42
  ipanA = (iside > 0.5 ? 0.5 - ioff : 0.5 + ioff)
  ipanB = 1 - ipanA
  kpan line ipanA, p3, ipanB
  ; binaural: each tone travels 60-140 degrees around the head over its life
  iaz0 random 0, 360
  isweep random 150, 300
  idir random 0, 1
  isweep = (idir > 0.5 ? isweep : -isweep)
  kaz line iaz0, p3, iaz0 + isweep
  kaz wrap kaz, 0, 360
  iel random -10, 25
  iatt = p3*0.4
  aenv linseg 0, iatt, 1, p3-2*iatt, 1, iatt, 0
  irate random 0.05, 0.2
  kdrift oscili 0.0025, irate
  ktone oscili 0.5, 1/23
  a1 poscil 1, ifreq*(1+kdrift)
  a2 poscil 0.7, ifreq*1.004
  a3 poscil 0.25, ifreq*2.003
  a4 poscil 0.08, ifreq*3.01
  kbin chnget "bin"
  kbin port kbin, 0.3
  ; airy upper shimmer (only in 3D): gives the ear something above 2 kHz to track
  aair noise 1, 0
  aair butbp aair, ifreq*8, ifreq*1.5
  aair = aair * (0.5 + 0.5*ktone) * 0.35 * kbin
  asig = (a1 + a2 + (a3 + a4)*(0.6 + ktone) + aair) * aenv * 0.04
  aSL, aSR pan2 asig, kpan
  aBL, aBR hrtfmove2 asig, kaz, iel, gSHL, gSHR, 4, 9, sr
  RoomSend asig, kaz, 0.7*kbin
  aL = aSL*(1-kbin) + aBL*kbin*1.25
  aR = aSR*(1-kbin) + aBR*kbin*1.25
  gaDryL = gaDryL + aL*0.6
  gaDryR = gaDryR + aR*0.6
  gaRevL = gaRevL + aL*0.5
  gaRevR = gaRevR + aR*0.5
endin

; ---------- shimmer: sparkles circling the head ----------
instr 5
  ; one or two full turns around the listener, rising and dipping
  iaz random 0, 360
  iturns random 1, 2
  idir random 0, 1
  iturns = (idir > 0.5 ? iturns : -iturns)
  kaz line iaz, p3, iaz + 360*iturns
  kaz wrap kaz, 0, 360
  kel oscili 25, 1/7.3
  kel = kel + 15
  aenv linseg 0, p3*0.25, 1, p3*0.5, 1, p3*0.25, 0
  ; sparse bright grains, tuned to the scale
  irnd random 0, 7.99
  isemi table int(irnd), giScale
  ifreq = cpsmidinn(86 + isemi)
  kdens randomi 9, 22, 0.5
  agr dust2 1, kdens
  ar1 reson agr, ifreq, ifreq*0.02, 1
  ar2 reson agr, ifreq*2.01, ifreq*0.03, 1
  ahi buthp agr, 5000
  asig = (ar1*0.6 + ar2*0.3 + ahi*0.25) * aenv * 0.35
  kbin chnget "bin"
  kbin port kbin, 0.3
  ; stereo: follow the same circle with a simple pan
  kpan = 0.5 + 0.45*sin(kaz*$M_PI/180)
  aSL, aSR pan2 asig*0.6, kpan
  aBL, aBR hrtfmove2 asig, kaz, kel, gSHL, gSHR, 4, 9, sr
  RoomSend asig, kaz, 0.8*kbin
  aL = aSL*(1-kbin) + aBL*kbin*1.4
  aR = aSR*(1-kbin) + aBR*kbin*1.4
  gaDryL = gaDryL + aL*0.7
  gaDryR = gaDryR + aR*0.7
  gaRevL = gaRevL + aL*0.25
  gaRevR = gaRevR + aR*0.25
endin

; ---------- room: binaural early reflections + late tail ----------
; Listener stands in the middle of a 10 x 10 x 3 m room (+x = right, +y = ahead);
; each bus sounds from 2.2 m away in its quarter.
instr 98
  ir = 2.2
  ic = 5
  ih = 1.7
  ip = ir*0.7071
  a1L, a1R, ilo, ihi, imfp hrtfearly gaQ1, ic+ip, ic+ip, ih, ic, ic, ih, gSHL, gSHR, 1, 8, sr, 1, 1
  a2L, a2R, i0, i1, i2 hrtfearly gaQ2, ic+ip, ic-ip, ih, ic, ic, ih, gSHL, gSHR, 1, 8, sr, 1, 1
  a3L, a3R, i3, i4, i5 hrtfearly gaQ3, ic-ip, ic-ip, ih, ic, ic, ih, gSHL, gSHR, 1, 8, sr, 1, 1
  a4L, a4R, i6, i7, i8 hrtfearly gaQ4, ic-ip, ic+ip, ih, ic, ic, ih, gSHL, gSHR, 1, 8, sr, 1, 1
  aEL = a1L + a2L + a3L + a4L
  aER = a1R + a2R + a3R + a4R
  ; late tail: binaural diffuse reverb, longer than the room's own decay for a dreamy wash
  aTin = (gaQ1 + gaQ2 + gaQ3 + gaQ4)*0.5
  aTL, aTR, idel hrtfreverb aTin, 3.2, 1.6, gSHL, gSHR, sr, imfp, 1
  aTL delay aTL, idel
  aTR delay aTR, idel
  gaDryL = gaDryL + aEL*2.2 + aTL*1.1
  gaDryR = gaDryR + aER*2.2 + aTR*1.1
  clear gaQ1, gaQ2, gaQ3, gaQ4
endin

; ---------- master: reverb, volume, fade-in, soft limit ----------
instr 99
  kvol chnget "vol"
  kvol port kvol, 0.25
  kfade linseg 0, 1.5, 1
  kbm chnget "bin"
  kbm port kbm, 0.3
  aRL, aRR reverbsc gaRevL, gaRevR, 0.9 - 0.08*kbm, 7000 + 4000*kbm
  krv = 0.9 - 0.55*kbm
  ; loudness match: the binaural mix measures quieter, so lift it to stereo level
  kmk = 1 + 0.8*kbm
  aL = (gaDryL + aRL*krv) * kvol * kfade * kmk
  aR = (gaDryR + aRR*krv) * kvol * kfade * kmk
  aL = tanh(aL)
  aR = tanh(aR)
  krms rms aL + aR
  chnset krms, "level"
  outs aL, aR
  clear gaDryL, gaDryR, gaRevL, gaRevR
endin
</CsInstruments>
<CsScore>
i 1 0 z
i 3 0 z
i 98 0 z
i 99 0 z
</CsScore>
</CsoundSynthesizer>
