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

    var height = 232;

    svg.setAttribute("viewBox", "0 0 " + max + " " + height);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(justify);
  } else {
    window.addEventListener("load", justify);
  }
})();

(function () {
  var frames = Array.prototype.slice.call(document.querySelectorAll(".frame"));
  if (!frames.length) return;

  frames.forEach(function (frame) {
    var use = frame.querySelector(".mark use");
    if (!use) return;

    var href = use.getAttribute("href") || use.getAttribute("xlink:href");
    if (!href || href.charAt(0) !== "#") return;

    var symbol = document.getElementById(href.slice(1));
    if (!symbol) return;

    var longest = 0;
    Array.prototype.slice
      .call(symbol.querySelectorAll("path"))
      .forEach(function (path) {
        var len;
        try {
          len = path.getTotalLength();
        } catch (e) {
          return;
        }
        if (isFinite(len) && len > longest) longest = len;
      });

    if (longest > 0) {
      frame.style.setProperty("--len", Math.ceil(longest) + 6);
    }
  });
})();

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

  function advanceFrame() {
    console.log("current = ", current);
    console.log("length = ", photos.length - 1);
    if (current != photos.length - 1) {
      return current + 1;
    } else {
      current = 0;
      return 0;
    }
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
        apply();
      }
    };

    pre.src = photo.src;
  }

  plate.classList.add("is-ready");
  /* Frame 0 is the one already painted in the markup, so opening on it costs no second request and no flash. Going through show() rather than assuming the state keeps `current` honest, so the first click advances from what the visitor is actually looking at. */
  show(0, false);

  if (button) {
    button.addEventListener("click", function () {
      show(advanceFrame(), true);
    });
  }
})();
