// generate-sitemap.js
import { writeFileSync } from "fs";
import { SitemapStream, streamToPromise } from "sitemap";

async function generateSitemap() {
  // Create a stream
  const sitemap = new SitemapStream({ hostname: "https://newsbengineering.netlify.app" });

  // ✅ Add only real, accessible routes
  sitemap.write({ url: "/", changefreq: "weekly", priority: 1.0 });
  sitemap.write({ url: "/our-work", changefreq: "weekly", priority: 0.8 });
  sitemap.write({ url: "/about", changefreq: "monthly", priority: 0.6 });
  // sitemap.write({ url: "/contact", changefreq: "monthly", priority: 0.6 });

  // Finish writing
  sitemap.end();

  // Convert to XML
  const xml = (await streamToPromise(sitemap)).toString();

  // Save to public folder (so it’s served at https://www.yourdomain.com/sitemap.xml)
  writeFileSync("./public/sitemap.xml", xml, "utf8");

  console.log("✅ Sitemap generated at public/sitemap.xml");
}

generateSitemap();
