/* salomezhang.com: the site's behaviour: windows, work pages, players, dragging, and starting Tide.
   Reads its content from content.js (window.SITE). */
(function () {
  var S = window.SITE;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* ---------- static content ---------- */
  /* every item, including the loop point, gets the same dot and the same space */
  var line = [S.name].concat(S.roles.split(' · ')).map(function (t) {
    return '<span class="it">' + esc(t) + '</span><span class="sep" aria-hidden="true">·</span>';
  }).join('');
  var half = '<span>' + line.repeat(8) + '</span>';
  $('track').innerHTML = half + half;
  $('statement').innerHTML = S.statement;

  var bg = $('bg');
  bg.src = S.media.video;
  bg.addEventListener('error', function () { bg.removeAttribute('src'); });
  var p = bg.play(); if (p && p.catch) p.catch(function () {});

  var ICON = { tide: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNTAgMTEyIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iYmQiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM2YTZhNmEiLz48c3RvcCBvZmZzZXQ9IjAuNDUiIHN0b3AtY29sb3I9IiMxZTFlMWUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDAiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InJpbSIgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2QwZDBkMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzNhM2EzYSIvPjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ2wiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmZmZmYiIHN0b3Atb3BhY2l0eT0iMC41Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50Pgo8cmFkaWFsR3JhZGllbnQgaWQ9InNoIiBjeD0iMC41IiBjeT0iMC41IiByPSIwLjUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzAwMCIgc3RvcC1vcGFjaXR5PSIwLjYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDAiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPGVsbGlwc2UgY3g9Ijc1IiBjeT0iMTA1IiByeD0iNTIiIHJ5PSI1IiBmaWxsPSJ1cmwoI3NoKSIvPgo8Y2lyY2xlIGN4PSI3NSIgY3k9IjU0IiByPSI0NiIgZmlsbD0idXJsKCNiZCkiIHN0cm9rZT0idXJsKCNyaW0pIiBzdHJva2Utd2lkdGg9IjEuNCIvPgo8ZyBmaWxsPSJub25lIiBzdHJva2U9IiM5YTlhOWEiIHN0cm9rZS13aWR0aD0iMSI+PGNpcmNsZSBjeD0iNzUiIGN5PSI1NCIgcj0iMTIiLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjU0IiByPSIyMSIvPjxjaXJjbGUgY3g9Ijc1IiBjeT0iNTQiIHI9IjMwIi8+PGNpcmNsZSBjeD0iNzUiIGN5PSI1NCIgcj0iMzkiLz48L2c+CjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDk4YSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj4KPHBhdGggZD0iTTc1IDQyIEExMiAxMiAwIDAgMSA4NS40IDYwIiBzdHJva2Utd2lkdGg9IjMiLz4KPHBhdGggZD0iTTc1IDMzIEEyMSAyMSAwIDEgMSA1Ni44IDY0LjUiIHN0cm9rZS13aWR0aD0iMi40Ii8+CjxwYXRoIGQ9Ik03NSAyNCBBMzAgMzAgMCAwIDEgMTA0LjUgNDguOCIgc3Ryb2tlLXdpZHRoPSIzLjQiLz4KPHBhdGggZD0iTTc1IDE1IEEzOSAzOSAwIDAgMSAxMDguOCA3My41IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9nPgo8cGF0aCBkPSJNNzUgOS41IEE0NC41IDQ0LjUgMCAwIDEgMTE5IDQ3IFE3NSA1OCAzMSA0NyBBNDQuNSA0NC41IDAgMCAxIDc1IDkuNSBaIiBmaWxsPSJ1cmwoI2dsKSIvPgo8L3N2Zz4=', folder: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAgMTA0Ij4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iYmsiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM1YTVhNWEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwYzBjMGMiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImZyIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjOGE4YThhIi8+PHN0b3Agb2Zmc2V0PSIwLjQyIiBzdG9wLWNvbG9yPSIjMmIyYjJiIi8+PHN0b3Agb2Zmc2V0PSIwLjQzIiBzdG9wLWNvbG9yPSIjMTIxMjEyIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDAwMDAwIi8+PC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJnbCIgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIwLjc1Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBzdG9wLW9wYWNpdHk9IjAuMDQiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBwIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjY2ZjZmNmIi8+PC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJyaW0iIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNkOGQ4ZDgiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMzYTNhM2EiLz48L2xpbmVhckdyYWRpZW50Pgo8cmFkaWFsR3JhZGllbnQgaWQ9InNoIiBjeD0iMC41IiBjeT0iMC41IiByPSIwLjUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzAwMCIgc3RvcC1vcGFjaXR5PSIwLjYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDAiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0iZ2xvdyIgY3g9IjAuNSIgY3k9IjEiIHI9IjAuNTUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIwLjI4Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+CjxlbGxpcHNlIGN4PSI4MCIgY3k9Ijk4IiByeD0iNjYiIHJ5PSI1LjUiIGZpbGw9InVybCgjc2gpIi8+CjxwYXRoIGQ9Ik0xOCAxNCBRMTggOCAyNCA4IEg1OCBRNjIgOCA2NSAxMSBMNzEgMTcgSDEzNiBRMTQyIDE3IDE0MiAyMyBWODYgSDE4IFoiIGZpbGw9InVybCgjYmspIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS4yIi8+CjxwYXRoIGQ9Ik0yMCAxNSBRMjAgMTAgMjUgMTAgSDU3IiBzdHJva2U9IiNiZGJkYmQiIHN0cm9rZS1vcGFjaXR5PSIwLjciIHN0cm9rZS13aWR0aD0iMS4yIiBmaWxsPSJub25lIi8+CjxyZWN0IHg9IjMwIiB5PSIyMiIgd2lkdGg9Ijk4IiBoZWlnaHQ9IjUyIiByeD0iMiIgZmlsbD0idXJsKCNwcCkiIHRyYW5zZm9ybT0icm90YXRlKC0zIDc5IDQ4KSIgc3Ryb2tlPSIjOGM4YzhjIiBzdHJva2Utd2lkdGg9IjAuOCIvPgo8cmVjdCB4PSIzNiIgeT0iMjgiIHdpZHRoPSI5MiIgaGVpZ2h0PSI1MCIgcng9IjIiIGZpbGw9IiNmZmZmZmYiIHRyYW5zZm9ybT0icm90YXRlKDIgODIgNTMpIiBzdHJva2U9IiM5YTlhOWEiIHN0cm9rZS13aWR0aD0iMC44Ii8+CjxwYXRoIGQ9Ik0xMCAzOCBRMTAgMzMgMTUgMzMgSDE0NSBRMTUwIDMzIDE1MCAzOCBMMTQ2IDg4IFExNDUuNSA5NCAxMzkuNSA5NCBIMjAuNSBRMTQuNSA5NCAxNCA4OCBaIiBmaWxsPSJ1cmwoI2ZyKSIgc3Ryb2tlPSJ1cmwoI3JpbSkiIHN0cm9rZS13aWR0aD0iMS40Ii8+CjxwYXRoIGQ9Ik0xMC42IDM4IFExMC42IDMzLjYgMTUgMzMuNiBIMTQ1IFExNDkuNCAzMy42IDE0OS40IDM4IEwxNDggNTUgUTgwIDYyIDEyIDU1IFoiIGZpbGw9InVybCgjZ2wpIi8+CjxwYXRoIGQ9Ik0xNCA4OCBMMTIuNSA2NiBRODAgNzQgMTQ3LjUgNjYgTDE0NiA4OCBRMTQ1LjUgOTQgMTM5LjUgOTQgSDIwLjUgUTE0LjUgOTQgMTQgODggWiIgZmlsbD0idXJsKCNnbG93KSIvPgo8cGF0aCBkPSJNMTYgMzQuOCBIMTQ0IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjk1IiBzdHJva2Utd2lkdGg9IjEuMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=', file: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDQgMTI4Ij4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGciIHgxPSIwIiB5MT0iMCIgeDI9IjAuNiIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzVjNWM1YyIvPjxzdG9wIG9mZnNldD0iMC40NSIgc3RvcC1jb2xvcj0iIzFlMWUxZSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwMCIvPjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0iY24iIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmZmZmYiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM4ZThlOGUiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImdsIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBzdG9wLW9wYWNpdHk9IjAuNiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJsbiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIyNiIgeTE9IjAiIHgyPSI3OCIgeTI9IjAiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzhhOGE4YSIvPjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icmltIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZDBkMGQwIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjM2EzYTNhIi8+PC9saW5lYXJHcmFkaWVudD4KPHJhZGlhbEdyYWRpZW50IGlkPSJzaCIgY3g9IjAuNSIgY3k9IjAuNSIgcj0iMC41Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwMDAiIHN0b3Atb3BhY2l0eT0iMC42Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDAwIiBzdG9wLW9wYWNpdHk9IjAiLz48L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+CjxlbGxpcHNlIGN4PSI1MiIgY3k9IjEyMiIgcng9IjQwIiByeT0iNSIgZmlsbD0idXJsKCNzaCkiLz4KPHBhdGggZD0iTTE4IDggSDY2IEw5MCAzMiBWMTEyIFE5MCAxMTcgODUgMTE3IEgxOSBRMTQgMTE3IDE0IDExMiBWMTIgUTE0IDggMTggOCBaIiBmaWxsPSJ1cmwoI3BnKSIgc3Ryb2tlPSJ1cmwoI3JpbSkiIHN0cm9rZS13aWR0aD0iMS40Ii8+CjxwYXRoIGQ9Ik02NiA4IFYyNyBRNjYgMzIgNzEgMzIgSDkwIFoiIGZpbGw9InVybCgjY24pIiBzdHJva2U9IiM1NTUiIHN0cm9rZS13aWR0aD0iMS4xIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxnIHN0cm9rZT0idXJsKCNsbikiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjc1Ij4KPHBhdGggZD0iTTI2IDUwIEg3OCIvPjxwYXRoIGQ9Ik0yNiA2MiBINzgiLz48cGF0aCBkPSJNMjYgNzQgSDcwIi8+PHBhdGggZD0iTTI2IDg2IEg3OCIvPjxwYXRoIGQ9Ik0yNiA5OCBINjAiLz4KPC9nPgo8cGF0aCBkPSJNMTggOS41IEg2NSBWMzAgUTUwIDQ0IDE1LjUgNDYgVjEyIFExNS41IDkuNSAxOCA5LjUgWiIgZmlsbD0idXJsKCNnbCkiLz4KPC9zdmc+Cg==', mail: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNTAgMTEyIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iYmQiIHgxPSIwIiB5MT0iMCIgeDI9IjAiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM3YTdhN2EiLz48c3RvcCBvZmZzZXQ9IjAuNDUiIHN0b3AtY29sb3I9IiMyNjI2MjYiLz48c3RvcCBvZmZzZXQ9IjAuNDYiIHN0b3AtY29sb3I9IiMxMTEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDAiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImZsIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZmZmZmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOWM5YzljIi8+PC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJnbCIgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIwLjg1Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz48L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InJpbSIgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2QwZDBkMCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzNhM2EzYSIvPjwvbGluZWFyR3JhZGllbnQ+CjxyYWRpYWxHcmFkaWVudCBpZD0ic2giIGN4PSIwLjUiIGN5PSIwLjUiIHI9IjAuNSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMDAwIiBzdG9wLW9wYWNpdHk9IjAuNiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwMCIgc3RvcC1vcGFjaXR5PSIwIi8+PC9yYWRpYWxHcmFkaWVudD4KPHJhZGlhbEdyYWRpZW50IGlkPSJkb3QiIGN4PSIwLjM1IiBjeT0iMC4zIiByPSIwLjc1Ij48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmZmZmYiLz48c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iI2JkYmRiZCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzNjM2MzYyIvPjwvcmFkaWFsR3JhZGllbnQ+CjwvZGVmcz4KPGVsbGlwc2UgY3g9Ijc1IiBjeT0iMTA1IiByeD0iNjAiIHJ5PSI1IiBmaWxsPSJ1cmwoI3NoKSIvPgo8cmVjdCB4PSIxMiIgeT0iMjIiIHdpZHRoPSIxMjYiIGhlaWdodD0iNzgiIHJ4PSI5IiBmaWxsPSJ1cmwoI2JkKSIgc3Ryb2tlPSJ1cmwoI3JpbSkiIHN0cm9rZS13aWR0aD0iMS40Ii8+CjxwYXRoIGQ9Ik0xNCA5NiBMNjIgNTggUTc1IDQ5IDg4IDU4IEwxMzYgOTYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMzUiIHN0cm9rZS13aWR0aD0iMiIvPgo8cGF0aCBkPSJNMTYgMjYgTDY2IDYzIFE3NSA3MCA4NCA2MyBMMTM0IDI2IFExMzIgMjMgMTI4IDIzIEgyMiBRMTggMjMgMTYgMjYgWiIgZmlsbD0idXJsKCNmbCkiIHN0cm9rZT0iIzRhNGE0YSIgc3Ryb2tlLXdpZHRoPSIxLjEiLz4KPHBhdGggZD0iTTIxIDIzLjUgSDEyOSBRMTM0IDIzLjUgMTM1LjUgMjggTDEyOCAzNCBRNzUgNDYgMjIgMzQgTDE0LjUgMjggUTE2IDIzLjUgMjEgMjMuNSBaIiBmaWxsPSJ1cmwoI2dsKSIvPgo8Y2lyY2xlIGN4PSIxMjgiIGN5PSIyNCIgcj0iMTIiIGZpbGw9InVybCgjZG90KSIgc3Ryb2tlPSIjMjIyIiBzdHJva2Utd2lkdGg9IjEuMSIvPgo8ZWxsaXBzZSBjeD0iMTI1IiBjeT0iMTkiIHJ4PSI2IiByeT0iMy41IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuODUiLz4KPC9zdmc+Cg==' };
  S.icons.forEach(function (it) {
    var el;
    if (it.link) {
      el = document.createElement('a');
      el.href = it.link === 'cv' ? S.media.cv : it.link;
      el.target = '_blank'; el.rel = 'noopener';
    } else {
      el = document.createElement('button');
      el.type = 'button';
      el.addEventListener('click', it.tide ? function () { if (window.Tide) window.Tide.controller(); } : function () { openWin(it.open); });
    }
    el.className = 'icon';
    el.innerHTML = '<img src="' + ICON[it.kind] + '" alt=""><span class="label glass">' + esc(it.label) + '</span>';
    $('icons').appendChild(el);
  });

  /* ---------- windows ---------- */
  function slug(t) { return String(t).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function rows(list) {
    /* newest first: by end year ('present' = now), then start year; undated last */
    function yrs(y) {
      var m = String(y || '').match(/\d{4}/g) || [];
      var end = /present/i.test(y) ? 9999 : (m.length ? +m[m.length - 1] : -1);
      return [end, m.length ? +m[0] : -1];
    }
    list = list.map(function (r, k) { return [r, k]; }).sort(function (a, b) {
      var A = yrs(a[0][2]), B = yrs(b[0][2]);
      return (B[0] - A[0]) || (B[1] - A[1]) || (a[1] - b[1]);
    }).map(function (x) { return x[0]; });
    return '<div class="rows">' + list.map(function (r) {
      var k = slug(r[0]);
      var t = (S.works && S.works[k]) ? '<a class="wl" href="#w/' + k + '">' + esc(r[0]) + '</a>' : esc(r[0]);
      return '<div class="row"><div>' + t + '<br><span class="m">' + esc(r[1]) + '</span></div>' +
             '<div class="y">' + esc(r[2]) + '</div><div class="r">' + esc(r[3]) + '</div></div>';
    }).join('') + '</div>';
  }
  function xlink(label, href) {
    var ext = !/^#/.test(href);
    return '<a class="el" href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(label) + (ext ? ' ↗' : ' →') + '</a>';
  }
  function ent(r) {
    var L = r[5] || {};
    var name = L.href ? '<a class="en" href="' + esc(L.href) + '" target="_blank" rel="noopener">' + esc(r[1]) + ' ↗</a>' : esc(r[1]);
    var head = '<b>' + name + '</b>' + (r[2] ? '<br>' + esc(r[2]) : '') + (r[3] ? '<br><i>' + esc(r[3]) + '</i>' : '');
    var pts = r[4] && r[4].length ? '<ul>' + r[4].map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '';
    var more = (L.work ? [xlink(L.work[1], '#w/' + L.work[0])] : []).concat((L.links || []).map(function (x) { return xlink(x[0], x[1]); }));
    return '<div class="ent"><div>' + esc(r[0]) + '</div><div>' + head + pts + (more.length ? '<div class="els">' + more.join('') + '</div>' : '') + '</div></div>';
  }
  var VIEWS = {
    'art': { title: 'Art', html: function () { return rows(S.art); } },
    'lab': { title: 'Lab', html: function () { return rows(S.research); } },
    'scoring-post': { title: 'Scoring & Post', html: function () {
      return '<a class="lr-link" href="#listening-room">Listening Room →</a>' +
             '<div class="sub">Selected</div>' + rows(S.filmSelected) +
             '<div class="sub">All Film</div>' + rows(S.filmAll) +
             '<div class="sub">Rescore</div>' + rows(S.filmRescore) +
             '<div class="sub">Sound Design & Post</div>' + rows(S.filmPost);
    } },
    'listening-room': { title: 'Listening Room', wide: true, html: function () {
      return '<a class="lr-link" href="#scoring-post">← Scoring & Post</a>' +
             '<div class="track-row" style="opacity:.6"><div>#</div><div>Name</div><div>Player</div><div>Style</div></div>' +
        S.tracks.map(function (t, i) {
          var n = (i + 1 < 10 ? '0' : '') + (i + 1);
          return '<div class="track-row"><div>' + n + '</div><div>' + esc(t[0]) + '</div>' +
                 '<div class="pl" data-src="' + esc(t[2]) + '" data-d="' + (t[3] || 0) + '"><button class="pb" type="button" aria-label="Play">▶</button>' +
                 '<div class="bar"><i></i></div><span class="t">0:00 / ' + fmt(t[3] || 0) + '</span></div>' +
                 '<div>' + esc(t[1]) + '</div></div>';
        }).join('');
    } },
    'about': { title: S.name, wide: true, html: function () {
      var A = S.about;
      var secs = A.sections.map(function (s) {
        var inner = s.text ? s.text.map(function (t) { return '<p>' + t + '</p>'; }).join('') : s.rows.map(ent).join('');
        return '<div class="sec"><h3>' + esc(s.title) + '</h3>' + inner + '</div>';
      }).join('');
      return '<div class="about"><div><img src="' + esc(S.media.photo) + '" alt="Salome Yichi Zhang" onerror="var a=this.closest(\'.about\');a.classList.add(\'nophoto\');this.parentNode.remove()"></div>' +
             '<div><h2>' + esc(S.name) + '</h2><p class="roles">' + esc(S.roles) + '</p>' +
             A.bio.map(function (t) { return '<p>' + t + '</p>'; }).join('') + '</div></div>' + secs +
             '<a class="cvlink lr-link" href="' + esc(S.media.cv) + '" target="_blank" rel="noopener">View Full CV ↗</a>';
    } },
    'contact': { title: 'Contact', html: function () {
      var C = S.contact;
      return '<div class="contact"><div><div class="k">Contact</div>' +
             '<a href="mailto:' + esc(C.email) + '">' + esc(C.email) + '</a><br><br>' + esc(C.phone) + '</div>' +
             '<div><div class="k">Based in</div>' + esc(C.based) + '</div></div>' +
             '<p style="margin-top:18px;opacity:.6">© 2026 ' + esc(S.name) + '</p>';
    } }
  };

  /* ---------- work pages (third layer) ---------- */
  var PARENT = { art: 'Art', lab: 'Lab', 'scoring-post': 'Scoring & Post' };
  function docView(k) {
    var w = S.works && S.works[k], d = w && w.doc;
    if (!d) return null;
    return { title: w.title + ' · Documentation', wide: true, quiet: false, html: function () {
      var h = '<a class="lr-link" href="#w/' + k + '">← ' + esc(w.title) + '</a><div class="work' + (d.plain ? ' plain' : '') + '">';
      h += '<h2>' + esc(w.title) + '</h2><p class="meta">' + esc(d.sub || 'Documentation') + '</p>';
      if (d.lead) h += '<p class="lead">' + esc(d.lead) + '</p>';
      (d.sections || []).forEach(function (sec) {
        h += '<div class="sec2' + (sec.gamma ? ' gcard' : '') + (sec.divider ? ' divider' : '') + '"><h3>' + esc(sec.title) + '</h3>' + sec.html + '</div>';
      });
      var f = [['Year', w.year], ['Role', w.role], ['Details', w.note]].filter(function (x) { return x[1]; });
      if (f.length) h += '<dl class="facts">' + f.map(function (x) { return '<dt>' + x[0] + '</dt><dd>' + esc(x[1]) + '</dd>'; }).join('') + '</dl>';
      var used = (d.sections || []).map(function (x) { return x.html; }).join(' ');
      var L = (w.docs || []).concat(w.links || []).filter(function (x) { return used.indexOf(x.href) < 0; });
      if (L.length) h += '<div class="wd">' + L.map(function (x) {
        return '<a class="lr-link" href="' + esc(x.href) + '" target="_blank" rel="noopener"' + (x.download ? ' download' : '') + '>' + esc(x.label) + ' ↗</a>';
      }).join('') + '</div>';
      if (w.tags && w.tags.length) h += '<div class="tags">' + w.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>';
      return h + '<a class="lr-link" href="#w/' + k + '" style="margin-top:18px">← Back to ' + esc(w.title) + '</a></div>';
    } };
  }
  function workView(k) {
    var dm = /^(.+)\/documentation$/.exec(k);
    if (dm) return docView(dm[1]);
    var w = S.works && S.works[k];
    if (!w) return null;
    return { title: w.title, wide: true, quiet: !!(w.vimeo || w.video || (w.audio && w.audio.length)), html: function () {
      var h = '<a class="lr-link" href="#' + w.parent + '">← ' + esc(PARENT[w.parent] || 'Back') + '</a><div class="work">';
      h += '<h2>' + esc(w.title) + '</h2>' + (w.sub ? '<p class="meta">' + esc(w.sub) + '</p>' : '');
      if (w.vimeo) {
        h += '<div class="vid"><iframe src="https://player.vimeo.com/video/' + esc(w.vimeo) +
             '?dnt=1&title=0&byline=0&portrait=0&color=ffd27a" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy" title="' + esc(w.title) + '"></iframe></div>';
      }
      else if (w.video) {
        h += '<div class="vid"><video controls playsinline preload="metadata"' + (w.video.poster ? ' poster="' + esc(w.video.poster) + '"' : '') +
             ' src="' + esc(w.video.src) + '"></video></div>';
      }
      function fig(im, cls) {
        var img = '<img src="' + esc(im.src) + '" alt="' + esc(im.alt || w.title) + '" loading="lazy">';
        if (im.full) img = '<a href="' + esc(im.full) + '" target="_blank" rel="noopener" title="Open full size">' + img + '</a>';
        return '<figure' + (cls ? ' class="' + cls + '"' : '') + '>' + img +
               (im.alt ? '<figcaption>' + esc(im.alt) + '</figcaption>' : '') + '</figure>';
      }
      var hasVid = !!(w.vimeo || w.video);
      if (w.image && !hasVid) h += fig(w.image);
      (w.desc || []).forEach(function (p) { h += '<p>' + esc(p) + '</p>'; });
      /* works with a documentation page (fourth layer) keep this page to the video and description */
      if (w.doc) return h + '<a class="lr-link doclink" href="#w/' + k + '/documentation">' + esc(w.doc.linkLabel || 'Process & technical documentation') + ' →</a></div>';
      if (w.image && hasVid && w.imageWithVideo) h += fig(w.image, 'side');
      /* longer write-ups (trusted HTML written for the site) */
      (w.sections || []).forEach(function (sec) {
        h += '<div class="sec2' + (sec.gamma ? ' gcard' : '') + (sec.divider ? ' divider' : '') + '"><h3>' + esc(sec.title) + '</h3>' + sec.html + '</div>';
      });
      if (w.image2) h += fig(w.image2);
      var f = [['Year', w.year], ['Role', w.role], ['Details', w.note]].filter(function (x) { return x[1]; });
      if (f.length) h += '<dl class="facts">' + f.map(function (x) { return '<dt>' + x[0] + '</dt><dd>' + esc(x[1]) + '</dd>'; }).join('') + '</dl>';
      if (w.audio && w.audio.length) {
        h += '<div class="wa"><div class="sub" style="margin-top:0">Listen</div>' + w.audio.map(function (a) {
          return '<div class="track-row"><div>' + esc(a.title) + '</div>' +
                 '<div class="pl" data-src="' + esc(a.src) + '" data-d="' + (a.dur || 0) + '"><button class="pb" type="button" aria-label="Play">▶</button>' +
                 '<div class="bar"><i></i></div><span class="t">0:00 / ' + fmt(a.dur || 0) + '</span></div></div>';
        }).join('') + '</div>';
      }
      /* scores are shown inline so visitors can read them on the page */
      var shown = [];
      [['score', 'Score', 'Scores', 'Open full score ↗'], ['documentation', 'Documentation', 'Documentation', 'Open full document ↗']].forEach(function (g) {
        var list = (w.docs || []).filter(function (d) { return /\.pdf$/i.test(d.href) && new RegExp(g[0], 'i').test(d.label); });
        if (!list.length) return;
        shown = shown.concat(list);
        h += '<div class="sub">' + (list.length > 1 ? g[2] : g[1]) + '</div>' + list.map(function (d) {
          return (list.length > 1 ? '<div class="pdfcap">' + esc(d.label.replace(/\s*·\s*full score$/i, '')) + '</div>' : '') +
                 '<div class="pdf"><iframe src="' + esc(d.href) + '#view=FitH&navpanes=0" title="' + esc(d.label) + '" loading="lazy"></iframe></div>' +
                 '<a class="lr-link" href="' + esc(d.href) + '" target="_blank" rel="noopener">' + g[3] + '</a>';
        }).join('');
      });
      var L = (w.docs || []).filter(function (d) { return shown.indexOf(d) < 0; }).concat(w.links || []);
      if (L.length) h += '<div class="wd">' + L.map(function (d) {
        return '<a class="lr-link" href="' + esc(d.href) + '" target="_blank" rel="noopener"' + (d.download ? ' download' : '') + '>' + esc(d.label) + ' ↗</a>';
      }).join('') + '</div>';
      if (w.tags && w.tags.length) h += '<div class="tags">' + w.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>';
      if (!hasVid && !w.image && !(w.audio && w.audio.length) && !(w.desc && w.desc.length)) h += '<p class="soon">Media coming soon.</p>';
      return h + '</div>';
    } };
  }

  /* looping clips (GIF replacements) load only when scrolled near */
  var loopIO = null;
  function lazyLoops() {
    var vs = [].slice.call($('panelBody').querySelectorAll('video[data-lazy]'));
    function go(v) { v.src = v.getAttribute('data-lazy'); v.removeAttribute('data-lazy'); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    if (loopIO) loopIO.disconnect();
    if (!('IntersectionObserver' in window)) { vs.forEach(go); return; }
    loopIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { loopIO.unobserve(e.target); go(e.target); } });
    }, { root: $('panelBody'), rootMargin: '400px 0px' });
    vs.forEach(function (v) { loopIO.observe(v); });
  }
  var current = null, currentQuiet = false;
  function openWin(name) {
    var v = VIEWS[name] || (name.indexOf('w/') === 0 ? workView(name.slice(2)) : null);
    if (!v) { closeWin(); return; }
    stopTracks();
    current = name; currentQuiet = !!v.quiet;
    $('panelTitle').textContent = v.title;
    $('panelBody').innerHTML = v.html();
    $('panelBody').scrollTop = 0;
    lazyLoops();
    $('panel').classList.toggle('wide', !!v.wide);
    $('panel').classList.add('show');
    document.body.classList.add('has-window');
    if (location.hash !== '#' + name) { try { history.replaceState(null, '', '#' + name); } catch (e) {} }
    applyVol();
  }
  function closeWin() {
    stopTracks();
    current = null; currentQuiet = false;
    $('panel').classList.remove('show');
    document.body.classList.remove('has-window');
    if (location.hash && location.hash !== '#tune') { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
    applyVol();
  }
  $('close').addEventListener('click', closeWin);
  document.addEventListener('click', function (e) {
    if (current && !e.target.closest('#panel, #icons, #banner, .controls, #controller, #tune, #enter')) closeWin();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeWin(); });
  window.addEventListener('hashchange', route);
  function route() {
    var h = location.hash.slice(1);
    if (VIEWS[h] || (h.indexOf('w/') === 0 && workView(h.slice(2)))) openWin(h); else if (current) closeWin();
  }

  /* listening room players */
  function fmt(x) { x = Math.max(0, Math.floor(x || 0)); return Math.floor(x / 60) + ':' + ('0' + x % 60).slice(-2); }
  var player = new Audio(), cur = null;
  player.preload = 'auto';
  function dur(pl) { return (isFinite(player.duration) && cur === pl && player.duration) || +pl.getAttribute('data-d') || 0; }
  function paint(pl, t) {
    var d = dur(pl);
    pl.querySelector('.bar i').style.width = (d ? Math.min(100, t / d * 100) : 0) + '%';
    pl.querySelector('.t').textContent = fmt(t) + ' / ' + fmt(d);
  }
  function setBtn(pl, playing) {
    var b = pl.querySelector('.pb'); b.textContent = playing ? '❚❚' : '▶';
    b.setAttribute('aria-label', playing ? 'Pause' : 'Play'); pl.classList.toggle('on', playing);
  }
  function stopTracks() { player.pause(); if (cur) { setBtn(cur, false); paint(cur, 0); } cur = null; }
  function load(pl) {
    if (cur === pl) return;
    stopTracks(); cur = pl; player.src = pl.getAttribute('data-src');
  }
  function play(pl) {
    load(pl);
    player.play().then(function () { setBtn(pl, true); })
      .catch(function () { pl.classList.add('bad'); pl.querySelector('.t').textContent = 'unavailable'; });
  }
  $('panelBody').addEventListener('click', function (e) {
    var b = e.target.closest('.pb'); if (!b) return;
    var pl = b.closest('.pl');
    if (cur === pl && !player.paused) { player.pause(); setBtn(pl, false); } else play(pl);
  });
  var seeking = null;
  function seekTo(e) {
    var r = seeking.querySelector('.bar').getBoundingClientRect();
    var t = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * dur(seeking);
    paint(seeking, t);
    if (cur === seeking) { try { player.currentTime = t; } catch (x) {} }
    return t;
  }
  $('panelBody').addEventListener('pointerdown', function (e) {
    var bar = e.target.closest('.bar'); if (!bar) return;
    var pl = bar.closest('.pl'); seeking = pl;
    bar.setPointerCapture(e.pointerId); e.preventDefault();
    var wasPlaying = cur === pl && !player.paused;
    if (cur !== pl) { load(pl); var t = seekTo(e); player.addEventListener('loadedmetadata', function f() { player.removeEventListener('loadedmetadata', f); player.currentTime = t; }); play(pl); }
    else { seekTo(e); if (!wasPlaying) play(pl); }
  });
  $('panelBody').addEventListener('pointermove', function (e) { if (seeking) seekTo(e); });
  ['pointerup', 'pointercancel'].forEach(function (n) { $('panelBody').addEventListener(n, function () { seeking = null; }); });
  player.addEventListener('timeupdate', function () { if (cur && !seeking) paint(cur, player.currentTime); });
  player.addEventListener('loadedmetadata', function () { if (cur) paint(cur, player.currentTime); });
  player.addEventListener('ended', stopTracks);
  ['play', 'pause', 'ended'].forEach(function (n) { player.addEventListener(n, applyVol); });

  /* ---------- draggable statement ---------- */
  var root = document.documentElement, drag = null;
  var tuneMode = /tune/.test(location.search) || location.hash === '#tune';
  function pos() {
    var r = $('readme').getBoundingClientRect();
    return [Math.round(r.left / innerWidth * 1000) / 10, Math.round(r.top / innerHeight * 1000) / 10];
  }
  $('readmeBar').addEventListener('pointerdown', function (e) {
    if (innerWidth <= 600) return;
    var r = $('readme').getBoundingClientRect();
    drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
    $('readme').classList.add('dragging');
    $('readmeBar').setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  $('readmeBar').addEventListener('pointermove', function (e) {
    if (!drag) return;
    var w = $('readme').offsetWidth, h = $('readme').offsetHeight;
    var x = Math.min(Math.max(e.clientX - drag.dx, 8), innerWidth - w - 8);
    var y = Math.min(Math.max(e.clientY - drag.dy, 52), innerHeight - h - 8);
    root.style.setProperty('--rx', (x / innerWidth * 100) + 'vw');
    root.style.setProperty('--ry', (y / innerHeight * 100) + 'vh');
    showTune();
  });
  var moved = false;
  function placeDefault() {
    if (moved || innerWidth <= 600) return;
    var h = $('readme').offsetHeight;
    var y = Math.max(56, Math.min(innerHeight * 0.6, innerHeight - h - 70));
    root.style.setProperty('--ry', y + 'px');
  }
  placeDefault(); addEventListener('resize', placeDefault);
  if (document.fonts) document.fonts.ready.then(placeDefault);
  function endDrag() { if (drag) moved = true; drag = null; $('readme').classList.remove('dragging'); }
  $('readmeBar').addEventListener('pointerup', endDrag);
  $('readmeBar').addEventListener('pointercancel', endDrag);

  /* ---------- tuning panel (?tune or #tune) ---------- */
  var T = { bri: .57, sat: 1.4, con: 1.14, icon: .55 };
  function showTune() {
    if (!tuneMode) return;
    var p = pos();
    $('tuneOut').textContent = 'BRI ' + T.bri + '  SAT ' + T.sat + '  CON ' + T.con + '  ICON ' + T.icon + '  POS ' + p[0] + ' ' + p[1];
  }
  if (tuneMode) {
    $('tune').style.display = 'block';
    [].forEach.call(document.querySelectorAll('#tune input'), function (inp) {
      var k = inp.getAttribute('data-k'); inp.value = T[k];
      inp.addEventListener('input', function () { T[k] = parseFloat(inp.value); root.style.setProperty('--' + k, T[k]); showTune(); });
    });
    showTune();
  }

  /* ---------- Tide ----------
     The piece and its controller are loaded from tide.salomezhang.com (see the end of index.html).
     This site only starts it, and quiets it where the site has sound of its own:
     the Listening Room, work pages with video or audio, and while a track plays. */
  function quiet() { return current === 'listening-room' || currentQuiet || (typeof player !== 'undefined' && player && !player.paused); }
  function applyVol() { if (window.Tide) window.Tide.quiet(quiet()); }
  var tideReady = new Promise(function (res) {
    if (window.Tide) res(); else window.addEventListener('tide-ready', res, { once: true });
  });
  tideReady.then(applyVol);

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
     Browsers only allow sound after a click, and ENTER is that click. It is shown once per
     visit (per tab). Coming back to the page later in the same visit, for example with the
     back button, goes straight to the desktop with Tide paused; PLAY starts it. */
  var enter = $('enter');
  function visited() { try { return sessionStorage.getItem('tideSeen') === '1'; } catch (e) { return false; } }
  function leaveEnter() {
    try { sessionStorage.setItem('tideSeen', '1'); } catch (e) {}
    enter.classList.add('leaving');                                  /* fades out (style.css) */
    setTimeout(function () { enter.hidden = true; }, 750);
  }
  function enterWithSound() {
    var done = false;
    function finish() { if (done) return; done = true; applyVol(); leaveEnter(); }
    $('go').disabled = true; $('note').textContent = 'starting…';
    tideReady.then(function () { return window.Tide.start(); }).then(finish, finish);
    setTimeout(finish, 6000);                                        /* never keep a visitor waiting here */
  }
  if (visited()) { enter.hidden = true; $('status').textContent = 'Paused. PLAY starts the sound.'; }
  $('go').addEventListener('click', enterWithSound);
  $('skip').addEventListener('click', leaveEnter);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !enter.hidden && !enter.classList.contains('leaving') && !$('go').disabled) { e.preventDefault(); enterWithSound(); }
  });

  route();
})();
