"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { focusRing } from "../../../../layout/kit";
import type { CommunityFrameData } from "../../layout/community-frame";
import { Divider, ViewMain, ViewSection } from "../../layout/view-layout";

export type CommunityPatch = { name: string; description: string };

const field = `w-full rounded-nav border border-border bg-background px-3 text-sm placeholder:text-muted ${focusRing}`;

export default function CommunitySettings({
  data,
  onSave,
}: {
  data: CommunityFrameData;
  onSave: (patch: CommunityPatch) => Promise<void>;
}) {
  const router = useRouter();
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description ?? "");
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [pending, startTransition] = useTransition();

  const trimmed = name.trim();
  const dirty = trimmed !== data.name || description.trim() !== (data.description ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!trimmed || !dirty || pending) return;
    setStatus("idle");
    startTransition(async () => {
      try {
        await onSave({ name: trimmed, description: description.trim() });
        setStatus("saved");
        router.refresh();
      } catch {
        setStatus("error");
      }
    });
  }

  return (
    <ViewMain className="p-6">
      <form onSubmit={submit} className="mx-auto w-full max-w-2xl">
        <ViewSection title="Community settings">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                required
                className={`${field} h-10 font-normal`}
              />
            </label>
            <Divider />
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
                rows={4}
                className={`${field} resize-none py-2 font-normal`}
              />
            </label>
          </div>
          <Divider className="my-4" />
          <div className="flex items-center gap-3">
            {status === "saved" && <p className="text-xs text-muted">Saved</p>}
            {status === "error" && (
              <p className="text-xs text-muted" role="alert">
                Couldn&apos;t save. Try again.
              </p>
            )}
            <button
              type="submit"
              disabled={!trimmed || !dirty || pending}
              className={`ml-auto h-9 rounded-nav bg-foreground px-4 text-sm font-medium text-background transition-opacity disabled:opacity-40 ${focusRing}`}
            >
              {pending ? "Saving" : "Save"}
            </button>
          </div>
        </ViewSection>
      </form>
    </ViewMain>
  );
}