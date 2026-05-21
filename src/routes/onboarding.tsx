import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Aurora, Nav } from "@/components/timeworth/Shell";
import { CURRENCIES, loadProfile, saveProfile, type Profile } from "@/lib/timeworth";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const STEPS = [
  { key: "name", label: "What should we call you?", placeholder: "Your name", type: "text" },
  { key: "age", label: "How old are you?", placeholder: "27", type: "number", min: 10, max: 100 },
  { key: "salary", label: "Your monthly salary, after deductions", placeholder: "75000", type: "number", min: 1 },
  { key: "hoursPerDay", label: "Hours you work each day", placeholder: "8", type: "number", min: 1, max: 24 },
  { key: "daysPerWeek", label: "Working days per week", placeholder: "5", type: "number", min: 1, max: 7 },
  { key: "currency", label: "Your currency", placeholder: "INR", type: "select" },
] as const;

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<Profile>>({ currency: "INR" });

  useEffect(() => {
    const p = loadProfile();
    if (p) setData(p);
  }, []);

  const current = STEPS[step];
  const value = (data as Record<string, unknown>)[current.key] ?? "";

  const setField = (v: string) => {
    setData((d) => ({
      ...d,
      [current.key]: current.type === "number" ? Number(v) : v,
    }));
  };

  const valid =
    current.type === "select"
      ? !!value
      : current.type === "number"
        ? typeof value === "number" && value > 0
        : typeof value === "string" && value.trim().length > 0;

  const next = () => {
    if (!valid) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      saveProfile(data as Profile);
      navigate({ to: "/dashboard" });
    }
  };

  const back = () => step > 0 && setStep(step - 1);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Aurora />
      <Nav />
      <main className="mx-auto flex max-w-xl flex-col px-5 pt-10 pb-20">
        {/* Progress */}
        <div className="mb-10 flex gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/10">
              <motion.div
                initial={false}
                animate={{ width: i < step ? "100%" : i === step ? "60%" : "0%" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full bg-foreground"
              />
            </div>
          ))}
        </div>

        <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-display text-4xl text-balance sm:text-5xl">{current.label}</h1>

            <div className="mt-10">
              {current.type === "select" ? (
                <div className="grid grid-cols-3 gap-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setField(c.code)}
                      className={`glass flex items-center justify-center gap-2 rounded-2xl px-3 py-4 text-sm transition ${
                        data.currency === c.code
                          ? "ring-2 ring-accent"
                          : "hover:scale-[1.02]"
                      }`}
                    >
                      <span className="text-base">{c.symbol}</span>
                      <span className="text-muted-foreground">{c.code}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  autoFocus
                  type={current.type}
                  inputMode={current.type === "number" ? "decimal" : "text"}
                  value={value as string | number}
                  onChange={(e) => setField(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && next()}
                  placeholder={current.placeholder}
                  className="w-full border-b-2 border-foreground/15 bg-transparent pb-3 font-display text-5xl placeholder:text-foreground/20 focus:border-accent focus:outline-none sm:text-6xl"
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-14 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="glass flex h-12 w-12 items-center justify-center rounded-full disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            disabled={!valid}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition hover:scale-[1.02] disabled:opacity-30 disabled:hover:scale-100"
          >
            {step === STEPS.length - 1 ? (
              <>Complete <Check className="h-4 w-4" /></>
            ) : (
              <>Continue <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
