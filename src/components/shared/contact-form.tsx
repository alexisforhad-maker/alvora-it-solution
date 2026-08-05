"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations";

/**
 * Contact Form — the general-inquiry fallback on the Contact page, per
 * Phase 2 §14. Submits to /api/contact (wired up in the Backend/CMS
 * phase); for now this component handles client-side validation and
 * submit state so it can be dropped into the Contact page as-is once
 * that route exists.
 */
export function ContactForm() {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(values: ContactFormValues) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Alert variant="success" title="Message sent">
        Thanks for reaching out — we&apos;ll get back to you via email, typically within one
        business day.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 rounded-card border border-border bg-background p-6 shadow-elevated">
      <div className="grid gap-2">
        <Label htmlFor="contact-fullName">Full Name</Label>
        <Input
          id="contact-fullName"
          invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "contact-fullName-error" : undefined}
          {...register("fullName")}
        />
        {errors.fullName && (
          <p id="contact-fullName-error" role="alert" className="text-caption text-error">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="contact-email-error" role="alert" className="text-caption text-error">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="text-caption text-error">
            {errors.message.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <Alert variant="error" title="Something went wrong">
          Please try again, or email us directly.
        </Alert>
      )}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
