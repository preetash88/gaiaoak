// components/ScrollManager.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollManager
 * - Disables automatic browser scroll restoration and forces scroll-to-top
 *   on refresh and on client-side route changes. Mount this in your root
 *   layout so it runs early.
 *
 * Note: If you want to *preserve* history (back/forward) scroll restoration,
 * you would implement a more advanced state-managed approach. This enforces
 * top-of-page behavior on reloads and navigations, per your requirement.
 */
export default function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.querySelector(".glass-nav") as HTMLElement | null;
    if (!header) return;
    const update = () => {
      const scrolled = window.scrollY > 6;
      if (scrolled) header.setAttribute("data-scrolled", "true");
      else header.removeAttribute("data-scrolled");
    };
    update(); // run immediately on mount
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    // If available, prefer setting history.scrollRestoration to manual early
    // so browser won't automatically restore scroll on reload.
    try {
      if ("scrollRestoration" in history) {
        // Set to manual while our SPA is mounted
        history.scrollRestoration = "manual";
      }
    } catch (e) {
      // ignore - some environments may not allow changing this
    }

    // On mount, force scroll to top (covers page refresh)
    // Use setTimeout(0) to let the browser complete initial layout in edge cases.
    const t = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 0);

    // On unload (user refresh/close), optionally set scroll to 0 to avoid saved pos in some browsers.
    const onBeforeUnload = () => {
      try {
        window.scrollTo(0, 0);
      } catch (e) {}
    };
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("beforeunload", onBeforeUnload);
      // restore to auto when component unmounts (safe cleanup)
      try {
        if ("scrollRestoration" in history) {
          history.scrollRestoration = "auto";
        }
      } catch (e) {}
    };
  }, []);

  // Scroll to top when pathname changes (client-side navigation)
  useEffect(() => {
    // small delay helps Next finish rendering new content before scrolling
    const id = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
