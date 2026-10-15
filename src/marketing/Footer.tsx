import Link from "next/link";
import {
  BookOpen,
  ChatsCircle,
  Code,
  DownloadSimple,
  FileText,
  Heart,
  ShieldCheck,
  type Icon,
} from "@phosphor-icons/react/dist/ssr";

type FooterLink = readonly [label: string, href: string, icon: Icon];

const columns: readonly { title: string; links: readonly FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      ["Download", "/download", DownloadSimple],
      ["docs", "/docs", BookOpen],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Forums", "/forums", ChatsCircle],
      ["Developer Hub", "/developers", Code],
    ],
  },
  {
    title: "Policies",
    links: [
      ["Privacy Policy", "/privacy", ShieldCheck],
      ["Terms of Use", "/terms", FileText],
    ],
  },
  {
    title: "Acknowledgements",
    links: [["Credits", "/credits", Heart]],
  },
];

// Same ripple as the Navbar, flipped so it rises from the footer's top edge.
const ripple = "radial-gradient(ellipse 7px 5px at 50% 100%, #000 98%, transparent 100%)";
const mask = {
  maskImage: ripple,
  WebkitMaskImage: ripple,
  maskSize: "14px 5px",
  WebkitMaskSize: "14px 5px",
  maskRepeat: "repeat-x",
  WebkitMaskRepeat: "repeat-x",
} as const;

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

function BotswanaFlag() {
  return (
    <svg width="30" height="20" viewBox="0 0 36 24" role="img" aria-label="Flag of Botswana" className="rounded-[3px]">
      <rect width="36" height="24" fill="#75aadb" />
      <rect y="9" width="36" height="6" fill="#fff" />
      <rect y="10" width="36" height="4" fill="#000" />
    </svg>
  );
}

export default function Footer({ brand = "Colbe" }: { brand?: string }) {
  return (
    <footer className="relative mt-16 bg-hover text-foreground">
      <div aria-hidden className="absolute inset-x-0 bottom-[calc(100%-1px)] h-[5px] bg-hover" style={mask} />

      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-14 px-6 py-14 md:flex-row md:px-10">
        <div className="flex flex-col gap-10 sm:flex-row sm:flex-wrap sm:gap-16">
          <Link href="/" aria-label={brand} className={`self-start rounded-nav ${focus}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://github.com/ColbemLLC.png"
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-nav"
            />
          </Link>
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="text-xs font-semibold uppercase tracking-widest">{c.title}</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {c.links.map(([label, href, Icon]) => (
                  <li key={href}>
                    <Link href={href} className={`inline-flex items-center gap-2 rounded-sm text-sm text-foreground/80 transition-colors hover:text-foreground ${focus}`}>
                      <Icon size={16} aria-hidden />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="self-end font-[family-name:var(--font-instrument-serif)] text-xl leading-snug md:text-right">
          The ColbemLLC organization
          <span className="flex items-center gap-2.5 md:justify-end">
            <em className="text-foreground/60">from</em> Botswana <BotswanaFlag />
          </span>
        </p>
      </div>
    </footer>
  );
}