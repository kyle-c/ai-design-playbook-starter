import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function DisplaySection() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Connect your account</CardTitle>
          <CardDescription>One step before you can start.</CardDescription>
        </CardHeader>
        <CardContent>
          We&rsquo;ll only read what you choose. Disconnect any time.
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 rounded-md border border-subtle bg-surface-raised p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" alt="Kyle Cooney" />
            <AvatarFallback>KC</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-body font-medium">Kyle Cooney</p>
            <p className="text-small text-text-secondary">kyle@example.com</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-body font-medium">Avery Bell</p>
            <p className="text-small text-text-secondary">avery@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
