import Link from "next/link";

const columns = [
  { title: "Product", links: [["Download", "/download"], ["Docs", "/docs"], ["Privacy Policy", "/privacy"], ["Terms of Use", "/terms"]] },
  { title: "Resources", links: [["Forums", "/forums"], ["Developer Hub", "/developers"]] },
] as const;

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
        <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
          <Link href="/" aria-label={brand} className={`grid size-10 place-items-center self-start rounded-nav bg-cta font-bold text-cta-foreground ${focus}`}>
            {brand[0]}
          </Link>
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="text-xs font-semibold uppercase tracking-widest">{c.title}</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {c.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className={`rounded-sm text-sm text-foreground/80 transition-colors hover:text-foreground ${focus}`}>
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