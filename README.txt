bendoylegray.com
================

Built with Eleventy (11ty). The source is in src/; Eleventy builds it
into _site/, and Netlify publishes _site/ on every push to main
(see netlify.toml).

WORKING ON IT LOCALLY
---------------------
  npm install          once, and after package.json changes
  npm start            dev server at localhost:8080, reloads on save
  npm run build        a one-off build into _site/

Clean URLs (/work, /proofs) only work on Netlify; locally use
/work.html. Blog posts (/blog/...) work either way.

LAYOUT
------
  src/                          the source of the website
    index.njk                   the front page             -> /
    work.njk                    Work with me: sessions,    -> /work
                                prices, booking
    blog/index.njk              the blog index             -> /blog/
    blog/posts/*.md             the posts                  -> /blog/<slug>/
    blog/feed.njk               Atom feed                  -> /blog/feed.xml
    sitemap.njk                 sitemap.xml, posts added on their own

    _data/photos.json           the front page photos: the hero, then
                                the grid, row by row
    _data/site.json             name, URL, email, Instagram, Substack
    _includes/layouts/base.njk  <head>, top bar, footer: every built page
    _includes/layouts/post.njk  a blog post
    _includes/partials/         the top bar, the footer, one photo frame

    copied across untouched (plain HTML, not built):
    the-work.html               portfolio                  -> /the-work
    design-engineering.html     services                   -> /design-engineering
    benjamin-gray-resume.html   résumé
    404.html                    the blank frame
    proofs.html                 retired; /proofs redirects to /
    code-less-traveled/         old site, kept as a piece  -> /code-less-traveled/
    assets/css/site.css         front page, Work with me, blog: palette,
                                the ruled grid, everything
    assets/css/blog.css         blog index and posts only
    assets/css/styles.css       older pages only
    assets/css/proofs.css,
      home.css, js/proofs.js    retired
    assets/js/main.js           wordmark, footer year
    assets/js/vendor/           third-party (fslightbox)
    photos/                     the photographs
    prints/                     portfolio screenshots for the-work
    robots.txt, favicon.svg, apple-touch-icon.png, og-image.png

  tools/og-card-template.html   source for og-image.png (not published)
  eleventy.config.js            what's built, what's copied, filters
  netlify.toml                  build command, publish _site/, redirects

CHANGING THINGS
---------------
Colours, rule weight, padding -> :root at the top of src/assets/css/site.css
Copy, prices                  -> src/work.njk or src/index.njk directly
Links in the bar and footer   -> src/_includes/partials/
Email, Instagram, Substack    -> src/_data/site.json

FRONT PAGE PHOTOS
-----------------
All in src/_data/photos.json. Drop the file in src/photos/ first.

The hero is one photo, picked by hand: change "hero". Portrait
photos work best. If a head gets cropped, change "position"
(first number moves left/right, second up/down).

The grid is "rows": a list of rows, each a list of frames. A frame's
"size" says how much of the row it takes. Pair them up:
  "wide" + "narrow",  "five" + "seven",  or two "half"
Each frame:
  "file"      the file name in src/photos/
  "frame"     the frame number on its edge, e.g. "3A"
  "title"     the title on its edge
  "alt"       what's in the photo, for screen readers
  "position"  optional, nudges the crop
  "keeper"    optional, true marks a keeper (adds the star)
Rows stack on their own on a phone. Clicking a frame opens the whole
uncropped photo.

WRITING A POST
--------------
New file in src/blog/posts/, named date-then-slug:
  2026-11-20-the-pond-at-herrick-lake.md  ->  /blog/the-pond-at-herrick-lake/
At the top:
  ---
  title: The pond at Herrick Lake
  description: One line for the index, the post header and the feed.
  ---
then write in Markdown. Add  draft: true  to see it on the dev
server without publishing it. Photos go in src/photos/ like
everything else: ![What's in it](/photos/file.jpg) runs full width.
The example draft in src/blog/posts/ shows captions and the rest.

Markdown in posts runs through Nunjucks first, so a literal {{ or {%
in a post needs wrapping in {% raw %} ... {% endraw %}.

PORTFOLIO SCREENSHOTS
---------------------
src/prints/ (1600x1000 JPG):
  code-less-traveled.jpg, crow-and-moon.jpg, joel-baker.jpg,
  ben-atlarge.jpg
A missing file hides its slot.

Code Less Traveled archive: no prices, no contact, noindex. Link to
it WITH the trailing slash.

SEO NOTES
---------
og-image.png is a STOPGAP rendered in a substitute font. Open
tools/og-card-template.html, screenshot the card at exactly 1200x630
with the real typefaces, and save it over src/og-image.png.

Update the lastmod dates in src/sitemap.njk when pages change
(posts take care of themselves).

STILL TO DO
-----------
- benjamin-gray-resume.html still says hello@bendoylegray.com;
  everywhere else uses ben@.
