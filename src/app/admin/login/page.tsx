"use client";

import * as React from "react";
import { Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

/**
 * Admin Login — the one /admin route that renders outside the
 * (dashboard) sidebar/topbar shell (see the multi-root-layout
 * restructure note in src/app/admin/layout.tsx). Middleware redirects
 * here with a `callbackUrl` when an unauthenticated request hits any
 * other /admin/* route; on success we push back to that URL.
 */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Incorrect email or password.");
      setSubmitting(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm rounded-card border border-border bg-background p-8 shadow-card-hover">
        <div className="flex justify-center">
          <Image src="/images/logo.png" alt="Alvora IT Solution" width={170} height={90} className="h-[36px] w-auto" priority />
        </div>

        <h1 className="mt-6 text-center font-heading text-h4 text-primary">Admin Sign In</h1>
        <p className="mt-1 text-center text-caption text-neutral-600">
          Access the Alvora IT Solution dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant="error" title="Sign-in failed">
              {error}
            </Alert>
          )}

          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Signing In…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
