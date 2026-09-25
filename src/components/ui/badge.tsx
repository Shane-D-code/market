import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-2xs font-semibold tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-lightblue text-paytm-deep",
        outline: "border border-line bg-white text-inksoft",
        solid: "bg-paytm-deep text-white",
        blue: "bg-paytm text-white",
        danger: "bg-dangersoft text-danger",
        success: "bg-successsoft text-success",
        warn: "bg-warnsoft text-warn",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
