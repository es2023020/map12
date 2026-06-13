import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { compoundBySlug } from "@/data/compounds";
import { CompoundCard } from "@/components/CompoundCard";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/dashboard/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const favorites = useStore((s) => s.favorites);
  const list = favorites.map(compoundBySlug).filter(Boolean) as NonNullable<ReturnType<typeof compoundBySlug>>[];

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
        <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
        <h2 className="mt-4 font-display text-2xl font-semibold text-primary">No favorites yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">Tap the heart icon on any compound to save it here.</p>
        <Link to="/projects" className="mt-5 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Browse projects</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-primary">Your {list.length} favorite compounds</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => <CompoundCard key={c.slug} c={c} />)}
      </div>
    </div>
  );
}