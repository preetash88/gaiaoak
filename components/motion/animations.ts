// components/motion/animations.ts
import { Variants } from "framer-motion";

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.32, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export const staggerHalf = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export const listItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.36 } },
};
