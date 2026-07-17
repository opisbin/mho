import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/geist-mono/400.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored ? stored : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export const metadata: Metadata = {
  title: "Meherab Hossain ??? Full-Stack Developer & Designer",
  description: "Portfolio of Meherab Hossain, a design-engineer building digital experiences with the web.",
  openGraph: {
    title: "Meherab Hossain ??? Full-Stack Developer & Designer",
    description: "Portfolio of Meherab Hossain, a design-engineer building digital experiences with the web.",
    url: "https://www.srbh.site",
    siteName: "Meherab Hossain",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meherab Hossain",
    description: "Full-Stack Developer & Designer",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
