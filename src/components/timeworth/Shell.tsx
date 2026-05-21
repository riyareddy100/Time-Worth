import { Link, useRouter } from "@tanstack/react-router";
import { Moon, Sun, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const saved = (localStorage.getItem("timeworth.theme") as "light" | "dark" | null) ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("timeworth.theme", next);
  };
  return { theme, toggle };
}

export function Nav() {
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const path = router.state.location.pathname;
  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background">
            <Clock3 className="h-4 w-4" />
          </div>
          <span className="font-display text-xl">TimeWorth</span>
        </Link>
        <div className="flex items-center gap-2">
          {path !== "/" && (
            <Link
              to="/dashboard"
              className="hidden rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground sm:inline-flex"
            >
              Dashboard
            </Link>
          )}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="glass flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:scale-105"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Aurora() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-aurora opacity-80" aria-hidden />
  );
}
