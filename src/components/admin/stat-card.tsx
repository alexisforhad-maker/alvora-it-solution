import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface AdminStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

export function AdminStatCard({ icon: Icon, label, value }: AdminStatCardProps) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-input bg-secondary/10 text-secondary">
        <Icon className="size-[20px]" aria-hidden="true" />
      </span>
      <div>
        <p className="font-heading text-h3 text-primary">{value}</p>
        <p className="text-caption text-neutral-600">{label}</p>
      </div>
    </Card>
  );
}
