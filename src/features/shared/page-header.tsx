import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  right,
  className,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-end justify-between gap-4",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink lg:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-sm text-inksoft">{subtitle}</p>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}
