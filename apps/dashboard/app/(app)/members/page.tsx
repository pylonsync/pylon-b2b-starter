import { Plus } from "lucide-react";
import { Button } from "@pylon-b2b/ui/button";
import { Card } from "@pylon-b2b/ui/card";
import { Badge } from "@pylon-b2b/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@pylon-b2b/ui/table";
import { Avatar, AvatarFallback } from "@pylon-b2b/ui/avatar";
import { getSession } from "@pylon-b2b/auth/server";

export default async function MembersPage() {
  const session = await getSession();
  // Real implementation would fetch OrgMember rows server-side; for
  // the demo we render the current user as the only member.
  const me = session?.user;
  return (
    <main className="flex flex-col gap-6 p-6 md:p-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Members
          </h1>
          <p className="text-sm text-muted-foreground">
            Who has access to this workspace.
          </p>
        </div>
        <Button>
          <Plus className="size-4" />
          Invite teammate
        </Button>
      </header>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {me && (
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      className="size-8"
                      style={{
                        backgroundColor:
                          me.avatarColor ?? "var(--color-primary)",
                      }}
                    >
                      <AvatarFallback className="bg-transparent text-[11px] text-white">
                        {me.displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {me.displayName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {me.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge>Owner</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(me.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="success">Active</Badge>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}
