"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { services } from "@/config/site";
import { quoteRequestSchema, type QuoteRequestValues } from "@/lib/validations";

const STEP_LABELS = ["Project Type", "Project Details", "Your Info", "Review"] as const;

const STEP_FIELDS: Record<number, (keyof QuoteRequestValues)[]> = {
  0: ["serviceSlugs"],
  1: ["projectDescription", "timelineExpectation", "budgetRange"],
  2: ["fullName", "company", "email", "phone", "preferredContactMethod", "timeZone"],
  3: [],
};

/**
 * Request a Quote — the site's highest-intent conversion point, built
 * as a 4-step form per Phase 2 §15. Each step validates only its own
 * fields before advancing (so a visitor is never blocked by a field
 * they haven't reached yet), and the progress indicator announces
 * "Step X of Y" to screen readers per the accessibility notes.
 */
export function QuoteRequestForm() {
  const [step, setStep] = React.useState(0);
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<QuoteRequestValues>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      serviceSlugs: [],
      preferredContactMethod: "email",
    },
  });

  const selectedServices = watch("serviceSlugs") ?? [];

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(values: QuoteRequestValues) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Alert variant="success" title="Request received">
        Thanks — here&apos;s what happens next: our team reviews your project details and
        reaches out within one business day to schedule your Discovery Call.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-[32px] rounded-card border border-border bg-background p-6 shadow-elevated sm:p-8">
      {/* Progress indicator */}
      <div aria-live="polite" className="flex items-center gap-2 sm:gap-3">
        {STEP_LABELS.map((label, index) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex size-[32px] shrink-0 items-center justify-center rounded-full font-heading text-caption font-semibold transition-all duration-slow ease-premium",
                  index < step && "bg-secondary text-secondary-foreground",
                  index === step && "bg-primary-dark text-white shadow-elevated ring-4 ring-secondary/20",
                  index > step && "bg-neutral-100 text-neutral-600"
                )}
              >
                {index + 1}
              </span>
              <span className="hidden text-caption text-neutral-600 sm:block">{label}</span>
            </div>
            {index < STEP_LABELS.length - 1 && (
              <span
                className={cn(
                  "-mt-6 h-0.5 flex-1 rounded-pill bg-neutral-300 transition-colors duration-slow ease-premium sm:-mt-7",
                  index < step && "bg-secondary"
                )}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        ))}
        <span className="sr-only">
          Step {step + 1} of {STEP_LABELS.length}: {STEP_LABELS[step]}
        </span>
      </div>

      {/* Step 1 — Project Type */}
      {step === 0 && (
        <fieldset className="grid gap-3">
          {/* mb-3 (16px) added on top of the fieldset's own 16px row-gap,
              giving 32px of breathing room below the heading — matching
              the form's own outer step-indicator/content/buttons rhythm
              (grid gap-[32px] on the <form> itself), so this inner
              spacing now reads as part of the same rhythm rather than a
              tighter, separate one. */}
          <legend className="mb-3 font-heading text-h5 text-primary">
            What do you need help with?
          </legend>
          {/* gap-x-3 (16px, unchanged) / gap-y-[24px] (was 16px) — only
              the vertical gap between rows is increased, so the grid
              gets breathing room without widening the gutter between
              the two columns. */}
          <div className="grid gap-x-3 gap-y-[24px] sm:grid-cols-2">
            {services.map((service) => {
              const checked = selectedServices.includes(service.slug);
              return (
                <label
                  key={service.slug}
                  className={cn(
                    // h-full — every card in a given row already stretches
                    // to match the tallest one (default CSS Grid behavior),
                    // this just makes that explicit rather than relying on
                    // it implicitly. p-4 (was p-3) gives the checkbox/text
                    // a bit more room without letting a single card grow
                    // unevenly, since width/height are still fully
                    // governed by the grid track + row-stretch, not by
                    // this element's own content.
                    //
                    // Selection affordance pass (Task 004): duration/
                    // easing brought onto the same duration-slow +
                    // ease-premium convention already used by every
                    // other interactive card sitewide (was duration-fast
                    // with no easing curve, out of step with the rest of
                    // the design system). active:scale gives the same
                    // press feedback the Button component already has.
                    // has-[:focus-visible]: reflects the inner Checkbox's
                    // own keyboard-focus state onto the whole card (via
                    // native CSS :has(), since the checkbox is a
                    // descendant, not a following sibling — peer-* alone
                    // can't reach an ancestor) — previously only the
                    // 20px checkbox itself showed any focus indication.
                    "flex h-full cursor-pointer items-center gap-3 rounded-input border p-4 transition-all duration-slow ease-premium active:scale-[0.99] has-[:focus-visible]:-translate-y-px has-[:focus-visible]:border-secondary has-[:focus-visible]:shadow-card has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-secondary/30",
                    checked
                      ? "border-secondary bg-secondary/5 shadow-card ring-2 ring-secondary/20"
                      : "border-border hover:-translate-y-px hover:border-secondary/60 hover:bg-surface hover:shadow-card"
                  )}
                >
                  <Checkbox
                    // Resting border strengthened for this instance only
                    // (not the shared ui/checkbox.tsx primitive, which
                    // other forms sitewide also use) — the default
                    // --color-border token is barely visible on the dark
                    // background, a real contributor to the card not
                    // reading as interactive.
                    className="border-neutral-300"
                    checked={checked}
                    onCheckedChange={(value) => {
                      const next = value
                        ? [...selectedServices, service.slug]
                        : selectedServices.filter((s) => s !== service.slug);
                      setValue("serviceSlugs", next, { shouldValidate: true });
                    }}
                  />
                  <span className="text-body text-neutral-900">{service.name}</span>
                </label>
              );
            })}
          </div>
          {errors.serviceSlugs && (
            <p role="alert" className="text-caption text-error">
              {errors.serviceSlugs.message}
            </p>
          )}
        </fieldset>
      )}

      {/* Step 2 — Project Details */}
      {step === 1 && (
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="quote-description">Tell us about your project</Label>
            <Textarea
              id="quote-description"
              invalid={!!errors.projectDescription}
              {...register("projectDescription")}
            />
            {errors.projectDescription && (
              <p role="alert" className="text-caption text-error">
                {errors.projectDescription.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote-timeline">Timeline expectation (optional)</Label>
            <Input id="quote-timeline" {...register("timelineExpectation")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote-budget">Approximate budget range (optional)</Label>
            <Input id="quote-budget" {...register("budgetRange")} />
          </div>
        </div>
      )}

      {/* Step 3 — Contact Info */}
      {step === 2 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="quote-fullName">Full Name</Label>
            <Input id="quote-fullName" invalid={!!errors.fullName} {...register("fullName")} />
            {errors.fullName && (
              <p role="alert" className="text-caption text-error">{errors.fullName.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote-company">Company (optional)</Label>
            <Input id="quote-company" {...register("company")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote-email">Email</Label>
            <Input id="quote-email" type="email" invalid={!!errors.email} {...register("email")} />
            {errors.email && (
              <p role="alert" className="text-caption text-error">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote-phone">Phone (optional)</Label>
            <Input id="quote-phone" type="tel" {...register("phone")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quote-timezone">Your Time Zone</Label>
            <Input id="quote-timezone" placeholder="e.g. GMT-5 (New York)" invalid={!!errors.timeZone} {...register("timeZone")} />
            {errors.timeZone && (
              <p role="alert" className="text-caption text-error">{errors.timeZone.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Preferred Contact Method</Label>
            <RadioGroup
              defaultValue="email"
              onValueChange={(v) => setValue("preferredContactMethod", v as QuoteRequestValues["preferredContactMethod"])}
              className="flex flex-wrap gap-6"
            >
              {(["email", "phone", "whatsapp"] as const).map((method) => (
                <label key={method} className="flex items-center gap-2 text-body capitalize text-neutral-900">
                  <RadioGroupItem value={method} id={`contact-method-${method}`} />
                  {method}
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>
      )}

      {/* Step 4 — Review */}
      {step === 3 && (
        <div className="grid gap-4 rounded-card border border-border bg-surface p-5">
          <ReviewRow label="Services" value={getValues("serviceSlugs").join(", ") || "—"} />
          <ReviewRow label="Project" value={getValues("projectDescription")} />
          <ReviewRow label="Contact" value={`${getValues("fullName")} · ${getValues("email")}`} />
          <ReviewRow label="Time Zone" value={getValues("timeZone")} />
        </div>
      )}

      {status === "error" && (
        <Alert variant="error" title="Something went wrong">
          Please try again, or email us directly.
        </Alert>
      )}

      <div className="flex justify-between">
        {step > 0 ? (
          <Button type="button" variant="secondary" onClick={goBack}>
            Back
          </Button>
        ) : (
          <span />
        )}

        {step < STEP_LABELS.length - 1 ? (
          <Button type="button" onClick={goNext}>
            Continue
          </Button>
        ) : (
          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Submitting…" : "Submit Request"}
          </Button>
        )}
      </div>
    </form>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-label uppercase text-neutral-600">{label}</p>
      <p className="text-body text-neutral-900">{value}</p>
    </div>
  );
}
