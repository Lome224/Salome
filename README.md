# salomezhang.com

Portfolio website of **Salome Yichi Zhang**, Creative Technologist · Researcher · Composer.

Live at **https://salomezhang.com** (hosted with GitHub Pages).

## What's here

The site is a single static page styled as a black-and-white Frutiger Aero desktop: glass folders for Art, Research, Film Music, About, CV and Contact, a draggable `readme.txt` statement, and a looping video backdrop.

Pressing **ENTER** starts *Tide*, a generative Csound piece that runs live in the browser. The piece is not stored in this repository: the home page loads it from [tide.salomezhang.com](https://tide.salomezhang.com) (code at [Lome224/Tide](https://github.com/Lome224/Tide)), so it updates here whenever Tide does. The bar at the bottom left has play, volume, a menu of five sounds, binaural on/off, and the full controller. Tide keeps playing in every window and goes quiet only in the Listening Room, on work pages with their own audio, or while a track plays. Tide also has an entry in the Lab folder.

The **Listening Room** plays ten tracks with seekable players.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | The page's frame: the banner, windows, icons and the Tide bar |
| `style.css` | How the site looks |
| `content.js` | Everything visitors read (`window.SITE`): statement, lists, every work page |
| `site.js` | The site's behaviour: windows, work pages, players, dragging |
| `tide.js` | Tide on this site: the ENTER screen, the Tide window, quieting Tide where the site has its own sound |
| `media/backdrop.mp4` | Background video loop |
| `media/salome.jpg` | About photo |
| `media/CV_Salome_Zhang.pdf` | CV |
| `media/audio/` | Listening Room tracks (128 kbps MP3) |
| `CNAME` | Custom domain for GitHub Pages |

## Editing

All text lives in the `window.SITE` object in `content.js`: statement, project lists, Listening Room tracks, About bio and contact. Change it there and push; GitHub Pages redeploys in about a minute.

Add `?tune` to the URL to open a panel for adjusting the video brightness, saturation, contrast and icon grey.

## Run locally

```
python3 -m http.server
```

then open http://localhost:8000. (Opening the file directly works too, but audio seeking needs a server.)

© 2026 Salome Yichi Zhang
