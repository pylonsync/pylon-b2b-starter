# Deploying

Three Vercel projects + one Fly app.

## 1. Pylon backend (Fly)

```bash
cd packages/db
bun run generate-manifest > pylon.manifest.json
fly launch --no-deploy --copy-config        # uses fly.toml
fly volumes create pylon_data --size 10
fly deploy
```

Note the URL printed (e.g. `https://pylon-b2b-backend.fly.dev`). You'll wire it into the dashboard env in step 3.

## 2. Marketing + Docs (Vercel, static-friendly)

```bash
cd apps/marketing
vercel --prod                                # creates the project on first run

cd ../docs
# Mintlify auto-deploys on push to main once the repo is connected at
# https://dashboard.mintlify.com — connect the repo and pick `apps/docs`
# as the root.
```

## 3. Dashboard (Vercel)

```bash
cd apps/dashboard
vercel --prod
# Set environment variables in the Vercel dashboard:
#   PYLON_BASE_URL              = https://pylon-b2b-backend.fly.dev
#   NEXT_PUBLIC_PYLON_URL       = https://pylon-b2b-backend.fly.dev
#   STRIPE_SECRET_KEY           = sk_live_...
#   STRIPE_WEBHOOK_SECRET       = whsec_...
#   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
vercel --prod                                # redeploy after setting envs
```

## 4. Stripe webhook (after the dashboard is live)

In the Stripe dashboard → Developers → Webhooks:

```
Endpoint: https://<dashboard-url>/api/stripe/webhook
Events:   customer.subscription.created
          customer.subscription.updated
          customer.subscription.deleted
          invoice.payment_failed
```

Paste the Signing Secret into `STRIPE_WEBHOOK_SECRET` and redeploy.

## CI

The repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml` (commented out by default) that re-runs the steps above on push to `main`. Wire `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_*`, and `FLY_API_TOKEN` as repository secrets to enable it.
