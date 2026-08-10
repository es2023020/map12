import { createFileRoute } from "@tanstack/react-router";
import { destinations } from "@/data/destinations";

const BASE_URL = "https://proptrack1.vercel.app";

export const Route = createFileRoute("/sitemap-destinations.xml")({
  server: {
    handlers: {
      GET: async () => {
        const filters = ["off-plan", "apartments", "villas", "under-10m"];
        const paths = destinations.flatMap((d) => [
          `/destinations/${d.slug}`,
          `/ar/destinations/${d.slug}`,
          ...filters.flatMap((f) => [
            `/destinations/${d.slug}/${f}`,
            `/ar/destinations/${d.slug}/${f}`,
          ]),
        ]);
        const urls = paths
          .map(
            (p) =>
              `  <url>\n    <loc>${BASE_URL}${p}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`,
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
