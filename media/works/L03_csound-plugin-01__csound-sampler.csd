<Cabbage> bounds(0, 0, 0, 0)
form caption("simpleSampler") size(600, 300), guiMode("queue"), pluginId("TBH2") colour (255, 255, 255, 255)

filebutton bounds(253, 12, 114, 37) channel("loadfile"), file("./irishStew.wav") text("Load Sample", "Load Sample"), corners(5)
button bounds(253, 54, 116, 32) channel("play"), text("Play", "Stop"), corners(5)
soundfiler bounds(386, 10, 171, 108), channel("soundfiler1")

rslider bounds(284, 122, 57, 65) channel("speed1") range(-1, 1, 1, 1, 0.001) text("speed")
vslider bounds(544, 8, 60, 118) channel("gain") range(0, 1, 0.5, 1, 0.001)



vmeter bounds(16, 14, 14, 242) channel("vu1") value(0) outlineColour(0, 0, 0), overlayColour(0, 0, 0) meterColour:0(255, 0, 0) meterColour:1(255, 255, 0) meterColour:2(0, 255, 0) outlineThickness(1) 
vmeter bounds(36, 14, 14, 242) channel("vu2") value(0) outlineColour(0, 0, 0), overlayColour(0, 0, 0) meterColour:0(255, 0, 0) meterColour:1(255, 255, 0) meterColour:2(0, 255, 0) outlineThickness(1) 

;Effect-Delay
rslider bounds(148, 164, 59, 60) channel("delaysend") range(0, 1, 0, 1, 0.001)   text("delay send")
rslider bounds(72, 164, 59, 60) channel("delaytime") range(0.01, 3, 0.5, 1, 0.001)  text("delay time")
s
;Effect
rslider bounds(74, 18, 59, 60) channel("rslider10004") range(0, 1, 0, 1, 0.001), text("Freq")
rslider bounds(146, 18, 59, 60) range(0, 10, 0.5, 1, 0.001), text("Rate"), channel("rate")
rslider bounds(72, 88, 59, 60) range(0, 1, 0.5, 1, 0.001), text("Intensity"), channel("intensity")

vslider bounds(368, 128, 50, 150) channel("att") range(0, 1, 0, 1, 0.001)
vslider bounds(418, 128, 50, 150) channel("dec") range(0, 1, 0, 1, 0.001)
vslider bounds(468, 128, 50, 150) channel("sus") range(0, 1, 0, 1, 0.001)
vslider bounds(518, 128, 50, 150) channel("rel") range(0, 1, 0, 1, 0.001)

rslider bounds(146, 88, 60, 60) channel("reverb") range(0, 1, 0, 1, 0.001), text("Reverb")



</Cabbage>
<CsoundSynthesizer>
<CsOptions>
-n -d -+rtmidi=NULL -M0 --midi-key=4 --midi-velocity-amp=5 -m0d
</CsOptions>
<CsInstruments>
; Initialize the global variables. 
ksmps = 32
nchnls = 2
0dbfs = 1

; Initialize global variables for meters and delay
gadelay init 0
gameterL init 0
gameterR init 0

instr 1
    ; Load sample to soundfiler
    SFilename, kLoadFile cabbageGetValue "loadfile"
    cabbageSet kLoadFile, "soundfiler1", "file", SFilename

    ; Trigger playback of sample
    kPlayState, kPlayTrig cabbageGetValue "play"
    if kPlayTrig == 1 then
        if kPlayState == 1 then
            event "i", "SamplePlayback", 0, -1
        else
            turnoff2 nstrnum("SamplePlayback"), 0, 0
        endif
    endif
endin

instr SamplePlayback
    SFile cabbageGetValue "loadfile"
    if strlen(SFile) == 0 then
        turnoff
    else
        kSpeed chnget "speed1"
        a1, a2 diskin2 SFile, kSpeed, 0, 1
        kGain chnget "gain"
        
        ; Apply ADSR envelope
        katt chnget "att"
        kdec chnget "dec"
        ksus chnget "sus"
        krel chnget "rel"
        kEnv madsr .1, .2, .7, .4
        
        ; Apply LFO modulation to gain
        kRate chnget "lforate"
        kIntensity chnget "lfointensity"
        aLFO lfo kIntensity, kRate, 5
        a1 = a1 * (1 + aLFO) * kEnv
        a2 = a2 * (1 + aLFO) * kEnv
        
        ; Output signal
        outs a1 * kGain, a2 * kGain
        
        ; Update global variables for effects
        gameterL = gameterL + a1
        gameterR = gameterR + a2
        gadelay = gadelay + (a1 + a2) * chnget("delaysend")
    endif
endin

instr meters
    ; Update VU meters
    k1 rms gameterL, 20
    k2 rms gameterR, 20
    cabbageSetValue "vu1", portk(k1, 0.25)
    cabbageSetValue "vu2", portk(k2, 0.25)
    clear gameterL
    clear gameterR
endin

instr delay
    ; Simple delay effect
    kDelayTime chnget "delaytime"
    adelay comb gadelay, kDelayTime, 0.5
    outs adelay, adelay
    clear gadelay
endin

instr reverb
    ; Apply reverb
    kVerb chnget "reverb"
endin
</CsInstruments>
<CsScore>
; Run Csound indefinitely
f0 z
i1 0 z
</CsScore>
</CsoundSynthesizer>
