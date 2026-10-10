"use client";

import { PencilSimple } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type CSSProperties, type FormEvent, useEffect, useRef, useState } from "react";
import { authClient } from "@/packages/db/auth/client";

const ease = [0.25, 1, 0.5, 1] as const;

// The home page users land on once their profile is set up.
const AFTER_ONBOARDING = "/home";

// Matches Better Auth's default username rules.
const MIN = 3;
const MAX = 30;

type Status = "idle" | "short" | "checking" | "available" | "taken" | "error";

/** Each word slides up out of a clipped box, one after another (same as the hero). */
function Words({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.15em] pr-[0.1em] -mb-[0.15em] -mr-[0.1em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.7, ease, delay: delay + i * 0.06 }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

/** Pen box shown on the banner and the profile picture. Decorative: the parent button is the click target. */
function EditBadge({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`flex size-9 items-center justify-center rounded-[15px] border border-border bg-background/80 text-foreground backdrop-blur-md transition-colors group-hover:bg-background ${className}`}
    >
      <PencilSimple size={16} weight="bold" />
    </span>
  );
}

function StatusLine({ status, value }: { status: Status; value: string }) {
  const icon = "size-4 shrink-0";
  switch (status) {
    case "checking":
      return (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <svg className={`${icon} animate-spin`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Checking availability…
        </span>
      );
    case "available":
      return (
        <span className="flex items-center gap-1.5 text-green-500">
          <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
          @{value} is available
        </span>
      );
    case "taken":
      return (
        <span className="flex items-center gap-1.5 text-red-500">
          <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
          That username is taken
        </span>
      );
    case "error":
      return <span className="text-red-500">Couldn't check right now. Try again.</span>;
    case "short":
      return <span className="text-muted-foreground">At least {MIN} characters.</span>;
    default:
      return <span className="text-muted-foreground">Letters, numbers, underscores and dots.</span>;
  }
}

export default function Onboarding() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local previews only (blob URLs). Nothing is uploaded yet.
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const avatarInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);

  // Cleanup runs when the URL changes or the page unmounts, so old previews are released.
  useEffect(() => () => { if (avatarUrl) URL.revokeObjectURL(avatarUrl); }, [avatarUrl]);
  useEffect(() => () => { if (bannerUrl) URL.revokeObjectURL(bannerUrl); }, [bannerUrl]);

  function onPick(set: (url: string) => void) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = ""; // lets the same file be picked again
      if (file) set(URL.createObjectURL(file));
    };
  }

  // Debounced availability check; stale responses are ignored.
  useEffect(() => {
    if (!value) {
      setStatus("idle");
      return;
    }
    if (value.length < MIN) {
      setStatus("short");
      return;
    }
    setStatus("checking");
    let cancelled = false;
    const t = setTimeout(async () => {
      const { data, error } = await authClient.isUsernameAvailable({ username: value });
      if (cancelled) return;
      setStatus(error ? "error" : data?.available ? "available" : "taken");
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [value]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status !== "available" || saving) return;

    setSaving(true);
    setError(null);
    // name defaults to the username so the email prefix from sign-up never shows up as a display name.
    const { error } = await authClient.updateUser({ username: value, displayUsername: value, name: value });
    if (error) {
      setSaving(false);
      setError(error.message ?? "Could not save your username.");
      return;
    }
    router.push(AFTER_ONBOARDING);
  }

  const letter = value.charAt(0).toUpperCase();

  return (
    <section className="flex min-h-svh items-center justify-center px-4 py-10">
      <motion.main
        // The avatar scales with the screen; the banner and the overlap follow it.
        style={{ "--avatar": "clamp(7rem, 26vw, 10rem)" } as CSSProperties}
        className="w-full max-w-xl overflow-hidden rounded-[15px] border border-border bg-background"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
      >
        <input ref={bannerInput} type="file" accept="image/*" className="hidden" onChange={onPick(setBannerUrl)} />
        <input ref={avatarInput} type="file" accept="image/*" className="hidden" onChange={onPick(setAvatarUrl)} />

        {/* Banner: the whole area is clickable, pen box top right */}
        <button
          type="button"
          onClick={() => bannerInput.current?.click()}
          aria-label="Edit banner"
          className="group relative block h-28 w-full overflow-hidden bg-linear-to-br from-primary/50 via-primary/25 to-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground sm:h-36 md:h-40"
        >
          {bannerUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={bannerUrl} alt="" className="size-full object-cover" />
          )}
          <EditBadge className="absolute right-3 top-3" />
        </button>

        {/* Profile picture, centered and overlapping the banner */}
        <div className="-mt-[calc(var(--avatar)/2)] flex justify-center">
          <motion.div
            className="relative"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.2 }}
          >
            <button
              type="button"
              onClick={() => avatarInput.current?.click()}
              aria-label="Edit profile picture"
              className="group flex size-[var(--avatar)] items-center justify-center overflow-hidden rounded-full border-[6px] border-background bg-muted text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="" className="size-full object-cover" />
              ) : (
                <AnimatePresence mode="wait" initial={false}>
                  {letter && (
                    <motion.span
                      key={letter}
                      className="font-[family-name:var(--font-instrument-serif)] leading-none"
                      style={{ fontSize: "calc(var(--avatar) * 0.45)" }}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.2, ease }}
                    >
                      {letter}
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </button>
            {/* Outside the clipped circle so it can sit on the edge */}
            <EditBadge className="pointer-events-none absolute bottom-1 right-1" />
          </motion.div>
        </div>

        <div className="flex flex-col gap-6 px-6 pb-8 pt-5">
          <div className="text-center">
            <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl leading-[1.05] tracking-[-0.025em]">
              <span className="block"><Words text="Pick your" delay={0.3} /></span>
              <span className="block"><Words text="username." className="italic text-foreground/60" delay={0.45} /></span>
            </h1>
            <motion.p className="mt-3 text-sm text-muted-foreground" {...fade(0.6)}>
              This is how people find you on Colbe.
            </motion.p>
          </div>

          <motion.form className="flex flex-col gap-3" onSubmit={onSubmit} {...fade(0.7)}>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <span aria-hidden className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-lg text-muted-foreground">
                  @
                </span>
                <input
                  id="username"
                  value={value}
                  onChange={(e) => {
                    // Strip anything the rules don't allow instead of showing an error for it.
                    setValue(e.target.value.replace(/[^a-zA-Z0-9_.]/g, "").slice(0, MAX));
                    setError(null);
                  }}
                  required
                  autoFocus
                  autoComplete="username"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={MAX}
                  placeholder="username"
                  aria-invalid={status === "taken" || status === "short"}
                  aria-describedby="username-status"
                  className="h-12 w-full rounded-nav border border-border bg-background pl-10 pr-4 text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                />
              </div>

              <div id="username-status" aria-live="polite" className="flex items-center justify-between gap-3 px-1 text-xs">
                <StatusLine status={status} value={value} />
                <span className="tabular-nums text-muted-foreground">
                  {value.length}/{MAX}
                </span>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status !== "available" || saving}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-nav bg-cta px-4 text-sm font-semibold text-cta-foreground transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground disabled:opacity-60"
            >
              {saving ? "Saving…" : "Continue"}
            </button>
          </motion.form>
        </div>
      </motion.main>
    </section>
  );
}