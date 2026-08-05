import { contactConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function BusinessHoursTable() {
  return (
    <div className="overflow-hidden rounded-card border border-border shadow-elevated">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-body">
          <caption className="sr-only">Business hours and response times by region</caption>
          <thead className="bg-gradient-to-b from-neutral-100 to-surface">
            <tr>
              <th scope="col" className="px-4 py-3.5 font-heading text-h6 text-primary">Region</th>
              <th scope="col" className="px-4 py-3.5 font-heading text-h6 text-primary">Overlap Window</th>
              <th scope="col" className="px-4 py-3.5 font-heading text-h6 text-primary">Response Time</th>
            </tr>
          </thead>
          <tbody>
            {contactConfig.businessHours.map((row, index) => (
              <tr
                key={row.region}
                className={cn(
                  "transition-colors duration-fast hover:bg-secondary/5",
                  index % 2 === 1 && "bg-surface"
                )}
              >
                <td className="px-4 py-3.5 font-medium text-neutral-900">{row.region}</td>
                <td className="px-4 py-3.5 text-neutral-600">{row.hours}</td>
                <td className="px-4 py-3.5 text-neutral-600">
                  <span className="inline-flex items-center gap-1.5 text-secondary">
                    <span className="size-1.5 rounded-full bg-secondary" aria-hidden="true" />
                    {row.responseTime}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
