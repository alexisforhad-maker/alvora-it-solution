export type QuotePipelineStatus = "New" | "Contacted" | "Proposal Sent" | "Won" | "Lost";

export type QuoteRequestRecord = {
  id: string;
  fullName: string;
  company?: string;
  email: string;
  serviceSlugs: string[];
  projectDescription: string;
  timelineExpectation?: string;
  budgetRange?: string;
  submittedAt: string;
  status: QuotePipelineStatus;
};

/**
 * Placeholder Quote Request records for the Admin Dashboard demo.
 * The Request a Quote page's <QuoteRequestForm /> already POSTs to
 * /api/quote-requests — once that route persists submissions to the
 * database, this file is replaced by a real data-fetching call using
 * the same shape.
 */
export const quoteRequests: QuoteRequestRecord[] = [
  {
    id: "quote-1",
    fullName: "Sample Prospect",
    company: "Example Retail Co.",
    email: "prospect@example.com",
    serviceSlugs: ["ecommerce-development", "ui-ux-design"],
    projectDescription: "Looking to rebuild our online storefront with a faster checkout flow.",
    timelineExpectation: "3-4 months",
    budgetRange: "Not specified",
    submittedAt: "2026-07-31",
    status: "New",
  },
  {
    id: "quote-2",
    fullName: "Sample Prospect",
    company: "Example Logistics Group",
    email: "ops@example.com",
    serviceSlugs: ["ai-automation"],
    projectDescription: "Want to automate our shipment status reporting across three tools.",
    timelineExpectation: "Flexible",
    submittedAt: "2026-07-27",
    status: "Contacted",
  },
];
