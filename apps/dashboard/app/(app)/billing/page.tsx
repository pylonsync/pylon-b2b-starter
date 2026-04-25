import { ArrowRight, CheckCircle2, CreditCard } from "lucide-react";
import { Button } from "@pylon-b2b/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@pylon-b2b/ui/card";
import { Badge } from "@pylon-b2b/ui/badge";
import { getSession } from "@pylon-b2b/auth/server";

const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: "$0",
    features: ["1 organization", "Up to 5 members", "Community support"],
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: "$29",
    features: [
      "Up to 25 members",
      "Audit log retention",
      "Email support",
    ],
  },
  {
    id: "team" as const,
    name: "Team",
    price: "$99",
    features: ["Unlimited members", "SSO", "Priority support"],
  },
];

export default async function BillingPage() {
  const session = await getSession();
  const currentPlan = (session?.activeOrg?.plan ?? "free") as
    | "free"
    | "pro"
    | "team"
    | "enterprise";

  return (
    <main className="flex flex-col gap-6 p-6 md:p-8">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Billing
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your plan and payment method.
        </p>
      </header>

      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <CreditCard className="size-9 rounded-md bg-primary/10 p-2 text-primary" />
          <div className="flex-1">
            <div className="text-sm font-medium">
              You&rsquo;re on the{" "}
              <span className="capitalize">{currentPlan}</span> plan
            </div>
            <div className="text-xs text-muted-foreground">
              No payment method on file. Upgrade to unlock more.
            </div>
          </div>
          <Button variant="outline">Manage in Stripe</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          return (
            <Card
              key={plan.id}
              className={
                isCurrent ? "border-primary/50 ring-2 ring-primary/15" : ""
              }
            >
              <CardHeader>
                <div className="flex items-baseline justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {isCurrent && <Badge>Current</Badge>}
                </div>
                <div className="font-mono text-3xl font-semibold tabular-nums">
                  {plan.price}
                  <span className="text-xs font-normal text-muted-foreground">
                    /mo
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={isCurrent ? "outline" : "default"}
                  className="mt-4 w-full"
                  disabled={isCurrent}
                >
                  {isCurrent ? "Current plan" : "Upgrade"}
                  {!isCurrent && <ArrowRight className="size-4" />}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
