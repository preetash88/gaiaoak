// components/ScrollManager.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * FINAL ScrollManager (Stable)
 *
 * Responsibilities:
 *  1. Disable browser scroll restoration (so refresh always starts at top)
 *  2. Scroll to top on **page refresh**
 *  3. Scroll to top on **route change**
 *  4. Respond to the "forceScrollTop" flag set by logo click
 *  5. Update header blur state on scroll
 */

export default function ScrollManager() {
  const pathname = usePathname();

  /* -----------------------------------------------------
   * 1) INIT: Disable browser's automatic scroll restore
   * ----------------------------------------------------- */
  useEffect(() => {
    try {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
    } catch {}

    return () => {
      try {
        history.scrollRestoration = "auto";
      } catch {}
    };
  }, []);

  /* -----------------------------------------------------
   * 2) RUN ON PAGE LOAD (refresh) — force scroll to top
   * ----------------------------------------------------- */
  useEffect(() => {
    // Allow layout to paint first
    requestAnimationFrame(() => {
      try {
        window.scrollTo(0, 0);
      } catch {}
    });

    // Cleanup before unload to avoid browser remembering scroll
    const resetOnUnload = () => {
      try {
        window.scrollTo(0, 0);
      } catch {}
    };
    window.addEventListener("beforeunload", resetOnUnload);

    return () => window.removeEventListener("beforeunload", resetOnUnload);
  }, []);

  /* -----------------------------------------------------
   * 3) ROUTE CHANGE → always scroll to top
   * ----------------------------------------------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        window.scrollTo(0, 0);
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, [pathname]);

  /* -----------------------------------------------------
   * 4) FORCE SCROLL TOP triggered by logo click
   * ----------------------------------------------------- */
  useEffect(() => {
    try {
      const mustForce = sessionStorage.getItem("forceScrollTop");
      if (mustForce === "1") {
        sessionStorage.removeItem("forceScrollTop");

        // Multiple passes for reliability
        window.scrollTo(0, 0);
        requestAnimationFrame(() => window.scrollTo(0, 0));
        setTimeout(() => window.scrollTo(0, 0), 30);
      }
    } catch {}
  }, [pathname]);

  /* -----------------------------------------------------
   * 5) HEADER: update blur/scrolled state
   * ----------------------------------------------------- */
  useEffect(() => {
    const header = document.querySelector(".glass-nav") as HTMLElement | null;
    if (!header) return;

    const update = () => {
      const scrolled = window.scrollY > 6;
      if (scrolled) header.setAttribute("data-scrolled", "true");
      else header.removeAttribute("data-scrolled");
    };

    update(); // run once immediately

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return null;
}
