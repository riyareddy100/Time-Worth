import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Settings, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Aurora, Nav } from "@/components/timeworth/Shell";
import {
  clearProfile,
  greeting,
  loadProfile,
  symbolOf,
  type Profile,
} from "@/lib/timeworth";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

const SUGGESTIONS = [499, 4999, 29999, 129900];

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [price, setPrice] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    if (!p) navigate({ to: "/onboarding" });
    else setProfile(p);
  }, [navigate]);

  if (!profile) return null;

  const calc = () => {
    const n = Number(price);
    if (!n || n <= 0) return;
    setSubmitting(true);
    setTimeout(() => {
      navigate({ to: "/result", search: { price: n } });
    }, 600);
  };

  const reset = () => {
    if (confirm("Reset your profile? This clears all saved data.")) {
      clearProfile();
      navigate({ to: "/onboarding" });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Aurora />
      <Nav />
      <main className="mx-auto max-w-2xl px-5 pt-8 pb-24">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm text-muted-foreground"
        >
          {greeting(profile.name)}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-2 font-display text-4xl text-balance sm:text-5xl"
        >
          What are you thinking of buying today?
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="glass mt-10 rounded-3xl p-6 sm:p-8"
        >
          <label className="text-xs uppercase tracking-widest text-muted-foreground">
            Product price
          </label>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-5xl text-foreground/40 sm:text-6xl">
              {symbolOf(profile.currency)}
            </span>
            <input
              autoFocus
              type="number"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && calc()}
              placeholder="0"
              className="w-full bg-transparent font-display text-5xl placeholder:text-foreground/20 focus:outline-none sm:text-6xl"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setPrice(String(s))}
                className="rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs text-muted-foreground transition hover:text-foreground"
              >
                {symbolOf(profile.currency)}
                {s.toLocaleString("en-IN")}
              </button>
            ))}
          </div>

          <button
            onClick={calc}
            disabled={!price || Number(price) <= 0 || submitting}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-6 py-4 text-sm font-medium text-background transition hover:scale-[1.01] disabled:opacity-40 disabled:hover:scale-100"
          >
            {submitting ? (
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                Measuring your time…
              </motion.span>
            ) : (
              <>
                Calculate life cost <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
          <ProfileCard label="Salary" value={`${symbolOf(profile.currency)}${profile.salary.toLocaleString("en-IN")}`} />
          <ProfileCard label="Working" value={`${profile.hoursPerDay}h × ${profile.daysPerWeek}d`} />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 text-muted-foreground transition hover:text-foreground"
          >
            <Settings className="h-4 w-4" /> Edit profile
          </Link>
          <span className="text-foreground/20">·</span>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 text-muted-foreground transition hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" /> Reset
          </button>
        </div>
      </main>
    </div>
  );
}

function ProfileCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-lg">{value}</p>
    </div>
  );
}
