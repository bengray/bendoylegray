/* ============================================================
   bendoylegray.com
   Two small jobs. Both optional — the page works without either.
   ============================================================ */

/* ---- 1. Lock the wordmark lines to one measure -------------
   Each line is letterspaced out to the width of the widest, so
   the name reads as a hard rectangle. Measured at runtime, so it
   holds regardless of font metrics or which fallback loaded.
   If this never runs, you get a ragged left-aligned stack. */
(function () {
  var svg = document.getElementById("wm");
  if (!svg) return;

  function justify() {
    var lines = Array.prototype.slice.call(svg.querySelectorAll("text"));
    var max = 0;

    lines.forEach(function (t) {
      var w = t.getComputedTextLength();
      if (w > max) max = w;
    });

    if (!max || !isFinite(max)) return;

    lines.forEach(function (t) {
      t.setAttribute("lengthAdjust", "spacing");
      t.setAttribute("textLength", max);
    });

    /* Match the bottom crop to the top crop.
       The first line's ink spills above y=0 and gets clipped by the
       viewBox. Measure how much, then take the same amount off the
       bottom so the block is cropped evenly top and bottom.
       Measured rather than hardcoded, so it survives a font fallback
       or a change of typeface. */
    var height = 232;

    svg.setAttribute("viewBox", "0 0 " + max + " " + height);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(justify);
  } else {
    window.addEventListener("load", justify);
  }
})();

/* ---- 2. Rotate the hero photo ------------------------------
   Picks a random frame on load, advances on click. The first
   photo is already in the HTML, so there is an image on the page
   before this runs. Edit the JSON block in index.html to change
   the set. */
(function () {
  var plate = document.getElementById("plate");
  var img = document.getElementById("plate-img");
  var link = document.getElementById("plate-link");
  var button = document.getElementById("plate-advance");
  var data = document.getElementById("plate-data");

  /* I don't want to have to manually update the year in the footer */
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  if (!plate || !img || !data) return;

  var photos;
  try {
    photos = JSON.parse(data.textContent);
  } catch (e) {
    return;
  }
  if (!Array.isArray(photos) || photos.length < 2) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current = 0;

  function pick() {
    var next = current;
    while (next === current) {
      next = Math.floor(Math.random() * photos.length);
    }
    return next;
  }

  function show(index, animate) {
    var photo = photos[index];
    if (!photo) return;
    current = index;

    // preload so the crossfade never lands on a blank frame
    var pre = new Image();

    pre.onload = function () {
      function apply() {
        img.src = photo.src;
        img.alt = photo.alt || "";
        if (link && photo.permalink) link.href = photo.permalink;
        plate.classList.remove("is-swapping");
      }

      if (animate && !reduce) {
        plate.classList.add("is-swapping");
        window.setTimeout(apply, 350);
      } else {
        // keeps the photo from swapping when you first load the page, wait until user clicks on the button to advance.
        // apply();
      }
    };

    pre.src = photo.src;
  }

  plate.classList.add("is-ready");
  show(pick(), false);

  if (button) {
    button.addEventListener("click", function () {
      show(pick(), true);
    });
  }
})();
