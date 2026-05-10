"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function FluidCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch-only devices
    const mql = window.matchMedia("(hover: none)");
    setIsTouchDevice(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Update CSS variables for shifting background
      document.documentElement.style.setProperty("--mouse-x", `${(e.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty("--mouse-y", `${(e.clientY / window.innerHeight) * 100}%`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
        <filter id="water-distortion">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="1" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <motion.div
        className="fixed pointer-events-none z-30 rounded-full"
        animate={{
          x: mousePosition.x - 80,
          y: mousePosition.y - 80,
        }}
        transition={{ type: "tween", ease: "circOut", duration: 0.18 }}
        style={{
          width: "160px",
          height: "160px",
          backdropFilter: "url(#water-distortion)",
          WebkitBackdropFilter: "url(#water-distortion)",
          opacity: 0.35,
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 72%)",
        }}
      />
    </>
  );
}
