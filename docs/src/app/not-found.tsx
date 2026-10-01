import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-32 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted">The page you requested could not be found.</p>
      <Link href="/" className="text-sm font-medium text-blue hover:underline">
        Return to docs home
      </Link>
    </section>
  );
}
