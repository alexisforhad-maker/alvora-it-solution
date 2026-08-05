import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MessageCircle, CalendarClock, MessageSquare } from "lucide-react";
import { buildMetadata, localBusinessJsonLd } from "@/lib/seo";
import { Hero } from "@/components/shared/hero";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ContactCard } from "@/components/shared/contact-card";
import { ContactForm } from "@/components/shared/contact-form";
import { StaggerGrid } from "@/components/animation/stagger-grid";
import { FadeUp } from "@/components/animation/fade-up";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { contactConfig } from "@/config/site";
import { BusinessHoursTable } from "@/components/sections/contact/business-hours-table";
import { MapPlaceholder } from "@/components/sections/contact/map-placeholder";
import { OfficeQuickFacts } from "@/components/sections/contact/office-quick-facts";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Reach Alvora IT Solution however works best for you — book a consultation, request a quote, or contact us by email, phone, or WhatsApp.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />

      <Hero
        eyebrow="Get in Touch"
        title="Let's Talk"
        description="We work with clients across time zones — pick whichever channel is most convenient for you."
      />

      {/* Primary Actions */}
      <SectionWrapper>
        <StaggerGrid className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="group flex flex-col gap-3 p-6">
            <span className="flex size-12 items-center justify-center rounded-input bg-secondary/10 text-secondary transition-all duration-slow ease-premium group-hover:scale-105 group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:shadow-glow">
              <CalendarClock className="size-[24px]" aria-hidden="true" />
            </span>
            <h2 className="font-heading text-h4 text-primary transition-colors duration-slow ease-premium group-hover:text-white">Book a Free Consultation</h2>
            <p className="text-body text-neutral-600">
              Tell us about your project on a Discovery Call — no obligation, just a
              conversation about what you need.
            </p>
            <Button asChild size="lg" className="mt-2 self-start">
              <Link href="/request-a-quote">Book a Consultation</Link>
            </Button>
          </Card>

          <Card className="group flex flex-col gap-3 p-6">
            <span className="flex size-12 items-center justify-center rounded-input bg-white/[0.06] text-primary transition-all duration-slow ease-premium group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-secondary group-hover:to-accent-blue group-hover:text-white group-hover:shadow-glow">
              <MessageSquare className="size-[24px]" aria-hidden="true" />
            </span>
            <h2 className="font-heading text-h4 text-primary transition-colors duration-slow ease-premium group-hover:text-white">Request a Quote</h2>
            <p className="text-body text-neutral-600">
              Already know what you need? Share your project details and we&apos;ll follow up
              with next steps.
            </p>
            <Button asChild variant="secondary" size="lg" className="mt-2 self-start">
              <Link href="/request-a-quote">Request a Quote</Link>
            </Button>
          </Card>
        </StaggerGrid>
      </SectionWrapper>

      {/* Other Channels */}
      <SectionWrapper tint>
        <FadeUp>
          <h2 className="text-h3 font-heading text-primary">Other Ways to Reach Us</h2>
        </FadeUp>
        <StaggerGrid className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard
            icon={Mail}
            channel="Email"
            value={contactConfig.email}
            href={`mailto:${contactConfig.email}`}
            responseTime="Within 1 business day"
          />
          <ContactCard
            icon={Phone}
            channel="Phone"
            value={contactConfig.phone}
            href={`tel:${contactConfig.phone}`}
            responseTime="During business hours"
          />
          <ContactCard
            icon={MessageCircle}
            channel="WhatsApp Business"
            value={contactConfig.whatsapp}
            href={`https://wa.me/${contactConfig.whatsapp.replace(/[^0-9]/g, "")}`}
            responseTime="Same business day"
          />
          <ContactCard
            icon={MessageSquare}
            channel="Live Chat"
            value="Available during business hours"
            responseTime="Offline messages answered next business day"
          />
        </StaggerGrid>
      </SectionWrapper>

      {/* Business Hours */}
      <SectionWrapper>
        <FadeUp>
          <h2 className="text-h3 font-heading text-primary">Business Hours by Region</h2>
          <p className="mt-2 text-body text-neutral-600">
            We&apos;re based in Dhaka, Bangladesh (BDT) — here&apos;s when our working hours
            overlap with yours.
          </p>
        </FadeUp>
        <div className="mt-6">
          <BusinessHoursTable />
        </div>
      </SectionWrapper>

      {/* Office Location + General Contact Form */}
      <SectionWrapper tint>
        <div className="grid gap-[40px] lg:grid-cols-2">
          <FadeUp>
            <h2 className="text-h3 font-heading text-primary">Our Office</h2>
            <p className="mt-2 text-body text-neutral-600">
              {contactConfig.address.line1}, {contactConfig.address.city},{" "}
              {contactConfig.address.country}
            </p>
            <div className="mt-5">
              <MapPlaceholder />
            </div>
            <OfficeQuickFacts />
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2 className="text-h3 font-heading text-primary">Send Us a Message</h2>
            <p className="mt-2 text-body text-neutral-600">
              For anything that doesn&apos;t fit the options above.
            </p>
            <div className="mt-5">
              <ContactForm />
            </div>
          </FadeUp>
        </div>
      </SectionWrapper>
    </>
  );
}
