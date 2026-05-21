import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Nav, SoftGradient } from "@/components/timeworth/Shell";
import { CURRENCIES, loadProfile, saveProfile, type Profile } from "@/lib/timeworth";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const STEPS = [
  { key: "name", label: "What should we call you?", placeholder: "your name", type: "text" },
  { key: "age", label: "How old are you?", placeholder: "27", type: "number" },
  { key: "salary", label: "What do you earn each month?", placeholder: "75000", type: "number" },
  { key: "hoursPerDay", label: "How many hours a day do you work?", placeholder: "8", type: "number" },
  { key: "daysPerWeek", label: "How many days a week?", placeholder: "5", type: "number" },
  { key: "currency", label: "And your currency?", placeholder: "", type: "select" },
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
    <div className="relative flex min-h-screen flex-col">
      <SoftGradient />
      <Nav />

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-24">
        <p className="mb-16 text-center text-[11px] tracking-[0.25em] text-muted-foreground/70 uppercase">
          {step + 1} / {STEPS.length}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <h1 className="font-display text-3xl text-balance sm:text-4xl">
              {current.label}
            </h1>

            <div className="mt-16">
              {current.type === "select" ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setField(c.code)}
                      className={`rounded-full border px-5 py-2.5 text-sm transition ${
                        data.currency === c.code
                          ? "border-foreground text-foreground"
                          : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                      }`}
                    >
                      {c.symbol} {c.code}
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
                  className="font-display w-full bg-transparent pb-3 text-center text-4xl placeholder:text-foreground/15 focus:outline-none sm:text-5xl"
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-20 flex items-center justify-center gap-8 text-sm tracking-wider uppercase">
          {step > 0 && (
            <button
              onClick={back}
              className="text-muted-foreground transition hover:text-foreground"
            >
              back
            </button>
          )}
          <button
            onClick={next}
            disabled={!valid}
            className="border-b border-foreground/30 pb-1 text-foreground/80 transition hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:border-transparent disabled:text-foreground/20"
          >
            {step === STEPS.length - 1 ? "begin" : "continue"}
          </button>
        </div>
      </main>
    </div>
  );
}
