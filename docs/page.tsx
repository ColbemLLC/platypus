import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-32 text-center">
      <h1 className="text-5xl font-semibold tracking-tight">Colbe Docs</h1>
      <p className="max-w-xl text-lg text-muted">
        Guides and reference for guild chat, direct messages and the developer hub.
      </p>
      <Link
        href="/getting-started"
        className="rounded-nav bg-cta px-5 py-2.5 text-sm font-medium text-cta-foreground transition-opacity hover:opacity-90"
      >
        Get started
      </Link>
    </section>
  );
}