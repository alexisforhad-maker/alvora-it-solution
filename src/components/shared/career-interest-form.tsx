"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { careerInterestSchema, type CareerInterestValues } from "@/lib/validations";

/**
 * Career Interest Form — the Careers page's primary conversion point
 * (Phase 2 §11 / Phase 3F requirements). Résumé upload is optional at
 * the schema level since a candidate may want to register interest
 * without a file ready; the file itself is handled client-side today
 * and will POST to Cloudinary via an API route in the Backend/CMS
 * phase.
 */
export function CareerInterestForm() {
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CareerInterestValues>({
    resolver: zodResolver(careerInterestSchema),
  });

  async function onSubmit(values: CareerInterestValues) {
    setStatus("submitting");
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => formData.append(key, value ?? ""));
      if (resumeFile) formData.append("resume", resumeFile);

      const res = await fetch("/api/careers/interest", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      reset();
      setResumeFile(null);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Alert variant="success" title="Thanks for your interest">
        We&apos;ll keep your information on file and reach out if a role opens up that matches
        your background.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 rounded-card border border-border bg-background p-6 shadow-elevated sm:p-8">
      <div className="grid gap-2">
        <Label htmlFor="career-fullName">Full Name</Label>
        <Input id="career-fullName" invalid={!!errors.fullName} {...register("fullName")} />
        {errors.fullName && (
          <p role="alert" className="text-caption text-error">{errors.fullName.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="career-email">Email</Label>
        <Input id="career-email" type="email" invalid={!!errors.email} {...register("email")} />
        {errors.email && <p role="alert" className="text-caption text-error">{errors.email.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="career-expertise">Area of Expertise</Label>
        <Input
          id="career-expertise"
          placeholder="e.g. Backend Development, UI/UX Design, QA"
          invalid={!!errors.areaOfExpertise}
          {...register("areaOfExpertise")}
        />
        {errors.areaOfExpertise && (
          <p role="alert" className="text-caption text-error">{errors.areaOfExpertise.message}</p>
        )}
      </div>

      <FileUpload
        id="career-resume"
        label="Résumé / CV (optional)"
        accept=".pdf,.doc,.docx"
        helperText="PDF or Word document, up to 10MB"
        onFileSelect={setResumeFile}
      />

      <div className="grid gap-2">
        <Label htmlFor="career-message">Message (optional)</Label>
        <Textarea id="career-message" {...register("message")} />
      </div>

      {status === "error" && (
        <Alert variant="error" title="Something went wrong">
          Please try again, or email us directly.
        </Alert>
      )}

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "Register Your Interest"}
      </Button>
    </form>
  );
}
