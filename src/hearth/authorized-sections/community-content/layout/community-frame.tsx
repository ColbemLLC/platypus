"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Icon, focusRing, type IconName } from "../../../layout/kit";
import { useSetTopbar } from "../../../layout/topbar-content";
import type { CommunityView, Role } from "../data/community-data";
import ChatModule from "../views/chat-module/chat-module";
import CommunitySettings, {
  type CommunityPatch,
  type NewChannel,
  type NewRole,
} from "../views/community-settings/community-settings";
import MembersView, { roleEntries } from "../views/members/members";
import Overview, { Announcements, OverviewSide } from "../views/overview/overview";
import { ChannelIcon, type ChannelType } from "./channel-icons";
import { Divider, ViewMain } from "./view-layout";

type Section = "overview" | "members" | "chat" | "settings" | `channel:${string}`;

// Move these into community-data.ts and add them to CommunityView when you wire the DB.
export type Announcement = {
  id: string;
  content: string;
  createdAt: string; // ISO string
  author: { name: string; image: string | null };
};

export type Channel = { id: string; name: string; type: ChannelType };

export type Permission = "manage_community" | "manage_channels" | "manage_roles" | "post_announcements";

export type CommunityRole = { id: string; name: string; permissions: Permission[] };

export type CommunityFrameData = CommunityView & {
  /** null = the viewer is not a member yet. */
  viewerRole: Role | null;
  /** Permissions granted to the viewer by a custom role. The owner always has all of them. */
  viewerPermissions?: Permission[];
  announcements: Announcement[];
  channels?: Channel[];
  roles?: CommunityRole[];
};

const SECTIONS: { key: "overview" | "members" | "chat"; label: string; icon: IconName; membersOnly?: boolean }[] = [
  { key: "overview", label: "Overview", icon: "home" },
  { key: "members", label: "Members", icon: "communities" },
  { key: "chat", label: "Chat", icon: "dm", membersOnly: true },
];

const MEMBERS_ONLY_CHANNELS: ChannelType[] = ["text", "voice"];

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

function JoinBar({ name, onJoin }: { name: string; onJoin: () => Promise<void> }) {
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
    <div className="flex shrink-0 items-center gap-3 border-b border-divider bg-hover px-4 py-2 text-sm">
      <p className="min-w-0 flex-1 truncate">
        You&apos;re viewing <span className="font-medium">{name}</span>. Join to take part.
      </p>
      {error && (
        <p className="text-xs text-muted" role="alert">
          Couldn&apos;t join. Try again.
        </p>
      )}
      <button
        type="button"
        onClick={join}
        disabled={pending}
        className={`h-8 shrink-0 rounded-nav bg-foreground px-4 text-sm font-medium text-background transition-opacity disabled:opacity-40 ${focusRing}`}
      >
        {pending ? "Joining" : "Join"}
      </button>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex h-10 items-center gap-3 rounded-nav px-3 text-left text-sm transition-colors ${
        active ? "bg-hover font-medium" : "text-muted hover:bg-hover hover:text-foreground"
      } ${focusRing}`}
    >
      {icon}
      <span className="min-w-0 truncate">{label}</span>
    </button>
  );
}

function ChannelView({
  channel,
  data,
  canPost,
  onPost,
}: {
  channel: Channel;
  data: CommunityFrameData;
  canPost: boolean;
  onPost: (content: string) => Promise<void>;
}) {
  if (channel.type === "text") return <ChatModule title={channel.name} />;

  if (channel.type === "announcements") {
    return (
      <ViewMain className="py-6">
        <Announcements items={data.announcements ?? []} canPost={canPost} onPost={onPost} />
      </ViewMain>
    );
  }

  // Voice, rules and blog have no content views yet.
  return (
    <ViewMain className="grid place-items-center p-6 text-center">
      <div className="flex flex-col items-center gap-3 text-muted">
        <ChannelIcon type={channel.type} />
        <p className="font-(family-name:--font-instrument-serif) text-2xl tracking-tight text-foreground">{channel.name}</p>
        <p className="text-sm">Nothing here yet.</p>
      </div>
    </ViewMain>
  );
}

export default function CommunityFrame({
  data,
  onPostAnnouncement,
  onJoin,
  onUpdateCommunity,
  onCreateChannel,
  onCreateRole,
}: {
  data: CommunityFrameData;
  onPostAnnouncement: (content: string) => Promise<void>;
  onJoin?: () => Promise<void>;
  onUpdateCommunity?: (patch: CommunityPatch) => Promise<void>;
  onCreateChannel?: (channel: NewChannel) => Promise<void>;
  onCreateRole?: (role: NewRole) => Promise<void>;
}) {
  const [section, setSection] = useState<Section>("overview");
  const letter = data.name.charAt(0).toUpperCase();
  const isMember = data.viewerRole !== null;
  const isOwner = data.viewerRole === "owner";
  const canManage = isOwner || data.viewerRole === "admin";
  const perms = data.viewerPermissions ?? [];
  const has = (p: Permission) => isOwner || perms.includes(p);

  const access = {
    general: has("manage_community"),
    channels: has("manage_channels"),
    roles: has("manage_roles"),
  };
  const canOpenSettings = isMember && (access.general || access.channels || access.roles);
  const canPost = canManage || has("post_announcements");

  const channels = (data.channels ?? []).filter((c) => isMember || !MEMBERS_ONLY_CHANNELS.includes(c.type));
  const activeChannel = section.startsWith("channel:") ? channels.find((c) => `channel:${c.id}` === section) : undefined;

  useSetTopbar({ label: data.name, image: data.image });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {!isMember && onJoin && <JoinBar name={data.name} onJoin={onJoin} />}

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-divider md:flex">
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
              <InviteButton />
              {canOpenSettings && <SettingsButton active={section === "settings"} onClick={() => setSection("settings")} />}
            </div>
          </div>
          <Divider />

          <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
            <p className="px-3 pb-1 pt-1 text-xs font-medium text-muted">Sections</p>
            {SECTIONS.filter((s) => isMember || !s.membersOnly).map((s) => (
              <NavButton
                key={s.key}
                active={s.key === section}
                onClick={() => setSection(s.key)}
                icon={<Icon name={s.icon} active={s.key === section} />}
                label={s.label}
              />
            ))}

            {channels.length > 0 && (
              <>
                <Divider className="my-2" />
                <p className="px-3 pb-1 pt-1 text-xs font-medium text-muted">Channels</p>
                {channels.map((c) => {
                  const key: Section = `channel:${c.id}`;
                  return (
                    <NavButton
                      key={c.id}
                      active={key === section}
                      onClick={() => setSection(key)}
                      icon={<ChannelIcon type={c.type} active={key === section} />}
                      label={c.name}
                    />
                  );
                })}
              </>
            )}
          </nav>
        </aside>

        {section === "overview" && (
          <>
            <Overview data={data} canPost={canPost} onPost={onPostAnnouncement} />
            <OverviewSide data={data} />
          </>
        )}
        {section === "members" && <MembersView members={data.members} roles={roleEntries(data.roles)} />}
        {section === "chat" && isMember && <ChatModule title={data.name} />}
        {activeChannel && <ChannelView channel={activeChannel} data={data} canPost={canPost} onPost={onPostAnnouncement} />}
        {section === "settings" && canOpenSettings && (
          <CommunitySettings
            data={data}
            access={access}
            onSave={onUpdateCommunity}
            onCreateChannel={onCreateChannel}
            onCreateRole={onCreateRole}
          />
        )}
      </div>
    </div>
  );
}