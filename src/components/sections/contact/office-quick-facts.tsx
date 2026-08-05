import { Clock, Mail, Phone } from "lucide-react";
import { contactConfig } from "@/config/site";

/**
 * Office Quick Facts — sits directly under the map placeholder on the
 * Contact page. Exists mainly to balance the left column's visual
 * height against the contact form in the right column (the map alone
 * left a large empty gap below it), but every row is real, existing
 * data already defined in contactConfig — nothing here is fabricated
 * just to fill space.
 */
export function OfficeQuickFacts() {
  const hq = contactConfig.businessHours.find((b) => b.region.includes("Bangladesh"));

  return (
    <div className="mt-5 rounded-card border border-border bg-background p-5 shadow-elevated">
      <ul className="flex flex-col divide-y divide-border">
        {hq && (
          <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-input bg-secondary/10 text-secondary">
              <Clock className="size-[16px]" aria-hidden="true" />
            </span>
            <div>
              <p className="text-body font-medium text-neutral-900">Headquarters Hours</p>
              <p className="text-caption text-neutral-600">{hq.hours}</p>
            </div>
          </li>
        )}
        <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-input bg-secondary/10 text-secondary">
            <Mail className="size-[16px]" aria-hidden="true" />
          </span>
          <div>
            <p className="text-body font-medium text-neutral-900">Email</p>
            <a
              href={`mailto:${contactConfig.email}`}
              className="break-words text-caption text-neutral-600 transition-colors hover:text-secondary"
            >
              {contactConfig.email}
            </a>
          </div>
        </li>
        <li className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-input bg-secondary/10 text-secondary">
            <Phone className="size-[16px]" aria-hidden="true" />
          </span>
          <div>
            <p className="text-body font-medium text-neutral-900">Phone</p>
            <a
              href={`tel:${contactConfig.phone}`}
              className="text-caption text-neutral-600 transition-colors hover:text-secondary"
            >
              {contactConfig.phone}
            </a>
          </div>
        </li>
      </ul>
    </div>
  );
}
