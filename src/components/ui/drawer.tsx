"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-paytm-deep/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-surface shadow-drawer outline-none",
        "data-[state=open]:animate-slide-in",
        className
      )}
      {...props}
    >
      <DialogPrimitive.Title className="sr-only">Details</DialogPrimitive.Title>
      {children}
      <DialogPrimitive.Close
        className="absolute right-4 top-4 rounded-full p-2 text-inksoft transition hover:bg-lightblue hover:text-paytm-deep"
        aria-label="Close"
      >
        <X className="size-4" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DrawerContent.displayName = "DrawerContent";

export { Drawer, DrawerTrigger, DrawerContent, DrawerClose };
