"use client";

import { useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type SplitTextProps = {
  text?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | "words, chars";
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right";
  onLetterAnimationComplete?: () => void;
};

const SplitText: React.FC<SplitTextProps> = ({
  text = "",
  tag = "p",
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });

  const elements = useMemo(() => {
    if (splitType === "words" || splitType === "lines") {
      return text.split(" ");
    }
    return text.split("");
  }, [text, splitType]);

  const Tag = tag;

  return (
    <Tag ref={ref} className={className} style={{ textAlign }}>
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{
            duration,
            delay: (index * delay) / 1000,
            ease: ease as any,
          }}
          onAnimationComplete={
            index === elements.length - 1 ? onLetterAnimationComplete : undefined
          }
          style={{
            display: "inline-block",
            willChange: "transform, opacity",
          }}
        >
          {segment}
          {splitType === "words" && index < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </Tag>
  );
};

export default SplitText;
