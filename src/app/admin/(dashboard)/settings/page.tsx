"use client";

import * as React from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert } from "@/components/ui/alert";
import { siteConfig, contactConfig } from "@/config/site";
import { can } from "@/lib/permissions";
import { useSession } from "next-auth/react";

export default function SiteSettingsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "editor";

  const [savedNotice, setSavedNotice] = React.useState(false);
  const [liveChatEnabled, setLiveChatEnabled] = React.useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = React.useState(false);
  const [cookieBannerEnabled, setCookieBannerEnabled] = React.useState(true);

  const canEdit = can(role, "settings", "edit");

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  }

  if (!canEdit) {
    return (
      <>
        <AdminPageHeader title="Site Settings" description="Sitewide configuration." />
        <Alert variant="warning" title="View only">
          Your role ({role}) can view Site Settings but not change them. Contact
          an Owner or Admin to make changes.
        </Alert>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader title="Site Settings" description="Sitewide configuration not tied to a specific content type." />

      {savedNotice && (
        <Alert variant="success" title="Saved" className="mb-4">
          Settings are held locally until the backend is connected in a later phase.
        </Alert>
      )}

      <form onSubmit={handleSave}>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hours">Business Hours</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Consent</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid max-w-xl gap-4">
              <div className="grid gap-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" defaultValue={siteConfig.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="site-domain">Domain</Label>
                <Input id="site-domain" defaultValue={siteConfig.domain} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="site-email">Contact Email</Label>
                <Input id="site-email" type="email" defaultValue={contactConfig.email} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="site-phone">Contact Phone</Label>
                <Input id="site-phone" type="tel" defaultValue={contactConfig.phone} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="site-whatsapp">WhatsApp Business Number</Label>
                <Input id="site-whatsapp" defaultValue={contactConfig.whatsapp} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hours">
            <div className="flex max-w-xl flex-col gap-3">
              {contactConfig.businessHours.map((row) => (
                <div key={row.region} className="grid grid-cols-3 gap-3 rounded-input border border-border p-3">
                  <span className="text-body font-medium text-neutral-900">{row.region}</span>
                  <Input defaultValue={row.hours} aria-label={`${row.region} overlap window`} />
                  <Input defaultValue={row.responseTime} aria-label={`${row.region} response time`} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="social">
            <div className="grid max-w-xl gap-4">
              {["LinkedIn", "Facebook", "Twitter / X", "Instagram"].map((platform) => (
                <div key={platform} className="grid gap-2">
                  <Label htmlFor={`social-${platform}`}>{platform} URL</Label>
                  <Input id={`social-${platform}`} placeholder={`https://...`} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="grid max-w-xl gap-4">
              <ToggleRow
                label="Live Chat Widget"
                description="Show the live chat bubble on the public site."
                checked={liveChatEnabled}
                onCheckedChange={setLiveChatEnabled}
              />
              <ToggleRow
                label="Analytics Tracking"
                description="Enable analytics tracking code sitewide."
                checked={analyticsEnabled}
                onCheckedChange={setAnalyticsEnabled}
              />
              <div className="grid gap-2">
                <Label htmlFor="analytics-id">Analytics Measurement ID</Label>
                <Input id="analytics-id" placeholder="G-XXXXXXXXXX" disabled={!analyticsEnabled} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="grid max-w-xl gap-4">
              <ToggleRow
                label="Cookie Consent Banner"
                description="Show the cookie consent banner to first-time visitors."
                checked={cookieBannerEnabled}
                onCheckedChange={setCookieBannerEnabled}
              />
            </div>
          </TabsContent>
        </Tabs>

        <Button type="submit" className="mt-6">Save Settings</Button>
      </form>
    </>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-input border border-border p-3">
      <div>
        <p className="text-body font-medium text-neutral-900">{label}</p>
        <p className="text-caption text-neutral-600">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </div>
  );
}
