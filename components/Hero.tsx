"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";

/**
 * Hero with scroll parallax + pointer parallax (mouse/finger)
 */
export default function Hero() {
  const shouldReduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Scroll-based parallax
  const { scrollY } = useScroll();
  const blob1Y = useTransform(scrollY, [0, 600], [0, -30]);
  const blob2Y = useTransform(scrollY, [0, 600], [0, -18]);
  const blob3Y = useTransform(scrollY, [0, 600], [0, -8]);

  const blob1R = useTransform(scrollY, [0, 800], [0, 10]);
  const blob2R = useTransform(scrollY, [0, 800], [0, -6]);

  // Pointer parallax values (normalized -1..1)
  const px = useMotionValue(0); // normalized x (-1..1)
  const py = useMotionValue(0); // normalized y (-1..1)

  // Map normalized pointer values to pixel offsets per blob
  const blob1X_ptr = useTransform(px, (v) => v * 28);
  const blob1Y_ptr = useTransform(py, (v) => v * 18);

  const blob2X_ptr = useTransform(px, (v) => v * -18);
  const blob2Y_ptr = useTransform(py, (v) => v * -10);

  const blob3X_ptr = useTransform(px, (v) => v * 12);
  const blob3Y_ptr = useTransform(py, (v) => v * 8);

  useEffect(() => {
    // nothing needed here except ensuring hooks are used client-side.
  }, []);

  function handlePointerMove(e: React.PointerEvent) {
    if (shouldReduce) return;

    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);

    const clamp = (v: number) => Math.max(-1, Math.min(1, v));

    px.set(clamp(nx));
    py.set(clamp(ny));
  }

  function handlePointerLeave() {
    if (shouldReduce) return;
    px.set(0);
    py.set(0);
  }

  const cardVariants = {
    initial: { opacity: 0, y: 10, scale: 0.995 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.2, 0.85, 0.2, 1] },
    },
  };

  const headingVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.08 } },
  };

  const ctaVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.16 } },
  };

  return (
    <section
      className="relative overflow-hidden pt-16 pb-24 rounded-2xl"
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >
      {/* =========================
          Full-bleed hero background image (next/image)
          This sits behind the blobs and the glass card.
          Put public/hero.jpg in your repo.
          ========================= */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20w-full overflow-hidden rounded-2xl"
      >
        <Image
          src="/stones.jpg"
          alt="Hero background"
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            borderRadius: "16px",
          }}
          priority

          /* optional: add blur placeholder if you have a small base64 string
             placeholder="blur"
             blurDataURL="data:image/..."
          */
        />
        {/* Optional overlay to darken/lighten the background for contrast */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* Background gradient blobs (absolute) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Blob 1 */}
        <motion.div
          style={
            shouldReduce
              ? {}
              : {
                  y: blob1Y,
                  rotate: blob1R,
                  x: blob1X_ptr,
                }
          }
          initial={shouldReduce ? {} : { scale: 1, rotate: 0 }}
          animate={
            shouldReduce ? {} : { scale: [1, 1.02, 1], rotate: [0, 8, 0] }
          }
          transition={
            shouldReduce
              ? {}
              : { duration: 14, repeat: Infinity, ease: "linear" }
          }
          className="absolute left-[-10%] top-[-10%] w-[520px] h-[520px] rounded-full blur-[64px] opacity-90"
          style={{
            background:
              "radial-gradient(closest-side, rgba(247,199,141,0.95), rgba(247,199,141,0.75), rgba(247,199,141,0.35))",
          }}
        />

        {/* Blob 2 */}
        <motion.div
          style={
            shouldReduce
              ? {}
              : {
                  y: blob2Y,
                  rotate: blob2R,
                  x: blob2X_ptr,
                }
          }
          initial={shouldReduce ? {} : { scale: 1, rotate: 0 }}
          animate={
            shouldReduce ? {} : { scale: [1, 1.03, 1], rotate: [0, -5, 0] }
          }
          transition={
            shouldReduce
              ? {}
              : { duration: 18, repeat: Infinity, ease: "linear" }
          }
          className="absolute right-[-12%] top-[6%] w-[640px] h-[640px] rounded-full blur-[90px] opacity-90"
          style={{
            background:
              "radial-gradient(closest-side, rgba(37,99,235,0.92), rgba(37,99,235,0.6), rgba(37,99,235,0.18))",
          }}
        />

        {/* Blob 3 */}
        <motion.div
          style={
            shouldReduce
              ? {}
              : {
                  y: blob3Y,
                  x: blob3X_ptr,
                }
          }
          initial={shouldReduce ? {} : { scale: 1 }}
          animate={shouldReduce ? {} : { scale: [1, 1.01, 1] }}
          transition={
            shouldReduce
              ? {}
              : { duration: 20, repeat: Infinity, ease: "linear" }
          }
          className="absolute left-[-6%] bottom-[-12%] w-[420px] h-[420px] rounded-full blur-[72px] opacity-90"
          style={{
            background:
              "radial-gradient(closest-side, rgba(196,30,30,0.85), rgba(247,199,141,0.28), rgba(196,30,30,0.08))",
          }}
        />
      </div>

      {/* Content center: glass card */}
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={shouldReduce ? undefined : "initial"}
          animate={shouldReduce ? undefined : "animate"}
          variants={cardVariants}
          className="relative mx-auto max-w-3xl"
        >
          {/* Glass card */}
          <div
            className="relative rounded-2xl p-8 md:p-12"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,255,255,0.56))",
              backdropFilter: "blur(10px) saturate(120%)",
              WebkitBackdropFilter: "blur(10px) saturate(120%)",
              border: "1px solid rgba(255,255,255,0.32)",
            }}
          >
            {/* Header text */}
            <motion.h1
              variants={headingVariants}
              className="text-3xl md:text-4xl font-extrabold leading-tight text-gray-900 dark:text-gray-50"
            >
              Hakuna Matata
            </motion.h1>

            <motion.p
              variants={headingVariants}
              className="mt-3 text-lg text-gray-700 dark:text-gray-200"
            >
              Service • Spirituality • Welfare — bringing relief & hope to our
              community.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={ctaVariants}
              className="mt-6 flex flex-wrap gap-3"
            >
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-semibold shadow-lg"
                style={{
                  background:
                    "linear-gradient(90deg, var(--accent), var(--accent-dark))",
                  color: "#fff",
                  boxShadow: "0 8px 30px rgba(203,67,12,0.12)",
                }}
              >
                Donate
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/90 hover:bg-white/95 shadow-sm text-gray-900"
              >
                Learn More
              </Link>
            </motion.div>

            <motion.div
              variants={ctaVariants}
              className="mt-6 text-sm text-gray-600 dark:text-gray-300"
            >
              <span>
                Free health camps • Food distribution • Community outreach
              </span>
            </motion.div>
          </div>

          {/* Decorative glass border glow */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            aria-hidden
            style={{
              boxShadow: "0 12px 40px rgba(20,20,40,0.06)",
              border: "1px solid rgba(255,255,255,0.06)",
              mixBlendMode: "normal",
            }}
          />
        </motion.div>
      </div>

      {/* slim decorative bottom waves */}
      <div className="mt-12 pointer-events-none">
        <div
          className="mx-auto max-w-3xl h-6 rounded-b-xl"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0))",
          }}
        />
      </div>
    </section>
  );
}
