import { cn } from "@/lib/utils";

// Reusable time/space complexity table. `rows` is an array of
// { operation, time, space, note? }. `highlight` marks the active operation.
export function ComplexityTable({ rows, highlight, className }) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-border", className)}>
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Operation</th>
            <th className="px-3 py-2 font-medium">Time</th>
            <th className="px-3 py-2 font-medium">Space</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const active = highlight && row.operation === highlight;
            return (
              <tr
                key={row.operation}
                className={cn(
                  "border-t border-border",
                  active && "bg-muted/60"
                )}
              >
                <td className="px-3 py-2">
                  <span className={cn(active && "font-medium")}>{row.operation}</span>
                  {row.note ? (
                    <span className="block text-xs text-muted-foreground">{row.note}</span>
                  ) : null}
                </td>
                <td className="px-3 py-2 font-mono text-xs">{row.time}</td>
                <td className="px-3 py-2 font-mono text-xs">{row.space}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
