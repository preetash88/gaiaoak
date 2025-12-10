import "./globals.css";
import Header from "@/components/Header";
import ClientLayoutWrapper from "@/components/motion/ClientLayoutWrapper";

export const metadata = {
  title: "Hakuna Matata",
  description: "Service, Spirituality & Social Welfare",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {/* <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head> */}
      <body className="bg-white text-gray-900">
        <Header />
        <ClientLayoutWrapper>
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
