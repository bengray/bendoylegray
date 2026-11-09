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

    var height = +svg.getAttribute("data-height") || 232;

    svg.setAttribute("viewBox", "0 0 " + max + " " + height);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(justify);
  } else {
    window.addEventListener("load", justify);
  }
})();

(function () {
  var frames = Array.prototype.slice.call(document.querySelectorAll(".frame, .shot, .rate__mark"));
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
  /* I don't want to have to manually update the year in the footer */
  var year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();
})();
