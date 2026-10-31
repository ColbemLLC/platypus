"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { focusRing } from "../../../../layout/kit";
import { CHANNEL_TYPES, ChannelIcon, type ChannelType } from "../../layout/channel-icons";
import type { CommunityFrameData, Permission } from "../../layout/community-frame";
import { Divider, ViewMain, ViewSection } from "../../layout/view-layout";

export type CommunityPatch = { name: string; description: string };
export type NewChannel = { name: string; type: ChannelType };
export type NewRole = { name: string; permissions: Permission[] };

export type SettingsAccess = { general: boolean; channels: boolean; roles: boolean };

export const PERMISSIONS: { key: Permission; label: string }[] = [
  { key: "manage_community", label: "Edit community" },
  { key: "manage_channels", label: "Manage channels" },
  { key: "manage_roles", label: "Manage roles" },
  { key: "post_announcements", label: "Post announcements" },
];

const field = `w-full rounded-nav border border-border bg-background px-3 text-sm placeholder:text-muted ${focusRing}`;
const primary = `h-9 rounded-nav bg-foreground px-4 text-sm font-medium text-background transition-opacity disabled:opacity-40 ${focusRing}`;

function useRun() {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [pending, start] = useTransition();

  function run(task: () => Promise<void>, onDone?: () => void) {
    if (pending) return;
    setError(false);
    start(async () => {
      try {
        await task();
        onDone?.();
        router.refresh();
      } catch {
        setError(true);
      }
    });
  }
  return { run, pending, error };
}

function Note({ children }: { children: string }) {
  return <p className="text-xs text-muted">{children}</p>;
}

function General({ data, onSave }: { data: CommunityFrameData; onSave?: (p: CommunityPatch) => Promise<void> }) {
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description ?? "");
  const [saved, setSaved] = useState(false);
  const { run, pending, error } = useRun();

  const trimmed = name.trim();
  const dirty = trimmed !== data.name || description.trim() !== (data.description ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!onSave || !trimmed || !dirty) return;
        setSaved(false);
        run(() => onSave({ name: trimmed, description: description.trim() }), () => setSaved(true));
      }}
    >
      <ViewSection title="General">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required className={`${field} h-10 font-normal`} />
          </label>
          <Divider />
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} rows={4} className={`${field} resize-none py-2 font-normal`} />
          </label>
        </div>
        <Divider className="my-4" />
        <div className="flex items-center gap-3">
          {!onSave && <Note>Saving isn&apos;t connected yet.</Note>}
          {saved && <Note>Saved</Note>}
          {error && <Note>Couldn&apos;t save. Try again.</Note>}
          <button type="submit" disabled={!onSave || !trimmed || !dirty || pending} className={`ml-auto ${primary}`}>
            {pending ? "Saving" : "Save"}
          </button>
        </div>
      </ViewSection>
    </form>
  );
}

