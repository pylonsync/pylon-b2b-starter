import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Layers,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@pylon-b2b/ui/button";
import { Badge } from "@pylon-b2b/ui/badge";
import { Card } from "@pylon-b2b/ui/card";

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3001";
const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? "http://localhost:3002";

export default function MarketingHome() {
  return (
    <>
      <Nav />
      <Hero />
      <SocialProof />
      <Features />
      <Architecture />
      <Pricing />
      <Cta />
      <Footer />
    </>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-6 border-b bg-background/85 px-6 backdrop-blur">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Logo />
        <span>Pylon B2B</span>
      </Link>
      <nav className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
        <Link href="#features" className="hover:text-foreground">
          Features
        </Link>
        <Link href="#pricing" className="hover:text-foreground">
          Pricing
        </Link>
        <Link href={DOCS_URL} className="hover:text-foreground">
          Docs
        </Link>
      </nav>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`${DASHBOARD_URL}/login`}>Log in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href={`${DASHBOARD_URL}/signup`}>
            Start free <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-background to-background" />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[600px] opacity-50"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, var(--color-primary) 0%, transparent 70%)",
          maskImage:
            "linear-gradient(to bottom, black 30%, transparent 100%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 text-center">
        <Badge variant="secondary" className="mb-6">
          <Sparkles className="size-3" /> v0.2 — Multi-tenant out of the box
        </Badge>
        <h1 className="font-display mx-auto max-w-3xl text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
          The realtime backend
          <br />
          for B2B SaaS.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
          Multi-tenant policies, live queries, organizations, invitations,
          billing, audit log — wired up before you start. Ship a production
          SaaS in a weekend, not a quarter.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href={`${DASHBOARD_URL}/signup`}>
              Start free <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={DOCS_URL}>Read the docs</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Open source · Self-hosted in one binary · Free up to 1k MAU
        </p>
      </div>
    </section>
  );
}

function SocialProof() {
  const logos = ["Atlas", "Orbit", "Nimbus", "Forge", "Quill", "Relay"];
  return (
    <section className="border-y bg-muted/40 py-10">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Trusted by teams shipping
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-lg font-mono text-muted-foreground/70">
          {logos.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: <Layers className="size-5" />,
      title: "Multi-tenant from line one",
      body:
        "Organizations, members, invitations, role-based access. Tenant-scoped queries enforce isolation in the policy layer — not your application code.",
    },
    {
      icon: <Zap className="size-5" />,
      title: "Live queries, no WebSocket plumbing",
      body:
        "`db.useQuery(...)` subscribes to a query. Server pushes deltas; React re-renders. Tens of thousands of subscriptions per server.",
    },
    {
      icon: <Shield className="size-5" />,
      title: "Policies that actually compose",
      body:
        "`auth.userId == data.ownerId`, role checks, tenant gates — declarative expressions that evaluate alongside every read and write.",
    },
    {
      icon: <Database className="size-5" />,
      title: "SQL underneath when you need it",
      body:
        "Pylon entities map to real SQLite or Postgres tables. Drop into raw SQL for the 5% of queries that ORMs make worse.",
    },
    {
      icon: <Users className="size-5" />,
      title: "Org onboarding shipped",
      body:
        "Sign up → create workspace → invite teammates → pick a plan. Every step wired with audit events and email-ready hooks.",
    },
    {
      icon: <CheckCircle2 className="size-5" />,
      title: "Billing wired",
      body:
        "Stripe customer + subscription stub, plan-gated features helper, webhook handler for status syncs. Bring your own publishable key.",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you&rsquo;d build in your first month
        </h2>
        <p className="mt-3 text-balance text-base text-muted-foreground">
          Skip the auth bikeshed and the multi-tenant rewrite.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="p-6">
            <div className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
              {f.icon}
            </div>
            <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {f.body}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Architecture() {
  return (
    <section className="border-y bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            One binary. Three deploy targets.
          </h2>
          <p className="mt-3 text-balance text-base text-muted-foreground">
            Self-host on a $5 VPS, deploy to Cloudflare Workers, or run our
            managed cloud. Same code.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Self-hosted",
              tag: "$5/mo VPS",
              body: "Single Rust binary. SQLite by default, Postgres optional. systemd unit included.",
            },
            {
              title: "Cloudflare Workers",
              tag: "Free tier",
              body: "Same code, WASM bundle. D1 for storage, Durable Objects for WebSockets.",
            },
            {
              title: "Pylon Cloud",
              tag: "Managed",
              body: "Per-tenant isolation, autoscaling, point-in-time recovery. Zero-config.",
            },
          ].map((d) => (
            <Card key={d.title} className="p-6">
              <Badge variant="secondary" className="mb-3">
                {d.tag}
              </Badge>
              <h3 className="text-base font-semibold">{d.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      tagline: "For solo builders.",
      features: [
        "1 organization",
        "Up to 5 members",
        "Self-host or Workers",
        "Community support",
      ],
      cta: "Start free",
      href: `${DASHBOARD_URL}/signup`,
    },
    {
      name: "Pro",
      price: "$29",
      tagline: "For small teams.",
      features: [
        "Unlimited organizations",
        "Up to 25 members each",
        "Audit log retention",
        "Email support",
      ],
      cta: "Start trial",
      href: `${DASHBOARD_URL}/signup?plan=pro`,
      featured: true,
    },
    {
      name: "Team",
      price: "$99",
      tagline: "For growing companies.",
      features: [
        "SSO & SAML",
        "Unlimited members",
        "SOC2 reports",
        "Priority support",
      ],
      cta: "Talk to us",
      href: "mailto:hello@pylonsync.com",
    },
  ];

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple pricing
        </h2>
        <p className="mt-3 text-balance text-base text-muted-foreground">
          Start free. Pay only when you have customers.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((p) => (
          <Card
            key={p.name}
            className={
              p.featured
                ? "border-primary/40 p-6 ring-2 ring-primary/15"
                : "p-6"
            }
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-semibold">{p.name}</h3>
              {p.featured && <Badge>Popular</Badge>}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="font-mono text-4xl font-semibold tabular-nums">
                {p.price}
              </span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <ul className="mt-5 flex flex-col gap-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={p.featured ? "default" : "outline"}
              className="mt-6 w-full"
              asChild
            >
              <Link href={p.href}>{p.cta}</Link>
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Ship the boring stuff today.
      </h2>
      <p className="mt-3 text-balance text-base text-muted-foreground">
        Clone, install, run. Auth, multi-tenant, billing, audit log — already
        wired.
      </p>
      <div className="mt-7 flex justify-center gap-3">
        <Button size="lg" asChild>
          <Link href={`${DASHBOARD_URL}/signup`}>
            Start free <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="https://github.com/pylonsync/pylon">View on GitHub</Link>
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t py-10 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <Logo />
          <span>Pylon B2B</span>
        </div>
        <div className="flex gap-5">
          <Link href={DOCS_URL}>Docs</Link>
          <Link href="https://github.com/pylonsync/pylon">GitHub</Link>
          <Link href="/changelog">Changelog</Link>
        </div>
        <span>© {new Date().getFullYear()} Pylon</span>
      </div>
    </footer>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 48 64" width="20" height="26" fill="currentColor" className="text-primary">
      <path d="M24 2 L10 20 L24 32 Z" />
      <path d="M24 2 L38 20 L24 32 Z" />
      <path d="M24 32 L18 48 L24 62 L30 48 Z" />
      <path d="M6 30 Q3 46 16 56 L18 50 Q10 44 11 32 Z" />
      <path d="M42 30 Q45 46 32 56 L30 50 Q38 44 37 32 Z" />
    </svg>
  );
}
