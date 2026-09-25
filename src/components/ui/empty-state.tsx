import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-paytm/25 bg-lighterblue/60 px-6 py-14 text-center",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-lightblue">
        <Icon className="size-5 text-paytm-secondary" />
      </div>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-inksoft">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
