import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Nav, SoftGradient } from "@/components/timeworth/Shell";
import { clearProfile, loadProfile, symbolOf, type Profile } from "@/lib/timeworth";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [price, setPrice] = useState<string>("");

  useEffect(() => {
    const p = loadProfile();
    if (!p) navigate({ to: "/onboarding" });
    else setProfile(p);
  }, [navigate]);

  if (!profile) return null;

  const calc = () => {
    const n = Number(price);
    if (!n || n <= 0) return;
    navigate({ to: "/result", search: { price: n } });
  };

  const reset = () => {
    clearProfile();
    navigate({ to: "/onboarding" });
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <SoftGradient />
      <Nav />

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-24">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-center text-3xl text-balance sm:text-4xl"
        >
          What are you thinking
          <br />
          of buying?
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20"
        >
          <div className="flex items-baseline justify-center gap-3">
            <span className="font-display text-3xl text-foreground/30 sm:text-4xl">
              {symbolOf(profile.currency)}
            </span>
            <input
              autoFocus
              type="number"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              onKeyDown={(e) => e.key === "Enter" && calc()}
              placeholder="0"
              className="font-display w-full max-w-xs bg-transparent text-center text-5xl placeholder:text-foreground/15 focus:outline-none sm:text-6xl"
            />
          </div>

          <div className="mt-16 flex justify-center">
            <button
              onClick={calc}
              disabled={!price || Number(price) <= 0}
              className="rounded-full bg-foreground px-10 py-3.5 text-xs tracking-[0.25em] text-background uppercase shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
            >
              see what it costs
            </button>
          </div>
        </motion.div>
      </main>

      <footer className="flex items-center justify-center gap-6 py-10 text-[11px] tracking-widest text-muted-foreground/60 uppercase">
        <Link to="/onboarding" className="transition hover:text-foreground">
          edit profile
        </Link>
        <span className="text-foreground/15">·</span>
        <button onClick={reset} className="transition hover:text-foreground">
          reset
        </button>
      </footer>
    </div>
  );
}
