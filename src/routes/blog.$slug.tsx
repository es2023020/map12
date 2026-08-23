import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { getBlogPostBySlug } from "@/data/blog-posts";
import { compoundBySlug } from "@/data/compounds";
import { destinationBySlug } from "@/data/destinations";
import { buildBreadcrumbSchema, getCanonicalUrl } from "@/lib/seo";
import { ArrowLeft, Calendar, Clock, User, Tag, Building2, MapPin, Share2 } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPostBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const canonicalUrl = getCanonicalUrl(`/blog/${loaderData.slug}`);

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: loaderData.title,
      description: loaderData.excerpt,
      image: [loaderData.image],
      datePublished: loaderData.publishedAt,
      author: {
        "@type": "Organization",
        name: loaderData.author.name,
      },
      publisher: {
        "@type": "Organization",
        name: "Property Atlas",
        logo: {
          "@type": "ImageObject",
          url: "https://propertyatlas.vercel.app/logo.png",
        },
      },
    };

    const breadcrumbSchema = buildBreadcrumbSchema([
      { name: "Home", item: "/" },
      { name: "Blog", item: "/blog" },
      { name: loaderData.title, item: `/blog/${loaderData.slug}` },
    ]);

    return {
      meta: [
        { title: `${loaderData.title} | Property Atlas Journal` },
        { name: "description", content: loaderData.excerpt },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.excerpt },
        { property: "og:image", content: loaderData.image },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: canonicalUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(articleSchema),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbSchema),
        },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();

  const relatedProjectObjects = (post.relatedProjects || [])
    .map((slug) => compoundBySlug(slug))
    .filter(Boolean);

  const relatedDestinationObjects = (post.relatedDestinations || [])
    .map((slug) => destinationBySlug(slug))
    .filter(Boolean);

  return (
    <Shell>
      {/* Article Header */}
      <div className="bg-primary text-primary-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-primary-foreground/70 hover:text-accent mb-6 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Articles
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground">
              {post.category}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-primary-foreground/80 pt-4 border-t border-white/10">
            <span className="flex items-center gap-1.5 font-medium">
              <User className="h-4 w-4 text-accent" /> {post.author.name}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {post.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readTime}
            </span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Cover Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg mb-10 h-[300px] sm:h-[420px]">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        </div>

        {/* Article Markdown Render */}
        <div className="prose prose-slate lg:prose-lg max-w-none dark:prose-invert">
          {post.content.split("\n\n").map((paragraph, idx) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={idx} className="font-display text-2xl font-bold text-foreground mt-8 mb-4">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h3
                  key={idx}
                  className="font-display text-xl font-semibold text-foreground mt-6 mb-3"
                >
                  {paragraph.replace("### ", "")}
                </h3>
              );
            }
            if (paragraph.startsWith("- ")) {
              return (
                <ul key={idx} className="list-disc pl-6 space-y-2 my-4 text-foreground/80">
                  {paragraph.split("\n").map((line, i) => (
                    <li key={i}>{line.replace("- ", "")}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} className="text-foreground/80 leading-relaxed my-4">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Internal Cross-Linking Widgets */}
        {(relatedProjectObjects.length > 0 || relatedDestinationObjects.length > 0) && (
          <div className="mt-14 pt-8 border-t border-border space-y-6">
            <h3 className="font-display text-xl font-bold text-foreground">
              Featured Developments & Locations Mentioned
            </h3>

            {relatedDestinationObjects.length > 0 && (
              <div>
                <span className="text-xs uppercase font-semibold text-muted-foreground block mb-3">
                  Explore Destinations
                </span>
                <div className="flex flex-wrap gap-2">
                  {relatedDestinationObjects.map((d: any) => (
                    <Link
                      key={d.slug}
                      to="/destinations/$slug"
                      params={{ slug: d.slug }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-primary hover:border-accent hover:text-accent transition-colors"
                    >
                      <MapPin className="h-3.5 w-3.5 text-accent" /> {d.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedProjectObjects.length > 0 && (
              <div>
                <span className="text-xs uppercase font-semibold text-muted-foreground block mb-3">
                  Explore Projects
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedProjectObjects.map((c: any) => (
                    <Link
                      key={c.slug}
                      to="/projects/$slug"
                      params={{ slug: c.slug }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-accent transition-colors"
                    >
                      <img
                        src={c.hero}
                        alt={c.name}
                        className="h-12 w-14 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-foreground truncate">
                          {c.name}
                        </div>
                        <div className="text-xs text-accent font-bold">From EGP {c.priceFrom}M</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}
