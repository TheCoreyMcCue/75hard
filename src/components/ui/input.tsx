import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-white placeholder:text-white/30 transition-colors focus-visible:outline-none focus-visible:border-emerald-400/60 focus-visible:bg-white/[0.05] disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
