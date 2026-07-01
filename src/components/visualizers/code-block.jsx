import { cn } from "@/lib/utils";

// Labeled monospace block for pseudocode or code examples.
export function CodeBlock({ label, code, className }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border", className)}>
      {label ? (
        <div className="border-b border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
          {label}
        </div>
      ) : null}
      <pre className="overflow-x-auto bg-card p-3 text-xs leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
