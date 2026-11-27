/* salomezhang.com: Tide on this site. The piece and its controller are loaded from
   tide.salomezhang.com (see the end of index.html). This file starts it from the ENTER screen,
   quiets it where the site has sound of its own, and runs the Tide window. */
(function () {
  function $(id) { return document.getElementById(id); }

  /* ---------- quiet where the site has its own sound (site.js says when) ---------- */
  function applyVol() { if (window.Tide) window.Tide.quiet(window.SITE.hasOwnSound()); }
  var tideReady = new Promise(function (res) {
    if (window.Tide) res(); else window.addEventListener('tide-ready', res, { once: true });
  });
  tideReady.then(applyVol);
  window.addEventListener('site-sound', applyVol);

  /* ---------- the Tide window: closed by its dot, dragged by its title bar (not on phones) ---------- */
  $('tideClose').addEventListener('click', function () { if (window.Tide) window.Tide.controller(false); });
  (function () {
    var win = $('controller'), bar = win.querySelector('.bar'), from = null;
    bar.addEventListener('pointerdown', function (e) {
      if (innerWidth <= 600 || e.target.closest('button')) return;
      var r = win.getBoundingClientRect();
      from = { dx: e.clientX - r.left, dy: e.clientY - r.top };
      win.style.transform = 'none'; win.style.left = r.left + 'px'; win.style.top = r.top + 'px';
      win.classList.add('dragging'); bar.setPointerCapture(e.pointerId); e.preventDefault();
    });
    bar.addEventListener('pointermove', function (e) {
      if (!from) return;
      win.style.left = Math.min(Math.max(e.clientX - from.dx, 8 - win.offsetWidth + 80), innerWidth - 80) + 'px';
      win.style.top = Math.min(Math.max(e.clientY - from.dy, 52), innerHeight - 40) + 'px';
    });
    function end() { from = null; win.classList.remove('dragging'); }
    bar.addEventListener('pointerup', end); bar.addEventListener('pointercancel', end);
  })();

  /* ---------- the ENTER screen ----------
     Browsers only allow sound after a click, and ENTER is that click. It is shown on every
     arrival and every reload. Only coming back with the browser's back or forward button
     goes straight to the desktop, with Tide paused; PLAY starts it. */
  var enter = $('enter');
  function cameBack() { var nav = performance.getEntriesByType('navigation')[0]; return !!nav && nav.type === 'back_forward'; }
  function leaveEnter() {
    window.dispatchEvent(new Event('site-entered'));                 /* site.js starts the video, if it has not */
    enter.classList.add('leaving');                                  /* fades out (style.css) */
    setTimeout(function () { enter.hidden = true; }, 750);
  }
  function enterWithSound() {
    var done = false;
    function finish() { if (done) return; done = true; applyVol(); leaveEnter(); }
    /* open the sound inside this click, so the browser lets it begin once it has loaded */
    if (window.Tide && window.Tide.unlock) window.Tide.unlock();
    $('go').disabled = true;
    $('note').textContent = window.Tide && window.Tide.loaded ? 'starting…' : 'loading the sound…';
    tideReady.then(function () { return window.Tide.start(); }).then(finish, finish);
    setTimeout(finish, 8000);                                        /* never keep a visitor waiting here; the sound follows */
  }
  if (cameBack()) { enter.hidden = true; window.dispatchEvent(new Event('site-entered')); $('status').textContent = 'Paused. PLAY starts the sound.'; }
  $('go').addEventListener('click', enterWithSound);
  $('skip').addEventListener('click', leaveEnter);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !enter.hidden && !enter.classList.contains('leaving') && !$('go').disabled) { e.preventDefault(); enterWithSound(); }
  });
})();
