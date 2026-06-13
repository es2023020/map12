import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="font-display text-2xl font-semibold">
            Prop<span className="text-accent">Track</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/70">
            Real-estate intelligence for Egyptian brokers. Every compound, on one map.
          </p>
        </div>
        <FooterCol title="Explore" links={[
          { to: "/map", label: "Interactive Map" },
          { to: "/projects", label: "All Projects" },
          { to: "/areas", label: "Areas" },
          { to: "/developers", label: "Developers" },
        ]} />
        <FooterCol title="For Brokers" links={[
          { to: "/dashboard", label: "Dashboard" },
          { to: "/dashboard/leads", label: "Leads" },
          { to: "/dashboard/favorites", label: "Favorites" },
          { to: "/dashboard/compare", label: "Compare" },
        ]} />
        <FooterCol title="Company" links={[
          { to: "/admin", label: "Subscriptions" },
          { to: "/auth", label: "Sign in" },
        ]} />
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-primary-foreground/60 lg:px-8">
        © {new Date().getFullYear()} PropTrack — Built for the Egyptian property market.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: Array<{ to: string; label: string }> }) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to as any} className="transition-colors hover:text-accent">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}