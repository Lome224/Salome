# salomezhang.com

Portfolio website of **Salome Yichi Zhang**, Creative Technologist · Researcher · Composer.

Live at **https://salomezhang.com** (hosted with GitHub Pages).

## What's here

The site is a single static page styled as a black-and-white Frutiger Aero desktop: glass folders for Art, Research, Film Music, About, CV and Contact, a draggable `readme.txt` statement, and a looping video backdrop.

Pressing **ENTER** starts *Tide*, a generative Csound piece that runs live in the browser (via [@csound/browser](https://www.npmjs.com/package/@csound/browser)). It fades out whenever a window is open.

The **Listening Room** plays ten tracks with seekable players.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | The whole site: layout, styles, content and scripts |
| `tide.csd` | Source of the *Tide* soundscape (also embedded in `index.html`) |
| `media/backdrop.mp4` | Background video loop |
| `media/salome.jpg` | About photo |
| `media/CV_Salome_Zhang.pdf` | CV |
| `media/audio/` | Listening Room tracks (128 kbps MP3) |
| `CNAME` | Custom domain for GitHub Pages |

## Editing

All text lives in the `window.SITE` object near the top of the second `<script>` in `index.html`: statement, project lists, Listening Room tracks, About bio and contact. Change it there and push; GitHub Pages redeploys in about a minute.

Add `?tune` to the URL to open a panel for adjusting the video brightness, saturation, contrast and icon grey.

## Run locally

```
python3 -m http.server
```

then open http://localhost:8000. (Opening the file directly works too, but audio seeking needs a server.)

© 2026 Salome Yichi Zhang
