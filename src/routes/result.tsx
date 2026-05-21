import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Coffee, TrendingUp, Utensils } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Aurora, Nav } from "@/components/timeworth/Shell";
import { Counter } from "@/components/timeworth/Counter";
import { calculate, fmt, loadProfile, symbolOf, type Profile } from "@/lib/timeworth";

const searchSchema = z.object({ price: z.number().positive() });

export const Route = createFileRoute("/result")({
  validateSearch: (s) => searchSchema.parse(s),
  component: Result,
});

function Result() {
  const navigate = useNavigate();
  const { price } = Route.useSearch();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const p = loadProfile();
    if (!p) navigate({ to: "/onboarding" });
    else setProfile(p);
  }, [navigate]);

  const calc = useMemo(() => (profile ? calculate(profile, price) : null), [profile, price]);

  if (!profile || !calc) return null;

  const verdict =
    calc.daysNeeded < 1
      ? "A small slice of your week."
      : calc.daysNeeded < 5
        ? "About a work week."
        : calc.daysNeeded < 22
          ? "Nearly a full month of work."
          : "Months of your life. Pause.";

  // Progress circle for % of monthly salary (capped at 100% visual)
  const pct = Math.min(calc.percentOfMonthly, 100);
  const R = 56;
  const C = 2 * Math.PI * R;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Aurora />
      <Nav />
      <main className="mx-auto max-w-3xl px-5 pt-6 pb-24">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-8 text-center"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {fmt(price, profile.currency)} costs
          </p>
          <h1 className="mt-4 font-display text-6xl leading-none text-balance sm:text-8xl">
            <Counter value={calc.daysNeeded} decimals={calc.daysNeeded < 10 ? 1 : 0} />
            <span className="text-accent"> days</span>
          </h1>
          <p className="mt-4 font-display text-2xl text-muted-foreground">{verdict}</p>
        </motion.div>

        {/* Progress circle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="glass mt-12 flex flex-col items-center gap-6 rounded-3xl p-8 sm:flex-row sm:gap-10"
        >
          <div className="relative h-36 w-36 shrink-0">
            <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
              <circle cx="70" cy="70" r={R} className="fill-none stroke-foreground/10" strokeWidth="10" />
              <motion.circle
                cx="70" cy="70" r={R}
                className="fill-none stroke-accent"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={{ strokeDashoffset: C - (C * pct) / 100 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-display text-3xl">
                <Counter value={calc.percentOfMonthly} decimals={0} suffix="%" />
              </p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">of monthly</p>
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-display text-2xl text-balance">
              You trade <Counter value={calc.hoursNeeded} decimals={0} /> hours of your life for this.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              That's <Counter value={calc.weeksNeeded} decimals={1} /> working weeks at {symbolOf(profile.currency)}
              {calc.hourlyEarnings.toFixed(0)} per hour.
            </p>
          </div>
        </motion.div>

        {/* Stat grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard delay={0.2} label="Total hours" value={<Counter value={calc.hoursNeeded} decimals={0} />} />
          <StatCard delay={0.27} label="Working weeks" value={<Counter value={calc.weeksNeeded} decimals={1} />} />
          <StatCard delay={0.34} label="Of monthly salary" value={<Counter value={calc.percentOfMonthly} decimals={0} suffix="%" />} />
        </div>

        {/* Equivalents */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Equiv delay={0.4} icon={<Utensils className="h-5 w-5" />} value={calc.meals} label="meals" sub="≈ at ₹8 each" />
          <Equiv delay={0.47} icon={<Coffee className="h-5 w-5" />} value={calc.coffees} label="coffee cups" sub="≈ at ₹4 each" />
        </div>

        {/* Insight cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Insight delay={0.55}>Is it still worth it?</Insight>
          <Insight delay={0.62}>
            This equals nearly{" "}
            <span className="text-accent">
              <Counter value={Math.max(0.1, calc.monthsNeeded)} decimals={1} />
            </span>{" "}
            {calc.monthsNeeded < 2 ? "month" : "months"} of work.
          </Insight>
        </div>

        {/* Investment alternative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="glass mt-10 overflow-hidden rounded-3xl p-8"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" /> If invested instead at 12% annual return
          </div>
          <p className="mt-4 font-display text-5xl text-balance sm:text-6xl">
            {symbolOf(profile.currency)}
            <Counter value={calc.futureValue10y} decimals={0} />
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Value after 10 years — that's{" "}
            <span className="text-foreground">
              {symbolOf(profile.currency)}
              {Math.round(calc.futureValue10y - price).toLocaleString("en-IN")}
            </span>{" "}
            in pure growth.
          </p>
        </motion.div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
          >
            Try another price
          </Link>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, delay }: { label: string; value: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="glass rounded-2xl p-5"
    >
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </motion.div>
  );
}

function Equiv({
  icon, value, label, sub, delay,
}: { icon: React.ReactNode; value: number; label: string; sub: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="glass flex items-center gap-4 rounded-2xl p-5"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground/10">{icon}</div>
      <div>
        <p className="font-display text-2xl">
          <Counter value={value} decimals={0} /> {label}
        </p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </motion.div>
  );
}

function Insight({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="glass rounded-2xl p-6"
    >
      <p className="font-display text-2xl text-balance">{children}</p>
    </motion.div>
  );
}
