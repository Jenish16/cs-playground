import { cn } from "@/lib/utils";

// Consistent frame every visualizer reuses: a titled canvas area, a controls
// slot, an inline message region, and an optional footer (e.g. complexity notes).
export function VisualizerShell({
  title,
  description,
  controls,
  message,
  footer,
  className,
  children,
}) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      {(title || description) && (
        <div className="flex flex-col gap-1">
          {title ? (
            <h2 className="font-heading text-lg font-semibold">{title}</h2>
          ) : null}
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      )}

      {controls ? (
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-muted/30 p-3">
          {controls}
        </div>
      ) : null}

      <div className="relative flex min-h-64 items-center justify-center overflow-x-auto rounded-xl border border-border bg-card p-6">
        {children}
      </div>

      {message ? (
        <p
          role="status"
          aria-live="polite"
          className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
        >
          {message}
        </p>
      ) : null}

      {footer ? (
        <div className="text-sm text-muted-foreground">{footer}</div>
      ) : null}
    </section>
  );
}
