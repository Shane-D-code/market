import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

/** Friendly sync/error state — never shows raw technical errors. */
export function ErrorState({
  title = "Paytm data hasn't synced yet",
  description = "We'll keep trying automatically. Your numbers will appear the moment sync completes.",
  lastSyncAt,
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  lastSyncAt?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-warn/30 bg-warnsoft/60 px-6 py-12 text-center",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex size-12 items-center justify-center rounded-2xl bg-white">
        <WifiOff className="size-5 text-warn" />
      </div>
      <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-inksoft">{description}</p>
      {lastSyncAt && (
        <p className="mt-2 text-2xs font-semibold text-muted">
          Last successful sync: {lastSyncAt}
        </p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          <RefreshCw className="size-3.5" /> Retry Sync
        </Button>
      )}
    </div>
  );
}
