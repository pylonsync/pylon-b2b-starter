/**
 * Accept an invitation. Looks up the Invitation by token, validates,
 * creates the OrgMember row, marks the invitation accepted.
 *
 * Caller must be authenticated. The dashboard's `/accept-invite` page
 * stashes the token in sessionStorage if the user isn't logged in,
 * sends them through signup, then comes back here.
 */
import { mutation, v } from "@pylonsync/functions";

export default mutation({
  args: {
    token: v.string(),
  },
  async handler(ctx, args) {
    if (!ctx.auth.userId) throw ctx.error("UNAUTHENTICATED", "log in first");

    const invitation = (await ctx.db
      .lookup("Invitation", "token", args.token)
      .catch(() => null)) as
      | {
          id: string;
          orgId: string;
          email: string;
          role: string;
          acceptedAt?: string | null;
          expiresAt: string;
          invitedBy: string;
        }
      | null;
    if (!invitation) throw ctx.error("INVITATION_NOT_FOUND", "invalid token");
    if (invitation.acceptedAt) {
      throw ctx.error("ALREADY_ACCEPTED", "this invitation has already been used");
    }
    if (new Date(invitation.expiresAt) < new Date()) {
      throw ctx.error("INVITATION_EXPIRED", "this invitation has expired");
    }

    // Don't double-add. If the caller is somehow already in the org
    // (e.g. accepted a different invitation), just mark this one
    // accepted and return success.
    const memberships = (await ctx.db.query("OrgMember")) as Array<{
      userId: string;
      orgId: string;
    }>;
    const alreadyIn = memberships.some(
      (m) => m.userId === ctx.auth.userId && m.orgId === invitation.orgId,
    );

    const now = new Date().toISOString();
    if (!alreadyIn) {
      await ctx.db.insert("OrgMember", {
        userId: ctx.auth.userId,
        orgId: invitation.orgId,
        role: invitation.role,
        joinedAt: now,
      });
    }
    await ctx.db.update("Invitation", invitation.id, { acceptedAt: now });

    await ctx.db.insert("AuditEvent", {
      orgId: invitation.orgId,
      actorId: ctx.auth.userId,
      kind: "member_joined",
      metaJson: JSON.stringify({ role: invitation.role, via: "invitation" }),
      createdAt: now,
    });

    return { orgId: invitation.orgId };
  },
});
