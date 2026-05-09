"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function FluidCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Update CSS variables for shifting background
      document.documentElement.style.setProperty("--mouse-x", `${(e.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty("--mouse-y", `${(e.clientY / window.innerHeight) * 100}%`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
        <filter id="water-distortion">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <motion.div
        className="fixed pointer-events-none z-50 rounded-full"
        animate={{
          x: mousePosition.x - 100,
          y: mousePosition.y - 100,
        }}
        transition={{ type: "tween", ease: "circOut", duration: 0.2 }}
        style={{
          width: "200px",
          height: "200px",
          backdropFilter: "url(#water-distortion)",
          WebkitBackdropFilter: "url(#water-distortion)",
          background: "radial-gradient(circle, rgba(100, 255, 218, 0.03) 0%, transparent 70%)",
        }}
      />
    </>
  );
}