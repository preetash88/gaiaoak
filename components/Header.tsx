"use client";
import ThemeToggle from "@/components/ThemeProvider";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const headerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  // Scroll-reactive glass effect
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    // update function - runs in rAF so it happens after layout paint
    const update = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      el.setAttribute("data-scrolled", y > 6 ? "true" : "false");
    };

    // wrapper that schedules update in rAF (safer)
    const schedule = () => {
      // cancel previous rAF if needed - optional
      if (typeof window === "undefined") return;
      window.requestAnimationFrame(update);
    };

    // listeners
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);

    // also run once after mount when the browser has one rAF
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, []);

  //    onScroll(); // initialize on load

  //    window.addEventListener("scroll", onScroll, { passive: true });
  //    return () => window.removeEventListener("scroll", onScroll);
  //  }, []);

  return (
    <header ref={headerRef} className="glass-nav">
      <div className="max-w-6xl mx-auto flex items-center gap-4 px-4 py-3">
        {/* Logo + title */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/10_humming.svg"
            alt="logo"
            width={56}
            height={56}
            className="rounded-md object-contain"
          />

          <div className="min-w-0">
            <div className="font-bold text-3xl leading-tight">
              Hakuna Matata
            </div>

            <div className="text-s font-bold text-[color:var(--muted)]">
              Service • Spirituality • Welfare
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 ml-auto">
          <Link href="/about" className="hover:text-gray-100 font-bold">
            About
          </Link>
          <Link href="/activities" className="hover:text-gray-100 font-bold">
            Activities
          </Link>
          <Link href="/events" className="hover:text-gray-100 font-bold">
            Events
          </Link>
          <Link href="/gallery" className="hover:text-gray-100 font-bold">
            Gallery
          </Link>

          <Link
            href="/donate"
            className="px-4 py-1 rounded-md font-semibold"
            style={{
              background:
                "linear-gradient(90deg, var(--accent), var(--accent-dark))",
              color: "#fff",
            }}
          >
            Donate
          </Link>
        </nav>

        {/* Controls: toggle + menu button */}
        <div className="ml-4 flex items-center gap-2">
          <ThemeToggle />

          <button
            className="md:hidden ml-2 text-2xl"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${open ? "block" : "hidden"} px-4 pb-4`}>
        <nav className="flex flex-col gap-3">
          <Link href="/about" className="block py-2">
            About
          </Link>
          <Link href="/activities" className="block py-2">
            Activities
          </Link>
          <Link href="/events" className="block py-2">
            Events
          </Link>
          <Link href="/gallery" className="block py-2">
            Gallery
          </Link>
          <Link href="/donate" className="block py-2 font-semibold">
            Donate
          </Link>
        </nav>
      </div>
    </header>
  );
}
