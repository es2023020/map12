import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { compounds } from "@/data/compounds";
import { destinations } from "@/data/destinations";
import { developers } from "@/data/developers";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths: string[] = [
          "/", "/map", "/projects", "/destinations", "/developers", "/dashboard", "/admin", "/auth",
          ...compounds.map((c) => `/projects/${c.slug}`),
          ...destinations.map((a) => `/destinations/${a.slug}`),
          ...developers.map((d) => `/developers/${d.slug}`),
        ];
        const urls = paths.map((p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});