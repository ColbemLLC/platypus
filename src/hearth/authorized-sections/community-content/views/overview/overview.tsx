"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Icon, focusRing } from "../../../../layout/kit";
import type { CommunityFrameData, Announcement } from "../../layout/community-frame";
import { Divider, ViewCard, ViewMain, ViewSection } from "../../layout/view-layout";
import { MemberGroups } from "../members/members";

function AboutRow({ children, icon }: { children: string; icon: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 py-3 text-sm">
      <span className="text-muted">{icon}</span>
      {children}
    </li>
  );
}

export function OverviewSide({ data }: { data: CommunityFrameData }) {
  const count = data.members.length;
  return (
    <aside className="hidden w-80 shrink-0 flex-col gap-4 overflow-y-auto p-4 xl:flex">
      <ViewCard>
        <h2 className="font-(family-name:--font-instrument-serif) text-2xl tracking-tight">About</h2>
        <ul className="mt-2 divide-y divide-divider">
          <AboutRow icon={<Icon name="communities" />}>Community</AboutRow>
          <AboutRow icon={<Icon name="profile" />}>{`${count} ${count === 1 ? "member" : "members"}`}</AboutRow>
          <AboutRow
            icon={
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
            }
          >
            {`Since ${data.since}`}
          </AboutRow>
        </ul>
      </ViewCard>
      <ViewCard>
        <MemberGroups members={data.members} />
      </ViewCard>
    </aside>
  );
}

function Announcements({
  items,
  canPost,
  onPost,
}: {
  items: Announcement[];
  canPost: boolean;
  onPost: (content: string) => Promise<void>;
}) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    const content = text.trim();
    if (!content || pending) return;
    setError(null);
    startTransition(async () => {
      try {
        await onPost(content);
        setText("");
        router.refresh();
      } catch {
        setError("Couldn't post the announcement. Try again.");
      }
    });
  }

  if (!canPost && items.length === 0) return null;

  return (
    <ViewSection title="Announcements" className="mx-auto w-full max-w-2xl px-5 pb-10 text-left">
      {canPost && (
        <>
          <div className="rounded-card border border-border bg-background p-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
              }}
              rows={3}
              maxLength={2000}
              placeholder="Post an announcement"
              aria-label="Announcement"
              className={`w-full resize-none rounded-nav bg-transparent px-2 py-1.5 text-sm placeholder:text-muted ${focusRing}`}
            />
            <div className="mt-2 flex items-center gap-3">
              {error && <p className="text-xs text-muted" role="alert">{error}</p>}
              <button
                type="button"
                onClick={submit}
                disabled={!text.trim() || pending}
                className={`ml-auto h-9 rounded-nav bg-foreground px-4 text-sm font-medium text-background transition-opacity disabled:opacity-40 ${focusRing}`}
              >
                {pending ? "Posting" : "Post"}
              </button>
            </div>
          </div>
          {items.length > 0 && <Divider className="my-4" />}
        </>
      )}

      <ul className="flex flex-col gap-3">
        {items.map((a) => (
          <li key={a.id} className="rounded-card border border-border bg-background p-4">
            <div className="flex items-center gap-3">
              <Avatar image={a.author.image} letter={a.author.name.charAt(0).toUpperCase()} className="size-8 rounded-full bg-hover" />
              <span className="min-w-0 truncate text-sm font-medium">{a.author.name}</span>
              <time dateTime={a.createdAt} className="ml-auto shrink-0 text-xs text-muted">
                {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </time>
            </div>
            <Divider className="my-3" />
            <p className="whitespace-pre-wrap break-words text-sm">{a.content}</p>
          </li>
        ))}
      </ul>
    </ViewSection>
  );
}

export default function Overview({
  data,
  canPost,
  onPost,
}: {
  data: CommunityFrameData;
  canPost: boolean;
  onPost: (content: string) => Promise<void>;
}) {
  const letter = data.name.charAt(0).toUpperCase();

  return (
    <ViewMain>
      {data.banner ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.banner} alt="" className="h-36 w-full object-cover sm:h-44" />
      ) : (
        <div className="h-36 bg-hover sm:h-44" />
      )}
      <div className="-mt-12 flex flex-col items-center px-5 pb-8 text-center">
        <div className="rounded-card border border-border bg-surface p-1.5">
          <Avatar image={data.image} letter={letter} className="size-24 rounded-nav bg-hover text-4xl" />
        </div>
        <h1 className="mt-4 font-(family-name:--font-instrument-serif) text-4xl leading-tight tracking-tight">{data.name}</h1>
        {data.description && <p className="mt-2 max-w-md text-muted">{data.description}</p>}
      </div>
      <Announcements items={data.announcements ?? []} canPost={canPost} onPost={onPost} />
    </ViewMain>
  );
}