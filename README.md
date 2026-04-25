# Pylon B2B Starter

Production-ready B2B SaaS starter. Turborepo monorepo, Next.js 16, Tailwind 4, shadcn/ui, multi-tenant by default.

## What you get

- **`apps/marketing`** — Public marketing site. Hero, features, pricing, social proof, CTA. SEO-tuned with `metadata`, OG tags, `sitemap.xml`, `robots.txt`.
- **`apps/docs`** — Mintlify-style docs app. MDX, search, syntax highlighting.
- **`apps/dashboard`** — The product. Login, signup, organization onboarding (create org → invite teammates → pick plan), shadcn sidebar layout, settings, billing stub, members management.
- **`packages/ui`** — Shared shadcn primitives (button, card, dialog, sidebar, table, …) themed once, used everywhere.
- **`packages/auth`** — Email/password + invitation flows backed by Pylon. Cookie session handling for SSR.
- **`packages/db`** — Pylon manifest (User, Org, OrgMember, Invitation, Plan, Subscription) and policies.
- **`packages/config`** — Shared TypeScript + Tailwind config.

## Getting started

```bash
bun install
bun dev
```

Three apps will start on different ports:

- Marketing: http://localhost:3000
- Dashboard: http://localhost:3001
- Docs: http://localhost:3002

The dashboard expects a Pylon backend at `http://localhost:4321`. Bring up the Pylon manifest in `packages/db` with `pylon dev`.

## Architecture

Multi-tenant, organization-scoped. Every row in the dashboard is owned by an organization; users belong to one or more orgs and switch active org via `/api/auth/select-org`. The Pylon backend enforces tenant isolation in policies; the dashboard's middleware reads the session cookie and redirects unauthenticated users to `/login`.

Stripe billing wires through `packages/auth` (Subscription entity + webhook handler skeleton). Wire your Stripe keys in `apps/dashboard/.env.local`.

## Deploying

Each app deploys independently. Marketing + docs are static-friendly; dashboard needs Node runtime for SSR auth. The repo includes `vercel.json` configs for the common case — see `deploy/`.
