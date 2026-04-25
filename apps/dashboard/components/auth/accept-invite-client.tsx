"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@pylon-b2b/ui/button";
import { Card, CardContent } from "@pylon-b2b/ui/card";
import { AuthShell } from "./auth-shell";

const PYLON_URL =
  process.env.NEXT_PUBLIC_PYLON_URL ?? "http://localhost:4321";

export function AcceptInviteClient() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [status, setStatus] = useState<
    "loading" | "needs-auth" | "accepting" | "done" | "error"
  >("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("No invitation token in the URL.");
      return;
    }

    // If we're not signed in yet, stash the token and bounce to signup.
    // The signup form picks it back up after the session is created.
    const session = document.cookie
      .split("; ")
      .find((c) => c.startsWith("pylon-session="));
    if (!session) {
      sessionStorage.setItem("pending-invite", token);
      setStatus("needs-auth");
      return;
    }

    setStatus("accepting");
    accept(token).then((res) => {
      if (res.ok) {
        setStatus("done");
        // Set the active org and route into the dashboard.
        fetch("/api/auth/active-org", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orgId: res.orgId }),
        })
          .catch(() => {})
          .finally(() => {
            setTimeout(() => router.push("/"), 800);
          });
      } else {
        setStatus("error");
        setError(res.error);
      }
    });
  }, [token, router]);

  if (status === "needs-auth") {
    return (
      <AuthShell title="One step away" sub="Sign in or create an account to accept your invitation.">
        <div className="flex flex-col gap-2">
          <Button onClick={() => router.push("/signup")}>Create account</Button>
          <Button variant="outline" onClick={() => router.push("/login")}>
            Log in
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          {status === "loading" || status === "accepting" ? (
            <>
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
              <h1 className="text-lg font-semibold">Accepting invitation…</h1>
            </>
          ) : status === "done" ? (
            <>
              <CheckCircle2 className="size-9 text-emerald-500" />
              <h1 className="text-lg font-semibold">You&rsquo;re in.</h1>
              <p className="text-sm text-muted-foreground">
                Heading to the dashboard…
              </p>
            </>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-destructive">
                Invitation problem
              </h1>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={() => router.push("/")}>
                Back to dashboard
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

async function accept(
  token: string,
): Promise<{ ok: true; orgId: string } | { ok: false; error: string }> {
  try {
    const res = await fetch(`${PYLON_URL}/api/fn/acceptInvitation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token }),
    });
    const body = await res.json();
    if (!res.ok) return { ok: false, error: body.error?.message ?? "Failed to accept" };
    return { ok: true, orgId: body.orgId };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
