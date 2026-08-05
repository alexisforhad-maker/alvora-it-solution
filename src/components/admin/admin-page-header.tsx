import type { ReactNode } from "react";

export interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Admin Page Header — consistent title/description/primary-action
 * pattern reused at the top of every module (Services Manager, Blog
 * Manager, etc.), per Design System §13 (Consistency).
 */
export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-heading text-h3 text-primary">{title}</h2>
        {description && <p className="mt-1 text-body text-neutral-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}
