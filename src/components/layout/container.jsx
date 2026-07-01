import { cn } from "@/lib/utils";

export function Container({ className, as: Comp = "div", ...props }) {
  return (
    <Comp
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}
