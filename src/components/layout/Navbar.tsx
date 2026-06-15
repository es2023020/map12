import { Link, useRouterState } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Map, Building2, LayoutDashboard, ShieldCheck, Heart, Menu } from "lucide-react";
import { useState } from "react";
import logoAsset from "@/assets/proptrack-logo.png.asset.json";

const publicLinks = [
  { to: "/map" as const, label: "Map", icon: Map },
  { to: "/projects" as const, label: "Projects", icon: Building2 },
  { to: "/areas" as const, label: "Areas" },
  { to: "/developers" as const, label: "Developers" },
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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <img src={logoAsset.url} alt="PropTrack" className="h-9 w-9 object-contain" />
          <span>
            Prop<span className="text-accent">Track</span>
          </span>
        </Link>
        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.to || pathname.startsWith(l.to + "/");
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary/60 hover:text-primary"
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
            <Link to="/auth"><Button size="sm" className="rounded-full">Sign in</Button></Link>
          )}
          <button className="rounded-md p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="flex flex-col p-2">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">{l.label}</Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}