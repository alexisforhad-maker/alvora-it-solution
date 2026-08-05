/**
 * Admin dashboard loading state — the public (site) group already had
 * one (src/app/(site)/loading.tsx); this was missing for /admin/*
 * routes until the Phase 3I visual QA pass.
 */
export default function AdminLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading">
      <svg
        width="40"
        height="40"
        viewBox="0 0 48 48"
        fill="none"
        className="animate-spin"
        style={{ animationDuration: "1.1s" }}
        aria-hidden="true"
      >
        <path d="M24 4 L40 40 L24 30 L8 40 Z" fill="var(--color-secondary)" opacity="0.85" />
        <path d="M24 4 L32 22 L24 30 Z" fill="var(--color-accent-blue)" />
      </svg>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
