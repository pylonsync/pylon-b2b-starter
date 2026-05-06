/**
 * Invite an email address to an organization.
 *
 * Caller must be an owner or admin of the target org. Mints a random
 * 32-char token; the invitee accepts at /accept-invite?token=...
 *
 * In a production app this would also send an email — wire your
 * provider in `apps/dashboard/.env` and uncomment the send below.
 */
import { mutation, v } from "@pylonsync/functions";

const INVITE_TTL_DAYS = 7;
const VALID_ROLES = ["admin", "member"] as const;

function token(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export default mutation({
  args: {
    orgId: v.string(),
    email: v.string(),
    role: v.optional(v.string()),
  },
  async handler(ctx, args) {
    if (!ctx.auth.userId) throw ctx.error("UNAUTHENTICATED", "log in first");

    const role = args.role ?? "member";
    if (!VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
      throw ctx.error("BAD_ROLE", "role must be admin or member");
    }

    // Authorization: caller must be owner/admin of the target org.
    const memberships = (await ctx.db.query("OrgMember")) as Array<{
      userId: string;
      orgId: string;
      role: string;
    }>;
    const me = memberships.find(
      (m) => m.userId === ctx.auth.userId && m.orgId === args.orgId,
    );
    if (!me || !["owner", "admin"].includes(me.role)) {
      throw ctx.error("FORBIDDEN", "only org owners/admins can invite");
    }

    const email = args.email.trim().toLowerCase();
    if (!email.includes("@")) throw ctx.error("BAD_EMAIL", "invalid email");

    // Refuse to re-invite an existing member.
    const usersWithEmail = (await ctx.db.query("User")) as Array<{
      id: string;
      email: string;
    }>;
    const existingUser = usersWithEmail.find((u) => u.email === email);
    if (existingUser) {
      const alreadyIn = memberships.some(
        (m) => m.userId === existingUser.id && m.orgId === args.orgId,
      );
      if (alreadyIn) {
        throw ctx.error("ALREADY_MEMBER", `${email} is already in this workspace`);
      }
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);
    const inviteToken = token();

    const invitationId = await ctx.db.insert("Invitation", {
      orgId: args.orgId,
      email,
      role,
      token: inviteToken,
      invitedBy: ctx.auth.userId,
      expiresAt: expiresAt.toISOString(),
      createdAt: now.toISOString(),
    });

    await ctx.db.insert("AuditEvent", {
      orgId: args.orgId,
      actorId: ctx.auth.userId,
      kind: "member_invited",
      metaJson: JSON.stringify({ email, role }),
      createdAt: now.toISOString(),
    });

    // TODO: send the invitation email. Sketch:
    //
    //   await sendEmail({
    //     to: email,
    //     subject: "You've been invited",
    //     body: `Click to join: ${BASE_URL}/accept-invite?token=${inviteToken}`,
    //   });

    return { invitationId, token: inviteToken };
  },
});
