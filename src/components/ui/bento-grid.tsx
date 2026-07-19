"use client";

import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { ArrowRightIcon } from "lucide-react";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon?: React.ElementType;
  description: string;
  href?: string;
  cta?: string;
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

const BentoCard = ({
  name,
  className = "",
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <div
    key={name}
    className={`group relative col-span-1 md:col-span-3 flex flex-col justify-between overflow-hidden rounded-xl
      bg-white/70 backdrop-blur-sm
      border border-white/80
      shadow-[0_2px_8px_rgba(0,0,0,0.04)]
      transition-all duration-300 hover:shadow-xl hover:shadow-brand-purple/10 hover:-translate-y-1
      ${className}`}
    {...props}
  >
    <div>{background}</div>
    <div className="p-4">
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 transition-all duration-300 lg:group-hover:-translate-y-10">
        {Icon && (
          <Icon className="h-12 w-12 origin-left transform-gpu text-brand-purple transition-all duration-300 ease-in-out group-hover:scale-75" />
        )}
        <h3 className="text-xl font-semibold text-brand-charcoal">
          {name}
        </h3>
        <p className="max-w-lg text-brand-charcoal/60">{description}</p>
      </div>

      {href && cta && (
        <div className="pointer-events-none flex w-full translate-y-0 transform-gpu flex-row items-center transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:hidden">
          <a
            href={href}
            className="pointer-events-auto inline-flex items-center gap-2 text-brand-terracotta font-medium text-sm hover:text-brand-terracotta-dark transition-colors"
          >
            {cta}
            <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>

    {href && cta && (
      <div className="pointer-events-none absolute bottom-0 hidden w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:flex">
        <a
          href={href}
          className="pointer-events-auto inline-flex items-center gap-2 text-brand-terracotta font-medium text-sm hover:text-brand-terracotta-dark transition-colors"
        >
          {cta}
          <ArrowRightIcon className="w-4 h-4" />
        </a>
      </div>
    )}

    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[0.03]" />
  </div>
);

export { BentoCard, BentoGrid };
