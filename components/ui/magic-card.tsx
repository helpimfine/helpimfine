"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  gradientTransparency?: number;
}

export const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#262626",
  gradientOpacity,
  gradientTransparency = 20,
  ...props
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setPosition({ x: ev.clientX - rect.left, y: ev.clientY - rect.top });
    };

    if (isHovered) {
      window.addEventListener("mousemove", updateMousePosition);
    }

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [isHovered]);

  const gradientStyle = {
    background: `radial-gradient(${gradientSize}px circle at ${position.x}px ${position.y}px, ${gradientColor}${gradientTransparency} 0%, transparent 100%)`,
    opacity: gradientOpacity ?? opacity,
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      onMouseEnter={() => {
        setIsHovered(true);
        setOpacity(1);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setOpacity(0);
      }}
      {...props}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity rounded-lg"
        style={gradientStyle}
      />
    </div>
  );
};