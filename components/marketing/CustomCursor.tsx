"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  
  // Use MotionValues instead of React state to avoid re-renders on every frame
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth springs for the cursor follow
  const springX = useSpring(cursorX, { stiffness: 1000, damping: 50, mass: 0.1 });
  const springY = useSpring(cursorY, { stiffness: 1000, damping: 50, mass: 0.1 });
  
  const ringSpringX = useSpring(cursorX, { stiffness: 250, damping: 20, mass: 0.5 });
  const ringSpringY = useSpring(cursorY, { stiffness: 250, damping: 20, mass: 0.5 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-blue-500 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.4 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-blue-400 rounded-full pointer-events-none z-[9998]"
        style={{
          x: ringSpringX,
          y: ringSpringY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0 : 0.5,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}

