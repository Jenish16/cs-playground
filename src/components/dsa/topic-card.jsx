import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

function TopicCardBody({ topic, available }) {
  return (
    <Card
      aria-disabled={available ? undefined : true}
      className={cn(
        "h-full transition-all",
        available
          ? "group-hover/topic:-translate-y-0.5 group-hover/topic:ring-foreground/20"
          : "opacity-60"
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
            <Icon name={topic.icon} className="size-5" />
          </span>
          <Badge variant={available ? "secondary" : "outline"}>
            {available ? topic.difficulty : "Coming soon"}
          </Badge>
        </div>
        <CardTitle className="mt-3 flex items-center gap-1">
          {topic.title}
          {available ? (
            <ArrowRight className="size-4 opacity-0 transition-opacity group-hover/topic:opacity-100" />
          ) : null}
        </CardTitle>
        <CardDescription>{topic.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <span className="text-xs text-muted-foreground">{topic.difficulty}</span>
      </CardContent>
    </Card>
  );
}

export function TopicCard({ topic }) {
  const available = topic.status === "available";

  if (!available) {
    return (
      <div className="group/topic">
        <TopicCardBody topic={topic} available={false} />
      </div>
    );
  }

  return (
    <Link href={topic.href} className="group/topic block focus-visible:outline-none">
      <TopicCardBody topic={topic} available />
    </Link>
  );
}
