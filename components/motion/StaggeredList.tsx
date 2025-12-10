// components/motion/StaggeredList.tsx
"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { staggerHalf, listItem } from "./animations";

export function StaggeredList({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerHalf}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <div>{children}</div>;
  return <motion.div variants={listItem}>{children}</motion.div>;
}
