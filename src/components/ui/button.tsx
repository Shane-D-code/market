"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paytm-secondary/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-paytm text-white shadow-sm hover:bg-[#00a9dc] hover:shadow-md",
        primary:
          "bg-paytm-deep text-white shadow-sm hover:bg-[#003a8c] hover:shadow-md",
        outline:
          "border border-paytm/50 bg-white text-paytm-deep hover:border-paytm hover:bg-lighterblue",
        ghost: "text-inksoft hover:bg-lightblue hover:text-paytm-deep",
        soft: "bg-lightblue text-paytm-deep hover:bg-paytm/15",
        success: "bg-success text-white shadow-sm hover:bg-success/90",
        destructive: "bg-dangersoft text-danger hover:bg-danger hover:text-white",
        link: "text-paytm-secondary underline-offset-4 hover:underline rounded",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
        xs: "h-7 px-3 text-xs",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
