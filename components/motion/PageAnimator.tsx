// components/motion/PageAnimator.tsx
"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageVariants } from "./animations";

export default function PageAnimator({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduce = useReducedMotion();

  // If user prefers reduced motion, just render children without AnimatePresence
  if (shouldReduce) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        style={{ minHeight: "1px" }} // avoid layout shift
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
