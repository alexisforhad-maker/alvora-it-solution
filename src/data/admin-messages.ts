export type ContactMessageStatus = "New" | "Replied" | "Archived";

export type ContactMessageRecord = {
  id: string;
  fullName: string;
  email: string;
  message: string;
  channel: "Contact Form" | "Live Chat";
  submittedAt: string;
  status: ContactMessageStatus;
};

/**
 * Placeholder Contact Message records for the Admin Dashboard demo.
 * There is no database yet (Prisma/Postgres wiring is a later phase)
 * — the Contact page's <ContactForm /> already POSTs to /api/contact,
 * and once that route persists submissions, this file is replaced by
 * a real data-fetching call using the same shape.
 */
export const contactMessages: ContactMessageRecord[] = [
  {
    id: "msg-1",
    fullName: "Sample Visitor",
    email: "visitor@example.com",
    message: "Hi, I'd like to learn more about your ERP development services for a mid-size logistics company.",
    channel: "Contact Form",
    submittedAt: "2026-07-30",
    status: "New",
  },
  {
    id: "msg-2",
    fullName: "Sample Visitor",
    email: "another-visitor@example.com",
    message: "Do you offer ongoing maintenance plans after a project is delivered?",
    channel: "Live Chat",
    submittedAt: "2026-07-28",
    status: "Replied",
  },
];
