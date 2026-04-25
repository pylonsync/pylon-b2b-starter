import { Card } from "@pylon-b2b/ui/card";
import { Badge } from "@pylon-b2b/ui/badge";
import { Avatar, AvatarFallback } from "@pylon-b2b/ui/avatar";

const SAMPLE = [
  {
    id: "1",
    actor: "You",
    kind: "workspace_created",
    summary: "Created the workspace",
    when: "2m ago",
    color: "#8b5cf6",
  },
  {
    id: "2",
    actor: "You",
    kind: "plan_changed",
    summary: "Selected the Free plan",
    when: "2m ago",
    color: "#8b5cf6",
  },
  {
    id: "3",
    actor: "You",
    kind: "user_signed_up",
    summary: "Created your account",
    when: "3m ago",
    color: "#8b5cf6",
  },
];

const KIND_VARIANT: Record<
  string,
  "default" | "secondary" | "success" | "warning"
> = {
  workspace_created: "success",
  plan_changed: "default",
  user_signed_up: "secondary",
};

export default function AuditPage() {
  return (
    <main className="flex flex-col gap-6 p-6 md:p-8">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Audit log
        </h1>
        <p className="text-sm text-muted-foreground">
          Every change in your workspace, with who and when.
        </p>
      </header>

      <Card>
        <ul className="divide-y divide-border/40">
          {SAMPLE.map((e) => (
            <li key={e.id} className="flex items-center gap-4 px-5 py-3">
              <Avatar className="size-7" style={{ backgroundColor: e.color }}>
                <AvatarFallback className="bg-transparent text-[11px] text-white">
                  {e.actor.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-medium">{e.actor}</span>{" "}
                  <span className="text-muted-foreground">— {e.summary}</span>
                </div>
                <div className="text-xs text-muted-foreground">{e.when}</div>
              </div>
              <Badge variant={KIND_VARIANT[e.kind] ?? "secondary"}>
                {e.kind.replace(/_/g, " ")}
              </Badge>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
