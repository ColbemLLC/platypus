"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { focusRing } from "./kit";

type Kind = "community" | "guild";

const KINDS: { key: Kind; label: string; hint: string }[] = [
  { key: "community", label: "Community", hint: "Open for anyone to discover and join." },
  { key: "guild", label: "Guild", hint: "Chat and organize with your members." },
];

const field = `w-full rounded-nav border border-border bg-background px-3 text-sm placeholder:text-muted ${focusRing}`;

export default function CreateDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [kind, setKind] = useState<Kind>("community");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [onClose]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/me/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, name, description }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; href?: string };

      if (!res.ok || !data.href) {
        setError(data.error ?? "Something went wrong.");
        setPending(false);
        return;
      }

      onClose();
      router.push(data.href);
      router.refresh();
    } catch {
      setError("Could not reach the server.");
      setPending(false);
    }
  }

  const current = KINDS.find((k) => k.key === kind)!;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-title"
        onSubmit={submit}
        className="w-full max-w-md rounded-card border border-border bg-surface p-6"
      >
        <h2 id="create-title" className="font-(family-name:--font-instrument-serif) text-3xl tracking-tight">
          Create a {current.label.toLowerCase()}
        </h2>
        <p className="mt-1 text-sm text-muted">{current.hint}</p>

        <div role="group" aria-label="Type" className="mt-5 grid grid-cols-2 gap-1 rounded-nav bg-background p-1">
          {KINDS.map((k) => (
            <button
              key={k.key}
              type="button"
              aria-pressed={k.key === kind}
              onClick={() => setKind(k.key)}
              className={`h-9 rounded-nav text-sm font-medium transition-colors ${
                k.key === kind ? "bg-hover" : "text-muted hover:text-foreground"
              } ${focusRing}`}
            >
              {k.label}
            </button>
          ))}
        </div>

        <label className="mt-5 block text-sm font-medium">
          Name
          <input
            ref={input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            required
            className={`${field} mt-1.5 h-11`}
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Description <span className="font-normal text-muted">(optional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
            rows={3}
            className={`${field} mt-1.5 resize-none py-2.5`}
          />
        </label>

        {error && (
          <p role="alert" className="mt-4 text-sm text-foreground">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className={`inline-flex h-10 items-center rounded-nav border border-border bg-background px-5 text-sm font-semibold transition-colors hover:bg-hover ${focusRing}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending || name.trim().length < 2}
            className={`inline-flex h-10 items-center rounded-nav bg-cta px-5 text-sm font-semibold text-cta-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
          >
            {pending ? "Creating" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}