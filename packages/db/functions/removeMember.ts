/**
 * Remove a member from an organization. Owners can remove anyone
 * except themselves (the workspace must always have an owner). Admins
 * can remove members but not other admins or the owner.
 */
import { mutation, v } from "@pylonsync/functions";

export default mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  async handler(ctx, args) {
    if (!ctx.auth.userId) throw ctx.error("UNAUTHENTICATED", "log in first");

    const memberships = (await ctx.db.query("OrgMember")) as Array<{
      id: string;
      userId: string;
      orgId: string;
      role: string;
    }>;
    const me = memberships.find(
      (m) => m.userId === ctx.auth.userId && m.orgId === args.orgId,
    );
    const target = memberships.find(
      (m) => m.userId === args.userId && m.orgId === args.orgId,
    );
    if (!me) throw ctx.error("FORBIDDEN", "you're not in this org");
    if (!target) throw ctx.error("NOT_MEMBER", "user isn't in this org");

    if (target.userId === ctx.auth.userId && target.role === "owner") {
      throw ctx.error(
        "OWNER_CANNOT_LEAVE",
        "the owner can't remove themselves; transfer ownership first",
      );
    }
    const meRank = rank(me.role);
    const targetRank = rank(target.role);
    if (meRank <= targetRank) {
      throw ctx.error(
        "INSUFFICIENT_ROLE",
        "you can't remove a member with equal or higher role",
      );
    }

    await ctx.db.delete("OrgMember", target.id);
    await ctx.db.insert("AuditEvent", {
      orgId: args.orgId,
      actorId: ctx.auth.userId,
      kind: "member_removed",
      metaJson: JSON.stringify({ removedUserId: args.userId, role: target.role }),
      createdAt: new Date().toISOString(),
    });

    return { removed: true };
  },
});

function rank(role: string): number {
  return role === "owner" ? 3 : role === "admin" ? 2 : role === "member" ? 1 : 0;
}
