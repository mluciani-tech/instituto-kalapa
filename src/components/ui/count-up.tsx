"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";

type CountUpProps = {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  className?: string;
  separator?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  onComplete?: () => void;
};

const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 2,
  delay = 0,
  className = "",
  separator = "",
  prefix = "",
  suffix = "",
  decimals = 0,
  onComplete,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now() + delay * 1000;
    const endTime = startTime + duration * 1000;

    const tick = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;

      setValue(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        onComplete?.();
      }
    };

    requestAnimationFrame(tick);
  }, [isInView, from, to, duration, delay, onComplete]);

  const formatted = value.toFixed(decimals);
  const [intPart, decimalPart] = formatted.split(".");

  // Add thousand separator
  const intFormatted = separator
    ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    : intPart;

  const display = decimalPart ? `${intFormatted}.${decimalPart}` : intFormatted;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

export default CountUp;
