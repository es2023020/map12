import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Shell } from "@/components/layout/Shell";
import { useStore } from "@/lib/store";
import { developers } from "@/data/developers";
import { compounds } from "@/data/compounds";
import {
  Megaphone,
  Sparkles,
  Lock,
  Search,
  Filter,
  PlusCircle,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Building2,
  CheckCircle2,
  Tag,
  ExternalLink,
  X,
  Send,
  Calendar,
  Percent,
  Clock,
  MapPin,
  Image as ImageIcon,
  UserCheck,
} from "lucide-react";

export const Route = createFileRoute("/developer-announcements")({
  head: () => ({
    meta: [
      { title: "Developer Announcements & Feed — Property Atlas" },
      {
        name: "description",
        content:
          "Official Instagram-style feed for real estate developers to post launches, inventory updates, and broker incentives.",
      },
    ],
  }),
  component: DeveloperAnnouncementsPage,
});

interface AnnouncementPost {
  id: string;
  developerSlug: string;
  developerName: string;
  developerLogo: string;
  verified: boolean;
  category: "Launch" | "Price Update" | "Commission Offer" | "Project Status" | "Event";
  title: string;
  content: string;
  projectSlug?: string;
  projectName?: string;
  heroImage?: string;
  brokerCommissionNote?: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  commentsList?: Array<{ author: string; role: string; text: string; time: string }>;
}

const INITIAL_POSTS: AnnouncementPost[] = [
  {
    id: "post-1",
    developerSlug: "stm",
    developerName: "STM Developments",
    developerLogo: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80",
    verified: true,
    category: "Launch",
    title: "✨ La Vista City New Phase Release — RTM Villas Fully Finished",
    content:
      "We are excited to announce immediate availability for La Vista City classic & modern villa phases in the New Capital! 10% DP with 8-year flexible installments for Townhouses & Twin Houses. Ready to Move immediately.",
    projectSlug: "la-vista-city",
    projectName: "La Vista City",
    heroImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    brokerCommissionNote: "⚡ Exclusive 3.5% Broker Commission for all deals closed this month!",
    timestamp: "2 hours ago",
    likes: 42,
    commentsCount: 6,
    commentsList: [
      { author: "Ahmed Hassan", role: "Senior Broker", text: "Are townhouses available in P1 Classic?", time: "1 hour ago" },
      { author: "STM Official", role: "Developer Admin", text: "Yes Ahmed, 228m² and 253m² classic townhouses are ready for viewing today!", time: "45 mins ago" },
    ],
  },
  {
    id: "post-2",
    developerSlug: "dorra-group",
    developerName: "Dorra Group",
    developerLogo: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=200&q=80",
    verified: true,
    category: "Commission Offer",
    title: "Village West Sheikh Zayed — Phase 2 Launching & Special Incentives",
    content:
      "Official Fact Sheet released for Village West in Sheikh Zayed! 125 feddan masterplan with 1BD to 4BD apartments and standalone townhouses. 10% Down Payment with up to 8 years installments.",
    projectSlug: "village-west",
    projectName: "Village West",
    heroImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
    brokerCommissionNote: "🎉 Special Bonus: Extra 0.5% Commission for 3BD Penthouse sales.",
    timestamp: "5 hours ago",
    likes: 67,
    commentsCount: 12,
    commentsList: [
      { author: "Mariam El-Sayed", role: "Managing Director", text: "What is the delivery date for 2027 villas?", time: "3 hours ago" },
    ],
  },
  {
    id: "post-3",
    developerSlug: "palm-hills-developments",
    developerName: "Palm Hills Developments",
    developerLogo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=80",
    verified: true,
    category: "Price Update",
    title: "Bamboo Extension Developer Ownership & Revised Payment Schedule",
    content:
      "Official confirmation: Bamboo Extension in 6th of October is officially under Palm Hills Developments umbrella. Inventory and updated unit breakdowns are live on Property Atlas.",
    projectSlug: "bamboo-extension",
    projectName: "Bamboo Extension",
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    timestamp: "1 day ago",
    likes: 89,
    commentsCount: 4,
  },
];

