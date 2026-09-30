import * as motion from "motion/react-client";

const features = [
  { tag: "Guilds", title: "Guilds that feel like home", text: "Spaces for your people, with chat built around how communities actually run.", span: "md:col-span-4", glow: "-right-16 -top-16 size-72" },
  { tag: "Direct messages", title: "Talk one-on-one", text: "Private conversations, right next to your guilds.", span: "md:col-span-2", glow: "-bottom-20 -right-10 size-60" },
  { tag: "Developer hub", title: "Code without leaving", text: "A developer hub with in-browser coding, for the people who build on Colbe.", span: "md:col-span-2", glow: "-left-16 -top-20 size-60" },
  { tag: "Windows app", title: "Native on Windows", text: "A fast native app for modern Windows machines.", span: "md:col-span-2", glow: "-bottom-20 -left-10 size-60" },
  { tag: "On the web", title: "Runs everywhere else", text: "A web version that also works on older hardware.", span: "md:col-span-2", glow: "-right-16 -top-16 size-60" },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <motion.div
        className="max-w-3xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      >
        <h2 className="font-[family-name:var(--font-instrument-serif)] text-5xl leading-[1.05] tracking-[-0.02em] md:text-7xl">
          Everything a guild needs, <em className="text-foreground/50">in one place.</em>
        </h2>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Chat, direct messages and a developer hub, on the web and natively on Windows.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-4 md:grid-cols-6">
        {features.map((f, i) => (
          <motion.article
            key={f.tag}
            className={`group relative isolate flex min-h-64 flex-col justify-end overflow-hidden rounded-card border border-border bg-surface p-7 transition-colors hover:border-blue/60 ${f.span}`}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: i * 0.08 }}
          >
            <div
              aria-hidden
              className={`pointer-events-none absolute -z-10 rounded-full bg-blue/40 blur-3xl transition-transform duration-700 group-hover:scale-125 ${f.glow}`}
            />
            <p className="text-sm font-medium text-muted">{f.tag}</p>
            <h3 className="mt-2 font-[family-name:var(--font-instrument-serif)] text-3xl leading-tight md:text-4xl">{f.title}</h3>
            <p className="mt-3 max-w-md text-muted">{f.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}