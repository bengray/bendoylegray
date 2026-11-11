bendoylegray.com
================

Plain HTML, CSS and JS. No build step, no dependencies. Netlify
publishes the site/ folder exactly as it is, on every push to main.

LAYOUT
------
  site/                        everything public; this IS the website
    index.html                 the front page            -> /
    work.html                  Work with me: sessions,   -> /work
                               prices, booking
    proofs.html                retired; /proofs now redirects to /
                               (see netlify.toml)
    the-work.html              portfolio                 -> /the-work
    design-engineering.html    services                  -> /design-engineering
    benjamin-gray-resume.html  résumé
    404.html                   the blank frame
    code-less-traveled/        old site, kept as a piece -> /code-less-traveled/
    assets/css/site.css        front page + Work with me: palette,
                               the ruled grid, everything
    assets/css/styles.css      older pages only (404, the-work,
                               design-engineering, resume)
    assets/css/proofs.css      retired with the proof sheet
    assets/css/home.css        retired; the old front page
    assets/js/main.js          wordmark, footer year
    assets/js/proofs.js        retired with the proof sheet
    assets/js/vendor/          third-party (fslightbox)
    photos/                    the photographs
    prints/                    portfolio screenshots for the-work
    robots.txt, sitemap.xml, favicon.svg, apple-touch-icon.png,
    og-image.png               the usual

  tools/og-card-template.html  source for og-image.png (not published)
  netlify.toml                 tells Netlify to publish site/

WORKING ON IT LOCALLY
---------------------
  cd site && python3 -m http.server
  then open localhost:8000. Clean URLs (/proofs) only work on Netlify;
  locally use /proofs.html.

CHANGING THINGS
---------------
Colours, rule weight, padding -> :root at the top of assets/css/site.css
Links, copy, prices           -> the page's .html directly
Front page photos             -> drop the file in site/photos/, then in
                                 index.html copy one <a class="shot ...">
                                 block and change href, src, alt (both
                                 places), frame number and title. The
                                 comment above the grid explains the
                                 row and size classes.
                                 is-keeper + a star marks a keeper.
Portfolio screenshots        -> site/prints/ (1600x1000 JPG):
                                  code-less-traveled.jpg
                                  crow-and-moon.jpg
                                  joel-baker.jpg
                                  ben-atlarge.jpg
                                A missing file hides its slot.
Code Less Traveled archive   -> no prices, no contact, noindex. Link to
                                it WITH the trailing slash.

HERO PHOTO ON THE FRONT PAGE
----------------------------
One photo, picked by hand. In index.html find "THE HERO PHOTO" and
change the href, the <img> src and alt, and the title. Any file in
site/photos/.

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
