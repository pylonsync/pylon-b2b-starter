/**
 * Mint a new API key for an organization.
 *
 * Returns the full token exactly once; only a bcrypt-equivalent hash
 * + a 16-char prefix is stored. Validate incoming requests by looking
 * up by prefix and comparing the hash.
 */
import { mutation, v } from "@pylonsync/functions";

function token(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Lightweight digest — for the demo. A real app would import bcrypt
// from a server-only path. Pylon's TS runtime exposes the SubtleCrypto
// API, so we use SHA-256 with a per-record salt. The salt + hash are
// stored together; see `hash` field shape.
async function hashKey(key: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const data = new TextEncoder().encode(key);
  const combined = new Uint8Array(salt.length + data.length);
  combined.set(salt);
  combined.set(data, salt.length);
  const buf = await crypto.subtle.digest("SHA-256", combined);
  const hash = Array.from(new Uint8Array(buf), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  const saltHex = Array.from(salt, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  return `${saltHex}:${hash}`;
}

export default mutation({
  args: {
    orgId: v.string(),
    name: v.string(),
  },
  async handler(ctx, args) {
    if (!ctx.auth.userId) throw ctx.error("UNAUTHENTICATED", "log in first");

    const memberships = (await ctx.db.query("OrgMember")) as Array<{
      userId: string;
      orgId: string;
      role: string;
    }>;
    const me = memberships.find(
      (m) => m.userId === ctx.auth.userId && m.orgId === args.orgId,
    );
    if (!me || !["owner", "admin"].includes(me.role)) {
      throw ctx.error("FORBIDDEN", "only owners/admins can manage API keys");
    }

    const isProd = (process.env.NODE_ENV ?? "production") === "production";
    const prefix = `pyl_${isProd ? "live" : "test"}_${token().slice(0, 8)}`;
    const fullKey = `${prefix}_${token()}`;
    const hash = await hashKey(fullKey);

    const id = await ctx.db.insert("ApiKey", {
      orgId: args.orgId,
      name: args.name,
      prefix,
      hash,
      createdBy: ctx.auth.userId,
      createdAt: new Date().toISOString(),
    });

    await ctx.db.insert("AuditEvent", {
      orgId: args.orgId,
      actorId: ctx.auth.userId,
      kind: "api_key_created",
      metaJson: JSON.stringify({ name: args.name, prefix }),
      createdAt: new Date().toISOString(),
    });

    return { id, prefix, fullKey };
  },
});
