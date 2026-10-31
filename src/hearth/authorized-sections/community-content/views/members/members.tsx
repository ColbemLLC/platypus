import { Avatar } from "../../../../layout/kit";
import type { Member } from "../../data/community-data";
import { Divider, ViewMain } from "../../layout/view-layout";

export type RoleEntry = [key: string, label: string];

const BASE_ROLES: RoleEntry[] = [
  ["owner", "Owner"],
  ["admin", "Admin"],
  ["member", "Member"],
];

/** Built-in roles plus any custom roles configured in settings. */
export function roleEntries(custom: { id: string; name: string }[] = []): RoleEntry[] {
  return [...BASE_ROLES, ...custom.map((r): RoleEntry => [r.id, r.name])];
}

export function MemberGroups({
  members,
  roles = BASE_ROLES,
  showEmpty = false,
}: {
  members: Member[];
  roles?: RoleEntry[];
  showEmpty?: boolean;
}) {
  const groups = roles
    .map(([key, label]) => ({ key, label, list: members.filter((m) => String(m.role) === key) }))
    .filter((g) => showEmpty || g.list.length > 0);

  return (
    <div className="flex flex-col">
      {groups.map(({ key, label, list }, i) => (
        <section key={key}>
          {i > 0 && <Divider className="my-4" />}
          <h3 className="px-1 text-sm font-medium text-muted">
            {list.length} {label}
            {list.length === 1 ? "" : "s"}
          </h3>
          {list.length === 0 ? (
            <p className="mt-2 px-1 text-xs text-muted">No one yet</p>
          ) : (
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
          )}
        </section>
      ))}
    </div>
  );
}

export default function MembersView({ members, roles }: { members: Member[]; roles?: RoleEntry[] }) {
  return (
    <ViewMain className="p-6">
      <div className="mx-auto w-full max-w-2xl">
        <MemberGroups members={members} roles={roles} />
      </div>
    </ViewMain>
  );
}