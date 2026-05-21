import { Link, useRouter } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const saved =
      (localStorage.getItem("timeworth.theme") as "light" | "dark" | null) ??
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
    <header className="absolute top-0 right-0 left-0 z-40">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link
          to={path === "/" ? "/" : "/dashboard"}
          className="font-display text-lg tracking-tight text-foreground/70 transition hover:text-foreground"
        >
          timeworth
        </Link>
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/50 transition hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}

export function SoftGradient() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 opacity-60"
      aria-hidden
      style={{
        backgroundImage:
          "radial-gradient(60% 50% at 50% 0%, oklch(0.92 0.04 50 / 0.5), transparent 70%), radial-gradient(50% 60% at 50% 100%, oklch(0.9 0.04 250 / 0.35), transparent 70%)",
      }}
    />
  );
}
