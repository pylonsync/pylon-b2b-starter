import { Save } from "lucide-react";
import { Button } from "@pylon-b2b/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@pylon-b2b/ui/card";
import { Input } from "@pylon-b2b/ui/input";
import { Label } from "@pylon-b2b/ui/label";
import { Separator } from "@pylon-b2b/ui/separator";
import { getSession } from "@pylon-b2b/auth/server";

export default async function SettingsPage() {
  const session = await getSession();
  const org = session?.activeOrg;
  if (!org) return null;
  return (
    <main className="flex flex-col gap-6 p-6 md:p-8">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Workspace settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Update your workspace details.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1.5">
            <Label>Workspace name</Label>
            <Input defaultValue={org.name} />
          </div>
          <div className="grid gap-1.5">
            <Label>URL slug</Label>
            <div className="flex">
              <span className="inline-flex h-9 items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                pylon.app/
              </span>
              <Input defaultValue={org.slug} className="rounded-l-none" />
            </div>
          </div>
          <Separator />
          <div className="flex justify-end">
            <Button>
              <Save className="size-4" />
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <p className="text-sm text-muted-foreground">
            Deleting your workspace removes all data permanently. This cannot
            be undone.
          </p>
          <Button variant="destructive" className="self-start">
            Delete workspace
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
