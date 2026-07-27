import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { blogPosts } from "@/data/blog-posts";
import { buildBreadcrumbSchema, getCanonicalUrl } from "@/lib/seo";
import { BookOpen, Calendar, Clock, ArrowRight, Tag } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  head: () => {
    const canonicalUrl = getCanonicalUrl("/blog");
    const pageTitle = "Real Estate Blog & Market Intelligence Guides | PropTrack";
    const metaDesc = "Expert real estate analysis, off-plan compound reviews, location comparison guides, and payment plan strategies for Egyptian property buyers.";

    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "Home", item: "/" },
      { name: "Blog", item: "/blog" },
    ]);

    return {
      meta: [
        { title: pageTitle },
        { name: "description", content: metaDesc },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: pageTitle },
        { property: "og:description", content: metaDesc },
        { property: "og:url", content: canonicalUrl },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbSchema),
        },
      ],
    };
  },
  component: BlogIndexPage,
});

function BlogIndexPage() {
  return (
    <Shell>
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent mb-2">
            <BookOpen className="h-4 w-4" /> Market Intelligence & Insights
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
            PropTrack Real Estate Journal
          </h1>
          <p className="mt-3 text-sm sm:text-lg text-primary-foreground/80 max-w-2xl leading-relaxed">
            Data-backed investment analysis, compound comparisons, and financial breakdowns for Egypt's prime property market.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden bg-secondary">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground shadow-md">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {post.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-snug mb-3">
                    {post.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={post.author.avatar} alt={post.author.name} className="h-6 w-6 rounded-full object-cover" />
                    <span className="text-xs font-medium text-foreground">{post.author.name}</span>
                  </div>

                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-accent group-hover:translate-x-1 transition-transform"
                  >
                    Read Article <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Shell>
  );
}
