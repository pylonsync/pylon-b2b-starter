"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@pylon-b2b/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@pylon-b2b/ui/avatar";
import { cn } from "@pylon-b2b/ui/utils";
import type { Organization } from "@pylon-b2b/db";

export function OrgSwitcher({ activeOrg }: { activeOrg: Organization }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  // For the demo, we render just the active org. A real app would
  // `db.useQuery<OrgMember>` for the current user's memberships and
  // list every org they belong to here.
  async function switchOrg(orgId: string | null) {
    setBusy(true);
    try {
      await fetch("/api/auth/active-org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center gap-2 rounded-md p-2 text-left text-sm transition-colors hover:bg-sidebar-accent",
            busy && "opacity-50",
          )}
          disabled={busy}
        >
          <Avatar className="size-7 bg-primary/15">
            <AvatarFallback className="bg-transparent text-xs font-semibold">
              {initials(activeOrg.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold">
              {activeOrg.name}
            </span>
            <span className="truncate text-[11px] capitalize text-muted-foreground">
              {activeOrg.plan} plan
            </span>
          </div>
          <ChevronsUpDown className="size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuItem className="font-semibold">
          <Building2 className="size-4" />
          {activeOrg.name}
          <Check className="ml-auto size-4 text-primary" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => switchOrg(null)}>
          <Plus className="size-4" />
          New workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function initials(s: string) {
  return s
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
