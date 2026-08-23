import { Link, useRouterState } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, ChevronDown, User, Settings, LogOut, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const publicLinks = [
  { to: "/map" as const, label: "Map" },
  { to: "/projects" as const, label: "Projects" },
  { to: "/destinations" as const, label: "Destinations" },
  { to: "/calculator" as const, label: "Calculator" },
  { to: "/compare" as const, label: "Compare" },
];

const moreLinks = [
  { to: "/developers" as const, label: "Developers" },
  { to: "/pricing" as const, label: "Pricing" },
  { to: "/about" as const, label: "About" },
  { to: "/contact" as const, label: "Contact" },
];

const brokerLinks = [{ to: "/dashboard" as const, label: "Broker" }];

export function Navbar() {
  const user = useStore((s) => s.user);
  const signOut = useStore((s) => s.signOut);
  const favCount = useStore((s) => s.favorites.length);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const links = user ? [...publicLinks, ...brokerLinks] : publicLinks;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (user) {
          const updatedUsers = useStore.getState().usersDatabase.map((u) => {
            if (u.email.toLowerCase() === user.email.toLowerCase()) {
              return { ...u, avatar: base64 };
            }
            return u;
          });
          useStore.setState({
            user: { ...user, avatar: base64 },
            usersDatabase: updatedUsers,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = () => {
    signOut();
    setUserMenuOpen(false);
  };

  const linkCls = (active: boolean) =>
    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "bg-secondary text-primary"
        : "text-muted-foreground hover:bg-secondary/60 hover:text-primary"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight shrink-0"
        >
          <img src="/logo.png" alt="Property Atlas" className="h-9 w-9 object-contain" />
          <span className="hidden sm:inline">
            Property <span className="text-accent">Atlas</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-2 hidden items-center gap-0.5 md:flex">
          {links.map((l) => {
            const active = pathname === l.to || pathname.startsWith(l.to + "/");
            return (
              <Link key={l.to} to={l.to} className={linkCls(active)}>
                {l.label}
              </Link>
            );
          })}

          {/* More dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={
                linkCls(moreLinks.some((l) => pathname === l.to)) + " flex items-center gap-1"
              }
            >
              More{" "}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`}
              />
            </button>
            {moreOpen && (
              <div className="absolute left-0 top-full mt-1 w-52 rounded-xl border border-border bg-card shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                {moreLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors ${
                      pathname === l.to
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-primary"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {user && (
            <Link
              to="/dashboard/favorites"
              className="relative hidden rounded-md p-2 text-muted-foreground hover:bg-secondary md:inline-flex"
            >
              <Heart className="h-5 w-5" />
              {favCount > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">
                  {favCount}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm focus:outline-none"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-6 w-6 rounded-full object-cover border border-border shrink-0"
                  />
                ) : (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shrink-0">
                    {user.name[0]?.toUpperCase()}
                  </span>
                )}
                <span className="font-medium hidden sm:inline">{user.name}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 rounded-2xl border border-border bg-card shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2">
                  <div className="flex items-center gap-3 p-2 border-b border-border/50 pb-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {user.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-primary text-xs truncate">{user.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={avatarInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />

                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-foreground/80 hover:bg-secondary/60 hover:text-primary transition-all text-left"
                  >
                    <Upload className="h-3.5 w-3.5 text-accent" /> Change Profile Picture
                  </button>

                  <Link
                    to="/dashboard/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-foreground/80 hover:bg-secondary/60 hover:text-primary transition-all text-left"
                  >
                    <Settings className="h-3.5 w-3.5 text-accent" /> Profile Settings
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/5 transition-all text-left border-t border-border/40 pt-2"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out Account
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="hidden md:block">
              <Button size="sm" className="rounded-full">
                Sign in
              </Button>
            </Link>
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

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border/60 bg-background/98 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col divide-y divide-border/40 px-3 py-2 space-y-1">
            {[...links, ...moreLinks].map((l) => {
              const active = pathname === l.to || pathname.startsWith(l.to + "/");
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors rounded-xl ${
                    active
                      ? "bg-secondary text-primary font-semibold"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-primary"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}

            {user ? (
              <div className="pt-3 pb-2 space-y-2">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-2.5">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {user.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-primary">{user.name}</div>
                      <div className="text-[10px] text-muted-foreground">{user.tier} Partner</div>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-xs font-bold text-destructive hover:underline px-2 py-1"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-3 py-3">
                <Link to="/auth" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full rounded-full h-11 font-bold text-sm">
                    Sign in
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