function DeveloperAnnouncementsPage() {
  const user = useStore((s) => s.user);
  const isAdmin = user?.email?.toLowerCase() === "elsayedshoeip70@gmail.com" || (user as any)?.role === "admin";
  const isDeveloper = (user as any)?.role === "developer" || isAdmin;

  // Feed state
  const [posts, setPosts] = useState<AnnouncementPost[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDevFilter, setSelectedDevFilter] = useState<string>("All");
  
  // Post interaction state
  const [likedPostIds, setLikedPostIds] = useState<Record<string, boolean>>({ "post-1": true });
  const [savedPostIds, setSavedPostIds] = useState<Record<string, boolean>>({});
  const [activeCommentPost, setActiveCommentPost] = useState<AnnouncementPost | null>(null);
  const [commentInput, setCommentInput] = useState("");
  
  // Create post modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<AnnouncementPost["category"]>("Launch");
  const [newContent, setNewContent] = useState("");
  const [newProjectSlug, setNewProjectSlug] = useState("");
  const [newCommissionNote, setNewCommissionNote] = useState("");
  const [newHeroImage, setNewHeroImage] = useState("");

  // Categories list
  const categories = ["All", "Launch", "Price Update", "Commission Offer", "Project Status", "Event"];

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = selectedCategory === "All" || p.category === selectedCategory;
      const matchDev = selectedDevFilter === "All" || p.developerSlug === selectedDevFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.developerName.toLowerCase().includes(q) ||
        (p.projectName && p.projectName.toLowerCase().includes(q));
      return matchCat && matchDev && matchSearch;
    });
  }, [posts, selectedCategory, selectedDevFilter, searchQuery]);

  const toggleLike = (id: string) => {
    setLikedPostIds((prev) => {
      const isLiked = !prev[id];
      setPosts((currentPosts) =>
        currentPosts.map((p) => (p.id === id ? { ...p, likes: p.likes + (isLiked ? 1 : -1) } : p))
      );
      return { ...prev, [id]: isLiked };
    });
  };

  const toggleSave = (id: string) => {
    setSavedPostIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeCommentPost) return;
    const newComment = {
      author: user?.name || "Advisor Agent",
      role: user ? `${user.tier || "Broker"} Partner` : "Verified Broker",
      text: commentInput.trim(),
      time: "Just now",
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === activeCommentPost.id
          ? {
              ...p,
              commentsCount: p.commentsCount + 1,
              commentsList: [...(p.commentsList || []), newComment],
            }
          : p
      )
    );
    setActiveCommentPost((prev) =>
      prev
        ? {
            ...prev,
            commentsCount: prev.commentsCount + 1,
            commentsList: [...(prev.commentsList || []), newComment],
          }
        : null
    );
    setCommentInput("");
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const proj = compounds.find((c) => c.slug === newProjectSlug);

    const created: AnnouncementPost = {
      id: `post-${Date.now()}`,
      developerSlug: "stm",
      developerName: user?.name || "STM Developments",
      developerLogo: user?.avatar || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80",
      verified: true,
      category: newCategory,
      title: newTitle,
      content: newContent,
      projectSlug: proj?.slug,
      projectName: proj?.name,
      heroImage: newHeroImage || proj?.hero || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      brokerCommissionNote: newCommissionNote.trim() || undefined,
      timestamp: "Just now",
      likes: 1,
      commentsCount: 0,
      commentsList: [],
    };

    setPosts([created, ...posts]);
    setCreateModalOpen(false);
    setNewTitle("");
    setNewContent("");
    setNewCommissionNote("");
    setNewHeroImage("");
    setNewProjectSlug("");
  };

  // NON-ADMIN / VISITOR GATE
  if (!isAdmin) {
    return (
      <Shell>
        <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-background">
          <div className="max-w-2xl w-full bg-card border border-border rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            {/* Background glowing gradient accents */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              {/* Badge & Icon */}
              <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-accent/25 via-primary/15 to-accent/10 border border-accent/30 flex items-center justify-center text-accent shadow-inner">
                <Megaphone className="h-12 w-12 animate-bounce" />
              </div>

              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-accent/15 text-accent border border-accent/30 tracking-wider uppercase">
                  <Sparkles className="h-4 w-4" /> Developer Feed Hub · Coming Soon
                </span>

                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-primary pt-1">
                  Developer Announcements
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  Our direct Instagram-style broadcast feed connecting Egypt’s top real estate developers with verified brokers. Real-time launch alerts, flash commission offers, and inventory updates will be live here soon.
                </p>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/70 space-y-1.5">
                  <div className="flex items-center gap-2 text-accent font-bold text-xs">
                    <Sparkles className="h-4 w-4" /> Direct Bulletins
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Instant verified posts from Palm Hills, TMG, SODIC, STM &amp; Dorra.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/70 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                    <Percent className="h-4 w-4" /> Broker Incentives
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Exclusive flash commission rates and deals feed for active advisors.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/70 space-y-1.5">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs">
                    <ImageIcon className="h-4 w-4" /> Rich Media
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    High-res masterplans, price sheets, and project phase walkthroughs.
                  </p>
                </div>
              </div>

              {/* Admin Notice */}
              <div className="p-4 rounded-2xl bg-secondary/70 border border-border text-xs text-muted-foreground flex items-center justify-center gap-2.5 shadow-xs">
                <Lock className="h-4 w-4 text-accent shrink-0" />
                <span>Currently restricted to Administrator preview &amp; developer onboarding.</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/projects"
                  search={{ destination: "", dev: "", q: "" }}
                  className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-md"
                >
                  Browse Compounds &amp; Projects
                </Link>
                <Link
                  to="/dashboard"
                  className="px-6 py-3 rounded-full border border-border bg-card text-foreground text-xs font-bold hover:bg-secondary transition-colors"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  // ADMIN FULL INTERACTIVE DEVELOPER FEED
  return (
    <Shell>
      <div className="min-h-screen bg-background pb-16">
        {/* Hero Header */}
        <div className="border-b border-border/60 bg-gradient-to-b from-secondary/40 via-background to-background py-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-wider">
                  <Megaphone className="h-4 w-4" /> Official Broadcast Feed
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-primary">
                  Developer Announcements
                </h1>
                <p className="text-sm text-muted-foreground">
                  Direct Instagram-style update feed from Egypt&apos;s leading developers to advisors and brokers.
                </p>
              </div>

              {isDeveloper && (
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-bold text-accent-foreground shadow-lg hover:bg-accent/90 transition-all cursor-pointer shrink-0"
                >
                  <PlusCircle className="h-4 w-4" /> Post Announcement
                </button>
              )}
            </div>

            {/* Filters & Search Toolbar */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search announcements, developers, or projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feed Posts Container */}
        <div className="mx-auto max-w-2xl px-4 pt-8 space-y-8">
          {filteredPosts.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-12 text-center space-y-4 shadow-sm">
              <Megaphone className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <div className="text-base font-bold text-primary">No announcements found</div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try adjusting your search query or category filters to discover developer posts.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedDevFilter("All");
                }}
                className="px-4 py-2 rounded-full bg-secondary text-xs font-bold text-primary hover:bg-secondary/80"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isLiked = !!likedPostIds[post.id];
              const isSaved = !!savedPostIds[post.id];

              return (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-5 border-b border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 rounded-2xl overflow-hidden bg-white border border-border/60 shadow-xs flex items-center justify-center">
                        <img
                          src={post.developerLogo}
                          alt={post.developerName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-bold text-sm text-primary">
                            {post.developerName}
                          </span>
                          {post.verified && (
                            <CheckCircle2 className="h-4 w-4 text-accent fill-accent/20 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span className="inline-flex items-center gap-1 font-medium">
                            <Clock className="h-3 w-3" /> {post.timestamp}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-accent">{post.category}</span>
                        </div>
                      </div>
                    </div>

                    <span className="rounded-full bg-secondary/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border/50">
                      Official Bulletin
                    </span>
                  </div>

                  {/* Hero Media */}
                  {post.heroImage && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
                      <img
                        src={post.heroImage}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      {post.projectName && (
                        <div className="absolute bottom-3 left-3 z-10">
                          <Link
                            to="/projects/$slug"
                            params={{ slug: post.projectSlug || "la-vista-city" }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white border border-white/20 hover:bg-black/80 transition-colors"
                          >
                            <Building2 className="h-3.5 w-3.5 text-accent" /> {post.projectName}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="p-6 space-y-4">
                    <h2 className="font-display text-xl font-bold text-primary leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Broker Commission Incentive Highlight Box */}
                    {post.brokerCommissionNote && (
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-accent/15 via-emerald-500/10 to-transparent border border-accent/30 flex items-start gap-3">
                        <Percent className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <div className="text-xs font-bold text-primary leading-normal">
                          {post.brokerCommissionNote}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Post Actions Footer */}
                  <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-secondary/20">
                    <div className="flex items-center gap-4">
                      {/* Like Button */}
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                          isLiked ? "text-sunset" : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                        <span>{post.likes}</span>
                      </button>

                      {/* Comment Button */}
                      <button
                        onClick={() => setActiveCommentPost(post)}
                        className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-all cursor-pointer"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.commentsCount} Comments</span>
                      </button>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleSave(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                          isSaved ? "text-accent" : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    {/* Contact Developer Button */}
                    <a
                      href="https://wa.me/201029324783?text=Hello%20Developer%20Partner,%20I%20saw%20your%20announcement%20on%20Property%20Atlas"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
                    >
                      Inquire Direct
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      {/* COMMENTS DRAWER MODAL */}
      {activeCommentPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-lg w-full bg-card border border-border rounded-3xl shadow-2xl p-6 space-y-6 relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-primary">
                  Broker Discussion
                </h3>
                <p className="text-xs text-muted-foreground truncate max-w-xs">
                  {activeCommentPost.title}
                </p>
              </div>
              <button
                onClick={() => setActiveCommentPost(null)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-primary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {(activeCommentPost.commentsList ?? []).length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">
                  No comments yet. Be the first advisor to ask a question!
                </p>
              ) : (
                activeCommentPost.commentsList?.map((c, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-secondary/50 border border-border/50 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-primary">{c.author}</span>
                      <span className="text-[10px] text-muted-foreground">{c.time}</span>
                    </div>
                    <div className="text-[10px] font-semibold text-accent">{c.role}</div>
                    <p className="text-xs text-foreground/90 pt-1 leading-relaxed">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input Form */}
            <form onSubmit={handleAddComment} className="flex gap-2 border-t border-border pt-4">
              <input
                type="text"
                placeholder="Write a comment or ask developer..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 rounded-2xl border border-border bg-background px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ANNOUNCEMENT MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-lg w-full bg-card border border-border rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-primary">
                    Post Developer Announcement
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Broadcast launches, price lists, &amp; commission updates to all brokers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-primary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="Launch">🚀 Launch Announcement</option>
                  <option value="Price Update">📈 Price &amp; Payment Plan Update</option>
                  <option value="Commission Offer">💎 Special Commission / Broker Bonus</option>
                  <option value="Project Status">🏗️ Construction / Project Status</option>
                  <option value="Event">🎉 Developer Launch Event</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Headline Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Phase Release — Fully Finished Standalone Villas"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Associated Project (Optional)
                </label>
                <select
                  value={newProjectSlug}
                  onChange={(e) => setNewProjectSlug(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">-- Select Compound / Project --</option>
                  {compounds.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} ({c.developer})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Announcement Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter full details, inventory terms, delivery dates, and payment options..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Broker Commission Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3.5% Commission valid for all deals closed by end of month"
                  value={newCommissionNote}
                  onChange={(e) => setNewCommissionNote(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Hero Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newHeroImage}
                  onChange={(e) => setNewHeroImage(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 rounded-full border border-border bg-card py-2.5 text-xs font-bold text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Shell>
  );
}
