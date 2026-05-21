import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav, SoftGradient } from "@/components/timeworth/Shell";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SoftGradient />
      <Nav />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-xs tracking-[0.25em] text-muted-foreground uppercase"
        >
          a moment of pause
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mt-10 text-5xl leading-[1.05] text-balance sm:text-7xl"
        >
          Before you buy it,
          <br />
          ask what it costs.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground"
        >
          Not in money. In hours, days, and weeks of your life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="mt-16"
        >
          <Link
            to="/onboarding"
            className="group text-sm tracking-wider text-foreground/70 uppercase transition hover:text-foreground"
          >
            <span className="border-b border-foreground/30 pb-1 transition group-hover:border-foreground">
              begin
            </span>
          </Link>
        </motion.div>
      </main>

      <footer className="py-10 text-center text-[11px] tracking-widest text-muted-foreground/60 uppercase">
        your time · your life
      </footer>
    </div>
  );
}
