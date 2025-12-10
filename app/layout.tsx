// app/layout.tsx
import "./globals.css";
import Header from "@/components/Header";
import ClientLayoutWrapper from "@/components/motion/ClientLayoutWrapper";
import ScrollManager from "@/components/ScrollManager";
import Image from "next/image";

import { ReactNode } from "react";
import { cookies } from "next/headers"; // server API

export const metadata = {
  title: "Hakuna Matata",
  description: "Service, Spirituality & Social Welfare",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Read theme cookie on the server. must await cookies() in this Next version/environment.
  let themeCookie: string | undefined = undefined;
  try {
    const ck = await cookies(); // <-- await here
    // ck may be a RequestCookies-like object with .get()
    const val = ck?.get ? ck.get("theme") : undefined;
    themeCookie = val?.value;
  } catch (err) {
    // don't crash; log for dev
    // eslint-disable-next-line no-console
    console.warn("Could not read cookies() in layout (dev-tooling issue)", err);
    themeCookie = undefined;
  }

  const htmlClass = themeCookie === "dark" ? "dark" : undefined;

  return (
    <html lang="en" className={htmlClass}>
      <head>
        {/* Inline script to set initial theme BEFORE hydration when no cookie exists */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `(function() {
  try {
    if (document.cookie.indexOf('theme=') !== -1) return;
    var theme = null;
    try { theme = localStorage.getItem('theme'); } catch(e) {}
    if (theme === null) {
      var m = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
      theme = (m && m.matches) ? 'dark' : 'light';
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();`,
          }}
        />
      </head>

      <body className="relative bg-white text-gray-900 dark:bg-gray-900">
        {/* Background layer (ensure /public/background.jpg exists) */}
        <div
          aria-hidden
          className="site-bg-layer bg-grain"
          style={{
            // CSS fallback background: uses /public/background.jpg
            backgroundImage: "url('/background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            // reduce brightness slightly for readability
            filter: "saturate(0.98) brightness(0.98)",
          }}
        >
          {/* optional: keep <Image> for optimization if you prefer, but CSS will ensure fallback */}
          {/* swoosh SVG */}
          <div className="swoosh" aria-hidden>
            <svg
              viewBox="0 0 1400 420"
              preserveAspectRatio="xMidYMin slice"
              className="w-[1600px] max-w-none -mt-24 opacity-90 dark:opacity-40"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="swooshGrad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#d9f0ff" stopOpacity="1" />
                  <stop offset="50%" stopColor="#eaf6ff" stopOpacity="1" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path
                d="M0,160 C160,120 360,80 560,96 C760,112 960,168 1160,146 C1280,134 1400,110 1400,110 L1400,420 L0,420 Z"
                fill="url(#swooshGrad)"
                transform="translate(-120,-20) scale(1.1)"
              />
            </svg>
          </div>
        </div>

        <ScrollManager />
        <Header />
        <ClientLayoutWrapper>
          <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
            {children}
          </main>
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
