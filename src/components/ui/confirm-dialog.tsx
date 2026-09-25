"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ShieldQuestion } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  tone = "default",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  tone?: "default" | "danger";
}) {
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!open) setDone(false);
  }, [open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-paytm-deep/50 backdrop-blur-[2px]" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-2xl border border-line bg-white p-6 shadow-pop outline-none"
          )}
        >
          <DialogPrimitive.Title className="text-lg font-bold text-ink">
            {done ? "Done" : title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-2 text-sm text-inksoft">
            {done
              ? "HISAAB recorded your decision. Outcomes will be measured automatically."
              : description}
          </DialogPrimitive.Description>
          <div className="mt-6 flex justify-end gap-2">
            {done ? (
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  variant={tone === "danger" ? "destructive" : "default"}
                  onClick={() => {
                    onConfirm();
                    setDone(true);
                  }}
                >
                  {confirmLabel}
                </Button>
              </>
            )}
          </div>
          {!done && (
            <ShieldQuestion className="absolute right-5 top-5 size-5 text-paytm/40" />
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
