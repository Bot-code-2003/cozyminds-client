import fs from "fs";
import axios from "axios";

const generateSitemap = async () => {
  const domain = "https://starlitjournals.com";

  // Static pages
  const staticPages = [
    { url: "/", changefreq: "daily", priority: "1.0" },
    { url: "/aboutus", changefreq: "monthly", priority: "0.7" },
    { url: "/cozyshop", changefreq: "daily", priority: "0.8" },
    { url: "/terms-of-service", changefreq: "yearly", priority: "0.3" },
    { url: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
    { url: "/starlitblogs", changefreq: "weekly", priority: "0.7" },
    { url: "/public-journals", changefreq: "daily", priority: "0.9" },
    { url: "/features", changefreq: "monthly", priority: "0.5" },

  ];

  // Blog posts - you can make this dynamic if you have a lot of posts
  const blogPosts = [
    'easy-journaling-prompts-feel-happier',
    'journal-like-pro-keep-cozy',
    'writing-about-pets-feel-calm',
    'cozy-journaling-spot-you-love',
    'fun-gratitude-prompts-smile',
    'morning-journaling-rituals-calm-productive-day',
    'cozy-evening-journaling-better-sleep'
  ].map(slug => ({
    url: `/blog/${slug}`,
    changefreq: "monthly",
    priority: "0.6"
  }));


  // Fetch public journal slugs
  let publicJournals = [];
  try {
    // This assumes your local server is running on port 3000
    const response = await axios.get("http://localhost:3000/api/sitemap/journals");
    publicJournals = response.data.map(slug => ({
      url: `/public-journal/${slug}`,
      changefreq: "weekly",
      priority: "0.8"
    }));
  } catch (error) {
    console.error("Could not fetch public journals. Is the server running?", error.message);
    // Continue without dynamic journal pages
  }

  const allPages = [...staticPages, ...blogPosts, ...publicJournals];

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
  console.log("Sitemap generated successfully!");
};

generateSitemap(); 