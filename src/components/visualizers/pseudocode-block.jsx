import { cn } from "@/lib/utils";

// Labeled pseudocode block that highlights the active line for the current step.
// `activeLine` is a 0-based index into the lines of `code`; null highlights none.
export function PseudocodeBlock({ label, code, activeLine = null, className }) {
  const lines = code.split("\n");
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border", className)}>
      {label ? (
        <div className="border-b border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
          {label}
        </div>
      ) : null}
      <pre className="overflow-x-auto bg-card p-2 text-xs leading-relaxed">
        <code className="font-mono">
          {lines.map((line, index) => {
            const active = index === activeLine;
            return (
              <span
                key={index}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "block rounded px-1.5 py-0.5 transition-colors",
                  active
                    ? "bg-primary/15 text-foreground ring-1 ring-primary/40"
                    : "text-muted-foreground"
                )}
              >
                {line || " "}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
