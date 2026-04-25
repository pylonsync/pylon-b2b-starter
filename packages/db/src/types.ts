/**
 * TypeScript shapes for every entity in the manifest. Used by all
 * three apps so we don't pass anonymous objects around.
 */
export type User = {
  id: string;
  email: string;
  displayName: string;
  avatarColor?: string | null;
  passwordHash?: string | null;
  createdAt: string;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  plan: "free" | "pro" | "team" | "enterprise";
  trialEndsAt?: string | null;
  createdBy: string;
  createdAt: string;
};

export type OrgMember = {
  id: string;
  userId: string;
  orgId: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
};

export type Invitation = {
  id: string;
  orgId: string;
  email: string;
  role: "admin" | "member";
  token: string;
  invitedBy: string;
  acceptedAt?: string | null;
  expiresAt: string;
  createdAt: string;
};

export type Subscription = {
  id: string;
  orgId: string;
  status: "trialing" | "active" | "past_due" | "canceled";
  plan: "free" | "pro" | "team" | "enterprise";
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  seats: number;
  currentPeriodEnd?: string | null;
  createdAt: string;
};

export type ApiKey = {
  id: string;
  orgId: string;
  name: string;
  prefix: string;
  hash: string;
  createdBy: string;
  lastUsedAt?: string | null;
  createdAt: string;
};

export type AuditEvent = {
  id: string;
  orgId: string;
  actorId: string;
  kind: string;
  metaJson?: string | null;
  createdAt: string;
};
