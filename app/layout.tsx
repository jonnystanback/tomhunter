import type { Metadata } from "next";
import localFont from "next/font/local";
import { Space_Mono, Inter } from "next/font/google";
import { PlayerProvider } from "@/components/PlayerProvider";
import { PlayerBar } from "@/components/PlayerBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";
import "./globals.css";

const display = localFont({
  src: "../public/fonts/403Code-Fuzz-Regular.otf",
  variable: "--font-display",
  display: "swap",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tom Hunter — Producer",
  description: "Producer. Selected works.",
  openGraph: {
    title: "Tom Hunter",
    description: "Producer. Selected works.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tom Hunter",
    description: "Producer. Selected works.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${mono.variable} ${sans.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('th-theme')||'dark';document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`,
          }}
        />
      </head>
      <body className="font-mono grain min-h-dvh">
        <PlayerProvider>
          <Nav />
          <main className="pb-32">
            {children}
            <Footer />
          </main>
          <PlayerBar />
        </PlayerProvider>
        <LoadingScreen />
      </body>
    </html>
  );
}
