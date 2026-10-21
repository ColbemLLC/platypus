import { Avatar } from "../../../../layout/kit";
import type { Member, Role } from "../../data/community-data";
import { Divider, ViewMain } from "../../layout/view-layout";

const ROLES: [Role, string][] = [
  ["owner", "Owner"],
  ["admin", "Admin"],
  ["member", "Member"],
];

export function MemberGroups({ members }: { members: Member[] }) {
  const groups = ROLES.map(([role, label]) => ({ label, list: members.filter((m) => m.role === role) })).filter(
    (g) => g.list.length > 0,
  );

  return (
    <div className="flex flex-col">
      {groups.map(({ label, list }, i) => (
        <section key={label}>
          {i > 0 && <Divider className="my-4" />}
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
      ))}
    </div>
  );
}

export default function MembersView({ members }: { members: Member[] }) {
  return (
    <ViewMain className="p-6">
      <div className="mx-auto w-full max-w-2xl">
        <MemberGroups members={members} />
      </div>
    </ViewMain>
  );
}