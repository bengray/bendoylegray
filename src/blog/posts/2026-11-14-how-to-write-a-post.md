---
title: How to write a post
description: A draft that shows the parts. It appears on the dev server and never goes live.
draft: true
---

This is a draft, so it shows up when you run `npm start` and stays out of the real build. Delete this file once you've written your first post.

## Starting a post

Make a new file in `src/blog/posts/` named with the date and a slug, like `2026-11-20-the-pond-at-herrick-lake.md`. The date in the file name becomes the post's date; the rest becomes its address, so that one would live at `/blog/the-pond-at-herrick-lake/`.

At the top, between the two `---` lines, give it a `title` and a one-line `description`. The description shows on the blog index, under the title on the post, and in the feed.

## Photos

A photo on a line of its own runs the full width of the post:

![A husky with blue eyes](/photos/skye-v2.jpg)

For a caption, use a figure:

<figure>
  <img src="/photos/attention.jpg" alt="A dog looking off camera, attentive" />
  <figcaption>&#9656; 4 &middot; Attention</figcaption>
</figure>

> A pull quote or an aside sits behind a red rule.

---

Everything else is plain Markdown: *italics*, **bold**, [links](https://serialpessimist.com), lists.
