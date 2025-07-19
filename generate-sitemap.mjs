import fs from "fs";
import axios from "axios";

const generateSitemap = async () => {
  const domain = "https://starlitjournals.com";

  const staticPages = [
    { url: "/", changefreq: "daily", priority: "1.0" },
    { url: "/aboutus", changefreq: "monthly", priority: "0.7" },
    { url: "/terms-of-service", changefreq: "yearly", priority: "0.3" },
    { url: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
    { url: "/journals", changefreq: "daily", priority: "0.9" },
    { url: "/stories", changefreq: "daily", priority: "0.9" },
  ];

  let journalPages = [];
  let storyPages = [];

  try {
    const res = await axios.get("http://localhost:3000/api/sitemap/journals");
    const data = res.data;

    journalPages = data.map(({ slug, author }) => ({
      url: `/journals/${author}/${slug}`,
      changefreq: "weekly",
      priority: "0.8"
    }));

    const uniqueAuthors = [...new Set(data.map(j => j.author))];
    const authorPages = uniqueAuthors.map(author => ({
      url: `/journals/${author}`,
      changefreq: "weekly",
      priority: "0.6"
    }));

    journalPages.push(...authorPages);
  } catch (err) {
    console.error("❌ Failed to fetch journal slugs:", err.message);
  }

  try {
    const res = await axios.get("http://localhost:3000/api/sitemap/stories");
    const data = res.data;

    storyPages = data.map(({ slug, author }) => ({
      url: `/stories/${author}/${slug}`,
      changefreq: "weekly",
      priority: "0.8"
    }));

    const uniqueAuthors = [...new Set(data.map(j => j.author))];
    const authorPages = uniqueAuthors.map(author => ({
      url: `/stories/${author}`,
      changefreq: "weekly",
      priority: "0.6"
    }));

    storyPages.push(...authorPages);
  } catch (err) {
    console.error("❌ Failed to fetch story slugs:", err.message);
  }

  const allPages = [...staticPages, ...journalPages, ...storyPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(page => {
    const lastMod = new Date().toISOString().split("T")[0];
    return `
  <url>
    <loc>${domain}${page.url}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  })
  .join("")}
</urlset>`;

  fs.writeFileSync("public/sitemap.xml", sitemap);
  console.log("✅ Sitemap generated with", allPages.length, "pages.");
};

generateSitemap();
