"use client";

import { type ComponentPropsWithoutRef, type ReactNode } from "react";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

const BentoGrid = ({ children, className = "", ...props }: BentoGridProps) => {
  return (
    <div
      className={`grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { BentoGrid };
