import { createFileRoute } from "@tanstack/react-router";
import { blogPosts } from "@/data/blog-posts";

const BASE_URL = "https://propertyatlas.vercel.app";

export const Route = createFileRoute("/sitemap-blog.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = ["/blog", ...blogPosts.map((b) => `/blog/${b.slug}`)];
        const urls = paths
          .map(
            (p) =>
              `  <url>\n    <loc>${BASE_URL}${p}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
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
