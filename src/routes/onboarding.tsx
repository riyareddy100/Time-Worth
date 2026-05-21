import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Nav, SoftGradient } from "@/components/timeworth/Shell";
import { loadProfile, saveProfile, type Profile } from "@/lib/timeworth";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

type Form = {
  salary: string;
  hoursPerDay: string;
  daysPerWeek: string;
};

function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({ salary: "", hoursPerDay: "8", daysPerWeek: "5" });

  useEffect(() => {
    const p = loadProfile();
    if (p) {
      setForm({
        salary: String(p.salary ?? ""),
        hoursPerDay: String(p.hoursPerDay ?? 8),
        daysPerWeek: String(p.daysPerWeek ?? 5),
      });
    }
  }, []);

  const salary = Number(form.salary);
  const hpd = Number(form.hoursPerDay);
  const dpw = Number(form.daysPerWeek);
  const valid = salary > 0 && hpd > 0 && hpd <= 24 && dpw > 0 && dpw <= 7;

  const submit = () => {
    if (!valid) return;
    const profile: Profile = {
      salary,
      hoursPerDay: hpd,
      daysPerWeek: dpw,
      currency: loadProfile()?.currency ?? "INR",
    };
    saveProfile(profile);
    navigate({ to: "/dashboard" });
  };

  const update = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="relative flex min-h-screen flex-col">
      <SoftGradient />
      <Nav />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-center text-3xl text-balance sm:text-4xl"
        >
          A few quiet numbers.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-16 space-y-10"
          onKeyDown={(e) => e.key === "Enter" && submit()}
        >
          <Field
            label="Monthly salary"
            value={form.salary}
            onChange={update("salary")}
            placeholder="75000"
            autoFocus
          />
          <Field
            label="Working hours / day"
            value={form.hoursPerDay}
            onChange={update("hoursPerDay")}
            placeholder="8"
          />
          <Field
            label="Working days / week"
            value={form.daysPerWeek}
            onChange={update("daysPerWeek")}
            placeholder="5"
          />
        </motion.div>

        <div className="mt-16 flex justify-center">
          <button
            onClick={submit}
            disabled={!valid}
            className="border-b border-foreground/30 pb-1 text-sm tracking-wider text-foreground/80 uppercase transition hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:border-transparent disabled:text-foreground/20"
          >
            begin
          </button>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-center text-[11px] tracking-[0.25em] text-muted-foreground/70 uppercase">
        {label}
      </span>
      <input
        autoFocus={autoFocus}
        type="number"
        inputMode="decimal"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="font-display mt-4 w-full border-b border-foreground/10 bg-transparent pb-2 text-center text-3xl placeholder:text-foreground/15 focus:border-foreground/40 focus:outline-none sm:text-4xl"
      />
    </label>
  );
}
