// components/Header.tsx
"use client";

import ThemeToggle from "@/components/ThemeProvider";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

/**
 * Header: attaches click handler to the logo anchor via ref.
 * Sets sessionStorage flag "forceScrollTop" before navigation so ScrollManager
 * can force the new page to start at the top.
 */

export default function Header() {
  const headerRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function logoClickHandler(e: MouseEvent) {
    // allow modifier-clicks (open in new tab)
    // @ts-ignore
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      (e.button && e.button !== 0)
    ) {
      console.debug(
        "logoClickHandler: modifier click — letting browser handle it"
      );
      return;
    }

    e.preventDefault();
    console.debug("logoClickHandler: intercepted click, pathname:", pathname);

    // If already on homepage -> just scroll to top
    if (
      pathname === "/" ||
      pathname === "" ||
      typeof pathname === "undefined"
    ) {
      try {
        history.scrollRestoration = "manual";
      } catch {}
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } catch {
        window.scrollTo(0, 0);
      }
      setOpen(false);
      console.debug("logoClickHandler: scrolled to top (already on /)");
      return;
    }

    (async () => {
      // before navigating, mark that next page should force-scroll to top
      try {
        sessionStorage.setItem("forceScrollTop", "1");
      } catch {}

      try {
        const nav = router.push("/");
        if (nav && typeof nav.then === "function") await nav;
        console.debug("logoClickHandler: router.push completed");
      } catch (err) {
        console.warn("logoClickHandler: router.push threw", err);
      }

      setOpen(false);

      // immediate fallback scroll resets in case SPA nav completes fast
      try {
        window.scrollTo(0, 0);
      } catch {}
      try {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch {}

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            window.scrollTo(0, 0);
          } catch {}
          setTimeout(() => {
            try {
              window.scrollTo(0, 0);
            } catch {}
          }, 40);
        });
      });

      // final fallback: if SPA nav didn't happen, force full reload to "/"
      setTimeout(() => {
        try {
          if (window.location.pathname !== "/") window.location.href = "/";
        } catch {}
      }, 300);
    })();
  }

  // Attach listener to anchor via ref
  useEffect(() => {
    const a = logoRef.current;
    if (!a) {
      console.warn("Header: logo anchor (#logo-link) not found on mount");
      return;
    }
    console.debug(
      "Header: logo anchor found, attaching listener to #logo-link"
    );
    a.addEventListener("click", logoClickHandler);
    return () => {
      a.removeEventListener("click", logoClickHandler);
      console.debug("Header: removed logo listener on unmount");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoRef.current, pathname]);

  // scroll-reactive glass effect
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      el.setAttribute("data-scrolled", y > 6 ? "true" : "false");
    };
    const schedule = () => requestAnimationFrame(update);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
    };
  }, []);

  return (
    <header ref={headerRef} className="glass-nav">
      <div className="max-w-6xl mx-auto flex items-center gap-4 px-4 py-3">
        {/* Logo + title — anchor with deterministic id and ref */}
        <a
          id="logo-link"
          href="/"
          className="flex items-center gap-3 shrink-0 cursor-pointer"
          aria-label="Home (Hakuna Matata)"
          onClick={(e) => {
            // preserve modifier behavior (open-in-new-tab)
            if (
              e.metaKey ||
              e.ctrlKey ||
              e.shiftKey ||
              e.altKey ||
              (e.button && e.button !== 0)
            ) {
              return;
            }
            // prevent SPA handler, force full reload so page always loads from top
            e.preventDefault();
            try {
              // small guard: avoid setting sessionStorage here
              window.location.href = "/";
            } catch {
              // fallback
              window.location.assign("/");
            }
          }}
        >
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
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 ml-auto">
          <a href="/about" className="hover:text-gray-100 font-bold">
            About
          </a>
          <a href="/activities" className="hover:text-gray-100 font-bold">
            Activities
          </a>
          <a href="/events" className="hover:text-gray-100 font-bold">
            Events
          </a>
          <a href="/gallery" className="hover:text-gray-100 font-bold">
            Gallery
          </a>

          <a
            href="/donate"
            className="px-4 py-1 rounded-md font-semibold"
            style={{
              background:
                "linear-gradient(90deg, var(--accent), var(--accent-dark))",
              color: "#fff",
            }}
          >
            Donate
          </a>
        </nav>

        {/* Controls */}
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
          <a
            href="/about"
            className="block py-2"
            onClick={() => setOpen(false)}
          >
            About
          </a>
          <a
            href="/activities"
            className="block py-2"
            onClick={() => setOpen(false)}
          >
            Activities
          </a>
          <a
            href="/events"
            className="block py-2"
            onClick={() => setOpen(false)}
          >
            Events
          </a>
          <a
            href="/gallery"
            className="block py-2"
            onClick={() => setOpen(false)}
          >
            Gallery
          </a>
          <a
            href="/donate"
            className="block py-2 font-semibold"
            onClick={() => setOpen(false)}
          >
            Donate
          </a>
        </nav>
      </div>
    </header>
  );
}
