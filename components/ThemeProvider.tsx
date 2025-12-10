// components/ThemeProvider.tsx
"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark" | null;
const STORAGE_KEY = "sangha_theme_pref";
const TRANSITION_CLASS = "theme-transition";
const TRANSITION_DURATION = 220; // ms

/* safe localStorage */
function safeLocalStorageGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeLocalStorageSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

/* inject CSS once */
function injectSliderCssOnce() {
  if (typeof window === "undefined") return;
  if (document.getElementById("theme-slider-styles")) return;

  const style = document.createElement("style");
  style.id = "theme-slider-styles";
  style.textContent = `
/* ---- Compact theme slider with side icons ---- */
.theme-slider {
  --pill-w: 56px;    /* total width */
  --pill-h: 28px;    /* total height */
  --knob-size: 20px; /* knob diameter */
  display:inline-flex;
  align-items:center;
  justify-content:space-between;
  gap:6px;
  position:relative;
  padding:4px;
  width:var(--pill-w);
  height:var(--pill-h);
  border-radius:999px;
  background: rgba(255,255,255,0.92); /* light pill by default */
  border: 1px solid rgba(2,6,23,0.06);
  box-shadow: 0 6px 12px rgba(2,6,23,0.06);
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
}

/* dark pill background */
html.dark .theme-slider {
  background: rgba(35,43,52,0.36);
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 6px 14px rgba(2,6,23,0.6);
}

/* icon containers (left/right) */
.theme-slider__icon {
  width: 16px;
  height: 16px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  flex: 0 0 16px;
  margin: 0 2px;
}

/* Sun: saffron in light, dim in dark */
.theme-slider__icon.sun { color: #F59E0B; }
html.dark .theme-slider__icon.sun { color: rgba(255,255,255,0.48); }

/* Moon: grey in light, blue in dark */
.theme-slider__icon.moon { color: rgba(107,114,128,1); }
html.dark .theme-slider__icon.moon { color: #60A5FA; }

/* knob (absolute for reliable sliding) */
.theme-slider__knob {
  position: absolute;
  left: 4px; /* left padding */
  top: 50%;
  transform: translateY(-50%);
  width: var(--knob-size);
  height: var(--knob-size);
  border-radius: 999px;
  background: #4B5563; /* dark grey (light mode) */
  box-shadow: 0 6px 14px rgba(2,6,23,0.12);
  transition:
    left ${TRANSITION_DURATION}ms cubic-bezier(.2,.9,.25,1),
    background 180ms ease,
    box-shadow 180ms ease,
    transform ${TRANSITION_DURATION}ms ease;
  z-index: 5;
  display:inline-flex;
  align-items:center;
  justify-content:center;
}

/* knob in dark mode (make fully emerald green) */
/* We set both when html.dark is present and when the button has .theme-slider--on */
html.dark .theme-slider__knob,
.theme-slider--on .theme-slider__knob {
  background: #10B981; /* emerald green */
  box-shadow: 0 8px 18px rgba(16,185,129,0.16);
}

/* When ON, move knob to the right (calc uses pill width and padding) */
.theme-slider--on .theme-slider__knob {
  left: calc(100% - 4px - var(--knob-size));
}

/* remove inner dot so knob is fully colored */
.theme-slider__knob::after { content: ""; display: none; }

/* focus ring */
.theme-slider:focus-visible {
  outline: none;
  box-shadow: 0 0 0 6px rgba(59,130,246,0.08);
  border-radius: 999px;
}

/* respects reduced motion */
@media (prefers-reduced-motion: reduce) {
  .theme-slider,
  .theme-slider__knob {
    transition: none !important;
  }
}
`;
  document.head.appendChild(style);
}

/* apply theme class to document */
function applyThemeToDocument(theme: "light" | "dark") {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
}

/* small transition helper */
function enableThemeTransitionOnce() {
  if (typeof window === "undefined") return;
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;
  if (document.getElementById("theme-transition-styles")) return;
  const style = document.createElement("style");
  style.id = "theme-transition-styles";
  style.textContent = `
html.${TRANSITION_CLASS} * { transition: background-color ${TRANSITION_DURATION}ms ease, color ${TRANSITION_DURATION}ms ease, border-color ${TRANSITION_DURATION}ms ease, box-shadow ${TRANSITION_DURATION}ms ease; }
html.${TRANSITION_CLASS} { transition: background-color ${TRANSITION_DURATION}ms ease, color ${TRANSITION_DURATION}ms ease; }
  `;
  document.head.appendChild(style);
}

/* useTheme hook (client-init only to avoid SSR mismatch) */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(null);

  useEffect(() => {
    injectSliderCssOnce();

    const stored = safeLocalStorageGet(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      applyThemeToDocument(stored);
      setTheme(stored);
      return;
    }

    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = prefersDark ? "dark" : "light";
    applyThemeToDocument(initial);
    setTheme(initial);

    // listen for system changes only if user hasn't picked
    const mql = window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;
    const handler = () => {
      const nowStored = safeLocalStorageGet(STORAGE_KEY);
      if (nowStored !== "light" && nowStored !== "dark") {
        const prefers = mql?.matches ? "dark" : "light";
        applyThemeToDocument(prefers as "light" | "dark");
        setTheme(prefers as "light" | "dark");
      }
    };
    if (mql) {
      if (mql.addEventListener) mql.addEventListener("change", handler);
      else mql.addListener(handler);
    }
    return () => {
      if (mql) {
        if (mql.removeEventListener) mql.removeEventListener("change", handler);
        else mql.removeListener(handler);
      }
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const current =
      theme ??
      (document.documentElement.classList.contains("dark") ? "dark" : "light");
    const next: "light" | "dark" = current === "light" ? "dark" : "light";

    enableThemeTransitionOnce();
    document.documentElement.classList.add(TRANSITION_CLASS);
    window.setTimeout(() => {
      document.documentElement.classList.remove(TRANSITION_CLASS);
    }, TRANSITION_DURATION + 20);

    applyThemeToDocument(next);
    safeLocalStorageSet(STORAGE_KEY, next);
    setTheme(next);
  }, [theme]);

  return { theme, toggleTheme };
}

/* ThemeToggle component */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  const isDark = theme === "dark";

  function handleKey(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggleTheme();
    }
  }

  return (
    <button
      role="switch"
      aria-checked={isDark}
      onClick={() => toggleTheme()}
      onKeyDown={handleKey}
      className={`theme-slider ${isDark ? "theme-slider--on" : ""}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {/* Sun icon (left) */}
      <span className="theme-slider__icon sun" aria-hidden>
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <g
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2.8v1.6" />
            <path d="M12 19.6v1.6" />
            <path d="M4.4 4.4l1.14 1.14" />
            <path d="M18.46 18.46l1.14 1.14" />
            <path d="M2.8 12h1.6" />
            <path d="M19.6 12h1.6" />
            <path d="M4.4 19.6l1.14-1.14" />
            <path d="M18.46 5.54l1.14-1.14" />
          </g>
        </svg>
      </span>

      {/* Knob */}
      <span className="theme-slider__knob" aria-hidden />

      {/* Moon icon (right) */}
      <span className="theme-slider__icon moon" aria-hidden>
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 12.75a4.5 4.5 0 11-6.75-4.02 5.1 5.1 0 005.78 5.78A4.48 4.48 0 0115 12.75z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  );
}
