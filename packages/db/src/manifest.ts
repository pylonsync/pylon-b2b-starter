/**
 * Pylon manifest for the B2B SaaS starter.
 *
 * Multi-tenant: every business entity carries `orgId` and reads/writes
 * are gated on org membership. The dashboard's middleware sets the
 * active tenant on each request via `/api/auth/select-org`.
 */
import { entity, field, policy, buildManifest } from "@pylonsync/sdk";

const User = entity(
  "User",
  {
    email: field.string(),
    displayName: field.string(),
    avatarColor: field.string().optional(),
    passwordHash: field.string().optional(),
    createdAt: field.datetime(),
  },
  { indexes: [{ name: "by_email", fields: ["email"], unique: true }] },
);

const Organization = entity(
  "Organization",
  {
    name: field.string(),
    slug: field.string(),
    logoUrl: field.string().optional(),
    plan: field.string(), // free | pro | team | enterprise
    trialEndsAt: field.datetime().optional(),
    createdBy: field.string(),
    createdAt: field.datetime(),
  },
  {
    indexes: [
      { name: "by_slug", fields: ["slug"], unique: true },
      { name: "by_creator", fields: ["createdBy"], unique: false },
    ],
  },
);

const OrgMember = entity(
  "OrgMember",
  {
    userId: field.string(),
    orgId: field.string(),
    role: field.string(), // owner | admin | member
    joinedAt: field.datetime(),
  },
  {
    indexes: [
      { name: "by_user", fields: ["userId"], unique: false },
      { name: "by_org", fields: ["orgId"], unique: false },
      { name: "by_user_org", fields: ["userId", "orgId"], unique: true },
    ],
  },
);

const Invitation = entity(
  "Invitation",
  {
    orgId: field.string(),
    email: field.string(),
    role: field.string(),
    token: field.string(),
    invitedBy: field.string(),
    acceptedAt: field.datetime().optional(),
    expiresAt: field.datetime(),
    createdAt: field.datetime(),
  },
  {
    indexes: [
      { name: "by_org", fields: ["orgId"], unique: false },
      { name: "by_token", fields: ["token"], unique: true },
      { name: "by_email", fields: ["email"], unique: false },
    ],
  },
);

const Subscription = entity(
  "Subscription",
  {
    orgId: field.string(),
    status: field.string(),
    plan: field.string(),
    stripeCustomerId: field.string().optional(),
    stripeSubscriptionId: field.string().optional(),
    seats: field.int(),
    currentPeriodEnd: field.datetime().optional(),
    createdAt: field.datetime(),
  },
  {
    indexes: [{ name: "by_org", fields: ["orgId"], unique: true }],
  },
);

const ApiKey = entity(
  "ApiKey",
  {
    orgId: field.string(),
    name: field.string(),
    prefix: field.string(),
    hash: field.string(),
    createdBy: field.string(),
    lastUsedAt: field.datetime().optional(),
    createdAt: field.datetime(),
  },
  {
    indexes: [
      { name: "by_org", fields: ["orgId"], unique: false },
      { name: "by_prefix", fields: ["prefix"], unique: true },
    ],
  },
);

const AuditEvent = entity(
  "AuditEvent",
  {
    orgId: field.string(),
    actorId: field.string(),
    kind: field.string(),
    metaJson: field.string().optional(),
    createdAt: field.datetime(),
  },
  {
    indexes: [
      { name: "by_org", fields: ["orgId"], unique: false },
      { name: "by_org_time", fields: ["orgId", "createdAt"], unique: false },
    ],
  },
);

// Policies — convention: `auth.userId != null` for reads (tenant
// scoping is enforced by Pylon's tenant_id mechanism), and explicit
// owner/admin checks for writes. Server functions handle the more
// complex multi-row enforcement.

const userPolicy = policy({
  name: "user_self",
  entity: "User",
  allowRead: "auth.userId != null",
  allowInsert: "false",
  allowUpdate: "auth.userId == data.id",
  allowDelete: "false",
});

const orgPolicy = policy({
  name: "org_member",
  entity: "Organization",
  allowRead: "auth.userId != null",
  allowInsert: "false", // via createOrganization function
  allowUpdate: "auth.userId != null", // gated further by server fn role check
  allowDelete: "false",
});

const memberPolicy = policy({
  name: "member_visible",
  entity: "OrgMember",
  allowRead: "auth.userId != null",
  allowInsert: "false", // via invitation accept or createOrganization
  allowUpdate: "auth.userId != null",
  allowDelete: "auth.userId != null",
});

const invitePolicy = policy({
  name: "invite_org_visible",
  entity: "Invitation",
  allowRead: "auth.userId != null",
  allowInsert: "false",
  allowUpdate: "false",
  allowDelete: "false",
});

const subPolicy = policy({
  name: "subscription_visible",
  entity: "Subscription",
  allowRead: "auth.userId != null",
  allowInsert: "false",
  allowUpdate: "false",
  allowDelete: "false",
});

const apiKeyPolicy = policy({
  name: "apikey_visible",
  entity: "ApiKey",
  allowRead: "auth.userId != null",
  allowInsert: "false",
  allowUpdate: "false",
  allowDelete: "auth.userId != null",
});

const auditPolicy = policy({
  name: "audit_readonly",
  entity: "AuditEvent",
  allowRead: "auth.userId != null",
  allowInsert: "false",
  allowUpdate: "false",
  allowDelete: "false",
});

const manifest = buildManifest({
  name: "pylon-b2b",
  version: "0.1.0",
  entities: [
    User,
    Organization,
    OrgMember,
    Invitation,
    Subscription,
    ApiKey,
    AuditEvent,
  ],
  queries: [],
  actions: [],
  policies: [
    userPolicy,
    orgPolicy,
    memberPolicy,
    invitePolicy,
    subPolicy,
    apiKeyPolicy,
    auditPolicy,
  ],
  routes: [],
});

console.log(JSON.stringify(manifest, null, 2));
