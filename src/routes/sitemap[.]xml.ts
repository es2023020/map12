import { createFileRoute } from "@tanstack/react-router";

const BASE_URL = "https://proptrack1.vercel.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const sitemaps = [
          `${BASE_URL}/sitemap-projects.xml`,
          `${BASE_URL}/sitemap-destinations.xml`,
          `${BASE_URL}/sitemap-developers.xml`,
          `${BASE_URL}/sitemap-blog.xml`,
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((loc) => `  <sitemap>\n    <loc>${loc}</loc>\n  </sitemap>`).join("\n")}
</sitemapindex>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        });
      },
    },
  },
});
