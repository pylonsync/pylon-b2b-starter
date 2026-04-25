import Link from "next/link";

export function AuthShell({
  title,
  sub,
  children,
  footer,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2 font-semibold">
            <Logo />
            <span>Pylon B2B</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
          <div className="mt-6">{children}</div>
          {footer && (
            <div className="mt-6 text-center text-xs text-muted-foreground">
              {footer}
            </div>
          )}
        </div>
      </div>
      <div className="hidden bg-gradient-to-br from-primary/30 via-primary/10 to-background lg:flex lg:items-center lg:p-12">
        <div className="max-w-md">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            Multi-tenant
            <br />
            from line one.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Live queries, organizations, invitations, billing — all wired up.
            Start shipping product instead of scaffolding.
          </p>
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <svg
      viewBox="0 0 48 64"
      width="20"
      height="26"
      fill="currentColor"
      className="text-primary"
    >
      <path d="M24 2 L10 20 L24 32 Z" />
      <path d="M24 2 L38 20 L24 32 Z" />
      <path d="M24 32 L18 48 L24 62 L30 48 Z" />
      <path d="M6 30 Q3 46 16 56 L18 50 Q10 44 11 32 Z" />
      <path d="M42 30 Q45 46 32 56 L30 50 Q38 44 37 32 Z" />
    </svg>
  );
}
