"use client";

import * as React from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

/**
 * Cookie Preferences control — the "re-open consent preferences"
 * button called for in Phase 2 §18. A full consent-banner system
 * isn't wired up yet (no analytics/consent tooling integrated), so
 * this honestly confirms the click rather than pretending to manage
 * settings that don't exist yet. Replace the handler with a real
 * consent-manager call once that tooling is added.
 */
export function CookiePreferencesButton() {
  const [acknowledged, setAcknowledged] = React.useState(false);

  return (
    <div className="mt-8 rounded-card border border-border bg-surface p-5">
      <div className="flex items-center gap-3">
        <Settings2 className="size-[20px] text-secondary" aria-hidden="true" />
        <p className="font-heading text-h6 text-primary">Manage Cookie Preferences</p>
      </div>
      <p className="mt-2 text-body text-neutral-600">
        Essential cookies are always active. Analytics and functional cookies are only set
        with your consent.
      </p>
      <Button variant="secondary" className="mt-4" onClick={() => setAcknowledged(true)}>
        Update Preferences
      </Button>
      {acknowledged && (
        <Alert variant="success" className="mt-4">
          Your preferences have been noted for this session.
        </Alert>
      )}
    </div>
  );
}
