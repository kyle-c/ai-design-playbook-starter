import * as React from "react";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SubSection } from "../lib/section";

export function FeedbackSection() {
  return (
    <div className="space-y-10">
      <SubSection title="Badges">
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-subtle bg-surface-raised p-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Critical</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </SubSection>

      <SubSection title="Alerts">
        <div className="grid gap-3">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
              This is an informational message. You can dismiss it from
              settings.
            </AlertDescription>
          </Alert>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something needs attention</AlertTitle>
            <AlertDescription>
              Connection lost. Check your network and try again.
            </AlertDescription>
          </Alert>
        </div>
      </SubSection>

      <SubSection title="Skeleton" hint="Loading placeholder">
        <div className="rounded-md border border-subtle bg-surface-raised p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </SubSection>
    </div>
  );
}
