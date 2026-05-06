/**
 * Set the active plan for an organization.
 *
 * For paid plans, a real implementation would create a Stripe Checkout
 * session here and only flip the plan in the webhook handler. For the
 * starter we mark the Subscription `trialing` (free) or `active`
 * (pro/team/enterprise) immediately so onboarding can complete.
 */
import { mutation, v } from "@pylonsync/functions";

const VALID_PLANS = ["free", "pro", "team", "enterprise"] as const;

export default mutation({
  args: {
    orgId: v.string(),
    plan: v.string(),
  },
  async handler(ctx, args) {
    if (!ctx.auth.userId) throw ctx.error("UNAUTHENTICATED", "log in first");
    if (!VALID_PLANS.includes(args.plan as (typeof VALID_PLANS)[number])) {
      throw ctx.error("BAD_PLAN", "plan must be free, pro, team, or enterprise");
    }

    // Authorization: caller must be owner or admin.
    const memberships = (await ctx.db.query("OrgMember")) as Array<{
      userId: string;
      orgId: string;
      role: string;
    }>;
    const me = memberships.find(
      (m) => m.userId === ctx.auth.userId && m.orgId === args.orgId,
    );
    if (!me || !["owner", "admin"].includes(me.role)) {
      throw ctx.error("FORBIDDEN", "only org owners/admins can change plan");
    }

    const previous = (await ctx.db.get("Organization", args.orgId)) as
      | { plan: string }
      | null;
    if (!previous) throw ctx.error("ORG_NOT_FOUND", "");

    await ctx.db.update("Organization", args.orgId, { plan: args.plan });

    // Update or create the Subscription row.
    const subs = (await ctx.db.query("Subscription")) as Array<{
      id: string;
      orgId: string;
    }>;
    const existing = subs.find((s) => s.orgId === args.orgId);
    const now = new Date().toISOString();
    if (existing) {
      await ctx.db.update("Subscription", existing.id, {
        plan: args.plan,
        status: args.plan === "free" ? "trialing" : "active",
      });
    } else {
      await ctx.db.insert("Subscription", {
        orgId: args.orgId,
        status: args.plan === "free" ? "trialing" : "active",
        plan: args.plan,
        seats: 1,
        createdAt: now,
      });
    }

    await ctx.db.insert("AuditEvent", {
      orgId: args.orgId,
      actorId: ctx.auth.userId,
      kind: "plan_changed",
      metaJson: JSON.stringify({ from: previous.plan, to: args.plan }),
      createdAt: now,
    });

    return { plan: args.plan };
  },
});
