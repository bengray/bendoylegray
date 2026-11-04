bendoylegray.com
================

Plain HTML, CSS and JS. No build step, no dependencies. Netlify
publishes the site/ folder exactly as it is, on every push to main.

LAYOUT
------
  site/                        everything public; this IS the website
    index.html                 the front page            -> /
    proofs.html                the proof sheet           -> /proofs
    the-work.html              portfolio                 -> /the-work
    design-engineering.html    services                  -> /design-engineering
    benjamin-gray-resume.html  résumé
    404.html                   the blank frame
    code-less-traveled/        old site, kept as a piece -> /code-less-traveled/
    assets/css/styles.css      palette, paper, strips (shared)
    assets/css/proofs.css      proof sheet only
    assets/js/main.js          front page: wordmark, grease marks, plate
    assets/js/proofs.js        proof sheet: builds the strips
    assets/js/vendor/          third-party (fslightbox)
    photos/                    proof sheet photos
    photos/instagram/          written by the Instagram job, don't edit
    instagram.json             written by the Instagram job, don't edit
    prints/                    portfolio screenshots for the-work
    _headers                   Netlify caching rules
    robots.txt, sitemap.xml, favicon.svg, apple-touch-icon.png,
    og-image.png               the usual

  scripts/instagram.mjs        fetches the latest @ben.atlarge photos
  tools/og-card-template.html  source for og-image.png (not published)
  netlify.toml                 tells Netlify to publish site/
  .github/workflows/           the Instagram job

WORKING ON IT LOCALLY
---------------------
  cd site && python3 -m http.server
  then open localhost:8000. Clean URLs (/proofs) only work on Netlify;
  locally use /proofs.html.

CHANGING THINGS
---------------
Colours and the strip tilt   -> :root at the top of assets/css/styles.css
                                Past ~1.2deg the tilt stops reading
                                as a hand and starts reading as a trick.
Links, copy, dates           -> the page's .html directly
Proof sheet photos           -> drop the file in site/photos/, add a line
                                to the JSON list in proofs.html.
                                "keeper": true circles it for good;
                                "full" points the enlargement at a
                                bigger export (~2000px).
Grease marks                 -> the <svg> block of six marks lives in
                                index.html AND proofs.html. Keep them
                                in step if you redraw one.
Portfolio screenshots        -> site/prints/ (1600x1000 JPG):
                                  code-less-traveled.jpg
                                  crow-and-moon.jpg
                                  joel-baker.jpg
                                  ben-atlarge.jpg
                                A missing file hides its slot.
Code Less Traveled archive   -> no prices, no contact, noindex. Link to
                                it WITH the trailing slash.

INSTAGRAM ON THE FRONT PAGE
---------------------------
The plate rotates through site/instagram.json: the newest 5 photos
from @ben.atlarge, reels skipped. Every six hours a GitHub Action
runs scripts/instagram.mjs, which rewrites that file and
site/photos/instagram/, commits, and pushes to main. Netlify
redeploys from the push.

Secrets: IG_TOKEN (required, long-lived Instagram token) and GH_PAT
(optional, lets the job keep IG_TOKEN refreshed so it never expires).

SEO NOTES
---------
og-image.png is a STOPGAP rendered in a substitute font. Open
tools/og-card-template.html, screenshot the card at exactly 1200x630
with the real typefaces, and save it over site/og-image.png.

Update the dates in site/sitemap.xml when pages change.

STILL TO DO
-----------
- benjamin-gray-resume.html still says hello@bendoylegray.com;
  everywhere else uses ben@.
