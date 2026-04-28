import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Design Playbook Starter",
  description:
    "Code-first design starter following the AI Design Playbook. Codebase is the design system.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

/**
 * Runs before paint to set data-theme. Reads stored preference first;
 * falls back to system. Avoids the flash-of-wrong-theme.
 */
const NO_FLASH = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var pref = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = pref;
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
`.trim();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
