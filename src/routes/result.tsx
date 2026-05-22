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
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    if (!p) navigate({ to: "/onboarding" });
    else setProfile(p);
  }, [navigate]);

  const calc = useMemo(() => (profile ? calculate(profile, price) : null), [profile, price]);

  if (!profile || !calc) return null;

  const { value, unit } = pickUnit(calc.hoursNeeded, calc.daysNeeded, calc.weeksNeeded, calc.monthsNeeded);
  const priceLabel = fmt(price, profile.currency);

  const share = async () => {
    setSharing(true);
    try {
      const blob = await renderShareCard({ priceLabel, value, unit });
      if (!blob) return;
      const file = new File([blob], "timeworth.png", { type: "image/png" });
      const nav = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
        share?: (data: ShareData) => Promise<void>;
      };
      if (nav.canShare?.({ files: [file] }) && nav.share) {
        await nav.share({ files: [file], title: "TimeWorth", text: `${priceLabel} = ${value} ${unit} of my life` });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "timeworth.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <SoftGradient />
      <Nav />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-[11px] tracking-[0.3em] text-muted-foreground/70 uppercase"
        >
          {priceLabel}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 grid w-full grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-16"
        >
          <Stat value={format(calc.daysNeeded)} label="working days" />
          <div className="hidden sm:block sm:absolute" aria-hidden />
          <Stat value={format(calc.hoursNeeded)} label="working hours" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-16 max-w-sm text-sm leading-relaxed text-muted-foreground"
        >
          That's how much of your work you'd trade for it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.9 }}
          className="mt-24 flex flex-wrap items-center justify-center gap-8 text-sm tracking-wider uppercase"
        >
          <button
            onClick={share}
            disabled={sharing}
            className="border-b border-foreground/30 pb-1 text-foreground/80 transition hover:border-foreground hover:text-foreground disabled:opacity-40"
          >
            {sharing ? "preparing…" : "share"}
          </button>
          <Link to="/dashboard" className="text-muted-foreground transition hover:text-foreground">
            try another
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

function pickUnit(hours: number, days: number, weeks: number, months: number) {
  if (months >= 2) return { value: format(months), unit: months < 2 ? "month" : "months" };
  if (weeks >= 2) return { value: format(weeks), unit: "weeks" };
  if (days >= 1) return { value: format(days), unit: days < 2 ? "day" : "days" };
  return { value: format(hours), unit: hours < 2 ? "hour" : "hours" };
}

function format(n: number) {
  if (n >= 10) return Math.round(n).toString();
  return (Math.round(n * 10) / 10).toString();
}

async function renderShareCard({
  priceLabel,
  value,
  unit,
}: {
  priceLabel: string;
  value: string;
  unit: string;
}): Promise<Blob | null> {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Soft gradient background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#fafaf7");
  grad.addColorStop(1, "#f0ece4");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle radial highlight
  const radial = ctx.createRadialGradient(W / 2, H * 0.35, 50, W / 2, H * 0.35, W * 0.8);
  radial.addColorStop(0, "rgba(255,255,255,0.6)");
  radial.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = "center";
  ctx.fillStyle = "#1a1a1a";

  // Top label – price
  ctx.font = "500 28px ui-sans-serif, system-ui, -apple-system, Inter";
  ctx.fillStyle = "rgba(26,26,26,0.55)";
  ctx.fillText(priceLabel.toUpperCase(), W / 2, 180);

  // Huge value
  ctx.fillStyle = "#0f0f0f";
  ctx.font = '600 460px "Instrument Serif", Georgia, serif';
  ctx.fillText(value, W / 2, H / 2 + 100);

  // Unit
  ctx.font = "500 56px ui-sans-serif, system-ui, -apple-system, Inter";
  ctx.fillStyle = "#1a1a1a";
  const spacedUnit = unit.toUpperCase().split("").join(" ");
  ctx.fillText(spacedUnit, W / 2, H / 2 + 200);

  // Subline
  ctx.font = "400 36px ui-sans-serif, system-ui, -apple-system, Inter";
  ctx.fillStyle = "rgba(26,26,26,0.55)";
  ctx.fillText("of my life.", W / 2, H / 2 + 290);

  // Footer brand
  ctx.font = "500 22px ui-sans-serif, system-ui, -apple-system, Inter";
  ctx.fillStyle = "rgba(26,26,26,0.4)";
  ctx.fillText("T I M E W O R T H", W / 2, H - 80);

  return await new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}
