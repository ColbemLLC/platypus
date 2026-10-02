import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeScript, ThemeToggle } from "../../../docs/src/packages/theme";
import "../../../docs/src/packages/theme/theme.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Colbe Docs", template: "%s - Colbe Docs" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col bg-background text-foreground antialiased`}
    >
      <ThemeScript />
      <header className="sticky top-0 z-40 border-b border-divider bg-background">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/docs" className="font-semibold tracking-tight">
            Colbe
            <span className="ml-2 font-normal text-muted">Docs</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
