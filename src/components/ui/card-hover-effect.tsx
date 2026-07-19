"use client";

import { useState } from "react";

type CardHoverEffectProps = {
  children: React.ReactNode;
  className?: string;
  overlayColor?: string;
  overlayOpacity?: number;
};

const CardHoverEffect: React.FC<CardHoverEffectProps> = ({
  children,
  className = "",
  overlayColor = "rgba(26, 60, 77, 0.05)",
  overlayOpacity = 1,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <div
      className={`relative overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {/* Hover overlay with radial gradient following cursor */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(
            400px circle at ${mousePosition.x}px ${mousePosition.y}px,
            ${overlayColor},
            transparent 50%
          )`,
          opacity: isHovered ? overlayOpacity : 0,
        }}
      />
    </div>
  );
};

export default CardHoverEffect;
