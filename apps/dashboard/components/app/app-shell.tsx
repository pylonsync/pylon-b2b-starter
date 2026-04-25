"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  Building2,
  CreditCard,
  Home,
  Key,
  LifeBuoy,
  Search,
  Settings,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@pylon-b2b/ui/sidebar";
import { Button } from "@pylon-b2b/ui/button";
import { Avatar, AvatarFallback } from "@pylon-b2b/ui/avatar";
import { Badge } from "@pylon-b2b/ui/badge";
import { useSession } from "@pylon-b2b/auth/client";
import { OrgSwitcher } from "./org-switcher";
import { UserMenu } from "./user-menu";

const NAV: { label: string; href: string; icon: React.ReactNode }[] = [
  { label: "Overview", href: "/", icon: <Home className="size-4" /> },
  { label: "Members", href: "/members", icon: <Users className="size-4" /> },
  { label: "Audit log", href: "/audit", icon: <Activity className="size-4" /> },
  { label: "API keys", href: "/api-keys", icon: <Key className="size-4" /> },
];

const SETTINGS_NAV: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "Workspace",
    href: "/settings",
    icon: <Building2 className="size-4" />,
  },
  {
    label: "Billing",
    href: "/billing",
    icon: <CreditCard className="size-4" />,
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, activeOrg } = useSession();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <OrgSwitcher activeOrg={activeOrg!} />
        </SidebarHeader>
        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Search className="size-4" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Search
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(pathname, item.href)}
                    >
                      <Link href={item.href}>
                        {item.icon}
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {SETTINGS_NAV.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(pathname, item.href)}
                    >
                      <Link href={item.href}>
                        {item.icon}
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href="https://docs.pylonsync.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <LifeBuoy className="size-4" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Help &amp; docs
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur md:px-6">
          <SidebarTrigger />
          <Breadcrumb pathname={pathname} />
          <div className="flex-1" />
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
          <UserMenu user={user} />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return <span className="text-sm font-medium">Overview</span>;
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <Link href="/" className="text-muted-foreground hover:text-foreground">
        Home
      </Link>
      {segments.map((s, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="text-muted-foreground">/</span>
          <span
            className={
              i === segments.length - 1
                ? "font-medium capitalize"
                : "capitalize text-muted-foreground"
            }
          >
            {s}
          </span>
        </span>
      ))}
    </nav>
  );
}
