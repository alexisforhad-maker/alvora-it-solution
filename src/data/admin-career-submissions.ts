export type CareerSubmissionStatus = "New" | "Reviewed";

export type CareerSubmissionRecord = {
  id: string;
  fullName: string;
  email: string;
  areaOfExpertise: string;
  resumeFileName?: string;
  submittedAt: string;
  status: CareerSubmissionStatus;
};

/**
 * Placeholder Career Interest submissions for the Admin Dashboard
 * demo. The Careers page's <CareerInterestForm /> already POSTs to
 * /api/careers/interest — once that route persists submissions, this
 * file is replaced by a real data-fetching call using the same shape.
 */
export const careerSubmissions: CareerSubmissionRecord[] = [
  {
    id: "sub-1",
    fullName: "Sample Candidate",
    email: "candidate@example.com",
    areaOfExpertise: "Backend Development",
    resumeFileName: "resume.pdf",
    submittedAt: "2026-07-25",
    status: "New",
  },
];
