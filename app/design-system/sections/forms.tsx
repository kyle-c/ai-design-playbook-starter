"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SubSection } from "../lib/section";

/**
 * Forms section. Inputs are shown across all states (default, focus,
 * filled, error, disabled) so a designer can compare them in one
 * glance instead of clicking through. Focus state is faked with the
 * same ring class the primitive applies on `:focus-visible`.
 */
export function FormsSection() {
  return (
    <div className="space-y-10">
      <SubSection title="Input states">
        <div className="grid gap-4 md:grid-cols-2">
          <FieldExample label="Default" htmlFor="ds-default">
            <Input id="ds-default" placeholder="you@example.com" />
          </FieldExample>

          <FieldExample label="Focused" htmlFor="ds-focused">
            <Input
              id="ds-focused"
              placeholder="you@example.com"
              className="ring-2 ring-action-primary ring-offset-2"
            />
          </FieldExample>

          <FieldExample label="Filled" htmlFor="ds-filled">
            <Input id="ds-filled" defaultValue="kyle@example.com" />
          </FieldExample>

          <FieldExample
            label="Error"
            htmlFor="ds-error"
            error="That doesn't look like an email address."
          >
            <Input
              id="ds-error"
              defaultValue="kyle@@example.com"
              aria-invalid
              className="border-action-danger focus-visible:ring-action-danger"
            />
          </FieldExample>

          <FieldExample label="Disabled" htmlFor="ds-disabled">
            <Input id="ds-disabled" disabled defaultValue="locked@account.com" />
          </FieldExample>

          <FieldExample
            label="Helper"
            htmlFor="ds-helper"
            help="We'll only use this to send a sign-in code."
          >
            <Input id="ds-helper" placeholder="you@example.com" />
          </FieldExample>
        </div>
      </SubSection>

      <SubSection title="Other controls">
        <div className="grid max-w-md gap-6 rounded-md border border-subtle bg-surface-raised p-6">
          <FieldExample label="Short bio" htmlFor="ds-bio">
            <Textarea
              id="ds-bio"
              rows={3}
              placeholder="Tell us a little about yourself."
            />
          </FieldExample>

          <FieldExample label="Timezone" htmlFor="ds-tz">
            <Select>
              <SelectTrigger id="ds-tz">
                <SelectValue placeholder="Pick a timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Pacific (PT)</SelectItem>
                <SelectItem value="mt">Mountain (MT)</SelectItem>
                <SelectItem value="ct">Central (CT)</SelectItem>
                <SelectItem value="et">Eastern (ET)</SelectItem>
              </SelectContent>
            </Select>
          </FieldExample>

          <div className="flex items-start gap-3">
            <Checkbox id="ds-terms" />
            <Label htmlFor="ds-terms" className="font-normal leading-snug">
              I agree to the terms and the privacy policy.
            </Label>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="ds-notif" className="font-normal">
              Email notifications
            </Label>
            <Switch id="ds-notif" defaultChecked />
          </div>
        </div>
      </SubSection>
    </div>
  );
}

function FieldExample({
  label,
  htmlFor,
  error,
  help,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 rounded-md border border-subtle bg-surface-raised p-4">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-small text-feedback-danger-fg">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </p>
      )}
      {help && !error && (
        <p className="text-small text-text-tertiary">{help}</p>
      )}
    </div>
  );
}
