import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Heart, Sparkles, TrendingUp } from "lucide-react";
import { Aurora, Nav } from "@/components/timeworth/Shell";
import { Counter } from "@/components/timeworth/Counter";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Aurora />
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-24 text-center sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5" /> Emotional finance, reimagined
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="font-display text-5xl leading-[1.05] text-balance sm:text-7xl md:text-8xl"
        >
          What does this <em className="text-accent">really</em>
          <br /> cost you?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
        >
          TimeWorth translates every price into the hours, days and weeks of your life it
          quietly takes away. Spend with clarity.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/onboarding"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition hover:scale-[1.02]"
          >
            Begin your story
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#how"
            className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium"
          >
            How it works
          </a>
        </motion.div>

        {/* Demo card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="glass mx-auto mt-16 max-w-md rounded-3xl p-6 text-left shadow-2xl shadow-black/5"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground">A new iPhone</p>
          <p className="mt-1 font-display text-3xl">₹1,29,900</p>
          <div className="mt-5 rounded-2xl bg-foreground/[0.04] p-5 dark:bg-foreground/[0.06]">
            <p className="font-display text-4xl text-balance sm:text-5xl">
              <Counter value={21.4} decimals={1} suffix=" days" />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">of your life. Is it still worth it?</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <Mini label="Hours" value={171} />
            <Mini label="Weeks" value={4.3} decimals={1} />
            <Mini label="Of salary" value={86} suffix="%" />
          </div>
        </motion.div>
      </section>

      {/* How */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-4xl text-balance sm:text-5xl">How it works</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Three quiet steps. Then every price you see has a second number underneath it.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            { n: "01", t: "Tell us about you", d: "Salary, working hours and days. Stored only on your device." },
            { n: "02", t: "Enter any price", d: "A coffee. A car. A subscription. Anything that has a number." },
            { n: "03", t: "See the truth", d: "Hours, days and weeks of your life — visualized beautifully." },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass rounded-3xl p-7"
            >
              <p className="font-display text-2xl text-accent">{s.n}</p>
              <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emotional demo */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="glass overflow-hidden rounded-[2rem] p-8 sm:p-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-4xl text-balance sm:text-5xl">
                Money is just time, <em className="text-accent">borrowed forward.</em>
              </h2>
              <p className="mt-5 max-w-md text-muted-foreground">
                Every rupee you spend was paid for in minutes of your life. We make that
                trade visible — gently, beautifully, honestly.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                <Stat icon={<Clock className="h-4 w-4" />} t="Avg. time saved" v="3.2 hrs / wk" />
                <Stat icon={<Heart className="h-4 w-4" />} t="Mindful purchases" v="+47%" />
                <Stat icon={<TrendingUp className="h-4 w-4" />} t="Saved in 6 months" v="₹42,000" />
                <Stat icon={<Sparkles className="h-4 w-4" />} t="Users sleeping better" v="91%" />
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-3xl p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  A weekend trip
                </p>
                <p className="mt-1 font-display text-3xl">₹35,000</p>
                <p className="mt-4 font-display text-4xl text-balance sm:text-5xl">
                  <Counter value={5.8} decimals={1} suffix=" days" />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  That's nearly a full work week, traded for one weekend of memories. Worth it.
                </p>
              </div>
              <div className="glass absolute -bottom-6 -right-4 hidden rounded-2xl p-4 sm:block">
                <p className="text-xs text-muted-foreground">If invested at 12%</p>
                <p className="font-display text-2xl">₹1,08,724 in 10y</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="font-display text-4xl text-balance sm:text-5xl">Loved by mindful spenders</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass rounded-3xl p-7"
            >
              <blockquote className="font-display text-xl leading-snug text-balance">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 font-semibold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 py-24 text-center">
        <h2 className="font-display text-5xl text-balance sm:text-6xl">
          Your time is the only currency that matters.
        </h2>
        <p className="mt-5 text-muted-foreground">Start measuring it.</p>
        <Link
          to="/onboarding"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-4 text-sm font-medium text-background transition hover:scale-[1.02]"
        >
          Begin your story <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <footer className="border-t border-border/60 py-10 text-center text-xs text-muted-foreground">
        TimeWorth · Made with care for your hours
      </footer>
    </div>
  );
}

function Mini({ label, value, decimals, suffix }: { label: string; value: number; decimals?: number; suffix?: string }) {
  return (
    <div className="rounded-xl bg-foreground/[0.04] py-3 dark:bg-foreground/[0.06]">
      <p className="font-display text-xl">
        <Counter value={value} decimals={decimals ?? 0} suffix={suffix ?? ""} />
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function Stat({ icon, t, v }: { icon: React.ReactNode; t: string; v: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-xs">{t}</span></div>
      <p className="mt-1 font-display text-xl">{v}</p>
    </div>
  );
}

const TESTIMONIALS = [
  { name: "Ananya R.", role: "Product designer, Bengaluru", quote: "I stopped buying things that cost me a week of my life. Quietly life-changing." },
  { name: "Marcus T.", role: "Engineer, Berlin", quote: "Saw a €900 jacket as 31 hours of code reviews. Closed the tab." },
  { name: "Priya N.", role: "Doctor, Mumbai", quote: "Finally, finance that speaks to my heart and not my spreadsheet." },
];
