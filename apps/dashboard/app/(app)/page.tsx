import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@pylon-b2b/ui/card";
import { Button } from "@pylon-b2b/ui/button";
import { Badge } from "@pylon-b2b/ui/badge";

export default function OverviewPage() {
  return (
    <main className="flex flex-col gap-6 p-6 md:p-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&rsquo;s a quick look at your workspace.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="size-4" />}
          label="Members"
          value="1"
          delta="+1 this week"
        />
        <StatCard
          icon={<Activity className="size-4" />}
          label="Active sessions"
          value="2"
          delta=""
        />
        <StatCard
          icon={<CreditCard className="size-4" />}
          label="Plan"
          value="Free"
          delta="Upgrade →"
        />
        <StatCard
          icon={<CheckCircle2 className="size-4" />}
          label="Setup"
          value="Done"
          delta=""
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Get the most out of Pylon</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <Checklist
            label="Invite teammates"
            sub="Get your collaborators in the workspace."
            href="/members"
            done={false}
          />
          <Checklist
            label="Add an API key"
            sub="For CI / external integrations."
            href="/api-keys"
            done={false}
          />
          <Checklist
            label="Connect billing"
            sub="Switch to a paid plan when you&rsquo;re ready."
            href="/billing"
            done={false}
          />
          <Checklist
            label="Read the docs"
            sub="Live queries, policies, deploys."
            href="http://localhost:3002"
            done={false}
          />
        </CardContent>
      </Card>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  delta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span className="grid size-7 place-items-center rounded-md bg-primary/10 text-primary">
            {icon}
          </span>
        </div>
        <div className="mt-3 font-display text-2xl font-semibold tabular-nums">
          {value}
        </div>
        {delta && (
          <div className="mt-1 text-xs text-muted-foreground">{delta}</div>
        )}
      </CardContent>
    </Card>
  );
}

function Checklist({
  label,
  sub,
  href,
  done,
}: {
  label: string;
  sub: string;
  href: string;
  done: boolean;
}) {
  return (
    <a
      href={href}
      className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-primary/40 hover:bg-accent/30"
    >
      <span
        className={
          "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border " +
          (done
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border")
        }
      >
        {done && <CheckCircle2 className="size-4" />}
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm font-medium">
          {label}
          {done && <Badge variant="success">Done</Badge>}
        </div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}
