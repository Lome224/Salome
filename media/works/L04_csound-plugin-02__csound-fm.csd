<Cabbage> bounds(0, 0, 0, 0)
form caption("FM Synthesis") size(620, 260), guiMode("queue"),colour("white"), pluginId("SZInstrument01")
keyboard bounds(4, 144, 381, 95)
groupbox bounds(2, 44, 303, 95), text("Mod Env"), colour(211, 211, 211, 255){ channel("groupbox3")
rslider bounds(22, 24, 60, 60) range(0, 1, 0.01, 1, 0.001), text("Att."), channel("modatt") trackerColour(136, 229, 136, 255)
rslider bounds(92, 24, 60, 60) range(0, 1, 0.5, 1, 0.001), text("Dec."), channel("moddec") trackerColour(136, 229, 136, 255)
rslider bounds(162, 24, 60, 60) range(0, 1, 0.2, 1, 0.001), text("Sus."), channel("modsus") trackerColour(136, 229, 136, 255)
rslider bounds(232, 24, 60, 60) range(0, 1, 0.1, 1, 0.001), text("Rel."), channel("modrel") trackerColour(136, 229, 136, 255)
}

groupbox bounds(312, 44, 303, 95), text("Car Env"), colour(211, 211, 211, 255){ channel("groupbox10")
rslider bounds(22, 24, 60, 60) range(0, 1, 0.001, 1, 0.001), text("Att."), channel("aatt") trackerColour(136, 229, 136, 255)
rslider bounds(92, 24, 60, 60) range(0, 1, 0.4, 1, 0.001), text("Dec."), channel("adec") trackerColour(136, 229, 136, 255)
rslider bounds(162, 24, 60, 60) range(0, 1, 0.5, 1, 0.001), text("Sus."), channel("asus") trackerColour(136, 229, 136, 255)
rslider bounds(232, 24, 60, 60) range(0, 1, 0.5, 1, 0.001), text("Rel."), channel("arel") trackerColour(136, 229, 136, 255)
}
rslider bounds(532, 148, 68, 68) range(0, 1, .4, 1, 0.001), text("Gain"), channel("gain") trackerColour(136, 229, 136, 255)
rslider bounds(464, 148, 68, 68) range(0, 10, 1, 1, 0.001), text("Mod Factor"), channel("modfactor") trackerColour(136, 229, 136, 255)
rslider bounds(396, 148, 68, 68) range(0, 20, 0, 1, 0.001), text("Mod Index"), channel("modindex") trackerColour(136, 229, 136, 255)
vmeter bounds(394, 224, 212, 17), value(0), channel("vu1"), overlayColour(0, 0, 0, 255), , , meterColour:0(136, 229, 136, 255) meterColour:1(231, 234, 39, 255) meterColour:2(237, 223, 254, 255)

;8UI
combobox bounds(6, 10, 100, 25), populate("*.snaps") automatable(0) channel("combo13") channelType("string") value("1")
filebutton bounds(116, 10, 60, 25), text("Save", "Save"), populate("*.snaps", "test"), mode("named snapshot")
filebutton bounds(176, 10, 60, 25), text("Remove"), populate("*.snaps", "test"), mode("remove snapshot")

</Cabbage>
<CsoundSynthesizer>
<CsOptions>
-n -d -+rtmidi=NULL -M0 -m0d --midi-key-cps=4 --midi-velocity-amp=5
</CsOptions>
<CsInstruments>
; Initialize the global variables. 
ksmps = 32
nchnls = 2
0dbfs = 1

aout inch 1

sr = 44100
ksmps = 128
nchnls = 2
0dbfs = 1


instr 1 

ifreq = p4  

kmodfactor chnget "modfactor"
kmodindex chnget "modindex"
; Mod envelope 
kmodatt chnget "modatt"
kmoddec chnget "moddec"
kmodsus chnget "modsus"
kmodrel chnget "modrel"
amodenv madsr i(kmodatt), i(kmoddec), i(kmodsus), i(kmodrel)

kmodfreq = kmodfactor*ifreq
; Index = Am * fc/fm
kmodamp = kmodindex*kmodfactor*ifreq
; Modulator 2
amod poscil amodenv*kmodamp, kmodfreq

;Carrier amp envelope
kaatt chnget "aatt"
kadec chnget "adec"
kasus chnget "asus"
karel chnget "arel"
aenv madsr i(kaatt), i(kadec), i(kasus), i(karel)

; Carrier
aout poscil aenv, ifreq+amod


klevel chnget "gain"

k1 rms aout, 20

cabbageSetValue "vu1", portk(k1*10, .25), metro(10)

outs aout*klevel, aout*klevel
endin
</CsInstruments>
<CsScore>
;causes Csound to run for about 7000 years...
f0 z
</CsScore>
</CsoundSynthesizer>
