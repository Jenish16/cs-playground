import Link from "next/link";

import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { LinearStructureVisualizer } from "@/components/dsa/linear-structure-visualizer";
import { ComplexityTable } from "@/components/visualizers/complexity-table";
import { InfoList } from "@/components/visualizers/info-list";
import { Button } from "@/components/ui/button";
import { getDsaTopic } from "@/lib/dsa-modules";
import {
  concept,
  representation,
  complexityRows,
  spaceNote,
  backendUseCases,
  commonMistakes,
  interviewQuestions,
  practicePrompts,
} from "@/lib/dsa/queue-content";

const topic = getDsaTopic("queue");

export const metadata = {
  title: topic.title,
  description: topic.shortDescription,
};

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export default function QueueTopicPage() {
  return (
    <Container className="flex flex-col gap-10 py-12">
      <PageHeader
        eyebrow="DSA · Queue"
        title={topic.title}
        description="FIFO: enqueue at the rear, dequeue from the front — and where backend systems rely on it."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/dsa">← All topics</Link>
          </Button>
        }
      />

      <Section title="Concept">
        <p className="max-w-3xl text-sm text-muted-foreground">{concept}</p>
      </Section>

      <Section title="How it's stored">
        <p className="max-w-3xl text-sm text-muted-foreground">{representation}</p>
      </Section>

      <Section title="Try it">
        <LinearStructureVisualizer kind="queue" />
      </Section>

      <Section title="Complexity at a glance">
        <div className="flex flex-col gap-2">
          <ComplexityTable rows={complexityRows} />
          <p className="text-xs text-muted-foreground">{spaceNote}</p>
        </div>
      </Section>

      <Section title="Where it shows up in backend systems">
        <InfoList items={backendUseCases} />
      </Section>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section title="Common mistakes">
          <InfoList items={commonMistakes} />
        </Section>
        <Section title="Interview questions">
          <InfoList items={interviewQuestions} ordered />
        </Section>
      </div>

      <Section title="Practice">
        <InfoList items={practicePrompts} ordered />
      </Section>
    </Container>
  );
}
