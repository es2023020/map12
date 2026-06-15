import { Link, useRouterState } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Map, Building2, LayoutDashboard, ShieldCheck, Heart, Menu, X, Calculator, Sparkles } from "lucide-react";
import { useState } from "react";

const publicLinks = [
  { to: "/map" as const, label: "Map", icon: Map },
  { to: "/projects" as const, label: "Projects", icon: Building2 },
  { to: "/areas" as const, label: "Areas" },
  { to: "/developers" as const, label: "Developers" },
  { to: "/calculator" as const, label: "Calculator", icon: Calculator },
  { to: "/suggestions" as const, label: "Unit Finder", icon: Sparkles },
];
const brokerLinks = [
  { to: "/dashboard" as const, label: "Broker", icon: LayoutDashboard },
  { to: "/admin" as const, label: "Admin", icon: ShieldCheck },
];

export function Navbar() {
  const user = useStore((s) => s.user);
  const favCount = useStore((s) => s.favorites.length);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const links = user ? [...publicLinks, ...brokerLinks] : publicLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight shrink-0">
          <img src="/logo.png" alt="PropTrack" className="h-9 w-9 object-contain" />
          <span className="hidden sm:inline">
            Prop<span className="text-accent">Track</span>
          </span>
        </Link>
        <nav className="ml-2 hidden items-center gap-0.5 md:flex">
          {links.map((l) => {
            const active = pathname === l.to || pathname.startsWith(l.to + "/");
            const isHighlight = l.to === "/suggestions";
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-secondary text-primary"
                    : isHighlight
                    ? "text-accent hover:bg-accent/10"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-primary"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {user && (
            <Link to="/dashboard/favorites" className="relative hidden rounded-md p-2 text-muted-foreground hover:bg-secondary md:inline-flex">
              <Heart className="h-5 w-5" />
              {favCount > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">
                  {favCount}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <Link to="/dashboard" className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm md:flex">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {user.name[0]?.toUpperCase()}
              </span>
              <span className="font-medium">{user.name}</span>
            </Link>
          ) : (
            <Link to="/auth" className="hidden md:block"><Button size="sm" className="rounded-full">Sign in</Button></Link>
          )}
          <button
            className="rounded-md p-2 md:hidden text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background/98 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col divide-y divide-border/40 px-2 py-1">
            {links.map((l) => {
              const active = pathname === l.to || pathname.startsWith(l.to + "/");
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors rounded-lg my-0.5 ${
                    active ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary/60 hover:text-primary"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            {!user && (
              <div className="px-3 py-3">
                <Link to="/auth" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full rounded-full">Sign in</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
