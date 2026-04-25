"use client";

/**
 * Three-step org onboarding: workspace details → invite teammates →
 * pick a plan. State lives in this component; each step calls out to
 * the Pylon backend via plain `fetch` (the Pylon sync engine isn't
 * needed for one-off setup tasks).
 *
 * On final step, we cookie-set the active org and route to `/`.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Button } from "@pylon-b2b/ui/button";
import { Card, CardContent } from "@pylon-b2b/ui/card";
import { Input } from "@pylon-b2b/ui/input";
import { Label } from "@pylon-b2b/ui/label";
import { Badge } from "@pylon-b2b/ui/badge";
import { cn } from "@pylon-b2b/ui/utils";
import type { User } from "@pylon-b2b/db";

const PYLON_URL =
  process.env.NEXT_PUBLIC_PYLON_URL ?? "http://localhost:4321";

type Step = 1 | 2 | 3;

const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: "$0",
    blurb: "For solo builders.",
    features: ["1 organization", "Up to 5 members", "Community support"],
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "$29",
    blurb: "For small teams.",
    features: [
      "Up to 25 members",
      "Audit log retention",
      "Email support",
    ],
    featured: true,
  },
  {
    id: "team" as const,
    name: "Team",
    price: "$99",
    blurb: "Growing companies.",
    features: ["Unlimited members", "SSO", "Priority support"],
  },
];

export function OnboardingFlow({ user }: { user: User }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [orgId, setOrgId] = useState<string | null>(null);
  const [invites, setInvites] = useState<string[]>([]);
  const [draftEmail, setDraftEmail] = useState("");
  const [plan, setPlan] = useState<"free" | "pro" | "team">("free");

  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);
  }

  async function handleStep1() {
    if (!orgName.trim()) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`${PYLON_URL}/api/fn/createOrganization`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: orgName.trim(),
          slug: orgSlug.trim() || autoSlug(orgName),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error?.message ?? "Could not create");
      setOrgId(body.orgId);
      // Persist active org cookie + tell Pylon for tenant_id resolution
      await fetch("/api/auth/active-org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId: body.orgId }),
      });
      setStep(2);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleStep2() {
    if (!orgId) return;
    setBusy(true);
    setErr(null);
    try {
      // Send an Invitation per email. Failing one shouldn't kill the
      // whole flow — surface partial errors but continue.
      const results = await Promise.allSettled(
        invites.map((email) =>
          fetch(`${PYLON_URL}/api/fn/sendInvitation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ orgId, email, role: "member" }),
          }),
        ),
      );
      const failed = results.filter((r) => r.status === "rejected").length;
      if (failed > 0) setErr(`${failed} invitation(s) failed to send.`);
      setStep(3);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleStep3() {
    if (!orgId) return;
    setBusy(true);
    setErr(null);
    try {
      // Free plan: just set status active and we're done. Paid plans
      // would normally redirect to Stripe Checkout — for the demo we
      // mark them trialing.
      await fetch(`${PYLON_URL}/api/fn/setOrgPlan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orgId, plan }),
      }).catch(() => {});
      router.push("/");
      router.refresh();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-primary/10 via-background to-background p-6">
      <div className="w-full max-w-2xl">
        <Stepper step={step} />
        <Card className="mt-6">
          <CardContent className="p-8">
            {step === 1 && (
              <Step1
                user={user}
                orgName={orgName}
                setOrgName={(n) => {
                  setOrgName(n);
                  setOrgSlug(autoSlug(n));
                }}
                orgSlug={orgSlug}
                setOrgSlug={setOrgSlug}
              />
            )}
            {step === 2 && (
              <Step2
                invites={invites}
                setInvites={setInvites}
                draftEmail={draftEmail}
                setDraftEmail={setDraftEmail}
              />
            )}
            {step === 3 && <Step3 plan={plan} setPlan={setPlan} />}

            {err && (
              <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {err}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              {step > 1 ? (
                <Button
                  variant="ghost"
                  onClick={() => setStep((step - 1) as Step)}
                  disabled={busy}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}
              {step === 1 && (
                <Button
                  onClick={handleStep1}
                  disabled={busy || !orgName.trim()}
                >
                  {busy && <Loader2 className="size-4 animate-spin" />}
                  Continue <ArrowRight className="size-4" />
                </Button>
              )}
              {step === 2 && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(3)}
                    disabled={busy}
                  >
                    Skip
                  </Button>
                  <Button onClick={handleStep2} disabled={busy}>
                    {busy && <Loader2 className="size-4 animate-spin" />}
                    {invites.length === 0
                      ? "Skip"
                      : `Send ${invites.length} invite${invites.length === 1 ? "" : "s"}`}
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              )}
              {step === 3 && (
                <Button onClick={handleStep3} disabled={busy}>
                  {busy && <Loader2 className="size-4 animate-spin" />}
                  Enter dashboard <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps = [
    { n: 1, label: "Workspace", icon: <Building2 className="size-4" /> },
    { n: 2, label: "Teammates", icon: <Users className="size-4" /> },
    { n: 3, label: "Plan", icon: <Sparkles className="size-4" /> },
  ];
  return (
    <ol className="flex items-center gap-3 text-sm">
      {steps.map((s, i) => {
        const done = step > s.n;
        const active = step === s.n;
        return (
          <li
            key={s.n}
            className={cn(
              "flex items-center gap-2",
              i < steps.length - 1 && "flex-1",
            )}
          >
            <div
              className={cn(
                "grid size-7 place-items-center rounded-full border text-xs font-medium",
                done
                  ? "border-primary bg-primary text-primary-foreground"
                  : active
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground",
              )}
            >
              {done ? <CheckCircle2 className="size-4" /> : s.icon}
            </div>
            <span
              className={cn(
                "font-medium",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1",
                  step > s.n ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Step1({
  user,
  orgName,
  setOrgName,
  orgSlug,
  setOrgSlug,
}: {
  user: User;
  orgName: string;
  setOrgName: (s: string) => void;
  orgSlug: string;
  setOrgSlug: (s: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">
        Hi {user.displayName.split(" ")[0]} 👋
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Let&rsquo;s set up your first workspace.
      </p>
      <div className="mt-6 grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="org-name">Workspace name</Label>
          <Input
            id="org-name"
            autoFocus
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Acme Inc."
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="org-slug">URL slug</Label>
          <div className="flex">
            <span className="inline-flex h-9 items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
              acme.app/
            </span>
            <Input
              id="org-slug"
              value={orgSlug}
              onChange={(e) =>
                setOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
              }
              className="rounded-l-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step2({
  invites,
  setInvites,
  draftEmail,
  setDraftEmail,
}: {
  invites: string[];
  setInvites: (next: string[]) => void;
  draftEmail: string;
  setDraftEmail: (s: string) => void;
}) {
  function add() {
    const trimmed = draftEmail.trim().toLowerCase();
    if (!trimmed.includes("@")) return;
    if (invites.includes(trimmed)) return;
    setInvites([...invites, trimmed]);
    setDraftEmail("");
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Invite teammates</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Optional — they&rsquo;ll get an email with a link to join.
      </p>
      <div className="mt-6 flex gap-2">
        <Input
          placeholder="alice@company.com"
          value={draftEmail}
          onChange={(e) => setDraftEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={add}>
          <Mail className="size-4" />
          Add
        </Button>
      </div>
      {invites.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {invites.map((email) => (
            <li key={email}>
              <Badge variant="secondary" className="gap-1.5">
                {email}
                <button
                  type="button"
                  onClick={() =>
                    setInvites(invites.filter((e) => e !== email))
                  }
                  className="opacity-60 hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Step3({
  plan,
  setPlan,
}: {
  plan: "free" | "pro" | "team";
  setPlan: (p: "free" | "pro" | "team") => void;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">Pick a plan</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Start free. Upgrade anytime.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {PLANS.map((p) => {
          const selected = plan === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlan(p.id)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
                selected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "hover:border-primary/40",
              )}
            >
              <div className="flex w-full items-baseline justify-between">
                <span className="font-semibold">{p.name}</span>
                {p.featured && <Badge>Popular</Badge>}
              </div>
              <span className="font-mono text-2xl font-semibold tabular-nums">
                {p.price}
                <span className="text-xs font-normal text-muted-foreground">
                  /mo
                </span>
              </span>
              <span className="text-xs text-muted-foreground">{p.blurb}</span>
              <ul className="mt-2 flex flex-col gap-1 text-[11px] text-muted-foreground">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
