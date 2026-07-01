import { cn } from "@/lib/utils";

export function PageHeader({ eyebrow, title, description, actions, className }) {
  return (
    <div className={cn("flex flex-col gap-3 border-b border-border pb-6", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          {eyebrow ? (
            <span className="text-sm font-medium text-muted-foreground">{eyebrow}</span>
          ) : null}
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {description ? (
        <p className="max-w-2xl text-base text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
