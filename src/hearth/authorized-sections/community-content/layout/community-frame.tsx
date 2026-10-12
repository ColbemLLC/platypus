"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChatLayout from "../../user-chat/chat-layout";
import { Avatar, Icon, focusRing, type IconName } from "../../../layout/kit";
import { useSetTopbar } from "../../../layout/topbar-content";
import type { CommunityView, Member, Role } from "../data/community-data";

type Section = "overview" | "members" | "chat";

// Move these into community-data.ts and add them to CommunityView when you wire the DB.
export type Announcement = {
  id: string;
  content: string;
  createdAt: string; // ISO string
  author: { name: string; image: string | null };
};

export type CommunityFrameData = CommunityView & {
  viewerRole: Role;
  announcements: Announcement[];
  settingsHref?: string;
};

const SECTIONS: { key: Section; label: string; icon: IconName }[] = [
  { key: "overview", label: "Overview", icon: "home" },
  { key: "members", label: "Members", icon: "communities" },
  { key: "chat", label: "Chat", icon: "dm" },
];

const ROLES: [Role, string][] = [
  ["owner", "Owner"],
  ["admin", "Admin"],
  ["member", "Member"],
];

const headerButton = `flex h-9 flex-1 items-center justify-center gap-2 rounded-nav bg-hover text-sm transition-colors hover:bg-border ${focusRing}`;

function InviteButton() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied): nothing to confirm.
    }
  }

  return (
    <button type="button" onClick={copyLink} className={headerButton}>
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M22 11h-6" />
      </svg>
      {copied ? "Link copied" : "Invite"}
    </button>
  );
}

function SettingsLink({ href }: { href: string }) {
  return (
    <Link href={href} className={headerButton}>
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
      Settings
    </Link>
  );
}

function MemberGroups({ members }: { members: Member[] }) {
  return (
    <div className="flex flex-col gap-5">
      {ROLES.map(([role, label]) => {
        const list = members.filter((m) => m.role === role);
        if (list.length === 0) return null;

        return (
          <section key={role}>
            <h3 className="px-1 text-sm font-medium text-muted">
              {list.length} {label}
              {list.length === 1 ? "" : "s"}
            </h3>
            <ul className="mt-2 flex flex-col gap-1">
              {list.map((m) => (
                <li key={m.id} className="flex items-center gap-3 rounded-nav px-2 py-1.5">
                  <Avatar image={m.image} letter={m.name.charAt(0).toUpperCase()} className="size-9 rounded-full bg-hover" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{m.name}</span>
                    {m.username && <span className="block truncate text-xs text-muted">@{m.username}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function AboutRow({ children, icon }: { children: string; icon: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 py-3 text-sm">
      <span className="text-muted">{icon}</span>
      {children}
    </li>
  );
}

function Side({ data }: { data: CommunityFrameData }) {
  return (
    <aside className="hidden w-80 shrink-0 flex-col gap-4 overflow-y-auto p-4 xl:flex">
      <div className="rounded-card border border-border bg-background p-5">
        <h2 className="font-(family-name:--font-instrument-serif) text-2xl tracking-tight">About</h2>
        <ul className="mt-2 divide-y divide-divider">
          <AboutRow icon={<Icon name="communities" />}>Community</AboutRow>
          <AboutRow icon={<Icon name="profile" />}>{`${data.members.length} ${data.members.length === 1 ? "member" : "members"}`}</AboutRow>
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
      </div>
      <div className="rounded-card border border-border bg-background p-5">
        <MemberGroups members={data.members} />
      </div>
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
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-5 pb-10 text-left">
      <h2 className="font-(family-name:--font-instrument-serif) text-2xl tracking-tight">Announcements</h2>

      {canPost && (
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
            <p className="mt-3 whitespace-pre-wrap break-words text-sm">{a.content}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Overview({
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
    <main className="min-w-0 flex-1 overflow-y-auto">
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
    </main>
  );
}

export default function CommunityFrame({
  data,
  onPostAnnouncement,
}: {
  data: CommunityFrameData;
  onPostAnnouncement: (content: string) => Promise<void>;
}) {
  const [section, setSection] = useState<Section>("overview");
  const letter = data.name.charAt(0).toUpperCase();
  const canManage = data.viewerRole === "owner" || data.viewerRole === "admin";

  useSetTopbar({ label: data.name, image: data.image });

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="hidden w-60 shrink-0 flex-col md:flex">
        {/* Fixed header: stays put while the section list scrolls */}
        <div className="flex shrink-0 flex-col gap-3 border-b border-divider p-3 pt-4">
          {data.banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.banner} alt="" className="h-20 w-full rounded-card object-cover" />
          )}
          <div className="flex items-center gap-3 px-1">
            <Avatar image={data.image} letter={letter} className="size-10 rounded-nav bg-hover" />
            <p className="truncate font-medium">{data.name}</p>
          </div>
          <div className="flex gap-2">
            <InviteButton />
            {canManage && data.settingsHref && <SettingsLink href={data.settingsHref} />}
          </div>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
          <p className="px-3 pb-1 pt-1 text-xs font-medium text-muted">Sections</p>
          {SECTIONS.map((s) => {
            const active = s.key === section;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSection(s.key)}
                aria-current={active ? "page" : undefined}
                className={`flex h-10 items-center gap-3 rounded-nav px-3 text-left text-sm transition-colors ${
                  active ? "bg-hover font-medium" : "text-muted hover:bg-hover hover:text-foreground"
                } ${focusRing}`}
              >
                <Icon name={s.icon} active={active} />
                {s.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {section === "overview" && (
        <>
          <Overview data={data} canPost={canManage} onPost={onPostAnnouncement} />
          <Side data={data} />
        </>
      )}
      {section === "members" && (
        <main className="min-w-0 flex-1 overflow-y-auto p-6">
          <MemberGroups members={data.members} />
        </main>
      )}
      {section === "chat" && <ChatLayout title={data.name} />}
    </div>
  );
}