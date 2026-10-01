import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeScript, ThemeToggle } from "./src/packages/theme";
import "../../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Colbe Docs", template: "%s - Colbe Docs" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <header className="sticky top-0 z-40 border-b border-divider bg-background">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
            <Link href="/" className="font-semibold tracking-tight">
              Colbe
              <span className="ml-2 font-normal text-muted">Docs</span>
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}