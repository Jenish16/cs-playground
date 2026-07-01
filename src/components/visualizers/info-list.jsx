import { cn } from "@/lib/utils";

// Reusable titled list panel for use cases / mistakes / questions / prompts.
// `items` is an array of strings or { term, detail } objects.
export function InfoList({ title, items, ordered = false, className }) {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {title ? <h3 className="font-heading text-sm font-medium">{title}</h3> : null}
      <ListTag
        className={cn(
          "flex flex-col gap-1.5 text-sm text-muted-foreground",
          ordered ? "list-decimal pl-5" : "list-disc pl-5"
        )}
      >
        {items.map((item, index) => {
          const key = typeof item === "string" ? item : item.term ?? index;
          return (
            <li key={key}>
              {typeof item === "string" ? (
                item
              ) : (
                <>
                  <span className="font-medium text-foreground">{item.term}</span>
                  {item.detail ? ` — ${item.detail}` : null}
                </>
              )}
            </li>
          );
        })}
      </ListTag>
    </div>
  );
}
