/* proofs.js — builds the proof sheet from the JSON list in
   proofs.html, justifies the lockup, and measures the grease marks.
   fslightbox.js loads after this and picks up the links on its own. */

(function () {
  var year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();
})();

/* ---------- the lockup: one line, stretched to the paper ---------- */
(function () {
  var svg = document.getElementById("cs");
  if (!svg) return;
  var text = svg.querySelector("text");

  function justify() {
    // measure the natural width first, then pin it
    text.removeAttribute("textLength");
    var w = text.getComputedTextLength();
    if (!w || !isFinite(w)) return;
    text.setAttribute("lengthAdjust", "spacing");
    text.setAttribute("textLength", w);
    // cap height of Big Shoulders sits ~0.7em above the baseline;
    // crop the box to the ink so the lockup sits tight to the rules
    svg.setAttribute("viewBox", "0 6 " + w + " 78");
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(justify);
  } else {
    window.addEventListener("load", justify);
  }
})();

/* ---------- the sheet ---------- */
(function () {
  var data = document.getElementById("sheet-data");
  var sheet = document.getElementById("sheet");
  if (!data || !sheet) return;

  var photos;
  try {
    photos = JSON.parse(data.textContent);
  } catch (e) {
    return;
  }
  if (!Array.isArray(photos) || !photos.length) return;

  var PER_STRIP = 4;
  var keepers = 0;
  var labels = [];

  // same numbering as the front page: 1, 1A, 2, 2A...
  function label(i) {
    return Math.floor(i / 2) + 1 + (i % 2 ? "A" : "");
  }

  function el(tag, cls) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    return node;
  }

  for (var s = 0; s * PER_STRIP < photos.length; s++) {
    var chunk = photos.slice(s * PER_STRIP, s * PER_STRIP + PER_STRIP);

    var strip = el("div", "negstrip negstrip--" + (s % 2 ? "b" : "a"));
    strip.style.setProperty("--count", chunk.length);
    strip.setAttribute("role", "group");
    strip.setAttribute("aria-label", "Strip " + (s + 1));
    strip.appendChild(el("div", "perf"));

    var frames = el("div", "frames");

    chunk.forEach(function (p, j) {
      var i = s * PER_STRIP + j;
      var k = (i % 6) + 1; // six hands, round and round
      var num = label(i);
      labels.push(num);
      if (p.keeper) keepers++;

      var a = el("a", "shot frame--" + k + (p.keeper ? " is-keeper" : ""));
      a.href = p.full || p.src;
      a.setAttribute("data-fslightbox", "sheet");
      // fslightbox copies data-* onto the enlarged <img>
      a.setAttribute("data-alt", p.alt || "");
      a.style.setProperty("--i", i);

      var win = el("span", "shot__window");
      var img = document.createElement("img");
      img.src = p.src;
      img.alt = p.alt || "";
      img.decoding = "async";
      if (i >= PER_STRIP * 2) img.loading = "lazy";
      win.appendChild(img);
      win.insertAdjacentHTML(
        "beforeend",
        '<svg class="mark" viewBox="0 0 260 174" preserveAspectRatio="none" aria-hidden="true"><use href="#grease-' +
          k +
          '" /></svg>',
      );
      a.appendChild(win);

      var edge = el("span", "shot__edge");
      edge.setAttribute("aria-hidden", "true");
      var n = el("span", "shot__num");
      n.textContent = "▸ " + num + (p.keeper ? " ★" : "");
      var t = el("span", "shot__title");
      t.textContent = p.title || "";
      edge.appendChild(n);
      edge.appendChild(t);
      a.appendChild(edge);

      frames.appendChild(a);
    });

    strip.appendChild(frames);
    strip.appendChild(el("div", "perf"));
    sheet.appendChild(strip);
  }

  var strips = Math.ceil(photos.length / PER_STRIP);
  var set = function (id, txt) {
    var node = document.getElementById(id);
    if (node) node.textContent = txt;
  };
  set("log-count", photos.length);
  set("log-keepers", keepers);
  set(
    "sheet-summary",
    strips +
      (strips === 1 ? " strip" : " strips") +
      " · " +
      photos.length +
      " frames · click one to enlarge",
  );
  set("sheet-run", "→ " + labels.join(" · "));

  /* Grease marks: measure the path that actually ships, exactly like
     main.js does on the front page. */
  Array.prototype.slice
    .call(sheet.querySelectorAll(".shot"))
    .forEach(function (shot) {
      var use = shot.querySelector(".mark use");
      if (!use) return;
      var symbol = document.getElementById(
        (use.getAttribute("href") || "").slice(1),
      );
      if (!symbol) return;
      var longest = 0;
      Array.prototype.slice
        .call(symbol.querySelectorAll("path"))
        .forEach(function (path) {
          try {
            var len = path.getTotalLength();
            if (isFinite(len) && len > longest) longest = len;
          } catch (e) {}
        });
      if (longest > 0) shot.style.setProperty("--len", Math.ceil(longest) + 6);
    });

  /* the enlargement gets a little more room around it for the border */
  window.addEventListener("load", function () {
    var box = window.fsLightboxInstances && window.fsLightboxInstances.sheet;
    if (box) box.props.sourceMargin = 0.07;
  });
})();
