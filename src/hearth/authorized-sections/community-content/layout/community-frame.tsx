"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Icon, focusRing, type IconName } from "../../../layout/kit";
import { useSetTopbar } from "../../../layout/topbar-content";
import type { CommunityView, Role } from "../data/community-data";
import ChatModule from "../views/chat-module/chat-module";
import CommunitySettings, { type CommunityPatch } from "../views/community-settings/community-settings";
import MembersView from "../views/members/members";
import Overview, { OverviewSide } from "../views/overview/overview";
import { Divider } from "./view-layout";

type Section = "overview" | "members" | "chat" | "settings";

// Move these into community-data.ts and add them to CommunityView when you wire the DB.
export type Announcement = {
  id: string;
  content: string;
  createdAt: string; // ISO string
  author: { name: string; image: string | null };
};

export type CommunityFrameData = CommunityView & {
  /** null = the viewer is not a member yet. */
  viewerRole: Role | null;
  announcements: Announcement[];
};

const SECTIONS: { key: Exclude<Section, "settings">; label: string; icon: IconName; membersOnly?: boolean }[] = [
  { key: "overview", label: "Overview", icon: "home" },
  { key: "members", label: "Members", icon: "communities" },
  { key: "chat", label: "Chat", icon: "dm", membersOnly: true },
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

function JoinButton({ onJoin }: { onJoin: () => Promise<void> }) {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();

  function join() {
    if (pending) return;
    setError(false);
    startTransition(async () => {
      try {
        await onJoin();
        router.refresh();
      } catch {
        setError(true);
      }
    });
  }

  return (
    <div className="flex flex-1 flex-col gap-1">
      <button
        type="button"
        onClick={join}
        disabled={pending}
        className={`flex h-9 items-center justify-center rounded-nav bg-foreground text-sm font-medium text-background transition-opacity disabled:opacity-40 ${focusRing}`}
      >
        {pending ? "Joining" : "Join"}
      </button>
      {error && (
        <p className="text-xs text-muted" role="alert">
          Couldn&apos;t join. Try again.
        </p>
      )}
    </div>
  );
}

function SettingsButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={`${headerButton} ${active ? "bg-border" : ""}`}>
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
      Settings
    </button>
  );
}

export default function CommunityFrame({
  data,
  onPostAnnouncement,
  onJoin,
  onUpdateCommunity,
}: {
  data: CommunityFrameData;
  onPostAnnouncement: (content: string) => Promise<void>;
  onJoin?: () => Promise<void>;
  onUpdateCommunity?: (patch: CommunityPatch) => Promise<void>;
}) {
  const [section, setSection] = useState<Section>("overview");
  const letter = data.name.charAt(0).toUpperCase();
  const isMember = data.viewerRole !== null;
  const canManage = data.viewerRole === "owner" || data.viewerRole === "admin";
  const isOwner = data.viewerRole === "owner";
  const canEditSettings = isOwner && !!onUpdateCommunity;

  useSetTopbar({ label: data.name, image: data.image });

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="hidden w-60 shrink-0 flex-col md:flex">
        {/* Fixed header: stays put while the section list scrolls */}
        <div className="flex shrink-0 flex-col gap-3 p-3 pt-4">
          {data.banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.banner} alt="" className="h-20 w-full rounded-card object-cover" />
          )}
          <div className="flex items-center gap-3 px-1">
            <Avatar image={data.image} letter={letter} className="size-10 rounded-nav bg-hover" />
            <p className="truncate font-medium">{data.name}</p>
          </div>
          <div className="flex gap-2">
            {isMember ? <InviteButton /> : onJoin && <JoinButton onJoin={onJoin} />}
            {canEditSettings && <SettingsButton active={section === "settings"} onClick={() => setSection("settings")} />}
          </div>
        </div>
        <Divider />

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
          <p className="px-3 pb-1 pt-1 text-xs font-medium text-muted">Sections</p>
          {SECTIONS.filter((s) => isMember || !s.membersOnly).map((s) => {
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
          <OverviewSide data={data} />
        </>
      )}
      {section === "members" && <MembersView members={data.members} />}
      {section === "chat" && isMember && <ChatModule title={data.name} />}
      {section === "settings" && canEditSettings && <CommunitySettings data={data} onSave={onUpdateCommunity} />}
    </div>
  );
}