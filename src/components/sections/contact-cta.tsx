import Link from "next/link";
import { Mail, Phone, MessageCircle, CalendarClock } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ContactCard } from "@/components/shared/contact-card";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";
import { Button } from "@/components/ui/button";
import { contactConfig } from "@/config/site";

/**
 * Contact CTA — Homepage §14 per Phase 2 spec. Sits just before the
 * footer, giving visitors every channel option at the moment they've
 * decided to reach out, funneling toward the full Contact page for
 * business hours/time zone detail.
 */
export function ContactCTA() {
  return (
    <SectionWrapper id="contact">
      <FadeUp className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-h6 text-secondary">Get in Touch</p>
        <h2 className="mt-3 text-h2-mobile font-heading text-primary md:text-h2">
          However You Prefer to Reach Us
        </h2>
      </FadeUp>

      <StaggerGrid className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ContactCard icon={CalendarClock} channel="Book a Consultation" value="Pick a time that works for you" href="/request-a-quote" />
        <ContactCard icon={Mail} channel="Email" value={contactConfig.email} href={`mailto:${contactConfig.email}`} />
        <ContactCard icon={Phone} channel="Phone" value={contactConfig.phone} href={`tel:${contactConfig.phone}`} />
        <ContactCard icon={MessageCircle} channel="WhatsApp Business" value={contactConfig.whatsapp} href={`https://wa.me/${contactConfig.whatsapp.replace(/[^0-9]/g, "")}`} />
      </StaggerGrid>

      <div className="mt-8 flex justify-center">
        <Button asChild size="lg">
          <Link href="/contact">See Full Contact Details</Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}
