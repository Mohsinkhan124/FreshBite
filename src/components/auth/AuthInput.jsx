import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const AuthInput = forwardRef(function AuthInput({ className, error, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border bg-cream-50 px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:bg-white focus:ring-4",
        error
          ? "border-danger focus:border-danger focus:ring-danger/10"
          : "border-cream-300 focus:border-brand-400 focus:ring-brand-100",
        className,
      )}
      {...props}
    />
  );
});

export default AuthInput;
