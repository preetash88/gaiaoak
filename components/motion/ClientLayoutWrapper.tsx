// components/motion/ClientLayoutWrapper.tsx
"use client";

import PageAnimator from "./PageAnimator";
import { ReactNode } from "react";

export default function ClientLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <PageAnimator>{children}</PageAnimator>;
}
