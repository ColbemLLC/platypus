"use client";

import Downbar from "./downbar";
import { useState } from "react";
import ChatLayout from "../user-chat/chat-layout";
import { Avatar, Icon, focusRing, type IconName } from "../../layout/kit";
import { useSetTopbar } from "../../layout/topbar-content";
import type { CommunityView, Member, Role } from "./community-data";

type Section = "overview" | "members" | "chat";

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

function Side({ data }: { data: CommunityView }) {
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

function Overview({ data }: { data: CommunityView }) {
  const letter = data.name.charAt(0).toUpperCase();

  return (
    <main className="min-w-0 flex-1 overflow-y-auto">
      {data.banner ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.banner} alt="" className="h-36 w-full object-cover sm:h-44" />
      ) : (
        <div className="h-36 bg-hover sm:h-44" />
      )}
      <div className="-mt-12 flex flex-col items-center px-5 pb-10 text-center">
        <div className="rounded-card border border-border bg-surface p-1.5">
          <Avatar image={data.image} letter={letter} className="size-24 rounded-nav bg-hover text-4xl" />
        </div>
        <h1 className="mt-4 font-(family-name:--font-instrument-serif) text-4xl leading-tight tracking-tight">{data.name}</h1>
        {data.description && <p className="mt-2 max-w-md text-muted">{data.description}</p>}
      </div>
    </main>
  );
}

export default function CommunityFrame({ data }: { data: CommunityView }) {
  const [section, setSection] = useState<Section>("overview");
  const letter = data.name.charAt(0).toUpperCase();

  useSetTopbar({ label: data.name, image: data.image });

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="hidden w-60 shrink-0 flex-col gap-1 overflow-y-auto p-3 md:flex">
        <div className="flex items-center gap-3 px-2 pb-3">
          <Avatar image={data.image} letter={letter} className="size-10 rounded-nav bg-hover" />
          <p className="truncate font-medium">{data.name}</p>
        </div>
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
      </aside>

      {section === "overview" && (
        <>
          <Overview data={data} />
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