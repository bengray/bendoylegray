#!/usr/bin/env node
/* Pull the latest photos from @ben.atlarge for the plate on the front page.

   Run by .github/workflows/instagram.yml on a schedule. You can also run
   it by hand:  IG_TOKEN=... node scripts/instagram.mjs

   What it does:
     1. asks the Instagram API for recent posts
     2. keeps photos only (reels and videos are skipped; a carousel
        contributes its first photo)
     3. downloads the newest COUNT of them into site/photos/instagram/
        (Instagram's image URLs expire, so we keep our own copies)
     4. copies the newest one to site/photos/instagram/latest.jpg, which is
        what index.html paints before any JavaScript runs
     5. writes site/instagram.json, which main.js reads for the rotation
     6. once a day, refreshes the access token so it never hits its
        60-day expiry. The new token is written to $RUNNER_TEMP/ig_token
        for the workflow to save back as the IG_TOKEN secret.

   No dependencies. Needs Node 18+ for fetch. If anything goes wrong it
   exits non-zero BEFORE touching any files, so the site keeps whatever
   it had. */

import { mkdir, readdir, rm, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const COUNT = 5;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "site");
const DIR = path.join(SITE, "photos", "instagram");
const JSON_OUT = path.join(SITE, "instagram.json");
const API = "https://graph.instagram.com";

const token = process.env.IG_TOKEN;
if (!token) {
  console.error("IG_TOKEN is not set.");
  process.exit(1);
}

async function getJSON(url) {
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) {
    const msg = body.error ? body.error.message : res.statusText;
    throw new Error(`Instagram API: ${msg}`);
  }
  return body;
}

// 1. recent posts
const fields =
  "id,media_type,media_url,permalink,timestamp,alt_text,caption,children{media_type,media_url,alt_text}";
const feed = await getJSON(
  `${API}/me/media?fields=${encodeURIComponent(fields)}&limit=30&access_token=${token}`,
);

// 2. photos only
function pickImage(post) {
  if (post.media_type === "IMAGE") return post;
  if (post.media_type === "CAROUSEL_ALBUM") {
    const kids = (post.children && post.children.data) || [];
    return kids.find((c) => c.media_type === "IMAGE") || null;
  }
  return null; // VIDEO / reels
}

function altFor(post, image) {
  const alt = (image && image.alt_text) || post.alt_text;
  if (alt) return alt.trim();
  // fall back to the first line of the caption, minus hashtags
  const first = (post.caption || "")
    .split("\n")[0]
    .replace(/#\S+/g, "")
    .trim();
  if (first) return first.length > 140 ? first.slice(0, 137) + "..." : first;
  return "A photograph by @ben.atlarge on Instagram";
}

const picked = [];
for (const post of feed.data || []) {
  const image = pickImage(post);
  if (!image || !image.media_url) continue;
  picked.push({ post, image });
  if (picked.length === COUNT) break;
}

if (!picked.length) {
  console.error("No photos came back from Instagram. Leaving files alone.");
  process.exit(1);
}

// 3. download (all of them, before writing anything)
const downloads = [];
for (const { post, image } of picked) {
  const file = `${post.id}.jpg`;
  const dest = path.join(DIR, file);
  let buf = null;
  if (!existsSync(dest)) {
    const res = await fetch(image.media_url);
    if (!res.ok) throw new Error(`Download failed for ${post.permalink}`);
    buf = Buffer.from(await res.arrayBuffer());
  }
  downloads.push({ post, image, file, dest, buf });
}

// --- from here on we write ---
await mkdir(DIR, { recursive: true });

for (const d of downloads) {
  if (d.buf) await writeFile(d.dest, d.buf);
}

// 4. the one the page paints first
await copyFile(downloads[0].dest, path.join(DIR, "latest.jpg"));

// tidy out photos that have rolled off the end
const keep = new Set(["latest.jpg", ...downloads.map((d) => d.file)]);
for (const name of await readdir(DIR)) {
  if (!keep.has(name)) await rm(path.join(DIR, name));
}

// 5. the list main.js reads
// The newest points at latest.jpg, the same URL index.html already
// painted, so the browser doesn't fetch the same picture twice.
const list = downloads.map((d, i) => ({
  src: i === 0 ? "photos/instagram/latest.jpg" : `photos/instagram/${d.file}`,
  alt: altFor(d.post, d.image),
  permalink: d.post.permalink,
  timestamp: d.post.timestamp,
}));
await writeFile(JSON_OUT, JSON.stringify(list, null, 2) + "\n");
console.log(`Wrote ${list.length} photos to instagram.json`);

// 6. keep the token alive (once a day is plenty; it must be 24h old)
if (new Date().getUTCHours() < 6 || process.env.IG_FORCE_REFRESH) {
  try {
    const fresh = await getJSON(
      `${API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`,
    );
    const days = Math.round((fresh.expires_in || 0) / 86400);
    console.log(`Token refreshed, good for another ${days} days.`);
    if (process.env.RUNNER_TEMP && fresh.access_token) {
      await writeFile(path.join(process.env.RUNNER_TEMP, "ig_token"), fresh.access_token);
    }
  } catch (e) {
    // not fatal: the token is still valid, we'll try again tomorrow
    console.warn(`Token refresh skipped: ${e.message}`);
  }
}
