/**
 * Create a new Organization with the caller as the owner. Atomic:
 * if the OrgMember insert fails the Organization rollback covers it.
 *
 * Args: { name, slug }
 * Returns: { orgId }
 */
import { mutation, v } from "@pylonsync/functions";

const TRIAL_DAYS = 14;

export default mutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  async handler(ctx, args) {
    if (!ctx.auth.userId) throw ctx.error("UNAUTHENTICATED", "log in first");

    const name = args.name.trim();
    const slug = args.slug.trim().toLowerCase();
    if (name.length < 2) throw ctx.error("BAD_NAME", "name is too short");
    if (!/^[a-z0-9-]{2,50}$/.test(slug)) {
      throw ctx.error("BAD_SLUG", "slug must be 2-50 lowercase letters/digits/hyphens");
    }

    // Slug must be globally unique. Convention: row insert below will
    // hit a UNIQUE constraint on the by_slug index if it collides.
    const existing = await ctx.db.lookup("Organization", "slug", slug).catch(() => null);
    if (existing) throw ctx.error("SLUG_TAKEN", `workspace "${slug}" is taken`);

    const now = new Date().toISOString();
    const trialEnd = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const orgId = await ctx.db.insert("Organization", {
      name,
      slug,
      plan: "free",
      trialEndsAt: trialEnd,
      createdBy: ctx.auth.userId,
      createdAt: now,
    });

    // Caller is the owner.
    await ctx.db.insert("OrgMember", {
      userId: ctx.auth.userId,
      orgId,
      role: "owner",
      joinedAt: now,
    });

    // Stub Subscription row so the billing UI has something to render.
    await ctx.db.insert("Subscription", {
      orgId,
      status: "trialing",
      plan: "free",
      seats: 1,
      currentPeriodEnd: trialEnd,
      createdAt: now,
    });

    // Audit trail.
    await ctx.db.insert("AuditEvent", {
      orgId,
      actorId: ctx.auth.userId,
      kind: "workspace_created",
      metaJson: JSON.stringify({ name, slug }),
      createdAt: now,
    });

    return { orgId };
  },
});
