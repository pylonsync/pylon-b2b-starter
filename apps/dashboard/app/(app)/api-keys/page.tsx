import { Copy, Key, Plus, Trash2 } from "lucide-react";
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

const SAMPLE = [
  {
    id: "1",
    name: "CI deploy",
    prefix: "pyl_live_a1b2c3",
    lastUsedAt: "2 hours ago",
    createdAt: "Jan 14, 2026",
  },
  {
    id: "2",
    name: "Local dev",
    prefix: "pyl_test_d4e5f6",
    lastUsedAt: "Yesterday",
    createdAt: "Jan 10, 2026",
  },
];

export default function ApiKeysPage() {
  return (
    <main className="flex flex-col gap-6 p-6 md:p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            API keys
          </h1>
          <p className="text-sm text-muted-foreground">
            Programmatic access to your workspace.
          </p>
        </div>
        <Button>
          <Plus className="size-4" />
          New key
        </Button>
      </header>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Token</TableHead>
              <TableHead>Last used</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SAMPLE.map((k) => (
              <TableRow key={k.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Key className="size-4 text-muted-foreground" />
                    <span className="font-medium">{k.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                      {k.prefix}…
                    </code>
                    <Button variant="ghost" size="icon" className="size-7">
                      <Copy className="size-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {k.lastUsedAt}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {k.createdAt}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}
