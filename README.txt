bendoylegray.com
================

Three files and a folder of photos. No build step, no dependencies,
no node_modules. Upload the folder; that's the deploy.

  index.html    the page
  styles.css    palette and layout live in :root at the top
  main.js       wordmark justification + photo rotation
  photos/       swap these out

To work on it locally, open index.html in a browser. That's it.
(If the photo rotator misbehaves from file://, run
 `python3 -m http.server` in this folder and use localhost:8000.)

CHANGING THINGS
---------------
Colours and the strip tilt   -> :root at the top of styles.css
                                Past ~1.2deg the tilt stops reading
                                as a hand and starts reading as a trick.
Photos                       -> drop files in photos/, then edit the
                                JSON block near the top of index.html
Links, copy, dates           -> index.html directly

STILL TO REPLACE
----------------
- Five "#" placeholder links (Substack, Résumé, GitHub, LinkedIn,
  Bluesky) and the footer "A machine drew this" link
- hello@bendoylegray.com, if that isn't the address
- Every date in the roles list. Those are guesses.
- All copy. It's a draft written in an impression of your voice.
- The three placeholder JPGs.

SEO NOTES
---------
Added: og:image + Twitter card, JSON-LD Person, favicon.svg,
apple-touch-icon.png, robots.txt, sitemap.xml, theme-color,
fetchpriority on the hero image, and a title that says what you do.

og-image.png is a STOPGAP rendered in a substitute font. Open
og-card-template.html, screenshot the card at exactly 1200x630 with
the real typefaces, and overwrite og-image.png with that.

Before this indexes properly you must replace:
  - 7 "#" links in index.html
  - 3 REPLACE-ME urls in the JSON-LD sameAs block (Substack,
    GitHub, LinkedIn). That block is how Google connects your
    separate profiles into one entity. It does nothing while the
    placeholders are in it.
  - the date in sitemap.xml when you publish
