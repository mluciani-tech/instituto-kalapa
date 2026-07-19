"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "-100px",
  animationFrom,
  animationTo,
  easing = (t: number) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });

  const elements = useMemo(
    () => (animateBy === "words" ? text.split(" ") : text.split("")),
    [text, animateBy]
  );

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from(
    { length: stepCount },
    (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1))
  );

  // Build keyframes array for motion
  const keyframes = useMemo(() => {
    return [fromSnapshot, ...toSnapshots] as any[];
  }, [fromSnapshot, toSnapshots]);

  return (
    <div ref={ref} className={className}>
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          initial={fromSnapshot}
          animate={isInView ? keyframes : fromSnapshot}
          transition={{
            duration: totalDuration,
            times,
            delay: (index * delay) / 1000,
            ease: easing as any,
          }}
          onAnimationComplete={
            index === elements.length - 1 ? onAnimationComplete : undefined
          }
          style={{
            display: "inline-block",
            willChange: "transform, filter, opacity",
          }}
        >
          {segment === " " ? "\u00A0" : segment}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </div>
  );
};

export default BlurText;
