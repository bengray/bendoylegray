// Eleventy builds src/ into _site/, which Netlify publishes.
//
// What gets *built*: .njk and .md files (the front page, Work with me,
// the blog). Everything else in src/ is copied across untouched,
// including the older plain-HTML pages (404, the-work,
// design-engineering, résumé, Code Less Traveled).

export default function (eleventyConfig) {
  // ---------- copied as-is ----------
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/photos");
  eleventyConfig.addPassthroughCopy("src/prints");
  eleventyConfig.addPassthroughCopy("src/code-less-traveled");
  eleventyConfig.addPassthroughCopy("src/*.{html,txt,svg,png}");

  // ---------- drafts ----------
  // `draft: true` in a post's front matter shows it on the local dev
  // server (npm start) and leaves it out of the real build.
  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  // ---------- collections ----------
  // Newest first.
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/blog/posts/*.md").sort((a, b) => b.date - a.date)
  );

  // ---------- filters ----------
  // "Nov 14, 2026". Dates are treated as UTC so a post dated in front
  // matter never slips a day.
  eleventyConfig.addFilter("readableDate", (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    })
  );
  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString());
  eleventyConfig.addFilter("shortDate", (date) =>
    new Date(date).toISOString().slice(0, 10)
  );

  // Numbers the frames on the front page so each one develops a beat
  // after the last (the --i in site.css). Caps at 4 like the original.
  eleventyConfig.addFilter("numberShots", (rows) => {
    let i = 0;
    return rows.map((row) =>
      row.map((shot) => {
        i += 1;
        return { ...shot, i: Math.min(i, 4), eager: i <= 2 };
      })
    );
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
  };
}
