import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Icon } from "@/components/icon";
import { dsaModule } from "@/lib/dsa-modules";

const modules = [
  {
    ...dsaModule,
    icon: "Binary",
    status: "available",
  },
  {
    slug: "os",
    title: "Operating Systems",
    description: "Scheduling, memory, and concurrency — visualized.",
    icon: "Layers",
    status: "planned",
  },
  {
    slug: "networking",
    title: "Networking",
    description: "Packets, protocols, and routing fundamentals.",
    icon: "Link2",
    status: "planned",
  },
];

export default function Home() {
  return (
    <Container className="flex flex-col gap-16 py-16">
      <section className="flex flex-col items-start gap-6">
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles className="size-3" />
          Learn by interacting
        </Badge>
        <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Computer Science Playground
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          An interactive, beginner-friendly way to understand core computer
          science concepts. Watch and drive visualizations instead of just
          reading about them — starting with Data Structures &amp; Algorithms.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/dsa">
              Explore DSA
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Modules
          </h2>
          <p className="text-muted-foreground">
            More modules are on the way. DSA is available now.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const available = module.status === "available";
            const card = (
              <Card
                aria-disabled={available ? undefined : true}
                className={
                  available
                    ? "h-full transition-all group-hover/module:-translate-y-0.5 group-hover/module:ring-foreground/20"
                    : "h-full opacity-60"
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
                      <Icon name={module.icon} className="size-5" />
                    </span>
                    {available ? null : (
                      <Badge variant="outline">Coming soon</Badge>
                    )}
                  </div>
                  <CardTitle className="mt-3">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            );

            return available ? (
              <Link
                key={module.slug}
                href={module.href}
                className="group/module block focus-visible:outline-none"
              >
                {card}
              </Link>
            ) : (
              <div key={module.slug} className="group/module">
                {card}
              </div>
            );
          })}
        </div>
      </section>
    </Container>
  );
}
