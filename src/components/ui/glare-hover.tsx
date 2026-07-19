"use client";

import { useRef, useState } from "react";

type GlareHoverProps = {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  glareTransitionSpeed?: number;
  borderRadius?: number;
};

const GlareHover: React.FC<GlareHoverProps> = ({
  children,
  className = "",
  glareColor = "rgba(255, 255, 255, 0.4)",
  glareOpacity = 0.3,
  glareAngle = -30,
  glareSize = 300,
  glareTransitionSpeed = 300,
  borderRadius = 16,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGlarePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Glare effect */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          opacity: isHovered ? glareOpacity : 0,
          transition: `opacity ${glareTransitionSpeed}ms ease`,
          background: `radial-gradient(
            ${glareSize}px circle at ${glarePosition.x}px ${glarePosition.y}px,
            ${glareColor},
            transparent 50%
          )`,
          transform: `rotate(${glareAngle}deg)`,
        }}
      />
    </div>
  );
};

export default GlareHover;
