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

; D major pentatonic, two octaves (semitones from root)
giScale ftgen 0, 0, -8, -2, 0, 2, 4, 7, 9, 12, 14, 16

; ---------- conductor: decides when drops and harmonic tides happen ----------
instr 1
  kTime timeinsts
  kNextDrop init 0.2
  kNextPad init 0
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
  iel random -5, 45
  kel line iel, p3, iel - 22
  kf expseg ifreq*0.62, 0.035, ifreq, p3-0.035, ifreq*1.015
  aenv expseg 0.0001, 0.004, 1, p3-0.004, 0.0001
  aen2 expseg 0.0001, 0.003, 1, p3*0.35, 0.0001, p3*0.65, 0.0001
  a1 poscil aenv, kf
  a2 poscil aen2*0.2, kf*2.756
  a3 poscil aen2*0.08, kf*5.404
  asig = (a1 + a2 + a3) * iamp
  ; high cut on the droplets only
  kcut chnget "cut"
  kcut = (kcut < 200 ? 3750 : kcut)
  asig butlp asig, kcut
  asig butlp asig, kcut
  kbin chnget "bin"
  kbin port kbin, 0.3
  aSL, aSR pan2 asig, ipan
  aBL, aBR hrtfmove2 asig, iaz, kel, gSHL, gSHR, 4, 9, sr
  aL = aSL*(1-kbin) + aBL*kbin*1.25
  aR = aSR*(1-kbin) + aBR*kbin*1.25
  gaDryL = gaDryL + aL*0.3
  gaDryR = gaDryR + aR*0.3
  gaRevL = gaRevL + aL*0.85
  gaRevR = gaRevR + aR*0.85
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
  gaDryL = gaDryL + aL*0.55
  gaDryR = gaDryR + aR*0.55
  gaRevL = gaRevL + aL*0.35
  gaRevR = gaRevR + aR*0.35
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
  isweep random 60, 140
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
  asig = (a1 + a2 + (a3 + a4)*(0.6 + ktone)) * aenv * 0.04
  kbin chnget "bin"
  kbin port kbin, 0.3
  aSL, aSR pan2 asig, kpan
  aBL, aBR hrtfmove2 asig, kaz, iel, gSHL, gSHR, 4, 9, sr
  aL = aSL*(1-kbin) + aBL*kbin*1.25
  aR = aSR*(1-kbin) + aBR*kbin*1.25
  gaDryL = gaDryL + aL*0.6
  gaDryR = gaDryR + aR*0.6
  gaRevL = gaRevL + aL*0.5
  gaRevR = gaRevR + aR*0.5
endin

; ---------- master: reverb, volume, fade-in, soft limit ----------
instr 99
  kvol chnget "vol"
  kvol port kvol, 0.25
  kfade linseg 0, 1.5, 1
  aRL, aRR reverbsc gaRevL, gaRevR, 0.9, 7000
  aL = (gaDryL + aRL*0.9) * kvol * kfade
  aR = (gaDryR + aRR*0.9) * kvol * kfade
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
i 99 0 z
</CsScore>
</CsoundSynthesizer>
