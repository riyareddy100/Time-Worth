import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Nav, SoftGradient } from "@/components/timeworth/Shell";
import { calculate, fmt, loadProfile, type Profile } from "@/lib/timeworth";

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

  // Choose the most human-readable unit
  const { value, unit } = pickUnit(calc.hoursNeeded, calc.daysNeeded, calc.weeksNeeded, calc.monthsNeeded);

  return (
    <div className="relative flex min-h-screen flex-col">
      <SoftGradient />
      <Nav />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-[11px] tracking-[0.25em] text-muted-foreground/70 uppercase"
        >
          {fmt(price, profile.currency)}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mt-12 text-5xl leading-[1.05] text-balance sm:text-7xl"
        >
          This costs{" "}
          <span className="italic">
            {value} {unit}
          </span>
          <br />
          of your life.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="mt-10 text-sm text-muted-foreground"
        >
          Based on your current work profile.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-24 flex items-center gap-8 text-sm tracking-wider uppercase"
        >
          <Link
            to="/dashboard"
            className="text-muted-foreground transition hover:text-foreground"
          >
            try another
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

function pickUnit(hours: number, days: number, weeks: number, months: number) {
  if (months >= 2) return { value: format(months), unit: "months" };
  if (weeks >= 2) return { value: format(weeks), unit: "weeks" };
  if (days >= 1) return { value: format(days), unit: days < 2 ? "day" : "days" };
  return { value: format(hours), unit: hours < 2 ? "hour" : "hours" };
}

function format(n: number) {
  if (n >= 10) return Math.round(n).toString();
  return (Math.round(n * 10) / 10).toString();
}
