import { animate, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect } from "react";

export function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.4,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) =>
    `${prefix}${Number(v).toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`,
  );
  useEffect(() => {
    const c = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] });
    return c.stop;
  }, [value, duration, mv]);
  return <motion.span>{rounded}</motion.span>;
}