function Channels({ data, onCreate }: { data: CommunityFrameData; onCreate?: (c: NewChannel) => Promise<void> }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ChannelType>("text");
  const { run, pending, error } = useRun();
  const channels = data.channels ?? [];
  const trimmed = name.trim();

  return (
    <ViewSection title="Channels">
      {channels.length === 0 ? (
        <Note>No channels yet.</Note>
      ) : (
        <ul className="flex flex-col">
          {channels.map((c, i) => (
            <li key={c.id}>
              {i > 0 && <Divider />}
              <div className="flex items-center gap-3 py-2.5 text-sm">
                <span className="text-muted">
                  <ChannelIcon type={c.type} />
                </span>
                <span className="min-w-0 flex-1 truncate">{c.name}</span>
                <span className="text-xs text-muted">{CHANNEL_TYPES.find((t) => t.type === c.type)?.label}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Divider className="my-4" />
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!onCreate || !trimmed) return;
          run(() => onCreate({ name: trimmed, type }), () => setName(""));
        }}
      >
        <div role="radiogroup" aria-label="Channel type" className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {CHANNEL_TYPES.map((t) => {
            const active = t.type === type;
            return (
              <button
                key={t.type}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setType(t.type)}
                className={`flex h-16 flex-col items-center justify-center gap-1 rounded-nav border text-xs transition-colors ${
                  active ? "border-foreground bg-hover font-medium" : "border-border text-muted hover:bg-hover hover:text-foreground"
                } ${focusRing}`}
              >
                <ChannelIcon type={t.type} active={active} />
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="Channel name" aria-label="Channel name" className={`${field} h-10`} />
          <button type="submit" disabled={!onCreate || !trimmed || pending} className={`shrink-0 ${primary}`}>
            {pending ? "Adding" : "Add"}
          </button>
        </div>
        {!onCreate && <Note>Creating channels isn&apos;t connected yet.</Note>}
        {error && <Note>Couldn&apos;t add the channel. Try again.</Note>}
      </form>
    </ViewSection>
  );
}

function Roles({ data, onCreate }: { data: CommunityFrameData; onCreate?: (r: NewRole) => Promise<void> }) {
  const [name, setName] = useState("");
  const [perms, setPerms] = useState<Permission[]>([]);
  const { run, pending, error } = useRun();
  const roles = data.roles ?? [];
  const trimmed = name.trim();

  function toggle(p: Permission) {
    setPerms((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  }

  return (
    <ViewSection title="Roles">
      {roles.length === 0 ? (
        <Note>No custom roles yet. Owner, Admin and Member are built in.</Note>
      ) : (
        <ul className="flex flex-col">
          {roles.map((r, i) => (
            <li key={r.id}>
              {i > 0 && <Divider />}
              <div className="py-2.5 text-sm">
                <p className="font-medium">{r.name}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {r.permissions.length === 0 ? "No permissions" : r.permissions.map((p) => PERMISSIONS.find((x) => x.key === p)?.label).join(", ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Divider className="my-4" />
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!onCreate || !trimmed) return;
          run(() => onCreate({ name: trimmed, permissions: perms }), () => {
            setName("");
            setPerms([]);
          });
        }}
      >
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} placeholder="Role name" aria-label="Role name" className={`${field} h-10`} />
        <fieldset className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          <legend className="sr-only">Permissions</legend>
          {PERMISSIONS.map((p) => (
            <label key={p.key} className="flex items-center gap-2 rounded-nav px-2 py-1.5 text-sm hover:bg-hover">
              <input type="checkbox" checked={perms.includes(p.key)} onChange={() => toggle(p.key)} />
              {p.label}
            </label>
          ))}
        </fieldset>
        <div className="flex items-center gap-3">
          {!onCreate && <Note>Creating roles isn&apos;t connected yet.</Note>}
          {error && <Note>Couldn&apos;t create the role. Try again.</Note>}
          <button type="submit" disabled={!onCreate || !trimmed || pending} className={`ml-auto ${primary}`}>
            {pending ? "Creating" : "Create role"}
          </button>
        </div>
      </form>
    </ViewSection>
  );
}

type Tab = "general" | "channels" | "roles";

export default function CommunitySettings({
  data,
  access,
  onSave,
  onCreateChannel,
  onCreateRole,
}: {
  data: CommunityFrameData;
  access: SettingsAccess;
  onSave?: (patch: CommunityPatch) => Promise<void>;
  onCreateChannel?: (channel: NewChannel) => Promise<void>;
  onCreateRole?: (role: NewRole) => Promise<void>;
}) {
  const tabs = (
    [
      ["general", "General"],
      ["channels", "Channels"],
      ["roles", "Roles"],
    ] as [Tab, string][]
  ).filter(([key]) => access[key]);
  const [tab, setTab] = useState<Tab>(tabs[0]?.[0] ?? "general");

  return (
    <ViewMain className="p-6">
      <div className="mx-auto w-full max-w-2xl">
        <div role="tablist" className="mb-6 flex gap-1 border-b border-divider">
          {tabs.map(([key, label]) => {
            const active = key === tab;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(key)}
                className={`-mb-px h-10 border-b-2 px-3 text-sm transition-colors ${
                  active ? "border-foreground font-medium" : "border-transparent text-muted hover:text-foreground"
                } ${focusRing}`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {tab === "general" && access.general && <General data={data} onSave={onSave} />}
        {tab === "channels" && access.channels && <Channels data={data} onCreate={onCreateChannel} />}
        {tab === "roles" && access.roles && <Roles data={data} onCreate={onCreateRole} />}
      </div>
    </ViewMain>
  );
}